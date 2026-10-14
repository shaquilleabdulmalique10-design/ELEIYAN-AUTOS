'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle, Heart, ChevronRight } from 'lucide-react'
import { NAV_LINKS, WHATSAPP_NUMBER } from '@/lib/constants'
import { getWhatsAppLink, cn } from '@/lib/utils'
import { useWishlist } from '@/lib/WishlistContext'

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { count, openDrawer } = useWishlist()

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isHome = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled || !isHome ? 'bg-navy shadow-lg' : 'bg-gradient-to-b from-navy/80 to-transparent'
        )}
        role="banner"
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Eleniyan Motors – Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center font-heading font-bold text-navy text-base sm:text-lg shrink-0">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-white text-lg sm:text-xl leading-none tracking-wide">
                  Eleniyan
                </span>
                <span className="text-gold text-[9px] sm:text-[10px] font-body uppercase tracking-[0.2em] leading-none">
                  Motors
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 xl:px-4 py-2 text-sm font-body font-medium tracking-wide transition-colors duration-150 rounded-sm whitespace-nowrap',
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Wishlist */}
              <button
                onClick={openDrawer}
                aria-label={`Saved vehicles${count > 0 ? ` (${count})` : ''}`}
                className="relative p-2 text-white/80 hover:text-gold transition-colors"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center leading-none">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>

              {/* WhatsApp — hidden on very small screens */}
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER, "Hello, I'd like to enquire about a vehicle")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-sm transition-colors"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>

              {/* Hamburger — mobile/tablet only */}
              <button
                className="lg:hidden p-2 text-white hover:text-gold transition-colors"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Off-Canvas Mobile Drawer ────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel — slides in from left */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-navy flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={() => setDrawerOpen(false)}
          >
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-heading font-bold text-navy text-base">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-white text-lg leading-none">Eleniyan</span>
              <span className="text-gold text-[9px] uppercase tracking-[0.2em] leading-none">Motors</span>
            </div>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-sm text-sm font-medium transition-colors',
                      active
                        ? 'bg-gold/15 text-gold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                    <ChevronRight className={cn('w-4 h-4', active ? 'text-gold' : 'text-white/30')} />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Saved Vehicles */}
          <button
            onClick={() => { openDrawer(); setDrawerOpen(false) }}
            className="flex items-center justify-between w-full px-4 py-3 rounded-sm text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              Saved Vehicles
            </span>
            {count > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>

        {/* Drawer footer */}
        <div className="shrink-0 border-t border-white/10 p-4 space-y-3">
          <a
            href={getWhatsAppLink(WHATSAPP_NUMBER, "Hello, I'd like to enquire about a vehicle at Eleniyan Motors")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-3 rounded-sm transition-colors"
            onClick={() => setDrawerOpen(false)}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
          <p className="text-center text-white/20 text-[10px]">
            Molipa Express, Ijebu-Ode, Ogun State
          </p>
        </div>
      </div>
    </>
  )
}
