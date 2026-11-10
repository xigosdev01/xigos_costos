/* ============================================================
   ALOJAMIENTO EN LA NUBE (AWS, Google Cloud o Azure): tarjetas A/B/C/D, orden por criterios, recomendación, cuándo escalar y comparación entre nubes.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function archDesc(){ const l=CL().l, n=CL().name, T=CL().tag;
 return {1:[T[1],'Un solo servidor con todo adentro, sin alta disponibilidad: si falla, todo se cae hasta restaurar.'],
  2:[T[2],`Servidores aparte para los programas y una base de datos administrada (${l.db}).`],
  3:[T[3],`Como B pero duplicada en dos ${l.zones}: sigue funcionando si una falla.`],
  4:[T[4],`${n} administra cada contenedor (${l.ctr}) por el equipo XiGOS, sin servidores que mantener, con base de datos ${l.db}.`]}; }
function archPick(){
 const N=S.ui.N,pi=S.ui.prof; const D=archDesc();
 const rk=archRank(N,pi), mn=Math.min(...rk.map(r=>r.cost));
 return `<h3>Tenemos 4 posibilidades para alojar XiGOS en ${CLS()} (la etiqueta #1 a #4 indica cuál es más recomendable)</h3>
 <p class="small">El orden combina costo, disponibilidad, respaldo, facilidad de operación y capacidad de crecer (detalle y pesos abajo). Toque una tarjeta para elegirla (o use el selector «Alojamiento en ${CLS()}»). El valor de cada una es solo el costo de servidores y ${CLS()} con el escenario actual (${int(N)} cliente(s)); el resto del resumen se recalcula con la que elija. Para cambiar de nube use el botón flotante «Nube» de la derecha (está siempre a la mano).</p>
 ${cloudNote()}
 <div class="archs">${[...rk].sort((a,b)=>a.k-b.k).map(r=>{const i=rk.indexOf(r); return `<button type="button" class="archc ${S.ui.arch===r.k?'on':''}" data-arch="${r.k}" aria-pressed="${S.ui.arch===r.k}"><b>${D[r.k][0]}</b><span class="pills"><i class="rank">Puesto ${i+1} de 4</i>${i===0?'<i class="best">recomendada hoy</i>':''}${r.cost===mn?'<i class="best" style="background:#6b7a99">la más económica</i>':''}</span><span>${D[r.k][1]}</span><em>${usd(r.cost,0)} al mes<br><small>${usd(r.cost*12,0)} al año · puntaje ${fmt(r.total,1)} de 5</small></em></button>`;}).join('')}</div>
 ${outRecommend(N,pi)}
 <details open><summary>Comparar las tres nubes (AWS, Google Cloud y Azure)</summary>${outClouds(N,pi)}</details>
 <details><summary>Ver por qué quedó en ese orden y cuándo pasar a otra opción</summary>${outRank(N,pi)}${outScale(N,pi)}</details>`;
}
/* ----- Comparación de las tres nubes con el mismo escenario (solo infraestructura: lo demás no depende de la nube) ----- */
function outClouds(N,pi){
 N=N||S.ui.N; pi=pi===undefined?S.ui.prof:pi;
 const os={}; for(const id of CLOUD_IDS) os[id]=calc(N,pi,S,{cloud:id});
 const all=[]; for(const id of CLOUD_IDS) for(const k of ['A','B','C','D']) all.push(os[id][k]);
 const mn=Math.min(...all.filter(x=>x>0));
 const c=(v)=>`${v===mn?'<b>':''}${m(v,0)}${v===mn?'</b>':''}`;
 const flag=id=>CLOUDS[id].pending.length?' <span class="small">(mínimo: faltan precios)</span>':'';
 const rows=CLOUD_IDS.map(id=>`<tr><td class="l"><b>${CLOUDS[id].name}</b>${id===S.ui.cloud?' <span class="small">(elegida)</span>':''}${flag(id)}</td>${['A','B','C','D'].map(k=>`<td>${c(os[id][k])}</td>`).join('')}<td class="l small">${CLOUDS[id].conf}</td></tr>`).join('');
 const sc=S.ui.scales, arch=['','A','B','C','D'][S.ui.arch];
 const rows2=sc.map(n=>{ const v=CLOUD_IDS.map(id=>calc(n,pi,S,{cloud:id})[arch]); const lo=Math.min(...v.filter(x=>x>0)); return `<tr><td class="l">${int(n)}</td>${v.map(x=>`<td>${x===lo?'<b>'+m(x,0)+'</b>':m(x,0)}</td>`).join('')}</tr>`; }).join('');
 return `<p class="small">Mismo escenario (${int(N)} cliente(s), operación ${PROF_NAMES[pi]}) y las mismas 4 formas de alojar. Solo cambia la factura de infraestructura (servidores, bases, red, respaldos): el tráfico, los proveedores, los dispositivos y el personal cuestan igual en cualquier nube.</p>
 <div class="scroll"><table><tr><th class="l">Nube</th><th>A · un servidor (${CU()}/mes)</th><th>B · servidores + base (${CU()}/mes)</th><th>C · alta disponibilidad (${CU()}/mes)</th><th>D · contenedores (${CU()}/mes)</th><th class="l">Confianza de los precios</th></tr>${rows}</table></div>
 <h3>Forma elegida (${ARCH[S.ui.arch].split(' · ')[0]}) según el número de clientes (${CU()}/mes)</h3>
 <div class="scroll"><table><tr><th class="l">Clientes</th>${CLOUD_IDS.map(id=>`<th>${CLOUDS[id].name}</th>`).join('')}</tr>${rows2}</table></div>
 <div class="box info"><b>Cómo leer esta tabla:</b> en negrita, el menor valor. En la forma A, AWS Lightsail es un paquete «todo incluido» que Google y Azure no tienen: allí se suman máquina + disco + IP + transferencia. Los servidores no rinden igual (CPU compartida o «de ráfaga» en varios), por lo que conviene una prueba de carga real antes de decidir.${CLOUD_IDS.filter(id=>CLOUDS[id].pending.length).map(id=>` <b>${CLOUDS[id].name} tiene precios PENDIENTES</b> (${CLOUDS[id].pending.join(', ')}): sus formas B, C y D salen <u>por debajo de la realidad</u>.`).join('')} Detalle de pros, contras y fuentes en el documento <code>13-comparativa-nubes-aws-gcp-azure.md</code>.</div>
 ${['gcp','azure'].filter(id=>id!==S.ui.cloud).map(id=>cloudNote(id)).join('')}`;
}
/* ----- Orden de las alternativas: puntaje de 1 a 5 por criterio (criterio del analista, ver tabla; es el mismo para las tres nubes) ----- */
const ARCH_SC={ 1:{avail:1,backup:2,ops:2,scale:2}, 2:{avail:2,backup:4,ops:3,scale:4}, 3:{avail:5,backup:5,ops:3,scale:5}, 4:{avail:3,backup:4,ops:5,scale:4} };
function archWhy(){ const l=CL().l, aws=S.ui.cloud==='aws';
 const pit=aws?`${l.db} respalda solo y permite volver a un momento exacto, además de ${l.store}.`:`${l.db} hace respaldos automáticos (confirmar en ${CLS()} hasta cuántos días y la restauración a un momento exacto), además de ${l.store}.`;
 return { 1:{avail:'Un solo servidor: si falla, todo se cae hasta restaurar (horas).',backup:`Copia diaria con script propio hacia ${l.store}.`,ops:'Su equipo administra todo (parches, restauración).',scale:'Al llenarse hay que sumar servidores a mano.'},
 2:{avail:`Varios servidores en una zona; la base (${l.db}) en una sola zona.`,backup:pit,ops:`${CLS()} cuida la base de datos; usted cuida los servidores.`,scale:'Se agregan servidores y bases con facilidad.'},
 3:{avail:`Dos ${l.zones} y base con copia en vivo: sigue si una zona falla.`,backup:`Copia en vivo en otra zona + respaldos de ${l.db} + ${l.store}.`,ops:'Como B, con más piezas que vigilar.',scale:'Diseñada para crecer.'},
 4:{avail:`${CLS()} reinicia los contenedores que fallan; la base sigue en una sola zona.`,backup:`Igual que B (${l.db} + ${l.store}).`,ops:'No hay servidores que administrar.',scale:'Cada contenedor se multiplica por separado.'} }; }
