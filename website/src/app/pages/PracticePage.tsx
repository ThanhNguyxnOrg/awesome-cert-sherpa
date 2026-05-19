import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Flag, Lock, LogOut, MapPin, Mountain, RotateCcw, Search, X } from "lucide-react";
import { TopographicBackground } from "../components/TopographicBackground";
import { PaperButton } from "../components/PaperButton";

type SetSummary = { setId: string; meta: { category: string; cert: string; vendor: string; version: number; description: string }; questionCount: number; tags: string[] };
type QuestionDifficulty = "easy" | "medium" | "hard";
type Question = { id: string; difficulty: QuestionDifficulty; tags: string[]; question: string; choices: string[]; answerIndex: number; explanation: string; refs: string[]; author?: string };
type QuestionSet = { setId: string; meta: SetSummary["meta"]; questions: Question[] };
type AttemptStats = { attempts: number; bestScore: number; lastAttempt: string };
type Answer = { choice: number; correct: boolean };
type View = "picker" | "config" | "quiz" | "results";

const BASE = import.meta.env.BASE_URL;
const DIFF: Record<QuestionDifficulty, { label: string; reading: string }> = {
  easy: { label: "FOOTHILLS", reading: "1,500 m" },
  medium: { label: "ALPINE", reading: "4,000 m" },
  hard: { label: "DEATH ZONE", reading: "8,000 m" },
};

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
function readStats(id: string): AttemptStats | null { try { const r = localStorage.getItem(`certsherpa_${id}`); return r ? JSON.parse(r) : null; } catch { return null; } }
function writeStats(id: string, s: AttemptStats) { try { localStorage.setItem(`certsherpa_${id}`, JSON.stringify(s)); } catch {} }

