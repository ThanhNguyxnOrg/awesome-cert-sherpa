/**
 * resource-schema.ts — Shared validation for content/resources/*.yml
 *
 * Single source of truth imported by both build-resources.ts (emits JSON)
 * and validate-resources.ts (read-only check), so `pnpm validate` can never
 * green-light a file that `pnpm build` would reject (or that crashes the UI).
 *
 * Shape: { resources: Array<{ title, type, url, vendor, certs[], tags[],
 *   difficulty, language[], notes, last_verified }> }
 * Cross-category URL repeats are intentional cross-listings — only duplicates
 * WITHIN one file are errors (caller passes a fresh call per file).
 */

export const REQUIRED_KEYS = [
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

export type ResourceRecord = Record<string, unknown>;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((e) => isNonEmptyString(e));
}

function isRealCalendarDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

export function validateResourceList(list: unknown, rel: string): {
  errors: string[];
  resources: ResourceRecord[];
} {
  const errors: string[] = [];
  if (!Array.isArray(list)) {
    return { errors: [`missing top-level "resources" array`], resources: [] };
  }

  const seenUrl = new Map<string, number>();
  const resources: ResourceRecord[] = [];

  list.forEach((r: unknown, i: number) => {
    const rec = r as ResourceRecord;
    const label = isNonEmptyString(rec.title) ? `"${rec.title}"` : `[index ${i}]`;
    const at = `resources/${i} (${label})`;

    for (const k of REQUIRED_KEYS) {
      if (!(k in rec)) errors.push(`${at}: missing key "${k}"`);
    }
    for (const k of Object.keys(rec)) {
      if (!(REQUIRED_KEYS as readonly string[]).includes(k))
        errors.push(`${at}: unexpected key "${k}"`);
    }

    for (const k of ["title", "type", "vendor", "difficulty", "notes"] as const) {
      if (k in rec && !isNonEmptyString(rec[k])) errors.push(`${at}: ${k} must be a non-empty string`);
    }
    for (const k of ["certs", "tags", "language"] as const) {
      if (k in rec && !isStringArray(rec[k]))
        errors.push(`${at}: ${k} must be an array of non-empty strings`);
    }

    if (typeof rec.url === "string") {
      try {
        const u = new URL(rec.url);
        if (!["http:", "https:"].includes(u.protocol)) throw new Error("bad protocol");
      } catch {
        errors.push(`${at}: invalid url "${rec.url}"`);
      }
      const key = rec.url.trim();
      if (seenUrl.has(key)) {
        errors.push(`${at}: duplicate url — first seen at index ${seenUrl.get(key)}`);
      } else {
        seenUrl.set(key, i);
      }
    } else if ("url" in rec) {
      errors.push(`${at}: url must be a string`);
    }

    if ("last_verified" in rec) {
      if (typeof rec.last_verified !== "string" || !isRealCalendarDate(rec.last_verified)) {
        errors.push(`${at}: last_verified must be a real YYYY-MM-DD date`);
      }
    }

    resources.push(rec);
  });

  return { errors, resources };
}
