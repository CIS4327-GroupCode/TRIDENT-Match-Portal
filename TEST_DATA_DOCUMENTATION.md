# Test Data Documentation

## Overview
This document provides comprehensive information about the dummy data populated in the TRIDENT Match Portal database for testing and demonstration purposes.

**Last Updated:** November 26, 2025  
**Seeding Script:** `backend/seed-database.js`

---

## Universal Login Credentials

**All user accounts share the same password for testing convenience:**
```
Password: Password123!
```

---

## 1. Organizations (5 Total)

### 1.1 Children's Health Foundation
- **EIN:** 12-3456789
- **Mission:** Improving pediatric healthcare access in underserved communities
- **Focus Tags:** Healthcare, Children, Education
- **Compliance:** HIPAA, FERPA
- **Contact:** contact@childrenshealth.org
- **Projects:** 3 (Asthma Study, Nutrition Database, Mental Health Screening)
- **User:** Sarah Johnson (sarah.j@childrenshealth.org)

### 1.2 Environmental Action Alliance
- **EIN:** 23-4567890
- **Mission:** Protecting local ecosystems and promoting sustainable practices
- **Focus Tags:** Environment, Sustainability, Conservation
- **Compliance:** EPA
- **Contact:** info@envaction.org
- **Projects:** 2 (Urban Green Space, Community Composting)
- **User:** Michael Chen (michael.c@envaction.org)

### 1.3 Community Education Initiative
- **EIN:** 34-5678901
- **Mission:** Bridging the education gap through technology and mentorship
- **Focus Tags:** Education, Technology, Youth
- **Compliance:** FERPA, COPPA
- **Contact:** hello@comedu.org
- **Projects:** 2 (Digital Literacy, Virtual Tutoring)
- **User:** Emily Rodriguez (emily.r@comedu.org)

### 1.4 Senior Wellness Coalition
- **EIN:** 45-6789012
- **Mission:** Enhancing quality of life for senior citizens through health programs
- **Focus Tags:** Healthcare, Seniors, Community
- **Compliance:** HIPAA
- **Contact:** support@seniorwellness.org
- **Projects:** 2 (Fall Prevention, Social Isolation Tool)
- **User:** David Thompson (david.t@seniorwellness.org)

### 1.5 Urban Housing Project
- **EIN:** 56-7890123
- **Mission:** Providing affordable housing solutions for low-income families
- **Focus Tags:** Housing, Social Justice, Community
- **Compliance:** HUD
- **Contact:** info@urbanhousing.org
- **Projects:** 2 (Housing Stability, Housing Needs Assessment)
- **User:** Jennifer Martinez (jennifer.m@urbanhousing.org)

---

## 2. Users (12 Total)

### 2.1 Admin Users (1)
| Name | Email | Role | Notes |
|------|-------|------|-------|
| System Administrator | admin@trident.org | admin | Platform administrator |

### 2.2 Nonprofit Users (5)
| Name | Email | Role | Organization | Projects |
|------|-------|------|--------------|----------|
| Sarah Johnson | sarah.j@childrenshealth.org | nonprofit | Children's Health Foundation | 3 |
| Michael Chen | michael.c@envaction.org | nonprofit | Environmental Action Alliance | 2 |
| Emily Rodriguez | emily.r@comedu.org | nonprofit | Community Education Initiative | 2 |
| David Thompson | david.t@seniorwellness.org | nonprofit | Senior Wellness Coalition | 2 |
| Jennifer Martinez | jennifer.m@urbanhousing.org | nonprofit | Urban Housing Project | 2 |

### 2.3 Researcher Users (6)
| Name | Email | Role | Affiliation | Expertise |
|------|-------|------|-------------|-----------|
| Dr. Amanda Foster | amanda.foster@stanford.edu | researcher | Stanford University | Public Health, Epidemiology |
| Dr. James Liu | james.liu@mit.edu | researcher | MIT Environmental Lab | Environmental Science, GIS |
| Dr. Maria Santos | maria.santos@berkeley.edu | researcher | UC Berkeley Education Dept | Educational Technology |
| Dr. Robert Kim | robert.kim@jhu.edu | researcher | Johns Hopkins Nursing | Geriatric Care, Health Outcomes |
| Dr. Lisa Anderson | lisa.anderson@columbia.edu | researcher | Columbia Social Work | Housing Policy, Community Dev |
| Dr. Kevin Patel | kevin.patel@harvard.edu | researcher | Harvard T.H. Chan School | Biostatistics, Machine Learning |

