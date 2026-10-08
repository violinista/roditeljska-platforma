"""Build the horizontal website logo from the stacked source logo.

    cd website && python3 design-system/make-logo-horizontal.py

Reads  resources-logo.png  (2000x2000, flat artwork on a flat cream background)
Writes resources-logo-horizontal.png       teal text, transparent background
       assets/img/logo-horizontal.png       same file, used in the header
       assets/img/logo-horizontal-light.png teal inks -> white, for the navy footer

The artwork is not redrawn. Its elements are cropped, the background is removed
by colour-unmixing every pixel against the known background and inks (clean
anti-aliased edges on any background), and they are recomposed to match the
mockup: symbol on the left, the scaled-down wordmark beside it, and the two
tagline lines joined into one at their original size and tracking.
Proportions are measured from resources-mockup.pdf (see DESIGN-SYSTEM.md).
Dev-only tool; needs Pillow. Not part of the Eleventy build.
"""
import shutil
from PIL import Image

SRC = "resources-logo.png"
OUT = "resources-logo-horizontal.png"
WEB = "assets/img/logo-horizontal.png"
WEB_LIGHT = "assets/img/logo-horizontal-light.png"

INKS = [(0x00, 0x6B, 0x70), (0x0F, 0x60, 0x6B), (0xE7, 0x6F, 0x51), (0xFF, 0xCC, 0x53)]
TEALS = INKS[:2]

# Element boxes (x0, y0, x1, y1) in the 2000x2000 source.
SYMBOL = (698, 588, 1299, 1197)
WORDMARK = (566, 1245, 1442, 1344)
TAGLINE_1 = (723, 1400, 1281, 1448)   # PLATFORMA ZA
TAGLINE_2 = (808, 1465, 1193, 1520)   # RODITELJE

# Mockup proportions, relative to the wordmark width.
SYMBOL_HEIGHT = 0.393
GAP_X = 0.097   # symbol -> text
GAP_Y = 0.055   # wordmark -> tagline
WORD_GAP = 58   # measured word space in the source tagline, reused between ZA and RODITELJE
PAD = 12


def unmix(img, bg):
    """Flat-colour artwork on a flat background -> RGBA with true alpha."""
    out = Image.new("RGBA", img.size)
    p, o = img.load(), out.load()
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            px = p[x, y]
            v = [px[k] - bg[k] for k in range(3)]
            best = None
            for c in INKS:
                d = [c[k] - bg[k] for k in range(3)]
                a = sum(d[k] * v[k] for k in range(3)) / sum(dk * dk for dk in d)
                a = max(0.0, min(1.0, a))
                r = sum((v[k] - a * d[k]) ** 2 for k in range(3))
                if best is None or r < best[0]:
                    best = (r, c, a)
            o[x, y] = best[1] + (round(best[2] * 255),)
    return out


def main():
    src = Image.open(SRC).convert("RGB")
    bg = src.getpixel((5, 5))

    word = unmix(src.crop(WORDMARK), bg)
    tag1 = unmix(src.crop(TAGLINE_1), bg)
    tag2 = unmix(src.crop(TAGLINE_2), bg)
    symbol = unmix(src.crop(SYMBOL), bg)

    ww = word.size[0]
    sym_h = round(SYMBOL_HEIGHT * ww)
    symbol = symbol.resize((round(symbol.size[0] * sym_h / symbol.size[1]), sym_h), Image.LANCZOS)
    gap_x, gap_y = round(GAP_X * ww), round(GAP_Y * ww)

    tag_w = tag1.size[0] + WORD_GAP + tag2.size[0]
    tag_h = max(tag1.size[1], tag2.size[1])
    text_w = max(ww, tag_w)
    text_h = word.size[1] + gap_y + tag_h

    w = PAD + symbol.size[0] + gap_x + text_w + PAD
    h = PAD + max(sym_h, text_h) + PAD
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    canvas.alpha_composite(symbol, (PAD, (h - sym_h) // 2))
    tx, ty = PAD + symbol.size[0] + gap_x, (h - text_h) // 2
    canvas.alpha_composite(word, (tx, ty))
    canvas.alpha_composite(tag1, (tx, ty + word.size[1] + gap_y))
    canvas.alpha_composite(tag2, (tx + tag1.size[0] + WORD_GAP, ty + word.size[1] + gap_y))
    canvas.save(OUT, optimize=True)
    shutil.copyfile(OUT, WEB)

    light = canvas.copy()
    lp = light.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = lp[x, y]
            if a and (r, g, b) in TEALS:
                lp[x, y] = (255, 255, 255, a)
    light.save(WEB_LIGHT, optimize=True)
    print(f"{w}x{h}")


if __name__ == "__main__":
    main()
