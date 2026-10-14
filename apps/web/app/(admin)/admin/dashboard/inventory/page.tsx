'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getVehicles, deleteVehicle, updateVehicle } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import type { VehicleListItem } from '@eleniyan/types'

export default function AdminInventoryPage() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken ?? ''

  const [vehicles, setVehicles] = useState<VehicleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getVehicles({ search: search || undefined, page, limit: 15 })
      setVehicles(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const handleToggleAvailability = async (vehicle: VehicleListItem) => {
    try {
      if (!vehicle.isAvailable) {
        await updateVehicle(vehicle.id, { isAvailable: true }, token)
      } else {
        await deleteVehicle(vehicle.id, token)
      }
      toast.success(`Vehicle ${vehicle.isAvailable ? 'hidden' : 'restored'}`)
      fetchVehicles()
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl text-navy">Inventory</h1>
          <p className="text-sm text-gray-400">{total} vehicle{total !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchVehicles} className="btn-ghost p-2" aria-label="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/admin/dashboard/inventory/new" className="btn-primary gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search vehicles…"
          className="form-input pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Vehicle inventory">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Condition</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No vehicles found. <Link href="/admin/dashboard/inventory/new" className="text-gold hover:underline">Add one?</Link>
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    {/* Vehicle */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                          {v.images[0] ? (
                            <Image src={v.images[0]} alt={v.title} width={56} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-navy truncate max-w-[160px]">{v.title}</p>
                          <p className="text-xs text-gray-400">{v.year} · {v.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-heading text-gold">{formatPrice(v.price)}</span>
                    </td>
                    {/* Condition */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 capitalize">{v.condition.replace(/_/g, ' ')}</span>
                    </td>
                    {/* Location */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{v.location.replace('_', ' ')}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        v.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {v.isAvailable ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/inventory/${v.slug}`}
                          target="_blank"
                          className="p-1.5 rounded text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                          title="View on site"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/dashboard/inventory/${v.id}/edit`}
                          className="p-1.5 rounded text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleAvailability(v)}
                          className={`p-1.5 rounded transition-colors ${
                            v.isAvailable
                              ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={v.isAvailable ? 'Hide listing' : 'Restore listing'}
                        >
                          {v.isAvailable ? <Trash2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
  )
}
