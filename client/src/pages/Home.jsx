import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/pollbaba-logo.png";
import { ArrowRight, Vote, BarChart3, Zap, Laugh, Menu, X } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: <Vote size={22} />, title: "Realtime Polls", desc: "Votes update faster than your crush changes mood." },
  { icon: <BarChart3 size={22} />, title: "Analytics", desc: "Beautiful charts proving humanity is unpredictable." },
  { icon: <Zap size={22} />, title: "Instant Sharing", desc: "Create a poll and spread chaos instantly." },
  { icon: <Laugh size={22} />, title: "Fun UI", desc: "Hackathon judges secretly love playful products." },
];

const STEPS = [
  { num: "01", title: "Create Your Poll", desc: "Write a dumb question, add options, hit publish. Takes 30 seconds. Probably." },
  { num: "02", title: "Share The Chaos", desc: "Drop the link anywhere — Twitter, Discord, WhatsApp. Watch humans argue." },
  { num: "03", title: "Watch It Explode", desc: "Live results, real-time analytics, beautiful charts. Feel the drama unfold." },
];

const TESTIMONIALS = [
  { stars: 5, text: '"I made a poll asking if cereal is soup. Got 4,000 votes and started 3 Twitter fights. 10/10."', avatar: "😎", name: "Rohan K.", role: "Professional Chaos Agent", color: "rgba(240,24,123,0.15)" },
  { stars: 5, text: '"Used Poll Baba during our hackathon presentation. The audience voted live. We won. Coincidence? No."', avatar: "🧠", name: "Priya S.", role: "Hackathon Champion", color: "rgba(6,214,214,0.12)" },
  { stars: 5, text: '"My poll about tabs vs spaces broke my team\'s Slack. Worth it. The analytics were beautiful though."', avatar: "👾", name: "Dev A.", role: "Senior Tab Defender", color: "rgba(124,58,237,0.15)" },
];

const TICKER_ITEMS = [
  "🔥 \"Pineapple on Pizza\" — 12k votes",
  "⚡ \"Morning person vs Night owl\" — 8.4k votes",
  "🎯 \"Tabs vs Spaces\" — 6.1k votes",
  "🤡 \"Is a hot dog a sandwich?\" — 21k votes",
  "🧠 \"AI will take over\" — 4.7k votes",
  "😂 \"Best programming language\" — 9.3k votes",
];

const POLL_OPTIONS = [
  { emoji: "🤤", label: "YESSS it's amazing" },
  { emoji: "🤮", label: "Absolutely disgusting" },
  { emoji: "🤷", label: "I don't care tbh" },
  { emoji: "🍍", label: "Only if extra pineapple" },
];

const SEED_VOTES = [312, 498, 89, 201];
const WINNER_LABELS = ["🤤 YESSS wins!", "🤮 NAY wins!", "🤷 Indifference wins!", "🍍 Extra Pineapple wins!"];
const CHART_COLORS = ["cb-pink", "cb-cyan", "cb-purple", "cb-amber"];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useCountUp(target, delay = 700, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const steps = 60;
      const step = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        setValue(Math.round(current));
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay, duration]);

  if (target >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (target >= 1_000) return (Math.round(value / 100) / 10) + "k";
  return String(value);
}

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 6 + "px";
        dotRef.current.style.top = e.clientY - 6 + "px";
        dotRef.current.style.display = "block";
      }
    };
    document.addEventListener("mousemove", move);
    let raf;
    const animRing = () => {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.12;
      p.ry += (p.my - p.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = p.rx - 18 + "px";
        ringRef.current.style.top = p.ry - 18 + "px";
        ringRef.current.style.display = "block";
      }
      raf = requestAnimationFrame(animRing);
    };
    animRing();
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="pb-cursor" style={{ display: "none" }} />
      <div ref={ringRef} className="pb-cursor-ring" style={{ display: "none" }} />
    </>
  );
}

function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random(),
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.opacity += Math.random() * 0.02 - 0.01;
        s.opacity = Math.max(0.05, Math.min(0.9, s.opacity));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="pb-starfield" />;
}

