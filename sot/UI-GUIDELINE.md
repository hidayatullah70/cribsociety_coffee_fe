# Crib Society Coffee — UI Guideline
Version: 0.1.0

## 1. Visual Direction
Modern Gen Z coffee brand: bold typography, editorial composition, high-contrast surfaces, warm neutral backgrounds, confident red accents, subtle grain/texture only where performance permits.

Avoid: generic SaaS gradients, excessive glassmorphism, overly rounded everything, childish café illustrations.

## 2. Color Tokens
Primary:
- Red: #DF2933
- Red Dark: #A61B13
- Red Soft: #FDE8E6

Secondary:
- Black: #111111
- Black Soft: #1C1C1C

Accent:
- White: #FFFFFF

Neutral:
- Cream: #F6F0E6
- Cream Dark: #E8DDCC

Utility:
- Success: #2F7D4A
- Warning: #B7791F
- Danger: #B42318
- Info: #2F6FED

Use semantic Tailwind tokens rather than scattering raw hex values.

## 3. Typography
Recommended hierarchy:
- Display: bold/black sans, tight tracking.
- Heading: semibold/bold.
- Body: regular/medium, high readability.
- UI labels: medium/semibold, compact.
Use a modern sans-serif family with strong numeral readability for POS.

## 4. Layout
Desktop:
- App shell with persistent sidebar for dashboard.
- POS favors split layout: catalog + cart.
Mobile:
- Bottom navigation or compact top navigation.
- POS switches to catalog → cart workflow.
- Tables become cards or horizontally scrollable only when necessary.

Spacing:
Use a consistent 4px base scale. Prefer 8/12/16/24/32/48px rhythm.

## 5. Components
Core:
Button, Input, Select, Search, Badge, Tabs, Card, Modal, Drawer, Toast, Table, EmptyState, Skeleton, StatCard, ProductCard, CartItem, PaymentSelector.

Buttons:
- Primary: red fill / white text.
- Secondary: black or outlined.
- Tertiary: text/ghost.
- Destructive: danger semantic token.

## 6. Landing Page
Hero should establish:
1. product/brand promise
2. strong visual
3. immediate CTA

Menu cards emphasize product name, price, short descriptor, availability.

## 7. POS
Prioritize touch targets >= 44px.
Keep cart total and checkout action visually persistent on desktop.
Minimize navigation during checkout.
Use clear price hierarchy and quantity controls.

## 8. Dashboard
Use:
- KPI cards at top
- chart/table only when decision-relevant
- alert strip for low stock/system issues
- filters close to the content they affect

## 9. Accessibility
- WCAG-minded contrast.
- Visible focus state.
- Keyboard navigable interactive controls.
- Labels for form fields.
- Do not use color alone to communicate status.
- Respect reduced-motion preference.

## 10. Responsive Breakpoints
Use Tailwind defaults unless project constraints require otherwise:
sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

## 11. Motion
Fast, purposeful micro-interactions.
Default transition target: 150–250ms.
Avoid animation that delays POS completion.
