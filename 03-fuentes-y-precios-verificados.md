> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 03 — Fuentes y precios verificados (consulta: 2026-11-06)

Cada tarifa se leyó directamente de la fuente oficial el 2026-11-06. Los archivos de precios de AWS son las listas públicas oficiales (`pricing.us-east-1.amazonaws.com`, región `sa-east-1` São Paulo) con su fecha de publicación. Las páginas de TomTom y HERE son aplicaciones web: se renderizaron con un navegador y se capturaron los tramos; para TomTom se **confirmó cada tarifa con el estimador de costos de la propia página** (1 M de peticiones).

## 1. Tipo de cambio e impuestos
| Dato | Valor | Fuente | Tipo | Confianza |
|---|---:|---|---|---|
| TRM Colombia 2026-11-06 | 3,228.26 COP/USD | https://www.datos.gov.co/resource/32sa-8pi3.json (Superfinanciera) | Oficial | ALTA |
| EUR/USD 2026-11-06 | 1.1165 | https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A | Oficial (BCE) | ALTA |
| IVA Colombia | 19 % | Tarifa general; **su aplicación a servicios del exterior (AWS, TomTom, Meta) depende de reglas DIAN: validar con contador** | Supuesto | BAJA |

## 2. Tráfico y mapas
| Proveedor | Servicio | Unidad | Gratis | Precio | Moneda | Fuente | Confianza / nota |
|---|---|---|---|---|---|---|---|
| TomTom | Traffic Incidents API Details | 1.000 req/mes | 2.500/mes | 2.5K–1 M: 2.00; 1–5 M: 1.60; 5–10 M: 1.30 | EUR | https://docs.tomtom.com/pricing | ALTA (estimador: 1 M req = EUR 1,995.00) |
| TomTom | Routing API (Calculate Route) | 1.000 req/mes | 20.000/mes | 20K–1 M: 1.00; 1–5 M: 0.80; 5–10 M: 0.65 | EUR | https://docs.tomtom.com/pricing | ALTA (estimador: 1 M = EUR 980.00) |
| TomTom | Geocoding / Reverse Geocoding | 1.000 req/mes | 20.000/mes | 1.00 / 0.80 / 0.65 | EUR | https://docs.tomtom.com/pricing | ALTA (estimador 1 M Geocoding = EUR 980.00) |
| TomTom | Map Display Vector Tiles | 1.000 req/mes | 200.000/mes | 200K–10 M: 0.10; 10–50 M: 0.08; 50–100 M: 0.07 | EUR | https://docs.tomtom.com/pricing | ALTA para el 1.er tramo (estimador: 1 M = EUR 80.00); MEDIA para los demás |
| TomTom | Matrix Routing | req/mes | 2.500/mes | tramos no capturados | EUR | https://docs.tomtom.com/pricing | No usado por XiGOS |
| HERE | Real-Time Traffic (Base Plan) | 1.000 transacciones/mes | 5.000 | 5,001–200 K: 2.92; 200 K–1 M: 2.33; 1–5 M: 2.05; 5–20 M: 0.88; >20 M: 0.58 | USD | https://www.here.com/get-started/pricing/supplemental-pricing («Updated: April 1, 2026») | ALTA; **la página se rotula «Confidential Information» bajo los términos de HERE Platform** |
| HERE | Routing (car/bicicleta/peatón) | 1.000 transacciones/mes | 30.000 | 30,001–5 M: 0.88; 5–10 M: 0.70 … | USD | misma | ALTA |
| HERE | Geocode & Reverse Geocode | 1.000 transacciones/mes | 30.000 | 0.88 / 0.70 … («Permanent Geocoding» no incluido) | USD | misma | ALTA |
| HERE | Restricción del Base Plan | — | — | **Excluye «Asset Management» (ubicar/rastrear/mostrar en mapa, calcular rutas, alertas sobre un activo) y «Optimization»** | — | misma | ALTA — riesgo de licencia para XiGOS (ver doc 05) |
| HERE | Aumento 1-abr-2026 | — | — | +6 % para contratos nuevos/renovados (ya reflejado en la tabla vigente) | — | resultado de búsqueda; no confirmado en página | MEDIA |

