import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import BigFiveQuiz from '../components/BigFiveQuiz'
import { BigFiveScores } from '../lib/bigfive'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [mentalHealthHistory, setMentalHealthHistory] = useState('')
  const [preferences, setPreferences] = useState({
    preferredContactTime: 'anytime',
    interestedFeatures: [] as string[],
  })

  const handleQuizComplete = async (scores: BigFiveScores, personalityType: string) => {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('User not authenticated')

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          big_five_scores: scores,
          personality_type: personalityType,
          mental_health_history: mentalHealthHistory,
          preferences: preferences,
        } as any)

      if (profileError) throw profileError

      // Navigate to dashboard after successful onboarding
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  const toggleFeature = (feature: string) => {
    setPreferences(prev => ({
      ...prev,
      interestedFeatures: prev.interestedFeatures.includes(feature)
        ? prev.interestedFeatures.filter(f => f !== feature)
        : [...prev.interestedFeatures, feature]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome to SAMVEDNA</h1>
          <p className="text-muted-foreground">Let's personalize your mental health journey</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Step 1: Welcome</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Before we begin, we'd like to understand you better. This will help us provide 
                personalized support and match you with the right resources.
              </p>
              <p className="text-muted-foreground">
                This onboarding process includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>A brief personality assessment (44 questions)</li>
                <li>Information about your mental health goals</li>
                <li>Your feature preferences</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Privacy Note:</strong> All your information is encrypted and never shared without your consent.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Step 2: Mental Health Info */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Step 2: Your Mental Health Journey</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What brings you to SAMVEDNA? (Optional)
                </label>
                <textarea
                  value={mentalHealthHistory}
                  onChange={(e) => setMentalHealthHistory(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-32"
                  placeholder="Share as much or as little as you're comfortable with... (e.g., managing anxiety, improving mood, seeking support)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Which features interest you most?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Journaling',
                    'AI Diagnosis',
                    'Peer Support',
                    'CBT Tools',
                    'Support Groups',
                    'AI Companion'
                  ].map(feature => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`p-3 rounded-md border-2 transition-all text-left ${
                        preferences.interestedFeatures.includes(feature)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personality Quiz */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-2">Step 3: Personality Assessment</h2>
            <p className="text-muted-foreground mb-6">
              Answer these questions honestly. There are no right or wrong answers.
            </p>
            <BigFiveQuiz onComplete={handleQuizComplete} />
          </div>
        )}
      </div>
    </div>
  )
}

