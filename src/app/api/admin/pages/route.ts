import { NextRequest, NextResponse } from "next/server"
import { getAllPageNames, getPageData, savePageData } from "@/lib/data-helper"

export async function GET() {
  const pages = getAllPageNames().map(name => ({ name, data: getPageData(name) }))
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.action === "save" && body.pageName) {
    savePageData(body.pageName, body.data)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
