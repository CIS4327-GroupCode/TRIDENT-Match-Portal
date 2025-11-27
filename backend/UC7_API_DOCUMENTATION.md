# UC7: Create Project Brief - API Documentation

## Overview
This document details the API endpoints for managing project briefs in the TRIDENT Match Portal. Nonprofit organizations can create, read, update, and delete project briefs that describe research needs, problems to solve, and collaboration opportunities.

**Base URL**: `/projects`  
**Authentication**: Required (JWT Bearer token)  
**Authorization**: All endpoints require `nonprofit` role

---

## Endpoints

### 1. Create Project
**POST** `/projects`

Create a new project brief for the authenticated nonprofit organization.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Community Health Assessment",
  "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods",
  "outcomes": "Detailed report with actionable recommendations for community health interventions",
  "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews",
  "timeline": "12 months",
  "budget_min": 15000,
  "data_sensitivity": "Medium",
  "status": "draft"
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Project title (max 255 chars) |
| problem | string | No | Description of the problem/need |
| outcomes | string | No | Expected outcomes and deliverables |
| methods_required | string | No | Required research methods and expertise |
| timeline | string | No | Project duration or timeline |
| budget_min | decimal | No | Minimum budget (must be non-negative) |
| data_sensitivity | string | No | Data sensitivity level (e.g., Low, Medium, High) |
| status | string | No | Project status: `draft`, `open`, `in_progress`, `completed`, `cancelled` (default: `draft`) |

#### Success Response (201 Created)
```json
{
  "message": "Project created successfully",
  "project": {
    "project_id": 1,
    "title": "Community Health Assessment",
    "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods",
    "outcomes": "Detailed report with actionable recommendations for community health interventions",
    "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews",
    "timeline": "12 months",
    "budget_min": "15000.00",
    "data_sensitivity": "Medium",
    "status": "draft",
    "org_id": 5,
    "id": null
  }
}
```

#### Error Responses
**400 Bad Request** - Missing or invalid fields
```json
{
  "error": "Project title is required"
}
```

```json
{
  "error": "Budget must be a non-negative number"
}
```

```json
{
  "error": "Status must be one of: draft, open, in_progress, completed, cancelled"
}
```

**401 Unauthorized** - Missing or invalid token
```json
{
  "error": "Authorization header required"
}
```

**403 Forbidden** - User is not nonprofit
```json
{
  "error": "Only nonprofit users can create projects"
}
```

**404 Not Found** - Organization not found
```json
{
  "error": "Organization not found. Please complete your organization profile first."
}
```

---

### 2. Get All Projects
**GET** `/projects`

Retrieve all project briefs for the authenticated nonprofit organization.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status: `draft`, `open`, `in_progress`, `completed`, `cancelled` |

#### Example Requests
```
GET /projects
GET /projects?status=open
```

#### Success Response (200 OK)
```json
{
  "projects": [
    {
      "project_id": 2,
      "title": "Youth Education Program Evaluation",
      "problem": "Need impact assessment of after-school programs",
      "outcomes": "Evaluation report with program effectiveness metrics",
      "methods_required": "Mixed methods evaluation, focus groups",
      "timeline": "6 months",
      "budget_min": "8000.00",
      "data_sensitivity": "Low",
      "status": "open",
      "org_id": 5,
      "id": null
    },
    {
      "project_id": 1,
      "title": "Community Health Assessment",
      "problem": "Need comprehensive analysis of health disparities",
      "outcomes": "Detailed report with actionable recommendations",
      "methods_required": "Survey design, statistical analysis",
      "timeline": "12 months",
      "budget_min": "15000.00",
      "data_sensitivity": "Medium",
      "status": "draft",
      "org_id": 5,
      "id": null
    }
  ]
}
```

#### Error Responses
**401 Unauthorized**
```json
{
  "error": "Authorization header required"
}
```

**403 Forbidden**
```json
{
  "error": "Only nonprofit users can access projects"
}
```

**404 Not Found** - Organization not found
```json
{
  "error": "Organization not found"
}
```

---

### 3. Get Single Project
**GET** `/projects/:id`

Retrieve a specific project brief by ID. Users can only access projects belonging to their organization.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Project ID |

#### Example Request
```
GET /projects/1
```

#### Success Response (200 OK)
```json
{
  "project": {
    "project_id": 1,
    "title": "Community Health Assessment",
    "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods",
    "outcomes": "Detailed report with actionable recommendations for community health interventions",
    "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews",
    "timeline": "12 months",
    "budget_min": "15000.00",
    "data_sensitivity": "Medium",
    "status": "draft",
    "org_id": 5,
    "id": null
  }
}
```

#### Error Responses
**401 Unauthorized**
```json
{
  "error": "Authorization header required"
}
```

**403 Forbidden**
```json
{
  "error": "Only nonprofit users can access projects"
}
```

**404 Not Found** - Project doesn't exist or belongs to another organization
```json
{
  "error": "Project not found"
}
```

---

### 4. Update Project
**PUT** `/projects/:id`

