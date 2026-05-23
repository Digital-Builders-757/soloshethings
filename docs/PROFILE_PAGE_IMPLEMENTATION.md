# Profile Page — Implementation Summary

**File:** `components/profile/profile-form.tsx`
**Route:** `/profile` → `app/(app)/profile/page.tsx`
**Status:** Production-ready · TypeScript clean · Zero new lint errors

---

## 1. Architecture

**Component type:** Client component (`'use client'`). Server action (`updateProfile`) handled via `useActionState`.

**Page shell:** `profile-page-stage` (CSS class) → `profile-page-inner` → `<form>`.

**Section hierarchy:**
```
profile-page-stage (relative, isolate, overflow-x:clip, atmospheric ::before gradient)
  └── profile-page-inner (z-index:1, max-w-3xl, mx-auto)
        ├── <nav> breadcrumb
        ├── <header> hero — eyebrow / h1 / sub-paragraph / presenceNote
        ├── .editorial-rule divider
        ├── state notices (success / error, aria-live)
        └── <form>
              ├── <section aria-labelledby> Portrait zone
              │     ├── warmth pool overlay (aria-hidden)
              │     ├── identity row (avatar ring + status text + portrait whisper)
              │     └── upload block (constrained, slightly drifted)
              ├── <section> Identity fields
              │     ├── username (max-w-[20rem])
              │     └── full name (ml-1 sm:ml-2 drift)
              ├── <section aria-labelledby> Voice & presence
              │     ├── visibility select (max-w-[26rem])
              │     └── bio textarea (writing surface)
              └── conclusion div (save button + back link)
```

**Layout philosophy:** No outer card. All sections are open zones on the page background. `max-w-3xl` canvas gives lateral breathing room. Vertical spacing is intentionally uneven between sections.

---

## 2. Visual System

**Typography:**
- Hero `h1`: `.display-headline` (Fraunces, weight 700, line-height 1.12) at `text-[1.85rem] sm:text-[2.25rem] lg:text-[2.6rem]`
- Eyebrow: `.eyebrow` class at `text-[0.65rem] tracking-[0.26em]`
- Section labels: `.profile-form-section-label` (0.72rem, weight 700, letter-spacing 0.2em, uppercase)
- Body/helper text: `text-xs` or `text-sm` at warm brown with opacity variants (`/42`, `/48`, `/50`, `/55`, `/62`)
- All text stays in warm ink palette (`#713522`, `#7a331b`, `#4a2c18`) — never cold gray, never pure black

**Spacing philosophy:**
- Section margins vary intentionally: portrait `mb-14 sm:mb-[4.5rem]`, identity `mb-10 sm:mb-12`, voice `mb-12 sm:mb-14`
- Portrait zone: asymmetric padding `px-5 pb-8 pt-5 sm:px-7 sm:pb-10 sm:pt-6` (more bottom air)
- Full name container has `ml-1 sm:ml-2` horizontal drift from username — fields do not share identical left axis
- Upload block: `ml-1 sm:ml-2` drift from portrait identity row
- Save row: `pt-8 sm:pt-12` long approach, `pb-4 sm:pb-6` trailing air
- Page bottom: `pb-20 sm:pb-28` — page fades, does not stop

**Atmospheric treatment:**
- `profile-page-stage::before`: radial warmth field at top of page (gold + orange, very low opacity)
- Two absolutely-positioned atmospheric blobs mid-page (`blur-3xl`, opacities 0.058 and 0.038)
- Portrait zone warmth pool: `radial-gradient` at `opacity-[0.032]` in the section corner
- All atmospheric elements: `pointer-events-none aria-hidden`

**Surface treatment:**
- Portrait zone: `.profile-portrait-zone` — warm gradient background, whisper-thin gold border, `border-radius: 1.5rem`
- Voice section: inline gradient `from-[#f7e8be]/20 to-[#fffdf8]/52` with `border-[#fab642]/15` — no shadow, no elevation
- All inputs/select/textarea: `.editorial-input` — warm ink text (`#4a2c18`), subtle border, 1rem border-radius, 150ms transition on focus

**Button philosophy:**
- Save: `.cta-primary` only — gradient, warm shadow, translateY(-1px) on hover, controlled by CSS class entirely
- `disabled:pointer-events-none disabled:opacity-60` added via Tailwind for pending state
- Do not add Tailwind hover/shadow overrides to `.cta-primary` — they conflict with the CSS gradient

---

## 3. Important CSS Classes

