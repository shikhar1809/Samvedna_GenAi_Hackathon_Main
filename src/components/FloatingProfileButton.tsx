import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { setDemoMode } from '../lib/demoProfile'

export default function FloatingProfileButton() {
  const navigate = useNavigate()

  const handleClick = () => {
    // Always enable demo mode and navigate to profile
    setDemoMode(true)
    navigate('/profile')
  }

  return (
    <motion.div
      className="fixed top-8 right-8 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={handleClick}
        className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg uppercase tracking-wide hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-3 border-4 border-white/20"
      >
        <motion.span
          className="text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          👤
        </motion.span>
        <span>DEMO PROFILE</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          →
        </motion.span>
        
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300 -z-10" />
      </button>
    </motion.div>
  )
}

