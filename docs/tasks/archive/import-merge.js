// ARCHIWUM — kod usunięty z web/index.html, do przywrócenia w ramach zadania. Zobacz plik zadania w docs/tasks/.
// Import scalający: dopasowanie po tytule+platformie, uzupełnianie pustych pól, ekran konfliktów (moje / HLTB).
// Zależy od: parseCSV, norm, keyOf, flag, date, hours, statusFrom, blank, S, fmtH, pl, openModal, wire.
const FIELDS=[['status','Status',v=>S[v]?.l||'—'],['hours','Godziny',fmtH],['myMain','Twoja fabuła',fmtH],['myExtra','Twoje + poboczne',fmtH],['my100','Twoje 100%',fmtH],['startDate','Start',pl],['completedDate','Ukończenie',pl],['retiredNote','Powód porzucenia',v=>v||'—'],['rating','Ocena',v=>v===''?'—':v]];

function buildImport(text){
  const rows=parseCSV(text);if(rows.length<2)throw new Error('Plik jest pusty.');
  const head=rows[0].map(h=>h.trim());if(!head.includes('Title'))throw new Error('To nie wygląda na eksport z HLTB: brak kolumny „Title”.');
  const recs=rows.slice(1).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
  const local=new Map(state.games.filter(g=>!g.example).map(g=>[keyOf(g),g]));
  const plan={add:[],fills:[],conflicts:[],same:0,wish:0,seen:new Set()};
  recs.forEach((r,i)=>{if(!r.Title.trim())return;
    const sf=statusFrom(r);if(!sf){plan.wish++;return}const st=sf.status;
    const rv=Math.round(parseFloat(r.Review));
    const inc={title:r.Title.trim(),platform:(r.Platform||'').trim(),status:st,hours:hours(r.Progress)||hours(r.Completionist)||hours(r['Main + Sides']||r['Main + Extras'])||hours(r['Main Story']),myMain:hours(r['Main Story']),myExtra:hours(r['Main + Sides']||r['Main + Extras']),my100:hours(r.Completionist),startDate:date(r['Start Date']),completedDate:date(r['Completion Date']),
      retiredNote:st==='retired'?(r['Retired Notes']||'').trim():'',rating:isNaN(rv)||rv<=0?'':Math.min(10,Math.max(1,rv>10?Math.round(rv/10):rv)),notes:(r['General Notes']||'').trim()};
    const k=keyOf(inc);if(plan.seen.has(k))return;plan.seen.add(k);
    const g=local.get(k);
    if(!g){plan.add.push(blank({...inc,wantReturn:!!sf.wantReturn,wantMax:!!sf.wantMax,id:'h'+Date.now().toString(36)+i,hours:inc.hours||0,retiredDate:st==='retired'?inc.completedDate:''}));return}
    const fill=[],conf=[];
    FIELDS.forEach(([f])=>{const mine=g[f],their=inc[f];
      if(their===''||their==null)return;
      if(mine===''||mine==null||(f==='hours'&&!mine)){fill.push([f,their]);return}
      if(String(mine)!==String(their))conf.push({f,mine,their,pick:'mine'})});
    if(fill.length)plan.fills.push({g,fill});
    if(conf.length)plan.conflicts.push({g,fields:conf});
    if(!fill.length&&!conf.length)plan.same++});
  return plan}

function showImport(plan){
  const lbl=f=>FIELDS.find(F=>F[0]===f);
  const html=()=>`<h2>Import z HLTB</h2>
   <p>Nowe gry: <b>${plan.add.length}</b> · uzupełnione puste pola: <b>${plan.fills.length}</b> · bez zmian: <b>${plan.same}</b> · konflikty: <b>${plan.conflicts.length}</b>${plan.wish?` · pominięte (tylko Owned lub Wishlist): <b>${plan.wish}</b>`:''}</p>
   <p class="small">Twoje notatki, cele, „Chcę wrócić”, „Chcę wymaksować” i wyniki turniejów zostają bez zmian. Gry spoza pliku nie są usuwane.${state.games.some(g=>g.example)?' Przykładowe gry zostaną zastąpione Twoimi.':''}</p>
   ${plan.conflicts.length?`<div class="row"><button class="btn ghost" id="allMine">Wszędzie zostaw moje</button><button class="btn ghost" id="allTheirs">Wszędzie weź z HLTB</button></div>
   ${plan.conflicts.map((c,ci)=>`<div class="conf"><div class="row"><b style="flex:1;min-width:0;overflow-wrap:anywhere">${esc(c.g.title)}</b><span class="small">${esc(c.g.platform)}</span></div>
     <div class="fld small"><span></span><span>U mnie</span><span>W HLTB</span></div>
     ${c.fields.map((x,fi)=>`<div class="fld"><span>${lbl(x.f)[1]}</span>
       <button class="opt" data-c="${ci}" data-fi="${fi}" data-p="mine" aria-pressed="${x.pick==='mine'}">${esc(lbl(x.f)[2](x.mine))}</button>
       <button class="opt" data-c="${ci}" data-fi="${fi}" data-p="their" aria-pressed="${x.pick==='their'}">${esc(lbl(x.f)[2](x.their))}</button></div>`).join('')}
     <div class="row"><button class="btn sm ghost" data-gall="${ci}" data-p="mine">Cała gra: moje</button><button class="btn sm ghost" data-gall="${ci}" data-p="their">Cała gra: HLTB</button></div></div>`).join('')}`:''}
   <div class="actions"><button class="btn ghost" data-close>Anuluj</button><button class="btn primary" id="apply">Zatwierdź import</button></div>`;
  const draw=()=>{const y=$('.sheet')?.scrollTop||0;openModal(html());$('.sheet').scrollTop=y;wire()};
  const setAll=p=>{plan.conflicts.forEach(c=>c.fields.forEach(x=>x.pick=p));draw()};
  function wire(){
    $('#allMine')&&($('#allMine').onclick=()=>setAll('mine'));$('#allTheirs')&&($('#allTheirs').onclick=()=>setAll('their'));
    $$('.opt').forEach(b=>b.onclick=()=>{plan.conflicts[b.dataset.c].fields[b.dataset.fi].pick=b.dataset.p;draw()});
    $$('[data-gall]').forEach(b=>b.onclick=()=>{plan.conflicts[b.dataset.gall].fields.forEach(x=>x.pick=b.dataset.p);draw()});
    $('#apply').onclick=()=>{
      if(state.games.some(g=>g.example)){state.games=state.games.filter(g=>!g.example);state.tour=null;state.lastTour=null}
      plan.fills.forEach(({g,fill})=>fill.forEach(([f,v])=>g[f]=v));
      let changed=0;plan.conflicts.forEach(c=>c.fields.forEach(x=>{if(x.pick==='their'){c.g[x.f]=x.their;changed++}}));
      const synced=syncCount();state.games.push(...plan.add);state.sync={};save();closeModal();render();
      toast(`Dodano ${plan.add.length}, uzupełniono ${plan.fills.length}, nadpisane pola: ${changed}${synced?`, lista „Do HLTB” wyczyszczona`:''}`)}}
  openModal(html());wire()}

