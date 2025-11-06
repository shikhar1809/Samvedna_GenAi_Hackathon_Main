# SAMVEDNA - AI Mental Health Companion

An AI-powered mental health support platform built with React, TypeScript, Supabase, and OpenAI.

## Features

- **AI-Powered Diagnosis**: Journal analysis using OpenAI with DSM-5 criteria
- **Peer Support**: AI-matched peer connections with real-time chat
- **CBT Reframing Tool**: Cognitive distortion identification and reframing
- **Anonymous Venting**: Safe space with PII removal
- **Support Groups**: Community-based support for various mental health conditions
- **Therapist Reports**: AI-generated comprehensive reports
- **Gratitude Tracking**: Daily prompts and history
- **AI Companion**: Empathetic conversational AI with crisis detection
- **Therapy Library**: Curated resources for CBT, DBT, and mindfulness

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- **AI**: OpenAI API
- **State Management**: React Query
- **Routing**: React Router
- **Animations**: Framer Motion

## Setup

1. Clone the repository:
```bash
git clone https://github.com/shikhar1809/Samvedna_GenAi_Hackathon_Main.git
cd Samvendna_GenAI
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Run the development server:
```bash
npm run dev
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run migrations from `supabase/migrations/` in the SQL Editor
3. Deploy Edge Functions from `supabase/functions/` using Supabase CLI
4. Add OpenAI API key to Edge Function secrets

## Deployment

- Frontend: Deploy to Vercel by connecting your GitHub repository
- Edge Functions: Deploy using Supabase CLI
- Environment variables: Configure in Vercel dashboard

## Project Structure

```
samvedna/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route pages
│   ├── lib/             # Utilities and Supabase client
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
├── supabase/
│   ├── migrations/      # SQL schema and RLS policies
│   └── functions/       # Edge Functions (OpenAI integration)
└── public/              # Static assets
```

## Contributing

This project was built for the GenAI Hackathon. Contributions are welcome!

## License

MIT License

