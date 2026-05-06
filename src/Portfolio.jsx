import { useEffect, useRef, useState } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0f1a;
    --bg2: #0f1422;
    --bg3: #141829;
    --slate: #1e2438;
    --slate2: #252d44;
    --border: rgba(148,163,184,0.1);
    --border2: rgba(148,163,184,0.18);
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #64748b;
    --accent: #c8d6e8;
    --accent2: #7b9cbf;
    --white: #f8fafc;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    cursor: none;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── CUSTOM CURSOR ── */
  .cursor-dot {
    position: fixed;
    width: 7px;
    height: 7px;
    background: var(--white);
    border-radius: 50%;
    pointer-events: none;
    z-index: 8999;
    transform: translate(-50%, -50%);
    transition: width 0.15s, height 0.15s, background 0.15s;
  }
  body.cursor-hover .cursor-dot {
    width: 10px;
    height: 10px;
    background: var(--accent2);
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--slate2); border-radius: 2px; }

  /* ── LOADER ── */
  .loader {
    position: fixed;
    inset: 0;
    z-index: 9000;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1.5rem;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }
  .loader.hide { opacity: 0; visibility: hidden; pointer-events: none; }
  .loader-logo {
    font-family: var(--font-display);
    font-size: 5rem;
    color: var(--white);
    letter-spacing: 0.1em;
    animation: loaderPulse 1s ease infinite alternate;
  }
  .loader-bar-wrap {
    width: 180px;
    height: 1px;
    background: var(--slate);
    overflow: hidden;
  }
  .loader-bar {
    height: 100%;
    background: var(--accent2);
    animation: loaderFill 1.4s ease forwards;
  }
  @keyframes loaderPulse { from { opacity: 0.4; } to { opacity: 1; } }
  @keyframes loaderFill { from { width: 0%; } to { width: 100%; } }


  /* ── NOISE OVERLAY ── */
  .noise {
    position: fixed;
    inset: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: noiseShift 0.5s steps(2) infinite;
  }
  @keyframes noiseShift {
    0%   { transform: translate(0,0); }
    25%  { transform: translate(-2%,-1%); }
    50%  { transform: translate(1%,2%); }
    75%  { transform: translate(2%,-2%); }
    100% { transform: translate(-1%,1%); }
  }

  /* ── GRADIENT ORBS ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
    opacity: 0.12;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #3b5fa0 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: orbFloat1 18s ease-in-out infinite alternate;
  }
  .orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #1e3a5f 0%, transparent 70%);
    bottom: 10%; right: -80px;
    animation: orbFloat2 22s ease-in-out infinite alternate;
  }
  .orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #2d4a7a 0%, transparent 70%);
    top: 50%; left: 40%;
    animation: orbFloat3 15s ease-in-out infinite alternate;
  }
  @keyframes orbFloat1 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,80px) scale(1.15); } }
  @keyframes orbFloat2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-50px,-60px) scale(1.1); } }
  @keyframes orbFloat3 { from { transform: translate(0,0) scale(1); } to { transform: translate(40px,-40px) scale(0.9); } }

  /* ── NAV ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
  }
  .nav.scrolled {
    background: rgba(11,15,26,0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: var(--white);
    text-decoration: none;
    position: relative;
  }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; }
  .nav-links a {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    color: var(--text2);
    text-decoration: none;
    text-transform: uppercase;
    position: relative;
    transition: color 0.2s;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1px;
    background: var(--accent2);
    transition: width 0.3s ease;
  }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { width: 100%; }
  .btn-resume-nav {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--border2);
    padding: 0.4rem 1rem;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .btn-resume-nav:hover {
    color: var(--white);
    border-color: var(--accent2);
    background: rgba(123,156,191,0.08);
  }
  .btn-resume-nav::after { display: none !important; }

  /* ── MARQUEE ── */
  .marquee-wrap {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 100;
    height: 34px;
    background: rgba(11,15,26,0.9);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .marquee-track {
    display: flex;
    animation: marquee 32s linear infinite;
    white-space: nowrap;
  }
  .marquee-track span {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: var(--text3);
    text-transform: uppercase;
    padding: 0 2.5rem;
  }
  .marquee-track span.accent { color: var(--accent2); }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── SECTIONS ── */
  section {
    padding: 5rem 3rem;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }
  .section-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    color: var(--accent2);
    text-transform: uppercase;
    margin-bottom: 1.2rem;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  h2.section-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 6vw, 5.5rem);
    letter-spacing: 0.03em;
    line-height: 1;
    color: var(--white);
    margin-bottom: 2rem;
    overflow: hidden;
  }
  .title-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.6s ease, transform 0.6s ease;
    margin-right: 0.25em;
  }

  /* ── STAGGER FADE ── */
  .reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .section-label.visible { opacity: 1; transform: translateY(0); }
  .title-word.visible { opacity: 1; transform: translateY(0); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 64px;
    padding-bottom: 36px;
    position: relative;
    z-index: 2;
  }
  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    color: var(--accent2);
    text-transform: uppercase;
    margin-bottom: 1.8rem;
    opacity: 0;
    animation: fadeUp 0.7s 0.3s forwards ease;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(4.5rem, 12vw, 10.5rem);
    letter-spacing: 0.02em;
    line-height: 0.9;
    color: var(--white);
    margin-bottom: 2rem;
    overflow: hidden;
  }
  .hero-title-line {
    display: block;
    overflow: hidden;
  }
  .hero-title-inner {
    display: block;
    opacity: 0;
    transform: translateY(110%);
    animation: slideUp 0.8s forwards cubic-bezier(0.16,1,0.3,1);
  }
  .hero-title-line:nth-child(1) .hero-title-inner { animation-delay: 0.4s; }
  .hero-title-line:nth-child(2) .hero-title-inner { animation-delay: 0.55s; }
  .hero-title-line:nth-child(3) .hero-title-inner { animation-delay: 0.7s; color: var(--accent2); }

  .hero-sub {
    font-size: 1rem;
    color: var(--text2);
    font-weight: 300;
    max-width: 460px;
    line-height: 1.75;
    margin-bottom: 2.5rem;
    opacity: 0;
    animation: fadeUp 0.7s 1s forwards ease;
  }
  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.7s 1.15s forwards ease;
  }
  .btn-primary {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--bg);
    background: var(--accent);
    border: none;
    padding: 0.9rem 2.2rem;
    cursor: none;
    text-decoration: none;
    display: inline-block;
    position: relative;
    overflow: hidden;
    transition: color 0.3s;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--white);
    transform: translateX(-101%);
    transition: transform 0.35s cubic-bezier(0.76,0,0.24,1);
  }
  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary span { position: relative; z-index: 1; }

  .btn-ghost {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text2);
    background: transparent;
    border: 1px solid var(--border2);
    padding: 0.9rem 2.2rem;
    cursor: none;
    text-decoration: none;
    display: inline-block;
    transition: color 0.25s, border-color 0.25s, background 0.25s;
  }
  .btn-ghost:hover { color: var(--white); border-color: var(--accent2); background: rgba(123,156,191,0.06); }

  .hero-stats {
    display: flex;
    gap: 3.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.7s 1.3s forwards ease;
  }
  .stat-num {
    font-family: var(--font-display);
    font-size: 3rem;
    letter-spacing: 0.04em;
    color: var(--white);
    line-height: 1;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: var(--text3);
    text-transform: uppercase;
    margin-top: 0.4rem;
  }

  /* scroll indicator */
  .scroll-indicator {
    position: absolute;
    bottom: 2.5rem;
    right: 3rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    opacity: 0;
    animation: fadeUp 0.7s 1.6s forwards ease;
  }
  .scroll-line {
    width: 40px;
    height: 1px;
    background: var(--border2);
    position: relative;
    overflow: hidden;
  }
  .scroll-line::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--accent2);
    animation: scrollLine 2s 2s ease-in-out infinite;
  }
  @keyframes scrollLine { 0% { left: -100%; } 50% { left: 0%; } 100% { left: 100%; } }
  .scroll-text {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.2em;
    color: var(--text3);
    text-transform: uppercase;
  }

  @keyframes slideUp { from { opacity: 0; transform: translateY(110%); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* ── 3D TILT CARD ── */
  .tilt-card {
    transform-style: preserve-3d;
    transition: transform 0.1s ease;
  }

  /* ── ABOUT ── */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: start;
  }
  .about-text p {
    font-size: 1rem;
    color: var(--text2);
    line-height: 1.85;
    margin-bottom: 1.3rem;
  }
  .about-text p strong { color: var(--text); font-weight: 500; }

  .timeline { display: flex; flex-direction: column; gap: 0; }
  .timeline-item {
    display: flex;
    gap: 1.4rem;
    padding-bottom: 2rem;
    opacity: 0;
    transform: translateX(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .timeline-item.visible { opacity: 1; transform: translateX(0); }
  .timeline-item:last-child { padding-bottom: 0; }
  .tl-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 20px; }
  .tl-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; margin-top: 4px; }
  .tl-line { width: 1px; flex: 1; background: var(--border); margin-top: 4px; }
  .timeline-item:last-child .tl-line { display: none; }
  .tl-year { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.14em; color: var(--text3); text-transform: uppercase; margin-bottom: 0.25rem; }
  .tl-role { font-size: 0.9rem; font-weight: 500; color: var(--text); margin-bottom: 0.18rem; }
  .tl-place { font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent2); }

  /* ── PROJECTS ── */
  .projects-grid { display: flex; flex-direction: column; gap: 2px; }

  .project-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .project-card:hover { border-color: rgba(123,156,191,0.4); }

  /* spotlight effect */
  .project-card .spotlight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(123,156,191,0.06), transparent 40%);
  }
  .project-card:hover .spotlight { opacity: 1; }

  .featured { flex-direction: column; }

  .phone-strip {
    width: 100%;
    background: #060a12;
    padding: 3rem 2rem 0;
    display: flex;
    gap: 1.2rem;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
    position: relative;
    min-height: 380px;
  }
  .phone-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 100%, rgba(59,95,160,0.22) 0%, transparent 70%);
    pointer-events: none;
  }
  .phone-frame {
    flex: 1;
    max-width: 240px;
    min-width: 0;
    border-radius: 26px;
    border: 2px solid rgba(255,255,255,0.12);
    overflow: hidden;
    background: #000;
    box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
    transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .phone-frame:nth-child(1) { transform: rotate(-3deg) translateY(20px); }
  .phone-frame:nth-child(2) { transform: rotate(0deg) translateY(0); max-width: 260px; }
  .phone-frame:nth-child(3) { transform: rotate(3deg) translateY(20px); }
  .phone-strip:hover .phone-frame:nth-child(1) { transform: rotate(-1.5deg) translateY(10px) scale(1.02); }
  .phone-strip:hover .phone-frame:nth-child(2) { transform: rotate(0deg) translateY(-10px) scale(1.03); }
  .phone-strip:hover .phone-frame:nth-child(3) { transform: rotate(1.5deg) translateY(10px) scale(1.02); }
  .phone-frame img { width: 100%; display: block; }

  .project-body { padding: 2.2rem; display: flex; flex-direction: column; gap: 1rem; }
  .project-num { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.18em; color: var(--text3); }
  .project-title { font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.04em; color: var(--white); line-height: 1.05; }
  .project-tagline { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent2); letter-spacing: 0.08em; margin-top: 0.2rem; }
  .project-desc { font-size: 0.88rem; color: var(--text2); line-height: 1.75; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .tag {
    font-family: var(--font-mono);
    font-size: 0.58rem;
    letter-spacing: 0.1em;
    color: var(--text3);
    text-transform: uppercase;
    background: var(--slate);
    padding: 0.28rem 0.6rem;
    border: 1px solid var(--border);
    transition: color 0.2s, border-color 0.2s;
  }
  .tag:hover { color: var(--accent2); border-color: var(--accent2); }
  .project-link {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent2);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s;
    align-self: flex-start;
  }
  .project-link:hover { color: var(--white); }
  .project-link svg { width: 12px; height: 12px; transition: transform 0.2s; }
  .project-link:hover svg { transform: translate(3px,-3px); }

  .projects-secondary { display: grid; grid-template-columns: 1fr; gap: 2px; margin-top: 2px; }
  .projects-secondary .project-card { padding: 2.2rem; display: flex; flex-direction: column; gap: 1rem; }

  /* ── SKILLS ── */
  .skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); }
  .skill-group {
    background: var(--bg);
    padding: 2rem;
    transition: background 0.25s;
  }
  .skill-group:hover { background: var(--bg3); }
  .skill-group-label { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent2); margin-bottom: 1.4rem; }
  .skill-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .skill-list li {
    font-size: 0.87rem;
    color: var(--text2);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    transition: color 0.2s, transform 0.2s;
  }
  .skill-list li:hover { color: var(--text); transform: translateX(4px); }
  .skill-list li::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }

  /* ── CONTACT ── */
  .contact-inner { max-width: 680px; }
  .contact-inner p { font-size: 1rem; color: var(--text2); line-height: 1.85; margin-bottom: 1.8rem; }
  .contact-links { display: flex; flex-direction: column; gap: 2px; }
  .contact-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.8rem;
    background: var(--bg3);
    border: 1px solid var(--border);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .contact-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--slate);
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.76,0,0.24,1);
    z-index: 0;
  }
  .contact-link:hover { border-color: var(--accent2); }
  .contact-link:hover::before { transform: translateX(0); }
  .contact-link-left { display: flex; flex-direction: column; gap: 0.2rem; position: relative; z-index: 1; }
  .contact-link-type { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text3); }
  .contact-link-val { font-size: 0.95rem; color: var(--text); font-weight: 500; transition: color 0.3s; }
  .contact-link:hover .contact-link-val { color: var(--white); }
  .contact-arrow { color: var(--accent2); font-size: 1.1rem; transition: transform 0.3s; position: relative; z-index: 1; }
  .contact-link:hover .contact-arrow { transform: translate(4px,-4px); }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 2rem 3rem 4rem;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    position: relative;
    z-index: 2;
  }
  .footer-copy { font-family: var(--font-mono); font-size: 0.63rem; letter-spacing: 0.12em; color: var(--text3); }
  .footer-copy span { color: var(--accent2); }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .skills-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .nav { padding: 0 1.5rem; }
    .nav-links { display: none; }
    section { padding: 3.5rem 1.5rem; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .projects-secondary { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr 1fr; }
    footer { padding: 2rem 1.5rem 4rem; }
    .phone-frame { width: 120px; }
    .phone-strip { padding: 2rem 1.2rem 1rem; gap: 0.8rem; }
    .scroll-indicator { display: none; }
  }
  @media (max-width: 480px) {
    .skills-grid { grid-template-columns: 1fr; }
    .hero-stats { gap: 2rem; }
  }
