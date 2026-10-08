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

  // Rewrite every root-absolute href/src ("/assets/…", "/savetovanje/") in the
  // final HTML into a path relative to the page being written. The site then
  // works wherever _site/ is served from — the GitHub Pages subpath, a local
  // static server at the root, or file:// — without a pathPrefix.
  // Protocol-relative ("//…"), external, "#", mailto: and tel: are untouched.
  const toRelative = (fromUrl, target) => {
    const [, pathname, suffix] = target.match(/^([^?#]*)(.*)$/);
    const fromDir = fromUrl.endsWith("/") ? fromUrl : path.posix.dirname(fromUrl) + "/";
    let rel = path.posix.relative(fromDir, pathname) || ".";
    if (pathname.endsWith("/") && !rel.endsWith("/")) rel += "/";
    return rel + suffix;
  };

  eleventyConfig.addTransform("relative-urls", function (content) {
    const outputPath = this.page.outputPath;
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    const fromUrl = this.page.url;
    return content.replace(
      /(\s(?:href|src)=)(["'])(\/(?!\/)[^"']*)\2/g,
      (_, attr, quote, target) => attr + quote + toRelative(fromUrl, target) + quote
    );
  });

  eleventyConfig.addFilter("extractToc", (html) => {
    if (!html) return [];
    const matches = [...html.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)];
    return matches.map((m) => ({
      id: m[1],
      label: m[2].replace(/<[^>]+>/g, "").trim(),
    }));
  });

  // Page groups (_data/pageGroups.json): a tree of { url, label, title, children }.
  // groupFlatten → sidebar rows in document order; groupNode → the current
  // page's node and its parent, for the links at the bottom of the article.
  // maxDepth limits the sidebar (e.g. 1 = root + its children). A visible row
  // whose hidden descendants include the current page is flagged
  // isCurrentSection, so deeper pages still show where the reader is.
  eleventyConfig.addFilter("groupFlatten", (tree, currentUrl, maxDepth = Infinity) => {
    const rows = [];
    const contains = (node) =>
      (node.children || []).some((child) => child.url === currentUrl || contains(child));
    const walk = (node, depth) => {
      const atLimit = depth >= maxDepth;
      rows.push({
        label: node.label,
        url: node.url,
        depth,
        isCurrent: node.url === currentUrl,
        isCurrentSection: atLimit && contains(node),
      });
      if (!atLimit) (node.children || []).forEach((child) => walk(child, depth + 1));
    };
    if (tree) walk(tree, 0);
    return rows;
  });

  eleventyConfig.addFilter("groupNode", (tree, currentUrl) => {
    const find = (node, parent) => {
      if (node.url === currentUrl) return { node, parent };
      for (const child of node.children || []) {
        const hit = find(child, node);
        if (hit) return hit;
      }
      return null;
    };
    return (tree && find(tree, null)) || {};
  });

  // Header nav: is this item (or, for a dropdown, one of its children) the
  // current page or an ancestor of it? Drives the coral "active" underline.
  eleventyConfig.addFilter("navActive", (item, currentUrl) => {
    const matches = (url) =>
      typeof url === "string" && url.startsWith("/") && url !== "/" &&
      (currentUrl === url || currentUrl.startsWith(url));
    if (item.children) return item.children.some((child) => matches(child.url));
    return matches(item.url);
  });

  // Site search index (_site/search-index.json), built from the final HTML of
  // every page so it always matches what is published. assets/js/search.js
  // fetches it on demand. Each entry: { url, title, headings, text }.
  const decodeEntities = (s) =>
    s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  const htmlToText = (html) =>
    decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    const fs = require("node:fs/promises");
    const pages = results
      .filter((r) => typeof r.outputPath === "string" && r.outputPath.endsWith(".html"))
      .filter((r) => r.url && r.url !== "/404/")
      .map((r) => {
        const main = (r.content.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ""])[1]
          .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
          .replace(/<nav class="breadcrumbs">[\s\S]*?<\/nav>/g, " ")
          .replace(/<aside class="table-of-contents[\s\S]*?<\/aside>/g, " ");
        const h1 = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        const title = h1 ? htmlToText(h1[1]) : htmlToText((r.content.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1]);
        const headings = [...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => htmlToText(m[1]));
        return { url: r.url, title, headings, text: htmlToText(main) };
      })
      .sort((a, b) => a.url.localeCompare(b.url));
    await fs.writeFile(path.join(dir.output, "search-index.json"), JSON.stringify(pages));
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
