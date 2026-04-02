# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Both sub-projects must run simultaneously for the full experience to work.

**3d-site** (Three.js host, port 5173):
```bash
cd 3d-site && npm run dev      # dev server
cd 3d-site && npm run build    # production build
cd 3d-site && npm run preview  # preview build
```

**inner-site** (React OS app, port 5174):
```bash
cd inner-site && npm run dev      # dev server (locked to port 5174)
cd inner-site && npm run build    # production build
cd inner-site && npm run preview  # preview build on port 5174
```

There are no test or lint commands configured.

## Architecture Overview

This is a two-app portfolio system. The 3d-site renders a 3D room scene (Three.js + WebGL) with a monitor. The inner-site is a React app that runs as an iframe overlaid on that 3D monitor using Three.js's `CSS3DRenderer`. Both apps share the same `THREE.PerspectiveCamera` instance, so the iframe perspective matches the 3D scene perfectly.

### Rendering Pipeline

1. **3d-site** loads a Blender model (`public/gaming_scene.glb`) showing a gaming desk
2. A transparent raycaster hitbox plane sits at the monitor's world position for click detection
3. `MonitorScreen.ts` creates a `CSS3DObject` wrapping an `<iframe>` pointed at `localhost:5174`
4. On monitor click → camera lerps toward monitor → iframe becomes interactive (pointer events enabled)
5. WebGL renders first, CSS3DRenderer composites the iframe on top using the same camera

### Event Relay

`inner-site/index.html` has an inline script that normalizes mouse/keyboard events and posts them to the parent via `window.parent.postMessage()`. The 3d-site parent uses these for raycaster hit detection on the monitor mesh.

### Key Files

| File | Role |
|------|------|
| `3d-site/src/Application/Application.ts` | Main orchestrator — raycasting, event handling, camera state |
| `3d-site/src/Application/World/MonitorScreen.ts` | Creates the CSS3D iframe overlay; hard-codes inner-site URL on line 20 |
| `3d-site/src/Application/Camera/Camera.ts` | Camera state machine with delta-time-independent lerp |
| `3d-site/src/Application/World/World.ts` | Scene setup, model loading, lighting |
| `inner-site/src/styles/tokens.ts` | Single source of truth for all design tokens (`T.accent`, `T.glass`, etc.) |
| `inner-site/src/components/os/Desktop.tsx` | Window manager — z-indexing, open/close state |
| `inner-site/src/components/os/Window.tsx` | Draggable/resizable window shell |
| `inner-site/src/components/apps/` | The four app windows: Portfolio, Projects, About, Contact |

### inner-site Design System

All styling uses inline styles referencing tokens from `tokens.ts`. There are no CSS modules or styled-components. The aesthetic is macOS glassmorphism — use `T.glass`, `T.glassDim`, `T.accent`, `T.borderSub`, `T.radiusSm`, `T.shadowSm` etc. for any new UI. Chip and Divider helper components are currently defined locally in each app file (Portfolio.tsx, About.tsx, Projects.tsx) rather than shared.

### Landing Page

`3d-site/index.html` is a self-contained landing page (no framework). It presents two choices — "3D Experience" dynamically imports `src/main.ts`, "Classic Portfolio" redirects externally. The 3D app is lazy-loaded only on user selection.

### Inner-site URL Coupling

`MonitorScreen.ts` line 20 hard-codes the inner-site URL as `${window.location.protocol}//${window.location.hostname}:5174`. For production, this must be updated to point to the deployed inner-site URL.
