> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).


# 04 — Modelo de costos por cliente, instancia y dispositivo

El modelo completo (con fórmulas editables) está en `11-modelo-financiero.xlsx`; las cifras de este documento salen de **ese mismo modelo** (verificado: 459 celdas del libro recalculadas con un motor de fórmulas independiente coinciden con el cálculo en código, 0 diferencias, 0 errores de fórmula).

## 1. Qué genera costo y por qué (hallazgos del código)
1. **Las posiciones GPS NO son llamadas a TomTom/HERE.** Los datos de tráfico/clima/rutas viven en el hub y se consultan **por celda geográfica**, no por dispositivo ni por cliente. Una posición GPS solo se compara en la BD de la instancia (`ST_DWithin`, motor de evaluación puro): costo = almacenamiento, no proveedor externo.
2. **El GPS lo aporta la cuenta del cliente con Eje Satelital**: XiGOS consulta su API (≈1 consulta/min por organización, límite del proveedor) con las credenciales del cliente. No hay receptor TCP/UDP propio. Hardware, SIM y suscripción de la plataforma GPS son del cliente (o de Fortox solo si los revende).
3. **El costo de datos de tráfico crece con las celdas únicas cubiertas, no con los clientes**: dos clientes sobre la misma ruta no duplican consultas (el hub las comparte). Saturación del modelo: 450 celdas ⇒ 648,000 llamadas/mes por proveedor.
4. **Cada cliente cuesta una instancia completa** (api + worker + web + BD propia): ~1.25 GB de RAM supuestos ⇒ ≈ US$ 7.86/mes de cómputo aunque el cliente use poco (en servidores grandes de Lightsail).
5. Hoy (2026-11-06) todo corre en un equipo local de desarrollo: no hay factura de infraestructura. Tres celdas (Bogotá, Medellín, Cali) a 30 min = 4,320 llamadas/mes por proveedor: HERE gratis (≤5,000) y TomTom US$ 4.06/mes.

## 2. Estructura de costos
| Tipo | Componentes | Fórmula |
|---|---|---|
| **Fijo global** | Hub (RAM 1.5 GB), DevOps base (20 h/mes x US$ 20/h supuesta), dominio, monitoreo | Servidor mínimo Lightsail 4 GB = US$ 23.54 + `devops_base_h x tarifa` |
| **Fijo por cliente** | Instancia (RAM 1.25 GB, BD propia, disco 2.2 GB), alta única (6–20 h), 0.1 h/mes de DevOps | `RAM x (precio servidor / (0.8 x RAM servidor))` ≈ US$ 7.86 + disco + respaldos |
| **Variable por cliente** | Soporte (1–4 h/mes), correo (SES 0.00016/correo), rutas alternas, WhatsApp (si se implementa), teselas de mapas (si se sustituye OSM) | `consumo x tarifa` |
| **Compartido por cobertura (escalonado)** | HERE + TomTom por celda | `celdas = Ncap x (1 − e^(−clientes x celdas_por_cliente / Ncap))`; `llamadas = celdas x 43,200 / intervalo`; costo escalonado con tramos de doc 03 |
| **Variable por dispositivo** | Almacenamiento de posiciones y respaldos | `posiciones/mes x 250 B x retención/30 x (precio disco + respaldos)` ≈ **US$ 0.0014/dispositivo-mes** (perfil medio) |
| **Pago único** | Alta del cliente; desarrollo pendiente (WhatsApp, Docker verificado, etc.) | horas x tarifa supuesta |

## 3. Posiciones por dispositivo y mes (frecuencias pedidas)
| Intervalo del equipo | 8 h/día | 12 h/día | 24 h/día | ¿XiGOS las guarda? |
|---|---:|---:|---:|---|
| 10 s | 86,400 | 129,600 | 259,200 | Solo 1/min ⇒ 14,400 / 21,600 / 43,200 |
| 30 s | 28,800 | 43,200 | 86,400 | Solo 1/min |
| 60 s | 14,400 | 21,600 | 43,200 | Todas |
Supuesto explícito: 30 días/mes; el límite de 1 consulta/min es del proveedor Eje Satelital (documentación Notion citada en `providers/README.md`), no de XiGOS. Almacenamiento: 250 B por posición (**estimado, no medido**), retención 30 días ⇒ 24 h/día a 1/min = **10.8 MB por dispositivo-mes**; 1,000 dispositivos = 10.8 GB.

