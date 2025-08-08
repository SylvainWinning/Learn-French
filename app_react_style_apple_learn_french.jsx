import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Gamepad2, BarChart2, Settings, Volume2, Play, Pause, RotateCcw, CheckCircle2, Sun, Moon, MonitorSmartphone, Accessibility } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TODAY = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const LS_PREF = "frapp-pref";
const LS_PROGRESS = "frapp-progress";
const ACCENT_DEFAULT = "#FF2D55";

const STR = {
  en: {
    appTitle: "Learn French for Masha",
    tabs: { dash: "Dashboard", learn: "Learn", quiz: "Quiz", game: "Game", settings: "Settings" },
    overviewTitle: "Progress overview",
    overviewSub: "Your last 10 days at a glance.",
    todayTitle: "Today",
    todaySub: "Daily breakdown (auto-saved)",
    dailyGoal: "Daily goal progress",
    metricFlashcards: "Flashcards",
    metricQuiz: "Quiz correct",
    metricCheese: "Cheese eaten",
    flashcardsTitle: "Flashcards",
    flashcardsSub: "Tap Reveal to check the translation.",
    english: "English",
    speak: "Speak",
    reveal: "Reveal",
    hide: "Hide",
    next: "Next",
    gotIt: "I was right",
    notGotIt: "I was wrong",
    points: "Points",
    quizTitle: "Quick quiz",
    quizSub: "Pick the correct translation.",
    correct: "Correct!",
    tryAgain: "Try again…",
    gameTitle: "Mouse & Cheese",
    gameSub: "Use arrow keys. Eat 🧀 to hear a new French word!",
    pause: "Pause",
    play: "Play",
    reset: "Reset",
    restart: "Restart",
    lost: "You lost",
    score: "Score",
    settingsTitle: "Settings",
    vocabTitle: "Vocabulary",
    vocabSub: "Add custom words and phrases.",
    add: "Add",
    remove: "Remove",
    search: "Search",
    languageTitle: "App language",
    langEn: "English",
    langFr: "Français",
    themeTitle: "Theme",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    highRead: "High readability",
    emptyVocab: "No words yet",
  },
  fr: {
    appTitle: "Learn French for Masha",
    tabs: { dash: "Tableau de bord", learn: "Apprendre", quiz: "Quiz", game: "Jeu", settings: "Réglages" },
    overviewTitle: "Vue d'ensemble",
    overviewSub: "Vos 10 derniers jours en un coup d'œil.",
    todayTitle: "Aujourd'hui",
    todaySub: "Bilan du jour (auto-enregistré)",
    dailyGoal: "Objectif quotidien",
    metricFlashcards: "Cartes",
    metricQuiz: "Quiz correct",
    metricCheese: "Fromages mangés",
    flashcardsTitle: "Flashcards",
    flashcardsSub: "Touchez Révéler pour vérifier la traduction.",
    english: "Anglais",
    speak: "Écouter",
    reveal: "Révéler",
    hide: "Masquer",
    next: "Suivant",
    gotIt: "Je l'avais",
    notGotIt: "Je me suis trompé(e)",
    points: "Points",
    quizTitle: "Quiz rapide",
    quizSub: "Choisissez la bonne traduction.",
    correct: "Correct !",
    tryAgain: "Réessayez…",
    gameTitle: "Souris & Fromage",
    gameSub: "Flèches du clavier. Chaque 🧀 lit un nouveau mot !",
    pause: "Pause",
    play: "Jouer",
    reset: "Réinitialiser",
    restart: "Recommencer",
    lost: "Perdu",
    score: "Score",
    settingsTitle: "Réglages",
    vocabTitle: "Vocabulaire",
    vocabSub: "Ajoutez des mots et expressions.",
    add: "Ajouter",
    remove: "Supprimer",
    search: "Rechercher",
    languageTitle: "Langue de l'application",
    langEn: "English",
    langFr: "Français",
    themeTitle: "Thème",
    themeAuto: "Auto",
    themeLight: "Clair",
    themeDark: "Sombre",
    highRead: "Haute lisibilité",
    emptyVocab: "Aucun mot pour l'instant",
  },
};

const tget = (lang, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), STR[lang]) || path;

