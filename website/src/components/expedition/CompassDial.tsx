import {useEffect, useState, type ReactNode} from 'react';

type Props = {
  size?: number;
};

/**
 * Animated 16-point brass compass. Slowly rotates between bearings to
 * suggest "the next cert to chase". Honours prefers-reduced-motion.
 */
export function CompassDial({size = 360}: Props): ReactNode {
  const [angle, setAngle] = useState(34);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const targets = [34, 78, 152, 210, 284, 12, 96, 188];
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % targets.length;
      setAngle(targets[i]);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const points = Array.from({length: 16});
  const cx = 200;
  const cy = 200;

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      role="img"
      aria-label="Compass pointing to the next certification"
      className="drop-shadow-[0_18px_40px_rgba(15,27,45,0.18)]">
      <defs>
        <radialGradient id="dial-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--paper)" />
        </radialGradient>
        <linearGradient id="needle-n" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--sunset)" />
          <stop offset="100%" stopColor="var(--deathzone)" />
        </linearGradient>
      </defs>

      <circle
        cx={cx}
        cy={cy}
        r="180"
        fill="url(#dial-bg)"
        stroke="var(--ink)"
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r="158"
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.10"
      />
      <circle
        cx={cx}
        cy={cy}
        r="120"
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.08"
        strokeDasharray="2 6"
      />

      {points.map((_, i) => {
        const a = (i * 360) / 16;
        const rad = (a * Math.PI) / 180;
        const inner = i % 4 === 0 ? 140 : 158;
        const outer = 172;
        const x1 = cx + Math.sin(rad) * inner;
        const y1 = cy - Math.cos(rad) * inner;
        const x2 = cx + Math.sin(rad) * outer;
        const y2 = cy - Math.cos(rad) * outer;
        return (
          <line
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--ink)"
            strokeOpacity={i % 4 === 0 ? 0.7 : 0.3}
            strokeWidth={i % 4 === 0 ? 2 : 1}
          />
        );
      })}

      {['N', 'E', 'S', 'W'].map((l, i) => {
        const a = (i * 90 * Math.PI) / 180;
        const x = cx + Math.sin(a) * 116;
        const y = cy - Math.cos(a) * 116 + 5;
        return (
          <text
            key={l}
            x={x}
            y={y}
            textAnchor="middle"
            fontFamily="Fraunces, serif"
            fontStyle="italic"
            fontSize="18"
            fill="var(--ink)"
            opacity="0.75">
            {l}
          </text>
        );
      })}

      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
          transition: 'transform 1.6s cubic-bezier(0.32,0.72,0,1)',
        }}>
        <polygon
          points={`${cx},${cy - 130} ${cx - 10},${cy} ${cx + 10},${cy}`}
          fill="url(#needle-n)"
        />
        <polygon
          points={`${cx},${cy + 110} ${cx - 8},${cy} ${cx + 8},${cy}`}
          fill="var(--ink)"
          opacity="0.85"
        />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r="9"
        fill="var(--card)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <circle cx={cx} cy={cy} r="3" fill="var(--ink)" />
    </svg>
  );
}

export default CompassDial;
