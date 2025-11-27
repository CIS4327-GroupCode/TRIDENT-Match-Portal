# UC4: Manage Project Milestones - API Documentation

**Version**: 1.0  
**Last Updated**: November 26, 2025  
**Base URL**: `/api/projects/:projectId/milestones`

---

## Overview

The Milestone Management API allows nonprofit organizations to create, track, and manage project milestones. Milestones help break down projects into manageable deliverables with due dates and status tracking.

### Key Features
- ✅ CRUD operations for project milestones
- ✅ Status workflow (pending → in_progress → completed/cancelled)
- ✅ Automatic overdue detection
- ✅ Days until due calculation
- ✅ Completion tracking with timestamps
- ✅ Project ownership validation
- ✅ Statistics and progress tracking

### Status Types
| Status | Description |
|--------|-------------|
| `pending` | Not yet started |
| `in_progress` | Currently being worked on |
| `completed` | Finished successfully |
| `cancelled` | Cancelled/abandoned |
| `overdue` | Computed status when past due date |

---

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role Requirements
- **Create/Update/Delete**: Nonprofit role required
- **View**: Any authenticated user can view milestones

---

## Endpoints

### 1. Create Milestone

Create a new milestone for a project.

**Endpoint**: `POST /api/projects/:projectId/milestones`  
**Auth Required**: Yes (Nonprofit only)  
**Role**: `nonprofit`

#### Request Body
```json
{
  "name": "Project Kickoff Meeting",
  "description": "Initial meeting with all stakeholders",
  "due_date": "2025-12-15",
  "status": "pending"
}
```

#### Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Milestone name (1-255 chars) |
| `description` | text | No | Detailed description |
| `due_date` | date (YYYY-MM-DD) | No | Due date (must be today or future) |
| `status` | enum | No | Status (default: `pending`) |

#### Success Response (201)
```json
{
  "message": "Milestone created successfully",
  "milestone": {
    "id": 1,
    "project_id": 42,
    "name": "Project Kickoff Meeting",
    "description": "Initial meeting with all stakeholders",
    "due_date": "2025-12-15",
    "status": "pending",
    "completed_at": null,
    "created_at": "2025-11-26T10:00:00.000Z",
    "updated_at": "2025-11-26T10:00:00.000Z"
  }
}
```

#### Error Responses
```json
// 400 - Missing name
{
  "error": "Milestone name is required"
}

// 400 - Past due date
{
  "error": "Due date must be today or in the future"
}

// 400 - Invalid status
{
  "error": "Invalid status. Must be one of: pending, in_progress, completed, cancelled"
}

// 403 - Unauthorized
{
  "error": "Access denied. You can only create milestones for your organization's projects"
}

// 404 - Project not found
{
  "error": "Project not found"
}
```

---

### 2. List Milestones

Get all milestones for a project with optional filtering.

**Endpoint**: `GET /api/projects/:projectId/milestones`  
**Auth Required**: Yes  
**Role**: Any authenticated user

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (pending, in_progress, completed, cancelled) |
| `overdue` | boolean | Filter for overdue milestones (`true`/`false`) |

#### Success Response (200)
```json
{
  "project_id": 42,
  "count": 3,
  "milestones": [
    {
      "id": 1,
      "project_id": 42,
      "name": "Project Kickoff",
      "description": "Initial meeting",
      "due_date": "2025-12-15",
      "status": "pending",
      "completed_at": null,
      "created_at": "2025-11-26T10:00:00.000Z",
      "updated_at": "2025-11-26T10:00:00.000Z",
      "is_overdue": false,
      "days_until_due": 19,
      "computed_status": "pending"
    },
    {
      "id": 2,
      "project_id": 42,
      "name": "Requirements Gathering",
      "description": "Collect all requirements",
      "due_date": "2025-11-20",
      "status": "in_progress",
      "completed_at": null,
      "created_at": "2025-11-25T10:00:00.000Z",
      "updated_at": "2025-11-26T08:00:00.000Z",
      "is_overdue": true,
      "days_until_due": -6,
      "computed_status": "overdue"
    },
    {
      "id": 3,
      "project_id": 42,
      "name": "First Draft",
      "description": "Complete first draft",
      "due_date": "2025-11-25",
      "status": "completed",
      "completed_at": "2025-11-24T16:30:00.000Z",
      "created_at": "2025-11-20T10:00:00.000Z",
      "updated_at": "2025-11-24T16:30:00.000Z",
      "is_overdue": false,
      "days_until_due": null,
      "computed_status": "completed"
    }
  ]
}
```

