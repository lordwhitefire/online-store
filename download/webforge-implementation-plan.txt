# WebForge Implementation Plan
## The Complete System — Built on OpenCode

---

## What We're Building

An autonomous agent system that lives inside OpenCode. You give it a goal, it recruits agents, divides work, builds everything, and reports back — without you being present for every step.

### The 5 Pillars

| Pillar | What It Is | Battle-Tested Source |
|---|---|---|
| **Agents** | Markdown files (system prompt + permissions + steps:35) | ankitmundada + jbeck018 repos |
| **Recruiting** | HR creates agent files on demand from repo templates | AgentSpawn pattern |
| **Loop** | Ralph Loop — wrapper re-launches Hermes until plan is done | oh-my-openagent / open-ralph-wiggum |
| **Worktree** | Each agent works in isolated git worktree | opencode-worktree plugin |
| **Skills** | Loaded on-demand by agents at runtime | Vercel/Gentleman/FrancoStino repos |

---

## Phase 1: Permanent Agents (2 files)

These are the ONLY agents that exist before a project starts.

### Agent 1: Hermes (the coordinator)

File: `~/.config/opencode/agents/hermes.md`

```markdown
---
description: "WebForge COO — receives tasks from CEO, delegates to recruited agents"
mode: primary
steps: 35
permission:
  read: allow
  edit: allow
  bash: allow
  task: allow
  websearch: allow
  webfetch: allow
  glob: allow
  grep: allow
  list: allow
  todowrite: allow
  question: allow
  skill: allow
---

# WebForge Identity
You are Hermes, the COO of WebForge. The CEO (the user) gives you goals.
You do NOT do the work yourself. You analyze, delegate, and verify.

## Your Job
1. Read the plan file at .webforge/plan.md (create it if it doesn't exist)
2. Check what's done vs what's left
3. If you can finish a task in your 35 tool calls — do it
4. If you can't — recruit agents by asking Voss (HR)
5. Delegate to recruited agents using the task tool
6. Collect their results
7. Update .webforge/plan.md with what's done
8. If everything is done, say "PROJECT COMPLETE"
9. If work remains, say "CONTINUE NEEDED: [what's left]"

## Rules
- You CANNOT write code yourself (delegate to build agents)
- You CANNOT research yourself (delegate to intelligence agents)
- You CAN read files, create tasks, delegate, and verify
- You have 35 tool calls per session — use them wisely
- If an agent fails, recruit another one
- Everything is SEQUENTIAL — one agent at a time

## When to Recruit
- Different areas + too much work = divide (create new agents)
- Same area + too much context = spawn copies (parallel workers)
- Small task = do it yourself or give to one agent

## The 35-Call Rule
Every agent has 35 tool calls. If an agent can't finish in 35 calls:
- It will summarize what's left (OpenCode does this automatically)
- You read the summary
- You recruit another agent to continue
- The plan file tracks where things are

# Battle-Tested Expertise
[Contents of multi-agent-coordinator.md from ankitmundada repo]
[Contents of task-distributor.md from ankitmundada repo]
[Contents of workflow-orchestrator.md from ankitmundada repo]
[Contents of task-router.md from ankitmundada repo]
```

### Agent 2: Voss (HR — the recruiter)

File: `~/.config/opencode/agents/voss.md`

```markdown
---
description: "WebForge HR — recruits and creates agents on demand"
mode: subagent
steps: 35
permission:
  read: allow
  edit: allow
  bash: allow
  task: deny
  websearch: deny
  glob: allow
  grep: allow
  list: allow
  todowrite: deny
  question: allow
  skill: allow
---

# WebForge Identity
You are Voss, the HR Director. Your ONLY job is to recruit agents.

When Hermes tells you what kind of agent he needs:
1. Pick a name (use the registry at .webforge/registry.json for familiar names)
2. Find the right agent MD file from the repo library at .webforge/repo-agents/
3. Use the create_agent tool to write a new agent file to .opencode/agents/
4. Report back to Hermes with the agent name

## What goes into a recruited agent file
- YAML frontmatter: permissions (based on role), steps: 35, mode: subagent
- Custom system prompt: identity, who they report to, what their job is
- Battle-tested agent MD files from the repo library (concatenated)

## Agent Types and Permissions
- Coordinator/Lead: read=allow, edit=deny, bash=deny, task=allow (can delegate)
- Build worker: read=allow, edit=allow, bash=allow, task=deny (writes code)
- Researcher: read=allow, edit=deny, bash=deny, task=allow, websearch=allow
- Quality: read=allow, edit=deny, bash=allow, task=deny (tests only)
- Documentation: read=allow, edit=allow, bash=deny, task=deny (docs only)

## Rules
- You do NOT do project work
- You do NOT delegate
- You ONLY create agent files
- One agent can combine multiple repo MD files (e.g., frontend-developer + react-specialist + typescript-pro)
- All recruited agents get steps: 35

# Battle-Tested Expertise
[Contents of hr-pro.md from ankitmundada repo]
[Contents of agent-installer.md from ankitmundada repo]
[Contents of agent-organizer.md from ankitmundada repo]
```

