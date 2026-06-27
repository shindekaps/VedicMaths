import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg: "#FBF7EE",
  surface: "#FFFDF7",
  card: "#FFFFFF",
  deep: "#1A1208",
  ink: "#2D2010",
  muted: "#8B7355",
  border: "#E8DEC8",
  borderDark: "#C8B898",
  saffron: "#E8650A",
  saffronLight: "#FFF0E6",
  saffronDark: "#C04E00",
  gold: "#D4A017",
  goldLight: "#FFF8E6",
  goldDark: "#A07800",
  teal: "#0D8A7A",
  tealLight: "#E6F7F5",
  tealDark: "#075E53",
  indigo: "#3D2B8F",
  indigoLight: "#EEE9FF",
  ruby: "#C0272D",
  rubyLight: "#FFE9EA",
  lotus: "#D4547A",
  lotusLight: "#FFE9F0",
  green: "#2A7A3B",
  greenLight: "#E8F5EB",
};

const VIEWS = [
  { id: "landing", label: "🏠 Landing" },
  { id: "curriculum", label: "📚 Curriculum" },
  { id: "lesson", label: "✨ Lesson View" },
  { id: "practice", label: "⚡ Practice" },
  { id: "games", label: "🎮 Game Modes" },
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "leaderboard", label: "🏆 Leaderboard" },
  { id: "quiz", label: "📝 Quiz" },
];

const SUTRAS = [
  { id: 1, name: "Ekadhikena Purvena", meaning: "By one more than the previous", topic: "Squaring numbers ending in 5", category: "Multiplication", color: C.saffron, icon: "①", mastery: 100 },
  { id: 2, name: "Nikhilam Navatashcaramam", meaning: "All from 9 and the last from 10", topic: "Multiplication near base numbers (10, 100…)", category: "Multiplication", color: C.teal, icon: "②", mastery: 85 },
  { id: 3, name: "Urdhva Tiryagbhyam", meaning: "Vertically and Cross-wise", topic: "General multiplication of any numbers", category: "Multiplication", color: C.indigo, icon: "③", mastery: 60 },
  { id: 4, name: "Paravartya Yojayet", meaning: "Transpose and Apply", topic: "Division and equations", category: "Division", color: C.ruby, icon: "④", mastery: 40 },
  { id: 5, name: "Shunyam Samyasamuccaye", meaning: "If the sum is the same, that sum is zero", topic: "Solving equations quickly", category: "Algebra", color: C.lotus, icon: "⑤", mastery: 20 },
  { id: 6, name: "Anurupyena", meaning: "Proportionality", topic: "Multiplication using proportions", category: "Multiplication", color: C.gold, icon: "⑥", mastery: 0 },
  { id: 7, name: "Sankalana-vyavakalanabhyam", meaning: "Addition and Subtraction", topic: "Simultaneous equations", category: "Algebra", color: C.green, icon: "⑦", mastery: 0 },
  { id: 8, name: "Puranapuranabhyam", meaning: "By Completion or Non-completion", topic: "Completing squares / cubes", category: "Algebra", color: C.teal, icon: "⑧", mastery: 0 },
];

