# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Platforma za roditelje" — a static informational site (in Serbian) aimed at parents, with content on school grading, parent-school communication, child development topics, counseling registration, and the team behind the platform.

## Build / serve

The site is built with [Eleventy (11ty) v3](https://www.11ty.dev/).

> **⚠️ CRITICAL: cd into `website/` first.** Eleventy resolves `.eleventy.js`, `_includes/`, `_data/` relative to the current working directory. If you run any 11ty command from one level up (`/Users/mika/PROJECTS/2026 Platforma za decu/`), Eleventy will fail with:
> ```
> You're trying to use a layout that does not exist: _includes/layouts/base.njk (via `layout: layouts/base.njk`)
> ```
> The fix is always: `cd website/` first, then run the build. The local `.eleventy.js` includes a runtime guard that throws a clear error if you somehow load the config from the wrong cwd.

`package.json` declares the following dev deps:
- `@11ty/eleventy@^3.1.5` — static site generator
- `bootstrap-icons@^1.13.1` — icon webfont (.woff/.woff2 are copied into `assets/css/vendor/fonts/`)
- `markdown-it@^14.1.1` + `markdown-it-anchor@^9.2.0` — markdown engine override that adds `id` attributes to headings (powers the auto-generated Table of Contents)

Always run via npm scripts so the local pinned Eleventy is used (not a globally installed copy that may be a different version):

```sh
# from inside website/  ← required
cd /Users/mika/PROJECTS/2026\ Platforma\ za\ decu/website
npm run build      # one-shot build into _site/
npm start          # dev server with live reload at http://localhost:8080/
npm run clean      # rm -rf _site

# from anywhere else — also works:
npm --prefix /Users/mika/PROJECTS/2026\ Platforma\ za\ decu/website run build
```

**Do NOT** run `npx @11ty/eleventy` from the parent dir — it will silently pick up the global v3 install (`/Users/mika/node_modules/@11ty/eleventy/`), miss the project's `.eleventy.js`, and fail with the layout error above.

`_site/` is the build output (gitignored). `node_modules/` is gitignored. `README.md`, `CLAUDE.md`, `inspiration/`, `design-system/`, `sample-template/` are excluded from the build via `.eleventyignore`.

## Architecture overview

The site is a reusable 11ty/Nunjucks template recreated from the BootstrapMade "College" template (kept read-only in `sample-template/` and `/Users/mika/PROJECTS/2026 Platforma za decu/insiration-website/`). It layers three style sources, in this order (load order is load-bearing):

1. **Bootstrap 5** (`assets/css/vendor/bootstrap.min.css`) — layout primitives + base reset
2. **`design-system/tokens.css`** — project design tokens; rebinds `--bs-*` vars to brand palette/typography
3. **`assets/css/site.css`** — project component styles, written from scratch against the tokens

`sample-template/main.css` is **NOT loaded at runtime**. The sample template and `insiration-website/` are reference material only. Likewise, `design-system/tokens.css` is treated as an immutable source of truth — it's surfaced to the build via passthrough copy (`addPassthroughCopy({ "design-system/tokens.css": "assets/css/tokens.css" })` in `.eleventy.js`) and never edited from build code.

## Directory layout

```
.eleventy.js                  # passthroughs, layout aliases, markdown-it-anchor + extractToc filter, Serbian date filters, cwd guard
package.json                  # 11ty, bootstrap-icons, markdown-it{,-anchor} devDeps; build/start scripts
robots.txt.njk                # renders to /robots.txt — site-wide crawler block
_includes/
  layouts/
    base.njk                  # HTML shell: <head> (with noindex meta), header, footer, scripts
    home.njk                  # extends base; composes 8 homepage sections
    page.njk                  # extends base; generic markdown wrapper (no Serbian content uses this anymore)
    page-article.njk          # extends base; rich article shell (breadcrumb, auto-TOC, share, tags, optional CTA block)
  partials/
    header.njk, footer.njk, scripts.njk
    sections/                 # one partial per homepage section + reusable building blocks
      hero, about, programs, students-life, testimonials, stats, news, events,
      page-title, pagination, cta-banner, sidebar-blog, sidebar-events, contact-info-cards
_data/                        # global data, autoloaded by Eleventy
  site.json                   # nav, footer columns, social, brand, lang
  hero, timeline, coreValues, programs, activities, testimonials, metrics, highlights, news, events
  about, academics, campus, faculty, eventsExt, newsExt   # data for College multi-page kit
  savetovanjeForm             # programs list + intro for the /savetovanje/ registration form
assets/
  css/
    site.css                  # project components (token-driven)
    vendor/                   # bootstrap, bootstrap-icons, swiper, glightbox
    vendor/fonts/             # bootstrap-icons.woff{,2}
  js/
    main.js                   # mobile nav, dropdown toggle, Swiper init
    vendor/                   # bootstrap bundle, swiper, glightbox
                              # (aos.js, purecounter, isotope, imagesloaded
                              #  remain on disk but are NOT loaded)
  img/                        # ~32 .webp images

# Homepage
index.md                      # layout: layouts/home.njk

# Serbian content pages — all use layout: layouts/page-article.njk
nas-tim.md                    # team page (renamed from o-nama.md)
kontakt.md                    # contact page (stub)
pitanja-i-odgovori.md         # FAQ (stub)
savetovanje.md                # registration page with inquiry form (mailto)
ocenjivanje-u-skoli.md        # main grading guide
sta-treba-da-znamo-o-ocenjivanju.md
zakljucna-ocena.md
koraci-za-reagovanje-o-oceni.md
pracenje-napredovanja-deteta.md
sazetak-odredbi-zosov-a.md
vestine-koje-se-sticu-u-skoli.md
bezbednost-dece.md            # stub for new category
roditelji-i-skola.md          # stub for new category
tranzicija-u-obrazovanju.md   # stub for new category

# College multi-page kit (16 templates, 1:1 with source HTML, all use layout: layouts/base.njk)
# Orphaned — no longer linked from nav after the "Više stranica" dropdown removal,
# but still build at their URLs (/about/, /contact/, /news-details/, etc.).
404.njk, about.njk, academics.njk, admissions.njk, alumni.njk,
campus-facilities.njk, contact.njk, event-details.njk, events.njk,
faculty-staff.njk, news.njk, news-details.njk, privacy.njk,
starter-page.njk, students-life.njk, terms-of-service.njk
```

Each top-level `.md` or `.njk` file maps to a slugged URL (`foo.njk` → `/foo/`). Internal links use the slugged form (e.g. `/savetovanje`, `/nas-tim`).

## Navigation

The header nav lives in `_data/site.json` `nav`. Current structure (6 top-level entries):

1. **Ocenjivanje** (dropdown, 7 children) — grading guides
2. **Bezbednost dece** (dropdown, 1 child) — stub category
3. **Roditelji i škola** (dropdown, 1 child) — stub category
4. **Tranzicija u obrazovanju** (dropdown, 1 child) — stub category
5. **Savetovanje** (flat link) — `/savetovanje/`, the inquiry/registration page
6. **O nama** (dropdown, 3 children: Naš tim, Pitanja i odgovori, Kontakt)

The homepage is reachable by clicking the brand name in the header (no "Početna" nav entry). The College multi-page kit is not linked anywhere in the nav (the previous "Više stranica" dropdown was removed); those 16 pages still build and are reachable only by typing the URL.

Footer has two columns (`_data/site.json` `footer.columns`): "Ocenjivanje" (7 grading articles) and "Platforma" (Savetovanje, Naš tim, Pitanja i odgovori, Kontakt).

## Layout resolution convention

Frontmatter uses **literal layout paths** (`layout: layouts/base.njk`), not the alias names. This makes templates resolve correctly even if `.eleventy.js` is not loaded (e.g. when `npx @11ty/eleventy` is invoked from outside `website/`). Aliases (`addLayoutAlias("base", "layouts/base.njk")`) are still registered in `.eleventy.js` for ergonomic reasons but are not relied on.

When adding a new page, use the literal form:

```yaml
---
layout: layouts/base.njk         # or layouts/page-article.njk for rich content pages
title: Naslov
---
```

## Animations / motion

The site is **intentionally static** — no load or scroll animations:
- No AOS (fade-in on viewport entry)
- No PureCounter (number count-up)
- No Swiper autoplay (testimonials still swipeable, just not auto-rotating)
- No scroll-driven header shadow, no scroll-top button
- Hover transitions ARE kept (card lift, link color, button hover, dropdown open) — these aren't load/scroll-triggered

**One explicit exception**: `html { scroll-behavior: smooth; }` is set in `site.css` to enable smooth scrolling for in-page anchor jumps (Table of Contents links inside `page-article` pages). This is the only intentional scroll animation in the project.

If adding new sections, **do not add `data-aos="…"` attributes** and **do not add `transition:` rules that activate on load or scroll**. Hover/focus transitions are fine.

## Search engines / robots blocking

The entire site is blocked from being crawled or indexed:

- **`<meta name="robots">` and `<meta name="googlebot">`** on every page (in `base.njk` `<head>`) default to `noindex, nofollow, noarchive, nosnippet, noimageindex`. Frontmatter `robots:` can override per-page.
- **`/robots.txt`** (generated from `robots.txt.njk`) declares `User-agent: * / Disallow: /` plus explicit blocks for ~27 known crawlers including AI scrapers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot, CCBot, Bytespider, etc.) and SEO bots (SemrushBot, AhrefsBot, MJ12bot).

