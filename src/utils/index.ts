// Utility functions for AA COOL POINT

// Generate URL-friendly slug from text
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Format price in Indian Rupees
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

// Format date
export const formatDate = (date: Date | string | number | undefined): string => {
  if (!date) return 'N/A'
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Generate human-readable reference ID
export const generateRefId = (docId: string): string => {
  return `ACP-${docId.slice(0, 6).toUpperCase()}`
}

// Truncate text with ellipsis
export const truncate = (text: string, length: number): string => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Validate WhatsApp number and generate clean link
export const getWhatsAppUrl = (number: string, message?: string): string => {
  const clean = number.replace(/\D/g, '')
  const base = `https://wa.me/${clean}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

