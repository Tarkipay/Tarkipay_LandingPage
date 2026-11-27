# Trazabilidad de las 30 HU después de la corrección

Fecha: 25 de noviembre de 2026, America/Lima. Fuente normativa: matriz_30_HU.json de la auditoría aportada; textos CA extraídos de las fichas detalladas TB2. Se conservan los 30 identificadores y los 90 criterios literalmente. No se sustituyen por los del backlog.

**Dictamen frente a las fichas originales: 16 cumplen, 14 parciales, 0 ausentes.** La auditoría de partida era 15/15. Solo HU-010 cambia de clasificación. HU-036 sigue parcial por integración física, aunque su inconsistencia local está corregida.

| HU | Nombre original | CA01 | CA02 | CA03 | Estado |
|---|---|---|---|---|---|
| HU-002 | Ver los datos de un aviso | Cumple | Cumple | Cumple | Cumple |
| HU-003 | Ver de qué billetera viene el aviso | Cumple | Cumple | Cumple | Cumple |
| HU-004 | Aclarar qué significa un aviso | Cumple | Cumple | Cumple | Cumple |
| HU-005 | Buscar por monto | Cumple | Cumple | Cumple | Cumple |
| HU-006 | Distinguir avisos del mismo monto | Cumple | Cumple | Cumple | Cumple |
| HU-011 | Leer el monto antes de entregar | Cumple | Cumple | Cumple | Cumple |
| HU-027 | Mostrar solo lo necesario al equipo | Cumple | Cumple | Cumple | Cumple |
| HU-034 | Ver cantidad y monto de los avisos | Cumple | Cumple | Cumple | Cumple |
| HU-040 | Buscar un aviso por nombre | Cumple | Cumple | Cumple | Cumple |
| HU-041 | Filtrar avisos por billetera | Cumple | Cumple | Cumple | Cumple |
| HU-001 | Avisos recientes | Cumple | Cumple | Cumple | Cumple |
| HU-007 | Saber qué hacer si falta un aviso | Cumple | Cumple | Cumple | Cumple |
| HU-008 | Saber si la lista está al día | Parcial | Parcial | Parcial | Parcial |
| HU-009 | Juntar avisos de distintas billeteras | Parcial | Cumple | Parcial | Parcial |
| HU-010 | No perder avisos seguidos | Cumple | Cumple | Cumple | Cumple |
| HU-012 | Crear el perfil del negocio | Parcial | Parcial | Cumple | Parcial |
| HU-013 | No repetir el mismo aviso | Parcial | Parcial | Cumple | Parcial |
| HU-025 | Generar un código para el equipo | Parcial | Cumple | Parcial | Parcial |
| HU-026 | Unirme al negocio con un código | Cumple | Parcial | Parcial | Parcial |
| HU-028 | Quitar el acceso a un colaborador | Cumple | Parcial | Cumple | Parcial |
| HU-029 | Miembros con acceso | Cumple | Cumple | Parcial | Parcial |
| HU-030 | Elegir los días y horas de avisos | Cumple | Parcial | Cumple | Parcial |
| HU-031 | Entrar según mi función | Parcial | Parcial | Parcial | Parcial |
| HU-032 | Dar acceso al historial por periodo | Cumple | Parcial | Cumple | Parcial |
| HU-033 | Revisar pagos por día, semana o mes | Cumple | Cumple | Cumple | Cumple |
| HU-036 | Consultar el estado del Box desde la app | Parcial | Cumple | Parcial | Parcial |
| HU-037 | Vincular el Box mediante un código | Parcial | Parcial | Parcial | Parcial |
| HU-039 | Buscar avisos por hora | Cumple | Cumple | Cumple | Cumple |
| HU-042 | Ver los avisos del día como colaborador | Parcial | Cumple | Parcial | Parcial |
| HU-043 | Ver un desglose por billetera | Cumple | Cumple | Cumple | Cumple |

## HU-002 Ver los datos de un aviso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El detalle muestra el monto, la hora, el nombre y la billetera solo si se pudieron leer. | Cumple |
| CA02 | Los datos que faltan aparecen como «No disponible». | Cumple |
| CA03 | Abrir un aviso no lo marca como pago comprobado. | Cumple |

