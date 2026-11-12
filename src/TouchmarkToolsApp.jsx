import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  ShieldCheck,
  Compass,
  Volume2,
  VolumeX,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  X,
  RefreshCw,
  MessageCircle,
  Scale,
  Layers,
  Share2
} from 'lucide-react';

// --- BRAND MARK ---
function TouchmarkLogo({ className = 'w-7 h-7' }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.25" />
      <circle cx="18" cy="18" r="10.5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.25" />
      <path
        d="M18 5.5V11.5M18 24.5V30.5M5.5 18H11.5M24.5 18H30.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="18" r="3" fill="currentColor" />
    </svg>
  );
}

// --- LIVING RESONANCE ORB ---
function ResonanceOrb({ status, mode, onClick }) {
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  const ringColor =
    mode === 'signal'
      ? 'from-amber-300/40 via-orange-400/25 to-emerald-300/30'
      : 'from-emerald-300/40 via-teal-400/25 to-amber-200/30';

  const coreGlow = isListening
    ? 'scale-110 shadow-[0_0_80px_rgba(245,158,11,0.45)] border-amber-300/70'
    : isThinking
    ? 'scale-105 shadow-[0_0_70px_rgba(52,211,153,0.4)] border-emerald-300/70 animate-pulse'
    : isSpeaking
    ? 'scale-105 shadow-[0_0_75px_rgba(251,191,36,0.4)] border-amber-200/70'
    : 'hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.08)] border-white/20';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isListening ? 'Stop listening' : 'Tap to speak with Touchmark'}
      className="relative group flex items-center justify-center w-44 h-44 rounded-full focus:outline-none"
    >
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-tr ${ringColor} blur-2xl transition-all duration-700 ${
          isListening || isSpeaking ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-90'
        }`}
      />
      <span
        className={`absolute inset-3 rounded-full border border-white/10 transition-transform duration-1000 ${
          isListening ? 'animate-ping opacity-30' : 'opacity-50'
        }`}
      />
      <div
        className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-full bg-stone-900/90 backdrop-blur-xl border transition-all duration-500 ${coreGlow}`}
      >
        {isListening ? (
          <Mic className="w-7 h-7 text-amber-300 animate-bounce" />
        ) : isThinking ? (
          <RefreshCw className="w-7 h-7 text-emerald-300 animate-spin" />
        ) : isSpeaking ? (
          <Volume2 className="w-7 h-7 text-amber-200 animate-pulse" />
        ) : (
          <Mic className="w-7 h-7 text-stone-200 group-hover:text-amber-200 transition-colors" />
        )}
        <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
          {isListening
            ? 'Listening'
            : isThinking
            ? 'Discerning'
            : isSpeaking
            ? 'Speaking'
            : 'Tap to Speak'}
        </span>
      </div>
    </button>
  );
}

// --- PROMPTS & SCHEMAS ---
const PULSE_SYSTEM_PROMPT = `You are Touchmark Pulse, a relational and decision discernment sanctuary.
Given a user's situation, dilemma, or relationship tension, distill the core tension, name the hidden assumption, offer 3 grounded strategic paths (with clear trade-offs), and provide a warm 2-sentence spoken reflection.`;

const PULSE_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    coreTension: { type: 'STRING' },
    hiddenAssumption: { type: 'STRING' },
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
    }
  },
  required: ['title', 'coreTension', 'hiddenAssumption', 'spokenReflection', 'options']
};

const SIGNAL_SYSTEM_PROMPT = `You are Touchmark Signal, an epistemic discernment and claim-verification engine.
Analyze the user's claim, headline, or statistic. Return valid JSON ONLY with these exact keys:
{
  "claim": "Cleaned statement of the claim",
  "verdict": "Supported | Nuanced / Context Needed | Unsubstantiated | Framing Distortion",
  "confidence": 85,
  "spokenSummary": "Warm 2-sentence spoken takeaway",
  "denominatorCheck": "What baseline, sample size, or denominator is missing or crucial",
  "dependencyChain": ["Premise 1", "Premise 2", "Conclusion"],
  "receiptNote": "Concise citable creator receipt summary",
  "sources": [{ "title": "Source name", "url": "https://..." }]
}`;

