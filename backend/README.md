# Backend (Node + Express)

Steps to run locally:

1. Install dependencies:

```
cd backend
npm install
```

2. Start Postgres (e.g., via docker-compose in repo root):

```
docker compose up -d
```

3. Run migrations and start server:

```
cd backend
npm run migrate
npm run dev
```

Environment variables:

- DATABASE_URL (optional) - e.g. postgres://postgres:postgres@localhost:5432/trident_dev
- PORT (optional)

Next steps: implementation plan (backend)
----------------------------------------

Goal: implement the server-side features required to support a nonprofit<->researcher matching web app.

API contract (concise)
- Auth
	- POST /api/auth/register -> { email, password, role, name } -> 201 with { user, accessToken }
	- POST /api/auth/login -> { email, password } -> { accessToken }
	- POST /api/auth/logout -> 204

- Users
	- GET /api/users/:id -> { user }
	- PATCH /api/users/:id -> { updatedUser }

- Organizations
	- GET /api/orgs -> [org]
	- POST /api/orgs -> { org }
	- GET /api/orgs/:id -> { org }

- Projects
	- GET /api/projects -> [project]
	- POST /api/projects -> { project }
	- GET /api/projects/:id -> { project, applications? }

- Applications
	- POST /api/projects/:id/apply -> creates an application
	- GET /api/projects/:id/applications -> [applications] (org/admin only)
	- PATCH /api/applications/:id -> update status

Suggested DB migration plan
1. Create `users`, `organizations`, `projects`, `applications`, `messages` tables.
2. Add indexes on foreign keys and email uniq index.
3. Create seed fixtures for 1 org, 2 researchers, and 2 projects.

Auth & security notes
- Use JWT for access tokens; store refresh tokens server-side or in HttpOnly cookies.
- Hash passwords with bcrypt (or argon2).
- Validate inputs server-side with a schema validator (Joi, Zod, or express-validator).

Developer checklist (backend)
- [ ] Implement migrations (`backend/db/migrate.js`) and add migration files.
- [ ] Implement auth routes and middleware (password hashing, token issuance, token refresh).
- [ ] Implement CRUD endpoints for orgs and projects with role checks.
- [ ] Implement application endpoints and acceptance flow.
- [ ] Add basic tests (jest + supertest) for auth and project endpoints.
- [ ] Add linting and pre-commit hooks (ESLint, prettier).

Notes about local development
- `docker compose up -d` starts Postgres defined at the repository root.
- Use `DATABASE_URL` env var to point the backend to the DB if different from default in `db.js`.
