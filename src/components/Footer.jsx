import { motion } from 'framer-motion'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-blood/10 bg-horror-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-horror text-xl text-horror-bone">ROOM</span>
            <span className="font-horror text-2xl text-blood">404</span>
          </div>

          <p className="font-body text-xs text-horror-offwhite/20 tracking-wider">
            SOME DOORS WERE NEVER MEANT TO BE OPENED
          </p>

          <p className="font-body text-xs text-horror-offwhite/20">
            &copy; {year} Room 404. All rights reserved.
          </p>
        </div>

        <motion.div
          className="mt-8 pt-8 border-t border-horror-gray/10 text-center"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <p className="font-body text-[10px] text-horror-offwhite/10 tracking-[0.3em] uppercase">
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
