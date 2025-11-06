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
    const { content, userId } = await req.json()

    if (!content) {
      throw new Error('Content is required')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    let anonymizedContent = content
    let isAnonymized = false

    // Use OpenAI to remove PII if available
    if (openaiApiKey && content.length > 100) {
      const prompt = `Remove all personally identifiable information (PII) from the following text while preserving its emotional content and meaning. Replace names with generic terms like "someone" or "a person", locations with "a place" or "somewhere", companies with "a company", etc.

Original text:
"${content}"

Return ONLY the anonymized text, no explanations.`

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a text anonymization assistant. Remove PII but keep emotional content.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
        }),
      })

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json()
        anonymizedContent = openaiData.choices[0].message.content.trim()
        isAnonymized = true
      }
    }

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const anonymousId = userId || crypto.randomUUID()

    const { data, error } = await supabase
      .from('vents')
      .insert({
        anonymous_id: anonymousId,
        content: anonymizedContent,
        is_anonymized: isAnonymized,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, vent: data, was_anonymized: isAnonymized }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

