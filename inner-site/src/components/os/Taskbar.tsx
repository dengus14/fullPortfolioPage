import { useState, useEffect } from "react";
import { T } from "../../styles/tokens";
import { playClick } from "../../utils/sound";
import type { AppWindow } from "./Desktop";

interface AppDef { id: string; title: string; icon: string; }
interface Props {
  windows: AppWindow[];
  appDefs: AppDef[];
  onAppClick: (id: string) => void;
  onWindowClick: (id: string) => void;
}

export default function Taskbar({ windows, appDefs, onAppClick, onWindowClick }: Props) {
  const [time, setTime] = useState(getTime());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Start menu */}
      {startOpen && (
        <div
          onMouseLeave={() => setStartOpen(false)}
          style={{
            position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
            width: 380, padding: 16, zIndex: 9999,
            background: T.glassStrong,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: `1px solid ${T.border}`,
            borderRadius: T.radius + 2,
            boxShadow: "0 16px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ fontSize: T.xs, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Applications
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {appDefs.map((app) => (
              <button
                key={app.id}
                onClick={() => { playClick(); onAppClick(app.id); setStartOpen(false); }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 8px", background: T.glassDim,
                  border: `1px solid ${T.borderSub}`, borderRadius: T.radiusSm,
                  color: T.text, cursor: "pointer", transition: "background 0.15s",
                  fontSize: T.sm,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.glass)}
                onMouseLeave={(e) => (e.currentTarget.style.background = T.glassDim)}
              >
                <span style={{ fontSize: 20, color: T.accent }}>{app.icon}</span>
                <span style={{ fontSize: T.xs, fontWeight: 500 }}>{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Taskbar bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 44,
        background: T.glassStrong,
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", padding: "0 10px", gap: 3, zIndex: 9000,
        boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
      }}>
        {/* Start button */}
        <button
          onClick={() => { playClick(); setStartOpen((s) => !s); }}
          style={{
            width: 32, height: 30, borderRadius: T.radiusSm,
            background: startOpen ? T.accentBg : "transparent",
            border: `1px solid ${startOpen ? T.accentBorder : "transparent"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, cursor: "pointer", transition: "all 0.15s", color: T.accent, marginRight: 4,
          }}
          onMouseEnter={(e) => { if (!startOpen) e.currentTarget.style.background = T.glassDim; }}
          onMouseLeave={(e) => { if (!startOpen) e.currentTarget.style.background = "transparent"; }}
        >
          ⊞
        </button>

        {/* Pinned apps */}
        {appDefs.map((app) => {
          const openWin = windows.find((w) => w.id === app.id);
          const isOpen = !!openWin;
          const isActive = isOpen && !openWin?.minimized;
          return (
            <TaskbarBtn key={app.id} icon={app.icon} label={app.title}
              isOpen={isOpen} isActive={isActive}
              onClick={() => { playClick(); isOpen ? onWindowClick(app.id) : onAppClick(app.id); }}
            />
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Clock */}
        <div style={{ fontSize: T.xs, color: T.textSub, textAlign: "right", lineHeight: 1.4, padding: "0 6px", whiteSpace: "pre" }}>
          {time}
        </div>
      </div>
    </>
  );
}

function TaskbarBtn({ icon, label, isOpen, isActive, onClick }: {
  icon: string; label: string; isOpen: boolean; isActive: boolean; onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={label}
        style={{
          width: 36, height: 32, borderRadius: T.radiusSm,
          background: isActive ? T.accentBg : hover ? T.glassDim : "transparent",
          border: `1px solid ${isActive ? T.accentBorder : hover ? T.borderSub : "transparent"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, cursor: "pointer", transition: "all 0.15s", color: T.accent,
        }}
      >
        {icon}
      </button>
      {isOpen && (
        <div style={{
          position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)",
          width: isActive ? 16 : 4, height: 2, borderRadius: 2,
          background: T.accent, transition: "width 0.2s",
        }} />
      )}
    </div>
  );
}

function getTime() {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}\n${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
}
