import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Gratitude() {
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const fetchEntries = async () => {
      try {
        const { data } = await supabase
          .from('gratitude_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30)

        setEntries(data || [])
      } catch (error) {
        console.error('Error fetching gratitude entries:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchEntries()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('gratitude_entries')
        .insert({
          user_id: user.id,
          content: content.trim(),
        })

      if (error) throw error

      setContent('')
      window.location.reload()
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
            <h1 className="text-2xl font-bold text-primary">✨ Gratitude Practice</h1>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-border mb-8">
            <h2 className="text-xl font-bold mb-4">Today's Gratitude</h2>
            <p className="text-sm text-muted-foreground mb-6">
              What are you grateful for today? Research shows daily gratitude practice improves mental well-being.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background min-h-[120px]"
                placeholder="I'm grateful for..."
              />

              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Saving...' : 'Save Gratitude Entry'}
              </button>
            </form>
          </div>

          <h3 className="text-lg font-semibold mb-4">Past Entries</h3>
          
          {fetching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No entries yet. Start your gratitude journey today!</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-border">
                  <p className="text-sm mb-2">{entry.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

