import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import yamlLoaderPlugin from './plugins/yaml-loader-plugin';
import tailwindPlugin from './plugins/tailwind-plugin';

const ORG = 'ThanhNguyxnOrg';
const REPO = 'awesome-cert-sherpa';
const REPO_URL = `https://github.com/${ORG}/${REPO}`;
const SITE_URL = `https://${ORG.toLowerCase()}.github.io`;

const config: Config = {
  title: 'Awesome CertSherpa',
  tagline: 'Study smarter, summit higher.',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: `/${REPO}/`,

  organizationName: ORG,
  projectName: REPO,
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [yamlLoaderPlugin, tailwindPlugin],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${REPO_URL}/tree/main/website/`,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: `${REPO_URL}/tree/main/website/`,
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/certsherpa-social-card.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    metadata: [
      {
        name: 'description',
        content:
          'Community-driven IT certification prep — curated study resources and 1,590+ original practice questions for AWS, Azure, GCP, CISSP, CCNA, CKA, and more.',
      },
      {
        name: 'keywords',
        content:
          'certification, IT certification, AWS, Azure, GCP, CISSP, CCNA, CKA, Terraform, Security+, practice questions, exam prep, study guide',
      },
    ],
    navbar: {
      title: 'CertSherpa',
      logo: {
        alt: 'CertSherpa Logo',
        src: 'img/logo.png',
        srcDark: 'img/logo-dark.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Resources',
        },
        {to: '/practice', label: 'Practice', position: 'left'},
        {to: '/blog', label: 'Field journal', position: 'left'},
        {
          href: REPO_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Study',
          items: [
            {label: 'Getting Started', to: '/docs'},
            {label: 'Cloud', to: '/docs/categories/cloud'},
            {label: 'Security', to: '/docs/categories/security'},
            {label: 'DevOps', to: '/docs/categories/devops'},
          ],
        },
        {
          title: 'Practice',
          items: [
            {label: 'Practice Lab', to: '/practice'},
            {label: 'Networking', to: '/docs/categories/networking'},
            {label: 'Linux', to: '/docs/categories/linux'},
            {label: 'Data & AI', to: '/docs/categories/data-ai'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Field journal', to: '/blog'},
            {label: 'GitHub', href: REPO_URL},
            {label: 'Discussions', href: `${REPO_URL}/discussions`},
            {
              label: 'Contributing',
              href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Awesome CertSherpa contributors. MIT License. Built in the open at github.com/${ORG}.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'hcl'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
