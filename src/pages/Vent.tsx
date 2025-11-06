import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Vent() {
  const [content, setContent] = useState('')
  const [vents, setVents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVents = async () => {
      try {
        const { data } = await supabase
          .from('vents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)

        setVents(data || [])
      } catch (error) {
        console.error('Error fetching vents:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchVents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vent-anonymize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          userId: user.id,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setContent('')
        window.location.reload()
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
            <h1 className="text-2xl font-bold text-primary">Vent Box</h1>
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
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Anonymous Venting</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Express yourself freely. Your vent will be anonymized to protect your privacy.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  maxLength={500}
                  className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[200px]"
                  placeholder="Let it all out... (max 500 characters)"
                />
                <p className="text-sm text-muted-foreground">{content.length}/500 characters</p>

                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Posting...' : 'Post Anonymously'}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">Recent Vents</h2>
              
              {fetching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : vents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No vents yet. Be the first to share!</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {vents.map((vent) => (
                    <div key={vent.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p className="text-sm mb-2">{vent.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vent.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

