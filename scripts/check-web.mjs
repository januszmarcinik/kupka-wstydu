// Sprawdza web/index.html: składnię skryptu i import eksportu HLTB na fikcyjnym pliku z tests/fixtures.
// Użycie: node scripts/check-web.mjs [--hook]   (z --hook błąd kończy się kodem 2, żeby hook Claude Code pokazał go modelowi)
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const hook = process.argv.includes('--hook');
const fail = msg => { console.error(`check-web: ${msg}`); process.exit(hook ? 2 : 1); };

if (!existsSync('web/index.html')) process.exit(0);
const html = readFileSync('web/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) fail('brak skryptu w web/index.html');
const code = scripts.join('\n;\n');
try { new vm.Script(code); } catch (e) { fail(`błąd składni: ${e.message}`); }

// Minimalne atrapy DOM, żeby skrypt dał się uruchomić poza przeglądarką.
const el = new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === 'querySelectorAll' ? () => [] : typeof k === 'string' && /^(set|add|remove|focus|click|append)/.test(k) ? () => {} : k === 'querySelector' ? () => null : undefined), set: (t, k, v) => ((t[k] = v), true) });
const ctx = vm.createContext({
  document: { querySelector: () => el, querySelectorAll: () => [], createElement: () => el, body: { append() {} } },
  localStorage: { getItem: () => null, setItem() {} },
  console, setTimeout, scrollTo() {}, __csv: readFileSync('tests/fixtures/hltb-sample.csv', 'utf8'),
});
try { vm.runInContext(code + '\n;globalThis.__res = parseExport(__csv);', ctx); } catch (e) { fail(`skrypt nie działa: ${e.message}`); }

const { games, skipped } = ctx.__res;
const by = t => games.find(g => g.title === t) || fail(`brak gry "${t}" po imporcie`);
const expect = (cond, msg) => cond || fail(msg);
expect(games.length === 6, `oczekiwano 6 gier, jest ${games.length}`);
expect(skipped === 2, `oczekiwano 2 pominiętych (Owned/Wishlist), jest ${skipped}`);
const maxed = by('Test Maxed');
expect(maxed.status === 'maxed' && maxed.rating === 9 && maxed.myMain === 10 && maxed.myExtra === 18 && maxed.my100 === 30 && maxed.hours === 30, 'Test Maxed: zły status/ocena/czasy');
const ret = by('Test Retired Return');
expect(ret.status === 'retired' && ret.wantReturn && ret.retiredNote === 'Za trudne' && ret.retiredDate === '2024-05-01', 'Test Retired Return: oczekiwano Porzucone + Chcę wrócić');
const cm = by('Test Completed Max');
expect(cm.status === 'completed' && cm.wantMax && cm.rating === 8, 'Test Completed Max: oczekiwano Ukończone + Chcę wymaksować');
const pl = by('Test Playing');
expect(pl.status === 'playing' && pl.hours === 12.5 && pl.startDate === '2025-10-12', 'Test Playing: oczekiwano Gram, 12.5 h');
expect(by('Test Backlog').status === 'backlog', 'Test Backlog: oczekiwano W kolejce');
const q = by('Test, with "comma"');
expect(q.notes.includes('\n') && q.completedDate === '2022-12-19', 'CSV: cudzysłowy, przecinki i wieloliniowe pola');

if (!hook) console.log('check-web: OK');
