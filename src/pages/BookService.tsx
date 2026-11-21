import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Wrench, Calendar, Clock, MapPin, CheckCircle,
  Phone, MessageCircle, AlertCircle, ArrowRight
} from 'lucide-react'
import { addBooking, getServices } from '../firebase/firestore'
import { useSettings } from '../context/SettingsContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { generateRefId } from '../utils'
import type { Service } from '../types'

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name is required (at least 2 characters)'),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, 'Valid 10-digit mobile number required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  applianceType: z.string().min(1, 'Please select your appliance type'),
  serviceId: z.string().min(1, 'Please select the service required'),
  preferredDate: z.string().min(1, 'Please select your preferred service date'),
  preferredTime: z.string().min(1, 'Please select a preferred time slot'),
  address: z.string().min(10, 'Full address with landmarks is required for doorstep visit'),
  description: z.string().optional().or(z.literal('')),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookService() {
  const [searchParams] = useSearchParams()
  const { settings } = useSettings()
  const { loginCustomer } = useCustomerAuth()

  const preselectedServiceId = searchParams.get('serviceId') || ''
  const preselectedServiceName = searchParams.get('serviceName') || ''

  const [services, setServices] = useState<Service[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      applianceType: 'Air Conditioner',
      serviceId: preselectedServiceId,
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: 'Morning (9AM - 1PM)',
      address: '',
      description: '',
    }
  })

  useEffect(() => {
    getServices({ isActive: true }).then(setServices).catch(console.error)
  }, [])

  useEffect(() => {
    if (preselectedServiceId) {
      setValue('serviceId', preselectedServiceId)
    }
  }, [preselectedServiceId, setValue])

  const onSubmit = async (data: BookingFormData) => {
    try {
      setSubmitting(true)
      const matched = services.find(s => s.id === data.serviceId)
      const serviceTitle = matched?.title || preselectedServiceName || 'General Appliance Service'

      const newId = await addBooking({
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || '',
        applianceType: data.applianceType,
        serviceId: data.serviceId,
        serviceName: serviceTitle,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        address: data.address,
        description: data.description || '',
        issueImages: [],
        status: 'new',
        adminNotes: '',
      })

      setConfirmedBookingId(newId)
      loginCustomer(data.phone, data.customerName, data.email || undefined)
      toast.success('Service booking request registered successfully!')
    } catch (err: any) {
      console.error('Booking submission failed', err)
      toast.error(err.message || 'Failed to submit service booking. Please call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedAppliance = watch('applianceType')
  const filteredServicesByAppliance = services.filter(s => {
    if (!selectedAppliance) return true
    return s.categoryId?.toLowerCase().includes(selectedAppliance.toLowerCase().split(' ')[0]) || true
  })

  return (
    <>
      <Helmet>
        <title>Book a Service Visit | AA COOL POINT - Karanthaneri</title>
        <meta
          name="description"
          content="Schedule doorstep AC repair, Refrigerator maintenance, or Washing Machine installation in Karanthaneri, Tamil Nadu."
        />
      </Helmet>

      {/* Header */}
      <section className="bg-[#071426] pt-28 pb-12 border-b border-[#1677FF]/20 relative overflow-hidden text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.15)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[#00D9FF] text-xs font-bold tracking-widest uppercase mb-2 inline-block">
            Easy Online Booking
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display mb-3">
            Book Doorstep <span className="text-[#00D9FF]">Appliance Service</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            Fill in the details below to schedule an expert technician visit in Karanthaneri and surrounding regions.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {confirmedBookingId ? (
          /* Confirmation card */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={44} />
            </div>
            <h2 className="text-2xl font-black font-display text-[#071426] mb-2">
              Booking Request Received!
            </h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Thank you! Our operations team at AA COOL POINT has received your request and will call you shortly to confirm the technician appointment.
            </p>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-200 mb-8 inline-block w-full text-left">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Booking Reference ID
              </div>
              <div className="font-mono text-xl font-black text-[#1677FF]">
                {generateRefId(confirmedBookingId)}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Please quote this reference ID if you call our office.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/my-bookings"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs font-bold shadow-md hover:shadow-[#1677FF]/40 transition-all"
              >
                <Wrench size={15} />
                Track Booking Status
              </Link>
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hi AA COOL POINT, I just booked service online with Reference ID: ${generateRefId(confirmedBookingId)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#20b255] transition-all"
                >
                  <MessageCircle size={16} />
                  Notify on WhatsApp
                </a>
              )}
              <Link
                to="/"
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#071426] text-white text-xs font-bold hover:bg-[#1677FF] transition-all"
              >
                Back to Home <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Customer Contact Details */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Phone size={16} /> Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      {...register('customerName')}
                      className={`w-full p-3 text-xs rounded-xl border ${
                        errors.customerName ? 'border-red-400' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1677FF]`}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register('phone')}
                      className={`w-full p-3 text-xs rounded-xl border ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1677FF]`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      {...register('email')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Service & Appliance Specification */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Wrench size={16} /> Appliance & Service Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Appliance Type *
                    </label>
                    <select
                      {...register('applianceType')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white font-medium"
                    >
                      <option value="Air Conditioner">Air Conditioner (Split / Window)</option>
                      <option value="Refrigerator">Refrigerator (Single / Double Door)</option>
                      <option value="Washing Machine">Washing Machine (Front / Top Load)</option>
                      <option value="Other Home Appliance">Other Appliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Specific Service Needed *
                    </label>
                    <select
                      {...register('serviceId')}
                      className={`w-full p-3 text-xs rounded-xl border ${
                        errors.serviceId ? 'border-red-400' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1677FF] bg-white font-medium`}
                    >
                      <option value="">-- Select Service --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.title} {s.price > 0 ? `(₹${s.offerPrice || s.price})` : ''}
                        </option>
                      ))}
                      <option value="custom">General Diagnostic / Other Repair</option>
                    </select>
                    {errors.serviceId && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.serviceId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Appointment Preferences */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Calendar size={16} /> Preferred Date & Time
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('preferredDate')}
                      className={`w-full p-3 text-xs rounded-xl border ${
                        errors.preferredDate ? 'border-red-400' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1677FF] bg-white`}
                    />
                    {errors.preferredDate && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.preferredDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Preferred Time Window *
                    </label>
                    <select
                      {...register('preferredTime')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF] bg-white font-medium"
                    >
                      <option value="Morning (9AM - 1PM)">Morning (9:00 AM – 1:00 PM)</option>
                      <option value="Afternoon (1PM - 4PM)">Afternoon (1:00 PM – 4:00 PM)</option>
                      <option value="Evening (4PM - 7PM)">Evening (4:00 PM – 7:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address and Description */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1677FF] mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <MapPin size={16} /> Location & Issue Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Service Address (Karanthaneri, Tirunelveli & Surroundings) *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Door number, street name, landmark, area (Karanthaneri / Tirunelveli or nearby), PIN code..."
                      {...register('address')}
                      className={`w-full p-3 text-xs rounded-xl border ${
                        errors.address ? 'border-red-400' : 'border-gray-200'
                      } focus:outline-none focus:border-[#1677FF]`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[11px] mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Problem Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. AC is not cooling properly, unusual noise from washing machine drum, water leaking..."
                      {...register('description')}
                      className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-sm font-bold tracking-wider uppercase shadow-xl hover:shadow-[#1677FF]/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Wrench size={18} />
                      Confirm & Schedule Service Request
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3">
                  *Our technician will contact you to verify arrival time before the visit.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

