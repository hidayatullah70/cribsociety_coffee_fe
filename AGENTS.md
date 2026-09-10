# AGENTS.md — Crib Society Coffee
Version: 0.1.0

## Mission
Build Crib Society Coffee strictly from the SOT documents in `/sot`.

## Source of Truth
Priority order:
1. `sot/PRD.md`
2. `sot/USER-FLOW.md`
3. `sot/UI-GUIDELINE.md`
4. `sot/API-SPEC.md`
5. `sot/IMPLEMENTATION-PLAN.md`

If implementation conflicts with SOT, stop and resolve the SOT conflict before extending scope.

## Stack Contract
- React
- Vite
- Tailwind CSS
- Responsive HTML/CSS
- JavaScript/TypeScript according to the project baseline

Do not replace the stack unless explicitly authorized.

## Scope Discipline
- Do not invent features.
- Do not add backend architecture not represented by API-SPEC.
- Do not add payment-provider specifics prematurely.
- Do not add loyalty, delivery, accounting, or native-app features.
- Do not create visual patterns that contradict UI-GUIDELINE.

## UI Rules
Use semantic design tokens.
Prefer reusable components.
Keep POS fast and low-friction.
Provide loading, empty, error, success, and unavailable states.
Maintain accessible focus, labels, contrast, and touch targets.

## API Rules
Use a centralized API layer.
Keep API models aligned with API-SPEC.
Never put secrets in client-side Vite variables.
Do not silently swallow API errors.

## Change Protocol
Before changing behavior:
1. Identify the relevant SOT section.
2. Verify the user flow.
3. Verify API impact.
4. Verify UI impact.
5. Implement the smallest compliant change.
6. Update SOT when requirements genuinely change.

## Validation
Before declaring work complete:
- Run the project's available lint/build/type checks.
- Test primary and exception flows.
- Test mobile/tablet/desktop layouts.
- Check console for avoidable errors.
- Check that no out-of-scope feature was introduced.

## Token-Efficient Execution
Read only the SOT section relevant to the current task.
Avoid re-reading unrelated documents.
Prefer concise diffs and reusable components.
Do not regenerate existing files without need.
