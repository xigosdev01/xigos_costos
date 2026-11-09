> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 05 — Comparativa TomTom vs HERE

## 1. Qué usa hoy XiGOS de cada uno
- **TomTom:** `Traffic Incident Details` v5 (conector `packages/connectors/src/tomtom-traffic.connector.ts`), **verificado contra la API real** con la llave del usuario (837 incidentes reales). La página de TomTom marca varias APIs como de generación anterior y recomienda **Orbis**; v5 sigue facturable hasta su retiro (fecha no publicada): riesgo de migración futura.
- **HERE:** `Traffic API v7 /incidents` (`here-traffic.connector.ts`). Endpoint y parámetro de llave confirmados con `curl`; **mapeo de respuesta NO verificado con una llave válida**.
- **No son alternativas excluyentes en el código actual:** el hub consulta **ambos** por cada celda para **confirmación cruzada** (un incidente confirmado por dos proveedores se fusiona en una novedad). Por eso el costo actual suma ambos. Si se decide quedarse con uno, el modelo permite elegir (`prov_sel`).
- Ninguno se usa para mapas, geocodificación ni rutas (esos usan OSM, Nominatim y ORS); sí serían las alternativas de pago a esos servicios.

## 2. Costo con escenarios idénticos (una consulta cada 30 min por celda de 0.25°)
| Celdas activas | Llamadas/mes por proveedor | HERE USD | TomTom USD | Ambos USD | Más barato |
|---:|---:|---:|---:|---:|---|
| 1 | 1,440 | 0.00 | 0.00 | 0.00 | Igual |
| 3 | 4,320 | 0.00 | 4.06 | 4.06 | HERE |
| 6 | 8,640 | 10.63 | 13.71 | 24.34 | HERE |
| 12 | 17,280 | 35.86 | 33.00 | 68.86 | TomTom |
| 30 | 43,200 | 111.54 | 90.88 | 202.43 | TomTom |
| 100 | 144,000 | 405.88 | 315.97 | 721.85 | TomTom |
| 250 | 360,000 | 942.20 | 798.30 | 1,740.50 | TomTom |
| 450 | 648,000 | 1,613.24 | 1,441.40 | 3,054.64 | TomTom |

- Hasta ~6 celdas HERE resulta algo más barato (gratis hasta 5,000/mes); desde ~12 celdas **TomTom es más barato** (~11 % a 450 celdas) y la diferencia crece.
- **Confirmación cruzada cuesta:** a 450 celdas, HERE añade US$ 1,613.24/mes sobre US$ 1,441.40 de TomTom (el segundo proveedor **duplica** el gasto de datos de tráfico).
- Reducir el intervalo a 60 min divide las llamadas por 2; con 450 celdas: HERE US$ 858.32 y TomTom US$ 717.91.

## 3. Tabla comparativa
| Característica | TomTom | HERE |
|---|---|---|
| Mapas (teselas) | Map Display vector: 200 K gratis/mes, luego EUR 0.10/1,000 (estimador: 1 M = EUR 80) | Map Rendering: no capturado en esta consulta |
| Rutas | Routing: 20 K gratis, EUR 1.00/1,000 (1 M = EUR 980 ≈ US$ 1,094.17) | Routing car: 30 K gratis, US$ 0.88/1,000 (1 M = US$ 853.60) |
| Tráfico (incidentes) | 2.5 K gratis, EUR 2.00/1,000 | 5 K gratis, US$ 2.92/1,000 (hasta 200 K) |
| Geocodificación | 20 K gratis, EUR 1.00/1,000 | 30 K gratis, US$ 0.88/1,000 |
| Matriz de distancias | 2.5 K gratis; tramos no capturados | cobro por origen x destino; tramos no capturados |
| Nivel gratuito | Mensual por API, sin tarjeta; duración «¿expira?»: la FAQ de la página no mostró respuesta | Base Plan: 5 K tráfico / 30 K rutas y geocodificación |
| Costo uso bajo (3–6 celdas) | US$ 4.06 – 13.71/mes | US$ 0.00 – 10.63/mes |
| Costo uso medio (100 celdas) | US$ 315.97/mes | US$ 405.88/mes |
| Costo uso alto (450 celdas) | US$ 1,441.40/mes | US$ 1,613.24/mes |
| Restricciones | Términos de almacenamiento/caché **no verificados** | **Base Plan excluye «Asset Management» y «Optimization»**: rastrear/mostrar activos en mapa, calcular rutas y alertas sobre un activo |
| Condiciones comerciales | Plan «Pay As You Grow»; contacto comercial para contratos | Precios marcados «Confidential Information» (términos HERE Platform / NDA); +6 % desde 2026-04-01 |

## 4. Riesgo de licencia (decisivo)
La página de precios del Base Plan de HERE **excluye** como casos de uso: *«Asset Management … locating, tracking and/or displaying on a map; provision of route calculations; … alerts that inform drivers of potential hazards on the road»*. XiGOS ubica vehículos de una flota, calcula rutas y avisa de peligros sobre su ruta. Aunque la posición GPS no proviene de HERE, el uso del servicio de tráfico para alertar sobre rutas de activos **podría quedar fuera del Base Plan** y exigir contrato comercial (precio PENDIENTE). Esta misma consideración está en las «preguntas por escrito a HERE/TomTom» que CLAUDE.md lista sin enviar. **No se puede afirmar cumplimiento sin respuesta escrita de HERE**; los términos de TomTom sobre caché/almacenamiento/servicio a terceros tampoco se verificaron.

## 5. Recomendación
1. **Mantener la integración actual (no migrar)** y la abstracción del hub: cambiar o añadir un proveedor es bajo costo (interfaz `Connector` + registro de proveedores). No hay motivo económico para migrar de repente.
2. **Proveedor principal: TomTom** (más barato desde ~12 celdas, verificado con datos reales, sin la exclusión de «activos» conocida). HERE como segunda fuente **solo si el valor de la confirmación cruzada justifica ~1.1x el gasto**, o consultado a menor frecuencia (60 min) / solo en corredores críticos.
3. Antes de producción: respuesta escrita de HERE y TomTom sobre uso (rastreo de activos, retención, múltiples clientes). Sin ella, el costo de HERE puede cambiar de escalera pública a contrato.
4. No migrar el cálculo de rutas a HERE: su Base Plan excluye cálculo de rutas para activos; ORS (gratis) con TomTom Routing como respaldo es la ruta de menor riesgo.
