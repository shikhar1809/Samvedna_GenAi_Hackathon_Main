import { BigFiveScores } from './bigfive'

export interface DemoProfile {
  user_id: string
  big_five_scores: BigFiveScores
  personality_type: string
  mental_health_history: string
  preferences: {
    peerMatchingAnswers?: {
      communicationStyle: string
      preferredContactTime: string
      mentalHealthGoals: string[]
      availability: string
    }
  }
  name: string
  email: string
  emoji: string
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    user_id: 'demo-user-001',
    big_five_scores: {
      openness: 75,
      conscientiousness: 80,
      extraversion: 70,
      agreeableness: 85,
      neuroticism: 30,
    },
    personality_type: 'The Supportive Explorer',
    mental_health_history: 'Interested in managing daily stress and building better emotional resilience. Looking for peer support to share experiences and coping strategies.',
    preferences: {},
    name: 'Alex',
    email: 'alex@demo.com',
    emoji: '🌟',
  },
  {
    user_id: 'demo-user-002',
    big_five_scores: {
      openness: 60,
      conscientiousness: 90,
      extraversion: 50,
      agreeableness: 75,
      neuroticism: 25,
    },
    personality_type: 'The Organized Helper',
    mental_health_history: 'Struggling with perfectionism and work-related anxiety. Seeking someone who understands the pressure of high expectations.',
    preferences: {},
    name: 'Jordan',
    email: 'jordan@demo.com',
    emoji: '📚',
  },
  {
    user_id: 'demo-user-003',
    big_five_scores: {
      openness: 85,
      conscientiousness: 65,
      extraversion: 85,
      agreeableness: 80,
      neuroticism: 40,
    },
    personality_type: 'The Creative Socializer',
    mental_health_history: 'Dealing with social anxiety despite being outgoing. Looking for someone to practice social skills and build confidence together.',
    preferences: {},
    name: 'Sam',
    email: 'sam@demo.com',
    emoji: '🎨',
  },
  {
    user_id: 'demo-user-004',
    big_five_scores: {
      openness: 70,
      conscientiousness: 75,
      extraversion: 40,
      agreeableness: 90,
      neuroticism: 35,
    },
    personality_type: 'The Thoughtful Listener',
    mental_health_history: 'Experiencing depression and isolation. Wants to connect with someone who values deep conversations and mutual support.',
    preferences: {},
    name: 'Taylor',
    email: 'taylor@demo.com',
    emoji: '💙',
  },
  {
    user_id: 'demo-user-005',
    big_five_scores: {
      openness: 90,
      conscientiousness: 70,
      extraversion: 75,
      agreeableness: 70,
      neuroticism: 50,
    },
    personality_type: 'The Adventurous Optimist',
    mental_health_history: 'Managing ADHD and impulsivity. Looking for accountability partner and someone to share creative projects with.',
    preferences: {},
    name: 'Riley',
    email: 'riley@demo.com',
    emoji: '🚀',
  },
  {
    user_id: 'demo-user-006',
    big_five_scores: {
      openness: 55,
      conscientiousness: 85,
      extraversion: 60,
      agreeableness: 88,
      neuroticism: 20,
    },
    personality_type: 'The Stable Supporter',
    mental_health_history: 'Recovering from burnout and learning to set boundaries. Wants to help others while maintaining healthy limits.',
    preferences: {},
    name: 'Casey',
    email: 'casey@demo.com',
    emoji: '🛡️',
  },
  {
    user_id: 'demo-user-007',
    big_five_scores: {
      openness: 80,
      conscientiousness: 60,
      extraversion: 90,
      agreeableness: 75,
      neuroticism: 45,
    },
    personality_type: 'The Energetic Connector',
    mental_health_history: 'Struggling with mood swings and maintaining relationships. Seeking someone who understands emotional intensity.',
    preferences: {},
    name: 'Morgan',
    email: 'morgan@demo.com',
    emoji: '⚡',
  },
  {
    user_id: 'demo-user-008',
    big_five_scores: {
      openness: 65,
      conscientiousness: 88,
      extraversion: 45,
      agreeableness: 82,
      neuroticism: 28,
    },
    personality_type: 'The Reliable Introvert',
    mental_health_history: 'Coping with social anxiety and building confidence. Prefers one-on-one connections over group settings.',
    preferences: {},
    name: 'Quinn',
    email: 'quinn@demo.com',
    emoji: '🔒',
  },
  {
    user_id: 'demo-user-009',
    big_five_scores: {
      openness: 88,
      conscientiousness: 55,
      extraversion: 80,
      agreeableness: 70,
      neuroticism: 55,
    },
    personality_type: 'The Free-Spirited Artist',
    mental_health_history: 'Dealing with creative blocks and self-doubt. Looking for someone who appreciates artistic expression and vulnerability.',
    preferences: {},
    name: 'Avery',
    email: 'avery@demo.com',
    emoji: '🎭',
  },
  {
    user_id: 'demo-user-010',
    big_five_scores: {
      openness: 72,
      conscientiousness: 82,
      extraversion: 65,
      agreeableness: 88,
      neuroticism: 32,
    },
    personality_type: 'The Balanced Companion',
    mental_health_history: 'Working through grief and loss. Seeking someone who can provide empathy and understanding during difficult times.',
    preferences: {},
    name: 'Blake',
    email: 'blake@demo.com',
    emoji: '🤝',
  },
  {
    user_id: 'demo-user-011',
    big_five_scores: {
      openness: 68,
      conscientiousness: 78,
      extraversion: 55,
      agreeableness: 85,
      neuroticism: 38,
    },
    personality_type: 'The Mindful Meditator',
    mental_health_history: 'Practicing mindfulness to manage anxiety and stress. Interested in sharing meditation techniques and wellness practices.',
    preferences: {},
    name: 'Dakota',
    email: 'dakota@demo.com',
    emoji: '🧘',
  },
]

// Keep the original DEMO_PROFILE for backward compatibility (defaults to first profile)
export const DEMO_PROFILE: DemoProfile = DEMO_PROFILES[0]

export function getDemoProfile(): DemoProfile | null {
  if (typeof window === 'undefined') return null
  const demoMode = sessionStorage.getItem('demoMode') === 'true'
  return demoMode ? DEMO_PROFILE : null
}

export function getAllDemoProfiles(): DemoProfile[] {
  return DEMO_PROFILES
}

export function getDemoProfileById(userId: string): DemoProfile | undefined {
  return DEMO_PROFILES.find(profile => profile.user_id === userId)
}

export function getRandomDemoProfile(): DemoProfile {
  const randomIndex = Math.floor(Math.random() * DEMO_PROFILES.length)
  return DEMO_PROFILES[randomIndex]
}

export function setDemoMode(enabled: boolean) {
  if (typeof window === 'undefined') return
  if (enabled) {
    sessionStorage.setItem('demoMode', 'true')
  } else {
    sessionStorage.removeItem('demoMode')
  }
}

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('demoMode') === 'true'
}

