/* ============================================================
   ESTADO Y UTILIDADES: configuración guardada (localStorage), formato de números y moneda, ayudas para campos.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ===================================================================== UI ===================================================================== */
const KEY='xigos-calc-v1';
const PROF_NAMES=['pequeña','mediana','grande','personalizada'], PROF_UP=['Pequeña','Mediana','Grande','Personalizada'];
let S=load();
function load(){ try{ const j=JSON.parse(localStorage.getItem(KEY)||'null'); if(j){ const d=clone(DEF); for(const k of ['t','g']) Object.assign(d[k],j[k]||{}); if(j.tc) for(const c in d.tc) Object.assign(d.tc[c],j.tc[c]||{}); { const cj=(j.ui||{}).cloud; if(cj&&cj!=='aws'&&!d.tc[cj]) j.ui.cloud='aws'; } if(j.p) for(const k in j.p) d.p[k]=j.p[k];
  if(j.ctr) j.ctr.forEach(c=>{const x=d.ctr.find(y=>y.id===c.id); if(x) Object.assign(x,c);}); if(j.conn) j.conn.forEach(c=>{const x=d.conn.find(y=>y.id===c.id); if(x) Object.assign(x,c);});
  if(j.extras) j.extras.forEach(c=>{const x=d.extras.find(y=>y.id===c.id); if(x) Object.assign(x,c);}); if(j.ui) Object.assign(d.ui,j.ui); d.ui.N=Math.max(1,Math.floor(d.ui.N)||1); d.g.qph_traffic=60/d.g.interval_traffic; d.g.qph_weather=60/d.g.interval_weather; d.g.qph_ows=d.g.ows_calls_cell/720; if(j.rep) Object.assign(d.rep,j.rep); for(const k in d.p){ while(d.p[k].length<4) d.p[k].push(d.p[k][1]); } /* configuraciones viejas: la operación personalizada arranca como copia de la mediana */ d.ui.gps=1; /* los costos de dispositivos siempre se suman */ const A0=(CELL0_DEG*DEG_KM)*(CELL0_DEG*DEG_KM); if(j.p&&j.p.cells_pc&&!j.p.territory_km2) d.p.territory_km2=j.p.cells_pc.map(v=>Math.round(v*A0)); if(j.g&&j.g.ncap&&!j.g.ncap_km2) d.g.ncap_km2=Math.round(j.g.ncap*A0); if(Array.isArray(j.gps)){ const tpl={name:'',contact:'',qty:0,scope:'total',mode:'buy',cur:'USD',equip:0,install:0,rent:0,sim:0,plat:0,other:0,life:0}; d.gps=j.gps.filter(c=>c.kind!=='bodycam').map(c=>{ const r=Object.assign({},tpl,c); delete r.share; delete r.kind; if(r.name==='Eje Satelital') r.name='Proveedor A'; return r; }); } if(Array.isArray(j.talkteam)&&j.talkteam.length){ d.talkteam=j.talkteam.map(c=>Object.assign({name:'',basis:'dev_month',value:0,cur:'COP',size:0,on:1},c)); } return d; } }catch(e){} return clone(DEF); }
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }

const fmt=(x,d=2)=>Number(x).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
// Moneda GLOBAL: S.ui.unit ('usd'|'cop') cambia todas las cifras de dinero de la calculadora.
const isCop=()=>S.ui.unit==='cop';
const usd=(x,d=2)=>isCop()?'COP '+fmt(x*S.t.trm,Math.abs(x*S.t.trm)<100?2:0):'US$ '+fmt(x,d);
const cop=x=>isCop()?'US$ '+fmt(x,2):'COP '+fmt(x*S.t.trm,0);          // equivalente en la OTRA moneda
const m=(x,d=2)=>isCop()?fmt(x*S.t.trm,Math.abs(x*S.t.trm)<100?2:0):fmt(x,d); // número de dinero sin símbolo
const alt=x=>isCop()?fmt(x,2):fmt(x*S.t.trm,0);                      // número en la otra moneda
const CU=()=>isCop()?'COP':'USD', CA=()=>isCop()?'USD':'COP';        // nombre de la moneda activa / de la otra
const int=x=>fmt(x,0);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const get=(path)=>path.split('.').reduce((a,k)=>a==null?a:a[k],S);
function setp(path,v){ const ks=path.split('.'); let o=S; for(let i=0;i<ks.length-1;i++) o=o[ks[i]]; o[ks[ks.length-1]]=v; }
const inp=(path,step='any',cls='')=>`<input type="number" step="${step}" data-b="${path}" class="${cls}" value="${get(path)}">`;
const sel=(path,opts)=>`<select data-b="${path}" ${opts.every(([v])=>/^\d+$/.test(String(v)))?'data-int="1"':''}>${opts.map(([v,l])=>`<option value="${v}" ${String(get(path))===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
const chk=(path,label)=>`<label class="chk"><input type="checkbox" data-b="${path}" ${bget(path)?'checked':''}> ${label}</label>`;
