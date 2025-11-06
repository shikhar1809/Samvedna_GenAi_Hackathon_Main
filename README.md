# SAMVEDNA - AI Mental Health Companion

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Status](https://img.shields.io/badge/status-active-success)

An AI-powered mental health support platform built with React, TypeScript, Supabase, and OpenAI.

## ✨ Features

### 🧠 **AI-Powered Diagnosis**
Journal analysis using OpenAI GPT-4o-mini with DSM-5 criteria for personalized mental health insights.

### 🤝 **Peer Support**
AI-matched peer connections based on personality and mental health goals.

### 💭 **CBT Reframing Tool**
Identify cognitive distortions and reframe negative thoughts using evidence-based CBT techniques.

### 💬 **Anonymous Venting**
Safe space to express yourself with automatic PII removal for privacy protection.

### 👥 **Support Groups**
Join communities focused on specific conditions (Anxiety, Depression, PTSD, etc.).

### 📊 **Therapist Reports**
Generate comprehensive reports to share with mental health professionals.

### ✨ **Gratitude Practice**
Daily gratitude prompts to improve mental well-being.

### 🤖 **AI Companion**
Empathetic conversational AI with crisis detection and supportive responses.

### 📚 **Therapy Library**
Curated videos and articles for CBT, DBT, mindfulness, and more.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
- **AI**: OpenAI API
- **State Management**: React Query
- **Routing**: React Router
- **Animations**: Framer Motion

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/shikhar1809/Samvedna_GenAi_Hackathon_Main.git
cd Samvendna_GenAI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Visit `http://localhost:5173`

### Production Deployment

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.**

Quick summary:
1. Set up Supabase project and run migrations
2. Deploy Edge Functions with OpenAI API key
3. Deploy frontend to Vercel
4. Configure environment variables

## 🔑 Environment Variables

### Frontend (Vercel)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Edge Functions (Supabase Secrets)
```bash
OPENAI_API_KEY=sk-your-openai-key
```

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

