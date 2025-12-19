# Vercel Deployment - Quick Implementation Checklist

**Project**: TRIDENT Match Portal  
**Target Platform**: Vercel  
**Rendering Strategy**: Hybrid (SSG + CSR)  
**Estimated Time**: 5-8 hours

---

## Pre-Deployment Checklist

### 1. Code Preparation ⏱️ 1-2 hours

- [ ] **Create API functions directory**
  ```bash
  mkdir -p api/auth api/_utils
  ```

- [ ] **Convert Express routes to Vercel Functions**
  - [ ] Create `api/auth/register.js`
  - [ ] Create `api/auth/login.js`
  - [ ] Create `api/_utils/db.js` (shared database connection)

- [ ] **Update frontend API configuration**
  - [ ] Create `frontend/src/config/api.js`
  - [ ] Update `SignUpForm.jsx` to use API helper
  - [ ] Update `LoginForm.jsx` to use API helper
  - [ ] Update `AuthContext.jsx` if needed

- [ ] **Create Vercel configuration**
  - [ ] Create `vercel.json` in project root
  - [ ] Configure routes for API endpoints
  - [ ] Configure headers and caching
  - [ ] Set build configuration

- [ ] **Optimize frontend**
  - [ ] Update `frontend/index.html` with SEO meta tags
  - [ ] Create `frontend/public/robots.txt`
  - [ ] Create `frontend/public/sitemap.xml`
  - [ ] Verify `vite.config.js` build settings

---

### 2. Environment Configuration ⏱️ 30 minutes

- [ ] **Create environment files**
  - [ ] Create `.env.example` in root with all required variables
  - [ ] Ensure `.env` is in `.gitignore`
  - [ ] Document all environment variables

- [ ] **Prepare secrets** (DO NOT COMMIT)
  - [ ] `DATABASE_URL` - Get from Neon dashboard
  - [ ] `JWT_SECRET` - Generate strong random string (min 32 chars)
  - [ ] `NODE_ENV` - Set to `production`

---

### 3. Testing Locally ⏱️ 1-2 hours

- [ ] **Install Vercel CLI**
  ```bash
  npm install -g vercel
  ```

- [ ] **Test with Vercel dev server**
  ```bash
  vercel dev
  ```

- [ ] **Verify functionality**
  - [ ] Home page loads at `http://localhost:3000`
  - [ ] User registration works (`/auth/register`)
  - [ ] User login works (`/auth/login`)
  - [ ] Dashboard accessible after login
  - [ ] React Router navigation works
  - [ ] Database connection successful
  - [ ] Profile creation works (nonprofit & researcher)

- [ ] **Check for errors**
  - [ ] No console errors in browser
  - [ ] No API errors in terminal
  - [ ] Check Vercel CLI logs for issues

---

## Deployment Checklist

### 4. Git & GitHub Setup ⏱️ 15 minutes

- [ ] **Initialize repository** (if not done)
  ```bash
  git init
  git add .
  git commit -m "feat: ready for Vercel deployment"
  ```

- [ ] **Push to GitHub**
  ```bash
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/TRIDENT-Match-Portal.git
  git push -u origin main
  ```

- [ ] **Verify files excluded**
  - [ ] `.env` not pushed ✅
  - [ ] `node_modules/` not pushed ✅
  - [ ] Build artifacts not pushed ✅

---

### 5. Vercel Setup ⏱️ 30 minutes