Update an existing project brief. Users can only update projects belonging to their organization.

#### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Project ID |

#### Request Body
All fields are optional. Only include fields you want to update.

```json
{
  "title": "Updated Project Title",
  "status": "open",
  "budget_min": 20000,
  "timeline": "18 months"
}
```

#### Allowed Update Fields
- title
- problem
- outcomes
- methods_required
- timeline
- budget_min
- data_sensitivity
- status

#### Success Response (200 OK)
```json
{
  "message": "Project updated successfully",
  "project": {
    "project_id": 1,
    "title": "Updated Project Title",
    "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods",
    "outcomes": "Detailed report with actionable recommendations for community health interventions",
    "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews",
    "timeline": "18 months",
    "budget_min": "20000.00",
    "data_sensitivity": "Medium",
    "status": "open",
    "org_id": 5,
    "id": null
  }
}
```

#### Error Responses
**400 Bad Request** - Invalid fields
```json
{
  "error": "No valid update fields provided"
}
```

```json
{
  "error": "Project title cannot be empty"
}
```

```json
{
  "error": "Budget must be a non-negative number"
}
```

```json
{
  "error": "Status must be one of: draft, open, in_progress, completed, cancelled"
}
```

**401 Unauthorized**
```json
{
  "error": "Authorization header required"
}
```

**403 Forbidden**
```json
{
  "error": "Only nonprofit users can update projects"
}
```

**404 Not Found**
```json
{
  "error": "Project not found"
}
```

---

### 5. Delete Project
**DELETE** `/projects/:id`

Permanently delete a project brief. Users can only delete projects belonging to their organization.

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Project ID |

#### Example Request
```
DELETE /projects/1
```

#### Success Response (200 OK)
```json
{
  "message": "Project deleted successfully"
}
```

#### Error Responses
**401 Unauthorized**
```json
{
  "error": "Authorization header required"
}
```

**403 Forbidden**
```json
{
  "error": "Only nonprofit users can delete projects"
}
```

**404 Not Found**
```json
{
  "error": "Project not found"
}
```

---

## Project Status Workflow

Projects can have the following statuses:

1. **draft** - Project is being prepared, not visible to researchers
2. **open** - Project is published and accepting applications
3. **in_progress** - Project has started with a matched researcher
4. **completed** - Project has been finished
5. **cancelled** - Project was cancelled before completion

Recommended workflow:
```
draft → open → in_progress → completed
              ↓
           cancelled (from any state)
```

---

## Security Features

### Authentication
- All endpoints require valid JWT token in Authorization header
- Token format: `Bearer <token>`
- Tokens expire after 7 days

### Authorization
- Only users with `nonprofit` role can access these endpoints
- Users can only access projects belonging to their organization
- Attempting to access another organization's projects returns 404 (not 403) to prevent information leakage

### Data Validation
- Title is required and cannot be empty
- Budget must be non-negative if provided
- Status must be one of the predefined values
- String fields are trimmed of whitespace
- All fields have maximum length constraints

---

## Example Use Cases

### Use Case 1: Create and Publish a Project
```javascript
// Step 1: Create draft project
POST /projects
{
  "title": "Community Survey Project",
  "problem": "Need to assess community needs",
  "status": "draft"
}

// Step 2: Update with full details
PUT /projects/1
{
  "outcomes": "Comprehensive needs assessment report",
  "methods_required": "Survey design, data analysis",
  "timeline": "6 months",
  "budget_min": 10000
}

// Step 3: Publish project
PUT /projects/1
{
  "status": "open"
}
```

### Use Case 2: Filter and Retrieve Projects
```javascript
// Get all open projects
GET /projects?status=open

// Get specific project details
GET /projects/1

// Get all projects (any status)
GET /projects
```

### Use Case 3: Project Lifecycle Management
```javascript
// Mark project as in progress
PUT /projects/1
{
  "status": "in_progress"
}

// Complete the project
PUT /projects/1
{
  "status": "completed"
}

// Or cancel if needed
PUT /projects/1
{
  "status": "cancelled"
}
```

---

## Error Code Reference

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Testing

Complete test suite available in:
`backend/tests/integration/project-brief.test.js`

Tests cover:
- ✅ Creating projects with various field combinations
- ✅ Validation for required fields
- ✅ Budget and status validation
- ✅ Retrieving all projects
- ✅ Filtering by status
- ✅ Retrieving individual projects
- ✅ Updating projects (partial and full updates)
- ✅ Deleting projects
- ✅ Authorization checks (role-based and organization-based)
- ✅ Error handling

Run tests:
```bash
npm test -- project-brief.test.js
```

---

## Notes

1. **Organization Requirement**: Users must have completed their organization profile before creating projects
2. **Soft Delete**: Projects are permanently deleted (no soft delete)
3. **Ordering**: Projects are returned in descending order by project_id (most recent first)
4. **Budget**: Stored as DECIMAL(10,2) in database, allowing up to 99,999,999.99
5. **Future Enhancements**: 
   - Attachments/documents
   - Project tags/categories
   - Application management
   - Matching algorithm integration
