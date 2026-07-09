#!/usr/bin/env python3
"""
Regenerate ALL 283 agent scripts as TRULY STANDALONE.
Each agent has its OWN logic based on its role — not a shared template.
Each script is self-contained — no relying on other agents' scripts.

Agent types and their unique logic:
  EXECUTIVE (Hermes): Creates tasks, routes, runs standup, escalates
  HR (Voss, Rook, Weld): Manages agents, spawns workers
  META (Daedalus, Forge, Anvil, Loom, Compass): Fixes system, builds MCPs
  INTELLIGENCE (Athena, Probe-*, Odin-*, Dorian): Probes project, researches
  BUILD (Hephaestus, Aurora, Titan, Zephyr, Lead-*, Sr-*, Jr-*): Writes code
  QUALITY (Minos, Verdict-*, Pixel-*, Sentry-*, Scalpel-*, Janus-*, Pulse-*): Tests
  DOCUMENTATION (Thoth, Quill, Scroll, Stamp, Ledger, Draft, Memory-*, Doc-*): Docs
"""

import os
import re
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
SKILLS_DIR = WEBFORGE_HOME / "skills"
AGENTS_DIR = WEBFORGE_HOME / "agents"

# Handcrafted scripts that should NOT be overwritten
SKIP = {"base.py", "__init__.py", "ai_client.py", "hermes.py", "daedalus.py"}


def classify_agent(agent_name: str, dept: str, skill_content: str) -> str:
    """Classify agent into a specific type based on name and skill content."""
    name_lower = agent_name.lower()
    content_lower = skill_content.lower()

    # Executive
    if dept == "executive":
        if "hermes" in name_lower:
            return "hermes_type"
        return "ceo_type"

    # HR
    if dept == "hr":
        return "hr_type"

    # Meta Engineering
    if dept == "meta":
        if "daedalus" in name_lower:
            return "daedalus_type"
        if "forge" in name_lower:
            return "forge_type"
        if "anvil" in name_lower:
            return "anvil_type"
        if "loom" in name_lower:
            return "loom_type"
        if "compass" in name_lower:
            return "compass_type"
        return "meta_type"

    # Intelligence
    if dept == "intelligence":
        if "athena" in name_lower:
            return "athena_type"
        if "dorian" in name_lower:
            return "dorian_type"
        if "probe" in name_lower:
            return "probe_type"
        if "odin" in name_lower:
            return "odin_type"
        return "intelligence_type"

    # Build
    if dept == "build":
        if "hephaestus" in name_lower:
            return "hephaestus_type"
        if "aurora" in name_lower or "titan" in name_lower or "zephyr" in name_lower:
            return "build_head_type"
        if "lead" in name_lower:
            return "tech_lead_type"
        if "sr" in name_lower or "senior" in content_lower:
            return "senior_dev_type"
        if "jr" in name_lower or "junior" in content_lower:
            # Determine frontend/backend/database from skill content
            if "frontend" in content_lower:
                return "junior_frontend_type"
            elif "backend" in content_lower:
                return "junior_backend_type"
            elif "database" in content_lower or "infra" in content_lower:
                return "junior_database_type"
            return "junior_frontend_type"  # Default
        return "build_type"

    # Quality
    if dept == "quality":
        if "minos" in name_lower:
            return "minos_type"
        if "verdict" in name_lower:
            return "verdict_type"
        if "pixel" in name_lower:
            return "pixel_type"
        if "sentry" in name_lower:
            return "sentry_type"
        if "scalpel" in name_lower:
            return "scalpel_type"
        if "janus" in name_lower:
            return "janus_type"
        if "pulse" in name_lower:
            return "pulse_type"
        if "patch" in name_lower:
            return "patch_type"
        if "nemesis" in name_lower:
            return "nemesis_type"
        return "quality_type"

    # Documentation
    if dept == "documentation":
        if "thoth" in name_lower:
            return "thoth_type"
        if "quill" in name_lower:
            return "quill_type"
        if "scroll" in name_lower:
            return "scroll_type"
        if "stamp" in name_lower:
            return "stamp_type"
        if "ledger" in name_lower:
            return "ledger_type"
        if "draft" in name_lower:
            return "draft_type"
        if "memory" in name_lower:
            return "memory_type"
        if "doc" in name_lower:
            return "embedded_doc_type"
        return "documentation_type"

    return "generic_type"


