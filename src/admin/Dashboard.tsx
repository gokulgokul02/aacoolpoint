import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Wrench, Calendar, Star, Image as ImageIcon,
  CheckCircle, PlusCircle, ArrowUpRight, TrendingUp,
  AlertCircle, Clock, Database
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getProducts, getServices, getBookings, getReviews, getGallery
} from '../firebase/firestore'
import { seedInitialDatabase } from '../utils/seedData'
import { formatPrice, formatDate, generateRefId } from '../utils'
import type { Booking, Product, Service } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    newBookings: 0,
    totalReviews: 0,
    totalGallery: 0,
  })

  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        setLoading(true)
        const [prods, srvs, bks, revs, gals] = await Promise.all([
          getProducts(),
          getServices(),
          getBookings(),
          getReviews(false),
          getGallery(false)
        ])

        setStats({
          totalProducts: prods.length,
          activeProducts: prods.filter(p => p.isActive).length,
          totalServices: srvs.length,
          activeServices: srvs.filter(s => s.isActive).length,
          totalBookings: bks.length,
          newBookings: bks.filter(b => b.status === 'new').length,
          totalReviews: revs.length,
          totalGallery: gals.length,
        })

        setRecentBookings(bks.slice(0, 5))
      } catch (err) {
        console.error('Error fetching dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardMetrics()
  }, [])

  const [seeding, setSeeding] = useState(false)

  const handleSeedDatabase = async () => {
    if (!window.confirm('Populate database with official AA COOL POINT initial categories, services, products, and Karanthaneri contact settings?')) {
      return
    }
    try {
      setSeeding(true)
      await seedInitialDatabase()
      toast.success('Database successfully initialized!')
      window.location.reload()
    } catch (err: any) {
      console.error('Seeding error', err)
      toast.error(err.message || 'Failed to seed database')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#071426]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time operations, inventory, and customer service bookings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-xs font-bold transition-colors"
            title="Populate starter services and categories"
          >
            <Database size={14} className="text-[#1677FF]" />
            {seeding ? 'Seeding...' : 'Initialize Demo Data'}
          </button>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1677FF] text-white text-xs font-bold shadow hover:bg-[#0062e6] transition-colors"
          >
            <PlusCircle size={14} /> Add Product
          </Link>
          <Link
            to="/admin/services/add"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071426] text-white text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            <PlusCircle size={14} /> Add Service
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Products</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#071426] mb-1">
            {stats.totalProducts}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span className="font-semibold text-green-600">{stats.activeProducts} active</span> in catalogue
          </div>
        </div>

        {/* Services */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Services</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-[#00D9FF] flex items-center justify-center">
              <Wrench size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#071426] mb-1">
            {stats.totalServices}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span className="font-semibold text-green-600">{stats.activeServices} active</span> available
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#071426] mb-1">
            {stats.totalBookings}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <span className="font-bold text-amber-600">{stats.newBookings} new</span> pending action
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
              <Star size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#071426] mb-1">
            {stats.totalReviews}
          </div>
          <div className="text-[11px] text-gray-500">
            {stats.totalGallery} gallery photos
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-[#071426]">Recent Service Bookings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest service appointments requested by customers</p>
          </div>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:underline"
          >
            Manage All <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No booking requests yet. Once customers book on the website, they will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-6">Ref ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Appliance</th>
                  <th className="py-3 px-6">Service</th>
                  <th className="py-3 px-6">Preferred Date</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1677FF]">
                      {generateRefId(b.id)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#071426]">{b.customerName}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{b.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{b.applianceType}</td>
                    <td className="py-4 px-6 font-semibold text-[#071426]">{b.serviceName}</td>
                    <td className="py-4 px-6 text-gray-500">
                      <div>{b.preferredDate}</div>
                      <div className="text-[10px] text-gray-400">{b.preferredTime}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'new'
                          ? 'bg-blue-100 text-blue-700'
                          : b.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'inprogress'
                          ? 'bg-amber-100 text-amber-700'
                          : b.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

