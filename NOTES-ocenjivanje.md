# Napomene uz izradu stranica o ocenjivanju

Ovaj dokument beleži odluke i otvorena pitanja nastala prilikom prenošenja izvornih
`.docx` dokumenata iz `dokumenti-ocenjivanje/` na stranice sajta. Nije deo sajta
(isključen je iz builda preko `.eleventyignore`).

> **Napomena:** izvorni `.docx` fajlovi i `*shema.pdf` dijagrami **nisu deo repozitorijuma**
> — `dokumenti-ocenjivanje/` je naveden u `.gitignore` jer je reč o radnim dokumentima koji
> nisu za javno objavljivanje. Fajlovi se čuvaju lokalno; imena ispod služe kao referenca.

## Mapiranje izvornih dokumenata na stranice

| Izvorni dokument | Stranica |
|---|---|
| `Ocenjivanje UVODNI TEKST 1 fin.docx` | `/ocenjivanje/` |
| `Tekst 2/2 Fin Šta moje dete treba da zna.docx` + 2.1, 2.2, 2.3, 2.3.1, 2.3.1.a, 2.3.2, 2.3.3, 2.3.4 | `/ocenjivanje/sta-moje-dete-treba-da-zna/` |
| `Tekst 3/3.1 …` + 3.1.1, 3.1.1.a, 3.2, 3.2.1, 3.2.2, 3.3, 3.3.1, 3.3.2, 3.3.3, 3.3.4 | `/ocenjivanje/sta-znamo-o-ocenjivanju/` |
| `Tekst 4/4 …` + 4.1, 4.1.1, 4.2 | `/ocenjivanje/pracenje-napredovanja-deteta/` |
| `Tekst 5/5 …` + 5.1, 5.2, 5.3, 5.4 | `/ocenjivanje/reagovanje-na-ocenu/` |

Struktura je preuzeta iz pet dijagrama (`*shema.pdf`), koji prikazuju isti redosled
i hijerarhiju kao i međusobni linkovi u dokumentima.

Dokumenti drugog nivoa postali su `##` sekcije na matičnoj stranici, a kratki
dokumenti trećeg nivoa (primeri, izvodi iz zakona) prikazani su kao `article-callout`
blokovi ili `article-details` (proširivi) blokovi.

## Uredničke napomene izostavljene sa stranica

Sledeće napomene bile su namenjene autorima, a ne čitaocima, pa nisu prenete:

1. **`Ocenjivanje UVODNI TEKST 1 fin.docx`** — „Instrukcija za Milovana: slika dole ne
   daje opciju da se linkuje direktno ka tekstovima, verujemo da ćeš već naći mogućnost
   kako to da se uradi.“
   → Rešeno: dijagram je zamenjen `nav.guide-map` blokom sa stvarnim linkovima ka svih
   pet tekstova.
2. **`Tekst 2/2.1 …docx`** — „(link vodi na Paragraf, da razmislimo da li želimo da ove
   dokumente uploadujemo na našu platformu i linkujemo ka tom izvoru)“
   → **Otvoreno pitanje.** Zasad svi linkovi ka propisima vode na `paragraf.rs`
   i `pravno-informacioni-sistem.rs`.
3. **`Tekst 3/3.1.1.a PRIMER loša ocena.docx`** — „(razmisliti o animaciji grafičkoj)“
   → Prikazano kao tekstualni `article-callout`. Grafika/animacija nije izrađena.
4. **`Tekst 3/3.2.2. SITUACIJA završni ispit.docx`** — „dodati link ka kalkulatoru“
   → **Otvoreno pitanje.** Kalkulator bodova za upis ne postoji; link nije dodat.

## Nerazrešeni linkovi u izvornim dokumentima

1. **Duplirani Google Docs ID.** `1K5WuyTT85BW9R-QpntxZUdkZ0YIhiY4p` koristi se i za
   „Otvorena vrata“ (Tekst 4) i za „Priprema za razgovor / Situacija 1“ (Tekst 5).
   Reč je o grešci u izvornim dokumentima; ciljevi su razrešeni prema kontekstu.
2. **Lokalna putanja.** `Tekst 3/3.3.4 …docx` linkuje na
   `file:///Users/tanja/Library/.../Tekst 2.docx` — putanja ka lokalno preuzetom fajlu.
   Zamenjeno internim linkom ka stranici Teksta 2.
3. **Tekst o Savetu roditelja.** `Tekst 5/5.3. Situacija 2.docx` i
   `Tekst 4/4.2 …docx` upućuju na „tekst o učešću roditelja u obrazovanju“ / „ovo je
   link ka novoj temi koju ćemo da spremimo u budućnosti“.
   → Taj tekst **ne postoji** među izvornim materijalima. Rečenice su zadržane, ali bez
   linka.
4. **Karijerno informisanje i savetovanje.** `Tekst 3/3.2 …docx` pominje „link — karijerno
   informisanje i savetovanje“ i „kako izabrati srednju školu/fakultet“.
   → Ne postoji među izvornim materijalima; upućeno na `/savetovanje/`.

## Slike

Svih 7 slika ugrađenih u `.docx` fajlove su prozirni PNG-ovi dimenzija 1×1 piksel
(razmaknice), dakle bez stvarnog sadržaja. Naslovne slike stranica preuzete su iz
postojeće biblioteke `assets/img/*.webp`.

## Numerički podaci preuzeti iz izvora

- Izveštaj o budućnosti radnih mesta (Svetski ekonomski forum, 2023): 89 miliona ukinutih
  i 69 miliona novih radnih mesta u periodu 2023–2027.
- Predviđanje da će do 2050. godine 85% poslova biti nove profesije — fusnota u izvoru
  navodi „Sofi Din, Bright Little Labs, Warner Bros Discovery“ kao izvor.
- Prosečno postignuće na završnom ispitu iz srpskog jezika 2023/24: 11,57 od 20 poena.

Ovi podaci nisu nezavisno provereni — preneti su onako kako stoje u izvornim dokumentima.
