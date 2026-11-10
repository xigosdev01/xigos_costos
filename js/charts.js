/* ============================================================
   GRÁFICAS: dibujo SVG propio y definición de cada gráfica.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ----------------------------- Gráficas (SVG propio, sin librerías) ----------------------------- */
// Colores: paleta categórica validada (orden fijo: azul, naranja, aguamarina, amarillo, magenta). Cada concepto conserva SIEMPRE su color.
let CW=560;   // ancho de dibujo de las gráficas (se ajusta al recuadro donde van)
const PAL={infra:'#2a78d6',traffic:'#eb6834',other:'#1baf7a',gps:'#eda100',staff:'#e87ba4'};
const ARCHC={A:'#2a78d6',B:'#eb6834',C:'#1baf7a',D:'#eda100'};
const CLOUDC={aws:'#eb6834',gcp:'#2a78d6',azure:'#1baf7a'};   // un color fijo por nube
const INK='#0b0b0b',INK2='#52514e',MUTED='#898781',GRID='#e1e0d9',AXIS='#c3c2b7',SURF='#fcfcfb';
const VU=()=>S.ui.unit==='cop'?S.t.trm:1;
const vf=(x,d=0)=>S.ui.unit==='cop'?'COP '+fmt(x*S.t.trm,0):'US$ '+fmt(x,d);
const cmp=v=>{const a=Math.abs(v); const I=x=>Number.isInteger(Math.round(x*10)/10)&&Math.abs(x-Math.round(x))<1e-9; if(a>=1e9) return fmt(v/1e9,I(v/1e9)?0:1)+' mil M'; if(a>=1e6) return fmt(v/1e6,I(v/1e6)?0:1)+' M'; if(a>=1e3){const k=v/1e3; return fmt(k,I(k)||a>=1e4?0:1)+' mil';} return fmt(v,I(v)?0:(a>0&&a<0.1?2:(a>0&&a<10?1:0)));};
const niceMax=v=>{ if(!(v>0)) return 1; const e=Math.pow(10,Math.floor(Math.log10(v))); const f=v/e; return (f<=1?1:f<=2?2:f<=5?5:10)*e; };
const tipA=t=>`data-tip="${String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`;
const VH={}, VO={};   // series ocultas y tablas abiertas (solo en la vista interactiva)
const svgOpen=(W,H,aria)=>`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria}" class="svgc" xmlns="http://www.w3.org/2000/svg">`;

// Explica por qué «Otros» es 0 al inicio y aparece más adelante: rutas alternas que superan el cupo gratis.
function otrosTip(){
 const p=S.p.route_calls[S.ui.prof], per=p*(1-S.g.route_cache_hit), free=S.t.ors_free_month+S.t.tt_route_free, n0=Math.floor(free/per)+1;
 const cpm=43200/S.g.interval_traffic, zTT=S.t.tt_free/cpm, zHE=S.t.here_free/cpm;
 return `«Otros» NO incluye el tráfico: TomTom y HERE van en la columna «Tráfico» y ya se pagan desde el primer cliente (su cupo gratis de ${int(S.t.tt_free)} y ${int(S.t.here_free)} consultas al mes solo cubre ≈ ${fmt(zTT,1)} y ${fmt(zHE,1)} zonas vigiladas).\nAquí «Otros» solo tiene las rutas alternas, que son otro servicio (OpenRouteService y TomTom Routing, cupo gratis conjunto de ${int(free)} rutas al mes). Cada cliente pide ≈ ${int(per)} rutas nuevas al mes: el cupo se agota hacia los ${int(n0)} clientes y desde ahí se paga el excedente (EUR ${fmt(S.t.tt_route,2)} por 1.000).\nTambién suma correo (solo si usa SES), WhatsApp y mapas de pago si los activa.`;
}
function legendHtml(items,tog){ return `<div class="lg2">${items.map(i=>tog?`<label class="lgi" ${i.tip?tipA(i.tip):''}><input type="checkbox" data-vz="${i.k}" ${VH[i.k]?'':'checked'}><i style="background:${i.c}"></i>${i.l}${i.tip?' ⓘ':''}</label>`:`<span class="lgi"><i style="background:${i.c}"></i>${i.l}</span>`).join('')}</div>`; }
const tbl=(heads,rows)=>`<div class="scroll"><table><tr>${heads.map((h,i)=>`<th${i?'':' class="l"'}>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>`<td${i?'':' class="l"'}>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

function svgHBars(items,aria){
 const W=CW,rowH=42,L=172,R=164,T=8,H=T*2+rowH*items.length; const mx=Math.max(...items.map(i=>i.v),1e-9); const tot=items.reduce((a,i)=>a+i.v,0)||1;
 const wrap=(s,n)=>{ const out=[]; let cur=''; s.split(' ').forEach(w=>{ if((cur+' '+w).trim().length>n&&cur){ out.push(cur); cur=w; } else cur=(cur+' '+w).trim(); }); if(cur) out.push(cur); return out; };
 let g=''; items.forEach((it,i)=>{ const y=T+rowH*i+11, w=Math.max(2,(W-L-R)*it.v/mx), ls=wrap(it.l,24);
  g+=ls.map((ln,k)=>`<text x="${L-8}" y="${y+(ls.length>1?9+k*13:14)}" text-anchor="end" font-size="12" fill="${INK2}">${ln}</text>`).join('');
  g+=`<rect class="mk" x="${L}" y="${y}" width="${w}" height="18" rx="4" fill="${it.c}" ${tipA(`${it.l}: ${vf(it.v)} al mes · ${vf(it.v*12)} al año · ${fmt(it.v/tot*100,0)} % del total`)}/>`;
  g+=`<text x="${L+w+6}" y="${y+14}" font-size="12" font-weight="600" fill="${INK}">${vf(it.v)} · ${fmt(it.v/tot*100,0)} %</text>`; });
 g+=`<line x1="${L}" x2="${L}" y1="${T}" y2="${H-T}" stroke="${AXIS}"/>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}
