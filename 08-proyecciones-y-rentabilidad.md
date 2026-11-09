> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).

**Leyenda de confianza:** ALTA = tarifa oficial leída el día de la consulta; MEDIA = oficial pero con un supuesto de unidad/alcance; BAJA = revendedor, estimación o supuesto del autor; PENDIENTE = no público, requiere cotización.

# 08 — Proyecciones de escalabilidad y rentabilidad

Parámetros de los tres perfiles (supuestos; **no hay mediciones reales de consumo**, ver doc 10):
| Parámetro | Bajo | Medio | Alto | Justificación |
|---|---:|---:|---:|---|
| cells_pc | 3 | 6 | 12 | Celdas de 0,25° que cubre cada cliente (6 = ruta Bogotá-Zipaquirá según CLAUDE.md). |
| devices | 5 | 20 | 60 | Dispositivos GPS por cliente. Sin dato real. |
| hours_day | 8 | 12 | 24 | Horas diarias con dispositivo reportando. |
| gps_nominal | 60 | 30 | 10 | Intervalo de transmisión del dispositivo. XiGOS solo lee 1 consulta/min (límite Eje Satelital) y guarda máx. 1 posición/min. |
| users | 3 | 8 | 20 | Usuarios del panel. |
| tiles_pu | 1500 | 3000 | 6000 | Teselas de mapa cargadas por usuario y mes. Supuesto. |
| emails | 200 | 600 | 1500 | Aprobaciones, distribución y avisos. |
| wa_msgs | 100 | 500 | 1000 | Mensajes WhatsApp si se implementa (todos plantilla de utilidad). |
| route_calls | 100 | 500 | 2000 | Rutas alternas solicitadas al hub (antes de caché). |
| support_h | 1 | 2 | 4 | Soporte técnico por cliente. Supuesto. |
| onboard_h | 6 | 12 | 20 | Alta de cliente: instancia, usuarios, dispositivos. Supuesto. |

Configuración de las tablas: **Arquitectura A (Lightsail), HERE + TomTom (como hoy), sin WhatsApp ni teselas de pago**, tarifa de soporte supuesta US$ 20/h. «Infra A» ya incluye disco y respaldos. «Total» = tecnología + soporte + DevOps; la parte puramente tecnológica (columna Infra+Tráfico+Otros) es el **costo duro**; soporte/DevOps son **supuestos** (en escalas altas pesan más que la tecnología).

## 1. Perfil Bajo
| Clientes | Disp. | Celdas | Llamadas tráfico/mes (c/prov.) | Datos GB | Infra A | Tráfico | Otros | Soporte+DevOps | **Total USD/mes** | USD/cliente | USD/disp. | Total USD/año | Total COP/mes |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 5 | 3 | 4,306 | 2 | 23.79 | 4.03 | 0.03 | 422.00 | **449.86** | 449.86 | 89.97 | 5,398 | 1,452,251 |
| 5 | 25 | 15 | 21,244 | 11 | 83.68 | 89.29 | 0.16 | 510.00 | **683.13** | 136.63 | 27.33 | 8,198 | 2,205,306 |
| 10 | 50 | 29 | 41,791 | 22 | 163.43 | 195.17 | 0.32 | 620.00 | **978.91** | 97.89 | 19.58 | 11,747 | 3,160,189 |
| 25 | 125 | 69 | 99,480 | 55 | 328.11 | 492.44 | 0.80 | 950.00 | **1,771.35** | 70.85 | 14.17 | 21,256 | 5,718,363 |
| 50 | 250 | 128 | 183,688 | 111 | 495.31 | 926.36 | 1.60 | 1,500.00 | **2,923.27** | 58.47 | 11.69 | 35,079 | 9,437,064 |
| 100 | 500 | 219 | 315,306 | 222 | 829.70 | 1,536.56 | 3.20 | 2,600.00 | **4,969.46** | 49.69 | 9.94 | 59,634 | 16,042,708 |
| 250 | 1,250 | 365 | 525,609 | 554 | 2,154.71 | 2,496.17 | 8.00 | 5,900.00 | **10,558.88** | 42.24 | 8.45 | 126,707 | 34,086,810 |
| 500 | 2,500 | 434 | 624,883 | 1,109 | 4,148.51 | 2,949.16 | 16.00 | 11,400.00 | **18,513.67** | 37.03 | 7.41 | 222,164 | 59,766,942 |
| 1000 | 5,000 | 449 | 647,175 | 2,218 | 8,136.11 | 3,050.88 | 32.00 | 22,400.00 | **33,618.99** | 33.62 | 6.72 | 403,428 | 108,530,840 |

