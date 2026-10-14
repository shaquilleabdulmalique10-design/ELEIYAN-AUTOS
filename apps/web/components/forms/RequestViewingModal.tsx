'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { createLead } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid phone required'),
  message: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  website: z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  vehicleId?: string
  vehicleTitle?: string
}

export default function RequestViewingModal({ isOpen, onClose, vehicleId, vehicleTitle }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!isOpen) reset()
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen, reset])

  const onSubmit = async (data: FormData) => {
    await createLead({
      type: 'REQUEST_VIEWING',
      ...data,
      vehicleId,
    })
    toast.success('Viewing request sent! We\'ll be in touch shortly.')
    setTimeout(onClose, 1800)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Request a private viewing"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-card shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gold" />
            <h2 className="font-heading text-lg text-navy">Request Private Viewing</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {vehicleTitle && (
          <div className="px-6 py-3 bg-gold/5 border-b border-gold/20">
            <p className="text-xs text-gray-500">Viewing request for:</p>
            <p className="text-sm font-semibold text-navy">{vehicleTitle}</p>
          </div>
        )}

        {isSubmitSuccessful ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-heading text-navy text-lg mb-1">Request Received!</p>
            <p className="text-gray-500 text-sm">Our team will confirm your viewing within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4">
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="rv-name" className="form-label">Full Name <span className="text-red-500">*</span></label>
                <input id="rv-name" type="text" {...register('name')} className="form-input" placeholder="John Doe" />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="rv-phone" className="form-label">Phone <span className="text-red-500">*</span></label>
                <input id="rv-phone" type="tel" {...register('phone')} className="form-input" placeholder="+234 800 000 0000" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="rv-email" className="form-label">Email <span className="text-red-500">*</span></label>
                <input id="rv-email" type="email" {...register('email')} className="form-input" placeholder="you@email.com" />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="rv-date" className="form-label">Preferred Date</label>
                <input id="rv-date" type="date" {...register('preferredDate')} className="form-input"
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label htmlFor="rv-time" className="form-label">Preferred Time</label>
                <select id="rv-time" {...register('preferredTime')} className="form-select">
                  <option value="">Any time</option>
                  {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="rv-msg" className="form-label">Additional Notes</label>
                <textarea id="rv-msg" {...register('message')} rows={3} className="form-input resize-none"
                  placeholder="Any specific questions or preferences…" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full gap-2 mt-2">
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />Sending…</>
                : <><Eye className="w-4 h-4" />Request Viewing</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
