import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Mountain,
  Globe,
  Shield,
  Server,
  Terminal,
  Cpu,
  ClipboardList,
  Search,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { TopographicBackground } from "../components/TopographicBackground";

type Resource = {
  title: string;
  type: string;
  url: string;
  vendor: string;
  certs: string[];
  tags: string[];
  difficulty: string;
  language: string[];
  notes: string;
  last_verified: string;
  category: string;
};

type IndexDoc = {
  total: number;
  categories: { id: string; count: number }[];
  resources: Resource[];
};

const BASE = import.meta.env.BASE_URL;

const CATEGORY_META: Record<string, { icon: typeof Globe; label: string; desc: string; color: string }> = {
  cloud: { icon: Globe, label: "Cloud", desc: "AWS, Azure, GCP — foundational to professional architect tracks.", color: "var(--primary)" },
  security: { icon: Shield, label: "Security", desc: "CISSP, Security+ — defensive and offensive security credentials.", color: "var(--accent)" },
  networking: { icon: Server, label: "Networking", desc: "CCNA, Network+ — routing, switching, and modern network design.", color: "var(--secondary)" },
  devops: { icon: Terminal, label: "DevOps", desc: "CKA, Terraform Associate — container orchestration and IaC.", color: "var(--alpine)" },
  "data-ai": { icon: Cpu, label: "Data & AI", desc: "AWS MLS — machine learning and data engineering specialties.", color: "var(--foothills)" },
  linux: { icon: Terminal, label: "Linux", desc: "LPIC-1 — Linux system administration fundamentals.", color: "var(--primary)" },
  "pm-itsm": { icon: ClipboardList, label: "PM & ITSM", desc: "PMP — project management and IT service management.", color: "var(--secondary)" },
};

const ORDER = ["cloud", "security", "networking", "devops", "data-ai", "linux", "pm-itsm"];

function isPaid(r: Resource): boolean {
  return r.tags.some((t) => t.toLowerCase() === "paid");
}

function diffColor(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d.includes("advanced")) return "var(--deathzone)";
  if (d.includes("intermediate")) return "var(--alpine)";
  return "var(--foothills)";
}

