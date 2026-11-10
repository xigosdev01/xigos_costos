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
| `index.html` + `styles.css` + `js/*.js` | **Calculadora** (HTML, estilos y lógica separados en módulos por sección; sin librerías ni build; se publica tal cual en GitHub Pages: subir también la carpeta `js/`). Es el entregable principal. |
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
- **Fortox asume el costo de los dispositivos** (equipo, SIM y plataforma), así que la cantidad de dispositivos SÍ mueve el presupuesto. Hay dispositivos GPS (algunos se consultan por API; dos proveedores, que NO se nombran en la calculadora) y bodycams con la app **Team Talk de Movistar** (se escribe «Team Talk», no «TalkTeam»). Los proveedores GPS son una colección editable e independiente (sin porcentajes: total de dispositivos = suma de las cantidades; nombre, contacto, cantidad, costos por dispositivo, compra / renta / incluido en la mensualidad, COP/USD). Las bodycams se cuentan en la ficha Team Talk (cantidad + conceptos de cobro editables); su posición viene incluida en el precio de la plataforma. NO hay cotizaciones ni precios: todo queda en 0, no se inventa nada, y siempre se suma al total. Guardar posiciones GPS cuesta solo centavos por dispositivo.
- Crece con: **(a) cada instancia de cliente** (contenedores api/worker/web/db: ≈ 1.25 GB RAM reservada), **(b) celdas del mapa** que el hub consulta a TomTom/HERE (compartidas entre clientes, saturan en `ncap`=450), **(c) personal** (analista de inteligencia opcional; soporte/DevOps desactivado por defecto).
- **Hub**: uno solo para todos (hub-api, hub-collector —solo puede haber UNO—, hub-web, proxy, hub-db). Costo fijo mensual compartido, no se multiplica por cliente.
- **worker** = contenedor (programa de segundo plano) de cada instancia; **no es una persona**.
- Tamaño de zona (celda) por proveedor, en grados: TomTom 0,75°, HERE 0,75°, clima 0,5° (referencia histórica 0,25°; 1° ≈ 111,2 km). Tope: TomTom 10.000 km² por petición (oficial), HERE 1° (referencia no oficial de sus SDK), ambos con margen de seguridad del 90 %; `calc` nunca supera el tope. `ncap`=450 está medido en celdas de 0,25° y se reescala solo.
- TomTom y HERE siempre están: uno principal (100 % de consultas) y otro respaldo (`backup_pct` %).
- Alojamientos AWS: **A** Lightsail (todo en un servidor, BD en contenedor, la más económica, sin alta disponibilidad) · **B** EC2 + RDS + ALB · **C** B en 2 zonas con RDS Multi-AZ y NAT · **D** ECS Fargate + RDS.
- Recomendación del estudio: empezar con **A** (Lightsail 4–8 GB, US$ 23.54–43.16/mes) con respaldos a S3; pasar a B/C/D por requisito de disponibilidad/SLA o al pasar de ~20 instancias, midiendo antes la RAM real.
- Contexto de arquitectura: antes Erick cotizaba Supabase + n8n + AWS solo para el worker; ahora todo corre desde AWS. Esta calculadora ya no incluye esos proveedores de Erick; no hay que mencionarlos ni marcar los proveedores actuales como «heredados».

## Arquitectura de la calculadora
`index.html` solo tiene la estructura; los estilos están en `styles.css` y la lógica en `js/`, dividida por secciones. Son scripts clásicos que comparten el ámbito global; **el orden de carga está en `index.html` y importa** (`ui.js` va al final porque arranca la página).

| Archivo | Qué contiene |
|---|---|
| `js/model.js` | `DEF` (valores por defecto), tarifas por tramos y `calc(N, pi, s, opt)`. Sin DOM: función pura que usan todas las salidas. |
| `js/state.js` | Estado `S` en `localStorage` (`xigos-calc-v1`; `load()` mezcla lo guardado con `DEF`, así que campos nuevos aparecen solos), formato de números/moneda (`usd`, `cop`, `m`, `vf`) y ayudas de campos. |
| `js/providers.js` | Fichas de proveedores (`PROVS`, `PROVS_OPT`, `PBY`) y `provCard`/`provReport`. |
| `js/content.js` | Textos y tablas fijas: formas de alojar, glosario, supuestos (`SUPS`), operación por cliente (`PROFROWS`), pendientes. |
| `js/config.js` | Selector de escenario (`SCEN`, `profDesc`), fichas `TILES` y ventanas `MODALS` de proveedores. |
| `js/devices.js` | Proveedores GPS (colección), plan Team Talk y sus ventanas. |
| `js/modals.js` | Personal, ventana de gráficas, `openModal`/`closeModal` y la ventana «Operación del cliente» (`opFields`). |
| `js/report.js` | `buildReport` (PDF), tráfico, zonas, tarifas de AWS. |
| `js/outputs.js` | Tarjetas y tablas del resumen, diagrama SVG, AWS, contenedores, conexiones, proyección. |
| `js/charts.js` | Dibujo SVG propio y definición de cada gráfica (`CH`). |
| `js/views.js` | Diagrama interactivo, pestaña Resumen (`renderViz`), tooltips. |
| `js/awsrank.js` | Tarjetas A/B/C/D, orden por criterios, recomendación y cuándo escalar. |
| `js/ui.js` | Pestañas, eventos de campos, botones y arranque (`buildPage(); update();`). |

- Pestañas: 1 Resumen (`renderViz`), 2 Configuración (fichas `TILES` + ventanas `MODALS`), y el reporte imprimible (`buildReport`, solo lo marcado «En el reporte»).
- Formato de números `es-CO`. La moneda activa es `S.ui.unit` (`usd`|`cop`) y debe afectar **toda** la calculadora.
- La operación de un cliente (`S.p`) tiene 4 niveles: pequeña, mediana, grande y personalizada (índice 3, arranca como copia de la mediana); `PROF_NAMES`/`PROF_UP` en `state.js`. Todo código que recorra niveles debe usar los 4.
- Al agregar un archivo nuevo, añadir su `<script>` en `index.html` en el orden correcto.
## Reglas de trabajo
- Responder y escribir siempre en español claro, sin tecnicismos para el usuario final.
- No inventar precios: lo desconocido se marca PENDIENTE (ver doc 10).
- Redacción: usar «la más económica», no «la más barata».
- Probar abriendo `index.html` en el navegador (no hay build ni dependencias).
