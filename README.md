# Calculadora de costos XiGOS

Herramienta web para estimar **cuánto cuesta mantener XiGOS** cada mes y cada año, en dólares o en pesos, según cuántos clientes se atiendan, qué tan grande sea el uso de cada uno y cómo se aloje el sistema en AWS.

- **Cómo abrirla:** abra `index.html` en el navegador (o la dirección de GitHub Pages). No necesita instalación ni servidor.
- **Archivos de la calculadora:** `index.html` (estructura), `styles.css` (estilos) y la carpeta `js/` (cálculos y pantallas, dividida por secciones: modelo, proveedores, dispositivos, reporte, gráficas, etc.). Hay que publicar todo junto, incluida la carpeta `js/`.
- **Qué guarda:** todo lo que usted cambie queda **solo en su navegador** (no se envía a ningún servidor). Para llevarlo a otro equipo use «Guardar mi configuración».
- **Importante:** es una **estimación**. Los precios de proveedores son de lista y se consultaron el 6 de noviembre de 2026; muchos otros valores son supuestos que usted puede cambiar. Lo desconocido se marca como pendiente y no se inventa.

---

## 1. Cómo se usa (en 4 pasos)

1. Arriba, en **Escenario**, elija cuántos clientes quiere simular, qué tan grande es la operación de cada cliente (pequeña, mediana o grande), la forma de alojar en AWS y la moneda.
2. Lea la pestaña **1 · Resumen**: cifras, gráficas y el diagrama.
3. En la pestaña **2 · Configuración** abra cada ficha para entender un proveedor y cambiar precios o supuestos. Marque **«En el reporte»** en lo que quiera que salga en el PDF.
4. Pulse **Descargar PDF** (o «Imprimir o guardar como PDF» al final del Resumen) y elija «Guardar como PDF» en el cuadro de impresión.

### Botones de arriba
| Botón | Qué hace |
|---|---|
| **Descargar PDF** | Abre el cuadro de impresión con solo lo marcado «En el reporte». |
| **Más opciones → Tabla en Excel (CSV)** | Baja la proyección por número de clientes (siempre en USD y COP). |
| **Guardar mi configuración** | Descarga un archivo `.json` con todos sus cambios. |
| **Cargar una configuración** | Abre un archivo guardado antes. |
| **Ver la guía de uso** | Muestra otra vez la guía rápida. |
| **Restaurar valores originales** | Borra sus cambios (pide confirmación). |

---

## 2. Escenario (los controles de arriba)

| Control | Qué significa |
|---|---|
| **Número de clientes** | Cuántas empresas usan XiGOS. Cada cliente tiene su propio sistema aislado («instancia»). |
| **Qué tan grande es la operación de cada cliente** | **Pequeña (uso bajo)**, **mediana (uso medio)**, **grande (uso alto)** o **personalizada (la ajusto yo)**. Es el perfil de uso promedio de UN cliente: cuántos km² de territorio vigila, cuántos usuarios tiene el panel, cuántas horas al día reportan sus GPS y cuántos correos, rutas alternas y mensajes genera al mes. Al pasar el cursor por el selector (ⓘ) un tooltip dice qué costos mueve hoy el tamaño elegido y cuáles no (por estar dentro de cuotas gratis o fuera del cálculo). Debajo del selector, la pantalla muestra los números reales del nivel elegido y a cuántas zonas de cada proveedor equivale su territorio. El botón **«Ajustar la operación del cliente»** abre una ventana donde se escriben esos datos para el nivel elegido (use **personalizada** para no tocar los tres niveles de ejemplo; arranca como copia de la mediana). Cada dato explica de dónde sale el valor de ejemplo y cómo obtener el dato real. **No incluye cuántos dispositivos tiene**: esos se registran por proveedor en las fichas de dispositivos. |
| **Alojamiento en AWS** | Cómo se instala XiGOS en AWS (ver abajo). |
| **Moneda de toda la calculadora** | Dólares (USD) o pesos (COP). Cambia **todas** las cifras de dinero: tarjetas, tablas, gráficas y reporte. Las tarifas de proveedores que usted edita se escriben en su moneda original (USD o EUR). |

