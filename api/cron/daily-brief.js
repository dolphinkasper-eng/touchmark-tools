const DAILY_BRIEF_SCHEMA = {
  type: 'OBJECT',
  properties: {
    briefs: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          rank: { type: 'INTEGER' },
          headline: { type: 'STRING' },
          inquiry_prompt: { type: 'STRING' },
          domain_tag: { type: 'STRING' },
          rarity_score: { type: 'INTEGER' },
          curation_score: { type: 'INTEGER' },
          coordination_score: { type: 'INTEGER' },
          gravity_likelihood: { type: 'INTEGER' },
          center_of_gravity: { type: 'STRING' },
          omitted_fact: { type: 'STRING' }
        },
        required: [
          'rank',
          'headline',
          'inquiry_prompt',
          'domain_tag',
          'rarity_score',
          'curation_score',
          'coordination_score',
          'gravity_likelihood',
          'center_of_gravity',
          'omitted_fact'
        ]
      }
    }
  },
  required: ['briefs']
};

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized cron invocation.' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!geminiKey || !supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      error: 'Missing GEMINI_API_KEY, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY.'
    });
  }

  try {
    const searchUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`;
    const searchRes = await fetch(searchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Identify the 5 most consequential global legal, regulatory, economic, or geopolitical developments right now where mainstream media framing diverges sharply from primary documents or structural incentives. Provide exact dates, statutory/policy details, and key actors.`
              }
            ]
          }
        ],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1800 }
      })
    });

    const searchData = await searchRes.json();
    const candidate = searchData?.candidates?.[0];
    const factSheet =
      candidate?.content?.parts?.map((p) => p.text || '').join('').trim() || '';
    const sources = (candidate?.groundingMetadata?.groundingChunks || [])
      .filter((c) => c.web?.uri && c.web?.title)
      .map((c) => ({ title: c.web.title, url: c.web.uri }))
      .slice(0, 8);

    const structUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`;
    const structRes = await fetch(structUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Convert this verified intelligence sweep into Touchmark's Daily Top-5 Signal Brief (ranked 1 to 5).
For each item:
- "headline": crisp 8-12 word analytical title
- "inquiry_prompt": a single-sentence Touchmark Signal prompt the user can click to launch a full forensic dossier
- "domain_tag": e.g. "Monetary Policy", "AI & Compute", "Constitutional Law", "Geopolitics", "Regulatory Capture"
- "center_of_gravity": 1-2 sentences naming the core structural incentive
- "omitted_fact": 1 sentence identifying the key primary-record detail left out of mainstream coverage

VERIFIED SWEEP:
${factSheet}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 3200,
          responseMimeType: 'application/json',
          responseSchema: DAILY_BRIEF_SCHEMA
        }
      })
    });

    const structData = await structRes.json();
    const rawJson =
      structData?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim() || '{}';
    const parsed = JSON.parse(rawJson);
    const todayIso = new Date().toISOString().slice(0, 10);

    const rows = (parsed.briefs || []).slice(0, 5).map((item, idx) => ({
      brief_date: todayIso,
      rank: item.rank || idx + 1,
      headline: item.headline,
      inquiry_prompt: item.inquiry_prompt,
      domain_tag: item.domain_tag || 'Public Record',
      rarity_score: Math.max(0, Math.min(100, Number(item.rarity_score) || 65)),
      curation_score: Math.max(0, Math.min(100, Number(item.curation_score) || 70)),
      coordination_score: Math.max(0, Math.min(100, Number(item.coordination_score) || 60)),
      gravity_likelihood: Math.max(0, Math.min(100, Number(item.gravity_likelihood) || 72)),
      center_of_gravity: item.center_of_gravity,
      omitted_fact: item.omitted_fact,
      sources
    }));

    const sbRes = await fetch(
      `${supabaseUrl}/rest/v1/daily_signal_briefs?on_conflict=brief_date,rank`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify(rows)
      }
    );

    if (!sbRes.ok) {
      const errText = await sbRes.text();
      throw new Error(`Supabase upsert failed: ${errText}`);
    }

    return res.status(200).json({ ok: true, date: todayIso, count: rows.length });
  } catch (err) {
    console.error('Daily brief cron error:', err);
    return res.status(500).json({ error: err.message || 'Cron execution failed.' });
  }
}
