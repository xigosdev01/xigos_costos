/* ============================================================
   MODELO DE COSTOS: valores por defecto (DEF), tarifas por tramos y la función calc(). Sin pantallas ni DOM.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
/*MODEL-START*/
const DEF = {
 t: { trm:3228.26, eurusd:1.1165,
  here_free:5000, here_t1_to:200000, here_t1:2.92, here_t2_to:1000000, here_t2:2.33, here_t3_to:5000000, here_t3:2.05, here_t4_to:20000000, here_t4:0.88, here_t5:0.58,
  here_route_free:30000, here_route:0.88,
  tt_free:2500, tt_t1_to:1000000, tt_t1:2.00, tt_t2_to:5000000, tt_t2:1.60, tt_t3:1.30, tt_route_free:20000, tt_route:1.00, tt_route_t2:0.80, tt_route_t3:0.65,
  tt_tile_free:200000, tt_tile:0.10, tt_tile2:0.08, tt_tile3:0.07,
  ors_free_month:60000, owm_free:1000000, owm_p1:30, owm_p2:140, owm_p3:370, owm_p4:1200, owm_gbpusd:0,
  wa_marketing:0.0125, wa_utility:0.0008, wa_auth:0.0008, wa_service:0.0008,
  ls_4:23.54, ls_8:43.16, ls_16:82.42, ls_32:160.91, ls_disk:0.10,
  ec2_t3l:0.1344, rds_single:0.275, rds_multi:0.55, rds_gp3_s:0.219, rds_gp3_m:0.438, ebs_gp3:0.152,
  alb:0.034, lcu:0.011, nat:0.093, nat_gb:0.093, s3:0.0405, dto:0.25, cw_logs:0.90, ses:0.00016, hours:730,
  fg_vcpu:0.0696, fg_gb:0.0076, ipv4:0.005, inter_az:0.01, ecr:0.10, r53_zone:0.50, secret:0.40, dto_free:0, ecr_fixed:0, logs_free:0,
  ows_req:0.003, apify_starter:19, apify_scale:199, apify_business:999 },
 g: { ncap_km2:347800, cell_deg_tt:0.75, cell_deg_here:0.75, cell_deg_weather:0.5, cell_safety:90, interval_traffic:30, qph_traffic:2, interval_weather:60, qph_weather:1, qph_ows:1, wa_mkt_pct:0, usable:0.8, dbs_per_rds:25, backup_factor:2.8, row_bytes:250, retention_days:30,
  base_gb:2.2, os_gb:15, logs_gb_server:5, logs_gb_task:1, ebs_app_gb:30, rds_os_gb:20, route_cache_hit:0.5,
  labor_rate:20, devops_base_h:20, devops_h_client:0.1, iva:0.19, pay_fee:0.03,
  lcu_avg:1, ecr_gb:12, use_secrets:0, secrets_per_instance:6, kb_per_call:20, interaz_share:0.5, domain_usd_month:0, migrate_min:10,
  ows_calls_cell:720, apify_plan:1, inrix_usd:0, gmaps_usd:0,
  backup_primary:1, backup_pct:100, gps_life:36, bc_gb:0, bc_qty:0, bc_scope:'total', analyst_salary_cop:0, analyst_factor:1, analyst_count:1, analyst_per_clients:0,
  m365_usd:0, rk_cost:3, rk_avail:2, rk_backup:2, rk_ops:1, rk_scale:1 },
 // Tarifas de infraestructura de OTRAS nubes (São Paulo / Brasil Sur), consultadas el 2026-11-10. Cada clave reemplaza a la de AWS con el mismo nombre (ver js/clouds.js para fuentes y confianza).
 // Un 0 marcado PENDIENTE en js/clouds.js significaría «precio sin verificar» (NO es gratis). Mes = 730 h.
 tc: {
  gcp: { // Máquinas, discos, IP, NAT y almacenamiento: tabla abierta generada el 2026-11-05 desde la API oficial de Google (MEDIA; el egreso 0,19, la IP sin usar 0,015 y el disco SSD 0,255 coinciden con las páginas oficiales).
   // Cloud SQL, balanceador, Cloud Run, registros, DNS, secretos, Artifact Registry y tráfico entre zonas: leídos de las páginas oficiales de Google con región São Paulo el 2026-11-10 (ALTA).
   // Opción A = servidor e2 + disco balanced del tamaño del paquete + IP pública: e2-medium 38.83+80x0.15+3.65 · e2-standard-2 77.65+160x0.15+3.65 · e2-standard-4 155.30+320x0.15+3.65 · e2-standard-8 310.60+640x0.15+3.65
   ls_4:54.48, ls_8:105.30, ls_16:206.95, ls_32:410.25, ls_disk:0.15,
   ec2_t3l:0.1063704, ebs_gp3:0.15, ipv4:0.005,
   rds_single:0.208, rds_multi:0.4158, rds_gp3_s:0.255, rds_gp3_m:0.51,   // Cloud SQL Enterprise, 2 vCPU (0,062/h c/u) + 8 GiB (0,0105/GiB-h); alta disponibilidad 2 x 0,1239 + 8 x 0,021; disco SSD 0,000349315 y 0,00069863 por GiB-hora
   alb:0.025, lcu:0,                                                    // Cloud Load Balancing: 0,025/h las primeras 5 reglas; datos procesados 0,012/GiB (no modelado: centavos)
   nat:0.0448, nat_gb:0.045, s3:0.035, dto:0.19, dto_free:0, cw_logs:0.50, logs_free:50, inter_az:0.01,   // Cloud Logging 0,50/GiB con 50 GiB gratis por proyecto
   fg_vcpu:0.07776, fg_gb:0.00864,                                      // Cloud Run, CPU siempre asignada, Tier 2 (São Paulo): 0,0000216 por vCPU-s y 0,0000024 por GiB-s
   ecr:0.10, ecr_fixed:0, r53_zone:0.20, secret:0.06, hours:730 },      // Artifact Registry 0,10/GB-mes; Cloud DNS 0,20/zona; Secret Manager 0,06 por versión activa
  azure: { // Fuente: API pública oficial de precios de Azure, región Brazil South (ALTA salvo lo marcado)
   // Opción A = VM + disco Standard SSD + IP: B2s 49.06+E10 17.92+3.65 · B2ms 97.82+E15 35.84+3.65 · B4ms 196.37+E20 71.68+3.65 · B8ms 392.74+E30 143.36+3.65
   ls_4:70.63, ls_8:137.31, ls_16:271.70, ls_32:539.75, ls_disk:0.14,
   ec2_t3l:0.134, ebs_gp3:0.14, ipv4:0.005,
   rds_single:0.24, rds_multi:0.48, rds_gp3_s:0.2185, rds_gp3_m:0.437, // PostgreSQL Flexible, General Purpose D2ds v5 (la alta disponibilidad exige General Purpose; el servidor de reserva se cobra igual) — MEDIA
   alb:0.40, lcu:0.008,                                                 // Application Gateway Standard v2 (equivale al ALB); el balanceador L4 cuesta 0,025/h pero no enruta por dominio
   nat:0.045, nat_gb:0.045, s3:0.0326, dto:0.181, dto_free:100, cw_logs:4.6, logs_free:5, inter_az:0.01,
   fg_vcpu:0.0864, fg_gb:0.0108,                                        // Container Apps (consumo), tarifa «activa» = cota máxima; MEDIA
   ecr:0, ecr_fixed:20.27, r53_zone:0.50, secret:0, hours:730 } },      // DNS zona pública 0,50 (primeras 25); Key Vault no cobra por secreto (0,03 por 10 mil operaciones)
 // Operación de UN cliente: [pequeña, mediana, grande, personalizada]. La 4.ª («personalizada») arranca como copia de la mediana y es la que el usuario ajusta a su medida.
 p: { territory_km2:[2320,4640,9280,4640],  hours_day:[8,12,24,12], gps_nominal:[60,30,10,30], users:[3,8,20,8], tiles_pu:[1500,3000,6000,3000],
  emails:[200,600,1500,600], wa_msgs:[100,500,1000,500], route_calls:[100,500,2000,500], support_h:[1,2,4,2], onboard_h:[6,12,20,12] },
 // contenedores: ramUse = GB reales que usa; cpu/mem = tamaño reservado en Fargate; fg = corre en Fargate; db = base de datos (en RDS si no es servidor propio)
 ctr: [
  {id:'web',scope:'inst',name:'web (panel: nginx)',ram:0.05,cpu:0.25,mem:0.5,fg:1,db:0,what:'Muestra el panel web (pantallas, mapas) al usuario.'},
  {id:'api',scope:'inst',name:'api (cerebro del cliente)',ram:0.5,cpu:0.5,mem:1,fg:1,db:0,what:'Recibe lo que hace el usuario, valida permisos, lee y escribe en la base de datos y entrega los PDF.'},
  {id:'worker',scope:'inst',name:'worker (tareas programadas)',ram:0.3,cpu:0.5,mem:1,fg:1,db:0,what:'Trabaja solo en segundo plano: genera informes PDF, consulta al hub, sigue los viajes y manda avisos.'},
  {id:'migrate',scope:'inst',name:'migrate (actualiza la base)',ram:0,cpu:0.25,mem:0.5,fg:2,db:0,what:'Se enciende unos minutos solo cuando hay una versión nueva y se apaga. No está encendido todo el mes.'},
  {id:'db',scope:'inst',name:'db (base de datos PostgreSQL)',ram:0.35,cpu:0,mem:0,fg:0,db:1,what:'Guarda los datos del cliente: viajes, posiciones GPS, informes, usuarios. Es lo más delicado: se respalda.'},
  {id:'sys_i',scope:'inst',name:'Sistema y Docker (reserva)',ram:0.05,cpu:0,mem:0,fg:0,db:0,what:'Memoria que el propio servidor necesita para funcionar (no es un contenedor).'},
  {id:'hub_api',scope:'hub',name:'hub-api (atiende a todas las instancias)',ram:0.4,cpu:0.5,mem:1,fg:1,db:0,what:'Entrega a cada instancia las alertas y novedades, controla el acceso (login único) y las versiones.'},
  {id:'hub_col',scope:'hub',name:'hub-collector (consulta proveedores)',ram:0.3,cpu:0.25,mem:0.5,fg:1,db:0,what:'Cada 30 minutos pregunta a TomTom, HERE, clima y rutas. SOLO puede haber uno encendido.'},
  {id:'hub_web',scope:'hub',name:'hub-web (panel del hub)',ram:0.05,cpu:0.25,mem:0.5,fg:1,db:0,what:'Panel de administración de Fortox.'},
  {id:'proxy',scope:'hub',name:'proxy Caddy (candado HTTPS)',ram:0.05,cpu:0,mem:0,fg:0,db:0,what:'Pone el candado HTTPS y reparte el tráfico a cada cliente. En AWS con balanceador (ALB) no hace falta.'},
  {id:'hub_db',scope:'hub',name:'hub-db (base de datos del hub)',ram:0.5,cpu:0,mem:0,fg:0,db:1,what:'Guarda lo que el hub ha recogido de los proveedores y el registro de clientes.'},
  {id:'sys_h',scope:'hub',name:'Sistema y Docker (reserva)',ram:0.2,cpu:0,mem:0,fg:0,db:0,what:'Memoria que el servidor necesita para sí mismo.'} ],
 // conexiones: gb = GB por cliente y mes (supuesto); net: egress = sale a Internet (AWS cobra), nat = además pasa por la «puerta de salida» (NAT) en AWS con redes privadas; int = interna
 conn: [
  {id:'users',name:'Usuario ↔ web/API (lo que ve en pantalla)',gb:0.6,net:'egress',what:'Páginas, datos y PDF que el navegador descarga. Lo que entra a AWS es gratis; lo que sale se cobra.'},
  {id:'feed',name:'Instancia ↔ hub (alertas, latido, login)',gb:0.15,net:'nat',what:'La instancia pregunta al hub por novedades y le avisa que está viva.'},
  {id:'eje',name:'worker → plataformas GPS (posiciones por API)',gb:0.10,net:'nat',what:'Una consulta por minuto con las posiciones de los dispositivos GPS del cliente.'},
  {id:'smtp',name:'api/worker → correo (SMTP)',gb:0.05,net:'nat',what:'Correos de aprobación de informes, avisos y distribución.'},
  {id:'push',name:'api → avisos del navegador (Web Push)',gb:0.02,net:'nat',what:'Notificaciones al celular o computador.'},
  {id:'misc',name:'Otros (actualizaciones, respaldos hacia fuera)',gb:0.08,net:'nat',what:'Descarga de versiones nuevas, pruebas de conexión, etc.'},
  {id:'int',name:'api/worker ↔ base de datos y web ↔ api',gb:3.0,net:'int',what:'Conversación interna entre los contenedores del mismo cliente. En el mismo servidor o zona no se cobra.'} ],
 extras: [
  {id:'ows',name:'OpenWeb Ninja — API Waze (incidentes de conductores)',on:0},
  {id:'apify',name:'Apify (plataforma de «extracción de datos»)',on:0},
  {id:'inrix',name:'INRIX (tráfico analítico, por cotización)',on:0},
  {id:'gmaps',name:'Google Maps Platform (solo si un cliente lo exige)',on:0} ],
 // Proveedores de dispositivos GPS (colección editable: se agregan y quitan). Cada uno indica CUÁNTOS dispositivos tiene (qty) y sus costos POR DISPOSITIVO; Fortox asume el costo.
 // No hay porcentajes: el total de dispositivos es la suma de las cantidades. scope: 'total' (qty es el total de la operación) o 'client' (qty por cada cliente).
 // mode: 'buy' = equipo comprado (pago único) · 'rent' = renta mensual del equipo · 'included' = el equipo va incluido en la mensualidad (solo se escribe la mensualidad).
 // cur: moneda en que cotiza el proveedor (todos sus valores). life: vida útil en meses (0 = usar la general). Sin cotizaciones: todo en 0.
 gps: [ {name:'Proveedor A',contact:'',qty:0,scope:'total',mode:'buy',cur:'COP',equip:0,install:0,rent:0,sim:0,plat:0,other:0,life:0},
        {name:'Proveedor B',contact:'',qty:0,scope:'total',mode:'included',cur:'COP',equip:0,install:0,rent:0,sim:0,plat:0,other:0,life:0} ],
 // Plan de la app Team Talk (Movistar) para las bodycams. No hay precios públicos: cada concepto es editable y empieza en 0. on = 1 lo incluye en el cálculo.
 // basis: dev_month = por bodycam al mes · dev_once = por bodycam, pago único repartido en la vida útil · dev_once_fixed = por bodycam, pago único (no se reparte)
 //        client_month = por cliente con bodycams, al mes · fixed_month = cargo fijo al mes · gb_month = por GB de video al mes · block_month = por bloque de N bodycams, al mes
 talkteam: [ {name:'Licencia de la app Team Talk',basis:'dev_month',value:0,cur:'COP',size:0,on:1},
             {name:'Plan de datos (SIM) de la bodycam',basis:'dev_month',value:0,cur:'COP',size:0,on:1},
             {name:'Equipo bodycam (compra)',basis:'dev_once',value:0,cur:'COP',size:0,on:1},
             {name:'Instalación o configuración por bodycam',basis:'dev_once_fixed',value:0,cur:'COP',size:0,on:1},
             {name:'Cargo fijo por cliente',basis:'client_month',value:0,cur:'COP',size:0,on:1},
             {name:'Cargo fijo de la cuenta corporativa',basis:'fixed_month',value:0,cur:'COP',size:0,on:1},
             {name:'Paquete por bloque de bodycams',basis:'block_month',value:0,cur:'COP',size:0,on:1},
             {name:'Almacenamiento o transferencia de video (por GB)',basis:'gb_month',value:0,cur:'USD',size:0,on:1} ],
 ui: { N:1, prof:1, arch:1, cloud:'aws', fx_trm_date:'2026-11-06', fx_eur_date:'2026-11-06', ses:0, wa:0, tiles:0, gps:1, gps_amort:1, analyst:0, sd_on:0, unit:'usd', scales:[1,5,10,25,50,100,250,500,1000] },
 // qué secciones salen en el reporte impreso (1 = incluir)
 rep: { resumen:1, glosario:0, diagrama:1, traffic:1, ors:1, owm:1, eje:1, talkteam:1, osm:0, mail:0, push:0, wa:0, ows:0, wazeoff:0, apify:0, inrix:0, gmaps:0, gov:0,
        personal:1, graficas:1, gr_desglose:1, gr_crecimiento:1, gr_promedio:1, gr_vehiculo:1, gr_sens:1, gr_aws:0, gr_nubes:1, gr_trafico:0, gr_analista:1, aws:1, containers:1, conexiones:0, awsrates:0, proy:1, comp:1, supuestos:0, pendientes:1 }
};
const clone = o => JSON.parse(JSON.stringify(o));

