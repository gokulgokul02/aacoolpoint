import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Float, Environment, Stars, PerspectiveCamera, Center,
  useGLTF, OrbitControls
} from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChevronDown, Wrench, Phone, AirVent,
  Thermometer, WashingMachine, Sparkles, Move3d
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

// =====================
// GLB 3D MODELS (Using User's Custom Uploaded GLB Assets)
// =====================

// 1. Premium Split AC (0.975 × 0.312 × 0.299 m)
function GLBACModel({ active }: { active: boolean }) {
  const { scene } = useGLTF('/models/ac.glb')
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      <Center>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={scene.clone()} scale={2.5} />
        </group>
      </Center>
      {/* Dynamic cooling breeze glow strip aligned with front lower discharge louver */}
      <mesh position={[0, -0.38, 0.4]}>
        <boxGeometry args={[2.0, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

// 2. Premium Double-Door Refrigerator (0.855 × 0.879 × 1.89 m)
function GLBRefrigeratorModel({ active }: { active: boolean }) {
  const { scene } = useGLTF('/models/refrigerator.glb')
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      <Center>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={scene.clone()} scale={1.4} />
        </group>
      </Center>
    </group>
  )
}

// 3. Premium Front-Load Washing Machine (0.624 × 0.725 × 0.890 m)
function GLBWashingMachineModel({ active }: { active: boolean }) {
  const { scene } = useGLTF('/models/washing_machine.glb')
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y += delta * 0.35
      // Subtle realistic operational vibration
      groupRef.current.position.y = Math.sin(performance.now() * 0.008) * 0.005
    }
  })

  if (!active) return null

  return (
    <group ref={groupRef}>
      <Center>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={scene.clone()} scale={1.9} />
        </group>
      </Center>
    </group>
  )
}

// Preload all 3 user GLB files
try {
  useGLTF.preload('/models/ac.glb')
  useGLTF.preload('/models/refrigerator.glb')
  useGLTF.preload('/models/washing_machine.glb')
} catch {}

// Floating cooling particle system
function CoolingParticles({ count = 140 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.006
      if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -3
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y += 0.001
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#00D9FF"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  )
}

// 3D Scene Container
function Scene3D({ activeProduct }: { activeProduct: number }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 4.5)
  }, [camera])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={45} />
      
      {/* Studio Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#00D9FF" />
      <pointLight position={[0, 3, 2]} intensity={1.2} color="#1677FF" />
      <pointLight position={[3, -2, 2]} intensity={0.9} color="#00D9FF" />
      <pointLight position={[-3, 0, -2]} intensity={0.5} color="#ffffff" />
      
      <Environment preset="city" />
      <Stars radius={70} depth={40} count={900} factor={3} fade />
      <CoolingParticles />

      {/* OrbitControls allows dragging to rotate 360 degrees */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 3}
      />

      <Float floatIntensity={0.3} rotationIntensity={0.05} speed={1.8}>
        <Suspense fallback={null}>
          <GLBACModel active={activeProduct === 0} />
        </Suspense>
        <Suspense fallback={null}>
          <GLBRefrigeratorModel active={activeProduct === 1} />
        </Suspense>
        <Suspense fallback={null}>
          <GLBWashingMachineModel active={activeProduct === 2} />
        </Suspense>
      </Float>
    </>
  )
}

