import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import { SettingsProvider } from './context/SettingsContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingScreen from './components/common/LoadingScreen'
import WhatsAppFloat from './components/common/WhatsAppFloat'

// Public pages - lazy loaded
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const BookService = lazy(() => import('./pages/BookService'))
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const ProductsManagement = lazy(() => import('./admin/ProductsManagement'))
const ProductForm = lazy(() => import('./admin/ProductForm'))
const ServicesManagement = lazy(() => import('./admin/ServicesManagement'))
const ServiceForm = lazy(() => import('./admin/ServiceForm'))
const BookingsManagement = lazy(() => import('./admin/BookingsManagement'))
const ReviewsManagement = lazy(() => import('./admin/ReviewsManagement'))
const GalleryManagement = lazy(() => import('./admin/GalleryManagement'))
const WebsiteSettings = lazy(() => import('./admin/WebsiteSettings'))
const CategoriesManagement = lazy(() => import('./admin/CategoriesManagement'))

export default function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <SettingsProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:slug" element={<ProductDetails />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:slug" element={<ServiceDetails />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="book-service" element={<BookService />} />
                <Route path="customer-login" element={<CustomerLogin />} />
                <Route path="my-bookings" element={<MyBookings />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="services" element={<ServicesManagement />} />
                <Route path="services/add" element={<ServiceForm />} />
                <Route path="services/edit/:id" element={<ServiceForm />} />
                <Route path="bookings" element={<BookingsManagement />} />
                <Route path="reviews" element={<ReviewsManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="settings" element={<WebsiteSettings />} />
              </Route>
            </Routes>
          </Suspense>

          {/* Floating WhatsApp Button - appears on all public pages */}
          <WhatsAppFloat />
        </SettingsProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  )
}
