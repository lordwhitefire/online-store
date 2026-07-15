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

          {/* PAGE EDITOR — uses form editor for content pages, raw JSON for info pages */}
          {tab === "pages" && editingPage && (
            editingPage.data?.hero ? (
              <HomeContentEditor page={editingPage} onSave={savePage} onCancel={() => setEditingPage(null)} />
            ) : editingPage.data?.tiles ? (
              <HomeContentEditor page={editingPage} onSave={savePage} onCancel={() => setEditingPage(null)} />
            ) : editingPage.data?.section1Title ? (
              <GenericContentEditor page={editingPage} onSave={savePage} onCancel={() => setEditingPage(null)} />
            ) : (
              <PageEditor page={editingPage} onSave={savePage} onCancel={() => setEditingPage(null)} />
            )
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
  const handleSave = () => { try { const parsed = JSON.parse(jsonText); onSave(page.name, parsed) } catch (e) { alert("Invalid JSON: " + (e as Error).message) } }
  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3">
        <h3 className="text-sm font-bold uppercase text-white">Edit: {page.name}</h3>
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

// ─── Reusable field components ───
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="mb-1 block text-xs text-[#9B9C9E]">{label}</label><input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
}
function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return <div className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">{label}</label><textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={rows} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 mt-6 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white first:mt-0">{children}</h3>
}

