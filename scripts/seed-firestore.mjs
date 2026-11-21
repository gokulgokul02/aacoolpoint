// Seed script: pushes all sample data to Firestore
// Run with: node scripts/seed-firestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAzPeODGXsuRUCjtk_VXHAUl-a2nxoSGqI',
  authDomain: 'aacoolpoint-1d1c1.firebaseapp.com',
  projectId: 'aacoolpoint-1d1c1',
  storageBucket: 'aacoolpoint-1d1c1.firebasestorage.app',
  messagingSenderId: '874567477461',
  appId: '1:874567477461:web:f9c814921f39a9f3fc1a5c',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Categories ──────────────────────────────────────────────────────
const categories = [
  { id: 'cat-ac',    name: 'Air Conditioners',  slug: 'air-conditioners',  type: 'product', icon: '❄️', displayOrder: 1, description: 'Split, Window & Inverter ACs', isActive: true },
  { id: 'cat-fridge',name: 'Refrigerators',      slug: 'refrigerators',     type: 'product', icon: '🧊', displayOrder: 2, description: 'Double door & single door fridges', isActive: true },
  { id: 'cat-wm',    name: 'Washing Machines',   slug: 'washing-machines',  type: 'product', icon: '🫧', displayOrder: 3, description: 'Front-load & top-load washers', isActive: true },
  { id: 'svc-ac',   name: 'AC Services',          slug: 'ac-services',       type: 'service', icon: '❄️', displayOrder: 1, description: 'AC repair and installation', isActive: true },
  { id: 'svc-fridge',name: 'Refrigerator Services',slug:'refrigerator-services',type:'service',icon:'🧊',displayOrder:2,description:'Fridge repair',isActive:true},
  { id: 'svc-wm',   name: 'Washing Machine Services',slug:'washing-machine-services',type:'service',icon:'🫧',displayOrder:3,description:'Washing machine repair',isActive:true},
];

