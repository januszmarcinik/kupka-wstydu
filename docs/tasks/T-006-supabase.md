# T-006 Backend Supabase: logowanie i synchronizacja

**Status:** odłożone (wydanie read-only działa bez backendu)

## Po co
Dane między telefonem a komputerem, kopia w chmurze i miejsce na sekrety IGDB (Edge Functions). Dziś dane są tylko w `localStorage` jednej przeglądarki.

## Ustalony projekt
- **Hosting front-endu** bez zmian: GitHub Pages (statyczne pliki). Docelowo można przejść na Vite + React + TypeScript jako PWA, jeśli aplikacja urośnie.
- **Supabase (darmowy plan)**: Auth + Postgres + Edge Functions. Region Frankfurt (eu-central-1).
  - Limity planu (stan wiedzy z 2026, sprawdzić przed startem): 500 MB bazy, 50 tys. aktywnych użytkowników miesięcznie, 5 GB transferu, 500 tys. wywołań funkcji. Projekt bez ruchu przez 7 dni jest usypiany (rozwiązanie: cotygodniowy ping z GitHub Actions).
- **Logowanie**: magic link na e-mail (później opcjonalnie Google). **Rejestracja wyłączona**, konto ma tylko właściciel.
- **Bezpieczeństwo**: każda tabela ma `user_id` i politykę RLS `user_id = auth.uid()`. W przeglądarce jest tylko URL projektu i klucz anon/publishable (publiczne z założenia). `service_role` i sekret Twitch trzymamy tylko w Supabase Secrets, nigdy w repo ani w czacie.
- **Model danych**:
  - `games`: wspólny katalog z własnym uuid, `igdb_id`, `hltb_id`, czasami przejścia i `ttb_source`,
  - `user_games`: status, godziny, Twoje czasy, daty, ocena, notatki, flagi `want_return`, `want_max`, `excluded`, cel, `history`,
  - `tournaments`: stan i wyniki,
  - `hltb_sync`: lista „Do HLTB”.
- Migracje SQL w `supabase/migrations/`, funkcje w `supabase/functions/`.

## Co będzie potrzebne od właściciela
- Konto Supabase i projekt. URL i klucz anon można podać w czacie.
- Jednorazowe `npx supabase login` u siebie, żeby Claude mógł puszczać migracje.
- Do IGDB: konto na dev.twitch.tv z 2FA, aplikacja, Client ID i Secret wpisane samodzielnie w Supabase Secrets.
- Decyzja: czy import ma dalej resetować dane, czy wracamy do scalania (T-007).
