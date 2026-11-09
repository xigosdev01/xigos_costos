> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).


# 02 — Inventario de servicios, dependencias y licencias

Fuente: lectura del repositorio (`CLAUDE.md`, `docs/PLAN_XIGOS.md`, `docs/DEPLOYMENT.md`, `deploy/**`, `apps/**`, `packages/connectors`, migraciones). No existe el directorio `audit/` con informes previos; este estudio crea `audit/cost-analysis/`.

## 1. Arquitectura real (determinada del código)

| Pregunta | Respuesta verificada |
|---|---|
| ¿Una instancia multiempresa? | **No como modo vigente.** El código conserva el modo multiempresa heredado (RLS por `organization_id`), pero la arquitectura vigente (rama `xigos`, F4) es **una instancia por cliente**: `XIGOS_INSTANCE=true` limita la instancia a UNA organización. |
| ¿BD independiente por cliente? | **Sí:** base `xigos_<slug>` con logins propios; el login de una instancia no se conecta a otra (probado en `apps/api/test/instance.e2e-spec.ts`). En el compose de producción cada instancia lleva además su **propio contenedor PostGIS**. |
| ¿Servidor por cliente? | No: varias instancias comparten servidor (la guía dimensiona 4 GB para el hub + 2-3 instancias pequeñas). |
| ¿Contenedores? | Escritos (`deploy/Dockerfile`, `deploy/{hub,instance,proxy}/docker-compose.yml`) pero **NUNCA construidos ni levantados** (no hay Docker en el equipo de desarrollo). |
| ¿Procesos por cliente? | Cada instancia = `api` + `worker` + `web` (+ `db` + `migrate` efímero). |
| ¿Hub compartido? | **Sí:** un HUB único (BD `hub`, API, collector, panel) que consulta los proveedores de datos **una vez por celda geográfica** y sirve a todas las instancias por un feed con llave por instancia. |

Distinción de entidades (no confundir): **cliente** = organización dueña de una instancia (hoy solo Coltabaco); **usuario** = persona con cuenta en el hub (OIDC) y espejo local en la instancia; **vehículo/dispositivo** = fila en `devices` (hoy simulador + Eje Satelital); **cuenta de proveedor** = credenciales cifradas (llaves de HERE/TomTom del hub; usuario/clave de Eje Satelital del cliente); **instancia de infraestructura** = conjunto de contenedores por cliente.

## 2. Diagrama de arquitectura (estado de cada componente)

```
 Navegador del usuario ──HTTPS──▶ [web: nginx + React/Vite] ✔ existe
        │  (mapas: teselas OpenStreetMap directo al navegador) ✔ en uso, política de uso justo
        ▼
 [api NestJS] ✔  ◀──▶ [BD PostgreSQL+PostGIS por instancia] ✔      [worker] ✔ (ingesta, informes PDF con Chromium,
   │  │  │                                                          seguimiento GPS, avisos)
   │  │  └─ SMTP (Microsoft 365/Outlook) ✔ en uso · Web Push/VAPID ✔ (entrega real sin verificar)
   │  └──── Eje Satelital API (1 consulta/min por organización) ◐ implementado, verificado con 3 equipos detenidos
   │            ▲  cuenta del CLIENTE con su plataforma GPS; no hay receptor TCP/UDP propio ✘ (no existe ni hace falta)
   │            └── Dispositivos GPS (hardware + SIM del cliente) ─ fuera de XiGOS
   ▼  feed por cursor (llave por instancia) + latido
 [HUB: api + collector + panel + BD hub] ✔ ──consulta por celda──▶ HERE Traffic v7 ◐ · TomTom Incidents v5 ✔
       │  (compartido, sin datos de clientes)                      Open-Meteo ◐(no comercial) · OpenWeatherMap ◐(simulado)
       │                                                            OpenRouteService ◐ (sin llave cargada)
       └─ OIDC (identidad única), versiones por anillos, alertas manuales ✔
 [Agente de actualización + respaldos] ◐ lógica probada; contenedores reales sin probar
 [AWS / servidor] ✘ no desplegado   [WhatsApp] ✘ no implementado   [SMS] ✘ pendiente   [IA] ✘ solo estructura
```
Leyenda: ✔ existe y se usa · ◐ parcial o sin verificar contra el servicio real · ✘ no existe.

