# Vercel Deployment Configuration Analysis & Recommendations

**Date:** December 10, 2025  
**Purpose:** Prepare TRIDENT Match Portal for separate Vercel deployments (frontend + backend)

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  VERCEL DEPLOYMENT                  │
├──────────────────────┬──────────────────────────────┤
│  Frontend Instance   │    Backend Instance          │
│  (React + Vite)      │    (Express API)             │
│  Port: N/A (CDN)     │    Serverless Functions      │
└──────────────────────┴──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Neon PostgreSQL │
                    │  (Cloud Database)│
                    └──────────────────┘
```

---

## ⚠️ CRITICAL ISSUES IDENTIFIED

### 1. **Hardcoded API URLs in Frontend** ❌

**Issue:** Multiple frontend files use `http://localhost:4000` directly instead of environment variables.

**Files Affected:**
- `frontend/src/pages/Messages.jsx` (2 occurrences)
- `frontend/src/components/milestones/MilestoneTracker.jsx` (4 occurrences)
- `frontend/src/components/milestones/MilestoneForm.jsx` (2 occurrences)

**Impact:** Will fail in production when deployed to Vercel.

**Example:**
```javascript
// ❌ PROBLEM
fetch(`http://localhost:4000/api/messages/thread/${threadId}`)

// ✅ SOLUTION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
fetch(`${API_URL}/api/messages/thread/${threadId}`)
```

---

### 2. **Vite Proxy Configuration** ⚠️

**Current:** `vite.config.js` has proxy to `http://localhost:4000`

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:4000',
    changeOrigin: true
  }
}
```

**Issue:** 
- Proxy only works in development
- Will not work in production build
- Port mismatch (uses 4000, backend now runs on 5000)

**Impact:** API calls may work locally but fail in production.

---

### 3. **CORS Configuration** ⚠️

**Current:** Backend allows specific origins:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);
```

**Issue:**
- Needs Vercel frontend URL added
- `FRONTEND_URL` env var must be set in Vercel backend
- Will block requests from production domain if not configured

---

### 4. **Missing Vercel Configuration Files** ❌

**Issue:** No `vercel.json` files for either frontend or backend.

**Impact:** Vercel won't know how to:
- Build the projects
- Configure routes
- Set up serverless functions
- Handle rewrites

---

### 5. **Environment Variables** ⚠️

**Issue:** `.env` files not configured for production deployment.

**Missing:**
- Frontend: `VITE_API_URL` not defined anywhere
- Backend: No `.env.example` template
- No documentation on required env vars for Vercel

---

### 6. **Database Connection Pool** ⚠️

**Issue:** Sequelize default pool settings incompatible with serverless.

**Current:** Uses default connection pooling
```javascript
// Implicit default pool
{
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

**Impact:** 
- Serverless functions create new connections on each invocation
- May exhaust Neon connection limits
- Slow cold starts

---

### 7. **Port Configuration Mismatch** ⚠️

**Issue:** Backend defaults to port 4000, but .env likely uses 5000.

```javascript
const PORT = process.env.PORT || 4000;
```

**Vite proxy:** Points to 4000  
**Hardcoded URLs:** Use 4000  
**Actual backend:** Runs on 5000  

---

## 📝 REQUIRED CONFIGURATION FILES

### 1. Frontend Vercel Configuration

**Create:** `frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_URL": "@api-url"
  }
}
```

---

### 2. Backend Vercel Configuration

**Create:** `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/health",
      "dest": "src/index.js"
    },
    {
      "src": "/api/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "REFRESH_TOKEN_SECRET": "@refresh-token-secret",
    "FRONTEND_URL": "@frontend-url"
  }
}
```

---

### 3. Frontend Environment Template

**Create:** `frontend/.env.example`

```env
# API Backend URL
VITE_API_URL=http://localhost:5000

# For production, set to your Vercel backend URL:
# VITE_API_URL=https://your-backend.vercel.app
```

---

### 4. Backend Environment Template

**Create:** `backend/.env.example`

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# CORS
FRONTEND_URL=http://localhost:3000

# For production:
# FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🔧 REQUIRED CODE CHANGES

### 1. Update `vite.config.js`

**Current Issue:** Proxy to wrong port, won't work in production

```javascript
// ❌ BEFORE
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Wrong port!
        changeOrigin: true
      }
    }
  }
})