---

## 3. Researcher Profiles (6 Total)

### 3.1 Dr. Amanda Foster (Stanford)
- **Expertise:** Public Health, Epidemiology, Data Analysis
- **Methods:** Quantitative Research, Statistical Analysis, Survey Design
- **Certifications:** HIPAA, IRB Certified
- **Availability:** 20 hours/week
- **Rate:** $75-150/hour
- **Best Match For:** Projects 1, 3, 8, 11 (health-related studies)

### 3.2 Dr. James Liu (MIT)
- **Expertise:** Environmental Science, GIS Mapping, Climate Change
- **Methods:** Field Research, Remote Sensing, Data Visualization
- **Certifications:** EPA Certified
- **Availability:** 15 hours/week
- **Rate:** $100-200/hour
- **Best Match For:** Projects 4, 11 (environmental and GIS projects)

### 3.3 Dr. Maria Santos (UC Berkeley)
- **Expertise:** Educational Technology, Learning Analytics, Curriculum Design
- **Methods:** Qualitative Research, Mixed Methods, User Testing
- **Certifications:** FERPA, CITI Training
- **Availability:** 25 hours/week
- **Rate:** $60-120/hour
- **Best Match For:** Projects 6, 7 (education technology projects)

### 3.4 Dr. Robert Kim (Johns Hopkins)
- **Expertise:** Geriatric Care, Health Outcomes, Quality Improvement
- **Methods:** Clinical Trials, Observational Studies, Meta-Analysis
- **Certifications:** HIPAA, GCP Certified
- **Availability:** 10 hours/week
- **Rate:** $90-180/hour
- **Best Match For:** Projects 8, 9 (senior health projects)

### 3.5 Dr. Lisa Anderson (Columbia)
- **Expertise:** Housing Policy, Social Determinants of Health, Community Development
- **Methods:** Case Studies, Ethnography, Community-Based Research
- **Certifications:** IRB, Human Subjects Research
- **Availability:** 30 hours/week
- **Rate:** $50-100/hour
- **Best Match For:** Projects 10, 11 (housing and community projects)

### 3.6 Dr. Kevin Patel (Harvard)
- **Expertise:** Biostatistics, Machine Learning, Predictive Modeling
- **Methods:** Statistical Modeling, R/Python Programming, Database Management
- **Certifications:** HIPAA, Data Security Certified
- **Availability:** 18 hours/week
- **Rate:** $120-250/hour
- **Best Match For:** Projects 1, 2, 6, 7 (data-intensive projects)

---

## 4. Projects (11 Total)

### Status Breakdown:
- **Open:** 8 projects
- **In Progress:** 1 project
- **Draft:** 2 projects
- **Completed:** 1 project

### 4.1 Project #1: Childhood Asthma Intervention Study
- **Organization:** Children's Health Foundation
- **Status:** Open
- **Timeline:** 6 months
- **Budget:** $15,000+
- **Data Sensitivity:** High
- **Methods Required:** Quantitative Research, Statistical Analysis, Survey Design
- **Problem:** High rates of asthma in urban children due to air quality
- **Outcomes:** Reduce asthma hospitalizations by 30%
- **Milestones:** 3 (IRB Submission, Recruitment, Baseline Data)
- **Best Matches:** Dr. Amanda Foster, Dr. Kevin Patel

### 4.2 Project #2: Pediatric Nutrition Database Development
- **Organization:** Children's Health Foundation
- **Status:** Open
- **Timeline:** 4 months
- **Budget:** $8,000+
- **Data Sensitivity:** Medium
- **Methods Required:** Database Management, Literature Review, Data Visualization
- **Problem:** Need comprehensive nutrition intervention database
- **Outcomes:** Create searchable evidence-based database
- **Milestones:** 2 (Literature Review, Database Schema)
- **Best Matches:** Dr. Kevin Patel, Dr. Amanda Foster

