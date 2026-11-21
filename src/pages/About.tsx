import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck as ShieldCheckIcon,
  Trophy as TrophyIcon,
  Clock as ClockIcon,
  ThumbsUp as HandThumbUpIcon,
  Phone as PhoneIcon,
  Wrench as WrenchScrewdriverIcon,
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const fadeIn: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
}

// ─── Why Choose Us Data ───────────────────────────────────────────────────────
const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Quality Service',
    description:
      'We use only genuine spare parts and follow manufacturer-approved procedures to ensure your appliance runs like new.',
  },
  {
    icon: TrophyIcon,
    title: 'Expert Technicians',
    description:
      'Our trained technicians handle all major brands of ACs, refrigerators and washing machines with precision and care.',
  },
  {
    icon: ClockIcon,
    title: 'Timely Support',
    description:
      'We respect your time. Our team responds promptly and completes most service calls on the same day.',
  },
  {
    icon: HandThumbUpIcon,
    title: 'Customer Satisfaction',
    description:
      'Your satisfaction is our priority. We follow up after every service to make sure everything is running perfectly.',
  },
]

// ─── Service Category Cards ───────────────────────────────────────────────────
const serviceCategories = [
  {
    emoji: '❄️',
    title: 'Air Conditioners',
    items: ['AC Installation', 'AC Repair & Service', 'Gas Refilling', 'AMC Plans'],
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    emoji: '🧊',
    title: 'Refrigerators',
    items: ['Compressor Repair', 'Gas Charging', 'Thermostat Replacement', 'General Service'],
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    emoji: '🫧',
    title: 'Washing Machines',
    items: ['Motor Repair', 'PCB Repair', 'Drum Service', 'All Brand Support'],
    gradient: 'from-indigo-600 to-blue-500',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
const About: React.FC = () => {
  const { settings } = useSettings()

  const phoneHref = settings.phone ? `tel:${settings.phone}` : '#'
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
    : '#'

  return (
    <>
      <Helmet>
        <title>About Us | AA COOL POINT – Karanthaneri & Tirunelveli Surroundings</title>
        <meta
          name="description"
          content="Learn about AA COOL POINT – based in Karanthaneri, offering AC, Refrigerator, and Washing Machine sales and doorstep repairs across Tirunelveli and surrounding regions."
        />
        <meta property="og:title" content="About AA COOL POINT" />
        <meta
          property="og:description"
          content="Trusted AC repair, refrigerator and washing machine services based in Karanthaneri, serving Tirunelveli and surrounding areas."
        />
      </Helmet>

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative bg-[#071426] text-white overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#1677FF] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#00D9FF] rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 md:pb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[#00D9FF] text-sm font-semibold tracking-widest uppercase mb-3"
            >
              <Link to="/" className="hover:underline">
                Home
              </Link>{' '}
              / About Us
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
            >
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#00D9FF]">
                AA COOL POINT
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              Your trusted partner for air conditioning, refrigerator and washing machine services
              in {settings.address ? settings.address.split(',')[0].trim() : 'Karanthaneri'}, Tamil Nadu.
            </motion.p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#F5F8FC]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F8FC] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1677FF] mb-3"
              >
                Our Story
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-[#071426] mb-6 leading-tight"
              >
                Cooling Comfort,{' '}
                <span className="text-[#1677FF]">Trusted Service</span>
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="space-y-4 text-gray-600 text-base leading-relaxed"
              >
                <p>
                  {settings.about || (
                    <>
                      <strong className="text-[#071426]">AA COOL POINT</strong> is a leading air
                      conditioning repair service and home appliance sales business based in{' '}
                      <strong className="text-[#071426]">{settings.address ? settings.address.split(',')[0].trim() : 'Karanthaneri'}</strong>, proudly serving{' '}
                      <strong className="text-[#071426]">Tirunelveli and all surrounding areas</strong>. We are
                      dedicated to providing high-quality AC installation, servicing, and repair
                      solutions to homes and businesses across the entire district.
                    </>
                  )}
                </p>
                <p>
                  Beyond air conditioners, we offer expert repair and maintenance services for{' '}
                  <strong className="text-[#071426]">refrigerators</strong> and{' '}
                  <strong className="text-[#071426]">washing machines</strong>, making us your
                  one-stop shop for all major home appliance needs.
                </p>
                <p>
                  Whether it's a routine AC service, a gas refill, a compressor repair, or a
                  washing machine motor fix — our technicians bring skill, genuine parts and a
                  commitment to getting the job done right, the first time.
                </p>
              </motion.div>

              {/* Stat placeholders */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 grid grid-cols-3 gap-3 sm:gap-4"
              >
                {[
                  { label: 'Years of Service', value: settings.yearsOfService || '10+' },
                  { label: 'Happy Customers', value: settings.happyCustomers || '2500+' },
                  { label: 'Brands Supported', value: settings.brandsSupported || '15+' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl p-3 sm:p-5 text-center shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                  >
                    <p className="text-xl sm:text-3xl font-black text-[#1677FF] font-display mb-1">{value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image / Gradient Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeIn}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Gradient placeholder – replace with actual image via admin */}
                <div className="bg-gradient-to-br from-[#071426] via-[#1677FF] to-[#00D9FF] h-80 md:h-96 flex flex-col items-center justify-center gap-4">
                  <WrenchScrewdriverIcon className="w-16 h-16 text-white/60" />
                  <p className="text-white/80 text-sm font-medium tracking-wide">
                    Shop / Service Photo
                  </p>
                  <p className="text-white/40 text-xs">[Upload via Admin → Gallery]</p>
                </div>
              </div>

              {/* Floating accent badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1677FF] to-[#00D9FF] flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#071426] font-bold text-sm">Genuine Parts</p>
                  <p className="text-gray-400 text-xs">Only authentic spares</p>
                </div>
              </div>

              {/* Top-right badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#1677FF] to-[#00D9FF] rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg leading-none">ALL</span>
                <span className="text-white/80 text-xs font-semibold leading-none">Brands</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1677FF] mb-3"
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-[#071426]"
            >
              What Sets Us Apart
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group bg-[#F5F8FC] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-100"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1677FF] to-[#00D9FF] flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[#071426] font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Services Overview ──────────────────────────────────────────── */}
      <section className="bg-[#F5F8FC] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1677FF] mb-3"
            >
              What We Do
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-[#071426]"
            >
              Our Service Categories
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {serviceCategories.map(({ emoji, title, items, gradient }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <Link to="/services" className="block h-full">
                  <div className={`bg-gradient-to-br ${gradient} p-8 h-full`}>
                    <div className="text-5xl mb-4">{emoji}</div>
                    <h3 className="text-white font-bold text-xl mb-4">{title}</h3>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 inline-flex items-center text-white text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
                      View Services
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#071426] py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1677FF] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00D9FF] rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to Get Your Appliance Fixed?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-400 text-lg mb-8"
            >
              Contact us today for a quick diagnosis and same-day service in {settings.address ? settings.address.split(',')[0].trim() : 'Karanthaneri'} and
              surrounding areas.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {settings.phone && (
                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-2 bg-[#1677FF] hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/40"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Call {settings.phone}
                </a>
              )}
              <Link
                to="/book-service"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <WrenchScrewdriverIcon className="w-5 h-5 text-[#00D9FF]" />
                Book a Service
              </Link>
            </motion.div>

            {settings.address && (
              <motion.p variants={fadeInUp} className="mt-8 text-gray-500 text-sm">
                📍 {settings.address}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
