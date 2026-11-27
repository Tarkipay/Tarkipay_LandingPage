# Rediseño UX/UI de la demo TarkiPay

Esta entrega aplica la dirección visual solicitada sobre una nueva copia editable de la entrega funcional anterior. Finnova guía la composición y relación entre operaciones y detalle; Nexora inspira la navegación profunda y el contraste; la tercera referencia aporta claridad financiera. Se conserva la paleta y tipografía de TarkiPay. No se incorporan sus funciones bancarias, imágenes, cifras o estadísticas.

## Cambios por módulo

| Vista | Cambio visual | Comportamiento conservado |
|---|---|---|
| Avisos y búsqueda | Filtros en banda, operaciones sobre morado profundo, inicial de billetera, importe/emisor destacados y detalle lateral relacionado. La fila seleccionada se identifica visualmente y mediante `aria-pressed`. En móvil los filtros son un acordeón accesible y el detalle sigue a la lista. | Todos los filtros, actualización, estados incompletos, revisión manual, permisos e identificador completo en el detalle. No se abre ni marca como leído un aviso automáticamente. |
| Ventas y consultas | Importe esperado con mayor jerarquía; asociación y seguimiento diferenciados; cola de solicitudes con estados y acciones claras. | Asociación, pendiente, corrección del vínculo, consulta y revisión manual. La coincidencia no confirma el abono. |
| Equipo y horarios | Iniciales generadas a partir del nombre, rol/permisos/turno legibles, acciones agrupadas y formulario de invitación como columna secundaria. En tablet y móvil el acceso al equipo aparece antes que el formulario. | Invitación, aceptación, edición de turno y alcance, revocación y auditoría. Sin fotografías inventadas ni cambios de autorización. |
| Fuentes y TarkiBox | Fuentes claras y panel propio del dispositivo virtual con última comunicación y cuatro medidas separadas: pendientes, aceptados por el canal virtual, recepciones confirmadas e intentos. | Activación de fuentes ficticias, código, vinculación, comunicación, desconexión y acuse explícito. No se presenta como telemetría física. |
| Cierre y CSV | Indicador principal morado, indicadores secundarios ligeros, desglose por billetera y tabla con fechas separadas de la hora, badges y códigos largos abreviados. El código completo puede desplegarse con teclado. | Mismos cálculos, filtros, periodos, datos y CSV. No se añaden balances, tendencias ni porcentajes. |

La barra superior separa comercio/servicio, identidad/permisos e instrumentos de simulación. Conserva todos los controles anteriores. Su altura en la captura de 1440 px pasó de 203 a 165 px.

## Navegación y adaptación

El dashboard tiene un área de operación con desplazamiento propio, bajo la navegación de la landing. Al usar los enlaces `#demo`, el inicio del workspace se coloca a 104 px del borde superior; la cabecera flotante termina a 80 px en la prueba. Los paneles contienen el desplazamiento para que su navegación y controles sigan accesibles al trabajar. No se oculta la navegación de la landing ni se modifican sus estilos globales. La página puede seguir desplazándose fuera de la demo.

Se verificaron 1440, 768 y 390 px. La navegación pasa a una banda horizontal en tablet y móvil; las composiciones se apilan; los filtros móviles se abren explícitamente; las tablas mantienen su desplazamiento horizontal accesible. El documento no presenta desbordamiento horizontal. `prefers-reduced-motion`, focos, pestañas ARIA y diálogos de confirmación se conservan.

## Archivos modificados

- `css/components/demo.css`: composición, jerarquía, estados y reglas responsive del demo.
- `components/landing_sections/06_demo.html`: contenedores de lista/detalle y títulos de presentación.
- `js/demo-ui.js`: plantillas visuales, agrupación de controles existentes, presentación de códigos/medidas, acordeón móvil y desplazamiento de los enlaces a la demo. Se conservan IDs, eventos, llamadas al servicio y contratos de datos.
- `tests/visual-demo.cjs`: capturas antes/después y comprobación de selección, navegación real y desplazamiento contenido.
- `tests/operaciones-premium.cjs`: recorridos reales de venta/asociación, consultas, invitación/aceptación, edición/revocación y filtros móviles con recarga.

El modelo `demo-core.js`, `demo-store.js`, IndexedDB, las reglas de HU-010 y HU-036, la matriz de 30 HU/90 CA, reportes y restantes archivos de la landing permanecen idénticos por hash. También se comprobaron los 147 archivos de `sources/MANIFIESTO_SHA256.json`. La copia anterior y sus ZIP permanecen disponibles.

## Pruebas y evidencia

Chrome 158.0.8127.38, reloj fijo del 25/11/2026 a las 15:00 en America/Lima, contextos aislados de pruebas; no se restablecen automáticamente los datos del usuario.

| Suite | Resultado |
|---|---|
| Recorrido antes del cambio | 16 grupos PASS: 15 combinaciones de vista/tamaño y recorrido funcional |
| Recorrido posterior | 17 grupos PASS; incluye la selección de aviso en los tres tamaños y ancla real/desplazamiento contenido |
| Pruebas originales del modelo local | 94 PASS / 0 FAIL |
| Regresiones de concurrencia, revocaciones, canjes, conectividad, duplicados y permisos/reportes | 27 PASS / 0 FAIL |
| Auditoría de interacción de navegador | 21 PASS / 0 FAIL con el adaptador asíncrono y de fecha documentado en la iteración anterior |
| Recorridos adicionales sobre los formularios rediseñados | 4 grupos PASS / 0 FAIL; incluye filtros en móvil a 390×844 |
| Excepciones JavaScript en las ejecuciones finales | 0 |
| Detector de patrones visuales | Sin hallazgos |

La auditoría comprueba detalle y ausencia de datos, búsquedas y filtros combinados, simulación de ráfagas/reenvíos/tardíos, desconexión, periodos y cifras, CSV, identidad y permisos, invitaciones, revocación, fuentes y vinculación del Box. Las 27 regresiones verifican HU-010 y HU-036 con dos pestañas y reloj controlado, además de filtros/reportes/permisos. Los originales se conservan en `sources/`; los adaptadores y sus resultados están en evidencias. Una captura intermedia agotó la espera de arranque mientras se ejecutaban suites en paralelo; la repetición completa final pasó sin excepciones de la aplicación.

Directorio de evidencia: `../evidencias/`, relativo a la raíz del proyecto:

- `antes/` y `despues/`: cinco vistas a 1440 px, Avisos y Cierre a 768/390 px, vistas seleccionadas, Box vinculado y descargas CSV.
- `comparativa-avisos.png`, `comparativa-ventas.png`, `comparativa-equipo.png`, `comparativa-dispositivos.png`, `comparativa-cierre.png`, `comparativa-movil.png`.
- `integridad.json`, `CAMBIOS_UX_UI.patch`, JSON de resultados y fuentes de prueba.

Las capturas muestran estados reales del simulador bajo prueba. No son maquetas con cifras inventadas. Los CSV y los estados operativos permanecen separados de las capturas iniciales.

## Cumplimiento e integración

El rediseño no acredita historias nuevas. Se mantiene el dictamen anterior: **16 HU cumplen y 14 parciales** frente al requisito original. Los PASS locales no equivalen a 30/30 integrado. No se implementaron ni verificaron nuevas integraciones de autenticación real, Android, servidor, MQTT o Box físico.

La documentación funcional y visual de las iteraciones anteriores se conserva como historial; este informe describe la presentación posterior. El alcance de la revisión visual independiente se registra en `../evidencias/REVISION_VISUAL.md`.
