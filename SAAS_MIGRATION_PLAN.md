# 🚀 SaaS Migration Plan - Option D

## Overview

Transform the Resume Builder from a client-side app into a production-ready SaaS with:
- User authentication and accounts
- Server-side API key management
- Payment integration
- Cloud storage for resumes
- Version history and collaboration

---

## Architecture Changes

### Current (Client-Side)
```
Browser
├── React App (all logic)
├── Local Storage (data persistence)
└── Direct API calls (exposed keys)
```

### Target (SaaS)
```
Browser                    Backend                  Services
├── React App         →   ├── Next.js API      →  ├── Supabase (Auth/DB)
├── Auth UI           →   ├── Auth middleware  →  ├── Stripe (Payments)
└── API calls         →   └── LLM proxy        →  └── OpenAI/Gemini
```

---

## Phase 1: Backend Setup (Week 1)

### 1.1 Choose Stack
**Option A: Next.js (Recommended)**
- Pros: Same React codebase, API routes, easy deployment
- Cons: Need to migrate from Vite

**Option B: Separate Backend (Node.js + Express)**
- Pros: Keep existing Vite frontend
- Cons: More complex deployment, CORS issues

**Decision: Next.js** - Easier migration, better DX

### 1.2 Supabase Setup
- [ ] Create Supabase project
- [ ] Set up authentication (email/password, Google OAuth)
- [ ] Design database schema
- [ ] Set up Row Level Security (RLS)

### Database Schema
```sql
-- Users (managed by Supabase Auth)

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  theme JSONB NOT NULL,
  template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Resume Versions (for history)
CREATE TABLE resume_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES resumes NOT NULL,
  data JSONB NOT NULL,
  theme JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL, -- 'free', 'pro', 'enterprise'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL, -- 'tailor', 'export'
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 2: Authentication (Week 1-2)

### 2.1 Frontend Auth Components
- [ ] Login page
- [ ] Signup page
- [ ] Password reset flow
- [ ] OAuth buttons (Google, GitHub)
- [ ] Protected routes
- [ ] Auth context/provider

### 2.2 Backend Auth Middleware
- [ ] JWT verification
- [ ] Session management
- [ ] Rate limiting per user
- [ ] API key rotation

---

## Phase 3: API Migration (Week 2)

### 3.1 Move LLM Calls to Backend
**Current**: Client → OpenAI directly (exposed keys)
**Target**: Client → Next.js API → OpenAI (secure)

```typescript
// pages/api/tailor-resume.ts
export default async function handler(req, res) {
  // 1. Verify user authentication
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // 2. Check subscription limits
  const canUse = await checkUsageLimit(user.id);
  if (!canUse) return res.status(429).json({ error: 'Limit exceeded' });

  // 3. Call LLM with server-side key
  const result = await LLMService.tailorResume(
    process.env.OPENAI_API_KEY,
    req.body.sourceResume,
    req.body.workHistory,
    req.body.jobDescription
  );

  // 4. Track usage
  await trackUsage(user.id, 'tailor', result.tokensUsed);

  return res.json(result);
}
```

### 3.2 API Endpoints Needed
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/resumes` - List user's resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes/:id` - Get resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/tailor` - AI tailoring
- `GET /api/resumes/:id/versions` - Version history
- `POST /api/export/:format` - Export resume
- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/checkout` - Create checkout session

---

## Phase 4: Payment Integration (Week 2-3)

### 4.1 Stripe Setup
- [ ] Create Stripe account
- [ ] Set up products and pricing
- [ ] Configure webhooks
- [ ] Test mode integration

### 4.2 Pricing Tiers
```
Free Tier
- 3 AI tailoring requests/month
- 5 resume exports/month
- 3 saved resumes
- Basic templates

Pro Tier ($9.99/month)
- Unlimited AI tailoring
- Unlimited exports
- Unlimited saved resumes
- All templates
- Version history
- Priority support

