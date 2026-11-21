# AA COOL POINT – Complete Premium 3D Business Website

A production-ready, premium 3D business website and dynamic administrative management platform for **AA COOL POINT**, Karanthaneri, Tamil Nadu, India.

---

## 🌟 Business Overview

- **Business Name:** AA COOL POINT
- **Tagline:** *"Cooling Comfort. Trusted Service."*
- **Hero Tagline:** *"Experience Perfect Cooling. Live Better."*
- **Location:** Karanthaneri, Tamil Nadu, India
- **Core Offerings:**
  - Air Conditioner Sales, Installation, Deep Cleaning & Repair
  - Refrigerator Sales, Compressor Diagnostics & Gas Refill
  - Washing Machine Sales, Drum/Motor Servicing & Maintenance

---

## 🚀 Technology Stack

### Frontend
- **React.js 19** with **TypeScript** & **Vite**
- **Tailwind CSS v4** (Glassmorphism, futuristic dark & clean light themes)
- **Three.js** & **@react-three/fiber**, **@react-three/drei** (Procedural, high-performance 3D Air Conditioner, Double Door Refrigerator, and Washing Machine models with interactive cooling particle streams)
- **Framer Motion** & **GSAP** (Smooth scroll transitions, floating effects, and interactive UI animations)
- **Lucide React** (Vector icons)
- **React Router DOM v7** (Nested layouts, lazy-loaded public and admin routes)
- **React Hook Form** + **Zod** (Client-side validation)
- **React Hot Toast** (Instant user feedback)
- **React Helmet Async** (Dynamic SEO metadata & LocalBusiness Schema.org JSON-LD)

### Backend & Cloud Architecture (Firebase)
- **Firebase Project ID:** `aacoolpoint-1d1c1`
- **Cloud Firestore:** Relational-like NoSQL collections for products, services, categories, bookings, reviews, websiteSettings, and audit logs
- **Firebase Authentication:** Email/password login with custom claims authorization
- **Firebase Storage:** Multi-image upload buckets with path and MIME validation
- **Firebase Hosting:** Single-page-application rewriting and SSL deployment

---

## 🛡️ Security Architecture

### 1. Firebase Admin Custom Claims
Admin authentication enforces custom user claims `{ admin: true }`. Client-side localStorage or arbitrary Firestore fields are **never** trusted alone.

To provision an admin account:
```bash
# 1. Place your Firebase service account key in the project root:
#    f:\aa_cool_point\serviceAccountKey.json

# 2. Run the admin provisioning script:
node scripts/set-admin.cjs admin@aacoolpoint.com [optional-temp-password]
```

### 2. Firestore Security Rules (`firestore.rules`)
- **Public Users:**
  - Can read active products (`isActive == true`)
  - Can read active services (`isActive == true`)
  - Can read categories
  - Can read approved customer reviews
  - Can read published gallery photos
  - Can read public website settings
  - Can create validated booking requests (`isValidEnquiry()`)
  - **Cannot** update or delete any data
- **Admins (`request.auth.token.admin == true`):**
  - Full CRUD across products, services, categories, bookings, reviews, gallery, and settings
  - Access to internal admin notes and activity audit logs

### 3. Firebase Storage Security Rules (`storage.rules`)
- Validates JPEG, PNG, and WebP image uploads up to 5 MB
- Enforces admin-only writes and deletes for products, services, gallery, and settings folders
- Protects customer booking attachment directories

---

## 📂 Project Structure

```
aa_cool_point/
├── firestore.rules          # Production Firestore security rules
├── storage.rules            # Production Storage security rules
├── firebase.json            # Hosting & rules deployment configuration
├── .env                     # Firebase project credentials
├── .env.example             # Template environment variables
├── scripts/
│   └── set-admin.cjs        # Firebase Admin SDK custom claim script
├── public/
│   ├── robots.txt           # Search crawler directives
│   └── sitemap.xml          # Search engine sitemap
└── src/
    ├── types/               # TypeScript data interfaces
    ├── firebase/            # Firebase config, auth, firestore, storage helpers
    ├── context/             # AuthContext and SettingsContext
    ├── utils/               # Formatting, slug generators, seed data
    ├── components/
    │   ├── common/          # ImageUploader, LoadingScreen, ProtectedRoute, WhatsAppFloat
    │   ├── hero/            # 3D Appliance Hero Section with Three.js
    │   ├── layout/          # Layout, AdminLayout, Footer
    │   └── navigation/      # Navbar
    ├── pages/               # Home, About, Products, ProductDetails, Services, ServiceDetails, Gallery, Contact, BookService, NotFound
    └── admin/               # AdminLogin, Dashboard, ProductsManagement, ProductForm, ServicesManagement, ServiceForm, BookingsManagement, ReviewsManagement, GalleryManagement, WebsiteSettings, CategoriesManagement
```

---

## 💻 Running the Application

### 1. Development Server
```bash
npm run dev
```

### 2. Production Build
```bash
npm run build
```

### 3. Initialize Demo Data
1. Navigate to `/admin/login` and log into the admin dashboard.
2. Click **"Initialize Demo Data"** on the Dashboard.
3. The platform will automatically populate realistic Daikin, LG, and Samsung appliances, certified services (gas refill, jet cleaning, installation), reviews, and Karanthaneri business contact coordinates!
