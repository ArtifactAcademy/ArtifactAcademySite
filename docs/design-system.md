# Artifact Learning OS design system

This document is the source of truth for Artifact Academy product UI. It distills the approved Design Bible v2 and Student Dashboard references into reusable implementation rules without carrying over the bundled artifact runtime.

## Brand model

- **Product:** Artifact Academy
- **Internal platform/design system:** Artifact Learning OS
- **Flagship course:** AI Creator Bootcamp
- **Primary domain:** `theartifactacademy.com`
- **Product voice:** capable, direct, calm, and human. Avoid gamification noise.

## Typography

Use Geist Variable for all product text and Geist Mono Variable for metadata, compact labels, percentages, keyboard hints, and identifiers. Type is bundled locally through Fontsource.

- Page title: 24–30px, semibold, tight tracking
- Section title: 14–18px, semibold
- Body: 13–14px with comfortable line height
- Metadata: 10–12px; mono only where the information benefits from a system-like rhythm
- Uppercase eyebrow labels use modest tracking and remain short

## Foundations and modes

Dark product mode is the default. Light product mode keeps the same hierarchy with inverted zinc foundations. Marketing mode is warmer and paper-like but preserves every semantic accent.

The full OKLCH values live in `src/styles/tokens.css`. Components consume semantic Tailwind utilities such as `bg-card`, `text-muted`, `border-border`, and `text-success`, never foundation values directly.

| Semantic role | Meaning |
| --- | --- |
| `background`, `page`, `card`, `card-secondary`, `elevated` | Product surface hierarchy |
| `foreground`, `muted`, `subtle` | Text hierarchy |
| `border`, `border-strong` | Separation and interactive boundaries |
| `primary` | The single primary action on a surface |
| `success`, `success-soft` | Progress, completion, published state |
| `clay`, `clay-soft` | Instructor, mentor, human guidance |
| `ai`, `ai-soft` | AI-assisted action or generated guidance |
| `warning`, `error`, `info` | Operational feedback only |

Green, clay, and violet are semantic, not decorative. Do not use green for general brand decoration, clay for arbitrary warmth, or violet for generic emphasis.

## Shape, spacing, and elevation

- Use the 4px spacing rhythm already represented by Tailwind spacing utilities.
- Controls use the 10px `rounded-control` radius.
- Cards use the 14px `rounded-card` radius.
- Pills may use fully rounded treatment for compact status only.
- Product shadows are restrained: a 1–2px panel shadow or the floating shadow for popovers. Borders do most hierarchy work.
- Do not introduce arbitrary spacing, radii, colors, or shadows in page code.

## Layout rules

- Learning shell: collapsible 272px course navigator, sticky 64px top bar, and a focused content column capped at 896px.
- The top bar contains only Artifact Academy branding, Session X of 8 progress, the profile placeholder, and the mobile lesson-outline control.
- Tablet and mobile replace the persistent navigator with a keyboard-operable drawer.
- Mobile at 390px uses one content column and stacked previous, complete, and next controls.
- Preserve one obvious primary action per stage: complete the lesson, submit the artifact, or continue.
- Do not add dashboard grids, context rails, bottom product navigation, search, notifications, or competing progress cards to the learning workspace.

## Components

UI foundations live in `src/components/ui`, learning-specific patterns in `src/components/academy`, typed lesson renderers in `src/components/learning-blocks`, interactive exercises in `src/components/labs`, and shell/navigation in `src/components/layout`.

Interactive labs use the same semantic surfaces and controls as the learning workspace. AI violet identifies the lab boundary, green communicates correct/completed state, warning communicates harmful choices, and capacity uses the shared progress primitive. Every drag interaction must have a visible button alternative.

Before adding a new component:

1. Search for an existing variant.
2. Extend the shared component when the interaction and semantics match.
3. Add a variant to `/components`.
4. Do not redesign an approved component inside an individual page.

## Accessibility and motion

- All interactive elements must be reachable and operable by keyboard.
- Use visible violet focus rings with a 2px offset.
- Inputs require accessible labels, even when the visual label is hidden.
- Icon-only controls require an accessible name.
- Use semantic `nav`, `main`, `aside`, headings, lists, and progressbar roles.
- Respect `prefers-reduced-motion`; animation cannot carry meaning by itself.
- Test at 390px, 768px, and 1440px as well as keyboard-only navigation.
