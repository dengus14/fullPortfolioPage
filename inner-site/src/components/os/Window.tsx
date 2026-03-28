import { useRef, useCallback, useState } from "react";
import { T } from "../../styles/tokens";
import { playClick } from "../../utils/sound";
import type { AppWindow } from "./Desktop";

interface Props {
  win: AppWindow;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

export default function Window({ win, onClose, onMinimize, onFocus, onMove, onResize }: Props) {
  const dragRef   = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null);
  const [maximized, setMaximized] = useState(false);

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
    onFocus();
    const onMouseMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      onMove(dragRef.current.winX + me.clientX - dragRef.current.startX, dragRef.current.winY + me.clientY - dragRef.current.startY);
    };
    const onMouseUp = () => { dragRef.current = null; window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [win.x, win.y, maximized, onFocus, onMove]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height };
    const onMouseMove = (me: MouseEvent) => {
      if (!resizeRef.current) return;
      onResize(Math.max(320, resizeRef.current.winW + me.clientX - resizeRef.current.startX), Math.max(220, resizeRef.current.winH + me.clientY - resizeRef.current.startY));
    };
    const onMouseUp = () => { resizeRef.current = null; window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [win.width, win.height, onResize]);

  if (win.minimized) return null;

  const posStyle: React.CSSProperties = maximized
    ? { position: "absolute", left: 0, top: 0, width: "100%", height: "calc(100% - 44px)", zIndex: win.zIndex }
    : { position: "absolute", left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      onMouseDown={onFocus}
      style={{
        ...posStyle,
        display: "flex", flexDirection: "column",
        background: T.glass,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${T.border}`,
        borderRadius: maximized ? 0 : T.radius + 2,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => setMaximized((m) => !m)}
        style={{
          height: 34, display: "flex", alignItems: "center", padding: "0 10px",
          background: T.glassStrong,
          borderBottom: `1px solid ${T.borderSub}`,
          userSelect: "none", cursor: "default", flexShrink: 0, gap: 8,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <WinBtn onClick={() => { playClick(); onClose(); }}    color="#ff5f57" />
          <WinBtn onClick={() => { playClick(); onMinimize(); }} color="#febc2e" />
          <WinBtn onClick={() => { playClick(); setMaximized((m) => !m); }} color="#28c840" />
        </div>

        <span style={{ fontSize: T.xs, color: T.accent, flexShrink: 0 }}>{win.icon}</span>
        <span style={{ flex: 1, fontSize: T.sm, color: T.text, fontWeight: 500, letterSpacing: "0.01em" }}>
          {win.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {win.component}
      </div>

      {/* Resize handle */}
      {!maximized && (
        <div
          onMouseDown={onResizeMouseDown}
          style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, cursor: "se-resize", zIndex: 10 }}
        />
      )}
    </div>
  );
}

function WinBtn({ onClick, color }: { onClick: () => void; color: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 12, height: 12, borderRadius: "50%",
        background: hover ? color : "rgba(0,0,0,0.15)",
        border: "none", cursor: "pointer", flexShrink: 0,
        transition: "background 0.15s",
      }}
    />
  );
}
