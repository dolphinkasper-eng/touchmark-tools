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
    visual_brief: {
      type: 'OBJECT',
      properties: {
        chart_type: { type: 'STRING' },
        chart_title: { type: 'STRING' },
        chart_subtitle: { type: 'STRING' },
        metrics: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              label: { type: 'STRING' },
              value: { type: 'INTEGER' },
              note: { type: 'STRING' }
            },
            required: ['label', 'value', 'note']
          }
        },
        image_query: {
          type: 'STRING',
          description:
            'A concise 2-to-3 word encyclopedic noun phrase for a concrete physical landmark, institution headquarters, public figure, or historical artifact (e.g., "European Central Bank", "Federal Reserve Building", "United States Capitol"). Never use abstract sentences.'
        }
      },
      required: ['chart_type', 'chart_title', 'chart_subtitle', 'metrics', 'image_query']
    },
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
    'visual_brief',
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

const PERSPECTIVE_SYNTHESIS_SCHEMA = {
  type: 'OBJECT',
  properties: {
    nineLensMatrix: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          alignment: { type: 'STRING' },
          framework: { type: 'STRING' },
          representativeVoice: { type: 'STRING' },
          coreFraming: { type: 'STRING' },
          blindSpot: { type: 'STRING' }
        },
        required: ['alignment', 'framework', 'representativeVoice', 'coreFraming', 'blindSpot']
      }
    },
    customLensSynthesis: {
      type: 'OBJECT',
      properties: {
        targetLens: { type: 'STRING' },
        lensCategory: { type: 'STRING' },
        coreThesis: { type: 'STRING' },
        whatItSpotlights: { type: 'STRING' },
        structuralBlindSpot: { type: 'STRING' }
      },
      required: [
        'targetLens',
        'lensCategory',
        'coreThesis',
        'whatItSpotlights',
        'structuralBlindSpot'
      ]
    }
  },
  required: ['nineLensMatrix']
};

