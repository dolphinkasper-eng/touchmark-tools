const SIGNAL_CORE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    spokenSynthesis: { type: 'STRING' },
    verifiedTimeline: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          date: { type: 'STRING' },
          event: { type: 'STRING' }
        },
        required: ['date', 'event']
      }
    },
    narrativeManipulationAudit: { type: 'STRING' },
    constellationRarityScore: { type: 'INTEGER' },
    constellationRarityAnalysis: { type: 'STRING' },
    centerOfGravity: { type: 'STRING' },
    centerOfGravityLikelihood: { type: 'INTEGER' }
  },
  required: [
    'spokenSynthesis',
    'verifiedTimeline',
    'narrativeManipulationAudit',
    'constellationRarityScore',
    'constellationRarityAnalysis',
    'centerOfGravity',
    'centerOfGravityLikelihood'
  ]
};

const SIGNAL_DEEP_SCHEMA = {
  type: 'OBJECT',
  properties: {
    powerOperationBlueprint: { type: 'STRING' },
    scenarios: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          likelihood: { type: 'INTEGER' },
          caseFor: { type: 'STRING' },
          caseAgainst: { type: 'STRING' }
        },
        required: ['name', 'likelihood', 'caseFor', 'caseAgainst']
      }
    },
    diagnosticChecklist: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          primaryDocument: { type: 'STRING' },
          whatToLookFor: { type: 'STRING' }
        },
        required: ['primaryDocument', 'whatToLookFor']
      }
    },
    historicalPrecedents: { type: 'STRING' },
    spectrumPerspectives: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          lens: { type: 'STRING' },
          thinkerOrOutlet: { type: 'STRING' },
          coreThesis: { type: 'STRING' }
        },
        required: ['lens', 'thinkerOrOutlet', 'coreThesis']
      }
    },
    researchLibrary: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          authorOrChannel: { type: 'STRING' },
          format: { type: 'STRING' },
          perspectiveTag: { type: 'STRING' },
          takeaway: { type: 'STRING' },
          url: { type: 'STRING' },
          searchQuery: { type: 'STRING' }
        },
        required: [
          'title',
          'authorOrChannel',
          'format',
          'perspectiveTag',
          'takeaway',
          'url',
          'searchQuery'
        ]
      }
    }
  },
  required: [
    'powerOperationBlueprint',
    'scenarios',
    'diagnosticChecklist',
    'historicalPrecedents',
    'spectrumPerspectives',
    'researchLibrary'
  ]
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on Vercel.' });
  }

  try {
    const {
      action = 'analyze',
      prompt,
      factSheet = '',
      systemInstruction,
      responseSchema,
      useSearch = false,
      text,
      voiceName = 'Aoede',
      history = []
    } = req.body || {};

    // 1. STUDIO-GRADE HUMAN VOICE (Gemini 3.8 Flash-Lite TTS)
    if (action === 'speak') {
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Text is required for speech.' });
      }

      const ttsUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent?key=${apiKey}`;
      const ttsResponse = await fetch(ttsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text.slice(0, 3200) }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        })
      });

      const ttsData = await ttsResponse.json();
      if (!ttsResponse.ok) {
        return res.status(ttsResponse.status).json({
          error: ttsData?.error?.message || 'TTS generation failed.'
        });
      }

      const inlineAudio = ttsData?.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData?.data
      )?.inlineData;

      if (!inlineAudio?.data) {
        return res.status(502).json({ error: 'No audio returned from Gemini TTS.' });
      }

      return res.status(200).json({
        audioBase64: inlineAudio.data,
        mimeType: inlineAudio.mimeType || 'audio/pcm;rate=24000'
      });
    }

    // 2. WARM COPILOT CHAT MODE
    if (action === 'chat') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const chatInstruction = `You are Touchmark, a sharp, grounded, perceptive relational and geopolitical/epistemic intelligence copilot.
The user is greeting you, checking their mic, or warming up before exploring a decision (Pulse) or dissecting a public event/narrative (Signal).
- Speak like a thoughtful, unhurried human peer—warm, candid, and genuinely present.
- Keep your reply to 2–3 natural spoken sentences (no markdown, no bullet points).
- Confirm you hear them clearly if they asked, and invite them to bring whatever situation, power dynamic, or public narrative they want to examine beneath the surface.`;

      const contents = [
        ...history.slice(-6).map((turn) => ({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const replyText = await callGeminiRobust(
        apiKey,
        {
          contents,
          systemInstruction: { parts: [{ text: chatInstruction }] },
          generationConfig: {
            temperature: 0.72,
            maxOutputTokens: 280
          }
        },
        ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
      );

      return res.status(200).json({ reply: replyText });
    }

    // 2B. LIVE TRENDING INQUIRIES (Cached at CDN edge for 1 hour)
    if (action === 'trending') {
      const trendingPrompt = `Identify 3 major current public controversies, legal/political developments, or institutional narratives people are actively debating right now. Frame each as a concise, single-sentence Touchmark Signal inquiry (under 14 words each) that invites looking beneath the mainstream framing. Return valid JSON ONLY as an array of 3 strings: ["...", "...", "..."]`;

      const rawTrending = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: trendingPrompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 300
          }
        },
        ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
      );

      const cleaned = rawTrending.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      const prompts =
        firstBracket !== -1 && lastBracket !== -1
          ? JSON.parse(cleaned.slice(firstBracket, lastBracket + 1))
          : [];

      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json({ prompts: Array.isArray(prompts) ? prompts.slice(0, 3) : [] });
    }

    // 3A. PROGRESSIVE SIGNAL STAGE 1 (Guaranteed Valid JSON Schema)
    if (action === 'signal_core') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const searchResult = await runLiveFactRetrieval(apiKey, prompt);
      const enrichedPrompt = searchResult.factSheet
        ? `${prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET & PRIMARY RECORD ===\n${searchResult.factSheet}\n\nAnchor all dates, counts, verdicts, and chronologies accurately using this verified fact sheet.`
        : prompt;

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: enrichedPrompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
            responseSchema: SIGNAL_CORE_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      return res.status(200).json({
        text: rawText,
        factSheet: searchResult.factSheet,
        groundingSources: searchResult.sources
      });
    }

    // 3B. PROGRESSIVE SIGNAL STAGE 2 (Guaranteed Valid JSON Schema for Sections 5–10)
    if (action === 'signal_deep') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const enrichedPrompt = factSheet
        ? `${prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET & PRIMARY RECORD ===\n${factSheet}`
        : prompt;

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: enrichedPrompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 6144,
            responseMimeType: 'application/json',
            responseSchema: SIGNAL_DEEP_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      return res.status(200).json({ text: rawText });
    }

    // 4. STANDARD PULSE / FALLBACK ANALYSIS
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    let enrichedPrompt = prompt;
    let groundingSources = [];

    if (useSearch) {
      const searchResult = await runLiveFactRetrieval(apiKey, prompt);
      if (searchResult.factSheet) {
        enrichedPrompt = `${prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET & PRIMARY RECORD ===\n${searchResult.factSheet}`;
        groundingSources = searchResult.sources;
      }
    }

    const activeSchema =
      responseSchema || (prompt.includes('Stage 2') ? SIGNAL_DEEP_SCHEMA : undefined);

    const generationConfig = {
      temperature: 0.4,
      maxOutputTokens: 6144
    };

    if (activeSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = activeSchema;
    }

    const payload = {
      contents: [{ role: 'user', parts: [{ text: enrichedPrompt }] }],
      generationConfig
    };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const rawText = await callGeminiRobust(apiKey, payload, [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite'
    ]);

    return res.status(200).json({ text: rawText, groundingSources });
  } catch (err) {
    console.error('Touchmark /api/discern error:', err);
    return res.status(500).json({
      error: err.message || 'Unexpected server error in /api/discern.'
    });
  }
}

async function runLiveFactRetrieval(apiKey, query) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Gather a concise, factual, chronological intelligence brief on this query using Google Search. Include exact dates, counts, verdicts, investigative timelines, official findings, and primary public documents: "${query}"`
              }
            ]
          }
        ],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1400
        }
      })
    });

    const data = await response.json();
    if (!response.ok) return { factSheet: '', sources: [] };

    const candidate = data?.candidates?.[0];
    const factSheet =
      candidate?.content?.parts
        ?.map((p) => p.text || '')
        .join('')
        .trim() || '';

    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c) => c.web?.uri && c.web?.title)
      .map((c) => ({ title: c.web.title, url: c.web.uri }))
      .slice(0, 6);

    return { factSheet, sources };
  } catch {
    return { factSheet: '', sources: [] };
  }
}

async function callGeminiRobust(apiKey, payload, models) {
  let lastError = 'Gemini request failed.';

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) {
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('')
        .trim();
      if (text) return text;
      lastError = `Empty response from ${model}.`;
      continue;
    }

    lastError = data?.error?.message || `HTTP ${response.status} from ${model}`;
  }

  throw new Error(lastError);
}
