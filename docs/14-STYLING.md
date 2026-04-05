# 14 - Styling

## Tailwind CSS Configuration

**File**: `tailwind.config.ts`

### Content Paths

```typescript
content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
]
```

### Dark Mode

```typescript
darkMode: "class"
```

The `<html>` element has `class="dark"` applied in `src/app/layout.tsx`. The entire site is designed for dark mode only.

## Color System

### Primary (Neutral Scale)

```typescript
primary: {
  DEFAULT: "#0a0a0a",
  50:  "#f5f5f5",
  100: "#e5e5e5",
  200: "#d4d4d4",
  300: "#a3a3a3",
  400: "#737373",
  500: "#525252",
  600: "#404040",
  700: "#262626",
  800: "#171717",
  900: "#0a0a0a",
  950: "#000000",
}
```

### Accent (Blue)

```typescript
accent: {
  DEFAULT: "#0071E3",  // Apple blue
  hover:   "#0077ED",
  light:   "#2997FF",
  dark:    "#0055AA",
}
```

### Gold

```typescript
gold: {
  DEFAULT: "#C4A35A",
  light:   "#D4B96A",
  dark:    "#A4834A",
}
```

### Glass (Semi-transparent)

```typescript
glass: {
  light:        "rgba(255, 255, 255, 0.05)",
  medium:       "rgba(255, 255, 255, 0.08)",
  heavy:        "rgba(255, 255, 255, 0.12)",
  border:       "rgba(255, 255, 255, 0.1)",
  "border-light": "rgba(255, 255, 255, 0.15)",
}
```

### Success

```typescript
success: "#30D158"  // Apple green
```

## Fonts

```typescript
fontFamily: {
  sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  display: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
}
```

The app uses Geist VF font loaded locally:

```typescript
// src/app/layout.tsx
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
```

## Animations

### Keyframes

| Name | Description |
|------|-------------|
| `fadeIn` | Opacity 0 -> 1 |
| `slideUp` | Translate Y(40px) -> 0 with fade |
| `slideInLeft` | Translate X(-40px) -> 0 with fade |
| `slideInRight` | Translate X(40px) -> 0 with fade |
| `scaleIn` | Scale 0.9 -> 1 with fade |
| `float` | Y(0) -> Y(-20px) -> Y(0), infinite |
| `glow` | Box shadow pulsing blue glow, infinite |
| `shimmer` | Background position slide, infinite |

### Animation Classes

```css
animate-fadeIn
animate-slideUp
animate-slideInLeft
animate-slideInRight
animate-scaleIn
animate-float
animate-glow
animate-pulse-slow
animate-shimmer
```

## Global CSS

**File**: `src/app/globals.css`

### CSS Variables

```css
:root {
  --background: #000000;
  --foreground: #ffffff;
}
```

### Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #555; }

/* Firefox */
* { scrollbar-width: thin; scrollbar-color: #333 #0a0a0a; }
```

### Glass Morphism Utilities

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}
```

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text-accent {
  background: linear-gradient(135deg, #0071e3 0%, #2997ff 50%, #30d158 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glow Button

```css
.btn-glow {
  background: #0071e3;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 1.125rem;
}

.btn-glow:hover {
  background: #0077ed;
  box-shadow: 0 0 30px rgba(0, 113, 227, 0.5);
  transform: scale(1.02);
}
```

### Responsive Headings

```css
.heading-hero {
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.heading-section {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.heading-card {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  line-height: 1.2;
}

.subheading {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: #a1a1aa;
}

.section-padding {
  padding-top: clamp(4rem, 10vw, 8rem);
  padding-bottom: clamp(4rem, 10vw, 8rem);
}
```

### Selection Color

```css
::selection {
  background: rgba(0, 113, 227, 0.4);
  color: white;
}
```

## Framer Motion

The project uses Framer Motion extensively for:

- **Page transitions**: `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`
- **Navbar**: Slides in from top on mount
- **Mobile menus**: Slide/fade animations with `AnimatePresence`
- **Cards**: Hover effects with `whileHover`, `whileTap`
- **Dropdowns**: Scale + fade with `AnimatePresence`
- **Step transitions**: Configurator steps animate in/out
- **Layout animations**: `layoutId` for sidebar active indicator

## Responsive Design

The app follows a mobile-first approach:

- **Breakpoints**: Default Tailwind (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`)
- **Max width**: Content typically constrained to `max-w-7xl` (1280px)
- **Grid patterns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Sidebar**: Hidden on mobile (`hidden lg:flex`), hamburger menu on mobile
- **Font sizes**: Use `clamp()` for fluid scaling
- **Spacing**: Responsive padding with `p-6 lg:p-8`

## Design Philosophy

The UI follows Apple's design language:

1. **Dark backgrounds**: Pure black (#000) to near-black (#0a0a0a)
2. **Subtle glass effects**: Semi-transparent backgrounds with backdrop blur
3. **Minimal borders**: Very low-opacity white borders (`border-white/10`)
4. **Accent color**: Apple blue (#0071E3) for interactive elements
5. **Large typography**: Hero-sized headings with negative letter-spacing
6. **Generous whitespace**: Large section padding
7. **Smooth transitions**: 200-300ms transitions on interactive elements
8. **Hover elevation**: Cards lift on hover with `translateY(-4px)`