function tierHere(c, t){
 return Math.max(0,Math.min(c,t.here_t1_to)-t.here_free)/1000*t.here_t1 + Math.max(0,Math.min(c,t.here_t2_to)-t.here_t1_to)/1000*t.here_t2
  + Math.max(0,Math.min(c,t.here_t3_to)-t.here_t2_to)/1000*t.here_t3 + Math.max(0,Math.min(c,t.here_t4_to)-t.here_t3_to)/1000*t.here_t4 + Math.max(0,c-t.here_t4_to)/1000*t.here_t5;
}
function tierTTeur(c, t){
 return Math.max(0,Math.min(c,t.tt_t1_to)-t.tt_free)/1000*t.tt_t1 + Math.max(0,Math.min(c,t.tt_t2_to)-t.tt_t1_to)/1000*t.tt_t2 + Math.max(0,c-t.tt_t2_to)/1000*t.tt_t3;
}
// Tamaño de la zona (celda) que se consulta, en GRADOS, uno por proveedor. Referencia histórica: 0,25° (≈ 27,8 km por lado).
// Tope de TomTom Incident Details: 10.000 km² por petición (docs.tomtom.com/traffic-api/documentation/traffic-incidents/incident-details).
// HERE v7 no publica un límite en sus guías; sus SDK limitan el cuadro a 1° de ancho y de alto (referencia NO oficial). A ambos se les aplica el margen de seguridad (por defecto 90 %).
// Un grado ≈ 111,2 km (en Colombia la diferencia por latitud es menor al 2 %).
const CELL0_DEG=0.25, DEG_KM=111.2, TT_MAX_KM2=10000, HERE_REF_DEG=1;
const safetyF=g=>Math.min(100,Math.max(1,g.cell_safety))/100;
const degMax=(g,prov)=>prov==='tt'?Math.sqrt(TT_MAX_KM2*safetyF(g))/DEG_KM:HERE_REF_DEG*safetyF(g);   // lado máximo permitido (°) por proveedor
const degReq=(g,prov)=>prov==='tt'?g.cell_deg_tt:prov==='here'?g.cell_deg_here:g.cell_deg_weather;
const degEff=(g,prov)=>{ const d=degReq(g,prov)>0?degReq(g,prov):CELL0_DEG; return prov==='weather'?Math.max(0.05,d):Math.min(Math.max(d,0.05),degMax(g,prov)); };   // lado realmente usado (nunca pasa del máximo)
// TomTom Routing (EUR): 20.000 gratis al mes; 20 mil–1 M: t.tt_route; 1–5 M: t.tt_route_t2; 5–10 M: t.tt_route_t3 (más de 10 M: sin tarifa publicada, se usa la del último tramo)
function tierTTroute(c, t){
 return Math.max(0,Math.min(c,1e6)-t.tt_route_free)/1000*t.tt_route + Math.max(0,Math.min(c,5e6)-1e6)/1000*t.tt_route_t2 + Math.max(0,c-5e6)/1000*t.tt_route_t3;
}
function ramSums(s){
 let r={A:0,B:0,hA:0,hB:0};
 for(const c of s.ctr){ if(c.scope==='inst'){ r.A+=c.ram; if(!c.db) r.B+=c.ram; } else { r.hA+=c.ram; if(!c.db) r.hB+=c.ram; } }
 return r;
}
// Tarifas vigentes según la nube elegida: las de AWS son s.t; las de Google Cloud / Azure reemplazan solo las claves de infraestructura (s.tc[nube]).
const effT=(s,cl)=>{ cl=cl||s.ui.cloud||'aws'; return cl==='aws'||!s.tc||!s.tc[cl]?s.t:Object.assign({},s.t,s.tc[cl]); };
// Objeto editable de tarifas de la nube elegida (para pantallas y sensibilidad).
const cloudRates=(s,cl)=>{ cl=cl||s.ui.cloud||'aws'; return cl==='aws'||!s.tc||!s.tc[cl]?s.t:s.tc[cl]; };
function fargateMonth(s, scope, t){ // USD/mes de los contenedores (Fargate / Cloud Run / Container Apps) de una instancia (scope inst) o del hub
 t=t||s.t; const g=s.g; let u=0;
 for(const c of s.ctr){ if(c.scope!==scope||!c.fg) continue;
  const perH=c.cpu*t.fg_vcpu+c.mem*t.fg_gb;
  u += c.fg===2 ? perH*(g.migrate_min/60) : perH*t.hours;
  if(scope==='hub' && c.id==='proxy') u-=0;
 }
 return u;
}
function fargateTasks(s, scope){ return s.ctr.filter(c=>c.scope===scope&&c.fg===1).length; }
const ARCH = {1:'A · Un servidor Lightsail (Docker Compose)',2:'B · Servidores EC2 + base RDS',3:'C · B con alta disponibilidad (2 zonas)',4:'D · Contenedores administrados (ECS Fargate) + RDS'};