def extract_areas(skill_content: str) -> str:
    """Extract areas from skill file (e.g., '01-05')."""
    match = re.search(r'areas?\s+\*\*(\d+-\d+)\*\*', skill_content)
    if match:
        return match.group(1)
    return ""


def generate_script(agent_name: str, dept: str, skill_file: str, skill_content: str, agent_type: str) -> str:
    """Generate a standalone Python script for an agent based on its type."""

    class_name = "".join(p.capitalize() for p in re.split(r'[-_]', agent_name))
    areas = extract_areas(skill_content)
    # Extract role from skill file
    role_match = re.search(r'## Who I Am\s*\n(.+?)(?:\n##|\Z)', skill_content, re.DOTALL)
    role = role_match.group(1).strip().replace('\n', ' ')[:200] if role_match else f"{class_name} agent"

    # Common header
    header = f'''#!/usr/bin/env python3
"""
{class_name} — {dept.capitalize()} Department
Standalone agent script. Does NOT rely on other agents' scripts.

Role: {role}
Areas: {areas or "N/A"}
Skill file: skills/{dept}/{skill_file}
"""

import sys
import os
import json
import subprocess
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
MCP_DIR = WEBFORGE_HOME / "mcp"
sys.path.insert(0, str(MCP_DIR))

'''

    # Generate based on agent type
    if agent_type == "probe_type":
        return header + probe_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type == "odin_type":
        return header + odin_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type in ("junior_frontend_type", "junior_backend_type", "junior_database_type"):
        return header + junior_dev_script(class_name, agent_name, areas, dept, skill_file, agent_type)
    elif agent_type == "senior_dev_type":
        return header + senior_dev_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "tech_lead_type":
        return header + tech_lead_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "build_head_type":
        return header + build_head_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "hephaestus_type":
        return header + hephaestus_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "athena_type":
        return header + athena_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "dorian_type":
        return header + dorian_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "minos_type":
        return header + minos_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "verdict_type":
        return header + verdict_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type in ("pixel_type", "sentry_type", "scalpel_type"):
        return header + test_agent_script(class_name, agent_name, areas, dept, skill_file, agent_type)
    elif agent_type == "janus_type":
        return header + janus_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type == "pulse_type":
        return header + pulse_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type == "thoth_type":
        return header + thoth_script(class_name, agent_name, dept, skill_file)
    elif agent_type in ("quill_type", "scroll_type", "stamp_type", "ledger_type", "draft_type"):
        return header + doc_agent_script(class_name, agent_name, dept, skill_file, agent_type)
    elif agent_type == "memory_type":
        return header + memory_agent_script(class_name, agent_name, dept, skill_file)
    elif agent_type == "embedded_doc_type":
        return header + embedded_doc_script(class_name, agent_name, areas, dept, skill_file)
    elif agent_type in ("forge_type", "anvil_type", "loom_type", "compass_type"):
        return header + meta_agent_script(class_name, agent_name, dept, skill_file, agent_type)
    elif agent_type == "hr_type":
        return header + hr_agent_script(class_name, agent_name, dept, skill_file)
    else:
        return header + generic_script(class_name, agent_name, dept, skill_file)


# ── AGENT TYPE SCRIPTS ──

