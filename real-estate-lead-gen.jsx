import { useState, useEffect, useRef } from "react";

const PROPERTY_TYPES = ["Single Family", "Condo/Townhome", "Multi-Family", "Land", "Commercial"];
const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6–12 months", "Just exploring"];
const PRICE_RANGES = ["Under $200K", "$200K–$400K", "$400K–$600K", "$600K–$900K", "$900K–$1.2M", "$1.2M+"];
const MOTIVATIONS = ["Relocating", "Growing family", "Investment", "Downsizing", "First-time buyer", "Upgrading"];

const steps = [
  { id: "goal", label: "Your Goal" },
  { id: "details", label: "Property Details" },
  { id: "timeline", label: "Timeline & Budget" },
  { id: "contact", label: "Get Your Match" },
];

const AGENT_POOL = [
  { name: "Marcus Webb", title: "Senior Buyer's Agent", specialty: "First-time Buyers & Relocation", closings: 142, rating: 4.9, avatar: "MW", color: "#C8A96E" },
  { name: "Diana Reyes", title: "Investment Specialist", specialty: "Multi-Family & ROI Analysis", closings: 98, rating: 4.8, avatar: "DR", color: "#8FB8A8" },
  { name: "James Forsythe", title: "Luxury Property Expert", specialty: "High-end Residential & Commercial", closings: 67, rating: 5.0, avatar: "JF", color: "#B4A0C8" },
];

