"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { useCart } from "@/lib/cart-store"
import Link from "next/link"
import { useState } from "react"
import { Lock, CreditCard, Truck } from "lucide-react"

function formatUSD(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) }

export default function CheckoutPage() {
  const { items, getTotal } = useCart()
  const isEmpty = items.length === 0
  const [paymentMethod, setPaymentMethod] = useState("card")

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Checkout</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/shop" className="hover:text-[#E21818]">Shop</Link>
            <span className="mx-1">/</span>
            <Link href="/cart" className="hover:text-[#E21818]">Your cart</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Checkout</span>
          </nav>
        </div>

        {isEmpty ? (
          /* Empty cart state — same as cart page */
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="border border-[#33383D] bg-[#1A1C1F] p-8 text-center">
              <p className="mb-6 text-lg text-white">Your cart is currently empty.</p>
              <Link href="/shop" className="inline-block bg-[#E21818] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]">
                Return to Shop
              </Link>
            </div>
          </div>
        ) : (
          /* Checkout form — two columns */
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* LEFT: Form */}
              <div className="flex-1 lg:w-[60%]">
                {/* Billing Details */}
                <div className="mb-6 bg-[#1A1C1F] p-6">
                  <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Billing Details</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">First Name *</label>
                      <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Last Name *</label>
                      <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Company Name</label>
                      <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Country *</label>
                      <select className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none">
                        <option>Nigeria</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Street Address *</label>
                      <input type="text" placeholder="House number and street name" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Town/City *</label>
                      <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Phone *</label>
                      <input type="tel" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Email *</label>
                      <input type="email" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mb-6 bg-[#1A1C1F] p-6">
                  <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Shipping Method</h2>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 border border-[#33383D] p-3 cursor-pointer hover:border-[#E21818]">
                      <input type="radio" name="shipping" defaultChecked className="accent-[#E21818]" />
                      <Truck className="h-4 w-4 text-[#E21818]" />
                      <span className="text-sm text-white">Flat Rate</span>
                      <span className="ml-auto text-sm font-bold text-[#E21818]">Free</span>
                    </label>
                    <label className="flex items-center gap-3 border border-[#33383D] p-3 cursor-pointer hover:border-[#E21818]">
                      <input type="radio" name="shipping" className="accent-[#E21818]" />
                      <Truck className="h-4 w-4 text-[#E21818]" />
                      <span className="text-sm text-white">Local Pickup</span>
                      <span className="ml-auto text-sm font-bold text-[#E21818]">$10.00</span>
                    </label>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 bg-[#1A1C1F] p-6">
                  <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Payment Method</h2>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 border border-[#E21818] bg-[#E21818]/10 p-3 cursor-pointer">
                      <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-[#E21818]" />
                      <CreditCard className="h-4 w-4 text-[#E21818]" />
                      <span className="text-sm text-white">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 border border-[#33383D] p-3 cursor-pointer hover:border-[#E21818]">
                      <input type="radio" name="payment" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="accent-[#E21818]" />
                      <span className="text-sm text-white">Bank Transfer</span>
                    </label>
                    <label className="flex items-center gap-3 border border-[#33383D] p-3 cursor-pointer hover:border-[#E21818]">
                      <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-[#E21818]" />
                      <span className="text-sm text-white">Cash on Delivery</span>
                    </label>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-4 space-y-3">
                      <input type="text" placeholder="Card Number" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                        <input type="text" placeholder="CVV" className="border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="lg:w-[38%]">
                <div className="bg-[#1A1C1F] p-6 sticky top-4">
                  <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Your Order</h2>

                  {/* Items */}
                  <div className="mb-4 space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt="" className="h-12 w-12 object-cover" />}
                        <div className="flex-1">
                          <p className="text-xs text-white line-clamp-1">{item.name}</p>
                          <p className="text-xs text-[#9B9C9E]">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-bold text-[#E21818]">{formatUSD(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t border-[#33383D] pt-4 text-sm">
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

                  {/* Place Order */}
                  <button className="mt-4 flex w-full items-center justify-center gap-2 bg-[#E21818] py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]">
                    <Lock className="h-4 w-4" /> Place Order
                  </button>

                  <p className="mt-3 text-center text-[10px] text-[#9B9C9E]">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
