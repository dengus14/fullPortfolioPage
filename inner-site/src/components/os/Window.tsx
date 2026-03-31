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

const MENUBAR_H = 24;
const DOCK_H    = 72;

export default function Window({ win, onClose, onMinimize, onFocus, onMove, onResize }: Props) {
  const dragRef   = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [tlHover, setTlHover] = useState(false);

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
    onFocus();
    const onMouseMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      onMove(
        dragRef.current.winX + me.clientX - dragRef.current.startX,
        dragRef.current.winY + me.clientY - dragRef.current.startY,
      );
    };
    const onMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [win.x, win.y, maximized, onFocus, onMove]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height };
    const onMouseMove = (me: MouseEvent) => {
      if (!resizeRef.current) return;
      onResize(
        Math.max(320, resizeRef.current.winW + me.clientX - resizeRef.current.startX),
        Math.max(220, resizeRef.current.winH + me.clientY - resizeRef.current.startY),
      );
    };
    const onMouseUp = () => {
      resizeRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [win.width, win.height, onResize]);

  if (win.minimized) return null;

  const posStyle: React.CSSProperties = maximized
    ? {
        position: "absolute",
        left: 0, top: MENUBAR_H,
        width: "100%",
        height: `calc(100% - ${MENUBAR_H}px - ${DOCK_H}px)`,
        zIndex: win.zIndex,
      }
    : {
        position: "absolute",
        left: win.x, top: win.y,
        width: win.width, height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      onMouseDown={onFocus}
      style={{
        ...posStyle,
        display: "flex", flexDirection: "column",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.18)",
        borderRadius: maximized ? 0 : T.radius,
        boxShadow: maximized ? "none" : T.shadow,
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => setMaximized((m) => !m)}
        style={{
          height: 28, flexShrink: 0, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(236,236,236,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          userSelect: "none", cursor: "default",
        }}
      >
        {/* Traffic lights — always colored, symbols on group hover */}
        <div
          onMouseEnter={() => setTlHover(true)}
          onMouseLeave={() => setTlHover(false)}
          style={{
            position: "absolute", left: 12, top: "50%",
            transform: "translateY(-50%)",
            display: "flex", gap: 8, zIndex: 1,
          }}
        >
          <TrafficLight color={T.trafficRed}    symbol="×" showSymbol={tlHover} onClick={() => { playClick(); onClose(); }} />
          <TrafficLight color={T.trafficYellow} symbol="−" showSymbol={tlHover} onClick={() => { playClick(); onMinimize(); }} />
          <TrafficLight color={T.trafficGreen}  symbol="+" showSymbol={tlHover} onClick={() => { playClick(); setMaximized((m) => !m); }} />
        </div>

        {/* Centered title */}
        <span style={{
          fontSize: 13, fontWeight: 500,
          color: "#3a3a3c",
          letterSpacing: "-0.01em",
          pointerEvents: "none",
          maxWidth: "55%",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {win.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", background: "#ffffff", position: "relative" }}>
        {win.component}
      </div>

      {/* Resize grip */}
      {!maximized && (
        <div
          onMouseDown={onResizeMouseDown}
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: 16, height: 16, cursor: "se-resize", zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

function TrafficLight({
  color, symbol, showSymbol, onClick,
}: {
  color: string; symbol: string; showSymbol: boolean; onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 12, height: 12, borderRadius: "50%",
        background: color,
        border: "none", cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 8, fontWeight: 900, lineHeight: 1,
        color: "rgba(0,0,0,0.5)",
        transition: "opacity 0.1s",
        opacity: hover ? 0.82 : 1,
      }}
    >
      {(showSymbol || hover) ? symbol : null}
    </button>
  );
}
