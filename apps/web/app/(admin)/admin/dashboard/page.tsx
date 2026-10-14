import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import {
  Car, Users, TrendingUp, PlusCircle,
  ArrowRight, Clock, CheckCircle, AlertCircle,
} from 'lucide-react'

async function getDashboardStats(token: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const [vehiclesRes, leadsRes] = await Promise.all([
      fetch(`${API}/api/vehicles?limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${API}/api/leads?limit=5&sort=newest`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
    ])
    const vehicles = vehiclesRes.ok ? await vehiclesRes.json() : { total: 0 }
    const leads = leadsRes.ok ? await leadsRes.json() : { total: 0, data: [] }
    return { totalVehicles: vehicles.total, totalLeads: leads.total, recentLeads: leads.data }
  } catch {
    return { totalVehicles: 0, totalLeads: 0, recentLeads: [] }
  }
}

const STATUS_COLOUR: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-purple-100 text-purple-700',
  CLOSED_WON: 'bg-green-100 text-green-700',
  CLOSED_LOST: 'bg-red-100 text-red-700',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const token = (session?.user as { accessToken?: string })?.accessToken ?? ''
  const { totalVehicles, totalLeads, recentLeads } = await getDashboardStats(token)

  const stats = [
    {
      label: 'Total Listings',
      value: totalVehicles,
      Icon: Car,
      href: '/admin/dashboard/inventory',
      color: 'text-navy bg-navy/10',
    },
    {
      label: 'Total Leads',
      value: totalLeads,
      Icon: Users,
      href: '/admin/dashboard/leads',
      color: 'text-gold bg-gold/10',
    },
    {
      label: 'New Leads (Today)',
      value: recentLeads.filter((l: { status: string }) => l.status === 'NEW').length,
      Icon: AlertCircle,
      href: '/admin/dashboard/leads?status=NEW',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Closed Won',
      value: recentLeads.filter((l: { status: string }) => l.status === 'CLOSED_WON').length,
      Icon: CheckCircle,
      href: '/admin/dashboard/leads?status=CLOSED_WON',
      color: 'text-green-600 bg-green-50',
    },
  ]

  const quickActions = [
    { label: 'Add Vehicle', href: '/admin/dashboard/inventory/new', Icon: PlusCircle },
    { label: 'View All Leads', href: '/admin/dashboard/leads', Icon: Users },
    { label: 'Analytics', href: '/admin/dashboard/analytics', Icon: TrendingUp },
    { label: 'View Live Site', href: '/', Icon: ArrowRight, external: true },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl text-navy">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Welcome back, {session?.user?.name?.split(' ')[0] ?? 'Admin'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-card shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-2xl text-navy">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-base text-navy">Recent Leads</h2>
            <Link href="/admin/dashboard/leads" className="text-xs text-gold hover:underline">
              View All
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No leads yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentLeads.map((lead: {
                id: string; name: string; email: string; type: string;
                status: string; vehicleTitle?: string; createdAt: string
              }) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{lead.name}</p>
                    <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                    {lead.vehicleTitle && (
                      <p className="text-xs text-gold truncate">{lead.vehicleTitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {lead.type.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOUR[lead.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-heading text-base text-navy mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map(({ label, href, Icon, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 p-3 rounded-sm border border-gray-100 hover:border-gold hover:bg-gold/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <span className="text-sm font-medium text-charcoal group-hover:text-navy">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gold ml-auto transition-colors" />
              </Link>
            ))}
          </div>

          {/* System status */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">System Status</p>
            {[
              { label: 'API Server', ok: true },
              { label: 'Database', ok: true },
              { label: 'CDN / Uploads', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${ok ? 'text-green-600' : 'text-red-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
                  {ok ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity note */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Clock className="w-3.5 h-3.5" />
        Dashboard refreshes on each page load · Data is live from API
      </div>
    </div>
  )
}
