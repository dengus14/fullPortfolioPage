# 3D Portfolio

An interactive portfolio with two modes — a traditional web version and a 
3D environment built with Three.js. The 3D scene loads a custom Blender-modeled 
gaming desk and composites a live React app directly onto the monitor screen 
inside the scene.


---

## Tech Stack

- Three.js, TypeScript, Vite
- CSS3DRenderer (Three.js)
- React, Vite (inner OS app)
- Blender (3D scene modeling)
- WebGL

---

## Features

- Landing page with animated glassmorphism card — choose between 3D or classic experience
- 3D desk scene rendered in WebGL with PBR materials and environment lighting
- CSS3DRenderer composited on top of WebGL — a live iframe sits exactly on the monitor mesh
- Transparent raycaster hitbox on the monitor for click detection without blocking the iframe
- Smooth camera lerp transitions between idle view and monitor close-up
- Mouse parallax drift on the idle camera
- MacBook screen displays a canvas-painted VS Code editor with syntax-highlighted code
- Inner site is a full fake OS — draggable windows, animated taskbar, working apps
- CSS3D rendering skipped when monitor faces away from camera (performance optimization)
- Resize debouncing and delta-time independent lerp for consistent feel across frame rates

---

## How It Works

The project is split into two Vite apps that run in parallel.

`3d-site` handles the Three.js scene. It loads a `.glb` file exported from Blender, 
hides the monitor screen mesh, and places a CSS3DObject (an iframe) at exactly the 
same position and rotation in world space. The CSS3DRenderer draws the iframe on top 
of the WebGL canvas at the correct perspective, making it look like the content is 
actually on the screen.

`inner-site` is a React app that runs inside that iframe. It's a fake desktop OS 
with a glassmorphism UI, draggable windows, a taskbar with a clock, and four apps — 
Portfolio, Projects, About, and Contact.

The two renderers (WebGL and CSS3D) share the same camera, so perspective always 
matches. The CSS3D pass is skipped entirely when the monitor isn't facing the camera 
to avoid unnecessary DOM compositing.

---

## What I Learned

- How CSS3DRenderer works under the hood and why z-fighting between WebGL and CSS 
  layers happens — and how to fix it with a transparent hitbox mesh
- Delta-time independent lerp using `1 - Math.pow(damping, delta / frameTime)` so 
  camera speed is consistent regardless of frame rate
- PMREMGenerator for environment maps — needed for PBR materials to reflect correctly
- Why anisotropic filtering matters for the MacBook screen texture at oblique angles
- iframe pointer events have to be disabled until the camera finishes zooming in, 
  otherwise the iframe swallows the click before the raycaster sees it

---

## Running Locally

You need both apps running at the same time.
```bash
# Terminal 1 — 3D scene
cd 3d-site
npm install
npm run dev
# runs on http://localhost:5173

# Terminal 2 — inner OS app
cd inner-site
npm install
npm run dev
# runs on http://localhost:5174
```

Open `http://localhost:5173`, choose 3D Experience, and click the monitor.

---

## Project Structure
```
3d-site/
  src/
    Application/
      Application.ts      # main loop, raycasting, monitor visibility
      Camera/Camera.ts    # keyframe transitions, parallax, lerp
      Renderer.ts         # WebGL + CSS3D dual renderer
      World/
        World.ts          # scene setup, lighting, GLB loader
        MonitorScreen.ts  # CSS3DObject + hitbox mesh
        MacbookScreen.ts  # canvas-painted VS Code texture
      Utils/              # Sizes, Time, Mouse

inner-site/
  src/
    components/
      os/                 # Desktop, Window, Taskbar
      apps/               # Portfolio, Projects, About, Contact
```