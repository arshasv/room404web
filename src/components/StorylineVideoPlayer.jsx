import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useEffect } from 'react'

export default function StorylineVideoPlayer({
  onClose,
  videoId = 'byrbtAzBaTs',
  title = 'Room 404 Storyline Video',
  label = 'Official Storyline Video'
}) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      {/* Grainy background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-noise z-0" />
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(circle at center, rgba(122, 18, 18, 0.05) 0%, transparent 70%)'
      }} />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[10001] p-3 bg-black/60 border border-blood/20 text-blood hover:bg-blood/20 hover:text-blood-300 rounded-full transition-all shadow-lg group"
        title="Close Video (Esc)"
      >
         <div className="absolute inset-0 bg-blood/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
         <FiX size={24} className="relative z-10" />
      </button>

      {/* Video Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-12 lg:p-24">
        <div className="relative w-full max-w-6xl aspect-video rounded-lg shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&textcolor=white`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full object-contain bg-black"
          ></iframe>
          
          {/* Subtle vignette on video */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] z-10" />
        </div>
      </div>

      {/* Atmospheric text at bottom */}
      <div className="fixed bottom-12 left-12 z-20 pointer-events-none opacity-20">
        <div className="font-horror text-2xl text-blood">
          ROOM404
        </div>
        <div className="text-[9px] uppercase tracking-[0.5em] text-horror-bone/40 mt-2 font-['Inter']">{label}</div>
      </div>
    </motion.div>
  )
}
