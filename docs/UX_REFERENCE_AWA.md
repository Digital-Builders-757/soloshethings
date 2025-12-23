# UX Reference: Accidentally Wes Anderson

**Purpose:** Document what we borrow from Accidentally Wes Anderson (structure/information architecture only) and what we explicitly do NOT copy (styling, colors, branding).

## Reference Site

**Accidentally Wes Anderson:** https://accidentallywesanderson.com/

**Purpose:** Information architecture and browsing patterns inspiration ONLY.

## What We Borrow (Structure Only)

### 1. Feed/Places Pattern

**AWA Pattern:**
- Large visual cards with images
- Short story snippets/descriptions
- Scrolling feed of "places"
- "From the Community" sections
- Image-first browsing experience

**SoloSheThings Adaptation:**
- **Featured Safe Spots** - Curated/admin posts (similar to AWA's featured places)
- **Community Highlights** - User-generated content (similar to "From the Community")
- Large image cards with travel stories
- Safety-focused descriptions (not just aesthetics)
- Women's travel empowerment lens

**Key Difference:**
- AWA: Aesthetic focus, visual storytelling
- SoloSheThings: Safety + community focus, practical travel information

### 2. Collections/Tags Pattern

**AWA Pattern:**
- Themes (architectural styles, colors)
- Color palettes browsing
- Tag-based filtering
- Collections navigation

**SoloSheThings Adaptation:**
- **Themes/Tags:** Safety level, Budget, Wellness, First-time solo, Destination type, Region
- **"Vibe" Tags:** Conceptual groupings (not literal color palettes)
- Tag-based filtering and browsing
- Collections for curated content groups

**Key Difference:**
- AWA: Visual themes (colors, architecture)
- SoloSheThings: Practical themes (safety, budget, travel type)

### 3. Map Explore Pattern

**AWA Pattern:**
- Dedicated map browse route
- Geographic exploration
- Place markers on map
- Map-based navigation

**SoloSheThings Adaptation:**
- Map route for Phase 2 (stubbed in Phase 1)
- Geographic exploration of safe spots
- Safety-focused map markers
- Region-based browsing

**Key Difference:**
- AWA: Visual/aesthetic exploration
- SoloSheThings: Safety and practical travel exploration

### 4. Submission Pattern

**AWA Pattern:**
- Community submission form
- Photo + story submission
- Submission guidelines
- Moderation workflow

**SoloSheThings Adaptation:**
- "Submit a Spot / Submit a Story" flow
- Photo + story submission (with privacy controls)
- Safety-focused submission guidelines
- Privacy-first moderation (no face recognition)

**Key Difference:**
- AWA: Aesthetic submissions
- SoloSheThings: Safety-focused submissions with privacy controls

### 5. Bulletin Cadence

**AWA Pattern:**
- Twice-monthly bulletin/curated drops
- Curated content releases
- Email/newsletter cadence

**SoloSheThings Adaptation:**
- Bi-weekly admin posts ("Curated Drops")
- Curated safe spots and stories
- Community highlights
- Newsletter/email cadence (future)

**Key Difference:**
- AWA: Aesthetic curation
- SoloSheThings: Safety and community curation

## What We Do NOT Copy

### Colors & Branding

**MUST NOT:**
- ❌ Copy AWA's color palette (pink, teal, pastels)
- ❌ Use AWA's typography choices
- ❌ Replicate AWA's visual branding
- ❌ Copy AWA's logo or visual identity

**MUST:**
- ✅ Use ONLY SoloSheThings brand colors (see `BRAND_STYLE_GUIDE.md`)
- ✅ Maintain SoloSheThings brand identity
- ✅ Create unique visual design

### Typography

**MUST NOT:**
- ❌ Copy AWA's font choices
- ❌ Replicate AWA's typography hierarchy

**MUST:**
- ✅ Choose fonts appropriate for SoloSheThings brand
- ✅ Ensure readability and accessibility
- ✅ Follow WCAG AA contrast requirements

### Visual Style

**MUST NOT:**
- ❌ Copy AWA's visual aesthetic
- ❌ Replicate AWA's design patterns for styling
- ❌ Use AWA's animation patterns

**MUST:**
- ✅ Create SoloSheThings-specific visual style
- ✅ Focus on safety and community (not just aesthetics)
- ✅ Maintain production-ready, accessible design

## SoloSheThings Adaptations

### Safety Lens

**AWA Focus:** Aesthetic beauty, visual storytelling

**SoloSheThings Focus:**
- Safety information
- Practical travel tips
- Community support
- Women's travel empowerment

### Privacy-First UGC

**AWA:** Community submissions with photos

**SoloSheThings:**
- Privacy controls (public/limited/private)
- No face recognition on creator content
- User ownership of content
- Safety-focused moderation

### Community Empowerment

**AWA:** Visual community sharing

**SoloSheThings:**
- Safety-focused community
- Practical travel resources
- Support and encouragement
- Subscription-gated community features

## Information Architecture Mapping

| AWA Pattern | SoloSheThings Adaptation | Phase |
|-------------|-------------------------|-------|
| Places Feed | Home Feed (Featured + Community) | Phase 1 |
| Collections/Themes | Collections/Tags Browse | Phase 1 |
| Map Explore | Map Browse | Phase 2 |
| Place Detail | Place/Story Detail (`/places/[slug]`) | Phase 1 |
| Submit Form | Submit Flow (`/submit`) | Phase 1 |
| Bulletin | Curated Drops (Bi-weekly admin posts) | Phase 1 |

## Route Structure Alignment

**AWA-Inspired Routes:**
- `/` - Home feed (Featured → Community → Collections → Curated Drops)
- `/collections` - Themes/Tags browsing
- `/places/[slug]` - Community place/story detail
- `/submit` - Submission form
- `/map` - Map explore (Phase 2 stub)

**SoloSheThings-Specific Routes:**
- `/blog` - WordPress editorial content
- `/dashboard` - User dashboard
- `/login`, `/signup` - Authentication

## Implementation Notes

### Phase 1 (Current)
- Feed structure (home page)
- Collections/tags browsing
- Place detail shells
- Submit form shells
- Blog integration (WordPress)

### Phase 2 (Future)
- Map explore functionality
- Real-time features
- Advanced filtering

### Phase 3 (Future)
- Enhanced collections
- Advanced search
- Community features

---

**Related Documents:**
- [BRAND_STYLE_GUIDE.md](./BRAND_STYLE_GUIDE.md) - Brand colors (NOT AWA colors)
- [PROJECT_CONTEXT_PROMPT.md](./PROJECT_CONTEXT_PROMPT.md) - UX reference note
- [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md) - Architecture principles

