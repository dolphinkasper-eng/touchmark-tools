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
          contents: [{ parts: [{ text: text.slice(0, 1200) }] }],
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

    // 2. WARM COPILOT CHAT MODE (Conversational check-ins & thinking out loud)
    if (action === 'chat') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const chatInstruction = `${systemInstruction || ''}

You are Touchmark, a warm, grounded, perceptive relational and epistemic copilot.
The user is greeting you, checking their mic, warming up, or thinking out loud before diving into a specific decision (Pulse) or public claim audit (Signal).
- Respond like a thoughtful human peer—calm, present, unhurried, and genuinely glad to hear them.
- Keep your reply to 1–3 concise, natural spoken sentences (no markdown bullets, no robotic disclaimers, no "I cannot create a query").
- Confirm you hear them clearly if they asked, reflect what they shared, and gently ask what decision, tension, or claim they would like to explore together.`;

      const contents = [
        ...history.slice(-6).map((turn) => ({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ];

      const replyText = await callGeminiWithFallback(apiKey, {
        contents,
        systemInstruction: { parts: [{ text: chatInstruction }] },
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 220
        }
      });

      return res.status(200).json({ reply: replyText });
    }

    // 3. STRUCTURED PULSE / SIGNAL DISCERNMENT
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const generationConfig = {
      temperature: 0.45
    };

    if (responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = responseSchema;
    } else if (useSearch) {
      generationConfig.responseMimeType = 'application/json';
    }

    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig
    };

    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    if (useSearch) {
      payload.tools = [{ google_search: {} }];
    }

    const rawText = await callGeminiWithFallback(apiKey, payload);
    return res.status(200).json({ text: rawText });
  } catch (err) {
    console.error('Touchmark /api/discern error:', err);
    return res.status(500).json({
      error: err.message || 'Unexpected server error in /api/discern.'
    });
  }
}

async function callGeminiWithFallback(apiKey, payload) {
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite'];
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
    // If search grounding + JSON mime conflict on a model, retry without strict mimeType
    if (payload.tools && payload.generationConfig?.responseMimeType) {
      const retryPayload = {
        ...payload,
        generationConfig: { ...payload.generationConfig }
      };
      delete retryPayload.generationConfig.responseMimeType;
      const retryRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(retryPayload)
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
  }

  throw new Error(lastError);
}
