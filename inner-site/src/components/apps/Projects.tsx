import { useState } from "react";
import { T } from "../../styles/tokens";

type Project = {
  id: string;
  title: string;
  tags: string[];
  desc: string;
  githubUrl: string;
  liveUrl?: string;
};

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "IoT Fleet Management System",
    tags: ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Microservices"],
    desc: "A real-time fleet tracking system built to learn distributed systems properly. Four Spring Boot microservices (device, route, telemetry, simulator) communicate asynchronously over Kafka. Vehicles are created, assigned routes across a graph of Midwest cities, and travel between nodes in real time consuming fuel based on vehicle type. Dijkstra's algorithm in the route service calculates shortest paths. A Java CLI simulator drives vehicles along graph edges tick by tick. Coordinating four services over async messaging — and debugging the edge cases that come with it — was the real education here.",
    githubUrl: "https://github.com/dengus14/iot-fleet-system",
  },
  {
    id: "2",
    title: "3D Portfolio Website",
    tags: ["Three.js", "React", "TypeScript", "Blender", "CSS3DRenderer"],
    desc: "This site. Two entry modes: a traditional web portfolio and a 3D interactive scene built in Three.js around a Blender-modeled gaming desk. The 3D mode uses CSS3DRenderer to composite a live iframe directly onto the monitor mesh, so clicking the monitor opens a fully functional fake OS desktop — draggable windows, taskbar, animated icons — running inside the 3D scene. The inner OS is a separate React app on its own Vite dev server. Getting WebGL and CSS rendering to composite without z-fighting was a genuine rabbit hole.",
    githubUrl: "https://github.com/dengus14/fullPortfolioPage",
  },
  {
    id: "3",
    title: "Scan-To-Access",
    tags: ["Node.js", "React Native", "Tesseract.js", "Google Cloud Vision", "JWT", "PostgreSQL"],
    desc: "Senior capstone project (CompSci 595), team of 4 — I led backend development. A mobile app where users photograph handwritten notes and have text extracted via OCR (Tesseract.js with Google Cloud Vision fallback). Notes are protected by a 6-character access code printed on physical paper; scanning the document auto-extracts and verifies the code to unlock the note. Also includes flashcard study mode, JWT auth, and full profile management. First time leading a real team's backend architecture.",
    githubUrl: "https://github.com/Chi-Sing-Thao/CompSci-595",
  },
  {
    id: "4",
    title: "Web Crawler & Site Auditor",
    tags: ["Java", "Spring Boot", "React", "Vite", "PostgreSQL"],
    desc: "Give it a URL and it BFS-crawls the entire site across multiple threads, then generates an audit report. The report breaks down broken links by HTTP status code, SEO issues (missing H1s, titles over 60 characters), the slowest pages using a min-heap to surface the top 10% by response time, and near-duplicate pages detected with SimHash. Backend in Java/Spring Boot, frontend in React/Vite, deployed with PostgreSQL. Debugging CORS between the two in production was a thorough education in how browsers actually work.",
    githubUrl: "https://github.com/dengus14/commitTracker",
  },
  {
    id: "5",
    title: "MindBody Fitness Tracker",
    tags: ["Java 21", "Spring Boot", "JWT", "PostgreSQL", "Docker"],
    desc: "Full-stack fitness tracking application. Users log workouts, track progress over time, and view metrics. Built with a Java 21 / Spring Boot backend, PostgreSQL for persistence, JWT for stateless auth, and Docker for consistent local and production environments.",
    githubUrl: "https://github.com/dengus14/MindBody",
  },
  {
    id: "6",
    title: "Relational Database Engine",
    tags: ["Java 21", "Maven", "B+ Tree", "JUnit"],
    desc: "A relational database engine built from scratch in Java — no JDBC, no external DB library. Implements the full stack: 4096-byte slotted pages with bidirectional growth (slots left-to-right, data right-to-left), disk management over RandomAccessFile, an LRU buffer pool with pin counts and dirty bits, a B+ tree with linked leaves for range scans, and a SQL parser/planner/executor supporting INSERT, SELECT, and DELETE. 76 tests across 11 classes; bulk inserts land around 420ms and index lookups clock in near 2 microseconds for 10,000 records. Writing this made every 'how does Postgres actually do X' question suddenly make sense.",
    githubUrl: "https://github.com/dengus14/JavaDatabase",
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
        background: "rgba(255,255,255,0.03)",
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
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
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

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: T.radiusSm,
                background: T.glassDim, border: `1px solid ${T.borderSub}`,
                color: T.text, fontSize: T.sm, fontWeight: 500,
                textDecoration: "none", cursor: "pointer",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = T.glass; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = T.glassDim; }}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                GitHub
              </a>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: T.radiusSm,
                  background: T.accent, color: "#fff",
                  fontSize: T.sm, fontWeight: 500,
                  textDecoration: "none", boxShadow: T.shadowSm,
                }}>
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9"/>
                    <path d="M13 3h-4M13 3v4M9 7l4-4"/>
                  </svg>
                  Live Site
                </a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: T.sm, color: T.textMuted, marginTop: 20 }}>Select a project</div>
        )}
      </div>
    </div>
  );
}
