import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { getBlogPosts } from "@/lib/data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function BlogPage() {
  const posts = getBlogPosts()
  // Use up to 9 posts for the 3x3 grid
  const blogPosts = posts.slice(0, 9)

  // Blog images (matching homepage What's New images)
  const blogImages = [
    "/musicplace/images/home/blog-keyboard.png",
    "/musicplace/images/home/blog-guitar.png",
    "/musicplace/images/home/blog-headphones.png",
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Blog Masonry</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Blog</span>
          </nav>
        </div>

        {/* Blog Grid — 3 columns, horizontal cards (image left, text right) */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => {
              const postImg = blogImages[i % 3]
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex bg-[#1A1C1F] transition-colors hover:bg-[#222628]"
                >
                  {/* Image LEFT */}
                  <div className="w-2/5 shrink-0 overflow-hidden">
                    <img
                      src={postImg}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* Text RIGHT */}
                  <div className="flex w-3/5 flex-col p-4">
                    <h3 className="mb-2 text-sm font-bold uppercase text-white group-hover:text-[#E21818]" style={{ fontFamily: "var(--font-lato)" }}>
                      {post.title}
                    </h3>
                    <p className="mb-1 text-xs text-[#9B9C9E]">{post.date}</p>
                    <p className="mb-2 text-xs text-[#9B9C9E]">By {post.author}</p>
                    <p className="text-xs leading-relaxed text-[#9B9C9E] line-clamp-3">
                      Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...
                    </p>
                    <span className="mt-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E21818] text-white">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">←</button>
            <button className="bg-[#E21818] px-3 py-2 text-xs font-bold text-white">1</button>
            <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">2</button>
            <button className="border border-[#33383D] px-3 py-2 text-xs text-[#9B9C9E] hover:border-[#E21818] hover:text-white">→</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
