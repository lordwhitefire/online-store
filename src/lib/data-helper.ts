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