---

## Phase 2: Custom Tools (2 files)

### Tool 1: create_agent

File: `~/.config/opencode/tools/create_agent.ts`

**What it does:** HR calls this to create a new agent file on disk.

**What it needs:**
- Agent name
- System prompt (custom identity)
- Repo agent files to include (from .webforge/repo-agents/)
- Permissions (can_edit, can_bash, can_delegate, can_websearch)
- Steps (always 35)

**What it does:**
1. Reads the repo agent MD files from .webforge/repo-agents/
2. Concatenates them
3. Writes a new agent file to .opencode/agents/<name>.md
4. The file contains: YAML frontmatter + custom prompt + repo agent content
5. Returns: "Agent <name> created. Hermes can now spawn it."

### Tool 2: update_plan

File: `~/.config/opencode/tools/update_plan.ts`

**What it does:** Hermes calls this to update the plan file.

**What it needs:**
- Task ID
- Status (done, in_progress, blocked, remaining)
- Notes

**What it does:**
1. Reads .webforge/plan.md
2. Updates the task status
3. Writes back to disk
4. Returns the updated plan

---

## Phase 3: The Loop (1 script)

### The Ralph Loop Wrapper

File: `~/.config/opencode/webforge-loop.sh`

**What it does:** Keeps Hermes running autonomously until the project is done.

```bash
#!/bin/bash
# WebForge Autonomous Loop (Ralph Loop pattern)
# Keeps re-launching Hermes until the plan is 100% complete

PROJECT_DIR=$(pwd)
PLAN_FILE="$PROJECT_DIR/.webforge/plan.md"
MAX_ITERATIONS=50  # Safety limit

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== WebForge Loop Iteration $i ==="
    
    # Check if plan says COMPLETE
    if [ -f "$PLAN_FILE" ]; then
        if grep -q "PROJECT COMPLETE" "$PLAN_FILE"; then
            echo "✅ Project complete! Stopping loop."
            exit 0
        fi
    fi
    
    # Launch Hermes
    echo "Launching Hermes..."
    opencode run "Continue the WebForge project. Read .webforge/plan.md to see what's done and what's left. Recruit agents if needed. Update the plan as you go. Say PROJECT COMPLETE only when everything is verified done."
    
    # Check again after Hermes finishes
    if grep -q "PROJECT COMPLETE" "$PLAN_FILE" 2>/dev/null; then
        echo "✅ Project complete! Stopping loop."
        exit 0
    fi
    
    echo "Work remains. Relaunching Hermes in 5 seconds..."
    sleep 5
done

echo "⚠️ Reached max iterations ($MAX_ITERATIONS). Stopping."
echo "Check .webforge/plan.md for remaining work."
```

**How it works:**
1. Script checks if plan.md says "PROJECT COMPLETE"
2. If not — launches Hermes via `opencode run`
3. Hermes runs (35 tool calls), recruits agents, delegates, updates plan
4. Hermes exits
5. Script checks plan again
6. If not done — re-launches Hermes (fresh 35 calls)
7. Repeats until complete or max iterations reached

---

## Phase 4: The Repo Agent Library

### Setup (one-time)

Clone the two repos into `.webforge/repo-agents/`:

```bash
mkdir -p .webforge/repo-agents
cd .webforge/repo-agents

# Clone ankitmundada (128 agents in 10 categories)
git clone https://github.com/ankitmundada/awesome-opencode-subagents.git ankitmundada

# Clone jbeck018 (95 agents flat)
git clone https://github.com/jbeck018/agents-opencode.git jbeck018
```

### How HR uses the library

When Hermes says "I need a frontend developer," HR:
1. Searches `.webforge/repo-agents/` for `frontend-developer.md`
2. Finds it in `ankitmundada/categories/01-core-development/frontend-developer.md`
3. Reads the file content
4. Combines it with other relevant files (e.g., `react-specialist.md`, `typescript-pro.md`)
5. Writes a new agent file to `.opencode/agents/recruited-01.md`

