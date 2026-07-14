"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { useCart } from "@/lib/cart-store"
import Link from "next/link"
import { useState } from "react"
import { Lock, CreditCard, Truck, Check } from "lucide-react"

function formatUSD(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n) }

export default function CheckoutPage() {
  const { items, getTotal, clear } = useCart()
  const isEmpty = items.length === 0
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const customerName = `${formData.get("firstName")} ${formData.get("lastName")}`
    const customerEmail = formData.get("email") as string
    const total = getTotal()
    
    try {
      // Save customer
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
          phone: formData.get("phone"),
          address: formData.get("address"),
          city: formData.get("city"),
          country: formData.get("country"),
        })
      })

      // Save order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          total,
          subtotal: total,
          shipping: 0,
          items: items.map(item => ({
            productId: item.slug,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          }))
        })
      })
      const order = await res.json()
      setOrderNumber(order.orderNumber)
      setSuccess(true)
      clear()
    } catch (err) {
      alert("Error placing order. Please try again.")
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[#141618]">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">Order Placed!</h1>
            <p className="mb-2 text-[#9B9C9E]">Your order number is <span className="font-bold text-[#E21818]">#{orderNumber}</span></p>
            <p className="mb-8 text-sm text-[#9B9C9E]">A confirmation email has been sent. You can track your order in your account.</p>
            <Link href="/shop" className="inline-block bg-[#E21818] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Checkout</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><Link href="/shop" className="hover:text-[#E21818]">Shop</Link><span className="mx-1">/</span><Link href="/cart" className="hover:text-[#E21818]">Your cart</Link><span className="mx-1">/</span><span className="text-white">Checkout</span></nav>
        </div>
        {isEmpty ? (
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="border border-[#33383D] bg-[#1A1C1F] p-8 text-center">
              <p className="mb-6 text-lg text-white">Your cart is currently empty.</p>
              <Link href="/shop" className="inline-block bg-[#E21818] px-8 py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515]">Return to Shop</Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1 lg:w-[60%]">
                  <div className="mb-6 bg-[#1A1C1F] p-6">
                    <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Billing Details</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div><label className="mb-1 block text-xs text-[#9B9C9E]">First Name *</label><input name="firstName" required type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
                      <div><label className="mb-1 block text-xs text-[#9B9C9E]">Last Name *</label><input name="lastName" required type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
                      <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Country *</label><select name="country" required className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:outline-none"><option>Nigeria</option><option>United States</option><option>United Kingdom</option><option>Other</option></select></div>
                      <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Street Address *</label><input name="address" required type="text" placeholder="House number and street name" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:border-[#E21818] focus:outline-none" /></div>
                      <div><label className="mb-1 block text-xs text-[#9B9C9E]">City *</label><input name="city" required type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
                      <div><label className="mb-1 block text-xs text-[#9B9C9E]">Phone *</label><input name="phone" required type="tel" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
                      <div><label className="mb-1 block text-xs text-[#9B9C9E]">Email *</label><input name="email" required type="email" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
                    </div>
                  </div>
                  <div className="mb-6 bg-[#1A1C1F] p-6">
                    <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Shipping Method</h2>
                    <label className="flex items-center gap-3 border border-[#E21818] bg-[#E21818]/10 p-3 cursor-pointer"><input type="radio" name="shipping" defaultChecked className="accent-[#E21818]" /><Truck className="h-4 w-4 text-[#E21818]" /><span className="text-sm text-white">Flat Rate</span><span className="ml-auto text-sm font-bold text-[#E21818]">Free</span></label>
                  </div>
                  <div className="mb-6 bg-[#1A1C1F] p-6">
                    <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Payment Method</h2>
                    <label className="flex items-center gap-3 border border-[#E21818] bg-[#E21818]/10 p-3 cursor-pointer"><input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-[#E21818]" /><CreditCard className="h-4 w-4 text-[#E21818]" /><span className="text-sm text-white">Credit/Debit Card</span></label>
                    {paymentMethod === "card" && (<div className="mt-4 space-y-3"><input type="text" placeholder="Card Number" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" /><div className="grid grid-cols-2 gap-3"><input type="text" placeholder="MM/YY" className="border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" /><input type="text" placeholder="CVV" className="border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white placeholder:text-[#9B9C9E] focus:outline-none" /></div></div>)}
                  </div>
                </div>
                <div className="lg:w-[38%]">
                  <div className="bg-[#1A1C1F] p-6 sticky top-4">
                    <h2 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Your Order</h2>
                    <div className="mb-4 space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="h-12 w-12 object-cover" />}
                          <div className="flex-1"><p className="text-xs text-white line-clamp-1">{item.name}</p><p className="text-xs text-[#9B9C9E]">Qty: {item.quantity}</p></div>
                          <p className="text-xs font-bold text-[#E21818]">{formatUSD(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 border-t border-[#33383D] pt-4 text-sm">
                      <div className="flex justify-between"><span className="text-[#9B9C9E]">Subtotal</span><span className="text-white">{formatUSD(getTotal())}</span></div>
                      <div className="flex justify-between"><span className="text-[#9B9C9E]">Shipping</span><span className="text-white">Free</span></div>
                      <div className="flex justify-between border-t border-[#33383D] pt-2"><span className="font-bold text-white">Total</span><span className="font-bold text-[#E21818]">{formatUSD(getTotal())}</span></div>
                    </div>
                    <button type="submit" disabled={submitting} className="mt-4 flex w-full items-center justify-center gap-2 bg-[#E21818] py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515] disabled:opacity-50">
                      <Lock className="h-4 w-4" /> {submitting ? "Processing..." : "Place Order"}
                    </button>
                    <p className="mt-3 text-center text-[10px] text-[#9B9C9E]">Your payment information is encrypted and secure.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
