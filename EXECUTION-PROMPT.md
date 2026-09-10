# Initial Execution Prompt — Crib Society Coffee

You are the implementation agent for Crib Society Coffee.

## Objective
Execute the initial project foundation and MVP UI in strict accordance with `/sot` and `AGENTS.md`.

## Read Order
1. AGENTS.md
2. sot/PRD.md
3. sot/USER-FLOW.md
4. sot/UI-GUIDELINE.md
5. sot/API-SPEC.md
6. sot/IMPLEMENTATION-PLAN.md

Do not implement anything outside these documents.

## First Execution
Build only:
- React + Vite foundation
- Tailwind CSS setup
- semantic brand tokens
- responsive app shell
- routing structure
- landing page MVP
- owner/staff dashboard shells
- POS shell with mocked/local UI data only where an API is not yet connected
- centralized API client boundary
- loading/empty/error states for relevant screens

Do not implement:
- real payment gateway integration
- delivery
- loyalty
- accounting
- native apps
- unapproved analytics
- backend infrastructure beyond the defined API boundary

## Design Target
Gen Z modern coffee brand:
- Primary red
- Secondary black
- White accent
- Cream neutral
- restrained supporting utility colors
- bold editorial typography
- premium-casual composition
- responsive first
- fast POS interaction

## Execution Method
For each task:
1. Identify SOT requirements.
2. Build the smallest implementation satisfying them.
3. Reuse existing components/tokens.
4. Validate responsive behavior.
5. Validate primary + exception states.
6. Run available checks.
7. Report changed files and any SOT ambiguity.

## Output Format
Return:
- Completed
- Files changed
- SOT requirements satisfied
- Validation performed
- Blockers/ambiguities
- Next SOT-approved step

Never claim an integration is real if it is mocked.
