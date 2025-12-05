# TRIDENT Match Portal - Frontend

**Last Updated**: December 2, 2025  
**Status**: 53.8% Implementation Complete  
**Tech Stack**: React 18.2.0, Vite 7.1.7, React Router 7.9.4, Bootstrap 5.3.2

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on port 4000

### Steps to Run Locally

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access application:**
- Frontend: `http://localhost:3000`
- Vite auto-proxies `/api` requests to `http://localhost:4000`

---

## 📁 Project Structure

```
frontend/src/
├── main.jsx                 # Application entry point
├── App.jsx                  # Root component with routing
├── styles.css               # Global styles
├── auth/
│   └── AuthContext.jsx      # Authentication context provider
├── components/
│   ├── TopBar.jsx           # Navigation header
│   ├── Footer.jsx           # Page footer
│   ├── Hero.jsx             # Landing page hero
│   ├── HowItWorks.jsx       # Feature explanation
│   ├── Metrics.jsx          # Platform statistics
│   ├── Trust.jsx            # Trust indicators
│   ├── SearchPreview.jsx    # Project search preview
│   ├── FeaturedProjects.jsx # Featured projects carousel
│   ├── Newsletter.jsx       # Newsletter signup
│   ├── ProtectedRoute.jsx   # Route protection HOC
│   ├── browse/
│   │   ├── Browse.jsx       # Public project browsing
│   │   └── ProjectCard.jsx  # Project display card
│   ├── nonprofitDash/
│   │   ├── NonprofitDashboard.jsx
│   │   ├── ProfileSection.jsx
│   │   ├── ProjectsCreated.jsx
│   │   └── Milestones.jsx
│   ├── researcherDash/
│   │   ├── ResearcherDash.jsx
│   │   ├── ProfileSection.jsx
│   │   ├── ProjectsInvolved.jsx  # Real project data integration
│   │   └── Availability.jsx
│   └── settings/
│       └── AccountSettings.jsx
└── pages/
    ├── Login.jsx            # Authentication page
    ├── Register.jsx         # Registration with role selection
    ├── AdminDashboard.jsx   # Admin control panel
    └── NotFound.jsx         # 404 page
```

## ✅ Implementation Status

### Completed Features (53.8%)

#### Authentication System ✅
- Login page with JWT token handling
- Registration with role selection (nonprofit/researcher/admin)
- Profile auto-creation on signup
- AuthContext for global authentication state
- Protected routes with role-based access
- Automatic token refresh
- Session persistence with localStorage

#### Public Pages ✅
- **Landing Page** with hero, features, metrics, and trust indicators
- **Browse Projects** - Public project discovery with:
  - Search functionality
  - Tag filtering
  - Category filters
  - Responsive project cards
  - Pagination support

#### Nonprofit Dashboard ✅
- Profile management with edit capabilities
- Project creation and management
- Milestone tracking and analytics
- Organization details editing
- Project visibility controls

#### Researcher Dashboard ✅
- Profile customization
- Academic history management (CRUD)
- Certification tracking (CRUD)
- Projects involved section with **real data integration**:
  - Current collaborations display
  - Completed projects archive
  - Organization details with tags
  - Budget and agreement information
  - Dynamic tab counts
  - Loading states and error handling
- Availability status management

#### Account Settings ✅
- Profile editing for all user roles
- Password change functionality
- Account deletion (with confirmation)
- Notification preferences
- Privacy settings
- Theme preferences

#### Admin Dashboard ✅
- System statistics overview
- User management (view, suspend, activate, delete)
- Organization oversight
- Project moderation
- Bulk actions support
- Search and filtering

### Components Implemented (15+)

#### Layout Components
- `TopBar.jsx` - Navigation with role-based menu items
- `Footer.jsx` - Site footer with links
- `ProtectedRoute.jsx` - Route protection HOC

#### Landing Page Components
- `Hero.jsx` - Hero section
- `HowItWorks.jsx` - Feature showcase
- `Metrics.jsx` - Platform statistics
- `Trust.jsx` - Trust indicators
- `SearchPreview.jsx` - Search component
- `FeaturedProjects.jsx` - Project carousel
- `Newsletter.jsx` - Newsletter signup

