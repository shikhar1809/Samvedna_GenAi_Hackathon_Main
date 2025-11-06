import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthProvider'

interface Journal {
  id: string
  content: string
  mood_score: number
  mood_tags: string[]
  created_at: string
}

export default function JournalHistory() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchJournals = async () => {
      try {
        const { data, error } = await supabase
          .from('journals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setJournals(data || [])
      } catch (error) {
        console.error('Error fetching journals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournals()
  }, [user])

  const getMoodEmoji = (score: number) => {
    const emojis = ['😢', '😢', '😟', '😕', '😐', '🙂', '😊', '😃', '😄', '🤗', '🎉']
    return emojis[score] || '😐'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    )
  }

  if (journals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No journal entries yet. Start writing your first one!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div
          key={journal.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(journal.mood_score)}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(journal.created_at)}
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Mood: {journal.mood_score}/10
            </span>
          </div>
          <p className="text-sm line-clamp-3">{journal.content}</p>
          {journal.mood_tags && journal.mood_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {journal.mood_tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

