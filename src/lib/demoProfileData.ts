// Demo data for profile section features

export interface DemoJournal {
  id: string
  content: string
  mood_score: number
  mood_tags: string[]
  created_at: string
}

export interface DemoCBTSuggestion {
  id: string
  category: string
  distortion: string
  originalThought: string
  reframedThought: string
  actionableSteps: string[]
  date: string
}

export interface ProgressMetric {
  date: string
  moodAverage: number
  journalCount: number
  cbtSessions: number
}

export interface Milestone {
  id: string
  title: string
  description: string
  date: string
  type: 'journal' | 'cbt' | 'peer' | 'streak' | 'achievement'
}

export interface PeerActivity {
  id: string
  name: string
  activityStatus: 'active' | 'moderate' | 'low'
  journalCount: number
  lastActive: string
  moodTrend: 'improving' | 'stable' | 'declining'
  streak: number
}

export interface Plant {
  id: string
  type: 'flower' | 'tree' | 'bush'
  name: string
  growthStage: number // 0-5
  x: number // position in yard (0-100)
  y: number // position in yard (0-100)
  achievement: string
  plantedDate: string
}

export interface MoodQuestion {
  id: string
  question: string
  category: 'mood' | 'stress' | 'relationships' | 'self-care' | 'goals'
}

