import { BookOpen, ExternalLink } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";

const difficultyMeta: Record<Difficulty, { label: string; altitude: string; color: string }> = {
  easy: { label: "Foothills", altitude: "1,500 m", color: "var(--foothills)" },
  medium: { label: "Alpine", altitude: "4,000 m", color: "var(--alpine)" },
  hard: { label: "Death zone", altitude: "8,000 m", color: "var(--deathzone)" },
};

export type ResourceCardProps = {
  title: string;
  vendor: string;
  vendorAltitude: string;
  type: string;
  difficulty: Difficulty;
  lastVerified: string;
  summary: string;
};

function InkStamp({ date }: { date: string }) {
  return (
    <svg
      viewBox="0 0 140 60"
      width="124"
      height="54"
      aria-label={`Verified ${date}`}
      style={{ transform: "rotate(-6deg)" }}
    >
      <g fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.85">
        <rect x="4" y="4" width="132" height="52" rx="3" strokeDasharray="2 3" />
        <rect x="9" y="9" width="122" height="42" rx="2" />
      </g>
      <text
        x="70"
        y="24"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        letterSpacing="2"
        fill="var(--accent)"
        opacity="0.95"
      >
        VERIFIED
      </text>
      <text
        x="70"
        y="44"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="11"
        letterSpacing="1"
        fontWeight="600"
        fill="var(--accent)"
      >
        {date}
      </text>
    </svg>
  );
}

export function FieldJournalCard({
  title,
  vendor,
  vendorAltitude,
  type,
  difficulty,
  lastVerified,
  summary,
}: ResourceCardProps) {
  const d = difficultyMeta[difficulty];
  return (
    <article
      tabIndex={0}
      className="group relative w-[400px] cursor-pointer rounded-md bg-[var(--card)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(15,27,45,0.35),0_2px_0_rgba(15,27,45,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--paper)]"
      style={{
        boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)",
      }}
    >
      {/* hairline top border in primary */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--primary)" }}
        aria-hidden
      />

      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[var(--muted-foreground)]" />
            <span
              className="font-mono-cs"
              style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}
            >
              {type.toUpperCase()}
            </span>
          </div>

          {/* vendor altimeter chip top-right */}
          <div
            className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{ borderColor: "rgba(15,27,45,0.18)" }}
          >
            <span style={{ color: "var(--secondary)" }}>▲</span>
            <span className="font-mono-cs" style={{ fontSize: 11, fontWeight: 600 }}>
              {vendor}
            </span>
            <span
              className="font-mono-cs"
              style={{ fontSize: 10, color: "var(--muted-foreground)" }}
            >
              {vendorAltitude}
            </span>
          </div>
        </div>

        <h3
          className="font-display mt-4"
          style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: "var(--ink)" }}
        >
          {title}
        </h3>

        <p
          className="mt-2"
          style={{ fontSize: 13, lineHeight: 1.55, color: "var(--muted-foreground)" }}
        >
          {summary}
        </p>
      </div>

      {/* bottom row */}
      <div className="flex items-end justify-between gap-2 px-6 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-sm border px-2 py-0.5 font-mono-cs"
            style={{
              fontSize: 11,
              borderColor: "rgba(15,27,45,0.18)",
              color: "var(--ink)",
            }}
          >
            {type}
          </span>
          <span
            className="flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono-cs"
            style={{ fontSize: 11, background: d.color, color: "var(--ink)" }}
            aria-label={`Difficulty ${d.label}, ${d.altitude}`}
          >
            <span>▲</span>
            {d.label} · {d.altitude}
          </span>
        </div>
        <InkStamp date={lastVerified} />
      </div>

      {/* stitched perforation */}
      <div
        aria-hidden
        className="h-3 w-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 6px 6px, var(--paper) 2px, transparent 2.5px)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 -3px",
        }}
      />

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Open resource"
      >
        <ExternalLink size={14} className="text-[var(--primary)]" />
      </a>
    </article>
  );
}
