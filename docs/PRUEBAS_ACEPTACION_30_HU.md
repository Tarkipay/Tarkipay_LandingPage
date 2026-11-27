# Pruebas de aceptación y regresión de la iteración

Los criterios originales y su dictamen están en TRACEABILITY_30_HU.md y matriz_30_HU.json. Las pruebas de modelo son independientes de la aceptación de integración externa. Las pruebas antiguas de defectos permanecen intactas en sources/.

## Nuevas comprobaciones esperadas

| ID | Criterios relacionados | Comportamiento esperado comprobado | Resultado |
|---|---|---|---|
| C01 | HU-010 CA03 | Dos pestañas, aviso y perfil antiguo; ambos sobreviven recarga | PASS |
| C02 | HU-010 CA03 | Dos pestañas escriben entidades diferentes simultáneamente | PASS |
| C03 | HU-010 CA03 | Misma entidad y versión: un commit y un conflicto explícito | PASS |
| C04 | HU-010 CA03; HU-028 CA02 | Perfil antiguo no resucita membresía revocada | PASS |
| C05 | HU-010 CA03; HU-029 CA03 | Edición antigua de integrante se rechaza después de revocarlo | PASS |
| C06 | HU-010 CA03; HU-026 CA02 | Escritura antigua no desconsume una invitación | PASS |
| C07 | HU-026 CA02 | Dos canjes simultáneos consumen el código solo una vez | PASS |
| C08 | HU-010 CA03; HU-013 CA02 | Dos colas con el mismo ID no duplican aviso ni entrega Box | PASS |
| C09 | HU-010 CA03 | Migración v3 atómica conserva datos, revocación y canje | PASS |
| C10 | HU-010 CA03 | Una escritura espera la transacción readwrite de otra pestaña | PASS |
| C11 | HU-010 CA03 | Sin IndexedDB se rechaza guardar; no hay fallback inseguro | PASS |
| C12 | HU-010 CA03 | Una transacción abortada no publica cambios parciales | PASS |
| C13 | HU-010 CA03 | Operación en espera no usa una identidad que ya cambió | PASS |
| C14 | HU-010 CA03 | Lectura no depende del evento storage y no convierte caché en escritura | PASS |
| C15 | HU-010 CA03 | Datos corruptos no se sustituyen por ejemplos al guardar | PASS |
| C16 | HU-010 CA03 | Perfil escribe solo entidades cambiadas; nunca un snapshot con todos los avisos | PASS |
| C17 | HU-010 CA03; HU-028 CA02 | Una acción en cola vuelve a autorizarse tras revocación concurrente | PASS |
| T01 | HU-036 CA03 | Justo antes del límite: envío virtual aceptado, no acuse | PASS |
| T02 | HU-036 CA03 | Exactamente al límite inclusivo: misma política en estado y distribución | PASS |
| T03 | HU-036 CA03 | Justo después del límite: pendiente, cero enviados y cero acuses | PASS |
| T04 | HU-036 CA03 | Desconexión manual: sin envíos ni acuses inexistentes | PASS |
| T05 | HU-036 CA03 | Reconexión drena pendientes una sola vez y exige acuse explícito | PASS |
| T06 | HU-036 CA03 | Intento rechazado no es aceptación ni recepción | PASS |
| T07 | HU-036 CA03 | Acuse entrante explícito tras timeout renueva comunicación; no infiere acuses nuevos | PASS |
| R01 | HU-005/032/034/039/041/043 | Filtros, reportes, CSV y permisos después de escrituras concurrentes | PASS |
| R02 | HU-010/036 | UI conserva cinco vistas y responsive sin modificar HTML/CSS | PASS |
| R03 | HU-036 CA03 | UI vencida ofrece reconexión y describe solo canal virtual | PASS |

## Diagnóstico original después de la corrección

| ID | Nombre | Resultado |
|---|---|---|
| A01 | 100 eventos desordenados, duplicados y mismos importes | PASS |
| A02 | Deduplicación persiste entre instancias | PASS |
| A03 | Códigos invitación expiran exactamente al límite | PASS |
| A04 | Código revocado y usado se rechaza | PASS |
| A05 | Box expira exactamente al límite | PASS |
| A06 | Aislamiento entre negocios y datos desconocidos | PASS |
| A07 | Permisos semana/mes y reducción de alcance | PASS |
| A08 | Turno usa día y límites en America/Lima | PASS |
| A09 | Cambiar turno no altera eventos ni alcance | PASS |
| A10 | Datos devueltos son copias | PASS |
| A11 | FILTRO: desconocidos y horas sin hora original | PASS |
| A12 | Fecha/rango inválidos rechazados | PASS |
| D01 | Box declarado desconectado no debería contabilizar nuevos envíos como enviados | PASS |
| A13 | Acuse virtual explícito renueva la última comunicación | PASS |
| D03 | Dos instancias no deberían perder avisos al guardar sin recargar | PASS |
| D04 | Datos históricos no autorizados no deberían estar disponibles para colaborador en almacenamiento | FAIL |
| D05 | Recargar no debería elevar identidad colaboradora a administradora | FAIL |

D04 y D05 siguen FAIL: no se implementaron cuentas confiables ni protección contra lectura de datos locales. D01 y D03 son ahora PASS. No sumar resultados PASS para declarar HU completas.

## Rutas verificables

- evidencias/antes/auditoria/resultados-adicionales.json: reproduce D01 y D03 antes de modificar código.
- evidencias/antes/auditoria/limites-browser.json: aviso perdido con dos pestañas.
- evidencias/despues/auditoria/resultados-browser-adaptado.json: 21 escenarios de navegador, 0 errores JavaScript.
- evidencias/despues/nuevas-regresiones-browser.json: 27 nuevas regresiones, reloj controlado, 0 errores JavaScript.
- docs/acceptance-results.json: 94 PASS, 0 FAIL de suite de modelo original.
- evidencias/despues/integridad-diseno.json: componentes, CSS, assets y páginas idénticos.
- evidencias/integridad-final.json: originales y sources/ sin alteración.

Los resultados de primeros pases y ensayos descartados quedan en evidencias/desarrollo. No son la evaluación final ni se mezclan con los casos aprobados.
