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
  if (l === 'left') return 'bg-indigo-700/15 text-indigo-900 dark:text-indigo-200 border-indigo-700/30';
  if (l === 'right') return 'bg-rose-700/15 text-rose-900 dark:text-rose-200 border-rose-700/30';
  if (l === 'center') return 'bg-sky-700/15 text-sky-900 dark:text-sky-200 border-sky-700/30';
  return 'bg-amber-700/15 text-amber-900 dark:text-amber-200 border-amber-700/30';
}

function scoreColorClass(score = 50) {
  if (score >= 78) return 'text-emerald-700 dark:text-emerald-300 font-bold';
  if (score >= 65) return 'text-amber-800 dark:text-amber-200 font-bold';
  return 'text-rose-700 dark:text-rose-300 font-bold';
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
          'Authorization': `Bearer ${secret.trim()}`
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
      {/* Collapsible Bottom Anchor Bar */}
      <div className="pointer-events-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-xl transition-all cursor-pointer group font-medium ${
            isDarkMode 
              ? 'bg-[#121214]/90 hover:bg-[#18181b] border-white/10 text-stone-300' 
              : 'bg-white/95 hover:bg-stone-50 border-stone-300 text-stone-800 shadow-stone-300/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.18em] font-bold">
              Daily Top-5 Brief &amp; Track-Record Scoreboard
            </span>
            {briefs.length > 0 && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isDarkMode ? 'bg-amber-400/15 text-amber-300 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'}`}>
                {briefs.length} live
              </span>
            )}
          </div>

          <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-stone-400 group-hover:text-stone-200' : 'text-stone-600 group-hover:text-stone-900 font-semibold'}`}>
            <span>{isOpen ? 'Collapse' : 'Explore Feed'}</span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Expandable Drawer Content */}
      {isOpen && (
        <div className={`pointer-events-auto w-full max-w-3xl mt-2 max-h-[72vh] overflow-y-auto p-5 rounded-3xl border shadow-2xl backdrop-blur-2xl text-left transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          isDarkMode ? 'bg-[#0f0f12]/95 border-white/12 text-stone-100' : 'bg-white/98 border-stone-300 text-stone-900 shadow-stone-400/30'
        }`}>
          <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b ${isDarkMode ? 'border-white/10' : 'border-stone-200'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] uppercase tracking-[0.2em] font-bold ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>
                Intelligence Stream
              </span>
              {briefDate && (
                <span className={`text-[10px] font-mono ${isDarkMode ? 'text-stone-500' : 'text-stone-500 font-medium'}`}>· {briefDate}</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center p-1 rounded-full border ${isDarkMode ? 'bg-white/[0.04] border-white/10' : 'bg-stone-100 border-stone-300'}`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('brief')}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer font-medium ${
                    activeTab === 'brief'
                      ? (isDarkMode ? 'bg-amber-400/20 text-amber-200' : 'bg-white text-amber-950 font-bold shadow-xs')
                      : (isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-700 hover:text-stone-900')
                  }`}
                >
                  Top-5 Brief ({briefs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scoreboard')}
                  className={`px-3 py-1 rounded-full text-[11px] transition-all cursor-pointer font-medium ${
                    activeTab === 'scoreboard'
                      ? (isDarkMode ? 'bg-emerald-400/20 text-emerald-200' : 'bg-white text-emerald-950 font-bold shadow-xs')
                      : (isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-700 hover:text-stone-900')
                  }`}
                >
                  Track-Record Scoreboard ({entities.length})
                </button>
              </div>

              <button
                type="button"
                onClick={handleRefreshBrief}
                disabled={refreshing}
                title="Regenerate Daily Top-5 Brief (Requires CRON_SECRET)"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-40 ${
                  isDarkMode ? 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 text-amber-200' : 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
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
                  isDarkMode ? 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-stone-400 hover:text-stone-200' : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {feedError && (
            <div className="mb-3 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-400/25 text-xs text-red-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{feedError}</span>
            </div>
          )}

          {activeTab === 'brief' ? (
            loading ? (
              <div className="p-8 text-center text-xs text-stone-500 font-semibold animate-pulse">
                Assembling intelligence briefs…
              </div>
            ) : briefs.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-600 font-medium space-y-2">
                <p>No briefs available for today yet.</p>
                <p className="text-[11px] text-stone-500">
                  Click the locked <strong className="text-amber-700 dark:text-amber-200">Refresh Brief</strong> button above to synthesize today's top 5 signals.
                </p>
              </div>
            ) : (
         <div className="sm:w-36 h-24 rounded-xl bg-stone-900 overflow-hidden shrink-0 relative border border-stone-800 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.headline} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 flex items-center justify-center">
                          <span className="text-[10px] font-mono tracking-widest text-amber-500/60 uppercase">Signal</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <span className="text-[10px] font-mono font-semibold text-amber-300 z-20 px-2 text-center relative z-20">
                        {item.domain_tag || 'Global Signal'}
                      </span>
                      <div className="absolute bottom-1.5 left-2 z-20 text-[9px] font-mono text-stone-200">
                        Rarity {item.rarity_score}
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${isDarkMode ? 'bg-amber-400/15 text-amber-200 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                            #0{item.rank || 1}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-stone-600 dark:text-stone-400 font-mono font-medium">
                            Gravity {item.gravity_likelihood}%
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onLaunchPrompt && onLaunchPrompt(item.inquiry_prompt);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 font-semibold cursor-pointer"
                        >
                          <span>Open Dossier</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className={`text-sm font-semibold leading-snug ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                        {item.headline}
                      </h3>

                      <p className={`text-xs leading-relaxed line-clamp-2 font-normal ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                        <strong className={isDarkMode ? 'text-stone-200 font-semibold' : 'text-stone-900 font-semibold'}>Center of Gravity:</strong>{' '}
                        {item.center_of_gravity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              <p className={`text-xs leading-relaxed font-normal ${isDarkMode ? 'text-stone-400' : 'text-stone-700'}`}>
                Multi-year accuracy &amp; omission audits of major news outlets, public agencies, and think tanks—click any row to inspect its full claim-by-claim record.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  handleAuditSearchSubmit(e);
                }}
                className={`flex items-center gap-2 border rounded-full px-3.5 py-1.5 focus-within:border-emerald-500/50 ${
                  isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-stone-100 border-stone-300 shadow-2xs'
                }`}
              >
                <SearchCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Audit any outlet, agency, or think tank (e.g., Reuters, RAND, IMF)…"
                  className={`flex-1 bg-transparent text-xs focus:outline-none ${isDarkMode ? 'text-stone-200 placeholder:text-stone-500' : 'text-stone-900 placeholder:text-stone-400 font-medium'}`}
                />
                <button
                  type="submit"
                  disabled={!auditSearch.trim()}
                  className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 disabled:opacity-35 whitespace-nowrap cursor-pointer shadow-xs"
                >
                  Audit Track Record
                </button>
              </form>

              {entities.length === 0 ? (
                <div className={`p-4 rounded-2xl border text-xs font-medium ${isDarkMode ? 'bg-white/[0.02] border-white/[0.07] text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
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
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDarkMode ? 'bg-white/[0.025] hover:bg-white/[0.06] border-white/[0.08]' : 'bg-stone-50 hover:bg-stone-100 border-stone-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 shrink-0 overflow-hidden flex items-center justify-center">
                          {ent.image_url ? (
                            <img src={ent.image_url} alt={ent.entity_name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-xs font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                              {ent.entity_name}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isDarkMode ? 'bg-white/[0.06] text-stone-400' : 'bg-stone-200 text-stone-700'}`}>
                              {ent.entity_type}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${laneBadgeClass(
                                ent.alignment_lane
                              )}`}
                            >
                              {ent.alignment_lane}
                            </span>
                          </div>
                          {ent.notable_audit_note && (
                            <p className="text-[11px] text-stone-500 truncate font-normal">
                              {ent.notable_audit_note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
                          <span
                            className={`text-sm font-mono ${scoreColorClass(
                              ent.calibration_score
                            )}`}
                          >
                            {ent.calibration_score}/100
                          </span>
                        </div>
                        <span className="block text-[10px] text-stone-500 font-medium">
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

          <div className={`mt-4 pt-3 border-t flex items-center gap-1.5 text-[10px] font-medium ${isDarkMode ? 'border-white/10 text-stone-500' : 'border-stone-200 text-stone-600'}`}>
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
