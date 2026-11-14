// api/feedback-notify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: verify webhook secret if configured in Supabase HTTP Headers
  if (
    process.env.FEEDBACK_WEBHOOK_SECRET &&
    req.headers['x-webhook-secret'] !== process.env.FEEDBACK_WEBHOOK_SECRET
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const record = req.body?.record;
  if (!record) {
    return res.status(400).json({ error: 'Missing Supabase record payload' });
  }

  const {
    tool = 'signal',
    tier = 'free',
    rating = 'unknown',
    note = '',
    user_email = 'Anonymous visitor',
    prompt_preview = '',
  } = record;

  // Send instant alert via Resend if configured
  if (process.env.RESEND_API_KEY && process.env.ALERT_EMAIL) {
    const badge = rating === 'helpful' ? 'HIT THE MARK' : 'MISSED SOMETHING';
    const subject = `[Touchmark ${tool.toUpperCase()}] ${badge} (${tier.toUpperCase()})`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">New Founding Member Calibration Note</h2>
        <p style="margin: 0 0 16px; color: #475569;">
          <strong>Tool:</strong> ${tool.toUpperCase()} &nbsp;|&nbsp;
          <strong>Tier:</strong> ${tier.toUpperCase()} &nbsp;|&nbsp;
          <strong>Rating:</strong> ${badge}
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #d97706; padding: 12px 16px; margin-bottom: 16px;">
          <strong>Note:</strong><br/>
          ${note ? note.replace(/</g, '&lt;') : '<em>(No written note left)</em>'}
        </div>
        <p style="font-size: 13px; color: #64748b;">
          <strong>User:</strong> ${user_email}<br/>
          <strong>Prompt Preview:</strong> ${prompt_preview ? prompt_preview.replace(/</g, '&lt;') : 'N/A'}
        </p>
      </div>
    `;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Touchmark Alerts <alerts@touchmarktools.com>',
          to: [process.env.ALERT_EMAIL],
          subject,
          html,
        }),
      });
    } catch (err) {
      console.error('Resend alert failed:', err);
    }
  }

  return res.status(200).json({ ok: true });
}
