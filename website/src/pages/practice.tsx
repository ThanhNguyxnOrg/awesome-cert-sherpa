import {useEffect, useMemo, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {motion, AnimatePresence} from 'motion/react';
import {
  Check,
  Flag,
  Lock,
  LogOut,
  MapPin,
  Mountain,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {TopographicBackground} from '@site/src/components/expedition/TopographicBackground';
import {PaperButton} from '@site/src/components/expedition/PaperButton';
import {AltimeterChip} from '@site/src/components/expedition/AltimeterChip';

type SetSummary = {
  setId: string;
  meta: {
    category: string;
    cert: string;
    vendor: string;
    version: number;
    description: string;
  };
  questionCount: number;
  tags: string[];
};

type QuestionDifficulty = 'easy' | 'medium' | 'hard';

type Question = {
  id: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  refs: string[];
  author?: string;
};

type QuestionSet = {
  setId: string;
  meta: SetSummary['meta'];
  questions: Question[];
};

type AttemptStats = {
  attempts: number;
  bestScore: number;
  lastAttempt: string;
};

type View = 'picker' | 'quiz' | 'results';

const DIFFICULTY_TO_ALTITUDE: Record<
  QuestionDifficulty,
  {label: string; reading: string}
> = {
  easy: {label: 'FOOTHILLS', reading: '1,500 m'},
  medium: {label: 'ALPINE', reading: '4,000 m'},
  hard: {label: 'DEATH ZONE', reading: '8,000 m'},
};

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function readStats(setId: string): AttemptStats | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`certsherpa_${setId}`);
    return raw ? (JSON.parse(raw) as AttemptStats) : null;
  } catch {
    return null;
  }
}

function writeStats(setId: string, stats: AttemptStats): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`certsherpa_${setId}`, JSON.stringify(stats));
  } catch {
    /* quota or privacy mode — silent */
  }
}

/* -------------------------------------------------------------------------- */
/*  PICKER                                                                    */
/* -------------------------------------------------------------------------- */

type PickerProps = {
  sets: SetSummary[];
  stats: Record<string, AttemptStats>;
  onSelect: (set: SetSummary) => void;
};

