import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaDiscord, FaYoutube, FaSteam, FaItchIo } from 'react-icons/fa'
import { FiExternalLink } from 'react-icons/fi'

const socials = [
  {
    name: 'Discord',
    icon: FaDiscord,
    url: '#',
    desc: 'Join our community',
    color: 'hover:bg-[#5865F2]/20 hover:border-[#5865F2]/40',
    iconColor: 'group-hover:text-[#5865F2]',
  },
  {
    name: 'YouTube',
    icon: FaYoutube,
    url: '#',
    desc: 'Watch trailers & gameplay',
    color: 'hover:bg-[#FF0000]/20 hover:border-[#FF0000]/40',
    iconColor: 'group-hover:text-[#FF0000]',
  },
  {
    name: 'Steam',
    icon: FaSteam,
    url: '#',
    desc: 'Wishlist on Steam',
    color: 'hover:bg-[#1b2838]/20 hover:border-[#1b2838]/40',
    iconColor: 'group-hover:text-[#1b2838]',
  },
  {
    name: 'itch.io',
    icon: FaItchIo,
    url: '#',
    desc: 'Available on itch.io',
    color: 'hover:bg-[#FA5C5C]/20 hover:border-[#FA5C5C]/40',
    iconColor: 'group-hover:text-[#FA5C5C]',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-dark via-horror-black to-horror-black pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      {/* Blood line decoration */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blood/20 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">Stay</span>{' '}
            <span className="text-blood">Connected</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
          <p className="section-subtitle mt-6">
            Follow the nightmare across all platforms
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-5">
            {socials.map((social, i) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`horror-card p-6 group flex items-center gap-5 ${social.color} transition-all duration-300`}
                >
                  <div className="w-14 h-14 flex items-center justify-center border border-horror-gray/40 group-hover:border-current transition-colors flex-shrink-0">
                    <Icon className={`text-2xl text-horror-offwhite/60 ${social.iconColor} transition-colors`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-title text-lg text-horror-bone group-hover:text-blood-200 transition-colors">
                      {social.name}
                    </h3>
                    <p className="font-body text-sm text-horror-offwhite/40">{social.desc}</p>
                  </div>
                  <FiExternalLink className="text-horror-offwhite/30 group-hover:text-blood-300 transition-colors flex-shrink-0" />
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
