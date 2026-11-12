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

// --- 3D MORPHING SPHERICAL RESONANCE ORB ---
function MorphingSphereOrb({ status, mode, onClick }) {
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';

  const palette =
    mode === 'signal'
      ? {
          aura: 'radial-gradient(circle at 35% 30%, rgba(251,191,36,0.42), rgba(217,119,6,0.18) 55%, transparent 75%)',
          sphere:
            'radial-gradient(circle at 32% 28%, rgba(254,243,199,0.55) 0%, rgba(245,158,11,0.38) 32%, rgba(120,53,15,0.65) 72%, rgba(12,10,9,0.96) 100%)',
          rim: 'rgba(251,191,36,0.45)'
        }
      : {
          aura: 'radial-gradient(circle at 35% 30%, rgba(52,211,153,0.38), rgba(20,184,166,0.16) 55%, transparent 75%)',
          sphere:
            'radial-gradient(circle at 32% 28%, rgba(209,250,229,0.55) 0%, rgba(16,185,129,0.36) 32%, rgba(6,78,59,0.68) 72%, rgba(12,10,9,0.96) 100%)',
          rim: 'rgba(52,211,153,0.45)'
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
          50% { border-radius: 42% 58% 45% 55% / 56% 42% 58% 44%; transform: scale(1.11); }
        }
        .orb-organic {
          animation: touchmarkMorph 11s ease-in-out infinite;
        }
        .orb-active {
          animation: touchmarkPulseFast 2.4s ease-in-out infinite;
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        aria-label={isListening ? 'Stop listening' : 'Tap sphere to speak'}
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center focus:outline-none group cursor-pointer"
      >
        {/* Ambient outer halo */}
        <div
          style={{ background: palette.aura }}
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
            isListening || isSpeaking || isThinking ? 'opacity-100 scale-115' : 'opacity-70 group-hover:opacity-95'
          }`}
        />

        {/* Secondary morphing liquid membrane */}
        <div
          style={{
            border: `1px solid ${palette.rim}`,
            boxShadow: `inset 0 0 40px ${palette.rim}`
          }}
          className={`absolute w-52 h-52 sm:w-56 sm:h-56 opacity-45 transition-all duration-500 ${
            isListening || isSpeaking ? 'orb-active' : 'orb-organic'
          }`}
        />

        {/* Primary 3D Sculpted Morphing Sphere */}
        <div
          style={{
            background: palette.sphere,
            boxShadow: `inset -18px -22px 38px rgba(0,0,0,0.82), inset 10px 12px 24px rgba(255,255,255,0.22), 0 24px 60px rgba(0,0,0,0.75)`
          }}
          className={`relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center transition-transform duration-500 ${
            isListening || isSpeaking || isThinking ? 'orb-active' : 'orb-organic group-hover:scale-[1.03]'
          }`}
        >
          {/* Specular 3D highlight */}
          <div className="absolute top-6 left-8 w-16 h-10 rounded-full bg-white/20 blur-md -rotate-25 pointer-events-none" />

          {/* Subtle center state cue */}
          <div className="relative z-10 flex flex-col items-center text-stone-100/85">
            {isListening && <Mic className="w-6 h-6 text-amber-200 animate-pulse" />}
            {isThinking && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping" />
            )}
            {isSpeaking && <Volume2 className="w-6 h-6 text-amber-100 animate-pulse" />}
          </div>
        </div>
      </button>

      <span className="mt-2 text-[11px] uppercase tracking-[0.26em] text-stone-500">
        {isListening
          ? 'Listening…'
          : isThinking
          ? 'Discerning…'
          : isSpeaking
          ? 'Speaking'
          : 'Tap sphere to speak'}
      </span>
    </div>
  );
}

// --- PROMPTS & SCHEMAS ---
const PULSE_SYSTEM_PROMPT = `You are Touchmark Pulse, a calm, perceptive relational and decision discernment sanctuary.
Given a user's situation or tension, distill the core tension, name the hidden assumption, offer 3 grounded strategic paths with trade-offs, and provide a warm 2-sentence spoken reflection.`;

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

const SIGNAL_SYSTEM_PROMPT = `You are Touchmark Signal, an epistemic discernment and institutional-power anomaly engine.
When analyzing a public event, legal case, or controversial claim:
1. Establish the verified baseline facts accurately without inventing rumors.
2. Also evaluate the "Constellation Rarity & Convergence" lens: articulate why sharp observers notice unusual timing, power asymmetries, institutional pressure, or evidentiary gaps—without making unverified accusations.
3. Return valid JSON ONLY with these exact keys:
{
  "claim": "Concise framing of the event or claim",
  "verdict": "Supported | Nuanced / Contested | High Convergence Anomaly | Unsubstantiated",
  "evidentiaryScore": 75,
  "convergenceRarityScore": 78,
  "spokenSummary": "Warm, measured 2-3 sentence spoken reflection honoring both the official record and what feels unusual beneath the surface",
  "denominatorCheck": "Baseline context, evidentiary standards, and what is missing from surface headlines",
  "convergenceHypothesis": "Steel-manned articulation of the institutional-power / timing anomaly lens (why observers suspect coordinated pressure or selective enforcement)",
  "mundaneCounterweight": "Strongest non-conspiratorial explanation for the same pattern",
  "receiptNote": "Balanced, citable creator summary",
  "sources": [{ "title": "Source title", "url": "https://..." }]
}`;

const VOICE_OPTIONS = [
  { id: 'Aoede', label: 'Aoede' },
  { id: 'Sulafat', label: 'Sulafat' },
  { id: 'Charon', label: 'Charon' },
  { id: 'Kore', label: 'Kore' }
];

// --- HELPER: Convert Base64 Linear16 PCM (24kHz) to playable WAV URL ---
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

export default function TouchmarkToolsApp() {
  const [mode, setMode] = useState('pulse'); // 'pulse' | 'signal'
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Aoede');
  const [errorBanner, setErrorBanner] = useState('');

  // Single concise spoken subtitle under the orb (keeps the screen ultra-clean)
  const [activeCaption, setActiveCaption] = useState(
    'I’m here. Say hello to test your mic, or share what you’re discerning.'
  );
  const [history, setHistory] = useState([]);

  // Slide-over Drawer for full structured breakdown
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasArtifact, setHasArtifact] = useState(false);
  const [pulseLedger, setPulseLedger] = useState(null);
  const [signalReport, setSignalReport] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

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
        if (!res.ok) throw new Error(data.error || 'Connection interrupted.');

        const reply = data.reply || "I hear you clearly. What's on your mind?";
        setActiveCaption(reply);
        setHistory((prev) => [...prev, { role: 'assistant', text: reply }]);
        await speakResponse(reply);
        return;
      }

      // 2. Pulse Decision Discernment
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
        setHasArtifact(true);
        const reflection = parsed.spokenReflection || 'Here is what stands out beneath the surface.';
        setActiveCaption(reflection);
        setHistory((prev) => [...prev, { role: 'assistant', text: reflection }]);
        await speakResponse(reflection);
        return;
      }

      // 3. Signal Epistemic & Convergence Audit
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze',
          prompt: `Examine this event, case, or claim thoroughly using both the verified record and the institutional-power / convergence rarity lens: "${query}"`,
          systemInstruction: SIGNAL_SYSTEM_PROMPT,
          useSearch: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signal audit failed.');

      const parsed = extractJsonObject(data.text);
      setSignalReport({
        claim: parsed.claim || query,
        verdict: parsed.verdict || 'Nuanced / Contested',
        evidentiaryScore: parsed.evidentiaryScore ?? 72,
        convergenceRarityScore: parsed.convergenceRarityScore ?? 76,
        spokenSummary: parsed.spokenSummary || 'Audit complete. Open the dossier to inspect both lenses.',
        denominatorCheck: parsed.denominatorCheck || '',
        convergenceHypothesis: parsed.convergenceHypothesis || '',
        mundaneCounterweight: parsed.mundaneCounterweight || '',
        receiptNote: parsed.receiptNote || parsed.spokenSummary || query,
        sources: Array.isArray(parsed.sources) ? parsed.sources : []
      });
      setHasArtifact(true);
      const spoken = parsed.spokenSummary || 'Your Signal dossier is ready.';
      setActiveCaption(spoken);
      setHistory((prev) => [...prev, { role: 'assistant', text: spoken }]);
      await speakResponse(spoken);
    } catch (err) {
      setStatus('idle');
      setErrorBanner(err.message || 'Something interrupted that thought. Try again.');
    }
  };

  const copyReceipt = () => {
    if (!signalReport) return;
    const text = `Touchmark Signal Dossier\nSubject: ${signalReport.claim}\nVerdict: ${signalReport.verdict}\nEvidentiary Record: ${signalReport.evidentiaryScore}/100 | Convergence Rarity: ${signalReport.convergenceRarityScore}/100\nSummary: ${signalReport.receiptNote}`;
    navigator.clipboard?.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090807] text-stone-100 flex flex-col justify-between selection:bg-amber-400/30">
      {/* Ultra-minimal Top Bar */}
      <header className="px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-stone-300">
          <TouchmarkLogo className="w-6 h-6 text-amber-300/90" />
          <span className="text-sm font-medium tracking-wide">Touchmark</span>
        </div>

        {/* Minimal Mode Pill */}
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
              if (voiceEnabled) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            aria-label="Toggle voice"
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

      {/* Center Sanctuary: Morphing 3D Orb + Single Poetic Subtitle */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full">
        {errorBanner && (
          <div className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/60 border border-red-400/30 text-xs text-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        <MorphingSphereOrb status={status} mode={mode} onClick={toggleListening} />

        {/* Single calm spoken subtitle */}
        <p className="mt-8 text-base sm:text-lg font-light text-stone-200/90 leading-relaxed max-w-xl">
          {activeCaption}
        </p>

        {hasArtifact && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mt-4 text-xs uppercase tracking-[0.2em] text-amber-300/80 hover:text-amber-200 transition-colors"
          >
            Inspect Full Breakdown →
          </button>
        )}
      </main>

      {/* Whisper-quiet Bottom Input Bar */}
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
                ? 'Speak to the orb, or type a tension…'
                : 'Speak to the orb, or test a public narrative…'
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

      {/* Slide-Over Dossier Drawer (All Depth Lives Here) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#11100e] border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {mode === 'pulse' && pulseLedger ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Pulse Discernment
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

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-300">
                    <Scale className="w-3.5 h-3.5" />
                    Core Tension
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">{pulseLedger.coreTension}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    Hidden Assumption
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">{pulseLedger.hiddenAssumption}</p>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500">
                    Three Grounded Paths
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
              </div>
            ) : mode === 'signal' && signalReport ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-300">
                    Signal Epistemic & Convergence Dossier
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-xs text-amber-200 mb-2">
                    {signalReport.verdict}
                  </span>
                  <h2 className="text-lg font-medium text-stone-100">“{signalReport.claim}”</h2>
                </div>

                {/* Dual-Lens Gauges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                      Official Record Strength
                    </span>
                    <span className="text-2xl font-semibold text-stone-100 mt-1 block">
                      {signalReport.evidentiaryScore}
                      <span className="text-xs text-stone-500">/100</span>
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-400/[0.06] border border-amber-400/20">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300/90 block">
                      Convergence Rarity Index
                    </span>
                    <span className="text-2xl font-semibold text-amber-200 mt-1 block">
                      {signalReport.convergenceRarityScore}
                      <span className="text-xs text-amber-300/60">/100</span>
                    </span>
                  </div>
                </div>

                {/* Convergence & Institutional Power Lens */}
                {signalReport.convergenceHypothesis && (
                  <div className="p-4 rounded-2xl bg-amber-400/[0.05] border border-amber-300/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Convergence & Power-Asymmetry Lens
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {signalReport.convergenceHypothesis}
                    </p>
                  </div>
                )}

                {/* Mundane / Base-Rate Counterweight */}
                {signalReport.mundaneCounterweight && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                      Base-Rate Counterweight
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {signalReport.mundaneCounterweight}
                    </p>
                  </div>
                )}

                {/* Denominator & Evidentiary Context */}
                {signalReport.denominatorCheck && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
                      Evidentiary & Baseline Context
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {signalReport.denominatorCheck}
                    </p>
                  </div>
                )}

                {signalReport.sources?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                      Reference Grounding
                    </span>
                    {signalReport.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-300/30 text-xs text-stone-300"
                      >
                        <span className="truncate pr-2">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      </a>
                    ))}
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
                      Receipt Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      Copy Balanced Dossier
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
