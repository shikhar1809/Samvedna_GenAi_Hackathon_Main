import { BigFiveScores } from '../lib/bigfive'

interface CompatibilityDisplayProps {
  match: {
    match_score: number
    reasoning?: string
    compatibility_breakdown?: {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
    }
    activities?: string[]
  }
  currentUserScores?: BigFiveScores
  peerScores?: BigFiveScores
}

export default function CompatibilityDisplay({ match, currentUserScores, peerScores }: CompatibilityDisplayProps) {
  const matchPercentage = Math.round((match.match_score || 0.5) * 100)

  const traitNames = {
    openness: 'Openness',
    conscientiousness: 'Conscientiousness',
    extraversion: 'Extraversion',
    agreeableness: 'Agreeableness',
    neuroticism: 'Neuroticism',
  }

  const calculateTraitCompatibility = (trait: keyof BigFiveScores): number => {
    if (!currentUserScores || !peerScores) return 0
    const userScore = currentUserScores[trait]
    const peerScore = peerScores[trait]
    // Calculate compatibility: closer scores = higher compatibility
    const diff = Math.abs(userScore - peerScore)
    return Math.max(0, 100 - diff)
  }

  const defaultActivities = [
    'Share daily check-ins and support each other',
    'Practice mindfulness exercises together',
    'Exchange journaling prompts and reflections',
    'Set and track mental health goals together',
    'Participate in peer support discussions',
    'Share coping strategies and techniques',
  ]

  const activities = match.activities || defaultActivities

  return (
    <div className="space-y-6">
      {/* Overall Match Score */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-6 border-2 border-primary">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold mb-2">Overall Compatibility</h3>
          <div className="text-6xl font-black text-primary mb-2">{matchPercentage}%</div>
          <p className="text-muted-foreground">Match Score</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="bg-primary h-4 rounded-full transition-all duration-1000"
            style={{ width: `${matchPercentage}%` }}
          />
        </div>
      </div>

      {/* Trait Compatibility Breakdown */}
      {(match.compatibility_breakdown || (currentUserScores && peerScores)) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
          <h3 className="text-xl font-bold mb-4">Personality Trait Compatibility</h3>
          <div className="space-y-4">
            {Object.keys(traitNames).map((trait) => {
              const traitKey = trait as keyof BigFiveScores
              const compatibility = match.compatibility_breakdown
                ? match.compatibility_breakdown[traitKey as keyof typeof match.compatibility_breakdown]
                : calculateTraitCompatibility(traitKey)

              return (
                <div key={trait}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{traitNames[traitKey]}</span>
                    <span className="text-sm font-bold text-primary">{Math.round(compatibility)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${compatibility}%` }}
                    />
                  </div>
                  {currentUserScores && peerScores && (
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>You: {currentUserScores[traitKey]}%</span>
                      <span>Peer: {peerScores[traitKey]}%</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Why This Match */}
      {match.reasoning && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span>💡</span> Why This Match?
          </h3>
          <p className="text-muted-foreground leading-relaxed">{match.reasoning}</p>
        </div>
      )}

      {/* Activities You Can Do Together */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🤝</span> Things You Can Do Together
        </h3>
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span className="text-muted-foreground">{activity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