function Particles() {
  useEffect(() => {
    const colors = ["#f0187b", "#7c3aed", "#06d6d6"];
    const spawn = () => {
      const p = document.createElement("div");
      p.className = "pb-particle";
      const size = Math.random() * 4 + 2;
      const dur = Math.random() * 8 + 6;
      const delay = Math.random() * 2;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}vw;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${dur}s;animation-delay:${delay}s;box-shadow:0 0 ${size * 3}px currentColor;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), (dur + delay) * 1000 + 1000);
    };
    const id = setInterval(spawn, 800);
    return () => clearInterval(id);
  }, []);
  return null;
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="pb-ticker">
      <div className="pb-ticker-inner">
        {items.map((item, i) => (
          <div key={i} className="pb-ticker-item">
            <span className="pb-ticker-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose, onHowItWorks }) {
  if (!open) return null;
  return (
    <div className="pb-mobile-menu">
      <div className="pb-mobile-menu-inner">
        <button className="pb-mobile-close" onClick={onClose}><X size={22} /></button>
        <button className="pb-mobile-link" onClick={() => { onHowItWorks(); onClose(); }}>How it works</button>
        <Link to="/results" className="pb-mobile-link">Results</Link>
        <Link to="/login" className="pb-mobile-link" onClick={onClose}>Login</Link>
        <Link to="/register" className="pb-mobile-cta" onClick={onClose}>Start Polling →</Link>
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="pb-right-panel fade-up delay-3">
      <div className="pb-panel-glow" />
      <div className="pb-main-card">
        <div className="pb-card-header">
          <div>
            <div className="pb-card-title">Which Framework Wins? ⚛️</div>
            <div className="pb-card-sub">🔮 Poll Baba Predicts</div>
          </div>
          <div className="pb-live-pill">
            <span className="pb-dot-live" style={{ background: "#4ade80" }} />
            LIVE
          </div>
        </div>
        {[
          { label: "React ⚛️", pct: 74, color: "#f0187b", cls: "bar-pink", delay: "0.9s" },
          { label: "Vue 🍃", pct: 38, color: "#06d6d6", cls: "bar-cyan", delay: "1.1s" },
          { label: "Angular 😵", pct: 19, color: "#f59e0b", cls: "bar-amber", delay: "1.3s" },
        ].map((b) => (
          <div key={b.label} className="pb-poll-item">
            <div className="pb-poll-label-row">
              <span className="pb-poll-label">{b.label}</span>
              <span className="pb-poll-pct" style={{ color: b.color }}>{b.pct}%</span>
            </div>
            <div className="pb-bar-track">
              <div className={`pb-bar-fill ${b.cls}`} style={{ width: `${b.pct}%`, animationDelay: b.delay }}>
                <span className="pb-bar-glow" />
              </div>
            </div>
          </div>
        ))}
        <div className="pb-mini-grid">
          {[
            { icon: "👥", val: "2.4k", label: "Humans", color: "#f0187b" },
            { icon: "🗳️", val: "850", label: "Polls", color: "#06d6d6" },
            { icon: "🔥", val: "HOT", label: "Debates", color: "#f59e0b" },
          ].map((m) => (
            <div key={m.label} className="pb-mini-card">
              <div className="pb-mini-icon">{m.icon}</div>
              <div className="pb-mini-val" style={{ color: m.color }}>{m.val}</div>
              <div className="pb-mini-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractivePoll() {
  const [votes, setVotes] = useState([...SEED_VOTES]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIdx, setVotedIdx] = useState(null);
  const [ref, visible] = useScrollReveal();

  const total = votes.reduce((a, b) => a + b, 0);
  const pcts = votes.map((v) => (total > 0 ? Math.round((v / total) * 100) : 0));
  const winIdx = votes.indexOf(Math.max(...votes));

  const castVote = (idx) => {
    if (hasVoted) return;
    setVotes((prev) => prev.map((v, i) => (i === idx ? v + 1 : v)));
    setHasVoted(true);
    setVotedIdx(idx);
  };

  return (
    <section
      className="pb-section"
      ref={ref}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s cubic-bezier(0.34,1.1,0.64,1)" }}
    >
      <div className="pb-demo-card">
        <div className="pb-demo-inner">
          <div className="pb-demo-left">
            <h2 className="pb-demo-title">
              Try a Live Poll <span className="pb-gradient-text">Right Now</span>
            </h2>
            <p className="pb-demo-desc">No signup needed. Just vote and see the magic happen in real time.</p>
            <div className="pb-poll-question">🍕 Pineapple on Pizza — yay or nay?</div>
            <div className="pb-poll-options">
              {POLL_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  className={`pb-poll-opt${votedIdx === i ? " voted" : ""}`}
                  onClick={() => castVote(i)}
                >
                  <span className="pb-opt-bar" style={{ width: hasVoted ? pcts[i] + "%" : "0%" }} />
                  <span className="pb-opt-emoji">{opt.emoji}</span>
                  <span className="pb-opt-text">{opt.label}</span>
                  {hasVoted && <span className="pb-opt-pct">{pcts[i]}%</span>}
                  {votedIdx === i && <span className="pb-opt-check">✓</span>}
                </button>
              ))}
            </div>
            <div className="pb-total-votes">
              {hasVoted ? `${total.toLocaleString()} votes cast worldwide` : "Cast your vote above 👆"}
            </div>
          </div>
          <div className="pb-results-wrap">
            <div className="pb-results-panel">
              <div className="pb-results-title">📊 Live Results</div>
              <div className="pb-chart-bars">
                {POLL_OPTIONS.map((opt, i) => (
                  <div key={i} className="pb-chart-bar-wrap">
                    <div className="pb-chart-pct">{pcts[i]}%</div>
                    <div className="pb-chart-bar-outer">
                      <div className={`pb-chart-bar-inner ${CHART_COLORS[i]}`} style={{ height: pcts[i] + "%" }} />
                    </div>
                    <div className="pb-chart-label">{opt.emoji}</div>
                  </div>
                ))}
              </div>
              <div className="pb-winner-text" style={{ color: hasVoted ? "#f0187b" : "rgba(255,255,255,0.4)" }}>
                {hasVoted ? `Leading: ${WINNER_LABELS[winIdx]}` : "Waiting for votes..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RevealSection({ children, className = "" }) {
  const [ref, visible] = useScrollReveal();
  return (
    <section
      ref={ref}
      className={`pb-section ${className}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 0.7s cubic-bezier(0.34,1.1,0.64,1)" }}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
function Home() {
  const votes1 = useCountUp(2_400_000);
  const votes2 = useCountUp(850);
  const [menuOpen, setMenuOpen] = useState(false);
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-root">
      <style>{CSS}</style>
      <Cursor />
      <Starfield />
      <Particles />
      <div className="pb-grid-bg" />
      <div className="pb-orb pb-orb-1" />
      <div className="pb-orb pb-orb-2" />
      <div className="pb-orb pb-orb-3" />

      {/* MOBILE MENU */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onHowItWorks={scrollToHowItWorks} />

      {/* NAV */}
      <nav className="pb-nav">
        <div className="pb-logo">
          <div className="pb-logo-glow" />
          <img src={logo} alt="Poll Baba" className="pb-logo-img" />
          <span className="pb-nav-badge"><span className="pb-dot-live" /> LIVE</span>
        </div>
        <div className="pb-nav-links">
          <button className="pb-nav-link" onClick={scrollToHowItWorks}>How it works</button>
          <Link to="/results" className="pb-nav-link">Results</Link>
          <Link to="/login" className="pb-btn-ghost">Login</Link>
          <Link to="/register" className="pb-btn-primary"><span>Start Polling →</span></Link>
        </div>
        <button className="pb-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
      </nav>

      {/* TICKER */}
      <Ticker />

      {/* HERO */}
      <section className="pb-hero">
        <div className="pb-hero-left">
          <div className="pb-eyebrow fade-up delay-1"><span className="pb-dot-live" /> Human opinions are weird 🤡</div>
          <h1 className="pb-h1 fade-up delay-2">
            Ask The<br />
            <span className="pb-gradient-text">Internet</span><br />
            Dumb Stuff
          </h1>
          <p className="pb-hero-desc fade-up delay-3">
            Build hilarious polls, predict chaotic human opinions, collect realtime votes and watch your analytics explode live.
          </p>
          <div className="pb-cta-group fade-up delay-4">
            <Link to="/register" className="pb-btn-hero">
              Create a Poll <ArrowRight size={18} className="pb-arrow" />
            </Link>
            <button className="pb-btn-outline-hero" onClick={scrollToHowItWorks}>
              How it works ↓
            </button>
          </div>
          <div className="pb-stats fade-up delay-5">
            <div className="pb-stat">
              <h3 className="pb-stat-num">{votes1}</h3>
              <p className="pb-stat-label">WEIRD VOTES</p>
            </div>
            <div className="pb-stat-divider" />
            <div className="pb-stat">
              <h3 className="pb-stat-num">{votes2}</h3>
              <p className="pb-stat-label">CHAOS POLLS</p>
            </div>
            <div className="pb-stat-divider" />
            <div className="pb-stat">
              <h3 className="pb-stat-num pb-gradient-text">LIVE</h3>
              <p className="pb-stat-label">HUMAN DRAMA</p>
            </div>
          </div>
        </div>
        <HeroCard />
      </section>

      {/* HOW IT WORKS — anchor target */}
      <div ref={howItWorksRef} style={{ scrollMarginTop: "80px" }}>
        <RevealSection>
          <div className="pb-section-label">✦ Simple as chaos</div>
          <div className="pb-section-title">How It Works</div>
          <div className="pb-steps">
            {STEPS.map((s) => (
              <div key={s.num} className="pb-step">
                <div className="pb-step-num">{s.num}</div>
                <div className="pb-step-title">{s.title}</div>
                <div className="pb-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>

      {/* INTERACTIVE POLL */}
      <InteractivePoll />

      {/* FEATURES */}
      <RevealSection>
        <div className="pb-section-label">✦ Why people love Poll Baba</div>
        <div className="pb-section-title">Serious Tech.<br /><span className="pb-gradient-text">Funny Experience 😂</span></div>
        <div className="pb-feat-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="pb-feat-card">
              <div className="pb-feat-icon">{f.icon}</div>
              <div className="pb-feat-title">{f.title}</div>
              <div className="pb-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* TESTIMONIALS */}
      <RevealSection>
        <div className="pb-section-label">✦ What humans are saying</div>
        <div className="pb-section-title">Loved by Chaos<br /><span className="pb-gradient-text">Enthusiasts 🤡</span></div>
        <div className="pb-testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="pb-testi-card">
              <div className="pb-testi-stars">{"★".repeat(t.stars)}</div>
              <div className="pb-testi-text">{t.text}</div>
              <div className="pb-testi-author">
                <div className="pb-testi-avatar" style={{ background: t.color }}>{t.avatar}</div>
                <div>
                  <div className="pb-testi-name">{t.name}</div>
                  <div className="pb-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* CTA BANNER */}
      <RevealSection className="pb-cta-section">
        <div className="pb-cta-banner">
          <h2 className="pb-cta-title">Ready to Break<br /><span className="pb-gradient-text">The Internet? 🚀</span></h2>
          <p className="pb-cta-desc">Join thousands of chaos creators. Build your first poll in 30 seconds. No credit card. Just vibes.</p>
          <div className="pb-cta-btns">
            <Link to="/register" className="pb-btn-cta">Start Polling Free →</Link>
            <button className="pb-btn-cta-ghost" onClick={scrollToHowItWorks}>How It Works ↑</button>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CSS — scoped with pb- prefix, fully responsive
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

.pb-root { background:#04000f; color:#fff; font-family:'DM Sans',sans-serif; overflow-x:hidden; cursor:none; min-height:100vh; }
.pb-root * { box-sizing:border-box; margin:0; padding:0; }
@media (pointer:coarse) { .pb-root { cursor:auto; } }

.pb-cursor { position:fixed; width:12px; height:12px; background:#f0187b; border-radius:50%; pointer-events:none; z-index:9999; mix-blend-mode:screen; transition:transform 0.1s; }
.pb-cursor-ring { position:fixed; width:36px; height:36px; border:1px solid rgba(240,24,123,0.5); border-radius:50%; pointer-events:none; z-index:9998; transition:all 0.15s; }

.pb-starfield { position:fixed; top:0; left:0; width:100%; height:100%; z-index:0; pointer-events:none; }

.pb-particle { position:fixed; border-radius:50%; pointer-events:none; z-index:1; animation:pb-particleDrift linear infinite; opacity:0; }
@keyframes pb-particleDrift { 0%{transform:translateY(100vh) scale(0);opacity:0} 10%{opacity:1} 90%{opacity:0.5} 100%{transform:translateY(-100px) scale(1);opacity:0} }

.pb-grid-bg { position:fixed; top:0; left:0; width:100%; height:100%; background-image:linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px); background-size:60px 60px; animation:pb-gridDrift 20s linear infinite; z-index:0; pointer-events:none; }
@keyframes pb-gridDrift { 0%{background-position:0 0} 100%{background-position:60px 60px} }

.pb-orb { position:fixed; border-radius:50%; filter:blur(120px); pointer-events:none; z-index:0; }
.pb-orb-1 { width:600px; height:600px; background:rgba(124,58,237,0.15); top:-200px; left:-200px; animation:pb-orbFloat1 12s ease-in-out infinite; }
.pb-orb-2 { width:500px; height:500px; background:rgba(240,24,123,0.12); bottom:-100px; right:-100px; animation:pb-orbFloat2 15s ease-in-out infinite; }
.pb-orb-3 { width:300px; height:300px; background:rgba(6,214,214,0.08); top:50%; left:50%; animation:pb-orbFloat3 18s ease-in-out infinite; }
@keyframes pb-orbFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(80px,60px)} }
@keyframes pb-orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-60px,-80px)} }
@keyframes pb-orbFloat3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.4)} }

/* NAV */
.pb-nav { position:sticky; top:0; z-index:200; background:rgba(4,0,15,0.88); backdrop-filter:blur(20px); border-bottom:1px solid rgba(124,58,237,0.15); padding:0 48px; height:72px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.pb-logo { display:flex; align-items:center; gap:8px; position:relative; flex-shrink:0; }
.pb-logo-glow { position:absolute; inset:0; background:rgba(240,24,123,0.15); filter:blur(40px); border-radius:50%; pointer-events:none; }
.pb-logo-img { position:relative; width:150px; object-fit:contain; transition:transform 0.3s; }
.pb-logo-img:hover { transform:scale(1.05); }
.pb-nav-badge { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:500; background:rgba(240,24,123,0.12); border:1px solid rgba(240,24,123,0.25); color:rgba(255,180,210,0.9); padding:3px 9px; border-radius:20px; animation:pb-badgePulse 2s ease-in-out infinite; white-space:nowrap; }
@keyframes pb-badgePulse { 0%,100%{opacity:0.8} 50%{opacity:1;box-shadow:0 0 12px rgba(240,24,123,0.3)} }
.pb-dot-live { width:6px; height:6px; border-radius:50%; background:#f0187b; display:inline-block; animation:pb-livePulse 1.2s ease-in-out infinite; flex-shrink:0; }
@keyframes pb-livePulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.5} }
.pb-nav-links { display:flex; align-items:center; gap:10px; }
.pb-nav-link { font-size:14px; color:rgba(255,255,255,0.5); background:none; border:none; cursor:pointer; padding:6px 12px; transition:color 0.2s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
.pb-nav-link:hover { color:#fff; }
.pb-btn-ghost { padding:8px 18px; border-radius:12px; font-size:14px; font-weight:500; border:1px solid rgba(124,58,237,0.3); color:rgba(255,255,255,0.8); background:transparent; cursor:pointer; transition:all 0.25s; font-family:'DM Sans',sans-serif; text-decoration:none; display:inline-flex; align-items:center; white-space:nowrap; }
.pb-btn-ghost:hover { border-color:#f0187b; background:rgba(240,24,123,0.08); color:#fff; }
.pb-btn-primary { padding:9px 20px; border-radius:12px; font-size:14px; font-weight:500; background:linear-gradient(135deg,#f0187b,#7c3aed); color:#fff; border:none; cursor:pointer; position:relative; overflow:hidden; font-family:'DM Sans',sans-serif; transition:transform 0.2s; text-decoration:none; display:inline-flex; align-items:center; white-space:nowrap; }
.pb-btn-primary:hover { transform:scale(1.04); }
.pb-hamburger { display:none; background:none; border:1px solid rgba(124,58,237,0.3); border-radius:10px; color:#fff; padding:8px 10px; cursor:pointer; transition:all 0.2s; align-items:center; justify-content:center; flex-shrink:0; }
.pb-hamburger:hover { border-color:#f0187b; background:rgba(240,24,123,0.08); }

/* MOBILE MENU */
.pb-mobile-menu { position:fixed; inset:0; z-index:999; background:rgba(4,0,15,0.97); backdrop-filter:blur(24px); display:flex; align-items:center; justify-content:center; animation:pb-fadeIn 0.2s ease; }
@keyframes pb-fadeIn { from{opacity:0} to{opacity:1} }
.pb-mobile-menu-inner { display:flex; flex-direction:column; align-items:center; gap:20px; width:100%; padding:40px 32px; }
.pb-mobile-close { background:none; border:1px solid rgba(124,58,237,0.3); border-radius:10px; color:#fff; padding:10px; cursor:pointer; margin-bottom:12px; display:flex; align-items:center; }
.pb-mobile-link { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:rgba(255,255,255,0.7); background:none; border:none; cursor:pointer; transition:color 0.2s; text-decoration:none; }
.pb-mobile-link:hover { color:#fff; }
.pb-mobile-cta { margin-top:12px; padding:15px 40px; border-radius:16px; font-size:17px; font-weight:600; background:linear-gradient(135deg,#f0187b,#7c3aed); color:#fff; border:none; cursor:pointer; text-decoration:none; font-family:'Syne',sans-serif; box-shadow:0 0 40px rgba(240,24,123,0.35); }

/* TICKER */
.pb-ticker { overflow:hidden; padding:10px 0; position:relative; z-index:10; }
.pb-ticker-inner { display:flex; gap:20px; animation:pb-tickerMove 22s linear infinite; width:max-content; }
@keyframes pb-tickerMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.pb-ticker-item { display:flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,0.3); white-space:nowrap; padding:6px 14px; border-radius:20px; background:rgba(255,255,255,0.02); border:1px solid rgba(124,58,237,0.08); }
.pb-ticker-dot { width:5px; height:5px; border-radius:50%; background:#f0187b; display:inline-block; flex-shrink:0; }

/* HERO */
.pb-hero { position:relative; z-index:10; padding:80px 48px 80px; max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
.fade-up { opacity:0; transform:translateY(30px); animation:pb-fadeUp 0.7s ease forwards; }
@keyframes pb-fadeUp { to{opacity:1;transform:translateY(0)} }
.delay-1{animation-delay:0.1s} .delay-2{animation-delay:0.25s} .delay-3{animation-delay:0.4s} .delay-4{animation-delay:0.55s} .delay-5{animation-delay:0.7s}
.pb-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:rgba(240,24,123,0.9); padding:6px 14px; border-radius:20px; background:rgba(240,24,123,0.08); border:1px solid rgba(240,24,123,0.2); margin-bottom:28px; }
.pb-h1 { font-family:'Syne',sans-serif; font-size:clamp(38px,5vw,70px); font-weight:800; line-height:0.95; letter-spacing:-2px; margin-bottom:24px; }
.pb-gradient-text { background:linear-gradient(135deg,#f0187b 0%,#a855f7 50%,#06d6d6 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:200% auto; animation:pb-gradientShift 4s linear infinite; }
@keyframes pb-gradientShift { 0%{background-position:0%} 100%{background-position:200%} }
.pb-hero-desc { color:rgba(255,255,255,0.55); font-size:16px; line-height:1.7; max-width:480px; margin-bottom:36px; }
.pb-cta-group { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
.pb-btn-hero { padding:13px 24px; border-radius:16px; font-size:15px; font-weight:500; background:linear-gradient(135deg,#f0187b,#7c3aed); color:#fff; border:none; cursor:pointer; display:flex; align-items:center; gap:8px; position:relative; overflow:hidden; transition:transform 0.2s; font-family:'DM Sans',sans-serif; box-shadow:0 0 40px rgba(240,24,123,0.35); text-decoration:none; }
.pb-btn-hero::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); animation:pb-shimmer 2.5s ease-in-out infinite; }
@keyframes pb-shimmer { 0%{left:-100%} 100%{left:200%} }
.pb-btn-hero:hover { transform:translateY(-2px) scale(1.02); }
.pb-arrow { transition:transform 0.2s; }
.pb-btn-hero:hover .pb-arrow { transform:translateX(4px); }
.pb-btn-outline-hero { padding:13px 24px; border-radius:16px; font-size:15px; font-weight:500; border:1px solid rgba(124,58,237,0.3); color:rgba(255,255,255,0.7); background:transparent; cursor:pointer; transition:all 0.25s; font-family:'DM Sans',sans-serif; }
.pb-btn-outline-hero:hover { border-color:rgba(6,214,214,0.5); color:#06d6d6; background:rgba(6,214,214,0.05); }
.pb-stats { display:flex; gap:20px; margin-top:44px; padding-top:36px; border-top:1px solid rgba(124,58,237,0.12); align-items:center; flex-wrap:wrap; }
.pb-stat-num { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; background:linear-gradient(135deg,#fff,rgba(255,255,255,0.6)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.pb-stat-label { font-size:10px; color:rgba(255,255,255,0.4); margin-top:3px; letter-spacing:0.06em; }
.pb-stat-divider { width:1px; height:44px; background:rgba(124,58,237,0.2); flex-shrink:0; }

/* HERO CARD */
.pb-right-panel { position:relative; }
.pb-panel-glow { position:absolute; inset:-40px; background:radial-gradient(ellipse at center,rgba(124,58,237,0.2) 0%,transparent 70%); animation:pb-panelGlow 4s ease-in-out infinite; pointer-events:none; }
@keyframes pb-panelGlow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
.pb-main-card { background:rgba(18,2,40,0.95); border:1px solid rgba(124,58,237,0.2); border-radius:26px; padding:24px; position:relative; z-index:1; backdrop-filter:blur(20px); overflow:hidden; }
.pb-main-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(240,24,123,0.6),transparent); animation:pb-scanLine 3s ease-in-out infinite; }
@keyframes pb-scanLine { 0%{opacity:0} 50%{opacity:1} 100%{opacity:0} }
.pb-card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; gap:10px; }
.pb-card-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; }
.pb-card-sub { font-size:11px; color:rgba(255,255,255,0.4); margin-top:3px; }
.pb-live-pill { display:flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:rgba(0,255,100,0.08); border:1px solid rgba(0,255,100,0.2); font-size:11px; color:#4ade80; font-weight:500; flex-shrink:0; }
.pb-poll-item { margin-bottom:16px; }
.pb-poll-label-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
.pb-poll-label { font-size:13px; font-weight:500; }
.pb-poll-pct { font-size:13px; font-weight:700; }
.pb-bar-track { height:7px; border-radius:20px; background:rgba(255,255,255,0.05); overflow:visible; position:relative; }
.pb-bar-fill { height:100%; border-radius:20px; position:relative; animation:pb-barGrow 1.2s cubic-bezier(0.34,1.56,0.64,1) forwards; }
@keyframes pb-barGrow { from{width:0} }
.bar-pink { background:linear-gradient(90deg,#f0187b,#a855f7); box-shadow:0 0 16px rgba(240,24,123,0.5); }
.bar-cyan { background:linear-gradient(90deg,#06d6d6,#3b82f6); box-shadow:0 0 16px rgba(6,214,214,0.4); }
.bar-amber { background:linear-gradient(90deg,#f59e0b,#ef4444); box-shadow:0 0 16px rgba(245,158,11,0.4); }
.pb-bar-glow { position:absolute; right:-4px; top:50%; transform:translateY(-50%); width:10px; height:10px; border-radius:50%; animation:pb-dotPulse 1.5s ease-in-out infinite; }
.bar-pink .pb-bar-glow { background:#f0187b; box-shadow:0 0 8px #f0187b; }
.bar-cyan .pb-bar-glow { background:#06d6d6; box-shadow:0 0 8px #06d6d6; }
.bar-amber .pb-bar-glow { background:#f59e0b; box-shadow:0 0 8px #f59e0b; }
@keyframes pb-dotPulse { 0%,100%{transform:translateY(-50%) scale(1)} 50%{transform:translateY(-50%) scale(1.5)} }
.pb-mini-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:16px; }
.pb-mini-card { background:rgba(255,255,255,0.03); border:1px solid rgba(124,58,237,0.12); border-radius:13px; padding:11px; transition:all 0.25s; cursor:default; }
.pb-mini-card:hover { background:rgba(124,58,237,0.08); border-color:rgba(124,58,237,0.3); transform:translateY(-2px); }
.pb-mini-icon { font-size:17px; margin-bottom:6px; }
.pb-mini-val { font-family:'Syne',sans-serif; font-size:19px; font-weight:800; }
.pb-mini-label { font-size:10px; color:rgba(255,255,255,0.4); margin-top:2px; }

/* SECTIONS */
.pb-section { position:relative; z-index:10; padding:80px 48px; max-width:1200px; margin:0 auto; }
.pb-cta-section { padding:40px 48px 100px; }
.pb-section-label { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:rgba(124,58,237,0.9); padding:6px 14px; border-radius:20px; background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.2); margin-bottom:24px; }
.pb-section-title { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,50px); font-weight:800; letter-spacing:-1.5px; line-height:1.05; margin-bottom:48px; }

/* STEPS */
.pb-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:0; position:relative; }
.pb-steps::before { content:''; position:absolute; top:32px; left:16%; right:16%; height:1px; background:linear-gradient(90deg,transparent,#7c3aed,#f0187b,#06d6d6,transparent); animation:pb-lineScan 3s ease-in-out infinite; }
@keyframes pb-lineScan { 0%,100%{opacity:0.3} 50%{opacity:1} }
.pb-step { text-align:center; padding:0 20px; }
.pb-step-num { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,rgba(240,24,123,0.2),rgba(124,58,237,0.3)); border:1px solid rgba(240,24,123,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-family:'Syne',sans-serif; font-size:20px; font-weight:800; position:relative; transition:all 0.3s; cursor:default; }
.pb-step-num::after { content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid rgba(240,24,123,0.15); animation:pb-stepRing 2s ease-in-out infinite; }
@keyframes pb-stepRing { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.15);opacity:0} }
.pb-step:hover .pb-step-num { background:linear-gradient(135deg,#f0187b,#7c3aed); box-shadow:0 0 40px rgba(240,24,123,0.5); }
.pb-step-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:10px; }
.pb-step-desc { font-size:14px; color:rgba(255,255,255,0.45); line-height:1.6; }

/* POLL DEMO */
.pb-demo-card { background:rgba(18,2,40,0.9); border:1px solid rgba(124,58,237,0.2); border-radius:26px; padding:36px; position:relative; overflow:hidden; }
.pb-demo-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#7c3aed,#f0187b,#06d6d6,#7c3aed); background-size:200%; animation:pb-borderFlow 3s linear infinite; }
@keyframes pb-borderFlow { 0%{background-position:0%} 100%{background-position:200%} }
.pb-demo-inner { display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:center; }
.pb-demo-title { font-family:'Syne',sans-serif; font-size:clamp(20px,3vw,28px); font-weight:800; letter-spacing:-0.5px; margin-bottom:10px; }
.pb-demo-desc { color:rgba(255,255,255,0.5); font-size:14px; line-height:1.6; margin-bottom:24px; }
.pb-poll-question { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:14px; }
.pb-poll-options { display:flex; flex-direction:column; gap:8px; }
.pb-poll-opt { width:100%; padding:11px 14px; border-radius:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(124,58,237,0.2); color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; cursor:pointer; text-align:left; transition:all 0.25s; display:flex; align-items:center; gap:10px; position:relative; overflow:hidden; }
.pb-poll-opt:hover { border-color:rgba(240,24,123,0.4); background:rgba(240,24,123,0.06); }
.pb-poll-opt.voted { border-color:#f0187b; background:rgba(240,24,123,0.12); pointer-events:none; }
.pb-opt-bar { position:absolute; left:0; top:0; height:100%; background:linear-gradient(90deg,rgba(240,24,123,0.15),transparent); border-radius:12px; transition:width 0.8s cubic-bezier(0.34,1.1,0.64,1); }
.pb-opt-emoji { font-size:16px; position:relative; z-index:1; }
.pb-opt-text { position:relative; z-index:1; flex:1; }
.pb-opt-pct { position:relative; z-index:1; font-size:12px; color:rgba(255,255,255,0.5); font-weight:500; }
.pb-opt-check { position:relative; z-index:1; color:#f0187b; font-weight:700; }
.pb-total-votes { margin-top:12px; font-size:12px; color:rgba(255,255,255,0.35); text-align:center; }
.pb-results-panel { background:rgba(255,255,255,0.02); border:1px solid rgba(124,58,237,0.1); border-radius:18px; padding:20px; }
.pb-results-title { font-size:12px; font-weight:500; color:rgba(255,255,255,0.4); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:16px; }
.pb-chart-bars { display:flex; align-items:flex-end; gap:10px; height:120px; }
.pb-chart-bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; }
.pb-chart-bar-outer { width:100%; flex:1; background:rgba(255,255,255,0.04); border-radius:7px; display:flex; align-items:flex-end; overflow:hidden; }
.pb-chart-bar-inner { width:100%; border-radius:7px; transition:height 0.8s cubic-bezier(0.34,1.1,0.64,1); }
.cb-pink { background:linear-gradient(180deg,#f0187b,rgba(240,24,123,0.4)); }
.cb-cyan { background:linear-gradient(180deg,#06d6d6,rgba(6,214,214,0.4)); }
.cb-purple { background:linear-gradient(180deg,#a855f7,rgba(168,85,247,0.4)); }
.cb-amber { background:linear-gradient(180deg,#f59e0b,rgba(245,158,11,0.4)); }
.pb-chart-label { font-size:11px; color:rgba(255,255,255,0.4); }
.pb-chart-pct { font-family:'Syne',sans-serif; font-size:12px; font-weight:700; }
.pb-winner-text { margin-top:16px; padding-top:13px; border-top:1px solid rgba(124,58,237,0.1); font-size:13px; text-align:center; transition:color 0.5s; }

/* FEATURES */
.pb-feat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:13px; }
.pb-feat-card { background:rgba(18,2,40,0.6); border:1px solid rgba(124,58,237,0.1); border-radius:20px; padding:22px 18px; position:relative; overflow:hidden; transition:all 0.3s; cursor:default; }
.pb-feat-card::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at top left,rgba(240,24,123,0.08),transparent 60%); opacity:0; transition:opacity 0.3s; }
.pb-feat-card:hover { border-color:rgba(240,24,123,0.3); transform:translateY(-6px); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
.pb-feat-card:hover::after { opacity:1; }
.pb-feat-icon { width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,rgba(240,24,123,0.2),rgba(124,58,237,0.2)); border:1px solid rgba(240,24,123,0.2); display:flex; align-items:center; justify-content:center; margin-bottom:16px; transition:transform 0.3s; color:#fff; }
.pb-feat-card:hover .pb-feat-icon { transform:scale(1.1) rotate(-5deg); }
.pb-feat-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; margin-bottom:8px; }
.pb-feat-desc { font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; }

/* TESTIMONIALS */
.pb-testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.pb-testi-card { background:rgba(18,2,40,0.8); border:1px solid rgba(124,58,237,0.12); border-radius:20px; padding:22px; transition:all 0.3s; cursor:default; position:relative; overflow:hidden; }
.pb-testi-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#f0187b,#7c3aed); transform:scaleX(0); transition:transform 0.3s; transform-origin:left; }
.pb-testi-card:hover { border-color:rgba(240,24,123,0.25); transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4); }
.pb-testi-card:hover::after { transform:scaleX(1); }
.pb-testi-stars { color:#f0187b; font-size:13px; margin-bottom:11px; letter-spacing:2px; }
.pb-testi-text { font-size:13px; color:rgba(255,255,255,0.6); line-height:1.7; margin-bottom:16px; font-style:italic; }
.pb-testi-author { display:flex; align-items:center; gap:10px; }
.pb-testi-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px; border:1px solid rgba(240,24,123,0.2); flex-shrink:0; }
.pb-testi-name { font-size:13px; font-weight:500; }
.pb-testi-role { font-size:11px; color:rgba(255,255,255,0.35); }

/* CTA BANNER */
.pb-cta-banner { background:linear-gradient(135deg,rgba(240,24,123,0.12),rgba(124,58,237,0.15),rgba(6,214,214,0.08)); border:1px solid rgba(240,24,123,0.2); border-radius:26px; padding:60px 48px; text-align:center; position:relative; overflow:hidden; }
.pb-cta-title { font-family:'Syne',sans-serif; font-size:clamp(26px,4vw,50px); font-weight:800; letter-spacing:-1.5px; margin-bottom:14px; }
.pb-cta-desc { color:rgba(255,255,255,0.5); font-size:16px; max-width:480px; margin:0 auto 32px; line-height:1.6; }
.pb-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.pb-btn-cta { padding:14px 30px; border-radius:15px; font-size:15px; font-weight:500; background:linear-gradient(135deg,#f0187b,#7c3aed); color:#fff; border:none; cursor:pointer; position:relative; overflow:hidden; transition:transform 0.2s; font-family:'DM Sans',sans-serif; box-shadow:0 0 40px rgba(240,24,123,0.35); text-decoration:none; display:inline-flex; align-items:center; }
.pb-btn-cta::after { content:''; position:absolute; top:0; left:-100%; width:60%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent); animation:pb-shimmer 2s ease-in-out infinite; }
.pb-btn-cta:hover { transform:scale(1.04) translateY(-2px); }
.pb-btn-cta-ghost { padding:14px 30px; border-radius:15px; font-size:15px; font-weight:500; border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.7); background:transparent; cursor:pointer; transition:all 0.25s; font-family:'DM Sans',sans-serif; }
.pb-btn-cta-ghost:hover { border-color:rgba(6,214,214,0.4); color:#06d6d6; }

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */

/* Tablet */
@media (max-width:1024px) {
  .pb-nav { padding:0 28px; }
  .pb-hero { padding:60px 28px; gap:36px; }
  .pb-section { padding:60px 28px; }
  .pb-cta-section { padding:30px 28px 70px; }
  .pb-feat-grid { grid-template-columns:repeat(2,1fr); }
  .pb-demo-inner { gap:24px; }
  .pb-logo-img { width:130px; }
}

/* Mobile — hide desktop nav, show hamburger */
@media (max-width:768px) {
  .pb-nav { padding:0 18px; height:62px; }
  .pb-nav-links { display:none !important; }
  .pb-hamburger { display:flex; }
  .pb-logo-img { width:120px; }
  .pb-nav-badge { display:none; }

  .pb-hero { grid-template-columns:1fr; padding:40px 20px 36px; gap:32px; }
  .pb-hero-left { order:1; }
  .pb-right-panel { order:2; }

  .pb-h1 { font-size:clamp(34px,10vw,52px); letter-spacing:-1.5px; }
  .pb-hero-desc { font-size:15px; max-width:100%; }
  .pb-cta-group { flex-direction:column; align-items:stretch; }
  .pb-btn-hero, .pb-btn-outline-hero { justify-content:center; text-align:center; }
  .pb-stats { gap:14px; justify-content:flex-start; }
  .pb-stat-num { font-size:24px; }
  .pb-stat-divider { height:36px; }

  .pb-section { padding:44px 20px; }
  .pb-cta-section { padding:16px 20px 56px; }
  .pb-section-title { margin-bottom:32px; letter-spacing:-1px; }

  .pb-steps { grid-template-columns:1fr; gap:28px; padding:0; }
  .pb-steps::before { display:none; }
  .pb-step { padding:0; text-align:left; display:flex; flex-direction:row; gap:20px; align-items:flex-start; }
  .pb-step-num { margin:0; flex-shrink:0; width:52px; height:52px; font-size:18px; }
  .pb-step-title { margin-bottom:6px; }

  .pb-demo-card { padding:22px 18px; }
  .pb-demo-inner { grid-template-columns:1fr; gap:24px; }
  .pb-results-wrap { order:-1; }
  .pb-chart-bars { height:90px; }

  .pb-feat-grid { grid-template-columns:1fr 1fr; gap:10px; }
  .pb-feat-card { padding:16px 13px; }
  .pb-feat-title { font-size:14px; }
  .pb-feat-desc { font-size:12px; }

  .pb-testi-grid { grid-template-columns:1fr; gap:12px; }

  .pb-cta-banner { padding:32px 20px; border-radius:18px; }
  .pb-cta-btns { flex-direction:column; align-items:stretch; }
  .pb-btn-cta, .pb-btn-cta-ghost { justify-content:center; width:100%; }

  .pb-main-card { padding:20px; }
  .pb-mini-grid { gap:6px; }
  .pb-mini-val { font-size:16px; }
}

/* Small phones */
@media (max-width:420px) {
  .pb-feat-grid { grid-template-columns:1fr; }
  .pb-h1 { font-size:clamp(30px,9vw,40px); }
  .pb-demo-title { font-size:20px; }
  .pb-poll-question { font-size:15px; }
}
`;

export default Home;