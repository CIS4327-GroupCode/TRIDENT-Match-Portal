# Profile Creation on Signup - Examples

## Overview
The registration endpoint now automatically creates role-specific profiles when users sign up.

## Nonprofit Registration

### Request
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Save the Forests",
  "email": "contact@saveforests.org",
  "password": "SecurePass123!",
  "role": "nonprofit",
  "organizationData": {
    "name": "Save the Forests Foundation",
    "EIN": "12-3456789",
    "mission": "Protect and restore forest ecosystems worldwide",
    "focus_tags": ["environment", "conservation", "climate change"],
    "compliance_flags": ["501c3", "verified"],
    "contacts": {
      "phone": "555-0123",
      "email": "info@saveforests.org",
      "website": "https://saveforests.org"
    }
  }
}
```

### Response
```json
{
  "user": {
    "id": 123,
    "name": "Save the Forests",
    "email": "contact@saveforests.org",
    "role": "nonprofit",
    "created_at": "2025-11-25T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What Happens
1. ✅ User account created in `_user` table
2. ✅ Organization record created in `organizations` table (linked via user ID)
3. ✅ JWT token generated and returned
4. ✅ Both operations wrapped in transaction (rollback if either fails)

### Organization Data Fields
- **name** (optional): Defaults to user's name if not provided
- **EIN** (optional): Tax ID number
- **mission** (optional): Organization's mission statement
- **focus_tags** (optional): Array of focus areas (stored as JSON)
- **compliance_flags** (optional): Array of compliance certifications
- **contacts** (optional): Contact information object

---

## Researcher Registration

### Request
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Dr. Jane Smith",
  "email": "jsmith@university.edu",
  "password": "SecurePass123!",
  "role": "researcher",
  "researcherData": {
    "affiliation": "Massachusetts Institute of Technology",
    "domains": ["machine learning", "data science", "AI ethics"],
    "methods": ["statistical analysis", "deep learning", "NLP"],
    "tools": ["Python", "TensorFlow", "PyTorch", "R"],
    "rate_min": 100,
    "rate_max": 250,
    "availability": "Part-time, 10-20 hours/week"
  }
}
```

### Response
```json
{
  "user": {
    "id": 124,
    "name": "Dr. Jane Smith",
    "email": "jsmith@university.edu",
    "role": "researcher",
    "created_at": "2025-11-25T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What Happens
1. ✅ User account created in `_user` table
2. ✅ Researcher profile created in `researcher_profiles` table
3. ✅ JWT token generated and returned
4. ✅ Rate range validated (min < max)

### Researcher Data Fields
- **affiliation** (optional): University or organization affiliation
- **domains** (optional): Array of expertise domains (stored as JSON)
- **methods** (optional): Array of research methods (stored as JSON)
- **tools** (optional): Array of tools/technologies (stored as JSON)
- **rate_min** (optional): Minimum hourly rate
- **rate_max** (optional): Maximum hourly rate
- **availability** (optional): Availability description

### Rate Validation
- If both `rate_min` and `rate_max` are provided, `rate_min` must be less than `rate_max`
- Returns 400 error if validation fails

---

## Admin Registration

### Request
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@trident.org",
  "password": "SecurePass123!",
  "role": "admin"
}
```

### Response
```json
{
  "user": {
    "id": 125,
    "name": "Admin User",
    "email": "admin@trident.org",
    "role": "admin",
    "created_at": "2025-11-25T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### What Happens
1. ✅ User account created with admin role
2. ✅ No additional profile created (admins don't need org/researcher profiles)

---

## Simplified Registration (Minimum Fields)

### Researcher with No Profile Data
```json
{
  "name": "John Doe",
  "email": "jdoe@example.com",
  "password": "SecurePass123!",
  "role": "researcher"
}
```
✅ Creates user, but no researcher profile (can be added later via account settings)

### Nonprofit with Minimal Data
```json
{
  "name": "Community Foundation",
  "email": "info@community.org",
  "password": "SecurePass123!",
  "role": "nonprofit",
  "organizationData": {
    "mission": "Support local community initiatives"
  }
}
```
✅ Creates user and organization (uses user's name as org name)

---

## Error Handling

### Missing Required Fields
```json
// Request
{
  "name": "Test User",
  "password": "SecurePass123!"
  // Missing email
}

// Response (400)
{
  "error": "name, email and password are required"
}
```

### Invalid Role
```json
// Request
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "role": "superuser"  // Invalid
}

// Response (400)
{
  "error": "invalid role. Must be one of: researcher, nonprofit, admin"
}
```

### Missing Organization Data for Nonprofit
```json
// Request
{
  "name": "Test Org",
  "email": "test@org.com",
  "password": "SecurePass123!",
  "role": "nonprofit"
  // Missing organizationData
}

// Response (400)
{
  "error": "organizationData is required for nonprofit role",
  "required": ["name"]
}
```

### Invalid Rate Range
```json
// Request
{
  "name": "Test Researcher",
  "email": "test@researcher.com",
  "password": "SecurePass123!",
  "role": "researcher",
  "researcherData": {
    "rate_min": 300,
    "rate_max": 100  // Less than min!
  }
}

// Response (400)
{
  "error": "rate_min must be less than rate_max"
}
```

### Email Already in Use
```json
// Response (409)
{
  "error": "email already in use"
}
```

---

## Transaction Safety

All profile creation operations are wrapped in database transactions:

```javascript
// Pseudocode
BEGIN TRANSACTION
  1. Create User
  2. Create Organization/ResearcherProfile
  IF any step fails:
    ROLLBACK entire transaction
  ELSE:
    COMMIT transaction
END TRANSACTION
```

This ensures data consistency - you'll never have a user without their profile, or a profile without a user.

---

## Frontend Integration Examples

### React Example
```javascript
const registerNonprofit = async (formData) => {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'nonprofit',
        organizationData: {
          name: formData.orgName,
          EIN: formData.ein,
          mission: formData.mission,
          focus_tags: formData.focusAreas,
          contacts: {
            phone: formData.phone,
            website: formData.website
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const { user, token } = await response.json();
    
    // Store token
    localStorage.setItem('token', token);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Registration failed:', error.message);
    alert(error.message);
  }
};
```

### Fetch with Researcher Data
```javascript
const registerResearcher = async (formData) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'researcher',
      researcherData: {
        affiliation: formData.university,
        domains: formData.selectedDomains, // Array
        methods: formData.selectedMethods, // Array
        tools: formData.selectedTools,     // Array
        rate_min: parseInt(formData.minRate),
        rate_max: parseInt(formData.maxRate),
        availability: formData.availability
      }
    })
  });

  const data = await response.json();
  return data;
};
```

---

## Testing

Run the profile creation tests:
```bash
cd backend
npm test tests/integration/profile-creation.test.js
```

Tests verify:
- ✅ Organization profile creation for nonprofits
- ✅ Researcher profile creation for researchers
- ✅ Validation of required fields
- ✅ Rate range validation
- ✅ Role validation
- ✅ Transaction rollback on errors
- ✅ Optional profile data handling

---

## Next Steps

After profile creation is complete:
1. Add profile completion status tracking
2. Implement profile update endpoints (UC6)
3. Add profile validation (EIN format, etc.)
4. Add profile image upload
5. Implement profile verification badges
