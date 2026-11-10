/* ============================================================
   PROVEEDORES: fichas de explicación (qué es, cómo cobra, riesgos) de cada proveedor y su tarjeta editable.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/* ----------------------------- Datos de explicación de proveedores ----------------------------- */
const PROVS = [
 {id:'tomtom',st:'req',name:'TomTom Traffic — incidentes de tráfico',
  what:'TomTom es una empresa de mapas. Su servicio «Traffic Incidents» responde, para una zona del mapa, qué choques, cierres, obras o trancones hay en este momento.',
  use:'Junto con HERE, es la fuente de alertas viales de XiGOS (uno es el principal y el otro el respaldo; ver la configuración de «Proveedores de tráfico»). El «hub» (la central de XiGOS) pregunta cada 30 minutos por cada cuadro del mapa (una «celda» o zona; por defecto de 0,75° ≈ 83 km por lado; se puede cambiar por proveedor en la ficha de tráfico sin pasar del máximo permitido) que algún cliente vigila. Lo que responde se guarda y se comparte con todos los clientes que vigilan esa zona. Verificado con datos reales.',
  how:'Cobra por cada pregunta que hacemos («petición»), por bloques de 1.000. Cada mes las primeras 2.500 son gratis; si pasamos de ahí, se paga por tramos y el precio por 1.000 baja cuando el volumen sube.',
  cur:'EUR', f:[['t.tt_free','Peticiones gratis por mes'],['t.tt_t1','EUR por 1.000: de 2.500 a 1 millón'],['t.tt_t2','EUR por 1.000: de 1 a 5 millones'],['t.tt_t3','EUR por 1.000: de 5 a 10 millones']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ${int(S.ui.N)} clientes se vigilan ≈ ${fmt(o.cells_tt,1)} zonas de ${fmt(o.deg_tt,2)}° (${fmt(S.g.qph_traffic,2)} consultas por hora por zona) → ${int(o.tt_calls)} peticiones al mes a TomTom (≈ ${fmt(o.tt_calls/720,1)} por hora; ${int(S.t.tt_free)} gratis) → <b>${usd(o.tomtom)}</b> al mes (${cop(o.tomtom)}) · <b>${usd(o.tomtom*12,0)}</b> al año.`;},
  src:'https://docs.tomtom.com/pricing',conf:'ALTA — confirmado con el estimador de la propia página (1 millón de peticiones = EUR 1.995).',risk:'TomTom marca algunas versiones antiguas como «de generación anterior»; la versión que usamos (v5) sigue facturable pero podría retirarse. Falta confirmar por escrito sus términos de almacenamiento y de servicio a varios clientes.'},
 {id:'here',st:'req',name:'HERE Traffic — incidentes de tráfico',
  what:'HERE es otra empresa de mapas. Su servicio de tráfico hace lo mismo que el de TomTom: informa incidentes viales en una zona.',
  use:'Se consulta junto con TomTom: si uno falla o no ve un incidente, el otro lo cubre, y si ambos reportan el mismo cierre la alerta es más confiable. Por eso hoy se pagan los dos (uno es el principal y el otro el respaldo).',
  how:'Cobra por «transacciones» (cada pregunta cuenta una), por bloques de 1.000. Las primeras 5.000 de cada mes son gratis; después el precio baja por tramos.',
  cur:'USD', f:[['t.here_free','Transacciones gratis por mes'],['t.here_t1','USD por 1.000: de 5.001 a 200.000'],['t.here_t2','USD por 1.000: de 200.000 a 1 millón'],['t.here_t3','USD por 1.000: de 1 a 5 millones'],['t.here_t4','USD por 1.000: de 5 a 20 millones'],['t.here_t5','USD por 1.000: más de 20 millones']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ≈ ${fmt(o.cells_here,1)} zonas de ${fmt(o.deg_here,2)}°, HERE recibe ${int(o.here_calls)} transacciones al mes (≈ ${fmt(o.here_calls/720,1)} por hora; ${int(S.t.here_free)} gratis) y cuesta <b>${usd(o.here)}</b> al mes (${cop(o.here)}) · <b>${usd(o.here*12,0)}</b> al año.`;},
  src:'https://www.here.com/get-started/pricing/supplemental-pricing',conf:'ALTA (precios vigentes desde 2026-04-01). La página se rotula «Confidencial» bajo los términos de HERE Platform.',
  risk:'<b>Riesgo de licencia:</b> el plan básico (Base Plan) de HERE excluye «Asset Management»: ubicar o rastrear activos en un mapa, calcular rutas para ellos y alertar sobre peligros en su ruta. XiGOS hace algo parecido con vehículos; hay que preguntarle por escrito a HERE antes de producción. Si exige contrato, el precio es por cotización.'},
 {id:'ors',st:'req',name:'OpenRouteService (HeiGIT) — rutas y alternas',
  what:'Servicio gratuito que calcula rutas por carretera (distancia, tiempo) y puede evitar zonas con problemas.',
  use:'Cuando se crea una ruta o se necesita una vía alterna evitando un cierre, el hub pide el cálculo a ORS y lo guarda 24 horas para no repetirlo.',
  how:'No cobra en el plan estándar, pero limita a 2.000 rutas por día (≈ 60.000 al mes) y 40 por minuto, compartidas por todos los clientes. Si se pasa, hay que usar otro proveedor de pago (TomTom Routing).',
  cur:'EUR', f:[['t.ors_free_month','Rutas gratis por mes (≈ 2.000/día)'],['t.tt_route_free','TomTom Routing: gratis por mes (respaldo)'],['t.tt_route','TomTom Routing: EUR por 1.000, de 20 mil a 1 millón'],['t.tt_route_t2','TomTom Routing: EUR por 1.000, de 1 a 5 millones'],['t.tt_route_t3','TomTom Routing: EUR por 1.000, de 5 a 10 millones']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ${int(S.ui.N)} clientes se calculan ≈ ${int(o.route_calls)} rutas al mes (tras la memoria de 24 h). Después del cupo de OpenRouteService, ≈ ${int(o.tt_route_vol)} rutas van a TomTom Routing (20.000 gratis al mes y luego por tramos). Excedente a pagar a TomTom: <b>${usd(o.routing)}</b> al mes (${usd(o.routing*12,0)} al año).`;},
  src:'https://account.heigit.org/info/plans',conf:'ALTA para los límites. Los términos de uso comercial del plan gratuito NO se verificaron.',risk:'Un solo límite diario para todos los clientes: con cientos de clientes se agota. HERE Routing (USD 0,88 por 1.000) no es opción segura por la exclusión de «activos».'},
 {id:'owm',st:'req',name:'OpenWeatherMap / Open-Meteo — clima',
  what:'Servicios que informan lluvia fuerte, viento y poca visibilidad en un lugar.',
  use:'El hub consulta el clima cada 60 minutos por celda (cuadros de ~55 km) para avisar de riesgo meteorológico en las rutas.',
  how:'OpenWeatherMap: gratis hasta 60 llamadas por minuto y 1.000.000 al mes (planes de pago desde £30 al mes). Open-Meteo: gratis SOLO para uso no comercial (hasta 10.000 al día); su plan comercial no muestra precio.',
  cur:'USD', f:[['t.owm_free','OpenWeatherMap: llamadas gratis por mes'],['g.cell_deg_weather','Zona de clima (grados por lado; 0,5° ≈ 56 km)'],['g.qph_weather','Consultas de clima por hora, por zona de clima'],['t.owm_p1','Plan Startup: GBP al mes (10 M llamadas, 600 por min)'],['t.owm_p2','Plan Developer: GBP al mes (100 M llamadas, 3.000 por min)'],['t.owm_p3','Plan Professional: GBP al mes (1.000 M llamadas, 30.000 por min)'],['t.owm_p4','Plan Expert: GBP al mes (3.000 M llamadas, 100.000 por min)'],['t.owm_gbpusd','Dólares por libra (GBP→USD): escríbalo; no se consultó']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Se hacen ≈ ${int(o.wcalls)} llamadas de clima al mes (≈ ${fmt(o.wcalls/720,1)} por hora): ${o.weather_ok?'<b>dentro</b> del plan gratuito (US$ 0).':(o.weather_plan>0&&o.weather_plan<5?`<b>supera</b> el plan gratuito: alcanza el plan de pago n.º ${o.weather_plan} (GBP ${[S.t.owm_p1,S.t.owm_p2,S.t.owm_p3,S.t.owm_p4][o.weather_plan-1]} al mes). `+(S.t.owm_gbpusd>0?`Costo: <b>${usd(o.weather_cost)}</b> al mes.`:'Escriba los dólares por libra para convertirlo a dinero (PENDIENTE).'):'<b>supera</b> todos los planes publicados: requiere cotización.')}`;},
  src:'https://openweathermap.org/price',conf:'MEDIA — la página no declara los términos comerciales del plan gratuito.',risk:'Open-Meteo hoy está marcado «datos de prueba»: para producción comercial se necesita su plan de pago (precio: por cotización) o usar OpenWeatherMap.'},
 {id:'eje',st:'req',name:'Dispositivos GPS y proveedores (equipo, SIM y plataforma)',
  what:'Los equipos GPS instalados en los vehículos y las plataformas de rastreo de los proveedores GPS. Algunos proveedores se consultan por API para traer las posiciones.',
  use:'XiGOS consulta por API las plataformas de los proveedores GPS (con usuario y clave guardados cifrados) y pide las últimas posiciones. Con eso sigue los viajes, avisa retrasos o paradas y marca el paso por puntos de control. XiGOS NO tiene receptor propio de GPS.',
  how:'<b>Fortox asume el costo</b> del equipo, de la SIM de datos y de la plataforma de cada proveedor, por cada dispositivo. No hay tarifas públicas: cada proveedor se registra con su contacto y sus costos por dispositivo (editables). Por eso la cantidad de dispositivos mueve el presupuesto. El único límite conocido de consulta (de uno de los proveedores) es ≈ 1 por minuto.',
  cur:'USD', f:[], ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ${int(S.ui.N)} cliente(s) hay ${int(o.gps_devices)} dispositivos GPS (≈ ${fmt(o.pos_month/1e6,2)} millones de posiciones al mes, ≈ ${fmt(o.pos_gb,1)} GB guardados). Equipo, SIM y plataforma de los proveedores: <b>${usd(o.gps_prov)}</b> al mes (${cop(o.gps_prov)}). Mientras no escriba las cotizaciones, este valor queda en 0.`;},
  src:'(sin tarifa pública) — requiere cotización a cada proveedor',conf:'PENDIENTE — PRECIO NO PÚBLICO.',risk:'Falta probar con vehículos EN MOVIMIENTO (las pruebas fueron con equipos detenidos). Referencia débil, no oficial: un blog de un taller en Bogotá menciona ≈ COP 400.000 de equipo e instalación y COP 30.000–80.000 al mes de plataforma; no se usa en el cálculo. Referencia de equipo: Teltonika FMB920 ≈ US$ 69–73 en revendedores (baja confianza).'},
 {id:'osm',st:'req',name:'OpenStreetMap (mapas) y Nominatim (buscador de lugares)',
  what:'Mapa abierto y gratuito mantenido por voluntarios, y su buscador de direcciones.',
  use:'Los mapas del panel (zonas, rutas, viajes) se dibujan con «teselas» (cuadritos de imagen) que el navegador descarga de OpenStreetMap. El buscador se usa al crear zonas.',
  how:'No cobra, pero exige atribución, prohíbe el uso intensivo y puede bloquear sin aviso. A escala conviene un proveedor de teselas de pago (ej. TomTom Map Display: 200.000 gratis al mes y EUR 0,10 por 1.000 después).',
  cur:'EUR', f:[['t.tt_tile_free','TomTom teselas: gratis por mes'],['t.tt_tile','TomTom teselas: EUR por 1.000 (200 mil a 10 millones)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S,{tiles:1});return `Si se cambiara OSM por TomTom con ${int(S.ui.N)} clientes costaría <b>${usd(o.tiles)}</b> al mes (${usd(o.tiles*12,0)} al año). Hoy: US$ 0.`;},
  src:'https://operations.osmfoundation.org/policies/tiles/',conf:'ALTA (política). Unidad de TomTom confirmada con su estimador: 1 millón = EUR 80.',risk:'Si OpenStreetMap limita el uso, los mapas dejan de verse. Reservar presupuesto de un proveedor de teselas.'},
 {id:'mail',st:'req',name:'Correo (SMTP Microsoft 365 hoy · Amazon SES como alternativa)',
  what:'Servicio para enviar correos desde el sistema.',
  use:'Envía las solicitudes de aprobación de informes, la distribución al cliente y avisos de viajes.',
  how:'<b>Hoy los correos salen por la cuenta de Microsoft 365 que Fortox ya tiene, así que no se cobra por cada correo y NO se suma al cálculo.</b> Lo único que podría costar es la licencia del buzón de M365 (precio no consultado; si la quiere contar, escríbala abajo). Solo si se cambiara a Amazon SES (alternativa de AWS) se pagaría por correo enviado.',
  cur:'USD', f:[['t.ses','Amazon SES: USD por correo (solo si se cambia a SES)'],['g.m365_usd','Licencia de Microsoft 365 atribuible a XiGOS (USD al mes; 0 = no se cuenta)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `${int(S.ui.N*o.p.emails)} correos al mes. Hoy por Microsoft 365: <b>${usd(S.g.m365_usd,2)}</b> al mes (solo la licencia, si la escribió). Si se cambiara a SES costarían <b>${usd(o.email_ses,3)}</b> al mes (${usd(o.email_ses*12,2)} al año).`;},
  src:'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSES/current/sa-east-1/index.json',conf:'ALTA (SES). Microsoft 365: PENDIENTE.',risk:'Poco costo; el riesgo es que el proveedor bloquee envíos (SMTP AUTH en Outlook).'},
 {id:'push',st:'req',name:'Notificaciones del navegador (Web Push)',what:'Avisos que aparecen en el celular o el computador aunque el panel esté cerrado.',use:'Avisos de retrasos, paradas o alertas manuales.',how:'Gratis (usa el servicio de aviso del propio navegador).',cur:'USD',f:[],ex:()=>'Costo: <b>US$ 0</b>.',src:'(estándar abierto Web Push/VAPID)',conf:'ALTA',risk:'Entrega real con la app cerrada (Android/iOS) aún sin verificar; requiere HTTPS.'},
 {id:'wa',st:'proy',name:'WhatsApp Business Platform (Meta) — pendiente de implementación',
  what:'Forma oficial de enviar mensajes de WhatsApp desde un sistema, con plantillas aprobadas por Meta.',
  use:'Pendiente de implementación: hoy no hay nada en el código. Cuando se implemente, serviría para avisos de viajes (retrasos, paradas) al celular del conductor o del jefe de operación.',
  how:'Meta cobra por cada mensaje ENTREGADO, según su categoría. Una alerta de viaje iniciada por la empresa es de «utilidad» (la tarifa más económica); un mensaje promocional sería «marketing» (15,6 veces más caro). Lo que escribe el usuario a la empresa no se cobra. Desde 2026-10-01 también se cobran las respuestas dentro de la ventana de 24 h (1.000 gratis al mes por número).',
  cur:'USD',f:[['t.wa_utility','Utilidad (USD por mensaje)'],['t.wa_auth','Autenticación (USD)'],['t.wa_service','Servicio (USD)'],['t.wa_marketing','Marketing (USD)'],['g.wa_mkt_pct','% de los mensajes que son de marketing (el resto es utilidad)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S,{wa:1});return `Con ${int(S.ui.N)} clientes y ${int(o.p.wa_msgs)} mensajes por cliente al mes: <b>${usd(o.whatsapp)}</b> al mes (${usd(o.whatsapp*12,0)} al año). Casi nada: el costo real es el desarrollo (≈ 100 h supuestas) y un intermediario (BSP) opcional, cuyo precio no es público.`;},
  src:'https://developers.facebook.com/docs/whatsapp/pricing/ (hojas de tarifas de Colombia, vigentes 2026-10-01)',conf:'ALTA (tarifas Colombia). BSP: PENDIENTE (requiere cotización).',risk:'Pagar en pesos (COP) sale ≈ 14 % más caro que en dólares (Meta usa ≈ 3.682 COP por USD). Abrir la cuenta en USD.'},
];
const PROVS_OPT = [
 {id:'ows',st:'opt',name:'OpenWeb Ninja — API de Waze',
  what:'Empresa intermediaria (no oficial) que vende acceso a datos públicos de la web. Su «API Waze» devuelve alertas y trancones reportados por conductores en una zona.',
  use:'<b>La arquitectura actual NO la necesita:</b> el hub tiene el «cupo» en su catálogo, pero no hay conector activo (en espera de validación legal). Se incluiría como tercera fuente de incidentes.',
  how:'Cobra por petición: US$ 0,03 por cada 10 peticiones (US$ 0,003 cada una) en el canal de créditos; su catálogo interno anotaba un plan gratuito de 100 al mes (sin verificar).',
  f:[['t.ows_req','USD por petición'],['g.qph_ows','Peticiones por hora, por celda'],['g.ows_calls_cell','… o peticiones por celda al mes (720 = una por hora)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);const c=o.cells*S.g.ows_calls_cell*S.t.ows_req;return `Si se activara para las ${fmt(o.cells,0)} celdas: <b>${usd(c)}</b> al mes (${usd(c*12,0)} al año). Se compara con TomTom por incidente: US$ 0,003 por petición vs ≈ US$ 0,0022.`;},
  src:'https://agents.openwebninja.com/zcj/mn33t0f95gsd/services/waze',conf:'MEDIA — precio del canal de créditos; los planes para personas son otro canal y no se mostraron.',risk:'Intermediario no oficial: validar con asesoría legal antes de habilitar (términos de Waze).',extra:'ows'},
 {id:'wazeoff',st:'opt',name:'Waze for Cities (oficial)',
  what:'Programa de Waze/Google que entrega datos de incidentes a entidades que, a cambio, comparten sus cierres viales.',
  use:'<b>No requerido hoy.</b> No se «compra»: se firma un convenio. Daría datos de conductores de forma oficial, pero exige ser socio y compartir información.',
  how:'Sin precio: es un intercambio de datos. Sujeto a aprobación de Waze y a términos que restringen publicar los datos.',
  f:[],ex:()=>'Costo en dinero: <b>US$ 0</b> (el costo es el convenio y tiempo de gestión).',src:'https://developers.google.com/waze/data-feed/constructing-a-partner-feed',conf:'MEDIA (resumen de documentación oficial).',risk:'Requiere ser socio; sin convenio no hay acceso. No se debe usar «scraping».'},
 {id:'apify',st:'opt',name:'Apify — extracción automática de datos de sitios web',
  what:'Plataforma donde se ejecutan «robots» que leen páginas web que no tienen API (por ejemplo, el estado de las vías de la Policía).',
  use:'<b>No requerido hoy:</b> está deshabilitado en el catálogo (créditos agotados) y no hay conector activo. Serviría para noticias o boletines oficiales publicados solo como página web.',
  how:'Planes mensuales con un crédito de uso incluido: Gratis US$ 0 (crédito US$ 5), Starter US$ 19, Scale US$ 199, Business US$ 999; el uso se descuenta del crédito (US$ 0,20 por «unidad de cómputo» en Gratis/Starter, 0,16 Scale, 0,13 Business).',
  f:[['t.apify_starter','Starter: USD al mes'],['t.apify_scale','Scale: USD al mes'],['t.apify_business','Business: USD al mes']],sel:'apify',
  ex:()=>`Si se activara con el plan elegido abajo: <b>${usd(calc(S.ui.N,S.ui.prof,S).x_apify||([0,S.t.apify_starter,S.t.apify_scale,S.t.apify_business][S.g.apify_plan]))}</b> al mes (un solo costo fijo, no crece con clientes).`,
  src:'https://apify.com/pricing',conf:'ALTA (planes).',risk:'Leer páginas de gobierno es «scraping»: hay que revisar los términos de cada sitio.',extra:'apify'},
 {id:'inrix',st:'opt',name:'INRIX — tráfico analítico (históricos y predicción)',
  what:'Empresa de datos de tráfico a gran escala, orientada a estudios y análisis histórico.',
  use:'<b>No requerido hoy:</b> figura como «propuesto para fase 2» en el catálogo; sin conector.',
  how:'<b>Precio no público:</b> se contrata con su área comercial.',
  f:[['g.inrix_usd','Su cotización mensual (USD) — escríbala si la obtiene']],ex:()=>'Hasta tener cotización: <b>PENDIENTE</b>.',src:'https://inrix.com (contacto: sales@inrix.com)',conf:'PENDIENTE — requiere cotización.',risk:'Contrato comercial probablemente mayor que los proveedores actuales.',extra:'inrix'},
 {id:'gmaps',st:'opt',name:'Google Maps Platform',
  what:'Mapas, rutas y geocodificación de Google.',
  use:'<b>No requerido hoy:</b> solo se integraría si un cliente lo exige expresamente.',
  how:'No se consultó su tarifa en este estudio.',f:[['g.gmaps_usd','Su costo mensual estimado (USD) — escríbalo si lo requiere']],ex:()=>'Hasta tener tarifa: <b>PENDIENTE</b>.',src:'(no consultado)',conf:'PENDIENTE',risk:'—',extra:'gmaps'},
 {id:'gov',st:'no',name:'Datos oficiales: datos.gov.co, INVIAS, IDEAM, UNGRD, Policía',
  what:'Portales del Estado con datos abiertos.',use:'<b>No requeridos hoy:</b> no existe un conjunto de datos de cierres viales en datos.gov.co; INVIAS e IDEAM no ofrecen API (solo PDF o páginas).',how:'Gratis, pero sin servicio utilizable hoy.',f:[],ex:()=>'Costo de API: <b>US$ 0</b>, sin servicio disponible.',src:'(ver docs del proyecto)',conf:'ALTA (que no hay API)',risk:'Habría que autorizar «scraping» o conseguir acceso oficial.'},
];
const ST={req:['Requerido hoy','p-req'],opt:['No requerido hoy · opcional','p-opt'],no:['No requerido hoy · sin servicio','p-no'],proy:['Pendiente de implementación','p-proy']};

/* ----------------------------- Piezas reutilizables ----------------------------- */
const fmtN=v=>Number(v).toLocaleString('es-CO',{maximumFractionDigits:4});
const repChk=(key,label)=>`<label class="chk repchk"><input type="checkbox" data-b="rep.${key}" ${bget('rep.'+key)?'checked':''}> <b>${label||'Incluir en el reporte impreso'}</b></label>`;

function provCard(p){ // versión editable (para la ventana modal)
 const [lab,cls]=ST[p.st];
 let fields=p.f.length?`<div class="fields">${p.f.map(([path,l])=>`<label>${l}${inp(path)}</label>`).join('')}</div>`:'';
 if(p.sel==='apify') fields+=`<div class="fields"><label>Plan de Apify a considerar${sel('g.apify_plan',[[1,'Starter'],[2,'Scale'],[3,'Business'],[0,'Gratis (US$ 0)']])}</label></div>`;
 let toggle='';
 if(p.extra) toggle=`<div class="ctl" style="margin:6px 0">${chk('xt.'+p.extra,'<b>Incluir en el cálculo</b> (supuesto: se activaría)')}</div>`;
 if(p.id==='wa') toggle=`<div class="ctl" style="margin:6px 0">${chk('ui.wa','<b>Incluir en el cálculo</b> (pendiente de implementación)')}</div>`;
 if(p.id==='mail') toggle=`<div class="ctl" style="margin:6px 0">${chk('ui.ses','<b>Incluir en el cálculo</b> el envío por Amazon SES (en vez de la cuenta de Microsoft 365)')}</div>`;
 if(p.id==='osm') toggle=`<div class="ctl" style="margin:6px 0">${chk('ui.tiles','<b>Incluir en el cálculo</b> un proveedor de mapas de pago en vez de OpenStreetMap')}</div>`;
 return `<div class="prov"><div class="h"><b>${p.name}</b><span class="pill ${cls}">${lab}</span></div><div class="b"><dl>
 <dt>¿Qué es?</dt><dd>${p.what}</dd><dt>¿Para qué lo usa XiGOS?</dt><dd>${p.use}</dd><dt>¿Cómo cobra?</dt><dd>${p.how}</dd>
 <dt>Tarifas (editables)</dt><dd>${fields||'<span class="small">No hay precios que editar.</span>'}</dd><dt>Ejemplo con sus números</dt><dd><div class="ex" data-ex="${p.id}"></div></dd>
 ${p.risk?`<dt>Cuidado con…</dt><dd>${p.risk}</dd>`:''}<dt>Fuente y confianza</dt><dd class="src">${esc(p.src)}<br>Confianza: ${p.conf}</dd></dl>${toggle}</div></div>`;
}
function provReport(p){ // versión de solo lectura (para el reporte)
 const [lab,cls]=ST[p.st];
 const rows=p.f.map(([path,l])=>`<tr><td class="l">${l}</td><td>${fmtN(get(path))}</td></tr>`).join('');
 return `<div class="prov"><div class="h"><b>${p.name}</b><span class="pill ${cls}">${lab}</span></div><div class="b"><dl>
 <dt>¿Qué es?</dt><dd>${p.what}</dd><dt>¿Para qué lo usa XiGOS?</dt><dd>${p.use}</dd><dt>¿Cómo cobra?</dt><dd>${p.how}</dd>
 ${rows?`<dt>Tarifas usadas</dt><dd><table style="width:auto;min-width:340px">${rows}</table></dd>`:''}
 <dt>Con sus números</dt><dd><div class="ex">${p.ex()}</div></dd>${p.risk?`<dt>Cuidado con…</dt><dd>${p.risk}</dd>`:''}
 <dt>Fuente y confianza</dt><dd class="src">${esc(p.src)}<br>Confianza: ${p.conf}</dd></dl></div></div>`;
}
const PBY=Object.fromEntries(PROVS.concat(PROVS_OPT).map(p=>[p.id,p]));
PBY.talkteam={id:'talkteam',st:'req',name:'Team Talk (Movistar) — bodycams',
 what:'Aplicación de comunicación inmediata tipo «push to talk» de Movistar, con la que se manejan las bodycams.',
 use:'Las bodycams de los clientes funcionan con la app Team Talk de Movistar. Fortox asume su costo: licencia, plan de datos, equipo, instalación y, si aplica, el video que se guarde.',
 how:'Movistar no publica precios ni la estructura de sus planes (solo menciona «Planes Team Talk» en un contrato de 2022, sin cifras). Por eso la ficha trae todas las modalidades de cobro posibles; cada una es editable y empieza en 0.',
 st2:1};

