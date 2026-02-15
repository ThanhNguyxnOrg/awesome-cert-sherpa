import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import yamlLoaderPlugin from './plugins/yaml-loader-plugin';

const config: Config = {
  title: 'Awesome CertSherpa',
  tagline: 'Community-driven certification exam prep hub',
  favicon: 'img/favicon.png',

  future: {
    v4: true,
  },

  url: 'https://ThanhNguyxn.github.io',
  baseUrl: '/awesome-cert-sherpa/',

  organizationName: 'ThanhNguyxn',
  projectName: 'awesome-cert-sherpa',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [yamlLoaderPlugin],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/ThanhNguyxn/awesome-cert-sherpa/tree/main/website/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/ThanhNguyxn/awesome-cert-sherpa/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/certsherpa-social-card.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
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
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa',
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
            {
              label: 'Getting Started',
              to: '/docs',
            },
            {
              label: 'Cloud Certs',
              to: '/docs/categories/cloud',
            },
            {
              label: 'Security Certs',
              to: '/docs/categories/security',
            },
            {
              label: 'DevOps Certs',
              to: '/docs/categories/devops',
            },
          ],
        },
        {
          title: 'Practice',
          items: [
            {
              label: 'Practice Engine',
              to: '/practice',
            },
            {
              label: 'Networking Certs',
              to: '/docs/categories/networking',
            },
            {
              label: 'Linux Certs',
              to: '/docs/categories/linux',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa/discussions',
            },
            {
              label: 'Contributing',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa/blob/main/CONTRIBUTING.md',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Awesome CertSherpa contributors. MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
