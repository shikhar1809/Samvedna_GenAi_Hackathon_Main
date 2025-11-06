import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlotMachineAnimationProps {
  onComplete: () => void
  matchData?: any
}

export default function SlotMachineAnimation({ onComplete }: SlotMachineAnimationProps) {
  const [stage, setStage] = useState<'spinning' | 'revealing' | 'complete'>('spinning')
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; delay: number; xOffset: number }>>([])
  const [reelPositions, setReelPositions] = useState([0, 0, 0])

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 0.5,
      xOffset: (Math.random() - 0.5) * 100,
    }))
    setConfetti(particles)

    // Animate reels spinning
    const spinInterval = setInterval(() => {
      setReelPositions([
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ])
    }, 100)

    // Spinning stage
    const spinningTimer = setTimeout(() => {
      clearInterval(spinInterval)
      setStage('revealing')
    }, 2500)

    // Revealing stage
    const revealingTimer = setTimeout(() => {
      setStage('complete')
      setTimeout(() => {
        onComplete()
      }, 1500)
    }, 4000)

    return () => {
      clearInterval(spinInterval)
      clearTimeout(spinningTimer)
      clearTimeout(revealingTimer)
    }
  }, [onComplete])

  // Slot reel items (placeholder profiles)
  const reelItems = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    emoji: ['👤', '🤝', '💙', '🌟', '✨', '💫', '⭐', '🎯', '🎪', '🎭', '🎨', '🎬', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧'][i % 20],
  }))

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center backdrop-blur-sm">
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
              x: particle.x + particle.xOffset,
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
                  className="relative w-32 h-40 bg-gradient-to-b from-yellow-900 to-black rounded-lg overflow-hidden border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                >
                  {/* Mask for showing only one item at a time */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-yellow-400 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-yellow-400 to-transparent opacity-50"></div>
                  </div>
                  
                  <motion.div
                    className="flex flex-col"
                    animate={{
                      y: stage === 'spinning' ? [-40 * 20, 0] : 0,
                    }}
                    transition={{
                      duration: stage === 'spinning' ? 2.5 + reelIndex * 0.2 : 0.3,
                      ease: stage === 'spinning' ? 'easeOut' : 'easeInOut',
                      delay: reelIndex * 0.15,
                    }}
                    style={{
                      transform: stage === 'spinning' ? `translateY(${reelPositions[reelIndex]}px)` : 'translateY(0)',
                    }}
                  >
                    {[...reelItems, ...reelItems, ...reelItems, ...reelItems].map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        className="flex flex-col items-center justify-center h-40 text-white"
                        animate={stage === 'spinning' ? {
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7],
                        } : {}}
                        transition={{
                          duration: 0.3,
                          repeat: stage === 'spinning' ? Infinity : 0,
                          delay: index * 0.05,
                        }}
                      >
                        <div className="text-6xl mb-2">{item.emoji}</div>
                        <div className="text-xs font-bold">{item.name}</div>
                      </motion.div>
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
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              duration: 0.6
            }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1.1, 1],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: 2,
                ease: 'easeInOut'
              }}
            >
              🎉
            </motion.div>
            <motion.h2 
              className="text-5xl font-bold text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              JACKPOT!
            </motion.h2>
            <motion.p 
              className="text-white/90 text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              We found your perfect match!
            </motion.p>
          </motion.div>
        )}

        {/* Complete Stage */}
        {stage === 'complete' && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 150,
              damping: 12,
              duration: 0.5
            }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1,
                ease: 'easeInOut'
              }}
            >
              ✨
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-yellow-400 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Match Found!
            </motion.h2>
            <motion.p 
              className="text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Preparing your match details...
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

