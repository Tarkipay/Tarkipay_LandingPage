# Trazabilidad de las 30 historias de usuario

Fuente principal: las 48 fichas detalladas del informe TB2. Los textos siguientes se extrajeron de OOXML sin corregir ni reinterpretar los requisitos. Los identificadores del backlog son otro inventario.

Selección fija: HU-001, HU-002, HU-003, HU-004, HU-005, HU-006, HU-007, HU-008, HU-009, HU-010, HU-011, HU-012, HU-013, HU-025, HU-026, HU-027, HU-028, HU-029, HU-030, HU-031, HU-032, HU-033, HU-034, HU-036, HU-037, HU-039, HU-040, HU-041, HU-042, HU-043.

Resultado local: 94 comprobaciones automatizadas PASS y 0 FAIL; 90 corresponden a CA01–CA03 de 30 HU y 4 son transversales. Veinte HU verificadas dentro del alcance del navegador, diez parciales por dependencias externas. Ninguna cuenta como aceptación final sobre GitHub Pages.

| HU | Nombre | Módulo | Estado | Backlog relacionado |
|---|---|---|---|---|
| HU-001 | Avisos recientes | Avisos y búsqueda | Verificada en navegador local | HU01 Ver avisos recientes (correspondencia funcional; criterios no idénticos) |
| HU-002 | Ver los datos de un aviso | Avisos y búsqueda | Verificada en navegador local | HU06 Ver datos principales juntos (correspondencia funcional; criterios no idénticos) |
| HU-003 | Ver de qué billetera viene el aviso | Avisos y búsqueda | Verificada en navegador local | HU05 Saber origen del aviso (correspondencia funcional; criterios no idénticos) |
| HU-004 | Aclarar qué significa un aviso | Avisos y búsqueda | Verificada en navegador local | HU08 Instrucción de revisión; HU22 Constancia de revisión (correspondencia funcional; criterios no idénticos) |
| HU-005 | Buscar por monto | Avisos y búsqueda | Verificada en navegador local | HU02 Filtrar por importe (correspondencia funcional; criterios no idénticos) |
| HU-006 | Distinguir avisos del mismo monto | Avisos y búsqueda | Verificada en navegador local | HU03 Ver hora asociada; HU20 Operaciones separadas (relación parcial, no equivalencia) |
| HU-007 | Saber qué hacer si falta un aviso | Avisos y búsqueda | Verificada en navegador local | HU08 Instrucción de revisión; HU29 Detectar aviso retrasado (correspondencia funcional; criterios no idénticos) |
| HU-008 | Saber si la lista está al día | Avisos y búsqueda | Parcial por integración externa | HU07 Actualizar lista; HU28 Alerta de conexión (correspondencia funcional; criterios no idénticos) |
| HU-009 | Juntar avisos de distintas billeteras | Avisos y búsqueda | Parcial por integración externa | HU42 Activar fuentes en uso (relación parcial, no equivalencia) |
| HU-010 | No perder avisos seguidos | Avisos y búsqueda | Verificada en navegador local | HU20 Operaciones separadas (correspondencia funcional; criterios no idénticos) |
| HU-011 | Leer el monto antes de entregar | Avisos y búsqueda | Verificada en navegador local | HU06 Ver datos principales juntos; HU19 Detectar diferencias (relación parcial, no equivalencia) |
| HU-012 | Crear el perfil del negocio | Negocio | Parcial por integración externa | HU41 Configurar perfil del negocio (correspondencia funcional; criterios no idénticos) |
| HU-013 | No repetir el mismo aviso | Avisos y búsqueda | Parcial por integración externa | HU20 Operaciones separadas (relación parcial, no equivalencia) |
| HU-025 | Generar un código para el equipo | Equipo y horarios | Verificada en navegador local | HU09 Invitar a vista de consulta (correspondencia funcional; criterios no idénticos) |
| HU-026 | Unirme al negocio con un código | Equipo y horarios | Parcial por integración externa | HU14 Ingreso con cuenta propia (correspondencia funcional; criterios no idénticos) |
| HU-027 | Mostrar solo lo necesario al equipo | Avisos y búsqueda | Verificada en navegador local | HU10 Dar permiso de consulta; HU15 Limitar visibilidad del cobro (correspondencia funcional; criterios no idénticos) |
| HU-028 | Quitar el acceso a un colaborador | Equipo y horarios | Parcial por integración externa | HU11 Retirar acceso (correspondencia funcional; criterios no idénticos) |
| HU-029 | Miembros con acceso | Equipo y horarios | Verificada en navegador local | HU13 Ver accesos activos (correspondencia funcional; criterios no idénticos) |
| HU-030 | Elegir los días y horas de avisos | Equipo y horarios | Parcial por integración externa | HU10 Dar permiso de consulta (relación parcial, no equivalencia) |
| HU-031 | Entrar según mi función | Equipo y horarios | Parcial por integración externa | HU14 Ingreso con cuenta propia; HU46 Transparencia de permisos (relación parcial, no equivalencia) |
| HU-032 | Dar acceso al historial por periodo | Equipo y horarios | Verificada en navegador local | HU10 Dar permiso de consulta; HU15 Limitar visibilidad del cobro (relación parcial, no equivalencia) |
| HU-033 | Revisar pagos por día, semana o mes | Cierre y CSV | Verificada en navegador local | HU34 Filtrar por fecha (correspondencia funcional; criterios no idénticos) |
| HU-034 | Ver cantidad y monto de los avisos | Cierre y CSV | Verificada en navegador local | HU33 Total registrado en el día (correspondencia funcional; criterios no idénticos) |
| HU-036 | Consultar el estado del Box desde la app | Fuentes y TarkiBox | Parcial por integración externa | HU44 Conocer último evento; HU45 Ver medio de operación (relación parcial, no equivalencia) |
| HU-037 | Vincular el Box mediante un código | Fuentes y TarkiBox | Parcial por integración externa | Sin equivalente directo |
| HU-039 | Buscar avisos por hora | Avisos y búsqueda | Verificada en navegador local | HU03 Ver hora asociada; HU34 Filtrar por fecha (relación parcial, no equivalencia) |
| HU-040 | Buscar un aviso por nombre | Avisos y búsqueda | Verificada en navegador local | HU04 Consultar nombre de emisor (correspondencia funcional; criterios no idénticos) |
| HU-041 | Filtrar avisos por billetera | Avisos y búsqueda | Verificada en navegador local | HU05 Saber origen del aviso (relación parcial, no equivalencia) |
| HU-042 | Ver los avisos del día como colaborador | Avisos y búsqueda | Verificada en navegador local | HU10 Dar permiso de consulta; HU12 Ver negocio del aviso (relación parcial, no equivalencia) |
| HU-043 | Ver un desglose por billetera | Cierre y CSV | Verificada en navegador local | HU33 Total registrado en el día; HU34 Filtrar por fecha (relación parcial, no equivalencia) |

