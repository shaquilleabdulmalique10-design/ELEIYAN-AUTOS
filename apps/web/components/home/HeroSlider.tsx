'use client'

import { useEffect, useCallback, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  type: 'image' | 'video'
  src: string
  poster?: string
  headline: string
  subheadline: string
  cta: { label: string; href: string }
  brand?: string
}

const SLIDES: Slide[] = [
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&q=85',
    headline: 'Drive the Extraordinary',
    subheadline: 'Curated collection of the world\'s finest luxury automobiles, sourced from UK, US & Japan',
    cta: { label: 'Browse Inventory', href: '/inventory' },
    brand: 'Rolls-Royce',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=85',
    headline: 'Bentley Excellence',
    subheadline: 'Where handcrafted British luxury meets Nigerian roads. Verified. Inspected. Delivered.',
    cta: { label: 'View Bentleys', href: '/inventory?make=Bentley' },
    brand: 'Bentley',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1920&q=85',
    headline: 'Rule Every Terrain',
    subheadline: 'The Range Rover — commanding presence, unmatched capability, supreme comfort.',
    cta: { label: 'Explore Range Rovers', href: '/inventory?make=Range+Rover' },
    brand: 'Range Rover',
  },
  {
    type: 'image',
    src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=85',
    headline: 'Mercedes-Maybach',
    subheadline: 'The pinnacle of automotive luxury. Reserve your symbol of success today.',
    cta: { label: 'View Maybachs', href: '/inventory?make=Maybach' },
    brand: 'Maybach',
  },
]

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  return (
    <section
      className="relative w-full h-[60vh] sm:h-[75vh] md:h-screen min-h-[400px] sm:min-h-[500px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero image slider"
      aria-roledescription="carousel"
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="embla__slide relative h-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}: ${slide.brand}`}
            >
              {/* Background */}
              <Image
                src={slide.src}
                alt={`${slide.brand} luxury vehicle`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-navy/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-xl">
                  <div className="max-w-xs sm:max-w-xl md:max-w-2xl">
                    {slide.brand && (
                      <p className="text-gold text-xs sm:text-sm font-body uppercase tracking-[0.3em] mb-2 sm:mb-4 animate-fade-in">
                        {slide.brand}
                      </p>
                    )}
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight animate-slide-up">
                      {slide.headline}
                    </h1>
                    <p className="text-white/75 text-sm sm:text-base md:text-lg font-body leading-relaxed mb-6 sm:mb-8 max-w-xs sm:max-w-lg animate-fade-in">
                      {slide.subheadline}
                    </p>
                    <Link href={slide.cta.href} className="btn-primary text-xs sm:text-sm">
                      {slide.cta.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Dots */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
        role="tablist"
        aria-label="Slide navigation"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-gold ${
              selectedIndex === i ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            role="tab"
            aria-selected={selectedIndex === i}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