function calc(N, pi, s, opt){
 const g=s.g; opt=opt||{}; const cl=opt.cloud||s.ui.cloud||'aws', t=effT(s,cl);
 const arch=opt.arch||s.ui.arch, wa=opt.wa===undefined?s.ui.wa:opt.wa, tiles=opt.tiles===undefined?s.ui.tiles:opt.tiles;
 const p={}; for(const k in s.p) p[k]=s.p[k][pi];
 const o={N,cloud:cl}; const H=t.hours; const u=g.usable; const R=ramSums(s);
 // Dispositivos: GPS = suma de las cantidades de los proveedores (qty total, o por cliente si scope='client'). Bodycams = cantidad de la ficha Team Talk.
 // opt.gps_total (solo para gráficas/sensibilidad) reparte un total de GPS distinto en proporción a las cantidades (o al primer proveedor si todas están en 0).
 const rawQ=s.gps.map(gp=>(+gp.qty||0)*(gp.scope==='client'?N:1)), baseG=rawQ.reduce((a,b)=>a+b,0);
 const gq=opt.gps_total===undefined?rawQ:rawQ.map((q,i)=>baseG>0?q*opt.gps_total/baseG:(i===0?opt.gps_total:0));
 o.gps_devices=gq.reduce((a,b)=>a+b,0); o.bodycams=(+g.bc_qty||0)*(g.bc_scope==='client'?N:1); o.devices=o.gps_devices+o.bodycams;
 // Zonas (celdas) vigiladas, por proveedor. El territorio que vigila cada cliente (km²) y el total del país a vigilar se dividen entre el área de la zona de cada proveedor:
 // con celdas más grandes hacen falta menos (mínimo 1 por cliente) y el tope de celdas del país baja en la misma proporción.
 const zones=deg=>{ const A=(deg*DEG_KM)*(deg*DEG_KM), cpc=Math.max(1,p.territory_km2/A), nc=Math.max(1,g.ncap_km2/A); return nc*(1-Math.exp(-N*cpc/nc)); };
 o.deg_tt=degEff(g,'tt'); o.deg_here=degEff(g,'here'); o.deg_weather=degEff(g,'weather');
 o.cells_tt=zones(o.deg_tt); o.cells_here=zones(o.deg_here); o.cells=g.backup_primary===1?o.cells_tt:o.cells_here;   // o.cells = zonas del proveedor principal
 const cpm=43200/g.interval_traffic;
 o.traffic_calls=o.cells*cpm;
 // HERE y TomTom siempre están: uno es el principal (100 % de las consultas) y el otro el respaldo (backup_pct % de las consultas)
 const bk=g.backup_pct/100, prim=g.backup_primary===1;
 const ttCalls=o.cells_tt*cpm*(prim?1:bk), hereCalls=o.cells_here*cpm*(prim?bk:1);
 o.tt_calls=ttCalls; o.here_calls=hereCalls;
 o.here=tierHere(hereCalls,t); o.tomtom=tierTTeur(ttCalls,t)*t.eurusd;
 o.traffic = o.here+o.tomtom;
 o.nprov = 1+bk;
 // Clima: su propia zona (por defecto 0,5° ≈ 55 km), independiente de las de tráfico
 const Aw=(o.deg_weather*DEG_KM)*(o.deg_weather*DEG_KM), cw=Math.max(1,p.territory_km2/Aw), ncw=Math.max(1,g.ncap_km2/Aw);
 o.wcells=Math.max(1,ncw*(1-Math.exp(-N*cw/ncw))); o.wcalls=o.wcells*43200/g.interval_weather; o.weather_ok=o.wcalls<=t.owm_free?1:0;
 o.route_calls=N*p.route_calls*(1-g.route_cache_hit);
 // Rutas: primero se usa el cupo gratis de OpenRouteService; lo que sobra va a TomTom Routing (20.000 gratis al mes y luego por tramos: 1 M, 5 M, 10 M)
 o.tt_route_vol=Math.max(0,o.route_calls-t.ors_free_month); o.routing=tierTTroute(o.tt_route_vol,t)*t.eurusd;
 // Clima: gratis dentro del cupo de OpenWeatherMap; si se pasa, el plan de pago más pequeño que alcance (precio en GBP; hace falta escribir GBP→USD)
 o.weather_plan=0; o.weather_cost=0;
 if(o.wcalls>t.owm_free){ const pl=[[t.owm_p1,10e6],[t.owm_p2,100e6],[t.owm_p3,1e9],[t.owm_p4,3e9]]; const k=pl.findIndex(x=>o.wcalls<=x[1]); o.weather_plan=k<0?5:k+1; o.weather_cost=k<0?0:pl[k][0]*t.owm_gbpusd; }
 const posDev=p.hours_day*3600*30/Math.max(p.gps_nominal,60);
 o.pos_month=o.gps_devices*posDev;   // solo los GPS reportan posiciones; el video de las bodycams se cuenta en el plan Team Talk
 o.pos_gb=o.pos_month*g.row_bytes*g.retention_days/30/1e9;
 o.data_gb=o.pos_gb+N*g.base_gb;
 o.backups=o.data_gb*g.backup_factor*t.s3;
 // transferencias
 let egressPerClient=0,natPerClient=0,intPerClient=0;
 for(const c of s.conn){ if(c.net==='egress'){egressPerClient+=c.gb;} else if(c.net==='nat'){egressPerClient+=c.gb;natPerClient+=c.gb;} else intPerClient+=c.gb; }
 const egressGB=N*egressPerClient; o.egress_gb=egressGB;
 o.hubnat_gb=(ttCalls+hereCalls)*g.kb_per_call/1e6;
 o.nat_gb=N*natPerClient+o.hubnat_gb;
 // ---- A: Lightsail
 const need=R.hA+N*R.A; o.A_need=need;
 let cost,disk,srv;
 if(need<=u*4){cost=t.ls_4;disk=80;srv=1;} else if(need<=u*8){cost=t.ls_8;disk=160;srv=1;} else if(need<=u*16){cost=t.ls_16;disk=320;srv=1;} else if(need<=u*32){cost=t.ls_32;disk=640;srv=1;}
 else {srv=Math.ceil(need/(u*32));cost=srv*t.ls_32;disk=srv*640;}
 o.A_servers=srv; const xdisk=Math.max(0,o.data_gb+g.os_gb*srv-disk)*t.ls_disk;
 const dnsFix=t.r53_zone+g.domain_usd_month;
 const dtoCost=Math.max(0,egressGB-t.dto_free)*t.dto;   // dto_free: GB gratis al mes (Azure: 100; AWS y Google: 0 porque no se verificó un cupo)
 // En Lightsail la transferencia viene incluida en el plan; en Google Cloud y Azure no existe ese paquete, así que la salida a Internet se cobra también en A.
 o.A_parts=cl==='aws'?{servidores:cost,disco_extra:xdisk,respaldos:o.backups,dns_dominio:dnsFix}:{servidores:cost,disco_extra:xdisk,transferencia_salida:dtoCost,respaldos:o.backups,dns_dominio:dnsFix};
 o.A=Object.values(o.A_parts).reduce((a,b)=>a+b,0);
 // ---- B / C / D comunes
 const appneed=R.hB+N*R.B; const napp=Math.ceil(appneed/(u*8)); const rdsn=Math.ceil((1+N)/g.dbs_per_rds);
 o.B_napp=napp; o.B_rds=rdsn;
 const albFix=t.alb*H, albLcu=g.lcu_avg*t.lcu*H, albIp=2*t.ipv4*H;
 const secrets=g.use_secrets?(N*g.secrets_per_instance+8)*t.secret:0;
 const ecr=g.ecr_gb*t.ecr+t.ecr_fixed;
 const common={ecr:ecr,dns_dominio:dnsFix,secretos:secrets,respaldos:o.backups};
 const logsCost=gb=>Math.max(0,gb-t.logs_free)*t.cw_logs;   // logs_free: GB gratis al mes (Google 50 por proyecto, Azure 5; AWS 0 porque no se modela)
 // B
 const bp={servidores_ec2:napp*t.ec2_t3l*H,discos_ebs:napp*g.ebs_app_gb*t.ebs_gp3,ip_publica_servidores:napp*t.ipv4*H,base_rds:rdsn*t.rds_single*H,
  almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_s,balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,
  transferencia_salida:dtoCost,logs_cloudwatch:logsCost((napp+rdsn)*g.logs_gb_server),...common};
 o.B_parts=bp; o.B=Object.values(bp).reduce((a,b)=>a+b,0);
 // C
 const nappC=napp*2; const natFix=t.nat*H;
 const cp={servidores_ec2:nappC*t.ec2_t3l*H,discos_ebs:nappC*g.ebs_app_gb*t.ebs_gp3,base_rds_multi_az:rdsn*t.rds_multi*H,almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_m,
  balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,nat_hora:natFix,nat_datos:o.nat_gb*t.nat_gb,transferencia_salida:dtoCost,
  entre_zonas:N*intPerClient*g.interaz_share*t.inter_az*2,logs_cloudwatch:logsCost((nappC+rdsn*2)*g.logs_gb_server),...common};
 o.C_parts=cp; o.C=Object.values(cp).reduce((a,b)=>a+b,0);
 // D: Fargate
 const fgI=fargateMonth(s,'inst',t), fgH=fargateMonth(s,'hub',t); const ntask=N*fargateTasks(s,'inst')+fargateTasks(s,'hub');
 o.D_fg_inst=fgI; o.D_fg_hub=fgH;
 const dp={contenedores_fargate_clientes:N*fgI,contenedores_fargate_hub:fgH,base_rds:rdsn*t.rds_single*H,almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_s,
  balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,nat_hora:natFix,nat_datos:o.nat_gb*t.nat_gb,transferencia_salida:dtoCost,
  logs_cloudwatch:logsCost(ntask*g.logs_gb_task),...common};
 o.D_parts=dp; o.D=Object.values(dp).reduce((a,b)=>a+b,0);
 o.infra=[0,o.A,o.B,o.C,o.D][arch];
 o.infra_parts=[null,o.A_parts,o.B_parts,o.C_parts,o.D_parts][arch];
 // Correo: hoy sale por la cuenta de Microsoft 365 que XiGOS ya tiene (no suma). Solo cuesta si se activa Amazon SES o si se escribe un costo de licencia.
 o.email_ses=N*p.emails*t.ses; o.email=(s.ui.ses?o.email_ses:0)+g.m365_usd;
 const mk=Math.min(100,Math.max(0,g.wa_mkt_pct))/100; // parte de los mensajes que es «marketing» (tarifa distinta de «utilidad»)
 o.whatsapp=wa*N*p.wa_msgs*((1-mk)*t.wa_utility+mk*t.wa_marketing);
 const tl=N*p.users*p.tiles_pu;
 o.tiles=tiles*(Math.max(0,Math.min(tl,1e7)-t.tt_tile_free)/1000*t.tt_tile+Math.max(0,Math.min(tl,5e7)-1e7)/1000*t.tt_tile2+Math.max(0,tl-5e7)/1000*t.tt_tile3)*t.eurusd;
 // opcionales (activados por el usuario)
 const apifyPrice=[0,t.apify_starter,t.apify_scale,t.apify_business][s.g.apify_plan]||0;
 const ex={}; for(const e of s.extras){ ex[e.id]=e; }
 o.x_ows=ex.ows.on? o.cells*g.ows_calls_cell*t.ows_req:0;
 o.x_apify=ex.apify.on? apifyPrice:0;
 o.x_inrix=ex.inrix.on? g.inrix_usd:0;
 o.x_gmaps=ex.gmaps.on? g.gmaps_usd:0;
 o.extras=o.x_ows+o.x_apify+o.x_inrix+o.x_gmaps;
 // GPS (equipos, SIM, plataforma): solo si se activa; equipo = pago único (opcionalmente repartido en su vida útil)
 // Dispositivos (equipo, SIM, plataforma): los asume Fortox y siempre se suman. Equipo comprado = pago único (repartido en la vida útil si ui.gps_amort); equipo rentado = cuota mensual.
 const toUsd=(v,cur)=>cur==='COP'?v/t.trm:v;
 let gm=0,go=0; o.gps_rows=[];
 for(const [gi,gp] of s.gps.entries()){ const f=gp.cur==='COP'?1/t.trm:1, life=gp.life>0?gp.life:g.gps_life; const nn=gq[gi];
  const buy=gp.mode==='buy', perMonth=(gp.sim+gp.plat+gp.other+(gp.mode==='rent'?gp.rent:(buy&&s.ui.gps_amort?gp.equip/life:0)))*f, perOnce=((buy?gp.equip:0)+gp.install)*f;
  gm+=nn*perMonth; go+=nn*perOnce; o.gps_rows.push({name:gp.name,mode:gp.mode,n:nn,monthly:nn*perMonth,once:nn*perOnce}); }
 // Plan Team Talk de las bodycams (cada concepto es opcional y editable)
 let tm=0,to=0; o.talk_rows=[];
 for(const l of s.talkteam){ if(!l.on){ continue; } const v=toUsd(l.value,l.cur); let mo=0,on=0;
  if(l.basis==='dev_month') mo=o.bodycams*v; else if(l.basis==='dev_once'){ mo=s.ui.gps_amort?o.bodycams*v/g.gps_life:0; on=o.bodycams*v; } else if(l.basis==='dev_once_fixed') on=o.bodycams*v;
  else if(l.basis==='client_month') mo=o.bodycams>0?N*v:0; else if(l.basis==='fixed_month') mo=o.bodycams>0?v:0; else if(l.basis==='gb_month') mo=o.bodycams*g.bc_gb*v;
  else if(l.basis==='block_month') mo=l.size>0?Math.ceil(o.bodycams/l.size)*v:0;
  tm+=mo; to+=on; o.talk_rows.push({name:l.name,basis:l.basis,monthly:mo,once:on}); }
 o.gps_prov=gm; o.gps_talk=tm; o.gps=gm+tm; o.gps_once=go+to;
 o.other=o.routing+o.weather_cost+o.email+o.whatsapp+o.tiles+o.extras+o.gps;
 o.tech=o.infra+o.traffic+o.other;
 // Personal. Soporte técnico y DevOps NO se cuentan por ahora (ui.sd_on = 0); el analista de inteligencia se habilita con ui.analyst.
 const sd=s.ui.sd_on?1:0;
 o.support=sd*N*p.support_h*g.labor_rate;
 o.devops=sd*(g.devops_base_h+N*g.devops_h_client)*g.labor_rate;
 o.n_analysts=g.analyst_per_clients>0?Math.ceil(N/g.analyst_per_clients):g.analyst_count;
 o.analyst_raw=o.n_analysts*g.analyst_salary_cop*g.analyst_factor/t.trm;
 o.analyst=s.ui.analyst?o.analyst_raw:0;
 o.staff=o.support+o.devops+o.analyst;
 o.total=o.tech+o.staff;
 o.onboarding=sd*N*p.onboard_h*g.labor_rate;
 o.p=p;
 return o;
}
/*MODEL-END*/
