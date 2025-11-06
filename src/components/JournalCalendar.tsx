import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getJournalsForDate, type DemoJournal } from '../lib/demoProfileData'
import DashboardWidget from './DashboardWidget'

export default function JournalCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedJournals, setSelectedJournals] = useState<DemoJournal[]>([])

  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const [viewMonth, setViewMonth] = useState(currentMonth)
  const [viewYear, setViewYear] = useState(currentYear)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getMoodColor = (score: number): string => {
    if (score <= 3) return 'bg-red-500'
    if (score <= 5) return 'bg-yellow-500'
    if (score <= 7) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const hasJournalOnDate = (date: Date): boolean => {
    const journals = getJournalsForDate(date)
    return journals.length > 0
  }

  const getMoodScoreForDate = (date: Date): number | null => {
    const journals = getJournalsForDate(date)
    if (journals.length === 0) return null
    return journals[0].mood_score
  }

  const handleDateClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    const journals = getJournalsForDate(date)
    setSelectedDate(date)
    setSelectedJournals(journals)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear(viewYear - 1)
      } else {
        setViewMonth(viewMonth - 1)
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear(viewYear + 1)
      } else {
        setViewMonth(viewMonth + 1)
      }
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <DashboardWidget title="Journal Calendar" icon="📅">
      <div className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('prev')}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            ←
          </motion.button>
          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {monthNames[viewMonth]} {viewYear}
          </h4>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('next')}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
          >
            →
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const date = new Date(viewYear, viewMonth, day)
            const hasJournal = hasJournalOnDate(date)
            const moodScore = getMoodScoreForDate(date)
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square rounded-xl text-sm font-semibold
                  transition-all shadow-sm
                  ${hasJournal ? 'ring-2 ring-primary shadow-md' : ''}
                  ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : ''}
                  ${moodScore ? getMoodColor(moodScore) + ' text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                `}
                title={hasJournal && moodScore ? `Mood: ${moodScore}/10` : ''}
              >
                {day}
              </motion.button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span>Low (1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span>Medium (4-5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>Good (6-7)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Great (8-10)</span>
          </div>
        </div>

        {/* Selected Date Journals */}
        <AnimatePresence>
          {selectedDate && selectedJournals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
            >
              <h5 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
                Journals on {selectedDate.toLocaleDateString()}
              </h5>
              <div className="space-y-3">
                {selectedJournals.map(journal => (
                  <div key={journal.id} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">Mood: {journal.mood_score}/10</span>
                      {journal.mood_tags && journal.mood_tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {journal.mood_tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{journal.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedDate && selectedJournals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-5 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm text-muted-foreground text-center border border-border/50"
            >
              No journals on {selectedDate.toLocaleDateString()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardWidget>
  )
}

