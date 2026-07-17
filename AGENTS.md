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
- Keep the first-cohort MVP focused on `/learn` and `/learn/:lessonId`.
- Do not add dashboards, course catalogs, artifact management, portfolios, certificates, community, search, notifications, calendars, CMS, instructor portals, or admin features.
- Keep course content in typed content modules outside UI components. User progress, submissions, and feedback belong in persistence, never content fixtures.
- Keep AI Creator Bootcamp content in eight session modules, each with exactly two lessons and one artifact assignment.
- Add lesson content through the shared discriminated block types and renderer; do not hard-code content markup in route pages.
- Interactive labs must use the reusable lab boundary, deterministic local state, an `onComplete` event, and mouse, touch, and keyboard controls.
- Keep Supabase access behind `src/lib/services` and `src/lib/supabase`; components must not call Supabase directly.
- Store every database change in `supabase/migrations` and keep RLS enabled on every exposed table.
- Treat enrollments, roles, feedback, and approval as privileged operations. Never trust a role supplied during registration.
- Browser code may use only the public Supabase URL and publishable key. Never expose a secret or service-role key.
- Keep the UI test repository selectable only at build time with Vite test mode; never add a URL, query, or browser-controlled runtime switch.
- Do not add Stripe, payments, or any database-backed course content.
- Do not add a CMS or Three.js.
- Register `/components` in development only and never include it in production navigation.
- Run `npm run lint`, `npm run build`, `npm run test:ui`, `npm run lint:db`, and `npm run test:db` before committing.