## 2. Perfil Medio
| Clientes | Disp. | Celdas | Llamadas tráfico/mes (c/prov.) | Datos GB | Infra A | Tráfico | Otros | Soporte+DevOps | **Total USD/mes** | USD/cliente | USD/disp. | Total USD/año | Total COP/mes |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 20 | 6 | 8,583 | 2 | 23.80 | 24.04 | 0.10 | 442.00 | **489.94** | 489.94 | 24.50 | 5,879 | 1,581,659 |
| 5 | 100 | 29 | 41,791 | 12 | 83.73 | 195.17 | 0.48 | 610.00 | **889.38** | 177.88 | 8.89 | 10,673 | 2,871,142 |
| 10 | 200 | 56 | 80,888 | 23 | 163.53 | 396.63 | 0.96 | 820.00 | **1,381.12** | 138.11 | 6.91 | 16,573 | 4,458,611 |
| 25 | 500 | 128 | 183,688 | 58 | 328.36 | 926.36 | 2.40 | 1,450.00 | **2,707.12** | 108.28 | 5.41 | 32,485 | 8,739,298 |
| 50 | 1,000 | 219 | 315,306 | 115 | 495.82 | 1,536.56 | 4.80 | 2,500.00 | **4,537.17** | 90.74 | 4.54 | 54,446 | 14,647,177 |
| 100 | 2,000 | 331 | 477,189 | 231 | 830.72 | 2,275.23 | 9.60 | 4,600.00 | **7,715.55** | 77.16 | 3.86 | 92,587 | 24,907,814 |
| 250 | 5,000 | 434 | 624,883 | 577 | 2,157.26 | 2,949.16 | 24.00 | 10,900.00 | **16,030.42** | 64.12 | 3.21 | 192,365 | 51,750,369 |
| 500 | 10,000 | 449 | 647,175 | 1,154 | 4,153.61 | 3,050.88 | 98.24 | 21,400.00 | **28,702.73** | 57.41 | 2.87 | 344,433 | 92,659,890 |
| 1000 | 20,000 | 450 | 647,999 | 2,308 | 8,146.32 | 3,054.64 | 285.81 | 42,400.00 | **53,886.76** | 53.89 | 2.69 | 646,641 | 173,960,468 |

