# SoloSHEThings Work Queue

Use this folder as the execution handoff layer, but keep the sources of truth narrow.

## Start here

1. `docs/procedures/IMPLEMENTATION_ROADMAP.md` — **canonical active plan**
2. `docs/MVP_STATUS_NOTION.md` — **canonical shipped status + progress history**
3. `docs/procedures/IMPLEMENTATION_HANDOFF_GUIDE.md` — onboarding + access handoff for any new contributor
4. the contract docs for the lane you are touching
5. the proof docs for the lane you are touching

## Historical checkpoint docs

These are useful context, but they are **not** the active queue:
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md`

## Active work-order docs

These are the current execution docs:
- `docs/procedures/IMPLEMENTATION_HANDOFF_GUIDE.md`
- `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`

## Visual system prompt packs

Implementation pointers live in **`docs/BRAND_STYLE_GUIDE.md`** (section **Signed-in & community surfaces**). Use these procedures as scoped sub-batches underneath the broader UI/UX catch-up plan, not as separate competing queues:

- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`

## Historical work-order docs

These are completed batch records unless a regression explicitly reopens them:
- `docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_DOCS_PROMPT_PIPELINE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SITE_POLISH_PERFORMANCE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_LAUNCH_HARDENING_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SMOKE_AND_RELEASE_WORK_ORDER.md`

## Active queue snapshot (2026-05-15)

1. Supabase CI/CD recovery + hosted migration debugging (`SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`)
2. Safe parallel lane: UI/UX catch-up pass for dashboard, blog, member surfaces, empty states, trust/safety, and mobile polish (`SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`)
3. Community second-pass depth (`SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`)
4. Moderation/admin surfaces and deeper owner lifecycle controls (`SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`)
5. Newsletter + marketing operations follow-through (`SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`)

## Pause / handoff note

If this repo is being paused so another tool or person can take over:
- resume from `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- hand them `docs/procedures/IMPLEMENTATION_HANDOFF_GUIDE.md` first
- if hosted migrations / deploy plumbing are failing, start with `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`
- if the work is visual/UI-only and avoids schema/RLS/auth/billing changes, start with `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- otherwise start with `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md`
- verify with `npm run typecheck`, `npm run lint`, and `npm run build` before calling any batch done
- only then move into the post-launch backlog work order

## Rules

- Work from `IMPLEMENTATION_ROADMAP.md`, not from old batch docs.
- Use `MVP_STATUS_NOTION.md` for what is already shipped.
- If a regression appears in auth, access control, billing, or data safety, fix that before continuing the queue.
- Keep docs and code aligned in the same batch.