- [ ] **Create Vercel account**
  - [ ] Sign up at [vercel.com](https://vercel.com)
  - [ ] Connect GitHub account

- [ ] **Import project**
  - [ ] Click "New Project"
  - [ ] Select TRIDENT-Match-Portal repository
  - [ ] Framework: Vite
  - [ ] Root Directory: `frontend`

- [ ] **Configure build settings**
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

- [ ] **Add environment variables**
  In Vercel Dashboard → Settings → Environment Variables:
  
  | Variable | Value | Scope |
  |----------|-------|-------|
  | `DATABASE_URL` | Your Neon PostgreSQL URL | Production, Preview, Development |
  | `JWT_SECRET` | Your secret key | Production, Preview, Development |
  | `NODE_ENV` | `production` | Production |

- [ ] **Deploy**
  - [ ] Click "Deploy" button
  - [ ] Wait for build to complete (~2-3 minutes)
  - [ ] Note deployment URL

---

### 6. Post-Deployment Verification ⏱️ 30 minutes

- [ ] **Test production deployment**
  - [ ] Visit Vercel deployment URL
  - [ ] Home page loads correctly
  - [ ] All assets load (no 404s)
  - [ ] Images display correctly
  - [ ] Styles applied correctly

- [ ] **Test authentication flow**
  - [ ] Click "Sign Up"
  - [ ] Create nonprofit account with org profile
  - [ ] Log out
  - [ ] Create researcher account with profile
  - [ ] Log out
  - [ ] Log back in as nonprofit
  - [ ] Verify dashboard loads

- [ ] **Test API endpoints**
  ```bash
  # Registration
  curl -X POST https://your-app.vercel.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","password":"password123","role":"nonprofit"}'
  
  # Login
  curl -X POST https://your-app.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```

- [ ] **Check Vercel dashboard**
  - [ ] No errors in Function logs
  - [ ] Deployment status: Success
  - [ ] All routes returning 200/201

- [ ] **Performance check**
  - [ ] Run Lighthouse audit (target: 90+ score)
  - [ ] Check page load time (target: < 2s)
  - [ ] Test on mobile device
  - [ ] Test in different browsers (Chrome, Firefox, Safari)

---

### 7. SEO & Analytics ⏱️ 30 minutes

- [ ] **Verify SEO basics**
  - [ ] Meta tags present in HTML
  - [ ] Open Graph tags for social sharing
  - [ ] `robots.txt` accessible
  - [ ] `sitemap.xml` accessible
  - [ ] Favicon displays

- [ ] **Test social sharing**
  - [ ] Paste URL in Facebook debugger
  - [ ] Paste URL in Twitter card validator
  - [ ] Verify preview looks correct

- [ ] **Set up analytics** (Optional)
  - [ ] Install Vercel Analytics
    ```bash
    cd frontend
    npm install @vercel/analytics
    ```
  - [ ] Add to `main.jsx`:
    ```javascript
    import { Analytics } from '@vercel/analytics/react';
    // Add <Analytics /> component
    ```
  - [ ] Redeploy

---

### 8. Domain Configuration ⏱️ 30 minutes (Optional)

- [ ] **Add custom domain**
  - [ ] Vercel Dashboard → Settings → Domains
  - [ ] Add your domain (e.g., `tridentmatch.com`)
  - [ ] Update DNS records as instructed
  - [ ] Wait for DNS propagation (5-60 minutes)
  - [ ] Verify SSL certificate auto-provisioned

- [ ] **Update environment variables**
  - [ ] Update CORS settings if needed
  - [ ] Update any hardcoded URLs

---

## Monitoring & Maintenance

### 9. Set Up Monitoring ⏱️ 30 minutes

- [ ] **Error tracking with Sentry** (Recommended)
  ```bash
  npm install @sentry/react @sentry/tracing
  ```
  - [ ] Create Sentry account
  - [ ] Add Sentry DSN to environment variables
  - [ ] Initialize Sentry in `main.jsx`

- [ ] **Set up alerts**
  - [ ] Vercel deployment failed alerts (email)
  - [ ] Function error alerts
  - [ ] Uptime monitoring (UptimeRobot or similar)

- [ ] **Monitor logs**
  - [ ] Check Vercel Function logs daily
  - [ ] Set up log aggregation (optional: Logtail)

---

### 10. Documentation & Handoff ⏱️ 30 minutes

- [ ] **Update README**
  - [ ] Add deployment section
  - [ ] Document environment variables
  - [ ] Add troubleshooting guide
  - [ ] Update architecture diagram

- [ ] **Create runbook**
  - [ ] How to deploy updates
  - [ ] How to rollback
  - [ ] Common issues and solutions
  - [ ] Emergency contacts

- [ ] **Team training**
  - [ ] Share Vercel dashboard access
  - [ ] Walkthrough deployment process
  - [ ] Review monitoring tools

---

## Rollback Plan

If issues occur:

1. **Immediate rollback**
   - Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"
   - Takes effect in < 1 minute

2. **Debug issues**
   - Check Function logs for errors
   - Verify environment variables
   - Test locally with `vercel dev`
   - Check database connectivity

3. **Redeploy**
   - Fix issues in code
   - Commit and push to GitHub
   - Vercel auto-deploys new version
   - Verify fix works

---

## Success Criteria

✅ **Deployment is successful when:**

1. Home page loads in < 2 seconds
2. User registration and login work
3. Profile creation works for both roles
4. Dashboard loads correctly after login
5. React Router navigation works
6. All API endpoints respond correctly
7. No errors in Vercel Function logs
8. Lighthouse score > 90
9. Mobile responsive
10. HTTPS enabled with valid certificate

---

## Quick Command Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Test locally
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Check domains
vercel domains ls

# Check environment variables
vercel env ls
```

---

## Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| API 404 errors | Check `vercel.json` routes configuration |
| Database connection fails | Verify `DATABASE_URL` in environment variables |
| React Router 404 on refresh | Ensure catch-all route in `vercel.json` |
| Environment variables not working | Redeploy after adding variables |
| Slow cold starts | Check database connection pooling settings |
| CORS errors | Update API functions with CORS headers |

---

## Next Steps After Deployment

1. **Monitor for 24 hours**
   - Watch error logs
   - Check performance metrics
   - Gather user feedback

2. **Optimize based on data**
   - Analyze Lighthouse reports
   - Review Vercel Analytics
   - Optimize slow queries

3. **Plan next features**
   - Refer to `IMPLEMENTATION_PROGRESS.md`
   - Continue with UC6 (Account Settings)
   - Implement remaining use cases

---

**Document Version**: 1.0  
**Last Updated**: November 25, 2025  
**Estimated Total Time**: 5-8 hours  
**Difficulty**: Moderate  
**Status**: Ready to Execute
