# Pruebas de aceptación de las 30 HU

Fecha de referencia: 23 de noviembre de 2026, Lima. Código preservado antes del cambio en etiqueta local `checkpoint-pre-30-hu-20261123` (commit f0773e3).

## Reproducción

1. Desde la raíz, ejecutar `node tests/acceptance.cjs` (Node 24 o compatible). No instala dependencias. Genera docs/acceptance-results.json.
2. Iniciar `python -m http.server 8765 --bind 127.0.0.1` y abrir http://127.0.0.1:8765/#demo.
3. Restablecer ejemplos como Elena antes de comparar cifras iniciales. El reloj de la suite es fijo: 23/11/2026 15:00 America/Lima; la interfaz usa la hora real en Lima.
4. Seleccionar identidades ficticias desde el control de demo. Esta selección no es autenticación. Todos los datos son ejemplos.

## Resultados automatizados

94 PASS; 0 FAIL. Los 90 casos por criterio comprueban el modelo y cuatro casos transversales prueban persistencia, recuperación ante errores, aislamiento y CSV. Algunas comprobaciones de texto son estáticas y se complementan con las observaciones de navegador documentadas abajo.

| HU | Criterio | Comprobación y resultado esperado | Obtenido |
|---|---|---|---|
| HU-001 | CA01 | Orden cronológico aunque el servicio entregue invertido | PASS |
| HU-001 | CA02 | Monto y hora originales conservados | PASS |
| HU-001 | CA03 | Sin registros sin inventar pagos | PASS |
| HU-002 | CA01 | Detalle conserva campos leídos | PASS |
| HU-002 | CA02 | Datos ausentes explícitos | PASS |
| HU-002 | CA03 | Abrir no verifica | PASS |
| HU-003 | CA01 | Yape y Plin conservan origen | PASS |
| HU-003 | CA02 | Fuente incierta no se atribuye | PASS |
| HU-003 | CA03 | Origen no comprueba ingreso | PASS |
| HU-004 | CA01 | Registros identificados como avisos | PASS |
| HU-004 | CA02 | Leer conserva significado | PASS |
| HU-004 | CA03 | Orientación a billetera presente | PASS |
| HU-005 | CA01 | Monto positivo; rechaza cero, negativos y precisión inválida | PASS |
| HU-005 | CA02 | Coincidencias exactas; búsqueda sin resultados | PASS |
| HU-005 | CA03 | Quitar filtro restaura lista | PASS |
| HU-006 | CA01 | Importes iguales son registros separados | PASS |
| HU-006 | CA02 | Nombres y horas propios | PASS |
| HU-006 | CA03 | Sin nombre no selecciona ni asocia automáticamente | PASS |
| HU-007 | CA01 | Vacío no equivale a falta de pago | PASS |
| HU-007 | CA02 | Sin acceso billetera no inventa confirmación | PASS |
| HU-007 | CA03 | Tardío conserva identidad, ambas horas y se deduplica | PASS |
| HU-008 | CA01 | Última actualización efectiva persistida | PASS |
| HU-008 | CA02 | Actualizar procesa cola | PASS |
| HU-008 | CA03 | Fallo conserva hora y cola hasta reintento | PASS |
| HU-009 | CA01 | Consolidación de dos fuentes activas | PASS |
| HU-009 | CA02 | Origen conservado por evento | PASS |
| HU-009 | CA03 | Fuente desactivada rechazada sin inventar registros | PASS |
| HU-010 | CA01 | Tres consecutivos separados | PASS |
| HU-010 | CA02 | Orden por marcas temporales | PASS |
| HU-010 | CA03 | Nuevos no eliminan anteriores | PASS |
| HU-011 | CA01 | Monto consultable directamente | PASS |
| HU-011 | CA02 | Consultar no exige venta | PASS |
| HU-011 | CA03 | Monto ausente no inventado | PASS |
| HU-012 | CA01 | Cuenta ficticia asociada a negocio único nuevo | PASS |
| HU-012 | CA02 | Solo administrador modifica | PASS |
| HU-012 | CA03 | Obligatorios y actualización atómica | PASS |
| HU-013 | CA01 | Identidad estable en primer procesamiento | PASS |
| HU-013 | CA02 | Reintentos dentro y entre actualizaciones idempotentes | PASS |
| HU-013 | CA03 | Mismo importe diferente identidad se conserva | PASS |
| HU-025 | CA01 | Administración y vencimiento visible | PASS |
| HU-025 | CA02 | Código asociado al negocio y permisos; aún no miembro | PASS |
| HU-025 | CA03 | Vencido usado y revocado no dan acceso | PASS |
| HU-026 | CA01 | Vista previa y cancelar no concede acceso | PASS |
| HU-026 | CA02 | Inválidos vencidos y usados rechazados al canjear | PASS |
| HU-026 | CA03 | Canje crea solo colaborador sin administración | PASS |
| HU-027 | CA01 | Colaborador obtiene campos permitidos | PASS |
| HU-027 | CA02 | Sin operaciones bancarias | PASS |
| HU-027 | CA03 | Ausencias no amplían acceso | PASS |
| HU-028 | CA01 | Persona identificada; cancelar conserva acceso | PASS |
| HU-028 | CA02 | Confirmar bloquea consultas y futuras alertas simuladas | PASS |
| HU-028 | CA03 | Historial conservado y nueva invitación recupera solo alcance nuevo | PASS |
| HU-029 | CA01 | Nombre rol permiso estado | PASS |
| HU-029 | CA02 | Revocados distintos | PASS |
| HU-029 | CA03 | Solo administración cambia alcance o lee lista | PASS |
| HU-030 | CA01 | Horario individual zona negocio validada | PASS |
| HU-030 | CA02 | En turno recibe, fuera y límite final no reciben nuevas alertas locales | PASS |
| HU-030 | CA03 | Cambiar turno conserva historial y alcance, consulta no depende de estar de turno | PASS |
| HU-031 | CA01 | Rol derivado de relación de cuenta y negocio | PASS |
| HU-031 | CA02 | Acciones administrativas rechazan colaborador aunque invoque API | PASS |
| HU-031 | CA03 | Cambio de negocio o periodo no eleva rol ni mezcla datos | PASS |
| HU-032 | CA01 | Permisos distintos hoy semana mes | PASS |
| HU-032 | CA02 | Periodos ajenos bloqueados en consulta detalle resumen CSV | PASS |
| HU-032 | CA03 | Reducir alcance no altera registros | PASS |
| HU-033 | CA01 | Día semana mes rango y periodos anteriores | PASS |
| HU-033 | CA02 | Rango y cantidad calculados desde datos | PASS |
| HU-033 | CA03 | Periodo vacío sin registros inventados | PASS |
| HU-034 | CA01 | Cantidad y suma iniciales y tras nuevo evento | PASS |
| HU-034 | CA02 | Avisos sin monto cuentan sin añadir dinero | PASS |
| HU-034 | CA03 | Resumen y CSV usan mismos filtros, sin saldo bancario | PASS |
| HU-036 | CA01 | Última conexión solo tras comunicación virtual | PASS |
| HU-036 | CA02 | Contador enviados separado de confirmados | PASS |
| HU-036 | CA03 | Desconexión y silencio conservan último dato sin inventar recepción | PASS |
| HU-037 | CA01 | Código temporal de Box virtual sin vincular | PASS |
| HU-037 | CA02 | Vista previa, cancelar, confirmar; solo administrador | PASS |
| HU-037 | CA03 | Vacío inválido vencido usado y otro local rechazados | PASS |
| HU-039 | CA01 | Intervalo horario combinado con monto nombre y fuente | PASS |
| HU-039 | CA02 | Separados incluso con misma hora y monto | PASS |
| HU-039 | CA03 | Quitar horas restaura el mismo periodo | PASS |
| HU-040 | CA01 | Nombre leído tolerante a tilde | PASS |
| HU-040 | CA02 | Resultado conserva monto y hora | PASS |
| HU-040 | CA03 | Sin nombre no se asigna nombre nuevo | PASS |
| HU-041 | CA01 | Fuentes configuradas por negocio | PASS |
| HU-041 | CA02 | Solo fuente elegida, incierto no se atribuye | PASS |
| HU-041 | CA03 | Quitar filtro recupera inciertos | PASS |
| HU-042 | CA01 | Hoy solo negocio autorizado | PASS |
| HU-042 | CA02 | Datos conservados y aviso tras alerta omitida disponible | PASS |
| HU-042 | CA03 | Otros días según permiso y revocación bloquea | PASS |
| HU-043 | CA01 | Cantidad y suma por Yape y Plin | PASS |
| HU-043 | CA02 | Desconocidos separados sin atribución ni monto inventado | PASS |
| HU-043 | CA03 | Periodo y filtros recalculan sumas de avisos | PASS |
| TRANSVERSAL | Persistencia | Recarga y restauración de estado | PASS |
| TRANSVERSAL | Persistencia | Guardado no disponible y JSON corrupto informados | PASS |
| TRANSVERSAL | Aislamiento | Eventos mismo ID en distintos negocios son independientes | PASS |
| TRANSVERSAL | CSV | Protección de fórmulas y comillas | PASS |

