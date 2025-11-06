import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Diagnosis() {
  const [diagnosing, setDiagnosing] = useState(false)
  const [diagnoses, setDiagnoses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const fetchDiagnoses = async () => {
      try {
        const { data } = await supabase
          .from('diagnoses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setDiagnoses(data || [])
      } catch (error) {
        console.error('Error fetching diagnoses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiagnoses()
  }, [user])

  const handleDiagnose = async () => {
    if (!user) return

    setDiagnosing(true)
    try {
      // Get latest journal entry
      const { data: journals } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!journals || journals.length === 0) {
        alert('Please write a journal entry first')
        navigate('/journal')
        return
      }

      const latestJournal = journals[0]

      // Call diagnosis Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          journalText: latestJournal.content,
          moodScore: latestJournal.mood_score,
          moodTags: latestJournal.mood_tags,
          userId: user.id,
          journalId: latestJournal.id,
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Refresh diagnoses
        window.location.reload()
      } else {
        alert('Error generating diagnosis: ' + result.error)
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setDiagnosing(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-600 dark:text-green-400'
    if (severity <= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AI Diagnosis</h1>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border mb-8">
            <h2 className="text-xl font-bold mb-4">Get AI-Powered Mental Health Insights</h2>
            <p className="text-muted-foreground mb-6">
              Our AI analyzes your recent journal entries using evidence-based psychology and DSM-5 criteria 
              to provide personalized insights and suggestions.
            </p>
            <button
              onClick={handleDiagnose}
              disabled={diagnosing}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {diagnosing ? 'Analyzing...' : 'Analyze Latest Journal Entry'}
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Past Diagnoses</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : diagnoses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No diagnoses yet. Analyze your journal entries to get started!
            </div>
          ) : (
            <div className="space-y-6">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(diagnosis.created_at).toLocaleDateString()}
                    </span>
                    <span className={`text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
                      Severity: {diagnosis.severity}/10
                    </span>
                  </div>
                  
                  {diagnosis.analysis.summary && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-sm">{diagnosis.analysis.summary}</p>
                    </div>
                  )}

                  {diagnosis.analysis.key_concerns && diagnosis.analysis.key_concerns.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Key Concerns</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {diagnosis.analysis.key_concerns.map((concern: string, i: number) => (
                          <li key={i}>{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diagnosis.dsm5_codes && diagnosis.dsm5_codes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">DSM-5 Indicators</h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosis.dsm5_codes.map((code: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {diagnosis.suggestions && diagnosis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Suggestions</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {diagnosis.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diagnosis.analysis.crisis_detected && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        🆘 Crisis Support: Please contact a mental health professional immediately or call 988.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

