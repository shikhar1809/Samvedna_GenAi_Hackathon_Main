export interface TherapyResource {
  id: number
  category: string
  title: string
  description: string
  type: 'Article' | 'Video' | 'Worksheet'
  url: string
  keywords: string[]
}

export interface Quote {
  id: number
  text: string
  author: string
  category: string
}

export interface RedditStory {
  id: number
  title: string
  subreddit: string
  url: string
  keywords: string[]
}

export const therapyResources: TherapyResource[] = [
  {
    id: 1,
    category: 'CBT',
    title: 'Introduction to Cognitive Behavioral Therapy',
    description: 'Learn the basics of CBT and how it can help manage negative thought patterns.',
    type: 'Article',
    url: 'https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral',
    keywords: ['anxiety', 'depression', 'negative thoughts', 'cbt', 'cognitive']
  },
  {
    id: 2,
    category: 'Mindfulness',
    title: '10-Minute Mindfulness Meditation',
    description: 'A guided meditation to help you relax and center yourself.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
    keywords: ['stress', 'anxiety', 'mindfulness', 'meditation', 'relaxation']
  },
  {
    id: 3,
    category: 'DBT',
    title: 'Understanding Dialectical Behavior Therapy',
    description: 'Overview of DBT techniques for emotional regulation.',
    type: 'Article',
    url: 'https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/',
    keywords: ['emotions', 'regulation', 'dbt', 'borderline', 'bpd']
  },
  {
    id: 4,
    category: 'Breathing',
    title: '4-7-8 Breathing Exercise',
    description: 'A simple breathing technique to reduce anxiety and promote calm.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=gz4G31LGyog',
    keywords: ['anxiety', 'stress', 'breathing', 'calm', 'relaxation']
  },
  {
    id: 5,
    category: 'Mindfulness',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation technique for stress relief.',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=15q-N-_oPkEg',
    keywords: ['stress', 'relaxation', 'body', 'meditation', 'tension']
  },
  {
    id: 6,
    category: 'CBT',
    title: 'Challenging Negative Thoughts Worksheet',
    description: 'Practical exercises for identifying and reframing cognitive distortions.',
    type: 'Worksheet',
    url: 'https://www.therapistaid.com/therapy-worksheet/cbt-thought-record',
    keywords: ['negative thoughts', 'cbt', 'cognitive distortions', 'reframing']
  },
  {
    id: 7,
    category: 'Anxiety',
    title: 'Managing Anxiety: Practical Strategies',
    description: 'Evidence-based techniques for managing anxiety and panic.',
    type: 'Article',
    url: 'https://www.anxietycanada.com/articles/managing-anxiety/',
    keywords: ['anxiety', 'panic', 'worry', 'fear', 'stress']
  },
  {
    id: 8,
    category: 'Depression',
    title: 'Understanding Depression and Treatment Options',
    description: 'Comprehensive guide to depression symptoms and treatment.',
    type: 'Article',
    url: 'https://www.nimh.nih.gov/health/topics/depression',
    keywords: ['depression', 'sadness', 'low mood', 'hopelessness']
  },
]

export const quotes: Quote[] = [
  {
    id: 1,
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: 'Dan Millman',
    category: 'Mindfulness'
  },
  {
    id: 2,
    text: "The only way out is through.",
    author: 'Robert Frost',
    category: 'Resilience'
  },
  {
    id: 3,
    text: "It's okay to not be okay. It's okay to ask for help.",
    author: 'Unknown',
    category: 'Support'
  },
  {
    id: 4,
    text: "Healing is not linear. It's okay to have setbacks.",
    author: 'Unknown',
    category: 'Recovery'
  },
  {
    id: 5,
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: 'Unknown',
    category: 'Self-Care'
  },
  {
    id: 6,
    text: "Progress, not perfection.",
    author: 'Unknown',
    category: 'Growth'
  },
  {
    id: 7,
    text: "You are stronger than you think. You've survived 100% of your worst days.",
    author: 'Unknown',
    category: 'Strength'
  },
  {
    id: 8,
    text: "It's okay to take breaks. It's okay to rest. It's okay to prioritize yourself.",
    author: 'Unknown',
    category: 'Self-Care'
  },
  {
    id: 9,
    text: "The cave you fear to enter holds the treasure you seek.",
    author: 'Joseph Campbell',
    category: 'Courage'
  },
  {
    id: 10,
    text: "You are not your thoughts. You are the observer of your thoughts.",
    author: 'Eckhart Tolle',
    category: 'Mindfulness'
  },
  {
    id: 11,
    text: "Small steps every day lead to big changes over time.",
    author: 'Unknown',
    category: 'Progress'
  },
  {
    id: 12,
    text: "Your feelings are valid. Your experiences matter. You matter.",
    author: 'Unknown',
    category: 'Validation'
  },
  {
    id: 13,
    text: "Recovery is not about going back to who you were. It's about becoming who you're meant to be.",
    author: 'Unknown',
    category: 'Recovery'
  },
  {
    id: 14,
    text: "Therapy is not about fixing what's broken. It's about understanding what's working and building on it.",
    author: 'Unknown',
    category: 'Therapy'
  },
  {
    id: 15,
    text: "You are worthy of love, care, and healing, especially from yourself.",
    author: 'Unknown',
    category: 'Self-Love'
  },
]

