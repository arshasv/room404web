import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-horror-black">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/404vid.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,0,0,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/3 w-64 h-64 bg-blood/5 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blood/5 blur-[80px] rounded-full"
        />
      </div>

      {/* Fog layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, -80, 0], opacity: [0, 0.06, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-10 left-0 w-[200%] h-24 bg-gradient-to-r from-transparent via-blood/5 to-transparent blur-3xl"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-horror-offwhite/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 vignette-overlay" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.h1
              className="font-horror text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none tracking-wider"
              animate={{ textShadow: ['0 0 20px rgba(139,0,0,0.3)', '0 0 40px rgba(139,0,0,0.5)', '0 0 20px rgba(139,0,0,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-horror-bone inline-block relative"
                style={{ textShadow: '0 0 30px rgba(232,222,208,0.1)' }}>
                ROOM
                <motion.span
                  className="absolute -inset-2 opacity-30"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(139,0,0,0.1) 50%, transparent 100%)',
                    filter: 'blur(4px)',
                  }}
                />
              </span>
              <span className="text-blood inline-block ml-4 md:ml-8 relative">
                404
                <motion.span
                  className="absolute -inset-4"
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(139,0,0,0.2) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
              </span>
            </motion.h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="font-body text-lg md:text-xl lg:text-2xl text-horror-offwhite/50 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide"
        >
          Some doors were never meant to be opened.
          <br />
          <span className="text-horror-offwhite/30 text-base md:text-lg">
            Face the darkness. Survive the unknown.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#download" className="btn-primary group text-base md:text-lg">
            <FiDownload className="mr-3 group-hover:animate-bounce" />
            Download Now
          </a>
          <a href="#about" className="btn-secondary group text-base md:text-lg">
            Learn More
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-horror-black to-transparent" />
    </section>
  )
}
