const path = require("node:path");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

if (path.resolve(process.cwd()) !== path.resolve(__dirname)) {
  throw new Error(
    `\n\n11ty must be run from inside the website/ directory.\n` +
    `  Current cwd: ${process.cwd()}\n` +
    `  Expected:    ${__dirname}\n` +
    `  Fix:         cd "${__dirname}" && npm run build\n\n`
  );
}

const slugifySerbianLatin = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "design-system/tokens.css": "assets/css/tokens.css" });
  eleventyConfig.addPassthroughCopy("assets");

  const md = markdownIt({ html: true, linkify: true, breaks: false })
    .use(markdownItAnchor, {
      level: [2, 3],
      slugify: slugifySerbianLatin,
      permalink: false,
    });
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("extractToc", (html) => {
    if (!html) return [];
    const matches = [...html.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];
    return matches.map((m) => ({
      id: m[1],
      label: m[2].replace(/<[^>]+>/g, "").trim(),
    }));
  });

  eleventyConfig.addLayoutAlias("home", "layouts/home.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("page-article", "layouts/page-article.njk");
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");

  eleventyConfig.addWatchTarget("./assets/css/site.css");

  eleventyConfig.addFilter("dateSr", (value) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("sr-Latn-RS", {
      day: "numeric", month: "long", year: "numeric",
    }).format(d);
  });

  eleventyConfig.addFilter("monthShortSr", (value) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("sr-Latn-RS", { month: "short" }).format(d).toUpperCase().replace(".", "");
  });

  eleventyConfig.addFilter("day", (value) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    return d.getDate();
  });

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
