import type { Metadata } from 'next'
import HeroSlider from '@/components/home/HeroSlider'
import QuickFilterBar from '@/components/home/QuickFilterBar'
import TrustBadges from '@/components/home/TrustBadges'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import HomeCTA from '@/components/home/HomeCTA'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Eleniyan Motors | Quality Cars in Ijebu-Ode, Ogun State',
  description:
    'Eleniyan Motors — your trusted car dealer in Ijebu-Ode, Ogun State. Browse Toyota, Lexus, Mercedes-Benz, Honda and more. Visit us at Molipa Express.',
  openGraph: {
    title: 'Eleniyan Motors | Quality Cars in Ijebu-Ode',
    description: 'Browse quality cars in Ijebu-Ode, Ogun State. Toyota, Lexus, Mercedes-Benz, Honda and more.',
  },
}

const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Eleniyan Motors',
  description: 'Quality car dealership in Ijebu-Ode, Ogun State',
  url: 'https://eleniyan.com',
  telephone: '+2349036942616',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Molipa Express, Tomola, Front of Ifix Complex',
    addressLocality: 'Ijebu-Ode',
    addressRegion: 'Ogun State',
    addressCountry: 'NG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 6.840215857295552,
    longitude: 3.912815222574494,
  },
  openingHours: 'Mo-Sa 09:00-18:00',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
      />

      {/* Hero */}
      <HeroSlider />

      {/* Quick Filter */}
      <div className="bg-gray-50 pb-0">
        <QuickFilterBar />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* CTA */}
      <HomeCTA />
    </>
  )
}
