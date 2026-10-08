# Oko deteta — Design System

Practical rules for anyone (human or AI agent) changing how the site looks.

## Sources and where things live

- **References** (repo root): `resources-colors.png` (palette), `resources-mockup.pdf` (homepage mockup, the visual source of truth), `resources-logo.png` (master logo).
- **Tokens:** `design-system/tokens.css` is the single source for every colour, font, size, space, radius and shadow. A live specimen is in `design-system/index.html`; open it directly in a browser.
- **Components:** `assets/css/site.css`. It uses **tokens only**: no hex, `rgb()` or font names. Add a token first if a value is missing.
- **Load order (load-bearing):** `bootstrap.min.css` → `tokens.css` → `site.css`. Bootstrap's `--bs-*` variables are mapped to tokens in `tokens.css`.

## Colours

### Brand
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | #264653 | Navy-slate: footer, navy bands, navy buttons, body text |
| `--color-primary-dark` | #1A333D | Ink: all headings; hover for navy buttons |
| `--color-secondary` | #E76F51 | Coral: primary CTA fill, active-nav underline, icon circles, decoration |
| `--color-secondary-dark` | #C4512F | Coral hover/pressed |
| `--color-secondary-text` | #A84428 | Coral **as text**: "Saznaj više →" links, current TOC item |
| `--color-tertiary` | #E9C46A | Gold: underline bars, button on navy, focus ring on dark |
| `--color-accent` | #F4A261 | Orange: **decorative only** (bars, blobs, step 3) |
| `--color-teal` | #006B70 | Logo teal: inline links, eyebrow labels, focus ring |

### Surfaces
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | #FBF9F4 | Page background (cream), header |
| `--color-surface` | #FFFFFF | Inputs, dropdowns, TOC card, search dialog |
| `--color-surface-warm` | #F7F2EA | Hero band, page-title band, about section, table headers |
| `--color-tint-coral` / `-orange` / `-gold` | #FCE9DF / #FDECDA / #FAF0DC | Tinted cards; callout (gold), blockquote (coral) |
| `--color-band-peach` | #F9CEA4 | Homepage CTA band |
| `--color-surface-dark` | = primary | Article CTA band, footer |

### Text and lines
| Token | Hex | Use |
|---|---|---|
| `--color-heading` | #1A333D | h1–h6 |
| `--color-text` | #264653 | Body |
| `--color-text-muted` | #5A6E76 | Meta, captions, breadcrumbs, card descriptions |
| `--color-text-inverse` / `-inverse-muted` | #FFFFFF / #C9D6DA | Text on navy |
| `--color-border` | #E8E1D6 | Decorative hairlines |
| `--color-border-input` | #7F9097 | Form-field edges (≥3:1 on white, WCAG 1.4.11) |
| `--color-border-inverse` | white 18% | Dividers on navy |

