# CLAUDE.md — Contexto del proyecto `xigos_costos`

## Qué es
Estudio de costos de **XiGOS** (plataforma de monitoreo de flotas/rutas de Fortox: cada cliente tiene su propia *instancia* y un *hub* central compartido consulta proveedores de tráfico, clima y rutas) más una **calculadora web** para simular cuánto cuesta operarla según número de clientes, tamaño de uso y forma de alojar en AWS. Idioma: **español (Colombia)**; texto para personas no técnicas (evitar tecnicismos y explicar siglas).

- Estudio generado y precios consultados el **2026-11-06**. TRM 3,228.26 COP/USD (datos.gov.co); EUR/USD 1.1165 (BCE). USD sin IVA.
- Región AWS de referencia: **São Paulo (`sa-east-1`)**. Precios de lista bajo demanda, sin descuentos.
- Previsión del usuario: **~4 clientes en 12 meses**. Hoy todo corre en un equipo local (sin factura de infraestructura).
- Convención de confianza: ALTA (tarifa oficial leída), MEDIA (oficial con supuesto), BAJA (revendedor/estimación), PENDIENTE (requiere cotización).

## Archivos
| Archivo | Contenido |
|---|---|
| `index.html` + `styles.css` + `app.js` | **Calculadora** (HTML, estilos y lógica separados; sin librerías ni build; se publica tal cual en GitHub Pages). Es el entregable principal. |
| `02-inventario-servicios-y-licencias.md` | Arquitectura real (del código) y servicios que generan costo |
| `03-fuentes-y-precios-verificados.md` | URL y fecha de cada tarifa (TRM, tráfico, clima, WhatsApp, AWS, GPS) |
| `05-comparativa-tomtom-here.md` | TomTom vs HERE; riesgo de licencia de HERE (excluye rastreo de activos) |
| `08-proyecciones-y-rentabilidad.md` | Proyecciones por perfil y precio mínimo por cliente |
| `09-optimizacion-de-costos.md` | Plan de ahorro (multiempresa, clústeres de BD compartidos, etc.) |
| `10-supuestos-y-datos-pendientes.md` | Lo verificado, lo no verificado y supuestos del autor |
| `11-modelo-financiero.xlsx` | Modelo Excel editable con fórmulas |
| `12-resumen-auditoria.pdf` | Resumen en PDF |

Los `.md` son el estudio original (cifras fijas al 2026-11-06). La calculadora es la versión viva; si se cambia un supuesto allí, los `.md` no se actualizan solos.

## Modelo de costos (resumen)
- El costo **no crece con los dispositivos GPS** (≈ US$ 0.0014/vehículo-mes por guardar posiciones). El GPS (equipo, SIM, plataforma Eje Satelital) lo paga el cliente y no tiene precio público.
- Crece con: **(a) cada instancia de cliente** (contenedores api/worker/web/db: ≈ 1.25 GB RAM reservada), **(b) celdas del mapa** que el hub consulta a TomTom/HERE (compartidas entre clientes, saturan en `ncap`=450), **(c) personal** (analista de inteligencia opcional; soporte/DevOps desactivado por defecto).
- **Hub**: uno solo para todos (hub-api, hub-collector —solo puede haber UNO—, hub-web, proxy, hub-db). Costo fijo mensual compartido, no se multiplica por cliente.
- **worker** = contenedor (programa de segundo plano) de cada instancia; **no es una persona**.
- TomTom y HERE siempre están: uno principal (100 % de consultas) y otro respaldo (`backup_pct` %).
- Alojamientos AWS: **A** Lightsail (todo en un servidor, BD en contenedor, la más económica, sin alta disponibilidad) · **B** EC2 + RDS + ALB · **C** B en 2 zonas con RDS Multi-AZ y NAT · **D** ECS Fargate + RDS.
- Recomendación del estudio: empezar con **A** (Lightsail 4–8 GB, US$ 23.54–43.16/mes) con respaldos a S3; pasar a B/C/D por requisito de disponibilidad/SLA o al pasar de ~20 instancias, midiendo antes la RAM real.
- Contexto de arquitectura: antes Erick cotizaba Supabase + n8n + AWS solo para el worker; ahora todo corre desde AWS. Esta calculadora ya no incluye esos proveedores de Erick; no hay que mencionarlos ni marcar los proveedores actuales como «heredados».

## Arquitectura de la calculadora
`index.html` solo tiene la estructura; los estilos están en `styles.css` y todo el modelo y la interfaz en `app.js`. Lo que sigue (DEF, calc, salidas) está en `app.js`.
- `DEF`: todos los valores por defecto → `t` tarifas, `g` supuestos globales, `p` perfiles (Bajo/Medio/Alto), `ctr` contenedores, `conn` conexiones, `extras` opcionales, `gps`, `ui` estado de la interfaz, `rep` secciones del reporte.
- `calc(N, pi, s, opt)` (entre `/*MODEL-START*/` y `/*MODEL-END*/`): función pura; devuelve infra A/B/C/D, tráfico, otros, personal y total. No tocar el modelo sin necesidad: lo usan todas las salidas.
- Estado `S` persistido en `localStorage` (`xigos-calc-v1`); `load()` mezcla lo guardado con `DEF`, así que **campos nuevos en `DEF` aparecen solos** con su valor por defecto.
- Salidas: `outSummary`, `sumTable`, `outAws`, `outContainers`, `outConn`, `projTable`, `outArchs`, `outProfs`, `staffTable`, `gpsTable`, `diagramHtml`, gráficas SVG propias (`CH`, `svg*`).
- Pestañas: 1 Resumen (`renderViz`), 2 Configuración (fichas `TILES` + ventanas `MODALS`), y el reporte imprimible (`buildReport`, solo lo marcado «En el reporte»).
- Formato de números `es-CO` (punto miles, coma decimales). Helpers de moneda: `usd()`, `cop()`, `m()`, `vf()`; la moneda activa es `S.ui.unit` (`usd`|`cop`) y debe afectar **toda** la calculadora.

## Reglas de trabajo
- Responder y escribir siempre en español claro, sin tecnicismos para el usuario final.
- No inventar precios: lo desconocido se marca PENDIENTE (ver doc 10).
- Redacción: usar «la más económica», no «la más barata».
- Probar abriendo `index.html` en el navegador (no hay build ni dependencias).
