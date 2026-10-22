'use client'

import { useState } from 'react'
import AdminSidebar, { SidebarContext } from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface Props {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function AdminDashboardClient({ children, user }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <AdminHeader user={user} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6" id="admin-main">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
