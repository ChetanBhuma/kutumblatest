# Generic Prompt: Generate CTO Technical Document

> Copy the prompt below and paste it into any AI coding assistant that has access to your codebase.

---

## The Prompt

```
Create a detailed CTO Technical Document (~40 pages) for this application. Perform a deep analysis of the entire codebase and generate a comprehensive markdown file stored in the project root as `CTO_DOCUMENT.md`.

The document MUST cover the following sections in detail:

---

### 1. Executive Summary
- Application purpose and business objectives
- Target users and their roles
- Key metrics (models, endpoints, components count)
- High-level feature overview

### 2. System Architecture Overview
- High-level architecture diagram (ASCII/text-based)
- Monorepo or project folder structure with descriptions
- Communication flow between layers (client → API → database)
- Microservices or monolith breakdown (if applicable)

### 3. Technology Stack
- Backend: framework, language, ORM, database, cache, queue, auth library
- Frontend: framework, UI library, state management, styling, form handling
- Infrastructure: containerization, cloud provider, CI/CD, monitoring
- Include version numbers from package.json / dependency files

### 4. Backend Architecture
- Directory structure breakdown with purpose of each folder
- List ALL controllers with their purpose and key endpoints
- List ALL services with their business logic responsibilities
- List ALL middleware with their function (auth, validation, logging, etc.)
- Configuration files and their purpose
- Error handling strategy

### 5. Frontend Architecture
- Directory structure breakdown
- Page/route listing with descriptions and access control
- Component hierarchy and organization
- State management (contexts, stores, providers)
- API client structure and how it communicates with backend
- Authentication flow on the frontend

### 6. Database Design
- Database type and ORM used
- List ALL models/tables with their fields, types, and relationships
- Entity-Relationship diagram (text-based)
- Key model schemas (show actual schema definitions for core entities)
- Enum definitions and their purpose
- Indexing strategy and performance indexes
- Database migration approach

### 7. API Documentation
- Base URL structure and versioning
- Authentication endpoints (login, logout, refresh, OTP)
- CRUD endpoints for each resource/module
- Request/Response format with examples
- Pagination, filtering, and sorting conventions
- Error response format and error codes

### 8. Authentication & Authorization
- Authentication flow diagram (login → token → API access)
- Token structure (JWT payload fields)
- Role hierarchy with access levels
- Permission system (how permissions are defined, assigned, checked)
- Session management strategy
- Data scoping (how users see only their authorized data)

### 9. Business Logic & Workflows
- Core business workflows with state diagrams
- Status transitions for key entities (e.g., order lifecycle, approval flow)
- Automated processes (schedulers, background jobs, triggers)
- Business rules and validation logic
- Scoring/ranking algorithms (if any)

### 10. Security Architecture
- Security layers diagram (network → application → auth → data)
- Rate limiting configuration
- Input validation and sanitization
- Security headers configuration
- Sensitive data handling (encryption, masking, hashing)
- Audit logging (what is logged, format, retention)
- CORS configuration

### 11. Deployment & Infrastructure
- Environment variables documentation
- Docker/container configuration
- Process manager setup (PM2, systemd, etc.)
- Reverse proxy configuration (Nginx, etc.)
- Cloud storage setup
- Monitoring and error tracking

### 12. Appendices
- API error codes reference table
- Test/demo credentials
- Database migration commands
- Useful development scripts
- Swagger/API docs access URLs

---

### Formatting Requirements:
- Use proper Markdown with headers, tables, code blocks, and diagrams
- Include ASCII architecture diagrams where helpful
- Show actual code snippets from the codebase for schemas and configurations
- Use tables for listing controllers, services, endpoints, and models
- Include mermaid or text-based flow diagrams for workflows
- Add a Table of Contents at the top
- Add Document Control section at the bottom with version and date
```

---

## Usage Tips

1. **Paste the prompt** into your AI assistant (Gemini, Claude, Copilot, etc.)
2. **Ensure codebase access** — the AI must be able to read your project files
3. **Adjust sections** — remove or add sections based on your app's complexity
4. **Review output** — the AI may need follow-up prompts to expand thin sections
