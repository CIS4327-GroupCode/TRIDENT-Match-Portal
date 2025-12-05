# UC10: Moderate Project Briefs - Implementation Plan

**Status**: Ready to Implement  
**Priority**: High  
**Estimated Effort**: 5-8 hours  
**Dependencies**: UC7 (Complete ✅), Admin Dashboard (Complete ✅)

---

## Overview

Implement admin approval workflow for project briefs before they become visible to researchers. Ensures quality control, taxonomy consistency, and prevents inappropriate content.

---

## Phase 1: Database Changes (30 minutes)

### 1.1 Update Project Status Enum
**File**: Create new migration `20251201000001-update-project-status-enum.js`

**Current statuses**: `draft`, `open`, `in_progress`, `completed`, `cancelled`  
**Add statuses**: 
- `pending_review` - Submitted by nonprofit, awaiting admin review
- `approved` - Admin approved, visible to researchers (same as "open")
- `rejected` - Admin rejected with feedback
- `needs_revision` - Admin requested changes

**Migration SQL**:
```sql
ALTER TYPE enum_project_ideas_status ADD VALUE 'pending_review';
ALTER TYPE enum_project_ideas_status ADD VALUE 'approved';
ALTER TYPE enum_project_ideas_status ADD VALUE 'rejected';
ALTER TYPE enum_project_ideas_status ADD VALUE 'needs_revision';
```

### 1.2 Add Moderation Fields
**File**: Create migration `20251201000002-add-moderation-fields-to-projects.js`

**New columns**:
```sql
ALTER TABLE project_ideas ADD COLUMN rejection_reason TEXT;
ALTER TABLE project_ideas ADD COLUMN admin_feedback TEXT;
ALTER TABLE project_ideas ADD COLUMN reviewed_by INTEGER REFERENCES _user(id);
ALTER TABLE project_ideas ADD COLUMN reviewed_at TIMESTAMP;
```

### 1.3 Update Project Model
**File**: `backend/src/database/models/Project.js`

Add new fields to model definition and update status enum values.

---

## Phase 2: Backend Implementation (2-3 hours)

### 2.1 Update Project Controller
**File**: `backend/src/controllers/projectController.js`

**Changes**:
- Modify `createProject()`: New projects → status = `pending_review` (not `draft`)
- Add validation: Nonprofits can only submit to `pending_review`, not directly to `open`

### 2.2 Extend Admin Controller
**File**: `backend/src/controllers/adminController.js`

**New methods**:

```javascript
/**
 * Get all projects pending review
 * GET /admin/projects/pending
 */
const getPendingProjects = async (req, res) => {
  // Query projects where status = 'pending_review' or 'needs_revision'
  // Include organization details
  // Paginate results
}

/**
 * Approve a project
 * POST /admin/projects/:id/approve
 */
const approveProject = async (req, res) => {
  // Validate project exists and is in pending_review status
  // Update status to 'approved'
  // Set reviewed_by = req.user.id
  // Set reviewed_at = new Date()
  // Log to AuditLog (optional)
  // Send notification to nonprofit (optional)
}

/**
 * Reject a project
 * POST /admin/projects/:id/reject
 */
const rejectProject = async (req, res) => {
  // Validate project exists
  // Require rejection_reason in request body
  // Update status to 'rejected'
  // Store rejection_reason and admin_feedback
  // Set reviewed_by and reviewed_at
  // Log to AuditLog (optional)
  // Send notification to nonprofit (optional)
}

/**
 * Request changes to a project
 * POST /admin/projects/:id/request-changes
 */
const requestProjectChanges = async (req, res) => {
  // Validate project exists
  // Require changes_requested in request body
  // Update status to 'needs_revision'
  // Store admin_feedback with requested changes
  // Set reviewed_by and reviewed_at
  // Notify nonprofit of required changes (optional)
}
```

### 2.3 Update Admin Routes
**File**: `backend/src/routes/adminRoutes.js`

**Add routes**:
```javascript
// Project Moderation
router.get('/projects/pending', adminController.getPendingProjects);
router.post('/projects/:id/approve', adminController.approveProject);
router.post('/projects/:id/reject', adminController.rejectProject);
router.post('/projects/:id/request-changes', adminController.requestProjectChanges);
```

---

## Phase 3: Frontend Implementation (2-3 hours)

### 3.1 Update Admin Dashboard
**File**: `frontend/src/pages/AdminDashboard.jsx`

**Changes**:

1. **Add "Pending Review" tab** (between Projects and Milestones)
2. **Fetch pending projects**:
   ```javascript
   const fetchPendingProjects = async () => {
     const response = await fetch('/api/admin/projects/pending', {
       headers: { Authorization: `Bearer ${token}` }
     });
     const data = await response.json();
     setPendingProjects(data.projects);
   };
   ```

3. **Project Review Card Component**:
   - Display full project details
   - Show organization info
   - Approve button (green) → calls `/api/admin/projects/:id/approve`
   - Reject button (red) → opens modal for rejection reason
   - Request Changes button (yellow) → opens modal for feedback
   - Display submission date

4. **Rejection Modal**:
   - Textarea for rejection reason (required)
   - Textarea for admin feedback
   - Submit → POST to `/api/admin/projects/:id/reject`

5. **Request Changes Modal**:
   - Checklist of common issues:
     - [ ] Title needs clarification
     - [ ] Problem statement unclear
     - [ ] Budget unrealistic
     - [ ] Timeline too short/long
     - [ ] Methods required undefined
     - [ ] Data sensitivity level incorrect
   - Additional feedback textarea
   - Submit → POST to `/api/admin/projects/:id/request-changes`

