#!/usr/bin/env npx tsx
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { globSync } from "fast-glob";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { parse } from "yaml";
import { resolve, relative, basename, dirname } from "path";

const ROOT = resolve(__dirname, "..");
const BANK_DIR = resolve(ROOT, "bank");
const OUT_DIR = resolve(ROOT, "website", "public", "bank");
const SETS_DIR = resolve(OUT_DIR, "sets");

// ── Schema validation (shared with validate-bank.ts) ─────────────────────────

const schema = JSON.parse(readFileSync(resolve(BANK_DIR, "schema.json"), "utf-8"));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

// ── Discover YAML bank files ─────────────────────────────────────────────────

const files = globSync(["**/*.yml", "**/*.yaml"], {
  cwd: BANK_DIR,
  absolute: true,
  ignore: ["**/node_modules/**"],
});

if (files.length === 0) {
  console.log("⚠  No YAML files found in bank/");
  process.exit(0);
}

console.log(`\n📦 Building ${files.length} bank file(s)...\n`);

// ── Parse, validate, collect ─────────────────────────────────────────────────

interface BankSet {
  setId: string;
  meta: Record<string, unknown>;
  questions: Array<Record<string, unknown>>;
}

const sets: BankSet[] = [];
const globalIds = new Map<string, string>();
let hasErrors = false;

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const errors: string[] = [];

  let doc: unknown;
  try {
    doc = parse(readFileSync(file, "utf-8"));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ❌ ${rel}: YAML parse error — ${msg}`);
    hasErrors = true;
    continue;
  }

  const valid = validate(doc);
  if (!valid && validate.errors) {
    for (const err of validate.errors) {
      errors.push(`${err.instancePath || "/"} ${err.message ?? "schema error"}`);
    }
  }

  const bank = doc as { meta?: Record<string, unknown>; questions?: Array<Record<string, unknown>> };
  if (Array.isArray(bank.questions)) {
    for (let i = 0; i < bank.questions.length; i++) {
      const q = bank.questions[i];
      const qId = typeof q.id === "string" ? q.id : `[index ${i}]`;

      if (typeof q.id === "string") {
        if (globalIds.has(q.id)) {
          errors.push(`questions/${i} (${qId}): duplicate id — first seen in ${globalIds.get(q.id)}`);
        } else {
          globalIds.set(q.id, rel);
        }
      }

      if (
        typeof q.answerIndex === "number" &&
        Array.isArray(q.choices) &&
        q.answerIndex >= q.choices.length
      ) {
        errors.push(`questions/${i} (${qId}): answerIndex ${q.answerIndex} out of range [0..${q.choices.length - 1}]`);
      }
    }
  }

  if (errors.length > 0) {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const err of errors) console.log(`     • ${err}`);
    hasErrors = true;
    continue;
  }

  // Derive setId: bank/cloud/aws-saa.yml → cloud__aws-saa
  const relToBank = relative(BANK_DIR, file);
  const category = relToBank.split(/[/\\]/)[0];
  const stem = basename(file).replace(/\.(yml|yaml)$/, "");
  const setId = `${category}__${stem}`;

  sets.push({
    setId,
    meta: bank.meta!,
    questions: bank.questions!,
  });

  console.log(`  ✅ ${rel} → ${setId} (${bank.questions!.length} questions)`);
}

if (hasErrors) {
  console.log("\n❌ Build aborted — fix validation errors first\n");
  process.exit(1);
}

// ── Write JSON output ────────────────────────────────────────────────────────

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(SETS_DIR, { recursive: true });

const index = sets.map((s) => {
  const allTags = new Set<string>();
  for (const q of s.questions) {
    if (Array.isArray(q.tags)) {
      for (const t of q.tags) allTags.add(t as string);
    }
  }
  return {
    setId: s.setId,
    meta: s.meta,
    questionCount: s.questions.length,
    tags: [...allTags].sort(),
  };
});

writeFileSync(resolve(OUT_DIR, "index.json"), JSON.stringify(index, null, 2));

for (const s of sets) {
  writeFileSync(
    resolve(SETS_DIR, `${s.setId}.json`),
    JSON.stringify({ setId: s.setId, meta: s.meta, questions: s.questions }, null, 2),
  );
}

console.log(`\n✅ Generated ${sets.length} set(s) → website/public/bank/\n`);
