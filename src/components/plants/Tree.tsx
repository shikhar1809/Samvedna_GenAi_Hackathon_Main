interface TreeProps {
  growthStage: number // 0-5
  size?: number
  className?: string
}

export default function Tree({ growthStage, size = 80, className = '' }: TreeProps) {
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
        <path d="M30 50 L30 40" stroke="#8B4513" strokeWidth="3" fill="none" />
        <path d="M30 40 L25 35 M30 40 L35 35" stroke="#228B22" strokeWidth="2" fill="none" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 2) {
    // Small tree
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 50 L30 35" stroke="#8B4513" strokeWidth="4" fill="none" />
        <circle cx="30" cy="32" r="8" fill="#228B22" />
        <circle cx="26" cy="30" r="5" fill="#32CD32" />
        <circle cx="34" cy="30" r="5" fill="#32CD32" />
        <circle cx="30" cy="50" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 3) {
    // Medium tree
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 50 L30 28" stroke="#8B4513" strokeWidth="5" fill="none" />
        <circle cx="30" cy="25" r="12" fill="#228B22" />
        <circle cx="24" cy="22" r="7" fill="#32CD32" />
        <circle cx="36" cy="22" r="7" fill="#32CD32" />
        <circle cx="30" cy="20" r="7" fill="#90EE90" />
        <circle cx="30" cy="50" r="4" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 4) {
    // Large tree
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 50 L30 22" stroke="#8B4513" strokeWidth="6" fill="none" />
        <circle cx="30" cy="20" r="15" fill="#228B22" />
        <circle cx="22" cy="18" r="9" fill="#32CD32" />
        <circle cx="38" cy="18" r="9" fill="#32CD32" />
        <circle cx="30" cy="15" r="9" fill="#90EE90" />
        <circle cx="26" cy="22" r="7" fill="#32CD32" />
        <circle cx="34" cy="22" r="7" fill="#32CD32" />
        <circle cx="30" cy="50" r="4" fill="#8B4513" />
      </svg>
    )
  }
  
  // Stage 5 - Fully grown
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
      <defs>
        <linearGradient id="treeTrunk" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A0522D" />
          <stop offset="100%" stopColor="#8B4513" />
        </linearGradient>
        <radialGradient id="treeLeaves" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#90EE90" />
          <stop offset="50%" stopColor="#32CD32" />
          <stop offset="100%" stopColor="#228B22" />
        </radialGradient>
      </defs>
      <path d="M30 50 L30 18" stroke="#000" strokeWidth="8" fill="none" />
      <circle cx="30" cy="16" r="18" fill="url(#treeLeaves)" stroke="#000" strokeWidth="3" />
      <circle cx="20" cy="14" r="11" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <circle cx="40" cy="14" r="11" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <circle cx="30" cy="12" r="11" fill="#90EE90" stroke="#000" strokeWidth="2" />
      <circle cx="24" cy="18" r="9" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <circle cx="36" cy="18" r="9" fill="#32CD32" stroke="#000" strokeWidth="2" />
      <circle cx="22" cy="20" r="8" fill="#90EE90" stroke="#000" strokeWidth="1.5" />
      <circle cx="38" cy="20" r="8" fill="#90EE90" stroke="#000" strokeWidth="1.5" />
      <circle cx="30" cy="50" r="5" fill="#8B4513" stroke="#000" strokeWidth="2" />
    </svg>
  )
}