## 4. Costos por escenario de cliente (perfil Medio, arquitectura A, TomTom+HERE)
Parámetros del perfil Medio: 20 dispositivos, 12 h/día, 6 celdas por cliente, 8 usuarios, 600 correos y 500 rutas por mes.
| Situación | Dispositivos | Costo tecnológico USD/mes (infra+proveedores) | + soporte y DevOps supuestos USD/mes | Total USD/mes | COP/mes |
|---|---:|---:|---:|---:|---:|
| 1 cliente(s) | 20 | 47.94 | 442.00 | 489.94 | 1,581,659 |
| 5 cliente(s) | 100 | 279.38 | 610.00 | 889.38 | 2,871,142 |
| 10 cliente(s) | 200 | 561.12 | 820.00 | 1,381.12 | 4,458,611 |
| 100 cliente(s) | 2000 | 3,115.55 | 4,600.00 | 7,715.55 | 24,907,814 |

**Costo de un cliente según su cantidad de dispositivos** (cliente adicional sobre una base de 10 clientes, perfil Medio; solo cuenta lo que varía con dispositivos: almacenamiento, respaldos y las celdas que el cliente cubre no cambian con ellos):
| Dispositivos del cliente | Costo de almacenamiento y respaldos USD/mes | Costo de proveedores externos por los dispositivos | Costo de instancia (independiente de los dispositivos) USD/mes |
|---|---:|---:|---:|
| 5 | 0.007 | 0 (las posiciones no consultan a TomTom/HERE) | ≈ 8.08 |
| 10 | 0.014 | 0 (las posiciones no consultan a TomTom/HERE) | ≈ 8.08 |
| 20 | 0.029 | 0 (las posiciones no consultan a TomTom/HERE) | ≈ 8.08 |
| 50 | 0.072 | 0 (las posiciones no consultan a TomTom/HERE) | ≈ 8.08 |

Conclusión de la fórmula: **el costo marginal XiGOS de un dispositivo adicional es ≈ US$ 0.0014/mes (despreciable); lo que cuesta de verdad es el CLIENTE (instancia + soporte) y la cobertura geográfica.** El costo real del dispositivo (equipo, SIM, plataforma GPS) es del cliente y está **sin cotizar**.

## 5. Fórmulas de cálculo (equivalentes a las del Excel)
- `Celdas únicas = Ncap · (1 − exp(−Clientes · CeldasPorCliente / Ncap))`
- `Llamadas/mes (por proveedor) = Celdas · 43 200 / IntervaloMin`
- `HERE = Σ tramos(llamadas − gratis) · tarifa/1000` ; `TomTom = Σ tramos · tarifa/1000 · EURUSD`
- `Rutas a proveedor = Clientes · rutas/cliente · (1 − aciertos de caché)`; excedente sobre ORS gratis (60,000/mes) y TomTom gratis (20,000) se paga a TomTom Routing (EUR 1.00/1,000)
- `Posiciones/mes = Dispositivos · Horas/día · 3600 · 30 / max(intervalo, 60 s)`
- `GB posiciones = Posiciones · 250 B · Retención/30 / 1e9`
- `Respaldos S3 = GB datos · 2.8 · US$ 0.0405`
- Arquitectura A: `RAM necesaria = 1.5 + Clientes·1.25` → escalón de Lightsail con 80 % de uso
- Arquitectura B/C: servidores `t3.large` de 8 GiB (aplicación sin BD) + RDS `db.t4g.large` por cada 25 bases
- `Costo total mensual = Infraestructura + Tráfico + Ruteo + Correo + WhatsApp + Teselas + Soporte + DevOps`
- `Precio mínimo = Costo / (1 − margen − comisión)`
