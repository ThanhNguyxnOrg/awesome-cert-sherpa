import type {ReactNode} from 'react';

/**
 * Both scales the project uses:
 *   - "easy / medium / hard" for practice questions
 *   - "beginner / intermediate / advanced" for curated resources
 * plus the long-tail compound values that exist in resource YAML
 * (e.g. "beginner-intermediate", "intermediate-advanced").
 */
export type Difficulty =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'beginner-intermediate'
  | 'intermediate-advanced';

const meta: Record<
  Difficulty,
  {label: string; altitude: string; color: string}
> = {
  easy: {label: 'Foothills', altitude: '1,500 m', color: 'var(--foothills)'},
  beginner: {label: 'Foothills', altitude: '1,500 m', color: 'var(--foothills)'},
  'beginner-intermediate': {
    label: 'Tree line',
    altitude: '2,800 m',
    color: 'var(--foothills)',
  },
  medium: {label: 'Alpine', altitude: '4,000 m', color: 'var(--alpine)'},
  intermediate: {
    label: 'Alpine',
    altitude: '4,000 m',
    color: 'var(--alpine)',
  },
  'intermediate-advanced': {
    label: 'High camp',
    altitude: '6,000 m',
    color: 'var(--alpine)',
  },
  hard: {label: 'Death zone', altitude: '8,000 m', color: 'var(--deathzone)'},
  advanced: {
    label: 'Death zone',
    altitude: '8,000 m',
    color: 'var(--deathzone)',
  },
};

const FALLBACK = {
  label: 'Trail',
  altitude: '— m',
  color: 'var(--muted)',
};

type Props = {
  difficulty: Difficulty | string;
  className?: string;
};

/**
 * Altimeter pill — pairs a difficulty word with an altitude reading so
 * colour is never the only signal (a11y).
 *
 * Unknown values render as a neutral "Trail" chip rather than crashing.
 */
export function AltimeterChip({
  difficulty,
  className = '',
}: Props): ReactNode {
  const d = meta[difficulty as Difficulty] ?? FALLBACK;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono-cs ${className}`}
      style={{fontSize: 11, background: d.color, color: 'var(--ink)'}}
      aria-label={`Difficulty ${d.label}, ${d.altitude}`}>
      <span aria-hidden>▲</span>
      {d.label} · {d.altitude}
    </span>
  );
}

export default AltimeterChip;
