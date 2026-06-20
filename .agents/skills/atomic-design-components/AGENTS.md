# Atomic Design Component Generator

**Version 1.0.0**
spybee
June 2026

> Generates React components (TSX) + CSS Modules SCSS + Storybook from CSS code
> or a component description. Applies Atomic Design strictly: atoms and molecules
> only. Organisms are assembled by the dev.

---

## 1. Reading the Input

The input comes in two modes. Detect which one applies:

### Mode A — Conversion (CSS code present)
The input contains CSS properties, class names, or raw CSS blocks.
```
[COMPONENT]: Button with icon, primary / secondary / disabled variants
[CSS]: button { padding: 8px 16px; background: #F5C518; color: #1A1A1A; border-radius: 8px; }
[RULES]: primary uses brand color, secondary is outline with border, disabled reduces opacity
```

### Mode B — Generation (description only)
No CSS present. Only `[COMPONENT]:` and optionally `[RULES]:`.
```
[COMPONENT]: Status badge with success / warning / error variants
[RULES]: each variant has a different background color and text
```

**If the input doesn't use tags**: interpret the full message as Mode B.

### Handling Raw CSS Input
When the user pastes raw CSS (e.g., from an existing project or a design tool):

1. Read the CSS properties and extract:
   - `background-color` / `background` → map to `$color-*` token
   - `color` → map to `$color-*` token
   - `padding`, `margin`, `gap` → map to `space()` function
   - `border-radius` → map to `$radius-*` token
   - `font-size`, `font-weight`, `line-height` → map to typography mixins
   - `box-shadow` → map to `$shadow-*` or use `box-shadow`
   - `border` → use `$color-border` token

2. Do NOT recreate tokens — use the existing Spybee tokens from `abstracts/`.

---

## 2. Spybee Token Reference

Always use these tokens. Never hardcode values that exist in the system.

### Colors (from `_variables.scss`)
```
Surface:    $color-surface, $color-elevation-0/1/2
Text:       $color-on-surface, $color-on-surface-variant, $color-text-muted
Primary:    $color-primary-container (#F5C518), $color-primary (#FFE5A0)
Error:      $color-status-danger (#EF4444)
Warning:    $color-status-warning (#F59E0B)
Success:    $color-status-success (#22C55E)
Border:     $color-border (#3D3D3D)
Outlines:   $color-outline, $color-outline-variant
```

### Typography (mixins from `_mixins.scss`)
```scss
@include font-scale($font-h1);        // 24px Semi-Bold
@include font-scale($font-h2);        // 20px Semi-Bold
@include font-scale($font-h3);        // 16px Semi-Bold
@include font-scale($font-body);      // 14px Regular
@include font-scale($font-caption);   // 12px Regular
@include label-caps;                  // 11px Medium, uppercase, 0.05em
@include responsive-h1;               // H1 that scales down on mobile
```

### Spacing (functions from `_functions.scss`)
```scss
space(1)   // 4px
space(2)   // 8px
space(3)   // 12px
space(4)   // 16px
space(6)   // 24px
space(8)   // 32px
```

### Radius
```scss
$radius-sm:    0.25rem;   // 4px
$radius-md:    0.75rem;   // 12px (cards)
$radius-lg:    1rem;      // 16px (panels)
$radius-xl:    1.5rem;    // 24px
$radius-full:  9999px;    // pill (tags)
$radius-button: 8px;
$radius-card:  12px;
$radius-panel: 16px;
$radius-default: 0.5rem;  // 8px
```

### Shadows
```scss
$shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.4);
```

### Mixins
```scss
@include elevation(0);   // background: $color-elevation-0
@include elevation(1);   // background: $color-elevation-1
@include elevation(2);   // background: $color-elevation-2
@include focus-ring;     // outline: 2px solid $color-primary-container
@include transition;     // all 200ms ease-out
@include modal-elevation;
@include button-base;    // inline-flex, center, gap, padding, border-radius, transition
@include container;
@include truncate;
@include sr-only;
```

### Media Query Mixins
```scss
@include mobile  { ... }   // max-width: 767px
@include tablet  { ... }   // min-width: 768px
@include desktop { ... }   // min-width: 1024px
@include wide    { ... }   // min-width: 1440px
```

---

## 3. Atomic Decision Tree

Before generating, classify the component:

