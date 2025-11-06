import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo users data - always available for testing
const DEMO_USERS = [
  {
    user_id: 'demo-user-001',
    big_five_scores: { openness: 75, conscientiousness: 80, extraversion: 70, agreeableness: 85, neuroticism: 30 },
    personality_type: 'The Supportive Explorer',
    mental_health_history: 'Experienced with anxiety management and mindfulness practices. Enjoys helping others on their mental health journey.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'mixed', preferredContactTime: 'evening', mentalHealthGoals: ['Managing Anxiety', 'Building Self-Esteem', 'Stress Management'], availability: 'few-times-week' } },
    name: 'Alex',
    emoji: '🌟',
  },
  {
    user_id: 'demo-user-002',
    big_five_scores: { openness: 60, conscientiousness: 90, extraversion: 50, agreeableness: 75, neuroticism: 25 },
    personality_type: 'The Organized Helper',
    mental_health_history: 'Struggling with perfectionism and work-related anxiety. Seeking someone who understands the pressure of high expectations.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'text', preferredContactTime: 'morning', mentalHealthGoals: ['Stress Management', 'Building Self-Esteem'], availability: 'weekly' } },
    name: 'Jordan',
    emoji: '📚',
  },
  {
    user_id: 'demo-user-003',
    big_five_scores: { openness: 85, conscientiousness: 65, extraversion: 85, agreeableness: 80, neuroticism: 40 },
    personality_type: 'The Creative Socializer',
    mental_health_history: 'Dealing with social anxiety despite being outgoing. Looking for someone to practice social skills and build confidence together.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'mixed', preferredContactTime: 'evening', mentalHealthGoals: ['Social Skills', 'Managing Anxiety'], availability: 'few-times-week' } },
    name: 'Sam',
    emoji: '🎨',
  },
  {
    user_id: 'demo-user-004',
    big_five_scores: { openness: 70, conscientiousness: 75, extraversion: 40, agreeableness: 90, neuroticism: 35 },
    personality_type: 'The Thoughtful Listener',
    mental_health_history: 'Experiencing depression and isolation. Wants to connect with someone who values deep conversations and mutual support.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'text', preferredContactTime: 'anytime', mentalHealthGoals: ['Coping with Depression', 'Building Self-Esteem'], availability: 'daily' } },
    name: 'Taylor',
    emoji: '💙',
  },
  {
    user_id: 'demo-user-005',
    big_five_scores: { openness: 90, conscientiousness: 70, extraversion: 75, agreeableness: 70, neuroticism: 50 },
    personality_type: 'The Adventurous Optimist',
    mental_health_history: 'Managing ADHD and impulsivity. Looking for accountability partner and someone to share creative projects with.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'voice', preferredContactTime: 'afternoon', mentalHealthGoals: ['Stress Management', 'Emotional Regulation'], availability: 'few-times-week' } },
    name: 'Riley',
    emoji: '🚀',
  },
  {
    user_id: 'demo-user-006',
    big_five_scores: { openness: 55, conscientiousness: 85, extraversion: 60, agreeableness: 88, neuroticism: 20 },
    personality_type: 'The Stable Supporter',
    mental_health_history: 'Recovering from burnout and learning to set boundaries. Wants to help others while maintaining healthy limits.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'mixed', preferredContactTime: 'morning', mentalHealthGoals: ['Stress Management', 'General Wellness'], availability: 'weekly' } },
    name: 'Casey',
    emoji: '🛡️',
  },
  {
    user_id: 'demo-user-007',
    big_five_scores: { openness: 80, conscientiousness: 60, extraversion: 90, agreeableness: 75, neuroticism: 45 },
    personality_type: 'The Energetic Connector',
    mental_health_history: 'Struggling with mood swings and maintaining relationships. Seeking someone who understands emotional intensity.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'video', preferredContactTime: 'evening', mentalHealthGoals: ['Emotional Regulation', 'Social Skills'], availability: 'daily' } },
    name: 'Morgan',
    emoji: '⚡',
  },
  {
    user_id: 'demo-user-008',
    big_five_scores: { openness: 65, conscientiousness: 88, extraversion: 45, agreeableness: 82, neuroticism: 28 },
    personality_type: 'The Reliable Introvert',
    mental_health_history: 'Coping with social anxiety and building confidence. Prefers one-on-one connections over group settings.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'text', preferredContactTime: 'anytime', mentalHealthGoals: ['Managing Anxiety', 'Social Skills'], availability: 'as-needed' } },
    name: 'Quinn',
    emoji: '🔒',
  },
  {
    user_id: 'demo-user-009',
    big_five_scores: { openness: 88, conscientiousness: 55, extraversion: 80, agreeableness: 70, neuroticism: 55 },
    personality_type: 'The Free-Spirited Artist',
    mental_health_history: 'Dealing with creative blocks and self-doubt. Looking for someone who appreciates artistic expression and vulnerability.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'mixed', preferredContactTime: 'afternoon', mentalHealthGoals: ['Building Self-Esteem', 'General Wellness'], availability: 'few-times-week' } },
    name: 'Avery',
    emoji: '🎭',
  },
  {
    user_id: 'demo-user-010',
    big_five_scores: { openness: 72, conscientiousness: 82, extraversion: 65, agreeableness: 88, neuroticism: 32 },
    personality_type: 'The Balanced Companion',
    mental_health_history: 'Working through grief and loss. Seeking someone who can provide empathy and understanding during difficult times.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'voice', preferredContactTime: 'evening', mentalHealthGoals: ['Coping with Depression', 'Recovery Support'], availability: 'weekly' } },
    name: 'Blake',
    emoji: '🤝',
  },
  {
    user_id: 'demo-user-011',
    big_five_scores: { openness: 68, conscientiousness: 78, extraversion: 55, agreeableness: 85, neuroticism: 38 },
    personality_type: 'The Mindful Meditator',
    mental_health_history: 'Practicing mindfulness to manage anxiety and stress. Interested in sharing meditation techniques and wellness practices.',
    preferences: { peerMatchingAnswers: { communicationStyle: 'text', preferredContactTime: 'morning', mentalHealthGoals: ['Stress Management', 'General Wellness'], availability: 'daily' } },
    name: 'Dakota',
    emoji: '🧘',
  },
]

