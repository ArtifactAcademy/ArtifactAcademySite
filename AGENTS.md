# Coding agent instructions

Before any UI work, read `docs/design-system.md`. Before changing boundaries, routes, or data flow, read `docs/architecture.md`.

- Reuse existing components in `src/components` before creating new ones.
- Use semantic tokens and Tailwind utilities defined by the design system.
- Do not add arbitrary colors, spacing, radii, or shadows.
- Preserve dark product, light product, and warm marketing modes.
- Do not redesign approved components inside individual pages; extend the shared component and gallery variant.
- Test both mobile and desktop, including 390px, 768px, and 1440px layouts.
- Preserve keyboard navigation, visible focus states, accessible labels, and reduced-motion behavior.
- Never expose secrets, commit real credentials, or place server secrets in `VITE_` variables.
- Keep Milestone 0 free of Supabase, authentication, databases, Stripe, payments, real enrollment, real student data, and admin features.
- Run `npm run lint` and `npm run build` before committing.
