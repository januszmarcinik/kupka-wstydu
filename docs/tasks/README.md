# Zadania

Status: `zrobione` · `w toku` · `czeka na Ciebie` · `odłożone` · `pomysł`. Po każdej zmianie aktualizuj tę tabelę i plik zadania.

| ID | Zadanie | Status | Plik |
|---|---|---|---|
| T-001 | Wydanie read-only na GitHub Pages | czeka na Ciebie | [T-001](T-001-github-pages.md) |
| T-002 | Import = reset danych (HLTB jako jedyne źródło prawdy) | zrobione | [SPEC](../SPEC.md#import-z-hltb-reset) |
| T-003 | „Co zagrać?” bez klasyfikacji pokazuje uczestników jak listę | zrobione | [SPEC](../SPEC.md#co-zagrać-turniej) |
| T-004 | Dodawanie gry z wyszukiwarką IGDB („+ Do kolejki”) | odłożone | [T-004](T-004-igdb-dodawanie-gry.md) |
| T-005 | Czasy przejścia z IGDB (time to beat) | odłożone | [T-005](T-005-igdb-czasy.md) |
| T-006 | Backend Supabase: logowanie i synchronizacja między urządzeniami | odłożone | [T-006](T-006-supabase.md) |
| T-007 | Import scalający z ekranem konfliktów | odłożone | [T-007](T-007-import-scalajacy.md) |
| T-008 | Kopia zapasowa: eksport i import stanu aplikacji (JSON) | pomysł | niżej |
| T-009 | Zakładka-skrypt (bookmarklet) „czasy z otwartej strony HLTB” | pomysł | niżej |
| T-010 | Nazwa: Kupka Wstydu (zrobione) · własna domena | czeka na Ciebie | niżej |
| T-011 | Przeniesienie do osobnego repo `kupka-wstydu` (stary projekt .NET zostaje w `games-library`) | zrobione | niżej |
| T-012 | Przegląd dopasowania nazw platform i trofeów (PS Vita, Xbox, Switch 2) | pomysł | niżej |
| T-013 | Turniej: system szwajcarski + puchar z lucky loserem, klasyfikacja generalna (naprawia skaczący licznik i nierówne pojedynki) | zrobione | [SPEC](../SPEC.md#co-zagrać-turniej) |

## Krótkie zadania

**T-008 Kopia zapasowa.** Przycisk „Pobierz kopię” w Statystykach (na GitHub Pages pobieranie plików działa normalnie, w przeciwieństwie do artefaktu Claude). Plik JSON ze stanem (`localStorage`) i „Wczytaj kopię”. Przydatne, bo import resetuje cele i turnieje.

**T-009 Bookmarklet.** Na stronie gry w HLTB, otwartej ręcznie przez użytkownika, zakładka odczytuje trzy czasy z widocznej strony i przekazuje je do aplikacji (np. przez schowek). Bez dodatkowych zapytań do HLTB. Działa głównie na komputerze.

**T-010 Nazwa i domena.** Nazwa wybrana 24.10.2026: „Kupka Wstydu”. Zostaje opcjonalna własna domena: plik `web/CNAME` plus rekord DNS u rejestratora.

**T-011 Osobne repo.** 24.10.2026 aplikacja przeniesiona z `games-library` do `kupka-wstydu`. Stary projekt Blazor/.NET został w `games-library` i nie jest tu potrzebny.

**T-012 Platformy.** `family()` w `web/index.html` decyduje, co jest calakiem, platyną i 100% Nintendo. Do sprawdzenia na pełnej liście platform z eksportu.