// Calculate compatibility between two users
function calculateCompatibility(user1: any, user2: any): {
  match_score: number
  compatibility_breakdown: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  reasoning: string
  activities: string[]
} {
  const scores1 = user1.big_five_scores || {}
  const scores2 = user2.big_five_scores || {}

  // Calculate trait compatibility (closer scores = higher compatibility)
  const calculateTraitCompatibility = (trait: string): number => {
    const score1 = scores1[trait] || 50
    const score2 = scores2[trait] || 50
    const diff = Math.abs(score1 - score2)
    return Math.max(0, 100 - diff)
  }

  const openness = calculateTraitCompatibility('openness')
  const conscientiousness = calculateTraitCompatibility('conscientiousness')
  const extraversion = calculateTraitCompatibility('extraversion')
  const agreeableness = calculateTraitCompatibility('agreeableness')
  const neuroticism = calculateTraitCompatibility('neuroticism')

  // Overall match score (weighted average)
  const match_score = (
    openness * 0.2 +
    conscientiousness * 0.2 +
    extraversion * 0.2 +
    agreeableness * 0.25 +
    neuroticism * 0.15
  ) / 100

  // Generate reasoning
  const highTraits: string[] = []
  if (openness > 80) highTraits.push('openness to new experiences')
  if (conscientiousness > 80) highTraits.push('organized and goal-oriented approach')
  if (extraversion > 80) highTraits.push('social and outgoing nature')
  if (agreeableness > 80) highTraits.push('empathetic and supportive personality')
  if (neuroticism < 30) highTraits.push('emotional stability')

  const reasoning = highTraits.length > 0
    ? `You both share strong compatibility in ${highTraits.join(', ')}. Your similar personality traits and mental health goals make you excellent peer support partners. You can provide mutual understanding and encouragement on your journeys.`
    : `You have complementary personality traits that work well together. Your shared mental health goals and communication preferences create a strong foundation for peer support.`

  // Generate activity suggestions based on compatibility
  const activities: string[] = []
  if (openness > 70) {
    activities.push('Explore new mindfulness techniques together')
  }
  if (conscientiousness > 70) {
    activities.push('Set and track mental health goals together')
  }
  if (extraversion > 70) {
    activities.push('Participate in peer support discussions and group activities')
  }
  if (agreeableness > 70) {
    activities.push('Share daily check-ins and provide mutual support')
  }
  if (neuroticism < 50) {
    activities.push('Practice stress management and emotional regulation techniques')
  }
  
  // Default activities if none match
  if (activities.length === 0) {
    activities.push(
      'Share daily check-ins and support each other',
      'Exchange journaling prompts and reflections',
      'Practice mindfulness exercises together',
      'Set and track mental health goals together'
    )
  }

  return {
    match_score: Math.min(1, Math.max(0.5, match_score)),
    compatibility_breakdown: {
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
    },
    reasoning,
    activities: activities.slice(0, 6), // Limit to 6 activities
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      throw new Error('Missing user ID')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get current user profile
    const { data: currentUser } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!currentUser) {
      throw new Error('User profile not found')
    }

    // Get potential peers (exclude already connected users)
    const { data: existingConnections } = await supabase
      .from('peer_connections')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    const connectedUserIds = new Set(
      existingConnections?.flatMap(conn => [conn.user1_id, conn.user2_id]) || []
    )

    const { data: potentialPeers } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('user_id', userId)
      .limit(20)

    // Always include demo users for testing
    const availablePeers = [
      ...(potentialPeers?.filter(peer => !connectedUserIds.has(peer.user_id)) || []),
      ...DEMO_USERS,
    ]

    if (availablePeers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, match: null, message: 'No new peers available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate compatibility for all peers
    const peerCompatibilities = availablePeers.map(peer => ({
      peer,
      compatibility: calculateCompatibility(currentUser, peer),
    }))

    // Sort by match score (highest first)
    peerCompatibilities.sort((a, b) => b.compatibility.match_score - a.compatibility.match_score)

    // Add variation: if there are multiple good matches (within 5% of top score), randomly select from top matches
    const topScore = peerCompatibilities[0]?.compatibility.match_score || 0
    const topMatches = peerCompatibilities.filter(
      p => p.compatibility.match_score >= topScore - 0.05 && p.compatibility.match_score > 0.6
    )

    // Select from top matches with some randomness, but prefer higher scores
    let bestMatch
    if (topMatches.length > 1) {
      // Weighted random selection - higher scores have better chance
      const weights = topMatches.map(m => Math.pow(m.compatibility.match_score, 3))
      const totalWeight = weights.reduce((sum, w) => sum + w, 0)
      let random = Math.random() * totalWeight
      
      for (let i = 0; i < topMatches.length; i++) {
        random -= weights[i]
        if (random <= 0) {
          bestMatch = topMatches[i]
          break
        }
      }
      // Fallback to first if something went wrong
      if (!bestMatch) bestMatch = topMatches[0]
    } else {
      bestMatch = peerCompatibilities[0]
    }

    // Use OpenAI for enhanced reasoning if available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (openaiApiKey) {
      try {
        const prompt = `You are a peer matching algorithm for a mental health app. Provide a brief, warm explanation (2-3 sentences) of why these two users are a good match.

Current User:
${JSON.stringify({ personality: currentUser.big_five_scores, history: currentUser.mental_health_history })}

Matched Peer:
${JSON.stringify({ personality: bestMatch.peer.big_five_scores, history: bestMatch.peer.mental_health_history })}

Compatibility Score: ${(bestMatch.compatibility.match_score * 100).toFixed(0)}%

Return JSON with:
{
  "reasoning": "Brief explanation of why they're a good match",
  "activities": ["activity 1", "activity 2", "activity 3"]
}`

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a peer matching algorithm. Respond with JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
          }),
        })

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json()
          const enhancedResult = JSON.parse(openaiData.choices[0].message.content)
          if (enhancedResult.reasoning) {
            bestMatch.compatibility.reasoning = enhancedResult.reasoning
          }
          if (enhancedResult.activities && Array.isArray(enhancedResult.activities)) {
            bestMatch.compatibility.activities = enhancedResult.activities
          }
        }
      } catch (error) {
        console.error('OpenAI enhancement failed, using default reasoning:', error)
      }
    }

    // Create connection (skip for demo users)
    let connection: any = null
    const isDemoUser = DEMO_USERS.some(demo => demo.user_id === bestMatch.peer.user_id)
    if (!isDemoUser) {
      const { data: newConnection, error } = await supabase
        .from('peer_connections')
        .insert({
          user1_id: userId,
          user2_id: bestMatch.peer.user_id,
          match_score: bestMatch.compatibility.match_score,
          status: 'active',
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating connection:', error)
      } else {
        connection = newConnection
      }
    } else {
      // Create a mock connection for demo user
      connection = {
        id: `demo-connection-${bestMatch.peer.user_id}`,
        user1_id: userId,
        user2_id: bestMatch.peer.user_id,
        match_score: bestMatch.compatibility.match_score,
        status: 'active',
        created_at: new Date().toISOString(),
      }
    }

    const peerData: any = {
      ...bestMatch.peer,
      name: bestMatch.peer.name || 'Your Peer Match',
      emoji: bestMatch.peer.emoji || '👤',
    }

    return new Response(
      JSON.stringify({
        success: true,
        match: {
          ...(connection || {}),
          ...bestMatch.compatibility,
        },
        peer: peerData,
        reasoning: bestMatch.compatibility.reasoning,
        compatibility_breakdown: bestMatch.compatibility.compatibility_breakdown,
        activities: bestMatch.compatibility.activities,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
