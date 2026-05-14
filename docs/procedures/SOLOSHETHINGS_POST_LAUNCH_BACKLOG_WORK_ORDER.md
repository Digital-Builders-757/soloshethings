# SoloSHEThings Post-Launch Backlog Work Order

**Execution batch for the first major pass after the core member product feels launch-ready.**
Source docs: [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [MVP_STATUS_NOTION.md](../MVP_STATUS_NOTION.md), [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md), [DATA_ACCESS_QUERY_CONTRACT.md](../contracts/DATA_ACCESS_QUERY_CONTRACT.md), [SECURITY_INVARIANTS.md](../SECURITY_INVARIANTS.md), [QA_CHECKLIST.md](../proof/QA_CHECKLIST.md), [E2E_SMOKE_PATHS.md](../proof/E2E_SMOKE_PATHS.md), and [MONITORING_SENTRY_POSTURE.md](../proof/MONITORING_SENTRY_POSTURE.md).

**Cursor prompt pack (2026-05-17):** **Prompt 1** moderator queue + RPCs ✅ — **Prompt 2** truthful `marketing_interest` homepage capture ✅ — **Prompt 3** Sentry `product_signal.*` funnel layer ✅ (`lib/analytics/product-signals.ts`).

---

## Batch goal

Define the first coherent backlog after the core launch-ready product lanes are finished.

This is not one giant “do everything eventually” list. It is the structured handoff for the next wave of work once the core member experience is solid enough to launch and learn from.

---

## What belongs in this backlog

### 1) Moderation + admin operations

Broaden the operational surface so the product is manageable as usage grows.

**Primary targets:**
- report review and resolution workflows
- admin/operator visibility into member content issues
- role-safe admin tools for community oversight
- deeper owner lifecycle support when self-service is not enough

**Definition of done for this lane:**
- moderation work is materially more usable
- role boundaries stay explicit and safe
- docs/contracts reflect any new admin capabilities

---

### 2) Newsletter + marketing operations

Replace placeholder marketing capture with a real operating loop.

**Primary targets:**
- honest newsletter signup / lead capture flow
- clear provider or delivery workflow
- truthful marketing CTA behavior
- documented operational ownership and follow-through

**Definition of done for this lane:**
- public marketing/signup flows are honest and operationally usable
- no fake success states remain
- docs reflect the real workflow

---

### 3) Analytics + product instrumentation

Add enough instrumentation to learn from usage without turning the app into surveillance sludge.

**Primary targets:**
- route/action analytics for key product flows
- subscription funnel visibility
- community usage signals
- admin/ops visibility where helpful
- observability expansion only where it helps decision-making

**Definition of done for this lane:**
- the team can answer basic product questions with real data
- instrumentation is documented and privacy-conscious

---

### 4) Future stretch work (only if justified)

This is the place for later-scope features that are not required for the first strong launch-ready version.

**Examples:**
- messaging/realtime
- comments/reactions
- events/workshops workflows
- deeper automation around editorial or marketing

These should not jump the queue ahead of real product-management, operations, and learning needs.

---

## What does NOT belong here yet

- fixing regressions in auth, billing, access control, or data safety
- unfinished core community-depth work from the active execution plan
- random polish that should have been closed in earlier batches
- speculative features with no product/ops justification

If any of those show up, route them back to the active roadmap instead of burying them in “post-launch backlog.”

---

## Recommended execution order

### Step 1, moderation/admin follow-through

Do this first so the product is governable.

Deliverables:
- stronger report handling
- clearer admin/operator workflows
- deeper owner recovery/support paths

Definition of done:
- the community can be operated responsibly as usage increases

---

### Step 2, newsletter + marketing operations

Then make public-facing growth mechanics real.

Deliverables:
- truthful newsletter/lead flow
- clear operational handling
- updated CTA behavior and docs

Definition of done:
- marketing promises match operational reality

---

### Step 3, analytics + learning loop

Then instrument the product enough to learn from what ships.

Deliverables:
- meaningful event coverage
- documented metrics/ownership
- privacy-conscious instrumentation choices

Definition of done:
- the team can learn from the product without guesswork

---

## Verification requirements

Every lane pulled from this backlog should end with:
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- targeted manual verification for the surfaces touched
- docs/status updates for any user-visible or operator-visible behavior changes

---

## Cursor prompt pack

### Prompt 1, moderation/admin operations

Read `docs/procedures/IMPLEMENTATION_ROADMAP.md`, `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`, `docs/MVP_STATUS_NOTION.md`, `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`, `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`, and `docs/SECURITY_INVARIANTS.md` first.

Implement the first real moderation/admin follow-through pass:
- improve report review and resolution workflows
- add role-safe admin/operator visibility where genuinely needed
- improve owner recovery/support flows beyond the current first-pass lifecycle tools
- keep role boundaries explicit and safe
- keep the changes minimal but operationally meaningful

Do not drift into analytics or newsletter work yet.

Definition of done:
- moderation/admin work is materially more usable
- access rules remain correct and documented
- typecheck/lint/build pass

### Prompt 2, newsletter + marketing operations

Read `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`, `docs/MVP_STATUS_NOTION.md`, `docs/DOCUMENTATION_INDEX.md`, and inspect the current public CTA/newsletter surfaces.

Implement the first honest newsletter/marketing operations pass:
- remove any remaining fake or ambiguous signup behavior
- create a real lead/newsletter flow if the repo/environment supports it
- if full automation is still not supportable, implement the cleanest honest operational interim state and document it clearly
- keep marketing copy aligned with the actual product and workflow

Definition of done:
- newsletter/lead capture is honest and usable
- docs reflect reality
- typecheck/lint/build pass

### Prompt 3, analytics + product instrumentation

Read `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`, `docs/MVP_STATUS_NOTION.md`, `docs/proof/MONITORING_SENTRY_POSTURE.md`, and the existing billing/community flows first.

Implement a first-pass analytics/instrumentation layer that helps the team learn:
- instrument key product flows (signup, subscribe, submit, browse depth, save/report where appropriate)
- keep it privacy-conscious and documented
- avoid noisy event spam or speculative dashboards with no consumers
- make sure the instrumentation model is understandable by the next person

Definition of done:
- key learning flows are instrumented
- docs reflect the event model / ownership / limits
- typecheck/lint/build pass

**Repo alignment (2026-05-17):** Coarse **`product_signal`** instrumentation ships via [`lib/analytics/product-signals.ts`](../../lib/analytics/product-signals.ts); source-of-truth narrative + signal table live in [`MONITORING_SENTRY_POSTURE.md`](../proof/MONITORING_SENTRY_POSTURE.md).