**Comportamiento observado:** Detalle conserva campos; ausencias explícitas; leer no verifica.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en los tres CA de presentación.

## HU-003 Ver de qué billetera viene el aviso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El detalle muestra el nombre de la billetera cuando la app puede reconocerla. | Cumple |
| CA02 | Si no se reconoce la fuente, se muestra «Billetera no identificada». | Cumple |
| CA03 | El nombre de la fuente no se presenta como prueba de que el dinero ingresó. | Cumple |

**Comportamiento observado:** Yape, Plin y billetera no identificada visibles; sin comprobación bancaria automática.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en los CA de presentación; reconocimiento probado con eventos de ejemplo.

## HU-004 Aclarar qué significa un aviso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La alerta y el detalle se identifican como avisos detectados. | Cumple |
| CA02 | Abrir o leer el aviso no cambia su significado. | Cumple |
| CA03 | Si hay dudas, la pantalla indica que se puede consultar la billetera receptora. | Cumple |

**Comportamiento observado:** El detalle indica aviso detectado; abrir no acredita ingreso; orienta a billetera.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en los CA de significado y lectura.

## HU-005 Buscar por monto

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Puedo ingresar un monto positivo para filtrar los avisos. | Cumple |
| CA02 | La lista muestra los avisos que coinciden con ese monto. | Cumple |
| CA03 | Puedo quitar el filtro y volver a ver los demás. | Cumple |

**Comportamiento observado:** S/20 devuelve dos registros; −5 se rechaza; limpiar devuelve cuatro; 99 produce vacío útil.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en búsqueda por importe.

## HU-006 Distinguir avisos del mismo monto

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Dos avisos distintos del mismo monto aparecen por separado. | Cumple |
| CA02 | Cada uno conserva su hora y su nombre, si llegaron esos datos. | Cumple |
| CA03 | Si no hay datos suficientes para distinguirlos, la app no elige uno por su cuenta. | Cumple |

**Comportamiento observado:** Importes iguales tienen ID, nombre y hora propios; no se asigna cliente automáticamente.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en distinción de registros presentes.

## HU-011 Leer el monto antes de entregar

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El monto recibido se muestra de forma fácil de leer. | Cumple |
| CA02 | La app no pide escribir el precio de la venta para mostrar ese aviso. | Cumple |
| CA03 | Si falta el monto, se indica que no se pudo leer. | Cumple |

**Comportamiento observado:** Importe directo en tarjeta y detalle; sin registrar venta; monto ausente explícito.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en los CA de lectura.

## HU-027 Mostrar solo lo necesario al equipo

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El colaborador puede ver monto, hora, billetera y nombre cuando se pudieron leer. | Cumple |
| CA02 | La app no permite transferir dinero ni abrir la billetera del dueño. | Cumple |
| CA03 | Si falta un dato, aparece como no disponible en vez de pedir más acceso. | Cumple |

**Comportamiento observado:** Colaborador ve campos recibidos; faltantes explícitos; no hay transferencias ni apertura de billetera.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Cumple los tres CA de datos presentados; esto no certifica protección del almacenamiento local.

## HU-034 Ver cantidad y monto de los avisos

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El resumen muestra número de avisos y suma de los montos que pudieron leerse. | Cumple |
| CA02 | Un aviso sin monto se cuenta como aviso, pero no añade una cantidad inventada. | Cumple |
| CA03 | El resumen aclara que no muestra el saldo real de ninguna billetera. | Cumple |

**Comportamiento observado:** Día: 4 avisos, 3 con importe, S/55; revisión manual S/35. Mes: 5 y S/90. CSV coherente.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en cálculo observado. Los valores son avisos, no saldo.

## HU-040 Buscar un aviso por nombre

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La búsqueda usa el nombre que pudo leerse en el aviso. | Cumple |
| CA02 | Los resultados muestran monto y hora para ayudar a distinguirlos. | Cumple |
| CA03 | Si el aviso no trae nombre, la app no le asigna uno por su cuenta. | Cumple |

**Comportamiento observado:** maria encuentra María López, conserva importe y hora; no inventa nombre faltante.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en búsqueda de los registros disponibles.

