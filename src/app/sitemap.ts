import { MetadataRoute } from "next"
import { getProducts } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://musicplace.themerex.net"
  const staticPages = [
    "", "/shop", "/sale", "/blog", "/about", "/contact", "/gallery",
    "/services", "/staff", "/privacy-policy", "/service-plus", "/login"
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }))

  const productPages = getProducts().map(p => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const categoryPages = getProducts().flatMap(p => p.categories || []).filter((v, i, a) => a.indexOf(v) === i).map(cat => ({
    url: `${baseUrl}/category/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
