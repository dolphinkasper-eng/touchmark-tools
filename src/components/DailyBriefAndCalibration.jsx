import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldCheck,
  ArrowUpRight,
  SearchCheck,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Lock
} from 'lucide-react';

function laneBadgeClass(lane = '') {
  const l = lane.toLowerCase();
  if (l === 'left') return 'bg-indigo-400/15 text-indigo-200 border-indigo-400/30';
  if (l === 'right') return 'bg-rose-400/15 text-rose-200 border-rose-400/30';
  if (l === 'center') return 'bg-sky-400/15 text-sky-200 border-sky-400/30';
  return 'bg-amber-400/15 text-amber-200 border-amber-400/25';
}

function scoreColorClass(score = 50) {
  if (score >= 78) return 'text-emerald-300';
  if (score >= 65) return 'text-amber-200';
  return 'text-rose-300';
}

export default function DailyBriefAndCalibration({ onLaunchPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('brief');
  const [briefs, setBriefs] = useState([]);
  const [briefDate, setBriefDate] = useState('');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setFeedError('');
    try {
      const res = await fetch('/api/intelligence-feed');
      const text = await res.text();
      let data = JSON.parse(text);

      if (!res.ok || data.error) {
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

  const handleRefreshBrief = async () => {
    const secret = prompt('Enter your CRON_SECRET to regenerate today’s Top-5 Brief:');
    if (!secret) return;

    setRefreshing(true);
    setFeedError('');
    try {
      const res = await fetch('/api/cron/daily-brief', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secret.trim()}`
        }
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error || data?.message || 'Failed to generate brief.');
      }
      // Reload feed after successful generation
      await loadFeed();
      setActiveTab('brief');
    } catch (err) {
      setFeedError(`Refresh failed: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAuditSearchSubmit = (e) => {
    e.preventDefault();
    if (!auditSearch.trim() || !onLaunchPrompt) return;
    onLaunchPrompt(
      `Audit the multi-year claim accuracy, predictive calibration, and correction integrity of ${auditSearch.trim()}`
    );
    setAuditSearch('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 pb-4">
      {/* Collapsible Bottom Anchor Bar */}
      <div className="pointer-events-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#121214]/90 hover:bg-[#18181b] border border-white/10 shadow-2xl backdrop-blur-xl text-stone-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.18em] font-medium text-stone-200 group-hover:text-white transition-colors">
              Daily Top-5 Brief &amp; Track-Record Scoreboard
            </span>
            {briefs.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25">
                {briefs.length} live
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-400 group-hover:text-stone-200">
            <span>{isOpen ? 'Collapse' : 'Explore Feed'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Expandable Drawer Content */}
      {isOpen && (
        <div className="pointer-events-auto w-full max-w-3xl mt-2 max-h-[72vh] overflow-y-auto p-5 rounded-3xl bg-[#0f0f12]/95 border border-white/12 shadow-2xl backdrop-blur-2xl text-left transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                Intelligence Stream
              </span>
              {briefDate && (
                <span className="text-[10px] font-mono text-stone-500">· {briefDate}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    activeTab === 'scoreboard'
                      ? 'bg-emerald-400/20 text-emerald-200 font-medium'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Track-Record Scoreboard ({entities.length})
                </button>
              </div>

              {/* Secure Regenerate Brief Button */}
              <button
                type="button"
                onClick={handleRefreshBrief}
                disabled={refreshing}
                title="Regenerate Daily Top-5 Brief (Requires CRON_SECRET)"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-40"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>{refreshing ? 'Regenerating…' : 'Refresh Brief'}</span>
              </button>

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

          {activeTab === 'brief' ? (
            loading ? (
              <div className="p-8 text-center text-xs text-stone-500 animate-pulse">
                Assembling intelligence briefs…
              </div>
            ) : briefs.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-400 space-y-2">
                <p>No briefs available for today yet.</p>
                <p className="text-[11px] text-stone-500">
                  Click the locked <strong className="text-amber-200">Refresh Brief</strong> button above to synthesize today's top 5 signals.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {briefs.map((item) => (
                  <div
                    key={item.id || item.rank}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-amber-300/30 transition-all"
                  >
                    <div className="sm:w-36 h-24 rounded-xl bg-stone-800/80 overflow-hidden shrink-0 relative border border-white/10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                      <span className="text-[10px] font-mono text-amber-300 z-20 px-2 text-center">
                        {item.domain_tag || 'Global Signal'}
                      </span>
                      <div className="absolute bottom-1.5 left-2 z-20 text-[9px] font-mono text-stone-300">
                        Rarity {item.rarity_score}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-200 border border-amber-400/25">
                            #0{item.rank}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                            Gravity {item.gravity_likelihood}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onLaunchPrompt && onLaunchPrompt(item.inquiry_prompt);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-200 hover:text-amber-100 font-medium cursor-pointer"
                        >
                          <span>Open Dossier</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="text-sm font-medium text-stone-100 leading-snug">
                        {item.headline}
                      </h3>

                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                        <strong className="text-stone-200">Center of Gravity:</strong>{' '}
                        {item.center_of_gravity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-400 leading-relaxed">
                Multi-year accuracy &amp; omission audits of major news outlets, public agencies, and think tanks—click any row to inspect its full claim-by-claim record.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  handleAuditSearchSubmit(e);
                }}
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
                  No entities scored yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                  {entities.map((ent) => (
                    <button
                      key={ent.id || ent.entity_name}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onLaunchPrompt &&
                          onLaunchPrompt(
                            `Audit the multi-year claim accuracy, predictive calibration, and correction integrity of ${ent.entity_name}`
                          );
                      }}
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

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-stone-500">
            <Sparkles className="w-3 h-3 text-amber-300/70 shrink-0" />
            <span>
              Track-record scores measure falsifiable claim accuracy and primary-record omissions over time—zero paid placements or editorial sponsorships.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
