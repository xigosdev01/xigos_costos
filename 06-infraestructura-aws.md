> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 06 — Infraestructura AWS (São Paulo, `sa-east-1`)

Región elegida: **São Paulo** (menor latencia hacia Colombia entre las regiones AWS con precio oficial verificado). Precios de lista bajo demanda (doc 03); sin descuentos por compromiso ni créditos. Todas las cifras de capacidad (RAM por instancia, bases por RDS) son **supuestos no medidos** hasta construir las imágenes y medir contenedores reales.

## 1. Qué necesita la arquitectura actual
`hub-api`, `hub-collector` (UNO solo), `hub-web`, PostgreSQL+PostGIS del hub, y por cliente `api`, `worker`, `web` y su base. `api`/`worker` usan Chromium para PDF (~500 MB en picos). Tráfico saliente bajo (JSON y PDF de 90–200 KB; las teselas van de OSM al navegador). Escritura constante de posiciones y observaciones (miles de filas/día).
**Imprescindible:** cómputo, base de datos PostGIS, disco, respaldos fuera del servidor, HTTPS (Caddy o ALB). **Opcional:** balanceador, CloudWatch, NAT, Multi-AZ.

## 2. Arquitecturas evaluadas
| | A — Económica | B — SaaS escalable | C — Alta disponibilidad |
|---|---|---|---|
| Servicios AWS | Lightsail (instancia todo-en-uno con Docker Compose, BD en contenedor) | EC2 `t3.large` (app) + **RDS PostgreSQL Single-AZ** compartido + ALB + EBS gp3 + CloudWatch + S3 respaldos | Igual a B **x2 AZ**, RDS **Multi-AZ**, ALB, NAT Gateway, CloudWatch, S3 |
| Tipo / CPU / RAM | 4 GB: 2 vCPU/80 GB → 32 GB: 8 vCPU/640 GB (escalones) | t3.large: 2 vCPU / 8 GiB; RDS db.t4g.large 2 vCPU / 8 GiB | ídem x2 |
| Base de datos | Contenedor por instancia (incluida) | 1 RDS por cada 25 bases (supuesto) | RDS Multi-AZ |
| Transferencia | Incluida en el plan (4 TB en 4 GB) | US$ 0.25/GB (primer GB gratis) | ídem |
| Respaldos | `backup.mjs` + copia a S3 (US$ 0.0405/GB) | ídem (+ respaldos automáticos de RDS) | ídem |
| Seguridad | Firewall de Lightsail (22/80/443) | Security groups, subredes | + subredes privadas con NAT |
| Fallo de un servidor | Caída hasta restaurar (RTO horas) | Caída parcial de las instancias de ese servidor | Continúa en la otra AZ |
| Cuándo | Primeros 1–10 clientes (**previsión del usuario: 4 en 12 meses**) | 25+ clientes o cuando se exija disponibilidad | Contrato con SLA |

## 3. Costo mensual y anual (perfil Medio, 20 dispositivos/cliente)
| Clientes | Servidores A | A USD/mes | A USD/año | Servidores app B / RDS | B USD/mes | B USD/año | C USD/mes | C USD/año |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 23.80 | 286 | 1 / 1 | 342.64 | 4,112 | 727.84 | 8,734 |
| 5 | 1 | 83.73 | 1,005 | 1 / 1 | 346.71 | 4,160 | 733.93 | 8,807 |
| 10 | 1 | 163.53 | 1,962 | 2 / 1 | 458.97 | 5,508 | 955.88 | 11,471 |
| 25 | 2 | 328.36 | 3,940 | 4 / 2 | 898.20 | 10,778 | 1,826.67 | 21,920 |
| 50 | 3 | 495.82 | 5,950 | 8 / 3 | 1,561.94 | 18,743 | 3,141.37 | 37,696 |
| 100 | 5 | 830.72 | 9,969 | 15 / 5 | 2,782.27 | 33,387 | 5,556.43 | 66,677 |
| 250 | 13 | 2,157.26 | 25,887 | 36 / 11 | 6,443.24 | 77,319 | 12,801.61 | 153,619 |
| 500 | 25 | 4,153.61 | 49,843 | 71 / 21 | 12,544.85 | 150,538 | 24,876.91 | 298,523 |
| 1000 | 49 | 8,146.32 | 97,756 | 141 / 41 | 24,748.08 | 296,977 | 49,027.51 | 588,330 |

Desglose de B a 100 clientes: EC2 1,471.68, EBS 68.40, RDS 1,003.75, almacenamiento RDS 72.45, ALB 24.82, transferencia 25.00, CloudWatch 90.00, respaldos 26.17.
Desglose de C a 100 clientes: EC2 2,943.36, RDS Multi-AZ 2,007.50, almacenamiento 144.89, NAT 67.89, ALB 24.82, transferencia 25.00, CloudWatch 180.00.

## 4. Lecturas
- **A es mucho más barata que B y C:** B cuesta 14 veces A con 1 cliente (RDS + EC2 + ALB fijos) y ~3.3 veces desde 10 clientes; C cuesta ~2.0 veces B. Motivo: el precio por GB de RAM de Lightsail (≈ US$ 5–6/GB-mes) es la mitad que EC2 (≈ US$ 12/GB) y la BD no se paga aparte. Contrapartida: sin alta disponibilidad, sin gestión de la BD, ~20 clientes de perfil medio por servidor de 32 GB.
- **Transferencia de datos:** AWS cobra US$ 0.25/GB de salida en São Paulo; Lightsail incluye terabytes. Con ~1 GB/cliente/mes no pesa; con muchos PDF o teselas servidas por nosotros sí (a 1,000 clientes = US$ 250/mes en B/C).
- **Costos que crecen por escalones:** servidores (cada 25.6 GB de RAM útiles), RDS (cada 25 bases). **Lineales:** soporte, correo. **Saturan:** datos de tráfico (celdas compartidas).
- **Infraestructura mínima hoy:** 1 Lightsail de 4 GB (US$ 23.54/mes ≈ COP 75,993) aloja el hub y 2–3 instancias pequeñas según la guía de despliegue. **Recomendada para empezar:** Arquitectura A en 8 GB (US$ 43.16) cuando haya 2+ clientes reales; **para escalar:** pasar a B cuando se necesite RDS administrado/alta disponibilidad o más de ~20 instancias, y entonces evaluar multiempresa (doc 09).
- **Referencia sin AWS:** el plan actual del usuario es un servidor Windows propio; su costo (equipo, electricidad, conectividad) **no se proporcionó y no se cuantifica**. Las actualizaciones por anillos con Docker no aplican a Windows sin Docker (doc DEPLOYMENT §2).
- **No verificado:** que las imágenes Docker construyan y que la RAM por instancia sea la supuesta; ambos mueven el costo por cliente linealmente (si la instancia usa 0.8 GB en lugar de 1.25 GB, A baja ~36 %).
