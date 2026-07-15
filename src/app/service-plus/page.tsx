import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { Check, Mail, Phone, Clock } from "lucide-react"

export default function ServicePlusPage() {
  const packages = [
    { name: "Theme Installation", price: "$49", features: ["Theme installation", "Demo content setup", "Basic configuration", "1 round of revisions", "48-hour delivery"], featured: false },
    { name: "Customization", price: "$199", features: ["Everything in Theme Installation", "Color & font customization", "Layout adjustments", "3 rounds of revisions", "24-hour delivery", "30-day support"], featured: true },
    { name: "Full Setup", price: "$499", features: ["Everything in Customization", "Full website build", "E-commerce setup", "Content migration", "Unlimited revisions", "90-day support", "Priority response"], featured: false },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Service Plus</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">Service Plus</span></nav>
        </div>

        {/* Dear Customers */}
        <div className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Dear Customers</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="bg-[#1A1C1F] p-8">
              <p className="mb-4 text-sm leading-relaxed text-[#9B9C9E]">Welcome to our Service Plus program! We understand that setting up a new website or online store can be overwhelming. That's why we offer comprehensive service packages designed to get your music store up and running quickly and professionally.</p>
              <p className="mb-4 text-sm leading-relaxed text-[#9B9C9E]">Our team of experienced developers and designers will work with you every step of the way, from initial installation to final customization. Whether you need a simple setup or a full e-commerce solution, we have a package that fits your needs and budget.</p>
              <p className="text-sm leading-relaxed text-[#9B9C9E]">All our services come with a satisfaction guarantee. If you're not happy with the results, we'll work with you until you are. Choose a package below to get started.</p>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="bg-[#1A1C1F] py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#33383D]" />
              <h2 className="text-2xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Packages</h2>
              <span className="h-px w-12 bg-[#33383D]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p, i) => (
                <div key={i} className={`p-6 ${p.featured ? "bg-[#E21818]/10 border-2 border-[#E21818]" : "bg-[#141618] border border-[#33383D]"}`}>
                  {p.featured && <p className="mb-2 text-center text-[10px] font-bold uppercase text-[#E21818]">Recommended</p>}
                  <h3 className="text-center text-lg font-bold uppercase text-white">{p.name}</h3>
                  <p className="mb-4 text-center text-3xl font-bold text-white">{p.price}</p>
                  <ul className="mb-4 space-y-2">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#9B9C9E]"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E21818]" /> {f}</li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 text-xs font-bold uppercase text-white ${p.featured ? "bg-[#E21818] hover:bg-[#C51515]" : "bg-[#33383D] hover:bg-[#444]"}`}>Get Started</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="bg-[#1A1C1F] p-8 text-center">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Have Questions?</h2>
              <p className="mb-6 text-sm text-[#9B9C9E]">Contact us anytime and our team will help you choose the right package.</p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9B9C9E]">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#E21818]" /> info@swiftideas.net</span>
                <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#E21818]" /> +44 (0) 800 123 4567</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#E21818]" /> 24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
