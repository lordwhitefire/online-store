import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  const sections = [
    { num: "1", title: "Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact customer support. This may include your name, email address, shipping address, phone number, and payment information." },
    { num: "2", title: "How We Use Your Information", content: "We use the information we collect to process transactions, send order confirmations, provide customer support, send marketing communications (with your consent), improve our products and services, and comply with legal obligations." },
    { num: "3", title: "Embedded Content", content: "Our website may contain embedded content from third-party providers such as YouTube, Google Maps, and social media platforms. These providers may collect data about your interactions with their embedded content." },
    { num: "4", title: "Cookies", content: "We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small files that may be used to provide a better user experience and analyze website traffic." },
    { num: "5", title: "Data Access", content: "You have the right to access the personal information we hold about you, request a copy of your data, and request that we correct or delete your personal information, subject to applicable laws." },
    { num: "6", title: "Data Retention", content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements." },
    { num: "7", title: "Data Security", content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure." },
    { num: "8", title: "Your Rights", content: "Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data. You may also have the right to data portability." },
    { num: "9", title: "Third-Party Services", content: "We may use third-party service providers to help us operate our website, process payments, and deliver products. These providers have access to your personal information only to perform specific tasks on our behalf." },
    { num: "10", title: "Children's Privacy", content: "Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately." },
    { num: "11", title: "Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date at the top." },
    { num: "12", title: "Contact Us", content: "If you have any questions about this privacy policy or our data practices, please contact us at: info@swiftideas.net or +44 (0) 800 123 4567." },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Privacy Policy</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]"><Link href="/" className="hover:text-[#E21818]">Home</Link><span className="mx-1">/</span><span className="text-white">Privacy Policy</span></nav>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="mb-6 text-xs text-[#9B9C9E]">Last updated: July 14, 2026</p>
          <div className="space-y-6">
            {sections.map(s => (
              <div key={s.num} className="bg-[#1A1C1F] p-6">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E21818] text-xs text-white">{s.num}</span>
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#9B9C9E]">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
