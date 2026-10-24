# Kupka Wstydu

Prywatna nakładka na HowLongToBeat (HLTB): mobilny widok własnej biblioteki gier, wybór następnej gry (turniej „Co zagrać?”) i lista zmian do ręcznego przeklikania w HLTB. Aktualne wydanie jest **tylko statyczne**, bez backendu, i działa na GitHub Pages.

## Struktura
- `web/index.html`: cała aplikacja w jednym pliku (HTML + CSS + vanilla JS). To jest to, co publikujemy.
- `scripts/check-web.mjs`: sprawdzenie składni i test importu na `tests/fixtures/hltb-sample.csv` (fikcyjne dane).
- `.github/workflows/pages.yml`: po pushu na `main` uruchamia check i publikuje `web/` na GitHub Pages.
- `docs/SPEC.md`: specyfikacja produktu i podjęte decyzje.
- `docs/tasks/`: zadania (status w `docs/tasks/README.md`) i archiwum usuniętego kodu do przywrócenia.

## Zasady
- **`hltb/` (prywatny eksport z HLTB) nigdy nie trafia do repo.** Jest w `.gitignore`. Przed commitem sprawdź `git status`. W repo i w `web/` nie umieszczamy danych użytkownika, tylko fikcyjne fixtures.
- **Zero scrapowania i automatycznych zapytań do HLTB, PSN, Xbox i Exophase.** HLTB łączymy tylko przez import eksportu CSV albo wklejony link/ID.
- Interfejs po polsku. Słownictwo statusów: W kolejce, Gram, Porzucone, Ukończone, Wymaksowane. Trofea: Calaki (Xbox), Platyny (PS), 100% (Nintendo).
- Import = reset: nowy plik z HLTB zastępuje wszystkie dane w aplikacji (HLTB jest jedynym źródłem prawdy).
- Mobile first. Jeden ciemny motyw (granat, niebieski i cyjan). Kolory tylko przez zmienne CSS z `:root`.
- Dane aplikacji są tylko w `localStorage` przeglądarki (klucz `kupka-wstydu-v1`). Na iPhonie Safari może skasować dane strony po 7 dniach bez wizyt, chyba że strona jest dodana do ekranu głównego.

## Komendy
- Sprawdzenie: `node scripts/check-web.mjs`. Hook w `.claude/settings.json` uruchamia je po każdej edycji.
- Podgląd lokalny: otwórz `web/index.html` w przeglądarce albo `npx serve web`.
- Deploy: push na `main`. Wymaga publicznego repo i Settings → Pages → Source: GitHub Actions.

## Praca z zadaniami
Zanim zaczniesz, przeczytaj `docs/tasks/README.md`. Po skończeniu zadania zaktualizuj jego status w tabeli i w pliku zadania. Kod usunięty z aplikacji, który może wrócić, odkładaj do `docs/tasks/archive/` i podlinkuj go z pliku zadania.
