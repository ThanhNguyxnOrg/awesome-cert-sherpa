#!/usr/bin/env npx tsx
/**
 * validate-bank.ts — Question Bank YAML Validator
 *
 * Checks every .yml file under bank/ for:
 *   1. Valid YAML parse
 *   2. Required meta fields (category, cert, vendor, version, description)
 *   3. Each question has all required fields
 *   4. choices.length >= 2, answerIndex in range
 *   5. explanation is at least 2 sentences
 *   6. refs has at least 1 valid URL
 *   7. IDs are globally unique across ALL bank files
 *   8. difficulty is one of easy | medium | hard
 *
 * Exit 0 = all valid, Exit 1 = errors found
 */

import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BankMeta {
  category: string;
  cert: string;
  vendor: string;
  version: number;
  description: string;
}

interface BankQuestion {
  id: string;
  difficulty: string;
  tags: string[];
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  refs: string[];
  author: string;
}

interface BankFile {
  meta: BankMeta;
  questions: BankQuestion[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const URL_RE = /^https?:\/\/.+/;

function countSentences(text: string): number {
  // Split on sentence-ending punctuation followed by space or end-of-string
  const sentences = text.split(/[.!?]+\s*/g).filter((s) => s.trim().length > 0);
  return sentences.length;
}

function findYamlFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findYamlFiles(full));
    } else if (entry.name.endsWith(".yml") || entry.name.endsWith(".yaml")) {
      if (entry.name === ".gitkeep") continue;
      results.push(full);
    }
  }
  return results;
}

// ── Validation ─────────────────────────────────────────────────────────────────

function validateFile(
  filePath: string,
  globalIds: Map<string, string>
): string[] {
  const errors: string[] = [];
  const rel = path.relative(process.cwd(), filePath);

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch {
    errors.push(`${rel}: Cannot read file`);
    return errors;
  }

  let doc: BankFile;
  try {
    doc = yaml.load(raw) as BankFile;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`${rel}: YAML parse error — ${msg}`);
    return errors;
  }

  if (!doc || typeof doc !== "object") {
    errors.push(`${rel}: File is empty or not an object`);
    return errors;
  }

  // ── Meta validation ──
  if (!doc.meta) {
    errors.push(`${rel}: Missing "meta" section`);
  } else {
    for (const key of [
      "category",
      "cert",
      "vendor",
      "version",
      "description",
    ] as const) {
      if (!doc.meta[key] && doc.meta[key] !== 0) {
        errors.push(`${rel}: meta.${key} is missing`);
      }
    }
  }

  // ── Questions validation ──
  if (!Array.isArray(doc.questions)) {
    errors.push(`${rel}: "questions" must be an array`);
    return errors;
  }

  if (doc.questions.length === 0) {
    errors.push(`${rel}: questions array is empty`);
    return errors;
  }

  for (let i = 0; i < doc.questions.length; i++) {
    const q = doc.questions[i];
    const prefix = `${rel} [${i}]`;

    // Required string fields
    for (const field of [
      "id",
      "difficulty",
      "question",
      "explanation",
      "author",
    ] as const) {
      if (!q[field] || typeof q[field] !== "string") {
        errors.push(`${prefix}: "${field}" is missing or not a string`);
      }
    }

    // ID uniqueness
    if (q.id) {
      if (globalIds.has(q.id)) {
        errors.push(
          `${prefix}: Duplicate id "${q.id}" (first seen in ${globalIds.get(q.id)})`
        );
      } else {
        globalIds.set(q.id, rel);
      }
    }

    // Difficulty enum
    if (q.difficulty && !VALID_DIFFICULTIES.has(q.difficulty)) {
      errors.push(
        `${prefix}: difficulty "${q.difficulty}" must be easy|medium|hard`
      );
    }

    // Tags
    if (!Array.isArray(q.tags) || q.tags.length === 0) {
      errors.push(`${prefix}: "tags" must be a non-empty array`);
    }

    // Choices
    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push(`${prefix}: "choices" must have at least 2 items`);
    }

    // Answer index
    if (typeof q.answerIndex !== "number") {
      errors.push(`${prefix}: "answerIndex" must be a number`);
    } else if (
      Array.isArray(q.choices) &&
      (q.answerIndex < 0 || q.answerIndex >= q.choices.length)
    ) {
      errors.push(
        `${prefix}: answerIndex ${q.answerIndex} out of range [0..${q.choices.length - 1}]`
      );
    }

    // Explanation — min 2 sentences
    if (q.explanation && countSentences(q.explanation) < 2) {
      errors.push(
        `${prefix}: explanation must have at least 2 sentences (found ${countSentences(q.explanation)})`
      );
    }

    // Refs — at least 1 URL
    if (!Array.isArray(q.refs) || q.refs.length === 0) {
      errors.push(`${prefix}: "refs" must have at least 1 URL`);
    } else {
      for (const ref of q.refs) {
        if (!URL_RE.test(ref)) {
          errors.push(`${prefix}: invalid ref URL "${ref}"`);
        }
      }
    }
  }

  return errors;
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main(): void {
  const bankDir = path.resolve(__dirname, "..", "bank");
  const files = findYamlFiles(bankDir);

  if (files.length === 0) {
    console.log("⚠  No YAML files found in bank/");
    process.exit(0);
  }

  console.log(`\n🔍 Validating ${files.length} bank file(s)...\n`);

  const globalIds = new Map<string, string>();
  let totalErrors = 0;
  let totalQuestions = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    const errors = validateFile(file, globalIds);

    // Count questions for summary
    try {
      const doc = yaml.load(fs.readFileSync(file, "utf-8")) as BankFile;
      if (doc?.questions) totalQuestions += doc.questions.length;
    } catch {
      // already reported
    }

    if (errors.length === 0) {
      console.log(`  ✅ ${rel}`);
    } else {
      console.log(`  ❌ ${rel} (${errors.length} error(s))`);
      for (const err of errors) {
        console.log(`     • ${err}`);
      }
      totalErrors += errors.length;
    }
  }

  console.log(
    `\n📊 Summary: ${files.length} file(s), ${totalQuestions} question(s), ${globalIds.size} unique ID(s), ${totalErrors} error(s)\n`
  );

  if (totalErrors > 0) {
    console.log("❌ Validation FAILED\n");
    process.exit(1);
  } else {
    console.log("✅ All bank files valid\n");
    process.exit(0);
  }
}

main();
