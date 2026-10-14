import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from 'lucide-react'
import { OFFICE_LOCATIONS, WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink } from '@/lib/utils'
import ContactForm from '@/components/forms/ContactForm'
import NewsletterForm from '@/components/forms/NewsletterForm'

export const metadata: Metadata = {
  title: 'Contact Us | Eleniyan Motors',
  description:
    'Visit Eleniyan Motors at Molipa Express, Ijebu-Ode, Ogun State. Schedule a private viewing or WhatsApp us directly.',
}

export default function ContactPage() {
  const office = OFFICE_LOCATIONS[0]

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="container-xl text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Visit Us</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Contact Us</h1>
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="text-white/60 text-base max-w-lg mx-auto">
            Come see our cars in person at our Ijebu-Ode showroom, or reach us on WhatsApp anytime.
          </p>
        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="bg-green-600 py-4">
        <div className="container-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white font-medium text-sm">
            💬 Quickest response is on WhatsApp — we typically reply within minutes.
          </p>
          <a
            href={getWhatsAppLink(WHATSAPP_NUMBER, "Hello, I'd like to enquire about a vehicle at Eleniyan Motors")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-sm hover:bg-green-50 transition-colors shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Showroom Location */}
      <section className="py-20 bg-white" aria-labelledby="location-heading">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-2">Find Us</p>
            <h2 id="location-heading" className="font-heading text-3xl md:text-4xl text-navy">
              Our Showroom
            </h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-card shadow-card-hover overflow-hidden border border-gray-100">

              {/* Map — full width, tall */}
              <div className="w-full" style={{ height: '450px' }}>
                <iframe
                  src={office.mapUrl}
                  title="Eleniyan Motors showroom location — Molipa Express, Ijebu-Ode"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Google Maps showing Eleniyan Motors on Molipa Express, Ijebu-Ode"
                />
              </div>

              {/* Info row */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                  {/* Left: details */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl text-navy">{office.city}</h3>
                    <dl className="space-y-3">
                      <div className="flex gap-3">
                        <dt className="sr-only">Address</dt>
                        <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                        <dd className="text-sm text-gray-600 leading-relaxed">{office.address}</dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="sr-only">Phone</dt>
                        <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                        <dd>
                          <a
                            href={`tel:${office.phone.replace(/\s/g, '')}`}
                            className="text-sm text-gray-600 hover:text-gold transition-colors"
                          >
                            {office.phone}
                          </a>
                        </dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="sr-only">Email</dt>
                        <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                        <dd>
                          <a
                            href={`mailto:${office.email}`}
                            className="text-sm text-gray-600 hover:text-gold transition-colors"
                          >
                            {office.email}
                          </a>
                        </dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="sr-only">Opening hours</dt>
                        <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" aria-hidden="true" />
                        <dd className="text-sm text-gray-600">{office.hours}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Right: CTAs */}
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <a
                      href={office.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-navy text-white font-semibold text-sm py-3 px-5 rounded-sm hover:bg-navy/90 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </a>
                    <a
                      href={getWhatsAppLink(WHATSAPP_NUMBER, "Hello, I'm coming to visit the Eleniyan Motors showroom in Ijebu-Ode. I'd like to confirm your availability.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-3 px-5 rounded-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Confirm Visit on WhatsApp
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=6.840215857295552,3.912815222574494`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-gold hover:text-gold font-semibold text-sm py-3 px-5 rounded-sm transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                {/* Coordinates note */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    GPS: 6°50′24.8″N, 3°54′46.1″E &nbsp;·&nbsp; Molipa Express, Tomola, Ijebu-Ode, Ogun State
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Viewing Form */}
      <section className="py-20 bg-gray-50" aria-labelledby="form-heading">
        <div className="container-xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold text-sm uppercase tracking-[0.3em] mb-3">By Appointment</p>
              <h2 id="form-heading" className="font-heading text-3xl md:text-4xl text-navy">
                Schedule a Private Viewing
              </h2>
              <div className="gold-divider mx-auto mt-4 mb-5" aria-hidden="true" />
              <p className="text-gray-500 text-sm leading-relaxed">
                Reserve your personal appointment with one of our luxury car specialists.
                We typically confirm within 2 hours.
              </p>
            </div>
            <div className="bg-white rounded-card shadow-card p-8">
              <Suspense>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-navy py-16">
        <div className="container-xl max-w-xl mx-auto text-center">
          <h2 className="font-heading text-2xl text-white mb-3">Stay in the Loop</h2>
          <p className="text-white/60 text-sm mb-6">
            Get new listings, import guides, and exclusive offers delivered to your inbox.
          </p>
          <NewsletterForm variant="card" />
        </div>
      </section>

    </div>
  )
}
