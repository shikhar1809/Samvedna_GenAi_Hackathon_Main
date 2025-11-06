interface FlowerProps {
  growthStage: number // 0-5
  size?: number
  className?: string
}

export default function Flower({ growthStage, size = 60, className = '' }: FlowerProps) {
  const stage = Math.min(Math.max(growthStage, 0), 5)
  
  // Different flower types based on growth stage
  if (stage === 0) {
    // Seed
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <circle cx="30" cy="45" r="4" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 1) {
    // Sprout
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 45 L30 35 L28 38 L30 35 L32 38 Z" fill="#228B22" stroke="#1a6b1a" strokeWidth="1" />
        <circle cx="30" cy="45" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 2) {
    // Small flower
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 45 L30 30" stroke="#228B22" strokeWidth="3" fill="none" />
        <circle cx="30" cy="28" r="6" fill="#FFB6C1" />
        <circle cx="26" cy="26" r="4" fill="#FF69B4" />
        <circle cx="34" cy="26" r="4" fill="#FF69B4" />
        <circle cx="30" cy="24" r="4" fill="#FF1493" />
        <circle cx="30" cy="45" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 3) {
    // Medium flower
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 45 L30 25" stroke="#228B22" strokeWidth="4" fill="none" />
        <circle cx="30" cy="22" r="8" fill="#FFB6C1" />
        <circle cx="24" cy="20" r="5" fill="#FF69B4" />
        <circle cx="36" cy="20" r="5" fill="#FF69B4" />
        <circle cx="30" cy="18" r="5" fill="#FF1493" />
        <circle cx="26" cy="24" r="4" fill="#FFB6C1" />
        <circle cx="34" cy="24" r="4" fill="#FFB6C1" />
        <circle cx="30" cy="25" r="3" fill="#FFD700" />
        <circle cx="30" cy="45" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  if (stage === 4) {
    // Large flower
    return (
      <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
        <path d="M30 45 L30 20" stroke="#228B22" strokeWidth="4" fill="none" />
        <circle cx="30" cy="18" r="10" fill="#FFB6C1" />
        <circle cx="22" cy="16" r="6" fill="#FF69B4" />
        <circle cx="38" cy="16" r="6" fill="#FF69B4" />
        <circle cx="30" cy="14" r="6" fill="#FF1493" />
        <circle cx="24" cy="20" r="5" fill="#FFB6C1" />
        <circle cx="36" cy="20" r="5" fill="#FFB6C1" />
        <circle cx="26" cy="22" r="4" fill="#FF69B4" />
        <circle cx="34" cy="22" r="4" fill="#FF69B4" />
        <circle cx="30" cy="18" r="4" fill="#FFD700" />
        <circle cx="30" cy="45" r="3" fill="#8B4513" />
      </svg>
    )
  }
  
  // Stage 5 - Fully bloomed
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" className={className}>
      <defs>
        <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="50%" stopColor="#FF69B4" />
          <stop offset="100%" stopColor="#FF1493" />
        </linearGradient>
      </defs>
      <path d="M30 45 L30 18" stroke="#000" strokeWidth="5" fill="none" />
      <circle cx="30" cy="16" r="12" fill="url(#flowerGradient)" stroke="#000" strokeWidth="2" />
      <circle cx="20" cy="14" r="7" fill="#FF69B4" stroke="#000" strokeWidth="2" />
      <circle cx="40" cy="14" r="7" fill="#FF69B4" stroke="#000" strokeWidth="2" />
      <circle cx="30" cy="12" r="7" fill="#FF1493" stroke="#000" strokeWidth="2" />
      <circle cx="24" cy="18" r="6" fill="#FFB6C1" stroke="#000" strokeWidth="1.5" />
      <circle cx="36" cy="18" r="6" fill="#FFB6C1" stroke="#000" strokeWidth="1.5" />
      <circle cx="22" cy="20" r="5" fill="#FF69B4" stroke="#000" strokeWidth="1.5" />
      <circle cx="38" cy="20" r="5" fill="#FF69B4" stroke="#000" strokeWidth="1.5" />
      <circle cx="26" cy="22" r="4" fill="#FFB6C1" stroke="#000" strokeWidth="1" />
      <circle cx="34" cy="22" r="4" fill="#FFB6C1" stroke="#000" strokeWidth="1" />
      <circle cx="30" cy="16" r="5" fill="#FFD700" stroke="#000" strokeWidth="2" />
      <circle cx="30" cy="45" r="4" fill="#8B4513" stroke="#000" strokeWidth="2" />
    </svg>
  )
}

