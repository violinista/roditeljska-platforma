# Platforma za roditelje

## Running
11ty

npx @11ty/eleventy --serve


## Stranice na sajtu

- Osnaživanje mladih
- Zapošljivost mladih
- Podrška roditeljima na početku školovanja
- O nama / Naš tim: 
  Druga stranica portala sadržaće kratke opise stručnjaka (pasus po osobi). Planirano je predstavljanje tri osobe (Tanja i još dvoje saradnika) sa jasno definisanim ulogama i kratkom biografijom.

---

# 11ty template (added 2026-05-18)

Homepage layout is a reusable 11ty/Nunjucks template recreated from `sample-template/` (BootstrapMade "College"). Layout primitives come from Bootstrap 5; colors, typography, and spacing come from `design-system/tokens.css`; project-specific component styles live in `assets/css/site.css`. Neither `sample-template/` nor `design-system/tokens.css` is loaded or edited at runtime — `tokens.css` is exposed to the build via passthrough copy.

## Build

> **⚠️ Run from inside `website/` only.** If you run 11ty from one level up, you'll see:
> ```
> You're trying to use a layout that does not exist: _includes/layouts/base.njk (via `layout: layouts/base.njk`)
> ```
> Fix: `cd website/` first.

```sh
cd /Users/mika/PROJECTS/2026\ Platforma\ za\ decu/website   # or wherever you cloned

npm run build      # one-shot build into _site/
npm start          # dev server with live reload at http://localhost:8080/
npm run clean      # rm -rf _site

# from any other directory:
npm --prefix /path/to/website run build
```

`npx @11ty/eleventy` also works **only when invoked from `website/`** — otherwise it picks up a global install (if any), misses the project config, and fails. The npm scripts above use the locally pinned `@11ty/eleventy@^3.1.5` in `package.json`.

## Directory layout

```
.eleventy.js                 # passthroughs, layout aliases, Serbian date filters
_includes/
  layouts/
    base.njk                 # HTML shell: <head>, header, footer, scripts
    home.njk                 # extends base; composes all homepage section partials
    page.njk                 # extends base; renders markdown content inside a container
  partials/
    header.njk
    footer.njk
    scripts.njk              # vendor JS + main.js
    sections/                # one partial per homepage section
      hero.njk
      about.njk
      programs.njk
      students-life.njk
      testimonials.njk
      stats.njk
      news.njk
      events.njk
_data/                       # global data, autoloaded by Eleventy
  site.json                  # brand, lang, navigation, footer config
  hero.json                  # hero copy, stats, CTAs, feature cards
  timeline.json              # about-section milestones
  coreValues.json            # 4 value cards
  programs.json              # 1 featured guide + grid of links
  activities.json            # students-life section
  testimonials.json          # Swiper carousel data
  metrics.json               # PureCounter stats
  highlights.json            # text + gallery block
  news.json                  # 4 article cards
  events.json                # 6 upcoming events + filter tabs
assets/
  css/
    site.css                 # project component styles, token-driven
    tokens.css               # COPIED via passthrough from design-system/tokens.css
    vendor/                  # bootstrap, bootstrap-icons, aos, swiper, glightbox
  js/
    main.js                  # init for AOS, Swiper, PureCounter, GLightbox, mobile nav
    vendor/                  # bootstrap bundle, AOS, Swiper, PureCounter, isotope, glightbox
  img/                       # .webp images used by the homepage
```

Stylesheet load order in `base.njk` is load-bearing:

1. Bootstrap (vendor defaults)
2. Bootstrap Icons + AOS + Swiper + GLightbox (vendor)
3. `tokens.css` — rebinds `--bs-*` variables (primary color, body text, radii, shadows) to project values
4. `site.css` — project components, consumes design tokens

## Adding a new page

Create a new `.md` at the repo root with frontmatter:

```markdown
---
layout: layouts/page.njk
title: Naslov stranice
---

Sadržaj stranice…
```

Eleventy maps `nova-stranica.md` → `/nova-stranica/`. To link it in the navbar, add an entry to `_data/site.json` under `nav`. To link in the footer, add to `site.json` → `footer.columns`.

## Adding a new homepage section

1. Create a new partial at `_includes/partials/sections/<name>.njk`.
2. Add a matching data file at `_data/<name>.json` (or a frontmatter-style mapping) — the partial reads it as a top-level Nunjucks variable.
3. Include the partial in `_includes/layouts/home.njk` in the desired position.

Existing partials are small and self-contained — copy one as a template. Use Bootstrap grid utilities for layout (`container`, `row`, `col-lg-*`, `g-4`, `d-flex`) and design-token CSS variables (`var(--color-primary)`, `var(--space-5)`, `var(--font-size-2xl)`) in `site.css` for visual styling.

## Editing content

