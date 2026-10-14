'use client'

import { useState } from 'react'
import { MessageCircle, Eye, RefreshCcw, FileDown, Heart } from 'lucide-react'
import type { Vehicle } from '@eleniyan/types'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import Button from '@/components/ui/Button'
import RequestViewingModal from '@/components/forms/RequestViewingModal'
import TradeInModal from '@/components/forms/TradeInModal'
import { useWishlist } from '@/lib/WishlistContext'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface VehicleDetailSidebarProps {
  vehicle: Vehicle
}

export default function VehicleDetailSidebar({ vehicle }: VehicleDetailSidebarProps) {
  const [viewingOpen, setViewingOpen] = useState(false)
  const [tradeInOpen, setTradeInOpen] = useState(false)
  const { toggle, inList, openDrawer } = useWishlist()

  const saved = inList(vehicle.id)

  const handleWishlist = () => {
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
      openDrawer()
    } else {
      toast('Removed from wishlist', { icon: '🗑️' })
    }
  }

  const waMessage = `Hello, I'm interested in the ${vehicle.title} (${vehicle.year}) listed on Eleniyan Motors. Please share more details.`

  return (
    <>
      <div className="lg:sticky lg:top-28 space-y-4">

        {/* Price Card */}
        <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Asking Price</p>
          <p className="font-heading text-3xl text-gold mb-1">{formatPrice(vehicle.price)}</p>
          <p className="text-xs text-gray-400 mb-5">Contact us for final quote & financing options.</p>

          <div className="space-y-3">

            {/* Save to Wishlist */}
            <button
              onClick={handleWishlist}
              className={cn(
                'w-full flex items-center justify-center gap-2 font-semibold text-sm uppercase tracking-wide py-3.5 px-6 rounded-sm transition-all border-2',
                saved
                  ? 'bg-red-50 border-red-400 text-red-500 hover:bg-red-100'
                  : 'bg-white border-gold text-gold hover:bg-gold hover:text-navy'
              )}
            >
              <Heart className={cn('w-4 h-4', saved && 'fill-red-500 text-red-500')} />
              {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>

            {/* Request Private Viewing */}
            <Button
              onClick={() => setViewingOpen(true)}
              className="w-full"
              aria-haspopup="dialog"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              Request Private Viewing
            </Button>

            {/* Trade-In */}
            <Button
              variant="secondary"
              onClick={() => setTradeInOpen(true)}
              className="w-full"
              aria-haspopup="dialog"
            >
              <RefreshCcw className="w-4 h-4" aria-hidden="true" />
              Trade-In Valuation
            </Button>

            {/* WhatsApp */}
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm uppercase tracking-wide py-3 px-6 rounded-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* PDF Inspection Report */}
        {vehicle.inspectionPdfUrl && (
          <div className="bg-navy/5 rounded-card p-5 border border-navy/10">
            <p className="font-heading text-sm text-navy mb-1">Inspection Report</p>
            <p className="text-xs text-gray-500 mb-3">
              Download the full 100-point inspection report for this vehicle.
            </p>
            <a
              href={vehicle.inspectionPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gold hover:text-gold/80 font-medium transition-colors"
            >
              <FileDown className="w-4 h-4" aria-hidden="true" />
              Download PDF Report
            </a>
          </div>
        )}

        {/* Quick Facts */}
        <div className="bg-white rounded-card shadow-card p-5 border border-gray-100">
          <h3 className="font-heading text-sm text-navy mb-4 uppercase tracking-wider">Quick Facts</h3>
          <dl className="space-y-2.5">
            {[
              { label: 'Year', value: vehicle.year },
              { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
              { label: 'Fuel', value: vehicle.fuelType.charAt(0) + vehicle.fuelType.slice(1).toLowerCase() },
              { label: 'Transmission', value: vehicle.transmission.charAt(0) + vehicle.transmission.slice(1).toLowerCase() },
              { label: 'Location', value: vehicle.location.replace('_', ' ') },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <dt className="text-gray-400">{label}</dt>
                <dd className="font-medium text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>

      <RequestViewingModal
        isOpen={viewingOpen}
        onClose={() => setViewingOpen(false)}
        vehicleId={vehicle.id}
        vehicleTitle={vehicle.title}
      />
      <TradeInModal
        isOpen={tradeInOpen}
        onClose={() => setTradeInOpen(false)}
        targetVehicleId={vehicle.id}
        targetVehicleTitle={vehicle.title}
      />
    </>
  )
}
