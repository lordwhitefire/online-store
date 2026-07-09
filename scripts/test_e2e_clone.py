#!/usr/bin/env python3
"""
End-to-end test: simulate what the frontend does when the user tells Hermes
to clone a repo. Then poll the board to verify the task moves through
TODO → DOING → DONE, and verify notifications are sent.

This is the same path /api/agent/talk takes:
  1. import hermes module
  2. call hermes.run("<message>")
  3. Hermes creates task, assigns to Hephaestus, triggers hephaestus.py work
  4. Background hephaestus.py runs, ACKs, works, marks done
"""
import os, sys, json, time
from pathlib import Path

os.environ["WEBFORGE_PROJECT"] = "/home/z/my-project"
sys.path.insert(0, str(Path.home() / "webforge" / "agents"))
sys.path.insert(0, str(Path.home() / "webforge" / "mcp"))

print("=" * 70)
print("TEST: User tells Hermes to clone a repo")
print("=" * 70)

# Step 1: Call Hermes
print("\n[1] Calling Hermes with message: 'clone this repo https://github.com/lordwhitefire/athletica'")
import hermes
result = hermes.run("clone this repo https://github.com/lordwhitefire/athletica we are going to build on it")
print(f"\nHermes response:\n{result.get('message', '')}")
print(f"  action: {result.get('action')}")
print(f"  task_id: {result.get('task_id')}")
print(f"  routed_to: {result.get('routed_to')}")

task_id = result.get("task_id")
if not task_id:
    print("\nERROR: No task_id returned. Aborting.")
    sys.exit(1)

# Step 2: Poll the board to watch task move through columns
print(f"\n[2] Polling board for {task_id} status changes...")
from task import load_board

prev_status = None
for i in range(20):  # 20 polls × 1s = 20s max wait
    time.sleep(1)
    board = load_board()
    task = next((t for t in board["tasks"] if t["id"] == task_id), None)
    if not task:
        print(f"  [{i}s] Task disappeared?!")
        break
    status = task["status"]
    owner = task.get("owner", "?")
    if status != prev_status:
        print(f"  [{i}s] status={status.upper()} owner=@{owner}")
        prev_status = status
    if status == "done":
        print(f"\n✅ Task reached DONE in {i+1}s")
        break
else:
    print(f"\n⚠️ Task did not reach DONE within 20s. Last status: {prev_status}")

# Step 3: Check notifications
print("\n[3] Checking notifications...")
from notify import get_all_unread
unread = get_all_unread()
print(f"  Total unread notifications: {len(unread)}")
for n in unread[-10:]:  # last 10
    print(f"    [{n['event']}] @{n['to']}: {n['message'][:80]}")

# Step 4: Check Hephaestus log
print("\n[4] Hephaestus log:")
log_path = Path("/home/z/my-project/.webforge/logs/hephaestus.log")
if log_path.exists():
    print(log_path.read_text())
else:
    print("  (no log file)")

# Step 5: Check if repo was actually cloned
print("\n[5] Checking if repo was cloned:")
clone_dir = Path("/home/z/my-project/.webforge/clones/athletica")
if clone_dir.exists():
    files = list(clone_dir.iterdir())[:5]
    print(f"  ✅ Cloned to {clone_dir} ({len(list(clone_dir.iterdir()))} files)")
    print(f"  Sample: {[f.name for f in files]}")
else:
    print(f"  ❌ Not cloned at {clone_dir}")

print("\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70)
