import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import imgAbandonedCorridor from '../gallery/2.png'
import imgForgottenRoom from '../gallery/1.png'
import imgFinalDoor from '../gallery/3.png'
import imgCrimsonHall from '../gallery/5.png'
import imgBasement from '../gallery/6.png'
import imgEntity from '../gallery/4.png'

const screenshots = [
  { id: 1, title: 'Abandoned Corridor', desc: 'Flickering lights guide you through endless hallways.', color: 'from-red-950/50 to-black/80', image: imgAbandonedCorridor },
  { id: 2, title: 'The Basement', desc: 'Something stirs in the darkness below.', color: 'from-neutral-900/50 to-black/80', image: imgBasement },
  { id: 3, title: 'Forgotten Room', desc: 'Every room holds a memory. Some are better left forgotten.', color: 'from-stone-900/50 to-black/80', image: imgForgottenRoom },
  { id: 4, title: 'The Entity', desc: 'You are not alone. It watches from the shadows.', color: 'from-red-900/50 to-black/80', image: imgEntity },
  { id: 5, title: 'Crimson Hall', desc: 'The walls remember what you cannot.', color: 'from-rose-950/50 to-black/80', image: imgCrimsonHall },
  { id: 6, title: 'Final Door', desc: 'Behind this door lies the truth — or your end.', color: 'from-gray-900/50 to-black/80', image: imgFinalDoor },
]

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selected, setSelected] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section id="gallery" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-dark via-horror-black to-horror-dark pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">Screenshots</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
          <p className="section-subtitle mt-6">
            A glimpse into the nightmare that awaits
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {screenshots.map((shot, i) => (
            <motion.div
              key={shot.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredId(shot.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelected(shot)}
              className="relative aspect-[4/3] cursor-pointer overflow-hidden group horror-card border-none"
            >
              {shot.image && (
                <img src={shot.image} alt={shot.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${shot.color} ${shot.image ? 'opacity-60 mix-blend-overlay' : ''} transition-transform duration-700 group-hover:scale-110`} />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border border-horror-offwhite/20 group-hover:border-blood/50 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                  <FiChevronRight className="text-horror-offwhite/40 group-hover:text-blood-300 transition-colors" size={28} />
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-title text-lg text-horror-bone mb-1">{shot.title}</h3>
                  <p className="font-body text-sm text-horror-offwhite/50">{shot.desc}</p>
                </div>
              </div>

              <div className={`absolute inset-0 border border-horror-offwhite/5 group-hover:border-blood/30 transition-colors duration-500`} />

              {hoveredId === shot.id && (
                <motion.div
                  className="absolute -inset-1 bg-blood/5 blur-xl"
                  layoutId="glow"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 text-horror-offwhite/60 hover:text-blood-300 transition-colors z-10"
            >
              <FiX size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              {selected.image ? (
                <>
                  <div className="aspect-video rounded overflow-hidden bg-black flex items-center justify-center relative shadow-[0_0_50px_rgba(139,0,0,0.1)]">
                    <img src={selected.image} alt={selected.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center mt-6">
                    <h3 className="font-title text-2xl md:text-3xl text-horror-bone mb-2">{selected.title}</h3>
                    <p className="font-body text-base text-horror-offwhite/50 max-w-md mx-auto">{selected.desc}</p>
                  </div>
                </>
              ) : (
                <div className={`aspect-video rounded bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
                  <div className="text-center">
                    <h3 className="font-title text-3xl md:text-5xl text-horror-bone mb-4">{selected.title}</h3>
                    <p className="font-body text-base md:text-lg text-horror-offwhite/50 max-w-md mx-auto">{selected.desc}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 px-2">
                <button
                  onClick={() => {
                    const idx = screenshots.findIndex(s => s.id === selected.id)
                    setSelected(screenshots[(idx - 1 + screenshots.length) % screenshots.length])
                  }}
                  className="text-horror-offwhite/40 hover:text-blood-300 transition-colors"
                >
                  <FiChevronLeft size={24} />
                </button>
                <span className="font-body text-sm text-horror-offwhite/30">
                  {screenshots.findIndex(s => s.id === selected.id) + 1} / {screenshots.length}
                </span>
                <button
                  onClick={() => {
                    const idx = screenshots.findIndex(s => s.id === selected.id)
                    setSelected(screenshots[(idx + 1) % screenshots.length])
                  }}
                  className="text-horror-offwhite/40 hover:text-blood-300 transition-colors"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
