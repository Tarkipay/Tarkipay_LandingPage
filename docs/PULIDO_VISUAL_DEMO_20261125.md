# Pulido visual de la demo — 25 de noviembre de 2026

Se actualizó exclusivamente la presentación de la demo en la copia editable `TarkiPay_Landing`. El hero, las demás secciones, contacto, navegación global, modelo, almacenamiento y reglas de negocio conservan sus archivos anteriores. Los 147 archivos enumerados por el manifiesto de `sources/` y los 64 archivos protegidos de la copia se verificaron por SHA-256, sin diferencias. Los adjuntos originales no se modificaron.

## Cambios entregados

- `css/components/demo.css`: cabecera blanca compacta, etiquetas legibles, franja de identidad y rol, herramientas de simulación agrupadas, navegación de 174 px, filtros y resultados con jerarquía, indicadores de cierre compactos, componentes coherentes en las cinco vistas y adaptación a 1440/768/390 px. Los días de turno se agrupan sin cambiar sus casillas. Los controles conservan foco visible y las pestañas mantienen teclado y ARIA.
- `js/demo-ui.js`: únicamente presentación: traslado de controles existentes a dos contenedores, formato legible de fechas, emisor separado en cada fila, identificación visual de datos incompletos, títulos y contador más cortos. Se conservan IDs, listeners, llamadas al servicio, filtros, cálculos, permisos y exportación. El CSV conserva los valores originales.
- `components/landing_sections/06_demo.html`: títulos y etiquetas más breves; mismos formularios, campos y acciones.
- `tests/visual-demo.cjs`: comprobaciones en Chrome con reloj fijo, capturas y descarga CSV. No reemplaza los scripts originales.

No se añadieron dependencias de ejecución ni nuevos botones o pantallas. `demo-core.js` y `demo-store.js` son idénticos por hash a los del inicio de esta iteración.

## Evidencia anterior y posterior

Directorio: `../evidencias/visual_20261125/`, relativo a la carpeta del proyecto.

| Medida en Chrome a 1440 px | Antes | Después |
|---|---:|---:|
| Altura de controles superiores | 293 px | 203 px |
| Altura de indicadores del cierre | 221 px | 126 px |
| Borde superior al desplazar la demo al inicio | 0 px, cubierto por cabecera hasta 80 px | 104 px, libre de cabecera |

Se reprodujo la superposición mediante el desplazamiento nativo al inicio del workspace. Se corrigió con `scroll-margin-top:104px` limitado a la demo, workspace y paneles. No se cambió el posicionamiento ni el diseño de la navegación flotante. Una barra fija sigue visible durante el desplazamiento normal; el ajuste evita que la navegación a estos destinos oculte su inicio.

Comparativas: `comparativa-avisos.png`, `comparativa-cierre.png`, `comparativa-movil.png`. En `antes/` y `despues/` están los originales a 1440, 768 y 390 px, vistas completas, CSV descargados, geometría y errores. `despues/` incluye las otras tres vistas y capturas completas móviles, donde se pueden revisar resultados e indicadores más abajo del primer viewport. La tabla conserva desplazamiento horizontal propio en pantallas estrechas.

## Verificación

| Comprobación | Antes | Después |
|---|---|---|
| Chrome: HU-010/HU-036 y regresiones asociadas | 27 PASS / 0 FAIL | 27 PASS / 0 FAIL |
| Recorrido visual y funcional: 15 combinaciones de vista/tamaño y un grupo de operaciones | 16 PASS / 0 FAIL | 16 PASS / 0 FAIL |
| Modelo local original, reloj controlado | Evidencia de iteración funcional previa: 94 PASS | Reejecutado: 94 PASS / 0 FAIL |
| Auditoría de navegador anterior con adaptación asíncrona | Evidencia de iteración funcional previa: 21 PASS | 20 PASS / 1 diferencia de formato; adaptación de presentación: 21 PASS |
| Excepciones JavaScript | 0 | 0 |
| Desbordamiento horizontal del documento a 1440/768/390 | Ninguno | Ninguno |

El recorrido prueba selectores de identidad y negocio, cinco módulos, generación y consulta, filtros combinados, periodos, reportes, descarga CSV, flujo de vinculación virtual con confirmación, permisos de colaborador y persistencia al recargar. Las 27 regresiones existentes cubren transacciones entre pestañas, conflictos, revocaciones, códigos consumidos, migración, límites temporales del Box, desconexión, reconexión, deduplicación y permisos/reportes.

La primera ejecución de la auditoría antigua marcó B09 como FAIL porque esperaba el texto `2026-10-01 al 2026-11-30`. Se conserva ese resultado en `despues/auditoria/resultado-original-fechas-iso.json`. El adaptador de presentación espera `1 oct. 2026 al 30 nov. 2026` y comprueba además que `api.bounds()` sigue devolviendo los límites ISO originales. No se cambió el criterio de la HU ni el script original. Los restantes 20 escenarios pasaron sin adaptar sus aserciones de presentación.

Reproducción: servir la carpeta del proyecto por HTTP; `visual-demo.cjs` usa Chrome y Playwright disponibles en el entorno de pruebas, URL predeterminada `http://127.0.0.1:8770/` o variable `TARKIPAY_TEST_URL`. Ejecutar `node tests/visual-demo.cjs despues`. No ejecutar pruebas con datos personales: usan un contexto de navegador independiente. Los scripts originales de concurrencia y modelo permanecen en `tests/`; el adaptador de auditoría y los resultados se entregan en evidencias. El detector visual final no reportó patrones pendientes.

## Alcance frente a las HU

Esta entrega mejora el simulador local. No otorga nuevo cumplimiento funcional: se conserva el dictamen anterior de **16 HU que cumplen y 14 parciales** frente a los requisitos originales. La matriz de 30 HU y sus 90 criterios permanece intacta. Los PASS de pruebas locales no significan 30/30 integrado.

HU-010 CA03 conserva la corrección de concurrencia local verificada entre pestañas; la sincronización e integración externa mantienen sus límites previos. HU-036 CA03 conserva la política común del Box virtual, pendiente/envío/acuse explícito y deduplicación; no verifica un Box físico. No se implementó ni verificó autenticación real, captura Android, servicio remoto, MQTT o comunicación física nueva. El informe funcional anterior sigue describiendo esa iteración; este documento registra la capa visual posterior.
