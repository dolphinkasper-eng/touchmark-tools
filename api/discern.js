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

    // 2. WARM COPILOT CHAT MODE
    if (action === 'chat') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const chatInstruction = `You are Touchmark, a warm, grounded, perceptive relational and epistemic copilot.
The user is greeting you, checking their mic, or warming up before exploring a decision (Pulse) or auditing a public event/claim (Signal).
- Speak like a thoughtful, unhurried human peer—warm, clear, and genuinely present.
- Keep your reply to 1–3 concise, natural spoken sentences (no markdown, no bullet points, no robotic disclaimers).
- Confirm you hear them clearly if they asked, and gently invite them to share what's on their mind.`;

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
          maxOutputTokens: 200
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
  }

  throw new Error(lastError);
}
