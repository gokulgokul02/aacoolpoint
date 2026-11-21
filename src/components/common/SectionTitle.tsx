import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function SectionTitle({ title, subtitle, centered = false, light = false }: Props) {
  const alignClass = centered ? 'items-center text-center' : 'items-start text-left'
  const titleColor = light ? 'text-white' : 'text-gray-900'
  const subtitleColor = light ? 'text-blue-200/80' : 'text-gray-500'

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {/* Title */}
      <motion.h2
        className={`text-3xl sm:text-4xl font-bold leading-tight ${titleColor}`}
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        {title}
      </motion.h2>

      {/* Decorative accent line */}
      <motion.div
        className={`flex gap-1.5 ${centered ? 'justify-center' : 'justify-start'}`}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <span className="h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <span className="h-1 w-4 rounded-full bg-blue-400/40" />
        <span className="h-1 w-2 rounded-full bg-blue-400/20" />
      </motion.div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={`max-w-2xl text-base sm:text-lg leading-relaxed ${subtitleColor}`}
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
