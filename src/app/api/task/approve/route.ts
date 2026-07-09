import { NextRequest, NextResponse } from "next/server";
import { approveTask } from "@/lib/webforge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/task/approve
 * Body: { taskId, agent? }
 * Calls: python3 ~/webforge/mcp/task.py approve <id> [agent]
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const taskId = (body?.taskId ?? body?.id ?? "").toString().trim();
    const agent = (body?.agent ?? "auto").toString().trim() || "auto";

    if (!taskId) {
      return NextResponse.json(
        { ok: false, error: "Missing 'taskId'" },
        { status: 400 }
      );
    }

    const result = await approveTask(taskId, agent);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "Failed to approve task" },
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
