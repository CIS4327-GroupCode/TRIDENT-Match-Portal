# UC3: Browse & Search Projects - API Documentation

## Overview
This document details the API endpoints for browsing and searching publicly available project briefs in the TRIDENT Match Portal. These endpoints allow researchers (and other users) to discover project opportunities posted by nonprofit organizations.

**Base URL**: `/projects/browse`  
**Authentication**: Not required (public access)

---

## Endpoints

### 1. Browse Projects with Search & Filters
**GET** `/projects/browse`

Browse all open project briefs with optional search and filtering capabilities. Supports pagination for large result sets.

#### Headers
```
Content-Type: application/json
```
*Note: No authentication required - public endpoint*

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search keyword (searches in title, problem, outcomes, methods_required) |
| methods | string | No | Filter by required methods (partial, case-insensitive match) |
| budget_min | number | No | Minimum budget filter (projects with budget >= this value) |
| budget_max | number | No | Maximum budget filter (projects with budget <= this value) |
| data_sensitivity | string | No | Filter by data sensitivity level: `Low`, `Medium`, `High` |
| timeline | string | No | Filter by timeline (partial, case-insensitive match) |
| page | integer | No | Page number for pagination (default: 1) |
| limit | integer | No | Results per page (default: 20) |

#### Example Requests
```
GET /projects/browse
GET /projects/browse?search=health
GET /projects/browse?methods=statistical%20analysis
GET /projects/browse?budget_min=10000&budget_max=50000
GET /projects/browse?data_sensitivity=Medium
GET /projects/browse?search=education&budget_min=5000&page=1&limit=10
```

