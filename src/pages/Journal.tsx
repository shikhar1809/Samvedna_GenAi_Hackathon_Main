import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import MoodPicker from '../components/MoodPicker'
import JournalHistory from '../components/JournalHistory'

const commonMoodTags = [
  'Anxious', 'Happy', 'Sad', 'Stressed', 'Calm', 'Excited',
  'Overwhelmed', 'Peaceful', 'Angry', 'Grateful', 'Lonely', 'Hopeful'
]

export default function Journal() {
  const [content, setContent] = useState('')
  const [moodScore, setMoodScore] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const isDemoMode = sessionStorage.getItem('demoMode') === 'true'

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // Generate demo AI analysis
  const generateDemoAnalysis = (text: string, mood: number, tags: string[]) => {
    // Simple sentiment analysis based on keywords
    const textLower = text.toLowerCase()
    const hasAnxiety = textLower.includes('anxious') || textLower.includes('worried') || textLower.includes('stress')
    const hasSadness = textLower.includes('sad') || textLower.includes('depressed') || textLower.includes('down')
    const hasPositive = textLower.includes('happy') || textLower.includes('good') || textLower.includes('great') || textLower.includes('grateful')
    const hasStress = textLower.includes('stress') || textLower.includes('overwhelmed') || textLower.includes('pressure')
    
    let severity = mood <= 3 ? 7 : mood <= 5 ? 5 : 3
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
    
    if (tags.includes('Stressed') || tags.includes('Overwhelmed')) {
      concerns.push('High stress levels identified')
      severity = Math.max(severity, 6)
    }
    if (tags.includes('Happy') || tags.includes('Grateful')) {
      positive.push('Gratitude and positive emotions present')
    }
    
    if (concerns.length === 0) {
      concerns.push('General emotional patterns observed')
    }
    if (positive.length === 0) {
      positive.push('Showing self-awareness and reflection')
    }
    
    // Calculate Mental Health Score (0-100, inverse of severity)
    const mentalHealthScore = Math.max(0, Math.min(100, 100 - (severity * 10)))
    
    // Calculate Stress Level (0-100, based on keywords and mood)
    let stressLevel = mood <= 3 ? 80 : mood <= 5 ? 60 : 40
    if (hasStress || tags.includes('Stressed') || tags.includes('Overwhelmed')) {
      stressLevel = Math.min(100, stressLevel + 20)
    }
    if (hasAnxiety) {
      stressLevel = Math.min(100, stressLevel + 15)
    }
    
    // Generate Gratitude Takeaway from positive aspects
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
    
    // Generate Micro-Ways to Tackle (small, actionable steps)
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
      summary: `Based on your journal entry, you're experiencing a mood level of ${mood}/10. ${hasAnxiety ? 'There are signs of anxiety and worry.' : ''} ${hasSadness ? 'Some low mood indicators are present.' : ''} ${hasPositive ? 'You also show positive outlook and resilience.' : ''} It's important to acknowledge all your feelings.`,
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

  const handleAnalyze = async () => {
    if (!content.trim()) {
      alert('Please write something in your journal first')
      return
    }

    setAnalyzing(true)
    setAnalysisResult(null)
    setShowAnalysis(true)

    try {
      // Check if we're in demo mode or have real Supabase
      if (isDemoMode || !user || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co') {
        // Demo mode - generate mock analysis
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
        const demoAnalysis = generateDemoAnalysis(content, moodScore, selectedTags)
        setAnalysisResult(demoAnalysis)
        setAnalyzing(false)
        return
      }

      // Real mode - call actual API
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          journalText: content,
          moodScore: moodScore,
          moodTags: selectedTags,
          userId: user.id,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setAnalysisResult(result.diagnosis.analysis)
      } else {
        // Fallback to demo if API fails
        const demoAnalysis = generateDemoAnalysis(content, moodScore, selectedTags)
        setAnalysisResult(demoAnalysis)
        alert('Using demo analysis. Real AI requires Supabase configuration.')
      }
    } catch (error: any) {
      // Fallback to demo on error
      const demoAnalysis = generateDemoAnalysis(content, moodScore, selectedTags)
      setAnalysisResult(demoAnalysis)
      console.log('Using demo analysis due to error:', error.message)
    } finally {
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-600 dark:text-green-400'
    if (severity <= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    // In demo mode, just show success without saving
    if (isDemoMode || !user) {
      setSaving(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setSuccess(true)
      setContent('')
      setMoodScore(5)
      setSelectedTags([])
      setSaving(false)
      setTimeout(() => setSuccess(false), 3000)
      return
    }

    setSaving(true)
    setSuccess(false)

    try {
      const { error } = await supabase.from('journals').insert({
        user_id: user.id,
        content: content.trim(),
        mood_score: moodScore,
        mood_tags: selectedTags,
      })

      if (error) throw error

      setSuccess(true)
      setContent('')
      setMoodScore(5)
      setSelectedTags([])

      // Refresh the page to show new entry
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      alert('Error saving journal: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Journal</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Journal Entry Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">New Journal Entry</h2>

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-md mb-4">
                  Journal entry saved successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mood Picker */}
                <MoodPicker value={moodScore} onChange={setMoodScore} />

                {/* Mood Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How are you feeling? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonMoodTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[300px]"
                    placeholder="Write your thoughts, feelings, and experiences here..."
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {content.length} characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving || !content.trim()}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Saving...' : 'Save Journal Entry'}
                </button>

                {/* AI Analysis Button */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing || !content.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {analyzing ? '🤖 Analyzing...' : '✨ Get AI Analysis Now'}
                </button>

                {/* AI Analysis Results */}
                {showAnalysis && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        🤖 AI Analysis Results
                      </h3>
                      <button
                        onClick={() => setShowAnalysis(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        ✕
                      </button>
                    </div>

                    {analyzing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Analyzing your thoughts...</p>
                      </div>
                    ) : analysisResult ? (
                      <div className="space-y-4">
                        {analysisResult.summary && (
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Summary</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{analysisResult.summary}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground">Severity Level</span>
                            <p className={`text-2xl font-bold ${getSeverityColor(analysisResult.severity)}`}>
                              {analysisResult.severity}/10
                            </p>
                          </div>
                          {isDemoMode && (
                            <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                              Demo Mode
                            </div>
                          )}
                        </div>

                        {analysisResult.key_concerns && analysisResult.key_concerns.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Key Concerns</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                              {analysisResult.key_concerns.map((concern: string, i: number) => (
                                <li key={i}>{concern}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.positive_aspects && analysisResult.positive_aspects.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">Positive Aspects</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                              {analysisResult.positive_aspects.map((aspect: string, i: number) => (
                                <li key={i}>{aspect}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Suggestions</h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
                              {analysisResult.suggestions.map((suggestion: string, i: number) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.crisis_detected && (
                          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-red-800 dark:text-red-200 font-medium text-sm">
                              🆘 Crisis Support: Please contact a mental health professional immediately or call 988.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Alternative: Navigate to Diagnosis Page */}
                <button
                  type="button"
                  onClick={() => navigate('/diagnosis')}
                  className="w-full border border-border text-muted-foreground py-2 rounded-md hover:bg-accent transition-colors text-sm"
                >
                  View All Past Analyses →
                </button>
              </form>
            </div>
          </div>

          {/* Journal History */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">Recent Entries</h2>
              <JournalHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

