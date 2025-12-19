# Database Seed Testing Guide

**Last Updated**: December 2, 2025  
**Database Status**: Fully Seeded with Test Data  
**Purpose**: Guide for using seeded test data to test TRIDENT Match Portal features

---

## 📊 Database Overview

The database has been fully seeded with comprehensive test data for all entities. This allows you to test all features without manually creating data.

### Total Records Created

| Entity | Count | Description |
|--------|-------|-------------|
| **Organizations** | 5 | Nonprofit organizations with different focus areas |
| **Nonprofit Users** | 5 | One user per organization |
| **Researcher Users** | 6 | Researchers from top universities |
| **Researcher Profiles** | 6 | Complete profiles with expertise and rates |
| **Admin Users** | 1 | System administrator |
| **User Preferences** | 12 | Notification settings for all users |
| **Projects** | 11 | Project briefs from nonprofits |
| **Milestones** | 22 | Milestones across various projects |
| **Academic History** | 13 | Education records for researchers |
| **Certifications** | 12 | Professional certifications |
| **Applications/Agreements** | 10 | Collaboration agreements between researchers and orgs |

---

## 🔑 Login Credentials

**All users have the same password**: `Password123!`

### Admin Account
```
Email: admin@trident.org
Role: Admin
Password: Password123!
```

### Nonprofit Accounts

| Email | Organization | Focus Area |
|-------|--------------|------------|
| `sarah.j@childrenshealth.org` | Children's Health Foundation | Healthcare, Children, Education |
| `michael.c@envaction.org` | Environmental Action Alliance | Environment, Sustainability |
| `emily.r@comedu.org` | Community Education Initiative | Education, Technology, Youth |
| `david.t@seniorwellness.org` | Senior Wellness Coalition | Healthcare, Seniors |
| `jennifer.m@urbanhousing.org` | Urban Housing Project | Housing, Social Justice |

### Researcher Accounts

| Email | Affiliation | Expertise | Rate Range |
|-------|-------------|-----------|------------|
| `amanda.foster@stanford.edu` | Stanford University | Public Health, Epidemiology | $75-150/hr |
| `james.liu@mit.edu` | MIT Environmental Lab | Environmental Science, GIS | $100-200/hr |
| `maria.santos@berkeley.edu` | UC Berkeley Education Dept | Educational Technology | $60-120/hr |
| `robert.kim@jhu.edu` | Johns Hopkins School of Nursing | Geriatric Care | $90-180/hr |
| `lisa.anderson@columbia.edu` | Columbia University | Housing Policy, Social Work | $50-100/hr |
| `kevin.patel@harvard.edu` | Harvard School of Public Health | Biostatistics, ML | $120-250/hr |

---

## 📋 Projects Available for Testing

### Children's Health Foundation (3 projects)

1. **Childhood Asthma Intervention Study**
   - Status: OPEN
   - Budget: $15,000
   - Timeline: 6 months
   - Data Sensitivity: High
   - Methods: Quantitative Research, Statistical Analysis

2. **Pediatric Nutrition Database Development**
   - Status: OPEN
   - Budget: $8,000
   - Timeline: 4 months
   - Data Sensitivity: Medium
   - Methods: Database Management, Literature Review

3. **Mental Health Screening Tool Validation**
   - Status: DRAFT
   - Budget: $20,000
   - Timeline: 8 months
   - Data Sensitivity: High
   - Methods: Qualitative Research, Survey Design

### Environmental Action Alliance (2 projects)

4. **Urban Green Space Impact Assessment**
   - Status: OPEN
   - Budget: $25,000
   - Timeline: 12 months
   - Data Sensitivity: Low
   - Methods: Field Research, GIS Mapping

5. **Community Composting Behavior Study**
   - Status: IN_PROGRESS
   - Budget: $5,000
   - Timeline: 3 months
   - Data Sensitivity: Low
   - Methods: Survey Design, Qualitative Research

### Community Education Initiative (2 projects)

6. **Digital Literacy Program Evaluation**
   - Status: OPEN
   - Budget: $12,000
   - Timeline: 5 months
   - Data Sensitivity: Medium
   - Methods: Mixed Methods, User Testing

7. **Virtual Tutoring Platform Optimization**
   - Status: OPEN
   - Budget: $10,000
   - Timeline: 4 months
   - Data Sensitivity: Medium
   - Methods: User Testing, A/B Testing

### Senior Wellness Coalition (2 projects)

8. **Fall Prevention Intervention Trial**
   - Status: OPEN
   - Budget: $30,000
   - Timeline: 10 months
   - Data Sensitivity: High
   - Methods: Clinical Trials, Statistical Analysis

9. **Social Isolation Measurement Tool**
   - Status: DRAFT
   - Budget: $18,000
   - Timeline: 6 months
   - Data Sensitivity: Medium
   - Methods: Survey Design, Psychometrics

### Urban Housing Project (2 projects)

