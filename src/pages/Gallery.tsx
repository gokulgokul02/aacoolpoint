import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getGallery } from '../firebase/firestore'
import type { GalleryImage } from '../types'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Image as PhotoIcon,
} from 'lucide-react'

// ─── Category Filter Config ───────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'Shop', label: 'Shop' },
  { key: 'Service Work', label: 'Service Work' },
  { key: 'Installations', label: 'Installations' },
  { key: 'Products', label: 'Products' },
]

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const GallerySkeleton: React.FC = () => (
  <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-gray-200 animate-pulse"
        style={{ height: `${160 + (i % 3) * 60}px` }}
      />
    ))}
  </div>
)

// ─── Component ────────────────────────────────────────────────────────────────
const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Fetch on mount
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const data = await getGallery(true)
        setImages(data)
      } catch (err) {
        console.error('Gallery fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  // Filtered images
  const filtered =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory)

  // Lightbox navigation
  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev === 0 ? filtered.length - 1 : prev - 1) : null
    )
  }, [filtered.length])
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev === filtered.length - 1 ? 0 : prev + 1) : null
    )
  }, [filtered.length])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, prevImage, nextImage])

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <>
      <Helmet>
        <title>Gallery | AA COOL POINT – AC & Appliance Services</title>
        <meta
          name="description"
          content="Browse our gallery of AC installations, service work, shop photos and products at AA COOL POINT, Karanthaneri, Tamil Nadu."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#071426] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#1677FF] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#00D9FF] rounded-full opacity-10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#00D9FF] text-sm font-semibold tracking-widest uppercase mb-3">
              <Link to="/" className="hover:underline">Home</Link> / Gallery
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#00D9FF]">
                Gallery
              </span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              A look inside our shop, service work, installations and product range.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#F5F8FC]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── Gallery Section ───────────────────────────────────────────────── */}
      <section className="bg-[#F5F8FC] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 border ${
                  activeCategory === key
                    ? 'bg-[#1677FF] text-white border-[#1677FF] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#1677FF] hover:text-[#1677FF]'
                }`}
              >
                {label}
                {!loading && key !== 'all' && (
                  <span className={`ml-1.5 text-xs ${activeCategory === key ? 'text-blue-100' : 'text-gray-400'}`}>
                    ({images.filter((i) => i.category === key).length})
                  </span>
                )}
                {!loading && key === 'all' && (
                  <span className={`ml-1.5 text-xs ${activeCategory === key ? 'text-blue-100' : 'text-gray-400'}`}>
                    ({images.length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          {loading ? (
            <GallerySkeleton />
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <PhotoIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 font-semibold text-lg mb-1">No Images Yet</h3>
              <p className="text-gray-400 text-sm">
                {activeCategory === 'all'
                  ? 'No gallery images have been published yet. Add images via Admin → Gallery.'
                  : `No images in the "${activeCategory}" category yet.`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-4"
            >
              {filtered.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-100"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.url}
                    alt={image.title || image.description || 'Gallery image'}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ display: 'block' }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    {(image.title || image.category) && (
                      <div>
                        {image.title && (
                          <p className="text-white text-xs font-semibold leading-tight truncate">
                            {image.title}
                          </p>
                        )}
                        {image.category && (
                          <span className="inline-block mt-1 text-[10px] bg-[#1677FF]/80 text-white px-2 py-0.5 rounded-full">
                            {image.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Lightbox Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous */}
            {filtered.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.url}
                alt={currentImage.title || currentImage.description || 'Gallery image'}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              {(currentImage.title || currentImage.description) && (
                <div className="mt-4 text-center">
                  {currentImage.title && (
                    <p className="text-white font-semibold text-sm">{currentImage.title}</p>
                  )}
                  {currentImage.description && (
                    <p className="text-gray-400 text-xs mt-1">{currentImage.description}</p>
                  )}
                </div>
              )}
              <p className="text-gray-500 text-xs mt-2">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Gallery
