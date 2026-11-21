import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search, Filter, RotateCcw, ArrowRight, AirVent, SlidersHorizontal, MessageCircle, Phone } from 'lucide-react'
import { getProducts, getCategories } from '../firebase/firestore'
import { sampleProducts } from '../utils/seedData'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../utils'
import type { Product, Category } from '../types'

export default function Products() {
  const { settings } = useSettings()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [prodsData, catsData] = await Promise.all([
          getProducts({ isActive: true }).catch(() => []),
          getCategories('product').catch(() => [])
        ])
        setProducts(prodsData.length > 0 ? prodsData : (sampleProducts as any))
        setCategories(catsData.length > 0 ? catsData : [
          { id: 'cat-ac', name: 'Air Conditioners', slug: 'air-conditioners', type: 'product', icon: '❄️', displayOrder: 1, description: '', isActive: true, createdAt: new Date() },
          { id: 'cat-fridge', name: 'Refrigerators', slug: 'refrigerators', type: 'product', icon: '🧊', displayOrder: 2, description: '', isActive: true, createdAt: new Date() },
          { id: 'cat-wm', name: 'Washing Machines', slug: 'washing-machines', type: 'product', icon: '🫧', displayOrder: 3, description: '', isActive: true, createdAt: new Date() },
        ])
      } catch (err) {
        console.error('Failed to load products/categories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Unique brands
  const brands = useMemo(() => {
    const bSet = new Set<string>()
    products.forEach(p => {
      if (p.brand) bSet.add(p.brand)
    })
    return Array.from(bSet)
  }, [products])

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()) ||
          p.modelNumber.toLowerCase().includes(search.toLowerCase())

        const matchesCat =
          selectedCategory === 'all' || p.categoryId === selectedCategory

        const matchesBrand =
          selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase()

        const matchesCondition =
          selectedCondition === 'all' || p.condition === selectedCondition

        return matchesSearch && matchesCat && matchesBrand && matchesCondition
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice
        if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice
        if (sortBy === 'newest') return (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0)
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      })
  }, [products, search, selectedCategory, selectedBrand, selectedCondition, sortBy])

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setSelectedCondition('all')
    setSortBy('featured')
  }

  return (
    <>
      <Helmet>
        <title>Products Catalogue | AA COOL POINT - Karanthaneri</title>
        <meta name="description" content="Explore our wide range of Air Conditioners, Refrigerators and Washing Machines. Best deals and genuine warranty at AA COOL POINT." />
      </Helmet>

      {/* Hero Header */}
      <section className="bg-[#071426] pt-28 pb-14 border-b border-[#1677FF]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.12)_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[#00D9FF] text-xs font-semibold tracking-widest uppercase mb-2 inline-block">
            Appliances Showroom
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white mb-4">
            Our Premium <span className="text-[#00D9FF]">Products</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Discover cutting-edge Air Conditioners, Refrigerators, and Washing Machines tested for reliability and peak performance.
          </p>
        </div>
      </section>

      {/* Main Listing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <span className="font-semibold text-sm text-[#071426]">
              {filteredProducts.length} Products Found
            </span>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1677FF] text-white rounded-lg text-xs font-semibold"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="font-bold text-[#071426] flex items-center gap-2 text-sm uppercase tracking-wider">
                <SlidersHorizontal size={16} className="text-[#1677FF]" />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-[#1677FF] flex items-center gap-1 font-medium"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Model, brand, type..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#1677FF] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-[#1677FF] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white"
                >
                  <option value="all">All Brands</option>
                  {brands.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Condition Filter */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['all', 'new', 'refurbished', 'used'] as const).map(cond => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(cond)}
                    className={`py-1.5 text-[11px] font-semibold capitalize rounded-lg border transition-colors ${
                      selectedCondition === cond
                        ? 'bg-[#071426] text-white border-[#071426]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {/* Top Bar Sort and Count */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Showing <strong className="text-[#071426]">{filteredProducts.length}</strong> appliances
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="p-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white text-xs font-medium"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="skeleton h-48 w-full" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-3 w-1/4 rounded" />
                      <div className="skeleton h-5 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1677FF] flex items-center justify-center mx-auto mb-4">
                  <AirVent size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#071426] mb-1">No Products Match Your Criteria</h3>
                <p className="text-gray-500 text-xs mb-6 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to discover our available home appliances.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-full bg-[#1677FF] text-white text-xs font-semibold hover:bg-[#0062e6] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-52 bg-[#F8FAFC] flex items-center justify-center overflow-hidden border-b border-gray-100">
                      {p.primaryImage ? (
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <AirVent size={56} className="text-[#1677FF]/20" />
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {p.discount > 0 && (
                          <span className="px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {p.discount}% OFF
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-[#071426]/80 text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                          {p.condition}
                        </span>
                      </div>

                      {p.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#1677FF] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#1677FF] font-bold tracking-wider uppercase mb-1">
                          <span>{p.brand}</span>
                          <span className="text-gray-400 font-normal">Model: {p.modelNumber}</span>
                        </div>
                        <h3 className="font-bold text-[#071426] text-base leading-snug mb-2 group-hover:text-[#1677FF] transition-colors line-clamp-2">
                          <Link to={`/products/${p.slug}`}>
                            {p.name}
                          </Link>
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                          {p.shortDescription || p.description}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-black text-[#071426]">
                            {formatPrice(p.sellingPrice)}
                          </span>
                          {p.originalPrice > p.sellingPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                          <Link
                            to={`/products/${p.slug}`}
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#071426] text-white text-xs font-semibold hover:bg-[#1677FF] transition-colors"
                          >
                            Details <ArrowRight size={13} />
                          </Link>
                          {settings.whatsapp && (
                            <a
                              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hi AA COOL POINT, I am interested in ${p.name} (Model: ${p.modelNumber}). Is it available?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1faa4e] transition-colors"
                            >
                              <MessageCircle size={13} /> Inquire
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

