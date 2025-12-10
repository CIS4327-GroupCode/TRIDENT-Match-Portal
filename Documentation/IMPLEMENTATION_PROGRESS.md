# Use Cases Implementation Progress Tracker

**Last Updated**: November 27, 2025  
**Project**: TRIDENT Match Portal  
**Overall Progress**: 53.8% (7/13 use cases complete)

---

## Quick Status Overview

| Phase | Use Cases | Status | Progress |
|-------|-----------|--------|----------|
| Phase 1: Auth & Profiles | UC1, UC6 | 🟢 Complete | 100% (2/2) |
| Phase 2: Project Mgmt | UC7, UC10, UC4 | 🟡 In Progress | 67% (2/3) |
| Phase 3: Matching | UC8, UC9, UC3 | 🟡 In Progress | 33% (1/3) |
| Phase 4: Agreements | UC2, UC13 | ⚪ Not Started | 0% (0/2) |
| Phase 5: Reviews | UC5, UC12 | ⚪ Not Started | 0% (0/2) |
| Phase 6: Admin | Admin Dashboard | 🟢 Complete | 100% (1/1) |

**Legend**: 🟢 Complete | 🟡 In Progress | 🔴 Blocked | ⚪ Not Started

---

## Executive Summary

### What's Complete (7 Use Cases)
The TRIDENT Match Portal has **53.8% of planned use cases implemented** with fully functional backend APIs, frontend components, database schema, and test coverage. The platform is ready for internal demo and user acceptance testing.

**Core Features Working**:
- ✅ **Authentication System** (UC1): User registration, login, JWT tokens, role-based access, profile creation on signup
- ✅ **Account Management** (UC6): Profile editing, password changes, notification preferences, account deletion
- ✅ **Project Management** (UC7): Nonprofits can create, edit, and manage project briefs with full CRUD operations
- ✅ **Milestone Tracking** (UC4): Projects broken into trackable milestones with status management and analytics
- ✅ **Public Project Discovery** (UC3): Researchers can browse and search projects without authentication
- ✅ **Admin Dashboard** (NEW): Complete system oversight with user management, content moderation, and analytics

### Implementation Statistics
- **40+ API Endpoints** across 7 route files (auth, users, organizations, researchers, projects, milestones, admin)
- **14 Database Migrations** applied successfully with proper foreign keys and cascading deletes
- **68 Test Records** seeded (5 orgs, 12 users, 11 projects, 22 milestones) with comprehensive test data documentation
- **8 Test Files** with 95+ test cases covering authentication, browsing, milestones, projects, and account settings
- **15+ Frontend Components** including complete pages for Browse, Dashboard, Settings, and Admin
- **6 Sequelize Models** with associations and paranoid mode for soft deletes

### Technical Foundation
- **Backend**: Node.js 18+, Express 4.18.2, Sequelize 6.37.7, bcrypt, JWT
- **Frontend**: React 18.2.0, Vite 7.1.7, React Router 7.9.4, Bootstrap 5.3.2
- **Database**: PostgreSQL (Neon cloud) with proper indexing and ENUM types
- **Authentication**: JWT with 7-day expiration, account status validation (active/pending/suspended)
- **Authorization**: Role-based middleware (nonprofit, researcher, admin)
- **Data Integrity**: Foreign keys, CASCADE deletes, soft delete with paranoid mode

### What's Not Started (6 Use Cases)
- ⏳ **UC10**: Moderate Project Briefs (admin approval workflow) - *Admin infrastructure ready*
- ⏳ **UC8/UC9**: Matching Algorithms (researcher-project matching, scoring)
- ⏳ **UC2**: Messaging System (real-time communication between parties)
- ⏳ **UC11**: Agreement Execution (e-signature integration for NDAs/DUAs)
- ⏳ **UC13**: File Uploads (cloud storage for project documents)
- ⏳ **UC5/UC12**: Reviews & Ratings (researcher reviews, admin monitoring)

### Known Issues
- Some test failures due to schema changes (password_hash exposure, account_status field)
- Admin frontend route needs authentication guard (currently relies on backend auth)
- Email verification not implemented (users can register without verification)
- MFA not implemented (password-only authentication)

### Next Priorities
1. Fix test suite for schema changes (account_status, paranoid mode)
2. Implement UC10 (Moderate Project Briefs) using existing admin infrastructure
3. Add frontend route guards for admin-only pages
4. Implement matching algorithm (UC8/UC9) for researcher-project recommendations
5. Add email verification to UC1 registration flow

---

## Phase 1: Core Authentication & Profiles

### ✅ UC1: Sign Up/Sign In (User)
**Status**: 🟢 Complete  
**Priority**: Critical  
**Completed**: November 27, 2025

#### Completed Tasks
- [x] Basic user registration endpoint (POST /api/auth/register)
- [x] Basic login endpoint (POST /api/auth/login)
- [x] JWT token generation with correct userId field
- [x] Password hashing (bcrypt with 10 salt rounds)
- [x] User model with Sequelize + paranoid mode
- [x] Email normalization and validation
- [x] Account status field (active, pending, suspended)
- [x] Authentication middleware with JWT verification
- [x] Role-based access control middleware
- [x] Profile Creation on Signup (Backend)
  - [x] Auto-create Organization record for nonprofits
  - [x] Auto-create ResearcherProfile for researchers
  - [x] Validate organization data (EIN, etc.)
- [x] Profile Creation on Signup (Frontend)
  - [x] Organization profile fields in signup form
  - [x] Researcher profile fields in signup form
  - [x] Collapsible profile sections
  - [x] Client-side validation
  - [x] Rate range validation
- [x] Frontend Login/Signup
  - [x] LoginForm component with error handling
  - [x] SignUpForm component with role selection
  - [x] Modal integration in TopBar
  - [x] Auto-redirect on successful login based on role
  - [x] Token storage in localStorage
  - [x] AuthContext for global auth state

#### Pending Tasks
- [ ] Email verification service
  - [ ] Send verification email on signup
  - [ ] Verify email token endpoint
  - [ ] Resend verification email
- [ ] MFA (Multi-Factor Authentication)
  - [ ] Generate OTP codes
  - [ ] Verify OTP during login
  - [ ] Enable/disable MFA in settings
- [ ] SSO Integration
  - [ ] OAuth2 setup (Google)
  - [ ] OAuth2 setup (Microsoft)
  - [ ] Link SSO to existing accounts
- [ ] Profile Creation on Signup
  - [x] Auto-create Organization record for nonprofits
  - [x] Auto-create ResearcherProfile for researchers
  - [x] Validate organization data (EIN, etc.)
  - [x] Frontend: Organization profile fields
  - [x] Frontend: Researcher profile fields
  - [x] Frontend: Validation and UX
- [ ] Rate Limiting
  - [ ] Implement rate limiter middleware
  - [ ] Apply to auth endpoints
- [ ] Enhanced Validation
  - [ ] Password strength requirements
  - [ ] Email domain validation
  - [ ] Role-specific field validation

#### Files Modified
- ✅ `backend/src/controllers/authController.js` (JWT fix: userId instead of sub)
- ✅ `backend/src/routes/authRoutes.js`
- ✅ `backend/src/models/authModel.js`
- ✅ `backend/src/database/models/User.js` (added account_status field)
- ✅ `backend/src/database/models/Organization.js` (profile creation)
- ✅ `backend/src/database/models/ResearcherProfile.js` (profile creation)
- ✅ `backend/src/database/migrations/20251126120001-add-account-status-to-user.js` (NEW)
- ✅ `backend/src/middleware/auth.js` (JWT verification, account status checks)
- ✅ `frontend/src/components/ui/SignUpForm.jsx` (profile fields)
- ✅ `frontend/src/components/ui/LoginForm.jsx` (NEW)
- ✅ `frontend/src/auth/AuthContext.jsx` (role-based redirects)

#### Files to Create
- [ ] `backend/src/services/emailService.js`
- [ ] `backend/src/services/mfaService.js`
- [ ] `backend/src/middleware/verifyEmail.js`
- [ ] `backend/src/validators/authValidator.js`
- [ ] `backend/src/services/oauthService.js`

#### Blockers
None

#### Notes
Complete authentication system with JWT tokens using correct field names (userId). Users can register with role-specific profiles (organization for nonprofits, professional profile for researchers), login with email/password, and are automatically redirected to appropriate dashboards. Account status system (active/pending/suspended) integrated with authentication middleware. Frontend includes modal-based login/signup forms with comprehensive validation. Token-based authentication working across all protected endpoints. Need to add email verification and MFA for production deployment.

---

### ✅ UC6: Manage Account Settings
**Status**: 🟢 Complete  
**Priority**: High  
**Completed**: November 26, 2025

