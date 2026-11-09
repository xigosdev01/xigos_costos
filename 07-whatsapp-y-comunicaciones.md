> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 07 — WhatsApp y comunicaciones

## 1. Estado
**WhatsApp NO está implementado.** El código no contiene integración alguna (búsqueda en `apps/`, `packages/`, `scripts/`, `db/`: sin coincidencias de código); solo se menciona en `docs/PLAN_XIGOS.md` (adjuntos de alertas manuales que NO se guardan; un «agente de IA para alertas desde WhatsApp» como estructura futura). Los canales activos son **correo y Web Push**; SMS queda «pendiente, sin proveedor gratuito confiable». Todo lo de este documento es **costo proyectado**, no actual.

## 2. Tarifas oficiales de Meta para Colombia (desde 2026-10-01)
Marketing US$ 0.0125 · Utilidad US$ 0.0008 · Autenticación US$ 0.0008 · Servicio US$ 0.0008 (tras 1,000 gratis/mes por número). Los mensajes enviados por el usuario no cuestan. Detalle y URL: doc 03 §4.
- Las alertas de viajes de XiGOS son iniciadas por la empresa fuera de la ventana de 24 h ⇒ **plantillas de utilidad** (US$ 0.0008). Un recordatorio promocional sería marketing (15.6 veces más caro): evitarlo.
- Una respuesta del cliente abre la ventana de 24 h; desde 2026-10-01 las respuestas de servicio y las de utilidad dentro de la ventana **ya se cobran** (1,000 de servicio gratis/mes por número).
- **Pagar en COP sale ~14% más caro** que USD a TRM: el tarifario COP de Meta implica 3,682 COP/USD. La moneda se fija al crear la cuenta de mensajería: crear la cuenta en USD.

## 3. Matriz de costo mensual de Meta (USD, solo mensajes de utilidad; Cloud API directa)
| Clientes | 100 msg/cliente | 500 | 1,000 | 5,000 | Marketing 100 msg | Marketing 1,000 msg |
|---:|---:|---:|---:|---:|---:|---:|
| 10 | 0.80 | 4.00 | 8.00 | 40.00 | 12 | 125 |
| 50 | 4.00 | 20.00 | 40.00 | 200.00 | 62 | 625 |
| 100 | 8.00 | 40.00 | 80.00 | 400.00 | 125 | 1,250 |
| 250 | 20.00 | 100.00 | 200.00 | 1,000.00 | 312 | 3,125 |
| 500 | 40.00 | 200.00 | 400.00 | 2,000.00 | 625 | 6,250 |
| 1000 | 80.00 | 400.00 | 800.00 | 4,000.00 | 1,250 | 12,500 |
Costo por cliente al mes: 100 msg = US$ 0.08; 500 = 0.40; 1,000 = 0.80; 5,000 = 4.00 (COP 12,913). Las tarifas de utilidad en Colombia tienen tramos por volumen sobre 100,000 msg/mes por mercado: no relevantes salvo a 1,000 clientes x 100+ msg.
**Conclusión:** el costo de Meta es **marginal** frente a la instancia (~US$ 8/cliente) y el soporte; el costo real de WhatsApp es **desarrollo y operación**.

## 4. Implementación y operación (supuestos NO verificados)
| Concepto | Tipo | Horas | USD (a US$ 20/h supuestos) |
|---|---|---:|---:|
| Webhook, envío por plantilla, estado de entrega, opt-in/opt-out, aprobación de plantillas | Única vez | 100 | 2,000 |
| Verificación de negocio en Meta, número dedicado, cuenta de mensajería | Única vez | 8 | 160 |
| Mantenimiento (cambios de política, plantillas rechazadas, soporte) | Mensual | 4 | 80/mes |
| BSP (si se usa) | Mensual | — | **REQUIERE COTIZACIÓN** (no público) |
| Infraestructura (endpoint de webhook en el hub) | Mensual | — | ≈ 0 (comparte servidor) |

**Cloud API directa vs BSP:** la directa solo paga a Meta; un BSP añade mensualidad y/o sobreprecio por mensaje (no público: PENDIENTE) a cambio de panel, soporte e inbox. Dado que XiGOS ya tiene backend, plantillas fijas y envío automático (sin chat humano), **recomendación provisional: Cloud API directa**; reconsiderar un BSP solo si se necesita bandeja de atención humana.

## 5. Otros canales
| Canal | Costo | Estado |
|---|---|---|
| Correo (SMTP Microsoft 365 hoy) | Licencia del buzón no verificada; alternativa SES US$ 0.00016/correo ⇒ 1,500 correos/cliente/mes = US$ 0.24 | En uso |
| Web Push | Gratis | Implementado; entrega real sin verificar (HTTPS) |
| SMS | No consultado; sin proveedor | Pendiente |
