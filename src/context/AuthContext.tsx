import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getAdminClaim, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS } from '../firebase/auth'

export interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  isAdmin: boolean
}

interface AuthContextType {
  user: User | AdminUser | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, pass: string) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | AdminUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check local admin session in localStorage / sessionStorage
    const saved = localStorage.getItem('aacoolpoint_admin_auth') || sessionStorage.getItem('aacoolpoint_admin_auth')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.isAdmin) {
          setUser(parsed)
          setIsAdmin(true)
          setLoading(false)
          return
        }
      } catch {}
    }

    // 2. Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let isAdm = false
        try {
          const hasClaim = await getAdminClaim(firebaseUser)
          isAdm = hasClaim || (firebaseUser.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase())
        } catch {
          isAdm = firebaseUser.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()
        }

        if (isAdm) {
          const adminObj: AdminUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Administrator',
            isAdmin: true,
          }
          localStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
          sessionStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
          setUser(adminObj)
          setIsAdmin(true)
        } else {
          setUser(firebaseUser)
          setIsAdmin(false)
        }
      } else {
        const local = localStorage.getItem('aacoolpoint_admin_auth') || sessionStorage.getItem('aacoolpoint_admin_auth')
        if (local) {
          try {
            const p = JSON.parse(local)
            if (p?.isAdmin) {
              setUser(p)
              setIsAdmin(true)
              setLoading(false)
              return
            }
          } catch {}
        }
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, pass: string) => {
    const normalized = email.trim().toLowerCase()

    // Built-in Administrator credentials
    if (normalized === DEFAULT_ADMIN_EMAIL.toLowerCase() && pass === DEFAULT_ADMIN_PASS) {
      const adminObj: AdminUser = {
        uid: 'admin-master-uid',
        email: DEFAULT_ADMIN_EMAIL,
        displayName: 'AA Cool Point Administrator',
        isAdmin: true,
      }
      localStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
      sessionStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
      setUser(adminObj)
      setIsAdmin(true)
      setLoading(false)
      return adminObj
    }

    // Firebase Auth attempt
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass)
      let isAdm = false
      try {
        const idTokenResult = await res.user.getIdTokenResult(true)
        isAdm = !!idTokenResult.claims.admin || (res.user.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase())
      } catch {
        isAdm = res.user.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()
      }

      if (!isAdm) {
        await signOut(auth)
        throw new Error('Access denied: Account lacks admin authorization privileges.')
      }

      const adminObj: AdminUser = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || 'Administrator',
        isAdmin: true,
      }
      localStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
      sessionStorage.setItem('aacoolpoint_admin_auth', JSON.stringify(adminObj))
      setUser(adminObj)
      setIsAdmin(true)
      setLoading(false)
      return adminObj
    } catch (err: any) {
      if (err.message && err.message.includes('Access denied')) throw err
      throw new Error('Invalid credentials. Please use the official admin login details.')
    }
  }

  const logout = async () => {
    localStorage.removeItem('aacoolpoint_admin_auth')
    sessionStorage.removeItem('aacoolpoint_admin_auth')
    setUser(null)
    setIsAdmin(false)
    try {
      await signOut(auth)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
