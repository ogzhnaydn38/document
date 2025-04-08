import { themes as prismThemes } from "prism-react-renderer";

const config = {
  title: "tickatme Documents",
  tagline: "backend documents",
  favicon: "img/mindbricksIcon.png",
  url: "https://web.tickatme.com",
  baseUrl: "/",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
        },
        theme: {
          customCss: "./src/styles/custom.scss",
        },
      },
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: "announcement-bar",
      content:
        '<a href=https://web.tickatme.com target="_blank" rel="noopener"><span>A <strong>tickatme</strong> Company →</span></a>',
      isCloseable: false,
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: "Site Logo",
        src: `/logo/logo-light.svg`,
        srcDark: `/logo/logo-dark.svg`,
        href: "/docs/intro",
        target: "_self",
        width: 180,
        height: 100,
      },
      items: [
        {
          href: "https://web.tickatme.com",
          label: "tickatme",
          position: "right",
        },
      ],
    },
    footer: {
      copyright: `Copyright © 2025 My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  plugins: [
    "docusaurus-plugin-sass",
    [
      "docusaurus-plugin-module-alias",
      {
        alias: {},
      },
    ],
  ],
};

export default config;
