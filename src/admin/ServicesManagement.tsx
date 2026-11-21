import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Wrench,
  RefreshCw, Clock, ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getServices, updateService, deleteService, getCategories } from '../firebase/firestore'
import { formatPrice } from '../utils'
import type { Service, Category } from '../types'

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      const [srvs, cats] = await Promise.all([
        getServices(),
        getCategories('service')
      ])
      setServices(srvs)
      setCategories(cats)
    } catch (err) {
      console.error('Failed to load services', err)
      toast.error('Could not fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService(service.id, { isActive: !service.isActive })
      setServices(prev =>
        prev.map(s => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
      )
      toast.success(
        `Service ${!service.isActive ? 'Active (Public)' : 'Hidden'}`
      )
    } catch (err) {
      toast.error('Failed to toggle status')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete service "${title}"?`)) {
      return
    }
    try {
      await deleteService(id)
      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Service deleted')
    } catch (err) {
      toast.error('Failed to delete service')
    }
  }

  const filtered = services.filter(s => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.shortDescription || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || s.categoryId === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Services Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add unlimited AC, refrigerator, and washing machine services with custom pricing and images
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            to="/admin/services/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add New Service
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search services by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1677FF] bg-white font-medium w-full sm:w-auto"
        >
          <option value="all">All Service Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <Wrench size={40} className="mx-auto mb-3 opacity-40" />
            No services registered yet. Click "Add New Service" to publish.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Duration & Warranty</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map(s => {
                  const primaryImage = s.images?.[0]?.url
                  return (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {primaryImage ? (
                              <img src={primaryImage} alt={s.title} className="w-full h-full object-cover" />
                            ) : (
                              <Wrench size={20} className="text-gray-300" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#071426]">{s.title}</div>
                            <div className="text-[10px] text-gray-400">
                              {s.featured ? 'Featured on Home' : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                          {s.categoryName || 'General'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {s.price > 0 ? (
                          <div>
                            <span className="font-bold text-[#071426]">
                              {formatPrice(s.offerPrice || s.price)}
                            </span>
                            {s.offerPrice && s.offerPrice < s.price && (
                              <div className="text-[10px] text-gray-400 line-through">
                                {formatPrice(s.price)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Call for Quote</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-[11px] text-gray-600 flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          {s.duration || 'Flexible'}
                        </div>
                        {s.warranty && (
                          <div className="text-[11px] text-green-700 flex items-center gap-1 mt-0.5">
                            <ShieldCheck size={12} />
                            {s.warranty}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(s)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            s.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {s.isActive ? (
                            <>
                              <Eye size={12} /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} /> Hidden
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/services/edit/${s.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:border-[#1677FF] transition-colors"
                            title="Edit Service"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id, s.title)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

