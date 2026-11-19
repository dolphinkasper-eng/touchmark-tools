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
  Lock,
  Building2
} from 'lucide-react';

const FALLBACK_BRIEFS = [
  {
    id: 'fb-1',
    rank: 1,
    domain_tag: 'Economic & Fiscal Policy',
    rarity_score: 84,
    gravity_likelihood: 78,
    headline: 'Audit the multi-year claim accuracy and correction integrity of institutional economic forecasting',
    center_of_gravity: 'Systemic divergence between projected monetary models and primary public debt servicing obligations.',
    inquiry_prompt: 'Audit the multi-year claim accuracy & correction integrity of institutional economic forecasting',
    image_url: null
  },
  {
    id: 'fb-2',
    rank: 2,
    domain_tag: 'Digital Infrastructure',
    rarity_score: 81,
    gravity_likelihood: 72,
    headline: 'Look beneath the mainstream framing of digital identity and central bank programmable currencies',
    center_of_gravity: 'Infrastructural chokepoints and transactional conditional layers across sovereign jurisdictions.',
    inquiry_prompt: 'Look beneath the mainstream framing of digital IDs and central bank programmable currency',
    image_url: null
  },
  {
    id: 'fb-3',
    rank: 3,
    domain_tag: 'Geopolitics & Energy',
    rarity_score: 88,
    gravity_likelihood: 85,
    headline: 'Dissect narrative curation and competing structural probabilities in recent geopolitical energy corridors',
    center_of_gravity: 'Maritime transit tracking data weighed against primary corporate filings and pipeline security agreements.',
    inquiry_prompt: 'Dissect the narrative curation and competing probabilities around the latest geopolitical escalation',
    image_url: null
  }
];

const FALLBACK_ENTITIES = [
  {
    id: 'ent-1',
    entity_name: 'The Economist',
    entity_type: 'Publication',
    alignment_lane: 'Center',
    calibration_score: 82,
    verified_hits: 41,
    tracked_claims: 50,
    omission_flags: 4,
    notable_audit_note: 'Consistent macroeconomic tracking with documented omissions in emerging market debt restructuring.'
  },
  {
    id: 'ent-2',
    entity_name: 'RAND Corporation',
    entity_type: 'Think Tank',
    alignment_lane: 'Center',
    calibration_score: 88,
    verified_hits: 44,
    tracked_claims: 50,
    omission_flags: 2,
    notable_audit_note: 'High primary-source verification across defense and cyber security scenario projections.'
  }
];

function laneBadgeClass(lane = '') {
  const l = lane.toLowerCase();
  if (l === 'left') return 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-200 border-indigo-500/20';
  if (l === 'right') return 'bg-rose-500/10 text-rose-800 dark:text-rose-200 border-rose-500/20';
  if (l === 'center') return 'bg-sky-500/10 text-sky-800 dark:text-sky-200 border-sky-500/20';
  return 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border-amber-500/20';
}

function scoreColorClass(score = 50) {
  if (score >= 78) return 'text-emerald-700 dark:text-emerald-300 font-semibold';
  if (score >= 65) return 'text-amber-800 dark:text-amber-200 font-semibold';
  return 'text-rose-700 dark:text-rose-300 font-semibold';
}

