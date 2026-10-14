'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Heart, MessageCircle, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useWishlist } from '@/lib/WishlistContext'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { WHATSAPP_NUMBER } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function WishlistDrawer() {
  const { items, count, remove, clear, drawerOpen, closeDrawer } = useWishlist()

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeDrawer])

  // Build WhatsApp message with all saved cars
  const waMessage = items.length
    ? `Hello Eleniyan Motors! I'm interested in the following vehicles:\n${items.map((v, i) => `${i + 1}. ${v.title} (${v.year})`).join('\n')}\n\nPlease share more details.`
    : ''

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your saved vehicles"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out',
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-gold" aria-hidden="true" />
            <h2 className="font-heading text-lg text-white">
              Saved Vehicles
              {count > 0 && (
                <span className="ml-2 w-6 h-6 rounded-full bg-gold text-navy text-xs font-bold inline-flex items-center justify-center">
                  {count}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {count === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-9 h-9 text-gray-300" />
              </div>
              <h3 className="font-heading text-lg text-navy mb-2">No saved vehicles yet</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                Browse our inventory and tap the heart icon on any vehicle to save it here.
              </p>
              <button
                onClick={closeDrawer}
                className="btn-primary text-sm gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Browse Inventory
              </button>
            </div>
          ) : (
            /* Vehicle list */
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
                  {/* Image */}
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.images[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        width={96}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/inventory/${item.slug}`}
                      onClick={closeDrawer}
                      className="font-heading text-sm text-navy hover:text-gold transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{item.year} · {item.location.replace('_', ' ')}</p>
                    <p className="font-heading text-gold text-base mt-1">{formatPrice(item.price)}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => remove(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 self-start mt-1"
                    aria-label={`Remove ${item.title} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer CTAs — only shown when list has items */}
        {count > 0 && (
          <div className="shrink-0 border-t border-gray-100 p-4 space-y-3 bg-white">
            {/* WhatsApp enquiry about all saved cars */}
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm uppercase tracking-wide py-3 rounded-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire About All {count} Vehicle{count > 1 ? 's' : ''} on WhatsApp
            </a>

            {/* Browse more */}
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/inventory"
                onClick={closeDrawer}
                className="flex-1 flex items-center justify-center gap-2 btn-secondary text-sm py-2.5"
              >
                <ArrowRight className="w-4 h-4" />
                Browse More
              </Link>
              <button
                onClick={clear}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors px-3"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
