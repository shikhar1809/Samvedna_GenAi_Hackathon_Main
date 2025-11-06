interface BushProps {
  growthStage: number // 0-5
  size?: number
  className?: string
}

export default function Bush({ growthStage, size = 50, className = '' }: BushProps) {
  const stage = Math.min(Math.max(growthStage, 0), 5)
  
  if (stage === 0) {
    // Seed
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 1) {
    // Small sprout
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 50 L30 45 L28 42 L30 45 L32 42 Z" fill="#228B22" stroke="#1a6b1a" strokeWidth="1" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 2) {
    // Small bush
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <ellipse cx="30" cy="42" rx="8" ry="6" fill="#228B22" />
        <ellipse cx="26" cy="40" rx="5" ry="4" fill="#32CD32" />
        <ellipse cx="34" cy="40" rx="5" ry="4" fill="#32CD32" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 3) {
    // Medium bush
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <ellipse cx="30" cy="40" rx="12" ry="8" fill="#228B22" />
        <ellipse cx="24" cy="38" rx="7" ry="5" fill="#32CD32" />
        <ellipse cx="36" cy="38" rx="7" ry="5" fill="#32CD32" />
        <ellipse cx="30" cy="36" rx="7" ry="5" fill="#90EE90" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 4) {
    // Large bush
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <ellipse cx="30" cy="38" rx="15" ry="10" fill="#228B22" />
        <ellipse cx="22" cy="36" rx="9" ry="6" fill="#32CD32" />
        <ellipse cx="38" cy="36" rx="9" ry="6" fill="#32CD32" />
        <ellipse cx="30" cy="34" rx="9" ry="6" fill="#90EE90" />
        <ellipse cx="26" cy="38" rx="7" ry="5" fill="#32CD32" />
        <ellipse cx="34" cy="38" rx="7" ry="5" fill="#32CD32" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  // Stage 5 - Fully grown
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
      <defs>
        <radialGradient id="bushGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#90EE90" />
          <stop offset="50%" stopColor="#32CD32" />
          <stop offset="100%" stopColor="#228B22" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="36" rx="18" ry="12" fill="url(#bushGradient)" stroke="#000" strokeWidth="3" />
      <ellipse cx="20" cy="34" rx="11" ry="7" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <ellipse cx="40" cy="34" rx="11" ry="7" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <ellipse cx="30" cy="32" rx="11" ry="7" fill="#90EE90" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="36" rx="9" ry="6" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <ellipse cx="36" cy="36" rx="9" ry="6" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <ellipse cx="22" cy="38" rx="8" ry="5" fill="#90EE90" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="38" cy="38" rx="8" ry="5" fill="#90EE90" stroke="#000" strokeWidth="1.5" />
      <circle cx="30" cy="50" r="4" fill="#8B4513" stroke="#000" strokeWidth="2" />
    </svg>
  )
}

