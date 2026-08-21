# REACT_TEMPLATE.md

## 1. Stack

- Build system: Vite
- Language: TypeScript with `strict: true`
- UI framework: React
- Routing: `react-router-dom`
- State management: Redux Toolkit
- Persistence: `redux-persist` when session continuity is required
- HTTP client: Axios
- UI library: Ant Design
- Notifications: `react-toastify` via antd notifications
- Date handling: `dayjs`
- Styling: CSS Modules + global theme tokens via CSS custom properties
- Linting: ESLint
- Formatting: Prettier

Agent rule:
- do not replace the core stack unless the task explicitly requires a different platform decision.

## 2. Startup Commands

Default commands for projects of this type:

- install: `npm install`
- dev server: `npm run dev`
- build: `npm run build`
- lint: `npm run lint`
- preview build: `npm run preview`

Recommended default scripts:
- `dev`
- `build`
- `lint`
- `preview`

Optional but recommended scripts:
- `test`
- `typecheck`

## 3. Environment

Agent rules:
- all public frontend environment variables should use the `VITE_` prefix;
- never hardcode environment-specific URLs in components;
- read configuration through a centralized setup layer.

## 4. Recommended Source Layout

Top-level structure:

- `public/` - static assets
- `src/` - application source code
- `dist/` - production build output

Recommended `src/` structure:

- `api/` - API clients, interceptors, request configuration
- `assets/` - icons, images, fonts
- `common/` - shared constants, enums, helpers
- `components/` - reusable and feature-level UI
- `features/` - Redux slices and feature state
- `hooks/` - reusable React hooks
- `interfaces/` - app and entity typings
- `pages/` - route-level pages
- `routers/` - router setup, guards, navigation helpers
- `store/` - Redux store and middleware
- `styles/` - global styles, themes, tokens
- `utils/` - pure utility functions

Recommended component grouping:

- `components/ui/` - generic reusable UI primitives
- `components/layouts/` - app shell and layout pieces
- `components/forms/` - form-specific components
- `components/lists/` - lists, tables, grids

Agent rules:
- create folders only when they improve discoverability;
- avoid flat `src/` growth with unrelated files mixed together;
- keep route-level and reusable code separated.

## 5. Architecture Rules

Preferred architecture:

- pages orchestrate feature composition;
- components render UI and local interactions;
- API layer owns HTTP communication;
- store owns shared client state;
- utilities stay side-effect-light unless clearly named otherwise.

Agent rules:
- do not place direct API calls in deeply nested presentational components;
- do not store server-derived shared data in arbitrary local component state when it belongs in the store;
- do not introduce duplicate abstractions for the same responsibility.

## 6. Routing Rules

Recommended routing approach:

- centralize route declarations in a router module;
- separate public and protected routes;
- keep route guards explicit;
- keep route paths stable and feature-oriented.

Recommended route groups:

- auth routes
- main app routes
- fallback not-found route

Agent rules:
- route-level pages should live in `pages/` or a clearly equivalent structure;
- redirects should be explicit and easy to trace;
- navigation logic should not be scattered across unrelated components.

## 7. State Management Rules

Use Redux Toolkit for:

- authenticated user state
- app-wide dictionaries and reference data
- shared filters
- cross-page asynchronous data
- UI state that affects multiple route segments

Do not use Redux for:

- trivial local form state
- small transient UI toggles confined to one component subtree

Agent rules:
- prefer slice-based organization;
- export typed hooks for selector and dispatch access;
- persist only the minimum required state;
- avoid storing duplicated derived data when selectors can compute it.

## 8. API Layer Rules

Recommended API structure:

- one centralized Axios setup file;
- one or more API classes or grouped modules per backend area;
- request/response typing for every endpoint;
- interceptors for auth and global error handling.

Agent rules:
- define new endpoints in the API layer, not inside pages;
- normalize response handling consistently;
- keep token injection and auth handling centralized;
- place backend contracts in typed interfaces close to the domain model.

Recommended API folder contents:

- `index` setup file
- auth API module
- feature API modules
- request/response helpers

## 9. Styling System

Use the following styling model:

- component styles: CSS Modules
- global design tokens: CSS custom properties
- theming: `data-theme` or theme class on root node
- shared tokens: centralized theme files under `src/styles/`

Do not use:

- SCSS variables as the primary token source;
- hardcoded colors scattered through components;
- theme logic duplicated inside many components.

Recommended theme structure:

- `src/styles/tokens.css` - semantic token names
- `src/styles/themes/light.css` - light theme values
- `src/styles/themes/dark.css` - dark theme values
- `src/styles/index.css` - global reset and imports

Recommended token categories:

- `--color-bg`
- `--color-surface`
- `--color-text`
- `--color-text-muted`
- `--color-border`
- `--color-primary`
- `--color-primary-hover`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--shadow-sm`
- `--shadow-md`
- `--radius-sm`
- `--radius-md`
- `--space-xs`
- `--space-sm`
- `--space-md`
- `--space-lg`

Agent rules for styling:
- all reusable visual values should be expressed through CSS custom properties;
- tokens should be semantic, not brand-hardcoded;
- new themes must override token values, not component selectors;
- component styles should consume tokens via `var(--token-name)`;
- global theme switching should work without rewriting component CSS.

## 10. Theme Rules

Minimum supported themes:

- light
- dark

Recommended implementation:

- set theme on `html`, `body`, or app root via `data-theme="light"` / `data-theme="dark"`;
- load token defaults once globally;
- keep theme state in app config or dedicated UI state.

Agent rules:
- never assume a single light-only palette;
- ensure new components remain readable in both light and dark themes;
- when adding colors, define them in both supported themes at the same time.

## 11. Import and Naming Conventions

Recommended path alias:

- `@/` -> `src/`

Naming conventions:

- components: `PascalCase`
- hooks: `useSomething`
- interfaces: `I*` if the project already follows that convention, otherwise use descriptive type aliases and interfaces consistently
- enums: `E*` if enums are used
- Redux slices: `*.slice.ts`
- utilities: `*.util.ts`
- CSS Modules: `ComponentName.module.css`
- pages: `FeaturePage.tsx`

Agent rules:
- pick one naming convention per project and stay consistent;
- prefer local consistency over personal preference;
- avoid mixing multiple parallel file naming schemes.

## 12. TypeScript Rules

Required defaults:

- `strict: true`
- no unused locals
- no unused parameters
- no silent fallthrough in `switch`

Agent rules:
- avoid `any`;
- prefer precise models for API contracts;
- separate app-level types from entity-level types;
- keep function signatures explicit when shared across modules.

## 13. UI and UX Rules

Recommended UI principles:

- use the design system consistently;
- keep form flows predictable;
- make empty, loading, and error states explicit;
- support responsive layouts from the start;
- optimize for business clarity over decorative complexity.

Agent rules:
- do not leave async screens without loading/error handling;
- use existing UI primitives before introducing custom alternatives;
- design components so they can survive theme switching cleanly;
- keep accessibility in mind for color contrast, labels, and keyboard flow.