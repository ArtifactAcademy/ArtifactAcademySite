# Claude Code instructions

Read `docs/design-system.md` before UI work and `docs/architecture.md` before changing application structure.

1. Reuse existing UI, academy, and layout components.
2. Use semantic tokens; avoid arbitrary colors, spacing, radii, and shadows.
3. Preserve dark product, light product, and warm marketing modes.
4. Never redesign approved components locally inside a page. Extend the shared implementation and document its state in `/components`.
5. Test mobile and desktop at 390px, 768px, and 1440px, including keyboard focus and reduced motion.
6. Never expose secrets or commit credentials. Treat all `VITE_` values as public.
7. Do not add backend, authentication, payment, enrollment, real student data, or admin behavior during Milestone 0.
8. Validate with `npm run lint` and `npm run build` before handoff.
