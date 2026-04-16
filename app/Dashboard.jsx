"use client";
import { useState, useEffect, useMemo, useRef } from "react";

/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  DESIGN PHILOSOPHY
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  1. TODAY FIRST — The hero area answers "What do I need to do right now?"
 *     with a progress ring, today's resolutions, and the gratitude prompt.
 *     No scrolling required for the daily ritual.
 *
 *  2. PROGRESS AS REWARD — Streaks, completion rings, and weekly heatmaps
 *     give dopamine feedback that pulls you back tomorrow.
 *
 *  3. ZERO-FRICTION INPUT — Inline editing, single-tap check-offs, keyboard
 *     submit on every field. The fastest path to "done" wins.
 *
 *  4. INFORMATION HIERARCHY — The quote sets the emotional tone at the very
 *     top (ambient, not demanding). Today's actions sit in the prime viewport.
 *     Calendar and history live below the fold for review, not daily friction.
 *
 *  5. WARMTH THROUGH CRAFT — Generous whitespace, fluid type scale, subtle
 *     transitions, and a restrained blue/cream palette that feels like
 *     morning light on linen.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "Well-behaved women seldom make history.", author: "Laurel Thatcher Ulrich" },
  { text: "I am no bird; and no net ensnares me.", author: "Charlotte Brontë" },
  { text: "Think like a queen. A queen is not afraid to fail.", author: "Oprah Winfrey" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
  { text: "I raise up my voice — not so I can shout, but so that those without a voice can be heard.", author: "Malala Yousafzai" },
  { text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou" },
  { text: "One is not born, but rather becomes, a woman.", author: "Simone de Beauvoir" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "The most common way people give up their power is by thinking they don't have any.", author: "Alice Walker" },
  { text: "I am not free while any woman is unfree, even when her shackles are very different from my own.", author: "Audre Lorde" },
  { text: "Do not wait for leaders; do it alone, person to person.", author: "Mother Teresa" },
  { text: "I know what I want. I have a goal, an opinion, a religion and love.", author: "Anne Frank" },
  { text: "It took me quite a long time to develop a voice, and now that I have it, I am not going to be silent.", author: "Madeleine Albright" },
  { text: "If you want something said, ask a man. If you want something done, ask a woman.", author: "Margaret Thatcher" },
  { text: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
  { text: "I am deliberate and afraid of nothing.", author: "Audre Lorde" },
  { text: "A woman with a voice is, by definition, a strong woman.", author: "Melinda Gates" },
  { text: "We need to reshape our own perception of how we view ourselves.", author: "Beyoncé" },
  { text: "I never dreamed about success. I worked for it.", author: "Estée Lauder" },
  { text: "You don't make progress by standing on the sidelines, whimpering and complaining.", author: "Shirley Chisholm" },
  { text: "I have stood on a mountain of no's for one yes.", author: "B. Smith" },
  { text: "Power's not given to you. You have to take it.", author: "Beyoncé" },
  { text: "If they don't give you a seat at the table, bring a folding chair.", author: "Shirley Chisholm" },
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "I alone cannot change the world, but I can cast a stone across the waters to create many ripples.", author: "Mother Teresa" },
  { text: "Success isn't about how much money you make; it's about the difference you make in people's lives.", author: "Michelle Obama" },
  { text: "Every great dream begins with a dreamer.", author: "Harriet Tubman" },
  { text: "Courage is like a muscle. We strengthen it by use.", author: "Ruth Gordon" },
  { text: "The only tired I was, was tired of giving in.", author: "Rosa Parks" },
  { text: "I've been absolutely terrified every moment of my life — and I've never let it keep me from doing a single thing I wanted to do.", author: "Georgia O'Keeffe" },
  { text: "You can waste your lives drawing lines. Or you can live your life crossing them.", author: "Shonda Rhimes" },
  { text: "I am a woman phenomenally. Phenomenal woman, that's me.", author: "Maya Angelou" },
  { text: "Women belong in all places where decisions are being made.", author: "Ruth Bader Ginsburg" },
  { text: "I'm tough, I'm ambitious, and I know exactly what I want.", author: "Madonna" },
  { text: "Doubt is a killer. You just have to know who you are and what you stand for.", author: "Jennifer Lopez" },
  { text: "You are more powerful than you know; you are beautiful just as you are.", author: "Melissa Etheridge" },
  { text: "There is no limit to what we, as women, can accomplish.", author: "Michelle Obama" },
  { text: "We realise the importance of our voices only when we are silenced.", author: "Malala Yousafzai" },
  { text: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", author: "Virginia Woolf" },
  { text: "Optimism is the faith that leads to achievement.", author: "Helen Keller" },
  { text: "The most effective way to do it, is to do it.", author: "Amelia Earhart" },
  { text: "We do not need magic to transform our world. We carry all the power we need inside ourselves already.", author: "J.K. Rowling" },
  { text: "I was smart enough to go through any door that opened.", author: "Joan Rivers" },
  { text: "A girl should be two things: who and what she wants.", author: "Coco Chanel" },
  { text: "I can't think of any better representation of beauty than someone who is unafraid to be herself.", author: "Emma Stone" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Dolly Parton" },
  { text: "Never limit yourself because of others' limited imagination.", author: "Mae Jemison" },
  { text: "What you do makes a difference, and you have to decide what kind of difference you want to make.", author: "Jane Goodall" },
  { text: "Above all, be the heroine of your life, not the victim.", author: "Nora Ephron" },
];

const REFLECTION_PROMPTS = [
  // ── IMPLEMENTATION INTENTIONS (When X → I will Y) ──
  "What's one situation tomorrow where you could insert a 2-minute version of a habit you're building?",
  "Think of a moment today where you defaulted to autopilot. What could you do differently when that same cue appears tomorrow?",
  "What's the first decision you'll face tomorrow morning? Decide now how you'll handle it.",
  "Name one trigger from today — stress, boredom, a notification — and write a specific if-then plan for next time.",
  "Where did you lose 30+ minutes today without meaning to? What could you do instead when that cue hits?",
  "What's one small thing you keep meaning to do? Attach it to something you already do every morning.",
  "Think ahead to your hardest moment tomorrow. What's your plan for navigating it well?",
  "What's a conversation you've been avoiding? Write one opening sentence you could use tomorrow.",
  "When do you tend to snack, scroll, or procrastinate? Pick one of those moments and design a 2-minute replacement.",
  "What's one thing you want to say 'no' to this week? Rehearse the exact words now.",

  // ── IDENTITY-BASED REFLECTION (Who am I becoming?) ──
  "What did you do today that the person you're becoming would do?",
  "If the best version of you were watching today, which moment would make them proud?",
  "What's one vote you cast today — through action or choice — for the identity you want?",
  "Think of someone you admire. What's one thing they'd do daily that you could start with a 2-minute version of?",
  "What story do you tell yourself that's holding a habit back? Write the opposite version.",
  "Finish this sentence: 'I'm the kind of person who...' — and make it aspirational but believable.",
  "What's a label you've outgrown? What would you replace it with?",
  "What would you attempt this week if you fully trusted your own competence?",
  "What quality did you demonstrate today — patience, discipline, curiosity — that you want more of?",
  "Write one sentence describing who you are when you're at your best. Did today reflect that?",

  // ── FRICTION & REWARD DESIGN (Make it easier / more satisfying) ──
  "What felt harder than it should have today? What's one thing that would make it 10% easier?",
  "What tiny thing gave you disproportionate satisfaction today? How could you get more of that?",
  "What's one piece of friction you could remove tonight that would make tomorrow's morning smoother?",
  "Where did your environment work against you today? What's one small change to the space?",
  "What habit are you white-knuckling through willpower? How could you redesign the environment instead?",
  "What's the most effortless good decision you made today? Why was it easy — and can you replicate that ease elsewhere?",
  "Name something you did today purely because it was convenient. Was it aligned with who you want to be?",
  "What's one thing you could prepare tonight that would make a healthy choice the default tomorrow?",
  "Think of a habit that's stalling. Is the problem the cue, the routine, or the reward? Be specific.",
  "What would you need to make visible, accessible, or obvious to nudge yourself toward a better default?",

  // ── BRIGHT SPOTS (What's already working?) ──
  "What went well today that you didn't plan? What conditions made it possible?",
  "Where did you show up better than you expected today? What was different?",
  "What's a small win from this week that deserves more credit than you gave it?",
  "What's one area of your life where things are working? What can the other areas learn from it?",
  "Think of a moment today when you chose the harder-but-better option. What pulled you toward it?",
  "What's something Nate or Raph did today that showed a value you've been trying to model?",
  "What's a system or routine that's quietly making your life better without much effort?",
  "Where are you further along than you were three months ago? Name something specific.",
  "What's a decision you made recently that your future self will thank you for?",
  "What's working about your current morning or evening routine? Don't change it — just notice it.",

  // ── HABIT STACKING & MICRO-EXPERIMENTS ──
  "What's something you already do every day without thinking? What 2-minute habit could you pair with it?",
  "Design a tiny experiment for tomorrow: change one variable in your routine and observe what happens.",
  "What's the smallest possible version of a habit you want to build? Can you make it even smaller?",
  "If you could only keep three daily habits, which three would have the most ripple effect?",
  "What's one thing you could do in under 60 seconds tonight that would set tomorrow up for success?",
  "Pick a habit you dropped. What's the minimum viable restart — the version so small you can't say no?",
  "What would your ideal Tuesday look like, hour by hour? What's one block you could prototype this week?",
  "What's a 'keystone habit' — one behaviour that tends to trigger other good behaviours for you?",
  "Name a habit you do reliably. What makes it stick? Apply that insight to one that doesn't.",
  "What's something you could track for just 7 days to learn something useful about your patterns?",

  // ── GRATITUDE & WARMTH (the 20%) ──
  "What small moment today made you pause and smile — even just for a second?",
  "What's something about Nate or Raph that surprised you with joy recently?",
  "Who showed you unexpected kindness this week, and how did it land?",
  "What everyday luxury — coffee, a warm shower, clean sheets — are you grateful for right now?",
  "What's something about being a mum that nobody warned you would be so wonderful?",
  "Name a person who's always in your corner. What would you say to them if they were here?",
  "What's a favourite spot in your home and why does it feel like yours?",
  "What's a conversation you had recently that left you feeling lighter?",
  "What's something about this particular season of your life that is uniquely beautiful?",
  "If today were your only measure, what would you say went right?",
  "What's something about the way Nate or Raph sees the world that delights you?",
  "What simple act of love did you witness or receive recently?",
  "What's something about Singapore life that you appreciate in this moment?",
  "What did you do for someone else recently that made you feel connected?",
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ─── PALETTE ─────────────────────────────────────────────────────────────────

const C = {
  bg:         "#E4EEF4",
  surface:    "#FFFFFF",
  surfaceAlt: "#F6FAFC",
  surfaceDim: "#D9E6EF",
  border:     "#CADAE6",
  borderLight:"#DCE9F1",
  ink:        "#1E3A50",
  navy:       "#1E3A56",
  blue:       "#2C6693",
  blueM:      "#4A8DBD",
  blueL:      "#8EBDD9",
  blueXL:     "#C6DEF0",
  blueTint:   "#EAF2F8",
  warm:       "#B8845A",
  warmL:      "#D4A87A",
  warmXL:     "#F0DCC8",
  warmTint:   "#FBF5EE",
  done:       "#4E8E60",
  doneBg:     "#E6F3EA",
  miss:       "#C4646E",
  missBg:     "#FCECED",
  t1:         "#1E3A50",
  t2:         "#506A7D",
  t3:         "#7A95A8",
  t4:         "#9BB2C2",
  nateGreen:  "#4E8E60",
  raphBlue:   "#4A8DBD",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const save = (k, v) => { try { localStorage.setItem("dash_"+k, JSON.stringify(v)); } catch(e){} };
const load = (k) => { try { const d = localStorage.getItem("dash_"+k); return d ? JSON.parse(d) : null; } catch(e){ return null; } };
const dkey = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const todayKey = () => { const d = new Date(); return dkey(d.getFullYear(), d.getMonth(), d.getDate()); };
const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const firstDow = (y,m) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1; };
// 0=Mon, 1=Tue, ..., 6=Sun
const getDow = (y,m,d) => { const dow = new Date(y,m,d).getDay(); return dow===0?6:dow-1; };

// Check if a resolution applies on a given date
function resApplies(r, y, m, d) {
  if (!r.days || r.days.length === 0 || r.days.length === 7) return true; // daily
  return r.days.includes(getDow(y, m, d));
}

// Human-readable frequency label
const DAY_ABBR = ["M","T","W","T","F","S","S"];
function daysLabel(r) {
  if (!r.days || r.days.length === 0 || r.days.length === 7) return "Daily";
  if (r.days.length === 5 && [0,1,2,3,4].every(d => r.days.includes(d))) return "Weekdays";
  if (r.days.length === 2 && [5,6].every(d => r.days.includes(d))) return "Weekends";
  return r.days.map(d => DAY_ABBR[d]).join(" ");
}

// Robust hash that properly differentiates consecutive days
function hashDay(year, month, day, salt) {
  let h = ((year * 374761 + month * 668265 + day * 119281 + (salt || 0)) & 0x7FFFFFFF);
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return (h & 0x7FFFFFFF) / 0x7FFFFFFF;
}

function dailyQuote() {
  const d = new Date();
  const r = hashDay(d.getFullYear(), d.getMonth()+1, d.getDate(), 777);
  return QUOTES[Math.floor(r * QUOTES.length)];
}

function dailyPrompt(used) {
  const t = todayKey();
  const map = load("gratitudePromptMap") || {};
  if (map[t]) return { prompt: map[t], index: -1 };
  const pool = REFLECTION_PROMPTS.filter((_,i) => !used.includes(i));
  const src = pool.length > 0 ? pool : REFLECTION_PROMPTS;
  const d = new Date();
  const r = hashDay(d.getFullYear(), d.getMonth()+1, d.getDate(), 123);
  const p = src[Math.floor(r * src.length)];
  map[t] = p;
  save("gratitudePromptMap", map);
  return { prompt: p, index: REFLECTION_PROMPTS.indexOf(p) };
}

// ─── STREAK CALCULATION ─────────────────────────────────────────────────────

function calcStreak(completions, resolutions) {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const dy = d.getDate();
    const key = dkey(yr, mo, dy);
    const active = [];
    for (let m = 0; m <= 11; m++) {
      const mk = `${yr}-${String(m+1).padStart(2,'0')}`;
      const items = resolutions[mk] || [];
      if (m <= mo) items.forEach(r => active.push(r));
    }
    // Only count resolutions that apply today
    const applicable = active.filter(r => resApplies(r, yr, mo, dy));
    if (applicable.length === 0) { d.setDate(d.getDate()-1); continue; }
    const allDone = applicable.every(r => completions[`${key}_${r.id}`]);
    if (allDone) streak++;
    else if (i > 0) break;
    else { d.setDate(d.getDate()-1); continue; }
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function calcGratitudeStreak(entries) {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const key = dkey(d.getFullYear(), d.getMonth(), d.getDate());
    if (entries[key]) streak++;
    else if (i > 0) break;
    else { d.setDate(d.getDate()-1); continue; }
    d.setDate(d.getDate()-1);
  }
  return streak;
}

// ─── SVG PROGRESS RING ──────────────────────────────────────────────────────

function ProgressRing({ progress, size=88, stroke=6, color=C.blue, bgColor=C.blueTint, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(progress, 1)) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bgColor} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
        {children}
      </div>
    </div>
  );
}

// ─── EMOJI PICKER ────────────────────────────────────────────────────────────

const EMOJI_CATEGORIES = [
  { label:"Smileys", emojis:["😊","😂","🥰","😍","🤩","😎","🥳","😇","🤗","😌","🙃","😏","😋","🤔","🫡","💪","👏","🙌","✌️","🤞"] },
  { label:"Hearts", emojis:["❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💕","💖","💗","💝","❤️‍🔥","💯","✨","⭐","🌟","🔥","💫"] },
  { label:"Nature", emojis:["🌸","🌺","🌻","🌹","🌷","🌱","🌿","🍀","🌳","🌊","☀️","🌙","⛅","🌈","🦋","🐝","🌾","🍃","🍂","🌵"] },
  { label:"Food", emojis:["☕","🍵","🧁","🍰","🍫","🍪","🥐","🍓","🍑","🥑","🍕","🥗","🍜","🧋","🥂","🍷","🫖","🍩","🥞","🧇"] },
  { label:"Activities", emojis:["📚","✍️","🎯","🏃‍♀️","🧘‍♀️","💤","🎨","🎵","🏡","✈️","🚀","🎬","📱","💻","🏋️‍♀️","🧠","📝","🗓️","⏰","🔑"] },
  { label:"Symbols", emojis:["✅","❌","⚡","🎉","🎊","🏆","🥇","🎁","📌","🔔","💡","🧩","🪄","🫶","🤝","🙏","👀","💬","📣","🚩"] },
];

function EmojiPicker({ onSelect, inputRef }) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (emoji) => {
    onSelect(emoji);
    inputRef?.current?.focus();
  };

  return (
    <div style={{ position:"relative" }} ref={pickerRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width:44, height:44, borderRadius:12, border:`1.5px solid ${C.border}`,
          background: open ? C.blueTint : C.surfaceAlt, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, transition:"all 0.15s", flexShrink:0,
        }}
        title="Add emoji"
      >
        😊
      </button>
      {open && (
        <div style={{
          position:"absolute", bottom:"calc(100% + 8px)", right:0, zIndex:100,
          width:320, background:C.surface, borderRadius:16,
          border:`1px solid ${C.border}`, boxShadow:"0 8px 32px rgba(26,47,68,0.12), 0 2px 8px rgba(26,47,68,0.06)",
          overflow:"hidden",
        }}>
          {/* Category tabs */}
          <div style={{ display:"flex", borderBottom:`1px solid ${C.borderLight}`, padding:"6px 6px 0" }}>
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button key={cat.label} onClick={() => setActiveCat(i)} style={{
                flex:1, padding:"6px 2px 8px", border:"none", background:"transparent",
                cursor:"pointer", fontSize:10, fontWeight: activeCat===i ? 700 : 500,
                color: activeCat===i ? C.blue : C.t4, fontFamily:FONT.sans,
                borderBottom: activeCat===i ? `2px solid ${C.blue}` : "2px solid transparent",
                transition:"all 0.15s", letterSpacing:"0.02em",
              }}>
                {cat.label}
              </button>
            ))}
          </div>
          {/* Emoji grid */}
          <div style={{ padding:10, display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gap:2, maxHeight:180, overflowY:"auto" }}>
            {EMOJI_CATEGORIES[activeCat].emojis.map((emoji, i) => (
              <button key={`${emoji}-${i}`} onClick={() => handleSelect(emoji)} style={{
                width:"100%", aspectRatio:"1", border:"none", background:"transparent",
                cursor:"pointer", fontSize:22, borderRadius:8, display:"flex",
                alignItems:"center", justifyContent:"center", transition:"background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceDim}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TODAY'S FOCUS (HERO) ────────────────────────────────────────────────────

function TodayHero({ resolutions, completions, setCompletions, gratitudeEntries, usedPrompts, setGratitudeEntries, setUsedPrompts }) {
  const now = new Date();
  const today = todayKey();
  const [entry, setEntry] = useState("");
  const textareaRef = useRef(null);

  const active = useMemo(() => {
    const all = [];
    for (let m = 0; m <= now.getMonth(); m++) {
      const mk = `${now.getFullYear()}-${String(m+1).padStart(2,'0')}`;
      (resolutions[mk]||[]).forEach(r => all.push({ ...r, fromMonth: m }));
    }
    return all;
  }, [resolutions]);

  // Only resolutions that apply today
  const todayActive = useMemo(() => {
    return active.filter(r => resApplies(r, now.getFullYear(), now.getMonth(), now.getDate()));
  }, [active]);

  const doneCount = todayActive.filter(r => completions[`${today}_${r.id}`]).length;
  const progress = todayActive.length > 0 ? doneCount / todayActive.length : 0;

  const toggle = (id) => {
    const u = { ...completions };
    u[`${today}_${id}`] = !u[`${today}_${id}`];
    setCompletions(u);
    save("completions", u);
  };

  const { prompt, index } = useMemo(() => dailyPrompt(usedPrompts), []);
  const todayEntry = gratitudeEntries[today];

  const saveGratitude = () => {
    if (!entry.trim()) return;
    const u = { ...gratitudeEntries, [today]: entry.trim() };
    setGratitudeEntries(u);
    save("gratitudeEntries", u);
    if (index >= 0 && !usedPrompts.includes(index)) {
      const up = [...usedPrompts, index];
      setUsedPrompts(up);
      save("usedPrompts", up);
    }
    setEntry("");
  };

  const resStreak = calcStreak(completions, resolutions);
  const gratStreak = calcGratitudeStreak(gratitudeEntries);

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
      {/* LEFT — Resolutions today */}
      <div style={{ ...cardStyle, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <p style={{ ...labelStyle, margin:"0 0 2px" }}>Today's Resolutions</p>
            <p style={{ fontSize:12, color:C.t4, margin:0, fontFamily:FONT.sans }}>{todayActive.length} due today · {doneCount} complete</p>
          </div>
          <ProgressRing progress={progress} size={72} stroke={5} color={progress >= 1 ? C.done : C.blue}>
            <span style={{ fontSize:20, fontWeight:700, color: progress >= 1 ? C.done : C.ink, fontFamily:FONT.sans, lineHeight:1 }}>
              {todayActive.length > 0 ? Math.round(progress*100) : 0}
            </span>
            <span style={{ fontSize:9, color:C.t3, fontWeight:600, letterSpacing:"0.05em" }}>%</span>
          </ProgressRing>
        </div>

        {todayActive.length === 0 ? (
          <p style={{ fontSize:14, color:C.t3, margin:"auto 0", textAlign:"center", padding:"20px 0", fontStyle:"italic", fontFamily:FONT.serif }}>
            {active.length > 0 ? "Nothing due today — enjoy the rest" : "Add your first resolution in the calendar below"}
          </p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1 }}>
            {todayActive.map(r => {
              const done = !!completions[`${today}_${r.id}`];
              return (
                <button key={r.id} onClick={() => toggle(r.id)} style={{
                  display:"flex", alignItems:"center", gap:12, width:"100%", padding:"11px 14px",
                  border:`1.5px solid ${done ? C.done+"40" : C.border}`,
                  borderRadius:12, background: done ? C.doneBg : C.surfaceAlt,
                  cursor:"pointer", textAlign:"left", transition:"all 0.2s ease",
                  fontFamily:FONT.sans, outline:"none",
                }}>
                  <div style={{
                    width:22, height:22, borderRadius:7, flexShrink:0, transition:"all 0.2s ease",
                    border: done ? `2px solid ${C.done}` : `2px solid ${C.blueL}`,
                    background: done ? C.done : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:14, color: done ? C.done : C.t1, fontWeight:500, display:"block",
                      textDecoration: done ? "line-through" : "none", opacity: done ? 0.7 : 1 }}>{r.text}</span>
                    {daysLabel(r) !== "Daily" && (
                      <span style={{ fontSize:10, color:C.t4, fontWeight:500 }}>{daysLabel(r)}</span>
                    )}
                  </div>
                  <span style={{ fontSize:10, color:C.t4, fontWeight:500, whiteSpace:"nowrap" }}>{MONTH_SHORT[r.fromMonth]}</span>
                </button>
              );
            })}
          </div>
        )}

        {resStreak > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:16, padding:"8px 12px", background:C.warmTint, borderRadius:10, border:`1px solid ${C.warmXL}` }}>
            <span style={{ fontSize:16 }}>🔥</span>
            <span style={{ fontSize:13, fontWeight:600, color:C.warm, fontFamily:FONT.sans }}>{resStreak} day streak</span>
          </div>
        )}
      </div>

      {/* RIGHT — Reflection */}
      <div style={{ ...cardStyle, display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <p style={{ ...labelStyle, margin:"0 0 2px" }}>Daily Reflection</p>
            <p style={{ fontSize:12, color:C.t4, margin:0, fontFamily:FONT.sans }}>{todayEntry ? "Reflected today ✓" : "Take a moment"}</p>
          </div>
          {gratStreak > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", background:C.blueTint, borderRadius:8 }}>
              <span style={{ fontSize:14 }}>✨</span>
              <span style={{ fontSize:12, fontWeight:600, color:C.blue, fontFamily:FONT.sans }}>{gratStreak}d</span>
            </div>
          )}
        </div>

        <div style={{
          background:`linear-gradient(145deg, ${C.blueTint}, ${C.warmTint})`,
          borderRadius:14, padding:"20px 22px", marginBottom:16,
          borderLeft:`3px solid ${C.warm}`, position:"relative",
        }}>
          <p style={{ fontSize:17, color:C.ink, margin:0, lineHeight:1.65, fontFamily:FONT.serif, fontWeight:500, fontStyle:"italic" }}>
            {prompt}
          </p>
        </div>

        {todayEntry ? (
          <div style={{ background:C.surfaceAlt, borderRadius:12, padding:"16px 18px", flex:1, border:`1px solid ${C.borderLight}` }}>
            <p style={{ fontSize:14, color:C.t2, margin:0, lineHeight:1.7, fontFamily:FONT.sans }}>{todayEntry}</p>
          </div>
        ) : (
          <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
            <textarea
              ref={textareaRef}
              value={entry}
              onChange={e => setEntry(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveGratitude(); } }}
              placeholder="Be specific — name the cue, the behaviour, the change..."
              rows={3}
              style={{
                flex:1, padding:"14px 16px", borderRadius:12, border:`1.5px solid ${C.border}`,
                background:C.surfaceAlt, fontSize:14, color:C.t1, outline:"none", resize:"none",
                fontFamily:FONT.sans, lineHeight:1.7, transition:"border-color 0.2s",
                minHeight:80,
              }}
              onFocus={e => e.target.style.borderColor = C.blueM}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button onClick={saveGratitude} disabled={!entry.trim()} style={{
              marginTop:10, padding:"10px 0", borderRadius:12, border:"none",
              background: entry.trim() ? C.warm : C.surfaceDim,
              color: entry.trim() ? "#fff" : C.t4, fontSize:14, fontWeight:600,
              cursor: entry.trim() ? "pointer" : "default", transition:"all 0.2s",
              fontFamily:FONT.sans,
            }}>
              Save reflection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TO-DO SECTION ───────────────────────────────────────────────────────────

function TodoSection() {
  const categories = [
    { key:"nate", label:"Nate", emoji:"💚", accent:C.nateGreen },
    { key:"raph", label:"Raph", emoji:"💙", accent:C.raphBlue },
    { key:"admin", label:"Life Admin", emoji:"🏠", accent:C.warm },
  ];
  const [openSections, setOpenSections] = useState({"nate":false,"raph":false,"admin":false});

  const toggleSection = (key) => {
    setOpenSections(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <div style={{ ...cardStyle, padding:0, overflow:"hidden" }}>
      {categories.map((cat, idx) => {
        const isOpen = openSections[cat.key];
        const isLast = idx === categories.length - 1;
        const pendingCount = (load(`todos_${cat.key}`) || []).filter(t => !t.done).length;
        return (
          <div key={cat.key}>
            <button onClick={() => toggleSection(cat.key)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%",
              padding:"16px 24px", border:"none", cursor:"pointer",
              background: isOpen ? C.surface : C.surfaceAlt,
              borderBottom: (!isOpen && !isLast) ? `1px solid ${C.borderLight}` : "none",
              transition:"all 0.2s", textAlign:"left", fontFamily:FONT.sans,
            }}>
              <span style={{ fontSize:18 }}>{cat.emoji}</span>
              <span style={{ fontSize:15, fontWeight:600, color:C.ink, fontFamily:FONT.serif, flex:1 }}>{cat.label}</span>
              {pendingCount > 0 && (
                <span style={{
                  fontSize:11, fontWeight:700, color:cat.accent,
                  background:cat.accent+"15", padding:"2px 8px", borderRadius:8,
                }}>{pendingCount}</span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="2.5" strokeLinecap="round"
                style={{ transition:"transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {isOpen && (
              <div style={{
                padding:"4px 24px 20px",
                borderBottom: !isLast ? `1px solid ${C.borderLight}` : "none",
                background:C.surface,
              }}>
                <TodoList category={cat.key} accent={cat.accent} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TodoList({ category, accent }) {
  const sk = `todos_${category}`;
  const [todos, setTodos] = useState(() => load(sk) || []);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { save(sk, todos); }, [todos, sk]);
  // Re-load when category changes
  useEffect(() => { setTodos(load(sk) || []); }, [sk]);

  const add = () => {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
    inputRef.current?.focus();
  };
  const toggle = id => setTodos(prev => prev.map(t => t.id===id ? {...t, done:!t.done} : t));
  const remove = id => setTodos(prev => prev.filter(t => t.id!==id));

  const pending = todos.filter(t => !t.done);
  const done = todos.filter(t => t.done);

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==="Enter" && add()}
          placeholder="Add a task..."
          style={{
            flex:1, padding:"11px 16px", borderRadius:12, border:`1.5px solid ${C.border}`,
            background:C.surfaceAlt, fontSize:14, color:C.t1, outline:"none",
            fontFamily:FONT.sans, transition:"border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = accent}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <EmojiPicker inputRef={inputRef} onSelect={(emoji) => setText(prev => prev + emoji)} />
        <button onClick={add} style={{
          width:44, height:44, borderRadius:12, border:"none", cursor:"pointer",
          background:accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          transition:"opacity 0.15s", fontSize:20, fontWeight:300,
        }}>+</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {pending.map(t => (
          <div key={t.id} style={{
            display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
            background:C.surfaceAlt, borderRadius:11, border:`1px solid ${C.borderLight}`,
            transition:"all 0.15s",
          }}>
            <button onClick={() => toggle(t.id)} style={{
              width:20, height:20, borderRadius:6, border:`2px solid ${accent}50`,
              background:"transparent", cursor:"pointer", flexShrink:0, padding:0,
              transition:"all 0.15s",
            }} />
            <span style={{ fontSize:14, color:C.t1, flex:1, fontFamily:FONT.sans, fontWeight:450 }}>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{
              background:"none", border:"none", cursor:"pointer", padding:4, opacity:0.3,
              transition:"opacity 0.15s", color:C.t3, fontSize:16,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.3'}
            >×</button>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <div style={{ marginTop:12 }}>
          <p style={{ fontSize:11, color:C.t4, margin:"0 0 6px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:FONT.sans }}>
            Completed ({done.length})
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {done.map(t => (
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 14px", opacity:0.45 }}>
                <div style={{
                  width:20, height:20, borderRadius:6, background:C.done,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer",
                }} onClick={() => toggle(t.id)}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize:13, color:C.t2, flex:1, textDecoration:"line-through", fontFamily:FONT.sans }}>{t.text}</span>
                <button onClick={() => remove(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, opacity:0.4, color:C.t4, fontSize:14 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && done.length === 0 && (
        <p style={{ textAlign:"center", color:C.t4, fontSize:14, padding:"24px 0", fontStyle:"italic", fontFamily:FONT.serif, margin:0 }}>
          Nothing here yet — what needs doing?
        </p>
      )}
    </div>
  );
}

// ─── CALENDAR / RESOLUTIONS (REVIEW) ─────────────────────────────────────────

function CalendarView({ resolutions, setResolutions, completions, setCompletions }) {
  const now = new Date();
  const [vy, setVy] = useState(now.getFullYear());
  const [vm, setVm] = useState(now.getMonth());
  const [sel, setSel] = useState(null);
  const [newRes, setNewRes] = useState("");
  const [newDays, setNewDays] = useState([0,1,2,3,4,5,6]); // default: daily
  const resInputRef = useRef(null);

  const mKey = `${vy}-${String(vm+1).padStart(2,'0')}`;
  const mRes = resolutions[mKey] || [];

  const active = useMemo(() => {
    const all = [];
    for (let m=0;m<=11;m++){
      const k=`${vy}-${String(m+1).padStart(2,'0')}`;
      (resolutions[k]||[]).forEach(r => { if(m<=vm) all.push({...r,fromMonth:m}); });
    }
    return all;
  }, [resolutions,vm,vy]);

  const addRes = () => {
    if (!newRes.trim()) return;
    const u = {...resolutions};
    if (!u[mKey]) u[mKey] = [];
    u[mKey].push({ id: Date.now(), text: newRes.trim(), days: [...newDays].sort() });
    setResolutions(u);
    save("resolutions", u);
    setNewRes("");
    setNewDays([0,1,2,3,4,5,6]);
  };

  const removeRes = (id) => {
    const u = {...resolutions};
    u[mKey] = (u[mKey]||[]).filter(r => r.id !== id);
    setResolutions(u);
    save("resolutions", u);
  };

  const toggleComp = (dateKey, id) => {
    const u = {...completions};
    u[`${dateKey}_${id}`] = !u[`${dateKey}_${id}`];
    setCompletions(u);
    save("completions", u);
  };

  const dim = daysInMonth(vy,vm);
  const fd = firstDow(vy,vm);
  const today = todayKey();

  const prev = () => { if(vm===0){setVm(11);setVy(vy-1);}else setVm(vm-1); setSel(null); };
  const next = () => { if(vm===11){setVm(0);setVy(vy+1);}else setVm(vm+1); setSel(null); };

  const rate = (day) => {
    const applicable = active.filter(r => resApplies(r, vy, vm, day));
    if (applicable.length===0) return -1; // no resolutions due this day
    const k = dkey(vy,vm,day);
    let d=0; applicable.forEach(r => { if(completions[`${k}_${r.id}`]) d++; });
    return d/applicable.length;
  };

  // Check if ANY resolution applies on a given day (for dimming)
  const hasApplicable = (day) => {
    if (active.length === 0) return false;
    return active.some(r => resApplies(r, vy, vm, day));
  };

  return (
    <div style={{ ...cardStyle, gridColumn:"1 / -1" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <p style={{ ...labelStyle, margin:0 }}>Calendar & Resolutions</p>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={prev} style={navBtn}>‹</button>
          <span style={{ fontSize:17, fontWeight:600, color:C.ink, fontFamily:FONT.serif, minWidth:160, textAlign:"center" }}>
            {MONTH_NAMES[vm]} {vy}
          </span>
          <button onClick={next} style={navBtn}>›</button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:28 }}>
        {/* Calendar */}
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:600, color:C.t4, padding:"4px 0", fontFamily:FONT.sans, letterSpacing:"0.04em" }}>{d}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array.from({length:fd}).map((_,i) => <div key={`e${i}`}/>)}
            {Array.from({length:dim}).map((_,i) => {
              const day=i+1;
              const key=dkey(vy,vm,day);
              const r=rate(day);
              const isToday=key===today;
              const isSel=sel===day;
              const applicable = hasApplicable(day);

              let bg=C.surfaceAlt;
              let borderColor=C.borderLight;
              if (!applicable && active.length > 0) {
                // Non-applicable day — dim it
                bg=C.surfaceDim;
                borderColor=C.borderLight;
              } else {
                if(r>0&&r<1){ bg=C.blueTint; borderColor=C.blueXL; }
                if(r>=1){ bg=C.doneBg; borderColor=C.done+"40"; }
              }
              if(isSel) borderColor=C.blue;
              if(isToday) borderColor=C.warm;

              return (
                <button key={day} onClick={() => setSel(isSel?null:day)} style={{
                  width:"100%", aspectRatio:"1", border:`1.5px solid ${borderColor}`,
                  borderRadius:10, background:bg, cursor:"pointer", fontSize:13,
                  fontWeight:isToday?700:500,
                  color: !applicable && active.length > 0 ? C.t4 : (isToday ? C.ink : C.t2),
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.15s", fontFamily:FONT.sans, outline:"none",
                  position:"relative",
                  opacity: !applicable && active.length > 0 ? 0.5 : 1,
                }}>
                  {day}
                  {r>=1 && <span style={{ position:"absolute", bottom:2, fontSize:7, color:C.done }}>●</span>}
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", gap:14, marginTop:14, justifyContent:"center", flexWrap:"wrap" }}>
            {[{bg:C.surfaceDim, label:"Off day", opacity:0.5},{bg:C.surfaceAlt, label:"—"},{bg:C.blueTint,label:"Partial"},{bg:C.doneBg,label:"Done"}].map(l => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:C.t4, fontFamily:FONT.sans, opacity:l.opacity||1 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:l.bg, border:`1px solid ${C.border}` }}/>
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ borderLeft:`1px solid ${C.borderLight}`, paddingLeft:24 }}>
          {sel ? (
            (() => {
              const dayApplicable = active.filter(r => resApplies(r, vy, vm, sel));
              const dayName = DAY_NAMES[getDow(vy, vm, sel)];
              return (
                <div>
                  <p style={{ fontSize:15, fontWeight:600, color:C.ink, margin:"0 0 4px", fontFamily:FONT.serif }}>
                    {dayName} {sel} {MONTH_NAMES[vm]}
                  </p>
                  {dayApplicable.length === 0 ? (
                    <p style={{ fontSize:13, color:C.t4, fontStyle:"italic", fontFamily:FONT.serif, marginTop:10 }}>
                      {active.length > 0 ? "No resolutions due this day — rest day" : "No resolutions for this period."}
                    </p>
                  ) : (
                    <p style={{ fontSize:11, color:C.t4, margin:"0 0 12px", fontFamily:FONT.sans }}>{dayApplicable.length} due this day</p>
                  )}
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {dayApplicable.map(r => {
                      const key=dkey(vy,vm,sel);
                      const done=!!completions[`${key}_${r.id}`];
                      return (
                        <button key={r.id} onClick={() => toggleComp(key,r.id)} style={{
                          display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px",
                          border:`1.5px solid ${done?C.done+"40":C.border}`, borderRadius:10,
                          background:done?C.doneBg:C.surfaceAlt, cursor:"pointer", textAlign:"left",
                          transition:"all 0.15s", fontFamily:FONT.sans, outline:"none",
                        }}>
                          <div style={{
                            width:20, height:20, borderRadius:6, flexShrink:0,
                            border:`2px solid ${done?C.done:C.blueL}`,
                            background:done?C.done:"transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            {done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <span style={{ fontSize:13, color:done?C.done:C.t1, fontWeight:500, display:"block", textDecoration:done?"line-through":"none" }}>{r.text}</span>
                            {daysLabel(r) !== "Daily" && <span style={{ fontSize:10, color:C.t4 }}>{daysLabel(r)}</span>}
                          </div>
                          <span style={{ fontSize:10, color:C.t4 }}>{MONTH_SHORT[r.fromMonth]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          ) : (
            <div>
              <p style={{ fontSize:15, fontWeight:600, color:C.ink, margin:"0 0 4px", fontFamily:FONT.serif }}>
                {MONTH_NAMES[vm]}'s resolution
              </p>
              <p style={{ fontSize:12, color:C.t3, margin:"0 0 14px", fontFamily:FONT.sans, lineHeight:1.5 }}>
                Add this month's new resolution. Previous months carry forward.
              </p>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <input
                  ref={resInputRef}
                  value={newRes}
                  onChange={e => setNewRes(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && addRes()}
                  placeholder="e.g. Read 20 minutes daily"
                  style={{
                    flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`,
                    background:C.surfaceAlt, fontSize:13, color:C.t1, outline:"none", fontFamily:FONT.sans,
                  }}
                />
                <EmojiPicker inputRef={resInputRef} onSelect={(emoji) => setNewRes(prev => prev + emoji)} />
              </div>

              {/* Day picker */}
              <div style={{ marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:11, color:C.t3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:FONT.sans }}>Which days?</span>
                  <div style={{ display:"flex", gap:4 }}>
                    {[{label:"Daily", days:[0,1,2,3,4,5,6]}, {label:"Weekdays", days:[0,1,2,3,4]}, {label:"Weekends", days:[5,6]}].map(preset => {
                      const isActive = preset.days.length === newDays.length && preset.days.every(d => newDays.includes(d));
                      return (
                        <button key={preset.label} onClick={() => setNewDays([...preset.days])} style={{
                          padding:"3px 8px", borderRadius:6, border:`1px solid ${isActive ? C.blue : C.border}`,
                          background: isActive ? C.blueTint : "transparent", cursor:"pointer",
                          fontSize:10, fontWeight:600, color: isActive ? C.blue : C.t4,
                          fontFamily:FONT.sans, transition:"all 0.15s",
                        }}>{preset.label}</button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((label, idx) => {
                    const isOn = newDays.includes(idx);
                    return (
                      <button key={label} onClick={() => {
                        setNewDays(prev => {
                          if (prev.includes(idx)) {
                            const next = prev.filter(d => d !== idx);
                            return next.length === 0 ? [idx] : next; // prevent empty
                          }
                          return [...prev, idx].sort();
                        });
                      }} style={{
                        flex:1, padding:"7px 0", borderRadius:8,
                        border:`1.5px solid ${isOn ? C.blue : C.border}`,
                        background: isOn ? C.blue : C.surfaceAlt,
                        color: isOn ? "#fff" : C.t3,
                        cursor:"pointer", fontSize:11, fontWeight:600,
                        fontFamily:FONT.sans, transition:"all 0.15s",
                      }}>{label}</button>
                    );
                  })}
                </div>
              </div>

              <button onClick={addRes} disabled={!newRes.trim()} style={{
                width:"100%", padding:"10px 0", borderRadius:10, border:"none",
                background: newRes.trim() ? C.blue : C.surfaceDim,
                color: newRes.trim() ? "#fff" : C.t4,
                cursor: newRes.trim() ? "pointer" : "default",
                fontWeight:600, fontSize:13, fontFamily:FONT.sans, transition:"all 0.2s",
                marginBottom:14,
              }}>Add resolution</button>

              {mRes.map(r => (
                <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:C.surfaceAlt, borderRadius:8, marginBottom:4, border:`1px solid ${C.borderLight}` }}>
                  <div style={{ minWidth:0 }}>
                    <span style={{ fontSize:13, color:C.t1, fontWeight:500, fontFamily:FONT.sans, display:"block" }}>{r.text}</span>
                    <span style={{ fontSize:10, color:C.t4, fontWeight:500, fontFamily:FONT.sans }}>{daysLabel(r)}</span>
                  </div>
                  <button onClick={() => removeRes(r.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:4, color:C.miss, fontSize:14, flexShrink:0 }}>×</button>
                </div>
              ))}

              {active.length > 0 && (
                <div style={{ marginTop:18 }}>
                  <p style={{ fontSize:11, color:C.t4, margin:"0 0 8px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:FONT.sans }}>
                    Active this month ({active.length})
                  </p>
                  {active.map(r => (
                    <div key={r.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", fontSize:12, color:C.t3, fontFamily:FONT.sans }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:C.blueM, flexShrink:0 }}/>
                      <span style={{ flex:1 }}>{r.text}</span>
                      <span style={{ fontSize:10, color:C.t4, whiteSpace:"nowrap" }}>{daysLabel(r)} · {MONTH_SHORT[r.fromMonth]}</span>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize:12, color:C.t4, marginTop:16, fontStyle:"italic", fontFamily:FONT.serif }}>
                Tap a calendar day to check off resolutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── QUOTE ───────────────────────────────────────────────────────────────────

function QuoteBar() {
  const q = useMemo(() => dailyQuote(), []);
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:20, padding:"22px 28px",
      background:C.surface, borderRadius:16, marginBottom:24,
      border:`1px solid ${C.borderLight}`,
      boxShadow:"0 1px 2px rgba(26,47,68,0.03)",
    }}>
      <div style={{
        width:40, height:40, borderRadius:12, background:C.blueTint,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={C.blueM} stroke="none"><path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/></svg>
      </div>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:16, color:C.ink, margin:0, lineHeight:1.55, fontFamily:FONT.serif, fontStyle:"italic", fontWeight:500 }}>
          {q.text}
        </p>
        <p style={{ fontSize:12, color:C.t3, margin:"6px 0 0", fontWeight:600, fontFamily:FONT.sans, letterSpacing:"0.02em" }}>
          {q.author}
        </p>
      </div>
    </div>
  );
}

// ─── REFLECTION ARCHIVE ──────────────────────────────────────────────────────

function ReflectionArchive({ gratitudeEntries }) {
  const [isOpen, setIsOpen] = useState(false);

  // Build sorted list of all entries, most recent first
  const entries = useMemo(() => {
    const map = load("gratitudePromptMap") || {};
    return Object.keys(gratitudeEntries)
      .filter(key => gratitudeEntries[key])
      .sort((a, b) => b.localeCompare(a))
      .map(dateKey => {
        const [y, m, d] = dateKey.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const today = todayKey();
        const yesterday = (() => { const dt = new Date(); dt.setDate(dt.getDate()-1); return dkey(dt.getFullYear(), dt.getMonth(), dt.getDate()); })();
        let label;
        if (dateKey === today) label = "Today";
        else if (dateKey === yesterday) label = "Yesterday";
        else label = dayNames[date.getDay()];
        return {
          dateKey,
          label,
          dateStr: `${d} ${MONTH_SHORT[m-1]} ${y}`,
          prompt: map[dateKey] || null,
          entry: gratitudeEntries[dateKey],
        };
      });
  }, [gratitudeEntries]);

  const entryCount = entries.length;

  if (entryCount === 0) return null;

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "16px 24px", border: "none", cursor: "pointer",
        background: isOpen ? C.surface : C.surfaceAlt,
        transition: "all 0.2s", textAlign: "left", fontFamily: FONT.sans,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round">
          <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontFamily: FONT.serif, flex: 1 }}>
          Reflection archive
        </span>
        <span style={{ fontSize: 12, color: C.t4, marginRight: 8 }}>
          {entryCount} {entryCount === 1 ? "entry" : "entries"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          padding: "4px 24px 20px", background: C.surface,
          maxHeight: 480, overflowY: "auto",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.map(e => (
              <div key={e.dateKey} style={{
                background: C.surfaceAlt, borderRadius: 12,
                padding: "14px 16px", border: `1px solid ${C.borderLight}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, fontFamily: FONT.sans,
                    color: e.label === "Today" ? C.blue : C.t2,
                  }}>{e.label}</span>
                  <span style={{ fontSize: 11, color: C.t4 }}>{e.dateStr}</span>
                </div>
                {e.prompt && (
                  <p style={{
                    fontSize: 12, color: C.t3, margin: "0 0 6px",
                    fontStyle: "italic", fontFamily: FONT.serif, lineHeight: 1.5,
                  }}>{e.prompt}</p>
                )}
                <p style={{
                  fontSize: 13, color: C.t1, margin: 0,
                  lineHeight: 1.65, fontFamily: FONT.sans,
                }}>{e.entry}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARED STYLES ───────────────────────────────────────────────────────────

const FONT = {
  sans: "'DM Sans', -apple-system, sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};

const cardStyle = {
  background: C.surface,
  borderRadius: 18,
  padding: "24px 26px",
  border: `1px solid ${C.borderLight}`,
  boxShadow: "0 1px 3px rgba(26,47,68,0.04)",
};

const labelStyle = {
  fontSize:13, color:C.t3, fontWeight:500, letterSpacing:"0.03em",
  textTransform:"uppercase", fontFamily:FONT.sans,
};

const navBtn = {
  width:32, height:32, borderRadius:9, border:`1px solid ${C.border}`,
  background:C.surfaceAlt, cursor:"pointer", fontSize:18, color:C.t2,
  display:"flex", alignItems:"center", justifyContent:"center",
  fontFamily:FONT.sans, fontWeight:300,
};

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  const [resolutions, setResolutions] = useState(() => load("resolutions") || {});
  const [completions, setCompletions] = useState(() => load("completions") || {});
  const [gratitudeEntries, setGratitudeEntries] = useState(() => load("gratitudeEntries") || {});
  const [usedPrompts, setUsedPrompts] = useState(() => load("usedPrompts") || []);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:FONT.sans, color:C.t1 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />

      <div style={{ maxWidth:980, margin:"0 auto", padding:"0 24px 72px" }}>
        {/* Header */}
        <div style={{
          background:"linear-gradient(160deg, #2C6693 0%, #5A9EC7 25%, #8EBDD9 45%, #C6DEF0 65%, #F0DCC8 85%, #FBF5EE 100%)",
          borderRadius:"0 0 20px 20px", padding:"48px 24px 44px", marginBottom:28,
          textAlign:"center", marginLeft:-24, marginRight:-24,
        }}>
          <h1 style={{ fontSize:36, fontWeight:500, color:"#FFFFFF", margin:0, fontFamily:FONT.serif, fontStyle:"italic", letterSpacing:"-0.01em", textShadow:"0 1px 12px rgba(30,58,80,0.18)" }}>
            {greeting}
          </h1>
          <p style={{ fontSize:14, color:"#FFFFFF", margin:"10px 0 0", fontFamily:FONT.sans, fontWeight:400, letterSpacing:"0.06em", textTransform:"uppercase", opacity:0.85 }}>
            {MONTH_NAMES[now.getMonth()]} {now.getDate()}, {now.getFullYear()}
          </p>
          <p style={{ fontSize:12, color:"#FFFFFF", margin:"6px 0 0", fontFamily:FONT.sans, opacity:0.6 }}>
            Month {now.getMonth() + 1} of 12 · {Math.round(((now.getMonth()) / 12) * 100)}% of the year
          </p>
        </div>

        <QuoteBar />

        <TodayHero
          resolutions={resolutions}
          completions={completions}
          setCompletions={setCompletions}
          gratitudeEntries={gratitudeEntries}
          usedPrompts={usedPrompts}
          setGratitudeEntries={setGratitudeEntries}
          setUsedPrompts={setUsedPrompts}
        />

        <div style={{ marginBottom:24 }}>
          <CalendarView
            resolutions={resolutions}
            setResolutions={setResolutions}
            completions={completions}
            setCompletions={setCompletions}
          />
        </div>

        <div style={{ marginBottom:24 }}>
          <ReflectionArchive gratitudeEntries={gratitudeEntries} />
        </div>

        <TodoSection />
      </div>
    </div>
  );
}
