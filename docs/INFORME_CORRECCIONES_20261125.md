# Corrección funcional de TarkiPay del 25 de noviembre de 2026

Se corrigieron HU-010 CA03 y la inconsistencia local de HU-036 CA03 en una copia editable. El ZIP adjunto y los archivos de sources/ permanecen intactos. No se hizo push, publicación ni modificación del proyecto anterior. El HTML de componentes, CSS, imágenes y recursos aprobados son idénticos a los originales.

## 1 Causas raíz y reproducción anterior al cambio

HU-010 CA03: cada instancia conservaba un objeto completo y save() reemplazaba el JSON de localStorage. Una edición del perfil podía reescribir una copia anterior y borrar un aviso recién incorporado. Los storage events no constituían una transacción. Se reprodujo D03 con el script original en Node y con dos pestañas reales de Chrome: concurrentEventSurvives=false en evidencias/antes/auditoria/limites-browser.json.

HU-036 CA03: boxes() vencía la conexión cuando now-lastSeenAt superaba 120000 ms; deliver() solo examinaba online. Se reprodujo D01 con reloj controlado: Desconectado, 1 enviado, 0 pendientes y 0 acuses a los 120001 ms. Ambos defectos se reprodujeron antes de modificar los archivos de código de la copia.

## 2 Solución técnica y conflictos

La fuente de datos del navegador es IndexedDB, base tarkipay-demo-v4, object store entities. Cada negocio, usuario, membresía, invitación, aviso, pendiente, entrega, venta, solicitud y entrada de actividad es un registro individual con clave estable. El registro $root contiene metadatos, nunca las colecciones.

Cada comando abre una transacción readwrite que lee los registros vigentes, vuelve a validar identidad y permisos del modelo, aplica el comando por entidad y escribe únicamente registros cambiados. No espera promesas dentro de la transacción. La promesa del comando solo resuelve al evento complete; un error aborta todos los cambios. No se traslada un snapshot completo a un único registro de IndexedDB. C16 verifica las entidades escritas al editar un perfil.

