'use client'

import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Html,
  useProgress,
} from '@react-three/drei'
import * as THREE from 'three'
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hotspot {
  position: [number, number, number]
  label: string
  description: string
}

interface ImmersiveCarViewerProps {
  images: string[]   // multi-angle shots: front, front-3/4, side, rear-3/4, rear, interior, engine
  title: string
  color?: string
  hotspots?: Hotspot[]
}

// ─── Loading overlay ──────────────────────────────────────────────────────────

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        <p className="text-white/70 text-xs font-body tracking-widest uppercase">
          {Math.round(progress)}%
        </p>
      </div>
    </Html>
  )
}

// ─── Floating image plane — renders a car photo as a 3D textured plane ────────

function CarImagePlane({
  imageUrl,
  position,
  rotation,
  scale,
  opacity = 1,
}: {
  imageUrl: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  opacity?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(imageUrl, (t) => {
      t.colorSpace = THREE.SRGBColorSpace
      setTexture(t)
    })
  }, [imageUrl])

  useFrame((state) => {
    if (!meshRef.current) return
    // subtle floating animation
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.04
  })

  if (!texture) return null

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 0.625]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        roughness={0.1}
        metalness={0.05}
      />
    </mesh>
  )
}

// ─── Scene: arranges car images in a 3D arc ───────────────────────────────────

function CarScene({
  images,
  autoRotate,
}: {
  images: string[]
  autoRotate: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Position images in a semi-circle arc
  const placements = images.slice(0, 7).map((_, i) => {
    const total = Math.min(images.length, 7)
    const angle = ((i / (total - 1)) - 0.5) * Math.PI * 1.2 // spread 216°
    const radius = 2.4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius - radius // offset so center image is at z=0
    const rotY = -angle
    // front-center image is bigger
    const distFromCenter = Math.abs(i - (total - 1) / 2)
    const sc = 1.6 - distFromCenter * 0.12
    const opacity = 1 - distFromCenter * 0.08
    return { x, z, rotY, sc, opacity }
  })

  useFrame((state) => {
    if (!groupRef.current) return
    if (autoRotate) {
      groupRef.current.rotation.y += 0.003
    }
    // camera gentle bob
    camera.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
  })

  return (
    <>
      {/* Ambient + directional lighting for a studio feel */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-5, 4, -2]} intensity={0.5} color="#C9A84C" />
      <pointLight position={[0, 6, 0]} intensity={0.8} color="#ffffff" />
      <spotLight
        position={[0, 10, 4]}
        angle={0.4}
        penumbra={0.6}
        intensity={1.2}
        castShadow
      />

      <group ref={groupRef}>
        {images.slice(0, 7).map((src, i) => {
          const p = placements[i]
          return (
            <CarImagePlane
              key={src}
              imageUrl={src}
              position={[p.x, 0, p.z]}
              rotation={[0, p.rotY, 0]}
              scale={[p.sc * 2.4, p.sc * 2.4, 1]}
              opacity={p.opacity}
            />
          )
        })}
      </group>

      {/* Ground reflection */}
      <ContactShadows
        position={[0, -0.82, 0]}
        opacity={0.45}
        scale={12}
        blur={2.5}
        far={4}
        color="#0A1628"
      />

      {/* Studio HDRI environment */}
      <Environment preset="studio" />
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImmersiveCarViewer({
  images,
  title,
  hotspots = [],
}: ImmersiveCarViewerProps) {
  const [autoRotate, setAutoRotate] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (!images.length) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full rounded-card overflow-hidden bg-gradient-to-b from-[#050d1a] to-[#0a1628] select-none',
        isFullscreen ? 'h-screen' : 'aspect-[16/9]'
      )}
    >
      {/* Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        className="w-full h-full"
      >
        <PerspectiveCamera makeDefault position={[0, 0.2, 4.5]} fov={45} />
        <Suspense fallback={<Loader />}>
          <CarScene images={images} autoRotate={autoRotate} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={2.5}
          maxDistance={7}
          autoRotate={false}
          makeDefault
        />
      </Canvas>

      {/* Title overlay */}
      <div className="absolute top-4 left-5 pointer-events-none">
        <p className="text-gold text-xs uppercase tracking-[0.3em] font-body mb-0.5">
          Immersive View
        </p>
        <p className="text-white font-heading text-lg leading-tight">{title}</p>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate((v) => !v)}
          title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors',
            autoRotate
              ? 'bg-gold/20 border-gold/50 text-gold'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          )}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hotspots */}
      {hotspots.map((hs, i) => (
        <button
          key={i}
          onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
          className="absolute w-7 h-7 rounded-full bg-gold/80 border-2 border-gold flex items-center justify-center text-navy hover:scale-110 transition-transform"
          style={{
            // These are 2D overlay positions, not 3D projected
            left: `${20 + i * 20}%`,
            top: `${40 + (i % 2) * 15}%`,
          }}
          aria-label={hs.label}
        >
          <Info className="w-3.5 h-3.5" />
          {activeHotspot === i && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy/95 border border-gold/30 rounded-card p-3 text-left pointer-events-none z-10">
              <p className="text-gold text-xs font-semibold mb-1">{hs.label}</p>
              <p className="text-white/80 text-xs leading-relaxed">{hs.description}</p>
            </div>
          )}
        </button>
      ))}

      {/* Drag hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-navy/50 backdrop-blur-sm border border-white/10 text-white/60 text-xs px-4 py-2 rounded-full pointer-events-none">
        <span className="inline-block w-4 h-4 border border-white/40 rounded-sm relative">
          <span className="absolute inset-0 flex items-center justify-center text-[8px]">↔</span>
        </span>
        Drag to explore · Scroll to zoom
      </div>
    </div>
  )
}
