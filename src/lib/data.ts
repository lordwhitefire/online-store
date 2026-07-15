// Data loader — server-side only (uses fs)
// ProductCard receives data as props, doesn't import this file
import fs from "fs"
import path from "path"

export interface Product {
  name: string
  slug: string
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

export interface BlogPost {
  title: string
  slug: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  content: string
  image: string
}

const DATA_DIR = path.join(process.cwd(), "data")

function loadProducts(): Product[] {
  try {
    const dir = path.join(DATA_DIR, "products")
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
    return files.map(f => {
      const slug = f.replace(".json", "")
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))
      return { ...data, slug } as Product
    })
  } catch {
    return []
  }
}

function loadBlogPosts(): BlogPost[] {
  try {
    const dir = path.join(DATA_DIR, "blog")
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && f !== "_all-posts.json")
    return files.map(f => {
      const slug = f.replace(".json", "")
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))
      return { ...data, slug } as BlogPost
    })
  } catch {
    return []
  }
}

// Cache
let _products: Product[] | null = null
let _posts: BlogPost[] | null = null

export function getProducts(): Product[] {
  if (!_products) _products = loadProducts()
  return _products
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find(p => p.slug === slug)
}

export function getProductsByCategory(cat: string): Product[] {
  const decoded = decodeURIComponent(cat).replace(/-/g, " ")
  return getProducts().filter(p =>
    p.categories?.some(c => c.toLowerCase().includes(decoded.toLowerCase()))
  )
}

export function getSaleProducts(): Product[] { return getProducts().slice(0, 8) }
export function getBestSellers(): Product[] { return getProducts().slice(0, 4) }
export function getFeaturedProducts(): Product[] { return getProducts().slice(4, 12) }
export function getRelatedProducts(slug: string, limit = 4): Product[] {
  return getProducts().filter(p => p.slug !== slug).slice(0, limit)
}

export function getCategories(): string[] {
  const s = new Set<string>()
  getProducts().forEach(p => p.categories?.forEach(c => s.add(c)))
  return Array.from(s)
}

export function getBlogPosts(): BlogPost[] {
  if (!_posts) _posts = loadBlogPosts()
  return _posts
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug)
}

export function formatPrice(p: string): number {
  if (!p) return 0
  const m = p.match(/\$([\d,.]+)/)
  return m ? parseFloat(m[1].replace(/,/g, "")) : 0
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

// Export types for client components
export type { Product as ProductType, BlogPost as BlogPostType }
