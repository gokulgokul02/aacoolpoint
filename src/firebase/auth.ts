import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth } from './config'

export const DEFAULT_ADMIN_EMAIL = 'admin@aacoolpoint.com'
export const DEFAULT_ADMIN_PASS = 'Admin@123456'

export const loginAdmin = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase()

  // 1. Check if default credentials match
  if (normalizedEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASS) {
    sessionStorage.setItem('aacoolpoint_admin_auth', JSON.stringify({
      email: DEFAULT_ADMIN_EMAIL,
      displayName: 'AA Cool Point Administrator',
      uid: 'admin-master-uid',
      isAdmin: true,
      timestamp: Date.now()
    }))
    return {
      user: {
        email: DEFAULT_ADMIN_EMAIL,
        displayName: 'AA Cool Point Administrator',
        uid: 'admin-master-uid',
      }
    }
  }

  // 2. Otherwise try Firebase Authentication
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const idTokenResult = await result.user.getIdTokenResult(true)
    if (!idTokenResult.claims.admin) {
      // If user exists in Firebase but claim isn't set yet, check if admin email
      if (result.user.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL) {
        return result
      }
      await signOut(auth)
      throw new Error('Access denied: Account lacks admin authorization privileges.')
    }
    return result
  } catch (err: any) {
    if (err.message && err.message.includes('Access denied')) throw err
    throw new Error('Invalid credentials. Please use the official admin login details.')
  }
}

export const logoutAdmin = async () => {
  sessionStorage.removeItem('aacoolpoint_admin_auth')
  try {
    await signOut(auth)
  } catch {}
}

export const onAuthChange = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)

export const getAdminClaim = async (user: User): Promise<boolean> => {
  try {
    if (user.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL) return true
    const idTokenResult = await user.getIdTokenResult(true)
    return !!idTokenResult.claims.admin
  } catch {
    return false
  }
}

