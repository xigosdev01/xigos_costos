/* ============================================================
   SALIDAS DEL RESUMEN: tarjetas, tablas de costos, diagrama, AWS, contenedores, conexiones, proyección.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ----------------------------- Salidas (se recalculan) ----------------------------- */
const COLORS={infra:'#1f5fa8',traffic:'#d98c00',other:'#7b4fb0',gps:'#eda100',support:'#8a93a6'};
// Lo que sube el total al mes por UN dispositivo GPS adicional (equipo, SIM, plataforma de los proveedores + guardar sus posiciones).
function devMarginal(N,pi){ const o=calc(N,pi,S); return calc(N,pi,S,{gps_total:o.gps_devices+1}).total-o.total; }
function barHtml(items){ const tot=items.reduce((a,b)=>a+b.v,0)||1;
 return `<div class="bar">${items.filter(i=>i.v>0).map(i=>`<div style="width:${(i.v/tot*100).toFixed(1)}%;background:${i.c}" title="${i.l}: ${usd(i.v)}">${i.v/tot>0.07?fmt(i.v/tot*100,0)+'%':''}</div>`).join('')}</div>
 <div class="legend">${items.filter(i=>i.v>0).map(i=>`<span><i style="background:${i.c}"></i>${i.l}: <b>${usd(i.v,0)}</b> (${fmt(i.v/tot*100,0)} %)</span>`).join('')}</div>`; }