function Picker({sets, stats, onSelect}: PickerProps): ReactNode {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const c = new Set<string>();
    sets.forEach((s) => c.add(s.meta.category));
    return ['all', ...[...c].sort()];
  }, [sets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sets.filter((s) => {
      if (category !== 'all' && s.meta.category !== category) return false;
      if (!q) return true;
      return (
        s.meta.cert.toLowerCase().includes(q) ||
        s.meta.vendor.toLowerCase().includes(q) ||
        s.meta.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [sets, search, category]);

  return (
    <div className="relative mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
      <div className="mb-10">
        <span
          className="font-mono-cs"
          style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
          }}>
          STAGE 01 · ROUTE PLANNING
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontStyle: 'italic',
            fontWeight: 600,
            lineHeight: 1,
            margin: '0.25rem 0 0',
          }}>
          Choose your peak.
        </h1>
        <p
          className="mt-4 max-w-2xl"
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: 'var(--muted-foreground)',
          }}>
          Pick a certification, set a question count, and start the ascent.
          Your best score and attempt history are kept locally — nothing leaves
          this browser.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <label
          className="flex items-center gap-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-3 py-2"
          style={{minWidth: 280}}>
          <Search size={16} className="text-[var(--muted-foreground)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cert, vendor, or tag…"
            className="w-full bg-transparent outline-none"
            style={{fontSize: 14, color: 'var(--ink)'}}
            aria-label="Search certifications"
          />
        </label>

        <div className="flex flex-wrap items-center gap-1 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] p-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-sm px-3 py-1.5 font-mono-cs transition ${
                category === c
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--ink)]'
              }`}
              style={{fontSize: 11, letterSpacing: '0.08em'}}>
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-[var(--ink)]/20 bg-[var(--card)] p-10 text-center"
          role="status">
          <Mountain
            size={36}
            className="mx-auto mb-3 text-[var(--muted-foreground)]"
          />
          <h2
            className="font-display"
            style={{
              fontSize: 22,
              fontStyle: 'italic',
              fontWeight: 600,
              margin: 0,
            }}>
            No peaks match your route.
          </h2>
          <p
            className="mt-2"
            style={{fontSize: 14, color: 'var(--muted-foreground)'}}>
            Clear the search or try a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((set) => {
            const stat = stats[set.setId];
            return (
              <button
                key={set.setId}
                type="button"
                onClick={() => onSelect(set)}
                className="group relative overflow-hidden rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-6 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_24px_44px_-20px_rgba(15,27,45,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                style={{
                  boxShadow:
                    '0 1px 0 rgba(15,27,45,0.06), 0 12px 28px -22px rgba(15,27,45,0.3)',
                }}>
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{background: 'var(--primary)'}}
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="font-mono-cs"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        color: 'var(--muted-foreground)',
                      }}>
                      {set.meta.vendor.toUpperCase()} ·{' '}
                      {set.meta.category.toUpperCase()}
                    </span>
                    <h3
                      className="font-display mt-2"
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        lineHeight: 1.15,
                        margin: 0,
                      }}>
                      {set.meta.cert}
                    </h3>
                  </div>

                  <svg
                    aria-hidden
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    className="flex-shrink-0">
                    <polygon
                      points="28,6 52,50 4,50"
                      fill="var(--primary)"
                      opacity="0.92"
                    />
                    <polygon
                      points="28,6 36,22 28,28 20,22"
                      fill="#ffffff"
                      opacity="0.6"
                    />
                    {stat && stat.bestScore > 0 && (
                      <>
                        <line
                          x1="28"
                          y1="6"
                          x2="40"
                          y2="-2"
                          stroke="var(--secondary)"
                          strokeWidth="1.4"
                        />
                        <polygon
                          points="40,-2 50,2 40,6"
                          fill="var(--secondary)"
                        />
                      </>
                    )}
                  </svg>
                </div>

                <p
                  className="mt-3"
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    color: 'var(--muted-foreground)',
                  }}>
                  {set.meta.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--ink)]/8 pt-4">
                  <span
                    className="inline-flex items-center gap-1 font-mono-cs"
                    style={{
                      fontSize: 12,
                      color: 'var(--ink)',
                    }}>
                    <span style={{color: 'var(--secondary)'}} aria-hidden>
                      ▲
                    </span>
                    {set.questionCount} questions
                  </span>
                  <span
                    aria-hidden
                    style={{color: 'var(--ink)', opacity: 0.3}}>
                    ·
                  </span>
                  {stat ? (
                    <span
                      className="font-mono-cs"
                      style={{
                        fontSize: 12,
                        color: 'var(--accent)',
                      }}>
                      Best {stat.bestScore}% · {stat.attempts}{' '}
                      {stat.attempts === 1 ? 'attempt' : 'attempts'}
                    </span>
                  ) : (
                    <span
                      className="font-mono-cs"
                      style={{
                        fontSize: 12,
                        color: 'var(--muted-foreground)',
                      }}>
                      Unclimbed
                    </span>
                  )}
                  <span className="ml-auto font-display italic" style={{fontSize: 14}}>
                    Plan ascent →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ASCENT CONFIG                                                             */
/* -------------------------------------------------------------------------- */

type ConfigProps = {
  set: SetSummary;
  onCancel: () => void;
  onStart: (count: number) => void;
  loading: boolean;
};

function AscentConfig({set, onCancel, onStart, loading}: ConfigProps): ReactNode {
  const max = set.questionCount;
  const [count, setCount] = useState(Math.min(10, max));

  return (
    <div className="relative mx-auto max-w-[720px] px-6 py-16">
      <div
        className="rounded-lg border border-[var(--ink)]/12 bg-[var(--card)] p-8"
        style={{
          boxShadow:
            '0 1px 0 rgba(15,27,45,0.06), 0 24px 50px -28px rgba(15,27,45,0.35)',
        }}>
        <span
          className="font-mono-cs"
          style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
          }}>
          STAGE 02 · GEAR CHECK
        </span>
        <h2
          className="font-display mt-2"
          style={{
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.1,
          }}>
          {set.meta.cert}
        </h2>
        <p
          className="mt-2"
          style={{fontSize: 15, color: 'var(--muted-foreground)'}}>
          {set.meta.description}
        </p>

        <label htmlFor="qcount" className="mt-8 block">
          <span
            className="font-mono-cs"
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--muted-foreground)',
            }}>
            QUESTIONS · MAX {max}
          </span>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="qcount"
              type="range"
              min={1}
              max={max}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]"
            />
            <input
              type="number"
              min={1}
              max={max}
              value={count}
              onChange={(e) =>
                setCount(
                  Math.max(1, Math.min(max, Number(e.target.value) || 1)),
                )
              }
              className="w-20 rounded-md border border-[var(--ink)]/15 bg-[var(--paper)] px-2 py-1 font-mono-cs text-center"
              style={{fontSize: 14, color: 'var(--ink)'}}
              aria-label="Number of questions"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[5, 10, 20, 50, max].map((n, i) =>
              n <= max ? (
                <button
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${n}-${i}`}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`rounded-sm border px-2 py-0.5 font-mono-cs transition ${
                    count === n
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                      : 'border-[var(--ink)]/20 text-[var(--ink)] hover:bg-[var(--muted)]'
                  }`}
                  style={{fontSize: 11, letterSpacing: '0.08em'}}>
                  {n === max ? `ALL ${n}` : n}
                </button>
              ) : null,
            )}
          </div>
        </label>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <PaperButton variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </PaperButton>
          <PaperButton
            variant="primary"
            onClick={() => onStart(count)}
            disabled={loading}>
            <Mountain size={16} />
            {loading ? 'Loading…' : 'Begin ascent'}
          </PaperButton>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  QUIZ                                                                      */