## Comprobaciones en navegador ejecutadas

Navegador integrado Chromium, localhost. No se realizaron pruebas sobre la versión pública anterior porque no contiene estos cambios. No hubo errores JavaScript en la consola observada.

| Procedimiento | Esperado | Observado |
|---|---|---|
| Restablecer y buscar S/20 | Dos registros con datos diferentes | Dos resultados TP-1042 y TP-1041 |
| Abrir TP-1039 | Datos ausentes sin confirmación de ingreso | Monto, nombre y hora no disponibles; fuente no identificada |
| Abrir resumen inicial | 4 avisos, 3 con monto, S/55 | Yape 2/S35; Plin 1/S20; desconocido 1/S0; revisión manual S35 |
| Generar tres consecutivos y reenviar último ID | +3 y luego +0 | 3 nuevos/3 procesados; 0 nuevos/1 procesado |
| Crear tardío y pulsar Actualizar | Cola primero y un aviso nuevo después | 1 procesado/1 nuevo; horas diferenciadas |
| Buscar maria entre 14:29 y 14:32 | Coincidencia de María López | Un resultado |
| Crear invitación de mes y canjear como Nueva persona | Vista previa y cuenta colaboradora | Mateo Quispe vio negocio/permisos y consultó mes; no obtuvo administración |
| Cancelar retiro de Mateo | Permiso vigente conservado | Vigente después de cancelar |
| Confirmar retiro de Mateo | Estado revocado persistido | Revocado, con nombre en confirmación |
| Revocar Lucía y elegir su identidad | Consulta bloqueada | No tienes permiso para esta acción en este negocio |
| Vincular código virtual y comunicar | Pendiente y luego conectado virtual | Estado cambió solo tras simular comunicación |
| Enviar aviso y luego simular acuse | 1 enviado/0 confirmados y después 1/1 | Contadores separados correctos |
| Desconectar Box virtual | Conservar comunicación conocida | Desconectado, misma última hora y contadores |
| Simular caída y solicitar actualización | Advertencia, sin adelantar hora | Sin conexión y última hora válida conservada |
| Recargar página | Conservar cambios | 9 avisos, revocaciones y Box permanecieron |
| Recorrer cinco vistas a 1440, 768 y 390 px | Funciones accesibles sin overflow de documento | 15/15 vistas, anchos scroll 1425, 753 y 375 px respectivamente |
| Buscar referencias académicas en texto visible de demo | Sin HU, CA ni Gherkin | Ninguna referencia visible |

