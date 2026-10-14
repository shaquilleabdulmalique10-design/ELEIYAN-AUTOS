import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'

export default function HomeCTA() {
  const waLink = getWhatsAppLink(
    WHATSAPP_NUMBER,
    'Hello Eleniyan Motors! I\'d like to enquire about a vehicle.'
  )

  return (
    <section
      className="relative bg-navy py-20 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A84C 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />
      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10 text-center">
        <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 font-body">Ready to Drive?</p>
        <h2 id="cta-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 sm:mb-5 max-w-2xl mx-auto">
          Find Your Perfect Car Today
        </h2>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10">
          Browse our full inventory or speak with us directly. We handle everything — sourcing, inspection, financing, and delivery right here in Ijebu-Ode.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/inventory" className="btn-primary gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center">
            Browse All Cars
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="btn-secondary gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center">
            <Phone className="w-4 h-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-0 md:divide-x divide-white/10 border-t border-white/10 pt-8 sm:pt-10">
          {[
            { value: '500+', label: 'Vehicles Sold' },
            { value: '1', label: 'Showroom Location' },
            { value: '5+', label: 'Years Experience' },
            { value: '98%', label: 'Happy Customers' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-2 sm:px-4">
              <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-gold">{value}</p>
              <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
