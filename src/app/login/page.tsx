import { Header } from "@/components/store/Header"
import { Footer } from "@/components/store/Footer"
import Link from "next/link"
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#141618]">
      <Header />
      <main className="flex-1">
        {/* Page Title Bar */}
        <div className="border-b border-[#33383D] bg-[#1A1C1F] py-8 text-center">
          <h1 className="text-3xl font-bold uppercase text-white" style={{ fontFamily: "var(--font-lato)" }}>Login</h1>
          <nav className="mt-2 text-xs text-[#9B9C9E]">
            <Link href="/" className="hover:text-[#E21818]">Home</Link>
            <span className="mx-1">/</span>
            <span className="text-white">Login</span>
          </nav>
        </div>

        <div className="mx-auto max-w-md px-4 py-12">
          <div className="bg-[#1A1C1F] p-8">
            {/* Login icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E21818]">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-white" style={{ fontFamily: "var(--font-lato)" }}>Welcome Back</h2>
            <p className="mb-6 text-center text-xs text-[#9B9C9E]">Sign in to your account to continue</p>

            <form className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-xs text-[#9B9C9E]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B9C9E]" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-[#33383D] bg-[#141618] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-[#9B9C9E] focus:border-[#E21818] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs text-[#9B9C9E]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B9C9E]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-[#33383D] bg-[#141618] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-[#9B9C9E] focus:border-[#E21818] focus:outline-none"
                  />
                  <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B9C9E] cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#9B9C9E]">
                  <input type="checkbox" className="accent-[#E21818]" /> Remember me
                </label>
                <Link href="#" className="text-[#E21818] hover:underline">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#E21818] py-3 text-sm font-bold uppercase text-white hover:bg-[#C51515] transition-colors"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#33383D]" />
              <span className="text-xs text-[#9B9C9E]">OR</span>
              <span className="h-px flex-1 bg-[#33383D]" />
            </div>

            {/* Register link */}
            <p className="text-center text-xs text-[#9B9C9E]">
              Don&apos;t have an account?{" "}
              <Link href="#" className="font-bold text-[#E21818] hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