### 4.3 Project #3: Mental Health Screening Tool Validation
- **Organization:** Children's Health Foundation
- **Status:** Draft
- **Timeline:** 8 months
- **Budget:** $20,000+
- **Data Sensitivity:** High
- **Methods Required:** Qualitative Research, Survey Design, Statistical Analysis
- **Problem:** Screening tools not culturally appropriate
- **Outcomes:** Validate culturally-adapted screening tool
- **Milestones:** 0
- **Best Matches:** Dr. Amanda Foster, Dr. Maria Santos

### 4.4 Project #4: Urban Green Space Impact Assessment
- **Organization:** Environmental Action Alliance
- **Status:** Open
- **Timeline:** 12 months
- **Budget:** $25,000+
- **Data Sensitivity:** Low
- **Methods Required:** Field Research, GIS Mapping, Statistical Analysis
- **Problem:** Unknown impact of parks on biodiversity and air quality
- **Outcomes:** Measure environmental and community health benefits
- **Milestones:** 3 (Site Selection, Air Monitors, Biodiversity Survey)
- **Best Matches:** Dr. James Liu

### 4.5 Project #5: Community Composting Behavior Study
- **Organization:** Environmental Action Alliance
- **Status:** In Progress
- **Timeline:** 3 months
- **Budget:** $5,000+
- **Data Sensitivity:** Low
- **Methods Required:** Survey Design, Qualitative Research, Data Analysis
- **Problem:** Low composting adoption despite free bins
- **Outcomes:** Identify barriers and motivators
- **Milestones:** 4 (2 completed, 1 in progress, 1 pending)
- **Best Matches:** Dr. Maria Santos, Dr. Lisa Anderson

### 4.6 Project #6: Digital Literacy Program Evaluation
- **Organization:** Community Education Initiative
- **Status:** Open
- **Timeline:** 5 months
- **Budget:** $12,000+
- **Data Sensitivity:** Medium
- **Methods Required:** Mixed Methods, User Testing, Statistical Analysis
- **Problem:** Need to assess coding bootcamp effectiveness
- **Outcomes:** Evaluate learning outcomes and skill retention
- **Milestones:** 2 (Evaluation Framework, Pre-Assessments)
- **Best Matches:** Dr. Maria Santos

### 4.7 Project #7: Virtual Tutoring Platform Optimization
- **Organization:** Community Education Initiative
- **Status:** Open
- **Timeline:** 4 months
- **Budget:** $10,000+
- **Data Sensitivity:** Medium
- **Methods Required:** User Testing, Data Visualization, A/B Testing
- **Problem:** High dropout rates in online tutoring
- **Outcomes:** UX improvements to increase engagement
- **Milestones:** 0
- **Best Matches:** Dr. Maria Santos, Dr. Kevin Patel

### 4.8 Project #8: Fall Prevention Intervention Trial
- **Organization:** Senior Wellness Coalition
- **Status:** Open
- **Timeline:** 10 months
- **Budget:** $30,000+
- **Data Sensitivity:** High
- **Methods Required:** Clinical Trials, Statistical Analysis, Observational Studies
- **Problem:** High fall rates among independent seniors
- **Outcomes:** Test balance training program effectiveness
- **Milestones:** 3 (Protocol, Recruitment, Baseline Testing)
- **Best Matches:** Dr. Robert Kim, Dr. Amanda Foster

### 4.9 Project #9: Social Isolation Measurement Tool
- **Organization:** Senior Wellness Coalition
- **Status:** Draft
- **Timeline:** 6 months
- **Budget:** $18,000+
- **Data Sensitivity:** Medium
- **Methods Required:** Survey Design, Statistical Analysis, Psychometrics
- **Problem:** No validated social isolation tool for elderly
- **Outcomes:** Develop validated assessment tool
- **Milestones:** 0
- **Best Matches:** Dr. Robert Kim, Dr. Amanda Foster

