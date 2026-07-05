/**
 * WebForge Agent Runtime — the core LLM loop.
 *
 * This is the engine that EVERY agent uses. The only differences between
 * agents are:
 *   - systemPrompt → loaded from their skill .md file
 *   - tools → different sets per department/role
 *   - permissions → different rules per agent
 *   - model → DeepSeek vs GLM
 *
 * The loop (same as OpenCode):
 *   1. Load system prompt (skill file)
 *   2. Load conversation history
 *   3. Call LLM with: system + history + available tools
 *   4. LLM responds: speaks naturally OR calls a tool
 *   5. If tool called: check permissions → execute → feed result back → loop
 *   6. If done: return result
 *
 * Uses Vercel AI SDK's streamText with maxSteps for the loop.
 */

import { generateText, tool, jsonSchema, type Tool, type CoreMessage, isStepCount } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { getAgentTools } from "./tool-registry";
import { checkPermission, type AgentConfig } from "./permissions";
import { loadAgentConfig } from "./agent-config";

const WEBFORGE_HOME = join(homedir(), "webforge");
const SKILLS_DIR = join(WEBFORGE_HOME, "skills");

// ── Model providers ──

function getApiKey(): string {
  // Check env var
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  // Check .env file
  try {
    const envPath = join(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      if (line.startsWith("DEEPSEEK_API_KEY=")) {
        return line.split("=")[1].trim();
      }
    }
  } catch {}
  return "";
}

function getProvider(model: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not set. Add it to .env or environment.");
  }
  const openrouter = createOpenRouter({ apiKey });
  // For now, all models go through OpenRouter
  // DeepSeek v4 Flash for code tasks, GLM could be added later
  return openrouter("deepseek/deepseek-v4-flash");
}

// ── The runtime loop ──

export interface RuntimeResult {
  text: string;
  toolCalls: Array<{ name: string; input: unknown; result: unknown }>;
  model: string;
  steps: number;
}

export interface RuntimeOptions {
  agentName: string;
  message: string;
  history?: CoreMessage[];
  maxSteps?: number;
  taskId?: string;
  runId?: string;
}

/**
 * Run an agent's runtime loop.
 *
 * This is THE function that powers every agent in WebForge.
 * Hermes, Hephaestus, Jr-Hawk — they all call this.
 */
export async function runAgent(options: RuntimeOptions): Promise<RuntimeResult> {
  const { agentName, message, history = [], maxSteps = 10, taskId, runId } = options;

  // 1. Load agent configuration (skill file, tools, permissions, model)
  const config = await loadAgentConfig(agentName);
  console.log(`[Runtime] ${agentName} loaded: model=${config.model}, tools=${config.tools.length}`);

  // 2. Load system prompt from skill file
  const systemPrompt = loadSkillFile(config.skillFile);
  const toolHint = buildToolHint(config);
  const fullSystemPrompt = systemPrompt + "\n\n" + toolHint;
  console.log(`[Runtime] ${agentName} system prompt: ${fullSystemPrompt.length} chars`);

  // 3. Build tools (filtered by agent's tool list + permissions)
  const tools = await buildTools(config, taskId, runId);
  console.log(`[Runtime] ${agentName} tools: ${Object.keys(tools).join(", ")}`);

  // 4. Build messages
  const messages: CoreMessage[] = [
    ...history,
    { role: "user" as const, content: message },
  ];

  // 5. Call LLM with the loop (using generateText for synchronous multi-step)
  const provider = getProvider(config.model);
  const toolCalls: Array<{ name: string; input: unknown; result: unknown }> = [];

  const result = await generateText({
    model: provider,
    system: fullSystemPrompt,
    messages,
    tools,
    stopWhen: isStepCount(maxSteps),
    temperature: 0.7,
    maxOutputTokens: 4096,
    prepareStep: async ({ steps }) => {
      const completedSteps = steps.length;
      console.log(`[Runtime] ${agentName} prepareStep: ${completedSteps} completed`);
      if (completedSteps < 3) {
        return { toolChoice: "required" as const };
      }
      return { toolChoice: "auto" as const };
    },
    onStepFinish: (event) => {
      console.log(`[Runtime] ${agentName} step finished: ${event.toolCalls?.length || 0} tool calls, text=${event.text?.slice(0, 50) || "(none)"}`);
      if (event.toolCalls) {
        for (const tc of event.toolCalls) {
          toolCalls.push({ name: tc.toolName, input: tc.input, result: null });
        }
      }
      if (event.toolResults) {
        for (let i = 0; i < event.toolResults.length; i++) {
          const tr = event.toolResults[i];
          const idx = toolCalls.length - event.toolResults.length + i;
          if (idx >= 0 && idx < toolCalls.length) {
            toolCalls[idx].result = tr.output;
          }
        }
      }
    },
  });

  // 6. Get final text
  const text = result.text;
  const stepCount = result.steps?.length || toolCalls.length;

  console.log(`[Runtime] ${agentName} completed: ${stepCount} steps, ${toolCalls.length} tool calls`);

  return {
    text,
    toolCalls,
    model: config.model,
    steps: stepCount,
  };
}

// ── Skill file loader ──

function loadSkillFile(skillFile: string): string {
  if (!skillFile) {
    return "You are a WebForge agent. Follow the laws and do your job.";
  }
  const path = join(SKILLS_DIR, skillFile);
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return `You are a WebForge agent. Your skill file (${skillFile}) was not found.`;
  }
}

// ── Tool hint builder ──
//
// Tells the LLM what tools it has and how to use them.
// This is added to the system prompt so the LLM knows its capabilities.

