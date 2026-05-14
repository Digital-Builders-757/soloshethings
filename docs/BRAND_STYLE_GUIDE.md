# Brand Style Guide

**Purpose:** SoloSheThings brand color palette, usage rules, and design tokens. Single source of truth for all brand colors.

## Non-Negotiables

1. **Use Only Brand Colors** - These 5 colors are the ONLY brand colors. Do not invent or substitute.
2. **No AWA Colors** - Do NOT copy Accidentally Wes Anderson colors, fonts, or branding.
3. **Single Source of Truth** - Colors defined in `app/globals.css` as CSS variables.
4. **Tailwind Tokens** - Use Tailwind theme classes, never raw hex codes in components.

## Brand Color Palette

**Source of truth:** `app/globals.css`

The live implementation uses a warm editorial palette, not the older blue/yellow system from earlier drafts.

### Core Colors

**Orange (Primary Action)**
- Hex: `#e34b16`
- CSS Variable: `--brand-orange`
- Usage: primary CTAs, active states, key accents

**Brown (Headline / Ink)**
- Hex: `#7a331b`
- CSS Variable: `--brand-brown`
- Usage: headings, strong labels, grounded brand text

**Cream (Surface / Warm Background)**
- Hex: `#f7e8be`
- CSS Variable: `--brand-cream`
- Usage: soft panels, hero glows, highlights, supportive backgrounds

**Gold (Accent / Highlight)**
- Hex: `#fab642`
- CSS Variable: `--brand-gold`
- Usage: highlight chips, supportive accents, subtle emphasis

**Gray (Neutral)**
- Hex: `#d9d9d9`
- CSS Variable: `--brand-gray`
- Usage: borders, separators, low-emphasis UI

**Dark (Body / Utility Text)**
- Hex: `#3a3a3a`
- CSS Variable: `--brand-dark`
- Usage: body copy, utility text, neutral UI chrome

## Usage Rules

### Primary Actions
- Use **Orange** for primary buttons, links, and the main CTA hierarchy
- Use **Brown** for strong labels and title text when the surface is light
- Use **Gold** as the secondary warm accent, not as the main action color

### Backgrounds
- Prefer neutral or cream-tinted backgrounds for reading surfaces
- Use orange or brown backgrounds only where the contrast is deliberate and strong
- Keep hero sections warm and editorial, not flat or generic
- Use soft glows, layered gradients, and gentle contrast instead of hard neon treatment

### Text Colors
- Prefer **Brown** for large headings on light surfaces
- Prefer **Dark** for body copy and utility text
- Use white text on Orange or Brown backgrounds only when the contrast is strong enough

### Card and Border Treatment
- Use the existing shared surface classes and border tokens first
- Keep card radius, border weight, and shadow treatment consistent across the site
- Avoid introducing a new ad hoc palette inside one-off components

### Motion
- Motion should communicate state, not decorate every surface
- Keep hover and focus feedback calm, short, and repeatable
- Respect reduced-motion settings

## Contrast Requirements

### WCAG AA Rules

**Must:**
- Test contrast before shipping new combinations
- Favor readable text over decorative color
- Keep support text and labels legible on mobile

**Must not:**
- Use low-contrast brand-on-brand combinations for primary content
- Mix random new hues into the palette
- Let one-off page styling override the shared visual system

## Gradient Borders

- Prefer the existing shared surface and gradient utilities already in the repo
- If you add a new gradient treatment, document it here and keep it reusable
- Do not invent page-specific border treatments that only work once

## Implementation

### CSS Variables (Single Source of Truth)

Defined in `app/globals.css`:

```css
:root {
  --brand-orange: #e34b16;
  --brand-brown: #7a331b;
  --brand-cream: #f7e8be;
  --brand-gold: #fab642;
  --brand-gray: #d9d9d9;
  --brand-dark: #3a3a3a;
}
```

### Tailwind / Utility Mapping

If a new token is added, mirror the CSS vars in the shared token layer instead of inventing a page-only palette. Keep the existing shell and surface utilities as the first choice.

### Usage in Components

**✅ CORRECT:**
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</button>