### 4.10 Project #10: Housing Stability Outcomes Research
- **Organization:** Urban Housing Project
- **Status:** Open
- **Timeline:** 18 months
- **Budget:** $35,000+
- **Data Sensitivity:** High
- **Methods Required:** Case Studies, Ethnography, Longitudinal Analysis
- **Problem:** Need evidence of housing impact on family outcomes
- **Outcomes:** Document long-term health and education effects
- **Milestones:** 2 (Identify Families, Initial Interviews)
- **Best Matches:** Dr. Lisa Anderson

### 4.11 Project #11: Affordable Housing Needs Assessment
- **Organization:** Urban Housing Project
- **Status:** Completed
- **Timeline:** 5 months
- **Budget:** $15,000+
- **Data Sensitivity:** Low
- **Methods Required:** Survey Design, GIS Mapping, Statistical Analysis
- **Problem:** Outdated housing needs data
- **Outcomes:** Comprehensive demand and gap assessment
- **Milestones:** 3 (all completed)
- **Best Matches:** Dr. Lisa Anderson, Dr. James Liu

---

## 5. Milestones (22 Total)

### Status Breakdown:
- **Pending:** 15 milestones
- **In Progress:** 4 milestones
- **Completed:** 5 milestones
- **Cancelled:** 0 milestones

### Milestone Timeline Summary:

#### Overdue Milestones:
*None currently*

#### Due Within 2 Weeks:
1. **Project 1 - IRB Approval Submission** (14 days)

#### Due Within 1 Month:
2. **Project 2 - Literature Review Complete** (30 days)
3. **Project 4 - Site Selection** (21 days)
4. **Project 6 - Evaluation Framework** (20 days)
5. **Project 8 - Protocol Development** (25 days)
6. **Project 10 - Identify Families** (30 days)

#### Completed Milestones:
- Project 5: Survey Design (completed 12 days ago)
- Project 5: Survey Distribution (completed 5 days ago)
- Project 11: Survey Design (completed 125 days ago)
- Project 11: Data Collection (completed 65 days ago)
- Project 11: Analysis and Report (completed 12 days ago)

### Detailed Milestone Breakdown by Project:

#### Project 1: Childhood Asthma Study (3 milestones)
1. ⏳ **IRB Approval Submission** - Due in 14 days - Pending
2. ⏳ **Recruit Study Participants** - Due in 60 days - Pending
3. ⏳ **Baseline Data Collection** - Due in 90 days - Pending

#### Project 2: Pediatric Nutrition Database (2 milestones)
1. 🔄 **Literature Review Complete** - Due in 30 days - In Progress
2. ⏳ **Database Schema Design** - Due in 45 days - Pending

#### Project 4: Urban Green Space Assessment (3 milestones)
1. 🔄 **Site Selection and Baseline** - Due in 21 days - In Progress
2. ⏳ **Install Air Quality Monitors** - Due in 45 days - Pending
3. ⏳ **Biodiversity Survey Round 1** - Due in 90 days - Pending

#### Project 5: Community Composting Study (4 milestones)
1. ✅ **Survey Design and Testing** - Completed 12 days ago
2. ✅ **Community Survey Distribution** - Completed 5 days ago
3. 🔄 **Data Analysis** - Due in 15 days - In Progress
4. ⏳ **Final Report Delivery** - Due in 30 days - Pending

#### Project 6: Digital Literacy Evaluation (2 milestones)
1. ⏳ **Evaluation Framework Design** - Due in 20 days - Pending
2. ⏳ **Pre-Program Assessments** - Due in 40 days - Pending

#### Project 8: Fall Prevention Trial (3 milestones)
1. 🔄 **Protocol Development** - Due in 25 days - In Progress
2. ⏳ **Recruit Senior Participants** - Due in 60 days - Pending
3. ⏳ **Baseline Balance Testing** - Due in 75 days - Pending

#### Project 10: Housing Stability Research (2 milestones)
1. ⏳ **Identify Case Study Families** - Due in 30 days - Pending
2. ⏳ **Initial Interviews** - Due in 90 days - Pending

