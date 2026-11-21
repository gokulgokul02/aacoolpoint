import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  Save, Building, Phone, MapPin, Globe, Share2,
  FileText, Search, RefreshCw, Award
} from 'lucide-react'
import { getWebsiteSettings, updateWebsiteSettings } from '../firebase/firestore'
import { useSettings } from '../context/SettingsContext'
import type { WebsiteSettings as SettingsType } from '../types'

export default function WebsiteSettings() {
  const { updateSettings, refresh: refreshGlobalSettings } = useSettings()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<SettingsType>()

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getWebsiteSettings()
      if (data) {
        Object.entries(data).forEach(([key, val]) => {
          setValue(key as any, val)
        })
      }
    } catch (err) {
      console.error('Failed to fetch website settings', err)
      toast.error('Could not load website settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onSubmit = async (data: SettingsType) => {
    try {
      setSaving(true)
      await updateSettings(data)
      toast.success('Website business settings saved & applied live!')
    } catch (err: any) {
      console.error('Error saving settings', err)
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="skeleton h-12 w-1/4 rounded" />
        <div className="skeleton h-96 rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-[#071426]">
            Business Profile & Website Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure contact info, Karanthaneri location, SEO metadata, and hero banner texts
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#0062e6] text-white text-xs font-bold shadow hover:shadow-lg disabled:opacity-50 transition-all w-fit"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={15} /> Save All Changes
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Core Business Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Building size={16} className="text-[#1677FF]" /> Business Identity & Contact
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Business Name
              </label>
              <input
                type="text"
                {...register('businessName')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                {...register('tagline')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Official Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                {...register('phone')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                WhatsApp Chat Number (with country code)
              </label>
              <input
                type="text"
                placeholder="+919876543210"
                {...register('whatsapp')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Official Support Email
              </label>
              <input
                type="email"
                placeholder="contact@aacoolpoint.com"
                {...register('email')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Business Working Hours
              </label>
              <input
                type="text"
                placeholder="Mon–Sat: 9:00 AM – 8:00 PM"
                {...register('openingHours')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 pt-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Full Physical Address
              </label>
              <textarea
                rows={3}
                placeholder="Karanthaneri, Tirunelveli District, Tamil Nadu, India"
                {...register('address')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Google Maps Embed URL (iframe src)
              </label>
              <textarea
                rows={3}
                placeholder="https://www.google.com/maps/embed?pb=..."
                {...register('mapsUrl')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Homepage Hero and Intro Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Globe size={16} className="text-[#1677FF]" /> Homepage Hero Section Content
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                placeholder="SMART COOLING. BETTER LIVING."
                {...register('heroTitle')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                placeholder="Your trusted destination for Air Conditioners, Refrigerators and Washing Machines..."
                {...register('heroDescription')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                About AA COOL POINT (Homepage Preview)
              </label>
              <textarea
                rows={4}
                placeholder="AA COOL POINT is an established air conditioning repair service..."
                {...register('about')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Company Statistics (About Us Page) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Award size={16} className="text-[#1677FF]" /> Company Statistics (About Page Achievements)
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Years of Service / Experience
              </label>
              <input
                type="text"
                placeholder="e.g. 10+ Years"
                {...register('yearsOfService')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Happy Customers Served
              </label>
              <input
                type="text"
                placeholder="e.g. 2500+"
                {...register('happyCustomers')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Brands Supported
              </label>
              <input
                type="text"
                placeholder="e.g. 15+ Brands"
                {...register('brandsSupported')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Search size={16} className="text-[#1677FF]" /> Local SEO Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Meta SEO Title
              </label>
              <input
                type="text"
                placeholder="AA COOL POINT – AC Sales & Service | Karanthaneri"
                {...register('seoTitle')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Meta SEO Description
              </label>
              <textarea
                rows={3}
                placeholder="Professional AC repair, gas refilling, refrigerator and washing machine services in Karanthaneri, Tamil Nadu..."
                {...register('seoDescription')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Footer */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="font-bold text-sm text-[#071426] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Share2 size={16} className="text-[#1677FF]" /> Social Links & Footer
          </h2>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Facebook Page Link
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                {...register('facebook')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Instagram Profile Link
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                {...register('instagram')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                YouTube Channel Link
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                {...register('youtube')}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              placeholder="© 2024 AA COOL POINT. All rights reserved. Karanthaneri, Tamil Nadu."
              {...register('footerText')}
              className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1677FF]"
            />
          </div>
        </div>

        {/* Floating / Sticky Save button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white text-sm font-bold uppercase tracking-wider shadow-xl hover:shadow-[#1677FF]/40 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} /> Save & Apply Website Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

