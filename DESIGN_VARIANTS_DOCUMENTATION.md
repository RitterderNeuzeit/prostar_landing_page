# ProStar Landing Page - Design Variants Documentation

## Overview

This document provides comprehensive specifications for three distinct design variants of the "Social-Media-Masterplan für Ihr Business" landing page. Each variant maintains ProStar's brand DNA while employing different visual strategies, color palettes, and communication approaches to resonate with specific audience segments.

---

## Variant 1: Warm-Minimal (Primary)

### Design Philosophy

The Warm-Minimal variant represents ProStar's core brand expression: modern, airy, and trustworthy. This design emphasizes whitespace, clean typography, and a warm color palette that feels inviting without being overwhelming. The approach prioritizes clarity and accessibility while maintaining visual sophistication.

**Best For:** General audience, mixed B2B/B2C, professionals seeking modern aesthetics

### Color Palette

| Color | Hex | RGB | Usage | Purpose |
|-------|-----|-----|-------|---------|
| Warm Cream | #F5F1ED | 245, 241, 237 | Primary background | Creates warm, inviting atmosphere |
| Warm Beige | #E8DED5 | 232, 222, 213 | Secondary background | Subtle variation for sections |
| Warm Taupe | #D4C4B8 | 212, 196, 184 | Tertiary background | Deeper neutral tone |
| Charcoal | #2C2C2C | 44, 44, 44 | Primary text | High contrast, readable |
| Terracotta | #C85A3A | 200, 90, 58 | Primary accent | Warm, energetic accent |
| Terracotta Light | #E8A88A | 232, 168, 138 | Hover states | Lighter accent variation |
| Olive | #6B8E5F | 107, 142, 95 | Secondary accent | Complementary green tone |
| White | #FFFFFF | 255, 255, 255 | Cards, overlays | Clean, crisp surfaces |

### Typography

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| H1 | Inter | 48px (mobile: 36px) | 700 (Bold) | 1.2 | Hero headlines |
| H2 | Inter | 36px (mobile: 28px) | 700 (Bold) | 1.2 | Section headings |
| H3 | Inter | 24px (mobile: 20px) | 600 (Semibold) | 1.3 | Subheadings |
| Body | Inter | 16px | 400 (Normal) | 1.5-1.75 | Main content |
| Small | Inter | 14px | 400 (Normal) | 1.5 | Secondary text, captions |

**Font Import:** Google Fonts - Inter (weights: 300, 400, 500, 600, 700)

### Layout & Spacing

- **Container Max-Width:** 1280px
- **Padding:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Section Padding:** 64px vertical (96px on desktop)
- **Gap Between Elements:** 24px (standard), 48px (large sections)
- **Card Padding:** 24px
- **Border Radius:** 12px (standard), 8px (small), 16px (large)

### Component Styling

