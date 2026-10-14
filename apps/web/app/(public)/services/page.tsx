import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Globe, RefreshCcw, CreditCard, Truck, Wrench, HeadphonesIcon,
  ArrowRight, CheckCircle2,
} from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Eleniyan Motors offers luxury car sourcing from UK/US/Japan, trade-in appraisal, financing, delivery, registration, and after-sales care in Nigeria.',
}

const SERVICES = [
  {
    id: 'sourcing',
    Icon: Globe,
    title: 'Global Vehicle Sourcing',
    subtitle: 'UK · United States · Japan',
    description:
      'We source directly from premium auctions, dealerships, and private sellers in the United Kingdom, United States, and Japan. Every vehicle is personally inspected before shipping.',
    features: [
      'Access to vehicles unavailable locally',
      'Personal sourcing consultation',
      'Full import documentation',
      'Customs clearance handling',
      'Competitive pricing vs. local market',
    ],
    cta: { label: 'Enquire About Sourcing', href: '/contact' },
  },
  {
    id: 'trade-in',
    Icon: RefreshCcw,
    title: 'Trade-In Appraisal',
    subtitle: 'Fair Market Valuations',
    description:
      'Ready to upgrade? We offer transparent, data-driven trade-in valuations for your current vehicle. Apply the value toward any listing in our inventory.',
    features: [
      'Free no-obligation valuation',
      'Same-day assessment',
      'Fair market pricing',
      'Trade-in credit applied to purchase',
      'All makes and models accepted',
    ],
    cta: { label: 'Get a Valuation', href: '/contact' },
  },
  {
    id: 'financing',
    Icon: CreditCard,
    title: 'Financing & Insurance',
    subtitle: 'Trusted Partners',
    description:
      'We work with Nigeria\'s leading financial institutions to connect you with competitive auto loan packages. Insurance partnerships ensure you\'re covered from day one.',
    features: [
      'Access to multiple lenders',
      'Flexible repayment tenures',
      'Competitive interest rates',
      'Comprehensive insurance options',
      'Fast approval process',
    ],
    partners: [
      { name: 'Access Bank Auto Loan', url: 'https://accessbankplc.com' },
      { name: 'GTBank Vehicle Finance', url: 'https://gtbank.com' },
      { name: 'Stanbic IBTC Auto Finance', url: 'https://stanbicibtcbank.com' },
      { name: 'AXA Mansard Insurance', url: 'https://axamansard.com' },
    ],
    cta: { label: 'Explore Financing Options', href: '/contact' },
  },
  {
    id: 'delivery',
    Icon: Truck,
    title: 'Delivery & Registration',
    subtitle: 'End-to-End Handling',
    description:
      'From port to your driveway — we manage the entire delivery pipeline. Customs clearance, FRSC registration, plate numbers, and roadworthiness certificates all handled for you.',
    features: [
      'Port clearance & customs',
      'FRSC registration',
      'Plate number procurement',
      'Roadworthiness certificate',
      'Nationwide delivery',
    ],
    cta: { label: 'Ask About Delivery', href: '/contact' },
  },
  {
    id: 'inspection',
    Icon: Wrench,
    title: 'Pre-Purchase Inspection',
    subtitle: '100-Point Checks',
    description:
      'Every vehicle in our inventory undergoes a rigorous 100-point mechanical and cosmetic inspection. Downloadable reports available on each listing for full transparency.',
    features: [
      '100-point inspection checklist',
      'Mechanical & electrical checks',
      'Cosmetic condition assessment',
      'OBD diagnostic scan',
      'Downloadable PDF reports',
    ],
    cta: { label: 'View Inspected Inventory', href: '/inventory' },
  },
  {
    id: 'aftersales',
    Icon: HeadphonesIcon,
    title: 'After-Sales Care',
    subtitle: 'Ongoing Support',
    description:
      'Our relationship doesn\'t end at the sale. Our dedicated after-sales team provides maintenance referrals, warranty claim support, and concierge servicing assistance.',
    features: [
      'Dedicated relationship manager',
      'Authorised service centre referrals',
      'Warranty claim assistance',
      'Annual vehicle health checks',
      'Priority support line',
    ],
    cta: { label: 'Contact Support', href: '/contact' },
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/4 rounded-full border border-gold" />
        </div>
        <div className="container-xl relative text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">What We Offer</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Our Services</h1>
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            From sourcing your dream vehicle abroad to delivering it to your door — we handle every step of the luxury car journey.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="space-y-20">
            {SERVICES.map(({ id, Icon, title, subtitle, description, features, partners, cta }, idx) => (
              <div
                key={id}
                id={id}
                className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Icon block */}
                <div className="lg:w-2/5 shrink-0">
                  <div className="bg-navy rounded-card p-12 text-center aspect-square flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                      <Icon className="w-10 h-10 text-gold" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-2xl text-white mb-2">{title}</h3>
                    <p className="text-gold text-sm uppercase tracking-widest">{subtitle}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="font-heading text-3xl text-navy mb-4">{title}</h2>
                  <div className="gold-divider mb-5" aria-hidden="true" />
                  <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

                  <ul className="space-y-2.5 mb-6" role="list">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="text-sm text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Partner links */}
                  {partners && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Our Partners</p>
                      <div className="flex flex-wrap gap-2">
                        {partners.map((p) => (
                          <a
                            key={p.name}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs border border-gold/30 text-gold hover:bg-gold hover:text-navy px-3 py-1.5 rounded-full transition-colors"
                          >
                            {p.name} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={cta.href} className="btn-primary inline-flex">
                    {cta.label}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-16">
        <div className="container-xl text-center">
          <h2 className="font-heading text-3xl text-navy mb-4">Ready to Get Started?</h2>
          <p className="text-navy/70 mb-8 max-w-md mx-auto">
            Speak directly with one of our luxury car specialists today. No obligation, just expert advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-navy text-white font-semibold uppercase tracking-wide text-sm px-8 py-3 rounded-sm hover:bg-navy-600 transition-colors">
              Contact Us
            </Link>
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER, "Hello, I'd like to enquire about your services")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-semibold uppercase tracking-wide text-sm px-8 py-3 rounded-sm hover:bg-green-700 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
