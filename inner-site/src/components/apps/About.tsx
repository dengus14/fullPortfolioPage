import { T } from "../../styles/tokens";

const SKILLS = ["TypeScript", "React", "Three.js", "Node.js", "Python", "Blender", "WebGL", "CSS"];

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
          YN
        </div>
        <div>
          <div style={{ fontSize: T.lg, fontWeight: 600, color: T.text }}>Your Name</div>
          <div style={{ fontSize: T.sm, color: T.textSub, marginTop: 2 }}>Software Engineer · Location</div>
        </div>
      </div>

      <Divider />

      <Section title="Background">
        Write your background story here. Where you came from, what got you into software,
        and what kind of problems you love to solve.
      </Section>

      <Section title="Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 2 }}>
          {SKILLS.map((s) => (
            <span key={s} style={{
              padding: "3px 10px", borderRadius: 20,
              background: T.accentBg, border: `1px solid ${T.accentBorder}`,
              fontSize: T.xs, color: T.accent, fontWeight: 500,
            }}>
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Education">
        BSc Computer Science · Your University · 2022
      </Section>

      <Section title="Interests">
        3D graphics, game development, music production, design, and building things that feel alive.
      </Section>
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
