import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/data"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.toLowerCase() || ""
  const minPrice = parseFloat(searchParams.get("minPrice") || "0")
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "99999")
  const category = searchParams.get("category") || ""
  const sort = searchParams.get("sort") || "default"

  let products = getProducts()

  // Search by query
  if (q) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categories?.some((c: string) => c.toLowerCase().includes(q)) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
  }

  // Filter by price
  products = products.filter(p => {
    const prices = p.price?.match(/\$[\d,.]+/g)?.map((m: string) => parseFloat(m.replace(/[$,]/g, ""))) || [0]
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return max >= minPrice && min <= maxPrice
  })

  // Filter by category
  if (category) {
    products = products.filter(p => p.categories?.some((c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-") === category))
  }

  // Sort
  if (sort === "price-asc") {
    products.sort((a, b) => {
      const pa = parseFloat(a.price?.match(/\$[\d,.]+/)?.[0]?.replace(/[$,]/g, "") || "0")
      const pb = parseFloat(b.price?.match(/\$[\d,.]+/)?.[0]?.replace(/[$,]/g, "") || "0")
      return pa - pb
    })
  } else if (sort === "price-desc") {
    products.sort((a, b) => {
      const pa = parseFloat(a.price?.match(/\$[\d,.]+/)?.[0]?.replace(/[$,]/g, "") || "0")
      const pb = parseFloat(b.price?.match(/\$[\d,.]+/)?.[0]?.replace(/[$,]/g, "") || "0")
      return pb - pa
    })
  } else if (sort === "name") {
    products.sort((a, b) => a.name.localeCompare(b.name))
  }

  return NextResponse.json({ products, count: products.length })
}
