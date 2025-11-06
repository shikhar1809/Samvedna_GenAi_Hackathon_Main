import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardWidgetProps {
  title: string
  children: ReactNode
  className?: string
  icon?: string
}

export default function DashboardWidget({ title, children, className = '', icon }: DashboardWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-border/50 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="text-3xl">{icon}</span>}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}
