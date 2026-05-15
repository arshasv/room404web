import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FiUser, FiGrid, FiAlertTriangle, FiCpu, FiMap, FiEye
} from 'react-icons/fi'

const features = [
  {
    icon: FiUser,
    title: 'Single-Player Survival',
    desc: 'Experience an immersive single-player campaign where every decision matters. Face the horrors alone — there is no one to save you.',
    color: 'from-blood/20 to-transparent',
  },
  {
    icon: FiGrid,
    title: 'Puzzle Solving',
    desc: 'Decipher cryptic clues, manipulate environmental objects, and unlock the secrets of Room 404. Each puzzle brings you closer to the truth — or deeper into madness.',
    color: 'from-blood/15 to-transparent',
  },
  {
    icon: FiAlertTriangle,
    title: 'Enemy AI',
    desc: 'Intelligent enemies that adapt to your behavior. They learn your patterns, respond to sound and light, and hunt you with terrifying persistence.',
    color: 'from-blood/25 to-transparent',
  },
  {
    icon: FiCpu,
    title: 'Psychological Horror',
    desc: 'The line between reality and nightmare blurs. Hallucinations, shifting environments, and sanity-bending events keep you guessing what is real.',
    color: 'from-blood/20 to-transparent',
  },
  {
    icon: FiMap,
    title: 'Exploration',
    desc: 'Explore a sprawling, interconnected environment filled with hidden rooms, secret passages, and unsettling discoveries. Every corner hides a story.',
    color: 'from-blood/15 to-transparent',
  },
  {
    icon: FiEye,
    title: 'Atmospheric Horror',
    desc: 'A masterful blend of sound design, lighting, and visual effects creates an atmosphere of constant dread. The true horror is what you cannot see.',
    color: 'from-blood/25 to-transparent',
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-dark via-horror-black to-horror-dark pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      {/* Horizontal blood line */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blood/15 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="section-title">
            Game <span className="text-blood">Features</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
          <p className="section-subtitle mt-6">
            Every element designed to immerse you in terror
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="horror-card p-6 md:p-8 group cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center border border-blood/30 mb-5 group-hover:border-blood/60 transition-colors duration-300">
                    <Icon className="text-blood-300 text-xl group-hover:animate-flicker" />
                  </div>
                  <h3 className="font-title text-lg md:text-xl text-horror-bone mb-3 group-hover:text-blood-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-horror-offwhite/40 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
