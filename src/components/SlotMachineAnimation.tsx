import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlotMachineAnimationProps {
  onComplete: () => void
  matchData?: any
}

export default function SlotMachineAnimation({ onComplete, matchData }: SlotMachineAnimationProps) {
  const [stage, setStage] = useState<'spinning' | 'revealing' | 'complete'>('spinning')
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 0.5,
    }))
    setConfetti(particles)

    // Spinning stage
    const spinningTimer = setTimeout(() => {
      setStage('revealing')
    }, 3000)

    // Revealing stage
    const revealingTimer = setTimeout(() => {
      setStage('complete')
      setTimeout(() => {
        onComplete()
      }, 2000)
    }, 5000)

    return () => {
      clearTimeout(spinningTimer)
      clearTimeout(revealingTimer)
    }
  }, [onComplete])

  // Slot reel items (placeholder profiles)
  const reelItems = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    emoji: ['👤', '🤝', '💙', '🌟', '✨', '💫', '⭐', '🎯', '🎪', '🎭'][i],
  }))

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      {/* Confetti Effect */}
      <AnimatePresence>
        {stage !== 'spinning' && confetti.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][particle.id % 5],
            }}
            initial={{ y: -10, opacity: 0, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              opacity: [0, 1, 1, 0],
              rotate: 360,
              x: particle.x + (Math.random() - 0.5) * 100,
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Slot Machine Container */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl border-4 border-yellow-400">
        {/* Jackpot Lights */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full blur-3xl"
              style={{
                left: `${(i % 4) * 25}%`,
                top: `${Math.floor(i / 4) * 50}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4'][i % 3],
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Slot Reels */}
        {stage === 'spinning' && (
          <div className="relative z-10">
            <div className="text-center mb-6">
              <motion.h2
                className="text-4xl font-bold text-yellow-400 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎰 FINDING YOUR MATCH 🎰
              </motion.h2>
              <p className="text-white/80">Spinning the reels...</p>
            </div>

            <div className="flex gap-4 justify-center mb-8">
              {[0, 1, 2].map((reelIndex) => (
                <div
                  key={reelIndex}
                  className="relative w-32 h-40 bg-black/50 rounded-lg overflow-hidden border-2 border-yellow-400"
                >
                  <motion.div
                    className="flex flex-col"
                    animate={{
                      y: [-40 * 10, 0],
                    }}
                    transition={{
                      duration: 2 + reelIndex * 0.3,
                      ease: 'easeOut',
                      delay: reelIndex * 0.2,
                    }}
                  >
                    {[...reelItems, ...reelItems, ...reelItems].map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex flex-col items-center justify-center h-40 text-white"
                      >
                        <div className="text-6xl mb-2">{item.emoji}</div>
                        <div className="text-sm font-bold">{item.name}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revealing Stage */}
        {stage === 'revealing' && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-2">JACKPOT!</h2>
            <p className="text-white/80 text-xl">We found your perfect match!</p>
          </motion.div>
        )}

        {/* Complete Stage */}
        {stage === 'complete' && matchData && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Match Found!</h2>
            <p className="text-white/80">Preparing your match details...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

