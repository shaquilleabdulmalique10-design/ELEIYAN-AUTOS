'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { PaginatedVehicles } from '@eleniyan/types'
import VehicleCard from './VehicleCard'
import { SORT_OPTIONS } from '@/lib/constants'
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface InventoryResultsProps {
  result: PaginatedVehicles
}

export default function InventoryResults({ result }: InventoryResultsProps) {
  const router = useRouter()
  const sp = useSearchParams()
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const currentSort = sp.get('sort') || 'newest'

  const setSort = (sort: string) => {
    const params = new URLSearchParams(sp.toString())
    params.set('sort', sort)
    params.delete('page')
    router.push(`/inventory?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(sp.toString())
    params.set('page', String(page))
    router.push(`/inventory?${params.toString()}`)
  }

  const { data: vehicles, total, page, totalPages } = result

  if (!vehicles.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="font-heading text-xl text-navy mb-2">No vehicles found</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Try adjusting your filters or{' '}
          <button
            onClick={() => router.push('/inventory')}
            className="text-gold hover:underline"
          >
            clear all filters
          </button>{' '}
          to see our full inventory.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-charcoal">{vehicles.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-charcoal">{total}</span> vehicles
        </p>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            className="form-select text-sm py-2 pr-8 w-auto"
            aria-label="Sort vehicles"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-2 transition-colors',
                view === 'grid' ? 'bg-navy text-white' : 'bg-white text-gray-400 hover:text-navy'
              )}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-2 transition-colors',
                view === 'list' ? 'bg-navy text-white' : 'bg-white text-gray-400 hover:text-navy'
              )}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List */}
      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
        )}
      >
        {vehicles.map((vehicle, i) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            priority={i < 6}
            className={view === 'list' ? 'flex flex-row' : ''}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 mt-10"
          aria-label="Pagination"
        >
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="w-9 h-9 rounded-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gold hover:text-gold disabled:opacity-30 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | '...')[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p as number)}
                  className={cn(
                    'w-9 h-9 rounded-sm border text-sm font-medium transition-colors',
                    page === p
                      ? 'bg-gold border-gold text-navy'
                      : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                  )}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="w-9 h-9 rounded-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gold hover:text-gold disabled:opacity-30 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  )
}