## 3. Inventario de servicios que pueden generar costo

| # | Servicio | Función | Estado | Clasificación | Alternativa de | Precio público |
|---|---|---|---|---|---|---|
| 1 | HERE Traffic v7 (Base Plan) | Incidentes por celda (hub) | Implementado; sin llave real verificada | Utilizado actualmente (variable por celda, compartido) | TomTom (hoy se consultan AMBOS para confirmación cruzada) | Sí |
| 2 | TomTom Traffic Incident Details v5 | Incidentes por celda (hub) | Implementado y verificado con datos reales | Utilizado actualmente | HERE | Sí |
| 3 | Open-Meteo | Clima por celda | Implementado; rotulado «datos de prueba» (licencia no comercial) | Configurado; **no apto producción** sin plan comercial | OpenWeatherMap | Plan comercial: precio no mostrado → PENDIENTE |
| 4 | OpenWeatherMap | Clima por celda | Implementado con respuestas simuladas; sin llave | Necesario para producción (alternativa a 3) | Open-Meteo | Sí (gratis 1 M/mes) |
| 5 | OpenRouteService (HeiGIT) | Rutas y alternas bajo demanda, caché 24 h | Implementado en el hub; **sin llave cargada** | Necesario para producción | TomTom Routing / HERE Routing (TomTom Routing pendiente de implementar) | Sí (gratis 2.000/día) |
| 6 | Eje Satelital | Posiciones GPS | Implementado; login/lista/incremental verificados | Utilizado (cuenta del cliente) | Simulador | **NO — requiere cotización** |
| 7 | OpenStreetMap (teselas) | Mapa Leaflet del panel | En uso | Utilizado; riesgo a escala | TomTom Map Display u otro | Política de uso justo |
| 8 | Nominatim (OSM) | Buscar lugares al crear zonas | En uso (proxy del backend ≤1 req/s) | Utilizado (bajo volumen) | TomTom/HERE Geocoding | Política |
| 9 | SMTP Microsoft 365 / Outlook | Correos de aprobación, distribución y avisos | En uso | Utilizado | Amazon SES | Licencia de buzón: no verificada |
| 10 | Web Push (VAPID/FCM) | Avisos del navegador | Implementado; entrega real sin verificar | Utilizado | SMS | Gratis |
| 11 | WhatsApp Business Platform | Avisos por WhatsApp | **No implementado** (solo mencionado en `docs/PLAN_XIGOS.md`) | Pendiente de implementar | SMS | Sí |
| 12 | SMS | Avisos | Sin proveedor | Pendiente | WhatsApp | No consultado |
| 13 | AWS (Lightsail/EC2/RDS/S3/ALB…) | Hospedaje | No desplegado | Necesario para producción | Servidor Windows propio (plan actual) | Sí |
| 14 | Dominio + certificados | `xigos.<dominio>` | Sin dominio (se usará `sslip.io`/Cloudflare Tunnel en pruebas) | Necesario para producción | sslip.io | No consultado |
| 15 | PostgreSQL/PostGIS, Chromium/Playwright, Node, Caddy, Docker | Plataforma | En uso / escrito | Sin licencia (consumen RAM/CPU) | — | N/A |
| 16 | Cloudflare Tunnel (trycloudflare) | Acceso temporal por Internet | Script en el repo | Utilizado en pruebas; gratis | Caddy + dominio | Gratis |
| 17 | Servicios no hallados en el código | Sin dependencias de IA, firma electrónica, SMS, analítica ni monitoreo de pago (búsqueda `anthropic/openai/sentry/twilio/sendgrid/stripe` sin coincidencias de código) | — | — | — | — |

Dependencias npm relevantes para costo: `nodemailer` (SMTP), `web-push`, `playwright-core` (Chromium), `pg`/`kysely`, `oidc-provider` (hub). Todas de código abierto sin licencia comercial.
