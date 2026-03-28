import { useState, useCallback } from "react";
import { T } from "../../styles/tokens";
import { playClick } from "../../utils/sound";
import Taskbar from "./Taskbar";
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
  { id: "portfolio", title: "Portfolio",  icon: "◈", component: <Portfolio />, defaultWidth: 680, defaultHeight: 520 },
  { id: "projects",  title: "Projects",   icon: "⬡", component: <Projects />,  defaultWidth: 640, defaultHeight: 480 },
  { id: "about",     title: "About",      icon: "◉", component: <About />,     defaultWidth: 540, defaultHeight: 440 },
  { id: "contact",   title: "Contact",    icon: "◎", component: <Contact />,   defaultWidth: 480, defaultHeight: 400 },
];

let zCounter = 10;

export default function Desktop() {
  const [windows, setWindows] = useState<AppWindow[]>([]);

  const openApp = useCallback((appId: string) => {
    playClick();
    const def = APP_DEFS.find((a) => a.id === appId);
    if (!def) return;
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      if (existing) {
        return prev.map((w) => w.id === appId ? { ...w, minimized: false, zIndex: ++zCounter } : w);
      }
      const offset = prev.length * 28;
      return [...prev, {
        id: def.id, title: def.title, icon: def.icon, component: def.component,
        x: 72 + offset, y: 36 + offset,
        width: def.defaultWidth, height: def.defaultHeight,
        minimized: false, zIndex: ++zCounter,
      }];
    });
  }, []);

  const closeWindow    = useCallback((id: string) => setWindows((p) => p.filter((w) => w.id !== id)), []);
  const minimizeWindow = useCallback((id: string) => setWindows((p) => p.map((w) => w.id === id ? { ...w, minimized: true } : w)), []);
  const focusWindow    = useCallback((id: string) => setWindows((p) => p.map((w) => w.id === id ? { ...w, zIndex: ++zCounter } : w)), []);
  const moveWindow     = useCallback((id: string, x: number, y: number) => setWindows((p) => p.map((w) => w.id === id ? { ...w, x, y } : w)), []);
  const resizeWindow   = useCallback((id: string, width: number, height: number) => setWindows((p) => p.map((w) => w.id === id ? { ...w, width, height } : w)), []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-40px) scale(1.1)} 70%{transform:translate(-20px,30px) scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-60px,20px) scale(1.08)} 66%{transform:translate(30px,-30px) scale(0.93)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,50px) scale(1.06)} }
        @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1)} 45%{transform:translate(-30px,-50px) scale(1.12)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}</style>

      {/* Wallpaper */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(145deg, #e8eaf6 0%, #f3e8ff 35%, #e0f2fe 70%, #fce7f3 100%)",
        zIndex: 0, isolation: "isolate",
      }} />

      {/* Blobs */}
      {([
        { top: "8%",  left: "15%", size: 320, color: "rgba(147,112,219,0.18)", dur: "13s", delay: "0s"   },
        { top: "55%", left: "60%", size: 280, color: "rgba(99,179,237,0.18)",  dur: "16s", delay: "-5s"  },
        { top: "65%", left: "8%",  size: 240, color: "rgba(236,72,153,0.12)",  dur: "11s", delay: "-8s"  },
        { top: "15%", left: "72%", size: 200, color: "rgba(52,211,153,0.14)",  dur: "14s", delay: "-3s"  },
      ] as const).map((b, i) => (
        <div key={i} style={{
          position: "absolute", top: b.top, left: b.left,
          width: b.size, height: b.size, borderRadius: "50%",
          background: b.color, filter: "blur(40px)",
          animation: `blob${i + 1} ${b.dur} ease-in-out ${b.delay} infinite`,
          zIndex: 0, pointerEvents: "none",
          willChange: "transform",
          transform: "translateZ(0)",
        }} />
      ))}

      {/* Desktop icons */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        display: "flex", flexDirection: "column", gap: 6, zIndex: 1,
      }}>
        {APP_DEFS.map((app) => (
          <DesktopIcon key={app.id} icon={app.icon} label={app.title} onClick={() => openApp(app.id)} />
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} win={win}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onMove={(x, y) => moveWindow(win.id, x, y)}
          onResize={(w, h) => resizeWindow(win.id, w, h)}
        />
      ))}

      {/* Taskbar */}
      <Taskbar
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

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onDoubleClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "8px 10px", width: 68, cursor: "default",
        background: hover ? T.glassStrong : T.glassDim,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${hover ? T.border : "rgba(255,255,255,0.45)"}`,
        borderRadius: T.radius,
        boxShadow: hover ? T.shadow : T.shadowSm,
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: 22, color: T.accent, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: T.xs, color: T.text, fontWeight: 500, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}
