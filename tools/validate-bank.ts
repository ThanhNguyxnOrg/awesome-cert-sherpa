#!/usr/bin/env npx tsx
/**
 * validate-bank.ts — Question Bank YAML Validator (Ajv-based)
 *
 * Validates every .yml/.yaml file under bank/ against bank/schema.json using
 * Ajv + ajv-formats.  Also enforces cross-file invariants that JSON Schema
 * alone cannot express:
 *
 *   1. Globally unique question IDs across ALL bank files
 *   2. answerIndex < choices.length for every question
 *
 * Exit 0 = all valid · Exit 1 = errors found
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import { globSync } from "fast-glob";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { resolve, relative } from "path";

// ── Schema ────────────────────────────────────────────────────────────────────

const schemaPath = resolve(__dirname, "..", "bank", "schema.json");
const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

// ── File discovery ────────────────────────────────────────────────────────────

const bankDir = resolve(__dirname, "..", "bank");
const files = globSync(["**/*.yml", "**/*.yaml"], {
  cwd: bankDir,
  absolute: true,
  ignore: ["**/node_modules/**"],
});

if (files.length === 0) {
  console.log("⚠  No YAML files found in bank/");
  process.exit(0);
}

console.log(`\n🔍 Validating ${files.length} bank file(s)...\n`);

// ── Validation loop ───────────────────────────────────────────────────────────

const globalIds = new Map<string, string>(); // id → first file
let totalErrors = 0;
let totalQuestions = 0;

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const errors: string[] = [];

  // 1. Read & parse YAML
  let doc: unknown;
  try {
    const raw = readFileSync(file, "utf-8");
    doc = parse(raw);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(`YAML parse error — ${msg}`);
    printFileResult(rel, errors);
    totalErrors += errors.length;
    continue;
  }

  // 2. JSON Schema validation via Ajv
  const valid = validate(doc);
  if (!valid && validate.errors) {
    for (const err of validate.errors) {
      const path = err.instancePath || "/";
      errors.push(`${path} ${err.message ?? "unknown schema error"}`);
    }
  }

  // 3. Cross-file checks (only if doc has expected shape)
  const bank = doc as { meta?: unknown; questions?: Array<Record<string, unknown>> };
  if (Array.isArray(bank.questions)) {
    totalQuestions += bank.questions.length;

    for (let i = 0; i < bank.questions.length; i++) {
      const q = bank.questions[i];
      const qId = typeof q.id === "string" ? q.id : `[index ${i}]`;

      // Global ID uniqueness
      if (typeof q.id === "string") {
        if (globalIds.has(q.id)) {
          errors.push(`questions/${i} (${qId}): duplicate id — first seen in ${globalIds.get(q.id)}`);
        } else {
          globalIds.set(q.id, rel);
        }
      }

      // answerIndex bounds check (beyond what JSON Schema can enforce)
      if (
        typeof q.answerIndex === "number" &&
        Array.isArray(q.choices) &&
        q.answerIndex >= q.choices.length
      ) {
        errors.push(
          `questions/${i} (${qId}): answerIndex ${q.answerIndex} out of range [0..${q.choices.length - 1}]`
        );
      }
    }
  }

  printFileResult(rel, errors);
  totalErrors += errors.length;
}

// ── Summary ───────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function printFileResult(rel: string, errors: string[]): void {
  if (errors.length === 0) {
    console.log(`  ✅ ${rel}`);
  } else {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const err of errors) {
      console.log(`     • ${err}`);
    }
  }
}
