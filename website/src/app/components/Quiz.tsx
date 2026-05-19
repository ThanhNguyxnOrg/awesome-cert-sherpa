import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, LogOut, Lock, Flag, MapPin } from "lucide-react";
import { TopographicBackground } from "./TopographicBackground";

type Choice = { id: string; text: string };
type Q = {
  id: string;
  number: number;
  prompt: string;
  altitude: string;
  choices: Choice[];
  correct: string;
  explanation: string;
  refs: { n: number; label: string }[];
};

const QUESTIONS: Q[] = [
  {
    id: "q5",
    number: 5,
    altitude: "4,200 m",
    prompt:
      "Which AWS service provides a managed, serverless way to run containerized workloads without managing the underlying EC2 instances?",
    choices: [
      { id: "a", text: "Amazon ECS on EC2 launch type" },
      { id: "b", text: "AWS Fargate" },
      { id: "c", text: "Amazon EKS self-managed node groups" },
      { id: "d", text: "AWS Batch with managed compute" },
    ],
    correct: "b",
    explanation:
      "AWS Fargate is a serverless compute engine for containers that works with both ECS and EKS. You define your task or pod and Fargate provisions and scales the compute for you — no EC2 hosts to patch, size, or pay for when idle. The other options all still require managing EC2 instances at some layer.",
    refs: [
      { n: 1, label: "AWS — What is Fargate?" },
      { n: 2, label: "ECS launch types comparison" },
    ],
  },
];

const trail = [
  { n: 1, status: "correct" as const, chosen: "VPC peering", correct: "VPC peering" },
  { n: 2, status: "correct" as const, chosen: "S3 Glacier Deep Archive", correct: "S3 Glacier Deep Archive" },
  { n: 3, status: "wrong" as const, chosen: "Route 53 alias", correct: "Route 53 weighted routing" },
  { n: 4, status: "correct" as const, chosen: "IAM role", correct: "IAM role" },
  { n: 5, status: "pending" as const, chosen: "", correct: "" },
];