#### Project 11: Housing Needs Assessment (3 milestones - All Completed)
1. ✅ **Survey Design** - Completed 125 days ago
2. ✅ **Data Collection** - Completed 65 days ago
3. ✅ **Analysis and Report** - Completed 12 days ago

---

## 6. User Preferences (12 Total)

All users have the following default preferences:

### Email Notifications (All Enabled):
- ✅ New Matches
- ✅ Messages
- ✅ Milestones
- ✅ Project Updates
- ✅ Weekly Digest
- ✅ Applications
- ✅ Agreements

### In-App Notifications (All Enabled):
- ✅ New Matches
- ✅ Messages
- ✅ Milestones
- ✅ Project Updates

---

## 7. Data Relationships & Connections

### Organization → User Relationship:
```
Children's Health Foundation
  └── Sarah Johnson (nonprofit)

Environmental Action Alliance
  └── Michael Chen (nonprofit)

Community Education Initiative
  └── Emily Rodriguez (nonprofit)

Senior Wellness Coalition
  └── David Thompson (nonprofit)

Urban Housing Project
  └── Jennifer Martinez (nonprofit)
```

### Organization → Project Relationship:
```
Children's Health Foundation (3 projects)
  ├── Project 1: Asthma Study (open, 3 milestones)
  ├── Project 2: Nutrition Database (open, 2 milestones)
  └── Project 3: Mental Health Tool (draft, 0 milestones)

Environmental Action Alliance (2 projects)
  ├── Project 4: Green Space Assessment (open, 3 milestones)
  └── Project 5: Composting Study (in_progress, 4 milestones)

Community Education Initiative (2 projects)
  ├── Project 6: Digital Literacy Eval (open, 2 milestones)
  └── Project 7: Tutoring Platform (open, 0 milestones)

Senior Wellness Coalition (2 projects)
  ├── Project 8: Fall Prevention (open, 3 milestones)
  └── Project 9: Social Isolation Tool (draft, 0 milestones)

Urban Housing Project (2 projects)
  ├── Project 10: Housing Stability (open, 2 milestones)
  └── Project 11: Needs Assessment (completed, 3 milestones)
```

### Researcher → Project Matching:
```
Dr. Amanda Foster (Public Health)
  → Best for: Projects 1, 3, 8, 9 (healthcare studies)

Dr. James Liu (Environmental Science)
  → Best for: Projects 4, 11 (environmental/GIS)

Dr. Maria Santos (Education Technology)
  → Best for: Projects 5, 6, 7 (education/UX)

Dr. Robert Kim (Geriatric Care)
  → Best for: Projects 8, 9 (senior health)

Dr. Lisa Anderson (Housing Policy)
  → Best for: Projects 5, 10, 11 (housing/community)

Dr. Kevin Patel (Biostatistics)
  → Best for: Projects 1, 2, 6, 7 (data science)
```

---

## 8. Testing Scenarios

### 8.1 Authentication Testing
**Test different user roles:**
- Admin: admin@trident.org
- Nonprofit: sarah.j@childrenshealth.org
- Researcher: amanda.foster@stanford.edu

### 8.2 Project Browsing & Search Testing
**Search by different criteria:**
- Status: "open" (8 results), "in_progress" (1 result), "draft" (2 results), "completed" (1 result)
- Budget: Projects range from $5k to $35k
- Sensitivity: Low (3), Medium (5), High (5)
- Methods: Search for "Statistical Analysis" (7 matches)

### 8.3 Milestone Management Testing
**Test different scenarios:**
- View upcoming milestones (15 pending)
- Update milestone status (4 in progress)
- Check overdue milestones (none currently)
- View completion statistics (Project 5: 50%, Project 11: 100%)

### 8.4 Organization Management Testing
**Test access control:**
- Login as Sarah Johnson → See only CHF projects
- Login as Michael Chen → See only EAA projects
- Login as researcher → See all open projects

### 8.5 User Settings Testing
**Test preference updates:**
- Toggle email notifications
- Toggle in-app notifications
- Update profile information

### 8.6 Cross-Organization Testing
**Verify isolation:**
- Emily (CEI) should NOT be able to edit Michael's (EAA) projects
- Each nonprofit only sees their own organization's data
- Researchers can view all open projects

