import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRandomMoodQuestion, type MoodQuestion } from '../lib/demoProfileData'
import MoodQuestionModal from './MoodQuestionModal'
import DashboardWidget from './DashboardWidget'

export default function MoodQuestions() {
  const [showModal, setShowModal] = useState(false)
  const [lastQuestion, setLastQuestion] = useState<MoodQuestion | null>(null)
  const [answersCount, setAnswersCount] = useState(0)

  // Show a random question on component mount (30% chance)
  useEffect(() => {
    const shouldShow = Math.random() < 0.3
    if (shouldShow) {
      setLastQuestion(getRandomMoodQuestion())
    }
  }, [])

  const handleAnswer = (question: MoodQuestion, answer: string) => {
    // In a real app, this would save to the database
    console.log('Mood question answered:', { question, answer })
    setAnswersCount(prev => prev + 1)
    setLastQuestion(question)
  }

  const handleAskQuestion = () => {
    setLastQuestion(getRandomMoodQuestion())
    setShowModal(true)
  }

  return (
    <>
      <DashboardWidget title="Mood Check-In" icon="💬">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Answering mood questions helps our AI better understand your emotional state and provide personalized support.
          </p>

          {lastQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/30"
            >
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Last Question:</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lastQuestion.question}</p>
            </motion.div>
          )}

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {answersCount}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Questions Answered</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAskQuestion}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
            >
              Answer Question
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Questions appear randomly to help track your mood patterns
          </p>
        </div>
      </DashboardWidget>

      <MoodQuestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAnswer={handleAnswer}
      />
    </>
  )
}

