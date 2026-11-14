import React, { useState } from 'react';
import { Compass, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

const LANE_STYLES = {
  Left: {
    title: 'Left / Progressive Frameworks',
    badge: 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300',
    border: 'border-indigo-400/20'
  },
  Center: {
    title: 'Center / Heterodox Frameworks',
    badge: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
    border: 'border-sky-400/20'
  },
  Right: {
    title: 'Right / Conservative Frameworks',
    badge: 'border-rose-400/30 bg-rose-500/15 text-rose-300',
    border: 'border-rose-400/20'
  }
};

const QUICK_CUSTOM_LENSES = [
  'The Economist',
  'Bank for International Settlements',
  'Lex Fridman',
  'Electronic Frontier Foundation',
  'A skeptical antitrust litigator'
];

export default function PerspectiveTogglesPanel({
  inquiry,
  dossierContext,
  perspectiveData,
  onPerspectiveDataChange
}) {
  const [nineLensEnabled, setNineLensEnabled] = useState(
    Boolean(perspectiveData?.nineLensMatrix?.length)
  );
  const [customLensEnabled, setCustomLensEnabled] = useState(
    Boolean(perspectiveData?.customLensSynthesis?.targetLens)
  );
  const [customLensInput, setCustomLensInput] = useState(
    perspectiveData?.customLensSynthesis?.targetLens || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runPerspectiveSynthesis = async ({
    nextNine = nineLensEnabled,
    nextCustom = customLensEnabled,
    lensText = customLensInput
  }) => {
    if (!nextNine && (!nextCustom || !lensText.trim())) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/discern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signal_perspectives',
          prompt: inquiry,
          dossierContext,
          includeNineLenses: nextNine,
          customLens: nextCustom ? lensText.trim() : ''
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Perspective synthesis failed.');

      const parsed = JSON.parse(data.text);
      onPerspectiveDataChange({
        nineLensMatrix: nextNine ? parsed.nineLensMatrix || [] : [],
        customLensSynthesis: nextCustom ? parsed.customLensSynthesis || null : null
      });
    } catch (err) {
      setError(err.message || 'Unable to synthesize perspectives right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNine = () => {
    const nextState = !nineLensEnabled;
    setNineLensEnabled(nextState);
    if (nextState && (!perspectiveData?.nineLensMatrix || perspectiveData.nineLensMatrix.length === 0)) {
      runPerspectiveSynthesis({
        nextNine: true,
        nextCustom: customLensEnabled,
        lensText: customLensInput
      });
    }
  };

  const handleToggleCustom = () => {
    const nextState = !customLensEnabled;
    setCustomLensEnabled(nextState);
  };

  const matrix = perspectiveData?.nineLensMatrix || [];
  const customResult = perspectiveData?.customLensSynthesis || null;

  return (
    <section className="print:hidden my-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-300" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Optional Perspective Triangulation (Opt-In)
            </h3>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Your core dossier above stays strictly anchored in primary records. Toggle either lens below to test how competing frameworks or specific institutions interpret this evidence.
          </p>
        </div>
      </div>

      {/* Two Opt-In Toggle Switches */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* Toggle 1: 9 Left/Center/Right Analytical Frameworks */}
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
            nineLensEnabled
              ? 'border-amber-400/40 bg-amber-500/10'
              : 'border-white/10 bg-black/30'
          }`}
        >
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-stone-100">
              1. 9-Lens Spectrum Synthesis
            </div>
            <p className="text-[11px] text-stone-400">
              3 Left · 3 Center · 3 Right analytical frameworks & topic-matched thinkers
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={nineLensEnabled}
            onClick={handleToggleNine}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              nineLensEnabled ? 'bg-amber-400' : 'bg-stone-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow transition duration-200 ${
                nineLensEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Any Person, Outlet, or Institution */}
        <div
          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
            customLensEnabled
              ? 'border-emerald-400/40 bg-emerald-500/10'
              : 'border-white/10 bg-black/30'
          }`}
        >
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-stone-100">
              2. Custom Person, Outlet, or Institution
            </div>
            <p className="text-[11px] text-stone-400">
              Synthesize through any commentator, publication, central bank, or role
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={customLensEnabled}
            onClick={handleToggleCustom}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              customLensEnabled ? 'bg-emerald-400' : 'bg-stone-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-stone-950 shadow transition duration-200 ${
                customLensEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Toggle 2 Input Bar (Shown when Custom Lens is toggled ON) */}
      {customLensEnabled && (
        <div className="rounded-xl border border-emerald-400/25 bg-black/40 p-3.5 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customLensInput}
              onChange={(e) => setCustomLensInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customLensInput.trim()) {
                  runPerspectiveSynthesis({
                    nextNine: nineLensEnabled,
                    nextCustom: true,
                    lensText: customLensInput
                  });
                }
              }}
              placeholder="Enter any person, outlet, or institution (e.g., The Economist, Bank of Canada, Lex Fridman)..."
              className="flex-1 rounded-lg border border-white/15 bg-stone-950 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-emerald-400 focus:outline-none"
            />
            <button
              type="button"
              disabled={loading || !customLensInput.trim()}
              onClick={() =>
                runPerspectiveSynthesis({
                  nextNine: nineLensEnabled,
                  nextCustom: true,
                  lensText: customLensInput
                })
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {loading ? 'Synthesizing...' : 'Run Lens'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Examples:</span>
            {QUICK_CUSTOM_LENSES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setCustomLensInput(example);
                  runPerspectiveSynthesis({
                    nextNine: nineLensEnabled,
                    nextCustom: true,
                    lensText: example
                  });
                }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-stone-300 hover:border-emerald-400/40"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200">
          Synthesizing selected epistemic perspectives against the verified record…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-xs text-rose-200">
          {error}
        </div>
      )}

      {/* Custom Lens Output Card */}
      {customLensEnabled && customResult && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/15 p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-300" />
              <h4 className="text-sm font-semibold text-emerald-200">
                Synthesis Through: {customResult.targetLens}
              </h4>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
              {customResult.lensCategory}
            </span>
          </div>
          <p className="text-xs text-stone-200 leading-relaxed">{customResult.coreThesis}</p>
          <div className="grid gap-2 pt-2 border-t border-white/10 sm:grid-cols-2 text-[11px]">
            <div className="text-stone-300">
              <strong className="text-emerald-300">Primary Spotlight:</strong>{' '}
              {customResult.whatItSpotlights}
            </div>
            <div className="text-stone-400">
              <strong className="text-amber-300">Structural Blind Spot:</strong>{' '}
              {customResult.structuralBlindSpot}
            </div>
          </div>
        </div>
      )}

      {/* 9-Lens Spectrum Output Grid (3 Left · 3 Center · 3 Right) */}
      {nineLensEnabled && matrix.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3 pt-1">
          {(['Left', 'Center', 'Right']).map((lane) => {
            const items = matrix.filter(
              (m) => (m.alignment || '').toLowerCase() === lane.toLowerCase()
            );
            return (
              <div key={lane} className="space-y-2.5">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${LANE_STYLES[lane].badge}`}
                >
                  {LANE_STYLES[lane].title}
                </span>

                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border bg-black/35 p-3.5 space-y-1.5 ${LANE_STYLES[lane].border}`}
                  >
                    <div className="text-[11px] font-semibold text-amber-200/90">
                      {item.framework}
                    </div>
                    <div className="text-[11px] font-medium text-stone-400">
                      Representative Voice:{' '}
                      <span className="text-stone-200">{item.representativeVoice}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">{item.coreFraming}</p>
                    <p className="text-[11px] text-stone-500 border-t border-white/5 pt-1.5">
                      <strong className="text-stone-400">Blind Spot:</strong> {item.blindSpot}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Anti-Pay-to-Play / Neutrality Safeguard Footer */}
      <div className="flex items-center gap-2 border-t border-white/5 pt-2.5 text-[11px] text-stone-500">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        <span>
          Touchmark accepts zero paid placements or media sponsorships. Perspectives model distinct analytical frameworks and explicitly flag each lens’s structural blind spots.
        </span>
      </div>
    </section>
  );
}
