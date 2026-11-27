# Checkpoint de corrección del 25 de noviembre de 2026

Copia editable derivada del ZIP TarkiPay_Fuentes_para_Codex_2026-11-25.zip. Originales preservados en sources/. No se modificó la entrega anterior ni se hizo push.

Se reprodujeron D03/HU-010 CA03 y D01/HU-036 CA03 antes del cambio. Persistencia del navegador corregida con transacciones IndexedDB por entidad; política única de conexión y estados del canal virtual. Ver docs/INFORME_CORRECCIONES_20261125.md para conflictos, migración, límites y evidencias.

Resultado final: 16 HU Cumple, 14 Parcial, 0 ausentes frente a las fichas originales. No se certifica 30/30 integrado. Regresiones: 94 del modelo, 21 de navegador y 27 nuevas PASS; diagnóstico adicional conserva 2 FAIL por límites de identidad y datos locales.

Diseño aprobado preservado: componentes, CSS y assets idénticos. No se incorporan pantallas ni controles nuevos. El adaptador IndexedDB y las esperas asíncronas solo cambian comportamiento funcional y estado comunicado.

## Checkpoint anterior conservado como histórico

# TarkiPay checkpoint funcional

Fecha: 23 de noviembre de 2026, America/Lima.

## Versión preservada

Antes de modificar código se creó la etiqueta Git local `checkpoint-pre-30-hu-20261123`, sobre `f0773e3` (landing actualizada en base a historias de usuario, diseño responsive). El árbol de trabajo inicial estaba limpio. No se hizo push ni despliegue.

No se encontraron AGENTS.md ni PROJECT_CHECKPOINT.md previos dentro del proyecto. Se consultaron el handbook, las 48 fichas detalladas del TB2, sus 144 criterios y 144 escenarios, las 48 entradas del backlog, el prompt maestro y la auditoría. Las instrucciones del handbook se usan como requisitos académicos; no como autorización para publicar ni modificar archivos ajenos.

## Selección fija

HU-001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013, 025, 026, 027, 028, 029, 030, 031, 032, 033, 034, 036, 037, 039, 040, 041, 042 y 043. No se usó la selección alternativa de la auditoría.

## Arquitectura y cambios

- `js/demo-core.js`: servicio local nativo con estado privado; negocios, identidades ficticias, membresías, invitaciones, turnos, eventos, cola, deduplicación, entregas locales, reportes, ventas y Box virtual. Valida permisos y pertenencia dentro de cada función. Los snapshots devueltos son copias.
- `js/demo-ui.js`: vistas de demo sobre el mismo servicio; filtros combinados y periodos compartidos entre lista, resumen y CSV; invitación con vista previa y canje; diálogo accesible para confirmar retiro y vinculación; fuentes y comunicaciones virtuales.
- `js/landing.js`: conserva carga de secciones y comportamiento del marketing; delega demo a los dos módulos nuevos. Se eliminó la lógica anterior que cambiaba estados visuales sin reglas compartidas. Los botones informativos del permiso Android ya no simulan conexión a internet.
- Persistencia en `localStorage`, clave `tarkipay.demo.v3`; restauración explícita de ejemplos y avisos cuando no se puede guardar. Las sesiones e identidades son ficticias. No usar información real.
- Zona `America/Lima`; semanas de lunes a domingo, permisos de semana/mes limitados al calendario actual; administración consulta periodos anteriores y rangos de meses. Las alertas dependen del turno; la consulta depende de la membresía y el alcance de historial. Los horarios diarios validan fin posterior a inicio.
- Se conservaron hero, imagen oficial, logotipo, navegación, contacto Hablemos, paleta y tipografía. No se exponen identificadores HU ni criterios en la demo.

## Verificación

- `node tests/acceptance.cjs`: 94 PASS, 0 FAIL; 90 casos CA01–CA03 para exactamente 30 HU y 4 casos transversales. Reloj fijo 23/11/2026, 15:00 Lima.
- Navegador localhost: consulta de monto y datos incompletos; ráfagas, reenvíos y tardíos; filtros combinados; canje, periodos, revocación y persistencia; códigos y comunicación Box; fallo de actualización y restauración.
- Cinco vistas recorridas a 1440, 768 y 390 px sin desbordamiento horizontal del documento. Sin errores JavaScript observados. Las tablas y pestañas usan desplazamiento propio.
- Detector mecánico Impeccable ejecutado sobre UI modificada: sin hallazgos. No representa una certificación WCAG completa.
- El Word se generó con python-docx y se comprobó su apertura en Word. El renderizador empaquetado no encontró LibreOffice en Windows; se exportó una copia de revisión mediante Word y se renderizaron las 36 páginas con PDFium. Se revisaron las páginas y se comprobó que el texto está dentro de sus límites; la entrega conserva los 90 criterios y 90 escenarios originales de las 30 seleccionadas. Las imágenes y el PDF de revisión están en tmp, excluidos de Git.

## Estado y dependencias

20 HU verificadas dentro del alcance del navegador; 10 parciales respecto al sistema completo: HU-008, 009, 012, 013, 026, 028, 030, 031, 036 y 037. Cada criterio externo pendiente figura en la trazabilidad. Las 30 tienen flujo local implementado y pruebas; esto no significa 30 completas de extremo a extremo.

No existe integración operativa Android, servicio remoto, MQTT/Mosquitto ni ESP32 en este repositorio. Los eventos, cuentas, transporte, turnos de alertas y Box son simulados. El estado del Box separa conexión conocida, envío, pendientes y acuse virtual; no confirma pagos ni recepción física. `navigator.onLine` detecta disponibilidad del navegador, no disponibilidad de un backend.

La aceptación final de las 30 en GitHub Pages está pendiente. El equipo debe reconciliar ambos inventarios y revisar la cadena Needfinding → Figma → implementación. No se alteraron requisitos para hacerlos coincidir con la demo. La prueba responsive no sustituye pruebas con usuarios ni accesibilidad completa.

## Entrega y reproducción

`docs/TarkiPay_30_Historias_Usuario_Implementadas.docx` y `.md`; `docs/TRACEABILITY_30_HU.md`; `docs/PRUEBAS_ACEPTACION_30_HU.md`; `docs/CORRESPONDENCIA_48_HU_BACKLOG.md`; `docs/REQUISITOS_ORIGINALES.json`; `docs/acceptance-results.json`.

Ejecutar las pruebas desde la raíz con Node. Servir la landing con `python -m http.server 8765 --bind 127.0.0.1`. Para regenerar documentos, ejecutar `scripts/build-delivery.py` con el Python empaquetado después de ejecutar las pruebas. Las herramientas de extracción y render temporal están excluidas de Git.
