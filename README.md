# TRIDENT Match Portal

**A platform connecting nonprofit organizations with researchers for collaborative, data-driven projects.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-18%2B-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/postgresql-15%2B-blue.svg)](https://www.postgresql.org)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Current Status](#current-status)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

TRIDENT Match Portal is a web application that bridges the gap between nonprofit organizations seeking data-driven insights and researchers looking for meaningful collaboration opportunities. The platform features:

- **Role-based authentication** (Nonprofit, Researcher, Admin)
- **Smart matching algorithms** connecting organizations with researchers
- **Project management** for tracking collaborations
- **Real-time messaging** between matched parties
- **Admin dashboard** for platform oversight

---

## 📊 Current Status

**Last Updated:** December 10, 2025  
**Version:** 0.2.0  
**Stage:** Active Development

### ✅ Completed Features

- **Authentication & Authorization**
  - User registration with role selection (nonprofit/researcher)
  - JWT-based authentication
  - Role-based access control
  - Session persistence with localStorage
  - Protected routes

- **User Interface**
  - Responsive navigation bar with hamburger menu
  - Role-specific dashboards (Nonprofit, Researcher, Admin)
  - Settings page for profile management
  - Browse projects page
  - Real-time messaging interface

- **Backend Infrastructure**
  - RESTful API with Express.js
  - PostgreSQL database with Sequelize ORM
  - Cloud database support (Neon PostgreSQL)
  - Database migrations system
  - Admin controller for platform management

### 🚧 In Progress

- Nonprofit dashboard content
- Matching algorithm refinement
- Project creation workflow
- File upload functionality

### 📝 Planned Features

- Advanced matching with weighted criteria
- Email notifications
- Calendar integration
- Analytics dashboard
- User verification system
- Mobile app

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 7.1
- **Routing:** React Router DOM 7.9
- **Styling:** Bootstrap 5.3
- **State Management:** React Context API

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4.18
- **Database:** PostgreSQL 15+ (Neon cloud)
- **ORM:** Sequelize 6.37
- **Authentication:** JWT + bcrypt
- **Session:** express-session

### DevOps & Tools
- **Version Control:** Git/GitHub
- **Package Manager:** npm
- **Testing:** Jest
- **Database Migrations:** Sequelize CLI

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (local or Neon cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CIS4327-GroupCode/TRIDENT-Match-Portal.git
   cd TRIDENT-Match-Portal
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   
   **Backend** (`backend/.env`):
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   PORT=5000
   JWT_SECRET=your-secret-key
   REFRESH_TOKEN_SECRET=your-refresh-secret
   NODE_ENV=development
   ```
   
   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run db:migrate
   ```

5. **Start development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:5000
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## ✨ Features

### Authentication & User Management
- Multi-role user registration (Nonprofit, Researcher, Admin)
- Secure JWT-based authentication
- Password hashing with bcrypt
- Session persistence across page reloads
- Role-based access control

### Dashboards
- **Nonprofit Dashboard:** Manage organization profile, post projects, view researcher matches
- **Researcher Dashboard:** Browse projects, manage expertise profile, view nonprofit matches
- **Admin Dashboard:** Platform oversight, user management, system analytics

### Project Management
- Create and publish collaboration projects
- Browse available opportunities
- Filter and search functionality
- Project status tracking

### Messaging System
- Real-time communication between matched parties
- Conversation history
- Notification system

### UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Bootstrap-based modern interface
- Accessible navigation with hamburger menu
- Clean, intuitive user flows

---

## 📚 Documentation

### Setup & Configuration
- **[Installation Guide](docs/setup/installation.md)** - Detailed setup instructions
- **[Environment Configuration](docs/setup/environment.md)** - Environment variables reference
- **[Database Setup](docs/setup/database.md)** - PostgreSQL and Neon configuration

### Architecture
- **[System Overview](docs/architecture/overview.md)** - High-level architecture
- **[Database Schema](docs/architecture/database-schema.md)** - ER diagrams and table specs
- **[Authentication Flow](docs/architecture/auth-flow.md)** - Login/signup process
- **[API Design](docs/architecture/api-design.md)** - RESTful API patterns

### API Reference
- **[Authentication Endpoints](docs/api/auth.md)** - Signup, login, logout
- **[User Endpoints](docs/api/users.md)** - Profile management
- **[Project Endpoints](docs/api/projects.md)** - CRUD operations
- **[Admin Endpoints](docs/api/admin.md)** - Platform management

### Development Guides
- **[Frontend Guide](docs/guides/frontend.md)** - React patterns and components
- **[Backend Guide](docs/guides/backend.md)** - Express and Sequelize patterns
- **[Testing Guide](docs/guides/testing.md)** - Test suite overview

### Deployment
- **[Deployment Guide](docs/setup/deployment.md)** - Production deployment steps
- **[Neon PostgreSQL Setup](docs/setup/neon.md)** - Cloud database configuration

---

## 📁 Project Structure

```
TRIDENT-Match-Portal/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database and environment config
│   │   ├── controllers/       # Route handlers
│   │   ├── database/
│   │   │   ├── migrations/    # Database migrations
│   │   │   └── models/        # Sequelize models
│   │   ├── middleware/        # Auth and validation middleware
│   │   ├── routes/            # API route definitions
│   │   └── index.js           # Server entry point
│   ├── tests/                 # Jest test suites
│   ├── package.json
│   └── README.md
├── frontend/                   # React application
│   ├── src/
│   │   ├── auth/              # Authentication context
│   │   ├── components/        # Reusable React components
│   │   │   └── ui/            # UI components (forms, modals)
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx  # Role-based dashboard router
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Browse.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Messages.jsx
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── package.json
│   └── README.md
├── docs/                       # Documentation
│   ├── setup/                 # Installation and config guides
│   ├── architecture/          # System design docs
│   ├── api/                   # API reference
│   ├── guides/                # Development guides
│   └── archive/               # Archived/historical docs
├── Documentation/              # Legacy docs (being reorganized)
├── .gitignore
├── LICENSE
├── package.json
└── README.md                   # This file
```

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:migrate   # Run pending database migrations
npm run db:seed      # Seed database with sample data
npm test             # Run test suite
```

**Frontend:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Management

```bash
# Create a new migration
npx sequelize-cli migration:generate --name description-of-change

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:undo

# Reset database (caution: data loss)
npm run db:reset
```

---

## 🧪 Testing

```bash
# Run all tests
cd backend
npm test

# Run specific test suite
npm test -- tests/unit/auth.test.js

# Run with coverage
npm run test:coverage
```

---

### Code Style
- Follow existing code patterns
- Use meaningful variable names
- Comment complex logic
- Write tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**TRIDENT Match Portal Development Team**
- CSHL Corp team members
- CIS 4327 | CIS 4328 - Senior Project I & II
- University of North Florida

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues:** [Create an issue](https://github.com/CIS4327-GroupCode/TRIDENT-Match-Portal/issues)
- **Documentation:** Check the `/docs` folder
- **Project Board:** [GitHub Projects](https://github.com/CIS4327-GroupCode/TRIDENT-Match-Portal/projects)

---

## 🎯 Roadmap

### Phase 1 (Current - December 2025)
- [x] Core authentication system
- [x] Role-based dashboards
- [ ] Complete nonprofit dashboard
- [ ] Project creation workflow
- [ ] Basic matching algorithm

### Phase 2 (January 2026)
- [ ] Advanced matching with AI
- [ ] Real-time notifications
- [ ] File upload system
- [ ] Calendar integration

### Phase 3 (February 2026)
- [ ] Analytics dashboard
- [ ] Email notification system
- [ ] User verification
- [ ] Mobile responsive optimization

### Phase 4 (March 2026)
- [ ] Production deployment
- [ ] Performance optimization
- [ ] Security audit
- [ ] User onboarding improvements

---

**Last Updated:** December 10, 2025  
**Version:** 0.2.0
   - ✅ Create project briefs (nonprofits)
   - ✅ Edit and update projects
   - ✅ Delete projects with cascade
   - ✅ Project visibility controls
   - ✅ Public project browsing
   - ✅ Project search and filtering

5. **Milestone Tracking** (100%)
   - ✅ Create milestones for projects
   - ✅ Track milestone status
   - ✅ Milestone analytics
   - ✅ Progress visualization

6. **Researcher Features** (100%)
   - ✅ Academic history management
   - ✅ Certification tracking
   - ✅ Profile customization
   - ✅ Project collaboration tracking
   - ✅ Real-time dashboard updates

7. **Admin Dashboard** (100%)
   - ✅ User management (view, suspend, delete)
   - ✅ Organization oversight
   - ✅ Project moderation
   - ✅ System analytics
   - ✅ Audit logging

8. **Testing Infrastructure** (100%)
   - ✅ Test framework setup (Jest)
   - ✅ 59 unit tests (100% passing)
   - ✅ Database test utilities
   - ✅ Mock implementations
   - ✅ API endpoint testing

### In Progress 🟡

- **UC1: Sign Up/Sign In** (50% complete)
  - Email verification
  - MFA implementation
  - SSO integration

### Planned Features ⏳

See **[IMPLEMENTATION_PROGRESS.md](./IMPLEMENTATION_PROGRESS.md)** for detailed roadmap of 13 use cases:

- UC6: Manage Account Settings
- UC7: Create Project Briefs
- UC8/9: Matching System (Researcher ↔ Nonprofit)
- UC3/11: Execute Agreements (E-signature)
- UC2: Real-time Messaging
- UC4: Milestone Management
- UC5: Post-Project Reviews
- UC10: Admin Moderation
- UC12: Admin Monitoring
- UC13: File Upload & Security

**Overall Progress**: 53.8% (7/13 use cases complete)

---

## 🗄️ Database Schema

### Tables (14)

1. **_user** - Base user accounts with authentication
2. **organizations** - Nonprofit organization profiles
3. **researcher_profiles** - Researcher professional profiles
4. **project_ideas** - Project briefs from nonprofits
5. **milestones** - Project milestone tracking
6. **agreements** - Collaboration agreements between researchers and orgs
7. **matches** - AI/manual matches between projects & researchers
8. **ratings** - Post-project reviews
9. **messages** - Real-time messaging between parties
10. **audit_logs** - Admin action logging
11. **user_preferences** - User notification and privacy settings
12. **project_reviews** - Detailed project feedback
13. **academic_history** - Researcher education records
14. **certifications** - Researcher professional certifications

**For complete schema details, see**: `backend/src/database/models/`

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
npm test
```

### Run Specific Test Suites
```bash
# Unit tests
npm run test:models

# Integration tests
npm run test:integration

# With coverage
npm run test:coverage
```

### Test Coverage
- **Models**: 100% (all 10 models)
- **Authentication**: 100%
- **Profile Creation**: 100%
- **Database Migrations**: 100%

---

## 🚀 Deployment

### Vercel (Recommended)

**Why Vercel?**
- ✅ Zero-config deployment
- ✅ Serverless functions (no server management)
- ✅ Global Edge CDN (300+ locations)
- ✅ Automatic HTTPS & SSL
- ✅ Free tier generous for MVP
- ✅ Auto-deploy on Git push

**Quick Deploy:**

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables:
   - `DATABASE_URL` (from Neon)
   - `JWT_SECRET` (generate random string)
   - `NODE_ENV=production`
4. Deploy! 🎉

**Detailed instructions**: See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes & test**
   ```bash
   npm test
   ```

3. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Push & create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `chore:` Build/tooling changes

---

## 📋 API Endpoints

### Implemented Endpoints (48+)

#### Authentication
- `POST /api/auth/register` - Create new user account with profile
- `POST /api/auth/login` - Authenticate user and get JWT token

#### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/me/password` - Change password
- `DELETE /api/users/me` - Delete account

#### Organizations
- `GET /api/organizations` - List all organizations (public)
- `GET /api/organizations/:id` - Get organization details
- `GET /api/organizations/me` - Get current org profile
- `PUT /api/organizations/me` - Update org profile

#### Researchers
- `GET /api/researchers/me` - Get researcher profile
- `PUT /api/researchers/me` - Update researcher profile
- `GET /api/researchers/me/projects` - Get researcher's collaboration projects
- `GET /api/researchers/me/academic` - List academic history
- `POST /api/researchers/me/academic` - Add academic record
- `PUT /api/researchers/me/academic/:id` - Update academic record
- `DELETE /api/researchers/me/academic/:id` - Delete academic record
- `GET /api/researchers/me/certifications` - List certifications
- `POST /api/researchers/me/certifications` - Add certification
- `PUT /api/researchers/me/certifications/:id` - Update certification
- `DELETE /api/researchers/me/certifications/:id` - Delete certification

#### Projects
- `GET /api/projects` - Browse all projects (public)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (nonprofits)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Milestones
- `GET /api/milestones/project/:projectId` - Get project milestones
- `POST /api/milestones` - Create milestone
- `PUT /api/milestones/:id` - Update milestone
- `DELETE /api/milestones/:id` - Delete milestone
- `GET /api/milestones/analytics/:projectId` - Get milestone analytics

#### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/organizations` - List all organizations
- `GET /api/admin/projects` - List all projects
- `PUT /api/admin/users/:id/suspend` - Suspend user account
- `PUT /api/admin/users/:id/activate` - Activate user account
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/organizations/:id` - Delete organization
- `DELETE /api/admin/projects/:id` - Delete project

#### Future Endpoints (Planned)
- **Matches**: Matching algorithm & invitations
- **Messages**: Real-time messaging
- **Agreements**: E-signature workflow
- **Ratings**: Post-project reviews

---

## 🔒 Security

### Implemented
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT authentication (7-day expiration)
- ✅ Input validation (client & server)
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ HTTPS-only (Vercel automatic)
- ✅ Database SSL connections (Neon)
- ✅ Transaction-based operations

### Planned
- ⏳ Rate limiting (auth endpoints)
- ⏳ Email verification
- ⏳ Multi-factor authentication (MFA)
- ⏳ Role-based access control (RBAC)
- ⏳ Audit logging (sensitive operations)
- ⏳ GDPR compliance features

---

## 📈 Performance Targets

### Vercel Deployment (Expected)

| Metric | Target | Status |
|--------|--------|--------|
| Home Page Load | < 1s | ✅ SSG |
| Time to Interactive | < 2s | ✅ Code splitting |
| API Response Time | < 200ms | ✅ Serverless |
| Lighthouse Score | 90+ | ✅ Optimized |
| Core Web Vitals | Pass | ✅ Monitored |

---

## 🛠️ Troubleshooting

### Common Issues

**Issue**: Database connection fails  
**Solution**: Verify `DATABASE_URL` in `.env` includes SSL parameters

**Issue**: Migrations fail  
**Solution**: Ensure database is accessible and run `npm run db:migrate`

**Issue**: JWT token invalid  
**Solution**: Check `JWT_SECRET` is set and matches across deployments

**Issue**: CORS errors  
**Solution**: Verify frontend proxy configuration in `vite.config.js`

For more troubleshooting, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/TRIDENT-Match-Portal/issues)
- **Documentation**: See `/docs` folder
- **Project Board**: [GitHub Projects](https://github.com/YOUR_USERNAME/TRIDENT-Match-Portal/projects)

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with React, Express, PostgreSQL, and Sequelize
- Deployed on Vercel with Neon PostgreSQL
- Inspired by the need to connect nonprofits with researchers

---

**Last Updated**: December 2, 2025  
**Version**: 0.2.0 (MVP in Progress)  
**Status**: ✅ Ready for Vercel Deployment

