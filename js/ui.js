/* ============================================================
   INTERFAZ: pestañas, eventos de campos, botones (PDF, CSV, guardar) y arranque. Debe cargarse al final.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function setTab(t){ document.body.dataset.tab=t; document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t)); if(t==='rep') document.getElementById('rep').innerHTML=buildReport(); if(t==='viz') renderViz(); window.scrollTo(0,0); }
function buildPage(){
 document.getElementById('repctl').innerHTML=`<section><h2>Escenario</h2><p class="lead">Elija cuántos clientes simular y el resumen se recalcula solo. Las cifras son <b>aproximadas</b>: usan precios de lista oficiales (consultados el 2026-11-06) y supuestos que usted puede cambiar en la pestaña «Configuración». Los números usan punto para miles y coma para decimales (US$ 1.382 = mil trescientos ochenta y dos).</p>${SCEN()}<div id="arch-pick"></div></section>`;
 document.getElementById('cfg').innerHTML=`
 <section><h2>Configuración y contenido del reporte</h2>
  <p class="lead">Cada ficha tiene su propia ventana con las explicaciones y los valores editables. Marque <b>«En el reporte»</b> en las que quiera imprimir; al final, el PDF contiene solo lo marcado.</p>
  <div class="ctl"><button id="sel-all">Marcar todo</button><button id="sel-min">Solo resumen</button><button id="sel-none">Desmarcar todo</button><button class="pri" id="go-rep">Ver el resumen →</button></div>
  ${TILES.map(g=>`<h3>${g.g}</h3><div class="tiles">${g.items.map(tileHtml).join('')}</div>`).join('')}</section>`;
}
function update(){
 const set=(id,h)=>{const e=document.getElementById(id); if(e) e.innerHTML=h;};
 set('out-kpi',outKpi()); set('arch-pick',archPick());
 if(curModal){ set('m-cell',outCellInfo()); set('m-traffic',outTrafficCompare()); set('m-gps',gpsTable()); set('m-talk',talkTable()); set('m-staff',staffTable()); set('m-rank',outRank(S.ui.N,S.ui.prof)+outRecommend(S.ui.N,S.ui.prof)+outScale(S.ui.N,S.ui.prof)); set('m-aws',outAws()); set('m-containers',outContainers()); set('m-conn',outConn()); set('m-proj',projTable(S.ui.prof)+`<h3>Comparación de alojamientos (USD al mes)</h3>`+outArchs()); }
 for(const p of PROVS.concat(PROVS_OPT)){ document.querySelectorAll(`[data-ex="${p.id}"]`).forEach(e=>e.innerHTML=p.ex()); }
 document.querySelectorAll('.prof-desc').forEach(e=>e.innerHTML=profDesc());
 document.querySelectorAll('.prof-lbl').forEach(e=>e.setAttribute('data-tip',profTip()));
 document.querySelectorAll('[data-calc]').forEach(e=>{ const f=CALC[e.dataset.calc]; e.textContent=f&&f()?'Sí':'No'; });
 document.querySelectorAll('[data-b]').forEach(e=>{ if(document.activeElement===e) return; const v=bget(e.dataset.b); if(e.type==='checkbox') e.checked=!!v; else if(e.value!=String(v)) e.value=v; });
 if(document.body.dataset.tab==='rep') document.getElementById('rep').innerHTML=buildReport();
 if(document.body.dataset.tab==='viz') renderViz();
}
function bget(path){ if(path.startsWith('xt.')){ const e=S.extras.find(x=>x.id===path.slice(3)); return e?e.on:0; } return get(path); }
function bset(path,v){ if(path.startsWith('xt.')){ const e=S.extras.find(x=>x.id===path.slice(3)); if(e) e.on=v?1:0; } else setp(path,v); }
document.addEventListener('input',ev=>{ const e=ev.target; if(!e.dataset||!e.dataset.b) return;
 let v; if(e.type==='checkbox') v=e.checked?1:0; else if(e.type==='number'){ v=parseFloat(e.value); if(!isFinite(v)) return; if(e.dataset.b==='ui.N'){ if(v<1) return; v=Math.floor(v); } } else v=e.dataset.int?parseInt(e.value):e.value; // clientes: mínimo 1 (con 0 hay divisiones entre cero)
 bset(e.dataset.b,v); syncRates(e.dataset.b,v); save(); update(); });
// «Minutos entre consultas» y «consultas por hora» son lo mismo dicho de dos maneras (60 min ÷ minutos = consultas por hora); al editar uno se actualiza el otro.
function syncRates(path,v){ const g=S.g; if(!(v>0)) return;
 if(path==='g.interval_traffic') g.qph_traffic=60/v; else if(path==='g.qph_traffic') g.interval_traffic=60/v;
 else if(path==='g.interval_weather') g.qph_weather=60/v; else if(path==='g.qph_weather') g.interval_weather=60/v;
 else if(path==='g.ows_calls_cell') g.qph_ows=v/720; else if(path==='g.qph_ows') g.ows_calls_cell=v*720; }
document.addEventListener('change',ev=>{ const e=ev.target;
 if(e.tagName==='SELECT'&&e.dataset.b==='ui.prof'){ const of=document.getElementById('op-fields'); if(of) setTimeout(()=>{ of.innerHTML=opFields(); },0); }
 if(e.tagName==='SELECT'&&e.dataset.b){ bset(e.dataset.b,e.dataset.int?parseInt(e.value):e.value); save(); const gl=document.getElementById('gps-list'); if(gl&&/^gps\./.test(e.dataset.b)) gl.innerHTML=gpsEditor(); update(); }
 if(e.dataset&&e.dataset.b==='ui.N') e.value=S.ui.N; // si quedó vacío o en 0, vuelve al último valor válido
 if(e.id==='scales-in'){ const a=[...new Set(e.value.split(/[,;\s]+/).map(x=>parseInt(x)).filter(x=>x>0))].sort((x,y)=>x-y).slice(0,12); if(a.length){ S.ui.scales=a; save(); } e.value=S.ui.scales.join(', '); update(); } });
document.addEventListener('click',ev=>{ const t=ev.target;
 if(t.dataset&&t.dataset.open) openModal(t.dataset.open);
 if(t.id==='mx'||t.id==='modal') closeModal();
 if(t.id==='sel-all'||t.id==='sel-none'||t.id==='sel-min'){ for(const k in S.rep) S.rep[k]=t.id==='sel-all'?1:(t.id==='sel-min'&&k==='resumen'?1:0); save(); document.querySelectorAll('[data-b^="rep."]').forEach(c=>c.checked=!!S.rep[c.dataset.b.slice(4)]); update(); }
 if(t.dataset&&t.dataset.setcell){ const pv=t.dataset.setcell; S.g[pv==='tt'?'cell_deg_tt':'cell_deg_here']=Math.floor(degMax(S.g,pv)*1000)/1000; save(); update(); }
 if(t.dataset&&t.dataset.gadd){ S.gps.push(clone(DEV_TPL)); save(); const e=document.getElementById('gps-list'); if(e) e.innerHTML=gpsEditor(); update(); }
 if(t.dataset&&t.dataset.gdel!==undefined){ S.gps.splice(parseInt(t.dataset.gdel),1); save(); const e=document.getElementById('gps-list'); if(e) e.innerHTML=gpsEditor(); update(); }
 if(t.dataset&&t.dataset.tadd){ S.talkteam.push(clone(TT_TPL)); save(); const e=document.getElementById('talk-list'); if(e) e.innerHTML=talkEditor(); update(); }
 if(t.dataset&&t.dataset.tdel!==undefined){ S.talkteam.splice(parseInt(t.dataset.tdel),1); save(); const e=document.getElementById('talk-list'); if(e) e.innerHTML=talkEditor(); update(); }
 if(t.id==='go-rep') setTab('viz');
 if(t.id==='btn-print-viz') doPrint();
 if(t.id==='go-cfg') setTab('cfg');
 const ap=t.closest&&t.closest('[data-arch]'); if(ap){ S.ui.arch=parseInt(ap.dataset.arch); save(); update(); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&curModal) closeModal(); });
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));

/* ----------------------------- Botones ----------------------------- */
function dl(name,mime,text){ const b=new Blob([text],{type:mime}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }
function doPrint(){ if(curModal) closeModal(); document.getElementById('rep').innerHTML=buildReport(); window.print(); }
document.getElementById('btn-pdf').onclick=doPrint;
document.getElementById('btn-csv').onclick=()=>{
 const pr=S.ui.prof; const hdr=['Clientes','Dispositivos','Celdas','Servidores y AWS USD','Datos de trafico USD','Otros proveedores USD','Costo duro USD','Personal USD','TOTAL USD/mes','USD por cliente','USD por dispositivo','USD por ano','COP por mes'];
 const lines=[hdr.join(';')]; for(const n of S.ui.scales){ const o=calc(n,pr,S); const other=o.other;
  lines.push([n,o.devices,o.cells,o.infra,o.traffic,other,o.tech,o.staff,o.total,o.total/n,(o.devices>0?o.total/o.devices:0),o.total*12,o.total*S.t.trm].map(x=>typeof x==='number'?x.toFixed(2).replace('.',','):x).join(';')); }
 lines.push(''); lines.push('Perfil;'+PROF_UP[pr]+';Alojamiento;'+ARCH[S.ui.arch]);
 dl('xigos-proyeccion.csv','text/csv;charset=utf-8','﻿'+lines.join('\r\n')); };
document.getElementById('btn-save').onclick=()=>dl('xigos-configuracion.json','application/json',JSON.stringify(S,null,1));
document.getElementById('btn-load').onclick=()=>document.getElementById('file-load').click();
document.getElementById('file-load').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ localStorage.setItem(KEY,r.result); S=load(); buildPage(); update(); }catch(x){ alert('No se pudo leer el archivo.'); } }; r.readAsText(f); };
document.getElementById('btn-reset').onclick=()=>{ if(confirm('¿Restaurar todos los valores originales? Se pierden sus cambios.')){ S=clone(DEF); save(); if(curModal) closeModal(); buildPage(); update(); } };
window.addEventListener('beforeprint',()=>{ document.getElementById('rep').innerHTML=buildReport(); });

