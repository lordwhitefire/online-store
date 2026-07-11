import Link from "next/link"

export function Footer() {
  // Per home-1440-07: dark footer with links row + social icons + copyright
  return (
    <footer className="mt-auto border-t border-[#33383D] bg-[#141618]">
      {/* Links row */}
      <div className="border-b border-[#33383D]/50 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
          {[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Our Services", href: "/our-services" },
            { label: "Shop", href: "/shop" },
            { label: "News", href: "/blog" },
            { label: "Contacts", href: "/contact" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-[#9B9C9E] hover:text-[#E21818]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main footer — logo + social + copyright */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 md:flex-row md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/musicplace/logo-dark.png" alt="SOUND MUSIC STORE" className="h-9 w-auto" />
        </Link>

        {/* Social icons */}
        <div className="flex items-center gap-3">
          {/* Facebook */}
          <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#33383D] text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#33383D] text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* Behance */}
          <a href="#" aria-label="Behance" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#33383D] text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.486.106.9.273 1.243.5s.6.522.789.9c.188.378.282.853.282 1.425 0 .608-.139 1.115-.415 1.522-.276.407-.685.741-1.224 1.001.741.214 1.293.587 1.656 1.119.363.532.544 1.175.544 1.926 0 .608-.119 1.137-.356 1.585-.237.448-.557.817-.96 1.108-.403.291-.871.506-1.404.646-.533.14-1.081.21-1.645.21H0V5.698h7.799m-.362 4.892c.486 0 .882-.116 1.189-.347.307-.231.46-.608.46-1.131 0-.289-.052-.526-.156-.711-.104-.185-.242-.331-.415-.438-.173-.107-.371-.181-.595-.221-.224-.04-.456-.06-.696-.06H3.6v2.908h3.837m.198 5.155c.266 0 .519-.026.76-.078.241-.052.453-.139.637-.262.184-.123.331-.291.443-.504.111-.213.167-.491.167-.834 0-.663-.188-1.137-.563-1.422-.375-.285-.873-.428-1.494-.428H3.6v3.528h4.235M19.96 15.503c.415.4.996.6 1.742.6.546 0 1.015-.137 1.408-.41.393-.273.634-.563.722-.869h2.396c-.385 1.194-.974 2.048-1.767 2.562-.793.515-1.753.772-2.879.772-.784 0-1.491-.125-2.123-.376-.631-.251-1.165-.604-1.602-1.061-.437-.457-.776-1.005-1.018-1.645-.242-.639-.363-1.343-.363-2.111 0-.743.124-1.435.373-2.077.249-.642.599-1.198 1.051-1.668.452-.47.991-.839 1.617-1.106.626-.267 1.319-.4 2.081-.4.846 0 1.584.163 2.214.49.631.327 1.148.766 1.551 1.316.403.55.689 1.18.858 1.889.169.709.224 1.453.165 2.231h-7.012c0 .749.187 1.396.525 1.801M21.05 9.503c-.331-.366-.891-.563-1.583-.563-.463 0-.847.078-1.153.234-.306.156-.55.349-.733.58-.183.231-.31.476-.382.734-.072.258-.114.491-.125.7h4.343c-.063-.749-.273-1.299-.628-1.658M16.5 5.698h5.461v1.331H16.5z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#33383D] text-[#9B9C9E] hover:border-[#E21818] hover:text-[#E21818]">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-[#5C5D5E] md:text-right">
          ThemeREX © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