const BASE_VOCAB = [
  { fr: 'cependant', en: 'however' },
  { fr: 'toutefois', en: 'nevertheless' },
  { fr: 'pourtant', en: 'yet / however' },
  { fr: 'néanmoins', en: 'nonetheless' },
  { fr: 'en revanche', en: 'on the other hand' },
  { fr: 'par conséquent', en: 'therefore / consequently' },
  { fr: 'en effet', en: 'indeed / actually' },
  { fr: 'malgré', en: 'despite / in spite of' },
  { fr: 'au lieu de', en: 'instead of' },
  { fr: 'bien que', en: 'although' },
  { fr: 'quoique', en: 'although / even though' },
  { fr: 'tandis que', en: 'whereas / while' },
  { fr: 'afin que', en: 'so that / in order that' },
  { fr: 'à condition que', en: 'provided that' },
  { fr: 'un délai', en: 'a deadline / time frame' },
  { fr: 'une échéance', en: 'a due date' },
  { fr: 'un enjeu', en: 'a stake / key issue' },
  { fr: 'un atout', en: 'an asset / advantage' },
  { fr: 'une contrainte', en: 'a constraint' },
  { fr: 'un compromis', en: 'a compromise' },
  { fr: 'mettre en œuvre', en: 'to implement' },
  { fr: 'atteindre un objectif', en: 'to reach a goal' },
  { fr: 'tenir compte de', en: 'to take into account' },
  { fr: 'faire le point', en: 'to take stock / review' },
  { fr: 'remettre en cause', en: 'to call into question' },
  { fr: 'approfondir', en: 'to deepen / explore further' },
  { fr: 'préciser', en: 'to clarify / specify' },
  { fr: 'souligner', en: 'to highlight / underline' },
  { fr: 'convaincre', en: 'to convince' },
  { fr: 'fournir un justificatif', en: 'to provide supporting doc' },
  { fr: 'prendre rendez-vous', en: 'to make an appointment' },
  { fr: 'déposer une réclamation', en: 'to file a complaint' },
  { fr: 'faire un virement', en: 'to make a bank transfer' },
  { fr: 'souscrire un abonnement', en: 'to take out a subscription' },
  { fr: 'résilier un contrat', en: 'to cancel a contract' },
  { fr: 'pièces jointes', en: 'attachments' },
  { fr: 'une correspondance', en: 'a connection (flight/train)' },
  { fr: 'une annulation', en: 'a cancellation' },
  { fr: 'un remboursement', en: 'a refund' },
  { fr: 'un bagage en soute', en: 'checked baggage' },
  { fr: 'un bagage cabine', en: 'carry-on bag' },
  { fr: 'contrôle de sécurité', en: 'security check' },
  { fr: "une carte d'embarquement", en: 'boarding pass' },
  { fr: 'un retard', en: 'a delay' },
  { fr: 'une grève', en: 'a strike' },
  { fr: "l'hébergement", en: 'accommodation / lodging' },
  { fr: 'pension complète', en: 'full board' },
  { fr: 'location de voiture', en: 'car rental' },
  { fr: 'une ordonnance', en: 'a prescription' },
  { fr: 'une prise de sang', en: 'a blood test' },
  { fr: 'une mutuelle', en: 'top-up health insurance' },
  { fr: 'se faire rembourser', en: 'to get reimbursed' },
  { fr: 'des symptômes', en: 'symptoms' },
  { fr: 'un rendez-vous médical', en: 'a medical appointment' },
  { fr: 'à mon avis', en: 'in my opinion' },
  { fr: 'en ce qui concerne', en: 'regarding / as for' },
  { fr: 'tout compte fait', en: 'all things considered' },
  { fr: "ça n'a rien à voir", en: 'it has nothing to do with it' },
  { fr: 'par rapport à', en: 'compared to / regarding' },
  { fr: "il s'avère que", en: 'it turns out that' },
  { fr: "ça vaut le coup", en: "it's worth it" },
  { fr: 'avoir du mal à', en: 'to have trouble doing' },
  { fr: 'se débrouiller', en: 'to manage / cope' },
  { fr: 'faire face à', en: 'to face / deal with' },
  { fr: 'se rendre compte que', en: 'to realize that' },
  { fr: "quoi qu'il arrive", en: 'no matter what happens' },
  { fr: 'gérer une situation', en: 'to handle a situation' },
  { fr: 'éviter un malentendu', en: 'to avoid a misunderstanding' },
  { fr: 'prévoir', en: 'to anticipate / plan' },
  { fr: 'déclencher', en: 'to trigger' },
  { fr: 'aboutir à', en: 'to lead to / result in' },
  { fr: 'un bilan', en: 'an assessment / summary' },
  { fr: 'un témoignage', en: 'a testimony / account' },
  { fr: 'une polémique', en: 'a controversy' },
  { fr: 'un partenariat', en: 'a partnership' },
  { fr: 'une subvention', en: 'a grant / subsidy' },
  { fr: 'une réglementation', en: 'regulation / rules' },
  { fr: 'une démarche', en: 'an approach / procedure' },
  { fr: 'serait-il possible de…', en: 'would it be possible to…' },
  { fr: 'je vous prie de bien vouloir…', en: 'please kindly…' },
  { fr: 'je me permets de', en: "I'm taking the liberty to" },
  { fr: 'je tiens à vous remercier', en: 'I would like to thank you' },
  { fr: 'je suis censé(e) + inf.', en: 'I am supposed to' },
  { fr: 'ça me paraît + adj.', en: 'it seems + adj. to me' },
  { fr: 'au fur et à mesure', en: 'gradually / as you go' },
  { fr: 'tant que', en: 'as long as' },
  { fr: 'dès que', en: 'as soon as' },
  { fr: 'le quartier', en: 'neighborhood' },
  { fr: 'le trajet', en: 'journey / commute' },
  { fr: 'les travaux', en: 'roadworks / construction' },
  { fr: "l'imprévu", en: 'unforeseen event' },
  { fr: "l'occasion", en: 'opportunity / second-hand' }
];

