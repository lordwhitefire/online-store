import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const order = await prisma.order.create({
    data: {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      total: body.total,
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      items: { create: body.items }
    },
    include: { items: true }
  })
  return NextResponse.json(order)
}
