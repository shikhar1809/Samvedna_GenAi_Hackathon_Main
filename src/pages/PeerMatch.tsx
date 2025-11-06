import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function PeerMatch() {
  const [matching, setMatching] = useState(false)
  const [match, setMatch] = useState<any>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFindPeer = async () => {
    if (!user) return

    setMatching(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/match-peers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const result = await response.json()
      if (result.success && result.match) {
        setMatch(result)
      } else {
        alert(result.message || 'No peers available at the moment')
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setMatching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Find a Peer</h1>
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
          {!match ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 border border-border text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-2xl font-bold mb-4">Find Your Peer Support Partner</h2>
              <p className="text-muted-foreground mb-6">
                Get matched with someone who understands your journey. Our AI considers personality, 
                experiences, and mental health goals to find the best match for you.
              </p>
              <button
                onClick={handleFindPeer}
                disabled={matching}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {matching ? 'Finding Your Match...' : 'Find a Peer'}
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 border border-border">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">Match Found!</h2>
                <p className="text-muted-foreground">
                  We found a great peer support partner for you
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 mb-6">
                <h3 className="font-semibold mb-2">Match Score</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(match.match.match_score || 0.5) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold">{Math.round((match.match.match_score || 0.5) * 100)}%</span>
                </div>
              </div>

              {match.reasoning && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Why This Match?</h3>
                  <p className="text-sm text-muted-foreground">{match.reasoning}</p>
                </div>
              )}

              <button
                onClick={() => alert('Chat feature coming soon!')}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Start Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