function loadPrefs() {
  try {
    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const theme = mql && mql.matches ? 'dark' : 'light';
    let accent = ACCENT_DEFAULT;
    let lang = 'en';
    let themeMode = 'auto';
    let high = false;
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LS_PREF);
      if (raw) {
        try {
          const obj = JSON.parse(raw);
          if (obj && obj.accent) accent = obj.accent;
          if (obj && obj.lang) lang = obj.lang;
          if (obj && obj.themeMode) themeMode = obj.themeMode;
          if (obj && typeof obj.high === 'boolean') high = obj.high;
        } catch {}
      }
    }
    return { theme, accent, lang, themeMode, high };
  } catch {
    return { theme: 'light', accent: ACCENT_DEFAULT, lang: 'en', themeMode: 'auto', high: false };
  }
}

function savePrefs(p) { try { localStorage.setItem(LS_PREF, JSON.stringify(p)); } catch {} }

function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProgress(p) { try { localStorage.setItem(LS_PROGRESS, JSON.stringify(p)); } catch {} }

function useThemeAccent() {
  const [prefs, setPrefs] = useState(loadPrefs);
  useEffect(() => {
    const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (!mql) return;
    const apply = () => setPrefs(p => ({ ...p, theme: p.themeMode === 'auto' ? (mql.matches ? 'dark' : 'light') : p.themeMode }));
    apply();
    const handler = () => apply();
    if (mql.addEventListener) mql.addEventListener('change', handler); else if (mql.addListener) mql.addListener(handler);
    return () => { if (mql.removeEventListener) mql.removeEventListener('change', handler); else if (mql.removeListener) mql.removeListener(handler); };
  }, []);
  useEffect(() => {
    savePrefs(prefs);
    const root = document.documentElement;
    root.style.setProperty('--accent', prefs.accent || ACCENT_DEFAULT);
    root.style.setProperty('--radius', '12px');
    root.style.setProperty('--shadow-sm', '0 1px 0 rgba(0,0,0,0.06)');
    root.style.setProperty('--shadow-md', '0 8px 20px rgba(0,0,0,0.06)');
    root.style.setProperty('--space', '8px');

    if (prefs.theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.setProperty('--bg', '#000');
      root.style.setProperty('--card', '#111');
      root.style.setProperty('--text', '#f5f5f7');
      root.style.setProperty('--muted', '#a1a1a6');
      root.style.setProperty('--hairline', 'rgba(255,255,255,0.08)');
      root.style.setProperty('--chrome', 'rgba(255,255,255,0.06)');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.setProperty('--bg', '#fff');
      root.style.setProperty('--card', '#fff');
      root.style.setProperty('--text', '#1d1d1f');
      root.style.setProperty('--muted', '#6e6e73');
      root.style.setProperty('--hairline', 'rgba(0,0,0,0.08)');
      root.style.setProperty('--chrome', 'rgba(255,255,255,0.72)');
    }

    const meta = document.querySelector('meta[name="theme-color"]') || (()=>{const m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);return m;})();
    meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim() || (prefs.theme==='dark'?'#000':'#fff'));
  }, [prefs]);
  return [prefs, setPrefs];
}

