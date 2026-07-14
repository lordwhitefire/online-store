"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { useState } from "react"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Search } from "lucide-react"

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard")

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Admin Dashboard</h1>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-[#33383D]">
            {[
              { id: "dashboard", label: "Dashboard", icon: TrendingUp },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "customers", label: "Customers", icon: Users },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase transition-colors ${
                  tab === t.id ? "border-[#E21818] text-white" : "border-transparent text-[#9B9C9E] hover:text-white"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {tab === "dashboard" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: DollarSign, label: "Total Revenue", value: "$12,345", color: "text-green-500" },
                  { icon: ShoppingCart, label: "Total Orders", value: "48", color: "text-blue-500" },
                  { icon: Package, label: "Products", value: "34", color: "text-[#E21818]" },
                  { icon: Users, label: "Customers", value: "12", color: "text-purple-500" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1A1C1F] p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-[#9B9C9E]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="mt-6 bg-[#1A1C1F] p-6">
                <h3 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#33383D] text-[#9B9C9E]">
                        <th className="py-2 pr-4">Order ID</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Product</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "#1001", customer: "John Smith", product: "Tama Snare Drum", date: "Jul 14, 2026", status: "Completed", total: "$249.99" },
                        { id: "#1002", customer: "Sarah Lee", product: "Crosley Turntable", date: "Jul 13, 2026", status: "Processing", total: "$349.99" },
                        { id: "#1003", customer: "Mike Brown", product: "Gibson Les Paul", date: "Jul 12, 2026", status: "Pending", total: "$899.99" },
                        { id: "#1004", customer: "Emma Wilson", product: "Meinl Cymbals", date: "Jul 11, 2026", status: "Completed", total: "$349.99" },
                      ].map(order => (
                        <tr key={order.id} className="border-b border-[#33383D]/50">
                          <td className="py-3 pr-4 text-white">{order.id}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{order.customer}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{order.product}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{order.date}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2 py-1 text-[10px] uppercase ${
                              order.status === "Completed" ? "bg-green-500/20 text-green-400" :
                              order.status === "Processing" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>{order.status}</span>
                          </td>
                          <td className="py-3 pr-4 font-bold text-[#E21818]">{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {tab === "products" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#9B9C9E]" />
                  <input type="text" placeholder="Search products…" className="border border-[#33383D] bg-[#141618] px-3 py-1.5 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                </div>
                <button className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
              <div className="bg-[#1A1C1F] p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#33383D] text-[#9B9C9E]">
                        <th className="py-2 pr-4">Product</th>
                        <th className="py-2 pr-4">SKU</th>
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Stock</th>
                        <th className="py-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Tama S.L.P. Big Black Steel Snare Drum", sku: "TAMA-001", cat: "Drums", price: "$249.99", stock: "In Stock" },
                        { name: "Crosley Cruiser Portable Turntable", sku: "CROS-002", cat: "Turntables", price: "$349.99", stock: "In Stock" },
                        { name: "Gibson 2016 T Les Paul Studio", sku: "GIBS-003", cat: "Guitars", price: "$899.99", stock: "Low Stock" },
                        { name: "Meinl Cymbals Arena Marching", sku: "MEIN-004", cat: "Cymbals", price: "$349.99", stock: "In Stock" },
                        { name: "Beyerdynamic DT 770 PRO", sku: "BEYD-005", cat: "Headphones", price: "$350.75", stock: "Out of Stock" },
                      ].map(p => (
                        <tr key={p.sku} className="border-b border-[#33383D]/50">
                          <td className="py-3 pr-4 text-white">{p.name}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{p.sku}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{p.cat}</td>
                          <td className="py-3 pr-4 text-[#E21818]">{p.price}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-[10px] uppercase ${
                              p.stock === "In Stock" ? "text-green-400" :
                              p.stock === "Low Stock" ? "text-yellow-400" : "text-red-400"
                            }`}>{p.stock}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex gap-2">
                              <button className="text-[#9B9C9E] hover:text-[#E21818]"><Edit className="h-4 w-4" /></button>
                              <button className="text-[#9B9C9E] hover:text-[#E21818]"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="bg-[#1A1C1F] p-6">
              <h3 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">All Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#33383D] text-[#9B9C9E]">
                      <th className="py-2 pr-4">Order ID</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "#1001", customer: "John Smith", date: "Jul 14, 2026", status: "Completed", total: "$249.99" },
                      { id: "#1002", customer: "Sarah Lee", date: "Jul 13, 2026", status: "Processing", total: "$349.99" },
                      { id: "#1003", customer: "Mike Brown", date: "Jul 12, 2026", status: "Pending", total: "$899.99" },
                      { id: "#1004", customer: "Emma Wilson", date: "Jul 11, 2026", status: "Completed", total: "$349.99" },
                      { id: "#1005", customer: "David Chen", date: "Jul 10, 2026", status: "Cancelled", total: "$150.75" },
                    ].map(order => (
                      <tr key={order.id} className="border-b border-[#33383D]/50">
                        <td className="py-3 pr-4 text-white">{order.id}</td>
                        <td className="py-3 pr-4 text-[#9B9C9E]">{order.customer}</td>
                        <td className="py-3 pr-4 text-[#9B9C9E]">{order.date}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 text-[10px] uppercase ${
                            order.status === "Completed" ? "bg-green-500/20 text-green-400" :
                            order.status === "Processing" ? "bg-blue-500/20 text-blue-400" :
                            order.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>{order.status}</span>
                        </td>
                        <td className="py-3 pr-4 font-bold text-[#E21818]">{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {tab === "customers" && (
            <div className="bg-[#1A1C1F] p-6">
              <h3 className="mb-4 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Customers</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#33383D] text-[#9B9C9E]">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Orders</th>
                      <th className="py-2 pr-4">Total Spent</th>
                      <th className="py-2 pr-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "John Smith", email: "john@email.com", orders: "3", spent: "$1,499.97", joined: "Jan 2026" },
                      { name: "Sarah Lee", email: "sarah@email.com", orders: "2", spent: "$699.98", joined: "Feb 2026" },
                      { name: "Mike Brown", email: "mike@email.com", orders: "1", spent: "$899.99", joined: "Mar 2026" },
                      { name: "Emma Wilson", email: "emma@email.com", orders: "4", spent: "$1,200.00", joined: "Apr 2026" },
                    ].map(c => (
                      <tr key={c.email} className="border-b border-[#33383D]/50">
                        <td className="py-3 pr-4 text-white">{c.name}</td>
                        <td className="py-3 pr-4 text-[#9B9C9E]">{c.email}</td>
                        <td className="py-3 pr-4 text-[#9B9C9E]">{c.orders}</td>
                        <td className="py-3 pr-4 text-[#E21818]">{c.spent}</td>
                        <td className="py-3 pr-4 text-[#9B9C9E]">{c.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
