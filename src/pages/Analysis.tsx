import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NeobrutalismCard } from '../components/NeobrutalismCard'
import { ScoreDisplay } from '../components/ScoreDisplay'
import { matchResources, getRelevantQuotes, getRelevantStories } from '../lib/therapyLibrary'

interface AnalysisData {
  summary: string
  dsm5_codes: string[]
  severity: number
  mentalHealthScore: number
  stressLevel: number
  key_concerns: string[]
  positive_aspects: string[]
  gratitudeTakeaway: string
  microWays: string[]
  suggestions: string[]
  coping_strategies: string[]
  crisis_detected: boolean
  professional_help_recommended: boolean
}

interface CBTData {
  distortions: string[]
  evidence_for: string[]
  evidence_against: string[]
  balanced_thought: string
  alternative_perspectives: string[]
  actionable_steps: string[]
}

export default function Analysis() {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [cbt, setCBT] = useState<CBTData | null>(null)
  const [mode, setMode] = useState<string>('')

  useEffect(() => {
    const content = location.state?.content
    const modeValue = location.state?.mode

    if (!content) {
      navigate('/')
      return
    }

    setMode(modeValue || 'daily-journal')
    
    // Generate analysis
    const analysisData = generateAnalysis(content)
    setAnalysis(analysisData)
    
    // Generate CBT reframing
    const cbtData = generateCBT(content)
    setCBT(cbtData)
    
    setLoading(false)
  }, [location, navigate])

  const generateAnalysis = (text: string): AnalysisData => {
    const textLower = text.toLowerCase()
    const hasAnxiety = textLower.includes('anxious') || textLower.includes('worried') || textLower.includes('stress')
    const hasSadness = textLower.includes('sad') || textLower.includes('depressed') || textLower.includes('down')
    const hasPositive = textLower.includes('happy') || textLower.includes('good') || textLower.includes('great') || textLower.includes('grateful')
    const hasStress = textLower.includes('stress') || textLower.includes('overwhelmed') || textLower.includes('pressure')
    
    // Estimate mood from text (simplified)
    let estimatedMood = 5
    if (hasPositive) estimatedMood = 7
    if (hasSadness) estimatedMood = 3
    if (hasAnxiety) estimatedMood = Math.min(estimatedMood, 4)
    
    let severity = estimatedMood <= 3 ? 7 : estimatedMood <= 5 ? 5 : 3
    let concerns: string[] = []
    let positive: string[] = []
    
    if (hasAnxiety) {
      concerns.push('Anxiety and worry patterns detected')
      severity = Math.max(severity, 6)
    }
    if (hasSadness) {
      concerns.push('Low mood indicators present')
      severity = Math.max(severity, 7)
    }
    if (hasPositive) {
      positive.push('Positive outlook and resilience noted')
    }
    
    if (hasStress) {
      concerns.push('High stress levels identified')
      severity = Math.max(severity, 6)
    }
    
    if (concerns.length === 0) {
      concerns.push('General emotional patterns observed')
    }
    if (positive.length === 0) {
      positive.push('Showing self-awareness and reflection')
    }
    
    const mentalHealthScore = Math.max(0, Math.min(100, 100 - (severity * 10)))
    
    let stressLevel = estimatedMood <= 3 ? 80 : estimatedMood <= 5 ? 60 : 40
    if (hasStress) {
      stressLevel = Math.min(100, stressLevel + 20)
    }
    if (hasAnxiety) {
      stressLevel = Math.min(100, stressLevel + 15)
    }
    
    let gratitudeTakeaway = 'Focus on the small moments of peace and progress in your day.'
    if (positive.length > 0) {
      if (positive.some(p => p.includes('gratitude') || p.includes('Grateful'))) {
        gratitudeTakeaway = 'You\'re already practicing gratitude - this is a powerful tool for mental wellness. Keep acknowledging the positive moments, no matter how small.'
      } else if (positive.some(p => p.includes('resilience') || p.includes('self-awareness'))) {
        gratitudeTakeaway = 'Your ability to reflect and show self-awareness is something to be grateful for. This awareness is the first step toward growth.'
      } else {
        gratitudeTakeaway = 'Even in difficult times, you\'re showing resilience. Be grateful for your strength and ability to keep going.'
      }
    }
    
    const microWays: string[] = []
    if (hasAnxiety || hasStress) {
      microWays.push('Take 3 deep breaths right now (4 seconds in, 4 seconds hold, 4 seconds out)')
      microWays.push('Step outside for 2 minutes of fresh air')
      microWays.push('Write down 3 things you can control in this moment')
    }
    if (hasSadness) {
      microWays.push('Text or call one person you trust')
      microWays.push('Listen to one uplifting song')
      microWays.push('Do one small act of self-care (drink water, stretch, wash face)')
    }
    if (microWays.length === 0) {
      microWays.push('Take 5 minutes to do something you enjoy')
      microWays.push('Write down one thing you\'re grateful for today')
      microWays.push('Move your body for 2 minutes (stretch, walk, dance)')
    }
    
    return {
      summary: `Based on your entry, you're experiencing emotional patterns that suggest ${hasAnxiety ? 'anxiety and worry.' : hasSadness ? 'low mood indicators.' : 'general emotional patterns.'} ${hasPositive ? 'You also show positive outlook and resilience.' : ''} It's important to acknowledge all your feelings.`,
      dsm5_codes: severity >= 7 ? ['F41.1 - Generalized Anxiety Disorder (Possible)', 'F32.9 - Major Depressive Disorder (Possible)'] : [],
      severity: severity,
      mentalHealthScore: mentalHealthScore,
      stressLevel: stressLevel,
      key_concerns: concerns,
      positive_aspects: positive,
      gratitudeTakeaway: gratitudeTakeaway,
      microWays: microWays,
      suggestions: [
        'Practice deep breathing exercises for 5 minutes daily',
        'Consider keeping a gratitude journal alongside your regular entries',
        'Engage in physical activity, even a 10-minute walk can help',
        'Connect with friends or family members you trust',
        'Try progressive muscle relaxation before bed'
      ],
      coping_strategies: [
        'Mindfulness meditation',
        'Journaling (which you\'re already doing - great!)',
        'Regular sleep schedule',
        'Limit social media consumption',
        'Engage in hobbies you enjoy'
      ],
      crisis_detected: severity >= 9,
      professional_help_recommended: severity >= 7
    }
  }

  const generateCBT = (text: string): CBTData => {
    const textLower = text.toLowerCase()
    const distortions: string[] = []
    const evidence_for: string[] = []
    const evidence_against: string[] = []
    
    // Detect cognitive distortions
    if (textLower.includes('always') || textLower.includes('never') || textLower.includes('everyone')) {
      distortions.push('All-or-Nothing Thinking')
      evidence_for.push('You may be seeing situations in black and white terms')
      evidence_against.push('Most situations exist on a spectrum, not as absolutes')
    }
    
    if (textLower.includes('should') || textLower.includes('must') || textLower.includes('have to')) {
      distortions.push('Should Statements')
      evidence_for.push('You may be holding yourself to rigid standards')
      evidence_against.push('Flexible thinking allows for more realistic expectations')
    }
    
    if (textLower.includes('worst') || textLower.includes('terrible') || textLower.includes('disaster')) {
      distortions.push('Catastrophizing')
      evidence_for.push('You may be imagining the worst possible outcomes')
      evidence_against.push('Most feared outcomes rarely come to pass')
    }
    
    if (textLower.includes('blame') || textLower.includes('fault') || textLower.includes('my fault')) {
      distortions.push('Personalization')
      evidence_for.push('You may be taking responsibility for things outside your control')
      evidence_against.push('Many factors contribute to outcomes, not just your actions')
    }
    
    if (distortions.length === 0) {
      distortions.push('General negative thinking patterns')
      evidence_for.push('Negative thoughts may be influencing your perspective')
      evidence_against.push('There are often multiple ways to view a situation')
    }
    
    // Generate balanced thought
    let balancedThought = 'While this situation feels challenging, there are likely multiple perspectives to consider. Your feelings are valid, and it\'s also possible that the situation may not be as dire as it seems.'
    
    if (distortions.some(d => d.includes('All-or-Nothing'))) {
      balancedThought = 'Instead of seeing this as all good or all bad, consider the nuances. Most situations have both positive and negative aspects.'
    } else if (distortions.some(d => d.includes('Catastrophizing'))) {
      balancedThought = 'While this feels overwhelming, the worst-case scenario is unlikely. Consider more realistic outcomes.'
    } else if (distortions.some(d => d.includes('Should'))) {
      balancedThought = 'Instead of "should," consider what would be helpful or realistic. Flexibility in thinking reduces pressure.'
    }
    
    const alternativePerspectives = [
      'What would you tell a friend in this situation?',
      'How might you view this in 6 months?',
      'What evidence supports a more balanced view?',
      'What strengths have helped you through similar situations?'
    ]
    
    const actionableSteps = [
      'Challenge the thought: Is this 100% true?',
      'Look for evidence that contradicts the negative thought',
      'Consider alternative explanations',
      'Practice self-compassion: How would you support a friend?',
      'Focus on what you can control in this moment'
    ]
    
    return {
      distortions,
      evidence_for,
      evidence_against,
      balanced_thought: balancedThought,
      alternative_perspectives: alternativePerspectives,
      actionable_steps: actionableSteps
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="border-4 border-black p-8 bg-neo-yellow">
            <div className="text-4xl font-black mb-4">Analyzing...</div>
            <div className="w-16 h-16 border-4 border-black border-t-transparent animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="border-4 border-black p-8 bg-neo-pink text-white">
            <div className="text-4xl font-black mb-4">No Analysis Available</div>
            <button
              onClick={() => navigate('/')}
              className="border-4 border-white px-6 py-3 bg-white text-neo-pink font-black uppercase hover:bg-gray-100"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const matchedResources = matchResources(analysis.key_concerns, [])
  const relevantQuotes = getRelevantQuotes(analysis.key_concerns)
  const relevantStories = getRelevantStories(analysis.key_concerns, [])

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-5xl font-black uppercase">
              AI Analysis Report
            </h1>
            <button
              onClick={() => navigate('/')}
              className="border-4 border-black px-6 py-3 bg-neo-yellow font-black uppercase hover:bg-neo-yellow/90"
            >
              New Entry
            </button>
          </div>
          <div className="border-4 border-black bg-neo-purple p-4">
            <p className="text-lg font-black uppercase">
              Mode: {mode === 'daily-journal' ? 'Daily Journal' : 'One-Time Vent'}
            </p>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ScoreDisplay
            label="Mental Health Score"
            score={analysis.mentalHealthScore}
            maxScore={100}
            color="blue"
            size="lg"
          />
          <ScoreDisplay
            label="Stress Level"
            score={analysis.stressLevel}
            maxScore={100}
            color="orange"
            size="lg"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Diagnosis Report */}
          <NeobrutalismCard title="AI Diagnosis Report" color="yellow" defaultExpanded={true}>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black uppercase mb-2">Summary</h4>
                <p className="text-sm font-bold">{analysis.summary}</p>
              </div>

              {analysis.dsm5_codes.length > 0 && (
                <div>
                  <h4 className="text-lg font-black uppercase mb-2">DSM-5 Indicators</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.dsm5_codes.map((code, i) => (
                      <span key={i} className="border-2 border-black px-3 py-1 bg-neo-blue text-white font-bold text-xs">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-black uppercase mb-2">Severity</h4>
                <p className="text-3xl font-black">{analysis.severity}/10</p>
              </div>

              {analysis.crisis_detected && (
                <div className="border-4 border-black bg-red-500 text-white p-4">
                  <p className="font-black uppercase">
                    🆘 Crisis Support: Please contact a mental health professional immediately or call 988.
                  </p>
                </div>
              )}
            </div>
          </NeobrutalismCard>

          {/* Gratitude Takeaway */}
          <NeobrutalismCard title="Gratitude Takeaway" color="green" defaultExpanded={true}>
            <p className="text-sm font-bold leading-relaxed">{analysis.gratitudeTakeaway}</p>
          </NeobrutalismCard>

          {/* Problems Detected & Micro-Ways */}
          <NeobrutalismCard title="Problems Detected & Micro-Ways to Tackle" color="pink" defaultExpanded={true}>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black uppercase mb-2">Key Concerns</h4>
                <ul className="list-disc list-inside space-y-1 text-sm font-bold">
                  {analysis.key_concerns.map((concern, i) => (
                    <li key={i}>{concern}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-black uppercase mb-2">Micro-Ways to Tackle</h4>
                <ul className="list-disc list-inside space-y-1 text-sm font-bold">
                  {analysis.microWays.map((way, i) => (
                    <li key={i}>{way}</li>
                  ))}
                </ul>
              </div>
            </div>
          </NeobrutalismCard>

          {/* CBT Recommendations */}
          {cbt && (
            <NeobrutalismCard title="CBT Recommendations" color="purple" defaultExpanded={true}>
              <div className="space-y-4">
                {cbt.distortions.length > 0 && (
                  <div>
                    <h4 className="text-lg font-black uppercase mb-2">Cognitive Distortions Detected</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cbt.distortions.map((distortion, i) => (
                        <span key={i} className="border-2 border-black px-3 py-1 bg-neo-orange font-bold text-xs">
                          {distortion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cbt.balanced_thought && (
                  <div>
                    <h4 className="text-lg font-black uppercase mb-2">Balanced Reframe</h4>
                    <p className="text-sm font-bold bg-neo-green p-3 border-2 border-black">{cbt.balanced_thought}</p>
                  </div>
                )}

                {cbt.actionable_steps.length > 0 && (
                  <div>
                    <h4 className="text-lg font-black uppercase mb-2">Action Steps</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm font-bold">
                      {cbt.actionable_steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </NeobrutalismCard>
          )}

          {/* Therapy Library Resources */}
          <NeobrutalismCard title="Therapy Library Resources" color="blue" defaultExpanded={true}>
            <div className="space-y-4">
              {matchedResources.length > 0 ? (
                <>
                  <p className="text-sm font-bold mb-3">Resources that might help:</p>
                  {matchedResources.map((resource) => (
                    <div key={resource.id} className="border-2 border-black p-3 bg-white mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-black uppercase text-sm flex-1">{resource.title}</h5>
                        <span className="border border-black px-2 py-1 bg-neo-purple text-xs font-black ml-2">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-xs font-bold mb-2">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black underline hover:no-underline"
                      >
                        View Resource →
                      </a>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-sm font-bold">Loading resources...</p>
              )}
            </div>
          </NeobrutalismCard>

          {/* Quotes That Might Help */}
          <NeobrutalismCard title="Quotes That Might Help" color="yellow" defaultExpanded={false}>
            <div className="space-y-4">
              {relevantQuotes.length > 0 ? (
                relevantQuotes.map((quote) => (
                  <div key={quote.id} className="border-2 border-black p-4 bg-white">
                    <p className="text-sm font-bold italic mb-2">"{quote.text}"</p>
                    <p className="text-xs font-black">— {quote.author}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold">Loading quotes...</p>
              )}
            </div>
          </NeobrutalismCard>

          {/* Similar Reddit Stories */}
          <NeobrutalismCard title="Similar Stories" color="orange" defaultExpanded={false}>
            <div className="space-y-4">
              {relevantStories.length > 0 ? (
                relevantStories.map((story) => (
                  <div key={story.id} className="border-2 border-black p-3 bg-white">
                    <h5 className="font-black uppercase text-sm mb-1">{story.title}</h5>
                    <p className="text-xs font-bold mb-2 text-gray-600">r/{story.subreddit}</p>
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black underline hover:no-underline"
                    >
                      Read Story →
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold">No similar stories found.</p>
              )}
            </div>
          </NeobrutalismCard>
        </div>
      </div>
    </div>
  )
}

