import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Wrench, Shield, User } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO_SRC = '/logo.png'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useSettings()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Background styling: solid on non-home pages; responsive on home page
  const navBg = isHome
    ? scrolled
      ? 'bg-[#071426]/95 backdrop-blur-md shadow-lg shadow-black/25 border-b border-[#1677FF]/20'
      : 'bg-transparent'
    : 'bg-[#071426] shadow-lg shadow-black/30 border-b border-[#1677FF]/20'

  const whatsappUrl = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi AA COOL POINT, I would like to inquire about your services.')}`
    : null

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${navBg}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-lg shadow-[#1677FF]/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0 overflow-hidden flex items-center justify-center p-0.5 border border-white/50">
                <img
                  src={LOGO_SRC}
                  alt="AA COOL POINT Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={e => {
                    const t = e.currentTarget as HTMLImageElement
                    t.style.display = 'none'
                    const parent = t.parentElement!
                    parent.classList.add('bg-gradient-to-br', 'from-[#1677FF]', 'to-[#00D9FF]')
                    parent.innerHTML = '<span class="text-white font-black text-sm">AA</span>'
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="text-white font-black text-base sm:text-lg leading-tight tracking-wider font-display whitespace-nowrap">
                  AA COOL POINT
                </div>
                <div className="text-[#00D9FF] text-[8.5px] sm:text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
                  {settings.tagline || 'Cooling Comfort. Trusted Service.'}
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-[#1677FF] to-[#0062e6] shadow-md shadow-[#1677FF]/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-white/90 hover:text-white hover:border-[#00D9FF] text-xs font-semibold transition-all duration-200"
                >
                  <Phone size={13} className="text-[#00D9FF]" />
                  <span>{settings.phone}</span>
                </a>
              )}
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-white/90 hover:text-white hover:border-[#00D9FF] text-xs font-semibold transition-all duration-200"
              >
                <User size={13} className="text-[#00D9FF]" />
                My Bookings
              </Link>
              <Link
                to="/book-service"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#1677FF]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Wrench size={14} />
                Book Service
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer (Rendered OUTSIDE header to escape any CSS filter / stacking constraints) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#071426] border-l border-[#1677FF]/30 shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden">
                    <img src={LOGO_SRC} alt="AA COOL POINT" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div className="text-white font-black font-display tracking-wider text-sm">
                    AA COOL POINT
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 space-y-1.5 mb-6">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#1677FF]/25 text-[#00D9FF] border border-[#1677FF]/50 shadow-md shadow-[#1677FF]/20'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <Link
                  to="/book-service"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-sm font-bold tracking-wider shadow-lg shadow-[#1677FF]/30"
                >
                  <Wrench size={16} />
                  Book Service
                </Link>

                <Link
                  to="/my-bookings"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#1677FF]/40 text-[#00D9FF] text-sm font-semibold hover:bg-[#1677FF]/10 transition-colors"
                >
                  <User size={15} />
                  My Bookings & Status
                </Link>

                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:border-[#00D9FF]"
                  >
                    <Phone size={15} className="text-[#00D9FF]" />
                    {settings.phone}
                  </a>
                )}

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba59]"
                  >
                    Chat on WhatsApp
                  </a>
                )}

                <Link
                  to="/admin/login"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-gray-400 hover:text-white text-xs font-medium"
                >
                  <Shield size={13} />
                  Admin Portal
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