/* -------------------------------------------------------------------------- */

type Answer = {choice: number; correct: boolean};

type QuizProps = {
  set: QuestionSet;
  questions: Question[];
  onBail: () => void;
  onFinish: (answers: Record<string, Answer>) => void;
};

function Quiz({set, questions, onBail, onFinish}: QuizProps): ReactNode {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const total = questions.length;
  const current = currentIdx + 1;
  const progress = (current / total) * 100;
  const q = questions[currentIdx];
  const altitudeMeta = DIFFICULTY_TO_ALTITUDE[q.difficulty];

  const submit = () => {
    if (selected === null) return;
    setSubmitted(true);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: {choice: selected, correct: selected === q.answerIndex},
    }));
  };

  const next = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      onFinish(answers);
    }
  };

  const isCorrect = selected === q.answerIndex;

  return (
    <section className="relative min-h-screen">
      <TopographicBackground />

      <div className="sticky top-[var(--ifm-navbar-height,60px)] z-20 border-b border-[var(--ink)]/10 bg-[var(--paper)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-[var(--secondary)]" />
            <span className="font-display italic" style={{fontSize: 18}}>
              The Ascent
            </span>
            <span
              className="ml-2 font-mono-cs"
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                color: 'var(--muted-foreground)',
              }}>
              {set.meta.vendor.toUpperCase()} · {set.meta.cert.toUpperCase()}
            </span>
          </div>

          <div className="relative min-w-[200px] flex-1">
            <div
              className="h-2.5 w-full rounded-full"
              style={{
                background:
                  'repeating-linear-gradient(90deg, rgba(15,27,45,0.08) 0 6px, rgba(15,27,45,0.04) 6px 12px)',
              }}
              aria-hidden
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{width: 0}}
              animate={{width: `${progress}%`}}
              transition={{duration: 0.6, ease: [0.32, 0.72, 0, 1]}}
              style={{
                background:
                  'repeating-linear-gradient(45deg, var(--secondary) 0 4px, #c2641f 4px 8px)',
                boxShadow: '0 0 0 1px rgba(15,27,45,0.15)',
              }}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={total}
            />
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                aria-hidden
                className="absolute -top-1 h-4 w-px bg-[var(--ink)]/30"
                style={{left: `${p}%`}}
              />
            ))}
            <div
              className="absolute -top-7 -translate-x-1/2 font-mono-cs"
              style={{
                left: `${progress}%`,
                fontSize: 11,
                color: 'var(--ink)',
              }}>
              <MapPin
                size={12}
                className="inline -mt-1 text-[var(--secondary)]"
              />{' '}
              {altitudeMeta.reading}
            </div>
          </div>

          <div
            className="font-mono-cs"
            style={{
              fontSize: 12,
              letterSpacing: '0.08em',
              color: 'var(--muted-foreground)',
            }}>
            Q{current.toString().padStart(2, '0')} / {total}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="relative">
          <article
            className="relative rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-8"
            style={{
              boxShadow:
                '0 1px 0 rgba(15,27,45,0.06), 0 18px 40px -28px rgba(15,27,45,0.3)',
            }}>
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{background: 'var(--primary)'}}
            />
            <div
              className="flex flex-wrap items-center gap-2 font-mono-cs"
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                color: 'var(--muted-foreground)',
              }}>
              <span>QUESTION {current}</span>
              <span aria-hidden>·</span>
              <AltimeterChip difficulty={q.difficulty} />
              {q.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-[var(--ink)]/15 px-1.5 py-0.5"
                  style={{fontSize: 10}}>
                  {t}
                </span>
              ))}
            </div>

            <h2
              className="font-display mt-4"
              style={{fontSize: 24, lineHeight: 1.3, fontWeight: 600, margin: 0}}>
              {q.question}
            </h2>

            <ul className="mt-7 grid gap-3 list-none p-0">
              {q.choices.map((c, i) => {
                const isSel = selected === i;
                const showResult = submitted;
                const isRight = showResult && i === q.answerIndex;
                const isWrong = showResult && isSel && i !== q.answerIndex;
                let extra = '';
                if (isRight)
                  extra =
                    '!border-[var(--accent)] bg-[var(--accent)]/10';
                else if (isWrong)
                  extra =
                    '!border-[var(--destructive)] bg-[var(--destructive)]/10';
                else if (isSel)
                  extra =
                    'translate-y-[1px] border-[var(--primary)] shadow-[inset_0_2px_4px_rgba(15,27,45,0.12)]';
                else
                  extra =
                    'border-[var(--ink)]/15 hover:-translate-y-[1px] shadow-[0_1px_0_rgba(15,27,45,0.08),0_6px_14px_-12px_rgba(15,27,45,0.3)]';
                return (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => !submitted && setSelected(i)}
                      disabled={submitted}
                      aria-pressed={isSel}
                      className={`group flex w-full items-center gap-4 rounded-md border bg-[var(--card)] px-4 py-3.5 text-left transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] ${extra}`}>
                      <span
                        className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border font-mono-cs"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          borderColor: isSel
                            ? 'var(--primary)'
                            : 'rgba(15,27,45,0.18)',
                          background: isSel ? 'var(--primary)' : 'transparent',
                          color: isSel
                            ? 'var(--primary-foreground)'
                            : 'var(--ink)',
                        }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{fontSize: 15, color: 'var(--ink)'}}>
                        {c}
                      </span>
                      {isRight && (
                        <Check
                          size={18}
                          className="ml-auto text-[var(--accent)]"
                        />
                      )}
                      {isWrong && (
                        <X
                          size={18}
                          className="ml-auto text-[var(--destructive)]"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-[var(--ink)]/10 bg-[var(--card)]/70 p-4 backdrop-blur">
            <button
              type="button"
              onClick={onBail}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--ink)]/15 px-4 py-2 font-mono-cs hover:bg-[var(--muted)]"
              style={{fontSize: 12, letterSpacing: '0.08em'}}>
              <LogOut size={14} /> BAIL OUT
            </button>
            {!submitted ? (
              <button
                type="button"
                disabled={selected === null}
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-6 py-2.5 font-mono-cs text-[var(--paper)] disabled:opacity-40"
                style={{fontSize: 12, letterSpacing: '0.08em'}}>
                <Lock size={14} /> LOCK ANSWER
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-6 py-2.5 font-mono-cs text-[var(--paper)]"
                style={{fontSize: 12, letterSpacing: '0.08em'}}>
                {currentIdx < total - 1
                  ? 'NEXT QUESTION'
                  : 'VIEW SUMMIT LOG'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.aside
                initial={{x: 80, opacity: 0, rotate: 1.4}}
                animate={{x: 0, opacity: 1, rotate: -0.6}}
                exit={{opacity: 0}}
                transition={{duration: 0.45, ease: [0.32, 0.72, 0, 1]}}
                className="relative mt-6 rounded-md p-6"
                style={{
                  background: 'var(--card)',
                  boxShadow:
                    '0 14px 30px -18px rgba(15,27,45,0.4), 0 1px 0 rgba(15,27,45,0.08)',
                  backgroundImage:
                    'linear-gradient(180deg, rgba(15,27,45,0.04) 0%, transparent 14%), linear-gradient(0deg, rgba(15,27,45,0.04) 0%, transparent 14%)',
                }}>
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px"
                  style={{background: 'rgba(15,27,45,0.08)'}}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="font-mono-cs"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        color: 'var(--muted-foreground)',
                      }}>
                      FIELD NOTE · EXPLANATION
                    </span>
                    <h4
                      className="font-display mt-1"
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        fontStyle: 'italic',
                        margin: 0,
                      }}>
                      {isCorrect ? 'On route.' : 'Off route.'}
                    </h4>
                  </div>
                  <div
                    className="grid place-items-center rounded-md border-2 px-3 py-2 font-mono-cs"
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.18em',
                      transform: 'rotate(-6deg)',
                      borderColor: isCorrect
                        ? 'var(--accent)'
                        : 'var(--destructive)',
                      color: isCorrect
                        ? 'var(--accent)'
                        : 'var(--destructive)',
                    }}>
                    {isCorrect ? 'VERIFIED' : 'OFF-ROUTE'}
                  </div>
                </div>

                <p
                  className="mt-3"
                  style={{fontSize: 14.5, lineHeight: 1.65}}>
                  {q.explanation}
                </p>

                {q.refs.length > 0 && (
                  <ol className="mt-4 grid list-none gap-1 border-t border-[var(--ink)]/10 p-0 pt-3">
                    {q.refs.map((r, i) => (
                      <li
                        key={r}
                        className="flex gap-2 font-mono-cs"
                        style={{
                          fontSize: 12,
                          color: 'var(--muted-foreground)',
                        }}>
                        <span style={{color: 'var(--primary)'}}>
                          [{i + 1}]
                        </span>
                        <a
                          href={r}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all hover:underline"
                          style={{color: 'var(--ink)'}}>
                          {r}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-4">
            <div className="flex items-center justify-between">
              <h3
                className="font-display italic"
                style={{fontSize: 16, fontWeight: 600, margin: 0}}>
                Trail log
              </h3>
              <span
                className="font-mono-cs"
                style={{fontSize: 11, color: 'var(--muted-foreground)'}}>
                {Object.keys(answers).length}/{total}
              </span>
            </div>

            <ol className="mt-3 max-h-[420px] list-none overflow-y-auto p-0 pr-1">
              {questions.map((qq, i) => {
                const a = answers[qq.id];
                const status = a
                  ? a.correct
                    ? 'correct'
                    : 'wrong'
                  : i === currentIdx
                    ? 'current'
                    : 'pending';
                return (
                  <li
                    key={qq.id}
                    className="group relative flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-[var(--muted)]">
                    <span
                      className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border font-mono-cs"
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        borderColor:
                          status === 'correct'
                            ? 'var(--accent)'
                            : status === 'wrong'
                              ? 'var(--destructive)'
                              : 'rgba(15,27,45,0.2)',
                        background:
                          status === 'correct'
                            ? 'var(--accent)'
                            : status === 'wrong'
                              ? 'var(--destructive)'
                              : 'transparent',
                        color:
                          status === 'correct' || status === 'wrong'
                            ? 'var(--card)'
                            : 'var(--muted-foreground)',
                      }}>
                      {status === 'correct'
                        ? '✓'
                        : status === 'wrong'
                          ? '✗'
                          : i + 1}
                    </span>
                    <span style={{fontSize: 13, color: 'var(--ink)'}}>
                      Question {i + 1}
                      {status === 'current' && (
                        <span
                          className="ml-2 font-mono-cs"
                          style={{
                            fontSize: 10,
                            color: 'var(--secondary)',
                          }}>
                          · current
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  RESULTS                                                                   */
/* -------------------------------------------------------------------------- */

type ResultsProps = {
  set: QuestionSet;
  questions: Question[];
  answers: Record<string, Answer>;
  onRestart: () => void;
  onPickAnother: () => void;
};

function Results({
  set,
  questions,
  answers,
  onRestart,
  onPickAnother,
}: ResultsProps): ReactNode {
  const correct = Object.values(answers).filter((a) => a.correct).length;
  const total = questions.length;
  const score = Math.round((correct / total) * 100);

  let verdict = 'Keep climbing.';
  let verdictColor = 'var(--destructive)';
  if (score >= 80) {
    verdict = 'Summit reached.';
    verdictColor = 'var(--accent)';
  } else if (score >= 60) {
    verdict = 'On the ridge.';
    verdictColor = 'var(--secondary)';
  }

  // Plant flag at score%
  const flagY = 90 - score * 0.7;

  return (
    <section className="relative min-h-screen">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1100px] px-6 py-16 lg:px-8">
        <span
          className="font-mono-cs"
          style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
          }}>
          STAGE 03 · SUMMIT LOG
        </span>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontStyle: 'italic',
            fontWeight: 600,
            lineHeight: 1,
            margin: '0.25rem 0 0',
          }}>
          {verdict}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr]">
          <div
            className="rounded-lg border border-[var(--ink)]/10 bg-[var(--card)] p-8"
            style={{
              boxShadow:
                '0 1px 0 rgba(15,27,45,0.06), 0 18px 40px -28px rgba(15,27,45,0.3)',
            }}>
            <span
              className="font-mono-cs"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'var(--muted-foreground)',
              }}>
              {set.meta.vendor.toUpperCase()} · {set.meta.cert.toUpperCase()}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="font-display"
                style={{
                  fontSize: 96,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: verdictColor,
                }}>
                {score}
              </span>
              <span
                className="font-display italic"
                style={{fontSize: 24, color: 'var(--muted-foreground)'}}>
                %
              </span>
            </div>
            <p
              className="mt-2"
              style={{fontSize: 16, color: 'var(--muted-foreground)'}}>
              {correct} of {total} correct.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <PaperButton variant="primary" onClick={onRestart}>
                <RotateCcw size={16} />
                Climb again
              </PaperButton>
              <PaperButton variant="ghost" onClick={onPickAnother}>
                Pick another peak
              </PaperButton>
            </div>
          </div>

          <div
            className="relative grid place-items-center rounded-lg border border-[var(--ink)]/10 bg-[var(--card)] p-6"
            style={{minHeight: 280}}
            aria-hidden>
            <svg viewBox="0 0 200 120" className="w-full max-w-[420px]">
              <polygon
                points="100,10 180,100 20,100"
                fill="var(--primary)"
                opacity="0.92"
              />
              <polygon
                points="100,10 130,40 100,55 70,40"
                fill="#ffffff"
                opacity="0.5"
              />
              <polygon
                points="20,100 60,68 100,80 140,72 180,100"
                fill="rgba(15,27,45,0.2)"
              />
              <line
                x1="100"
                y1={flagY}
                x2="100"
                y2="10"
                stroke="var(--ink)"
                strokeWidth="0.6"
                strokeOpacity="0.4"
              />
              <line
                x1="100"
                y1={flagY}
                x2="100"
                y2={flagY - 12}
                stroke="var(--ink)"
                strokeWidth="1.2"
              />
              <polygon
                points={`100,${flagY - 12} 116,${flagY - 8} 100,${flagY - 4}`}
                fill="var(--secondary)"
              />
              <text
                x="100"
                y="115"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="6"
                letterSpacing="1.5"
                fill="var(--muted-foreground)">
                YOUR FLAG · {score}%
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-12">
          <h2
            className="font-display italic"
            style={{fontSize: 28, fontWeight: 600, margin: 0}}>
            Review the route.
          </h2>
          <ol className="mt-4 grid list-none gap-3 p-0">
            {questions.map((qq, i) => {
              const a = answers[qq.id];
              const ok = a?.correct;
              return (
                <li
                  key={qq.id}
                  className="flex gap-4 rounded-md border border-[var(--ink)]/10 bg-[var(--card)] p-4">
                  <span
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full font-mono-cs"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      background: ok
                        ? 'var(--accent)'
                        : 'var(--destructive)',
                      color: 'var(--card)',
                    }}>
                    {ok ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <div
                      className="font-display"
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: 'var(--ink)',
                      }}>
                      {i + 1}. {qq.question}
                    </div>
                    <div
                      className="mt-1 font-mono-cs"
                      style={{
                        fontSize: 12,
                        color: 'var(--muted-foreground)',
                      }}>
                      Correct: {qq.choices[qq.answerIndex]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                      */
/* -------------------------------------------------------------------------- */

export default function PracticePage(): ReactNode {
  const indexUrl = useBaseUrl('/bank/index.json');
  const setsBaseUrl = useBaseUrl('/bank/sets/');

  const [sets, setSets] = useState<SetSummary[]>([]);
  const [stats, setStats] = useState<Record<string, AttemptStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View | 'config'>('picker');
  const [pendingSet, setPendingSet] = useState<SetSummary | null>(null);
  const [activeSet, setActiveSet] = useState<QuestionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [setLoadingFlag, setSetLoadingFlag] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(indexUrl)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load bank index');
        return r.json() as Promise<SetSummary[]>;
      })
      .then((data) => {
        if (!active) return;
        setSets(data);
        const next: Record<string, AttemptStats> = {};
        data.forEach((s) => {
          const stat = readStats(s.setId);
          if (stat) next[s.setId] = stat;
        });
        setStats(next);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [indexUrl]);

  // Deep-link: /practice?set=cloud__aws-saa
  useEffect(() => {
    if (typeof window === 'undefined' || sets.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const want = params.get('set');
    if (!want || pendingSet) return;
    const found = sets.find((s) => s.setId === want);
    if (found) setPendingSet(found);
  }, [sets, pendingSet]);

  const startQuiz = async (count: number) => {
    if (!pendingSet) return;
    setSetLoadingFlag(true);
    setError(null);
    try {
      const resp = await fetch(`${setsBaseUrl}${pendingSet.setId}.json`);
      if (!resp.ok) throw new Error('Failed to load question set');
      const data: QuestionSet = await resp.json();
      const picked = shuffle(data.questions).slice(
        0,
        Math.min(count, data.questions.length),
      );
      setActiveSet(data);
      setQuestions(picked);
      setAnswers({});
      setView('quiz');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
    } finally {
      setSetLoadingFlag(false);
    }
  };

  const finishQuiz = (final: Record<string, Answer>) => {
    setAnswers(final);
    if (activeSet) {
      const correct = Object.values(final).filter((a) => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      const prev = readStats(activeSet.setId) ?? {
        attempts: 0,
        bestScore: 0,
        lastAttempt: '',
      };
      const next: AttemptStats = {
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, score),
        lastAttempt: new Date().toISOString(),
      };
      writeStats(activeSet.setId, next);
      setStats((s) => ({...s, [activeSet.setId]: next}));
    }
    setView('results');
  };

  const restart = () => {
    if (!pendingSet || !activeSet) return;
    const picked = shuffle(activeSet.questions).slice(0, questions.length);
    setQuestions(picked);
    setAnswers({});
    setView('quiz');
  };

  const goPicker = () => {
    setPendingSet(null);
    setActiveSet(null);
    setQuestions([]);
    setAnswers({});
    setView('picker');
  };

  return (
    <Layout
      title="Practice Lab"
      description="Original practice questions for AWS, Azure, GCP, CISSP, CCNA, CKA and more — 1,590+ scenario-based questions, no dumps.">
      <main className="relative bg-[var(--paper)] text-[var(--ink)]">
        {error && (
          <div
            role="alert"
            className="mx-auto mt-4 max-w-[1280px] rounded-md border border-[var(--destructive)]/40 bg-[var(--destructive)]/10 px-4 py-3"
            style={{color: 'var(--destructive)'}}>
            <strong>Error:</strong> {error}
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-3 font-mono-cs underline"
              style={{fontSize: 12}}>
              dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="grid min-h-[40vh] place-items-center">
            <div
              className="font-mono-cs"
              style={{
                fontSize: 12,
                letterSpacing: '0.1em',
                color: 'var(--muted-foreground)',
              }}>
              LOADING ROUTES…
            </div>
          </div>
        )}

        {!loading && view === 'picker' && !pendingSet && (
          <Picker
            sets={sets}
            stats={stats}
            onSelect={(s) => setPendingSet(s)}
          />
        )}

        {!loading && pendingSet && view === 'picker' && (
          <AscentConfig
            set={pendingSet}
            loading={setLoadingFlag}
            onCancel={() => setPendingSet(null)}
            onStart={startQuiz}
          />
        )}

        {view === 'quiz' && activeSet && (
          <Quiz
            set={activeSet}
            questions={questions}
            onBail={goPicker}
            onFinish={finishQuiz}
          />
        )}

        {view === 'results' && activeSet && (
          <Results
            set={activeSet}
            questions={questions}
            answers={answers}
            onRestart={restart}
            onPickAnother={goPicker}
          />
        )}
      </main>
    </Layout>
  );
}
