# SoloSHEThings Frontend System Work Order

**Execution batch for the dashboard, public home surfaces, and the shared visual system.**
Source docs: [BRAND_STYLE_GUIDE.md](../BRAND_STYLE_GUIDE.md), [UX_REFERENCE_AWA.md](../UX_REFERENCE_AWA.md), [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md), [SOLOSHETHINGS_FINISH_LINE_ROADMAP.md](./SOLOSHETHINGS_FINISH_LINE_ROADMAP.md), and the actual app shell / page surfaces in `app/` and `components/`.

---

## Batch goal

Make SoloSHEThings feel like a real product.

The dashboard should feel like a home base. The public homepage should feel editorial and confident. The shell should feel cohesive across public and authenticated surfaces. The mobile experience should stay polished, not just functional.

This is the batch where the front end gets its real personality.

---

## What this batch should cover

### 1) Dashboard as home base

Use the signed-in dashboard as the strongest proof of the product.

**Primary surfaces:**
- `app/(app)/dashboard/page.tsx`
- `app/(app)/layout.tsx`
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`
- `components/profile/profile-form.tsx`
- `components/profile/profile-error-fallback.tsx`

**What to improve:**
- hero hierarchy and welcome state
- clearer primary and secondary actions
- account/profile visibility at a glance
- better card rhythm and section density
- more polished mobile spacing
- less placeholder energy, more product-home energy

---

### 2) Public homepage and editorial surfaces

Give the marketing/home surface the same level of intent.

**Primary surfaces:**
- `app/(public)/page.tsx`
- `components/home/hero-section.tsx`
- `components/home/welcome-section.tsx`
- `components/home/community-cta.tsx`
- `components/home/newsletter-section.tsx`
- `components/home/about-preview.tsx`
- `components/home/featured-posts.tsx`
- `components/home/community-stories.tsx`
- `components/home/founder-story.tsx`
- `components/home/hero-carousel.tsx`

**What to improve:**
- stronger visual rhythm above the fold
- cleaner CTA hierarchy
- less generic SaaS energy
- more deliberate editorial sequencing
- responsive image and card treatment that feels premium
- a homepage that makes people want to keep scrolling

---

### 3) Shared shell and navigation system

Make the whole site feel like one system.

**Primary surfaces:**
- `app/layout.tsx`
- `components/layout/Banner.tsx`
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`
- `app/(app)/layout.tsx`
- `app/(auth)/layout.tsx`
- loading states across `app/`

**What to improve:**
- header height and safe-area behavior
- sticky nav polish
- clearer auth-aware navigation labels
- better mobile menu behavior
- consistent shell rhythm between public and app surfaces

---

### 4) Visual language and component consistency

Use the current brand language consistently instead of drifting page by page.

**Focus areas:**
- typography scale and hierarchy
- card radius, border, shadow, and spacing consistency
- button styles and CTA priority
- neutral vs accent balance
- loading states and empty states
- motion that communicates state without feeling busy

**Important note:** the repo’s actual visual language lives in `app/globals.css` and the existing component surfaces. If the docs and implementation disagree, fix the docs and tokens together instead of spawning one-off page styles.

---

### 5) Auth page fit and finish

The auth pages should feel intentionally designed, not pasted in.

**Primary surfaces:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/login/login-form.tsx`
- `app/(auth)/signup/page.tsx`
- any shared auth shell pieces already in the repo

**What to improve:**
- tighter visual hierarchy
- calmer form states
- clearer loading / error behavior
- consistent panel treatment with the rest of the site
- mobile layouts that do not feel stripped down

---

## UI/UX rules for this batch

- Use one visual language across the site.
- Favor editorial warmth over generic SaaS defaults.
- Keep body text easy to read on small screens.
- Use comfortable but not bloated spacing.
- Every major surface should feel intentional, not merely responsive.
- Do not invent a new design system inside a single page.
- If a token or palette rule is wrong, fix the canonical docs, not just the component.

---

## Acceptance criteria

- the dashboard feels like the product home
- the public homepage feels premium and cohesive
- the shell and navigation feel consistent across public/app/auth surfaces
- mobile polish is noticeably better
- the visual system is documented clearly enough to continue in the next batch
- no brand / token drift is introduced

---

## Verification

Run the standard gates:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Then manually review:
1. homepage above the fold
2. dashboard on mobile and desktop
3. auth pages on mobile and desktop
4. sticky nav and header behavior
5. one or two loading states
6. the overall tone of the site in a fresh browser session

---

## Definition of done

This batch is done when:
- the product has a clear visual personality
- the dashboard feels like a real home base
- public and app surfaces feel like one system
- the site looks better on the screens people actually use
- docs explain the visual direction honestly

---

## Cursor handoff prompt

Use this prompt in Cursor:

```md
You are working in the SoloSHEThings repo.

Goal: make the dashboard, homepage, and shared shell feel like a cohesive, premium product system.

Read first:
- docs/DOCUMENTATION_INDEX.md
- docs/ARCHITECTURE_CONSTITUTION.md
- docs/PROJECT_CONTEXT_PROMPT.md
- docs/BRAND_STYLE_GUIDE.md
- docs/UX_REFERENCE_AWA.md
- docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md
- docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md

Important repo context:
- The actual visual language is already in `app/globals.css` and the existing components.
- The dashboard is the signed-in home base.
- The homepage and auth pages should feel like the same brand, not separate products.
- Avoid generic SaaS default styling.

Implement this batch with these constraints:
- do not invent a new design system inside a single file
- prefer cohesive tokens, shared shell behavior, and repeatable patterns
- make mobile better, not just desktop prettier
- keep the site editorial, warm, and intentional
- if docs or tokens are wrong, update the canonical docs as part of the batch

Acceptance criteria:
- dashboard reads as the home base
- public homepage feels premium and cohesive
- header / nav / shell feel unified
- mobile readability and spacing improve materially
- docs still match the implementation
- typecheck, lint, and build all pass

After coding:
1. update any canonical docs touched by behavior changes
2. run `npm run typecheck`
3. run `npm run lint`
4. run `npm run build`
5. summarize the actual visual system, which files changed, and what remains for the next batch
```
