import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const storyAssets = [
  {
    title: 'Trailer Video',
    desc: 'Watch the official cinematic trailer of Room 404.',
    image: '/storyworld/trailer.png',
    cta: 'Watch Trailer',
    delay: 0.1,
    href: '#story-world'
  },
  {
    title: 'Storyline Video',
    desc: 'Explore the story, characters, mysteries, and lore behind Room 404.',
    image: '/storyworld/storyline.png',
    cta: 'Watch Storyline',
    delay: 0.2,
    href: '#story-world'
  },
  {
    title: 'Comic',
    desc: 'Read the visual adaptation of the story with illustrated scenes and suspenseful moments.',
    image: '/storyworld/comic.png',
    cta: 'Read Comic',
    delay: 0.3,
    href: '/Comic Book Room404.pdf'
  },
  {
    title: 'Novel',
    desc: 'Read the complete psychological horror novel and experience the full narrative.',
    image: '/storyworld/novel.png',
    cta: 'Read Novel',
    delay: 0.4,
    href: '/#reader'
  }
]

export default function StoryWorld() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="story-world" className="relative py-24 md:py-32 bg-horror-black overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blood/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blood/30 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">Story</span>{' '}
            <span className="text-blood">World</span>
          </h2>
          <p className="section-subtitle">
            Immerse yourself in the dark lore and narrative layers of the Room 404 universe.
          </p>
          <div className="w-24 h-px bg-blood/40 mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {storyAssets.map((asset, index) => (
            <motion.div
              key={asset.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: asset.delay }}
              className="horror-card group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={asset.image}
                  alt={asset.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-horror-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-blood/10 opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-title text-lg md:text-xl text-horror-bone mb-3 group-hover:text-blood-200 transition-colors">
                  {asset.title}
                </h3>
                <p className="font-body text-sm text-horror-offwhite/50 leading-relaxed mb-8 flex-grow">
                  {asset.desc}
                </p>

                <a
                  href={asset.href}
                  target={asset.title === 'Comic' || asset.title === 'Novel' ? '_blank' : undefined}
                  rel={asset.title === 'Comic' || asset.title === 'Novel' ? 'noopener noreferrer' : undefined}
                  className="btn-secondary text-base py-3 w-full group-hover:bg-blood/10 transition-all flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {asset.cta}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </a>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blood/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blood/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blood/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blood/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
