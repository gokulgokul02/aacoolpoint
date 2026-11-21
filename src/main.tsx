import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#071426',
              color: '#fff',
              border: '1px solid rgba(22, 119, 255, 0.3)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#00D9FF', secondary: '#071426' },
            },
            error: {
              iconTheme: { primary: '#FF4D4F', secondary: '#fff' },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
