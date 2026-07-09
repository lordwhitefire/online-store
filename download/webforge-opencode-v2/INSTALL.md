# WebForge v2 — OpenCode Integration Package

> Build autonomous agent systems inside OpenCode. WebForge adds 3 permanent agents, 8 custom tools + 2 Pocket Universe plugin tools (`broadcast`, `recall`), 6 MCPs, 3 context tools, and a Ralph Loop wrapper on top of OpenCode. Not a standalone system.
>
> **v2.1:** Post-integration fixes applied — `safe_task` and `mailbox` removed, Pocket Universe added, agent format upgraded to comprehensive ankitmundada/jbeck018 style, wake-up protocol defined. See `webforge-errors-and-fixes.md` for the full changelog.

## What's In This Package

```
webforge-opencode-v2/
├── .opencode/
│   ├── opencode.json              ← Config: Hermes=default, 6 MCPs wired up
│   ├── agents/
│   │   ├── hermes.md              ← Permanent coordinator (COO)
│   │   ├── voss.md                ← Permanent HR (recruiter)
│   │   └── daedalus.md            ← Permanent Meta Engineering / enforcer (6 Laws)
│   └── tools/                      ← 8 custom tools (v2.1: removed mailbox + safe_task)
│       ├── create_agent.ts         ← HR creates new agent files
│       ├── update_plan.ts          ← Hermes updates shared plan
│       ├── memory.ts               ← Project memory read/write (Law 6)
│       ├── registry.ts             ← Look up agent info + relationships
│       ├── safe_edit.ts            ← Edit files (Law 2 + 5 + 6 enforced)
│       ├── safe_bash.ts            ← Run commands (dangerous ops blocked)
│       ├── revoke.ts               ← Strip safe_edit/safe_bash from misbehaving agents
│       └── status.ts               ← Write status snapshot to disk
├── .pocket-universe.jsonc          ← Pocket Universe config (enables recall)
├── .webforge/
│   ├── plan.md                     ← Shared plan file (loop checks for PROJECT COMPLETE)
│   ├── registry.json               ← Name → role lookup for HR
│   ├── agents.json                 ← Full org tree (reportsTo + subordinates) for Law 4
│   ├── memory/
│   │   ├── STATE.md                ← Current project state
│   │   ├── PROJECT.md              ← Project overview template
│   │   ├── edit-log.md             ← Auto-appended by safe_edit
│   │   ├── bash-log.md             ← Auto-appended by safe_bash
│   │   ├── recruitments.md         ← Auto-appended by create_agent
│   │   ├── revocations.md          ← Auto-appended by revoke
│   │   └── decisions/              ← Decision log (one file per decision)
│   ├── mailbox/
│   │   ├── hermes.json             ← Hermes's inbox (initialized empty)
│   │   └── voss.json               ← Voss's inbox (initialized empty)
│   ├── status/
│   │   ├── hermes.json             ← Hermes's last status (initialized idle)
│   │   └── voss.json               ← Voss's last status (initialized idle)
│   └── repo-agents/
│       └── README.md               ← How to clone the 200+ agent library
├── webforge-loop.sh                ← Ralph Loop wrapper (re-launches Hermes)
└── INSTALL.md                      ← This file
```

## Installation

### Step 1 — Install OpenCode

If you don't have OpenCode:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Verify:

```bash
opencode --version
```

### Step 2 — Install Context Tools (3)

These are mandatory for large projects (saves agents from burning all 35 tool calls reading files):

```bash
# Repomix — packs entire project into one text file
npm install -g repomix

# ast-grep — structure-aware code search (replaces grep for refactors)
npm install -g @ast-grep/cli

# Context7 — installed as MCP in Step 4, no global install needed
```

Verify:

```bash
repomix --version
ast-grep --version
```

### Step 3 — Copy the package into your project

From the root of your target project:

```bash
# Copy .opencode/ and .webforge/ into the project root
cp -r /path/to/webforge-opencode-v2/.opencode  ./ 
cp -r /path/to/webforge-opencode-v2/.webforge ./
cp    /path/to/webforge-opencode-v2/webforge-loop.sh ./

# Make the loop script executable
chmod +x webforge-loop.sh
```