// ── Products ────────────────────────────────────────────────────────
const products = [
  {
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC',
    slug: 'daikin-15-ton-5-star-inverter-split-ac',
    brand: 'Daikin', modelNumber: 'FTKF50TV16U',
    categoryId: 'cat-ac', categoryName: 'Air Conditioners',
    description: 'Energy-efficient 5-star inverter split AC with auto-restart and anti-bacterial filter. Ideal for rooms up to 150 sq.ft. Available at AA COOL POINT Karanthaneri.',
    shortDescription: '1.5 Ton 5★ Inverter Split AC — Best cooling for Tirunelveli climate.',
    originalPrice: 45000, sellingPrice: 38999, discount: 13,
    condition: 'new', stock: 5, warranty: '1 Year Comprehensive + 5 Year Compressor',
    featured: true, isActive: true,
    specifications: { 'Capacity': '1.5 Ton', 'Star Rating': '5 Star', 'Type': 'Inverter Split', 'Cooling Capacity': '5100 W', 'Energy Consumption': '1210 W', 'Refrigerant': 'R-32' },
    images: [], primaryImage: '',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    name: 'LG 1 Ton 3 Star Window AC',
    slug: 'lg-1-ton-3-star-window-ac',
    brand: 'LG', modelNumber: 'LWA3BP3F',
    categoryId: 'cat-ac', categoryName: 'Air Conditioners',
    description: 'Powerful 1-ton window AC with auto clean function. Best for small rooms and shops. Available at AA COOL POINT.',
    shortDescription: '1 Ton 3★ Window AC — Budget-friendly for small spaces.',
    originalPrice: 28000, sellingPrice: 23499, discount: 16,
    condition: 'new', stock: 3, warranty: '1 Year Comprehensive + 5 Year Compressor',
    featured: false, isActive: true,
    specifications: { 'Capacity': '1 Ton', 'Star Rating': '3 Star', 'Type': 'Window', 'Refrigerant': 'R-22' },
    images: [], primaryImage: '',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    name: 'Samsung 253L Double Door Refrigerator',
    slug: 'samsung-253l-double-door-refrigerator',
    brand: 'Samsung', modelNumber: 'RT28T3932R3',
    categoryId: 'cat-fridge', categoryName: 'Refrigerators',
    description: 'Frost-free double door refrigerator with Digital Inverter Technology. All-round cooling keeps food fresh longer.',
    shortDescription: '253L Frost-Free Double Door — Digital Inverter Technology.',
    originalPrice: 32000, sellingPrice: 26499, discount: 17,
    condition: 'new', stock: 4, warranty: '1 Year + 10 Year Compressor',
    featured: true, isActive: true,
    specifications: { 'Capacity': '253 L', 'Type': 'Double Door', 'Technology': 'Frost Free', 'Color': 'Base Violet' },
    images: [], primaryImage: '',
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    name: 'LG 7kg Front Load Fully Automatic Washing Machine',
    slug: 'lg-7kg-front-load-fully-automatic',
    brand: 'LG', modelNumber: 'FHM1207SDL',
    categoryId: 'cat-wm', categoryName: 'Washing Machines',
    description: 'AI Direct Drive 7kg front-load washing machine with 6 Motion DD technology. Highly efficient with 1200 RPM spin speed.',
    shortDescription: '7 Kg Front Load — AI Direct Drive with 6 Motion Technology.',
    originalPrice: 38000, sellingPrice: 31499, discount: 17,
    condition: 'new', stock: 3, warranty: '2 Years Comprehensive + 10 Year Motor',
    featured: true, isActive: true,
    specifications: { 'Capacity': '7 Kg', 'Type': 'Front Load', 'Spin Speed': '1200 RPM', 'Energy Rating': '5 Star' },
    images: [], primaryImage: '',
    createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Services ────────────────────────────────────────────────────────
const services = [
  {
    title: 'AC Installation', slug: 'ac-installation',
    categoryId: 'svc-ac', categoryName: 'AC Services',
    shortDescription: 'Professional split/window AC installation by certified technicians at your doorstep.',
    description: 'Complete AC installation service including mounting of indoor and outdoor units, copper pipe fitting, electrical connections, gas charging and test run. Available in Karanthaneri, Tirunelveli and surrounding areas.',
    price: 1500, offerPrice: 1200,
    duration: '2–3 Hours', warranty: '30 Day Installation Warranty',
    benefits: ['Certified Technicians', 'All brands supported', 'Same-day service available', 'Doorstep across Tirunelveli'],
    featured: true, isActive: true, displayOrder: 1, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    title: 'AC Repair & Service', slug: 'ac-repair-service',
    categoryId: 'svc-ac', categoryName: 'AC Services',
    shortDescription: 'All brand AC repair — not cooling, gas leak, noisy unit, PCB issue & more.',
    description: 'Comprehensive AC repair and servicing for split, window and cassette ACs of all brands. Includes diagnosis, cleaning, gas refilling, compressor check and part replacement if needed.',
    price: 800, offerPrice: 599,
    duration: '1–2 Hours', warranty: '90 Day Service Warranty',
    benefits: ['Free diagnosis', 'All brands', 'Genuine spare parts', 'No hidden charges'],
    featured: true, isActive: true, displayOrder: 2, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    title: 'AC Gas Refilling (R-32 / R-22)', slug: 'ac-gas-refilling',
    categoryId: 'svc-ac', categoryName: 'AC Services',
    shortDescription: 'Genuine R-32 and R-22 refrigerant refilling for all AC brands.',
    description: 'Expert AC gas refilling service using genuine R-32 and R-22 refrigerants. We check for leaks first, then fill the correct amount for optimal cooling performance.',
    price: 1200, offerPrice: 999,
    duration: '45–60 Mins', warranty: '60 Day Gas Warranty',
    benefits: ['Leak check included', 'Genuine refrigerant', 'All brands', 'Pressure tested'],
    featured: false, isActive: true, displayOrder: 3, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    title: 'Refrigerator Repair', slug: 'refrigerator-repair',
    categoryId: 'svc-fridge', categoryName: 'Refrigerator Services',
    shortDescription: 'Expert fridge repair — not cooling, gas leak, thermostat, compressor & more.',
    description: 'Complete refrigerator repair for all brands including Samsung, LG, Whirlpool, Godrej. Covers compressor replacement, gas charging, thermostat and PCB repairs.',
    price: 700, offerPrice: 549,
    duration: '1–3 Hours', warranty: '90 Day Repair Warranty',
    benefits: ['Doorstep service', 'Genuine parts', 'All brands', 'Same day available'],
    featured: true, isActive: true, displayOrder: 4, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    title: 'Washing Machine Repair', slug: 'washing-machine-repair',
    categoryId: 'svc-wm', categoryName: 'Washing Machine Services',
    shortDescription: 'All brand washing machine repair — motor, drum, PCB, door lock & more.',
    description: 'Expert washing machine repair for front-load and top-load machines. Covers motor repair, drum service, PCB replacement, water pump and door issues.',
    price: 600, offerPrice: 499,
    duration: '1–2 Hours', warranty: '90 Day Repair Warranty',
    benefits: ['Doorstep service', 'Fully automatic & semi-auto', 'All brands', 'No fix no charge'],
    featured: true, isActive: true, displayOrder: 5, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    title: 'AC Deep Cleaning (Foam Wash)', slug: 'ac-deep-cleaning',
    categoryId: 'svc-ac', categoryName: 'AC Services',
    shortDescription: 'Deep foam wash AC service — improves cooling efficiency and air quality.',
    description: 'Professional AC deep cleaning using foam wash technique. Removes dust, bacteria and mold from indoor unit filter, coil and fan. Improves cooling by up to 20%.',
    price: 599, offerPrice: 449,
    duration: '45–60 Mins', warranty: '30 Day Service Warranty',
    benefits: ['Eco-friendly foam', 'Improves air quality', 'Reduces electricity bill', 'All brands'],
    featured: false, isActive: true, displayOrder: 6, images: [],
    createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Website Settings ─────────────────────────────────────────────────
const websiteSettings = {
  businessName: 'AA COOL POINT',
  tagline: 'Cooling Comfort. Trusted Service.',
  phone: '+91 79049 76502',
  whatsapp: '+917904976502',
  email: 'aacoolpoint@gmail.com',
  address: 'Karanthaneri, Tirunelveli, Tamil Nadu – 627 011',
  mapsUrl: '',
  openingHours: 'Mon–Sat: 9:00 AM – 7:00 PM',
  about: 'AA COOL POINT is your trusted destination for Air Conditioners, Refrigerators and Washing Machines in Karanthaneri, Tamil Nadu. Expert doorstep repair services across Tirunelveli and surrounding regions.',
  heroTitle: 'SMART COOLING. BETTER LIVING.',
  heroDescription: 'Your trusted destination in Karanthaneri for Air Conditioners, Refrigerators and Washing Machines. Certified doorstep repair services across Tirunelveli and surrounding regions.',
  seoTitle: 'AA COOL POINT – AC Sales & Service | Karanthaneri, Tirunelveli',
  seoDescription: 'AC repair, installation and sales in Karanthaneri. Refrigerator and washing machine services. Same-day doorstep service across Tirunelveli. Call +91 79049 76502.',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.svg',
  facebook: '',
  instagram: '',
  youtube: 'https://www.youtube.com/@AbelRaja119',
  footerText: '© AA COOL POINT. All Rights Reserved.',
};

// ── Seed Function ────────────────────────────────────────────────────
async function clearCollection(colName) {
  const snap = await getDocs(collection(db, colName));
  const deletes = snap.docs.map(d => deleteDoc(doc(db, colName, d.id)));
  await Promise.all(deletes);
  console.log(`  Cleared ${snap.docs.length} existing docs from ${colName}`);
}

async function seed() {
  console.log('\n🌱 Seeding Firestore for project: aacoolpoint-1d1c1\n');

  // Categories
  console.log('📂 Seeding categories...');
  for (const cat of categories) {
    const { id, ...data } = cat;
    await setDoc(doc(db, 'categories', id), { ...data, createdAt: new Date() });
  }
  console.log(`  ✅ ${categories.length} categories seeded`);

  // Products
  console.log('📦 Seeding products...');
  await clearCollection('products');
  for (const p of products) {
    await addDoc(collection(db, 'products'), p);
  }
  console.log(`  ✅ ${products.length} products seeded`);

  // Services
  console.log('🔧 Seeding services...');
  await clearCollection('services');
  for (const s of services) {
    await addDoc(collection(db, 'services'), s);
  }
  console.log(`  ✅ ${services.length} services seeded`);

  // Website Settings
  console.log('⚙️  Seeding website settings...');
  await setDoc(doc(db, 'websiteSettings', 'main'), { ...websiteSettings, updatedAt: new Date() });
  console.log('  ✅ Settings seeded');

  console.log('\n✅ All done! Firestore is seeded.\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
