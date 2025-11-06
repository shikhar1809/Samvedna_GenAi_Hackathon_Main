import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'

interface VentBoxModalProps {
  onClose: () => void
}

interface Vent {
  id: string
  content: string
  anonymous_id: string
  created_at: string
  is_anonymized: boolean
}

// Hardcoded demo data - always visible
const DEMO_VENTS: Vent[] = [
  {
    id: 'demo-1',
    content: 'I feel so overwhelmed with work lately. Every day feels like a marathon and I never catch up. Just needed to get this off my chest.',
    anonymous_id: 'Anonymous #A1',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    is_anonymized: true,
  },
  {
    id: 'demo-2',
    content: 'Sometimes I wonder if anyone really understands what I\'m going through. It\'s lonely feeling like you\'re the only one struggling.',
    anonymous_id: 'Anonymous #B2',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    is_anonymized: true,
  },
  {
    id: 'demo-3',
    content: 'Had a really tough conversation with my family today. Emotions are running high and I don\'t know how to process everything.',
    anonymous_id: 'Anonymous #C3',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    is_anonymized: true,
  },
  {
    id: 'demo-4',
    content: 'Feeling anxious about the future. So many uncertainties and I wish I had a crystal ball to see what\'s coming next.',
    anonymous_id: 'Anonymous #D4',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    is_anonymized: true,
  },
  {
    id: 'demo-5',
    content: 'Today was actually okay. Small wins matter. Just wanted to acknowledge that progress, even if it feels tiny.',
    anonymous_id: 'Anonymous #E5',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    is_anonymized: true,
  },
  {
    id: 'demo-6',
    content: 'I\'m tired of pretending everything is fine when it\'s not. This space feels safe to be honest about my struggles.',
    anonymous_id: 'Anonymous #F6',
    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    is_anonymized: true,
  },
  {
    id: 'demo-7',
    content: 'Sometimes the smallest things trigger the biggest emotions. Today it was a song on the radio that brought back memories.',
    anonymous_id: 'Anonymous #G7',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    is_anonymized: true,
  },
  {
    id: 'demo-8',
    content: 'Grateful for this anonymous space. Sometimes you just need to vent without judgment or consequences. Thank you for listening.',
    anonymous_id: 'Anonymous #H8',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    is_anonymized: true,
  },
]

export default function VentBoxModal({ onClose }: VentBoxModalProps) {
  const [vents, setVents] = useState<Vent[]>(DEMO_VENTS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState<'slideshow' | 'submit'>('slideshow')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch vents from database and merge with demo data
  useEffect(() => {
    const fetchVents = async () => {
      try {
        const { data } = await supabase
          .from('vents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        // Merge demo data with fetched vents (demo data always first)
        const allVents = [...DEMO_VENTS, ...(data || [])]
        setVents(allVents)
      } catch (error) {
        console.error('Error fetching vents:', error)
        // Keep demo data even if fetch fails
      } finally {
        setFetching(false)
      }
    }

    fetchVents()
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (activeTab === 'slideshow' && !isPaused && vents.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % vents.length)
      }, 5000) // 5 seconds per vent

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeTab, isPaused, vents.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + vents.length) % vents.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vents.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vent-anonymize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          userId: user.id,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setContent('')
        // Refresh vents
        const { data } = await supabase
          .from('vents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
        
        const allVents = [...DEMO_VENTS, ...(data || [])]
        setVents(allVents)
        setActiveTab('slideshow')
        alert('Your vent has been posted anonymously!')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-primary">Vent Box</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-primary transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('slideshow')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'slideshow'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Recent Vents
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'submit'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Share Your Vent
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'slideshow' ? (
            <div className="space-y-6">
              {fetching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading vents...</p>
                </div>
              ) : vents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No vents yet. Be the first to share!</p>
                </div>
              ) : (
                <>
                  {/* Slideshow */}
                  <div
                    className="relative min-h-[400px] flex items-center justify-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-8 border-2 border-primary/20 shadow-lg">
                          <div className="mb-4">
                            <span className="text-sm font-semibold text-primary">
                              {vents[currentIndex].anonymous_id}
                            </span>
                            <span className="text-xs text-muted-foreground ml-3">
                              {formatDate(vents[currentIndex].created_at)}
                            </span>
                          </div>
                          <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                            {vents[currentIndex].content}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
                      aria-label="Previous vent"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors z-10"
                      aria-label="Next vent"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex justify-center items-center gap-2">
                    {vents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index)
                          setIsPaused(true)
                          setTimeout(() => setIsPaused(false), 10000)
                        }}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? 'w-8 bg-primary'
                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to vent ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Vent Counter */}
                  <div className="text-center text-sm text-muted-foreground">
                    {currentIndex + 1} of {vents.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Submission Form */
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
                <h3 className="text-xl font-bold mb-4">Anonymous Venting</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Express yourself freely. Your vent will be anonymized to protect your privacy.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    maxLength={500}
                    className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[200px]"
                    placeholder="Let it all out... (max 500 characters)"
                  />
                  <p className="text-sm text-muted-foreground">{content.length}/500 characters</p>

                  <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Posting...' : 'Post Anonymously'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