### Las 4 formas de alojar en AWS
| Opción | Cómo es | Ventaja | Desventaja |
|---|---|---|---|
| **A · Lightsail** | Un servidor «todo incluido» donde corren todas las piezas, base de datos incluida. | La más económica; precio fijo; transferencia incluida. | Si el servidor falla, todo se cae hasta restaurar. Usted lo administra todo. |
| **B · EC2 + RDS** | Servidores EC2 para los programas y una base de datos administrada por AWS (RDS). | AWS cuida la base (respaldos, parches). | Más costosa. |
| **C · Alta disponibilidad** | Como B, duplicada en dos zonas de AWS, con la base de datos copiada en vivo. | Sigue funcionando si una zona falla. | Cuesta el doble o más que B. |
| **D · Fargate + RDS** | AWS ejecuta cada contenedor por usted (sin servidores que administrar) + base RDS. | Cero administración de servidores. | Cada pieza siempre encendida sale mucho más cara que en un servidor compartido. |

Debajo del escenario hay una tarjeta por cada opción (A, B, C, D), con su costo mensual y anual, su **puesto de 1 a 4** (según un puntaje que combina costo, disponibilidad, respaldo, facilidad de operar y capacidad de crecer) y las etiquetas «recomendada hoy» y «la más económica». Tocar una tarjeta la selecciona. Debajo:

- **¿Cuál AWS es recomendable?** Dice qué tamaño de servidor conviene para el número de clientes elegido (para 1 cliente: A con Lightsail de 4 GB).
- **Ver por qué quedó en ese orden y cuándo pasar a otra opción:** la tabla de puntajes por criterio (los puntajes son criterio del analista, no medidos) y los seis criterios para pasar de una opción a otra: el servidor se llena, hay muchas bases de datos, un contrato exige disponibilidad, se necesita mejor respaldo, falta equipo técnico y cuánto cuesta el cambio.

---

## 3. Pestaña «1 · Resumen» — qué muestra cada sección

### 3.1 Así se conecta XiGOS y qué se cobra (diagrama)
Cuatro columnas de izquierda a derecha. **Lo que está en rojo es lo que genera costo.**
1. **Su cliente:** usuarios con el navegador, dispositivos GPS y bodycams (equipo, SIM y plataforma los asume Fortox) y correo/avisos (el correo sale por Microsoft 365, que ya se paga aparte; los avisos del navegador son gratis).
2. **Servidor en AWS:** una instancia por cada cliente (web, api, worker y base de datos). Muestra el costo por cliente y explica por qué crece con cada cliente: todas las instancias reservan la misma memoria sin importar la operativa del cliente.
3. **Hub XiGOS:** la central compartida por todos. Es un **costo fijo mensual** que no se multiplica por cliente; el diagrama indica su valor, dónde queda y el estado de su respaldo.
4. **Proveedores externos:** TomTom, HERE, OpenRouteService, OpenWeatherMap y WhatsApp, con su forma de cobro.

### 3.2 Resumen interactivo
- **Total aproximado por mes:** servidores y AWS + datos de tráfico + otros proveedores + el personal que usted active.
- **«Costo duro» por mes:** solo lo que se paga a AWS y a proveedores, sin personal.
- **Por cliente al mes:** el total dividido entre los clientes.
- **Por año:** el total mensual por 12.
- **Costo promedio por dispositivo al mes:** es repartir la cuenta (total ÷ dispositivos GPS y bodycams). **No es lo que cuesta un dispositivo**: uno adicional agrega lo que cueste su equipo, SIM y plataforma (la tarjeta lo calcula). Baja con más dispositivos porque los costos fijos se reparten entre más.
- **Instalación de los clientes (una sola vez):** aparece solo si activa soporte/DevOps.
- **Barra de reparto** y **«En palabras simples»:** de cada 100 dólares, cuántos van a servidores, tráfico, otros proveedores y personal.
- **Tabla de conceptos:** servidores y AWS (con su desglose), datos de tráfico, rutas excedentes/correo/mapas/WhatsApp/opcionales, dispositivos (equipo, SIM y plataforma de GPS y bodycams, siempre incluidos), subtotal costo duro, personal y total, cada uno por mes, por año y por cliente. Abajo, los **pagos de una sola vez**.
- **Qué NO incluye:** los precios de dispositivos que aún estén en 0 por falta de cotización, video de las bodycams si no indica los GB, intermediario de WhatsApp, licencia de Microsoft 365, dominio, soporte de AWS e impuestos.

