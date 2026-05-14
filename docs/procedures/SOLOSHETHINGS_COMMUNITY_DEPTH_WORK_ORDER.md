# SoloSHEThings Community Depth Work Order

**Execution batch for the next real product lane after billing shipped.**

**Status (2026-05-15):** Core discovery depth slice is **implemented** (`place_label`, capped `story_tags`, `/places` narrowing + facets, deterministic related ranking, photo alt + reorder). Remaining backlog items below (saved/report/reporting polish, richer presentation) stay valid until individually checked off.

**Prompt pack reconciliation (2026-05-17):** **Prompt 1–3** align with this shipped lane. **Prompt 4** — QA/docs: use `npm run typecheck`, `npm run lint`, `npm run build`; review `QA_CHECKLIST`, `MVP_SMOKE_CHECKLIST`, `MONITORING_SENTRY_POSTURE`; manually spot-check `/places`, `/places/[slug]`, `/saved`, `/reports`, `/submit`.

Source docs: [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [MVP_STATUS_NOTION.md](../MVP_STATUS_NOTION.md), [DATA_ACCESS_QUERY_CONTRACT.md](../contracts/DATA_ACCESS_QUERY_CONTRACT.md), [UPLOADS_STORAGE_CONTRACT.md](../contracts/UPLOADS_STORAGE_CONTRACT.md), [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md), [QA_CHECKLIST.md](../proof/QA_CHECKLIST.md), and [E2E_SMOKE_PATHS.md](../proof/E2E_SMOKE_PATHS.md).

---

## Batch goal

Take the already-real community/member surfaces and make them feel meaningfully deeper, smarter, and more usable without breaking privacy boundaries or inventing fake scope.

This batch is about turning the current first-pass member experience into something that feels intentionally productized.

---

## What this batch should cover

### 1) Taxonomy + location-aware discovery

Make discovery stronger than simple text search and member filters.

**Primary surfaces:**
- `app/(app)/places/page.tsx`
- `app/(app)/places/[slug]/page.tsx`
- `app/(app)/saved/page.tsx`
- `app/(app)/reports/page.tsx`
- related query helpers in `lib/queries/`

**What to improve:**
- discovery facets grounded in real post data
- location-aware browsing if the schema already supports it or can support it honestly
- stronger filter composition and clearer active-filter state
- preserving context when moving between browse/detail/history surfaces

**Definition of done:**
- discovery is better than plain keyword/member matching
- filter state is understandable and preserved
- no private data leaks through new discovery helpers

---

### 2) Recommendation / related-story depth

Make story detail and browse surfaces feel more connected.

**Primary surfaces:**
- `app/(app)/places/[slug]/page.tsx`
- `app/(app)/places/page.tsx`
- any related-story or recommendation helpers

**What to improve:**
- related-story ranking grounded in actual metadata
- better “continue exploring” paths from detail pages
- stronger use of featured, photo-rich, author, taxonomy, and location signals where available
- honest empty states when there is not enough signal

**Definition of done:**
- story detail is not a dead end
- recommendation logic is more useful than the current first pass
- logic stays deterministic and explainable

---

### 3) Richer image-management follow-through

Finish the most obvious gaps in post media handling.

**Primary surfaces:**
- `app/(app)/submit/page.tsx`
- `app/(app)/places/[slug]/page.tsx`
- `app/actions/community-posts.ts`
- `lib/storage/post-images.ts`
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`

**What to improve:**
- image reordering if the data model already supports order cleanly
- image replacement flows where appropriate
- alt/caption support if it can be added honestly in one coherent pass
- better image viewing/presentation where current UX still feels thin

**Definition of done:**
- post media management is materially more complete
- no brittle multi-step media flow is introduced
- docs reflect the actual storage/media rules

---

### 4) Community UX polish discovered during real QA

Use this batch to fix small, high-value friction points that show up while doing the work above.

**Allowed examples:**
- awkward filter labels
- weak empty-state copy
- broken context preservation
- obvious mobile issues in community surfaces
- confusing save/report/owner affordances

**Definition of done:**
- community surfaces feel more deliberate and less first-draft
- fixes stay within this lane and do not turn into a redesign project

---

## Execution order

### Step 1, discovery model pass

Start with the browse/detail query model and decide the strongest honest discovery facets.

Deliverables:
- improved browse filters
- stronger active-filter visibility
- deterministic data/query behavior

Definition of done:
- discovery is materially stronger and still easy to reason about

---

### Step 2, recommendation pass

Then make story detail help members continue exploring.

Deliverables:
- better related-story logic
- stronger contextual wayfinding from detail back into browse
- honest empty/fallback states

Definition of done:
- detail pages feel connected to the rest of the community space

---

### Step 3, media management pass

Then close the highest-value image-management gaps.

Deliverables:
- richer owner media controls
- clearer media presentation
- docs updates where behavior changed

Definition of done:
- media handling feels like a real product feature instead of a partial admin utility

---

### Step 4, QA + docs sync

Finish by verifying and documenting the final state.

Deliverables:
- docs/status updated only where behavior changed
- smoke paths still honest
- repo left ready for the next batch

Definition of done:
- the next person can resume without guessing

---

## Constraints

- No fake AI recommendation layer
- No privacy regressions
- No speculative big schema rewrite unless absolutely required and documented
- No new UI library
- No broad redesign outside community surfaces
- Prefer minimal-diff, high-leverage improvements

---

## Verification requirements

Before calling this batch done:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- manually verify `/places`, `/places/[slug]`, `/saved`, `/reports`, and `/submit`
- confirm existing auth/private visibility rules still hold
- update docs if any user-visible behavior changed

---

## Cursor prompt pack

### Prompt 1, discovery model and filters

Read `docs/procedures/IMPLEMENTATION_ROADMAP.md`, `docs/MVP_STATUS_NOTION.md`, `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`, `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`, and `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md` first.

Then inspect the current community browse/history/detail surfaces (`/places`, `/places/[slug]`, `/saved`, `/reports`, `/submit`) and their query helpers.

Implement the next honest discovery pass:
- strengthen browse filters beyond keyword/member-only matching
- use taxonomy/location signals if the data model already supports them or can support them cleanly
- preserve active filter context when moving between list/detail/history surfaces
- keep private/public visibility rules intact
- keep the UI honest and understandable

Do not start moderation/admin work yet.
Do not invent a fake recommendation engine.

Definition of done:
- discovery is materially better
- filters/context are preserved cleanly
- privacy rules still hold
- docs updated if behavior changed
- typecheck/lint/build pass

### Prompt 2, related stories and wayfinding

Read `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`, `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`, and the current `/places/[slug]` implementation.

Improve the story-detail follow-through:
- make related stories/recommendations more useful and more grounded in real metadata
- improve “continue exploring” paths back into the feed or other relevant filtered views
- prefer explainable ranking signals like author, featured state, media richness, taxonomy, and location
- keep empty states honest when not enough signal exists

Definition of done:
- story detail no longer feels like a dead end
- recommendation logic is stronger than the current first pass
- typecheck/lint/build pass

### Prompt 3, media management follow-through

Read `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md` and `docs/contracts/UPLOADS_STORAGE_CONTRACT.md` first.

Finish the next media-management pass for community posts:
- add the highest-value missing owner media controls (for example reorder, replace, metadata support) only if they can be implemented cleanly
- improve image presentation where the current experience still feels thin
- keep storage/privacy rules honest and documented
- avoid turning this into a giant upload-system rewrite

Definition of done:
- media handling is materially more complete
- storage rules stay correct
- docs updated where needed
- typecheck/lint/build pass

### Prompt 4, QA and docs sync

Read `docs/proof/QA_CHECKLIST.md`, `docs/proof/E2E_SMOKE_PATHS.md`, `docs/procedures/IMPLEMENTATION_ROADMAP.md`, and `docs/MVP_STATUS_NOTION.md` first.

Do the final verification pass for this batch:
- check `/places`, `/places/[slug]`, `/saved`, `/reports`, `/submit`
- verify new discovery/media flows on mobile and desktop
- update status/docs only where behavior actually changed
- leave the repo in a clean handoff state for the next batch

Definition of done:
- the docs tell the truth
- the community depth batch is verified
- the repo is ready for moderation/admin follow-through