### Updating the library

When the repos update:
```bash
cd .webforge/repo-agents/ankitmundada && git pull
cd .webforge/repo-agents/jbeck018 && git pull
```

HR always reads from the latest version. No rebuild needed.

---

## Phase 5: Worktree Isolation

### Install the worktree plugin

```bash
# Install opencode-worktree plugin
# (follow the plugin's installation instructions)
```

### How worktrees work in the flow

1. Hermes recruits an agent for a task
2. Before the agent starts, a worktree is created: `.worktrees/<agent-name>/`
3. The agent works in the worktree (can't touch main branch)
4. When the agent finishes, the worktree branch is merged back
5. The worktree is cleaned up
6. The next agent gets a fresh worktree

### Configuration

The worktree plugin should be configured to:
- Create worktrees in `.worktrees/`
- Auto-merge when the agent finishes
- Clean up after merge
- Keep the main directory read-only for context

---

## Phase 6: Skills Installation

### Install skill repos (one-time)

```bash
# Install Vercel skills
npx skills add vercel-labs/agent-skills --skill frontend-design -a opencode
npx skills add vercel-labs/agent-skills --skill nextjs-performance -a opencode

# Install Gentleman skills
npx skills add Gentleman-Programming/Gentleman-Skills --skill react-19 -a opencode
npx skills add Gentleman-Programming/Gentleman-Skills --skill typescript -a opencode

# Install FrancoStino collection (1595+ skills)
# Browse and install specific skills as needed
```

### How skills work

Skills are NOT part of the agent file. They are NOT assigned by HR.

Each agent has `skill: allow` in its permissions. When an agent runs and needs expertise (e.g., "how to structure a Next.js component"), it uses OpenCode's built-in `skill` tool to load the relevant skill on-demand.

The agent decides what skill it needs. Nobody assigns skills.

---

## Phase 7: The Registry (naming only)

File: `.webforge/registry.json`

A simple JSON file with familiar names and their roles. HR uses this to pick names when recruiting.

```json
{
  "hermes": { "role": "coordinator", "title": "COO" },
  "voss": { "role": "hr", "title": "HR Director" },
  "athena": { "role": "intelligence", "title": "Intelligence Director" },
  "hephaestus": { "role": "build", "title": "Build Director" },
  "minos": { "role": "quality", "title": "Quality Director" },
  "thoth": { "role": "documentation", "title": "Documentation Director" },
  "daedalus": { "role": "meta", "title": "Meta Engineering Director" }
}
```

When Hermes says "I need someone like Athena for intelligence," HR looks up "athena" in the registry, sees it's an intelligence role, and creates an agent with that name + research agent MD files.

---

## The Complete File Structure

```
~/.config/opencode/
  agents/
    hermes.md              ← Permanent (coordinator)
    voss.md                ← Permanent (HR recruiter)
  tools/
    create_agent.ts         ← HR uses this to create agents
    update_plan.ts          ← Hermes uses this to track progress

.webforge/
  plan.md                  ← The shared plan file (Hermes reads/writes this)
  registry.json            ← Name lookup for HR
  repo-agents/             ← Downloaded agent MD files from repos
    ankitmundada/          ← 128 agents in 10 categories
    jbeck018/              ← 95 agents flat

.opencode/
  agents/                  ← Recruited agents (created by HR, project-scoped)
    recruited-01.md        ← Created during the project, deleted after
    recruited-02.md
    ...

.worktrees/                ← Isolated workspaces (one per agent)
  recruited-01/
  recruited-02/

webforge-loop.sh           ← The Ralph Loop wrapper script
```

---

## The Complete Flow

```
1. You start the loop:
   $ bash webforge-loop.sh

2. Loop launches Hermes:
   "Build Athletica — a sports marketplace"

3. Hermes (35 calls):
   - Creates .webforge/plan.md with tasks
   - "I need intelligence research first"
   - Calls task("voss", "Create an intelligence researcher")
   
4. Voss (35 calls):
   - Reads .webforge/repo-agents/ankitmundada/categories/10-research-analysis/research-analyst.md
   - Reads search-specialist.md, data-researcher.md
   - Uses create_agent tool to write .opencode/agents/athena.md
   - Returns to Hermes: "Athena is ready"

5. Hermes calls task("athena", "Research sports marketplace"):
   
6. Athena (35 calls):
   - Reads the task
   - Loads skills on-demand (websearch skill, research methodology skill)
   - Researches the sports marketplace
   - If too big: asks Hermes to recruit more research agents
   - If done: returns research summary to Hermes

7. Hermes updates plan.md:
   - "Research: DONE"
   - "Build: REMAINING"

8. Hermes exits. Loop checks plan — not done. Re-launches Hermes.

9. Hermes (fresh 35 calls):
   - Reads plan.md — sees research is done, build is remaining
   - Calls task("voss", "Create a build director")

10. Voss creates hephaestus.md from backend-architect + fullstack-developer

11. Hermes calls task("hephaestus", "Build based on research"):
    
12. Hephaestus (35 calls):
    - Reads research
    - "I need frontend, backend, and database workers"
    - Calls task("voss", "Create 3 build workers")

13. Voss creates:
    - .opencode/agents/recruited-01.md (frontend-developer + react-specialist + typescript-pro)
    - .opencode/agents/recruited-02.md (backend-developer + api-designer)
    - .opencode/agents/recruited-03.md (database-admin + postgres-pro)

14. Hephaestus delegates SEQUENTIALLY:
    - task("recruited-01", "Build frontend") → runs in worktree → finishes → merges
    - task("recruited-02", "Build backend") → runs in worktree → finishes → merges
    - task("recruited-03", "Build database") → runs in worktree → finishes → merges

15. Hephaestus returns to Hermes: "Build complete"

16. Hermes updates plan.md:
    - "Research: DONE"
    - "Build: DONE"
    - "PROJECT COMPLETE"

17. Loop checks plan — says COMPLETE. Stops.

18. You get: "Athletica is built."
```

---

## Implementation Order

### Step 1 (Day 1): Create the 2 permanent agent files
- hermes.md (with repo agent MD files concatenated)
- voss.md (with HR repo agent MD files concatenated)
- Download the repo agent MD files and concatenate them

### Step 2 (Day 1): Create the 2 custom tools
- create_agent.ts (HR's agent creation tool)
- update_plan.ts (Hermes's plan tracking tool)

### Step 3 (Day 1): Create the loop script
- webforge-loop.sh (Ralph Loop wrapper)

### Step 4 (Day 2): Set up the repo library
- Clone ankitmundada and jbeck018 repos
- Create registry.json

### Step 5 (Day 2): Install skills
- Run npx skills add commands for core skills

### Step 6 (Day 2): Install worktree plugin
- Install opencode-worktree plugin
- Configure for auto-merge

### Step 7 (Day 3): Test end-to-end
- Give Hermes a simple task
- Watch: Hermes → Voss → recruited agent → work → report → plan update
- Verify the loop works autonomously

### Step 8 (Day 3): Test with a real project
- Give Hermes "Build a login page"
- Watch the full flow: research → recruit → build → verify → complete

---

## What We're NOT Building (anymore)

| Old Approach | New Approach |
|---|---|
| 283 agents from the start | 2 permanent agents, rest recruited on demand |
| Fixed departments | Dynamic — departments created when needed |
| Python scripts | OpenCode native — agents, tools, plugins |
| WebForge Office (standalone TS) | OpenCode terminal UI |
| Fixed 82 areas | Areas as a guideline map, not fixed |
| Skills written from scratch | Skills installed from repos |
| System prompts written from scratch | Repo agent MD files + custom identity prompt |
| Custom runtime (runtime.ts) | OpenCode's native agent loop |
| Custom watchdog | OpenCode's steps: 35 + plan file |
| Custom campus UI | OpenCode's terminal UI |
| SQLite state tracking | Plan file (.webforge/plan.md) on disk |

---

## Key Decisions Summary

1. **OpenCode-native** — not a standalone system
2. **2 permanent agents** — Hermes + Voss (HR)
3. **Dynamic recruiting** — HR creates agents on demand from repo templates
4. **Agent = custom prompt + repo MD files** — concatenated into one file
5. **35 tool-call limit** — using OpenCode's `steps: 35`
6. **Ralph Loop** — wrapper script re-launches Hermes until plan is done
7. **Plan file** — .webforge/plan.md as shared memory on disk
8. **Worktree isolation** — each agent works in its own git worktree
9. **Skills on-demand** — agents load skills themselves at runtime
10. **Sequential execution** — one agent at a time, no parallel
11. **Registry for naming** — HR uses familiar names from registry
12. **No forced model** — OpenCode uses whatever model is configured
13. **Fully autonomous** — you start the loop, walk away, come back to results
14. **Areas as guideline** — not fixed, used to decide divide vs parallel
15. **Repo agent library** — downloaded, not copied — updates flow through