### 3.3 Gráficas (pase el cursor o toque para ver el detalle; cada una tiene su tabla de datos)
| Gráfica | Para qué sirve |
|---|---|
| **¿Dónde se va el dinero?** | Reparte el costo mensual entre servidores, tráfico, otros proveedores, dispositivos (equipo, SIM y plataforma) y personal. |
| **Cómo crece el costo al tener más clientes** | Una línea por componente y una para el total (escala logarítmica). Se pueden apagar líneas. «Otros» sube después de ~320 clientes porque se agota el cupo gratis de rutas. |
| **Cuánto cuesta cada cliente (promedio) al crecer** | Muestra que cada cliente cuesta menos al repartirse los costos fijos. |
| **¿Un dispositivo GPS más sube el costo?** | Costo total y promedio por dispositivo cuando cada cliente tiene más o menos dispositivos GPS. |
| **¿Qué mueve más el resultado?** | Sensibilidad: cuánto cambia el total si cada supuesto sube o baja 25 %. Las barras largas son lo que más importa confirmar. |
| **Las cuatro formas de alojar en AWS** | Costo de infraestructura de A, B, C y D según el número de clientes. |
| **TomTom y HERE según las zonas vigiladas** | Costo de cada proveedor de tráfico según cuántas zonas del mapa se vigilan. |
| **Efecto del analista de inteligencia** | Solo aparece si activó al analista y escribió su sueldo. |

### 3.4 Imprimir o guardar como PDF
Lista de lo que saldría en el PDF (lo marcado «En el reporte») y el botón para imprimirlo.

---

## 4. Pestaña «2 · Configuración» — cada ficha y qué se puede cambiar

Cada ficha tiene el botón **⚙ Configurar** (abre una ventana con explicaciones y valores editables) y la casilla **«En el reporte»** (si sale en el PDF). Arriba hay tres atajos: **Marcar todo**, **Solo resumen** y **Desmarcar todo**.

Cada ficha de proveedor explica: ¿qué es?, ¿para qué lo usa XiGOS?, ¿cómo cobra?, las tarifas editables, un ejemplo con sus números, los riesgos y la fuente con su nivel de confianza.

### 4.1 Tráfico vial (siempre HERE + TomTom)
| Campo | Qué hace |
|---|---|
| **Proveedor principal** | TomTom (respaldo HERE) o HERE (respaldo TomTom). El principal recibe el 100 % de las consultas. |
| **% de consultas que también se hacen al respaldo** | 100 % = hoy, se pagan los dos completos. 0 % = el respaldo no se consulta. Menos consultas bajan el costo pero reducen la confirmación entre proveedores. |
| **Consultas por hora, por zona** | Cuántas veces por hora se pregunta por cada zona del mapa (2 = cada 30 min; 12 = cada 5 min). Más consultas = más costo. |
| **… o minutos entre consultas por zona** | Es lo mismo dicho en minutos (`consultas por hora = 60 ÷ minutos`). Al cambiar uno se actualiza el otro. Un mes se cuenta de 30 días (720 horas). |
| **Zona de TomTom / Zona de HERE (grados por lado)** | Tamaño del cuadro del mapa que se consulta en cada petición, **uno por proveedor**. Por defecto **0,75°** (≈ 83 km por lado; la referencia anterior era 0,25° ≈ 28 km). Zonas más grandes = menos consultas = menos costo. 1° ≈ 111,2 km. |
| **Margen de seguridad (%)** | Se aplica al máximo de cada proveedor y **el cálculo nunca lo supera**, aunque escriba un valor mayor (se avisa en pantalla). TomTom acepta hasta 10.000 km² por petición: con 90 % el tope es 9.000 km² ≈ **0,853°**. HERE no publica un límite en su guía de la API v7; sus SDK usan 1° (referencia no oficial): con 90 % el tope es **0,9°**. Los botones «Usar el máximo» ponen el tope en cada proveedor. |
| **Zona de clima** | Se cambia en la ficha de OpenWeatherMap. Por defecto **0,5°** (≈ 56 km). Sin tope publicado. |
| **Tarifas de TomTom** (EUR) | Peticiones gratis al mes y precio por 1.000 en cada tramo. |
| **Tarifas de HERE** (USD) | Transacciones gratis al mes y precio por 1.000 en cada tramo. |

