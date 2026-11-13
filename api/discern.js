const SIGNAL_CORE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    spokenSynthesis: { type: 'STRING' },
    constellationRarityScore: { type: 'INTEGER' },
    constellationRarityLabel: { type: 'STRING' },
    constellationRaritySummary: { type: 'STRING' },
    narrativeCurationScore: { type: 'INTEGER' },
    narrativeCurationLabel: { type: 'STRING' },
    narrativeCurationSummary: { type: 'STRING' },
    coordinationEvidenceScore: { type: 'INTEGER' },
    coordinationEvidenceLabel: { type: 'STRING' },
    coordinationEvidenceSummary: { type: 'STRING' },
    centerOfGravityLikelihood: { type: 'INTEGER' },
    centerOfGravityLabel: { type: 'STRING' },
    centerOfGravitySummary: { type: 'STRING' },
    verifiedTimeline: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          date: { type: 'STRING' },
          legalStatus: { type: 'STRING' },
          epistemicGrade: { type: 'STRING' },
          event: { type: 'STRING' }
        },
        required: ['date', 'legalStatus', 'epistemicGrade', 'event']
      }
    },
    narrativeManipulationAudit: { type: 'STRING' },
    constellationRarityAnalysis: { type: 'STRING' },
    centerOfGravity: { type: 'STRING' }
  },
  required: [
    'spokenSynthesis',
    'constellationRarityScore',
    'constellationRarityLabel',
    'constellationRaritySummary',
    'narrativeCurationScore',
    'narrativeCurationLabel',
    'narrativeCurationSummary',
    'coordinationEvidenceScore',
    'coordinationEvidenceLabel',
    'coordinationEvidenceSummary',
    'centerOfGravityLikelihood',
    'centerOfGravityLabel',
    'centerOfGravitySummary',
    'verifiedTimeline',
    'narrativeManipulationAudit',
    'constellationRarityAnalysis',
    'centerOfGravity'
  ]
};

const SIGNAL_DEEP_SCHEMA = {
  type: 'OBJECT',
  properties: {
    followThePower: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          vector: { type: 'STRING' },
          finding: { type: 'STRING' },
          epistemicGrade: { type: 'STRING' }
        },
        required: ['vector', 'finding', 'epistemicGrade']
      }
    },
    relationshipMap: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          sourceEntity: { type: 'STRING' },
          relationshipType: { type: 'STRING' },
          targetEntity: { type: 'STRING' },
          epistemicGrade: { type: 'STRING' }
        },
        required: ['sourceEntity', 'relationshipType', 'targetEntity', 'epistemicGrade']
      }
    },
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
    uncomfortableQuestions: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    investigationGap: {
      type: 'OBJECT',
      properties: {
        established: { type: 'ARRAY', items: { type: 'STRING' } },
        suspected: { type: 'ARRAY', items: { type: 'STRING' } },
        unknown: { type: 'ARRAY', items: { type: 'STRING' } },
        nextTargets: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['established', 'suspected', 'unknown', 'nextTargets']
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
          coreQuestion: { type: 'STRING' },
          thinkerOrOutlet: { type: 'STRING' },
          coreThesis: { type: 'STRING' }
        },
        required: ['lens', 'coreQuestion', 'thinkerOrOutlet', 'coreThesis']
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
          searchQuery: { type: 'STRING' }
        },
        required: [
          'title',
          'authorOrChannel',
          'format',
          'perspectiveTag',
          'takeaway',
          'searchQuery'
        ]
      }
    }
  },
  required: [
    'followThePower',
    'relationshipMap',
    'powerOperationBlueprint',
    'scenarios',
    'uncomfortableQuestions',
    'investigationGap',
    'diagnosticChecklist',
    'historicalPrecedents',
    'spectrumPerspectives',
    'researchLibrary'
  ]
};

