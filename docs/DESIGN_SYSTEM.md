# Kollect-It Design System

## Brand Foundation

- Voice: Sophisticated, trustworthy, curated
- Visual Style: Museum-quality meets accessible expertise
- Not: Dusty vintage, minimalist sterile, or overly trendy

## Color Tokens

- Text
  - --color-text-primary: #2C2C2C
  - --color-text-secondary: #5A5A5A
  - --color-text-tertiary: #8C8C8C
- Accent
  - --color-accent: #B1874C (gold)
- Interactive
  - --color-cta: #1E3A5F (deep navy)
  - --color-link: #4B688E (AA-adjusted), --color-link-hover: #405A7A
- Backgrounds
  - --color-bg: #FFFFFF
  - --color-bg-alt: #F5F3F0
  - --color-bg-elevated: #FAFAF9
- Borders
  - --color-border-token: #E0DDD9

HSL ramps for Tailwind semantic colors are defined in `src/app/globals.css` and mapped in `tailwind.config.ts` as `ink`, `gold`, `surface`, `cta`, `link`, and `border-neutral`.

## Typography

- --font-heading: "Cormorant Garamond", serif
- --font-body: "Lato", sans-serif
- Heading line-height: 1.25
- Body line-height: 1.75

## Components

- Buttons
  - Primary: `.btn-primary` / `<Button variant="primary">`
  - Secondary: `.btn-secondary` / `<Button variant="secondary">`
  - Accent: `.btn-accent` / `<Button variant="accent">`
- Sections
  - `<Section variant="default" | "alt" | "elevated">`
- Cards
  - `.card` utility for rounded, elevated blocks

## Accessibility

- All tokens meet WCAG AA on white (see `docs/contrast-results.txt`).
- Focus ring colors aligned with CTA.

## Migration Notes

- Old brown palette removed. Use `text-ink`, `text-ink-secondary`, `border-border-neutral`, etc.
- Avoid raw hex codes; prefer semantic utilities and tokens.

## References

- Tailwind config: `tailwind.config.ts`
- Global styles: `src/app/globals.css`
- Token utilities: `styles/tokens.css`
- UI components: `src/components/ui/Button.tsx`, `src/components/ui/Section.tsx`