#### Feature Components
- `Browse.jsx` - Project browsing page
- `ProjectCard.jsx` - Reusable project display
- `ProfileSection.jsx` (Nonprofit & Researcher versions)
- `ProjectsCreated.jsx` - Nonprofit project management
- `ProjectsInvolved.jsx` - Researcher collaborations (with API integration)
- `Milestones.jsx` - Milestone tracking
- `AccountSettings.jsx` - Settings management
- `AdminDashboard.jsx` - Admin control panel

### API Integration ✅

**Authentication:**
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

**User Management:**
- GET `/api/users/me` - Get current user
- PUT `/api/users/me` - Update profile
- PUT `/api/users/me/password` - Change password
- DELETE `/api/users/me` - Delete account

**Organization:**
- GET `/api/organizations` - List organizations
- GET `/api/organizations/me` - Get org profile
- PUT `/api/organizations/me` - Update org

**Researcher:**
- GET `/api/researchers/me` - Get profile
- PUT `/api/researchers/me` - Update profile
- GET `/api/researchers/me/projects` - Get collaborations (NEW)
- Academic history CRUD endpoints
- Certifications CRUD endpoints

**Projects:**
- GET `/api/projects` - Browse projects
- GET `/api/projects/:id` - Get project details
- POST `/api/projects` - Create project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

**Milestones:**
- Full CRUD operations
- Analytics endpoint integration

**Admin:**
- User management endpoints
- Organization management
- Project moderation
- System statistics

### State Management ✅

- **AuthContext** - Global authentication state with hooks:
  - `useAuth()` - Access user, token, role
  - Login/logout functionality
  - Automatic token refresh
  - Protected route integration

### Styling ✅

- Bootstrap 5.3.2 integration
- Custom CSS in `styles.css`
- Responsive design for mobile/tablet/desktop
- Consistent color scheme and typography
- Loading states and error messages
- Form validation styling

---

## 📋 Pending Features

### High Priority
- ⏳ Real-time messaging interface
- ⏳ Matching system UI
- ⏳ Application submission flow
- ⏳ File upload components
- ⏳ Email verification flow

### Medium Priority
- ⏳ Advanced project filters
- ⏳ Saved searches
- ⏳ Notification center
- ⏳ In-app messaging
- ⏳ Agreement signing interface

### Low Priority
- ⏳ Dark mode toggle
- ⏳ Accessibility improvements (WCAG AA)
- ⏳ Progressive Web App (PWA) features
- ⏳ Offline support
- ⏳ Analytics dashboard visualizations

---

## 🎨 Recent Enhancements

### December 2, 2025
- ✅ **Researcher Projects Integration**: Updated `ProjectsInvolved.jsx` to fetch real collaboration data
  - Replaced hardcoded placeholder content
  - Integrated with `/api/researchers/me/projects` endpoint
  - Added loading states and error handling
  - Dynamic tab counts based on actual data
  - Organization details display with tags
  - Budget and agreement information
  - Status badges for current vs completed projects

---

## 🧪 Development

### Available Scripts

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Development Tips

1. **Hot Reload**: Vite provides instant hot module replacement
2. **API Proxy**: All `/api` requests automatically proxy to `http://localhost:4000`
3. **Component Testing**: Import and test components in isolation
4. **Auth Testing**: Use AuthContext in components for authentication state

### Environment Setup

Vite uses environment variables prefixed with `VITE_`:

```bash
# .env.local (optional)
VITE_API_URL=http://localhost:4000
```

---

## 📚 Additional Documentation

- **[../Documentation/ProjectStatus/IMPLEMENTATION_PROGRESS.md](../Documentation/ProjectStatus/IMPLEMENTATION_PROGRESS.md)** - Overall progress tracker
- **[../Documentation/FRONTEND_PROFILE_CREATION.md](../Documentation/FRONTEND_PROFILE_CREATION.md)** - Profile creation implementation
- **[../Documentation/PROFILE_CREATION_QUICK_START.md](../Documentation/PROFILE_CREATION_QUICK_START.md)** - User guide

---

## 🚀 Deployment

Recommended: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

See **[../Documentation/VERCEL_DEPLOYMENT_GUIDE.md](../Documentation/VERCEL_DEPLOYMENT_GUIDE.md)** for complete deployment instructions.
