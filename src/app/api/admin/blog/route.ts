import { NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, saveBlogPost } from "@/lib/data-helper"

export async function GET() {
  return NextResponse.json(getAllBlogPosts())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.action === "save" && body.slug) {
    saveBlogPost(body.slug, body.data)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
