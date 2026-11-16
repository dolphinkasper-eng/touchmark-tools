import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldCheck,
  ArrowUpRight,
  SearchCheck,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

function laneBadgeClass(lane = '') {
  const l = lane.toLowerCase();
  if (l === 'left') return 'bg-indigo-400/15 text-indigo-200 border-indigo-400/30';
  if (l === 'right') return 'bg-rose-400/15 text-rose-200 border-rose-400/30';
  if (l === 'center') return 'bg-sky-400/15 text-sky-200 border-sky-400/30';
  return 'bg-amber-400/15 text-amber-200 border-amber-400/30';
}

function scoreColorClass(score = 50) {
  if (score >= 78) return 'text-emerald-300';
  if (score >= 65) return 'text-amber-200';
  return 'text-rose-300';
}

export default function DailyBriefAndCalibration({ onLaunchPrompt }) {
  const [activeTab, setActiveTab] = useState('brief'); // 'brief' | 'scoreboard'
  const [briefs, setBriefs] = useState([]);
  const [briefDate, setBriefDate] = useState('');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setFeedError('');
    try {
      const res = await fetch('/api/intelligence-feed');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not load live intelligence feed.');
      }
      setBriefs(Array.isArray(data.briefs) ? data.briefs : []);
      setBriefDate(data.briefDate || '');
      setEntities(Array.isArray(data.calibration) ? data.calibration : []);
    } catch (err) {
      setFeedError(err.message || 'Feed temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleAuditSearchSubmit = (e) => {
    e.preventDefault();
    if (!auditSearch.trim() || !onLaunchPrompt) return;
    onLaunchPrompt(
      `Audit the multi-year claim accuracy, predictive calibration, and correction integrity of ${auditSearch.trim()}`
    );
    setAuditSearch('');
  };

  return (
    <section className="mx-auto max-w-3xl mt-7 pt-5 border-t border-white/[0.08] text-left">
      {/* Header + Plain-English Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-300 font-medium">
            Daily Top-5 Signal Brief · Live Feed
          </span>
          {briefDate && (
            <span className="text-[10px] font-mono text-stone-500">· {briefDate}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('brief')}
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                activeTab === 'brief'
                  ? 'bg-amber-400/20 text-amber-200 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Top-5 Brief ({briefs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scoreboard')}
              title="See multi-year accuracy & omission scores for news outlets, agencies, and think tanks"
              className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                activeTab === 'scoreboard'
                  ? 'bg-emerald-400/20 text-emerald-200 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Track-Record Scoreboard ({entities.length})
            </button>
          </div>

          <button
            type="button"
            onClick={loadFeed}
            title="Reload feed"
            aria-label="Reload feed"
            className="p-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {feedError && (
        <div className="mb-3 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-400/25 text-xs text-red-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{feedError}</span>
        </div>
      )}

      {/* TAB 1: DAILY TOP-5 SIGNAL BRIEF */}
      {activeTab === 'brief' ? (
        loading ? (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] text-xs text-stone-500 animate-pulse">
            Loading today’s top 5 high-signal developments…
          </div>
        ) : briefs.length === 0 ? (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2">
            <p className="text-xs text-stone-300">
              Today’s Top-5 Signal Brief updates automatically each morning—or switch to{' '}
              <button
                type="button"
                onClick={() => setActiveTab('scoreboard')}
                className="text-emerald-300 underline decoration-emerald-400/40 hover:text-emerald-200 cursor-pointer"
              >
                Track-Record Scoreboard
              </button>{' '}
              to inspect the multi-year accuracy of any news outlet, agency, or think tank right now.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {briefs.map((item) => (
              <div
                key={item.id || item.rank}
                className="p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-amber-300/30 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/25">
                      #0{item.rank}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300">
                      {item.domain_tag}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      Rarity {item.rarity_score} · Curation {item.curation_score} · Gravity{' '}
                      {item.gravity_likelihood}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onLaunchPrompt && onLaunchPrompt(item.inquiry_prompt)}
                    className="inline-flex items-center gap-1 text-[11px] text-amber-200 hover:text-amber-100 font-medium cursor-pointer"
                  >
                    <span>Open Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-medium text-stone-100 leading-snug">
                  {item.headline}
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-200">Center of Gravity:</strong>{' '}
                  {item.center_of_gravity}
                </p>

                {item.omitted_fact && (
                  <p className="text-[11px] text-amber-200/85 leading-relaxed">
                    <strong>Omitted from Headlines:</strong> {item.omitted_fact}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* TAB 2: TRACK-RECORD SCOREBOARD */
        <div className="space-y-3">
          <p className="text-xs text-stone-400 leading-relaxed">
            Multi-year accuracy &amp; omission audits of major news outlets, public agencies, and think tanks—click any row to inspect its full claim-by-claim record, or audit any organization below.
          </p>

          {/* Direct Entity Audit Search Bar */}
          <form
            onSubmit={handleAuditSearchSubmit}
            className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-3.5 py-1.5 focus-within:border-emerald-400/35"
          >
            <SearchCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <input
              type="text"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              placeholder="Audit any outlet, agency, or think tank (e.g., Reuters, RAND, IMF)…"
              className="flex-1 bg-transparent text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!auditSearch.trim()}
              className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-medium hover:bg-emerald-400/30 disabled:opacity-35 whitespace-nowrap cursor-pointer"
            >
              Audit Track Record
            </button>
          </form>

          {entities.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] text-xs text-stone-400">
              No entities scored yet—enter any publication, agency, or think tank above to run its first multi-year Track-Record Audit.
            </div>
          ) : (
            <div className="space-y-2">
              {entities.map((ent) => (
                <button
                  key={ent.id || ent.entity_name}
                  type="button"
                  onClick={() =>
                    onLaunchPrompt &&
                    onLaunchPrompt(
                      `Audit the multi-year claim accuracy, predictive calibration, and correction integrity of ${ent.entity_name}`
                    )
                  }
                  className="w-full text-left p-3.5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-300/35 transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-medium text-stone-100">
                        {ent.entity_name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-400">
                        {ent.entity_type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${laneBadgeClass(
                          ent.alignment_lane
                        )}`}
                      >
                        {ent.alignment_lane}
                      </span>
                    </div>
                    {ent.notable_audit_note && (
                      <p className="text-[11px] text-stone-400 truncate">
                        {ent.notable_audit_note}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span
                        className={`text-sm font-mono font-semibold ${scoreColorClass(
                          ent.calibration_score
                        )}`}
                      >
                        {ent.calibration_score}/100
                      </span>
                    </div>
                    <span className="block text-[10px] text-stone-500">
                      {ent.verified_hits}/{ent.tracked_claims} verified · {ent.omission_flags}{' '}
                      omissions
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-stone-500">
        <Sparkles className="w-3 h-3 text-amber-300/70 shrink-0" />
        <span>
          Track-record scores measure falsifiable claim accuracy and primary-record omissions over time—zero paid placements or editorial sponsorships.
        </span>
      </div>
    </section>
  );
}
