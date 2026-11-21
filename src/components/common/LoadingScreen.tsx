import React from 'react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071426] select-none">
      {/* Glow background */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#1677FF]/20 to-[#00D9FF]/20 blur-3xl pointer-events-none" />

      {/* Central Round Logo with Animated Spinning Ring */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <span className="absolute -inset-3 rounded-full border-2 border-[#00D9FF]/30 animate-ping" style={{ animationDuration: '2s' }} />

        {/* Spinning border ring */}
        <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#00D9FF] animate-spin" style={{ animationDuration: '8s' }} />

        {/* White rounded circle container for the logo */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-2xl shadow-[#1677FF]/50 flex items-center justify-center p-1.5 overflow-hidden border-2 border-white">
          <img
            src="/logo.png"
            alt="AA COOL POINT Logo"
            className="w-full h-full object-contain rounded-full"
            onError={e => {
              const t = e.currentTarget as HTMLImageElement
              t.style.display = 'none'
              const parent = t.parentElement!
              parent.classList.add('bg-gradient-to-br', 'from-[#1677FF]', 'to-[#00D9FF]')
              parent.innerHTML = '<span class="text-white font-black text-2xl tracking-tight">AA</span>'
            }}
          />
        </div>
      </div>

      {/* Brand name */}
      <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wider bg-gradient-to-r from-white via-[#00D9FF] to-white bg-clip-text text-transparent animate-pulse">
        AA COOL POINT
      </h1>
      <p className="mt-1 text-xs text-[#00D9FF]/80 font-medium tracking-[0.25em] uppercase">
        Cooling Comfort • Trusted Service
      </p>

      {/* Subtle loader dots */}
      <div className="flex gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}
