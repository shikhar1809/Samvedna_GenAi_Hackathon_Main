import { useState } from 'react'
import { bigFiveQuestions, calculateBigFiveScores, getPersonalityType, Answer, BigFiveScores } from '../lib/bigfive'

interface BigFiveQuizProps {
  onComplete: (scores: BigFiveScores, personalityType: string) => void
}

export default function BigFiveQuiz({ onComplete }: BigFiveQuizProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  
  const questionsPerPage = 10
  const totalPages = Math.ceil(bigFiveQuestions.length / questionsPerPage)
  const currentQuestions = bigFiveQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  )

  const getAnswer = (questionId: number) => {
    return answers.find(a => a.questionId === questionId)?.value || 0
  }

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, value } : a)
      }
      return [...prev, { questionId, value }]
    })
  }

  const isPageComplete = () => {
    return currentQuestions.every(q => getAnswer(q.id) > 0)
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      // Quiz complete
      const scores = calculateBigFiveScores(answers)
      const personalityType = getPersonalityType(scores)
      onComplete(scores, personalityType)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const options = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentPage * questionsPerPage + 1}-{Math.min((currentPage + 1) * questionsPerPage, bigFiveQuestions.length)} of {bigFiveQuestions.length}</span>
          <span>{Math.round(((currentPage + 1) / totalPages) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
            <h3 className="text-lg font-medium mb-4">
              {currentPage * questionsPerPage + index + 1}. {question.text}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`p-3 rounded-md border-2 transition-all text-sm ${
                    getAnswer(question.id) === option.value
                      ? 'border-primary bg-primary/10 font-medium'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className="px-6 py-2 border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!isPageComplete()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {currentPage === totalPages - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}

