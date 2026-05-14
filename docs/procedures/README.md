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

## Active work-order docs

These are the current execution docs:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`

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

1. Community second-pass depth (`SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`)
2. Moderation/admin surfaces and deeper owner lifecycle controls (`SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`)
3. Newsletter + marketing operations follow-through (`SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`)

## Pause / handoff note

If this repo is being paused so another tool or person can take over:
- resume from `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- start with `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`
- verify with `npm run typecheck`, `npm run lint`, and `npm run build` before calling any batch done
- only then move into the post-launch backlog work order

## Rules

- Work from `IMPLEMENTATION_ROADMAP.md`, not from old batch docs.
- Use `MVP_STATUS_NOTION.md` for what is already shipped.
- If a regression appears in auth, access control, billing, or data safety, fix that before continuing the queue.
- Keep docs and code aligned in the same batch.