### 8.7 Matching Algorithm Testing
**Test researcher-project matches:**
- Project 1 (Asthma) should match with Dr. Foster (Public Health)
- Project 4 (Green Space) should match with Dr. Liu (Environmental)
- Project 6 (Digital Literacy) should match with Dr. Santos (Education)

### 8.8 Project Lifecycle Testing
**Test full workflow:**
- Create new project (as nonprofit)
- Add milestones
- Update milestone status
- Complete milestones
- Mark project as completed

### 8.9 Timeline Testing
**Projects at different stages:**
- Project 11: Completed (good for historical data testing)
- Project 5: In Progress (good for active workflow testing)
- Projects 3 & 9: Draft (good for approval workflow testing)
- Projects 1, 2, 4, 6, 7, 8, 10: Open (good for browsing/matching testing)

---

## 9. Running the Seeding Script

### Prerequisites:
1. Database migrations must be run first
2. `.env` file must be configured with DATABASE_URL
3. All dependencies installed (`npm install`)

### Execute Seeding:
```bash
cd backend
node seed-database.js
```

### Expected Output:
```
🌱 Starting database seeding...

📋 Step 1: Creating Organizations...
✓ Created 5 organizations

👥 Step 2: Creating Nonprofit Users...
✓ Created 5 nonprofit users

🔬 Step 3: Creating Researchers...
✓ Created 6 researcher profiles

👨‍🔬 Step 4: Creating Researcher User Accounts...
✓ Created 6 researcher user accounts

👑 Step 5: Creating Admin User...
✓ Created admin user

⚙️ Step 6: Creating User Preferences...
✓ Created 12 user preference records

📊 Step 7: Creating Projects...
✓ Created 11 projects

🎯 Step 8: Creating Milestones...
✓ Created 22 milestones

✅ Database seeding completed successfully!
```

### Clearing Data:
To re-seed the database, you'll need to clear existing data first. You can either:
1. Drop and recreate the database
2. Delete records in reverse dependency order (milestones → projects → users → organizations)

---

## 10. Notes & Considerations

### Data Integrity:
- All foreign key relationships are properly maintained
- Cascading deletes are configured (deleting org deletes its users/projects)
- ENUM types match database schema exactly

### Realistic Data:
- Email addresses follow realistic patterns (org-specific domains)
- Budget ranges reflect typical nonprofit research projects
- Timelines vary from 3-18 months
- Expertise and methods align with real academic specializations

### Test Coverage:
This seed data enables testing of:
- ✅ UC1: Authentication (all user types)
- ✅ UC3: Browse & Search Projects (11 projects with varied criteria)
- ✅ UC4: Manage Milestones (22 milestones across lifecycle)
- ✅ UC6: Account Settings (12 users with preferences)
- ✅ UC7: Create Project Briefs (examples in multiple states)
- ⏳ UC2: Messaging (once implemented)
- ⏳ UC8/9: Matching (researcher profiles ready)
- ⏳ UC10: Moderation (draft projects ready for approval)

### Future Enhancements:
When additional use cases are implemented, consider adding:
- Messages between users
- Match records linking researchers to projects
- Agreement documents
- File uploads
- Reviews and ratings
- Admin action logs

---

## 11. Quick Reference

### Login Shortcuts:
```
Admin:      admin@trident.org
Nonprofit:  sarah.j@childrenshealth.org
Researcher: amanda.foster@stanford.edu
Password:   Password123!
```

### API Testing Endpoints:
```
GET /api/projects                    → 11 projects
GET /api/projects?status=open        → 8 projects
GET /api/projects/1/milestones       → 3 milestones
GET /api/projects/5/milestones/stats → In-progress stats
GET /api/users/preferences           → User preferences
GET /api/organizations               → 5 organizations
```

### Database Record Counts:
| Table | Count |
|-------|-------|
| organizations | 5 |
| users | 12 |
| researcher_profiles | 6 |
| user_preferences | 12 |
| project_ideas | 11 |
| milestones | 22 |
| **TOTAL** | **68** |

---

**End of Documentation**
