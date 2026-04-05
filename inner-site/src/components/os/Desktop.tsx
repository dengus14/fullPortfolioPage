import { useState, useCallback } from "react";
import { playClick } from "../../utils/sound";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Window from "./Window";
import Portfolio from "../apps/Portfolio";
import Projects from "../apps/Projects";
import About from "../apps/About";
import Contact from "../apps/Contact";

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}

const APP_DEFS = [
  { id: "portfolio", title: "Portfolio", icon: "◈", component: <Portfolio />, defaultWidth: 680, defaultHeight: 520 },
  { id: "projects",  title: "Projects",  icon: "⬡", component: <Projects />,  defaultWidth: 640, defaultHeight: 480 },
  { id: "about",     title: "About",     icon: "◉", component: <About />,     defaultWidth: 540, defaultHeight: 440 },
  { id: "contact",   title: "Contact",   icon: "◎", component: <Contact />,   defaultWidth: 480, defaultHeight: 400 },
];

let zCounter = 10;
const MENUBAR_H = 24;

export default function Desktop() {
  const [windows, setWindows] = useState<AppWindow[]>([]);

  const activeTitle = windows
    .filter((w) => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.title ?? "Finder";

  const openApp = useCallback((appId: string) => {
    playClick();
    const def = APP_DEFS.find((a) => a.id === appId);
    if (!def) return;
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      if (existing) {
        return prev.map((w) => w.id === appId ? { ...w, minimized: false, zIndex: ++zCounter } : w);
      }
      const offset = prev.length * 24;
      return [...prev, {
        id: def.id, title: def.title, icon: def.icon, component: def.component,
        x: 80 + offset, y: MENUBAR_H + 8 + offset,
        width: def.defaultWidth, height: def.defaultHeight,
        minimized: false, zIndex: ++zCounter,
      }];
    });
  }, []);

  const closeWindow    = useCallback((id: string) => setWindows((p) => p.filter((w) => w.id !== id)), []);
  const minimizeWindow = useCallback((id: string) => setWindows((p) => p.map((w) => w.id === id ? { ...w, minimized: true } : w)), []);
  const focusWindow    = useCallback((id: string) => setWindows((p) => p.map((w) => w.id === id ? { ...w, zIndex: ++zCounter } : w)), []);
  const moveWindow     = useCallback((id: string, x: number, y: number) => setWindows((p) => p.map((w) => w.id === id ? { ...w, x, y } : w)), []);
  const resizeWindow   = useCallback((id: string, w: number, h: number) => setWindows((p) => p.map((win) => win.id === id ? { ...win, width: w, height: h } : win)), []);

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden",
      fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0)scale(1)} 40%{transform:translate(60px,-50px)scale(1.1)} 70%{transform:translate(-20px,30px)scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(-70px,30px)scale(1.08)} 66%{transform:translate(40px,-40px)scale(0.93)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(50px,60px)scale(1.06)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {/* Wallpaper — unified dark indigo */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(145deg, #050506 0%, #09091a 30%, #0f1028 60%, #0a0a18 100%)",
      }} />

      {/* Animated ambient blobs */}
      {([
        { top: "8%",  left: "8%",  size: 380, color: "rgba(94,106,210,0.10)",  dur: "14s", delay: "0s",  n: 1 },
        { top: "48%", left: "52%", size: 320, color: "rgba(94,106,210,0.08)",  dur: "17s", delay: "-6s", n: 2 },
        { top: "68%", left: "4%",  size: 260, color: "rgba(139,151,232,0.07)", dur: "12s", delay: "-9s", n: 3 },
      ] as const).map((b) => (
        <div key={b.n} style={{
          position: "absolute", top: b.top, left: b.left,
          width: b.size, height: b.size, borderRadius: "50%",
          background: b.color, filter: "blur(55px)",
          animation: `blob${b.n} ${b.dur} ease-in-out ${b.delay} infinite`,
          zIndex: 0, pointerEvents: "none", willChange: "transform",
        }} />
      ))}

      {/* Menu bar */}
      <MenuBar activeTitle={activeTitle} />

      {/* Windows */}
      {windows.map((win) => (
        <Window
          key={win.id} win={win}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onMove={(x, y) => moveWindow(win.id, x, y)}
          onResize={(w, h) => resizeWindow(win.id, w, h)}
        />
      ))}

      {/* Dock */}
      <Dock
        windows={windows}
        appDefs={APP_DEFS}
        onAppClick={openApp}
        onWindowClick={(id) => {
          const win = windows.find((w) => w.id === id);
          if (!win) return;
          if (win.minimized) {
            setWindows((p) => p.map((w) => w.id === id ? { ...w, minimized: false, zIndex: ++zCounter } : w));
          } else {
            focusWindow(id);
          }
        }}
      />
    </div>
  );
}
