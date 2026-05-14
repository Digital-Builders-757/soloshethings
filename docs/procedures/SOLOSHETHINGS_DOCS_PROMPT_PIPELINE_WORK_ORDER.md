# SoloSHEThings Docs + Prompt Pipeline Work Order

**Execution batch for documentation honesty, roadmap cleanup, and reusable prompt prep.**
Source docs: `docs/DOCUMENTATION_INDEX.md`, `docs/procedures/README.md`, `docs/procedures/IMPLEMENTATION_ROADMAP.md`, `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`, `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md`, `docs/BRAND_STYLE_GUIDE.md`, `docs/contracts/AUTH_CONTRACT.md`, `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`, and `docs/runbooks/DEBUG_AUTH.md`.

---

## Batch goal

Make the docs spine trustworthy again, then make it easy to turn that spine into future prompts.

This batch is the cleanup and enablement pass that keeps the next work from rediscovering the same context over and over.

---

## What this batch should cover

### 1) Documentation honesty sweep

Find stale or conflicting guidance and fix it in the canonical doc.

**Focus areas:**
- queue order in `docs/procedures/README.md`
- current build order in `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- catch-up history in `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- finish-line order in `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md`
- brand / design language in `docs/BRAND_STYLE_GUIDE.md`
- auth rules and troubleshooting in `docs/contracts/AUTH_CONTRACT.md` and `docs/runbooks/DEBUG_AUTH.md`

**What to fix:**
- outdated queue pointers
- references to completed work as if it were still current
- design tokens or brand rules that do not match the implementation
- auth guidance that no longer matches the actual flow

---

### 2) Prompt-ready batch structure

Make future implementation prompts easy to generate and reuse.

**What to produce:**
- one clear work order per batch
- a cursor prompt block at the bottom of each work order
- a consistent order for reading source docs first
- a clear definition of done and verification block

**Rule:** do not create duplicate prompt copies in random places. The work order is the source of truth for that batch.

---

### 3) Cross-reference cleanup

Make the docs index and queue entry point point at the same things.

**Primary surfaces:**
- `docs/DOCUMENTATION_INDEX.md`
- `docs/procedures/README.md`
- any roadmap or status doc that points at the next batch

**What to improve:**
- the current queue should be obvious within a few seconds
- old milestones should be clearly historical
- the reader should not have to guess which doc is current

---

### 4) Status / progress alignment

Make sure status docs describe the current state instead of yesterday’s state.

**Likely targets:**
- `docs/MVP_STATUS_NOTION.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- any status callout that implies the project is farther along or less finished than it really is

**What to fix:**
- update progress language to match the actual next batches
- keep the language honest about what still needs work
- avoid claiming a surface is “done” if users still experience bugs

---

## Acceptance criteria

- docs index matches the real doc tree
- procedures README points at the current queue
- brand / auth docs match current implementation direction
- prompt-ready work orders are easy to reuse later
- stale guidance is removed, clarified, or marked historical

---

## Verification

Run a docs QA pass:
- read the docs spine top to bottom
- check for contradictions between index, roadmap, and work orders
- verify there is one obvious current queue
- check that auth and design docs match the code direction

If code changed as part of the docs cleanup, run:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Definition of done

This batch is done when:
- a future implementation prompt can be generated from the docs without extra archaeology
- the docs stop contradicting each other
- the current queue is obvious
- the repo is easier to resume after time away

---

## Cursor handoff prompt

Use this prompt in Cursor:

```md
You are working in the SoloSHEThings repo.

Goal: clean up the documentation spine so it is honest, current, and ready to generate future implementation prompts from.

Read first:
- docs/DOCUMENTATION_INDEX.md
- docs/procedures/README.md
- docs/procedures/IMPLEMENTATION_ROADMAP.md
- docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md
- docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md
- docs/BRAND_STYLE_GUIDE.md
- docs/contracts/AUTH_CONTRACT.md
- docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md
- docs/runbooks/DEBUG_AUTH.md

Important repo context:
- one topic should have one source of truth
- the current queue should be obvious
- prompt packs should live inside the work orders for their batch
- if the docs disagree with the code, fix the docs and the source doc, not random duplicates

Implement this batch with these constraints:
- do not create duplicate docs for the same topic
- update the canonical doc instead of scattering the same guidance
- keep work-order prompt blocks reusable and clear
- mark historical docs as historical if they are no longer the current queue
- keep the docs honest about auth and UI direction

Acceptance criteria:
- the docs index points at the right files
- the queue entry point points at the current finish-line roadmap
- brand/auth/status docs do not contradict the implementation direction
- future prompts can be generated from the work orders cleanly

After coding:
1. update `docs/DOCUMENTATION_INDEX.md` and any other canonical docs touched by the batch
2. review for stale or contradictory language one more time
3. summarize the doc changes, the exact files changed, and any remaining drift risk
```
