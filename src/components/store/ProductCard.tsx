"use client"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-store"

// Product type — defined locally, no server imports
interface ProductCardProps {
  product: {
    slug: string
    name: string
    price: string
    mainImage?: string
  }
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return 0
  const m = priceStr.match(/\$([\d,.]+)/)
  return m ? parseFloat(m[1].replace(/,/g, "")) : 0
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

export function ProductCard({ product }: { product: ProductCardProps["product"] }) {
  const addItem = useCart(s => s.addItem)
  const price = parsePrice(product.price)

  return (
    <div className="group rounded-lg border border-[#33383D] bg-[#1A1C1F] p-4 transition-colors hover:border-[#E21818]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="mb-3 aspect-square overflow-hidden rounded bg-[#141618]">
          {product.mainImage && (
            <img src={product.mainImage} alt={product.name} className="h-full w-full object-cover" />
          )}
        </div>
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-white">{product.name}</h3>
        <p className="text-sm font-bold text-[#E21818]">{price > 0 ? formatUSD(price) : "Price on request"}</p>
      </Link>
      <button
        onClick={() => addItem({ id: product.slug, slug: product.slug, name: product.name, price, image: product.mainImage || "" })}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-[#E21818] py-2 text-xs font-bold text-white hover:bg-[#C51515]"
      >
        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
      </button>
    </div>
  )
}