// Ordered so compact arrays (shortFormPack, warnings, audit, visuals) populate BEFORE long-form scripts
const STUDIO_SCHEMA = {
  type: 'OBJECT',
  properties: {
    editorialHook: { type: 'STRING' },
    alternativeAngles: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          angleTitle: { type: 'STRING' },
          framing: { type: 'STRING' }
        },
        required: ['angleTitle', 'framing']
      }
    },
    shortFormPack: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          platform: { type: 'STRING' },
          hook: { type: 'STRING' },
          coreBeat: { type: 'STRING' },
          visualDirection: { type: 'STRING' }
        },
        required: ['platform', 'hook', 'coreBeat', 'visualDirection']
      }
    },
    doNotCompressWarnings: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    evidenceIntegrityAudit: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    visualAssetChecklist: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          timestampOrBeat: { type: 'STRING' },
          onScreenEvidence: { type: 'STRING' }
        },
        required: ['timestampOrBeat', 'onScreenEvidence']
      }
    },
    substackEssayDraft: { type: 'STRING' },
    youtubePodcastScript: { type: 'STRING' }
  },
  required: [
    'editorialHook',
    'alternativeAngles',
    'shortFormPack',
    'doNotCompressWarnings',
    'evidenceIntegrityAudit',
    'visualAssetChecklist',
    'substackEssayDraft',
    'youtubePodcastScript'
  ]
};

const REVISION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    revisionSummary: { type: 'STRING' },
    constellationRarityScore: { type: 'INTEGER' },
    constellationRarityLabel: { type: 'STRING' },
    constellationRaritySummary: { type: 'STRING' },
    narrativeCurationScore: { type: 'INTEGER' },
    narrativeCurationLabel: { type: 'STRING' },
    narrativeCurationSummary: { type: 'STRING' },
    coordinationEvidenceScore: { type: 'INTEGER' },
    coordinationEvidenceLabel: { type: 'STRING' },
    coordinationEvidenceSummary: { type: 'STRING' },
    centerOfGravityLikelihood: { type: 'INTEGER' },
    centerOfGravityLabel: { type: 'STRING' },
    centerOfGravitySummary: { type: 'STRING' },
    updatedCenterOfGravity: { type: 'STRING' },
    newTimelineEntry: {
      type: 'OBJECT',
      properties: {
        date: { type: 'STRING' },
        legalStatus: { type: 'STRING' },
        epistemicGrade: { type: 'STRING' },
        event: { type: 'STRING' }
      },
      required: ['date', 'legalStatus', 'epistemicGrade', 'event']
    }
  },
  required: [
    'revisionSummary',
    'constellationRarityScore',
    'constellationRarityLabel',
    'constellationRaritySummary',
    'narrativeCurationScore',
    'narrativeCurationLabel',
    'narrativeCurationSummary',
    'coordinationEvidenceScore',
    'coordinationEvidenceLabel',
    'coordinationEvidenceSummary',
    'centerOfGravityLikelihood',
    'centerOfGravityLabel',
    'centerOfGravitySummary',
    'updatedCenterOfGravity',
    'newTimelineEntry'
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

    if (action === 'chat') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const chatInstruction = `You are Touchmark, a sharp, grounded, perceptive relational and investigative intelligence copilot.
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

    if (action === 'signal_core') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const searchResult = await runLiveFactRetrieval(apiKey, prompt);
      const enrichedPrompt = searchResult.factSheet
        ? `${prompt}\n\n=== VERIFIED LIVE SEARCH FACT SHEET & PRIMARY RECORD ===\n${searchResult.factSheet}\n\nAnchor all dates, statutory provisions, counts, verdicts, and chronologies accurately using this verified fact sheet.`
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
            maxOutputTokens: 4500,
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
            maxOutputTokens: 6500,
            responseMimeType: 'application/json',
            responseSchema: SIGNAL_DEEP_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      return res.status(200).json({ text: rawText });
    }

    if (action === 'studio_create') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Dossier or external research context is required.' });
      }

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: STUDIO_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      return res.status(200).json({ text: rawText });
    }

    if (action === 'revise_investigation') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'New evidence or update text is required.' });
      }

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 3500,
            responseMimeType: 'application/json',
            responseSchema: REVISION_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      return res.status(200).json({ text: rawText });
    }

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
                text: `Gather a concise, factual, chronological intelligence brief on this query using Google Search. Include exact dates, statutory sections, counts, verdicts, investigative timelines, official findings, and primary public documents: "${query}"`
              }
            ]
          }
        ],
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500
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
      .slice(0, 8);

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
