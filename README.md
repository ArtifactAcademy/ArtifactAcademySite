# Artifact Academy

Milestone 0 for the Artifact Academy student product, internally named **Artifact Learning OS**. The initial release recreates the approved Student Dashboard as a responsive React application backed by typed mock data.

## Stack

- Vite, React 19, and strict TypeScript
- Tailwind CSS v4 through the official Vite plugin
- React Router
- shadcn-compatible local components and Base UI primitives
- Lucide icons
- Locally bundled Geist variable fonts

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The component gallery is available at `http://localhost:5173/components`.

Production preview:

```bash
npm run build
npm run preview
```

## Validation

```bash
npm run lint
npm run build
```

Cloudflare Pages should use `npm run build` with `dist` as the output directory. `public/_redirects` provides the SPA fallback.

## Milestone boundary

This milestone uses mock data only. It does not include Supabase, authentication, database schemas, Stripe, payments, enrollment, real student data, or admin features. Environment keys in `.env.example` are placeholders for future work and are not consumed by the application.

Read [docs/design-system.md](docs/design-system.md) before UI work and [docs/architecture.md](docs/architecture.md) before introducing new application boundaries.
