import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (!potentialPeers || potentialPeers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, match: null, message: 'No peers available at the moment' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter out already connected users
    const availablePeers = potentialPeers.filter(peer => !connectedUserIds.has(peer.user_id))

    if (availablePeers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, match: null, message: 'No new peers available' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use OpenAI to find best match
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      // Fallback to simple matching if OpenAI is not available
      const randomPeer = availablePeers[Math.floor(Math.random() * availablePeers.length)]
      
      const { data: connection } = await supabase
        .from('peer_connections')
        .insert({
          user1_id: userId,
          user2_id: randomPeer.user_id,
          match_score: 0.5,
          status: 'active',
        })
        .select()
        .single()

      return new Response(
        JSON.stringify({ success: true, match: connection, peer: randomPeer }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use OpenAI for smart matching
    const prompt = `You are a peer matching algorithm for a mental health app. Find the best match for the current user from the available peers based on personality compatibility and mental health goals.

Current User:
${JSON.stringify({ personality: currentUser.big_five_scores, history: currentUser.mental_health_history })}

Available Peers:
${JSON.stringify(availablePeers.map((p, i) => ({ 
  index: i, 
  personality: p.big_five_scores, 
  history: p.mental_health_history 
})))}

Return JSON with:
{
  "best_match_index": <index of best matching peer>,
  "match_score": <0.0 to 1.0>,
  "reasoning": "Brief explanation of why they're a good match"
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

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${await openaiResponse.text()}`)
    }

    const openaiData = await openaiResponse.json()
    const matchResult = JSON.parse(openaiData.choices[0].message.content)
    const bestPeer = availablePeers[matchResult.best_match_index]

    // Create connection
    const { data: connection, error } = await supabase
      .from('peer_connections')
      .insert({
        user1_id: userId,
        user2_id: bestPeer.user_id,
        match_score: matchResult.match_score,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        match: connection, 
        peer: bestPeer,
        reasoning: matchResult.reasoning 
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

