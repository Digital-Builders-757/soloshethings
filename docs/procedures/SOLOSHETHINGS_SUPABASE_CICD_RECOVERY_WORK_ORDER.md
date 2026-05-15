# SoloSHEThings Supabase CI/CD Recovery Work Order

**Execution batch for stabilizing hosted Supabase migration deploys and removing branch-push guesswork.**

**Status (2026-05-15):** Active operational blocker / recovery lane.

**Why this exists:** Product work is no longer the only problem. The repo now has GitHub Actions workflows for hosted Supabase migrations, but the real-world rollout has been noisy: secrets were initially added in the wrong GitHub scopes, project-ref injection failed, then `supabase link` succeeded while `supabase db push` failed on Postgres auth. This work order exists to debug and close that loop cleanly instead of thrashing app code or Vercel deploys.

**Primary source docs:**
- [MIGRATION_PROCEDURE.md](./MIGRATION_PROCEDURE.md)
- [RELEASE_PROCEDURE.md](./RELEASE_PROCEDURE.md)
- [database_schema_audit.md](../database_schema_audit.md)
- [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)
- [MONITORING_SENTRY_POSTURE.md](../proof/MONITORING_SENTRY_POSTURE.md)

**Primary workflow files:**
- [`.github/workflows/supabase-migrations-develop.yml`](../../.github/workflows/supabase-migrations-develop.yml)
- [`.github/workflows/supabase-migrations-main.yml`](../../.github/workflows/supabase-migrations-main.yml)
- [`.github/workflows/lint-and-build.yml`](../../.github/workflows/lint-and-build.yml)

---

## Batch goal

Make hosted Supabase migration deploys boring.

That means:
- a push to `develop` can apply committed migrations to the intended staging Supabase project
- a push to `main` can apply committed migrations to the intended production Supabase project
- failures clearly point to secret/config problems instead of sending the team into random Vercel or app-code edits
- docs explain the difference between **repository secrets**, **environment secrets**, **GitHub Agents secrets**, **Vercel env vars**, and **Supabase project/database credentials** without ambiguity

This is not a product-feature batch. It is an operational reliability batch.

---

## Current symptoms observed so far

### Symptom 1: `--project-ref ""`

Observed failure mode:

```bash
supabase link --project-ref "" --password "$SUPABASE_DB_PASSWORD"
```

What that means:
- the workflow ran
- the project-ref expression evaluated to blank
- GitHub Actions could not see the expected secret value

Most likely causes:
- secret added under **GitHub Agents** instead of **GitHub Actions**
- secret added as an **Environment secret** but workflow had **no `environment:` binding**
- secret added as a **Variable** instead of a **Secret**
- typo in secret name

### Symptom 2: `Finished supabase link` then `password authentication failed`

Observed failure mode:

```bash
Finished supabase link.
Connecting to remote database...
failed SASL auth (FATAL: password authentication failed for user "postgres")
```

What that means:
- GitHub Actions **did** see the project-ref
- GitHub Actions **did** see a DB password env var
- the password value does **not** match the database for that exact Supabase project

Most likely causes:
- wrong DB password copied into the secret
- staging project ref paired with production DB password
- production project ref paired with staging DB password
- password was rotated/reset in Supabase but old value still lives in GitHub

### Symptom 3: local Sentry wizard noise mixed into deploy debugging

Observed confusion:
- Sentry wizard output was treated like a Supabase failure
- app / CI changes risked being made to the wrong system

Important truth:
- Sentry wizard output is **not** the same thing as GitHub Actions migration failure
- Vercel deploys do **not** fix a broken GitHub Actions DB password pairing

---

## What this batch is explicitly trying to fix

### 1) Secret scope clarity

We need one unambiguous rule for each credential category.

