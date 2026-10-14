import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getVehicles } from '@/lib/api'
import FilterPanel from '@/components/inventory/FilterPanel'
import InventoryResults from '@/components/inventory/InventoryResults'

export const revalidate = 0

interface PageProps {
  searchParams: Record<string, string | string[]>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = searchParams as Record<string, string>
  const make = sp.make
  return {
    title: make ? `${make} Cars | Eleniyan Motors` : 'Car Inventory | Eleniyan Motors',
    description: `Browse${make ? ` ${make}` : ''} cars for sale at Eleniyan Motors, Ijebu-Ode, Ogun State.`,
  }
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const sp = searchParams as Record<string, string>
  const page = Number(sp.page) || 1

  let result = { data: [], total: 0, page: 1, limit: 12, totalPages: 0 }
  try {
    result = await getVehicles({
      make: sp.make,
      model: sp.model,
      minYear: sp.minYear ? Number(sp.minYear) : undefined,
      maxYear: sp.maxYear ? Number(sp.maxYear) : undefined,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      maxMileage: sp.maxMileage ? Number(sp.maxMileage) : undefined,
      fuelType: sp.fuelType as never,
      transmission: sp.transmission as never,
      bodyType: sp.bodyType as never,
      location: sp.location as never,
      condition: sp.condition as never,
      sort: (sp.sort as never) || 'newest',
      page,
      limit: 12,
    })
  } catch {
    // API down — show empty state
  }

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-navy py-8 sm:py-12">
        <div className="container-xl">
          <p className="text-gold text-xs sm:text-sm uppercase tracking-[0.3em] mb-1 sm:mb-2">
            Our Collection
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white">
            {sp.make ? `${sp.make} Inventory` : 'All Vehicles'}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-1 sm:mt-2">
            {result.total > 0
              ? `${result.total} vehicle${result.total !== 1 ? 's' : ''} available in Ijebu-Ode`
              : 'No vehicles found'}
          </p>
        </div>
      </div>

      <div className="container-xl py-5 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
          {/* Filters */}
          <Suspense>
            <FilterPanel />
          </Suspense>

          {/* Results */}
          <Suspense>
            <InventoryResults result={result} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
