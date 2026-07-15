import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAllProducts } from "@/lib/data-helper"

export async function GET() {
  try {
    const [orders, customers, products] = await Promise.all([
      prisma.order.findMany({ select: { total: true, status: true } }),
      prisma.customer.count(),
      Promise.resolve(getAllProducts().length),
    ])
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    return NextResponse.json({
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === "completed").length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      totalProducts: products,
      totalCustomers: customers,
    })
  } catch {
    return NextResponse.json({ totalRevenue: "0", totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalProducts: 34, totalCustomers: 0 })
  }
}
