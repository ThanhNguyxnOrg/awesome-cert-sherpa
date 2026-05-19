import { Mountain, BookOpen, Shield, Globe, Terminal, Cpu, Server, ClipboardList } from "lucide-react";
import { TopographicBackground } from "../components/TopographicBackground";

const categories = [
  { id: "cloud", icon: Globe, label: "Cloud", desc: "AWS, Azure, GCP — foundational to professional architect tracks.", count: "4 certs", color: "var(--primary)" },
  { id: "security", icon: Shield, label: "Security", desc: "CISSP, Security+ — defensive and offensive security credentials.", count: "2 certs", color: "var(--accent)" },
  { id: "networking", icon: Server, label: "Networking", desc: "CCNA, Network+ — routing, switching, and modern network design.", count: "2 certs", color: "var(--secondary)" },
  { id: "devops", icon: Terminal, label: "DevOps", desc: "CKA, Terraform Associate — container orchestration and IaC.", count: "2 certs", color: "var(--alpine)" },
  { id: "data-ai", icon: Cpu, label: "Data & AI", desc: "AWS MLS — machine learning and data engineering specialties.", count: "1 cert", color: "var(--foothills)" },
  { id: "linux", icon: Terminal, label: "Linux", desc: "LPIC-1 — Linux system administration fundamentals.", count: "1 cert", color: "var(--primary)" },
  { id: "pm-itsm", icon: ClipboardList, label: "PM & ITSM", desc: "PMP — project management and IT service management.", count: "1 cert", color: "var(--secondary)" },
];

const resources = [
  { title: "AWS Solutions Architect Associate — Official Study Guide", vendor: "AWS", type: "Book", difficulty: "medium" as const },
  { title: "Network+ N10-009 Crash Course", vendor: "CompTIA", type: "Video", difficulty: "easy" as const },
  { title: "CISSP — The Long Climb", vendor: "ISC2", type: "Guide", difficulty: "hard" as const },
  { title: "AZ-900 Fundamentals Study Path", vendor: "Microsoft", type: "Course", difficulty: "easy" as const },
  { title: "CKA Exam Simulator & Labs", vendor: "CNCF", type: "Lab", difficulty: "hard" as const },
  { title: "GCP Associate Cloud Engineer Prep", vendor: "Google", type: "Course", difficulty: "medium" as const },
];

const diffMeta = { easy: { label: "Foothills", color: "var(--foothills)" }, medium: { label: "Alpine", color: "var(--alpine)" }, hard: { label: "Death zone", color: "var(--deathzone)" } };

export function ResourcesPage() {
  return (
    <section className="relative">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>FIELD JOURNAL · RESOURCES</span>
        <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", fontStyle: "italic", fontWeight: 600, lineHeight: 1, margin: "0.25rem 0 0" }}>Trail map.</h1>
        <p className="mt-4 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55, color: "var(--muted-foreground)" }}>440+ curated study resources across 7 certification categories — handpicked, organized, and community-maintained.</p>

        <h2 className="font-display italic mt-12" style={{ fontSize: 28, fontWeight: 600 }}>Categories</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(c => (
            <div key={c.id} className="group rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(15,27,45,0.35)]" style={{ boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: c.color }} />
              <div className="flex items-center gap-3">
                <c.icon size={20} style={{ color: c.color }} />
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 600 }}>{c.label}</h3>
                <span className="ml-auto font-mono-cs" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{c.count}</span>
              </div>
              <p className="mt-2" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display italic mt-16" style={{ fontSize: 28, fontWeight: 600 }}>Featured resources</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((r, i) => {
            const d = diffMeta[r.difficulty];
            return (
              <article key={i} className="relative rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--primary)" }} />
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[var(--muted-foreground)]" />
                  <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>{r.type.toUpperCase()}</span>
                  <span className="ml-auto font-mono-cs" style={{ fontSize: 11, fontWeight: 600 }}>{r.vendor}</span>
                </div>
                <h3 className="font-display mt-3" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{r.title}</h3>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-sm border border-[var(--ink)]/18 px-2 py-0.5 font-mono-cs" style={{ fontSize: 11 }}>{r.type}</span>
                  <span className="flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono-cs" style={{ fontSize: 11, background: d.color, color: "var(--ink)" }}>▲ {d.label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
