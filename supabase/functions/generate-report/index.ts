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
      throw new Error('User ID is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Gather user data
    const [
      { data: profile },
      { data: journals },
      { data: diagnoses },
      { data: cbtReframes },
      { data: gratitude }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('journals').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
      supabase.from('diagnoses').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('cbt_reframes').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('gratitude_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
    ])

    // Calculate mood trends
    const moodScores = journals?.map(j => j.mood_score) || []
    const avgMood = moodScores.length > 0 
      ? (moodScores.reduce((a, b) => a + b, 0) / moodScores.length).toFixed(1)
      : 'N/A'

    // Use OpenAI to generate comprehensive report
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Generate a comprehensive mental health report for a therapist based on the following user data:

Personality Profile: ${JSON.stringify(profile?.big_five_scores)}
Number of Journal Entries: ${journals?.length || 0}
Average Mood Score: ${avgMood}/10
Recent Diagnoses: ${JSON.stringify(diagnoses?.slice(0, 3).map(d => d.analysis))}
CBT Work Completed: ${cbtReframes?.length || 0} reframes
Gratitude Practice: ${gratitude?.length || 0} entries

Provide a structured report in JSON format:
{
  "executive_summary": "2-3 paragraph overview of the client's mental health journey",
  "mood_analysis": "Analysis of mood patterns and trends",
  "key_concerns": ["Primary mental health concerns identified"],
  "progress_indicators": ["Positive changes and growth areas"],
  "personality_insights": "How personality traits influence mental health",
  "therapeutic_recommendations": ["Specific recommendations for treatment"],
  "crisis_indicators": "Any warning signs that need immediate attention",
  "strengths": ["Client's psychological strengths and resources"]
}

Be professional, evidence-based, and clinically appropriate.`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a clinical psychologist generating professional reports. Respond with JSON only.' },
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
    const reportData = JSON.parse(openaiData.choices[0].message.content)

    // Add statistics to report
    const fullReport = {
      ...reportData,
      statistics: {
        total_journals: journals?.length || 0,
        average_mood: avgMood,
        total_diagnoses: diagnoses?.length || 0,
        cbt_sessions: cbtReframes?.length || 0,
        gratitude_entries: gratitude?.length || 0,
        report_generated: new Date().toISOString()
      }
    }

    // Save report to database
    const { data: savedReport, error } = await supabase
      .from('therapist_reports')
      .insert({
        user_id: userId,
        report_data: fullReport,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, report: fullReport, id: savedReport.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

