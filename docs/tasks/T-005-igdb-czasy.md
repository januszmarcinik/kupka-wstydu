# T-005 Czasy przejścia z IGDB

**Status:** odłożone

## Cel
Uzupełniać średnie czasy przejścia (Fabuła / + Poboczne / 100%), których eksport z HLTB nie zawiera. Eksport ma tylko Twoje własne czasy.

## Ustalenia
- Źródło: endpoint IGDB `game_time_to_beats` (pola `hastily`, `normally`, `completely`, w sekundach). Mapowanie: hastily → Fabuła, normally → + Poboczne, completely → 100%.
- Kiedy pobierać: przy dodaniu gry (T-004) i przyciskiem „Uzupełnij z IGDB” dla gier bez czasów (dopasowanie po tytule i platformie, a przy niepewności pytanie do użytkownika).
- Ręczna edycja ustawia `ttbSource = 'manual'`, a takich wartości IGDB nie nadpisuje.
- IGDB ma mniejsze pokrycie niż HLTB, więc starsze i niszowe gry mogą zostać bez czasów.
- IGDB jest tylko do odczytu: nie da się zapisywać tam statusów ani list.

## Warunki
Wymaga serwera z sekretem Twitch (T-006 albo proxy), tak samo jak T-004.