Muestra la comparación de costo de cada proveedor con las zonas vigiladas. **Riesgo a recordar:** el plan básico de HERE excluye rastreo de activos; hay que preguntarle por escrito antes de producción.

### 4.2 Otros servicios que la arquitectura actual usa
| Ficha | Qué es y qué se edita |
|---|---|
| **OpenRouteService** | Rutas y alternas. Gratis hasta ~60.000 al mes (2.000 al día), compartidas por todos los clientes. Lo que sobra se paga a TomTom Routing: 20.000 gratis al mes y luego por tramos (hasta 1 M, de 1 a 5 M y de 5 a 10 M de rutas). Se edita el cupo gratis y la tarifa de cada tramo. |
| **OpenWeatherMap / Open-Meteo** | Clima. Se edita el cupo gratis (1 M llamadas al mes), las **consultas de clima por hora por zona** y los planes de pago (Startup, Developer, Professional, Expert, en libras). Si el clima se pasa del cupo gratis, se toma el plan más pequeño que alcance; para convertirlo a dinero hay que escribir los **dólares por libra** (no se consultó, por eso está en 0). Open-Meteo no es gratis para uso comercial. |
| **Dispositivos GPS y proveedores** | **Fortox asume el costo** de equipos, SIM y plataforma, por lo que la cantidad de dispositivos mueve el presupuesto (siempre incluido en el total). Es una **colección de proveedores** a gusto del usuario; no hay porcentajes: el total de dispositivos es la **suma de las cantidades** y cada proveedor es independiente. Para cada uno se registra nombre, **contacto**, **cantidad de dispositivos** (total de la operación o por cada cliente), moneda en que cotiza (COP o USD), modalidad del equipo (**compra**, **renta mensual** o **incluido en la mensualidad**) y los costos por dispositivo: equipo, renta, instalación, mensualidad/plataforma, SIM, otros y vida útil. Ejemplo: proveedor A con 50 equipos (costo por equipo + mensualidad) y proveedor B con 30 equipos con el equipo incluido (solo mensualidad). Todos los precios empiezan en 0: no hay cotizaciones ni precios públicos. |
| **Team Talk (Movistar) — bodycams** | Las bodycams funcionan con la app Team Talk de Movistar. Se escribe la **cantidad de bodycams** (total o por cliente) y los GB de video por bodycam (0 = no se guarda en la nube). Movistar no publica precios ni la estructura de sus planes, así que la ficha trae **todas las modalidades de cobro** (por bodycam al mes, por bodycam con pago único repartido o no, por cliente, cargo fijo, por GB de video, por bloque de bodycams), cada concepto con valor, moneda (COP/USD) y casilla «Incluir»; se pueden agregar conceptos nuevos. Todos empiezan en 0. Las bodycams también reportan posición, pero eso viene incluido en el precio de la plataforma y no cambia el costo. |
| **OpenStreetMap** | Mapas gratuitos. Casilla para incluir un proveedor de mapas de pago (teselas de TomTom) y sus tarifas. |
| **Correo (Microsoft 365 / Amazon SES)** | Hoy el correo sale por Microsoft 365 y **no suma**. Se puede escribir la licencia de M365 atribuible a XiGOS, o activar Amazon SES (con su precio por correo). |
| **Notificaciones del navegador (Web Push)** | Gratis; sin campos. |
| **WhatsApp Business (Meta)** | **Pendiente de implementar.** Casilla para incluirlo en el cálculo las tarifas por tipo de mensaje (utilidad, autenticación, servicio y marketing) y el **% de mensajes que son de marketing** (el resto se cobra como utilidad). Los mensajes por mes por cliente están en «Supuestos y tamaños de uso». El costo real es el desarrollo (≈ 100 h supuestas) y un intermediario opcional sin precio público. Abra la cuenta en USD: pagar en pesos sale ≈ 14 % más caro. |