## Evidencia y límites

Los estados y cifras dependen del orden de las acciones. La suite usa un estado nuevo por criterio y un almacenamiento en memoria; la comprobación de navegador usó localStorage real y recarga. La prueba visual responsive incluye capturas de escritorio y móvil inspeccionadas en sesión. No equivale a una auditoría WCAG completa.

La caída simulada y el argumento offline del servicio se verificaron. Se implementaron listeners online/offline del navegador; no se forzó una desconexión física ni se verificó conectividad de Android. No confundir navigator.onLine con prueba de acceso a un servidor.

Los turnos restringen nuevas alertas locales, no la consulta del historial autorizado: esa es la distinción de CA02 de HU-030 y HU-042. Los turnos que cruzan medianoche se configuran como dos jornadas; esta versión valida fin posterior a inicio dentro del mismo día.

Los códigos de invitación se revisan y vuelven a validar al confirmar; los códigos del Box usado en otro negocio se rechazan. No hay captura, entrega push, autenticación, broker ni firmware.

## Verificación externa pendiente por criterio

- HU-008: CA02: se procesa una cola local, sin consultar un servicio remoto real.
- HU-009: CA01 y CA03: fuentes ficticias habilitadas; no se verifica captura ni permiso Android.
- HU-012: CA01 y alta del negocio: relación de cuenta y negocio ficticia; falta registro y autenticación reales.
- HU-013: CA01 y escenarios de envío: deduplicación comprobada en servicio local; sincronización remota pendiente.
- HU-026: CA03 y escenario de ingreso: cuenta propia ficticia; falta registro e inicio de sesión reales.
- HU-028: CA02: consulta bloqueada y destinatarios locales excluidos; entrega y bloqueo de alertas a celulares reales pendientes.
- HU-030: CA02 y escenarios de turno: destinatarios simulados evaluados en Lima; entrega real al celular pendiente.
- HU-031: CA01 y escenarios de inicio de sesión: rol derivado de membresía ficticia; falta autenticación real de cuentas.
- HU-036: CA01–CA03: telemetría, envío y acuse comprobados exclusivamente con Box virtual; ESP32 y broker pendientes.
- HU-037: CA01–CA03: código emitido en pantalla virtual; vinculación con Box físico pendiente.

Todas las HU: repetir los casos en GitHub Pages después de autorización de publicación; verificar trazabilidad con Needfinding, Arquitectura de Información y Figma con el equipo. No se hizo push ni despliegue.
