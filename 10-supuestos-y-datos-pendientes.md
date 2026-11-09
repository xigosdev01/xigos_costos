> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 10 — Supuestos y datos pendientes

## 1. Lo confirmado (fuente oficial leída hoy)
TomTom (Incidentes, Routing, Geocoding, tiles: tramos y gratuitos), HERE (Traffic, Routing, Geocoding), Meta WhatsApp Colombia (4 categorías, USD y COP), AWS São Paulo (Lightsail, EC2, RDS, EBS, S3, ALB, NAT, CloudWatch, SES, transferencia), TRM y EUR/USD, límites gratuitos de Open-Meteo, OpenWeatherMap, ORS, política de OSM.

## 2. Lo NO verificado (no se inventó valor)
| Dato faltante | Efecto | Cómo obtenerlo |
|---|---|---|
| Plan y precio de la plataforma/API de **Eje Satelital** | Costo del GPS para el cliente o para Fortox si lo revende | Cotización a Eje Satelital (incluir límite de 1 consulta/min y si hay plan de integración) |
| **SIM/plan de datos M2M** y **hardware** por dispositivo en Colombia | Costo por vehículo del cliente | Cotización a Claro/Movistar/Tigo Empresas e integradores |
| **Términos de HERE y TomTom** para rastreo de activos, caché/almacenamiento y servicio a varios clientes | Puede mover HERE de escalera pública a contrato | Preguntas por escrito (listadas en CLAUDE.md, sin enviar) |
| **Plan comercial de Open-Meteo** y términos comerciales de **ORS** y del plan gratuito de **OpenWeatherMap** | El clima actual solo es «gratis» sin licencia comercial resuelta | Contacto con cada proveedor |
| **BSP de WhatsApp** (mensualidad/sobreprecio) | Costo de mensajería | Cotizar 2–3 BSP oficiales de Meta |
| **Microsoft 365** (buzón SMTP), **dominio**, certificados, Route 53, LCU del ALB, soporte AWS | Costos fijos pequeños | Consultar precios |
| Programa «Savings Plans» y créditos del plan gratuito de AWS | Costo AWS real el primer año | Calculadora de AWS con la cuenta real |
| Tratamiento de **IVA/retenciones/GMF** de servicios del exterior | Costo final en COP | Contador |
| Nueva tarifa de TomTom «desde 1-jul-2026» | Una fuente secundaria menciona bloqueo de precios hasta 2028 al registrarse antes del 31-dic-2026; **no confirmado en la página** | Confirmar con TomTom antes de contratar |

## 3. Supuestos del autor (editables en la hoja `Supuestos` del Excel)
| Supuesto | Valor | Por qué importa |
|---|---|---|
| RAM por instancia / hub | 1.25 GB / 1.5 GB (A); 0.9 / 1.0 (B) | **Principal impulsor del costo de infraestructura**; no se midió (no hay imágenes Docker construidas) |
| Celdas únicas posibles en Colombia (Ncap) | 450 | Determina el techo de gasto en tráfico (US$ 3,054.64/mes) |
| Celdas por cliente | 3 / 6 / 12 | Define cuánto paga cada cliente nuevo en datos |
| Dispositivos por cliente | 5 / 20 / 60 | No hay dato real; XiGOS solo tiene un cliente (Coltabaco) y GPS reales sin movimiento verificado |
| Bytes por posición | 250 B | Sin medición: el acceso a la BD de la instancia fue denegado a este estudio |
| Tarifa de soporte/DevOps | US$ 20/h; 20 h fijas + 0.1 h/cliente; 1–4 h de soporte | Sin información salarial: **pesa más que la tecnología a escala** |
| Usuarios, correos, rutas y teselas por cliente | ver doc 08 | Sin datos de uso |
| Intervalos | tráfico 30 min, clima 60 min | Valores actuales del hub (editables) |
| Capacidad RDS | 25 bases por `db.t4g.large` | No probado |

## 4. Qué extraer de la aplicación para reemplazar supuestos por datos reales
1. **Tamaño real por tabla** (BD de Coltabaco): `SELECT relname, n_live_tup, pg_total_relation_size(oid) FROM pg_stat_user_tables` → bytes por fila de `device_positions`, `raw_events`, informes.
2. **Consumo real de contenedores**: `docker stats` (api con Chromium generando PDF, worker, BD) de una instancia y del hub → RAM por cliente.
3. **Consumo por proveedor**: panel «Hub de datos»/`api_usage_daily`: llamadas por día por proveedor y celda; llamadas reales de `/v1/routes/alternate` y aciertos de caché.
4. **Dispositivos reales**: cuántos por cliente, frecuencia real de reporte de Eje Satelital con equipo en movimiento (hoy sin verificar), horas por día.
5. **Correos y avisos por cliente** (`report_deliveries`, `trip_events`).
6. **Tráfico de red** de la instancia (bytes de salida/mes).
7. **Horas reales de soporte** por cliente.

## 5. Lo que cambia el resultado si resulta distinto
| Si… | Entonces |
|---|---|
| La instancia usa 0.8 GB (no 1.25) | Infraestructura A baja ~36 % |
| HERE exige contrato por «Asset Management» | El costo de HERE deja de ser el de la escalera; considerar TomTom solo |
| Open-Meteo/ORS/OWM requieren plan comercial | Aparece costo de clima/rutas hoy en 0 |
| Los dispositivos reportan cada 10–30 s y se quisiera guardar todo | Habría que cambiar de proveedor GPS o a push/webhook; posiciones x2–x6 (almacenamiento sigue barato) |
| El cliente exige alta disponibilidad | Infra pasa a B/C (3–6x) |
