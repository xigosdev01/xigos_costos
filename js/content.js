/* ============================================================
   TEXTOS Y TABLAS FIJAS: formas de alojar en AWS, glosario, supuestos, tamaños de operación, qué falta saber.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
const FORMAS=()=>{ const aws=S.ui.cloud==='aws', n=CLS(), l=CL().l, T=CL().tag;
 return `<table><tr><th class="l">Opción</th><th class="l">Cómo es</th><th class="l">Ventaja</th><th class="l">Desventaja</th></tr>
 <tr><td class="l"><b>${T[1]}</b></td><td class="l">${aws?'Un servidor «todo incluido» de AWS donde corren todas las cajas juntas (incluida la base de datos).':`Una sola ${l.vm} (con su disco y su IP) donde corren todas las cajas juntas, incluida la base de datos. ${n} no tiene un paquete «todo incluido» como Lightsail: el costo es la suma de máquina + disco + IP + transferencia.`}</td><td class="l">${aws?'La más económica; precio fijo; la transferencia está incluida.':'Pocas piezas y la más sencilla de operar.'}</td><td class="l">Si el servidor falla, todo se cae hasta restaurar. Todo lo administra su equipo.</td></tr>
 <tr><td class="l"><b>${T[2]}</b></td><td class="l">Servidores (${l.srv}) para los programas y una base de datos administrada por ${n} (${l.db}) compartida.</td><td class="l">${n} cuida la base de datos (respaldos, parches).</td><td class="l">Más cara (servidores + base aparte + balanceador).</td></tr>
 <tr><td class="l"><b>${T[3]}</b></td><td class="l">Como B pero duplicada en dos ${l.zones}, con base de datos de respaldo en vivo.</td><td class="l">Sigue funcionando si una zona falla.</td><td class="l">Cuesta el doble o más que B.</td></tr>
 <tr><td class="l"><b>${T[4]}</b></td><td class="l">${n} ejecuta cada contenedor (${l.ctr}) por el equipo XiGOS, sin que el equipo administre servidores, + base ${l.db}.</td><td class="l">Cero administración de servidores.</td><td class="l">Cada caja siempre encendida suele salir más cara que en un servidor compartido.</td></tr></table>`; };

const GLOSARIO=`<dl class="gl">
  <dt>Operación pequeña, mediana o grande</dt><dd>Es el tamaño de la operación de UN cliente: cuántas zonas del mapa vigila, cuántos usuarios usan el panel, cuántas horas al día reportan sus GPS y cuántos correos y rutas alternas genera al mes. Se elige arriba y los números exactos se ven y cambian en «Supuestos y tamaños de uso». <b>No es la cantidad de dispositivos</b>: esa se registra en las fichas de dispositivos.</dd>
  <dt>Cliente</dt><dd>Una empresa que usa XiGOS (hoy: el cliente actual, PMI). Cada cliente recibe su propio «sistema», aislado de los demás.</dd>
  <dt>Instancia</dt><dd>El sistema completo de un cliente: sus pantallas, su programa y su base de datos. Es como darle a cada cliente su propia «oficina» en el mismo edificio.</dd>
  <dt>Contenedor</dt><dd>Una «caja» que guarda un programa con todo lo que necesita para funcionar. Cada instancia tiene varias cajas (panel, cerebro, tareas, base de datos). Cada caja usa memoria y procesador, y por eso cuesta dinero mantenerla encendida.</dd>
  <dt>Servidor (la «máquina» de AWS)</dt><dd>El computador en la nube donde viven las cajas. Se alquila por hora o por mes; el precio depende de cuánta memoria (RAM) tenga.</dd>
  <dt>RAM</dt><dd>La memoria de trabajo del computador. Es lo que más define cuántos clientes caben en un servidor.</dd>
  <dt>Hub</dt><dd>La «central» de XiGOS. Es única para todos los clientes: pregunta a los proveedores (tráfico, clima, rutas) y reparte la información. Así, si 50 clientes vigilan la misma ruta, se paga UNA sola consulta. Su servidor es un <b>costo fijo mensual</b> que no se multiplica por cliente.</dd>
  <dt>Worker</dt><dd><b>No es una persona.</b> Es un programa (una «caja» o contenedor) que cada cliente tiene funcionando en segundo plano: genera los informes PDF, sigue los viajes con el GPS y manda los avisos. Es el «robot» de tareas programadas.</dd>
  <dt>Celda</dt><dd>Un cuadro del mapa que el hub vigila (por defecto 0,75° ≈ 83 km por lado para tráfico y 0,5° para clima; se puede cambiar por proveedor, con tope de 10.000 km² por consulta en TomTom). Se cobra por celda consultada, no por cliente ni por dispositivo.</dd>
  <dt>Principal y respaldo</dt><dd>TomTom y HERE hacen el mismo trabajo. Uno es el principal y el otro el respaldo: si uno falla o no ve un incidente, el otro lo cubre.</dd>
  <dt>Petición / transacción</dt><dd>Cada vez que XiGOS le hace una pregunta a un proveedor. Los proveedores cobran por cada 1.000 preguntas.</dd>
  <dt>Capa gratuita</dt><dd>Cantidad de preguntas al mes que el proveedor regala. Pasado ese límite, empieza a cobrar.</dd>
  <dt>Costo promedio por dispositivo</dt><dd>Es el total mensual dividido entre la cantidad de dispositivos (GPS y bodycams), como repartir una cuenta entre los comensales. <b>No es lo que cuesta un dispositivo</b>: lo que cuesta cada uno es su equipo, SIM y plataforma (se ve en las fichas de dispositivos). Baja cuando hay más dispositivos porque los costos fijos se reparten entre más, y sube cuando hay pocos.</dd>
  <dt>Dispositivo GPS</dt><dd>El equipo instalado en un vehículo que reporta dónde está. Algunos se consultan por API de la plataforma de su proveedor. <b>Fortox asume el costo</b> del equipo, la SIM y la plataforma.</dd>
  <dt>Bodycam</dt><dd>Cámara corporal que funciona con la app Team Talk de Movistar. Fortox asume su costo (licencia, plan de datos, equipo, etc.), que se configura en la ficha «Team Talk».</dd>
  <dt>Team Talk (Movistar)</dt><dd>Aplicación de comunicación inmediata («push to talk») de Movistar con la que se manejan las bodycams. Movistar no publica sus precios.</dd>
  <dt>Costo duro</dt><dd>Lo que hay que pagar a proveedores y a AWS (servidores, datos, correo). Es dinero real que sale.</dd>
  <dt>Soporte y DevOps</dt><dd>Horas de personas que atienden a los clientes y mantienen el sistema. <b>Por ahora NO se cuentan en el costo</b>; se pueden activar en la ficha «Personal».</dd>
  <dt>Analista de inteligencia</dt><dd>Persona que aprueba y controla las rutas y los informes de los clientes. Se puede activar con un sueldo mensual y entra al costo promedio.</dd>
  <dt>Región São Paulo</dt><dd>El centro de datos de AWS más cercano a Colombia con precios oficiales verificados.</dd></dl>
 <div class="box info"><b>Idea central:</b> el costo viene de (1) <b>cada cliente nuevo</b>, porque necesita su propio sistema funcionando, (2) <b>cuántas zonas del mapa</b> se vigilan, porque los proveedores cobran por zona consultada, (3) <b>los dispositivos</b>: Fortox asume el equipo, la SIM y la plataforma de cada GPS y bodycam, así que más dispositivos = más presupuesto (los precios sin cotizar están en 0), y (4) <b>las personas</b> que operan el servicio (por ahora solo el analista de inteligencia, si se activa).</div>`;

const SUPS=[['g.ncap_km2','Territorio total de Colombia que se podría llegar a vigilar (km²)','Techo del gasto en tráfico: aunque haya miles de clientes, solo hay un territorio limitado por vigilar. El valor por defecto (347.800 km²) sale de 450 zonas de 0,25° (≈ 773 km² cada una), que el estudio estimó como ≈ 30 % de las 1.475 zonas de ese tamaño que cubren el país (≈ 1,14 millones de km²). Es una estimación sin dato real.'],
 ['g.cell_deg_tt','Zona que se consulta a TomTom (grados por lado)','0,75° ≈ 83 km por lado. TomTom acepta hasta 10.000 km² por consulta; con el margen de seguridad el tope es 0,853°. Zonas más grandes = menos consultas.'],
 ['g.cell_deg_here','Zona que se consulta a HERE (grados por lado)','0,75° ≈ 83 km. HERE no publica un límite en su guía; sus SDK usan 1°. Con el margen de seguridad el tope es 0,9°.'],
 ['g.cell_deg_weather','Zona de clima (grados por lado)','0,5° ≈ 56 km. Solo cambia las consultas de clima (que hoy son gratis).'],
 ['g.cell_safety','Margen de seguridad sobre el máximo (%)','90 % deja 10 % de holgura para nunca pasarse del límite del proveedor.'],
 ['g.qph_traffic','Consultas de tráfico por hora, por zona','2 = cada 30 min. Más consultas = más costo (12 por hora, cada 5 min, = 6 veces el costo actual). Equivale a los minutos de abajo.'],
 ['g.interval_traffic','… o cada cuántos minutos se consulta el tráfico','60 ÷ consultas por hora. A menor número, más consultas y más costo.'],
 ['g.qph_weather','Consultas de clima por hora, por zona de clima','1 = cada 60 min. Solo cuesta si se pasa del cupo gratis de OpenWeatherMap.'],
 ['g.interval_weather','… o cada cuántos minutos se consulta el clima','60 ÷ consultas por hora.'],
 ['g.usable','Uso máximo de memoria de un servidor','80 % deja holgura para picos (por ejemplo, al generar PDF).'],
 ['g.dbs_per_rds','Bases de datos por cada RDS','Cuántas bases pequeñas aguanta un RDS de 8 GB. No probado.'],
 ['g.row_bytes','Bytes que ocupa cada posición GPS guardada','Define el almacenamiento (no se pudo medir en la base real).'],
 ['g.retention_days','Días que se guardan las posiciones','Más días = más almacenamiento.'],
 ['g.base_gb','GB base de cada cliente (BD + PDF)','Sin posiciones.'],
 ['g.backup_factor','Veces que se guarda cada dato en respaldos','7 copias diarias comprimidas ≈ 2,8 veces el tamaño.'],
 ['g.route_cache_hit','Fracción de rutas que se reutilizan (memoria de 24 h)','0,5 = la mitad no se vuelve a calcular.'],
 ['g.lcu_avg','Capacidad promedio usada del balanceador (LCU)','Se cobra por uso; 1 es un servicio pequeño.'],
 ['g.ecr_gb','GB de imágenes Docker guardadas (ECR)','Las «cajas» se guardan en un registro de AWS.'],
 ['g.use_secrets','Usar Secrets Manager (1 = sí, 0 = no)','Guarda claves en AWS por US$ 0,40 cada una al mes. En A se usan archivos .env.'],
 ['g.secrets_per_instance','Claves por instancia','Si se usa Secrets Manager.'],
 ['g.logs_gb_task','GB de registros (logs) por contenedor Fargate al mes','Registros de funcionamiento en CloudWatch.'],
 ['g.kb_per_call','KB por consulta del hub a proveedores','Para estimar el tráfico por la puerta de salida.'],
 ['g.interaz_share','Fracción del tráfico interno que cruza entre zonas (solo C)','—'],
 ['g.domain_usd_month','Dominio (USD al mes)','No consultado: escriba su costo.'],
 ['g.migrate_min','Minutos al mes del contenedor «migrate»','Solo se enciende al actualizar.']];
const PROFROWS=[
 ['territory_km2','Territorio que vigila cada cliente (km²)','Territorio que recorren los vehículos de un cliente (sus rutas y zonas de operación). Medio = 4.640 km², que equivale a 6 zonas de 0,25° (el estudio lo ejemplificó con una ruta Bogotá–Zipaquirá); bajo = la mitad y alto = el doble. Es un supuesto: mida las rutas reales de cada cliente.'],
 ['hours_day','Horas al día con los GPS reportando','8 = una jornada de trabajo, 24 = operación continua y 12 queda en medio. Supuesto sin dato real: confírmelo con los reportes de su primer cliente.'],
 ['gps_nominal','Cada cuántos segundos reporta el equipo (XiGOS guarda máx. 1 por minuto)','XiGOS solo guarda una posición por minuto (es el límite de consulta de la plataforma), así que valores menores a 60 no cambian el almacenamiento.'],
 ['users','Usuarios del panel','Cuántas personas usan el panel de un cliente. Supuesto sin dato real.'],
 ['tiles_pu','Teselas de mapa por usuario al mes','Cuadritos de mapa que carga cada usuario. Solo cuesta si se cambia OpenStreetMap por un proveedor de mapas de pago. Supuesto sin dato real.'],
 ['emails','Correos al mes','Aprobaciones de informes, distribución y avisos. Hoy salen por Microsoft 365 y no suman. Dato real: la tabla de entregas de informes del sistema (doc 10).'],
 ['wa_msgs','Mensajes de WhatsApp al mes (si se implementa)','Solo cuenta si WhatsApp se incluye en el cálculo. Supuesto sin dato real.'],
 ['route_calls','Rutas alternas pedidas al mes','Antes de la memoria de 24 h. Dato real: el consumo por proveedor y los aciertos de esa memoria (doc 10).'],
 ['support_h','Horas de soporte al mes (solo si se activa soporte)','Supuesto sin dato real; solo cuenta si activa soporte y DevOps.'],
 ['onboard_h','Horas para instalar al cliente (una vez; solo si se activa soporte)','Supuesto sin dato real; solo cuenta si activa soporte y DevOps.']];
const PENDIENTES=`<table><tr><th class="l">Dato faltante</th><th class="l">Por qué importa</th><th class="l">Cómo conseguirlo</th></tr>
 <tr><td class="l">Precio por dispositivo de cada proveedor GPS (equipo, instalación, SIM y plataforma) y del plan Team Talk de Movistar para las bodycams (licencia, datos, equipo)</td><td class="l">Fortox asume estos costos: hoy están en 0 y los totales quedan por debajo de la realidad</td><td class="l">Cotización a cada proveedor GPS y a Movistar Empresas (#709 o su ejecutivo)</td></tr>
 <tr><td class="l">Términos de HERE y TomTom para rastreo de activos y servicio a varios clientes</td><td class="l">HERE podría pasar a contrato (precio por cotización)</td><td class="l">Preguntas por escrito a cada proveedor</td></tr>
 <tr><td class="l">Licencias comerciales de Open-Meteo, OpenRouteService y OpenWeatherMap (plan gratis)</td><td class="l">Hoy se asumen gratis</td><td class="l">Consultar a cada proveedor</td></tr>
 <tr><td class="l">Intermediario (BSP) de WhatsApp, Microsoft 365, dominio, soporte AWS, Savings Plans</td><td class="l">Costos fijos menores</td><td class="l">Cotizar</td></tr>
 <tr><td class="l">Memoria real de cada contenedor y tamaño real de las tablas</td><td class="l">Es el supuesto que más mueve el costo de infraestructura</td><td class="l">Construir las imágenes y medir con <code>docker stats</code>; consultar tamaños en la base del cliente actual (PMI)</td></tr>
 <tr><td class="l">Cuántos dispositivos GPS y bodycams reales tiene cada cliente y cada cuánto reportan</td><td class="l">Define el costo de equipos y plataformas, el almacenamiento y las consultas</td><td class="l">Dato de los clientes; prueba con vehículos en movimiento</td></tr>
 <tr><td class="l">Azure: unidad de precio de PostgreSQL (¿por servidor o por núcleo?) y de Container Apps. Google Cloud: máquinas, discos, NAT y almacenamiento vienen de una tabla abierta basada en la API oficial (no de la página de Google)</td><td class="l">Cambian el costo de las formas B, C y D en esas nubes</td><td class="l">Calculadora oficial de Azure; calculadora oficial de Google (región southamerica-east1); detalle en el documento 13</td></tr>
 <tr><td class="l">Latencia real desde Colombia a São Paulo en cada nube, y qué servicios exclusivos de AWS usa la aplicación (SES, S3…)</td><td class="l">Define si cambiar de nube es viable</td><td class="l">Prueba de ping/traceroute desde una oficina de Fortox; preguntar al equipo de desarrollo</td></tr>
 <tr><td class="l">Impuestos (IVA, retenciones) de servicios del exterior</td><td class="l">Costo final en pesos</td><td class="l">Contador</td></tr></table>
 <div class="box ok"><b>Recomendación para empezar (hasta ~10 clientes; previsión de 4 en 12 meses):</b> alojamiento A (un Lightsail de São Paulo), respaldos a S3. Pasar a B/C/D solo por requisito de disponibilidad, y antes medir la memoria real de los contenedores.</div>`;
const CONN_RULES=()=>{ const t=effT(S), aws=S.ui.cloud==='aws', n=CLS();
 return `<ul>
 <li><b>Entrada a ${n} (lo que llega):</b> ${aws?'gratis.':'gratis (dato de AWS; en '+n+' no se verificó expresamente).'}</li>
 <li><b>Salida a Internet:</b> US$ ${t.dto} por GB en ${aws?'B, C y D':'todas las formas'}${aws?' (el primer GB del mes es gratis). En Lightsail (A) viene incluida (hasta 4 TB en el plan de 4 GB).':(t.dto_free>0?`; los primeros ${fmt(t.dto_free,0)} GB al mes son gratis.`:'. No se verificó un cupo gratis mensual.')}</li>
 <li><b>Entre contenedores en el mismo servidor/zona:</b> gratis. <b>Entre dos zonas de ${n}</b> (solo en C): ${t.inter_az>0?`US$ ${t.inter_az} por GB en cada sentido.`:'precio PENDIENTE (hoy cuenta como 0).'}</li>
 <li><b>«Puerta de salida» NAT</b> (C y D): US$ ${t.nat} por hora (≈ US$ ${fmt(t.nat*t.hours)} al mes) <b>más</b> US$ ${t.nat_gb} por cada GB que pasa.</li>
 <li><b>IP pública:</b> US$ ${t.ipv4} por hora cada una (≈ US$ ${fmt(t.ipv4*t.hours)} al mes). ${aws?'Lightsail ya la incluye.':'En la forma A ya está sumada dentro del precio de la máquina.'}</li>
 <li><b>Hacia los proveedores de datos:</b> lo que cobra ${n} es mínimo; lo que cobra cada proveedor está en la sección de proveedores.</li>
 <li><b>Mapas de OpenStreetMap:</b> el navegador del usuario los descarga directo; no pasan por ${n}.</li></ul>`; };