### 3.2 Update Dashboard Stats
**File**: `frontend/src/pages/AdminDashboard.jsx`

Add "Pending Review" count to Overview tab:
```jsx
<div className="card bg-warning text-dark">
  <div className="card-body">
    <h6>Projects Pending Review</h6>
    <h2>{stats.pending_review_projects}</h2>
  </div>
</div>
```

### 3.3 Update Nonprofit Dashboard
**File**: `frontend/src/pages/Dashboard.jsx` (nonprofit view)

**Changes**:
- Show project status badges with new statuses:
  - `pending_review`: warning badge (yellow)
  - `approved`: success badge (green)
  - `rejected`: danger badge (red)
  - `needs_revision`: info badge (blue)
- For rejected projects: Display rejection_reason
- For needs_revision: Display admin_feedback with requested changes
- Add "Resubmit" button for rejected/needs_revision projects

---

## Phase 4: Testing (1-2 hours)

### 4.1 Integration Tests
**File**: `backend/tests/integration/project-moderation.test.js` (NEW)

**Test cases**:
```javascript
describe('UC10: Project Moderation', () => {
  describe('POST /api/projects (nonprofit)', () => {
    it('should create project with pending_review status', async () => {});
    it('should not allow nonprofit to set status = open', async () => {});
  });

  describe('GET /api/admin/projects/pending', () => {
    it('should return projects pending review (admin only)', async () => {});
    it('should return 403 for non-admin users', async () => {});
    it('should include needs_revision projects', async () => {});
  });

  describe('POST /api/admin/projects/:id/approve', () => {
    it('should approve pending project', async () => {});
    it('should set reviewed_by and reviewed_at', async () => {});
    it('should not approve already approved project', async () => {});
    it('should return 403 for non-admin', async () => {});
  });

  describe('POST /api/admin/projects/:id/reject', () => {
    it('should reject project with reason', async () => {});
    it('should require rejection_reason', async () => {});
    it('should store admin feedback', async () => {});
  });

  describe('POST /api/admin/projects/:id/request-changes', () => {
    it('should set status to needs_revision', async () => {});
    it('should store requested changes', async () => {});
  });

  describe('Project resubmission workflow', () => {
    it('should allow nonprofit to resubmit rejected project', async () => {});
    it('should reset status to pending_review on resubmission', async () => {});
  });
});
```

### 4.2 Manual Testing Checklist
- [ ] Admin can view pending projects
- [ ] Admin can approve project (status → approved)
- [ ] Admin can reject with reason
- [ ] Admin can request changes
- [ ] Nonprofit sees updated status in dashboard
- [ ] Nonprofit can view rejection feedback
- [ ] Nonprofit can resubmit after changes
- [ ] Non-admin cannot access moderation endpoints
- [ ] Status badges display correctly
- [ ] Pagination works for pending list

---

## Phase 5: Documentation (30 minutes)

### 5.1 Update API Documentation
**File**: `backend/UC10_API_DOCUMENTATION.md` (NEW)

Document all 4 new endpoints with:
- Request/response examples
- Error codes
- Status workflow diagram
- Resubmission process

### 5.2 Update Implementation Progress
**File**: `Documentation/IMPLEMENTATION_PROGRESS.md`

Mark UC10 as Complete:
- Update overall progress: 53.8% → 61.5% (8/13)
- Update Phase 2 progress: 67% → 100% (3/3)
- Add completion date
- List all files created/modified

---

## Success Criteria

✅ **Backend**:
- [x] 4 new admin endpoints functional
- [x] Project status enum includes 4 new values
- [x] Moderation fields added to database
- [x] Role-based access control working
- [x] New projects default to pending_review

✅ **Frontend**:
- [x] Pending Review tab in AdminDashboard
- [x] Approve/reject/request changes buttons
- [x] Rejection and feedback modals
- [x] Status badges for new statuses
- [x] Nonprofit can see feedback

✅ **Testing**:
- [x] 15+ integration test cases passing
- [x] Manual testing checklist complete
- [x] No regressions in existing features

✅ **Documentation**:
- [x] API documentation complete
- [x] Implementation progress updated
- [x] Status workflow documented

---

## Future Enhancements (Post-MVP)

- [ ] Email notifications on approval/rejection
- [ ] Taxonomy validation (methods, domains)
- [ ] Bulk approve/reject operations
- [ ] Admin comments/notes on projects
- [ ] Approval history tracking
- [ ] SLA monitoring (projects pending > 3 days)
- [ ] Auto-flag projects for review (keywords, budget)
- [ ] Workflow analytics (avg review time)

---

## Rollout Plan

1. **Deploy database migrations** (run on production DB)
2. **Deploy backend changes** (new endpoints, controllers)
3. **Deploy frontend changes** (AdminDashboard updates)
4. **Update existing draft projects** to pending_review (if any)
5. **Notify admins** of new moderation workflow
6. **Monitor** for first 24 hours

---

## Risk Mitigation

**Risk**: Existing projects in "draft" status  
**Mitigation**: Run migration to convert draft → pending_review for fairness

**Risk**: Nonprofits confused by status change  
**Mitigation**: Add tooltip/help text explaining new approval process

**Risk**: Admin backlog of pending projects  
**Mitigation**: Start with manual notifications, add SLA alerts later

**Risk**: Test failures from status enum changes  
**Mitigation**: Update test fixtures to use new statuses

---

**Ready to implement?** All dependencies are met, infrastructure exists, and scope is well-defined.
