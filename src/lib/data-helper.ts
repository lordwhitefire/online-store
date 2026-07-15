/**
 * Data Helper — reads and writes JSON files in the data/ folder.
 *
 * This is a TEMPORARY data layer designed to be easily replaced by Sanity CMS.
 * When you install Sanity:
 *   1. Replace this file with src/lib/sanity-client.ts
 *   2. Keep the same function signatures (getAll, getOne, create, update, delete)
 *   3. Everything else (admin, API routes, components) stays the same
 */

import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "musicplace-crawl-extracted", "musicplace-crawl", "data")

// ─── Types ───

export interface Product {
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

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  content: string
  image: string
}

export interface PageData {
  [key: string]: any
}

// ─── Products ───

export function getAllProducts(): Product[] {
  const dir = path.join(DATA_DIR, "products")
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
  return files.map(f => {
    const slug = f.replace(".json", "")
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))
    return { ...data, slug }
  })
}

export function getProduct(slug: string): Product | null {
  const filePath = path.join(DATA_DIR, "products", `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  return { ...data, slug }
}

export function saveProduct(slug: string, data: Partial<Product>): void {
  const filePath = path.join(DATA_DIR, "products", `${slug}.json`)
  const existing = getProduct(slug) || {} as Product
  const updated = { ...existing, ...data }
  delete (updated as any).slug
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8")
}

export function createProduct(slug: string, data: Partial<Product>): void {
  saveProduct(slug, data)
}

export function deleteProduct(slug: string): void {
  const filePath = path.join(DATA_DIR, "products", `${slug}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

// ─── Blog Posts ───

export function getAllBlogPosts(): BlogPost[] {
  const dir = path.join(DATA_DIR, "blog")
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && f !== "_all-posts.json")
  return files.map(f => {
    const slug = f.replace(".json", "")
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"))
    return { ...data, slug }
  })
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(DATA_DIR, "blog", `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  return { ...data, slug }
}

export function saveBlogPost(slug: string, data: Partial<BlogPost>): void {
  const filePath = path.join(DATA_DIR, "blog", `${slug}.json`)
  const existing = getBlogPost(slug) || {} as BlogPost
  const updated = { ...existing, ...data }
  delete (updated as any).slug
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8")
}

// ─── Page Data (about, contact, home, etc.) ───

export function getPageData(pageName: string): PageData {
  const filePath = path.join(DATA_DIR, `${pageName}-info.json`)
  if (!fs.existsSync(filePath)) return {}
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

export function savePageData(pageName: string, data: PageData): void {
  const filePath = path.join(DATA_DIR, `${pageName}-info.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// ─── List all editable pages ───

export function getAllPageNames(): string[] {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith("-info.json"))
  return files.map(f => f.replace("-info.json", ""))
}

// ─── Image upload ───

export function saveImage(filename: string, buffer: Buffer): string {
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, filename)
  fs.writeFileSync(filePath, buffer)
  return `/uploads/${filename}`
}

// ─── Home Content ───

export function getHomeContent(): any {
  const filePath = path.join(DATA_DIR, "home-content.json")
  if (!fs.existsSync(filePath)) return {}
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

// ─── Page Content Readers ───

export function getContent(fileName: string): any {
  const filePath = path.join(DATA_DIR, `${fileName}.json`)
  if (!fs.existsSync(filePath)) return {}
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

export function getShopContent(): any { return getContent("shop-content") }
export function getSaleContent(): any { return getContent("sale-content") }
export function getAboutContent(): any { return getContent("about-content") }
export function getContactContent(): any { return getContent("contact-content") }
export function getBlogContent(): any { return getContent("blog-content") }
export function getBlogDetailContent(): any { return getContent("blog-detail-content") }
export function getGalleryContent(): any { return getContent("gallery-content") }
export function getServicesContent(): any { return getContent("services-content") }
export function getStaffContent(): any { return getContent("staff-content") }
export function getPrivacyContent(): any { return getContent("privacy-policy-content") }
export function getServicePlusContent(): any { return getContent("service-plus-content") }
export function getCartContent(): any { return getContent("cart-content") }
export function getCheckoutContent(): any { return getContent("checkout-content") }

// ─── Soft Delete ───

export function softDeleteProduct(slug: string): void {
  const dataDir = path.join(DATA_DIR, "products")
  const trashDir = path.join(DATA_DIR, "products", "_trash")
  if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true })
  const src = path.join(dataDir, `${slug}.json`)
  const dest = path.join(trashDir, `${slug}.json`)
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest)
  }
}

export function restoreProduct(slug: string): void {
  const dataDir = path.join(DATA_DIR, "products")
  const trashDir = path.join(dataDir, "_trash")
  const src = path.join(trashDir, `${slug}.json`)
  const dest = path.join(dataDir, `${slug}.json`)
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest)
  }
}

export function getDeletedProducts(): Product[] {
  const trashDir = path.join(DATA_DIR, "products", "_trash")
  if (!fs.existsSync(trashDir)) return []
  const files = fs.readdirSync(trashDir).filter(f => f.endsWith(".json"))
  return files.map(f => {
    const slug = f.replace(".json", "")
    const data = JSON.parse(fs.readFileSync(path.join(trashDir, f), "utf-8"))
    return { ...data, slug }
  })
}
