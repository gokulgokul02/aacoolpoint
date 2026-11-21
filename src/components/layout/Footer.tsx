import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'Book Service', to: '/book-service' },
]

const services = [
  'AC Installation',
  'AC Repair',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'AC Gas Refilling',
  'Deep Cleaning',
]

export default function Footer() {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        background: '#071426',
        borderTop: '1px solid rgba(22,119,255,0.2)',
      }}
      className="text-gray-300"
    >
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Column 1: About ── */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent select-none">
                AA COOL POINT
              </span>
            </Link>
            <p className="text-sm text-blue-300/70 leading-relaxed">
              {settings?.tagline ||
                'Your trusted partner for all air conditioning, refrigeration & home appliance services.'}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-2">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/30 text-pink-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150"
                  >
                    <span className="h-px w-4 bg-blue-500/50 group-hover:w-6 group-hover:bg-blue-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Services ── */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Our Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {services.map((svc) => (
                <li key={svc}>
                  <Link
                    to="/services"
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150"
                  >
                    <span className="h-px w-4 bg-blue-500/50 group-hover:w-6 group-hover:bg-blue-400 transition-all duration-200" />
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-widest text-blue-400">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-start gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150 group"
                  >
                    <Phone size={15} className="mt-0.5 shrink-0 text-blue-500 group-hover:text-blue-400" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings?.whatsapp && settings.whatsapp !== settings?.phone && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors duration-150 group"
                  >
                    {/* WhatsApp inline SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="mt-0.5 h-[15px] w-[15px] shrink-0 fill-green-500 group-hover:fill-green-400">
                      <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.618 4.667 1.794 6.69L2.667 29.333l6.829-1.773A13.286 13.286 0 0 0 16.003 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.003 2.667zm6.08 16.027c-.333-.167-1.973-.973-2.28-1.08-.307-.107-.533-.16-.76.167-.227.32-.88 1.08-1.08 1.307-.2.227-.4.253-.733.08-.333-.16-1.413-.52-2.693-1.66-.993-.893-1.667-1.993-1.86-2.333-.2-.333-.02-.507.147-.667.153-.147.333-.387.5-.58.167-.2.22-.333.333-.56.113-.227.053-.427-.027-.6-.08-.173-.76-1.827-1.04-2.5-.273-.653-.547-.567-.747-.58-.2-.013-.427-.013-.653-.013a1.26 1.26 0 0 0-.907.427c-.307.333-1.187 1.16-1.187 2.827s1.213 3.28 1.387 3.507c.173.227 2.393 3.653 5.8 5.12.813.347 1.44.56 1.933.72.813.26 1.553.22 2.14.133.653-.093 2.013-.82 2.293-1.613.28-.8.28-1.48.2-1.627-.08-.147-.307-.227-.64-.387z" />
                    </svg>
                    <span>WhatsApp: {settings.whatsapp}</span>
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-3 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150 group"
                  >
                    <Mail size={15} className="mt-0.5 shrink-0 text-blue-500 group-hover:text-blue-400" />
                    <span>{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-blue-500" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.openingHours && (
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <Clock size={15} className="mt-0.5 shrink-0 text-blue-500" />
                  <span>{settings.openingHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: '1px solid rgba(22,119,255,0.15)' }}
        className="py-5"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            {settings?.footerText ||
              `© ${currentYear} AA COOL POINT. All rights reserved.`}
          </p>
          <p className="text-blue-500/50">
            Designed &amp; developed with ❤️ for quality service
          </p>
        </div>
      </div>
    </footer>
  )
}
