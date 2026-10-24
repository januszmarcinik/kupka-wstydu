// ARCHIWUM — kod usunięty z web/index.html, do przywrócenia w ramach zadania. Zobacz plik zadania w docs/tasks/.
// Dodatkowo przy przywracaniu:
//  - w nagłówku: <button class="btn primary sm" id="addBtn">+ Dodaj grę</button> obok przycisku importu,
//  - w arkuszu edycji gry: pole "Link lub ID z IGDB" (id="fIgdb") + linkRow(g.title), a przy zapisie g.igdbId=igdbIdFrom($("#fIgdb").value),
//  - queueGame dopisuje zadanie "add" do listy "Do HLTB" (HLF.add w sekcji listy).
// ---------- dodawanie gry ----------
// Prototyp: przeszukuje mały przykładowy katalog w miejsce IGDB. W docelowej aplikacji te same karty wypełni wyszukiwarka IGDB (Edge Function).
const hltbIdFrom=v=>{v=(v||'').trim();const m=v.match(/game\/(\d+)/);return m?m[1]:/^\d+$/.test(v)?v:''};
const igdbIdFrom=v=>{v=(v||'').trim();const m=v.match(/igdb\.com\/games\/([\w-]+)/);return m?m[1]:/^[\w-]+$/.test(v)?v:''};
const linkRow=t=>`<div class="row small"><a href="https://www.igdb.com/search?q=${encodeURIComponent(t)}" target="_blank" rel="noopener">Znajdź w IGDB ↗</a></div>`;
const PS5='PlayStation 5',PS4='PlayStation 4',XSX='Xbox Series X/S',XB1='Xbox One',NS='Nintendo Switch',NS2='Nintendo Switch 2',PC='PC';
const IGDB=[ // [slug, tytuł, platformy, premiera, gatunek, fabuła, +poboczne, 100%]
 ['clair-obscur-expedition-33','Clair Obscur: Expedition 33',[PS5,XSX,PC],'2025-04-24','RPG',30,45,63],
 ['silent-hill-f','Silent Hill f',[PS5,XSX,PC],'2025-09-25','Survival horror',12,16,30],
 ['hollow-knight-silksong','Hollow Knight: Silksong',[NS2,NS,PS5,PS4,XSX,XB1,PC],'2025-09-04','Metroidvania',28,40,55],
 ['ghost-of-yotei','Ghost of Yōtei',[PS5],'2025-10-02','Akcja',25,40,55],
 ['death-stranding-2-on-the-beach','Death Stranding 2: On the Beach',[PS5],'2025-06-26','Akcja',40,60,100],
 ['split-fiction','Split Fiction',[PS5,XSX,PC,NS2],'2025-03-06','Przygodowa co-op',14,16,18],
 ['kingdom-come-deliverance-ii','Kingdom Come: Deliverance II',[PS5,XSX,PC],'2025-02-04','RPG',50,90,140],
 ['doom-the-dark-ages','Doom: The Dark Ages',[PS5,XSX,PC],'2025-05-15','Strzelanka FPP',13,17,25],
 ['mafia-the-old-country','Mafia: The Old Country',[PS5,XSX,PC],'2025-08-08','Akcja',12,14,20],
 ['indiana-jones-and-the-great-circle','Indiana Jones and the Great Circle',[XSX,PS5,PC],'2024-12-09','Przygodowa akcja',15,26,40],
 ['metal-gear-solid-delta-snake-eater','Metal Gear Solid Delta: Snake Eater',[PS5,XSX,PC],'2025-08-28','Skradanka',14,18,40],
 ['elden-ring-nightreign','Elden Ring Nightreign',[PS5,PS4,XSX,XB1,PC],'2025-05-30','Akcja RPG',20,40,70],
 ['resident-evil-requiem','Resident Evil Requiem',[PS5,XSX,PC,NS2],'2026-02-27','Survival horror',10,13,25],
 ['grand-theft-auto-vi','Grand Theft Auto VI',[PS5,XSX],'2026-11-19','Akcja, otwarty świat','','',''],
 ['astro-bot','Astro Bot',[PS5],'2024-09-06','Platformówka',11,14,18],
 ['black-myth-wukong','Black Myth: Wukong',[PS5,PC,XSX],'2024-08-20','Akcja RPG',38,50,62],
 ['elden-ring','Elden Ring',[PS5,PS4,XSX,XB1,PC],'2022-02-25','Akcja RPG',58,100,133],
 ['baldurs-gate-3','Baldur\'s Gate 3',[PC,PS5,XSX],'2023-08-03','RPG',75,115,150],
 ['alan-wake-2','Alan Wake 2',[PS5,XSX,PC],'2023-10-27','Survival horror',18,22,30],
 ['silent-hill-2--1','Silent Hill 2',[PS5,PC],'2024-10-08','Survival horror',16,19,36],
 ['final-fantasy-vii-rebirth','Final Fantasy VII Rebirth',[PS5,PC],'2024-02-29','RPG',45,80,140],
 ['the-legend-of-zelda-tears-of-the-kingdom','The Legend of Zelda: Tears of the Kingdom',[NS,NS2],'2023-05-12','Przygodowa akcja',60,110,180],
 ['donkey-kong-bananza','Donkey Kong Bananza',[NS2],'2025-07-17','Platformówka',18,28,45],
 ['mario-kart-world','Mario Kart World',[NS2],'2025-06-05','Wyścigi',8,20,60],
 ['forza-horizon-5','Forza Horizon 5',[XSX,XB1,PC,PS5],'2021-11-09','Wyścigi',15,43,140],
 ['starfield','Starfield',[XSX,PC,PS5],'2023-09-06','RPG',22,41,140],
 ['the-last-of-us-part-ii-remastered','The Last of Us Part II Remastered',[PS5,PC],'2024-01-19','Przygodowa akcja',24,30,40],
 ['ghost-of-tsushima','Ghost of Tsushima',[PS4,PS5,PC],'2020-07-17','Akcja',25,40,63]
].map(([igdbId,title,platforms,releaseDate,genre,ttbMain,ttbExtra,ttb100])=>({igdbId,title,platforms,releaseDate,genre,ttbMain,ttbExtra,ttb100}));

