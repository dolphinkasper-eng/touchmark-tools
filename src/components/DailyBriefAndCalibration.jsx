import React, { useEffect, useState } from 'react';
import { Radio, Scale, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function DailyBriefAndCalibration({ onLaunchPrompt }) {
  const [briefs, setBriefs] = useState([]);
  const [calibration, setCalibration] = useState([]);
  const [activeTab, setActiveTab] = useState('briefs');
  const [auditQuery, setAuditQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/intelligence-feed')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setBriefs(Array.isArray(data.briefs) ? data.briefs : []);
        setCalibration(Array.isArray(data.calibration) ? data.calibration : []);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.025] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          {activeTab === 'briefs' ? (
            <Radio className="h-4 w-4 text-amber-300" />
          ) : (
            <Scale className="h-4 w-4 text-emerald-300" />
          )}
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-200">
            {activeTab === 'briefs'
              ? `Daily Top-5 Signal Brief · ${briefs[0]?.brief_date || 'Live Feed'}`
              : 'Longitudinal Calibration & Integrity Scoreboard'}
          </span>
        </div>

        <div className="flex items-center rounded-full border border-white/10 bg-black/40 p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('briefs')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeTab === 'briefs'
                ? 'bg-amber-400/20 text-amber-200'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Top-5 Brief ({briefs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calibration')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeTab === 'calibration'
                ? 'bg-emerald-400/20 text-emerald-200'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Calibration Ledger ({calibration.length})
          </button>
        </div>
      </div>

      {activeTab === 'briefs' ? (
        <div className="space-y-3">
          {briefs.length === 0 ? (
            <p className="py-4 text-center text-xs text-stone-400">
              The daily Top-5 Signal Brief updates automatically each morning—or switch to Calibration Ledger to audit any entity’s multi-year track record right now.
            </p>
          ) : (
            briefs.map((item) => (
              <div
                key={item.id || item.rank}
                className="rounded-xl border border-white/10 bg-black/35 p-4 transition hover:border-amber-400/35"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        #{item.rank}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
                        {item.domain_tag}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-100">{item.headline}</h4>
                  </div>

                  {onLaunchPrompt && (
                    <button
                      type="button"
                      onClick={() => onLaunchPrompt(item.inquiry_prompt)}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-amber-400/25"
                    >
                      <span>Open Dossier</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-200">Center of Gravity:</strong>{' '}
                  {item.center_of_gravity}
                </p>
                <p className="mt-1 text-xs text-amber-200/85">
                  <strong>Omitted Record:</strong> {item.omitted_fact}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-3 border-t border-white/5 pt-2 text-[10px] text-stone-400">
                  <span>Rarity: {item.rarity_score}/100</span>
                  <span>Curation: {item.curation_score}/100</span>
                  <span>Coordination: {item.coordination_score}/100</span>
                  <span>Gravity Likelihood: {item.gravity_likelihood}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {onLaunchPrompt && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && auditQuery.trim()) {
                    onLaunchPrompt(
                      `Audit the multi-year track record, claim accuracy, and correction integrity of ${auditQuery.trim()}`
                    );
                    setAuditQuery('');
                  }
                }}
                placeholder="Audit any person, outlet, think tank, or agency's multi-year track record..."
                className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="button"
                disabled={!auditQuery.trim()}
                onClick={() => {
                  onLaunchPrompt(
                    `Audit the multi-year track record, claim accuracy, and correction integrity of ${auditQuery.trim()}`
                  );
                  setAuditQuery('');
                }}
                className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-emerald-300 disabled:opacity-50"
              >
                Run Integrity Audit
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            {calibration.length === 0 ? (
              <p className="py-4 text-center text-xs text-stone-400">
                Enter any outlet, agency, think tank, or individual above to generate a multi-year Track-Record & Integrity Dossier and log them to this scoreboard.
              </p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-stone-400">
                    <th className="py-2 pr-3">Entity / Outlet</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Claims Audited</th>
                    <th className="py-2 px-3">Omission Flags</th>
                    <th className="py-2 pl-3 text-right">Calibration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {calibration.map((row) => (
                    <tr key={row.id} className="text-stone-300">
                      <td className="py-2.5 pr-3 font-medium text-stone-100">
                        {onLaunchPrompt ? (
                          <button
                            type="button"
                            onClick={() =>
                              onLaunchPrompt(
                                `Audit the multi-year track record, claim accuracy, and correction integrity of ${row.entity_name}`
                              )
                            }
                            className="text-left text-stone-100 underline decoration-emerald-400/40 hover:text-emerald-300"
                          >
                            {row.entity_name} ↗
                          </button>
                        ) : (
                          row.entity_name
                        )}
                        {row.notable_audit_note && (
                          <span className="block text-[11px] font-normal text-stone-500">
                            {row.notable_audit_note}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-stone-400">{row.entity_type}</td>
                      <td className="py-2.5 px-3">
                        {row.verified_hits}/{row.tracked_claims}
                      </td>
                      <td className="py-2.5 px-3 text-amber-300/90">{row.omission_flags}</td>
                      <td className="py-2.5 pl-3 text-right font-semibold text-emerald-300">
                        {row.calibration_score}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-white/5 pt-2.5 text-[11px] text-stone-500">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        <span>
          Calibration scores measure falsifiable claim accuracy and primary-record omissions over time—zero paid placements or editorial sponsorships.
        </span>
      </div>
    </section>
  );
}