// Generate dates for last 3 months
const getDateString = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Demo Journals (40 entries spanning 3 months)
export const demoJournals: DemoJournal[] = [
  {
    id: '1',
    content: 'Had a really stressful day at work. Feeling overwhelmed with deadlines and expectations.',
    mood_score: 3,
    mood_tags: ['Stressed', 'Overwhelmed'],
    created_at: getDateString(1)
  },
  {
    id: '2',
    content: 'Feeling much better today. Went for a walk and it really helped clear my mind.',
    mood_score: 7,
    mood_tags: ['Calm', 'Hopeful'],
    created_at: getDateString(2)
  },
  {
    id: '3',
    content: 'Anxious about an upcoming presentation. Can\'t stop thinking about what could go wrong.',
    mood_score: 4,
    mood_tags: ['Anxious', 'Stressed'],
    created_at: getDateString(3)
  },
  {
    id: '4',
    content: 'Had a great conversation with a friend. Feeling grateful for the support in my life.',
    mood_score: 8,
    mood_tags: ['Happy', 'Grateful'],
    created_at: getDateString(5)
  },
  {
    id: '5',
    content: 'Feeling lonely today. Wish I had more people to talk to about what I\'m going through.',
    mood_score: 4,
    mood_tags: ['Lonely', 'Sad'],
    created_at: getDateString(6)
  },
  {
    id: '6',
    content: 'Completed my CBT exercise and it really helped reframe my negative thoughts.',
    mood_score: 6,
    mood_tags: ['Hopeful', 'Calm'],
    created_at: getDateString(7)
  },
  {
    id: '7',
    content: 'Woke up feeling anxious but practiced some breathing exercises. Feeling more centered now.',
    mood_score: 5,
    mood_tags: ['Anxious', 'Calm'],
    created_at: getDateString(8)
  },
  {
    id: '8',
    content: 'Had a productive day. Accomplished a lot and feeling proud of myself.',
    mood_score: 8,
    mood_tags: ['Happy', 'Excited'],
    created_at: getDateString(10)
  },
  {
    id: '9',
    content: 'Struggling with self-doubt today. Everything feels harder than it should be.',
    mood_score: 3,
    mood_tags: ['Sad', 'Stressed'],
    created_at: getDateString(11)
  },
  {
    id: '10',
    content: 'Met with my peer support person. It was really helpful to share experiences.',
    mood_score: 7,
    mood_tags: ['Hopeful', 'Grateful'],
    created_at: getDateString(12)
  },
  {
    id: '11',
    content: 'Feeling overwhelmed by all the things I need to do. Taking it one step at a time.',
    mood_score: 4,
    mood_tags: ['Overwhelmed', 'Stressed'],
    created_at: getDateString(14)
  },
  {
    id: '12',
    content: 'Had a good therapy session. Learned some new coping strategies.',
    mood_score: 6,
    mood_tags: ['Hopeful', 'Calm'],
    created_at: getDateString(15)
  },
  {
    id: '13',
    content: 'Feeling grateful for the progress I\'ve made. Small steps forward.',
    mood_score: 7,
    mood_tags: ['Grateful', 'Happy'],
    created_at: getDateString(16)
  },
  {
    id: '14',
    content: 'Anxious about social situations. Worried about saying the wrong thing.',
    mood_score: 4,
    mood_tags: ['Anxious', 'Stressed'],
    created_at: getDateString(18)
  },
  {
    id: '15',
    content: 'Had a peaceful morning meditation. Starting to feel more balanced.',
    mood_score: 6,
    mood_tags: ['Calm', 'Peaceful'],
    created_at: getDateString(19)
  },
  {
    id: '16',
    content: 'Feeling down today. Not sure why, just one of those days.',
    mood_score: 3,
    mood_tags: ['Sad', 'Lonely'],
    created_at: getDateString(21)
  },
  {
    id: '17',
    content: 'Completed a challenging task I\'ve been avoiding. Feeling accomplished!',
    mood_score: 8,
    mood_tags: ['Happy', 'Excited'],
    created_at: getDateString(22)
  },
  {
    id: '18',
    content: 'Stressed about finances. Worried about the future.',
    mood_score: 3,
    mood_tags: ['Stressed', 'Anxious'],
    created_at: getDateString(24)
  },
  {
    id: '19',
    content: 'Had a nice day with family. Feeling loved and supported.',
    mood_score: 8,
    mood_tags: ['Happy', 'Grateful'],
    created_at: getDateString(25)
  },
  {
    id: '20',
    content: 'Practiced gratitude journaling. Focusing on the positive aspects of my life.',
    mood_score: 7,
    mood_tags: ['Grateful', 'Hopeful'],
    created_at: getDateString(27)
  },
  {
    id: '21',
    content: 'Feeling anxious about work performance. Need to remind myself of my accomplishments.',
    mood_score: 4,
    mood_tags: ['Anxious', 'Stressed'],
    created_at: getDateString(28)
  },
  {
    id: '22',
    content: 'Had a breakthrough in understanding my thought patterns. Feeling hopeful.',
    mood_score: 7,
    mood_tags: ['Hopeful', 'Calm'],
    created_at: getDateString(30)
  },
  {
    id: '23',
    content: 'Feeling overwhelmed by responsibilities. Need to prioritize and take breaks.',
    mood_score: 4,
    mood_tags: ['Overwhelmed', 'Stressed'],
    created_at: getDateString(32)
  },
  {
    id: '24',
    content: 'Went for a nature walk. The fresh air really helped clear my mind.',
    mood_score: 7,
    mood_tags: ['Calm', 'Peaceful'],
    created_at: getDateString(33)
  },
  {
    id: '25',
    content: 'Feeling lonely and isolated. Reached out to a friend for support.',
    mood_score: 4,
    mood_tags: ['Lonely', 'Sad'],
    created_at: getDateString(35)
  },
  {
    id: '26',
    content: 'Had a productive CBT session. Working on challenging negative core beliefs.',
    mood_score: 6,
    mood_tags: ['Hopeful', 'Calm'],
    created_at: getDateString(36)
  },
  {
    id: '27',
    content: 'Feeling grateful for my support system. They help me through difficult times.',
    mood_score: 8,
    mood_tags: ['Grateful', 'Happy'],
    created_at: getDateString(38)
  },
  {
    id: '28',
    content: 'Anxious about an upcoming event. Using breathing techniques to manage it.',
    mood_score: 5,
    mood_tags: ['Anxious', 'Stressed'],
    created_at: getDateString(40)
  },
  {
    id: '29',
    content: 'Had a good day overall. Small wins and positive interactions.',
    mood_score: 7,
    mood_tags: ['Happy', 'Hopeful'],
    created_at: getDateString(42)
  },
  {
    id: '30',
    content: 'Struggling with motivation today. Taking it easy and being kind to myself.',
    mood_score: 4,
    mood_tags: ['Sad', 'Stressed'],
    created_at: getDateString(44)
  },
  {
    id: '31',
    content: 'Completed my daily journaling streak! Feeling proud of my consistency.',
    mood_score: 8,
    mood_tags: ['Happy', 'Excited'],
    created_at: getDateString(45)
  },
  {
    id: '32',
    content: 'Feeling stressed about deadlines. Breaking tasks into smaller steps.',
    mood_score: 4,
    mood_tags: ['Stressed', 'Overwhelmed'],
    created_at: getDateString(47)
  },
  {
    id: '33',
    content: 'Had a meaningful conversation with my peer. Shared experiences and felt understood.',
    mood_score: 7,
    mood_tags: ['Hopeful', 'Grateful'],
    created_at: getDateString(48)
  },
  {
    id: '34',
    content: 'Feeling anxious but using CBT techniques to challenge my thoughts.',
    mood_score: 5,
    mood_tags: ['Anxious', 'Calm'],
    created_at: getDateString(50)
  },
  {
    id: '35',
    content: 'Practiced self-care today. Took time for activities I enjoy.',
    mood_score: 7,
    mood_tags: ['Happy', 'Calm'],
    created_at: getDateString(52)
  },
  {
    id: '36',
    content: 'Feeling down but reminding myself that emotions are temporary.',
    mood_score: 4,
    mood_tags: ['Sad', 'Lonely'],
    created_at: getDateString(54)
  },
  {
    id: '37',
    content: 'Had a breakthrough moment in therapy. Understanding myself better.',
    mood_score: 7,
    mood_tags: ['Hopeful', 'Calm'],
    created_at: getDateString(56)
  },
  {
    id: '38',
    content: 'Feeling grateful for the progress I\'ve made on my mental health journey.',
    mood_score: 8,
    mood_tags: ['Grateful', 'Happy'],
    created_at: getDateString(58)
  },
  {
    id: '39',
    content: 'Anxious about social interactions. Working on building confidence.',
    mood_score: 4,
    mood_tags: ['Anxious', 'Stressed'],
    created_at: getDateString(60)
  },
  {
    id: '40',
    content: 'Had a peaceful day. Feeling more balanced and centered.',
    mood_score: 7,
    mood_tags: ['Calm', 'Peaceful'],
    created_at: getDateString(62)
  }
]