export function Quiz() {
  const q = QUESTIONS[0];
  const total = 12;
  const current = 5;
  const progress = (current / total) * 100;

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = selected === q.correct;

  return (
    <section className="relative min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <TopographicBackground />

      {/* Sticky altimeter bar */}
      <div className="sticky top-0 z-20 border-b border-[var(--ink)]/10 bg-[var(--paper)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-8 py-4">
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-[var(--secondary)]" />
            <span className="font-display italic" style={{ fontSize: 18 }}>
              The Ascent
            </span>
            <span
              className="ml-2 font-mono-cs"
              style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}
            >
              AWS · SAA-C03
            </span>
          </div>

          {/* rope progress */}
          <div className="relative flex-1">
            <div
              className="h-2.5 w-full rounded-full"
              style={{
                background:
                  "repeating-linear-gradient(90deg, rgba(15,27,45,0.08) 0 6px, rgba(15,27,45,0.04) 6px 12px)",
              }}
              aria-hidden
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--secondary) 0 4px, #c2641f 4px 8px)",
                boxShadow: "0 0 0 1px rgba(15,27,45,0.15)",
              }}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={total}
            />
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="absolute -top-1 h-4 w-px bg-[var(--ink)]/30"
                style={{ left: `${p}%` }}
                aria-hidden
              />
            ))}
            <div
              className="absolute -top-7 -translate-x-1/2 font-mono-cs"
              style={{ left: `${progress}%`, fontSize: 11, color: "var(--ink)" }}
            >
              <MapPin size={12} className="inline -mt-1 text-[var(--secondary)]" /> {q.altitude}
            </div>
          </div>

          <div
            className="font-mono-cs"
            style={{ fontSize: 12, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}
          >
            Q{current.toString().padStart(2, "0")} / {total}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-8 py-10 lg:grid-cols-[1fr_320px]">
        {/* Center column */}
        <div className="relative">
          <article className="relative rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-8 shadow-[0_1px_0_rgba(15,27,45,0.06),0_18px_40px_-28px_rgba(15,27,45,0.3)]">
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--primary)" }}
            />
            <div className="flex items-center gap-2 font-mono-cs" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>
              <span>QUESTION {q.number}</span>
              <span>·</span>
              <span style={{ color: "var(--alpine)" }}>▲ ALPINE · MEDIUM</span>
            </div>

            <h2
              className="font-display mt-4"
              style={{ fontSize: 28, lineHeight: 1.25, fontWeight: 600 }}
            >
              {q.prompt}
            </h2>

            <ul className="mt-7 grid gap-3">
              {q.choices.map((c, i) => {
                const isSel = selected === c.id;
                const showResult = submitted;
                const isRight = showResult && c.id === q.correct;
                const isWrong = showResult && isSel && c.id !== q.correct;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => !submitted && setSelected(c.id)}
                      aria-pressed={isSel}
                      className={`group flex w-full items-center gap-4 rounded-md border bg-[var(--card)] px-4 py-3.5 text-left transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] ${
                        isSel
                          ? "translate-y-[1px] border-[var(--primary)] shadow-[inset_0_2px_4px_rgba(15,27,45,0.12)]"
                          : "border-[var(--ink)]/14 hover:-translate-y-[1px] shadow-[0_1px_0_rgba(15,27,45,0.08),0_6px_14px_-12px_rgba(15,27,45,0.3)]"
                      } ${isRight ? "!border-[var(--accent)] bg-[var(--accent)]/8" : ""} ${
                        isWrong ? "!border-[var(--destructive)] bg-[var(--destructive)]/8" : ""
                      }`}
                    >
                      <span
                        className="grid h-7 w-7 place-items-center rounded-full border font-mono-cs"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          borderColor: isSel ? "var(--primary)" : "rgba(15,27,45,0.18)",
                          background: isSel ? "var(--primary)" : "transparent",
                          color: isSel ? "var(--primary-foreground)" : "var(--ink)",
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ fontSize: 15 }}>{c.text}</span>
                      {isRight && <Check size={18} className="ml-auto text-[var(--accent)]" />}
                      {isWrong && <X size={18} className="ml-auto text-[var(--destructive)]" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* Submit bar */}
          <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-[var(--ink)]/10 bg-[var(--card)]/70 p-4 backdrop-blur">
            <button
              className="inline-flex items-center gap-2 rounded-md border border-[var(--ink)]/15 px-4 py-2 font-mono-cs hover:bg-[var(--muted)]"
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              <LogOut size={14} /> BAIL OUT
            </button>
            <button
              disabled={!selected || submitted}
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-6 py-2.5 font-mono-cs text-[var(--paper)] disabled:opacity-40"
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              <Lock size={14} /> LOCK ANSWER
            </button>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {submitted && (
              <motion.aside
                initial={{ x: 80, opacity: 0, rotate: 1.4 }}
                animate={{ x: 0, opacity: 1, rotate: -0.6 }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="relative mt-6 rounded-md bg-[#fbf6e8] p-6"
                style={{
                  boxShadow:
                    "0 14px 30px -18px rgba(15,27,45,0.4), 0 1px 0 rgba(15,27,45,0.08)",
                  backgroundImage:
                    "linear-gradient(180deg, rgba(15,27,45,0.04) 0%, transparent 14%), linear-gradient(0deg, rgba(15,27,45,0.04) 0%, transparent 14%)",
                }}
              >
                {/* fold line */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px"
                  style={{ background: "rgba(15,27,45,0.08)" }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="font-mono-cs"
                      style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--muted-foreground)" }}
                    >
                      FIELD NOTE · EXPLANATION
                    </span>
                    <h4
                      className="font-display mt-1"
                      style={{ fontSize: 20, fontWeight: 600, fontStyle: "italic" }}
                    >
                      {isCorrect ? "On route." : "Off route."}
                    </h4>
                  </div>
                  {/* stamped verdict */}
                  <div
                    className="grid place-items-center rounded-md border-2 px-3 py-2 font-mono-cs"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      transform: "rotate(-6deg)",
                      borderColor: isCorrect ? "var(--accent)" : "var(--destructive)",
                      color: isCorrect ? "var(--accent)" : "var(--destructive)",
                    }}
                  >
                    {isCorrect ? "VERIFIED" : "OFF-ROUTE"}
                  </div>
                </div>

                <p className="mt-3" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                  {q.explanation.split(/(\.\s)/).map((part, i) =>
                    i === 0 ? (
                      <span key={i}>
                        {part}
                        <sup className="font-mono-cs text-[var(--primary)]">[1]</sup>
                      </span>
                    ) : i === 4 ? (
                      <span key={i}>
                        {part}
                        <sup className="font-mono-cs text-[var(--primary)]">[2]</sup>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </p>

                <ol className="mt-4 grid gap-1 border-t border-[var(--ink)]/10 pt-3">
                  {q.refs.map((r) => (
                    <li
                      key={r.n}
                      className="flex gap-2 font-mono-cs"
                      style={{ fontSize: 12, color: "var(--muted-foreground)" }}
                    >
                      <span style={{ color: "var(--primary)" }}>[{r.n}]</span>
                      <span>{r.label}</span>
                    </li>
                  ))}
                </ol>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar - trail log */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-4">
            <div className="flex items-center justify-between">
              <h3
                className="font-display italic"
                style={{ fontSize: 16, fontWeight: 600 }}
              >
                Trail log
              </h3>
              <span
                className="font-mono-cs"
                style={{ fontSize: 11, color: "var(--muted-foreground)" }}
              >
                {trail.filter((t) => t.status !== "pending").length}/{total}
              </span>
            </div>

            <ol className="mt-3 max-h-[420px] overflow-y-auto pr-1">
              {trail.map((t) => (
                <li
                  key={t.n}
                  className="group relative flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-[var(--muted)]"
                >
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full border font-mono-cs"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      borderColor:
                        t.status === "correct"
                          ? "var(--accent)"
                          : t.status === "wrong"
                          ? "var(--destructive)"
                          : "rgba(15,27,45,0.2)",
                      background:
                        t.status === "correct"
                          ? "var(--accent)"
                          : t.status === "wrong"
                          ? "var(--destructive)"
                          : "transparent",
                      color:
                        t.status === "pending" ? "var(--muted-foreground)" : "var(--card)",
                    }}
                  >
                    {t.status === "correct" ? "✓" : t.status === "wrong" ? "✗" : t.n}
                  </span>
                  <span style={{ fontSize: 13 }}>
                    Question {t.n}
                    {t.status === "pending" && (
                      <span className="ml-2 font-mono-cs" style={{ fontSize: 11, color: "var(--secondary)" }}>
                        · current
                      </span>
                    )}
                  </span>

                  {t.status !== "pending" && (
                    <div
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 z-10 ml-2 hidden w-64 -translate-y-1/2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] p-3 shadow-lg group-hover:block"
                    >
                      <div className="font-mono-cs" style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>
                        YOUR ANSWER
                      </div>
                      <div style={{ fontSize: 13 }}>{t.chosen}</div>
                      {t.status === "wrong" && (
                        <>
                          <div className="mt-2 font-mono-cs" style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--accent)" }}>
                            CORRECT
                          </div>
                          <div style={{ fontSize: 13 }}>{t.correct}</div>
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