**Discrepancia detectada (importante):** el hub nació con topes basados en «TomTom 2.500/día» (CLAUDE.md §13, «sin verificar»). La página vigente de TomTom muestra **2.5K por MES** (no por día) y €2.00/1.000, y anuncia precios nuevos; fuentes secundarias anteriores citaban 2.500 diarias y US$0.75/1.000. Se usa la página oficial vigente. El tope diario por omisión del hub para TomTom (2.000/día) y HERE (150/día) es **preventivo y no corresponde a las cuotas reales** (150/día de HERE = solo ~3 celdas cada 30 min).

## 3. Clima y rutas gratuitas
| Proveedor | Servicio | Límite gratuito | Condiciones | Fuente | Confianza |
|---|---|---|---|---|---|
| Open-Meteo | Pronóstico | 10.000/día, 300.000/mes | **Solo uso NO comercial**; planes comerciales Standard (1 M/mes)/Professional/Enterprise **sin precio mostrado** → PENDIENTE: REQUIERE COTIZACIÓN | https://open-meteo.com/en/pricing | ALTA (límites) / PENDIENTE (precio) |
| OpenWeatherMap | Current/Forecast | 60 llamadas/min, 1.000.000/mes | La página no declara los términos comerciales del plan gratis; planes: Startup GBP 30, Developer GBP 140, Professional GBP 370 /mes | https://openweathermap.org/price | MEDIA |
| OpenRouteService (HeiGIT) | Directions V2 | 2.000/día, 40/min (Standard, gratis); Collaborative 10.000/día solo ONG/académico | Sin plan de pago público; instalación propia ilimitada | https://account.heigit.org/info/plans | ALTA (límites); términos comerciales NO verificados |
| OpenStreetMap | Teselas `tile.openstreetmap.org` | Sin cuota numérica | Uso interactivo permitido con atribución, User-Agent y caché; **prohibido uso intensivo, descarga masiva, prefetch; acceso puede retirarse sin aviso; sin SLA** | https://operations.osmfoundation.org/policies/tiles/ | ALTA |

## 4. WhatsApp (Meta) — Colombia
Fuente: hojas oficiales «Tarifas en USD/COP» y «Niveles de volumen» enlazadas desde https://developers.facebook.com/docs/whatsapp/pricing/ (hoja titulada «Cost per message … effective October 1, 2026»).
| Categoría | USD por mensaje entregado | COP por mensaje (tarifario COP de Meta) | Nota |
|---|---:|---:|---|
| Marketing | 0.0125 | 46.0227 | |
| Utilidad (plantilla) | 0.0008 | 2.9455 | Tramos por volumen: lista hasta 100.000 msg/mes por mercado |
| Autenticación | 0.0008 | 2.9455 | |
| Servicio (dentro de la ventana de 24 h) | 0.0008 | 2.9455 | **1.000 gratis/mes por número; se cobra desde 2026-10-01** |
| Mensajes enviados por el usuario | 0 | 0 | No se cobran |
Notas: cobro por mensaje **entregado** desde 2025-07-01; Meta solo cambia precios el 1.er día de un trimestre; la moneda de facturación se fija al crear la cuenta. El tarifario COP de Meta implica **3,682 COP/USD**, frente a la TRM de 3,228.26: pagar en COP cuesta **~14% más** que USD convertido a TRM. Precio del BSP intermediario: **PENDIENTE (no público).**

