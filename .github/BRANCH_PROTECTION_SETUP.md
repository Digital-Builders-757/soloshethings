# Branch Protection Setup Guide

This guide explains how to configure GitHub branch protection rulesets for `main` and `develop` branches.

## Prerequisites

- Admin access to the repository
- GitHub Actions workflows are set up (see `.github/workflows/`)

## Step 1: Create Ruleset for `main` Branch

1. Go to **Settings** → **Rules** → **Rulesets** → **New ruleset**
2. Select **Branch ruleset**
3. Configure:

   **Enforcement status:**
   - Set to **Active** (not Disabled)

   **Target branches:**
   - Click **Add target**
   - Choose **Include**
   - Choose **by pattern**
   - Enter: `main`
   - Save

4. **Rules to enable:**

   ✅ **Require a pull request before merging**
   - Required number of approvals: 1 (or 0 if solo)
   - Dismiss stale pull request approvals when new commits are pushed: ✅

   ✅ **Require status checks to pass before merging**
   - Required status checks:
     - `lint` (from `lint-and-build.yml`)
     - `build` (from `lint-and-build.yml`)
     - `enforce` (from `require-develop-into-main.yml`)
   - ✅ **Require branches to be up to date before merging**

   ✅ **Block force pushes**
   ✅ **Block deletions**
   ✅ **Require linear history** (optional, for squash-only merges)

5. Save the ruleset

## Step 2: Create Ruleset for `develop` Branch

1. Go to **Settings** → **Rules** → **Rulesets** → **New ruleset**
2. Select **Branch ruleset**
3. Configure:

   **Enforcement status:**
   - Set to **Active**

   **Target branches:**
   - Click **Add target**
   - Choose **Include**
   - Choose **by pattern**
   - Enter: `develop`
   - Save

4. **Rules to enable:**

   ✅ **Require a pull request before merging**
   - Required number of approvals: 0 (or 1+ if team)
   - Dismiss stale pull request approvals when new commits are pushed: ✅

   ✅ **Require status checks to pass before merging**
   - Required status checks:
     - `lint` (from `lint-and-build.yml`)
     - `build` (from `lint-and-build.yml`)
   - ✅ **Require branches to be up to date before merging**

   ✅ **Block force pushes**
   ✅ **Block deletions**

5. Save the ruleset

## Step 3: Verify Setup

After creating both rulesets:

1. Check **Settings** → **Rules** → **Rulesets**
2. Both rulesets should show:
   - **Enforcement:** Active
   - **Applies to:** 1 target (or "Default branch" for main)

## Workflow Status Checks

The following status checks will appear in PRs:

- **`lint`** - Runs ESLint with `--max-warnings 0`
- **`build`** - Builds Next.js application
- **`enforce`** - Verifies PRs into main come from develop (main branch only)

## Testing the Setup

1. **Test develop protection:**
   - Create a feature branch from `develop`
   - Open PR into `develop`
   - Verify `lint` and `build` checks run
   - Verify PR can be merged only after checks pass

2. **Test main protection:**
   - Open PR from `develop` into `main`
   - Verify all three checks run (`lint`, `build`, `enforce`)
   - Verify PR can be merged only after all checks pass
   - Try opening PR from a different branch into `main` → should fail `enforce` check

## Troubleshooting

**"This ruleset applies to 0 branches/tags"**
- Check that "Target branches" is configured
- Verify pattern matches branch name exactly (`main` or `develop`)

**Status checks not appearing**
- Ensure workflows are in `.github/workflows/` directory
- Check workflow file syntax (YAML)
- Verify workflow triggers match PR events
- Check Actions tab for workflow run errors

**"Require develop into main" check not running**
- Verify workflow file exists: `.github/workflows/require-develop-into-main.yml`
- Check workflow triggers: `pull_request: branches: [main]`
- Ensure workflow is enabled in repository settings

## Reference

- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Creating Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [Available Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