Most homepage copy is driven by JSON in `_data/`. Edit the JSON file, save, and the dev server reloads automatically. Hard-coded copy that does NOT live in JSON is limited to: section headings inside partials (e.g. "O nama", "Iskustva roditelja"), the footer copyright line, and the `<title>` template.

## Design system

`design-system/tokens.css` is the immutable source of truth. Do not edit it from build code; if a token needs to change, edit it there and rebuild — the passthrough will pick it up. `design-system/index.html` is a documentation/preview page; it is excluded from the build via `.eleventyignore`.

If `site.css` grows component patterns worth reusing across projects, promote them into the `design-system/` folder.

## Constraints

- `sample-template/` is the original BootstrapMade "College" template, kept as a read-only reference. Excluded from the build.
- `inspiration/` (`schoolavoidance.org` capture) is also excluded from the build and was used only to extract the design-token palette.
- Existing markdown content pages (`o-nama.md`, `savetovanje.md`, etc.) have a minimal frontmatter block to opt into `page.njk`. Their bodies remain plain Markdown.
- Asset paths in templates are root-relative (`/assets/...`). If deploying under a subpath, set `pathPrefix` in `.eleventy.js` and route URLs through the `| url` filter in `base.njk`.

---

# College multi-page templates (added 2026-05-18)

The 16 remaining HTML pages from the BootstrapMade "College" demo have been transcribed into 11ty Nunjucks templates. Each lives at the repo root and maps 1:1 to a slugged URL:

| Page | Slug |
| --- | --- |
| `404.njk` | `/404/` |
| `about.njk` | `/about/` |
| `academics.njk` | `/academics/` |
| `admissions.njk` | `/admissions/` |
| `alumni.njk` | `/alumni/` |
| `campus-facilities.njk` | `/campus-facilities/` |
| `contact.njk` | `/contact/` |
| `event-details.njk` | `/event-details/` |
| `events.njk` | `/events/` |
| `faculty-staff.njk` | `/faculty-staff/` |
| `news-details.njk` | `/news-details/` |
| `news.njk` | `/news/` |
| `privacy.njk` | `/privacy/` |
| `starter-page.njk` | `/starter-page/` |
| `students-life.njk` | `/students-life/` |
| `terms-of-service.njk` | `/terms-of-service/` |

All 16 use `layout: layouts/base.njk` and inline their page-specific markup. Repeating blocks (faculty cards, programs, news posts, events, schedule rows) are fed from `_data/*.json` so the content can be edited without touching templates.

## New layouts

- **`_includes/layouts/page-article.njk`** — a long-form article shell modeled on `news-details.html`. Renders a breadcrumb, article header (categories, title, author, date, read-time), optional hero image, optional TOC sidebar, and a share/tags footer. The 6 existing Serbian `.md` pages have been switched from `layout: layouts/page.njk` to `layout: layouts/page-article.njk` so their content gets the richer presentation. Frontmatter fields the layout reads: `title`, `categories[]`, `author{name,role,photo}`, `date`, `readTime`, `heroImage`, `toc[{id,label}]`, `tags[]`.

## New section partials

Reusable building blocks under `_includes/partials/sections/`:

- `page-title.njk` — breadcrumb + title strip used on every inner page
- `pagination.njk` — Bootstrap pagination block
- `cta-banner.njk` — generic call-to-action banner
- `sidebar-blog.njk` — search + categories + recent posts widget
- `sidebar-events.njk` — search + categories + featured event + calendar widget
- `contact-info-cards.njk` — 4-card contact info grid

## New data files

Under `_data/`: `about.json`, `academics.json`, `campus.json`, `faculty.json`, `eventsExt.json`, `newsExt.json` — these drive the repeating blocks on the new pages. The existing `events.json` was extended with `categories`, `featured`, and `calendar` keys for the events sidebar.

## Animation policy reaffirmed

Every transcribed page strips `data-aos*` attributes, removes Swiper `autoplay`, replaces `.purecounter` spans with literal values, and omits `.scroll-top` markup. Hover transitions are kept. See `CLAUDE.md` for the codified rule.

## Bootstrap

The new pages reuse the existing local copy at `assets/css/vendor/bootstrap.min.css` + `assets/js/vendor/bootstrap.bundle.min.js`. No CDN. New `site.css` rules append to the existing file and reference design tokens exclusively (no hard-coded colors / fonts / sizes).

## Adding another page

1. Create `<slug>.njk` at the repo root with frontmatter `layout: layouts/base.njk` + `title:`.
2. Put a `page-title` block at the top (use the same breadcrumb pattern as the existing pages).
3. Inline section markup; if a block repeats, move its data into `_data/<slug>.json` and loop over it with `{% for ... %}`.
4. Add a `nav` entry in `_data/site.json` if it should appear in the header dropdown.
5. Rebuild with `npx @11ty/eleventy`.