#### Computed Fields
| Field | Type | Description |
|-------|------|-------------|
| `is_overdue` | boolean | True if past due date and not completed |
| `days_until_due` | integer | Days remaining (negative if overdue, null if no due date) |
| `computed_status` | string | Shows `overdue` if applicable, otherwise shows actual status |

#### Example Requests
```bash
# Get all milestones
GET /api/projects/42/milestones

# Get only completed milestones
GET /api/projects/42/milestones?status=completed

# Get overdue milestones
GET /api/projects/42/milestones?overdue=true
```

---

### 3. Get Single Milestone

Get details of a specific milestone.

**Endpoint**: `GET /api/projects/:projectId/milestones/:id`  
**Auth Required**: Yes  
**Role**: Any authenticated user

#### Success Response (200)
```json
{
  "milestone": {
    "id": 1,
    "project_id": 42,
    "name": "Project Kickoff",
    "description": "Initial meeting",
    "due_date": "2025-12-15",
    "status": "pending",
    "completed_at": null,
    "created_at": "2025-11-26T10:00:00.000Z",
    "updated_at": "2025-11-26T10:00:00.000Z",
    "is_overdue": false,
    "days_until_due": 19,
    "computed_status": "pending"
  }
}
```

#### Error Responses
```json
// 404 - Not found
{
  "error": "Milestone not found"
}
```

---

### 4. Update Milestone

Update an existing milestone.

**Endpoint**: `PUT /api/projects/:projectId/milestones/:id`  
**Auth Required**: Yes (Nonprofit only)  
**Role**: `nonprofit`

#### Request Body
All fields are optional. Only include fields you want to update.

```json
{
  "name": "Updated Milestone Name",
  "description": "Updated description",
  "due_date": "2025-12-20",
  "status": "in_progress"
}
```

#### Success Response (200)
```json
{
  "message": "Milestone updated successfully",
  "milestone": {
    "id": 1,
    "project_id": 42,
    "name": "Updated Milestone Name",
    "description": "Updated description",
    "due_date": "2025-12-20",
    "status": "in_progress",
    "completed_at": null,
    "created_at": "2025-11-26T10:00:00.000Z",
    "updated_at": "2025-11-26T11:30:00.000Z",
    "is_overdue": false,
    "days_until_due": 24,
    "computed_status": "in_progress"
  }
}
```

#### Special Behavior
- **Status → `completed`**: Automatically sets `completed_at` to current timestamp
- **Status from `completed` → other**: Automatically clears `completed_at` field

#### Error Responses
```json
// 400 - Empty name
{
  "error": "Milestone name cannot be empty"
}

// 400 - Invalid status
{
  "error": "Invalid status. Must be one of: pending, in_progress, completed, cancelled"
}

// 403 - Unauthorized
{
  "error": "Access denied. You can only update milestones for your organization's projects"
}

// 404 - Not found
{
  "error": "Milestone not found"
}
```

---

### 5. Delete Milestone

Delete a milestone permanently.

**Endpoint**: `DELETE /api/projects/:projectId/milestones/:id`  
**Auth Required**: Yes (Nonprofit only)  
**Role**: `nonprofit`

#### Success Response (200)
```json
{
  "message": "Milestone deleted successfully",
  "deleted_id": 1
}
```

#### Error Responses
```json
// 403 - Unauthorized
{
  "error": "Access denied. You can only delete milestones for your organization's projects"
}

// 404 - Not found
{
  "error": "Milestone not found"
}
```

---

### 6. Get Milestone Statistics

Get aggregated statistics for all milestones in a project.

**Endpoint**: `GET /api/projects/:projectId/milestones/stats`  
**Auth Required**: Yes  
**Role**: Any authenticated user

#### Success Response (200)
```json
{
  "project_id": 42,
  "stats": {
    "total": 10,
    "pending": 3,
    "in_progress": 4,
    "completed": 2,
    "cancelled": 1,
    "overdue": 2,
    "completion_rate": 20
  }
}
```

#### Statistics Fields
| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total number of milestones |
| `pending` | integer | Milestones not yet started |
| `in_progress` | integer | Milestones currently being worked on |
| `completed` | integer | Successfully completed milestones |
| `cancelled` | integer | Cancelled milestones |
| `overdue` | integer | Milestones past due date and not completed |
| `completion_rate` | integer | Percentage of completed milestones (0-100) |

---

## Use Cases

