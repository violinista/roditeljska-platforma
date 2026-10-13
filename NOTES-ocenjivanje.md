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
| `Tekst 2/2 Fin Šta moje dete treba da zna.docx` + 2.1, 2.2, 2.3, 2.3.1, 2.3.1.a, 2.3.2, 2.3.3, 2.3.4 | `/ocenjivanje/sta-moje-dete-treba-da-zna/` i 8 podstranica (vidi ispod) |
| `Tekst 3/3.1 …` + 3.1.1, 3.1.1.a, 3.2, 3.2.1, 3.2.2, 3.3, 3.3.1, 3.3.2, 3.3.3, 3.3.4 | `/ocenjivanje/sta-znamo-o-ocenjivanju/` |
| `Tekst 4/4 …` + 4.1, 4.1.1, 4.2 | `/ocenjivanje/pracenje-napredovanja-deteta/` i 2 podstranice (vidi ispod) |
| `Tekst 5/5 …` + 5.1, 5.2, 5.3, 5.4 | `/ocenjivanje/reagovanje-na-ocenu/` i 4 podstranice (vidi ispod) |

Struktura je preuzeta iz pet dijagrama (`*shema.pdf`), koji prikazuju isti redosled
i hijerarhiju kao i međusobni linkovi u dokumentima.

Dokumenti drugog nivoa postali su `##` sekcije na matičnoj stranici, a kratki
dokumenti trećeg nivoa (primeri, izvodi iz zakona) prikazani su kao `article-callout`
blokovi ili `article-details` (proširivi) blokovi.

**Izuzetak — Tekst 2** je razdvojen na 9 stranica, po jedna za svaki dokument, povezane
tačno kao na `tekst 2 shema.pdf` (izvor: `ciljevi-obrazovanja-source/`). Tekst je prenet
doslovno, bez dodatih podnaslova; ispravljene su samo očigledne slovne greške.

| Dokument | Stranica (ispod `/ocenjivanje/sta-moje-dete-treba-da-zna/`) |
|---|---|
| 2 Fin | *(matična stranica)* |
| 2.1 | `obrazovne-politike/` |
| 2.2 | `vrednosti-i-principi/` |
| 2.3.1.a (linkovan iz 2.2, nije na shemi) | `vrednosti-i-principi/opsti-principi/` |
| 2.3 | `ciljevi-i-ishodi/` |
| 2.3.1 | `ciljevi-i-ishodi/zosov-ciljevi-i-ishodi/` |
| 2.3.2 | `ciljevi-i-ishodi/primer-srpski-jezik/` |
| 2.3.3 | `ciljevi-i-ishodi/primer-biologija/` |
| 2.3.4 | `ciljevi-i-ishodi/kompetencije/` |

**Izuzeci — Tekst 4 i Tekst 5** (ažurirani izvori od 12. 10.) takođe su grupe stranica,
po jedna stranica za svaki dokument, prema `tekst 4 shema.pdf` i `Tekst 5 shema.pdf`.
Tekst je prenet doslovno; ispravljene su samo očigledne slovne greške.

| Dokument | Stranica |
|---|---|
| 4 | `/ocenjivanje/pracenje-napredovanja-deteta/` (u bočnom sadržaju: „Kako da pratim napredovanje deteta“) |
| 4.1 + 4.1.1 | `…/esdnevnik/` („ES dnevnik“); tabela iz 4.1.1 je proširivi blok „EsDnevnik detaljno“ |
| 4.2 | `…/otvorena-vrata/` („Otvorena vrata“) |
| 5 | `/ocenjivanje/reagovanje-na-ocenu/` — jedina stavka u bočnom sadržaju (`sidebarDepth: 0`) |
| 5.1 | `…/priprema-za-razgovor/` |
| 5.2 / 5.3 / 5.4 | `…/zalba-na-pojedinacnu-ocenu/`, `…/zajednicka-primedba-roditelja/`, `…/zalba-na-zakljucnu-ocenu/` |

Oznake za „Pročitaj više“ u ovim izvorima razlikuju se od Teksta 2: **plavo osenčen
naslov ostaje vidljiv**, a tekst posle njega (do sledećeg naslova) otvara se klikom
(komentari: „Tekst se nakon ovog plavog dela ne vidi…“, „U tekstu se vidi samo plavi
deo, a deo posle tri tačke se otvara…“). Isto važi za zeleno označene „…“ (4.2
„Ograničenja ili izazovi…“ nema komentar, ali ima zelene tri tačke; 5.1 dve liste).

Grafike iz okvira za tekst (text box) u 4.1, 4.2 i 5 prenete su kao liste, odnosno
tabela („Stereotipi roditelja i nastavnika“).

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
   → Taj tekst **ne postoji** među izvornim materijalima. Po komentarima u ažuriranim
   izvorima („za sada bez ove rečenice“) te rečenice su **izostavljene** (4.2, 5.3), kao i
   crveni deo u dokumentu 4 („više o uključivanju roditelja… na ovom linku“).
4. **Karijerno informisanje i savetovanje.** `Tekst 3/3.2 …docx` pominje „link — karijerno
   informisanje i savetovanje“ i „kako izabrati srednju školu/fakultet“.
   → Ne postoji među izvornim materijalima; upućeno na `/savetovanje/`.
5. **Virtuelna tura kroz EsDnevnik** (4.1, shema: „Virtuelna tura“) — video još ne postoji.
   Na stranici `…/esdnevnik/` stoji prazan okvir `.video-embed` u koji treba ubaciti
   YouTube `<iframe>` (uputstvo je u HTML komentaru iznad okvira).
6. **Žuto označene rečenice u 5.1** („Naši saradnici vam stoje na raspolaganju…“)
   prikazane su kao istaknuti blokovi sa linkom ka `/savetovanje/`.

## Slike

Svih 7 slika ugrađenih u `.docx` fajlove su prozirni PNG-ovi dimenzija 1×1 piksel
(razmaknice), dakle bez stvarnog sadržaja. Naslovne slike stranica preuzete su iz
postojeće biblioteke `assets/img/*.webp`.

## Numerički podaci preuzeti iz izvora

- Izveštaj o budućnosti radnih mesta (Svetski ekonomski forum, 2025): 92 miliona ukinutih
  i 170 miliona novih radnih mesta u periodu 2025–2030 (ažurirano prema „tekst 2 - updated“).
- Predviđanje da će do 2050. godine 85% poslova biti nove profesije — fusnota u izvoru
  navodi „Sofi Din, Bright Little Labs, Warner Bros Discovery“ kao izvor.
- Prosečno postignuće na završnom ispitu iz srpskog jezika 2023/24: 11,57 od 20 poena.

Ovi podaci nisu nezavisno provereni — preneti su onako kako stoje u izvornim dokumentima.
