import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.heroDescription}>
          <p>
            Free, open-source study resources and practice questions for AWS, Azure, Security+, Kubernetes, and more. No dumps. No shortcuts. Just solid prep.
          </p>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            📚 Explore Resources
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/practice">
            🧠 Start Practicing
          </Link>
        </div>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>640+ Questions</div>
          <div className={styles.statItem}>•</div>
          <div className={styles.statItem}>470+ Resources</div>
          <div className={styles.statItem}>•</div>
          <div className={styles.statItem}>14 Certifications</div>
          <div className={styles.statItem}>•</div>
          <div className={styles.statItem}>100% Free</div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Community-driven certification exam prep hub — curated study resources and original practice questions for IT certifications.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