<div className="surface-card">
  Highlight Content
</div>

{/* Shared surface treatment */}
<article className="surface-card lift-hover">
  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
    {/* Card content */}
  </div>
</article>
```

**❌ WRONG:**
```tsx
<button style={{ backgroundColor: 'var(--brand-orange)' }}> {/* Never inline styles */}
<div className="border-gradient-brand"> {/* Use shared surface utilities instead */}
```

## What We Do NOT Copy

### Accidentally Wes Anderson Colors

**MUST NOT:**
- Use AWA's color palette (pink, teal, pastels)
- Copy AWA's typography choices
- Replicate AWA's visual branding
- Use AWA's design patterns for colors

**MUST:**
- Use ONLY SoloSheThings brand colors
- Reference AWA for information architecture only
- Maintain SoloSheThings brand identity
- All Tailwind colors must use brand tokens (rgb vars). No raw hex in components.

## Accessibility

### Color Blindness Considerations

- Blue colors are distinguishable for most color vision types
- Yellow/Orange accents provide sufficient contrast
- Never rely on color alone to convey information
- Use icons, labels, or patterns in addition to color

### Dark Mode (Future)

When implementing dark mode:
- Adjust brand color values for dark backgrounds
- Maintain contrast ratios
- Test with screen readers
- Consider reduced motion preferences
- Adjust gradient border opacity for dark backgrounds

## Gradient Border System

### Overview

The gradient border system uses the warm editorial palette to create vibrant, eye-catching borders on cards and content blocks. Keep the treatment bold but still readable.

### Implementation

**CSS Utility Class:** `.surface-card-gradient`

**Gradient Colors (in order):**
1. Orange (`#e34b16`)
2. Gold (`#fab642`)
3. Cream (`#f7e8be`)
4. Brown (`#7a331b`)
5. Dark (`#3a3a3a`)

**Gradient Direction:** 135deg (diagonal)

### Usage Guidelines

**When to Use:**
- Blog post cards
- Place/safe spot cards
- Story cards
- Featured content cards
- Landing page showcase cards

**When NOT to Use:**
- Form inputs
- Error messages
- Navigation elements
- Small UI elements (badges, tags)
- Text-only content blocks

### Technical Details

**Border Width:**
- Desktop: 3px default, 4px on hover
- Mobile: 2px default, 3px on hover

**Structure:**
```tsx
<article className="surface-card-gradient lift-hover">
  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
    {/* Card content (image, text, etc.) */}
  </div>
</article>
```

**Important:** The inner wrapper div is required for proper gradient border rendering. The border-radius calculation accounts for the gradient border width.

### Background Gradients

**Body Background:**
- Multi-color gradient using all 5 brand colors
- Opacity: 8% (increased from 2-3% for vibrancy)
- Direction: 135deg diagonal
- Fixed attachment for consistent appearance

**Hero Sections:**
- Enhanced gradient overlay via `.hero-wash` utility
- Opacity: 10-12% (increased from 5-8%)
- Creates depth and vibrancy without overwhelming content

**Section Dividers:**
- Brand color gradient dividers (`.section-divider`)
- Height: 2px
- Fades to transparent at edges
- Uses all 5 brand colors in sequence

### Performance Considerations

- Gradient borders use CSS-only techniques (no JavaScript)
- Browser support: Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation: Falls back to solid border if gradients not supported
- Mobile-optimized: Thinner borders on mobile devices

### Accessibility

- Gradient borders do not affect text contrast
- All text remains WCAG AA compliant
- Borders enhance visual appeal without compromising readability
- Focus states remain visible and accessible

---

**Related Documents:**
- [UX_REFERENCE_AWA.md](./UX_REFERENCE_AWA.md) - AWA inspiration (structure only)
- [PROJECT_CONTEXT_PROMPT.md](./PROJECT_CONTEXT_PROMPT.md) - Brand reference
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Component patterns
- [design-plans/BRAND_COLOR_VIBRANCY_ENHANCEMENT.md](./design-plans/BRAND_COLOR_VIBRANCY_ENHANCEMENT.md) - Design implementation plan