**GitHub Actions repository secrets:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_STAGING_PROJECT_ID`
- `SUPABASE_STAGING_DB_PASSWORD`
- `SUPABASE_PRODUCTION_PROJECT_ID`
- `SUPABASE_PRODUCTION_DB_PASSWORD`

**Vercel env vars:**
- app runtime/build values only (`NEXT_PUBLIC_*`, Stripe, Sentry, Resend, etc.)
- **not** the place for hosted Supabase CLI migration credentials

**Supabase dashboard settings:**
- site URL / redirect URLs / SMTP / DB password source of truth
- **not** where GitHub Actions automatically pulls secrets from

**GitHub Agents secrets:**
- irrelevant to Actions workflows unless a separate agent integration explicitly consumes them

### 2) Project ↔ password pairing sanity

We need a trustworthy mapping:

| Branch | GitHub secret pair | Expected remote |
|--------|--------------------|-----------------|
| `develop` | `SUPABASE_STAGING_PROJECT_ID` + `SUPABASE_STAGING_DB_PASSWORD` | Staging Supabase |
| `main` | `SUPABASE_PRODUCTION_PROJECT_ID` + `SUPABASE_PRODUCTION_DB_PASSWORD` | Production Supabase |

This batch must verify the mapping, not just assume it.

### 3) Workflow behavior clarity

The workflows should be easy to reason about:
- read repo secrets
- install pinned Supabase CLI
- `supabase link --project-ref ... --password "$SUPABASE_DB_PASSWORD"`
- `supabase db push --yes`

If environment-scoped secrets are preferred later, wire them deliberately with:

```yaml
environment: develop
```

and/or

```yaml
environment: Production
```

But do not half-switch between repository and environment secrets.

### 4) Error messages and docs that stop the same confusion from happening again

This lane should leave behind:
- clearer docs
- a reproducible validation checklist
- a troubleshooting section for project-ref blank vs DB password mismatch

---

## Non-goals / what NOT to do

- Do **not** change app auth logic just because a migration workflow failed.
- Do **not** assume a fresh Vercel deploy fixes a GitHub Actions DB password problem.
- Do **not** rotate random keys without documenting which system they belong to.
- Do **not** replace repository secrets with environment secrets unless the workflow YAML is updated intentionally.
- Do **not** “fix” this by manually editing historical migrations.
- Do **not** chase unrelated Sentry wizard output unless Sentry build/upload is the actual failing step.

---

## Operational facts to keep in mind

### Fact 1: `supabase link` and `supabase db push` validate different things

`supabase link` can succeed while `supabase db push` fails.

Why:
- `link` proves the CLI can associate with a project ref / management API path
- `db push` still needs a valid Postgres DB password for the linked project

So this sequence:

```bash
Finished supabase link.
...password authentication failed for user "postgres"...
```

means **the password is wrong or mismatched**, not that the workflow syntax is broken.

### Fact 2: GitHub Actions only gets the secrets the workflow is scoped to

If a workflow does **not** declare an environment, it will not receive environment-only secrets.

### Fact 3: Supabase project ref is not the full URL

Correct:

```text
uumpcbnogjpbfmifsqfx
```

Not:
- the full dashboard URL
- quoted JSON
- some pooler host

### Fact 4: `SUPABASE_DB_PASSWORD` is the actual project database password

It is **not**:
- anon key
- service role key
- access token
- SMTP password
- project ref

---

## Recommended execution order

### Step 1: Audit the live workflows and secret model

Read first:
- `.github/workflows/supabase-migrations-develop.yml`
- `.github/workflows/supabase-migrations-main.yml`
- `docs/procedures/MIGRATION_PROCEDURE.md`
- `docs/procedures/RELEASE_PROCEDURE.md`

Confirm:
- exact secret names expected by the workflow
- whether workflows use repository secrets or environment binding
- whether docs match the YAML

**Definition of done:**
- we know exactly what the workflow expects
- no guesswork remains about secret names or scopes

### Step 2: Validate the branch-to-project mapping

Confirm, with evidence, which Supabase project each branch should target.

Minimum verification:
- `develop` should map to a specific staging project ref
- `main` should map to a specific production project ref
- docs should say the same thing

If the repo has drifted and `develop` is serving production traffic, document it explicitly before changing workflow assumptions.

**Definition of done:**
- there is one unambiguous branch → project mapping

### Step 3: Validate the real DB passwords outside the failing workflow

Use the Supabase dashboard as the source of truth.

For each target environment:
1. open the exact project
2. verify the project ref
3. verify or reset the database password
4. update the matching GitHub Actions repository secret

If the password is unknown or suspect, reset it instead of trying to out-guess old values.

**Definition of done:**
- each project has a known-good password paired with its own project ref

### Step 4: Decide whether to stay on repository secrets or move fully to environment secrets

**Preferred short-term:** repository secrets only

Why:
- simplest
- least moving parts
- matches current workflow YAML

**Optional later cleanup:** environment-bound workflows

Only do this if you also update workflow YAML to include:

```yaml
environment: develop
```

and

```yaml
environment: Production
```

**Definition of done:**
- one secret strategy is chosen and consistently implemented

### Step 5: Run the workflows deliberately

Test in this order:
1. `Supabase migrations (staging)` via `workflow_dispatch`
2. once that passes, trigger or observe `develop` push behavior
3. only then validate production workflow with the correct `main` path

Do not test both environments blindly at once.

**Definition of done:**
- one successful staging run proves the pattern
- production remains protected until staging is boring

### Step 6: Improve docs and troubleshooting cues

Make the next person’s job easier by documenting:
- project-ref blank = secret scope / name problem
- `password authentication failed` after link = wrong DB password or wrong pair
- repository secrets vs environment secrets vs GitHub Agents secrets

**Definition of done:**
- future operators can self-diagnose the two common failure modes

---

## Deliverables for this batch

### Required
- hosted Supabase migration workflows run successfully for staging
- docs accurately describe secret placement and failure modes
- branch/project/password mapping documented cleanly

### Strongly preferred
- production workflow also validated once staging is green
- optional workflow comments or README notes clarifying repository-secrets assumption

### Optional
- refactor workflows to use GitHub Environments explicitly
- add a lightweight debug step that safely confirms non-secret values like branch/ref context (do **not** print secrets)

---

## Definition of done

This batch is done when all of the following are true:

- `workflow_dispatch` run for staging passes `supabase link` and `supabase db push`
- `develop` branch push path is trustworthy
- `SUPABASE_STAGING_PROJECT_ID` and `SUPABASE_STAGING_DB_PASSWORD` are confirmed to belong to the same project
- `SUPABASE_PRODUCTION_PROJECT_ID` and `SUPABASE_PRODUCTION_DB_PASSWORD` are confirmed to belong to the same project
- docs explain secret placement unambiguously
- no app-code thrash was introduced to compensate for an ops/config issue

---

## Guardrails for the person/agent doing the work

- Prefer fixing the **credential source** over adding more workflow complexity.
- Prefer **repository secrets** first unless there is a strong reason to adopt environment-bound workflows.
- If a secret may have been exposed in chat/logs, rotate it and document that rotation.
- Do not commit any `.env.*` token files or test/example Sentry pages unless they are intentionally part of a separate batch.
- Keep this batch focused on operational correctness, not feature creep.

---

## Suggested verification checklist

### GitHub / workflow verification
- [ ] `Supabase migrations (staging)` can be run manually via Actions
- [ ] workflow reads the intended secret names
- [ ] logs show non-empty project ref
- [ ] logs show `Finished supabase link`
- [ ] logs show `supabase db push --yes` completes successfully

### Credentials verification
- [ ] staging project ref matches the real staging project dashboard URL
- [ ] staging DB password was confirmed/reset from that same project
- [ ] production project ref matches the real production project dashboard URL
- [ ] production DB password was confirmed/reset from that same project

### Documentation verification
- [ ] `MIGRATION_PROCEDURE.md` still matches reality
- [ ] `RELEASE_PROCEDURE.md` still matches reality
- [ ] any new troubleshooting notes are honest and concise

---

## Prompt pack

Use these one at a time.

### Prompt 1 — audit the current Supabase CI/CD wiring

Read these first, in order:
1. `.github/workflows/supabase-migrations-develop.yml`
2. `.github/workflows/supabase-migrations-main.yml`
3. `docs/procedures/MIGRATION_PROCEDURE.md`
4. `docs/procedures/RELEASE_PROCEDURE.md`
5. `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`

Then inspect the current GitHub Actions secret model and workflow expectations.

Your task:
- confirm exactly which secret names the workflows require
- confirm whether they currently assume repository secrets or environment-bound secrets
- do not change app code
- do not change product behavior
- produce a short, exact diagnosis of why the last run failed

Definition of done:
- failure mode is identified as one of: blank project ref, blank secret injection, wrong DB password, wrong project/password pairing, or workflow syntax bug
- no speculative product-code edits were made

### Prompt 2 — stabilize secret placement and workflow scope

Read `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`, `.github/workflows/supabase-migrations-develop.yml`, and `.github/workflows/supabase-migrations-main.yml` first.

Your task:
- choose one secrets strategy and make it consistent
- preferred default: repository secrets only
- if changing to GitHub Environments, add explicit `environment:` bindings in workflow YAML and update docs to match
- keep secret names stable unless there is a compelling reason to rename them
- do not print or commit secret values

Definition of done:
- workflows and docs agree on where secrets live
- future runs will read the intended secret scope

### Prompt 3 — validate project/password pairing and get staging green

Read `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md` and `docs/procedures/MIGRATION_PROCEDURE.md` first.

Your task:
- validate the `develop` workflow targets the intended staging project
- verify the staging project ref and staging DB password belong to the same Supabase project
- if the password is suspect, document that it must be reset in the dashboard and the GitHub secret updated
- once credentials are confirmed, run or guide a rerun of the staging workflow
- document the exact result

Definition of done:
- staging workflow either passes or fails with a newly narrowed, specific root cause
- the result is written down clearly

### Prompt 4 — production hardening after staging passes

Read `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`, `docs/procedures/RELEASE_PROCEDURE.md`, and the current workflow YAML first.

Your task:
- only after staging is green, validate the `main` workflow path
- confirm production ref/password pairing
- confirm docs describe any manual storage follow-up (`docs/supabase/storage_setup_dashboard.sql`)
- keep this conservative and operator-safe

Definition of done:
- production path is trusted or has one explicit blocker documented

### Prompt 5 — finalize docs and operational handoff

Read `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`, `docs/procedures/MIGRATION_PROCEDURE.md`, `docs/procedures/RELEASE_PROCEDURE.md`, and `docs/DOCUMENTATION_INDEX.md` first.

Your task:
- make sure docs now reflect the final working secret placement and debugging rules
- add troubleshooting notes only where they are truly source-of-truth material
- do not duplicate the same explanation across many docs
- leave a concise operational handoff for the next person

Definition of done:
- docs are truthful, minimal, and enough to keep the issue from repeating

---

## Final note for whoever picks this up

If the next failure says:

```text
--project-ref ""
```

look at secret scope / name injection first.

If the next failure says:

```text
Finished supabase link.
...password authentication failed...
```

stop changing YAML and fix the actual project/password pairing.

Do not make the app absorb an infrastructure mistake.
