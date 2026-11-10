/* ============================================================
   DISPOSITIVOS: proveedores GPS (colección), plan Team Talk de las bodycams y sus ventanas.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ----- Dispositivos GPS (colección de proveedores con cantidades) + plan Team Talk de las bodycams ----- */
const selS=(path,opts)=>`<select data-b="${path}">${opts.map(([v,l])=>`<option value="${v}" ${String(get(path))===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
const TT_BASIS=[['dev_month','Por bodycam, cada mes'],['dev_once','Por bodycam, pago único (se reparte en la vida útil)'],['dev_once_fixed','Por bodycam, pago único (no se reparte)'],['client_month','Por cliente, cada mes'],['fixed_month','Cargo fijo, cada mes'],['gb_month','Por GB de video, cada mes'],['block_month','Por bloque de bodycams, cada mes']];
const MODE_L={buy:'Compra',rent:'Renta',included:'Incluido en la mensualidad'};
function gpsEditor(){
 if(!S.gps.length) return `<p class="small">Aún no hay proveedores. Use «+ Agregar proveedor».</p><button type="button" data-gadd="1">+ Agregar proveedor</button>`;
 return S.gps.map((g,i)=>`<div class="prov"><div class="h"><b>${esc(g.name||('Proveedor '+(i+1)))}</b><button type="button" data-gdel="${i}" style="margin-left:auto" title="Quitar este proveedor">✕ Quitar</button></div><div class="b"><div class="fields">
  <label>Nombre<input type="text" data-b="gps.${i}.name"></label>
  <label>Contacto (persona, correo o teléfono)<input type="text" data-b="gps.${i}.contact"></label>
  <label>Cantidad de dispositivos GPS${inp('gps.'+i+'.qty','any','w')}</label>
  <label>Cómo se cuenta la cantidad${selS('gps.'+i+'.scope',[['total','Total de la operación'],['client','Por cada cliente']])}</label>
  <label>Moneda en que cotiza${selS('gps.'+i+'.cur',[['COP','Pesos (COP)'],['USD','Dólares (USD)']])}</label>
  <label>Modalidad del equipo${selS('gps.'+i+'.mode',[['buy','Compra (pago único)'],['rent','Renta (cuota mensual)'],['included','Incluido en la mensualidad']])}</label>
  <label>Equipo: pago único por dispositivo (si es compra)${inp('gps.'+i+'.equip','any','w')}</label>
  <label>Equipo: renta mensual por dispositivo (si es renta)${inp('gps.'+i+'.rent','any','w')}</label>
  <label>Instalación: pago único por dispositivo${inp('gps.'+i+'.install','any','w')}</label>
  <label>Mensualidad / plataforma por dispositivo, al mes${inp('gps.'+i+'.plat','any','w')}</label>
  <label>SIM / plan de datos por dispositivo, al mes${inp('gps.'+i+'.sim','any','w')}</label>
  <label>Otros costos por dispositivo, al mes${inp('gps.'+i+'.other','any','w')}</label>
  <label>Vida útil del equipo en meses (0 = la general)${inp('gps.'+i+'.life','any','w')}</label></div></div></div>`).join('')
  +`<button type="button" data-gadd="1">+ Agregar proveedor</button>`;
}
function talkEditor(){
 return S.talkteam.map((l,i)=>`<div class="prov"><div class="h"><b>${esc(l.name||('Concepto '+(i+1)))}</b>${chk('talkteam.'+i+'.on','Incluir')}<button type="button" data-tdel="${i}" style="margin-left:auto" title="Quitar este concepto">✕ Quitar</button></div><div class="b"><div class="fields">
  <label>Nombre del concepto<input type="text" data-b="talkteam.${i}.name"></label>
  <label>Cómo se cobra${selS('talkteam.'+i+'.basis',TT_BASIS)}</label>
  <label>Valor${inp('talkteam.'+i+'.value','any','w')}</label>
  <label>Moneda${selS('talkteam.'+i+'.cur',[['COP','Pesos (COP)'],['USD','Dólares (USD)']])}</label>
  <label>Tamaño del bloque en bodycams (solo si se cobra por bloque)${inp('talkteam.'+i+'.size','any','w')}</label></div></div></div>`).join('')
  +`<button type="button" data-tadd="1">+ Agregar concepto</button>`;
}
const DEV_TPL={name:'Nuevo proveedor',contact:'',qty:0,scope:'total',mode:'buy',cur:'COP',equip:0,install:0,rent:0,sim:0,plat:0,other:0,life:0};
const TT_TPL={name:'Nuevo concepto',basis:'dev_month',value:0,cur:'COP',size:0,on:1};
function gpsTable(){
 const o=calc(S.ui.N,S.ui.prof,S);
 const rows=o.gps_rows.map(r=>`<tr><td class="l">${esc(r.name)}</td><td>${fmt(r.n,1)}</td><td class="l">${MODE_L[r.mode]||r.mode}</td><td>${m(r.monthly)}</td><td>${m(r.monthly*12)}</td><td>${m(r.once)}</td></tr>`).join('');
 const once=o.gps_rows.reduce((a,r)=>a+r.once,0);
 return `<p>Con <b>${int(S.ui.N)} cliente(s)</b>: <b>${fmt(o.gps_devices,1)} dispositivos GPS</b> en total (suma de las cantidades de los proveedores). Estos costos <b>siempre están sumados</b> al cálculo (Fortox asume el equipo y la plataforma).${(o.gps_prov+once)===0?' <span class="small">Hoy todos los valores están en 0 porque faltan las cotizaciones.</span>':''}</p>
 <div class="scroll"><table><tr><th class="l">Proveedor</th><th>Dispositivos</th><th class="l">Equipo</th><th>Mensual ${CU()}</th><th>Anual ${CU()}</th><th>Pago único ${CU()}</th></tr>${rows}
 <tr><td class="l"><b>TOTAL proveedores GPS</b></td><td><b>${fmt(o.gps_devices,1)}</b></td><td></td><td><b>${m(o.gps_prov)}</b></td><td><b>${m(o.gps_prov*12)}</b></td><td><b>${m(once)}</b></td></tr></table></div>
 <p class="small">${o.gps_devices>0?`Por dispositivo GPS: ${usd(o.gps_prov/o.gps_devices)} al mes en promedio (${usd(o.gps_prov*12/o.gps_devices)} al año). `:''}El equipo comprado se reparte en su vida útil y se suma al mensual (casilla de arriba); el pago único se muestra aparte. Las bodycams también reportan posición, pero eso va incluido en el precio de su proveedor y no cambia el costo.</p>`;
}
function talkTable(){
 const o=calc(S.ui.N,S.ui.prof,S); const bl=Object.fromEntries(TT_BASIS);
 const rows=o.talk_rows.map(r=>`<tr><td class="l">${esc(r.name)}</td><td class="l">${bl[r.basis]||r.basis}</td><td>${m(r.monthly)}</td><td>${m(r.monthly*12)}</td><td>${m(r.once)}</td></tr>`).join('');
 return `<p>Con <b>${int(S.ui.N)} cliente(s)</b>: <b>${fmt(o.bodycams,1)} bodycams</b> en total.${o.bodycams===0?' <span class="small">Escriba la cantidad de bodycams en la ficha de Team Talk; mientras sea 0, los conceptos por bodycam no suman.</span>':''}</p>
 <div class="scroll"><table><tr><th class="l">Concepto</th><th class="l">Cómo se cobra</th><th>Mensual ${CU()}</th><th>Anual ${CU()}</th><th>Pago único ${CU()}</th></tr>${rows}
 <tr><td class="l"><b>TOTAL Team Talk</b></td><td></td><td><b>${m(o.gps_talk)}</b></td><td><b>${m(o.gps_talk*12)}</b></td><td><b>${m(o.talk_rows.reduce((a,r)=>a+r.once,0))}</b></td></tr></table></div>`;
}
MODALS.eje=()=>({title:'Dispositivos GPS: proveedores, equipos, SIM y plataforma',html:`${repChk('eje','Incluir en el reporte: dispositivos GPS y sus costos')}${SCEN({arch:0,unit:0,note:NOAWS})}
 <div class="box info"><b>Fortox asume el costo</b> del equipo, la SIM y la plataforma de cada dispositivo, así que la <b>cantidad de dispositivos</b> mueve el presupuesto. Agregue cada proveedor con su nombre, contacto, <b>cuántos dispositivos</b> tiene y sus costos <b>por dispositivo</b>. Por ejemplo: un proveedor con 50 equipos, costo por equipo y mensualidad; otro con 30 equipos cuyo equipo va incluido, solo con mensualidad. Un proveedor no condiciona al otro y no hay porcentajes: el total es la suma de las cantidades. <b>No hay precios públicos ni cotizaciones:</b> todo está en 0 y no se ha inventado ningún valor. Si cotizan en pesos, elija COP en el proveedor.</div>
 <div class="ctl">${chk('ui.gps_amort','Repartir el costo del equipo comprado en su vida útil y sumarlo al mensual')}<label>Vida útil general del equipo (meses)<input type="number" min="1" step="1" data-b="g.gps_life" class="w"></label></div>
 <h3>Proveedores de dispositivos GPS</h3><div id="gps-list">${gpsEditor()}</div>
 <h3>Resultado</h3><div id="m-gps"></div>${provCard(PBY.eje)}`});
MODALS.talkteam=()=>({title:'Team Talk (Movistar): plan de las bodycams',html:`${repChk('talkteam','Incluir en el reporte: plan Team Talk')}${SCEN({arch:0,unit:0,note:NOAWS})}
 <div class="box info">Las bodycams funcionan con la app <b>Team Talk de Movistar</b> y Fortox asume su costo. <b>Movistar no publica precios ni la estructura de sus planes</b> (solo se halló una mención de «Planes Team Talk» en un contrato de 2022, sin cifras), por eso aquí están <b>todas las modalidades de cobro posibles</b>, cada una editable y en 0: marque «Incluir» en las que apliquen a su contrato, escriba el valor y la moneda, o agregue conceptos nuevos. Las bodycams también reportan posición, pero eso viene incluido en el precio de la plataforma y no cambia el costo.</div>
 <div class="fields"><label>Cantidad de bodycams${inp('g.bc_qty','any','w')}</label>
  <label>Cómo se cuenta${selS('g.bc_scope',[['total','Total de la operación'],['client','Por cada cliente']])}</label>
  <label>GB de video guardados por bodycam al mes (0 = no se guarda en la nube)${inp('g.bc_gb','any','w')}</label></div>
 <h3>Conceptos de cobro</h3><div id="talk-list">${talkEditor()}</div>
 <h3>Resultado</h3><div id="m-talk"></div>`});
