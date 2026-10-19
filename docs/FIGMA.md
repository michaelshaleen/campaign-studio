# Figma: design system file

The component library in `src/components/ui` mirrors a Figma file so design and code share one
source of truth.

**Figma file:** [add link here once published]

## What's in the file

1. **Tokens page:** color styles and variables matching `src/app/globals.css` (brand, ink, surface,
   border, focus, danger, and the four badge tones), spacing scale (4 to 48), radii, and type sizes.
2. **Components page:** Button (primary / secondary / ghost, default / hover / disabled / loading),
   TextField (default / hint / error), Select, Badge (4 tones), Card, and StatTile, all built with
   auto layout and variants.
3. **Screens page:** Campaign list and Create campaign (empty, error, and filled states), built only
   from the components above.
4. **Accessibility notes:** focus states, 44px minimum touch targets, and contrast checks (Stark or
   the Figma contrast plugin) recorded beside each component.
