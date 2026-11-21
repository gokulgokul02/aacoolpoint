/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#071426',
          50: '#e8eef7',
          100: '#c5d4e9',
          200: '#9fb8d9',
          300: '#789bc9',
          400: '#5a85be',
          500: '#3d6eb2',
          600: '#3360a0',
          700: '#264e88',
          800: '#1a3c70',
          900: '#071426',
        },
        electric: {
          DEFAULT: '#1677FF',
          50: '#e8f1ff',
          100: '#c5d8ff',
          200: '#9fbdff',
          300: '#78a1ff',
          400: '#578eff',
          500: '#1677FF',
          600: '#0062e6',
          700: '#004ecc',
          800: '#003bb3',
          900: '#001a80',
        },
        cyan: {
          DEFAULT: '#00D9FF',
          50: '#e0fbff',
          100: '#b3f5ff',
          200: '#80efff',
          300: '#4de9ff',
          400: '#26e4ff',
          500: '#00D9FF',
          600: '#00c2e6',
          700: '#00a8cc',
          800: '#008eb3',
          900: '#005f80',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #071426 0%, #0a1f3d 50%, #071426 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,217,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,217,255,0.6)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

