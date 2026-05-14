# SoloSHEThings Work Queue

Use this folder as the execution handoff layer, but keep the sources of truth narrow.

## Start here

1. `docs/procedures/IMPLEMENTATION_ROADMAP.md` — **canonical active plan**
2. `docs/MVP_STATUS_NOTION.md` — **canonical shipped status + progress history**
3. the contract docs for the lane you are touching
4. the proof docs for the lane you are touching

## Historical checkpoint docs

These are useful context, but they are **not** the active queue:
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md`

## Historical work-order docs

These are completed batch records unless a regression explicitly reopens them:
- `docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_DOCS_PROMPT_PIPELINE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SITE_POLISH_PERFORMANCE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_LAUNCH_HARDENING_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SMOKE_AND_RELEASE_WORK_ORDER.md`

## Active queue snapshot (2026-05-14)

1. Finish the in-progress observability + error UX hardening batch
2. Stripe subscription integration and premium gating
3. Community second-pass depth (taxonomy/location discovery, richer recommendations, richer image management)
4. Moderation/admin surfaces and deeper owner lifecycle controls
5. Newsletter + marketing operations follow-through

## Pause / handoff note

If this repo is being paused so another tool or person can take over:
- resume from `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- treat the observability + error UX batch as the current unfinished batch
- verify with `npm run typecheck`, `npm run lint`, and `npm run build` before starting new feature work
- only then continue into Stripe/premium gating

## Rules

- Work from `IMPLEMENTATION_ROADMAP.md`, not from old batch docs.
- Use `MVP_STATUS_NOTION.md` for what is already shipped.
- If a regression appears in auth, access control, billing, or data safety, fix that before continuing the queue.
- Keep docs and code aligned in the same batch.
