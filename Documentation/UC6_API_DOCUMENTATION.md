# UC6: Manage Account Settings - API Documentation

## Overview
This API allows users to manage their account settings, including profile information, passwords, notification preferences, and account deletion. Role-based endpoints enable nonprofits and researchers to update their specific profiles.

## Authentication
All endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

## User Profile Endpoints

### GET /users/me
**Description:** Retrieve the current user's profile information

**Authentication:** Required

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "researcher",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z",
    "preferences": {
      "email_notifications": true,
      "email_messages": true,
      "email_matches": true,
      "email_milestones": true,
      "email_project_updates": true,
      "inapp_notifications": true,
      "inapp_messages": true,
      "inapp_matches": true,
      "weekly_digest": false,
      "monthly_report": false,
      "marketing_emails": false
    },
    "organization": null,
    "researcherProfile": {
      "id": 1,
      "title": "PhD Candidate",
      "institution": "MIT",
      "expertise": ["Machine Learning", "AI"],
      "research_interests": ["Neural Networks"],
      "projects_completed": 5,
      "hourly_rate_min": 75,
      "hourly_rate_max": 150
    }
  }
}
```

---

### PUT /users/me
**Description:** Update user profile (name, email)

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "researcher",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T11:45:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - No update fields provided
- `409 Conflict` - Email already in use

---

## Password Management

### PUT /users/me/password
**Description:** Change user password

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or password too short (< 8 characters)
- `401 Unauthorized` - Current password is incorrect

---

## Notification Preferences

### GET /users/me/preferences
**Description:** Get user notification preferences (creates default preferences if none exist)

**Authentication:** Required

**Response (200 OK):**
```json
{
  "preferences": {
    "id": 1,
    "user_id": 1,
    "email_notifications": true,
    "email_messages": true,
    "email_matches": true,
    "email_milestones": true,
    "email_project_updates": true,
    "inapp_notifications": true,
    "inapp_messages": true,
    "inapp_matches": true,
    "weekly_digest": false,
    "monthly_report": false,
    "marketing_emails": false,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### PUT /users/me/preferences
**Description:** Update notification preferences

**Authentication:** Required

**Request Body (all fields optional, must be boolean):**
```json
{
  "email_notifications": false,
  "email_messages": true,
  "email_matches": true,
  "marketing_emails": false,
  "weekly_digest": true
}
```

**Response (200 OK):**
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "id": 1,
    "user_id": 1,
    "email_notifications": false,
    "email_messages": true,
    "email_matches": true,
    "email_milestones": true,
    "email_project_updates": true,
    "inapp_notifications": true,
    "inapp_messages": true,
    "inapp_matches": true,
    "weekly_digest": true,
    "monthly_report": false,
    "marketing_emails": false,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T11:50:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - No valid preference fields provided (non-boolean values rejected)

---

## Account Deletion

### DELETE /users/me
**Description:** Soft delete user account (recoverable by admins within 30 days)

**Authentication:** Required

**Response (200 OK):**
```json
{
  "message": "Account deleted successfully. You can contact support to restore it within 30 days."
}
```

---

## Organization Settings (Nonprofit Users Only)

### GET /organizations/me
**Description:** Get current user's organization profile

**Authentication:** Required (nonprofit role)

**Response (200 OK):**
```json
{
  "organization": {
    "id": 1,
    "user_id": 5,
    "name": "Green Earth Foundation",
    "type": "nonprofit",
    "location": "San Francisco, CA",
    "website": "https://greenearth.org",
    "mission": "Environmental conservation",
    "focus_areas": ["Climate Change", "Wildlife Protection"],
    "budget_range": "100000-500000",
    "team_size": 15,
    "established_year": 2010
  }
}
```

**Error Responses:**
- `403 Forbidden` - User is not a nonprofit
- `404 Not Found` - Organization not found

---

### PUT /organizations/me
**Description:** Update organization profile

**Authentication:** Required (nonprofit role)

**Request Body (all fields optional):**
```json
{
  "name": "Updated Foundation Name",
  "website": "https://newfoundation.org",
  "mission": "Updated mission statement",
  "focus_areas": ["Education", "Health"],
  "budget_range": "500000-1000000",
  "team_size": 20
}
```

**Response (200 OK):**
```json
{
  "message": "Organization updated successfully",
  "organization": {
    "id": 1,
    "user_id": 5,
    "name": "Updated Foundation Name",
    "type": "nonprofit",
    "location": "San Francisco, CA",
    "website": "https://newfoundation.org",
    "mission": "Updated mission statement",
    "focus_areas": ["Education", "Health"],
    "budget_range": "500000-1000000",
    "team_size": 20,
    "established_year": 2010
  }
}
```

**Error Responses:**
- `400 Bad Request` - No valid update fields provided
- `403 Forbidden` - User is not a nonprofit

---

## Researcher Settings (Researcher Users Only)

### GET /researchers/me
**Description:** Get current user's researcher profile

**Authentication:** Required (researcher role)

**Response (200 OK):**
```json
{
  "profile": {
    "id": 1,
    "user_id": 3,
    "title": "Professor",
    "institution": "Stanford University",
    "expertise": ["Data Science", "Statistics"],
    "research_interests": ["Machine Learning", "AI Ethics"],
    "bio": "Experienced researcher in AI and ethics",
    "projects_completed": 15,
    "hourly_rate_min": 100,
    "hourly_rate_max": 200,
    "available_hours": 20,
    "preferred_project_types": ["Research", "Consulting"]
  }
}
```

**Error Responses:**
- `403 Forbidden` - User is not a researcher
- `404 Not Found` - Researcher profile not found

---

### PUT /researchers/me
**Description:** Update researcher profile

**Authentication:** Required (researcher role)

**Request Body (all fields optional):**
```json
{
  "title": "Associate Professor",
  "institution": "MIT",
  "expertise": ["Machine Learning", "Deep Learning"],
  "hourly_rate_min": 125,
  "hourly_rate_max": 250,
  "available_hours": 15
}
```

**Response (200 OK):**
```json
{
  "message": "Researcher profile updated successfully",
  "profile": {
    "id": 1,
    "user_id": 3,
    "title": "Associate Professor",
    "institution": "MIT",
    "expertise": ["Machine Learning", "Deep Learning"],
    "research_interests": ["Machine Learning", "AI Ethics"],
    "bio": "Experienced researcher in AI and ethics",
    "projects_completed": 15,
    "hourly_rate_min": 125,
    "hourly_rate_max": 250,
    "available_hours": 15,
    "preferred_project_types": ["Research", "Consulting"]
  }
}
```

**Error Responses:**
- `400 Bad Request` - No valid update fields OR minimum rate exceeds maximum rate
- `403 Forbidden` - User is not a researcher

---

## Admin Endpoints

### DELETE /admin/users/:id
**Description:** Permanently delete a user account (requires confirmation)

**Authentication:** Required (admin role)

**Request Body:**
```json
{
  "confirmation": "DELETE"
}
```

**Response (200 OK):**
```json
{
  "message": "User 5 permanently deleted. This action cannot be undone."
}
```

**Error Responses:**
- `400 Bad Request` - Confirmation required
- `403 Forbidden` - User is not an admin
- `404 Not Found` - User not found

---

### POST /admin/users/:id/restore
**Description:** Restore a soft-deleted user account

**Authentication:** Required (admin role)

**Response (200 OK):**
```json
{
  "message": "User account restored successfully",
  "user": {
    "id": 5,
    "name": "Restored User",
    "email": "restored@example.com",
    "role": "researcher"
  }
}
```

**Error Responses:**
- `400 Bad Request` - User is not deleted
- `403 Forbidden` - User is not an admin
- `404 Not Found` - User not found

---

## Allowed Update Fields

### User Profile (PUT /users/me)
- `name` - String (1-255 characters)
- `email` - Valid email address (unique)

### User Preferences (PUT /users/me/preferences)
All fields must be boolean:
- `email_notifications`
- `email_messages`
- `email_matches`
- `email_milestones`
- `email_project_updates`
- `inapp_notifications`
- `inapp_messages`
- `inapp_matches`
- `weekly_digest`
- `monthly_report`
- `marketing_emails`

### Organization (PUT /organizations/me)
- `name` - String
- `type` - String
- `location` - String
- `website` - String (URL)
- `mission` - String
- `focus_areas` - Array of strings
- `budget_range` - String
- `team_size` - Integer
- `established_year` - Integer

### Researcher Profile (PUT /researchers/me)
- `title` - String
- `institution` - String
- `expertise` - Array of strings
- `research_interests` - Array of strings
- `bio` - Text
- `projects_completed` - Integer
- `hourly_rate_min` - Decimal (must be ≤ hourly_rate_max)
- `hourly_rate_max` - Decimal (must be ≥ hourly_rate_min)
- `available_hours` - Decimal
- `preferred_project_types` - Array of strings

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or invalid credentials |
| 403 | Forbidden - Insufficient permissions for the requested action |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error - Server-side error |

---

## Security Features

1. **Password Requirements:** Minimum 8 characters
2. **Current Password Verification:** Required for password changes
3. **Role-Based Access Control:** Middleware enforces role requirements
4. **Soft Delete:** Users can be restored within 30 days
5. **Admin Confirmation:** Hard deletes require explicit "DELETE" confirmation
6. **JWT Validation:** All endpoints validate token and check for deleted users
7. **Input Sanitization:** Only allowed fields are processed
8. **Email Uniqueness:** Prevents duplicate email addresses

---

## Database Models

### User (with Paranoid Mode)
- Soft deletes set `deleted_at` timestamp
- Paranoid mode automatically excludes deleted users from queries
- Hard delete requires `force: true` option

### UserPreferences
- Automatically created with defaults on first access
- Separate table for scalability and flexibility
- Foreign key cascades on user deletion
