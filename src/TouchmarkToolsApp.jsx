import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  FileText,
  X,
  CheckCircle2,
  Share2,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  Scale,
  Compass,
  History,
  Eye,
  BookOpen,
  Youtube,
  GraduationCap,
  Radio,
  ShieldAlert,
  Clock,
  FolderOpen,
  SearchCheck,
  Trash2,
  Printer,
  ArrowUpRight,
  HelpCircle,
  Layers,
  PenTool,
  Video,
  CheckSquare,
  GitBranch,
  PlusCircle,
  RefreshCw,
  Scissors
} from 'lucide-react';

// --- BESPOKE PRECISION TOUCHMARK LOGO (Resonance Astrolabe & Focal Lens) ---
function TouchmarkLogo({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="tmCoreGlow" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="55%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <linearGradient id="tmRingGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#D97706" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17.5" stroke="url(#tmRingGrad)" strokeWidth="1.2" />
      <line x1="20" y1="1.5" x2="20" y2="5" stroke="#FCD34D" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="35" x2="20" y2="38.5" stroke="#FCD34D" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="1.5" y1="20" x2="5" y2="20" stroke="#FCD34D" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="35" y1="20" x2="38.5" y2="20" stroke="#FCD34D" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse
        cx="20"
        cy="20"
        rx="13.5"
        ry="7.5"
        transform="rotate(-32 20 20)"
        stroke="#FBBF24"
        strokeOpacity="0.55"
        strokeWidth="1.15"
      />
      <circle cx="20" cy="20" r="8.2" stroke="#FDE68A" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 2.5" />
      <circle cx="20" cy="20" r="3.4" fill="url(#tmCoreGlow)" />
    </svg>
  );
}

// --- MODE METADATA & URL HELPERS ---
const MODE_META = {
  signal: {
    name: 'Touchmark Signal',
    tagline: 'Investigative power-dynamics intelligence, narrative audits & creator studio',
    welcome:
      'Bring any headline, policy shift, or institutional narrative to examine what is operating beneath the surface.'
  },
  pulse: {
    name: 'Touchmark Pulse',
    tagline: 'Relational, psychological & strategic discernment beneath the surface',
    welcome:
      'Speak or write through a personal dilemma, relational tension, or high-stakes decision to uncover hidden incentives.'
  }
};

function resolveInitialMode() {
  if (typeof window === 'undefined') return 'signal';
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const queryMode = (params.get('mode') || '').toLowerCase();
  if (path.includes('pulse') || queryMode === 'pulse') return 'pulse';
  return 'signal';
}

// --- WEB AUDIO HARMONIC CONTEMPLATION ENGINE ---
function createContemplationSoundscape() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  let ctx = null;
  let masterGain = null;
  let activeNodes = [];

  const startThinkingDrone = (mode = 'pulse') => {
    try {
      stopThinkingDrone(false);
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.045, now + 0.9);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(340, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.28, now);
      lfoGain.gain.setValueAtTime(110, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const root = mode === 'signal' ? 110 : 98;
      const freqs = [root, root * 1.498, root * 2.247];
      const oscs = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        oscGain.gain.setValueAtTime(idx === 0 ? 0.55 : 0.22, now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        return osc;
      });

      lfo.start(now);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      activeNodes = [...oscs, lfo];
    } catch {}
  };

  const stopThinkingDrone = (playChime = true) => {
    try {
      if (!ctx) return;
      const now = ctx.currentTime;
      if (masterGain) {
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      }
      const nodesToStop = [...activeNodes];
      activeNodes = [];
      setTimeout(() => {
        nodesToStop.forEach((n) => {
          try {
            n.stop();
          } catch {}
        });
      }, 400);

      if (playChime) {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(587.33, now);
        chimeOsc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.032, now + 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now);
        chimeOsc.stop(now + 0.9);
      }
    } catch {}
  };

  return { startThinkingDrone, stopThinkingDrone };
}

