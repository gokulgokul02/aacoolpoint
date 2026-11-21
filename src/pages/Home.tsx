import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Star, CheckCircle, ThumbsUp, Users, Zap, Shield,
  AirVent, Thermometer, WashingMachine, ChevronDown, ChevronUp,
  Phone, MessageCircle, MapPin, Clock
} from 'lucide-react'
import HeroSection from '../components/hero/HeroSection'
import { getProducts } from '../firebase/firestore'
import { getServices } from '../firebase/firestore'
import { getReviews } from '../firebase/firestore'
import { sampleProducts, sampleServices, sampleReviews } from '../utils/seedData'
import { useSettings } from '../context/SettingsContext'
import type { Product, Service, Review } from '../types'

// ==================
// SECTION: ABOUT PREVIEW
// ==================
function AboutSection() {
  const { settings } = useSettings()
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-6 leading-tight">
              Your Trusted Appliance <span className="text-[#1677FF]">Service Partner</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {settings.about || 'AA COOL POINT is your trusted destination for Air Conditioners, Refrigerators and Washing Machines in Karanthaneri, Tamil Nadu. We specialize in sales, installation, repair and maintenance of all major home appliances.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, label: 'Quality Service', color: 'text-[#1677FF]', bg: 'bg-blue-50' },
                { icon: Zap, label: 'Fast Response', color: 'text-[#00D9FF]', bg: 'bg-cyan-50' },
                { icon: Users, label: 'Expert Team', color: 'text-[#1677FF]', bg: 'bg-blue-50' },
                { icon: ThumbsUp, label: 'Satisfaction', color: 'text-[#00D9FF]', bg: 'bg-cyan-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <span className="font-semibold text-sm text-gray-800">{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1677FF] text-white font-semibold text-sm hover:bg-[#0062e6] hover:shadow-lg hover:shadow-[#1677FF]/30 transition-all"
            >
              Learn More About Us <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#071426] to-[#0a1f3d] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1677FF]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00D9FF]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 shadow-lg shadow-[#1677FF]/40 border-2 border-white flex-shrink-0 overflow-hidden">
                    <img src="/logo.png" alt="AA COOL POINT" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div>
                    <div className="font-black font-display text-xl">{settings.businessName || 'AA COOL POINT'}</div>
                    <div className="text-[#00D9FF] text-sm">{settings.tagline || 'Cooling Comfort. Trusted Service.'}</div>
                  </div>
                </div>
                {[
                  'Air Conditioner Sales, Service & Installation',
                  'Refrigerator Sales, Repair & Maintenance',
                  'Washing Machine Sales, Repair & Service',
                  'AC Gas Refilling & Deep Cleaning',
                  'All Major Brand Support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                    <CheckCircle size={16} className="text-[#00D9FF] flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-white/5 rounded-2xl flex items-center gap-3">
                  <MapPin size={20} className="text-[#00D9FF]" />
                  <div>
                    <div className="font-semibold text-sm">Our Location</div>
                    <div className="text-gray-400 text-xs">{settings.address || 'Karanthaneri, Tamil Nadu, India'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: CATEGORIES
// ==================
const categories = [
  {
    icon: AirVent,
    image: '/images/ac_category.jpg',
    name: 'Air Conditioners',
    desc: 'Split, Window, Inverter & Non-Inverter AC — Sales, Installation & Repair',
    link: '/products?category=ac',
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'from-blue-50 to-cyan-50',
    types: ['Split AC', 'Window AC', 'Inverter AC', '5-Star Rated'],
  },
  {
    icon: Thermometer,
    image: '/images/fridge_category.jpg',
    name: 'Refrigerators',
    desc: 'Single Door, Double Door, Side-by-Side — Frost Free & Direct Cool',
    link: '/products?category=refrigerator',
    gradient: 'from-indigo-500 to-blue-400',
    bg: 'from-indigo-50 to-blue-50',
    types: ['Single Door', 'Double Door', 'Frost Free', 'Side-by-Side'],
  },
  {
    icon: WashingMachine,
    image: '/images/washer_category.jpg',
    name: 'Washing Machines',
    desc: 'Front Load, Top Load, Fully Automatic & Semi Automatic',
    link: '/products?category=washing-machine',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'from-cyan-50 to-blue-50',
    types: ['Front Load', 'Top Load', 'Fully Auto', 'Semi Auto'],
  },
]

function CategoriesSection() {
  return (
    <section className="section-padding bg-[#F5F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">Product Range</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-4">
            Our Appliance <span className="text-[#1677FF]">Categories</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">Browse our complete range of home appliances from leading brands</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group card-hover border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback to gradient+icon if image fails to load
                        const target = e.currentTarget
                        target.style.display = 'none'
                        target.parentElement!.classList.add(`bg-gradient-to-br`, cat.bg.split(' ')[0], cat.bg.split(' ')[1])
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${cat.bg} flex items-center justify-center`}>
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={36} className="text-white" />
                      </div>
                    </div>
                  )}
                  {/* Category label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${cat.gradient} shadow`}>
                      <Icon size={14} className="text-white" />
                      <span className="text-white text-xs font-bold">{cat.name}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-display text-[#071426] mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cat.types.map((type, j) => (
                      <span key={j} className="px-2.5 py-1 bg-[#F5F8FC] text-[#1677FF] text-xs font-medium rounded-full border border-[#1677FF]/10">
                        {type}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={cat.link}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#071426] text-white text-sm font-semibold hover:bg-[#1677FF] transition-colors duration-300"
                  >
                    Browse {cat.name} <ArrowRight size={15} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: FEATURED PRODUCTS
// ==================
function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    getProducts({ featured: true, isActive: true, limitCount: 6 })
      .then(data => {
        if (data && data.length > 0) setProducts(data)
        else setProducts(sampleProducts as any)
      })
      .catch(() => setProducts(sampleProducts as any))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">Top Picks</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426]">
              Featured <span className="text-[#1677FF]">Products</span>
            </h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-2 text-[#1677FF] font-semibold text-sm hover:gap-3 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="skeleton h-52 w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-6 w-2/3 rounded" />
                  <div className="skeleton h-5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group card-hover"
              >
                <div className="relative h-52 bg-gradient-to-br from-[#F5F8FC] to-[#e8f0fe] overflow-hidden">
                  {product.primaryImage ? (
                    <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AirVent size={60} className="text-[#1677FF]/30" />
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      -{product.discount}% OFF
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1677FF] text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-[#1677FF] font-semibold uppercase tracking-wide mb-1">{product.brand}</div>
                  <h3 className="font-bold text-[#071426] mb-1 leading-tight line-clamp-1">{product.name}</h3>
                  <div className="text-xs text-gray-400 mb-3">Model: {product.modelNumber}</div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-black text-[#071426]">₹{product.sellingPrice.toLocaleString('en-IN')}</span>
                    {product.originalPrice > product.sellingPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="flex-1 text-center py-2.5 rounded-xl bg-[#071426] text-white text-sm font-semibold hover:bg-[#1677FF] transition-colors"
                    >
                      View Details
                    </Link>
                    {settings.whatsapp && (
                      <a
                        href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (Model: ${product.modelNumber}). Please share more details.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#1db954] transition-colors"
                        title="Enquire on WhatsApp"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-[#1677FF] font-semibold">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: SERVICES OVERVIEW
// ==================
function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices({ featured: true, isActive: true, limitCount: 6 })
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const defaultServices = [
    { title: 'AC Installation', desc: 'Professional installation of all AC types', icon: '🔧', category: 'Air Conditioner' },
    { title: 'AC Repair', desc: 'Expert diagnosis and repair of all AC issues', icon: '⚙️', category: 'Air Conditioner' },
    { title: 'AC Gas Refilling', desc: 'Refrigerant gas refilling for optimal cooling', icon: '❄️', category: 'Air Conditioner' },
    { title: 'Deep Cleaning', desc: 'Complete AC deep cleaning and sanitization', icon: '✨', category: 'Air Conditioner' },
    { title: 'Refrigerator Repair', desc: 'Repair for all refrigerator models and brands', icon: '🧊', category: 'Refrigerator' },
    { title: 'Washing Machine Repair', desc: 'Repair and maintenance for all types', icon: '🫧', category: 'Washing Machine' },
  ]

  return (
    <section className="section-padding bg-[#071426] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.08)_0%,transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#00D9FF] font-semibold text-sm tracking-widest uppercase mb-3 block">What We Do</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
              Our <span className="text-[#00D9FF]">Services</span>
            </h2>
          </div>
          <Link to="/services" className="hidden sm:flex items-center gap-2 text-[#00D9FF] font-semibold text-sm hover:gap-3 transition-all">
            All Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(loading || services.length === 0 ? defaultServices : services).map((service: any, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-[#1677FF]/40 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">{service.icon || '🔧'}</div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#00D9FF] transition-colors">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{service.desc || service.shortDescription}</p>
              <span className="text-xs text-[#1677FF] font-semibold uppercase tracking-wide">{service.category || service.categoryName}</span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white font-semibold hover:shadow-xl hover:shadow-[#1677FF]/30 hover:-translate-y-1 transition-all"
          >
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: WHY CHOOSE US
// ==================
function WhyChooseSection() {
  const reasons = [
    { icon: Shield, title: 'Quality Assured', desc: 'All services are carried out with professional care and quality standards.', color: 'from-blue-500 to-blue-600' },
    { icon: Zap, title: 'Fast Service', desc: 'Quick response to all service requests with minimal waiting time.', color: 'from-cyan-500 to-blue-500' },
    { icon: Users, title: 'Expert Technicians', desc: 'Trained and experienced technicians for all appliance types.', color: 'from-indigo-500 to-blue-500' },
    { icon: ThumbsUp, title: 'Customer First', desc: 'Your satisfaction is our top priority. We stand by our work.', color: 'from-blue-600 to-cyan-500' },
    { icon: CheckCircle, title: 'Genuine Parts', desc: 'Only genuine and compatible spare parts used in all repairs.', color: 'from-cyan-600 to-blue-600' },
    { icon: Clock, title: 'Timely Delivery', desc: 'We respect your time and ensure services are completed on schedule.', color: 'from-blue-500 to-indigo-500' },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">Why Us</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-4">
            Why Choose <span className="text-[#1677FF]">AA COOL POINT</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">We are committed to delivering exceptional service every single time</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-[#F5F8FC] border border-gray-100 hover:shadow-lg transition-all duration-300 group card-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                <r.icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-[#071426] text-lg mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: HOW IT WORKS
// ==================
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Book a Service', desc: 'Fill out our quick booking form online or call us directly.', icon: '📞' },
    { num: '02', title: 'Confirm Appointment', desc: 'Our team will confirm your appointment and send a technician.', icon: '📅' },
    { num: '03', title: 'Expert Service', desc: 'Our trained technician arrives and fixes your appliance professionally.', icon: '🔧' },
    { num: '04', title: 'Happy Customer', desc: 'Your appliance is working perfectly. We ensure your satisfaction.', icon: '😊' },
  ]
  return (
    <section className="section-padding bg-[#F5F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">Process</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-4">
            How Our <span className="text-[#1677FF]">Service Works</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl mx-auto mb-4 border border-gray-100">
                {step.icon}
              </div>
              <div className="text-[#1677FF] font-black text-sm mb-2">{step.num}</div>
              <h3 className="font-bold text-[#071426] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: REVIEWS
// ==================
function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReviews(true)
      .then(data => {
        if (data && data.length > 0) setReviews(data)
        else setReviews(sampleReviews as any)
      })
      .catch(() => setReviews(sampleReviews as any))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-4">
            What Customers <span className="text-[#1677FF]">Say</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#F5F8FC] rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{review.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1677FF] to-[#00D9FF] flex items-center justify-center text-white font-bold text-sm">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#071426] text-sm">{review.customerName}</div>
                    <div className="text-gray-400 text-xs">{review.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ==================
// SECTION: FAQ
// ==================
const faqs = [
  { q: 'Which areas do you provide services in?', a: 'Our store is based in Karanthaneri, and our technicians provide doorstep repair and installation across Karanthaneri, Tirunelveli city, and all surrounding areas. Call or WhatsApp us to confirm your locality.' },
  { q: 'Do you repair all brands of AC?', a: 'Yes, we repair and service all major AC brands including Samsung, LG, Daikin, Voltas, Hitachi, Blue Star, Panasonic and more.' },
  { q: 'How long does AC installation take?', a: 'Typically 2-3 hours depending on the type and location. Our technician will advise you once they assess the site.' },
  { q: 'Do you sell new appliances?', a: 'Yes, we sell new Air Conditioners, Refrigerators and Washing Machines. Contact us or browse our Products section.' },
  { q: 'Is there a service warranty?', a: 'Yes, we provide warranty on our repair services. The duration depends on the type of service performed.' },
  { q: 'How do I book a service?', a: 'You can book a service through our website by clicking "Book Service", calling us directly, or messaging us on WhatsApp.' },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section-padding bg-[#F5F8FC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#1677FF] font-semibold text-sm tracking-widest uppercase mb-3 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-[#071426] mb-4">
            Frequently Asked <span className="text-[#1677FF]">Questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#071426] text-sm pr-4">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-[#1677FF] flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================
// SECTION: CONTACT CTA
// ==================
function ContactCTA() {
  const { settings } = useSettings()
  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I need help with my appliance.')}`
    : null

  return (
    <section className="section-padding bg-[#071426] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,119,255,0.12)_0%,transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#00D9FF] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" /> We're here to help
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white mb-6 leading-tight">
            Need Appliance Help?<br /><span className="text-[#00D9FF]">Contact Us Today</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            Get in touch for sales enquiries, service booking or any questions about your home appliances.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm sm:max-w-none mx-auto w-full">
            <Link to="/book-service" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white font-semibold hover:shadow-xl hover:shadow-[#1677FF]/30 hover:-translate-y-1 transition-all">
              Book a Service <ArrowRight size={16} />
            </Link>
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:border-[#00D9FF] hover:text-[#00D9FF] hover:-translate-y-1 transition-all">
                <Phone size={16} /> {settings.phone}
              </a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1db954] hover:-translate-y-1 transition-all">
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ==================
// SECTION: MAPS
// ==================
function MapsSection() {
  const { settings } = useSettings()
  if (!settings.mapsUrl && !settings.address) return null

  // Ensure iframe gets a valid embeddable Google Maps source
  const embedSrc = settings.mapsUrl && settings.mapsUrl.includes('google.com/maps/embed')
    ? settings.mapsUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(settings.address || 'Panankulam, Tirunelveli, Tamil Nadu')}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-display text-[#071426] mb-2">Find <span className="text-[#1677FF]">Our Location</span></h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <MapPin size={16} className="text-[#1677FF]" />
            {settings.address || 'Panankulam, Tirunelveli, Tamil Nadu'}
          </p>
          {settings.mapsUrl && (
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#1677FF] font-semibold mt-2 hover:underline"
            >
              Open in Google Maps App ↗
            </a>
          )}
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-80">
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AA COOL POINT Location"
          />
        </div>
      </div>
    </section>
  )
}

// ==================
// HOME PAGE MAIN
// ==================
export default function Home() {
  const { settings } = useSettings()
  return (
    <>
      <Helmet>
        <title>{settings.seoTitle || 'AA COOL POINT – AC Sales & Service | Karanthaneri'}</title>
        <meta name="description" content={settings.seoDescription || 'AC repair, installation and sales in Karanthaneri. Refrigerator and washing machine services. Call us today.'} />
        <meta property="og:title" content={settings.seoTitle || 'AA COOL POINT'} />
        <meta property="og:description" content={settings.seoDescription || 'Quality appliance services in Karanthaneri, Tamil Nadu'} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "AA COOL POINT",
          "description": "Air Conditioning Repair Service, Home Appliance Sales and Services",
          "address": { "@type": "PostalAddress", "addressLocality": "Karanthaneri", "addressRegion": "Tamil Nadu", "addressCountry": "IN" },
          "telephone": settings.phone || undefined,
          "url": window.location.origin,
        })}</script>
      </Helmet>

      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <FeaturedProducts />
      <ServicesSection />
      <WhyChooseSection />
      <HowItWorks />
      <ReviewsSection />
      <FAQSection />
      <ContactCTA />
      <MapsSection />
    </>
  )
}