### It's an ATOM if ALL of the following apply:
- Single visual responsibility
- Does not compose other components with their own logic
- Does not accept complex `children` (at most text or an icon)
- Examples: `Button`, `Input`, `Label`, `Icon`, `Badge`, `Avatar`, `Checkbox`, `Toggle`

### It's a MOLECULE if ANY of the following apply:
- Composes 2 or more atoms
- Has internal state that coordinates atoms
- Accepts `children` with a defined structure
- Examples: `SearchInput`, `FormField`, `ButtonGroup`, `InputWithLabel`

### If ambiguous: classify as ATOM and document it in a comment in the TSX.

---

## 4. Output Contract — Always 4 Files

```
{level}/{kebab-name}/
├── {PascalName}.tsx
├── {PascalName}.stories.tsx
├── {kebab-name}.module.scss
└── index.ts
```

**Never** generate extra files. **Never** omit any of the 4.

---

## 5. TSX Template

```tsx
// {PascalName}.tsx
import { clsx } from 'clsx';
import styles from './{kebab-name}.module.scss';

export interface {PascalName}Props {
  variant?: 'primary' | 'secondary' | 'disabled';
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function {PascalName}({
  variant = 'primary',
  label,
  onClick,
  disabled = false,
  className,
}: {PascalName}Props) {
  return (
    <element
      className={clsx(
        styles.{camelName},
        variant !== 'primary' && styles[`{camelName}--${variant}`],
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </element>
  );
}
```

### TSX Rules
- Always use named export (no default export)
- Props interface always exported
- `className` prop always included for external composition
- Use `clsx()` for all className composition
- Variants via CSS Modules with pattern `styles['block--modifier']`
- No business logic, only presentation logic

---

## 6. SCSS Template (CSS Modules + Internal BEM)

```scss
// {kebab-name}.module.scss
@use '../../styles/abstracts' as *;

.{camelName} {
  padding: space(2) space(4);
  border-radius: $radius-button;
  cursor: pointer;
  @include transition;

  &--primary {
    background-color: $color-primary-container;
    color: $color-on-primary;

    &:hover {
      opacity: 0.9;
    }
  }

  &--secondary {
    background-color: transparent;
    border: 1px solid $color-outline;
    color: $color-on-surface;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
```

### SCSS Rules
- Always `@use '../../styles/abstracts' as *;` — never `@import`
- The root block matches the component name in camelCase
- Modifiers always with `&--{variant}`
- States (`:hover`, `:focus`) nested inside the corresponding modifier
- Only use token variables and functions (`space()`, `$color-*`, `$radius-*`, mixins)
- Never hardcode values that exist in the token system

---

## 7. Storybook Template

```tsx
// {PascalName}.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { {PascalName} } from './{PascalName}';

const meta: Meta<typeof {PascalName}> = {
  title: '{Level}/{PascalName}',
  component: {PascalName},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof {PascalName}>;

export const Primary: Story = {
  args: { variant: 'primary', label: '{PascalName}' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', label: '{PascalName}' },
};

export const Disabled: Story = {
  args: { variant: 'disabled', label: '{PascalName}', disabled: true },
};
```

### Story Rules
- `title` always reflects the Atomic Design path (`Atoms/`, `Molecules/`)
- `tags: ['autodocs']` always present
- One exported Story per variant in `[RULES]`
- `argTypes` for props with finite values (enums/unions)

---

## 8. index.ts Template

```ts
// index.ts
export { {PascalName} } from './{PascalName}';
export type { {PascalName}Props } from './{PascalName}';
```

Always export the component and its type.

---

## 9. Delivery Order

Generate files in this order and announce each one:

```
✅ Classification: ATOM → atoms/button/

📁 Structure:
atoms/button/
├── Button.tsx
├── Button.stories.tsx
├── button.module.scss
└── index.ts

--- atoms/button/button.module.scss ---
[code]

--- atoms/button/Button.tsx ---
[code]

--- atoms/button/Button.stories.tsx ---
[code]

--- atoms/button/index.ts ---
[code]
```

---

## 10. What This Skill Does NOT Do

- ❌ Does not generate organisms (pages, layouts, full sections)
- ❌ Does not generate unit tests (Jest/Vitest)
- ❌ Does not modify existing tokens — uses `src/styles/abstracts/`
- ❌ Does not generate global barrel files (`components/index.ts`)
- ❌ Does not install dependencies — assumes `sass`, `clsx`, `storybook` are already configured
