import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ShieldCheck, ArrowLeft, Phone, MessageCircle, CheckCircle,
  Truck, Clock, AlertCircle, AirVent, Star
} from 'lucide-react'
import { getProductBySlug, getProducts } from '../firebase/firestore'
import { sampleProducts } from '../utils/seedData'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../utils'
import type { Product } from '../types'

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSettings()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    async function fetchProductData() {
      if (!slug) return
      try {
        setLoading(true)
        let p = await getProductBySlug(slug).catch(() => null)
        if (!p) {
          p = (sampleProducts.find(x => x.slug === slug) as any) || null
        }
        setProduct(p)
        if (p) {
          const related = await getProducts({
            categoryId: p.categoryId,
            isActive: true,
            limitCount: 4,
          })
          setRelatedProducts(related.filter(r => r.id !== p.id))
        }
      } catch (err) {
        console.error('Failed to load product details', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProductData()
    setActiveImageIndex(0)
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="skeleton h-96 rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-1/4 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            <div className="skeleton h-8 w-1/3 rounded" />
            <div className="skeleton h-32 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#071426] mb-2">Product Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-md">
          The requested appliance could not be found or is no longer listed.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1677FF] text-white text-xs font-semibold hover:bg-[#0062e6] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
      </div>
    )
  }

  const galleryImages = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : product.primaryImage
      ? [product.primaryImage]
      : []

  const currentDisplayImage = galleryImages[activeImageIndex] || product.primaryImage

  const whatsappMessage = encodeURIComponent(
    `Hello AA COOL POINT! I am interested in purchasing:\nProduct: ${product.name}\nBrand: ${product.brand}\nModel: ${product.modelNumber}\nPrice: ₹${product.sellingPrice.toLocaleString('en-IN')}\nCould you please share stock availability and delivery options?`
  )

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`
    : null

  return (
    <>
      <Helmet>
        <title>{product.name} | AA COOL POINT - Karanthaneri</title>
        <meta
          name="description"
          content={product.shortDescription || product.description?.slice(0, 160)}
        />
        <meta property="og:title" content={`${product.name} | AA COOL POINT`} />
        <meta property="og:description" content={product.shortDescription} />
        {product.primaryImage && <meta property="og:image" content={product.primaryImage} />}
      </Helmet>

      {/* Breadcrumb Bar */}
      <div className="bg-[#071426] pt-24 pb-6 border-b border-[#1677FF]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#00D9FF] truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14">
          
          {/* Left: Gallery Showcase */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[460px] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-4">
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              ) : (
                <AirVent size={80} className="text-[#1677FF]/20" />
              )}

              {/* Status Tags */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow">
                    {product.discount}% OFF
                  </span>
                )}
                <span className="px-3 py-1 bg-[#071426]/90 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl border-2 flex-shrink-0 bg-white p-1 overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#1677FF] shadow-md scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase CTA */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Stock */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-[#1677FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {product.brand}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Title & Model */}
              <h1 className="text-2xl sm:text-3xl font-black font-display text-[#071426] mb-1">
                {product.name}
              </h1>
              <p className="text-xs text-gray-500 font-mono mb-4">
                Model: {product.modelNumber}
              </p>

              {/* Price Banner */}
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200 mb-6 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#071426]">
                  {formatPrice(product.sellingPrice)}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    Save {formatPrice(product.originalPrice - product.sellingPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Overview</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Technical Specifications
                  </h2>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                    {Object.entries(product.specifications).map(([key, val], i) => (
                      <div key={i} className="grid grid-cols-2 p-3 text-xs">
                        <span className="font-semibold text-gray-500 capitalize">{key}</span>
                        <span className="font-medium text-[#071426]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty & Perks */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
                  <ShieldCheck size={20} className="text-[#1677FF] flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-[#071426]">Warranty</div>
                    <div className="text-[10px] text-gray-500">{product.warranty || 'Brand Warranty Included'}</div>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
                  <Truck size={20} className="text-[#00D9FF] flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-[#071426]">Local Delivery</div>
                    <div className="text-[10px] text-gray-500">Fast Delivery in Karanthaneri</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 gap-3">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#25D366] text-white text-sm font-bold shadow-lg hover:bg-[#20ba59] transition-all"
                  >
                    <MessageCircle size={18} />
                    Inquire on WhatsApp
                  </a>
                ) : (
                  <div className="p-3 bg-gray-100 rounded-xl text-center text-xs text-gray-500">
                    WhatsApp setup pending
                  </div>
                )}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#071426] text-white text-sm font-bold hover:bg-[#1677FF] transition-all"
                  >
                    <Phone size={18} />
                    Call for Best Price
                  </a>
                )}
              </div>

              <Link
                to="/book-service"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#1677FF] text-[#1677FF] hover:bg-[#1677FF] hover:text-white text-xs font-bold transition-all uppercase tracking-wider"
              >
                Need Installation or Service for this?
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-black font-display text-[#071426] mb-6">
              Similar Appliances
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(rp => (
                <div
                  key={rp.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all flex gap-4 items-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                    {rp.primaryImage ? (
                      <img src={rp.primaryImage} alt={rp.name} className="w-full h-full object-cover" />
                    ) : (
                      <AirVent size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#1677FF]">{rp.brand}</span>
                    <h3 className="font-bold text-xs text-[#071426] truncate">{rp.name}</h3>
                    <div className="text-xs font-bold text-[#071426] mt-1">{formatPrice(rp.sellingPrice)}</div>
                    <Link
                      to={`/products/${rp.slug}`}
                      className="text-[11px] text-[#1677FF] font-semibold hover:underline block mt-1"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