function speakFrench(text, { rate = 0.9 } = {}) {
  if (typeof window === 'undefined' || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const applyAndSpeak = (voice) => {
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.lang = 'fr-FR';
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };
  const voices = speechSynthesis.getVoices();
  const fr = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
  if (fr) {
    applyAndSpeak(fr);
  } else {
    const handler = () => {
      const vs = speechSynthesis.getVoices();
      const v = vs.find(x => x.lang && x.lang.toLowerCase().startsWith('fr'));
      applyAndSpeak(v);
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
  }
}

function computeStreak(progressMap) {
  let streak = 0;
  let day = new Date();
  while (true) {
    const key = day.toISOString().slice(0, 10);
    const p = progressMap[key];
    if (p && (p.flashcardsSeen || p.quizCorrect || p.cheeseEaten)) streak += 1; else break;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

function ensureDay(progressMap, date = TODAY()) {
  if (!progressMap[date]) {
    progressMap[date] = { date, flashcardsSeen: 0, flashcardsCorrect: 0, quizCorrect: 0, cheeseEaten: 0, wordsHeard: [] };
  }
  return progressMap;
}

function makeQuestionFromVocab(vocab) {
  if (!Array.isArray(vocab) || vocab.length === 0) return { fr: '', en: '', options: [] };
  const correct = vocab[Math.floor(Math.random() * vocab.length)];
  const options = new Set([correct.en]);
  while (options.size < Math.min(4, vocab.length)) options.add(vocab[Math.floor(Math.random() * vocab.length)].en);
  const opts = Array.from(options).sort(() => Math.random() - 0.5);
  return { fr: correct.fr, en: correct.en, options: opts };
}

function AppShell({ children, active, setActive, prefs, t }) {
  const tabs = [
    { key: "dash", label: t("tabs.dash"), icon: BarChart2 },
    { key: "learn", label: t("tabs.learn"), icon: BookOpen },
    { key: "quiz", label: t("tabs.quiz"), icon: CheckCircle2 },
    { key: "game", label: t("tabs.game"), icon: Gamepad2 },
    { key: "settings", label: t("tabs.settings"), icon: Settings },
  ];
  return (
    <div data-theme={prefs.theme} className="min-h-[100svh]" style={{
      background: `radial-gradient(1200px 60% at 50% -10%, color-mix(in srgb, var(--accent) 14%, transparent), transparent), var(--bg)`,
      color: "var(--text)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
    }}>
      <header className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "var(--chrome)", boxShadow: "var(--shadow-sm)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-5 h-5 rounded-full" style={{ background: "var(--accent)" }} />
            <h1 className="font-medium tracking-tight" style={{ fontSize: "14px", letterSpacing: "-0.01em" }}>{t("appTitle")}</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[980px] px-4 md:px-6 pb-28">
        <div className="py-8 md:py-12 text-center">
          <div className="font-semibold" style={{
            fontSize: "clamp(28px,6vw,48px)",
            letterSpacing: "-0.02em",
            background: `linear-gradient(90deg, var(--accent) 0%, #FF6A88 50%, #FF2D55 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>Learn better. Every day.</div>
          <div className="mt-2 text-sm md:text-base" style={{ color: "var(--muted)" }}>Clean UI, quiet motion, strong type. Your French, elevated.</div>
        </div>
        {children}
      </main>

      <nav className="fixed bottom-3 left-0 right-0 mx-auto max-w-md rounded-2xl border backdrop-blur-md p-2 grid grid-cols-5 gap-1" style={{ borderColor: "var(--hairline)", background: "var(--chrome)" }}>
        {tabs.map(ti => (
          <button
            key={ti.key}
            onClick={() => setActive(ti.key)}
            className={`min-h-[44px] flex flex-col items-center gap-1 rounded-xl py-2 transition focus:outline-none focus-visible:ring-2 ring-[var(--accent)] ring-offset-2 ${active === ti.key ? "bg-[var(--accent)]/10" : "hover:bg-black/5 dark:hover:bg-white/5"}`}
            aria-current={active === ti.key ? 'page' : undefined}
            aria-label={ti.label}
          >
            <ti.icon size={18} style={{ color: active === ti.key ? "var(--accent)" : "var(--muted)" }} />
            <span className="text-[11px]" style={{ color: active === ti.key ? "var(--accent)" : "var(--muted)", fontWeight: 500 }}>{ti.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function SoftCard({ title, subtitle, children, actions }) {
  return (
    <motion.div
      layout
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 28 }}
      className="rounded-2xl p-4 md:p-6"
      style={{ background: "var(--card)", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-md)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <h2 className="font-semibold tracking-tight" style={{ fontSize: "clamp(18px,3vw,22px)", letterSpacing: "-0.01em" }}>{title}</h2>}
          {subtitle && <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function CountUp({ value, duration = 600 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setV(value); return; }
    const start = performance.now();
    const from = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(from + (value - from) * (1 - Math.cos(Math.PI * p)) / 2));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</span>;
}

function Flashcards({ vocab, onCardSeen, onSpeak, onMark, t }) {
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [points, setPoints] = useState(0);
  const current = vocab.length ? vocab[index % vocab.length] : { fr: '', en: '' };
  useEffect(() => { onCardSeen?.(); }, [index]);
  const next = () => { setReveal(false); setIndex(i => i + 1); };
  const masked = (text) => { if (!text) return ""; const first = text[0] || ""; return first + " ···"; };
  const mark = (ok) => { setPoints(p => p + (ok ? 1 : 0)); onMark?.(ok); next(); };
  return (
    <SoftCard title={t("flashcardsTitle")} subtitle={t("flashcardsSub")}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="rounded-2xl p-8 min-h-[180px] flex flex-col items-center justify-center text-center" style={{ background: "var(--card)", border: "1px solid var(--hairline)" }}>
          <div className="font-semibold tracking-tight" style={{ fontSize: "clamp(22px,4vw,32px)", color: "var(--accent)", letterSpacing: "-0.01em" }}>{current.fr}</div>
          <div className="mt-3 text-sm" style={{ color: "var(--muted)" }}>{t("english")}</div>
          <div className="mt-1 text-lg">
            <span style={{ filter: reveal ? 'none' : 'blur(6px)' }}>{reveal ? current.en : masked(current.en)}</span>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition focus:outline-none focus-visible:ring-2 ring-[var(--accent)] ring-offset-2" style={{ borderColor: "var(--hairline)" }} onClick={() => { onSpeak?.(current.fr); }} aria-label={t("speak")}>
              <span className="inline-flex items-center gap-2"><Volume2 size={16} /> {t("speak")}</span>
            </button>
            <button className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition focus:outline-none focus-visible:ring-2 ring-[var(--accent)] ring-offset-2" style={{ borderColor: "var(--hairline)" }} onClick={() => setReveal(r => !r)}>{reveal ? t("hide") : t("reveal")}</button>
            <button className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition focus:outline-none focus-visible:ring-2 ring-[var(--accent)] ring-offset-2" style={{ borderColor: "var(--hairline)" }} onClick={next}>{t("next")}</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }} onClick={() => mark(true)}>{t("gotIt")}</button>
            <button className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }} onClick={() => mark(false)}>{t("notGotIt")}</button>
            <div className="ml-auto text-sm" style={{ color: "var(--muted)" }}>{t("points")}: <strong style={{ color: "var(--accent)" }}><CountUp value={points} /></strong></div>
          </div>
        </div>
      </div>
    </SoftCard>
  );
}

function Quiz({ vocab, onCorrect, t }) {
  const [q, setQ] = useState(() => makeQuestionFromVocab(vocab));
  const [result, setResult] = useState(null);
  function choose(opt) {
    const ok = opt === q.en;
    setResult(ok);
    if (ok) {
      onCorrect?.();
      setTimeout(() => { setResult(null); setQ(makeQuestionFromVocab(vocab)); }, 900);
    } else {
      setTimeout(() => setResult(null), 800);
    }
  }
  return (
    <SoftCard title={t("quizTitle")} subtitle={t("quizSub")}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--hairline)" }}>
          <div className="text-sm" style={{ color: "var(--muted)" }}>Français</div>
          <div className="font-semibold tracking-tight" style={{ fontSize: "clamp(22px,4vw,28px)", color: "var(--accent)", letterSpacing: "-0.01em" }}>{q.fr}</div>
          <AnimatePresence>{result !== null && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-sm" style={{ color: result ? "#34C759" : "#FF3B30" }}>{result ? t("correct") : t("tryAgain")}</motion.div>)}</AnimatePresence>
        </div>
        <div className="grid gap-2">
          {q.options.map(o => (
            <button key={o} onClick={() => choose(o)} className="text-left px-4 py-3 min-h-[44px] rounded-xl border hover:shadow transition focus:outline-none focus-visible:ring-2 ring-[var(--accent)] ring-offset-2" style={{ borderColor: "var(--hairline)" }}>{o}</button>
          ))}
        </div>
      </div>
    </SoftCard>
  );
}

function MouseCheese({ onEat, onWord, t }) {
  const canvasRef = useRef(null);
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const grid = 18;
  const speedBase = 14;
  const dirRef = useRef({ x: 1, y: 0 });
  const frameRef = useRef(0);
  const tailRef = useRef([{ x: 5, y: 9 }]);
  const cheeseRef = useRef(randCell());
  function randCell() { return { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) }; }
  const reset = () => { tailRef.current = [{ x: 5, y: 9 }]; dirRef.current = { x: 1, y: 0 }; setScore(0); setRunning(true); };
  useEffect(() => {
    const onKey = (e) => {
      const key = e.key;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        e.preventDefault();
        const { x, y } = dirRef.current;
        if (key === "ArrowUp" && y !== 1) dirRef.current = { x: 0, y: -1 };
        if (key === "ArrowDown" && y !== -1) dirRef.current = { x: 0, y: 1 };
        if (key === "ArrowLeft" && x !== 1) dirRef.current = { x: -1, y: 0 };
        if (key === "ArrowRight" && x !== -1) dirRef.current = { x: 1, y: 0 };
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf;
    const loop = () => {
      frameRef.current++;
      const speed = Math.max(6, speedBase - Math.floor(score / 6));
      if (frameRef.current % speed === 0) {
        const size = Math.min(window.innerWidth * 0.9, 480);
        canvasRef.current.width = size;
        canvasRef.current.height = size;
        const cw = size / grid;
        const tail = tailRef.current;
        const head = { ...tail[0] };
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;
        if (head.x < 0 || head.y < 0 || head.x >= grid || head.y >= grid) { setRunning(false); return; }
        if (tail.some((p, i) => i && p.x === head.x && p.y === head.y)) { setRunning(false); return; }
        tail.unshift(head);
        if (head.x === cheeseRef.current.x && head.y === cheeseRef.current.y) { setScore(s => s + 1); cheeseRef.current = randCell(); onEat?.(); onWord?.(); } else { tail.pop(); }
        ctx.clearRect(0, 0, size, size);
        for (let y = 0; y < grid; y++) {
          for (let x = 0; x < grid; x++) {
            let fill = (x + y) % 2 ? "#fafafa" : "#f2f2f2";
            const isDark = (document.documentElement.getAttribute('data-theme') === 'dark') || document.documentElement.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) fill = (x + y) % 2 ? "#0c0c0c" : "#121212";
            ctx.fillStyle = fill;
            ctx.fillRect(x * cw, y * cw, cw, cw);
          }
        }
        ctx.font = `${Math.floor(cw * 0.8)}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🧀", (cheeseRef.current.x + 0.5) * cw, (cheeseRef.current.y + 0.5) * cw);
        tail.forEach((seg, i) => {
          const emoji = i === 0 ? "🐭" : "●";
          if (emoji === "●") {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent") || ACCENT_DEFAULT;
            ctx.beginPath();
            ctx.arc((seg.x + 0.5) * cw, (seg.y + 0.5) * cw, cw * 0.35, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillText(emoji, (seg.x + 0.5) * cw, (seg.y + 0.5) * cw);
          }
        });
      }
      raf = requestAnimationFrame(loop);
    };
    if (running) raf = requestAnimationFrame(loop);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [running, score]);
  return (
    <SoftCard title={t("gameTitle")} subtitle={t("gameSub")}>
      <div className="relative flex flex-col items-center gap-3">
        <canvas ref={canvasRef} className="w-full max-w-[480px] rounded-2xl" style={{ touchAction: "none", border: "1px solid var(--hairline)" }} />
        {!running && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--hairline)", boxShadow: "var(--shadow-md)" }}>
              <div className="text-center p-4">
                <div className="text-lg font-semibold mb-2">{t("lost")}</div>
                <button onClick={reset} className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }}>{t("restart")}</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => setRunning(r => !r)} className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }}>
            {running ? <span className="inline-flex items-center gap-2"><Pause size={16}/> {t("pause")}</span> : <span className="inline-flex items-center gap-2"><Play size={16}/> {t("play")}</span>}
          </button>
          <button onClick={reset} className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }}>
            <span className="inline-flex items-center gap-2"><RotateCcw size={16}/> {t("reset")}</span>
          </button>
          <span className="ml-2 text-sm" style={{ color: "var(--muted)" }}>{t("score")}: <strong style={{ color: "var(--accent)" }}>{score}</strong></span>
        </div>
      </div>
    </SoftCard>
  );
}

