import { useState, useEffect } from "react";

interface Props {
  activeTitle?: string;
}

export default function MenuBar({ activeTitle = "Finder" }: Props) {
  const [time, setTime] = useState(getDateTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getDateTime()), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 24,
      display: "flex", alignItems: "center",
      background: "rgba(236,236,236,0.82)",
      backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      zIndex: 9999,
      userSelect: "none",
      fontSize: 13,
      color: "#1d1d1f",
      padding: "0 12px",
    }}>
      {/* Left: Apple logo + active app + menu items */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        {/* Apple logo */}
        <svg width="13" height="16" viewBox="0 0 814 1000" fill="#1d1d1f" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.1-317.3 66.9 0 122.6 44.4 164.7 44.4 40.3 0 103.4-47.2 175.9-47.2 30.1 0 88.2 3.9 150.2 47.7zm-120.9-120.2c-33.8 40.3-86.1 71.3-138.2 71.3-6.5 0-13-.6-19.5-1.9-1.3-7.8-1.9-15.6-1.9-22.8 0-40.3 17.6-83.2 50.1-113.9 32.4-30.7 82.9-56.9 130.3-56.9 1.3 6.5 1.9 13 1.9 20.1 0 39-17.6 81.5-49.9 112.1" />
        </svg>

        <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}>{activeTitle}</span>

        {["File", "Edit", "View", "Window", "Help"].map((item) => (
          <MenuBarItem key={item} label={item} />
        ))}
      </div>

      {/* Right: wifi + battery + time */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {/* Wifi */}
        <svg width="16" height="13" viewBox="0 0 20 16" fill="none" style={{ marginTop: 1 }}>
          <path d="M10 15L0.5 6.5C3.2 3.8 6.9 2 11 2s7.8 1.8 10.5 4.5L10 15z" fill="#1d1d1f" fillOpacity="0.25" />
          <path d="M10 15L3 8.5C5 6.5 7.3 5.2 10 5.2s5 1.3 7 3.3L10 15z" fill="#1d1d1f" fillOpacity="0.55" />
          <path d="M10 15L6.5 11.5C7.5 10.3 8.7 9.5 10 9.5s2.5.8 3.5 2L10 15z" fill="#1d1d1f" />
          <circle cx="10" cy="14.5" r="1.3" fill="#1d1d1f" />
        </svg>

        {/* Battery */}
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#1d1d1f" strokeOpacity="0.35" />
          <rect x="1.5" y="1.5" width="14" height="9" rx="1.5" fill="#1d1d1f" fillOpacity="0.8" />
          <path d="M21.5 4v4c.9-.5 1.5-1.3 1.5-2s-.6-1.5-1.5-2z" fill="#1d1d1f" fillOpacity="0.35" />
        </svg>

        <span style={{ fontSize: 12, fontWeight: 400, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{time}</span>
      </div>
    </div>
  );
}

function MenuBarItem({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "1px 7px", borderRadius: 4, fontSize: 13,
        background: hover ? "rgba(0,0,0,0.08)" : "transparent",
        cursor: "default", transition: "background 0.1s",
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </span>
  );
}

function getDateTime() {
  const d = new Date();
  const dow = d.toLocaleString("en", { weekday: "short" });
  const mon = d.toLocaleString("en", { month: "short" });
  const day = d.getDate();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${dow} ${mon} ${day}  ${h}:${m} ${ampm}`;
}
