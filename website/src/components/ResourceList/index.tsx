import type {ReactNode} from 'react';
import {FieldJournalCard} from '@site/src/components/expedition/FieldJournalCard';
import type {Difficulty} from '@site/src/components/expedition/AltimeterChip';

export type Resource = {
  title: string;
  type: string;
  url: string;
  vendor: string;
  certs: string[];
  tags: string[];
  difficulty: Difficulty;
  language: string[];
  notes: string;
  last_verified: string;
};

const TYPE_LABELS: Record<string, string> = {
  'official-doc': 'Official Docs',
  'exam-guide': 'Exam Guide',
  'study-guide': 'Study Guide',
  lab: 'Hands-on Lab',
  workshop: 'Workshop',
  tutorial: 'Tutorial',
  reference: 'Reference',
  cheatsheet: 'Cheat Sheet',
  video: 'Video',
  repo: 'Repository',
};

function formatVerified(raw: string): string {
  if (!raw) return '';
  const date = new Date(raw);
  if (Number.isNaN(date.valueOf())) return raw.toUpperCase();
  return date
    .toLocaleDateString('en-US', {month: 'short', year: 'numeric'})
    .toUpperCase();
}

type Props = {
  resources: Resource[];
};

/**
 * Resource list rendered as a stack of stitched field-journal cards,
 * grouped by vendor so climbers can scan a brand at a time.
 */
export default function ResourceList({resources}: Props): ReactNode {
  if (!resources || resources.length === 0) {
    return (
      <p className="font-mono-cs" style={{color: 'var(--muted-foreground)'}}>
        No resources here yet — open an issue and we&apos;ll add some!
      </p>
    );
  }

  const grouped = new Map<string, Resource[]>();
  for (const r of resources) {
    const key = r.vendor || 'Other';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  }

  return (
    <div className="not-prose">
      <p
        className="font-mono-cs"
        style={{
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'var(--muted-foreground)',
          marginBottom: 24,
        }}>
        ▲ {resources.length} CURATED RESOURCES
      </p>
      {[...grouped.entries()].map(([vendor, items]) => (
        <section key={vendor} className="mb-10">
          <h3
            className="font-display"
            style={{
              fontSize: 22,
              fontStyle: 'italic',
              fontWeight: 600,
              borderBottom: '1px solid var(--ink)',
              paddingBottom: 6,
              margin: '0 0 16px',
              color: 'var(--ink)',
            }}>
            {vendor}
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((r) => (
              <FieldJournalCard
                key={`${r.url}-${r.title}`}
                title={r.title}
                vendor={r.vendor || 'Independent'}
                type={TYPE_LABELS[r.type] ?? r.type}
                difficulty={r.difficulty}
                summary={r.notes}
                lastVerified={formatVerified(r.last_verified)}
                href={r.url}>
                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.slice(0, 6).map((t) => (
                      <code
                        key={t}
                        className="font-mono-cs"
                        style={{
                          fontSize: 11,
                          padding: '2px 6px',
                          background: 'var(--muted)',
                          color: 'var(--ink)',
                          borderRadius: 3,
                        }}>
                        {t}
                      </code>
                    ))}
                  </div>
                )}
              </FieldJournalCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
