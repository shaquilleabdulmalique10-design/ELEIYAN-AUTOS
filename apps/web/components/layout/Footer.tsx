'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'

const MAKES = [
  'Mercedes-Benz', 'Toyota', 'Lexus', 'Honda', 'Ford',
  'Hyundai', 'Kia', 'Volkswagen', 'Nissan', 'Infiniti',
]

const OFFICES = [
  {
    city: 'Ijebu-Ode Showroom',
    address: 'Molipa Express, Tomola, Front of Ifix Complex, Ijebu-Ode, Ogun State',
    phone: '+234 903 694 2616',
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white" aria-label="Site footer">
      {/* Top strip */}
      <div className="border-b border-white/10">
        <div className="container-xl py-8 sm:py-10 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Eleniyan Motors home">
              <span className="font-heading text-2xl text-gold tracking-wide">Eleniyan</span>
              <span className="font-body text-xs text-white/40 block tracking-[0.3em] uppercase -mt-1">
                Motors
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Nigeria&apos;s premier destination for certified pre-owned and new luxury automobiles.
              Sourced from the UK, US, and Japan.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { href: 'https://instagram.com/eleniyanmotors', Icon: Instagram, label: 'Instagram' },
                { href: 'https://twitter.com/eleniyanmotors', Icon: Twitter, label: 'Twitter / X' },
                { href: 'https://facebook.com/eleniyanmotors', Icon: Facebook, label: 'Facebook' },
                { href: 'https://youtube.com/@eleniyanmotors', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Browse by Make */}
          <div>
            <h3 className="font-heading text-sm text-gold uppercase tracking-widest mb-4">
              Browse by Make
            </h3>
            <ul className="space-y-2.5">
              {MAKES.map((make) => (
                <li key={make}>
                  <a
                    href="#"
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {make}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm text-gold uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Full Inventory', href: '/inventory' },
                { label: 'About Eleniyan', href: '/about' },
                { label: 'Our Services', href: '/services' },
                { label: 'Blog & Guides', href: '/blog' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Trade-In Valuation', href: '/contact#trade-in' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="font-heading text-sm text-gold uppercase tracking-widest mb-4">
              Our Offices
            </h3>
            <ul className="space-y-5">
              {OFFICES.map(({ city, address, phone }) => (
                <li key={city} className="flex gap-3">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-white text-sm font-medium">{city}</p>
                    <p className="text-white/40 text-xs leading-relaxed">{address}</p>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="text-white/50 text-xs hover:text-gold transition-colors mt-0.5 inline-block"
                    >
                      {phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            {/* Contact quick links */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="mailto:eleniyanautos@gmail.com"
                className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                eleniyanautos@gmail.com
              </a>
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER, 'Hello, I found you on the Eleniyan Motors website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs text-center sm:text-left">
          &copy; {year} Eleniyan Motors. All rights reserved.
        </p>
        <p className="text-white/20 text-xs text-center sm:text-right">
          Ijebu-Ode, Ogun State, Nigeria · Prices in NGN
        </p>
      </div>
    </footer>
  )
}
