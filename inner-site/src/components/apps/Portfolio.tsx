import { useState } from "react";
import { T } from "../../styles/tokens";

type NavItem = "HOME" | "ABOUT" | "EXPERIENCE" | "SOFTWARE";

const NAV: { id: NavItem; label: string }[] = [
  { id: "HOME",       label: "Home" },
  { id: "ABOUT",      label: "About" },
  { id: "EXPERIENCE", label: "Experience" },
  { id: "SOFTWARE",   label: "Software" },
];

export default function Portfolio() {
  const [page, setPage] = useState<NavItem>("HOME");

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <nav style={{
        width: 148, flexShrink: 0, overflowY: "auto",
        background: "rgba(255,255,255,0.35)",
        borderRight: `1px solid ${T.borderSub}`,
        padding: "14px 10px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{ padding: "0 6px 12px", borderBottom: `1px solid ${T.borderSub}`, marginBottom: 6 }}>
          <div style={{ fontSize: T.md, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>Your Name</div>
          <div style={{ fontSize: T.xs, color: T.textSub, marginTop: 2 }}>Portfolio</div>
        </div>

        {NAV.map(({ id, label }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                textAlign: "left", padding: "7px 10px", borderRadius: T.radiusSm,
                background: active ? T.accentBg : "transparent",
                border: `1px solid ${active ? T.accentBorder : "transparent"}`,
                color: active ? T.accent : T.text,
                fontSize: T.sm, fontWeight: active ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.45)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
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
            <div style={{ fontSize: T.xxl, fontWeight: 700, color: T.text, lineHeight: 1.15 }}>Welcome</div>
            <div style={{ fontSize: T.md, color: T.textSub, marginTop: 4 }}>Software Engineer · Creative Developer</div>
          </div>
          <Divider />
          <p style={{ fontSize: T.md, color: T.text, lineHeight: 1.7, margin: 0 }}>
            Hi — I build interactive, visually driven experiences. Explore the SOFTWARE section for
            projects, or ABOUT to learn more about me.
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            background: T.accentBg, border: `1px solid ${T.accentBorder}`, borderRadius: T.radiusSm,
          }}>
            <div style={{ fontSize: 20 }}>📄</div>
            <div>
              <div style={{ fontSize: T.sm, fontWeight: 600, color: T.text }}>Looking for my resume?</div>
              <a href="#" style={{ fontSize: T.sm, color: T.accent, textDecoration: "none" }}>Click here to download it</a>
            </div>
          </div>
        </div>
      );

    case "ABOUT":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>About</SectionHeader>
          <p style={bodyStyle}>
            I'm a software engineer with a passion for creative technology — building things at the
            intersection of code and design, from 3D interactive experiences to full-stack apps.
          </p>
          <Divider />
          <p style={bodyStyle}>
            When I'm not writing code I'm probably exploring music production, 3D modeling, or
            finding new ways to blend art with technology.
          </p>
          <Label>Skills</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {["TypeScript", "React", "Three.js", "Node.js", "Python", "Blender", "WebGL"].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      );

    case "EXPERIENCE":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>Experience</SectionHeader>
          <ExpEntry company="Company Name" role="Software Engineer" period="2023 – Present"
            desc="Describe your role, what you built, the technologies used, and the impact you had." />
          <Divider />
          <ExpEntry company="Previous Company" role="Junior Developer" period="2021 – 2023"
            desc="Earlier role description. Skills developed and projects you contributed to." />
          <Divider />
          <ExpEntry company="University" role="BSc Computer Science" period="2017 – 2021"
            desc="Degree details, notable coursework, any awards or research." />
        </div>
      );

    case "SOFTWARE":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionHeader>Software</SectionHeader>
          <p style={bodyStyle}>Favorite software projects from the last few years.</p>
          <Divider />
          <ProjectEntry title="This Portfolio" tags={["Three.js", "React", "Blender"]}
            desc="Interactive 3D portfolio built with Three.js — a custom Blender scene rendered in WebGL with a full embedded OS." />
          <Divider />
          <ProjectEntry title="Project Two" tags={["React", "Node.js"]}
            desc="Description of your second project. What it solves, how you built it." />
          <Divider />
          <ProjectEntry title="Project Three" tags={["Python", "ML"]}
            desc="Description of your third project. Link to GitHub or live demo if available." />
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
    <span style={{
      padding: "3px 10px", borderRadius: 20,
      background: T.accentBg, border: `1px solid ${T.accentBorder}`,
      fontSize: T.xs, color: T.accent, fontWeight: 500,
    }}>
      {children}
    </span>
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

function ProjectEntry({ title, tags, desc }: { title: string; tags: string[]; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: T.base, fontWeight: 600, color: T.text }}>{title}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {tags.map((t) => <Chip key={t}>{t}</Chip>)}
      </div>
      <p style={{ fontSize: T.sm, color: T.textSub, lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}
