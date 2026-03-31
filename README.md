# Portfolio

An interactive 3D portfolio built with Three.js, featuring a macOS-style desktop experience embedded on a virtual monitor screen.

## Overview

The project is split into two apps:

- **3d-site** — Three.js scene with a 3D room and a Macbook/monitor. The inner site is rendered as a live texture on the screen.
- **inner-site** — A React app styled as a macOS desktop with a Dock, window manager, and portfolio apps (About, Projects, Contact).

## Tech Stack

- [Three.js](https://threejs.org/) + TypeScript
- React + Vite
- CSS-in-JS (inline styles with design tokens)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

**3D scene:**

```bash
cd 3d-site
npm install
npm run dev
```

**Inner site (macOS desktop):**

```bash
cd inner-site
npm install
npm run dev
```

Both dev servers need to run simultaneously. The 3d-site renders the inner-site URL as a texture on the virtual screen.

## Project Structure

```
├── 3d-site/        # Three.js 3D scene
├── inner-site/     # React macOS-style desktop UI
└── docs/           # Additional documentation
```

## Author

Denis Gusev — Software Engineer · Milwaukee, WI
