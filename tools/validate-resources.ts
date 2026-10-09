#!/usr/bin/env npx tsx
/**
 * validate-resources.ts — Curated Resources YAML Validator (read-only)
 *
 * Same rules as the build pipeline via tools/resource-schema.ts.
 * Exit 0 = all valid · Exit 1 = errors found
 */

import { globSync } from "fast-glob";
import { readFileSync } from "fs";
import { parse } from "yaml";
import { resolve, relative } from "path";
import { validateResourceList } from "./resource-schema";

const resDir = resolve(__dirname, "..", "content", "resources");
const files = globSync(["*.yml", "*.yaml"], { cwd: resDir, absolute: true });

if (files.length === 0) {
  console.log("⚠  No YAML files found in content/resources/");
  process.exit(0);
}

console.log(`\n🔍 Validating ${files.length} resource file(s)...\n`);

let totalErrors = 0;
let totalResources = 0;

for (const file of files) {
  const rel = relative(process.cwd(), file);

  let doc: unknown;
  try {
    doc = parse(readFileSync(file, "utf-8"));
  } catch (e: unknown) {
    console.log(`  ❌ ${rel} (1 error(s))`);
    console.log(`     • YAML parse error — ${e instanceof Error ? e.message : String(e)}`);
    totalErrors += 1;
    continue;
  }

  const { errors, resources } = validateResourceList(
    (doc as { resources?: unknown }).resources,
    rel,
  );
  totalResources += resources.length;

  if (errors.length === 0) {
    console.log(`  ✅ ${rel}`);
  } else {
    console.log(`  ❌ ${rel} (${errors.length} error(s))`);
    for (const err of errors.slice(0, 25)) console.log(`     • ${err}`);
    if (errors.length > 25) console.log(`     • …and ${errors.length - 25} more`);
  }
  totalErrors += errors.length;
}

console.log(
  `\n📊 Summary: ${files.length} file(s), ${totalResources} resource(s), ${totalErrors} error(s)\n`,
);

if (totalErrors > 0) {
  console.log("❌ Validation FAILED\n");
  process.exit(1);
} else {
  console.log("✅ All resource files valid\n");
  process.exit(0);
}
