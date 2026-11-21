import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './config'
import type { Product, Service, Category, Booking, Review, GalleryImage, WebsiteSettings } from '../types'
import { sampleProducts, sampleServices, sampleCategories, sampleReviews, sampleBookings } from '../utils/seedData'

// === HELPERS ===
const toDate = (val: Timestamp | Date | undefined): Date => {
  if (!val) return new Date()
  if (val instanceof Timestamp) return val.toDate()
  if (typeof val === 'string') return new Date(val)
  return val
}

// === PRODUCTS ===
export const getProducts = async (filters?: {
  categoryId?: string
  brand?: string
  condition?: string
  featured?: boolean
  isActive?: boolean
  limitCount?: number
}): Promise<Product[]> => {
  try {
    const snap = await getDocs(collection(db, 'products'))
    if (!snap.empty) {
      let list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: toDate((d.data() as any).createdAt),
        updatedAt: toDate((d.data() as any).updatedAt)
      } as Product))

      // In-memory filtering (never fails, no index needed)
      if (filters?.isActive !== undefined) list = list.filter(p => p.isActive === filters.isActive)
      if (filters?.featured !== undefined) list = list.filter(p => p.featured === filters.featured)
      if (filters?.categoryId && filters.categoryId !== 'all') list = list.filter(p => p.categoryId === filters.categoryId)
      if (filters?.brand && filters.brand !== 'all') list = list.filter(p => p.brand?.toLowerCase() === filters.brand?.toLowerCase())
      if (filters?.condition && filters.condition !== 'all') list = list.filter(p => p.condition === filters.condition)

      // Sort newest first
      list.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))

      if (filters?.limitCount) list = list.slice(0, filters.limitCount)
      return list
    }
  } catch (err: any) {
    console.warn('Firestore getProducts fallback to sample data:', err?.message || err)
  }

  // Fallback to sampleProducts if DB is empty or unreachable
  let list = [...sampleProducts] as unknown as Product[]
  if (filters?.isActive !== undefined) list = list.filter(p => p.isActive === filters.isActive)
  if (filters?.featured !== undefined) list = list.filter(p => p.featured === filters.featured)
  if (filters?.categoryId && filters.categoryId !== 'all') list = list.filter(p => p.categoryId === filters.categoryId)
  if (filters?.limitCount) list = list.slice(0, filters.limitCount)
  return list
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1))
    const snap = await getDocs(q)
    if (!snap.empty) {
      const d = snap.docs[0]
      return { id: d.id, ...d.data(), createdAt: toDate((d.data() as any).createdAt), updatedAt: toDate((d.data() as any).updatedAt) } as Product
    }
  } catch (err: any) {
    console.warn('getProductBySlug fallback:', err?.message || err)
  }

  const found = sampleProducts.find(p => p.slug === slug)
  return (found as unknown as Product) || null
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const d = await getDoc(doc(db, 'products', id))
    if (d.exists()) {
      return { id: d.id, ...d.data(), createdAt: toDate((d.data() as any).createdAt), updatedAt: toDate((d.data() as any).updatedAt) } as Product
    }
  } catch (err: any) {
    console.warn('getProductById fallback:', err?.message || err)
  }

  const found = sampleProducts.find(p => p.id === id)
  return (found as unknown as Product) || null
}

export const addProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const ref = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const updateProduct = async (id: string, data: Partial<Product>) => {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id))
}

// === SERVICES ===
export const getServices = async (filters?: {
  categoryId?: string
  featured?: boolean
  isActive?: boolean
  limitCount?: number
}): Promise<Service[]> => {
  try {
    const snap = await getDocs(collection(db, 'services'))
    if (!snap.empty) {
      let list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: toDate((d.data() as any).createdAt),
        updatedAt: toDate((d.data() as any).updatedAt)
      } as Service))

      // In-memory filtering & sorting
      if (filters?.isActive !== undefined) list = list.filter(s => s.isActive === filters.isActive)
      if (filters?.featured !== undefined) list = list.filter(s => s.featured === filters.featured)
      if (filters?.categoryId && filters.categoryId !== 'all') list = list.filter(s => s.categoryId === filters.categoryId)

      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

      if (filters?.limitCount) list = list.slice(0, filters.limitCount)
      return list
    }
  } catch (err: any) {
    console.warn('Firestore getServices fallback:', err?.message || err)
  }

  // Fallback to sampleServices
  let list = [...sampleServices] as Service[]
  if (filters?.isActive !== undefined) list = list.filter(s => s.isActive === filters.isActive)
  if (filters?.featured !== undefined) list = list.filter(s => s.featured === filters.featured)
  if (filters?.categoryId && filters.categoryId !== 'all') list = list.filter(s => s.categoryId === filters.categoryId)
  if (filters?.limitCount) list = list.slice(0, filters.limitCount)
  return list
}

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  try {
    const q = query(collection(db, 'services'), where('slug', '==', slug), limit(1))
    const snap = await getDocs(q)
    if (!snap.empty) {
      const d = snap.docs[0]
      return { id: d.id, ...d.data(), createdAt: toDate((d.data() as any).createdAt), updatedAt: toDate((d.data() as any).updatedAt) } as Service
    }
  } catch (err: any) {
    console.warn('getServiceBySlug fallback:', err?.message || err)
  }

  const found = sampleServices.find(s => s.slug === slug)
  return (found as Service) || null
}

