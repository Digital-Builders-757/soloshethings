# Documentation Index

**Purpose:** Canonical map of all SoloSheThings documentation. One source of truth per topic.

## Rules

### One Source of Truth Per Topic

**MUST:**
- Each topic has exactly ONE authoritative document
- Cross-reference related docs, don't duplicate content
- Update the source document when information changes

**MUST NOT:**
- Document the same information in multiple places
- Create duplicate documentation
- Update docs without updating the source of truth

### Where to Put New Docs

**Constitution Layer:**
- Foundational principles and non-negotiables
- Architecture decisions
- Coding standards
- Security invariants

**Truth Layer:**
- Single source of truth documents
- Schema definitions
- Database reports

**Contracts Layer (`docs/contracts/`):**
- Behavioral contracts for integrations
- API contracts
- Service integration patterns

**Procedures Layer (`docs/procedures/`):**
- Workflow documentation
- Step-by-step processes
- Checklists
- Implementation roadmaps

**Proof Layer (`docs/proof/`):**
- Testing requirements
- Quality gates
- Monitoring setup

**UX Canon Layer:**
- User-facing documentation
- User guides
- Feature status

**Diagrams Layer (`docs/diagrams/`):**
- Architecture diagrams
- Flow diagrams
- System maps

### Duplicate Doc Detection

**Before creating a new doc, check:**
1. Does a similar doc already exist? (Search `docs/` directory)
2. Can this information go in an existing doc? (Update instead of create)
3. Is this a new topic? (Create new doc, add to this index)

**Signs of duplication:**
- Multiple docs explaining the same concept
- Schema information in multiple places
- Behavior contracts scattered across docs
- Procedures documented in multiple locations

**If duplication found:**
1. Identify the source of truth
2. Consolidate information into source doc
3. Update cross-references
4. Remove duplicate doc
5. Update this index

## Documentation Layers

### Constitution Layer

Foundational principles and architectural decisions.

- **[ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)** - Foundational principles, tech stack, non-negotiables, and architectural rules
- **[PROJECT_CONTEXT_PROMPT.md](./PROJECT_CONTEXT_PROMPT.md)** - Read-first prompt for agents/devs before changing code
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Next.js 15 App Router + strict TypeScript conventions and patterns
- **[SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)** - Security rules that must never be violated

### Truth Layer

Single source of truth documents.

- **[database_schema_audit.md](./database_schema_audit.md)** - Single source of truth for Supabase database schema (v0)
- **[DATABASE_REPORT.md](./DATABASE_REPORT.md)** - Schema evolution, product mapping, RLS design, access patterns, and storage strategy
- **[WORDPRESS_SUPABASE_BLUEPRINT.md](./WORDPRESS_SUPABASE_BLUEPRINT.md)** - Hybrid stack architecture blueprint: WordPress (editorial) + Supabase (identity/community) + Next.js (delivery)

### Contracts Layer

Behavioral contracts for integrations and services.

- **[contracts/AUTH_CONTRACT.md](./contracts/AUTH_CONTRACT.md)** - Authentication flow, session management, and user identity rules
- **[contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)** - What anonymous vs authenticated vs subscribed users can access
- **[contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)** - Query patterns, RLS enforcement, and data access rules
- **[contracts/UPLOADS_STORAGE_CONTRACT.md](./contracts/UPLOADS_STORAGE_CONTRACT.md)** - File upload rules, storage buckets, privacy toggles, and image handling
- **[contracts/BILLING_STRIPE_CONTRACT.md](./contracts/BILLING_STRIPE_CONTRACT.md)** - Subscription flow, webhook handling, trial management, and access control
- **[contracts/EMAIL_NOTIFICATIONS_CONTRACT.md](./contracts/EMAIL_NOTIFICATIONS_CONTRACT.md)** - Email sending rules, templates, and Resend integration patterns
- **[contracts/WORDPRESS_CONTENT_CONTRACT.md](./contracts/WORDPRESS_CONTENT_CONTRACT.md)** - Headless WordPress integration, ISR, revalidation, and content sanitization

### Procedures Layer

Workflow documentation and step-by-step processes.

