/* ============================================================
   CONFIGURACIÓN: selector de escenario, fichas (tiles) de la pestaña 2 y ventanas de proveedores.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function ctrTables(){
 const head=`<tr><th class="l">Contenedor</th><th class="l">¿Qué hace?</th><th>Memoria que usa realmente (GB)</th><th>${CL().l.ctr}: procesador reservado (vCPU)</th><th>${CL().l.ctr}: memoria reservada (GB)</th></tr>`;
 return `<h3>Contenedores de cada cliente (editable)</h3><div class="scroll"><table>${head}${S.ctr.filter(c=>c.scope==='inst').map(ctrRow).join('')}</table></div>
 <h3>Contenedores del hub (uno solo para toda la plataforma)</h3><div class="scroll"><table>${head}${S.ctr.filter(c=>c.scope==='hub').map(ctrRow).join('')}</table></div>`;
}
function scaleInput(){ return `<label style="display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:var(--mut);font-weight:600">Cantidades de clientes a proyectar (separadas por coma, máx. 12)<input type="text" id="scales-in" value="${S.ui.scales.join(', ')}" style="width:100%;max-width:520px"></label>`; }
const SCEN=(o={})=>{ const on=k=>o[k]!==0;
 return `<div class="ctl">${on('N')?'<label>Número de clientes<input type="number" min="1" step="1" data-b="ui.N"></label>':''}${on('prof')?`<label class="prof-lbl" data-tip="${esc(profTip()).replace(/"/g,'&quot;')}">Qué tan grande es la operación de cada cliente ⓘ${sel('ui.prof',[[0,'Pequeña (uso bajo)'],[1,'Mediana (uso medio)'],[2,'Grande (uso alto)'],[3,'Personalizada (la ajusto yo)']])}</label>`:''}${on('arch')?`<label>Alojamiento en ${CLS()}${sel('ui.arch',[[1,ARCH[1]],[2,ARCH[2]],[3,ARCH[3]],[4,ARCH[4]]])}</label>`:''}${on('unit')?`<label>Moneda de toda la calculadora<select data-b="ui.unit"><option value="usd" ${S.ui.unit==='usd'?'selected':''}>Dólares (USD)</option><option value="cop" ${S.ui.unit==='cop'?'selected':''}>Pesos (COP)</option></select></label>`:''}</div>${on('prof')?'<p class="small prof-desc">'+profDesc()+'</p>':''}${o.note?`<p class="small">${o.note}</p>`:''}`; };
// Explica en palabras qué significa el nivel de uso elegido, con los números reales de la tabla «Supuestos y tamaños de uso».
function profDesc(){ const k=S.ui.prof, v=n=>S.p[n][k], nm=PROF_NAMES[k]; const g=S.g;
 const zn=deg=>Math.max(1,v('territory_km2')/((deg*DEG_KM)*(deg*DEG_KM)));
 return '<b>Operación '+nm+' de cada cliente.</b> Es el perfil de uso <u>promedio de UN cliente</u>: vigila ≈ <b>'+fmt(v('territory_km2'),0)+' km²</b> de territorio (con las zonas actuales son ≈ '+fmt(zn(degEff(g,'tt')),1)+' zona(s) de TomTom, '+fmt(zn(degEff(g,'here')),1)+' de HERE y '+fmt(zn(degEff(g,'weather')),1)+' de clima), tiene '+fmt(v('users'),0)+' usuarios en el panel, sus GPS reportan '+fmt(v('hours_day'),0)+' h al día, y genera ≈ '+fmt(v('emails'),0)+' correos y '+fmt(v('route_calls'),0)+' rutas alternas al mes. Cuanto más grande, más consultas a proveedores y más datos guardados. <u>No incluye cuántos dispositivos tiene</u>: esos se registran en las fichas de dispositivos. <b>Estos números son supuestos del estudio, sin mediciones reales de clientes.</b> <button type="button" class="opbtn" data-open="operacion">⚙ Ajustar la operación del cliente <small>km² de territorio, usuarios, horas de reporte, correos…</small></button>'; }
const NOAWS='Los valores de esta ficha <b>no cambian según la nube ni la forma de alojar</b>; solo dependen del número de clientes y del tamaño de uso.';

/* ----------------------------- Fichas (tiles) y ventanas modales ----------------------------- */
const TILES=[
 {g:'Tráfico vial (siempre HERE + TomTom)',items:[{id:'traffic',t:'Proveedores de tráfico: TomTom y HERE',d:'Cuál es el principal, cuál el respaldo y cuánto se consulta al respaldo. Tarifas de ambos.',st:'req'}]},
 {g:'Otros servicios que la arquitectura actual usa',items:['ors','owm','eje','talkteam','osm','mail','push','wa'].map(id=>({id,t:PBY[id].name,d:PBY[id].what,st:PBY[id].st}))},
 {g:'Servidores y contenedores en la nube (AWS, Google Cloud o Azure)',items:[
  {id:'aws',t:'Alojamiento y contenedores',d:'Cuántos contenedores hay, qué hace cada uno, cuánto cuesta mantenerlo, las 4 formas de alojarlo y la comparación entre las tres nubes.',st:'req'},
  {id:'conexiones',t:'Conexiones entre contenedores',d:'Qué conversa con qué, cuántos datos viajan y qué cobra la nube elegida por ello.',st:'req'},
  {id:'awsrates',t:'Tarifas de la nube elegida',d:'Precio de cada servicio de AWS, Google Cloud o Azure en São Paulo, para qué sirve y qué tan confiable es el dato.',st:'req'}]},
 {g:'Servicios que hoy NO se necesitan (opcionales)',items:['ows','wazeoff','apify','inrix','gmaps','gov'].map(id=>({id,t:PBY[id].name,d:PBY[id].what,st:PBY[id].st}))},
 {g:'Modelo y secciones del reporte',items:[
  {id:'resumen',t:'Resumen de costos',d:'Totales, costo duro, por cliente, por dispositivo y por año.',nomodal:1},
  {id:'graficas',t:'Gráficas',d:'Gráficas del resumen interactivo: dónde se va el dinero, crecimiento, promedio por cliente, sensibilidad y más. Elija cuáles salen en el PDF y en qué moneda.'},
  {id:'personal',t:'Personal: analista de inteligencia',d:'Cargo que aprueba y controla rutas y reportes. Se habilita con un sueldo mensual y cambia el costo promedio por cliente. Soporte y DevOps no se cuentan por ahora. Si no está activado, esta sección no sale en el reporte.'},
  {id:'proy',t:'Proyección por número de clientes',d:'Tabla de costos para distintas cantidades de clientes y comparaciones.',st:'req'},
  {id:'supuestos',t:'Supuestos y tamaños de uso',d:'Todo lo no verificado: memoria, celdas, tamaños de uso… y el tipo de cambio.',st:'req'},
  {id:'diagrama',t:'Diagrama de cómo se conecta todo',d:'Dibujo simple de quién le pregunta a quién y qué se cobra.',nomodal:1},
  {id:'glosario',t:'Glosario sin tecnicismos',d:'Qué significa cada palabra técnica.',nomodal:1},
  {id:'pendientes',t:'Qué falta saber',d:'Datos sin precio público y supuestos por confirmar.',nomodal:1}]}];
