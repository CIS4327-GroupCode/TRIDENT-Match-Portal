# Server-Side Rendering & Single Server Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Recommended Approach](#recommended-approach)
4. [Implementation Strategy](#implementation-strategy)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Production Deployment](#production-deployment)
7. [Alternative Approaches](#alternative-approaches)

---

## Overview

This guide provides a comprehensive strategy to **eliminate the dual-server setup** (Vite dev server + Express backend) and implement a **single-server architecture** that serves both the React frontend and API endpoints from one Express application.

### Current Problem
- **Development**: Two servers running (Vite on port 3000, Express on port 4000)
- **Complexity**: Proxy configuration needed for API calls
- **Deployment**: More complex deployment with separate processes
- **Resources**: Higher resource usage in production

### Goal
- **Single Express server** serves both static React build and API routes
- **Simplified deployment** with one process
- **Better performance** with proper caching and compression
- **Optional SSR** for improved SEO and initial load time

---

## Current Architecture Analysis

### Frontend (Vite + React)
```
Location: frontend/
Build Tool: Vite
Framework: React 18.2.0
Routing: React Router DOM v7.9.4
Dev Server: Port 3000
Proxy: /api → http://localhost:4000
```

**Current Setup:**
- Client-side rendering (CSR) only
- Vite dev server with HMR in development
- Proxy passes API requests to backend
- No server-side rendering

### Backend (Express + Node.js)
```
Location: backend/
Framework: Express 4.18.2
Database: PostgreSQL via pg
Port: 4000
Routes: /auth/register, /auth/login
```

**Current Setup:**
- REST API only
- No static file serving
- No view engine configured
- CORS enabled for cross-origin requests

---

## Recommended Approach

### Option 1: Static Build Serving (Recommended for Most Cases)
**Best for:** Standard SPA applications without critical SEO needs

✅ **Pros:**
- Simplest implementation
- Minimal code changes
- Fast development workflow
- Good for authenticated dashboards

❌ **Cons:**
- No SEO benefits for public pages
- Slower initial page load
- Client-side only rendering

### Option 2: Server-Side Rendering with React (Advanced)
**Best for:** Public-facing pages requiring SEO

✅ **Pros:**
- Better SEO for public pages
- Faster initial page load
- Social media preview support
- Improved perceived performance

❌ **Cons:**
- More complex implementation
- Requires careful state management
- Higher server load
- Longer build times

### Option 3: Hybrid Approach (Recommended for This Project)
**Best for:** Apps with both public (marketing) and authenticated (dashboard) sections

✅ **Pros:**
- SSR for public pages (Home, Project listings)
- CSR for authenticated dashboards
- Optimal performance/complexity balance
- SEO where it matters

---

## Implementation Strategy

We'll implement **Option 1** (Static Build Serving) first, then provide guidance for adding SSR to specific routes if needed.

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Express Server (Port 4000)      │
├─────────────────────────────────────────┤
│                                         │
│  API Routes                             │
│  ├─ /auth/*        (Authentication)     │
│  ├─ /api/users/*   (User management)    │
│  ├─ /api/orgs/*    (Organizations)      │
│  └─ /api/projects/* (Projects)          │
│                                         │
│  Static Files                           │
│  ├─ /assets/*      (JS, CSS, Images)    │
│  └─ /*             (React SPA - fallback)│
│                                         │
└─────────────────────────────────────────┘
```

### Request Flow

1. **API Requests** (`/auth/*`, `/api/*`) → Backend Controllers
2. **Static Assets** (`/assets/*`) → Served from `public/` with caching
3. **All Other Routes** (`/`, `/dashboard/*`) → Serve `index.html` (React handles routing)

---

## Step-by-Step Implementation

### Step 1: Update Frontend Build Configuration

#### Update `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    outDir: '../backend/public',  // Build directly to backend
    emptyOutDir: true,
    sourcemap: false,  // Disable in production for smaller builds
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'bootstrap': ['bootstrap']
        }
      }
    }
  },
  
  // Dev server configuration (still useful for frontend-only development)
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

#### Update `frontend/package.json` Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:watch": "vite build --watch",
    "preview": "vite preview",
    "clean": "rm -rf ../backend/public"
  }
}
```

---

### Step 2: Configure Express to Serve Static Files

#### Update `backend/src/index.js`
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// API ROUTES (must come BEFORE static files)
// ============================================
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Future API routes
// const userRoutes = require('./routes/userRoutes');
// const orgRoutes = require('./routes/orgRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// app.use('/api/users', userRoutes);
// app.use('/api/orgs', orgRoutes);
// app.use('/api/projects', projectRoutes);

// ============================================
// STATIC FILE SERVING
// ============================================

// Serve static files from the React app
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath, {
  maxAge: '1y',  // Cache static assets for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Don't cache HTML files
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// ============================================
// SPA FALLBACK (must be LAST)
// ============================================
// Handle React Router - send all non-API requests to index.html
app.get('*', (req, res) => {
  // Don't serve index.html for API routes that don't exist
  if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${publicPath}`);
  console.log(`🔗 API routes available at: /auth/*, /api/*`);
});
```

---

### Step 3: Update API Base URLs in Frontend

#### Create `frontend/src/config/api.js`
```javascript
// API configuration
const getApiBaseUrl = () => {
  // In production, API is served from same origin
  // In development, you can still use Vite proxy or point directly to backend
  if (import.meta.env.MODE === 'production') {
    return '';  // Same origin
  }
  // Development: use proxy (configured in vite.config.js)
  return '';  // Proxy handles it
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('trident_token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
};

export default { API_BASE_URL, apiCall };
```

#### Update Components to Use API Helper

**Example: Update Login/Register Components**
```javascript
// In LoginForm.jsx or SignUpForm.jsx
import { apiCall } from '../../config/api';

// Instead of:
// const response = await fetch('/api/auth/login', {...});

// Use:
const data = await apiCall('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

---

### Step 4: Create Build and Start Scripts

#### Update `backend/package.json`
```json
{
  "name": "trident-backend",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "dev:frontend": "cd ../frontend && npm run dev",
    "build": "cd ../frontend && npm run build",
    "clean": "rm -rf public/*",
    "prebuild": "npm run clean",
    "serve": "npm run build && npm start"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0",
    "compression": "^1.7.4",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

#### Install Production Middleware
```bash
cd backend
npm install compression helmet
```

---

### Step 5: Add Production Optimizations

#### Update `backend/src/index.js` with Production Middleware
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// ============================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ============================================
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// CORS (adjust for production)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGIN || false
    : true,
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ... rest of the code (API routes, static files, etc.)
```

---

### Step 6: Environment Configuration

#### Create `backend/.env.example`
```env
# Server
NODE_ENV=development
PORT=4000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trident_dev

# JWT
JWT_SECRET=your-secret-key-change-in-production

# CORS (production only)
ALLOWED_ORIGIN=https://yourdomain.com

# Session (if using sessions)
SESSION_SECRET=another-secret-key
```

#### Update `.gitignore`
```gitignore
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local
.env.production

# Build output
backend/public/
dist/

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

---

### Step 7: Create Development Workflow Scripts

#### Create `package.json` in Project Root
```json
{
  "name": "trident-match-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev": "npm run dev:backend & npm run dev:frontend",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start",
    "build:start": "npm run build && npm start",
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "clean": "cd backend && rm -rf public && cd ../frontend && rm -rf dist"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

#### Install Concurrently for Parallel Development
```bash
npm install
npm install -D concurrently
```

#### Update Root `package.json` with Concurrently
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev"
  }
}
```

---

## Production Deployment

### Build Process

```bash
# 1. Install all dependencies
npm run install:all

# 2. Build frontend (outputs to backend/public/)
cd frontend
npm run build

# 3. Start production server
cd ../backend
NODE_ENV=production npm start
```

### Docker Configuration

#### Update `Dockerfile` (create in root)
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
COPY --from=frontend-build /app/backend/public ./public

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "src/index.js"]
```

#### Update `docker-compose.yml`
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: trident_dev
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - trident-network

  app:
    build: .
    restart: always
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://postgres:postgres@db:5432/trident_dev
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - db
    networks:
      - trident-network

volumes:
  db-data:

networks:
  trident-network:
    driver: bridge
```

### Cloud Deployment (Platform-Specific)

#### Heroku
```bash
# Procfile
web: cd backend && npm start

# Build command (Heroku settings)
cd frontend && npm install && npm run build && cd ../backend && npm install
```

#### Railway / Render
```yaml
# Build Command
cd frontend && npm install && npm run build && cd ../backend && npm install

# Start Command
cd backend && npm start
```

#### Vercel (API Routes + Static)
Not recommended for this architecture. Vercel is better for Next.js or serverless.

---

## Alternative Approaches

### Approach A: Add Server-Side Rendering (SSR)

For SEO-critical pages like the home page and project listings, you can add SSR.

#### Install Required Dependencies
```bash
cd backend
npm install react react-dom react-router-dom
npm install -D @babel/core @babel/preset-react @babel/preset-env
```

#### Create SSR Entry Point

**`backend/src/ssr/render.js`**
```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../../frontend/src/App';

export function renderApp(url, context = {}) {
  const html = renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
  
  return html;
}

export function renderFullPage(html, initialState = {}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TRIDENT Match Portal</title>
        <link rel="stylesheet" href="/assets/index.css">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
        </script>
        <script src="/assets/index.js"></script>
      </body>
    </html>
  `;
}
```

#### Update Express to Use SSR for Specific Routes
```javascript
// In backend/src/index.js
const { renderApp, renderFullPage } = require('./ssr/render');

// SSR for public pages
app.get(['/', '/projects', '/projects/:id'], (req, res) => {
  const context = {};
  const html = renderApp(req.url, context);
  
  if (context.url) {
    // Handle redirects
    return res.redirect(301, context.url);
  }
  
  res.send(renderFullPage(html));
});

// CSR fallback for authenticated pages
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
```

---

### Approach B: Use Next.js (Complete Rewrite)

For maximum SEO and SSR capabilities, consider migrating to Next.js.

**Pros:**
- Built-in SSR and static generation
- API routes in same codebase
- Automatic code splitting
- Image optimization
- Excellent developer experience

**Cons:**
- Requires complete frontend rewrite
- Different routing system
- Learning curve for team

**Migration Path:**
1. Create new Next.js app
2. Move React components to `pages/` or `app/` directory
3. Convert backend routes to Next.js API routes
4. Update database connections
5. Deploy to Vercel or other platforms

---

## Development Workflow

### Development (Dual Server - Better DX)
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend with HMR
cd frontend
npm run dev

# Or use concurrently from root
npm run dev
```

### Production-like Testing (Single Server)
```bash
# Build frontend and serve from backend
cd backend
npm run serve

# Visit http://localhost:4000
```

### Production
```bash
# Build
npm run build

# Start
NODE_ENV=production npm start
```

---

## Performance Optimizations

### 1. Static Asset Caching
```javascript
// In backend/src/index.js
app.use(express.static(publicPath, {
  maxAge: '1y',  // Cache for 1 year
  immutable: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
```

### 2. Compression
Already included with `compression` middleware.

### 3. Code Splitting
Already handled by Vite with `manualChunks`.

### 4. CDN for Static Assets
```javascript
// In vite.config.js
export default defineConfig({
  build: {
    // Use CDN for production
    base: process.env.CDN_URL || '/'
  }
});
```

### 5. Service Worker for Offline Support
```bash
cd frontend
npm install vite-plugin-pwa -D
```

```javascript
// In vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TRIDENT Match Portal',
        short_name: 'TRIDENT',
        description: 'Connect nonprofits with researchers',
        theme_color: '#ffffff'
      }
    })
  ]
});
```

---

## Testing Strategy

### Development Testing
```bash
# Test frontend separately
cd frontend
npm run dev
# Visit http://localhost:3000

# Test backend API
cd backend
npm run dev
# Use Postman or curl for API testing
```

### Production Testing
```bash
# Build and test
npm run build
cd backend
NODE_ENV=production npm start

# Verify:
# - Static files load correctly
# - API routes work
# - React Router works for all routes
# - 404s handled properly
```

---

## Troubleshooting

### Issue: 404 for React Routes
**Solution:** Ensure the catch-all route is LAST in Express:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
```

### Issue: API Routes Returning HTML
**Solution:** API routes must be defined BEFORE static file middleware:
```javascript
// ✅ Correct order
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use(express.static(publicPath));
app.get('*', ...);
```

### Issue: Static Assets Not Loading
**Solution:** Check build output directory:
```javascript
// vite.config.js
build: {
  outDir: '../backend/public',
  emptyOutDir: true
}
```

### Issue: CORS Errors
**Solution:** Remove or configure CORS properly for same-origin:
```javascript
// In production, same origin = no CORS needed
if (process.env.NODE_ENV === 'production') {
  // Don't use CORS or use restrictive settings
} else {
  app.use(cors());
}
```

---

## Migration Checklist

- [ ] Update `vite.config.js` to build to `backend/public/`
- [ ] Update `backend/src/index.js` to serve static files
- [ ] Add compression and helmet middleware
- [ ] Create API helper for consistent API calls
- [ ] Update environment variables
- [ ] Test build process
- [ ] Test all routes (API and React Router)
- [ ] Update Docker configuration
- [ ] Update deployment scripts
- [ ] Test production build locally
- [ ] Deploy to staging environment
- [ ] Verify performance and caching
- [ ] Update documentation
- [ ] Train team on new workflow

---

## Summary

### What You Gain
✅ **Single server** in production (simplified deployment)  
✅ **Better performance** with proper caching  
✅ **Lower resource usage** (one process instead of two)  
✅ **Simpler architecture** (easier to understand and maintain)  
✅ **Optional SSR** for SEO when needed  

### What You Keep
✅ **Great DX in development** (can still use Vite dev server)  
✅ **Hot module replacement** (HMR) while developing  
✅ **Same React code** (no framework changes)  
✅ **Flexible deployment** (Docker, cloud platforms, VPS)  

### Development Workflow
```bash
# Development: Use dual-server for best DX
npm run dev

# Production: Build and serve from single server
npm run build:start
```

---

**Last Updated:** November 25, 2025  
**Project:** TRIDENT-Match-Portal  
**Author:** Development Team
