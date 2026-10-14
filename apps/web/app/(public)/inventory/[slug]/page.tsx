import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVehicleBySlug, getVehicles } from '@/lib/api'
import VehicleGallery from '@/components/inventory/VehicleGallery'
import VehicleDetailSidebar from '@/components/inventory/VehicleDetailSidebar'
import { formatPrice, formatMileage } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const result = await getVehicles({ limit: 100 })
    return result.data.map((v) => ({ slug: v.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const vehicle = await getVehicleBySlug(params.slug)
    return {
      title: `${vehicle.title} — ${vehicle.year}`,
      description: `${vehicle.year} ${vehicle.title} for sale in Nigeria. ${formatPrice(vehicle.price)}. ${vehicle.mileage.toLocaleString()} km. ${vehicle.condition.replace('_', ' ')}.`,
      openGraph: {
        title: `${vehicle.title} | Eleniyan Motors`,
        description: vehicle.description.slice(0, 160),
        images: vehicle.images[0] ? [vehicle.images[0]] : [],
      },
    }
  } catch {
    return { title: 'Vehicle Not Found' }
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  let vehicle
  try {
    vehicle = await getVehicleBySlug(params.slug)
  } catch {
    notFound()
  }

  const locationLabel: Record<string, string> = {
    LAGOS: 'Lagos', ABUJA: 'Abuja', PORT_HARCOURT: 'Port Harcourt',
  }

  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicle.title,
    description: vehicle.description,
    image: vehicle.images,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' },
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    offers: {
      '@type': 'Offer',
      price: vehicle.price / 100,
      priceCurrency: 'NGN',
      availability: vehicle.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
  }

  const specs = [
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year },
    { label: 'Mileage', value: formatMileage(vehicle.mileage) },
    { label: 'Fuel Type', value: vehicle.fuelType.charAt(0) + vehicle.fuelType.slice(1).toLowerCase() },
    { label: 'Transmission', value: vehicle.transmission.charAt(0) + vehicle.transmission.slice(1).toLowerCase() },
    { label: 'Body Type', value: vehicle.bodyType.charAt(0) + vehicle.bodyType.slice(1).toLowerCase() },
    { label: 'Colour', value: vehicle.color },
    { label: 'Condition', value: vehicle.condition.replace(/_/g, ' ') },
    { label: 'Location', value: locationLabel[vehicle.location] },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-xl py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-gray-400" role="list">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
                <li><Link href="/inventory" className="hover:text-gold transition-colors">Inventory</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
                <li className="text-charcoal font-medium" aria-current="page">{vehicle.title}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="container-xl py-8">
          {/* Title row */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={vehicle.condition === 'NEW' ? 'gold' : vehicle.condition === 'CERTIFIED_PRE_OWNED' ? 'green' : 'gray'}>
                {vehicle.condition.replace(/_/g, ' ')}
              </Badge>
              {!vehicle.isAvailable && <Badge variant="red">Sold</Badge>}
            </div>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl text-navy">
              {vehicle.title}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{vehicle.year} · {locationLabel[vehicle.location]}</p>
          </div>

          {/* Main layout */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Left — Gallery + Details */}
            <div className="flex-1 min-w-0">
              <VehicleGallery
                images={vehicle.images.length ? vehicle.images : ['/images/car-placeholder.jpg']}
                gallery360={vehicle.gallery360}
                video={vehicle.video}
                title={vehicle.title}
              />

              {/* Description */}
              <div className="mt-8 bg-white rounded-card shadow-card p-6">
                <h2 className="font-heading text-xl text-navy mb-4">About this Vehicle</h2>
                <div className="gold-divider mb-5" aria-hidden="true" />
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>

                {/* Features */}
                {vehicle.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-heading text-base text-navy mb-4">Key Features</h3>
                    <ul className="flex flex-wrap gap-2" role="list">
                      {vehicle.features.map((feature) => (
                        <li key={feature}>
                          <Badge variant="gray">{feature}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Specs Table */}
              <div className="mt-6 bg-white rounded-card shadow-card p-6">
                <h2 className="font-heading text-xl text-navy mb-4">Full Specifications</h2>
                <div className="gold-divider mb-5" aria-hidden="true" />
                <dl className="divide-y divide-gray-100">
                  {specs.map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-3">
                      <dt className="text-sm text-gray-500 w-1/2">{label}</dt>
                      <dd className="text-sm font-medium text-charcoal text-right w-1/2 capitalize">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right — Sidebar */}
            <div className="lg:w-80 shrink-0">
              <VehicleDetailSidebar vehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
