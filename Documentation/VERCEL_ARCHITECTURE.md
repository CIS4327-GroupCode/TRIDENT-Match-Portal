# TRIDENT Match Portal - Vercel Architecture Diagram

**Last Updated**: November 25, 2025  
**Deployment Platform**: Vercel  
**Rendering Strategy**: Hybrid (SSG + CSR)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │             │
│  │   Chrome     │  │    Safari    │  │   Firefox    │             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│                     HTTPS Request                                   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                            │
│                   (300+ Global Locations)                           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  INTELLIGENT ROUTING                          │ │
│  │  • Geo-proximity routing                                      │ │
│  │  • DDoS protection                                            │ │
│  │  • SSL/TLS termination                                        │ │
│  │  • Automatic failover                                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│         ┌─────────────────────┬─────────────────────┐              │
│         │                     │                     │              │
│         ▼                     ▼                     ▼              │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐        │
│  │   Static    │      │   API       │      │   Dynamic   │        │
│  │   Assets    │      │   Routes    │      │   Pages     │        │
│  │   (CDN)     │      │ (Serverless)│      │   (Future)  │        │
│  └─────────────┘      └─────────────┘      └─────────────┘        │
└─────────┬───────────────────┬───────────────────┬──────────────────┘
          │                   │                   │
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Static Files   │  │ Serverless      │  │ Future ISR      │
│  Edge Cache     │  │ Functions       │  │ Pages           │
│                 │  │                 │  │                 │
│ • index.html    │  │ /api/auth/      │  │ /projects       │
│ • JS bundles    │  │   register      │  │ /projects/:id   │
│ • CSS files     │  │   login         │  │                 │
│ • Images        │  │                 │  │                 │
│ • Fonts         │  │ Future:         │  │                 │
│                 │  │ /api/users/*    │  │                 │
│ Cache: 1 year   │  │ /api/orgs/*     │  │                 │
│                 │  │ /api/projects/* │  │                 │
└─────────────────┘  └────────┬────────┘  └─────────────────┘
                              │
                              │ Database Connection
                              │ (SSL/TLS)
                              ▼
                     ┌─────────────────┐
                     │  NEON           │
                     │  PostgreSQL     │
                     │  (Serverless)   │
                     │                 │
                     │ • Auto-scaling  │
                     │ • Connection    │
                     │   pooling       │
                     │ • Branching     │
                     │ • Read replicas │
                     └─────────────────┘
```

---

## Request Flow Diagrams

### Flow 1: Home Page Request (Public)

```
User Browser
    │
    │ 1. GET https://tridentmatch.com/
    ▼
Vercel Edge (Nearest Location)
    │
    │ 2. Check Edge Cache
    ├─► CACHE HIT → Return cached HTML (< 50ms)
    │
    └─► CACHE MISS
        │
        │ 3. Fetch from Origin
        ▼
    Static Files (CDN)
        │
        │ 4. Return index.html
        ▼
    Vercel Edge
        │
        │ 5. Cache for future requests
        │ 6. Return to client
        ▼
User Browser
    │
    │ 7. Parse HTML
    │ 8. Request JS/CSS bundles
    ▼
Vercel Edge (Cached Assets)
    │
    │ 9. Return cached bundles (< 100ms)
    ▼
User Browser
    │
    │ 10. Execute React app
    │ 11. Render Home page (CSR)
    ▼
COMPLETE (Total Time: < 2s)
```

---

### Flow 2: User Registration (API Call)

```
User Browser
    │
    │ 1. Fill signup form
    │ 2. Click "Create account"
    │
    │ 3. POST /api/auth/register
    │    Body: { name, email, password, role, organizationData }
    ▼
Vercel Edge
    │
    │ 4. Route to serverless function
    ▼
Serverless Function: /api/auth/register.js
    │
    │ 5. Validate request
    │ 6. Check required fields
    │
    │ 7. Connect to database
    ▼
Neon PostgreSQL
    │
    │ 8. Check if email exists
    ├─► EXISTS → Return 409 error
    │
    └─► NOT EXISTS
        │
        │ 9. Start transaction
        │ 10. Hash password (bcrypt)
        │ 11. INSERT INTO users
        │ 12. INSERT INTO organizations (if nonprofit)
        │     OR INSERT INTO researcher_profiles (if researcher)
        │ 13. COMMIT transaction
        │
        │ 14. Return user data
        ▼
Serverless Function
    │
    │ 15. Generate JWT token
    │ 16. Return response
    │     { token, user: { id, name, email, role } }
    ▼
User Browser
    │
    │ 17. Store token in localStorage
    │ 18. Redirect to /dashboard/:role
    ▼
COMPLETE (Total Time: < 500ms)
```

---

### Flow 3: Dashboard Access (Authenticated)

```
User Browser
    │
    │ 1. Navigate to /dashboard/researcher
    ▼
React Router (Client-Side)
    │
    │ 2. Check if route matches
    │ 3. Load Dashboard component
    ▼
AuthContext
    │
    │ 4. Check for token in localStorage
    ├─► NO TOKEN → Redirect to Home
    │
    └─► TOKEN EXISTS
        │
        │ 5. Parse JWT (client-side)
        │ 6. Extract user info
        │
        │ Future: Verify token with API
        │ 7. Optional: GET /api/users/me
        ▼
Dashboard Component
    │
    │ 8. Render based on role
    │    - Nonprofit: NonprofitDashboard
    │    - Researcher: ResearcherDashboard
    │    - Admin: AdminDashboard
    │
    │ 9. Fetch user-specific data
    │    GET /api/projects/me
    │    GET /api/matches/me
    ▼
COMPLETE (Client-Side Rendering)
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                              │
│                    (React 18 + Vite)                            │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Pages   │  │Components│  │ Context  │  │  Config  │       │
│  │          │  │          │  │          │  │          │       │
│  │ Home.jsx │  │ TopBar   │  │ Auth     │  │ api.js   │       │
│  │ Dashboard│  │ Hero     │  │ Context  │  │          │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │              │
│       └─────────────┴─────────────┴─────────────┘              │
│                          │                                     │
│                    API Calls (Fetch)                           │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API LAYER                                   │
│              (Vercel Serverless Functions)                      │
│                                                                 │
│  /api/auth/register.js                                          │
│  ├─ Validate input                                              │
│  ├─ Hash password (bcrypt)                                      │
│  ├─ Create user + profile (transaction)                         │
│  └─ Return JWT token                                            │
│                                                                 │
│  /api/auth/login.js                                             │
│  ├─ Find user by email                                          │
│  ├─ Verify password (bcrypt.compare)                            │
│  ├─ Generate JWT                                                │
│  └─ Return token + user                                         │
│                                                                 │
│  Future API Routes:                                             │
│  /api/users/*       (User management)                           │
│  /api/organizations/* (Nonprofit profiles)                      │
│  /api/researchers/* (Researcher profiles)                       │
│  /api/projects/*    (Project CRUD)                              │
│  /api/matches/*     (Matching system)                           │
│  /api/messages/*    (Real-time messaging)                       │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                     Sequelize ORM
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                              │
│                  (Neon PostgreSQL)                              │
│                                                                 │
│  Tables (10):                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │    users       │  │ organizations  │  │ researcher_    │    │
│  │                │  │                │  │ profiles       │    │
│  │ • id (PK)      │  │ • id (PK)      │  │ • id (PK)      │    │
│  │ • name         │  │ • user_id (FK) │  │ • user_id (FK) │    │
│  │ • email (UQ)   │  │ • org_name     │  │ • affiliation  │    │
│  │ • password     │  │ • ein          │  │ • domains      │    │
│  │ • role         │  │ • mission      │  │ • methods      │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   projects     │  │    matches     │  │   agreements   │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │   messages     │  │   ratings      │  │   milestones   │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                 │
│  ┌────────────────┐                                             │
│  │   audit_logs   │                                             │
│  └────────────────┘                                             │
│                                                                 │
│  Indexes:                                                       │
│  • users(email) UNIQUE                                          │
│  • organizations(user_id)                                       │
│  • researcher_profiles(user_id)                                 │
│  • projects(organization_id)                                    │
│  • matches(project_id, researcher_id)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: NETWORK SECURITY
├─ Vercel Edge Network
│  ├─ DDoS Protection (Automatic)
│  ├─ SSL/TLS 1.3 (Automatic)
│  ├─ HTTP/2 & HTTP/3 Support
│  └─ HTTPS-only redirect

Layer 2: APPLICATION SECURITY
├─ CORS Configuration
│  ├─ Allow specific origins
│  └─ Credentials handling
│
├─ Rate Limiting (Future)
│  ├─ Auth endpoints: 5 req/min
│  └─ API endpoints: 100 req/min
│
├─ Input Validation
│  ├─ Client-side (React forms)
│  ├─ Server-side (API functions)
│  └─ Database constraints
│
└─ Security Headers
   ├─ X-Content-Type-Options: nosniff
   ├─ X-Frame-Options: DENY
   ├─ X-XSS-Protection: 1; mode=block
   └─ Content-Security-Policy

Layer 3: AUTHENTICATION & AUTHORIZATION
├─ JWT Tokens
│  ├─ Signed with secret key
│  ├─ 7-day expiration
│  └─ Stored in localStorage
│
├─ Password Security
│  ├─ bcrypt hashing (10 rounds)
│  ├─ Minimum 8 characters
│  └─ No plaintext storage
│
└─ Role-Based Access Control (RBAC)
   ├─ Nonprofit: Project creation, researcher matching
   ├─ Researcher: Profile management, project applications
   └─ Admin: Moderation, analytics

Layer 4: DATA SECURITY
├─ Database Security
│  ├─ SSL/TLS connections
│  ├─ Connection pooling (max 2)
│  ├─ Prepared statements (SQL injection prevention)
│  └─ Parameterized queries
│
├─ Secrets Management
│  ├─ Environment variables (Vercel)
│  ├─ Never commit .env files
│  └─ Rotate secrets regularly
│
└─ Data Privacy
   ├─ PII encryption at rest
   ├─ Audit logs for sensitive operations
   └─ GDPR compliance ready

Layer 5: MONITORING & INCIDENT RESPONSE
├─ Error Tracking (Sentry)
├─ Uptime Monitoring
├─ Log Analysis (Vercel Dashboard)
└─ Security Alerts
```

---

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  DEVELOPMENT WORKFLOW                           │
└─────────────────────────────────────────────────────────────────┘

Developer Machine
    │
    │ 1. Code changes
    │ 2. Test locally (npm run dev)
    │ 3. Commit to Git
    │
    │ git add .
    │ git commit -m "feat: add new feature"
    │ git push origin feature-branch
    ▼
GitHub Repository
    │
    │ 4. Create Pull Request
    ▼
Vercel (Automatic)
    │
    │ 5. Detect new commit
    │ 6. Create Preview Deployment
    │
    ├─► Build Frontend
    │   ├─ npm install
    │   ├─ npm run build
    │   └─ Generate static files
    │
    ├─► Deploy API Functions
    │   ├─ Bundle serverless functions
    │   └─ Upload to Vercel
    │
    │ 7. Run Tests (optional)
    │
    │ 8. Deploy to Preview URL
    │    https://trident-abc123.vercel.app
    ▼
Preview Deployment Ready
    │
    │ 9. Team reviews PR
    │ 10. Test on preview URL
    │ 11. Approve PR
    ▼
GitHub
    │
    │ 12. Merge to main branch
    ▼
Vercel (Automatic)
    │
    │ 13. Detect merge to main
    │ 14. Build production deployment
    │
    ├─► Build Frontend
    ├─► Deploy API Functions
    ├─► Invalidate CDN cache
    │
    │ 15. Deploy to Production
    │     https://tridentmatch.com
    ▼
Production Deployment
    │
    │ 16. Health check
    │ 17. Notify team (Slack/Email)
    ▼
COMPLETE (Total Time: 2-3 minutes)
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                  PERFORMANCE LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

1. EDGE CACHING
   ├─ Static Assets: 1 year cache
   ├─ HTML: No cache (always fresh)
   └─ CDN: 300+ global locations

2. CODE SPLITTING
   ├─ React lazy loading
   ├─ Route-based splitting
   └─ Vendor chunk separation
      ├─ react-vendor.js (158KB)
      └─ bootstrap.js (52KB)

3. ASSET OPTIMIZATION
   ├─ Minification (Vite)
   ├─ Tree shaking (unused code removal)
   ├─ Compression (gzip/brotli)
   └─ Image optimization (future: Vercel Image)

4. DATABASE OPTIMIZATION
   ├─ Connection pooling (max 2)
   ├─ Indexes on foreign keys
   ├─ Query optimization
   └─ Future: Read replicas

5. API OPTIMIZATION
   ├─ Serverless cold start < 200ms
   ├─ Function size < 50MB
   ├─ Response caching (future)
   └─ Rate limiting

6. MONITORING
   ├─ Core Web Vitals
   │  ├─ LCP < 2.5s
   │  ├─ FID < 100ms
   │  └─ CLS < 0.1
   │
   ├─ Lighthouse Scores
   │  ├─ Performance: 90+
   │  ├─ Accessibility: 95+
   │  ├─ Best Practices: 95+
   │  └─ SEO: 100
   │
   └─ Real User Monitoring (Vercel Analytics)
```

---

## Scalability Architecture

```
Current Load (MVP):
├─ 100 users
├─ 1,000 requests/day
├─ 10 GB bandwidth/month
└─ Cost: $0/month ✅

Medium Load (Year 1):
├─ 10,000 users
├─ 100,000 requests/day
├─ 500 GB bandwidth/month
└─ Cost: $20/month (Vercel Pro)

High Load (Year 2+):
├─ 100,000+ users
├─ 1,000,000+ requests/day
├─ 5 TB bandwidth/month
└─ Auto-scaling:
   ├─ Vercel Functions scale automatically
   ├─ Neon database scales compute
   ├─ CDN handles static assets
   └─ Estimated cost: $100-500/month
```

---

**Document Version**: 1.0  
**Created**: November 25, 2025  
**Architecture Type**: Serverless JAMstack  
**Deployment Platform**: Vercel  
**Database**: Neon PostgreSQL (Serverless)
