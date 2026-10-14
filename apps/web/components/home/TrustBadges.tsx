import { ShieldCheck, Globe, Wrench, Award, Clock, HeadphonesIcon } from 'lucide-react'

const BADGES = [
  {
    Icon: ShieldCheck,
    title: '100-Point Inspection',
    description: 'Every vehicle undergoes a rigorous inspection by certified engineers before listing.',
  },
  {
    Icon: Globe,
    title: 'Global Sourcing',
    description: 'Directly sourced from verified dealerships in the UK, US, and Japan.',
  },
  {
    Icon: Wrench,
    title: 'Full Service History',
    description: 'Complete documentation and verified service records on every vehicle.',
  },
  {
    Icon: Award,
    title: 'Certified Sellers',
    description: 'All sellers are vetted and certified through our rigorous onboarding process.',
  },
  {
    Icon: Clock,
    title: 'Fast Delivery',
    description: 'Nationwide delivery to Lagos, Abuja, Port Harcourt and beyond.',
  },
  {
    Icon: HeadphonesIcon,
    title: 'After-Sale Support',
    description: 'Dedicated support team available 7 days a week for all your needs.',
  },
]

export default function TrustBadges() {
  return (
    <section className="bg-gray-50 py-12 sm:py-20" aria-labelledby="trust-heading">
      <div className="container-xl">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-2 font-body">Why Eleniyan</p>
          <h2 id="trust-heading" className="font-heading text-2xl sm:text-3xl md:text-4xl text-navy">
            The Eleniyan Standard
          </h2>
          <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {BADGES.map(({ Icon, title, description }) => (
            <div key={title} className="bg-white rounded-card p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-shadow group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold/20 transition-colors">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-sm sm:text-base text-navy mb-1.5 sm:mb-2">{title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
