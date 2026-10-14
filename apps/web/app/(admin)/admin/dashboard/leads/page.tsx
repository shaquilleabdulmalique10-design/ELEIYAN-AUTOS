'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Search, ExternalLink, ChevronDown, RefreshCw, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { getLeads, updateLeadStatus } from '@/lib/api'
import type { Lead } from '@eleniyan/types'
import { formatDate } from '@/lib/utils'

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED_WON', 'CLOSED_LOST']
const TYPES = ['REQUEST_VIEWING', 'TRADE_IN', 'CONTACT', 'NEWSLETTER', 'SCHEDULE_VIEWING']

const STATUS_COLOUR: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  QUALIFIED: 'bg-purple-100 text-purple-700 border-purple-200',
  CLOSED_WON: 'bg-green-100 text-green-700 border-green-200',
  CLOSED_LOST: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminLeadsPage() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken ?? ''

  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: '15', sort: 'newest' }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.type = typeFilter
      const res = await getLeads(params, token)
      setLeads(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [token, page, search, statusFilter, typeFilter])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId)
    try {
      await updateLeadStatus(leadId, newStatus, token)
      toast.success('Status updated')
      fetchLeads()
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => prev ? { ...prev, status: newStatus as Lead['status'] } : null)
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl text-navy">Leads</h1>
          <p className="text-sm text-gray-400">{total} lead{total !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={fetchLeads} className="btn-ghost p-2" aria-label="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search name, email, phone…"
            className="form-input pl-9 w-full"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="form-select w-auto">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className="form-select w-auto">
          <option value="">All Types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
        {(statusFilter || typeFilter || search) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); setPage(1) }}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Leads table">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Vehicle</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-400">No leads found.</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-gold/5' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy">{lead.name}</p>
                          <p className="text-xs text-gray-400">{lead.phone}</p>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-gray-500">{lead.type.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-gray-500 truncate max-w-[140px] block">
                            {lead.vehicleTitle ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative inline-block">
                            <select
                              value={lead.status}
                              onChange={(e) => { e.stopPropagation(); handleStatusChange(lead.id, e.target.value) }}
                              disabled={updatingId === lead.id}
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs font-semibold pl-2 pr-6 py-0.5 rounded-full border appearance-none cursor-pointer ${STATUS_COLOUR[lead.status] ?? 'bg-gray-100 text-gray-600'}`}
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-xs text-gray-400">{formatDate(lead.createdAt)}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-gold disabled:opacity-40 transition-colors">
                    Previous
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:border-gold disabled:opacity-40 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedLead && (
          <div className="w-72 shrink-0 bg-white rounded-card shadow-card p-5 self-start sticky top-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-sm text-navy">Lead Detail</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Name', value: selectedLead.name },
                { label: 'Email', value: selectedLead.email },
                { label: 'Phone', value: selectedLead.phone },
                { label: 'Type', value: selectedLead.type.replace(/_/g, ' ') },
                { label: 'Vehicle', value: selectedLead.vehicleTitle ?? '—' },
                { label: 'Source', value: selectedLead.source ?? '—' },
                { label: 'Date', value: formatDate(selectedLead.createdAt) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider">{label}</dt>
                  <dd className="text-charcoal font-medium mt-0.5 break-all">{value}</dd>
                </div>
              ))}
              {selectedLead.message && (
                <div>
                  <dt className="text-xs text-gray-400 uppercase tracking-wider">Message</dt>
                  <dd className="text-charcoal text-xs mt-0.5 leading-relaxed">{selectedLead.message}</dd>
                </div>
              )}
            </dl>
            {selectedLead.crmId && (
              <a
                href={`https://app.hubspot.com/contacts/${selectedLead.crmId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-1.5 text-xs text-gold hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in HubSpot
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
