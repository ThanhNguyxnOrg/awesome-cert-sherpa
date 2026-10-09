#!/usr/bin/env npx tsx
/**
 * build-resources.ts — Curated Resources YAML → JSON pipeline
 *
 * Reads content/resources/*.yml (shape: { resources: Resource[] }),
 * validates the 10-key schema, and emits:
 *   website/public/resources/index.json       — { total, categories, resources }
 *   website/public/resources/sets/{id}.json   — { categoryId, count, resources }
 *
 * Mirrors tools/build-bank.ts conventions (tsx, fast-glob, yaml).
 */

import { globSync } from "fast-glob";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { parse } from "yaml";
import { resolve, relative, basename } from "path";

const ROOT = resolve(__dirname, "..");
const RES_DIR = resolve(ROOT, "content", "resources");
const OUT_DIR = resolve(ROOT, "website", "public", "resources");
const SETS_DIR = resolve(OUT_DIR, "sets");

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

type Resource = Record<string, unknown> & {
  title: string;
  url: string;
  vendor: string;
  certs: string[];
  tags: string[];
  difficulty: string;
  type: string;
};

const files = globSync(["*.yml", "*.yaml"], {
  cwd: RES_DIR,
  absolute: true,
});

if (files.length === 0) {
  console.log("⚠  No YAML files found in content/resources/");
  process.exit(0);
}

console.log(`\n📚 Building ${files.length} resource file(s)...\n`);

let hasErrors = false;
const byCategory = new Map<string, Resource[]>();

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const errors: string[] = [];
  const categoryId = basename(file).replace(/\.(yml|yaml)$/, "");
  // URLs may repeat ACROSS categories (intentional cross-listing);
  // only flag duplicates WITHIN the same file.
  const seenUrl = new Map<string, number>();

  let doc: unknown;
  try {
    doc = parse(readFileSync(file, "utf-8"));
  } catch (e: unknown) {
    console.log(`  ❌ ${rel}: YAML parse error — ${e instanceof Error ? e.message : String(e)}`);
    hasErrors = true;
    continue;
  }

  const list = (doc as { resources?: unknown }).resources;
  if (!Array.isArray(list)) {
    console.log(`  ❌ ${rel}: missing top-level "resources" array`);
    hasErrors = true;
    continue;
  }

  const out: Resource[] = [];
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

    for (const arr of ["certs", "tags", "language"] as const) {
      if (arr in rec && !Array.isArray(rec[arr])) {
        errors.push(`resources/${i} (${label}): ${arr} must be an array`);
      }
    }

    out.push({ ...(rec as Resource), category: categoryId } as Resource);
  });

  if (errors.length > 0) {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const e of errors.slice(0, 25)) console.log(`     • ${e}`);
    if (errors.length > 25) console.log(`     • …and ${errors.length - 25} more`);
    hasErrors = true;
    continue;
  }

  byCategory.set(categoryId, out);
  console.log(`  ✅ ${rel} → ${categoryId} (${out.length} resources)`);
}

if (hasErrors) {
  console.log("\n❌ Build aborted — fix resource validation errors first\n");
  process.exit(1);
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(SETS_DIR, { recursive: true });

const categories = [...byCategory.entries()]
  .map(([id, resources]) => ({ id, count: resources.length }))
  .sort((a, b) => a.id.localeCompare(b.id));
const all = [...byCategory.entries()].flatMap(([id, resources]) =>
  resources.map((r) => ({ ...r, category: id })),
);
const total = all.length;

writeFileSync(
  resolve(OUT_DIR, "index.json"),
  JSON.stringify({ total, categories, resources: all }, null, 2),
);
for (const [id, resources] of byCategory) {
  writeFileSync(
    resolve(SETS_DIR, `${id}.json`),
    JSON.stringify({ categoryId: id, count: resources.length, resources }, null, 2),
  );
}

console.log(`\n✅ Generated ${byCategory.size} set(s), ${total} resources → website/public/resources/\n`);
