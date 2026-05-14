# SoloSHEThings Finish-Line Roadmap

**Purpose:** define the next build order after the May 2026 catch-up / smoke / release milestone.

This roadmap is the current "what to build next" spine. It does **not** replace the historical catch-up roadmap. It starts where the current release milestone ends.

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

What still needs deliberate finishing work:
- auth reliability needs another honest test pass
- the dashboard should feel more like a real home base
- the public frontend needs a stronger visual system and more premium rhythm
- the docs need to stop drifting away from the actual code
- prompt packs need to be prepared in a reusable way so future work stays organized

---

## Roadmap order

### 1) Auth reliability and session sanity

**Goal:** make login, signup, logout, protected routing, and profile repair feel boring and dependable.

**Work order:** `docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md`

**Definition of done:**
- auth redirects are stable
- no loop between login / dashboard / profile
- profile repair is bounded
- signed-in and signed-out nav states stay honest
- docs match the actual auth behavior

---

### 2) Dashboard and frontend visual system

**Goal:** turn the dashboard into a proper home base and raise the visual quality of the whole site.

**Work order:** `docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md`

**Definition of done:**
- dashboard reads as the product home
- public pages feel cohesive with the app shell
- typography, spacing, cards, and CTAs feel intentional
- mobile feels polished instead of merely responsive
- the visual language is documented clearly

---

### 3) Docs + prompt pipeline

**Goal:** make the documentation spine trustworthy, compact, and ready for future Cursor prompts.

**Work order:** `docs/procedures/SOLOSHETHINGS_DOCS_PROMPT_PIPELINE_WORK_ORDER.md`

**Definition of done:**
- docs index points at the real source docs
- stale guidance is either fixed or flagged as historical
- the repo has a repeatable way to turn work orders into prompts
- future batches can start without re-discovering the same context

---

### 4) Build-out backlog beyond the finish line

After the three batches above, resume product work from the broader roadmap and source contracts.

Likely next lanes:
- public/home refinement
- profile continuity and content creation
- any remaining auth edge cases found in real testing
- feature expansion batches that are explicitly approved later

---

## Execution rules

- Work top to bottom.
- Do not start the next batch until the current one is verified.
- Update docs in the same batch when behavior changes.
- Keep changes minimal in each batch, but complete enough to ship.
- If auth is still flaky, fix auth before chasing prettier UI.

---

## Prompt handoff rule

Each batch should have a dedicated work order and a dedicated Cursor prompt section.

When the batch is ready to implement:
1. read the relevant work order
2. read the relevant source docs
3. implement only that batch
4. verify it
5. update docs before moving on