// ✅ AFTER
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
```

---

### 2. Create API Base URL Utility

**Create:** `frontend/src/config/api.js`

```javascript
// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Helper function for API calls
export const apiUrl = (endpoint) => {
  // Remove leading slash if present
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${path}`
}

// Example usage:
// fetch(apiUrl('/api/messages'))
// fetch(apiUrl('api/messages'))  // both work
```

---

### 3. Update Backend Database Config for Serverless

**Update:** `backend/src/config/database.js`

```javascript
require('dotenv').config();

const { DATABASE_URL, NODE_ENV } = process.env;

// Serverless-optimized pool settings
const poolConfig = {
  max: 2, // Reduced for serverless
  min: 0,
  acquire: 30000,
  idle: 10000,
  evict: 10000 // Close idle connections faster
};

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: poolConfig,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },

  production: {
    url: DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      ...poolConfig,
      max: 1, // Single connection for serverless functions
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      // Neon-specific optimizations
      connectTimeout: 10000,
      keepAlive: false,
    },
  },
};
```

---

### 4. Update Backend CORS Configuration

**Update:** `backend/src/index.js`

```javascript
// CORS configuration - allow frontend to connect
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  // Add Vercel preview deployments
  /\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### 5. Fix Hardcoded URLs in Frontend

**Update all these files to use `API_BASE_URL`:**

**`frontend/src/pages/Messages.jsx`:**
```javascript
import { apiUrl } from '../config/api'

// ❌ BEFORE
fetch(`http://localhost:4000/api/messages/thread/${threadId}`)

// ✅ AFTER
fetch(apiUrl(`/api/messages/thread/${threadId}`))
```

**`frontend/src/components/milestones/MilestoneTracker.jsx`:**
```javascript
import { apiUrl } from '../../config/api'

// Update all 4 fetch calls
let url = apiUrl(`/api/projects/${projectId}/milestones`);
```

**`frontend/src/components/milestones/MilestoneForm.jsx`:**
```javascript
import { apiUrl } from '../../config/api'

// Update both fetch calls
const url = milestone 
  ? apiUrl(`/api/projects/${projectId}/milestones/${milestone.id}`)
  : apiUrl(`/api/projects/${projectId}/milestones`);
```

---

### 6. Update Backend Port Default

**Update:** `backend/src/index.js`

```javascript
// ❌ BEFORE
const PORT = process.env.PORT || 4000;

// ✅ AFTER
const PORT = process.env.PORT || 5000;
```

---

### 7. Add Vercel Serverless Compatibility

**Create:** `backend/api/index.js` (for Vercel serverless)

```javascript
// Vercel serverless function entry point
const app = require('../src/index.js');

module.exports = app;
```

**OR update** `backend/src/index.js` to export the app:

```javascript
// At the end of the file, add:
module.exports = app;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  startServer();
}
```

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] Create `frontend/vercel.json`
- [ ] Create `backend/vercel.json`
- [ ] Create `frontend/.env.example`
- [ ] Create `backend/.env.example`
- [ ] Create `frontend/src/config/api.js`
- [ ] Update `vite.config.js` with correct port and build config
- [ ] Update backend database config with serverless pool settings
- [ ] Update backend CORS to allow Vercel domains
- [ ] Fix all hardcoded localhost URLs in frontend (8 instances)
- [ ] Update backend default port to 5000
- [ ] Ensure backend app is exported for serverless
- [ ] Test locally with environment variables

### Vercel Frontend Setup

1. **Import Project**
   - Connect GitHub repository
   - Select `frontend` directory as root

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   VITE_API_URL = https://your-backend.vercel.app
   ```

4. **Domain Settings**
   - Configure custom domain (optional)
   - Note the Vercel URL for backend CORS

### Vercel Backend Setup

