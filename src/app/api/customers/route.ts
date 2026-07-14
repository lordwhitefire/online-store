import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(customers)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const customer = await prisma.customer.upsert({
    where: { email: body.email },
    create: { email: body.email, name: body.name, phone: body.phone, address: body.address, city: body.city, country: body.country },
    update: { name: body.name, phone: body.phone, address: body.address, city: body.city, country: body.country }
  })
  return NextResponse.json(customer)
}