const BADGES = [
  { icon: "🌟", name: "First Step", desc: "Completed first lesson", earned: true, color: C.gold },
  { icon: "🔥", name: "7-Day Streak", desc: "7 consecutive days", earned: true, color: C.saffron },
  { icon: "⚡", name: "Speed Demon", desc: "10 answers under 3s each", earned: true, color: C.teal },
  { icon: "🏹", name: "Sutra Scholar", desc: "Master any Sutra 100%", earned: false, color: C.indigo },
  { icon: "👑", name: "Vedic Master", desc: "All 16 Sutras mastered", earned: false, color: C.ruby },
  { icon: "🎯", name: "Perfect Quiz", desc: "100% on any quiz", earned: false, color: C.lotus },
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const NavBar = ({ active, setActive }) => (
  <div style={{
    background: C.deep, borderBottom: `2px solid ${C.saffron}`,
    display: "flex", alignItems: "center", padding: "0 20px",
    gap: 2, flexWrap: "wrap", flexShrink: 0
  }}>
    <div style={{
      color: C.saffron, fontFamily: "'Georgia', serif", fontWeight: 700,
      fontSize: 16, padding: "12px 16px 12px 4px",
      borderRight: `1px solid #ffffff22`, marginRight: 8, letterSpacing: "-0.5px"
    }}>वैदिक <span style={{ color: "#fff" }}>Path</span></div>
    {VIEWS.map(v => (
      <button key={v.id} onClick={() => setActive(v.id)} style={{
        background: active === v.id ? C.saffron : "transparent",
        color: active === v.id ? "#fff" : "#aaa",
        border: "none", cursor: "pointer", padding: "10px 12px",
        fontSize: 12, fontWeight: active === v.id ? 700 : 400,
        borderRadius: 4, transition: "all 0.15s", whiteSpace: "nowrap"
      }}>{v.label}</button>
    ))}
  </div>
);

const MandalaDecor = ({ size = 120, opacity = 0.06, color = C.saffron }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ opacity, pointerEvents: "none" }}>
    <circle cx="60" cy="60" r="55" fill="none" stroke={color} strokeWidth="1" />
    <circle cx="60" cy="60" r="42" fill="none" stroke={color} strokeWidth="0.8" />
    <circle cx="60" cy="60" r="28" fill="none" stroke={color} strokeWidth="0.6" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
      <line key={a} x1="60" y1="60"
        x2={60 + 55 * Math.cos(a * Math.PI / 180)}
        y2={60 + 55 * Math.sin(a * Math.PI / 180)}
        stroke={color} strokeWidth="0.5" />
    ))}
    {[0,45,90,135].map(a => (
      <rect key={a} x="50" y="50" width="20" height="20"
        fill="none" stroke={color} strokeWidth="0.6"
        transform={`rotate(${a} 60 60)`} />
    ))}
  </svg>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingView = ({ setActive }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ background: C.bg, minHeight: "100%", overflow: "hidden" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.deep} 0%, #2A1A08 60%, #1A0D05 100%)`,
        padding: "64px 48px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, pointerEvents: "none" }}>
          <MandalaDecor size={300} opacity={0.08} color={C.saffron} />
        </div>
        <div style={{ position: "absolute", bottom: -40, left: 40, pointerEvents: "none" }}>
          <MandalaDecor size={200} opacity={0.05} color={C.gold} />
        </div>
        <div style={{ position: "relative", maxWidth: 700 }}>
          <div style={{
            display: "inline-block", background: C.saffron + "22", border: `1px solid ${C.saffron}55`,
            borderRadius: 20, padding: "4px 14px", color: C.saffron, fontSize: 11,
            fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: 20
          }}>Ancient Wisdom · Modern Learning · 16 Sutras</div>
          <h1 style={{
            fontFamily: "'Georgia', serif", fontSize: 52, fontWeight: 700,
            color: "#FFFFFF", lineHeight: 1.1, margin: "0 0 16px 0", letterSpacing: "-2px"
          }}>
            Master Vedic<br />
            <span style={{ color: C.saffron }}>Mathematics</span>
          </h1>
          <p style={{
            color: "#B8A898", fontSize: 17, lineHeight: 1.7, margin: "0 0 32px 0", maxWidth: 500
          }}>
            The world's fastest mental math system, distilled into interactive lessons, games, and adaptive practice. Learn to multiply 98×97 in 3 seconds — in your head.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setActive("curriculum")} style={{
              background: C.saffron, color: "#fff", border: "none",
              borderRadius: 8, padding: "14px 28px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", letterSpacing: "-0.3px"
            }}>Start Learning Free →</button>
            <button onClick={() => setActive("lesson")} style={{
              background: "transparent", color: "#D8C8B0", border: `1px solid #ffffff33`,
              borderRadius: 8, padding: "14px 24px", fontSize: 15, cursor: "pointer"
            }}>Watch Demo Lesson</button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["16", "Vedic Sutras"], ["50K+", "Students"], ["4.9★", "Rating"], ["3 sec", "Avg calculation"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ color: C.saffron, fontFamily: "'Georgia', serif", fontSize: 24, fontWeight: 700 }}>{n}</div>
                <div style={{ color: "#8A7868", fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: "48px 48px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 32, color: C.deep, margin: "0 0 8px" }}>Everything You Need to Master Vedic Math</h2>
          <p style={{ color: C.muted, fontSize: 15 }}>6 integrated learning modes designed for rapid skill acquisition</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { icon: "📖", title: "Structured Lessons", desc: "16 Sutras organized by topic. Step-by-step animated explanations with worked examples.", color: C.saffron },
            { icon: "⚡", title: "Adaptive Practice", desc: "AI adjusts difficulty based on your accuracy. Never too easy, never frustrating.", color: C.teal },
            { icon: "🎮", title: "Game Modes", desc: "Speed Blitz, Sutra Wars, Number Ninja — learn through play with real competition.", color: C.indigo },
            { icon: "🏆", title: "Gamification", desc: "XP, levels, 15+ badges, daily streaks, and weekly leaderboards keep you coming back.", color: C.gold },
            { icon: "📊", title: "Progress Analytics", desc: "Know exactly which Sutras you've mastered and where to focus next.", color: C.ruby },
            { icon: "👨‍🏫", title: "Teacher Tools", desc: "Create classes, assign homework, track every student's mastery in real-time.", color: C.green },
          ].map(f => (
            <div key={f.title} onMouseEnter={() => setHovered(f.title)} onMouseLeave={() => setHovered(null)} style={{
              background: hovered === f.title ? f.color + "08" : C.card,
              border: `1px solid ${hovered === f.title ? f.color + "44" : C.border}`,
              borderRadius: 12, padding: "24px 22px", cursor: "default",
              transition: "all 0.2s", transform: hovered === f.title ? "translateY(-2px)" : "none",
              boxShadow: hovered === f.title ? `0 8px 24px ${f.color}18` : "none"
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, color: C.deep, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Sutras preview */}
      <div style={{ padding: "0 48px 48px" }}>
        <h3 style={{ fontFamily: "'Georgia', serif", fontSize: 22, color: C.deep, marginBottom: 20 }}>
          Explore the 16 Sutras
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {SUTRAS.slice(0, 4).map(s => (
            <div key={s.id} onClick={() => setActive("lesson")} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "18px 16px", cursor: "pointer",
              borderTop: `3px solid ${s.color}`, transition: "all 0.15s"
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 700, fontFamily: "monospace",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.category}</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, fontWeight: 700, color: C.deep, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 8 }}>"{s.meaning}"</div>
              <div style={{ fontSize: 12, color: C.ink }}>{s.topic}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CURRICULUM ───────────────────────────────────────────────────────────────
const CurriculumView = ({ setActive }) => {
  const categories = ["All", "Multiplication", "Division", "Algebra", "Squares & Cubes"];
  const [cat, setCat] = useState("All");
  const levels = [
    { name: "Foundation", desc: "Sutras 1–4 · Grades 4–6", sutras: 4, color: C.green, tag: "Beginner" },
    { name: "Intermediate", desc: "Sutras 5–10 · Grades 7–9", sutras: 6, color: C.gold, tag: "Intermediate" },
    { name: "Advanced", desc: "Sutras 11–16 · Grades 10–12", sutras: 6, color: C.ruby, tag: "Advanced" },
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: "36px 40px" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, color: C.deep, margin: "0 0 6px" }}>Vedic Mathematics Curriculum</h2>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>16 Sutras across 3 levels. Unlock the next Sutra by mastering the previous.</p>
      </div>

      {/* Level cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {levels.map(l => (
          <div key={l.name} style={{
            background: l.color + "0C", border: `1px solid ${l.color}33`,
            borderRadius: 12, padding: "20px 22px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: C.deep }}>{l.name}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{l.desc}</div>
              </div>
              <div style={{
                background: l.color + "22", border: `1px solid ${l.color}44`,
                borderRadius: 4, padding: "3px 10px", color: l.color, fontSize: 11, fontWeight: 700,
                fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1
              }}>{l.tag}</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: l.sutras }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: i < Math.round(l.sutras * (l.name === "Foundation" ? 0.75 : l.name === "Intermediate" ? 0.33 : 0)),
                  backgroundColor: i < Math.round(l.sutras * (l.name === "Foundation" ? 0.75 : l.name === "Intermediate" ? 0.33 : 0)) ? l.color : l.color + "22"
                }} />
              ))}
            </div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>
              {l.name === "Foundation" ? "3/4" : l.name === "Intermediate" ? "2/6" : "0/6"} Sutras mastered
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            background: cat === c ? C.saffron : C.card,
            color: cat === c ? "#fff" : C.muted,
            border: `1px solid ${cat === c ? C.saffron : C.border}`,
            borderRadius: 20, padding: "5px 16px", fontSize: 12,
            cursor: "pointer", fontWeight: cat === c ? 700 : 400
          }}>{c}</button>
        ))}
      </div>

      {/* Sutra grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {SUTRAS.map(s => (
          <div key={s.id} onClick={() => setActive("lesson")} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "18px 20px", cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start",
            transition: "all 0.15s", position: "relative", overflow: "hidden"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: s.color + "15",
              border: `2px solid ${s.color}44`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20, flexShrink: 0
            }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, fontWeight: 700, color: C.deep }}>{s.name}</div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 700, fontFamily: "monospace" }}>
                  {s.mastery}%
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 6 }}>"{s.meaning}"</div>
              <div style={{ fontSize: 12, color: C.ink, marginBottom: 8 }}>{s.topic}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
                  <div style={{ width: `${s.mastery}%`, height: "100%", background: s.color, borderRadius: 2, transition: "width 0.6s" }} />
                </div>
                <div style={{ fontSize: 10, color: s.color, fontWeight: 700, fontFamily: "monospace" }}>
                  {s.mastery === 0 ? "LOCKED" : s.mastery === 100 ? "✓ MASTERED" : "IN PROGRESS"}
                </div>
              </div>
            </div>
            {s.mastery === 0 && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(251,247,238,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10
              }}>
                <div style={{ fontSize: 20 }}>🔒</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── LESSON VIEW ──────────────────────────────────────────────────────────────
const LessonView = ({ setActive }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "What is Nikhilam?", content: "The Nikhilam Sutra states: 'All from 9 and the last from 10.' It's used to multiply numbers that are close to a base like 10, 100, or 1000. Instead of direct multiplication, we work with the deficit (how far each number is from the base).", example: null },
    { title: "Find the Deficit", content: "For any number, subtract it from the nearest base (10, 100, 1000…). This gives the deficit.", example: { eq: "97 → 100 − 97 = 3\n98 → 100 − 98 = 2", label: "Deficits for 97 × 98" } },
    { title: "Cross Subtract", content: "Subtract one number's deficit from the other number. Both give the same result — this becomes the LEFT part of the answer.", example: { eq: "97 − 2 = 95\n  (or 98 − 3 = 95) ✓", label: "Left part = 95" } },
    { title: "Multiply Deficits", content: "Multiply the two deficits together. This is the RIGHT part of the answer. The number of digits must equal the number of zeros in the base.", example: { eq: "3 × 2 = 06", label: "Right part = 06 (2 digits for base 100)" } },
    { title: "Combine!", content: "Join the left part and right part to get the final answer.", example: { eq: "95 | 06 = 9506\n97 × 98 = 9506 ✓", label: "Final Answer" } },
  ];
  const cur = steps[step];
  return (
    <div style={{ background: C.bg, minHeight: "100%", display: "flex", gap: 0 }}>
      {/* Sidebar progress */}
      <div style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, padding: "24px 16px", flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Sutra 2 · Lesson 1</div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 15, fontWeight: 700, color: C.deep, marginBottom: 4 }}>Nikhilam</div>
        <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginBottom: 20 }}>"All from 9, last from 10"</div>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
            borderRadius: 7, cursor: "pointer", marginBottom: 4,
            background: step === i ? C.teal + "15" : "transparent",
            border: `1px solid ${step === i ? C.teal + "44" : "transparent"}`
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: i < step ? C.teal : step === i ? C.teal : C.border,
              color: i <= step ? "#fff" : C.muted, fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
            }}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: 12, color: step === i ? C.teal : C.muted }}>{s.title}</span>
          </div>
        ))}
        <div style={{ marginTop: 24, padding: "14px", background: C.tealLight, borderRadius: 8, border: `1px solid ${C.teal}33` }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, marginBottom: 4 }}>XP THIS LESSON</div>
          <div style={{ fontSize: 22, fontFamily: "'Georgia', serif", color: C.teal, fontWeight: 700 }}>+{step * 10} / 50</div>
          <div style={{ fontSize: 11, color: C.muted }}>Keep going to earn more!</div>
        </div>
      </div>

      {/* Main lesson area */}
      <div style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>STEP {step + 1} OF {steps.length}</div>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 28, color: C.deep, margin: 0 }}>{cur.title}</h2>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ width: 32, height: 4, borderRadius: 2, background: i <= step ? C.teal : C.border }} />
              ))}
            </div>
          </div>

          {/* Content card */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "28px 32px", marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
          }}>
            <p style={{ fontSize: 16, color: C.ink, lineHeight: 1.8, margin: "0 0 20px" }}>{cur.content}</p>
            {cur.example && (
              <div style={{
                background: `linear-gradient(135deg, ${C.teal}0A, ${C.teal}04)`,
                border: `1px solid ${C.teal}30`, borderRadius: 10, padding: "20px 24px"
              }}>
                <div style={{ fontSize: 11, color: C.teal, fontFamily: "monospace", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{cur.example.label}</div>
                <pre style={{
                  fontFamily: "'Georgia', serif", fontSize: 22, color: C.deep,
                  margin: 0, lineHeight: 1.8, background: "none", padding: 0
                }}>{cur.example.eq}</pre>
              </div>
            )}
          </div>

          {/* Vedic insight box */}
          <div style={{
            background: C.saffronLight, border: `1px solid ${C.saffron}33`,
            borderRadius: 10, padding: "16px 20px", marginBottom: 24,
            display: "flex", gap: 12, alignItems: "flex-start"
          }}>
            <div style={{ fontSize: 20 }}>💡</div>
            <div>
              <div style={{ fontSize: 12, color: C.saffron, fontWeight: 700, marginBottom: 4 }}>VEDIC INSIGHT</div>
              <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
                Nikhilam works because numbers near a base have small deficits. The mental work is minimal — you're just adding small numbers and doing tiny multiplications instead of long multiplication.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{
                background: C.card, color: C.muted, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "12px 24px", fontSize: 14, cursor: "pointer"
              }}>← Back</button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} style={{
                background: C.teal, color: "#fff", border: "none",
                borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>Next Step →</button>
            ) : (
              <button onClick={() => setActive("practice")} style={{
                background: C.saffron, color: "#fff", border: "none",
                borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>Start Practice ⚡</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRACTICE VIEW ────────────────────────────────────────────────────────────
const PracticeView = () => {
  const [ans, setAns] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correct, setCorrect] = useState(null);
  const correct_ans = 9506;

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) { setSubmitted(true); setCorrect(false); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted]);

  const submit = () => {
    setSubmitted(true);
    setCorrect(parseInt(ans) === correct_ans);
  };

  const timerColor = timeLeft > 20 ? C.green : timeLeft > 10 ? C.gold : C.ruby;
  const timerPct = (timeLeft / 30) * 100;

  return (
    <div style={{ background: C.bg, minHeight: "100%", display: "flex" }}>
      {/* Left: problem area */}
      <div style={{ flex: 1, padding: "40px 48px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {/* Timer ring */}
        <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke={C.border} strokeWidth="6" />
            <circle cx="45" cy="45" r="38" fill="none" stroke={timerColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38 * timerPct / 100} ${2 * Math.PI * 38}`}
              transform="rotate(-90 45 45)" style={{ transition: "stroke-dasharray 0.9s, stroke 0.3s" }} />
            <text x="45" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill={timerColor} fontFamily="monospace">{timeLeft}</text>
          </svg>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", letterSpacing: 2 }}>SECONDS</div>
        </div>

        {/* Problem */}
        <div style={{
          background: C.card, border: `2px solid ${C.border}`, borderRadius: 16,
          padding: "40px 60px", textAlign: "center", marginBottom: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: 11, color: C.teal, fontFamily: "monospace", fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Nikhilam Sutra · Problem 4/10</div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 52, fontWeight: 700, color: C.deep, letterSpacing: "-2px" }}>
            97 × 98
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Near base 100</div>
        </div>

        {/* Input */}
        {!submitted ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              value={ans} onChange={e => setAns(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && ans && submit()}
              placeholder="Type your answer…"
              style={{
                border: `2px solid ${C.border}`, borderRadius: 10, padding: "14px 20px",
                fontSize: 22, fontFamily: "'Georgia', serif", width: 180, textAlign: "center",
                outline: "none", background: C.card, color: C.deep
              }} />
            <button onClick={submit} disabled={!ans} style={{
              background: ans ? C.teal : C.border, color: ans ? "#fff" : C.muted,
              border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15,
              fontWeight: 700, cursor: ans ? "pointer" : "default"
            }}>Submit</button>
          </div>
        ) : (
          <div style={{
            background: correct ? C.greenLight : C.rubyLight,
            border: `2px solid ${correct ? C.green : C.ruby}44`,
            borderRadius: 12, padding: "20px 32px", textAlign: "center", maxWidth: 400, width: "100%"
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{correct ? "🎉" : "❌"}</div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700,
              color: correct ? C.green : C.ruby, marginBottom: 6 }}>
              {correct ? `Correct! +20 XP` : `Answer: 9506`}
            </div>
            <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.6 }}>
              97−2 = <b>95</b> | 3×2 = <b>06</b> → <b>9506</b>
            </div>
          </div>
        )}
      </div>

      {/* Right: session stats */}
      <div style={{ width: 240, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: "28px 20px" }}>
        <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>SESSION STATS</div>
        {[
          { label: "Problems", value: "4 / 10", color: C.ink },
          { label: "Accuracy", value: "75%", color: C.green },
          { label: "Avg Time", value: "8.2s", color: C.gold },
          { label: "XP Earned", value: "+60", color: C.saffron },
          { label: "Streak", value: "🔥 3", color: C.ruby },
        ].map(s => (
          <div key={s.label} style={{
            display: "flex", justifyContent: "space-between", padding: "12px 0",
            borderBottom: `1px solid ${C.border}`
          }}>
            <span style={{ fontSize: 13, color: C.muted }}>{s.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: s.color, fontFamily: "monospace" }}>{s.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, background: C.saffronLight, borderRadius: 8, padding: "14px" }}>
          <div style={{ fontSize: 11, color: C.saffron, fontWeight: 700, marginBottom: 6 }}>DIFFICULTY</div>
          <div style={{ fontSize: 13, color: C.ink }}>Auto-adjusting based on your accuracy</div>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {["Easy", "Med", "Hard"].map((d, i) => (
              <div key={d} style={{
                flex: 1, padding: "5px 4px", textAlign: "center", fontSize: 11, borderRadius: 4,
                background: i === 1 ? C.gold : C.border, color: i === 1 ? "#fff" : C.muted, fontWeight: i === 1 ? 700 : 400
              }}>{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GAMES VIEW ───────────────────────────────────────────────────────────────
const GamesView = ({ setActive }) => {
  const [activeGame, setActiveGame] = useState(null);
  const games = [
    {
      id: "blitz", name: "Speed Blitz", emoji: "⚡", color: C.saffron,
      tag: "Solo", desc: "Answer as many problems as possible in 60 seconds. Bonus XP for speed combos.",
      mechanics: ["60-second timer", "Combo multiplier (3× at 5 in a row)", "Lives: 3 wrong = game over", "Daily high score tracked"],
      preview: "60s · Combo · Lives"
    },
    {
      id: "ninja", name: "Number Ninja", emoji: "🥷", color: C.indigo,
      tag: "Solo", desc: "Falling numbers — tap the correct answer before it hits the ground. Increasing speed.",
      mechanics: ["Arcade-style falling numbers", "3 difficulty waves", "Boss round every 10 correct", "Global rank by score"],
      preview: "Arcade · Waves · Boss"
    },
    {
      id: "wars", name: "Sutra Wars", emoji: "⚔️", color: C.ruby,
      tag: "1v1 Live", desc: "Challenge a friend or random opponent in real-time. First to 10 correct wins.",
      mechanics: ["WebSocket real-time multiplayer", "Sabotage: steal opponent's time", "Choose your Sutra weapon", "ELO-based matchmaking"],
      preview: "Live · 1v1 · ELO"
    },
    {
      id: "quest", name: "Vedic Quest", emoji: "🗺️", color: C.teal,
      tag: "Campaign", desc: "Story-driven math adventure. Solve puzzles using Vedic techniques to unlock ancient secrets.",
      mechanics: ["15 chapter story campaign", "Character progression (Apprentice → Guru)", "Puzzle rooms, riddles, boss battles", "Collectible Sutra scrolls"],
      preview: "Story · 15 Chapters"
    },
    {
      id: "memory", name: "Pattern Memory", emoji: "🧠", color: C.lotus,
      tag: "Brain Training", desc: "Remember and reproduce Vedic calculation patterns. Tests working memory alongside math.",
      mechanics: ["Pattern shown for 3 seconds", "Reproduce with Vedic method", "Sequence length grows", "Trains visual-spatial memory"],
      preview: "Memory · Patterns"
    },
    {
      id: "collab", name: "Team Challenge", emoji: "👥", color: C.green,
      tag: "Team", desc: "Classes compete together. Every student's correct answer adds to the team total.",
      mechanics: ["Up to 30 students per team", "Live classroom scoreboard", "Teacher sets the topic", "Weekly class trophy"],
      preview: "30 Players · Live"
    },
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: "36px 40px" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, color: C.deep, margin: "0 0 6px" }}>Game Modes</h2>
        <p style={{ color: C.muted, fontSize: 14 }}>6 ways to learn through play. Every game teaches real Vedic techniques.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {games.map(g => (
          <div key={g.id} onClick={() => setActiveGame(activeGame === g.id ? null : g.id)} style={{
            background: C.card, border: `2px solid ${activeGame === g.id ? g.color : C.border}`,
            borderRadius: 14, overflow: "hidden", cursor: "pointer",
            boxShadow: activeGame === g.id ? `0 8px 28px ${g.color}22` : "none",
            transition: "all 0.2s"
          }}>
            {/* Game header */}
            <div style={{ background: g.color + "10", padding: "20px 22px", borderBottom: `1px solid ${g.color}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 32 }}>{g.emoji}</div>
                <div style={{
                  background: g.color + "22", border: `1px solid ${g.color}44`,
                  borderRadius: 10, padding: "2px 10px", color: g.color,
                  fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                  textTransform: "uppercase", letterSpacing: 1
                }}>{g.tag}</div>
              </div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: C.deep, marginTop: 10 }}>{g.name}</div>
              <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", marginTop: 2 }}>{g.preview}</div>
            </div>
            <div style={{ padding: "16px 22px" }}>
              <p style={{ color: C.ink, fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{g.desc}</p>
              {activeGame === g.id && (
                <div>
                  {g.mechanics.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 12, color: C.ink }}>
                      <span style={{ color: g.color }}>→</span>{m}
                    </div>
                  ))}
                  <button onClick={(e) => { e.stopPropagation(); }} style={{
                    marginTop: 14, background: g.color, color: "#fff", border: "none",
                    borderRadius: 7, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%"
                  }}>Play Now {g.emoji}</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Game-based learning insight */}
      <div style={{
        marginTop: 28, background: C.indigoLight, border: `1px solid ${C.indigo}33`,
        borderRadius: 12, padding: "20px 28px", display: "flex", gap: 16, alignItems: "flex-start"
      }}>
        <div style={{ fontSize: 28 }}>🧬</div>
        <div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, fontWeight: 700, color: C.indigo, marginBottom: 6 }}>
            Why Game-Based Learning Works
          </div>
          <div style={{ color: C.ink, fontSize: 13, lineHeight: 1.7 }}>
            Research shows students retain <b>75% more</b> through active play vs passive reading. Each game targets different cognitive strengths: Speed Blitz builds automaticity, Number Ninja trains pattern recognition, Sutra Wars creates competitive motivation, and Vedic Quest provides narrative context for deeper understanding.
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const DashboardView = ({ setActive }) => {
  const weeks = ["M", "T", "W", "T", "F", "S", "S"];
  const activity = [3, 5, 2, 7, 4, 6, 1];
  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Good morning,</div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 28, color: C.deep, margin: "0 0 6px" }}>Arjun Sharma 👋</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ background: C.saffronLight, color: C.saffron, fontSize: 12, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>🔥 14 Day Streak</span>
            <span style={{ background: C.tealLight, color: C.teal, fontSize: 12, padding: "3px 10px", borderRadius: 10, fontWeight: 700 }}>Level 8 · Scholar</span>
          </div>
        </div>
        <button onClick={() => setActive("practice")} style={{
          background: C.saffron, color: "#fff", border: "none",
          borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>Continue Learning →</button>
      </div>

      {/* Top stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total XP", value: "4,820", icon: "⭐", color: C.gold },
          { label: "Sutras Mastered", value: "5 / 16", icon: "📖", color: C.teal },
          { label: "Problems Solved", value: "1,247", icon: "✏️", color: C.indigo },
          { label: "Accuracy", value: "83%", icon: "🎯", color: C.green },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", marginBottom: 6 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Progress rings */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 14 }}>Sutra Progress</div>
          {SUTRAS.slice(0, 5).map(s => (
            <div key={s.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: C.ink }}>{s.name.split(" ")[0]}</span>
                <span style={{ color: s.color, fontFamily: "monospace", fontWeight: 700 }}>{s.mastery}%</span>
              </div>
              <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                <div style={{ width: `${s.mastery}%`, height: "100%", background: s.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Weekly activity */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 14 }}>This Week's Activity</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80, marginBottom: 8 }}>
            {activity.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", background: v > 5 ? C.saffron : v > 3 ? C.gold : C.teal,
                  height: `${v * 11}px`, borderRadius: "3px 3px 0 0", transition: "height 0.4s" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {weeks.map((d, i) => <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11, color: C.muted }}>{d}</div>)}
          </div>
          <div style={{ marginTop: 14, padding: "10px 12px", background: C.saffronLight, borderRadius: 7 }}>
            <div style={{ fontSize: 12, color: C.saffron, fontWeight: 700 }}>28 problems this week</div>
            <div style={{ fontSize: 11, color: C.muted }}>+12 from last week 📈</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 14 }}>Achievements</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {BADGES.map(b => (
              <div key={b.name} title={b.desc} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "10px 6px", borderRadius: 8,
                background: b.earned ? b.color + "10" : "#f0f0f0",
                border: `1px solid ${b.earned ? b.color + "44" : "#ddd"}`,
                opacity: b.earned ? 1 : 0.5
              }}>
                <div style={{ fontSize: 22, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
                <div style={{ fontSize: 9, color: b.earned ? b.color : C.muted, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{b.name}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: C.muted, textAlign: "center" }}>3 / 6 earned · 13 more available</div>
        </div>
      </div>
    </div>
  );
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
const LeaderboardView = () => {
  const [tab, setTab] = useState("weekly");
  const players = [
    { rank: 1, name: "Priya Mehta", xp: 3240, streak: 22, level: "Vedic Master", avatar: "🧙‍♀️" },
    { rank: 2, name: "Rohan Gupta", xp: 2980, streak: 15, level: "Guru", avatar: "👨‍🎓" },
    { rank: 3, name: "Ananya Singh", xp: 2750, streak: 18, level: "Guru", avatar: "👩‍💻" },
    { rank: 4, name: "Arjun Sharma", xp: 2420, streak: 14, level: "Scholar", avatar: "👦", isMe: true },
    { rank: 5, name: "Kavitha Nair", xp: 2180, streak: 9, level: "Scholar", avatar: "👩" },
    { rank: 6, name: "Dev Patel", xp: 1950, streak: 7, level: "Adept", avatar: "👨" },
    { rank: 7, name: "Meera Joshi", xp: 1820, streak: 11, level: "Adept", avatar: "👩‍🏫" },
  ];
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: "36px 40px" }}>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 30, color: C.deep, margin: "0 0 6px" }}>Leaderboard</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Top students by XP this week. Resets every Monday.</p>

      {/* Podium */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32, alignItems: "flex-end" }}>
        {[players[1], players[0], players[2]].map((p, i) => {
          const heights = [100, 130, 80];
          const colors = [C.muted, C.gold, C.saffron];
          return (
            <div key={p.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 32 }}>{p.avatar}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.deep }}>{p.name.split(" ")[0]}</div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>{p.xp.toLocaleString()} XP</div>
              <div style={{
                width: 80, height: heights[i], background: colors[i] + "20",
                border: `2px solid ${colors[i]}44`, borderRadius: "6px 6px 0 0",
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                paddingTop: 10, fontSize: 24
              }}>{medals[p.rank - 1]}</div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["weekly", "monthly", "alltime"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? C.deep : C.card,
            color: tab === t ? "#fff" : C.muted,
            border: `1px solid ${tab === t ? C.deep : C.border}`,
            borderRadius: 20, padding: "5px 16px", fontSize: 12, cursor: "pointer", fontWeight: tab === t ? 700 : 400,
            textTransform: "capitalize"
          }}>{t}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", background: "#F5F0E8", display: "grid",
          gridTemplateColumns: "48px 1fr 100px 80px 80px",
          fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 1, fontWeight: 700 }}>
          <span>RANK</span><span>STUDENT</span><span>XP</span><span>STREAK</span><span>LEVEL</span>
        </div>
        {players.map(p => (
          <div key={p.rank} style={{
            padding: "14px 20px", display: "grid", gridTemplateColumns: "48px 1fr 100px 80px 80px",
            borderBottom: `1px solid ${C.border}`, alignItems: "center",
            background: p.isMe ? C.saffronLight : "transparent"
          }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: p.rank <= 3 ? C.gold : C.muted, fontSize: 15 }}>
              {p.rank <= 3 ? medals[p.rank - 1] : `#${p.rank}`}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 22 }}>{p.avatar}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: p.isMe ? 700 : 400, color: C.deep }}>
                  {p.name} {p.isMe && <span style={{ color: C.saffron, fontSize: 11 }}>← You</span>}
                </div>
              </div>
            </div>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: C.gold, fontSize: 14 }}>{p.xp.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: C.ruby }}>🔥 {p.streak}d</span>
            <span style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>{p.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── QUIZ VIEW ────────────────────────────────────────────────────────────────
const QuizView = () => {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const options = [
    { id: "a", label: "9204", correct: false },
    { id: "b", label: "9306", correct: false },
    { id: "c", label: "9506", correct: true },
    { id: "d", label: "9406", correct: false },
  ];
  const getOptionBg = (o) => {
    if (!confirmed) return selected === o.id ? C.teal + "15" : C.card;
    if (o.correct) return C.greenLight;
    if (selected === o.id && !o.correct) return C.rubyLight;
    return C.card;
  };
  const getOptionBorder = (o) => {
    if (!confirmed) return selected === o.id ? C.teal : C.border;
    if (o.correct) return C.green;
    if (selected === o.id && !o.correct) return C.ruby;
    return C.border;
  };
  return (
    <div style={{ background: C.bg, minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>QUESTION 5 OF 10 · NIKHILAM QUIZ</div>
          <div style={{ background: C.rubyLight, color: C.ruby, fontSize: 12, fontWeight: 700,
            padding: "3px 12px", borderRadius: 10 }}>⏱ 00:42</div>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
          <div style={{ width: "50%", height: "100%", background: C.teal, borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: "50%", fontSize: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: i < 4 ? C.green : i === 4 ? C.teal : C.border,
              color: i <= 4 ? "#fff" : C.muted, fontWeight: 700
            }}>{i < 4 ? "✓" : i === 4 ? "5" : i + 1}</div>
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{
        width: "100%", maxWidth: 600, background: C.card,
        border: `2px solid ${C.border}`, borderRadius: 16,
        padding: "36px 40px", marginBottom: 20,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <div style={{ fontSize: 12, color: C.teal, fontFamily: "monospace", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Using Nikhilam Sutra</div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 40, fontWeight: 700, color: C.deep,
          textAlign: "center", padding: "16px 0", letterSpacing: "-1px" }}>97 × 98 = ?</div>
      </div>

      {/* Options */}
      <div style={{ width: "100%", maxWidth: 600, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {options.map(o => (
          <button key={o.id} onClick={() => !confirmed && setSelected(o.id)} style={{
            background: getOptionBg(o),
            border: `2px solid ${getOptionBorder(o)}`,
            borderRadius: 10, padding: "16px 20px", cursor: confirmed ? "default" : "pointer",
            display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s"
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: selected === o.id ? (confirmed ? (o.correct ? C.green : C.ruby) : C.teal) : C.border,
              color: selected === o.id ? "#fff" : C.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, flexShrink: 0
            }}>{o.id.toUpperCase()}</div>
            <span style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, color: C.deep }}>{o.label}</span>
            {confirmed && o.correct && <span style={{ marginLeft: "auto", fontSize: 16 }}>✅</span>}
            {confirmed && selected === o.id && !o.correct && <span style={{ marginLeft: "auto", fontSize: 16 }}>❌</span>}
          </button>
        ))}
      </div>

      {!confirmed ? (
        <button onClick={() => selected && setConfirmed(true)} style={{
          background: selected ? C.saffron : C.border, color: selected ? "#fff" : C.muted,
          border: "none", borderRadius: 10, padding: "14px 48px", fontSize: 15, fontWeight: 700,
          cursor: selected ? "pointer" : "default", transition: "all 0.15s"
        }}>Confirm Answer</button>
      ) : (
        <div style={{
          width: "100%", maxWidth: 600,
          background: selected === "c" ? C.greenLight : C.rubyLight,
          border: `2px solid ${selected === "c" ? C.green + "44" : C.ruby + "44"}`,
          borderRadius: 12, padding: "18px 24px"
        }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 16, fontWeight: 700,
            color: selected === "c" ? C.green : C.ruby, marginBottom: 6 }}>
            {selected === "c" ? "🎉 Correct! +15 XP" : "Not quite — the answer is 9506"}
          </div>
          <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.7 }}>
            <b>Solution:</b> Deficit of 97 = 3, deficit of 98 = 2.<br />
            Cross: 97 − 2 = <b>95</b> (left part) | 3 × 2 = <b>06</b> (right part) → <b>9506</b>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const views = {
    landing: <LandingView setActive={setView} />,
    curriculum: <CurriculumView setActive={setView} />,
    lesson: <LessonView setActive={setView} />,
    practice: <PracticeView />,
    games: <GamesView setActive={setView} />,
    dashboard: <DashboardView setActive={setView} />,
    leaderboard: <LeaderboardView />,
    quiz: <QuizView />,
  };
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
      <NavBar active={view} setActive={setView} />
      <div style={{ flex: 1, overflowY: "auto" }}>{views[view]}</div>
    </div>
  );
}
