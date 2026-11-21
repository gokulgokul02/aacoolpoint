import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Wrench, Clock, ShieldCheck, CheckCircle, ArrowLeft,
  Phone, MessageCircle, AlertCircle
} from 'lucide-react'
import { getServiceBySlug, getServices } from '../firebase/firestore'
import { sampleServices } from '../utils/seedData'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../utils'
import type { Service } from '../types'

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSettings()

  const [service, setService] = useState<Service | null>(null)
  const [relatedServices, setRelatedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      if (!slug) return
      try {
        setLoading(true)
        let s = await getServiceBySlug(slug).catch(() => null)
        if (!s) {
          s = (sampleServices.find(x => x.slug === slug) as any) || null
        }
        setService(s)
        if (s) {
          if (s.images && s.images.length > 0) {
            setActiveImage(s.images[0].url)
          }
          const all = await getServices({ categoryId: s.categoryId, isActive: true, limitCount: 4 })
          setRelatedServices(all.filter(item => item.id !== s.id))
        }
      } catch (err) {
        console.error('Error fetching service details', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-80 rounded-3xl mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-10 w-2/3 rounded" />
            <div className="skeleton h-32 rounded" />
          </div>
          <div className="skeleton h-64 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-[#071426] mb-2">Service Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-md">
          This service profile is currently unavailable or has been relocated.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1677FF] text-white text-xs font-semibold"
        >
          <ArrowLeft size={14} /> Back to Services
        </Link>
      </div>
    )
  }

  const whatsappMessage = encodeURIComponent(
    `Hello AA COOL POINT, I am inquiring about booking:\nService: ${service.title}\nLocation: Karanthaneri\nPlease let me know when your technician is available.`
  )

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`
    : null

  return (
    <>
      <Helmet>
        <title>{service.title} | AA COOL POINT Service</title>
        <meta
          name="description"
          content={service.shortDescription || service.description?.slice(0, 160)}
        />
        <meta property="og:title" content={`${service.title} | AA COOL POINT`} />
        <meta property="og:description" content={service.shortDescription} />
      </Helmet>

      {/* Breadcrumb Header */}
      <div className="bg-[#071426] pt-24 pb-8 border-b border-[#1677FF]/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#00D9FF] truncate max-w-xs">{service.title}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black font-display">{service.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery / Cover Image */}
            {activeImage && (
              <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm max-h-[420px] bg-gray-100 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={service.title}
                  className="w-full h-full object-cover max-h-[420px]"
                />
              </div>
            )}

            {/* Additional thumbnails if any */}
            {service.images && service.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {service.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-20 h-20 rounded-2xl border-2 flex-shrink-0 bg-white p-1 overflow-hidden transition-all ${
                      activeImage === img.url ? 'border-[#1677FF] shadow-md scale-105' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}

            {/* Overview / Description */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold font-display text-[#071426] mb-4">
                Service Overview
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {service.description || service.shortDescription}
              </p>
            </div>

            {/* Key Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold font-display text-[#071426] mb-4">
                  What's Included in This Service
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <CheckCircle size={18} className="text-[#1677FF] flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-gray-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                <Clock size={32} className="text-[#1677FF]" />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimated Duration</div>
                  <div className="text-sm font-black text-[#071426]">{service.duration || 'Flexible depending on issue'}</div>
                </div>
              </div>
              <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100 flex items-center gap-4">
                <ShieldCheck size={32} className="text-[#00D9FF]" />
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Warranty</div>
                  <div className="text-sm font-black text-[#071426]">{service.warranty || 'Workmanship guarantee'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  Service Pricing
                </span>
                {service.price > 0 ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#071426]">
                      {formatPrice(service.offerPrice || service.price)}
                    </span>
                    {service.offerPrice && service.offerPrice < service.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-xl font-bold text-[#071426]">
                    Quote upon Inspection
                  </div>
                )}
                <span className="text-[11px] text-gray-400 block mt-1">
                  *Spare parts charged separately if required
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to={`/book-service?serviceId=${service.id}&serviceName=${encodeURIComponent(service.title)}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#1677FF]/30 transition-all"
                >
                  <Wrench size={16} />
                  Book This Service Online
                </Link>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-all"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                )}

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-gray-300 text-gray-800 text-xs font-semibold hover:border-[#1677FF] hover:text-[#1677FF] transition-all"
                  >
                    <Phone size={15} />
                    Call {settings.phone}
                  </a>
                )}
              </div>

              {/* Quick guarantee points */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Doorstep technician visit in Karanthaneri</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Original & compatible spares only</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>Transparent estimate before starting work</span>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm text-[#071426] uppercase tracking-wider mb-4">
                  Related Services
                </h3>
                <div className="space-y-3">
                  {relatedServices.map(rs => (
                    <Link
                      key={rs.id}
                      to={`/services/${rs.slug}`}
                      className="block p-3 rounded-xl border border-gray-100 hover:border-[#1677FF] hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="font-bold text-xs text-[#071426] group-hover:text-[#1677FF]">
                        {rs.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {rs.shortDescription}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

