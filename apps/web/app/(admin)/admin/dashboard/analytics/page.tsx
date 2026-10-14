'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, Car, CheckCircle } from 'lucide-react'

const COLOURS = ['#C9A84C', '#0A1628', '#3B82F6', '#10B981', '#EF4444']

// Simulated analytics data — replace with real API calls when analytics endpoint is built
function generateMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month) => ({
    month,
    leads: Math.floor(Math.random() * 40) + 10,
    viewings: Math.floor(Math.random() * 20) + 5,
    sales: Math.floor(Math.random() * 8) + 1,
  }))
}

const LEAD_TYPES = [
  { name: 'Request Viewing', value: 38 },
  { name: 'Trade-In', value: 22 },
  { name: 'General Contact', value: 20 },
  { name: 'Schedule Viewing', value: 12 },
  { name: 'Newsletter', value: 8 },
]

const TOP_MAKES = [
  { make: 'Range Rover', count: 45 },
  { make: 'Rolls-Royce', count: 32 },
  { make: 'Bentley', count: 28 },
  { make: 'Maybach', count: 24 },
  { make: 'Porsche', count: 18 },
]

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [monthlyData] = useState(generateMonthlyData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const summaryStats = [
    { label: 'Total Leads (YTD)', value: monthlyData.reduce((s, d) => s + d.leads, 0), Icon: Users, colour: 'text-blue-600 bg-blue-50' },
    { label: 'Viewings Requested', value: monthlyData.reduce((s, d) => s + d.viewings, 0), Icon: Car, colour: 'text-gold bg-gold/10' },
    { label: 'Estimated Sales', value: monthlyData.reduce((s, d) => s + d.sales, 0), Icon: CheckCircle, colour: 'text-green-600 bg-green-50' },
    { label: 'Conversion Rate', value: '14%', Icon: TrendingUp, colour: 'text-purple-600 bg-purple-50' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-card" />
        ))}
        <div className="sm:col-span-2 xl:col-span-4 h-72 bg-gray-100 rounded-card" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-navy">Analytics</h1>
        <p className="text-sm text-gray-400">Year-to-date performance overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map(({ label, value, Icon, colour }) => (
          <div key={label} className="bg-white rounded-card shadow-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colour}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading text-2xl text-navy">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leads over time */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5">Leads &amp; Viewings (Monthly)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="leads" stroke="#C9A84C" strokeWidth={2} dot={false} name="Leads" />
            <Line type="monotone" dataKey="viewings" stroke="#0A1628" strokeWidth={2} dot={false} name="Viewings" />
            <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} dot={false} name="Sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead types breakdown */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-heading text-base text-navy mb-5">Lead Types Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={LEAD_TYPES}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {LEAD_TYPES.map((_, i) => (
                  <Cell key={i} fill={COLOURS[i % COLOURS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top makes by enquiries */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-heading text-base text-navy mb-5">Top Makes by Enquiries</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_MAKES} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis dataKey="make" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Enquiries" radius={[0, 4, 4, 0]}>
                {TOP_MAKES.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#C9A84C' : '#0A1628'} fillOpacity={1 - i * 0.1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Analytics data is illustrative. Connect your analytics API for live numbers.
      </p>
    </div>
  )
}
