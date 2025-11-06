import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Crisis keywords for safety detection
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 
  'hurt myself', 'no reason to live', 'want to die'
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { message, conversationHistory } = await req.json()

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for crisis keywords
    const lowerMessage = message.toLowerCase()
    const hasCrisisKeyword = CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword))

    // Build conversation history - ensure proper format for OpenAI
    const conversationMessages = (conversationHistory || [])
      .map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: String(msg.content || '').trim()
      }))
      .filter((msg: any) => msg.content && msg.content.length > 0)
      .slice(-20) // Keep last 20 messages for better context (10 exchanges)

    // System prompt as per reference document
    const systemPrompt = "You are a compassionate and empathetic therapist chatbot. Your purpose is to engage with users in a caring, non-judgmental manner. Listen to their emotions, validate their feelings, and help them reflect on their thoughts. Your responses should never be dismissive or suggest quick fixes. Instead, you should help users feel heard and understood. Encourage users to explore their emotions while remaining neutral and supportive. Avoid giving medical advice or making diagnoses. You are a guide, not a professional therapist. Always remind users to seek professional help if they need immediate support."

    // Build messages array for OpenAI API
    // Include system prompt, conversation history, and current user message
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationMessages, // Previous conversation (without current message)
      { role: 'user', content: message } // Current user message
    ]

    console.log('Sending to ChatGPT:', {
      messageCount: messages.length,
      conversationHistoryLength: conversationMessages.length,
      currentMessage: message.substring(0, 50),
      conversationHistory: conversationMessages.map(m => ({ role: m.role, content: m.content.substring(0, 30) }))
    })

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost-effectiveness (can change to 'gpt-4' if needed)
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      return new Response(
        JSON.stringify({ success: false, error: `OpenAI API error: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    
    if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid response format from OpenAI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    let response = openaiData.choices[0].message.content

    if (!response || response.trim().length === 0) {
      response = "I'm here to listen. Could you tell me more about what you're experiencing?"
    }

    // Add crisis resources if needed
    if (hasCrisisKeyword) {
      response += '\n\n🆘 IMPORTANT: If you're in crisis, please reach out for immediate help:\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• International: findahelpline.com\n\nYou matter, and help is available 24/7.'
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: response,
        crisis_detected: hasCrisisKeyword
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Support bot error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