### Step 4 — Set MCP environment variables

The `opencode.json` references these env vars. Set them in your shell (or `.envrc` / `.zshrc`):

```bash
# Required for GitHub MCP
export GITHUB_TOKEN="ghp_your_token_here"

# Required for Exa MCP (semantic search)
export EXA_API_KEY="your_exa_key_here"

# Optional — for later-phase MCPs
export SENTRY_AUTH_TOKEN="your_sentry_token"        # only if using Sentry
export VERCEL_TOKEN="your_vercel_token"             # only if deploying to Vercel
export SUPABASE_ACCESS_TOKEN="your_supabase_token"  # only if using Supabase
```

> Context7, GitHub, and Exa are the three critical MCPs. The other four (Playwright, Sentry, Vercel, Supabase) can be removed from `opencode.json` if you don't need them — just delete the corresponding block.

### Step 5 — Clone the repo agent library

HR (Voss) reads from this library when recruiting agents:

```bash
cd .webforge/repo-agents

# 128 agents in 10 categories
git clone https://github.com/ankitmundada/awesome-opencode-subagents.git ankitmundada

# 95 agents, flat structure
git clone https://github.com/jbeck018/agents-opencode.git jbeck018

cd ../..
```

### Step 6 — Install the worktree plugin (recommended)

Each agent works in an isolated git worktree. Install the worktree plugin by following its installation instructions: <https://github.com/nicholasgriffintn/opencode-worktree>

### Step 7 — Install non-library skills (optional)

Library-specific skills (Next.js, Tailwind, Supabase) are NOT installed — Context7 serves live docs instead. But non-library expertise (design patterns, code review checklists) is still useful:

```bash
npx skills add vercel-labs/agent-skills --skill frontend-design -a opencode
npx skills add Gentleman-Programming/Gentleman-Skills --skill react-19 -a opencode
```

### Step 8 — Verify installation

From your project root:

```bash
# Files in place?
ls .opencode/agents/         # should show hermes.md, voss.md
ls .opencode/tools/          # should show 9 .ts files
ls .webforge/                # should show plan.md, registry.json, agents.json, memory/, mailbox/, status/, repo-agents/
ls webforge-loop.sh          # should exist and be executable

# Tools wired up?
opencode tools               # should list WebForge custom tools

# Hermes is the default agent?
opencode agents              # should show hermes as default

# MCPs connected?
opencode mcp                 # should show context7, github, exa (and others if configured)
```

### Step 9 — Start the loop

Edit `.webforge/plan.md` to set your project goal, then:

```bash
bash webforge-loop.sh
```

Walk away. The loop will:
1. Launch Hermes
2. Hermes reads the plan, recruits agents via Voss, delegates, verifies, updates the plan
3. Hermes exits (35 calls used)
4. Loop checks for `## PROJECT COMPLETE` in `.webforge/plan.md`
5. If not done — re-launches Hermes (fresh 35 calls)
6. Repeats until complete or 50 iterations reached

## How to Use

### Giving the CEO (you) a goal

Edit `.webforge/plan.md`:

```markdown
## Project Goal
Build Athletica — a sports marketplace with Next.js, Tailwind, Prisma, Supabase.
```

Then start the loop:

```bash
bash webforge-loop.sh
```

### Watching progress

```bash
# Live plan
watch -n 5 cat .webforge/plan.md

# Recent edits
tail -f .webforge/memory/edit-log.md

# Recent bash commands
tail -f .webforge/memory/bash-log.md

# Recruitment log
cat .webforge/memory/recruitments.md

# Loop log
tail -f .webforge/loop.log

# Active agents
ls .opencode/agents/

# Agent statuses
for f in .webforge/status/*.json; do echo "== $f =="; cat "$f"; done
```

### Stopping the loop early

```bash
# Ctrl+C in the terminal where webforge-loop.sh is running
# Or add the marker manually:
echo -e "\n## PROJECT COMPLETE\nManual stop." >> .webforge/plan.md
```

### Resuming after a stop

```bash
bash webforge-loop.sh    # picks up where it left off (reads plan.md)
```

## What the 6 Laws Enforce

