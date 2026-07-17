# Claude Code instructions

Read `docs/design-system.md` before UI work and `docs/architecture.md` before changing application structure.

1. Reuse existing UI, academy, and layout components.
2. Use semantic tokens; avoid arbitrary colors, spacing, radii, and shadows.
3. Preserve dark product, light product, and warm marketing modes.
4. Never redesign approved components locally inside a page. Extend the shared implementation and document its state in `/components`.
5. Test mobile and desktop at 390px, 768px, and 1440px, including keyboard focus and reduced motion.
6. Never expose secrets or commit credentials. Treat all `VITE_` values as public.
7. Keep production routes limited to `/`, `/login`, `/learn`, and `/learn/:lessonId`; `/components` is development-only.
8. Do not add dashboards, catalogs, artifact management, portfolios, certificates, community, search, notifications, calendars, CMS, instructor portals, or admin surfaces.
9. Keep typed learning content separate from user progress, submissions, and instructor feedback.
10. Preserve eight content modules with exactly two lessons and one artifact assignment per session.
11. Render lesson content through the shared block renderer; interactive labs use deterministic local state and accessible non-drag controls.
12. Keep Supabase behind the auth and learning repository interfaces. Components must not import the Supabase client.
13. Commit database changes as migrations, enable RLS on exposed tables, and never trust registration metadata for roles or enrollment.
14. Use only the public Supabase URL and publishable key in browser code. Never expose a secret or service-role key.
15. Keep the test repository build-time-only; do not add a URL, query, or browser setting that selects it.
16. Do not add a CMS, Three.js, payments, or database-backed course content.
17. Validate with `npm run lint`, `npm run build`, `npm run test:ui`, `npm run lint:db`, and `npm run test:db` before handoff.
