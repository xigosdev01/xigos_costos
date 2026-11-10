> Consulta realizada el **2026-11-10**. Precios en USD sin IVA, lista bajo demanda, sin descuentos. Mes = 730 horas (igual que el resto del estudio). Región de referencia: **São Paulo** en las tres nubes (AWS `sa-east-1`, Google Cloud `southamerica-east1`, Azure `brazilsouth`).

**Leyenda de confianza** (igual que el doc 03): ALTA = tarifa leída de la fuente oficial; MEDIA = dato oficial procesado por un tercero o con un supuesto de unidad; BAJA = agregador de terceros o cifra redondeada; PENDIENTE = no se pudo verificar hoy.

# 13 — Comparativa de nubes: AWS, Google Cloud y Azure

## 1. Resumen para decidir

- **Azure y Google Cloud ya están en la calculadora** (selector «Nube»). Azure se leyó de su API pública oficial de precios. En Google Cloud, la base de datos (Cloud SQL), el balanceador, Cloud Run, los registros, DNS, secretos, Artifact Registry y el tráfico entre zonas se leyeron **directamente de las páginas oficiales de Google con región São Paulo** (con un navegador automatizado y clics reales sobre el menú de región); las máquinas, discos, NAT y almacenamiento vienen de una tabla abierta basada en la API oficial (MEDIA) y tres de sus cifras coinciden con las páginas oficiales.
- **Ninguna de las tres tiene región en Colombia** (no se encontró ninguna; fuente secundaria). La más cercana en las tres es São Paulo; también hay región en México (Azure `mexicocentral`, Google `northamerica-south1`). La latencia hacia Colombia **no se midió**.
- **La forma A (un solo servidor) de AWS Lightsail no tiene equivalente empaquetado** en Google ni Azure. Al armar el equivalente con piezas sueltas, sale unas **2,4 a 3,2 veces más cara** (sección 4). Es el hallazgo que más pesa.
- **Descuentos por compromiso:** en Google, 1 año −37 % y 3 años −55 % (servidor e2-standard-2); en Azure, aprox. −38 % y −60 % (servidor D2s v5, cálculo propio). AWS no se consultó (ver doc 03).

## 2. Qué se verificó y de dónde

### 2.1 Google Cloud — São Paulo
**Dos fuentes.** (1) Máquinas, discos, IP, NAT, salida de datos y almacenamiento: tabla abierta `pricing.yml` del proyecto *google-cloud-pricing-cost-calculator* (Apache 2.0), **generada el 2026-11-05** a partir de la API oficial de facturación de Google (confianza **MEDIA**). Tres de sus cifras se confirmaron contra las páginas oficiales: salida a Internet 0.19, IP sin usar 0.015 y disco SSD 0.255. URL: https://raw.githubusercontent.com/Cyclenerd/google-cloud-pricing-cost-calculator/master/pricing.yml (2) Todo lo demás se leyó **de las páginas oficiales de Google, con región São Paulo (southamerica-east1), el 2026-11-10** (confianza **ALTA**). Esas páginas se dibujan con JavaScript y la API oficial exige llave, así que se abrieron con Edge sin ventana, se eligió «Sao Paulo» en el menú de región con clics reales y se leyeron las tablas.

