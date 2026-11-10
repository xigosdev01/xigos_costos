/* ============================================================
   REPORTE IMPRESO: arma el PDF con lo marcado «En el reporte», tráfico, zonas y tarifas de AWS.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ----------------------------- Reporte (lo que se imprime) ----------------------------- */
function buildReport(){
 CW=700;
 const r=S.rep, o=calc(S.ui.N,S.ui.prof,S); let n=0; let h='';
 const H=t=>`<h2>${++n}. ${t}</h2>`;
 const when=new Date().toLocaleDateString('es-CO',{year:'numeric',month:'long',day:'numeric'});
 const sections=[];
 if(r.resumen) sections.push(`<section>${H('Resumen de costos')}${outSummary()}</section>`);
 if(r.graficas){ const gr=graficasReport(); if(gr) sections.push(`<section>${H('Gráficas')}${gr}</section>`); }
 if(r.personal&&(S.ui.analyst||S.ui.sd_on)) sections.push(`<section>${H('Personal')}${staffTable()}</section>`);
 if(r.diagrama) sections.push(`<section>${H('Cómo se conecta XiGOS y qué se cobra')}${outDiagram()}</section>`);
 if(r.glosario) sections.push(`<section>${H('Glosario sin tecnicismos')}${GLOSARIO}</section>`);
 const provIds=['traffic','ors','owm','eje','talkteam','osm','mail','push','wa','ows','wazeoff','apify','inrix','gmaps','gov'].filter(id=>r[id]);
 if(provIds.length){
  let b=`<section>${H('Proveedores y tarifas')}`;
  for(const id of provIds){
   if(id==='traffic') b+=`<h3>Tráfico vial: ${S.g.backup_primary===1?'TomTom principal, HERE respaldo':'HERE principal, TomTom respaldo'} (${fmt(S.g.backup_pct,0)} % de consultas al respaldo)</h3>${outTrafficCompare()}${outCellInfo()}${provReport(PBY.tomtom)}${provReport(PBY.here)}`;
   else if(id==='eje') b+=provReport(PBY.eje)+`<h3>Costos de los dispositivos GPS: equipos, SIM y plataforma</h3>${gpsTable()}`; else if(id==='talkteam') b+=`<div class="prov"><div class="h"><b>${PBY.talkteam.name}</b></div><div class="b"><p>${PBY.talkteam.what}</p><p>${PBY.talkteam.how}</p>${talkTable()}</div></div>`; else b+=provReport(PBY[id]);
  }
  sections.push(b+'</section>');
 }
 if(r.aws) sections.push(`<section>${H('Servidores en AWS')}<p>${SCENLINE()}</p>${FORMAS}${outRank(S.ui.N,S.ui.prof)}${outRecommend(S.ui.N,S.ui.prof)}${outScale(S.ui.N,S.ui.prof)}${outAws()}</section>`);
 if(r.containers) sections.push(`<section>${H('Costo de mantener cada contenedor')}${outContainers()}</section>`);
 if(r.conexiones) sections.push(`<section>${H('Conexiones entre contenedores')}${outConn()}<h3>Reglas de cobro de AWS</h3>${CONN_RULES()}</section>`);
 if(r.awsrates) sections.push(`<section>${H('Tarifas de AWS en São Paulo')}<table><tr><th class="l">Servicio</th><th class="l">¿Para qué sirve?</th><th class="l">¿Cómo cobra?</th><th>Precio (USD)</th></tr>${AWSROWS.map(([p,nm,w,hh])=>`<tr><td class="l"><b>${nm}</b></td><td class="l">${w}</td><td class="l">${hh}</td><td>${fmtN(get(p))}</td></tr>`).join('')}</table></section>`);
 if(r.proy||r.comp){
  let b=`<section>${H('Proyección por número de clientes')}<p class="small">${SCENLINE()}</p>`;
  if(r.proy) b+=projTable(S.ui.prof);
  if(r.comp) b+=`<h3>Las cuatro formas de alojar en AWS (USD al mes, solo infraestructura)</h3>${outArchs()}<h3>Las tres operaciones por cliente: pequeña, mediana y grande (al mes, total)</h3>${outProfs()}`;
  sections.push(b+'</section>');
 }
 if(r.supuestos) sections.push(`<section>${H('Supuestos y tamaños de uso')}<table><tr><th class="l">Supuesto</th><th class="l">Por qué importa</th><th>Valor</th></tr>${SUPS.map(([p,l,w])=>`<tr><td class="l">${l}</td><td class="l">${w}</td><td>${fmtN(get(p))}</td></tr>`).join('')}</table>
  <table><tr><th class="l">Operación por cliente</th><th>Pequeña</th><th>Mediana</th><th>Grande</th><th>Personalizada</th><th class="l">Por qué este valor</th></tr>${PROFROWS.map(([k,l,w])=>`<tr><td class="l">${l}</td>${[0,1,2,3].map(i=>`<td>${fmtN(S.p[k][i])}</td>`).join('')}<td class="l small">${w}</td></tr>`).join('')}</table>
  <p class="small">TRM ${fmt(S.t.trm)} COP por USD (datos.gov.co, 2026-11-06); EUR/USD ${S.t.eurusd} (BCE, 2026-11-06).</p></section>`);
 if(r.pendientes) sections.push(`<section>${H('Qué falta saber (no se inventó ningún valor)')}${PENDIENTES}</section>`);
 h=`<div class="rhead"><h1>Reporte de costos XiGOS</h1><div class="sub">Generado el ${when} · precios consultados el 2026-11-06 · TRM ${fmt(S.t.trm)} COP/USD · USD sin IVA · cifras aproximadas</div></div>`+(sections.join('')||'<p class="box">No hay secciones seleccionadas. Marque «En el reporte» en las fichas de la pestaña Configuración.</p>');
 return h;
}
const SCENLINE=()=>`Escenario: <b>${int(S.ui.N)} cliente(s)</b>, operación <b>${PROF_NAMES[S.ui.prof]}</b> por cliente, alojamiento <b>${ARCH[S.ui.arch]}</b>.`;
// Explica el tamaño de la zona consultada, el máximo permitido y cuántas zonas/consultas ahorra frente a la celda de referencia.
function outCellInfo(){
 const g=S.g, N=S.ui.N, pi=S.ui.prof; const o=calc(N,pi,S);
 const base=calc(N,pi,{...S,g:{...S.g,cell_deg_tt:CELL0_DEG,cell_deg_here:CELL0_DEG}});
 const km=d=>d*DEG_KM, ar=d=>km(d)*km(d);
 const over=(prov)=>degReq(g,prov)>degMax(g,prov)+1e-9;
 const row=(nm,prov,deg,cells)=>`<tr><td class="l"><b>${nm}</b></td><td>${fmt(degReq(g,prov),3)}°</td><td>${fmt(deg,3)}° ≈ ${fmt(km(deg),1)} km</td><td>${int(ar(deg))} km²</td><td>${prov==='weather'?'sin tope publicado':fmt(degMax(g,prov),3)+'° ≈ '+fmt(km(degMax(g,prov)),1)+' km'}</td><td>${fmt(cells,1)}</td></tr>`;
 const warn=['tt','here'].filter(over).map(p=>`<div class="box bad"><b>Atención (${p==='tt'?'TomTom':'HERE'}):</b> ${fmt(degReq(g,p),3)}° supera el máximo con el margen de ${fmt(g.cell_safety,0)} % (${fmt(degMax(g,p),3)}°). El cálculo usa ${fmt(degMax(g,p),3)}° para no pasarse del límite.</div>`).join('');
 return `${warn}<div class="scroll"><table><tr><th class="l">Zona de…</th><th>Escrito</th><th>Usado en el cálculo</th><th>Área</th><th>Máximo con margen</th><th>Zonas vigiladas (${int(N)} cliente(s))</th></tr>
 ${row('TomTom (tráfico)','tt',o.deg_tt,o.cells_tt)}${row('HERE (tráfico)','here',o.deg_here,o.cells_here)}${row('Clima (OpenWeatherMap)','weather',o.deg_weather,o.wcells)}</table></div>
 <div class="box info"><b>Máximo permitido:</b> TomTom acepta hasta <b>${int(TT_MAX_KM2)} km²</b> por petición (≈ ${fmt(Math.sqrt(TT_MAX_KM2)/DEG_KM,3)}°); con el margen de ${fmt(g.cell_safety,0)} % el tope es <b>${int(TT_MAX_KM2*safetyF(g))} km² ≈ ${fmt(degMax(g,'tt'),3)}°</b>.
 <br>HERE no publica un límite en su guía de la API v7; sus SDK usan 1° de ancho y alto (referencia <u>no oficial</u>), así que se usa ${fmt(HERE_REF_DEG,0)}° × el margen = ${fmt(degMax(g,'here'),3)}°. Cada proveedor puede tener su propio tamaño.
 <br>1° ≈ ${fmt(DEG_KM,1)} km. El tamaño anterior era ${fmt(CELL0_DEG,2)}° ≈ ${fmt(km(CELL0_DEG),1)} km.</div>
 <p class="small">Ahorro de tráfico frente a las zonas anteriores de ${fmt(CELL0_DEG,2)}° (≈ 28 km): <b>${usd(base.traffic-o.traffic)}</b> al mes. Se asume que el territorio que vigila cada cliente (km²) es el mismo: con zonas más grandes hacen falta menos, con un mínimo de 1 por cliente.
 <b>Por verificar:</b> una zona más grande devuelve más incidentes por consulta (más datos por llamada) y cómo cuenta HERE sus transacciones; hay que probarlo con una consulta real, y el hub debe configurarse con el mismo tamaño para que este cálculo sea real.</p>`;
}
function outTrafficCompare(){
 const o=calc(S.ui.N,S.ui.prof,S); const g=S.g; const pr=g.backup_primary===1;
 const full=calc(S.ui.N,S.ui.prof,{...S,g:{...S.g,backup_pct:100}}); const only=calc(S.ui.N,S.ui.prof,{...S,g:{...S.g,backup_pct:0}});
 const rows=[['TomTom',pr?'Principal':'Respaldo',o.tt_calls,o.tomtom,S.t.tt_free],['HERE',pr?'Respaldo':'Principal',o.here_calls,o.here,S.t.here_free]];
 return `<table><tr><th class="l">Proveedor</th><th class="l">Rol</th><th>Consultas por hora (total)</th><th>Peticiones al mes</th><th>Gratis al mes</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CA()} al mes</th></tr>${rows.map(([n,r,c,u,fr])=>`<tr><td class="l">${n}</td><td class="l">${r}</td><td>${fmt(c/720,1)}</td><td>${int(c)}</td><td>${int(fr)}</td><td>${m(u)}</td><td>${m(u*12)}</td><td>${alt(u)}</td></tr>`).join('')}
 <tr><td class="l"><b>Total tráfico</b></td><td class="l"></td><td></td><td></td><td></td><td><b>${m(o.traffic)}</b></td><td><b>${m(o.traffic*12)}</b></td><td><b>${alt(o.traffic)}</b></td></tr></table>
 <p class="small">Con ≈ ${fmt(o.cells_tt,1)} zonas de TomTom (${fmt(o.deg_tt,2)}°) y ≈ ${fmt(o.cells_here,1)} de HERE (${fmt(o.deg_here,2)}°), ${fmt(S.g.qph_traffic,2)} consultas por hora por zona (una cada ${fmt(S.g.interval_traffic,1)} min). Si el respaldo se consultara el 100 % de las veces costaría ${usd(full.traffic,0)} al mes; si nunca se consultara, ${usd(only.traffic,0)}. Hoy el hub consulta ambos siempre (100 %).</p>`;
}

