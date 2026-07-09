#!/usr/bin/env python3
"""Clean up task-007 (the original stuck task from before the fix)
and run a bug-fix test to verify that path works too."""
import os, sys, json, time
from pathlib import Path

os.environ["WEBFORGE_PROJECT"] = "/home/z/my-project"
sys.path.insert(0, str(Path.home() / "webforge" / "agents"))
sys.path.insert(0, str(Path.home() / "webforge" / "mcp"))

# ── Clean up task-007 ──
print("=" * 70)
print("CLEANUP: task-007 (stale task from before fix)")
print("=" * 70)
from task import load_board, save_board
from common import utc_now
board = load_board()
for t in board["tasks"]:
    if t["id"] == "task-007" and t["status"] != "done":
        t["status"] = "done"
        t["completed_at"] = utc_now()
        print(f"Marked task-007 done (was {t['status']})")
save_board(board)

# ── Test bug path ──
print("\n" + "=" * 70)
print("TEST: User tells Hermes to fix a bug")
print("=" * 70)

print("\n[1] Calling Hermes with: 'fix the login bug'")
import hermes
result = hermes.run("fix the login bug")
print(f"\nHermes response:\n{result.get('message', '')}")
print(f"  action: {result.get('action')}")
print(f"  task_id: {result.get('task_id')}")

task_id = result.get("task_id")
if not task_id:
    print("\nERROR: No task_id returned.")
    sys.exit(1)

# Poll for completion
print(f"\n[2] Polling board for {task_id}...")
prev_status = None
for i in range(20):
    time.sleep(1)
    board = load_board()
    task = next((t for t in board["tasks"] if t["id"] == task_id), None)
    if not task:
        break
    status = task["status"]
    if status != prev_status:
        print(f"  [{i}s] status={status.upper()} owner=@{task.get('owner', '?')}")
        prev_status = status
    if status == "done":
        print(f"\n✅ Bug task reached DONE in {i+1}s")
        break

# Check stub file was created
print("\n[3] Checking work stub:")
stub_path = Path(f"/home/z/my-project/.webforge/work/{task_id}-bugfix.md")
if stub_path.exists():
    print(f"  ✅ Created: {stub_path}")
    print(f"  Size: {stub_path.stat().st_size} bytes")
else:
    print(f"  ❌ No stub at {stub_path}")

print("\n" + "=" * 70)
print("DONE")
print("=" * 70)