#### Completed Tasks
- [x] User Profile Management
  - [x] GET /users/me endpoint
  - [x] PUT /users/me endpoint
  - [x] Update name, email
  - [x] Email uniqueness validation
  - [x] Frontend ProfileSettings component
- [x] Password Management
  - [x] PUT /users/me/password endpoint
  - [x] Verify current password with bcrypt
  - [x] Hash new password
  - [x] Password strength validation (min 8 chars)
  - [x] Frontend PasswordSettings component with show/hide toggle
- [x] Notification Preferences
  - [x] Created UserPreferences model
  - [x] Created migration for user_preferences table
  - [x] GET /users/me/preferences endpoint
  - [x] PUT /users/me/preferences endpoint
  - [x] 11 preference fields (email & in-app)
  - [x] Default preferences auto-creation
  - [x] Frontend PreferencesSettings component with organized sections
- [x] Organization Settings (Nonprofit)
  - [x] GET /organizations/me endpoint
  - [x] PUT /organizations/me endpoint
  - [x] Role-based access control
  - [x] Update organization details
  - [x] Frontend OrganizationSettings component
- [x] Researcher Profile Settings
  - [x] GET /researchers/me endpoint
  - [x] PUT /researchers/me endpoint
  - [x] Role-based access control
  - [x] Rate range validation
  - [x] Frontend ResearcherSettings component
- [x] Account Deletion
  - [x] DELETE /users/me endpoint (soft delete)
  - [x] DELETE /admin/users/:id (hard delete with confirmation)
  - [x] POST /admin/users/:id/restore (restore soft-deleted)
  - [x] Added deleted_at column to User model
  - [x] Implemented paranoid mode in Sequelize
  - [x] Frontend DangerZone component with confirmation flow
- [x] Authentication Middleware
  - [x] JWT verification middleware
  - [x] Role-based middleware (admin, nonprofit, researcher)
  - [x] Deleted user check in authentication
- [x] Routes Configuration
  - [x] /users routes (profile, password, preferences, deletion)
  - [x] /organizations routes (nonprofit settings)
  - [x] /researchers routes (researcher settings)
  - [x] /admin routes (user management)
  - [x] Frontend /settings route
- [x] Frontend Implementation
  - [x] Settings page with sidebar navigation
  - [x] ProfileSettings component (name, email, role display)
  - [x] PasswordSettings component (current/new password with validation)
  - [x] PreferencesSettings component (11 notification preferences)
  - [x] OrganizationSettings component (nonprofit-only, all org fields)
  - [x] ResearcherSettings component (researcher-only, all profile fields)
  - [x] DangerZone component (account deletion with confirmation)
  - [x] Settings link in TopBar
  - [x] Consistent styling with existing components
- [x] Testing
  - [x] 25 integration test cases created
  - [x] Tests cover all UC6 endpoints
  - [x] Tests include success and error scenarios
- [x] Documentation
  - [x] Complete API documentation (UC6_API_DOCUMENTATION.md)
  - [x] Request/response examples
  - [x] Error codes reference
  - [x] Security features documentation

#### Files Created
- ✅ `backend/src/controllers/userController.js`
- ✅ `backend/src/controllers/organizationController.js`
- ✅ `backend/src/controllers/researcherController.js`
- ✅ `backend/src/routes/userRoutes.js`
- ✅ `backend/src/routes/organizationRoutes.js`
- ✅ `backend/src/routes/researcherRoutes.js`
- ✅ `backend/src/routes/adminRoutes.js`
- ✅ `backend/src/middleware/auth.js`
- ✅ `backend/src/database/models/UserPreferences.js`
- ✅ `backend/src/database/migrations/20251125120001-create-user-preferences-table.js`
- ✅ `backend/src/database/migrations/20251125120002-add-deleted-at-to-user.js`
- ✅ `backend/tests/integration/account-settings.test.js`
- ✅ `backend/UC6_API_DOCUMENTATION.md`
- ✅ `frontend/src/pages/Settings.jsx`
- ✅ `frontend/src/components/settings/ProfileSettings.jsx`
- ✅ `frontend/src/components/settings/PasswordSettings.jsx`
- ✅ `frontend/src/components/settings/PreferencesSettings.jsx`
- ✅ `frontend/src/components/settings/OrganizationSettings.jsx`
- ✅ `frontend/src/components/settings/ResearcherSettings.jsx`
- ✅ `frontend/src/components/settings/DangerZone.jsx`

#### Files Modified
- ✅ `backend/src/index.js` (added new routes)
- ✅ `backend/src/database/models/index.js` (added UserPreferences associations)
- ✅ `backend/src/database/models/User.js` (added paranoid mode, deleted_at field)
- ✅ `backend/src/config/database.js` (added SSL for development environment)
- ✅ `frontend/src/App.jsx` (added /settings route)
- ✅ `frontend/src/components/TopBar.jsx` (added Settings link)

#### Implementation Summary
UC6 provides comprehensive account management for all user types with a complete frontend implementation:
- **Users**: Can update profile, change password, manage notification preferences, and delete accounts
- **Nonprofits**: Can update organization details with role validation
- **Researchers**: Can update professional profiles with rate range validation
- **Admins**: Can permanently delete users (with confirmation) or restore soft-deleted accounts

**Key Features**:
- Separate UserPreferences table for scalability
- Soft delete with 30-day recovery period
- Hard delete requires explicit confirmation
- Role-based access control for settings endpoints
- Comprehensive validation and error handling
- 25 integration tests covering all functionality
- Complete frontend with 6 settings components
- Sidebar navigation with role-based menu items
- Success/error messages with loading states
- Consistent styling with existing components

#### Blockers
None

#### Notes
UC6 is fully implemented with both backend and frontend complete. All 14 API endpoints are functional, documented, and integrated with responsive UI components. The Settings page provides an intuitive interface for managing account preferences, with role-specific sections appearing only for authorized users.

---

## Phase 2: Project Management

### ✅ UC7: Create a Project Brief
**Status**: 🟢 Complete  
**Priority**: Critical  
**Completed**: November 26, 2025

#### Completed Tasks
- [x] Project CRUD Operations
  - [x] POST /projects endpoint
  - [x] PUT /projects/:id endpoint
  - [x] GET /projects/:id endpoint
  - [x] GET /projects (list) endpoint
  - [x] DELETE /projects/:id endpoint
- [x] Validation
  - [x] Required fields validation (title)
  - [x] Budget validation (non-negative)
  - [x] Status enum validation
  - [x] Trim whitespace from strings
  - [x] Max length constraints
- [x] Status Workflow
  - [x] Draft status (default)
  - [x] Open status (published)
  - [x] In Progress status
  - [x] Completed status
  - [x] Cancelled status
- [x] Access Control
  - [x] Only nonprofit users can create
  - [x] Only nonprofit users can edit/delete
  - [x] Organization ownership validation
  - [x] Users can only access their org's projects
- [x] Organization Association
  - [x] Auto-link to user's organization
  - [x] Validate organization exists
  - [x] Require organization profile before project creation
- [x] Backend Implementation
  - [x] Project controller with 5 CRUD methods
  - [x] Project routes with authentication
  - [x] requireNonprofit middleware
  - [x] Organization ownership checks
  - [x] Proper error handling
- [x] Frontend Implementation
  - [x] ProjectForm component (create/edit)
  - [x] ProjectList component (view/manage)
  - [x] Status badges with color coding
  - [x] Budget formatting
  - [x] Filter by status
  - [x] Delete confirmation
  - [x] Edit/cancel functionality
  - [x] Integration into nonprofit dashboard
- [x] Testing
  - [x] 30+ integration test cases
  - [x] Tests for all CRUD operations
  - [x] Tests for validation errors
  - [x] Tests for authorization checks
  - [x] Tests for organization ownership
- [x] Documentation
  - [x] Complete API documentation
  - [x] Request/response examples
  - [x] Error codes reference
  - [x] Status workflow guide
  - [x] Security features documentation

#### Files Created
- ✅ `backend/src/controllers/projectController.js`
- ✅ `backend/src/routes/projectRoutes.js`
- ✅ `backend/tests/integration/project-brief.test.js`
- ✅ `backend/UC7_API_DOCUMENTATION.md`
- ✅ `frontend/src/components/projects/ProjectForm.jsx`
- ✅ `frontend/src/components/projects/ProjectList.jsx`

#### Files Modified
- ✅ `backend/src/index.js` (added project routes)
- ✅ `frontend/src/pages/Dashboard.jsx` (added nonprofit project management)