function ProgressBar({ step }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
      {steps.map((s, i) => (
        <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            width: "100%", height: 3, borderRadius: 2,
            background: i <= step ? "#C8A96E" : "rgba(255,255,255,0.1)",
            transition: "background 0.4s ease"
          }} />
          <span style={{
            fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
            color: i <= step ? "#C8A96E" : "rgba(255,255,255,0.3)",
            fontFamily: "'Crimson Pro', serif", fontWeight: 600,
            transition: "color 0.4s ease"
          }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle, multi = false }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map(opt => {
        const active = multi ? selected.includes(opt) : selected === opt;
        return (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding: "10px 18px", borderRadius: 2, border: "1px solid",
            borderColor: active ? "#C8A96E" : "rgba(255,255,255,0.15)",
            background: active ? "rgba(200,169,110,0.15)" : "transparent",
            color: active ? "#C8A96E" : "rgba(255,255,255,0.6)",
            fontFamily: "'Crimson Pro', serif", fontSize: 15,
            cursor: "pointer", transition: "all 0.2s ease",
            letterSpacing: "0.02em"
          }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontFamily: "'Crimson Pro', serif", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 2, padding: "14px 16px", color: "#fff",
          fontFamily: "'Crimson Pro', serif", fontSize: 16,
          outline: "none", transition: "border-color 0.2s",
          width: "100%", boxSizing: "border-box"
        }}
        onFocus={e => e.target.style.borderColor = "#C8A96E"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
      />
    </div>
  );
}

function AgentCard({ agent, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.5s ease", padding: 24,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.02)", borderRadius: 2
    }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: agent.color, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Crimson Pro', serif", fontWeight: 700, fontSize: 16, color: "#1a1a1a"
        }}>{agent.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", marginBottom: 2 }}>{agent.name}</div>
          <div style={{ fontSize: 12, color: "#C8A96E", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Crimson Pro', serif", marginBottom: 6 }}>{agent.title}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "'Crimson Pro', serif" }}>{agent.specialty}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Crimson Pro', serif" }}>⭐ {agent.rating}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Crimson Pro', serif" }}>{agent.closings} closings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RealEstateLead() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState(""); // buy or sell
  const [propType, setPropType] = useState([]);
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [motivation, setMotivation] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const insightRef = useRef(null);

  const canNext = () => {
    if (step === 0) return !!intent;
    if (step === 1) return propType.length > 0;
    if (step === 2) return !!timeline && !!budget;
    if (step === 3) return firstName && lastName && email && phone && city;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const matched = AGENT_POOL.filter((_, i) =>
      motivation.includes("Investment") ? i === 1 : budget.includes("1.2M") ? i === 2 : i === 0
    );
    setLeads(matched.length ? matched : [AGENT_POOL[0]]);

    // AI insight from Anthropic
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a seasoned real estate advisor. A lead just submitted this profile:
Intent: ${intent}
Property types: ${propType.join(", ")}
Timeline: ${timeline}
Budget: ${budget}
Motivations: ${motivation.join(", ")}
Location interest: ${city}

Write a 2-sentence personalized market insight and next-step recommendation for this buyer/seller. Be specific, encouraging, and actionable. No intro fluff — just the insight.`
          }]
        })
      });
      const data = await resp.json();
      const txt = data?.content?.[0]?.text || "";
      setAiInsight(txt);
    } catch {
      setAiInsight("Based on your profile, current market conditions in your area favor serious buyers who move decisively. Your agent match will help you craft a competitive offer strategy aligned with your timeline.");
    }

    setLoading(false);
    setSubmitted(true);
  };

  const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("re_leads") || "[]") : [];

  useEffect(() => {
    if (submitted) {
      const entry = { firstName, lastName, email, phone, city, intent, propType, timeline, budget, motivation, date: new Date().toISOString() };
      const arr = [...stored, entry];
      try { localStorage.setItem("re_leads", JSON.stringify(arr)); } catch {}
    }
  }, [submitted]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0e0e; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0e0e0e; }
        ::-webkit-scrollbar-thumb { background: #C8A96E; border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0e0e0e",
        display: "flex", fontFamily: "'Crimson Pro', serif"
      }}>
        {/* Left panel — brand */}
        <div style={{
          width: 340, flexShrink: 0, background: "linear-gradient(160deg, #131313 0%, #0a0a0a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "60px 40px", display: "flex", flexDirection: "column",
          justifyContent: "space-between", position: "sticky", top: 0, height: "100vh"
        }}>
          <div>
            <div style={{ width: 32, height: 2, background: "#C8A96E", marginBottom: 32 }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Find Your<br /><em>Perfect Match</em>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
              Answer a few questions and we'll connect you with a verified agent who fits your exact needs — no spam, no pressure.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { n: "4,200+", label: "Buyers Matched" },
              { n: "98%", label: "Satisfaction Rate" },
              { n: "< 2 hrs", label: "Average Response" },
            ].map(stat => (
              <div key={stat.n}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#C8A96E" }}>{stat.n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
            ESTATE · LUXURY · PRECISION
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, padding: "60px 64px", overflowY: "auto", maxWidth: 720 }}>
          {!submitted ? (
            <>
              <ProgressBar step={step} />

              <div style={{ animation: "fadeIn 0.4s ease" }} key={step}>

                {/* STEP 0 */}
                {step === 0 && (
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#fff", marginBottom: 8 }}>
                      What brings you here?
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 36 }}>Tell us your primary real estate goal.</p>
                    <div style={{ display: "flex", gap: 16 }}>
                      {["Buy", "Sell"].map(opt => (
                        <button key={opt} onClick={() => setIntent(opt)} style={{
                          flex: 1, padding: "32px 24px", border: "1px solid",
                          borderColor: intent === opt ? "#C8A96E" : "rgba(255,255,255,0.1)",
                          background: intent === opt ? "rgba(200,169,110,0.08)" : "transparent",
                          borderRadius: 2, color: intent === opt ? "#C8A96E" : "rgba(255,255,255,0.5)",
                          fontFamily: "'Playfair Display', serif", fontSize: 22,
                          cursor: "pointer", transition: "all 0.25s ease", textAlign: "center"
                        }}>
                          {opt === "Buy" ? "🏠" : "📋"}<br /><br />I want to {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#fff", marginBottom: 8 }}>
                      What type of property?
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 36 }}>Select all that apply.</p>
                    <ChipGroup options={PROPERTY_TYPES} selected={propType} multi
                      onToggle={o => setPropType(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o])} />

                    <div style={{ marginTop: 40 }}>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>What's driving this move?</p>
                      <ChipGroup options={MOTIVATIONS} selected={motivation} multi
                        onToggle={o => setMotivation(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o])} />
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#fff", marginBottom: 8 }}>
                      Timeline & Budget
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 36 }}>Help us find the right urgency and price range.</p>

                    <div style={{ marginBottom: 32 }}>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>When are you looking to close?</p>
                      <ChipGroup options={TIMELINES} selected={timeline} onToggle={setTimeline} />
                    </div>

                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Price range</p>
                      <ChipGroup options={PRICE_RANGES} selected={budget} onToggle={setBudget} />
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#fff", marginBottom: 8 }}>
                      Almost there.
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 36 }}>We'll match you with your agent within 2 hours.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <InputField label="First Name" value={firstName} onChange={setFirstName} placeholder="Jane" />
                        <InputField label="Last Name" value={lastName} onChange={setLastName} placeholder="Smith" />
                      </div>
                      <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="jane@example.com" />
                      <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="(555) 000-0000" />
                      <InputField label="City / Area of Interest" value={city} onChange={setCity} placeholder="e.g. Austin, TX" />
                    </div>
                    <p style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
                      By submitting you agree to be contacted by a licensed agent. We never sell your information.
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 48 }}>
                {step > 0
                  ? <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: 15, padding: "12px 0" }}>← Back</button>
                  : <div />}

                <button
                  disabled={!canNext() || loading}
                  onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
                  style={{
                    background: canNext() ? "#C8A96E" : "rgba(255,255,255,0.06)",
                    color: canNext() ? "#0e0e0e" : "rgba(255,255,255,0.2)",
                    border: "none", borderRadius: 2,
                    padding: "16px 40px", fontFamily: "'Playfair Display', serif",
                    fontSize: 16, cursor: canNext() ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease", letterSpacing: "0.04em"
                  }}>
                  {loading ? "Matching…" : step === 3 ? "Find My Agent →" : "Continue →"}
                </button>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div style={{ animation: "fadeIn 0.6s ease" }}>
              <div style={{ width: 32, height: 2, background: "#C8A96E", marginBottom: 32 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#fff", marginBottom: 12 }}>
                {firstName}, you're matched. ✦
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginBottom: 40, lineHeight: 1.7 }}>
                Your profile has been sent to your matched agent(s). Expect a call or email within 2 hours.
              </p>

              {/* AI Insight box */}
              {aiInsight && (
                <div style={{
                  background: "rgba(200,169,110,0.07)", border: "1px solid rgba(200,169,110,0.25)",
                  borderRadius: 2, padding: 24, marginBottom: 40
                }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8A96E", marginBottom: 10, fontWeight: 600 }}>AI Market Insight</div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.75 }}>{aiInsight}</p>
                </div>
              )}

              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Your Agent Match{leads.length > 1 ? "es" : ""}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {leads.map((a, i) => <AgentCard key={a.name} agent={a} delay={i * 200} />)}
              </div>

              {/* Summary */}
              <div style={{ marginTop: 40, padding: 24, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Your Profile Summary</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    ["Intent", intent],
                    ["Budget", budget],
                    ["Timeline", timeline],
                    ["Location", city],
                    ["Property", propType.join(", ")],
                    ["Motivation", motivation.join(", ") || "—"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => { setSubmitted(false); setStep(0); setIntent(""); setPropType([]); setTimeline(""); setBudget(""); setMotivation([]); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setCity(""); setAiInsight(""); }}
                style={{ marginTop: 32, background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: 2, padding: "12px 28px", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: 15 }}>
                Submit another lead
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