// ─── Home Content Editor — dedicated form for home-content.json ───
function HomeContentEditor({ page, onSave, onCancel }: { page: { name: string; data: any }; onSave: (name: string, data: any) => void; onCancel: () => void }) {
  const [data, setData] = useState<any>(JSON.parse(JSON.stringify(page.data)))
  const update = (path: string, value: any) => {
    const keys = path.split(".")
    const newData = JSON.parse(JSON.stringify(data))
    let obj = newData
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]] = value
    setData(newData)
  }
  const updateArrayItem = (arrPath: string, index: number, field: string, value: any) => {
    const keys = arrPath.split(".")
    const newData = JSON.parse(JSON.stringify(data))
    let obj = newData
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
    obj[keys[keys.length - 1]][index][field] = value
    setData(newData)
  }
  const inputClass = "w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none"

  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3 sticky top-0 bg-[#1A1C1F] z-10">
        <h3 className="text-sm font-bold uppercase text-white">Edit Homepage Content</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(page.name, data)} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save All</button>
          <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {/* Hero Slides */}
        <SectionTitle>Hero Slide 1 (Person Right, Text Left)</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Headline" value={data.hero?.slide1?.headline} onChange={v => update("hero.slide1.headline", v)} />
          <Field label="Button Text" value={data.hero?.slide1?.buttonText} onChange={v => update("hero.slide1.buttonText", v)} />
          <TextArea label="Subheadline" value={data.hero?.slide1?.subheadline} onChange={v => update("hero.slide1.subheadline", v)} />
          <Field label="Button Link" value={data.hero?.slide1?.buttonHref} onChange={v => update("hero.slide1.buttonHref", v)} />
          <Field label="Image URL" value={data.hero?.slide1?.image} onChange={v => update("hero.slide1.image", v)} />
        </div>

        <SectionTitle>Hero Slide 2 (Person Left, Text Right)</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Headline" value={data.hero?.slide2?.headline} onChange={v => update("hero.slide2.headline", v)} />
          <Field label="Button Text" value={data.hero?.slide2?.buttonText} onChange={v => update("hero.slide2.buttonText", v)} />
          <TextArea label="Subheadline" value={data.hero?.slide2?.subheadline} onChange={v => update("hero.slide2.subheadline", v)} />
          <Field label="Button Link" value={data.hero?.slide2?.buttonHref} onChange={v => update("hero.slide2.buttonHref", v)} />
          <Field label="Image URL" value={data.hero?.slide2?.image} onChange={v => update("hero.slide2.image", v)} />
        </div>

        {/* Category Tiles */}
        <SectionTitle>Category Tiles (4 tiles)</SectionTitle>
        {data.tiles?.map((tile: any, i: number) => (
          <div key={i} className="mb-4 border border-[#33383D] p-4">
            <p className="mb-2 text-xs font-bold text-[#E21818]">Tile {i + 1}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Title" value={tile.title} onChange={v => updateArrayItem("tiles", i, "title", v)} />
              <Field label="Subtitle" value={tile.subtitle} onChange={v => updateArrayItem("tiles", i, "subtitle", v)} />
              <Field label="Link" value={tile.href} onChange={v => updateArrayItem("tiles", i, "href", v)} />
              <Field label="Image URL" value={tile.image} onChange={v => updateArrayItem("tiles", i, "image", v)} />
              <Field label="CTA Text (optional)" value={tile.cta} onChange={v => updateArrayItem("tiles", i, "cta", v)} />
              <Field label="Description (optional)" value={tile.description} onChange={v => updateArrayItem("tiles", i, "description", v)} />
            </div>
          </div>
        ))}

        {/* Features */}
        <SectionTitle>Features Strip (4 items)</SectionTitle>
        {data.features?.map((f: any, i: number) => (
          <div key={i} className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label={`Icon ${i+1}`} value={f.icon} onChange={v => updateArrayItem("features", i, "icon", v)} />
            <Field label={`Title ${i+1}`} value={f.title} onChange={v => updateArrayItem("features", i, "title", v)} />
            <Field label={`Text ${i+1}`} value={f.text} onChange={v => updateArrayItem("features", i, "text", v)} />
          </div>
        ))}

        {/* Best Sellers */}
        <SectionTitle>Best Sellers</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Section Title" value={data.bestSellers?.title} onChange={v => update("bestSellers.title", v)} />
        </div>
        <p className="mt-2 text-[10px] text-[#9B9C9E]">Product slugs: {data.bestSellers?.productSlugs?.join(", ")}</p>

        {/* Brands */}
        <SectionTitle>Brand Logos</SectionTitle>
        {data.brands?.map((brand: string, i: number) => (
          <div key={i} className="mb-2"><Field label={`Brand ${i+1}`} value={brand} onChange={v => { const newBrands = [...data.brands]; newBrands[i] = v; setData({ ...data, brands: newBrands }) }} /></div>
        ))}

        {/* Promo Banners */}
        <SectionTitle>Promo Banners (3 banners)</SectionTitle>
        {data.promos?.map((promo: any, i: number) => (
          <div key={i} className="mb-4 border border-[#33383D] p-4">
            <p className="mb-2 text-xs font-bold text-[#E21818]">Banner {i + 1}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Title" value={promo.title} onChange={v => updateArrayItem("promos", i, "title", v)} />
              <Field label="Subtitle" value={promo.subtitle} onChange={v => updateArrayItem("promos", i, "subtitle", v)} />
              <Field label="Badge (optional)" value={promo.badge} onChange={v => updateArrayItem("promos", i, "badge", v)} />
              <Field label="CTA Text" value={promo.ctaText} onChange={v => updateArrayItem("promos", i, "ctaText", v)} />
              <Field label="CTA Link" value={promo.ctaHref} onChange={v => updateArrayItem("promos", i, "ctaHref", v)} />
              <Field label="Image URL" value={promo.image} onChange={v => updateArrayItem("promos", i, "image", v)} />
            </div>
          </div>
        ))}

        {/* Featured Items */}
        <SectionTitle>Featured Items</SectionTitle>
        <Field label="Section Title" value={data.featured?.title} onChange={v => update("featured.title", v)} />

        {/* Music Workshop */}
        <SectionTitle>Music Workshop</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" value={data.workshop?.title} onChange={v => update("workshop.title", v)} />
          <Field label="Subtitle" value={data.workshop?.subtitle} onChange={v => update("workshop.subtitle", v)} />
          <Field label="Primary Button" value={data.workshop?.primaryButton} onChange={v => update("workshop.primaryButton", v)} />
          <Field label="Secondary Button" value={data.workshop?.secondaryButton} onChange={v => update("workshop.secondaryButton", v)} />
          <TextArea label="Description" value={data.workshop?.description} onChange={v => update("workshop.description", v)} />
          <Field label="Image URL" value={data.workshop?.image} onChange={v => update("workshop.image", v)} />
        </div>

        {/* What's New */}
        <SectionTitle>What's New</SectionTitle>
        <Field label="Section Title" value={data.whatsNew?.title} onChange={v => update("whatsNew.title", v)} />

        {/* Newsletter */}
        <SectionTitle>Newsletter</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" value={data.newsletter?.title} onChange={v => update("newsletter.title", v)} />
          <Field label="Placeholder" value={data.newsletter?.placeholder} onChange={v => update("newsletter.placeholder", v)} />
          <Field label="Button Text" value={data.newsletter?.buttonText} onChange={v => update("newsletter.buttonText", v)} />
          <TextArea label="Description" value={data.newsletter?.description} onChange={v => update("newsletter.description", v)} />
        </div>

        {/* Testimonial */}
        <SectionTitle>Testimonial</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Author" value={data.testimonial?.author} onChange={v => update("testimonial.author", v)} />
          <Field label="Role" value={data.testimonial?.role} onChange={v => update("testimonial.role", v)} />
          <Field label="Image URL" value={data.testimonial?.image} onChange={v => update("testimonial.image", v)} />
          <TextArea label="Quote" value={data.testimonial?.quote} onChange={v => update("testimonial.quote", v)} />
        </div>

        {/* Footer */}
        <SectionTitle>Footer</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Featured Title" value={data.footer?.featuredTitle} onChange={v => update("footer.featuredTitle", v)} />
          <Field label="Reviews Title" value={data.footer?.reviewsTitle} onChange={v => update("footer.reviewsTitle", v)} />
          <Field label="Arrivals Title" value={data.footer?.arrivalsTitle} onChange={v => update("footer.arrivalsTitle", v)} />
          <Field label="Ad Title" value={data.footer?.adTitle} onChange={v => update("footer.adTitle", v)} />
          <Field label="Ad Link" value={data.footer?.adHref} onChange={v => update("footer.adHref", v)} />
          <Field label="Ad Image" value={data.footer?.adImage} onChange={v => update("footer.adImage", v)} />
        </div>
      </div>

      {/* Sticky save bar at bottom */}
      <div className="mt-4 flex justify-end gap-2 border-t border-[#33383D] pt-4">
        <button onClick={() => onSave(page.name, data)} className="flex items-center gap-2 bg-[#E21818] px-6 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save All Changes</button>
        <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
      </div>
    </div>
  )
}

