# SoloSHEThings Site Polish + Performance Work Order

**Execution batch for visual cleanup, responsive consistency, loading polish, and docs discipline.**
Source docs: [BRAND_STYLE_GUIDE.md](../BRAND_STYLE_GUIDE.md), [UX_REFERENCE_AWA.md](../UX_REFERENCE_AWA.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [SOLOSHETHINGS_CATCHUP_ROADMAP.md](./SOLOSHETHINGS_CATCHUP_ROADMAP.md), [QA_CHECKLIST.md](../proof/QA_CHECKLIST.md), and [E2E_SMOKE_PATHS.md](../proof/E2E_SMOKE_PATHS.md).

---

## Batch goal

Make the app feel clean, fast, and complete on every screen.

This batch is not about inventing a new look. It is about tightening the current system so the site loads well, scales across screen sizes, and keeps documentation honest.

---

## What this batch should cover

### 1) Global shell and above-the-fold cleanup

Focus on the shared frame first so every page benefits.

**Surfaces to review:**
- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `app/(app)/layout.tsx`
- `components/nav/header.tsx`
- shared page wrappers and section spacing

**What to improve:**
- header height and spacing
- consistent top/bottom rhythm
- better safe-area handling
- avoid crowded above-the-fold sections
- reduce unnecessary visual noise in the shell

---

### 2) Responsive polish across core routes

Make the important pages work cleanly on phone, tablet, and desktop.

**Core routes to check:**
- public: `/`, `/about`, `/blog`, `/blog/[slug]`, `/collections`, `/contact`, `/map`, `/shop`, `/sprint`, `/places/[slug]`
- app: `/dashboard`, `/profile`, `/submit`
- auth: `/login`, `/signup`

**What to improve:**
- avoid horizontal overflow
- keep tap targets comfortable
- keep cards and sections from feeling cramped
- make typography scale more predictable
- keep layout composition stable across widths

---

### 3) Loading + perceived performance polish

Make the app feel faster and less jumpy.

**Focus areas:**
- loading states and skeletons where missing
- avoid layout shifts
- keep image sizes and spacing predictable
- make transitions feel calm instead of abrupt
- prefer light, purposeful loading feedback over blank waits

---

### 4) Docs and QA hardening

Finish by making sure the docs and verification path still match reality.

**Must verify:**
- every changed page still renders correctly
- mobile and desktop both look intentional
- loading states do not regress
- docs point at the real source of truth
- smoke paths still reflect the actual flow

---

## Execution order

### Step 1, shell + spacing pass

Tighten the shared frame first.

Deliverables:
- cleaner header / shell rhythm
- less dead space above the fold
- more consistent section spacing
- safe-area aware layout where needed

Definition of done:
- the site frame feels calmer and more deliberate
- the same shell works better across the app

---

### Step 2, responsive route sweep

Then sweep the core routes for mobile and tablet issues.

Deliverables:
- improved mobile readability
- no obvious overflow bugs
- better hierarchy on narrow screens
- stable layout behavior on the main routes

Definition of done:
- the site feels good on small screens
- major pages do not break or feel cramped

---

### Step 3, performance feel pass

Make the app feel faster and smoother.

Deliverables:
- loading states where they matter
- reduced layout shift
- calmer transitions
- predictable image and content sizing

Definition of done:
- the app feels quick and controlled
- users are not staring at blank or jumpy screens

---

### Step 4, docs + QA sync

Close the batch by verifying and documenting.

Deliverables:
- update docs if behavior changed
- confirm the route list is still accurate
- keep the docs index and roadmap current
- leave the repo ready for the next batch

Definition of done:
- docs and code agree
- the next person can resume without guessing

---

## Cursor prompt pack

### Prompt 1, global shell and spacing

Read `docs/BRAND_STYLE_GUIDE.md`, `docs/UX_REFERENCE_AWA.md`, and `docs/procedures/IMPLEMENTATION_ROADMAP.md` first. Then inspect the shared shell and layout surfaces, especially `app/layout.tsx`, `app/(public)/layout.tsx`, `app/(app)/layout.tsx`, and `components/nav/header.tsx`.

Tighten the shared frame so the app feels cleaner and more deliberate:
- improve header and top-level spacing
- reclaim dead space above the fold
- keep safe-area handling solid
- keep the shell reusable across public and app routes
- avoid introducing new UI libraries or a new design system

Make minimal-diff changes that improve the overall feel without changing the product direction.

### Prompt 2, responsive route sweep

Sweep the key routes for responsive problems and visual inconsistency.

Check the public pages, auth pages, and signed-in app pages. Fix overflow, cramped spacing, awkward typography jumps, and anything that makes a screen feel unfinished on mobile.

The goal is simple: every major page should feel clean and usable on small screens, not just on a big monitor.

### Prompt 3, loading and perceived performance

Inspect the routes for loading jank, blank states, layout shifts, and other things that make the app feel slow.

Add or improve skeletons, loading states, and transitions where they actually help. Keep the feedback light and calm. Avoid overengineering.

### Prompt 4, docs and QA verification

After the visual and loading work is done, verify the key routes on mobile and desktop and update the docs if anything changed.

Make sure:
- the docs still point to the real source of truth
- the route list is still accurate
- the smoke path and QA docs still match the app
- the repo is left in a shippable state

---

## Useful source docs

- `docs/BRAND_STYLE_GUIDE.md`
- `docs/UX_REFERENCE_AWA.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`
- `docs/proof/QA_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`

---

## Implementation notes (Batch 2 — site polish + performance)

**Shell & safe areas**

- `app/layout.tsx`: `body` uses `min-h-dvh overflow-x-clip` so the document column clips horizontal bleed on small viewports.
- `components/layout/Banner.tsx`: top padding respects `env(safe-area-inset-top)` under `viewportFit=cover`.
- `components/nav/NavClient.tsx`: slightly reduced header / sticky vertical padding; mobile menu uses `max-height` + scroll with `overscroll-y-contain`; sticky reveal threshold aligned to the tighter header.
- `app/globals.css`: `--shell-chrome-height` tuned for hero `min-height` math; `.section-y` vertical rhythm slightly tightened on small breakpoints; route groups use existing `shell-inline` + `shell-pb-safe`.

**Loading & skeletons**

- `components/ui/skeleton.tsx`: `motion-safe:animate-pulse-soft` (Tailwind `pulse-soft` in `tailwind.config.ts`) for calmer loading feedback.
- `app/(public|app|auth)/loading.tsx`: `min-w-0`, `overflow-x-clip`, and stable skeleton heights where helpful.

**Routes**

- Core `main` wrappers: `overflow-x-clip` + `min-w-0` on blog, collections, map, about, contact, sprint, app shell `main`, auth wrapper, and related pages to reduce horizontal overflow.
- `components/home/hero-section.tsx`: hero min-height subtracts bottom safe inset; headline `clamp` softened; left column horizontal padding respects safe-area insets on small screens; `break-words` on the H1.
- `app/(app)/submit/page.tsx` & `app/(app)/places/[slug]/page.tsx`: aligned with `section-y` + `shell-inline` and overflow-safe width constraints.
- `app/(public)/sprint/page.tsx`: task rows use `min-w-0` / `break-words` so long labels do not blow out layout on narrow screens.
