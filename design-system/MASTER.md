# Setu Design System — MASTER

**Product:** Setu (Skill Bridge) — SIH26044, Ministry of Ayush / AIIA  
**Theme:** Editorial, confident, asymmetric — India education + growth without cliché  
**Audience:** Students, Faculty, Industry, Institution Admin

## Style Direction

- **Layout:** Bento-grid dashboards, asymmetric hero, purposeful whitespace
- **Avoid:** Centered hero + 3 cards, gradient blobs, emoji icons, generic SaaS
- **Tone:** Trustworthy government-adjacent portal with modern product polish

## Typography

| Role | Font | Weight |
|------|------|--------|
| Display | Instrument Serif | 400–600 |
| UI / Body | DM Sans | 400–700 |
| Mono (code) | JetBrains Mono | 400 |

```css
--font-display: 'Instrument Serif', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

## Color Tokens (Light / Dark)

```css
:root {
  --primary: #0D5C4B;
  --primary-foreground: #F0FDF9;
  --accent: #C45C26;
  --accent-foreground: #FFFBEB;
  --background: #FAFAF8;
  --foreground: #1A1F2E;
  --card: #FFFFFF;
  --card-foreground: #1A1F2E;
  --muted: #F3F4F0;
  --muted-foreground: #6B7280;
  --border: #E5E7E0;
  --success: #059669;
  --warning: #D97706;
  --destructive: #DC2626;
  --ring: #0D5C4B;
  --chart-1: #0D5C4B;
  --chart-2: #C45C26;
  --chart-3: #2563EB;
  --chart-4: #7C3AED;
  --chart-5: #DB2777;
}

.dark {
  --primary: #2DD4A8;
  --primary-foreground: #0F1419;
  --accent: #F59E0B;
  --background: #0F1419;
  --foreground: #F3F4F6;
  --card: #1A2332;
  --muted: #252D3A;
  --muted-foreground: #9CA3AF;
  --border: #2D3748;
}
```

## Spacing & Radius

- Base unit: 4px
- `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 16px`, `--radius-xl: 24px`
- Touch targets: minimum 44×44px on mobile

## Component Patterns

- **Cards:** Subtle border, no heavy shadow; hover lift 2px + border-primary/30
- **Buttons:** Primary (filled green), Secondary (outline), Ghost; focus ring 2px
- **Tables:** Desktop table → mobile card stack below `md`
- **Charts:** ECharts with brand palette; animate on mount (800ms easeOutQuart)
- **Forms:** Label above input, inline zod errors, loading spinner on submit
- **Empty states:** Illustration-free; typographic headline + CTA
- **Skeletons:** Pulse on muted background

## Motion Rules

- Default transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`
- Page enter: Framer Motion fade + y 12px
- List items: auto-animate or stagger 50ms
- Landing scroll: GSAP ScrollTrigger + Lenis (disable if `prefers-reduced-motion`)
- Chart draw-in: 800ms
- Confetti: assessment pass, offer received

## UX Guidelines

1. Role-colored sidebar accent strip (Student=green, Faculty=blue, Industry=amber, Admin=slate)
2. Bottom nav on mobile (<768px), sidebar on desktop
3. Drawers (Vaul) instead of modals on mobile
4. Command palette (cmdk) on ⌘K / Ctrl+K for power users
5. Toasts via Sonner for all mutations
6. Keyboard: visible focus rings, skip-to-content link
7. All lists: search + pagination
8. Demo login buttons on auth page

## Pre-Delivery Checklist

- [ ] Contrast ratio ≥ 4.5:1 body text
- [ ] Touch targets ≥ 44px mobile
- [ ] Hover + focus states on interactive elements
- [ ] Responsive at 320, 768, 1024, 1440px
- [ ] `prefers-reduced-motion` respected
- [ ] Empty, loading, error states on every screen
- [ ] No Lorem ipsum / John Doe — Indian data only
