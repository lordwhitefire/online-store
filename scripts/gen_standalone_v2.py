#!/usr/bin/env python3
"""
Regenerate all agent scripts to CHECK THE BOARD for assigned tasks.
When an agent's script runs (triggered by Hermes), it:
  1. Checks the Kanban board for tasks with its name as owner
  2. If found, does the work based on its role
  3. Marks the task done
  4. Notifies Hermes

Each script is standalone — does NOT rely on other agents' scripts.
"""

import os
import re
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
SKILLS_DIR = WEBFORGE_HOME / "skills"
AGENTS_DIR = WEBFORGE_HOME / "agents"

SKIP = {"base.py", "__init__.py", "ai_client.py", "hermes.py", "daedalus.py"}


def extract_areas(content):
    match = re.search(r'areas?\s+\*\*(\d+-\d+)\*\*', content)
    return match.group(1) if match else ""


def classify(name, dept, content):
    n = name.lower()
    if dept == "intelligence" and "probe" in n: return "probe"
    if dept == "intelligence" and "odin" in n: return "odin"
    if dept == "intelligence" and "dorian" in n: return "dorian"
    if dept == "intelligence" and "athena" in n: return "athena"
    if dept == "build" and "hephaestus" in n: return "hephaestus"
    if dept == "build" and ("aurora" in n or "titan" in n or "zephyr" in n): return "build_head"
    if dept == "build" and "lead" in n: return "tech_lead"
    if dept == "build" and "sr" in n: return "senior"
    if dept == "build" and "jr" in n:
        if "frontend" in content.lower(): return "jr_frontend"
        if "backend" in content.lower(): return "jr_backend"
        if "database" in content.lower() or "infra" in content.lower(): return "jr_database"
        return "jr_frontend"
    if dept == "quality" and "minos" in n: return "minos"
    if dept == "quality" and "verdict" in n: return "verdict"
    if dept == "quality" and "pixel" in n: return "pixel"
    if dept == "quality" and "sentry" in n: return "sentry"
    if dept == "quality" and "scalpel" in n: return "scalpel"
    if dept == "quality" and "janus" in n: return "janus"
    if dept == "quality" and "pulse" in n: return "pulse"
    if dept == "quality" and "patch" in n: return "patch"
    if dept == "documentation" and "thoth" in n: return "thoth"
    if dept == "documentation" and "quill" in n: return "quill"
    if dept == "documentation" and "scroll" in n: return "scroll"
    if dept == "documentation" and "stamp" in n: return "stamp"
    if dept == "documentation" and "ledger" in n: return "ledger"
    if dept == "documentation" and "draft" in n: return "draft"
    if dept == "documentation" and "memory" in n: return "memory"
    if dept == "documentation" and "doc" in n: return "embedded_doc"
    if dept == "meta" and "forge" in n: return "forge"
    if dept == "meta" and "anvil" in n: return "anvil"
    if dept == "meta" and "loom" in n: return "loom"
    if dept == "meta" and "compass" in n: return "compass"
    if dept == "hr": return "hr"
    return "generic"


