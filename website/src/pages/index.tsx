import {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {Compass, Map, Mountain, ShieldCheck, Sparkles, Globe2} from 'lucide-react';
import {TopographicBackground} from '@site/src/components/expedition/TopographicBackground';
import {CompassDial} from '@site/src/components/expedition/CompassDial';
import {PaperButton} from '@site/src/components/expedition/PaperButton';
import {FieldJournalCard} from '@site/src/components/expedition/FieldJournalCard';
import {PeakRange, type Peak} from '@site/src/components/expedition/PeakRange';

type SetSummary = {
  setId: string;
  meta: {
    category: string;
    cert: string;
    vendor: string;
    version: number;
    description: string;
  };
  questionCount: number;
};

const tickers = [
  {label: 'questions', value: '1,590'},
  {label: 'resources', value: '440'},
  {label: 'peaks', value: '14'},
];

const pillars = [
  {
    icon: <Map size={18} />,
    eyebrow: 'CURATED ROUTES',
    title: 'Resources, hand-picked.',
    body: 'Each path is annotated by category, vendor, and difficulty altitude — no SEO sludge, no affiliate links.',
  },
  {
    icon: <Sparkles size={18} />,
    eyebrow: 'PRACTICE ASCENTS',
    title: '1,590 original drills.',
    body: 'Scenario-first questions with explanations and at least one official reference per item.',
  },
  {
    icon: <Globe2 size={18} />,
    eyebrow: 'VENDOR-NEUTRAL',
    title: 'AWS to Kubernetes.',
    body: 'Fourteen peaks across cloud, security, networking, devops, data & AI, Linux, and PM/ITSM.',
  },
  {
    icon: <ShieldCheck size={18} />,
    eyebrow: 'ANTI-DUMP PLEDGE',
    title: 'No leaks. Ever.',
    body: 'Every question is community-written to test exam objectives — never copied from real exams.',
  },
];

function Hero(): ReactNode {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <TopographicBackground />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-0 right-0 h-40 opacity-50 mix-blend-multiply"
        style={{
          background:
            'conic-gradient(from 200deg at 50% 50%, transparent 0%, rgba(125,223,192,0.35) 18%, rgba(91,201,245,0.4) 36%, rgba(224,122,47,0.35) 54%, transparent 72%)',
          filter: 'blur(40px)',
          transform: 'skewY(-6deg)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-8 pb-24 pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-32 lg:pt-24">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--ink)]/15 bg-[var(--card)]/70 px-3 py-1 font-mono-cs backdrop-blur">
            <Mountain size={14} className="text-[var(--accent)]" />
            <span style={{fontSize: 12, letterSpacing: '0.08em'}}>
              CERTSHERPA · BASECAMP · 2,847 m
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(56px, 8vw, 96px)',
              fontStyle: 'italic',
              fontWeight: 600,
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              margin: 0,
            }}>
            Summit any
            <br />
            <span style={{color: 'var(--primary)'}}>IT certification.</span>
          </h1>

          <p
            className="mt-6 max-w-xl"
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--muted-foreground)',
            }}>
            A field journal for climbers of AWS, Azure, GCP, CISSP, CCNA, and
            eleven more peaks. Curated routes, sharpened practice ascents, and
            an anti-dump pledge stitched into every card.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <PaperButton variant="primary" to="/docs">
              <Map size={18} />
              Open the trail map
            </PaperButton>
            <PaperButton variant="ghost" to="/practice">
              <Compass size={18} />
              Begin the climb
            </PaperButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            {tickers.map((t, i) => (
              <div
                key={t.label}
                className="flex items-center gap-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)]/80 px-3 py-2 backdrop-blur">
                <span aria-hidden style={{color: 'var(--secondary)'}}>
                  ▲
                </span>
                <span
                  className="font-mono-cs"
                  style={{fontSize: 14, fontWeight: 600}}>
                  {t.value}
                </span>
                <span
                  className="font-mono-cs"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    color: 'var(--muted-foreground)',
                  }}>
                  {t.label.toUpperCase()}
                </span>
                {i < tickers.length - 1 && (
                  <span aria-hidden className="ml-1 text-[var(--ink)]/30">
                    ·····
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, var(--card) 0%, transparent 60%)',
            }}
          />
          <CompassDial size={420} />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 rounded-md border border-[var(--ink)]/15 bg-[var(--card)] px-3 py-1.5 font-mono-cs shadow-sm"
            style={{fontSize: 11, letterSpacing: '0.08em'}}>
            NEXT BEARING ·{' '}
            <span style={{color: 'var(--primary)'}}>AWS SAA-C03</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PeaksGallery(): ReactNode {
  const indexUrl = useBaseUrl('/bank/index.json');
  const [peaks, setPeaks] = useState<Peak[]>([]);

  useEffect(() => {
    let active = true;
    fetch(indexUrl)
      .then((r) => r.json() as Promise<SetSummary[]>)
      .then((sets) => {
        if (!active) return;
        const list: Peak[] = sets.map((s) => ({
          setId: s.setId,
          cert: s.meta.cert,
          vendor: s.meta.vendor,
          category: s.meta.category,
          questionCount: s.questionCount,
          altitude: s.questionCount,
        }));
        setPeaks(list);
      })
      .catch(() => {
        /* ignore — gallery just hides if static data isn't ready yet */
      });
    return () => {
      active = false;
    };
  }, [indexUrl]);

  if (peaks.length === 0) return null;

  return (
    <section className="relative bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span
              className="font-mono-cs"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'var(--muted-foreground)',
              }}>
              THE FOURTEEN PEAKS
            </span>
            <h2
              className="font-display mt-2"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontStyle: 'italic',
                fontWeight: 600,
                lineHeight: 1.1,
                margin: 0,
              }}>
              A horizon line of certifications.
            </h2>
          </div>
          <PaperButton variant="ghost" to="/practice">
            See all peaks →
          </PaperButton>
        </div>
        <PeakRange peaks={peaks} />
      </div>
    </section>
  );
}

