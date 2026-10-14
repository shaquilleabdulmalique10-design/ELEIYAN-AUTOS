'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, RefreshCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { createLead } from '@/lib/api'
import { MAKES, YEAR_OPTIONS } from '@/lib/constants'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid phone required'),
  tradeInMake: z.string().min(1, 'Make required'),
  tradeInModel: z.string().min(1, 'Model required'),
  tradeInYear: z.number({ invalid_type_error: 'Year required' }).int().min(2000),
  tradeInMileage: z.number({ invalid_type_error: 'Mileage required' }).int().min(0),
  tradeInCondition: z.string().min(1, 'Condition required'),
  message: z.string().optional(),
  website: z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  targetVehicleId?: string
  targetVehicleTitle?: string
}

export default function TradeInModal({ isOpen, onClose, targetVehicleId, targetVehicleTitle }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!isOpen) reset()
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen, reset])

  const onSubmit = async (data: FormData) => {
    await createLead({
      type: 'TRADE_IN',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      vehicleId: targetVehicleId,
      tradeInMake: data.tradeInMake,
      tradeInModel: data.tradeInModel,
      tradeInYear: data.tradeInYear,
      tradeInMileage: data.tradeInMileage,
      tradeInCondition: data.tradeInCondition,
    })
    toast.success('Trade-in request received! We\'ll value your car and be in touch.')
    setTimeout(onClose, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-card shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-gold" />
            <h2 className="font-heading text-lg text-navy">Trade-In Valuation</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {targetVehicleTitle && (
          <div className="px-6 py-3 bg-gold/5 border-b border-gold/20">
            <p className="text-xs text-gray-500">Trading towards:</p>
            <p className="text-sm font-semibold text-navy">{targetVehicleTitle}</p>
          </div>
        )}

        {isSubmitSuccessful ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <RefreshCcw className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-heading text-navy text-lg mb-1">Trade-In Request Submitted!</p>
            <p className="text-gray-500 text-sm">Our valuation team will contact you within 24 hours with an offer.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4">
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Your Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="ti-name" className="form-label">Full Name <span className="text-red-500">*</span></label>
                <input id="ti-name" type="text" {...register('name')} className="form-input" placeholder="John Doe" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="ti-phone" className="form-label">Phone <span className="text-red-500">*</span></label>
                <input id="ti-phone" type="tel" {...register('phone')} className="form-input" placeholder="+234 800 000 0000" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="ti-email" className="form-label">Email <span className="text-red-500">*</span></label>
                <input id="ti-email" type="email" {...register('email')} className="form-input" placeholder="you@email.com" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold pt-2">Vehicle You're Trading In</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ti-make" className="form-label">Make <span className="text-red-500">*</span></label>
                <select id="ti-make" {...register('tradeInMake')} className="form-select">
                  <option value="">Select make</option>
                  {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  <option value="Other">Other</option>
                </select>
                {errors.tradeInMake && <p className="mt-1 text-xs text-red-600">{errors.tradeInMake.message}</p>}
              </div>
              <div>
                <label htmlFor="ti-model" className="form-label">Model <span className="text-red-500">*</span></label>
                <input id="ti-model" type="text" {...register('tradeInModel')} className="form-input" placeholder="e.g. Ghost" />
                {errors.tradeInModel && <p className="mt-1 text-xs text-red-600">{errors.tradeInModel.message}</p>}
              </div>
              <div>
                <label htmlFor="ti-year" className="form-label">Year <span className="text-red-500">*</span></label>
                <select id="ti-year" {...register('tradeInYear', { valueAsNumber: true })} className="form-select">
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.tradeInYear && <p className="mt-1 text-xs text-red-600">{errors.tradeInYear.message}</p>}
              </div>
              <div>
                <label htmlFor="ti-mileage" className="form-label">Mileage (km) <span className="text-red-500">*</span></label>
                <input id="ti-mileage" type="number" {...register('tradeInMileage', { valueAsNumber: true })} className="form-input" placeholder="e.g. 25000" />
                {errors.tradeInMileage && <p className="mt-1 text-xs text-red-600">{errors.tradeInMileage.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ti-condition" className="form-label">Condition <span className="text-red-500">*</span></label>
                <select id="ti-condition" {...register('tradeInCondition')} className="form-select">
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent — like new</option>
                  <option value="Good">Good — minor wear</option>
                  <option value="Fair">Fair — visible wear</option>
                  <option value="Poor">Poor — significant issues</option>
                </select>
                {errors.tradeInCondition && <p className="mt-1 text-xs text-red-600">{errors.tradeInCondition.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ti-msg" className="form-label">Additional Notes</label>
                <textarea id="ti-msg" {...register('message')} rows={3} className="form-input resize-none"
                  placeholder="Any modifications, accident history, or other details…" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full gap-2">
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />Submitting…</>
                : <><RefreshCcw className="w-4 h-4" />Submit Trade-In Request</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
