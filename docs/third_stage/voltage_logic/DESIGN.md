---
name: Voltage & Logic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#4cd6ff'
  on-tertiary: '#003543'
  tertiary-container: '#000000'
  on-tertiary-container: '#00809d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#b7eaff'
  tertiary-fixed-dim: '#4cd6ff'
  on-tertiary-fixed: '#001f28'
  on-tertiary-fixed-variant: '#004e60'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  column-gap: 32px
---

## Brand & Style

This design system embodies the intersection of physical hardware and abstract logic. It targets a technical audience—recruiters in deep-tech, fellow developers, and engineering leads—who value precision, efficiency, and a distinct lack of "fluff." 

The style is **Neo-Brutalist**, characterized by hard edges, high-contrast boundaries, and a technical "blueprint" aesthetic. It avoids the softness of consumer-grade SaaS in favor of a raw, "compiled" look. Every element feels intentional and structural, mirroring the discipline required for both electrical engineering and software development. 

The emotional response is one of uncompromising expertise: cold, fast, and intellectually sharp.

## Colors

The palette is anchored in absolute extremes to maximize visual impact and readability.

- **Primary & Background:** Deep Black (#000000) serves as the "void" or terminal backdrop.
- **Secondary & Text:** Pure White (#FFFFFF) provides razor-sharp legibility for high-density information.
- **Accents:** 
    - **Electric Blue (#00D1FF):** Represents the "Logic" and "Software" layer. Used for data visualizations, links, and primary actions.
    - **Cyber Purple (#BD00FF):** Represents the "Voltage" and "Hardware" layer. Used for hover states, hardware specs, and secondary highlights.
- **System States:** Success is handled with Electric Blue; errors are handled with a high-saturation red (#FF003C), maintaining the high-contrast ethos.

## Typography

The typography strategy leverages the tension between a geometric display face and a functional monospace face.

**Space Grotesk** is used for headlines. Its idiosyncratic shapes and tight tracking create a modern, edgy "editorial" feel that commands attention. 

**JetBrains Mono** is used for all body text, labels, and UI elements. This choice reinforces the developer-centric identity, providing exceptional legibility for technical descriptions and code snippets alike. 

All headings should be set with tight letter-spacing to emphasize the brutalist structure. Body text should maintain generous line-height to ensure technical documentation remains readable despite the high-contrast color scheme.

## Layout & Spacing

The layout is built on a **12-column rigid grid** for desktop and a **4-column grid** for mobile. 

The rhythm follows a strictly linear scale based on 4px units. To maintain the brutalist feel, avoid "centering" content; instead, align elements to the far left or right of the grid containers. Use heavy, visible 1px or 2px borders to separate sections instead of whitespace alone.

- **Desktop:** 64px outer margins, 24px gutters. Elements should "snap" to the grid lines.
- **Mobile:** 20px outer margins. Multi-column layouts should collapse into a single vertical stack, with horizontal scrolling reserved strictly for code blocks.

## Elevation & Depth

This system rejects shadows, blurs, and organic depth. Hierarchy is established through **Visual Weight** and **Layer Stacking**:

1.  **Flat Surfaces:** The base layer is pure #000000.
2.  **Inverted Blocks:** Use pure #FFFFFF blocks for high-priority cards or sections, creating a "punch-through" effect.
3.  **Hard-Edged Offsets:** Create depth by duplicating an element's border and offsetting it by 4px or 8px (e.g., a "shadow" that is actually a solid colored rectangle with no blur).
4.  **Borders as Dividers:** Use 1px #FFFFFF borders for standard containers and 2px #00D1FF borders for active or focused states. 
5.  **Overlays:** Technical overlays (like tooltips or menus) should have solid #1A1A1A backgrounds with a 1px #FFFFFF border.

## Shapes

The shape language is strictly **polygonal**. 

- **Zero Radius:** Every button, input field, card, and container must have 0px border-radius.
- **Angle Accents:** Decorative elements may use 45-degree chamfered corners to mimic PCB (Printed Circuit Board) traces or architectural drafting.
- **Data Points:** In charts or lists, use squares or diamonds instead of circles for bullet points or data markers.

## Components

### Buttons
Buttons are solid blocks. The "Primary" state is a #FFFFFF background with #000000 text. On hover, the button shifts to an Electric Blue background with an 8px solid offset "shadow" in Cyber Purple.

### Chips / Tags
Small, 1px bordered boxes using JetBrains Mono. Use Electric Blue borders for "Software/Logic" tags and Cyber Purple for "Hardware/Electronics" tags.

### Inputs
Input fields are #000000 with a 1px #FFFFFF bottom border only. On focus, the border turns Electric Blue and the label (positioned above the line) stays static.

### Cards
Cards are defined by their borders, not their background. A card is a 1px #FFFFFF stroke. To emphasize a card, add a "header" bar—a solid white strip at the top of the box containing the title in black text.

### Code Blocks
Code blocks use a slightly lighter neutral (#1A1A1A) background to differentiate from the primary black. No rounded corners. Line numbers are mandatory to emphasize the technical nature of the brand.

### Navigation
The navigation should be a persistent sidebar or a header with a "command line" aesthetic. Use a blinking cursor animation after the active page link to reinforce the terminal theme.