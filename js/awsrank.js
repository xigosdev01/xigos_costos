/* ============================================================
   ALOJAMIENTO EN AWS: tarjetas A/B/C/D, orden por criterios, recomendación y cuándo escalar.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function archPick(){
 const N=S.ui.N,pi=S.ui.prof; const D={1:['A · Lightsail','Un solo servidor con todo adentro. La más económica, pero sin alta disponibilidad: si falla, todo se cae hasta restaurar.'],
  2:['B · EC2 + RDS','Servidores aparte para los programas y una base de datos administrada por AWS.'],
  3:['C · Alta disponibilidad','Como B pero duplicada en dos zonas de AWS: sigue funcionando si una falla.'],
  4:['D · Fargate + RDS','AWS administra cada contenedor por el equipo XiGOS (sin servidores que mantener), con base de datos RDS.']};
 const rk=archRank(N,pi), mn=Math.min(...rk.map(r=>r.cost));
 return `<h3>Tenemos 4 posibilidades para alojar XiGOS en AWS (la etiqueta #1 a #4 indica cuál es más recomendable)</h3>
 <p class="small">El orden combina costo, disponibilidad, respaldo, facilidad de operación y capacidad de crecer (detalle y pesos abajo). Toque una tarjeta para elegirla (o use el selector «Alojamiento en AWS»). El valor de cada una es solo el costo de servidores y AWS con el escenario actual (${int(N)} cliente(s)); el resto del resumen se recalcula con la que elija.</p>
 <div class="archs">${[...rk].sort((a,b)=>a.k-b.k).map(r=>{const i=rk.indexOf(r); return `<button type="button" class="archc ${S.ui.arch===r.k?'on':''}" data-arch="${r.k}" aria-pressed="${S.ui.arch===r.k}"><b>${D[r.k][0]}</b><span class="pills"><i class="rank">Puesto ${i+1} de 4</i>${i===0?'<i class="best">recomendada hoy</i>':''}${r.cost===mn?'<i class="best" style="background:#6b7a99">la más económica</i>':''}</span><span>${D[r.k][1]}</span><em>${usd(r.cost,0)} al mes<br><small>${usd(r.cost*12,0)} al año · puntaje ${fmt(r.total,1)} de 5</small></em></button>`;}).join('')}</div>
 ${outRecommend(N,pi)}
 <details><summary>Ver por qué quedó en ese orden y cuándo pasar a otra opción</summary>${outRank(N,pi)}${outScale(N,pi)}</details>`;
}
/* ----- Orden de las alternativas de AWS: puntaje de 1 a 5 por criterio (criterio del analista, ver tabla) ----- */
const ARCH_SC={ 1:{avail:1,backup:2,ops:2,scale:2}, 2:{avail:2,backup:4,ops:3,scale:4}, 3:{avail:5,backup:5,ops:3,scale:5}, 4:{avail:3,backup:4,ops:5,scale:4} };
const ARCH_WHY={ 1:{avail:'Un solo servidor: si falla, todo se cae hasta restaurar (horas).',backup:'Copia diaria con script propio hacia S3.',ops:'Su equipo administra todo (parches, restauración).',scale:'Al llenarse hay que sumar servidores a mano.'},
 2:{avail:'Varios servidores en una zona; la base (RDS) en una sola zona.',backup:'RDS respalda solo y permite volver a un momento exacto, además de S3.',ops:'AWS cuida la base de datos; usted cuida los servidores.',scale:'Se agregan servidores y bases con facilidad.'},
 3:{avail:'Dos zonas de AWS y base con copia en vivo: sigue si una zona falla.',backup:'Copia en vivo en otra zona + respaldos de RDS + S3.',ops:'Como B, con más piezas que vigilar.',scale:'Diseñada para crecer.'},
 4:{avail:'AWS reinicia los contenedores que fallan; la base sigue en una sola zona.',backup:'Igual que B (RDS + S3).',ops:'No hay servidores que administrar.',scale:'Cada contenedor se multiplica por separado.'} };
