# TRIDENT Match Portal - Documentation Index

**Last Updated:** December 10, 2025

This directory contains all current documentation for the TRIDENT Match Portal project. Documentation is organized by topic for easy navigation.

---

## 📋 Quick Links

- **[Main README](../README.md)** - Project overview and quick start
- **[Backend README](../backend/README.md)** - API server documentation
- **[Frontend README](../frontend/README.md)** - React app documentation

---

## 📁 Documentation Structure

### 🚀 Setup & Installation
Getting started with development and deployment.

| Document | Description |
|----------|-------------|
| [Installation Guide](setup/installation.md) | Step-by-step installation instructions |
| [Environment Configuration](setup/environment.md) | Environment variables reference |
| [Database Setup](setup/database.md) | PostgreSQL and Neon configuration |
| [Deployment Guide](setup/deployment.md) | Production deployment steps |

### 🏗️ Architecture
System design and technical architecture.

| Document | Description |
|----------|-------------|
| [System Overview](architecture/overview.md) | High-level architecture |
| [Database Schema](architecture/database-schema.md) | ER diagrams and table specifications |
| [Authentication Flow](architecture/auth-flow.md) | Login/signup process flow |
| [API Design](architecture/api-design.md) | RESTful API patterns |

### 🔌 API Reference
Detailed endpoint documentation.

| Document | Description |
|----------|-------------|
| [Authentication Endpoints](api/auth.md) | Signup, login, logout |
| [User Endpoints](api/users.md) | Profile management |
| [Project Endpoints](api/projects.md) | Project CRUD operations |
| [Admin Endpoints](api/admin.md) | Platform management |
| [Messages Endpoints](api/messages.md) | Messaging system |

### 📖 Development Guides
Best practices and development patterns.

| Document | Description |
|----------|-------------|
| [Frontend Development](guides/frontend.md) | React patterns and components |
| [Backend Development](guides/backend.md) | Express and Sequelize patterns |
| [Testing Guide](guides/testing.md) | Test suite overview |
| [Code Standards](guides/code-standards.md) | Coding conventions |

### 📦 Archive
Historical documentation and completed migrations.

| Document | Status | Notes |
|----------|--------|-------|
| [Sequelize Migration Guide](archive/SEQUELIZE_MIGRATION_GUIDE.md) | ✅ Complete | Kept for reference |
| [UC Implementation Plans](archive/use-cases/) | ⚠️ Outdated | Historical only |
| [Vercel Deployment Docs](archive/vercel/) | 📝 Reference | Alternative deployment option |

---

## 🎯 Documentation Goals

### Current Focus
- Keep docs synchronized with actual implementation
- Document new features as they're built
- Maintain API reference accuracy
- Update setup guides for cloud database (Neon)

### Planned Improvements
- [ ] Add sequence diagrams for complex flows
- [ ] Create video tutorials for setup
- [ ] Document deployment process with screenshots
- [ ] Add troubleshooting FAQ
- [ ] Create developer onboarding guide

---

## 📝 Contributing to Documentation

When adding or updating documentation:

1. **Keep it current** - Update docs when code changes
2. **Be specific** - Include code examples and screenshots
3. **Test instructions** - Verify setup steps actually work
4. **Link related docs** - Cross-reference related documentation
5. **Use consistent formatting** - Follow existing markdown patterns

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Add table of contents for long documents
- Keep line length reasonable (80-100 chars)
- Use proper markdown formatting
- Include last updated date

---

## 🗂️ Archived Documentation

**Location:** `docs/archive/`

The archive contains:
- Completed migration guides (Sequelize, Database)
- Historical implementation plans
- Outdated use case specifications
- Alternative deployment strategies

**Note:** Archived docs are kept for historical reference but may not reflect current implementation.

---

## 🔍 Finding Documentation

### By Topic

**Authentication & Security:**
- [Authentication Flow](architecture/auth-flow.md)
- [Auth API Reference](api/auth.md)
- [Security Best Practices](guides/backend.md#security)

**Database:**
- [Database Schema](architecture/database-schema.md)
- [Database Setup](setup/database.md)
- [Sequelize Patterns](guides/backend.md#database)

**Frontend:**
- [Component Structure](guides/frontend.md)
- [Routing](guides/frontend.md#routing)
- [State Management](guides/frontend.md#state)

**Deployment:**
- [Deployment Guide](setup/deployment.md)
- [Environment Configuration](setup/environment.md)

---

## 📞 Questions or Issues?

- **GitHub Issues:** [Report documentation issues](https://github.com/CIS4327-GroupCode/TRIDENT-Match-Portal/issues)
- **Pull Requests:** Submit documentation improvements
- **Team Contact:** Reach out to development team

---

**Last Updated:** December 10, 2025  
**Maintained by:** TRIDENT Development Team
