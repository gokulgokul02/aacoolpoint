import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react'
import { loginAdmin } from '../firebase/auth'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@aacoolpoint.com',
      password: 'Admin@123456',
    }
  })

  const fillCredentials = () => {
    setValue('email', 'admin@aacoolpoint.com')
    setValue('password', 'Admin@123456')
  }

  // If already logged in as admin, redirect to dashboard
  if (!authLoading && user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitting(true)
      setAuthError(null)
      await login(data.email, data.password)
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      const msg = err.message || 'Invalid credentials or non-admin account.'
      setAuthError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Portal Login | AA COOL POINT</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Futuristic glowing backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,119,255,0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,217,255,0.1)_0%,transparent_50%)]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/40 text-white">
            
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#00D9FF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1677FF]/40">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h1 className="text-2xl font-black font-display tracking-wider">
                AA COOL POINT
              </h1>
              <p className="text-xs text-[#00D9FF] uppercase tracking-widest mt-1 font-semibold">
                Administrative Control Panel
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs">
                <ShieldAlert size={18} className="flex-shrink-0 text-red-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="mb-4 p-3 rounded-xl bg-[#1677FF]/20 border border-[#1677FF]/40 text-xs">
              <div className="text-[#00D9FF] font-bold mb-1 flex items-center justify-between">
                <span>Default Admin Credentials:</span>
                <button
                  type="button"
                  onClick={fillCredentials}
                  className="text-[10px] underline hover:text-white"
                >
                  Auto-fill
                </button>
              </div>
              <div className="text-gray-300 text-[11px] font-mono">Email: admin@aacoolpoint.com</div>
              <div className="text-gray-300 text-[11px] font-mono">Password: Admin@123456</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@aacoolpoint.com"
                    {...register('email')}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF] transition-colors"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF] transition-colors"
                  />
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#00D9FF] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#1677FF]/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate & Access</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center text-[11px] text-gray-400">
              Restricted to authorized personnel. Protected by Firebase Custom Claims security rules.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

