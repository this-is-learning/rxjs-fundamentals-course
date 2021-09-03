const shadesOfPurpleTheme = require('prism-react-renderer/themes/shadesOfPurple');

const organizationName = 'this-is-learning';
const projectName = 'rxjs-fundamentals-course';
const title = 'RxJS Fundamentals';

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  baseUrl: `/${projectName}/`,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        blog: {
          editUrl: `https://github.com/${organizationName}/${projectName}/edit/main/blog`,
          showReadingTime: true,
        },
        docs: {
          editUrl: `https://github.com/${organizationName}/${projectName}/edit/main`,
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  projectName,
  tagline: 'An Open Learning course by This is Learning',
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      footer: {
        copyright: `© ${new Date().getFullYear()} This is Learning. Licensed under CC BY-SA 4.0.`,
        links: [
          {
            title: 'Open Learning',
            items: [
              {
                label: 'RxJS Fundamentals',
                to: '/docs/part-1',
              },
              {
                label: 'This is Learning on DEV Community',
                href: 'https://dev.to/this-is-learning',
              },
              {
                label: 'This is Angular on DEV Community',
                href: 'https://dev.to/this-is-angular',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'This is Learning Community on Discord',
                href: 'https://discord.gg/ygKzbrBtVn',
              },
              {
                label: 'This is Learning on GitHub',
                href: 'https://github.com/this-is-learning',
              },
              {
                label: 'This is Angular on GitHub',
                href: 'https://github.com/this-is-learning',
              },
            ],
          },
          {
            title: 'Social',
            items: [
              {
                label: 'Star on GitHub',
                href: `https://github.com/${organizationName}/${projectName}`,
              },
              {
                label: 'This is Learning on Twitter',
                href: 'https://twitter.com/Thisis_Learning',
              },
              {
                label: 'This is Angular on Twitter',
                href: 'https://twitter.com/Thisis_Angular',
              },
            ],
          },
        ],
        style: 'dark',
      },
      navbar: {
        items: [
          {
            docId: 'part-1',
            label: 'Course',
            position: 'left',
            type: 'doc',
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            label: 'GitHub',
            position: 'right',
          },
        ],
        logo: {
          alt: title,
          src: 'img/logo.png',
        },
        title,
      },
      prism: {
        darkTheme: shadesOfPurpleTheme,
        defaultLanguage: 'typescript',
        theme: shadesOfPurpleTheme,
      },
    }),
  title,
  url: `https://${organizationName}.github.io`,
});
