import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Clock, CheckCircle, XCircle, AlertCircle, Star,
  Phone, MessageCircle, User, LogOut, ArrowRight, RefreshCw,
  Calendar, MapPin, Package, Search, Edit3
} from 'lucide-react'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { getBookings, addReview } from '../firebase/firestore'
import { useSettings } from '../context/SettingsContext'
import toast from 'react-hot-toast'
import type { Booking } from '../types'

// Status configuration & progress steps
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; step: number }> = {
  new: {
    label: 'Request Received',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    icon: AlertCircle,
    step: 1,
  },
  confirmed: {
    label: 'Booking Confirmed',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    icon: CheckCircle,
    step: 2,
  },
  assigned: {
    label: 'Technician Assigned',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
    icon: User,
    step: 3,
  },
  inprogress: {
    label: 'Service In Progress',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    icon: Wrench,
    step: 4,
  },
  completed: {
    label: 'Service Completed ✓',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    icon: CheckCircle,
    step: 5,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-200',
    icon: XCircle,
    step: 0,
  },
}

const STEPS = [
  { label: 'Received', key: 'new' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Assigned', key: 'assigned' },
  { label: 'In Progress', key: 'inprogress' },
  { label: 'Completed', key: 'completed' },
]

// Normalizes any phone number format and matches last 10 digits
const cleanDigits = (p?: string) => (p || '').replace(/\D/g, '')
const isPhoneMatch = (phoneA?: string, phoneB?: string) => {
  const a = cleanDigits(phoneA).slice(-10)
  const b = cleanDigits(phoneB).slice(-10)
  return a.length >= 10 && b.length >= 10 && a === b
}

// Star Rating Component
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1.5 justify-center my-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-125 focus:outline-none"
        >
          <Star
            size={30}
            className={`${star <= (hover || value) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

// Rating Modal
function RatingModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: Booking
  onClose: () => void
  onSuccess: () => void
}) {
  const { customer } = useCustomerAuth()
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Please choose a star rating')
      return
    }
    if (review.trim().length < 5) {
      toast.error('Please write a short review')
      return
    }

    setSubmitting(true)
    try {
      await addReview({
        customerName: customer?.name && customer.name !== 'Valued Customer' ? customer.name : booking.customerName || 'Customer',
        rating,
        review: review.trim(),
        date: new Date().toISOString().split('T')[0],
        isApproved: false,
        isActive: true,
      })

      // Store in local storage so it marks as rated
      const rated: string[] = JSON.parse(localStorage.getItem('aacoolpoint_rated_bookings') || '[]')
      rated.push(booking.id)
      localStorage.setItem('aacoolpoint_rated_bookings', JSON.stringify(rated))

      toast.success('⭐ Thank you! Your review has been submitted.')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Star size={30} className="fill-amber-400 text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-[#071426] font-display">Rate Your Service</h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">{booking.serviceName}</p>
          <p className="text-gray-400 text-[11px]">Booking #{booking.id.slice(-8).toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Select Star Rating</p>
            <StarRating value={rating} onChange={setRating} />
            <p className="text-xs text-amber-600 font-semibold">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent Service!' : rating === 4 ? '⭐⭐⭐⭐ Very Good' : rating === 3 ? '⭐⭐⭐ Satisfactory' : '⭐⭐ Needs Improvement'}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Your Feedback & Experience *
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="How was our technician? Did the appliance work properly after repair?..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-[#1677FF]/30 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Star size={14} className="fill-white" /> Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Individual Booking Card
function BookingCard({ booking, onRefresh }: { booking: Booking; onRefresh: () => void }) {
  const [showRating, setShowRating] = useState(false)
  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.new
  const StatusIcon = statusConfig.icon
  const isCompleted = booking.status === 'completed'
  const isCancelled = booking.status === 'cancelled'
  const currentStep = statusConfig.step

  const ratedBookings: string[] = JSON.parse(localStorage.getItem('aacoolpoint_rated_bookings') || '[]')
  const alreadyRated = ratedBookings.includes(booking.id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#071426] flex items-center justify-center flex-shrink-0 shadow-md">
              <Wrench size={18} className="text-[#00D9FF]" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#071426] text-sm sm:text-base leading-snug truncate">
                {booking.serviceName}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span className="font-mono font-medium text-[#1677FF]">
                  #{booking.id.slice(-8).toUpperCase()}
                </span>
                <span>•</span>
                <span>{booking.applianceType}</span>
              </div>
            </div>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon size={13} />
            {statusConfig.label}
          </span>
        </div>

        {/* Progress Stepper (Hidden if Cancelled) */}
        {!isCancelled && (
          <div className="px-4 sm:px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute left-4 right-4 top-3.5 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] transition-all duration-700"
                  style={{ width: `${Math.max(0, ((currentStep - 1) / 4) * 100)}%` }}
                />
              </div>

              {STEPS.map((step, i) => {
                const done = i + 1 <= currentStep
                const active = i + 1 === currentStep
                return (
                  <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        done
                          ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-sm'
                          : active
                          ? 'bg-white border-[#1677FF] text-[#1677FF] shadow-md ring-2 ring-[#1677FF]/20'
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}
                    >
                      {done ? (
                        <CheckCircle size={13} className="text-white fill-white" />
                      ) : (
                        <span className="text-[10px] font-bold">{i + 1}</span>
                      )}
                    </div>
                    <p className={`text-[10px] sm:text-xs font-semibold mt-1.5 text-center leading-tight ${done ? 'text-[#1677FF]' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Booking Details Grid */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Calendar size={15} className="text-[#1677FF] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block font-medium uppercase">Visit Date</span>
                <span className="font-semibold text-gray-800">{booking.preferredDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <Clock size={15} className="text-[#1677FF] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block font-medium uppercase">Time Slot</span>
                <span className="font-semibold text-gray-800 truncate block">{booking.preferredTime}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <MapPin size={15} className="text-[#1677FF] flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-[10px] text-gray-400 block font-medium uppercase">Service Address</span>
                <span className="font-medium text-gray-800 leading-snug">{booking.address}</span>
              </div>
            </div>

            {booking.description && (
              <div className="sm:col-span-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 block font-medium uppercase mb-0.5">Reported Issue</span>
                <span className="text-gray-700 italic">"{booking.description}"</span>
              </div>
            )}
          </div>

          {/* Technician / Admin Notes */}
          {booking.adminNotes && (
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2">
              <AlertCircle size={15} className="text-[#1677FF] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Technician Update:</strong> {booking.adminNotes}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Rating button / status */}
          {isCompleted && !alreadyRated && (
            <button
              onClick={() => setShowRating(true)}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-400/30 transition-all cursor-pointer"
            >
              <Star size={14} className="fill-white" /> Rate This Completed Service
            </button>
          )}

          {isCompleted && alreadyRated && (
            <div className="py-2 px-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-600" />
              Review Submitted • Thank You!
            </div>
          )}

          {!isCompleted && (
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock size={12} /> Technician will call before arriving.
            </p>
          )}

          <a
            href="tel:+917904976502"
            className="text-xs text-[#1677FF] hover:underline font-semibold flex items-center gap-1 ml-auto"
          >
            <Phone size={12} /> Call Shop
          </a>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRating && (
          <RatingModal
            booking={booking}
            onClose={() => setShowRating(false)}
            onSuccess={onRefresh}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default function MyBookings() {
  const { customer, loginCustomer, logoutCustomer } = useCustomerAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()

  // State
  const [phoneInput, setPhoneInput] = useState(customer?.phone || '')
  const [activePhone, setActivePhone] = useState(customer?.phone || '')
  const [customerName, setCustomerName] = useState(customer?.name || '')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Sync if customer context changes
  useEffect(() => {
    if (customer?.phone) {
      setPhoneInput(customer.phone)
      setActivePhone(customer.phone)
      if (customer.name && customer.name !== 'Valued Customer') {
        setCustomerName(customer.name)
      }
    }
  }, [customer])

  // Fetch all bookings matching this phone number from Firestore + LocalStorage
  const loadBookingsForPhone = async (targetPhone: string, isSilent = false) => {
    if (!targetPhone) {
      setLoading(false)
      return
    }

    if (!isSilent) setLoading(true)
    else setRefreshing(true)

    try {
      const allBookings = await getBookings()
      const matched = allBookings.filter(b => isPhoneMatch(b.phone, targetPhone))

      setBookings(matched)

      // Auto-detect customer name if available in their bookings
      if (matched.length > 0 && (!customerName || customerName === 'Valued Customer')) {
        const foundName = matched.find(b => b.customerName && b.customerName.length > 2)?.customerName
        if (foundName) {
          setCustomerName(foundName)
          loginCustomer(targetPhone, foundName)
        }
      }
    } catch (err) {
      console.error('Failed to load bookings', err)
      toast.error('Could not load bookings. Please check your internet connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (activePhone) {
      loadBookingsForPhone(activePhone)
    } else {
      setLoading(false)
    }
  }, [activePhone])

  // Handle phone search submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = phoneInput.replace(/\D/g, '')
    if (clean.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    setActivePhone(phoneInput.trim())
    loginCustomer(phoneInput.trim(), customerName || undefined)
    toast.success(`Showing bookings for ${phoneInput.trim()}`)
    loadBookingsForPhone(phoneInput.trim())
  }

  return (
    <>
      <Helmet>
        <title>My Service Bookings | AA COOL POINT</title>
        <meta
          name="description"
          content="Track your AA COOL POINT AC, Refrigerator and Washing Machine service booking status in Karanthaneri & Tirunelveli."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-[#071426] pt-28 sm:pt-32 pb-12 border-b border-[#1677FF]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.18)_0%,transparent_65%)]" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[#00D9FF] text-xs font-bold tracking-widest uppercase mb-1.5 block">
                Doorstep Service Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
                My Service Bookings
              </h1>
              {activePhone ? (
                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                  Showing all services for mobile:{' '}
                  <span className="text-[#00D9FF] font-bold">{activePhone}</span>
                  {customerName && customerName !== 'Valued Customer' && (
                    <span className="text-gray-400"> ({customerName})</span>
                  )}
                </p>
              ) : (
                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                  Enter your phone number below to see your service status and technician updates.
                </p>
              )}
            </div>

            {/* Quick Actions */}
            {activePhone && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadBookingsForPhone(activePhone, true)}
                  disabled={refreshing}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <RefreshCw size={13} className={refreshing ? 'animate-spin text-[#00D9FF]' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    logoutCustomer()
                    setActivePhone('')
                    setPhoneInput('')
                    setBookings([])
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all cursor-pointer"
                  title="Switch Phone Number"
                >
                  <LogOut size={13} />
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Phone Number Bar */}
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
            <form onSubmit={handlePhoneSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="Enter 10-digit mobile number (e.g. 7904976502)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]"
                />
              </div>
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#1677FF]/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <Search size={15} /> Find Bookings
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Bookings List Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 min-h-[50vh]">
        {!activePhone ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Phone size={32} className="text-[#1677FF]" />
            </div>
            <h2 className="text-xl font-bold text-[#071426] mb-2 font-display">Enter Your Phone Number Above</h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
              Type the mobile number you used while booking a service to view all scheduled repairs and live technician status.
            </p>
            <Link
              to="/book-service"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-[#1677FF]/30 transition-all"
            >
              <Wrench size={15} /> Book a New Service Visit <ArrowRight size={14} />
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <div className="w-3.5 h-3.5 border-2 border-[#1677FF] border-t-transparent rounded-full animate-spin" />
              Searching bookings for {activePhone}...
            </div>
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded-full w-24" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-16 bg-gray-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#071426] mb-1.5 font-display">No Bookings Found</h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto mb-6">
              No service records found matching mobile <strong>{activePhone}</strong>. Make sure you entered the same number used when scheduling the service.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/book-service"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs sm:text-sm font-bold shadow-lg"
              >
                <Wrench size={15} /> Book a Service Now
              </Link>
              <button
                onClick={() => setPhoneInput('')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50"
              >
                Try Another Number
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-2">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Found <strong className="text-[#071426]">{bookings.length}</strong> booking{bookings.length !== 1 ? 's' : ''} for {activePhone}
              </p>
              <Link
                to="/book-service"
                className="text-xs text-[#1677FF] hover:underline font-bold flex items-center gap-1"
              >
                <Wrench size={13} /> Book Another Service
              </Link>
            </div>

            {bookings.map(b => (
              <BookingCard
                key={b.id}
                booking={b}
                onRefresh={() => loadBookingsForPhone(activePhone, true)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Support Section */}
      <section className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-base sm:text-lg font-bold text-[#071426] mb-1 font-display">
            Have Questions About Your Service Visit?
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-5 max-w-md mx-auto">
            Our workshop in Karanthaneri is open Mon–Sat 9AM to 7PM. Call or WhatsApp our service supervisor directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#071426] text-white text-xs sm:text-sm font-bold hover:bg-[#1677FF] transition-colors shadow-md"
              >
                <Phone size={15} /> Call {settings.phone}
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hello AA COOL POINT, I am inquiring about my service booking for mobile number: ${activePhone || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs sm:text-sm font-bold hover:bg-[#20ba59] transition-colors shadow-md"
              >
                <MessageCircle size={15} /> WhatsApp Support
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
