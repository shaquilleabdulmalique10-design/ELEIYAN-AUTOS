'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { MAKES, CONDITIONS } from '@/lib/constants'

export default function QuickFilterBar() {
  const router = useRouter()
  const [make, setMake] = useState('')
  const [condition, setCondition] = useState('')
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (make) params.set('make', make)
    if (condition) params.set('condition', condition)
    if (search) params.set('search', search)
    router.push(`/inventory?${params.toString()}`)
  }

  return (
    <div className="container-xl -mt-6 sm:-mt-8 relative z-20 px-3 sm:px-4 lg:px-8">
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-card shadow-card-hover border border-gray-100 p-3 sm:p-4 md:p-5"
        role="search"
        aria-label="Quick vehicle search"
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model…"
              className="form-input pl-9 w-full text-sm"
              aria-label="Search vehicles"
            />
          </div>

          {/* Make + Condition row on mobile */}
          <div className="flex gap-2 sm:contents">
            <select
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="form-select flex-1 sm:w-40 md:w-44 text-sm"
              aria-label="Filter by make"
            >
              <option value="">All Makes</option>
              {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="form-select flex-1 sm:w-40 md:w-44 text-sm"
              aria-label="Filter by condition"
            >
              <option value="">Any Condition</option>
              {CONDITIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary shrink-0 gap-2 text-xs sm:text-sm w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Search Cars
          </button>
        </div>
      </form>
    </div>
  )
}
