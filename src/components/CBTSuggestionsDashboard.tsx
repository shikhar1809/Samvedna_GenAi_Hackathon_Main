import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { demoCBTSuggestions } from '../lib/demoProfileData'
import DashboardWidget from './DashboardWidget'

export default function CBTSuggestionsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const navigate = useNavigate()

  const categories = Array.from(new Set(demoCBTSuggestions.map(s => s.category)))
  const filteredSuggestions = selectedCategory
    ? demoCBTSuggestions.filter(s => s.category === selectedCategory)
    : demoCBTSuggestions

  const getCategoryColor = (category: string): { bg: string; text: string; border: string } => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'Anxiety': {
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700'
      },
      'Stress': {
        bg: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-700'
      },
      'Depression': {
        bg: 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700'
      },
      'Self-Esteem': {
        bg: 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30',
        text: 'text-pink-700 dark:text-pink-300',
        border: 'border-pink-300 dark:border-pink-700'
      }
    }
    return colors[category] || {
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-300 dark:border-gray-700'
    }
  }

  return (
    <DashboardWidget title="Key CBT Suggestions" icon="💭">
      <div className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </motion.button>
          {categories.map(category => {
            const colors = getCategoryColor(category)
            const isSelected = selectedCategory === category
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
                  isSelected
                    ? `${colors.bg} ${colors.text} ${colors.border} shadow-md`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-transparent'
                }`}
              >
                {category}
              </motion.button>
            )
          })}
        </div>

        {/* Suggestions List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => {
            const colors = getCategoryColor(suggestion.category)
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 ${colors.bg} rounded-xl border-2 ${colors.border} hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.text} ${colors.bg} border ${colors.border}`}>
                      {suggestion.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(suggestion.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">Distortion:</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{suggestion.distortion}</p>
                </div>

                <div className="mb-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">Original Thought:</p>
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">"{suggestion.originalThought}"</p>
                </div>

                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1 uppercase tracking-wide">Reframed Thought:</p>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">"{suggestion.reframedThought}"</p>
                </div>

                {suggestion.actionableSteps && suggestion.actionableSteps.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Actionable Steps:</p>
                    <ul className="space-y-2">
                      {suggestion.actionableSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* View All Link */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/cbt-reframe')}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          View All CBT Exercises →
        </motion.button>
      </div>
    </DashboardWidget>
  )
}

