import { Routes, Route, NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { Mountain, Menu, X } from "lucide-react";
import { Hero } from "./components/Hero";
import { PracticePage } from "./pages/PracticePage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { BlogPage } from "./pages/BlogPage";

const navLinks = [
  { to: "/", label: "Basecamp" },
  { to: "/practice", label: "Practice" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Field Journal" },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[var(--paper)] text-[var(--ink)]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 border-b border-[var(--ink)]/10 bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-8 py-3">
          <Link to="/" className="flex items-center gap-2 no-underline text-[var(--ink)]">
            <Mountain size={20} className="text-[var(--secondary)]" />
            <span className="font-display italic" style={{ fontSize: 18, fontWeight: 600 }}>
              CertSherpa
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-1 rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-1.5 font-mono-cs no-underline transition ${
                    isActive
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                  }`
                }
                style={{ fontSize: 11, letterSpacing: "0.08em" }}
              >
                {l.label.toUpperCase()}
              </NavLink>
            ))}
          </div>

          {/* GitHub star */}
          <a
            href="https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-[var(--ink)]/15 px-3 py-1.5 font-mono-cs no-underline text-[var(--ink)] hover:bg-[var(--muted)] transition"
            style={{ fontSize: 11, letterSpacing: "0.08em" }}
          >
            ★ GITHUB
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--ink)]/10 bg-[var(--card)] px-8 py-4">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-2 font-mono-cs no-underline transition ${
                    isActive ? "text-[var(--ink)] font-bold" : "text-[var(--muted-foreground)]"
                  }`
                }
                style={{ fontSize: 12, letterSpacing: "0.08em" }}
              >
                {l.label.toUpperCase()}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* ── Routes ─────────────────────────────────────────────── */}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--ink)]/10 bg-[var(--card)]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-8 py-6">
          <div className="flex items-center gap-2">
            <Mountain size={16} className="text-[var(--secondary)]" />
            <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>
              CERTSHERPA · OPEN SOURCE · NO DUMPS
            </span>
          </div>
          <div className="flex gap-4 font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em" }}>
            <a href="https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa" target="_blank" rel="noopener noreferrer" className="text-[var(--muted-foreground)] hover:text-[var(--ink)] no-underline transition">GITHUB</a>
            <a href="https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-[var(--muted-foreground)] hover:text-[var(--ink)] no-underline transition">CONTRIBUTE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
