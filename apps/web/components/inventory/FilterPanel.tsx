'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MAKES,
  MODELS_BY_MAKE,
  LOCATIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  CONDITIONS,
  YEAR_OPTIONS,
} from '@/lib/constants'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-left mb-3 group"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold text-navy uppercase tracking-wider">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
        )}
      </button>
      {open && children}
    </div>
  )
}

function CheckGroup({
  options,
  param,
  current,
  onChange,
}: {
  options: { value: string; label: string }[]
  param: string
  current: string[]
  onChange: (param: string, values: string[]) => void
}) {
  const toggle = (val: string) => {
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val]
    onChange(param, next)
  }
  return (
    <ul className="space-y-2">
      {options.map(({ value, label }) => (
        <li key={value}>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={current.includes(value)}
              onChange={() => toggle(value)}
              className="w-4 h-4 rounded border-gray-300 accent-gold"
            />
            <span className="text-sm text-charcoal group-hover:text-gold transition-colors">
              {label}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FilterPanel() {
  const router = useRouter()
  const sp = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const get = useCallback((key: string) => sp.get(key) || '', [sp])
  const getArr = useCallback(
    (key: string) => sp.getAll(key).flatMap((v) => v.split(',')).filter(Boolean),
    [sp]
  )

  const [make, setMake] = useState(get('make'))
  const [model, setModel] = useState(get('model'))
  const [minYear, setMinYear] = useState(get('minYear'))
  const [maxYear, setMaxYear] = useState(get('maxYear'))
  const [minPrice, setMinPrice] = useState(get('minPrice'))
  const [maxPrice, setMaxPrice] = useState(get('maxPrice'))
  const [maxMileage, setMaxMileage] = useState(get('maxMileage'))
  const [fuelTypes, setFuelTypes] = useState<string[]>(getArr('fuelType'))
  const [transmissions, setTransmissions] = useState<string[]>(getArr('transmission'))
  const [bodyTypes, setBodyTypes] = useState<string[]>(getArr('bodyType'))
  const [locations, setLocations] = useState<string[]>(getArr('location'))
  const [conditions, setConditions] = useState<string[]>(getArr('condition'))

  const models = make ? (MODELS_BY_MAKE[make] ?? []) : []

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (make) params.set('make', make)
    if (model) params.set('model', model)
    if (minYear) params.set('minYear', minYear)
    if (maxYear) params.set('maxYear', maxYear)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (maxMileage) params.set('maxMileage', maxMileage)
    fuelTypes.forEach((v) => params.append('fuelType', v))
    transmissions.forEach((v) => params.append('transmission', v))
    bodyTypes.forEach((v) => params.append('bodyType', v))
    locations.forEach((v) => params.append('location', v))
    conditions.forEach((v) => params.append('condition', v))
    router.push(`/inventory?${params.toString()}`)
    setMobileOpen(false)
  }

  const clearAll = () => {
    setMake(''); setModel(''); setMinYear(''); setMaxYear('')
    setMinPrice(''); setMaxPrice(''); setMaxMileage('')
    setFuelTypes([]); setTransmissions([]); setBodyTypes([])
    setLocations([]); setConditions([])
    router.push('/inventory')
    setMobileOpen(false)
  }

  const handleMulti = (param: string, values: string[]) => {
    const setters: Record<string, (v: string[]) => void> = {
      fuelType: setFuelTypes,
      transmission: setTransmissions,
      bodyType: setBodyTypes,
      location: setLocations,
      condition: setConditions,
    }
    setters[param]?.(values)
  }

  const activeCount = [
    make, model, minYear, maxYear, minPrice, maxPrice, maxMileage,
    ...fuelTypes, ...transmissions, ...bodyTypes, ...locations, ...conditions,
  ].filter(Boolean).length

  const panelContent = (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          <span className="font-heading text-sm text-navy">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Make */}
      <Section title="Make">
        <select
          value={make}
          onChange={(e) => { setMake(e.target.value); setModel('') }}
          className="form-select w-full text-sm"
        >
          <option value="">All Makes</option>
          {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Section>

      {/* Model */}
      {models.length > 0 && (
        <Section title="Model">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="form-select w-full text-sm"
          >
            <option value="">All Models</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Section>
      )}

      {/* Condition */}
      <Section title="Condition">
        <CheckGroup
          options={CONDITIONS}
          param="condition"
          current={conditions}
          onChange={handleMulti}
        />
      </Section>

      {/* Body Type */}
      <Section title="Body Type">
        <CheckGroup
          options={BODY_TYPES}
          param="bodyType"
          current={bodyTypes}
          onChange={handleMulti}
        />
      </Section>

      {/* Fuel Type */}
      <Section title="Fuel Type">
        <CheckGroup
          options={FUEL_TYPES}
          param="fuelType"
          current={fuelTypes}
          onChange={handleMulti}
        />
      </Section>

      {/* Transmission */}
      <Section title="Transmission">
        <CheckGroup
          options={TRANSMISSIONS}
          param="transmission"
          current={transmissions}
          onChange={handleMulti}
        />
      </Section>

      {/* Location */}
      <Section title="Location">
        <CheckGroup
          options={LOCATIONS}
          param="location"
          current={locations}
          onChange={handleMulti}
        />
      </Section>

      {/* Year Range */}
      <Section title="Year" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <select
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="form-select w-full text-sm"
            >
              <option value="">Any</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <select
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="form-select w-full text-sm"
            >
              <option value="">Any</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* Price Range (in naira) */}
      <Section title="Price (₦ Million)" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min</label>
            <input
              type="number"
              value={minPrice ? String(Number(minPrice) / 100_000_000) : ''}
              onChange={(e) =>
                setMinPrice(e.target.value ? String(Number(e.target.value) * 100_000_000) : '')
              }
              placeholder="0"
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max</label>
            <input
              type="number"
              value={maxPrice ? String(Number(maxPrice) / 100_000_000) : ''}
              onChange={(e) =>
                setMaxPrice(e.target.value ? String(Number(e.target.value) * 100_000_000) : '')
              }
              placeholder="500"
              className="form-input text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Max Mileage */}
      <Section title="Max Mileage (km)" defaultOpen={false}>
        <input
          type="number"
          value={maxMileage}
          onChange={(e) => setMaxMileage(e.target.value)}
          placeholder="e.g. 50000"
          className="form-input text-sm w-full"
        />
      </Section>

      {/* Apply */}
      <button
        onClick={applyFilters}
        className="btn-primary w-full mt-2"
      >
        Apply Filters
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 btn-secondary mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters {activeCount > 0 && `(${activeCount})`}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-navy">Filter Vehicles</h2>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {panelContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0" aria-label="Filter sidebar">
        <div className="bg-white rounded-card shadow-card p-5 sticky top-28">
          {panelContent}
        </div>
      </aside>
    </>
  )
}
