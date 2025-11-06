import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Demo user data - always available for testing
const DEMO_USER = {
  user_id: '00000000-0000-0000-0000-000000000000',
  big_five_scores: {
    openness: 75,
    conscientiousness: 80,
    extraversion: 70,
    agreeableness: 85,
    neuroticism: 30,
  },
  personality_type: 'The Supportive Explorer',
  mental_health_history: 'Experienced with anxiety management and mindfulness practices. Enjoys helping others on their mental health journey.',
  preferences: {
    peerMatchingAnswers: {
      communicationStyle: 'mixed',
      preferredContactTime: 'evening',
      mentalHealthGoals: ['Managing Anxiety', 'Building Self-Esteem', 'Stress Management'],
      availability: 'few-times-week',
    },
  },
  name: 'Alex',
  emoji: '🌟',
}

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

    // Always include demo user for testing
    const availablePeers = [
      ...(potentialPeers?.filter(peer => !connectedUserIds.has(peer.user_id)) || []),
      DEMO_USER,
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

    // Find best match (highest match score)
    const bestMatch = peerCompatibilities.reduce((best, current) => {
      return current.compatibility.match_score > best.compatibility.match_score ? current : best
    })

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

    // Create connection (skip for demo user)
    let connection = null
    if (bestMatch.peer.user_id !== DEMO_USER.user_id) {
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
        id: 'demo-connection',
        user1_id: userId,
        user2_id: DEMO_USER.user_id,
        match_score: bestMatch.compatibility.match_score,
        status: 'active',
        created_at: new Date().toISOString(),
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        match: {
          ...connection,
          ...bestMatch.compatibility,
        },
        peer: {
          ...bestMatch.peer,
          name: bestMatch.peer.name || 'Your Peer Match',
          emoji: bestMatch.peer.emoji || '👤',
        },
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
