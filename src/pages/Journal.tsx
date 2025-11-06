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
  const { user } = useAuth()
  const navigate = useNavigate()

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim()) return

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

                {/* AI Analysis Link */}
                <button
                  type="button"
                  onClick={() => navigate('/diagnosis')}
                  className="w-full border-2 border-primary text-primary py-3 rounded-md hover:bg-primary/10 transition-colors font-medium"
                >
                  Get AI Analysis →
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

