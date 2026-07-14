import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { MapPin, Clock, Phone, Mail, Facebook, Twitter, Instagram, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Contacts</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Contacts</span>
          </nav>
        </div>

        {/* Map — FULL WIDTH at the TOP (right after title) */}
        <div className="relative h-[350px] w-full overflow-hidden border-b border-[#33383D]">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.05%2C40.70%2C-73.90%2C40.80&layer=mapnik&marker=40.7484%2C-73.9857"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            title="Store Location"
          />
        </div>

        {/* Main Content — two column: left (contact info + info + social) + right (form) */}
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* LEFT: Contact Info + Information + Social */}
            <div className="lg:w-[35%]">
              {/* Contact Info */}
              <div className="mb-6 bg-[#1A1C1F] p-6">
                <h3 className="mb-4 border-b-2 border-[#E21818] pb-2 text-sm font-bold uppercase text-white">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E21818]" />
                    <div>
                      <p className="text-xs font-bold text-white">Address</p>
                      <p className="text-xs text-[#9B9C9E]">No.1 Abbey Road, London, W1 ECH, UK</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#E21818]" />
                    <div>
                      <p className="text-xs font-bold text-white">We Are Open</p>
                      <p className="text-xs text-[#9B9C9E]">Open Hours on the 24th, - 11am to 5pm</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#E21818]" />
                    <div>
                      <p className="text-xs font-bold text-white">Call</p>
                      <p className="text-xs text-[#9B9C9E]">+44 (0) 800 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#E21818]" />
                    <div>
                      <p className="text-xs font-bold text-white">Email</p>
                      <p className="text-xs text-[#9B9C9E]">info@swiftideas.net</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="mb-6 bg-[#1A1C1F] p-6">
                <h3 className="mb-3 border-b-2 border-[#E21818] pb-2 text-sm font-bold uppercase text-white">Information</h3>
                <p className="text-xs leading-relaxed text-[#9B9C9E]">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* Stay Social */}
              <div className="bg-[#1A1C1F] p-6">
                <h3 className="mb-3 border-b-2 border-[#E21818] pb-2 text-sm font-bold uppercase text-white">Stay Social</h3>
                <div className="flex gap-2">
                  <a href="#" className="flex h-9 w-9 items-center justify-center bg-[#33383D] hover:bg-[#E21818] transition-colors"><Facebook className="h-4 w-4 text-white" /></a>
                  <a href="#" className="flex h-9 w-9 items-center justify-center bg-[#33383D] hover:bg-[#E21818] transition-colors"><Twitter className="h-4 w-4 text-white" /></a>
                  <a href="#" className="flex h-9 w-9 items-center justify-center bg-[#33383D] hover:bg-[#E21818] transition-colors"><Instagram className="h-4 w-4 text-white" /></a>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="flex-1 lg:w-[63%]">
              <div className="bg-[#1A1C1F] p-6">
                <h3 className="mb-4 border-b-2 border-[#E21818] pb-2 text-sm font-bold uppercase text-white">Leave a Comment</h3>
                <form className="space-y-4">
                  {/* Name + Email: 2 columns from tablet up, 1 column on mobile */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">Name *</label>
                      <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-[#9B9C9E]">E-mail *</label>
                      <input type="email" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#9B9C9E]">Subject</label>
                    <input type="text" className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#9B9C9E]">Message</label>
                    <textarea rows={6} className="w-full border border-[#33383D] bg-[#141618] px-3 py-2 text-sm text-white focus:border-[#E21818] focus:outline-none" />
                  </div>
                  <button type="submit" className="flex items-center gap-2 bg-[#E21818] px-8 py-3 text-xs font-bold uppercase text-white hover:bg-[#C51515]">
                    <Send className="h-4 w-4" /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