### 4.3 Servidores y contenedores en AWS
- **Alojamiento y contenedores:** las cuatro formas de alojar, los **pesos** para ordenar las alternativas (costo, disponibilidad, respaldo, facilidad de operar, capacidad de crecer), el orden con su explicación, la recomendación, los criterios para escalar, el costo de la cuenta de AWS desglosado, y las tablas de contenedores por cliente y del hub. Por contenedor se edita la **memoria que usa realmente (GB)** y, para Fargate, el **procesador y la memoria reservados**. Muestra cuánto cuesta mantener cada contenedor.
- **Conexiones entre contenedores:** qué conversa con qué y cuántos **GB por cliente al mes** viajan (editable); explica qué cobra AWS por la salida a Internet, entre zonas, por la «puerta de salida» (NAT) y por IP pública.
- **Tarifas de AWS:** precio de cada servicio en São Paulo (Lightsail, EC2, RDS, discos, balanceador, NAT, IP pública, transferencia, S3, ECR, CloudWatch, Route 53, Secrets Manager, horas por mes), todo editable.

### 4.4 Servicios que hoy NO se necesitan (opcionales)
| Ficha | Descripción |
|---|---|
| **OpenWeb Ninja (API de Waze)** | Intermediario no oficial de incidentes de conductores. Casilla para incluirlo, precio por petición y peticiones por hora por zona (o por mes). Validar con asesoría legal. |
| **Waze for Cities** | Convenio oficial sin precio (intercambio de datos). |
| **Apify** | Extracción automática de datos web. Casilla, plan a considerar (Gratis, Starter, Scale, Business) y precio de cada plan. |
| **INRIX** | Tráfico analítico por cotización. Casilla y campo para escribir su cotización mensual. |
| **Google Maps Platform** | Solo si un cliente lo exige. Casilla y campo para su costo mensual estimado. |
| **Datos oficiales (datos.gov.co, INVIAS, IDEAM…)** | Gratis, pero hoy sin servicio utilizable. |

### 4.5 Modelo y secciones del reporte
| Ficha | Qué contiene |
|---|---|
| **Resumen de costos** | Totales, costo duro, por cliente, por dispositivo y por año (solo se marca para el reporte). |
| **Gráficas** | Elegir cuáles de las gráficas salen en el PDF y en qué moneda. |
| **Personal: analista de inteligencia** | Casilla para incluirlo; **sueldo mensual (COP)**, **factor** (1 = solo sueldo; mayor para sumar prestaciones), **cantidad de analistas** y **clientes por analista** (0 = usar la cantidad fija). Aparte, casilla para **soporte técnico y DevOps** (apagado por defecto): tarifa por hora, horas fijas al mes y horas extra por cliente. Muestra el efecto en el costo promedio por cliente. |
| **Proyección por número de clientes** | Las cantidades de clientes de la tabla y de las gráficas (separadas por coma, máximo 12), con la comparación entre las cuatro formas de alojar. |
| **Supuestos y tamaños de uso** | Ver la tabla de abajo. |
| **Diagrama, Glosario, Qué falta saber** | Secciones de solo lectura que puede incluir en el PDF. |

#### Supuestos globales
| Supuesto | Para qué sirve |
|---|---|
| Territorio total de Colombia que se podría vigilar (km²) | Techo del gasto en tráfico (por defecto 347.800 km², ≈ 30 % del país según una estimación del estudio, sin dato real). |
| Consultas por hora de tráfico y de clima (o su equivalente en minutos) | Más frecuencia = más costo. |
| Uso máximo de memoria de un servidor | 80 % deja holgura para picos. |
| Bases de datos por cada RDS | Cuántas bases aguanta un RDS (no probado). |
| Bytes por posición GPS, días de retención, GB base por cliente, veces que se guarda en respaldos | Definen el almacenamiento y los respaldos. |
| Fracción de rutas que se reutilizan (memoria de 24 h) | Menos rutas nuevas = menos excedente que pagar. |
| Capacidad promedio del balanceador, GB de imágenes Docker, uso de Secrets Manager y claves por instancia, GB de registros, KB por consulta del hub, tráfico interno entre zonas, dominio, minutos de «migrate» | Ajustes finos de AWS. |

#### Operación por cliente (pequeña / mediana / grande / personalizada)
Por cada tamaño se editan: territorio que vigila cada cliente (km²), horas al día reportando, cada cuántos segundos reporta el equipo (XiGOS guarda máximo una posición por minuto), usuarios, teselas de mapa por usuario, correos, mensajes de WhatsApp, rutas alternas pedidas, horas de soporte e instalación (estas dos solo cuentan si activa soporte). Cada fila de la tabla trae su explicación: por qué se eligió ese valor y de dónde sacar el dato real. Todos son supuestos del estudio, sin mediciones reales de clientes.

