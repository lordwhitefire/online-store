#!/usr/bin/env python3
"""Clean up stale 'doing' tasks owned by Hermes (test residue blocking WIP)."""
import os, sys, json
from pathlib import Path

sys.path.insert(0, str(Path.home() / "webforge" / "mcp"))
os.environ["WEBFORGE_PROJECT"] = "/home/z/my-project"

from task import load_board, save_board, task_move

board = load_board()
print(f"Before: {len(board['tasks'])} tasks")
from collections import Counter
print(Counter(t['status'] for t in board['tasks']))

# Move all 'doing' tasks owned by Hermes to 'done' (they were test tasks)
moved = []
for t in board["tasks"]:
    if t["status"] == "doing" and (t.get("owner") or "").lower() == "hermes":
        t["status"] = "done"
        from common import utc_now
        t["completed_at"] = utc_now()
        moved.append(t["id"])

save_board(board)
print(f"\nMoved {len(moved)} stale Hermes 'doing' tasks to 'done': {moved}")

board = load_board()
print(f"\nAfter: {len(board['tasks'])} tasks")
print(Counter(t['status'] for t in board['tasks']))
print("\n--- Doing tasks now: ---")
for t in board["tasks"]:
    if t["status"] == "doing":
        print(f"  {t['id']}: owner={t['owner']} title={t['title'][:60]}")
print("\n--- Todo tasks now: ---")
for t in board["tasks"]:
    if t["status"] == "todo":
        print(f"  {t['id']}: owner={t['owner']} title={t['title'][:60]}")