When the site is ready to go public: edit both layers (remove the `robots.txt.njk` blocks AND change the default `robots:` string in `base.njk`).

## Design tokens

- All design values live in `design-system/tokens.css` as `:root` custom properties. Naming: `--color-{role}`, `--font-size-{step}`, `--space-{n}`, `--radius-{name}`, `--shadow-{level}`.
- Tokens mirror into `--bs-*` (e.g. `--bs-primary`, `--bs-body-color`, `--bs-border-radius`) so Bootstrap utilities pick up the brand palette.
- Brand: primary `#244F95` (deep blue), accent `#DDB33D` (warm gold), plus teal/taupe/red/navy accents and a 0–900 neutral scale.
- Typography: Montserrat only (weights 400/500/600/700/800), imported from Google Fonts at the top of `tokens.css`.
- **Never edit `tokens.css` or `sample-template/` files.** Project styles go in `assets/css/site.css`; new component patterns should use only `var(--…)` references, no hard-coded colors/fonts/sizes.

## Content authoring

- **Homepage**: data-driven. Edit `_data/*.json` to change copy, images, stats, testimonials, events, etc. The Nunjucks partials render whatever the JSON contains.

- **Serbian content pages**: plain Markdown bodies with `layout: layouts/page-article.njk` frontmatter. To add a new Serbian content page, create `<slug>.md` at the repo root with frontmatter:

  ```yaml
  ---
  layout: layouts/page-article.njk
  title: Naslov stranice
  categories: [Tema]
  date: 2026-05-20            # optional
  readTime: 10 min čitanja     # optional
  tags: [tag1, tag2]           # optional
  cta: true                    # optional — opts into the in-article "Zakaži savetovanje" CTA block
  ---
  ```

  Then add a matching link to `_data/site.json` under `nav` and/or `footer.columns`.

  **Table of Contents** is auto-generated for `page-article` pages: every `<h2>` in the rendered HTML gets an `id` (via `markdown-it-anchor`, configured with a Serbian-Latin-aware slugify in `.eleventy.js`), and the layout's `extractToc` filter scans the rendered content and lists those headings as an `<aside class="table-of-contents">`. Pages with fewer than 1 H2 hide the aside and render full-width. To get a TOC, just write `## Heading` in the markdown body — no frontmatter `toc:` array needed (but `toc:` is still honored as an override if explicitly set).

  **In-article CTA block** ("Potrebna vam je dodatna podrška?" → button to `/savetovanje/`) appears at the bottom of any page-article page that sets `cta: true` in frontmatter. The copy and styling are hardcoded in `page-article.njk` and `assets/css/site.css` (`.article-cta`). Stubs and `/savetovanje/` itself opt out.