function ctrRow(c){
 const i=S.ctr.indexOf(c);
 const fg=c.fg?`${inp('ctr.'+i+'.cpu',0.05,'w')}</td><td>${inp('ctr.'+i+'.mem',0.25,'w')}`:`<span class="small">no aplica</span></td><td><span class="small">${c.db?'va en RDS':'—'}</span>`;
 return `<tr><td class="l"><b>${esc(c.name)}</b></td><td class="l">${esc(c.what)}</td><td>${inp('ctr.'+i+'.ram',0.05,'w')}</td><td>${fg}</td></tr>`;
}
const AWSROWS=[
 ['t.ls_4','Lightsail 4 GB (2 vCPU, 80 GB)','Servidor «todo incluido» para la opción A. Incluye IP pública y transferencia.','Precio fijo mensual (USD/mes)'],
 ['t.ls_8','Lightsail 8 GB','Servidor más grande de la opción A.','USD/mes'],['t.ls_16','Lightsail 16 GB','Idem.','USD/mes'],['t.ls_32','Lightsail 32 GB','Idem; al crecer se suman varios.','USD/mes'],
 ['t.ls_disk','Disco extra Lightsail','Más espacio si el servidor se llena de datos.','USD por GB al mes'],
 ['t.ec2_t3l','EC2 t3.large (8 GB)','Servidor donde corren los programas en B y C.','USD por hora (× 730 h al mes)'],
 ['t.rds_single','RDS PostgreSQL db.t4g.large','Base de datos administrada por AWS (B y D).','USD por hora'],['t.rds_multi','RDS Multi-AZ','Base de datos con copia de respaldo en vivo en otra zona (C).','USD por hora'],
 ['t.rds_gp3_s','Disco de RDS (una zona)','Espacio donde la base guarda los datos.','USD por GB al mes'],['t.rds_gp3_m','Disco de RDS (Multi-AZ)','Ídem con respaldo en vivo.','USD por GB al mes'],
 ['t.ebs_gp3','Disco EBS gp3','Disco de los servidores EC2.','USD por GB al mes'],
 ['t.fg_vcpu','Fargate: procesador','Cada contenedor administrado reserva procesador (D).','USD por vCPU-hora'],['t.fg_gb','Fargate: memoria','Cada contenedor administrado reserva memoria (D).','USD por GB-hora'],
 ['t.alb','Balanceador de carga (ALB): fijo','Reparte las visitas y pone el HTTPS (B, C, D).','USD por hora'],['t.lcu','Balanceador: capacidad usada (LCU)','Cobro por uso del balanceador.','USD por LCU-hora'],
 ['t.nat','Puerta de salida NAT: fija','Deja que contenedores privados salgan a Internet (C, D).','USD por hora'],['t.nat_gb','NAT: datos que pasan','Cobro por cada GB que sale por la puerta.','USD por GB'],
 ['t.ipv4','IP pública','Dirección visible en Internet de un servidor o balanceador.','USD por hora cada una'],
 ['t.dto','Transferencia de salida a Internet','Datos que AWS envía hacia afuera (páginas, PDF).','USD por GB (primer GB gratis)'],['t.inter_az','Tráfico entre zonas de AWS','Datos entre contenedores en zonas distintas (C).','USD por GB por sentido'],
 ['t.s3','S3: almacenamiento','Guarda los respaldos fuera del servidor.','USD por GB al mes'],['t.ecr','ECR: registro de imágenes','Guarda las «cajas» Docker (versiones).','USD por GB al mes'],
 ['t.cw_logs','CloudWatch Logs','Guarda los registros de funcionamiento para diagnosticar fallas.','USD por GB recibido'],
 ['t.r53_zone','Route 53: zona DNS','Traduce el nombre (ej. xigos.dominio.co) a la dirección del servidor.','USD por zona al mes'],['t.secret','Secrets Manager','Guarda claves y contraseñas de forma segura (opcional).','USD por clave al mes'],
 ['t.hours','Horas por mes','Convención de facturación de AWS.','horas']];
function awsTable(){ return AWSROWS.map(([p,n,w,h])=>`<tr><td class="l"><b>${n}</b></td><td class="l">${w}</td><td class="l">${h}</td><td>${inp(p,'any','w')}</td></tr>`).join(''); }

