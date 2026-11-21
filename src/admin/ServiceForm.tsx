import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Save, Plus, Trash2, Wrench, Clock, ShieldCheck
} from 'lucide-react'
import {
  addService, updateService, getServiceBySlug, getCategories, getServices
} from '../firebase/firestore'
import ImageUploader from '../components/common/ImageUploader'
import { generateSlug } from '../utils'
import type { Category, ServiceImage, Service } from '../types'

const serviceSchema = z.object({
  title: z.string().min(3, 'Service title is required (min 3 chars)'),
  categoryId: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Detailed description is required'),
  price: z.coerce.number().min(0).default(0),
  offerPrice: z.coerce.number().min(0).default(0),
  duration: z.string().default('1 - 2 Hours'),
  warranty: z.string().default('30 Days Service Guarantee'),
  displayOrder: z.coerce.number().default(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

type ServiceFormData = z.infer<typeof serviceSchema>

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ServiceImage[]>([])
  const [benefits, setBenefits] = useState<string[]>([
    'Doorstep diagnostic and inspection',
    'Genuine spare parts with warranty',
    'Certified technician with proper tools',
  ])
  const [saving, setSaving] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(isEdit)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      title: '',
      categoryId: '',
      shortDescription: '',
      description: '',
      price: 0,
      offerPrice: 0,
      duration: '1 - 2 Hours',
      warranty: '30 Days Service Warranty',
      displayOrder: 1,
      featured: false,
      isActive: true,
    }
  })

  useEffect(() => {
    getCategories('service').then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (!id) return
    async function fetchService() {
      try {
        setLoadingInitial(true)
        const allServices = await getServices()
        const s = allServices.find(item => item.id === id)
        if (!s) {
          toast.error('Service not found')
          navigate('/admin/services')
          return
        }
        setValue('title', s.title)
        setValue('categoryId', s.categoryId)
        setValue('shortDescription', s.shortDescription || '')
        setValue('description', s.description || '')
        setValue('price', s.price || 0)
        setValue('offerPrice', s.offerPrice || 0)
        setValue('duration', s.duration || '')
        setValue('warranty', s.warranty || '')
        setValue('displayOrder', s.displayOrder ?? 0)
        setValue('featured', Boolean(s.featured))
        setValue('isActive', s.isActive !== false)

        if (s.images && s.images.length > 0) {
          setImages(s.images)
        }
        if (s.benefits && s.benefits.length > 0) {
          setBenefits(s.benefits)
        }
      } catch (err) {
        toast.error('Failed to load service data')
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchService()
  }, [id, navigate, setValue])

  const handleAddBenefit = () => {
    setBenefits(prev => [...prev, ''])
  }

  const handleRemoveBenefit = (index: number) => {
    setBenefits(prev => prev.filter((_, i) => i !== index))
  }

  const handleBenefitChange = (index: number, val: string) => {
    setBenefits(prev => prev.map((item, i) => (i === index ? val : item)))
  }

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setSaving(true)
      const matchedCat = categories.find(c => c.id === data.categoryId)

      const payload = {
        title: data.title,
        slug: generateSlug(data.title),
        categoryId: data.categoryId,
        categoryName: matchedCat?.name || '',
        shortDescription: data.shortDescription,
        description: data.description,
        price: Number(data.price),
        offerPrice: Number(data.offerPrice),
        images: images,
        duration: data.duration,
        warranty: data.warranty,
        benefits: benefits.filter(b => b.trim().length > 0),
        featured: data.featured,
        isActive: data.isActive,
        displayOrder: Number(data.displayOrder),
      }

      if (isEdit && id) {
        await updateService(id, payload)
        toast.success('Service updated successfully!')
      } else {
        await addService(payload as any)
        toast.success('New service published successfully!')
      }

      navigate('/admin/services')
    } catch (err: any) {
      console.error('Error saving service', err)
      toast.error(err.message || 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  if (loadingInitial) {
    return (
      <div className="p-8 space-y-4">
        <div className="skeleton h-12 w-1/3 rounded" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/services"
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#071426] hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-display text-[#071426]">
              {isEdit ? 'Edit Service' : 'Add New Service'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEdit ? 'Update service pricing, details and images' : 'Publish a custom AC, fridge, or washing machine service'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={15} /> Save Service
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Desc */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2">
                <Wrench size={16} className="text-[#1677FF]" /> Service Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Split AC Gas Refilling & Pressure Test"
                    {...register('title')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Category *
                  </label>
                  <select
                    {...register('categoryId')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white font-medium"
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.categoryId.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Short Summary (For Cards) *
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-line description of what this service covers..."
                    {...register('shortDescription')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.shortDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Detailed Explanation *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Provide full details on diagnostic process, equipment used, and customer advice..."
                    {...register('description')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Uploader */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center justify-between">
                <span>Service Photos (Up to 10 Images)</span>
                <span className="text-[11px] text-gray-400 font-normal">Show real past work</span>
              </h2>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                storagePath={`services/${id || 'temp_' + Date.now()}`}
                maxImages={10}
              />
            </div>

            {/* Benefits Checklist */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider">
                  Service Inclusions / Perks
                </h2>
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:underline"
                >
                  <Plus size={14} /> Add Inclusion
                </button>
              </div>

              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="e.g. 100% genuine refrigerant gas used"
                      value={b}
                      onChange={e => handleBenefitChange(i, e.target.value)}
                      className="flex-1 p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(i)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#071426] uppercase tracking-wider">
                Pricing & Timing
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Standard Service Charge (₹, 0 for Quote)
                  </label>
                  <input
                    type="number"
                    {...register('price')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Discounted / Offer Rate (₹)
                  </label>
                  <input
                    type="number"
                    {...register('offerPrice')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] text-[#1677FF] font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 - 90 mins"
                    {...register('duration')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Service Warranty Term
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Days on Refill / 90 Days on Repair"
                    {...register('warranty')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Order (Rank)
                  </label>
                  <input
                    type="number"
                    {...register('displayOrder')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#071426] uppercase tracking-wider">
                Visibility Flags
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-xs text-[#071426] block">Featured Service</span>
                    <span className="text-[11px] text-gray-400">Show in homepage services</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="w-5 h-5 text-[#1677FF] rounded border-gray-300 focus:ring-[#1677FF]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-xs text-[#071426] block">Active Status</span>
                    <span className="text-[11px] text-gray-400">Publicly available to book</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-5 h-5 text-[#1677FF] rounded border-gray-300 focus:ring-[#1677FF]"
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 text-center">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#1677FF]/40 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : isEdit ? 'Update Service' : 'Publish Service'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

