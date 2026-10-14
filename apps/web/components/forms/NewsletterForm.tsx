'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { subscribeNewsletter } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  website: z.string().max(0).optional(), // honeypot
})

type FormData = z.infer<typeof schema>

interface NewsletterFormProps {
  variant?: 'inline' | 'card'
  className?: string
}

export default function NewsletterForm({ variant = 'inline', className }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (data.website) return // honeypot
    try {
      await subscribeNewsletter(data.email)
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Subscription failed. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className={`flex items-center gap-3 text-green-600 ${className ?? ''}`}>
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">You&apos;re subscribed! Welcome to the Eleniyan circle.</p>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`bg-navy rounded-card p-6 ${className ?? ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-gold" aria-hidden="true" />
          <h3 className="font-heading text-base text-white">Stay in the Loop</h3>
        </div>
        <p className="text-white/50 text-sm mb-4 leading-relaxed">
          Get notified about new arrivals, exclusive deals, and import guides.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />
          <div>
            <input
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="form-input bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-gold w-full"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-sm gap-2">
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            Subscribe
          </button>
        </form>
      </div>
    )
  }

  // Inline (default)
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`flex flex-col sm:flex-row gap-3 ${className ?? ''}`}
      aria-label="Newsletter subscription"
    >
      <input type="text" {...register('website')} className="hidden" tabIndex={-1} aria-hidden="true" />
      <div className="flex-1">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          {...register('email')}
          placeholder="Enter your email address"
          className="form-input w-full"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary shrink-0 gap-2"
      >
        {isSubmitting ? (
          <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
        ) : (
          <Mail className="w-4 h-4" aria-hidden="true" />
        )}
        Subscribe
      </button>
    </form>
  )
}
