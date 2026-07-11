"use client"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/lib/cart-store"

// Product type — defined locally, no server imports
interface ProductCardProps {
  product: {
    slug: string
    name: string
    price: string
    mainImage?: string
  }
  /** Optional override for the product image (local path). If provided, used instead of product.mainImage. */
  imageOverride?: string
}

function parsePrice(priceStr: string): { min: number; max: number; range: boolean } {
  if (!priceStr) return { min: 0, max: 0, range: false }
  const matches = priceStr.match(/[\$£][\d,]+\.?\d*/g)
  if (!matches || matches.length === 0) return { min: 0, max: 0, range: false }
  const nums = matches.map(m => parseFloat(m.replace(/[\$£,]/g, "")))
  if (nums.length === 1) return { min: nums[0], max: nums[0], range: false }
  return { min: Math.min(...nums), max: Math.max(...nums), range: true }
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

export function ProductCard({ product, imageOverride }: { product: ProductCardProps["product"] }) {
  const addItem = useCart(s => s.addItem)
  const { min, max, range } = parsePrice(product.price)
  const img = imageOverride || product.mainImage || ""
  // Default rating: 4 or 5 stars (deterministic by slug hash)
  const rating = (product.slug.charCodeAt(0) % 2 === 0) ? 5 : 4

  return (
    <div className="group flex flex-col overflow-hidden bg-white">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Product image — square, white bg, per home-1440-02 */}
        <div className="aspect-square overflow-hidden bg-white">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      </Link>
      {/* Body — per screenshot: name, price (red), stars, add-to-cart */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 line-clamp-2 min-h-[2.5em] text-xs font-medium leading-tight text-[#222]">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mb-1 text-sm font-bold text-[#E21818]">
          {min > 0 ? (range ? `${formatUSD(min)} – ${formatUSD(max)}` : formatUSD(min)) : "Price on request"}
        </p>
        <div className="mb-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < rating ? "fill-[#E21818] text-[#E21818]" : "fill-gray-300 text-gray-300"}`}
            />
          ))}
        </div>
        <button
          onClick={() => addItem({ id: product.slug, slug: product.slug, name: product.name, price: min, image: img })}
          className="mt-auto flex items-center justify-center gap-1.5 bg-[#E21818] py-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#C51515]"
        >
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
    </div>
  )
}