10. **Housing Stability Outcomes Research**
    - Status: OPEN
    - Budget: $35,000
    - Timeline: 18 months
    - Data Sensitivity: High
    - Methods: Case Studies, Ethnography

11. **Affordable Housing Needs Assessment**
    - Status: COMPLETED
    - Budget: $15,000
    - Timeline: 5 months
    - Data Sensitivity: Low
    - Methods: Survey Design, GIS Mapping

---

## 🤝 Researcher Collaborations

Each researcher has existing collaboration agreements that can be viewed in their dashboard:

### Dr. Amanda Foster (Stanford)
- **Current**: Childhood Asthma Intervention Study - Data analysis ($15,000)
- **Completed**: Pediatric mental health screening tool validation ($12,000)

### Dr. James Liu (MIT)
- **Current**: Urban Green Space Impact Assessment ($25,000)
- **Current**: Community Composting - Statistical analysis ($5,000)

### Dr. Maria Santos (UC Berkeley)
- **Current**: Digital Literacy Program Evaluation ($12,000)
- **Completed**: Virtual Tutoring Platform UX Audit ($6,500)

### Dr. Robert Kim (Johns Hopkins)
- **Current**: Fall Prevention Intervention Trial ($30,000)

### Dr. Lisa Anderson (Columbia)
- **Current**: Housing Stability Outcomes Research ($35,000)
- **Completed**: Affordable Housing Needs Assessment ($15,000)

### Dr. Kevin Patel (Harvard)
- **Current**: Community Composting - Advanced statistical modeling ($8,000)

---

## 🎯 Milestones for Testing

Projects have associated milestones in various states:

### Completed Milestones (3)
- Community Composting: Survey Design, Community Survey Distribution
- Housing Needs Assessment: Survey Design, Data Collection, Analysis and Report

### In-Progress Milestones (4)
- Pediatric Nutrition: Literature Review Complete
- Urban Green Space: Site Selection and Baseline Assessment
- Community Composting: Data Analysis
- Fall Prevention Trial: Protocol Development

### Pending Milestones (15)
- Various milestones across multiple projects

---

## 🧪 Testing Scenarios

### 1. Public Project Browsing (UC3)
**Test as**: Unauthenticated user or any role
- Navigate to `/browse` or homepage
- View all 11 projects
- Filter by organization, budget, timeline
- Search by keywords
- View project details

**Expected Results**:
- 11 projects visible
- 3 different statuses: OPEN (7), IN_PROGRESS (1), DRAFT (2), COMPLETED (1)
- Search and filtering work correctly

### 2. Nonprofit Dashboard (UC7)
**Test as**: Any nonprofit account (e.g., `sarah.j@childrenshealth.org`)
- Login and view dashboard
- See organization profile
- View created projects (2-3 per org)
- View project milestones
- Create new project
- Edit existing project

**Expected Results**:
- Profile shows organization details
- Projects Created section shows 2-3 projects
- Milestones visible for each project
- Can create/edit projects

### 3. Researcher Dashboard (Researcher Projects Feature)
**Test as**: Any researcher account (e.g., `amanda.foster@stanford.edu`)
- Login and view dashboard
- Navigate to "Projects Involved" section
- View "Current Participation" tab
- View "Completed" tab

**Expected Results**:
- **Dr. Amanda Foster**: 1 current, 1 completed
- **Dr. James Liu**: 2 current, 0 completed
- **Dr. Maria Santos**: 1 current, 1 completed
- **Dr. Robert Kim**: 1 current, 0 completed
- **Dr. Lisa Anderson**: 1 current, 1 completed
- **Dr. Kevin Patel**: 1 current, 0 completed

Each collaboration shows:
- Agreement type
- Organization name and details
- Budget information
- Status badge (current vs completed)

### 4. Academic Credentials (UC - Academic History)
**Test as**: Any researcher account
- Navigate to Profile section
- View Academic History tab
- See 2-3 degrees listed
- Add new academic record
- Edit existing record
- Delete record

**Expected Results**:
- Each researcher has 2-3 academic records
- CRUD operations work
- PhD, Master's, and Bachelor's degrees visible

### 5. Certifications
**Test as**: Any researcher account
- Navigate to Profile section
- View Certifications tab
- See 2 certifications listed
- Add new certification
- Edit existing certification
- Delete certification

**Expected Results**:
- Each researcher has 2 certifications
- HIPAA, IRB, FERPA, GCP certifications visible
- CRUD operations work

### 6. Milestone Tracking (UC4)
**Test as**: Nonprofit with projects (e.g., `sarah.j@childrenshealth.org`)
- View project with milestones
- See milestone list
- Check milestone status (pending/in_progress/completed)
- Update milestone status
- View milestone analytics

**Expected Results**:
- Asthma Study: 3 pending milestones
- Nutrition Database: 1 in-progress, 1 pending
- Milestone completion tracking works

### 7. Account Settings (UC6)
**Test as**: Any user
- Navigate to Settings
- View profile settings
- Change password
- Update notification preferences
- Update profile information

