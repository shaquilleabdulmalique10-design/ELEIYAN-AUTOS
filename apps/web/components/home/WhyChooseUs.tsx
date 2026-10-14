import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const POINTS = [
  'Over 500 quality vehicles sold in Ogun State and beyond',
  'Thorough inspection on every car before listing',
  'Transparent pricing — no hidden charges',
  'Financing and instalment options available',
  'Free delivery within Ijebu-Ode and environs',
  'Dedicated support from enquiry to key handover',
]

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-12 sm:py-20" aria-labelledby="why-heading">
      <div className="container-xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
          {/* Image side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/3] rounded-card overflow-hidden shadow-card-hover">
              <Image
                src="https://images.unsplash.com/photo-1600705722908-bde7a5b3fac0?w=900&q=85"
                alt="Luxury car showroom interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-navy/90 backdrop-blur-sm border border-gold/30 rounded-card px-4 sm:px-5 py-3 sm:py-4 text-white">
                <p className="font-heading text-2xl sm:text-3xl text-gold">500+</p>
                <p className="text-xs text-white/60 uppercase tracking-widest mt-0.5">Vehicles Delivered</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-card border-2 border-gold/20 -z-10" aria-hidden="true" />
          </div>

          {/* Content side */}
          <div className="w-full lg:w-1/2">
            <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-2 font-body">Our Story</p>
            <h2 id="why-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl text-navy mb-4">
              Ijebu-Ode&apos;s Most Trusted Car Dealer
            </h2>
            <div className="gold-divider mb-5 sm:mb-6" aria-hidden="true" />
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Founded right here in Ijebu-Ode, Eleniyan Motors was built on one promise: give Nigerians
              access to quality, well-maintained vehicles with complete transparency. Every car we sell
              is checked thoroughly before listing — no stories.
            </p>

            <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8" aria-label="Key selling points">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-charcoal text-sm">{point}</span>
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn-primary text-sm">Learn More About Us</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
