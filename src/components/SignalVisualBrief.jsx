import React, { useState } from 'react';

export default function SignalVisualBrief({ visualBrief }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!visualBrief || !Array.isArray(visualBrief.metrics) || visualBrief.metrics.length === 0) {
    return null;
  }

  const {
    chart_title = 'Signal & Incentive Breakdown',
    chart_subtitle = 'Forensic evidence & alignment index (0–100)',
    metrics = [],
    web_image = null,
  } = visualBrief;

  const showImage = Boolean(web_image?.url) && !imgFailed;
  const rowHeight = 46;
  const svgHeight = Math.min(metrics.length, 5) * rowHeight + 16;

  return (
    <section
      className="signal-visual-brief my-6 rounded-xl border border-amber-500/25 bg-slate-900/80 p-5 print:border-slate-300 print:bg-white print:text-slate-900"
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
    >
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-2.5 print:border-slate-200">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 print:text-amber-700">
            Visual Intelligence Brief
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-slate-100 print:text-slate-900">
            {chart_title}
          </h3>
          {chart_subtitle && (
            <p className="text-xs text-slate-400 print:text-slate-600">{chart_subtitle}</p>
          )}
        </div>
      </div>

      <div className={`grid gap-5 ${showImage ? 'md:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Pure Vector SVG Horizontal Bar Chart */}
        <div className={showImage ? 'md:col-span-7' : 'col-span-1'}>
          <svg
            viewBox={`0 0 520 ${svgHeight}`}
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label={chart_title}
          >
            <defs>
              <linearGradient id="touchmarkAmberBar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {metrics.slice(0, 5).map((item, idx) => {
              const y = idx * rowHeight + 8;
              const clamped = Math.max(0, Math.min(100, Number(item.value) || 0));
              const barMaxWidth = 340;
              const barWidth = Math.round((clamped / 100) * barMaxWidth);

              return (
                <g key={idx} transform={`translate(0, ${y})`}>
                  <text
                    x="0"
                    y="12"
                    className="fill-slate-200 print:fill-slate-900"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {item.label}
                  </text>
                  {item.note && (
                    <text
                      x="520"
                      y="12"
                      textAnchor="end"
                      className="fill-slate-400 print:fill-slate-500"
                      fontSize="10.5"
                    >
                      {item.note}
                    </text>
                  )}

                  {/* Track */}
                  <rect
                    x="0"
                    y="19"
                    width={barMaxWidth}
                    height="10"
                    rx="5"
                    fill="#1e293b"
                    className="print:fill-slate-200"
                  />

                  {/* Value Bar */}
                  <rect
                    x="0"
                    y="19"
                    width={Math.max(6, barWidth)}
                    height="10"
                    rx="5"
                    fill="url(#touchmarkAmberBar)"
                  />

                  {/* Numeric Readout */}
                  <text
                    x={barMaxWidth + 12}
                    y="28"
                    className="fill-amber-400 print:fill-amber-700"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {clamped}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Optional Verified Context Image */}
        {showImage && (
          <figure className="flex flex-col justify-between overflow-hidden rounded-lg border border-slate-800 bg-slate-950/60 print:border-slate-200 print:bg-slate-50 md:col-span-5">
            <img
              src={web_image.url}
              alt={web_image.title || chart_title}
              onError={() => setImgFailed(true)}
              crossOrigin="anonymous"
              className="h-36 w-full object-cover"
            />
            <figcaption className="px-3 py-2 text-[11px] leading-snug text-slate-400 print:text-slate-600">
              <span className="line-clamp-1 font-medium text-slate-300 print:text-slate-800">
                {web_image.title}
              </span>
              {web_image.source && (
                <span className="block text-[10px] text-slate-500">
                  Source: {web_image.source}
                </span>
              )}
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
