export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '');
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      ok: true,
      briefDate: new Date().toISOString().split('T')[0],
      briefs: [],
      calibration: [],
      warning: 'Missing Supabase credentials.'
    });
  }

  try {
    // Direct REST API fetch to Supabase (bypasses any SDK version mismatch or module crash)
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    };

    // 1. Fetch briefs sorted by date desc, rank asc
    const briefRes = await fetch(`${supabaseUrl}/rest/v1/daily_signal_briefs?select=*&order=date.desc,rank.asc&limit=5`, { headers });
    const rawBriefs = briefRes.ok ? await briefRes.json() : [];

    let briefDate = '';
    let briefs = [];
    if (Array.isArray(rawBriefs) && rawBriefs.length > 0) {
      const latestDateStr = rawBriefs[0].date;
      briefs = rawBriefs.filter(b => b.date === latestDateStr);
      briefDate = latestDateStr;
    }

    // 2. Fetch calibration scoreboard sorted by score desc
    const calRes = await fetch(`${supabaseUrl}/rest/v1/calibration_ledger?select=*&order=calibration_score.desc`, { headers });
    const calibration = calRes.ok ? await calRes.json() : [];

    return res.status(200).json({
      ok: true,
      briefDate: briefDate || new Date().toISOString().split('T')[0],
      briefs: Array.isArray(briefs) ? briefs : [],
      calibration: Array.isArray(calibration) ? calibration : []
    });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(200).json({
      ok: true,
      briefDate: new Date().toISOString().split('T')[0],
      briefs: [],
      calibration: [],
      error: err.message
    });
  }
}