#### Success Response (200 OK)
```json
{
  "projects": [
    {
      "project_id": 5,
      "title": "Community Health Assessment",
      "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods",
      "outcomes": "Detailed report with actionable recommendations for community health interventions",
      "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews",
      "timeline": "12 months",
      "budget_min": "15000.00",
      "data_sensitivity": "High",
      "status": "open",
      "org_id": 3,
      "id": null,
      "organization": {
        "id": 3,
        "name": "Health First Organization",
        "type": "nonprofit",
        "location": "San Francisco, CA",
        "focus_areas": ["Health", "Community Development"]
      }
    },
    {
      "project_id": 4,
      "title": "Youth Education Program Evaluation",
      "problem": "Evaluate effectiveness of after-school programs",
      "outcomes": "Impact assessment report with program improvement recommendations",
      "methods_required": "Mixed methods evaluation, focus groups, surveys",
      "timeline": "6 months",
      "budget_min": "8000.00",
      "data_sensitivity": "Medium",
      "status": "open",
      "org_id": 2,
      "id": null,
      "organization": {
        "id": 2,
        "name": "Education Access Network",
        "type": "nonprofit",
        "location": "Boston, MA",
        "focus_areas": ["Education", "Youth Development"]
      }
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

#### Field Descriptions

**Project Fields:**
| Field | Type | Description |
|-------|------|-------------|
| project_id | integer | Unique project identifier |
| title | string | Project title |
| problem | string | Problem statement or need description |
| outcomes | string | Expected outcomes and deliverables |
| methods_required | string | Required research methods and expertise |
| timeline | string | Project duration or timeline |
| budget_min | decimal | Minimum budget (formatted as string) |
| data_sensitivity | string | Data sensitivity level |
| status | string | Always "open" for public browse |
| org_id | integer | Organization ID |
| organization | object | Nested organization details |

**Organization Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Organization identifier |
| name | string | Organization name |
| type | string | Organization type |
| location | string | Organization location |
| focus_areas | array | Organization's focus areas |

**Pagination Object:**
| Field | Type | Description |
|-------|------|-------------|
| total | integer | Total number of matching projects |
| page | integer | Current page number |
| limit | integer | Results per page |
| totalPages | integer | Total number of pages |

#### Empty Results (200 OK)
```json
{
  "projects": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

#### Error Responses
**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

### 2. Get Public Project Details
**GET** `/projects/browse/:id`

Retrieve detailed information about a specific public project, including full organization details.

#### Headers
```
Content-Type: application/json
```
*Note: No authentication required - public endpoint*

#### URL Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Project ID |

#### Example Request
```
GET /projects/browse/5
```

#### Success Response (200 OK)
```json
{
  "project": {
    "project_id": 5,
    "title": "Community Health Assessment",
    "problem": "Need comprehensive analysis of health disparities in low-income neighborhoods to inform targeted interventions",
    "outcomes": "Detailed report with actionable recommendations for community health interventions, including data visualizations and statistical analysis",
    "methods_required": "Survey design, statistical analysis, GIS mapping, qualitative interviews, community engagement",
    "timeline": "12 months",
    "budget_min": "15000.00",
    "data_sensitivity": "High",
    "status": "open",
    "org_id": 3,
    "id": null,
    "organization": {
      "id": 3,
      "name": "Health First Organization",
      "type": "nonprofit",
      "location": "San Francisco, CA",
      "mission": "Improving community health outcomes through research-driven interventions and advocacy",
      "focus_areas": ["Health", "Community Development", "Social Justice"],
      "website": "https://healthfirst.org"
    }
  }
}
```

#### Error Responses
**404 Not Found** - Project doesn't exist or is not publicly available
```json
{
  "error": "Project not found or not available"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Search & Filter Behavior

### Search Functionality
The `search` parameter performs a case-insensitive partial match across multiple fields:
- **title**: Project title
- **problem**: Problem description
- **outcomes**: Expected outcomes
- **methods_required**: Required methods and expertise

**Example**: `search=statistical analysis` will match projects containing "Statistical Analysis", "statistical", or "analysis" in any of the searchable fields.

### Filter Combinations
Multiple filters can be combined using AND logic. All specified filters must match for a project to be included in results.

**Example**: 
```
GET /projects/browse?methods=survey&budget_min=10000&data_sensitivity=Medium
```
Returns only projects that:
- Contain "survey" in methods_required AND
- Have budget_min >= 10000 AND
- Have data_sensitivity = "Medium"

### Pagination
- Default page size: 20 projects
- Page numbering starts at 1
- Invalid page numbers default to page 1
- Results are sorted by project_id in descending order (newest first)

---

## Use Cases & Examples

### Use Case 1: General Browse
A researcher wants to see all available projects.

```http
GET /projects/browse
```

### Use Case 2: Keyword Search
A researcher looking for health-related projects.

```http
GET /projects/browse?search=health
```

### Use Case 3: Filter by Expertise
A researcher specializing in statistical analysis.

```http
GET /projects/browse?methods=statistical%20analysis
```

### Use Case 4: Budget Range
A researcher looking for projects within their rate range.

```http
GET /projects/browse?budget_min=10000&budget_max=25000
```

### Use Case 5: Data Sensitivity Preference
A researcher comfortable with high-sensitivity data.

```http
GET /projects/browse?data_sensitivity=High
```

### Use Case 6: Combined Filters
A researcher looking for educational projects with specific requirements.

```http
GET /projects/browse?search=education&methods=survey&budget_min=5000&data_sensitivity=Medium&page=1&limit=10
```

### Use Case 7: View Project Details
A researcher wants full details about a specific project.

```http
GET /projects/browse/5
```

---

## Important Notes

### Visibility Rules
- Only projects with `status = 'open'` are visible in browse
- Draft, in-progress, completed, and cancelled projects are NOT shown
- No authentication required to view public projects

### Organization Information
- Browse endpoint includes basic organization info (id, name, type, location, focus_areas)
- Detail endpoint includes full organization info (adds mission, website)
- Organization contact information is NOT exposed in public endpoints

### Performance Considerations
- Default limit of 20 results balances performance and usability
- Use pagination for large result sets
- Filters are applied at database level for efficiency
- Case-insensitive searches use PostgreSQL ILIKE operator

### Security
- No sensitive data exposed (user emails, internal IDs, etc.)
- Only publicly available project information is shown
- Draft projects remain private to organization owners
- Organization user_id is not exposed

---

## Data Sensitivity Levels

Projects can have the following data sensitivity levels:

| Level | Description | Examples |
|-------|-------------|----------|
| **Low** | Public or non-sensitive data | Census data, public health statistics, environmental measurements |
| **Medium** | Some confidential data with controls | Survey responses, aggregated demographic data, de-identified health records |
| **High** | Highly sensitive or protected data | Individual health records, financial data, personally identifiable information (PII) |

Researchers should filter by data sensitivity based on their IRB approvals, security clearances, and comfort level with data handling requirements.

---

## Testing

Complete test suite available in:
`backend/tests/integration/browse-projects.test.js`

Tests cover:
- ✅ Browsing all projects
- ✅ Search functionality (title, problem, outcomes, methods)
- ✅ Filter by methods required
- ✅ Filter by budget range (min, max, both)
- ✅ Filter by data sensitivity
- ✅ Filter by timeline
- ✅ Combined filters
- ✅ Pagination
- ✅ Organization details inclusion
- ✅ Public project detail view
- ✅ Draft project exclusion
- ✅ Edge cases and error handling

Run tests:
```bash
npm test -- browse-projects.test.js
```

---

## Future Enhancements

Potential future additions:
1. **Sorting Options**: Sort by budget, timeline, date posted
2. **Advanced Filters**: Filter by organization location, focus areas
3. **Saved Searches**: Allow researchers to save search criteria
4. **Bookmarks**: Let researchers save interesting projects
5. **Relevance Scoring**: Rank results by relevance to search terms
6. **Faceted Search**: Show filter counts (e.g., "15 projects with statistical analysis")
7. **Full-Text Search**: Advanced search with relevance ranking
8. **Geographic Search**: Find projects near a location
9. **Application Status**: Show if researcher already applied

---

## Related Documentation

- **UC7 API Documentation**: Creating and managing projects (nonprofit side)
- **UC4**: Matching algorithm (connects researchers to suitable projects)
- **UC2**: Messaging system (contact organizations about projects)