const ENTITY_AUDIT_SCHEMA = {
  type: 'OBJECT',
  properties: {
    spokenSynthesis: { type: 'STRING' },
    entityName: { type: 'STRING' },
    entityType: { type: 'STRING' },
    alignmentLane: { type: 'STRING' },
    auditWindow: { type: 'STRING' },
    claimVeracityScore: { type: 'INTEGER' },
    claimVeracityLabel: { type: 'STRING' },
    claimVeracitySummary: { type: 'STRING' },
    predictiveCalibrationScore: { type: 'INTEGER' },
    predictiveCalibrationLabel: { type: 'STRING' },
    predictiveCalibrationSummary: { type: 'STRING' },
    correctionIntegrityScore: { type: 'INTEGER' },
    correctionIntegrityLabel: { type: 'STRING' },
    correctionIntegritySummary: { type: 'STRING' },
    structuralIndependenceScore: { type: 'INTEGER' },
    structuralIndependenceLabel: { type: 'STRING' },
    structuralIndependenceSummary: { type: 'STRING' },
    overallCalibrationScore: { type: 'INTEGER' },
    notableAuditNote: { type: 'STRING' },
    claimToOutcomeLedger: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          claimDate: { type: 'STRING' },
          topic: { type: 'STRING' },
          originalClaimOrPrediction: { type: 'STRING' },
          subsequentPrimaryRecord: { type: 'STRING' },
          outcomeGrade: { type: 'STRING' }
        },
        required: [
          'claimDate',
          'topic',
          'originalClaimOrPrediction',
          'subsequentPrimaryRecord',
          'outcomeGrade'
        ]
      }
    },
    correctionBehaviorAudit: { type: 'STRING' },
    structuralIncentiveProfile: { type: 'STRING' }
  },
  required: [
    'spokenSynthesis',
    'entityName',
    'entityType',
    'alignmentLane',
    'auditWindow',
    'claimVeracityScore',
    'claimVeracityLabel',
    'claimVeracitySummary',
    'predictiveCalibrationScore',
    'predictiveCalibrationLabel',
    'predictiveCalibrationSummary',
    'correctionIntegrityScore',
    'correctionIntegrityLabel',
    'correctionIntegritySummary',
    'structuralIndependenceScore',
    'structuralIndependenceLabel',
    'structuralIndependenceSummary',
    'overallCalibrationScore',
    'notableAuditNote',
    'claimToOutcomeLedger',
    'correctionBehaviorAudit',
    'structuralIncentiveProfile'
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

    if (action === 'classify_intent') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const classifyPrompt = `Determine whether the user's primary goal is:
1. "entity_audit": Auditing the multi-month or multi-year track record, claim accuracy, predictive calibration, funding incentives, or correction integrity of a SPECIFIC named person, media outlet, think tank, government agency, or institution.
2. "signal_event": Investigating an event, policy, bill, controversy, industry trend, or public narrative.

Respond with valid JSON ONLY: {"route":"entity_audit"|"signal_event","entityName":"extracted name or empty string"}
User prompt: "${prompt.replace(/"/g, '\\"')}"`;

      const rawRoute = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: classifyPrompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 120 }
        },
        ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
      );

      const cleaned = rawRoute.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      const decision =
        firstBrace !== -1 && lastBrace !== -1
          ? JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
          : { route: 'signal_event', entityName: '' };

      return res.status(200).json(decision);
    }

    if (action === 'entity_audit') {
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }

      const [claimsSweep, outcomesSweep, correctionsSweep] = await Promise.all([
        runLiveFactRetrieval(
          apiKey,
          `Major public claims, forecasts, and high-profile reporting or positions made over the past 1 to 3 years regarding: ${prompt}`
        ),
        runLiveFactRetrieval(
          apiKey,
          `Subsequent official data, court rulings, empirical outcomes, and primary records testing claims in: ${prompt}`
        ),
        runLiveFactRetrieval(
          apiKey,
          `Corrections, retractions, editor notes, funding disclosures, or accountability controversies involving: ${prompt}`
        )
      ]);

      const combinedSources = [
        ...claimsSweep.sources,
        ...outcomesSweep.sources,
        ...correctionsSweep.sources
      ].slice(0, 10);

      const auditPrompt = `Conduct a rigorous, non-partisan Multi-Year Track-Record & Epistemic Integrity Audit for:
USER INQUIRY: "${prompt}"

=== SWEEP 1: DATED CLAIMS & PREDICTIONS ===
${claimsSweep.factSheet || 'Use verified historical public records.'}

=== SWEEP 2: SUBSEQUENT PRIMARY OUTCOMES ===
${outcomesSweep.factSheet || 'Compare against verified primary records.'}

=== SWEEP 3: CORRECTIONS, RETRACTIONS & INCENTIVES ===
${correctionsSweep.factSheet || 'Evaluate correction transparency and institutional funding/incentives.'}

Rules:
- Anchor every entry in "claimToOutcomeLedger" to specific dates and verifiable primary outcomes (courts, statutory filings, official statistics, or documented retractions).
- Never use partisan insults; document exact claim-to-outcome deltas and how the entity behaved when proven wrong.`;

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: auditPrompt }] }],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 5200,
            responseMimeType: 'application/json',
            responseSchema: ENTITY_AUDIT_SCHEMA
          }
        },
        ['gemini-3.8-flash', 'gemini-3.5-flash-lite']
      );

      try {
        const parsedAudit = JSON.parse(rawText);
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && supabaseServiceKey && parsedAudit?.entityName) {
          const ledger = Array.isArray(parsedAudit.claimToOutcomeLedger)
            ? parsedAudit.claimToOutcomeLedger
            : [];
          const hits = ledger.filter((c) => c.outcomeGrade === 'Confirmed by Record').length;
          const omissions = ledger.filter(
            (c) =>
              c.outcomeGrade === 'Refuted by Record' || c.outcomeGrade === 'Goalpost Shifted'
          ).length;

          await fetch(
            `${supabaseUrl}/rest/v1/calibration_ledger?on_conflict=entity_name`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: supabaseServiceKey,
                Authorization: `Bearer ${supabaseServiceKey}`,
                Prefer: 'resolution=merge-duplicates'
              },
              body: JSON.stringify([
                {
                  entity_name: parsedAudit.entityName,
                  entity_type: parsedAudit.entityType || 'Institution',
                  alignment_lane: parsedAudit.alignmentLane || 'Institutional',
                  tracked_claims: Math.max(ledger.length, 1),
                  verified_hits: hits,
                  omission_flags: omissions,
                  calibration_score: Math.max(
                    0,
                    Math.min(100, Number(parsedAudit.overallCalibrationScore) || 50)
                  ),
                  notable_audit_note: parsedAudit.notableAuditNote || '',
                  last_audited_at: new Date().toISOString()
                }
              ])
            }
          );
        }
      } catch (ledgerErr) {
        console.error('Calibration ledger auto-upsert skipped:', ledgerErr);
      }

      return res.status(200).json({
        text: rawText,
        groundingSources: combinedSources
      });
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

      const finalText = await attachVerifiedEditorialImage(rawText);

      return res.status(200).json({
        text: finalText,
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
        ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
      );

      return res.status(200).json({ text: rawText });
    }

    if (action === 'signal_perspectives') {
      const {
        includeNineLenses = false,
        customLens = '',
        dossierContext = ''
      } = req.body || {};

      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Inquiry prompt is required.' });
      }
      if (!includeNineLenses && !customLens.trim()) {
        return res.status(400).json({ error: 'Select 9-Lens Synthesis or enter a custom lens.' });
      }

      const perspectivePrompt = `Examine this verified Touchmark Signal investigation:
INQUIRY: "${prompt}"
VERIFIED RECORD & CONTEXT:
${dossierContext || factSheet || 'Use established public records.'}

${
  includeNineLenses
    ? `TASK A — 9-LENS SPECTRUM MATRIX (3 Left, 3 Center, 3 Right):
