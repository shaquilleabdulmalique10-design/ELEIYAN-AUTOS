'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts'

interface Props {
  leadsByType: Record<string, number>
  leadsByStatus: Record<string, number>
  leadsByDay: { label: string; count: number }[]
}

const TYPE_LABELS: Record<string, string> = {
  REQUEST_VIEWING: 'Viewing',
  TRADE_IN: 'Trade-In',
  CONTACT: 'Contact',
  SCHEDULE_VIEWING: 'Schedule',
  NEWSLETTER: 'Newsletter',
}

const STATUS_COLORS: Record<string, string> = {
  NEW: '#C9A84C',
  CONTACTED: '#3B82F6',
  QUALIFIED: '#10B981',
  CLOSED_WON: '#059669',
  CLOSED_LOST: '#EF4444',
}

const PIE_COLORS = ['#C9A84C', '#0A1628', '#3B82F6', '#10B981', '#F59E0B']

export default function AnalyticsCharts({ leadsByType, leadsByStatus, leadsByDay }: Props) {
  const typeData = Object.entries(leadsByType).map(([key, value]) => ({
    name: TYPE_LABELS[key] || key,
    value,
  }))

  const statusData = Object.entries(leadsByStatus).map(([key, value]) => ({
    name: key,
    value,
    fill: STATUS_COLORS[key] || '#9CA3AF',
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads over 7 days */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5">Leads — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={leadsByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              cursor={{ fill: '#f9fafb' }}
            />
            <Bar dataKey="count" name="Leads" fill="#C9A84C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leads by type */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5">Leads by Type</h2>
        {typeData.length === 0 ? (
          <p className="text-gray-400 text-sm py-10 text-center">No lead data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {typeData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Leads by status */}
      <div className="bg-white rounded-card shadow-card p-6 lg:col-span-2">
        <h2 className="font-heading text-base text-navy mb-5">Lead Pipeline</h2>
        {statusData.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No pipeline data yet</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {statusData.map(({ name, value, fill }) => (
              <div key={name} className="flex-1 min-w-[120px] bg-gray-50 rounded-card p-4 text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: fill }} />
                <p className="font-heading text-2xl text-navy">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{name.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