function Dashboard({ progress, t }) {
  const data = useMemo(() => {
    const days = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const p = progress[key] || { cheeseEaten: 0, quizCorrect: 0, flashcardsSeen: 0 };
      days.push({ date: key.slice(5), Cheese: p.cheeseEaten, Quiz: p.quizCorrect, Cards: p.flashcardsSeen });
    }
    return days;
  }, [progress]);
  const streak = computeStreak(progress);
  const booting = false;
  return (
    <div className="grid gap-4">
      <SoftCard title={t("overviewTitle")} subtitle={t("overviewSub")}>
        {booting ? (
          <div className="h-56 w-full animate-pulse rounded-xl" style={{ background: "rgba(0,0,0,0.04)" }} />
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--hairline)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--hairline)" />
                <RTooltip />
                <Line type="monotone" dataKey="Cheese" stroke="var(--accent)" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="Quiz" stroke="#c7c7cc" dot={false} />
                <Line type="monotone" dataKey="Cards" stroke="#8e8e93" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 text-sm" style={{ color: "var(--muted)" }}>Streak: <span className="font-semibold" style={{ color: "var(--accent)" }}>{streak} day{streak === 1 ? "" : "s"}</span></div>
      </SoftCard>
      <SoftCard title={t("todayTitle")} subtitle={t("todaySub")}>
        <TodayBreakdown progress={progress} t={t} />
      </SoftCard>
    </div>
  );
}

