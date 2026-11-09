/*MODEL-START*/
const DEF = {
 t: { trm:3228.26, eurusd:1.1165,
  here_free:5000, here_t1_to:200000, here_t1:2.92, here_t2_to:1000000, here_t2:2.33, here_t3_to:5000000, here_t3:2.05, here_t4_to:20000000, here_t4:0.88, here_t5:0.58,
  here_route_free:30000, here_route:0.88,
  tt_free:2500, tt_t1_to:1000000, tt_t1:2.00, tt_t2_to:5000000, tt_t2:1.60, tt_t3:1.30, tt_route_free:20000, tt_route:1.00,
  tt_tile_free:200000, tt_tile:0.10, tt_tile2:0.08, tt_tile3:0.07,
  ors_free_month:60000, owm_free:1000000,
  wa_marketing:0.0125, wa_utility:0.0008, wa_auth:0.0008, wa_service:0.0008,
  ls_4:23.54, ls_8:43.16, ls_16:82.42, ls_32:160.91, ls_disk:0.10,
  ec2_t3l:0.1344, rds_single:0.275, rds_multi:0.55, rds_gp3_s:0.219, rds_gp3_m:0.438, ebs_gp3:0.152,
  alb:0.034, lcu:0.011, nat:0.093, nat_gb:0.093, s3:0.0405, dto:0.25, cw_logs:0.90, ses:0.00016, hours:730,
  fg_vcpu:0.0696, fg_gb:0.0076, ipv4:0.005, inter_az:0.01, ecr:0.10, r53_zone:0.50, secret:0.40,
  ows_req:0.003, apify_starter:19, apify_scale:199, apify_business:999 },
 g: { ncap:450, interval_traffic:30, interval_weather:60, usable:0.8, dbs_per_rds:25, backup_factor:2.8, row_bytes:250, retention_days:30,
  base_gb:2.2, os_gb:15, logs_gb_server:5, logs_gb_task:1, ebs_app_gb:30, rds_os_gb:20, route_cache_hit:0.5,
  labor_rate:20, devops_base_h:20, devops_h_client:0.1, iva:0.19, pay_fee:0.03,
  lcu_avg:1, ecr_gb:12, use_secrets:0, secrets_per_instance:6, kb_per_call:20, interaz_share:0.5, domain_usd_month:0, migrate_min:10,
  ows_calls_cell:720, apify_plan:1, inrix_usd:0, gmaps_usd:0,
  backup_primary:1, backup_pct:100, gps_life:36, analyst_salary_cop:0, analyst_factor:1, analyst_count:1, analyst_per_clients:0,
  m365_usd:0, rk_cost:3, rk_avail:2, rk_backup:2, rk_ops:1, rk_scale:1 },
 p: { cells_pc:[3,6,12], devices:[5,20,60], hours_day:[8,12,24], gps_nominal:[60,30,10], users:[3,8,20], tiles_pu:[1500,3000,6000],
  emails:[200,600,1500], wa_msgs:[100,500,1000], route_calls:[100,500,2000], support_h:[1,2,4], onboard_h:[6,12,20] },
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
  {id:'eje',name:'worker → Eje Satelital (posiciones GPS)',gb:0.10,net:'nat',what:'Una consulta por minuto con las posiciones de los vehículos del cliente.'},
  {id:'smtp',name:'api/worker → correo (SMTP)',gb:0.05,net:'nat',what:'Correos de aprobación de informes, avisos y distribución.'},
  {id:'push',name:'api → avisos del navegador (Web Push)',gb:0.02,net:'nat',what:'Notificaciones al celular o computador.'},
  {id:'misc',name:'Otros (actualizaciones, respaldos hacia fuera)',gb:0.08,net:'nat',what:'Descarga de versiones nuevas, pruebas de conexión, etc.'},
  {id:'int',name:'api/worker ↔ base de datos y web ↔ api',gb:3.0,net:'int',what:'Conversación interna entre los contenedores del mismo cliente. En el mismo servidor o zona no se cobra.'} ],
 extras: [
  {id:'ows',name:'OpenWeb Ninja — API Waze (incidentes de conductores)',on:0},
  {id:'apify',name:'Apify (plataforma de «extracción de datos»)',on:0},
  {id:'inrix',name:'INRIX (tráfico analítico, por cotización)',on:0},
  {id:'gmaps',name:'Google Maps Platform (solo si un cliente lo exige)',on:0} ],
 // proveedores GPS: costos POR EQUIPO (los paga normalmente el cliente; se cuentan solo si se activa «Incluir» en la ficha de GPS)
 gps: [ {name:'Eje Satelital',share:100,equip:0,install:0,sim:0,plat:0,other:0},
        {name:'Otro proveedor GPS (opcional)',share:0,equip:0,install:0,sim:0,plat:0,other:0},
        {name:'Otro proveedor GPS 2 (opcional)',share:0,equip:0,install:0,sim:0,plat:0,other:0} ],
 ui: { N:1, prof:1, arch:1, ses:0, wa:0, tiles:0, gps:0, gps_amort:1, analyst:0, sd_on:0, unit:'usd', scales:[1,5,10,25,50,100,250,500,1000] },
 // qué secciones salen en el reporte impreso (1 = incluir)
 rep: { resumen:1, glosario:0, diagrama:1, traffic:1, ors:1, owm:1, eje:1, osm:0, mail:0, push:0, wa:0, ows:0, wazeoff:0, apify:0, inrix:0, gmaps:0, gov:0,
        personal:1, graficas:1, gr_desglose:1, gr_crecimiento:1, gr_promedio:1, gr_vehiculo:1, gr_sens:1, gr_aws:0, gr_trafico:0, gr_analista:1, aws:1, containers:1, conexiones:0, awsrates:0, proy:1, comp:1, supuestos:0, pendientes:1 }
};
const clone = o => JSON.parse(JSON.stringify(o));

function tierHere(c, t){
 return Math.max(0,Math.min(c,t.here_t1_to)-t.here_free)/1000*t.here_t1 + Math.max(0,Math.min(c,t.here_t2_to)-t.here_t1_to)/1000*t.here_t2
  + Math.max(0,Math.min(c,t.here_t3_to)-t.here_t2_to)/1000*t.here_t3 + Math.max(0,Math.min(c,t.here_t4_to)-t.here_t3_to)/1000*t.here_t4 + Math.max(0,c-t.here_t4_to)/1000*t.here_t5;
}
function tierTTeur(c, t){
 return Math.max(0,Math.min(c,t.tt_t1_to)-t.tt_free)/1000*t.tt_t1 + Math.max(0,Math.min(c,t.tt_t2_to)-t.tt_t1_to)/1000*t.tt_t2 + Math.max(0,c-t.tt_t2_to)/1000*t.tt_t3;
}
function ramSums(s){
 let r={A:0,B:0,hA:0,hB:0};
 for(const c of s.ctr){ if(c.scope==='inst'){ r.A+=c.ram; if(!c.db) r.B+=c.ram; } else { r.hA+=c.ram; if(!c.db) r.hB+=c.ram; } }
 return r;
}
function fargateMonth(s, scope){ // USD/mes de los contenedores Fargate de una instancia (scope inst) o del hub
 const t=s.t,g=s.g; let u=0;
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
 const t=s.t,g=s.g; opt=opt||{};
 const arch=opt.arch||s.ui.arch, wa=opt.wa===undefined?s.ui.wa:opt.wa, tiles=opt.tiles===undefined?s.ui.tiles:opt.tiles;
 const p={}; for(const k in s.p) p[k]=s.p[k][pi];
 const o={N}; const H=t.hours; const u=g.usable; const R=ramSums(s);
 o.devices=N*p.devices;
 o.cells=g.ncap*(1-Math.exp(-N*p.cells_pc/g.ncap));
 const cpm=43200/g.interval_traffic;
 o.traffic_calls=o.cells*cpm;
 // HERE y TomTom siempre están: uno es el principal (100 % de las consultas) y el otro el respaldo (backup_pct % de las consultas)
 const bk=g.backup_pct/100, callsMain=o.traffic_calls, callsBack=o.traffic_calls*bk;
 const ttCalls=g.backup_primary===1?callsMain:callsBack, hereCalls=g.backup_primary===1?callsBack:callsMain;
 o.tt_calls=ttCalls; o.here_calls=hereCalls;
 o.here=tierHere(hereCalls,t); o.tomtom=tierTTeur(ttCalls,t)*t.eurusd;
 o.traffic = o.here+o.tomtom;
 o.nprov = 1+bk;
 o.wcells=Math.max(1,o.cells/4); o.wcalls=o.wcells*43200/g.interval_weather; o.weather_ok=o.wcalls<=t.owm_free?1:0;
 o.route_calls=N*p.route_calls*(1-g.route_cache_hit);
 o.routing=Math.max(0,o.route_calls-t.ors_free_month-t.tt_route_free)/1000*t.tt_route*t.eurusd;
 const posDev=p.hours_day*3600*30/Math.max(p.gps_nominal,60);
 o.pos_month=o.devices*posDev;
 o.pos_gb=o.pos_month*g.row_bytes*g.retention_days/30/1e9;
 o.data_gb=o.pos_gb+N*g.base_gb;
 o.backups=o.data_gb*g.backup_factor*t.s3;
 // transferencias
 let egressPerClient=0,natPerClient=0,intPerClient=0;
 for(const c of s.conn){ if(c.net==='egress'){egressPerClient+=c.gb;} else if(c.net==='nat'){egressPerClient+=c.gb;natPerClient+=c.gb;} else intPerClient+=c.gb; }
 const egressGB=N*egressPerClient; o.egress_gb=egressGB;
 o.hubnat_gb=o.cells*cpm*o.nprov*g.kb_per_call/1e6;
 o.nat_gb=N*natPerClient+o.hubnat_gb;
 // ---- A: Lightsail
 const need=R.hA+N*R.A; o.A_need=need;
 let cost,disk,srv;
 if(need<=u*4){cost=t.ls_4;disk=80;srv=1;} else if(need<=u*8){cost=t.ls_8;disk=160;srv=1;} else if(need<=u*16){cost=t.ls_16;disk=320;srv=1;} else if(need<=u*32){cost=t.ls_32;disk=640;srv=1;}
 else {srv=Math.ceil(need/(u*32));cost=srv*t.ls_32;disk=srv*640;}
 o.A_servers=srv; const xdisk=Math.max(0,o.data_gb+g.os_gb*srv-disk)*t.ls_disk;
 const dnsFix=t.r53_zone+g.domain_usd_month;
 o.A_parts={servidores:cost,disco_extra:xdisk,respaldos:o.backups,dns_dominio:dnsFix};
 o.A=cost+xdisk+o.backups+dnsFix;
 // ---- B / C / D comunes
 const appneed=R.hB+N*R.B; const napp=Math.ceil(appneed/(u*8)); const rdsn=Math.ceil((1+N)/g.dbs_per_rds);
 o.B_napp=napp; o.B_rds=rdsn;
 const albFix=t.alb*H, albLcu=g.lcu_avg*t.lcu*H, albIp=2*t.ipv4*H;
 const secrets=g.use_secrets?(N*g.secrets_per_instance+8)*t.secret:0;
 const ecr=g.ecr_gb*t.ecr;
 const common={ecr:ecr,dns_dominio:dnsFix,secretos:secrets,respaldos:o.backups};
 const dtoCost=egressGB*t.dto;
 // B
 const bp={servidores_ec2:napp*t.ec2_t3l*H,discos_ebs:napp*g.ebs_app_gb*t.ebs_gp3,ip_publica_servidores:napp*t.ipv4*H,base_rds:rdsn*t.rds_single*H,
  almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_s,balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,
  transferencia_salida:dtoCost,logs_cloudwatch:(napp+rdsn)*g.logs_gb_server*t.cw_logs,...common};
 o.B_parts=bp; o.B=Object.values(bp).reduce((a,b)=>a+b,0);
 // C
 const nappC=napp*2; const natFix=t.nat*H;
 const cp={servidores_ec2:nappC*t.ec2_t3l*H,discos_ebs:nappC*g.ebs_app_gb*t.ebs_gp3,base_rds_multi_az:rdsn*t.rds_multi*H,almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_m,
  balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,nat_hora:natFix,nat_datos:o.nat_gb*t.nat_gb,transferencia_salida:dtoCost,
  entre_zonas:N*intPerClient*g.interaz_share*t.inter_az*2,logs_cloudwatch:(nappC+rdsn*2)*g.logs_gb_server*t.cw_logs,...common};
 o.C_parts=cp; o.C=Object.values(cp).reduce((a,b)=>a+b,0);
 // D: Fargate
 const fgI=fargateMonth(s,'inst'), fgH=fargateMonth(s,'hub'); const ntask=N*fargateTasks(s,'inst')+fargateTasks(s,'hub');
 o.D_fg_inst=fgI; o.D_fg_hub=fgH;
 const dp={contenedores_fargate_clientes:N*fgI,contenedores_fargate_hub:fgH,base_rds:rdsn*t.rds_single*H,almacenamiento_rds:(o.data_gb+rdsn*g.rds_os_gb)*t.rds_gp3_s,
  balanceador_alb:albFix,balanceador_lcu:albLcu,ip_publica_alb:albIp,nat_hora:natFix,nat_datos:o.nat_gb*t.nat_gb,transferencia_salida:dtoCost,
  logs_cloudwatch:ntask*g.logs_gb_task*t.cw_logs,...common};
 o.D_parts=dp; o.D=Object.values(dp).reduce((a,b)=>a+b,0);
 o.infra=[0,o.A,o.B,o.C,o.D][arch];
 o.infra_parts=[null,o.A_parts,o.B_parts,o.C_parts,o.D_parts][arch];
 // Correo: hoy sale por la cuenta de Microsoft 365 que XiGOS ya tiene (no suma). Solo cuesta si se activa Amazon SES o si se escribe un costo de licencia.
 o.email_ses=N*p.emails*t.ses; o.email=(s.ui.ses?o.email_ses:0)+g.m365_usd;
 o.whatsapp=wa*N*p.wa_msgs*t.wa_utility;
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
 let gm=0,go=0; for(const gp of s.gps){ const nn=o.devices*gp.share/100; gm+=nn*(gp.sim+gp.plat+gp.other+(s.ui.gps_amort?gp.equip/g.gps_life:0)); go+=nn*(gp.equip+gp.install); }
 o.gps=s.ui.gps?gm:0; o.gps_once=s.ui.gps?go:0;
 o.other=o.routing+o.email+o.whatsapp+o.tiles+o.extras+o.gps;
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

/* ===================================================================== UI ===================================================================== */
const KEY='xigos-calc-v1';
let S=load();
function load(){ try{ const j=JSON.parse(localStorage.getItem(KEY)||'null'); if(j){ const d=clone(DEF); for(const k of ['t','g']) Object.assign(d[k],j[k]||{}); if(j.p) for(const k in j.p) d.p[k]=j.p[k];
  if(j.ctr) j.ctr.forEach(c=>{const x=d.ctr.find(y=>y.id===c.id); if(x) Object.assign(x,c);}); if(j.conn) j.conn.forEach(c=>{const x=d.conn.find(y=>y.id===c.id); if(x) Object.assign(x,c);});
  if(j.extras) j.extras.forEach(c=>{const x=d.extras.find(y=>y.id===c.id); if(x) Object.assign(x,c);}); if(j.ui) Object.assign(d.ui,j.ui); d.ui.N=Math.max(1,Math.floor(d.ui.N)||1); if(j.rep) Object.assign(d.rep,j.rep); if(j.gps) j.gps.forEach((c,i)=>{ if(d.gps[i]) Object.assign(d.gps[i],c); }); return d; } }catch(e){} return clone(DEF); }
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }

