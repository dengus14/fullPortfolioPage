import { useState } from "react";
import { T } from "../../styles/tokens";

type NavItem = "HOME" | "ABOUT" | "EXPERIENCE" | "SOFTWARE";

const NAV: { id: NavItem; label: string; color: string; icon: React.ReactNode }[] = [
  {
    id: "HOME", label: "Home", color: "#32ADE6",
    icon: (
      <svg viewBox="0 0 20 20" fill="white" width="15" height="15">
        <path d="M10 2L2 9h2v9h5v-5h2v5h5V9h2L10 2z"/>
      </svg>
    ),
  },
  {
    id: "ABOUT", label: "About", color: "#30D158",
    icon: (
      <svg viewBox="0 0 20 20" fill="white" width="15" height="15">
        <circle cx="10" cy="6" r="3.5"/>
        <path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7H3z"/>
      </svg>
    ),
  },
  {
    id: "EXPERIENCE", label: "Experience", color: "#FF9F0A",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
        <rect x="2" y="7" width="16" height="11" rx="2"/>
        <path d="M7 7V5a3 3 0 016 0v2"/>
      </svg>
    ),
  },
  {
    id: "SOFTWARE", label: "Software", color: "#BF5AF2",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" width="15" height="15">
        <path d="M6 7l-4 3 4 3M14 7l4 3-4 3M11 5l-2 10"/>
      </svg>
    ),
  },
];

