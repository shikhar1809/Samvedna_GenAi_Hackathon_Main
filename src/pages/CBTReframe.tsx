import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function CBTReframe() {
  const [thought, setThought] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !thought.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cbt-reframe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          thought: thought.trim(),
          userId: user.id,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setAnalysis(result.analysis)
        setThought('')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">CBT Thought Reframing</h1>
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border mb-8">
            <h2 className="text-xl font-bold mb-4">Challenge Negative Thoughts</h2>
            <p className="text-muted-foreground mb-6">
              Enter a negative thought and we'll help you identify cognitive distortions and reframe it more positively.
            </p>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What negative thought is bothering you?
                </label>
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[120px]"
                  placeholder="Example: I always mess everything up. Nothing I do ever works out..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !thought.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Analyzing...' : 'Analyze Thought'}
              </button>
            </form>
          </div>

          {analysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border space-y-6">
              <h3 className="text-lg font-bold">Analysis Results</h3>

              {analysis.distortions && analysis.distortions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">Cognitive Distortions Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.distortions.map((distortion: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm">
                        {distortion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.evidence_for && analysis.evidence_for.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Evidence Supporting This Thought</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.evidence_for.map((evidence: string, i: number) => (
                      <li key={i}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.evidence_against && analysis.evidence_against.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Evidence Against This Thought</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.evidence_against.map((evidence: string, i: number) => (
                      <li key={i}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.balanced_thought && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Balanced Reframe</h4>
                  <p className="text-sm">{analysis.balanced_thought}</p>
                </div>
              )}

              {analysis.alternative_perspectives && analysis.alternative_perspectives.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Alternative Perspectives</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.alternative_perspectives.map((perspective: string, i: number) => (
                      <li key={i}>{perspective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.actionable_steps && analysis.actionable_steps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Action Steps</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {analysis.actionable_steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setAnalysis(null)}
                className="w-full border-2 border-primary text-primary py-2 rounded-md hover:bg-primary/10 transition-colors font-medium"
              >
                Analyze Another Thought
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