export const addService = async (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
  const ref = await addDoc(collection(db, 'services'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const updateService = async (id: string, data: Partial<Service>) => {
  await updateDoc(doc(db, 'services', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteService = async (id: string) => {
  await deleteDoc(doc(db, 'services', id))
}

// === CATEGORIES ===
export const getCategories = async (type?: 'product' | 'service'): Promise<Category[]> => {
  try {
    const snap = await getDocs(collection(db, 'categories'))
    if (!snap.empty) {
      let list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category))
      if (type) list = list.filter(c => c.type === type)
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      return list
    }
  } catch (err: any) {
    console.warn('Firestore getCategories fallback:', err?.message || err)
  }

  let list = [...sampleCategories] as Category[]
  if (type) list = list.filter(c => c.type === type)
  return list
}

export const addCategory = async (data: Omit<Category, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, 'categories'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateCategory = async (id: string, data: Partial<Category>) => {
  await updateDoc(doc(db, 'categories', id), data)
}

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(db, 'categories', id))
}

// === BOOKINGS (DUAL WRITE: CLOUD FIRESTORE + LOCAL STORAGE) ===
export const addBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const localId = `BK-${Date.now().toString().slice(-6)}`
  const bookingRecord: Booking = {
    ...data,
    id: localId,
    issueImages: data.issueImages || [],
    status: 'new',
    adminNotes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // 1. Always save in localStorage so customer portal works instantly
  try {
    const existing: Booking[] = JSON.parse(localStorage.getItem('aacoolpoint_bookings') || '[]')
    existing.unshift(bookingRecord)
    localStorage.setItem('aacoolpoint_bookings', JSON.stringify(existing))
  } catch (e) {
    console.warn('LocalStorage save warning:', e)
  }

  // 2. Also write to Cloud Firestore
  try {
    const ref = await addDoc(collection(db, 'bookings'), {
      ...data,
      status: 'new',
      adminNotes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    // Update local booking with firestore id
    bookingRecord.id = ref.id
    try {
      const existing: Booking[] = JSON.parse(localStorage.getItem('aacoolpoint_bookings') || '[]')
      if (existing.length > 0) {
        existing[0].id = ref.id
        localStorage.setItem('aacoolpoint_bookings', JSON.stringify(existing))
      }
    } catch {}
    return ref.id
  } catch (err: any) {
    console.warn('Firestore booking submission fallback:', err?.message || err)
    return localId
  }
}

export const getBookings = async (status?: string): Promise<Booking[]> => {
  let firestoreBookings: Booking[] = []
  try {
    const snap = await getDocs(collection(db, 'bookings'))
    if (!snap.empty) {
      firestoreBookings = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: toDate((d.data() as any).createdAt),
        updatedAt: toDate((d.data() as any).updatedAt)
      } as Booking))
    }
  } catch (err: any) {
    console.warn('Firestore getBookings fallback:', err?.message || err)
  }

  // Also read locally stored bookings to combine
  let localBookings: Booking[] = []
  try {
    const raw = localStorage.getItem('aacoolpoint_bookings')
    if (raw) {
      localBookings = JSON.parse(raw).map((b: any) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      }))
    }
  } catch {}

  // Merge unique by id
  const map = new Map<string, Booking>()
  firestoreBookings.forEach(b => map.set(b.id, b))
  localBookings.forEach(b => {
    if (!map.has(b.id)) map.set(b.id, b)
  })

  // If completely empty, use sampleBookings
  if (map.size === 0) {
    (sampleBookings as unknown as Booking[]).forEach(b => map.set(b.id, b))
  }

  let list = Array.from(map.values())
  if (status && status !== 'all') {
    list = list.filter(b => b.status === status)
  }
  list.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
  return list
}

