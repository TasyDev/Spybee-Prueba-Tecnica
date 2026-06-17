---
name: atomic-design-components
description: >
  Use it when the user passes a component description or CSS code and wants to
  generate the complete Atomic Design structure: folder, TSX, SCSS with CSS Modules,
  and Storybook. Triggers when the input contains [COMPONENT], [CSS], or [RULES],
  or when the user asks to "create component", "generate atom", "generate molecule",
  "convert this to SCSS", or any variant of building a UI component with folder
  structure. Also triggers if the user mentions Storybook + SCSS + Atomic Design
  in the same message. ALWAYS use this skill before generating any React component
  involving SCSS styles or Storybook stories.
---

# Atomic Design Component Generator

Generates React components (TSX) + CSS Modules SCSS + Storybook from CSS code
or a component description. Applies Atomic Design strictly: atoms and molecules
only. Organisms are assembled by the dev.

**This skill is adapted for the Spybee Design System.** Tokens are already defined
in `src/styles/abstracts/`. Do NOT create token files — use `@use` on existing ones.

---

## File Structure

Each component generates exactly 4 files:

```
{level}/{kebab-name}/
├── {PascalName}.tsx
├── {PascalName}.stories.tsx
├── {kebab-name}.module.scss
└── index.ts
```

Example:
```
atoms/button/
├── Button.tsx
├── Button.stories.tsx
├── button.module.scss
└── index.ts
```

---

## When to Trigger

- Input contains `[COMPONENT]:` with a component name + optional `[RULES]:`
- User asks "create button", "generate atom", "create molecule"
- User pastes raw CSS and says "convert this to SCSS"
- User mentions "Storybook + SCSS + Atomic Design" together

---

## Key Differences from Standard Generator

| Aspect | Standard | This Skill |
|---|---|---|
| Token system | Creates `styles/tokens/` | Uses `src/styles/abstracts/` (already exists) |
| className utility | `array.join` | `clsx` |
| Colors | Extracts from CSS | Maps to Spybee tokens |
| Tailwind conversion | Yes | No — use raw CSS or description |