Synthesize how 9 distinct analytical frameworks interpret this exact verified record—3 Left/Progressive (1. Institutional & Constitutional History, 2. Anti-Corporate / Populist Left, 3. Empirical Policy & Governance), 3 Center/Heterodox (4. Heterodox Press & Institutional Critique, 5. Civil Libertarian / Anti-Establishment Populism, 6. First-Principles Empirical Centrism), and 3 Right/Conservative (7. Constitutional Originalism & Free-Market Right, 8. Traditionalist / Burkean Conservatism, 9. Nationalist & State-Skeptic Right).
For each of the 9 items, name the most relevant real-world thinker, outlet, or publication known for that exact framework on this topic ("representativeVoice"), summarize their strongest evidence-anchored argument ("coreFraming"), and identify what their framework systematically overlooks ("blindSpot").`
    : 'TASK A: Return an empty array [] for nineLensMatrix.'
}

${
  customLens.trim()
    ? `TASK B — CUSTOM LENS SIMULATION ("${customLens.trim()}"):
Model how "${customLens.trim()}" (whether a specific commentator, publication, think tank, government institution, or professional role) would analyze this verified record. Ground the synthesis in their known methodology, incentives, and worldview ("coreThesis" and "whatItSpotlights"), and candidly state their "structuralBlindSpot".`
    : 'TASK B: Omit customLensSynthesis.'
}`;

      const rawText = await callGeminiRobust(
        apiKey,
        {
          contents: [{ role: 'user', parts: [{ text: perspectivePrompt }] }],
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 4800,
            responseMimeType: 'application/json',
            responseSchema: PERSPECTIVE_SYNTHESIS_SCHEMA
          }
        },
        ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
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

async function attachVerifiedEditorialImage(rawJsonText) {
  try {
    const parsed = JSON.parse(rawJsonText);
    const rawQuery = parsed?.visual_brief?.image_query?.trim();
    if (!rawQuery) return rawJsonText;

    if (process.env.BRAVE_SEARCH_API_KEY) {
      const braveUrl = `https://api.search.brave.com/res/v1/images/search?q=${encodeURIComponent(rawQuery)}&count=3&safesearch=strict`;
      const imgRes = await fetch(braveUrl, {
        headers: {
          Accept: 'application/json',
          'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY
        }
      });

      if (imgRes.ok) {
        const data = await imgRes.json();
        const hit = (data.results || []).find(
          (item) => item?.properties?.url && item.properties.url.startsWith('https://')
        );
        if (hit) {
          parsed.visual_brief.web_image = {
            url: hit.properties.url,
            thumbnail: hit.thumbnail?.src || hit.properties.url,
            source: hit.source || new URL(hit.url).hostname.replace(/^www\./, ''),
            title: hit.title || rawQuery
          };
          return JSON.stringify(parsed);
        }
      }
    }

    const simplifiedQuery = rawQuery
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .slice(0, 3)
      .join(' ');

    const candidateQueries =
      simplifiedQuery && simplifiedQuery.toLowerCase() !== rawQuery.toLowerCase()
        ? [rawQuery, simplifiedQuery]
        : [rawQuery];

    for (const q of candidateQueries) {
      const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        `filetype:bitmap ${q}`
      )}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&format=json&origin=*`;

      const wikiRes = await fetch(wikiUrl, {
        headers: {
          'User-Agent': 'TouchmarkSignalBot/1.0 (https://touchmarktools.com; support@touchmarktools.com)',
          'Api-User-Agent': 'TouchmarkSignalBot/1.0 (https://touchmarktools.com; support@touchmarktools.com)'
        }
      });

      if (!wikiRes.ok) continue;

      const wikiData = await wikiRes.json();
      const pages = Object.values(wikiData?.query?.pages || {}).sort(
        (a, b) => (a.index || 99) - (b.index || 99)
      );

      const validPage = pages.find((p) => {
        const info = p?.imageinfo?.[0];
        const url = info?.thumburl || info?.url || '';
        return url.startsWith('https://') && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url);
      });

      if (validPage) {
        const info = validPage.imageinfo[0];
        const cleanTitle = (validPage.title || q)
          .replace(/^File:/i, '')
          .replace(/\.[a-z0-9]+$/i, '')
          .replace(/_/g, ' ');
        parsed.visual_brief.web_image = {
          url: info.thumburl || info.url,
          thumbnail: info.thumburl || info.url,
          source: 'Wikimedia Commons',
          title: cleanTitle
        };
        return JSON.stringify(parsed);
      }
    }
  } catch (err) {
    console.error('Editorial image lookup skipped:', err);
  }

  return rawJsonText;
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
