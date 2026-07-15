"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

interface SlideData {
  headline: string
  subheadline: string
  buttonText: string
  buttonHref: string
  image: string
}

export function HeroSlider({ slides }: { slides: [SlideData, SlideData] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[current]
  const isLeft = current === 0

  return (
    <section className="relative flex min-h-[640px] items-center">
      <div className="absolute inset-0">
        <img src={slide.image} alt="" className="h-full w-full object-cover" />
      </div>
      {isLeft ? (
        <div className="absolute inset-0 bg-gradient-to-r from-[#141618]/85 via-[#141618]/30 to-transparent" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-l from-[#141618]/85 via-[#141618]/30 to-transparent" />
      )}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        {isLeft ? (
          <div className="max-w-xl">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-lato)" }}>{slide.headline}</h1>
            <p className="mb-8 text-base text-white/85 md:text-lg">{slide.subheadline}</p>
            <Link href={slide.buttonHref} className="inline-block bg-[#1A1C1F] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#33383D]">{slide.buttonText}</Link>
          </div>
        ) : (
          <div className="ml-auto max-w-xl text-right">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-lato)" }}>{slide.headline}</h1>
            <p className="mb-8 text-base text-white/85 md:text-lg">{slide.subheadline}</p>
            <Link href={slide.buttonHref} className="inline-block bg-[#E21818] px-10 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#C51515]">{slide.buttonText}</Link>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 w-2 rounded-full transition-colors ${i === current ? "bg-[#E21818]" : "bg-white/40"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
