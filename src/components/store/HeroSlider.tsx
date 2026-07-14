"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const SLIDES = [
  {
    image: "/musicplace/hero-original.jpg",
    textSide: "left" as const,
    headline: "The Headphones You Want.",
    subheadline: "Rest assured you're getting some of the best headphones available with our selection of Top Recommended.",
    buttonText: "View More",
    buttonHref: "/category/headphones",
    buttonBg: "#1A1C1F",
  },
  {
    image: "/musicplace/hero-slide2.jpg",
    textSide: "right" as const,
    headline: "Headphones & Headsets Accessories.",
    subheadline: "You are looking for a spare part or accessory for your headphone or headset? Click here to get your original headphones spare part.",
    buttonText: "Shop Now",
    buttonHref: "/category/headphones",
    buttonBg: "#E21818",
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <section className="relative flex min-h-[640px] items-center">
      <div className="absolute inset-0">
        <img src={slide.image} alt="" className="h-full w-full object-cover" />
      </div>
      {slide.textSide === "left" ? (
        <div className="absolute inset-0 bg-gradient-to-r from-[#141618]/85 via-[#141618]/30 to-transparent" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-l from-[#141618]/85 via-[#141618]/30 to-transparent" />
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        {slide.textSide === "left" ? (
          <div className="max-w-xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-lato)" }}>{slide.headline}</h1>
            <p className="mb-8 text-base text-white/85 md:text-lg">{slide.subheadline}</p>
            <Link href={slide.buttonHref} className="inline-block px-10 py-3 text-sm font-bold uppercase tracking-wider text-white" style={{ backgroundColor: slide.buttonBg }}>{slide.buttonText}</Link>
          </div>
        ) : (
          <div className="ml-auto max-w-xl text-right">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-lato)" }}>{slide.headline}</h1>
            <p className="mb-8 text-base text-white/85 md:text-lg">{slide.subheadline}</p>
            <Link href={slide.buttonHref} className="inline-block px-10 py-3 text-sm font-bold uppercase tracking-wider text-white" style={{ backgroundColor: slide.buttonBg }}>{slide.buttonText}</Link>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 w-2 rounded-full transition-colors ${i === current ? "bg-[#E21818]" : "bg-white/40"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
