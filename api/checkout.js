export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured on Vercel.' });
  }

  // Toggle Stripe Managed Payments (Merchant of Record) via Vercel env var (defaults to true)
  const useManagedPayments = process.env.STRIPE_MANAGED_PAYMENTS !== 'false';
  const stripeHeaders = {
    Authorization: `Bearer ${stripeKey}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Stripe-Version': '2026-04-22.dahlia' //
  };

  try {
    const {
      action = 'create_checkout',
      tier = 'suite', // 'signal' | 'studio' | 'suite'
      customerEmail = '',
      customerId = '',
      userId = ''
    } = req.body || {};

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.origin ||
      'https://touchmarktools.com';

    // 1. CUSTOMER BILLING PORTAL (Manage/Cancel/Upgrade Subscription)
    if (action === 'portal') {
      if (!customerId) {
        return res.status(400).json({ error: 'Stripe customerId is required for billing portal.' });
      }

      const portalParams = new URLSearchParams();
      portalParams.append('customer', customerId);
      portalParams.append('return_url', `${origin}/signal`);

      const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
        method: 'POST',
        headers: stripeHeaders,
        body: portalParams.toString()
      });

      const portalData = await portalRes.json();
      if (!portalRes.ok) {
        return res.status(portalRes.status).json({
          error: portalData?.error?.message || 'Could not open Stripe billing portal.'
        });
      }

      return res.status(200).json({ url: portalData.url });
    }

    // 2. CREATE HOSTED STRIPE CHECKOUT SESSION
    const priceMap = {
      signal: process.env.STRIPE_PRICE_SIGNAL,
      studio: process.env.STRIPE_PRICE_STUDIO,
      suite: process.env.STRIPE_PRICE_SUITE
    };

    const priceId = priceMap[tier];
    if (!priceId) {
      return res.status(400).json({
        error: `Missing Stripe Price ID environment variable for tier "${tier}".`
      });
    }

    const params = new URLSearchParams();
    params.append('mode', 'subscription'); //
    params.append('line_items[0][price]', priceId); //
    params.append('line_items[0][quantity]', '1'); //
    params.append('allow_promotion_codes', 'true');
    params.append(
      'success_url',
      `${origin}/signal?checkout=success&tier=${encodeURIComponent(tier)}&session_id={CHECKOUT_SESSION_ID}`
    ); //
    params.append('cancel_url', `${origin}/signal?checkout=canceled`); //
    params.append('metadata[tier]', tier);
    params.append('subscription_data[metadata][tier]', tier);

    // Enable Stripe Managed Payments (Merchant of Record: global VAT/GST/sales tax + disputes)
    if (useManagedPayments) {
      params.append('managed_payments[enabled]', 'true'); //
    }

    if (userId) {
      params.append('client_reference_id', userId);
      params.append('metadata[user_id]', userId);
      params.append('subscription_data[metadata][user_id]', userId);
    }

    if (customerId) {
      params.append('customer', customerId);
    } else if (customerEmail) {
      params.append('customer_email', customerEmail);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: stripeHeaders,
      body: params.toString()
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(stripeRes.status).json({
        error: session?.error?.message || 'Failed to create Stripe Checkout session.'
      });
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      managedPayments: useManagedPayments
    });
  } catch (err) {
    console.error('Touchmark /api/checkout error:', err);
    return res.status(500).json({
      error: err.message || 'Unexpected error in /api/checkout.'
    });
  }
}
