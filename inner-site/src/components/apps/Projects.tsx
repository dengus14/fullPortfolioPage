import { useState } from "react";
import { T } from "../../styles/tokens";

const PROJECTS = [
  { id: "1", title: "3D Portfolio",  tags: ["Three.js", "TypeScript", "Blender"], desc: "This very site — an interactive 3D portfolio built with Three.js and a custom Blender scene rendered in WebGL.", link: "#" },
  { id: "2", title: "Project Two",   tags: ["React", "Node.js"],                  desc: "Brief description of what this project does and what problems it solves.", link: "#" },
  { id: "3", title: "Project Three", tags: ["Python", "ML"],                      desc: "Another project description goes here.", link: "#" },
];

export default function Projects() {
  const [selected, setSelected] = useState<string | null>(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === selected);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar list */}
      <div style={{
        width: 188, flexShrink: 0, overflowY: "auto",
        borderRight: `1px solid ${T.borderSub}`,
        background: "rgba(255,255,255,0.3)",
      }}>
        {PROJECTS.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 14px", background: active ? T.accentBg : "transparent",
                border: "none", borderBottom: `1px solid ${T.borderSub}`,
                borderLeft: `2px solid ${active ? T.accent : "transparent"}`,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.4)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontSize: T.sm, fontWeight: 600, color: active ? T.accent : T.text }}>{p.title}</div>
              <div style={{ fontSize: T.xs, color: T.textMuted, marginTop: 2 }}>{p.tags.join(" · ")}</div>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div style={{ flex: 1, padding: "18px 20px", overflowY: "auto" }}>
        {project ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: T.xl, fontWeight: 600, color: T.text }}>{project.title}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
                {project.tags.map((t) => (
                  <span key={t} style={{
                    padding: "3px 10px", borderRadius: 20,
                    background: T.accentBg, border: `1px solid ${T.accentBorder}`,
                    fontSize: T.xs, color: T.accent, fontWeight: 500,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: T.borderSub }} />

            <p style={{ fontSize: T.md, color: T.text, lineHeight: 1.7, margin: 0 }}>{project.desc}</p>

            {project.link !== "#" && (
              <a href={project.link} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: T.radiusSm,
                background: T.accent, color: "#fff",
                fontSize: T.sm, fontWeight: 500, width: "fit-content",
                textDecoration: "none", boxShadow: T.shadowSm,
              }}>
                View Project ↗
              </a>
            )}
          </div>
        ) : (
          <div style={{ fontSize: T.sm, color: T.textMuted, marginTop: 20 }}>Select a project</div>
        )}
      </div>
    </div>
  );
}
