import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Save, Plus, Trash2, Package, Tag,
  Layers, Shield, Info
} from 'lucide-react'
import {
  addProduct, updateProduct, getProductById, getCategories
} from '../firebase/firestore'
import ImageUploader from '../components/common/ImageUploader'
import { generateSlug } from '../utils'
import type { Category, ProductImage } from '../types'

const productSchema = z.object({
  name: z.string().min(3, 'Product name is required (min 3 chars)'),
  brand: z.string().min(2, 'Brand name is required'),
  modelNumber: z.string().min(2, 'Model number is required'),
  categoryId: z.string().min(1, 'Category is required'),
  originalPrice: z.coerce.number().min(0, 'Original price must be positive'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be positive'),
  discount: z.coerce.number().min(0).max(100).default(0),
  condition: z.enum(['new', 'used', 'refurbished']),
  stock: z.coerce.number().min(0).default(1),
  warranty: z.string().default('1 Year Brand Warranty'),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Full description is required'),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: 'Capacity', value: '1.5 Ton' },
    { key: 'Star Rating', value: '3 Star' },
    { key: 'Inverter Technology', value: 'Yes' },
  ])
  const [saving, setSaving] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(isEdit)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      brand: '',
      modelNumber: '',
      categoryId: '',
      originalPrice: 0,
      sellingPrice: 0,
      discount: 0,
      condition: 'new',
      stock: 5,
      warranty: '1 Year Comprehensive Warranty',
      shortDescription: '',
      description: '',
      featured: false,
      isActive: true,
    }
  })

  // Auto calculate discount percentage when prices change
  const originalPrice = watch('originalPrice')
  const sellingPrice = watch('sellingPrice')

  useEffect(() => {
    if (originalPrice > 0 && sellingPrice > 0 && originalPrice > sellingPrice) {
      const disc = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      setValue('discount', disc)
    } else {
      setValue('discount', 0)
    }
  }, [originalPrice, sellingPrice, setValue])

  useEffect(() => {
    getCategories('product').then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    if (!id) return
    async function fetchProduct() {
      try {
        setLoadingInitial(true)
        const p = await getProductById(id!)
        if (!p) {
          toast.error('Product not found')
          navigate('/admin/products')
          return
        }
        setValue('name', p.name)
        setValue('brand', p.brand)
        setValue('modelNumber', p.modelNumber)
        setValue('categoryId', p.categoryId)
        setValue('originalPrice', p.originalPrice)
        setValue('sellingPrice', p.sellingPrice)
        setValue('discount', p.discount || 0)
        setValue('condition', p.condition || 'new')
        setValue('stock', p.stock ?? 1)
        setValue('warranty', p.warranty || '')
        setValue('shortDescription', p.shortDescription || '')
        setValue('description', p.description || '')
        setValue('featured', Boolean(p.featured))
        setValue('isActive', p.isActive !== false)

        if (p.images && p.images.length > 0) {
          setImages(p.images)
        } else if (p.primaryImage) {
          setImages([{ url: p.primaryImage, path: '', alt: p.name, order: 0 }])
        }

        if (p.specifications && Object.keys(p.specifications).length > 0) {
          setSpecifications(
            Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
          )
        }
      } catch (err) {
        toast.error('Failed to load product data')
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchProduct()
  }, [id, navigate, setValue])

  const handleAddSpec = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }])
  }

  const handleRemoveSpec = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index))
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', text: string) => {
    setSpecifications(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: text } : item))
    )
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setSaving(true)
      const primaryImage = images.length > 0 ? images[0].url : ''

      // Convert specs array to Record
      const specsObj: Record<string, string> = {}
      specifications.forEach(s => {
        if (s.key.trim()) {
          specsObj[s.key.trim()] = s.value.trim()
        }
      })

      const matchedCat = categories.find(c => c.id === data.categoryId)

      const payload = {
        name: data.name,
        slug: generateSlug(`${data.brand}-${data.name}`),
        brand: data.brand,
        modelNumber: data.modelNumber,
        categoryId: data.categoryId,
        categoryName: matchedCat?.name || '',
        description: data.description,
        shortDescription: data.shortDescription,
        originalPrice: Number(data.originalPrice),
        sellingPrice: Number(data.sellingPrice),
        discount: Number(data.discount),
        condition: data.condition,
        specifications: specsObj,
        images: images,
        primaryImage: primaryImage,
        stock: Number(data.stock),
        warranty: data.warranty,
        featured: data.featured,
        isActive: data.isActive,
      }

      if (isEdit && id) {
        await updateProduct(id, payload)
        toast.success('Product updated successfully!')
      } else {
        await addProduct(payload as any)
        toast.success('Product published successfully!')
      }

      navigate('/admin/products')
    } catch (err: any) {
      console.error('Error saving product', err)
      toast.error(err.message || 'Failed to save product')
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
            to="/admin/products"
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#071426] hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-display text-[#071426]">
              {isEdit ? 'Edit Appliance' : 'Add New Appliance'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEdit ? 'Update details, prices, or gallery' : 'Publish an AC, Refrigerator, or Washing Machine'}
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
              <Save size={15} /> Save Product
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main 2-Column Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2">
                <Package size={16} className="text-[#1677FF]" /> Appliance Identification
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.5 Ton 3 Star Inverter Split AC"
                    {...register('name')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Daikin, LG, Samsung, Voltas"
                      {...register('brand')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                    {errors.brand && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.brand.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Model Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FTKL50TV16U"
                      {...register('modelNumber')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                    {errors.modelNumber && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.modelNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
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
                      Condition *
                    </label>
                    <select
                      {...register('condition')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white font-medium"
                    >
                      <option value="new">Brand New (Factory Sealed)</option>
                      <option value="refurbished">Certified Refurbished</option>
                      <option value="used">Pre-Owned / Tested</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Short Description (For Cards) *
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-line feature summary..."
                    {...register('shortDescription')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.shortDescription.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Full Description *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Detailed explanation of features, cooling capacity, power saving, installation advice..."
                    {...register('description')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Multiple Image Uploader */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center justify-between">
                <span>Appliance Gallery (Up to 10 Images)</span>
                <span className="text-[11px] text-gray-400 font-normal">First image is primary display</span>
              </h2>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                storagePath={`products/${id || 'temp_' + Date.now()}`}
                maxImages={10}
              />
            </div>

            {/* Specifications Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2">
                  <Layers size={16} className="text-[#1677FF]" /> Technical Specifications
                </h2>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:underline"
                >
                  <Plus size={14} /> Add Row
                </button>
              </div>

              <div className="space-y-3">
                {specifications.map((spec, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="e.g. Star Rating, Capacity, Spin Speed"
                      value={spec.key}
                      onChange={e => handleSpecChange(i, 'key', e.target.value)}
                      className="w-1/2 p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 5 Star, 7 Kg, 1200 RPM"
                      value={spec.value}
                      onChange={e => handleSpecChange(i, 'value', e.target.value)}
                      className="w-1/2 p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(i)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Pricing & Status Settings */}
          <div className="space-y-6">
            
            {/* Pricing & Stock Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2">
                <Tag size={16} className="text-[#1677FF]" /> Pricing & Stock
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Original / MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('originalPrice')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                  {errors.originalPrice && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.originalPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Selling / Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('sellingPrice')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] font-bold text-[#1677FF]"
                  />
                  {errors.sellingPrice && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.sellingPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Discount Percentage (% calculated)
                  </label>
                  <input
                    type="number"
                    {...register('discount')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-semibold"
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Available Stock Quantity *
                  </label>
                  <input
                    type="number"
                    {...register('stock')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Warranty Term
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year on Product, 5 Years on Compressor"
                    {...register('warranty')}
                    className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Badges */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2">
                <Shield size={16} className="text-[#1677FF]" /> Visibility Flags
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div>
                    <span className="font-bold text-xs text-[#071426] block">Featured Appliance</span>
                    <span className="text-[11px] text-gray-400">Show on homepage showcase</span>
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
                    <span className="text-[11px] text-gray-400">Publicly discoverable by customers</span>
                  </div>
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-5 h-5 text-[#1677FF] rounded border-gray-300 focus:ring-[#1677FF]"
                  />
                </label>
              </div>
            </div>

            {/* Submit Bar for Sidebar */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 text-center">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#1677FF]/40 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Publish Product'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