export const updateBooking = async (id: string, data: Partial<Booking>) => {
  // Update local
  try {
    const raw = localStorage.getItem('aacoolpoint_bookings')
    if (raw) {
      const list = JSON.parse(raw)
      const idx = list.findIndex((b: any) => b.id === id)
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date() }
        localStorage.setItem('aacoolpoint_bookings', JSON.stringify(list))
      }
    }
  } catch {}

  // Update cloud
  try {
    await updateDoc(doc(db, 'bookings', id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } catch (err: any) {
    console.warn('updateBooking cloud error:', err?.message || err)
  }
}

// === REVIEWS ===
export const getReviews = async (approvedOnly = true): Promise<Review[]> => {
  try {
    const snap = await getDocs(collection(db, 'reviews'))
    if (!snap.empty) {
      let list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: toDate((d.data() as any).createdAt)
      } as Review))
      if (approvedOnly) {
        list = list.filter(r => r.isApproved)
      }
      list.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
      return list
    }
  } catch (err: any) {
    console.warn('getReviews error:', err?.message || err)
  }

  let list = [...sampleReviews] as Review[]
  if (approvedOnly) list = list.filter(r => r.isApproved)
  return list
}

export const addReview = async (data: Omit<Review, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateReview = async (id: string, data: Partial<Review>) => {
  await updateDoc(doc(db, 'reviews', id), data)
}

export const deleteReview = async (id: string) => {
  await deleteDoc(doc(db, 'reviews', id))
}

// === GALLERY ===
export const getGallery = async (publishedOnly = true): Promise<GalleryImage[]> => {
  try {
    const snap = await getDocs(collection(db, 'gallery'))
    if (!snap.empty) {
      let list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        createdAt: toDate((d.data() as any).createdAt)
      } as GalleryImage))
      if (publishedOnly) list = list.filter(g => g.isPublished)
      list.sort((a, b) => (a.order || 0) - (b.order || 0))
      return list
    }
  } catch (err: any) {
    console.warn('getGallery error (using fallback):', err?.message || err)
  }

  return [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'AC Outdoor Unit Installation',
      description: 'Professional high-rise wall mounting in Karanthaneri',
      category: 'Installation',
      order: 1,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'Copper Pipe Flaring & Welding',
      description: 'Precision vacuum testing and pressure check',
      category: 'Repair',
      order: 2,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'Double Door Refrigerator PCB Diagnostics',
      description: 'Component-level inverter board repair',
      category: 'Maintenance',
      order: 3,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'Front-Load Washing Machine Drum Balancing',
      description: 'Spider arm and bearing replacement',
      category: 'Repair',
      order: 4,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'High-Pressure AC Foam Jet Cleaning',
      description: 'Deep antimicrobial coil cleaning in progress',
      category: 'Maintenance',
      order: 5,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      path: '',
      title: 'Commercial Multi-Split Setup',
      description: 'Complete showroom air-conditioning in Tirunelveli',
      category: 'Installation',
      order: 6,
      isPublished: true,
      createdAt: new Date(),
    },
  ]
}

export const addGalleryImage = async (data: Omit<GalleryImage, 'id' | 'createdAt'>) => {
  const ref = await addDoc(collection(db, 'gallery'), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateGalleryImage = async (id: string, data: Partial<GalleryImage>) => {
  await updateDoc(doc(db, 'gallery', id), data)
}

export const deleteGalleryImage = async (id: string) => {
  await deleteDoc(doc(db, 'gallery', id))
}

// === WEBSITE SETTINGS ===
export const getWebsiteSettings = async (): Promise<WebsiteSettings | null> => {
  try {
    const d = await getDoc(doc(db, 'websiteSettings', 'main'))
    if (d.exists()) {
      return d.data() as WebsiteSettings
    }
  } catch (err: any) {
    console.warn('getWebsiteSettings fallback:', err?.message || err)
  }
  return null
}

export const updateWebsiteSettings = async (data: Partial<WebsiteSettings>) => {
  await setDoc(doc(db, 'websiteSettings', 'main'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// === ADMIN ACTIVITY LOGS ===
export const logAdminActivity = async (action: string, details: string, adminId: string) => {
  try {
    await addDoc(collection(db, 'adminActivityLogs'), {
      action,
      details,
      adminId,
      timestamp: serverTimestamp(),
    })
  } catch {}
}
