// Import required modules
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DiagnosisRequest {
  journalText: string
  moodScore: number
  moodTags: string[]
  userId: string
  journalId?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { journalText, moodScore, moodTags, userId, journalId }: DiagnosisRequest = await req.json()

    // Validate input
    if (!journalText || !userId) {
      throw new Error('Missing required fields')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Get user profile from Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Construct prompt for OpenAI
    const prompt = `You are a compassionate clinical psychologist specializing in mental health assessment. Analyze the following journal entry and provide a structured mental health assessment.

Journal Entry:
"${journalText}"

Current Mood: ${moodScore}/10
Mood Tags: ${moodTags.join(', ')}

${profile ? `User Personality Profile: ${JSON.stringify(profile.big_five_scores)}` : ''}

Provide a comprehensive analysis in the following JSON format:
{
  "summary": "Brief overview of the user's mental state",
  "dsm5_codes": ["Possible DSM-5 diagnostic codes if applicable, otherwise empty array"],
  "severity": <1-10 scale, where 1 is minimal concern and 10 is critical>,
  "key_concerns": ["List of primary concerns identified"],
  "positive_aspects": ["Strengths and positive elements noted"],
  "suggestions": ["Practical, actionable suggestions for improvement"],
  "coping_strategies": ["Specific coping techniques tailored to the concerns"],
  "crisis_detected": <true if immediate intervention may be needed, false otherwise>,
  "professional_help_recommended": <true if professional consultation is advised, false otherwise>
}

Guidelines:
- Be empathetic and non-judgmental
- Focus on both challenges and strengths
- Provide actionable, practical advice
- If detecting severe symptoms (suicidal ideation, self-harm, psychosis), set crisis_detected to true
- Base DSM-5 codes only on clear clinical indicators, not mild symptoms
- Consider personality traits in recommendations`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a clinical psychologist providing mental health assessments. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const openaiData = await openaiResponse.json()
    const analysis = JSON.parse(openaiData.choices[0].message.content)

    // Save diagnosis to database
    const { data: diagnosis, error: dbError } = await supabase
      .from('diagnoses')
      .insert({
        user_id: userId,
        journal_id: journalId || null,
        analysis: analysis,
        dsm5_codes: analysis.dsm5_codes || [],
        severity: analysis.severity,
        suggestions: analysis.suggestions || [],
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to save diagnosis')
    }

    return new Response(
      JSON.stringify({ success: true, diagnosis: diagnosis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

