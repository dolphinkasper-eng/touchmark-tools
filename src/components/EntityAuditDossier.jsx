import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle, Scale } from 'lucide-react';
import DossierFeedbackBar from './DossierFeedbackBar';

const GRADE_BADGES = {
  'Confirmed by Record': {
    style: 'border-emerald-400/35 bg-emerald-500/15 text-emerald-300',
    icon: CheckCircle2
  },
  'Partially Confirmed': {
    style: 'border-sky-400/35 bg-sky-500/15 text-sky-300',
    icon: HelpCircle
  },
  'Refuted by Record': {
    style: 'border-rose-400/35 bg-rose-500/15 text-rose-300',
    icon: ShieldAlert
  },
  'Goalpost Shifted': {
    style: 'border-amber-400/35 bg-amber-500/15 text-amber-300',
    icon: AlertTriangle
  }
};

export default function EntityAuditDossier({ audit, sources = [], promptPreview = '' }) {
  if (!audit) return null;

  const scalars = [
    {
      title: '1. Claim Veracity',
      score: audit.claimVeracityScore,
      label: audit.claimVeracityLabel,
      summary: audit.claimVeracitySummary
    },
    {
      title: '2. Predictive Calibration',
      score: audit.predictiveCalibrationScore,
      label: audit.predictiveCalibrationLabel,
      summary: audit.predictiveCalibrationSummary
    },
    {
      title: '3. Correction Integrity',
      score: audit.correctionIntegrityScore,
      label: audit.correctionIntegrityLabel,
      summary: audit.correctionIntegritySummary
    },
    {
      title: '4. Structural Independence',
      score: audit.structuralIndependenceScore,
      label: audit.structuralIndependenceLabel,
      summary: audit.structuralIndependenceSummary
    }
  ];

  return (
    <div className="space-y-6 text-stone-200">
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-950/15 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <Scale className="h-4 w-4" />
              <span>Entity Track-Record & Epistemic Integrity Audit</span>
            </div>
            <h2 className="mt-1 text-xl font-semibold text-stone-100">{audit.entityName}</h2>
            <p className="text-xs text-stone-400">
              {audit.entityType} · {audit.alignmentLane} · Audit Window: {audit.auditWindow}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/35 bg-black/50 px-4 py-2.5 text-right">
            <div className="text-[10px] uppercase tracking-wider text-stone-400">
              Composite Calibration
            </div>
            <div className="text-2xl font-bold text-emerald-300">
              {audit.overallCalibrationScore}
              <span className="text-sm font-normal text-stone-400">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {scalars.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-200">{s.title}</span>
              <span className="text-sm font-bold text-amber-300">{s.score}/100</span>
            </div>
            <div className="text-[11px] font-medium text-emerald-300/90">{s.label}</div>
            <p className="text-xs text-stone-400 leading-relaxed">{s.summary}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-300">
          Multi-Year Claim-to-Outcome Ledger
        </h3>
        <div className="space-y-3">
          {(audit.claimToOutcomeLedger || []).map((entry, idx) => {
            const meta = GRADE_BADGES[entry.outcomeGrade] || GRADE_BADGES['Partially Confirmed'];
            const Icon = meta.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-stone-200">
                    {entry.claimDate} · <span className="text-amber-200">{entry.topic}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${meta.style}`}
                  >
                    <Icon className="h-3 w-3" />
                    {entry.outcomeGrade}
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  <strong className="text-stone-200">Claim / Forecast:</strong>{' '}
                  {entry.originalClaimOrPrediction}
                </p>
                <p className="text-xs text-stone-400">
                  <strong className="text-emerald-300/90">Subsequent Primary Record:</strong>{' '}
                  {entry.subsequentPrimaryRecord}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Error Accountability & Correction Pattern
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            {audit.correctionBehaviorAudit}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            Structural & Funding Incentive Profile
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            {audit.structuralIncentiveProfile}
          </p>
        </div>
      </div>

      {sources.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-black/30 p-3.5 space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Primary Grounding Records & Citations
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-sky-300 hover:border-sky-400/40"
              >
                {src.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <DossierFeedbackBar tool="signal_entity_audit" promptPreview={promptPreview} />
    </div>
  );
}