const more=document.getElementById('btn-more'), moreList=document.getElementById('more-list');
more.onclick=e=>{ e.stopPropagation(); const open=moreList.hidden; if(open&&innerWidth<=700) moreList.style.top=(more.getBoundingClientRect().bottom+6)+'px'; moreList.hidden=!open; more.setAttribute('aria-expanded',String(open)); };
document.addEventListener('click',e=>{ if(e.target.closest('#more-list button')||!e.target.closest('.menu')){ moreList.hidden=true; more.setAttribute('aria-expanded','false'); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ moreList.hidden=true; more.setAttribute('aria-expanded','false'); } });
const GK='xigos-guide-hidden'; const showGuide=on=>{ document.getElementById('guide').hidden=!on; try{ localStorage.setItem(GK,on?'0':'1'); }catch(e){} if(on){ setTab('viz'); window.scrollTo(0,0); } };
document.getElementById('guide-close').onclick=()=>showGuide(false); document.getElementById('btn-guide').onclick=()=>showGuide(true);
try{ document.getElementById('guide').hidden=localStorage.getItem(GK)==='1'; }catch(e){ document.getElementById('guide').hidden=false; }
let rzT; addEventListener('resize',()=>{ clearTimeout(rzT); rzT=setTimeout(()=>{ if(document.body.dataset.tab==='viz') renderViz(); },200); });
document.body.dataset.tab='viz'; buildPage(); update();
