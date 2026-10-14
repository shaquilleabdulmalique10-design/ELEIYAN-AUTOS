'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Fuel, Gauge, Calendar, Heart } from 'lucide-react'
import type { VehicleListItem } from '@eleniyan/types'
import { formatPrice, formatMileage } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/lib/WishlistContext'
import toast from 'react-hot-toast'

interface VehicleCardProps {
  vehicle: VehicleListItem
  priority?: boolean
  className?: string
}

const CONDITION_VARIANT: Record<string, 'gold' | 'green' | 'gray'> = {
  NEW: 'gold',
  CERTIFIED_PRE_OWNED: 'green',
  USED: 'gray',
}

const LOCATION_LABEL: Record<string, string> = {
  LAGOS: 'Lagos',
  ABUJA: 'Abuja',
  PORT_HARCOURT: 'Port Harcourt',
}

export default function VehicleCard({ vehicle, priority = false, className }: VehicleCardProps) {
  const mainImage = vehicle.images[0] || '/images/car-placeholder.jpg'
  const conditionLabel = vehicle.condition.replace(/_/g, ' ')
  const { toggle, inList } = useWishlist()
  const saved = inList(vehicle.id)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle({
      id: vehicle.id,
      slug: vehicle.slug,
      title: vehicle.title,
      year: vehicle.year,
      price: vehicle.price,
      images: vehicle.images,
      make: vehicle.make,
      model: vehicle.model,
      location: vehicle.location,
      addedAt: new Date().toISOString(),
    })
    if (!saved) {
      toast.success('Saved to wishlist', { icon: '❤️' })
    } else {
      toast('Removed from wishlist', { icon: '🗑️' })
    }
  }

  return (
    <Link
      href={`/inventory/${vehicle.slug}`}
      className={cn(
        'group block bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden',
        className
      )}
      aria-label={`View ${vehicle.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt={vehicle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant={CONDITION_VARIANT[vehicle.condition] ?? 'gray'}>
            {conditionLabel}
          </Badge>
          {vehicle.isFeatured && <Badge variant="gold">Featured</Badge>}
        </div>

        {/* Heart / Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={saved ? `Remove ${vehicle.title} from wishlist` : `Save ${vehicle.title} to wishlist`}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200',
            saved
              ? 'bg-white text-red-500 scale-110'
              : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white hover:scale-110'
          )}
        >
          <Heart className={cn('w-4 h-4', saved && 'fill-red-500')} aria-hidden="true" />
        </button>

        {!vehicle.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white/90 text-charcoal font-heading text-sm px-4 py-1.5 rounded-sm tracking-wide">
              SOLD
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gold text-navy text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-sm shadow-lg">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-heading text-base text-navy leading-snug group-hover:text-gold transition-colors line-clamp-1">
            {vehicle.title}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">{vehicle.year}</p>
        </div>

        <p className="font-heading text-xl text-gold mb-3">{formatPrice(vehicle.price)}</p>

        {/* Quick specs */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{formatMileage(vehicle.mileage)}</span>
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{vehicle.fuelType.charAt(0) + vehicle.fuelType.slice(1).toLowerCase()}</span>
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{vehicle.transmission.charAt(0) + vehicle.transmission.slice(1).toLowerCase()}</span>
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5 truncate">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{LOCATION_LABEL[vehicle.location] ?? vehicle.location}</span>
          </span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            View Full Details
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
