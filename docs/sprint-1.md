# Sprint 1 — Inner-Site Content & Polish

## Files Changed

| File | What it does in the architecture |
|------|----------------------------------|
| `inner-site/src/components/apps/About.tsx` | Renders the "About" window inside the fake OS — displays name, bio, skills chips, and education inside a draggable app window. |
| `inner-site/src/components/apps/Contact.tsx` | Renders the "Contact" window — social links (email, GitHub, LinkedIn) plus a client-side contact form with a success state. |
| `inner-site/src/components/apps/Portfolio.tsx` | Renders the "Portfolio" window — a two-column layout with a sidebar nav and four sub-pages (Home, About, Experience, Software) rendered as a simple switch on local state. |
| `inner-site/src/components/apps/Projects.tsx` | Renders the "Projects" window — a master/detail split where a sidebar lists all projects and clicking one shows its full description and tags in the detail pane. |
| `3d-site/index.html` | The outer shell of the 3D scene: contains the loading screen, the landing choice card ("Denis Gusev / Choose your experience"), the `#info-overlay` shown after the landing lifts, and the `<canvas>` + `#css-renderer` layers where Three.js and CSS3DRenderer paint the scene. |
| `docs/sprint-1.md` | This file — architecture reference generated after Sprint 1. |

---

## Key Concepts Explained in Plain English

### CSS3DRenderer
Three.js has two renderers: `WebGLRenderer` paints 3D geometry on a `<canvas>`, and `CSS3DRenderer` positions real HTML elements in 3D space using CSS `transform: matrix3d(...)`. In this project both renderers run simultaneously on the same camera. The monitor's screen in the Blender scene is replaced by a `CSS3DObject` wrapping an `<iframe>` — so the inner-site React app literally lives inside the 3D scene as a real HTML document, not a texture. This is why you can click, scroll, and interact with it: it's not a screenshot, it's a live DOM node positioned in 3D.

### Token System (`styles/tokens.ts`)
Instead of hardcoding color hex values, spacing numbers, or font sizes throughout every component, all design values are stored in a single `T` object (imported as `import { T } from "../../styles/tokens"`). Every component reads from `T.accent`, `T.text`, `T.borderSub`, etc. This means changing the visual theme is a one-file edit. It's a lightweight version of what design systems like MUI or Chakra call a "theme."

### iframe Communication via `postMessage`
The 3D site (`3d-site/`) and the inner OS (`inner-site/`) run as two separate Vite dev servers on different ports. They can't share JavaScript variables directly (different origins). `window.postMessage` is the browser's cross-origin messaging API — one side calls `window.parent.postMessage({ type: "some-event", payload: ... }, "*")` and the other listens with `window.addEventListener("message", handler)`. In this codebase it's used to let the inner OS signal the 3D scene (e.g., to trigger camera moves or unlock interactions) without the two apps needing to know each other's internals.

### Glassmorphism OS Pattern
The inner-site is designed to look like a desktop OS (macOS-adjacent aesthetic). Each "window" is a React component rendered inside a draggable container with:
- `backdrop-filter: blur(...)` — frosted glass effect that blurs whatever is behind the element
- `background: rgba(255,255,255,0.3–0.5)` — semi-transparent white fill
- `border: 1px solid rgba(...)` — faint border to catch light
- A drop shadow for depth

This combination — blur + translucent fill + subtle border — is glassmorphism. The "OS" illusion works because the desktop background, taskbar, and app windows all use consistent variants of this pattern, so the whole UI reads as a coherent system even though it's plain React with inline styles.

---

## Non-Obvious Decisions & Tradeoffs

1. **Two renderers, one camera.** Running `WebGLRenderer` and `CSS3DRenderer` simultaneously on the same `PerspectiveCamera` is the only way to make HTML elements track 3D geometry precisely. The tradeoff is that `CSS3DRenderer` sits in a separate `<div>` layer above the canvas, so the iframe can't be occluded by 3D geometry — if a wall of the Blender scene were to pass in front of the monitor, the iframe would visually clip through it. This is a known limitation of CSS3DRenderer and why most production implementations keep the CSS plane fully unobstructed.

2. **Inner-site as a separate Vite app.** Keeping the inner OS (`inner-site/`) and the 3D scene (`3d-site/`) as two independent Vite projects means they have completely separate dependency trees and build pipelines. The tradeoff vs. a monorepo with shared packages is more duplication of config, but simpler mental separation: you can work on the OS UI without ever touching Three.js, and vice versa.

3. **Inline styles throughout.** Every component uses inline `style={{}}` objects referencing the token system rather than CSS modules or Tailwind. This avoids a build-time CSS pipeline and makes each component fully self-contained, but it means no stylesheet cascade, no media query support, and verbose JSX. For a portfolio-scale project it's pragmatic; at application scale it would become painful.

4. **`link: "#"` in Projects.tsx.** All projects use `link: "#"` (not a real URL), which causes the "View Project ↗" button to be hidden by the `{project.link !== "#" && ...}` guard. This is intentional scaffolding — replace `"#"` with a real GitHub or live URL for any project to surface the button automatically.

5. **Landing card + postMessage lift animation.** The `#landing` screen in `index.html` is a self-contained HTML/CSS/JS chunk with no framework dependency — it animates entirely via CSS keyframes and is removed from the DOM after the lift completes. This means it loads and animates before Three.js initializes, giving the user immediate visual feedback while assets stream in. The `window.__pauseRender` / `window.__resumeRender` hooks let the 3D animation loop opt out of rendering during the lift to save GPU work.

---

## Three Interview Questions (with Answers)

### Q1: How does the 3D scene display a fully interactive React app on the monitor screen?

**Answer:** Three.js's `CSS3DRenderer` maps HTML elements into 3D space by computing a `matrix3d()` CSS transform that matches the camera's projection matrix. A `CSS3DObject` wraps an `<iframe>` that loads the inner-site React app. Both `WebGLRenderer` (for the Blender geometry) and `CSS3DRenderer` (for the iframe) share the same `PerspectiveCamera`, so when the camera moves, both renderers update in sync — the iframe stays locked to the monitor mesh. Because it's a real DOM element (not a texture), it's fully interactive: clicks, scrolls, and focus all work normally.

### Q2: The inner-site and the 3D scene are on different origins. How do they communicate?

**Answer:** Via the `window.postMessage` API. Because `3d-site/` and `inner-site/` run on different ports (different origins), they can't share memory or call each other's functions directly. `postMessage` lets one window send serialized messages to another across origin boundaries. The sender calls `targetWindow.postMessage(data, targetOrigin)` and the receiver listens with `window.addEventListener("message", handler)`. In this codebase, the inner OS uses this to signal the parent 3D scene — for example, to trigger a camera animation when the user navigates to a specific app.

### Q3: Why are there two Vite dev servers, and what would break if you merged them into one?

**Answer:** The two servers exist because `3d-site/` runs a pure Three.js TypeScript app while `inner-site/` runs a React app — they have different entry points, different dependency trees (Three.js vs. React), and different build outputs. The `CSS3DRenderer` loads `inner-site/` as a URL inside an `<iframe>`, which requires it to be served as a real HTTP origin. If you merged them into one Vite project, you'd need to either (a) serve the inner OS as a sub-path and load it into the iframe by path, or (b) inline the entire React app as a `data:` URI — both approaches add complexity. The two-server architecture keeps the separation clean and mirrors how the production deployment would work (two separate static sites).