let addQ='';
function openAdd(){
  openModal(`<h2>Dodaj grę</h2>
   <label class="f">Szukaj w IGDB<input id="aQ" type="search" autocomplete="off" placeholder="Wpisz tytuł, np. Silksong" value="${esc(addQ)}"></label>
   <div id="aRes" class="list"></div>
   <div class="actions"><button class="btn ghost" data-close>Zamknij</button></div>`);
  const q=$('#aQ');q.focus();q.oninput=()=>{addQ=q.value;drawRes()};drawRes();
}
function inLib(title,platform){return state.games.find(g=>keyOf(g)===keyOf({title,platform}))}
function drawRes(){
  const q=norm(addQ),box=$('#aRes');if(!box)return;
  if(q.length<2){box.innerHTML='<p class="small">Wpisz co najmniej 2 litery. Dane gry (premiera, czasy przejścia, platformy) uzupełnią się same.</p>';return}
  const res=IGDB.filter(x=>norm(x.title).includes(q)).slice(0,10);
  box.innerHTML=(res.length?res.map((x,i)=>{const pre=x.releaseDate>today(),plat=x.platforms.find(p=>!inLib(x.title,p))||x.platforms[0],had=inLib(x.title,plat);
    return `<div class="card"><div class="cover" style="${art(x)}">${esc(initials(x))}</div><div class="info">
     <span class="title">${esc(x.title)}</span>
     <div class="row"><span class="small">${x.releaseDate.slice(0,4)} · ${esc(x.genre)}</span>${pre?`<span class="pill pre">Preorder · ${pl(x.releaseDate)}</span>`:''}</div>
     <div class="meta"><span>Fabuła ${fmtH(x.ttbMain)}</span><span>+ Poboczne ${fmtH(x.ttbExtra)}</span><span>100% ${fmtH(x.ttb100)}</span></div>
     <div class="row">${x.platforms.length>1?`<select class="plat" data-rp="${i}" aria-label="Platforma">${x.platforms.map(p=>`<option${p===plat?' selected':''}>${esc(p)}</option>`).join('')}</select>`:`<span class="pill">${esc(plat)}</span>`}
      <span data-rb="${i}">${had?`<span class="pill">W bibliotece: ${S[had.status].l}</span>`:`<button class="btn sm primary" data-queue="${i}">+ Do kolejki</button>`}</span></div>
    </div></div>`}).join(''):'<p class="small">Brak wyników w IGDB.</p>')+
    `<p class="small">Nie ma gry na liście? <button class="btn sm ghost" id="aManual">Dodaj „${esc(addQ.trim())}” tylko z tytułem</button></p>`;
  box.onchange=e=>{const s=e.target.closest('[data-rp]');if(!s)return;const x=res[s.dataset.rp],had=inLib(x.title,s.value);
    box.querySelector(`[data-rb="${s.dataset.rp}"]`).innerHTML=had?`<span class="pill">W bibliotece: ${S[had.status].l}</span>`:`<button class="btn sm primary" data-queue="${s.dataset.rp}">+ Do kolejki</button>`};
  box.onclick=e=>{const b=e.target.closest('[data-queue]');
    if(b){const i=b.dataset.queue,x=res[i],sel=box.querySelector(`[data-rp="${i}"]`);queueGame({...x,platform:sel?sel.value:x.platforms[0]});drawRes();return}
    if(e.target.id==='aManual'){const title=addQ.trim();if(!title)return;
      openModal(`<h2>Dodaj „${esc(title)}”</h2><label class="f">Platforma<select id="mPlat">${platOptions('PlayStation 5')}</select></label>
       <p class="small" id="mMsg">Gra trafi do kolejki bez danych z IGDB. Uzupełnisz je w edycji gry.</p>
       <div class="actions"><button class="btn ghost" id="mBack">Wróć</button><button class="btn primary" id="mOk">+ Do kolejki</button></div>`);
      $('#mBack').onclick=openAdd;
      $('#mOk').onclick=()=>{const platform=$('#mPlat').value;if(inLib(title,platform)){$('#mMsg').textContent='Ta gra na tej platformie już jest w bibliotece.';return}queueGame({title,platform});addQ='';closeModal()}}}
}
function queueGame(x){
  const g=blank({id:'m'+Date.now().toString(36),title:x.title,platform:x.platform,status:'backlog',releaseDate:x.releaseDate||'',igdbId:x.igdbId||'',
    ttbMain:x.ttbMain??'',ttbExtra:x.ttbExtra??'',ttb100:x.ttb100??''});
  state.games.push(g);
  state.sync[g.id]={title:g.title,platform:g.platform,fields:{add:{from:'',to:'dodaj do HLTB na listę Backlog'}},at:new Date().toLocaleString('pl-PL',{dateStyle:'short',timeStyle:'short'}),ts:Date.now()};
  save();render();toast(`${g.title} (${g.platform}) w kolejce`)}
$('#addBtn').onclick=openAdd;