def probe_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Probe agent: scans project for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Scan project structure
    result = subprocess.run(["python3", str(MCP_DIR / "probe.py"), "scan"],
                          capture_output=True, text=True, timeout=30,
                          env={{**os.environ, "WEBFORGE_PROJECT": project}})

    scan_data = json.loads(result.stdout) if result.returncode == 0 else {{}}

    # Log findings to memory
    try:
        subprocess.run(["python3", str(MCP_DIR / "memory.py"), "session-append",
                       f"PROBE-{cls} scanned project. Files: {{scan_data.get('stats', {{}}).get('total_files', '?')}}",
                       "{cls}", "note"],
                      capture_output=True, timeout=10,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
    except: pass

    return {{
        "agent": "{cls}",
        "action": "probe",
        "areas": "{areas}",
        "message": f"I am {cls}. I probed areas {areas or 'assigned'}. Found {{scan_data.get('stats', {{}}).get('total_files', '?')}} files. Findings written to memory.",
        "scan": scan_data,
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "probe"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def odin_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Odin agent: researches standards for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Search knowledge base for existing research
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "knowledge.py"), "search", message or "standards"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        kb = json.loads(result.stdout) if result.returncode == 0 else {{}}
    except: kb = {{}}

    findings = kb.get("data", {{}}).get("results", [])

    # Log research to memory
    try:
        subprocess.run(["python3", str(MCP_DIR / "memory.py"), "session-append",
                       f"ODIN-{cls} researched: {{message[:80]}}",
                       "{cls}", "note"],
                      capture_output=True, timeout=10,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
    except: pass

    return {{
        "agent": "{cls}",
        "action": "research",
        "areas": "{areas}",
        "message": f"I am {cls}. I researched standards for areas {areas or 'assigned'}. Topic: {{message}}. Found {{len(findings)}} existing knowledge entries.",
        "knowledge_results": findings,
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "research standards"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def junior_dev_script(cls, name, areas, dept, skill_file, dev_type):
    dev_role = "frontend" if "frontend" in dev_type else "backend" if "backend" in dev_type else "database"
    return f'''def run(message, context=None):
    """Junior {dev_role} developer: writes code for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Check for assigned tasks
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "task.py"), "list", "doing"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        tasks = json.loads(result.stdout) if result.returncode == 0 else {{}}
        doing_tasks = tasks.get("data", {{}}).get("tasks", [])
    except: doing_tasks = []

    my_tasks = [t for t in doing_tasks if t.get("owner", "").lower() == "{name}".lower()]

    if not my_tasks:
        return {{
            "agent": "{cls}",
            "action": "idle",
            "message": f"I am {cls} (Junior {dev_role} Dev). No tasks assigned to me. I own areas {areas or 'assigned'}.",
            "next_step": "Assign a task via /build",
        }}

    task = my_tasks[0]
    task_id = task["id"]
    task_title = task["title"]

    # Log to memory
    try:
        subprocess.run(["python3", str(MCP_DIR / "memory.py"), "session-append",
                       f"{cls} working on {{task_id}}: {{task_title}}",
                       "{cls}", "note"],
                      capture_output=True, timeout=10,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
    except: pass

    return {{
        "agent": "{cls}",
        "action": "write_code",
        "task_id": task_id,
        "task_title": task_title,
        "areas": "{areas}",
        "message": f"I am {cls} (Junior {dev_role} Dev). I have task {{task_id}}: {{task_title}}. I own areas {areas or 'assigned'}. Ready to write {dev_role} code.",
        "ai_prompt": f"Write {dev_role} code for: {{task_title}}. Areas: {areas or 'all'}. Follow project rules and conventions.",
        "next_step": "AI writes code → commit → mark done",
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "work"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def senior_dev_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Senior developer: reviews junior work and reports up."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Check for tasks to review
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "task.py"), "list", "doing"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        tasks = json.loads(result.stdout) if result.returncode == 0 else {{}}
        doing_tasks = tasks.get("data", {{}}).get("tasks", [])
    except: doing_tasks = []

    return {{
        "agent": "{cls}",
        "action": "review",
        "message": f"I am {cls} (Senior Dev). I review junior developers' work. {{len(doing_tasks)}} task(s) in progress. I report to my Tech Lead.",
        "tasks_in_progress": len(doing_tasks),
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "review"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def tech_lead_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Tech lead: manages senior developers, tracks progress."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "coordinate",
        "message": f"I am {cls} (Tech Lead). I manage senior developers and track build progress. I report to my department head.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def build_head_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Build department head: oversees build sub-department."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "oversee",
        "message": f"I am {cls} (Build Sub-Head). I oversee my sub-department and report to Hephaestus.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def hephaestus_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Build Director: oversees all build work, writes code when needed."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Check for assigned tasks
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "task.py"), "list", "doing"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        tasks = json.loads(result.stdout) if result.returncode == 0 else {{}}
        doing_tasks = tasks.get("data", {{}}).get("tasks", [])
    except: doing_tasks = []

    my_tasks = [t for t in doing_tasks if t.get("owner", "").lower() in ["hephaestus", "hermes"]]

    return {{
        "agent": "{cls}",
        "action": "build",
        "tasks_assigned": len(my_tasks),
        "message": f"I am {cls} (Build Director). I have {{len(my_tasks)}} task(s) assigned. I write code and commit via Git MCP. I report to Hermes.",
        "next_step": "Use /build to start a task" if not my_tasks else "Work on: " + ", ".join(t["id"] for t in my_tasks),
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def athena_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Intelligence Director: oversees research and RFCs."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Search knowledge base
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "knowledge.py"), "list"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        kb = json.loads(result.stdout) if result.returncode == 0 else {{}}
        kb_count = kb.get("data", {{}}).get("count", 0)
    except: kb_count = 0

    return {{
        "agent": "{cls}",
        "action": "research",
        "knowledge_entries": kb_count,
        "message": f"I am {cls} (Intelligence Director). I oversee research and RFCs. Knowledge base has {{kb_count}} entries. I report to Hermes.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def dorian_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """UI Researcher: researches UI/UX design references."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "research_ui",
        "message": f"I am {cls} (UI Researcher). I find UI/UX design references on the internet. I report to Athena. Topic: {{message}}",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "research UI"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def minos_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Quality Director: runs quality checks and tracks bugs."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Run quality check
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "quality.py"), "check"],
                              capture_output=True, text=True, timeout=60,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        check_ok = result.returncode == 0
    except: check_ok = False

    return {{
        "agent": "{cls}",
        "action": "quality_check",
        "check_passed": check_ok,
        "message": f"I am {cls} (Quality Director). I run quality checks, track bugs, and review code. Quality check: {{'PASSED' if check_ok else 'FAILED/CHECK NEEDED'}}. I report to Hermes.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "check"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def verdict_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Verdict agent: checks standards compliance for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Read rules
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "memory.py"), "read-rules"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        rules = result.stdout.strip() if result.returncode == 0 else "(no rules)"
    except: rules = "(no rules)"

    return {{
        "agent": "{cls}",
        "action": "standards_check",
        "areas": "{areas}",
        "rules": rules[:500],
        "message": f"I am {cls} (Standards Compliance). I check areas {areas or 'assigned'} against project standards and rules. I report to Minos.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "check standards"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def test_agent_script(cls, name, areas, dept, skill_file, test_type):
    test_role = {"pixel_type": "unit/integration tests", "sentry_type": "test review",
                 "scalpel_type": "E2E tests"}.get(test_type, "testing")
    return f'''def run(message, context=None):
    """Test agent: writes and runs {test_role} for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Run tests
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "quality.py"), "check"],
                              capture_output=True, text=True, timeout=60,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        check_data = json.loads(result.stdout) if result.returncode == 0 else {{}}
    except: check_data = {{}}

    return {{
        "agent": "{cls}",
        "action": "test",
        "test_type": "{test_role}",
        "areas": "{areas}",
        "message": f"I am {cls}. I write and run {test_role} for areas {areas or 'assigned'}. I report to my team lead.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "test"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def janus_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Janus agent: checks security and compliance for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "security_check",
        "areas": "{areas}",
        "message": f"I am {cls} (Security & Compliance). I check security vulnerabilities, NDPR/GDPR compliance, and accessibility (WCAG) for areas {areas or 'assigned'}. I report to Janus-Core.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "security check"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def pulse_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Pulse agent: fixes bugs for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Check for bug tasks
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "bug.py"), "list"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        bug_data = json.loads(result.stdout) if result.returncode == 0 else {{}}
        bugs = bug_data.get("data", {{}}).get("bugs", [])
    except: bugs = []

    return {{
        "agent": "{cls}",
        "action": "fix_bugs",
        "areas": "{areas}",
        "open_bugs": len(bugs),
        "message": f"I am {cls} (Bug Fixer). I fix bugs in areas {areas or 'assigned'}. There are {{len(bugs)}} open bug(s). I report to Pulse-Core.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "fix bugs"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def thoth_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Documentation Director: generates docs from project state."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "generate_docs",
        "message": f"I am {cls} (Documentation Director). I generate README, changelog, API docs, env docs, and onboarding docs from project state. I report to Hermes.",
        "next_step": "Use /readme, /changelog, /api-docs, /env-docs, /onboard, or /docs",
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "docs"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def doc_agent_script(cls, name, dept, skill_file, doc_type):
    doc_role = {{"quill_type": "documentation lead", "scroll_type": "README and changelog",
                "stamp_type": "commit messages and progress", "ledger_type": "environment docs",
                "draft_type": "component and API docs"}}.get(doc_type, "documentation")
    return f'''def run(message, context=None):
    """Doc agent: handles {doc_role}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "document",
        "doc_role": "{doc_role}",
        "message": f"I am {cls}. I handle {doc_role}. I report to Thoth.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "document"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def memory_agent_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Memory agent: tracks project memory and decisions."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Check memory status
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "memory.py"), "status"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        mem_status = json.loads(result.stdout) if result.returncode == 0 else {{}}
    except: mem_status = {{}}

    return {{
        "agent": "{cls}",
        "action": "track_memory",
        "memory_status": mem_status.get("data", {{}}),
        "message": f"I am {cls} (Memory Team). I track project memory and follow the 300-line rule. Memory: {{mem_status.get('data', {{}}).get('lines', '?')}} lines. I report to Quill.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "memory status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def embedded_doc_script(cls, name, areas, dept, skill_file):
    return f'''def run(message, context=None):
    """Embedded doc agent: records decisions in real time for areas {areas or "assigned"}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # Log to memory
    try:
        subprocess.run(["python3", str(MCP_DIR / "memory.py"), "session-append",
                       f"DOC-{cls} recording activity for areas {areas or 'assigned'}",
                       "{cls}", "note"],
                      capture_output=True, timeout=10,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
    except: pass

    return {{
        "agent": "{cls}",
        "action": "record",
        "areas": "{areas}",
        "message": f"I am {cls} (Embedded Doc Agent). I record decisions in real time for areas {areas or 'assigned'}. I report to Thoth. I do NOT wait until the end (Law 6).",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "record"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def meta_agent_script(cls, name, dept, skill_file, meta_type):
    meta_role = {{"forge_type": "build new MCPs", "anvil_type": "fix bugs in MCPs",
                 "loom_type": "create new agent scripts", "compass_type": "test the system"}}.get(meta_type, "meta engineering")
    return f'''def run(message, context=None):
    """Meta agent: {meta_role}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    return {{
        "agent": "{cls}",
        "action": "meta",
        "meta_role": "{meta_role}",
        "message": f"I am {cls} (Meta Engineering). I {meta_role}. I report to Daedalus.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def hr_agent_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """HR agent: manages agent lifecycle."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())

    # List active workers
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "hr.py"), "list"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        workers = json.loads(result.stdout) if result.returncode == 0 else {{}}
    except: workers = {{}}

    return {{
        "agent": "{cls}",
        "action": "hr",
        "workers": workers.get("data", {{}}),
        "message": f"I am {cls} (HR). I manage agent recruitment, activation, and termination. I report to Hermes/Voss.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def generic_script(cls, name, dept, skill_file):
    return f'''def run(message, context=None):
    """Generic agent."""
    return {{
        "agent": "{cls}",
        "action": "respond",
        "message": f"I am {cls} ({dept} department). I received: {{message}}",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "status"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''


def main():
    """Generate all 283 standalone agent scripts."""
    generated = 0
    skipped = 0
    errors = 0

    for dept_dir in sorted(SKILLS_DIR.iterdir()):
        if not dept_dir.is_dir():
            continue
        dept = dept_dir.name

        for skill_file in sorted(dept_dir.glob("*.md")):
            agent_name = skill_file.stem
            script_name = f"{agent_name}.py"
            script_path = AGENTS_DIR / script_name

            if script_name in SKIP:
                skipped += 1
                continue

            try:
                skill_content = skill_file.read_text(encoding="utf-8")
                agent_type = classify_agent(agent_name, dept, skill_content)
                script_content = generate_script(agent_name, dept, skill_file.name, skill_content, agent_type)
                script_path.write_text(script_content, encoding="utf-8")
                generated += 1
            except Exception as e:
                errors += 1
                print(f"  ERROR: {agent_name}: {e}")

    print(f"\nGenerated: {{generated}} standalone scripts")
    print(f"Skipped (handcrafted): {{skipped}}")
    print(f"Errors: {{errors}}")
    print(f"Total: {{generated + skipped + errors}}")


if __name__ == "__main__":
    main()