| Concepto | Unidad | USD | Confianza |
|---|---|---:|---|
| e2-medium (1 CPU compartida, 4 GB) | hora | 0.0531852 (38.83/mes) | MEDIA |
| e2-standard-2 (2 vCPU, 8 GB) | hora | 0.1063704 (77.65/mes) | MEDIA |
| e2-standard-4 (4 vCPU, 16 GB) | hora | 0.2127408 (155.30/mes) | MEDIA |
| e2-standard-8 (8 vCPU, 32 GB) | hora | 0.4254816 (310.61/mes) | MEDIA |
| e2-standard-2 con compromiso 1 año / 3 años | mes | 48.92 / 34.94 | MEDIA |
| Disco persistente balanced / ssd / hdd | GB-mes | 0.15 / 0.255 / 0.06 | MEDIA |
| Copia de disco (snapshot) | GB-mes | 0.08 | MEDIA |
| IP pública en uso / sin usar | hora | 0.005 / 0.015 | MEDIA |
| Cloud NAT: puerta de salida / datos | hora / GB | 0.0448 / 0.045 | MEDIA |
| Salida a Internet (0–1 TB / 1–10 TB / más de 10 TB) | GB | 0.19 / 0.18 / 0.15 | MEDIA (no se verificó si hay cupo gratis mensual) |
| Almacenamiento de objetos Standard (regional) | GB-mes | 0.035 | MEDIA |
| Tráfico entre zonas de la misma región | GB | 0.01 | ALTA (https://cloud.google.com/vpc/network-pricing) |

**Servicios administrados — leídos de las páginas oficiales (región São Paulo, 2026-11-10), confianza ALTA:**
| Concepto | Unidad | USD | Fuente |
|---|---|---:|---|
| Cloud SQL Enterprise (PostgreSQL): vCPU / memoria | hora / GiB-hora | 0.062 / 0.0105 | https://cloud.google.com/sql/pricing |
| Cloud SQL con alta disponibilidad: vCPU / memoria | hora / GiB-hora | 0.1239 / 0.021 | idem |
| Cloud SQL disco SSD / SSD con alta disponibilidad | GiB-hora | 0.000349315 (0.255 al mes) / 0.00069863 (0.51 al mes) | idem |
| Cloud SQL copias de respaldo | GiB-hora | 0.000164384 (0.12 al mes) | idem |
| Servidor de 2 vCPU + 8 GiB (cálculo propio) | hora | 0.208 (151.84/mes); con alta disponibilidad 0.4158 (303.53/mes) | idem |
| Cloud Load Balancing: primeras 5 reglas / regla adicional | hora | 0.025 / 0.01 | https://cloud.google.com/load-balancing/pricing |
| Cloud Load Balancing: datos procesados (entrada y salida) | GiB | 0.012 | idem |
| Cloud Run, CPU siempre asignada (Tier 2): vCPU / memoria | segundo / GiB-segundo | 0.0000216 / 0.0000024 (= 0.07776 / 0.00864 por hora) | https://cloud.google.com/run/pricing (São Paulo está en Tier 2) |
| Cloud Run, facturación por peticiones: vCPU activa / memoria activa | segundo | 0.0000336 / 0.0000035 | idem |
| Cloud Logging: ingesta (50 GiB gratis por proyecto al mes) | GiB | 0.50 | https://cloud.google.com/products/observability/pricing |
| Artifact Registry (primer 0.5 GiB gratis) | GiB-mes | 0.10 | https://cloud.google.com/artifact-registry/pricing |
| Secret Manager: versión activa (primeras 6 gratis) / accesos | mes / 10 mil | 0.06 / 0.03 | https://cloud.google.com/secret-manager/pricing |
| Cloud DNS: zona administrada (primeras 25) / consultas | mes / millón | 0.20 / 0.40 | https://cloud.google.com/dns/pricing |

Dato oficial (doc de Google): una instancia de Cloud SQL con alta disponibilidad **cuesta el doble** que una normal. La cifra anterior de un tercero (Bytebase, ≈ US$ 148 al mes por 2 vCPU y 7,5 GiB) **coincide** con la página oficial (2 × 0.062 + 7.5 × 0.0105 = 0.20275 por hora).

### 2.2 Azure — Brasil Sur
Fuente: API pública oficial de precios de Azure (`https://prices.azure.com/api/retail/prices`), consultada el 2026-11-10. Confianza **ALTA** salvo donde se indica.

| Concepto | Unidad | USD | Nota |
|---|---|---:|---|
| VM B2s (2 vCPU, 4 GB) | hora | 0.0672 (49.06/mes) | Equivale al t3.medium de AWS (mismo precio) |
| VM B2ms (2 vCPU, 8 GB) | hora | 0.134 (97.82/mes) | Equivale al t3.large (0.1344) |
| VM B4ms (4 vCPU, 16 GB) / B8ms (8 vCPU, 32 GB) | hora | 0.269 / 0.538 | |
| VM D2s v5 (2 vCPU, 8 GB, sin «ráfaga») | hora | 0.153 | |
| VM D2s v5 con reserva 1 año / 3 años | total del plazo | 827 / 1,588 | MEDIA: la unidad dice «hora» pero es total del plazo; ≈ −38 % / −60 % frente a pagar por hora (cálculo propio) |
| Disco Standard SSD E4 (32 GiB) / E10 (128 GiB) / E15 (256 GiB) | mes | 4.48 / 17.92 / 35.84 | Tamaños fijos |
| Disco Premium SSD P10 (128 GiB) / P15 (256 GiB) | mes | 34.05 / 65.67 | |
| PostgreSQL Flexible: Burstable B2ms (2 vCore, 8 GB) | hora | 0.28 | MEDIA: la unidad del medidor es ambigua (¿por servidor o por vCore?); confirmar en la calculadora de Azure |
| PostgreSQL Flexible: General Purpose D2ds v5 (2 vCore) | hora | 0.24 (0.12 por vCore) | MEDIA, misma razón |
| PostgreSQL Flexible: almacenamiento | GB-mes | 0.2185 | |
| PostgreSQL Flexible: copias de respaldo (LRS) | GB-mes | 0.095 | Falta confirmar cuánto va incluido |
| Alta disponibilidad PostgreSQL | — | el servidor de reserva se cobra **a la misma tarifa** que el principal (doc oficial) | Burstable **no admite** alta disponibilidad: hay que usar General Purpose |
| Balanceador Standard (L4) | hora | 0.025 (reglas incluidas) | Región «Global» en la API |
| Application Gateway Standard v2 (L7, equivale a ALB) | hora | 0.40 fijo + 0.008 por unidad de capacidad | Mucho más caro que el ALB de AWS (0.034) |
| NAT Gateway: hora / datos | hora / GB | 0.045 / 0.045 | Región «Global» en la API |
| IP pública estática | hora | 0.005 | |
| Salida a Internet, ruta Microsoft (por defecto): primeros 100 GB / después | GB | 0 / 0.181 | |
| Salida a Internet, «Routing Preference: Internet»: primeros 100 GB / después | GB | 0 / 0.12 | Ruta de menor calidad, a elección |
| Entre zonas | GB | 0.01 | |
| Blob Hot LRS | GB-mes | 0.0326 | |
| Log Analytics: ingesta (primeros 5 GB gratis / después) | GB | 0 / 4.60 | Hay «Basic» 1.00 y «Auxiliary» 0.10 por GB |
| Container Apps (consumo): vCPU activa / inactiva | vCPU-hora | 0.0864 / 0.0108 | Cobra por uso real; los cupos gratuitos no se verificaron |
| Container Apps: memoria | GiB-hora | 0.0108 | |
| Container Instances: vCPU / memoria | hora / GB-hora | 0.081 / 0.00889 | |
| Container Registry Standard | día | 0.6666 (≈ 20.3/mes) | |
| DNS zona pública (primeras 25) / privada | mes | 0.50 / 0.50 | |
| Key Vault Standard: operaciones con secretos | 10 mil | 0.03 | No cobra por guardar cada secreto |

### 2.3 Garantías de disponibilidad (SLA) y alta disponibilidad
| Nube | Dato | Fuente | Confianza |
|---|---|---|---|
| AWS EC2 | 99.99 % si hay 2 o más zonas; 99.5 % por instancia individual | https://aws.amazon.com/compute/sla/ (actualizada 2022-05-25) | ALTA |
| AWS RDS | Multi-AZ: créditos desde 99.95 %; una sola instancia: desde 99.5 % | https://aws.amazon.com/rds/sla/ (actualizada 2024-01-22) | ALTA |
| Azure PostgreSQL | 99.99 % con alta disponibilidad entre zonas; 99.95 % en una sola zona; 99.9 % sin alta disponibilidad | https://learn.microsoft.com/en-us/azure/reliability/reliability-database-postgresql | ALTA |
| Azure VM | 99.95 % con 2 o más VM en un conjunto de disponibilidad (oficial). Una sola VM: 99.9 % con discos Premium SSD o Ultra, 99.5 % con Standard SSD y 95 % con Standard HDD; 2 o más zonas: 99.99 % | https://learn.microsoft.com/en-us/azure/virtual-machines/availability (conjunto de disponibilidad); copia archivada y azure.cn del SLA (una sola VM y zonas) | ALTA / MEDIA (copias no vigentes de Microsoft) |
| Google Cloud SQL | El SLA **solo cubre instancias con alta disponibilidad**; las de una sola zona y las de CPU compartida **están excluidas**. Cambio de servidor ≈ 60 s | https://cloud.google.com/sql/sla y doc de alta disponibilidad | ALTA (cobertura); el porcentaje no se extrajo |
| Google Compute Engine | 99.99 % con instancias en varias zonas; 99.9 % una sola instancia (familias distintas de memoria optimizada); 99.95 % una sola instancia de memoria optimizada; balanceador 99.99 % (modificado 2026-10-14) | https://cloud.google.com/compute/sla | ALTA |

### 2.4 Regiones cercanas
- **Azure** (lista oficial): Brazil South (São Paulo, 3 zonas), Chile Central (Santiago, 3 zonas), Mexico Central (Querétaro, 3 zonas). Sin Colombia.
- **Google Cloud:** en la tabla de precios aparecen `southamerica-east1` (São Paulo), `southamerica-west1` (Santiago) y `northamerica-south1` (México). Sin Colombia.
- **AWS:** São Paulo es la región usada. Una «Local Zone» en Bogotá aparece como **planeada** y las fuentes se contradicen sobre su estado: no usar como dato.
- Fuente secundaria que dice que ninguna de las tres tiene región en Colombia: https://zop.dev/cloud-cost-optimization/colombia

### 2.5 Créditos gratuitos
- **Google Cloud:** la página oficial ofrece «US$ 300 en crédito gratis para clientes nuevos» (duración de 90 días según fuentes de terceros; el cupo «siempre gratis» de e2-micro es solo en regiones de EE. UU.). Confianza MEDIA.
- **Azure:** «12 meses gratis» de ciertos servicios y «65+ servicios siempre gratis» para clientes nuevos; hay que pasar a pago por uso en 30 días para conservar los 12 meses. El monto del crédito no figura en la página leída. Confianza MEDIA.
- **AWS:** ver doc 03/10 (6 meses o hasta agotar créditos; validado 2026-10-30).

## 3. Equivalencias para la calculadora

| Forma de alojar | AWS (hoy) | Google Cloud (equivalente propuesto) | Azure (equivalente propuesto) |
|---|---|---|---|
| **A** Un servidor, BD en contenedor | Lightsail (paquetes 4/8/16/32 GB) | Servidor e2 (medium 4 GB; standard-2/4/8 = 8/16/32 GB) + disco balanced + IP | VM B2s/B2ms/B4ms/B8ms (4/8/16/32 GB) + disco Standard SSD + IP |
| **B** Servidores + BD administrada + balanceador | EC2 + RDS + ALB | e2 + Cloud SQL + Cloud Load Balancing | VM + PostgreSQL Flexible + Balanceador Standard (L4) o Application Gateway (L7) |
| **C** B en 2 zonas con BD en alta disponibilidad y NAT | 2× EC2, RDS Multi-AZ, NAT | 2× e2, Cloud SQL alta disponibilidad (×2), Cloud NAT | 2× VM, PostgreSQL con alta disponibilidad (General Purpose, ×2), NAT Gateway |
| **D** Contenedores administrados + BD | ECS Fargate + RDS | Cloud Run + Cloud SQL | Container Apps + PostgreSQL Flexible |

## 4. Comparativas calculadas (cálculo propio con las tarifas de arriba)

**Equivalente de la forma A, un servidor con 8 GB y unos 160 GB de disco, por mes:**
| Nube | Servidor | Disco | IP | Total |
|---|---:|---:|---:|---:|
| AWS Lightsail 8 GB (incluye 160 GB e IPv4, doc 03) | 43.16 | incluido | incluida | **43.16** |
| Google e2-standard-2 | 77.65 | 24.00 (160 GB × 0.15) | 3.65 | **105.30** |
| Azure B2ms | 97.82 | 35.84 (E15 de 256 GiB) | 3.65 | **137.31** |

**Con 4 GB y unos 80 GB de disco:** Lightsail 23.54 · Google e2-medium 38.83 + 12.00 + 3.65 = **54.48** · Azure B2s 49.06 + 17.92 (E10) + 3.65 = **70.63**.

**Aviso:** los servidores no rinden igual (Lightsail, e2-medium y la serie B de Azure son de CPU compartida o «de ráfaga»; e2-standard-2 no). Hace falta una prueba de carga real antes de afirmar equivalencia.

**Servidor de 2 vCPU y 8 GB para las formas B/C, por mes:** AWS t3.large 98.11 · Google e2-standard-2 77.65 · Azure B2ms 97.82.

**Base de datos de 2 vCPU y 8 GB, una sola zona, solo servidor, por mes:** AWS RDS db.t4g.large 200.75 · Azure General Purpose D2ds v5 175.20 (MEDIA) · Azure Burstable B2ms 204.40 (MEDIA) · Google Cloud SQL 151.84 (ALTA). Con alta disponibilidad, Google y Azure cobran el doble (documentado por ambos). Disco de la base: AWS 0.219 · Azure 0.2185 · Google 0.255 por GB-mes (el doble con alta disponibilidad).

**Piezas de red, por unidad:**
| Pieza | AWS | Google Cloud | Azure |
|---|---:|---:|---:|
| Puerta de salida NAT, por hora | 0.093 | 0.0448 | 0.045 |
| NAT, datos por GB | 0.093 | 0.045 | 0.045 |
| Salida a Internet, por GB (primer tramo) | 0.25 | 0.19 | 0.181 (100 GB gratis) |
| Almacenamiento de objetos, GB-mes | 0.0405 | 0.035 | 0.0326 |
| Balanceador, por hora fija | 0.034 (ALB) | 0.025 (primeras 5 reglas; más 0.012 por GiB procesado) | 0.025 (L4) / 0.40 (L7) |
| Tráfico entre zonas, por GB | 0.01 | 0.01 | 0.01 |
| Registros, por GB recibido | 0.90 (CloudWatch) | 0.50 (50 GiB gratis por proyecto) | 4.60 (5 GB gratis; Basic 1.00) |
| IP pública, por hora | 0.005 | 0.005 | 0.005 |

## 5. Pros y contras (solo con base en lo verificado)

### AWS (la actual)
- **A favor:** Lightsail es la opción de un servidor mucho más económica de las tres (sección 4). Ya está modelada y validada en la calculadora. EC2 99.99 % entre zonas.
- **En contra:** la salida a Internet y el NAT son los más caros de los tres. Una sola instancia EC2 solo garantiza 99.5 %.

### Google Cloud
- **A favor:** servidor e2-standard-2 el más económico de los tres para las formas B/C (77.65). NAT y salida a Internet más baratos que AWS. Descuentos de compromiso claros (−37 % y −55 %). Crédito de bienvenida de US$ 300.
- **A favor (adicional):** base de datos Cloud SQL (151.84/mes por 2 vCPU y 8 GB) más económica que RDS (200.75); registros a 0.50/GB con 50 GiB gratis; Compute Engine garantiza 99.9 % incluso con una sola instancia.
- **En contra:** el SLA de Cloud SQL **no cubre** una instancia sin alta disponibilidad, y la alta disponibilidad **duplica** el costo. No existe un servicio como Lightsail: la forma A cuesta unas 2,4 veces más. Máquinas, discos y NAT dependen de una tabla abierta (MEDIA), no de la página oficial.

### Azure
- **A favor:** API oficial de precios completa y verificable. Alta disponibilidad de PostgreSQL con SLA publicado (99.99 % entre zonas). Salida a Internet con 100 GB gratis al mes y la más económica por GB tras ellos. Región también en Chile y México. «12 meses gratis» para cuentas nuevas.
- **En contra:** la forma A cuesta unas 3,2 veces la de Lightsail. El balanceador de capa 7 (Application Gateway) cuesta US$ 0.40/hora fija (unos 292/mes) frente a 0.034 del ALB. La alta disponibilidad de PostgreSQL no existe en Burstable y se cobra el servidor de reserva completo. Los registros (Log Analytics) a US$ 4.60/GB son los más caros.

### Para las tres
- **Ninguna tiene región en Colombia:** la latencia desde Colombia a São Paulo debe medirse.
- La aplicación corre con Docker Compose y PostgreSQL, así que en principio es portable, pero **falta confirmar con el equipo de desarrollo** que no use servicios exclusivos de AWS (por ejemplo, Amazon SES para correo o S3 para respaldos). El código de la plataforma no está en este repositorio.

## 6. Pendientes (no se inventó nada: así se cierran)
1. **Google Cloud: máquinas, discos, NAT y almacenamiento** se leyeron de una tabla abierta basada en la API oficial (MEDIA). Se pueden subir a ALTA leyendo https://cloud.google.com/compute/all-pricing con el mismo método (navegador y menú de región).
2. **Azure VM: SLA de una sola VM**: el 99.9 % (Premium SSD) y 99.5 % (Standard SSD) proceden de copias archivadas/azure.cn; confirmar en el documento vigente de Microsoft.
3. **Azure PostgreSQL:** confirmar con la calculadora de Azure si los precios 0.28 (B2ms) y 0.24 (D2ds v5) son por servidor o por vCore; confirmar respaldos incluidos.
4. **Azure Container Apps:** cupos gratuitos mensuales (hoy se supone siempre activo, que es la cota máxima).
5. **Cupos gratuitos de la cuenta nueva** (créditos de Google y Azure, 12 meses gratis de Azure) y **egreso gratuito** mensual de Google y AWS (el doc 03 solo anota «primer GB gratis»): no se descuentan en la calculadora.
7. **Latencia real** São Paulo ↔ Colombia en cada nube (prueba con ping/traceroute desde una oficina de Fortox).
8. **IVA/DIAN** sobre servicios de nubes extranjeras (validar con contador, igual que en el doc 03).
9. Confirmar con desarrollo qué servicios exclusivos de AWS usa realmente la aplicación.

## 7. Cómo quedó en la calculadora (implementado)
1. Selector **«Nube»** (AWS · Google Cloud · Azure) en `S.ui.cloud`, con comparación lado a lado y una gráfica nueva.
2. `js/model.js`: tarifas de AWS en `DEF.t`; las de Google Cloud y Azure en `DEF.tc.gcp` y `DEF.tc.azure` (sobrescriben las claves de infraestructura). `calc()` usa `effT(s)` según `s.ui.cloud` o `opt.cloud`. En la forma A de Google y Azure se cobra la transferencia de salida (Lightsail la incluye).
3. `js/clouds.js`: nombres, fuentes, confianza y pendientes por nube. Los textos de las pantallas dependen de la nube elegida.
4. Un valor marcado PENDIENTE contaría 0 (no «gratis»). Hoy ninguna nube tiene precios de infraestructura pendientes; sí hay menor confianza en los puntos listados en la sección 6.
5. Cómo se leyeron las páginas de Google: Edge sin ventana controlado por su protocolo de depuración; clic real en el menú de región; lectura de las tablas. Los scripts de apoyo no se guardaron en el repositorio.