| Class | Controls |
|---|---|
| `.profile-page-stage` | Page wrapper: position relative, isolate, overflow-x clip, top warmth gradient via `::before` |
| `.profile-page-inner` | Content layer: z-index 1, positions above atmospheric elements |
| `.profile-portrait-zone` | Portrait section surface: warm gradient bg, whisper border, 1.5rem radius |
| `.profile-avatar-ring` | Gold-to-orange gradient ring around avatar circle |
| `.profile-form-section-label` | Eyebrow-style section label: 0.72rem, uppercase, letter-spacing 0.2em, muted brown |
| `.editorial-input` | All form controls: warm ink color (`#4a2c18`), subtle border, focus ring via box-shadow |
| `.warm-focus-ring` | Focus state: orange border + 4px orange halo (`box-shadow`) — used alongside `.editorial-input` |
| `.editorial-rule` | Thin horizontal warm gradient rule between page zones |
| `.display-headline` | Fraunces serif display heading |
| `.eyebrow` | Uppercase micro-label: 0.72rem, weight 700, tracking, brown |
| `.cta-primary` | Primary action button: orange gradient, shadow, hover lift — do not override with Tailwind |
| `.shell-inline` | Horizontal safe-area-aware padding (1rem → 1.5rem → 2rem across breakpoints) |
| `.shell-pb-safe` | Bottom safe-area padding for notched devices |

---

## 4. Key Responsive Behaviors

- **Portrait zone section margin:** `mb-14` mobile → `mb-[4.5rem]` sm+ (explicit arbitrary value — `mb-18` is not in Tailwind's default scale)
- **Upload block:** constrained to `max-w-[21rem]` on all breakpoints; `max-w` prevents overflow on narrow viewports
- **Bio textarea:** `min-h-[12rem]` on mobile, `sm:min-h-[10rem]` on sm+ — larger on mobile for comfortable thumb typing
- **Input sizing:** `min-h-12` mobile (44px touch target), `sm:min-h-0` collapses to natural height on desktop; `py-3.5` mobile → `sm:py-3` desktop
- **Hero h1:** fluid size via `text-[1.85rem] sm:text-[2.25rem] lg:text-[2.6rem]` — no clamp() needed at these breakpoints
- **Page padding:** `pt-8 sm:pt-12` top, `pb-20 sm:pb-28` bottom

---

## 5. Accessibility

- All inputs linked to labels via matching `id`/`htmlFor` pairs
- Portrait zone and voice section use `aria-labelledby` pointing to section label `id`s
- Success notice: `role="status" aria-live="polite"`
- Error notice: `role="alert" aria-live="assertive"`
- File input: native `<input type="file">` — screen-reader accessible
- Username: `required` attribute, `pattern` with descriptive `title`
- Required `*` marker: `<span class="text-red-600">` is decorative but the `required` attribute carries the semantic weight
- Breadcrumb: `<nav aria-label="Breadcrumb">`
- Atmospheric overlays: `aria-hidden` on all decorative divs
- Focus: `.warm-focus-ring` provides 4px orange outline — visible but not aggressive

---

## 6. Removed Systems

| Removed | Reason |
|---|---|
| Progress checklist widget (`profile-completion-track`, `profile-completion-fill`, checklist row classes) | Gamification energy — belonged to onboarding flow, not identity editing |
| Outer form card (`editorial-card-strong`, `profile-form-well`) | Created SaaS settings-panel feeling; replaced with open page surface zones |
| `profile-avatar-panel` class | Superseded by `.profile-portrait-zone` (lighter, atmospheric, not elevated) |
| Completion percentage / step counter | Implied task completion framing; replaced by `presenceNote` — quiet editorial observation |
| "ACCOUNT BASICS" / "PROFILE GLOW-UP" section labels | Onboarding/productivity tone |
| `text-brand-blue`, cold muted tones | Inconsistent with warm ink palette established on dashboard |
| Horizontal avatar + upload two-column layout | Felt like a settings row; replaced with vertical narrative flow |

**Replaced by:** `presenceNote` (computed in `useMemo`) — surfaces 1–2 quiet editorial signals when avatar, bio, or full name are missing. Returns `null` when the profile is complete.

---

## 7. Future Continuation Ideas

- **Avatar crop / preview modal** — current upload shows filename only; a crop preview would improve portrait authorship UX
- **Animated save state** — the save button pending state could have a subtle warmth pulse rather than just text change
- **`presenceNote` expansion** — currently checks 3 fields; could weight bio more heavily (longer = warmer signal)
- **Travel style tags** — editorial multi-select below bio (already in schema if added); would extend the voice section naturally
- **Social/link fields** — optional Instagram, blog URL fields could extend identity section without structural change
- **Mobile portrait upload** — camera capture (`accept="image/*" capture="user"`) could be added to the file input for mobile
- **Optimistic save feedback** — currently requires `router.refresh()` round-trip; optimistic state would feel more immediate

---

## 8. Current Status

| Check | Status |
|---|---|
| Production-ready | Yes |
| TypeScript | Clean — zero errors |
| Lint (profile-form.tsx) | Clean — zero errors introduced |
| Pre-existing lint errors | 2 in unrelated files (`save-community-post-button.tsx`, `wes-anderson-hero.tsx`) — not introduced here |
| Responsive | Verified — `sm:mb-18` broken rule fixed to `sm:mb-[4.5rem]` |
| Accessibility | All labels, roles, and aria attributes verified |
| Dead CSS removed | Yes — 7 stale classes removed from `globals.css` |
| Design language consistency | `.editorial-input` text color unified to warm ink `#4a2c18` across all form controls |
