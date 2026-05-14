# SoloSHEThings Finish-Line Roadmap

**Purpose:** define the next build order after the May 2026 catch-up / smoke / release milestone.

This roadmap records the post-catch-up finishing pass that followed the May 2026 release milestone. It does **not** replace the historical catch-up roadmap, and it is no longer the active execution queue once the batches below are verified.

**Source docs:**
- `docs/DOCUMENTATION_INDEX.md`
- `docs/PROJECT_CONTEXT_PROMPT.md`
- `docs/ARCHITECTURE_CONSTITUTION.md`
- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`

---

## Current state

The auth, dashboard, shell, polish, launch-hardening, and smoke/release catch-up batches are treated as completed for the May 2026 milestone.

The first three finish-line batches are now also implemented and verified on `develop`:
- auth reliability and session sanity
- dashboard and frontend visual system cleanup
- docs honesty, prompt pipeline, and queue cleanup
- Next.js route protection migrated from deprecated `middleware.ts` to `proxy.ts`

What still needs deliberate product work beyond this checkpoint:
- profile continuity still needs a real uploads / avatar system
- Stripe subscription flow and premium gating are still missing
- content creation and broader member/community surfaces still need implementation
- real-world QA may still uncover auth edge cases worth a follow-up batch

---

## Roadmap order

### 1) Auth reliability and session sanity ✅ completed

**Goal:** make login, signup, logout, protected routing, and profile repair feel boring and dependable.

**Work order:** `docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md`

**Definition of done:**
- auth redirects are stable
- no loop between login / dashboard / profile
- profile repair is bounded
- signed-in and signed-out nav states stay honest
- docs match the actual auth behavior

---

### 2) Dashboard and frontend visual system ✅ completed

**Goal:** turn the dashboard into a proper home base and raise the visual quality of the whole site.

**Work order:** `docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md`

**Definition of done:**
- dashboard reads as the product home
- public pages feel cohesive with the app shell
- typography, spacing, cards, and CTAs feel intentional
- mobile feels polished instead of merely responsive
- the visual language is documented clearly

---

### 3) Docs + prompt pipeline ✅ completed

**Goal:** make the documentation spine trustworthy, compact, and ready for future Cursor prompts.

**Work order:** `docs/procedures/SOLOSHETHINGS_DOCS_PROMPT_PIPELINE_WORK_ORDER.md`

**Definition of done:**
- docs index points at the real source docs
- stale guidance is either fixed or flagged as historical
- the repo has a repeatable way to turn work orders into prompts
- future batches can start without re-discovering the same context

---

### 4) Build-out backlog beyond the finish line

After the three completed batches above, resume product work from the broader roadmap and source contracts.

Recommended next lanes:
- profile continuity, uploads, and avatar system
- Stripe subscription integration and premium gating
- content creation, member posts, and broader community/private surfaces
- any remaining auth edge cases found in real testing while those lanes land

---

## Execution rules

- Treat batches 1-3 as completed checkpoints unless new regressions are found.
- Resume product work from batch 4 and the broader implementation roadmap.
- Update docs in the same batch when behavior changes.
- Keep changes minimal in each batch, but complete enough to ship.
- If auth becomes flaky again, fix auth before chasing prettier UI.

---

## Prompt handoff rule

Each batch should have a dedicated work order and a dedicated Cursor prompt section.

When the batch is ready to implement:
1. read the relevant work order
2. read the relevant source docs
3. implement only that batch
4. verify it
5. update docs before moving on
