import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'

export default function WhatsAppFloat() {
  const { settings } = useSettings()
  const location = useLocation()

  // Hide on all /admin/* routes
  if (location.pathname.startsWith('/admin')) return null

  // Don't render if no whatsapp number configured
  const phone = settings?.whatsapp?.replace(/\D/g, '')
  if (!phone) return null

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent('Hello! I need assistance from AA COOL POINT.')}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50"
    >
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />

      {/* Button */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-green-500/30 transition-transform duration-200 group-hover:scale-110">
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-8 w-8 fill-white"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.618 4.667 1.794 6.69L2.667 29.333l6.829-1.773A13.286 13.286 0 0 0 16.003 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.003 2.667zm0 24.267a11 11 0 0 1-5.6-1.533l-.4-.24-4.054 1.053 1.08-3.933-.267-.413A11.027 11.027 0 0 1 4.933 16c0-6.107 4.963-11.067 11.07-11.067S27.067 9.893 27.067 16s-4.957 10.934-11.064 10.934zm6.08-8.24c-.333-.167-1.973-.973-2.28-1.08-.307-.107-.533-.16-.76.167-.227.32-.88 1.08-1.08 1.307-.2.227-.4.253-.733.08-.333-.16-1.413-.52-2.693-1.66-.993-.893-1.667-1.993-1.86-2.333-.2-.333-.02-.507.147-.667.153-.147.333-.387.5-.58.167-.2.22-.333.333-.56.113-.227.053-.427-.027-.6-.08-.173-.76-1.827-1.04-2.5-.273-.653-.547-.567-.747-.58-.2-.013-.427-.013-.653-.013a1.26 1.26 0 0 0-.907.427c-.307.333-1.187 1.16-1.187 2.827s1.213 3.28 1.387 3.507c.173.227 2.393 3.653 5.8 5.12.813.347 1.44.56 1.933.72.813.26 1.553.22 2.14.133.653-.093 2.013-.82 2.293-1.613.28-.8.28-1.48.2-1.627-.08-.147-.307-.227-.64-.387z" />
        </svg>
      </span>

      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-max max-w-[180px] rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Chat with us on WhatsApp
        {/* Triangle */}
        <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-gray-900" />
      </span>
    </a>
  )
}
