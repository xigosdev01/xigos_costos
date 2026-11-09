> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 01 — Resumen ejecutivo: costos, licencias y escalabilidad de XiGOS

**Hallazgo central:** el costo de XiGOS **no crece con los dispositivos GPS**: cada posición se guarda en la BD de la instancia (≈ US$ 0.0014/dispositivo-mes) y el GPS (equipo, SIM, plataforma) lo paga el cliente a su proveedor (Eje Satelital, **sin tarifa pública**). El costo crece con **(a) cada instancia de cliente** (api + worker + web + BD propia, ≈ US$ 7.86–9.20 de cómputo/mes), **(b) la cobertura geográfica** que el hub debe consultar a HERE/TomTom (por celda, compartida entre clientes) y **(c) el soporte humano** (supuesto: es la partida mayor a escala).

## Respuestas rápidas (perfil Medio: 20 dispositivos/cliente; arquitectura A; precios de lista)

1. **¿Cuánto cuesta operar hoy?** Todo corre en un equipo local de desarrollo: **sin factura de infraestructura** (la electricidad/equipo no se cuantificó). Los proveedores de datos, si las 3 celdas de la demo (Bogotá, Medellín, Cali) estuvieran activas: HERE US$ 0.00 (dentro de los 5,000 gratis) + TomTom US$ 4.06 ≈ **US$ 4.06/mes (COP 13,120)**. Las llaves reales del hub aún no están cargadas (CLAUDE.md), así que el gasto real hoy es ≈ 0.
2. **¿Cuánto cuesta incorporar un cliente?** Instancia ≈ **US$ 7.86–9.20/mes** de cómputo + cobertura propia (≈ US$ 7.42 por celda nueva/mes mientras queden celdas por cubrir; 6 celdas ≈ US$ 44.52) + soporte supuesto (2 h ≈ US$ 40). Marginal total a ~10 clientes: **US$ 81.06/mes** (tecnología: US$ 39.06). Alta única: ≈ US$ 240 (12 h supuestas).
3. **¿Cuánto cuesta un dispositivo GPS adicional?** Para XiGOS: **≈ US$ 0.0014/mes** (almacenamiento y respaldos). El costo real del dispositivo (≈ US$ 69 el equipo de referencia, SIM y plataforma) es del cliente y está **sin cotizar**.
4. **¿Principal costo variable?** Los datos de tráfico de HERE+TomTom hasta ~100 clientes (US$ 2,275/mes a 100 clientes, 29–34 % del total modelado) y la **mano de obra** de soporte a escala. Se satura en ≈ US$ 3,055/mes (450 celdas).
5. **¿Qué proveedor conviene?** **TomTom** (más barato desde ~12 celdas: US$ 1,441 vs 1,613 a 450 celdas, verificado con datos reales). **HERE tiene un riesgo de licencia**: su Base Plan excluye rastreo de activos y rutas para activos.
6. **¿Cuánto costaría AWS (São Paulo)?** Arquitectura A: US$ 164/mes a 10 clientes, 831 a 100, 8,146 a 1,000. B (EC2+RDS): 459 / 2,782 / 24,748. C (alta disponibilidad): 956 / 5,556 / 49,028 (doc 06).
7. **¿WhatsApp?** Meta cobra US$ 0.0008 por mensaje de utilidad en Colombia (US$ 0.0125 si es marketing): **500 mensajes/cliente/mes = US$ 0.40**. El costo real es desarrollo (~100 h supuestas ≈ US$ 2,000) y un BSP opcional **sin precio público**. **No está implementado.**
8. **¿Crecer a 100 / 500 / 1,000 clientes?** (perfil Medio) Costo duro: US$ 3,116 / 7,303 / 11,487 por mes; con soporte supuesto: US$ 7,716 / 28,703 / 53,887 (≈ COP 24,907,814 / 92,659,890 / 173,960,468).
9. **Costos desconocidos:** plan/API de Eje Satelital, SIM/GPS en Colombia, BSP de WhatsApp, términos de HERE/TomTom para activos, licencias comerciales de Open-Meteo/ORS/OpenWeatherMap, Microsoft 365, dominio, IVA sobre servicios del exterior (doc 10).
10. **¿Cuánto cobrar?** Para no perder dinero con el costo modelado (con soporte supuesto): **≥ US$ 276/cliente/mes con 10 clientes (margen 50 %)** y ≥ US$ 154 con 100; para el primer cliente, ≥ US$ 980. Solo sobre costo duro: US$ 112 / 62 (10 / 100 clientes, 50 %). No son precios del producto; no hay precios actuales documentados.

## Costo según dispositivos del cliente (cliente nuevo sobre 10 existentes, tecnología, perfil Medio)
| Dispositivos | Costo tecnológico marginal USD/mes | de ello por los dispositivos |
|---:|---:|---:|
| 5 | 39.05 | 0.007 |
| 10 | 39.06 | 0.014 |
| 20 | 39.06 | 0.029 |
| 50 | 39.08 | 0.072 |
(La diferencia entre filas es casi nula: la cobertura geográfica del cliente y la instancia pesan, no los dispositivos.)

