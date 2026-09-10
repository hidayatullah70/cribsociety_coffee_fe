# Crib Society Coffee — Implementation Plan
Version: 0.1.0
Stack: React + Vite + Tailwind CSS + responsive HTML

## Phase 0 — Foundation
- Initialize Vite React app.
- Configure Tailwind.
- Define semantic design tokens.
- Establish routing and app shell.
- Create API client boundary.
- Add environment configuration.
Output: stable skeleton, no business feature drift.

## Phase 1 — Landing
- Build responsive navigation.
- Hero + CTA.
- Featured menu.
- Brand story.
- Store information.
- Footer.
- Add responsive QA.

## Phase 2 — Auth + Role Shell
- Sign-in screen.
- Session state.
- Owner/staff route guards.
- Dashboard shell and navigation.

## Phase 3 — POS MVP
- Category/product catalog.
- Product configuration.
- Cart.
- Totals.
- Payment selection.
- Checkout result.
- Order confirmation.
- Empty/loading/error states.
- Mobile POS adaptation.

## Phase 4 — Orders + Inventory
- Order list/detail/status.
- Inventory list/detail/adjustment.
- Low-stock states.
- Permission boundaries.

## Phase 5 — Dashboard
- KPI summary.
- Operational alerts.
- Sales/order views.
- Owner/staff visibility differences.
- Guest dashboard & live order status queue board (Guest read-only view, customer order tracking by #CSC-xxx, digital menu availability display).

## Phase 6 — Product + Staff Management
- Product CRUD.
- Availability.
- Staff CRUD for owner.
- Permission UX.

## Phase 7 — QA + Hardening
- Responsive testing.
- Accessibility checks.
- API error handling.
- Loading/empty/error states.
- POS interaction speed review.
- Build/lint/type checks if configured.
- Remove unused dependencies and duplicated UI patterns.

## Architecture Rules
- Component-driven React.
- Keep domain logic out of presentational components.
- Prefer reusable primitives over page-specific duplicates.
- API contracts must match API-SPEC.md.
- Do not introduce new modules without updating PRD and flow.
- Do not add libraries without a clear implementation need.

## Definition of Done
A phase is complete only when:
1. Its PRD scope is satisfied.
2. Its user flow is testable.
3. Its UI follows the guideline.
4. API usage follows the API spec.
5. Responsive states are covered.
6. No out-of-scope feature has been introduced.