function archRank(N,pi){
 const g=S.g, w={cost:g.rk_cost,avail:g.rk_avail,backup:g.rk_backup,ops:g.rk_ops,scale:g.rk_scale}; const ws=(w.cost+w.avail+w.backup+w.ops+w.scale)||1;
 const os=[1,2,3,4].map(k=>calc(N,pi,S,{arch:k}).infra), mn=Math.min(...os);
 return [1,2,3,4].map((k,i)=>{ const sc=ARCH_SC[k], sCost=Math.max(0,Math.min(5,5*mn/os[i]));
  return {k,cost:os[i],sCost,...sc,total:(sCost*w.cost+sc.avail*w.avail+sc.backup*w.backup+sc.ops*w.ops+sc.scale*w.scale)/ws}; }).sort((a,b)=>b.total-a.total);
}
function srvSizes(){ const R=ramSums(S),u=S.g.usable,t=effT(S); return [[4,t.ls_4],[8,t.ls_8],[16,t.ls_16],[32,t.ls_32]].map(([gb,p])=>({gb,p,maxN:Math.max(0,Math.floor((u*gb-R.hA)/R.A))})); }
function outRecommend(N,pi){
 const sz=srvSizes(), pick=sz.find(s=>N<=s.maxN), o=calc(N,pi,S); const l=CL().l, T=CL().tag;
 const lo=Math.min(o.B,o.C,o.D), hi=Math.max(o.B,o.C,o.D);
 const others=lo>=o.A?`las otras opciones cuestan entre ${fmt(lo/o.A,1)} y ${fmt(hi/o.A,1)} veces más y solo se justifican si el cliente exige alta disponibilidad`:`alguna de las otras opciones cuesta menos que A con este escenario (ver la tabla de comparación); revise también que los precios pendientes de ${CLS()} no estén en 0`;
 let txt;
 if(pick) txt=`Para <b>${int(N)} cliente(s)</b>: la opción <b>${T[1]}</b> con un servidor de <b>${pick.gb} GB</b> (${usd(pick.p)} al mes por el servidor${S.ui.cloud==='aws'?'':' con su disco e IP'}; ≈ <b>${usd(o.A,0)}</b> al mes con respaldos en ${l.store}, DNS y el hub incluidos). Alcanza para el hub y las instancias; si el servidor falla, la caída dura hasta restaurar la copia (horas). Para un solo cliente es lo razonable: ${others}.`;
 else txt=`Con <b>${int(N)} clientes</b> ya no caben en un solo servidor (el máximo de 32 GB admite ${sz[3].maxN}). Conviene evaluar la opción <b>${T[2]}</b> (o repartir A en ${o.A_servers} servidores).`;
 return `<div class="box ok"><b>¿Cuál alojamiento de ${CLS()} es recomendable?</b> ${txt}</div>`;
}
function outRank(N,pi){
 const rk=archRank(N,pi), g=S.g, names=CL().tag, W=archWhy();
 const cell=(r,c)=>`${r[c]}<div class="small">${W[r.k][c]}</div>`;
 return `<h3>Orden de las alternativas de ${CLS()} (con ${int(N)} cliente(s))</h3>
 <div class="scroll"><table><tr><th class="l">Puesto</th><th class="l">Alojamiento</th><th>Costo (${CU()}/mes)</th><th>Valor / costo (peso ${g.rk_cost})</th><th>Disponibilidad (peso ${g.rk_avail})</th><th>Respaldo (peso ${g.rk_backup})</th><th>Facilidad de operar (peso ${g.rk_ops})</th><th>Crecer (peso ${g.rk_scale})</th><th>Puntaje (de 5)</th></tr>
 ${[...rk].sort((a,b)=>a.k-b.k).map(r=>{const i=rk.indexOf(r); return `<tr><td class="l"><b>#${i+1}</b></td><td class="l"><b>${names[r.k]}</b></td><td>${m(r.cost,0)}</td><td>${fmt(r.sCost,1)}<div class="small">5 = la de menor costo</div></td><td class="l">${cell(r,'avail')}</td><td class="l">${cell(r,'backup')}</td><td class="l">${cell(r,'ops')}</td><td class="l">${cell(r,'scale')}</td><td><b>${fmt(r.total,2)}</b></td></tr>`;}).join('')}</table></div>
 <p class="small">Los puntajes de 1 a 5 son un <b>criterio del analista</b> (no un dato medido; son los mismos para las tres nubes); el de costo se calcula solo comparando con la más económica. Los pesos se pueden cambiar en Configuración → Alojamiento y contenedores. Si el contrato exige alta disponibilidad, suba el peso de «Disponibilidad» y el orden cambia.</p>`;
}
function outScale(N,pi){
 const sz=srvSizes(), R=ramSums(S), g=S.g, o=calc(N,pi,S), nA=sz[3].maxN+1; const l=CL().l, T=CL().tag;
 return `<h3>¿Cuándo pasar a otra opción de ${CLS()}?</h3>
 <p>No hay un único número mágico: se pasa cuando se cumple <b>cualquiera</b> de estos criterios.</p>
 <div class="scroll"><table><tr><th class="l">Criterio</th><th class="l">Umbral</th><th class="l">Qué hacer</th></tr>
 <tr><td class="l"><b>1. El servidor se llena</b> (cantidad de clientes)</td><td class="l">Cada cliente reserva ≈ ${fmt(R.A,2)} GB de memoria y el hub ≈ ${fmt(R.hA,1)} GB. Un servidor de 4 GB alcanza hasta <b>${sz[0].maxN}</b> cliente(s), 8 GB hasta <b>${sz[1].maxN}</b>, 16 GB hasta <b>${sz[2].maxN}</b> y 32 GB hasta <b>${sz[3].maxN}</b>.</td><td class="l">Subir de tamaño dentro de A. A partir de <b>${nA} clientes</b> haría falta más de un servidor: evaluar <b>B</b>.</td></tr>
 <tr><td class="l"><b>2. Muchas bases de datos</b></td><td class="l">Un servidor de base de datos (${l.db}) aguanta ≈ ${g.dbs_per_rds} bases (supuesto): se llega con <b>${g.dbs_per_rds} clientes</b> (hub + clientes).</td><td class="l">Pasar a <b>B</b> para que ${CLS()} administre la base.</td></tr>
 <tr><td class="l"><b>3. Un contrato exige disponibilidad (SLA)</b></td><td class="l">Si un cliente no tolera horas de caída o pide una disponibilidad escrita.</td><td class="l">Pasar a <b>C</b> (dos zonas) para ese requisito.</td></tr>
 <tr><td class="l"><b>4. Respaldo y recuperación</b></td><td class="l">Si perder hasta un día de datos es inaceptable.</td><td class="l"><b>B</b> o <b>C</b>: la base administrada hace respaldos automáticos.</td></tr>
 <tr><td class="l"><b>5. Falta de equipo técnico</b></td><td class="l">Si nadie puede administrar servidores (parches, restauraciones).</td><td class="l"><b>D</b> (${CLS()} administra los contenedores) o <b>B</b>.</td></tr>
 <tr><td class="l"><b>6. Qué tanto cuesta el cambio</b></td><td class="l">Con ${int(N)} cliente(s): A ${usd(o.A,0)} · B ${usd(o.B,0)} · C ${usd(o.C,0)} · D ${usd(o.D,0)} al mes.</td><td class="l">Pase a otra opción solo si el requisito justifica la diferencia.</td></tr></table></div>
 <p class="small">Para la previsión actual (≈ 4 clientes en 12 meses) ninguno de los criterios 1 y 2 se cumple; el 3–5 depende de lo que pida cada cliente.</p>`;
}
function outKpi(){
 const N=S.ui.N,o=calc(N,S.ui.prof,S);
 const items=[{l:'Servidores y '+CLS(),v:o.infra,c:COLORS.infra},{l:'Datos de tráfico (HERE + TomTom)',v:o.traffic,c:COLORS.traffic},{l:'Otros proveedores',v:o.other-o.gps,c:COLORS.other},{l:'Dispositivos (equipo, SIM, plataforma)',v:o.gps,c:COLORS.gps},{l:'Personal',v:o.staff,c:COLORS.support}];
 return `<div class="cards"><div class="card big"><b>${usd(o.total,0)}</b><span>Total aproximado por mes (≈ ${cop(o.total)})</span></div>
 <div class="card"><b>${usd(o.tech,0)}</b><span>Solo «costo duro» por mes (≈ ${cop(o.tech)})</span></div>
 <div class="card"><b>${usd(o.total/N,2)}</b><span>Por cliente al mes</span></div><div class="card"><b>${usd(o.total*12,0)}</b><span>Por año (≈ ${cop(o.total*12)})</span></div></div>${barHtml(items)}`;
}
