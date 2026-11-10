/* ============================================================
   NUBES: nombres, textos, fuentes, confianza y datos pendientes de AWS, Google Cloud y Azure.
   Las tarifas numéricas están en model.js (DEF.t = AWS; DEF.tc = Google Cloud y Azure). Aquí solo hay textos y helpers.
   (Script clásico: comparte el ámbito global con los demás archivos de js/; el orden de carga está en index.html.)
   ============================================================ */
const CLOUD_IDS=['aws','gcp','azure'];
const CLOUDS={
 aws:{name:'AWS',full:'Amazon Web Services',region:'São Paulo (sa-east-1)',date:'2026-11-05',
  arch:{1:'A · Un servidor Lightsail (Docker Compose)',2:'B · Servidores EC2 + base RDS',3:'C · B con alta disponibilidad (2 zonas)',4:'D · Contenedores administrados (ECS Fargate) + RDS'},
  tag:{1:'A · Lightsail',2:'B · EC2 + RDS',3:'C · Alta disponibilidad',4:'D · Fargate + RDS'},
  l:{a:'Lightsail',srv:'EC2',db:'RDS',dbm:'RDS Multi-AZ',ctr:'Fargate',store:'S3',lb:'balanceador (ALB)',vm:'servidor Lightsail',logs:'CloudWatch',reg:'ECR',zones:'zonas de AWS'},
  parts:{},
  src:'Listas oficiales de precios de AWS (pricing.us-east-1.amazonaws.com), región São Paulo.',
  conf:'ALTA',pending:[],low:[]},
 gcp:{name:'Google Cloud',full:'Google Cloud Platform',region:'São Paulo (southamerica-east1)',date:'2026-11-10',
  arch:{1:'A · Una máquina virtual (Compute Engine, Docker Compose)',2:'B · Máquinas virtuales + base Cloud SQL',3:'C · B con alta disponibilidad (2 zonas)',4:'D · Contenedores administrados (Cloud Run) + Cloud SQL'},
  tag:{1:'A · Una máquina virtual',2:'B · Compute Engine + Cloud SQL',3:'C · Alta disponibilidad',4:'D · Cloud Run + Cloud SQL'},
  l:{a:'máquina virtual de Compute Engine',srv:'Compute Engine',db:'Cloud SQL',dbm:'Cloud SQL con alta disponibilidad',ctr:'Cloud Run',store:'Cloud Storage',lb:'balanceador de carga',vm:'máquina virtual',logs:'Cloud Logging',reg:'Artifact Registry',zones:'zonas de Google Cloud'},
  parts:{servidores:'Máquina(s) virtual(es) + disco + IP',servidores_ec2:'Máquinas virtuales (Compute Engine)',discos_ebs:'Discos de las máquinas (balanced)',ip_publica_servidores:'IP públicas de las máquinas',base_rds:'Base de datos Cloud SQL',base_rds_multi_az:'Base de datos Cloud SQL con alta disponibilidad',almacenamiento_rds:'Disco de Cloud SQL (SSD)',
   balanceador_alb:'Balanceador de carga (cargo fijo)',balanceador_lcu:'Balanceador (por uso)',nat_hora:'Cloud NAT (fijo)',nat_datos:'Cloud NAT (por GB que pasa)',logs_cloudwatch:'Registros (Cloud Logging)',ecr:'Registro de imágenes (Artifact Registry)',secretos:'Secret Manager',
   respaldos:'Respaldos en Cloud Storage',dns_dominio:'DNS (Cloud DNS) y dominio',contenedores_fargate_clientes:'Contenedores Cloud Run de los clientes',contenedores_fargate_hub:'Contenedores Cloud Run del hub',entre_zonas:'Tráfico entre zonas'},
  src:'Cloud SQL, balanceador, Cloud Run, Cloud Logging, Artifact Registry, Secret Manager, Cloud DNS, tráfico entre zonas y SLA: páginas oficiales de Google Cloud con región São Paulo, leídas el 2026-11-10 (ALTA). Máquinas, discos, IP, NAT, salida de datos y almacenamiento: tabla abierta «google-cloud-pricing-cost-calculator» generada el 2026-11-05 desde la API oficial de facturación de Google (MEDIA; tres de sus cifras coinciden con las páginas oficiales).',
  conf:'ALTA / MEDIA',
  pending:[],
  low:['máquinas, discos, IP, NAT y almacenamiento vienen de una tabla abierta basada en la API oficial, no de la página de Google','el balanceador no suma el cargo por datos procesados (0,012 por GiB: centavos con el volumen actual)','no se descuentan los cupos gratuitos de Cloud Run ni de la cuenta nueva (solo los 50 GiB de registros)']},
 azure:{name:'Azure',full:'Microsoft Azure',region:'Brasil Sur (brazilsouth)',date:'2026-11-10',
  arch:{1:'A · Una máquina virtual (Docker Compose)',2:'B · Máquinas virtuales + PostgreSQL administrado',3:'C · B con alta disponibilidad (2 zonas)',4:'D · Contenedores administrados (Container Apps) + PostgreSQL'},
  tag:{1:'A · Una máquina virtual',2:'B · VM + PostgreSQL',3:'C · Alta disponibilidad',4:'D · Container Apps + PostgreSQL'},
  l:{a:'máquina virtual de Azure',srv:'máquinas virtuales',db:'PostgreSQL administrado',dbm:'PostgreSQL con alta disponibilidad',ctr:'Container Apps',store:'Blob Storage',lb:'Application Gateway',vm:'máquina virtual',logs:'Log Analytics',reg:'Container Registry',zones:'zonas de Azure'},
  parts:{servidores:'Máquina(s) virtual(es) + disco + IP',servidores_ec2:'Máquinas virtuales (serie B)',discos_ebs:'Discos de las máquinas (Standard SSD)',ip_publica_servidores:'IP públicas de las máquinas',base_rds:'Base de datos PostgreSQL Flexible',base_rds_multi_az:'Base de datos PostgreSQL con alta disponibilidad',almacenamiento_rds:'Disco de la base de datos',
   balanceador_alb:'Application Gateway (cargo fijo)',balanceador_lcu:'Application Gateway (por uso)',nat_hora:'NAT Gateway (fijo)',nat_datos:'NAT Gateway (por GB que pasa)',logs_cloudwatch:'Registros (Log Analytics)',ecr:'Registro de imágenes (Container Registry)',secretos:'Key Vault',
   respaldos:'Respaldos en Blob Storage',dns_dominio:'DNS y dominio',contenedores_fargate_clientes:'Contenedores Container Apps de los clientes',contenedores_fargate_hub:'Contenedores Container Apps del hub',entre_zonas:'Tráfico entre zonas'},
  src:'API pública oficial de precios de Azure (prices.azure.com), región Brazil South. Precios de PostgreSQL y Container Apps con una unidad por confirmar (MEDIA).',
  conf:'ALTA',
  pending:[],
  low:['PostgreSQL: el precio está por confirmar si es por servidor o por núcleo (se usó General Purpose D2ds v5, 2 vCore)','Container Apps: se cobra por uso real; aquí se supone siempre activo (cota máxima)']}
};
const CL=()=>CLOUDS[S.ui.cloud]||CLOUDS.aws;
const CLN=id=>CLOUDS[id||S.ui.cloud]||CLOUDS.aws;
// Copia los nombres de las formas A/B/C/D de la nube elegida en ARCH (model.js), que usan muchas pantallas.
function syncCloud(){ Object.assign(ARCH,CL().arch); }
// Confianza de cada tarifa de las nubes que no son AWS (para la tabla de tarifas).
const CLOUD_CONF={
 gcp:{def:'MEDIA',rds_single:'ALTA',rds_multi:'ALTA',rds_gp3_s:'ALTA',rds_gp3_m:'ALTA',alb:'ALTA',lcu:'MEDIA',cw_logs:'ALTA',logs_free:'ALTA',inter_az:'ALTA',ecr:'ALTA',r53_zone:'ALTA',secret:'ALTA',fg_vcpu:'ALTA',fg_gb:'ALTA',dto:'ALTA',hours:'ALTA'},
 azure:{def:'ALTA',rds_single:'MEDIA',rds_multi:'MEDIA',fg_vcpu:'MEDIA',fg_gb:'MEDIA',hours:'ALTA'}};
