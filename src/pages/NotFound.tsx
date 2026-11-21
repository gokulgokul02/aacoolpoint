import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 – Page Not Found | AA COOL POINT</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-24px) rotate(8deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-6deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.08); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes drift {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }
        .float-1 { animation: float1 6s ease-in-out infinite; }
        .float-2 { animation: float2 8s ease-in-out infinite; }
        .float-3 { animation: float3 5s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .drift { animation: drift 3s ease-in-out infinite alternate; }
      `}</style>

      <div className="min-h-screen bg-[#071426] flex items-center justify-center relative overflow-hidden px-4">

        {/* ── Animated Background Orbs ───────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large orb – top left */}
          <div
            className="float-1 absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #1677FF, transparent)' }}
          />
          {/* Large orb – bottom right */}
          <div
            className="float-2 absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #00D9FF, transparent)' }}
          />
          {/* Small floating emoji snowflake */}
          <div className="float-3 absolute top-20 right-10 text-5xl opacity-10 select-none">❄️</div>
          <div className="float-1 absolute bottom-24 left-10 text-4xl opacity-10 select-none">🌡️</div>
          <div className="float-2 absolute top-1/3 left-5 text-3xl opacity-10 select-none">💨</div>

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(rgba(22,119,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(22,119,255,0.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <div className="relative z-10 text-center max-w-lg mx-auto">

          {/* Pulse ring behind 404 */}
          <div className="relative inline-block mb-6">
            <div
              className="pulse-ring absolute inset-0 rounded-full border-2 border-[#1677FF]/40"
              style={{ top: '-10px', left: '-10px', right: '-10px', bottom: '-10px' }}
            />

            {/* 404 Text */}
            <h1
              className="font-black select-none drift"
              style={{
                fontSize: 'clamp(100px, 20vw, 160px)',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #1677FF 0%, #00D9FF 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 40px rgba(22,119,255,0.3))',
              }}
            >
              404
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
            Page Not Found
          </h2>

          {/* Message */}
          <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed">
            Looks like this page went on a cooling break and never came back.
            <br />
            Let us help you find what you're looking for.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#1677FF]/40" />
            <span className="text-[#00D9FF] text-xl">❄</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#1677FF]/40" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/40 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#00D9FF]/50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 text-[#00D9FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-12 text-gray-600 text-xs">
            AA COOL POINT · Karanthaneri, Tamil Nadu
          </p>
        </div>
      </div>
    </>
  )
}

export default NotFound
