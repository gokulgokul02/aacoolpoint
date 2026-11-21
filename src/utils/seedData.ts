import {
  collection, doc, setDoc, writeBatch, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const sampleProducts = [
  {
    id: 'prod-ac-1',
    name: '1.5 Ton 5 Star Inverter Split AC',
    slug: 'daikin-1-5-ton-5-star-inverter-split-ac',
    brand: 'Daikin',
    modelNumber: 'FTKM50U',
    categoryId: 'cat-ac',
    categoryName: 'Air Conditioners',
    shortDescription: 'High energy efficiency with copper condenser and PM 2.5 filter.',
    description: 'Experience ultra-fast cooling even at 52°C ambient temperatures. Features Neo Swing Inverter Compressor, 3D Airflow, and Titanium Apatite filter.',
    originalPrice: 48990,
    sellingPrice: 42990,
    discount: 12,
    condition: 'new' as const,
    stock: 6,
    warranty: '1 Year on Product, 10 Years on Compressor',
    specifications: {
      'Capacity': '1.5 Ton',
      'Star Rating': '5 Star',
      'Cooling Technology': 'Inverter Rotary',
      'Condenser Coil': '100% Copper',
      'Refrigerant': 'R32 Eco-Friendly'
    },
    images: [],
    primaryImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-fridge-1',
    name: '260L Double Door Frost Free Refrigerator',
    slug: 'lg-260l-double-door-frost-free-refrigerator',
    brand: 'LG',
    modelNumber: 'GL-S292RDSX',
    categoryId: 'cat-fridge',
    categoryName: 'Refrigerators',
    shortDescription: 'Smart Inverter Compressor with Multi Air Flow and Door Cooling+.',
    description: 'Even cooling from front to back. Moist Balance Crisper maintains optimal humidity for fresh vegetables all week long.',
    originalPrice: 32990,
    sellingPrice: 28490,
    discount: 14,
    condition: 'new' as const,
    stock: 4,
    warranty: '1 Year Comprehensive, 10 Years on Smart Inverter',
    specifications: {
      'Capacity': '260 Litres',
      'Door Type': 'Double Door',
      'Defrosting': 'Frost Free',
      'Star Rating': '3 Star',
      'Shelves': 'Toughened Glass'
    },
    images: [],
    primaryImage: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-wm-1',
    name: '7.5 Kg Fully Automatic Front Load Washing Machine',
    slug: 'samsung-7-5kg-fully-automatic-front-load-washing-machine',
    brand: 'Samsung',
    modelNumber: 'WW75T502DAW',
    categoryId: 'cat-wm',
    categoryName: 'Washing Machines',
    shortDescription: 'EcoBubble technology with Hygiene Steam and Digital Inverter motor.',
    description: 'Gentle on clothes while thoroughly cleaning fabrics at lower temperatures. Features Diamond Drum and silent operation.',
    originalPrice: 38900,
    sellingPrice: 33490,
    discount: 14,
    condition: 'new' as const,
    stock: 5,
    warranty: '3 Years on Machine, 10 Years on Motor',
    specifications: {
      'Capacity': '7.5 KG',
      'Loading Type': 'Front Load',
      'Max Spin Speed': '1200 RPM',
      'Steam Function': 'Hygiene Steam',
      'Energy Rating': '5 Star'
    },
    images: [],
    primaryImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export const sampleServices = [
  {
    id: 'srv-ac-install',
    title: 'Split AC Installation & Core Drilling',
    slug: 'split-ac-installation-core-drilling',
    categoryId: 'cat-ac-srv',
    categoryName: 'AC Services',
    shortDescription: 'Precision mounting, copper piping vacuum test, and refrigerant pressure setup.',
    description: 'Complete indoor and outdoor unit mounting with heavy-duty brackets, nitrogen leak testing, vacuumization, and live performance check.',
    price: 1500,
    offerPrice: 1299,
    duration: '2 - 3 Hours',
    warranty: '60 Days Installation Warranty',
    benefits: [
      'Vibration-damped bracket mounting',
      'Vacuum test to eliminate moisture in lines',
      'Airflow and temperature differential verification',
      'Site cleanup and customer walkthrough'
    ],
    images: [{ url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80', path: '', alt: 'AC Installation', order: 0 }],
    featured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'srv-ac-gas',
    title: 'AC Gas Refilling & Nitrogen Leak Test',
    slug: 'ac-gas-refilling-nitrogen-leak-test',
    categoryId: 'cat-ac-srv',
    categoryName: 'AC Services',
    shortDescription: '100% pure R32/R410A gas top-up or full refill with leak welding.',
    description: 'Restores rapid ice-cold cooling. Includes complete leak detection at copper flare joints, condenser coil brazing if needed, and precision weight-based refrigerant charging.',
    price: 2500,
    offerPrice: 2200,
    duration: '1.5 - 2 Hours',
    warranty: '90 Days Gas Guarantee',
    benefits: [
      'Electronic leak detector test',
      'Digital manifold pressure readout',
      'High purity virgin refrigerant only',
      'Amperage and cooling delta confirmation'
    ],
    images: [{ url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', path: '', alt: 'AC Gas Refill', order: 0 }],
    featured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'srv-ac-deep',
    title: 'Power Jet AC Deep Cleaning Service',
    slug: 'power-jet-ac-deep-cleaning-service',
    categoryId: 'cat-ac-srv',
    categoryName: 'AC Services',
    shortDescription: 'High-pressure wash of cooling coil, blower wheel, drain tray, and filters.',
    description: 'Eliminates mold, bad odor, and dust buildup that throttles airflow and increases power bills. Restores maximum CFM cooling efficiency.',
    price: 799,
    offerPrice: 599,
    duration: '45 - 60 Minutes',
    warranty: '30 Days Fresh Air Guarantee',
    benefits: [
      'Protective jacket to prevent water spillage',
      'Antimicrobial coil foaming wash',
      'Drain line flush to prevent water dripping',
      'Outdoor condenser fins wash'
    ],
    images: [{ url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80', path: '', alt: 'Jet Service', order: 0 }],
    featured: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 'srv-fridge-repair',
    title: 'Refrigerator Cooling & Compressor Diagnostics',
    slug: 'refrigerator-cooling-compressor-diagnostics',
    categoryId: 'cat-fridge-srv',
    categoryName: 'Refrigerator Services',
    shortDescription: 'Expert fix for not cooling, excessive ice buildup, relay or thermostat failures.',
    description: 'Comprehensive diagnosis for single, double door, and inverter refrigerators. We fix gas chokes, defrost heaters, sensors, and PCB boards.',
    price: 499,
    offerPrice: 399,
    duration: '1 - 2 Hours',
    warranty: '60 Days Repair Warranty',
    benefits: [
      'Component level diagnosis',
      'Original brand relays and capacitors',
      'Thermostat calibration',
      'Door gasket air-tightness test'
    ],
    images: [{ url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80', path: '', alt: 'Fridge Repair', order: 0 }],
    featured: true,
    isActive: true,
    displayOrder: 4,
  },
  {
    id: 'srv-wm-repair',
    title: 'Washing Machine Drum & Motor Overhaul',
    slug: 'washing-machine-drum-motor-overhaul',
    categoryId: 'cat-wm-srv',
    categoryName: 'Washing Machine Services',
    shortDescription: 'Fixes loud spin noise, water drainage blockages, vibration, and PCB errors.',
    description: 'Doorstep repair for front load and top load machines. We replace worn-out spider arms, shock absorbers, drain pumps, and repair drive motors.',
    price: 599,
    offerPrice: 499,
    duration: '1 - 2 Hours',
    warranty: '90 Days Guarantee on Spares',
    benefits: [
      'Drum bearing and seal check',
      'Drain valve clearing',
      'Spin speed balance testing',
      'Machine leveling and anti-vibration setup'
    ],
    images: [{ url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80', path: '', alt: 'Washing Machine Repair', order: 0 }],
    featured: true,
    isActive: true,
    displayOrder: 5,
  }
]

export const sampleCategories = [
  { id: 'cat-ac', name: 'Air Conditioners', slug: 'air-conditioners', type: 'product' as const, icon: '❄️', displayOrder: 1, description: 'Split, Window, Inverter ACs', isActive: true },
  { id: 'cat-fridge', name: 'Refrigerators', slug: 'refrigerators', type: 'product' as const, icon: '🧊', displayOrder: 2, description: 'Single & Double Door Refrigerators', isActive: true },
  { id: 'cat-wm', name: 'Washing Machines', slug: 'washing-machines', type: 'product' as const, icon: '🫧', displayOrder: 3, description: 'Front & Top Load Washing Machines', isActive: true },
  { id: 'cat-ac-srv', name: 'AC Services', slug: 'ac-services', type: 'service' as const, icon: '❄️', displayOrder: 1, description: 'Installation, Repair, Cleaning', isActive: true },
  { id: 'cat-fridge-srv', name: 'Refrigerator Services', slug: 'refrigerator-services', type: 'service' as const, icon: '🧊', displayOrder: 2, description: 'Gas refill, Cooling issues, Compressor repair', isActive: true },
  { id: 'cat-wm-srv', name: 'Washing Machine Services', slug: 'washing-machine-services', type: 'service' as const, icon: '🫧', displayOrder: 3, description: 'Motor, PCB, Drum maintenance', isActive: true },
]

export const sampleBookings = [
  {
    id: 'BK-DEMO-101',
    customerName: 'M. Senthilkumar',
    phone: '9842112345',
    email: 'senthil@gmail.com',
    applianceType: 'Air Conditioner',
    serviceId: 'srv-ac-install',
    serviceName: 'Split AC Installation & Core Drilling',
    preferredDate: '2024-11-25',
    preferredTime: '10:00 AM - 12:00 PM',
    address: '14, Middle Street, Karanthaneri, Tirunelveli',
    description: 'Need installation for newly purchased Daikin 1.5 ton AC on 1st floor bedroom.',
    status: 'new' as const,
    adminNotes: 'Contacted customer, assigned technician Siva.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'BK-DEMO-102',
    customerName: 'A. Kalyanasundaram',
    phone: '9443298765',
    email: '',
    applianceType: 'Refrigerator',
    serviceId: 'srv-fridge-repair',
    serviceName: 'Refrigerator Cooling & Compressor Diagnostics',
    preferredDate: '2024-11-26',
    preferredTime: '02:00 PM - 04:00 PM',
    address: 'Near Pillayar Kovil, Karanthaneri',
    description: 'Double door fridge bottom compartment is not cooling, compressor making clicking noise.',
    status: 'in-progress' as const,
    adminNotes: 'Relay replacement required.',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  }
]

export const sampleReviews = [
  {
    id: 'rev-1',
    customerName: 'K. Rajasekaran',
    rating: 5,
    review: 'Excellent AC installation done in our home at Karanthaneri. The technician was punctual, very polite, and did thorough vacuum testing. Highly recommended!',
    date: 'Oct 2024',
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'rev-2',
    customerName: 'M. Selvi',
    rating: 5,
    review: 'My double door refrigerator was not cooling for 2 days. AA COOL POINT team arrived within 3 hours, replaced the faulty sensor, and it is working like brand new.',
    date: 'Nov 2024',
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'rev-3',
    customerName: 'P. Anthony',
    rating: 5,
    review: 'Very transparent pricing for AC gas filling. They showed the digital pressure gauge readings before and after filling. Cooling is super fast now.',
    date: 'Nov 2024',
    isApproved: true,
    isActive: true,
    createdAt: new Date(),
  }
]

export async function seedInitialDatabase() {
  const batch = writeBatch(db)

  // 1. Website Settings
  const settingsRef = doc(db, 'websiteSettings', 'main')
  batch.set(settingsRef, {
    businessName: 'AA COOL POINT',
    tagline: 'Cooling Comfort. Trusted Service.',
    phone: '+91 79049 76502',
    whatsapp: '+917904976502',
    email: 'contact@aacoolpoint.com',
    address: 'Main Road, Karanthaneri, Tirunelveli District, Tamil Nadu 627117, India',
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15764.721245781358!2d77.68!3d8.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04397cf1e4a137%3A0x6b7cfd51cfeb8254!2sKaranthaneri%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    openingHours: 'Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 2:00 PM',
    about: 'AA COOL POINT is Karanthaneri’s premier air conditioning repair service and home appliance centre. We deliver rapid, reliable doorstep maintenance, authentic spare replacements, and top-tier new appliance sales across the region.',
    heroTitle: 'SMART COOLING. BETTER LIVING.',
    heroDescription: 'Your trusted destination in Karanthaneri for Air Conditioners, Refrigerators, and Washing Machines. Authentic products and certified home appliance services.',
    seoTitle: 'AA COOL POINT – AC Sales, Service & Repair | Karanthaneri, Tamil Nadu',
    seoDescription: 'Leading AC repair, gas refilling, refrigerator and washing machine repair in Karanthaneri. Quality appliance sales with doorstep service.',
    logoUrl: '',
    faviconUrl: '',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://www.youtube.com/@AbelRaja119',
    footerText: '© 2024 AA COOL POINT. All rights reserved. Karanthaneri, Tamil Nadu, India.',
  }, { merge: true })

  // 2. Categories
  sampleCategories.forEach(c => {
    const ref = doc(db, 'categories', c.id)
    batch.set(ref, { ...c, isActive: true, createdAt: serverTimestamp() }, { merge: true })
  })

  // 3. Initial Sample Products
  sampleProducts.forEach(p => {
    const ref = doc(db, 'products', p.id)
    batch.set(ref, { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
  })

  // 4. Initial Sample Services
  sampleServices.forEach(s => {
    const ref = doc(db, 'services', s.id)
    batch.set(ref, { ...s, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
  })

  // 5. Initial Reviews
  sampleReviews.forEach(r => {
    const ref = doc(db, 'reviews', r.id)
    batch.set(ref, { ...r, createdAt: serverTimestamp() }, { merge: true })
  })

  await batch.commit()
}

