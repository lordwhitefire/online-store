import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Music, Truck, Wrench, Headphones, Award, Clock, Quote, Check } from "lucide-react"

export default function ServicesPage() {
  const services = [
    { icon: Music, title: "Music Lessons", desc: "Professional instruction for all instruments and skill levels, from beginner to advanced." },
    { icon: Wrench, title: "Instrument Repair", desc: "Expert repair services for guitars, drums, keyboards, brass, and woodwind instruments." },
    { icon: Truck, title: "Fast Delivery", desc: "Free shipping on all orders over $100. Same-day delivery available in select areas." },
    { icon: Headphones, title: "Studio Rental", desc: "Fully equipped recording studios available for hourly, daily, or monthly rental." },
    { icon: Award, title: "Quality Guarantee", desc: "Every product comes with our 30-day satisfaction guarantee and manufacturer warranty." },
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer support via phone, email, and live chat for all your needs." },
  ]

  const pricing = [
    { name: "Basic", price: "$49", period: "/month", features: ["1 music lesson/week", "Email support", "5% discount on products", "Newsletter access"] },
    { name: "Professional", price: "$99", period: "/month", features: ["3 music lessons/week", "Priority phone support", "15% discount on products", "Free studio time (2hrs/mo)", "Repair service discount"], featured: true },
    { name: "Premium", price: "$199", period: "/month", features: ["Unlimited lessons", "24/7 dedicated support", "25% discount on products", "Unlimited studio time", "Free repairs", "Early access to new gear"] },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Our Services</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">Our Services</span></nav>
        </div>

        {/* Services We Offer */}
        <div className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Services We Offer</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <div key={i} className="bg-[#1A1C1F] p-6 text-center">
                  <div className="mb-3 flex justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E21818]/10"><s.icon className="h-7 w-7 text-[#E21818]" /></div></div>
                  <h3 className="mb-2 text-sm font-bold uppercase text-white">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-[#9B9C9E]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="bg-[#1A1C1F] py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Price Table</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pricing.map((p, i) => (
                <div key={i} className={`p-6 ${p.featured ? "bg-[#E21818]/10 border-2 border-[#E21818]" : "bg-[#141618] border border-[#33383D]"}`}>
                  {p.featured && <p className="mb-2 text-center text-[10px] font-bold uppercase text-[#E21818]">Most Popular</p>}
                  <h3 className="text-center text-lg font-bold uppercase text-white">{p.name}</h3>
                  <p className="mb-4 text-center text-3xl font-bold text-white">{p.price}<span className="text-sm font-normal text-[#9B9C9E]">{p.period}</span></p>
                  <ul className="space-y-2">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#9B9C9E]"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E21818]" /> {f}</li>
                    ))}
                  </ul>
                  <button className={`mt-4 w-full py-2 text-xs font-bold uppercase text-white ${p.featured ? "bg-[#E21818] hover:bg-[#C51515]" : "bg-[#33383D] hover:bg-[#444]"}`}>Sign Up</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>What People Say?</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg">
              <img src="/musicplace/images/home/promo-studio.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-[#141618]/80" />
              <div className="relative z-10 mx-auto max-w-2xl px-8 text-center">
                <Quote className="mx-auto mb-4 h-10 w-10 text-[#E21818]" />
                <p className="mb-6 text-sm leading-relaxed text-white/90">The service team helped me find the perfect setup for my home studio. Their expertise and patience made all the difference. I will definitely be back!</p>
                <img src="/musicplace/images/home/testi-2-75x75.jpg" alt="" className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" />
                <p className="text-sm font-bold uppercase text-white">Kelley Webb</p>
                <p className="text-xs text-[#9B9C9E]">Singer</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
