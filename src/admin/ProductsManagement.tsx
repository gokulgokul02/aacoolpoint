import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Package,
  AirVent, AlertCircle, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getProducts, updateProduct, deleteProduct, getCategories } from '../firebase/firestore'
import { formatPrice } from '../utils'
import type { Product, Category } from '../types'

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories('product')
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      console.error('Failed to load products', err)
      toast.error('Could not fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive })
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
      )
      toast.success(
        `Product marked ${!product.isActive ? 'Active (Visible)' : 'Hidden'}`
      )
    } catch (err) {
      toast.error('Failed to toggle status')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return
    }
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? p.isActive
        : !p.isActive
    return matchSearch && matchCat && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Products Catalogue
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your Air Conditioners, Refrigerators, and Washing Machines inventory
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
            to="/admin/products/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products by name, brand, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1677FF] bg-white font-medium flex-1 sm:flex-initial"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#1677FF] bg-white font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Hidden Only</option>
          </select>
        </div>
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
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Brand / Model</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.primaryImage ? (
                            <img src={p.primaryImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <AirVent size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#071426] line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {p.condition} {p.featured ? '• Featured' : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{p.brand}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{p.modelNumber}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-[#071426]">{formatPrice(p.sellingPrice)}</div>
                      {p.originalPrice > p.sellingPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.stock} in stock
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {p.isActive ? (
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
                          to={`/admin/products/edit/${p.id}`}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:border-[#1677FF] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