// Demo CBT Suggestions
export const demoCBTSuggestions: DemoCBTSuggestion[] = [
  {
    id: '1',
    category: 'Anxiety',
    distortion: 'Catastrophizing',
    originalThought: 'I\'m going to fail this presentation and everyone will think I\'m incompetent.',
    reframedThought: 'I\'ve prepared for this presentation and have the knowledge to share. Even if it doesn\'t go perfectly, it\'s a learning opportunity.',
    actionableSteps: [
      'Practice the presentation multiple times',
      'Focus on the key points you want to communicate',
      'Remember that most people are supportive, not judgmental'
    ],
    date: getDateString(3)
  },
  {
    id: '2',
    category: 'Stress',
    distortion: 'All-or-Nothing Thinking',
    originalThought: 'If I can\'t do everything perfectly, I\'m a failure.',
    reframedThought: 'Perfection is not required. Doing my best and making progress is what matters.',
    actionableSteps: [
      'Break tasks into smaller, manageable steps',
      'Prioritize what\'s most important',
      'Celebrate small wins along the way'
    ],
    date: getDateString(6)
  },
  {
    id: '3',
    category: 'Self-Esteem',
    distortion: 'Personalization',
    originalThought: 'It\'s all my fault that things went wrong.',
    reframedThought: 'Many factors contribute to outcomes. I can only control my own actions and responses.',
    actionableSteps: [
      'Identify what was actually within your control',
      'Consider other factors that may have contributed',
      'Focus on what you can learn from the situation'
    ],
    date: getDateString(11)
  },
  {
    id: '4',
    category: 'Anxiety',
    distortion: 'Mind Reading',
    originalThought: 'Everyone is judging me and thinking negatively about me.',
    reframedThought: 'I cannot know what others are thinking. Most people are focused on their own concerns, not judging me.',
    actionableSteps: [
      'Challenge assumptions about what others think',
      'Focus on your own values and actions',
      'Practice self-compassion'
    ],
    date: getDateString(14)
  },
  {
    id: '5',
    category: 'Depression',
    distortion: 'Mental Filter',
    originalThought: 'Nothing good ever happens to me.',
    reframedThought: 'While I may be focusing on negative events, there are also positive moments and experiences in my life.',
    actionableSteps: [
      'Keep a gratitude journal',
      'Notice and acknowledge small positive moments',
      'Balance negative thoughts with positive ones'
    ],
    date: getDateString(18)
  },
  {
    id: '6',
    category: 'Stress',
    distortion: 'Should Statements',
    originalThought: 'I should be able to handle everything without feeling stressed.',
    reframedThought: 'It\'s normal and human to feel stressed sometimes. I can manage stress with healthy coping strategies.',
    actionableSteps: [
      'Acknowledge that stress is a normal response',
      'Use stress management techniques',
      'Set realistic expectations for yourself'
    ],
    date: getDateString(21)
  },
  {
    id: '7',
    category: 'Anxiety',
    distortion: 'Catastrophizing',
    originalThought: 'If I make a mistake, it will ruin everything.',
    reframedThought: 'Mistakes are part of learning and growth. One mistake does not define my entire experience.',
    actionableSteps: [
      'Put mistakes in perspective',
      'Learn from errors and move forward',
      'Remember that perfection is not required'
    ],
    date: getDateString(24)
  },
  {
    id: '8',
    category: 'Self-Esteem',
    distortion: 'Labeling',
    originalThought: 'I\'m a failure because I didn\'t achieve my goal.',
    reframedThought: 'Not achieving one goal does not make me a failure. I am a person who is learning and growing.',
    actionableSteps: [
      'Avoid labeling yourself based on outcomes',
      'Focus on effort and progress, not just results',
      'Recognize your strengths and accomplishments'
    ],
    date: getDateString(28)
  },
  {
    id: '9',
    category: 'Anxiety',
    distortion: 'Overgeneralization',
    originalThought: 'Because one thing went wrong, everything will go wrong.',
    reframedThought: 'One negative event does not predict future outcomes. Each situation is unique.',
    actionableSteps: [
      'Avoid making broad conclusions from single events',
      'Look at evidence from multiple situations',
      'Stay present and focus on the current moment'
    ],
    date: getDateString(32)
  },
  {
    id: '10',
    category: 'Depression',
    distortion: 'Discounting the Positive',
    originalThought: 'The good things that happen don\'t really count or matter.',
    reframedThought: 'Positive experiences and accomplishments are valid and meaningful. They deserve recognition.',
    actionableSteps: [
      'Acknowledge and celebrate positive moments',
      'Keep a record of accomplishments',
      'Give yourself credit for progress'
    ],
    date: getDateString(36)
  },
  {
    id: '11',
    category: 'Stress',
    distortion: 'Emotional Reasoning',
    originalThought: 'I feel overwhelmed, so everything must be too difficult for me.',
    reframedThought: 'Feelings are not facts. Feeling overwhelmed doesn\'t mean I can\'t handle the situation.',
    actionableSteps: [
      'Separate feelings from facts',
      'Break tasks into smaller steps',
      'Use problem-solving strategies'
    ],
    date: getDateString(40)
  },
  {
    id: '12',
    category: 'Anxiety',
    distortion: 'Catastrophizing',
    originalThought: 'If I don\'t do well, my whole future will be ruined.',
    reframedThought: 'One event does not determine my entire future. I have many opportunities and paths forward.',
    actionableSteps: [
      'Put the situation in perspective',
      'Consider multiple possible outcomes',
      'Focus on what you can control'
    ],
    date: getDateString(44)
  }
]

