# 3D Portfolio

An interactive portfolio with two modes — a traditional web version and a 3D 
environment built with Three.js. The 3D scene loads a custom Blender-modeled 
gaming desk and composites a live React app directly onto the monitor screen 
inside the scene.


&nbsp;

## Tech Stack

Three.js · TypeScript · Vite · CSS3DRenderer · React · Blender · WebGL

&nbsp;

## How It Works

The project is two Vite apps running in parallel. The 3D site loads a `.glb` 
exported from Blender, hides the monitor mesh, and places a CSS3DObject (an iframe) 
at exactly the same position and rotation in world space. CSS3DRenderer draws it on 
top of the WebGL canvas at the correct perspective, so it actually looks like content 
running on the screen.

The inner site is a React app living inside that iframe — a fake desktop OS with 
glassmorphism windows, a taskbar, and four apps: Portfolio, Projects, About, Contact. 
Both renderers share the same camera so perspective always matches. The CSS3D pass 
gets skipped entirely when the monitor isn't facing the camera.

&nbsp;

## Features

- Landing page with animated glassmorphism card — choose 3D or classic experience
- PBR materials with PMREMGenerator environment map for realistic reflections  
- Transparent raycaster hitbox on the monitor for click detection
- Smooth camera lerp transitions between idle and monitor close-up
- Mouse parallax on the idle camera
- MacBook screen renders a canvas-painted VS Code editor with real syntax highlighting
- Iframe pointer events disabled until camera finishes zooming in
- Resize debouncing and delta-time independent lerp

&nbsp;

## Running Locally

Two terminals, both need to be running at the same time.
```bash
# 3D scene — http://localhost:5173
cd 3d-site
npm install
npm run dev

# Inner OS app — http://localhost:5174
cd inner-site
npm install
npm run dev
```

Open `localhost:5173`, pick 3D Experience, click the monitor.

&nbsp;

## What I Learned

Getting the two renderers to composite correctly was the hardest part. The iframe 
has to be invisible until the camera is close enough, otherwise it intercepts clicks 
before the raycaster does. Camera lerp speed needs to be tied to delta time or it 
feels different at different frame rates. Anisotropic filtering made a real difference 
on the MacBook texture when viewed at an angle.