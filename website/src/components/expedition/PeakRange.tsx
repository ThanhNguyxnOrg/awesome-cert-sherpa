import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

export type Peak = {
  setId: string;
  cert: string;
  vendor: string;
  category: string;
  questionCount: number;
  /**
   * Higher value ⇒ taller mountain silhouette. We map it from question
   * count so the gallery feels like a real horizon line.
   */
  altitude: number;
};

const PALETTE = [
  '#0e5a8a',
  '#2b6e5a',
  '#e07a2f',
  '#5a6473',
  '#0c4f7a',
  '#1f5448',
  '#c2641f',
];

type Props = {
  peaks: Peak[];
};

/**
 * The "14 Peaks" gallery — a horizon line built from triangular SVG
 * peaks. Each peak is a link to /practice with the set preselected.
 */
export function PeakRange({peaks}: Props): ReactNode {
  const max = Math.max(...peaks.map((p) => p.altitude), 1);

  return (
    <div className="not-prose relative overflow-x-auto pb-4">
      <div
        className="relative flex min-w-full items-end gap-2 px-2"
        style={{minHeight: 280}}>
        {peaks.map((peak, idx) => {
          const heightPct = 35 + (peak.altitude / max) * 60;
          const colour = PALETTE[idx % PALETTE.length];
          return (
            <Link
              key={peak.setId}
              to={`/practice?set=${peak.setId}`}
              className="group relative flex flex-1 flex-col items-center justify-end no-underline focus-visible:outline-none"
              style={{minWidth: 110}}
              aria-label={`${peak.cert} — ${peak.questionCount} questions`}>
              <span
                className="font-mono-cs opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: 'var(--muted-foreground)',
                  marginBottom: 4,
                }}>
                ▲ {peak.questionCount} Qs
              </span>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2 group-focus-visible:-translate-y-2"
                style={{height: `${heightPct}%`}}
                aria-hidden>
                <polygon
                  points="50,4 96,96 4,96"
                  fill={colour}
                  opacity="0.92"
                />
                <polygon
                  points="50,4 64,28 50,38 36,28"
                  fill="#ffffff"
                  opacity="0.65"
                />
                <line
                  x1="50"
                  y1="4"
                  x2="4"
                  y2="96"
                  stroke="var(--paper)"
                  strokeOpacity="0.12"
                  strokeWidth="0.5"
                />
              </svg>
              <div
                className="mt-2 text-center"
                style={{minHeight: 38}}>
                <div
                  className="font-display"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                  }}>
                  {peak.cert}
                </div>
                <div
                  className="font-mono-cs"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    color: 'var(--muted-foreground)',
                  }}>
                  {peak.vendor.toUpperCase()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div
        aria-hidden
        className="absolute bottom-9 left-0 right-0 h-px"
        style={{background: 'rgba(15,27,45,0.15)'}}
      />
    </div>
  );
}

export default PeakRange;
