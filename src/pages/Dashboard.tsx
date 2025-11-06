import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">SAMVEDNA</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/journal"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">📓</div>
            <h3 className="text-xl font-semibold mb-2">Journal</h3>
            <p className="text-muted-foreground">Write your thoughts and track your mood</p>
          </Link>

          <Link
            to="/diagnosis"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">AI Diagnosis</h3>
            <p className="text-muted-foreground">Get AI-powered mental health insights</p>
          </Link>

          <Link
            to="/cbt-reframe"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">💭</div>
            <h3 className="text-xl font-semibold mb-2">CBT Reframing</h3>
            <p className="text-muted-foreground">Challenge negative thought patterns</p>
          </Link>

          <Link
            to="/peer-match"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Find a Peer</h3>
            <p className="text-muted-foreground">Connect with someone who understands</p>
          </Link>

          <Link
            to="/groups"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Support Groups</h3>
            <p className="text-muted-foreground">Join community discussions</p>
          </Link>

          <Link
            to="/vent"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Vent Box</h3>
            <p className="text-muted-foreground">Anonymous safe space to express yourself</p>
          </Link>

          <Link
            to="/companion"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Companion</h3>
            <p className="text-muted-foreground">Chat with your empathetic AI friend</p>
          </Link>

          <Link
            to="/gratitude"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Gratitude</h3>
            <p className="text-muted-foreground">Practice daily gratitude</p>
          </Link>

          <Link
            to="/library"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Therapy Library</h3>
            <p className="text-muted-foreground">Educational resources and exercises</p>
          </Link>

          <Link
            to="/reports"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Therapist Reports</h3>
            <p className="text-muted-foreground">Generate comprehensive reports</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