// Progress Metrics (weekly averages)
export const progressMetrics: ProgressMetric[] = [
  { date: getDateString(90), moodAverage: 4.2, journalCount: 3, cbtSessions: 1 },
  { date: getDateString(83), moodAverage: 4.8, journalCount: 4, cbtSessions: 2 },
  { date: getDateString(76), moodAverage: 5.1, journalCount: 5, cbtSessions: 2 },
  { date: getDateString(69), moodAverage: 5.5, journalCount: 6, cbtSessions: 3 },
  { date: getDateString(62), moodAverage: 5.8, journalCount: 5, cbtSessions: 2 },
  { date: getDateString(55), moodAverage: 6.2, journalCount: 7, cbtSessions: 3 },
  { date: getDateString(48), moodAverage: 6.5, journalCount: 6, cbtSessions: 3 },
  { date: getDateString(41), moodAverage: 6.8, journalCount: 7, cbtSessions: 4 },
  { date: getDateString(34), moodAverage: 7.1, journalCount: 8, cbtSessions: 4 },
  { date: getDateString(27), moodAverage: 7.3, journalCount: 7, cbtSessions: 3 },
  { date: getDateString(20), moodAverage: 7.5, journalCount: 8, cbtSessions: 4 },
  { date: getDateString(13), moodAverage: 7.8, journalCount: 9, cbtSessions: 4 },
  { date: getDateString(6), moodAverage: 7.9, journalCount: 8, cbtSessions: 3 },
  { date: getDateString(0), moodAverage: 8.1, journalCount: 9, cbtSessions: 4 }
]

