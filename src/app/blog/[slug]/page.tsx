import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { getBlogPost, getBlogPosts } from "@/lib/data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Eye, MessageCircle, Heart, Search, Calendar, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export async function generateStaticParams() {
  return getBlogPosts().map(p => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  const allPosts = getBlogPosts()
  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3)

  // Blog images for sidebar + related
  const blogImages = [
    "/musicplace/images/home/blog-keyboard.png",
    "/musicplace/images/home/blog-guitar.png",
    "/musicplace/images/home/blog-headphones.png",
  ]

  // Tags from the blog post
  const tags = (post.tags || ["company", "concept", "sale"]).map(t => t.toUpperCase())

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Post Formats</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/blog" className="hover:text-[#E21818]">Blog</Link>
            <span className="mx-1">/</span>
            <span className="text-white">{post.title}</span>
          </nav>
        </div>

        {/* Main Content — two column: post + sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* LEFT: Blog Post */}
            <div className="flex-1 lg:w-[68%]">
              <article className="bg-[#1A1C1F]">
                {/* Featured Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={blogImages[0]}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="mb-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>
                    {post.title}
                  </h2>

                  {/* Date + Author */}
                  <div className="mb-4 flex items-center gap-4 text-xs text-[#9B9C9E]">
                    <span>{post.date}</span>
                    <span>By {post.author}</span>
                  </div>

                  {/* Engagement metrics */}
                  <div className="mb-4 flex items-center gap-4 border-y border-[#33383D] py-2 text-xs text-[#9B9C9E]">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 489</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 3</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 0</span>
                  </div>

                  {/* Post text */}
                  <div className="space-y-4 text-sm leading-relaxed text-[#9B9C9E]">
                    <p>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.</p>
                    <p>Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet, consectetur.</p>
                    <p>Adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
                  </div>

                  {/* Tags + Share */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#33383D] pt-4">
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <span key={tag} className="border border-[#33383D] px-2 py-1 text-[10px] uppercase text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818] cursor-pointer">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9B9C9E]">Share:</span>
                      <Facebook className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                      <Twitter className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                      <Instagram className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                      <Linkedin className="h-4 w-4 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                    </div>
                  </div>
                </div>
              </article>

              {/* Related Posts */}
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-bold uppercase text-white">Related Posts</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {relatedPosts.map((rp, i) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group bg-[#1A1C1F] overflow-hidden">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={blogImages[(i + 1) % 3]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold uppercase text-white group-hover:text-[#E21818] line-clamp-2">{rp.title}</h4>
                        <p className="mt-1 text-[10px] text-[#9B9C9E]">{rp.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <aside className="lg:w-[30%]">
              {/* Search */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Search</h3>
                <div className="flex">
                  <input type="text" placeholder="Search…" className="flex-1 border border-[#33383D] bg-[#141618] px-3 py-2 text-xs text-white placeholder:text-[#9B9C9E] focus:outline-none" />
                  <button className="bg-[#E21818] px-3 py-2 text-white hover:bg-[#C51515]" aria-label="Search"><Search className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Latest News */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Latest News</h3>
                <ul className="space-y-3">
                  {allPosts.slice(0, 3).map((np, i) => (
                    <li key={np.slug}>
                      <Link href={`/blog/${np.slug}`} className="flex items-center gap-3 group">
                        <img src={blogImages[i % 3]} alt="" className="h-12 w-12 object-cover" />
                        <div>
                          <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{np.title}</p>
                          <p className="text-[10px] text-[#9B9C9E]">{np.date}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Calendar */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Calendar</h3>
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-between text-xs text-[#9B9C9E]">
                    <span>←</span>
                    <span className="font-bold text-white">July 2026</span>
                    <span>→</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[10px]">
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-[#9B9C9E] font-bold">{d}</span>)}
                    {Array.from({ length: 31 }, (_, i) => (
                      <span key={i} className={`py-1 ${i === 13 ? "bg-[#E21818] text-white" : "text-[#9B9C9E] hover:text-[#E21818] cursor-pointer"}`}>{i + 1}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["ACOUSTIC KITS", "COMPANY", "CONCEPT", "CREATIVE", "DRUMS", "ELECTRIC GUITARS", "EVENT", "LIFESTYLE", "MUSIC", "POPULAR", "SALE"].map(tag => (
                    <span key={tag} className="border border-[#33383D] px-2 py-1 text-[10px] uppercase text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818] cursor-pointer">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4 bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Comments</h3>
                <ul className="space-y-2 text-xs">
                  <li className="text-[#9B9C9E]"><MessageCircle className="mr-1 inline h-3 w-3 text-[#E21818]" /><span className="text-white">John Smith</span> on <Link href="#" className="text-[#E21818] hover:underline">Adjustable Online Bass Guitar Tuner</Link></li>
                  <li className="text-[#9B9C9E]"><MessageCircle className="mr-1 inline h-3 w-3 text-[#E21818]" /><span className="text-white">Andrew Brown</span> on <Link href="#" className="text-[#E21818] hover:underline">How to Tune Your Banjo</Link></li>
                  <li className="text-[#9B9C9E]"><MessageCircle className="mr-1 inline h-3 w-3 text-[#E21818]" /><span className="text-white">Sonya Willis</span> on <Link href="#" className="text-[#E21818] hover:underline">Benefits of Playing Music</Link></li>
                </ul>
              </div>

              {/* Socials */}
              <div className="bg-[#1A1C1F] p-4">
                <h3 className="mb-3 border-b border-[#33383D] pb-2 text-sm font-bold uppercase text-white">Socials</h3>
                <div className="flex gap-3">
                  <Facebook className="h-5 w-5 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                  <Twitter className="h-5 w-5 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                  <Instagram className="h-5 w-5 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                  <Linkedin className="h-5 w-5 text-[#9B9C9E] hover:text-[#E21818] cursor-pointer" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
