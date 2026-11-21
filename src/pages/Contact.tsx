import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useSettings } from '../context/SettingsContext'
import {
  Phone as PhoneIcon,
  Mail as EnvelopeIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageCircle as ChatBubbleLeftEllipsisIcon,
  CheckCircle as CheckCircleIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  email: z.string().email('Enter a valid email').or(z.literal('')).optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Component ────────────────────────────────────────────────────────────────
const Contact: React.FC = () => {
  const { settings } = useSettings()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...data,
        email: data.email || '',
        source: 'contact_form',
        status: 'new',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
      reset()
      toast.success('Message sent! We will get back to you soon.')
    } catch (err) {
      console.error('Contact form error:', err)
      toast.error('Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=Hello%20AA%20COOL%20POINT,%20I%20have%20an%20enquiry.`
    : '#'

  const infoCards = [
    {
      icon: PhoneIcon,
      label: 'Phone',
      value: settings.phone || 'Not configured',
      href: settings.phone ? `tel:${settings.phone}` : undefined,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: ChatBubbleLeftEllipsisIcon,
      label: 'WhatsApp',
      value: settings.whatsapp || 'Not configured',
      href: settings.whatsapp ? whatsappHref : undefined,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: EnvelopeIcon,
      label: 'Email',
      value: settings.email || 'Not configured',
      href: settings.email ? `mailto:${settings.email}` : undefined,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: MapPinIcon,
      label: 'Address',
      value: settings.address || 'Karanthaneri, Tamil Nadu, India',
      href: undefined,
      color: 'from-red-500 to-red-600',
    },
    {
      icon: ClockIcon,
      label: 'Opening Hours',
      value: settings.openingHours || 'Mon–Sat: 9:00 AM – 7:00 PM',
      href: undefined,
      color: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Contact Us | AA COOL POINT – AC & Appliance Services</title>
        <meta
          name="description"
          content="Get in touch with AA COOL POINT for AC repair, refrigerator and washing machine services in Karanthaneri, Tamil Nadu. Call, WhatsApp or fill the contact form."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#071426] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#1677FF] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#00D9FF] rounded-full opacity-10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 md:pb-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeInUp}
              className="text-[#00D9FF] text-sm font-semibold tracking-widest uppercase mb-3"
            >
              <Link to="/" className="hover:underline">Home</Link> / Contact Us
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Get In{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#00D9FF]">
                Touch
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg max-w-xl mx-auto">
              Have a question or need a service? Reach out — we're just a call or message away.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#F5F8FC]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <section className="bg-[#F5F8FC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Left: Info Cards ───────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="lg:col-span-2 space-y-4"
            >
              <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#071426] mb-6">
                Contact Information
              </motion.h2>

              {infoCards.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div key={label} variants={fadeInUp}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-blue-100 group"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-[#071426] font-medium text-sm leading-snug">{value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-transparent">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                        <p className="text-[#071426] font-medium text-sm leading-snug">{value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Quick links */}
              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#071426] to-[#0d2040] rounded-xl p-5 mt-2">
                <p className="text-white font-semibold mb-3">Quick Actions</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.886a.5.5 0 00.611.611l6.03-1.476A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.518-5.17-1.419l-.37-.22-3.828.937.957-3.737-.242-.386A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                  <Link
                    to="/book-service"
                    className="flex items-center gap-2 bg-[#1677FF] hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Book a Service
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Right: Contact Form ────────────────────────────────────── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#071426] mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#1677FF] hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#071426] mb-6">
                      Send Us a Message
                    </motion.h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      {/* Name + Phone */}
                      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('name')}
                            placeholder="Your name"
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition ${
                              errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register('phone')}
                            placeholder="Your phone number"
                            type="tel"
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition ${
                              errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                          )}
                        </div>
                      </motion.div>

                      {/* Email */}
                      <motion.div variants={fadeInUp}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email{' '}
                          <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          {...register('email')}
                          placeholder="your@email.com"
                          type="email"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition ${
                            errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </motion.div>

                      {/* Subject */}
                      <motion.div variants={fadeInUp}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register('subject')}
                          placeholder="e.g. AC not cooling, service enquiry..."
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition ${
                            errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.subject && (
                          <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                        )}
                      </motion.div>

                      {/* Message */}
                      <motion.div variants={fadeInUp}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register('message')}
                          rows={5}
                          placeholder="Describe your issue or enquiry..."
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1677FF] transition resize-none ${
                            errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'
                          }`}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                        )}
                      </motion.div>

                      {/* Submit */}
                      <motion.div variants={fadeInUp}>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-[#1677FF] hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          {submitting ? (
                            <>
                              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <EnvelopeIcon className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </button>
                      </motion.div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Google Maps ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#071426] mb-2">
              Find Us on the Map
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 text-sm">
              {settings.address || 'Karanthaneri, Tamil Nadu, India'}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            {settings.mapsUrl ? (
              <iframe
                src={settings.mapsUrl}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AA COOL POINT Location"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#F5F8FC] to-blue-50 h-64 flex flex-col items-center justify-center gap-3">
                <MapPinIcon className="w-10 h-10 text-[#1677FF]" />
                <p className="text-gray-500 text-sm font-medium">Map not configured</p>
                <p className="text-gray-400 text-xs">
                  Add your Google Maps embed URL in Admin → Settings → Maps URL
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── WhatsApp CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#071426] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeInUp} className="text-3xl mb-3">💬</motion.p>
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-white mb-3">
              Prefer WhatsApp?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 mb-6">
              Send us a quick message and we'll respond as soon as possible.
            </motion.p>
            <motion.a
              variants={fadeInUp}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-900/30"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.886a.5.5 0 00.611.611l6.03-1.476A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.518-5.17-1.419l-.37-.22-3.828.937.957-3.737-.242-.386A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Open WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Contact
