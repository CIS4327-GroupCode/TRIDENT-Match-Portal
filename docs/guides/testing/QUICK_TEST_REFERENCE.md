# Quick Test Reference Card

**Password for ALL accounts**: `Password123!`

---

## 🎭 Test Accounts by Role

### 👑 Admin
```
admin@trident.org
```

### 🏢 Nonprofits (5 orgs with projects)
```
sarah.j@childrenshealth.org      → 3 projects, Healthcare focus
michael.c@envaction.org          → 2 projects, Environment focus  
emily.r@comedu.org               → 2 projects, Education focus
david.t@seniorwellness.org       → 2 projects, Seniors focus
jennifer.m@urbanhousing.org      → 2 projects, Housing focus
```

### 👨‍🔬 Researchers (with collaborations)
```
amanda.foster@stanford.edu       → 1 current, 1 completed | Public Health
james.liu@mit.edu                → 2 current, 0 completed | Environmental Science
maria.santos@berkeley.edu        → 1 current, 1 completed | Education
robert.kim@jhu.edu               → 1 current, 0 completed | Geriatric Nursing
lisa.anderson@columbia.edu       → 1 current, 1 completed | Social Work
kevin.patel@harvard.edu          → 1 current, 0 completed | Biostatistics
```

---

## 📊 Data Summary

| Entity | Count | 
|--------|-------|
| Users | 12 |
| Organizations | 5 |
| Projects | 11 |
| Milestones | 22 |
| Collaborations | 13 |
| Academic Records | 13 |
| Certifications | 12 |

---

## 🧪 Quick Tests

### Test Researcher Projects Feature
1. Login: `amanda.foster@stanford.edu` / `Password123!`
2. Go to Dashboard → Projects Involved
3. Should see: 1 current project, 1 completed

### Test Nonprofit Dashboard
1. Login: `sarah.j@childrenshealth.org` / `Password123!`
2. View Projects Created section
3. Should see: 3 projects with milestones

### Test Public Browse
1. Go to: http://localhost:3000/browse
2. Should see: 11 projects
3. Try filters and search

### Test Admin Panel
1. Login: `admin@trident.org` / `Password123!`
2. View all users, orgs, projects
3. Test suspend/delete actions

---

## 📁 Full Documentation

See: `Documentation/DATABASE_SEED_TESTING_GUIDE.md`
