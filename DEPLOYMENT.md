# SAMVEDNA Deployment Guide

Complete guide to deploying the SAMVEDNA mental health application.

## Prerequisites

1. **Accounts Required:**
   - GitHub account
   - Supabase account (https://supabase.com)
   - OpenAI API account (https://platform.openai.com)
   - Vercel account (https://vercel.com)

2. **Local Tools:**
   - Node.js 18+ and npm
   - Git
   - Supabase CLI (optional but recommended)

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name:** samvedna-production
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
4. Wait for project to finish setting up (2-3 minutes)

### 1.2 Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query and paste contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run** to execute
4. Create another query with `supabase/migrations/002_rls_policies.sql`
5. Click **Run** to execute
6. Verify tables exist in **Database** → **Tables**

### 1.3 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `media`
4. Make it **Public**
5. Click **Create bucket**

### 1.4 Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (starts with https://...)
   - **anon public key** (starts with eyJ...)
   - **service_role key** (starts with eyJ... - keep secret!)

## Part 2: OpenAI API Setup

### 2.1 Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click **Create new secret key**
3. Name it "SAMVEDNA Production"
4. Copy the key (starts with sk-...) - you can't see it again!
5. Save it securely

### 2.2 Add Credits (if needed)

1. Go to **Billing** in OpenAI Dashboard
2. Add payment method
3. Add at least $5 for testing

## Part 3: Deploy Edge Functions

### 3.1 Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### 3.2 Link to Your Project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

(Get YOUR_PROJECT_REF from Supabase dashboard URL)

### 3.3 Set Edge Function Secrets

```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### 3.4 Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy diagnose
supabase functions deploy cbt-reframe
supabase functions deploy match-peers
supabase functions deploy vent-anonymize
supabase functions deploy ai-companion
supabase functions deploy generate-report
```

### 3.5 Verify Deployment

In Supabase Dashboard:
1. Go to **Edge Functions**
2. You should see all 6 functions listed
3. Click each one to verify deployment status

## Part 4: Deploy Frontend to Vercel

### 4.1 Push Code to GitHub (Already Done)

Your code is already at:
https://github.com/shikhar1809/Samvedna_GenAi_Hackathon_Main

### 4.2 Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **Add New Project**
3. Import from GitHub: `Samvedna_GenAi_Hackathon_Main`
4. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```
6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete

### 4.3 Get Your Live URL

After deployment:
- Your app will be live at: `https://your-project-name.vercel.app`
- Vercel provides automatic HTTPS
- Custom domain can be added in Vercel settings

## Part 5: Post-Deployment Configuration

### 5.1 Configure Authentication Redirects

In Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add Site URL: `https://your-project-name.vercel.app`
3. Add Redirect URLs:
   ```
   https://your-project-name.vercel.app/dashboard
   https://your-project-name.vercel.app/onboarding
   ```

### 5.2 Enable OAuth Providers (Optional)

For Google Sign-In:
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add OAuth credentials from Google Cloud Console
4. Configure Authorized redirect URIs

## Part 6: Testing

### 6.1 Test User Flow

1. Visit your live URL
2. Click **Sign Up** and create a test account
3. Complete onboarding (Big Five quiz)
4. Test each feature:
   - ✅ Journal entry with mood picker
   - ✅ AI Diagnosis
   - ✅ CBT Reframing
   - ✅ AI Companion chat
   - ✅ Anonymous Vent
   - ✅ Join Support Group
   - ✅ Gratitude entry
   - ✅ Generate Report
   - ✅ Therapy Library

### 6.2 Verify Edge Functions

Check Supabase Dashboard → **Edge Functions** → Logs for any errors

### 6.3 Monitor Usage

- **OpenAI Usage:** https://platform.openai.com/usage
- **Supabase Usage:** Dashboard → Settings → Usage
- **Vercel Analytics:** Dashboard → Analytics

## Part 7: Environment Variables Reference

### Frontend (.env.local for local dev)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Edge Functions (Supabase Secrets)
```bash
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Part 8: Troubleshooting

### Issue: Edge Functions Return 500 Error

**Solution:**
1. Check logs in Supabase Dashboard → Edge Functions
2. Verify OpenAI API key is set correctly
3. Ensure OPENAI_API_KEY secret is deployed

### Issue: Authentication Not Working

**Solution:**
1. Verify redirect URLs in Supabase Auth settings
2. Check that Supabase URL and keys are correct in Vercel
3. Clear browser cookies and try again

### Issue: Database Queries Fail

**Solution:**
1. Verify RLS policies are enabled
2. Check user is authenticated
3. Review policies in Supabase Dashboard → Database → Policies

### Issue: CORS Errors

**Solution:**
- Edge Functions already have CORS headers
- If issues persist, check Vercel deployment logs

## Part 9: Cost Estimates

### Free Tier Limits

**Supabase (Free):**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 500,000 Edge Function invocations

**Vercel (Free):**
- 100 GB bandwidth
- Unlimited deployments
- Automatic HTTPS

**OpenAI (Pay-as-you-go):**
- GPT-4o-mini: ~$0.15 per 1M input tokens
- Estimated cost: $5-10 for 100-200 users/month

### When to Upgrade

Upgrade Supabase when:
- Database exceeds 500 MB
- Need more than 500K Edge Function calls
- Require additional features

## Part 10: Maintenance

### Regular Tasks

1. **Monitor Costs:**
   - Check OpenAI usage weekly
   - Review Supabase metrics

2. **Database Backups:**
   - Supabase auto-backs up daily (paid plans)
   - Export data manually if on free tier

3. **Update Dependencies:**
   ```bash
   npm update
   git add package-lock.json
   git commit -m "chore: update dependencies"
   git push
   ```
   - Vercel auto-deploys on push

4. **Review Logs:**
   - Check Edge Function logs for errors
   - Monitor Vercel deployment logs

## Part 11: Scaling Considerations

### When Your App Grows

1. **Add CDN:** Vercel includes global CDN
2. **Database Optimization:**
   - Add indexes for common queries
   - Use connection pooling

3. **Rate Limiting:**
   - Implement in Edge Functions
   - Use Supabase rate limiting features

4. **Caching:**
   - Cache AI responses for similar queries
   - Use React Query caching features

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs
- **Project Issues:** https://github.com/shikhar1809/Samvedna_GenAi_Hackathon_Main/issues

## Security Checklist

- [ ] Environment variables secured (not in code)
- [ ] RLS policies enabled on all tables
- [ ] Service role key never exposed to frontend
- [ ] OAuth redirect URLs configured
- [ ] HTTPS enabled (Vercel automatic)
- [ ] API rate limiting configured
- [ ] Regular security audits

---

**Deployment Complete! 🎉**

Your SAMVEDNA app is now live and ready to help users improve their mental health.

For questions or issues, create an issue on GitHub.