function Pillars(): ReactNode {
  return (
    <section className="relative overflow-hidden bg-[var(--card)] py-20">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1280px] px-8">
        <div className="mb-12">
          <span
            className="font-mono-cs"
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--muted-foreground)',
            }}>
            FOUR PILLARS · WHY CERTSHERPA
          </span>
          <h2
            className="font-display mt-2"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontStyle: 'italic',
              fontWeight: 600,
              lineHeight: 1.1,
              margin: 0,
            }}>
            Built like a field manual,
            <br />
            shipped like open source.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <article
              key={p.title}
              className="relative rounded-md border border-[var(--ink)]/10 bg-[var(--paper)] p-6"
              style={{
                boxShadow:
                  '0 1px 0 rgba(15,27,45,0.06), 0 14px 30px -22px rgba(15,27,45,0.3)',
              }}>
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{background: 'var(--primary)'}}
              />
              <span
                className="inline-flex items-center gap-2 font-mono-cs"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: 'var(--muted-foreground)',
                }}>
                {p.icon}
                {p.eyebrow}
              </span>
              <h3
                className="font-display mt-3"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  fontStyle: 'italic',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                {p.title}
              </h3>
              <p
                className="mt-2"
                style={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: 'var(--muted-foreground)',
                }}>
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AntiDumpPledge(): ReactNode {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--paper)] py-20">
      <TopographicBackground />
      <div className="relative mx-auto max-w-[1100px] px-8">
        <div
          className="relative rounded-lg border border-[var(--ink)]/15 bg-[var(--card)] p-10 md:p-14"
          style={{
            boxShadow:
              '0 1px 0 rgba(15,27,45,0.06), 0 24px 50px -28px rgba(15,27,45,0.35)',
          }}>
          <div
            aria-hidden
            className="absolute -top-6 left-10 grid h-12 w-12 place-items-center rounded-full border-2 border-[var(--accent)] bg-[var(--paper)] font-mono-cs"
            style={{
              fontSize: 10,
              letterSpacing: '0.16em',
              color: 'var(--accent)',
              transform: 'rotate(-8deg)',
            }}>
            <ShieldCheck size={20} aria-hidden />
          </div>

          <span
            className="font-mono-cs"
            style={{
              fontSize: 11,
              letterSpacing: '0.16em',
              color: 'var(--accent)',
            }}>
            THE ANTI-DUMP PLEDGE
          </span>
          <h2
            className="font-display mt-3"
            style={{
              fontSize: 'clamp(28px, 3.6vw, 44px)',
              fontStyle: 'italic',
              fontWeight: 600,
              lineHeight: 1.15,
              margin: 0,
            }}>
            CertSherpa never hosts, links, or sells exam dumps.
          </h2>
          <p
            className="mt-4 max-w-2xl"
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--muted-foreground)',
            }}>
            Every practice question is original, written to align with
            published exam objectives. If anything looks like a leak, we remove
            it within 48 hours. Climbing the right way is the only way we ship
            this project.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PaperButton
              variant="ghost"
              href="https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/blob/main/README.md#anti-dump-policy">
              Read the full policy
            </PaperButton>
            <PaperButton
              variant="ghost"
              href="https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/issues/new/choose">
              Report a violation
            </PaperButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function Routes(): ReactNode {
  const routes = [
    {
      title: 'Cloud',
      vendor: 'AWS · Azure · GCP',
      type: 'Category',
      summary:
        'Five peaks: SAA-C03, SAP-C02, AZ-900, AZ-104, GCP-ACE. Strong starting point.',
      href: '/docs/categories/cloud',
      difficulty: 'medium' as const,
      lastVerified: 'MAY 2026',
    },
    {
      title: 'Security',
      vendor: 'CompTIA · ISC2',
      type: 'Category',
      summary:
        'Security+ for the foothills, CISSP for the death zone — both fully written.',
      href: '/docs/categories/security',
      difficulty: 'hard' as const,
      lastVerified: 'MAY 2026',
    },
    {
      title: 'DevOps',
      vendor: 'CNCF · HashiCorp',
      type: 'Category',
      summary:
        'CKA and Terraform Associate — practical, hands-on, scenario-rich drills.',
      href: '/docs/categories/devops',
      difficulty: 'medium' as const,
      lastVerified: 'MAY 2026',
    },
  ];

  return (
    <section className="relative bg-[var(--card)] py-20">
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="mb-10">
          <span
            className="font-mono-cs"
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              color: 'var(--muted-foreground)',
            }}>
            POPULAR ROUTES
          </span>
          <h2
            className="font-display mt-2"
            style={{
              fontSize: 'clamp(28px, 3.6vw, 40px)',
              fontStyle: 'italic',
              fontWeight: 600,
              lineHeight: 1.1,
              margin: 0,
            }}>
            Where most climbers start.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => (
            <FieldJournalCard
              key={r.href}
              title={r.title}
              vendor={r.vendor}
              type={r.type}
              difficulty={r.difficulty}
              lastVerified={r.lastVerified}
              summary={r.summary}
              href={r.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Basecamp"
      description="A community-driven hub of certification prep — curated study resources and original practice questions for AWS, Azure, GCP, CISSP, CCNA, CKA, and more.">
      <Hero />
      <PeaksGallery />
      <Pillars />
      <AntiDumpPledge />
      <Routes />
    </Layout>
  );
}