## HU-001 Avisos recientes

Como persona que atiende, quiero ver los avisos recientes del negocio para encontrar el del cliente que estoy atendiendo en ese momento.

### Criterios originales

- CA01: Los avisos más nuevos aparecen primero.
- CA02: Cada fila muestra monto y hora si se pudieron leer.
- CA03: Una lista vacía no se presenta como prueba de que nadie pagó.

### Escenarios Gherkin originales

**Avisos recientes**

DADO que llegaron avisos de varios clientes  
CUANDO abro la lista  
ENTONCES veo primero los más nuevos

**Lista vacía**

DADO que el cliente dice que pagó y no veo avisos  
CUANDO abro la lista  
ENTONCES veo que no se detectó ninguno y puedo revisar la billetera

**Dos billeteras**

DADO que recibimos por Yape y Plin  
CUANDO miro los avisos  
ENTONCES puedo distinguir la billetera cuando ese dato está disponible

**Implementación:** Orden por eventAt con receivedAt como respaldo; desempate estable y advertencia de vacío.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Orden cronológico aunque el servicio entregue invertido → PASS.
- CA02: Monto y hora originales conservados → PASS.
- CA03: Sin registros sin inventar pagos → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU01 Ver avisos recientes (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-002 Ver los datos de un aviso

Como persona que atiende, quiero ver el monto, la hora y los demás datos que llegaron en un aviso para compararlos con lo que me dice el cliente.

### Criterios originales

- CA01: El detalle muestra el monto, la hora, el nombre y la billetera solo si se pudieron leer.
- CA02: Los datos que faltan aparecen como «No disponible».
- CA03: Abrir un aviso no lo marca como pago comprobado.

### Escenarios Gherkin originales

**Datos completos**

DADO que el aviso trae monto, hora y nombre  
CUANDO abro su detalle  
ENTONCES veo esos datos juntos

**Falta el nombre**

DADO que la notificación no incluyó el nombre  
CUANDO abro el detalle  
ENTONCES veo «No disponible» en vez de un nombre supuesto

**Varios avisos**

DADO que estoy revisando dos pagos recientes  
CUANDO vuelvo a la lista desde un detalle  
ENTONCES puedo abrir el otro sin perder el orden

**Implementación:** Detalle con campos originales y lectura separada de revisión manual.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (detail); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Detalle conserva campos leídos → PASS.
- CA02: Datos ausentes explícitos → PASS.
- CA03: Abrir no verifica → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU06 Ver datos principales juntos (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-003 Ver de qué billetera viene el aviso

Como persona que atiende, quiero saber si el aviso vino de Yape, Plin u otra billetera para buscar el pago en el lugar correcto cuando tenga una duda.

### Criterios originales

- CA01: El detalle muestra el nombre de la billetera cuando la app puede reconocerla.
- CA02: Si no se reconoce la fuente, se muestra «Billetera no identificada».
- CA03: El nombre de la fuente no se presenta como prueba de que el dinero ingresó.

### Escenarios Gherkin originales

**Yape reconocido**

DADO que el aviso procede de Yape y la app lo reconoce  
CUANDO miro su detalle  
ENTONCES veo Yape como fuente

**Fuente incierta**

DADO que no se pudo identificar la billetera  
CUANDO abro el aviso  
ENTONCES veo que la fuente no está identificada

**Otra billetera**

DADO que el negocio también usa Plin  
CUANDO consulto un aviso de Plin  
ENTONCES veo Plin sin confundirlo con Yape

**Implementación:** Fuentes reconocidas y etiqueta Billetera no identificada; ninguna fuente acredita un ingreso.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (detail); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Yape y Plin conservan origen → PASS.
- CA02: Fuente incierta no se atribuye → PASS.
- CA03: Origen no comprueba ingreso → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU05 Saber origen del aviso (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-004 Aclarar qué significa un aviso

Como persona que atiende, quiero saber que se detectó un aviso, sin confundirlo con una comprobación definitiva del pago.

### Criterios originales

- CA01: La alerta y el detalle se identifican como avisos detectados.
- CA02: Abrir o leer el aviso no cambia su significado.
- CA03: Si hay dudas, la pantalla indica que se puede consultar la billetera receptora.

### Escenarios Gherkin originales

**Aviso nuevo**

DADO que llegó una notificación compatible  
CUANDO abro el aviso  
ENTONCES veo que se detectó una notificación de pago

**Duda sobre el pago**

DADO que el cliente muestra su pantalla pero no encuentro el dinero  
CUANDO consulto el aviso  
ENTONCES no aparece una confirmación de ingreso que la app no puede demostrar

**Aviso leído**

DADO que un compañero ya abrió ese aviso  
CUANDO lo abro también  
ENTONCES sigue siendo un aviso detectado

**Implementación:** Etiquetas de aviso detectado y orientación para revisar la billetera; lectura sin confirmación automática.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (detail); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Registros identificados como avisos → PASS.
- CA02: Leer conserva significado → PASS.
- CA03: Orientación a billetera presente → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU08 Instrucción de revisión; HU22 Constancia de revisión (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-005 Buscar por monto

Como persona que atiende, quiero buscar un aviso por monto para encontrarlo cuando llegaron varios pagos seguidos.

### Criterios originales

- CA01: Puedo ingresar un monto positivo para filtrar los avisos.
- CA02: La lista muestra los avisos que coinciden con ese monto.
- CA03: Puedo quitar el filtro y volver a ver los demás.

### Escenarios Gherkin originales

**Monto encontrado**

DADO que hay avisos por S/ 15 y S/ 20  
CUANDO busco S/ 20  
ENTONCES veo los avisos por S/ 20

**Sin resultados**

DADO que no hay avisos por S/ 20  
CUANDO hago esa búsqueda  
ENTONCES veo que no hubo coincidencias, sin concluir que nadie pagó

**Lista completa**

DADO que terminé de buscar un monto  
CUANDO quito el filtro  
ENTONCES vuelvo a ver todos los avisos

**Implementación:** Validación de monto positivo con dos decimales, coincidencia exacta y limpieza reversible.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Monto positivo; rechaza cero, negativos y precisión inválida → PASS.
- CA02: Coincidencias exactas; búsqueda sin resultados → PASS.
- CA03: Quitar filtro restaura lista → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU02 Filtrar por importe (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-006 Distinguir avisos del mismo monto

Como persona que atiende, quiero ver por separado dos avisos con el mismo monto para compararlos con los clientes que estoy atendiendo.

### Criterios originales

- CA01: Dos avisos distintos del mismo monto aparecen por separado.
- CA02: Cada uno conserva su hora y su nombre, si llegaron esos datos.
- CA03: Si no hay datos suficientes para distinguirlos, la app no elige uno por su cuenta.

### Escenarios Gherkin originales

**Dos avisos iguales**

DADO que llegaron dos avisos distintos por S/ 20  
CUANDO abro la lista  
ENTONCES veo ambos con sus horas

**Pocos datos**

DADO que ambos tienen el mismo monto y no traen nombre  
CUANDO miro sus detalles  
ENTONCES veo lo disponible sin que la app decida a qué cliente corresponde cada uno

**Nombre distinto**

DADO que los dos avisos tienen el mismo monto pero distintos nombres  
CUANDO los comparo  
ENTONCES puedo reconocer la diferencia sin que se mezclen

**Implementación:** Registros independientes por identidad, sin asignación automática de cliente ni venta.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Importes iguales son registros separados → PASS.
- CA02: Nombres y horas propios → PASS.
- CA03: Sin nombre no selecciona ni asocia automáticamente → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU03 Ver hora asociada; HU20 Operaciones separadas (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-007 Saber qué hacer si falta un aviso

Como persona que atiende, quiero que la app me recuerde revisar la billetera cuando el cliente dice que pagó y no veo ningún aviso.

### Criterios originales

- CA01: La lista vacía no afirma que el cliente no pagó.
- CA02: La app indica que se debe consultar la billetera receptora si hace falta comprobar el ingreso.
- CA03: Un aviso que aparece más tarde conserva su hora y no se presenta como un pago nuevo distinto.

### Escenarios Gherkin originales

**Alerta ausente**

DADO que el cliente dice que pagó y no hay aviso  
CUANDO abro la lista  
ENTONCES veo que no se detectó una alerta y que puedo revisar la billetera

**Sin acceso al celular receptor**

DADO que yo no puedo abrir la billetera del dueño  
CUANDO consulto la app  
ENTONCES no me muestra una confirmación inventada

**Aviso tardío**

DADO que el aviso aparece después de que lo busqué  
CUANDO actualizo la lista  
ENTONCES veo la hora del aviso para compararlo con lo ocurrido

**Implementación:** Recepción tardía mediante cola; evento y recepción separados, identidad conservada y reenvío idempotente.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (queue, refresh); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Vacío no equivale a falta de pago → PASS.
- CA02: Sin acceso billetera no inventa confirmación → PASS.
- CA03: Tardío conserva identidad, ambas horas y se deduplica → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU08 Instrucción de revisión; HU29 Detectar aviso retrasado (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-008 Saber si la lista está al día

Como persona que atiende, quiero ver cuándo se actualizó la lista por última vez para saber si podría faltar un aviso reciente.

### Criterios originales

- CA01: Se muestra la hora de la última actualización realizada.
- CA02: Puedo solicitar una nueva actualización.
- CA03: Si falla la conexión, veo una advertencia y la hora anterior.

### Escenarios Gherkin originales

**Actualización correcta**

DADO que tengo internet y hay un aviso nuevo en el servicio  
CUANDO actualizo la lista  
ENTONCES veo el aviso y la nueva hora

**Sin conexión**

DADO que mi teléfono perdió internet  
CUANDO intento actualizar  
ENTONCES veo que la lista puede estar atrasada

**Vuelvo a la app**

DADO que dejé la app abierta hace un rato  
CUANDO regreso a la lista  
ENTONCES veo cuándo fue la última actualización

**Implementación:** Actualización efectiva de cola local, hora inicial desconocida y conservación de última hora válida ante fallo.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (refresh); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Última actualización efectiva persistida → PASS.
- CA02: Actualizar procesa cola → PASS.
- CA03: Fallo conserva hora y cola hasta reintento → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU07 Actualizar lista; HU28 Alerta de conexión (correspondencia funcional; criterios no idénticos).
**Limitaciones:** CA02: se procesa una cola local, sin consultar un servicio remoto real.

## HU-009 Juntar avisos de distintas billeteras

Como administrador, quiero ver en una misma lista los avisos de las billeteras que uso para no estar cambiando de aplicación a cada momento.

### Criterios originales

- CA01: La lista reúne los avisos captados de las fuentes habilitadas.
- CA02: Cada aviso conserva el nombre de su billetera si se reconoce.
- CA03: Una fuente sin permiso o sin notificaciones no se inventa en la lista.

### Escenarios Gherkin originales

**Dos billeteras activas**

DADO que el negocio usa Yape y Plin y ambas enviaron notificaciones compatibles  
CUANDO abro la lista  
ENTONCES veo los avisos juntos con su origen

**Fuente sin avisos**

DADO que hoy no se detectó ningún aviso de Plin  
CUANDO consulto la lista  
ENTONCES no aparecen pagos de Plin inventados

**Solo una fuente**

DADO que por ahora activé únicamente Yape  
CUANDO abro los avisos  
ENTONCES veo los de esa fuente sin tener que configurar otra

**Implementación:** Consolidación de eventos locales de fuentes habilitadas y rechazo de eventos de fuentes desactivadas.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (source, queue, refresh); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Consolidación de dos fuentes activas → PASS.
- CA02: Origen conservado por evento → PASS.
- CA03: Fuente desactivada rechazada sin inventar registros → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU42 Activar fuentes en uso (relación parcial, no equivalencia).
**Limitaciones:** CA01 y CA03: fuentes ficticias habilitadas; no se verifica captura ni permiso Android.

## HU-010 No perder avisos seguidos

Como persona que atiende, quiero encontrar todos los avisos cuando pagan varios clientes casi al mismo tiempo para revisar cada uno con calma.

### Criterios originales

- CA01: Los avisos diferentes se guardan como registros separados.
- CA02: La lista los ordena usando la hora disponible.
- CA03: La llegada de uno nuevo no borra el anterior.

### Escenarios Gherkin originales

**Varios clientes**

DADO que llegaron tres avisos diferentes en pocos segundos  
CUANDO abro la lista  
ENTONCES encuentro los tres por separado

**Aviso nuevo**

DADO que estaba mirando un aviso anterior  
CUANDO llega otro  
ENTONCES el primero sigue disponible

**Mismo monto**

DADO que dos clientes pagaron S/ 15  
CUANDO reviso los avisos seguidos  
ENTONCES veo dos registros con sus horas

**Implementación:** Ráfaga de tres eventos independientes, orden cronológico y conservación de anteriores.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (simulate, refresh); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Tres consecutivos separados → PASS.
- CA02: Orden por marcas temporales → PASS.
- CA03: Nuevos no eliminan anteriores → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU20 Operaciones separadas (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-011 Leer el monto antes de entregar

Como persona que atiende, quiero ver el monto que dice la notificación para compararlo yo mismo con lo que el cliente debía pagar.

### Criterios originales

- CA01: El monto recibido se muestra de forma fácil de leer.
- CA02: La app no pide escribir el precio de la venta para mostrar ese aviso.
- CA03: Si falta el monto, se indica que no se pudo leer.

### Escenarios Gherkin originales

**Monto visible**

DADO que el aviso trae un pago de S/ 20  
CUANDO miro la app  
ENTONCES veo S/ 20 y puedo compararlo con el precio acordado

**Monto ausente**

DADO que la notificación no trae una cantidad legible  
CUANDO abro el aviso  
ENTONCES veo que el monto no está disponible

**Cliente pagó menos**

DADO que el cliente debía pagar S/ 25 y el aviso dice S/ 20  
CUANDO comparo los montos durante la atención  
ENTONCES puedo advertir la diferencia sin tener que registrar la venta

**Implementación:** Monto legible sin registrar una venta; ausencia explícita cuando no pudo leerse.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query, detail); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Monto consultable directamente → PASS.
- CA02: Consultar no exige venta → PASS.
- CA03: Monto ausente no inventado → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU06 Ver datos principales juntos; HU19 Detectar diferencias (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-012 Crear el perfil del negocio

Como dueño de un negocio, quiero crear mi cuenta de administrador y poner los datos básicos del local para reconocerlo cuando invite al equipo y vincule el Box.

### Criterios originales

- CA01: La cuenta nueva queda asociada a un negocio con nombre identificable.
- CA02: Solo el administrador puede cambiar el nombre y los datos de ese negocio.
- CA03: Antes de guardar se piden los datos obligatorios; no se solicitan claves de la billetera.

### Escenarios Gherkin originales

**Alta del negocio**

DADO que me registré como administrador  
CUANDO pongo el nombre del local y guardo  
ENTONCES veo el perfil del negocio en mi cuenta

**Falta el nombre**

DADO que dejé vacío el nombre del negocio  
CUANDO intento crear el perfil  
ENTONCES se me pide completarlo antes de guardar

**Cambio de nombre**

DADO que mi negocio ya está creado  
CUANDO corrijo el nombre desde mi perfil  
ENTONCES el cambio aparece también en las invitaciones nuevas

**Implementación:** Negocios con identificador único y membresía administradora; validación atómica de obligatorios y edición autorizada.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (createBusiness, updateBusiness); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Cuenta ficticia asociada a negocio único nuevo → PASS.
- CA02: Solo administrador modifica → PASS.
- CA03: Obligatorios y actualización atómica → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU41 Configurar perfil del negocio (correspondencia funcional; criterios no idénticos).
**Limitaciones:** CA01 y alta del negocio: relación de cuenta y negocio ficticia; falta registro y autenticación reales.

## HU-013 No repetir el mismo aviso

Como administrador, quiero que un reenvío de la misma notificación no aparezca como otro pago para llevar una cuenta más clara.

### Criterios originales

- CA01: Un aviso conserva un identificador al sincronizarse.
- CA02: Reenviar ese identificador no añade otro registro.
- CA03: Dos avisos realmente diferentes del mismo monto se mantienen separados.

### Escenarios Gherkin originales

**Primer envío**

DADO que la app detectó un aviso nuevo  
CUANDO lo envía al servicio  
ENTONCES se guarda una vez

**Reintento**

DADO que la app vuelve a enviar el mismo aviso tras un corte de red  
CUANDO llega al servicio  
ENTONCES no aparece duplicado en la lista

**Dos clientes**

DADO que hay dos avisos diferentes por S/ 10  
CUANDO se sincronizan  
ENTONCES ambos quedan visibles

**Implementación:** Identificador estable por negocio; reintentos dentro de un lote y entre actualizaciones sin duplicación.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (queue, refresh); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Identidad estable en primer procesamiento → PASS.
- CA02: Reintentos dentro y entre actualizaciones idempotentes → PASS.
- CA03: Mismo importe diferente identidad se conserva → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU20 Operaciones separadas (relación parcial, no equivalencia).
**Limitaciones:** CA01 y escenarios de envío: deduplicación comprobada en servicio local; sincronización remota pendiente.

## HU-025 Generar un código para el equipo

Como administrador, quiero crear un código para que una persona que trabaja conmigo se una al negocio sin compartir mi cuenta.

### Criterios originales

- CA01: Solo el administrador puede crear el código y ver hasta cuándo sirve.
- CA02: El código corresponde a un negocio y a los permisos que el dueño eligió.
- CA03: Un código vencido o ya utilizado no da acceso al negocio.

### Escenarios Gherkin originales

**Código creado**

DADO que quiero incorporar a una vendedora  
CUANDO genero el código y elijo su acceso  
ENTONCES puedo comunicárselo con su vigencia

**Sin permiso**

DADO que entré como colaborador  
CUANDO intento generar un código  
ENTONCES la opción no está disponible para mi cuenta

**Código vencido**

DADO que el código anterior ya venció  
CUANDO creo uno nuevo  
ENTONCES solo el nuevo permite solicitar acceso

**Implementación:** Invitación persistida con negocio, nombre, permisos, turno, vencimiento, uso y revocación; generar no agrega miembro.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (invite, previewInvitation, revokeInvite); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Administración y vencimiento visible → PASS.
- CA02: Código asociado al negocio y permisos; aún no miembro → PASS.
- CA03: Vencido usado y revocado no dan acceso → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU09 Invitar a vista de consulta (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-026 Unirme al negocio con un código

Como colaborador, quiero ingresar el código que me dio el dueño para ver los avisos del negocio desde mi propia cuenta.

### Criterios originales

- CA01: Antes de unirse se muestra el nombre del negocio y el acceso concedido.
- CA02: El código inválido, vencido o utilizado no da acceso a los cobros.
- CA03: La cuenta del colaborador no pide la clave de Yape ni permite entrar como administrador.

### Escenarios Gherkin originales

**Ingreso correcto**

DADO que tengo mi cuenta y recibí un código vigente  
CUANDO lo escribo y acepto unirme  
ENTONCES veo el negocio y sus cobros permitidos

**Código inválido**

DADO que escribí un código que no existe  
CUANDO intento unirme  
ENTONCES veo el error y no accedo a pagos ajenos

**Código de otro negocio**

DADO que el código pertenece a un local distinto  
CUANDO reviso el nombre antes de aceptar  
ENTONCES puedo cancelar sin unirme al local equivocado

**Implementación:** Vista previa de negocio y permisos, cancelar o aceptar; validación repetida al canjear y cuenta colaboradora ficticia.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (previewInvitation, join); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Vista previa y cancelar no concede acceso → PASS.
- CA02: Inválidos vencidos y usados rechazados al canjear → PASS.
- CA03: Canje crea solo colaborador sin administración → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU14 Ingreso con cuenta propia (correspondencia funcional; criterios no idénticos).
**Limitaciones:** CA03 y escenario de ingreso: cuenta propia ficticia; falta registro e inicio de sesión reales.

## HU-027 Mostrar solo lo necesario al equipo

Como dueño, quiero que mis colaboradores vean los datos útiles de cada aviso sin tener acceso a mi cuenta de billetera.

### Criterios originales

- CA01: El colaborador puede ver monto, hora, billetera y nombre cuando se pudieron leer.
- CA02: La app no permite transferir dinero ni abrir la billetera del dueño.
- CA03: Si falta un dato, aparece como no disponible en vez de pedir más acceso.

### Escenarios Gherkin originales

**Consulta habitual**

DADO que una colaboradora tiene acceso al negocio  
CUANDO abre un aviso  
ENTONCES ve los datos disponibles sin abrir la billetera del dueño

**Sin acceso a la billetera**

DADO que el colaborador está viendo los avisos en la app  
CUANDO busca una opción para enviar dinero  
ENTONCES no encuentra ninguna

**Falta un nombre**

DADO que el aviso llegó sin nombre  
CUANDO lo abre el colaborador  
ENTONCES ve que ese dato no está disponible

**Implementación:** Campos de aviso disponibles y ausencias explícitas; sin acceso a transferencias, claves ni billetera del titular.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (detail); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Colaborador obtiene campos permitidos → PASS.
- CA02: Sin operaciones bancarias → PASS.
- CA03: Ausencias no amplían acceso → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU10 Dar permiso de consulta; HU15 Limitar visibilidad del cobro (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-028 Quitar el acceso a un colaborador

Como administrador, quiero retirar el acceso de alguien que ya no trabaja aquí para que deje de recibir alertas y consultar el historial del negocio.

### Criterios originales

- CA01: Antes de retirar el acceso se muestra el nombre de la persona.
- CA02: Tras confirmarlo, deja de recibir nuevas alertas y no puede hacer nuevas consultas.
- CA03: Los avisos del negocio siguen disponibles para el administrador.

### Escenarios Gherkin originales

**Acceso retirado**

DADO que una colaboradora dejó de trabajar en el local  
CUANDO confirmo que quiero quitar su acceso  
ENTONCES deja de recibir alertas y no puede abrir el historial

**Cancelación**

DADO que elegí a la persona equivocada  
CUANDO cancelo antes de confirmar  
ENTONCES su acceso continúa

**Nuevo ingreso**

DADO que esa persona vuelve a trabajar aquí más adelante  
CUANDO le doy un código nuevo  
ENTONCES recupera solo el acceso que le concedo ahora

**Implementación:** Confirmación con nombre, cancelación sin cambios, revocación comprobada en consultas, detalle, ventas, solicitudes y alertas locales.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (revokeMember, query, deliver); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Persona identificada; cancelar conserva acceso → PASS.
- CA02: Confirmar bloquea consultas y futuras alertas simuladas → PASS.
- CA03: Historial conservado y nueva invitación recupera solo alcance nuevo → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU11 Retirar acceso (correspondencia funcional; criterios no idénticos).
**Limitaciones:** CA02: consulta bloqueada y destinatarios locales excluidos; entrega y bloqueo de alertas a celulares reales pendientes.

## HU-029 Miembros con acceso

Como responsable, quiero ver quién puede consultar actualmente los cobros para saber a quién he dado acceso.

### Criterios originales

- CA01: La lista muestra nombre, permiso y estado de cada miembro.
- CA02: Los accesos revocados se distinguen de los vigentes.
- CA03: Solo una persona con permiso de administración puede cambiar ese alcance.

### Escenarios Gherkin originales

**Accesos vigentes**

DADO que dos personas atienden en el negocio  
CUANDO abro la lista del equipo  
ENTONCES veo sus permisos actuales

**Acceso retirado**

DADO que revocamos el permiso de una persona  
CUANDO abro la lista  
ENTONCES ya no figura como acceso vigente

**Horario a la vista**

DADO que dos colaboradores tienen accesos distintos  
CUANDO reviso la lista del equipo  
ENTONCES puedo distinguir quién tiene acceso vigente y qué permisos tiene

**Implementación:** Lista de miembros vigentes y revocados con nombre, rol, alcance y turno; edición restringida en el servicio.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (team, editMember); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Nombre rol permiso estado → PASS.
- CA02: Revocados distintos → PASS.
- CA03: Solo administración cambia alcance o lee lista → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU13 Ver accesos activos (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-030 Elegir los días y horas de avisos

Como administrador, quiero fijar cuándo le llegan las alertas a cada colaborador para no molestarlo cuando no le toca atender.

### Criterios originales

- CA01: El horario se define por persona, días y horas en la zona horaria del negocio.
- CA02: Fuera de ese horario no se envían nuevas alertas a esa persona.
- CA03: Cambiar el horario no borra los pagos anteriores ni amplía el historial permitido.

### Escenarios Gherkin originales

**Turno activo**

DADO que hoy le toca atender a un colaborador y su horario está activo  
CUANDO entra un nuevo aviso  
ENTONCES recibe la alerta en su celular

**Turno cerrado**

DADO que su horario de alertas ya terminó  
CUANDO entra un nuevo aviso  
ENTONCES no recibe la alerta fuera de turno

**Turno modificado**

DADO que cambiaron los turnos de mañana  
CUANDO actualizo el horario de esa persona  
ENTONCES las próximas alertas siguen el horario nuevo

**Implementación:** Edición individual de días e intervalo, zona America/Lima y destinatarios por turno; fin exclusivo y conservación de historial.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (editMember, inShift, deliver); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Horario individual zona negocio validada → PASS.
- CA02: En turno recibe, fuera y límite final no reciben nuevas alertas locales → PASS.
- CA03: Cambiar turno conserva historial y alcance, consulta no depende de estar de turno → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU10 Dar permiso de consulta (relación parcial, no equivalencia).
**Limitaciones:** CA02 y escenarios de turno: destinatarios simulados evaluados en Lima; entrega real al celular pendiente.

## HU-031 Entrar según mi función

Como integrante del negocio, quiero que al iniciar sesión aparezcan las opciones que me corresponden para encontrar mis cobros sin entrar por error a la configuración de otra persona.

### Criterios originales

- CA01: El rol proviene de la cuenta y de los permisos otorgados por el administrador.
- CA02: El administrador ve negocio, Box, equipo e informes; el colaborador solo lo autorizado.
- CA03: Cambiar de pantalla no permite convertirse en administrador.

### Escenarios Gherkin originales

**Entra la dueña**

DADO que mi cuenta es administradora  
CUANDO inicio sesión  
ENTONCES veo las opciones de negocio, equipo y Box

**Entra un trabajador**

DADO que mi cuenta solo tiene permiso de atención  
CUANDO inicio sesión  
ENTONCES veo los cobros autorizados sin opciones de administración

**Otro negocio**

DADO que tengo acceso a dos locales  
CUANDO cambio el negocio seleccionado  
ENTONCES veo sus permisos y cobros por separado

**Implementación:** Permisos derivados de membresía por cuenta y negocio; validación en cada acción y selección explícita de identidad ficticia.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (requireAccess, selectIdentity, selectBusiness); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Rol derivado de relación de cuenta y negocio → PASS.
- CA02: Acciones administrativas rechazan colaborador aunque invoque API → PASS.
- CA03: Cambio de negocio o periodo no eleva rol ni mezcla datos → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU14 Ingreso con cuenta propia; HU46 Transparencia de permisos (relación parcial, no equivalencia).
**Limitaciones:** CA01 y escenarios de inicio de sesión: rol derivado de membresía ficticia; falta autenticación real de cuentas.

## HU-032 Dar acceso al historial por periodo

Como administrador, quiero decidir si un colaborador puede ver solo los pagos del día o también los de la semana y el mes para darle la información que necesita en su trabajo.

### Criterios originales

- CA01: El permiso de hoy está separado del acceso a semana y mes.
- CA02: El colaborador no ve pagos anteriores fuera de su alcance.
- CA03: El administrador puede cambiar el alcance sin alterar los avisos guardados.

### Escenarios Gherkin originales

**Consulta ampliada**

DADO que autoricé a una colaboradora a ver el mes  
CUANDO abre el historial  
ENTONCES puede elegir día, semana o mes

**Consulta limitada**

DADO que su permiso cubre solo el día  
CUANDO intenta abrir pagos del mes  
ENTONCES la app no le muestra ese periodo

**Cambio de acceso**

DADO que la colaboradora ya no necesita revisar la semana  
CUANDO quito ese permiso  
ENTONCES conserva los pagos de hoy y pierde el acceso al periodo anterior

**Implementación:** Alcances hoy, semana y mes; restricciones en lista, detalle, resumen y CSV; cambiar alcance conserva registros.
**Componente y ruta:** #tab-equipo; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (scopeBounds, query, getAviso, csv); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Permisos distintos hoy semana mes → PASS.
- CA02: Periodos ajenos bloqueados en consulta detalle resumen CSV → PASS.
- CA03: Reducir alcance no altera registros → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU10 Dar permiso de consulta; HU15 Limitar visibilidad del cobro (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-033 Revisar pagos por día, semana o mes

Como administrador, quiero consultar lo recibido hoy y en semanas o meses anteriores para aclarar dudas sin buscar uno por uno en el celular.

### Criterios originales

- CA01: La vista permite elegir día, semana, mes o un rango de meses disponibles.
- CA02: El periodo elegido y el número de avisos quedan claros.
- CA03: Un periodo sin registros aparece vacío sin concluir que no hubo pagos.

### Escenarios Gherkin originales

**Mes consultado**

DADO que quiero revisar lo detectado el mes pasado  
CUANDO selecciono ese mes  
ENTONCES veo sus avisos y el periodo consultado

**Sin registros**

DADO que el día elegido no tiene avisos guardados  
CUANDO abro ese día  
ENTONCES veo un estado vacío sin que se inventen pagos

**Semana anterior**

DADO que quiero revisar un cobro de la semana pasada  
CUANDO cambio de hoy a esa semana  
ENTONCES encuentro la lista correspondiente sin perder el filtro de negocio

**Implementación:** Día, semana de lunes a domingo, mes y rango inclusivo de meses; periodos anteriores y vacío orientativo.
**Componente y ruta:** #tab-cierre; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (bounds, query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Día semana mes rango y periodos anteriores → PASS.
- CA02: Rango y cantidad calculados desde datos → PASS.
- CA03: Periodo vacío sin registros inventados → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU34 Filtrar por fecha (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-034 Ver cantidad y monto de los avisos

Como administrador, quiero saber cuántos avisos se detectaron y cuánto suman sus montos para revisar los pagos digitales del día.

### Criterios originales

- CA01: El resumen muestra número de avisos y suma de los montos que pudieron leerse.
- CA02: Un aviso sin monto se cuenta como aviso, pero no añade una cantidad inventada.
- CA03: El resumen aclara que no muestra el saldo real de ninguna billetera.

### Escenarios Gherkin originales

**Resumen de hoy**

DADO que hay cinco avisos con monto conocido  
CUANDO abro el resumen del día  
ENTONCES veo el número de avisos y la suma detectada

**Monto ausente**

DADO que llegó un aviso sin monto legible  
CUANDO consulto el resumen  
ENTONCES cuenta como aviso sin inventar dinero

**Otra semana**

DADO que quiero revisar otro periodo  
CUANDO elijo esa semana  
ENTONCES veo su cantidad y suma como datos de avisos, no como saldo

**Implementación:** Conteo independiente del monto, sumas enteras en céntimos y revisión manual separada; filtros compartidos con CSV.
**Componente y ruta:** #tab-cierre; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (report, csv); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Cantidad y suma iniciales y tras nuevo evento → PASS.
- CA02: Avisos sin monto cuentan sin añadir dinero → PASS.
- CA03: Resumen y CSV usan mismos filtros, sin saldo bancario → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU33 Total registrado en el día (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-036 Consultar el estado del Box desde la app

Como administrador, quiero ver cuándo se conectó el Box y cuántos avisos se le enviaron para saber si debo revisar el equipo.

### Criterios originales

- CA01: La ficha muestra la última conexión conocida del equipo.
- CA02: La cantidad se etiqueta como avisos enviados al Box, no como pagos comprobados.
- CA03: Una falta de conexión se muestra sin asegurar que el Box enseñó esos avisos.

### Escenarios Gherkin originales

**Box conectado**

DADO que el Box se comunicó hoy y se le enviaron avisos  
CUANDO abro su ficha  
ENTONCES veo la última conexión y la cantidad enviada

**Equipo apagado**

DADO que el Box dejó de comunicarse  
CUANDO abro su ficha  
ENTONCES veo la última conexión sin afirmar que mostró nuevos avisos

**Aviso enviado**

DADO que el servicio intentó enviar un aviso al Box  
CUANDO consulto la cantidad del día  
ENTONCES entiendo que el número de envíos no confirma pagos ni lo que vio el equipo

**Implementación:** Estado virtual pendiente, conectado o desconectado; última comunicación y contadores separados de envío, acuse y pendientes.
**Componente y ruta:** #tab-dispositivos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (boxes, boxCommunication, boxAcknowledge); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Última conexión solo tras comunicación virtual → PASS.
- CA02: Contador enviados separado de confirmados → PASS.
- CA03: Desconexión y silencio conservan último dato sin inventar recepción → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** HU44 Conocer último evento; HU45 Ver medio de operación (relación parcial, no equivalencia).
**Limitaciones:** CA01–CA03: telemetría, envío y acuse comprobados exclusivamente con Box virtual; ESP32 y broker pendientes.

## HU-037 Vincular el Box mediante un código

Como administrador, quiero ingresar en mi app el código que muestra el Box para asociarlo con mi negocio y usarlo en caja.

### Criterios originales

- CA01: Un Box sin vincular muestra un código de vinculación de vigencia limitada.
- CA02: Solo el administrador puede introducirlo y confirmar a qué negocio se asociará.
- CA03: El código vencido o utilizado no vincula un equipo ni muestra pagos.

### Escenarios Gherkin originales

**Vinculación correcta**

DADO que el Box muestra un código vigente  
CUANDO lo ingreso en la app y confirmo el negocio  
ENTONCES el Box queda vinculado a ese local

**Código vencido**

DADO que el código del Box ya venció  
CUANDO intento usarlo  
ENTONCES no se vincula y puedo pedir otro código

**Equipo ya asociado**

DADO que el Box ya está vinculado a otro local  
CUANDO intento usar su código  
ENTONCES la app evita mezclar los pagos de ambos negocios

**Implementación:** Código virtual temporal de uso único, revisión del negocio antes de confirmar y rechazo de códigos inválidos o asociados.
**Componente y ruta:** #tab-dispositivos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (newBoxCode, pairBox); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Código temporal de Box virtual sin vincular → PASS.
- CA02: Vista previa, cancelar, confirmar; solo administrador → PASS.
- CA03: Vacío inválido vencido usado y otro local rechazados → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Parcial por integración externa.
**Correspondencia con backlog:** Sin equivalente directo.
**Limitaciones:** CA01–CA03: código emitido en pantalla virtual; vinculación con Box físico pendiente.

## HU-039 Buscar avisos por hora

Como persona que atiende, quiero ubicar los avisos de la hora en que pagó un cliente para encontrarlo cuando hubo muchos pagos seguidos.

### Criterios originales

- CA01: Se puede elegir un intervalo de horas dentro del día visible.
- CA02: La lista conserva separados los avisos que coincidan en ese intervalo.
- CA03: Quitar el filtro devuelve todos los avisos del periodo.

### Escenarios Gherkin originales

**Hora encontrada**

DADO que varios clientes pagaron esta tarde  
CUANDO busco avisos entre las 3 y las 4  
ENTONCES veo los que llegaron en ese intervalo

**Sin resultados**

DADO que no hay avisos en la hora elegida  
CUANDO aplico el filtro  
ENTONCES veo que no hubo coincidencias, sin concluir que nadie pagó

**Quitar filtro**

DADO que ya encontré el aviso que buscaba  
CUANDO quito la hora elegida  
ENTONCES vuelvo a ver la lista completa

**Implementación:** Intervalo de horas del aviso, respaldo en recepción, validación y combinación con monto, nombre, fuente y periodo.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Intervalo horario combinado con monto nombre y fuente → PASS.
- CA02: Separados incluso con misma hora y monto → PASS.
- CA03: Quitar horas restaura el mismo periodo → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU03 Ver hora asociada; HU34 Filtrar por fecha (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-040 Buscar un aviso por nombre

Como persona que atiende, quiero buscar el nombre que aparece en un aviso para encontrar un pago cuando varios clientes enviaron el mismo monto.

### Criterios originales

- CA01: La búsqueda usa el nombre que pudo leerse en el aviso.
- CA02: Los resultados muestran monto y hora para ayudar a distinguirlos.
- CA03: Si el aviso no trae nombre, la app no le asigna uno por su cuenta.

### Escenarios Gherkin originales

**Nombre encontrado**

DADO que el aviso trae el nombre que me indicó el cliente  
CUANDO lo busco en la app  
ENTONCES veo su monto y hora

**Sin coincidencia**

DADO que escribí un nombre que no figura en los avisos  
CUANDO lo busco  
ENTONCES veo que no hay resultados y puedo volver a la lista

**Nombre ausente**

DADO que un aviso llegó sin nombre  
CUANDO consulto la lista  
ENTONCES puedo ubicarlo por otros datos sin ver un nombre inventado

**Implementación:** Búsqueda sobre nombre leído, tolerante a tildes y mayúsculas; no inventa nombres ausentes.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Nombre leído tolerante a tilde → PASS.
- CA02: Resultado conserva monto y hora → PASS.
- CA03: Sin nombre no se asigna nombre nuevo → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU04 Consultar nombre de emisor (correspondencia funcional; criterios no idénticos).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-041 Filtrar avisos por billetera

Como persona que atiende, quiero ver solo los avisos de Yape o de otra billetera cuando necesito revisar dónde pudo entrar un pago.

### Criterios originales

- CA01: El filtro ofrece las fuentes reconocidas por ese negocio.
- CA02: Solo aparecen los avisos identificados con la billetera elegida.
- CA03: Los avisos de origen desconocido quedan accesibles al quitar el filtro.

### Escenarios Gherkin originales

**Filtro aplicado**

DADO que hay avisos de Yape y Plin  
CUANDO elijo ver Yape  
ENTONCES veo solo los identificados como Yape

**Origen desconocido**

DADO que un aviso no tiene billetera identificada  
CUANDO filtro por Plin  
ENTONCES no aparece como si fuera de Plin

**Lista completa**

DADO que estaba revisando una billetera  
CUANDO quito el filtro  
ENTONCES vuelvo a ver todos los avisos disponibles

**Implementación:** Filtro por fuente reconocida, origen desconocido aparte y recuperación de todos los registros al limpiar.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Fuentes configuradas por negocio → PASS.
- CA02: Solo fuente elegida, incierto no se atribuye → PASS.
- CA03: Quitar filtro recupera inciertos → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU05 Saber origen del aviso (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-042 Ver los avisos del día como colaborador

Como colaborador, quiero consultar los avisos de hoy para encontrar un pago aunque no haya visto la alerta cuando llegó.

### Criterios originales

- CA01: La vista de hoy muestra solo los avisos del negocio al que tengo acceso.
- CA02: Cada aviso conserva los datos que pudieron leerse.
- CA03: Para ver otros días necesito el permiso de historial correspondiente.

### Escenarios Gherkin originales

**Consulta de hoy**

DADO que tengo acceso al negocio  
CUANDO abro los avisos de hoy  
ENTONCES veo la lista disponible

**Acceso retirado**

DADO que ya no pertenezco al negocio  
CUANDO intento abrir su lista  
ENTONCES no puedo consultarla

**No vi la alerta**

DADO que llegó un aviso mientras tenía el teléfono guardado  
CUANDO abro la lista de hoy  
ENTONCES puedo encontrarlo allí

**Implementación:** Consulta por membresía vigente y negocio; hoy accesible aun fuera del turno de alertas, otros días según permiso.
**Componente y ruta:** #tab-avisos; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (requireAccess, query); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Hoy solo negocio autorizado → PASS.
- CA02: Datos conservados y aviso tras alerta omitida disponible → PASS.
- CA03: Otros días según permiso y revocación bloquea → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU10 Dar permiso de consulta; HU12 Ver negocio del aviso (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.

## HU-043 Ver un desglose por billetera

Como administrador, quiero ver cuánto suman los avisos de cada billetera en el periodo elegido para revisar mi cuenta del día con más orden.

### Criterios originales

- CA01: El resumen separa los avisos de cada fuente reconocida y muestra su cantidad.
- CA02: Los avisos sin billetera identificada se muestran aparte.
- CA03: Se indica que las sumas provienen de avisos detectados y no muestran saldos reales.

### Escenarios Gherkin originales

**Dos billeteras**

DADO que hay avisos identificados de Yape y Plin  
CUANDO abro el resumen de hoy  
ENTONCES veo cantidad y suma conocida de cada billetera

**Origen ausente**

DADO que un aviso no identifica su billetera  
CUANDO consulto el desglose  
ENTONCES figura entre los avisos sin origen conocido y no se atribuye a Yape

**Semana elegida**

DADO que quiero mirar un periodo más largo  
CUANDO cambio el resumen a la semana  
ENTONCES veo el desglose para esos días con el periodo visible

**Implementación:** Cantidad y suma conocida para Yape, Plin y origen desconocido; desglose recalculado con periodo y filtros.
**Componente y ruta:** #tab-cierre; components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js.
**JavaScript:** js/demo-core.js (report); js/demo-ui.js (controles y representación).
**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:

- CA01: Cantidad y suma por Yape y Plin → PASS.
- CA02: Desconocidos separados sin atribución ni monto inventado → PASS.
- CA03: Periodo y filtros recalculan sumas de avisos → PASS.

**Resultado observado:** 3/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.
**Estado:** Verificada en navegador local.
**Correspondencia con backlog:** HU33 Total registrado en el día; HU34 Filtrar por fecha (relación parcial, no equivalencia).
**Limitaciones:** Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.
