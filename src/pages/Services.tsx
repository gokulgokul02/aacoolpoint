import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Wrench, Clock, ShieldCheck, ArrowRight, CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { getServices, getCategories } from '../firebase/firestore'
import { sampleServices } from '../utils/seedData'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../utils'
import type { Service, Category } from '../types'

export default function Services() {
  const { settings } = useSettings()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [servicesData, categoriesData] = await Promise.all([
          getServices({ isActive: true }).catch(() => []),
          getCategories('service').catch(() => [])
        ])
        setServices(servicesData.length > 0 ? servicesData : (sampleServices as any))
        setCategories(categoriesData.length > 0 ? categoriesData : [
          { id: 'cat-ac-srv', name: 'AC Services', slug: 'ac-services', type: 'service', icon: '❄️', displayOrder: 1, description: '', isActive: true, createdAt: new Date() },
          { id: 'cat-fridge-srv', name: 'Refrigerator Services', slug: 'refrigerator-services', type: 'service', icon: '🧊', displayOrder: 2, description: '', isActive: true, createdAt: new Date() },
          { id: 'cat-wm-srv', name: 'Washing Machine Services', slug: 'washing-machine-services', type: 'service', icon: '🫧', displayOrder: 3, description: '', isActive: true, createdAt: new Date() },
        ])
      } catch (err) {
        console.error('Failed to load services', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services
    return services.filter(s => s.categoryId === selectedCategory)
  }, [services, selectedCategory])

  return (
    <>
      <Helmet>
        <title>Professional Appliance Repair & Services | AA COOL POINT</title>
        <meta
          name="description"
          content="Expert repair, installation, and maintenance services for ACs, Refrigerators, and Washing Machines in Karanthaneri, Tamil Nadu."
        />
      </Helmet>

      {/* Hero Header */}
      <section className="bg-[#071426] pt-28 pb-14 border-b border-[#1677FF]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.1)_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[#00D9FF] text-xs font-semibold tracking-widest uppercase mb-2 inline-block">
            Professional Care & Maintenance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white mb-4">
            Our Appliance <span className="text-[#00D9FF]">Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            From emergency repairs and seasonal AC gas refills to full machine installations, our certified technicians ensure flawless operation.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Services
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/30'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-200 overflow-hidden p-6 space-y-4">
                <div className="skeleton h-48 w-full rounded-2xl" />
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-14 rounded" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-sm">
            <Wrench size={40} className="text-[#1677FF] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#071426] mb-1">No Services in this Category</h3>
            <p className="text-gray-500 text-xs mb-6">
              Our technicians service all appliances. Contact us directly for custom service requests.
            </p>
            <Link
              to="/book-service"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1677FF] text-white text-xs font-bold"
            >
              Book Service Request
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => {
              const primaryImg = service.images?.[0]?.url

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Service Image banner */}
                  <div className="relative h-48 bg-[#071426] overflow-hidden flex items-center justify-center">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Wrench size={48} className="text-[#00D9FF] mx-auto mb-2 opacity-60" />
                        <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                          Certified Service
                        </span>
                      </div>
                    )}

                    {service.featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow">
                        Popular
                      </span>
                    )}

                    {service.price > 0 && (
                      <div className="absolute bottom-3 left-4 px-3 py-1 bg-[#071426]/90 backdrop-blur-md border border-white/10 rounded-xl text-white">
                        <span className="text-xs text-gray-300">Starting at </span>
                        <span className="text-sm font-black text-[#00D9FF]">
                          {formatPrice(service.offerPrice || service.price)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold font-display text-[#071426] mb-2 group-hover:text-[#1677FF] transition-colors">
                        <Link to={`/services/${service.slug}`}>
                          {service.title}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                        {service.shortDescription || service.description}
                      </p>

                      {/* Benefits Bullets */}
                      {service.benefits && service.benefits.length > 0 && (
                        <div className="space-y-1.5 mb-6">
                          {service.benefits.slice(0, 3).map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                              <CheckCircle2 size={14} className="text-[#1677FF] flex-shrink-0" />
                              <span className="truncate">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metadata badges */}
                      <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-6 pt-3 border-t border-gray-100">
                        {service.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#1677FF]" />
                            <span>{service.duration}</span>
                          </div>
                        )}
                        {service.warranty && (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-green-600" />
                            <span>{service.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/services/${service.slug}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 text-[#071426] text-xs font-semibold hover:border-[#1677FF] hover:text-[#1677FF] transition-colors"
                      >
                        Details <ArrowRight size={13} />
                      </Link>
                      <Link
                        to={`/book-service?serviceId=${service.id}&serviceName=${encodeURIComponent(service.title)}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold hover:shadow-lg hover:shadow-[#1677FF]/30 transition-all"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Emergency Assistance Banner */}
      <section className="bg-gradient-to-r from-[#071426] to-[#0d2340] py-14 border-t border-[#1677FF]/20 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[#00D9FF] text-xs font-bold uppercase tracking-widest mb-1 block">
              Urgent Breakdown?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display">
              Need Same-Day Appliance Repair in Karanthaneri?
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              Give us a call right away for immediate diagnostic assistance.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#071426] font-bold text-xs hover:bg-[#00D9FF] transition-colors shadow-lg"
              >
                <Phone size={15} />
                Call {settings.phone}
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Hello AA COOL POINT, I need emergency appliance service assistance!'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#1fa74d] transition-colors shadow-lg"
              >
                <MessageCircle size={15} />
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

