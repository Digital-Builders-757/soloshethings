# Local Cursor Workflow

**Purpose:** Explain how SoloSheThings uses local, gitignored Cursor command packs so LLMs can work with the repo consistently without committing `.cursor/` into source control.

## Why This Exists

SoloSheThings uses a headless architecture:
- **WordPress** = public editorial content truth
- **Supabase** = identity, profiles, subscriptions, UGC, moderation, storage
- **Next.js App Router** = delivery, orchestration, routing, preview, revalidation, and secure server-only integrations

Because the repo uses a lot of architectural rules and contract docs, local coding agents need a predictable command workflow to catch up quickly.

We keep that workflow in a **local `.cursor/` folder** so each machine can use the same command structure without forcing those files into git history.

## Important Rule

- `.cursor/` is intentionally **gitignored** in this repo
- `.cursor/` is for **local agent ergonomics**, not the source of truth
- The **source of truth is still `docs/` + `.cursorrules`**

If `.cursor/` and `docs/` ever disagree:
- trust `docs/`
- update local `.cursor/` to match the docs
- do not silently follow stale local command text

## Expected Local `.cursor/` Structure

Typical local setup:

```text
.cursor/
  commands/
    plan.md
    implement.md
    verify.md
    Ship.md
    pr.md
    continue.md
    debug.md
    triage.md
    retro.md
  rules/
    continue-auto-ship.mdc
  plans/
  settings.json
```

These files are local-only by default.

## Command Intent

### `/plan`
Design-only mode.
- read the docs first
- identify constraints and red zones
- propose 1–3 safe approaches
- stop before coding

### `/implement`
Implement only the approved plan.
- no scope creep
- respect contracts and boundaries
- keep diffs minimal in red-zone files

### `/verify`
Run the standard local gates:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

### `/ship`
Prepare a clean batch for `develop`.
- inspect dirty tree
- verify only intended files are included
- run required checks
- update docs if behavior changed
- commit and push to `develop`

### `/pr`
Open or update the `develop -> main` PR.
- avoid duplicate PRs
- describe the real branch delta honestly

### `/continue`
Resume the best active workstream.
- prefer the current dirty set
- avoid random new domains
- auto-handoff to `/ship` or `/pr` when honest

### `/debug`
Root-cause mapping with evidence only.
- no coding yet
- gather repro, logs, likely causes, next inspection step

### `/triage`
Turn multiple issues into a ranked hit list.
- classify severity
- identify safe attack order

### `/retro`
Capture what happened and what should be standardized so the project stops re-breaking.

## Read-First Order for Any LLM

Before changing code, the local command workflow should always point the model to:

1. `docs/DOCUMENTATION_INDEX.md`
2. `docs/ARCHITECTURE_CONSTITUTION.md`
3. `docs/PROJECT_CONTEXT_PROMPT.md`
4. `.cursorrules`
5. relevant contract docs for the feature area

This order matters more than any local slash command wording.

## Headless CMS Mental Model (What the LLM Must Internalize)

### WordPress
Use WordPress for:
- blog/editorial pages
- public content
- SEO-oriented marketing/editorial publishing

Do **not** use WordPress for:
- auth
- subscriptions
- user profiles
- UGC or moderation state

### Supabase
Use Supabase for:
- auth and identity
- profiles
- subscriptions and entitlement state
- community content / UGC
- moderation
- storage

### Next.js
Use Next.js for:
- all routing and surface composition
- server-side fetching boundaries
- preview mode
- revalidation hooks
- secure orchestration between WP and Supabase

## When the Local `.cursor/` Pack Needs Refreshing

Refresh the local `.cursor/` files when:
- docs change meaningfully
- architecture boundaries change
- ship / PR workflow changes
- a repeated debugging failure exposes a stale command assumption

When refreshing:
- do not commit `.cursor/` unless the repo policy explicitly changes
- update the local command pack to match the docs
- if the docs are missing something, fix the docs first

## Related Docs

- `docs/PROJECT_CONTEXT_PROMPT.md`
- `docs/DOCUMENTATION_INDEX.md`
- `docs/ARCHITECTURE_CONSTITUTION.md`
- `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`
- `.cursorrules`
