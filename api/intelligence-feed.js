export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({ briefs: [], calibration: [] });
  }

  try {
    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    };

    const [briefsRes, calRes] = await Promise.all([
      fetch(
        `${supabaseUrl}/rest/v1/daily_signal_briefs?select=*&order=brief_date.desc,rank.asc&limit=5`,
        { headers }
      ),
      fetch(
        `${supabaseUrl}/rest/v1/calibration_ledger?select=*&order=calibration_score.desc&limit=25`,
        { headers }
      )
    ]);

    const briefs = briefsRes.ok ? await briefsRes.json() : [];
    const calibration = calRes.ok ? await calRes.json() : [];

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({ briefs, calibration });
  } catch (err) {
    console.error('Intelligence feed fetch error:', err);
    return res.status(200).json({ briefs: [], calibration: [] });
  }
}
