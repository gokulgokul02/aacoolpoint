import React, { createContext, useContext, useEffect, useState } from 'react'
import { getWebsiteSettings, updateWebsiteSettings as firestoreUpdateSettings } from '../firebase/firestore'
import type { WebsiteSettings } from '../types'

const defaultSettings: WebsiteSettings = {
  businessName: 'AA COOL POINT',
  tagline: 'Cooling Comfort. Trusted Service.',
  phone: '+91 79049 76502',
  whatsapp: '+917904976502',
  email: 'aacoolpoint@gmail.com',
  address: 'Panankulam, Tirunelveli, Tamil Nadu – 627 011',
  mapsUrl: 'https://maps.app.goo.gl/B9u2tHzvA3TVoS5a6',
  openingHours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  about: 'AA COOL POINT is your trusted destination for Air Conditioners, Refrigerators and Washing Machines in Panankulam, Tamil Nadu. Certified doorstep repair services across Tirunelveli and surrounding regions.',
  heroTitle: 'SMART COOLING. BETTER LIVING.',
  heroDescription: 'Your trusted destination in Panankulam for Air Conditioners, Refrigerators and Washing Machines. Certified doorstep repair services across Tirunelveli and surrounding regions.',
  seoTitle: 'AA COOL POINT – AC Sales & Service | Panankulam, Tirunelveli',
  seoDescription: 'Expert AC repair, gas refilling, refrigerator and washing machine doorstep services in Panankulam, Tirunelveli, and surrounding regions. Call us today.',
  logoUrl: '/logo.png',
  faviconUrl: '/logo.png',
  facebook: '',
  instagram: '',
  youtube: 'https://www.youtube.com/@AbelRaja119',
  footerText: '© AA COOL POINT. All Rights Reserved.',
  yearsOfService: '10+',
  happyCustomers: '2500+',
  brandsSupported: '15+',
}

// Read cached settings synchronously from localStorage so UI never flickers to outdated defaults
const getInitialSettings = (): WebsiteSettings => {
  try {
    const cached = localStorage.getItem('aacoolpoint_settings')
    if (cached) {
      return { ...defaultSettings, ...JSON.parse(cached) }
    }
  } catch {}
  return defaultSettings
}

interface SettingsContextType {
  settings: WebsiteSettings
  loading: boolean
  refresh: () => Promise<void>
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refresh: async () => {},
  updateSettings: async () => {},
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(getInitialSettings)
  const [loading, setLoading] = useState(false)

  const fetchSettings = async () => {
    try {
      const data = await getWebsiteSettings()
      if (data) {
        const merged: WebsiteSettings = { ...defaultSettings, ...data }
        setSettings(merged)
        localStorage.setItem('aacoolpoint_settings', JSON.stringify(merged))
      }
    } catch (err) {
      console.warn('Settings fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    // 1. Immediately update local React state and localStorage (zero latency UI update)
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('aacoolpoint_settings', JSON.stringify(updated))
      return updated
    })

    // 2. Persist to Firestore
    await firestoreUpdateSettings(newSettings)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