function svgStacked(cats,series,xlabel,aria,xname){
 const W=CW,H=300,L=62,R=10,T=18,B=42,pw=W-L-R,ph=H-T-B; const u=VU();
 const tot=cats.map((_,i)=>series.reduce((a,s)=>a+(s.v[i]||0),0)); const mx=niceMax(Math.max(...tot,1e-9)*u)/u; let g='';
 for(let k=0;k<=4;k++){ const y=T+ph-ph*k/4; g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="${GRID}"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="${MUTED}">${cmp(mx*u*k/4)}</text>`; }
 const band=pw/cats.length, bw=Math.min(46,band*0.64);
 cats.forEach((c,i)=>{ const x=L+band*i+(band-bw)/2; let acc=0;
  series.forEach(s=>{ const v=s.v[i]||0; if(v<=0) return; const h=ph*v/mx, y=T+ph-ph*(acc+v)/mx; acc+=v;
   g+=`<rect class="mk" x="${x}" y="${y}" width="${bw}" height="${Math.max(h,.5)}" fill="${s.c}" stroke="${SURF}" stroke-width="2" rx="2" ${tipA(`${xname} ${fmt(c,0)} · ${s.l}: ${vf(v)} al mes (${fmt(v/tot[i]*100,0)} % del total)`)}/>`; });
  g+=`<text x="${x+bw/2}" y="${T+ph-ph*tot[i]/mx-5}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${INK}">${cmp(tot[i]*u)}</text>`;
  g+=`<text x="${x+bw/2}" y="${H-B+16}" text-anchor="middle" font-size="11" fill="${INK2}">${fmt(c,0)}</text>`; });
 g+=`<line x1="${L}" x2="${W-R}" y1="${T+ph}" y2="${T+ph}" stroke="${AXIS}"/><text x="${L+pw/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${MUTED}">${xlabel}</text>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}
function svgLines(xs,series,o){ // o:{logY, xlabel, aria, xname, dec}
 const W=o.w||CW,H=290,L=62,R=78,T=16,B=42,pw=W-L-R,ph=H-T-B,u=VU(); const n=xs.length;
 const pos=series.flatMap(s=>s.v).filter(v=>v>0); if(!pos.length) return '<p class="small">No hay datos para graficar.</p>';
 let ymap,ticks=[];
 if(o.logY){ let lo=Math.floor(Math.log10(Math.min(...pos)*u)), hi=Math.ceil(Math.log10(Math.max(...pos)*u)); if(hi<=lo) hi=lo+1; ymap=v=>T+ph-ph*(Math.log10(Math.max(v,1e-12)*u)-lo)/(hi-lo); for(let k=lo;k<=hi;k++) ticks.push([Math.pow(10,k),T+ph-ph*(k-lo)/(hi-lo)]); }
 else { const mx=niceMax(Math.max(...pos)*u); ymap=v=>T+ph-ph*(v*u)/mx; for(let k=0;k<=4;k++) ticks.push([mx*k/4,T+ph-ph*k/4]); }
 let g=''; ticks.forEach(([v,y])=>{ g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="${GRID}"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="${MUTED}">${cmp(v)}</text>`; });
 const xp=i=>L+pw*(i+.5)/n; xs.forEach((x,i)=>{ g+=`<text x="${xp(i)}" y="${H-B+16}" text-anchor="middle" font-size="11" fill="${INK2}">${fmt(x,0)}</text>`; });
 g+=`<line x1="${L}" x2="${W-R}" y1="${T+ph}" y2="${T+ph}" stroke="${AXIS}"/><text x="${L+pw/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${MUTED}">${o.xlabel}</text>`;
 const ends=[];
 const colsAt=()=>{ let q=''; xs.forEach((x,i)=>{ const lines=series.filter(s=>s.v[i]>0).map(s=>`${s.l}: ${vf(s.v[i],o.dec===undefined?0:o.dec)}`); q+=`<rect class="col" x="${xp(i)-pw/n/2}" y="${T}" width="${pw/n}" height="${ph}" fill="transparent" ${tipA(`${o.xname} ${fmt(x,0)}\n`+lines.join('\n'))}/>`; }); return q; };
 series.forEach(s=>{ const pts=s.v.map((v,i)=>v>0?[xp(i),ymap(v),v,i]:null).filter(Boolean); if(!pts.length) return;
  g+=`<path d="${pts.map((p,k)=>(k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')}" fill="none" stroke="${s.c}" stroke-width="2" stroke-linejoin="round"/>`;
  pts.forEach(p=>{ g+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${s.c}" stroke="${SURF}" stroke-width="2"/>`; });
  const last=pts[pts.length-1]; ends.push({y:last[1],x:last[0],s}); });
 ends.sort((a,b)=>a.y-b.y); let prev=-99; ends.forEach(e=>{ const lab=e.s.short||e.s.l; if(series.length>1&&series.length<=4&&e.y-prev>=13&&lab.length*6.4+12<=W-e.x-2){ g+=`<text x="${e.x+9}" y="${e.y+4}" font-size="11" font-weight="600" fill="${INK2}">${lab}</text>`; prev=e.y; } });
 return svgOpen(W,H,o.aria)+g+colsAt()+'</svg>';
}
function svgTornado(items,base,aria){
 const W=CW,rowH=44,L=200,R=12,T=26,H=T+rowH*items.length+8; const half=(W-L-R)/2, x0=L+half; const mxd=Math.max(...items.flatMap(i=>[Math.abs(i.lo-base),Math.abs(i.hi-base)]),1e-9);
 let g=`<text x="${x0-half}" y="14" font-size="11" fill="${MUTED}">← baja el costo</text><text x="${x0+half}" y="14" font-size="11" text-anchor="end" fill="${MUTED}">sube el costo →</text>`;
 items.forEach((it,i)=>{ const y=T+rowH*i+4; const words=it.l.split(' '); const lines=[]; let cur=''; words.forEach(w=>{ if((cur+' '+w).trim().length>30&&cur){ lines.push(cur); cur=w; } else cur=(cur+' '+w).trim(); }); if(cur) lines.push(cur);
  g+=lines.map((ln,k)=>`<text x="${L-8}" y="${y+(lines.length>1?11+k*14:16)}" text-anchor="end" font-size="11.5" fill="${INK2}">${ln}</text>`).join('');
  [[it.lo,'Si baja 25 %',PAL.infra,0],[it.hi,'Si sube 25 %',PAL.traffic,1]].forEach(([val,lab,col,k])=>{ const d=val-base, w=Math.abs(d)/mxd*half, x=d>=0?x0:x0-w, yy=y+k*16;
   g+=`<rect class="mk" x="${x}" y="${yy}" width="${Math.max(w,1.5)}" height="13" rx="3" fill="${col}" ${tipA(`${it.l} — ${lab}: el total mensual pasa de ${vf(base)} a ${vf(val)} (${d>=0?'+':'−'}${vf(Math.abs(d))})`)}/>`;
   const lab2=`${d>=0?'+':'−'}${cmp(Math.abs(d)*VU())}`, bw2=Math.max(w,1.5), fits=d>=0?(x0+bw2+4+38<=W-2):(x0-bw2-4-38>=2);
   g+=fits?`<text x="${d>=0?x0+bw2+4:x0-bw2-4}" y="${yy+11}" font-size="10.5" text-anchor="${d>=0?'start':'end'}" fill="${INK2}">${lab2}</text>`:`<text x="${d>=0?x0+bw2-5:x0-bw2+5}" y="${yy+11}" font-size="10.5" font-weight="600" text-anchor="${d>=0?'end':'start'}" fill="#fff">${lab2}</text>`; }); });
 g+=`<line x1="${x0}" x2="${x0}" y1="${T-6}" y2="${H-6}" stroke="${AXIS}"/>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}

/* ----------------------------- Definición de cada gráfica ----------------------------- */
const withS=(fn)=>{ const s=clone(S); fn(s); return s; };
function perClient(o){ return o.total/o.N; }
const CH=[
 {id:'desglose',title:'¿Dónde se va el dinero?',
  what:'Reparte el costo mensual total entre sus partes: servidores, datos de tráfico, otros proveedores, dispositivos (equipo, SIM y plataforma) y personal.',
  how:'Cada barra es una parte; mientras más larga, más pesa. A la derecha está su valor y qué porcentaje del total es.',
  build:()=>{ const N=S.ui.N,o=calc(N,S.ui.prof,S); const items=[{l:'Servidores y '+CLS(),v:o.infra,c:PAL.infra},{l:'Datos de tráfico (HERE+TomTom)',v:o.traffic,c:PAL.traffic},{l:'Otros proveedores',v:o.other-o.gps,c:PAL.other}];
   if(o.gps>0) items.push({l:'Dispositivos (equipo, SIM, plataforma)',v:o.gps,c:PAL.gps}); if(o.staff>0) items.push({l:'Personal',v:o.staff,c:PAL.staff});
   const top=[...items].sort((a,b)=>b.v-a.v)[0];
   return {legend:'',svg:svgHBars(items,'Reparto del costo mensual por concepto'),note:`Con ${int(N)} cliente(s), lo que más pesa es <b>${top.l}</b>: ${vf(top.v)} al mes (${fmt(top.v/o.total*100,0)} % del total de ${vf(o.total)}).`,
    table:tbl(['Concepto','Al mes','Al año','% del total'],items.map(i=>[i.l,vf(i.v,2),vf(i.v*12),fmt(i.v/o.total*100,1)+' %']))}; }},
 {id:'crecimiento',title:'Cómo crece el costo al tener más clientes',
  what:'El costo mensual de cada parte (y el total) para distintas cantidades de clientes.',
  how:'Cada línea es una parte del costo (vea la leyenda); la negra es el total. La escala vertical es logarítmica: cada raya vale 10 veces la anterior, así se ven juntas las cifras pequeñas y las grandes. Una línea que se aplana (como la de tráfico) significa que deja de crecer aunque haya más clientes. Puede apagar líneas con las casillas.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S));
   const all=[{k:'infra',l:'Servidores y '+CLS(),c:PAL.infra,v:os.map(o=>o.infra)},{k:'traffic',l:'Datos de tráfico',c:PAL.traffic,v:os.map(o=>o.traffic)},{k:'other',l:'Otros proveedores',tip:otrosTip(),c:PAL.other,v:os.map(o=>o.other-o.gps)},
    {k:'gps',l:'Dispositivos',c:PAL.gps,v:os.map(o=>o.gps)},{k:'staff',l:'Personal',c:PAL.staff,v:os.map(o=>o.staff)}].filter(s=>s.v.some(x=>x>0.005));
   all.push({k:'total',l:'TOTAL',c:INK,v:os.map(o=>o.total)});
   const vis=all.filter(s=>!(tog&&VH[s.k])); const f=os[0],l=os[os.length-1];
   return {legend:legendHtml(all,tog),svg:vis.length?svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo mensual de cada parte y total según el número de clientes',xname:'Con',dec:0}):'<p class="small">Active al menos una línea en la leyenda.</p>',
    note:`Con ${int(sc[0])} cliente(s) cuesta ${vf(f.total)} al mes; con ${int(sc[sc.length-1])}, ${vf(l.total)}. El total sube, pero por cliente baja de ${vf(f.total/sc[0])} a ${vf(l.total/sc[sc.length-1])} (siguiente gráfica).`,
    table:tbl(['Clientes','Servidores y '+CLS(),'Tráfico',`<span ${tipA(otrosTip())}>Otros ⓘ</span>`,'Dispositivos','Personal','TOTAL al mes','TOTAL al año'],sc.map((n,i)=>[int(n),vf(os[i].infra),vf(os[i].traffic),vf(os[i].other-os[i].gps),vf(os[i].gps),vf(os[i].staff),vf(os[i].total),vf(os[i].total*12)]))}; }},
 {id:'promedio',title:'Cuánto cuesta cada cliente (promedio) al crecer',
  what:'El costo mensual promedio de UN cliente según cuántos clientes tenga XiGOS.',
  how:'Cada punto es una cantidad de clientes (abajo). Si la línea baja, atender a cada cliente cuesta menos, porque los costos fijos (el hub, las zonas del mapa) se reparten entre más clientes.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S)); const same=os.every(o=>Math.abs(o.total-o.tech)<1e-9);
   const ser=[{k:'tot',l:same?'Costo por cliente':'Total por cliente (con personal)',short:'Total',c:PAL.infra,v:os.map(o=>o.total/o.N)}]; if(!same) ser.push({k:'duro',l:'Costo duro por cliente (sin personal)',short:'Costo duro',c:PAL.traffic,v:os.map(o=>o.tech/o.N)});
   const vis=ser.filter(s=>!(tog&&VH[s.k])); const f=os[0],l=os[os.length-1];
   return {legend:same?'':legendHtml(ser,tog),svg:svgLines(sc,vis,{xlabel:'Número de clientes',aria:'Costo mensual promedio por cliente',xname:'Con',dec:2}),
    note:`Con ${int(sc[0])} cliente(s) cada uno cuesta ${vf(f.total/sc[0],2)} al mes; con ${int(sc[sc.length-1])}, ${vf(l.total/sc[sc.length-1],2)}.`,
    table:tbl(['Clientes','Total por cliente al mes','Costo duro por cliente','Total por cliente al año'],sc.map((n,i)=>[int(n),vf(os[i].total/n,2),vf(os[i].tech/n,2),vf(os[i].total*12/n)]))}; }},
 {id:'vehiculo',title:'¿Un dispositivo GPS más sube el costo?',
  what:'Qué pasa con el costo si la operación tiene más o menos dispositivos GPS en total (el número de clientes y de bodycams se mantiene; la cantidad se reparte entre los proveedores según lo registrado).',
  how:'A la izquierda, el costo total del mes: sube con cada dispositivo según lo que cueste su equipo, SIM y plataforma (mientras esos valores estén en 0, casi no se mueve). A la derecha, el promedio por dispositivo: baja porque el costo fijo se reparte entre más dispositivos. Por eso el «costo por dispositivo» es solo un promedio.',
  build:()=>{ const N=S.ui.N,pi=S.ui.prof,ds=[1,2,5,10,20,50,100,200]; const os=ds.map(d=>calc(N,pi,S,{gps_total:d}));
   const pd=o=>o.devices>0?o.total/o.devices:0;
   const half=CW>=640?Math.round((CW-12)/2):CW;
   const a=svgLines(ds,[{k:'t',l:'Costo total al mes',c:PAL.infra,v:os.map(o=>o.total)}],{w:half,xlabel:'Dispositivos GPS en total',aria:'Costo total mensual según dispositivos GPS en total',xname:'Con',dec:0});
   const b=svgLines(ds,[{k:'p',l:'Promedio por dispositivo',c:PAL.traffic,v:os.map(pd)}],{w:half,logY:true,xlabel:'Dispositivos GPS en total',aria:'Promedio mensual por dispositivo según dispositivos GPS en total',xname:'Con',dec:2});
   const dc=(os[os.length-1].total-os[0].total)/(ds[ds.length-1]-ds[0]);
   return {legend:'',svg:`<div class="two"><div><div class="mini">Costo TOTAL al mes</div>${a}</div><div><div class="mini">Promedio POR DISPOSITIVO al mes (escala logarítmica)</div>${b}</div></div>`,
    note:S.gps.length?`Pasar de ${ds[0]} a ${ds[ds.length-1]} dispositivos GPS cambia el total en ${vf(os[os.length-1].total-os[0].total,2)} (≈ ${vf(dc,2)} por dispositivo adicional al mes, contando su equipo, SIM y plataforma${(S.gps.reduce((a,g)=>a+g.equip+g.rent+g.sim+g.plat+g.other+g.install,0)===0)?'; hoy esos precios están en 0, por eso casi no cambia':''}). El promedio por dispositivo pasa de ${vf(pd(os[0]),2)} a ${vf(pd(os[os.length-1]),2)}.`:'Agregue al menos un proveedor GPS en la ficha «Dispositivos GPS» para ver esta gráfica.',
    table:tbl(['Dispositivos GPS en total','Dispositivos (con bodycams)','Total al mes','Promedio por dispositivo'],ds.map((d,i)=>[int(d),int(os[i].devices),vf(os[i].total,2),vf(pd(os[i]),2)]))}; }},
 {id:'sens',title:'¿Qué mueve más el resultado?',
  what:'Cuánto cambia el costo mensual total si cada supuesto o precio sube o baja un 25 %, uno por uno.',
  how:'Cada fila es un supuesto. La barra azul muestra qué pasa si baja 25 %; la naranja, si sube 25 %. Las barras más largas son los supuestos que más importa confirmar con datos reales.',
  build:()=>{ const N=S.ui.N,pi=S.ui.prof; const base=calc(N,pi,S).total; const defs=[
    ['Territorio que vigila cada cliente',(s,f)=>{s.p.territory_km2=s.p.territory_km2.map(v=>v*f);}],['Territorio total del país a vigilar (tope)',(s,f)=>{s.g.ncap_km2*=f;}],['Minutos entre consultas de tráfico',(s,f)=>{s.g.interval_traffic*=f;}],
    ['% de consultas al proveedor de respaldo',(s,f)=>{s.g.backup_pct=Math.min(100,s.g.backup_pct*f);}],['Precio por 1.000 consultas (TomTom y HERE)',(s,f)=>{['here_t1','here_t2','here_t3','tt_t1','tt_t2'].forEach(k=>s.t[k]*=f);}],
    ['Memoria que usa cada contenedor',(s,f)=>{s.ctr.forEach(c=>c.ram*=f);}],['Precio de los servidores de '+CLS(),(s,f)=>{const r=cloudRates(s); ['ls_4','ls_8','ls_16','ls_32','ec2_t3l','rds_single','rds_multi'].forEach(k=>r[k]*=f);}],
    ['Cantidad de dispositivos GPS',(s,f)=>{s.gps.forEach(g=>{g.qty*=f;});}],['Cantidad de bodycams',(s,f)=>{s.g.bc_qty*=f;}],['Costos de equipo, SIM y plataforma por dispositivo',(s,f)=>{s.gps.forEach(g=>{g.equip*=f;g.rent*=f;g.sim*=f;g.plat*=f;g.other*=f;g.install*=f;}); s.talkteam.forEach(l=>{l.value*=f;});}]];
   if(S.ui.analyst) defs.push(['Sueldo del analista de inteligencia',(s,f)=>{s.g.analyst_salary_cop*=f;}]);
   const items=defs.map(([l,fn])=>({l,lo:calc(N,pi,withS(s=>fn(s,.75))).total,hi:calc(N,pi,withS(s=>fn(s,1.25))).total})).sort((a,b)=>Math.max(Math.abs(b.lo-base),Math.abs(b.hi-base))-Math.max(Math.abs(a.lo-base),Math.abs(a.hi-base)));
   const t=items[0];
   return {legend:`<div class="lg2"><span class="lgi"><i style="background:${PAL.infra}"></i>Si baja 25 %</span><span class="lgi"><i style="background:${PAL.traffic}"></i>Si sube 25 %</span></div>`,svg:svgTornado(items,base,'Sensibilidad del costo total a cada supuesto'),
    note:`Costo base: ${vf(base)} al mes. Lo que más lo mueve es <b>${t.l}</b>: de ${vf(Math.min(t.lo,t.hi))} a ${vf(Math.max(t.lo,t.hi))}.`,
    table:tbl(['Supuesto','Total si baja 25 %','Total si sube 25 %','Diferencia máxima'],items.map(i=>[i.l,vf(i.lo),vf(i.hi),vf(Math.max(Math.abs(i.lo-base),Math.abs(i.hi-base)))]))}; }},
 {id:'nubes',title:'AWS, Google Cloud y Azure',
  what:'El costo mensual de infraestructura de la forma de alojar elegida, en cada una de las tres nubes, para cada cantidad de clientes.',
  how:'Cada línea es una nube (vea la leyenda). Cuanto más abajo, más económica. La escala vertical es logarítmica (cada raya vale 10 veces la anterior). Si una nube dice «incompleto», sus precios pendientes cuentan como 0 y su línea queda por debajo de la realidad.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof,k=['','A','B','C','D'][S.ui.arch];
   const all=CLOUD_IDS.map(id=>({k:'cl_'+id,l:CLOUDS[id].name+(CLOUDS[id].pending.length?' (incompleto)':''),short:id==='aws'?'AWS':id==='gcp'?'GCP':'Azure',c:CLOUDC[id],v:sc.map(n=>calc(n,pi,S,{cloud:id})[k])}));
   const vis=all.filter(s=>!(tog&&VH[s.k])); const last=sc.length-1;
   return {legend:legendHtml(all,tog),svg:vis.length?svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo mensual de infraestructura en cada nube',xname:'Con',dec:0}):'<p class="small">Active al menos una línea en la leyenda.</p>',
    note:`Forma ${k} con ${int(sc[last])} clientes: ${all.map(s=>`${s.l} ${vf(s.v[last])}`).join(' · ')} al mes. Solo cambia la infraestructura; lo demás cuesta igual en cualquier nube.`,
    table:tbl(['Clientes',...all.map(s=>s.l)],sc.map((n,i)=>[int(n),...all.map(s=>vf(s.v[i]))]))}; }},
 {id:'aws',title:'Las cuatro formas de alojar (nube elegida)',
  what:'El costo mensual de infraestructura según cómo se aloje XiGOS, para cada cantidad de clientes.',
  how:'Cada línea es una forma de alojar (vea la leyenda). Cuanto más abajo, más económica. La escala vertical es logarítmica (cada raya vale 10 veces la anterior) para poder ver todas juntas.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S));
   const tg=CL().tag; const all=[{k:'A',l:tg[1],short:'A',c:ARCHC.A,v:os.map(o=>o.A)},{k:'B',l:tg[2],short:'B',c:ARCHC.B,v:os.map(o=>o.B)},{k:'C',l:tg[3],short:'C',c:ARCHC.C,v:os.map(o=>o.C)},{k:'D',l:tg[4],short:'D',c:ARCHC.D,v:os.map(o=>o.D)}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const l=os[os.length-1];
   return {legend:legendHtml(all,tog),svg:svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo mensual de infraestructura por forma de alojar',xname:'Con',dec:0}),
    note:`Con ${int(sc[sc.length-1])} clientes: A cuesta ${vf(l.A)}, B ${vf(l.B)}, C ${vf(l.C)} y D ${vf(l.D)} al mes. A junta todo en un solo servidor, sin alta disponibilidad.`,
    table:tbl(['Clientes',tg[1],tg[2],tg[3],tg[4]],sc.map((n,i)=>[int(n),vf(os[i].A),vf(os[i].B),vf(os[i].C),vf(os[i].D)]))}; }},
 {id:'trafico',title:'TomTom y HERE según las zonas vigiladas',
  what:'Cuánto cuesta cada proveedor de tráfico según cuántas zonas del mapa (celdas) se vigilan.',
  how:'Cada punto es una cantidad de zonas (abajo). Cada línea es un proveedor. Se ve dónde uno empieza a costar más que el otro y cómo suma el respaldo.',
  build:(tog)=>{ const cells=[1,3,6,12,30,100,250,450]; const g=S.g,bk=g.backup_pct/100,cpm=43200/g.interval_traffic;
   const cost=c=>{ const calls=c*cpm, tc=g.backup_primary===1?calls:calls*bk, hc=g.backup_primary===1?calls*bk:calls; return {tt:tierTTeur(tc,S.t)*S.t.eurusd,here:tierHere(hc,S.t)}; };
   const cs=cells.map(cost); const all=[{k:'tt',l:'TomTom'+(g.backup_primary===1?' (principal)':' (respaldo)'),short:'TomTom',c:PAL.infra,v:cs.map(x=>x.tt)},{k:'here',l:'HERE'+(g.backup_primary===1?' (respaldo)':' (principal)'),short:'HERE',c:PAL.traffic,v:cs.map(x=>x.here)},{k:'sum',l:'Los dos juntos',short:'Total',c:PAL.other,v:cs.map(x=>x.tt+x.here)}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const l=cs[cs.length-1];
   return {legend:legendHtml(all,tog),svg:svgLines(cells,vis,{xlabel:'Zonas del mapa vigiladas (celdas)',aria:'Costo mensual de TomTom y HERE según zonas vigiladas',xname:'Con',dec:0}),
    note:`Con ${cells[cells.length-1]} zonas: TomTom ${vf(l.tt)} y HERE ${vf(l.here)} al mes (${vf(l.tt+l.here)} juntos). Con pocas zonas casi todo cae en la capa gratuita (HERE 5.000 y TomTom 2.500 consultas al mes).`,
    table:tbl(['Zonas','Consultas al mes (principal)','TomTom al mes','HERE al mes','Los dos al mes'],cells.map((c,i)=>[int(c),int(c*cpm),vf(cs[i].tt,2),vf(cs[i].here,2),vf(cs[i].tt+cs[i].here,2)]))}; }},
 {id:'analista',title:'Efecto del analista de inteligencia en el promedio',cond:()=>S.ui.analyst&&S.g.analyst_salary_cop>0,
  what:'Cómo cambia el costo promedio por cliente al sumar el sueldo del analista.',
  how:'La línea naranja es el promedio con el analista y la azul sin él. La diferencia es grande con pocos clientes y se achica al crecer, porque el sueldo se reparte entre más clientes.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const a=sc.map(n=>calc(n,pi,withS(s=>{s.ui.analyst=0;}))),b=sc.map(n=>calc(n,pi,withS(s=>{s.ui.analyst=1;})));
   const all=[{k:'sin',l:'Sin analista',short:'Sin',c:PAL.infra,v:a.map((o,i)=>o.total/sc[i])},{k:'con',l:'Con analista',short:'Con',c:PAL.traffic,v:b.map((o,i)=>o.total/sc[i])}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const i=sc.length-1;
   return {legend:legendHtml(all,tog),svg:svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo por cliente con y sin analista',xname:'Con',dec:2}),
    note:`Con ${int(sc[0])} cliente(s), el analista sube el promedio de ${vf(a[0].total/sc[0],2)} a ${vf(b[0].total/sc[0],2)} por cliente al mes; con ${int(sc[i])}, de ${vf(a[i].total/sc[i],2)} a ${vf(b[i].total/sc[i],2)}.`,
    table:tbl(['Clientes','Por cliente sin analista','Por cliente con analista','Aumento'],sc.map((n,k)=>[int(n),vf(a[k].total/n,2),vf(b[k].total/n,2),fmt((b[k].total/a[k].total-1)*100,0)+' %']))}; }}
];
function chartCard(ch,interactive){
 if(ch.cond&&!ch.cond()) return '';
 const r=ch.build(interactive);
 return `<div class="chart"><h3>${ch.title}</h3><p class="what"><b>Qué muestra:</b> ${ch.what}</p><p class="how"><b>Cómo leerla:</b> ${ch.how}</p>${r.legend}<div class="plot">${r.svg}</div><div class="insight">${r.note}</div>
 ${interactive?`<details data-k="${ch.id}" ${VO[ch.id]?'open':''}><summary>Ver los datos de esta gráfica en tabla</summary>${r.table}</details>`:''}</div>`;
}
