#!/usr/bin/env npx tsx
/**
 * build-resources.ts — Curated Resources YAML → JSON pipeline
 *
 * Reads content/resources/*.yml (shape: { resources: Resource[] }),
 * validates via tools/resource-schema.ts (shared with validate-resources.ts),
 * and emits:
 *   website/public/resources/index.json       — { total, categories, resources }
 *   website/public/resources/sets/{id}.json   — { categoryId, count, resources }
 *
 * Mirrors tools/build-bank.ts conventions (tsx, fast-glob, yaml).
 */

import { globSync } from "fast-glob";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { parse } from "yaml";
import { resolve, relative, basename } from "path";
import { validateResourceList, type ResourceRecord } from "./resource-schema";

const ROOT = resolve(__dirname, "..");
const RES_DIR = resolve(ROOT, "content", "resources");
const OUT_DIR = resolve(ROOT, "website", "public", "resources");
const SETS_DIR = resolve(OUT_DIR, "sets");

type Resource = ResourceRecord & {
  title: string;
  url: string;
  vendor: string;
  certs: string[];
  tags: string[];
  difficulty: string;
  type: string;
  category: string;
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
  const categoryId = basename(file).replace(/\.(yml|yaml)$/, "");

  let doc: unknown;
  try {
    doc = parse(readFileSync(file, "utf-8"));
  } catch (e: unknown) {
    console.log(`  ❌ ${rel}: YAML parse error — ${e instanceof Error ? e.message : String(e)}`);
    hasErrors = true;
    continue;
  }

  const { errors, resources } = validateResourceList(
    (doc as { resources?: unknown }).resources,
    rel,
  );

  if (errors.length > 0) {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const e of errors.slice(0, 25)) console.log(`     • ${e}`);
    if (errors.length > 25) console.log(`     • …and ${errors.length - 25} more`);
    hasErrors = true;
    continue;
  }

  const out = resources.map((r) => ({ ...r, category: categoryId }) as Resource);
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
