# Kupka Wstydu

Mobilna nakładka na HowLongToBeat: wczytujesz eksport CSV ze swojego konta HLTB i dostajesz wygodną listę gier, turniej „Co zagrać?” (każdy z każdym), statystyki (calaki, platyny, 100%) i listę zmian do przeklikania w HLTB.

- Strona: https://januszmarcinik.github.io/kupka-wstydu/
- Dane zostają tylko w Twojej przeglądarce, nic nie jest wysyłane na serwer. Każdy import zastępuje wszystkie dane, bo HLTB jest jedynym źródłem prawdy.
- Na iPhonie dodaj stronę do ekranu początkowego (Udostępnij → Do ekranu początkowego), żeby Safari nie kasowało danych po 7 dniach bez wizyt.

## Rozwój
- Cała aplikacja: `web/index.html`.
- Sprawdzenie: `node scripts/check-web.mjs` (składnia i test importu na fikcyjnych danych).
- Deploy: push na `main`, a GitHub Actions publikuje `web/` na GitHub Pages.
- Specyfikacja: [docs/SPEC.md](docs/SPEC.md). Zadania: [docs/tasks/README.md](docs/tasks/README.md).
