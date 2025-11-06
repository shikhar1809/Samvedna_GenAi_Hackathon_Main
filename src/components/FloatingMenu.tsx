import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PeerMatchModal from './PeerMatchModal'
import VentBoxModal from './VentBoxModal'
import SupportBotModal from './SupportBotModal'
import { setDemoMode } from '../lib/demoProfile'

interface MenuItem {
  id: string
  label: string
  icon: string
  color: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple'
  action: () => void
}

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<'peer-match' | 'vent' | 'support' | null>(null)
  const navigate = useNavigate()

  const handlePeerMatch = () => {
    setActiveModal('peer-match')
    setIsOpen(false)
  }

  const handleVent = () => {
    setActiveModal('vent')
    setIsOpen(false)
  }

  const handleSupport = () => {
    setActiveModal('support')
    setIsOpen(false)
  }

  const handleProfile = () => {
    setDemoMode(true)
    navigate('/profile')
    setIsOpen(false)
  }

  const menuItems: MenuItem[] = [
    {
      id: 'peer-match',
      label: 'TAKE A SPIN',
      icon: '🎰',
      color: 'purple',
      action: handlePeerMatch,
    },
    {
      id: 'vent',
      label: 'TAKE OUT THAT RAGE',
      icon: '💥',
      color: 'orange',
      action: handleVent,
    },
    {
      id: 'support',
      label: 'TALK TO SUPPORT',
      icon: '🤖',
      color: 'green',
      action: handleSupport,
    },
    {
      id: 'profile',
      label: 'PROFILE',
      icon: '👤',
      color: 'blue',
      action: handleProfile,
    },
  ]

  const colorClasses = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink text-white',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
    purple: 'bg-neo-purple',
  }

  return (
    <>
      {/* Main Menu Button */}
      <motion.div
        className="fixed bottom-8 left-8 z-[9999]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`border-neo shadow-neo ${colorClasses.yellow} px-6 py-4 font-black text-lg uppercase tracking-wide transition-all hover:shadow-neo-lg`}
        >
          {isOpen ? 'CLOSE' : 'MENU'}
        </button>

        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-4 flex flex-col gap-3"
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.action}
                  className={`border-neo shadow-neo ${colorClasses[item.color]} px-6 py-3 font-black text-sm uppercase tracking-wide transition-all hover:shadow-neo-lg flex items-center gap-3 min-w-[250px]`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'peer-match' && (
          <PeerMatchModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'vent' && (
          <VentBoxModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'support' && (
          <SupportBotModal onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