**Expected Results**:
- All users have UserPreferences records
- Email notifications enabled by default
- In-app notifications enabled
- Profile updates save correctly

### 8. Admin Dashboard
**Test as**: `admin@trident.org`
- View system statistics
- See all 12 users
- See all 5 organizations
- See all 11 projects
- Suspend/activate users
- Delete users (soft delete)
- Moderate content

**Expected Results**:
- System stats show correct counts
- All users, orgs, projects visible
- Admin actions work (suspend, delete, etc.)
- Audit trail logged

---

## 🔄 Re-seeding the Database

If you need to clear and re-seed:

```bash
cd backend

# Option 1: Use the clear script
node clear-data.js

# Option 2: Drop and recreate tables
npm run migrate:undo:all
npm run migrate

# Then re-seed
node seed-database.js
```

**Note**: The seed script now runs in two modes:
- **INITIAL mode**: No data exists, creates everything
- **UPDATE mode**: Data exists, only adds missing records

---

## 📊 Database Relationships

### Key Associations

```
User (1) ←→ (1) ResearcherProfile
User (1) ←→ (1) UserPreferences
User (N) → (1) Organization (for nonprofit users)
Organization (1) → (N) Project
Project (1) → (N) Milestone
ResearcherProfile (1) → (N) Application
Organization (1) → (N) Application
User (1) → (N) AcademicHistory
User (1) → (N) Certification
```

### Testing Relationships

1. **Researcher → Applications → Organizations**
   - Login as researcher
   - View "Projects Involved"
   - See collaborations with different organizations

2. **Organization → Projects → Milestones**
   - Login as nonprofit
   - View Projects Created
   - Click project to see milestones

3. **User → Academic History + Certifications**
   - Login as researcher
   - View Profile → Academic tab
   - View Profile → Certifications tab

---

## 🐛 Troubleshooting

### Issue: Can't see projects in researcher dashboard
**Solution**: 
- Ensure you're logged in as a researcher
- Check that applications exist linking researcher to organizations
- Verify backend endpoint `/api/researchers/me/projects` is working

### Issue: Milestones not showing
**Solution**:
- Milestones are only on projects with ID: 3, 4, 6, 7, 8, 10, 12, 13
- Some projects intentionally have no milestones yet

### Issue: Login fails
**Solution**:
- Verify password is exactly `Password123!` (case-sensitive)
- Check that user account is active (not suspended)
- Clear browser cache/localStorage

### Issue: Empty data after seeding
**Solution**:
- Check terminal output for errors
- Verify DATABASE_URL in `.env` is correct
- Ensure migrations are up to date: `npm run migrate`

---

## 📝 Test Data Summary

### By User Role

**Nonprofits (5)**:
- Each has 1 organization
- Each has 2-3 projects
- Projects have 0-4 milestones each

**Researchers (6)**:
- Each has 1 profile
- Each has 2-3 academic records
- Each has 2 certifications
- Each has 1-2 collaboration agreements

**Admin (1)**:
- Full system access
- Can view all data
- Can moderate content

### By Feature

**UC1 - Authentication**: ✅ 12 test accounts
**UC3 - Browse Projects**: ✅ 11 projects
**UC4 - Milestones**: ✅ 22 milestones across 8 projects
**UC6 - Settings**: ✅ 12 user preference records
**UC7 - Project Creation**: ✅ 11 existing projects
**Researcher Projects**: ✅ 10 collaboration agreements
**Academic Credentials**: ✅ 13 academic records + 12 certifications
**Admin Dashboard**: ✅ Full dataset for moderation

---

## 🎉 Quick Start Testing

1. **Start Backend & Frontend**:
   ```bash
   # Terminal 1
   cd backend
   npm run dev
   
   # Terminal 2
   cd frontend
   npm run dev
   ```

2. **Test Public Browsing**:
   - Go to http://localhost:3000
   - Click "Browse Projects"
   - See 11 projects

3. **Test Researcher Dashboard**:
   - Login as `amanda.foster@stanford.edu` / `Password123!`
   - Navigate to Dashboard
   - Click "Projects Involved"
   - See 2 projects (1 current, 1 completed)

4. **Test Nonprofit Dashboard**:
   - Login as `sarah.j@childrenshealth.org` / `Password123!`
   - View Projects Created
   - See 3 projects
   - Click a project to see milestones

5. **Test Admin Panel**:
   - Login as `admin@trident.org` / `Password123!`
   - View system statistics
   - Browse all users, orgs, projects

---

## 📅 Data Freshness

**Seed Date**: December 2, 2025  
**Application Dates**: October-November 2024  
**Milestone Due Dates**: December 2024 - March 2026  
**Academic Records**: 2011-2020  
**Certifications**: 2021-2023  

**Note**: Dates are realistic and relative to December 2, 2025 for testing time-based features.

---

**Happy Testing! 🚀**

For issues or questions about test data, check the seed file: `backend/seed-database.js`
