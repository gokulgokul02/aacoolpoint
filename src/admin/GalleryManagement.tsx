import React, { useState, useEffect } from 'react'
import {
  Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Upload,
  RefreshCw, Check, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage
} from '../firebase/firestore'
import { uploadFile, deleteFile } from '../firebase/storage'
import type { GalleryImage } from '../types'

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Upload Form
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Installation')

  const loadGallery = async () => {
    try {
      setLoading(true)
      const data = await getGallery(false)
      setImages(data)
    } catch (err) {
      console.error('Failed to load gallery', err)
      toast.error('Could not fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  const handleTogglePublish = async (img: GalleryImage) => {
    try {
      const nextVal = !img.isPublished
      await updateGalleryImage(img.id, { isPublished: nextVal })
      setImages(prev =>
        prev.map(i => (i.id === img.id ? { ...i, isPublished: nextVal } : i))
      )
      toast.success(nextVal ? 'Image published to public gallery' : 'Image hidden')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (img: GalleryImage) => {
    if (!window.confirm(`Delete photo "${img.title || 'Untitled'}"?`)) return
    try {
      await deleteGalleryImage(img.id)
      if (img.path) {
        await deleteFile(img.path)
      }
      setImages(prev => prev.filter(i => i.id !== img.id))
      toast.success('Photo removed')
    } catch (err) {
      toast.error('Failed to delete photo')
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please select an image file to upload')
      return
    }

    try {
      setUploading(true)
      const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `gallery/${Date.now()}_${cleanName}`
      const uploadRes = await uploadFile(selectedFile, storagePath)

      await addGalleryImage({
        url: uploadRes.url,
        path: uploadRes.path,
        title: title.trim() || 'Work Showcase',
        description: description.trim(),
        category,
        order: images.length + 1,
        isPublished: true,
      })

      toast.success('Photo uploaded to gallery!')
      setShowModal(false)
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      loadGallery()
    } catch (err: any) {
      console.error('Upload error', err)
      toast.error(err.message || 'Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Gallery Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showcase actual AC installations, shop products, and servicing work
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadGallery}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Upload Photo
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <ImageIcon size={44} className="mx-auto mb-3 text-gray-300" />
          <h3 className="font-bold text-sm text-[#071426]">No Gallery Photos Uploaded</h3>
          <p className="text-gray-400 text-xs mt-1 mb-4">
            Upload pictures of your workshop, installations, and appliances to build customer trust.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-xl bg-[#1677FF] text-white text-xs font-bold"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#071426]/80 text-white text-[10px] font-bold">
                  {img.category}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#071426] line-clamp-1">
                    {img.title || 'Untitled'}
                  </h4>
                  {img.description && (
                    <p className="text-gray-400 text-[11px] line-clamp-1 mt-0.5">
                      {img.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => handleTogglePublish(img)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                      img.isPublished ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {img.isPublished ? (
                      <>
                        <Eye size={12} /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Hidden
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(img)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-bold text-base text-[#071426]">
                Upload Gallery Photo
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Choose Image File *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1677FF] file:text-white hover:file:bg-[#0062e6] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Split AC Installation at Karanthaneri"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category Tag
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white font-medium"
                >
                  <option value="Installation">Installation Work</option>
                  <option value="Repair">Servicing & Repair</option>
                  <option value="Showroom">Shop & Showroom</option>
                  <option value="Products">New Deliveries</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Short Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Brief context for visitors..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  disabled={uploading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