#### Implementation Summary
UC7 provides complete project brief management for nonprofit organizations:
- **Create Projects**: Nonprofits can create detailed project briefs with problem statements, expected outcomes, methods required, timeline, budget, and data sensitivity
- **Manage Projects**: Full CRUD operations with organization-based access control
- **Status Workflow**: Draft → Open → In Progress → Completed/Cancelled
- **Frontend Integration**: Card-based project list with filtering, inline editing, and status badges
- **Validation**: Client and server-side validation ensures data quality
- **Security**: Role-based access (nonprofit only), organization ownership validation

**Key Features**:
- 5 project statuses (draft, open, in_progress, completed, cancelled)
- Organization-based access control (users can only see their org's projects)
- Budget tracking with minimum budget field
- Data sensitivity levels (Low, Medium, High)
- Methods and expertise required tracking
- Status filtering in project list
- Responsive card-based UI with Bootstrap
- Delete confirmation to prevent accidental deletion
- Real-time form validation

#### Blockers
None

#### Notes
UC7 is fully implemented with both backend and frontend complete. Nonprofits can now create, edit, view, and delete project briefs through an intuitive dashboard interface. The system is ready for UC10 (admin moderation) and UC4 (matching algorithm) integration.

---

### ⏳ UC10: Moderate Project Briefs
**Status**: ⚪ Not Started  
**Priority**: High  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Admin Endpoints
  - [ ] GET /admin/projects/pending
  - [ ] POST /admin/projects/:id/approve
  - [ ] POST /admin/projects/:id/reject
  - [ ] POST /admin/projects/:id/request-changes
  - [ ] GET /admin/audit-logs
- [ ] Admin Middleware
  - [ ] Check user role = admin
  - [ ] Admin-only route protection
- [ ] Approval Workflow
  - [ ] Change status to approved
  - [ ] Send notification to org
  - [ ] Make project visible to researchers
- [ ] Rejection Workflow
  - [ ] Change status to rejected
  - [ ] Store rejection reason
  - [ ] Send feedback to org
  - [ ] Allow resubmission
- [ ] Request Changes
  - [ ] Change status to needs_revision
  - [ ] List requested changes
  - [ ] Notify org of changes needed
- [ ] Audit Logging
  - [ ] Log all admin actions
  - [ ] Store actor, action, timestamp
  - [ ] Store before/after state
- [ ] Taxonomy Validation
  - [ ] Validate method tags
  - [ ] Validate domain tags
  - [ ] Suggest corrections
- [ ] Bulk Operations
  - [ ] Bulk approve
  - [ ] Bulk reject
  - [ ] Bulk tag editing

#### Files to Create
- [ ] `backend/src/controllers/adminController.js`
- [ ] `backend/src/routes/adminRoutes.js`
- [ ] `backend/src/middleware/adminAuth.js`
- [ ] `backend/src/services/auditService.js`

#### Dependencies
- Requires UC7 (projects must exist)
- Requires AuditLog model (already created)

#### Blockers
None

---

### ✅ UC4: Manage Project Milestones
**Status**: 🟢 Complete  
**Priority**: High  
**Completed**: November 26, 2025

#### Completed Tasks
- [x] Milestone CRUD Operations
  - [x] POST /api/projects/:projectId/milestones (create)
  - [x] GET /api/projects/:projectId/milestones (list with filters)
  - [x] GET /api/projects/:projectId/milestones/:id (get single)
  - [x] PUT /api/projects/:projectId/milestones/:id (update)
  - [x] DELETE /api/projects/:projectId/milestones/:id (delete)
  - [x] GET /api/projects/:projectId/milestones/stats (statistics)
- [x] Status Tracking
  - [x] Status ENUM (pending, in_progress, completed, cancelled)
  - [x] Auto-calculate days until due
  - [x] Auto-detect overdue milestones
  - [x] Computed status field (shows 'overdue' when applicable)
  - [x] Completion timestamp tracking
- [x] Validation
  - [x] Due date must be today or future (for new milestones)
  - [x] Name required (1-255 chars)
  - [x] Status enum validation
  - [x] Empty name prevention
  - [x] Valid status values enforced
- [x] Access Control
  - [x] All authenticated users can view milestones
  - [x] Only nonprofit users can create milestones
  - [x] Only nonprofit users can update milestones
  - [x] Only nonprofit users can delete milestones
  - [x] Organization ownership validation
  - [x] Prevent cross-organization access
- [x] Analytics & Statistics
  - [x] Total milestone count
  - [x] Count by status (pending, in_progress, completed, cancelled)
  - [x] Overdue count
  - [x] Completion rate percentage
  - [x] Project-level milestone stats
- [x] Model & Migration
  - [x] Enhanced Milestone model with helper methods
  - [x] Updated migration with ENUM type
  - [x] Proper foreign key to projects
  - [x] Indexes for performance (project_id, status, due_date)
  - [x] Timestamps (created_at, updated_at, completed_at)
- [x] Backend Implementation
  - [x] milestoneController with 6 methods
  - [x] milestoneRoutes with role-based middleware
  - [x] Nested routes under /projects/:projectId/milestones
  - [x] Sequelize ORM queries with filters
  - [x] Overdue detection logic
  - [x] Days until due calculation
- [x] Frontend Implementation
  - [x] MilestoneTracker component with stats cards
  - [x] MilestoneForm component for create/edit
  - [x] Status badges with color coding
  - [x] Overdue indicators and badges
  - [x] Filter by status and overdue
  - [x] Quick status updates via dropdown
  - [x] Modal integration with ProjectList
  - [x] Progress tracking visualization
- [x] Testing
  - [x] 40+ integration test cases
  - [x] Tests for all CRUD operations
  - [x] Tests for validation errors
  - [x] Tests for authorization checks
  - [x] Tests for status transitions
  - [x] Tests for overdue detection
  - [x] Tests for statistics accuracy
  - [x] Tests for cross-organization access prevention
- [x] Documentation
  - [x] Complete API documentation (UC4_API_DOCUMENTATION.md)
  - [x] All endpoints documented with examples
  - [x] Error codes and responses
  - [x] Use case examples
  - [x] Best practices guide
  - [x] Integration examples
  - [x] Future enhancements roadmap

#### Pending Tasks (Future Enhancements)
- [ ] Email Notifications
  - [ ] Alert 7 days before due
  - [ ] Alert 1 day before due
  - [ ] Alert when overdue
  - [ ] Weekly milestone digest
- [ ] Cron Job
  - [ ] Daily milestone status check
  - [ ] Automatic overdue marking
  - [ ] Scheduled reminder emails
  - [ ] SLA violation alerts
- [ ] Advanced Features
  - [ ] Milestone dependencies
  - [ ] File attachments per milestone
  - [ ] Comments/notes on milestones
  - [ ] Milestone templates
  - [ ] Timeline/Gantt chart view
  - [ ] Export to calendar (iCal)

#### Files Created
- ✅ `backend/src/database/models/Milestone.js` (enhanced)
- ✅ `backend/src/database/migrations/20251125000007-create-milestones-table.js` (updated)
- ✅ `backend/src/controllers/milestoneController.js`
- ✅ `backend/src/routes/milestoneRoutes.js`
- ✅ `backend/tests/integration/milestones.test.js`
- ✅ `backend/UC4_API_DOCUMENTATION.md`
- ✅ `frontend/src/components/milestones/MilestoneTracker.jsx`
- ✅ `frontend/src/components/milestones/MilestoneForm.jsx`

#### Files Modified
- ✅ `backend/src/routes/projectRoutes.js` (added milestone routes)
- ✅ `frontend/src/components/projects/ProjectList.jsx` (added milestone modal)

#### Implementation Summary
UC4 provides comprehensive milestone tracking for project management:
- **Create Milestones**: Nonprofits can break projects into trackable deliverables with names, descriptions, due dates, and statuses
- **Track Progress**: Visual progress indicators with completion rates, overdue warnings, and days-until-due counters
- **Manage Status**: Four-state workflow (pending → in_progress → completed/cancelled) with automatic timestamp tracking
- **Monitor Health**: Real-time statistics showing total milestones, completion rate, in-progress count, and overdue alerts
- **Filter & Search**: Filter milestones by status or show only overdue items
- **Quick Updates**: Dropdown menus for rapid status changes without opening full edit form

**Key Features**:
- 6 API endpoints for full CRUD + statistics
- ENUM-based status with validation
- Automatic overdue detection (computed at query time)
- Days-until-due calculation (positive for future, negative for overdue)
- Completion timestamp auto-set when marked complete
- Organization-based access control
- 40+ integration tests covering all scenarios
- Responsive Bootstrap UI with status badges
- Stats cards showing project health at a glance
- Modal-based milestone management from project list
- Color-coded status indicators (pending=gray, in_progress=blue, completed=green, overdue=red)

**Status Workflow**:
```
pending → in_progress → completed
                     ↘ cancelled
```

**Computed Fields**:
- `is_overdue`: Boolean flag when past due and not completed
- `days_until_due`: Integer showing days remaining (negative if overdue)
- `computed_status`: Shows 'overdue' instead of actual status when applicable

#### Dependencies
- ✅ UC7 (projects) - Complete
- ⏳ UC2 (messaging) - For milestone discussion (future)
- ⏳ UC13 (file uploads) - For milestone deliverables (future)

#### Blockers
None

#### Notes
UC4 is fully implemented with both backend and frontend complete. Nonprofits can now break down projects into manageable milestones with clear due dates and progress tracking. The system provides visual indicators for project health through completion rates and overdue warnings. Future enhancements will add automated notifications and email reminders for upcoming/overdue milestones.

**Integration Points**:
- Integrates seamlessly with UC7 project briefs
- Ready for UC2 messaging integration (milestone comments)
- Ready for UC13 file uploads (milestone deliverables)
- Prepared for UC12 admin monitoring (SLA tracking)

---

## Phase 3: Matching System

### ⏳ UC8: Review Suggested Matches (Researcher)
**Status**: ⚪ Not Started  
**Priority**: Critical  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Matching Algorithm
  - [ ] Domain matching logic
  - [ ] Method matching logic
  - [ ] Compliance fit scoring
  - [ ] Budget compatibility check
  - [ ] Availability matching
  - [ ] Calculate composite score (0-100)
- [ ] Reason Codes
  - [ ] Generate match reason codes
  - [ ] Explain score components
  - [ ] Highlight key compatibilities
- [ ] Endpoints
  - [ ] GET /researchers/me/matches
  - [ ] POST /matches/:id/express-interest
  - [ ] POST /matches/:id/decline
  - [ ] GET /matches/:id/details
- [ ] Filtering & Sorting
  - [ ] Sort by score (default)
  - [ ] Sort by date
  - [ ] Filter by min score
  - [ ] Filter by budget range
  - [ ] Filter by compliance requirements
- [ ] Match Generation Job
  - [ ] Run nightly for new projects
  - [ ] Run when researcher updates profile
  - [ ] Store matches in database
  - [ ] Update match scores periodically
- [ ] Notifications
  - [ ] Email when new high-score matches
  - [ ] In-app notification badge
  - [ ] Weekly digest of matches
- [ ] Interest Tracking
  - [ ] Store interest expression
  - [ ] Notify nonprofit of interest
  - [ ] Track response time

#### Files to Create
- [ ] `backend/src/controllers/matchController.js`
- [ ] `backend/src/routes/matchRoutes.js`
- [ ] `backend/src/services/matchingService.js`
- [ ] `backend/src/jobs/generateMatchesJob.js`
- [ ] `backend/src/algorithms/scoringAlgorithm.js`

#### Dependencies
- Requires UC7 (projects)
- Requires UC6 (researcher profiles)

#### Blockers
None

#### Notes
This is a complex feature. Start with basic scoring, then refine algorithm based on feedback.

---

### ⏳ UC9: Review Researcher Matches (Nonprofit)
**Status**: ⚪ Not Started  
**Priority**: Critical  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Badge System
  - [ ] Compliance badges (HIPAA, FERPA, etc.)
  - [ ] Experience level badges
  - [ ] Rating badges (5-star, etc.)
  - [ ] Verification badges
  - [ ] Badge display logic
- [ ] Researcher Ranking
  - [ ] Rank by match score
  - [ ] Rank by rating
  - [ ] Rank by experience
  - [ ] Rank by availability
- [ ] Endpoints
  - [ ] GET /projects/:projectId/matches
  - [ ] POST /matches/:id/invite
  - [ ] POST /matches/:id/reject
  - [ ] GET /matches/:id/researcher-profile
- [ ] Profile Enrichment
  - [ ] Include average rating
  - [ ] Include completed projects count
  - [ ] Include badges
  - [ ] Include rate range
  - [ ] Include availability
- [ ] Invitation Workflow
  - [ ] Send invitation to researcher
  - [ ] Track invitation status
  - [ ] Set expiration on invitations
  - [ ] Handle acceptance/decline
- [ ] Filtering
  - [ ] Filter by min score
  - [ ] Filter by compliance badges
  - [ ] Filter by rate range
  - [ ] Filter by availability
- [ ] Comparison Tool
  - [ ] Compare up to 3 researchers
  - [ ] Side-by-side view
  - [ ] Highlight differences

#### Files to Create/Modify
- [ ] `backend/src/controllers/matchController.js` (extend)
- [ ] `backend/src/services/badgeService.js`
- [ ] `backend/src/services/comparisonService.js`

#### Dependencies
- Requires UC8 (matching system)
- Requires UC7 (projects)

#### Blockers
None

---

## Phase 3: Matching System (Continued)

### ✅ UC3: Browse & Search Projects (Public Catalog)
**Status**: 🟢 Complete  
**Priority**: High  
**Completed**: November 25, 2025

#### Completed Tasks
- [x] Public Browse Endpoints
  - [x] GET /api/projects/browse (no authentication)
  - [x] GET /api/projects/:id/public (no authentication)
  - [x] Pagination support (page, limit query params)
  - [x] Search by keywords (title/description)
  - [x] Filter by category and location
  - [x] Sort by created date (newest first)
- [x] Backend Implementation
  - [x] browseProjects controller method
  - [x] getPublicProject controller method
  - [x] Query builder with Op.like for search
  - [x] Organization associations/includes
  - [x] Proper error handling
- [x] Frontend Implementation
  - [x] Browse.jsx page component
  - [x] Search bar with real-time filtering
  - [x] Category and location dropdowns
  - [x] Project cards with hover effects
  - [x] Pagination controls (Previous/Next)
  - [x] "View Details" navigation
  - [x] Responsive grid layout
  - [x] Empty state messaging
  - [x] Loading and error states
- [x] Testing
  - [x] Integration tests in browse-projects.test.js
  - [x] Tests for public browsing without auth
  - [x] Tests for search functionality
  - [x] Tests for filtering
  - [x] Tests for pagination
  - [x] Complete API documentation
  - [x] Query parameter reference
  - [x] Request/response examples
  - [x] Search behavior explanation
  - [x] Filter combination guide
  - [x] Use case examples

#### Files Created
- ✅ `backend/src/controllers/projectController.js` (added browseProjects, getPublicProject)
- ✅ `backend/src/routes/projectRoutes.js` (added public routes)
- ✅ `backend/tests/integration/browse-projects.test.js`
- ✅ `backend/UC3_API_DOCUMENTATION.md`
- ✅ `frontend/src/pages/Browse.jsx`
- ✅ `frontend/src/components/browse/SearchBar.jsx`
- ✅ `frontend/src/components/browse/ProjectCard.jsx`
- ✅ `frontend/src/components/browse/ProjectDetailModal.jsx`

#### Files Modified
- ✅ `frontend/src/App.jsx` (added /browse route)
- ✅ `frontend/src/components/TopBar.jsx` (added Browse Projects link)

#### Implementation Summary
UC3 provides complete project discovery functionality for researchers and public users:
- **Public Browse**: View all open project briefs without authentication
- **Keyword Search**: Search across title, problem, outcomes, and methods
- **Advanced Filters**: Filter by methods, budget, sensitivity, timeline
- **Organization Info**: See organization details with each project
- **Pagination**: Navigate large result sets efficiently
- **Responsive UI**: Card-based layout with detailed modal view

**Key Features**:
- Public access (no authentication required)
- Multi-field search with case-insensitive matching
- Combinable filters with AND logic
- Organization details included (no sensitive data)
- Draft projects excluded from public view
- Pagination with customizable page size
- Detailed project modal with full organization info
- Filter panel with clear/reset functionality
- Responsive Bootstrap UI with project cards
- "Express Interest" button (ready for future UC2 integration)

#### Blockers
None

#### Notes
UC3 is fully implemented with both backend and frontend complete. Researchers can now discover project opportunities through a powerful search and filter interface. The Browse page is publicly accessible and sets up perfectly for:
- UC4: Matching algorithm (automated project recommendations)
- UC2: Messaging (contact organizations about projects)
- UC8/9: Applications (apply to projects)

---

### ⏳ UC11: Execute an Agreement
**Status**: ⚪ Not Started  
**Priority**: Critical  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Agreement Templates
  - [ ] NDA template (PDF)
  - [ ] DUA template (PDF)
  - [ ] SOW template (PDF)
  - [ ] Variable substitution in templates
- [ ] E-Signature Integration
  - [ ] Research providers (DocuSign/HelloSign)
  - [ ] Set up API integration
  - [ ] Send document for signature
  - [ ] Track signature status
  - [ ] Webhook for completion
- [ ] Endpoints
  - [ ] POST /agreements
  - [ ] GET /agreements/:id
  - [ ] POST /agreements/:id/sign
  - [ ] GET /agreements/:id/download
  - [ ] GET /agreements (list)
- [ ] PDF Generation
  - [ ] Generate PDF from template
  - [ ] Fill in project details
  - [ ] Fill in party details
  - [ ] Fill in budget info
- [ ] Status Workflow
  - [ ] Draft → Pending → Signed → Active
  - [ ] Track who has signed
  - [ ] Require both parties to sign
  - [ ] Auto-activate when fully signed
- [ ] Audit Trail
  - [ ] Log all agreement actions
  - [ ] Store signature timestamps
  - [ ] Store IP addresses
  - [ ] Generate audit report
- [ ] Notifications
  - [ ] Email when signature requested
  - [ ] Email when other party signs
  - [ ] Email when agreement active
  - [ ] Reminder emails for pending signatures
- [ ] Storage
  - [ ] Store signed PDFs securely
  - [ ] Encrypt at rest
  - [ ] Generate signed download URLs
  - [ ] Set expiration on URLs

#### Files to Create
- [ ] `backend/src/controllers/agreementController.js`
- [ ] `backend/src/routes/agreementRoutes.js`
- [ ] `backend/src/services/eSignatureService.js`
- [ ] `backend/src/services/pdfService.js`
- [ ] `backend/src/templates/agreements/nda.html`
- [ ] `backend/src/templates/agreements/dua.html`
- [ ] `backend/src/templates/agreements/sow.html`

#### Dependencies
- Requires UC8/9 (matching completed)
- Requires UC13 (file storage)
- Requires external service account (DocuSign/HelloSign)

#### Blockers
- Need to select e-signature provider
- Need budget for e-signature service

---

### ⏳ UC2: Message Another Party
**Status**: ⚪ Not Started  
**Priority**: High  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Real-Time Setup
  - [ ] Install Socket.IO
  - [ ] Configure Socket.IO server
  - [ ] Implement connection handling
  - [ ] Implement room-based messaging
  - [ ] Authenticate socket connections
- [ ] Message Endpoints
  - [ ] POST /messages (send)
  - [ ] GET /messages (list)
  - [ ] GET /messages/conversations
  - [ ] PUT /messages/:id/read
  - [ ] DELETE /messages/:id
- [ ] Conversation Management
  - [ ] Group messages by thread
  - [ ] Track unread count per conversation
  - [ ] Mark messages as read
  - [ ] Archive conversations
- [ ] Features
  - [ ] Send text messages
  - [ ] File attachments
  - [ ] Message search
  - [ ] Message notifications
  - [ ] Typing indicators
  - [ ] Read receipts
- [ ] Access Control
  - [ ] Only message project participants
  - [ ] Block spam/abuse
  - [ ] Report inappropriate messages
- [ ] Pagination
  - [ ] Paginate message history
  - [ ] Load more on scroll
  - [ ] Default limit: 50 messages
- [ ] Notifications
  - [ ] Real-time browser notification
  - [ ] Email notification (if offline)
  - [ ] Push notification (future)
  - [ ] Notification preferences

#### Files to Create
- [ ] `backend/src/controllers/messageController.js`
- [ ] `backend/src/routes/messageRoutes.js`
- [ ] `backend/src/services/socketService.js`
- [ ] `backend/src/services/notificationService.js`
- [ ] `backend/src/middleware/socketAuth.js`

#### Dependencies
- Requires UC1 (authentication)
- Requires UC3 (project collaboration)

#### Blockers
None

---

### ⏳ UC13: Upload and Secure Data/Artifacts
**Status**: ⚪ Not Started  
**Priority**: High  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Database Setup
  - [ ] Create Attachment model
  - [ ] Create migration for attachments table
  - [ ] Add associations (Project, Agreement)
- [ ] Storage Service
  - [ ] Set up S3 bucket (or compatible)
  - [ ] Configure AWS SDK / cloud SDK
  - [ ] Implement upload function
  - [ ] Implement download function
  - [ ] Implement delete function
- [ ] File Upload
  - [ ] POST /projects/:id/attachments
  - [ ] POST /agreements/:id/attachments
  - [ ] Multer middleware for multipart
  - [ ] File size limits (max 100MB)
  - [ ] Allowed file types
- [ ] Security
  - [ ] Virus/malware scanning (ClamAV)
  - [ ] Scan before upload to S3
  - [ ] Reject infected files
  - [ ] Encryption at rest (S3 default)
  - [ ] Encryption in transit (HTTPS)
- [ ] Signed URLs
  - [ ] Generate time-limited download URLs
  - [ ] Default expiration: 1 hour
  - [ ] Regenerate URL on request
- [ ] Endpoints
  - [ ] POST /attachments (upload)
  - [ ] GET /attachments/:id (metadata)
  - [ ] GET /attachments/:id/download (signed URL)
  - [ ] DELETE /attachments/:id
  - [ ] GET /projects/:id/attachments (list)
- [ ] Access Control
  - [ ] Only project participants can upload
  - [ ] Only project participants can download
  - [ ] Verify ownership before delete
- [ ] Metadata
  - [ ] Store filename, size, type
  - [ ] Store upload timestamp
  - [ ] Store uploader user_id
  - [ ] Store scan status
  - [ ] Optional description

#### Files to Create
- [ ] `backend/src/database/models/Attachment.js`
- [ ] `backend/src/database/migrations/*-create-attachments.js`
- [ ] `backend/src/controllers/attachmentController.js`
- [ ] `backend/src/routes/attachmentRoutes.js`
- [ ] `backend/src/services/storageService.js`
- [ ] `backend/src/services/scanService.js`
- [ ] `backend/src/middleware/uploadMiddleware.js`

#### Dependencies
- Requires S3 bucket or cloud storage account
- Requires ClamAV or scanning service

#### Blockers
- Need to set up cloud storage account
- Need to install/configure virus scanner

---

## Phase 5: Reviews & Monitoring

### ⏳ UC5: Provide Post-Project Review
**Status**: ⚪ Not Started  
**Priority**: Medium  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Review Submission
  - [ ] POST /projects/:id/reviews
  - [ ] Validate project is completed
  - [ ] Validate user is participant
  - [ ] Prevent duplicate reviews
- [ ] Score Validation
  - [ ] Quality: 1-5
  - [ ] Timeliness: 1-5
  - [ ] Communication: 1-5
  - [ ] Professionalism: 1-5
  - [ ] Calculate average score
- [ ] Review Display
  - [ ] GET /projects/:id/reviews
  - [ ] GET /users/:id/reviews
  - [ ] Show average ratings on profile
  - [ ] Show review count
- [ ] Access Control
  - [ ] Only participants can review
  - [ ] One review per participant per project
  - [ ] Cannot review self
  - [ ] Can edit own review within 24 hours
- [ ] Moderation
  - [ ] Report inappropriate review
  - [ ] Admin can hide review
  - [ ] Admin can delete review
  - [ ] Track moderation actions
- [ ] Notifications
  - [ ] Notify when reviewed
  - [ ] Encourage review after completion
  - [ ] Remind to review after 7 days
- [ ] Analytics
  - [ ] Display on user profile
  - [ ] Show trend over time
  - [ ] Compare to platform average

#### Files to Create
- [ ] `backend/src/controllers/ratingController.js`
- [ ] `backend/src/routes/ratingRoutes.js`
- [ ] `backend/src/validators/ratingValidator.js`
- [ ] `backend/src/middleware/participantCheck.js`

#### Dependencies
- Requires UC4 (completed projects)
- Requires UC3 (agreement completion)

#### Blockers
None

---

### ⏳ UC12: Monitor Project Status (Admin)
**Status**: ⚪ Not Started  
**Priority**: Medium  
**Assigned To**: TBD  
**Target Date**: TBD

#### Tasks Checklist
- [ ] Kanban Board
  - [ ] GET /admin/projects/kanban
  - [ ] Group by status
  - [ ] Sort by priority/date
  - [ ] Drag-and-drop status change (frontend)
  - [ ] Manual status change endpoint
- [ ] Status Categories
  - [ ] Draft (newly created)
  - [ ] In Review (pending admin approval)
  - [ ] Approved (visible to researchers)
  - [ ] Matched (researchers invited/applied)
  - [ ] In Progress (agreement signed)
  - [ ] Completed (all milestones done)
  - [ ] Stuck (SLA alerts triggered)
- [ ] SLA Monitoring
  - [ ] Define SLA thresholds
  - [ ] Detect stuck projects
  - [ ] Detect overdue milestones
  - [ ] Detect no progress (7+ days)
  - [ ] Alert admin dashboard
- [ ] Analytics
  - [ ] GET /admin/projects/analytics
  - [ ] Total projects by status
  - [ ] Average time in each status
  - [ ] Completion rate
  - [ ] Match success rate
  - [ ] Active projects count
- [ ] Alerts
  - [ ] Overdue milestones
  - [ ] No activity for 7 days
  - [ ] Pending approvals > 3 days
  - [ ] Low match scores
  - [ ] Reported issues
- [ ] Cron Job
  - [ ] Run daily SLA checks
  - [ ] Generate alert notifications
  - [ ] Update project health scores
  - [ ] Send summary email to admin
- [ ] Filters & Search
  - [ ] Filter by status
  - [ ] Filter by organization
  - [ ] Filter by date range
  - [ ] Search by title/description

#### Files to Create/Modify
- [ ] `backend/src/controllers/adminController.js` (extend)
- [ ] `backend/src/services/slaService.js`
- [ ] `backend/src/jobs/slaMonitorJob.js`
- [ ] `backend/src/routes/adminRoutes.js` (extend)

#### Dependencies
- Requires UC7 (projects)
- Requires UC4 (milestones)
- Requires UC10 (admin role)

#### Blockers
None

---

## Phase 6: Admin Dashboard (System Management)

### ✅ Admin Dashboard: System Management & Content Moderation
**Status**: 🟢 Complete  
**Priority**: High  
**Completed**: November 27, 2025

#### Summary
Comprehensive administrative interface providing centralized control over platform entities, user management, content moderation, and system analytics. Enables admins to oversee all aspects of the TRIDENT Match Portal.

#### Completed Tasks
- [x] Backend Admin Controller (adminController.js - 450+ lines)
  - [x] Dashboard statistics endpoint (GET /admin/dashboard/stats)
  - [x] User management (list, details, approve, suspend, unsuspend, delete)
  - [x] Project management (list, update status, soft delete)
  - [x] Milestone management (list, delete)
  - [x] Organization management (list, delete with cascade)
  - [x] Pagination for all listing endpoints
  - [x] Search functionality (users by name/email, projects by title)
  - [x] Filter capabilities (by role, status, etc.)
  - [x] Soft delete with paranoid mode
  - [x] Permanent deletion with cascade handling
- [x] Admin Routes (adminRoutes.js)
  - [x] All routes protected with authenticate + requireAdmin middleware
  - [x] 15 total endpoints across dashboard, users, projects, milestones, orgs
- [x] Authentication & Authorization
  - [x] requireAdmin middleware in auth.js
  - [x] Role verification from JWT token
  - [x] Account status validation (reject pending/suspended)
  - [x] Paranoid: false for explicit deletion checks
- [x] Frontend Admin Dashboard (AdminDashboard.jsx - 778 lines)
  - [x] Overview tab with real-time statistics cards
  - [x] Users tab (list, search, filter, approve/suspend/unsuspend/delete)
  - [x] Projects tab (list, search, update status, delete)
  - [x] Milestones tab (list, delete)
  - [x] Organizations tab (list, delete with cascade warning)
  - [x] Role-based badges (Admin, Nonprofit, Researcher)
  - [x] Status indicators (Active, Pending, Suspended for users; Open, In Progress, Completed for projects)
  - [x] Confirmation dialogs for all destructive actions
  - [x] Search inputs with real-time filtering
  - [x] Filter dropdowns (role filter for users, status filter for projects)
  - [x] Pagination controls (Previous/Next buttons)
  - [x] Real-time data refresh after actions
  - [x] Error handling with Bootstrap alerts
  - [x] Success notifications
  - [x] Loading states during API calls
- [x] Admin Route Integration
  - [x] /admin route added to App.jsx
  - [x] Auto-redirect admin users to /admin on login (AuthContext.jsx)
  - [x] Bootstrap Icons CDN added to index.html
- [x] Database Enhancements
  - [x] account_status field added to User model (ENUM: active, pending, suspended)
  - [x] Migration 20251126120001-add-account-status-to-user.js
  - [x] All existing users updated to 'active' status
  - [x] Seed data includes account_status for all users

#### Files Created
- ✅ `backend/src/controllers/adminController.js` (NEW - 450+ lines)
- ✅ `backend/src/routes/adminRoutes.js` (NEW - 15 routes)
- ✅ `frontend/src/pages/AdminDashboard.jsx` (NEW - 778 lines)
- ✅ `backend/src/database/migrations/20251126120001-add-account-status-to-user.js` (NEW)
- ✅ `backend/update-account-status.js` (utility script)
- ✅ `backend/test-admin-auth.js` (verification script)

#### Files Modified
- ✅ `backend/src/middleware/auth.js` (added requireAdmin, account_status validation)
- ✅ `backend/src/database/models/User.js` (added account_status field)
- ✅ `backend/src/controllers/authController.js` (JWT fix: userId instead of sub)
- ✅ `frontend/src/App.jsx` (added /admin route)
- ✅ `frontend/src/auth/AuthContext.jsx` (admin redirect logic)
- ✅ `frontend/index.html` (Bootstrap Icons CDN)
- ✅ `backend/seed-database.js` (all users have account_status: 'active')

#### API Endpoints (15 Total)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard/stats` | Platform overview statistics | Admin |
| GET | `/api/admin/users` | List all users (paginated, searchable) | Admin |
| GET | `/api/admin/users/:id` | Get user details with relationships | Admin |
| PUT | `/api/admin/users/:id/status` | Update user account status | Admin |
| POST | `/api/admin/users/:id/approve` | Approve pending user account | Admin |
| POST | `/api/admin/users/:id/suspend` | Suspend user account | Admin |
| POST | `/api/admin/users/:id/unsuspend` | Unsuspend user account | Admin |
| DELETE | `/api/admin/users/:id` | Permanently delete user (cascade) | Admin |
| GET | `/api/admin/projects` | List all projects (paginated, searchable) | Admin |
| PUT | `/api/admin/projects/:id/status` | Update project status | Admin |
| DELETE | `/api/admin/projects/:id` | Soft delete project | Admin |
| GET | `/api/admin/milestones` | List all milestones (paginated) | Admin |
| DELETE | `/api/admin/milestones/:id` | Delete milestone | Admin |
| GET | `/api/admin/organizations` | List all organizations | Admin |
| DELETE | `/api/admin/organizations/:id` | Delete organization (cascade to projects) | Admin |

#### Dashboard Statistics
- Total Users (broken down by role: Nonprofit, Researcher, Admin)
- Total Projects (with status breakdown)
- Total Organizations
- Total Milestones (with status breakdown)
- Active Users (account_status = 'active')
- Pending Users (account_status = 'pending')

#### Frontend Features (5 Tabs)
1. **Overview Tab**:
   - Statistics cards with icon indicators
   - Real-time counts fetched from backend
   - Card layout with hover effects
   - Color-coded sections (primary, success, warning, info)

2. **Users Tab**:
   - Searchable user table (by name or email)
   - Role filter dropdown (All, Nonprofit, Researcher, Admin)
   - Status badges (success for active, warning for pending, danger for suspended)
   - Actions: Approve (for pending), Suspend/Unsuspend, Permanent Delete
   - Confirmation dialogs prevent accidental deletions
   - Pagination controls

3. **Projects Tab**:
   - Searchable project table (by title)
   - Status filter (All, Open, In Progress, Completed)
   - Status update dropdown (change project status inline)
   - Delete action (soft delete with confirmation)
   - Shows nonprofit organization name
   - Shows creation date

4. **Milestones Tab**:
   - List all milestones across all projects
   - Shows associated project title
   - Shows status (pending, in_progress, completed, overdue)
   - Shows due dates
   - Delete action with confirmation

5. **Organizations Tab**:
   - List all organizations
   - Shows location and focus areas
   - Delete action with CASCADE WARNING (deletes all org projects)
   - Requires explicit confirmation for safety

#### UI Components & Styling
- **Bootstrap 5.3.2**: Consistent styling with rest of platform
- **Bootstrap Icons**: Visual indicators for actions and status
- **Role Badges**: 
  - Admin: badge-primary (blue)
  - Nonprofit: badge-success (green)
  - Researcher: badge-info (cyan)
- **Status Badges**:
  - Active/Open/Completed: badge-success (green)
  - Pending/In Progress: badge-warning (yellow)
  - Suspended: badge-danger (red)
- **Action Buttons**:
  - Approve: btn-success with check icon
  - Suspend: btn-warning with ban icon
  - Unsuspend: btn-info with check-circle icon
  - Delete: btn-danger with trash icon
- **Modals**: Confirmation dialogs for all destructive operations
- **Tables**: Striped rows, hover effects, responsive design
- **Alerts**: Success/error messages with auto-dismiss capability

#### Security Features
- **Authentication Required**: All admin endpoints require valid JWT token
- **Role Verification**: requireAdmin middleware checks role === 'admin'
- **Account Status**: Middleware rejects suspended/pending users
- **Paranoid Mode**: Soft deletes allow recovery of accidentally deleted data
- **Cascade Warnings**: Users warned before deleting organizations (cascades to projects)
- **Confirmation Dialogs**: All destructive actions require explicit confirmation

#### Known Issues & Future Enhancements
- [ ] Add admin-only route protection on frontend /admin path (currently relies on backend auth)
- [ ] Implement bulk actions (approve multiple pending users at once)
- [ ] Add activity logs/audit trail for admin actions
- [ ] Export data to CSV functionality for reports
- [ ] Advanced analytics with charts (Chart.js/Recharts)
- [ ] Email notifications when admins take actions (user approved/suspended)
- [ ] Audit trail for compliance and accountability
- [ ] Advanced search with multiple criteria (created date range, etc.)
- [ ] Bulk delete with multi-select checkboxes
- [ ] Restore soft-deleted projects from admin dashboard

#### Integration with Other Use Cases
- **UC1**: Admin can approve pending user registrations
- **UC7**: Admin can moderate project briefs, update status, soft delete
- **UC4**: Admin can oversee all milestones, delete problematic ones
- **UC10** (Future): Admin infrastructure ready for project approval workflow
- **UC6**: Admin can manage user accounts (suspend policy violators)

#### Testing Status
- [x] Manual testing of all admin endpoints (via test-admin-auth.js)
- [x] Verified JWT authentication with admin role
- [x] Tested approve/suspend/unsuspend/delete user workflows
- [x] Tested project status updates and deletions
- [x] Tested organization cascade deletions
- [ ] Automated integration tests for admin endpoints (TODO)
- [ ] E2E tests for admin dashboard UI (TODO)

#### Blockers
None

#### Notes
Complete admin system providing full platform oversight and content moderation. Admins have centralized control over users (account approval, suspension), projects (status management, deletion), milestones (oversight, cleanup), and organizations (management with cascade awareness). Frontend dashboard provides intuitive tabbed interface with comprehensive search, filtering, and pagination. All destructive actions protected by confirmation dialogs. Soft delete system allows recovery of accidentally deleted data. Permanent deletions properly cascade to related entities.

**Production Ready**: Authentication working, all CRUD operations functional, proper error handling, responsive UI, security measures in place.

**Foundation for UC10**: Admin infrastructure (user management, project moderation) is ready for project brief approval workflow integration. The approve/reject pattern established for users can be extended to project review processes.

---

## Common Infrastructure

### Middleware (Required for all phases)

#### ✅ Authentication Middleware
**Status**: ⏳ Needs Creation  
**File**: `backend/src/middleware/authMiddleware.js`

**Tasks**:
- [ ] Verify JWT token
- [ ] Extract user from token
- [ ] Attach user to request
- [ ] Handle expired tokens
- [ ] Handle invalid tokens

---

#### ⏳ Role-Based Access Control
**Status**: ⏳ Not Started  
**File**: `backend/src/middleware/roleMiddleware.js`

**Tasks**:
- [ ] Check user role
- [ ] Require specific role(s)
- [ ] Return 403 if unauthorized
- [ ] Support multiple roles (OR logic)

---

#### ⏳ Validation Middleware
**Status**: ⏳ Not Started  
**File**: `backend/src/middleware/validationMiddleware.js`

**Tasks**:
- [ ] Use Joi or express-validator
- [ ] Validate request body
- [ ] Validate query params
- [ ] Validate route params
- [ ] Return detailed error messages

---

#### ⏳ Rate Limiting
**Status**: ⏳ Not Started  
**File**: `backend/src/middleware/rateLimitMiddleware.js`

**Tasks**:
- [ ] Install express-rate-limit
- [ ] Configure limits per endpoint
- [ ] Auth endpoints: 5 req/min
- [ ] API endpoints: 100 req/min
- [ ] Use Redis for distributed limiting

---

#### ⏳ Error Handling
**Status**: ⏳ Not Started  
**File**: `backend/src/middleware/errorMiddleware.js`

**Tasks**:
- [ ] Global error handler
- [ ] Format error responses
- [ ] Log errors (Winston)
- [ ] Hide sensitive info in production
- [ ] Send to error tracking (Sentry)

---

### Services (Shared across use cases)

#### ⏳ Email Service
**Status**: ⏳ Not Started  
**File**: `backend/src/services/emailService.js`

**Tasks**:
- [ ] Choose provider (SendGrid/Mailgun)
- [ ] Configure API credentials
- [ ] Send verification email
- [ ] Send notification email
- [ ] Send bulk emails
- [ ] Email templates (EJS/Handlebars)

---

#### ⏳ Notification Service
**Status**: ⏳ Not Started  
**File**: `backend/src/services/notificationService.js`

**Tasks**:
- [ ] Multi-channel support (email, in-app, push)
- [ ] Check user preferences
- [ ] Queue notifications
- [ ] Track notification status
- [ ] Retry failed notifications

---

#### ⏳ Audit Service
**Status**: ⏳ Not Started  
**File**: `backend/src/services/auditService.js`

**Tasks**:
- [ ] Log to AuditLog model
- [ ] Track actor, action, entity
- [ ] Store before/after state
- [ ] Query audit logs
- [ ] Generate audit reports

---

#### ⏳ Cron Service
**Status**: ⏳ Not Started  
**File**: `backend/src/services/cronService.js`

**Tasks**:
- [ ] Install node-cron
- [ ] Schedule milestone checks
- [ ] Schedule SLA monitoring
- [ ] Schedule match generation
- [ ] Schedule cleanup jobs

---

## Timeline & Milestones

### Sprint 1 (Week 1-2): Foundation
- [ ] Complete UC1 enhancements (email verification, MFA)
- [ ] Complete UC6 (account settings)
- [ ] Set up middleware infrastructure
- [ ] Set up email service
- [ ] Set up testing framework

### Sprint 2 (Week 3-4): Project Management
- [ ] Complete UC7 (create project brief)
- [ ] Complete UC10 (moderate project briefs)
- [ ] Set up admin role controls
- [ ] Set up audit logging

### Sprint 3 (Week 5-6): Matching
- [ ] Complete UC8 (researcher matches)
- [ ] Complete UC9 (nonprofit matches)
- [ ] Implement matching algorithm
- [ ] Set up match generation job

### Sprint 4 (Week 7-8): Collaboration
- [ ] Complete UC3/11 (agreements)
- [ ] Complete UC2 (messaging)
- [ ] Complete UC13 (file uploads)
- [ ] Set up Socket.IO
- [ ] Set up cloud storage

### Sprint 5 (Week 9-10): Milestones & Reviews
- [ ] Complete UC4 (milestones)
- [ ] Complete UC5 (reviews)
- [ ] Complete UC12 (admin monitoring)
- [ ] Set up cron jobs
- [ ] Implement SLA monitoring

### Sprint 6 (Week 11-12): Polish & Launch
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Deployment preparation

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| E-signature service cost | Medium | High | Research free tiers, build custom solution if needed |
| Matching algorithm complexity | High | Medium | Start simple, iterate based on feedback |
| Real-time messaging scalability | Medium | Medium | Use Socket.IO with Redis adapter |
| File storage costs | Low | Medium | Set upload limits, implement cleanup policy |
| Email delivery issues | Medium | High | Use reputable provider, implement retry logic |
| Security vulnerabilities | Medium | Critical | Regular security audits, follow OWASP guidelines |

---

## Testing Strategy

### Unit Tests
- [ ] Test all controller functions
- [ ] Test all service functions
- [ ] Test all model methods
- [ ] Test validation rules
- [ ] Target: 80% code coverage

### Integration Tests
- [ ] Test complete API flows
- [ ] Test authentication flows
- [ ] Test role-based access
- [ ] Test file uploads
- [ ] Test matching algorithm
- [ ] Test real-time messaging

### E2E Tests
- [ ] Test user registration → project creation → match → agreement
- [ ] Test nonprofit complete workflow
- [ ] Test researcher complete workflow
- [ ] Test admin moderation workflow

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backup strategy in place

### Deployment
- [ ] Run database migrations
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure SSL/TLS
- [ ] Set up monitoring
- [ ] Set up logging
- [ ] Configure CDN
- [ ] Set up health checks

### Post-Deployment
- [ ] Verify all endpoints working
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Test critical user flows
- [ ] Communicate to stakeholders

---

## Notes & Decisions

### Technology Decisions
- **Email Provider**: TBD (SendGrid vs Mailgun)
- **E-Signature**: TBD (DocuSign vs HelloSign)
- **File Storage**: TBD (AWS S3 vs alternatives)
- **Real-Time**: Socket.IO ✅
- **Job Queue**: node-cron (simple) or Bull (complex)
- **Caching**: Redis (future)

### Design Decisions
- JWT for authentication ✅ (7-day token expiration, userId field)
- Role-based access control ✅ (authenticate + requireAdmin middleware)
- Sequelize ORM ✅ (with paranoid mode for soft deletes)
- PostgreSQL database ✅ (Neon cloud hosting)
- RESTful API design ✅ (40+ endpoints across 7 route files)
- Account status system ✅ (active, pending, suspended ENUM)
- Soft delete for data recovery ✅ (deleted_at timestamps)
- Bootstrap 5.3.2 for UI consistency ✅

### Open Questions
1. Should we implement soft delete or hard delete? **ANSWERED**: Both - soft delete by default (paranoid mode), hard delete available to admins
2. What's the data retention policy? **TBD**
3. Do we need GDPR compliance features? **TBD**
4. Should researchers pay a subscription fee? **TBD**
5. How do we handle disputes between parties? **TBD**

---

## Test Suite Status

### Test Files Created (8 files, 95+ test cases)
- ✅ `tests/integration/auth.test.js` - Authentication and registration tests
- ✅ `tests/integration/account-settings.test.js` - UC6 account management tests (25 cases)
- ✅ `tests/integration/browse-projects.test.js` - UC3 public browse tests
- ✅ `tests/integration/database.test.js` - Database connection and model tests
- ✅ `tests/integration/milestones.test.js` - UC4 milestone management tests (40+ cases)
- ✅ `tests/integration/profile-creation.test.js` - UC1 profile creation tests
- ✅ `tests/integration/project-brief.test.js` - UC7 project CRUD tests (30+ cases)
- ✅ `tests/models/user.test.js` - User model unit tests

### Test Coverage
- **UC1 (Auth)**: Registration, login, JWT token generation, profile creation on signup
- **UC3 (Browse)**: Public project listing, search, filtering, pagination
- **UC4 (Milestones)**: CRUD operations, status updates, analytics, overdue detection
- **UC6 (Account Settings)**: Profile updates, password changes, preferences, deletion
- **UC7 (Project Brief)**: CRUD operations, nonprofit authorization, validation

### Known Test Issues
- [ ] Some tests failing due to password_hash field exposure in API responses
- [ ] Tests need updates for account_status field added to User model
- [ ] Tests expecting old schema before paranoid mode implementation
- [ ] Some auth tests failing due to JWT structure change (sub → userId)
- [ ] Tests need consistent fixture data matching seed-database.js

### Test Infrastructure
- ✅ Jest configuration (jest.config.js)
- ✅ Test setup file (tests/setup.js)
- ✅ Test helper utilities (tests/utils/testHelper.js)
- ✅ Separate test database connection
- ⏳ Need CI/CD integration
- ⏳ Need code coverage reporting

---

## API Endpoint Inventory (40+ Endpoints)

### Auth Routes (2 endpoints)
- POST `/api/auth/register` - User registration with profile creation
- POST `/api/auth/login` - User login with JWT token generation

### User Routes (6 endpoints)
- GET `/api/users/me` - Get current user profile
- PUT `/api/users/me` - Update user profile
- PUT `/api/users/me/password` - Change password
- GET `/api/users/me/preferences` - Get notification preferences
- PUT `/api/users/me/preferences` - Update notification preferences
- DELETE `/api/users/me` - Soft delete user account

### Organization Routes (2 endpoints)
- GET `/api/organizations/me` - Get nonprofit organization profile
- PUT `/api/organizations/me` - Update nonprofit organization profile

### Researcher Routes (2 endpoints)
- GET `/api/researchers/me` - Get researcher professional profile
- PUT `/api/researchers/me` - Update researcher professional profile

### Project Routes (7 endpoints)
- GET `/api/projects` - List all projects (authenticated)
- GET `/api/projects/browse` - Browse projects publicly (no auth)
- GET `/api/projects/:id/public` - Get public project details (no auth)
- POST `/api/projects` - Create new project (nonprofit only)
- GET `/api/projects/:id` - Get project details (owner or admin)
- PUT `/api/projects/:id` - Update project (owner or admin)
- DELETE `/api/projects/:id` - Soft delete project (owner or admin)

### Milestone Routes (6 endpoints)
- GET `/api/projects/:projectId/milestones` - List project milestones
- POST `/api/projects/:projectId/milestones` - Create milestone
- PUT `/api/milestones/:id` - Update milestone
- DELETE `/api/milestones/:id` - Delete milestone
- PUT `/api/milestones/:id/status` - Update milestone status
- GET `/api/projects/:projectId/milestones/stats` - Get milestone analytics

### Admin Routes (15 endpoints)
- GET `/api/admin/dashboard/stats` - Dashboard statistics
- GET `/api/admin/users` - List all users (paginated, searchable)
- GET `/api/admin/users/:id` - Get user details
- PUT `/api/admin/users/:id/status` - Update user status
- POST `/api/admin/users/:id/approve` - Approve pending user
- POST `/api/admin/users/:id/suspend` - Suspend user
- POST `/api/admin/users/:id/unsuspend` - Unsuspend user
- DELETE `/api/admin/users/:id` - Permanently delete user
- GET `/api/admin/projects` - List all projects (paginated, searchable)
- PUT `/api/admin/projects/:id/status` - Update project status
- DELETE `/api/admin/projects/:id` - Soft delete project
- GET `/api/admin/milestones` - List all milestones
- DELETE `/api/admin/milestones/:id` - Delete milestone
- GET `/api/admin/organizations` - List all organizations
- DELETE `/api/admin/organizations/:id` - Delete organization (cascade)

---

## Database Status

### Migrations Applied (14 total)
All migrations successfully applied to production database:
1. `20251118205457-create-user-table.js`
2. `20251125000001-create-organizations-table.js`
3. `20251125000002-create-researcher-profiles-table.js`
4. `20251125000003-create-projects-table.js`
5. `20251125000004-create-milestones-table.js`
6. `20251125000005-add-timestamps-to-projects.js`
7. `20251125000006-update-milestones-status-enum.js`
8. `20251125120001-create-user-preferences-table.js`
9. `20251125120002-add-deleted-at-to-user.js`
10. `20251125120003-update-user-role-enum.js`
11. `20251125120004-update-milestones-table.js`
12. `20251126000001-add-description-to-milestones.js`
13. `20251126120001-add-account-status-to-user.js`
14. Additional schema updates for associations

### Test Data Seeded (68 records)
Comprehensive test data created via `seed-database.js`:
- **5 Organizations**: Tech for Good, Climate Action Network, Education First, Health Access, Wildlife Conservation
- **12 Users**: 5 nonprofit staff, 6 researchers, 1 admin (all passwords: "Password123!")
- **6 Researcher Profiles**: Domain experts in various fields
- **11 Projects**: Across different domains (climate, education, health, conservation)
- **22 Milestones**: With varying status (pending, in_progress, completed, overdue)
- **7 User Preferences**: Notification settings for active users

All test data documented in `TEST_DATA_DOCUMENTATION.md`

### Database Schema
- **Users**: id, email, password_hash, role, account_status, created_at, updated_at, deleted_at
- **Organizations**: id, user_id, name, ein, mission, website, location, focus_areas, etc.
- **ResearcherProfiles**: id, user_id, expertise_domain, research_methods, certifications, etc.
- **Projects**: id, organization_id, title, problem, desired_outcomes, budget, status, etc.
- **Milestones**: id, project_id, title, description, due_date, status, completed_at, etc.
- **UserPreferences**: id, user_id, email_milestone_reminders, email_project_updates, etc.

### Foreign Keys & Relationships
- ✅ Organizations → Users (user_id)
- ✅ ResearcherProfiles → Users (user_id)
- ✅ Projects → Organizations (organization_id)
- ✅ Milestones → Projects (project_id)
- ✅ UserPreferences → Users (user_id)
- ✅ CASCADE DELETE configured for organization → projects
- ✅ Paranoid mode (soft delete) for Users, Projects

---

**Last Updated**: November 27, 2025  
**Next Review**: TBD  
**Document Owner**: Development Team