- **[procedures/PRE_PUSH_CHECKLIST.md](./procedures/PRE_PUSH_CHECKLIST.md)** - Mandatory checks before committing code
- **[procedures/MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md)** - Database migration workflow and versioning rules
- **[procedures/ENVIRONMENT_PROCEDURE.md](./procedures/ENVIRONMENT_PROCEDURE.md)** - Dev vs production setup, Supabase project separation, and secret management
- **[procedures/RELEASE_PROCEDURE.md](./procedures/RELEASE_PROCEDURE.md)** - Deployment workflow, Vercel configuration, and rollback steps
- **[procedures/INCIDENT_TRIAGE_PROCEDURE.md](./procedures/INCIDENT_TRIAGE_PROCEDURE.md)** - Incident response, escalation, and post-mortem process
- **[procedures/IMPLEMENTATION_ROADMAP.md](./procedures/IMPLEMENTATION_ROADMAP.md)** - Complete implementation roadmap, phase planning, and quick resume guide

### Proof Layer

Testing requirements, quality gates, and monitoring.

- **[proof/QA_CHECKLIST.md](./proof/QA_CHECKLIST.md)** - Testing requirements and quality gates
- **[proof/E2E_SMOKE_PATHS.md](./proof/E2E_SMOKE_PATHS.md)** - Critical user journeys for smoke testing
- **[proof/MVP_SMOKE_CHECKLIST.md](./proof/MVP_SMOKE_CHECKLIST.md)** - Definitive QA checklist to verify MVP is usable and stable
- **[proof/MONITORING_SENTRY_POSTURE.md](./proof/MONITORING_SENTRY_POSTURE.md)** - Error tracking, monitoring setup, and alerting rules

### UX Canon Layer

User-facing documentation and feature status.

- **[USER_GUIDE.md](./USER_GUIDE.md)** - User roles, capabilities, and UX expectations
- **[MVP_STATUS_NOTION.md](./MVP_STATUS_NOTION.md)** - Project status dashboard, phase planning, and progress history
- **[BRAND_STYLE_GUIDE.md](./BRAND_STYLE_GUIDE.md)** - Brand color palette, usage rules, and design tokens
- **[UX_REFERENCE_AWA.md](./UX_REFERENCE_AWA.md)** - Accidentally Wes Anderson inspiration (structure only, not styling)
- **[design-plans/BRAND_COLOR_VIBRANCY_ENHANCEMENT.md](./design-plans/BRAND_COLOR_VIBRANCY_ENHANCEMENT.md)** - Brand color vibrancy enhancement design plan and implementation

### Diagrams Layer

Architecture diagrams and flow documentation.

- **[diagrams/airport-model.md](./diagrams/airport-model.md)** - Layered architecture model adapted for SoloSheThings
- **[diagrams/high-level-architecture.md](./diagrams/high-level-architecture.md)** - System overview: Next.js, Supabase, Stripe, WordPress integration
- **[diagrams/core-flows.md](./diagrams/core-flows.md)** - Key user flows: signup, subscription, content creation, moderation

## Topic Index

### Authentication & Authorization
- **Source of Truth:** [contracts/AUTH_CONTRACT.md](./contracts/AUTH_CONTRACT.md)
- **Related:** [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md), [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)

### Database Schema
- **Source of Truth:** [database_schema_audit.md](./database_schema_audit.md)
- **Related:** [DATABASE_REPORT.md](./DATABASE_REPORT.md), [procedures/MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md)

