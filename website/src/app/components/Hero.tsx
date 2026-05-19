import { Compass, Map, Mountain } from "lucide-react";
import { TopographicBackground } from "./TopographicBackground";
import { CompassDial } from "./CompassDial";
import { PaperButton } from "./PaperButton";

const tickers = [
  { label: "questions", value: "1,590" },
  { label: "resources", value: "440" },
  { label: "peaks", value: "14" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <TopographicBackground />

      {/* aurora ribbon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-0 right-0 h-40 opacity-50 mix-blend-multiply"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, transparent 0%, rgba(125,223,192,0.35) 18%, rgba(91,201,245,0.4) 36%, rgba(224,122,47,0.35) 54%, transparent 72%)",
          filter: "blur(40px)",
          transform: "skewY(-6deg)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-8 pb-24 pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-32 lg:pt-24">
        {/* Left column */}
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/15 bg-[var(--card)]/70 px-3 py-1 font-mono-cs backdrop-blur">
            <Mountain size={14} className="text-[var(--accent)]" />
            <span style={{ fontSize: 12, letterSpacing: "0.08em" }}>
              CERTSHERPA · BASECAMP · 2,847 m
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(56px, 8vw, 96px)",
              fontStyle: "italic",
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}
          >
            Summit any
            <br />
            <span style={{ color: "var(--primary)" }}>IT certification.</span>
          </h1>

          <p
            className="mt-6 max-w-xl"
            style={{ fontSize: 18, lineHeight: 1.55, color: "var(--muted-foreground)" }}
          >
            A field journal for climbers of AWS, Azure, GCP, CISSP, CCNA, and eleven more peaks.
            Curated routes, sharpened practice ascents, and an anti-dump pledge stitched into every
            card.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <PaperButton variant="primary">
              <Map size={18} />
              Open the trail map
            </PaperButton>
            <PaperButton variant="ghost">
              <Compass size={18} />
              Begin the climb
            </PaperButton>
          </div>

          {/* altitude ticker row */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            {tickers.map((t, i) => (
              <div
                key={t.label}
                className="flex items-center gap-2 rounded-md border border-[var(--ink)]/12 bg-[var(--card)]/80 px-3 py-2 backdrop-blur"
              >
                <span style={{ color: "var(--secondary)" }}>▲</span>
                <span className="font-mono-cs" style={{ fontSize: 14, fontWeight: 600 }}>
                  {t.value}
                </span>
                <span
                  className="font-mono-cs"
                  style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}
                >
                  {t.label.toUpperCase()}
                </span>
                {i < tickers.length - 1 && (
                  <span className="ml-1 text-[var(--ink)]/30">·····</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column - compass */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, var(--card) 0%, transparent 60%)",
            }}
          />
          <CompassDial size={420} />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-3 py-1.5 font-mono-cs shadow-sm"
            style={{ fontSize: 11, letterSpacing: "0.08em" }}
          >
            NEXT BEARING · <span style={{ color: "var(--primary)" }}>AWS SAA-C03</span>
          </div>
        </div>
      </div>
    </section>
  );
}
