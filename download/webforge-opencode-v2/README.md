# WebForge v2 — OpenCode Integration

> An autonomous agent system that lives **inside** OpenCode. Not a standalone app. OpenCode provides the runtime, terminal UI, and tool-calling infrastructure. WebForge adds agents, custom tools, MCPs, and a Ralph Loop wrapper.

## Quick Start

1. Install OpenCode: `curl -fsSL https://opencode.ai/install | bash`
2. Install context tools: `npm install -g repomix @ast-grep/cli`
3. Copy `.opencode/`, `.webforge/`, and `webforge-loop.sh` into your project root
4. Set env vars: `GITHUB_TOKEN`, `EXA_API_KEY` (others optional)
5. Clone the repo agent library into `.webforge/repo-agents/` (see `.webforge/repo-agents/README.md`)
6. Set your project goal in `.webforge/plan.md`
7. Run: `bash webforge-loop.sh`

See **`INSTALL.md`** for the full installation guide.

## What's Inside

- **3 permanent agents** — Hermes (COO) + Voss (HR) + Daedalus (Meta Engineering / enforcer). Everything else is recruited on demand.
- **8 custom tools + 2 Pocket Universe plugin tools** — `create_agent`, `update_plan`, `memory`, `registry`, `safe_edit`, `safe_bash`, `revoke`, `status` + `broadcast` (auto-wake messaging), `recall` (agent memory)
- **6 MCPs** — Context7 (live docs), GitHub, Exa (semantic search), Playwright (e2e), Sentry (errors), Vercel (deploy), Supabase (db)
- **3 context tools** — Repomix (project packing), Context7 (live docs), ast-grep (code structure search)
- **6 Laws enforced in code** — not in prompts. Tools block violations before they happen.
- **Comprehensive agent format** — based on ankitmundada + jbeck018 repos. When Invoked, Workflow Position, Capabilities, Communication Protocol, Escalation Rules, Key Distinctions, Example Interactions.
- **Wake-up protocol** — 6-step tiered recall: every agent checks their direct superior first, peers only if needed, never everyone.
- **Ralph Loop** — wrapper script re-launches Hermes until `## PROJECT COMPLETE` appears in the plan.

## How It Works

```
You start the loop → Hermes reads the plan → recruits agents via Voss →
delegates to directors → directors delegate to workers → workers use
safe_edit/safe_bash (laws enforced) → results bubble back up →
Hermes updates the plan → loop re-launches if not done → stops when complete.
```

See **`webforge-implementation-plan-v2.md`** (in the parent directory) for the full design document.

## Files

- `.opencode/agents/hermes.md` — permanent coordinator agent
- `.opencode/agents/voss.md` — permanent HR agent
- `.opencode/tools/*.ts` — 9 custom tools
- `.opencode/opencode.json` — MCP config + Hermes as default
- `.webforge/plan.md` — shared plan file (loop checks this)
- `.webforge/registry.json` — name → role lookup
- `.webforge/agents.json` — full org tree (chain-of-command enforcement)
- `.webforge/memory/` — auto-logged edit/bash/recruitment/revocation history
- `.webforge/mailbox/` — per-agent JSON inboxes
- `.webforge/status/` — per-agent status snapshots
- `.webforge/repo-agents/` — 200+ downloaded agent MD files (clone separately)
- `webforge-loop.sh` — Ralph Loop wrapper
- `INSTALL.md` — full installation guide

## License

Same as the WebForge project.
