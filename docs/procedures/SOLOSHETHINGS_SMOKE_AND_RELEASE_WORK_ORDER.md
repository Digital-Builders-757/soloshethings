# SoloSHEThings Smoke + Release Work Order

**Execution batch for the final MVP smoke pass, docs sync, and release prep.**
Source docs: [SOLOSHETHINGS_CATCHUP_ROADMAP.md](./SOLOSHETHINGS_CATCHUP_ROADMAP.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [MVP_SMOKE_CHECKLIST.md](../proof/MVP_SMOKE_CHECKLIST.md), [E2E_SMOKE_PATHS.md](../proof/E2E_SMOKE_PATHS.md), [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md), [RELEASE_PROCEDURE.md](./RELEASE_PROCEDURE.md), and [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md).

---

## Batch goal

Verify the app is actually shippable, keep the docs honest, and clean up any final rough edges that turn up during QA.

This is the last batch before release prep. It should validate the real user paths, confirm the repo is clean, and leave a crisp handoff for the next push or deployment.

---

## What this batch should cover

### 1) MVP smoke verification

Run the core app checks against the current code.

**Primary surfaces:**
- `/`
- `/blog`
- `/blog/[slug]`
- `/login`
- `/signup`
- `/dashboard`
- `/profile`
- `/contact`
- `/contact-us`
- any other route that is part of the current MVP flow

**What to verify:**
- public pages load
- auth pages load
- protected routes redirect correctly
- dashboard loads after auth
- profile edit / repair behavior still works
- no obvious runtime errors on mobile or desktop
- route loading states don’t feel broken or blank

---

### 2) Docs sync

Make sure the docs still describe the real product.

**Source docs:**
- `docs/DOCUMENTATION_INDEX.md`
- `docs/WORK_ORDER.md`
- `docs/procedures/README.md`
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/proof/MVP_SMOKE_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`

**What to verify:**
- queue order still matches reality
- source-of-truth docs are still correct
- implementation notes reflect the current repo
- stale or duplicate guidance is removed or clarified

---

### 3) Release prep

Get the repo ready for a clean push or deployment.

**Source docs:**
- `docs/procedures/PRE_PUSH_CHECKLIST.md`
- `docs/procedures/RELEASE_PROCEDURE.md`

**What to verify:**
- typecheck, lint, and build still pass
- any schema or migration notes are accurate
- no secrets or environment mistakes are introduced
- release steps are still valid

---

### 4) Final cleanup sweep

If smoke or docs work reveals a small site issue, fix it before wrapping.

**Possible targets:**
- rough spacing
- weak loading state
- one-off layout mismatch
- confusing CTA copy
- any mobile-only weirdness

Keep it tight. Only fix what clearly improves launch readiness.

---

## Execution order

### Step 1, smoke verification

Run the core MVP smoke paths first.

Deliverables:
- known good public routes checked
- auth flows checked
- dashboard/profile checked
- no obvious runtime breakage

Definition of done:
- the current MVP can be trusted at a basic release level

---

### Step 2, docs sync

Then align the docs with reality.

Deliverables:
- queue and roadmap docs still match the repo
- smoke docs still describe the real flows
- index pointers remain accurate

Definition of done:
- the docs do not lie about what the app does

---

### Step 3, release prep

Run the release checks and confirm the repo is clean.

Deliverables:
- typecheck / lint / build validated
- pre-push checklist satisfied
- release procedure still accurate

Definition of done:
- the repo is ready for the next push or deploy step

---

### Step 4, final cleanup sweep

Fix any small issues smoke QA surfaced.

Deliverables:
- tiny site polish fixes if needed
- mobile clarity improvements if needed
- no lingering obvious rough edges

Definition of done:
- the repo is shippable without caveats

---

## Cursor prompt pack

### Prompt 1, smoke verification

Read `docs/proof/MVP_SMOKE_CHECKLIST.md` and `docs/proof/E2E_SMOKE_PATHS.md` first. Then verify the current MVP surfaces in the app.

Check:
- public pages load
- auth pages load
- protected routes redirect correctly
- dashboard and profile work after auth
- profile repair does not loop
- mobile and desktop both behave
- route loading states do not feel broken

Fix only what is clearly failing or regressing. Keep the scope on the current MVP, not on future features.

### Prompt 2, docs sync

Read `docs/DOCUMENTATION_INDEX.md`, `docs/WORK_ORDER.md`, `docs/procedures/README.md`, `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`, and `docs/procedures/IMPLEMENTATION_ROADMAP.md`.

Make sure the docs still tell the truth about the current SoloSHEThings state:
- queue order matches reality
- source-of-truth docs are correct
- smoke docs match the actual app behavior
- remove or clarify anything stale

### Prompt 3, release prep

Read `docs/procedures/PRE_PUSH_CHECKLIST.md` and `docs/procedures/RELEASE_PROCEDURE.md`.

Run the release-prep checks and fix anything that blocks a clean push or deployment:
- typecheck
- lint
- build
- schema / migration notes if relevant
- no secrets or config mistakes

### Prompt 4, final cleanup sweep

Do one last pass for anything the smoke checks exposed that still feels off.

Only fix small, high-value problems:
- rough spacing
- weak loading states
- confusing copy
- mobile-only weirdness
- tiny layout mismatches

Keep it minimal and shippable.

---

## Useful source docs

- `docs/proof/MVP_SMOKE_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`
- `docs/procedures/PRE_PUSH_CHECKLIST.md`
- `docs/procedures/RELEASE_PROCEDURE.md`
- `docs/DOCUMENTATION_INDEX.md`
- `docs/WORK_ORDER.md`
