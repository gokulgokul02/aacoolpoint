import React, { useState, useEffect } from 'react'
import {
  Calendar, Search, Filter, Phone, Mail, MapPin,
  Clock, CheckCircle, XCircle, AlertCircle, Edit3, X, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getBookings, updateBooking } from '../firebase/firestore'
import { generateRefId, formatDate } from '../utils'
import type { Booking } from '../types'

type BookingStatus = Booking['status']

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [updating, setUpdating] = useState(false)

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      setBookings(data)
    } catch (err) {
      console.error('Failed to load bookings', err)
      toast.error('Could not fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBooking(id, { status: newStatus })
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: newStatus } : b))
      )
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => (prev ? { ...prev, status: newStatus } : null))
      }
      toast.success(`Booking status updated to ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleSaveNote = async () => {
    if (!selectedBooking) return
    try {
      setUpdating(true)
      await updateBooking(selectedBooking.id, { adminNotes: adminNote })
      setBookings(prev =>
        prev.map(b =>
          b.id === selectedBooking.id ? { ...b, adminNotes: adminNote } : b
        )
      )
      toast.success('Internal admin note saved')
    } catch (err) {
      toast.error('Failed to save note')
    } finally {
      setUpdating(false)
    }
  }

  const openModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setAdminNote(booking.adminNotes || '')
  }

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'inprogress':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Service Requests & Bookings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review and track doorstep appliance repair schedules
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:bg-gray-50 text-xs font-semibold w-fit"
        >
          <RefreshCw size={14} /> Refresh Bookings
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name, phone, or service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 w-full sm:w-auto">
          {['all', 'new', 'confirmed', 'inprogress', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#1677FF] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            No bookings found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Ref ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Appliance & Service</th>
                  <th className="py-3.5 px-6">Scheduled Visit</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#1677FF]">
                      {generateRefId(b.id)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-[#071426]">{b.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                        <Phone size={11} /> {b.phone}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">{b.serviceName}</div>
                      <div className="text-[11px] text-[#1677FF]">{b.applianceType}</div>
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      <div className="font-semibold text-[#071426]">{b.preferredDate}</div>
                      <div className="text-[11px] text-gray-400">{b.preferredTime}</div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={b.status}
                        onChange={e => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="assigned">Assigned</option>
                        <option value="inprogress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openModal(b)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#1677FF] hover:text-white text-gray-700 font-bold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-[#1677FF]">
                  {generateRefId(selectedBooking.id)}
                </span>
                <h3 className="font-bold text-lg text-[#071426]">Booking Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Customer Box */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#071426]">
                    {selectedBooking.customerName}
                  </span>
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="flex items-center gap-1 text-[#1677FF] font-bold"
                  >
                    <Phone size={12} /> Call Customer
                  </a>
                </div>
                <div className="text-gray-600">
                  <strong>Phone:</strong> {selectedBooking.phone}
                </div>
                {selectedBooking.email && (
                  <div className="text-gray-600">
                    <strong>Email:</strong> {selectedBooking.email}
                  </div>
                )}
                <div className="text-gray-700 pt-2 border-t border-gray-200">
                  <strong className="block text-gray-500 mb-0.5">Visit Address:</strong>
                  {selectedBooking.address}
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Appliance</span>
                  <span className="font-bold text-[#071426] text-sm">{selectedBooking.applianceType}</span>
                </div>
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Service</span>
                  <span className="font-bold text-[#071426] text-sm">{selectedBooking.serviceName}</span>
                </div>
              </div>

              {/* Problem Description */}
              {selectedBooking.description && (
                <div>
                  <strong className="text-gray-700 block mb-1">Reported Problem / Symptoms:</strong>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-600">
                    {selectedBooking.description}
                  </div>
                </div>
              )}

              {/* Status Update In Modal */}
              <div>
                <strong className="text-gray-700 block mb-1">Update Status:</strong>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'confirmed', 'assigned', 'inprogress', 'completed', 'cancelled'] as BookingStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedBooking.id, st)}
                      className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                        selectedBooking.status === st
                          ? 'bg-[#071426] text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Note */}
              <div className="pt-2 border-t border-gray-100">
                <strong className="text-gray-700 block mb-1">Internal Admin Notes:</strong>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Record technician assigned, part numbers needed, or estimate communicated..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
                <button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={updating}
                  className="mt-2 px-4 py-2 bg-[#1677FF] text-white rounded-xl font-bold hover:bg-[#0062e6] transition-colors"
                >
                  {updating ? 'Saving Note...' : 'Save Internal Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

