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
  ShieldAlert
} from 'lucide-react';

// --- BRAND MARK ---
function TouchmarkLogo({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r="15.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="9.5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="2.8" fill="currentColor" />
    </svg>
  );
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
function MorphingSphereOrb({ status, mode, thinkingPhase, onClick }) {
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
        className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center focus:outline-none group cursor-pointer"
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
              className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border border-dashed opacity-60 orbit-cw pointer-events-none"
            >
              <span className={`absolute -top-1 left-1/2 w-2 h-2 rounded-full ${palette.dot} shadow-lg`} />
            </div>
            <div
              style={{ borderColor: palette.rim }}
              className="absolute w-46 h-46 sm:w-50 sm:h-50 rounded-full border border-dotted opacity-45 orbit-ccw pointer-events-none"
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
          className={`absolute w-44 h-44 sm:w-48 sm:h-48 opacity-45 transition-all duration-500 ${
            isListening || isSpeaking || isThinking ? 'orb-active' : 'orb-organic'
          }`}
        />

        <div
          style={{
            background: palette.sphere,
            boxShadow: `inset -18px -22px 38px rgba(0,0,0,0.82), inset 10px 12px 24px rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.75)`
          }}
          className={`relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center transition-transform duration-500 ${
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

      <span className="mt-1.5 text-[11px] uppercase tracking-[0.26em] text-stone-400 transition-all duration-300">
        {isListening
          ? 'Listening…'
          : isThinking
          ? thinkingPhase
          : isSpeaking
          ? 'Speaking'
          : 'Tap sphere to speak'}
      </span>
    </div>
  );
}

// --- PROMPTS & SCHEMAS ---
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

const SIGNAL_SYSTEM_PROMPT = `You are Touchmark Signal, an independent, anti-propaganda intelligence and power-dynamics analyst.
CRITICAL DIRECTIVE: Do NOT reflexively parrot or defer to the mainstream media or institutional consensus. Assume mainstream narratives are frequently curated, sequenced, and amplified to protect political, economic, or judicial power. At the same time, do not invent fake facts—distinguish rigorously between what is documented on the surface, how the narrative is being manipulated, and what the structural incentives and historical precedents suggest is happening behind the scenes.

Produce a long, deeply substantive intelligence briefing in valid JSON ONLY with these exact keys:
{
  "spokenSynthesis": "A rich, unhurried 7–9 sentence spoken briefing (180–240 words). Directly expose how mainstream coverage frames and curates this story; spell out the conspicuous rarity of the constellation of details (timing relative to independent influence, evidentiary gaps, institutional coordination); explore concretely how political, economic, or judicial power operates when neutralizing a threat; and conclude with a candid epistemic weighing (e.g., either power actors executed an extraordinarily seamless operation or the underlying case stands on its own—laying out the exact anatomy of both without naivety).",
  "narrativeManipulationAudit": "2 detailed paragraphs analyzing how mainstream media, platforms, and institutions are curating, sequencing, or distorting this story—what is being amplified, what context is buried, and how public perception is being steered.",
  "constellationRarityScore": 84,
  "constellationRarityAnalysis": "2 detailed paragraphs explaining why the simultaneous clustering of these specific details (timing, delay, institutional alignment, evidentiary standards, judicial/media posture) is statistically and historically conspicuous rather than an ordinary coincidence.",
  "powerOperationBlueprint": "2 detailed paragraphs exploring: 'If political, economic, or judicial power were being used discriminately here, what would that actually look like in practice?' Walk through concrete mechanisms (selective prosecution, timing leverage, media-intelligence synchronization, financial/platform choking) and cite specific historical cases where similar power was used against dissidents or disruptive figures.",
  "centerOfGravity": "2 paragraphs giving your candid Center of Gravity synthesis: weighing the institutional-neutralization/lawfare hypothesis against the official record, stating clearly what the balance of evidence looks like on the surface versus beneath the surface, and why a sharp observer refuses to be naive.",
  "centerOfGravityLikelihood": 58,
  "scenarios": [
    {
      "name": "Scenario title (include: 1. Coordinated Institutional / Judicial Neutralization, 2. Substantive Conviction / Organic Cascade, and 3. Opportunistic Institutional Pile-On)",
      "likelihood": 42,
      "caseFor": "Detailed reasoning, anomalies, timing clues, and historical parallels supporting this possibility",
      "caseAgainst": "What weakens or complicates this possibility"
    }
  ],
  "historicalPrecedents": "2 detailed paragraphs citing 3–4 concrete historical cases of judicial, political, intelligence, or corporate weaponization and media manipulation—including base-rate frequency of how often such operations occur versus how often they are exposed years later.",
  "spectrumPerspectives": [
    {
      "lens": "Analytical · Left / Institutional Critique",
      "thinkerOrOutlet": "Specific high-integrity writer, scholar, or publication",
      "coreThesis": "Detailed summary of how this perspective frames the issue"
    },
    {
      "lens": "Analytical · Right / Heterodox & Civil Liberties",
      "thinkerOrOutlet": "Specific high-integrity writer, scholar, or publication",
      "coreThesis": "Detailed summary of how this perspective frames the issue"
    },
    {
      "lens": "Philosophical · Depth-Psychological & Moral",
      "thinkerOrOutlet": "Specific philosopher, psychologist, or cultural essayist",
      "coreThesis": "What deeper human, archetypal, or civilizational pattern they point to"
    },
    {
      "lens": "Spiritual · Contemplative & Wisdom Tradition",
      "thinkerOrOutlet": "Specific contemplative thinker, essayist, or wisdom framework",
      "coreThesis": "How this lens interprets power, shadow, discernment, or collective awakening"
    }
  ],
  "researchLibrary": [
    {
      "title": "Specific study, book, essay, Substack piece, or YouTube lecture/debate",
      "authorOrChannel": "Author, researcher, or channel name",
      "format": "Study | Essay / Substack | YouTube | Book / Lecture",
      "perspectiveTag": "Left-Analytical | Right-Heterodox | Anti-Establishment | Philosophical | Spiritual",
      "takeaway": "2 sentences on the specific insight, historical parallel, or evidence this source contributes",
      "url": "Direct verified URL if known from search, otherwise empty string",
      "searchQuery": "Exact search query to pull up this exact study, essay, or YouTube talk"
    }
  ]
}
Include 8–10 diverse, high-integrity entries in "researchLibrary" spanning studies, essays/blogs, and YouTube videos across Left, Right, Anti-Establishment, Philosophical, and Spiritual lenses.`;

const VOICE_OPTIONS = [
  { id: 'Aoede', label: 'Aoede' },
  { id: 'Sulafat', label: 'Sulafat' },
  { id: 'Charon', label: 'Charon' },
  { id: 'Kore', label: 'Kore' }
];

const PULSE_THINKING_PHASES = [
  'Reading beneath the surface…',
  'Mapping hidden incentives…',
  'Testing unspoken assumptions…',
  'Curating philosophical & analytical voices…'
];

const SIGNAL_THINKING_PHASES = [
  'Auditing mainstream narrative curation…',
  'Measuring constellation rarity & anomalies…',
  'Modeling power-asymmetry & historical parallels…',
  'Assembling full-spectrum research library…'
];

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
  if (item.url && item.url.startsWith('http') && !item.url.includes('vertexaisearch')) {
    return item.url;
  }
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

export default function TouchmarkToolsApp() {
  const [mode, setMode] = useState('signal');
  const [status, setStatus] = useState('idle');
  const [thinkingPhaseIndex, setThinkingPhaseIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [errorBanner, setErrorBanner] = useState('');

  const [activeCaption, setActiveCaption] = useState(
    'I’m listening. Say hello to test your mic, or bring a narrative, case, or decision to look beneath the surface.'
  );
  const [history, setHistory] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('analysis'); // 'analysis' | 'power' | 'spectrum'
  const [hasArtifact, setHasArtifact] = useState(false);
  const [pulseLedger, setPulseLedger] = useState(null);
  const [signalReport, setSignalReport] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const soundscapeRef = useRef(null);

  useEffect(() => {
    soundscapeRef.current = createContemplationSoundscape();
    return () => {
      soundscapeRef.current?.stopThinkingDrone(false);
    };
  }, []);

  useEffect(() => {
    if (status !== 'thinking') {
      setThinkingPhaseIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setThinkingPhaseIndex((prev) => (prev + 1) % 4);
    }, 1700);
    return () => clearInterval(timer);
  }, [status]);

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

  const handleSubmission = async (rawQuery) => {
    const query = (rawQuery ?? inputText).trim();
    if (!query) return;

    setErrorBanner('');
    stopSpeaking();
    setInputText('');
    setStatus('thinking');

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
        const reflection = parsed.spokenReflection || 'Here is what stands out beneath the surface.';
        setActiveCaption(reflection);
        setHistory((prev) => [...prev, { role: 'assistant', text: reflection }]);
        speakResponse(reflection);
        return;
      }

      // 3. Signal Anti-Manipulation & Power-Asymmetry Intelligence Audit
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          prompt: `Deliver a thorough, critical intelligence briefing on this subject. Do NOT just repeat the mainstream media narrative—dissect how mainstream framing curates and manipulates public perception, evaluate the conspicuous rarity of the constellation of details, explore concretely how political/economic/judicial power could be operating behind the scenes with historical precedents and base-rate frequencies, and provide a full-spectrum research library across Left, Right, Anti-Establishment, Analytical, Philosophical, and Spiritual voices: "${query}"`,
          systemInstruction: SIGNAL_SYSTEM_PROMPT,
          useSearch: true
        })
      });
      const data = await res.json();
      soundscapeRef.current?.stopThinkingDrone(voiceEnabled);
      if (!res.ok) throw new Error(data.error || 'Signal audit failed.');

      const parsed = extractJsonObject(data.text);
      setSignalReport({
        subject: query,
        spokenSynthesis:
          parsed.spokenSynthesis ||
          'Intelligence brief ready. Open the dossier to inspect the narrative manipulation audit, constellation rarity, power blueprint, and full-spectrum sources.',
        narrativeManipulationAudit: parsed.narrativeManipulationAudit || '',
        constellationRarityScore: parsed.constellationRarityScore ?? 82,
        constellationRarityAnalysis: parsed.constellationRarityAnalysis || '',
        powerOperationBlueprint: parsed.powerOperationBlueprint || '',
        centerOfGravity: parsed.centerOfGravity || '',
        centerOfGravityLikelihood: parsed.centerOfGravityLikelihood ?? 58,
        scenarios: Array.isArray(parsed.scenarios) ? parsed.scenarios : [],
        historicalPrecedents: parsed.historicalPrecedents || '',
        spectrumPerspectives: Array.isArray(parsed.spectrumPerspectives)
          ? parsed.spectrumPerspectives
          : [],
        researchLibrary: Array.isArray(parsed.researchLibrary) ? parsed.researchLibrary : []
      });
      setHasArtifact(true);
      setDrawerTab('analysis');
      const spoken = parsed.spokenSynthesis || 'Your Signal intelligence dossier is ready.';
      setActiveCaption(spoken);
      setHistory((prev) => [...prev, { role: 'assistant', text: spoken }]);
      speakResponse(spoken);
    } catch (err) {
      soundscapeRef.current?.stopThinkingDrone(false);
      setStatus('idle');
      setErrorBanner(err.message || 'Something interrupted that thought. Try again.');
    }
  };

  const copyReceipt = () => {
    if (!signalReport) return;
    const scenarioLines = signalReport.scenarios
      .map((s) => `- ${s.name} (${s.likelihood}%): ${s.caseFor}`)
      .join('\n');
    const refLines = signalReport.researchLibrary
      .map((r) => `- [${r.perspectiveTag} · ${r.format}] ${r.title} (${r.authorOrChannel})`)
      .join('\n');
    const text = `Touchmark Signal Intelligence Dossier\nSubject: ${signalReport.subject}\nConstellation Rarity Index: ${signalReport.constellationRarityScore}/100\n\nNarrative Manipulation Audit:\n${signalReport.narrativeManipulationAudit}\n\nConstellation Rarity Analysis:\n${signalReport.constellationRarityAnalysis}\n\nIf Institutional Power Is Operating Behind the Scenes:\n${signalReport.powerOperationBlueprint}\n\nCenter of Gravity (${signalReport.centerOfGravityLikelihood}%):\n${signalReport.centerOfGravity}\n\nCompeting Scenarios:\n${scenarioLines}\n\nHistorical Precedents:\n${signalReport.historicalPrecedents}\n\nFull-Spectrum Research Library:\n${refLines}`;
    navigator.clipboard?.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const currentThinkingLabel =
    mode === 'signal'
      ? SIGNAL_THINKING_PHASES[thinkingPhaseIndex]
      : PULSE_THINKING_PHASES[thinkingPhaseIndex];

  return (
    <div className="min-h-screen bg-[#090807] text-stone-100 flex flex-col justify-between selection:bg-amber-400/30">
      {/* Ultra-minimal Top Bar */}
      <header className="px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-stone-300">
          <TouchmarkLogo className="w-6 h-6 text-amber-300/90" />
          <span className="text-sm font-medium tracking-wide">Touchmark</span>
        </div>

        {/* Mode Pill */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => setMode('pulse')}
            className={`px-3.5 py-1 rounded-full text-xs transition-all ${
              mode === 'pulse' ? 'bg-emerald-400/20 text-emerald-200' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Pulse
          </button>
          <button
            type="button"
            onClick={() => setMode('signal')}
            className={`px-3.5 py-1 rounded-full text-xs transition-all ${
              mode === 'signal' ? 'bg-amber-400/20 text-amber-200' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Signal
          </button>
        </div>

        {/* Voice & Dossier Controls */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Voice"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="hidden sm:block bg-transparent border border-white/10 rounded-full px-2.5 py-1 text-xs text-stone-400 focus:outline-none"
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

          {hasArtifact && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-xs text-amber-200 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossier</span>
            </button>
          )}
        </div>
      </header>

      {/* Center Sanctuary: Morphing 3D Orb + Substantive Spoken Briefing */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto w-full py-3">
        {errorBanner && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/60 border border-red-400/30 text-xs text-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        <MorphingSphereOrb
          status={status}
          mode={mode}
          thinkingPhase={currentThinkingLabel}
          onClick={toggleListening}
        />

        {/* Scrollable, comfortable reading box for longer spoken briefings */}
        <div className="mt-5 max-h-48 sm:max-h-56 overflow-y-auto px-2 max-w-2xl">
          <p className="text-sm sm:text-[15px] font-light text-stone-200/95 leading-relaxed">
            {status === 'thinking' ? currentThinkingLabel : activeCaption}
          </p>
        </div>

        {hasArtifact && status !== 'thinking' && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDrawerTab('analysis');
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.11] border border-white/15 text-[11px] uppercase tracking-[0.16em] text-amber-200 transition-all"
            >
              Narrative & Rarity Audit →
            </button>
            {mode === 'signal' && (
              <button
                type="button"
                onClick={() => {
                  setDrawerTab('power');
                  setDrawerOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-[11px] uppercase tracking-[0.16em] text-stone-300 hover:text-amber-200 transition-all"
              >
                Power Blueprint & History →
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setDrawerTab('spectrum');
                setDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-[11px] uppercase tracking-[0.16em] text-stone-300 hover:text-amber-200 transition-all"
            >
              Spectrum & Sources →
            </button>
          </div>
        )}
      </main>

      {/* Bottom Input Bar */}
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
                ? 'Speak to the orb, or unpack a personal/strategic tension…'
                : 'Speak to the orb, or dissect a narrative and its hidden power dynamics…'
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
      </footer>

      {/* Slide-Over Intelligence & Multi-Perspective Dossier Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#11100e] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
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
              </div>
            ) : mode === 'signal' && signalReport ? (
              <div className="space-y-6">
                {/* Drawer Header + 3-Tab Switcher */}
                <div className="space-y-4 border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                      Signal Counter-Narrative & Power Dossier
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

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
                      Narrative & Rarity
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
                      Power Blueprint & History
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
                      Spectrum & Sources ({signalReport.researchLibrary?.length || 0})
                    </button>
                  </div>
                </div>

                {drawerTab === 'analysis' ? (
                  <>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-1">
                        Subject Under Examination
                      </span>
                      <h2 className="text-lg font-medium text-stone-100 leading-snug">
                        “{signalReport.subject}”
                      </h2>
                    </div>

                    {/* 1. NARRATIVE MANIPULATION & CURATION AUDIT */}
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

                    {/* 2. CONSTELLATION RARITY & CONSPICUOUS ANOMALY */}
                    {signalReport.constellationRarityAnalysis && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-300 font-medium">
                            <Eye className="w-4 h-4" />
                            Constellation Rarity & Conspicuous Anomalies
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-xs font-semibold text-emerald-200">
                            Rarity: {signalReport.constellationRarityScore}/100
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                          {signalReport.constellationRarityAnalysis}
                        </p>
                      </div>
                    )}

                    {/* 3. CENTER OF GRAVITY */}
                    {signalReport.centerOfGravity && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200 font-medium">
                            <Compass className="w-4 h-4" />
                            Center of Gravity & Epistemic Weighing
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.07] text-xs font-mono text-stone-200">
                            {signalReport.centerOfGravityLikelihood}% Weight
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                          {signalReport.centerOfGravity}
                        </p>
                      </div>
                    )}
                  </>
                ) : drawerTab === 'power' ? (
                  <>
                    {/* TAB 2: IF POWER IS BEHIND THIS + HISTORICAL PRECEDENTS + SCENARIOS */}
                    {signalReport.powerOperationBlueprint && (
                      <div className="p-5 rounded-2xl bg-amber-400/[0.06] border border-amber-300/25 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300 font-medium">
                          <ShieldAlert className="w-4 h-4" />
                          If Institutional or Judicial Power Is Operating Behind the Scenes
                        </div>
                        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line">
                          {signalReport.powerOperationBlueprint}
                        </p>
                      </div>
                    )}

                    {signalReport.historicalPrecedents && (
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-200 font-medium">
                          <History className="w-4 h-4 text-amber-300" />
                          Historical Precedents & Base-Rate Frequency
                        </div>
                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line">
                          {signalReport.historicalPrecedents}
                        </p>
                      </div>
                    )}

                    {signalReport.scenarios?.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400 block">
                          Competing Possibilities & Probability Weights
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
                              <span className="text-emerald-300/90 font-medium">What points here: </span>
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
                  </>
                ) : (
                  /* TAB 3: FULL-SPECTRUM PERSPECTIVES & MULTI-FORMAT RESEARCH LIBRARY */
                  <div className="space-y-6">
                    {signalReport.spectrumPerspectives?.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-amber-300/90 block">
                          How High-Integrity Thinkers Frame This Across Lenses
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

                    {signalReport.researchLibrary?.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-stone-400 block">
                          Curated Studies, Essays, Substacks & Long-Form Talks
                        </span>
                        {signalReport.researchLibrary.map((item, idx) => {
                          const fmt = (item.format || '').toLowerCase();
                          const Icon = fmt.includes('youtube')
                            ? Youtube
                            : fmt.includes('study')
                            ? GraduationCap
                            : BookOpen;

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
                                    <Icon className="w-3 h-3 text-amber-300" />
                                    {item.format}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] uppercase tracking-wider text-amber-200">
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
                )}

                <button
                  type="button"
                  onClick={copyReceipt}
                  className="w-full py-3 rounded-full bg-amber-300 text-stone-950 font-medium text-xs uppercase tracking-wider hover:bg-amber-200 flex items-center justify-center gap-2"
                >
                  {copiedReceipt ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Intelligence & Spectrum Dossier Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Copy Full Intelligence & Spectrum Dossier
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