**Buttons:**
- Primary: Terracotta background (#C85A3A), white text, 12px border-radius
- Secondary: Transparent background, terracotta border (2px), terracotta text
- Hover: Lighter terracotta (#E8A88A), smooth transition (200ms)
- Focus: 2px ring offset, terracotta ring color

**Cards:**
- Background: White (#FFFFFF)
- Border: 1px gray-200 (optional)
- Shadow: Soft shadow-md (0 4px 6px -1px rgba(0,0,0,0.1))
- Hover: Shadow-lg, smooth transition
- Padding: 24px

**Forms:**
- Input Background: White or gray-50
- Input Border: 1px gray-300, focus on terracotta
- Label: Charcoal text, medium weight
- Placeholder: Gray-500, italic

### Visual Elements

**Keyvisual "Entfesseltes Potenzial":**
- Location: Hero section (right column, desktop only)
- Dimensions: 1280x720px (responsive)
- Style: Minimalist illustration with warm colors
- No glitter effects or excessive animations

**Icons:**
- Style: Line-based, 24x24px standard size
- Color: Terracotta (#C85A3A) or charcoal
- Stroke Width: 1.5px
- Usage: Module indicators, checkmarks, social proof

**Dividers:**
- Style: Subtle borders or whitespace
- Color: Gray-200 or transparent
- Thickness: 1px

### Animations & Interactions

- **Fade-in:** 500ms ease-in-out (page load)
- **Slide-up:** 500ms ease-in-out (section entries)
- **Hover Effects:** 200ms ease-in-out (buttons, cards)
- **Reduced Motion:** Respected via prefers-reduced-motion media query

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | 320px - 640px | Phones |
| Tablet | 641px - 1024px | Tablets |
| Desktop | 1025px+ | Desktops |

**Key Changes:**
- Mobile: Single column, larger touch targets (44x44px minimum)
- Tablet: Two-column layouts for some sections
- Desktop: Full multi-column layouts, larger typography

### Accessibility Features

- **Color Contrast:** Minimum WCAG AA (4.5:1 for text)
- **Focus Indicators:** Visible 2px rings on all interactive elements
- **Typography:** Minimum 16px for body text
- **Interactive Elements:** Minimum 44x44px touch targets
- **Alt Text:** All images include descriptive alt text
- **Semantic HTML:** Proper heading hierarchy (H1 → H2 → H3)
- **Skip Links:** Navigation skip to main content

---

## Variant 2: Sachlich-Professional

### Design Philosophy

The Sachlich-Professional variant adopts a corporate, authoritative approach. This design emphasizes structure, clarity, and data-driven messaging. The color palette features clean whites with olive green accents, creating a professional yet approachable atmosphere suitable for B2B decision-makers.

**Best For:** Enterprise audiences, B2B focus, corporate decision-makers

### Color Palette

| Color | Hex | RGB | Usage | Purpose |
|-------|-----|-----|-------|---------|
| White | #FFFFFF | 255, 255, 255 | Primary background | Clean, professional |
| Gray-50 | #FAFAFA | 250, 250, 250 | Secondary background | Subtle variation |
| Gray-100 | #F5F5F5 | 245, 245, 245 | Tertiary background | Deeper neutral |
| Gray-200 | #EEEEEE | 238, 238, 238 | Borders | Subtle dividers |
| Charcoal | #2C2C2C | 44, 44, 44 | Primary text | High contrast |
| Olive | #6B8E5F | 107, 142, 95 | Primary accent | Professional green |
| Olive Dark | #4A6341 | 74, 99, 65 | Hover states | Darker olive |
| Olive Light | #A3B896 | 163, 184, 150 | Background accents | Light olive |
| Dark Gray | #2C2C2C | 44, 44, 44 | Footer background | Deep, professional |

### Typography

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| H1 | Inter | 56px (mobile: 36px) | 700 (Bold) | 1.2 | Hero headlines |
| H2 | Inter | 36px (mobile: 28px) | 700 (Bold) | 1.2 | Section headings |
| H3 | Inter | 20px | 600 (Semibold) | 1.3 | Subheadings |
| Body | Inter | 16px | 400 (Normal) | 1.5 | Main content |
| Small | Inter | 14px | 500 (Medium) | 1.5 | Labels, secondary text |

**Font Import:** Google Fonts - Inter (weights: 400, 500, 600, 700)

### Layout & Spacing

- **Container Max-Width:** 1280px
- **Padding:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Section Padding:** 80px vertical (desktop)
- **Gap Between Elements:** 32px (standard), 64px (large sections)
- **Card Padding:** 32px
- **Border Radius:** 8px (standard), 4px (small)

### Component Styling

**Buttons:**
- Primary: Olive background (#6B8E5F), white text
- Secondary: Transparent background, olive border (2px), olive text
- Hover: Darker olive (#4A6341)
- Focus: 2px ring offset, olive ring color

**Cards:**
- Background: White (#FFFFFF)
- Border: 1px gray-200
- Shadow: Minimal shadow-md
- Hover: Subtle shadow-lg
- Padding: 32px

**Forms:**
- Input Background: White
- Input Border: 1px gray-300, focus on olive
- Label: Charcoal text, semibold weight
- Placeholder: Gray-500

### Visual Elements

**Keyvisual:**
- Location: Hero section (right column, desktop)
- Dimensions: 1280x720px
- Style: Professional illustration, minimal styling

**Icons:**
- Style: Line-based or filled, 24x24px
- Color: Olive (#6B8E5F)
- Usage: Module indicators, checkmarks

**Dividers:**
- Style: Subtle 1px borders
- Color: Gray-200
- Usage: Section separation

### Animations & Interactions

- **Fade-in:** 400ms ease-in-out
- **Slide-up:** 400ms ease-in-out
- **Hover Effects:** 150ms ease-in-out
- **Transitions:** Smooth, professional

### Responsive Breakpoints

Same as Warm-Minimal variant with professional adjustments for larger spacing and typography.

### Accessibility Features

- **Color Contrast:** WCAG AAA (7:1 for critical text)
- **Focus Indicators:** Clear 2px rings
- **Typography:** 16px minimum for body
- **Touch Targets:** 44x44px minimum
- **Semantic HTML:** Proper structure
- **ARIA Labels:** Comprehensive labeling

---

## Variant 3: Handwerklich-Authentisch

### Design Philosophy

The Handwerklich-Authentisch variant emphasizes personal connection and authenticity. This design uses warm, earthy tones with a more relaxed approach to spacing and typography. The aesthetic feels crafted, personal, and welcoming—ideal for SME owners and community-focused audiences.

**Best For:** SME owners, solopreneurs, community-focused messaging

### Color Palette

| Color | Hex | RGB | Usage | Purpose |
|-------|-----|-----|-------|---------|
| Warm Taupe | #D4C4B8 | 212, 196, 184 | Primary background | Warm, inviting base |
| Cream | #F5F1ED | 245, 241, 237 | Secondary background | Light, airy variation |
| Warm Beige | #E8DED5 | 232, 222, 213 | Tertiary background | Warm neutral |
| Charcoal | #2C2C2C | 44, 44, 44 | Primary text | High contrast |
| Terracotta | #C85A3A | 200, 90, 58 | Primary accent | Warm, energetic |
| Terracotta Light | #E8A88A | 232, 168, 138 | Hover states | Light terracotta |
| Terracotta Dark | #A84A2A | 168, 74, 42 | Active states | Dark terracotta |
| Dark Gray | #2C2C2C | 44, 44, 44 | Footer | Deep, grounded |

### Typography

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| H1 | Inter | 56px (mobile: 36px) | 700 (Bold) | 1.2 | Hero headlines |
| H2 | Inter | 36px (mobile: 28px) | 700 (Bold) | 1.2 | Section headings |
| H3 | Inter | 24px (mobile: 20px) | 600 (Semibold) | 1.3 | Subheadings |
| Body | Inter | 16px | 400 (Normal) | 1.75 | Main content (relaxed) |
| Small | Inter | 14px | 400 (Normal) | 1.5 | Secondary text |

**Font Import:** Google Fonts - Inter (weights: 300, 400, 500, 600, 700)

### Layout & Spacing

- **Container Max-Width:** 1280px
- **Padding:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Section Padding:** 80px vertical (generous)
- **Gap Between Elements:** 24px (standard), 48px (large)
- **Card Padding:** 32px
- **Border Radius:** 12px (standard), 8px (small), 16px (large)

### Component Styling

**Buttons:**
- Primary: Terracotta background (#C85A3A), white text
- Secondary: Transparent background, terracotta border (2px)
- Hover: Lighter terracotta (#E8A88A)
- Focus: 2px ring offset, terracotta ring

**Cards:**
- Background: Cream (#F5F1ED)
- Border: 2px terracotta/20 (subtle)
- Shadow: Soft shadow-md
- Hover: Shadow-lg, border-terracotta
- Padding: 32px

**Forms:**
- Input Background: White
- Input Border: 1px gray-300, focus on terracotta
- Label: Charcoal text, medium weight
- Placeholder: Gray-500

### Visual Elements

**Keyvisual:**
- Location: Hero section (right column, desktop)
- Dimensions: 1280x720px
- Style: Warm, inviting illustration

**Icons:**
- Style: Emoji-like or line-based, 24x24px
- Color: Terracotta (#C85A3A)
- Usage: Module indicators with personality

**Dividers:**
- Style: Subtle borders or whitespace
- Color: Terracotta/20 (very subtle)
- Usage: Section separation

**Decorative Elements:**
- Subtle background patterns (optional)
- Warm color overlays
- Organic shapes (no sharp angles)

### Animations & Interactions

- **Fade-in:** 500ms ease-in-out
- **Slide-up:** 500ms ease-in-out
- **Hover Effects:** 200ms ease-in-out (gentle)
- **Transitions:** Smooth, natural

### Responsive Breakpoints

Same as other variants with emphasis on maintaining warmth and personal feel across all screen sizes.

### Accessibility Features

- **Color Contrast:** WCAG AA (4.5:1 minimum)
- **Focus Indicators:** Visible 2px rings
- **Typography:** 16px minimum
- **Touch Targets:** 44x44px minimum
- **Semantic HTML:** Proper structure
- **Alt Text:** Descriptive for all images

---

## Comparison Matrix

| Aspect | Warm-Minimal | Sachlich-Professional | Handwerklich-Authentisch |
|--------|--------------|----------------------|--------------------------|
| **Primary Color** | Terracotta | Olive | Terracotta |
| **Background** | Warm Cream | White | Warm Taupe |
| **Tone** | Balanced | Corporate | Personal |
| **Best For** | General audience | B2B/Enterprise | SME/Community |
| **Typography Size** | Standard | Larger | Standard |
| **Spacing** | Moderate | Generous | Generous |
| **Personality** | Modern, airy | Professional, structured | Authentic, warm |
| **Emoji Usage** | Minimal | None | Moderate |
| **Decorative Elements** | Minimal | Minimal | Subtle |

---

## Implementation Guidelines

### CSS Variables

All variants use the same CSS variable structure defined in `client/src/index.css`:

```css
:root {
  --color-warm-cream: #F5F1ED;
  --color-terracotta: #C85A3A;
  --color-olive: #6B8E5F;
  /* ... additional variables ... */
}
```

### Switching Between Variants

To switch between variants in the application:

1. **Warm-Minimal (Default):** Current `Home.tsx` component
2. **Sachlich-Professional:** `VariantProfessional.tsx` component
3. **Handwerklich-Authentisch:** `VariantArtisanal.tsx` component

Update the route in `App.tsx` to display the desired variant.

### Image Specifications

**Keyvisual:**
- Format: JPG (optimized)
- Resolutions: 1920x1080, 1280x720, 640x360
- File Size: < 500KB per image
- Aspect Ratio: 16:9

**Testimonial Photos:**
- Format: JPG (optimized)
- Dimensions: 300x300px (circular crop)
- File Size: < 100KB
- Style: Professional headshots

**Background Images:**
- Format: JPG (optimized)
- Dimensions: 1920x1080 minimum
- File Size: < 1MB
- Optimization: Compressed for web

---

## Performance Optimization

### Image Optimization

- Use WebP format with JPG fallbacks
- Implement lazy loading for below-the-fold images
- Optimize for mobile (smaller file sizes)
- Use responsive images with srcset

### CSS & JavaScript

- Minify CSS and JavaScript
- Critical CSS inlined in HTML head
- Code splitting for variants
- Tree-shaking unused styles

### Metrics

- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

---

## Testing Checklist

- [ ] All variants render correctly on mobile, tablet, desktop
- [ ] Color contrast meets WCAG AA standards
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Forms work correctly
- [ ] Images load properly
- [ ] Animations respect prefers-reduced-motion
- [ ] Page speed meets performance targets
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## Conclusion

These three design variants provide flexible options for different audience segments while maintaining ProStar's brand identity and core values. Each variant can be deployed independently or as part of an A/B testing strategy to determine which resonates most with the target audience.