export default function Portfolio() {
  const [page, setPage] = useState<NavItem>("HOME");

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <nav style={{
        width: 190, flexShrink: 0, overflowY: "auto",
        background: "#050506",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: "14px 8px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        {/* Header */}
        <div style={{ padding: "0 6px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 4 }}>
          <div style={{ fontSize: T.md, fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>Denis Gusev</div>
          <div style={{ fontSize: T.xs, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Portfolio</div>
        </div>

        {/* Nav items — direct, no container */}
        {NAV.map(({ id, label, color, icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                textAlign: "left", padding: "9px 10px", borderRadius: 8,
                background: active ? "#5E6AD2" : "transparent",
                border: "none",
                color: active ? "#ffffff" : "rgba(255,255,255,0.9)",
                fontSize: T.sm, fontWeight: 400,
                cursor: "pointer", transition: "background 0.15s",
                display: "flex", alignItems: "center", gap: 10,
                width: "100%",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: 6,
                background: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
        <PageContent page={page} />
      </div>
    </div>
  );
}

function PageContent({ page }: { page: NavItem }) {
  switch (page) {
    case "HOME":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: T.xxl, fontWeight: 700, color: T.text, lineHeight: 1.15 }}>Denis Gusev</div>
            <div style={{ fontSize: T.md, color: T.textSub, marginTop: 4 }}>Software Engineer · Milwaukee, WI</div>
          </div>
          <Divider />
          <p style={{ fontSize: T.md, color: T.text, lineHeight: 1.7, margin: 0 }}>
            Hi — I'm Denis, a software engineer finishing a BS in Computer Science at UW–Milwaukee.
            I build full-stack applications, distributed Java systems, and interactive 3D experiences.
            Explore SOFTWARE for projects, EXPERIENCE for my background, or ABOUT for more on me.
          </p>
        </div>
      );

    case "ABOUT":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>About</SectionHeader>
          <p style={bodyStyle}>
            I'm a software engineer finishing a BS in Computer Science at UW–Milwaukee (December 2025).
            I've interned at Northwestern Mutual building React/Next.js features for 8,000+ financial
            reps, written distributed Java microservices communicating over Kafka, and spent way too
            many nights debugging WebGL rendering pipelines.
          </p>
          <Divider />
          <p style={bodyStyle}>
            When I'm not writing code I'm probably exploring 3D modeling in Blender, music production,
            or finding new ways to blend engineering and visual craft.
          </p>
          <Label>Skills</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["TypeScript", "React", "Next.js", "Java", "Spring Boot", "Three.js", "PostgreSQL", "Docker", "Kafka", "Node.js", "Python", "Blender"].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      );

    case "EXPERIENCE":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>Experience</SectionHeader>
          <ExpEntry company="Northwestern Mutual · Milwaukee, WI" role="Software Engineer Intern" period="May 2025 – Aug. 2025"
            desc="Built responsive, accessible UI with React, Next.js, and Luna Design System for 8,000+ financial reps. Integrated RESTful APIs for real-time health metric rendering. Utilized GitLab CI/CD with Docker and Jest (99.9% coverage). Collaborated in Agile sprints to deliver high-quality features on schedule." />
          <Divider />
          <ExpEntry company="University of Wisconsin–Milwaukee" role="BS Computer Science" period="2021 – Dec. 2025"
            desc="Relevant coursework in distributed systems, algorithms, and software engineering. Senior capstone: Scan-To-Access — an OCR-based note-sharing mobile app (team of 4, lead backend developer)." />
        </div>
      );

    case "SOFTWARE":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>Software</SectionHeader>
          <p style={bodyStyle}>Selected projects from the last few years.</p>
          <Divider />
          <ProjectEntry title="IoT Fleet Management System" tags={["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Microservices"]}
            githubUrl="https://github.com/dengus14/iot-fleet-system"
            desc="Real-time fleet tracking system with four Spring Boot microservices communicating over Kafka. Vehicles travel graph edges tick-by-tick with Dijkstra's algorithm for shortest-path routing and per-vehicle-type fuel consumption." />
          <Divider />
          <ProjectEntry title="3D Portfolio Website" tags={["Three.js", "React", "TypeScript", "Blender", "CSS3DRenderer"]}
            githubUrl="https://github.com/dengus14/fullPortfolioPage"
            desc="Two-mode portfolio: a traditional web view and a 3D interactive scene built in Three.js around a Blender-modeled gaming desk. A CSS3DRenderer iframe composites a fully functional fake OS — draggable windows, taskbar, animated icons — directly onto the monitor mesh." />
          <Divider />
          <ProjectEntry title="Scan-To-Access" tags={["Node.js", "React Native", "Tesseract.js", "Google Cloud Vision", "JWT"]}
            githubUrl="https://github.com/Chi-Sing-Thao/CompSci-595"
            desc="Senior capstone (team of 4, lead backend dev). Mobile app where users photograph handwritten notes for OCR extraction. Notes are locked behind a 6-character code printed on paper — scanning the document auto-extracts and verifies the code. Includes flashcard mode and JWT auth." />
          <Divider />
          <ProjectEntry title="Web Crawler & Site Auditor" tags={["Java", "Spring Boot", "React", "PostgreSQL", "Vite"]}
            githubUrl="https://github.com/dengus14/commitTracker"
            desc="Website auditing tool that BFS-crawls an entire site across multiple threads and generates a report covering broken links by HTTP status, SEO issues (missing H1s, long titles), slowest pages via a min-heap, and near-duplicate pages detected with SimHash." />
          <Divider />
          <ProjectEntry title="MindBody Fitness Tracker" tags={["Java 21", "Spring Boot", "JWT", "PostgreSQL", "Docker"]}
            githubUrl="https://github.com/dengus14/MindBody"
            desc="Full-stack fitness tracking app with JWT authentication, workout logging, and progress visualization. Containerized with Docker for consistent local and production environments." />
        </div>
      );

    default: return null;
  }
}

const bodyStyle: React.CSSProperties = { fontSize: T.md, color: T.text, lineHeight: 1.7, margin: 0 };

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: T.xxl, fontWeight: 700, color: T.text }}>{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: T.xs, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.accent }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.borderSub }} />;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: `0 0 0 1px ${T.accentBorder}`,
      fontSize: T.xs, color: T.accent, fontWeight: 500,
    }}>
      <div style={{ position: "absolute", inset: -1, background: T.accentBg, pointerEvents: "none" }} />
      <div style={{ position: "relative", padding: "3px 10px", lineHeight: 1.4, whiteSpace: "nowrap" }}>{children}</div>
    </div>
  );
}

function ExpEntry({ company, role, period, desc }: { company: string; role: string; period: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: T.md, fontWeight: 600, color: T.text }}>{role}</div>
        <div style={{ fontSize: T.xs, color: T.textMuted }}>{period}</div>
      </div>
      <div style={{ fontSize: T.sm, color: T.accent, fontWeight: 500 }}>{company}</div>
      <p style={{ fontSize: T.sm, color: T.textSub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

function ProjectEntry({ title, tags, desc, githubUrl, liveUrl }: { title: string; tags: string[]; desc: string; githubUrl: string; liveUrl?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: T.base, fontWeight: 600, color: T.text }}>{title}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {tags.map((t) => <Chip key={t}>{t}</Chip>)}
      </div>
      <p style={{ fontSize: T.sm, color: T.textSub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
        <a href={githubUrl} target="_blank" rel="noreferrer" style={{
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
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" style={{
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
  );
}
