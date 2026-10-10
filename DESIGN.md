---
name: Anil Kumar Cinematic Portfolio
description: An immersive SAP BTP integration showcase with readable professional evidence.
colors:
  bg0: "#040b15"
  bg1: "#071321"
  bg2: "#0c1c2c"
  text: "#edf5ff"
  muted: "#b0c1d4"
  dim: "#91a7bf"
  cyan: "#22d3ee"
  blue: "#60a5fa"
  violet: "#a78bfa"
  emerald: "#34d399"
  amber: "#fbbf24"
  line: "rgba(148,163,184,.14)"
  line-hi: "rgba(148,163,184,.28)"
  primary-fill: "#9beaf5"
  primary-ink: "#062032"
typography:
  display:
    fontFamily: "'Space Grotesk', 'Inter Variable', sans-serif"
    fontSize: "clamp(3.25rem,5.4vw,5.7rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-.04em"
  headline:
    fontFamily: "'Space Grotesk', 'Inter Variable', sans-serif"
    fontSize: "clamp(2rem,4vw,3.65rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-.02em"
  body:
    fontFamily: "'Inter Variable', Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontWeight: 400
rounded:
  r: "14px"
  r-sm: "12px"
  button: "10px"
  node: "8px"
  chip: "7px"
spacing:
  action-gap: "12px"
  hero-gap: "52px"
  panel-padding: "30px"
  section: "clamp(84px,9vw,136px)"
components:
  button-primary:
    backgroundColor: "{colors.primary-fill}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.button}"
    padding: "0 20px"
  button-ghost:
    backgroundColor: "rgba(255,255,255,.03)"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "0 20px"
  motion-toggle:
    backgroundColor: "{colors.bg2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.node}"
    padding: "6px 10px"
  expertise-card:
    backgroundColor: "{colors.bg1}"
    textColor: "{colors.text}"
    padding: "{spacing.panel-padding}"
  resume-input:
    backgroundColor: "#05070a"
    textColor: "{colors.text}"
    rounded: "{rounded.r-sm}"
    padding: "0 14px"
---

# Design System: Anil Kumar Cinematic Portfolio

## Overview

**Creative North Star: "The Integration Sphere"**

The approved immersive showcase places luminous integration geometry against midnight ink, with generous editorial spacing and direct professional language. Cyan highlights connect the title, actions and network without obscuring career evidence. Light mode preserves the hierarchy using cool paper and deeper blue-green ink.

This is the implemented source system. `src/main.tsx` imports `styles.css`, `v3.css`, `theme.css`, then `cinematic.css`; `src/cinematic.css` supplies the final overrides. The older portfolio-root DESIGN.md remains a historical reference. Frontmatter captures the active dark primitives; theme mappings and behavior live in `.impeccable/design.json`.

**Key Characteristics:**

- One signature integration sphere with interactive system labels.
- Large plain display type, readable text and hairline content structure.
- Ambient cinematic motion with explicit pause and reduced-motion defaults.
- Professional content remains available across light, dark and mobile modes.

## Colors

### Primary

Cyan identifies title accents, focus outlines and integration activity. Ice-blue primary fill carries the main architecture action with deep ink text. The light theme uses deeper cyan and a darker primary button; its complete token mapping is in the sidecar.

### Secondary

Blue, violet, emerald and amber distinguish system categories and architecture paths. Emerald also marks availability. Preserve the existing category assignments rather than inventing new semantic meanings.

### Neutral

Midnight background, two raised ink surfaces, pale text, muted copy and dim metadata establish hierarchy. Translucent line tokens divide stats, timeline rows and controls. The atmosphere uses a single upper-right blue radial wash; legacy grid, grain and spotlight layers are hidden by the final overrides.

## Typography

Space Grotesk is the display family; Inter Variable provides body copy and most UI labels. JetBrains Mono remains for protocol and technical labels. The frontmatter defines the desktop roles; responsive hero sizes are recorded in the sidecar.

Hero introduction copy is bounded to 43 characters with generous leading. Timeline bullets stay within 72 characters. Section headings have a tighter line height than body text. Hero accent words remain solid color; the earlier animated gradient lettering is disabled.

## Layout

General sections use the existing 1200px wrapper with 48px total horizontal inset. The hero expands to a 1440px maximum with 96px inset, asymmetric columns (1fr / 1.05fr), and the hero-gap token. The navigation uses the same maximum with 64px inset and an 82px height. Hero minimum height follows the small viewport unit (`calc(100svh - 150px)`).

