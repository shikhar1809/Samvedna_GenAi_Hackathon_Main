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
    const { message, userId, conversationHistory } = await req.json()

    if (!message || !userId) {
      throw new Error('Message and user ID are required')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Get user context from recent journals
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: recentJournals } = await supabase
      .from('journals')
      .select('content, mood_score, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3)

    const journalContext = recentJournals?.length 
      ? `Recent journal context: ${JSON.stringify(recentJournals.map(j => ({ mood: j.mood_score, snippet: j.content.substring(0, 100) })))}`
      : ''

    // Crisis keywords detection
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself', 'no reason to live']
    const hasCrisisKeyword = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword))

    const systemPrompt = `You are a compassionate, empathetic AI mental health companion. Your role is to:
- Listen actively and validate feelings
- Provide emotional support and encouragement
- Suggest healthy coping strategies
- Be warm, non-judgmental, and supportive

CRITICAL SAFETY RULES:
- You are NOT a replacement for professional therapy or medical advice
- If the user mentions ${crisisKeywords.join(', ')}, immediately provide crisis resources
- Never diagnose medical conditions
- Always encourage professional help for serious concerns

${journalContext}

Keep responses concise (2-3 paragraphs max), warm, and actionable.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ]

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 300,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${await openaiResponse.text()}`)
    }

    const openaiData = await openaiResponse.json()
    let response = openaiData.choices[0].message.content

    // Add crisis resources if needed
    if (hasCrisisKeyword) {
      response += '\n\n🆘 IMMEDIATE HELP AVAILABLE:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International: findahelpline.com\n\nYou matter, and help is available 24/7.'
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: response,
        crisis_detected: hasCrisisKeyword 
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