## HU-041 Filtrar avisos por billetera

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El filtro ofrece las fuentes reconocidas por ese negocio. | Cumple |
| CA02 | Solo aparecen los avisos identificados con la billetera elegida. | Cumple |
| CA03 | Los avisos de origen desconocido quedan accesibles al quitar el filtro. | Cumple |

**Comportamiento observado:** Filtros Yape/Plin/Sin identificar y limpieza conservan acceso a desconocidos.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en filtro de origen.

## HU-001 Avisos recientes

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Los avisos más nuevos aparecen primero. | Cumple |
| CA02 | Cada fila muestra monto y hora si se pudieron leer. | Cumple |
| CA03 | Una lista vacía no se presenta como prueba de que nadie pagó. | Cumple |

**Comportamiento observado:** Lista ordenada por eventAt o receivedAt; 100 eventos desordenados mantienen orden; vacío prudente.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en orden y presentación para eventos presentes. La pérdida concurrente se trata en HU-010.

## HU-007 Saber qué hacer si falta un aviso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La lista vacía no afirma que el cliente no pagó. | Cumple |
| CA02 | La app indica que se debe consultar la billetera receptora si hace falta comprobar el ingreso. | Cumple |
| CA03 | Un aviso que aparece más tarde conserva su hora y no se presenta como un pago nuevo distinto. | Cumple |

**Comportamiento observado:** Vacío orienta a billetera; tardío conserva ID y dos marcas temporales; reenvío no duplica.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Cumple con eventos suministrados al modelo; no demuestra captura Android.

## HU-008 Saber si la lista está al día

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Se muestra la hora de la última actualización realizada. | Parcial |
| CA02 | Puedo solicitar una nueva actualización. | Parcial |
| CA03 | Si falla la conexión, veo una advertencia y la hora anterior. | Parcial |

**Comportamiento observado:** Actualiza cola local y hora; desconexión real del navegador advierte y conserva última hora válida.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** No consulta servicio remoto ni detecta caída del backend con navegador en línea.

## HU-009 Juntar avisos de distintas billeteras

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La lista reúne los avisos captados de las fuentes habilitadas. | Parcial |
| CA02 | Cada aviso conserva el nombre de su billetera si se reconoce. | Cumple |
| CA03 | Una fuente sin permiso o sin notificaciones no se inventa en la lista. | Parcial |

**Comportamiento observado:** Consolida eventos ficticios y respeta fuentes activas en el ingreso.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** No captura notificaciones ni verifica permisos Android; las fuentes son configuración ficticia.

## HU-010 No perder avisos seguidos

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Los avisos diferentes se guardan como registros separados. | Cumple |
| CA02 | La lista los ordena usando la hora disponible. | Cumple |
| CA03 | La llegada de uno nuevo no borra el anterior. | Cumple |

**Comportamiento observado:** Aviso y perfil concurrentes sobreviven en IndexedDB tras recarga. Revocaciones y canjes se validan dentro de la transacción; conflicto de la misma versión rechazado.
**Regresión:** D03 corregido; C01–C17 de tests/fixes-browser.cjs; CA01/CA02 conservados por suite 010 y B06.
**Límite:** Sin déficit reproducido para los tres CA de registros disponibles en el navegador. Esto no acredita captura Android.

**Simulador:** {"CA01": "Verificado", "CA02": "Verificado", "CA03": "Verificado con dos pestañas reales y reloj controlado"}
**Código actual:** js/demo-core.js, js/demo-store.js y js/demo-ui.js. Las líneas anteriores de la auditoría se conservan solo en sources/.

## HU-012 Crear el perfil del negocio

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La cuenta nueva queda asociada a un negocio con nombre identificable. | Parcial |
| CA02 | Solo el administrador puede cambiar el nombre y los datos de ese negocio. | Parcial |
| CA03 | Antes de guardar se piden los datos obligatorios; no se solicitan claves de la billetera. | Cumple |

**Comportamiento observado:** Negocios con ID propio, validación obligatoria, edición protegida dentro del modelo y persistencia.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Cuenta ficticia; sin registro/autenticación real ni autorización remota de administrador.

## HU-013 No repetir el mismo aviso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Un aviso conserva un identificador al sincronizarse. | Parcial |
| CA02 | Reenviar ese identificador no añade otro registro. | Parcial |
| CA03 | Dos avisos realmente diferentes del mismo monto se mantienen separados. | Cumple |