export default function DailyBriefAndCalibration({ isDarkMode = false, onLaunchPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('brief');
  const [briefs, setBriefs] = useState(FALLBACK_BRIEFS);
  const [briefDate, setBriefDate] = useState('Live Record');
  const [entities, setEntities] = useState(FALLBACK_ENTITIES);
  const [loading, setLoading] = useState(false);
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

      if (Array.isArray(data.briefs) && data.briefs.length > 0) {
        setBriefs(data.briefs);
      }
      if (data.briefDate) {
        setBriefDate(data.briefDate);
      }
      if (Array.isArray(data.calibration) && data.calibration.length > 0) {
        setEntities(data.calibration);
      }
    } catch (err) {
      setFeedError('');
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
          Authorization: `Bearer ${secret.trim()}`
        }
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data?.error || data?.message || 'Failed to generate brief.');
      }
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
      {/* Floating Command Pill Anchor Bar */}
      <div className="pointer-events-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-5 py-3 rounded-full border backdrop-blur-2xl transition-all duration-200 cursor-pointer group ${
            isDarkMode
              ? 'bg-[#141416]/85 hover:bg-[#19191c]/95 border-white/[0.08] text-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
              : 'bg-[#FAF9F6]/90 hover:bg-[#F3F1EC] border-stone-900/[0.08] text-stone-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600 dark:bg-amber-400" />
            </span>
            <span className="text-xs tracking-[-0.01em] font-medium">
              Daily Top-5 Brief &amp; Track-Record Scoreboard
            </span>
            {briefs.length > 0 && (
              <span
                className={`text-[10px] font-mono tabular-nums px-2 py-0.5 rounded-full border ${
                  isDarkMode
                    ? 'bg-white/[0.05] text-amber-300 border-white/[0.08]'
                    : 'bg-stone-900/[0.04] text-amber-900 border-stone-900/[0.08]'
                }`}
              >
                {briefs.length} live
              </span>
            )}
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              isDarkMode
                ? 'text-stone-400 group-hover:text-stone-100'
                : 'text-stone-500 group-hover:text-stone-900'
            }`}
          >
            <span>{isOpen ? 'Collapse' : 'Explore'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>

      {/* Expandable Frosted Glass Drawer */}
      {isOpen && (
        <div
          className={`pointer-events-auto w-full max-w-3xl mt-2.5 max-h-[72vh] overflow-y-auto p-6 rounded-3xl border backdrop-blur-2xl text-left transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            isDarkMode
              ? 'bg-[#111113]/95 border-white/[0.09] text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.65)]'
              : 'bg-[#FAF9F6]/95 border-stone-900/[0.08] text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
          }`}
        >
          {/* Drawer Header */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b ${
              isDarkMode ? 'border-white/[0.07]' : 'border-stone-900/[0.06]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span
                className={`text-xs tracking-[-0.01em] font-semibold ${
                  isDarkMode ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                Intelligence Stream
              </span>
              {briefDate && (
                <span className="text-[11px] font-mono tabular-nums text-stone-500">
                  · {briefDate}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Segmented Pill Switcher */}
              <div
                className={`flex items-center p-1 rounded-full border ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/[0.07]'
                    : 'bg-[#F3F1EC] border-stone-900/[0.06]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('brief')}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    activeTab === 'brief'
                      ? isDarkMode
                        ? 'bg-white/[0.1] text-stone-100 font-medium shadow-xs'
                        : 'bg-white text-stone-900 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                      : isDarkMode
                      ? 'text-stone-400 hover:text-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Top-5 Brief ({briefs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scoreboard')}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    activeTab === 'scoreboard'
                      ? isDarkMode
                        ? 'bg-white/[0.1] text-stone-100 font-medium shadow-xs'
                        : 'bg-white text-stone-900 font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                      : isDarkMode
                      ? 'text-stone-400 hover:text-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Scoreboard ({entities.length})
                </button>
              </div>

              {/* Hairline Secondary Button */}
              <button
                type="button"
                onClick={handleRefreshBrief}
                disabled={refreshing}
                title="Regenerate Daily Top-5 Brief (Requires CRON_SECRET)"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-40 ${
                  isDarkMode
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-stone-200'
                    : 'bg-stone-900/[0.03] hover:bg-stone-900/[0.07] border-stone-900/[0.08] text-stone-800'
                }`}
              >
                <Lock className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <span>{refreshing ? 'Regenerating…' : 'Refresh Brief'}</span>
              </button>

              <button
                type="button"
                onClick={loadFeed}
                title="Reload feed"
                aria-label="Reload feed"
                className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-stone-400 hover:text-stone-200'
                    : 'bg-stone-900/[0.03] hover:bg-stone-900/[0.07] border-stone-900/[0.08] text-stone-600 hover:text-stone-900'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {feedError && (
            <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{feedError}</span>
            </div>
          )}

          {activeTab === 'brief' ? (
            loading ? (
              <div className="p-10 text-center text-xs text-stone-500 animate-pulse">
                Assembling intelligence briefs…
              </div>
            ) : briefs.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                <p>No briefs available for today yet.</p>
                <p className="text-[11px]">
                  Click <strong className="text-stone-800 dark:text-stone-200">Refresh Brief</strong> above to synthesize today&apos;s top 5 signals.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {briefs.map((item) => (
                  <div
                    key={item.id || item.rank}
                    className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all duration-150 ${
                      isDarkMode
                        ? 'bg-white/[0.02] hover:bg-white/[0.045] border-white/[0.06]'
                        : 'bg-[#F3F1EC]/70 hover:bg-[#F3F1EC] border-stone-900/[0.06]'
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="sm:w-36 h-24 rounded-xl bg-stone-900 overflow-hidden shrink-0 relative border border-white/[0.08] flex items-center justify-center">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.headline}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black flex items-center justify-center">
                          <span className="text-[9px] font-mono tracking-[0.2em] text-amber-400/50 uppercase">
                            Signal
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <span className="text-[10px] font-mono font-medium text-amber-200/90 z-20 px-2 text-center relative">
                        {item.domain_tag || 'Global Signal'}
                      </span>
                      <div className="absolute bottom-1.5 left-2.5 z-20 text-[9px] font-mono tabular-nums text-stone-300">
                        Rarity {item.rarity_score}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono tabular-nums px-2 py-0.5 rounded-full border ${
                              isDarkMode
                                ? 'bg-white/[0.05] text-stone-300 border-white/[0.08]'
                                : 'bg-white text-stone-700 border-stone-900/[0.08]'
                            }`}
                          >
                            #0{item.rank || 1}
                          </span>
                          <span className="text-[10px] text-stone-500 font-mono tabular-nums">
                            Gravity {item.gravity_likelihood}%
                          </span>
                        </div>

                        {/* Tactile Ink Primary Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onLaunchPrompt && onLaunchPrompt(item.inquiry_prompt);
                          }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                            isDarkMode
                              ? 'bg-stone-100 text-stone-900 hover:bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                              : 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                          }`}
                        >
                          <span>Open Dossier</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>

                      <h3
                        className={`text-sm font-semibold tracking-[-0.01em] leading-snug ${
                          isDarkMode ? 'text-stone-100' : 'text-stone-900'
                        }`}
                      >
                        {item.headline}
                      </h3>

                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isDarkMode ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        <strong
                          className={
                            isDarkMode
                              ? 'text-stone-200 font-medium'
                              : 'text-stone-800 font-medium'
                          }
                        >
                          Center of Gravity:
                        </strong>{' '}
                        {item.center_of_gravity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3.5">
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                Multi-year accuracy &amp; omission audits of major news outlets, public agencies, and think tanks—click any row to inspect its full claim-by-claim record.
              </p>

              {/* Floating Command Pill Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  handleAuditSearchSubmit(e);
                }}
                className={`flex items-center gap-2 border rounded-full px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 ${
                  isDarkMode
                    ? 'bg-white/[0.03] border-white/[0.08] focus-within:border-emerald-400/40'
                    : 'bg-white border-stone-900/[0.08] focus-within:border-emerald-600/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                }`}
              >
                <SearchCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Audit any outlet, agency, or think tank (e.g., Reuters, RAND, IMF)…"
                  className={`flex-1 bg-transparent text-xs focus:outline-none ${
                    isDarkMode
                      ? 'text-stone-200 placeholder:text-stone-500'
                      : 'text-stone-900 placeholder:text-stone-400'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!auditSearch.trim()}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-medium transition-all disabled:opacity-30 whitespace-nowrap cursor-pointer ${
                    isDarkMode
                      ? 'bg-stone-100 text-stone-900 hover:bg-white'
                      : 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                  }`}
                >
                  Audit Record
                </button>
              </form>

              {entities.length === 0 ? (
                <div
                  className={`p-4 rounded-2xl border text-xs ${
                    isDarkMode
                      ? 'bg-white/[0.02] border-white/[0.06] text-stone-400'
                      : 'bg-[#F3F1EC] border-stone-900/[0.06] text-stone-600'
                  }`}
                >
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
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                        isDarkMode
                          ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06]'
                          : 'bg-[#F3F1EC]/70 hover:bg-[#F3F1EC] border-stone-900/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-stone-900 border border-white/[0.08] shrink-0 overflow-hidden flex items-center justify-center">
                          {ent.image_url ? (
                            <img
                              src={ent.image_url}
                              alt={ent.entity_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-xs font-semibold tracking-[-0.01em] ${
                                isDarkMode ? 'text-stone-100' : 'text-stone-900'
                              }`}
                            >
                              {ent.entity_name}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ${
                                isDarkMode
                                  ? 'bg-white/[0.05] text-stone-400'
                                  : 'bg-stone-900/[0.05] text-stone-600'
                              }`}
                            >
                              {ent.entity_type}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${laneBadgeClass(
                                ent.alignment_lane
                              )}`}
                            >
                              {ent.alignment_lane}
                            </span>
                          </div>
                          {ent.notable_audit_note && (
                            <p className="text-[11px] text-stone-500 truncate">
                              {ent.notable_audit_note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                          <span
                            className={`text-sm font-mono tabular-nums ${scoreColorClass(
                              ent.calibration_score
                            )}`}
                          >
                            {ent.calibration_score}/100
                          </span>
                        </div>
                        <span className="block text-[10px] font-mono tabular-nums text-stone-500">
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

          {/* Footer Disclaimer */}
          <div
            className={`mt-4 pt-3 border-t flex items-center gap-1.5 text-[10px] ${
              isDarkMode
                ? 'border-white/[0.07] text-stone-500'
                : 'border-stone-900/[0.06] text-stone-500'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-300/70 shrink-0" />
            <span>
              Track-record scores measure falsifiable claim accuracy and primary-record omissions over time—zero paid placements or editorial sponsorships.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
