#!/usr/bin/env python3
"""
Generate a Python agent script for EVERY agent in the skills/ folder.
283 skill .md files → 283 agent .py scripts.

Each generated script:
  - Inherits from base.Agent
  - Sets name, department, skill_file path
  - Sets allowed_actions and forbidden_actions based on department
  - Has a correction_rules = [] list (for Daedalus to patch)
  - Has a run() function
  - Has a __main__ block

Department → permissions mapping:
  executive:  create tasks, route, standup, escalate (NO code, NO test, NO research)
  hr:         answer questions, route (NO code, NO test, NO research)
  meta:       add rules, learn, test, answer (NO code, NO create tasks)
  intelligence: research, answer, route (NO code, NO test, NO create tasks)
  build:      write_code, review_code, route to Minos (NO create tasks, NO research)
  quality:    run_quality_check, review_code, answer, route (NO code, NO create tasks)
  documentation: generate_docs, answer, route (NO code, NO test, NO research)
"""

import os
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
SKILLS_DIR = WEBFORGE_HOME / "skills"
AGENTS_DIR = WEBFORGE_HOME / "agents"
AGENTS_DIR.mkdir(parents=True, exist_ok=True)

# Department configurations
DEPT_CONFIG = {
    "executive": {
        "allowed": ['"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"research"', '"generate_docs"', '"run_quality_check"', '"review_code"', '"learn"'],
        "reports_to": "None",
        "can_route_to": ["Hephaestus", "Athena", "Minos", "Thoth", "Daedalus", "Voss"],
    },
    "hr": {
        "allowed": ['"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"research"', '"generate_docs"', '"run_quality_check"', '"review_code"', '"learn"'],
        "reports_to": '"Hermes"',
        "can_route_to": ["Hermes"],
    },
    "meta": {
        "allowed": ['"add_correction_rule"', '"learn"', '"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"research"', '"generate_docs"', '"review_code"'],
        "reports_to": '"Hermes"',
        "can_route_to": ["Hermes", "Daedalus"],
    },
    "intelligence": {
        "allowed": ['"research"', '"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"generate_docs"', '"run_quality_check"', '"review_code"', '"learn"'],
        "reports_to": '"Athena"',
        "can_route_to": ["Athena", "Hermes"],
    },
    "build": {
        "allowed": ['"write_code"', '"review_code"', '"route"', '"respond"'],
        "forbidden": ['"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"research"', '"generate_docs"', '"run_quality_check"', '"learn"'],
        "reports_to": '"Hephaestus"',
        "can_route_to": ["Minos", "Hephaestus"],
    },
    "quality": {
        "allowed": ['"run_quality_check"', '"review_code"', '"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"research"', '"generate_docs"', '"learn"'],
        "reports_to": '"Minos"',
        "can_route_to": ["Minos", "Hermes", "Hephaestus"],
    },
    "documentation": {
        "allowed": ['"generate_docs"', '"answer_question"', '"route"', '"respond"'],
        "forbidden": ['"write_code"', '"create_bugfix_task"', '"create_feature_task"', '"run_standup"', '"research"', '"run_quality_check"', '"review_code"', '"learn"'],
        "reports_to": '"Thoth"',
        "can_route_to": ["Thoth", "Hermes"],
    },
}

# Directors override their reports_to
DIRECTORS = {
    "hermes": "None",
    "hephaestus": '"Hermes"',
    "athena": '"Hermes"',
    "minos": '"Hermes"',
    "thoth": '"Hermes"',
    "daedalus": '"Hermes"',
    "voss": '"Hermes"',
}

# Directors have broader routing
DIRECTOR_ROUTES = {
    "hermes": ["Hephaestus", "Athena", "Minos", "Thoth", "Daedalus", "Voss"],
    "hephaestus": ["Minos", "Hermes"],
    "athena": ["Hermes", "Dorian"],
    "minos": ["Hermes", "Hephaestus"],
    "thoth": ["Hermes"],
    "daedalus": ["Hermes"],
    "voss": ["Hermes", "Rook", "Weld"],
}


