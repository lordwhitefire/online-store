import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Sign Up</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Sign Up</span>
          </nav>
        </div>
        <div className="flex items-center justify-center py-12">
          <SignUp appearance={{
            elements: {
              rootBox: "bg-[#1A1C1F] rounded-lg",
              card: "bg-[#1A1C1F] border border-[#33383D]",
              headerTitle: "text-white",
              headerSubtitle: "text-[#9B9C9E]",
              formButtonPrimary: "bg-[#E21818] hover:bg-[#C51515]",
              formFieldInput: "bg-[#141618] border-[#33383D] text-white",
              formFieldLabel: "text-[#9B9C9E]",
              footerActionLink: "text-[#E21818]",
            }
          }} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
