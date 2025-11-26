# ProStar Landing Page - Design System

## Brand DNA Integration

- **Integrität**: Trustworthy, transparent design with clear hierarchy
- **Loyalität**: Consistent visual language, reliable user experience
- **Mut**: Bold typography choices, confident color palette, modern layout
- **Engagement**: Interactive elements, clear CTAs, community-focused sections

## Color Palette

### Primary Colors (Warm Neutrals + Accent)

```css
--color-warm-cream: #f5f1ed; /* Warm off-white background */
--color-warm-beige: #e8ded5; /* Soft neutral tone */
--color-warm-taupe: #d4c4b8; /* Warm gray-brown */
--color-charcoal: #2c2c2c; /* Deep dark for text */
```

### Accent Colors

```css
--color-terracotta: #c85a3a; /* Warm terracotta - primary accent */
--color-terracotta-light: #e8a88a; /* Light terracotta for hover states */
--color-olive: #6b8e5f; /* Muted olive green - secondary accent */
--color-olive-light: #a3b896; /* Light olive for backgrounds */
```

### Semantic Colors

```css
--color-success: #4caf50; /* Success states */
--color-warning: #ff9800; /* Warning states */
--color-error: #f44336; /* Error states */
--color-info: #2196f3; /* Information states */
```

### Neutral Scale

```css
--color-white: #ffffff;
--color-gray-50: #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #eeeeee;
--color-gray-300: #e0e0e0;
--color-gray-400: #bdbdbd;
--color-gray-500: #9e9e9e;
--color-gray-600: #757575;
--color-gray-700: #616161;
--color-gray-800: #424242;
--color-gray-900: #212121;
```

## Typography

### Font Family

```css
--font-sans: "Inter", "Segoe UI", sans-serif; /* Primary sans-serif */
--font-serif: "Georgia", serif; /* Accent serif (optional) */
```

### Font Sizes

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */
--text-6xl: 3.75rem; /* 60px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

## Spacing System

```css
--space-xs: 0.25rem; /* 4px */
--space-sm: 0.5rem; /* 8px */
--space-md: 1rem; /* 16px */
--space-lg: 1.5rem; /* 24px */
--space-xl: 2rem; /* 32px */
--space-2xl: 3rem; /* 48px */
--space-3xl: 4rem; /* 64px */
--space-4xl: 6rem; /* 96px */
--space-5xl: 8rem; /* 128px */
```

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem; /* 4px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
--radius-2xl: 1.5rem; /* 24px */
--radius-full: 9999px;
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

## Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

## Design Variants

### Variant 1: Warm-Minimal (Primary)

- **Background**: Warm cream (#F5F1ED) with soft beige accents
- **Primary Accent**: Terracotta (#C85A3A)
- **Typography**: Clean sans-serif, generous whitespace
- **Style**: Modern, airy, trustworthy
- **Best for**: Main landing page, professional audience

### Variant 2: Sachlich-Professional

- **Background**: White (#FFFFFF) with gray-100 accents
- **Primary Accent**: Olive green (#6B8E5F)
- **Typography**: Bold sans-serif, structured hierarchy
- **Style**: Corporate, authoritative, business-focused
- **Best for**: B2B decision-makers, enterprise audience

### Variant 3: Handwerklich-Authentisch

- **Background**: Warm taupe (#D4C4B8) with cream accents
- **Primary Accent**: Terracotta (#C85A3A)
- **Typography**: Mix of sans-serif and serif, artisanal feel
- **Style**: Authentic, crafted, personal touch
- **Best for**: SME owners, community-focused messaging

## Component Styling Guidelines

### Buttons

- **Primary**: Terracotta background, white text, rounded corners
- **Secondary**: Transparent background, terracotta border and text
- **Hover**: Lighter terracotta (#E8A88A), smooth transition
- **Active**: Darker terracotta, slight shadow

### Cards

- **Background**: White or warm cream
- **Border**: Subtle gray-200 or none
- **Shadow**: Soft shadow-md on hover
- **Padding**: 24px (1.5rem)
- **Border Radius**: 12px (0.75rem)

### Forms

- **Input Background**: White or gray-50
- **Border**: Gray-300, focus on terracotta
- **Label**: Charcoal text, medium weight
- **Placeholder**: Gray-500, italic

### Headings

- **H1**: 48px, bold, charcoal, line-height 1.2
- **H2**: 36px, bold, charcoal, line-height 1.2
- **H3**: 24px, semibold, charcoal, line-height 1.3
- **H4**: 20px, semibold, charcoal, line-height 1.4

### Body Text

- **Size**: 16px
- **Color**: Charcoal (#2C2C2C)
- **Line Height**: 1.5-1.75
- **Letter Spacing**: Normal

## Accessibility Standards

- **Color Contrast**: Minimum WCAG AA (4.5:1 for text)
- **Focus States**: Visible focus rings (2px, terracotta)
- **Typography**: Minimum 16px for body text
- **Interactive Elements**: Minimum 44x44px touch targets
- **Motion**: Reduced motion respected via prefers-reduced-motion

## Performance Optimization

- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Font Loading**: System fonts + Google Fonts with font-display: swap
- **CSS**: Minified, critical CSS inlined
- **JavaScript**: Code splitting, lazy loading of components
- **Responsive Images**: srcset for multiple resolutions

## Visual Style Guidelines

### Do's

✓ Use warm, inviting colors
✓ Maintain generous whitespace
✓ Keep typography clean and readable
✓ Use authentic, relatable imagery
✓ Implement smooth transitions
✓ Ensure clear visual hierarchy

### Don'ts

✗ Avoid neon blue or bright colors
✗ Don't use animated GIFs or glitter effects
✗ Avoid cluttered layouts
✗ Don't use generic stock photos
✗ Avoid excessive shadows or gradients
✗ Don't compromise on readability

## Keyvisual Specifications

### "Entfesseltes Potenzial" (Unleashed Potential)

- **Concept**: Professional breaking through barriers, upward movement
- **Color Palette**: Terracotta, olive, warm neutrals
- **Style**: Minimalist illustration, no glitter effects
- **Resolutions**: 1920x1080, 1280x720, 640x360
- **Usage**: Hero section, social media, marketing materials