// Fallback spinner if WebGL is unavailable
function HeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1677FF]/20 to-[#00D9FF]/10 blur-2xl" />
        {/* Logo circle */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-white shadow-2xl shadow-[#1677FF]/30 flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="AA COOL POINT"
            className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
            onError={e => {
              const t = e.currentTarget as HTMLImageElement
              t.style.display = 'none'
              const parent = t.parentElement!
              parent.classList.add('bg-gradient-to-br', 'from-[#1677FF]', 'to-[#00D9FF]')
              parent.innerHTML = '<div class="text-center"><div class="text-white font-black text-4xl">AA</div><div class="text-white/80 text-sm font-semibold">COOL POINT</div></div>'
            }}
          />
        </div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#1677FF]/30 animate-spin" style={{ animationDuration: '12s' }} />
      </div>
    </div>
  )
}

const products = [
  {
    name: 'Air Conditioners',
    icon: AirVent,
    desc: 'Split, Inverter & Window ACs • 0.975m Precision Unit',
    modelName: 'premium_split_ac.glb',
  },
  {
    name: 'Refrigerators',
    icon: Thermometer,
    desc: 'Double Door & Frost Free • 1.89m Multi-Air Cooling',
    modelName: 'premium_double_door_refrigerator.glb',
  },
  {
    name: 'Washing Machines',
    icon: WashingMachine,
    desc: 'Front-Load Fully Automatic • 0.89m Steam Care Drum',
    modelName: 'premium_front_load_washing_machine.glb',
  },
]

export default function HeroSection() {
  const [activeProduct, setActiveProduct] = useState(0)
  const [webglSupported, setWebglSupported] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglSupported(false)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#071426] pt-20 sm:pt-24 pb-16 lg:pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071426] via-[#0a1f3d] to-[#071426]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,119,255,0.12)_0%,transparent_70%)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,217,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Text & CTAs (7 columns on desktop) */}
          <div className="lg:col-span-7 z-20">
            {/* Location & Coverage Badge - comfortably positioned below navbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1677FF]/20 border border-[#1677FF]/40 text-[#00D9FF] text-xs font-semibold mb-5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse flex-shrink-0" />
              <span>
                {settings.address ? settings.address.split(',')[0].trim() : 'Karanthaneri'} • Serving Tirunelveli & Surroundings
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white leading-[1.15] mb-4 sm:mb-5 tracking-tight break-words"
            >
              {(() => {
                const title = settings.heroTitle || 'SMART COOLING. BETTER LIVING.'
                if (title.toUpperCase().includes('BETTER LIVING')) {
                  const prefix = title.replace(/BETTER LIVING\.?/i, '').trim()
                  return (
                    <>
                      {prefix}{' '}
                      <span className="bg-gradient-to-r from-[#1677FF] via-[#00D9FF] to-[#1677FF] bg-clip-text text-transparent">
                        BETTER LIVING.
                      </span>
                    </>
                  )
                }
                const parts = title.split('.')
                if (parts.length > 1 && parts[1].trim()) {
                  return (
                    <>
                      {parts[0].trim()}.{' '}
                      <span className="bg-gradient-to-r from-[#1677FF] via-[#00D9FF] to-[#1677FF] bg-clip-text text-transparent">
                        {parts.slice(1).join('.').trim()}
                      </span>
                    </>
                  )
                }
                const words = title.split(' ')
                if (words.length > 2) {
                  const mid = Math.ceil(words.length / 2)
                  return (
                    <>
                      {words.slice(0, mid).join(' ')}{' '}
                      <span className="bg-gradient-to-r from-[#1677FF] via-[#00D9FF] to-[#1677FF] bg-clip-text text-transparent">
                        {words.slice(mid).join(' ')}
                      </span>
                    </>
                  )
                }
                return (
                  <span className="bg-gradient-to-r from-[#1677FF] via-[#00D9FF] to-[#1677FF] bg-clip-text text-transparent">
                    {title}
                  </span>
                )
              })()}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl"
            >
              {settings.heroDescription ||
                'Your trusted destination in Karanthaneri for Air Conditioners, Refrigerators and Washing Machines. Certified doorstep repair services across Tirunelveli and surrounding regions.'}
            </motion.p>

            {/* CTA Buttons - Full width on mobile, inline on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10 w-full"
            >
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white font-bold text-xs uppercase tracking-wider hover:shadow-xl hover:shadow-[#1677FF]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Products <ArrowRight size={15} />
              </Link>
              <Link
                to="/book-service"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/15 hover:border-[#00D9FF] hover:text-[#00D9FF] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                <Wrench size={15} /> Book a Service
              </Link>
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 text-gray-300 font-semibold text-xs hover:border-[#00D9FF] hover:text-[#00D9FF] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Phone size={15} className="text-[#00D9FF]" /> Call Now
                </a>
              )}
            </motion.div>

            {/* Product Selector Tabs - Responsive 3-Column Grid on Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Move3d size={14} className="text-[#00D9FF] flex-shrink-0" />
                <span>Select 3D Appliance (Drag model to rotate 360°):</span>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                {products.map((product, i) => {
                  const Icon = product.icon
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveProduct(i)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all duration-300 text-center ${
                        activeProduct === i
                          ? 'bg-[#1677FF]/25 border-[#1677FF] text-[#00D9FF] shadow-lg shadow-[#1677FF]/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <Icon size={15} className="flex-shrink-0" />
                      <span className="truncate">{product.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeProduct}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#00D9FF]/80 text-xs font-medium flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-[#00D9FF] flex-shrink-0" />
                  <span>{products[activeProduct].desc}</span>
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: 3D Canvas Showcase (5 columns on desktop) - touch-action allows page scrolling on mobile */}
          <div
            className="lg:col-span-5 relative h-72 sm:h-96 lg:h-[550px] w-full flex items-center justify-center"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Subtle glow circle behind 3D model */}
            <div className="absolute w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#1677FF]/20 to-[#00D9FF]/20 blur-3xl pointer-events-none" />

            {/* 360 indicator tag */}
            <div className="absolute top-2 right-2 z-20 px-3 py-1 rounded-full bg-[#071426]/80 backdrop-blur border border-white/20 text-[#00D9FF] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 pointer-events-none">
              <Move3d size={12} /> 360° Interactive 3D
            </div>

            {webglSupported ? (
              <Suspense fallback={<HeroFallback />}>
                <Canvas
                  dpr={[1, 1.5]}
                  style={{ touchAction: 'pan-y' }}
                  className="three-canvas w-full h-full cursor-grab active:cursor-grabbing"
                >
                  <Scene3D activeProduct={activeProduct} />
                </Canvas>
              </Suspense>
            ) : (
              <HeroFallback />
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-white/40 pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll Down</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  )
}
