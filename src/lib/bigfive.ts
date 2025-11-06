// Big Five (OCEAN) Personality Test Questions
// Based on the International Personality Item Pool (IPIP)

export interface BigFiveQuestion {
  id: number
  text: string
  trait: 'O' | 'C' | 'E' | 'A' | 'N' // Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
  reverse: boolean // Whether the question is reverse-scored
}

export const bigFiveQuestions: BigFiveQuestion[] = [
  // Openness to Experience (O)
  { id: 1, text: "I have a vivid imagination", trait: 'O', reverse: false },
  { id: 2, text: "I am not interested in abstract ideas", trait: 'O', reverse: true },
  { id: 3, text: "I have difficulty understanding abstract ideas", trait: 'O', reverse: true },
  { id: 4, text: "I enjoy thinking about complex problems", trait: 'O', reverse: false },
  { id: 5, text: "I am full of ideas", trait: 'O', reverse: false },
  { id: 6, text: "I prefer routine over variety", trait: 'O', reverse: true },
  { id: 7, text: "I enjoy hearing new ideas", trait: 'O', reverse: false },
  { id: 8, text: "I avoid philosophical discussions", trait: 'O', reverse: true },
  { id: 9, text: "I see beauty in things that others might not notice", trait: 'O', reverse: false },

  // Conscientiousness (C)
  { id: 10, text: "I am always prepared", trait: 'C', reverse: false },
  { id: 11, text: "I leave my belongings around", trait: 'C', reverse: true },
  { id: 12, text: "I pay attention to details", trait: 'C', reverse: false },
  { id: 13, text: "I make a mess of things", trait: 'C', reverse: true },
  { id: 14, text: "I get chores done right away", trait: 'C', reverse: false },
  { id: 15, text: "I often forget to put things back in their proper place", trait: 'C', reverse: true },
  { id: 16, text: "I like order", trait: 'C', reverse: false },
  { id: 17, text: "I shirk my duties", trait: 'C', reverse: true },
  { id: 18, text: "I follow a schedule", trait: 'C', reverse: false },

  // Extraversion (E)
  { id: 19, text: "I am the life of the party", trait: 'E', reverse: false },
  { id: 20, text: "I don't talk a lot", trait: 'E', reverse: true },
  { id: 21, text: "I feel comfortable around people", trait: 'E', reverse: false },
  { id: 22, text: "I keep in the background", trait: 'E', reverse: true },
  { id: 23, text: "I start conversations", trait: 'E', reverse: false },
  { id: 24, text: "I have little to say", trait: 'E', reverse: true },
  { id: 25, text: "I talk to a lot of different people at parties", trait: 'E', reverse: false },
  { id: 26, text: "I don't like to draw attention to myself", trait: 'E', reverse: true },
  { id: 27, text: "I am skilled in handling social situations", trait: 'E', reverse: false },

  // Agreeableness (A)
  { id: 28, text: "I am interested in people", trait: 'A', reverse: false },
  { id: 29, text: "I insult people", trait: 'A', reverse: true },
  { id: 30, text: "I sympathize with others' feelings", trait: 'A', reverse: false },
  { id: 31, text: "I am not interested in other people's problems", trait: 'A', reverse: true },
  { id: 32, text: "I have a soft heart", trait: 'A', reverse: false },
  { id: 33, text: "I am not really interested in others", trait: 'A', reverse: true },
  { id: 34, text: "I take time out for others", trait: 'A', reverse: false },
  { id: 35, text: "I feel little concern for others", trait: 'A', reverse: true },
  { id: 36, text: "I make people feel at ease", trait: 'A', reverse: false },

  // Neuroticism (N)
  { id: 37, text: "I get stressed out easily", trait: 'N', reverse: false },
  { id: 38, text: "I am relaxed most of the time", trait: 'N', reverse: true },
  { id: 39, text: "I worry about things", trait: 'N', reverse: false },
  { id: 40, text: "I seldom feel blue", trait: 'N', reverse: true },
  { id: 41, text: "I am easily disturbed", trait: 'N', reverse: false },
  { id: 42, text: "I remain calm under pressure", trait: 'N', reverse: true },
  { id: 43, text: "I get upset easily", trait: 'N', reverse: false },
  { id: 44, text: "I panic easily", trait: 'N', reverse: false },
]

export interface BigFiveScores {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface Answer {
  questionId: number
  value: number // 1-5 scale (Strongly Disagree to Strongly Agree)
}

export function calculateBigFiveScores(answers: Answer[]): BigFiveScores {
  const scores: Record<string, number[]> = {
    O: [],
    C: [],
    E: [],
    A: [],
    N: [],
  }

  answers.forEach(answer => {
    const question = bigFiveQuestions.find(q => q.id === answer.questionId)
    if (!question) return

    // Reverse score if needed (6 - value for 1-5 scale)
    const score = question.reverse ? (6 - answer.value) : answer.value
    scores[question.trait].push(score)
  })

  // Calculate averages and normalize to 0-100 scale
  const normalize = (arr: number[]) => {
    if (arr.length === 0) return 50
    const avg = arr.reduce((sum, val) => sum + val, 0) / arr.length
    return ((avg - 1) / 4) * 100 // Convert 1-5 scale to 0-100
  }

  return {
    openness: Math.round(normalize(scores.O)),
    conscientiousness: Math.round(normalize(scores.C)),
    extraversion: Math.round(normalize(scores.E)),
    agreeableness: Math.round(normalize(scores.A)),
    neuroticism: Math.round(normalize(scores.N)),
  }
}

export function getPersonalityType(scores: BigFiveScores): string {
  const traits: string[] = []

  if (scores.openness >= 60) traits.push('Creative & Open-minded')
  else if (scores.openness <= 40) traits.push('Practical & Conventional')

  if (scores.conscientiousness >= 60) traits.push('Organized & Disciplined')
  else if (scores.conscientiousness <= 40) traits.push('Flexible & Spontaneous')

  if (scores.extraversion >= 60) traits.push('Outgoing & Energetic')
  else if (scores.extraversion <= 40) traits.push('Reserved & Reflective')

  if (scores.agreeableness >= 60) traits.push('Compassionate & Cooperative')
  else if (scores.agreeableness <= 40) traits.push('Analytical & Assertive')

  if (scores.neuroticism >= 60) traits.push('Emotionally Sensitive')
  else if (scores.neuroticism <= 40) traits.push('Emotionally Stable')

  return traits.join(', ')
}