const CALC={ mail:()=>S.ui.ses||S.g.m365_usd>0, personal:()=>S.ui.analyst, wa:()=>S.ui.wa, osm:()=>S.ui.tiles, ows:()=>S.extras.find(e=>e.id==='ows').on, apify:()=>S.extras.find(e=>e.id==='apify').on, inrix:()=>S.extras.find(e=>e.id==='inrix').on, gmaps:()=>S.extras.find(e=>e.id==='gmaps').on };
const CALC_LBL={mail:'Correo con costo en el cálculo',personal:'Analista en el cálculo',wa:'WhatsApp en el cálculo',osm:'Mapas de pago en el cálculo',ows:'En el cálculo',apify:'En el cálculo',inrix:'En el cálculo',gmaps:'En el cálculo'};

function tileHtml(it){
 const st=it.st?ST[it.st]:null;
 const calc=CALC[it.id]?`<div class="small">${CALC_LBL[it.id]}: <b data-calc="${it.id}"></b></div>`:'';
 return `<div class="tile"><div class="th"><b>${it.t}</b>${st?`<span class="pill ${st[1]}">${st[0]}</span>`:''}</div><p>${it.d}</p>${calc}
  <div class="ta">${it.nomodal?'':`<button data-open="${it.id}">⚙ Configurar</button>`}<label class="chk repchk"><input type="checkbox" data-b="rep.${it.id}" ${bget('rep.'+it.id)?'checked':''}> En el reporte</label></div></div>`;
}
const MODALS={
 traffic:()=>({title:'Proveedores de tráfico: TomTom y HERE',html:`${repChk('traffic')}
  <div class="box info">HERE y TomTom están siempre presentes: <b>uno es el principal y el otro el respaldo</b>. Elija cuál es cuál y qué parte de las consultas se le hace también al respaldo.</div>
  <div class="ctl"><label>Proveedor principal<select data-b="g.backup_primary" data-int="1"><option value="1">TomTom (respaldo: HERE)</option><option value="2">HERE (respaldo: TomTom)</option></select></label>
   <label>% de consultas que también se hacen al respaldo<input type="number" min="0" max="100" step="5" data-b="g.backup_pct"></label>
   <label>Consultas por hora, por zona<input type="number" min="0.1" step="any" data-b="g.qph_traffic"></label>
   <label>… o minutos entre consultas por zona<input type="number" min="1" step="any" data-b="g.interval_traffic"></label></div>
  <p class="small">Son lo mismo dicho de dos maneras: <b>consultas por hora = 60 ÷ minutos entre consultas</b> (2 por hora = cada 30 min; 12 por hora = cada 5 min). Si cambia una, se actualiza la otra. Un mes se cuenta de 30 días (720 horas).</p>
  <p class="small"><b>100 %</b> = hoy: el hub consulta a los dos cada vez (se pagan los dos completos). <b>0 %</b> = el respaldo no se consulta nunca. <b>20 %</b> = solo 1 de cada 5 veces. Menos consultas al respaldo bajan el costo, pero la confirmación entre proveedores se reduce.</p>
  <h3>Tamaño de la zona que se consulta</h3>
  <div class="ctl"><label>Zona de TomTom (grados por lado)<input type="number" min="0.05" step="0.05" data-b="g.cell_deg_tt"></label>
   <label>Zona de HERE (grados por lado)<input type="number" min="0.05" step="0.05" data-b="g.cell_deg_here"></label>
   <label>Margen de seguridad (% del máximo permitido)<input type="number" min="1" max="100" step="1" data-b="g.cell_safety"></label>
   <button type="button" data-setcell="tt">Usar el máximo en TomTom</button><button type="button" data-setcell="here">Usar el máximo en HERE</button></div>
  <p class="small">La zona de clima (0,5° por defecto) se cambia en la ficha de OpenWeatherMap. 0,25° ≈ 27,8 km; 0,5° ≈ 55,6 km; 0,75° ≈ 83,4 km; 1° ≈ 111,2 km.</p>
  <div id="m-cell"></div>
  <div id="m-traffic"></div>${SCEN({arch:0,unit:0,note:NOAWS})}${provCard(PBY.tomtom)}${provCard(PBY.here)}`}),
 aws:()=>({title:'Alojamiento y contenedores en '+CLS(),html:`${repChk('aws','Incluir en el reporte: formas de alojar y cuenta de la nube')}${repChk('containers','Incluir en el reporte: costo de cada contenedor')}${SCEN({unit:0})}
  <h3>Comparación de las tres nubes</h3><div id="m-clouds"></div>
  <h3>Las cuatro formas de alojar (en palabras simples)</h3>${FORMAS()}
  <h3>Qué tanto pesa cada criterio para ordenar las alternativas</h3>
  <div class="fields"><label>Costo (valor por lo que se paga)${inp('g.rk_cost',1)}</label><label>Disponibilidad (que no se caiga)${inp('g.rk_avail',1)}</label><label>Respaldo y recuperación${inp('g.rk_backup',1)}</label><label>Facilidad de operar${inp('g.rk_ops',1)}</label><label>Capacidad de crecer${inp('g.rk_scale',1)}</label></div>
  <div id="m-rank"></div><div id="m-aws"></div>${ctrTables()}<div id="m-containers"></div>`}),
 conexiones:()=>({title:'Conexiones entre contenedores y con el exterior',html:`${repChk('conexiones')}${SCEN({unit:0})}<div id="m-conn"></div>
  <p class="small">Los GB por cliente son <b>supuestos</b> (editables).</p>
  <div class="scroll"><table><tr><th class="l">Conexión</th><th class="l">¿Qué viaja?</th><th class="l">Tipo</th><th>GB por cliente al mes</th></tr>
  ${S.conn.map((c,i)=>`<tr><td class="l">${esc(c.name)}</td><td class="l">${esc(c.what)}</td><td class="l">${{egress:'Sale a Internet (se cobra en B, C, D; en A solo está incluida en AWS Lightsail)',nat:'Sale a Internet; en C y D además pasa por la «puerta de salida» (NAT)',int:'Interna (gratis dentro de la misma zona)'}[c.net]}</td><td>${inp('conn.'+i+'.gb',0.01,'w')}</td></tr>`).join('')}</table></div>
  <h3>Reglas de cobro de ${CLS()} que aplican</h3>${CONN_RULES()}`}),
 awsrates:()=>({title:'Tarifas de '+CLS()+' en '+CL().region,html:`${repChk('awsrates')}${SCEN({unit:0,prof:0,N:0})}${cloudNote()}<div class="scroll"><table><tr><th class="l">Servicio de ${CLS()}</th><th class="l">¿Para qué sirve en XiGOS?</th><th class="l">¿Cómo cobra?</th>${S.ui.cloud==='aws'?'':'<th class="l">Confianza</th>'}<th>Precio (USD)</th></tr>${awsTable()}</table></div>
  ${S.ui.cloud==='aws'?`<p class="src">Fuente: listas oficiales de precios <code>pricing.us-east-1.amazonaws.com/offers/v1.0/aws/&lt;servicio&gt;/current/sa-east-1/index.json</code> (EC2 y VPC 2026-11-05; RDS 2026-10-29; S3, CloudWatch y SES 2026-11-04; Lightsail 2026-09-15; ECS 2026-10-19; ECR 2026-09-11). Confianza ALTA.</p>
  <div class="box">No incluido: soporte de AWS, Savings Plans (descuentos por compromiso), almacenamiento de PDF en Fargate (EFS o S3) y la licencia de Microsoft 365.</div>`:`<p class="src">Fuente: ${CL().src} Consultado el ${CL().date}.</p>
  <div class="box">No incluido: soporte de ${CLS()}, descuentos por compromiso (reservas), cupos gratuitos de la cuenta nueva, almacenamiento de PDF de los contenedores administrados y la licencia de Microsoft 365. Un <b>0</b> marcado PENDIENTE significa «precio sin verificar», no «gratis». Los precios de correo (SES), tráfico y proveedores no dependen de la nube.</div>`}`}),
 proy:()=>({title:'Proyección por número de clientes',html:`${repChk('proy','Incluir en el reporte: tabla de proyección')}${repChk('comp','Incluir en el reporte: comparaciones de alojamiento y tamaños de uso')}${SCEN({unit:0})}<div class="ctl">${scaleInput()}</div><div id="m-proj"></div>`}),
 supuestos:()=>({title:'Supuestos, tamaños de uso y tipo de cambio',html:`${repChk('supuestos')}<p class="lead">Estas cifras NO son datos verificados: son estimaciones razonables. Si consigue el dato real, escríbalo y todo se recalcula.</p>
  <div class="scroll"><table><tr><th class="l">Supuesto</th><th class="l">Por qué importa</th><th>Valor</th></tr>${SUPS.map(([p,l,w])=>`<tr><td class="l">${l}</td><td class="l">${w}</td><td>${inp(p)}</td></tr>`).join('')}</table></div>
  <h3>Cómo se mide cada tipo de operación (por cliente)</h3><div class="scroll"><table><tr><th class="l">Dato</th><th>Pequeña (bajo)</th><th>Mediana (medio)</th><th>Grande (alto)</th><th>Personalizada</th><th class="l">Por qué este valor y cómo obtener el dato real</th></tr>
  ${PROFROWS.map(([k,l,w])=>`<tr><td class="l">${l}</td>${[0,1,2,3].map(i=>`<td>${inp('p.'+k+'.'+i,'any','w')}</td>`).join('')}<td class="l small">${w}</td></tr>`).join('')}</table></div>
  <h3>Tipo de cambio</h3><div class="fields"><label>Pesos por dólar (TRM, datos.gov.co)${inp('t.trm')}</label><label>Dólares por euro (BCE)${inp('t.eurusd')}</label></div>
  <div class="ctl"><button type="button" class="pri" id="btn-fx">⟳ Actualizar TRM y euro de hoy</button></div><p class="small" id="fx-msg">${fxLine()}</p>`})
};
for(const id of ['ors','owm','eje','osm','mail','push','wa','ows','wazeoff','apify','inrix','gmaps','gov']){
 MODALS[id]=()=>({title:PBY[id].name,html:`${repChk(id)}${SCEN({arch:0,unit:0,note:NOAWS})}${provCard(PBY[id])}`});
}
// Tooltip del selector de operación: dice qué costos mueve hoy el tamaño elegido y cuáles no (y por qué), según la configuración actual.
function profTip(){
 const N=S.ui.N, os=[0,1,2,3].map(pi=>calc(N,pi,S));
 const rows=[
  ['Consultas de tráfico (TomTom y HERE)',o=>o.traffic,'las zonas caben en las cuotas gratis o cuentan como 1 zona por cliente'],
  ['Rutas alternas',o=>o.routing,'caben en el cupo gratis de rutas (OpenRouteService + TomTom)'],
  ['Almacenamiento y respaldos',o=>o.backups,os[0].gps_devices>0?'la diferencia es de centavos':'no hay dispositivos GPS registrados'],
  ['Correo',o=>o.email,'sale por Microsoft 365 y no suma (salvo que active Amazon SES)'],
  ['WhatsApp',o=>o.whatsapp,'WhatsApp está fuera del cálculo'],
  ['Mapas de pago',o=>o.tiles,'los mapas de pago están fuera del cálculo'],
  ['Soporte e instalación',o=>o.staff+o.onboarding,'soporte y DevOps están fuera del cálculo']];
 const moves=rows.filter(([n,f])=>Math.max(...os.map(f))-Math.min(...os.map(f))>0.005), stays=rows.filter(r=>!moves.includes(r));
 return 'El tamaño de la operación describe cómo usa XiGOS UN cliente promedio (km² de territorio, usuarios, horas de reporte, correos, rutas…).\n'
  +(moves.length?'Con '+int(N)+' cliente(s) hoy mueve: '+moves.map(r=>r[0]).join(', ')+'.':'Con '+int(N)+' cliente(s) hoy NO cambia el total.')
  +(stays.length?'\nNo mueve (por ahora): '+stays.map(r=>r[0]+' ('+r[2]+')').join('; ')+'.':'')
  +'\nSe nota más con más clientes, o al activar dispositivos, correo por SES, WhatsApp, mapas de pago o soporte.';
}
