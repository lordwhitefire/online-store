# WebForge OpenCode Integration — Implementation Guide

## What This Is

This package contains everything needed to integrate WebForge into OpenCode.
OpenCode will read these files and become the WebForge agent organization.

## What's In This Package

```
webforge-opencode/
  agents/               ← 284 agent markdown files (one per agent, except CEO)
    hermes.md            ← The primary agent (you talk to him)
    hephaestus.md        ← Build Director
    athena.md            ← Intelligence Director
    minos.md             ← Quality Director
    thoth.md             ← Documentation Director
    voss.md              ← HR Director
    daedalus.md          ← Meta Engineering Director
    aurora.md            ← Frontend Lead
    titan.md             ← Backend Lead
    zephyr.md            ← DB/Infra Lead
    sr-hale.md           ← Senior Developer
    jr-hawk.md           ← Junior Developer (writes code)
    ... (274 more)
  tools/                 ← Custom tools (TypeScript)
    mailbox.ts           ← Agent-to-agent messaging (chain of command enforced)
    memory.ts            ← Project memory read/write (Law 2 + Law 6)
    registry.ts          ← Look up agent info and relationships
    status.ts            ← Report status to superior (watchdog pattern)
  opencode.json          ← Makes Hermes the default agent, hides built-in agents
```

## How Agent Files Work

Each agent file has two parts:

### 1. YAML Frontmatter (permissions and config)

```yaml
---
description: "Build Director — Build department"
mode: subagent           ← subagent = can be called by other agents
color: "#10b981"         ← Department color
steps: 10                ← Max LLM iterations before stopping
hidden: false            ← false = visible in agent list
permission:              ← What this agent CAN and CANNOT do
  read: allow             ← Can read files
  edit: deny              ← Cannot edit files (directors don't code)
  bash: deny              ← Cannot run commands
  task: allow             ← CAN delegate to subagents
  websearch: deny         ← Cannot search the web
  question: allow         ← Can ask the user questions
  skill: allow            ← Can load skills
---
```

### 2. System Prompt (the skill .md content)

The body of the file IS the system prompt. OpenCode reads this and
the AI becomes that character. It knows its name, its job, its boss,
its subordinates, what it should do, and what it should NOT do.

## How Permissions Work

Permissions are the core of WebForge. Each agent type gets different tools:

| Agent Type | read | edit | bash | task | websearch | What they do |
|---|---|---|---|---|---|---|
| Directors (Hermes, Hephaestus, etc.) | ✅ | ❌ | ❌ | ✅ | ❌ | Coordinate, delegate |
| Leads (Aurora, Titan, etc.) | ✅ | ❌ | ❌ | ✅ | ❌ | Manage teams |
| Intelligence (Probe, Odin) | ✅ | ❌ | ❌ | ❌ | ✅ | Research only |
| Juniors (Jr-Hawk, etc.) | ✅ | ✅ | ✅ | ❌ | ❌ | Write code (only ones who can) |
| Quality (Verdict, Scalpel) | ✅ | ❌ | ✅ | ❌ | ❌ | Test, review (no editing) |
| Documentation (Quill, etc.) | ✅ | ✅ | ❌ | ❌ | ❌ | Write docs only |
| HR (Rook, Weld) | ✅ | ❌ | ❌ | ❌ | ❌ | Manage registry |

The key insight: you restrict AI by REMOVING TOOLS, not by writing rules.
If an agent doesn't have the `edit` tool, it literally cannot edit files.
No prompt can override this — the tool simply isn't available.

## How Delegation Works

OpenCode's built-in `task` tool lets one agent spawn another as a subagent.

When Hermes calls:
```
task({ subagent_type: "hephaestus", prompt: "Build a login page" })
```

OpenCode:
1. Loads the `hephaestus.md` agent file
2. Creates a child session with Hephaestus's permissions
3. Hephaestus runs his own LLM loop with his own tools
4. When Hephaestus is done, the result comes back to Hermes
5. Hermes continues

This IS the synchronous delegation chain. Results bubble back up.

## How the Chain of Command Is Enforced

Two layers:

