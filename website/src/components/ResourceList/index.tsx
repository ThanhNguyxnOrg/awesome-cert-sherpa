import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export type Resource = {
  title: string;
  type: string;
  url: string;
  vendor: string;
  certs: string[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  language: string[];
  notes: string;
  last_verified: string;
};

const TYPE_LABELS: Record<string, string> = {
  "official-doc": "Official Docs",
  "exam-guide": "Exam Guide",
  "study-guide": "Study Guide",
  lab: "Hands-on Lab",
  workshop: "Workshop",
  tutorial: "Tutorial",
  reference: "Reference",
  cheatsheet: "Cheat Sheet",
  video: "Video",
  repo: "Repository",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "badge--success",
  intermediate: "badge--warning",
  advanced: "badge--danger",
};

function ResourceCard({ resource }: { resource: Resource }): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardTitle}
        >
          {resource.title}
          <span className={styles.externalIcon}> ↗</span>
        </a>
        <div className={styles.badges}>
          <span className={clsx("badge", "badge--primary", styles.badge)}>
            {TYPE_LABELS[resource.type] ?? resource.type}
          </span>
          <span
            className={clsx(
              "badge",
              DIFFICULTY_COLORS[resource.difficulty],
              styles.badge,
            )}
          >
            {resource.difficulty}
          </span>
          {resource.vendor && (
            <span className={clsx("badge", "badge--info", styles.badge)}>
              {resource.vendor}
            </span>
          )}
        </div>
      </div>
      {resource.notes && <p className={styles.notes}>{resource.notes}</p>}
      <div className={styles.meta}>
        {resource.certs.length > 0 && (
          <span className={styles.certs}>
            {resource.certs.join(" · ")}
          </span>
        )}
        {resource.tags.length > 0 && (
          <span className={styles.tags}>
            {resource.tags.map((tag) => (
              <code key={tag} className={styles.tag}>
                {tag}
              </code>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

type ResourceListProps = {
  resources: Resource[];
};

export default function ResourceList({
  resources,
}: ResourceListProps): ReactNode {
  if (!resources || resources.length === 0) {
    return <p>No resources available yet. Want to contribute? Check the repo!</p>;
  }

  const grouped = new Map<string, Resource[]>();
  for (const r of resources) {
    const key = r.vendor || "Other";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(r);
  }

  return (
    <div className={styles.resourceList}>
      <p className={styles.count}>
        <strong>{resources.length}</strong> curated resources
      </p>
      {[...grouped.entries()].map(([vendor, items]) => (
        <div key={vendor} className={styles.vendorSection}>
          <h3 className={styles.vendorHeading}>{vendor}</h3>
          {items.map((resource, idx) => (
            <ResourceCard key={`${resource.url}-${idx}`} resource={resource} />
          ))}
        </div>
      ))}
    </div>
  );
}
