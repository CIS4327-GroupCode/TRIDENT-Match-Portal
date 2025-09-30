# Frontend (React + Vite)

Steps to run locally:

1. Install dependencies:

```
cd frontend
npm install
```

2. Start the dev server:

```
npm run dev
```

The Vite server proxies requests starting with `/api` to `http://localhost:4000` (the backend).

Next steps: implementation plan (frontend)
----------------------------------------

Goal: build a simple, accessible React UI that lets nonprofits create projects, researchers browse and apply, and both parties communicate after matches.

Pages / Components (initial)
- Auth pages: `Login`, `Register` (forms that POST to `/api/auth`)
- Dashboard: shows user's projects (org) or applications/matches (researcher)
- Organizations list & detail pages
- Projects list: filters by skills/tags, search, pagination
- Project detail: description, apply button (researcher), edit button (org)
- Application flow: modal or page to send application message
- Matches & Messaging: simple conversations list and message thread component
- Profile / settings: update profile and affiliations

Data flow and API usage
- On app load, attempt to refresh session with a call to `/api/auth/refresh` (if using refresh tokens in cookies).
- Store only minimal user state client-side (id, name, role); rely on backend for protected actions.
- Use fetch or axios; handle 401 by redirecting to login.

UI/UX notes
- Keep forms simple and validate client-side to reduce backend errors.
- Use tag-based skill filters and free-text search for projects.
- Make the apply flow two-step: write a short message and confirm submit.

Developer checklist (frontend)
- [ ] Implement auth flows and protect routes.
- [ ] Pages: Projects list, Project detail, Dashboard, Profile.
- [ ] Components: ProjectCard, OrgCard, ApplicationForm, MessageList.
- [ ] Add basic unit tests for components and a couple of integration tests for key flows (login + apply).
- [ ] Style with CSS modules or Tailwind (project currently includes `styles.css`).
