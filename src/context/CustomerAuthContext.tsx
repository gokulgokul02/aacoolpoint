import React, { createContext, useContext, useEffect, useState } from 'react'

export interface CustomerUser {
  id: string
  name: string
  phone: string
  email?: string
}

interface CustomerAuthContextType {
  customer: CustomerUser | null
  loading: boolean
  loginCustomer: (phone: string, name?: string, email?: string) => void
  logoutCustomer: () => void
}

const CustomerAuthContext = createContext<CustomerAuthContextType>({
  customer: null,
  loading: false,
  loginCustomer: () => {},
  logoutCustomer: () => {},
})

export const useCustomerAuth = () => useContext(CustomerAuthContext)

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aacoolpoint_customer')
      if (saved) {
        setCustomer(JSON.parse(saved))
      }
    } catch {}
    setLoading(false)
  }, [])

  const loginCustomer = (phone: string, name?: string, email?: string) => {
    const cleanDigits = phone.replace(/\D/g, '')
    const c: CustomerUser = {
      id: `cust_${cleanDigits}`,
      name: (name || '').trim() || 'Valued Customer',
      phone: phone.trim(),
      email: email?.trim(),
    }
    localStorage.setItem('aacoolpoint_customer', JSON.stringify(c))
    setCustomer(c)
  }

  const logoutCustomer = () => {
    localStorage.removeItem('aacoolpoint_customer')
    setCustomer(null)
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, loginCustomer, logoutCustomer }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}
