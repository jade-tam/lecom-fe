# Lecom Sveltekit Frontend

## Technologies

- Package Manager: PNPM
- SvelteKit 2 - Svelte 5
- TailwindCSS 4: <https://tailwindcss.com/docs>
- Daisy UI 5: <https://daisyui.com/>
- Icons - Iconify for Tailwind CSS 4: <https://iconify.design/docs/usage/css/tailwind/tailwind4/>
  - Icon pack: Font Awesome Solid <https://icon-sets.iconify.design/fa7-solid>
- Form handling: <https://superforms.rocks/get-started>

## 🧩 Running the Project

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the development server

```bash
pnpm dev
```

## ⚠️ Before Committing Code

Please make sure your code is formatted and linted before committing:

```bash
pnpm format
pnpm lint
```

## Recommended `lib/components` Structure

```plaintext
src/lib/components/
├── ui/                  # Basic, reusable UI components (buttons, inputs)
├── layout/              # Layout components (header, footer, sidebar)
├── form/                # Form components (custom inputs, validation components)
├── features/            # Feature-specific components (dashboard, profile)
├── modal/               # Modal components (modal wrapper, specific modals)
```

### 1. `ui/` (Atomic Components)

- These are small, reusable UI components like buttons, inputs, and cards.
- They have no business logic and are purely presentational.

**Example:**

```plaintext
src/lib/components/ui/
├── Button.svelte
├── Input.svelte
└── Card.svelte
```

### 2. `layout/` (Layout Components)

- Components related to the layout structure of your application.
- Includes headers, footers, navigation bars, and sidebars.

**Example:**

```plaintext
src/lib/components/layout/
├── Header.svelte
├── Footer.svelte
└── Sidebar.svelte
```
