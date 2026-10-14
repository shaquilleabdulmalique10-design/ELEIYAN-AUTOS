import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Users, Car, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Eleniyan Motors — Nigeria\'s premier luxury car dealership. Our story, team, and certifications.',
}

const STATS = [
  { icon: Car, value: '500+', label: 'Vehicles Sold' },
  { icon: Users, value: '1,200+', label: 'Happy Clients' },
  { icon: Globe, value: '3', label: 'Countries Sourced From' },
  { icon: Award, value: '8+', label: 'Years in Business' },
]

const TEAM = [
  {
    name: 'Adebayo Eleniyan',
    role: 'Founder & CEO',
    bio: 'With 15 years in luxury automotive, Adebayo founded Eleniyan Motors with a simple mission: make world-class luxury cars accessible to Nigerians without compromise.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Ngozi Okonkwo',
    role: 'Head of Sourcing',
    bio: 'Ngozi manages our international sourcing partnerships in the UK, US, and Japan, ensuring every imported vehicle meets our rigorous quality standards.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },
  {
    name: 'Emeka Chukwu',
    role: 'Chief Inspector',
    bio: 'A certified automotive engineer with 12 years of experience, Emeka leads our 100-point inspection programme and signs off on every vehicle report.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    name: 'Amara Nwosu',
    role: 'Client Relations Manager',
    bio: 'Amara ensures every client has a world-class experience from first enquiry to final delivery and beyond. She oversees our after-sales care programme.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
]

const CERTIFICATIONS = [
  { name: 'FRSC Registered Dealer', description: 'Federal Road Safety Corps certified dealership' },
  { name: 'CAC Registered', description: 'Corporate Affairs Commission registered business' },
  { name: 'NCC Member', description: 'Nigeria Chamber of Commerce member' },
  { name: 'AIA Certified', description: 'Automotive Industry Association of Nigeria' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="container-xl text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Our Story</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">About Eleniyan Motors</h1>
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="text-white/60 text-base max-w-xl mx-auto leading-relaxed">
            Built on trust, driven by passion. Nigeria&apos;s most trusted name in luxury vehicles.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="relative rounded-card overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=85"
                  alt="Eleniyan Motors showroom interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent p-6">
                  <p className="text-white font-heading text-lg">Est. 2016 · Lagos, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Who We Are</p>
              <h2 className="section-heading mb-4">
                Nigeria&apos;s Premier Luxury Car Destination
              </h2>
              <div className="gold-divider mb-6" aria-hidden="true" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Eleniyan Motors was founded in 2016 with a clear vision: to bring the world&apos;s
                  finest automobiles to Nigeria&apos;s discerning buyers — with the transparency,
                  quality assurance, and service levels they deserve.
                </p>
                <p>
                  What started as a small import operation in Lagos has grown into a full-service
                  luxury dealership with showrooms across Lagos, Abuja, and Port Harcourt,
                  serving over 1,200 satisfied clients.
                </p>
                <p>
                  We source from the finest auction houses and dealerships in the United Kingdom,
                  United States, and Japan. Every vehicle is personally inspected, fully documented,
                  and delivered with complete peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-16" aria-label="Company statistics">
        <div className="container-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-gold" aria-hidden="true" />
                </div>
                <p className="font-heading text-3xl text-white mb-1">{value}</p>
                <p className="text-white/50 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50" aria-labelledby="team-heading">
        <div className="container-xl">
          <div className="text-center mb-14">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-3">The People Behind the Brand</p>
            <h2 id="team-heading" className="section-heading">Meet Our Team</h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member) => (
              <article key={member.name} className="card p-0 overflow-hidden text-center group">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base text-navy">{member.name}</h3>
                  <p className="text-gold text-xs uppercase tracking-widest mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white" aria-labelledby="certs-heading">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-3">Trust & Compliance</p>
            <h2 id="certs-heading" className="section-heading">Certifications & Accreditations</h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className="border border-gold/20 rounded-card p-6 text-center hover:border-gold/50 transition-colors">
                <Award className="w-8 h-8 text-gold mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-heading text-sm text-navy mb-2">{cert.name}</h3>
                <p className="text-xs text-gray-500">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="container-xl text-center">
          <h2 className="font-heading text-3xl text-white mb-4">Ready to Drive Luxury?</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Browse our curated collection or visit one of our showrooms for a private viewing experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inventory" className="btn-primary">Browse Inventory</Link>
            <Link href="/contact" className="btn-secondary">Visit a Showroom</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
