import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Categories',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Certification Categories',
        description:
          'Browse certifications by domain — Cloud, Security, Networking, DevOps, Data & AI, Linux, and PM & ITSM.',
        slug: '/categories',
      },
      items: [
        'categories/cloud',
        'categories/security',
        'categories/networking',
        'categories/devops',
        'categories/data-ai',
        'categories/linux',
        'categories/pm-itsm',
      ],
    },
    {
      type: 'category',
      label: 'Certifications',
      collapsed: false,
      link: {
        type: 'generated-index',
        title: 'Certifications',
        description:
          'Individual certification pages with resources, difficulty ratings, and community tips.',
        slug: '/certifications',
      },
      items: ['certifications/coming-soon'],
    },
  ],
};

export default sidebars;