**Comportamiento observado:** Deduplica el ID dentro y entre actualizaciones y recargas; conserva distintos IDs del mismo monto.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Los IDs proceden del generador o API local; no hay contrato de identidad de la cadena Android/servicio/Box.

## HU-025 Generar un código para el equipo

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Solo el administrador puede crear el código y ver hasta cuándo sirve. | Parcial |
| CA02 | El código corresponde a un negocio y a los permisos que el dueño eligió. | Cumple |
| CA03 | Un código vencido o ya utilizado no da acceso al negocio. | Parcial |

**Comportamiento observado:** Código local con negocio, alcance y vencimiento; generar no activa miembro; inválidos/usados rechazados.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Administrador ficticio y código solo en localStorage: otro contexto aislado rechaza un código vigente.

## HU-026 Unirme al negocio con un código

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Antes de unirse se muestra el nombre del negocio y el acceso concedido. | Cumple |
| CA02 | El código inválido, vencido o utilizado no da acceso a los cobros. | Parcial |
| CA03 | La cuenta del colaborador no pide la clave de Yape ni permite entrar como administrador. | Parcial |

**Comportamiento observado:** Vista previa, cancelar y aceptar funcionan; crea membresía colaboradora local.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin cuenta real ni canje entre dispositivos; selector y recarga permiten volver a administración ficticia.

## HU-028 Quitar el acceso a un colaborador

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Antes de retirar el acceso se muestra el nombre de la persona. | Cumple |
| CA02 | Tras confirmarlo, deja de recibir nuevas alertas y no puede hacer nuevas consultas. | Parcial |
| CA03 | Los avisos del negocio siguen disponibles para el administrador. | Cumple |

**Comportamiento observado:** Confirma nombre, cancelar conserva; confirmar bloquea consultas API; historial de administrador se conserva.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Revoca membresía y entregas locales; no existe revocación de sesiones ni alertas remotas.

## HU-029 Miembros con acceso

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La lista muestra nombre, permiso y estado de cada miembro. | Cumple |
| CA02 | Los accesos revocados se distinguen de los vigentes. | Cumple |
| CA03 | Solo una persona con permiso de administración puede cambiar ese alcance. | Parcial |

**Comportamiento observado:** Nombre, rol, alcance, turno, activo/revocado correctos; colaborador rechazado por API.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** CA03 se impone dentro de una identidad ficticia seleccionable, sin autoridad confiable.

## HU-030 Elegir los días y horas de avisos

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El horario se define por persona, días y horas en la zona horaria del negocio. | Cumple |
| CA02 | Fuera de ese horario no se envían nuevas alertas a esa persona. | Parcial |
| CA03 | Cambiar el horario no borra los pagos anteriores ni amplía el historial permitido. | Cumple |

**Comportamiento observado:** Días/horas por miembro en America/Lima; fuera del turno no genera entrega local; cambios conservan avisos.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** No envía alertas a dispositivos reales; deliveries es un registro de simulación.

## HU-031 Entrar según mi función

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El rol proviene de la cuenta y de los permisos otorgados por el administrador. | Parcial |
| CA02 | El administrador ve negocio, Box, equipo e informes; el colaborador solo lo autorizado. | Parcial |
| CA03 | Cambiar de pantalla no permite convertirse en administrador. | Parcial |

**Comportamiento observado:** API valida membresía y rol; cambiar pestaña no basta para administrar en esa sesión.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Identidades seleccionables, recarga inicia como U-1/admin y datos completos en almacenamiento local.

## HU-032 Dar acceso al historial por periodo

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El permiso de hoy está separado del acceso a semana y mes. | Cumple |
| CA02 | El colaborador no ve pagos anteriores fuera de su alcance. | Parcial |
| CA03 | El administrador puede cambiar el alcance sin alterar los avisos guardados. | Cumple |

**Comportamiento observado:** Distingue hoy/semana/mes y bloquea consulta/detalle por API; reducir alcance no borra registros.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** El historial prohibido sigue legible en localStorage; no hay exclusión de datos en respuesta de servidor.

