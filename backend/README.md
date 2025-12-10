# TRIDENT Match Portal - Backend

**Last Updated**: December 2, 2025  
**Status**: 53.8% Implementation Complete  
**Tech Stack**: Node.js 18+, Express 4.18.2, Sequelize 6.37.7, PostgreSQL

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Neon cloud database)
- npm or yarn

### Steps to Run Locally

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
```

3. **Run database migrations:**
```bash
npm run db:migrate
```

4. **Seed database (optional):**
```bash
node seed-database.js
```

5. **Start development server:**
```bash
npm run dev
```

Server runs on `http://localhost:4000`

---

## 🔧 Environment Variables

Required variables in `.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your-secret-key-here

# Server
PORT=4000
NODE_ENV=development
```

## ✅ Implementation Status

### Completed Features (53.8%)

#### Authentication & Authorization ✅
- JWT-based authentication with 7-day token expiration
- Password hashing with bcrypt (10 rounds)
- Role-based access control (nonprofit, researcher, admin)
- Profile auto-creation on signup
- Account status validation (active, pending, suspended)

#### API Endpoints Implemented (48+)

**Authentication Routes** (`/api/auth`)
- ✅ POST `/register` - User registration with profile creation
- ✅ POST `/login` - User authentication

**User Routes** (`/api/users`)
- ✅ GET `/me` - Get current user profile
- ✅ PUT `/me` - Update user profile
- ✅ PUT `/me/password` - Change password
- ✅ DELETE `/me` - Delete account (soft delete)

**Organization Routes** (`/api/organizations`)
- ✅ GET `/` - List all organizations (public)
- ✅ GET `/:id` - Get organization details
- ✅ GET `/me` - Get current org profile
- ✅ PUT `/me` - Update org profile

**Researcher Routes** (`/api/researchers`)
- ✅ GET `/me` - Get researcher profile
- ✅ PUT `/me` - Update researcher profile
- ✅ GET `/me/projects` - Get collaboration projects
- ✅ GET `/me/academic` - List academic history
- ✅ POST `/me/academic` - Add academic record
- ✅ PUT `/me/academic/:id` - Update academic record
- ✅ DELETE `/me/academic/:id` - Delete academic record
- ✅ GET `/me/certifications` - List certifications
- ✅ POST `/me/certifications` - Add certification
- ✅ PUT `/me/certifications/:id` - Update certification
- ✅ DELETE `/me/certifications/:id` - Delete certification

**Project Routes** (`/api/projects`)
- ✅ GET `/` - Browse projects (public)
- ✅ GET `/:id` - Get project details
- ✅ POST `/` - Create project (nonprofits only)
- ✅ PUT `/:id` - Update project
- ✅ DELETE `/:id` - Delete project

**Milestone Routes** (`/api/milestones`)
- ✅ GET `/project/:projectId` - Get project milestones
- ✅ POST `/` - Create milestone
- ✅ PUT `/:id` - Update milestone
- ✅ DELETE `/:id` - Delete milestone
- ✅ GET `/analytics/:projectId` - Get analytics

**Admin Routes** (`/api/admin`)
- ✅ GET `/stats` - System statistics
- ✅ GET `/users` - List all users
- ✅ GET `/organizations` - List all organizations
- ✅ GET `/projects` - List all projects
- ✅ PUT `/users/:id/suspend` - Suspend user
- ✅ PUT `/users/:id/activate` - Activate user
- ✅ DELETE `/users/:id` - Delete user
- ✅ DELETE `/organizations/:id` - Delete organization
- ✅ DELETE `/projects/:id` - Delete project

### Database Architecture ✅

**14 Tables Migrated:**
1. `_user` - User accounts with authentication
2. `organizations` - Nonprofit profiles
3. `researcher_profiles` - Researcher profiles
4. `project_ideas` - Project briefs
5. `milestones` - Project milestones
6. `agreements` - Collaboration agreements
7. `matches` - Project-researcher matches
8. `ratings` - Post-project reviews
9. `messages` - Messaging system
10. `audit_logs` - Admin action logging
11. `user_preferences` - User settings
12. `project_reviews` - Project feedback
13. `academic_history` - Researcher education
14. `certifications` - Researcher certifications

**18 Model Associations:**
- User ↔ ResearcherProfile (one-to-one)
- User ↔ UserPreferences (one-to-one)
- User → Organization (one-to-many)
- Organization → Project (one-to-many)
- Project → Milestone (one-to-many)
- ResearcherProfile → Application (one-to-many)
- Application → Organization (many-to-one)
- Plus 11 more associations

### Testing Infrastructure ✅

- **59 unit tests** with 100% pass rate
- Jest test framework configured
- Mock implementations for models and middleware
- Database-independent testing
- Coverage reporting enabled

### Security Features ✅

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control middleware
- Input validation
- SQL injection prevention (Sequelize ORM)
- Account status validation
- Audit logging for admin actions

---

## 📋 Pending Features

### High Priority
- ⏳ Email verification system
- ⏳ Password reset flow
- ⏳ Real-time messaging (Socket.io)
- ⏳ Matching algorithm implementation
- ⏳ File upload for documents

### Medium Priority
- ⏳ Rate limiting for API endpoints
- ⏳ Multi-factor authentication (MFA)
- ⏳ Advanced search and filtering
- ⏳ Notification system
- ⏳ Analytics dashboard

### Low Priority
- ⏳ SSO integration (OAuth)
- ⏳ API versioning
- ⏳ GraphQL endpoint
- ⏳ Webhooks for integrations

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- authController.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

### Test Files
- `tests/unit/authController.test.js` - Authentication tests
- `tests/unit/userController.test.js` - User management tests
- `tests/unit/auth.middleware.test.js` - Middleware tests

See `tests/README.md` for detailed testing documentation.

---

## 📚 Additional Documentation

- **[../Documentation/ProjectStatus/IMPLEMENTATION_PROGRESS.md](../Documentation/ProjectStatus/IMPLEMENTATION_PROGRESS.md)** - Detailed progress tracker
- **[../Documentation/ProjectStatus/DATABASE_UML_SPECIFICATION.md](../Documentation/ProjectStatus/DATABASE_UML_SPECIFICATION.md)** - Complete database schema
- **[../Documentation/UC3_API_DOCUMENTATION.md](../Documentation/UC3_API_DOCUMENTATION.md)** - Project browsing API
- **[../Documentation/UC4_API_DOCUMENTATION.md](../Documentation/UC4_API_DOCUMENTATION.md)** - Milestone API
- **[../Documentation/UC6_API_DOCUMENTATION.md](../Documentation/UC6_API_DOCUMENTATION.md)** - Account settings API
- **[../Documentation/UC7_API_DOCUMENTATION.md](../Documentation/UC7_API_DOCUMENTATION.md)** - Project creation API

---

## 🔧 Utility Scripts

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed database with test data
node seed-database.js

# Check migration status
node check-migration.js

# Clear all data (development only)
node clear-data.js
```

### Development Tools
```bash
# Start with nodemon (auto-reload)
npm run dev

# Start production server
npm start

# Run linting
npm run lint
```

---

## 🚀 Deployment

Recommended: Deploy to Vercel with Neon PostgreSQL

See **[../Documentation/VERCEL_DEPLOYMENT_GUIDE.md](../Documentation/VERCEL_DEPLOYMENT_GUIDE.md)** for complete deployment instructions.
