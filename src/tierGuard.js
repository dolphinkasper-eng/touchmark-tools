export const TIER_RULES = {
  free: {
    label: 'Free Preview',
    monthlyLimit: 2,
    allowSignal: true,
    allowPulse: true,
    allowStudio: true, // Allowed within the 2 free preview runs
    description: '2 complimentary investigative or Studio preview runs'
  },
  signal: {
    label: 'Touchmark Signal',
    monthlyLimit: 60,
    allowSignal: true,
    allowPulse: true,
    allowStudio: false,
    description: '60 deep Signal & Pulse runs / month'
  },
  studio: {
    label: 'Touchmark Studio',
    monthlyLimit: 60,
    allowSignal: false,
    allowPulse: false,
    allowStudio: true,
    description: '60 Studio production suites / month (External Notes Importer)'
  },
  suite: {
    label: 'Intelligence Suite',
    monthlyLimit: 150,
    allowSignal: true,
    allowPulse: true,
    allowStudio: true,
    description: '150 combined Signal, Studio & Pulse runs / month'
  }
};

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function getLocalMonthlyUsage() {
  if (typeof window === 'undefined') {
    return { period: getCurrentMonthKey(), signal: 0, studio: 0, pulse: 0 };
  }
  const period = getCurrentMonthKey();
  try {
    const raw = JSON.parse(localStorage.getItem('tm_monthly_usage') || '{}');
    if (raw.period === period) {
      return {
        period,
        signal: Number(raw.signal) || 0,
        studio: Number(raw.studio) || 0,
        pulse: Number(raw.pulse) || 0
      };
    }
  } catch {}
  return { period, signal: 0, studio: 0, pulse: 0 };
}

export function getTotalUsedForTier(tier, usage) {
  if (tier === 'signal') return usage.signal + usage.pulse;
  if (tier === 'studio') return usage.studio;
  return usage.signal + usage.studio + usage.pulse;
}

/**
 * Checks if the active tier is allowed to run `action` ('signal' | 'studio' | 'pulse').
 * If `supabaseClient` and an authenticated session exist, calls the atomic Postgres RPC.
 * Otherwise falls back cleanly to browser monthly period tracking.
 */
export async function checkAndConsumeAllowance({
  tier = 'free',
  action, // 'signal' | 'studio' | 'pulse'
  supabaseClient = null
}) {
  const normalizedTier = TIER_RULES[tier] ? tier : 'free';
  const rules = TIER_RULES[normalizedTier];

  // 1. Check feature entitlement first
  if (action === 'signal' && !rules.allowSignal) {
    return {
      allowed: false,
      reason: 'tier_upgrade_required',
      message: `Your ${rules.label} plan includes standalone Studio production. Upgrade to Intelligence Suite to run live Signal investigations.`
    };
  }
  if (action === 'pulse' && !rules.allowPulse) {
    return {
      allowed: false,
      reason: 'tier_upgrade_required',
      message: `Your ${rules.label} plan is focused on Studio production. Upgrade to Signal or Intelligence Suite for Pulse discernment.`
    };
  }
  if (action === 'studio' && !rules.allowStudio) {
    return {
      allowed: false,
      reason: 'tier_upgrade_required',
      message: `Touchmark Studio is included in Studio ($49 CAD) and Intelligence Suite ($99 CAD). Upgrade to transform investigations into essays & scripts.`
    };
  }

  // 2. If Supabase Auth session is active, enforce via server-side Postgres RPC
  if (supabaseClient) {
    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      if (sessionData?.session?.user) {
        const { data, error } = await supabaseClient.rpc('consume_touchmark_credit', {
          p_action: action
        });
        if (!error && data) {
          if (!data.allowed) {
            return {
              allowed: false,
              reason: data.reason,
              used: data.used,
              limit: data.limit,
              message:
                data.reason === 'free_limit_reached'
                  ? `You've used both of your complimentary Founding Preview runs (${data.used}/${data.limit}). Select a plan below to continue.`
                  : data.reason === 'tier_upgrade_required'
                  ? `This workspace tool requires upgrading your current ${rules.label} tier.`
                  : `You've reached your ${rules.label} monthly allowance (${data.used}/${data.limit} runs). Upgrade to Intelligence Suite for 150 monthly runs.`
            };
          }
          return {
            allowed: true,
            tier: data.tier || normalizedTier,
            used: data.used,
            limit: data.limit
          };
        }
      }
    } catch {
      // Fall back to local period counter if RPC is unreachable
    }
  }

  // 3. Browser monthly period fallback (for unauthenticated preview visitors)
  const usage = getLocalMonthlyUsage();
  const used = getTotalUsedForTier(normalizedTier, usage);

  if (used >= rules.monthlyLimit) {
    return {
      allowed: false,
      reason: normalizedTier === 'free' ? 'free_limit_reached' : 'monthly_limit_reached',
      used,
      limit: rules.monthlyLimit,
      message:
        normalizedTier === 'free'
          ? `You've completed your ${rules.monthlyLimit} complimentary Founding Preview investigations. Unlock full access below.`
          : `You've reached your ${rules.label} monthly allowance (${used}/${rules.monthlyLimit} runs).`
    };
  }

  const nextUsage = {
    ...usage,
    [action]: (usage[action] || 0) + 1
  };
  try {
    localStorage.setItem('tm_monthly_usage', JSON.stringify(nextUsage));
  } catch {}

  return {
    allowed: true,
    tier: normalizedTier,
    used: used + 1,
    limit: rules.monthlyLimit,
    nextUsage
  };
}