### 1. Project Planning
```bash
# Create project milestones
POST /api/projects/42/milestones
{
  "name": "Requirements Gathering",
  "due_date": "2025-12-01",
  "status": "pending"
}

POST /api/projects/42/milestones
{
  "name": "Design Phase",
  "due_date": "2025-12-15",
  "status": "pending"
}

POST /api/projects/42/milestones
{
  "name": "Implementation",
  "due_date": "2026-01-15",
  "status": "pending"
}
```

### 2. Progress Tracking
```bash
# Check project progress
GET /api/projects/42/milestones/stats

# View overdue items
GET /api/projects/42/milestones?overdue=true

# Mark milestone as in progress
PUT /api/projects/42/milestones/1
{
  "status": "in_progress"
}
```

### 3. Completion Workflow
```bash
# Complete a milestone
PUT /api/projects/42/milestones/1
{
  "status": "completed"
}
# This automatically sets completed_at timestamp

# View completed milestones
GET /api/projects/42/milestones?status=completed
```

### 4. Dashboard Integration
```bash
# Get all milestones with computed fields
GET /api/projects/42/milestones

# Display on dashboard:
# - Show overdue in red
# - Show due soon (days_until_due < 7) in yellow
# - Show on track in green
# - Show completion rate from stats endpoint
```

---

## Error Codes

| HTTP Code | Meaning | Common Causes |
|-----------|---------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Milestone created successfully |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions (not nonprofit or wrong org) |
| 404 | Not Found | Project or milestone doesn't exist |
| 500 | Server Error | Unexpected server error |

---

## Best Practices

### 1. Milestone Naming
- Use clear, action-oriented names
- Keep names concise (under 100 chars)
- Be specific about deliverables

**Good Examples**:
- "Complete User Research Interviews"
- "Submit IRB Application"
- "Deliver Final Report"

**Bad Examples**:
- "Phase 1" (too vague)
- "Do stuff" (not actionable)

### 2. Due Dates
- Set realistic due dates
- Leave buffer time for unexpected delays
- Don't set due dates in the past for new milestones
- Update due dates if timeline changes

### 3. Status Management
- Move milestones through proper workflow:
  - `pending` → `in_progress` → `completed`
- Don't jump directly to completed without going through in_progress
- Use `cancelled` for abandoned milestones instead of deleting

### 4. Progress Monitoring
- Check `milestones/stats` regularly
- Address overdue milestones promptly
- Aim for >80% completion rate for healthy projects
- Use `days_until_due` to prioritize work

---

## Security Features

### 1. Organization Isolation
- Users can only manage milestones for their own organization's projects
- Attempts to access other organizations' milestones return 403 Forbidden

### 2. Role-Based Access
- **Nonprofits**: Full CRUD access to their projects' milestones
- **Researchers**: Read-only access (future: when assigned to project)
- **Admins**: Full access to all milestones (future)

### 3. Input Validation
- All text fields are trimmed and validated
- Enum fields (status) are strictly validated
- Date fields are validated for proper format
- SQL injection prevention via Sequelize ORM

---

## Integration Examples

### React Frontend Example
```javascript
// Create milestone
const createMilestone = async (projectId, milestoneData) => {
  const response = await fetch(`/api/projects/${projectId}/milestones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(milestoneData)
  });
  return response.json();
};

// Get milestones with overdue filter
const getOverdueMilestones = async (projectId) => {
  const response = await fetch(
    `/api/projects/${projectId}/milestones?overdue=true`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};

// Update milestone status
const completeMilestone = async (projectId, milestoneId) => {
  const response = await fetch(
    `/api/projects/${projectId}/milestones/${milestoneId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'completed' })
    }
  );
  return response.json();
};
```

---

## Future Enhancements

### Planned Features
- [ ] Email notifications for upcoming due dates
- [ ] Automatic overdue status emails
- [ ] Milestone templates for common project types
- [ ] Dependency tracking between milestones
- [ ] File attachments for milestone deliverables
- [ ] Milestone comments/notes
- [ ] Bulk milestone operations
- [ ] Milestone reordering/prioritization
- [ ] Integration with project timeline view
- [ ] Export milestones to calendar (iCal)

---

## Support

For questions, issues, or feature requests:
- GitHub Issues: [TRIDENT-Match-Portal/issues](https://github.com/CIS4327-GroupCode/TRIDENT-Match-Portal/issues)
- Documentation: See README.md in project root
- Contact: Project team

---

**API Version**: 1.0  
**Last Updated**: November 26, 2025  
**Maintained By**: TRIDENT Development Team
