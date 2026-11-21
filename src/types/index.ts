// Firebase types
export interface ProductImage {
  url: string;
  path: string;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  modelNumber: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  shortDescription: string;
  originalPrice: number;
  sellingPrice: number;
  discount: number;
  condition: 'new' | 'used' | 'refurbished';
  specifications: Record<string, string>;
  images: ProductImage[];
  primaryImage: string;
  stock: number;
  warranty: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceImage {
  url: string;
  path: string;
  alt: string;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  shortDescription: string;
  description: string;
  price: number;
  offerPrice: number;
  images: ServiceImage[];
  duration: string;
  warranty: string;
  benefits: string[];
  featured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'service';
  description: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  applianceType: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  description: string;
  issueImages: string[];
  status: 'new' | 'confirmed' | 'assigned' | 'inprogress' | 'completed' | 'cancelled';
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  photo?: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  path: string;
  title: string;
  description: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface WebsiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  openingHours: string;
  about: string;
  heroTitle: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  logoUrl: string;
  faviconUrl: string;
  facebook: string;
  instagram: string;
  youtube: string;
  footerText: string;
  yearsOfService?: string;
  happyCustomers?: string;
  brandsSupported?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
}

