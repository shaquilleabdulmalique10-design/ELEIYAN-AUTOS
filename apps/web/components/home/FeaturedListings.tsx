import Link from 'next/link'
import type { VehicleListItem } from '@eleniyan/types'
import VehicleCard from '@/components/inventory/VehicleCard'
import { ArrowRight } from 'lucide-react'

interface FeaturedListingsProps {
  vehicles: VehicleListItem[]
}

export default function FeaturedListings({ vehicles }: FeaturedListingsProps) {
  if (!vehicles.length) return null

  return (
    <section className="bg-white py-20" aria-labelledby="featured-heading">
      <div className="container-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-2 font-body">
              Hand-Picked Selection
            </p>
            <h2
              id="featured-heading"
              className="font-heading text-3xl md:text-4xl text-navy"
            >
              Featured Vehicles
            </h2>
            <div className="gold-divider mt-4" aria-hidden="true" />
          </div>
          <Link
            href="/inventory"
            className="flex items-center gap-2 text-sm font-semibold text-gold uppercase tracking-wider hover:gap-3 transition-all"
          >
            View All Inventory
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, i) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              priority={i < 3}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