`

const marqueeItems = [
  { text: 'AI / ML Engineer', accent: false },
  { text: '✦', accent: true },
  { text: 'React Developer', accent: false },
  { text: '✦', accent: true },
  { text: 'Interaction Designer', accent: false },
  { text: '✦', accent: true },
  { text: 'George Brown College', accent: false },
  { text: '✦', accent: true },
  { text: 'Applied AI Solutions', accent: false },
  { text: '✦', accent: true },
  { text: 'Toronto, Canada', accent: false },
  { text: '✦', accent: true },
  { text: 'Open to Co-op', accent: false },
  { text: '✦', accent: true },
  { text: 'From Training Bodies to Training Models', accent: false },
  { text: '✦', accent: true },
]

const timeline = [
  { year: '2026 – 2027', role: 'AI Solutions Student', place: 'George Brown College' },
  { year: '2021 – 2025', role: 'Client Services Coordinator', place: 'Avison Young' },
  { year: '2020 – 2021', role: 'Certified Personal Trainer', place: 'Hone Fitness' },
  { year: '2019 – 2021', role: 'Interaction Design & Development', place: 'George Brown College' },
]

const featuredProject = {
  num: '01',
  title: 'GameVibe',
  tagline: 'Find your Crowd. Find your Spot.',
  desc: 'A full-stack mobile app that helps fans find the best spots to watch World Cup 2026 matches in Toronto. Features real-time venue discovery, geolocation, crowd-type matching, interactive map, saved spots, and team-aware match scheduling.',
  tags: ['React Native', 'Firebase', 'Geolocation', 'Maps API', 'UX Design'],
  images: ['/images/gamevibe-1.PNG', '/images/gamevibe-2.PNG', '/images/gamevibe-3.PNG'],
  href: 'https://github.com/andrewomm',
}

const projects = [
  {
    num: '02',
    title: 'ScanWise',
    tagline: 'Scan it. Grade it. Know what you\'re eating.',
    desc: 'AI-powered nutrition barcode scanner. Scan any product, get a live nutrition breakdown, and receive a custom health grade based on macros, additives, and caloric density. Built with React Native and the Open Food Facts API.',
    tags: ['React Native', 'Expo', 'Open Food Facts API', 'Custom Algorithm', 'Git'],
    images: ['/images/Scanwise-1.png', '/images/Scanwise-2.png', '/images/Scanwise-3.png'],
    href: 'https://github.com/andrewomm',
  },
]

const skillGroups = [
  { label: 'AI / ML', skills: ['Python', 'PyTorch', 'scikit-learn', 'Hugging Face', 'LangChain', 'Prompt Engineering'] },
  { label: 'Frontend', skills: ['React', 'Vite', 'JavaScript (ES2024)', 'HTML / CSS', 'React Native'] },
  { label: 'Design', skills: ['Figma', 'Interaction Design', 'Responsive UI', 'Design Systems', 'UX Research'] },
  { label: 'Tools', skills: ['Git / GitHub', 'Firebase', 'Vercel', 'VS Code', 'Jupyter', 'Linux CLI'] },
]

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0)
  const ref = useRef()
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const dur = 1400
        const step = (ts) => {
          if (!start) start = ts
          const p = Math.min((ts - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{val}</span>
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const cursorDot = useRef(null)
  const rafRef = useRef(null)
  const revealRefs = useRef([])
  const tlRefs = useRef([])
  const sectionLabelRefs = useRef([])
  const titleWordRefs = useRef([])

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1600)
    return () => clearTimeout(t)
  }, [])


  // Cursor dot — instant, no lag
  useEffect(() => {
    const move = (e) => {
      if (cursorDot.current) {
        cursorDot.current.style.left = e.clientX + 'px'
        cursorDot.current.style.top = e.clientY + 'px'
      }
    }
    const addHover = () => document.body.classList.add('cursor-hover')
    const removeHover = () => document.body.classList.remove('cursor-hover')
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, .project-card, .contact-link').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })
    return () => window.removeEventListener('mousemove', move)
  }, [loaded])

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })

    const all = [
      ...revealRefs.current,
      ...tlRefs.current,
      ...sectionLabelRefs.current,
      ...titleWordRefs.current,
    ]
    all.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [loaded])

  // Staggered timeline delays
  useEffect(() => {
    tlRefs.current.forEach((el, i) => {
      if (el) el.style.transitionDelay = `${i * 0.12}s`
    })
  }, [loaded])

  // Staggered title word delays
  useEffect(() => {
    titleWordRefs.current.forEach((el, i) => {
      if (el) el.style.transitionDelay = `${i * 0.08}s`
    })
  }, [loaded])

  // Spotlight effect on project cards
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card')
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', `${x}%`)
        card.style.setProperty('--my', `${y}%`)
      })
    })
  }, [loaded])

  // 3D tilt on project cards
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(8px)`
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)'
      })
    })
  }, [loaded])

  const addReveal = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }
  const addTl = (el) => { if (el && !tlRefs.current.includes(el)) tlRefs.current.push(el) }
  const addLabel = (el) => { if (el && !sectionLabelRefs.current.includes(el)) sectionLabelRefs.current.push(el) }
  const addWord = (el) => { if (el && !titleWordRefs.current.includes(el)) titleWordRefs.current.push(el) }

  const ArrowIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M17 7H7M17 7v10"/>
    </svg>
  )

  const doubled = [...marqueeItems, ...marqueeItems]

  return (
    <>
      <style>{styles}</style>

      {/* Loader */}
      <div className={`loader${loaded ? ' hide' : ''}`}>
        <div className="loader-logo">AM</div>
        <div className="loader-bar-wrap"><div className="loader-bar" /></div>
      </div>

      {/* Background */}
      <div className="noise" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Cursor */}
      <div className="cursor-dot" ref={cursorDot} />

      {/* Nav */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#hero" className="nav-logo">AM</a>
        <ul className="nav-links">
          {['About', 'Projects', 'Skills', 'Contact'].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
          <li>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume-nav">
              Resume ↗
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <p className="hero-eyebrow">// Available for Co-op · Toronto, Canada</p>
        <h1 className="hero-title">
          <span className="hero-title-line"><span className="hero-title-inner">BUILDING</span></span>
          <span className="hero-title-line"><span className="hero-title-inner">AI THAT</span></span>
          <span className="hero-title-line"><span className="hero-title-inner">WORKS</span></span>
        </h1>
        <p className="hero-sub">
          I'm Andrew, an AI/ML developer and interaction designer at George Brown College.
          Former personal trainer and real estate pro turned builder. I ship real apps,
          not demos. Seeking co-op Fall 2026 in Toronto.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn-primary"><span>View My Work</span></a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">Download Resume ↗</a>
        </div>
        <div className="hero-stats">
          {[
            { num: 3, suffix: '+', label: 'Projects Built' },
            { num: 5, suffix: '+', label: 'Years in Industry' },
            { num: 2, suffix: '', label: 'Disciplines Merged' },
            { num: 1, suffix: '', label: 'Pivot Story' },
          ].map((s) => (
            <div key={s.label}>
              <div className="stat-num"><AnimatedNumber target={s.num} />{s.suffix}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <p className="section-label" ref={addLabel}>// 01 — About</p>
        <h2 className="section-title">
          {'THE STORY'.split(' ').map((w, i) => (
            <span key={i} className="title-word" ref={addWord}>{w}</span>
          ))}
        </h2>
        <div className="about-grid">
          <div className="about-text" ref={addReveal} style={{ opacity: 0, transform: 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p>I spent years <strong>coaching athletes and designing fitness programs</strong>, work that's fundamentally about reading people, building systems, and iterating until something works. That's exactly how I build software now.</p>
            <p>I'm in the <strong>Applied AI Solutions postgrad program at George Brown College</strong>, where I've built computer vision tools, React Native apps, and ML pipelines. I care about making AI that's actually usable and not just technically functional.</p>
            <p>My background in <strong>real estate presentation design and UX</strong> means I think about how things look and feel as much as how they work under the hood. That combination is rare and I lean into it.</p>
            <p>I'm currently seeking a <strong>Fall 2026 co-op</strong> in AI/ML engineering, full-stack development, or product. Ideally somewhere building something that didn't exist before.</p>
          </div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div className="timeline-item" key={i} ref={addTl}>
                <div className="tl-left">
                  <div className="tl-dot" />
                  <div className="tl-line" />
                </div>
                <div className="tl-content">
                  <div className="tl-year">{item.year}</div>
                  <div className="tl-role">{item.role}</div>
                  <div className="tl-place">{item.place}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects">
        <p className="section-label" ref={addLabel}>// 02 — Projects</p>
        <h2 className="section-title">
          {'THE WORK'.split(' ').map((w, i) => (
            <span key={i} className="title-word" ref={addWord}>{w}</span>
          ))}
        </h2>

        <div className="projects-grid">
          {/* Featured */}
          <div className="project-card featured reveal" ref={addReveal}>
            <div className="spotlight" />
            <div className="phone-strip">
              {featuredProject.images.map((src, i) => (
                <div className="phone-frame" key={i}>
                  <img src={src} alt={`GameVibe screen ${i + 1}`} />
                </div>
              ))}
            </div>
            <div className="project-body">
              <div className="project-num">{featuredProject.num} — Featured</div>
              <div>
                <div className="project-title">{featuredProject.title}</div>
                <div className="project-tagline">{featuredProject.tagline}</div>
              </div>
              <p className="project-desc">{featuredProject.desc}</p>
              <div className="project-tags">
                {featuredProject.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
              <a href={featuredProject.href} target="_blank" rel="noopener noreferrer" className="project-link">
                View on GitHub <ArrowIcon />
              </a>
            </div>
          </div>

          {/* Secondary */}
          <div className="projects-secondary">
            {projects.map((p, i) => (
              <div className="project-card featured reveal" key={p.num} ref={addReveal}
                style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="spotlight" />
                {p.images && (
                  <div className="phone-strip">
                    {p.images.map((src, j) => (
                      <div className="phone-frame" key={j}>
                        <img src={src} alt={`${p.title} screen ${j + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="project-body">
                  <div className="project-num">{p.num}</div>
                  <div>
                    <div className="project-title">{p.title}</div>
                    {p.tagline && <div className="project-tagline">{p.tagline}</div>}
                  </div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                  </div>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="project-link">
                    View on GitHub <ArrowIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills">
        <p className="section-label" ref={addLabel}>// 03 — Skills</p>
        <h2 className="section-title">
          {'THE STACK'.split(' ').map((w, i) => (
            <span key={i} className="title-word" ref={addWord}>{w}</span>
          ))}
        </h2>
        <div className="skills-grid reveal" ref={addReveal}>
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.label}>
              <div className="skill-group-label">{group.label}</div>
              <ul className="skill-list">
                {group.skills.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <p className="section-label" ref={addLabel}>// 04 — Contact</p>
        <h2 className="section-title">
          {"LET'S TALK".split(' ').map((w, i) => (
            <span key={i} className="title-word" ref={addWord}>{w}</span>
          ))}
        </h2>
        <div className="contact-inner reveal" ref={addReveal}>
          <p>
            I'm actively seeking co-op placements and entry-level opportunities in AI/ML,
            full-stack, or product design. If you're building something interesting or have
            a role that fits, I'd love to hear from you.
          </p>
          <div className="contact-links">
            {[
              { type: 'Email', val: 'makhijaniandrew@gmail.com', href: 'mailto:makhijaniandrew@gmail.com' },
              { type: 'LinkedIn', val: 'linkedin.com/in/andrew-makhijani', href: 'https://www.linkedin.com/in/andrew-makhijani/' },
              { type: 'GitHub', val: 'github.com/andrewomm', href: 'https://github.com/andrewomm' },
            ].map((c) => (
              <a key={c.type} href={c.href} target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="contact-link-left">
                  <span className="contact-link-type">{c.type}</span>
                  <span className="contact-link-val">{c.val}</span>
                </div>
                <span className="contact-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p className="footer-copy">© 2026 <span>Andrew Makhijani</span>. Built with React + Vite.</p>
        <p className="footer-copy">Toronto, Canada · <span>Open to Co-op</span></p>
      </footer>

      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className={item.accent ? 'accent' : ''}>{item.text}</span>
          ))}
        </div>
      </div>
    </>
  )
}
