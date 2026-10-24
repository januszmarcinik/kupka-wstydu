# T-004 Dodawanie gry z wyszukiwarką IGDB

**Status:** odłożone (usunięte z wydania read-only 24.10.2026)

## Jak działało w prototypie
- Przycisk „+ Dodaj grę” w nagłówku otwierał wyszukiwarkę. Wpisujesz tylko tytuł, wyniki pokazują się jako kafelki (rok, gatunek, trzy czasy, preorder).
- Na kafelku: wybór platformy (gdy gra wyszła na kilka) i przycisk **„+ Do kolejki”**. Gra trafia do bazy jako „W kolejce” z premierą, czasami i `igdbId`.
- Gra, która już jest w bibliotece, pokazuje „W bibliotece: <status>”.
- Awaryjnie: „Dodaj tylko z tytułem” z wyborem platformy.
- Dodana gra trafiała na listę „Do HLTB” z zadaniem „dodaj do HLTB na listę Backlog”.
- W edycji gry było pole „Link lub ID z IGDB” i link „Znajdź w IGDB”.

## Kod do przywrócenia
[`archive/add-game-igdb.js`](archive/add-game-igdb.js): `openAdd`, `drawRes`, `queueGame`, `igdbIdFrom`, `linkRow` i przykładowy katalog `IGDB` (28 gier, zastępstwo dla API). Na początku pliku są instrukcje, co jeszcze dopiąć w nagłówku i w edycji gry.

## Warunki przywrócenia
- Prawdziwe IGDB wymaga **Twitch Client ID + Client Secret**, które nie mogą trafić do przeglądarki. Potrzebny jest serwer, czyli Edge Function w Supabase (T-006) albo inny proxy, np. Cloudflare Worker.
- Zapytanie: `POST https://api.igdb.com/v4/games` z `fields name,first_release_date,platforms.name,genres.name,cover.image_id; search "<tytuł>"; limit 10;`.
- Okładki: `https://images.igdb.com/igdb/image/upload/t_cover_big/<image_id>.jpg`.
- IGDB do użytku komercyjnego wymaga umowy z Twitch/IGDB.
- Kłóci się z zasadą „HLTB jedynym źródłem prawdy”: gra dodana w aplikacji zniknie przy następnym imporcie (reset), jeśli nie dodasz jej też w HLTB. Przy przywracaniu trzeba zdecydować, czy wracamy do importu scalającego (T-007).