### Data Access & Queries
- **Source of Truth:** [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- **Related:** [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md), [database_schema_audit.md](./database_schema_audit.md)

### Access Control (Public/Private)
- **Source of Truth:** [contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- **Related:** [USER_GUIDE.md](./USER_GUIDE.md), [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)

### File Uploads & Storage
- **Source of Truth:** [contracts/UPLOADS_STORAGE_CONTRACT.md](./contracts/UPLOADS_STORAGE_CONTRACT.md)
- **Related:** [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md), [database_schema_audit.md](./database_schema_audit.md)

### Billing & Subscriptions
- **Source of Truth:** [contracts/BILLING_STRIPE_CONTRACT.md](./contracts/BILLING_STRIPE_CONTRACT.md)
- **Related:** [DATABASE_REPORT.md](./DATABASE_REPORT.md), [database_schema_audit.md](./database_schema_audit.md)

### WordPress Integration
- **Source of Truth:** [contracts/WORDPRESS_CONTENT_CONTRACT.md](./contracts/WORDPRESS_CONTENT_CONTRACT.md)
- **Architecture Blueprint:** [WORDPRESS_SUPABASE_BLUEPRINT.md](./WORDPRESS_SUPABASE_BLUEPRINT.md)
- **Related:** [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md), [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)

### Email Notifications
- **Source of Truth:** [contracts/EMAIL_NOTIFICATIONS_CONTRACT.md](./contracts/EMAIL_NOTIFICATIONS_CONTRACT.md)
- **Related:** [procedures/RELEASE_PROCEDURE.md](./procedures/RELEASE_PROCEDURE.md)

### Migration Workflow
- **Source of Truth:** [procedures/MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md)
- **Related:** [database_schema_audit.md](./database_schema_audit.md), [DATABASE_REPORT.md](./DATABASE_REPORT.md)

### Environment Setup
- **Source of Truth:** [procedures/ENVIRONMENT_PROCEDURE.md](./procedures/ENVIRONMENT_PROCEDURE.md)
- **Related:** [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)

### Release & Deployment
- **Source of Truth:** [procedures/RELEASE_PROCEDURE.md](./procedures/RELEASE_PROCEDURE.md)
- **Related:** [procedures/PRE_PUSH_CHECKLIST.md](./procedures/PRE_PUSH_CHECKLIST.md), [proof/E2E_SMOKE_PATHS.md](./proof/E2E_SMOKE_PATHS.md)

### Incident Response
- **Source of Truth:** [procedures/INCIDENT_TRIAGE_PROCEDURE.md](./procedures/INCIDENT_TRIAGE_PROCEDURE.md)
- **Related:** [proof/MONITORING_SENTRY_POSTURE.md](./proof/MONITORING_SENTRY_POSTURE.md)

### Testing & QA
- **Source of Truth:** [proof/QA_CHECKLIST.md](./proof/QA_CHECKLIST.md)
- **Related:** [proof/E2E_SMOKE_PATHS.md](./proof/E2E_SMOKE_PATHS.md), [procedures/PRE_PUSH_CHECKLIST.md](./procedures/PRE_PUSH_CHECKLIST.md)

### Monitoring & Observability
- **Source of Truth:** [proof/MONITORING_SENTRY_POSTURE.md](./proof/MONITORING_SENTRY_POSTURE.md)
- **Related:** [procedures/INCIDENT_TRIAGE_PROCEDURE.md](./procedures/INCIDENT_TRIAGE_PROCEDURE.md)

### User Experience
- **Source of Truth:** [USER_GUIDE.md](./USER_GUIDE.md)
- **Related:** [MVP_STATUS_NOTION.md](./MVP_STATUS_NOTION.md), [contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)

### Project Status
- **Source of Truth:** [MVP_STATUS_NOTION.md](./MVP_STATUS_NOTION.md)
- **Related:** [USER_GUIDE.md](./USER_GUIDE.md)

## Adding New Documentation

### Step 1: Check for Duplicates

1. Search existing docs for similar content
2. Check topic index above
3. Verify no duplicate exists

### Step 2: Determine Layer

- **Constitution:** Foundational principles
- **Truth:** Single source of truth
- **Contracts:** Behavioral contracts
- **Procedures:** Workflows
- **Proof:** Testing/monitoring
- **UX Canon:** User-facing
- **Diagrams:** Visual documentation

### Step 3: Create Document

1. Create file in appropriate directory
2. Follow naming conventions
3. Include purpose statement
4. Cross-reference related docs

### Step 4: Update This Index

1. Add to appropriate layer section
2. Add to topic index (if new topic)
3. Update cross-references in related docs

## Maintenance

**When to update this index:**
- New documentation created
- Documentation removed
- Documentation renamed
- Topic ownership changes

**Last Updated:** 2025-01-27  
**Maintainer:** Development Team

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)
- [PROJECT_CONTEXT_PROMPT.md](./PROJECT_CONTEXT_PROMPT.md)
