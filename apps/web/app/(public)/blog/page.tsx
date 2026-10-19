import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Eleniyan Motors',
  description: 'Car tips, buying guides and news from Eleniyan Motors, Ijebu-Ode.',
}

export default function BlogPage() {
  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      <div className="bg-navy py-10 sm:py-16">
        <div className="container-xl text-center">
          <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-2">Eleniyan Blog</p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            News & Guides
          </h1>
          <div className="gold-divider mx-auto mb-4" aria-hidden="true" />
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Car tips, buying guides, and the latest from the world of automobiles.
          </p>
        </div>
      </div>

      <div className="container-xl py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <span className="font-heading text-gold text-3xl">E</span>
          </div>
          <h2 className="font-heading text-2xl text-navy mb-3">Coming Soon</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            We&apos;re working on bringing you the best car guides and news.
            Check back soon!
          </p>
          <Link href="/inventory" className="btn-primary gap-2 text-sm">
            Browse Our Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
