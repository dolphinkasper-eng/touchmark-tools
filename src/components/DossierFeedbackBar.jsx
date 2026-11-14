import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DossierFeedbackBar({
  tool = 'signal',
  tier = 'free',
  userId = null,
  userEmail = null,
  promptPreview = '',
}) {
  const [rating, setRating] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(selectedRating = rating) {
    if (!selectedRating) return;
    setStatus('submitting');

    const { error } = await supabase.from('feedback').insert({
      user_id: userId || null,
      user_email: userEmail || null,
      tier: tier || 'free',
      tool: tool || 'signal',
      rating: selectedRating,
      note: note.trim() || null,
      prompt_preview: (promptPreview || '').slice(0, 180),
    });

    if (error) {
      console.error('Feedback insert error:', error);
      setStatus('error');
      return;
    }

    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="print:hidden mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-3 text-xs text-emerald-300">
        <span>Signal logged — thank you for sharpening Touchmark during our Founding release.</span>
        <button
          type="button"
          onClick={() => {
            setRating(null);
            setNote('');
            setStatus('idle');
          }}
          className="text-emerald-400 underline hover:text-emerald-200"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="print:hidden mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Founding Member Calibration
          </p>
          <p className="text-xs text-slate-400">
            Did this dossier cut through the noise or miss an angle?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRating('helpful')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              rating === 'helpful'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600'
            }`}
          >
            Hit the Mark
          </button>
          <button
            type="button"
            onClick={() => setRating('missed')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              rating === 'missed'
                ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                : 'border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-600'
            }`}
          >
            Missed Something
          </button>
        </div>
      </div>

      {rating && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              rating === 'helpful'
                ? 'Optional: Which section or insight was sharpest?'
                : 'Optional: What did it miss, overstate, or get wrong?'
            }
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="button"
            disabled={status === 'submitting'}
            onClick={() => handleSubmit(rating)}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Saving...' : 'Send Note'}
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="mt-2 text-xs text-rose-400">
          Could not save note right now—check your connection and try again.
        </p>
      )}
    </div>
  );
}
