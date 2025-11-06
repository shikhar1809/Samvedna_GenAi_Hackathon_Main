import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import SlotMachineAnimation from '../components/SlotMachineAnimation'
import PeerMatchingQuestions, { PeerMatchingAnswers } from '../components/PeerMatchingQuestions'
import CompatibilityDisplay from '../components/CompatibilityDisplay'
import { BigFiveScores } from '../lib/bigfive'

interface UserProfile {
  id: string
  user_id: string
  big_five_scores: BigFiveScores
  personality_type: string | null
  mental_health_history: string | null
  preferences: any
}

export default function PeerMatch() {
  const [matching, setMatching] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [match, setMatch] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false)
  const [hasCompletedQuestions, setHasCompletedQuestions] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    checkUserProfile()
  }, [user])

  const checkUserProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (profile) {
        setUserProfile(profile)
        // Check if user has completed personality test (has big_five_scores)
        const hasScores = profile.big_five_scores && 
          typeof profile.big_five_scores === 'object' &&
          'openness' in profile.big_five_scores
        setHasCompletedQuiz(hasScores)

        // Check if user has completed peer matching questions
        const prefs = profile.preferences || {}
        const hasQuestions = prefs.peerMatchingAnswers && 
          prefs.peerMatchingAnswers.communicationStyle &&
          prefs.peerMatchingAnswers.mentalHealthGoals?.length > 0
        setHasCompletedQuestions(hasQuestions)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionsComplete = async (answers: PeerMatchingAnswers) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          preferences: {
            ...(userProfile?.preferences || {}),
            peerMatchingAnswers: answers,
          },
        })
        .eq('user_id', user.id)

      if (error) throw error

      setHasCompletedQuestions(true)
      setShowQuestions(false)
    } catch (error: any) {
      alert('Error saving preferences: ' + error.message)
    }
  }

  const handleFindPeer = async () => {
    if (!user) return

    setShowAnimation(true)
    setMatching(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-peers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const result = await response.json()
      if (result.success && result.match) {
        setMatch(result)
      } else {
        alert(result.message || 'No peers available at the moment')
        setShowAnimation(false)
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
      setShowAnimation(false)
    } finally {
      setMatching(false)
    }
  }

  const handleAnimationComplete = () => {
    setShowAnimation(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {showAnimation && (
        <SlotMachineAnimation onComplete={handleAnimationComplete} matchData={match} />
      )}

      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Find a Peer</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {!match ? (
          <div className="max-w-6xl mx-auto">
            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left: User Profile */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-border">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                {userProfile && userProfile.big_five_scores ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-4xl">
                          👤
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user?.email?.split('@')[0] || 'User'}</h3>
                          {userProfile.personality_type && (
                            <p className="text-sm text-muted-foreground">{userProfile.personality_type}</p>
                          )}
                        </div>
                      </div>
                      {userProfile.mental_health_history && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                          <p className="text-sm text-muted-foreground">{userProfile.mental_health_history}</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(userProfile.big_five_scores as BigFiveScores).map(([trait, score]) => (
                        <div key={trait} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                          <div className="text-xs text-muted-foreground mb-1 capitalize">{trait}</div>
                          <div className="text-2xl font-bold">{score}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Complete your personality test to see your profile</p>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Take Personality Test
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Placeholder for Match */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-lg p-6 border border-border flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-8xl mb-4 opacity-50">🎰</div>
                  <h3 className="text-xl font-bold mb-2 text-muted-foreground">Your Match Will Appear Here</h3>
                  <p className="text-muted-foreground">Click "Find a Peer" to discover your perfect match!</p>
                </div>
              </div>
            </div>

            {/* Questions or Find Button */}
            {!hasCompletedQuiz ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-2">Complete Your Profile First</h3>
                <p className="text-muted-foreground mb-4">
                  You need to complete the personality test before you can find a peer match.
                </p>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Onboarding
                </button>
              </div>
            ) : showQuestions ? (
              <PeerMatchingQuestions onComplete={handleQuestionsComplete} />
            ) : !hasCompletedQuestions ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-2">Almost There!</h3>
                <p className="text-muted-foreground mb-4">
                  Answer a few quick questions to help us find your perfect peer match.
                </p>
                <button
                  onClick={() => setShowQuestions(true)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Answer Questions
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-border text-center">
                <div className="text-6xl mb-4">🎰</div>
                <h2 className="text-2xl font-bold mb-4">Ready to Find Your Match?</h2>
                <p className="text-muted-foreground mb-6">
                  Click the button below to spin the slot machine and find your perfect peer support partner!
                </p>
                <button
                  onClick={handleFindPeer}
                  disabled={matching}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transform hover:scale-105"
                >
                  {matching ? 'Finding Your Match...' : '🎰 Find a Peer 🎰'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-border">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">Match Found!</h2>
                <p className="text-muted-foreground text-lg">
                  We found a great peer support partner for you
                </p>
              </div>

              {/* Match Details */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-6 border-2 border-primary mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-5xl">
                      {match.peer?.emoji || '👤'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {match.peer?.name || 'Your Peer Match'}
                      </h3>
                      {match.peer?.personality_type && (
                        <p className="text-muted-foreground">{match.peer.personality_type}</p>
                      )}
                    </div>
                  </div>
                </div>

                <CompatibilityDisplay
                  match={match.match || match}
                  currentUserScores={userProfile?.big_five_scores as BigFiveScores}
                  peerScores={match.peer?.big_five_scores as BigFiveScores}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMatch(null)
                    setShowAnimation(false)
                  }}
                  className="flex-1 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Find Another Match
                </button>
                <button
                  onClick={() => alert('Chat feature coming soon!')}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