- **`/savetovanje/` registration form**: the page renders a Serbian inquiry form. Submit fires a `mailto:` to `kontakt@platformazaroditelje.rs` (read from `site.json` `footer.email`) via an inline JS handler that builds a `mailto:?subject=…&body=…` URL. The program list shown in the body bullets AND the form's `<select>` is driven by `_data/savetovanjeForm.json` — adding a program there updates both.

- **College multi-page templates**: 16 `.njk` files at the repo root (about, academics, admissions, alumni, campus-facilities, contact, event-details, events, faculty-staff, news, news-details, privacy, starter-page, students-life, terms-of-service, 404). All use `layout: layouts/base.njk`. Repeating blocks are fed from `_data/about.json`, `academics.json`, `campus.json`, `faculty.json`, `eventsExt.json`, `newsExt.json`. **These pages are currently orphaned** — they have no nav links pointing to them; they remain as a layout reference kit, reachable only via direct URL.

- **Adding a new homepage section**: create `_includes/partials/sections/<name>.njk`, add `_data/<name>.json` (read as a top-level variable in the partial), and `{% include %}` it in `_includes/layouts/home.njk`.

## Content language

All user-facing content is in Serbian (Latin script). Preserve diacritics (š, č, ć, ž, đ) when editing. The Serbian `.md` pages are the canonical content surface; the 16 College `.njk` templates retain BootstrapMade English placeholder copy and are intended as reference / future-translation candidates.

## Planned pages

The site is intended to grow to cover: youth empowerment ("Osnaživanje mladih"), youth employability ("Zapošljivost mladih"), and team bios for Tanja and two collaborators. The current category stubs (Bezbednost dece, Roditelji i škola, Tranzicija u obrazovanju) are placeholders for upcoming content under those themes. See `README.md` for details.

## Reference / inspiration directories (NOT in build)

- `sample-template/` — the original BootstrapMade "College" homepage HTML, kept read-only as the source for the homepage conversion.
- `/Users/mika/PROJECTS/2026 Platforma za decu/insiration-website/bootstrapmade.com/content/demo/College/` — the full multi-page demo (16 HTML files + index.html), source for the College multi-page kit. Lives outside the `website/` repo. The folder name has a typo (`insiration-` instead of `inspiration-`) that is preserved.
- `inspiration/` — saved copy of `schoolavoidance.org` (`website.html` + `website_files/`). The real brand palette/typography was extracted from the inline `<style id="global-styles-inline-css">` block (Elementor kit-9), **not** the CSS files under `website_files/` (those are Hello Elementor + plugin defaults).
- `design-system/index.html` — single-page reference doc that consumes `tokens.css`. Open directly in a browser to review.