## Tabla ejecutiva — 10 clientes (200 dispositivos), perfil Medio, arquitectura A
| Concepto | USD/mes | USD por cliente | USD por dispositivo GPS | Confianza |
|---|---:|---:|---:|---|
| Infraestructura (cómputo, arq. A) | 160.91 | 16.09 | 0.805 | ALTA (lista AWS) / MEDIA (RAM supuesta) |
| Base de datos | 0.00 | 0.00 | 0.000 | incluida en el cómputo (arq. A); en arq. B sería RDS ≈ US$ 210.18/mes |
| TomTom + HERE (tráfico) | 396.63 | 39.66 | 1.983 | ALTA (tarifas) / MEDIA (celdas supuestas) |
| GPS y conectividad (lado XiGOS) | 0.00 | 0.00 | 0.000 | PENDIENTE: equipo, SIM y plataforma Eje son del cliente, sin cotizar |
| WhatsApp (proyectado, NO incluido) | 4.00 | 0.40 | 0.020 | ALTA (tarifa) / no implementado |
| Almacenamiento (disco extra + respaldos S3) | 2.62 | 0.26 | 0.013 | MEDIA (bytes por fila supuestos) |
| Otros (correo SES, ruteo excedente) | 0.96 | 0.10 | 0.005 | ALTA |
| **TOTAL costo duro (sin WhatsApp)** | **561.12** | **56.11** | **2.806** | ALTA en tarifas; el volumen es supuesto |
| Soporte + DevOps (tarifa SUPUESTA US$ 20/h) | 820.00 | 82.00 | 4.100 | BAJA |
| **TOTAL con soporte** | **1,381.12** | **138.11** | **6.906** | BAJA (por el soporte) |

## Tabla ejecutiva — 100 clientes (2,000 dispositivos)
| Concepto | USD/mes | USD por cliente | USD por dispositivo GPS | Confianza |
|---|---:|---:|---:|---|
| Infraestructura (cómputo, arq. A) | 804.55 | 8.05 | 0.402 | ALTA (lista AWS) / MEDIA (RAM supuesta) |
| Base de datos | 0.00 | 0.00 | 0.000 | incluida en el cómputo (arq. A); en arq. B sería RDS ≈ US$ 1,076.20/mes |
| TomTom + HERE (tráfico) | 2,275.23 | 22.75 | 1.138 | ALTA (tarifas) / MEDIA (celdas supuestas) |
| GPS y conectividad (lado XiGOS) | 0.00 | 0.00 | 0.000 | PENDIENTE: equipo, SIM y plataforma Eje son del cliente, sin cotizar |
| WhatsApp (proyectado, NO incluido) | 40.00 | 0.40 | 0.020 | ALTA (tarifa) / no implementado |
| Almacenamiento (disco extra + respaldos S3) | 26.17 | 0.26 | 0.013 | MEDIA (bytes por fila supuestos) |
| Otros (correo SES, ruteo excedente) | 9.60 | 0.10 | 0.005 | ALTA |
| **TOTAL costo duro (sin WhatsApp)** | **3,115.55** | **31.16** | **1.558** | ALTA en tarifas; el volumen es supuesto |
| Soporte + DevOps (tarifa SUPUESTA US$ 20/h) | 4,600.00 | 46.00 | 2.300 | BAJA |
| **TOTAL con soporte** | **7,715.55** | **77.16** | **3.858** | BAJA (por el soporte) |

## Porcentajes (10 clientes, sobre costo duro)
Infraestructura+almacenamiento: 29%; proveedores externos (tráfico, ruteo, correo): 71%. A 100 clientes: 27% / 73%.

## Riesgos y multiplicadores inesperados
- **Escalones:** servidores (cada ~20 clientes), RDS (cada 25 bases); **lineales:** soporte, correo; **saturan:** datos de tráfico.
- **Multiplicadores de consumo:** cada celda activa cuesta ≈ US$ 7.22 promedio al mes (ambos proveedores, a 100 celdas) y ≈ US$ 6.57 marginal cerca de 450 celdas; **bajar el intervalo a 5 min** (el hub lo permite) multiplica las llamadas x6: a 450 celdas serían US$ 8,354 (HERE) + 7,387 (TomTom) al mes; la cuota gratuita de **ORS (2,000/día)** es compartida por todos los clientes del hub; WhatsApp **marketing cuesta 15.6x utilidad**; transferencia AWS US$ 0.25/GB.
- **Licencias:** HERE (Asset Management excluido), uso comercial de Open-Meteo/ORS/OWM gratis sin términos verificados, OSM puede restringir el uso intensivo.
- **Control actual:** el hub tiene topes diarios por proveedor (preventivos, no alineados con las cuotas reales) y panel de consumo; no hay alertas de presupuesto ni límites por cliente.

## Arquitectura recomendada
**Para empezar (≤ 10 clientes; previsión de 4 en 12 meses):** Arquitectura A, un Lightsail São Paulo de 4–8 GB (US$ 23.54–43.16/mes) con hub + instancias, respaldos a S3; consultar solo **TomTom** al inicio. **Para escalar:** B (EC2 + RDS) cuando se necesite RDS administrado/disponibilidad; **antes** de pasar a B/C medir la RAM real por instancia y evaluar compartir clústeres de BD o multiempresa (ahorro potencial US$ 483/mes a 100 clientes, doc 09).

## Contenido de `audit/cost-analysis/`
02 inventario y arquitectura · 03 fuentes y precios (URL y fecha de cada tarifa) · 04 modelo por cliente · 05 TomTom vs HERE · 06 AWS · 07 WhatsApp · 08 proyecciones y rentabilidad · 09 optimización · 10 supuestos y pendientes · 11 modelo Excel editable (fórmulas verificadas).
