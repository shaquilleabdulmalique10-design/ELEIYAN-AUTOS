import type { Metadata } from 'next'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description:
    'Read what our clients say about buying luxury cars from Eleniyan Motors. Video testimonials, reviews, and trade-in case studies.',
}

const REVIEWS = [
  {
    name: 'Tunde Fashola',
    location: 'Lagos',
    vehicle: '2023 Range Rover Autobiography',
    rating: 5,
    review:
      'Absolutely flawless experience from start to finish. The team handled my UK import seamlessly — inspection report, shipping, customs, registration. All I did was show up and drive my dream car home.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    name: 'Chidinma Okoye',
    location: 'Abuja',
    vehicle: '2022 Bentley Bentayga',
    rating: 5,
    review:
      'I was sceptical about buying a luxury car online but Eleniyan Motors exceeded every expectation. The 360° photos and inspection PDF gave me full confidence. Zero surprises on delivery.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
  },
  {
    name: 'Olumide Bankole',
    location: 'Port Harcourt',
    vehicle: '2021 Rolls-Royce Ghost',
    rating: 5,
    review:
      'World-class service. They sourced a specific spec Rolls-Royce Ghost from the UK that I could not find anywhere in Nigeria. Delivered in 6 weeks. Exceptional team.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    name: 'Adaeze Williams',
    location: 'Lagos',
    vehicle: '2023 Mercedes-Maybach S 580',
    rating: 5,
    review:
      'The private viewing experience was outstanding — like being in a European showroom. My Maybach was presented perfectly. I\'ve already referred three colleagues.',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80',
  },
  {
    name: 'Emeka Igwe',
    location: 'Abuja',
    vehicle: '2022 Porsche Cayenne Turbo',
    rating: 5,
    review:
      'The financing arrangement through their banking partner was smooth and competitive. I\'m paying a better rate than my bank offered directly. Highly recommend.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    name: 'Fatima Al-Hassan',
    location: 'Abuja',
    vehicle: '2023 Range Rover Sport',
    rating: 5,
    review:
      'Bought my second car through Eleniyan Motors. The after-sales support is genuinely impressive — they sorted a minor warranty issue without any fuss. Loyal customer for life.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
]

const CASE_STUDIES = [
  {
    client: 'Mr. Tunde F.',
    tradeIn: { title: '2019 BMW 7 Series', mileage: '48,000 km', condition: 'Used' },
    newVehicle: { title: '2023 Range Rover Autobiography', price: '₦145,000,000' },
    saving: '₦8,500,000',
    story:
      'Mr. Tunde traded in his 2019 BMW 7 Series with 48,000 km for a fair market valuation of ₦32M, applying it directly toward his new Range Rover Autobiography. The net transaction saved him ₦8.5M compared to selling privately and buying separately.',
  },
  {
    client: 'Mrs. Adaeze W.',
    tradeIn: { title: '2020 Lexus LX 570', mileage: '31,000 km', condition: 'Used' },
    newVehicle: { title: '2023 Mercedes-Maybach S 580', price: '₦195,000,000' },
    saving: '₦5,200,000',
    story:
      'Trading in her Lexus LX 570 to upgrade to a Maybach S 580, Mrs. Adaeze received an above-market valuation of ₦48M. The seamless trade-in process took just 48 hours from assessment to completion.',
  },
]

const VIDEO_TESTIMONIALS = [
  {
    name: 'Olumide Bankole',
    vehicle: 'Rolls-Royce Ghost',
    thumbnail: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'Chidinma Okoye',
    vehicle: 'Bentley Bentayga',
    thumbnail: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-gray-200'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="container-xl text-center">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Client Stories</p>
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">Testimonials</h1>
          <div className="gold-divider mx-auto mb-6" aria-hidden="true" />
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Don&apos;t take our word for it — hear directly from our clients across Nigeria.
          </p>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 bg-gray-50" aria-labelledby="video-heading">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 id="video-heading" className="section-heading">Video Reviews</h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {VIDEO_TESTIMONIALS.map((v) => (
              <div key={v.name} className="card overflow-hidden group">
                <a
                  href={v.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${v.name}'s testimonial about their ${v.vehicle}`}
                >
                  <div className="relative aspect-video bg-gray-900">
                    <Image
                      src={v.thumbnail}
                      alt={`${v.name} — ${v.vehicle} testimonial thumbnail`}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[14px] border-l-navy ml-1" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-navy">{v.name}</p>
                    <p className="text-sm text-gold">{v.vehicle}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Text Reviews */}
      <section className="py-20 bg-white" aria-labelledby="reviews-heading">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 id="reviews-heading" className="section-heading">Client Reviews</h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <article key={review.name} className="card p-6 flex flex-col">
                <Quote className="w-8 h-8 text-gold/30 mb-4" aria-hidden="true" />
                <StarRating rating={review.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 flex-1">&ldquo;{review.review}&rdquo;</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-navy text-sm">{review.name}</p>
                    <p className="text-xs text-gold">{review.vehicle}</p>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-In Case Studies */}
      <section className="py-20 bg-gray-50" aria-labelledby="case-studies-heading">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-3">Real Results</p>
            <h2 id="case-studies-heading" className="section-heading">Trade-In Case Studies</h2>
            <div className="gold-divider mx-auto mt-4" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CASE_STUDIES.map((cs) => (
              <article key={cs.client} className="card p-8">
                <p className="text-xs text-gold uppercase tracking-widest mb-5">{cs.client}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-card p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Traded In</p>
                    <p className="font-heading text-sm text-navy">{cs.tradeIn.title}</p>
                    <p className="text-xs text-gray-500">{cs.tradeIn.mileage}</p>
                  </div>
                  <div className="text-2xl text-gold font-heading" aria-hidden="true">→</div>
                  <div className="flex-1 bg-navy/5 rounded-card p-4 text-center border border-gold/20">
                    <p className="text-xs text-gray-400 mb-1">Acquired</p>
                    <p className="font-heading text-sm text-navy">{cs.newVehicle.title}</p>
                    <p className="text-xs text-gold font-medium">{cs.newVehicle.price}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{cs.story}</p>
                <div className="bg-green-50 border border-green-200 rounded-card px-4 py-3 flex items-center gap-2">
                  <span className="text-green-600 font-heading text-lg">{cs.saving}</span>
                  <span className="text-xs text-green-600">saved vs. separate buy/sell</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
