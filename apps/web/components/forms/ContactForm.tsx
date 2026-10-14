'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createLead } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Valid phone number required'),
  type: z.enum(['CONTACT', 'SCHEDULE_VIEWING']),
  message: z.string().min(10, 'Please write at least 10 characters'),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  // honeypot
  website: z.string().max(0).optional(),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'CONTACT' },
  })

  const type = watch('type')

  const onSubmit = async (data: FormData) => {
    try {
      await createLead(data)
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Failed to send message. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-card shadow-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-heading text-xl text-navy mb-2">Message Received!</h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-5">
          Thank you for reaching out. A member of our team will be in touch within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary text-sm"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="bg-white rounded-card shadow-card p-6 space-y-5"
    >
      <h2 className="font-heading text-xl text-navy">Send Us a Message</h2>
      <div className="gold-divider" aria-hidden="true" />

      {/* Honeypot */}
      <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />

      {/* Enquiry type */}
      <div>
        <label className="form-label">Enquiry Type</label>
        <div className="flex gap-3">
          {[
            { value: 'CONTACT', label: 'General Enquiry' },
            { value: 'SCHEDULE_VIEWING', label: 'Schedule a Viewing' },
          ].map(({ value, label }) => (
            <label
              key={value}
              className={`flex-1 flex items-center justify-center gap-2 border rounded-sm py-2.5 text-sm cursor-pointer transition-colors ${
                type === value
                  ? 'border-gold bg-gold/5 text-gold font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gold'
              }`}
            >
              <input
                type="radio"
                value={value}
                {...register('type')}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="form-label">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            {...register('name')}
            className="form-input"
            placeholder="John Doe"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="cf-email" className="form-label">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            {...register('email')}
            className="form-input"
            placeholder="john@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="cf-phone" className="form-label">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="cf-phone"
          type="tel"
          {...register('phone')}
          className="form-input"
          placeholder="+234 800 000 0000"
          autoComplete="tel"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>

      {/* Viewing date/time (only for SCHEDULE_VIEWING) */}
      {type === 'SCHEDULE_VIEWING' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cf-date" className="form-label">Preferred Date</label>
            <input
              id="cf-date"
              type="date"
              {...register('preferredDate')}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label htmlFor="cf-time" className="form-label">Preferred Time</label>
            <select id="cf-time" {...register('preferredTime')} className="form-select">
              <option value="">Select time</option>
              {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(
                (t) => <option key={t} value={t}>{t}</option>
              )}
            </select>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label htmlFor="cf-message" className="form-label">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="cf-message"
          {...register('message')}
          rows={4}
          className="form-input resize-none"
          placeholder="Tell us how we can help…"
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
