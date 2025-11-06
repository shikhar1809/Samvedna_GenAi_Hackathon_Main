import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function Companion() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m your AI companion. I\'m here to listen and support you. How are you feeling today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-companion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: userMessage,
          userId: user.id,
          conversationHistory: messages.slice(-6), // Last 3 exchanges
        }),
      })

      const result = await response.json()
      if (result.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: result.response }])
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
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AI Companion</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow border border-border p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

