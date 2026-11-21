import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  Wrench,
  Calendar,
  Star,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { logoutAdmin } from '../../firebase/auth'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  dividerBefore?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/admin' },
  { label: 'Products', icon: <Package size={18} />, to: '/admin/products', dividerBefore: true },
  { label: 'Add Product', icon: <PlusCircle size={18} />, to: '/admin/products/add' },
  { label: 'Categories', icon: <Tag size={18} />, to: '/admin/categories' },
  { label: 'Services', icon: <Wrench size={18} />, to: '/admin/services', dividerBefore: true },
  { label: 'Add Service', icon: <PlusCircle size={18} />, to: '/admin/services/add' },
  { label: 'Bookings', icon: <Calendar size={18} />, to: '/admin/bookings', dividerBefore: true },
  { label: 'Reviews', icon: <Star size={18} />, to: '/admin/reviews' },
  { label: 'Gallery', icon: <Image size={18} />, to: '/admin/gallery' },
  { label: 'Settings', icon: <Settings size={18} />, to: '/admin/settings', dividerBefore: true },
]

const SIDEBAR_WIDTH = 260

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (to: string) => {
    if (to === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(to)
  }

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout()
      navigate('/admin/login', { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: '1px solid rgba(22,119,255,0.15)' }}
      >
        <Link to="/admin" onClick={() => setSidebarOpen(false)}>
          <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent select-none">
            AA COOL POINT
          </span>
          <p className="text-[10px] text-blue-400/50 tracking-widest uppercase mt-0.5">Admin Panel</p>
        </Link>
        {/* Close button (mobile only) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden rounded-md p-1 text-gray-400 hover:text-white hover:bg-blue-900/40 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.to)
          return (
            <React.Fragment key={item.to}>
              {item.dividerBefore && (
                <div
                  className="my-2 mx-2"
                  style={{ borderTop: '1px solid rgba(22,119,255,0.12)' }}
                />
              )}
              <Link
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-gray-400 hover:bg-blue-900/30 hover:text-blue-200'
                }`}
              >
                <span className={active ? 'text-white' : 'text-blue-400/70 group-hover:text-blue-300'}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-blue-200/70" />}
              </Link>
            </React.Fragment>
          )
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid rgba(22,119,255,0.12)' }}
      >
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-150 disabled:opacity-50"
        >
          <LogOut size={18} className="text-red-400/70" />
          {loggingOut ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#060f1e]">

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: SIDEBAR_WIDTH,
          background: '#071426',
          borderRight: '1px solid rgba(22,119,255,0.2)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Slide-in sidebar */}
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden"
              style={{
                width: SIDEBAR_WIDTH,
                background: '#071426',
                borderRight: '1px solid rgba(22,119,255,0.2)',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Right side: header + content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header
          className="flex flex-shrink-0 items-center gap-4 px-4 sm:px-6 py-4"
          style={{
            background: '#071426',
            borderBottom: '1px solid rgba(22,119,255,0.2)',
          }}
        >
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-md p-1.5 text-gray-400 hover:text-white hover:bg-blue-900/40 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Page title derived from pathname */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-white capitalize truncate">
              {location.pathname === '/admin'
                ? 'Dashboard'
                : location.pathname
                    .split('/')
                    .filter(Boolean)
                    .slice(1)
                    .join(' › ')
                    .replace(/-/g, ' ')}
            </h1>
          </div>

          {/* Admin email */}
          {user?.email && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold uppercase">
                {user.email.charAt(0)}
              </div>
              <span className="hidden sm:block text-xs text-gray-400 max-w-[180px] truncate">
                {user.email}
              </span>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
