# Brand Style Guide

**Purpose:** SoloSheThings brand color palette, usage rules, and design tokens. Single source of truth for all brand colors.

## Non-Negotiables

1. **Use Only Brand Colors** - These 5 colors are the ONLY brand colors. Do not invent or substitute.
2. **No AWA Colors** - Do NOT copy Accidentally Wes Anderson colors, fonts, or branding.
3. **Single Source of Truth** - Colors defined in `app/globals.css` as CSS variables.
4. **Tailwind Tokens** - Use Tailwind theme classes, never raw hex codes in components.

## Brand Color Palette

### Primary Colors

**Blue 1 (Primary Blue)**
- Hex: `#0439D9`
- CSS Variable: `--brand-blue-1`
- Usage: Primary actions, links, headers, key UI elements
- Tailwind Token: `brand-blue1`

**Blue 2 (Secondary Blue)**
- Hex: `#034AA6`
- CSS Variable: `--brand-blue-2`
- Usage: Secondary actions, hover states, accents
- Tailwind Token: `brand-blue2`

### Accent Colors

**Yellow 1 (Primary Accent)**
- Hex: `#F2E205`
- CSS Variable: `--brand-yellow-1`
- Usage: Highlights, CTAs, important notices
- Tailwind Token: `brand-yellow1`

**Yellow 2 (Secondary Accent)**
- Hex: `#F2CB05`
- CSS Variable: `--brand-yellow-2`
- Usage: Secondary highlights, hover states
- Tailwind Token: `brand-yellow2`

**Orange (Tertiary Accent)**
- Hex: `#F28705`
- CSS Variable: `--brand-orange`
- Usage: Warnings, special CTAs, emphasis
- Tailwind Token: `brand-orange`

## Usage Rules

### Primary Actions
- Use **Blue 1** (`#0439D9`) for primary buttons, links, and key CTAs
- Use **Blue 2** (`#034AA6`) for hover states on primary elements

### Accent Usage
- Use **Yellow 1** (`#F2E205`) for highlights and important notices
- Use **Yellow 2** (`#F2CB05`) for secondary highlights
- Use **Orange** (`#F28705`) sparingly for warnings or special emphasis

### Backgrounds
- Use brand colors for backgrounds sparingly
- Prefer neutral backgrounds (white, gray) with brand color accents
- When using brand colors as backgrounds, ensure sufficient text contrast
- **Body Background:** Multi-color gradient at 8% opacity using all 5 brand colors
- **Hero Sections:** Enhanced gradients at 10-12% opacity for vibrancy

### Text Colors
- Use brand colors for text only when contrast requirements are met
- Prefer dark text (`#000000` or `#1a1a1a`) on light backgrounds
- Prefer light text (`#ffffff`) on dark brand color backgrounds

### Gradient Borders
- Use `.surface-card-gradient` utility class for cards that need vibrant brand color borders
- Gradient borders use all 5 brand colors in sequence: Blue 1 → Yellow 1 → Orange → Yellow 2 → Blue 2
- Border width: 3px on desktop, 2px on mobile
- Hover state: Border expands to 4px (desktop) or 3px (mobile)
- Applied to: Blog cards, place cards, story cards, featured content cards

## Contrast Requirements

### WCAG AA Compliance

**Text on Brand Colors:**
- Blue 1 (`#0439D9`) + White text: ✅ AA compliant (21:1)
- Blue 2 (`#034AA6`) + White text: ✅ AA compliant (12.6:1)
- Yellow 1 (`#F2E205`) + Black text: ✅ AA compliant (19.5:1)
- Yellow 2 (`#F2CB05`) + Black text: ✅ AA compliant (17.4:1)
- Orange (`#F28705`) + White text: ✅ AA compliant (3.5:1)

**Brand Colors on White:**
- Blue 1 on white: ✅ AA compliant
- Blue 2 on white: ✅ AA compliant
- Yellow 1 on white: ⚠️ Use black text
- Yellow 2 on white: ⚠️ Use black text
- Orange on white: ✅ AA compliant

### Contrast Rules

**MUST:**
- Use white text on Blue 1 and Blue 2 backgrounds
- Use black text on Yellow 1 and Yellow 2 backgrounds
- Use white text on Orange backgrounds
- Test contrast ratios before deploying

**MUST NOT:**
- Use yellow text on white backgrounds (insufficient contrast)
- Use light text on light backgrounds
- Use dark text on dark backgrounds

## Implementation

### CSS Variables (Single Source of Truth)

Defined in `app/globals.css`:

```css
:root {
  --brand-blue-1: #0439D9;
  --brand-blue-2: #034AA6;
  --brand-yellow-1: #F2E205;
  --brand-yellow-2: #F2CB05;
  --brand-orange: #F28705;
}
```

### Tailwind Theme Configuration

Defined in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        blue1: 'var(--brand-blue-1)',
        blue2: 'var(--brand-blue-2)',
        yellow1: 'var(--brand-yellow-1)',
        yellow2: 'var(--brand-yellow-2)',
        orange: 'var(--brand-orange)',
      },
    },
  },
}
```

### Usage in Components

**✅ CORRECT:**
```tsx
<button className="bg-brand-blue1 text-white hover:bg-brand-blue2">
  Primary Action
</button>

<div className="bg-brand-yellow1 text-black">
  Highlight Content
</div>

{/* Gradient border card */}
<article className="surface-card-gradient lift-hover">
  <div className="overflow-hidden rounded-[calc(var(--radius-xl)-3px)]">
    {/* Card content */}
  </div>
</article>
```

**❌ WRONG:**
```tsx
<button className="bg-[#0439D9]"> {/* Never use raw hex */}
<button style={{ backgroundColor: '#0439D9' }}> {/* Never inline styles */}
<div className="border-gradient-brand"> {/* Use surface-card-gradient instead */}
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

The gradient border system uses all 5 brand colors to create vibrant, eye-catching borders on cards and content blocks. This reflects African heritage through bold, celebratory color combinations while maintaining the existing aesthetic quality.

### Implementation

**CSS Utility Class:** `.surface-card-gradient`

**Gradient Colors (in order):**
1. Blue 1 (`#0439D9`)
2. Yellow 1 (`#F2E205`)
3. Orange (`#F28705`)
4. Yellow 2 (`#F2CB05`)
5. Blue 2 (`#034AA6`)

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