const INITIAL_PULSE_LEDGER = {
  title: 'The Unspoken Boundary in a High-Stakes Partnership',
  coreTension:
    'Preserving immediate harmony versus naming an operational misalignment that is quietly eroding trust.',
  hiddenAssumption:
    'That bringing up the friction now will fracture the relationship rather than clarify shared expectations.',
  spokenReflection:
    'Right now, silence is protecting short-term comfort at the expense of long-term alignment. Naming what you actually need gives the other person a real chance to meet you there.',
  options: [
    {
      label: 'Direct & Grounded Reset',
      stance: 'Name the specific pattern without blame and propose a clear working agreement.',
      tradeoff: 'Creates brief discomfort today in exchange for clean expectations tomorrow.'
    },
    {
      label: 'Curiosity-First Inquiry',
      stance: 'Ask how they are experiencing the current cadence before sharing your own boundary.',
      tradeoff: 'Slower to resolve, but surfaces blind spots you may not see yet.'
    },
    {
      label: 'Time-Boxed Trial',
      stance: 'Agree on a 14-day experiment with explicit check-in metrics before making a permanent call.',
      tradeoff: 'Lowers emotional stakes while testing whether behavior actually shifts.'
    }
  ]
};

const SAMPLE_SIGNAL_REPORT = {
  claim: 'New study claims a daily supplement cuts cognitive decline risk by 40%.',
  verdict: 'Nuanced / Context Needed',
  confidence: 88,
  spokenSummary:
    'The forty percent figure reflects relative risk reduction in a narrow subgroup, while the absolute difference across the full trial was under two percentage points. Always check the baseline denominator before treating a headline percentage as a personal guarantee.',
  denominatorCheck:
    '40% relative reduction represents a drop from 4.2% to 2.5% absolute incidence (1.7% absolute difference) over 12 months.',
  dependencyChain: [
    'Observational subgroup showed 4.2% baseline event rate',
    'Supplement group recorded 2.5% event rate (1.7% absolute gap)',
    'Headline reports relative ratio (1.7 / 4.2 = 40.4%) without baseline rate'
  ],
  receiptNote:
    'Relative risk (40%) ≠ absolute risk reduction (1.7%). Check baseline incidence and trial duration before citing.',
  sources: [
    { title: 'Cochrane Handbook: Communicating Risk & Denominators', url: 'https://training.cochrane.org' },
    { title: 'CONSORT Reporting Guidelines for Clinical Trials', url: 'https://www.equator-network.org' }
  ]
};

const VOICE_OPTIONS = [
  { id: 'Aoede', label: 'Aoede (Warm & Grounded)' },
  { id: 'Sulafat', label: 'Sulafat (Calm & Clear)' },
  { id: 'Charon', label: 'Charon (Deep & Steady)' },
  { id: 'Kore', label: 'Kore (Bright & Crisp)' }
];

