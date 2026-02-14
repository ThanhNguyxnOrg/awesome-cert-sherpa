import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import yamlLoaderPlugin from './plugins/yaml-loader-plugin';

const config: Config = {
  title: 'Awesome CertSherpa',
  tagline: 'Community-driven certification exam prep hub',
  favicon: 'img/favicon.ico',

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
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'CertSherpa',
      logo: {
        alt: 'CertSherpa Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Resources',
        },
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
          title: 'Resources',
          items: [
            {
              label: 'Getting Started',
              to: '/docs',
            },
            {
              label: 'Cloud',
              to: '/docs/categories/cloud',
            },
            {
              label: 'Security',
              to: '/docs/categories/security',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa/discussions',
            },
            {
              label: 'Contributing Guide',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa/blob/main/CONTRIBUTING.md',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ThanhNguyxn/awesome-cert-sherpa',
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
