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
    const { thought, userId } = await req.json()

    if (!thought || !userId) {
      throw new Error('Missing required fields')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `You are a Cognitive Behavioral Therapy (CBT) specialist. Analyze the following thought and help reframe it using CBT principles.

Thought: "${thought}"

Provide your analysis in the following JSON format:
{
  "distortions": ["List of cognitive distortions identified (e.g., 'All-or-Nothing Thinking', 'Catastrophizing', 'Mind Reading', 'Overgeneralization', 'Mental Filter', 'Discounting the Positive', 'Emotional Reasoning', 'Should Statements', 'Labeling', 'Personalization')"],
  "evidence_for": ["Evidence that supports this thought"],
  "evidence_against": ["Evidence that contradicts this thought"],
  "balanced_thought": "A more balanced, realistic reframing of the original thought",
  "alternative_perspectives": ["Other ways to view this situation"],
  "actionable_steps": ["Concrete steps to challenge this thought pattern"]
}

Be compassionate, practical, and evidence-based in your response.`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a CBT therapist. Always respond with valid JSON only.' },
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
    const analysis = JSON.parse(openaiData.choices[0].message.content)

    // Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('cbt_reframes')
      .insert({
        user_id: userId,
        original_thought: thought,
        distortions: analysis.distortions || [],
        reframe: analysis.balanced_thought,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, analysis: analysis, record: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