## 3. Perfil Alto
| Clientes | Disp. | Celdas | Llamadas tráfico/mes (c/prov.) | Datos GB | Infra A | Tráfico | Otros | Soporte+DevOps | **Total USD/mes** | USD/cliente | USD/disp. | Total USD/año | Total COP/mes |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 60 | 12 | 17,052 | 3 | 23.86 | 67.68 | 0.24 | 482.00 | **573.79** | 573.79 | 9.56 | 6,885 | 1,852,335 |
| 5 | 300 | 56 | 80,888 | 14 | 84.03 | 396.63 | 1.20 | 810.00 | **1,291.87** | 258.37 | 4.31 | 15,502 | 4,170,481 |
| 10 | 600 | 105 | 151,678 | 28 | 164.14 | 761.42 | 2.40 | 1,220.00 | **2,147.96** | 214.80 | 3.58 | 25,775 | 6,934,161 |
| 25 | 1,500 | 219 | 315,306 | 71 | 329.89 | 1,536.56 | 6.00 | 2,450.00 | **4,322.45** | 172.90 | 2.88 | 51,869 | 13,953,997 |
| 50 | 3,000 | 331 | 477,189 | 142 | 498.88 | 2,275.23 | 12.00 | 4,500.00 | **7,286.11** | 145.72 | 2.43 | 87,433 | 23,521,455 |
| 100 | 6,000 | 419 | 602,975 | 285 | 836.85 | 2,849.19 | 46.33 | 8,600.00 | **12,332.37** | 123.32 | 2.06 | 147,988 | 39,812,089 |
| 250 | 15,000 | 449 | 647,175 | 712 | 2,172.57 | 3,050.88 | 249.81 | 20,900.00 | **26,373.25** | 105.49 | 1.76 | 316,479 | 85,139,722 |
| 500 | 30,000 | 450 | 647,999 | 1,424 | 4,184.23 | 3,054.64 | 588.93 | 41,400.00 | **49,227.80** | 98.46 | 1.64 | 590,734 | 158,920,132 |
| 1000 | 60,000 | 450 | 648,000 | 2,848 | 8,207.55 | 3,054.64 | 1,267.18 | 82,400.00 | **94,929.37** | 94.93 | 1.58 | 1,139,152 | 306,456,703 |

## 4. Costo marginal (promedio de cada tramo, perfil Medio)
| Tramo | Marginal por cliente USD/mes (total) | de ello, tecnológico | Marginal por dispositivo USD/mes |
|---|---:|---:|---:|
| 1 → 5 | 99.86 | 57.86 | 4.99 |
| 5 → 10 | 98.35 | 56.35 | 4.92 |
| 10 → 25 | 88.40 | 46.40 | 4.42 |
| 25 → 50 | 73.20 | 31.20 | 3.66 |
| 50 → 100 | 63.57 | 21.57 | 3.18 |
| 100 → 250 | 55.43 | 13.43 | 2.77 |
| 250 → 500 | 50.69 | 8.69 | 2.53 |
| 500 → 1000 | 50.37 | 8.37 | 2.52 |
Marginal «de ello tecnológico» a 100→250 clientes ≈ US$ 13.43: **la infraestructura (instancia ≈ US$ 8) domina el marginal; los proveedores de datos casi dejan de crecer porque las celdas están compartidas** (a 450 celdas se satura el supuesto de cobertura nacional).

## 5. Estructura de costos (perfil Medio)
| Clientes | % infraestructura | % datos de tráfico+otros proveedores | % soporte y DevOps (supuesto) |
|---:|---:|---:|---:|
| 1 | 5% | 5% | 90% |
| 5 | 9% | 22% | 69% |
| 10 | 12% | 29% | 59% |
| 25 | 12% | 34% | 54% |
| 50 | 11% | 34% | 55% |
| 100 | 11% | 30% | 60% |
| 250 | 13% | 19% | 68% |
| 500 | 14% | 11% | 75% |
| 1000 | 15% | 6% | 79% |

## 6. Rentabilidad: precio mínimo por cliente (perfil Medio)
Precio de venta = Costo / (1 − margen) (margen sobre ventas, no recargo sobre costo: 50 % de margen = precio 2x costo = recargo 100 %). Con comisión de cobro supuesta 3%: Costo / (1 − margen − comisión). IVA 19% sumado al final (validar tratamiento).
| Clientes | Costo/cliente USD | Precio 30 % | Precio 40 % | Precio 50 % | Precio 60 % | Precio 70 % | 50 % + comisión + IVA USD | 50 % + comisión + IVA COP |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 489.94 | 699.92 | 816.57 | 979.88 | 1,224.85 | 1,633.14 | 1,240.49 | 4,004,626 |
| 5 | 177.88 | 254.11 | 296.46 | 355.75 | 444.69 | 592.92 | 450.37 | 1,453,898 |
| 10 | 138.11 | 197.30 | 230.19 | 276.22 | 345.28 | 460.37 | 349.69 | 1,128,882 |
| 25 | 108.28 | 154.69 | 180.47 | 216.57 | 270.71 | 360.95 | 274.17 | 885,086 |
| 50 | 90.74 | 129.63 | 151.24 | 181.49 | 226.86 | 302.48 | 229.75 | 741,708 |
| 100 | 77.16 | 110.22 | 128.59 | 154.31 | 192.89 | 257.19 | 195.35 | 630,645 |
| 250 | 64.12 | 91.60 | 106.87 | 128.24 | 160.30 | 213.74 | 162.35 | 524,110 |
| 500 | 57.41 | 82.01 | 95.68 | 114.81 | 143.51 | 191.35 | 145.35 | 469,214 |
| 1000 | 53.89 | 76.98 | 89.81 | 107.77 | 134.72 | 179.62 | 136.44 | 440,453 |

