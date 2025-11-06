import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Calendar, TrendingUp, Sprout } from 'lucide-react'
import { useAuth } from '../components/AuthProvider'
import { supabase } from '../lib/supabase'
import ProfileOverview from '../components/ProfileOverview'
import JournalCalendar from '../components/JournalCalendar'
import CBTSuggestionsDashboard from '../components/CBTSuggestionsDashboard'
import ProgressJourney from '../components/ProgressJourney'
import PeerAccountability from '../components/PeerAccountability'
import MoodQuestions from '../components/MoodQuestions'
import YardView from '../components/YardView'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'progress' | 'yard'>('overview')

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'progress' as const, label: 'Progress', icon: TrendingUp },
    { id: 'yard' as const, label: 'Yard', icon: Sprout },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SAMVEDNA
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Dashboard
              </button>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Your Profile
          </h2>
          <p className="text-lg text-muted-foreground">
            View your personalized dashboards, progress, and mental health journey
          </p>
        </motion.div>

        {/* Tab Navigation - Pill Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-8 p-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`relative z-10 w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Overview Stats */}
              <ProfileOverview />

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CBT Suggestions */}
                <CBTSuggestionsDashboard />

                {/* Peer Accountability */}
                <PeerAccountability />

                {/* Mood Questions */}
                <MoodQuestions />

                {/* Quick Actions */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-border/50 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate('/journal')}
                      className="group p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/20 rounded-xl transition-all duration-300 text-left border border-blue-200/50 dark:border-blue-800/30 hover:shadow-md hover:scale-105"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📓</div>
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">Write Journal</div>
                    </button>
                    <button
                      onClick={() => navigate('/cbt-reframe')}
                      className="group p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/20 rounded-xl transition-all duration-300 text-left border border-purple-200/50 dark:border-purple-800/30 hover:shadow-md hover:scale-105"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💭</div>
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">CBT Exercise</div>
                    </button>
                    <button
                      onClick={() => navigate('/reports')}
                      className="group p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/20 rounded-xl transition-all duration-300 text-left border border-green-200/50 dark:border-green-800/30 hover:shadow-md hover:scale-105"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">Generate Report</div>
                    </button>
                    <button
                      onClick={() => navigate('/peer-match')}
                      className="group p-5 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/30 dark:hover:to-pink-800/20 rounded-xl transition-all duration-300 text-left border border-pink-200/50 dark:border-pink-800/30 hover:shadow-md hover:scale-105"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤝</div>
                      <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">Find Peer</div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <JournalCalendar />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <ProgressJourney />
            </motion.div>
          )}

          {activeTab === 'yard' && (
            <motion.div
              key="yard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <YardView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
