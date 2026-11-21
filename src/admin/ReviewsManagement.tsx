import React, { useState, useEffect } from 'react'
import {
  Star, Plus, Trash2, CheckCircle, EyeOff, Eye, X, MessageSquare, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getReviews, addReview, updateReview, deleteReview
} from '../firebase/firestore'
import type { Review } from '../types'

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Add form fields
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewDate, setReviewDate] = useState(new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }))

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await getReviews(false)
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews', err)
      toast.error('Could not fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handleToggleApproval = async (review: Review) => {
    try {
      const nextApproved = !review.isApproved
      await updateReview(review.id, { isApproved: nextApproved })
      setReviews(prev =>
        prev.map(r => (r.id === review.id ? { ...r, isApproved: nextApproved } : r))
      )
      toast.success(nextApproved ? 'Review approved for public display' : 'Review hidden')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return
    try {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
      toast.success('Review deleted')
    } catch (err) {
      toast.error('Failed to delete review')
    }
  }

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !reviewText.trim()) {
      toast.error('Customer name and review text are required')
      return
    }

    try {
      await addReview({
        customerName: customerName.trim(),
        rating,
        review: reviewText.trim(),
        date: reviewDate,
        isApproved: true,
        isActive: true,
      })
      toast.success('Review added successfully!')
      setShowModal(false)
      setCustomerName('')
      setReviewText('')
      loadReviews()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add review')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Customer Reviews & Ratings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage testimonials published on the homepage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadReviews}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#1677FF] hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
            No customer reviews logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Review Excerpt</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {reviews.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#071426]">
                      {r.customerName}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={13}
                            className={j < r.rating ? 'fill-yellow-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600 max-w-sm truncate">
                      "{r.review}"
                    </td>

                    <td className="py-4 px-6 text-gray-400">
                      {r.date}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleApproval(r)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {r.isApproved ? (
                          <>
                            <CheckCircle size={11} /> Approved
                          </>
                        ) : (
                          <>
                            <EyeOff size={11} /> Hidden
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(r.id, r.customerName)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-bold text-base text-[#071426]">
                Add Verified Testimonial
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. S. Murugan"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Star Rating (1 - 5)
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRating(st)}
                      className="p-1 text-yellow-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} className={st <= rating ? 'fill-yellow-400' : 'text-gray-200'} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Customer Feedback / Review *
                </label>
                <textarea
                  rows={4}
                  placeholder="Quote customer's experience with AC cooling, prompt repair, etc."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Display Date (e.g. Nov 2024)
                </label>
                <input
                  type="text"
                  value={reviewDate}
                  onChange={e => setReviewDate(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

