'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Vehicle360Showcase
 * ------------------
 * A cinematic multi-angle viewer that works with any set of ordered car photos.
 * - Drag (mouse + touch) to spin through frames
 * - Auto-orbit with configurable speed
 * - Parallax depth layer on the active frame
 * - Smooth CSS transitions between frames
 * - Works with as few as 1 image (degrades gracefully)
 */

interface Vehicle360ShowcaseProps {
  images: string[]   // ideally 12–36 evenly-spaced angles, but any count works
  title: string
  autoPlay?: boolean
}

const DRAG_SENSITIVITY = 4   // pixels per frame step
const AUTO_INTERVAL_MS = 80  // ms between frames in auto-play

export default function Vehicle360Showcase({
  images,
  title,
  autoPlay = true,
}: Vehicle360ShowcaseProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isDragging, setIsDragging] = useState(false)
  const [dragAccum, setDragAccum] = useState(0)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState<Record<number, boolean>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const lastClientX = useRef(0)
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = images.length

  const advanceFrame = useCallback(
    (delta: number) => {
      setFrameIndex((prev) => ((prev + delta) % total + total) % total)
    },
    [total]
  )

  // ── Auto-play ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPlaying && !isDragging && total > 1) {
      autoTimer.current = setInterval(() => advanceFrame(1), AUTO_INTERVAL_MS)
    }
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current)
    }
  }, [isPlaying, isDragging, advanceFrame, total])

  // ── Drag handlers (mouse) ────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsPlaying(false)
    lastClientX.current = e.clientX
    setDragAccum(0)
  }

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      const delta = e.clientX - lastClientX.current
      lastClientX.current = e.clientX

      // Parallax effect
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const cx = (e.clientX - rect.left) / rect.width - 0.5
        const cy = (e.clientY - rect.top) / rect.height - 0.5
        setParallax({ x: cx * 12, y: cy * 6 })
      }

      setDragAccum((prev) => {
        const next = prev + delta
        if (Math.abs(next) >= DRAG_SENSITIVITY) {
          const steps = Math.trunc(next / DRAG_SENSITIVITY)
          advanceFrame(-steps)
          return next - steps * DRAG_SENSITIVITY
        }
        return next
      })
    },
    [isDragging, advanceFrame]
  )

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
    setParallax({ x: 0, y: 0 })
  }, [])

  // ── Drag handlers (touch) ────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setIsPlaying(false)
    lastClientX.current = e.touches[0].clientX
    setDragAccum(0)
  }

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      const delta = e.touches[0].clientX - lastClientX.current
      lastClientX.current = e.touches[0].clientX
      setDragAccum((prev) => {
        const next = prev + delta
        if (Math.abs(next) >= DRAG_SENSITIVITY) {
          const steps = Math.trunc(next / DRAG_SENSITIVITY)
          advanceFrame(-steps)
          return next - steps * DRAG_SENSITIVITY
        }
        return next
      })
    },
    [isDragging, advanceFrame]
  )

  const onTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Global listeners
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd])

  if (!total) return null

  const currentSrc = images[frameIndex]
  const progress = total > 1 ? (frameIndex / (total - 1)) * 100 : 100

  return (
    <div className="w-full select-none">
      {/* Main viewer */}
      <div
        ref={containerRef}
        className={cn(
          'relative aspect-[16/9] rounded-card overflow-hidden',
          'bg-gradient-to-b from-[#08111f] via-[#0d1e35] to-[#050d1a]',
          isDragging ? 'cursor-grabbing' : 'cursor-ew-resize'
        )}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        aria-label={`360° view of ${title} — drag left or right to rotate`}
        role="img"
      >
        {/* Studio floor reflection */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0a1628]/80 to-transparent pointer-events-none z-10" />

        {/* Subtle grid floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-10 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, black, transparent)',
          }}
        />

        {/* Car image with parallax */}
        <div
          className="absolute inset-4 transition-transform duration-75"
          style={{
            transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          }}
        >
          {/* Pre-load adjacent frames invisibly */}
          {[
            (frameIndex - 1 + total) % total,
            (frameIndex + 1) % total,
          ].map((fi) => (
            <Image
              key={fi}
              src={images[fi]}
              alt=""
              fill
              className="object-contain opacity-0 pointer-events-none"
              aria-hidden="true"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={false}
            />
          ))}

          <Image
            src={currentSrc}
            alt={`${title} — angle ${frameIndex + 1} of ${total}`}
            fill
            className={cn(
              'object-contain transition-opacity duration-100',
              loaded[frameIndex] ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setLoaded((p) => ({ ...p, [frameIndex]: true }))}
            priority={frameIndex === 0}
            sizes="(max-width: 768px) 100vw, 60vw"
            draggable={false}
          />

          {/* Glow reflection under car */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Loading spinner */}
        {!loaded[frameIndex] && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Brand watermark */}
        <div className="absolute top-4 left-5 z-20 pointer-events-none">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] font-body">360° View</p>
        </div>

        {/* Frame counter */}
        <div className="absolute top-4 right-4 z-20 bg-navy/60 backdrop-blur-sm border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full pointer-events-none">
          {frameIndex + 1} / {total}
        </div>

        {/* Left / Right step buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); advanceFrame(-1) }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Previous angle"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); advanceFrame(1) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Next angle"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-navy/60 backdrop-blur-sm border border-white/10 text-white/60 text-xs px-4 py-2 rounded-full pointer-events-none">
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Drag to rotate
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center gap-4 mt-3">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying((v) => !v)}
          className={cn(
            'flex items-center gap-2 text-xs font-medium uppercase tracking-wider px-4 py-2 rounded-sm border transition-colors',
            isPlaying
              ? 'bg-gold/10 border-gold/30 text-gold'
              : 'bg-white border-gray-200 text-charcoal hover:border-gold'
          )}
        >
          {isPlaying ? (
            <><Pause className="w-3.5 h-3.5" /> Pause</>
          ) : (
            <><Play className="w-3.5 h-3.5" /> Auto Spin</>
          )}
        </button>

        {/* Progress scrubber */}
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={total - 1}
            value={frameIndex}
            onChange={(e) => {
              setIsPlaying(false)
              setFrameIndex(Number(e.target.value))
            }}
            className="w-full h-1.5 appearance-none rounded-full outline-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #C9A84C ${progress}%, #e5e7eb ${progress}%)`,
            }}
            aria-label="Rotate vehicle"
          />
        </div>

        {/* Reset */}
        <button
          onClick={() => { setFrameIndex(0); setIsPlaying(autoPlay) }}
          className="text-gray-400 hover:text-gold transition-colors"
          aria-label="Reset to front view"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Angle thumbnails — show up to 8 */}
      {total > 2 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {Array.from({ length: Math.min(total, 8) }, (_, i) =>
            Math.round((i / Math.min(total, 8)) * total)
          ).map((fi) => (
            <button
              key={fi}
              onClick={() => { setIsPlaying(false); setFrameIndex(fi) }}
              className={cn(
                'shrink-0 w-16 h-11 rounded overflow-hidden border-2 transition-all',
                frameIndex === fi
                  ? 'border-gold scale-105 shadow-gold'
                  : 'border-transparent opacity-60 hover:opacity-90'
              )}
              aria-label={`Jump to angle ${fi + 1}`}
            >
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={images[fi]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