export const redditStories: RedditStory[] = [
  {
    id: 1,
    title: 'How I overcame my anxiety after years of struggling',
    subreddit: 'r/Anxiety',
    url: 'https://www.reddit.com/r/Anxiety/comments/example1',
    keywords: ['anxiety', 'recovery', 'overcoming', 'struggle']
  },
  {
    id: 2,
    title: 'My journey with depression and what helped me',
    subreddit: 'r/depression',
    url: 'https://www.reddit.com/r/depression/comments/example2',
    keywords: ['depression', 'journey', 'help', 'recovery']
  },
  {
    id: 3,
    title: 'CBT techniques that actually worked for me',
    subreddit: 'r/CBT',
    url: 'https://www.reddit.com/r/CBT/comments/example3',
    keywords: ['cbt', 'techniques', 'therapy', 'helpful']
  },
  {
    id: 4,
    title: 'Finding hope after feeling hopeless for so long',
    subreddit: 'r/mentalhealth',
    url: 'https://www.reddit.com/r/mentalhealth/comments/example4',
    keywords: ['hope', 'hopelessness', 'recovery', 'mental health']
  },
  {
    id: 5,
    title: 'How mindfulness meditation changed my life',
    subreddit: 'r/Mindfulness',
    url: 'https://www.reddit.com/r/Mindfulness/comments/example5',
    keywords: ['mindfulness', 'meditation', 'change', 'transformation']
  },
  {
    id: 6,
    title: 'Dealing with stress at work - what I learned',
    subreddit: 'r/stress',
    url: 'https://www.reddit.com/r/stress/comments/example6',
    keywords: ['stress', 'work', 'coping', 'management']
  },
  {
    id: 7,
    title: 'My experience with therapy and why I recommend it',
    subreddit: 'r/therapy',
    url: 'https://www.reddit.com/r/therapy/comments/example7',
    keywords: ['therapy', 'experience', 'recommendation', 'help']
  },
  {
    id: 8,
    title: 'Building resilience after trauma',
    subreddit: 'r/ptsd',
    url: 'https://www.reddit.com/r/ptsd/comments/example8',
    keywords: ['trauma', 'resilience', 'ptsd', 'recovery']
  },
  {
    id: 9,
    title: 'Self-care routines that actually help',
    subreddit: 'r/selfcare',
    url: 'https://www.reddit.com/r/selfcare/comments/example9',
    keywords: ['self-care', 'routines', 'wellness', 'health']
  },
  {
    id: 10,
    title: 'Learning to be kind to myself after years of self-criticism',
    subreddit: 'r/selfimprovement',
    url: 'https://www.reddit.com/r/selfimprovement/comments/example10',
    keywords: ['self-compassion', 'self-criticism', 'kindness', 'growth']
  },
]

export function matchResources(concerns: string[], keywords: string[]): TherapyResource[] {
  const allKeywords = [...concerns, ...keywords].map(k => k.toLowerCase())
  
  return therapyResources
    .filter(resource => 
      resource.keywords.some(keyword => 
        allKeywords.some(k => k.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(k))
      )
    )
    .slice(0, 5) // Return top 5 matches
}

export function getRelevantQuotes(concerns: string[]): Quote[] {
  const concernLower = concerns.join(' ').toLowerCase()
  
  return quotes
    .filter(quote => {
      const quoteText = quote.text.toLowerCase()
      const quoteCategory = quote.category.toLowerCase()
      return concernLower.includes(quoteCategory) || 
             quoteText.includes('anxiety') && concernLower.includes('anxiety') ||
             quoteText.includes('depression') && concernLower.includes('depression') ||
             quoteText.includes('stress') && concernLower.includes('stress')
    })
    .slice(0, 3) // Return top 3 matches
}

export function getRelevantStories(concerns: string[], keywords: string[]): RedditStory[] {
  const allKeywords = [...concerns, ...keywords].map(k => k.toLowerCase())
  
  return redditStories
    .filter(story => 
      story.keywords.some(keyword => 
        allKeywords.some(k => k.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(k))
      )
    )
    .slice(0, 3) // Return top 3 matches
}