At 1100px, the hero inset becomes 56px and its gap 24px; navigation inset becomes 40px. Desktop navigation becomes a full-screen menu at 1024px. At 760px, the final hero becomes an ordered column: title, speciality, introduction, network, actions, LinkedIn and availability. Its inset is 40px, gap 18px and stage maximum 430px. Stats become two columns with row dividers. Expertise uses three columns, two at 900px and one at 720px. Workstation tabs become three columns at 1100px and a horizontal scroll-snap row at 720px.

## Elevation & Depth

Depth concentrates on the sphere and its central translucent hub. The hero uses actual Three.js latitude/longitude geometry, orbital rings, particles and moving satellites; the DOM labels remain the interactive surface. Flat stats and timeline rows use dividers, while expertise and workstation surfaces use tonal layering. Shadows on the hub, actions and selected nodes provide local depth; they do not turn every section into a floating glass card. Exact shadow values remain in the sidecar.

## Shapes

The hub and globe use circular silhouettes. Content modules and workstation frames use the r token, actions use the button token, and node/motion controls use the node token. The resume field retains the r-sm token. Timeline and insight surfaces remain square and open, using bottom or left borders instead of enclosing cards.

## Components

### Buttons and navigation

Architecture is the filled primary action; experience uses a ghost action. Buttons have a 48px minimum height and fine-pointer hover lift. Touch hover transforms are suppressed. Keyboard focus uses a cyan outline (2px with 3px offset). Resume access remains a protected dialog flow. Desktop navigation uses a cyan active underline; the mobile menu preserves theme switching and contact actions.

### Expertise and architecture

Expertise is a hairline module grid with open lists, 30px internal padding and subtle hover color. Architecture uses a rounded workstation, accessible scenario tabs, technical diagrams and explanatory copy. Conceptual scenarios retain their explicit labels.

### Integration sphere and motion controls

The sphere lazy-loads on capable desktops: width at least 760px, at least four hardware threads, no Save Data preference, and WebGL available. Loading waits for browser idle, with a timed fallback. The canvas caps device pixel ratio at 1.5 and renders only when visible, the document is visible, and ambient motion is enabled. Mobile, constrained devices and unavailable WebGL use static SVG globe geometry; the shared connectors and DOM buttons preserve exploration.

The motion button pauses ambient loops across the page and the 3D render loop. It is not a blanket suspension of navigation, hover, architecture selection or one-time counters. Reduced motion defaults to paused; the user may explicitly enable runtime scene and connector motion. Reduced-motion CSS still suppresses transitions, tilt and packet decoration. System buttons support hover, focus and click, set their pressed state, and update a polite live explanation.

## Do's and Don'ts

### Do:

- Do consult the final cinematic overrides before extending a component.
- Do preserve visible focus, keyboard system selection, motion controls and light/dark support.
- Do keep system labels and conceptual explanations usable without WebGL.
- Do preserve factual career content, the August 2018 employment date, protected resume access and existing contact destinations.

### Don't:

- Don't invent career metrics, client architectures or new delivery claims.
- Don't add scroll hijacking or sound.
- Don't turn the ambient pause control into a claim that every interaction or one-time animation is stopped.
- Don't apply hover lift to touch-only devices or reintroduce disabled atmosphere layers.


Career Journey follows About directly. A 10.5-second signal loops through the seven stages with a local Pause/Resume control; it pauses outside the viewport and while the document is hidden. The user explicitly requested visible Journey motion; its local control can pause it on all devices.

The Career Journey connector progressively draws behind the traveling signal, holds the completed connection for the final 14% of each cycle, then resets. Mobile uses the same progression vertically.

Core expertise now uses six capability panels on a 12-column grid. SAP BTP / Integration Suite spans eight columns, supporting capabilities span four, and Security & Architecture spans twelve. Labeled conceptual flow diagrams replace the former small glyphs; all 46 source skill entries remain visible as tags. A local Pause/Resume control stops the data-flow packets. The section collapses to one column below 760px and supports both themes.

Contact now matches the navy/cyan surfaces, 14px panel radius, larger heading and readable sans-serif metadata. Its intro states availability for remote SAP BTP and enterprise integration architecture engagements. Email copy, LinkedIn destination and protected resume dialog were checked; the mobile single-column layout has no horizontal overflow.

Landscape system boxes are narrower, allocating more width to connectors. Connector strokes use higher contrast and 1.5px width; the active path uses 2.5px. Path endpoints now align with the system-box centres.

Light mode now uses a SAP-inspired cloud palette: white surfaces, pale blue backgrounds, dark blue-gray text, and strong blue actions and integration hubs. Blue data-flow effects and selected outlines replace muted teal. Hero globe colors follow the same palette; dark mode is unchanged.

Architecture capabilities advance sequentially every three seconds, wrap to the first tab, and provide a local Pause/Resume control plus a progress line. The timer stops outside the viewport or while the document is hidden. Manual selection restarts the dwell time; keyboard tab navigation remains available.
