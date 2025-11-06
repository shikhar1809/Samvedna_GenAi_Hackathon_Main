import { motion } from 'framer-motion'
import { BookOpen, Flame, Smile, BarChart3 } from 'lucide-react'
import { demoJournals, progressMetrics, getCurrentStreak } from '../lib/demoProfileData'

export default function ProfileOverview() {
  const totalJournals = demoJournals.length
  const averageMood = totalJournals > 0
    ? Math.round(
        demoJournals.reduce((sum, journal) => sum + journal.mood_score, 0) / totalJournals
      )
    : 5
  const currentStreak = getCurrentStreak()
  const latestMood = demoJournals[0]?.mood_score || 5
  const moodTrend = progressMetrics.length >= 2
    ? progressMetrics[progressMetrics.length - 1].moodAverage - progressMetrics[progressMetrics.length - 2].moodAverage
    : 0

  const cards = [
    {
      title: 'Total Journals',
      value: totalJournals,
      subtitle: 'Journal entries',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      title: 'Current Streak',
      value: currentStreak,
      subtitle: 'Days in a row',
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
    {
      title: 'Average Mood',
      value: `${averageMood}/10`,
      subtitle: moodTrend > 0 ? '↗ Improving' : moodTrend < 0 ? '↘ Declining' : '→ Stable',
      icon: Smile,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      title: "Today's Mood",
      value: `${latestMood}/10`,
      subtitle: 'Latest entry',
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden`}
          >
            {/* Decorative gradient circle */}
            <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${card.gradient} rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-2xl`} />
            
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {card.value}
              </div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{card.title}</h4>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
