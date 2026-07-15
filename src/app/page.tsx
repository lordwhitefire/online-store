import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import { ProductCard } from "@/components/store/ProductCard"
import { HeroSlider } from "@/components/store/HeroSlider"
import { getProducts, getBlogPosts } from "@/lib/data"
import { getHomeContent } from "@/lib/data-helper"
import { Truck, ShieldCheck, Headphones, RefreshCw, ArrowRight, Play, Star, Mail } from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, any> = { truck: Truck, shield: ShieldCheck, headphones: Headphones, refresh: RefreshCw }

export default function HomePage() {
  const content = getHomeContent()
  const allProducts = getProducts()

  const bestSellers = content.bestSellers.productSlugs
    .map((slug: string) => allProducts.find((p: any) => p.slug === slug))
    .filter(Boolean)
    .map((p: any, i: number) => ({ ...p, _img: ["/musicplace/images/home/1.jpg", "/musicplace/images/home/3-e1470062679810.jpg", "/musicplace/images/home/f.jpg", "/musicplace/images/home/2.jpg"][i] }))

  const featured = content.featured.productSlugs
    .map((slug: string) => allProducts.find((p: any) => p.slug === slug))
    .filter(Boolean)
    .map((p: any, i: number) => ({ ...p, _img: ["/musicplace/images/home/j.jpg", "/musicplace/images/home/2-1.jpg", "/musicplace/images/home/3-4.jpg", "/musicplace/images/home/horn.jpg"][i] }))

  const posts = getBlogPosts().slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <HeroSlider slides={[content.hero.slide1, content.hero.slide2]} />

        {/* Category Tiles */}
        <div className="relative z-20 mx-auto -mt-24 max-w-7xl px-4 md:-mt-28">
          <section className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {content.tiles.map((tile: any, i: number) => (
              <Link key={i} href={tile.href} className="group relative flex h-56 flex-col justify-end overflow-hidden bg-[#1A1C1F] p-6 shadow-lg md:h-64" style={tile.bgColor ? { backgroundColor: tile.bgColor } : {}}>
                {tile.image && <img src={tile.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity group-hover:opacity-40" />}
                {tile.image && <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1F] via-[#1A1C1F]/60 to-transparent" />}
                <div className="relative">
                  {tile.subtitle && <p className="text-xs uppercase tracking-wider text-[#9B9C9E]">{tile.subtitle}</p>}
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{tile.title}</h2>
                  {tile.cta && <span className="mt-2 inline-block text-sm font-bold uppercase text-[#E21818]">{tile.cta}</span>}
                  {tile.description && <p className="mt-1 text-sm text-white/85">{tile.description}</p>}
                </div>
              </Link>
            ))}
          </section>
        </div>

        {/* Features Strip */}
        <section className="border-y border-[#33383D] bg-[#1A1C1F] mt-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
            {content.features.map((f: any, i: number) => {
              const Icon = iconMap[f.icon] || Truck
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon className="h-8 w-8 shrink-0 text-[#E21818]" />
                  <div>
                    <p className="text-sm font-bold text-white">{f.title}</p>
                    <p className="text-xs text-[#9B9C9E]">{f.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{content.bestSellers.title}</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="font-bold text-[#E21818]">Filter - All</span>
              <span className="text-[#9B9C9E]">Accessories</span>
              <span className="text-[#9B9C9E]">Drums & Percussion</span>
              <span className="text-[#9B9C9E]">Sort By Date ↓</span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {bestSellers.map((p: any) => <ProductCard key={p.slug} product={p} imageOverride={p._img} />)}
            </div>
          </div>
        </section>

        {/* Brand Logos */}
        <section className="border-y border-[#33383D] bg-[#1A1C1F] py-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">
            {content.brands.map((b: string) => (
              <span key={b} className="text-sm font-bold uppercase tracking-wider text-[#9B9C9E] hover:text-white">{b}</span>
            ))}
          </div>
        </section>

        {/* Promo Banners */}
        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3">
            {content.promos.map((promo: any, i: number) => (
              <div key={i} className="relative flex h-64 flex-col justify-end overflow-hidden bg-[#1A1C1F] p-6">
                {promo.image && <img src={promo.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141618] via-[#141618]/60 to-transparent" />
                {promo.badge && <span className="absolute right-4 top-4 rounded-full bg-[#E21818] px-3 py-1 text-xs font-bold uppercase text-white">{promo.badge}</span>}
                <div className="relative">
                  {promo.title && <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{promo.title}</p>}
                  {promo.subtitle && <p className="mt-1 text-sm text-white/80">{promo.subtitle}</p>}
                  {promo.ctaText && <Link href={promo.ctaHref} className="mt-3 inline-block bg-[#E21818] px-5 py-2 text-xs font-bold uppercase text-white hover:bg-[#C51515]">{promo.ctaText}</Link>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Items */}
        <section className="bg-[#1A1C1F] py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{content.featured.title}</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((p: any) => <ProductCard key={p.slug} product={p} imageOverride={p._img} />)}
            </div>
          </div>
        </section>

        {/* Music Workshop */}
        <section className="mx-auto max-w-7xl px-4 relative min-h-[500px] overflow-hidden bg-[#1b1b22] flex items-center mt-12 mb-12 rounded-lg">
          <div className="absolute inset-0">
            <img src={content.workshop.image} alt="" className="h-full w-full object-cover" style={{ filter: "grayscale(100%) contrast(1.1) brightness(0.8)" }} />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 0%, transparent 55%, rgba(27,27,34,0.5) 65%, #1b1b22 78%)" }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[180px] font-black uppercase tracking-wider text-white/[0.03] select-none" style={{ fontFamily: "var(--font-lato)" }}>WORKSHOP</span>
          </div>
          <div className="relative z-10 w-full">
            <div className="mx-auto max-w-7xl px-4">
              <div className="ml-auto w-[40%] max-w-md text-left pr-8">
                <h2 className="mb-2 text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: "var(--font-lato)" }}>{content.workshop.title}</h2>
                <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[#E21818]">{content.workshop.subtitle}</p>
                <p className="mb-8 text-sm leading-relaxed text-white/75">{content.workshop.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <button className="rounded bg-[#E21818] px-8 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-[#C51515]">{content.workshop.primaryButton}</button>
                  <button className="flex items-center gap-2 text-sm font-bold uppercase text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#555] bg-[#333]"><Play className="h-4 w-4 text-white" /></span>
                    {content.workshop.secondaryButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's New */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>{content.whatsNew.title}</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {posts.map((post: any, i: number) => {
                const postImg = ["/musicplace/images/home/blog-keyboard.png", "/musicplace/images/home/blog-guitar.png", "/musicplace/images/home/blog-headphones.png"][i] || "/musicplace/images/home/blog-headphones.png"
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex bg-[#1A1C1F] transition-colors hover:bg-[#222628]">
                    <div className="w-2/5 shrink-0 overflow-hidden">
                      <img src={postImg} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex w-3/5 flex-col p-4">
                      <h3 className="mb-2 text-sm font-bold uppercase text-white group-hover:text-[#E21818]" style={{ fontFamily: "var(--font-lato)" }}>{post.title}</h3>
                      <p className="mb-2 text-xs text-[#9B9C9E]">{post.date}</p>
                      <p className="mb-3 text-xs text-[#9B9C9E]">By {post.author}</p>
                      <p className="text-xs leading-relaxed text-[#9B9C9E] line-clamp-3">Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...</p>
                      <span className="mt-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E21818] text-white"><ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Newsletter + Testimonial */}
        <section className="mx-auto max-w-7xl px-4 grid md:grid-cols-2">
          <div className="flex flex-col justify-center bg-[#E21818] p-10 md:p-14">
            <h3 className="mb-3 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{content.newsletter.title}</h3>
            <p className="mb-6 text-sm text-white/85">{content.newsletter.description}</p>
            <form className="flex gap-2">
              <input type="email" placeholder={content.newsletter.placeholder} className="flex-1 border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-white focus:outline-none" />
              <button type="submit" className="flex items-center gap-2 bg-[#141618] px-5 py-3 text-sm font-bold uppercase text-white hover:bg-[#1A1C1F]"><Mail className="h-4 w-4" /> {content.newsletter.buttonText}</button>
            </form>
          </div>
          <div className="flex flex-col justify-center bg-[#1A1C1F] p-10 md:p-14">
            <div className="mb-4 text-[#E21818]">
              <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current"><path d="M9.5 6C6.5 6 4 8.5 4 11.5V18h6.5v-6.5H7.5C7.5 9.6 8.6 8.5 10 8.5V6h-.5zm10 0C16.5 6 14 8.5 14 11.5V18h6.5v-6.5h-3c0-1.9 1.1-3 2.5-3V6h-.5z" /></svg>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-[#9B9C9E]">{content.testimonial.quote}</p>
            <div className="flex items-center gap-3">
              <img src={content.testimonial.image} alt={content.testimonial.author} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold uppercase text-white">{content.testimonial.author}</p>
                <p className="text-xs text-[#E21818]">{content.testimonial.role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Columns */}
        <section className="border-t border-[#33383D] bg-[#141618] py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase text-white">{content.footer.featuredTitle}</h4>
              <ul className="space-y-3">
                {[
                  { slug: "tama-s-l-p-big-black-steel-snare-drum", name: "Tama S.L.P. Big Black Steel Snare Drum", img: "/musicplace/images/home/1-1.jpg", price: "$249.99" },
                  { slug: "crosley-cruiser-portable-3-speed-turntab", name: "Crosley Cruiser Portable 3-Speed Turntable", img: "/musicplace/images/home/7-4.jpg", price: "$349.99 – $449.99" },
                ].map(p => (
                  <li key={p.slug}>
                    <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                      <img src={p.img} alt="" className="h-14 w-14 object-cover" />
                      <div>
                        <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p>
                        <p className="text-xs font-bold text-[#E21818]">{p.price}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase text-white">{content.footer.reviewsTitle}</h4>
              <ul className="space-y-3">
                {[
                  { slug: "custom-zone-6-string-full-size-electric", name: "Custom Zone 6-String Full-Size Electric Guitar", img: "/musicplace/images/home/3-2.jpg" },
                  { slug: "gibson-custom-l5-premier-acoustic-guitar", name: "Gibson Custom L5 Premier Acoustic Guitar", img: "/musicplace/images/home/3-4.jpg" },
                ].map(p => (
                  <li key={p.slug}>
                    <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                      <img src={p.img} alt="" className="h-14 w-14 object-cover" />
                      <div>
                        <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-[#E21818] text-[#E21818]" />)}
                          <span className="ml-1 text-xs text-[#9B9C9E]">by Jack Black</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase text-white">{content.footer.arrivalsTitle}</h4>
              <ul className="space-y-3">
                {[
                  { slug: "digital-conversion-turntable", name: "Digital Conversion Turntable", img: "/musicplace/images/home/20-600x800.jpg", price: "$119.00" },
                  { slug: "crosley-cr8005a-cb-cruiser-portable-turn", name: "Crosley CR8005A-CB Cruiser Portable Turntable", img: "/musicplace/images/home/18-600x800.jpg", price: "$350.75" },
                ].map(p => (
                  <li key={p.slug}>
                    <Link href={`/product/${p.slug}`} className="flex items-center gap-3 group">
                      <img src={p.img} alt="" className="h-14 w-14 object-cover" />
                      <div>
                        <p className="line-clamp-2 text-xs text-[#9B9C9E] group-hover:text-[#E21818]">{p.name}</p>
                        <p className="text-xs font-bold text-[#E21818]">{p.price}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex flex-col justify-center overflow-hidden bg-[#1A1C1F] p-6">
              <img src={content.footer.adImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1F] to-transparent" />
              <div className="relative">
                <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>{content.footer.adTitle}</p>
                <Link href={content.footer.adHref} className="mt-2 inline-block text-sm font-bold uppercase text-[#E21818]">Shop Now!</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
