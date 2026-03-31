import { useState } from "react";
import { T } from "../../styles/tokens";

const PROJECTS = [
  {
    id: "1",
    title: "IoT Fleet Management System",
    tags: ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Microservices"],
    desc: "A real-time fleet tracking system built to learn distributed systems properly. Four Spring Boot microservices (device, route, telemetry, simulator) communicate asynchronously over Kafka. Vehicles are created, assigned routes across a graph of Midwest cities, and travel between nodes in real time consuming fuel based on vehicle type. Dijkstra's algorithm in the route service calculates shortest paths. A Java CLI simulator drives vehicles along graph edges tick by tick. Coordinating four services over async messaging — and debugging the edge cases that come with it — was the real education here.",
    link: "#",
  },
  {
    id: "2",
    title: "3D Portfolio Website",
    tags: ["Three.js", "React", "TypeScript", "Blender", "CSS3DRenderer"],
    desc: "This site. Two entry modes: a traditional web portfolio and a 3D interactive scene built in Three.js around a Blender-modeled gaming desk. The 3D mode uses CSS3DRenderer to composite a live iframe directly onto the monitor mesh, so clicking the monitor opens a fully functional fake OS desktop — draggable windows, taskbar, animated icons — running inside the 3D scene. The inner OS is a separate React app on its own Vite dev server. Getting WebGL and CSS rendering to composite without z-fighting was a genuine rabbit hole.",
    link: "#",
  },
  {
    id: "3",
    title: "Scan-To-Access",
    tags: ["Node.js", "React Native", "Tesseract.js", "Google Cloud Vision", "JWT", "PostgreSQL"],
    desc: "Senior capstone project (CompSci 595), team of 4 — I led backend development. A mobile app where users photograph handwritten notes and have text extracted via OCR (Tesseract.js with Google Cloud Vision fallback). Notes are protected by a 6-character access code printed on physical paper; scanning the document auto-extracts and verifies the code to unlock the note. Also includes flashcard study mode, JWT auth, and full profile management. First time leading a real team's backend architecture.",
    link: "#",
  },
  {
    id: "4",
    title: "Web Crawler & Site Auditor",
    tags: ["Java", "Spring Boot", "React", "Vite", "PostgreSQL"],
    desc: "Give it a URL and it BFS-crawls the entire site across multiple threads, then generates an audit report. The report breaks down broken links by HTTP status code, SEO issues (missing H1s, titles over 60 characters), the slowest pages using a min-heap to surface the top 10% by response time, and near-duplicate pages detected with SimHash. Backend in Java/Spring Boot, frontend in React/Vite, deployed with PostgreSQL. Debugging CORS between the two in production was a thorough education in how browsers actually work.",
    link: "#",
  },
  {
    id: "5",
    title: "MindBody Fitness Tracker",
    tags: ["Java 21", "Spring Boot", "JWT", "PostgreSQL", "Docker"],
    desc: "Full-stack fitness tracking application. Users log workouts, track progress over time, and view metrics. Built with a Java 21 / Spring Boot backend, PostgreSQL for persistence, JWT for stateless auth, and Docker for consistent local and production environments.",
    link: "#",
  },
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
                  <div key={t} style={{
                    position: "relative",
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: `0 0 0 1px ${T.accentBorder}`,
                    fontSize: T.xs, color: T.accent, fontWeight: 500,
                  }}>
                    <div style={{ position: "absolute", inset: -1, background: T.accentBg, pointerEvents: "none" }} />
                    <div style={{ position: "relative", padding: "3px 10px", lineHeight: 1.4, whiteSpace: "nowrap" }}>{t}</div>
                  </div>
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
