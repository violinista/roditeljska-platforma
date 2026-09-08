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

  const PATH_PREFIX = "/roditeljska-platforma/";
  const isInternalPath = (href) =>
    typeof href === "string" &&
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !href.startsWith(PATH_PREFIX);

  md.core.ruler.after("inline", "prefix-internal-links", (state) => {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== "inline" || !blockToken.children) continue;
      for (const token of blockToken.children) {
        if (token.type !== "link_open") continue;
        const hrefIdx = token.attrIndex("href");
        if (hrefIdx < 0) continue;
        const href = token.attrs[hrefIdx][1];
        if (!isInternalPath(href)) continue;
        token.attrs[hrefIdx][1] = PATH_PREFIX + href.slice(1);
      }
    }
  });

  // Open every external link in a new tab. `rel` is required alongside
  // target="_blank": without noopener the opened page gets a handle on
  // window.opener and can navigate this tab elsewhere (tabnabbing).
  // Applies to markdown bodies only — .njk templates set their own attrs.
  const isExternalHref = (href) =>
    typeof href === "string" && /^(https?:)?\/\//i.test(href);

  md.core.ruler.after("inline", "external-links-new-tab", (state) => {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== "inline" || !blockToken.children) continue;
      for (const token of blockToken.children) {
        if (token.type !== "link_open") continue;
        const hrefIdx = token.attrIndex("href");
        if (hrefIdx < 0) continue;
        if (!isExternalHref(token.attrs[hrefIdx][1])) continue;
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
    }
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
    pathPrefix: "/roditeljska-platforma/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