function useResources() {
  const [doc, setDoc] = useState<IndexDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${BASE}resources/index.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<IndexDoc>;
      })
      .then((data) => {
        if (!cancelled) {
          setDoc(data);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return { doc, error, loading, retry: () => setAttempt((a) => a + 1) };
}

export function ResourcesPage() {
  const { categoryId } = useParams();
  const [params, setParams] = useSearchParams();
  const { doc, error, loading, retry } = useResources();

  const q = params.get("q") ?? "";
  const typeFilter = params.get("type") ?? "all";
  const costFilter = params.get("cost") ?? "all";
  const sort = params.get("sort") ?? "vendor";
  const deferredQ = useDeferredValue(q);

  const setParam = (key: string, value: string, def = "all") => {
    const next = new URLSearchParams(params);
    if (value === def || (key === "q" && value === "") || (key === "sort" && value === "vendor")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next, { preventScrollReset: true });
  };

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    doc?.categories.forEach((c) => m.set(c.id, c.count));
    return m;
  }, [doc]);

  // Derived during render — no effect (react guidance: you-might-not-need-an-effect).
  const scope: Resource[] = useMemo(() => {
    if (!doc) return [];
    if (categoryId && !(categoryId in CATEGORY_META)) return [];
    const inScope = categoryId ? doc.resources.filter((r) => r.category === categoryId) : doc.resources;
    const needle = deferredQ.trim().toLowerCase();
    const filtered = inScope.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (costFilter === "free" && isPaid(r)) return false;
      if (costFilter === "paid" && !isPaid(r)) return false;
      if (!needle) return true;
      return (
        r.title.toLowerCase().includes(needle) ||
        r.vendor.toLowerCase().includes(needle) ||
        r.notes.toLowerCase().includes(needle) ||
        r.certs.some((c) => c.toLowerCase().includes(needle)) ||
        r.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
    const sorted = [...filtered];
    if (sort === "recent") {
      sorted.sort((a, b) => b.last_verified.localeCompare(a.last_verified));
    } else if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort(
        (a, b) => a.vendor.localeCompare(b.vendor) || a.title.localeCompare(b.title),
      );
    }
    return sorted;
  }, [doc, categoryId, deferredQ, typeFilter, costFilter, sort]);

  const types = useMemo(() => {
    const base = categoryId
      ? doc?.resources.filter((r) => r.category === categoryId) ?? []
      : doc?.resources ?? [];
    return [...new Set(base.map((r) => r.type))].sort();
  }, [doc, categoryId]);

  const activeMeta = categoryId ? CATEGORY_META[categoryId] : null;
  const invalidCategory = !!categoryId && !activeMeta;

  return (
    <section className="relative">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>FIELD JOURNAL · RESOURCES</span>
        <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", fontStyle: "italic", fontWeight: 600, lineHeight: 1, margin: "0.25rem 0 0" }}>Trail map.</h1>
        <p className="mt-4 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55, color: "var(--muted-foreground)" }}>
          {loading
            ? "Loading curated study resources…"
            : `${doc?.total ?? 0} curated study resources across ${ORDER.length} certification categories — handpicked, organized, and community-maintained.`}
        </p>

        {/* Categories — drilldown entries with live counts */}
        <h2 className="font-display italic mt-12" style={{ fontSize: 28, fontWeight: 600 }}>Categories</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((id) => {
            const meta = CATEGORY_META[id];
            const Icon = meta.icon;
            const n = counts.get(id);
            const active = categoryId === id;
            return (
              <Link
                key={id}
                to={`/resources/${id}`}
                aria-current={active ? "page" : undefined}
                className="group relative overflow-hidden rounded-md border bg-[var(--card)] p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(15,27,45,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                style={{
                  borderColor: active ? "var(--primary)" : "rgba(15,27,45,0.1)",
                  boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)",
                  color: "var(--ink)",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: meta.color }} />
                <div className="flex items-center gap-3">
                  <Icon size={20} style={{ color: meta.color }} aria-hidden />
                  <h3 className="font-display" style={{ fontSize: 20, fontWeight: 600 }}>{meta.label}</h3>
                  <span className="ml-auto font-mono-cs" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                    {n !== undefined ? `${n} resources` : "…"}
                  </span>
                </div>
                <p className="mt-2" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{meta.desc}</p>
              </Link>
            );
          })}
        </div>

        {/* Compare section */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display italic" style={{ fontSize: 28, fontWeight: 600 }}>
            {activeMeta ? `${activeMeta.label} resources.` : "Compare resources."}
          </h2>
          {categoryId && (
            <Link
              to="/resources"
              className="font-mono-cs no-underline text-[var(--muted-foreground)] hover:text-[var(--ink)]"
              style={{ fontSize: 11, letterSpacing: "0.08em" }}
            >
              ← ALL RESOURCES
            </Link>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-3 py-2" style={{ minWidth: 280 }}>
            <Search size={16} className="shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            <span className="sr-only">Search resources</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setParam("q", e.target.value, "")}
              placeholder="Search title, vendor, cert, tag…"
              className="w-full bg-transparent outline-none"
              style={{ fontSize: 14, color: "var(--ink)" }}
            />
          </label>
          <div className="flex min-h-[44px] flex-wrap items-center gap-1 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] p-1" role="group" aria-label="Cost filter">
            {(["all", "free", "paid"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setParam("cost", c)}
                aria-pressed={costFilter === c}
                className={`min-h-[36px] rounded-sm px-3 py-1.5 font-mono-cs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${costFilter === c ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted-foreground)] hover:text-[var(--ink)]"}`}
                style={{ fontSize: 11, letterSpacing: "0.08em" }}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="flex min-h-[44px] items-center gap-2 font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>
            SORT
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value, "vendor")}
              className="min-h-[36px] rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-2 py-1.5"
              style={{ fontSize: 12, color: "var(--ink)" }}
            >
              <option value="vendor">Vendor A–Z</option>
              <option value="recent">Recently verified</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
        </div>

        {/* Type chips — wrap, never clip */}
        {types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Type filter">
            <button
              onClick={() => setParam("type", "all")}
              aria-pressed={typeFilter === "all"}
              className={`min-h-[36px] rounded-full border px-3 py-1.5 font-mono-cs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${typeFilter === "all" ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)]/20 hover:bg-[var(--muted)]"}`}
              style={{ fontSize: 11 }}
            >
              ALL TYPES
            </button>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setParam("type", typeFilter === t ? "all" : t)}
                aria-pressed={typeFilter === t}
                className={`min-h-[36px] rounded-full border px-3 py-1.5 font-mono-cs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${typeFilter === t ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)]/20 hover:bg-[var(--muted)]"}`}
                style={{ fontSize: 11 }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }} aria-live="polite">
          {loading ? "LOADING…" : invalidCategory ? "UNKNOWN CATEGORY" : `${scope.length} RESULT${scope.length === 1 ? "" : "S"}`}
        </p>

        {/* States + results */}
        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading resources">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6">
                <div className="h-3 w-24 rounded bg-[var(--muted)]" />
                <div className="mt-3 h-5 w-3/4 rounded bg-[var(--muted)]" />
                <div className="mt-3 h-3 w-full rounded bg-[var(--muted)]" />
                <div className="mt-2 h-3 w-2/3 rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 rounded-md border border-[var(--destructive)]/30 bg-[var(--card)] p-10 text-center" role="alert">
            <Mountain size={32} className="mx-auto mb-3 text-[var(--destructive)]" aria-hidden />
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600 }}>Trail blocked.</h3>
            <p className="mx-auto mt-2 max-w-md" style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Could not load resources ({error}). Check your connection and retry.
            </p>
            <button
              onClick={retry}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[var(--ink)] px-5 py-2.5 font-mono-cs text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              <RotateCcw size={14} aria-hidden /> RETRY
            </button>
          </div>
        ) : invalidCategory ? (
          <div className="mt-6 rounded-md border border-dashed border-[var(--ink)]/20 bg-[var(--card)] p-10 text-center">
            <Mountain size={32} className="mx-auto mb-3 text-[var(--muted-foreground)]" aria-hidden />
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600 }}>No such trail.</h3>
            <p className="mt-2" style={{ fontSize: 14, color: "var(--muted-foreground)" }}>Unknown category “{categoryId}”. Pick a trail below.</p>
            <Link to="/resources" className="mt-4 inline-block min-h-[44px] rounded-md bg-[var(--ink)] px-5 py-2.5 font-mono-cs text-[var(--paper)] no-underline" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
              ALL RESOURCES
            </Link>
          </div>
        ) : scope.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-[var(--ink)]/20 bg-[var(--card)] p-10 text-center">
            <Mountain size={32} className="mx-auto mb-3 text-[var(--muted-foreground)]" aria-hidden />
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 600 }}>No resources match.</h3>
            <p className="mx-auto mt-2 max-w-md" style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Try “CCNA” instead of “Cisco CCNA”, clear the type filter, or browse all resources.
            </p>
            <button
              onClick={() => setParams({}, { preventScrollReset: true })}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[var(--ink)]/15 px-5 py-2.5 font-mono-cs hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              <RotateCcw size={14} aria-hidden /> CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scope.map((r) => {
              const paid = isPaid(r);
              return (
                <article
                  key={r.url}
                  className="relative flex flex-col rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--primary)" }} />
                  <div className="flex items-center gap-2">
                    <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>
                      {r.type.toUpperCase()}
                    </span>
                    <span
                      className="ml-auto rounded-sm px-2 py-0.5 font-mono-cs"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        background: paid ? "var(--secondary)" : "var(--accent)",
                        color: paid ? "var(--ink)" : "var(--accent-foreground)",
                      }}
                    >
                      {paid ? "PAID" : "FREE"}
                    </span>
                  </div>
                  <h3 className="font-display mt-3" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--ink)] no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                      {r.title} <ExternalLink size={14} className="inline -mt-0.5" aria-label="(opens in new tab)" />
                    </a>
                  </h3>
                  <p className="mt-2" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{r.notes}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.certs.slice(0, 4).map((c) => (
                      <span key={c} className="rounded-sm border border-[var(--ink)]/15 px-2 py-0.5 font-mono-cs" style={{ fontSize: 10.5 }}>{c}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <span className="font-mono-cs" style={{ fontSize: 11, fontWeight: 600 }}>{r.vendor}</span>
                    <span className="ml-auto flex items-center gap-1.5 font-mono-cs" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: diffColor(r.difficulty) }} aria-hidden />
                      {r.difficulty} · verified {r.last_verified}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
