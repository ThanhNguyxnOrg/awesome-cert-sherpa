import { useEffect, useRef, useState } from "react";

/**
 * Exam engine — pure exam-session logic (no JSX).
 * Timer, flag/skip-agnostic scoring, per-domain breakdown, attempt history.
 * UI lives in PracticePage; everything here is importable and hand-testable.
 */

export const SECONDS_PER_QUESTION = 90;
export const PASS_SCORE = 80;
export const MIN_DRILL_QUESTIONS = 5;
export const HISTORY_CAP = 20;

export type ExamMode = "practice" | "timed" | "drill";

export interface HistoryEntry {
  score: number;
  at: string;
  mode: ExamMode;
  count: number;
}

export interface AttemptStats {
  attempts: number;
  bestScore: number;
  lastAttempt: string;
  history?: HistoryEntry[];
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function isPass(score: number): boolean {
  return score >= PASS_SCORE;
}

export interface ScoredQuestion {
  id: string;
  tags: string[];
}

export interface GivenAnswer {
  correct: boolean;
}

/** Per-tag accuracy (unanswered counts as incorrect, same as overall score). Worst-first. */
export function scoreByDomain(
  questions: ScoredQuestion[],
  answers: Record<string, GivenAnswer>,
): { tag: string; correct: number; total: number; pct: number }[] {
  const agg = new Map<string, { correct: number; total: number }>();
  for (const q of questions) {
    const ok = answers[q.id]?.correct === true;
    for (const tag of q.tags) {
      const e = agg.get(tag) ?? { correct: 0, total: 0 };
      e.total += 1;
      if (ok) e.correct += 1;
      agg.set(tag, e);
    }
  }
  return [...agg.entries()]
    .map(([tag, e]) => ({ tag, ...e, pct: e.total === 0 ? 0 : Math.round((e.correct / e.total) * 100) }))
    .sort((a, b) => a.pct - b.pct || b.total - a.total || a.tag.localeCompare(b.tag));
}

/** Append an attempt; tolerates pre-history stats objects. Caps history. */
export function recordAttempt(
  prev: AttemptStats | null,
  score: number,
  mode: ExamMode,
  count: number,
  nowIso: string = new Date().toISOString(),
): AttemptStats {
  const base = prev ?? { attempts: 0, bestScore: 0, lastAttempt: "" };
  const history = [...(base.history ?? []), { score, at: nowIso, mode, count }].slice(-HISTORY_CAP);
  return {
    attempts: base.attempts + 1,
    bestScore: Math.max(base.bestScore, score),
    lastAttempt: nowIso,
    history,
  };
}

/**
 * Countdown driven by wall-clock deltas (keeps running in hidden tabs —
 * exam-realistic). Pause freezes via cleanup; resume recomputes endAt from
 * leftover. Fires onExpire exactly once per runId.
 */
export function useCountdown(
  totalSeconds: number,
  paused: boolean,
  runId: number,
  onExpire: () => void,
): number {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = useRef({ left: totalSeconds, endAt: 0, fired: false });
  const cbRef = useRef(onExpire);
  cbRef.current = onExpire;

  useEffect(() => {
    ref.current = { left: totalSeconds, endAt: 0, fired: false };
    setRemaining(totalSeconds);
  }, [totalSeconds, runId]);

  useEffect(() => {
    if (paused || totalSeconds <= 0) return;
    ref.current.endAt = Date.now() + ref.current.left * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((ref.current.endAt - Date.now()) / 1000));
      ref.current.left = left;
      setRemaining(left);
      if (left <= 0 && !ref.current.fired) {
        ref.current.fired = true;
        clearInterval(id);
        cbRef.current();
      }
    }, 500);
    return () => clearInterval(id);
  }, [paused, totalSeconds, runId]);

  return remaining;
}
