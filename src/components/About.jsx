import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const storyParagraphs = [
  'You wake up in an abandoned building. The air is thick with dust and decay. Flickering lights cast dancing shadows across peeling wallpaper. You don\'t remember how you got here. You don\'t remember who you are.',
  'Room 404 was sealed for a reason. Something ancient resides within these walls — something that feeds on fear, memory, and hope. The previous tenants left behind scattered journals, cryptic symbols, and warnings carved into the floorboards.',
  'Each door you open leads deeper into the nightmare. Reality bends and distorts. Hallways loop into themselves. Whispers echo from behind locked doors. You are not alone in the dark.',
]

const features = [
  { label: 'Story-Driven Horror', desc: 'Unravel a deep narrative through environmental storytelling.' },
  { label: 'Survival Mechanics', desc: 'Manage limited resources, sanity, and your will to survive.' },
  { label: 'Psychological Terror', desc: 'The game learns your fears and twists reality around you.' },
  { label: 'Atmospheric Exploration', desc: 'Explore a hauntingly detailed abandoned facility.' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-black via-horror-dark to-horror-black pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blood/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">About</span>{' '}
            <span className="text-blood">Room 404</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {storyParagraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.2 }}
                className="font-body text-base md:text-lg text-horror-offwhite/60 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="horror-card p-6 md:p-8">
              <h3 className="font-title text-xl md:text-2xl text-horror-bone mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-blood/60" />
                Story Overview
              </h3>
              <p className="font-body text-base text-horror-offwhite/50 leading-relaxed">
                Room 404 is a first-person psychological survival horror game that plunges players into a nightmarish dimension where reality and nightmare intertwine. Navigate through shifting environments, solve cryptic puzzles, and survive encounters with entities that defy explanation.
              </p>
            </div>

            <div className="horror-card p-6 md:p-8">
              <h3 className="font-title text-xl md:text-2xl text-horror-bone mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-blood/60" />
                Key Features
              </h3>
              <div className="space-y-4">
                {features.map((feat, i) => (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                    className="flex gap-4 items-start group"
                  >
                    <span className="w-2 h-2 bg-blood/60 mt-2 flex-shrink-0 group-hover:bg-blood-300 transition-colors" />
                    <div>
                      <h4 className="font-title text-base text-horror-bone/90 mb-1">{feat.label}</h4>
                      <p className="font-body text-sm text-horror-offwhite/40">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