def generate_agent_script(agent_name: str, dept: str, skill_file: str) -> str:
    """Generate the Python code for an agent script."""
    config = DEPT_CONFIG.get(dept, DEPT_CONFIG["build"])

    # Class name: "hermes" → "Hermes", "probe-orion" → "ProbeOrion"
    class_name = "".join(p.capitalize() for p in agent_name.split("-"))

    # Reports to
    reports_to = DIRECTORS.get(agent_name, config["reports_to"])

    # Can route to
    if agent_name in DIRECTOR_ROUTES:
        can_route = DIRECTOR_ROUTES[agent_name]
    else:
        can_route = config["can_route_to"]
    can_route_str = ", ".join(f'"{r}"' for r in can_route)

    # Allowed actions
    allowed_str = ", ".join(config["allowed"])

    # Forbidden actions
    forbidden_str = ", ".join(config["forbidden"])

    # Generate the script
    script = f'''#!/usr/bin/env python3
"""
{class_name} Agent — {dept.capitalize()} Department
Auto-generated by WebForge agent generator.

THE BODY: This script IS {class_name}. It controls what the AI does.
THE BRAIN: The AI only reasons when {class_name} asks it to.

Skill file: skills/{dept}/{skill_file}
"""

import sys
import os
import json
from pathlib import Path

WEBFORGE_HOME = Path.home() / "webforge"
sys.path.insert(0, str(WEBFORGE_HOME / "agents"))
sys.path.insert(0, str(WEBFORGE_HOME / "mcp"))

from base import Agent


class {class_name}(Agent):
    """Auto-generated agent script for {class_name}."""

    name = "{class_name}"
    department = "{dept.capitalize()}"
    skill_file = "{dept}/{skill_file}"
    reports_to = {reports_to}
    can_route_to = [{can_route_str}]

    allowed_actions = [{allowed_str}]
    forbidden_actions = [{forbidden_str}]

    # Per-agent correction rules (Daedalus patches these)
    correction_rules = []

    def execute(self, action, data, context):
        """Execute the action. CODE, not AI."""
        if action == "answer_question":
            return {{
                "agent": self.name,
                "action": action,
                "message": f"I am {{self.name}} ({{self.department}}). I'm ready to work.",
                "next_step": None,
            }}
        elif action == "route":
            return self._route_to(data.get("target", "Hermes"), data.get("message", ""))
        return {{
            "agent": self.name,
            "action": action,
            "message": f"I am {{self.name}}. Action: {{action}}",
            "next_step": None,
        }}


def run(message, context=None):
    """Called when developer talks to {class_name}."""
    agent = {class_name}()
    return agent.run(message, context)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("{class_name} Agent — {dept.capitalize()}")
        print("Usage: python {agent_name}.py <message>")
        sys.exit(1)
    message = " ".join(sys.argv[1:])
    result = run(message)
    print(result.get("message", json.dumps(result, indent=2)))
'''

    return script


def main():
    """Generate scripts for all agents."""
    # Don't overwrite existing handcrafted scripts
    SKIP = {"base.py", "__init__.py", "hermes.py", "hephaestus.py", "athena.py",
            "minos.py", "thoth.py", "daedalus.py", "voss.py", "dorian.py",
            "forge.py", "anvil.py", "compass.py", "loom.py"}

    generated = 0
    skipped = 0

    for dept_dir in sorted(SKILLS_DIR.iterdir()):
        if not dept_dir.is_dir():
            continue
        dept = dept_dir.name

        for skill_file in sorted(dept_dir.glob("*.md")):
            agent_name = skill_file.stem  # e.g. "probe-orion"
            script_name = f"{agent_name}.py"
            script_path = AGENTS_DIR / script_name

            if script_name in SKIP:
                skipped += 1
                continue

            # Generate and write
            script_content = generate_agent_script(agent_name, dept, skill_file.name)
            script_path.write_text(script_content, encoding="utf-8")
            generated += 1

    print(f"Generated: {generated} agent scripts")
    print(f"Skipped (handcrafted): {skipped} scripts")
    print(f"Total in agents/: {generated + skipped} + base.py + __init__.py")


if __name__ == "__main__":
    main()
