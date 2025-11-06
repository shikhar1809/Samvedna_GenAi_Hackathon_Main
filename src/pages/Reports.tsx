import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Reports() {
  const [generating, setGenerating] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const fetchReports = async () => {
      try {
        const { data } = await supabase
          .from('therapist_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setReports(data || [])
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user])

  const handleGenerate = async () => {
    if (!user) return

    setGenerating(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const result = await response.json()
      if (result.success) {
        window.location.reload()
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Therapist Reports</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border mb-8">
            <h2 className="text-xl font-bold mb-4">Generate Comprehensive Report</h2>
            <p className="text-muted-foreground mb-4">
              Create a detailed report of your mental health journey to share with your therapist. 
              This includes mood trends, journal analysis, diagnoses, CBT suggestions, progress journey, 
              peer accountability insights, and yard visualization.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              For more detailed views, visit your <button onClick={() => navigate('/profile')} className="text-primary hover:underline font-medium">Profile</button> page to see personalized dashboards, calendar view, and progress tracking.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {generating ? 'Generating Report...' : 'Generate New Report'}
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">Past Reports</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : reports.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No reports yet. Generate your first one!</p>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">Mental Health Report</h4>
                      <span className="text-sm text-muted-foreground">
                        Generated on {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {report.report_data.statistics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <div>
                        <p className="text-xs text-muted-foreground">Journal Entries</p>
                        <p className="text-lg font-bold">{report.report_data.statistics.total_journals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg Mood</p>
                        <p className="text-lg font-bold">{report.report_data.statistics.average_mood}/10</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">CBT Sessions</p>
                        <p className="text-lg font-bold">{report.report_data.statistics.cbt_sessions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gratitude Entries</p>
                        <p className="text-lg font-bold">{report.report_data.statistics.gratitude_entries}</p>
                      </div>
                    </div>
                  )}

                  {report.report_data.executive_summary && (
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2">Executive Summary</h5>
                      <p className="text-sm text-muted-foreground">{report.report_data.executive_summary}</p>
                    </div>
                  )}

                  <button
                    onClick={() => alert('PDF export coming soon!')}
                    className="w-full border-2 border-primary text-primary py-2 rounded-md hover:bg-primary/10 transition-colors font-medium"
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