function buildToolHint(config: AgentConfig): string {
  const lines: string[] = [];
  lines.push("## Available Tools");
  lines.push("You have the following tools available. Call them when needed:");
  lines.push("");

  for (const toolName of config.tools) {
    const desc = TOOL_DESCRIPTIONS[toolName] || toolName;
    lines.push(`- **${toolName}**: ${desc}`);
  }

  if (config.roleTier === "director" || config.roleTier === "lead") {
    lines.push("");
    lines.push("## Delegation");
    lines.push("You have a `task.delegate` tool. Use it to assign work to your subordinates.");
    lines.push(`Your direct subordinates: ${config.subordinates.join(", ")}`);
    lines.push("When you create a task, also delegate it to the right subordinate using task.delegate.");
    lines.push("The subordinate will run their own agent runtime and return a result.");
  }

  lines.push("");
  lines.push("## Important — Tool Loop");
  lines.push("- When you call a tool, the result is fed back to you automatically.");
  lines.push("- You can call multiple tools in sequence — DON'T stop after one tool call.");
  lines.push("- After each tool result, ask yourself: 'Is there more I need to do?'");
  lines.push("- If yes, call the next tool. If no, give your final response.");
  lines.push("- Example: create a task → then delegate it → then respond to the user.");

  return lines.join("\n");
}

const TOOL_DESCRIPTIONS: Record<string, string> = {
  "task.create": "Create a new task on the Kanban board",
  "task.list": "List tasks on the board (optionally filtered by status)",
  "task.show": "Show details of a specific task",
  "task.delegate": "Delegate a task to a subordinate agent — they will run their own runtime and return a result",
  "mailbox.send": "Send a message to another agent (must be your direct superior or subordinate)",
  "mailbox.read": "Read your inbox — list unread messages addressed to you",
  "file.read": "Read a file from the project",
  "file.write": "Write content to a file in the project",
  "git.commit": "Commit changes to git",
};

// ── Tool builder ──

async function buildTools(
  config: AgentConfig,
  taskId?: string,
  runId?: string,
): Promise<Record<string, Tool>> {
  const allTools = getAgentTools(config, taskId, runId);
  const filtered: Record<string, Tool> = {};

  for (const [name, tool] of Object.entries(allTools)) {
    // Check permission: is this tool allowed for this agent?
    const allowed = checkPermission(config, name);
    if (allowed) {
      filtered[name] = tool;
    } else {
      console.log(`[Runtime] Permission denied: ${config.name} cannot use ${name}`);
    }
  }

  // Add task.delegate tool for directors and leads (built here to access runAgent)
  if (config.roleTier === "director" || config.roleTier === "lead") {
    filtered["task.delegate"] = createDelegateTool(config);
  }

  return filtered;
}

// ── task.delegate tool ──
//
// Follows OpenCode's task tool pattern (packages/opencode/src/tool/task.ts):
//   1. Takes description, prompt, subagent_type
//   2. Looks up the subagent config
//   3. Checks that subagent_type is a direct subordinate (chain of command)
//   4. Runs the subagent's runtime (recursive runAgent call)
//   5. Returns the result wrapped in <task> tags
//
// The subagent inherits a restricted permission set:
//   - Parent's deny rules still apply
//   - Subagent cannot spawn its own subagents unless it's a director/lead

function createDelegateTool(parentConfig: AgentConfig): Tool {
  return tool({
    description:
      "Delegate a task to a subordinate agent. The subordinate runs in the background " +
      "and you will be notified when done. Use this to assign work down the chain of command. " +
      "The subordinate must be one of your direct subordinates.",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        subagent: {
          type: "string",
          description: "The name of the subordinate agent to delegate to",
        },
        description: {
          type: "string",
          description: "A short (3-5 words) description of the task",
        },
        prompt: {
          type: "string",
          description: "The task prompt for the subordinate agent",
        },
        taskId: {
          type: "string",
          description: "The task ID being delegated (optional)",
        },
      },
      required: ["subagent", "description", "prompt"],
    }),
    execute: async (input: { subagent: string; description: string; prompt: string; taskId?: string }) => {
      const subagentName = input.subagent;

      // Chain-of-command check
      if (!parentConfig.subordinates.includes(subagentName)) {
        return {
          ok: false,
          error: `CHAIN VIOLATION: ${parentConfig.name} cannot delegate to ${subagentName}. ` +
                 `Direct subordinates: ${parentConfig.subordinates.join(", ")}`,
        };
      }

      console.log(`[Runtime] ${parentConfig.name} → ${subagentName}: ${input.description}`);

      // Run subordinate ASYNCHRONOUSLY (fire and forget)
      // The parent agent gets an immediate response and can continue
      const subagentPromise = runAgent({
        agentName: subagentName,
        message: input.prompt,
        maxSteps: 3, // subagents get fewer steps
        taskId: input.taskId,
      }).then(result => {
        console.log(`[Runtime] ${subagentName} completed: ${result.toolCalls.length} tool calls`);
        return result;
      }).catch(e => {
        console.error(`[Runtime] ${subagentName} failed:`, e);
        return null;
      });

      // Store the promise so we can await it later if needed
      _pendingDelegations.set(`${parentConfig.name}-${subagentName}-${Date.now()}`, subagentPromise);

      return {
        ok: true,
        message: `Delegated to @${subagentName}. They are working on it in the background.`,
        agent: subagentName,
        description: input.description,
      };
    },
  });
}

// Track pending delegations (for testing/debugging)
const _pendingDelegations = new Map<string, Promise<RuntimeResult | null>>();