| Law | Description | Enforced By |
|---|---|---|
| Law 1 | 35 tool-call limit per agent | OpenCode's `steps: 35` in agent YAML |
| Law 2 | No file over 300 lines | `safe_edit.ts` + `memory.ts` block writes > 300 lines |
| Law 3 | Real-time docs | `safe_edit.ts` logs every edit to `.webforge/memory/edit-log.md` |
| Law 4 | Chain of command | `mailbox.ts` checks `agents.json` before sending |
| Law 5 | No inference | `safe_edit.ts` Flagger scans for "I assume", "probably", hardcoded secrets |
| Law 6 | Documentation | `safe_edit.ts` + `safe_bash.ts` auto-log to memory |

## Isolation from OpenCode Built-in Agents

**WebForge rules ONLY apply to WebForge agents. OpenCode's built-in agents are completely unaffected — they cannot be modified by Daedalus, spawned by Hermes, or affected by any WebForge tool.**

This is achieved through four layers:

### Layer 1 — YAML Permission Gating

Every WebForge agent (hermes, voss, daedalus, recruited-*) has this in its YAML frontmatter:

```yaml
permission:
  edit: deny           # ← denies built-in edit
  bash: deny           # ← denies built-in bash
  task: deny           # ← denies built-in task (could spawn built-in agents!)
  safe_edit: allow     # ← allows our law-enforcing safe_edit
  safe_bash: allow     # ← allows our law-enforcing safe_bash
  safe_task: allow     # ← allows our allowlist-enforced safe_task
```

OpenCode's built-in agents (build, plan, any others) have their OWN YAML with their OWN permissions. They keep `edit: allow`, `bash: allow`, and `task: allow` — they never see `safe_edit`, `safe_bash`, or `safe_task` because those aren't in their permission list.

**Result:** WebForge agents are forced to use `safe_edit`/`safe_bash`/`safe_task` (with 6 Laws + allowlist enforced). Built-in agents use the built-in `edit`/`bash`/`task` (no enforcement). The two never cross.

### Layer 2 — Tool Guards (Belt and Suspenders)

Every WebForge custom tool checks `.webforge/agents.json` at the start of its `execute()` function:

```typescript
// ─── WebForge Tool Guard ───
const regPath = path.join(process.cwd(), ".webforge", "agents.json")
let _isWebForgeAgent = false
try {
  const reg = JSON.parse(fs.readFileSync(regPath, "utf-8"))
  _isWebForgeAgent = Object.values(reg).some(
    (a) => a.name?.toLowerCase() === callerAgent.toLowerCase()
  )
} catch {}
if (!_isWebForgeAgent) {
  return `BLOCKED: ${callerAgent} is not a registered WebForge agent.`
}
```

If a built-in agent somehow tries to call `safe_edit`, `safe_bash`, `mailbox`, `memory`, `registry`, or `status`, the guard blocks it with a clear message. The built-in agent falls back to its own tools.

The other 3 tools (`create_agent`, `update_plan`, `revoke`) have role-based guards instead — only Voss can create agents, only Hermes can update the plan, only Daedalus/Hermes can revoke.

### Layer 3 — safe_task Allowlist (Spawn Isolation)

This is the layer that closes the "filesystem path guard" gap. Without it, a WebForge agent with `task: allow` could call `task({ subagent_type: "build" })` to spawn a built-in agent. With `safe_task`, that's impossible:

- All WebForge agents have `task: deny` — the built-in `task` tool is blocked at the YAML level
- All WebForge agents have `safe_task: allow` — the only spawn mechanism available to them
- `safe_task` checks `.webforge/agents.json` before spawning. If the target is not a registered WebForge agent, it returns `BLOCKED: '<name>' is not a registered WebForge agent`
- Built-in agents (build, plan, etc.) are NEVER in `.webforge/agents.json`, so `safe_task` provably cannot spawn them

**A WebForge agent can ONLY spawn other WebForge agents. It can never spawn a built-in agent.**

### Layer 4 — Ralph Loop Isolation

The `webforge-loop.sh` script ONLY launches Hermes:

```bash
opencode run "Continue the WebForge project..."
```