// --- 3D MORPHING SPHERICAL RESONANCE ORB ---
function MorphingSphereOrb({ status, mode, onClick }) {
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  const palette =
    mode === 'signal'
      ? {
          aura: 'radial-gradient(circle at 35% 30%, rgba(251,191,36,0.45), rgba(217,119,6,0.18) 55%, transparent 75%)',
          sphere:
            'radial-gradient(circle at 32% 28%, rgba(254,243,199,0.58) 0%, rgba(245,158,11,0.4) 32%, rgba(120,53,15,0.68) 72%, rgba(12,10,9,0.96) 100%)',
          rim: 'rgba(251,191,36,0.5)',
          dot: 'bg-amber-300'
        }
      : {
          aura: 'radial-gradient(circle at 35% 30%, rgba(52,211,153,0.42), rgba(20,184,166,0.16) 55%, transparent 75%)',
          sphere:
            'radial-gradient(circle at 32% 28%, rgba(209,250,229,0.58) 0%, rgba(16,185,129,0.38) 32%, rgba(6,78,59,0.7) 72%, rgba(12,10,9,0.96) 100%)',
          rim: 'rgba(52,211,153,0.5)',
          dot: 'bg-emerald-300'
        };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <style>{`
        @keyframes touchmarkMorph {
          0%, 100% { border-radius: 52% 48% 50% 50% / 50% 52% 48% 50%; transform: rotate(0deg) scale(1); }
          33% { border-radius: 58% 42% 46% 54% / 46% 56% 44% 54%; transform: rotate(120deg) scale(1.03); }
          66% { border-radius: 44% 56% 54% 46% / 54% 44% 56% 46%; transform: rotate(240deg) scale(0.98); }
        }
        @keyframes touchmarkPulseFast {
          0%, 100% { border-radius: 60% 40% 55% 45% / 45% 58% 42% 55%; transform: scale(1.04); }
          50% { border-radius: 42% 58% 45% 55% / 56% 42% 58% 44%; transform: scale(1.12); }
        }
        @keyframes orbitSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitSpinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .orb-organic {
          animation: touchmarkMorph 11s ease-in-out infinite;
        }
        .orb-active {
          animation: touchmarkPulseFast 2.1s ease-in-out infinite;
        }
        .orbit-cw {
          animation: orbitSpin 3.6s linear infinite;
        }
        .orbit-ccw {
          animation: orbitSpinReverse 5.2s linear infinite;
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        aria-label={isListening ? 'Stop listening' : 'Tap sphere to speak'}
        className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center focus:outline-none group cursor-pointer"
      >
        <div
          style={{ background: palette.aura }}
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
            isListening || isSpeaking || isThinking ? 'opacity-100 scale-115' : 'opacity-70 group-hover:opacity-95'
          }`}
        />

        {isThinking && (
          <>
            <div
              style={{ borderColor: palette.rim }}
              className="absolute w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-dashed opacity-60 orbit-cw pointer-events-none"
            >
              <span className={`absolute -top-1 left-1/2 w-2 h-2 rounded-full ${palette.dot} shadow-lg`} />
            </div>
            <div
              style={{ borderColor: palette.rim }}
              className="absolute w-42 h-42 sm:w-46 sm:h-46 rounded-full border border-dotted opacity-45 orbit-ccw pointer-events-none"
            >
              <span className={`absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full ${palette.dot}`} />
            </div>
          </>
        )}

        <div
          style={{
            border: `1px solid ${palette.rim}`,
            boxShadow: `inset 0 0 40px ${palette.rim}`
          }}
          className={`absolute w-40 h-40 sm:w-44 sm:h-44 opacity-45 transition-all duration-500 ${
            isListening || isSpeaking || isThinking ? 'orb-active' : 'orb-organic'
          }`}
        />

        <div
          style={{
            background: palette.sphere,
            boxShadow: `inset -18px -22px 38px rgba(0,0,0,0.82), inset 10px 12px 24px rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.75)`
          }}
          className={`relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center transition-transform duration-500 ${
            isListening || isSpeaking || isThinking ? 'orb-active' : 'orb-organic group-hover:scale-[1.03]'
          }`}
        >
          <div className="absolute top-5 left-7 w-12 h-8 rounded-full bg-white/20 blur-md -rotate-25 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-stone-100/85">
            {isListening && <Mic className="w-6 h-6 text-amber-200 animate-pulse" />}
            {isThinking && (
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${palette.dot} animate-bounce`} />
                <span
                  className={`w-2 h-2 rounded-full ${palette.dot} animate-bounce`}
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className={`w-2 h-2 rounded-full ${palette.dot} animate-bounce`}
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            )}
            {isSpeaking && <Volume2 className="w-6 h-6 text-amber-100 animate-pulse" />}
          </div>
        </div>
      </button>
    </div>
  );
}

// --- PROMPTS, STARTERS & PROGRESSIVE SCHEMAS ---
const SIGNAL_STARTER_PROMPTS = [
  "Examine the timing, media curation & power dynamics behind Russell Brand's 2026 conviction",
  "Look beneath the mainstream framing of digital IDs and central bank programmable currency",
  "Dissect the narrative curation and competing probabilities around the latest geopolitical escalation"
];

const PULSE_STARTER_PROMPTS = [
  "I'm avoiding a hard conversation with someone important because I don't want to fracture the peace",
  "I have an opportunity that looks great on paper, but something in my gut feels off about the incentives"
];

function expandSignalQuery(rawQuery) {
  const wordCount = rawQuery.trim().split(/\s+/).length;
  if (wordCount >= 18) return rawQuery;
  return `Examine "${rawQuery}" deeply beneath the mainstream narrative: audit how corporate and state media curate or distort the framing, evaluate the conspicuous rarity of the timing and surrounding details, distinguish independent convergence from active coordination, model what political, economic, or judicial power operating behind the scenes would look like with historical precedents, and weigh the competing probabilities.`;
}

const PULSE_SYSTEM_PROMPT = `You are Touchmark Pulse, a candid, deeply perceptive strategic, psychological, and relational intelligence copilot.
Look beneath the surface of the user's situation—naming unspoken power dynamics, hidden incentives, self-deceptions, and downstream consequences.
Provide a rich 5–6 sentence spoken synthesis ("spokenReflection") and populate all fields in the schema, including 5–6 high-integrity thinkers, books, essays, or YouTube talks across analytical, psychological, and philosophical/spiritual traditions.`;

const PULSE_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    coreTension: { type: 'STRING' },
    hiddenAssumption: { type: 'STRING' },
    powerDynamic: { type: 'STRING' },
    spokenReflection: { type: 'STRING' },
    options: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          label: { type: 'STRING' },
          stance: { type: 'STRING' },
          tradeoff: { type: 'STRING' }
        },
        required: ['label', 'stance', 'tradeoff']
      }
    },
    deepDiveReferences: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          creatorOrPublication: { type: 'STRING' },
          lens: { type: 'STRING' },
          format: { type: 'STRING' },
          whyItMatters: { type: 'STRING' },
          searchQuery: { type: 'STRING' }
        },
        required: ['title', 'creatorOrPublication', 'lens', 'format', 'whyItMatters', 'searchQuery']
      }
    }
  },
  required: [
    'title',
    'coreTension',
    'hiddenAssumption',
    'powerDynamic',
    'spokenReflection',
    'options',
    'deepDiveReferences'
  ]
};

const SIGNAL_CORE_PROMPT = `You are Touchmark Signal, an independent investigative intelligence platform.
GOVERNING PRINCIPLE: Be deeply skeptical of concentrated power, institutional authority, and mainstream media consensus—while remaining rigorously honest about what the evidence actually proves versus what remains an open hypothesis. Never conflate unusual timing with proven conspiracy.

Anchor on the VERIFIED LIVE SEARCH FACT SHEET provided. Classify every timeline event by legal status (Enacted Law | Executive Order | Proposed Rule | Draft Bill | Commercial Deal | Judicial Action) and epistemic grade (Verified Fact | Documented Association | Strong Inference).

Score the 4 diagnostic gauges (0–100) with plain-English summaries explaining how to read the number for this specific case:
1. constellationRarityScore (0–100): How statistically/historically unusual is the timing and clustering of these events?
2. narrativeCurationScore (0–100): How heavily are mainstream headlines packaging, synchronizing, or omitting key facts from the primary record?
3. coordinationEvidenceScore (0–100): Distinguishes Independent Convergence (0–25) and Structural Alignment (26–50) from Coordinated Influence (51–75) and Documented Collusion (76–100).
4. centerOfGravityLikelihood (0–100): How strongly the verified record points toward the primary structural driver vs. the official public explanation.

Return valid JSON matching SIGNAL_CORE_SCHEMA.`;

const SIGNAL_DEEP_PROMPT = `You are Touchmark Signal, an independent investigative intelligence platform.
GOVERNING PRINCIPLE: Follow the power aggressively, map concrete institutional relationships, ask uncomfortable questions, and separate what is Documented from what is Suspected and Unknown—while steelmanning the strongest counter-explanation.

Populate Stage 2 in valid JSON matching SIGNAL_DEEP_SCHEMA:
1. followThePower: 5–6 sharp entries auditing: Who proposed/drafted it? Who funded the research? Who lobbied? Who benefits commercially? Who gains gatekeeping control? Who oversees the overseers? Tag each with epistemicGrade (Verified Fact | Documented Association | Strong Inference | Plausible Hypothesis).
2. relationshipMap: 5–7 concrete entity-to-entity connections (sourceEntity, relationshipType, targetEntity, epistemicGrade) showing boards, contracts, lobbying, funding, or regulatory ties.
3. powerOperationBlueprint: 2 detailed paragraphs mapping layer-by-layer chokepoints and how de facto gatekeeping operates even without formal bans.
4. scenarios: 3 calibrated possibilities with concrete caseFor AND steelmanned caseAgainst.
5. uncomfortableQuestions: 5–6 piercing, non-accusatory investigative questions conventional reporting is failing to ask.
6. investigationGap: Explicit ledger separating "established" (documented facts), "suspected" (plausible alignment/capture), "unknown" (what lacks proof), and "nextTargets" (specific dockets, lobbying filings, or records to check next).
7. diagnosticChecklist: 4–5 exact primary records/dockets and what falsifiable test to look for.
8. historicalPrecedents: 2 paragraphs citing 3–4 historical parallels, explicitly stating BOTH where the analogy holds AND where it breaks down.
9. spectrumPerspectives: 6 functional analytical lenses (Competition & Antitrust, National Security, Civil Liberties, Industrial Policy, Empirical/Technical Assessment, and Philosophical & Civilizational Critique)—stating each lens's coreQuestion, credible thinkers, and accurate thesis without partisan caricature.
10. researchLibrary: 9–11 high-integrity entries (including AT LEAST 3 YouTube talks spanning Left, Centrist, and Right thinkers, plus peer-reviewed studies and Substack essays). CRITICAL: Do NOT invent or guess URLs—provide exact "searchQuery" strings only.`;

const STUDIO_SYSTEM_PROMPT = `You are Touchmark Studio, an elite investigative editorial and documentary producer.
Transform the provided Signal investigation or external creator research notes into broadcast- and publication-ready assets WITHOUT overstating what the evidence proves:
1. editorialHook: A compelling, high-curiosity opening hook grounded strictly in verified facts.
2. alternativeAngles: 3 distinct story angles (including one that explores the strongest counter-argument or empirical nuance).
3. substackEssayDraft: A structured, 900–1,100 word investigative Substack essay with subheadings, verified chronology, narrative audit, and open investigative questions.
4. youtubePodcastScript: A structured 8–10 minute YouTube video essay / podcast script with [COLD OPEN], [CHAPTER 1: THE SURFACE NARRATIVE], [CHAPTER 2: THE VERIFIED RECORD], [CHAPTER 3: FOLLOW THE POWER], [CHAPTER 4: THE COUNTER-CASE & OPEN QUESTIONS], and [OUTRO].
5. shortFormPack: 3 standalone short-form video scripts (platform, hook, coreBeat, visualDirection) designed for YouTube Shorts / Reels / X video.
6. doNotCompressWarnings: 2–3 explicit editorial warnings identifying complex claims or unresolved hypotheses from this investigation that MUST NOT be compressed into short-form clips because removing context would misrepresent the evidence.
7. visualAssetChecklist: 5–6 concrete on-screen graphics, primary filings, or maps to display at specific script beats (never invent fake evidence).
8. evidenceIntegrityAudit: 3–4 editorial guardrails warning the creator which claims are "Strong Inferences" or "Suspected" rather than proven facts so they publish with bulletproof journalistic credibility.`;

const REVISION_SYSTEM_PROMPT = `You are Touchmark Signal's Cumulative Investigation Engine.
The user is appending new developments, filings, or evidence to an existing investigation.
1. Evaluate how this new evidence shifts the 4 diagnostic scalars (Constellation Rarity, Narrative Curation, Coordination Evidence, Center of Gravity).
2. Create a clean newTimelineEntry with date, legalStatus, and epistemicGrade.
3. Write a concise revisionSummary explaining what changed, why it changed, and whether the new evidence strengthens or weakens the central hypothesis.
4. Provide an updatedCenterOfGravity synthesis incorporating the new record.`;

const VOICE_OPTIONS = [
  { id: 'Aoede', label: 'Aoede' },
  { id: 'Sulafat', label: 'Sulafat' },
  { id: 'Charon', label: 'Charon' },
  { id: 'Kore', label: 'Kore' }
];

const PULSE_THINKING_PHASES = [
  'Reading beneath the surface of the tension…',
  'Mapping unspoken relational & strategic incentives…',
  'Testing hidden assumptions & blind spots…',
  'Weighing downstream trade-offs across paths…',
  'Curating psychological & philosophical voices…',
  'Synthesizing your strategic reflection…'
];

const SIGNAL_THINKING_PHASES = [
  'Querying live primary records & chronologies…',
  'Classifying statutory status & epistemic evidence grades…',
  'Auditing narrative framing, omissions & amplification…',
  'Calibrating Rarity, Curation & Coordination indices…',
  'Evaluating institutional incentives & power vectors…',
  'Synthesizing executive briefing & Center of Gravity…'
];

const STORAGE_KEY = 'touchmark_saved_dossiers_v2';

function pcmBase64ToWavUrl(base64, sampleRate = 24000) {
  const binary = atob(base64);
  const pcmLength = binary.length;
  const buffer = new ArrayBuffer(44 + pcmLength);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLength, true);

  for (let i = 0; i < pcmLength; i++) {
    view.setUint8(44 + i, binary.charCodeAt(i));
  }

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

function isConversationalCheckIn(text) {
  const cleaned = text.trim().toLowerCase().replace(/[?.!,]/g, '');
  if (!cleaned) return true;
  const words = cleaned.split(/\s+/);
  const greetings = [
    'hi',
    'hello',
    'hey',
    'hey touchmark',
    'hi touchmark',
    'can you hear me',
    'do you hear me',
    'are you there',
    'testing',
    'test',
    'mic check',
    'good morning',
    'good afternoon',
    'good evening',
    'how are you',
    'what is this',
    'how does this work',
    'who are you'
  ];
  if (greetings.some((g) => cleaned === g || cleaned.startsWith(g + ' '))) {
    return words.length <= 10;
  }
  return words.length <= 4 && !cleaned.includes('%');
}

function extractJsonObject(raw) {
  if (!raw) throw new Error('Empty response received.');
  const stripped = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const firstBrace = stripped.indexOf('{');
  const lastBrace = stripped.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Could not parse structured response.');
  }
  return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
}

function buildSmartResearchUrl(item) {
  const q = encodeURIComponent(item.searchQuery || `${item.title} ${item.authorOrChannel || ''}`);
  const fmt = (item.format || '').toLowerCase();
  if (fmt.includes('youtube') || fmt.includes('video')) {
    return `https://www.youtube.com/results?search_query=${q}`;
  }
  if (fmt.includes('study') || fmt.includes('paper')) {
    return `https://scholar.google.com/scholar?q=${q}`;
  }
  return `https://www.google.com/search?q=${q}`;
}

function gradeBadgeStyle(grade = '') {
  const g = grade.toLowerCase();
  if (g.includes('verified')) return 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30';
  if (g.includes('documented') || g.includes('corroborated'))
    return 'bg-sky-400/15 text-sky-200 border-sky-400/30';
  if (g.includes('inference')) return 'bg-amber-400/15 text-amber-200 border-amber-400/30';
  return 'bg-purple-400/15 text-purple-200 border-purple-400/30';
}

export default function TouchmarkToolsApp() {
  const [mode, setMode] = useState(resolveInitialMode);
  const [status, setStatus] = useState('idle');
  const [thinkingPhaseIndex, setThinkingPhaseIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [errorBanner, setErrorBanner] = useState('');

  const [activeCaption, setActiveCaption] = useState(() => MODE_META[resolveInitialMode()].welcome);
  const [history, setHistory] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('analysis'); // 'analysis' | 'power' | 'spectrum' | 'studio'
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [savedDossiers, setSavedDossiers] = useState([]);
  const [liveSignalPrompts, setLiveSignalPrompts] = useState(SIGNAL_STARTER_PROMPTS);

  const [hasArtifact, setHasArtifact] = useState(false);
  const [isHydratingDeep, setIsHydratingDeep] = useState(false);
  const [isGeneratingStudio, setIsGeneratingStudio] = useState(false);
  const [studioFormatView, setStudioFormatView] = useState('substack'); // 'substack' | 'script' | 'shortform' | 'audit'
  const [externalResearchNotes, setExternalResearchNotes] = useState('');
  const [showExternalImporter, setShowExternalImporter] = useState(false);
  const [copiedStudioText, setCopiedStudioText] = useState(false);

  const [revisionInput, setRevisionInput] = useState('');
  const [isRevising, setIsRevising] = useState(false);

  const [pulseLedger, setPulseLedger] = useState(null);
  const [signalReport, setSignalReport] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const soundscapeRef = useRef(null);

  const switchWorkspaceMode = (nextMode) => {
    if (nextMode === mode) return;
    stopSpeaking();
    setMode(nextMode);
    setHasArtifact(false);
    setPulseLedger(null);
    setSignalReport(null);
    setErrorBanner('');
    setActiveCaption(MODE_META[nextMode].welcome);
    if (typeof window !== 'undefined') {
      const nextUrl = `${window.location.pathname}?mode=${nextMode}`;
      window.history.replaceState({}, '', nextUrl);
      document.title = `${MODE_META[nextMode].name} — ${MODE_META[nextMode].tagline}`;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${MODE_META[mode].name} — ${MODE_META[mode].tagline}`;
    }
    soundscapeRef.current = createContemplationSoundscape();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedDossiers(JSON.parse(raw));
    } catch {}

    fetch('/api/discern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trending' })
    })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.prompts) && d.prompts.length >= 2) {
          setLiveSignalPrompts(d.prompts);
        }
      })
      .catch(() => {});

    return () => {
      soundscapeRef.current?.stopThinkingDrone(false);
    };
  }, []);

  const persistDossier = (entry) => {
    setSavedDossiers((prev) => {
      const filtered = prev.filter((p) => p.id !== entry.id);
      const next = [entry, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteSavedDossier = (id) => {
    setSavedDossiers((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const loadSavedDossier = (item) => {
    setArchiveOpen(false);
    setMode(item.mode);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `${window.location.pathname}?mode=${item.mode}`);
    }
    if (item.mode === 'pulse') {
      setPulseLedger(item.data);
      setActiveCaption(item.data.spokenReflection || item.title);
    } else {
      setSignalReport(item.data);
      setActiveCaption(item.data.spokenSynthesis || item.title);
    }
    setIsHydratingDeep(false);
    setHasArtifact(true);
    setDrawerTab('analysis');
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (status !== 'thinking') {
      setThinkingPhaseIndex(0);
      return;
    }
    const maxSteps =
      mode === 'signal' ? SIGNAL_THINKING_PHASES.length : PULSE_THINKING_PHASES.length;
    const timer = setInterval(() => {
      setThinkingPhaseIndex((prev) => (prev < maxSteps - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(timer);
  }, [status, mode]);

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus((prev) => (prev === 'speaking' ? 'idle' : prev));
  };

  const speakResponse = async (textToSpeak) => {
    if (!voiceEnabled || !textToSpeak) {
      setStatus('idle');
      return;
    }
    stopSpeaking();
    setStatus('speaking');

    try {
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'speak',
          text: textToSpeak,
          voiceName: selectedVoice
        })
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || 'TTS unavailable');
      }

      const audioUrl =
        data.mimeType?.includes('wav') || data.mimeType?.includes('mp3')
          ? `data:${data.mimeType};base64,${data.audioBase64}`
          : pcmBase64ToWavUrl(data.audioBase64, 24000);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setStatus('idle');
      audio.onerror = () => setStatus('idle');
      await audio.play();
    } catch {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.96;
        utterance.onend = () => setStatus('idle');
        utterance.onerror = () => setStatus('idle');
        window.speechSynthesis.speak(utterance);
      } else {
        setStatus('idle');
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setInputText(finalTranscript || interim);
    };

    recognition.onerror = (event) => {
      setStatus('idle');
      if (event.error === 'not-allowed') {
        setErrorBanner('Microphone access is blocked in your browser.');
      }
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        const captured = finalTranscript.trim();
        finalTranscript = '';
        handleSubmission(captured);
      } else {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;
  }, [mode, voiceEnabled, selectedVoice]);

  const toggleListening = () => {
    setErrorBanner('');
    if (status === 'speaking') {
      stopSpeaking();
      return;
    }
    if (status === 'listening') {
      recognitionRef.current?.stop();
      setStatus('idle');
      return;
    }
    if (!recognitionRef.current) {
      setErrorBanner('Voice input is unavailable in this browser—use the text bar below.');
      return;
    }
    setInputText('');
    setStatus('listening');
    try {
      recognitionRef.current.start();
    } catch {
      setStatus('idle');
    }
  };

  const fetchStage2DeepModules = async (expandedQuery, factSheet) => {
    const stage2Prompt = `Deliver Stage 2 (Follow the Power audit, Institutional Relationship Map edges, Power Chokepoint Blueprint, 3 Competing Probability Scenarios, Uncomfortable Questions, Investigation Gap ledger, Primary-Source Diagnostic Checklist, Historical Precedents with breakdown conditions, 6-Lens Functional Spectrum, and 9–11 Research Library items with at least 3 YouTube talks spanning Left, Centrist, and Right perspectives) on: "${expandedQuery}"`;

    try {
      const r = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signal_deep',
          prompt: stage2Prompt,
          factSheet: factSheet || '',
          systemInstruction: SIGNAL_DEEP_PROMPT
        })
      });
      if (r.ok) {
        const d = await r.json();
        if (d?.text) return extractJsonObject(d.text);
      }
    } catch {}

    const fallbackRes = await fetch('/api/discern', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analyze',
        prompt: factSheet
          ? `${stage2Prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET ===\n${factSheet}`
          : stage2Prompt,
        systemInstruction: SIGNAL_DEEP_PROMPT
      })
    });
    const fallbackData = await fallbackRes.json();
    if (!fallbackRes.ok || !fallbackData?.text) {
      throw new Error(fallbackData?.error || 'Stage 2 enrichment failed.');
    }
    return extractJsonObject(fallbackData.text);
  };

  const generateStudioPackage = async (customNotes = '') => {
    if (isGeneratingStudio) return;
    if (!signalReport && !customNotes.trim()) return;

    setIsGeneratingStudio(true);
    try {
      const sourceMaterial = customNotes.trim()
        ? `EXTERNAL CREATOR RESEARCH NOTES / TRANSCRIPT:\n${customNotes.trim()}`
        : JSON.stringify({
            subject: signalReport.subject,
            scalars: {
              rarity: `${signalReport.constellationRarityScore}/100 (${signalReport.constellationRarityLabel})`,
              curation: `${signalReport.narrativeCurationScore}/100 (${signalReport.narrativeCurationLabel})`,
              coordination: `${signalReport.coordinationEvidenceScore}/100 (${signalReport.coordinationEvidenceLabel})`,
              centerOfGravity: `${signalReport.centerOfGravityLikelihood}% (${signalReport.centerOfGravityLabel})`
            },
            verifiedTimeline: signalReport.verifiedTimeline,
            narrativeAudit: signalReport.narrativeManipulationAudit,
            followThePower: signalReport.followThePower,
            uncomfortableQuestions: signalReport.uncomfortableQuestions,
            investigationGap: signalReport.investigationGap,
            scenarios: signalReport.scenarios
          });

      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'studio_create',
          prompt: `Transform this investigation into a creator editorial & broadcast production package (Substack essay, YouTube/podcast script, short-form scripts with nuance warnings, visual shot list, and integrity audit):\n\n${sourceMaterial}`,
          systemInstruction: STUDIO_SYSTEM_PROMPT
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.text) throw new Error(data?.error || 'Studio generation failed.');
      const studioParsed = extractJsonObject(data.text);

      if (signalReport) {
        setSignalReport((prev) => {
          const updated = { ...prev, studioAssets: studioParsed };
          if (prev?.id) {
            persistDossier({
              id: prev.id,
              mode: 'signal',
              title: prev.subject.slice(0, 80),
              createdAt: new Date().toLocaleDateString(),
              data: updated
            });
          }
          return updated;
        });
      } else {
        const standaloneId = Date.now().toString();
        const standaloneReport = {
          id: standaloneId,
          subject: customNotes.trim().slice(0, 80),
          spokenSynthesis: 'Studio editorial package generated from your external research notes.',
          constellationRarityScore: 0,
          constellationRarityLabel: 'External Source',
          constellationRaritySummary: 'Imported directly into Touchmark Studio.',
          narrativeCurationScore: 0,
          narrativeCurationLabel: 'External Source',
          narrativeCurationSummary: 'Imported directly into Touchmark Studio.',
          coordinationEvidenceScore: 0,
          coordinationEvidenceLabel: 'External Source',
          coordinationEvidenceSummary: 'Imported directly into Touchmark Studio.',
          centerOfGravityLikelihood: 0,
          centerOfGravityLabel: 'External Source',
          centerOfGravitySummary: 'Imported directly into Touchmark Studio.',
          verifiedTimeline: [],
          narrativeManipulationAudit: '',
          constellationRarityAnalysis: '',
          centerOfGravity: '',
          followThePower: [],
          relationshipMap: [],
          powerOperationBlueprint: '',
          scenarios: [],
          uncomfortableQuestions: [],
          investigationGap: null,
          diagnosticChecklist: [],
          historicalPrecedents: '',
          spectrumPerspectives: [],
          researchLibrary: [],
          groundingSources: [],
          revisionLog: [],
          studioAssets: studioParsed
        };
        setSignalReport(standaloneReport);
        setHasArtifact(true);
      }
      setShowExternalImporter(false);
    } catch (err) {
      setErrorBanner(err.message || 'Could not generate Studio package.');
    } finally {
      setIsGeneratingStudio(false);
    }
  };

  const handleReviseInvestigation = async (e) => {
    e.preventDefault();
    if (!signalReport || !revisionInput.trim() || isRevising) return;
    setIsRevising(true);
    try {
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revise_investigation',
          prompt: `EXISTING INVESTIGATION SUBJECT: "${signalReport.subject}"
CURRENT SCALARS: Rarity ${signalReport.constellationRarityScore}/100, Curation ${signalReport.narrativeCurationScore}/100, Coordination ${signalReport.coordinationEvidenceScore}/100, Center of Gravity ${signalReport.centerOfGravityLikelihood}%
CURRENT CENTER OF GRAVITY: ${signalReport.centerOfGravity}

NEW EVIDENCE / DEVELOPMENT TO INTEGRATE:
"${revisionInput.trim()}"`,
          systemInstruction: REVISION_SYSTEM_PROMPT
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.text) throw new Error(data?.error || 'Could not update investigation.');
      const rev = extractJsonObject(data.text);

      setSignalReport((prev) => {
        const updated = {
          ...prev,
          constellationRarityScore: rev.constellationRarityScore ?? prev.constellationRarityScore,
          constellationRarityLabel: rev.constellationRarityLabel || prev.constellationRarityLabel,
          constellationRaritySummary: rev.constellationRaritySummary || prev.constellationRaritySummary,
          narrativeCurationScore: rev.narrativeCurationScore ?? prev.narrativeCurationScore,
          narrativeCurationLabel: rev.narrativeCurationLabel || prev.narrativeCurationLabel,
          narrativeCurationSummary: rev.narrativeCurationSummary || prev.narrativeCurationSummary,
          coordinationEvidenceScore: rev.coordinationEvidenceScore ?? prev.coordinationEvidenceScore,
          coordinationEvidenceLabel: rev.coordinationEvidenceLabel || prev.coordinationEvidenceLabel,
          coordinationEvidenceSummary: rev.coordinationEvidenceSummary || prev.coordinationEvidenceSummary,
          centerOfGravityLikelihood: rev.centerOfGravityLikelihood ?? prev.centerOfGravityLikelihood,
          centerOfGravityLabel: rev.centerOfGravityLabel || prev.centerOfGravityLabel,
          centerOfGravitySummary: rev.centerOfGravitySummary || prev.centerOfGravitySummary,
          centerOfGravity: rev.updatedCenterOfGravity || prev.centerOfGravity,
          verifiedTimeline: rev.newTimelineEntry
            ? [...(prev.verifiedTimeline || []), rev.newTimelineEntry]
            : prev.verifiedTimeline,
          revisionLog: [
            {
              timestamp: new Date().toLocaleString(),
              evidenceAdded: revisionInput.trim(),
              summary: rev.revisionSummary
            },
            ...(prev.revisionLog || [])
          ]
        };
        if (prev?.id) {
          persistDossier({
            id: prev.id,
            mode: 'signal',
            title: prev.subject.slice(0, 80),
            createdAt: new Date().toLocaleDateString(),
            data: updated
          });
        }
        return updated;
      });
      setRevisionInput('');
    } catch (err) {
      setErrorBanner(err.message || 'Revision failed.');
    } finally {
      setIsRevising(false);
    }
  };

  const handleSubmission = async (rawQuery) => {
    const query = (rawQuery ?? inputText).trim();
    if (!query) return;

    setErrorBanner('');
    stopSpeaking();
    setInputText('');
    setStatus('thinking');
    setIsHydratingDeep(false);

    if (voiceEnabled) {
      soundscapeRef.current?.startThinkingDrone(mode);
    }

    const updatedHistory = [...history, { role: 'user', text: query }];
    setHistory(updatedHistory);

    try {
      // 1. Warm Copilot Chat Turn
      if (isConversationalCheckIn(query)) {
        const res = await fetch('/api/discern', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat',
            prompt: query,
            history: updatedHistory
          })
        });
        const data = await res.json();
        soundscapeRef.current?.stopThinkingDrone(voiceEnabled);
        if (!res.ok) throw new Error(data.error || 'Connection interrupted.');

        const reply = data.reply || "I hear you clearly. What's on your mind?";
        setActiveCaption(reply);
        setHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
        speakResponse(reply);
        return;
      }

      // 2. Pulse Deep Discernment
      if (mode === 'pulse') {
        const res = await fetch('/api/discern', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'analyze',
            prompt: query,
            systemInstruction: PULSE_SYSTEM_PROMPT,
            responseSchema: PULSE_RESPONSE_SCHEMA
          })
        });
        const data = await res.json();
        soundscapeRef.current?.stopThinkingDrone(voiceEnabled);
        if (!res.ok) throw new Error(data.error || 'Pulse discernment failed.');

        const parsed = extractJsonObject(data.text);
        setPulseLedger(parsed);
        setHasArtifact(true);
        setDrawerTab('analysis');
        persistDossier({
          id: Date.now().toString(),
          mode: 'pulse',
          title: parsed.title || query.slice(0, 70),
          createdAt: new Date().toLocaleDateString(),
          data: parsed
        });

        const reflection = parsed.spokenReflection || 'Here is what stands out beneath the surface.';
        setActiveCaption(reflection);
        setHistory((prev) => [...prev, { role: 'assistant', text: reflection }]);
        speakResponse(reflection);
        return;
      }

      // 3. Progressive Signal Delivery
      const expandedQuery = expandSignalQuery(query);
      const dossierId = Date.now().toString();

      const coreRes = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signal_core',
          prompt: `Deliver Stage 1 (Spoken Briefing, 4-Scalar Diagnostic Radar with plain-English readings, Verified Chronology with legal status & epistemic grades, Narrative Manipulation Audit, Constellation Rarity, and Center of Gravity) on: "${expandedQuery}"`,
          systemInstruction: SIGNAL_CORE_PROMPT
        })
      });
      const coreData = await coreRes.json();
      soundscapeRef.current?.stopThinkingDrone(voiceEnabled);
      if (!coreRes.ok) throw new Error(coreData.error || 'Signal audit failed.');

      const coreParsed = extractJsonObject(coreData.text);
      const initialReport = {
        id: dossierId,
        subject: query,
        spokenSynthesis:
          coreParsed.spokenSynthesis ||
          'Intelligence brief ready. Open the dossier to inspect the 4-scalar radar, verified timeline, and full-spectrum analysis.',
        constellationRarityScore: coreParsed.constellationRarityScore ?? 82,
        constellationRarityLabel: coreParsed.constellationRarityLabel || 'Anomalous Clustering',
        constellationRaritySummary:
          coreParsed.constellationRaritySummary ||
          'Measures how unusual this timing and alignment is relative to historical norms—not proof of coordination.',
        narrativeCurationScore: coreParsed.narrativeCurationScore ?? 76,
        narrativeCurationLabel: coreParsed.narrativeCurationLabel || 'Heavy Framing & Omission',
        narrativeCurationSummary:
          coreParsed.narrativeCurationSummary ||
          'Measures how strongly mainstream headlines package or omit key context from the primary record.',
        coordinationEvidenceScore: coreParsed.coordinationEvidenceScore ?? 52,
        coordinationEvidenceLabel: coreParsed.coordinationEvidenceLabel || 'Structural Alignment',
        coordinationEvidenceSummary:
          coreParsed.coordinationEvidenceSummary ||
          'Separates parallel self-interest (0–50) from documented evidence of active collaboration or collusion (51–100).',
        centerOfGravityLikelihood: coreParsed.centerOfGravityLikelihood ?? 68,
        centerOfGravityLabel: coreParsed.centerOfGravityLabel || 'Structural Consolidation',
        centerOfGravitySummary:
          coreParsed.centerOfGravitySummary ||
          'Indicates how strongly the verified record points toward the underlying structural driver vs. the official narrative.',
        verifiedTimeline: Array.isArray(coreParsed.verifiedTimeline) ? coreParsed.verifiedTimeline : [],
        narrativeManipulationAudit: coreParsed.narrativeManipulationAudit || '',
        constellationRarityAnalysis: coreParsed.constellationRarityAnalysis || '',
        centerOfGravity: coreParsed.centerOfGravity || '',
        followThePower: [],
        relationshipMap: [],
        powerOperationBlueprint: '',
        scenarios: [],
        uncomfortableQuestions: [],
        investigationGap: null,
        diagnosticChecklist: [],
        historicalPrecedents: '',
        spectrumPerspectives: [],
        researchLibrary: [],
        groundingSources: Array.isArray(coreData.groundingSources) ? coreData.groundingSources : [],
        revisionLog: [],
        studioAssets: null
      };

      setSignalReport(initialReport);
      setHasArtifact(true);
      setDrawerTab('analysis');
      setActiveCaption(initialReport.spokenSynthesis);
      setHistory((prev) => [...prev, { role: 'assistant', text: initialReport.spokenSynthesis }]);
      speakResponse(initialReport.spokenSynthesis);

      setIsHydratingDeep(true);
      fetchStage2DeepModules(expandedQuery, coreData.factSheet || '')
        .then((deepParsed) => {
          const fullReport = {
            ...initialReport,
            followThePower: Array.isArray(deepParsed.followThePower) ? deepParsed.followThePower : [],
            relationshipMap: Array.isArray(deepParsed.relationshipMap)
              ? deepParsed.relationshipMap
              : [],
            powerOperationBlueprint: deepParsed.powerOperationBlueprint || '',
            scenarios: Array.isArray(deepParsed.scenarios) ? deepParsed.scenarios : [],
            uncomfortableQuestions: Array.isArray(deepParsed.uncomfortableQuestions)
              ? deepParsed.uncomfortableQuestions
              : [],
            investigationGap: deepParsed.investigationGap || null,
            diagnosticChecklist: Array.isArray(deepParsed.diagnosticChecklist)
              ? deepParsed.diagnosticChecklist
              : [],
            historicalPrecedents: deepParsed.historicalPrecedents || '',
            spectrumPerspectives: Array.isArray(deepParsed.spectrumPerspectives)
              ? deepParsed.spectrumPerspectives
              : [],
            researchLibrary: Array.isArray(deepParsed.researchLibrary) ? deepParsed.researchLibrary : []
          };
          setSignalReport(fullReport);
          persistDossier({
            id: dossierId,
            mode: 'signal',
            title: query.slice(0, 80),
            createdAt: new Date().toLocaleDateString(),
            data: fullReport
          });
        })
        .catch(() => {
          persistDossier({
            id: dossierId,
            mode: 'signal',
            title: query.slice(0, 80),
            createdAt: new Date().toLocaleDateString(),
            data: initialReport
          });
        })
        .finally(() => {
          setIsHydratingDeep(false);
        });
    } catch (err) {
      soundscapeRef.current?.stopThinkingDrone(false);
      setIsHydratingDeep(false);
      setStatus('idle');
      setErrorBanner(err.message || 'Something interrupted that thought. Try again.');
    }
  };

  const copyReceipt = () => {
    if (mode === 'pulse' && pulseLedger) {
      const pathLines = (pulseLedger.options || [])
        .map((o, i) => `### 0${i + 1}. ${o.label}\n${o.stance}\n*Trade-off:* ${o.tradeoff}`)
        .join('\n\n');
      const refLines = (pulseLedger.deepDiveReferences || [])
        .map((r) => `- [${r.lens} · ${r.format}] ${r.title} (${r.creatorOrPublication})`)
        .join('\n');
      const text = `# Touchmark Pulse Discernment Dossier\n## ${pulseLedger.title}\n\n### Core Tension\n${pulseLedger.coreTension}\n\n### Hidden Assumption & Power Dynamic\n${pulseLedger.hiddenAssumption}\n${pulseLedger.powerDynamic ? `\n${pulseLedger.powerDynamic}\n` : ''}\n## Strategic Paths\n${pathLines}\n\n## Deeper References\n${refLines}`;
      navigator.clipboard?.writeText(text);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
      return;
    }

    if (!signalReport) return;
    const timelineLines = signalReport.verifiedTimeline
      .map((t) => `- [${t.legalStatus} · ${t.epistemicGrade}] ${t.date}: ${t.event}`)
      .join('\n');
    const ftpLines = (signalReport.followThePower || [])
      .map((f) => `- **${f.vector}** [${f.epistemicGrade}]: ${f.finding}`)
      .join('\n');
    const relLines = (signalReport.relationshipMap || [])
      .map((r) => `- ${r.sourceEntity} ──[${r.relationshipType} · ${r.epistemicGrade}]──► ${r.targetEntity}`)
      .join('\n');
    const scenarioLines = signalReport.scenarios
      .map((s) => `- ${s.name} (${s.likelihood}%): ${s.caseFor} | Counter: ${s.caseAgainst}`)
      .join('\n');
    const qLines = (signalReport.uncomfortableQuestions || []).map((q) => `- ${q}`).join('\n');
    const refLines = signalReport.researchLibrary
      .map((r) => `- [${r.perspectiveTag} · ${r.format}] ${r.title} (${r.authorOrChannel})`)
      .join('\n');

    const text = `# Touchmark Signal Intelligence Dossier\n**Subject:** ${signalReport.subject}\n\n## 4-Scalar Diagnostic Radar\n- **Constellation Rarity:** ${signalReport.constellationRarityScore}/100 (${signalReport.constellationRarityLabel}) — ${signalReport.constellationRaritySummary}\n- **Narrative Curation:** ${signalReport.narrativeCurationScore}/100 (${signalReport.narrativeCurationLabel}) — ${signalReport.narrativeCurationSummary}\n- **Coordination Evidence:** ${signalReport.coordinationEvidenceScore}/100 (${signalReport.coordinationEvidenceLabel}) — ${signalReport.coordinationEvidenceSummary}\n- **Center of Gravity:** ${signalReport.centerOfGravityLikelihood}% (${signalReport.centerOfGravityLabel}) — ${signalReport.centerOfGravitySummary}\n\n## Verified Record & Chronology\n${timelineLines}\n\n## Narrative Manipulation Audit\n${signalReport.narrativeManipulationAudit}\n\n## Follow the Power\n${ftpLines}\n\n## Institutional Relationship Map\n${relLines}\n\n## Competing Scenarios\n${scenarioLines}\n\n## Uncomfortable Questions\n${qLines}\n\n## Historical Precedents\n${signalReport.historicalPrecedents}\n\n## Full-Spectrum Research Library\n${refLines}`;

    navigator.clipboard?.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const exportFullPdfDossier = () => {
    const printWindow = window.open('', '_blank', 'width=960,height=900');
    if (!printWindow) {
      setErrorBanner('Pop-up blocked—allow pop-ups for this site to generate the PDF dossier.');
      return;
    }

    const esc = (str) =>
      String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');

    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let bodyHtml = '';

    if (mode === 'pulse' && pulseLedger) {
      bodyHtml = `
        <div class="meta">TOUCHMARK PULSE · STRATEGIC & RELATIONAL DISCERNMENT DOSSIER · ${dateStr}</div>
        <h1>${esc(pulseLedger.title)}</h1>
        <div class="callout">
          <div class="label">SPOKEN SYNTHESIS</div>
          <p>${esc(pulseLedger.spokenReflection)}</p>
        </div>
        <h2>Core Tension</h2>
        <p>${esc(pulseLedger.coreTension)}</p>
        <h2>Hidden Assumption & Power Dynamic</h2>
        <p>${esc(pulseLedger.hiddenAssumption)}</p>
        ${pulseLedger.powerDynamic ? `<p>${esc(pulseLedger.powerDynamic)}</p>` : ''}
        <h2>Three Strategic Paths</h2>
        ${(pulseLedger.options || [])
          .map(
            (opt, i) => `
          <div class="card">
            <h3>0${i + 1}. ${esc(opt.label)}</h3>
            <p>${esc(opt.stance)}</p>
            <p class="muted"><strong>Trade-off:</strong> ${esc(opt.tradeoff)}</p>
          </div>`
          )
          .join('')}
        ${
          pulseLedger.deepDiveReferences?.length
            ? `<h2>Thinkers, Essays & Talks to Go Deeper</h2>
              ${pulseLedger.deepDiveReferences
                .map(
                  (r) => `
                <div class="card">
                  <div class="tag">${esc(r.lens)} · ${esc(r.format)}</div>
                  <h3>${esc(r.title)}</h3>
                  <p class="muted">${esc(r.creatorOrPublication)}</p>
                  <p>${esc(r.whyItMatters)}</p>
                  <p class="url">${esc(buildSmartResearchUrl(r))}</p>
                </div>`
                )
                .join('')}`
            : ''
        }
      `;
    } else if (signalReport) {
      bodyHtml = `
        <div class="meta">TOUCHMARK SIGNAL · INVESTIGATIVE INTELLIGENCE DOSSIER · ${dateStr}</div>
        <h1>“${esc(signalReport.subject)}”</h1>
        <div class="metrics-grid">
          <div class="metric-box">
            <span class="label">1. CONSTELLATION RARITY</span>
            <span class="score">${signalReport.constellationRarityScore}/100 · ${esc(signalReport.constellationRarityLabel)}</span>
            <span class="explain">${esc(signalReport.constellationRaritySummary)}</span>
          </div>
          <div class="metric-box">
            <span class="label">2. NARRATIVE CURATION</span>
            <span class="score">${signalReport.narrativeCurationScore}/100 · ${esc(signalReport.narrativeCurationLabel)}</span>
            <span class="explain">${esc(signalReport.narrativeCurationSummary)}</span>
          </div>
          <div class="metric-box">
            <span class="label">3. COORDINATION EVIDENCE</span>
            <span class="score">${signalReport.coordinationEvidenceScore}/100 · ${esc(signalReport.coordinationEvidenceLabel)}</span>
            <span class="explain">${esc(signalReport.coordinationEvidenceSummary)}</span>
          </div>
          <div class="metric-box">
            <span class="label">4. CENTER OF GRAVITY</span>
            <span class="score">${signalReport.centerOfGravityLikelihood}% · ${esc(signalReport.centerOfGravityLabel)}</span>
            <span class="explain">${esc(signalReport.centerOfGravitySummary)}</span>
          </div>
        </div>

        <div class="callout">
          <div class="label">EXECUTIVE BRIEFING</div>
          <p>${esc(signalReport.spokenSynthesis)}</p>
        </div>

        ${
          signalReport.verifiedTimeline?.length
            ? `<h2>1. Verified Record & Chronology</h2>
              <ul>
                ${signalReport.verifiedTimeline
                  .map(
                    (t) =>
                      `<li><strong>${esc(t.date)}</strong> [${esc(t.legalStatus)} · ${esc(t.epistemicGrade)}]: ${esc(t.event)}</li>`
                  )
                  .join('')}
              </ul>`
            : ''
        }

        ${
          signalReport.narrativeManipulationAudit
            ? `<h2>2. How the Mainstream Narrative Is Curated & Distorted</h2>
              <p>${esc(signalReport.narrativeManipulationAudit)}</p>`
            : ''
        }

        ${
          signalReport.followThePower?.length
            ? `<h2>3. Follow the Power Audit</h2>
              ${signalReport.followThePower
                .map(
                  (f) => `
                <div class="card">
                  <div class="tag">${esc(f.vector)} · ${esc(f.epistemicGrade)}</div>
                  <p>${esc(f.finding)}</p>
                </div>`
                )
                .join('')}`
            : ''
        }

        ${
          signalReport.relationshipMap?.length
            ? `<h2>4. Institutional Relationship Map</h2>
              <ul>
                ${signalReport.relationshipMap
                  .map(
                    (r) =>
                      `<li><strong>${esc(r.sourceEntity)}</strong> &rarr; <em>${esc(r.relationshipType)}</em> (${esc(r.epistemicGrade)}) &rarr; <strong>${esc(r.targetEntity)}</strong></li>`
                  )
                  .join('')}
              </ul>`
            : ''
        }

        ${
          signalReport.centerOfGravity
            ? `<h2>5. Center of Gravity & Epistemic Weighing</h2>
              <p>${esc(signalReport.centerOfGravity)}</p>`
            : ''
        }

        ${
          signalReport.scenarios?.length
            ? `<h2>6. Competing Possibilities & Steelmanned Counter-Weights</h2>
              ${signalReport.scenarios
                .map(
                  (sc) => `
                <div class="card">
                  <h3>${esc(sc.name)} — ${sc.likelihood}% Likelihood</h3>
                  <p><strong>Supporting evidence:</strong> ${esc(sc.caseFor)}</p>
                  ${sc.caseAgainst ? `<p class="muted"><strong>Counter-weight:</strong> ${esc(sc.caseAgainst)}</p>` : ''}
                </div>`
                )
                .join('')}`
            : ''
        }

        ${
          signalReport.uncomfortableQuestions?.length
            ? `<h2>7. Uncomfortable Questions Conventional Reporting Overlooks</h2>
              <ul>
                ${signalReport.uncomfortableQuestions.map((q) => `<li>${esc(q)}</li>`).join('')}
              </ul>`
            : ''
        }

        ${
          signalReport.investigationGap
            ? `<h2>8. The Investigation Gap (Established vs. Suspected vs. Unknown)</h2>
              <div class="card">
                <p><strong>Established (Documented):</strong> ${esc((signalReport.investigationGap.established || []).join(' • '))}</p>
                <p><strong>Suspected (Unconfirmed):</strong> ${esc((signalReport.investigationGap.suspected || []).join(' • '))}</p>
                <p><strong>Unknown (Requires Primary Proof):</strong> ${esc((signalReport.investigationGap.unknown || []).join(' • '))}</p>
                <p class="muted"><strong>Next Primary Targets:</strong> ${esc((signalReport.investigationGap.nextTargets || []).join(' • '))}</p>
              </div>`
            : ''
        }

        ${
          signalReport.diagnosticChecklist?.length
            ? `<h2>9. Primary Records & Falsifiable Diagnostic Tests</h2>
              ${signalReport.diagnosticChecklist
                .map(
                  (d) => `
                <div class="card">
                  <h3>${esc(d.primaryDocument)}</h3>
                  <p>${esc(d.whatToLookFor)}</p>
                </div>`
                )
                .join('')}`
            : ''
        }

        ${
          signalReport.historicalPrecedents
            ? `<h2>10. Historical Precedents & Where Analogies Break Down</h2>
              <p>${esc(signalReport.historicalPrecedents)}</p>`
            : ''
        }

        ${
          signalReport.spectrumPerspectives?.length
            ? `<h2>11. Perspectives Across Six Analytical Lenses</h2>
              ${signalReport.spectrumPerspectives
                .map(
                  (sp) => `
                <div class="card">
                  <div class="tag">${esc(sp.lens)} — ${esc(sp.coreQuestion)}</div>
                  <h3>${esc(sp.thinkerOrOutlet)}</h3>
                  <p>${esc(sp.coreThesis)}</p>
                </div>`
                )
                .join('')}`
            : ''
        }

        ${
          signalReport.researchLibrary?.length
            ? `<h2>12. Verified Search & Research Library</h2>
              ${signalReport.researchLibrary
                .map(
                  (r) => `
                <div class="card">
                  <div class="tag">${esc(r.perspectiveTag)} · ${esc(r.format)}</div>
                  <h3>${esc(r.title)}</h3>
                  <p class="muted">${esc(r.authorOrChannel)}</p>
                  <p>${esc(r.takeaway)}</p>
                  <p class="url">${esc(buildSmartResearchUrl(r))}</p>
                </div>`
                )
                .join('')}`
            : ''
        }
      `;
    }

    printWindow.document.write(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Touchmark Intelligence Dossier</title>
          <style>
            @page { margin: 0.75in; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
              color: #1c1917;
              line-height: 1.6;
              max-width: 780px;
              margin: 0 auto;
              padding: 24px;
              font-size: 13.5px;
            }
            .meta {
              font-size: 10px;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: #78716c;
              border-bottom: 1px solid #e7e5e4;
              padding-bottom: 8px;
              margin-bottom: 16px;
            }
            h1 { font-size: 22px; line-height: 1.3; margin: 0 0 18px; color: #0c0a09; }
            h2 {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #92400e;
              border-bottom: 1px solid #f5f5f4;
              padding-bottom: 4px;
              margin: 26px 0 10px;
              page-break-after: avoid;
            }
            h3 { font-size: 14px; margin: 0 0 6px; color: #1c1917; }
            p { margin: 0 0 10px; }
            ul { margin: 0 0 12px; padding-left: 18px; }
            li { margin-bottom: 6px; }
            .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
            .metric-box {
              border: 1px solid #d6d3d1;
              border-radius: 10px;
              padding: 10px 12px;
              background: #fafaf9;
              page-break-inside: avoid;
            }
            .label { display: block; font-size: 9px; letter-spacing: 0.14em; color: #78716c; text-transform: uppercase; }
            .score { display: block; font-size: 15px; font-weight: 700; color: #0c0a09; margin: 3px 0; }
            .explain { display: block; font-size: 11px; color: #57534e; line-height: 1.4; }
            .callout {
              background: #fffbeb;
              border-left: 3px solid #d97706;
              padding: 14px 16px;
              border-radius: 6px;
              margin-bottom: 18px;
              page-break-inside: avoid;
            }
            .card {
              border: 1px solid #e7e5e4;
              border-radius: 10px;
              padding: 12px 14px;
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .tag { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.12em; color: #b45309; margin-bottom: 4px; }
            .muted { color: #57534e; font-size: 12.5px; }
            .url { font-size: 11px; color: #2563eb; word-break: break-all; margin: 4px 0 0; }
          </style>
        </head>
        <body>
          ${bodyHtml}
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 250);
            };
          </script>
        </body>
      </html>`);
    printWindow.document.close();
  };

  const currentThinkingLabel =
    mode === 'signal'
      ? SIGNAL_THINKING_PHASES[thinkingPhaseIndex]
      : PULSE_THINKING_PHASES[thinkingPhaseIndex];

  return (
    <div className="min-h-screen bg-[#090807] text-stone-100 flex flex-col justify-between selection:bg-amber-400/30">
      {/* Ultra-minimal Top Bar — 3-column grid keeps Pulse | Signal dead-center */}
      <header className="px-5 sm:px-8 h-16 grid grid-cols-3 items-center">
        <div className="flex items-center gap-2.5 text-stone-200 justify-self-start">
          <TouchmarkLogo className="w-7 h-7" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-medium tracking-[0.04em]">Touchmark</span>
            <span
              className={`text-[11px] uppercase tracking-[0.18em] font-medium ${
                mode === 'signal' ? 'text-amber-300/90' : 'text-emerald-300/90'
              }`}
            >
              {mode === 'signal' ? 'Signal' : 'Pulse'}
            </span>
          </div>
        </div>

        {/* Dead-Center Workspace Switcher */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/10 justify-self-center">
          <button
            type="button"
            onClick={() => switchWorkspaceMode('pulse')}
            className={`px-3.5 py-1 rounded-full text-xs transition-all ${
              mode === 'pulse' ? 'bg-emerald-400/20 text-emerald-200' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Pulse
          </button>
          <button
            type="button"
            onClick={() => switchWorkspaceMode('signal')}
            className={`px-3.5 py-1 rounded-full text-xs transition-all ${
              mode === 'signal' ? 'bg-amber-400/20 text-amber-200' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Signal
          </button>
        </div>

        {/* Voice, Studio Import, Archive & Dossier Controls */}
        <div className="flex items-center justify-end gap-2 justify-self-end">
          {mode === 'signal' && !hasArtifact && (
            <button
              type="button"
              onClick={() => {
                setShowExternalImporter(true);
                setDrawerTab('studio');
                setDrawerOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/25 text-xs text-emerald-200 transition-all"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
          )}

          {hasArtifact && (
            <>
              <select
                aria-label="Voice"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="hidden md:block bg-transparent border border-white/10 rounded-full px-2.5 py-1 text-xs text-stone-400 focus:outline-none"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id} className="bg-stone-900 text-stone-200">
                    {v.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (voiceEnabled) {
                    stopSpeaking();
                    soundscapeRef.current?.stopThinkingDrone(false);
                  }
                  setVoiceEnabled(!voiceEnabled);
                }}
                aria-label="Toggle voice and ambient sound"
                className="p-2 rounded-full border border-white/10 text-stone-400 hover:text-stone-200"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-600" />}
              </button>

              {savedDossiers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setArchiveOpen(true)}
                  aria-label="Saved Dossiers"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-xs text-stone-300 transition-all"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">Archive ({savedDossiers.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-xs text-amber-200 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dossier</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Center Sanctuary: Workspace Orientation + Pure Sphere + Single Unified Status/Caption Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full py-2">
        {!hasArtifact && status === 'idle' && (
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-stone-400/90 max-w-lg">
            {MODE_META[mode].tagline}
          </p>
        )}

        {errorBanner && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/60 border border-red-400/30 text-xs text-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        <MorphingSphereOrb
          status={status}
          mode={mode}
          onClick={toggleListening}
        />

        {status === 'listening' ? (
          <span className="mt-3 text-[11px] uppercase tracking-[0.26em] text-amber-300 animate-pulse">
            Listening…
          </span>
        ) : status === 'thinking' ? (
          <span className="mt-3 text-[11px] uppercase tracking-[0.24em] text-amber-200/85 transition-all duration-500">
            {currentThinkingLabel}
          </span>
        ) : (
          <div className="mt-4 max-h-48 sm:max-h-56 overflow-y-auto px-2 max-w-2xl">
            <p className="text-sm sm:text-[15px] font-light text-stone-200/95 leading-relaxed">
              {activeCaption}
            </p>
          </div>
        )}

        {/* Single, clean Dossier CTA button */}
        {hasArtifact && status !== 'thinking' && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setDrawerTab('analysis');
                setDrawerOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-300/15 hover:bg-amber-300/25 border border-amber-300/35 text-xs font-medium tracking-[0.14em] uppercase text-amber-200 transition-all shadow-lg shadow-amber-950/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isHydratingDeep ? 'Open Dossier · Enriching Power & Sources…' : 'Open Dossier'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Bottom Input Bar & Live Currents */}
      <footer className="px-4 sm:px-8 pb-6 pt-2 max-w-xl mx-auto w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmission();
          }}
          className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-2 focus-within:border-white/25 transition-colors"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'pulse'
                ? 'Speak to the orb, or unpack a tension…'
                : 'Speak to the orb, or test any narrative…'
            }
            className="flex-1 bg-transparent text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'thinking' || !inputText.trim()}
            aria-label="Send"
            className="p-2 rounded-full text-stone-300 hover:text-amber-200 disabled:opacity-30 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {!hasArtifact && status === 'idle' && (
          <div className="mt-4 space-y-2 text-center">
            <span className="block text-[10px] uppercase tracking-[0.22em] text-stone-500">
              {mode === 'signal'
                ? 'Live currents to probe — or ask your own above'
                : 'Starting tensions — or speak your own above'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(mode === 'signal' ? liveSignalPrompts : PULSE_STARTER_PROMPTS).map(
                (sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSubmission(sample)}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.025] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-stone-400 hover:text-stone-200 transition-all truncate max-w-full"
                  >
                    {sample}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </footer>

      {/* Saved Dossiers Archive Modal */}
      {archiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#11100e] border border-white/10 rounded-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                Saved Intelligence Dossiers
              </span>
              <button
                type="button"
                onClick={() => setArchiveOpen(false)}
                className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {savedDossiers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-300/30"
                >
                  <button
                    type="button"
                    onClick={() => loadSavedDossier(item)}
                    className="text-left flex-1 min-w-0"
                  >
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        item.mode === 'signal' ? 'text-amber-300' : 'text-emerald-300'
                      }`}
                    >
                      {item.mode} · {item.createdAt}
                    </span>
                    <p className="text-sm text-stone-100 truncate mt-0.5">{item.title}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedDossier(item.id)}
                    aria-label="Delete saved dossier"
                    className="p-1.5 text-stone-500 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Intelligence & Studio Dossier Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#11100e] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {mode === 'pulse' && pulseLedger ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Pulse Deep Discernment
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-medium text-stone-100">{pulseLedger.title}</h2>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-300">
                    <Scale className="w-3.5 h-3.5" />
                    Core Tension
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">{pulseLedger.coreTension}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Hidden Assumption & Power Dynamic
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">{pulseLedger.hiddenAssumption}</p>
                  {pulseLedger.powerDynamic && (
                    <p className="text-xs text-stone-400 pt-2 border-t border-white/5 leading-relaxed">
                      {pulseLedger.powerDynamic}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500">
                    Three Strategic Paths
                  </span>
                  {pulseLedger.options?.map((opt, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                      <h3 className="text-sm font-medium text-stone-100">
                        0{idx + 1}. {opt.label}
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed">{opt.stance}</p>
                      <p className="text-xs text-stone-500">Trade-off: {opt.tradeoff}</p>
                    </div>
                  ))}
                </div>

                {pulseLedger.deepDiveReferences?.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <span className="text-[11px] uppercase tracking-wider text-emerald-300/90 block">
                      Thinkers, Essays & Talks to Go Deeper
                    </span>
                    {pulseLedger.deepDiveReferences.map((ref, idx) => (
                      <a
                        key={idx}
                        href={buildSmartResearchUrl(ref)}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-300/35 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-300">
                            {ref.lens} · {ref.format}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        </div>
                        <h4 className="text-sm font-medium text-stone-100">{ref.title}</h4>
                        <p className="text-xs text-stone-400">{ref.creatorOrPublication}</p>
                        <p className="text-xs text-stone-300 leading-relaxed">{ref.whyItMatters}</p>
                      </a>
                    ))}
                  </div>
                )}

                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={exportFullPdfDossier}
                    className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-full bg-amber-300 text-stone-950 font-medium text-xs tracking-wide whitespace-nowrap hover:bg-amber-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4 shrink-0" />
                    <span>Export PDF Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyReceipt}
                    className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-stone-200 font-medium text-xs tracking-wide whitespace-nowrap flex items-center justify-center gap-2 transition-colors"
                  >
                    {copiedReceipt ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span>Markdown Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 shrink-0" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : mode === 'signal' && (signalReport || showExternalImporter) ? (
              <div className="space-y-6">
                {/* Drawer Header + 4-Tab Switcher */}
                <div className="space-y-4 border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                      Signal Investigative Intelligence & Studio
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        setShowExternalImporter(false);
                      }}
                      className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {signalReport && (
                    <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/10 w-fit">
                      <button
                        type="button"
                        onClick={() => setDrawerTab('analysis')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          drawerTab === 'analysis'
                            ? 'bg-amber-400/20 text-amber-200'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        4-Scalar Radar & Record
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerTab('power')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          drawerTab === 'power'
                            ? 'bg-amber-400/20 text-amber-200'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        Follow the Power & Gap {isHydratingDeep && '· …'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerTab('spectrum')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          drawerTab === 'spectrum'
                            ? 'bg-amber-400/20 text-amber-200'
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        6 Lenses & Sources ({signalReport.researchLibrary?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDrawerTab('studio');
                          if (!signalReport.studioAssets && !isHydratingDeep) {
                            generateStudioPackage();
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1 ${
                          drawerTab === 'studio'
                            ? 'bg-emerald-400/20 text-emerald-200'
                            : 'text-emerald-300/80 hover:text-emerald-200'
                        }`}
                      >
                        <PenTool className="w-3 h-3" />
                        <span>Studio</span>
                      </button>
                    </div>
                  )}
                </div>

                {drawerTab === 'analysis' && signalReport ? (
                  <>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1">
                        Subject Under Examination
                      </span>
                      <h2 className="text-lg font-medium text-stone-100 leading-snug">
                        “{signalReport.subject}”
                      </h2>
                    </div>

                    {/* 4-SCALAR DIAGNOSTIC RADAR WITH PLAIN-ENGLISH INTERPRETATIONS */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400">
                            1. Constellation Rarity
                          </span>
                          <span className="text-xs font-mono font-semibold text-emerald-300">
                            {signalReport.constellationRarityScore}/100
                          </span>
                        </div>
                        <div className="text-xs font-medium text-stone-100">
                          {signalReport.constellationRarityLabel}
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {signalReport.constellationRaritySummary}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400">
                            2. Narrative Curation
                          </span>
                          <span className="text-xs font-mono font-semibold text-amber-300">
                            {signalReport.narrativeCurationScore}/100
                          </span>
                        </div>
                        <div className="text-xs font-medium text-stone-100">
                          {signalReport.narrativeCurationLabel}
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {signalReport.narrativeCurationSummary}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400">
                            3. Coordination Evidence
                          </span>
                          <span className="text-xs font-mono font-semibold text-sky-300">
                            {signalReport.coordinationEvidenceScore}/100
                          </span>
                        </div>
                        <div className="text-xs font-medium text-stone-100">
                          {signalReport.coordinationEvidenceLabel}
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {signalReport.coordinationEvidenceSummary}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400">
                            4. Center of Gravity
                          </span>
                          <span className="text-xs font-mono font-semibold text-amber-200">
                            {signalReport.centerOfGravityLikelihood}%
                          </span>
                        </div>
                        <div className="text-xs font-medium text-stone-100">
                          {signalReport.centerOfGravityLabel}
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed">
                          {signalReport.centerOfGravitySummary}
                        </p>
                      </div>
                    </div>

                    {/* VERIFIED RECORD & CHRONOLOGY WITH LEGAL STATUS & EPISTEMIC GRADES */}
                    {signalReport.verifiedTimeline?.length > 0 && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-200 font-medium">
                          <Clock className="w-4 h-4 text-emerald-300" />
                          Verified Record & Legal Status Chronology
                        </div>
                        <div className="space-y-2.5 border-l border-emerald-400/30 pl-3.5">
                          {signalReport.verifiedTimeline.map((item, idx) => (
                            <div key={idx} className="text-xs leading-relaxed space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-mono text-emerald-300 font-medium">
                                  {item.date}
                                </span>
                                {item.legalStatus && (
                                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] uppercase tracking-wider text-stone-300">
                                    {item.legalStatus}
                                  </span>
                                )}
                                {item.epistemicGrade && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${gradeBadgeStyle(
                                      item.epistemicGrade
                                    )}`}
                                  >
                                    {item.epistemicGrade}
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-300">{item.event}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NARRATIVE MANIPULATION & CURATION AUDIT */}
                    {signalReport.narrativeManipulationAudit && (
                      <div className="p-5 rounded-2xl bg-amber-400/[0.06] border border-amber-400/25 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300 font-medium">
                          <Radio className="w-4 h-4" />
                          How the Mainstream Narrative Is Curated & Distorted
                        </div>
                        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                          {signalReport.narrativeManipulationAudit}
                        </p>
                      </div>
                    )}

                    {/* CENTER OF GRAVITY */}
                    {signalReport.centerOfGravity && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200 font-medium">
                          <Compass className="w-4 h-4" />
                          Center of Gravity & Epistemic Weighing
                        </div>
                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                          {signalReport.centerOfGravity}
                        </p>
                      </div>
                    )}

                    {/* CUMULATIVE INVESTIGATION UPDATE & REVISION LOG */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-sky-300 font-medium">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Cumulative Investigation · Append New Evidence
                      </div>
                      <form onSubmit={handleReviseInvestigation} className="flex gap-2">
                        <input
                          type="text"
                          value={revisionInput}
                          onChange={(e) => setRevisionInput(e.target.value)}
                          placeholder="Paste a new filing, date, or development to update scores & conclusions…"
                          className="flex-1 bg-black/40 border border-white/10 rounded-full px-3.5 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-sky-400/40"
                        />
                        <button
                          type="submit"
                          disabled={isRevising || !revisionInput.trim()}
                          className="px-4 py-2 rounded-full bg-sky-400/20 border border-sky-400/30 text-xs text-sky-200 hover:bg-sky-400/30 disabled:opacity-40 whitespace-nowrap"
                        >
                          {isRevising ? 'Updating…' : 'Update Dossier'}
                        </button>
                      </form>

                      {signalReport.revisionLog?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-stone-500 block">
                            Revision Log
                          </span>
                          {signalReport.revisionLog.map((rev, i) => (
                            <div key={i} className="p-3 rounded-xl bg-black/30 text-xs space-y-1">
                              <span className="text-[10px] font-mono text-sky-300">{rev.timestamp}</span>
                              <p className="text-stone-300">{rev.summary}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : drawerTab === 'power' && signalReport ? (
                  isHydratingDeep && !signalReport.powerOperationBlueprint ? (
                    <div className="py-16 text-center space-y-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-300 animate-pulse">
                        Mapping Follow-the-Power Vectors, Relationship Graph & Investigation Gaps…
                      </p>
                      <p className="text-xs text-stone-500">
                        Completing deep institutional audit in the background.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* VISUAL INSTITUTIONAL RELATIONSHIP MAP */}
                      {signalReport.relationshipMap?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-sky-300 font-medium">
                            <GitBranch className="w-4 h-4" />
                            Institutional Relationship & Influence Map
                          </div>
                          <div className="space-y-2">
                            {signalReport.relationshipMap.map((edge, idx) => (
                              <div
                                key={idx}
                                className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-black/35 border border-white/5 text-xs"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-stone-100">
                                    {edge.sourceEntity}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[11px] text-amber-200/90">
                                    ── {edge.relationshipType} ──►
                                  </span>
                                  <span className="font-semibold text-stone-100">
                                    {edge.targetEntity}
                                  </span>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider ${gradeBadgeStyle(
                                    edge.epistemicGrade
                                  )}`}
                                >
                                  {edge.epistemicGrade}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FOLLOW THE POWER */}
                      {signalReport.followThePower?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-amber-400/[0.06] border border-amber-300/25 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300 font-medium">
                            <ShieldAlert className="w-4 h-4" />
                            Follow the Power Audit
                          </div>
                          <div className="space-y-2.5">
                            {signalReport.followThePower.map((fp, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-stone-100">
                                    {fp.vector}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider ${gradeBadgeStyle(
                                      fp.epistemicGrade
                                    )}`}
                                  >
                                    {fp.epistemicGrade}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-300 leading-relaxed">{fp.finding}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* INVESTIGATION GAP */}
                      {signalReport.investigationGap && (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-sky-300 font-medium">
                            <Layers className="w-4 h-4" />
                            The Investigation Gap: Established vs. Suspected vs. Unknown
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-emerald-400/[0.04] border border-emerald-400/20 space-y-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">
                                Established (Documented)
                              </span>
                              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                                {(signalReport.investigationGap.established || []).map((x, i) => (
                                  <li key={i}>{x}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-amber-400/[0.04] border border-amber-400/20 space-y-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold block">
                                Suspected (Structural Inference)
                              </span>
                              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                                {(signalReport.investigationGap.suspected || []).map((x, i) => (
                                  <li key={i}>{x}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-purple-400/[0.04] border border-purple-400/20 space-y-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold block">
                                Unknown (Lacks Direct Proof)
                              </span>
                              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                                {(signalReport.investigationGap.unknown || []).map((x, i) => (
                                  <li key={i}>{x}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-3 rounded-xl bg-sky-400/[0.04] border border-sky-400/20 space-y-1.5">
                              <span className="text-[10px] uppercase tracking-wider text-sky-300 font-semibold block">
                                Next Primary Targets to Check
                              </span>
                              <ul className="list-disc pl-4 space-y-1 text-stone-300">
                                {(signalReport.investigationGap.nextTargets || []).map((x, i) => (
                                  <li key={i}>{x}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UNCOMFORTABLE QUESTIONS */}
                      {signalReport.uncomfortableQuestions?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200 font-medium">
                            <HelpCircle className="w-4 h-4" />
                            Uncomfortable Questions Conventional Coverage Overlooks
                          </div>
                          <ul className="list-disc pl-4 space-y-1.5 text-xs text-stone-300 leading-relaxed">
                            {signalReport.uncomfortableQuestions.map((q, idx) => (
                              <li key={idx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* COMPETING SCENARIOS */}
                      {signalReport.scenarios?.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400 block">
                            Competing Possibilities & Steelmanned Counter-Weights
                          </span>
                          {signalReport.scenarios.map((sc, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-medium text-stone-100">{sc.name}</h3>
                                <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-white/[0.07] text-xs font-mono text-amber-200">
                                  {sc.likelihood}%
                                </span>
                              </div>
                              <p className="text-xs text-stone-300 leading-relaxed">
                                <span className="text-emerald-300/90 font-medium">Supporting evidence: </span>
                                {sc.caseFor}
                              </p>
                              {sc.caseAgainst && (
                                <p className="text-xs text-stone-400 leading-relaxed">
                                  <span className="text-stone-500 font-medium">Counter-weight: </span>
                                  {sc.caseAgainst}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {signalReport.diagnosticChecklist?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-300 font-medium">
                            <SearchCheck className="w-4 h-4" />
                            Primary Records & Falsifiable Diagnostic Tests
                          </div>
                          <div className="space-y-2.5">
                            {signalReport.diagnosticChecklist.map((doc, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1"
                              >
                                <h4 className="text-xs font-semibold text-stone-100">
                                  {doc.primaryDocument}
                                </h4>
                                <p className="text-xs text-stone-400 leading-relaxed">
                                  {doc.whatToLookFor}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {signalReport.historicalPrecedents && (
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-200 font-medium">
                            <History className="w-4 h-4 text-amber-300" />
                            Historical Precedents & Where Analogies Break Down
                          </div>
                          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                            {signalReport.historicalPrecedents}
                          </p>
                        </div>
                      )}
                    </>
                  )
                ) : drawerTab === 'spectrum' && signalReport ? (
                  isHydratingDeep && signalReport.researchLibrary?.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-300 animate-pulse">
                        Assembling 6 Analytical Lenses & Verified Search Sources…
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {signalReport.spectrumPerspectives?.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-amber-300/90 block">
                            Perspectives Across Six Functional Analytical Lenses
                          </span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {signalReport.spectrumPerspectives.map((sp, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-amber-300 block">
                                  {sp.lens}
                                </span>
                                <p className="text-[11px] italic text-stone-400">{sp.coreQuestion}</p>
                                <h4 className="text-xs font-semibold text-stone-100">
                                  {sp.thinkerOrOutlet}
                                </h4>
                                <p className="text-xs text-stone-300 leading-relaxed">
                                  {sp.coreThesis}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {signalReport.groundingSources?.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-emerald-300/90 block">
                            Verified Live Google Search Grounding Sources
                          </span>
                          {signalReport.groundingSources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-300/35 text-xs text-stone-200"
                            >
                              <span className="truncate pr-2">{src.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}

                      {signalReport.researchLibrary?.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400 block">
                            Curated YouTube Talks (Left, Centrist & Right), Studies & Essays (Direct Search Links)
                          </span>
                          {signalReport.researchLibrary.map((item, idx) => {
                            const fmt = (item.format || '').toLowerCase();
                            const tag = (item.perspectiveTag || '').toLowerCase();
                            const Icon = fmt.includes('youtube')
                              ? Youtube
                              : fmt.includes('study')
                              ? GraduationCap
                              : BookOpen;

                            const badgeStyle = tag.includes('centrist')
                              ? 'bg-sky-400/10 border-sky-400/25 text-sky-200'
                              : tag.includes('left')
                              ? 'bg-indigo-400/10 border-indigo-400/25 text-indigo-200'
                              : tag.includes('right')
                              ? 'bg-rose-400/10 border-rose-400/25 text-rose-200'
                              : 'bg-amber-400/10 border-amber-400/20 text-amber-200';

                            return (
                              <a
                                key={idx}
                                href={buildSmartResearchUrl(item)}
                                target="_blank"
                                rel="noreferrer"
                                className="block p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-300/35 transition-all space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.07] text-[10px] uppercase tracking-wider text-stone-200">
                                      <Icon
                                        className={`w-3 h-3 ${
                                          fmt.includes('youtube') ? 'text-red-400' : 'text-amber-300'
                                        }`}
                                      />
                                      {item.format}
                                    </span>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${badgeStyle}`}
                                    >
                                      {item.perspectiveTag}
                                    </span>
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-stone-100 leading-snug">
                                    {item.title}
                                  </h4>
                                  <span className="text-xs text-stone-400">
                                    {item.authorOrChannel}
                                  </span>
                                </div>

                                <p className="text-xs text-stone-300 leading-relaxed">
                                  {item.takeaway}
                                </p>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  /* TAB 4: TOUCHMARK STUDIO — EVIDENCE-LINKED CREATOR CONTENT ENGINE + EXTERNAL IMPORTER */
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 block">
                          Touchmark Studio · Research-to-Broadcast Engine
                        </span>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Inherits your verified Signal record—or your own pasted research notes—to draft scripts & essays.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowExternalImporter(!showExternalImporter)}
                          className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-stone-300 inline-flex items-center gap-1"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Import Notes</span>
                        </button>
                        {signalReport && !signalReport.studioAssets && !isGeneratingStudio && (
                          <button
                            type="button"
                            onClick={() => generateStudioPackage()}
                            className="px-4 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/35 text-xs text-emerald-200 hover:bg-emerald-400/30"
                          >
                            Generate Suite
                          </button>
                        )}
                      </div>
                    </div>

                    {showExternalImporter && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-400/25 space-y-3">
                        <span className="text-[10px] uppercase tracking-wider text-emerald-300 block">
                          Paste External Research Notes, Transcripts or Articles
                        </span>
                        <textarea
                          rows={5}
                          value={externalResearchNotes}
                          onChange={(e) => setExternalResearchNotes(e.target.value)}
                          placeholder="Paste your own research notes, interview transcript, or document excerpts here to produce a Substack essay, YouTube script, and short-form pack…"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-emerald-400/40"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={isGeneratingStudio || !externalResearchNotes.trim()}
                            onClick={() => generateStudioPackage(externalResearchNotes)}
                            className="px-4 py-2 rounded-full bg-emerald-300 text-stone-950 font-medium text-xs hover:bg-emerald-200 disabled:opacity-40"
                          >
                            {isGeneratingStudio ? 'Building Studio Package…' : 'Build From Imported Research'}
                          </button>
                        </div>
                      </div>
                    )}

                    {isGeneratingStudio ? (
                      <div className="py-16 text-center space-y-2">
                        <p className="text-xs uppercase tracking-[0.22em] text-emerald-300 animate-pulse">
                          Structuring Substack Essay, YouTube Script, Short-Form Pack & Integrity Audit…
                        </p>
                        <p className="text-xs text-stone-500">
                          Cross-checking every draft claim against your Signal evidence grades.
                        </p>
                      </div>
                    ) : signalReport?.studioAssets ? (
                      <>
                        {/* Editorial Hook & Alternative Angles */}
                        <div className="p-4 rounded-2xl bg-emerald-400/[0.05] border border-emerald-400/20 space-y-2">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">
                            Lead Editorial Hook
                          </span>
                          <p className="text-xs sm:text-sm text-stone-100 leading-relaxed">
                            {signalReport.studioAssets.editorialHook}
                          </p>
                          {signalReport.studioAssets.alternativeAngles?.length > 0 && (
                            <div className="pt-2 border-t border-white/10 space-y-1">
                              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                                Alternative Editorial Angles
                              </span>
                              {signalReport.studioAssets.alternativeAngles.map((ang, i) => (
                                <p key={i} className="text-xs text-stone-300">
                                  <strong className="text-stone-100">{ang.angleTitle}:</strong> {ang.framing}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Format Switcher */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setStudioFormatView('substack')}
                              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${
                                studioFormatView === 'substack'
                                  ? 'bg-white/15 text-white'
                                  : 'text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Substack
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudioFormatView('script')}
                              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${
                                studioFormatView === 'script'
                                  ? 'bg-white/15 text-white'
                                  : 'text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5" />
                              YouTube Script
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudioFormatView('shortform')}
                              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${
                                studioFormatView === 'shortform'
                                  ? 'bg-white/15 text-white'
                                  : 'text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              Short-Form Pack
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudioFormatView('audit')}
                              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${
                                studioFormatView === 'audit'
                                  ? 'bg-white/15 text-white'
                                  : 'text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              Audit & Visuals
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const payload =
                                studioFormatView === 'substack'
                                  ? signalReport.studioAssets.substackEssayDraft
                                  : studioFormatView === 'script'
                                  ? signalReport.studioAssets.youtubePodcastScript
                                  : studioFormatView === 'shortform'
                                  ? (signalReport.studioAssets.shortFormPack || [])
                                      .map(
                                        (s) =>
                                          `[${s.platform}]\nHOOK: ${s.hook}\nBEAT: ${s.coreBeat}\nVISUAL: ${s.visualDirection}`
                                      )
                                      .join('\n\n')
                                  : (signalReport.studioAssets.evidenceIntegrityAudit || []).join('\n');
                              navigator.clipboard?.writeText(payload || '');
                              setCopiedStudioText(true);
                              setTimeout(() => setCopiedStudioText(false), 2000);
                            }}
                            className="px-3 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] text-xs text-stone-200"
                          >
                            {copiedStudioText ? 'Copied!' : 'Copy Draft'}
                          </button>
                        </div>

                        {studioFormatView === 'substack' ? (
                          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                            {signalReport.studioAssets.substackEssayDraft}
                          </div>
                        ) : studioFormatView === 'script' ? (
                          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line font-mono">
                            {signalReport.studioAssets.youtubePodcastScript}
                          </div>
                        ) : studioFormatView === 'shortform' ? (
                          <div className="space-y-4">
                            {(signalReport.studioAssets.shortFormPack || []).map((clip, i) => (
                              <div
                                key={i}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold block">
                                  Clip 0{i + 1} · {clip.platform}
                                </span>
                                <p className="text-stone-100 font-medium">Hook: “{clip.hook}”</p>
                                <p className="text-stone-300 leading-relaxed">{clip.coreBeat}</p>
                                <p className="text-stone-400">
                                  <strong>Visual Direction:</strong> {clip.visualDirection}
                                </p>
                              </div>
                            ))}

                            {signalReport.studioAssets.doNotCompressWarnings?.length > 0 && (
                              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-400/25 space-y-2">
                                <span className="text-[10px] uppercase tracking-wider text-red-300 font-semibold block">
                                  Editorial Safeguard · Do Not Compress Into Short-Form
                                </span>
                                <ul className="list-disc pl-4 space-y-1 text-xs text-stone-300">
                                  {signalReport.studioAssets.doNotCompressWarnings.map((w, i) => (
                                    <li key={i}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-amber-400/[0.06] border border-amber-400/25 space-y-2">
                              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block">
                                Journalistic Integrity & Overstatement Guardrails
                              </span>
                              <ul className="list-disc pl-4 space-y-1.5 text-xs text-stone-300">
                                {(signalReport.studioAssets.evidenceIntegrityAudit || []).map((flag, i) => (
                                  <li key={i}>{flag}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                              <span className="text-[11px] uppercase tracking-wider text-sky-300 font-semibold block">
                                On-Screen Primary Evidence & B-Roll Shot List
                              </span>
                              {(signalReport.studioAssets.visualAssetChecklist || []).map((v, i) => (
                                <div key={i} className="text-xs text-stone-300 border-b border-white/5 pb-2">
                                  <strong className="text-stone-100">{v.timestampOrBeat}:</strong>{' '}
                                  {v.onScreenEvidence}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                )}

                {/* Centered PDF & Markdown Export Buttons inside Dossier Drawer */}
                {signalReport && (
                  <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={exportFullPdfDossier}
                      disabled={isHydratingDeep}
                      className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-full bg-amber-300 text-stone-950 font-medium text-xs tracking-wide whitespace-nowrap hover:bg-amber-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Printer className="w-4 h-4 shrink-0" />
                      <span>{isHydratingDeep ? 'Finalizing Full PDF…' : 'Export PDF Dossier'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={copyReceipt}
                      disabled={isHydratingDeep}
                      className="w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-stone-200 font-medium text-xs tracking-wide whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                    >
                      {copiedReceipt ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                          <span>Markdown Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 shrink-0" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