// ─── Generic Content Editor — for pages with section1Title, section2Title etc ───
function GenericContentEditor({ page, onSave, onCancel }: { page: { name: string; data: any }; onSave: (name: string, data: any) => void; onCancel: () => void }) {
  const [data, setData] = useState<any>(JSON.parse(JSON.stringify(page.data)))

  const renderField = (key: string, value: any, path: string = "") => {
    const fullPath = path ? `${path}.${key}` : key
    if (typeof value === "string" && value.length > 60) {
      return <div key={key} className="sm:col-span-2"><label className="mb-1 block text-xs text-[#9B9C9E]">{key}</label><textarea value={value} onChange={e => { const newData = JSON.parse(JSON.stringify(data)); const keys = fullPath.split("."); let obj = newData; for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]; obj[keys[keys.length - 1]] = e.target.value; setData(newData) }} rows={3} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
    } else if (typeof value === "string") {
      return <div key={key}><label className="mb-1 block text-xs text-[#9B9C9E]">{key}</label><input type="text" value={value} onChange={e => { const newData = JSON.parse(JSON.stringify(data)); const keys = fullPath.split("."); let obj = newData; for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]; obj[keys[keys.length - 1]] = e.target.value; setData(newData) }} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" /></div>
    } else if (Array.isArray(value)) {
      return <div key={key} className="sm:col-span-2"><p className="mb-1 text-xs font-bold text-[#9B9C9E]">{key} ({value.length} items)</p><div className="space-y-2">{value.map((item: any, i: number) => <div key={i} className="border border-[#33383D] p-3 text-xs text-[#9B9C9E]">{typeof item === "string" ? item : JSON.stringify(item).substring(0, 100) + "..."}</div>)}</div></div>
    } else if (typeof value === "object" && value !== null) {
      return <div key={key} className="sm:col-span-2 border border-[#33383D] p-3"><p className="mb-2 text-xs font-bold text-[#E21818]">{key}</p><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{Object.entries(value).map(([k, v]) => renderField(k, v, fullPath))}</div></div>
    }
    return null
  }

  return (
    <div className="bg-[#1A1C1F] p-6">
      <div className="mb-4 flex items-center justify-between border-b border-[#33383D] pb-3 sticky top-0 bg-[#1A1C1F] z-10">
        <h3 className="text-sm font-bold uppercase text-white">Edit: {page.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => onSave(page.name, data)} className="flex items-center gap-2 bg-[#E21818] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save</button>
          <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
        </div>
      </div>
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(data).map(([key, value]) => renderField(key, value))}
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2 border-t border-[#33383D] pt-4">
        <button onClick={() => onSave(page.name, data)} className="flex items-center gap-2 bg-[#E21818] px-6 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]"><Save className="h-4 w-4" /> Save All Changes</button>
        <button onClick={onCancel} className="flex items-center gap-2 border border-[#33383D] px-4 py-2 text-xs font-bold uppercase text-[#9B9C9E] hover:text-white"><X className="h-4 w-4" /> Cancel</button>
      </div>
    </div>
  )
}
