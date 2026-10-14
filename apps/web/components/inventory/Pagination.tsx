'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

export default function Pagination({ currentPage, totalPages, total, limit }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/inventory?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const start = (currentPage - 1) * limit + 1
  const end = Math.min(currentPage * limit, total)

  // Build page numbers to show
  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <nav className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4" aria-label="Pagination">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-charcoal">{start}–{end}</span> of{' '}
        <span className="font-medium text-charcoal">{total}</span> vehicles
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-sm border border-gray-200 text-gray-500 hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-3 py-1.5 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p as number)}
              className={cn(
                'w-9 h-9 rounded-sm text-sm font-medium transition-colors',
                currentPage === p
                  ? 'bg-gold text-navy'
                  : 'border border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
              )}
              aria-label={`Page ${p}`}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-sm border border-gray-200 text-gray-500 hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  )
}
