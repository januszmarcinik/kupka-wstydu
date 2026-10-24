# T-007 Import scalający z ekranem konfliktów

**Status:** odłożone (zastąpione importem-resetem, T-002)

## Jak działało
- Gry dopasowywane po znormalizowanym tytule i platformie (eksport HLTB nie ma ID gier).
- Nowe gry były dodawane, a puste pola u użytkownika uzupełniane z pliku.
- Różne wartości (status, godziny, Twoje czasy, daty, powód porzucenia, ocena) dawały konflikt: ekran „U mnie / W HLTB” z wyborem per pole, per gra albo zbiorczo.
- Pola tylko aplikacji (cele, flagi, wyniki turnieju, notatki) zostawały nietknięte. Gry spoza pliku nie były usuwane.

## Kod do przywrócenia
[`archive/import-merge.js`](archive/import-merge.js): `FIELDS`, `buildImport`, `showImport`. Po przywróceniu w obsłudze `#file` trzeba wywoływać `showImport(buildImport(text))` zamiast `showImport(parseExport(text), name)`. Mapowanie statusów (`statusFrom`) i pola z eksportu są wspólne z obecnym `parseExport`, więc przy przywracaniu trzeba je zsynchronizować.

## Kiedy wrócić
Gdy aplikacja przestanie być tylko nakładką, np. przy dodawaniu gier z IGDB (T-004) albo przy backendzie (T-006), czyli wtedy, gdy w aplikacji będą dane, których nie ma w HLTB.
