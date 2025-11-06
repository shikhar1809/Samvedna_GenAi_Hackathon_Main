import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Mode = 'daily-journal' | 'one-time-vent' | null

export default function Landing() {
  const [mode, setMode] = useState<Mode>(null)
  const [content, setContent] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mode || !content.trim()) return

    setAnalyzing(true)
    
    // Navigate to analysis page with content and mode
    navigate('/analysis', {
      state: {
        content: content.trim(),
        mode: mode,
      }
    })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black uppercase mb-2">
            SAMVEDNA
          </h1>
          <p className="text-lg font-bold">
            Your AI-powered mental health companion
          </p>
        </div>

        {/* Write Box */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode('daily-journal')}
              className={`border-neo shadow-neo p-6 text-left transition-all ${
                mode === 'daily-journal'
                  ? 'bg-neo-yellow'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <h2 className="text-2xl font-black uppercase mb-2">
                Daily Journal
              </h2>
              <p className="text-sm font-bold">
                Track your thoughts and feelings over time
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('one-time-vent')}
              className={`border-neo shadow-neo p-6 text-left transition-all ${
                mode === 'one-time-vent'
                  ? 'bg-neo-pink text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <h2 className="text-2xl font-black uppercase mb-2">
                One-Time Vent
              </h2>
              <p className="text-sm font-bold">
                Express yourself without tracking
              </p>
            </button>
          </div>

          {/* Text Area */}
          <div className="border-neo shadow-neo bg-white p-6">
            <label className="block text-xl font-black uppercase mb-4">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-3 border-4 border-black bg-white focus:outline-none focus:ring-0 min-h-[300px] font-medium text-lg resize-none"
              placeholder="Write your thoughts, feelings, and experiences here..."
            />
            <p className="text-sm font-bold mt-2 text-gray-600">
              {content.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!mode || !content.trim() || analyzing}
            className="w-full border-neo shadow-neo bg-neo-blue text-white py-6 text-2xl font-black uppercase hover:bg-neo-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
        </form>

        {/* Demo Mode Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sessionStorage.setItem('demoMode', 'true')
              window.location.href = '/dashboard'
            }}
            className="text-sm font-bold underline hover:no-underline"
          >
            Or try demo mode →
          </button>
        </div>
      </div>
    </div>
  )
}