// Nombre y explicación de las tarifas según la nube (reemplazan a las de AWSROWS en config/report).
const CLOUDROWS={
 gcp:{ls_4:['Opción A, 4 GB: e2-medium + disco 80 GB + IP','Una máquina virtual con todo adentro (1 CPU compartida, 4 GB). No hay paquete «todo incluido» como Lightsail: es la suma de máquina + disco + IP.','USD/mes (suma de las piezas)'],
  ls_8:['Opción A, 8 GB: e2-standard-2 + disco 160 GB + IP','2 vCPU, 8 GB.','USD/mes'],ls_16:['Opción A, 16 GB: e2-standard-4 + disco 320 GB + IP','4 vCPU, 16 GB.','USD/mes'],ls_32:['Opción A, 32 GB: e2-standard-8 + disco 640 GB + IP','8 vCPU, 32 GB.','USD/mes'],
  ls_disk:['Disco extra (balanced)','Más espacio si la máquina se llena de datos.','USD por GB al mes'],
  ec2_t3l:['Compute Engine e2-standard-2 (8 GB)','Máquina donde corren los programas en B y C.','USD por hora (× 730 h al mes)'],
  rds_single:['Cloud SQL PostgreSQL (2 vCPU + 8 GB)','Base de datos administrada (B y D). 2 vCPU × 0,062 + 8 GiB × 0,0105 por hora.','USD por hora'],rds_multi:['Cloud SQL con alta disponibilidad','2 vCPU × 0,1239 + 8 GiB × 0,021 por hora (≈ el doble). El SLA de Google solo cubre instancias con alta disponibilidad.','USD por hora'],
  rds_gp3_s:['Disco SSD de Cloud SQL (una zona)','Espacio donde la base guarda los datos (0,000349315 por GiB-hora).','USD por GB al mes'],rds_gp3_m:['Disco SSD de Cloud SQL (alta disponibilidad)','Con la copia de reserva (0,00069863 por GiB-hora).','USD por GB al mes'],
  ebs_gp3:['Disco persistente balanced','Disco de las máquinas.','USD por GB al mes'],
  fg_vcpu:['Cloud Run: procesador','Contenedor administrado, CPU siempre asignada, Tier 2 (D): 0,0000216 por vCPU-segundo.','USD por vCPU-hora'],fg_gb:['Cloud Run: memoria','0,0000024 por GiB-segundo.','USD por GB-hora'],
  alb:['Balanceador de carga: fijo','Primeras 5 reglas de reenvío. Además cobra 0,012 por GiB procesado (no modelado).','USD por hora'],lcu:['Balanceador: por uso','No se modela el cargo por datos (centavos).','USD por unidad-hora'],
  nat:['Cloud NAT: fijo','Deja que los contenedores privados salgan a Internet (C, D).','USD por hora'],nat_gb:['Cloud NAT: datos que pasan','','USD por GB'],ipv4:['IP pública en uso','','USD por hora cada una'],
  dto:['Salida a Internet (0–1 TB)','De 1 a 10 TB: 0,18; más de 10 TB: 0,15. No se verificó un cupo gratis mensual para São Paulo.','USD por GB'],inter_az:['Tráfico entre zonas','Entre zonas de la misma región.','USD por GB'],
  s3:['Cloud Storage Standard (regional)','Guarda los respaldos fuera del servidor.','USD por GB al mes'],ecr:['Artifact Registry','Guarda las «cajas» Docker (el primer 0,5 GB es gratis, no descontado).','USD por GB al mes'],cw_logs:['Cloud Logging','Registros de funcionamiento.','USD por GB recibido'],logs_free:['GB de registros gratis al mes','Los primeros 50 GiB por proyecto.','GB'],
  r53_zone:['Cloud DNS: zona administrada','Primeras 25 zonas (0,000273973 por hora). Consultas: 0,40 por millón.','USD por zona al mes'],secret:['Secret Manager','Por versión activa de un secreto (las primeras 6 son gratis, no descontadas).','USD por clave al mes']},
 azure:{ls_4:['Opción A, 4 GB: VM B2s + disco 128 GiB + IP','Una máquina virtual con todo adentro (2 vCPU, 4 GB). No hay paquete «todo incluido» como Lightsail: es la suma de máquina + disco + IP.','USD/mes (suma de las piezas)'],
  ls_8:['Opción A, 8 GB: VM B2ms + disco 256 GiB + IP','2 vCPU, 8 GB.','USD/mes'],ls_16:['Opción A, 16 GB: VM B4ms + disco 512 GiB + IP','4 vCPU, 16 GB.','USD/mes'],ls_32:['Opción A, 32 GB: VM B8ms + disco 1 TiB + IP','8 vCPU, 32 GB.','USD/mes'],
  ls_disk:['Disco extra (Standard SSD)','Más espacio si la máquina se llena. Los discos de Azure vienen en tamaños fijos.','USD por GB al mes'],
  ec2_t3l:['VM B2ms (8 GB)','Máquina donde corren los programas en B y C.','USD por hora (× 730 h al mes)'],
  rds_single:['PostgreSQL Flexible: General Purpose D2ds v5 (2 vCore)','Base de datos administrada (B y D). Unidad del precio por confirmar.','USD por hora'],rds_multi:['PostgreSQL con alta disponibilidad','El servidor de reserva se cobra a la misma tarifa (documento oficial de Microsoft).','USD por hora'],
  rds_gp3_s:['Disco de PostgreSQL (una zona)','','USD por GB al mes'],rds_gp3_m:['Disco de PostgreSQL (alta disponibilidad)','Reserva cobrada igual.','USD por GB al mes'],
  ebs_gp3:['Disco Standard SSD','Disco de las máquinas.','USD por GB al mes'],
  fg_vcpu:['Container Apps: procesador (activo)','Contenedor administrado (D). Tarifa «activo»: cota máxima (inactivo es 0,0108).','USD por vCPU-hora'],fg_gb:['Container Apps: memoria','','USD por GB-hora'],
  alb:['Application Gateway Standard v2: fijo','Equivale al ALB (enruta por dominio). El balanceador simple (L4) cuesta 0,025/h pero no enruta por dominio.','USD por hora'],lcu:['Application Gateway: unidad de capacidad','','USD por unidad-hora'],
  nat:['NAT Gateway: fijo','Deja que los contenedores privados salgan a Internet (C, D).','USD por hora'],nat_gb:['NAT Gateway: datos que pasan','','USD por GB'],ipv4:['IP pública estática','','USD por hora cada una'],
  dto:['Salida a Internet (ruta Microsoft, después de los primeros 100 GB)','Con «Routing Preference: Internet» baja a 0,12.','USD por GB'],dto_free:['GB gratis de salida al mes','Primeros 100 GB.','GB'],inter_az:['Tráfico entre zonas','Cobra 0,01 por GB de salida y 0,01 de entrada.','USD por GB por sentido'],
  s3:['Blob Storage Hot LRS','Guarda los respaldos fuera del servidor.','USD por GB al mes'],ecr:['Container Registry (por GB)','Azure cobra una cuota diaria fija (ver abajo).','USD por GB al mes'],ecr_fixed:['Container Registry Standard: cuota fija','0,6666 al día.','USD al mes'],
  cw_logs:['Log Analytics (Analytics Logs)','Los primeros 5 GB al mes son gratis (no se descuentan). «Basic Logs» cuesta 1,00 y «Auxiliary» 0,10 por GB.','USD por GB recibido'],
  r53_zone:['Azure DNS: zona pública','Primeras 25 zonas. Consultas aparte.','USD por zona al mes'],secret:['Key Vault Standard','No cobra por guardar un secreto: solo 0,03 por cada 10 mil operaciones (no modelado).','USD por clave al mes'],logs_free:['GB de registros gratis al mes','Los primeros 5 GB.','GB']}};

// Aviso con lo que falta verificar o es de menor confianza en la nube elegida (vacío para AWS).
function cloudNote(id){ id=id||S.ui.cloud; const c=CLOUDS[id]; if(!c||id==='aws') return '';
 return `<div class="box ${c.pending.length?'bad':'info'}"><b>${c.name}: datos con menos certeza que AWS.</b> Tarifas consultadas el ${c.date} (${c.region}). ${c.pending.length?`<br><b>PENDIENTE (hoy cuenta como US$ 0, <u>no es gratis</u>; el total es un mínimo):</b> ${c.pending.join(', ')}.`:''}${c.low.length?`<br><b>Menor confianza:</b> ${c.low.join('; ')}.`:''}<br><span class="small">Fuente: ${c.src} Detalle en el documento 13-comparativa-nubes-aws-gcp-azure.md.</span></div>`; }
// Etiqueta corta de la nube elegida para encabezados («Servidores y AWS», «Servidores y Azure»…).
const CLS=()=>CL().name;
