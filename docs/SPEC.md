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
- Pula: W kolejce (bez preorderów i bez „Nie chcę grać”), Porzucone z „Chcę wrócić”, Ukończone z „Chcę wymaksować”.
- Przed pierwszym turniejem zakładka pokazuje uczestników jak zwykłą listę.
- Każdy z każdym: kolejki ligowe (metoda koła), 1 pkt za wygraną, klasyfikacja generalna na żywo pod pojedynkiem, licznik i pasek postępu.
- Można przerwać i wznowić, zakończyć wcześniej z aktualną tabelą albo wyrzucić grę z turnieju („Nie chcę w to grać”, z potwierdzeniem).
- Zwycięzca: „Gram w to” (przejście do Gram) albo „Gramy od nowa”. Wynik zapisuje się jako „Ostatnia klasyfikacja” i sortuje kolejkę.

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
