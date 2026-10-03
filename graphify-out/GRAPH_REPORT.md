# Graph Report - VED  (2026-09-11)

## Corpus Check
- 79 files · ~299,702 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 151 nodes · 192 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core Application Structure
- Package Dependencies
- Hero Animations
- VED Logo Canvas
- Team Section
- Chip Loader
- Section Atmosphere
- Dev Dependencies
- Domains Section
- Events Section
- Magnetic Cursor
- Ambient Canvas

## God Nodes (most connected - your core abstractions)
1. `VEDLogoCanvas()` - 11 edges
2. `ChipLoader()` - 10 edges
3. `HeroAtmosphere()` - 8 edges
4. `SectionAtmosphere()` - 7 edges
5. `App()` - 6 edges
6. `loop()` - 6 edges
7. `MagneticCursor()` - 6 edges
8. `build()` - 5 edges
9. `loop()` - 5 edges
10. `boot()` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (14 total, 2 thin omitted)

### Community 0 - "Core Application Structure"
Cohesion: 0.10
Nodes (14): App(), onPopupClose(), refreshSnapPoints(), trySnap(), getSnapPoints(), SNAP_EASE(), SNAP_IDS, Footer() (+6 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.11
Nodes (17): gsap, dependencies, gsap, react, react-dom, @studio-freight/lenis, name, private (+9 more)

### Community 2 - "Hero Animations"
Cohesion: 0.19
Nodes (12): Hero(), GLOW_DEFS, HeroAtmosphere(), drawGlows(), drawParticles(), loop(), onResize(), onVis() (+4 more)

### Community 3 - "VED Logo Canvas"
Cohesion: 0.23
Nodes (15): drawPixel(), drawSolidChip(), generateChipTargets(), generateDots(), rrect(), VEDLogoCanvas(), boot(), build() (+7 more)

### Community 4 - "Team Section"
Cohesion: 0.15
Nodes (5): ROW1, ROW2, ROW3, ROW4, Team()

### Community 5 - "Chip Loader"
Cohesion: 0.29
Nodes (9): ChipLoader(), bevel(), buildTraces(), drawBg(), drawChip(), drawStatus(), drawTraces(), loop() (+1 more)

### Community 6 - "Section Atmosphere"
Cohesion: 0.31
Nodes (9): GLOW_VARIANTS, makeParticles(), SectionAtmosphere(), drawGlows(), drawParticles(), loop(), onResize(), onVis() (+1 more)

### Community 7 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react, @types/react-dom, vite (+1 more)

### Community 9 - "Events Section"
Cohesion: 0.29
Nodes (5): CountdownTimer(), Events, RARITY_COLORS, TYPE_COLOR, useCountdown()

### Community 10 - "Magnetic Cursor"
Cohesion: 0.33
Nodes (3): MagneticCursor(), lerp(), tick()

## Knowledge Gaps
- **28 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `VEDLogoCanvas()` connect `VED Logo Canvas` to `Hero Animations`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `ChipLoader()` connect `Chip Loader` to `Core Application Structure`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `VEDLogoCanvas()` (e.g. with `onResize()` and `onVis()`) actually correct?**
  _`VEDLogoCanvas()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `HeroAtmosphere()` (e.g. with `loop()` and `onResize()`) actually correct?**
  _`HeroAtmosphere()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `SectionAtmosphere()` (e.g. with `loop()` and `onResize()`) actually correct?**
  _`SectionAtmosphere()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `App()` (e.g. with `onPopupClose()` and `onPopupOpen()`) actually correct?**
  _`App()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._