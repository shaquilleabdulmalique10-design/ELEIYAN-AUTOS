'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Car,
  Users,
  BarChart3,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-navy border-r border-white/10 transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0', collapsed && 'justify-center px-0')}>
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-navy text-sm">E</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-heading text-sm text-white leading-none">Eleniyan</p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Admin</p>
          </div>
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
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors',
                    active
                      ? 'bg-gold/15 text-gold'
                      : 'text-white/60 hover:bg-white/5 hover:text-white',
                    collapsed && 'justify-center px-0'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {!collapsed && label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: collapse toggle + sign out */}
      <div className="shrink-0 border-t border-white/10 py-3 px-2 space-y-1">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/40 hover:text-white hover:bg-white/5 w-full transition-colors',
            collapsed && 'justify-center px-0'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/40 hover:text-red-400 hover:bg-white/5 w-full transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