function archRank(N,pi){
 const g=S.g, w={cost:g.rk_cost,avail:g.rk_avail,backup:g.rk_backup,ops:g.rk_ops,scale:g.rk_scale}; const ws=(w.cost+w.avail+w.backup+w.ops+w.scale)||1;
 const os=[1,2,3,4].map(k=>calc(N,pi,S,{arch:k}).infra), mn=Math.min(...os);
 return [1,2,3,4].map((k,i)=>{ const sc=ARCH_SC[k], sCost=Math.max(0,Math.min(5,5*mn/os[i]));
  return {k,cost:os[i],sCost,...sc,total:(sCost*w.cost+sc.avail*w.avail+sc.backup*w.backup+sc.ops*w.ops+sc.scale*w.scale)/ws}; }).sort((a,b)=>b.total-a.total);
}
function srvSizes(){ const R=ramSums(S),u=S.g.usable; return [[4,S.t.ls_4],[8,S.t.ls_8],[16,S.t.ls_16],[32,S.t.ls_32]].map(([gb,p])=>({gb,p,maxN:Math.max(0,Math.floor((u*gb-R.hA)/R.A))})); }
function outRecommend(N,pi){
 const sz=srvSizes(), pick=sz.find(s=>N<=s.maxN), o=calc(N,pi,S);
 const names={1:'A · Lightsail',2:'B · EC2 + RDS',3:'C · Alta disponibilidad',4:'D · Fargate + RDS'};
 let txt;
 if(pick) txt=`Para <b>${int(N)} cliente(s)</b>: la opción <b>A · Lightsail</b> con un servidor de <b>${pick.gb} GB</b> (${usd(pick.p)} al mes por el servidor; ≈ <b>${usd(o.A,0)}</b> al mes con respaldos en S3, DNS y el hub incluidos). Alcanza para el hub y las instancias; si el servidor falla, la caída dura hasta restaurar la copia (horas). Para un solo cliente es lo razonable: las otras opciones cuestan entre ${fmt(Math.min(o.B,o.C,o.D)/o.A,0)} y ${fmt(Math.max(o.B,o.C,o.D)/o.A,0)} veces más y solo se justifican si el cliente exige alta disponibilidad.`;
 else txt=`Con <b>${int(N)} clientes</b> ya no caben en un solo servidor Lightsail (el máximo de 32 GB admite ${sz[3].maxN}). Conviene evaluar la opción <b>B · EC2 + RDS</b> (o repartir A en ${o.A_servers} servidores).`;
 return `<div class="box ok"><b>¿Cuál AWS es recomendable?</b> ${txt}</div>`;
}
function outRank(N,pi){
 const rk=archRank(N,pi), g=S.g, names={1:'A · Lightsail',2:'B · EC2 + RDS',3:'C · Alta disponibilidad',4:'D · Fargate + RDS'};
 const cell=(r,c)=>`${r[c]}<div class="small">${ARCH_WHY[r.k][c]}</div>`;
 return `<h3>Orden de las alternativas de AWS (con ${int(N)} cliente(s))</h3>
 <div class="scroll"><table><tr><th class="l">Puesto</th><th class="l">Alojamiento</th><th>Costo (${CU()}/mes)</th><th>Valor / costo (peso ${g.rk_cost})</th><th>Disponibilidad (peso ${g.rk_avail})</th><th>Respaldo (peso ${g.rk_backup})</th><th>Facilidad de operar (peso ${g.rk_ops})</th><th>Crecer (peso ${g.rk_scale})</th><th>Puntaje (de 5)</th></tr>
 ${[...rk].sort((a,b)=>a.k-b.k).map(r=>{const i=rk.indexOf(r); return `<tr><td class="l"><b>#${i+1}</b></td><td class="l"><b>${names[r.k]}</b></td><td>${m(r.cost,0)}</td><td>${fmt(r.sCost,1)}<div class="small">5 = la de menor costo</div></td><td class="l">${cell(r,'avail')}</td><td class="l">${cell(r,'backup')}</td><td class="l">${cell(r,'ops')}</td><td class="l">${cell(r,'scale')}</td><td><b>${fmt(r.total,2)}</b></td></tr>`;}).join('')}</table></div>
 <p class="small">Los puntajes de 1 a 5 son un <b>criterio del analista</b> (no un dato medido); el de costo se calcula solo comparando con la más económica. Los pesos se pueden cambiar en Configuración → Alojamiento y contenedores. Si el contrato exige alta disponibilidad, suba el peso de «Disponibilidad» y el orden cambia.</p>`;
}
function outScale(N,pi){
 const sz=srvSizes(), R=ramSums(S), g=S.g, o=calc(N,pi,S), nA=sz[3].maxN+1;
 return `<h3>¿Cuándo pasar a otra opción de AWS?</h3>
 <p>No hay un único número mágico: se pasa cuando se cumple <b>cualquiera</b> de estos criterios.</p>
 <div class="scroll"><table><tr><th class="l">Criterio</th><th class="l">Umbral</th><th class="l">Qué hacer</th></tr>
 <tr><td class="l"><b>1. El servidor se llena</b> (cantidad de clientes)</td><td class="l">Cada cliente reserva ≈ ${fmt(R.A,2)} GB de memoria y el hub ≈ ${fmt(R.hA,1)} GB. Un Lightsail de 4 GB alcanza hasta <b>${sz[0].maxN}</b> cliente(s), 8 GB hasta <b>${sz[1].maxN}</b>, 16 GB hasta <b>${sz[2].maxN}</b> y 32 GB hasta <b>${sz[3].maxN}</b>.</td><td class="l">Subir de tamaño dentro de A. A partir de <b>${nA} clientes</b> haría falta más de un servidor: evaluar <b>B</b>.</td></tr>
 <tr><td class="l"><b>2. Muchas bases de datos</b></td><td class="l">Un RDS aguanta ≈ ${g.dbs_per_rds} bases (supuesto): se llega con <b>${g.dbs_per_rds} clientes</b> (hub + clientes).</td><td class="l">Pasar a <b>B</b> para que AWS administre la base.</td></tr>
 <tr><td class="l"><b>3. Un contrato exige disponibilidad (SLA)</b></td><td class="l">Si un cliente no tolera horas de caída o pide una disponibilidad escrita.</td><td class="l">Pasar a <b>C</b> (dos zonas) para ese requisito.</td></tr>
 <tr><td class="l"><b>4. Respaldo y recuperación</b></td><td class="l">Si perder hasta un día de datos es inaceptable.</td><td class="l"><b>B</b> o <b>C</b>: RDS permite volver a un momento exacto.</td></tr>
 <tr><td class="l"><b>5. Falta de equipo técnico</b></td><td class="l">Si nadie puede administrar servidores (parches, restauraciones).</td><td class="l"><b>D</b> (AWS administra los contenedores) o <b>B</b>.</td></tr>
 <tr><td class="l"><b>6. Qué tanto cuesta el cambio</b></td><td class="l">Con ${int(N)} cliente(s): A ${usd(o.A,0)} · B ${usd(o.B,0)} · C ${usd(o.C,0)} · D ${usd(o.D,0)} al mes.</td><td class="l">Pase a otra opción solo si el requisito justifica la diferencia.</td></tr></table></div>
 <p class="small">Para la previsión actual (≈ 4 clientes en 12 meses) ninguno de los criterios 1 y 2 se cumple; el 3–5 depende de lo que pida cada cliente.</p>`;
}
function outKpi(){
 const N=S.ui.N,o=calc(N,S.ui.prof,S);
 const items=[{l:'Servidores y AWS',v:o.infra,c:COLORS.infra},{l:'Datos de tráfico (HERE + TomTom)',v:o.traffic,c:COLORS.traffic},{l:'Otros proveedores',v:o.other-o.gps,c:COLORS.other},{l:'Dispositivos (equipo, SIM, plataforma)',v:o.gps,c:COLORS.gps},{l:'Personal',v:o.staff,c:COLORS.support}];
 return `<div class="cards"><div class="card big"><b>${usd(o.total,0)}</b><span>Total aproximado por mes (≈ ${cop(o.total)})</span></div>
 <div class="card"><b>${usd(o.tech,0)}</b><span>Solo «costo duro» por mes (≈ ${cop(o.tech)})</span></div>
 <div class="card"><b>${usd(o.total/N,2)}</b><span>Por cliente al mes</span></div><div class="card"><b>${usd(o.total*12,0)}</b><span>Por año (≈ ${cop(o.total*12)})</span></div></div>${barHtml(items)}`;
}