// Milestones
export const milestones: Milestone[] = [
  {
    id: '1',
    title: 'First Journal Entry',
    description: 'Started your mental health journey',
    date: getDateString(62),
    type: 'journal'
  },
  {
    id: '2',
    title: 'First CBT Session',
    description: 'Completed your first cognitive reframing exercise',
    date: getDateString(56),
    type: 'cbt'
  },
  {
    id: '3',
    title: '7-Day Streak',
    description: 'Journaled for 7 consecutive days',
    date: getDateString(55),
    type: 'streak'
  },
  {
    id: '4',
    title: 'Peer Connection',
    description: 'Connected with your first peer supporter',
    date: getDateString(48),
    type: 'peer'
  },
  {
    id: '5',
    title: 'Mood Improvement',
    description: 'Average mood improved by 2 points',
    date: getDateString(41),
    type: 'achievement'
  },
  {
    id: '6',
    title: '30-Day Streak',
    description: 'Maintained journaling for 30 days',
    date: getDateString(32),
    type: 'streak'
  },
  {
    id: '7',
    title: '10 CBT Sessions',
    description: 'Completed 10 cognitive reframing exercises',
    date: getDateString(28),
    type: 'cbt'
  },
  {
    id: '8',
    title: 'Consistent Progress',
    description: 'Maintained positive mood trend for 2 months',
    date: getDateString(13),
    type: 'achievement'
  }
]

// Peer Accountability Data
export const peerActivity: PeerActivity[] = [
  {
    id: '1',
    name: 'Peer 1',
    activityStatus: 'active',
    journalCount: 12,
    lastActive: getDateString(0),
    moodTrend: 'improving',
    streak: 15
  },
  {
    id: '2',
    name: 'Peer 2',
    activityStatus: 'active',
    journalCount: 8,
    lastActive: getDateString(1),
    moodTrend: 'stable',
    streak: 8
  },
  {
    id: '3',
    name: 'Peer 3',
    activityStatus: 'moderate',
    journalCount: 5,
    lastActive: getDateString(3),
    moodTrend: 'improving',
    streak: 5
  },
  {
    id: '4',
    name: 'Peer 4',
    activityStatus: 'active',
    journalCount: 10,
    lastActive: getDateString(0),
    moodTrend: 'stable',
    streak: 12
  },
  {
    id: '5',
    name: 'Peer 5',
    activityStatus: 'low',
    journalCount: 3,
    lastActive: getDateString(7),
    moodTrend: 'stable',
    streak: 2
  }
]

// Yard Plants (based on consistency and CBT analysis)
export const yardPlants: Plant[] = [
  {
    id: '1',
    type: 'flower',
    name: 'Consistency Daisy',
    growthStage: 5,
    x: 20,
    y: 30,
    achievement: '30-day journaling streak',
    plantedDate: getDateString(32)
  },
  {
    id: '2',
    type: 'tree',
    name: 'CBT Oak',
    growthStage: 4,
    x: 50,
    y: 20,
    achievement: '10 CBT sessions completed',
    plantedDate: getDateString(28)
  },
  {
    id: '3',
    type: 'flower',
    name: 'Mood Rose',
    growthStage: 5,
    x: 75,
    y: 40,
    achievement: 'Mood improvement milestone',
    plantedDate: getDateString(41)
  },
  {
    id: '4',
    type: 'bush',
    name: 'Progress Shrub',
    growthStage: 3,
    x: 30,
    y: 60,
    achievement: 'Consistent weekly progress',
    plantedDate: getDateString(20)
  },
  {
    id: '5',
    type: 'flower',
    name: 'Gratitude Tulip',
    growthStage: 4,
    x: 60,
    y: 70,
    achievement: 'Regular gratitude practice',
    plantedDate: getDateString(25)
  },
  {
    id: '6',
    type: 'tree',
    name: 'Resilience Pine',
    growthStage: 4,
    x: 80,
    y: 25,
    achievement: 'Overcame challenging period',
    plantedDate: getDateString(35)
  },
  {
    id: '7',
    type: 'flower',
    name: 'Self-Care Sunflower',
    growthStage: 3,
    x: 15,
    y: 75,
    achievement: 'Regular self-care practice',
    plantedDate: getDateString(45)
  },
  {
    id: '8',
    type: 'bush',
    name: 'Connection Berry',
    growthStage: 4,
    x: 40,
    y: 50,
    achievement: 'Active peer connections',
    plantedDate: getDateString(48)
  }
]

