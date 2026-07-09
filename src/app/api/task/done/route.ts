import { NextRequest, NextResponse } from "next/server";
import { doneTask } from "@/lib/webforge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/task/done
 * Body: { taskId, summary? }
 * Calls: python3 ~/webforge/mcp/task.py done <id> [summary]
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const taskId = (body?.taskId ?? body?.id ?? "").toString().trim();
    const summary = (body?.summary ?? "").toString().trim();

    if (!taskId) {
      return NextResponse.json(
        { ok: false, error: "Missing 'taskId'" },
        { status: 400 }
      );
    }

    const result = await doneTask(taskId, summary);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "Failed to mark task done" },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, message: result.message });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
