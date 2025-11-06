import { motion } from 'framer-motion'
import { progressMetrics, milestones, type Milestone } from '../lib/demoProfileData'
import DashboardWidget from './DashboardWidget'

export default function ProgressJourney() {
  const maxMood = 10
  const chartHeight = 200
  const chartWidth = 600
  const padding = 40

  // Prepare data for line chart
  const dataPoints = progressMetrics.map((metric, index) => ({
    x: padding + (index * (chartWidth - 2 * padding)) / (progressMetrics.length - 1),
    y: padding + chartHeight - padding - (metric.moodAverage / maxMood) * (chartHeight - 2 * padding),
    value: metric.moodAverage,
    date: new Date(metric.date)
  }))

  const getMilestoneIcon = (type: Milestone['type']): string => {
    const icons = {
      journal: '📓',
      cbt: '💭',
      peer: '🤝',
      streak: '🔥',
      achievement: '⭐'
    }
    return icons[type] || '⭐'
  }

  return (
    <DashboardWidget title="Progress Journey" icon="📈">
      <div className="space-y-6">
        {/* Mood Trend Chart */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Mood Trend (Last 3 Months)</h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-x-auto">
            <svg width={chartWidth} height={chartHeight + 40} className="min-w-full">
              {/* Grid lines */}
              {[0, 2, 4, 6, 8, 10].map(value => {
                const y = padding + chartHeight - padding - (value / maxMood) * (chartHeight - 2 * padding)
                return (
                  <g key={value}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-gray-300 dark:text-gray-600"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs fill-gray-500 dark:fill-gray-400"
                    >
                      {value}
                    </text>
                  </g>
                )
              })}

              {/* Line chart */}
              <polyline
                points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-primary"
              />

              {/* Data points */}
              {dataPoints.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <title>
                    {point.date.toLocaleDateString()}: {point.value.toFixed(1)}/10
                  </title>
                </g>
              ))}

              {/* Axes */}
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={chartHeight - padding}
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 dark:text-gray-300"
              />
              <line
                x1={padding}
                y1={chartHeight - padding}
                x2={chartWidth - padding}
                y2={chartHeight - padding}
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700 dark:text-gray-300"
              />
            </svg>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Current Avg Mood',
              value: progressMetrics[progressMetrics.length - 1]?.moodAverage.toFixed(1),
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
            },
            {
              label: 'Mood Improvement',
              value: `+${(
                progressMetrics[progressMetrics.length - 1]?.moodAverage -
                progressMetrics[0]?.moodAverage
              ).toFixed(1)}`,
              gradient: 'from-green-500 to-emerald-500',
              bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
            },
            {
              label: 'Total CBT Sessions',
              value: progressMetrics.reduce((sum, m) => sum + m.cbtSessions, 0),
              gradient: 'from-purple-500 to-pink-500',
              bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-4 bg-gradient-to-br ${stat.bgGradient} rounded-xl border border-border/50 shadow-md`}
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Milestones Timeline */}
        <div>
          <h4 className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100">Milestones</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-border/50 hover:shadow-md transition-all"
              >
                <div className="text-3xl flex-shrink-0">{getMilestoneIcon(milestone.type)}</div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{milestone.title}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {milestone.description}
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {new Date(milestone.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardWidget>
  )
}

