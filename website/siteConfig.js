// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const organizationName = "this-is-learning";
const projectName = "rxjs-fundamentals-course";

module.exports = {
  baseUrl: `/${projectName}/`,
  cleanUrl: true,
  colors: {
    primaryColor: "#906331",
    secondaryColor: "#644522",
  },
  copyright: "Licensed under CC BY-SA 4.0 by This is Learning",
  favicon: "img/favicon.ico",
  footerIcon: "img/favicon.ico",
  headerIcon: "img/favicon.ico",
  headerLinks: [{ doc: "part-1", label: "Course" }],
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "default",
  },
  ogImage: "img/undraw_online.svg",
  onBrokenLinks: "error",
  onBrokenMarkdownLinks: "warn",
  onPageNav: "separate",
  organizationName,
  projectName,
  scripts: ["https://buttons.github.io/buttons.js"],
  tagline: "An Open Learning course by This is Learning",
  title: "RxJS Fundamentals",
  twitterImage: "img/undraw_tweetstorm.svg",
  twitterUsername: "Thisis_Learning",
  url: `https://${organizationName}.github.io`,
};