**Layer 1: Tool availability (hard enforcement)**
- Only directors and leads have `task: allow` (can delegate)
- Juniors have `task: deny` (cannot delegate — they're the bottom)
- An agent can only spawn subagents that have agent files in `.opencode/agents/`

**Layer 2: Mailbox tool (soft enforcement)**
- The `mailbox.ts` tool checks the registry before sending
- If an agent tries to message someone outside their chain → BLOCKED
- Example: Jr-Hawk cannot message Hermes directly

## Step-by-Step Integration Instructions

### Step 1: Copy the files

Copy the entire `webforge-opencode/` folder into your project:

```bash
# From your project root:
cp -r webforge-opencode/. .opencode/
```

This puts:
- `agents/` → `.opencode/agents/` (284 agent files)
- `tools/` → `.opencode/tools/` (4 custom tools)
- `opencode.json` → `.opencode/opencode.json`

### Step 2: Copy the agents.json registry

The custom tools need the agent registry to enforce the chain of command.
Copy it from WebForge Office:

```bash
mkdir -p .webforge
cp src/lib/agent-runtime/agents.json .webforge/agents.json
```

### Step 3: Copy the skill files (if not already in agent files)

The agent markdown files already contain the skill content as their system prompt.
You do NOT need to copy skill files separately — they're embedded.

### Step 4: Configure OpenCode

The `opencode.json` file does two things:
1. Makes Hermes the default agent (you talk to Hermes, not OpenCode's "build" agent)
2. Disables OpenCode's built-in "build" and "plan" agents

If you want to keep OpenCode's built-in agents, remove the `agents` section from `opencode.json`.

### Step 5: Start OpenCode

```bash
opencode
```

You should see Hermes as the default agent. Type a message:
```
Build a login page
```

Hermes will:
1. Think about the request (using whatever model OpenCode is configured with)
2. Call the `task` tool to delegate to Hephaestus
3. Hephaestus will delegate to Aurora or Titan
4. The chain continues down to a Junior
5. The Junior writes the code (they're the only one with `edit` and `bash`)
6. Results bubble back up to Hermes
7. Hermes tells you it's done

### Step 6: Verify the chain

Watch the terminal. You should see:
```
[hermes] Running...
[hermes] Calling task tool: delegate to hephaestus
  [hephaestus] Running...
  [hephaestus] Calling task tool: delegate to aurora
    [aurora] Running...
    [aurora] Calling task tool: delegate to lead-faro
      ...
```

If an agent tries to do something it doesn't have permission for,
OpenCode will block it — the tool simply isn't available.

## Model Configuration

This integration does NOT force any specific model. OpenCode uses whatever
model you have configured. You can use:
- DeepSeek (via OpenRouter)
- GLM (via Z.ai)
- Claude
- GPT
- Any model OpenCode supports

To set the model, use OpenCode's normal configuration:
```bash
opencode --model deepseek/deepseek-v4-flash
```

Or set it in `opencode.json`:
```json
{
  "default_agent": "hermes",
  "model": "deepseek/deepseek-v4-flash"
}
```

Or leave it unset and OpenCode will use its default.

## The 6 Laws

### How each law is enforced:

**Law 1: Task size limit**
- Not yet automated in this package
- Future: a custom `safe_task` tool that checks file count before creating

**Law 2: 300-line rule**
- ENFORCED in `memory.ts` — the write action checks line count
- Future: a custom `safe_edit` tool that checks file length

**Law 3: Real-time documentation**
- ENFORCED in `memory.ts` — every write is logged
- The `status.ts` tool also logs status changes

**Law 4: Chain of command**
- ENFORCED in `mailbox.ts` — checks registry before sending
- ENFORCED via tool availability — only directors/leads have `task: allow`

**Law 5: No inference**
- PARTIALLY ENFORCED — the system prompt tells agents not to infer
- Future: a Flagger tool that scans outputs for inference patterns
- Future: a Reviewer agent that reads flags and decides

**Law 6: Documentation**
- ENFORCED in `memory.ts` and `status.ts` — all actions are logged

## Adding More Custom Tools

To add a new tool:

1. Create a TypeScript file in `.opencode/tools/`
2. Use this format:

```typescript
export default {
  description: "What this tool does",
  args: {
    param1: { type: "string", description: "Parameter description" },
  },
  async execute(args, context) {
    // context.agent = the agent calling this tool
    // Do your work here
    return "Result"
  },
}
```

3. Restart OpenCode — the tool is automatically loaded
4. Add the tool name to agent permissions in their YAML frontmatter

## Adding More Agents

To add a new agent:

1. Create a markdown file in `.opencode/agents/<name>.md`
2. Add YAML frontmatter with permissions
3. Add the system prompt as the body
4. Add the agent to `.webforge/agents.json` (for chain of command)
5. Restart OpenCode

## Source

All files in this package were generated from:
- **WebForge Office** (https://github.com/lordwhitefire/webforge-office)
  - `src/lib/agent-runtime/agents.json` — agent registry (285 agents)
  - `src/skills/` — 285 skill .md files (system prompts)
  - Agent hierarchy, permissions, and chain of command

## References

- OpenCode agent docs: https://opencode.ai/docs/agents
- OpenCode config docs: https://opencode.ai/docs/config
- OpenCode ecosystem: https://opencode.ai/docs/ecosystem
- OpenCode source: https://github.com/lordwhitefire/opencode