Las transacciones readwrite de alcance superpuesto se serializan y leen los commits anteriores, conforme a [Indexed Database API, transacciones](https://www.w3.org/TR/IndexedDB/#transactions). La exclusión no depende de storage events ni de recargar previamente el estado en la vista. localStorage v4 solo contiene una señal de repintado; perder esa señal no cambia la corrección del commit.

Políticas explícitas:

- Entidades independientes: los comandos se aplican sobre el estado vigente y conservan los demás campos y entidades. Un aviso y una edición de perfil sobreviven juntos a la recarga.
- Perfil e integrante editados con la misma revisión: solo el primero confirma; el segundo recibe un conflicto y debe revisar los datos actuales. La UI conserva la revisión que el usuario abrió al editar. No hay sobrescritura silenciosa de una edición concurrente.
- Revocación: una acción pendiente vuelve a comprobar la membresía dentro de la transacción. No puede volver activa una relación revocada. Un reingreso requiere una invitación nueva, con otra relación, como en el modelo previo.
- Invitaciones: comprobar y consumir usedAt, crear la relación y guardar ocurren en una transacción. Dos canjes simultáneos producen un solo acceso; una escritura antigua no elimina usedAt ni revokedAt.
- IDs: los avisos mantienen su identidad por negocio. Las entregas se deduplican por negocio, destinatario y evento. Las entidades históricas sin ID reciben una clave técnica estable de almacenamiento.
- Otras transiciones explícitas se procesan en orden de transacción y validan el estado actual. No se fusionan snapshots de una pestaña. Reset es una acción explícita que cambia la época de datos; una operación vieja de otra época se rechaza.
- Los getters son snapshots para representar la interfaz; reload() los refresca. Nunca se usan esos snapshots como autorización o fuente de escritura. Esto no convierte una identidad ficticia en una cuenta autenticada.

La primera estrategia ensayada con Web Locks y localStorage se descartó: una prueba concurrente con reloj fijo reprodujo lecturas divergentes entre pestañas. No forma parte de la implementación final. Se conserva el primer pase fallido como evidencia de desarrollo, separado de los resultados finales.

## 3 Migración y recuperación

Si IndexedDB está vacío, la primera transacción importa el JSON válido de tarkipay.demo.v3 por entidad. Otra inicialización concurrente encuentra la base ya migrada y no lo vuelve a importar. Se conserva íntegro el valor antiguo; no se borra ni se actualiza como parte de la migración. C09 comprueba el aviso previo, las membresías revocadas, la invitación utilizada y el texto original de localStorage tras dos inicializadores.

La migración automática requiere el mismo origen —protocolo, host y puerto— del navegador que guardó los datos anteriores. Un puerto diferente mantiene otro almacenamiento; no borra el anterior. Se debe cerrar la versión antigua al adoptar la nueva. Escrituras posteriores de una versión antigua sobre v3 no se importan sobre una base nueva ya establecida, para no revivir permisos ni canjes.

Sin IndexedDB, o con datos inválidos, no se hace fallback a una escritura insegura del estado completo. Se informa el error y no se confirma éxito. La garantía es de atomicidad y preservación entre pestañas cooperantes del mismo origen, no de backup permanente frente a borrado, cuota, perfil eliminado o caída física del equipo. Las pruebas Node originales usan un almacenamiento en memoria en un único proceso; no sustentan la concurrencia del navegador.

## 4 Política única del Box virtual

boxConnected(box, now) es la única política usada para distribuir y presentar el estado. Requiere online=true, una comunicación finita que no está en el futuro y una antigüedad menor o igual a 120000 ms. Se conserva el límite inclusivo previo: 119999 y 120000 están vigentes; 120001 está vencido.

Se distinguen cuatro conceptos: pendiente sin envío; intento registrado con hora y resultado; aceptación del canal virtual; recepción confirmada virtualmente. Un rechazo de canal incrementa intentos y conserva el pendiente, sin aumentar aceptados ni acuses. Un Box vencido ni siquiera intenta un nuevo envío: conserva el evento pendiente.

La comunicación explícita de reconexión renueva lastSeenAt y procesa solo los pendientes. Cada entrega permanece única. Reconectar dos veces no vuelve a enviar lo aceptado. El acuse solo afecta entregas aceptadas y nunca confirma un pendiente no enviado. Un acuse repetido no cambia su ackAt ni duplica contadores. Como en la auditoría original, un acuse entrante explícito representa comunicación virtual y puede renovar lastSeenAt después del vencimiento.

No se agregaron pantallas ni botones. Se conservó el control existente de comunicación y se hizo depender su etiqueta del estado efectivo. Los textos de conteo aclaran aceptación por canal virtual. No son respuesta MQTT, visualización física ni acreditación de un pago.

## 5 Pruebas antes y después

| Batería | Antes | Después final | Alcance |
|---|---|---|---|
| Suite original, sin cambiar sus assertions | 94 PASS / 0 FAIL | 94 PASS / 0 FAIL | Modelo aislado, 90 casos por CA y 4 transversales |
| Navegador B01–B21 | 21 PASS / 0 FAIL | 21 PASS / 0 FAIL | Esperas adaptadas al contrato asíncrono; condiciones esperadas conservadas |
| Diagnóstico adicional original | 13 PASS / 4 FAIL | 15 PASS / 2 FAIL | D01 y D03 pasan; D04 y D05 siguen fallando por límites de identidad y datos locales |
| Regresiones nuevas C01–C17, T01–T07 y R01–R03 | No existían | 27 PASS / 0 FAIL | Dos pestañas reales, IndexedDB, migración, conflictos y reloj controlado |

Las tres baterías de regresión funcional suman 142 PASS y 0 FAIL. El diagnóstico adicional se informa aparte: sus 2 FAIL no se eliminaron ni se redefinieron como PASS. No son 2 fallos ocultos del arreglo; siguen demostrando que no existe autenticación ni exclusión confiable de datos históricos para otra identidad local.

Se preservaron las pruebas originales en sources/. Las copias de ejecución de evidencias/antes usan las rutas originales. El adaptador posterior conserva los escenarios y assertions B01–B21 y solo cambia el puerto, las esperas de acciones/promesas, el rechazo asíncrono y el restablecimiento de IndexedDB en lugar de vaciar únicamente localStorage. El primer intento sin esas esperas queda separado como resultado parcial, no se presenta como pase final.

Los filtros combinados, los totales, el CSV y los permisos se comprobaron otra vez en R01 y en las regresiones B. R02 recorre cinco vistas a 1440, 768 y 390 px; no hay overflow horizontal del documento. No hubo errores JavaScript en las ejecuciones finales de 21 y 27 casos. Las capturas están en evidencias/despues/.

## 6 Estado por criterio original

| HU y criterio | Requisito literal | Resultado del simulador | Dictamen frente al requisito original |
|---|---|---|---|
| HU-010 CA01 | Los avisos diferentes se guardan como registros separados. | Conservado por suite 010, B06 y C08 | Cumple para los eventos disponibles |
| HU-010 CA02 | La lista los ordena usando la hora disponible. | Conservado por suite 010 y B06 | Cumple |
| HU-010 CA03 | La llegada de uno nuevo no borra el anterior. | C01–C17, incluidos recarga, conflicto y revocación | Corregido; Cumple en el alcance evaluado |
| HU-036 CA01 | La ficha muestra la última conexión conocida del equipo. | Comunicación virtual conocida, con vencimiento | Parcial: no hay telemetría de equipo físico |
| HU-036 CA02 | La cantidad se etiqueta como avisos enviados al Box, no como pagos comprobados. | Cantidad del canal virtual separada de acuses, pagos y pendientes | Cumple en la presentación evaluada |
| HU-036 CA03 | Una falta de conexión se muestra sin asegurar que el Box enseñó esos avisos. | T01–T07 y R03; no se suman envíos o acuses al vencer | Inconsistencia local corregida; parcial frente al equipo físico |

## 7 Total de la selección fija y dependencias

El balance frente a las fichas pasa de 15 Cumple / 15 Parcial a **16 Cumple / 14 Parcial / 0 ausentes**, conservando exactamente las 30 HU y los 90 CA de matriz_30_HU.json. HU-010 es la única reclasificada. La corrección del simulador de HU-036 no la convierte en una integración real.

Siguen pendientes captura y permisos Android, identidad autenticada, autorización en un servicio compartido, contrato de eventos remotos, canje entre dispositivos, notificaciones push, MQTT/Mosquitto, firmware y respuesta de un ESP32 físico. IndexedDB sigue siendo almacenamiento local accesible en el mismo navegador, no una frontera de seguridad entre personas. La recarga sigue iniciando una identidad ficticia administradora, como documentan D04/D05 y la auditoría. No se considera solucionado por trasladar datos de almacenamiento.

La aceptación final sobre GitHub Pages, la cadena con Figma/Needfinding y las pruebas de hardware no se realizaron en esta iteración. No se acredita 30/30 como plataforma integrada. El anterior Word está archivado como histórico; su balance 20/10 no es el dictamen vigente de esta iteración.

## 8 Archivos de entrega y reproducción

Código modificado: index.html (carga del store), js/demo-core.js (comandos y Box), js/demo-ui.js (esperas, revisión y estado), js/landing.js (error de inicialización). Nuevo: js/demo-store.js. Los componentes HTML, todos los CSS y los assets se conservaron byte a byte. Nuevo test: tests/fixes-browser.cjs. tests/acceptance.cjs permanece idéntico.

Documentación vigente: docs/INFORME_CORRECCIONES_20261125.md, docs/TRACEABILITY_30_HU.md, docs/matriz_30_HU.json y docs/PRUEBAS_ACEPTACION_30_HU.md. Históricos en docs/historico/. sources/ contiene los adjuntos extraídos sin edición. evidencias/antes y evidencias/despues separan los resultados; integridad-final.json comprueba los originales.

Desde TarkiPay_Landing: ejecutar `python -m http.server 8768 --bind 127.0.0.1` y abrir http://127.0.0.1:8768/. Ejecutar `node tests/acceptance.cjs`. Para las nuevas pruebas, instalar o usar un Playwright de desarrollo con Chrome y ejecutar `node tests/fixes-browser.cjs`; la URL se puede configurar con TARKIPAY_TEST_URL. No se agrega Playwright a los scripts del producto.

El directorio padre con sources/ es necesario para la prueba de migración de las regresiones nuevas. Las rutas de resultados son relativas al paquete. El script scripts/build-delivery.py se conserva como generador histórico del informe anterior y no debe usarse para certificar esta corrección. Para regenerar la documentación vigente se usa generar-cierre.py, en la raíz de esta iteración, después de las pruebas.
