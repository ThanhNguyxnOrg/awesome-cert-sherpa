import type {ReactNode} from 'react';

type Props = {
  className?: string;
};

/**
 * Ambient topographic-map SVG used as a watermark behind heroes and
 * full-bleed sections. Pure decorative — `aria-hidden` on purpose.
 */
export function TopographicBackground({className = ''}: Props): ReactNode {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--contour)" strokeWidth="1.2">
        {Array.from({length: 14}).map((_, i) => {
          const r = 80 + i * 55;
          return (
            <ellipse
              // eslint-disable-next-line react/no-array-index-key
              key={`a-${i}`}
              cx="720"
              cy="500"
              rx={r * 1.4}
              ry={r}
              style={{opacity: 1 - i * 0.05}}
            />
          );
        })}
        {Array.from({length: 9}).map((_, i) => {
          const r = 40 + i * 38;
          return (
            <ellipse
              // eslint-disable-next-line react/no-array-index-key
              key={`b-${i}`}
              cx="220"
              cy="180"
              rx={r * 1.2}
              ry={r * 0.8}
            />
          );
        })}
        {Array.from({length: 7}).map((_, i) => {
          const r = 30 + i * 30;
          return (
            <ellipse
              // eslint-disable-next-line react/no-array-index-key
              key={`c-${i}`}
              cx="1240"
              cy="760"
              rx={r * 1.3}
              ry={r * 0.9}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default TopographicBackground;
