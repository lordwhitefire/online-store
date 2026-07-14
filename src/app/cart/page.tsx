"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { useCart } from "@/lib/cart-store"
function formatUSD(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) }
import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingCart } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCart()
  const isEmpty = items.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar with breadcrumb */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Your cart</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/shop" className="hover:text-[#E21818]">Shop</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Your cart</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {isEmpty ? (
            /* Empty cart state */
            <div className="mx-auto max-w-2xl">
              <div className="border border-[#33383D] bg-[#1A1C1F] p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <ShoppingCart className="h-12 w-12 text-[#9B9C9E]" />
                </div>
                <p className="mb-6 text-lg text-white">Your cart is currently empty.</p>
                <Link href="/shop" className="inline-block bg-[#E21818] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]">
                  Return to Shop
                </Link>
              </div>
            </div>
          ) : (
            /* Cart with items */
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* LEFT: Cart table */}
              <div className="flex-1 lg:w-[65%]">
                <div className="overflow-x-auto border border-[#33383D] bg-[#1A1C1F]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#33383D]">
                        <th className="p-4 text-left text-xs font-bold uppercase text-[#9B9C9E]"></th>
                        <th className="p-4 text-left text-xs font-bold uppercase text-[#9B9C9E]">Product</th>
                        <th className="p-4 text-left text-xs font-bold uppercase text-[#9B9C9E]">Price</th>
                        <th className="p-4 text-left text-xs font-bold uppercase text-[#9B9C9E]">Quantity</th>
                        <th className="p-4 text-left text-xs font-bold uppercase text-[#9B9C9E]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-b border-[#33383D]/50">
                          <td className="p-4">
                            <button onClick={() => removeItem(item.id)} className="text-[#9B9C9E] hover:text-[#E21818]" aria-label="Remove">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.image && <img src={item.image} alt="" className="h-14 w-14 object-cover" />}
                              <span className="text-sm text-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-[#E21818]">{formatUSD(item.price)}</td>
                          <td className="p-4">
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 border border-[#33383D] bg-[#141618] px-2 py-1 text-sm text-white focus:outline-none"
                            />
                          </td>
                          <td className="p-4 text-sm font-bold text-white">{formatUSD(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Update cart + Continue shopping */}
                <div className="mt-4 flex items-center justify-between">
                  <Link href="/shop" className="flex items-center gap-2 text-sm text-[#9B9C9E] hover:text-[#E21818]">
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Link>
                  <button className="border border-[#33383D] px-6 py-2 text-xs font-bold uppercase text-white hover:border-[#E21818]">
                    Update Cart
                  </button>
                </div>
              </div>

              {/* RIGHT: Cart totals */}
              <div className="lg:w-[32%]">
                <div className="bg-[#1A1C1F] p-6">
                  <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Cart Totals</h2>

                  {/* Coupon code */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="mb-2 w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none"
                    />
                    <button className="w-full bg-[#33383D] py-2 text-xs font-bold uppercase text-white hover:bg-[#444]">
                      Apply Coupon
                    </button>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#9B9C9E]">Subtotal</span>
                      <span className="text-white">{formatUSD(getTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9B9C9E]">Shipping</span>
                      <span className="text-white">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-[#33383D] pt-2">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-bold text-[#E21818]">{formatUSD(getTotal())}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-4 block bg-[#E21818] py-3 text-center text-sm font-bold uppercase text-white hover:bg-[#C51515]"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
