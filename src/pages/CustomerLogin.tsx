import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone, User, ArrowRight, Wrench, CheckCircle, Search } from 'lucide-react'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import toast from 'react-hot-toast'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginCustomer, customer } = useCustomerAuth()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // Where to go after login
  const from = (location.state as any)?.from || '/my-bookings'

  // If already logged in
  if (customer) {
    navigate(from, { replace: true })
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanDigits = phone.replace(/\D/g, '')
    if (cleanDigits.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    setTimeout(() => {
      loginCustomer(phone, name.trim() || undefined)
      toast.success('Mobile number verified! Loading your bookings...')
      navigate(from, { replace: true })
      setLoading(false)
    }, 400)
  }

  return (
    <>
      <Helmet>
        <title>Track My Bookings | AA COOL POINT</title>
        <meta name="description" content="Enter your mobile number to view all your service bookings and repair status at AA COOL POINT." />
      </Helmet>

      <section className="min-h-screen bg-[#071426] flex items-center justify-center px-4 pt-28 pb-16 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,119,255,0.18)_0%,transparent_65%)]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo Card */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-2xl shadow-[#1677FF]/40 mb-3 border-2 border-white p-1">
              <img src="/logo.png" alt="AA COOL POINT" className="w-full h-full object-contain rounded-full" />
            </div>
            <h1 className="text-2xl font-black text-white font-display">AA COOL POINT</h1>
            <p className="text-[#00D9FF] text-xs font-semibold tracking-wider uppercase mt-0.5">
              Customer Portal • Service Tracking
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-2">
                <Search size={18} className="text-[#00D9FF]" />
                Track Your Bookings
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Just enter your mobile number. All services booked with this number will show up automatically.
              </p>
            </div>

            {/* Quick Benefits list */}
            <div className="grid grid-cols-1 gap-2 mb-6 p-3 rounded-2xl bg-white/5 border border-white/10">
              {[
                'Live status updates (Assigned, In-Progress, Completed)',
                'Technician visit date & time window',
                'Submit review & 5-star rating after service',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-200">
                  <CheckCircle size={13} className="text-[#00D9FF] flex-shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone number */}
              <div>
                <label className="text-xs font-bold text-gray-200 block mb-1.5">
                  Mobile Number <span className="text-[#00D9FF]">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-gray-400 text-[11px] mt-1.5">
                  Matches any format: e.g. <span className="text-gray-300">7904976502</span> or <span className="text-gray-300">+91 79049 76502</span>
                </p>
              </div>

              {/* Name (Optional) */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Your Name <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#00D9FF] transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#1677FF]/40 disabled:opacity-60 transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={16} /> View My Bookings <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
              <Link to="/book-service" className="text-[#00D9FF] hover:underline flex items-center gap-1 font-semibold">
                <Wrench size={13} /> Book a New Service
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
