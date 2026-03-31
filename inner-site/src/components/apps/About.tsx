import { T } from "../../styles/tokens";

const SKILLS = ["TypeScript", "React", "Next.js", "Java", "Spring Boot", "Three.js", "PostgreSQL", "Docker", "Kafka", "Node.js", "Python", "Blender"];

export default function About() {
  return (
    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", height: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${T.accent}, #a78bfa)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff", fontWeight: 600,
          boxShadow: T.shadowSm,
        }}>
          DG
        </div>
        <div>
          <div style={{ fontSize: T.lg, fontWeight: 600, color: T.text }}>Denis Gusev</div>
          <div style={{ fontSize: T.sm, color: T.textSub, marginTop: 2 }}>Software Engineer · Milwaukee, WI</div>
        </div>
      </div>

      <Divider />

      <Section title="Background">
        I'm a software engineer finishing a BS in Computer Science at UW–Milwaukee (December 2025).
        I build across the full stack — from distributed Java microservices to React frontends and
        interactive 3D experiences. I'm drawn to problems that sit at the intersection of engineering
        and visual craft: the kind where making it work and making it feel good are the same challenge.
      </Section>

      <Section title="Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 2 }}>
          {SKILLS.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Education">
        BS Computer Science · University of Wisconsin–Milwaukee · December 2025
      </Section>

      <Section title="Interests">
        3D graphics, game development, music production, design, and building things that feel alive.
      </Section>
    </div>
  );
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

function Divider() {
  return <div style={{ height: 1, background: T.borderSub }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: T.xs, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.accent }}>
        {title}
      </div>
      <div style={{ fontSize: T.md, color: T.text, lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}
