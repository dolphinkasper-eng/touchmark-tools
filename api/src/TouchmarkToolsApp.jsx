import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  ShieldCheck,
  Compass,
  Send,
  Check,
  ExternalLink,
  RefreshCw,
  Share2,
  BarChart3,
  X,
  GitBranch,
  Mic,
  MicOff,
  Keyboard,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Copy,
  MessageSquareText
} from 'lucide-react';

// ============================================================================
// BRAND SEAL SVG COMPONENT
// ============================================================================
function TouchmarkLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="20" r="18" stroke="#c9a66b" strokeWidth="1.5" strokeOpacity="0.85" />
      <circle cx="20" cy="20" r="13" stroke="#c9a66b" strokeWidth="0.75" strokeOpacity="0.4" />
      <path
        d="M20 6V34M6 20H34"
        stroke="#c9a66b"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3.5" fill="#c9a66b" />
    </svg>
  );
}

// ============================================================================
// 3D RESONANCE ORB VISUALIZER COMPONENT
// ============================================================================
function ResonanceOrb({ voiceState, activeMode, audioLevel, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let phase = 0;

    const render = () => {
      phase += voiceState === "thinking" ? 0.06 : voiceState === "speaking" ? 0.045 : 0.018;
      const dpr = window.devicePixelRatio || 1;
      const size = 260;
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      const primaryRgb = activeMode === "signal" ? "125, 185, 222" : "201, 166, 107";
      const dynamicAmp =
        voiceState === "listening"
          ? 6 + audioLevel * 22
          : voiceState === "speaking"
          ? 7 + Math.abs(Math.sin(phase * 2.2)) * 10
          : voiceState === "thinking"
          ? 5
          : 2.2;

      // Ambient outer aura
      const grad = ctx.createRadialGradient(cx, cy, 24, cx, cy, 118);
      grad.addColorStop(0, `rgba(${primaryRgb}, 0.28)`);
      grad.addColorStop(0.55, `rgba(${primaryRgb}, 0.08)`);
      grad.addColorStop(1, `rgba(${primaryRgb}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 118, 0, Math.PI * 2);
      ctx.fill();

      // 3D wireframe resonance rings
      const rings = 5;
      for (let r = 0; r < rings; r++) {
        const ringOffset = (r / rings) * Math.PI;
        ctx.beginPath();
        const points = 96;
        for (let i = 0; i <= points; i++) {
          const theta = (i / points) * Math.PI * 2;
          const wave =
            Math.sin(theta * (3 + r) + phase + ringOffset) * dynamicAmp * 0.45 +
            Math.cos(theta * 2 - phase * 1.3) * dynamicAmp * 0.35;
          const radius = 64 + r * 4 + wave;
          const x = cx + Math.cos(theta) * radius;
          const y = cy + Math.sin(theta) * radius * (0.86 + Math.sin(phase + r) * 0.08);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${primaryRgb}, ${0.22 + (r / rings) * 0.42})`;
        ctx.lineWidth = r === rings - 1 ? 1.6 : 1;
        ctx.stroke();
      }

      // Inner luminous core
      const coreGrad = ctx.createRadialGradient(cx - 10, cy - 10, 4, cx, cy, 46);
      coreGrad.addColorStop(0, `rgba(255, 250, 240, 0.85)`);
      coreGrad.addColorStop(0.45, `rgba(${primaryRgb}, 0.55)`);
      coreGrad.addColorStop(1, `rgba(${primaryRgb}, 0.05)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 46 + Math.sin(phase) * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [voiceState, activeMode, audioLevel]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Activate or pause voice resonance"
      className="relative w-[260px] h-[260px] rounded-full flex items-center justify-center focus:outline-none group cursor-pointer"
    >
      <canvas ref={canvasRef} className="w-[260px] h-[260px] transition-transform duration-500 group-hover:scale-[1.03]" />
    </button>
  );
}

// ============================================================================
// PROMPTS, SCHEMAS & INITIAL STATE
// ============================================================================
const WELCOME_PROMPT =
  "Welcome to Touchmark. Are you looking to make sense of a personal relationship with Pulse, or examine a public claim or story with Signal today?";

const PULSE_SYSTEM_PROMPT = `
You are Touchmark Pulse, a calm, non-judgmental Relational Intelligence discernment guide.
CORE RULES:
1. ANTI-SYCOPHANCY & SAFETY: Honor the user's emotional experience without validating unverified assumptions about another person's motives or diagnosing third parties. Never encourage direct confrontation if coercive control, intimidation, or retaliation risk is present.
2. 4-LAYER EXPERIENTIAL SEPARATION: Separate Observed (recorded/directly witnessed), Reported (user's memory), Interpreted (stories/motives assigned), and Experienced (somatic/emotional impact).
3. PATTERN VS. CAUSE: Distinguish an established behavioral pattern from unknown internal motives. Repeated broken agreements justify boundaries without proving intent.
4. ASYMMETRIC RESPONSIBILITY: Mutual influence never implies equal power, equal responsibility, or equal harm.
5. SITUATIONAL SKILL CURVE: Apply (1. Unconscious, 2. Aware, 3. Integrating, 4. Embodied) strictly to specific situational skills, never as a global person-rating.
6. CONDITIONAL COMPASS: End with a clear, proportionate next step and a Stopping Rule (Resolved for Now | Open | Reopened).
Keep spoken replies warm, concise (2-4 sentences), and conversational.
`;

const PULSE_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    currentStage: { type: "STRING" },
    safetyStatus: { type: "STRING" },
    fourLayers: {
      type: "OBJECT",
      properties: {
        observed: { type: "ARRAY", items: { type: "STRING" } },
        reported: { type: "ARRAY", items: { type: "STRING" } },
        interpreted: { type: "ARRAY", items: { type: "STRING" } },
        experienced: { type: "ARRAY", items: { type: "STRING" } }
      }
    },
    patternVsCause: {
      type: "OBJECT",
      properties: {
        observablePattern: { type: "STRING" },
        unknownCauseOrIntent: { type: "STRING" }
      }
    },
    processHypothesis: { type: "STRING" },
    skillCurve: {
      type: "OBJECT",
      properties: {
        skill: { type: "STRING" },
        stage: { type: "STRING" }
      }
    },
    compassGuidance: {
      type: "OBJECT",
      properties: {
        decisionState: { type: "STRING" },
        nextResponsibleStep: { type: "STRING" },
        stoppingRule: { type: "STRING" }
      }
    }
  },
  required: ["reply", "currentStage", "fourLayers", "patternVsCause", "skillCurve", "compassGuidance"]
};

const SIGNAL_SYSTEM_PROMPT = `
You are Touchmark Signal, an empirical discernment and evidence-auditing engine governed by the Touchmark Integrity Standard v2.1.
CORE RULES:
1. ANTI-SYCOPHANCY & PROPORTIONATE WEIGHING: Never manufacture false 50/50 balance when evidence is overwhelming, and never treat financial conflicts of interest as automatic proof of falsehood.
2. CLAIM-LEVEL DEPENDENCY MAPPING: Decompose claims into Premise -> Unstated Assumption -> Headline Conclusion so users see where logic holds or breaks.
3. STRICT EPISTEMIC QUARANTINE FOR SOCIAL DISCOURSE: Search and summarize independent commentary on Substack, Medium, and Reddit so users know what people are saying, but NEVER allow social/blog commentary to alter the formal evidenceStatus.
4. CALIBRATED UNCERTAINTY: Assign evidenceStatus strictly from: Well Supported | Partially Supported | Contested | Insufficient Evidence | Contradicted | Not Yet Verified. Never invent uncalibrated percentage confidence scores.
5. QUANTITATIVE RIGOR: Always distinguish relative vs. absolute risk/effect sizes with denominators and timeframes.
`;

const INITIAL_PULSE_LEDGER = {
  currentStage: "Phase 0 · Grounding & Intake",
  safetyStatus: "Standard Reflection",
  fourLayers: {
    observed: [],
    reported: [],
    interpreted: [],
    experienced: []
  },
  patternVsCause: {
    observablePattern: "Awaiting specific interaction details...",
    unknownCauseOrIntent: "Internal motives remain unverified until observed over time."
  },
  processHypothesis: "Listening for perceptual filters without labeling.",
  skillCurve: {
    skill: "Observation vs. Story Separation",
    stage: "2. Aware"
  },
  compassGuidance: {
    decisionState: "Open",
    nextResponsibleStep: "Share one specific moment or interaction that stood out to you.",
    stoppingRule: "Open — gathering initial ground truth before choosing an action."
  }
};

const SAMPLE_SIGNAL_REPORT = {
  title: "Sample Audit: Relative vs. Absolute Risk Framing in Headline Trials",
  spokenSummary:
    "This sample shows how a headline can highlight a 42% relative risk reduction while the underlying absolute risk drops by 0.8 percentage points. Open the ledger to inspect the dependency chain and creator receipt card.",
  assessmentMeta: {
    assessedDate: "2026-11-11",
    version: "v2.1 · Sample Baseline",
    freshnessStatus: "Current"
  },
  claimClassification: "2. Quantitative / Statistical",
  evidenceStatus: "Partially Supported",
  verdictSummary:
    "The underlying relative risk reduction is mathematically accurate within the studied cohort, but omitting the low baseline event rate exaggerates practical individual benefit.",
  creatorHook:
    "While relative risk dropped 42.1%, absolute risk moved from 1.9% to 1.1% (0.8 percentage points) over 24 months—meaning roughly 125 people need treatment to prevent 1 event.",
  verificationCoverage: {
    checked: "Primary trial registry endpoints, statistical abstract, and baseline control event rates.",
    unavailable: "Individual patient-level raw datasets (paywalled)."
  },
  dependencyChain: [
    {
      step: "1. Statistical Premise",
      statement: "Event incidence fell from 1.9% in control to 1.1% in the treatment arm.",
      status: "Well Supported",
      linkNote: "Holds: Directly verified in primary outcome tables."
    },
    {
      step: "2. Framing Transformation",
      statement: "Expressed as a 42.1% relative reduction without baseline denominator context.",
      status: "Partially Supported",
      linkNote: "Qualifies: Mathematically valid ratio, but omits absolute scale."
    },
    {
      step: "3. Headline Conclusion",
      statement: "Implies nearly half of all users will avoid the condition.",
      status: "Contradicted",
      linkNote: "Breaks: Conflates relative risk reduction with absolute baseline probability."
    }
  ],
  publicDiscourse: {
    quarantineNotice: "Context only — social & independent commentary never alters formal Evidence Status.",
    substackAndMedium:
      "Independent biostatistics writers on Substack highlight the Number Needed to Treat (NNT ~125) and question whether subgroup benefits justify broad population rollout.",
    redditCommunities:
      "Discussions in r/science and r/medicine focus on real-world adherence, out-of-pocket cost vs. modest absolute benefit, and long-term tolerability.",
    recurringQuestions: [
      "How does the absolute benefit change for high-risk vs. low-risk baseline groups?",
      "Were adverse event rates reported using absolute or relative figures?"
    ]
  },
  visualMetrics: {
    chartEligible: true,
    chartTitle: "Relative vs. Absolute Risk Reduction (24-Month Cohort)",
    subtitle: "Control baseline 1.9% vs. Treatment 1.1%",
    bars: [
      { label: "Headline Relative Reduction", value: 42.1, displayValue: "42.1%", tone: "amber" },
      { label: "Actual Absolute Reduction", value: 0.8, displayValue: "0.8 pp", tone: "emerald" }
    ]
  },
  compassGuidance: {
    decisionState: "Resolved for Now",
    whatIsKnown: "Both relative and absolute effect sizes are clear enough to evaluate practical magnitude.",
    nextResponsibleStep:
      "Compare the 0.8% absolute risk reduction against baseline personal risk and cost with a qualified clinician.",
    stoppingRule: "Resolved for Now — additional headline reading will not change the underlying trial math.",
    reopenTriggers: ["Publication of 5-year follow-up or independent replication cohort."]
  },
  registryLinks: [
    { name: "ClinicalTrials.gov", url: "https://clinicaltrials.gov/" },
    { name: "PubPeer", url: "https://pubpeer.com/" },
    { name: "Substack Search", url: "https://substack.com/search/relative%20vs%20absolute%20risk" },
    { name: "Reddit Search", url: "https://www.reddit.com/search/?q=relative%20vs%20absolute%20risk" }
  ]
};

// ============================================================================
// HELPER: EXPONENTIAL BACKOFF FETCH FOR SECURE VERCEL PROXY (/api/discern)
// ============================================================================
async function fetchGeminiWithRetry(payload, maxRetries = 4) {
  let delay = 1000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("/api/discern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload })
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

function getStatusBadgeStyle(status) {
  switch (status) {
    case "Well Supported":
      return "bg-emerald-950/70 text-emerald-300 border-emerald-700/60";
    case "Partially Supported":
      return "bg-amber-950/70 text-amber-300 border-amber-700/60";
    case "Contested":
      return "bg-sky-950/70 text-sky-300 border-sky-700/60";
    case "Contradicted":
      return "bg-rose-950/70 text-rose-300 border-rose-700/60";
    default:
      return "bg-slate-800/80 text-slate-300 border-slate-600/60";
  }
}

function getBarColorClass(tone) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-400";
    case "amber":
      return "bg-amber-400";
    case "blue":
      return "bg-sky-400";
    default:
      return "bg-[#c9a66b]";
  }
}

// ============================================================================
// MAIN VOICE-FIRST SANCTUARY APPLICATION
// ============================================================================
export default function App() {
  const [activeMode, setActiveMode] = useState("neutral");

  const [voiceState, setVoiceState] = useState("idle");
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [spokenCaption, setSpokenCaption] = useState(WELCOME_PROMPT);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const [showTypeBar, setShowTypeBar] = useState(false);
  const [typedInput, setTypedInput] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [customReceiptTakeaway, setCustomReceiptTakeaway] = useState("");
  const [copiedBrief, setCopiedBrief] = useState(false);

  const [pulseHistory, setPulseHistory] = useState([]);
  const [pulseLedger, setPulseLedger] = useState(INITIAL_PULSE_LEDGER);
  const [activeLayerTab, setActiveLayerTab] = useState("observed");
  const [signalReport, setSignalReport] = useState(SAMPLE_SIGNAL_REPORT);
  const [hasRunSignalAudit, setHasRunSignalAudit] = useState(false);

  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafAudioRef = useRef(null);
  const activeModeRef = useRef(activeMode);
  activeModeRef.current = activeMode;

  useEffect(() => {
    if (signalReport) {
      setCustomReceiptTakeaway(signalReport.creatorHook || signalReport.verdictSummary || "");
    }
  }, [signalReport]);

  // ---------------- SPEECH SYNTHESIS ----------------
  const speakText = useCallback(
    (text) => {
      setSpokenCaption(text);
      if (audioMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        setVoiceState("idle");
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Samantha") ||
                v.name.includes("Daniel") ||
                v.name.includes("Google UK English Female") ||
                v.name.includes("Natural"))
          ) || voices.find((v) => v.lang.startsWith("en"));

        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 0.96;
        utterance.pitch = 0.98;

        utterance.onstart = () => setVoiceState("speaking");
        utterance.onend = () => setVoiceState("idle");
        utterance.onerror = () => setVoiceState("idle");

        window.speechSynthesis.speak(utterance);
      } catch {
        setVoiceState("idle");
      }
    },
    [audioMuted]
  );

  const stopAudioMeter = useCallback(() => {
    if (rafAudioRef.current) cancelAnimationFrame(rafAudioRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    return () => {
      stopAudioMeter();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopAudioMeter]);

  // ---------------- INTENT DETECTION & ENGINE ROUTING ----------------
  const detectIntentMode = (utterance, currentMode) => {
    const lower = utterance.toLowerCase();
    const signalKeywords = [
      "signal",
      "study",
      "trial",
      "nct",
      "claim",
      "news",
      "headline",
      "article",
      "evidence",
      "statistic",
      "video",
      "source",
      "fact",
      "research",
      "media",
      "substack",
      "reddit",
      "medium"
    ];
    const pulseKeywords = [
      "pulse",
      "relationship",
      "partner",
      "friend",
      "family",
      "feel",
      "boundary",
      "argument",
      "trust",
      "personal",
      "conversation",
      "hurt",
      "pattern"
    ];

    const hasSignal = signalKeywords.some((k) => lower.includes(k));
    const hasPulse = pulseKeywords.some((k) => lower.includes(k));

    if (hasSignal && !hasPulse) return "signal";
    if (hasPulse && !hasSignal) return "pulse";
    return currentMode === "neutral" ? "pulse" : currentMode;
  };

  // ---------------- PROCESS USER UTTERANCE ----------------
  const handleUserUtterance = async (rawText) => {
    const clean = rawText.trim();
    if (!clean) return;

    setLiveTranscript("");
    setVoiceState("thinking");

    const routedMode = detectIntentMode(clean, activeModeRef.current);
    setActiveMode(routedMode);

    if (
      clean.toLowerCase() === "pulse" ||
      clean.toLowerCase() === "touchmark pulse" ||
      clean.toLowerCase() === "use pulse"
    ) {
      speakText(
        "We're in Touchmark Pulse. Take a breath—what's happening in your relationship or interaction that you'd like to make sense of?"
      );
      return;
    }

    if (
      clean.toLowerCase() === "signal" ||
      clean.toLowerCase() === "touchmark signal" ||
      clean.toLowerCase() === "use signal"
    ) {
      speakText(
        "We're in Touchmark Signal. Tell me the claim, headline, study, or viral story you want to examine."
      );
      return;
    }

    if (routedMode === "signal") {
      await executeSignalVoiceAudit(clean);
    } else {
      await executePulseVoiceTurn(clean);
    }
  };

  // ---------------- PULSE TURN EXECUTION ----------------
  const executePulseVoiceTurn = async (userText) => {
    const nextHistory = [...pulseHistory, { role: "user", text: userText }];
    setPulseHistory(nextHistory);

    try {
      const contents = nextHistory.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      const payload = {
        contents,
        systemInstruction: { parts: [{ text: PULSE_SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.55,
          responseMimeType: "application/json",
          responseSchema: PULSE_RESPONSE_SCHEMA
        }
      };

      const data = await fetchGeminiWithRetry(payload);
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const parsed = JSON.parse(rawText);

      const replyText =
        parsed.reply ||
        "Let's slow down and separate what was directly observed from how it landed in you. What specific moment stood out most?";

      setPulseHistory((prev) => [...prev, { role: "assistant", text: replyText }]);
      setPulseLedger((prev) => ({
        currentStage: parsed.currentStage || prev.currentStage,
        safetyStatus: parsed.safetyStatus || prev.safetyStatus,
        fourLayers: {
          observed:
            parsed.fourLayers?.observed?.length > 0
              ? parsed.fourLayers.observed
              : prev.fourLayers.observed,
          reported:
            parsed.fourLayers?.reported?.length > 0
              ? parsed.fourLayers.reported
              : prev.fourLayers.reported,
          interpreted:
            parsed.fourLayers?.interpreted?.length > 0
              ? parsed.fourLayers.interpreted
              : prev.fourLayers.interpreted,
          experienced:
            parsed.fourLayers?.experienced?.length > 0
              ? parsed.fourLayers.experienced
              : prev.fourLayers.experienced
        },
        patternVsCause: parsed.patternVsCause || prev.patternVsCause,
        processHypothesis: parsed.processHypothesis || prev.processHypothesis,
        skillCurve: parsed.skillCurve || prev.skillCurve,
        compassGuidance: parsed.compassGuidance || prev.compassGuidance
      }));

      speakText(replyText);
    } catch {
      speakText(
        "I had a brief interruption reaching the discernment engine. Tell me that one more time whenever you're ready."
      );
    }
  };

  // ---------------- SIGNAL AUDIT EXECUTION ----------------
  const executeSignalVoiceAudit = async (queryText) => {
    try {
      const todayIso = new Date().toISOString().split("T")[0];
      const encodedQuery = encodeURIComponent(queryText.slice(0, 80));
      const prompt = `
Current Assessment Date: ${todayIso}
Claim / Study / Story to Audit: "${queryText}"

Search primary records AND independent commentary across Substack, Medium, and Reddit so the user understands both the primary evidence and what people are currently saying. Remember: Substack, Medium, and Reddit commentary MUST NEVER change the formal evidenceStatus.

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "Concise forensic audit title",
  "spokenSummary": "2-3 natural spoken sentences summarizing Evidence Status, key denominators/assumptions, public discourse themes, and what to do next.",
  "assessmentMeta": {
    "assessedDate": "${todayIso}",
    "version": "v2.1 · Live Audit",
    "freshnessStatus": "Current"
  },
  "claimClassification": "1. Descriptive / Historical | 2. Quantitative / Statistical | 3. Causal | 4. Predictive | 5. Intentional / Motivational | 6. Normative / Ethical | 7. Interpretive / Rhetorical | 8. Mixed / Compound",
  "evidenceStatus": "Well Supported | Partially Supported | Contested | Insufficient Evidence | Contradicted | Not Yet Verified",
  "verdictSummary": "2-sentence calibrated summary distinguishing what is known from what remains uncertain",
  "creatorHook": "1-sentence accurate takeaway retaining denominators, sample size, timeframe, and qualifications",
  "verificationCoverage": {
    "checked": "Specific primary records examined",
    "unavailable": "Explicit coverage gaps or unexamined records"
  },
  "dependencyChain": [
    {
      "step": "1. Premise / Statistic",
      "statement": "Foundational assertion",
      "status": "Well Supported | Partially Supported | Contested | Insufficient Evidence | Contradicted | Not Yet Verified",
      "linkNote": "Where this link holds or breaks"
    }
  ],
  "argumentAndOmissions": {
    "unstatedAssumptions": ["Assumption required"],
    "omissionsAndFraming": ["Missing comparison group or omitted context"]
  },
  "publicDiscourse": {
    "quarantineNotice": "Context only — social & independent commentary never alters formal Evidence Status.",
    "substackAndMedium": "Key independent long-form analyses, statistical teardowns, or critiques circulating on Substack and Medium",
    "redditCommunities": "Key ground-level questions, lived-experience reports, or methodological critiques circulating on Reddit",
    "recurringQuestions": ["Recurring unanswered public question 1", "Recurring unanswered public question 2"]
  },
  "quantitativeProfile": {
    "sampleSize": "N or dataset scope",
    "duration": "Timeframe",
    "baselineRisk": "Control or baseline rate",
    "effectSizes": "Relative vs. Absolute effect sizes, CI, NNT",
    "clinicalVsStatistical": "Statistical vs. practical magnitude"
  },
  "visualMetrics": {
    "chartEligible": true,
    "chartTitle": "Denominator comparison title",
    "subtitle": "Comparison groups and units",
    "bars": [
      { "label": "Metric", "value": 42, "displayValue": "42%", "tone": "amber" }
    ]
  },
  "compassGuidance": {
    "decisionState": "Resolved for Now",
    "whatIsKnown": "What can be acted on right now",
    "nextResponsibleStep": "Proportionate next step",
    "stoppingRule": "Whether additional searching will materially change the decision",
    "reopenTriggers": ["Specific trigger that would reopen this audit"]
  },
  "registryLinks": [
    { "name": "Substack Discourse", "url": "https://substack.com/search/${encodedQuery}" },
    { "name": "Medium Commentary", "url": "https://medium.com/search?q=${encodedQuery}" },
    { "name": "Reddit Discussions", "url": "https://www.reddit.com/search/?q=${encodedQuery}" }
  ]
}`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SIGNAL_SYSTEM_PROMPT }] },
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.25 }
      };

      const data = await fetchGeminiWithRetry(payload);
      let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      raw = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const parsed = JSON.parse(raw);

      setSignalReport(parsed);
      setHasRunSignalAudit(true);
      setDrawerOpen(true);

      speakText(
        parsed.spokenSummary ||
          parsed.verdictSummary ||
          "I've mapped the primary evidence, dependency chain, and current Substack, Medium, and Reddit discourse. You can inspect the full breakdown in the ledger."
      );
    } catch {
      speakText(
        "I couldn't complete a live search for that claim right now. You can also type or paste the exact study details below."
      );
    }
  };

  // ---------------- START / TOGGLE MICROPHONE LISTENING ----------------
  const toggleListening = async () => {
    if (voiceState === "listening") {
      recognitionRef.current?.stop();
      stopAudioMeter();
      setVoiceState("idle");
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      setShowTypeBar(true);
      setSpokenCaption(
        "Voice recognition isn't available in this browser window—type below to talk with Pulse or Signal."
      );
      return;
    }

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMeter = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length / 128;
          setAudioLevel(Math.min(1, avg));
          rafAudioRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }
    } catch {
      // Proceed even if mic visualizer stream is blocked
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalSpoken = "";

    recognition.onstart = () => {
      setVoiceState("listening");
      setLiveTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalSpoken += transcript;
        } else {
          interim += transcript;
        }
      }
      setLiveTranscript(finalSpoken || interim);
    };

    recognition.onerror = () => {
      stopAudioMeter();
      setVoiceState("idle");
      setShowTypeBar(true);
    };

    recognition.onend = () => {
      stopAudioMeter();
      if (finalSpoken.trim()) {
        handleUserUtterance(finalSpoken.trim());
      } else {
        setVoiceState("idle");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // ---------------- SELECT MODE FROM DISCREET BOTTOM CARDS ----------------
  const handleSelectModeCard = (mode) => {
    setActiveMode(mode);
    if (mode === "pulse") {
      speakText(
        "Touchmark Pulse is active. Tell me what's happening in your relationship or interaction—we'll separate what you observed from the story and find your next calm step."
      );
    } else {
      speakText(
        "Touchmark Signal is active. Share a headline, study, or viral claim—we'll check the primary records alongside what independent writers are saying on Substack, Medium, and Reddit."
      );
    }
  };

  const copyAuditBrief = () => {
    if (!signalReport) return;
    const text = [
      `TOUCHMARK SIGNAL — EVIDENCE & DISCERNMENT BRIEF`,
      `Title: ${signalReport.title}`,
      `Status: ${signalReport.evidenceStatus} (${signalReport.claimClassification})`,
      `Verified Takeaway: ${customReceiptTakeaway || signalReport.creatorHook}`,
      `\nSummary: ${signalReport.verdictSummary}`
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  // ============================================================================
  // RENDER: MINIMALIST VOICE-FIRST 3D SANCTUARY
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#0f1419] text-[#F1F5F9] font-sans flex flex-col justify-between relative overflow-hidden select-none">
      {/* SUBTLE AMBIENT RADIAL BACKDROP */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            activeMode === "signal"
              ? "radial-gradient(circle at 50% 44%, rgba(125, 185, 222, 0.06) 0%, rgba(15, 20, 25, 0) 62%)"
              : "radial-gradient(circle at 50% 44%, rgba(201, 166, 107, 0.07) 0%, rgba(15, 20, 25, 0) 62%)"
        }}
      />

      {/* ====================================================================
          1. TOP HEADER: ONLY BRAND LOGO & NAME + DISCREET LEDGER/AUDIO CONTROLS
          ==================================================================== */}
      <header className="relative z-20 px-6 pt-6 pb-2 flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="w-24 hidden sm:block" />

        <button
          type="button"
          onClick={() => {
            setActiveMode("neutral");
            setDrawerOpen(false);
            speakText(WELCOME_PROMPT);
          }}
          className="flex items-center gap-3 mx-auto group focus:outline-none"
          title="Return to Touchmark Welcome"
        >
          <TouchmarkLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
          <span className="text-base sm:text-lg font-medium tracking-wide text-[#F1F5F9]">
            Touchmark
          </span>
        </button>

        <div className="flex items-center justify-end gap-2 w-auto sm:w-24">
          <button
            type="button"
            onClick={() => {
              if (!audioMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setVoiceState("idle");
              }
              setAudioMuted(!audioMuted);
            }}
            className="p-2 rounded-full text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/[0.05] transition-colors"
            title={audioMuted ? "Unmute Touchmark Voice" : "Mute Touchmark Voice"}
            aria-label={audioMuted ? "Unmute voice" : "Mute voice"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-full text-[#94A3B8] hover:text-[#c9a66b] hover:bg-white/[0.05] transition-colors relative"
            title="Open Discernment Ledger & Visual Receipts"
            aria-label="Open Ledger"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {(pulseHistory.length > 0 || hasRunSignalAudit) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a66b] absolute top-1.5 right-1.5" />
            )}
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. CENTER SANCTUARY: 3D VIBRATING ORB + SPOKEN PROMPT & VOICE TRIGGER
          ==================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full">
        <div className="relative flex items-center justify-center">
          <ResonanceOrb
            voiceState={voiceState}
            activeMode={activeMode}
            audioLevel={audioLevel}
            onClick={toggleListening}
          />
        </div>

        <div className="min-h-[84px] flex flex-col items-center justify-center space-y-2.5 -mt-2">
          {liveTranscript ? (
            <p className="text-base sm:text-lg text-[#c9a66b] font-normal leading-relaxed max-w-lg animate-pulse">
              “{liveTranscript}”
            </p>
          ) : (
            <p className="text-base sm:text-lg text-[#F1F5F9]/90 font-light leading-relaxed max-w-lg">
              {spokenCaption}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={toggleListening}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                voiceState === "listening"
                  ? "bg-[#c9a66b] text-[#0f1419] border-[#c9a66b] shadow-lg shadow-[#c9a66b]/20"
                  : "bg-white/[0.04] hover:bg-white/[0.08] text-[#F1F5F9] border-white/[0.1]"
              }`}
            >
              {voiceState === "listening" ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Listening · Tap to send</span>
                </>
              ) : voiceState === "thinking" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c9a66b]" />
                  <span>Discerning...</span>
                </>
              ) : voiceState === "speaking" ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#c9a66b]" />
                  <span>Speaking · Tap orb to interrupt</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#c9a66b]" />
                  <span>{voiceSupported ? "Tap orb or speak" : "Voice unavailable"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowTypeBar((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-[#94A3B8] hover:text-[#F1F5F9] bg-transparent hover:bg-white/[0.05] border border-white/[0.07] transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showTypeBar ? "Hide keyboard" : "Type instead"}</span>
            </button>
          </div>
        </div>

        {showTypeBar && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!typedInput.trim()) return;
              const text = typedInput;
              setTypedInput("");
              handleUserUtterance(text);
            }}
            className="w-full max-w-lg mt-4 flex items-center gap-2 bg-[#161d24]/90 border border-white/[0.12] focus-within:border-[#c9a66b]/70 rounded-full px-4 py-1.5 shadow-xl"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={
                activeMode === "signal"
                  ? "Paste a headline, study, or claim to audit..."
                  : activeMode === "pulse"
                  ? "Describe what happened or what feels off..."
                  : "Type to Pulse or Signal..."
              }
              autoFocus
              className="flex-1 bg-transparent text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 py-1.5 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!typedInput.trim() || voiceState === "thinking"}
              className="p-2 rounded-full bg-[#c9a66b] text-[#0f1419] disabled:opacity-40 hover:bg-[#d6b57c] transition-colors"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </main>

      {/* ====================================================================
          3. DISCREET BOTTOM FLANKING CARDS: TOUCHMARK PULSE & TOUCHMARK SIGNAL
          ==================================================================== */}
      <footer className="relative z-20 px-6 pb-6 pt-2 max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => handleSelectModeCard("pulse")}
            className={`text-left rounded-2xl px-4 py-3 border transition-all flex items-start gap-3 ${
              activeMode === "pulse"
                ? "bg-[#161d24]/90 border-[#c9a66b]/50"
                : "bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.07]"
            }`}
          >
            <Activity
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                activeMode === "pulse" ? "text-[#c9a66b]" : "text-[#94A3B8]"
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-wide text-[#F1F5F9]">
                  Touchmark Pulse
                </span>
                {activeMode === "pulse" && (
                  <span className="text-[10px] text-[#c9a66b]">● Active</span>
                )}
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-snug mt-0.5">
                Personal & relational discernment—separate observation from story, pattern from motive, and find your next calm step.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectModeCard("signal")}
            className={`text-left rounded-2xl px-4 py-3 border transition-all flex items-start gap-3 ${
              activeMode === "signal"
                ? "bg-[#161d24]/90 border-sky-400/50"
                : "bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.07]"
            }`}
          >
            <ShieldCheck
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                activeMode === "signal" ? "text-sky-300" : "text-[#94A3B8]"
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-wide text-[#F1F5F9]">
                  Touchmark Signal
                </span>
                {activeMode === "signal" && (
                  <span className="text-[10px] text-sky-300">● Active</span>
                )}
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-snug mt-0.5">
                Public claim & evidence auditing—check primary records, denominator math, and Substack, Medium & Reddit discourse.
              </p>
            </div>
          </button>
        </div>
      </footer>

      {/* ====================================================================
          4. SLIDE-OVER GLASSMORPHIC LEDGER & RECEIPT DRAWER (ON DEMAND)
          ==================================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-[#131920] border-l border-white/[0.1] h-full overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMode("pulse")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeMode !== "signal"
                      ? "bg-[#c9a66b] text-[#0f1419]"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  Pulse Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode("signal")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeMode === "signal"
                      ? "bg-[#c9a66b] text-[#0f1419]"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  Signal Audit & Receipts
                </button>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9]"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeMode === "signal" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusBadgeStyle(
                      signalReport.evidenceStatus
                    )}`}
                  >
                    {signalReport.evidenceStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(true)}
                    className="bg-[#c9a66b] hover:bg-[#d6b57c] text-[#0f1419] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Creator Receipt Card</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#F1F5F9]">
                    {signalReport.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-1">
                    {signalReport.verdictSummary}
                  </p>
                </div>

                {signalReport.visualMetrics?.chartEligible &&
                  signalReport.visualMetrics?.bars?.length > 0 && (
                    <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-4 space-y-3">
                      <div className="text-xs font-semibold text-[#c9a66b] flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{signalReport.visualMetrics.chartTitle}</span>
                      </div>
                      <div className="space-y-2.5">
                        {signalReport.visualMetrics.bars.map((bar, idx) => {
                          const maxVal = Math.max(
                            ...signalReport.visualMetrics.bars.map((b) => Number(b.value) || 0),
                            1
                          );
                          const pct = Math.max(
                            5,
                            Math.min(100, Math.round(((Number(bar.value) || 0) / maxVal) * 100))
                          );
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-[#F1F5F9]">{bar.label}</span>
                                <span className="font-mono text-[#c9a66b] font-semibold">
                                  {bar.displayValue}
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-[#161d24] rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getBarColorClass(bar.tone)}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {signalReport.dependencyChain?.length > 0 && (
                  <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-[#c9a66b] flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Claim Dependency Chain</span>
                    </div>
                    {signalReport.dependencyChain.map((node, i) => (
                      <div
                        key={i}
                        className="bg-[#161d24] border border-white/[0.06] rounded-lg p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#c9a66b]">
                            {node.step}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadgeStyle(
                              node.status
                            )}`}
                          >
                            {node.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#F1F5F9]">{node.statement}</p>
                        <p className="text-[11px] text-[#94A3B8]">{node.linkNote}</p>
                      </div>
                    ))}
                  </div>
                )}

                {signalReport.publicDiscourse && (
                  <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>Public Discourse (Substack · Medium · Reddit)</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-[#94A3B8] border border-white/[0.08]">
                        Quarantined from Evidence Status
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="bg-[#161d24] p-2.5 rounded-lg">
                        <div className="text-[10px] uppercase tracking-wider text-[#c9a66b] font-semibold">
                          Substack & Medium Independent Analysis
                        </div>
                        <p className="text-[#F1F5F9] text-[11px] mt-0.5 leading-relaxed">
                          {signalReport.publicDiscourse.substackAndMedium}
                        </p>
                      </div>
                      <div className="bg-[#161d24] p-2.5 rounded-lg">
                        <div className="text-[10px] uppercase tracking-wider text-sky-300 font-semibold">
                          Reddit Ground-Level Pulse
                        </div>
                        <p className="text-[#F1F5F9] text-[11px] mt-0.5 leading-relaxed">
                          {signalReport.publicDiscourse.redditCommunities}
                        </p>
                      </div>
                    </div>
                    {signalReport.publicDiscourse.recurringQuestions?.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[10px] uppercase text-[#94A3B8] font-semibold mb-1">
                          Recurring Public Questions
                        </div>
                        <ul className="space-y-1 text-[11px] text-[#94A3B8]">
                          {signalReport.publicDiscourse.recurringQuestions.map((q, idx) => (
                            <li key={idx}>• {q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {signalReport.compassGuidance && (
                  <div className="bg-[#c9a66b]/10 border border-[#c9a66b]/30 rounded-xl p-4 space-y-1.5 text-xs">
                    <div className="font-semibold text-[#c9a66b] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>
                        Compass ({signalReport.compassGuidance.decisionState})
                      </span>
                    </div>
                    <p className="text-[#F1F5F9]">
                      {signalReport.compassGuidance.nextResponsibleStep}
                    </p>
                    <p className="text-[#94A3B8] text-[11px]">
                      <strong>Stopping Rule:</strong> {signalReport.compassGuidance.stoppingRule}
                    </p>
                  </div>
                )}

                {signalReport.registryLinks?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {signalReport.registryLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[#0f1419] hover:bg-[#1e2730] text-[#c9a66b] border border-white/[0.1] px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                      >
                        <span>{link.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F1F5F9]">
                    4-Layer Experiential Separation
                  </span>
                  <span className="text-[11px] text-[#c9a66b] bg-[#0f1419] px-2.5 py-0.5 rounded border border-[#c9a66b]/30">
                    {pulseLedger.currentStage}
                  </span>
                </div>

                <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-3 space-y-2.5">
                  <div className="grid grid-cols-4 gap-1 bg-[#161d24] p-1 rounded-lg">
                    {[
                      { id: "observed", label: "Observed" },
                      { id: "reported", label: "Reported" },
                      { id: "interpreted", label: "Interpreted" },
                      { id: "experienced", label: "Experienced" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveLayerTab(tab.id)}
                        className={`py-1.5 rounded text-[11px] font-medium ${
                          activeLayerTab === tab.id
                            ? "bg-[#c9a66b] text-[#0f1419]"
                            : "text-[#94A3B8] hover:text-[#F1F5F9]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="min-h-[60px] text-xs text-[#F1F5F9] pt-1">
                    {(pulseLedger.fourLayers[activeLayerTab] || []).length === 0 ? (
                      <p className="text-[#94A3B8]/70 italic">
                        Speak or type to populate this layer automatically.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {pulseLedger.fourLayers[activeLayerTab].map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="font-semibold text-[#F1F5F9]">Pattern vs. Cause</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-[#161d24] p-2.5 rounded-lg">
                      <div className="text-[10px] uppercase text-emerald-400 font-semibold">
                        Established Pattern
                      </div>
                      <p className="text-[#F1F5F9] text-[11px] mt-0.5">
                        {pulseLedger.patternVsCause.observablePattern}
                      </p>
                    </div>
                    <div className="bg-[#161d24] p-2.5 rounded-lg">
                      <div className="text-[10px] uppercase text-amber-400 font-semibold">
                        Unknown Cause / Motive
                      </div>
                      <p className="text-[#94A3B8] text-[11px] mt-0.5">
                        {pulseLedger.patternVsCause.unknownCauseOrIntent}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f1419] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#F1F5F9]">Situational Skill Curve</span>
                    <span className="text-[#c9a66b]">{pulseLedger.skillCurve.stage}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {["1. Unconscious", "2. Aware", "3. Integrating", "4. Embodied"].map((s) => (
                      <div
                        key={s}
                        className={`text-center py-1 rounded text-[10px] border ${
                          pulseLedger.skillCurve.stage === s
                            ? "bg-[#c9a66b]/20 border-[#c9a66b] text-[#c9a66b] font-semibold"
                            : "bg-[#161d24] border-white/[0.06] text-[#94A3B8]/60"
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#c9a66b]/10 border border-[#c9a66b]/30 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="font-semibold text-[#c9a66b] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Compass ({pulseLedger.compassGuidance.decisionState})</span>
                  </div>
                  <p className="text-[#F1F5F9]">
                    {pulseLedger.compassGuidance.nextResponsibleStep}
                  </p>
                  <p className="text-[#94A3B8] text-[11px]">
                    <strong>Stopping Rule:</strong> {pulseLedger.compassGuidance.stoppingRule}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          5. CREATOR RECEIPT CARD MODAL
          ==================================================================== */}
      {showReceiptModal && signalReport && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1419] border border-[#c9a66b] rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <TouchmarkLogo className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a66b]">
                  Touchmark Signal · Verified Receipt Card
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="text-[#94A3B8] hover:text-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <span
                className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded border ${getStatusBadgeStyle(
                  signalReport.evidenceStatus
                )}`}
              >
                {signalReport.evidenceStatus}
              </span>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">{signalReport.title}</h3>
              <textarea
                rows={3}
                value={customReceiptTakeaway}
                onChange={(e) => setCustomReceiptTakeaway(e.target.value)}
                className="w-full bg-[#161d24] border border-white/[0.1] rounded-xl p-3 text-xs text-[#F1F5F9] leading-relaxed focus:outline-none focus:border-[#c9a66b]"
              />
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
                <span>Assessed {signalReport.assessmentMeta?.assessedDate || "2026-11-11"}</span>
                <button
                  type="button"
                  onClick={() => {
                    copyAuditBrief();
                    setShowReceiptModal(false);
                  }}
                  className="bg-[#c9a66b] text-[#0f1419] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  {copiedBrief ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Verified Brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