const fmt=(x,d=2)=>Number(x).toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
// Moneda GLOBAL: S.ui.unit ('usd'|'cop') cambia todas las cifras de dinero de la calculadora.
const isCop=()=>S.ui.unit==='cop';
const usd=(x,d=2)=>isCop()?'COP '+fmt(x*S.t.trm,Math.abs(x*S.t.trm)<100?2:0):'US$ '+fmt(x,d);
const cop=x=>isCop()?'US$ '+fmt(x,2):'COP '+fmt(x*S.t.trm,0);          // equivalente en la OTRA moneda
const m=(x,d=2)=>isCop()?fmt(x*S.t.trm,Math.abs(x*S.t.trm)<100?2:0):fmt(x,d); // número de dinero sin símbolo
const alt=x=>isCop()?fmt(x,2):fmt(x*S.t.trm,0);                      // número en la otra moneda
const CU=()=>isCop()?'COP':'USD', CA=()=>isCop()?'USD':'COP';        // nombre de la moneda activa / de la otra
const int=x=>fmt(x,0);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const get=(path)=>path.split('.').reduce((a,k)=>a==null?a:a[k],S);
function setp(path,v){ const ks=path.split('.'); let o=S; for(let i=0;i<ks.length-1;i++) o=o[ks[i]]; o[ks[ks.length-1]]=v; }
const inp=(path,step='any',cls='')=>`<input type="number" step="${step}" data-b="${path}" class="${cls}" value="${get(path)}">`;
const sel=(path,opts)=>`<select data-b="${path}" data-int="1">${opts.map(([v,l])=>`<option value="${v}" ${String(get(path))===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
const chk=(path,label)=>`<label class="chk"><input type="checkbox" data-b="${path}" ${bget(path)?'checked':''}> ${label}</label>`;

/* ----------------------------- Datos de explicación de proveedores ----------------------------- */
const PROVS = [
 {id:'tomtom',st:'req',name:'TomTom Traffic — incidentes de tráfico',
  what:'TomTom es una empresa de mapas. Su servicio «Traffic Incidents» responde, para una zona del mapa, qué choques, cierres, obras o trancones hay en este momento.',
  use:'Junto con HERE, es la fuente de alertas viales de XiGOS (uno es el principal y el otro el respaldo; ver la configuración de «Proveedores de tráfico»). El «hub» (la central de XiGOS) pregunta cada 30 minutos por cada cuadro del mapa (una «celda» de unos 27 km por lado) que algún cliente vigila. Lo que responde se guarda y se comparte con todos los clientes que vigilan esa zona. Verificado con datos reales.',
  how:'Cobra por cada pregunta que hacemos («petición»), por bloques de 1.000. Cada mes las primeras 2.500 son gratis; si pasamos de ahí, se paga por tramos y el precio por 1.000 baja cuando el volumen sube.',
  cur:'EUR', f:[['t.tt_free','Peticiones gratis por mes'],['t.tt_t1','EUR por 1.000: de 2.500 a 1 millón'],['t.tt_t2','EUR por 1.000: de 1 a 5 millones'],['t.tt_t3','EUR por 1.000: de 5 a 10 millones']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ${int(S.ui.N)} clientes se vigilan ≈ ${fmt(o.cells,0)} celdas → ${int(o.traffic_calls)} peticiones al mes a TomTom → <b>${usd(o.tomtom)}</b> al mes (${cop(o.tomtom)}) · <b>${usd(o.tomtom*12,0)}</b> al año.`;},
  src:'https://docs.tomtom.com/pricing',conf:'ALTA — confirmado con el estimador de la propia página (1 millón de peticiones = EUR 1.995).',risk:'TomTom marca algunas versiones antiguas como «de generación anterior»; la versión que usamos (v5) sigue facturable pero podría retirarse. Falta confirmar por escrito sus términos de almacenamiento y de servicio a varios clientes.'},
 {id:'here',st:'req',name:'HERE Traffic — incidentes de tráfico',
  what:'HERE es otra empresa de mapas. Su servicio de tráfico hace lo mismo que el de TomTom: informa incidentes viales en una zona.',
  use:'Se consulta junto con TomTom: si uno falla o no ve un incidente, el otro lo cubre, y si ambos reportan el mismo cierre la alerta es más confiable. Por eso hoy se pagan los dos (uno es el principal y el otro el respaldo).',
  how:'Cobra por «transacciones» (cada pregunta cuenta una), por bloques de 1.000. Las primeras 5.000 de cada mes son gratis; después el precio baja por tramos.',
  cur:'USD', f:[['t.here_free','Transacciones gratis por mes'],['t.here_t1','USD por 1.000: de 5.001 a 200.000'],['t.here_t2','USD por 1.000: de 200.000 a 1 millón'],['t.here_t3','USD por 1.000: de 1 a 5 millones'],['t.here_t4','USD por 1.000: de 5 a 20 millones'],['t.here_t5','USD por 1.000: más de 20 millones']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con las mismas ${fmt(o.cells,0)} celdas (${int(o.traffic_calls)} peticiones al mes) HERE cuesta <b>${usd(o.here)}</b> al mes (${cop(o.here)}) · <b>${usd(o.here*12,0)}</b> al año.`;},
  src:'https://www.here.com/get-started/pricing/supplemental-pricing',conf:'ALTA (precios vigentes desde 2026-04-01). La página se rotula «Confidencial» bajo los términos de HERE Platform.',
  risk:'<b>Riesgo de licencia:</b> el plan básico (Base Plan) de HERE excluye «Asset Management»: ubicar o rastrear activos en un mapa, calcular rutas para ellos y alertar sobre peligros en su ruta. XiGOS hace algo parecido con vehículos; hay que preguntarle por escrito a HERE antes de producción. Si exige contrato, el precio es por cotización.'},
 {id:'ors',st:'req',name:'OpenRouteService (HeiGIT) — rutas y alternas',
  what:'Servicio gratuito que calcula rutas por carretera (distancia, tiempo) y puede evitar zonas con problemas.',
  use:'Cuando se crea una ruta o se necesita una vía alterna evitando un cierre, el hub pide el cálculo a ORS y lo guarda 24 horas para no repetirlo.',
  how:'No cobra en el plan estándar, pero limita a 2.000 rutas por día (≈ 60.000 al mes) y 40 por minuto, compartidas por todos los clientes. Si se pasa, hay que usar otro proveedor de pago (TomTom Routing).',
  cur:'EUR', f:[['t.ors_free_month','Rutas gratis por mes (≈ 2.000/día)'],['t.tt_route_free','TomTom Routing: gratis por mes (respaldo)'],['t.tt_route','TomTom Routing: EUR por 1.000 (excedente)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Con ${int(S.ui.N)} clientes se calculan ≈ ${int(o.route_calls)} rutas al mes (tras la memoria de 24 h). Excedente a pagar a TomTom: <b>${usd(o.routing)}</b> al mes (${usd(o.routing*12,0)} al año).`;},
  src:'https://account.heigit.org/info/plans',conf:'ALTA para los límites. Los términos de uso comercial del plan gratuito NO se verificaron.',risk:'Un solo límite diario para todos los clientes: con cientos de clientes se agota. HERE Routing (USD 0,88 por 1.000) no es opción segura por la exclusión de «activos».'},
 {id:'owm',st:'req',name:'OpenWeatherMap / Open-Meteo — clima',
  what:'Servicios que informan lluvia fuerte, viento y poca visibilidad en un lugar.',
  use:'El hub consulta el clima cada 60 minutos por celda (cuadros de ~55 km) para avisar de riesgo meteorológico en las rutas.',
  how:'OpenWeatherMap: gratis hasta 60 llamadas por minuto y 1.000.000 al mes (planes de pago desde £30 al mes). Open-Meteo: gratis SOLO para uso no comercial (hasta 10.000 al día); su plan comercial no muestra precio.',
  cur:'USD', f:[['t.owm_free','OpenWeatherMap: llamadas gratis por mes']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S);return `Se hacen ≈ ${int(o.wcalls)} llamadas de clima al mes: ${o.weather_ok?'<b>dentro</b> del plan gratuito (US$ 0).':'<b>supera</b> el plan gratuito: habría que pagar un plan.'}`;},
  src:'https://openweathermap.org/price',conf:'MEDIA — la página no declara los términos comerciales del plan gratuito.',risk:'Open-Meteo hoy está marcado «datos de prueba»: para producción comercial se necesita su plan de pago (precio: por cotización) o usar OpenWeatherMap.'},
 {id:'eje',st:'req',name:'Eje Satelital — GPS de los vehículos (plataforma del cliente)',
  what:'Empresa colombiana de rastreo satelital. Sus equipos en los vehículos reportan la posición a su plataforma.',
  use:'XiGOS entra a la cuenta del CLIENTE en Eje Satelital (usuario y clave guardados cifrados) y pide las últimas posiciones una vez por minuto. Con eso sigue los viajes, avisa retrasos o paradas y marca el paso por puntos de control. XiGOS NO tiene receptor propio de GPS.',
  how:'<b>No es un costo de XiGOS:</b> el cliente paga a Eje Satelital su plataforma, el equipo y la SIM de datos. No hay tarifa pública. El único límite conocido es ≈ 1 consulta por minuto.',
  cur:'USD', f:[], ex:()=>`Lo que SÍ cuesta a XiGOS: guardar las posiciones. Con ${int(S.ui.N)} clientes y ${int(calc(S.ui.N,S.ui.prof,S).devices)} vehículos son ≈ ${fmt(calc(S.ui.N,S.ui.prof,S).pos_month/1e6,2)} millones de posiciones al mes (≈ ${fmt(calc(S.ui.N,S.ui.prof,S).pos_gb,1)} GB): casi sin costo.`,
  src:'(sin tarifa pública) — requiere cotización a Eje Satelital',conf:'PENDIENTE — PRECIO NO PÚBLICO.',risk:'Falta probar con vehículos EN MOVIMIENTO (las pruebas fueron con 3 equipos detenidos). Referencia de equipo: Teltonika FMB920 ≈ US$ 69–73 en revendedores (baja confianza). SIM M2M en Colombia: requiere cotización.'},
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
  cur:'USD',f:[['t.wa_utility','Utilidad (USD por mensaje)'],['t.wa_auth','Autenticación (USD)'],['t.wa_service','Servicio (USD)'],['t.wa_marketing','Marketing (USD)']],
  ex:()=>{const o=calc(S.ui.N,S.ui.prof,S,{wa:1});return `Con ${int(S.ui.N)} clientes y ${int(o.p.wa_msgs)} mensajes por cliente al mes: <b>${usd(o.whatsapp)}</b> al mes (${usd(o.whatsapp*12,0)} al año). Casi nada: el costo real es el desarrollo (≈ 100 h supuestas) y un intermediario (BSP) opcional, cuyo precio no es público.`;},
  src:'https://developers.facebook.com/docs/whatsapp/pricing/ (hojas de tarifas de Colombia, vigentes 2026-10-01)',conf:'ALTA (tarifas Colombia). BSP: PENDIENTE (requiere cotización).',risk:'Pagar en pesos (COP) sale ≈ 14 % más caro que en dólares (Meta usa ≈ 3.682 COP por USD). Abrir la cuenta en USD.'},
];
const PROVS_OPT = [
 {id:'ows',st:'opt',name:'OpenWeb Ninja — API de Waze',
  what:'Empresa intermediaria (no oficial) que vende acceso a datos públicos de la web. Su «API Waze» devuelve alertas y trancones reportados por conductores en una zona.',
  use:'<b>La arquitectura actual NO la necesita:</b> el hub tiene el «cupo» en su catálogo, pero no hay conector activo (en espera de validación legal). Se incluiría como tercera fuente de incidentes.',
  how:'Cobra por petición: US$ 0,03 por cada 10 peticiones (US$ 0,003 cada una) en el canal de créditos; su catálogo interno anotaba un plan gratuito de 100 al mes (sin verificar).',
  f:[['t.ows_req','USD por petición'],['g.ows_calls_cell','Peticiones por celda al mes (720 = cada hora)']],
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

const FORMAS=`<table><tr><th class="l">Opción</th><th class="l">Cómo es</th><th class="l">Ventaja</th><th class="l">Desventaja</th></tr>
 <tr><td class="l"><b>A · Lightsail</b></td><td class="l">Un servidor «todo incluido» de AWS donde corren todas las cajas juntas (incluida la base de datos).</td><td class="l">La más económica; precio fijo; la transferencia está incluida.</td><td class="l">Si el servidor falla, todo se cae hasta restaurar. Todo lo administra su equipo.</td></tr>
 <tr><td class="l"><b>B · EC2 + RDS</b></td><td class="l">Servidores EC2 para los programas y una base de datos administrada por AWS (RDS) compartida.</td><td class="l">AWS cuida la base de datos (respaldos, parches).</td><td class="l">Más cara (RAM más costosa + base aparte + balanceador).</td></tr>
 <tr><td class="l"><b>C · Alta disponibilidad</b></td><td class="l">Como B pero duplicada en dos zonas de AWS, con base de datos de respaldo en vivo.</td><td class="l">Sigue funcionando si una zona falla.</td><td class="l">Cuesta el doble o más que B.</td></tr>
 <tr><td class="l"><b>D · Fargate</b></td><td class="l">AWS ejecuta cada contenedor por el equipo XiGOS (sin que el equipo administre servidores) + base RDS.</td><td class="l">Cero administración de servidores; cada caja se cobra exacta.</td><td class="l">Cada caja siempre encendida sale mucho más cara que en un servidor compartido.</td></tr></table>`;

const GLOSARIO=`<dl class="gl">
  <dt>Cliente</dt><dd>Una empresa que usa XiGOS (hoy: el cliente actual, PMI). Cada cliente recibe su propio «sistema», aislado de los demás.</dd>
  <dt>Instancia</dt><dd>El sistema completo de un cliente: sus pantallas, su programa y su base de datos. Es como darle a cada cliente su propia «oficina» en el mismo edificio.</dd>
  <dt>Contenedor</dt><dd>Una «caja» que guarda un programa con todo lo que necesita para funcionar. Cada instancia tiene varias cajas (panel, cerebro, tareas, base de datos). Cada caja usa memoria y procesador, y por eso cuesta dinero mantenerla encendida.</dd>
  <dt>Servidor (la «máquina» de AWS)</dt><dd>El computador en la nube donde viven las cajas. Se alquila por hora o por mes; el precio depende de cuánta memoria (RAM) tenga.</dd>
  <dt>RAM</dt><dd>La memoria de trabajo del computador. Es lo que más define cuántos clientes caben en un servidor.</dd>
  <dt>Hub</dt><dd>La «central» de XiGOS. Es única para todos los clientes: pregunta a los proveedores (tráfico, clima, rutas) y reparte la información. Así, si 50 clientes vigilan la misma ruta, se paga UNA sola consulta. Su servidor es un <b>costo fijo mensual</b> que no se multiplica por cliente.</dd>
  <dt>Worker</dt><dd><b>No es una persona.</b> Es un programa (una «caja» o contenedor) que cada cliente tiene funcionando en segundo plano: genera los informes PDF, sigue los viajes con el GPS y manda los avisos. Es el «robot» de tareas programadas.</dd>
  <dt>Celda</dt><dd>Un cuadro del mapa (≈ 27 km × 27 km) que el hub vigila. Se cobra por celda, no por cliente ni por vehículo.</dd>
  <dt>Principal y respaldo</dt><dd>TomTom y HERE hacen el mismo trabajo. Uno es el principal y el otro el respaldo: si uno falla o no ve un incidente, el otro lo cubre.</dd>
  <dt>Petición / transacción</dt><dd>Cada vez que XiGOS le hace una pregunta a un proveedor. Los proveedores cobran por cada 1.000 preguntas.</dd>
  <dt>Capa gratuita</dt><dd>Cantidad de preguntas al mes que el proveedor regala. Pasado ese límite, empieza a cobrar.</dd>
  <dt>Costo promedio por vehículo</dt><dd>Es el total mensual dividido entre la cantidad de vehículos (como repartir una cuenta entre los comensales). <b>No es lo que cuesta cada vehículo</b>: un vehículo casi no cuesta (solo guardar sus posiciones). Baja cuando hay más vehículos porque los costos fijos se reparten entre más, y sube cuando hay pocos.</dd>
  <dt>Dispositivo GPS</dt><dd>El equipo instalado en un vehículo que reporta dónde está. Lo contrata el cliente con su proveedor GPS.</dd>
  <dt>Costo duro</dt><dd>Lo que hay que pagar a proveedores y a AWS (servidores, datos, correo). Es dinero real que sale.</dd>
  <dt>Soporte y DevOps</dt><dd>Horas de personas que atienden a los clientes y mantienen el sistema. <b>Por ahora NO se cuentan en el costo</b>; se pueden activar en la ficha «Personal».</dd>
  <dt>Analista de inteligencia</dt><dd>Persona que aprueba y controla las rutas y los informes de los clientes. Se puede activar con un sueldo mensual y entra al costo promedio.</dd>
  <dt>Región São Paulo</dt><dd>El centro de datos de AWS más cercano a Colombia con precios oficiales verificados.</dd></dl>
 <div class="box info"><b>Idea central:</b> los vehículos GPS casi no cuestan a XiGOS. Lo que cuesta es (1) <b>cada cliente nuevo</b>, porque necesita su propio sistema funcionando, (2) <b>cuántas zonas del mapa</b> se vigilan, porque los proveedores cobran por zona consultada, y (3) <b>las personas</b> que operan el servicio (por ahora solo el analista de inteligencia, si se activa).</div>`;

const SUPS=[['g.ncap','Celdas posibles en Colombia','Techo del gasto en tráfico: aunque haya miles de clientes, solo hay tantas zonas por vigilar. Se estimó ≈ 30 % de las 1.475 celdas del país.'],
 ['g.interval_traffic','Cada cuántos minutos se consulta el tráfico','A menor número, más consultas y más costo (5 min = 6 veces el costo actual).'],
 ['g.interval_weather','Cada cuántos minutos se consulta el clima','Solo cuenta si el clima dejara de ser gratis.'],
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
const PROFROWS=[['cells_pc','Celdas (zonas del mapa) que vigila'],['devices','Vehículos con GPS'],['hours_day','Horas al día con vehículos reportando'],['gps_nominal','Cada cuántos segundos reporta el equipo (XiGOS guarda máx. 1 por minuto)'],['users','Usuarios del panel'],['tiles_pu','Teselas de mapa por usuario al mes'],['emails','Correos al mes'],['wa_msgs','Mensajes de WhatsApp al mes (si se implementa)'],['route_calls','Rutas alternas pedidas al mes'],['support_h','Horas de soporte al mes (solo si se activa soporte)'],['onboard_h','Horas para instalar al cliente (una vez; solo si se activa soporte)']];
const PENDIENTES=`<table><tr><th class="l">Dato faltante</th><th class="l">Por qué importa</th><th class="l">Cómo conseguirlo</th></tr>
 <tr><td class="l">Precio de la plataforma/API de Eje Satelital, SIM y equipos GPS</td><td class="l">Costo real del GPS para el cliente (o para Fortox si lo revende)</td><td class="l">Cotización a Eje Satelital y a Claro/Movistar/Tigo Empresas</td></tr>
 <tr><td class="l">Términos de HERE y TomTom para rastreo de activos y servicio a varios clientes</td><td class="l">HERE podría pasar a contrato (precio por cotización)</td><td class="l">Preguntas por escrito a cada proveedor</td></tr>
 <tr><td class="l">Licencias comerciales de Open-Meteo, OpenRouteService y OpenWeatherMap (plan gratis)</td><td class="l">Hoy se asumen gratis</td><td class="l">Consultar a cada proveedor</td></tr>
 <tr><td class="l">Intermediario (BSP) de WhatsApp, Microsoft 365, dominio, soporte AWS, Savings Plans</td><td class="l">Costos fijos menores</td><td class="l">Cotizar</td></tr>
 <tr><td class="l">Memoria real de cada contenedor y tamaño real de las tablas</td><td class="l">Es el supuesto que más mueve el costo de infraestructura</td><td class="l">Construir las imágenes y medir con <code>docker stats</code>; consultar tamaños en la base del cliente actual (PMI)</td></tr>
 <tr><td class="l">Cuántos vehículos reales tiene cada cliente y cada cuánto reportan</td><td class="l">Define almacenamiento y consultas</td><td class="l">Dato de los clientes; prueba con vehículos en movimiento</td></tr>
 <tr><td class="l">Impuestos (IVA, retenciones) de servicios del exterior</td><td class="l">Costo final en pesos</td><td class="l">Contador</td></tr></table>
 <div class="box ok"><b>Recomendación para empezar (hasta ~10 clientes; previsión de 4 en 12 meses):</b> alojamiento A (un Lightsail de São Paulo), respaldos a S3. Pasar a B/C/D solo por requisito de disponibilidad, y antes medir la memoria real de los contenedores.</div>`;
const CONN_RULES=()=>`<ul>
 <li><b>Entrada a AWS (lo que llega):</b> gratis.</li>
 <li><b>Salida a Internet:</b> US$ ${S.t.dto} por GB en B, C y D (el primer GB del mes es gratis). En Lightsail (A) viene incluida (hasta 4 TB en el plan de 4 GB).</li>
 <li><b>Entre contenedores en el mismo servidor/zona:</b> gratis. <b>Entre dos zonas de AWS</b> (solo en C): US$ ${S.t.inter_az} por GB en cada sentido.</li>
 <li><b>«Puerta de salida» NAT</b> (C y D): US$ ${S.t.nat} por hora (≈ US$ ${fmt(S.t.nat*S.t.hours)} al mes) <b>más</b> US$ ${S.t.nat_gb} por cada GB que pasa.</li>
 <li><b>IP pública:</b> US$ ${S.t.ipv4} por hora cada una (≈ US$ ${fmt(S.t.ipv4*S.t.hours)} al mes). Lightsail ya la incluye.</li>
 <li><b>Hacia los proveedores de datos:</b> lo que cobra AWS es mínimo; lo que cobra cada proveedor está en la sección de proveedores.</li>
 <li><b>Mapas de OpenStreetMap:</b> el navegador del usuario los descarga directo; no pasan por AWS.</li></ul>`;

function ctrTables(){
 const head=`<tr><th class="l">Contenedor</th><th class="l">¿Qué hace?</th><th>Memoria que usa realmente (GB)</th><th>Fargate: procesador reservado (vCPU)</th><th>Fargate: memoria reservada (GB)</th></tr>`;
 return `<h3>Contenedores de cada cliente (editable)</h3><div class="scroll"><table>${head}${S.ctr.filter(c=>c.scope==='inst').map(ctrRow).join('')}</table></div>
 <h3>Contenedores del hub (uno solo para toda la plataforma)</h3><div class="scroll"><table>${head}${S.ctr.filter(c=>c.scope==='hub').map(ctrRow).join('')}</table></div>`;
}
function scaleInput(){ return `<label style="display:flex;flex-direction:column;gap:2px;font-size:12.5px;color:var(--mut);font-weight:600">Cantidades de clientes a proyectar (separadas por coma, máx. 12)<input type="text" id="scales-in" value="${S.ui.scales.join(', ')}" style="width:100%;max-width:520px"></label>`; }
const SCEN=(o={})=>{ const on=k=>o[k]!==0;
 return `<div class="ctl">${on('N')?'<label>Número de clientes<input type="number" min="1" step="1" data-b="ui.N"></label>':''}${on('prof')?`<label>Tamaño de uso${sel('ui.prof',[[0,'Bajo (5 vehículos)'],[1,'Medio (20 vehículos)'],[2,'Alto (60 vehículos)']])}</label>`:''}${on('arch')?`<label>Alojamiento en AWS${sel('ui.arch',[[1,ARCH[1]],[2,ARCH[2]],[3,ARCH[3]],[4,ARCH[4]]])}</label>`:''}${on('unit')?`<label>Moneda de toda la calculadora<select data-b="ui.unit"><option value="usd" ${S.ui.unit==='usd'?'selected':''}>Dólares (USD)</option><option value="cop" ${S.ui.unit==='cop'?'selected':''}>Pesos (COP)</option></select></label>`:''}</div>${o.note?`<p class="small">${o.note}</p>`:''}`; };
const NOAWS='Los valores de esta ficha <b>no cambian según la forma de alojar en AWS</b>; solo dependen del número de clientes y del tamaño de uso.';

/* ----------------------------- Fichas (tiles) y ventanas modales ----------------------------- */
const TILES=[
 {g:'Tráfico vial (siempre HERE + TomTom)',items:[{id:'traffic',t:'Proveedores de tráfico: TomTom y HERE',d:'Cuál es el principal, cuál el respaldo y cuánto se consulta al respaldo. Tarifas de ambos.',st:'req'}]},
 {g:'Otros servicios que la arquitectura actual usa',items:['ors','owm','eje','osm','mail','push','wa'].map(id=>({id,t:PBY[id].name,d:PBY[id].what,st:PBY[id].st}))},
 {g:'Servidores y contenedores en AWS',items:[
  {id:'aws',t:'Alojamiento y contenedores',d:'Cuántos contenedores hay, qué hace cada uno, cuánto cuesta mantenerlo y las 4 formas de alojarlo en AWS.',st:'req'},
  {id:'conexiones',t:'Conexiones entre contenedores',d:'Qué conversa con qué, cuántos datos viajan y qué cobra AWS por ello.',st:'req'},
  {id:'awsrates',t:'Tarifas de AWS',d:'Precio de cada servicio de AWS en São Paulo y para qué sirve.',st:'req'}]},
 {g:'Servicios que hoy NO se necesitan (opcionales)',items:['ows','wazeoff','apify','inrix','gmaps','gov'].map(id=>({id,t:PBY[id].name,d:PBY[id].what,st:PBY[id].st}))},
 {g:'Modelo y secciones del reporte',items:[
  {id:'resumen',t:'Resumen de costos',d:'Totales, costo duro, por cliente, por vehículo y por año.',nomodal:1},
  {id:'graficas',t:'Gráficas',d:'Gráficas del resumen interactivo: dónde se va el dinero, crecimiento, promedio por cliente, sensibilidad y más. Elija cuáles salen en el PDF y en qué moneda.'},
  {id:'personal',t:'Personal: analista de inteligencia',d:'Cargo que aprueba y controla rutas y reportes. Se habilita con un sueldo mensual y cambia el costo promedio por cliente. Soporte y DevOps no se cuentan por ahora. Si no está activado, esta sección no sale en el reporte.'},
  {id:'proy',t:'Proyección por número de clientes',d:'Tabla de costos para distintas cantidades de clientes y comparaciones.',st:'req'},
  {id:'supuestos',t:'Supuestos y tamaños de uso',d:'Todo lo no verificado: memoria, celdas, tamaños de uso… y el tipo de cambio.',st:'req'},
  {id:'diagrama',t:'Diagrama de cómo se conecta todo',d:'Dibujo simple de quién le pregunta a quién y qué se cobra.',nomodal:1},
  {id:'glosario',t:'Glosario sin tecnicismos',d:'Qué significa cada palabra técnica.',nomodal:1},
  {id:'pendientes',t:'Qué falta saber',d:'Datos sin precio público y supuestos por confirmar.',nomodal:1}]}];
const CALC={ mail:()=>S.ui.ses||S.g.m365_usd>0, personal:()=>S.ui.analyst, eje:()=>S.ui.gps, wa:()=>S.ui.wa, osm:()=>S.ui.tiles, ows:()=>S.extras.find(e=>e.id==='ows').on, apify:()=>S.extras.find(e=>e.id==='apify').on, inrix:()=>S.extras.find(e=>e.id==='inrix').on, gmaps:()=>S.extras.find(e=>e.id==='gmaps').on };
const CALC_LBL={mail:'Correo con costo en el cálculo',personal:'Analista en el cálculo',eje:'Costos de GPS en el cálculo',wa:'WhatsApp en el cálculo',osm:'Mapas de pago en el cálculo',ows:'En el cálculo',apify:'En el cálculo',inrix:'En el cálculo',gmaps:'En el cálculo'};

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
   <label>Minutos entre consultas por zona<input type="number" min="5" step="5" data-b="g.interval_traffic"></label></div>
  <p class="small"><b>100 %</b> = hoy: el hub consulta a los dos cada vez (se pagan los dos completos). <b>0 %</b> = el respaldo no se consulta nunca. <b>20 %</b> = solo 1 de cada 5 veces. Menos consultas al respaldo bajan el costo, pero la confirmación entre proveedores se reduce.</p>
  <div id="m-traffic"></div>${SCEN({arch:0,unit:0,note:NOAWS})}${provCard(PBY.tomtom)}${provCard(PBY.here)}`}),
 aws:()=>({title:'Alojamiento y contenedores en AWS',html:`${repChk('aws','Incluir en el reporte: formas de alojar y cuenta de AWS')}${repChk('containers','Incluir en el reporte: costo de cada contenedor')}${SCEN({unit:0})}
  <h3>Las cuatro formas de alojar (en palabras simples)</h3>${FORMAS}
  <h3>Qué tanto pesa cada criterio para ordenar las alternativas</h3>
  <div class="fields"><label>Costo (valor por lo que se paga)${inp('g.rk_cost',1)}</label><label>Disponibilidad (que no se caiga)${inp('g.rk_avail',1)}</label><label>Respaldo y recuperación${inp('g.rk_backup',1)}</label><label>Facilidad de operar${inp('g.rk_ops',1)}</label><label>Capacidad de crecer${inp('g.rk_scale',1)}</label></div>
  <div id="m-rank"></div><div id="m-aws"></div>${ctrTables()}<div id="m-containers"></div>`}),
 conexiones:()=>({title:'Conexiones entre contenedores y con el exterior',html:`${repChk('conexiones')}${SCEN({unit:0})}<div id="m-conn"></div>
  <p class="small">Los GB por cliente son <b>supuestos</b> (editables).</p>
  <div class="scroll"><table><tr><th class="l">Conexión</th><th class="l">¿Qué viaja?</th><th class="l">Tipo</th><th>GB por cliente al mes</th></tr>
  ${S.conn.map((c,i)=>`<tr><td class="l">${esc(c.name)}</td><td class="l">${esc(c.what)}</td><td class="l">${{egress:'Sale a Internet (se cobra en B, C, D; incluida en A)',nat:'Sale a Internet; en C y D además pasa por la «puerta de salida» (NAT)',int:'Interna (gratis dentro de la misma zona)'}[c.net]}</td><td>${inp('conn.'+i+'.gb',0.01,'w')}</td></tr>`).join('')}</table></div>
  <h3>Reglas de cobro de AWS que aplican</h3>${CONN_RULES()}`}),
 awsrates:()=>({title:'Tarifas de AWS en São Paulo',html:`${repChk('awsrates')}<div class="scroll"><table><tr><th class="l">Servicio AWS</th><th class="l">¿Para qué sirve en XiGOS?</th><th class="l">¿Cómo cobra?</th><th>Precio (USD)</th></tr>${awsTable()}</table></div>
  <p class="src">Fuente: listas oficiales de precios <code>pricing.us-east-1.amazonaws.com/offers/v1.0/aws/&lt;servicio&gt;/current/sa-east-1/index.json</code> (EC2 y VPC 2026-11-05; RDS 2026-10-29; S3, CloudWatch y SES 2026-11-04; Lightsail 2026-09-15; ECS 2026-10-19; ECR 2026-09-11). Confianza ALTA.</p>
  <div class="box">No incluido: soporte de AWS, Savings Plans (descuentos por compromiso), almacenamiento de PDF en Fargate (EFS o S3) y la licencia de Microsoft 365.</div>`}),
 proy:()=>({title:'Proyección por número de clientes',html:`${repChk('proy','Incluir en el reporte: tabla de proyección')}${repChk('comp','Incluir en el reporte: comparaciones de alojamiento y tamaños de uso')}${SCEN({unit:0})}<div class="ctl">${scaleInput()}</div><div id="m-proj"></div>`}),
 supuestos:()=>({title:'Supuestos, tamaños de uso y tipo de cambio',html:`${repChk('supuestos')}<p class="lead">Estas cifras NO son datos verificados: son estimaciones razonables. Si consigue el dato real, escríbalo y todo se recalcula.</p>
  <div class="scroll"><table><tr><th class="l">Supuesto</th><th class="l">Por qué importa</th><th>Valor</th></tr>${SUPS.map(([p,l,w])=>`<tr><td class="l">${l}</td><td class="l">${w}</td><td>${inp(p)}</td></tr>`).join('')}</table></div>
  <h3>Cómo se mide cada tamaño de uso (por cliente)</h3><div class="scroll"><table><tr><th class="l">Dato</th><th>Bajo</th><th>Medio</th><th>Alto</th></tr>
  ${PROFROWS.map(([k,l])=>`<tr><td class="l">${l}</td>${[0,1,2].map(i=>`<td>${inp('p.'+k+'.'+i,'any','w')}</td>`).join('')}</tr>`).join('')}</table></div>
  <h3>Tipo de cambio</h3><div class="fields"><label>Pesos por dólar (TRM 2026-11-06, datos.gov.co)${inp('t.trm')}</label><label>Dólares por euro (BCE 2026-11-06)${inp('t.eurusd')}</label></div>`})
};
for(const id of ['ors','owm','eje','osm','mail','push','wa','ows','wazeoff','apify','inrix','gmaps','gov']){
 MODALS[id]=()=>({title:PBY[id].name,html:`${repChk(id)}${SCEN({arch:0,unit:0,note:NOAWS})}${provCard(PBY[id])}`});
}
function gpsCalc(devices){ const r={n:0,equip:0,install:0,sim:0,plat:0,other:0}; for(const gp of S.gps){ const n=devices*gp.share/100; r.n+=n; r.equip+=n*gp.equip; r.install+=n*gp.install; r.sim+=n*gp.sim; r.plat+=n*gp.plat; r.other+=n*gp.other; } r.amort=r.equip/S.g.gps_life; return r; }
function gpsTable(){
 const o=calc(S.ui.N,S.ui.prof,S); const r=gpsCalc(o.devices); const am=S.ui.gps_amort;
 const mo=r.sim+r.plat+r.other+(am?r.amort:0), once=r.equip+r.install;
 const share=S.gps.reduce((a,g)=>a+g.share,0);
 const row=(n,u,mo,note,b)=>`<tr><td class="l">${b?'<b>'+n+'</b>':n}</td><td>${u===null?'—':(b?'<b>'+m(u)+'</b>':m(u))}</td><td>${mo===null?'—':(b?'<b>'+m(mo)+'</b>':m(mo))}</td><td>${mo===null?'—':(b?'<b>'+m(mo*12)+'</b>':m(mo*12))}</td><td class="l small">${note||''}</td></tr>`;
 return `<p>Con <b>${int(o.devices)} vehículos</b> (${int(S.ui.N)} cliente(s)). ${S.ui.gps?'<b>Estos costos SÍ están sumados</b> al cálculo.':'Estos costos <b>NO están sumados</b> al cálculo (los paga normalmente el cliente); actívelos en la ficha de GPS si desea incluirlos.'}${Math.abs(share-100)>0.01?` <span style="color:var(--bad)"><b>Atención:</b> los porcentajes por proveedor suman ${fmt(share,0)} %, deberían sumar 100 %.</span>`:''}</p>
 <table><tr><th class="l">Concepto</th><th>Pago único ${CU()}</th><th>Mensual ${CU()}</th><th>Anual ${CU()}</th><th class="l">Nota</th></tr>
 ${row('Equipos GPS',r.equip,am?r.amort:null,am?`Pago único repartido en ${S.g.gps_life} meses de vida útil`:'Pago único; no se suma al mensual')}
 ${row('Instalación de equipos',r.install,null,'Pago único')}
 ${row('SIM / plan de datos',null,r.sim,'Por equipo cada mes')}
 ${row('Plataforma GPS (ej. Eje Satelital)',null,r.plat,'Por equipo cada mes')}
 ${row('Otros costos por equipo',null,r.other,'Seguros, soporte, etc.')}
 ${row('TOTAL GPS',once,mo,'Primer año (único + anual): '+usd(once+mo*12,0),1)}</table>
 <p class="small">Por vehículo: pago único ${usd(o.devices?once/o.devices:0)} y ${usd(o.devices?mo/o.devices:0)} al mes (${usd(o.devices?mo*12/o.devices:0)} al año).</p>`;
}
MODALS.eje=()=>({title:'GPS: proveedores, equipos, SIM y plataforma',html:`${repChk('eje','Incluir en el reporte: GPS y sus costos')}${SCEN({arch:0,unit:0,note:NOAWS})}
 <div class="box info">Normalmente el equipo GPS, la SIM de datos y la plataforma de rastreo los paga el <b>cliente</b> a su proveedor (Eje Satelital). Active estos costos solo si Fortox los vende, los financia o quiere compararlos. <b>No hay precios públicos:</b> escriba las cotizaciones cuando las tenga. Referencia de equipo: Teltonika FMB920 ≈ US$ 69–73 en revendedores (baja confianza, no es tarifa oficial).</div>
 <div class="ctl">${chk('ui.gps','<b>Incluir los costos de GPS en el cálculo</b>')}${chk('ui.gps_amort','Repartir el costo del equipo en su vida útil y sumarlo al mensual')}<label>Vida útil del equipo (meses)<input type="number" min="1" step="1" data-b="g.gps_life" class="w"></label></div>
 <h3>Proveedores o planes de GPS (costos POR EQUIPO)</h3><div class="scroll"><table><tr><th class="l">Proveedor / plan</th><th>% de los vehículos</th><th>Equipo (USD, pago único)</th><th>Instalación (USD, único)</th><th>SIM / datos (USD al mes)</th><th>Plataforma GPS (USD al mes)</th><th>Otros (USD al mes)</th></tr>
 ${S.gps.map((g,i)=>`<tr><td class="l"><input type="text" data-b="gps.${i}.name"></td>${['share','equip','install','sim','plat','other'].map(k=>`<td>${inp('gps.'+i+'.'+k,'any','w')}</td>`).join('')}</tr>`).join('')}</table></div>
 <h3>Resultado</h3><div id="m-gps"></div>${provCard(PBY.eje)}`});
function staffTable(){
 const N=S.ui.N,o=calc(N,S.ui.prof,S); const trm=S.t.trm;
 const R=(n,q,usdm,note)=>`<tr><td class="l">${n}</td><td>${q}</td><td>${m(usdm)}</td><td>${m(usdm*12)}</td><td>${alt(usdm)}</td><td>${alt(usdm*12)}</td><td class="l small">${note||''}</td></tr>`;
 const no=calc(N,S.ui.prof,{...S,ui:{...S.ui,analyst:0}}), yes=calc(N,S.ui.prof,{...S,ui:{...S.ui,analyst:1}});
 const scal=S.ui.scales.map(n=>{ const a=calc(n,S.ui.prof,{...S,ui:{...S.ui,analyst:0}}), b=calc(n,S.ui.prof,{...S,ui:{...S.ui,analyst:1}}); const pc=a.total/n, pw=b.total/n;
  return `<tr><td class="l">${int(n)}</td><td>${int(b.n_analysts)}</td><td>${m(b.analyst_raw)}</td><td>${m(pc)}</td><td>${m(pw)}</td><td>${fmt(pc?((pw/pc-1)*100):0,0)} %</td><td>${m(pw*12)}</td></tr>`; }).join('');
 return `<p>${S.ui.analyst?'<b>El analista SÍ está sumado</b> al cálculo.':'El analista <b>NO está sumado</b> al cálculo; actívelo arriba para que afecte el promedio.'} ${S.g.analyst_salary_cop>0?'':'<span style="color:var(--bad)"><b>Falta escribir el sueldo mensual.</b></span>'}</p>
 <table><tr><th class="l">Cargo</th><th>Cantidad</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CA()} al mes</th><th>${CA()} al año</th><th class="l">Nota</th></tr>
 ${R('Analista de inteligencia',o.n_analysts,o.analyst_raw,'Sueldo × factor × cantidad'+(S.ui.analyst?'':' (no incluido)'))}
 ${S.ui.sd_on?R('Soporte técnico',int(N*o.p.support_h)+' h',o.support,'Horas × tarifa'):''}${S.ui.sd_on?R('Operación (DevOps)',fmt(S.g.devops_base_h+N*S.g.devops_h_client,1)+' h',o.devops,'Horas × tarifa'):''}
 ${R('<b>TOTAL personal incluido</b>','',o.staff,'')}</table>
 <p><b>Efecto en el promedio con ${int(N)} cliente(s):</b> costo por cliente al mes sin analista <b>${usd(no.total/N)}</b>; con analista <b>${usd(yes.total/N)}</b> (aumenta ${usd(yes.total/N-no.total/N)} por cliente al mes y ${usd((yes.total-no.total)/o.devices)} por vehículo).</p>
 <h3>Cómo cambia el costo promedio según el número de clientes</h3>
 <table><tr><th class="l">Clientes</th><th>Analistas</th><th>Costo del analista ${CU()}/mes</th><th>Costo por cliente al mes SIN analista</th><th>… CON analista</th><th>Aumento</th><th>Por cliente al año CON analista</th></tr>${scal}</table>
 <p class="small">A más clientes, el sueldo se reparte entre más y el efecto por cliente baja (mientras no se contraten más analistas).</p>`;
}
MODALS.personal=()=>({title:'Personal: analista de inteligencia',html:`${repChk('personal','Incluir en el reporte: personal')}${SCEN({unit:0})}
 <div class="box info"><b>Analista de inteligencia:</b> persona que aprueba y controla las rutas y los informes de los clientes antes de que salgan. Cuando lo habilita, su sueldo se suma al costo mensual y cambia el costo promedio por cliente. <b>Soporte técnico y DevOps no se cuentan por ahora.</b></div>
 <div class="ctl">${chk('ui.analyst','<b>Incluir al analista de inteligencia en el cálculo</b>')}</div>
 <div class="fields"><label>Sueldo mensual por analista (COP)${inp('g.analyst_salary_cop',100000)}</label>
  <label>Factor sobre el sueldo (1 = solo el sueldo; use más de 1 si desea sumar prestaciones y cargas)${inp('g.analyst_factor',0.01)}</label>
  <label>Cantidad de analistas${inp('g.analyst_count',1)}</label>
  <label>Clientes que atiende cada analista (0 = usar la cantidad fija)${inp('g.analyst_per_clients',1)}</label></div>
 <h3>Soporte técnico y DevOps (por ahora NO se cuentan)</h3>
 <div class="ctl">${chk('ui.sd_on','Incluir soporte técnico y DevOps en el cálculo')}</div>
 <div class="fields"><label>Tarifa por hora (USD)${inp('g.labor_rate')}</label><label>Horas fijas de operación al mes${inp('g.devops_base_h')}</label><label>Horas de operación extra por cliente${inp('g.devops_h_client',0.05)}</label></div>
 <p class="small">Las horas de soporte por cliente y de instalación están en «Supuestos y tamaños de uso».</p>
 <h3>Resultado</h3><div id="m-staff"></div>`});
MODALS.graficas=()=>({title:'Gráficas del reporte',html:`${repChk('graficas','Incluir las gráficas en el reporte impreso')}${SCEN({N:0,prof:0,arch:0})}
 <p class="small">Marque cuáles gráficas salen en el PDF. En la pestaña «Resumen interactivo» siempre se ven todas.</p>
 ${CH.map(c=>`<label class="chk repchk" style="display:flex;align-items:flex-start;margin:6px 0"><input type="checkbox" data-b="rep.gr_${c.id}" ${bget('rep.gr_'+c.id)?'checked':''}> <span><b>${c.title}</b><br><span class="small">${c.what}${c.cond?' (solo aparece si el analista está activado)':''}</span></span></label>`).join('')}`});
let curModal=null;
function openModal(id){ const m=MODALS[id]; if(!m) return; const x=m(); curModal=id; document.getElementById('mt').textContent=x.title; document.getElementById('mbody').innerHTML=x.html;
 document.getElementById('modal').hidden=false; document.body.classList.add('modal-open'); document.getElementById('mbody').scrollTop=0; update(); }
function closeModal(){ curModal=null; document.getElementById('modal').hidden=true; document.body.classList.remove('modal-open'); document.getElementById('mbody').innerHTML=''; update(); }

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
 const provIds=['traffic','ors','owm','eje','osm','mail','push','wa','ows','wazeoff','apify','inrix','gmaps','gov'].filter(id=>r[id]);
 if(provIds.length){
  let b=`<section>${H('Proveedores y tarifas')}`;
  for(const id of provIds){
   if(id==='traffic') b+=`<h3>Tráfico vial: ${S.g.backup_primary===1?'TomTom principal, HERE respaldo':'HERE principal, TomTom respaldo'} (${fmt(S.g.backup_pct,0)} % de consultas al respaldo)</h3>${outTrafficCompare()}${provReport(PBY.tomtom)}${provReport(PBY.here)}`;
   else if(id==='eje') b+=provReport(PBY.eje)+`<h3>Costos de GPS: equipos, SIM y plataforma</h3>${gpsTable()}`; else b+=provReport(PBY[id]);
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
  if(r.comp) b+=`<h3>Las cuatro formas de alojar en AWS (USD al mes, solo infraestructura)</h3>${outArchs()}<h3>Los tres tamaños de uso (USD al mes, total)</h3>${outProfs()}`;
  sections.push(b+'</section>');
 }
 if(r.supuestos) sections.push(`<section>${H('Supuestos y tamaños de uso')}<table><tr><th class="l">Supuesto</th><th class="l">Por qué importa</th><th>Valor</th></tr>${SUPS.map(([p,l,w])=>`<tr><td class="l">${l}</td><td class="l">${w}</td><td>${fmtN(get(p))}</td></tr>`).join('')}</table>
  <table><tr><th class="l">Tamaño de uso (por cliente)</th><th>Bajo</th><th>Medio</th><th>Alto</th></tr>${PROFROWS.map(([k,l])=>`<tr><td class="l">${l}</td>${[0,1,2].map(i=>`<td>${fmtN(S.p[k][i])}</td>`).join('')}</tr>`).join('')}</table>
  <p class="small">TRM ${fmt(S.t.trm)} COP por USD (datos.gov.co, 2026-11-06); EUR/USD ${S.t.eurusd} (BCE, 2026-11-06).</p></section>`);
 if(r.pendientes) sections.push(`<section>${H('Qué falta saber (no se inventó ningún valor)')}${PENDIENTES}</section>`);
 h=`<div class="rhead"><h1>Reporte de costos XiGOS</h1><div class="sub">Generado el ${when} · precios consultados el 2026-11-06 · TRM ${fmt(S.t.trm)} COP/USD · USD sin IVA · cifras aproximadas</div></div>`+(sections.join('')||'<p class="box">No hay secciones seleccionadas. Marque «En el reporte» en las fichas de la pestaña Configuración.</p>');
 return h;
}
const SCENLINE=()=>`Escenario: <b>${int(S.ui.N)} cliente(s)</b>, uso <b>${['bajo','medio','alto'][S.ui.prof]}</b>, alojamiento <b>${ARCH[S.ui.arch]}</b>.`;
function outTrafficCompare(){
 const o=calc(S.ui.N,S.ui.prof,S); const g=S.g; const pr=g.backup_primary===1;
 const full=calc(S.ui.N,S.ui.prof,{...S,g:{...S.g,backup_pct:100}}); const only=calc(S.ui.N,S.ui.prof,{...S,g:{...S.g,backup_pct:0}});
 const rows=[['TomTom',pr?'Principal':'Respaldo',o.tt_calls,o.tomtom],['HERE',pr?'Respaldo':'Principal',o.here_calls,o.here]];
 return `<table><tr><th class="l">Proveedor</th><th class="l">Rol</th><th>Peticiones al mes</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CA()} al mes</th></tr>${rows.map(([n,r,c,u])=>`<tr><td class="l">${n}</td><td class="l">${r}</td><td>${int(c)}</td><td>${m(u)}</td><td>${m(u*12)}</td><td>${alt(u)}</td></tr>`).join('')}
 <tr><td class="l"><b>Total tráfico</b></td><td class="l"></td><td></td><td><b>${m(o.traffic)}</b></td><td><b>${m(o.traffic*12)}</b></td><td><b>${alt(o.traffic)}</b></td></tr></table>
 <p class="small">Con ≈ ${fmt(o.cells,0)} zonas (celdas) vigiladas cada ${S.g.interval_traffic} min. Si el respaldo se consultara el 100 % de las veces costaría ${usd(full.traffic,0)} al mes; si nunca se consultara, ${usd(only.traffic,0)}. Hoy el hub consulta ambos siempre (100 %).</p>`;
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

/* ----------------------------- Salidas (se recalculan) ----------------------------- */
const COLORS={infra:'#1f5fa8',traffic:'#d98c00',other:'#7b4fb0',support:'#8a93a6'};
function barHtml(items){ const tot=items.reduce((a,b)=>a+b.v,0)||1;
 return `<div class="bar">${items.filter(i=>i.v>0).map(i=>`<div style="width:${(i.v/tot*100).toFixed(1)}%;background:${i.c}" title="${i.l}: ${usd(i.v)}">${i.v/tot>0.07?fmt(i.v/tot*100,0)+'%':''}</div>`).join('')}</div>
 <div class="legend">${items.filter(i=>i.v>0).map(i=>`<span><i style="background:${i.c}"></i>${i.l}: <b>${usd(i.v,0)}</b> (${fmt(i.v/tot*100,0)} %)</span>`).join('')}</div>`; }

function sumTable(o,N,hard){
 const R=(a,b,v,bold)=>`<tr><td class="l">${bold?'<b>'+a+'</b>':a}</td><td class="l">${b}</td><td>${bold?'<b>'+m(v)+'</b>':m(v)}</td><td>${bold?'<b>'+m(v*12)+'</b>':m(v*12)}</td><td>${m(v/N)}</td></tr>`;
 const bk=S.g.backup_primary===1?'TomTom (principal) + HERE (respaldo)':'HERE (principal) + TomTom (respaldo)';
 return `<table><tr><th class="l">Concepto</th><th class="l">Qué incluye</th><th>${CU()} al mes</th><th>${CU()} al año</th><th>${CU()} por cliente al mes</th></tr>
 ${R('Servidores y AWS',ARCH[S.ui.arch]+': '+Object.entries(o.infra_parts).filter(([k,v])=>v>0.005).map(([k,v])=>k.replace(/_/g,' ')+' '+usd(v,0)).join(' · '),o.infra)}
 ${R('Datos de tráfico',bk+', '+fmt(S.g.backup_pct,0)+' % de consultas al respaldo, sobre ≈ '+fmt(o.cells,0)+' celdas ('+int(o.traffic_calls)+' peticiones al mes al principal)',o.traffic)}
 ${R('Rutas excedentes, correo, mapas, WhatsApp, opcionales','Rutas sobre el cupo gratis '+usd(o.routing)+'; correo '+usd(o.email,3)+' (hoy sale por Microsoft 365: no suma salvo que active SES o escriba la licencia); WhatsApp '+usd(o.whatsapp)+'; mapas '+usd(o.tiles)+'; opcionales activados '+usd(o.extras),o.other-o.gps)}
 ${o.gps>0?R('GPS: equipos, SIM y plataforma','Vehículos × costos por equipo de la ficha de GPS',o.gps):''}
 ${R('Subtotal costo duro','Lo que realmente se paga a AWS y proveedores',hard,1)}
 ${o.analyst>0?R('Personal: analista de inteligencia',o.n_analysts+' analista(s) × COP '+fmt(S.g.analyst_salary_cop,0)+' al mes × factor '+fmt(S.g.analyst_factor,2)+' (≈ COP '+fmt(o.analyst*S.t.trm,0)+' al mes en total)',o.analyst):''}
 ${(o.support+o.devops)>0?R('Soporte técnico y operación (DevOps)',int(N*o.p.support_h)+' h de soporte + '+fmt(S.g.devops_base_h+N*S.g.devops_h_client,1)+' h de operación × US$ '+S.g.labor_rate+'/h (SUPUESTO)',o.support+o.devops):''}
 ${R('TOTAL','',o.total,1)}</table>${o.staff>0?'':'<p class="small">Por ahora <b>no se cuenta personal</b> (ni analista de inteligencia, ni soporte, ni DevOps). Actívelo en la ficha «Personal».</p>'}
 <h3>Pagos de una sola vez (no son mensuales)</h3>
 <table><tr><th class="l">Concepto</th><th class="l">Qué incluye</th><th>${CU()} (una vez)</th><th>${CA()} (una vez)</th></tr>
 ${o.onboarding>0?`<tr><td class="l">Instalación de los ${int(N)} clientes</td><td class="l">${fmt(o.onboarding/S.g.labor_rate,0)} horas × US$ ${S.g.labor_rate}/h (SUPUESTO)</td><td>${m(o.onboarding)}</td><td>${alt(o.onboarding)}</td></tr>`:''}
 ${o.gps_once>0?`<tr><td class="l">GPS: equipos e instalación</td><td class="l">${int(o.devices)} vehículos según la ficha de GPS</td><td>${m(o.gps_once)}</td><td>${alt(o.gps_once)}</td></tr>`:''}${(o.onboarding>0||o.gps_once>0)?'':'<tr><td colspan="4" class="l small">Sin pagos únicos incluidos por ahora.</td></tr>'}</table>`;
}
function outSummary(){
 const N=S.ui.N,pi=S.ui.prof,o=calc(N,pi,S); const ot=o.traffic+o.other;
 const items=[{l:'Servidores y AWS',v:o.infra,c:COLORS.infra},{l:'Datos de tráfico (HERE/TomTom)',v:o.traffic,c:COLORS.traffic},{l:'Otros proveedores',v:o.other,c:COLORS.other},{l:'Personal',v:o.staff,c:COLORS.support}];
 const hard=o.tech;
 const pName=['Bajo','Medio','Alto'][pi];
 const share=x=>fmt(x/o.total*100,0);
 const devCost=(o.p.hours_day*3600*30/Math.max(o.p.gps_nominal,60))*S.g.row_bytes/1e9*(S.t.ebs_gp3+S.g.backup_factor*S.t.s3);
 const gpsNote=o.gps>0?' Incluye los costos de GPS que usted activó en la ficha de GPS.':' No incluye el equipo, la SIM ni la plataforma GPS (los paga el cliente), salvo que los active en la ficha de GPS.';
 return `<div class="cards">
  <div class="card big"><b>${usd(o.total,0)}</b><span>Total aproximado por mes (≈ ${cop(o.total)})</span><em>Qué es: lo que costaría mantener XiGOS cada mes. Cómo se calcula: servidores y AWS + datos de tráfico + otros proveedores + el personal que usted active.</em></div>
  <div class="card"><b>${usd(hard,0)}</b><span>«Costo duro» por mes (≈ ${cop(hard)})</span><em>Qué es: solo lo que se paga a AWS y a proveedores, sin personal. Es dinero que sale sí o sí.</em></div>
  <div class="card"><b>${usd(o.total/N,2)}</b><span>Por cliente al mes (≈ ${cop(o.total/N)})</span><em>Cómo se calcula: total ÷ ${int(N)} cliente(s). Sirve para presupuestar cuánto cuesta atender a cada cliente.</em></div>
  <div class="card"><b>${usd(o.total*12,0)}</b><span>Por año (≈ ${cop(o.total*12)})</span><em>Cómo se calcula: total mensual × 12.</em></div>
  <div class="card wide"><b>${usd(o.total/o.devices,2)}</b><span>Costo promedio por vehículo al mes (repartido)</span><em><b>Cómo entenderlo:</b> es como repartir la cuenta entre todos. Se toma el total de ${usd(o.total,0)} y se divide entre los ${int(o.devices)} vehículos (${int(N)} cliente(s) × ${int(o.p.devices)} vehículos cada uno): ${usd(o.total,0)} ÷ ${int(o.devices)} = ${usd(o.total/o.devices,2)}. <b>No es lo que cuesta cada vehículo:</b> un vehículo adicional solo agrega ≈ ${usd(devCost,4)} al mes (guardar sus posiciones). La cifra baja si hay más vehículos porque los costos fijos (servidores, zonas del mapa, personal) se reparten entre más, y sube si hay pocos.${gpsNote}</em></div>
  ${o.onboarding>0?`<div class="card full"><b>${usd(o.onboarding,0)}</b><span>Instalación de los ${int(N)} clientes (una sola vez)</span><em>Pago único, no mensual: horas de instalación × tarifa por hora (supuesto).</em></div>`:''}</div>
 ${barHtml(items)}
 <div class="box info"><b>En palabras simples:</b> con <b>${int(N)} cliente(s)</b> de uso <b>${pName.toLowerCase()}</b> (${int(o.devices)} vehículos en total) alojados en <b>${ARCH[S.ui.arch]}</b>, mantener XiGOS cuesta alrededor de <b>${usd(o.total,0)} al mes</b>. De cada 100 dólares, <b>${share(o.infra)}</b> se van en servidores y AWS, <b>${share(o.traffic)}</b> en datos de tráfico de proveedores, <b>${share(o.other)}</b> en otros servicios y <b>${share(o.staff)}</b> en personal${o.staff>0?'':' (por ahora no se cuenta personal)'}. Cada vehículo adicional solo agrega ≈ <b>${usd(o.pos_gb*0+ (o.p.hours_day*3600*30/Math.max(o.p.gps_nominal,60))*S.g.row_bytes/1e9*(S.t.ebs_gp3+S.g.backup_factor*S.t.s3),4)}</b> al mes.</div>
 ${sumTable(o,N,hard)}
 <div class="box"><b>Qué NO incluye este resumen:</b> equipo, SIM y plataforma GPS (los paga el cliente; solo se cuentan si los activa en la ficha de GPS, y no tienen cotización); intermediario de WhatsApp; Microsoft 365; dominio (salvo que lo escriba); soporte de AWS; impuestos. ${S.ui.arch===4?'En Fargate tampoco el almacenamiento de PDF (EFS/S3).':''}</div>`;
}
function outDiagram(){
 return `<svg viewBox="0 0 960 400" width="100%" role="img" aria-label="Mapa de cómo se conecta XiGOS y qué se cobra">
 <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#5a6577"/></marker></defs>
 <style>text{font-family:Segoe UI,Arial;font-size:12px;fill:#1c2330}.t{font-weight:700;font-size:13px}.m{fill:#5a6577;font-size:11px}.r {fill:#b3261e;font-weight:700;font-size:11.5px}rect.b{fill:#fff;stroke:#7d8aa5;rx:8}rect.g{fill:#eef3fb;stroke:#a9c4ec;rx:10}rect.y{fill:#fff7e0;stroke:#d9b45a;rx:8}</style>
 <rect class="g" x="10" y="10" width="190" height="380"/><text class="t" x="22" y="32">Su cliente</text>
 <rect class="b" x="24" y="48" width="162" height="62"/><text x="34" y="70">Usuarios con el</text><text x="34" y="86">navegador (panel)</text><text class="m" x="34" y="102">mapas gratis de OSM</text>
 <rect class="b" x="24" y="150" width="162" height="70"/><text x="34" y="172">Vehículos con GPS</text><text x="34" y="188">(equipo + SIM)</text><text class="r" x="34" y="208">lo paga el cliente</text>
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
 <rect class="b" x="664" y="254" width="272" height="52"/><text x="674" y="274">Eje Satelital (plataforma GPS)</text><text class="r" x="674" y="294">precio no público · del cliente</text>
 <rect class="b" x="664" y="318" width="272" height="60"/><text x="674" y="335">WhatsApp (Meta)</text><text class="m" x="674" y="350">pendiente de implementación</text><text class="r" x="674" y="366">US$ 0,0008 por mensaje de utilidad</text>
 <path d="M186 79 L268 73" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M398 73 L430 73" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M495 98 L495 128" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M398 153 L430 153" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M420 246 L420 270" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M580 326 C 610 326 620 70 664 70" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M580 332 C 620 332 630 122 664 120" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M580 338 C 625 338 635 172 664 172" stroke="#5a6577" fill="none" marker-end="url(#ar)"/><path d="M580 344 C 630 344 640 224 664 224" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M398 168 C 470 214 600 270 664 280" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 <path d="M186 185 L664 280" stroke="#9aa5bd" stroke-dasharray="4 4" fill="none"/>
 <path d="M268 160 C 230 280 210 290 186 290" stroke="#5a6577" fill="none" marker-end="url(#ar)"/>
 </svg><p class="small">Las líneas muestran quién le pregunta a quién. Lo marcado en rojo es lo que genera costo. El GPS pasa por la plataforma del cliente (Eje Satelital) y XiGOS solo consulta sus posiciones.</p>`;
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
  return `<tr><td class="l">${int(n)}</td><td>${int(o.devices)}</td><td>${fmt(o.cells,0)}</td><td>${m(o.infra,0)}</td><td>${m(o.traffic,0)}</td><td>${m(other,0)}</td><td>${m(o.tech,0)}</td><td>${m(o.staff,0)}</td><td><b>${m(o.total,0)}</b></td><td>${m(o.total/n)}</td><td>${m(o.total/o.devices)}</td><td>${m(o.total*12,0)}</td><td>${alt(o.total)}</td></tr>`; }).join('');
 return `<div class="scroll"><table id="tbl-proj"><tr><th class="l">Clientes</th><th>Vehículos</th><th>Zonas (celdas)</th><th>Servidores y AWS (${CU()})</th><th>Datos de tráfico (${CU()})</th><th>Otros prov. (${CU()})</th><th>Costo duro (${CU()})</th><th>Personal (${CU()})</th><th>TOTAL ${CU()}/mes</th><th>${CU()} por cliente</th><th>${CU()} por vehículo</th><th>${CU()} por año</th><th>${CA()} por mes</th></tr>${rows}</table></div>`;
}
function outProj(){ return projTable(S.ui.prof); }
function outArchs(){
 const rows=S.ui.scales.map(n=>{const o=calc(n,S.ui.prof,S); const mn=Math.min(o.A,o.B,o.C,o.D);const c=v=>v===mn?`<b>${m(v,0)}</b>`:m(v,0); return `<tr><td class="l">${int(n)}</td><td>${c(o.A)}</td><td>${c(o.B)}</td><td>${c(o.C)}</td><td>${c(o.D)}</td></tr>`;}).join('');
 return `<table><tr><th class="l">Clientes</th><th>A · Lightsail (${CU()})</th><th>B · EC2+RDS (${CU()})</th><th>C · Alta disp. (${CU()})</th><th>D · Fargate+RDS (${CU()})</th></tr>${rows}</table><p class="small">En negrita, la más económica en dinero. La opción A es la más económica, pero sin alta disponibilidad (ver el orden por varios criterios en «Cuál conviene»).</p>`;
}
function outProfs(){
 const rows=S.ui.scales.map(n=>{const a=calc(n,0,S),b=calc(n,1,S),c=calc(n,2,S); return `<tr><td class="l">${int(n)}</td><td>${m(a.total,0)}</td><td>${m(b.total,0)}</td><td>${m(c.total,0)}</td><td>${m(a.total/n)}</td><td>${m(b.total/n)}</td><td>${m(c.total/n)}</td></tr>`;}).join('');
 return `<table><tr><th class="l">Clientes</th><th>Total Bajo (${CU()})</th><th>Total Medio (${CU()})</th><th>Total Alto (${CU()})</th><th>Por cliente Bajo</th><th>Por cliente Medio</th><th>Por cliente Alto</th></tr>${rows}</table>`;
}
/* ----------------------------- Gráficas (SVG propio, sin librerías) ----------------------------- */
// Colores: paleta categórica validada (orden fijo: azul, naranja, aguamarina, amarillo, magenta). Cada concepto conserva SIEMPRE su color.
let CW=560;   // ancho de dibujo de las gráficas (se ajusta al recuadro donde van)
const PAL={infra:'#2a78d6',traffic:'#eb6834',other:'#1baf7a',gps:'#eda100',staff:'#e87ba4'};
const ARCHC={A:'#2a78d6',B:'#eb6834',C:'#1baf7a',D:'#eda100'};
const INK='#0b0b0b',INK2='#52514e',MUTED='#898781',GRID='#e1e0d9',AXIS='#c3c2b7',SURF='#fcfcfb';
const VU=()=>S.ui.unit==='cop'?S.t.trm:1;
const vf=(x,d=0)=>S.ui.unit==='cop'?'COP '+fmt(x*S.t.trm,0):'US$ '+fmt(x,d);
const cmp=v=>{const a=Math.abs(v); const I=x=>Number.isInteger(Math.round(x*10)/10)&&Math.abs(x-Math.round(x))<1e-9; if(a>=1e9) return fmt(v/1e9,I(v/1e9)?0:1)+' mil M'; if(a>=1e6) return fmt(v/1e6,I(v/1e6)?0:1)+' M'; if(a>=1e3){const k=v/1e3; return fmt(k,I(k)||a>=1e4?0:1)+' mil';} return fmt(v,I(v)?0:(a>0&&a<0.1?2:(a>0&&a<10?1:0)));};
const niceMax=v=>{ if(!(v>0)) return 1; const e=Math.pow(10,Math.floor(Math.log10(v))); const f=v/e; return (f<=1?1:f<=2?2:f<=5?5:10)*e; };
const tipA=t=>`data-tip="${String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"`;
const VH={}, VO={};   // series ocultas y tablas abiertas (solo en la vista interactiva)
const svgOpen=(W,H,aria)=>`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria}" class="svgc" xmlns="http://www.w3.org/2000/svg">`;

// Explica por qué «Otros» es 0 al inicio y aparece más adelante: rutas alternas que superan el cupo gratis.
function otrosTip(){
 const p=S.p.route_calls[S.ui.prof], per=p*(1-S.g.route_cache_hit), free=S.t.ors_free_month+S.t.tt_route_free, n0=Math.floor(free/per)+1;
 const cpm=43200/S.g.interval_traffic, zTT=S.t.tt_free/cpm, zHE=S.t.here_free/cpm;
 return `«Otros» NO incluye el tráfico: TomTom y HERE van en la columna «Tráfico» y ya se pagan desde el primer cliente (su cupo gratis de ${int(S.t.tt_free)} y ${int(S.t.here_free)} consultas al mes solo cubre ≈ ${fmt(zTT,1)} y ${fmt(zHE,1)} zonas vigiladas).\nAquí «Otros» solo tiene las rutas alternas, que son otro servicio (OpenRouteService y TomTom Routing, cupo gratis conjunto de ${int(free)} rutas al mes). Cada cliente pide ≈ ${int(per)} rutas nuevas al mes: el cupo se agota hacia los ${int(n0)} clientes y desde ahí se paga el excedente (EUR ${fmt(S.t.tt_route,2)} por 1.000).\nTambién suma correo (solo si usa SES), WhatsApp y mapas de pago si los activa.`;
}
function legendHtml(items,tog){ return `<div class="lg2">${items.map(i=>tog?`<label class="lgi" ${i.tip?tipA(i.tip):''}><input type="checkbox" data-vz="${i.k}" ${VH[i.k]?'':'checked'}><i style="background:${i.c}"></i>${i.l}${i.tip?' ⓘ':''}</label>`:`<span class="lgi"><i style="background:${i.c}"></i>${i.l}</span>`).join('')}</div>`; }
const tbl=(heads,rows)=>`<div class="scroll"><table><tr>${heads.map((h,i)=>`<th${i?'':' class="l"'}>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map((c,i)=>`<td${i?'':' class="l"'}>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;

function svgHBars(items,aria){
 const W=CW,rowH=42,L=172,R=164,T=8,H=T*2+rowH*items.length; const mx=Math.max(...items.map(i=>i.v),1e-9); const tot=items.reduce((a,i)=>a+i.v,0)||1;
 const wrap=(s,n)=>{ const out=[]; let cur=''; s.split(' ').forEach(w=>{ if((cur+' '+w).trim().length>n&&cur){ out.push(cur); cur=w; } else cur=(cur+' '+w).trim(); }); if(cur) out.push(cur); return out; };
 let g=''; items.forEach((it,i)=>{ const y=T+rowH*i+11, w=Math.max(2,(W-L-R)*it.v/mx), ls=wrap(it.l,24);
  g+=ls.map((ln,k)=>`<text x="${L-8}" y="${y+(ls.length>1?9+k*13:14)}" text-anchor="end" font-size="12" fill="${INK2}">${ln}</text>`).join('');
  g+=`<rect class="mk" x="${L}" y="${y}" width="${w}" height="18" rx="4" fill="${it.c}" ${tipA(`${it.l}: ${vf(it.v)} al mes · ${vf(it.v*12)} al año · ${fmt(it.v/tot*100,0)} % del total`)}/>`;
  g+=`<text x="${L+w+6}" y="${y+14}" font-size="12" font-weight="600" fill="${INK}">${vf(it.v)} · ${fmt(it.v/tot*100,0)} %</text>`; });
 g+=`<line x1="${L}" x2="${L}" y1="${T}" y2="${H-T}" stroke="${AXIS}"/>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}
function svgStacked(cats,series,xlabel,aria,xname){
 const W=CW,H=300,L=62,R=10,T=18,B=42,pw=W-L-R,ph=H-T-B; const u=VU();
 const tot=cats.map((_,i)=>series.reduce((a,s)=>a+(s.v[i]||0),0)); const mx=niceMax(Math.max(...tot,1e-9)*u)/u; let g='';
 for(let k=0;k<=4;k++){ const y=T+ph-ph*k/4; g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="${GRID}"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="${MUTED}">${cmp(mx*u*k/4)}</text>`; }
 const band=pw/cats.length, bw=Math.min(46,band*0.64);
 cats.forEach((c,i)=>{ const x=L+band*i+(band-bw)/2; let acc=0;
  series.forEach(s=>{ const v=s.v[i]||0; if(v<=0) return; const h=ph*v/mx, y=T+ph-ph*(acc+v)/mx; acc+=v;
   g+=`<rect class="mk" x="${x}" y="${y}" width="${bw}" height="${Math.max(h,.5)}" fill="${s.c}" stroke="${SURF}" stroke-width="2" rx="2" ${tipA(`${xname} ${fmt(c,0)} · ${s.l}: ${vf(v)} al mes (${fmt(v/tot[i]*100,0)} % del total)`)}/>`; });
  g+=`<text x="${x+bw/2}" y="${T+ph-ph*tot[i]/mx-5}" text-anchor="middle" font-size="10.5" font-weight="600" fill="${INK}">${cmp(tot[i]*u)}</text>`;
  g+=`<text x="${x+bw/2}" y="${H-B+16}" text-anchor="middle" font-size="11" fill="${INK2}">${fmt(c,0)}</text>`; });
 g+=`<line x1="${L}" x2="${W-R}" y1="${T+ph}" y2="${T+ph}" stroke="${AXIS}"/><text x="${L+pw/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${MUTED}">${xlabel}</text>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}
function svgLines(xs,series,o){ // o:{logY, xlabel, aria, xname, dec}
 const W=o.w||CW,H=290,L=62,R=78,T=16,B=42,pw=W-L-R,ph=H-T-B,u=VU(); const n=xs.length;
 const pos=series.flatMap(s=>s.v).filter(v=>v>0); if(!pos.length) return '<p class="small">No hay datos para graficar.</p>';
 let ymap,ticks=[];
 if(o.logY){ let lo=Math.floor(Math.log10(Math.min(...pos)*u)), hi=Math.ceil(Math.log10(Math.max(...pos)*u)); if(hi<=lo) hi=lo+1; ymap=v=>T+ph-ph*(Math.log10(Math.max(v,1e-12)*u)-lo)/(hi-lo); for(let k=lo;k<=hi;k++) ticks.push([Math.pow(10,k),T+ph-ph*(k-lo)/(hi-lo)]); }
 else { const mx=niceMax(Math.max(...pos)*u); ymap=v=>T+ph-ph*(v*u)/mx; for(let k=0;k<=4;k++) ticks.push([mx*k/4,T+ph-ph*k/4]); }
 let g=''; ticks.forEach(([v,y])=>{ g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="${GRID}"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="${MUTED}">${cmp(v)}</text>`; });
 const xp=i=>L+pw*(i+.5)/n; xs.forEach((x,i)=>{ g+=`<text x="${xp(i)}" y="${H-B+16}" text-anchor="middle" font-size="11" fill="${INK2}">${fmt(x,0)}</text>`; });
 g+=`<line x1="${L}" x2="${W-R}" y1="${T+ph}" y2="${T+ph}" stroke="${AXIS}"/><text x="${L+pw/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="${MUTED}">${o.xlabel}</text>`;
 const ends=[];
 const colsAt=()=>{ let q=''; xs.forEach((x,i)=>{ const lines=series.filter(s=>s.v[i]>0).map(s=>`${s.l}: ${vf(s.v[i],o.dec===undefined?0:o.dec)}`); q+=`<rect class="col" x="${xp(i)-pw/n/2}" y="${T}" width="${pw/n}" height="${ph}" fill="transparent" ${tipA(`${o.xname} ${fmt(x,0)}\n`+lines.join('\n'))}/>`; }); return q; };
 series.forEach(s=>{ const pts=s.v.map((v,i)=>v>0?[xp(i),ymap(v),v,i]:null).filter(Boolean); if(!pts.length) return;
  g+=`<path d="${pts.map((p,k)=>(k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')}" fill="none" stroke="${s.c}" stroke-width="2" stroke-linejoin="round"/>`;
  pts.forEach(p=>{ g+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${s.c}" stroke="${SURF}" stroke-width="2"/>`; });
  const last=pts[pts.length-1]; ends.push({y:last[1],x:last[0],s}); });
 ends.sort((a,b)=>a.y-b.y); let prev=-99; ends.forEach(e=>{ const lab=e.s.short||e.s.l; if(series.length>1&&series.length<=4&&e.y-prev>=13&&lab.length*6.4+12<=W-e.x-2){ g+=`<text x="${e.x+9}" y="${e.y+4}" font-size="11" font-weight="600" fill="${INK2}">${lab}</text>`; prev=e.y; } });
 return svgOpen(W,H,o.aria)+g+colsAt()+'</svg>';
}
function svgTornado(items,base,aria){
 const W=CW,rowH=44,L=200,R=12,T=26,H=T+rowH*items.length+8; const half=(W-L-R)/2, x0=L+half; const mxd=Math.max(...items.flatMap(i=>[Math.abs(i.lo-base),Math.abs(i.hi-base)]),1e-9);
 let g=`<text x="${x0-half}" y="14" font-size="11" fill="${MUTED}">← baja el costo</text><text x="${x0+half}" y="14" font-size="11" text-anchor="end" fill="${MUTED}">sube el costo →</text>`;
 items.forEach((it,i)=>{ const y=T+rowH*i+4; const words=it.l.split(' '); const lines=[]; let cur=''; words.forEach(w=>{ if((cur+' '+w).trim().length>30&&cur){ lines.push(cur); cur=w; } else cur=(cur+' '+w).trim(); }); if(cur) lines.push(cur);
  g+=lines.map((ln,k)=>`<text x="${L-8}" y="${y+(lines.length>1?11+k*14:16)}" text-anchor="end" font-size="11.5" fill="${INK2}">${ln}</text>`).join('');
  [[it.lo,'Si baja 25 %',PAL.infra,0],[it.hi,'Si sube 25 %',PAL.traffic,1]].forEach(([val,lab,col,k])=>{ const d=val-base, w=Math.abs(d)/mxd*half, x=d>=0?x0:x0-w, yy=y+k*16;
   g+=`<rect class="mk" x="${x}" y="${yy}" width="${Math.max(w,1.5)}" height="13" rx="3" fill="${col}" ${tipA(`${it.l} — ${lab}: el total mensual pasa de ${vf(base)} a ${vf(val)} (${d>=0?'+':'−'}${vf(Math.abs(d))})`)}/>`;
   const lab2=`${d>=0?'+':'−'}${cmp(Math.abs(d)*VU())}`, bw2=Math.max(w,1.5), fits=d>=0?(x0+bw2+4+38<=W-2):(x0-bw2-4-38>=2);
   g+=fits?`<text x="${d>=0?x0+bw2+4:x0-bw2-4}" y="${yy+11}" font-size="10.5" text-anchor="${d>=0?'start':'end'}" fill="${INK2}">${lab2}</text>`:`<text x="${d>=0?x0+bw2-5:x0-bw2+5}" y="${yy+11}" font-size="10.5" font-weight="600" text-anchor="${d>=0?'end':'start'}" fill="#fff">${lab2}</text>`; }); });
 g+=`<line x1="${x0}" x2="${x0}" y1="${T-6}" y2="${H-6}" stroke="${AXIS}"/>`;
 return svgOpen(W,H,aria)+g+'</svg>';
}

/* ----------------------------- Definición de cada gráfica ----------------------------- */
const withS=(fn)=>{ const s=clone(S); fn(s); return s; };
function perClient(o){ return o.total/o.N; }
const CH=[
 {id:'desglose',title:'¿Dónde se va el dinero?',
  what:'Reparte el costo mensual total entre sus partes: servidores, datos de tráfico, otros proveedores, GPS y personal.',
  how:'Cada barra es una parte; mientras más larga, más pesa. A la derecha está su valor y qué porcentaje del total es.',
  build:()=>{ const N=S.ui.N,o=calc(N,S.ui.prof,S); const items=[{l:'Servidores y AWS',v:o.infra,c:PAL.infra},{l:'Datos de tráfico (HERE+TomTom)',v:o.traffic,c:PAL.traffic},{l:'Otros proveedores',v:o.other-o.gps,c:PAL.other}];
   if(o.gps>0) items.push({l:'GPS (equipos, SIM, plataforma)',v:o.gps,c:PAL.gps}); if(o.staff>0) items.push({l:'Personal',v:o.staff,c:PAL.staff});
   const top=[...items].sort((a,b)=>b.v-a.v)[0];
   return {legend:'',svg:svgHBars(items,'Reparto del costo mensual por concepto'),note:`Con ${int(N)} cliente(s), lo que más pesa es <b>${top.l}</b>: ${vf(top.v)} al mes (${fmt(top.v/o.total*100,0)} % del total de ${vf(o.total)}).`,
    table:tbl(['Concepto','Al mes','Al año','% del total'],items.map(i=>[i.l,vf(i.v,2),vf(i.v*12),fmt(i.v/o.total*100,1)+' %']))}; }},
 {id:'crecimiento',title:'Cómo crece el costo al tener más clientes',
  what:'El costo mensual de cada parte (y el total) para distintas cantidades de clientes.',
  how:'Cada línea es una parte del costo (vea la leyenda); la negra es el total. La escala vertical es logarítmica: cada raya vale 10 veces la anterior, así se ven juntas las cifras pequeñas y las grandes. Una línea que se aplana (como la de tráfico) significa que deja de crecer aunque haya más clientes. Puede apagar líneas con las casillas.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S));
   const all=[{k:'infra',l:'Servidores y AWS',c:PAL.infra,v:os.map(o=>o.infra)},{k:'traffic',l:'Datos de tráfico',c:PAL.traffic,v:os.map(o=>o.traffic)},{k:'other',l:'Otros proveedores',tip:otrosTip(),c:PAL.other,v:os.map(o=>o.other-o.gps)},
    {k:'gps',l:'GPS',c:PAL.gps,v:os.map(o=>o.gps)},{k:'staff',l:'Personal',c:PAL.staff,v:os.map(o=>o.staff)}].filter(s=>s.v.some(x=>x>0.005));
   all.push({k:'total',l:'TOTAL',c:INK,v:os.map(o=>o.total)});
   const vis=all.filter(s=>!(tog&&VH[s.k])); const f=os[0],l=os[os.length-1];
   return {legend:legendHtml(all,tog),svg:vis.length?svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo mensual de cada parte y total según el número de clientes',xname:'Con',dec:0}):'<p class="small">Active al menos una línea en la leyenda.</p>',
    note:`Con ${int(sc[0])} cliente(s) cuesta ${vf(f.total)} al mes; con ${int(sc[sc.length-1])}, ${vf(l.total)}. El total sube, pero por cliente baja de ${vf(f.total/sc[0])} a ${vf(l.total/sc[sc.length-1])} (siguiente gráfica).`,
    table:tbl(['Clientes','Servidores y AWS','Tráfico',`<span ${tipA(otrosTip())}>Otros ⓘ</span>`,'GPS','Personal','TOTAL al mes','TOTAL al año'],sc.map((n,i)=>[int(n),vf(os[i].infra),vf(os[i].traffic),vf(os[i].other-os[i].gps),vf(os[i].gps),vf(os[i].staff),vf(os[i].total),vf(os[i].total*12)]))}; }},
 {id:'promedio',title:'Cuánto cuesta cada cliente (promedio) al crecer',
  what:'El costo mensual promedio de UN cliente según cuántos clientes tenga XiGOS.',
  how:'Cada punto es una cantidad de clientes (abajo). Si la línea baja, atender a cada cliente cuesta menos, porque los costos fijos (el hub, las zonas del mapa) se reparten entre más clientes.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S)); const same=os.every(o=>Math.abs(o.total-o.tech)<1e-9);
   const ser=[{k:'tot',l:same?'Costo por cliente':'Total por cliente (con personal)',short:'Total',c:PAL.infra,v:os.map(o=>o.total/o.N)}]; if(!same) ser.push({k:'duro',l:'Costo duro por cliente (sin personal)',short:'Costo duro',c:PAL.traffic,v:os.map(o=>o.tech/o.N)});
   const vis=ser.filter(s=>!(tog&&VH[s.k])); const f=os[0],l=os[os.length-1];
   return {legend:same?'':legendHtml(ser,tog),svg:svgLines(sc,vis,{xlabel:'Número de clientes',aria:'Costo mensual promedio por cliente',xname:'Con',dec:2}),
    note:`Con ${int(sc[0])} cliente(s) cada uno cuesta ${vf(f.total/sc[0],2)} al mes; con ${int(sc[sc.length-1])}, ${vf(l.total/sc[sc.length-1],2)}.`,
    table:tbl(['Clientes','Total por cliente al mes','Costo duro por cliente','Total por cliente al año'],sc.map((n,i)=>[int(n),vf(os[i].total/n,2),vf(os[i].tech/n,2),vf(os[i].total*12/n)]))}; }},
 {id:'vehiculo',title:'¿Un vehículo más sube el costo?',
  what:'Qué pasa con el costo si cada cliente tiene más o menos vehículos con GPS (el número de clientes se mantiene).',
  how:'A la izquierda, el costo total del mes: casi no se mueve. A la derecha, el promedio por vehículo: baja porque el costo fijo se reparte entre más vehículos. Por eso el «costo por vehículo» es solo un promedio.',
  build:()=>{ const N=S.ui.N,pi=S.ui.prof,ds=[1,2,5,10,20,50,100,200]; const os=ds.map(d=>calc(N,pi,withS(s=>{s.p.devices=[d,d,d];})));
   const half=CW>=640?Math.round((CW-12)/2):CW;
   const a=svgLines(ds,[{k:'t',l:'Costo total al mes',c:PAL.infra,v:os.map(o=>o.total)}],{w:half,xlabel:'Vehículos por cliente',aria:'Costo total mensual según vehículos por cliente',xname:'Con',dec:0});
   const b=svgLines(ds,[{k:'p',l:'Promedio por vehículo',c:PAL.traffic,v:os.map(o=>o.total/o.devices)}],{w:half,logY:true,xlabel:'Vehículos por cliente',aria:'Promedio mensual por vehículo según vehículos por cliente',xname:'Con',dec:2});
   const dc=(os[os.length-1].total-os[0].total)/((ds[ds.length-1]-ds[0])*N);
   return {legend:'',svg:`<div class="two"><div><div class="mini">Costo TOTAL al mes</div>${a}</div><div><div class="mini">Promedio POR VEHÍCULO al mes (escala logarítmica)</div>${b}</div></div>`,
    note:`Pasar de ${ds[0]} a ${ds[ds.length-1]} vehículos por cliente cambia el total en solo ${vf(os[os.length-1].total-os[0].total,2)} (≈ ${vf(dc,4)} por vehículo adicional al mes). El promedio baja de ${vf(os[0].total/os[0].devices,2)} a ${vf(os[os.length-1].total/os[os.length-1].devices,2)} por vehículo.`,
    table:tbl(['Vehículos por cliente','Vehículos en total','Total al mes','Promedio por vehículo'],ds.map((d,i)=>[int(d),int(os[i].devices),vf(os[i].total,2),vf(os[i].total/os[i].devices,2)]))}; }},
 {id:'sens',title:'¿Qué mueve más el resultado?',
  what:'Cuánto cambia el costo mensual total si cada supuesto o precio sube o baja un 25 %, uno por uno.',
  how:'Cada fila es un supuesto. La barra azul muestra qué pasa si baja 25 %; la naranja, si sube 25 %. Las barras más largas son los supuestos que más importa confirmar con datos reales.',
  build:()=>{ const N=S.ui.N,pi=S.ui.prof; const base=calc(N,pi,S).total; const defs=[
    ['Zonas del mapa que vigila cada cliente',(s,f)=>{s.p.cells_pc=s.p.cells_pc.map(v=>v*f);}],['Zonas posibles en el país (tope)',(s,f)=>{s.g.ncap*=f;}],['Minutos entre consultas de tráfico',(s,f)=>{s.g.interval_traffic*=f;}],
    ['% de consultas al proveedor de respaldo',(s,f)=>{s.g.backup_pct=Math.min(100,s.g.backup_pct*f);}],['Precio por 1.000 consultas (TomTom y HERE)',(s,f)=>{['here_t1','here_t2','here_t3','tt_t1','tt_t2'].forEach(k=>s.t[k]*=f);}],
    ['Memoria que usa cada contenedor',(s,f)=>{s.ctr.forEach(c=>c.ram*=f);}],['Precio de los servidores de AWS',(s,f)=>{['ls_4','ls_8','ls_16','ls_32','ec2_t3l','rds_single','rds_multi'].forEach(k=>s.t[k]*=f);}],
    ['Vehículos por cliente',(s,f)=>{s.p.devices=s.p.devices.map(v=>v*f);}]];
   if(S.ui.analyst) defs.push(['Sueldo del analista de inteligencia',(s,f)=>{s.g.analyst_salary_cop*=f;}]);
   if(S.ui.gps) defs.push(['Costos de GPS por equipo',(s,f)=>{s.gps.forEach(g=>{g.equip*=f;g.sim*=f;g.plat*=f;g.other*=f;g.install*=f;});}]);
   const items=defs.map(([l,fn])=>({l,lo:calc(N,pi,withS(s=>fn(s,.75))).total,hi:calc(N,pi,withS(s=>fn(s,1.25))).total})).sort((a,b)=>Math.max(Math.abs(b.lo-base),Math.abs(b.hi-base))-Math.max(Math.abs(a.lo-base),Math.abs(a.hi-base)));
   const t=items[0];
   return {legend:`<div class="lg2"><span class="lgi"><i style="background:${PAL.infra}"></i>Si baja 25 %</span><span class="lgi"><i style="background:${PAL.traffic}"></i>Si sube 25 %</span></div>`,svg:svgTornado(items,base,'Sensibilidad del costo total a cada supuesto'),
    note:`Costo base: ${vf(base)} al mes. Lo que más lo mueve es <b>${t.l}</b>: de ${vf(Math.min(t.lo,t.hi))} a ${vf(Math.max(t.lo,t.hi))}.`,
    table:tbl(['Supuesto','Total si baja 25 %','Total si sube 25 %','Diferencia máxima'],items.map(i=>[i.l,vf(i.lo),vf(i.hi),vf(Math.max(Math.abs(i.lo-base),Math.abs(i.hi-base)))]))}; }},
 {id:'aws',title:'Las cuatro formas de alojar en AWS',
  what:'El costo mensual de infraestructura según cómo se aloje XiGOS, para cada cantidad de clientes.',
  how:'Cada línea es una forma de alojar (vea la leyenda). Cuanto más abajo, más económica. La escala vertical es logarítmica (cada raya vale 10 veces la anterior) para poder ver todas juntas.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const os=sc.map(n=>calc(n,pi,S));
   const all=[{k:'A',l:'A · Lightsail',short:'A',c:ARCHC.A,v:os.map(o=>o.A)},{k:'B',l:'B · EC2 + RDS',short:'B',c:ARCHC.B,v:os.map(o=>o.B)},{k:'C',l:'C · Alta disponibilidad',short:'C',c:ARCHC.C,v:os.map(o=>o.C)},{k:'D',l:'D · Fargate + RDS',short:'D',c:ARCHC.D,v:os.map(o=>o.D)}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const l=os[os.length-1];
   return {legend:legendHtml(all,tog),svg:svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo mensual de infraestructura por forma de alojar',xname:'Con',dec:0}),
    note:`Con ${int(sc[sc.length-1])} clientes: A cuesta ${vf(l.A)}, B ${vf(l.B)}, C ${vf(l.C)} y D ${vf(l.D)} al mes. A es la más económica pero sin alta disponibilidad.`,
    table:tbl(['Clientes','A · Lightsail','B · EC2+RDS','C · Alta disp.','D · Fargate'],sc.map((n,i)=>[int(n),vf(os[i].A),vf(os[i].B),vf(os[i].C),vf(os[i].D)]))}; }},
 {id:'trafico',title:'TomTom y HERE según las zonas vigiladas',
  what:'Cuánto cuesta cada proveedor de tráfico según cuántas zonas del mapa (celdas) se vigilan.',
  how:'Cada punto es una cantidad de zonas (abajo). Cada línea es un proveedor. Se ve dónde uno empieza a costar más que el otro y cómo suma el respaldo.',
  build:(tog)=>{ const cells=[1,3,6,12,30,100,250,450]; const g=S.g,bk=g.backup_pct/100,cpm=43200/g.interval_traffic;
   const cost=c=>{ const calls=c*cpm, tc=g.backup_primary===1?calls:calls*bk, hc=g.backup_primary===1?calls*bk:calls; return {tt:tierTTeur(tc,S.t)*S.t.eurusd,here:tierHere(hc,S.t)}; };
   const cs=cells.map(cost); const all=[{k:'tt',l:'TomTom'+(g.backup_primary===1?' (principal)':' (respaldo)'),short:'TomTom',c:PAL.infra,v:cs.map(x=>x.tt)},{k:'here',l:'HERE'+(g.backup_primary===1?' (respaldo)':' (principal)'),short:'HERE',c:PAL.traffic,v:cs.map(x=>x.here)},{k:'sum',l:'Los dos juntos',short:'Total',c:PAL.other,v:cs.map(x=>x.tt+x.here)}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const l=cs[cs.length-1];
   return {legend:legendHtml(all,tog),svg:svgLines(cells,vis,{xlabel:'Zonas del mapa vigiladas (celdas)',aria:'Costo mensual de TomTom y HERE según zonas vigiladas',xname:'Con',dec:0}),
    note:`Con ${cells[cells.length-1]} zonas: TomTom ${vf(l.tt)} y HERE ${vf(l.here)} al mes (${vf(l.tt+l.here)} juntos). Con pocas zonas casi todo cae en la capa gratuita (HERE 5.000 y TomTom 2.500 consultas al mes).`,
    table:tbl(['Zonas','Consultas al mes (principal)','TomTom al mes','HERE al mes','Los dos al mes'],cells.map((c,i)=>[int(c),int(c*cpm),vf(cs[i].tt,2),vf(cs[i].here,2),vf(cs[i].tt+cs[i].here,2)]))}; }},
 {id:'analista',title:'Efecto del analista de inteligencia en el promedio',cond:()=>S.ui.analyst&&S.g.analyst_salary_cop>0,
  what:'Cómo cambia el costo promedio por cliente al sumar el sueldo del analista.',
  how:'La línea naranja es el promedio con el analista y la azul sin él. La diferencia es grande con pocos clientes y se achica al crecer, porque el sueldo se reparte entre más clientes.',
  build:(tog)=>{ const sc=S.ui.scales,pi=S.ui.prof; const a=sc.map(n=>calc(n,pi,withS(s=>{s.ui.analyst=0;}))),b=sc.map(n=>calc(n,pi,withS(s=>{s.ui.analyst=1;})));
   const all=[{k:'sin',l:'Sin analista',short:'Sin',c:PAL.infra,v:a.map((o,i)=>o.total/sc[i])},{k:'con',l:'Con analista',short:'Con',c:PAL.traffic,v:b.map((o,i)=>o.total/sc[i])}];
   const vis=all.filter(s=>!(tog&&VH[s.k])); const i=sc.length-1;
   return {legend:legendHtml(all,tog),svg:svgLines(sc,vis,{logY:true,xlabel:'Número de clientes',aria:'Costo por cliente con y sin analista',xname:'Con',dec:2}),
    note:`Con ${int(sc[0])} cliente(s), el analista sube el promedio de ${vf(a[0].total/sc[0],2)} a ${vf(b[0].total/sc[0],2)} por cliente al mes; con ${int(sc[i])}, de ${vf(a[i].total/sc[i],2)} a ${vf(b[i].total/sc[i],2)}.`,
    table:tbl(['Clientes','Por cliente sin analista','Por cliente con analista','Aumento'],sc.map((n,k)=>[int(n),vf(a[k].total/n,2),vf(b[k].total/n,2),fmt((b[k].total/a[k].total-1)*100,0)+' %']))}; }}
];
function chartCard(ch,interactive){
 if(ch.cond&&!ch.cond()) return '';
 const r=ch.build(interactive);
 return `<div class="chart"><h3>${ch.title}</h3><p class="what"><b>Qué muestra:</b> ${ch.what}</p><p class="how"><b>Cómo leerla:</b> ${ch.how}</p>${r.legend}<div class="plot">${r.svg}</div><div class="insight">${r.note}</div>
 ${interactive?`<details data-k="${ch.id}" ${VO[ch.id]?'open':''}><summary>Ver los datos de esta gráfica en tabla</summary>${r.table}</details>`:''}</div>`;
}
function diagramHtml(){
 const o=calc(S.ui.N,S.ui.prof,S); const it=(a,b,c)=>`<div class="it"><b>${a}</b>${b?`<small>${b}</small>`:''}${c?`<span class="pay">${c}</span>`:''}</div>`;
 const N=S.ui.N, arch=S.ui.arch, cs=ctrCosts(N,o,arch), perCli=cs.sumI+o.backups/N, hubC=cs.sumH;
 const hubWhere={1:'Dentro del mismo servidor Lightsail de São Paulo que las instancias de los clientes.',2:'En un servidor EC2 y una base RDS en São Paulo (AWS).',3:'En dos zonas de AWS en São Paulo, con la base de datos duplicada en vivo.',4:'Como contenedores Fargate y base RDS en São Paulo (AWS).'}[arch];
 const col=(cls,n,h,sub,body,foot)=>`<div class="col ${cls}"><h3><span class="num">${n}</span> ${h}</h3><p class="small" style="margin:0 0 4px">${sub}</p>${body}${foot?`<div class="pay foot">${foot}</div>`:''}</div>`;
 const ar='<div class="arrow" aria-hidden="true">➜</div>';
 return `<div class="dg">
  ${col('c1',1,'Su cliente','Quienes usan XiGOS',
    it('Usuarios con el navegador','Ven el panel con mapas gratis de OpenStreetMap','')+it('Vehículos con GPS','Equipo + SIM + plataforma GPS (Eje Satelital)','Lo paga el cliente a su proveedor')+it('Correo y avisos','Correo: cuenta de Microsoft 365 que Fortox ya tiene · avisos: del navegador (Web Push)','No suma al cálculo: M365 ya se paga aparte (licencia no consultada) y el aviso es gratis. Solo costaría si se cambia a Amazon SES (≈ '+usd(o.email_ses,2)+' al mes)'),'')}
  ${ar}
  ${col('c2',2,'Servidor en AWS','Una «instancia» por CADA cliente',
    it('web','Muestra el panel','')+it('api','El cerebro: permisos, datos, PDF','')+it('worker','No es una persona: es un programa «robot» que trabaja solo en segundo plano (informes PDF, avisos, seguimiento GPS)','')+it('base de datos','Guarda viajes, posiciones e informes','')
    +it('¿Por qué crece con cada cliente?','Cada cliente tiene su propia instancia, y todas reservan la misma memoria (≈ '+fmt(cs.R.A,2)+' GB) sin importar su operativa o tipo de datos. Lo único que cambia entre clientes es el volumen de datos (más vehículos = más posiciones guardadas), que casi no cuesta.',''),
    `Se paga por cada cliente: su parte del servidor ≈ ${usd(cs.sumI)} + respaldos y disco ≈ ${usd(o.backups/N)} = ≈ <b>${usd(perCli)} al mes por cliente</b> (el servidor sube en escalones al llenarse). Con ${int(N)} cliente(s), todo AWS ≈ ${usd(o.infra,0)} al mes (incluye el hub y costos fijos).`)}
  ${ar}
  ${col('c3',3,'Hub XiGOS','UNO solo para todos los clientes',
    it('hub-api','Reparte las alertas a cada cliente','')+it('collector','Pregunta a los proveedores cada 30 min','')+it('base de datos del hub','Guarda lo recogido',''),
    `<b>Costo fijo mensual compartido</b> (no es un pago único ni se multiplica por cliente): ≈ ${usd(hubC)} al mes (${usd(hubC*12,0)} al año) por su parte del servidor${arch>1?'; en esta opción se suman además el balanceador y la base RDS, que se reparten entre todos':''}. Se paga cada mes mientras XiGOS esté en operación. <b>Dónde queda:</b> ${hubWhere} <b>Respaldo:</b> el modelo cuenta copias de las bases de los clientes a S3; que la base del hub (pequeña) quede cubierta por el mismo respaldo está <u>pendiente de confirmar</u>.`)}
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
 const items=[{l:'Servidores y AWS',v:o.infra,c:COLORS.infra},{l:'Datos de tráfico (HERE + TomTom)',v:o.traffic,c:COLORS.traffic},{l:'Otros proveedores',v:o.other,c:COLORS.other},{l:'Personal',v:o.staff,c:COLORS.support}];
 return `<div class="cards"><div class="card big"><b>${usd(o.total,0)}</b><span>Total aproximado por mes (≈ ${cop(o.total)})</span></div>
 <div class="card"><b>${usd(o.tech,0)}</b><span>Solo «costo duro» por mes (≈ ${cop(o.tech)})</span></div>
 <div class="card"><b>${usd(o.total/N,2)}</b><span>Por cliente al mes</span></div><div class="card"><b>${usd(o.total*12,0)}</b><span>Por año (≈ ${cop(o.total*12)})</span></div></div>${barHtml(items)}`;
}
function setTab(t){ document.body.dataset.tab=t; document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t)); if(t==='rep') document.getElementById('rep').innerHTML=buildReport(); if(t==='viz') renderViz(); window.scrollTo(0,0); }
function buildPage(){
 document.getElementById('repctl').innerHTML=`<section><h2>Escenario</h2><p class="lead">Elija cuántos clientes simular y el resumen se recalcula solo. Las cifras son <b>aproximadas</b>: usan precios de lista oficiales (consultados el 2026-11-06) y supuestos que usted puede cambiar en la pestaña «Configuración». Los números usan punto para miles y coma para decimales (US$ 1.382 = mil trescientos ochenta y dos).</p>${SCEN()}<div id="arch-pick"></div></section>`;
 document.getElementById('cfg').innerHTML=`
 <section><h2>Configuración y contenido del reporte</h2>
  <p class="lead">Cada ficha tiene su propia ventana con las explicaciones y los valores editables. Marque <b>«En el reporte»</b> en las que quiera imprimir; al final, el PDF contiene solo lo marcado.</p>
  <div class="ctl"><button id="sel-all">Marcar todo</button><button id="sel-min">Solo resumen</button><button id="sel-none">Desmarcar todo</button><button class="pri" id="go-rep">Ver el resumen →</button></div>
  ${TILES.map(g=>`<h3>${g.g}</h3><div class="tiles">${g.items.map(tileHtml).join('')}</div>`).join('')}</section>`;
}
function update(){
 const set=(id,h)=>{const e=document.getElementById(id); if(e) e.innerHTML=h;};
 set('out-kpi',outKpi()); set('arch-pick',archPick());
 if(curModal){ set('m-traffic',outTrafficCompare()); set('m-gps',gpsTable()); set('m-staff',staffTable()); set('m-rank',outRank(S.ui.N,S.ui.prof)+outRecommend(S.ui.N,S.ui.prof)+outScale(S.ui.N,S.ui.prof)); set('m-aws',outAws()); set('m-containers',outContainers()); set('m-conn',outConn()); set('m-proj',projTable(S.ui.prof)+`<h3>Comparación de alojamientos (USD al mes)</h3>`+outArchs()); }
 for(const p of PROVS.concat(PROVS_OPT)){ document.querySelectorAll(`[data-ex="${p.id}"]`).forEach(e=>e.innerHTML=p.ex()); }
 document.querySelectorAll('[data-calc]').forEach(e=>{ const f=CALC[e.dataset.calc]; e.textContent=f&&f()?'Sí':'No'; });
 document.querySelectorAll('[data-b]').forEach(e=>{ if(document.activeElement===e) return; const v=bget(e.dataset.b); if(e.type==='checkbox') e.checked=!!v; else if(e.value!=String(v)) e.value=v; });
 if(document.body.dataset.tab==='rep') document.getElementById('rep').innerHTML=buildReport();
 if(document.body.dataset.tab==='viz') renderViz();
}
function bget(path){ if(path.startsWith('xt.')){ const e=S.extras.find(x=>x.id===path.slice(3)); return e?e.on:0; } return get(path); }
function bset(path,v){ if(path.startsWith('xt.')){ const e=S.extras.find(x=>x.id===path.slice(3)); if(e) e.on=v?1:0; } else setp(path,v); }
document.addEventListener('input',ev=>{ const e=ev.target; if(!e.dataset||!e.dataset.b) return;
 let v; if(e.type==='checkbox') v=e.checked?1:0; else if(e.type==='number'){ v=parseFloat(e.value); if(!isFinite(v)) return; if(e.dataset.b==='ui.N'){ if(v<1) return; v=Math.floor(v); } } else v=e.dataset.int?parseInt(e.value):e.value; // clientes: mínimo 1 (con 0 hay divisiones entre cero)
 bset(e.dataset.b,v); save(); update(); });
document.addEventListener('change',ev=>{ const e=ev.target;
 if(e.tagName==='SELECT'&&e.dataset.b){ bset(e.dataset.b,e.dataset.int?parseInt(e.value):e.value); save(); update(); }
 if(e.dataset&&e.dataset.b==='ui.N') e.value=S.ui.N; // si quedó vacío o en 0, vuelve al último valor válido
 if(e.id==='scales-in'){ const a=[...new Set(e.value.split(/[,;\s]+/).map(x=>parseInt(x)).filter(x=>x>0))].sort((x,y)=>x-y).slice(0,12); if(a.length){ S.ui.scales=a; save(); } e.value=S.ui.scales.join(', '); update(); } });
document.addEventListener('click',ev=>{ const t=ev.target;
 if(t.dataset&&t.dataset.open) openModal(t.dataset.open);
 if(t.id==='mx'||t.id==='modal') closeModal();
 if(t.id==='sel-all'||t.id==='sel-none'||t.id==='sel-min'){ for(const k in S.rep) S.rep[k]=t.id==='sel-all'?1:(t.id==='sel-min'&&k==='resumen'?1:0); save(); document.querySelectorAll('[data-b^="rep."]').forEach(c=>c.checked=!!S.rep[c.dataset.b.slice(4)]); update(); }
 if(t.id==='go-rep') setTab('viz');
 if(t.id==='btn-print-viz') doPrint();
 if(t.id==='go-cfg') setTab('cfg');
 const ap=t.closest&&t.closest('[data-arch]'); if(ap){ S.ui.arch=parseInt(ap.dataset.arch); save(); update(); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&curModal) closeModal(); });
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));

/* ----------------------------- Botones ----------------------------- */
function dl(name,mime,text){ const b=new Blob([text],{type:mime}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }
function doPrint(){ if(curModal) closeModal(); document.getElementById('rep').innerHTML=buildReport(); window.print(); }
document.getElementById('btn-pdf').onclick=doPrint;
document.getElementById('btn-csv').onclick=()=>{
 const pr=S.ui.prof; const hdr=['Clientes','Vehiculos','Celdas','Servidores y AWS USD','Datos de trafico USD','Otros proveedores USD','Costo duro USD','Personal USD','TOTAL USD/mes','USD por cliente','USD por vehiculo','USD por ano','COP por mes'];
 const lines=[hdr.join(';')]; for(const n of S.ui.scales){ const o=calc(n,pr,S); const other=o.other;
  lines.push([n,o.devices,o.cells,o.infra,o.traffic,other,o.tech,o.staff,o.total,o.total/n,o.total/o.devices,o.total*12,o.total*S.t.trm].map(x=>typeof x==='number'?x.toFixed(2).replace('.',','):x).join(';')); }
 lines.push(''); lines.push('Perfil;'+['Bajo','Medio','Alto'][pr]+';Alojamiento;'+ARCH[S.ui.arch]);
 dl('xigos-proyeccion.csv','text/csv;charset=utf-8','﻿'+lines.join('\r\n')); };
document.getElementById('btn-save').onclick=()=>dl('xigos-configuracion.json','application/json',JSON.stringify(S,null,1));
document.getElementById('btn-load').onclick=()=>document.getElementById('file-load').click();
document.getElementById('file-load').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ localStorage.setItem(KEY,r.result); S=load(); buildPage(); update(); }catch(x){ alert('No se pudo leer el archivo.'); } }; r.readAsText(f); };
document.getElementById('btn-reset').onclick=()=>{ if(confirm('¿Restaurar todos los valores originales? Se pierden sus cambios.')){ S=clone(DEF); save(); if(curModal) closeModal(); buildPage(); update(); } };
window.addEventListener('beforeprint',()=>{ document.getElementById('rep').innerHTML=buildReport(); });

const more=document.getElementById('btn-more'), moreList=document.getElementById('more-list');
more.onclick=e=>{ e.stopPropagation(); const open=moreList.hidden; if(open&&innerWidth<=700) moreList.style.top=(more.getBoundingClientRect().bottom+6)+'px'; moreList.hidden=!open; more.setAttribute('aria-expanded',String(open)); };
document.addEventListener('click',e=>{ if(e.target.closest('#more-list button')||!e.target.closest('.menu')){ moreList.hidden=true; more.setAttribute('aria-expanded','false'); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ moreList.hidden=true; more.setAttribute('aria-expanded','false'); } });
const GK='xigos-guide-hidden'; const showGuide=on=>{ document.getElementById('guide').hidden=!on; try{ localStorage.setItem(GK,on?'0':'1'); }catch(e){} if(on){ setTab('viz'); window.scrollTo(0,0); } };
document.getElementById('guide-close').onclick=()=>showGuide(false); document.getElementById('btn-guide').onclick=()=>showGuide(true);
try{ document.getElementById('guide').hidden=localStorage.getItem(GK)==='1'; }catch(e){ document.getElementById('guide').hidden=false; }
let rzT; addEventListener('resize',()=>{ clearTimeout(rzT); rzT=setTimeout(()=>{ if(document.body.dataset.tab==='viz') renderViz(); },200); });
document.body.dataset.tab='viz'; buildPage(); update();