## HU-033 Revisar pagos por día, semana o mes

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La vista permite elegir día, semana, mes o un rango de meses disponibles. | Cumple |
| CA02 | El periodo elegido y el número de avisos quedan claros. | Cumple |
| CA03 | Un periodo sin registros aparece vacío sin concluir que no hubo pagos. | Cumple |

**Comportamiento observado:** Día, semana, mes y rango de meses; periodo/cantidad visibles; vacío no acusa falta de pago.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en los CA de consulta de datos disponibles.

## HU-036 Consultar el estado del Box desde la app

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La ficha muestra la última conexión conocida del equipo. | Parcial |
| CA02 | La cantidad se etiqueta como avisos enviados al Box, no como pagos comprobados. | Cumple |
| CA03 | Una falta de conexión se muestra sin asegurar que el Box enseñó esos avisos. | Parcial |

**Comportamiento observado:** Una sola política de conexión; después de 120000 ms el nuevo aviso queda pendiente sin intento, aceptación ni acuse. Reconexión y acuses idempotentes comprobados virtualmente.
**Regresión:** D01 corregido localmente; T01–T07 y R03 de tests/fixes-browser.cjs. HU sigue Parcial ante el equipo físico.
**Límite:** No existe telemetría ni acuse de un Box físico. Se corrigió la contradicción local; CA01 y CA03 siguen parciales frente al requisito original de equipo real.

**Simulador:** {"CA01": "Última comunicación virtual verificada", "CA02": "Cantidad de avisos aceptados por canal virtual, no pagos", "CA03": "Verificado en simulador: timeout, desconexión manual, reconexión y acuse explícito"}
**Código actual:** js/demo-core.js, js/demo-store.js y js/demo-ui.js. Las líneas anteriores de la auditoría se conservan solo en sources/.

## HU-037 Vincular el Box mediante un código

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Un Box sin vincular muestra un código de vinculación de vigencia limitada. | Parcial |
| CA02 | Solo el administrador puede introducirlo y confirmar a qué negocio se asociará. | Parcial |
| CA03 | El código vencido o utilizado no vincula un equipo ni muestra pagos. | Parcial |

**Comportamiento observado:** Código temporal virtual, vista previa, cancelar/confirmar y rechazo de vacío, inválido, vencido/usado.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Código generado por el navegador; no existe Box físico ni registro compartido que confirme vinculación.

## HU-039 Buscar avisos por hora

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | Se puede elegir un intervalo de horas dentro del día visible. | Cumple |
| CA02 | La lista conserva separados los avisos que coincidan en ese intervalo. | Cumple |
| CA03 | Quitar el filtro devuelve todos los avisos del periodo. | Cumple |

**Comportamiento observado:** Intervalo de horas combinado con importe/nombre/fuente; inválido rechazado; quitarlo conserva periodo.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en búsqueda horaria; si falta hora original usa recepción y lo explica.

## HU-042 Ver los avisos del día como colaborador

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | La vista de hoy muestra solo los avisos del negocio al que tengo acceso. | Parcial |
| CA02 | Cada aviso conserva los datos que pudieron leerse. | Cumple |
| CA03 | Para ver otros días necesito el permiso de historial correspondiente. | Parcial |

**Comportamiento observado:** Vista de hoy respeta membresía y negocio en API; conserva datos; periodos bloqueados según alcance.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Negocio/historial solo restringidos en modelo local; datos íntegros accesibles y cambio libre de identidad.

## HU-043 Ver un desglose por billetera

| CA | Texto original sin reformulación | Estado frente a la ficha |
|---|---|---|
| CA01 | El resumen separa los avisos de cada fuente reconocida y muestra su cantidad. | Cumple |
| CA02 | Los avisos sin billetera identificada se muestran aparte. | Cumple |
| CA03 | Se indica que las sumas provienen de avisos detectados y no muestran saldos reales. | Cumple |

**Comportamiento observado:** Yape 2/S/35, Plin 1/S/20, desconocido 1/S/0 sin monto; filtros/periodos recalculan.
**Regresión:** Suite original CA01–CA03 en tests/acceptance.cjs y escenarios de navegador B01–B21; sin nuevas integraciones.
**Límite:** Sin déficit en agregación y significado de importes disponibles.
