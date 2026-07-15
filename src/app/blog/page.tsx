import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { getBlogPosts } from "@/lib/data"
import { getBlogContent } from "@/lib/data-helper"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function BlogPage() {
  const posts = getBlogPosts().slice(0, 9)
  const c = getBlogContent()
  const blogImages = ["/musicplace/images/home/blog-keyboard.png", "/musicplace/images/home/blog-guitar.png", "/musicplace/images/home/blog-headphones.png"]
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center"><h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{c.title}</h1><nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">Blog</span></nav></div>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex bg-[#1A1C1F] transition-colors hover:bg-[#222628]">
                <div className="w-2/5 shrink-0 overflow-hidden"><img src={blogImages[i % 3]} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
                <div className="flex w-3/5 flex-col p-4"><h3 className="mb-2 text-sm font-bold uppercase text-white group-hover:text-[#E21818]" style={{ fontFamily: "var(--font-lato)" }}>{post.title}</h3><p className="mb-1 text-xs text-[#9B9C9E]">{post.date}</p><p className="mb-2 text-xs text-[#9B9C9E]">By {post.author}</p><p className="text-xs leading-relaxed text-[#9B9C9E] line-clamp-3">{c.excerptText}</p><span className="mt-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E21818] text-white"><ArrowRight className="h-3 w-3" /></span></div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