### 6.1 Solo costo duro (sin soporte ni DevOps supuestos)
Como el soporte/DevOps usa una tarifa **supuesta**, este es el suelo que NO depende de ese supuesto (infraestructura + proveedores + correo):
| Clientes | Costo duro/cliente USD | Precio 30 % | Precio 50 % | Precio 70 % | Costo duro por dispositivo USD |
|---:|---:|---:|---:|---:|---:|
| 1 | 47.94 | 68.49 | 95.88 | 159.81 | 2.40 |
| 5 | 55.88 | 79.82 | 111.75 | 186.25 | 2.79 |
| 10 | 56.11 | 80.16 | 112.22 | 187.04 | 2.81 |
| 25 | 50.28 | 71.84 | 100.57 | 167.62 | 2.51 |
| 50 | 40.74 | 58.20 | 81.49 | 135.81 | 2.04 |
| 100 | 31.16 | 44.51 | 62.31 | 103.85 | 1.56 |
| 250 | 20.52 | 29.32 | 41.04 | 68.41 | 1.03 |
| 500 | 14.61 | 20.86 | 29.21 | 48.68 | 0.73 |
| 1000 | 11.49 | 16.41 | 22.97 | 38.29 | 0.57 |

**Punto de equilibrio (linealización con los escenarios de 10 y 100 clientes):** costo variable v ≈ US$ 70.38 por cliente/mes; costo fijo F ≈ US$ 677.29/mes. Con un precio **ilustrativo** de US$ 154.31/cliente (margen 50 % a 100 clientes; no es un precio del producto) el equilibrio se alcanza con **~8 clientes**. El modelo no incluye el desarrollo pendiente ni la amortización del trabajo ya hecho.

## 7. Recomendación de precios (base para planes, no precios definitivos)
- **No vender por debajo de US$ 276.22 por cliente/mes** (10 clientes, margen 50 %), ni de **US$ 699.92** para el primer cliente (un solo cliente soporta todo el costo fijo; con 1–5 clientes el precio de equilibrio por cliente es 2–6 veces el de 100 clientes). Cobrar **cuota de alta** (≥ US$ 240 a tarifa supuesta) para cubrir la instalación.
- Estructura sugerida: **cuota base por cliente (instancia + hub + soporte mínimo)** + **cuota por dispositivo** pequeña (el costo XiGOS por dispositivo es ≈ US$ 0.001; cobrar por dispositivo es una decisión comercial, no de costo) + **excedente de cobertura geográfica** (celdas adicionales del cliente, que sí cuestan: ≈ US$ 7.42 por celda/mes en el rango 5–10 clientes).
- Riesgo cambiario: costos en USD/EUR, ingresos presumiblemente en COP. La TRM de los últimos 3 días fue estable (3,221.19–3,235.59); el riesgo es de mediano plazo y **no se analizó histórico**: incluir cláusula de ajuste o colchón.
- Capacidad de pago del mercado: **sin dato** (no hay precios actuales documentados del producto ni referencias de competidores en este estudio).
