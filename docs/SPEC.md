# Specyfikacja: Kupka Wstydu (wydanie read-only)

## Problem
Wybór następnej gry odbywał się na papierowych kartkach na stole, bez informacji o czasie przejścia, statusie i przegranych godzinach. HLTB ma te dane, ale nie ma API, a jego strona jest niewygodna na telefonie.

## Kierunek (decyzja z 24.10.2026)
Nakładka na HLTB: **HLTB jest jedynym źródłem prawdy**. Aplikacja wczytuje eksport CSV z HLTB i daje wygodny widok na telefonie oraz narzędzie do wyboru gry. Bez backendu i bez zewnętrznych API. Kod backendu (Supabase), IGDB i import scalający są odłożone jako zadania (zob. `docs/tasks/`).

## Funkcje
### Import z HLTB (reset)
- Przycisk „Import HLTB” albo ekran startowy. Plik CSV jest parsowany w przeglądarce.
- Podgląd przed wczytaniem: liczba gier wg statusu, pominięte gry. Zatwierdzenie zastępuje **wszystkie** dane: gry, cele czasowe, turnieje i listę „Do HLTB”.
- Mapowanie flag HLTB na status:
  - Playing → Gram (ma pierwszeństwo przed wszystkim),
  - Maxed → Wymaksowane,
  - Completed → Ukończone, a jeśli gra jest też w Backlog/Replay: „Chcę wymaksować”,
  - Retired → Porzucone, a jeśli gra jest też w Backlog/Replay: „Chcę wrócić”,
  - Backlog/Replay → W kolejce,
  - tylko Owned albo tylko Wishlist → pomijane.
- Pola: Title, Platform, Progress (godziny; gdy brak, to Completionist → Main + Sides → Main Story), Main Story / Main + Sides / Completionist (Twoje czasy), Start Date, Completion Date, Retired Notes, Review (0 = brak, 80 → 8/10), General Notes.
- Duplikaty tytuł + platforma są łączone w jedną pozycję.

### Lista gier
- Filtry: Gram (domyślny), Co zagrać?, W kolejce, Porzucone, Ukończone, Wymaksowane, Wszystkie. Każdy filtr pokazuje liczbę gier.
- Wyszukiwarka po tytule działa we wszystkich statusach naraz.
- Karta gry: okładka zastępcza (stuknięcie otwiera edycję), status, platforma (lista rozwijana), preorder z datą premiery, trzy czasy przejścia (Fabuła / + Poboczne / 100%) z Twoimi czasami. Stuknięcie w czas ustawia go jako cel, a pasek procentowy pokazuje postęp do celu (ukryty dla wymaksowanych).
- Zmiany statusu z potwierdzeniem: przy ukończeniu i wymaksowaniu wpisujesz czas gry, datę i ocenę 1–10, przy porzuceniu czas, powód i „Chcę wrócić”. Każdą zmianę można cofnąć („↶ Cofnij”), także wielokrotnie.
- Edycja gry: status, platforma, premiera, czasy przejścia, Twoje czasy, łączny czas, ocena, flagi, link/ID z HLTB, notatka.

### Co zagrać? (turniej)
- Pula: W kolejce (bez preorderów i bez „Nie chcę grać”), Porzucone z „Chcę wrócić”, Ukończone z „Chcę wymaksować”. Przed pierwszym turniejem zakładka pokazuje uczestników jak zwykłą listę.
- **Kwalifikacje (system szwajcarski)**: R = ceil(log2 N), ograniczone do 3–6 i najwyżej N−1 (18–32 gry dają 5 rund). W każdej rundzie każda gra gra jeden pojedynek z grą o podobnym wyniku (punkty, potem Buchholz), bez rewanżów, jeśli to możliwe. Przy nieparzystej liczbie gier wolny los (+1 pkt) dostaje najsłabsza gra, która go jeszcze nie miała.
- **Puchar**: N ≥ 12 → ósemka (1–8, 4–5, 2–7, 3–6), 6–11 → czwórka, 4–5 → finał. Przy 2–3 grach są tylko kwalifikacje. Pary układają się same. **Lucky loser**: po ćwierćfinałach przegrany z największą liczbą punktów gra baraż z najsłabszym zwycięzcą ćwierćfinałów o miejsce w półfinale.
- Każda wygrana (także walkower i wolny los) = 1 pkt. Punkty przechodzą przez cały turniej.
- **Klasyfikacja generalna** (na żywo pod pojedynkiem i na koniec): miejsca 1…N, czyli Mistrz, Finał, Półfinał, Ćwierćfinał, potem Kwalifikacje. W obrębie etapu kolejność wg punktów i Buchholza. Pokazuje też bilans W–P.
- Licznik: „Pojedynek x · zostało maks. y” z paskiem postępu. Wartość „zostało” nigdy nie rośnie. Przy 18 grach turniej ma 53 pojedynki.
- „Nie chcę w to grać” (z potwierdzeniem): gra wypada i nie jest klasyfikowana, a jej rywal wygrywa walkowerem, więc liczba pojedynków w kwalifikacjach zostaje równa.
- Można przerwać i wznowić albo „Zakończyć teraz” z klasyfikacją z bieżącego stanu. Zwycięzca: „Gram w to” albo „Gramy od nowa”. Miejsce z ostatniego turnieju sortuje kolejkę.
- Silnik turnieju (`newTour`, `currentDuel`, `applyWin`, `excludeGame`, `remaining`, `finalRanking`) nie dotyka DOM i jest testowany symulacją w `scripts/check-web.mjs`.

### Do HLTB
- Każda zmiana w aplikacji (status, godziny, Twoje czasy, daty, ocena, powód porzucenia, platforma) tworzy zadanie w nazewnictwie HLTB, z wartością „było”.
- Zadania odhacza się pojedynczo albo całą grę naraz. Powrót do pierwotnej wartości kasuje zadanie sam.
- Import nowego pliku czyści listę.

### Statystyki
- Kafelki wg statusu (prowadzą do filtrów listy).
- Wymaksowane: Calaki (Xbox 360 i nowsze), Platyny (PS3/PS4/PS5/Vita), 100% (Nintendo).
- Ukończone wg roku.
- Dane: informacja o ostatnim imporcie i „Wyczyść wszystkie dane”.

## Prywatność
Dane są tylko w `localStorage` przeglądarki, na której zrobiono import. Strona na GitHub Pages jest publiczna, ale pusta: każdy widzi tylko gry, które sam wczyta. Strona ma `noindex`.

## Poza zakresem tego wydania
Logowanie i synchronizacja między urządzeniami, wyszukiwarka IGDB i dodawanie gier, automatyczne czasy przejścia, integracje z PSN/Xbox/Steam/Exophase, poradniki do trofeów, monetyzacja.
