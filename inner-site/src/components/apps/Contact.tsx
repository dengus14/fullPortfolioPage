import { useState } from "react";
import { T } from "../../styles/tokens";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", form);
    setSent(true);
  };

  const valid = form.name && form.email && form.message;

  return (
    <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14, height: "100%", overflowY: "auto" }}>
      <div style={{ fontSize: T.xl, fontWeight: 600, color: T.text }}>Get in Touch</div>

      {/* Social links */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { href: "mailto:ddgusev0318@gmail.com",                   label: "Email" },
          { href: "https://github.com/dengus14",                    label: "GitHub ↗" },
          { href: "https://www.linkedin.com/in/denis-gusev342/",   label: "LinkedIn ↗" },
        ].map(({ href, label }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" style={{
            padding: "5px 14px", borderRadius: T.radiusSm,
            background: T.glassDim, border: `1px solid ${T.borderSub}`,
            color: T.text, fontSize: T.sm, fontWeight: 500, textDecoration: "none",
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.glass)}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.glassDim)}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ height: 1, background: T.borderSub }} />

      {sent ? (
        <div style={{
          padding: 16, borderRadius: T.radiusSm,
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
          fontSize: T.sm, color: "#15803d", fontWeight: 500,
        }}>
          ✓ Message sent — I'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Name"    value={form.name}    onChange={(v) => setForm({ ...form, name: v })}    placeholder="Your name" />
          <Field label="Email"   value={form.email}   onChange={(v) => setForm({ ...form, email: v })}   placeholder="you@email.com" type="email" />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: T.xs, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.accent }}>
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What's on your mind?"
              rows={4}
              style={{
                background: "rgba(255,255,255,0.5)", border: `1px solid ${T.borderSub}`,
                borderRadius: T.radiusSm, padding: "8px 11px",
                color: T.text, fontSize: T.md, resize: "vertical",
                fontFamily: "inherit", outline: "none", lineHeight: 1.6,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = T.accentBorder)}
              onBlur={(e)  => (e.currentTarget.style.borderColor = T.borderSub)}
            />
          </div>

          <button
            type="submit"
            disabled={!valid}
            style={{
              padding: "8px 20px", borderRadius: T.radiusSm,
              background: valid ? T.accent : "rgba(0,0,0,0.08)",
              border: "none", color: valid ? "#fff" : T.textMuted,
              fontSize: T.sm, fontWeight: 600, cursor: valid ? "pointer" : "default",
              alignSelf: "flex-start", transition: "all 0.15s",
              boxShadow: valid ? T.shadowSm : "none",
            }}
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: T.xs, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.accent }}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "rgba(255,255,255,0.5)", border: `1px solid ${T.borderSub}`,
          borderRadius: T.radiusSm, padding: "7px 11px",
          color: T.text, fontSize: T.md, outline: "none", fontFamily: "inherit",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = T.accentBorder)}
        onBlur={(e)  => (e.currentTarget.style.borderColor = T.borderSub)}
      />
    </div>
  );
}
