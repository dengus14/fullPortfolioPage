import React from "react";
import { playClick } from "../../utils/sound";
import type { AppWindow } from "./Desktop";

interface AppDef { id: string; title: string; }
interface Props {
  windows: AppWindow[];
  appDefs: AppDef[];
  onAppClick: (id: string) => void;
  onWindowClick: (id: string) => void;
}

const ICON_CONFIGS: Record<string, { gradient: string; icon: React.ReactNode }> = {
  portfolio: {
    gradient: "linear-gradient(145deg, #0A84FF 0%, #34AADC 100%)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="14" rx="2.5" fill="white" fillOpacity="0.92" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="11" x2="12" y2="16" stroke="rgba(0,90,190,0.55)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" stroke="rgba(0,90,190,0.55)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  projects: {
    gradient: "linear-gradient(145deg, #BF5AF2 0%, #5E5CE6 100%)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M7.5 6L3 12l4.5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 6L21 12l-4.5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 4l-4 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
      </svg>
    ),
  },
  about: {
    gradient: "linear-gradient(145deg, #32D74B 0%, #25A244 100%)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" fill="white" fillOpacity="0.92" />
        <path d="M4.5 20.5c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  contact: {
    gradient: "linear-gradient(145deg, #FF9F0A 0%, #FF6B00 100%)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2.5" fill="white" fillOpacity="0.92" />
        <path d="M2 8l9.5 6.5a1 1 0 0 0 1 0L22 8" stroke="rgba(180,60,0,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

const ICON_SIZE = 54;

export default function Dock({ windows, appDefs, onAppClick, onWindowClick }: Props) {
  return (
    <div style={{
      position: "fixed", bottom: 8, left: "50%", transform: "translateX(-50%)",
      zIndex: 9000,
    }}>
      {/*
        Glass container — backdrop-filter is isolated on its own absolutely-positioned
        layer inside an overflow:hidden wrapper. This prevents the blur from bleeding
        past the border-radius and causing corner square artifacts.
      */}
      <div style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}>
        {/* Blur + tint layer — extends -1px past edges so corners fill flush under the parent clip */}
        <div style={{
          position: "absolute",
          inset: -1,
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          background: "rgba(14,14,22,0.55)",
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "8px 12px 6px",
        }}>
          {appDefs.map((app) => {
            const win = windows.find((w) => w.id === app.id);
            const isOpen = !!win;
            const isActive = isOpen && !win?.minimized;
            const cfg = ICON_CONFIGS[app.id];

            return (
              <div
                key={app.id}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  position: "relative",
                  width: ICON_SIZE,
                }}
              >
                {/* App icon */}
                <button
                  onClick={() => {
                    playClick();
                    isOpen ? onWindowClick(app.id) : onAppClick(app.id);
                  }}
                  style={{
                    width: ICON_SIZE, height: ICON_SIZE,
                    borderRadius: "22%",
                    background: cfg?.gradient ?? "linear-gradient(145deg, #8e8e93, #636366)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "none", cursor: "pointer",
                    boxShadow: "0 2px 14px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.25)",
                    flexShrink: 0,
                    outline: "none",
                  }}
                >
                  {cfg?.icon}
                </button>

                {/* Open indicator dot — opacity-based to avoid 0×0 pixel artifacts */}
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                  marginTop: 4,
                  opacity: isOpen ? 1 : 0,
                  transition: "opacity 0.2s ease",
                  flexShrink: 0,
                }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
