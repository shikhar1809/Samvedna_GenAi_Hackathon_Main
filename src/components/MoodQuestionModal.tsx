import { useState } from 'react'
import { getRandomMoodQuestion, type MoodQuestion } from '../lib/demoProfileData'

interface MoodQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onAnswer: (question: MoodQuestion, answer: string) => void
}

export default function MoodQuestionModal({ isOpen, onClose, onAnswer }: MoodQuestionModalProps) {
  const [currentQuestion] = useState<MoodQuestion>(getRandomMoodQuestion())
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim()) {
      onAnswer(currentQuestion, answer)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setAnswer('')
        onClose()
      }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Quick Mood Check</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg font-semibold text-primary">Thank you for sharing!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your response helps us understand your mood better.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2 capitalize">
                {currentQuestion.category}
              </p>
              <p className="text-lg">{currentQuestion.question}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full min-h-[120px] p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!answer.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

