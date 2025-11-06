import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VentBoxModal from './VentBoxModal'

export default function FloatingVentButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-8 left-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg uppercase tracking-wide hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-3 border-4 border-white/20"
        >
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            💥
          </motion.span>
          <span>TAKE OUT THAT RAGE</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            →
          </motion.span>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10" />
        </button>
      </motion.div>

      {/* Vent Box Modal */}
      <AnimatePresence>
        {isOpen && <VentBoxModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

