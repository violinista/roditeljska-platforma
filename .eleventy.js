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
    return content
      .replace(
        /(\s(?:href|src)=)(["'])(\/(?!\/)[^"']*)\2/g,
        (_, attr, quote, target) => attr + quote + toRelative(fromUrl, target) + quote
      )
      // srcset (<picture><source>, <img>) is a comma-separated list of
      // "url [descriptor]" candidates: rewrite each root-absolute URL.
      .replace(
        /(\ssrcset=)(["'])([^"']*)\2/g,
        (_, attr, quote, list) =>
          attr + quote +
          list.replace(/(^|,)(\s*)(\/(?!\/)[^\s,]*)/g,
            (m, sep, ws, target) => sep + ws + toRelative(fromUrl, target)) +
          quote
      );
  });

  // {% readmore %}…{% endreadmore %} — one-way "Pročitaj više ›" expander for
  // secondary text (light-blue text in the .docx sources). main.js moves the
  // trigger inline to the end of the preceding paragraph. The blank lines let
  // markdown-it render the Markdown between the tags.
  // Appended as ?v= to our own CSS/JS links so browsers (and the GitHub
  // Pages CDN cache) pick up new versions after each build.
  // A function, so it is re-evaluated on every rebuild under `npm start`
  // (a plain value would stay fixed for the whole dev-server session).
  eleventyConfig.addGlobalData("buildId", () => Date.now().toString(36));

  eleventyConfig.addPairedShortcode("readmore", (content) =>
    '<details class="read-more">\n' +
    '<summary>Pročitaj više <i class="bi bi-chevron-right" aria-hidden="true"></i></summary>\n\n' +
    content.trim() +
    "\n\n</details>\n"
  );

  // {% slideshow "id", "Accessible title" %}…{% endslideshow %} wraps
  // {% slide "Korak 1", "Slide title" %}…{% endslide %} blocks in a modal
  // <dialog> (the "Situacija 1–3" step-by-step guides on
  // /ocenjivanje/reagovanje-na-ocenu/). assets/js/slideshow.js shows one slide
  // at a time and builds the dots; without JS a #id link shows the slides
  // stacked inline (CSS :target). Same markdown rules as readmore: the blank
  // lines let markdown-it render the Markdown between the tags, and every
  // HTML line starts with a block-level tag. No <h2 id>, so extractToc skips it.
  const escapeHtml = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  eleventyConfig.addPairedShortcode("slideshow", (content, id, title) =>
    `<dialog id="${escapeHtml(id)}" class="slideshow" aria-label="${escapeHtml(title)}">\n` +
    '<div class="slideshow-close-wrap"><button type="button" class="slideshow-close" data-slideshow-close aria-label="Zatvori"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>\n' +
    '<div class="slideshow-body">\n\n' +
    content.trim() +
    '\n\n<div class="slideshow-end" data-slideshow-cta hidden><a href="/savetovanje/" class="btn-pill btn-pill-primary">Zakaži savetovanje</a></div>\n' +
    "</div>\n" +
    '<div class="slideshow-nav">\n' +
    '<button type="button" class="btn-pill btn-pill-outline slideshow-btn slideshow-prev" data-slideshow-prev><i class="bi bi-arrow-left" aria-hidden="true"></i> <span>Prethodni</span></button>\n' +
    '<div class="slideshow-progress"><div class="slideshow-dots" data-slideshow-dots></div><p class="visually-hidden" aria-live="polite" data-slideshow-counter></p></div>\n' +
    '<button type="button" class="btn-pill btn-pill-outline slideshow-btn slideshow-next" data-slideshow-next><span>Sledeći</span> <i class="bi bi-arrow-right" aria-hidden="true"></i></button>\n' +
    "</div>\n" +
    "</dialog>\n"
  );

  eleventyConfig.addPairedShortcode("slide", (content, label, title) =>
    `<section class="slide" data-label="${escapeHtml(label)}">\n` +
    `<div class="slide-head"><span class="banner-badge">${escapeHtml(label)}</span><h3 class="slide-title">${escapeHtml(title)}</h3></div>\n\n` +
    content.trim() +
    "\n\n</section>\n"
  );

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
        // Deduped: the shared slideshow slides (Korak 1–3) repeat on one page.
        const headings = [...new Set([...main.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => htmlToText(m[1])))];
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
