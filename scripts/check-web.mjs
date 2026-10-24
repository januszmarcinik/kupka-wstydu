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
const el = new Proxy({}, { get: (t, k) => (k in t ? t[k] : k === 'dataset' ? (t.dataset = {}) : k === 'querySelectorAll' ? () => [] : typeof k === 'string' && /^(set|add|remove|focus|click|append)/.test(k) ? () => {} : k === 'querySelector' ? () => null : undefined), set: (t, k, v) => ((t[k] = v), true) });
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

// --- turniej: system szwajcarski + puchar (symulacja z losowymi zwycięzcami) ---
vm.runInContext(`globalThis.__sim=(n,excludeAt)=>{const ids=[...Array(n)].map((_,i)=>'t'+i),T=newTour(ids);let prev=Infinity,steps=0,clicks=0;
  for(;;){const p=currentDuel(T);if(!p)break;const r=remaining(T);if(r>prev)throw new Error('licznik wzrósł '+prev+' -> '+r);prev=r;
    if(steps===excludeAt)excludeGame(T,p[0]);else{applyWin(T,p[Math.random()<.5?0:1]);clicks++}
    if(++steps>5000)throw new Error('pętla')}
  return{T,rows:finalRanking(T),rem:remaining(T),clicks,R:tourRounds(n),est:estDuels(n)}}`, ctx);
const sim = (...a) => { try { return ctx.__sim(...a); } catch (e) { fail(`turniej: ${e.message}`); } };
for (const n of [2, 3, 5, 7, 12, 18, 33]) for (let run = 0; run < 5; run++) {
  const { T, rows, rem, clicks, R, est } = sim(n);
  const tag = `turniej n=${n}:`;
  expect(T.phase === 'done' && rem === 0, `${tag} nie dobiegł końca`);
  expect(clicks === est, `${tag} pojedynków ${clicks}, a zapowiedziane ${est}`);
  expect(rows.length === n && rows.every((r, i) => r.place === i + 1), `${tag} miejsca nie są 1..${n}`);
  const quali = rows.filter(r => r.stage === 'Kwalifikacje');
  expect(quali.every(r => r.w + r.l === R), `${tag} gry odpadające w kwalifikacjach mają różną liczbę pojedynków`);
  const cnt = st => rows.filter(r => r.stage === st).length;
  const k = n >= 12 ? 8 : n >= 6 ? 4 : n >= 4 ? 2 : 0;
  if (k) expect(rows[0].stage === 'Mistrz' && rows[1].stage === 'Finał', `${tag} 1. miejsce to nie mistrz albo 2. to nie finalista`);
  if (k === 8) expect(cnt('Ćwierćfinał') === 4 && cnt('Półfinał') === 2, `${tag} zły podział pucharu (ćwierćfinał/półfinał)`);
  if (k === 4) expect(cnt('Półfinał') === 2, `${tag} zły podział półfinałów`);
  if (n >= 18) expect(quali.every(r => new Set(T.opp[r.id]).size === T.opp[r.id].length), `${tag} rewanż w kwalifikacjach`);
}
{ const { T, rows, rem, R } = sim(18, 3);
  expect(rem === 0 && rows.length === 17 && !rows.some(r => T.out.includes(r.id)), 'turniej z wyrzuconą grą: zła klasyfikacja');
  expect(rows.filter(r => r.stage === 'Kwalifikacje').every(r => r.w + r.l === R), 'turniej z wyrzuconą grą: nierówna liczba pojedynków'); }

// --- „Do HLTB”: wyrzucenie z turnieju i przełączniki Backlog tworzą zadania ---
vm.runInContext(`state.games=[blank({id:"z1",title:"Z",platform:"PC",status:"backlog"}),blank({id:"z2",title:"Y",platform:"PC",status:"retired",wantReturn:true})];state.sync={};
  {const g=state.games[0],b=snap(g);g.excluded=true;track(g,b)}{const g=state.games[1],b=snap(g);g.wantReturn=false;track(g,b)}
  globalThis.__sync=state.sync;`, ctx);
expect(ctx.__sync.z1?.fields?.excluded?.to === true && ctx.__sync.z2?.fields?.wantReturn?.to === false, "Do HLTB: brak zadania po wyrzuceniu gry lub zmianie Chcę wrócić");
if (!hook) console.log('check-web: OK');
