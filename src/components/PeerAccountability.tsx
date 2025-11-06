import { motion } from 'framer-motion'
import { peerActivity, type PeerActivity as PeerActivityType } from '../lib/demoProfileData'
import DashboardWidget from './DashboardWidget'

export default function PeerAccountability() {
  const activePeers = peerActivity.filter(p => p.activityStatus === 'active').length
  const totalJournalCount = peerActivity.reduce((sum, peer) => sum + peer.journalCount, 0)
  const averageStreak = Math.round(
    peerActivity.reduce((sum, peer) => sum + peer.streak, 0) / peerActivity.length
  )

  const getActivityColor = (status: PeerActivityType['activityStatus']): string => {
    const colors = {
      active: 'bg-green-500',
      moderate: 'bg-yellow-500',
      low: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getTrendIcon = (trend: PeerActivityType['moodTrend']): string => {
    const icons = {
      improving: '↗️',
      stable: '→',
      declining: '↘️'
    }
    return icons[trend] || '→'
  }

  const formatLastActive = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  return (
    <DashboardWidget title="Peer Accountability" icon="🤝">
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Active Peers', value: activePeers, gradient: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
            { label: 'Total Journals', value: totalJournalCount, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
            { label: 'Avg Streak', value: averageStreak, gradient: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`text-center p-4 bg-gradient-to-br ${stat.bg} rounded-xl border border-border/50 shadow-md`}
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Peer List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {peerActivity.map((peer, index) => (
            <motion.div
              key={peer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                    {peer.name.charAt(peer.name.length - 1)}
                  </div>
                  <div>
                    <div className="font-semibold">{peer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last active: {formatLastActive(peer.lastActive)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getActivityColor(peer.activityStatus)}`}
                    title={peer.activityStatus}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{peer.journalCount}</div>
                  <div className="text-xs text-muted-foreground font-medium">Journals</div>
                </div>
                <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{peer.streak}</div>
                  <div className="text-xs text-muted-foreground font-medium">Day Streak</div>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {getTrendIcon(peer.moodTrend)}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize font-medium">{peer.moodTrend}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Anonymous Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
        >
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            <span className="font-bold text-blue-600 dark:text-blue-400">{activePeers} peers</span> journaled today. 
            You're part of a supportive community! 🌟
          </p>
        </motion.div>
      </div>
    </DashboardWidget>
  )
}

