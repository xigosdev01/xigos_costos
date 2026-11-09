> Estudio generado el 2026-11-06. Precios consultados el 2026-11-06. Formato numérico: miles con coma, decimales con punto. USD sin IVA salvo que se diga. TRM 3,228.26 COP/USD (datos.gov.co, 2026-11-06); EUR/USD 1.1165 (BCE, 2026-11-06).


# 09 — Plan de optimización de costos

Ahorros calculados **con el modelo** (perfil Medio, arquitectura A) cambiando un solo parámetro; son escenarios, no mediciones: los supuestos de RAM/capacidad deben validarse. Donde no hay dato, se dice.

| # | Problema detectado | Costo actual estimado | Solución | Ahorro mensual potencial | Costo de implementación | Riesgos | Prioridad |
|---|---|---|---|---|---|---|---|
| 1 | El hub consulta **dos** proveedores de tráfico por celda (HERE + TomTom) | A 450 celdas: US$ 3,050.88/mes | Usar solo TomTom, o HERE solo en corredores críticos | 100 clientes: US$ 1,215.25; 500 clientes: US$ 1,611.32 | Bajo (selector de proveedor ya existe; ~4 h) | Pierde la confirmación cruzada (calidad de la novedad); validar con datos reales antes | **Alta** |
| 2 | Intervalo de 30 min por celda aun de noche/sin viajes | 1,440 llamadas/celda/mes | Intervalo de 60 min o consulta solo celdas con cliente activo/viaje en curso | 100 clientes: US$ 1,088.71; 500: US$ 1,476.53 (60 min en todo) | Bajo (es un parámetro del hub; el panel ya lo edita) | Datos menos frescos; incidentes cortos se pierden | **Alta** |
| 3 | Una instancia completa (api+worker+web+BD ≈ 1.25 GB) por cliente | ≈ US$ 7.86/cliente en infra | Compartir un clúster PostgreSQL por servidor (ya soportado, DEPLOYMENT §1) y/o modo multiempresa empaquetado; si la RAM efectiva por cliente bajara a 0.45 GB | 100 clientes: US$ 482.73; 1,000: US$ 4,988.21 | Medio–alto: medir RAM real; el modo multiempresa existe pero la guía de clientes exige aislamiento por instancia | Menor aislamiento físico (el usuario decidió instancia por cliente); revisar con contratos | Media (decisión de producto) |
| 4 | Chromium en cada `worker`/`api` para PDF | ~0.5 GB de picos por instancia (supuesto) | Servicio de PDF compartido con cola, o generar PDF solo en horario de programación | Incluido en #3; sin dato propio | Medio | Complejidad; latencia | Media |
| 5 | Posiciones guardadas 30 días por defecto | Pequeño: 10.8 GB a 100 clientes | Retención 14 días + agregados históricos | US$ 0.65/mes a 100 clientes (despreciable) | Bajo | Pierde historial de recorridos | Baja |
| 6 | Rutas alternas por cliente | Gratis (ORS) hasta 60,000/mes; excedente TomTom EUR 1.00/1,000 | Caché más agresiva (24 h → hit 80 %) | 1,000 clientes: US$ 167.48 | Bajo | Rutas menos frescas | Media (solo a escala) |
| 7 | Cobertura Ncap | Supuesto 450 celdas | Activar solo celdas con cobertura de un cliente (ya es la regla del hub) y revisar cuántas son realmente necesarias | Si Ncap fuera 300: US$ 472.97/mes a 100 clientes | Nulo | — | Media |
| 8 | Teselas OSM gratis | US$ 0 hoy | **No se ahorra: es un riesgo.** A escala, OSM puede bloquear el uso; reservar presupuesto de proveedor de teselas (TomTom: EUR 0.10/1,000 sobre 200 K gratis) | Costo evitado vs. caída del servicio | Bajo (URL configurable) | Costo a 1,000 clientes medio: ≈ US$ 2,344.65/mes | Alta a futuro |
| 9 | Arquitectura B/C sin necesidad | B cuesta 3.3x A a 100 clientes | Empezar en A; pasar a B solo por requisito de disponibilidad | A 100 clientes: US$ 1,951.55/mes entre A y B | Nulo | RTO largo en A | **Alta** |
| 10 | Sin topes ni alertas de gasto | Riesgo: el hub tiene tope diario por proveedor pero preventivo (HERE 150/día, TomTom 2,000/día) y sin relación con la cuota real | Alinear topes a cuotas verificadas; alerta de presupuesto (AWS Budgets) y panel de consumo por proveedor ya existente | Evita sobrecostos (no cuantificable sin datos) | Bajo | — | **Alta** |
| 11 | Instancias/reservas AWS | — | Savings Plans/instancias reservadas | **No calculado: precios no consultados** | Bajo | Compromiso 1–3 años | Baja hasta tener carga estable |

Recomendación de orden: **#9 + #10 ya**, #1 y #2 tras comparar calidad con datos reales, #3 cuando se mida la RAM real de las imágenes. Mediciones necesarias: ver doc 10.
