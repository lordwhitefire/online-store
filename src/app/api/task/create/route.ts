import { NextRequest, NextResponse } from "next/server";
import { createTask } from "@/lib/webforge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/task/create
 * Body: { title, type?, area?, effort? }
 * Calls: python3 ~/webforge/mcp/task.py create "<title>" <type> <area> <effort>
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const title = (body?.title ?? "").toString().trim();
    const taskType = (body?.type ?? "feature").toString().trim() || "feature";
    const area = (body?.area ?? "").toString().trim();
    const effort = (body?.effort ?? "M").toString().trim() || "M";

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Missing 'title'" },
        { status: 400 }
      );
    }

    const result = await createTask(title, taskType, area, effort);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error ?? "Failed to create task" },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, task: result.task });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
