import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  const dataDir = path.join(process.cwd(), "musicplace-crawl-extracted", "musicplace-crawl", "data", "products")
  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"))
    const products = files.map(f => {
      const slug = f.replace(".json", "")
      const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf-8"))
      return { ...data, slug }
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json([])
  }
}
