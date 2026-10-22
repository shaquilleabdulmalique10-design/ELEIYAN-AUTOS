'use client'

import { signOut } from 'next-auth/react'
import { Bell, LogOut, User, ChevronDown, Menu } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSidebar } from './AdminSidebar'

interface AdminHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { setMobileOpen } = useSidebar()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Left: hamburger (mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 rounded-sm text-gray-500 hover:text-navy hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">
          Eleniyan Motors
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-navy hover:border-gold transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" aria-hidden="true" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 sm:pl-3 pr-2 py-1.5 rounded-full border border-gray-200 hover:border-gold transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center">
              <User className="w-4 h-4 text-gold" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-navy leading-none">{user?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 truncate max-w-[120px]">
                {user?.email ?? ''}
              </p>
            </div>
            <ChevronDown
              className={cn('w-3.5 h-3.5 text-gray-400 transition-transform', dropdownOpen && 'rotate-180')}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-card shadow-card-hover border border-gray-100 overflow-hidden z-20 animate-slide-down">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-navy">{user?.name ?? 'Admin'}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email ?? ''}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
