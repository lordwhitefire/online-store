import { NextRequest, NextResponse } from "next/server"
import { getAllProducts, saveProduct, createProduct, deleteProduct } from "@/lib/data-helper"

export async function GET() {
  return NextResponse.json(getAllProducts())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.action === "save" && body.slug) {
    saveProduct(body.slug, body.data)
    return NextResponse.json({ success: true })
  }
  if (body.action === "delete" && body.slug) {
    deleteProduct(body.slug)
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
