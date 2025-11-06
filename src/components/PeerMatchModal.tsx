import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from './AuthProvider'
import { supabase } from '../lib/supabase'
import SlotMachineAnimation from './SlotMachineAnimation'
import PeerMatchingQuestions, { PeerMatchingAnswers } from './PeerMatchingQuestions'
import CompatibilityDisplay from './CompatibilityDisplay'
import { BigFiveScores } from '../lib/bigfive'
import { DEMO_PROFILE, getDemoProfile, setDemoMode } from '../lib/demoProfile'

interface PeerMatchModalProps {
  onClose: () => void
}

interface UserProfile {
  id: string
  user_id: string
  big_five_scores: BigFiveScores
  personality_type: string | null
  mental_health_history: string | null
  preferences: any
}

export default function PeerMatchModal({ onClose }: PeerMatchModalProps) {
  const [matching, setMatching] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [match, setMatch] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false)
  const [hasCompletedQuestions, setHasCompletedQuestions] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    checkUserProfile()
  }, [user])

  const checkUserProfile = async () => {
    // Check if demo mode is enabled
    const demoProfile = getDemoProfile()
    if (demoProfile) {
      setUserProfile({
        id: 'demo',
        user_id: demoProfile.user_id,
        big_five_scores: demoProfile.big_five_scores,
        personality_type: demoProfile.personality_type,
        mental_health_history: demoProfile.mental_health_history,
        preferences: demoProfile.preferences,
      })
      setHasCompletedQuiz(true)
      setHasCompletedQuestions(!!demoProfile.preferences?.peerMatchingAnswers)
      setUsingDemo(true)
      setLoading(false)
      return
    }

    if (!user) {
      setLoading(false)
      setHasCompletedQuiz(false)
      setHasCompletedQuestions(false)
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

      if (profile && typeof profile === 'object') {
        const profileData = profile as any
        const userProfileData: UserProfile = {
          id: profileData.id as string,
          user_id: profileData.user_id as string,
          big_five_scores: profileData.big_five_scores as BigFiveScores,
          personality_type: profileData.personality_type as string | null,
          mental_health_history: profileData.mental_health_history as string | null,
          preferences: profileData.preferences || {},
        }
        setUserProfile(userProfileData)
        const hasScores = userProfileData.big_five_scores && 
          typeof userProfileData.big_five_scores === 'object' &&
          'openness' in userProfileData.big_five_scores
        setHasCompletedQuiz(hasScores)

        const prefs = userProfileData.preferences || {}
        const hasQuestions = prefs.peerMatchingAnswers && 
          prefs.peerMatchingAnswers.communicationStyle &&
          prefs.peerMatchingAnswers.mentalHealthGoals?.length > 0
        setHasCompletedQuestions(hasQuestions)
      } else {
        setHasCompletedQuiz(false)
        setHasCompletedQuestions(false)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setHasCompletedQuiz(false)
      setHasCompletedQuestions(false)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionsComplete = async (answers: PeerMatchingAnswers) => {
    if (usingDemo) {
      // For demo mode, just update local state
      const demoProfile = getDemoProfile()
      if (demoProfile && userProfile) {
        const updatedPreferences = {
          ...demoProfile.preferences,
          peerMatchingAnswers: answers,
        }
        setUserProfile({
          ...userProfile,
          preferences: updatedPreferences,
        })
      }
      setHasCompletedQuestions(true)
      setShowQuestions(false)
      return
    }

    if (!user) return

    try {
      const updatedPreferences: any = {
        ...(userProfile?.preferences || {}),
        peerMatchingAnswers: answers,
      }
      const updateData: any = { preferences: updatedPreferences }
      const { error } = await supabase
        .from('user_profiles')
        // @ts-expect-error - Supabase type inference issue with JSONB fields
        .update(updateData)
        .eq('user_id', user.id)

      if (error) throw error

      setHasCompletedQuestions(true)
      setShowQuestions(false)
    } catch (error: any) {
      alert('Error saving preferences: ' + error.message)
    }
  }

  const handleEnableDemo = () => {
    setDemoMode(true)
    const demoProfile = getDemoProfile()
    if (demoProfile) {
      setUserProfile({
        id: 'demo',
        user_id: demoProfile.user_id,
        big_five_scores: demoProfile.big_five_scores,
        personality_type: demoProfile.personality_type,
        mental_health_history: demoProfile.mental_health_history,
        preferences: demoProfile.preferences,
      })
      setHasCompletedQuiz(true)
      setHasCompletedQuestions(false)
      setUsingDemo(true)
    }
  }

  const handleFindPeer = async () => {
    const userId = usingDemo ? DEMO_PROFILE.user_id : user?.id
    if (!userId) return

    setShowAnimation(true)
    setMatching(true)

    try {
      // For demo mode, create a mock match response with variation
      if (usingDemo) {
        await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate animation time
        
        // Get all demo profiles and calculate compatibility with current user
        const { getAllDemoProfiles } = await import('../lib/demoProfile')
        const allDemoProfiles = getAllDemoProfiles()
        const currentDemoProfile = getDemoProfile()
        
        if (!currentDemoProfile) {
          alert('Demo profile not found')
          setShowAnimation(false)
          setMatching(false)
          return
        }

        // Calculate compatibility for all demo profiles
        const demoCompatibilities = allDemoProfiles
          .filter(profile => profile.user_id !== currentDemoProfile.user_id) // Exclude self
          .map(peer => {
            const scores1 = currentDemoProfile.big_five_scores
            const scores2 = peer.big_five_scores
            
            const calculateTraitCompatibility = (trait: keyof typeof scores1): number => {
              const score1 = scores1[trait] || 50
              const score2 = scores2[trait] || 50
              const diff = Math.abs(score1 - score2)
              return Math.max(0, 100 - diff)
            }

            const openness = calculateTraitCompatibility('openness')
            const conscientiousness = calculateTraitCompatibility('conscientiousness')
            const extraversion = calculateTraitCompatibility('extraversion')
            const agreeableness = calculateTraitCompatibility('agreeableness')
            const neuroticism = calculateTraitCompatibility('neuroticism')

            const match_score = (
              openness * 0.2 +
              conscientiousness * 0.2 +
              extraversion * 0.2 +
              agreeableness * 0.25 +
              neuroticism * 0.15
            ) / 100

            return {
              peer,
              match_score: Math.min(1, Math.max(0.5, match_score)),
              compatibility_breakdown: {
                openness,
                conscientiousness,
                extraversion,
                agreeableness,
                neuroticism,
              },
            }
          })

        // Sort by match score and select from top matches with variation
        demoCompatibilities.sort((a, b) => b.match_score - a.match_score)
        const topScore = demoCompatibilities[0]?.match_score || 0
        const topMatches = demoCompatibilities.filter(
          p => p.match_score >= topScore - 0.05 && p.match_score > 0.6
        )

        // Weighted random selection from top matches
        let selectedMatch
        if (topMatches.length > 1) {
          const weights = topMatches.map(m => Math.pow(m.match_score, 3))
          const totalWeight = weights.reduce((sum, w) => sum + w, 0)
          let random = Math.random() * totalWeight
          
          for (let i = 0; i < topMatches.length; i++) {
            random -= weights[i]
            if (random <= 0) {
              selectedMatch = topMatches[i]
              break
            }
          }
          if (!selectedMatch) selectedMatch = topMatches[0]
        } else {
          selectedMatch = demoCompatibilities[0]
        }

        const selectedPeer = selectedMatch.peer
        const compatibility = selectedMatch.compatibility_breakdown

        // Generate reasoning based on compatibility
        const highTraits: string[] = []
        if (compatibility.openness > 80) highTraits.push('openness to new experiences')
        if (compatibility.conscientiousness > 80) highTraits.push('organized and goal-oriented approach')
        if (compatibility.extraversion > 80) highTraits.push('social and outgoing nature')
        if (compatibility.agreeableness > 80) highTraits.push('empathetic and supportive personality')
        if (compatibility.neuroticism < 30) highTraits.push('emotional stability')

        const reasoning = highTraits.length > 0
          ? `You both share strong compatibility in ${highTraits.join(', ')}. Your similar personality traits and mental health goals make you excellent peer support partners. You can provide mutual understanding and encouragement on your journeys.`
          : `You have complementary personality traits that work well together. Your shared mental health goals and communication preferences create a strong foundation for peer support.`

        // Generate activities based on compatibility
        const activities: string[] = []
        if (compatibility.openness > 70) {
          activities.push('Explore new mindfulness techniques together')
        }
        if (compatibility.conscientiousness > 70) {
          activities.push('Set and track mental health goals together')
        }
        if (compatibility.extraversion > 70) {
          activities.push('Participate in peer support discussions and group activities')
        }
        if (compatibility.agreeableness > 70) {
          activities.push('Share daily check-ins and provide mutual support')
        }
        if (compatibility.neuroticism < 50) {
          activities.push('Practice stress management and emotional regulation techniques')
        }
        
        if (activities.length === 0) {
          activities.push(
            'Share daily check-ins and support each other',
            'Exchange journaling prompts and reflections',
            'Practice mindfulness exercises together',
            'Set and track mental health goals together'
          )
        }

        const mockMatch = {
          success: true,
          match: {
            id: `demo-match-${selectedPeer.user_id}`,
            match_score: selectedMatch.match_score,
            compatibility_breakdown: compatibility,
            reasoning,
            activities: activities.slice(0, 6),
          },
          peer: {
            ...selectedPeer,
            big_five_scores: selectedPeer.big_five_scores,
          },
        }
        setMatch(mockMatch)
        setMatching(false)
        return
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-peers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId }),
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

  const handleClose = () => {
    setMatch(null)
    setShowAnimation(false)
    setShowQuestions(false)
    onClose()
  }

  if (loading) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <>
      {showAnimation && (
        <SlotMachineAnimation onComplete={handleAnimationComplete} matchData={match} />
      )}

      <motion.div
        className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-border px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-primary">Find a Peer</h2>
            <button
              onClick={handleClose}
              className="text-2xl hover:text-primary transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {!match ? (
              <div>
                {/* Split Screen Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left: User Profile */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-border">
                    <h3 className="text-xl font-bold mb-4">Your Profile</h3>
                    {userProfile && userProfile.big_five_scores ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-4xl">
                              👤
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">
                                {usingDemo ? DEMO_PROFILE.name : (user?.email?.split('@')[0] || 'User')}
                                {usingDemo && <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">DEMO</span>}
                              </h4>
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
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                          👤
                        </div>
                        <p className="text-muted-foreground mb-4">Complete your personality test (OCEAN) to see your profile and unlock peer matching</p>
                        {!user && !usingDemo ? (
                          <div className="space-y-2">
                            <button
                              onClick={handleEnableDemo}
                              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold"
                            >
                              🚀 Try Demo Mode (Test Features)
                            </button>
                            <button
                              onClick={() => {
                                handleClose()
                                window.location.href = '/signup'
                              }}
                              className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                              Sign Up to Get Started
                            </button>
                            <button
                              onClick={() => {
                                handleClose()
                                window.location.href = '/login'
                              }}
                              className="w-full px-6 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                            >
                              Already have an account? Login
                            </button>
                          </div>
                        ) : !usingDemo ? (
                          <button
                            onClick={() => {
                              handleClose()
                              window.location.href = '/onboarding'
                            }}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            Go to Onboarding
                          </button>
                        ) : (
                          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md p-3">
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              🚀 Demo Mode Active - You're testing with a demo profile
                            </p>
                          </div>
                        )}
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
                      onClick={handleClose}
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
              <div>
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
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