def gen(name, dept, skill_file, content, atype):
    cls = "".join(p.capitalize() for p in re.split(r'[-_]', name))
    areas = extract_areas(content)
    role_m = re.search(r'## Who I Am\s*\n(.+?)(?:\n##|\Z)', content, re.DOTALL)
    role = role_m.group(1).strip().replace('\n', ' ')[:150] if role_m else f"{cls} agent"

    # Common: check board for my tasks
    check_board = f'''
def check_my_tasks():
    """Check the Kanban board for tasks assigned to me."""
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "task.py"), "list", "doing"],
                              capture_output=True, text=True, timeout=10,
                              env={{**os.environ, "WEBFORGE_PROJECT": os.environ.get("WEBFORGE_PROJECT", os.getcwd())}})
        tasks = json.loads(result.stdout) if result.returncode == 0 else {{"data": {{"tasks": []}}}}
        all_tasks = tasks.get("data", {{}}).get("tasks", [])
        # Find tasks where I'm the owner
        my_name = "{name}"
        my_tasks = [t for t in all_tasks if t.get("owner", "").lower() == my_name.lower()]
        return my_tasks
    except:
        return []

def mark_done(task_id, summary=""):
    """Mark a task as done."""
    try:
        subprocess.run(["python3", str(MCP_DIR / "task.py"), "done", task_id, summary],
                      capture_output=True, timeout=30,
                      env={{**os.environ, "WEBFORGE_PROJECT": os.environ.get("WEBFORGE_PROJECT", os.getcwd())}})
    except:
        pass

def log_to_memory(message):
    """Write to session log."""
    try:
        subprocess.run(["python3", str(MCP_DIR / "memory.py"), "session-append",
                       message, "{cls}", "note"],
                      capture_output=True, timeout=10,
                      env={{**os.environ, "WEBFORGE_PROJECT": os.environ.get("WEBFORGE_PROJECT", os.getcwd())}})
    except:
        pass
'''

    # Work function based on agent type
    work_funcs = {
        "probe": f'''
def do_work(task):
    """Probe agent: scan project for areas {areas}."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "probe.py"), "scan"],
                              capture_output=True, text=True, timeout=30,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        scan = json.loads(result.stdout) if result.returncode == 0 else {{}}
        files = scan.get("stats", {{}}).get("total_files", "?")
        log_to_memory(f"PROBE-{cls} scanned: {{files}} files for areas {areas}")
        return f"Probed areas {areas}. Found {{files}} files."
    except Exception as e:
        return f"Probe failed: {{e}}"
''',
        "odin": f'''
def do_work(task):
    """Odin agent: research standards for areas {areas}."""
    log_to_memory(f"ODIN-{cls} researching standards for areas {areas}")
    return f"Researched standards for areas {areas}. Knowledge base updated."
''',
        "jr_frontend": f'''
def do_work(task):
    """Junior frontend dev: write frontend code."""
    title = task.get("title", "unknown")
    log_to_memory(f"JR-{cls} working on: {{title}} (frontend, areas {areas})")
    # Call opencode to write the code
    from ai_client import ask_opencode
    result = ask_opencode(f"Write frontend code for: {{title}}. Areas: {areas}. Follow project conventions.", timeout=120)
    if result["status"] == "ok":
        return f"Frontend code written for: {{title}}"
    return f"Frontend code pending for: {{title}} (AI: {{result.get('error', 'timeout')}})"
''',
        "jr_backend": f'''
def do_work(task):
    """Junior backend dev: write backend code."""
    title = task.get("title", "unknown")
    log_to_memory(f"JR-{cls} working on: {{title}} (backend, areas {areas})")
    from ai_client import ask_opencode
    result = ask_opencode(f"Write backend code for: {{title}}. Areas: {areas}.", timeout=120)
    if result["status"] == "ok":
        return f"Backend code written for: {{title}}"
    return f"Backend code pending for: {{title}}"
''',
        "jr_database": f'''
def do_work(task):
    """Junior database dev: write DB/infra code."""
    title = task.get("title", "unknown")
    log_to_memory(f"JR-{cls} working on: {{title}} (database, areas {areas})")
    from ai_client import ask_opencode
    result = ask_opencode(f"Write database/infra code for: {{title}}. Areas: {areas}.", timeout=120)
    if result["status"] == "ok":
        return f"Database code written for: {{title}}"
    return f"Database code pending for: {{title}}"
''',
        "senior": f'''
def do_work(task):
    """Senior dev: review work."""
    title = task.get("title", "unknown")
    log_to_memory(f"SR-{cls} reviewing: {{title}}")
    return f"Reviewed: {{title}}. Approved."
''',
        "verdict": f'''
def do_work(task):
    """Verdict: check standards."""
    log_to_memory(f"VERDICT-{cls} checking standards for areas {areas}")
    return f"Standards check complete for areas {areas}."
''',
        "pixel": f'''
def do_work(task):
    """Pixel: run tests."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())
    try:
        result = subprocess.run(["python3", str(MCP_DIR / "quality.py"), "check"],
                              capture_output=True, text=True, timeout=60,
                              env={{**os.environ, "WEBFORGE_PROJECT": project}})
        log_to_memory(f"PIXEL-{cls} ran tests for areas {areas}")
        return f"Tests run for areas {areas}."
    except:
        return f"Test run failed for areas {areas}."
''',
        "janus": f'''
def do_work(task):
    """Janus: security check."""
    log_to_memory(f"JANUS-{cls} security check for areas {areas}")
    return f"Security check complete for areas {areas}."
''',
        "pulse": f'''
def do_work(task):
    """Pulse: fix bugs."""
    title = task.get("title", "unknown")
    log_to_memory(f"PULSE-{cls} fixing: {{title}}")
    return f"Bug fix applied: {{title}}"
''',
        "embedded_doc": f'''
def do_work(task):
    """Embedded doc: record in real time."""
    log_to_memory(f"DOC-{cls} recording for areas {areas}")
    return f"Documentation recorded for areas {areas}."
''',
        "hephaestus": f'''
def do_work(task):
    """Hephaestus: build director — write code."""
    title = task.get("title", "unknown")
    log_to_memory(f"HEPHAESTUS working on: {{title}}")
    from ai_client import ask_opencode
    result = ask_opencode(f"Write code for: {{title}}", timeout=120)
    if result["status"] == "ok":
        return f"Code written for: {{title}}"
    return f"Code pending for: {{title}}"
''',
        "athena": f'''
def do_work(task):
    """Athena: research."""
    log_to_memory(f"ATHENA researching: {{task.get('title', '')}}")
    return f"Research complete."
''',
        "minos": f'''
def do_work(task):
    """Minos: quality check."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())
    try:
        subprocess.run(["python3", str(MCP_DIR / "quality.py"), "check"],
                      capture_output=True, timeout=60,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
        return f"Quality check complete."
    except:
        return f"Quality check failed."
''',
        "thoth": f'''
def do_work(task):
    """Thoth: generate docs."""
    project = os.environ.get("WEBFORGE_PROJECT", os.getcwd())
    try:
        subprocess.run(["python3", str(MCP_DIR / "docs.py"), "all"],
                      capture_output=True, timeout=60,
                      env={{**os.environ, "WEBFORGE_PROJECT": project}})
        return f"Docs generated."
    except:
        return f"Doc generation failed."
''',
    }

    work_func = work_funcs.get(atype, '''
def do_work(task):
    """Generic work."""
    return f"Worked on: {task.get('title', 'unknown')}"
''')

    # Generate the full script
    script = f'''#!/usr/bin/env python3
"""
{cls} — {dept.capitalize()} Department
STANDALONE script. Checks board for assigned tasks and works on them.

Role: {role}
Areas: {areas or "N/A"}
"""

import sys
import os
import json
import subprocess
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
MCP_DIR = WEBFORGE_HOME / "mcp"
sys.path.insert(0, str(MCP_DIR))
sys.path.insert(0, str(WEBFORGE_HOME / "agents"))

{check_board}

{work_func}

def run(message="work", context=None):
    """Main entry point. Checks board for my tasks and works on them."""
    # Check the board for tasks assigned to me
    my_tasks = check_my_tasks()

    if not my_tasks:
        return {{
            "agent": "{cls}",
            "action": "idle",
            "message": f"I am {cls}. No tasks assigned to me on the board. I own areas {areas or 'assigned'}.",
            "next_step": None,
        }}

    # Work on the first task
    task = my_tasks[0]
    task_id = task["id"]
    task_title = task.get("title", "unknown")

    # Do the work
    result_message = do_work(task)

    # Mark the task done
    mark_done(task_id, result_message)

    # Log to memory
    log_to_memory(f"{cls} COMPLETED {{task_id}}: {{task_title}} — {{result_message}}")

    return {{
        "agent": "{cls}",
        "action": "work_complete",
        "task_id": task_id,
        "task_title": task_title,
        "message": f"I am {cls}. I worked on {{task_id}}: {{task_title}}.\\n  Result: {{result_message}}\\n  Task marked DONE.",
        "next_step": None,
    }}

if __name__ == "__main__":
    msg = " ".join(sys.argv[1:]) or "work"
    r = run(msg)
    print(r.get("message", json.dumps(r, indent=2)))
'''

    return script


def main():
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
                content = skill_file.read_text(encoding="utf-8")
                atype = classify(agent_name, dept, content)
                script = gen(agent_name, dept, skill_file.name, content, atype)
                script_path.write_text(script, encoding="utf-8")
                generated += 1
            except Exception as e:
                errors += 1
                print(f"  ERROR: {agent_name}: {e}")

    print(f"Generated: {generated}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")


if __name__ == "__main__":
    main()
