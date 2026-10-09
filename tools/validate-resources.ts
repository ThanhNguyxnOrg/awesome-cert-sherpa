#!/usr/bin/env npx tsx
/**
 * validate-resources.ts — Curated Resources YAML Validator (read-only)
 *
 * Validates every content/resources/*.yml against the 10-key schema:
 * title, type, url, vendor, certs, tags, difficulty, language,
 * notes, last_verified. Also enforces URL validity/uniqueness and
 * last_verified YYYY-MM-DD.
 *
 * Exit 0 = all valid · Exit 1 = errors found
 */

import { globSync } from "fast-glob";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { resolve, relative } from "path";

const REQUIRED_KEYS = [
  "title",
  "type",
  "url",
  "vendor",
  "certs",
  "tags",
  "difficulty",
  "language",
  "notes",
  "last_verified",
] as const;

const resDir = resolve(__dirname, "..", "content", "resources");
const files = globSync(["*.yml", "*.yaml"], { cwd: resDir, absolute: true });

if (files.length === 0) {
  console.log("⚠  No YAML files found in content/resources/");
  process.exit(0);
}

console.log(`\n🔍 Validating ${files.length} resource file(s)...\n`);

let totalErrors = 0;
let totalResources = 0;
let totalUniqueUrls = 0;

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const errors: string[] = [];
  // URLs may repeat ACROSS categories (intentional cross-listing);
  // only flag duplicates WITHIN the same file.
  const seenUrl = new Map<string, number>();

  let doc: unknown;
  try {
    doc = parse(readFileSync(file, "utf-8"));
  } catch (e: unknown) {
    errors.push(`YAML parse error — ${e instanceof Error ? e.message : String(e)}`);
    printResult(rel, errors);
    totalErrors += errors.length;
    continue;
  }

  const list = (doc as { resources?: unknown }).resources;
  if (!Array.isArray(list)) {
    errors.push(`missing top-level "resources" array`);
    printResult(rel, errors);
    totalErrors += errors.length;
    continue;
  }

  totalResources += list.length;
  list.forEach((r: unknown, i: number) => {
    const rec = r as Record<string, unknown>;
    const label = typeof rec.title === "string" ? `"${rec.title}"` : `[index ${i}]`;

    for (const k of REQUIRED_KEYS) {
      if (!(k in rec)) errors.push(`resources/${i} (${label}): missing key "${k}"`);
    }
    for (const k of Object.keys(rec)) {
      if (!(REQUIRED_KEYS as readonly string[]).includes(k))
        errors.push(`resources/${i} (${label}): unexpected key "${k}"`);
    }

    if (typeof rec.url === "string") {
      try {
        const u = new URL(rec.url);
        if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad protocol");
      } catch {
        errors.push(`resources/${i} (${label}): invalid url "${rec.url}"`);
      }
      const key = rec.url.trim();
      if (seenUrl.has(key)) {
        errors.push(`resources/${i} (${label}): duplicate url — first seen at index ${seenUrl.get(key)}`);
      } else {
        seenUrl.set(key, i);
      }
    } else if ("url" in rec) {
      errors.push(`resources/${i} (${label}): url must be a string`);
    }

    if ("last_verified" in rec && typeof rec.last_verified === "string") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(rec.last_verified) || Number.isNaN(Date.parse(rec.last_verified))) {
        errors.push(`resources/${i} (${label}): last_verified must be YYYY-MM-DD`);
      }
    }
  });

  printResult(rel, errors);
  totalErrors += errors.length;
  totalUniqueUrls += seenUrl.size;
}

console.log(
  `\n📊 Summary: ${files.length} file(s), ${totalResources} resource(s), ${totalUniqueUrls} unique URL(s) in-file, ${totalErrors} error(s)\n`,
);

if (totalErrors > 0) {
  console.log("❌ Validation FAILED\n");
  process.exit(1);
} else {
  console.log("✅ All resource files valid\n");
  process.exit(0);
}

function printResult(rel: string, errors: string[]): void {
  if (errors.length === 0) {
    console.log(`  ✅ ${rel}`);
  } else {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const err of errors.slice(0, 25)) console.log(`     • ${err}`);
    if (errors.length > 25) console.log(`     • …and ${errors.length - 25} more`);
  }
}