1. **Import Project**
   - Connect same GitHub repository
   - Select `backend` directory as root

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`
   - Root Directory: `backend`

3. **Environment Variables** (CRITICAL)
   ```
   NODE_ENV = production
   DATABASE_URL = your_neon_postgresql_url
   JWT_SECRET = your_production_jwt_secret_min_32_chars
   REFRESH_TOKEN_SECRET = your_production_refresh_secret
   ACCESS_TOKEN_EXPIRES = 15m
   REFRESH_TOKEN_EXPIRES = 7d
   FRONTEND_URL = https://your-frontend.vercel.app
   PORT = (leave empty, Vercel assigns dynamically)
   ```

4. **Database Migrations**
   - Run migrations manually via Neon dashboard or
   - Use Vercel CLI: `vercel env pull && npm run db:migrate`

### Post-Deployment

- [ ] Test frontend loads correctly
- [ ] Test API health endpoint
- [ ] Test authentication flow
- [ ] Test database connections
- [ ] Verify CORS allows requests
- [ ] Check serverless function logs
- [ ] Monitor Neon connection usage
- [ ] Test all API endpoints
- [ ] Verify environment variables
- [ ] Check build logs for errors

---

## 🚨 POTENTIAL ISSUES & SOLUTIONS

### Issue 1: Cold Start Latency

**Problem:** Serverless functions have cold start delays (500ms - 3s)

**Solutions:**
- Keep functions warm with scheduled pings
- Optimize bundle size
- Use Vercel Pro for faster cold starts
- Consider database connection pooling service (PgBouncer)

---

### Issue 2: Neon Connection Limits

**Problem:** Free tier has 100 connection limit, serverless creates many connections

**Solutions:**
- Use connection pooling in Neon (enable in dashboard)
- Set `pool.max = 1` in production config
- Use PgBouncer in front of Neon
- Upgrade to Neon paid tier

---

### Issue 3: Serverless Function Timeout

**Problem:** Vercel free tier has 10s timeout, hobby has 60s

**Solutions:**
- Optimize slow queries
- Add database indexes
- Use background jobs for long tasks
- Upgrade to Vercel Pro (300s timeout)

---

### Issue 4: File Upload Limitations

**Problem:** Serverless functions have 4.5MB payload limit on free tier

**Solutions:**
- Use direct S3/Cloudinary uploads
- Implement presigned URLs
- Stream large files
- Upgrade to Vercel Pro (50MB limit)

---

### Issue 5: Environment Variable Sync

**Problem:** Frontend and backend URLs must match exactly

**Solutions:**
- Document URLs in team wiki
- Use Vercel environment groups
- Automate with deployment scripts
- Test with preview deployments first

---

## 📊 SUMMARY OF CHANGES NEEDED

| Category | File | Change Type | Priority |
|----------|------|-------------|----------|
| **Config** | `frontend/vercel.json` | CREATE | 🔴 Critical |
| **Config** | `backend/vercel.json` | CREATE | 🔴 Critical |
| **Config** | `frontend/.env.example` | CREATE | 🟡 High |
| **Config** | `backend/.env.example` | CREATE | 🟡 High |
| **Config** | `frontend/vite.config.js` | UPDATE | 🔴 Critical |
| **Config** | `backend/src/config/database.js` | UPDATE | 🔴 Critical |
| **Code** | `frontend/src/config/api.js` | CREATE | 🔴 Critical |
| **Code** | `backend/src/index.js` (CORS) | UPDATE | 🔴 Critical |
| **Code** | `backend/src/index.js` (PORT) | UPDATE | 🟡 High |
| **Code** | `backend/src/index.js` (export) | UPDATE | 🔴 Critical |
| **Code** | `frontend/src/pages/Messages.jsx` | UPDATE | 🔴 Critical |
| **Code** | `frontend/src/components/milestones/*.jsx` | UPDATE | 🔴 Critical |

**Total Changes:** 12 files (5 new, 7 updates)

---

## 🎯 RECOMMENDED DEPLOYMENT STRATEGY

### Option A: Monorepo (Recommended)

Keep current structure, deploy separately:
- Frontend: `https://trident-frontend.vercel.app`
- Backend: `https://trident-backend.vercel.app`

**Pros:**
- Simpler to manage
- Shared Git history
- Easier local development

**Cons:**
- Must configure root directory for each Vercel project
- Larger repository

---

### Option B: Split Repositories

Create separate repos:
- `TRIDENT-Match-Portal-Frontend`
- `TRIDENT-Match-Portal-Backend`

**Pros:**
- Cleaner deployments
- Independent versioning
- Smaller repo sizes

**Cons:**
- More complex to manage
- Harder to sync changes
- Duplicate documentation

---

## ✅ NEXT STEPS

1. **Create configuration files** (highest priority)
2. **Fix hardcoded URLs** (prevents deployment failure)
3. **Update database config** (prevents connection issues)
4. **Test locally with production env vars**
5. **Deploy to Vercel preview environment first**
6. **Test all features in preview**
7. **Deploy to production**
8. **Monitor logs and performance**

---

**Last Updated:** December 10, 2025  
**Status:** Ready for implementation  
**Estimated Time:** 2-3 hours for all changes + testing
