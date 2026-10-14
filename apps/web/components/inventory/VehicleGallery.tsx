'use client'

import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Expand, X, RotateCcw, Box } from 'lucide-react'
import { cn } from '@/lib/utils'
import Vehicle360Showcase from './Vehicle360Showcase'

// Lazy-load the heavy Three.js viewer only when the "3D" tab is active
const ImmersiveCarViewer = lazy(() => import('./ImmersiveCarViewer'))

interface VehicleGalleryProps {
  images: string[]
  gallery360: string[]
  video?: string
  title: string
}

type Tab = 'photos' | '3d' | '360' | 'video'

export default function VehicleGallery({ images, gallery360, video, title }: VehicleGalleryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('photos')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const [mainRef, mainApi] = useEmblaCarousel()
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: 'keepSnaps', dragFree: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onThumbClick = useCallback(
    (index: number) => { mainApi?.scrollTo(index) },
    [mainApi]
  )

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return
    setSelectedIndex(mainApi.selectedScrollSnap())
    thumbApi.scrollTo(mainApi.selectedScrollSnap())
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!mainApi) return
    onSelect()
    mainApi.on('select', onSelect)
    return () => { mainApi.off('select', onSelect) }
  }, [mainApi, onSelect])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(images.length - 1, i + 1))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, images.length])

  // Use gallery360 if present, else fall back to photos for the 360 tab
  const spinImages = gallery360.length > 0 ? gallery360 : images

  const tabs: { id: Tab; label: string; icon?: React.ReactNode; disabled?: boolean }[] = [
    { id: 'photos', label: `Photos (${images.length})` },
    {
      id: '3d',
      label: 'Immersive 3D',
      icon: <Box className="w-3.5 h-3.5" />,
      disabled: images.length === 0,
    },
    {
      id: '360',
      label: '360° Spin',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
      disabled: spinImages.length === 0,
    },
    { id: 'video', label: 'Video', disabled: !video },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200 overflow-x-auto" role="tablist">
        {tabs.map(({ id, label, icon, disabled }) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`tab-panel-${id}`}
            onClick={() => !disabled && setActiveTab(id)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0',
              activeTab === id
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-navy',
              disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ── Photos ─────────────────────────────────────────────────────────── */}
      {activeTab === 'photos' && (
        <div id="tab-panel-photos" role="tabpanel">
          <div className="relative rounded-card overflow-hidden bg-gray-100 mb-3">
            <div className="embla" ref={mainRef}>
              <div className="embla__container">
                {images.map((src, i) => (
                  <div key={i} className="embla__slide">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={src}
                        alt={`${title} — image ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => mainApi?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => mainApi?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setLightboxIndex(selectedIndex); setLightboxOpen(true) }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="View fullscreen"
            >
              <Expand className="w-4 h-4" />
            </button>

            {/* "View in 3D" floating pill */}
            <button
              onClick={() => setActiveTab('3d')}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-navy/80 backdrop-blur-sm border border-gold/30 text-gold text-xs font-medium px-3 py-1.5 rounded-full hover:bg-navy transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              View in 3D
            </button>

            <div className="absolute bottom-3 right-3 bg-navy/70 text-white text-xs px-2.5 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="embla" ref={thumbRef}>
            <div className="embla__container gap-2" style={{ display: 'flex' }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => onThumbClick(i)}
                  className={cn(
                    'embla__slide shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors',
                    selectedIndex === i ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={selectedIndex === i}
                >
                  <div className="relative w-full h-full">
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Immersive 3D ────────────────────────────────────────────────────── */}
      {activeTab === '3d' && (
        <div id="tab-panel-3d" role="tabpanel">
          <Suspense
            fallback={
              <div className="aspect-[16/9] rounded-card bg-gradient-to-b from-[#050d1a] to-[#0a1628] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <p className="text-gold/60 text-xs uppercase tracking-widest">Loading 3D Engine…</p>
                </div>
              </div>
            }
          >
            <ImmersiveCarViewer images={images} title={title} />
          </Suspense>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Use your mouse or touch to orbit · Scroll to zoom in or out
          </p>
        </div>
      )}

      {/* ── 360° Spin ───────────────────────────────────────────────────────── */}
      {activeTab === '360' && spinImages.length > 0 && (
        <div id="tab-panel-360" role="tabpanel">
          <Vehicle360Showcase images={spinImages} title={title} autoPlay={true} />
        </div>
      )}

      {/* ── Video ───────────────────────────────────────────────────────────── */}
      {activeTab === 'video' && video && (
        <div id="tab-panel-video" role="tabpanel" className="aspect-[16/9] rounded-card overflow-hidden bg-gray-900">
          {video.includes('youtube') || video.includes('youtu.be') ? (
            <iframe
              src={video.replace('watch?v=', 'embed/')}
              title={`${title} video walkaround`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video}
              controls
              className="w-full h-full"
              aria-label={`${title} walkaround video`}
            />
          )}
        </div>
      )}

      {/* ── Lightbox ────────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
            disabled={lightboxIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl max-h-[85vh] px-16">
            <Image
              src={images[lightboxIndex]}
              alt={`${title} — image ${lightboxIndex + 1}`}
              width={1280}
              height={800}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <button
            onClick={() => setLightboxIndex((i) => Math.min(images.length - 1, i + 1))}
            disabled={lightboxIndex === images.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  )
}
