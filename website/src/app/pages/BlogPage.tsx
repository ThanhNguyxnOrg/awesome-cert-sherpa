import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";
import { TopographicBackground } from "../components/TopographicBackground";

const posts = [
  {
    slug: "welcome-to-certsherpa",
    title: "Welcome to CertSherpa — Your Open-Source Certification Guide 🏔️",
    date: "February 14, 2026",
    author: "thanhnguyxn",
    tags: ["announcement"],
    excerpt: "CertSherpa is here — a free, open-source hub for IT certification exam prep. We curate the best study resources, provide original practice questions, and bring the community together to help everyone study smarter.",
    content: `## Why CertSherpa?

IT certifications are expensive, and the study landscape is fragmented. Free resources are scattered across Reddit threads, YouTube playlists, and random blog posts. Paid resources vary wildly in quality. And exam dumps? They're everywhere — but they're unethical, violate NDAs, and don't actually help you learn.

**CertSherpa takes a different approach:**

- 📚 **440+ curated resources** across 7 certification categories
- 🧠 **1,590+ original practice questions** across 14 certification tracks
- 🌐 **Vendor-neutral** — AWS, Azure, GCP, CompTIA, Cisco, Kubernetes, Linux, and more
- 🔓 **100% free and open-source** — no paywalls, no ads, no tracking

## Our Anti-Dump Promise

This is non-negotiable: **CertSherpa will never contain, host, or link to exam dumps.**

Every practice question in our bank is original — written to align with published exam objectives, not ripped from live exams.

## Get Involved

- ⭐ Star the repo
- 📝 Submit a resource
- 🧠 Write practice questions
- 🐛 Report issues`,
  },
  {
    slug: "practice-engine-launch",
    title: "The Practice Engine is Live — 1,590 Questions Across 14 Peaks 🧠",
    date: "February 14, 2026",
    author: "thanhnguyxn",
    tags: ["feature", "practice"],
    excerpt: "Our interactive practice engine is now live with 1,590+ original questions across 14 certification tracks. Pick a peak, choose your question count, and start climbing.",
    content: `## What's in the Practice Engine?

The practice engine loads questions from our YAML question bank, shuffles them, and presents an interactive quiz experience with:

- **Route planning** — browse all 14 certification tracks
- **Gear check** — choose how many questions to attempt
- **The Ascent** — answer questions with real-time progress tracking
- **Summit log** — review your results and track your best scores

## Available Peaks

| Category | Certifications |
|----------|---------------|
| Cloud | AWS SAA, AWS SAP, AZ-104, AZ-900, GCP ACE |
| Security | CISSP, Security+ |
| Networking | CCNA, Network+ |
| DevOps | CKA, Terraform Associate |
| Data & AI | AWS MLS |
| Linux | LPIC-1 |
| PM & ITSM | PMP |

All scores are stored locally in your browser — nothing leaves your machine.`,
  },
];

export function BlogPage() {
  return (
    <section className="relative">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[900px] px-6 py-12 lg:px-8">
        <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>DISPATCHES FROM THE TRAIL</span>
        <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", fontStyle: "italic", fontWeight: 600, lineHeight: 1, margin: "0.25rem 0 0" }}>Field journal.</h1>
        <p className="mt-4 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55, color: "var(--muted-foreground)" }}>Announcements, contributor spotlights, and exam-prep deep dives.</p>

        <div className="mt-12 grid gap-8">
          {posts.map(post => (
            <article key={post.slug} className="rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-8 transition-all duration-300 hover:shadow-lg" style={{ boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--primary)" }} />
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 font-mono-cs" style={{ fontSize: 11, color: "var(--muted-foreground)" }}><Calendar size={12} /> {post.date}</span>
                {post.tags.map(t => <span key={t} className="flex items-center gap-1 rounded-sm border border-[var(--ink)]/15 px-2 py-0.5 font-mono-cs" style={{ fontSize: 10 }}><Tag size={10} /> {t}</span>)}
              </div>
              <h2 className="font-display mt-3" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25 }}>{post.title}</h2>
              <p className="mt-3" style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted-foreground)" }}>{post.excerpt}</p>
              <div className="mt-6 whitespace-pre-line" style={{ fontSize: 14.5, lineHeight: 1.65 }}>
                {post.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h3 key={i} className="font-display mt-6 mb-2" style={{ fontSize: 20, fontWeight: 600, fontStyle: "italic" }}>{line.replace("## ", "")}</h3>;
                  if (line.startsWith("- ")) return <div key={i} className="ml-4 my-1">{line}</div>;
                  if (line.startsWith("| ")) return <div key={i} className="font-mono-cs my-0.5" style={{ fontSize: 12 }}>{line}</div>;
                  if (line.startsWith("**")) return <p key={i} className="mt-2 font-semibold">{line.replace(/\*\*/g, "")}</p>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="my-1">{line}</p>;
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