export function PracticePage() {
  const [sets, setSets] = useState<SetSummary[]>([]);
  const [stats, setStats] = useState<Record<string, AttemptStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("picker");
  const [pendingSet, setPendingSet] = useState<SetSummary | null>(null);
  const [activeSet, setActiveSet] = useState<QuestionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(10);
  const [setLoading2, setSetLoading2] = useState(false);

  useEffect(() => {
    fetch(`${BASE}bank/index.json`).then(r => r.json()).then((data: SetSummary[]) => {
      setSets(data);
      const s: Record<string, AttemptStats> = {};
      data.forEach(d => { const st = readStats(d.setId); if (st) s[d.setId] = st; });
      setStats(s);
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => { const c = new Set<string>(); sets.forEach(s => c.add(s.meta.category)); return ["all", ...[...c].sort()]; }, [sets]);
  const filtered = useMemo(() => { const q = search.trim().toLowerCase(); return sets.filter(s => { if (category !== "all" && s.meta.category !== category) return false; if (!q) return true; return s.meta.cert.toLowerCase().includes(q) || s.meta.vendor.toLowerCase().includes(q) || s.meta.description.toLowerCase().includes(q); }); }, [sets, search, category]);

  const startQuiz = async (n: number) => {
    if (!pendingSet) return;
    setSetLoading2(true);
    try {
      const resp = await fetch(`${BASE}bank/sets/${pendingSet.setId}.json`);
      const data: QuestionSet = await resp.json();
      setActiveSet(data);
      setQuestions(shuffle(data.questions).slice(0, Math.min(n, data.questions.length)));
      setAnswers({}); setCurrentIdx(0); setSelected(null); setSubmitted(false);
      setView("quiz");
    } catch (e: any) { setError(e.message); } finally { setSetLoading2(false); }
  };

  const submitAnswer = () => { if (selected === null || !questions[currentIdx]) return; setSubmitted(true); setAnswers(p => ({ ...p, [questions[currentIdx].id]: { choice: selected, correct: selected === questions[currentIdx].answerIndex } })); };
  const nextQuestion = () => { if (currentIdx < questions.length - 1) { setCurrentIdx(i => i + 1); setSelected(null); setSubmitted(false); } else { finishQuiz(); } };

  const finishQuiz = () => {
    if (activeSet) {
      const correct = Object.values(answers).filter(a => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      const prev = readStats(activeSet.setId) ?? { attempts: 0, bestScore: 0, lastAttempt: "" };
      const next = { attempts: prev.attempts + 1, bestScore: Math.max(prev.bestScore, score), lastAttempt: new Date().toISOString() };
      writeStats(activeSet.setId, next);
      setStats(s => ({ ...s, [activeSet.setId]: next }));
    }
    setView("results");
  };

  const goPicker = () => { setPendingSet(null); setActiveSet(null); setQuestions([]); setAnswers({}); setView("picker"); };
  const restart = () => { if (activeSet) { setQuestions(shuffle(activeSet.questions).slice(0, questions.length)); setAnswers({}); setCurrentIdx(0); setSelected(null); setSubmitted(false); setView("quiz"); } };

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><span className="font-mono-cs" style={{ fontSize: 12, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>LOADING ROUTES…</span></div>;

  /* ── PICKER ── */
  if (view === "picker") return (
    <section className="relative">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>STAGE 01 · ROUTE PLANNING</span>
        <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", fontStyle: "italic", fontWeight: 600, lineHeight: 1, margin: "0.25rem 0 0" }}>Choose your peak.</h1>
        <p className="mt-4 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.55, color: "var(--muted-foreground)" }}>Pick a certification, set a question count, and start the ascent.</p>

        <div className="mb-8 mt-8 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-3 py-2" style={{ minWidth: 280 }}>
            <Search size={16} className="text-[var(--muted-foreground)]" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cert, vendor…" className="w-full bg-transparent outline-none" style={{ fontSize: 14, color: "var(--ink)" }} />
          </label>
          <div className="flex flex-wrap items-center gap-1 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] p-1">
            {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`rounded-sm px-3 py-1.5 font-mono-cs transition ${category === c ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--muted-foreground)] hover:text-[var(--ink)]"}`} style={{ fontSize: 11, letterSpacing: "0.08em" }}>{c.toUpperCase()}</button>)}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--ink)]/20 bg-[var(--card)] p-10 text-center">
            <Mountain size={36} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
            <h2 className="font-display" style={{ fontSize: 22, fontStyle: "italic", fontWeight: 600 }}>No peaks match.</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(set => {
              const stat = stats[set.setId];
              return (
                <button key={set.setId} onClick={() => { setPendingSet(set); setCount(Math.min(10, set.questionCount)); setView("config"); }} className="group relative overflow-hidden rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(15,27,45,0.35)]" style={{ boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)" }}>
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--primary)" }} />
                  <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>{set.meta.vendor.toUpperCase()} · {set.meta.category.toUpperCase()}</span>
                  <h3 className="font-display mt-2" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.15 }}>{set.meta.cert}</h3>
                  <p className="mt-3" style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--muted-foreground)" }}>{set.meta.description}</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-[var(--ink)]/8 pt-4">
                    <span className="font-mono-cs" style={{ fontSize: 12 }}>▲ {set.questionCount} questions</span>
                    {stat ? <span className="font-mono-cs" style={{ fontSize: 12, color: "var(--accent)" }}>Best {stat.bestScore}%</span> : <span className="font-mono-cs" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Unclimbed</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  /* ── CONFIG ── */
  if (view === "config" && pendingSet) return (
    <section className="relative">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[720px] px-6 py-16">
        <div className="rounded-lg border border-[var(--ink)]/12 bg-[var(--card)] p-8" style={{ boxShadow: "0 1px 0 rgba(15,27,45,0.06), 0 24px 50px -28px rgba(15,27,45,0.35)" }}>
          <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>STAGE 02 · GEAR CHECK</span>
          <h2 className="font-display mt-2" style={{ fontSize: 36, fontStyle: "italic", fontWeight: 600, lineHeight: 1.1 }}>{pendingSet.meta.cert}</h2>
          <p className="mt-2" style={{ fontSize: 15, color: "var(--muted-foreground)" }}>{pendingSet.meta.description}</p>
          <label className="mt-8 block">
            <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>QUESTIONS · MAX {pendingSet.questionCount}</span>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={1} max={pendingSet.questionCount} value={count} onChange={e => setCount(+e.target.value)} className="flex-1 accent-[var(--primary)]" />
              <input type="number" min={1} max={pendingSet.questionCount} value={count} onChange={e => setCount(Math.max(1, Math.min(pendingSet.questionCount, +e.target.value || 1)))} className="w-20 rounded-md border border-[var(--ink)]/15 bg-[var(--paper)] px-2 py-1 font-mono-cs text-center" style={{ fontSize: 14 }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[5, 10, 20, 50, pendingSet.questionCount].filter(n => n <= pendingSet.questionCount).map((n, i) => <button key={`${n}-${i}`} onClick={() => setCount(n)} className={`rounded-sm border px-2 py-0.5 font-mono-cs transition ${count === n ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--ink)]/20 hover:bg-[var(--muted)]"}`} style={{ fontSize: 11 }}>{n === pendingSet.questionCount ? `ALL ${n}` : n}</button>)}
            </div>
          </label>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <PaperButton variant="ghost" onClick={goPicker}>Cancel</PaperButton>
            <PaperButton variant="primary" onClick={() => startQuiz(count)} disabled={setLoading2}><Mountain size={16} />{setLoading2 ? "Loading…" : "Begin ascent"}</PaperButton>
          </div>
        </div>
      </div>
    </section>
  );

  /* ── QUIZ ── */
  if (view === "quiz" && activeSet && questions.length > 0) {
    const q = questions[currentIdx];
    const total = questions.length;
    const progress = ((currentIdx + 1) / total) * 100;
    const alt = DIFF[q.difficulty];
    const isCorrect = selected === q.answerIndex;

    return (
      <section className="relative min-h-screen">
        <TopographicBackground />
        <div className="sticky top-[60px] z-20 border-b border-[var(--ink)]/10 bg-[var(--paper)]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-4">
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-[var(--secondary)]" />
              <span className="font-display italic" style={{ fontSize: 18 }}>The Ascent</span>
              <span className="ml-2 font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>{activeSet.meta.vendor.toUpperCase()} · {activeSet.meta.cert.toUpperCase()}</span>
            </div>
            <div className="relative min-w-[200px] flex-1">
              <div className="h-2.5 w-full rounded-full" style={{ background: "repeating-linear-gradient(90deg,rgba(15,27,45,0.08) 0 6px,rgba(15,27,45,0.04) 6px 12px)" }} />
              <motion.div className="absolute inset-y-0 left-0 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} style={{ background: "repeating-linear-gradient(45deg,var(--secondary) 0 4px,#c2641f 4px 8px)", boxShadow: "0 0 0 1px rgba(15,27,45,0.15)" }} />
              <div className="absolute -top-7 -translate-x-1/2 font-mono-cs" style={{ left: `${progress}%`, fontSize: 11 }}><MapPin size={12} className="inline -mt-1 text-[var(--secondary)]" /> {alt.reading}</div>
            </div>
            <div className="font-mono-cs" style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>Q{(currentIdx + 1).toString().padStart(2, "0")} / {total}</div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_320px]">
          <div>
            <article className="relative rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-8" style={{ boxShadow: "0 1px 0 rgba(15,27,45,0.06),0 18px 40px -28px rgba(15,27,45,0.3)" }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--primary)" }} />
              <div className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>QUESTION {currentIdx + 1} · <span style={{ color: alt.label === "FOOTHILLS" ? "var(--foothills)" : alt.label === "ALPINE" ? "var(--alpine)" : "var(--deathzone)" }}>▲ {alt.label}</span></div>
              <h2 className="font-display mt-4" style={{ fontSize: 24, lineHeight: 1.3, fontWeight: 600 }}>{q.question}</h2>
              <ul className="mt-7 grid gap-3 list-none p-0">
                {q.choices.map((c, i) => {
                  const isSel = selected === i;
                  const isRight = submitted && i === q.answerIndex;
                  const isWrong = submitted && isSel && i !== q.answerIndex;
                  return (
                    <li key={i}>
                      <button onClick={() => !submitted && setSelected(i)} disabled={submitted} className={`flex w-full items-center gap-4 rounded-md border bg-[var(--card)] px-4 py-3.5 text-left transition-all duration-200 ${isRight ? "!border-[var(--accent)] bg-[var(--accent)]/10" : isWrong ? "!border-[var(--destructive)] bg-[var(--destructive)]/10" : isSel ? "border-[var(--primary)]" : "border-[var(--ink)]/15 hover:-translate-y-[1px]"}`}>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono-cs" style={{ fontSize: 12, fontWeight: 600, borderColor: isSel ? "var(--primary)" : "rgba(15,27,45,0.18)", background: isSel ? "var(--primary)" : "transparent", color: isSel ? "var(--primary-foreground)" : "var(--ink)" }}>{String.fromCharCode(65 + i)}</span>
                        <span style={{ fontSize: 15 }}>{c}</span>
                        {isRight && <Check size={18} className="ml-auto text-[var(--accent)]" />}
                        {isWrong && <X size={18} className="ml-auto text-[var(--destructive)]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-[var(--ink)]/10 bg-[var(--card)]/70 p-4 backdrop-blur">
              <button onClick={goPicker} className="inline-flex items-center gap-2 rounded-md border border-[var(--ink)]/15 px-4 py-2 font-mono-cs hover:bg-[var(--muted)]" style={{ fontSize: 12, letterSpacing: "0.08em" }}><LogOut size={14} /> BAIL OUT</button>
              {!submitted ? (
                <button disabled={selected === null} onClick={submitAnswer} className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-6 py-2.5 font-mono-cs text-[var(--paper)] disabled:opacity-40" style={{ fontSize: 12, letterSpacing: "0.08em" }}><Lock size={14} /> LOCK ANSWER</button>
              ) : (
                <button onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-6 py-2.5 font-mono-cs text-[var(--paper)]" style={{ fontSize: 12, letterSpacing: "0.08em" }}>{currentIdx < total - 1 ? "NEXT QUESTION" : "VIEW SUMMIT LOG"}</button>
              )}
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.aside initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="relative mt-6 rounded-md bg-[var(--card)] p-6" style={{ boxShadow: "0 14px 30px -18px rgba(15,27,45,0.4)" }}>
                  <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>FIELD NOTE · EXPLANATION</span>
                  <h4 className="font-display mt-1" style={{ fontSize: 22, fontWeight: 600, fontStyle: "italic" }}>{isCorrect ? "On route." : "Off route."}</h4>
                  <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.65 }}>{q.explanation}</p>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-4">
              <div className="flex items-center justify-between"><h3 className="font-display italic" style={{ fontSize: 16, fontWeight: 600 }}>Trail log</h3><span className="font-mono-cs" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{Object.keys(answers).length}/{total}</span></div>
              <ol className="mt-3 max-h-[420px] list-none overflow-y-auto p-0">
                {questions.map((qq, i) => { const a = answers[qq.id]; const st = a ? (a.correct ? "correct" : "wrong") : i === currentIdx ? "current" : "pending"; return (
                  <li key={qq.id} className="flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-[var(--muted)]">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono-cs" style={{ fontSize: 10, fontWeight: 600, borderColor: st === "correct" ? "var(--accent)" : st === "wrong" ? "var(--destructive)" : "rgba(15,27,45,0.2)", background: st === "correct" ? "var(--accent)" : st === "wrong" ? "var(--destructive)" : "transparent", color: st === "correct" || st === "wrong" ? "var(--card)" : "var(--muted-foreground)" }}>{st === "correct" ? "✓" : st === "wrong" ? "✗" : i + 1}</span>
                    <span style={{ fontSize: 13 }}>Q{i + 1}{st === "current" && <span className="ml-2 font-mono-cs" style={{ fontSize: 10, color: "var(--secondary)" }}>· current</span>}</span>
                  </li>
                ); })}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  /* ── RESULTS ── */
  if (view === "results" && activeSet) {
    const correct = Object.values(answers).filter(a => a.correct).length;
    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    const verdict = score >= 80 ? "Summit reached." : score >= 60 ? "On the ridge." : "Keep climbing.";
    const verdictColor = score >= 80 ? "var(--accent)" : score >= 60 ? "var(--secondary)" : "var(--destructive)";

    return (
      <section className="relative min-h-screen">
        <TopographicBackground />
        <div className="relative mx-auto max-w-[1100px] px-6 py-16">
          <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>STAGE 03 · SUMMIT LOG</span>
          <h1 className="font-display" style={{ fontSize: "clamp(40px,6vw,72px)", fontStyle: "italic", fontWeight: 600, lineHeight: 1 }}>{verdict}</h1>
          <div className="mt-10 rounded-lg border border-[var(--ink)]/10 bg-[var(--card)] p-8">
            <span className="font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>{activeSet.meta.vendor.toUpperCase()} · {activeSet.meta.cert.toUpperCase()}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display" style={{ fontSize: 96, fontStyle: "italic", fontWeight: 600, lineHeight: 1, color: verdictColor }}>{score}</span>
              <span className="font-display italic" style={{ fontSize: 24, color: "var(--muted-foreground)" }}>%</span>
            </div>
            <p className="mt-2" style={{ fontSize: 16, color: "var(--muted-foreground)" }}>{correct} of {total} correct.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PaperButton variant="primary" onClick={restart}><RotateCcw size={16} /> Climb again</PaperButton>
              <PaperButton variant="ghost" onClick={goPicker}>Pick another peak</PaperButton>
            </div>
          </div>

          <h2 className="font-display italic mt-12" style={{ fontSize: 28, fontWeight: 600 }}>Review the route.</h2>
          <ol className="mt-4 grid list-none gap-3 p-0">
            {questions.map((qq, i) => { const a = answers[qq.id]; const ok = a?.correct; return (
              <li key={qq.id} className="flex gap-4 rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono-cs" style={{ fontSize: 12, fontWeight: 700, background: ok ? "var(--accent)" : "var(--destructive)", color: "var(--card)" }}>{ok ? "✓" : "✗"}</span>
                <div><div className="font-display" style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{i + 1}. {qq.question}</div><div className="mt-1 font-mono-cs" style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Correct: {qq.choices[qq.answerIndex]}</div></div>
              </li>
            ); })}
          </ol>
        </div>
      </section>
    );
  }

  return null;
}