### Contrast rules (all verified, WCAG AA)
- Body text and headings on cream: 9.6:1 and 12.6:1. Muted text is ≥4.5:1 on cream, warm surfaces and every tint.
- **Never set coral, orange or gold as text on light backgrounds.** Use `--color-secondary-text` (≥5:1 on cream and tints) or `--color-heading`.
- **White on coral (#E76F51) is 3.1:1.** It is allowed only for labels **≥19px bold** (`--font-size-button`, weight 700), which counts as WCAG large text. Smaller labels on coral are not allowed.
- On gold or orange fills, text is `--color-primary-dark` (7.9:1 / 6.4:1).
- Big numbers (stats) stay in `--color-heading`. The palette colour goes on a 4px bar above the number, not on the text.

## Typography

| Role | Family | Weights |
|---|---|---|
| Headings, nav, buttons, labels, eyebrows, numbers | **Plus Jakarta Sans** (`--font-family-heading`) | 500–800 |
| Body, long-form content, inputs | **Open Sans** (`--font-family-base`); also the logo's typeface | 400, 400 italic, 600, 700 |
| One annotation only ("Niste sami u ovome.") | **Caveat** (`--font-family-script`) | 500, loaded with `&text=` (a few KB) on pages with `cta: true` |

- Lora and Inter (also supplied) are deliberately unused. The mockup has no serif text, and Open Sans already covers body copy and matches the logo.
- Fonts load from Google Fonts in `base.njk`. The latin-ext subset covers č ć đ š ž.

| Token | Size | Use |
|---|---|---|
| `--font-size-display` | clamp(36→60px) | Hero h1, weight 800, line-height 1.1, −0.02em |
| `--font-size-3xl` | clamp(32→48px) | Page and article h1 |
| `--font-size-2xl` | clamp(28→40px) | Section h2 |
| `--font-size-xl` | 30px | h3, article h2, card-band titles |
| `--font-size-lg` | 24px | h4, article h3 |
| `--font-size-md` | 20px | Lead, card titles |
| `--font-size-base` | **18px** | Body (line-height 1.65) |
| `--font-size-sm` | 16px | Nav, labels, meta, small body |
| `--font-size-xs` | 14px | Fine print, eyebrows |
| `--font-size-stat` | clamp(36→46px) | "U brojkama" numbers |

- Headings use weight 700, line-height 1.15 and −0.01em letter-spacing.
- Eyebrows are xs, bold, uppercase, +0.08em, in teal.

## Logo

| File | Use |
|---|---|
| `assets/img/logo-horizontal.png` | Header (cream background) |
| `assets/img/logo-horizontal-light.png` | Footer and any navy background; teal inks become white |
| `resources-logo-horizontal.png` | Deliverable copy of the horizontal logo |
| `resources-logo.png` | Master stacked logo. Do not edit |

- **Composition:** symbol on the left; "OKO DETETA" plus the one-line tagline on the right, centred vertically on the symbol. The size is 1449×368 (about 4:1) with a transparent background.
- **Height:** 52px on desktop (`--logo-height`), 40px below 1200px, 34px below 375px, 48px in the footer. Never smaller than 34px.
- Always set `width`/`height` attributes and `alt="Oko deteta — Platforma za roditelje"`.
- Don't recolour, stretch or re-arrange it. The light variant is the only allowed recolour.
- **Regenerate** with `python3 design-system/make-logo-horizontal.py`, run from `website/`. It needs Pillow and is not part of the build.

## Layout and spacing

- **Spacing:** 4px base, `--space-1` (4px) through `--space-9` (96px).
- **Section padding:** `--space-9` (96px), `--space-8` (64px) below 768px. When one section directly follows another of the same background, drop one side's padding.
- **Containers and breakpoints:** Bootstrap containers. Breakpoints are 576 / 768 / 992 / 1200px.
- **Gutters:** use `g-4 g-lg-5`, never bare `g-5`. Its −24px margins overflow the 12px container padding on phones.
- **Header height:** `--header-height` is 72px, 88px at ≥1200px. Sticky TOC and anchor offsets use it.
- **Radii:**
  - `--radius-md` 12px: inputs
  - `--radius-lg` 16px: cards, bands, dialogs
  - `--radius-xl` 28px: hero image
  - `--radius-full`: pills, icon circles
- **Shadows:** warm and soft. Cards are **flat at rest** and get `--shadow-md` plus a 2px lift on hover. `--shadow-lg` is for overlays (dropdown on mobile, search dialog).

## Components

### Buttons (`.btn-pill` + variant)
| Variant | Fill | Label | Where |
|---|---|---|---|
| `-primary` | coral | white, ≥19px bold | Main CTA |
| `-outline` | transparent, coral border | `--color-secondary-text` | Secondary pill ("Prijava / Registracija") |
| `-navy` | navy | white | On the peach band |
| `-gold` | gold | ink | On navy bands |

- **Circle link** (`.btn-link-circle`): text plus a 44px coral-outlined circle with an arrow. Used for the secondary action next to a primary pill.
- **Action link** (`.discover-btn`): coral text with a trailing arrow; the gap grows on hover.
- Bootstrap `.btn-primary` / `.btn-outline-primary` are re-mapped to these looks.
- All buttons are at least 44px tall.

### Cards
- No border, a tinted fill and `--radius-lg`.
- Tint rotates by `:nth-child`: coral → orange → coral → gold.
- Icon circles are 56px: coral with a white icon, or gold with an ink icon.

### Section titles
- Left-aligned H2, then a 48×4px gold bar, then a muted subtitle.
- `.inline-title` puts the bar after the heading on the same line ("U brojkama —").

### Header
- Logo top-left. Then nav (Jakarta 600, ink) → search icon → outline pill → coral pill.
- Current section gets a 2px coral underline (`.is-active`, set by the `navActive` filter).
- Dropdowns open on hover, keyboard focus or click, and close on Escape or an outside click.
- **Below 1200px:** the hamburger `<button>` opens a full-height panel. The two pills dock at the bottom of the screen and the search icon stays in the bar.

### Search
- The icon opens a native `<dialog>` with an input, live results, title, snippet and `<mark>` highlights.
- The index is `/search-index.json`, built after every Eleventy build.
- Matching ignores case and diacritics.

### Footer
- Navy background with the light logo, inverse-muted text and uppercase column headings.
- Social icons are 44px outlined circles that turn gold on hover.

### Links
- **Inline content links:** teal, underlined (1px, 3px offset).
- **Navigation and action links:** no underline. They rely on position or arrow cues.

### Forms
- Labels: Jakarta 600 in ink.
- Inputs: white, 48px tall, with `--color-border-input`.
- Focus: teal border plus a 3px teal ring.
- Submit: coral primary pill, full-width on phones.

### Article blocks
| Block | Treatment |
|---|---|
| Callout | Gold tint, 4px gold left border |
| Details | White, warm summary row, navy +/− circle |
| Tables | White, warm header row, hairlines; scroll on small screens |
| Blockquote | Coral tint, coral left border |
| `.guide-map` | Tinted cards; the current item is white with a coral left border |
| TOC / group TOC | White card; the current item is coral tint with coral text |
| `.article-cta` | Navy band, gold icon and button, coral and gold corner shapes, and the "Niste sami u ovome." annotation (Caveat, white, gold swoosh and heart) |

### Illustrations
- Files are in `assets/img/illustrations/`: leaf, heart-doodle, sunburst, swoosh and heart-outline.
- They are hand-authored SVGs in palette colours. Their hex values live in the SVG files, the only exception to the tokens rule.
- They are always **decorative**: CSS backgrounds or pseudo-elements, never content. Hide them below 576px if they crowd the layout.

## Accessibility rules

- **Focus:** every interactive element shows `:focus-visible`, a 3px ring in `--color-focus`. Inside `.on-dark` the token is gold. Never remove an outline without a visible replacement.
- **Toggles** are `<button>` elements with `aria-expanded` and a Serbian `aria-label`. Icon-only controls always have an `aria-label`. Decorative `<i>` icons get `aria-hidden="true"`.
- **Hit targets:** at least 44×44px (`--tap-target`).
- **Overflow:** no horizontal scroll at 360px width.

## Motion

- No load- or scroll-triggered animation.
- Hover and focus transitions of 0.15s on colour, shadow, transform or gap are fine.
- `scroll-behavior: smooth` for anchor jumps is the single exception.

## Checklist for a new component

1. Use existing tokens. If a value is missing, add a semantic token to `tokens.css` (and to this file).
2. Pick a surface from the tables above and check text contrast against it.
3. Use the existing button, card and title patterns instead of inventing new ones.
4. Give it focus styles and 44px targets, and make sure it works at 360px.
5. Write `href`/`src` as root-absolute paths in templates. CSS `url()` must be relative to the CSS file.
