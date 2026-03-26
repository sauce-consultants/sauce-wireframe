# Sauce Wireframe

A wireframe-styled component toolkit for fast customer prototyping sessions. Built as a living reference that demonstrates what a sketch-aesthetic UI library looks like in practice.

## What is this?

Sauce Wireframe is a demo app showcasing a complete wireframe-styled component system. It's designed for rapid prototyping with customers where polished production UI isn't the goal -- fast, schematic layouts are.

The wireframe aesthetic is intentional: heavy black borders, square edges, monochrome palette with minimal colour, bold typography, and offset solid shadows.

## Tech stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** with custom theme tokens
- **Lucide React** icons
- **Raleway** (headings) + **Space Mono** (numeric data)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dev](http://localhost:3000/dev) to browse the component showcase.

## Dev showcase

The `/dev` routes are a living reference for the entire design system:

| Route | Content |
|-------|---------|
| `/dev` | Overview and navigation |
| `/dev/brand` | Colour palette, typography, icons, spacing, borders, shadows |
| `/dev/components` | 41 components with variants, states, and interactive demos |
| `/dev/layouts` | 3 shell patterns + 5 content area layouts |
| `/dev/pages` | 7 page templates with mock data |

## Component library

41 components across 5 categories:

- **Core Inputs (12):** Button, Icon Button, Input, Textarea, Select, Combobox, Checkbox, Radio Group, Toggle, Slider, Date Picker, File Upload
- **Data Display (9):** Badge, Table, Card, Accordion, Avatar, Tooltip, Stat Card, Timeline, Empty State
- **Feedback & Overlays (7):** Spinner, Skeleton, Modal, Slide Panel, Toast, Alert, Progress Bar
- **Layout & Navigation (7):** Header, Sidebar, Breadcrumbs, Tabs, Pagination, Stepper, Footer
- **Composite Patterns (5):** Command Palette, Dropdown Menu, Context Menu, Form, Search

## Layout system

**Shells** (full-page wrappers):
- Sidebar Shell -- standard admin/SaaS pattern
- Top Nav Shell -- horizontal navigation for shallow hierarchies
- Bottom Nav Shell -- mobile-native tab bar

**Content layouts** (inside a shell's content region):
- Single Column, Dashboard Grid, Split View, Main + Aside, Centered Card

## Page templates

7 standard admin/CRUD page types:
- Dashboard, Resource List, Resource Create, Resource Detail, Resource Edit, Delete/Archive confirmation patterns, HasMany List

## Design tokens

All visual decisions are encoded in `src/app/globals.css` as CSS custom properties wired into Tailwind v4's `@theme` block:

- Semantic colour tokens (black, white, 3 greys, accent blue, danger/warning/success)
- Border scale (2px muted, 4px default, 8px heavy)
- Offset solid shadows (sm/md/lg)
- Z-index scale (sticky, dropdown, overlay, backdrop, modal, toast, command)
- Typography (Raleway 400/600/800/900, Space Mono 400/700)

## Built with

This project follows the [Sauce UI Guidelines](https://github.com/sauce-consultants/component-guidelines) specification library, implementing all 7 setup steps:

1. Brand audit
2. Design token layer
3. Dev showcase routes
4. Component library (41/41)
5. Layout shells
6. Page templates
7. Feature development (ready)
