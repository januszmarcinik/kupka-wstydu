# T-001 Wydanie read-only na GitHub Pages

**Status:** czeka na Ciebie

## Cel
Opublikować `web/index.html` jako publiczną, pustą stronę. Każdy użytkownik wczytuje własny eksport z HLTB, a dane zostają w jego przeglądarce.

## Zrobione
- `web/index.html`: aplikacja bez danych osobistych, z ekranem startowym „Wczytaj swoje gry z HLTB”.
- `.github/workflows/pages.yml`: check i deploy po pushu na `main` (zmiany w `web/`, `scripts/`, `tests/`).
- `scripts/check-web.mjs` + `tests/fixtures/hltb-sample.csv`: test importu na fikcyjnych danych.

## Do zrobienia przez Ciebie
1. Upewnić się, że repo `januszmarcinik/kupka-wstydu` jest publiczne (darmowe GitHub Pages wymaga publicznego repo).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Zatwierdzić push na `main`. Workflow wdroży stronę pod `https://januszmarcinik.github.io/kupka-wstydu/`.

## Kryteria akceptacji
- Workflow „Deploy to GitHub Pages” przechodzi.
- Strona otwiera się na telefonie, a import pliku z HLTB pokazuje podgląd i wczytuje gry.
- W historii gita nie ma `hltb/` ani danych z eksportu.
