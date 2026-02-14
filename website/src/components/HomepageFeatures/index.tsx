import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Curated Resources',
    emoji: '📚',
    description: (
      <>
        Handpicked study guides, video courses, labs, and cheat sheets —
        organized by certification and difficulty level.
      </>
    ),
  },
  {
    title: 'Practice Engine',
    emoji: '🧠',
    description: (
      <>
        240+ original practice questions across 8 certifications. Test your
        knowledge with our interactive quiz — no exam dumps, ever.
      </>
    ),
  },
  {
    title: 'Vendor-Neutral',
    emoji: '🌐',
    description: (
      <>
        AWS, Azure, GCP, CompTIA, Cisco, Kubernetes, and more. We cover all
        major vendors and frameworks without bias.
      </>
    ),
  },
  {
    title: 'Anti-Dump Guarantee',
    emoji: '🔓',
    description: (
      <>
        Every question is community-written to test exam objectives — never
        copied from real exams. Study ethically, pass honestly.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <div className={styles.featureEmoji} role="img" aria-label={title}>
          {emoji}
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
