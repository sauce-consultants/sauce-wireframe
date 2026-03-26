# Agent instructions for Sauce Wireframe

## Project overview

Sauce Wireframe is a wireframe-styled component toolkit demo app. It showcases 41 UI components, 8 layout patterns, and 7 page templates -- all with a deliberate sketch/wireframe aesthetic (heavy borders, square edges, monochrome palette).

## Architecture

```
src/
  app/
    dev/                    # Dev showcase routes (brand, components, layouts, pages)
      brand/                # Colour, typography, icon, spacing reference
      components/           # Individual component demos (41 routes)
      layouts/              # Shell and content layout demos (8 routes)
      pages/                # Page template demos (7 routes)
        _shared/            # Shared demo components (e.g. CustomerAside)
    globals.css             # Design tokens + Tailwind v4 @theme
    layout.tsx              # Root layout (Raleway + Space Mono fonts)
  components/
    ui/                     # Component library (41 components)
      index.ts              # Barrel export
      portal.tsx            # Portal utility for floating elements
      use-floating.ts       # Shared hook for dropdown positioning
    layouts/                # Layout shell and content pattern components
      index.ts              # Barrel export
```

## Key conventions

### Design tokens

All visual decisions live in `src/app/globals.css`. Components reference semantic tokens, never raw values.

- Colours: `text-accent`, `bg-danger`, `border-gray-light`, `text-text-muted`, etc.
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg` (offset solid, not blur)
- Z-index: `z-sticky` (10), `z-dropdown` (20), `z-backdrop` (40), `z-modal` (50), `z-toast` (60), `z-command` (70)
- Border radius: always 0 (square edges)
- Borders: `border-2` (muted), `border-4` (default), `border-8` (heavy)

### Tailwind usage

- Use Tailwind preset classes, not arbitrary values (e.g. `border-4` not `border-[4px]`)
- Use theme shadow tokens (`shadow-md`) not inline shadows (`shadow-[4px_4px_0_0_#737373]`)
- Use theme z-index tokens (`z-modal`) not arbitrary z-index (`z-[50]`)
- Arbitrary values are acceptable for: `max-h-[60vh]`, `scale-[0.98]`, `text-[10px]`, `grid-rows-[1fr/0fr]`, `transition-[grid-template-rows]`, `transition-[width]`
- Tailwind v4 uses `@theme inline {}` blocks, not `tailwind.config.ts`
- Z-index theme vars must use `--z-index-*` naming (e.g. `--z-index-modal: 50`) for Tailwind to generate `z-modal` class

### Floating elements (dropdowns, select, combobox, date picker, search)

All floating panels use the Portal pattern to avoid z-index/stacking context issues:

1. Import `Portal` and `useFloating` from `./portal` and `./use-floating`
2. Use `useFloating(open)` to get `triggerRef` and `pos`
3. Render the dropdown panel inside `<Portal>` with `position: absolute` and coordinates from `pos`
4. Handle click-outside by checking both `triggerRef` and a `menuRef`/`panelRef`

### Component sizing

- Base interactive height: 48px (`h-12` for md size)
- Size scale: sm = 40px (`h-10`), md = 48px (`h-12`), lg = 56px (`h-14`)
- Badges: `text-sm px-3 py-1`

### Typography

- Headings: `font-black` (900) or `font-extrabold` (800), line-height 1.15
- Body: Raleway 400/600
- Numeric data: Space Mono (`font-mono`)
- Use `font-extrabold` not `font-[800]`, `font-black` not `font-[900]`

### Component patterns

- Every component uses semantic colour tokens
- Interactive components use `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
- Disabled state: `disabled:opacity-50 disabled:pointer-events-none`
- All borders are square (no border-radius)
- Destructive modals use `destructive` prop for red border

## Guidelines reference

This project implements the [Sauce UI Guidelines](https://github.com/sauce-consultants/component-guidelines). When building new components or features:

1. Check the component spec in `~/Code/component-guidelines/components/`
2. Follow UX Standards in `~/Code/component-guidelines/ux-standards.md`
3. Add new components to the dev showcase before using in feature code
4. Extend the library when new variants are needed -- never create one-off implementations

## Dev showcase

The `/dev` routes are the living reference. A component that is not in the showcase is not part of the library.

- Every component must appear in the showcase with all variants and states
- Showcase pages use mock/static data, no API calls
- When adding a new component, create the showcase page and mark it as `ready: true` in `src/app/dev/components/page.tsx`
