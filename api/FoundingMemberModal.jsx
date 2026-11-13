import React, { useState } from 'react';

const TIERS = [
  {
    id: 'signal',
    name: 'Touchmark Signal',
    badge: 'RESEARCH ENGINE',
    price: '$39',
    period: 'CAD / mo',
    tagline: 'Deep investigative intelligence & structural verification.',
    features: [
      'Unlimited Signal investigative dossiers',
      '4-Scalar Diagnostic Radar & Follow the Power',
      'Epistemic & legal status verification badges',
      'Investigation Gap & cumulative revision logging',
      'One-click clean PDF dossier export'
    ]
  },
  {
    id: 'suite',
    name: 'Intelligence Suite',
    badge: 'FOUNDING MEMBER • FULL STACK',
    featured: true,
    price: '$99',
    period: 'CAD / mo',
    tagline: 'Complete Signal + Studio + Pulse unified workspace.',
    features: [
      'Everything in Touchmark Signal & Touchmark Studio',
      'Direct Signal-to-Studio dossier pipeline',
      'Pulse rapid verification & institutional mapping',
      'Cross-device cloud investigation archive',
      'Founding Member rate locked for life'
    ]
  },
  {
    id: 'studio',
    name: 'Touchmark Studio',
    badge: 'EDITORIAL ENGINE',
    price: '$49',
    period: 'CAD / mo',
    tagline: 'Turn raw research into publication-ready creator assets.',
    features: [
      'Standalone Studio editorial workspace',
      'Import external transcripts, notes & research',
      'Substack long-form essays & YouTube scripts',
      '3-Clip Short-Form Pack + Integrity Safeguards',
      'Editorial accuracy & framing audit'
    ]
  }
];

export default function FoundingMemberModal({
  isOpen,
  onClose,
  currentTier = 'free',
  customerEmail = '',
  customerId = '',
  userId = ''
}) {
  const [loadingTier, setLoadingTier] = useState(null);
  const [emailInput, setEmailInput] = useState(customerEmail);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCheckout = async (tierId) => {
    setErrorMsg('');
    setLoadingTier(tierId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_checkout',
          tier: tierId,
          customerEmail: emailInput.trim() || undefined,
          customerId: customerId || undefined,
          userId: userId || undefined
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to start Stripe Checkout.');
      }

      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(err.message || 'Checkout connection failed. Please try again.');
      setLoadingTier(null);
    }
  };

  const handleManageBilling = async () => {
    if (!customerId) return;
    setErrorMsg('');
    setLoadingTier('portal');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'portal',
          customerId
        })
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to open billing portal.');
      }

      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(err.message || 'Could not open billing portal.');
      setLoadingTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-amber-500/30 bg-zinc-950 text-zinc-100 shadow-2xl p-6 md:p-8 my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-300 uppercase mb-3">
              Founding Member Access • Limited Cohort
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Upgrade Your Touchmark Workspace
            </h2>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
              Lock in Founding Member pricing with unlimited investigative dossiers, editorial synthesis, and full global tax compliance handled automatically at checkout.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            aria-label="Close upgrade modal"
          >
            ✕
          </button>
        </div>

        {/* Optional Email Pre-fill (when not yet signed in via Supabase) */}
        {!customerEmail && (
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-zinc-800/90 bg-zinc-900/50 px-4 py-3">
            <label htmlFor="tm-checkout-email" className="text-xs font-medium uppercase tracking-wider text-zinc-400 whitespace-nowrap">
              Receipt & Account Email:
            </label>
            <input
              id="tm-checkout-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@publication.com (optional — or enter in Stripe)"
              className="w-full rounded-lg border border-zinc-700/80 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        {/* 3-Column Pricing Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier) => {
            const isCurrent = currentTier === tier.id;
            const isLoading = loadingTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 transition ${
                  tier.featured
                    ? 'border-amber-400/60 bg-gradient-to-b from-amber-500/10 via-zinc-900/90 to-zinc-950 shadow-lg shadow-amber-500/10'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-semibold tracking-widest uppercase ${
                        tier.featured ? 'text-amber-300' : 'text-zinc-400'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-xl font-bold text-white">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-xs font-medium text-zinc-400">{tier.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{tier.tagline}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-zinc-800/80 pt-4 text-xs text-zinc-300">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout(tier.id)}
                  disabled={isCurrent || Boolean(loadingTier)}
                  className={`mt-6 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    tier.featured
                      ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : isLoading
                    ? 'Connecting to Stripe...'
                    : `Select ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer / Existing Subscriber Billing Portal */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">
          <span>
            Cancel anytime in one click • Promo codes supported at checkout • Secure Stripe billing
          </span>
          {customerId && (
            <button
              onClick={handleManageBilling}
              disabled={Boolean(loadingTier)}
              className="text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
            >
              {loadingTier === 'portal' ? 'Opening Billing Portal...' : 'Manage Existing Subscription'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
