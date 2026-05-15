import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { FaWindows, FaUbuntu } from 'react-icons/fa'

const platforms = [
  {
    id: 'windows',
    name: 'Windows',
    icon: FaWindows,
    version: 'v1.0.0',
    size: '1.9 GB',
    requirements: [
      'OS: Windows 10/11 (64-bit)',
      'CPU: Intel i5-8400 / AMD Ryzen 5 2600',
      'RAM: 8 GB',
      'GPU: NVIDIA GTX 1060 / AMD RX 580',
      'Storage: 5 GB available',
      'DirectX: Version 12',
    ],
    downloadUrl: 'https://drive.google.com/drive/folders/1oU_a5jpuz_fIZAM5_EWVamTkrnjug_3d?usp=sharing',
    color: 'from-blood/20 to-transparent',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu / Linux',
    icon: FaUbuntu,
    version: 'v1.0.0',
    size: '1.9 GB',
    requirements: [
      'OS: Ubuntu 22.04+ / Linux (x86_64)',
      'CPU: Intel i5-8400 / AMD Ryzen 5 2600',
      'RAM: 8 GB',
      'GPU: NVIDIA GTX 1060 / AMD RX 580',
      'Storage: 5 GB available',
      'Proton / Wine compatible',
    ],
    downloadUrl: 'https://drive.google.com/drive/folders/1iYdjdMPCocFktynunuInb7XbjJo5v_8r?usp=drive_link',
    color: 'from-blood/15 to-transparent',
  },
]

export default function Download() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  return (
    <section id="download" className="relative py-20 md:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-horror-black via-horror-dark to-horror-black pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-15 pointer-events-none" />

      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blood/3 blur-[150px] rounded-full"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="section-title">
            <span className="text-horror-bone">Download</span>{' '}
            <span className="text-blood">Now</span>
          </h2>
          <div className="w-20 h-px bg-blood/50 mx-auto mt-6" />
          <p className="section-subtitle mt-6">
            Choose your platform and step into the nightmare
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {platforms.map((platform, i) => {
            const Icon = platform.icon
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                onMouseEnter={() => setSelectedPlatform(platform.id)}
                onMouseLeave={() => setSelectedPlatform(null)}
                className={`horror-card p-6 md:p-8 group transition-all duration-500 ${
                  selectedPlatform === platform.id ? 'border-blood/40' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${platform.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 flex items-center justify-center border border-blood/30 group-hover:border-blood/60 transition-colors">
                      <Icon className="text-2xl text-horror-bone group-hover:text-blood-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-title text-2xl text-horror-bone group-hover:text-blood-200 transition-colors">
                        {platform.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-horror-offwhite/40">
                        <span>{platform.version}</span>
                        <span>•</span>
                        <span>{platform.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {platform.requirements.map((req) => (
                      <div key={req} className="flex items-center gap-3 text-sm text-horror-offwhite/40">
                        <span className="w-1 h-1 bg-blood/50 rounded-full flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>

                  <a
                    href={platform.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full group text-sm md:text-base"
                  >
                    <FiDownload className="mr-3 group-hover:animate-flicker" />
                    Download for {platform.name}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