function TodayBreakdown({ progress, t }) {
  const p = progress[TODAY()] || { flashcardsSeen: 0, quizCorrect: 0, cheeseEaten: 0 };
  const total = p.flashcardsSeen + p.quizCorrect + p.cheeseEaten;
  const pct = Math.min(100, Math.round((total / 20) * 100));
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-3">
        <Metric label={t("metricFlashcards")} value={p.flashcardsSeen} />
        <Metric label={t("metricQuiz")} value={p.quizCorrect} />
        <Metric label={t("metricCheese")} value={p.cheeseEaten} />
      </div>
      <div className="mt-4">
        <div className="text-sm mb-2" style={{ color: "var(--muted)" }}>{t("dailyGoal")}</div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
          <div className="h-full" style={{ width: `${pct}%`, background: "var(--accent)", transition: "width 600ms cubic-bezier(.2,.8,.2,1)" }} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "var(--card)", border: "1px solid var(--hairline)" }}>
      <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="font-semibold" style={{ fontSize: "clamp(20px,4vw,28px)", color: "var(--accent)", letterSpacing: "-0.01em", fontVariantNumeric: 'tabular-nums' }}><CountUp value={value} /></div>
    </div>
  );
}

function SettingsPane({ vocab, setVocab, prefs, setPrefs, t }) {
  const [newWordFr, setNewWordFr] = useState("");
  const [newWordEn, setNewWordEn] = useState("");
  const [q, setQ] = useState("");
  const addWord = () => {
    if (!newWordFr || !newWordEn) return;
    setVocab(v => {
      const withoutDup = v.filter(w => w.fr !== newWordFr);
      return [...withoutDup, { fr: newWordFr, en: newWordEn }];
    });
    setNewWordFr("");
    setNewWordEn("");
  };
  const filtered = useMemo(() => { const s = q.trim().toLowerCase(); if (!s) return vocab; return vocab.filter(w => w.fr.toLowerCase().includes(s) || w.en.toLowerCase().includes(s)); }, [q, vocab]);
  return (
    <div className="grid gap-4">
      <SoftCard title={t("settingsTitle")} subtitle={t("languageTitle")} actions={
        <div className="flex gap-2 items-center">
          <button onClick={() => setPrefs(p => ({ ...p, lang: 'en' }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.lang==='en' ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }}>{t("langEn")}</button>
          <button onClick={() => setPrefs(p => ({ ...p, lang: 'fr' }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.lang==='fr' ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }}>{t("langFr")}</button>
        </div>
      } />

      <SoftCard title={t("themeTitle")} subtitle="" actions={
        <div className="flex gap-2 items-center">
          <button onClick={() => setPrefs(p => ({ ...p, themeMode: 'auto' }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.themeMode==='auto' ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }} aria-label={t("themeAuto")}><MonitorSmartphone size={16} /></button>
          <button onClick={() => setPrefs(p => ({ ...p, themeMode: 'light', theme: 'light' }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.themeMode==='light' ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }} aria-label={t("themeLight")}><Sun size={16} /></button>
          <button onClick={() => setPrefs(p => ({ ...p, themeMode: 'dark', theme: 'dark' }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.themeMode==='dark' ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }} aria-label={t("themeDark")}><Moon size={16} /></button>
          <button onClick={() => setPrefs(p => ({ ...p, high: !p.high }))} className={`px-3 py-2 min-h-[36px] rounded-full border ${prefs.high ? 'bg-[var(--accent)]/10' : ''}`} style={{ borderColor: "var(--hairline)" }} aria-label={t("highRead")}><Accessibility size={16} /></button>
        </div>
      } />

      <SoftCard title={t("vocabTitle")} subtitle={t("vocabSub")}>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <input value={newWordFr} onChange={e => setNewWordFr(e.target.value)} placeholder="Français" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: "var(--hairline)" }} />
          <input value={newWordEn} onChange={e => setNewWordEn(e.target.value)} placeholder="English" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: "var(--hairline)" }} />
          <button onClick={addWord} className="px-3 py-2 min-h-[44px] rounded-xl border hover:shadow transition" style={{ borderColor: "var(--hairline)" }}>{t("add")}</button>
        </div>
        <div className="mt-4">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("search")} className="w-full rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: "var(--hairline)" }} />
        </div>
        <div className="mt-3 max-h-72 overflow-auto rounded-xl border" style={{ borderColor: "var(--hairline)" }}>
          <table className="w-full text-sm">
            <tbody>
              {filtered.length === 0 ? (
                <tr><td className="px-3 py-8 text-center" colSpan={3} style={{ color: "var(--muted)" }}>😺 {t("emptyVocab")}</td></tr>
              ) : (
                filtered.map((w, i) => (
                  <tr key={`${w.fr}-${w.en}-${i}`} className="border-b" style={{ borderColor: "var(--hairline)" }}>
                    <td className="px-3 py-2 font-medium">{w.fr}</td>
                    <td className="px-3 py-2" style={{ color: "var(--muted)" }}>{w.en}</td>
                    <td className="px-3 py-2 text-right"><button onClick={() => setVocab(v => v.filter(x => !(x.fr === w.fr && x.en === w.en)))} className="text-sm" style={{ color: "#FF3B30" }}>{t("remove")}</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SoftCard>
    </div>
  );
}

function runDevTests() {
  try {
    console.groupCollapsed('%cDEV TESTS','color:#64748b');
    const iso = TODAY();
    console.assert(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(iso), 'TODAY() format');
    const pm = {};
    const d0 = TODAY();
    const d1 = new Date(); d1.setDate(d1.getDate()-1);
    const d1s = d1.toISOString().slice(0,10);
    ensureDay(pm, d0); pm[d0].flashcardsSeen = 1;
    ensureDay(pm, d1s); pm[d1s].quizCorrect = 2;
    const st = computeStreak(pm);
    console.assert(st >= 2, `streak>=2 got ${st}`);
    console.assert(typeof speakFrench === 'function', 'speakFrench');
    const themeAttr = document.documentElement.getAttribute('data-theme');
    console.assert(themeAttr === 'dark' || themeAttr === 'light', 'data-theme');
    console.assert(['auto','light','dark'].includes(loadPrefs().themeMode), 'themeMode');
    const q = makeQuestionFromVocab(BASE_VOCAB);
    console.assert(q && q.fr && q.en && Array.isArray(q.options) && q.options.length >= 2, 'makeQuestionFromVocab');
    console.groupEnd();
  } catch (e) { console.warn('DEV TESTS failed', e); }
}

export default function App() {
  const [prefs, setPrefs] = useThemeAccent();
  const t = (k) => tget(prefs.lang || 'en', k);
  const [active, setActive] = useState("dash");
  const [vocab, setVocab] = useState(() => {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem("frapp-vocab") : null;
      const sv = stored ? JSON.parse(stored) : [];
      const map = new Map();
      [...BASE_VOCAB, ...sv].forEach(w => { if (w && w.fr) map.set(w.fr, w); });
      return Array.from(map.values());
    } catch { return BASE_VOCAB.slice(); }
  });
  const [progress, setProgress] = useState(loadProgress);
  useEffect(() => { try { localStorage.setItem("frapp-vocab", JSON.stringify(vocab)); } catch {} }, [vocab]);
  useEffect(() => { saveProgress(progress); }, [progress]);
  useEffect(() => { runDevTests(); }, []);
  const inc = (key, extra) => {
    setProgress(prev => {
      const map = { ...prev };
      ensureDay(map);
      if (key) map[TODAY()][key] = (map[TODAY()][key] || 0) + 1;
      if (extra?.word) map[TODAY()].wordsHeard = Array.from(new Set([...(map[TODAY()].wordsHeard || []), extra.word]));
      if (extra?.flashOk) map[TODAY()].flashcardsCorrect = (map[TODAY()].flashcardsCorrect || 0) + 1;
      return map;
    });
  };
  const sayWord = () => { if (!vocab.length) return; const w = vocab[Math.floor(Math.random() * vocab.length)].fr; speakFrench(w); inc("cheeseEaten", { word: w }); };
  const speak = (fr) => { speakFrench(fr); };
  return (
    <AppShell active={active} setActive={setActive} prefs={prefs} t={t}>
      <style>{`
        :root{--accent:${ACCENT_DEFAULT}}
        ::selection{ background: color-mix(in srgb, var(--accent) 24%, transparent); }
        body{ -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
      `}</style>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 28 }}>
          {active === "dash" && <Dashboard progress={progress} t={t} />}
          {active === "learn" && (
            <div className="grid gap-4">
              <Flashcards vocab={vocab} onCardSeen={() => inc("flashcardsSeen") } onSpeak={speak} onMark={(ok)=> ok && inc("flashcardsCorrect")} t={t} />
            </div>
          )}
          {active === "quiz" && (
            <div className="grid gap-4">
              <Quiz vocab={vocab} onCorrect={() => inc("quizCorrect")} t={t} />
            </div>
          )}
          {active === "game" && (
            <MouseCheese onEat={() => {}} onWord={sayWord} t={t} />
          )}
          {active === "settings" && (
            <SettingsPane vocab={vocab} setVocab={setVocab} prefs={prefs} setPrefs={setPrefs} t={t} />
          )}
          <footer className="mt-8 text-center text-xs" style={{ color: "var(--muted)" }}>Made with ❤️ — All data saved locally on your device.</footer>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
