import { ReactNode, useState } from 'react'

interface NeobrutalismCardProps {
  title: string
  children: ReactNode
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'white'
  defaultExpanded?: boolean
  className?: string
}

export function NeobrutalismCard({ 
  title, 
  children, 
  color = 'white',
  defaultExpanded = true,
  className = ''
}: NeobrutalismCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const colorClasses = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink text-white',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
    purple: 'bg-neo-purple',
    white: 'bg-white',
  }

  return (
    <div className={`border-neo shadow-neo ${colorClasses[color]} ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-black/5 transition-colors"
      >
        <h3 className="text-xl font-black uppercase">{title}</h3>
        <span className="text-2xl font-black">{isExpanded ? '−' : '+'}</span>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 border-t-4 border-black">
          {children}
        </div>
      )}
    </div>
  )
}