It never modifies, disables, or touches any OpenCode built-in agent. The loop:
- Does NOT change built-in agent configs
- Does NOT call built-in agents
- Does NOT interfere with sessions running built-in agents

If you're using OpenCode's `build` or `plan` agent in another terminal/session, the Ralph Loop running in a different terminal has zero effect on it.

### What's Disabled vs. What's Unaffected

| Agent | Status | WebForge Rules Apply? | Daedalus Can Revoke? | WebForge Can Spawn? |
|---|---|---|---|---|
| Hermes | Active (default) | ✅ Yes — uses safe_* tools, 6 Laws enforced | ✅ Yes (CEO-only) | ✅ Yes — via safe_task |
| Voss | Active (subagent) | ✅ Yes — uses safe_* tools | ✅ Yes (CEO-only) | ✅ Yes — via safe_task |
| Daedalus | Active (subagent) | ✅ Yes — uses safe_* tools, has revoke | ✅ Yes (CEO-only) | ✅ Yes — via safe_task |
| recruited-* | Active when created | ✅ Yes — uses safe_* tools | ✅ Yes — Daedalus's target | ✅ Yes — via safe_task |
| build (built-in) | Disabled (redundant) | N/A — can't run | ❌ NEVER — not in registry | ❌ NEVER — safe_task blocks |
| plan (built-in) | Disabled (redundant) | N/A — can't run | ❌ NEVER — not in registry | ❌ NEVER — safe_task blocks |
| Any other built-in | Active (if exists) | ❌ No — keeps own perms | ❌ NEVER — not in registry | ❌ NEVER — safe_task blocks |

**Daedalus's revocation authority is hard-limited by the `revoke` tool's registry check.** Even if Daedalus tried to revoke a built-in agent, the tool returns `BLOCKED: <name> is not a registered WebForge agent.` Built-in agents are never in `.webforge/agents.json`, so they are provably unreachable by Daedalus.

**WebForge's spawn authority is hard-limited by the `safe_task` tool's registry check.** Even if Hermes tried to spawn a built-in agent, the tool returns `BLOCKED: '<name>' is not a registered WebForge agent.` Combined with `task: deny` in the YAML, WebForge agents have NO path to spawn built-in agents.

If you want to re-enable `build` or `plan` (e.g., for non-WebForge work), remove the `agent` block from `opencode.json`. They'll come back with their original permissions, completely unaffected by WebForge.

## Troubleshooting

**Hermes says "I can't find the plan file"** — Make sure `.webforge/plan.md` exists. The package ships with a template.

**Voss says "Repo file not found"** — Make sure you cloned the repos into `.webforge/repo-agents/` (Step 5).

**`mailbox` returns "Chain of command violation"** — This is correct behavior. An agent can only message its direct superior or direct subordinates. Check `.webforge/agents.json` for the org tree.

**Loop keeps re-launching Hermes without progress** — Check `.webforge/plan.md`. If Hermes isn't updating it, the `update_plan` tool may be failing. Check that Hermes is the one calling it (only Hermes can).

**`safe_edit` blocks my edit saying "file would have N lines"** — Law 2. Split the file into smaller files. 300 lines max per file.

**MCPs not showing up** — Run `opencode mcp` to see status. Check that env vars are set (Step 4) and that `npx` can install the packages.

## What This Package Does NOT Include

- ❌ The 285 v1 skill files (replaced by dynamic recruiting from the repo library)
- ❌ A standalone web UI (use OpenCode's terminal UI)
- ❌ A custom runtime (use OpenCode's native agent loop)
- ❌ SQLite state tracking (plan file + JSON files on disk instead)
- ❌ Library-specific skill files (Context7 MCP serves live docs instead)

## Upgrade Path

From v1 → v2:

1. Replace `.opencode/` with this package's `.opencode/`
2. Keep your existing `.webforge/plan.md` (format is compatible)
3. The 7 tools in v1 are unchanged — only `create_agent` and `update_plan` are new
4. Update `opencode.json` to add the new MCPs (Context7, Exa, Playwright, Sentry, Vercel, Supabase)
5. Install Repomix + ast-grep globally

## Source

- v2 implementation plan: `webforge-implementation-plan-v2.md`
- Original v1 package: `webforge-opencode/` (kept for reference)
