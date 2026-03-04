import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const G = {
  bg0: "#02030a", bg1: "#070d1a", bg2: "#0d1829",
  accent: "#00f5ff", accent2: "#7b61ff", gold: "#ffd166",
  green: "#34d399", pink: "#f472b6",
  text: "#e8edf5", muted: "#7a8baa", border: "rgba(148,163,184,0.18)",
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:${G.bg0};color:${G.text};font-family:'DM Sans',sans-serif;min-height:100vh}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${G.bg0}}::-webkit-scrollbar-thumb{background:${G.accent}33;border-radius:3px}

  .app-wrap{min-height:100vh;display:flex;flex-direction:column;
    background:radial-gradient(ellipse 80% 55% at 50% -10%,#0e2a4a88 0%,transparent 70%),
    radial-gradient(ellipse 40% 30% at 85% 95%,#7b61ff1a 0%,transparent 60%),${G.bg0}}

  /* Header */
  .hdr{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.8rem;
    border-bottom:1px solid ${G.border};backdrop-filter:blur(14px);
    background:rgba(7,13,26,0.75);position:sticky;top:0;z-index:200}
  .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.3rem;letter-spacing:-.02em;
    background:linear-gradient(105deg,${G.accent},#0ea5e9,${G.accent2});
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .logo-2{-webkit-text-fill-color:${G.gold};color:${G.gold}}

  /* Step nav */
  .snav{display:flex;border-bottom:1px solid ${G.border};overflow-x:auto;
    background:rgba(7,13,26,0.5);backdrop-filter:blur(8px);scrollbar-width:none}
  .snav::-webkit-scrollbar{display:none}
  .sbtn{flex-shrink:0;padding:.65rem 1.2rem;background:none;border:none;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:500;color:${G.muted};
    border-bottom:2px solid transparent;transition:all .2s;white-space:nowrap}
  .sbtn:hover{color:${G.text}}
  .sbtn.active{color:${G.accent};border-bottom-color:${G.accent};background:${G.accent}09}
  .sbtn.done{color:#5eead4}
  .snum{display:inline-flex;align-items:center;justify-content:center;
    width:18px;height:18px;border-radius:50%;background:${G.bg2};
    border:1px solid ${G.border};font-size:.68rem;font-weight:700;margin-right:.4rem;transition:all .2s}
  .sbtn.active .snum{background:${G.accent};color:${G.bg0};border-color:${G.accent}}
  .sbtn.done .snum{background:${G.accent}33;color:${G.accent};border-color:${G.accent}55}

  /* Layout */
  .main{flex:1;padding:1.8rem;max-width:860px;margin:0 auto;width:100%}

  /* Typography */
  .ptitle{font-family:'Syne',sans-serif;font-weight:800;font-size:1.9rem;
    letter-spacing:-.03em;line-height:1.15;margin-bottom:.35rem}
  .hl{color:${G.accent}}
  .sub{color:${G.muted};font-size:.92rem;margin-bottom:1.6rem;font-weight:300;line-height:1.55}

  /* Cards */
  .card{background:linear-gradient(135deg,rgba(13,24,41,.92),rgba(7,13,26,.96));
    border:1px solid ${G.border};border-radius:16px;padding:1.3rem 1.4rem;
    margin-bottom:.9rem;box-shadow:0 16px 50px rgba(0,0,0,.4)}
  .card-glow{border-color:${G.accent}44;box-shadow:0 0 0 1px ${G.accent}1a,0 16px 50px rgba(0,245,255,.07)}
  .card-gold{border-color:${G.gold}33}
  .card-purple{border-color:${G.accent2}44}
  .card-green{border-color:${G.green}44}

  /* Inputs */
  .lbl{display:block;font-size:.74rem;font-weight:600;letter-spacing:.08em;
    text-transform:uppercase;color:${G.muted};margin-bottom:.45rem}
  textarea,input[type=password],input[type=text]{width:100%;background:rgba(2,3,10,.75);
    border:1px solid ${G.border};border-radius:10px;padding:.8rem .95rem;color:${G.text};
    font-family:'DM Sans',sans-serif;font-size:.93rem;resize:vertical;outline:none;transition:border-color .2s}
  textarea:focus,input:focus{border-color:${G.accent}66}
  textarea::placeholder,input::placeholder{color:${G.muted}}

  /* Buttons */
  .btn{display:inline-flex;align-items:center;gap:.38rem;padding:.62rem 1.35rem;
    border-radius:999px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:.88rem;
    cursor:pointer;border:none;transition:all .18s;white-space:nowrap;text-decoration:none}
  .btn-p{background:linear-gradient(135deg,${G.accent},#00c3ff);color:${G.bg0};
    box-shadow:0 4px 18px rgba(0,245,255,.22)}
  .btn-p:hover{filter:brightness(1.08);transform:translateY(-1px)}
  .btn-p:disabled{opacity:.38;cursor:not-allowed;transform:none}
  .btn-g{background:transparent;color:${G.muted};border:1px solid ${G.border}}
  .btn-g:hover{border-color:${G.accent}55;color:${G.text}}
  .btn-g:disabled{opacity:.4;cursor:not-allowed}
  .btn-sm{padding:.38rem .85rem;font-size:.78rem}
  .btn-purple{background:linear-gradient(135deg,${G.accent2},#a78bfa);color:#fff}
  .btn-gold{background:linear-gradient(135deg,${G.gold},#f59e0b);color:${G.bg0}}

  /* Pills */
  .pill{display:inline-block;padding:.18rem .6rem;border-radius:999px;font-size:.7rem;
    font-weight:700;letter-spacing:.05em;text-transform:uppercase}
  .p-teal{background:rgba(15,118,110,.2);color:#5eead4;border:1px solid rgba(45,212,191,.3)}
  .p-purple{background:rgba(123,97,255,.2);color:#a78bfa;border:1px solid rgba(139,92,246,.3)}
  .p-gold{background:rgba(255,209,102,.15);color:${G.gold};border:1px solid rgba(255,209,102,.3)}
  .p-reach{background:rgba(244,114,182,.15);color:#f9a8d4;border:1px solid rgba(244,114,182,.3)}
  .p-match{background:rgba(52,211,153,.15);color:#6ee7b7;border:1px solid rgba(52,211,153,.3)}
  .p-safety{background:rgba(96,165,250,.15);color:#93c5fd;border:1px solid rgba(96,165,250,.3)}

  /* Score bar */
  .sbar-wrap{display:flex;align-items:center;gap:.75rem;margin-bottom:.55rem}
  .sbar-bg{flex:1;height:5px;border-radius:3px;background:${G.bg2};overflow:hidden}
  .sbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,${G.accent},${G.accent2});transition:width .8s ease}
  .snum{font-family:'Syne',sans-serif;font-size:1.05rem;font-weight:800;color:${G.accent};min-width:38px;text-align:right}

  /* Progress */
  .prog-bg{height:7px;border-radius:4px;background:${G.bg2};overflow:hidden;margin-bottom:.35rem}
  .prog-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,${G.accent},${G.accent2});transition:width .5s ease}

  /* Expander */
  .exp{border:1px solid ${G.border};border-radius:14px;overflow:hidden;margin-bottom:.75rem;
    background:rgba(13,24,41,.5);transition:border-color .2s}
  .exp:hover{border-color:${G.accent}33}
  .exp-head{width:100%;display:flex;align-items:center;justify-content:space-between;
    padding:.9rem 1.1rem;background:none;border:none;cursor:pointer;text-align:left;
    color:${G.text};font-family:'DM Sans',sans-serif;font-size:.94rem;font-weight:500}
  .exp-head:hover{background:${G.accent}06}
  .exp-chev{transition:transform .2s;color:${G.muted};font-size:.75rem}
  .exp-chev.open{transform:rotate(180deg)}
  .exp-body{padding:0 1.1rem 1.1rem}

  /* Section head */
  .sh{font-family:'Syne',sans-serif;font-weight:700;font-size:.76rem;
    letter-spacing:.1em;text-transform:uppercase;color:${G.muted};margin:1.1rem 0 .55rem;
    display:flex;align-items:center;gap:.5rem}
  .sh::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,${G.border},transparent)}

  /* Check item */
  .ci{display:flex;align-items:flex-start;gap:.7rem;padding:.65rem 0;
    border-bottom:1px solid ${G.border};cursor:pointer;transition:color .15s}
  .ci:last-child{border-bottom:none}
  .ci:hover{color:${G.accent}}
  .cbox{width:17px;height:17px;border-radius:4px;border:1.5px solid ${G.muted};flex-shrink:0;
    display:flex;align-items:center;justify-content:center;background:transparent;transition:all .15s;margin-top:2px}
  .cbox.on{background:${G.accent};border-color:${G.accent}}
  .ctick{color:${G.bg0};font-size:10px;font-weight:900}

  /* Stat box */
  .stat{background:${G.bg2};border:1px solid ${G.border};border-radius:9px;padding:.6rem .75rem}
  .stat-l{font-size:.68rem;color:${G.muted};text-transform:uppercase;letter-spacing:.06em;margin-bottom:.18rem}
  .stat-v{font-size:.9rem;font-weight:500;color:${G.text}}
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:.65rem;margin-top:.9rem}

  /* Misc */
  .err{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:10px;
    padding:.75rem .95rem;color:#fca5a5;font-size:.86rem;margin-bottom:.9rem}
  .info{background:${G.accent}0d;border:1px solid ${G.accent}25;border-radius:10px;
    padding:.75rem .95rem;color:${G.accent};font-size:.86rem;margin-bottom:.9rem}
  .warn{background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:10px;
    padding:.75rem .95rem;color:${G.gold};font-size:.86rem;margin-bottom:.9rem}
  .nav-row{display:flex;gap:.7rem;margin-top:1.8rem;flex-wrap:wrap;align-items:center}
  .radio-group{display:flex;gap:.55rem;flex-wrap:wrap;margin-bottom:1.4rem}
  .rpill{padding:.42rem .95rem;border-radius:999px;border:1px solid ${G.border};
    background:${G.bg2};color:${G.muted};font-size:.81rem;font-weight:500;cursor:pointer;transition:all .18s}
  .rpill:hover{border-color:${G.accent}55;color:${G.text}}
  .rpill.on{border-color:${G.accent};color:${G.accent};background:${G.accent}12}

  /* Animations */
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fadeUp .35s ease forwards}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
  .pls{animation:pulse 1.8s ease infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spin{width:17px;height:17px;border-radius:50%;border:2px solid transparent;
    border-top-color:${G.bg0};animation:spin .7s linear infinite}
  .spin-lg{width:34px;height:34px;border-width:3px;border-top-color:${G.accent};
    margin:2rem auto;display:block}

  /* Vibe quiz */
  .vq-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:.6rem;margin-bottom:1rem}
  .vq-opt{padding:.75rem 1rem;border-radius:12px;border:1px solid ${G.border};
    background:${G.bg2};cursor:pointer;transition:all .18s;text-align:center}
  .vq-opt:hover{border-color:${G.accent}55}
  .vq-opt.on{border-color:${G.accent};background:${G.accent}12;color:${G.accent}}
  .vq-emoji{font-size:1.4rem;margin-bottom:.3rem}
  .vq-label{font-size:.82rem;font-weight:500}

  /* Timeline */
  .tl-year{display:flex;gap:1rem;margin-bottom:1.4rem;align-items:flex-start}
  .tl-dot{width:36px;height:36px;border-radius:50%;background:${G.accent}22;border:2px solid ${G.accent}55;
    display:flex;align-items:center;justify-content:center;flex-shrink:0;
    font-family:'Syne',sans-serif;font-weight:800;font-size:.72rem;color:${G.accent}}
  .tl-line{width:2px;background:linear-gradient(${G.accent}44,transparent);
    flex-shrink:0;margin:36px 0 0 17px;min-height:40px}

  /* Comparison */
  .cmp-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  @media(max-width:560px){.cmp-grid{grid-template-columns:1fr}}

  /* Banner */
  .banner{border-radius:16px;padding:1.2rem 1.4rem;margin-bottom:1.4rem;
    background:linear-gradient(135deg,${G.accent}12,${G.accent2}12);
    border:1px solid ${G.accent}33}

  /* Profile print */
  @media print{
    .hdr,.snav,.nav-row,.no-print{display:none!important}
    .app-wrap{background:white!important}
    .card,.exp{border:1px solid #ddd!important;background:white!important;box-shadow:none!important}
    body,*{color:#111!important;-webkit-text-fill-color:#111!important}
    .ptitle,.logo,.snum,.hl{color:#0066cc!important;-webkit-text-fill-color:#0066cc!important}
  }
`;

// ─── Storage ──────────────────────────────────────────────────────────────────
const SK = "waypoint_v1";
function load() {
  try { const r = sessionStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; }
}
function save(d) { try { sessionStorage.setItem(SK, JSON.stringify(d)); } catch {} }
function initData() {
  return load() || {
    raw_likes: [], detail_level: "Balanced Insights (Medium)",
    vibe_answers: {}, woven_paths: [], wildcard_major: null,
    college_list: [], selected_school: null,
    application_progress: {}, application_notes: {},
    page4_ai: {}, page5_ai: {},
    roadmap: null, banner_msg: null, disclaimer_accepted: false,
  };
}

// ─── Claude API ───────────────────────────────────────────────────────────────
async function ai(system, prompt, { tokens = 2800, temp = 0.5 } = {}) {
  const r = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: tokens, temperature: temp,
      system, messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  const txt = (d.content || []).map(b => b.text || "").join("");
  let c = txt.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(c); } catch {}
  const am = c.match(/\[\s*[\s\S]*\]\s*$/); if (am) { try { return JSON.parse(am[0]); } catch {} }
  const om = c.match(/\{[\s\S]*\}/); if (om) { try { const o = JSON.parse(om[0]); return o; } catch {} }
  const s = c.indexOf("["), e = c.lastIndexOf("]");
  if (s !== -1 && e > s) { try { return JSON.parse(c.slice(s, e + 1)); } catch {} }
  const s2 = c.indexOf("{"), e2 = c.lastIndexOf("}");
  if (s2 !== -1 && e2 > s2) { try { return JSON.parse(c.slice(s2, e2 + 1)); } catch {} }
  throw new Error("No JSON found in: " + c.slice(0, 200));
}

const SYS_JSON_ARR = `You are a helpful assistant. Output ONLY a valid JSON array. Start with [ end with ]. No prose, no markdown, no explanation.`;
const SYS_JSON_OBJ = `You are a helpful assistant. Output ONLY a valid JSON object. Start with { end with }. No prose, no markdown, no explanation.`;

// ═══════════════════════════════════════════════════════════════════════════════
// SAFETY LAYER
// ═══════════════════════════════════════════════════════════════════════════════

// Pre-flight interest check — runs before any generation
async function runSafetyCheck(interests) {
  const SYS = `You are a content safety classifier for a high school student app.
Classify a list of student interests. Be charitable — assume positive intent for ambiguous items.
Output ONLY a raw JSON object: { "status": "safe"|"ambiguous"|"illegal"|"distress", "flags": [], "reframes": {}, "message": "" }`;

  const prompt = `Student interests to classify: ${JSON.stringify(interests)}

Classification rules:
- "safe": all interests are clearly benign hobbies, activities, or topics
- "ambiguous": some interests could be innocent but sound concerning (e.g. "fighting" = could be martial arts, "hacking" = could be ethical/security, "explosives" = could be chemistry/special effects). Reframe these charitably.
- "illegal": interests explicitly describe clearly illegal activities (e.g. "stealing", "drug dealing", "vandalism"). Flag specific items.
- "distress": interests suggest the student may be struggling emotionally (e.g. "hurting myself", "not caring anymore", "disappearing", "being alone forever", "ending things"). This takes priority over all other classifications.

For "ambiguous": populate reframes as {"original interest": "charitable reframe"} for each flagged item.
For "illegal": list the specific flagged items in flags[]. Set message to a gentle redirect.
For "distress": set message to a warm, caring acknowledgment. Do NOT mention college.
For "safe": flags and reframes are empty, message is empty string.`;

  try {
    const result = await ai(SYS, prompt, { tokens: 600, temp: 0.1 });
    return result;
  } catch {
    return { status: "safe", flags: [], reframes: {}, message: "" };
  }
}

// ─── Distress Screen ──────────────────────────────────────────────────────────
function DistressScreen({ message, onContinue }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(2,3,10,0.97)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "1.5rem"
    }}>
      <div style={{
        maxWidth: "520px", width: "100%",
        background: "linear-gradient(135deg,rgba(13,24,41,.98),rgba(7,13,26,.99))",
        border: "1px solid rgba(52,211,153,0.3)", borderRadius: "20px",
        padding: "2rem", boxShadow: "0 30px 80px rgba(0,0,0,0.7)"
      }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center" }}>💚</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.2rem",
          color: "#34d399", marginBottom: "1rem", textAlign: "center" }}>
          Hey — we see you.
        </div>
        <div style={{ fontSize: ".95rem", color: "#e8edf5", lineHeight: 1.7, marginBottom: "1.5rem", textAlign: "center" }}>
          {message || "Some of what you wrote made us want to pause and check in. You don't have to figure everything out right now — including college."}
        </div>
        <div style={{ fontSize: ".88rem", color: "#7a8baa", marginBottom: "1.5rem", textAlign: "center" }}>
          If you're going through something hard, there are real people ready to listen:
        </div>

        {/* Resources */}
        {[
          { label: "988 Suicide & Crisis Lifeline", detail: "Call or text 988 · 24/7", color: "#34d399", href: "https://988lifeline.org" },
          { label: "Crisis Text Line", detail: "Text HOME to 741741 · Free, 24/7", color: "#00f5ff", href: "https://www.crisistextline.org" },
          { label: "Teen Line", detail: "Text TEEN to 839863 · By teens, for teens", color: "#a78bfa", href: "https://teenlineonline.org" },
        ].map((r, i) => (
          <a key={i} href={r.href} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: ".9rem",
            background: `${r.color}0d`, border: `1px solid ${r.color}33`,
            borderRadius: "12px", padding: ".85rem 1rem", marginBottom: ".6rem",
            textDecoration: "none", transition: "all .18s"
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: ".9rem", color: r.color }}>{r.label}</div>
              <div style={{ fontSize: ".78rem", color: "#7a8baa" }}>{r.detail}</div>
            </div>
          </a>
        ))}

        <div style={{ textAlign: "center", marginTop: "1rem", padding: ".75rem 1rem",
          background: "rgba(148,163,184,0.06)", borderRadius: "10px",
          fontSize: ".82rem", color: "#7a8baa" }}>
          🏫 Your school counselor is also there for you — you can talk to them in person tomorrow.
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button onClick={onContinue} style={{
            background: "transparent", border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: "999px", padding: ".5rem 1.2rem",
            color: "#7a8baa", fontFamily: "'DM Sans',sans-serif", fontSize: ".8rem",
            cursor: "pointer"
          }}>
            I'm okay — continue to Waypoint
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Disclaimer Modal ─────────────────────────────────────────────────────────
function DisclaimerModal({ onAccept }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(2,3,10,0.96)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: "1.5rem"
    }}>
      <div style={{
        maxWidth: "500px", width: "100%",
        background: "linear-gradient(135deg,rgba(13,24,41,.98),rgba(7,13,26,.99))",
        border: "1px solid rgba(0,245,255,0.25)", borderRadius: "20px",
        padding: "2rem", boxShadow: "0 30px 80px rgba(0,0,0,0.7)"
      }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.25rem",
          color: "#00f5ff", marginBottom: "1.2rem" }}>
          Welcome to Waypoint 🧭
        </div>
        <div style={{ fontSize: ".9rem", color: "#e8edf5", lineHeight: 1.7, marginBottom: "1.2rem" }}>
          Waypoint uses AI to help you explore majors, find colleges, and build a college plan personalized to your interests.
        </div>
        <div style={{
          background: "rgba(255,209,102,0.07)", border: "1px solid rgba(255,209,102,0.25)",
          borderRadius: "12px", padding: "1rem 1.1rem", marginBottom: "1.4rem"
        }}>
          <div style={{ fontWeight: 700, fontSize: ".82rem", color: "#ffd166",
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".6rem" }}>
            ⚠ Important — Please Read
          </div>
          {[
            "AI-generated content can contain errors. All college data — tuition, acceptance rates, deadlines, and scholarships — are estimates only.",
            "Always verify important information directly with each college's official website before making any decisions.",
            "Waypoint is a starting point for exploration, not a substitute for your school counselor or a certified college advisor.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: ".6rem", fontSize: ".84rem",
              color: "#e8edf5", marginBottom: ".5rem", lineHeight: 1.55 }}>
              <span style={{ color: "#ffd166", flexShrink: 0 }}>•</span>{t}
            </div>
          ))}
        </div>
        <button onClick={onAccept} style={{
          width: "100%", padding: ".75rem",
          background: "linear-gradient(135deg,#00f5ff,#00c3ff)",
          border: "none", borderRadius: "12px",
          fontFamily: "'Syne',sans-serif", fontWeight: 800,
          fontSize: "1rem", color: "#02030a", cursor: "pointer"
        }}>
          I understand — Let's go 🧭
        </button>
      </div>
    </div>
  );
}

// ─── Verify Badge — inline on all AI-generated facts ─────────────────────────
function VerifyBadge({ href }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: ".25rem",
      fontSize: ".67rem", color: "#ffd166", background: "rgba(255,209,102,0.1)",
      border: "1px solid rgba(255,209,102,0.25)", borderRadius: "999px",
      padding: ".1rem .5rem", marginLeft: ".4rem", verticalAlign: "middle",
      fontWeight: 600, letterSpacing: ".03em", cursor: href ? "pointer" : "default"
    }}
      onClick={href ? () => window.open(href, "_blank") : undefined}
      title="AI estimate — verify with official source">
      ⚠ verify
    </span>
  );
}

// ─── Ambiguous reframe banner ─────────────────────────────────────────────────
function AmbiguousBanner({ reframes, onDismiss }) {
  if (!reframes || Object.keys(reframes).length === 0) return null;
  return (
    <div style={{
      background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.2)",
      borderRadius: "12px", padding: ".9rem 1.1rem", marginBottom: "1.2rem"
    }}>
      <div style={{ fontWeight: 700, fontSize: ".78rem", color: "#00f5ff",
        textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>
        🔍 A note on your interests
      </div>
      <div style={{ fontSize: ".84rem", color: "#e8edf5", lineHeight: 1.6, marginBottom: ".65rem" }}>
        We've interpreted some of your interests charitably so they work in a college context:
      </div>
      {Object.entries(reframes).map(([orig, reframe], i) => (
        <div key={i} style={{ display: "flex", gap: ".5rem", fontSize: ".82rem",
          color: "#7a8baa", marginBottom: ".3rem" }}>
          <span style={{ color: "#7a8baa", textDecoration: "line-through" }}>{orig}</span>
          <span style={{ color: "#00f5ff" }}>→</span>
          <span style={{ color: "#e8edf5" }}>{reframe}</span>
        </div>
      ))}
      <button onClick={onDismiss} style={{ marginTop: ".5rem", background: "transparent",
        border: "none", color: "#7a8baa", fontSize: ".76rem", cursor: "pointer",
        textDecoration: "underline" }}>Got it, continue</button>
    </div>
  );
}

// ─── Illegal block screen ─────────────────────────────────────────────────────
function IllegalScreen({ flags, message, onEdit }) {
  return (
    <div style={{
      background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem"
    }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800,
        color: "#fca5a5", marginBottom: ".75rem" }}>
        ✋ Some interests need a rethink
      </div>
      <div style={{ fontSize: ".9rem", color: "#e8edf5", lineHeight: 1.65, marginBottom: "1rem" }}>
        {message || "Some of what you entered isn't something we can explore here. That's okay — try describing what draws you to it, or swap it for something related that we can work with."}
      </div>
      {flags.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: ".76rem", fontWeight: 700, color: "#fca5a5",
            textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".4rem" }}>
            Flagged items
          </div>
          {flags.map((f, i) => (
            <span key={i} style={{ display: "inline-block", background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)", borderRadius: "999px",
              padding: ".15rem .6rem", fontSize: ".78rem", color: "#fca5a5",
              marginRight: ".4rem", marginBottom: ".3rem" }}>
              {f}
            </span>
          ))}
        </div>
      )}
      <div style={{ fontSize: ".82rem", color: "#7a8baa", marginBottom: "1rem", fontStyle: "italic" }}>
        💡 Tip: Instead of the flagged items, try describing what excites you about them — the feeling, the skill, or the outcome.
      </div>
      <button onClick={onEdit} style={{
        padding: ".55rem 1.2rem", borderRadius: "999px",
        background: "transparent", border: "1px solid rgba(239,68,68,0.4)",
        color: "#fca5a5", fontFamily: "'DM Sans',sans-serif",
        fontWeight: 600, fontSize: ".85rem", cursor: "pointer"
      }}>
        ← Edit my interests
      </button>
    </div>
  );
}


// ─── Shared helpers ───────────────────────────────────────────────────────────
function pillType(t = "") {
  const l = t.toLowerCase();
  if (l.includes("reach")) return "p-reach";
  if (l.includes("safety")) return "p-safety";
  return "p-match";
}

function Expander({ title, badge, open: defOpen = false, children }) {
  const [open, setOpen] = useState(defOpen);
  return (
    <div className="exp">
      <button className="exp-head" onClick={() => setOpen(o => !o)}>
        <span style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
          {title}{badge}
        </span>
        <span className={`exp-chev ${open ? "open" : ""}`}>▼</span>
      </button>
      {open && <div className="exp-body fu">{children}</div>}
    </div>
  );
}

function ScoreBar({ score }) {
  return (
    <div className="sbar-wrap">
      <div className="sbar-bg"><div className="sbar-fill" style={{ width: `${score}%` }} /></div>
      <div className="snum">{score}%</div>
    </div>
  );
}

function SH({ children }) { return <div className="sh">{children}</div>; }

function Spinner({ lg }) { return <div className={lg ? "spin-lg pls" : "spin"} />; }

function CheckRow({ label, detail, checked, cat, urgent, onToggle }) {
  const catColor = { essay: G.accent2, admin: G.accent, test: G.gold, rec: G.pink, financial: G.gold, portfolio: G.green };
  const catLabel = { essay: "Essay", admin: "Admin", test: "Test", rec: "Rec", financial: "Aid", portfolio: "Portfolio" };
  const cc = catColor[cat] || G.muted;
  return (
    <div className="ci" onClick={onToggle}>
      <div className={`cbox ${checked ? "on" : ""}`}>{checked && <span className="ctick">✓</span>}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".45rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: ".88rem", fontWeight: 500, textDecoration: checked ? "line-through" : "none", color: checked ? G.muted : G.text }}>{label}</span>
          {cat && <span style={{ fontSize: ".65rem", fontWeight: 700, padding: ".08rem .42rem", borderRadius: "999px", background: `${cc}1a`, color: cc, border: `1px solid ${cc}44` }}>{catLabel[cat] || cat}</span>}
          {urgent && <span style={{ fontSize: ".65rem", fontWeight: 700, padding: ".08rem .42rem", borderRadius: "999px", background: "rgba(239,68,68,.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,.25)" }}>Urgent</span>}
        </div>
        {detail && <div style={{ fontSize: ".78rem", color: G.muted, marginTop: ".18rem", lineHeight: 1.5 }}>{detail}</div>}
      </div>
    </div>
  );
}

// ─── Tab bar helper ───────────────────────────────────────────────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", marginBottom: "1.1rem", borderBottom: `1px solid ${G.border}`, paddingBottom: ".75rem" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: ".38rem .85rem", borderRadius: "999px", border: active === t.id ? "none" : `1px solid ${G.border}`,
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: ".8rem", fontWeight: 600,
          background: active === t.id ? G.accent : "transparent",
          color: active === t.id ? G.bg0 : G.muted, transition: "all .15s",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [data, setData] = useState(initData);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(!data.disclaimer_accepted);
  const [distressData, setDistressData] = useState(null);

  const upd = (patch) => setData(prev => { const n = { ...prev, ...patch }; save(n); return n; });

  const STEPS = [
    { label: "Interests", icon: "✦" },
    { label: "Vibe Quiz", icon: "🎯" },
    { label: "Majors", icon: "🎓" },
    { label: "Colleges", icon: "🏛" },
    { label: "Roadmap", icon: "🗺" },
    { label: "Apply", icon: "✅" },
    { label: "My Profile", icon: "⭐" },
  ];

  const done = (i) => {
    if (i === 0) return data.raw_likes.length > 0;
    if (i === 1) return Object.keys(data.vibe_answers).length >= 4;
    if (i === 2) return data.woven_paths.length > 0;
    if (i === 3) return data.college_list.length > 0;
    if (i === 4) return !!data.roadmap;
    if (i === 5) return !!data.selected_school;
    return false;
  };

  const sharedProps = { data, upd, setPage, loading, setLoading, error, setError, setDistressData };

  return (
    <>
      <style>{CSS}</style>
      <div className="app-wrap">
        {showDisclaimer && <DisclaimerModal onAccept={() => { setShowDisclaimer(false); upd({ disclaimer_accepted: true }); }} />}
      {distressData && <DistressScreen message={distressData.message} onContinue={() => setDistressData(null)} />}
      <header className="hdr">
          <div className="logo">Way<span className="logo-2">point</span></div>
          <div style={{ fontSize: ".72rem", color: G.muted }}>Navigate your future · powered by Claude</div>
        </header>
        <nav className="snav">
          {STEPS.map((s, i) => (
            <button key={i} className={`sbtn ${page === i ? "active" : ""} ${done(i) && page !== i ? "done" : ""}`} onClick={() => setPage(i)}>
              <span className="snum">{done(i) && page !== i ? "✓" : i + 1}</span>{s.icon} {s.label}
            </button>
          ))}
        </nav>
        <main className="main">
          {error && <div className="err">⚠ {error} <button className="btn btn-sm btn-g" style={{ marginLeft: ".5rem" }} onClick={() => setError(null)}>dismiss</button></div>}
          {page === 0 && <PageInterests {...sharedProps} />}
          {page === 1 && <PageVibeQuiz {...sharedProps} />}
          {page === 2 && <PageMajors {...sharedProps} />}
          {page === 3 && <PageColleges {...sharedProps} />}
          {page === 4 && <PageRoadmap {...sharedProps} />}
          {page === 5 && <PageApply {...sharedProps} />}
          {page === 6 && <PageProfile {...sharedProps} />}
        </main>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 0 — INTERESTS
// ═══════════════════════════════════════════════════════════════════════════════
function PageInterests({ data, upd, setPage, loading, setLoading, setError, setDistressData }) {
  const [likes, setLikes] = useState(data.raw_likes.join("\n"));
  const [detail, setDetail] = useState(data.detail_level || "Balanced Insights (Medium)");
  const OPTS = ["Quick Ideas (Fast)", "Balanced Insights (Medium)", "Deep Dive (Detailed)"];

  const [safetyResult, setSafetyResult] = useState(null);
  const [checkingSafety, setCheckingSafety] = useState(false);

  const go = async () => {
    const raw_likes = likes.split("\n").map(x => x.trim()).filter(Boolean);
    if (!raw_likes.length) { setError("Add at least one thing you love!"); return; }
    setError(null);
    setCheckingSafety(true);
    setSafetyResult(null);

    // Pre-flight safety check
    const safety = await runSafetyCheck(raw_likes);
    setCheckingSafety(false);

    if (safety.status === "distress") {
      setDistressData(safety);
      return;
    }
    if (safety.status === "illegal") {
      setSafetyResult(safety);
      return;
    }
    if (safety.status === "ambiguous") {
      setSafetyResult(safety);
      // Still proceed — ambiguous just shows a reframe banner on next page
    }

    upd({ raw_likes, detail_level: detail, woven_paths: [], wildcard_major: null, banner_msg: null, safety_reframes: safety.reframes || {} });
    setPage(1);
  };

  return (
    <div className="fu">
      <div className="ptitle">My <span className="hl">Favorite</span> Things</div>
      <div className="sub">Type whatever you love — even if it feels random. One per line.</div>
      <div className="card card-glow">
        <label className="lbl">My interests</label>
        <textarea rows={10}
          placeholder={"scuba diving\nsailing\ntraveling to far away places\nmeeting new people\nflying\nboxing"}
          value={likes} onChange={e => setLikes(e.target.value)} />
      </div>
      <div>
        <label className="lbl" style={{ marginBottom: ".6rem", display: "block" }}>How deep should your results be?</label>
        <div className="radio-group">
          {OPTS.map(o => <div key={o} className={`rpill ${detail === o ? "on" : ""}`} onClick={() => setDetail(o)}>{o}</div>)}
        </div>
      </div>
      {safetyResult?.status === "illegal" && (
        <IllegalScreen flags={safetyResult.flags} message={safetyResult.message} onEdit={() => setSafetyResult(null)} />
      )}
      <div className="nav-row">
        <button className="btn btn-p" onClick={go} disabled={checkingSafety}>
          {checkingSafety ? <><span className="spin" style={{borderTopColor:"#02030a"}}/>Checking…</> : "Next → Vibe Quiz ✦"}
        </button>
        {data.woven_paths.length > 0 && <button className="btn btn-g" onClick={() => setPage(2)}>Skip → See Majors</button>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — VIBE QUIZ
// ═══════════════════════════════════════════════════════════════════════════════
const VIBE_QS = [
  {
    id: "size", q: "What school size feels right?",
    opts: [{ e: "🏘", l: "Small (<3k)" }, { e: "🏫", l: "Medium (3–15k)" }, { e: "🏙", l: "Large (15–40k)" }, { e: "🌆", l: "Huge (40k+)" }]
  },
  {
    id: "location", q: "Where do you want to be?",
    opts: [{ e: "🏝", l: "Beach / Coastal" }, { e: "🏔", l: "Mountains" }, { e: "🌆", l: "Big City" }, { e: "🌿", l: "College Town" }]
  },
  {
    id: "vibe", q: "What campus culture fits you?",
    opts: [{ e: "🔬", l: "Research-heavy" }, { e: "🎨", l: "Arts & creative" }, { e: "🏈", l: "Big sports culture" }, { e: "🤝", l: "Tight-knit community" }]
  },
  {
    id: "learning", q: "How do you learn best?",
    opts: [{ e: "📖", l: "Small seminars" }, { e: "🎤", l: "Big lectures" }, { e: "🛠", l: "Hands-on projects" }, { e: "🌐", l: "Online / hybrid" }]
  },
  {
    id: "priority", q: "What matters most after college?",
    opts: [{ e: "💰", l: "Earning potential" }, { e: "🌍", l: "Making an impact" }, { e: "🎭", l: "Creative freedom" }, { e: "✈️", l: "Travel & adventure" }]
  },
];

function PageVibeQuiz({ data, upd, setPage, loading, setLoading, setError }) {
  const [ans, setAns] = useState(data.vibe_answers || {});

  const pick = (qid, val) => {
    const next = { ...ans, [qid]: val };
    setAns(next);
    upd({ vibe_answers: next });
  };

  const ready = Object.keys(ans).length >= 4;

  const goGenerate = async () => {
    setError(null);
    setLoading(true);
    const dc = { "Quick Ideas (Fast)": { base: 1, minors: 1, jobs: 1, story: "2-3 vivid sentences" }, "Balanced Insights (Medium)": { base: 2, minors: 2, jobs: 2, story: "4-5 vivid sentences" }, "Deep Dive (Detailed)": { base: 3, minors: 3, jobs: 3, story: "6-8 vivid sentences" } };
    const cfg = dc[data.detail_level] || dc["Balanced Insights (Medium)"];
    const SYS = `You are a college major advisor speaking to a curious 15-year-old. Use vivid, plain language they'd find exciting. Output ONLY a raw JSON array starting with [ and ending with ].`;
    const prompt = `Student interests: ${JSON.stringify(data.raw_likes)}
Student vibe preferences: ${JSON.stringify(ans)}

Propose exactly 2 creative but realistic college majors that connect these interests in surprising ways.

fit_score rules (use the FULL range honestly):
70-75 = only 1-2 interests align loosely
76-84 = core themes match, some stretching
85-91 = most interests connect naturally  
92-95 = nearly every interest maps directly

Return JSON array of exactly 2 objects:
[{
  "custom_major": "Creative Major Name",
  "fit_score": 84,
  "simple_description": "Two punchy sentences a 15-year-old finds exciting.",
  "base_majors": [{"name":"Real Major","examples":["Univ 1","Univ 2"],"why_close":"one sentence"}],
  "suggested_minors": [{"name":"Minor","why_bridge":"one sentence"}],
  "job_verticals": [{"title":"Job Title","grad_story":"A recent grad now does X at Y.","day_in_life_story":"${cfg.story}","salary_range":"Entry: $XX,000–$XX,000; Mid: $XX,000+","job_outlook":"one sentence"}]
}]
Include ${cfg.base} base major(s), ${cfg.minors} minor(s), ${cfg.jobs} job vertical(s) per major.`;

    try {
      const parsed = await ai(SYS, prompt, { temp: 0.72 });
      const paths = Array.isArray(parsed) ? parsed : [parsed];

      // Also generate a warm banner message
      const bannerSYS = `You are an encouraging mentor. Output ONLY a JSON object: {"message": "string"}`;
      const bannerPrompt = `Student interests: ${JSON.stringify(data.raw_likes)}. Write a warm 1-2 sentence personalized message starting with "Based on your love of..." that highlights what's unique about them and gets them excited about their results.`;
      let banner_msg = null;
      try { const b = await ai(bannerSYS, bannerPrompt, { tokens: 200, temp: 0.8 }); banner_msg = b.message || null; } catch {}

      upd({ woven_paths: paths, banner_msg, wildcard_major: null });
      setPage(2);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fu">
      <div className="ptitle"><span className="hl">Vibe</span> Quiz</div>
      <div className="sub">5 quick questions so we find colleges that actually feel right — not just academically, but culturally.</div>

      {VIBE_QS.map(q => (
        <div key={q.id} style={{ marginBottom: "1.4rem" }}>
          <label className="lbl" style={{ marginBottom: ".65rem", display: "block" }}>{q.q}</label>
          <div className="vq-grid">
            {q.opts.map(o => (
              <div key={o.l} className={`vq-opt ${ans[q.id] === o.l ? "on" : ""}`} onClick={() => pick(q.id, o.l)}>
                <div className="vq-emoji">{o.e}</div>
                <div className="vq-label">{o.l}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="nav-row">
        <button className="btn btn-g" onClick={() => setPage(0)}>← Back</button>
        <button className="btn btn-p" onClick={goGenerate} disabled={!ready || loading}>
          {loading ? <><Spinner />Generating…</> : "✨ Generate My Majors"}
        </button>
        {!ready && <span style={{ fontSize: ".78rem", color: G.muted }}>Answer at least 4 questions</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — MAJORS
// ═══════════════════════════════════════════════════════════════════════════════
function PageMajors({ data, upd, setPage, loading, setLoading, setError }) {
  const [compareMode, setCompareMode] = useState(false);
  const [loadingWild, setLoadingWild] = useState(false);

  const regen = async () => {
    if (!data.raw_likes.length) { setError("Go back and add interests first."); return; }
    setError(null);
    setLoading(true);
    const SYS = `You are a college major advisor speaking to a curious 15-year-old. Output ONLY a raw JSON array starting with [ and ending with ].`;
    const prompt = `Student interests: ${JSON.stringify(data.raw_likes)}
Vibe: ${JSON.stringify(data.vibe_answers)}
Propose exactly 2 DIFFERENT creative but realistic majors (not repeating previous ones).
fit_score 70-75=loose 76-84=moderate 85-91=strong 92-95=exceptional
Return array of 2 objects: [{"custom_major":"","fit_score":0,"simple_description":"","base_majors":[{"name":"","examples":[],"why_close":""}],"suggested_minors":[{"name":"","why_bridge":""}],"job_verticals":[{"title":"","grad_story":"","day_in_life_story":"","salary_range":"","job_outlook":""}]}]
Include 2 base majors, 2 minors, 2 job verticals each.`;
    try {
      const parsed = await ai(SYS, prompt, { temp: 0.75 });
      upd({ woven_paths: Array.isArray(parsed) ? parsed : [parsed] });
    } catch (e) { setError("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  const genWildcard = async () => {
    setLoadingWild(true);
    setError(null);
    const SYS = `You are a creative college advisor. Output ONLY a raw JSON object starting with { and ending with }.`;
    const prompt = `Student interests: ${JSON.stringify(data.raw_likes)}
Create ONE wildcard major — something unexpected and surprising that still genuinely connects to their interests. Make it provocative and intriguing.
Return: {"custom_major":"","fit_score":0,"simple_description":"two sentences that pitch why this surprising major actually fits","why_unexpected":"one sentence on why most people wouldn't see this connection","base_majors":[{"name":"","examples":[],"why_close":""}],"suggested_minors":[{"name":"","why_bridge":""}],"job_verticals":[{"title":"","grad_story":"","day_in_life_story":"4 vivid sentences","salary_range":"","job_outlook":""}]}`;
    try {
      const parsed = await ai(SYS, prompt, { temp: 0.85 });
      upd({ wildcard_major: parsed });
    } catch (e) { setError("Wildcard failed: " + e.message); }
    finally { setLoadingWild(false); }
  };

  const paths = data.woven_paths || [];

  const renderMajorCard = (p, isWild = false) => (
    <Expander key={p.custom_major} open={true}
      title={<span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        {isWild && <span style={{ fontSize: ".7rem", fontWeight: 700, padding: ".1rem .5rem", borderRadius: "999px", background: `${G.gold}18`, color: G.gold, border: `1px solid ${G.gold}44` }}>🎲 WILDCARD</span>}
        {p.custom_major}
      </span>}
      badge={<span className="pill p-teal">{p.fit_score}% fit</span>}>
      <ScoreBar score={p.fit_score} />
      {isWild && p.why_unexpected && (
        <div style={{ background: `${G.gold}0d`, border: `1px solid ${G.gold}22`, borderRadius: "9px", padding: ".65rem .9rem", marginBottom: ".75rem", fontSize: ".84rem", color: G.gold }}>
          💡 {p.why_unexpected}
        </div>
      )}
      <p style={{ color: G.muted, fontSize: ".9rem", marginBottom: ".5rem", lineHeight: 1.55 }}>{p.simple_description}</p>

      <SH>Closest Real Majors</SH>
      {(p.base_majors || []).map((b, j) => (
        <div key={j} className="card" style={{ padding: ".85rem 1rem", marginBottom: ".5rem" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: ".25rem" }}>{b.name}</div>
          <div style={{ fontSize: ".79rem", color: G.muted, marginBottom: ".22rem" }}>🏛 {(b.examples || []).join(" · ")}</div>
          <div style={{ fontSize: ".85rem", color: G.text }}>{b.why_close}</div>
        </div>
      ))}

      <SH>Minors to Bridge the Gaps</SH>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".55rem", marginBottom: ".75rem" }}>
        {(p.suggested_minors || []).map((m, j) => (
          <div key={j} style={{ background: G.bg2, border: `1px solid ${G.border}`, borderRadius: "10px", padding: ".55rem .85rem", maxWidth: "260px" }}>
            <div style={{ fontWeight: 600, fontSize: ".85rem", color: G.accent, marginBottom: ".18rem" }}>{m.name}</div>
            <div style={{ fontSize: ".77rem", color: G.muted }}>{m.why_bridge}</div>
          </div>
        ))}
      </div>

      <SH>Jobs I Could Have</SH>
      {(p.job_verticals || []).map((j, k) => (
        <div key={k} className="card card-purple" style={{ padding: ".95rem 1rem", marginBottom: ".55rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: ".4rem", marginBottom: ".4rem" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{j.title}</div>
            <span className="pill p-purple">💼 Real role</span>
          </div>
          {j.grad_story && <div style={{ fontSize: ".78rem", color: G.muted, marginBottom: ".5rem" }}>👤 {j.grad_story}</div>}
          <div style={{ fontSize: ".86rem", color: G.text, lineHeight: 1.55, marginBottom: ".5rem" }}>
            <span style={{ fontSize: ".72rem", color: G.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>A day in the life · </span>
            {j.day_in_life_story}
          </div>
          <div style={{ fontSize: ".8rem", color: G.gold }}>💰 {j.salary_range}</div>
          <div style={{ fontSize: ".8rem", color: G.muted, marginTop: ".25rem" }}>📈 {j.job_outlook}</div>
        </div>
      ))}
    </Expander>
  );

  return (
    <div className="fu">
      <div className="ptitle">Your <span className="hl">Majors</span></div>
      <div className="sub">Personalized to your interests and vibe preferences.</div>

      {/* Ambiguous reframes banner */}
      {data.safety_reframes && Object.keys(data.safety_reframes).length > 0 && (
        <AmbiguousBanner reframes={data.safety_reframes}
          onDismiss={() => upd({ safety_reframes: {} })} />
      )}

      {/* Banner */}
      {data.banner_msg && (
        <div className="banner">
          <div style={{ fontSize: ".78rem", fontWeight: 700, color: G.accent, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".3rem" }}>✦ Your Waypoint</div>
          <div style={{ fontSize: ".93rem", color: G.text, lineHeight: 1.6 }}>{data.banner_msg}</div>
        </div>
      )}

      {!paths.length && <div className="info">No majors yet — go back to step 1 to enter your interests.</div>}

      {/* Compare toggle */}
      {paths.length >= 2 && (
        <div style={{ marginBottom: "1rem", display: "flex", gap: ".5rem", alignItems: "center" }}>
          <button className={`btn btn-sm ${compareMode ? "btn-p" : "btn-g"}`} onClick={() => setCompareMode(c => !c)}>
            {compareMode ? "✓ Comparing" : "⚖️ Compare Side-by-Side"}
          </button>
        </div>
      )}

      {/* Compare mode */}
      {compareMode && paths.length >= 2 && (
        <div className="cmp-grid" style={{ marginBottom: "1rem" }}>
          {paths.slice(0, 2).map((p, i) => (
            <div key={i} className="card" style={{ padding: "1rem" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: ".6rem", color: i === 0 ? G.accent : G.accent2 }}>{p.custom_major}</div>
              <ScoreBar score={p.fit_score} />
              <div style={{ fontSize: ".82rem", color: G.muted, marginBottom: ".65rem", lineHeight: 1.5 }}>{p.simple_description}</div>
              <div className="sh" style={{ fontSize: ".68rem" }}>Top job</div>
              <div style={{ fontSize: ".82rem", fontWeight: 600 }}>{p.job_verticals?.[0]?.title || "—"}</div>
              <div style={{ fontSize: ".78rem", color: G.gold, marginTop: ".2rem" }}>{p.job_verticals?.[0]?.salary_range || ""}</div>
              <div className="sh" style={{ fontSize: ".68rem", marginTop: ".8rem" }}>Base major</div>
              <div style={{ fontSize: ".82rem" }}>{p.base_majors?.[0]?.name || "—"}</div>
              <div className="sh" style={{ fontSize: ".68rem", marginTop: ".8rem" }}>Key minor</div>
              <div style={{ fontSize: ".82rem" }}>{p.suggested_minors?.[0]?.name || "—"}</div>
              <div className="sh" style={{ fontSize: ".68rem", marginTop: ".8rem" }}>Outlook</div>
              <div style={{ fontSize: ".78rem", color: G.muted }}>{p.job_verticals?.[0]?.job_outlook || "—"}</div>
            </div>
          ))}
        </div>
      )}

      {!compareMode && paths.map(p => renderMajorCard(p))}

      {/* Wildcard */}
      <div style={{ margin: "1.2rem 0 .5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap" }}>
          <button className="btn btn-gold" onClick={genWildcard} disabled={loadingWild}>
            {loadingWild ? <><Spinner />Finding wildcard…</> : "🎲 Surprise Me — Wildcard Major"}
          </button>
          {data.wildcard_major && <span style={{ fontSize: ".78rem", color: G.muted }}>↓ scroll down to see it</span>}
        </div>
      </div>
      {data.wildcard_major && !compareMode && renderMajorCard(data.wildcard_major, true)}

      <div className="nav-row">
        <button className="btn btn-g" onClick={() => setPage(1)}>← Back</button>
        <button className="btn btn-g" onClick={regen} disabled={loading}>{loading ? <><Spinner style={{ borderTopColor: G.muted }} />Working…</> : "🔄 Regenerate"}</button>
        {paths.length > 0 && <button className="btn btn-p" onClick={() => setPage(3)}>Next → Colleges 🏛</button>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — COLLEGES
// ═══════════════════════════════════════════════════════════════════════════════
function PageColleges({ data, upd, setPage, loading, setLoading, setError }) {
  const [homeState, setHomeState] = useState(data.home_state || "Hawaii");

  const generate = async (hs) => {
    setError(null); setLoading(true);
    const majors = (data.woven_paths || []).map(p => p.custom_major);
    const SYS = `You are a college admissions counselor. Be accurate about real universities. Safety schools must have >50% acceptance rate and be regionally respected. For all numerical data (tuition, acceptance rate, ranking), provide your best estimate and note that figures should be verified. Output ONLY a raw JSON array starting with [ and ending with ].`;
    const prompt = `Student home state: "${hs}"
Majors of interest: ${JSON.stringify(majors)}
Vibe preferences: ${JSON.stringify(data.vibe_answers)}

Return exactly 6 colleges: 3 in-state (1 Reach, 1 Match, 1 Safety) + 3 out-of-state (1 Reach, 1 Match, 1 Safety).

Ranking bands: Reach=#1-60, Match=#60-150, Safety=#150+ but regionally respected.

For each college, explain how the vibe preferences are reflected in the campus culture. Mention specific programs, clubs, or opportunities relevant to the majors.

Return array of 6 objects:
[{"college":"Full Name","state_location":"HI","in_out":"In-state","ranking":42,"type":"Reach","tuition":"$14,000/yr (in-state)","acceptance_rate":"28%","vibe":"one sentence","vibe_fit":"one sentence on how campus culture matches their quiz answers","fit_reason":"1-2 sentences on major fit","customize":"one concrete sentence on tailoring studies here"}]`;
    try {
      const parsed = await ai(SYS, prompt, { temp: 0.3 });
      upd({ college_list: Array.isArray(parsed) ? parsed : [parsed], home_state: hs });
    } catch (e) { setError("Failed: " + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!data.college_list.length && data.woven_paths.length) generate(homeState); }, []);

  const colleges = data.college_list;
  const selected = data.selected_school;

  return (
    <div className="fu">
      <div className="ptitle">Best <span className="hl">Colleges</span> for Me</div>
      <div className="sub">Matched to your majors AND your vibe — culture fit matters as much as academics.</div>

      <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label className="lbl">Home state</label>
          <input type="text" value={homeState} onChange={e => setHomeState(e.target.value)} placeholder="e.g. Hawaii" />
        </div>
        <button className="btn btn-p" onClick={() => generate(homeState)} disabled={loading}>
          {loading ? <><Spinner />Searching…</> : "🔍 Find Colleges"}
        </button>
      </div>

      {loading && <Spinner lg />}

      {!loading && colleges.map((c, i) => {
        const name = c.college || c.name || `College #${i + 1}`;
        const isSel = selected === name;
        return (
          <div key={i} className={`card ${isSel ? "card-glow" : ""}`}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: ".75rem" }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>{name}</div>
                <div style={{ fontSize: ".77rem", color: G.muted, marginTop: ".15rem" }}>{c.state_location} · Ranked #{c.ranking || "?"}</div>
              </div>
              <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                <span className={`pill ${pillType(c.type)}`}>{c.type}</span>
                <span className="pill p-teal">{c.in_out}</span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat"><div className="stat-l">Tuition <VerifyBadge /></div><div className="stat-v">{c.tuition || "—"}</div></div>
              <div className="stat"><div className="stat-l">Acceptance <VerifyBadge /></div><div className="stat-v">{c.acceptance_rate || "—"}</div></div>
            </div>
            <div style={{ marginTop: ".75rem", fontSize: ".85rem", color: G.muted, lineHeight: 1.5 }}>{c.vibe}</div>
            {c.vibe_fit && <div style={{ marginTop: ".3rem", fontSize: ".83rem", color: G.accent, background: `${G.accent}0d`, borderRadius: "8px", padding: ".45rem .7rem", marginTop: ".5rem" }}>🎯 {c.vibe_fit}</div>}
            <div style={{ marginTop: ".4rem", fontSize: ".85rem", color: G.text, lineHeight: 1.5 }}>{c.fit_reason}</div>
            {c.customize && <div style={{ marginTop: ".4rem", fontSize: ".82rem", color: G.accent2, background: `${G.accent2}0d`, borderRadius: "8px", padding: ".45rem .7rem" }}>🎨 {c.customize}</div>}
            <div style={{ marginTop: ".9rem" }}>
              <button className={`btn btn-sm ${isSel ? "btn-p" : "btn-g"}`} onClick={() => upd({ selected_school: name })}>
                {isSel ? "✓ Selected for Apply" : "Use for Application Help"}
              </button>
            </div>
          </div>
        );
      })}

      <div className="nav-row">
        <button className="btn btn-g" onClick={() => setPage(2)}>← Back</button>
        <button className="btn btn-g" onClick={() => generate(homeState)} disabled={loading}>🔄 Regenerate</button>
        {selected && <button className="btn btn-p" onClick={() => setPage(4)}>Next → Roadmap 🗺</button>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — ROADMAP
// ═══════════════════════════════════════════════════════════════════════════════
function PageRoadmap({ data, upd, setPage, loading, setLoading, setError }) {
  const generate = async () => {
    setError(null); setLoading(true);
    const majors = (data.woven_paths || []).map(p => p.custom_major);
    const school = data.selected_school || "their top college";
    const SYS = `You are a college counselor creating a grade-by-grade action plan for a high school sophomore. Be specific, concrete, and motivating. Output ONLY a raw JSON object starting with { and ending with }.`;
    const prompt = `Student interests: ${JSON.stringify(data.raw_likes)}
Target majors: ${JSON.stringify(majors)}
Dream school: ${school}
Current grade: Sophomore (10th grade)

Create a detailed roadmap from now to application. Be specific to their interests — not generic advice.

Return:
{
  "headline": "one motivating sentence about their specific path",
  "years": [
    {
      "grade": "Sophomore (Now)",
      "theme": "short theme title",
      "actions": [
        {"category":"academics|activities|experience|skills|test prep|explore","action":"specific thing to do","why":"one sentence on why this matters for their goals"}
      ]
    },
    { "grade": "Junior", ... },
    { "grade": "Senior (Application Year)", ... }
  ],
  "quick_wins": ["something they can do THIS WEEK to start"],
  "dream_activities": ["specific club, competition, program, or internship perfect for these interests"]
}

Include 5-7 actions per year. Make quick_wins (3 items) and dream_activities (4-5 items) highly specific to their interests.`;
    try {
      const parsed = await ai(SYS, prompt, { tokens: 3000, temp: 0.45 });
      upd({ roadmap: parsed });
    } catch (e) { setError("Roadmap failed: " + e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (!data.roadmap && data.raw_likes.length) generate(); }, []);

  const rm = data.roadmap;
  const catColor = { academics: G.accent, activities: G.green, experience: G.accent2, skills: G.gold, "test prep": G.pink, explore: "#60a5fa" };

  return (
    <div className="fu">
      <div className="ptitle">Your <span className="hl">Roadmap</span></div>
      <div className="sub">A grade-by-grade plan to become the applicant your dream school wants to admit.</div>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Spinner lg />
          <div style={{ color: G.muted, fontSize: ".86rem", marginTop: "1rem" }}>Building your personalized roadmap…</div>
        </div>
      )}

      {!loading && rm && (
        <div className="fu">
          {/* Headline */}
          <div className="banner" style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 700, color: G.accent, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".3rem" }}>Your path</div>
            <div style={{ fontSize: "1rem", color: G.text, lineHeight: 1.6, fontWeight: 500 }}>{rm.headline}</div>
          </div>

          {/* Quick wins */}
          {rm.quick_wins?.length > 0 && (
            <div className="card card-green" style={{ marginBottom: "1.4rem" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.green, marginBottom: ".75rem" }}>⚡ Do This Week</div>
              {rm.quick_wins.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: ".7rem", padding: ".5rem 0", borderBottom: i < rm.quick_wins.length - 1 ? `1px solid ${G.border}` : "none" }}>
                  <span style={{ color: G.green, fontWeight: 800, fontFamily: "'Syne',sans-serif", minWidth: "20px" }}>{i + 1}</span>
                  <span style={{ fontSize: ".88rem" }}>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Year timeline */}
          {(rm.years || []).map((yr, yi) => (
            <div key={yi} style={{ marginBottom: "1.5rem" }}>
              <div className="tl-year">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className="tl-dot">{yi + 10}th</div>
                  {yi < (rm.years.length - 1) && <div className="tl-line" />}
                </div>
                <div style={{ flex: 1, paddingTop: ".2rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: ".15rem" }}>{yr.grade}</div>
                  {yr.theme && <div style={{ fontSize: ".8rem", color: G.accent, fontWeight: 600, marginBottom: ".75rem", textTransform: "uppercase", letterSpacing: ".06em" }}>{yr.theme}</div>}
                  <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {(yr.actions || []).map((a, ai2) => {
                      const cc = catColor[a.category] || G.muted;
                      return (
                        <div key={ai2} style={{ background: `${cc}09`, border: `1px solid ${cc}22`, borderRadius: "10px", padding: ".65rem .9rem" }}>
                          <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: ".2rem" }}>
                            <span style={{ fontSize: ".67rem", fontWeight: 700, padding: ".08rem .4rem", borderRadius: "999px", background: `${cc}18`, color: cc, border: `1px solid ${cc}44`, flexShrink: 0, textTransform: "uppercase", letterSpacing: ".04em" }}>{a.category}</span>
                            <span style={{ fontSize: ".87rem", fontWeight: 500, color: G.text }}>{a.action}</span>
                          </div>
                          {a.why && <div style={{ fontSize: ".78rem", color: G.muted, lineHeight: 1.45, paddingLeft: ".1rem" }}>→ {a.why}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dream activities */}
          {rm.dream_activities?.length > 0 && (
            <div className="card card-purple">
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent2, marginBottom: ".75rem" }}>🌟 Dream Activities & Programs</div>
              <div style={{ fontSize: ".82rem", color: G.muted, marginBottom: ".75rem" }}>These are highly specific to your interests — look into them now, even as a sophomore.</div>
              {rm.dream_activities.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: ".7rem", padding: ".5rem 0", borderBottom: i < rm.dream_activities.length - 1 ? `1px solid ${G.border}` : "none" }}>
                  <span style={{ color: G.accent2, fontWeight: 800, fontFamily: "'Syne',sans-serif", minWidth: "20px" }}>✦</span>
                  <span style={{ fontSize: ".87rem" }}>{a}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="nav-row no-print">
        <button className="btn btn-g" onClick={() => setPage(3)}>← Back</button>
        <button className="btn btn-g" onClick={generate} disabled={loading}>🔄 Regenerate</button>
        {rm && <button className="btn btn-p" onClick={() => setPage(5)}>Next → Apply ✅</button>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — APPLY
// ═══════════════════════════════════════════════════════════════════════════════
const APP_SYS = `You are a warm college counselor talking directly to a high school sophomore. Be specific to the actual school and student's real interests. Output ONLY a raw JSON object starting with { and ending with }.`;

function PageApply({ data, upd, setPage, loading, setLoading, setError }) {
  const school = data.selected_school;
  const colleges = data.college_list || [];
  const college = colleges.find(c => (c.college || c.name) === school);
  const majors = (data.woven_paths || []).map(p => p.custom_major);
  const interests = data.raw_likes || [];

  const [tab, setTab] = useState("checklist");
  const [aiData, setAiData] = useState((data.page4_ai || {})[school] || null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [essayAngles, setEssayAngles] = useState(null);
  const [loadingEssay, setLoadingEssay] = useState(false);
  const [essayDraft, setEssayDraft] = useState("");
  const [essayFeedback, setEssayFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [interviewQs, setInterviewQs] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [notes, setNotes] = useState((data.application_notes || {})[school] || "");

  const saveNotes = (v) => { setNotes(v); upd({ application_notes: { ...(data.application_notes || {}), [school]: v } }); };

  const progress = (data.application_progress || {})[school] || {};
  const tasks = aiData?.checklist || [];
  const doneCount = tasks.filter(t => progress[t?.task || t]).length;

  const toggleTask = (label) => {
    const prev = (data.application_progress || {})[school] || {};
    upd({ application_progress: { ...data.application_progress, [school]: { ...prev, [label]: !prev[label] } } });
  };

  const genMain = async () => {
    setLoadingAI(true);
    const prompt = `School: ${school}
Student's intended majors: ${JSON.stringify(majors)}
Student's interests: ${JSON.stringify(interests)}
College type: ${college?.type || "Match"}, acceptance rate: ${college?.acceptance_rate || "unknown"}

Generate a personalized application guide.
Return JSON object:
{
  "checklist": [{"task":"","detail":"specific to THIS school","category":"essay|admin|test|rec|financial|portfolio","urgent":false}],
  "deadlines": [{"name":"","date":"Month Day, Year","note":""}],
  "strengths": ["strength specific to this school+interests"],
  "gaps": [{"gap":"likely weakness","fix":"concrete action to address it"}],
  "now_actions": ["specific sophomore action to strengthen application"],
  "financial": {
    "estimated_coa": "", "avg_aid_package": "",
    "net_price_url": "https://... or empty string",
    "fafsa_deadline": "",
    "scholarships": [{"name":"","amount":"","note":""}],
    "tip": ""
  }
}
Include 8-12 checklist items, 4-6 deadlines, 3-4 strengths, 2-3 gaps, 4-5 now_actions, 2-3 scholarships.`;
    try {
      const parsed = await ai(APP_SYS, prompt, { temp: 0.4, tokens: 3000 });
      const next = { ...(data.page4_ai || {}), [school]: parsed };
      upd({ page4_ai: next });
      setAiData(parsed);
    } catch (e) { setError("Guide failed: " + e.message); }
    finally { setLoadingAI(false); }
  };

  const genEssay = async () => {
    setLoadingEssay(true);
    const SYS2 = `You are a college essay coach helping students find their authentic story. Output ONLY a raw JSON array starting with [ and ending with ].`;
    const prompt = `Student interests: ${JSON.stringify(interests)}
School: ${school}, Major: ${majors[0] || "undecided"}
Generate 5 distinct non-cliché Common App essay angles.
Return array: [{"angle":"punchy title","hook":"opening sentence","core_insight":"deeper truth revealed","why_compelling":"why admissions officer remembers this"}]`;
    try {
      const p = await ai(SYS2, prompt, { temp: 0.88, tokens: 1600 });
      setEssayAngles(Array.isArray(p) ? p : [p]);
    } catch (e) { setError("Essay failed: " + e.message); }
    finally { setLoadingEssay(false); }
  };

  const genFeedback = async () => {
    if (!essayDraft.trim()) { setError("Write a few sentences first."); return; }
    setLoadingFeedback(true);
    const SYS3 = `You are an experienced college admissions reader at a selective university. Output ONLY a raw JSON object starting with { and ending with }.`;
    const prompt = `Student's interests: ${JSON.stringify(interests)}
Target school: ${school}
Essay draft: "${essayDraft}"
Give honest, specific feedback as if you are an admissions reader.
Return: {"overall_impression":"2 sentences","what_works":["specific strength"],"push_deeper":["specific suggestion to make it more vivid or revealing"],"watch_out":["common mistake to avoid"],"next_step":"one concrete next action"}`;
    try {
      const p = await ai(SYS3, prompt, { temp: 0.5, tokens: 1200 });
      setEssayFeedback(p);
    } catch (e) { setError("Feedback failed: " + e.message); }
    finally { setLoadingFeedback(false); }
  };

  const genInterview = async () => {
    setLoadingInterview(true);
    const SYS4 = `You are a college interview coach. Output ONLY a raw JSON array starting with [ and ending with ].`;
    const prompt = `School: ${school}, Interests: ${JSON.stringify(interests)}, Major: ${majors[0] || "undecided"}
Generate 6 likely interview questions + tips.
Return: [{"question":"","what_they_want":"","tip":"specific to these interests"}]`;
    try {
      const p = await ai(SYS4, prompt, { temp: 0.6, tokens: 1500 });
      setInterviewQs(Array.isArray(p) ? p : [p]);
    } catch (e) { setError("Interview failed: " + e.message); }
    finally { setLoadingInterview(false); }
  };

  useEffect(() => { if (!aiData && school) genMain(); }, [school]);

  if (!school) return (
    <div className="fu">
      <div className="info">No school selected. Go back to Colleges and choose one.</div>
      <button className="btn btn-g" onClick={() => setPage(3)}>← Back to Colleges</button>
    </div>
  );

  const TABS = [
    { id: "checklist", label: "✅ Checklist" }, { id: "deadlines", label: "📅 Deadlines" },
    { id: "strengths", label: "💪 Strengths" }, { id: "essay", label: "✍️ Essays" },
    { id: "interview", label: "🎤 Interview" }, { id: "financial", label: "💰 Financial" },
  ];

  return (
    <div className="fu">
      <div className="ptitle">Your <span className="hl">{school.split(" ").slice(0, 4).join(" ")}</span> Playbook</div>
      <div className="sub">AI-personalized for your interests and this specific school.</div>

      {college && (
        <div style={{ display: "flex", gap: ".45rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
          <span className={`pill ${pillType(college.type)}`}>{college.type}</span>
          <span className="pill p-teal">{college.acceptance_rate} acceptance <VerifyBadge /></span>
          <span className="pill p-gold">{college.tuition} <VerifyBadge /></span>
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {loadingAI && (
        <div style={{ textAlign: "center", padding: "2.5rem 0" }}>
          <Spinner lg />
          <div style={{ color: G.muted, fontSize: ".85rem", marginTop: "1rem" }}>Building your personalized guide for {school}…</div>
        </div>
      )}

      {/* CHECKLIST */}
      {!loadingAI && tab === "checklist" && (
        <div className="fu">
          {tasks.length > 0 ? (
            <>
              <div style={{ marginBottom: ".8rem" }}>
                <div className="prog-bg"><div className="prog-fill" style={{ width: `${(doneCount / tasks.length) * 100}%` }} /></div>
                <div style={{ fontSize: ".76rem", color: G.muted, marginTop: ".3rem" }}>{doneCount} of {tasks.length} completed</div>
              </div>
              <div className="card" style={{ padding: ".5rem 1rem" }}>
                {tasks.map((t, i) => {
                  const label = t.task || t;
                  return <CheckRow key={i} label={label} detail={t.detail} checked={!!progress[label]} cat={t.category} urgent={t.urgent} onToggle={() => toggleTask(label)} />;
                })}
              </div>
            </>
          ) : <div className="info">Generating your personalized checklist…</div>}
          <div className="card" style={{ marginTop: ".9rem" }}>
            <label className="lbl">My notes</label>
            <textarea rows={4} placeholder="Deadlines, questions for your counselor, ideas…" value={notes} onChange={e => saveNotes(e.target.value)} />
          </div>
          <div style={{ marginTop: ".7rem" }}>
            <button className="btn btn-g btn-sm" onClick={genMain} disabled={loadingAI}>🔄 Regenerate</button>
          </div>
        </div>
      )}

      {/* DEADLINES */}
      {!loadingAI && tab === "deadlines" && (
        <div className="fu">
          {aiData?.deadlines?.length > 0
            ? aiData.deadlines.map((d, i) => (
              <div key={i} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", borderLeft: `3px solid ${G.accent}`, padding: ".9rem 1rem" }}>
                <div style={{ minWidth: "88px", textAlign: "center", background: G.bg2, borderRadius: "9px", padding: ".55rem .4rem", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent, fontSize: ".82rem", lineHeight: 1.3 }}>{d.date}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: ".2rem" }}>{d.name}</div>
                  <div style={{ fontSize: ".8rem", color: G.muted }}>{d.note}</div>
                </div>
              </div>
            ))
            : <div className="info">Deadlines load with the checklist.</div>}
        </div>
      )}

      {/* STRENGTHS & GAPS */}
      {!loadingAI && tab === "strengths" && (
        <div className="fu">
          {aiData ? <>
            <SH>Your Strengths for {school}</SH>
            {(aiData.strengths || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: ".7rem", background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.2)", borderRadius: "10px", padding: ".7rem .95rem", marginBottom: ".5rem" }}>
                <span style={{ color: G.green }}>✦</span>
                <span style={{ fontSize: ".88rem" }}>{s}</span>
              </div>
            ))}
            <SH>Gaps to Close</SH>
            {(aiData.gaps || []).map((g, i) => (
              <div key={i} style={{ background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.2)", borderRadius: "11px", padding: ".85rem .95rem", marginBottom: ".6rem" }}>
                <div style={{ fontSize: ".86rem", marginBottom: ".35rem" }}>⚠ {g.gap}</div>
                <div style={{ fontSize: ".8rem", color: G.gold }}>→ {g.fix}</div>
              </div>
            ))}
            <SH>Do This Now (Sophomore Year)</SH>
            {(aiData.now_actions || []).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: ".7rem", padding: ".6rem 0", borderBottom: `1px solid ${G.border}` }}>
                <span style={{ color: G.accent, fontFamily: "'Syne',sans-serif", fontWeight: 800, minWidth: "20px" }}>{i + 1}</span>
                <span style={{ fontSize: ".88rem" }}>{a}</span>
              </div>
            ))}
          </> : <div className="info">Loading…</div>}
        </div>
      )}

      {/* ESSAYS */}
      {tab === "essay" && (
        <div className="fu">
          <div style={{ fontSize: ".88rem", color: G.muted, marginBottom: "1.1rem", lineHeight: 1.6 }}>
            The Common App personal essay (650 words) is your chance to show who you are beyond grades. These angles are built around your specific interests — no clichés.
          </div>
          {!essayAngles && !loadingEssay && (
            <button className="btn btn-p" onClick={genEssay}>✍️ Generate My Essay Angles</button>
          )}
          {loadingEssay && <div style={{ textAlign: "center", padding: "1.5rem 0" }}><Spinner lg /><div style={{ color: G.muted, fontSize: ".85rem", marginTop: "1rem" }}>Finding your story…</div></div>}
          {essayAngles && (
            <>
              {essayAngles.map((e, i) => (
                <div key={i} className="card card-purple" style={{ marginBottom: ".75rem" }}>
                  <div style={{ display: "flex", gap: ".6rem", marginBottom: ".5rem" }}>
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent2, minWidth: 22 }}>{i + 1}</span>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{e.angle}</div>
                  </div>
                  <div style={{ fontSize: ".86rem", color: G.accent, fontStyle: "italic", marginBottom: ".4rem", paddingLeft: "1.6rem" }}>"{e.hook}"</div>
                  <div style={{ fontSize: ".82rem", color: G.text, marginBottom: ".3rem", paddingLeft: "1.6rem" }}><strong style={{ color: G.muted }}>Core insight: </strong>{e.core_insight}</div>
                  <div style={{ fontSize: ".79rem", color: G.muted, paddingLeft: "1.6rem" }}>💡 {e.why_compelling}</div>
                </div>
              ))}
              <button className="btn btn-g btn-sm" onClick={genEssay} disabled={loadingEssay} style={{ marginBottom: "1.4rem" }}>🔄 New angles</button>
            </>
          )}

          {/* Draft + Feedback */}
          <SH>Draft Your Opening — Get Feedback</SH>
          <div style={{ fontSize: ".82rem", color: G.muted, marginBottom: ".65rem" }}>Write your first paragraph (3–5 sentences) and get feedback like an admissions reader would give.</div>
          <textarea rows={6} placeholder="Start with a scene, a moment, or a question. Don't introduce yourself — just drop us into the story…" value={essayDraft} onChange={e => setEssayDraft(e.target.value)} style={{ marginBottom: ".75rem" }} />
          <button className="btn btn-p" onClick={genFeedback} disabled={loadingFeedback || !essayDraft.trim()}>
            {loadingFeedback ? <><Spinner />Reading your draft…</> : "📝 Get Admissions Reader Feedback"}
          </button>
          {essayFeedback && (
            <div className="card card-glow" style={{ marginTop: "1rem" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent, marginBottom: ".75rem" }}>Admissions Reader Feedback</div>
              <div style={{ fontSize: ".88rem", color: G.text, marginBottom: "1rem", lineHeight: 1.6, background: `${G.accent}09`, borderRadius: "9px", padding: ".75rem .9rem" }}>{essayFeedback.overall_impression}</div>
              <SH>What's working</SH>
              {(essayFeedback.what_works || []).map((w, i) => <div key={i} style={{ fontSize: ".85rem", color: G.green, padding: ".3rem 0", display: "flex", gap: ".5rem" }}><span>✓</span>{w}</div>)}
              <SH>Push deeper</SH>
              {(essayFeedback.push_deeper || []).map((w, i) => <div key={i} style={{ fontSize: ".85rem", color: G.accent2, padding: ".3rem 0", display: "flex", gap: ".5rem" }}><span>→</span>{w}</div>)}
              <SH>Watch out for</SH>
              {(essayFeedback.watch_out || []).map((w, i) => <div key={i} style={{ fontSize: ".85rem", color: G.gold, padding: ".3rem 0", display: "flex", gap: ".5rem" }}><span>⚠</span>{w}</div>)}
              {essayFeedback.next_step && (
                <div style={{ marginTop: ".85rem", background: `${G.green}09`, border: `1px solid ${G.green}22`, borderRadius: "9px", padding: ".65rem .9rem", fontSize: ".85rem" }}>
                  <strong style={{ color: G.green }}>Next step: </strong>{essayFeedback.next_step}
                </div>
              )}
              <button className="btn btn-g btn-sm" onClick={genFeedback} disabled={loadingFeedback} style={{ marginTop: ".75rem" }}>🔄 Re-read my draft</button>
            </div>
          )}
        </div>
      )}

      {/* INTERVIEW */}
      {tab === "interview" && (
        <div className="fu">
          <div style={{ fontSize: ".88rem", color: G.muted, marginBottom: "1.1rem", lineHeight: 1.6 }}>
            If {school} offers alumni or admissions interviews, being prepared makes a real difference. These questions are tailored to your interests.
          </div>
          {!interviewQs && !loadingInterview && (
            <button className="btn btn-p" onClick={genInterview}>🎤 Generate Interview Questions</button>
          )}
          {loadingInterview && <div style={{ textAlign: "center", padding: "1.5rem 0" }}><Spinner lg /></div>}
          {interviewQs && (
            <>
              {interviewQs.map((q, i) => (
                <div key={i} className="card" style={{ marginBottom: ".75rem" }}>
                  <div style={{ fontWeight: 600, marginBottom: ".45rem" }}>
                    <span style={{ color: G.accent, fontFamily: "'Syne',sans-serif", fontWeight: 800, marginRight: ".45rem" }}>Q{i + 1}</span>{q.question}
                  </div>
                  <div style={{ fontSize: ".8rem", color: G.muted, marginBottom: ".35rem" }}><strong style={{ color: G.text }}>They want: </strong>{q.what_they_want}</div>
                  <div style={{ fontSize: ".8rem", color: G.accent, background: `${G.accent}0d`, borderRadius: "8px", padding: ".42rem .68rem" }}>💡 {q.tip}</div>
                </div>
              ))}
              <button className="btn btn-g btn-sm" onClick={genInterview} disabled={loadingInterview}>🔄 Regenerate</button>
            </>
          )}
        </div>
      )}

      {/* FINANCIAL */}
      {!loadingAI && tab === "financial" && (
        <div className="fu">
          {aiData?.financial ? (
            <>
              <div className="stats-grid" style={{ marginBottom: "1.1rem" }}>
                <div className="stat card-gold"><div className="stat-l">Cost of Attendance <VerifyBadge /></div><div className="stat-v" style={{ color: G.gold }}>{aiData.financial.estimated_coa}</div></div>
                <div className="stat card-green"><div className="stat-l">Avg Aid Package <VerifyBadge /></div><div className="stat-v" style={{ color: G.green }}>{aiData.financial.avg_aid_package}</div></div>
                <div className="stat"><div className="stat-l">FAFSA Deadline <VerifyBadge /></div><div className="stat-v">{aiData.financial.fafsa_deadline}</div></div>
              </div>
              {aiData.financial.net_price_url && (
                <a href={aiData.financial.net_price_url} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ marginBottom: "1.1rem", display: "inline-flex" }}>
                  🔗 Net Price Calculator for {school}
                </a>
              )}
              <SH>Scholarships to Explore</SH>
              {(aiData.financial.scholarships || []).map((s, i) => (
                <div key={i} style={{ display: "flex", gap: ".9rem", background: G.bg2, borderRadius: "10px", padding: ".7rem .95rem", border: `1px solid ${G.border}`, marginBottom: ".5rem" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.gold, minWidth: "65px", fontSize: ".88rem" }}>{s.amount}</div>
                  <div><div style={{ fontWeight: 600, fontSize: ".86rem", marginBottom: ".15rem" }}>{s.name}</div><div style={{ fontSize: ".78rem", color: G.muted }}>{s.note}</div></div>
                </div>
              ))}
              <div style={{ background: `${G.accent}0d`, border: `1px solid ${G.accent}22`, borderRadius: "10px", padding: ".85rem .95rem", marginTop: ".75rem" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: G.accent, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: ".3rem" }}>Pro tip</div>
                <div style={{ fontSize: ".86rem" }}>{aiData.financial.tip}</div>
              </div>
            </>
          ) : <div className="info">Financial data loads with the checklist.</div>}
        </div>
      )}

      <div className="nav-row no-print">
        <button className="btn btn-g" onClick={() => setPage(3)}>← Back</button>
        <button className="btn btn-p" onClick={() => setPage(6)}>View My Profile ⭐</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — MY PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function PageProfile({ data, upd, setPage }) {
  const topMajor = data.woven_paths?.[0];
  const topCollege = data.college_list?.find(c => (c.college || c.name) === data.selected_school) || data.college_list?.[0];
  const topJob = topMajor?.job_verticals?.[0];
  const vibeLabels = Object.values(data.vibe_answers || {});

  const colleges = data.college_list || [];
  const reaches = colleges.filter(c => c.type === "Reach");
  const matches = colleges.filter(c => c.type === "Match");
  const safeties = colleges.filter(c => c.type === "Safety");

  const totalTasks = Object.values(data.application_progress || {}).flatMap(s => Object.keys(s)).length;
  const doneTasks = Object.values(data.application_progress || {}).flatMap(s => Object.values(s)).filter(Boolean).length;

  return (
    <div className="fu" id="profile-print">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <div className="ptitle">My <span className="hl">Waypoint</span></div>
          <div className="sub" style={{ marginBottom: 0 }}>Your personal navigation map — from who you are to where you're going.</div>
        </div>
        <button className="btn btn-g no-print" onClick={() => window.print()}>🖨 Print / Save as PDF</button>
      </div>

      {/* Interests */}
      <div className="card">
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent, marginBottom: ".75rem" }}>✦ My Interests</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
          {(data.raw_likes || []).map((l, i) => <span key={i} className="pill p-teal">{l}</span>)}
        </div>
        {data.banner_msg && <div style={{ marginTop: ".85rem", fontSize: ".87rem", color: G.text, fontStyle: "italic", lineHeight: 1.6 }}>"{data.banner_msg}"</div>}
      </div>

      {/* Vibe */}
      {vibeLabels.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent2, marginBottom: ".65rem" }}>🎯 My Vibe</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
            {vibeLabels.map((v, i) => <span key={i} className="pill p-purple">{v}</span>)}
          </div>
        </div>
      )}

      {/* Top major */}
      {topMajor && (
        <div className="card card-glow">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.accent, marginBottom: ".65rem" }}>🎓 Top Major Match</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: ".3rem" }}>{topMajor.custom_major}</div>
          <ScoreBar score={topMajor.fit_score} />
          <div style={{ fontSize: ".86rem", color: G.muted, lineHeight: 1.55, marginBottom: ".65rem" }}>{topMajor.simple_description}</div>
          {topMajor.base_majors?.[0] && <div style={{ fontSize: ".82rem" }}><strong style={{ color: G.muted }}>Base major: </strong>{topMajor.base_majors[0].name}</div>}
          {topMajor.suggested_minors?.[0] && <div style={{ fontSize: ".82rem", marginTop: ".2rem" }}><strong style={{ color: G.muted }}>Key minor: </strong>{topMajor.suggested_minors[0].name}</div>}
          {topJob && (
            <div style={{ marginTop: ".75rem", background: `${G.accent2}0d`, borderRadius: "9px", padding: ".65rem .85rem" }}>
              <div style={{ fontWeight: 600, fontSize: ".87rem", marginBottom: ".2rem" }}>💼 {topJob.title}</div>
              <div style={{ fontSize: ".8rem", color: G.gold }}>{topJob.salary_range}</div>
            </div>
          )}
        </div>
      )}

      {/* All majors */}
      {data.woven_paths?.length > 1 && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: ".65rem" }}>All My Major Matches</div>
          {data.woven_paths.map((p, i) => (
            <div key={i} style={{ padding: ".5rem 0", borderBottom: i < data.woven_paths.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".5rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{p.custom_major}</span>
                <span className="pill p-teal">{p.fit_score}% fit</span>
              </div>
            </div>
          ))}
          {data.wildcard_major && (
            <div style={{ padding: ".5rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".5rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>{data.wildcard_major.custom_major} <span style={{ fontSize: ".7rem", color: G.gold }}>🎲 Wildcard</span></span>
                <span className="pill p-gold">{data.wildcard_major.fit_score}% fit</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* College list */}
      {colleges.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: ".85rem" }}>🏛 My College List</div>
          {[["Reach", reaches, "p-reach"], ["Match", matches, "p-match"], ["Safety", safeties, "p-safety"]].map(([type, list, cls]) =>
            list.length > 0 && (
              <div key={type} style={{ marginBottom: ".85rem" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: G.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".4rem" }}>{type}</div>
                {list.map((c, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".42rem 0", borderBottom: `1px solid ${G.border}`, flexWrap: "wrap", gap: ".5rem" }}>
                    <span style={{ fontSize: ".88rem", fontWeight: (c.college || c.name) === data.selected_school ? 700 : 400 }}>
                      {(c.college || c.name) === data.selected_school ? "★ " : ""}{c.college || c.name}
                    </span>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      <span className={`pill ${cls}`}>{c.acceptance_rate}</span>
                      <span className="pill p-teal">{c.in_out}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Progress */}
      {totalTasks > 0 && (
        <div className="card">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: ".65rem" }}>📋 Application Progress</div>
          <div className="prog-bg"><div className="prog-fill" style={{ width: `${(doneTasks / totalTasks) * 100}%` }} /></div>
          <div style={{ fontSize: ".8rem", color: G.muted, marginTop: ".35rem" }}>{doneTasks} of {totalTasks} tasks done across all schools</div>
        </div>
      )}

      {/* Roadmap snapshot */}
      {data.roadmap?.quick_wins?.length > 0 && (
        <div className="card card-green">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: G.green, marginBottom: ".65rem" }}>⚡ My Quick Wins This Week</div>
          {data.roadmap.quick_wins.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: ".6rem", padding: ".42rem 0", borderBottom: i < data.roadmap.quick_wins.length - 1 ? `1px solid ${G.border}` : "none" }}>
              <span style={{ color: G.green, fontWeight: 800, minWidth: "18px" }}>{i + 1}</span>
              <span style={{ fontSize: ".86rem" }}>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer footer — visible on print */}
      <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,209,102,0.06)",
        border: "1px solid rgba(255,209,102,0.2)", borderRadius: "12px",
        fontSize: ".78rem", color: "#7a8baa", lineHeight: 1.6 }}>
        <strong style={{ color: "#ffd166" }}>⚠ Important disclaimer: </strong>
        All college data in this report — including tuition, acceptance rates, deadlines, and scholarship information — was generated by AI and may contain errors.
        Always verify directly with each college's official website and speak with your school counselor before making any decisions.
      </div>

      <div className="nav-row no-print" style={{ marginBottom: "2rem" }}>
        <button className="btn btn-g" onClick={() => setPage(5)}>← Back to Apply</button>
        <button className="btn btn-p" onClick={() => window.print()}>🖨 Save as PDF</button>
        <button className="btn btn-g" onClick={() => { if (window.confirm("Reset your Waypoint and start over?")) { sessionStorage.removeItem(SK); window.location.reload(); } }}>↺ Start Over</button>
      </div>
    </div>
  );
}
