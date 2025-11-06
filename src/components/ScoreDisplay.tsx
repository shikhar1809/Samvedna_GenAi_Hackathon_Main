interface ScoreDisplayProps {
  label: string
  score: number
  maxScore?: number
  color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple'
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreDisplay({ 
  label, 
  score, 
  maxScore = 100,
  color = 'blue',
  size = 'lg'
}: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100

  const colorClasses = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink text-white',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
    purple: 'bg-neo-purple',
  }

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`border-neo shadow-neo ${colorClasses[color]} p-8 text-center`}>
      <h3 className="text-lg font-black uppercase mb-4">{label}</h3>
      <div className={`${sizeClasses[size]} font-black ${getScoreColor(score)} mb-2`}>
        {score}
      </div>
      <div className="text-sm font-bold">out of {maxScore}</div>
      <div className="mt-4 w-full bg-black/10 border-2 border-black">
        <div 
          className="bg-black h-4 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

