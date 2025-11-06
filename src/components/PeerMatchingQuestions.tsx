import { useState } from 'react'

interface PeerMatchingQuestionsProps {
  onComplete: (answers: PeerMatchingAnswers) => void
}

export interface PeerMatchingAnswers {
  communicationStyle: string
  preferredContactTime: string
  mentalHealthGoals: string[]
  availability: string
}

export default function PeerMatchingQuestions({ onComplete }: PeerMatchingQuestionsProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<PeerMatchingAnswers>({
    communicationStyle: '',
    preferredContactTime: '',
    mentalHealthGoals: [],
    availability: '',
  })

  const communicationStyles = [
    { value: 'text', label: 'Text Messages', icon: '💬' },
    { value: 'voice', label: 'Voice Calls', icon: '📞' },
    { value: 'video', label: 'Video Calls', icon: '📹' },
    { value: 'mixed', label: 'Mixed (All of the above)', icon: '🔄' },
  ]

  const contactTimes = [
    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
    { value: 'evening', label: 'Evening (6 PM - 10 PM)' },
    { value: 'anytime', label: 'Anytime' },
  ]

  const mentalHealthGoalsOptions = [
    'Managing Anxiety',
    'Coping with Depression',
    'Building Self-Esteem',
    'Stress Management',
    'Social Skills',
    'Emotional Regulation',
    'Recovery Support',
    'General Wellness',
  ]

  const availabilityOptions = [
    { value: 'daily', label: 'Daily Check-ins' },
    { value: 'few-times-week', label: 'Few Times a Week' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as-needed', label: 'As Needed' },
  ]

  const updateAnswer = (key: keyof PeerMatchingAnswers, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const toggleGoal = (goal: string) => {
    setAnswers((prev) => ({
      ...prev,
      mentalHealthGoals: prev.mentalHealthGoals.includes(goal)
        ? prev.mentalHealthGoals.filter((g) => g !== goal)
        : [...prev.mentalHealthGoals, goal],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return answers.communicationStyle !== ''
      case 2:
        return answers.preferredContactTime !== ''
      case 3:
        return answers.mentalHealthGoals.length > 0
      case 4:
        return answers.availability !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-border">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Peer Matching Preferences</h2>
          <span className="text-sm text-muted-foreground">Step {step} of 4</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Communication Style */}
      {step === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">How do you prefer to communicate?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {communicationStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => updateAnswer('communicationStyle', style.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  answers.communicationStyle === style.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{style.icon}</div>
                <div className="font-medium">{style.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Preferred Contact Time */}
      {step === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">When are you most available?</h3>
          <div className="space-y-3">
            {contactTimes.map((time) => (
              <button
                key={time.value}
                onClick={() => updateAnswer('preferredContactTime', time.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  answers.preferredContactTime === time.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Mental Health Goals */}
      {step === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">What are your mental health goals? (Select all that apply)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mentalHealthGoalsOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  answers.mentalHealthGoals.includes(goal)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
          {answers.mentalHealthGoals.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">Please select at least one goal</p>
          )}
        </div>
      )}

      {/* Step 4: Availability */}
      {step === 4 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">How often would you like to connect?</h3>
          <div className="space-y-3">
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateAnswer('availability', option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  answers.availability === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex-1 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 px-6 py-3 rounded-md transition-colors font-medium ${
            canProceed()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {step === 4 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}

