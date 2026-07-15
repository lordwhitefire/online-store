"use client"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { useState, useEffect, useCallback } from "react"
import { DollarSign, TrendingUp, Package, Users } from "lucide-react"
import { FileText, FileCode, ShoppingCart, Plus, Edit, Trash2, Search, Save, Upload, X, Check } from "lucide-react"

interface Product {
  slug: string
  name: string
  price: string
  sku: string
  categories: string[]
  tags: string[]
  shortDescription: string
  fullDescription: string
  stock: string
  rating: string
  mainImage: string
  galleryImages: string[]
}

interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  content: string
  image: string
}

interface Order {
  id: string
  orderNumber: number
  customerName: string
  customerEmail: string
  status: string
  total: number
  items: any[]
  createdAt: string
}

interface Customer {
  id: string
  email: string
  name: string
  totalOrders: number
  totalSpent: number
}

type Tab = "products" | "blog" | "pages" | "orders" | "customers"
type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("products")
  const [products, setProducts] = useState<Product[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [pages, setPages] = useState<any[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [editingPage, setEditingPage] = useState<any | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [stats, setStats] = useState({ totalRevenue: "0", totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalProducts: 0, totalCustomers: 0 })

  // Load data on mount
  useEffect(() => {
    loadProducts()
    loadBlog()
    loadPages()
    loadOrders()
    loadCustomers()
    loadStats()
  }, [])

  const loadStats = async () => {
    const res = await fetch("/api/admin/stats")
    const data = await res.json()
    setStats(data)
  }

  const loadProducts = async () => {
    const res = await fetch("/api/admin/products")
    const data = await res.json()
    setProducts(data)
  }
  const loadBlog = async () => {
    const res = await fetch("/api/admin/blog")
    const data = await res.json()
    setBlogPosts(data)
  }
  const loadPages = async () => {
    const res = await fetch("/api/admin/pages")
    const data = await res.json()
    setPages(data)
  }
  const loadOrders = async () => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(data)
  }
  const loadCustomers = async () => {
    const res = await fetch("/api/customers")
    const data = await res.json()
    setCustomers(data)
  }

  // Save functions
  const saveProduct = async (slug: string, data: Product) => {
    setSaveStatus("saving")
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", slug, data })
    })
    if (res.ok) { setSaveStatus("saved"); setTimeout(() => setSaveStatus("idle"), 2000) }
    else { setSaveStatus("error") }
    await loadProducts()
  }

  const deleteProduct = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", slug })
    })
    await loadProducts()
  }

  const saveBlogPost = async (slug: string, data: BlogPost) => {
    setSaveStatus("saving")
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", slug, data })
    })
    if (res.ok) { setSaveStatus("saved"); setTimeout(() => setSaveStatus("idle"), 2000) }
    else { setSaveStatus("error") }
    await loadBlog()
  }

  const savePage = async (pageName: string, data: any) => {
    setSaveStatus("saving")
    const res = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", pageName, data })
    })
    if (res.ok) { setSaveStatus("saved"); setTimeout(() => setSaveStatus("idle"), 2000) }
    else { setSaveStatus("error") }
    await loadPages()
  }

  // Image upload
  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
    if (res.ok) {
      const data = await res.json()
      return data.url
    }
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-6 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Admin Dashboard</h1>
          {saveStatus !== "idle" && (
            <div className={`mt-2 text-xs font-bold uppercase ${saveStatus === "saving" ? "text-yellow-400" : saveStatus === "saved" ? "text-green-400" : "text-red-400"}`}>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "✓ Saved!" : "✗ Error saving"}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-[#33383D]">
            {([
              { id: "products", label: `Products (${products.length})`, icon: Package },
              { id: "blog", label: `Blog (${blogPosts.length})`, icon: FileText },
              { id: "pages", label: `Pages (${pages.length})`, icon: FileCode },
              { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingCart },
              { id: "customers", label: `Customers (${customers.length})`, icon: Users },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase transition-colors ${tab === t.id ? "border-[#E21818] text-white" : "border-transparent text-[#9B9C9E] hover:text-white"}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* PRODUCTS TAB */}
          {tab === "products" && !editingProduct && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-[#9B9C9E]">Click any product to edit. Changes save to JSON files in the data folder.</p>
                <button onClick={() => { const slug = prompt("Enter product slug (e.g., my-new-product):"); if (slug) { setEditingProduct({ slug: slug.toLowerCase().replace(/\s+/g, "-"), name: "", price: "", sku: "", categories: [], tags: [], shortDescription: "", fullDescription: "", stock: "", rating: "", mainImage: "", galleryImages: [] }); } }} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(p => (
                  <div key={p.slug} className="flex items-center gap-3 bg-[#1A1C1F] p-4 hover:bg-[#222628] cursor-pointer" onClick={() => setEditingProduct({ ...p })}>
                    {p.mainImage && <img src={p.mainImage.startsWith("http") ? p.mainImage.replace("https://musicplace.themerex.net/wp-content/uploads", "/musicplace/images") : p.mainImage} alt="" className="h-14 w-14 shrink-0 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-xs text-[#E21818]">{p.price.match(/\$[\d,.]+/)?.[0] || "No price"}</p>
                      <p className="text-[10px] text-[#9B9C9E] truncate">{p.slug}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.slug) }} className="text-[#9B9C9E] hover:text-[#E21818]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT EDITOR */}
          {tab === "products" && editingProduct && (
            <ProductEditor product={editingProduct} onSave={saveProduct} onCancel={() => setEditingProduct(null)} onUpload={uploadImage} />
          )}

          {/* BLOG TAB */}
          {tab === "blog" && !editingBlog && (
            <div>
              <div className="mb-4">
                <p className="text-xs text-[#9B9C9E]">Click any blog post to edit.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map(p => (
                  <div key={p.slug} className="flex items-center gap-3 bg-[#1A1C1F] p-4 hover:bg-[#222628] cursor-pointer" onClick={() => setEditingBlog({ ...p })}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-[#9B9C9E]">{p.date} • {p.author}</p>
                      <p className="text-[10px] text-[#9B9C9E] truncate">{p.slug}</p>
                    </div>
                    <Edit className="h-4 w-4 text-[#9B9C9E]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG EDITOR */}
          {tab === "blog" && editingBlog && (
            <BlogEditor post={editingBlog} onSave={saveBlogPost} onCancel={() => setEditingBlog(null)} onUpload={uploadImage} />
          )}

          {/* PAGES TAB */}
          {tab === "pages" && !editingPage && (
            <div>
              <div className="mb-4">
                <p className="text-xs text-[#9B9C9E]">Click any page to edit its data. All JSON data is editable.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map(p => (
                  <div key={p.name} className="flex items-center gap-3 bg-[#1A1C1F] p-4 hover:bg-[#222628] cursor-pointer" onClick={() => setEditingPage({ name: p.name, data: JSON.parse(JSON.stringify(p.data)) })}>
                    <FileCode className="h-8 w-8 text-[#E21818]" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white capitalize">{p.name.replace(/-/g, " ")}</p>
                      <p className="text-[10px] text-[#9B9C9E]">{p.name}-info.json</p>
                    </div>
                    <Edit className="h-4 w-4 text-[#9B9C9E]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE EDITOR */}
          {tab === "pages" && editingPage && (
            <PageEditor page={editingPage} onSave={savePage} onCancel={() => setEditingPage(null)} />
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div className="bg-[#1A1C1F] p-6">
              {orders.length === 0 ? (
                <p className="text-center text-sm text-[#9B9C9E] py-8">No orders yet. When customers checkout, orders will appear here.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="border-b border-[#33383D] text-[#9B9C9E]">
                      <th className="py-2 pr-4">Order #</th><th className="py-2 pr-4">Customer</th><th className="py-2 pr-4">Items</th><th className="py-2 pr-4">Total</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Date</th>
                    </tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} className="border-b border-[#33383D]/50">
                          <td className="py-3 pr-4 text-white">#{o.orderNumber}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{o.customerName}<br /><span className="text-[10px]">{o.customerEmail}</span></td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{o.items?.length || 0} items</td>
                          <td className="py-3 pr-4 text-[#E21818] font-bold">${o.total.toFixed(2)}</td>
                          <td className="py-3 pr-4"><span className="px-2 py-1 text-[10px] uppercase bg-yellow-500/20 text-yellow-400">{o.status}</span></td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {tab === "customers" && (
            <div className="bg-[#1A1C1F] p-6">
              {customers.length === 0 ? (
                <p className="text-center text-sm text-[#9B9C9E] py-8">No customers yet. When customers checkout, they will appear here.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="border-b border-[#33383D] text-[#9B9C9E]">
                      <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Email</th><th className="py-2 pr-4">Orders</th><th className="py-2 pr-4">Total Spent</th>
                    </tr></thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id} className="border-b border-[#33383D]/50">
                          <td className="py-3 pr-4 text-white">{c.name}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{c.email}</td>
                          <td className="py-3 pr-4 text-[#9B9C9E]">{c.totalOrders}</td>
                          <td className="py-3 pr-4 text-[#E21818] font-bold">${c.totalSpent.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

// ─── Product Editor Component ───
function ProductEditor({ product, onSave, onCancel, onUpload }: { product: Product; onSave: (slug: string, data: Product) => void; onCancel: () => void; onUpload: (file: File) => Promise<string | null> }) {
  const [data, setData] = useState<Product>({ ...product })
  const update = (field: keyof Product, value: any) => setData(prev => ({ ...prev, [field]: value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await onUpload(file)
    if (url) update("mainImage", url)
  }

  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3">
        <h3 className="text-sm font-bold uppercase text-white">{product.name ? "Edit Product" : "New Product"}</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(data.slug, data)} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Slug (URL)</label><input type="text" value={data.slug} onChange={e => update("slug", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Name</label><input type="text" value={data.name} onChange={e => update("name", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Price (raw HTML from WooCommerce)</label><input type="text" value={data.price} onChange={e => update("price", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">SKU</label><input type="text" value={data.sku} onChange={e => update("sku", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Categories (comma separated)</label><input type="text" value={data.categories.join(", ")} onChange={e => update("categories", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Tags (comma separated)</label><input type="text" value={data.tags.join(", ")} onChange={e => update("tags", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Main Image URL</label><div className="flex gap-2"><input type="text" value={data.mainImage} onChange={e => update("mainImage", e.target.value)} className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /><label className="flex cursor-pointer items-center gap-1 border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:text-white"><Upload className="h-4 w-4" /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></label></div></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Short Description</label><textarea value={data.shortDescription} onChange={e => update("shortDescription", e.target.value)} rows={2} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Full Description (HTML)</label><textarea value={data.fullDescription} onChange={e => update("fullDescription", e.target.value)} rows={6} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none font-mono text-xs" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Stock</label><input type="text" value={data.stock} onChange={e => update("stock", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Rating</label><input type="text" value={data.rating} onChange={e => update("rating", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
      </div>

      {data.mainImage && <div className="mt-4"><p className="mb-1 text-xs text-[#9B9C9E]">Preview:</p><img src={data.mainImage.startsWith("http") ? data.mainImage.replace("https://musicplace.themerex.net/wp-content/uploads", "/musicplace/images") : data.mainImage} alt="" className="h-32 w-32 object-cover border border-[#33383D]" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3" }} /></div>}
    </div>
  )
}

// ─── Blog Editor Component ───
function BlogEditor({ post, onSave, onCancel, onUpload }: { post: BlogPost; onSave: (slug: string, data: BlogPost) => void; onCancel: () => void; onUpload: (file: File) => Promise<string | null> }) {
  const [data, setData] = useState<BlogPost>({ ...post })
  const update = (field: keyof BlogPost, value: any) => setData(prev => ({ ...prev, [field]: value }))

  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3">
        <h3 className="text-sm font-bold uppercase text-white">Edit Blog Post</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(data.slug, data)} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Slug</label><input type="text" value={data.slug} onChange={e => update("slug", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Title</label><input type="text" value={data.title} onChange={e => update("title", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Date</label><input type="text" value={data.date} onChange={e => update("date", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Author</label><input type="text" value={data.author} onChange={e => update("author", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Image URL</label><input type="text" value={data.image} onChange={e => update("image", e.target.value)} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Categories (comma separated)</label><input type="text" value={data.categories.join(", ")} onChange={e => update("categories", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div><label className="mb-1 block text-xs text-[#9B9C9E]">Tags (comma separated)</label><input type="text" value={data.tags.join(", ")} onChange={e => update("tags", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">Content (HTML)</label><textarea value={data.content} onChange={e => update("content", e.target.value)} rows={8} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none font-mono text-xs" /></div>
      </div>
    </div>
  )
}

// ─── Page Editor Component (raw JSON editor) ───
function PageEditor({ page, onSave, onCancel }: { page: { name: string; data: any }; onSave: (name: string, data: any) => void; onCancel: () => void }) {
  const [jsonText, setJsonText] = useState(JSON.stringify(page.data, null, 2))

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText)
      onSave(page.name, parsed)
    } catch (e) {
      alert("Invalid JSON: " + (e as Error).message)
    }
  }

  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3">
        <h3 className="text-sm font-bold uppercase text-white">Edit: {page.name}-info.json</h3>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
        </div>
      </div>
      <textarea value={jsonText} onChange={e => setJsonText(e.target.value)} rows={24} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white focus:border-[#E21818] focus:outline-none font-mono" />
      <p className="mt-2 text-[10px] text-[#9B9C9E]">Edit the raw JSON. Click Save to write changes to the data folder.</p>
    </div>
  )
}