// --- HELPER: Convert Base64 Linear16 PCM (24kHz) to playable WAV Blob URL ---
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
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLength, true);

  for (let i = 0; i < pcmLength; i++) {
    view.setUint8(44 + i, binary.charCodeAt(i));
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// --- HELPER: Detect conversational check-in vs. full Pulse/Signal query ---
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

export default function TouchmarkToolsApp() {
  const [mode, setMode] = useState('pulse'); // 'pulse' | 'signal'
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [errorBanner, setErrorBanner] = useState('');

  // Conversational Copilot Thread
  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      text: "I'm here and listening. Say hello to test your mic, think out loud about a decision, or drop a claim you want verified."
    }
  ]);

  // Structured Artifacts
  const [pulseLedger, setPulseLedger] = useState(INITIAL_PULSE_LEDGER);
  const [signalReport, setSignalReport] = useState(SAMPLE_SIGNAL_REPORT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // Stop any playing audio cleanly
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

  // Studio-grade Gemini TTS playback with graceful fallback
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

      const audioUrl = data.mimeType?.includes('wav') || data.mimeType?.includes('mp3')
        ? `data:${data.mimeType};base64,${data.audioBase64}`
        : pcmBase64ToWavUrl(data.audioBase64, 24000);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setStatus('idle');
      audio.onerror = () => setStatus('idle');
      await audio.play();
    } catch {
      // Fallback only if TTS endpoint fails
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

  // Speech Recognition setup
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
        setErrorBanner('Microphone access was blocked. Allow mic access in your browser bar or type below.');
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
      setErrorBanner('Voice input is not supported in this browser—type your thought below.');
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

    const updatedHistory = [...copilotMessages, { role: 'user', text: query }];
    setCopilotMessages(updatedHistory);

    try {
      // 1. WARM COPILOT CHAT ROUTE (Greetings, mic checks, warming up)
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
        if (!res.ok) throw new Error(data.error || 'Could not reach Touchmark.');

        const reply = data.reply || "I hear you clearly. What's on your mind today?";
        setCopilotMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
        await speakResponse(reply);
        return;
      }

      // 2. PULSE DECISION & RELATIONAL DISCERNMENT
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
        if (!res.ok) throw new Error(data.error || 'Pulse discernment failed.');

        const parsed = extractJsonObject(data.text);
        setPulseLedger(parsed);
        const reflection =
          parsed.spokenReflection || 'Here is the core tension and three grounded ways forward.';
        setCopilotMessages((prev) => [...prev, { role: 'assistant', text: reflection }]);
        await speakResponse(reflection);
        return;
      }

      // 3. SIGNAL EPISTEMIC CLAIM AUDIT
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          prompt: `Audit this claim or headline thoroughly: "${query}"`,
          systemInstruction: SIGNAL_SYSTEM_PROMPT,
          useSearch: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signal audit failed.');

      const parsed = extractJsonObject(data.text);
      setSignalReport({
        claim: parsed.claim || query,
        verdict: parsed.verdict || 'Nuanced / Context Needed',
        confidence: parsed.confidence || 82,
        spokenSummary: parsed.spokenSummary || 'Audit complete. Review the denominator and dependency chain.',
        denominatorCheck: parsed.denominatorCheck || 'Verify baseline sample size and timeframe.',
        dependencyChain: Array.isArray(parsed.dependencyChain) ? parsed.dependencyChain : [],
        receiptNote: parsed.receiptNote || parsed.spokenSummary || query,
        sources: Array.isArray(parsed.sources) ? parsed.sources : []
      });
      setDrawerOpen(true);

      const spoken =
        parsed.spokenSummary || 'Your Signal audit is ready. Open the receipt drawer to inspect the sources.';
      setCopilotMessages((prev) => [...prev, { role: 'assistant', text: spoken }]);
      await speakResponse(spoken);
    } catch (err) {
      setStatus('idle');
      const msg = err.message || 'Something interrupted that thought. Try again.';
      setErrorBanner(msg);
      setCopilotMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `I hit a quick snag: ${msg}` }
      ]);
    }
  };

  const copyReceipt = () => {
    const receiptText = `Touchmark Signal Receipt\nClaim: ${signalReport.claim}\nVerdict: ${signalReport.verdict} (${signalReport.confidence}% confidence)\nDenominator Check: ${signalReport.denominatorCheck}\nSummary: ${signalReport.receiptNote}`;
    navigator.clipboard?.writeText(receiptText);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-stone-100 font-sans selection:bg-amber-400/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0c0b0a]/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <TouchmarkLogo className="w-7 h-7 text-amber-300" />
            <div>
              <span className="font-semibold tracking-tight text-stone-100">Touchmark</span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                Sanctuary
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-900/90 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setMode('pulse')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === 'pulse'
                  ? 'bg-emerald-400/15 text-emerald-200 border border-emerald-400/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Pulse
            </button>
            <button
              type="button"
              onClick={() => setMode('signal')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === 'signal'
                  ? 'bg-amber-400/15 text-amber-200 border border-amber-400/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Signal
            </button>
          </div>

          {/* Voice Selector & Mute */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Select voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="hidden md:block bg-stone-900 border border-white/10 rounded-full px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-300/50"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              aria-label={voiceEnabled ? 'Mute voice' : 'Unmute voice'}
              className="p-2 rounded-full bg-stone-900 border border-white/10 text-stone-300 hover:text-amber-200 transition-colors"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {errorBanner && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-red-950/50 border border-red-400/30 text-sm text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorBanner}</span>
            </div>
            <button type="button" onClick={() => setErrorBanner('')} className="text-red-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Voice Orb + Conversational Copilot */}
        <section className="rounded-3xl bg-stone-900/50 border border-white/10 p-6 sm:p-8 flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-400 mb-4">
            {mode === 'pulse'
              ? 'Touchmark Pulse · Relational & Decision Discernment'
              : 'Touchmark Signal · Epistemic Claim & Denominator Audit'}
          </p>

          <ResonanceOrb status={status} mode={mode} onClick={toggleListening} />

          {/* Copilot Dialogue Strip */}
          <div className="w-full max-w-2xl mt-6 space-y-2.5 text-left">
            {copilotMessages.slice(-3).map((msg, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-800/80 text-stone-200 ml-8 border border-white/5'
                    : 'bg-stone-950/70 text-amber-100/90 mr-8 border border-amber-300/15'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-1">
                  {msg.role === 'user' ? 'You' : 'Touchmark Copilot'}
                </span>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Text Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmission();
            }}
            className="w-full max-w-2xl mt-5 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'pulse'
                  ? 'Say hello, or share a decision or tension you are navigating...'
                  : 'Say hello, or paste a headline, stat, or claim to audit...'
              }
              className="flex-1 bg-stone-950/90 border border-white/10 rounded-full px-5 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-300/40"
            />
            <button
              type="submit"
              disabled={status === 'thinking' || !inputText.trim()}
              className="px-5 py-3 rounded-full bg-amber-300 text-stone-950 font-medium text-sm hover:bg-amber-200 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <span>{status === 'thinking' ? 'Thinking...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* Active Artifact View */}
        {mode === 'pulse' ? (
          <section className="rounded-3xl bg-stone-900/40 border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                  Pulse Discernment Ledger
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-100 mt-1">
                  {pulseLedger.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => speakResponse(pulseLedger.spokenReflection)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 border border-white/10"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                Listen to Reflection
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-stone-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
                  <Scale className="w-3.5 h-3.5 text-emerald-300" />
                  Core Tension
                </div>
                <p className="text-sm text-stone-200 leading-relaxed">{pulseLedger.coreTension}</p>
              </div>
              <div className="p-5 rounded-2xl bg-stone-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Hidden Assumption
                </div>
                <p className="text-sm text-stone-200 leading-relaxed">{pulseLedger.hiddenAssumption}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-stone-400">
                Three Grounded Paths Forward
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {pulseLedger.options?.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-stone-950/70 border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <span className="text-xs font-mono text-emerald-300">0{idx + 1}</span>
                      <h4 className="font-medium text-stone-100 mt-1">{opt.label}</h4>
                      <p className="text-sm text-stone-300 mt-2 leading-relaxed">{opt.stance}</p>
                    </div>
                    <div className="pt-3 border-t border-white/5 text-xs text-stone-400">
                      <span className="text-stone-500 uppercase tracking-wider block mb-0.5">
                        Trade-off
                      </span>
                      {opt.tradeoff}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl bg-stone-900/40 border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-amber-300/80">
                  Signal Epistemic Audit
                </span>
                <h2 className="text-xl font-semibold text-stone-100 mt-1">“{signalReport.claim}”</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs font-medium text-amber-200">
                  {signalReport.verdict} · {signalReport.confidence}%
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 border border-white/10 flex items-center gap-1"
                >
                  Receipt Card
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-stone-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
                  <Layers className="w-3.5 h-3.5 text-amber-300" />
                  Denominator & Baseline Check
                </div>
                <p className="text-sm text-stone-200 leading-relaxed">{signalReport.denominatorCheck}</p>
              </div>
              <div className="p-5 rounded-2xl bg-stone-950/60 border border-white/5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-400 mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                  Dependency Chain
                </div>
                <ol className="space-y-1.5 text-sm text-stone-300 list-decimal list-inside">
                  {signalReport.dependencyChain?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Signal Receipt Slide-Over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-stone-950 border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                  Creator Receipt Card
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-stone-900 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/90 border border-amber-300/20 space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>TOUCHMARK SIGNAL</span>
                  <span className="text-amber-300 font-medium">{signalReport.verdict}</span>
                </div>
                <p className="text-sm font-medium text-stone-100">“{signalReport.claim}”</p>
                <p className="text-xs text-stone-300 leading-relaxed">{signalReport.receiptNote}</p>
              </div>

              {signalReport.sources?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-[0.18em] text-stone-400">
                    Reference Grounding
                  </h4>
                  {signalReport.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-white/5 hover:border-amber-300/30 text-xs text-stone-200"
                    >
                      <span className="truncate pr-2">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={copyReceipt}
              className="mt-6 w-full py-3 rounded-full bg-amber-300 text-stone-950 font-medium text-sm hover:bg-amber-200 flex items-center justify-center gap-2"
            >
              {copiedReceipt ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Receipt Copied
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Copy Citable Receipt
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
