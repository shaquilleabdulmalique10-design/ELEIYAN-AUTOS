'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Car, Users, BarChart3,
  BookOpen, LogOut, ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState, useEffect, createContext, useContext } from 'react'

// ─── Context so AdminHeader can toggle this sidebar ───────────────────────────
export const SidebarContext = createContext<{
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}>({ mobileOpen: false, setMobileOpen: () => {} })

export function useSidebar() { return useContext(SidebarContext) }

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/dashboard/inventory', label: 'Inventory', Icon: Car },
  { href: '/admin/dashboard/leads', label: 'Leads', Icon: Users },
  { href: '/admin/dashboard/analytics', label: 'Analytics', Icon: BarChart3 },
  { href: '/admin/dashboard/blog', label: 'Blog', Icon: BookOpen },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { mobileOpen, setMobileOpen } = useSidebar()

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname, setMobileOpen])

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0',
        !isMobile && collapsed && 'justify-center px-0'
      )}>
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-navy text-sm">E</span>
        </div>
        {(isMobile || !collapsed) && (
          <div className="flex-1 min-w-0">
            <p className="font-heading text-sm text-white leading-none">Eleniyan</p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Admin</p>
          </div>
        )}
        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center ml-auto"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin sections">
        <ul className="space-y-1 px-2">
          {NAV.map(({ href, label, Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={!isMobile && collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-medium transition-colors',
                    active ? 'bg-gold/15 text-gold' : 'text-white/60 hover:bg-white/5 hover:text-white',
                    !isMobile && collapsed && 'justify-center px-0'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {(isMobile || !collapsed) && <span>{label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-white/10 py-3 px-2 space-y-1">
        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/40 hover:text-white hover:bg-white/5 w-full transition-colors',
              collapsed && 'justify-center px-0'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
            }
          </button>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/40 hover:text-red-400 hover:bg-white/5 w-full transition-colors',
            !isMobile && collapsed && 'justify-center px-0'
          )}
          title={!isMobile && collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          {(isMobile || !collapsed) && <span>Sign Out</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-full bg-navy border-r border-white/10 transition-all duration-300',
          collapsed ? 'w-16' : 'w-56'
        )}
        aria-label="Admin navigation"
      >
        {sidebarContent(false)}
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile: off-canvas drawer ───────────────────────────── */}
      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-72 bg-navy flex flex-col shadow-2xl transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        {sidebarContent(true)}
      </aside>
    </>
  )
}
