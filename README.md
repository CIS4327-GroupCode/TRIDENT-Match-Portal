# TRIDENT-Match-Portal

This repository contains a full-stack app using Node.js + Express, PostgreSQL, and React (Vite).

Quick start

1. Start Postgres:

```
docker compose up -d
```

2. Start backend:

```
cd backend
npm install
npm run migrate
npm run dev
```

3. Start frontend (in a new terminal):

```
cd frontend
npm install
npm run dev
```

The frontend proxies API calls from `/api` to `http://localhost:4000` by default. Backend listens on port 4000.


Next steps to implement the Match Portal web app
---------------------------------------------

Below is a compact roadmap to implement a web application that connects nonprofit organizations with researchers to collaborate on social projects. 

/*Here should go the database information: schema, DDL.*/
DATABASE INFO...

/* the following needs to be reviewed */
Backend API surface (initial):
- Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, POST /api/auth/logout
- Users: GET /api/users/:id, PATCH /api/users/:id
- Organizations: GET /api/orgs, POST /api/orgs, GET /api/orgs/:id
- Projects: GET /api/projects, POST /api/projects, GET /api/projects/:id, PATCH /api/projects/:id
- Applications: POST /api/projects/:id/apply, GET /api/projects/:id/applications, PATCH /api/applications/:id
- Matches: GET /api/matches, POST /api/matches (admin/org), PATCH /api/matches/:id
- Messaging: GET /api/conversations, POST /api/conversations/:id/messages

Auth and security:
- Start with JWT-based auth plus refresh tokens stored HttpOnly cookies for the web client.
- Protect routes with role checks (researcher vs nonprofit vs admin).
- Use bcrypt/argon2 for passwords and validate email uniqueness.

Developer tasks (short-term):
1. Design DB migrations and seeds (create migrations under `backend/db/migrations`).
2. Implement auth and user registration/login with validation and tests.
3. Implement organization and project CRUD endpoints with input validation.
4. Implement application flow and a simple match acceptance flow.
5. Create a minimal messaging API (or integrate a third-party like Pusher if real-time is desired).
6. Add role-based access control and admin endpoints.

Frontend tasks (short-term):
1. Wire up auth flows (register/login) and store tokens in HttpOnly cookies via backend.
2. Create pages: Dashboard, Organizations, Project list, Project detail (apply), My applications, Matches, Profile.
3. Implement client-side validations and error handling.
4. Build a basic matching UI and notifications area.

Testing, CI and deployment:
- Write unit tests for backend routes (jest / supertest) and minimal integration tests for DB migrations.
- Add simple E2E tests for core user flows (Playwright or Cypress).
- CI: run lint, tests, and migrations in GitHub Actions. Add a workflow to build and push Docker images.
- Deployment: containerize backend and frontend; deploy to a cloud provider with a managed Postgres (or use the included docker-compose for local dev).

Next steps for the team
- Decide on an auth strategy (social providers, SSO) and a data retention policy.
- Sketch basic wireframes for Dashboard, Project creation & matching flows.
- Create 3-5 user stories to prioritize the first sprint (e.g., Org creates project, Researcher applies, Org accepts application, Researcher and Org message each other).

See `backend/README.md` and `frontend/README.md` for implementation-specific next steps.