## 5. AWS São Paulo (`sa-east-1`) — listas oficiales de precios
| Servicio | Unidad | USD | Fecha de publicación del archivo | Fuente |
|---|---|---:|---|---|
| Lightsail Linux 4 GB / 2 vCPU / 80 GB (con IPv4) | mes (730 h x 0.0323) | 23.54 | 2026-09-15 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonLightsail/current/index.json |
| Lightsail 8 GB / 2 vCPU / 160 GB | mes (0.0591/h) | 43.16 | idem | idem |
| Lightsail 16 GB / 4 vCPU / 320 GB | mes (0.1129/h) | 82.42 | idem | idem |
| Lightsail 32 GB / 8 vCPU / 640 GB | mes (0.2204/h) | 160.91 | idem | idem |
| Lightsail disco adicional / snapshot | GB-mes | 0.10 / 0.05 | idem | idem |
| Lightsail BD administrada 2 GB / 4 GB / 8 GB | mes | 29.43 / 58.87 / 112.84 | idem | idem |
| EC2 t3.large (2 vCPU, 8 GiB) Linux | hora | 0.1344 (= 98.11/mes) | 2026-11-05 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/sa-east-1/index.json |
| EC2 t3.medium / t4g.large / m6i.large | hora | 0.0672 / 0.1072 / 0.153 | idem | idem |
| EBS gp3 | GB-mes | 0.152 | idem | idem |
| ALB / NAT Gateway | hora (sin LCU ni datos) | 0.034 / 0.093 | idem | idem |
| Transferencia a Internet (primer GB gratis; 1–10 TB) | GB | 0.25 | idem | idem |
| RDS PostgreSQL db.t4g.medium / large Single-AZ | hora | 0.137 / 0.275 | 2026-10-29 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonRDS/current/sa-east-1/index.json |
| RDS db.t4g.large Multi-AZ | hora | 0.55 | idem | idem |
| RDS almacenamiento gp3 Single-AZ / Multi-AZ | GB-mes | 0.219 / 0.438 | idem | idem |
| S3 Standard (primeros 50 TB) | GB-mes | 0.0405 | 2026-11-04 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonS3/current/sa-east-1/index.json |
| CloudWatch Logs ingestión | GB | 0.9 | 2026-11-04 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonCloudWatch/current/sa-east-1/index.json |
| SES Essentials | correo | 0.00016 | 2026-11-04 | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSES/current/sa-east-1/index.json |
Confianza ALTA (lista oficial). **No incluidos por no haberse consultado:** Route 53, LCU del ALB, soporte AWS, Savings Plans/instancias reservadas, descuentos del plan gratuito de AWS (CLAUDE.md anota: 6 meses o hasta agotar créditos; validado el 2026-10-30, no re-verificado hoy).

## 6. GPS, SIM, plataforma GPS
| Concepto | Precio | Fuente | Confianza |
|---|---|---|---|
| Teltonika FMB920 (referencia) | ~US$ 69–73 en revendedores (GPSWOX US$ 69; Europa €67.83) | https://gpswox.com/en/gps-trackers-shop/all/vehicle-gps-tracker-teltonika-fmb920-68 | BAJA (no es tarifa oficial) |
| SIM/plan M2M en Colombia | **PRECIO NO PÚBLICO — REQUIERE COTIZACIÓN** (Claro/Movistar/Tigo Empresas) | Sin tarifas públicas halladas | PENDIENTE |
| Plataforma Eje Satelital / uso de su API | **PRECIO NO PÚBLICO — REQUIERE COTIZACIÓN** | Sin tarifas públicas halladas | PENDIENTE |
| Suscripciones GPS en talleres de Bogotá (orientativo) | COP 20.000–60.000/mes | blog de un taller (c3carecarcenter.com) | BAJA, no aplicable a Eje |
| Microsoft 365 / Exchange (buzón SMTP) | no consultado | — | PENDIENTE |
| Dominio `.com`/`.co`, Cloudflare | no consultado (Cloudflare Tunnel rápido: gratis) | — | PENDIENTE |