#### Tipo de cambio
Pesos por dólar (TRM 3.228,26) y dólares por euro (1,1165), ambos del 6 de noviembre de 2026.

---

## 5. Cómo se calcula (resumen)

- **Zonas vigiladas** (celdas): `Ncap · (1 − e^(−clientes · celdas por cliente / Ncap))`. Dos clientes sobre la misma ruta no duplican consultas, y el gasto de tráfico tiende a un techo.
- **Tamaño de la zona:** el territorio que vigila cada cliente se escribe en km² (pequeña 2.320, mediana 4.640, grande 9.280) y el total del país a vigilar también (347.800 km²); se dividen entre el área de la zona de cada proveedor, con un mínimo de 1 zona por cliente. Esos valores salen de 3 / 6 / 12 zonas de 0,25° del estudio original (el 6 se ejemplificó con una ruta Bogotá–Zipaquirá) y del 30 % estimado del país: son supuestos sin medición real. Cada proveedor tiene su propio tamaño y, por tanto, su propio número de zonas y de consultas. **El hub real debe configurarse con el mismo tamaño** para que el cálculo sea real. Está por verificar con una consulta real cuántos incidentes (y datos) devuelve una zona grande y cómo cuenta HERE sus transacciones.
- **Consultas al mes** por proveedor: `zonas · consultas por hora · 720` (igual a `zonas · 43.200 / minutos entre consultas`). HERE y TomTom cobran por tramos con una cuota gratis mensual; el proveedor de respaldo recibe solo el % de consultas que usted indique.
- **Rutas excedentes:** `clientes · rutas pedidas · (1 − reutilización)` menos el cupo gratis de OpenRouteService; lo que sobra se cobra a TomTom Routing con sus 20.000 gratis y sus tramos.
- **Clima:** gratis dentro del cupo de OpenWeatherMap; si se pasa, el plan de pago más pequeño que alcance.
- **Posiciones GPS:** `dispositivos GPS (suma de los proveedores) · horas al día · 3.600 · 30 / máx(segundos entre reportes, 60)`. Guardarlas cuesta almacenamiento y respaldos (centavos por dispositivo al mes): las posiciones **no** son consultas a TomTom ni HERE. Lo que sí pesa por dispositivo es su equipo, SIM y plataforma (ver «Dispositivos GPS»).
- **Servidores (opción A):** memoria necesaria = hub (≈ 1,5 GB) + clientes · ≈ 1,25 GB, con 80 % de uso máximo; se elige el escalón de Lightsail que alcance.
- **Opciones B, C, D:** servidores EC2 (o Fargate) por memoria, más un RDS por cada ~25 bases, balanceador, discos, registros y transferencia de salida.
- **Total mensual** = servidores y AWS + tráfico + rutas + correo (si aplica) + WhatsApp (si se incluye) + mapas de pago (si se incluyen) + opcionales + dispositivos (GPS y bodycams: proveedores + plan Team Talk) + personal (si se activa).

Idea central: **el costo viene de cada cliente nuevo (su propio sistema), de cuántas zonas del mapa se vigilan, de los dispositivos (Fortox asume equipo, SIM y plataforma de cada GPS y bodycam) y de las personas que operan el servicio.**

---

## 6. Documentos de estudio (en esta carpeta)

Son el estudio original, con cifras fijas al 6 de noviembre de 2026. La calculadora es la versión viva.

| Archivo | Contenido |
|---|---|
| `02-inventario-servicios-y-licencias.md` | Arquitectura real del sistema y los servicios que pueden generar costo. |
| `03-fuentes-y-precios-verificados.md` | De dónde sale cada tarifa (dirección y fecha). |
| `05-comparativa-tomtom-here.md` | TomTom frente a HERE y el riesgo de licencia de HERE. |
| `08-proyecciones-y-rentabilidad.md` | Proyecciones por tamaño de uso y precio mínimo por cliente. |
| `09-optimizacion-de-costos.md` | Plan de ahorro con su prioridad. |
| `10-supuestos-y-datos-pendientes.md` | Qué está verificado, qué no y qué datos conseguir. |
| `11-modelo-financiero.xlsx` | Modelo en Excel con fórmulas. |
| `12-resumen-auditoria.pdf` | Resumen en PDF. |
| `CLAUDE.md` | Contexto del proyecto para el asistente de código. |