// Mood Questions Pool
export const moodQuestions: MoodQuestion[] = [
  { id: '1', question: 'How would you rate your overall mood today?', category: 'mood' },
  { id: '2', question: 'What is one thing causing you stress right now?', category: 'stress' },
  { id: '3', question: 'How supported do you feel by the people around you?', category: 'relationships' },
  { id: '4', question: 'What self-care activity did you do today?', category: 'self-care' },
  { id: '5', question: 'What is one thing you\'re grateful for today?', category: 'mood' },
  { id: '6', question: 'How well did you sleep last night?', category: 'self-care' },
  { id: '7', question: 'What is one goal you\'re working towards?', category: 'goals' },
  { id: '8', question: 'How anxious do you feel on a scale of 1-10?', category: 'stress' },
  { id: '9', question: 'What is one positive interaction you had today?', category: 'relationships' },
  { id: '10', question: 'How motivated do you feel today?', category: 'mood' },
  { id: '11', question: 'What is one challenge you\'re facing right now?', category: 'stress' },
  { id: '12', question: 'How connected do you feel to others?', category: 'relationships' },
  { id: '13', question: 'What is one thing you did for yourself today?', category: 'self-care' },
  { id: '14', question: 'How hopeful do you feel about the future?', category: 'mood' },
  { id: '15', question: 'What is one thing you\'re proud of accomplishing?', category: 'goals' },
  { id: '16', question: 'How overwhelmed do you feel right now?', category: 'stress' },
  { id: '17', question: 'What is one way you showed yourself kindness today?', category: 'self-care' },
  { id: '18', question: 'How satisfied are you with your current progress?', category: 'goals' },
  { id: '19', question: 'What is one thing that made you smile today?', category: 'mood' },
  { id: '20', question: 'How balanced do you feel between work and rest?', category: 'stress' },
  { id: '21', question: 'What is one relationship you\'re grateful for?', category: 'relationships' },
  { id: '22', question: 'How confident do you feel in your ability to cope?', category: 'mood' },
  { id: '23', question: 'What is one boundary you set for yourself recently?', category: 'self-care' },
  { id: '24', question: 'How clear are your goals right now?', category: 'goals' },
  { id: '25', question: 'What is one thing you learned about yourself recently?', category: 'mood' },
  { id: '26', question: 'How well are you managing your stress levels?', category: 'stress' },
  { id: '27', question: 'What is one way you supported someone else today?', category: 'relationships' },
  { id: '28', question: 'How present do you feel in the current moment?', category: 'self-care' },
  { id: '29', question: 'What is one step you took towards your goals today?', category: 'goals' },
  { id: '30', question: 'How would you describe your emotional state right now?', category: 'mood' }
]

// Helper function to get random mood question
export const getRandomMoodQuestion = (): MoodQuestion => {
  const randomIndex = Math.floor(Math.random() * moodQuestions.length)
  return moodQuestions[randomIndex]
}

// Helper function to get journals for a specific date
export const getJournalsForDate = (date: Date): DemoJournal[] => {
  const dateStr = date.toISOString().split('T')[0]
  return demoJournals.filter(journal => {
    const journalDate = new Date(journal.created_at).toISOString().split('T')[0]
    return journalDate === dateStr
  })
}

// Helper function to get current streak
export const getCurrentStreak = (): number => {
  // Calculate streak from demo data
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 100; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const journalsOnDate = getJournalsForDate(checkDate)
    
    if (journalsOnDate.length > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  
  return streak
}

