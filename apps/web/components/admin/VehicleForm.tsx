'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Upload, X, Plus } from 'lucide-react'
import Image from 'next/image'
import { createVehicle, updateVehicle, getUploadUrl } from '@/lib/api'
import type { Vehicle } from '@eleniyan/types'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import {
  MAKES, MODELS_BY_MAKE, LOCATIONS, FUEL_TYPES,
  TRANSMISSIONS, BODY_TYPES, CONDITIONS, YEAR_OPTIONS,
} from '@/lib/constants'

const schema = z.object({
  title: z.string().min(3, 'Title required'),
  make: z.string().min(1, 'Make required'),
  model: z.string().min(1, 'Model required'),
  year: z.number({ coerce: true }).int().min(1990),
  price: z.number({ coerce: true }).positive('Price required'),
  mileage: z.number({ coerce: true }).min(0),
  fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']),
  bodyType: z.enum(['SEDAN', 'SUV', 'COUPE', 'CONVERTIBLE', 'WAGON']),
  location: z.enum(['IJEBU_ODE']),
  condition: z.enum(['NEW', 'USED', 'CERTIFIED_PRE_OWNED']),
  color: z.string().min(1, 'Colour required'),
  description: z.string().min(20, 'Description too short'),
  isFeatured: z.boolean().default(false),
  video: z.string().optional(),
  inspectionPdfUrl: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface VehicleFormProps {
  vehicle?: Vehicle
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string })?.accessToken || ''

  const [images, setImages] = useState<string[]>(vehicle?.images || [])
  const [features, setFeatures] = useState<string[]>(vehicle?.features || [])
  const [featureInput, setFeatureInput] = useState('')
  const [uploading, setUploading] = useState(false)

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: vehicle
      ? { ...vehicle, price: vehicle.price / 100 }
      : { fuelType: 'PETROL', transmission: 'AUTOMATIC', bodyType: 'SUV', location: 'IJEBU_ODE', condition: 'USED', isFeatured: false },
  })

  const selectedMake = watch('make')
  const models = selectedMake ? MODELS_BY_MAKE[selectedMake] || [] : []

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of files) {
        // Get signed params from our API
        const { uploadUrl, fileUrl, cloudinaryParams } = await getUploadUrl(file.name, file.type, token)

        // Upload directly to Cloudinary using signed params
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', cloudinaryParams.api_key)
        formData.append('timestamp', String(cloudinaryParams.timestamp))
        formData.append('signature', cloudinaryParams.signature)
        formData.append('public_id', cloudinaryParams.public_id)
        formData.append('folder', cloudinaryParams.folder)

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.error?.message || 'Upload failed')
        }

        const result = await uploadRes.json()
        uploaded.push(result.secure_url)
      }
      setImages((prev) => [...prev, ...uploaded])
      toast.success(`${uploaded.length} image(s) uploaded`)
    } catch (err) {
      toast.error(`Upload failed: ${(err as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string) => setImages((prev) => prev.filter((i) => i !== url))

  const addFeature = () => {
    const f = featureInput.trim()
    if (f && !features.includes(f)) {
      setFeatures((prev) => [...prev, f])
      setFeatureInput('')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        price: Math.round(data.price * 100),
        images,
        features,
        gallery360: vehicle?.gallery360 || [],
      }
      if (vehicle) {
        await updateVehicle(vehicle.id, payload, token)
        toast.success('Vehicle updated')
      } else {
        await createVehicle(payload, token)
        toast.success('Vehicle added to inventory')
      }
      router.push('/admin/dashboard/inventory')
    } catch {
      toast.error('Failed to save vehicle. Please try again.')
    }
  }

  const fieldClass = 'form-select'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5 pb-3 border-b border-gray-100">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input label="Listing Title" required error={errors.title?.message}
              placeholder="e.g. 2022 Toyota Camry" {...register('title')} />
          </div>

          <div>
            <label htmlFor="v-make" className="form-label">Make <span className="text-red-500">*</span></label>
            <select id="v-make" className={fieldClass} {...register('make')}>
              <option value="">Select make</option>
              {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.make && <p className="mt-1 text-xs text-red-600">{errors.make.message}</p>}
          </div>

          <div>
            <label htmlFor="v-model" className="form-label">Model <span className="text-red-500">*</span></label>
            <select id="v-model" className={fieldClass} {...register('model')}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
              <option value="Other">Other</option>
            </select>
            {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model.message}</p>}
          </div>

          <div>
            <label htmlFor="v-year" className="form-label">Year <span className="text-red-500">*</span></label>
            <select id="v-year" className={fieldClass} {...register('year', { valueAsNumber: true })}>
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>}
          </div>

          <Input label="Price (₦)" type="number" required error={errors.price?.message}
            placeholder="e.g. 8500000" {...register('price', { valueAsNumber: true })} />
          <Input label="Mileage (km)" type="number" required error={errors.mileage?.message}
            placeholder="e.g. 45000" {...register('mileage', { valueAsNumber: true })} />
          <Input label="Colour" required error={errors.color?.message}
            placeholder="e.g. Jet Black" {...register('color')} />
        </div>
      </section>

      {/* Specifications */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5 pb-3 border-b border-gray-100">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { id: 'v-fuel', label: 'Fuel Type', name: 'fuelType', options: FUEL_TYPES },
            { id: 'v-trans', label: 'Transmission', name: 'transmission', options: TRANSMISSIONS },
            { id: 'v-body', label: 'Body Type', name: 'bodyType', options: BODY_TYPES },
            { id: 'v-location', label: 'Location', name: 'location', options: LOCATIONS },
            { id: 'v-condition', label: 'Condition', name: 'condition', options: CONDITIONS },
          ].map(({ id, label, name, options }) => (
            <div key={id}>
              <label htmlFor={id} className="form-label">{label}</label>
              <select id={id} className={fieldClass} {...register(name as keyof FormData)}>
                <option value="">Select...</option>
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input type="checkbox" id="v-featured" {...register('isFeatured')} className="w-4 h-4 accent-gold" />
          <label htmlFor="v-featured" className="text-sm font-medium text-charcoal cursor-pointer">
            Mark as Featured (appears on homepage)
          </label>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5 pb-3 border-b border-gray-100">Description & Features</h2>
        <Textarea label="Full Description" required error={errors.description?.message}
          placeholder="Detailed description of the vehicle..." {...register('description')}
          className="min-h-[160px]" />

        <div className="mt-5">
          <label className="form-label">Key Features</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text" value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
              placeholder="Add a feature and press Enter"
              className="form-input flex-1"
            />
            <Button type="button" onClick={addFeature} variant="secondary" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span key={f} className="flex items-center gap-1.5 bg-navy/5 text-navy text-xs px-3 py-1.5 rounded-full border border-navy/10">
                {f}
                <button type="button" onClick={() => setFeatures((prev) => prev.filter((x) => x !== f))}
                  className="hover:text-red-500 transition-colors" aria-label={`Remove ${f}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="bg-white rounded-card shadow-card p-6">
        <h2 className="font-heading text-base text-navy mb-5 pb-3 border-b border-gray-100">Media</h2>
        <div className="mb-5">
          <label className="form-label">Vehicle Images</label>
          <label htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-card cursor-pointer transition-colors
              ${uploading ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold hover:bg-gold/5'}`}>
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">
              {uploading ? 'Uploading...' : 'Click to upload images (JPEG, PNG, WebP)'}
            </p>
            <input id="image-upload" type="file" accept="image/*" multiple
              onChange={handleImageUpload} className="hidden" />
          </label>
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {images.map((url, i) => (
                <div key={url} className="relative aspect-square rounded overflow-hidden group">
                  <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="100px" />
                  <button type="button" onClick={() => removeImage(url)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Video URL (YouTube or MP4)" error={errors.video?.message}
            placeholder="https://youtube.com/watch?v=..." {...register('video')} />
          <Input label="Inspection PDF URL" error={errors.inspectionPdfUrl?.message}
            placeholder="https://..." {...register('inspectionPdfUrl')} />
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {vehicle ? 'Update Vehicle' : 'Add to Inventory'}
        </Button>
      </div>
    </form>
  )
}
