/* ============================================================
   VISTAS DEL RESUMEN: diagrama interactivo, pestaña Resumen, tooltips.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
function diagramHtml(){
 const o=calc(S.ui.N,S.ui.prof,S); const it=(a,b,c)=>`<div class="it"><b>${a}</b>${b?`<small>${b}</small>`:''}${c?`<span class="pay">${c}</span>`:''}</div>`;
 const N=S.ui.N, arch=S.ui.arch, cs=ctrCosts(N,o,arch), perCli=cs.sumI+o.backups/N, hubC=cs.sumH;
 const g=S.g, t=S.t, posGB=o.pos_gb/N, baseGB=g.base_gb;
 const bkTip=`Respaldos: copia de los datos del cliente guardada fuera del servidor, en ${CL().l.store} (${CLS()}).\nCuenta así, por cliente al mes:\n• Posiciones GPS guardadas: ${fmt(posGB,3)} GB (${fmt(o.gps_devices/N,1)} dispositivos GPS × ${fmt(o.pos_month/Math.max(o.gps_devices,1),0)} posiciones × ${fmt(g.row_bytes,0)} bytes × ${fmt(g.retention_days,0)} días de retención)\n• Datos base del cliente (base de datos y PDF): ${fmt(baseGB,2)} GB\n• Total ${fmt(o.data_gb/N,3)} GB × ${fmt(g.backup_factor,1)} copias guardadas × US$ ${fmt(t.s3,4)} por GB = ${usd(o.backups/N,4)}\nEl disco del servidor no está aquí: ya va dentro del precio del servidor (${S.ui.cloud==='aws'?'en Lightsail, 80 GB incluidos':'se suma al precio de la máquina en la forma A'}).\nCómo validarlo: tarifa de almacenamiento de objetos y los 4 supuestos en Configuración → «Tarifas de la nube elegida» y «Supuestos y tamaños de uso»; ${S.ui.cloud==='aws'?'la tarifa oficial está en la lista de precios de AWS S3, región São Paulo (pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/sa-east-1/index.json)':'la fuente de la tarifa está en la ventana de tarifas'}. Los bytes por posición, los días y las 2,8 copias son supuestos sin medir.`;
 const lb=CL().l, hubWhere={1:`Dentro de la misma ${lb.vm} de São Paulo que las instancias de los clientes.`,2:`En un servidor (${lb.srv}) y una base ${lb.db} en São Paulo (${CLS()}).`,3:`En dos ${lb.zones} en São Paulo, con la base de datos duplicada en vivo.`,4:`Como contenedores ${lb.ctr} y base ${lb.db} en São Paulo (${CLS()}).`}[arch];
 const col=(cls,n,h,sub,body,foot)=>`<div class="col ${cls}"><h3><span class="num">${n}</span> ${h}</h3><p class="small" style="margin:0 0 4px">${sub}</p>${body}${foot?`<div class="pay foot">${foot}</div>`:''}</div>`;
 const ar='<div class="arrow" aria-hidden="true">➜</div>';
 return `<div class="dg">
  ${col('c1',1,'Su cliente','Quienes usan XiGOS',
    it('Usuarios con el navegador','Ven el panel con mapas gratis de OpenStreetMap','')+it('Dispositivos GPS y bodycams','GPS consultados por API de sus proveedores · bodycams con la app Team Talk de Movistar','Fortox asume el equipo, la SIM y la plataforma: ≈ '+usd(o.gps)+' al mes')+it('Correo y avisos','Correo: cuenta de Microsoft 365 que Fortox ya tiene · avisos: del navegador (Web Push)','No suma al cálculo: M365 ya se paga aparte (licencia no consultada) y el aviso es gratis. Solo costaría si se cambia a Amazon SES (≈ '+usd(o.email_ses,2)+' al mes)'),'')}
  ${ar}
  ${col('c2',2,'Servidor en '+CLS(),'Una «instancia» por CADA cliente',
    it('web','Muestra el panel','')+it('api','El cerebro: permisos, datos, PDF','')+it('worker','No es una persona: es un programa «robot» que trabaja solo en segundo plano (informes PDF, avisos, seguimiento GPS)','')+it('base de datos','Guarda viajes, posiciones e informes','')
    +it('¿Por qué crece con cada cliente?','Cada cliente tiene su propia instancia, y todas reservan la misma memoria (≈ '+fmt(cs.R.A,2)+' GB) sin importar su operativa o tipo de datos. Lo único que cambia entre clientes es el volumen de datos (más dispositivos GPS = más posiciones guardadas), que casi no cuesta.',''),
    `Se paga por cada cliente: su parte del servidor ≈ ${usd(cs.sumI)} + <span style="border-bottom:1px dotted;cursor:help" ${tipA(bkTip)}>respaldos en ${CL().l.store} ⓘ</span> ≈ ${usd(o.backups/N)} = ≈ <b>${usd(perCli)} al mes por cliente</b> (el servidor sube en escalones al llenarse). Con ${int(N)} cliente(s), todo ${CLS()} ≈ ${usd(o.infra,0)} al mes (incluye el hub y costos fijos).`)}
  ${ar}
  ${col('c3',3,'Hub XiGOS','UNO solo para todos los clientes',
    it('hub-api','Reparte las alertas a cada cliente','')+it('collector','Pregunta a los proveedores cada 30 min','')+it('base de datos del hub','Guarda lo recogido',''),
    `<b>Costo fijo mensual compartido</b> (no es un pago único ni se multiplica por cliente): ≈ ${usd(hubC)} al mes (${usd(hubC*12,0)} al año) por su parte del servidor${arch>1?'; en esta opción se suman además el balanceador y la base RDS, que se reparten entre todos':''}. Se paga cada mes mientras XiGOS esté en operación. <b>Dónde queda:</b> ${hubWhere} <b>Respaldo:</b> el modelo cuenta copias de las bases de los clientes a ${CL().l.store}; que la base del hub (pequeña) quede cubierta por el mismo respaldo está <u>pendiente de confirmar</u>.`)}
  ${ar}
  ${col('c4',4,'Proveedores externos','A quienes el hub les pregunta',
    it('TomTom Traffic','Incidentes de tráfico','Por petición · 2.500 gratis al mes')+it('HERE Traffic','Incidentes de tráfico (respaldo)','Por petición · 5.000 gratis al mes')+it('OpenRouteService','Rutas y alternas','Gratis hasta 2.000 al día')+it('OpenWeatherMap','Clima','Gratis hasta 1 millón al mes')+it('WhatsApp (Meta)','Pendiente de implementación','US$ 0,0008 por mensaje de utilidad'),
    `Tráfico (TomTom + HERE) ≈ ${usd(o.traffic,0)} al mes con ${int(S.ui.N)} cliente(s)`)}
 </div>`;
}
function renderViz(){
 CW=Math.max(300,Math.min(1400,document.getElementById('viz').clientWidth-72));
 const tmp=document.createElement('div'); tmp.innerHTML=outSummary();
 const cards=tmp.querySelector('.cards'), simple=tmp.querySelector('.box.info');
 document.getElementById('viz').innerHTML=`<section><h2>Así se conecta XiGOS y qué se cobra</h2>
  <p class="lead">Para entender de un vistazo de dónde sale el costo. Lea de izquierda a derecha (en el celular, de arriba hacia abajo). <b class="payc">Lo que está en rojo es lo que genera costo.</b></p>${diagramHtml()}</section>
  <section><h2>Resumen interactivo</h2>
  <p class="lead">Las cifras y gráficas cambian al modificar el escenario de arriba. <b>Pase el cursor (o toque) sobre una barra o un punto</b> para ver el detalle. Las casillas bajo el título de algunas gráficas apagan o encienden partes.</p>
  ${cards?cards.outerHTML:''}${simple?simple.outerHTML:''}</section>
  <section><h2>Gráficas</h2>${CH.map(c=>chartCard(c,true)).join('')}</section>`;
 const tp=document.createElement('div'); tp.innerHTML=buildReport(); const secs=[...tp.querySelectorAll('h2')].map(h=>h.textContent.replace(/^\d+\.\s*/,''));
 document.getElementById('viz').insertAdjacentHTML('beforeend',`<section class="pdfbox"><h2>Imprimir o guardar como PDF</h2>
  <p class="lead">El PDF lleva <b>solo lo que esté marcado «En el reporte»</b> en la pestaña Configuración, con el escenario de arriba. Hoy saldría esto:</p>
  <div class="chips">${secs.length?secs.map((s,i)=>`<span class="chip">${i+1}. ${s}</span>`).join(''):'<span class="small">No hay nada marcado todavía.</span>'}</div>
  <div class="ctl"><button class="pri bigbtn" id="btn-print-viz">🖨 Imprimir o guardar como PDF</button><button id="go-cfg">Cambiar qué incluye →</button></div>
  <p class="small">Se abre el cuadro de impresión de su navegador: elija «Guardar como PDF» como destino.</p></section>`);
}
function graficasReport(){ const list=CH.filter(c=>S.rep['gr_'+c.id]&&(!c.cond||c.cond())); return list.map(c=>chartCard(c,false)).join(''); }
function tipShow(t,e){ const el=document.getElementById('tip'); el.textContent=t; el.hidden=false; const w=el.offsetWidth,h=el.offsetHeight; let x=e.clientX+14,y=e.clientY+14; if(x+w>innerWidth-6) x=e.clientX-w-14; if(x<6) x=6; if(y+h>innerHeight-6) y=e.clientY-h-14; if(y<6) y=6; el.style.left=x+'px'; el.style.top=y+'px'; }
document.addEventListener('mouseover',e=>{ const t=e.target.closest&&e.target.closest('[data-tip]'); if(t) tipShow(t.dataset.tip,e); });
document.addEventListener('mousemove',e=>{ const t=e.target.closest&&e.target.closest('[data-tip]'); const el=document.getElementById('tip'); if(t) tipShow(t.dataset.tip,e); else if(el) el.hidden=true; });
document.addEventListener('click',e=>{ const t=e.target.closest&&e.target.closest('[data-tip]'); if(t) tipShow(t.dataset.tip,e); else { const el=document.getElementById('tip'); if(el) el.hidden=true; } });
document.addEventListener('change',e=>{ const x=e.target; if(x.dataset&&x.dataset.vz){ VH[x.dataset.vz]=!x.checked; renderViz(); } });
document.addEventListener('toggle',e=>{ const d=e.target; if(d.tagName==='DETAILS'&&d.dataset.k) VO[d.dataset.k]=d.open; },true);

