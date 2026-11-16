import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ 
      error: 'Missing Supabase environment variables on server.' 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Fetch the most recent batch of briefs (sorted by date desc, rank asc)
    // This ensures even if timezones differ, the latest 5 briefs always display.
    const { data: rawBriefs, error: briefError } = await supabase
      .from('daily_signal_briefs')
      .select('*')
      .order('date', { ascending: false })
      .order('rank', { ascending: true })
      .limit(5);

    if (briefError) {
      console.error('Brief fetch error:', briefError);
    }

    // If we got results, find what date the latest batch belongs to
    let briefDate = '';
    let briefs = [];
    
    if (rawBriefs && rawBriefs.length > 0) {
      const latestDateStr = rawBriefs[0].date;
      // Filter to only include briefs matching that exact latest date
      briefs = rawBriefs.filter(b => b.date === latestDateStr);
      briefDate = latestDateStr;
    }

    // 2. Fetch calibration scoreboard entities
    const { data: calibration, error: calError } = await supabase
      .from('calibration_ledger')
      .select('*')
      .order('calibration_score', { ascending: false });

    if (calError) {
      console.error('Calibration fetch error:', calError);
    }

    return res.status(200).json({
      ok: true,
      briefDate: briefDate || new Date().toISOString().split('T')[0],
      briefs: briefs || [],
      calibration: calibration || []
    });

  } catch (err) {
    console.error('Intelligence feed error:', err);
    return res.status(500).json({ 
      error: err.message || 'Internal server error while loading feed.' 
    });
  }
}
