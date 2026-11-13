import crypto from 'node:crypto';

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function verifyStripeSignature(rawBodyBuffer, sigHeader, webhookSecret) {
  if (!sigHeader || !webhookSecret) return false;

  const elements = sigHeader.split(',');
  let timestamp = '';
  const signatures = [];

  for (const item of elements) {
    const [key, value] = item.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  // Reject webhooks older than 5 minutes to prevent replay attacks
  const ageSeconds = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (Math.abs(ageSeconds) > 300) return false;

  const signedPayload = `${timestamp}.${rawBodyBuffer.toString('utf8')}`;
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  return signatures.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'));
    } catch {
      return false;
    }
  });
}

async function syncSubscriptionToSupabase(record) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return;

  await fetch(`${supabaseUrl}/rest/v1/subscriptions?on_conflict=stripe_customer_id`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify(record)
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ error: 'STRIPE_WEBHOOK_SECRET is not configured.' });
  }

  try {
    const rawBody = await getRawBody(req);
    const sigHeader = req.headers['stripe-signature'];

    if (!verifyStripeSignature(rawBody, sigHeader, webhookSecret)) {
      return res.status(400).json({ error: 'Invalid Stripe webhook signature.' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const obj = event.data?.object || {};

    switch (event.type) {
      case 'checkout.session.completed': {
        await syncSubscriptionToSupabase({
          stripe_customer_id: obj.customer,
          stripe_subscription_id: obj.subscription,
          user_id: obj.client_reference_id || obj.metadata?.user_id || null,
          customer_email: obj.customer_details?.email || obj.customer_email || null,
          tier: obj.metadata?.tier || 'suite',
          status: 'active',
          updated_at: new Date().toISOString()
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const isActive = obj.status === 'active' || obj.status === 'trialing';
        await syncSubscriptionToSupabase({
          stripe_customer_id: obj.customer,
          stripe_subscription_id: obj.id,
          user_id: obj.metadata?.user_id || null,
          tier: isActive ? obj.metadata?.tier || 'suite' : 'free',
          status: obj.status,
          current_period_end: obj.current_period_end
            ? new Date(obj.current_period_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString()
        });
        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true, type: event.type });
  } catch (err) {
    console.error('Touchmark /api/webhook error:', err);
    return res.status(500).json({ error: err.message || 'Webhook handler error.' });
  }
}