function sumTable(o,N,hard){
 const R=(a,b,v,bold)=>`<tr><td class="l">${bold?'<b>'+a+'</b>':a}</td><td class="l">${b}</td><td>${bold?'<b>'+m(v)+'</b>':m(v)}</td><td>${bold?'<b>'+m(v*12)+'</b>':m(v*12)}</td><td>${m(v/N)}</td></tr>`;
 const bk=S.g.backup_primary===1?'TomTom (principal) + HERE (respaldo)':'HERE (principal) + TomTom (respaldo)';
 return `<table><tr><th class="l">Concepto</th><th class="l">Qué incluye</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CU()} por cliente al mes</th></tr>
 ${R('Servidores y AWS',ARCH[S.ui.arch]+': '+Object.entries(o.infra_parts).filter(([k,v])=>v>0.005).map(([k,v])=>k.replace(/_/g,' ')+' '+usd(v,0)).join(' · '),o.infra)}
 ${R('Datos de tráfico',bk+', '+fmt(S.g.backup_pct,0)+' % de consultas al respaldo, sobre ≈ '+fmt(o.cells,0)+' celdas ('+int(o.traffic_calls)+' peticiones al mes al principal)',o.traffic)}
 ${R('Rutas excedentes, correo, mapas, WhatsApp, opcionales','Rutas sobre el cupo gratis '+usd(o.routing)+'; clima de pago '+usd(o.weather_cost)+'; correo '+usd(o.email,3)+' (hoy sale por Microsoft 365: no suma salvo que active SES o escriba la licencia); WhatsApp '+usd(o.whatsapp)+'; mapas '+usd(o.tiles)+'; opcionales activados '+usd(o.extras),o.other-o.gps)}
 ${R('Dispositivos: equipo, SIM y plataforma',int(o.gps_devices)+' GPS + '+int(o.bodycams)+' bodycams, según las fichas «Dispositivos GPS» y «Team Talk»'+(o.gps>0?'':' (en 0: faltan cotizaciones)'),o.gps)}
 ${R('Subtotal costo duro','Lo que realmente se paga a AWS y proveedores',hard,1)}
 ${o.analyst>0?R('Personal: analista de inteligencia',o.n_analysts+' analista(s) × COP '+fmt(S.g.analyst_salary_cop,0)+' al mes × factor '+fmt(S.g.analyst_factor,2)+' (≈ COP '+fmt(o.analyst*S.t.trm,0)+' al mes en total)',o.analyst):''}
 ${(o.support+o.devops)>0?R('Soporte técnico y operación (DevOps)',int(N*o.p.support_h)+' h de soporte + '+fmt(S.g.devops_base_h+N*S.g.devops_h_client,1)+' h de operación × US$ '+S.g.labor_rate+'/h (SUPUESTO)',o.support+o.devops):''}
 ${R('TOTAL','',o.total,1)}</table>${o.staff>0?'':'<p class="small">Por ahora <b>no se cuenta personal</b> (ni analista de inteligencia, ni soporte, ni DevOps). Actívelo en la ficha «Personal».</p>'}
 <h3>Pagos de una sola vez (no son mensuales)</h3>
 <table><tr><th class="l">Concepto</th><th class="l">Qué incluye</th><th>${CU()} (una vez)</th><th>${CA()} (una vez)</th></tr>
 ${o.onboarding>0?`<tr><td class="l">Instalación de los ${int(N)} clientes</td><td class="l">${fmt(o.onboarding/S.g.labor_rate,0)} horas × US$ ${S.g.labor_rate}/h (SUPUESTO)</td><td>${m(o.onboarding)}</td><td>${alt(o.onboarding)}</td></tr>`:''}
 ${o.gps_once>0?`<tr><td class="l">Dispositivos: equipos e instalación</td><td class="l">${int(o.gps_devices)} GPS + ${int(o.bodycams)} bodycams según las fichas de dispositivos</td><td>${m(o.gps_once)}</td><td>${alt(o.gps_once)}</td></tr>`:''}${(o.onboarding>0||o.gps_once>0)?'':'<tr><td colspan="4" class="l small">Sin pagos únicos incluidos por ahora.</td></tr>'}</table>`;
}
function outSummary(){
 const N=S.ui.N,pi=S.ui.prof,o=calc(N,pi,S); const ot=o.traffic+o.other;
 const items=[{l:'Servidores y AWS',v:o.infra,c:COLORS.infra},{l:'Datos de tráfico (HERE/TomTom)',v:o.traffic,c:COLORS.traffic},{l:'Otros proveedores',v:o.other-o.gps,c:COLORS.other},{l:'Dispositivos (equipo, SIM, plataforma)',v:o.gps,c:COLORS.gps},{l:'Personal',v:o.staff,c:COLORS.support}];
 const hard=o.tech;
 const pName=PROF_UP[pi];
 const share=x=>fmt(x/o.total*100,0);
 const devCost=(o.p.hours_day*3600*30/Math.max(o.p.gps_nominal,60))*S.g.row_bytes/1e9*(S.t.ebs_gp3+S.g.backup_factor*S.t.s3);
 const devM=devMarginal(N,pi);
 const gpsNote=o.gps>0?' Incluye el equipo, la SIM y la plataforma de los dispositivos (los asume Fortox).':' El equipo, la SIM y la plataforma de los dispositivos aún están en 0: faltan las cotizaciones en las fichas «Dispositivos GPS» y «Team Talk».';
 return `<div class="cards">
  <div class="card big"><b>${usd(o.total,0)}</b><span>Total aproximado por mes (≈ ${cop(o.total)})</span><em>Qué es: lo que costaría mantener XiGOS cada mes. Cómo se calcula: servidores y AWS + datos de tráfico + otros proveedores + dispositivos (equipo, SIM y plataforma) + el personal que usted active.</em></div>
  <div class="card"><b>${usd(hard,0)}</b><span>«Costo duro» por mes (≈ ${cop(hard)})</span><em>Qué es: solo lo que se paga a AWS y a proveedores, sin personal. Es dinero que sale sí o sí.</em></div>
  <div class="card"><b>${usd(o.total/N,2)}</b><span>Por cliente al mes (≈ ${cop(o.total/N)})</span><em>Cómo se calcula: total ÷ ${int(N)} cliente(s). Sirve para presupuestar cuánto cuesta atender a cada cliente.</em></div>
  <div class="card"><b>${usd(o.total*12,0)}</b><span>Por año (≈ ${cop(o.total*12)})</span><em>Cómo se calcula: total mensual × 12.</em></div>
  <div class="card wide"><b>${o.devices>0?usd(o.total/o.devices,2):'—'}</b><span>Costo promedio por dispositivo al mes (repartido)</span><em><b>Cómo entenderlo:</b> es como repartir la cuenta entre todos los dispositivos. Se toma el total de ${usd(o.total,0)} y se divide entre los ${int(o.devices)} dispositivos (${int(o.gps_devices)} GPS${o.bodycams>0?' y '+int(o.bodycams)+' bodycams':''})${o.devices>0?`: ${usd(o.total,0)} ÷ ${int(o.devices)} = ${usd(o.total/o.devices,2)}.`:'. Aún no hay dispositivos registrados: escriba sus cantidades en las fichas «Dispositivos GPS» y «Team Talk».'} <b>No es lo que cuesta un dispositivo:</b> un dispositivo GPS adicional agrega ≈ ${usd(devM,2)} al mes (su equipo, SIM y plataforma según los proveedores, más guardar sus posiciones). La cifra baja si hay más dispositivos porque los costos fijos (servidores, zonas del mapa, personal) se reparten entre más, y sube si hay pocos.${gpsNote}</em></div>
  ${o.onboarding>0?`<div class="card full"><b>${usd(o.onboarding,0)}</b><span>Instalación de los ${int(N)} clientes (una sola vez)</span><em>Pago único, no mensual: horas de instalación × tarifa por hora (supuesto).</em></div>`:''}</div>
 ${barHtml(items)}
 <div class="box info"><b>En palabras simples:</b> con <b>${int(N)} cliente(s)</b> de operación <b>${PROF_NAMES[pi]}</b> (${int(o.gps_devices)} dispositivos GPS${o.bodycams>0?' y '+int(o.bodycams)+' bodycams':''} en total) alojados en <b>${ARCH[S.ui.arch]}</b>, mantener XiGOS cuesta alrededor de <b>${usd(o.total,0)} al mes</b>. De cada 100 dólares, <b>${share(o.infra)}</b> se van en servidores y AWS, <b>${share(o.traffic)}</b> en datos de tráfico de proveedores, <b>${share(o.other-o.gps)}</b> en otros servicios, <b>${share(o.gps)}</b> en dispositivos (equipo, SIM y plataforma) y <b>${share(o.staff)}</b> en personal${o.staff>0?'':' (por ahora no se cuenta personal)'}. Un dispositivo GPS adicional agrega ≈ <b>${usd(devM,2)}</b> al mes.</div>
 ${sumTable(o,N,hard)}
 <div class="box"><b>Qué NO incluye este resumen:</b> los precios de equipo, SIM y plataforma de los dispositivos mientras estén en 0 (no tienen cotización pública: se escriben en las fichas «Dispositivos GPS» y «Team Talk»); video de las bodycams si no indica los GB; intermediario de WhatsApp; Microsoft 365; dominio (salvo que lo escriba); soporte de AWS; impuestos. ${S.ui.arch===4?'En Fargate tampoco el almacenamiento de PDF (EFS/S3).':''}</div>`;
}
function outDiagram(){
 return `<svg viewBox="0 0 960 400" width="100%" role="img" aria-label="Mapa de cómo se conecta XiGOS y qué se cobra">
 <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#5a6577"/></marker></defs>
 <style>text{font-family:Segoe UI,Arial;font-size:12px;fill:#1c2330}.t{font-weight:700;font-size:13px}.m{fill:#5a6577;font-size:11px}.r {fill:#b3261e;font-weight:700;font-size:11.5px}rect.b{fill:#fff;stroke:#7d8aa5;rx:8}rect.g{fill:#eef3fb;stroke:#a9c4ec;rx:10}rect.y{fill:#fff7e0;stroke:#d9b45a;rx:8}</style>
 <rect class="g" x="10" y="10" width="190" height="380"/><text class="t" x="22" y="32">Su cliente</text>
 <rect class="b" x="24" y="48" width="162" height="62"/><text x="34" y="70">Usuarios con el</text><text x="34" y="86">navegador (panel)</text><text class="m" x="34" y="102">mapas gratis de OSM</text>
 <rect class="b" x="24" y="150" width="162" height="70"/><text x="34" y="172">Dispositivos GPS y bodycams</text><text x="34" y="188">(equipo + SIM + plataforma)</text><text class="r" x="34" y="208">lo asume Fortox</text>
 <rect class="b" x="24" y="260" width="162" height="60"/><text x="34" y="282">Correo / Avisos</text><text class="m" x="34" y="298">M365 (ya pagado) · Web Push</text>
 <rect class="g" x="250" y="10" width="330" height="236"/><text class="t" x="262" y="32">Servidor en AWS · instancia de CADA cliente</text>
 <rect class="b" x="268" y="48" width="130" height="50"/><text x="278" y="68">web (panel)</text><text class="m" x="278" y="84">Fargate/servidor</text>
 <rect class="b" x="430" y="48" width="130" height="50"/><text x="440" y="68">api (cerebro)</text><text class="m" x="440" y="84">Fargate/servidor</text>
 <rect class="b" x="268" y="128" width="130" height="50"/><text x="278" y="148">worker (robot, no persona)</text><text class="m" x="278" y="164">PDF · avisos · GPS</text>
 <rect class="b" x="430" y="128" width="130" height="50"/><text x="440" y="148">base de datos</text><text class="m" x="440" y="164">dentro o RDS</text>
 <text class="r" x="262" y="214">Se paga: RAM/servidor, disco, respaldos (S3)</text><text class="r" x="262" y="232">Se paga por cada cliente</text>
 <rect class="g" x="250" y="270" width="330" height="120"/><text class="t" x="262" y="292">Hub XiGOS (UNO para todos)</text>
 <rect class="b" x="268" y="304" width="96" height="44"/><text x="278" y="324">hub-api</text><rect class="b" x="372" y="304" width="104" height="44"/><text x="382" y="324">collector</text><rect class="b" x="484" y="304" width="86" height="44"/><text x="494" y="324">hub-db</text>
 <text class="r" x="262" y="372">Costo fijo mensual compartido (no crece por cliente)</text>
 <rect class="y" x="650" y="10" width="300" height="380"/><text class="t" x="662" y="32">Proveedores externos</text>
 <rect class="b" x="664" y="46" width="272" height="44"/><text x="674" y="66">TomTom Traffic</text><text class="r" x="674" y="82">por petición · 2.500 gratis/mes</text>
 <rect class="b" x="664" y="98" width="272" height="44"/><text x="674" y="118">HERE Traffic</text><text class="r" x="674" y="134">por petición · 5.000 gratis/mes</text>
 <rect class="b" x="664" y="150" width="272" height="44"/><text x="674" y="170">OpenRouteService (rutas)</text><text class="m" x="674" y="186">gratis hasta 2.000/día</text>
 <rect class="b" x="664" y="202" width="272" height="44"/><text x="674" y="222">OpenWeatherMap (clima)</text><text class="m" x="674" y="238">gratis hasta 1 millón/mes</text>
 <rect class="b" x="664" y="254" width="272" height="52"/><text x="674" y="274">Plataformas GPS (API) y Team Talk</text><text class="r" x="674" y="294">precio no público · lo asume Fortox</text>
 <rect class="b" x="664" y="318" width="272" height="60"/><text x="674" y="335">WhatsApp (Meta)</text><text class="m" x="674" y="350">pendiente de implementación</text><text class="r" x="674" y="366">US$ 0,0008 por mensaje de utilidad</text>
 <path d="M186 79 L268 73" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M398 73 L430 73" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M495 98 L495 128" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M398 153 L430 153" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M420 246 L420 270" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M580 326 C 610 326 620 70 664 70" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M580 332 C 620 332 630 122 664 120" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M580 338 C 625 338 635 172 664 172" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M580 344 C 630 344 640 224 664 224" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M398 168 C 470 214 600 270 664 280" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M186 185 L664 280" stroke="#9aa5bd" stroke-dasharray="4 4" fill="none"/>
 <path d="M268 160 C 230 280 210 290 186 290" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 </svg><p class="small">Las líneas muestran quién le pregunta a quién. Lo marcado en rojo es lo que genera costo. Los GPS pasan por la plataforma de su proveedor y XiGOS consulta sus posiciones por API; las bodycams usan la app Team Talk de Movistar. Fortox asume el costo de equipos y plataformas.</p>`;
}
function outAws(){
 const N=S.ui.N,pi=S.ui.prof,o=calc(N,pi,S); const arch=S.ui.arch;
 const names={servidores:'Servidor(es) Lightsail',disco_extra:'Disco extra',respaldos:'Respaldos en S3',dns_dominio:'DNS (Route 53) y dominio',servidores_ec2:'Servidores EC2',discos_ebs:'Discos de los servidores (EBS)',ip_publica_servidores:'IP públicas de servidores',
  base_rds:'Base de datos RDS',base_rds_multi_az:'Base de datos RDS Multi-AZ',almacenamiento_rds:'Disco de la base de datos',balanceador_alb:'Balanceador (cargo fijo)',balanceador_lcu:'Balanceador (por uso)',ip_publica_alb:'IP públicas del balanceador',
  nat_hora:'Puerta de salida NAT (fijo)',nat_datos:'NAT (por GB que pasa)',transferencia_salida:'Transferencia de salida a Internet',entre_zonas:'Tráfico entre zonas',logs_cloudwatch:'Registros (CloudWatch)',ecr:'Registro de imágenes (ECR)',
  secretos:'Secrets Manager',contenedores_fargate_clientes:'Contenedores Fargate de los clientes',contenedores_fargate_hub:'Contenedores Fargate del hub'};
 const rows=Object.entries(o.infra_parts).filter(([k,v])=>Math.abs(v)>0.0049).map(([k,v])=>`<tr><td class="l">${names[k]||k}</td><td>${m(v)}</td><td>${m(v*12)}</td><td>${m(v/N)}</td><td>${fmt(v/o.infra*100,0)} %</td></tr>`).join('');
 const sv={1:`${o.A_servers} servidor(es) Lightsail`,2:`${o.B_napp} servidor(es) EC2 + ${o.B_rds} RDS`,3:`${o.B_napp*2} servidores EC2 (2 zonas) + ${o.B_rds} RDS Multi-AZ`,4:`${N*3+3} contenedores Fargate + ${o.B_rds} RDS`}[arch];
 return `<h3>Resultado: cuenta de AWS para ${int(N)} cliente(s): ${ARCH[arch]} → <u>${usd(o.infra,0)} al mes</u></h3><p>Se necesitan ≈ ${sv}.</p>
 <table><tr><th class="l">Concepto de AWS</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CU()} por cliente al mes</th><th>% del total AWS</th></tr>${rows}<tr><td class="l"><b>Total AWS</b></td><td><b>${m(o.infra)}</b></td><td><b>${m(o.infra*12)}</b></td><td><b>${m(o.infra/N)}</b></td><td>100 %</td></tr></table>`;
}
// Reparte el costo de los servidores entre contenedores (según memoria) y devuelve el costo de UNA instancia y del HUB por mes.
function ctrCosts(N,o,arch){
 const t=S.t,g=S.g,H=t.hours; const R=ramSums(S);
 let perGB=0,desc='';
 if(arch===1){ perGB=o.A_parts.servidores/o.A_need; desc=`Servidores Lightsail (${usd(o.A_parts.servidores)}) repartidos según la memoria que usa cada contenedor (≈ ${usd(perGB)} por GB al mes, ya con holgura).`; }
 else if(arch===2||arch===3){ const p=arch===2?o.B_parts:o.C_parts; perGB=(p.servidores_ec2+p.discos_ebs+(p.ip_publica_servidores||0))/(R.hB+N*R.B); desc=`Servidores EC2 repartidos según memoria (≈ ${usd(perGB)} por GB al mes). La base de datos va en RDS: cada una cuesta (RDS + disco) ÷ nº de bases.`; }
 else desc='Cada contenedor Fargate se cobra exacto por su procesador y memoria reservados, encendido las 730 h del mes.';
 const rdsPer=(arch===1)?null:((arch===2?o.B_parts:arch===3?o.C_parts:o.D_parts));
 const rdsEach= rdsPer? ((rdsPer.base_rds||rdsPer.base_rds_multi_az)+rdsPer.almacenamiento_rds)/(1+N):0;
 const cost=(c)=>{
  if(arch===4){ if(c.fg) return c.fg===2? (c.cpu*t.fg_vcpu+c.mem*t.fg_gb)*(g.migrate_min/60) : (c.cpu*t.fg_vcpu+c.mem*t.fg_gb)*H; if(c.db) return rdsEach; return 0; }
  if(arch===1) return c.ram*perGB;
  if(c.db) return rdsEach; return c.ram*perGB; };
 const inst=S.ctr.filter(c=>c.scope==='inst'), hub=S.ctr.filter(c=>c.scope==='hub');
 return {cost,perGB,desc,inst,hub,sumI:inst.reduce((a,c)=>a+cost(c),0),sumH:hub.reduce((a,c)=>a+cost(c),0),R};
}
function outContainers(){
 const N=S.ui.N,pi=S.ui.prof,o=calc(N,pi,S); const arch=S.ui.arch; const t=S.t,g=S.g,H=t.hours;
 const {cost,desc,inst,hub,sumI,sumH,R}=ctrCosts(N,o,arch);
 const row=(c)=>{ const u=cost(c); const n=c.scope==='inst'?N:1; const note= (arch===4&&!c.fg&&!c.db)?'<span class="small"> (no corre en Fargate)</span>':(arch===4&&c.db?'<span class="small"> (en RDS)</span>':(arch!==1&&c.db?'<span class="small"> (en RDS)</span>':''));
  return `<tr><td class="l"><b>${esc(c.name)}</b>${note}</td><td class="l">${c.scope==='inst'?'por cada cliente':'uno para todos'}</td><td>${m(u)}</td><td>${m(u*12)}</td><td>${m(u*n)}</td><td>${m(u*n*12)}</td></tr>`; };
 // comparación de una instancia en cada alojamiento
 const fgI=o.D_fg_inst; const lsI=R.A*(o.A_parts.servidores/o.A_need); const dbShare=((o.D_parts.base_rds+o.D_parts.almacenamiento_rds)/(1+N));
 return `<h3>Cuánto cuesta mantener cada contenedor (${ARCH[arch]}, ${int(N)} clientes)</h3><p class="small">${desc}</p>
 <table><tr><th class="l">Contenedor</th><th class="l">Cuántos</th><th>${CU()} al mes cada uno</th><th>${CU()} al año cada uno</th><th>${CU()} al mes en total</th><th>${CU()} al año en total</th></tr>
 ${inst.map(row).join('')}<tr><td class="l"><b>Subtotal de UNA instancia (un cliente)</b></td><td class="l"></td><td><b>${m(sumI)}</b></td><td><b>${m(sumI*12)}</b></td><td><b>${m(sumI*N)}</b> (×${int(N)})</td><td><b>${m(sumI*N*12)}</b></td></tr>
 ${hub.map(row).join('')}<tr><td class="l"><b>Subtotal del hub</b></td><td class="l"></td><td><b>${m(sumH)}</b></td><td><b>${m(sumH*12)}</b></td><td><b>${m(sumH)}</b></td><td><b>${m(sumH*12)}</b></td></tr></table>
 <div class="box info"><b>Comparación para UNA instancia de cliente (servidor aparte de red y balanceador):</b> en un servidor compartido (A) ≈ <b>${usd(lsI)}</b> al mes; en Fargate (D) sus 3 contenedores encendidos todo el mes cuestan <b>${usd(fgI)}</b> más su parte de base de datos ≈ ${usd(dbShare)}. Fargate es mucho más caro para cajas pequeñas siempre encendidas; su ventaja es no administrar servidores.</div>`;
}
function outConn(){
 const N=S.ui.N,pi=S.ui.prof,o=calc(N,pi,S); const arch=S.ui.arch,t=S.t,H=t.hours;
 let egr=0,nat=0,intg=0; for(const c of S.conn){ if(c.net==='egress'){egr+=c.gb;} else if(c.net==='nat'){egr+=c.gb;nat+=c.gb;} else intg+=c.gb; }
 const rowsC=[];
 const add=(n,gb,cost,why)=>rowsC.push(`<tr><td class="l">${n}</td><td>${fmt(gb,1)}</td><td>${m(cost)}</td><td>${m(cost*12)}</td><td class="l">${why}</td></tr>`);
 for(const c of S.conn){ const gb=N*c.gb; let cst=0,why='';
  if(c.net==='int'){ cst=arch===3?gb*S.g.interaz_share*t.inter_az*2:0; why=arch===3?'Se cobra la parte que cruza entre zonas':'Gratis (mismo servidor/zona)'; }
  else { cst=arch===1?0:gb*t.dto+((arch===3||arch===4)&&c.net==='nat'?gb*t.nat_gb:0); why=arch===1?'Incluida en el plan de Lightsail':`Salida a Internet US$ ${t.dto}/GB`+(((arch===3||arch===4)&&c.net==='nat')?` + NAT US$ ${t.nat_gb}/GB`:''); }
  add(esc(c.name),gb,cst,why); }
 add('Hub (collector) ↔ proveedores de datos',o.hubnat_gb,(arch===3||arch===4)?o.hubnat_gb*t.nat_gb:0,(arch===3||arch===4)?`Pasa por NAT (US$ ${t.nat_gb}/GB); lo que cobra cada proveedor está en la sección 3`:'Sin cargo de AWS apreciable (entrada gratis, peticiones pequeñas)');
 const fixed=(arch===3||arch===4)?`<tr><td class="l">Puerta de salida NAT (cargo fijo del mes)</td><td></td><td>${m(t.nat*H)}</td><td>${m(t.nat*H*12)}</td><td class="l">Cargo por tener la puerta encendida (US$ ${t.nat}/h)</td></tr>`:'';
 return `<h3>Costo de las conexiones con ${int(N)} cliente(s) en ${ARCH[arch]}</h3><table><tr><th class="l">Conexión</th><th>GB al mes (total)</th><th>${CU()} al mes</th><th>${CU()} al año</th><th class="l">Cómo se cobra</th></tr>${rowsC.join('')}${fixed}</table>`;
}
function projTable(pi,opts){
 const rows=S.ui.scales.map((n,i)=>{ const o=calc(n,pi,S,opts); const other=o.other;
  return `<tr><td class="l">${int(n)}</td><td>${int(o.devices)}</td><td>${fmt(o.cells,0)}</td><td>${m(o.infra,0)}</td><td>${m(o.traffic,0)}</td><td>${m(other,0)}</td><td>${m(o.tech,0)}</td><td>${m(o.staff,0)}</td><td><b>${m(o.total,0)}</b></td><td>${m(o.total/n)}</td><td>${o.devices>0?m(o.total/o.devices):'—'}</td><td>${m(o.total*12,0)}</td><td>${alt(o.total)}</td></tr>`; }).join('');
 return `<div class="scroll"><table id="tbl-proj"><tr><th class="l">Clientes</th><th>Dispositivos</th><th>Zonas (celdas)</th><th>Servidores y AWS (${CU()})</th><th>Datos de tráfico (${CU()})</th><th>Otros prov. (${CU()})</th><th>Costo duro (${CU()})</th><th>Personal (${CU()})</th><th>TOTAL ${CU()}/mes</th><th>${CU()} por cliente</th><th>${CU()} por dispositivo</th><th>${CU()} por año</th><th>${CA()} por mes</th></tr>${rows}</table></div>`;
}
function outProj(){ return projTable(S.ui.prof); }
function outArchs(){
 const rows=S.ui.scales.map(n=>{const o=calc(n,S.ui.prof,S); const mn=Math.min(o.A,o.B,o.C,o.D);const c=v=>v===mn?`<b>${m(v,0)}</b>`:m(v,0); return `<tr><td class="l">${int(n)}</td><td>${c(o.A)}</td><td>${c(o.B)}</td><td>${c(o.C)}</td><td>${c(o.D)}</td></tr>`;}).join('');
 return `<table><tr><th class="l">Clientes</th><th>A · Lightsail (${CU()})</th><th>B · EC2+RDS (${CU()})</th><th>C · Alta disp. (${CU()})</th><th>D · Fargate+RDS (${CU()})</th></tr>${rows}</table><p class="small">En negrita, la más económica en dinero. La opción A es la más económica, pero sin alta disponibilidad (ver el orden por varios criterios en «Cuál conviene»).</p>`;
}
function outProfs(){
 const rows=S.ui.scales.map(n=>{const a=calc(n,0,S),b=calc(n,1,S),c=calc(n,2,S),e=calc(n,3,S); return `<tr><td class="l">${int(n)}</td><td>${m(a.total,0)}</td><td>${m(b.total,0)}</td><td>${m(c.total,0)}</td><td>${m(e.total,0)}</td><td>${m(a.total/n)}</td><td>${m(b.total/n)}</td><td>${m(c.total/n)}</td><td>${m(e.total/n)}</td></tr>`;}).join('');
 return `<table><tr><th class="l">Clientes</th><th>Total Pequeña (${CU()})</th><th>Total Mediana (${CU()})</th><th>Total Grande (${CU()})</th><th>Total Personalizada (${CU()})</th><th>Por cliente Pequeña</th><th>Por cliente Mediana</th><th>Por cliente Grande</th><th>Por cliente Personalizada</th></tr>${rows}</table>`;
}
