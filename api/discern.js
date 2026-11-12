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

    // 3. TWO-STAGE GROUNDED INTELLIGENCE SYNTHESIS
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    let enrichedPrompt = prompt;
    let groundingSources = [];

    // Stage A: Dedicated Live Search Grounding Pass for hard dates, counts, timelines & primary docs
    if (useSearch) {
      const searchResult = await runLiveFactRetrieval(apiKey, prompt);
      if (searchResult.factSheet) {
        enrichedPrompt = `${prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET & PRIMARY RECORD ===\n${searchResult.factSheet}\n\nIMPORTANT: Anchor all dates, counts, verdicts, chronologies, and primary documents accurately using the verified fact sheet above (correcting any minor premise inaccuracies in the user's question respectfully), and then apply Touchmark's full counter-narrative, institutional-power, and multi-scenario analysis.`;
        groundingSources = searchResult.sources;
      }
    }

    // Stage B: Structured Intelligence & Counter-Narrative Synthesis
    const generationConfig = {
      temperature: 0.45,
      maxOutputTokens: 8192,
      thinkingConfig: { thinkingLevel: 'LOW' }
    };

    if (responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = responseSchema;
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Gather a precise, factual, chronological intelligence briefing on this query using Google Search. Include exact dates, counts, verdicts, ages/numbers, investigative timelines, official findings, internal audits, and primary public documents: "${query}"`
              }
            ]
          }
        ],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
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

    if (payload.generationConfig?.thinkingConfig) {
      const fallbackPayload = {
        ...payload,
        generationConfig: { ...payload.generationConfig }
      };
      delete fallbackPayload.generationConfig.thinkingConfig;
      const retryRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload)
      });
      const retryData = await retryRes.json();
      if (retryRes.ok) {
        const retryText = retryData?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || '')
          .join('')
          .trim();
        if (retryText) return retryText;
      }
    }

    lastError = data?.error?.message || `HTTP ${response.status} from ${model}`;
  }

  throw new Error(lastError);
}