Enterprise Tier ($29.99/month)
- Everything in Pro
- Custom templates
- Team collaboration
- API access
- Dedicated support
```

### 4.3 Stripe Integration
```typescript
// pages/api/subscription/checkout.ts
import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const user = await getUser(req);

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID_PRO,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
  });

  res.json({ sessionId: session.id });
}
```

---

## Phase 5: Cloud Storage (Week 3)

### 5.1 Resume CRUD Operations
- [ ] Save resume to Supabase
- [ ] Load resume from Supabase
- [ ] List all user resumes
- [ ] Delete resume (soft delete)
- [ ] Share resume (public link)

### 5.2 Version History
- [ ] Auto-save versions on major changes
- [ ] View version history
- [ ] Restore previous version
- [ ] Compare versions (diff view)

---

## Phase 6: User Dashboard (Week 3-4)

### 6.1 Dashboard Features
- [ ] Resume list with thumbnails
- [ ] Create new resume
- [ ] Duplicate resume
- [ ] Delete resume
- [ ] Search/filter resumes
- [ ] Sort by date/name

### 6.2 Account Settings
- [ ] Profile management
- [ ] Email preferences
- [ ] Subscription management
- [ ] Usage statistics
- [ ] API key management (for Enterprise)

---

## Phase 7: Deployment (Week 4)

### 7.1 Hosting Options
**Option A: Vercel (Recommended for Next.js)**
- Pros: Zero-config, automatic deployments, edge functions
- Cons: Vendor lock-in

**Option B: AWS (Amplify/ECS)**
- Pros: Full control, scalable
- Cons: More complex setup

**Decision: Vercel** - Easiest for Next.js

### 7.2 Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# LLM APIs
OPENAI_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=

# App
NEXT_PUBLIC_URL=https://resumebuilder.com
JWT_SECRET=
```

### 7.3 Deployment Checklist
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure analytics (Posthog, Mixpanel)
- [ ] Set up error tracking
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Load testing
- [ ] Security audit

---

## Migration Strategy

### Option A: Big Bang (Not Recommended)
- Migrate everything at once
- High risk, long downtime

### Option B: Gradual Migration (Recommended)
1. **Week 1**: Set up backend, keep frontend working
2. **Week 2**: Add auth, make it optional
3. **Week 3**: Migrate API calls, keep local storage as fallback
4. **Week 4**: Add payments, make it required for new users
5. **Week 5**: Migrate existing users, deprecate local storage

---

## Risk Mitigation

### Data Loss Prevention
- Export feature for local data
- Migration tool for existing users
- Backup strategy

### Performance
- CDN for static assets
- Database indexing
- Caching strategy (Redis)
- Rate limiting

### Security
- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- API key rotation

---

## Cost Estimation

### Monthly Costs (100 users)
- Supabase: $25/month (Pro plan)
- Vercel: $20/month (Pro plan)
- Stripe: 2.9% + $0.30 per transaction
- OpenAI API: ~$50/month (estimated)
- Domain: $12/year
- **Total: ~$100/month**

### Monthly Costs (1000 users)
- Supabase: $25/month
- Vercel: $20/month
- Stripe: 2.9% + $0.30 per transaction
- OpenAI API: ~$500/month
- **Total: ~$550/month**

### Revenue Projection
- 1000 users × 10% conversion × $9.99 = $999/month
- Break-even: ~55 paying customers

---

## Timeline Summary

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Backend + Auth | Supabase setup, auth flow |
| 2 | API Migration | Secure LLM calls, CRUD APIs |
| 3 | Payments + Storage | Stripe integration, cloud saves |
| 4 | Dashboard + Deploy | User dashboard, production launch |

**Total: 4 weeks for MVP SaaS**

---

## Next Steps

1. **Decide on migration approach** (Next.js vs separate backend)
2. **Set up Supabase project**
3. **Create database schema**
4. **Implement authentication**
5. **Migrate API calls to backend**

---

**Status**: 📋 PLAN READY - Awaiting approval to start implementation
