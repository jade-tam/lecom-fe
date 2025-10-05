# Lecom Sveltekit Frontend

## Technologies

- Package Manager: PNPM
- SvelteKit 2 - Svelte 5
- TailwindCSS 4: <https://tailwindcss.com/docs>
- Daisy UI 5: <https://daisyui.com/>
- Icons - Iconify for Tailwind CSS 4: <https://iconify.design/docs/usage/css/tailwind/tailwind4/>
  - Icon pack: Font Awesome Solid <https://icon-sets.iconify.design/fa7-solid>

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

### 3. `form/` (Form Components)

- Custom form components and validation logic.
- Keeps form-related code organized and consistent.

**Example:**

```plaintext
src/lib/components/form/
├── TextInput.svelte
├── Select.svelte
└── FormWrapper.svelte
```

### 4. `features/` (Feature-Specific Components)

- Components that are specific to a particular feature or module of your app.
- Useful for organizing components by feature rather than type.

**Example:**

```plaintext
src/lib/components/features/
├── dashboard/
│   ├── DashboardStats.svelte
│   └── UserList.svelte
└── profile/
    ├── ProfileCard.svelte
    └── EditProfileForm.svelte
```

### 5. `modal/` (Modal Components)

- Centralized modal components for consistency in modal handling.

**Example:**

```plaintext
src/lib/components/modal/
├── ModalWrapper.svelte
└── ConfirmDialog.svelte
```
