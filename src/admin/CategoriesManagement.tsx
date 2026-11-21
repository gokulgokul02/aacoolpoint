import React, { useState, useEffect } from 'react'
import {
  Tag, Plus, Edit2, Trash2, Check, X, Layers, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getCategories, addCategory, updateCategory, deleteCategory
} from '../firebase/firestore'
import { generateSlug } from '../utils'
import type { Category } from '../types'

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<'product' | 'service'>('product')
  const [loading, setLoading] = useState(true)

  // Modal / Add state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formIcon, setFormIcon] = useState('❄️')
  const [formOrder, setFormOrder] = useState(1)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories', err)
      toast.error('Could not fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const filteredCategories = categories.filter(c => c.type === activeTab)

  const openCreateModal = () => {
    setEditingId(null)
    setFormName('')
    setFormDesc('')
    setFormIcon(activeTab === 'product' ? '❄️' : '🔧')
    setFormOrder(filteredCategories.length + 1)
    setShowModal(true)
  }

  const openEditModal = (cat: Category) => {
    setEditingId(cat.id)
    setFormName(cat.name)
    setFormDesc(cat.description || '')
    setFormIcon(cat.icon || '❄️')
    setFormOrder(cat.displayOrder || 1)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const payload = {
        name: formName.trim(),
        slug: generateSlug(formName),
        type: activeTab,
        description: formDesc.trim(),
        icon: formIcon.trim(),
        isActive: true,
        displayOrder: Number(formOrder),
      }

      if (editingId) {
        await updateCategory(editingId, payload)
        toast.success('Category updated')
      } else {
        await addCategory(payload as any)
        toast.success('Category created')
      }

      setShowModal(false)
      loadCategories()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Existing items linked to it will not be deleted.`)) {
      return
    }
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success('Category removed')
    } catch (err) {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Categories Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize both product and service catalogues dynamically
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('product')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'product'
              ? 'border-[#1677FF] text-[#1677FF]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Product Categories ({categories.filter(c => c.type === 'product').length})
        </button>

        <button
          onClick={() => setActiveTab('service')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'service'
              ? 'border-[#1677FF] text-[#1677FF]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Service Categories ({categories.filter(c => c.type === 'service').length})
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <Layers size={40} className="mx-auto mb-3 opacity-40" />
            No categories defined yet for {activeTab}s.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Icon & Name</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Display Order</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cat.icon || '📦'}</span>
                        <span className="font-bold text-[#071426]">{cat.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-gray-500">
                      {cat.slug}
                    </td>

                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-700">
                      #{cat.displayOrder ?? 0}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:border-[#1677FF] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-bold text-base text-[#071426]">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Split Air Conditioners"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ❄️, 🧊, 🫧"
                    value={formIcon}
                    onChange={e => setFormIcon(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={e => setFormOrder(Number(e.target.value))}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary for catalogue navigation..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

