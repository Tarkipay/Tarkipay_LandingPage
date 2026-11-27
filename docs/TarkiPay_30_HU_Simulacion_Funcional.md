# TarkiPay simulación funcional de las 30 historias de usuario

La demo representa y comprueba las 30 historias seleccionadas en un ecosistema virtual integrado. La Matriz A registra 30 que cumplen en demo. La Matriz B conserva 16 que cumplen y 14 parciales frente al sistema original; no se acredita Android, autenticación externa, backend, MQTT ni Box físico.

## Alcance y arquitectura

El receptor genera notificaciones con ID estable. El procesador valida permiso, fuente y formato y conserva campos ausentes. El servicio virtual guarda avisos y la última sincronización exitosa; los fallos dejan colas. El broker virtual distribuye por negocio, membresía, alcance y turno, revalidando pendientes. El Box acepta envíos solo con comunicación vigente y broker disponible; el acuse explícito confirma la recepción virtual y actualiza su pantalla. Ninguna fase acredita un abono bancario.

Se conserva IndexedDB tarkipay-demo-v4 y el object store entities. receiverEvents es una colección adicional de registros por entidad; leer datos anteriores la inicializa vacía, sin reemplazar avisos, invitaciones o membresías ni cambiar la versión de la base. Los comandos siguen usando transacciones readwrite con lectura, autorización y escritura por entidad. El reloj es un desplazamiento persistido por negocio sobre el reloj base. Las sesiones ficticias son por pestaña; no se guardan contraseñas. Las pestañas de la versión nueva comparten el modelo; no se deben ejecutar versiones antiguas y nuevas simultáneamente en el mismo origen.

El parser reconoce formatos ficticios limitados y no pretende cubrir versiones reales de Yape o Plin. El broker es un bus persistente local, no una conexión MQTT ni Mosquitto. Los escenarios API síncronos de Node son pruebas del modelo aislado; la atomicidad del navegador se sustenta en las regresiones de IndexedDB y dos pestañas. Las lecturas del modelo son snapshots para presentación; la aplicación los recarga antes de renderizar y las mutaciones revalidan en la transacción. No hay autoridad de seguridad frente a manipulación por el propietario del navegador. No se prueba entrega en segundo plano del sistema operativo.

## Fuentes y checkpoint

Se inspeccionaron las 48 fichas y las 48 entradas del backlog por separado. Los 90 textos de la selección fija coinciden exactamente entre matriz_30_HU.json, REQUISITOS_ORIGINALES.json y TB2_extraido.txt; véase evidencias/contraste-criterios.json. El checkpoint previo está en CHECKPOINT.md y su manifiesto SHA256 en evidencias/checkpoint-pre-simulacion.json. Los originales y sus pruebas permanecen en sources/.

## Matrices independientes

| HU | Historia | Matriz A | Matriz B |
|---|---|---|---|
| HU-001 | Avisos recientes | Cumple en demo | Cumple |
| HU-002 | Ver los datos de un aviso | Cumple en demo | Cumple |
| HU-003 | Ver de qué billetera viene el aviso | Cumple en demo | Cumple |
| HU-004 | Aclarar qué significa un aviso | Cumple en demo | Cumple |
| HU-005 | Buscar por monto | Cumple en demo | Cumple |
| HU-006 | Distinguir avisos del mismo monto | Cumple en demo | Cumple |
| HU-007 | Saber qué hacer si falta un aviso | Cumple en demo | Cumple |
| HU-008 | Saber si la lista está al día | Cumple en demo | Parcial |
| HU-009 | Juntar avisos de distintas billeteras | Cumple en demo | Parcial |
| HU-010 | No perder avisos seguidos | Cumple en demo | Cumple |
| HU-011 | Leer el monto antes de entregar | Cumple en demo | Cumple |
| HU-012 | Crear el perfil del negocio | Cumple en demo | Parcial |
| HU-013 | No repetir el mismo aviso | Cumple en demo | Parcial |
| HU-025 | Generar un código para el equipo | Cumple en demo | Parcial |
| HU-026 | Unirme al negocio con un código | Cumple en demo | Parcial |
| HU-027 | Mostrar solo lo necesario al equipo | Cumple en demo | Cumple |
| HU-028 | Quitar el acceso a un colaborador | Cumple en demo | Parcial |
| HU-029 | Miembros con acceso | Cumple en demo | Parcial |
| HU-030 | Elegir los días y horas de avisos | Cumple en demo | Parcial |
| HU-031 | Entrar según mi función | Cumple en demo | Parcial |
| HU-032 | Dar acceso al historial por periodo | Cumple en demo | Parcial |
| HU-033 | Revisar pagos por día, semana o mes | Cumple en demo | Cumple |
| HU-034 | Ver cantidad y monto de los avisos | Cumple en demo | Cumple |
| HU-036 | Consultar el estado del Box desde la app | Cumple en demo | Parcial |
| HU-037 | Vincular el Box mediante un código | Cumple en demo | Parcial |
| HU-039 | Buscar avisos por hora | Cumple en demo | Cumple |
| HU-040 | Buscar un aviso por nombre | Cumple en demo | Cumple |
| HU-041 | Filtrar avisos por billetera | Cumple en demo | Cumple |
| HU-042 | Ver los avisos del día como colaborador | Cumple en demo | Parcial |
| HU-043 | Ver un desglose por billetera | Cumple en demo | Cumple |

Total A: {'Cumple en demo': 30}. Total B: {'Cumple': 16, 'Parcial': 14}.

## Resultados de pruebas

94 pruebas originales del modelo, 27 regresiones de concurrencia y Box, 21 escenarios de auditoría de navegador, 12 grupos nuevos del modelo y 5 grupos nuevos end-to-end: todos PASS, sin excepciones JavaScript en las ejecuciones finales. Además, el recorrido visual verifica las cinco vistas a 1440, 768 y 390 px. Las pruebas comprueban entidades, permisos, marcas temporales, contadores, colas y recarga; no solo mensajes de éxito. Los adaptadores abren el nuevo acordeón para ejecutar las acciones antiguas; no cambian sus aserciones salvo la adaptación de fechas ya documentada en la entrega premium.

## Guía por historia

Además pasaron los 4 recorridos de formularios premium, los 17 grupos de verificación visual y navegación, y los 2 casos de actualización de IndexedDB premium y concurrencia de notificación/perfil. Se conservaron las entidades anteriores y ambas operaciones concurrentes sobrevivieron a la recarga.

Diagnóstico histórico adicional sin alterar aserciones: 15 PASS y 2 FAIL. D04 confirma que el historial local es inspeccionable y sigue siendo una limitación de seguridad de la Matriz B. D05 falla en la fixture síncrona Node sin sessionStorage, que no representa una recarga de pestaña; la sesión real del navegador se comprueba separadamente en N03 y conserva al colaborador o la sesión vacía. No se ocultan esos resultados ni se presentan como pruebas de integración aprobadas.

### HU-001 Avisos recientes

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** Los avisos más nuevos aparecen primero. A: Cumple en demo. B: Cumple.
- **CA02 original:** Cada fila muestra monto y hora si se pudieron leer. A: Cumple en demo. B: Cumple.
- **CA03 original:** Una lista vacía no se presenta como prueba de que nadie pagó. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Lista ordenada por eventAt o receivedAt; 100 eventos desordenados mantienen orden; vacío prudente.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Abre Avisos y compara el orden de las horas. Simula avisos consecutivos y comprueba que los nuevos aparecen primero; una búsqueda sin resultados debe orientar a revisar la billetera.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S01; S07; N01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-002 Ver los datos de un aviso

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El detalle muestra el monto, la hora, el nombre y la billetera solo si se pudieron leer. A: Cumple en demo. B: Cumple.
- **CA02 original:** Los datos que faltan aparecen como «No disponible». A: Cumple en demo. B: Cumple.
- **CA03 original:** Abrir un aviso no lo marca como pago comprobado. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Detalle conserva campos; ausencias explícitas; leer no verifica.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones detail. Presentación en js/demo-ui.js.

**Cómo comprobar:** Abre un aviso con datos y después el aviso sin monto. Comprueba campos originales, ausencias explícitas y que abrir no lo verifica automáticamente.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S03; N01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-003 Ver de qué billetera viene el aviso

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El detalle muestra el nombre de la billetera cuando la app puede reconocerla. A: Cumple en demo. B: Cumple.
- **CA02 original:** Si no se reconoce la fuente, se muestra «Billetera no identificada». A: Cumple en demo. B: Cumple.
- **CA03 original:** El nombre de la fuente no se presenta como prueba de que el dinero ingresó. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Yape, Plin y billetera no identificada visibles; sin comprobación bancaria automática.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones validateEvent y detail. Presentación en js/demo-ui.js.

**Cómo comprobar:** Revisa avisos de Yape, Plin y fuente no identificada; el origen no debe presentarse como comprobación de ingreso.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S01; S03; N01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-004 Aclarar qué significa un aviso

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** La alerta y el detalle se identifican como avisos detectados. A: Cumple en demo. B: Cumple.
- **CA02 original:** Abrir o leer el aviso no cambia su significado. A: Cumple en demo. B: Cumple.
- **CA03 original:** Si hay dudas, la pantalla indica que se puede consultar la billetera receptora. A: Cumple en demo. B: Cumple.

**Implementación simulada:** El detalle indica aviso detectado; abrir no acredita ingreso; orienta a billetera.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones detail y verify. Presentación en js/demo-ui.js.

**Cómo comprobar:** Abre y cierra un aviso; comprueba el significado de aviso detectado y la indicación de revisar la billetera.

**Pruebas:** Tres CA originales PASS; evidencia complementaria N01; auditoría B01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-005 Buscar por monto

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** Puedo ingresar un monto positivo para filtrar los avisos. A: Cumple en demo. B: Cumple.
- **CA02 original:** La lista muestra los avisos que coinciden con ese monto. A: Cumple en demo. B: Cumple.
- **CA03 original:** Puedo quitar el filtro y volver a ver los demás. A: Cumple en demo. B: Cumple.

**Implementación simulada:** S/20 devuelve dos registros; −5 se rechaza; limpiar devuelve cuatro; 99 produce vacío útil.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Busca S/20, comprueba coincidencias, busca S/99 y limpia el filtro para recuperar los registros.

**Pruebas:** Tres CA originales PASS; evidencia complementaria auditoría B02–B05.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-006 Distinguir avisos del mismo monto

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** Dos avisos distintos del mismo monto aparecen por separado. A: Cumple en demo. B: Cumple.
- **CA02 original:** Cada uno conserva su hora y su nombre, si llegaron esos datos. A: Cumple en demo. B: Cumple.
- **CA03 original:** Si no hay datos suficientes para distinguirlos, la app no elige uno por su cuenta. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Importes iguales tienen ID, nombre y hora propios; no se asigna cliente automáticamente.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Busca S/20 y compara los dos registros separados, sus emisores y horas. No se selecciona un cliente automáticamente.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S07; auditoría B02.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-007 Saber qué hacer si falta un aviso

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** La lista vacía no afirma que el cliente no pagó. A: Cumple en demo. B: Cumple.
- **CA02 original:** La app indica que se debe consultar la billetera receptora si hace falta comprobar el ingreso. A: Cumple en demo. B: Cumple.
- **CA03 original:** Un aviso que aparece más tarde conserva su hora y no se presenta como un pago nuevo distinto. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Vacío orienta a billetera; tardío conserva ID y dos marcas temporales; reenvío no duplica.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones receiveNotification y refresh. Presentación en js/demo-ui.js.

**Cómo comprobar:** En simulación elige aviso tardío; actualiza la lista y revisa hora original y recepción. Reenvía el evento y comprueba un solo registro.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S07; auditoría B06.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-008 Saber si la lista está al día

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Se muestra la hora de la última actualización realizada. A: Cumple en demo. B: Parcial.
- **CA02 original:** Puedo solicitar una nueva actualización. A: Cumple en demo. B: Parcial.
- **CA03 original:** Si falla la conexión, veo una advertencia y la hora anterior. A: Cumple en demo. B: Parcial.

**Implementación simulada:** El servicio virtual registra último intento, último éxito y error por separado. sync conserva la hora válida ante caída del servicio aunque el navegador siga conectado; receptor y servicio tienen fallos independientes y colas recuperables.

**Ubicación:** Avisos y búsqueda y Controles de simulación. Código js/demo-core.js, funciones sync. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Avisos, pulsa Actualizar lista. Abre Controles de simulación, desactiva Servicio virtual y aplica; avanza un minuto y actualiza. Comprueba intento nuevo, éxito anterior y advertencia. Reactiva y actualiza.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S04; S05; N01.

**Límite literal:** El servicio es virtual; no hay consulta ni disponibilidad de un backend remoto real.

### HU-009 Juntar avisos de distintas billeteras

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** La lista reúne los avisos captados de las fuentes habilitadas. A: Cumple en demo. B: Parcial.
- **CA02 original:** Cada aviso conserva el nombre de su billetera si se reconoce. A: Cumple en demo. B: Cumple.
- **CA03 original:** Una fuente sin permiso o sin notificaciones no se inventa en la lista. A: Cumple en demo. B: Parcial.

**Implementación simulada:** El teléfono virtual genera textos compatibles Yape/Plin. Un procesador comprueba permiso, fuente y formato, ignora contenido ajeno y conserva ausencias. Cada recepción deja un registro de trazabilidad con el mismo identificador.

**Ubicación:** Controles de simulación y Fuentes y TarkiBox. Código js/demo-core.js, funciones notification y processReceiver. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Controles de simulación, elige fuente y tipo y envía al receptor. Prueba incompleto y contenido ajeno. Revoca permiso o desactiva la fuente en Fuentes y TarkiBox; comprueba rechazo y ausencia de nuevos registros.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S01; S02; S03; N01.

**Límite literal:** No se capturan notificaciones ni permisos del sistema Android real.

### HU-010 No perder avisos seguidos

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** Los avisos diferentes se guardan como registros separados. A: Cumple en demo. B: Cumple.
- **CA02 original:** La lista los ordena usando la hora disponible. A: Cumple en demo. B: Cumple.
- **CA03 original:** La llegada de uno nuevo no borra el anterior. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Aviso y perfil concurrentes sobreviven en IndexedDB tras recarga. Revocaciones y canjes se validan dentro de la transacción; conflicto de la misma versión rechazado.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones refresh y deliver. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Controles de simulación elige tres consecutivos. Comprueba que se agregan tres IDs diferentes y permanecen los avisos anteriores.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S01; S07; C01–C17.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-011 Leer el monto antes de entregar

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El monto recibido se muestra de forma fácil de leer. A: Cumple en demo. B: Cumple.
- **CA02 original:** La app no pide escribir el precio de la venta para mostrar ese aviso. A: Cumple en demo. B: Cumple.
- **CA03 original:** Si falta el monto, se indica que no se pudo leer. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Importe directo en tarjeta y detalle; sin registrar venta; monto ausente explícito.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Consulta el importe directamente en Avisos sin registrar una venta. Abre el registro incompleto y comprueba ausencia de monto.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S03; N01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-012 Crear el perfil del negocio

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** La cuenta nueva queda asociada a un negocio con nombre identificable. A: Cumple en demo. B: Parcial.
- **CA02 original:** Solo el administrador puede cambiar el nombre y los datos de ese negocio. A: Cumple en demo. B: Parcial.
- **CA03 original:** Antes de guardar se piden los datos obligatorios; no se solicitan claves de la billetera. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Negocios con ID propio, propietario y membresía administradora. Los obligatorios y la autorización se validan en el modelo y en la transacción; persisten tras recargar.

**Ubicación:** Personalizar mi negocio. Código js/demo-core.js, funciones createBusiness y updateBusiness. Presentación en js/demo-ui.js.

**Cómo comprobar:** Personalizar mi negocio permite editar o crear otro negocio ficticio. Prueba obligatorios vacíos, crea con nombre y responsable, recarga y comprueba aislamiento. Cambia a colaborador y prueba rechazo administrativo.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S11; auditoría B13/B16.

**Límite literal:** No hay registro ni autoridad de cuenta externa; las identidades son personajes locales.

### HU-013 No repetir el mismo aviso

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Un aviso conserva un identificador al sincronizarse. A: Cumple en demo. B: Parcial.
- **CA02 original:** Reenviar ese identificador no añade otro registro. A: Cumple en demo. B: Parcial.
- **CA03 original:** Dos avisos realmente diferentes del mismo monto se mantienen separados. A: Cumple en demo. B: Cumple.

**Implementación simulada:** El ID acompaña la notificación, el procesamiento, el registro del servicio y las entregas del broker/Box. El reenvío reutiliza ese ID; diferentes eventos del mismo importe permanecen separados.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones receiveNotification y refresh. Presentación en js/demo-ui.js.

**Cómo comprobar:** Genera un aviso compatible, elige Reenviar el mismo evento y repite después de recargar. El número de registros no aumenta. Genera otro aviso compatible y comprueba que se conserva como registro distinto.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S01; S06; S07; N01/N02.

**Límite literal:** La identidad se conserva en toda la cadena virtual; falta contrato y prueba con emisor Android, transporte y dispositivo reales.

### HU-025 Generar un código para el equipo

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Solo el administrador puede crear el código y ver hasta cuándo sirve. A: Cumple en demo. B: Parcial.
- **CA02 original:** El código corresponde a un negocio y a los permisos que el dueño eligió. A: Cumple en demo. B: Cumple.
- **CA03 original:** Un código vencido o ya utilizado no da acceso al negocio. A: Cumple en demo. B: Parcial.

**Implementación simulada:** Invitaciones con negocio, permisos, turno, emisión, vencimiento, consumo y revocación. Los estados disponible/utilizado/vencido/revocado se derivan del registro. Generar no concede membresía.

**Ubicación:** Equipo y horarios. Código js/demo-core.js, funciones invite. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Equipo y horarios, introduce nombre, alcance y turno; genera código y comprueba que no añade miembro. Avanza el reloj 15 minutos y prueba el canje. Genera otro y revócalo desde el historial de invitaciones.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S08; N04; C06–C10.

**Límite literal:** No hay administrador autenticado ni servicio compartido entre dispositivos; los códigos pertenecen al mismo origen del navegador.

### HU-026 Unirme al negocio con un código

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Antes de unirse se muestra el nombre del negocio y el acceso concedido. A: Cumple en demo. B: Cumple.
- **CA02 original:** El código inválido, vencido o utilizado no da acceso a los cobros. A: Cumple en demo. B: Parcial.
- **CA03 original:** La cuenta del colaborador no pide la clave de Yape ni permite entrar como administrador. A: Cumple en demo. B: Parcial.

**Implementación simulada:** La identidad ficticia revisa el negocio y alcance, confirma o cancela. El canje vuelve a validar y consume el código en la transacción atómica; solo crea rol colaborador.

**Ubicación:** Unirme con un código de invitación y selector de identidad ficticia. Código js/demo-core.js, funciones previewInvitation y join. Presentación en js/demo-ui.js.

**Cómo comprobar:** Elige Nueva persona, abre Unirme con un código de invitación, introduce un código disponible y revisa permisos. Cancela o confirma. Prueba códigos incorrectos, vencidos, revocados y ya usados.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S08; N04; C06–C10.

**Límite literal:** La sesión y el canje son ficticios y locales; no se autentica una cuenta externa.

### HU-027 Mostrar solo lo necesario al equipo

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El colaborador puede ver monto, hora, billetera y nombre cuando se pudieron leer. A: Cumple en demo. B: Cumple.
- **CA02 original:** La app no permite transferir dinero ni abrir la billetera del dueño. A: Cumple en demo. B: Cumple.
- **CA03 original:** Si falta un dato, aparece como no disponible en vez de pedir más acceso. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Colaborador ve campos recibidos; faltantes explícitos; no hay transferencias ni apertura de billetera.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Selecciona Lucía y consulta el detalle. Comprueba campos disponibles y ausencias; no hay acciones para transferir ni abrir la billetera del titular.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S03; auditoría B12/B13.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-028 Quitar el acceso a un colaborador

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Antes de retirar el acceso se muestra el nombre de la persona. A: Cumple en demo. B: Cumple.
- **CA02 original:** Tras confirmarlo, deja de recibir nuevas alertas y no puede hacer nuevas consultas. A: Cumple en demo. B: Parcial.
- **CA03 original:** Los avisos del negocio siguen disponibles para el administrador. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Retiro con nombre y confirmación. La membresía se revoca, no recibe nuevos destinatarios, los pendientes se revalidan al reintentar y la sesión activa pierde nuevas consultas. El administrador conserva los avisos.

**Ubicación:** Equipo y horarios. Código js/demo-core.js, funciones revokeMember y retryBroker. Presentación en js/demo-ui.js.

**Cómo comprobar:** Abre otra pestaña con Lucía. En administración retira su acceso, revisa su nombre y confirma. Actualiza o intenta una consulta en la otra pestaña; comprueba bloqueo, recarga e historial de administración.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S09; N03; C04/C05.

**Límite literal:** La revocación se impone en la simulación; falta invalidación en sesiones y alertas de dispositivos reales.

### HU-029 Miembros con acceso

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** La lista muestra nombre, permiso y estado de cada miembro. A: Cumple en demo. B: Cumple.
- **CA02 original:** Los accesos revocados se distinguen de los vigentes. A: Cumple en demo. B: Cumple.
- **CA03 original:** Solo una persona con permiso de administración puede cambiar ese alcance. A: Cumple en demo. B: Parcial.

**Implementación simulada:** La lista presenta nombre, rol, alcance, vigencia y turno; su negocio se identifica en la cabecera. La edición administrativa vuelve a comprobar el permiso dentro del modelo.

**Ubicación:** Equipo y horarios. Código js/demo-core.js, funciones team y editMember. Presentación en js/demo-ui.js.

**Cómo comprobar:** Revisa los integrantes y sus permisos en Equipo. Edita alcance y turno, guarda y comprueba cambios. Desde identidad colaboradora comprueba que no se habilitan las funciones administrativas.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S09; N03; auditoría B15.

**Límite literal:** La administración local no es una autoridad confiable frente a manipulación del navegador.

### HU-030 Elegir los días y horas de avisos

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** El horario se define por persona, días y horas en la zona horaria del negocio. A: Cumple en demo. B: Cumple.
- **CA02 original:** Fuera de ese horario no se envían nuevas alertas a esa persona. A: Cumple en demo. B: Parcial.
- **CA03 original:** Cambiar el horario no borra los pagos anteriores ni amplía el historial permitido. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Días y horas por persona en America/Lima. El reloj virtual permite probar inicio inclusivo y fin exclusivo. Se revalidan turnos al distribuir pendientes; la consulta conserva su alcance independiente.

**Ubicación:** Equipo y horarios y reloj de Controles de simulación. Código js/demo-core.js, funciones inShift y retryBroker. Presentación en js/demo-ui.js.

**Cómo comprobar:** Edita un turno para que finalice un minuto después del reloj virtual. Genera un aviso dentro del turno; avanza un minuto y genera otro. Comprueba destinatarios del broker y que los registros e historial anterior permanecen.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S10; S09.

**Límite literal:** La entrega y el turno se validan en el broker virtual; faltan alertas reales y permisos del sistema operativo.

### HU-031 Entrar según mi función

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** El rol proviene de la cuenta y de los permisos otorgados por el administrador. A: Cumple en demo. B: Parcial.
- **CA02 original:** El administrador ve negocio, Box, equipo e informes; el colaborador solo lo autorizado. A: Cumple en demo. B: Parcial.
- **CA03 original:** Cambiar de pantalla no permite convertirse en administrador. A: Cumple en demo. B: Parcial.

**Implementación simulada:** La sesión ficticia se conserva por pestaña mediante sessionStorage y no vuelve a U-1 al recargar. Existe estado sin sesión. Cambiar identidad ficticia es explícito y los roles provienen de membresías, no de la pantalla seleccionada.

**Ubicación:** Selector de identidad ficticia y Controles de simulación. Código js/demo-core.js, funciones selectIdentity, membership y requireAccess. Presentación en js/demo-ui.js.

**Cómo comprobar:** Selecciona Lucía y recarga; debe seguir como colaboradora. Cambia entre vistas sin obtener administración. En Controles de simulación deja la sesión sin seleccionar, recarga y comprueba bloqueo. Cambia de personaje de forma explícita.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S11; N03.

**Límite literal:** Persistir un personaje por pestaña no es autenticación. El cambio de personaje es deliberadamente accesible como herramienta de demostración.

### HU-032 Dar acceso al historial por periodo

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** El permiso de hoy está separado del acceso a semana y mes. A: Cumple en demo. B: Cumple.
- **CA02 original:** El colaborador no ve pagos anteriores fuera de su alcance. A: Cumple en demo. B: Parcial.
- **CA03 original:** El administrador puede cambiar el alcance sin alterar los avisos guardados. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Consultas y detalles validan negocio, membresía activa y alcance hoy/semana/mes. CSV sigue restringido a administración; cambiar turno no amplía historial. La protección local no equivale a seguridad de servidor.

**Ubicación:** Equipo y horarios y filtros de periodo. Código js/demo-core.js, funciones scopeBounds, query y editMember. Presentación en js/demo-ui.js.

**Cómo comprobar:** Con Lucía y alcance Solo hoy intenta consultar ayer o mes. En administración cambia alcance a semana o mes; vuelve a Lucía y comprueba el acceso correspondiente, sin modificar los avisos.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S09/S10; auditoría B14.

**Límite literal:** El almacén local contiene los datos del prototipo y es inspeccionable; no hay exclusión de datos en una respuesta de servidor confiable.

### HU-033 Revisar pagos por día, semana o mes

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** La vista permite elegir día, semana, mes o un rango de meses disponibles. A: Cumple en demo. B: Cumple.
- **CA02 original:** El periodo elegido y el número de avisos quedan claros. A: Cumple en demo. B: Cumple.
- **CA03 original:** Un periodo sin registros aparece vacío sin concluir que no hubo pagos. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Día, semana, mes y rango de meses; periodo/cantidad visibles; vacío no acusa falta de pago.

**Ubicación:** Cierre y CSV. Código js/demo-core.js, funciones bounds y report. Presentación en js/demo-ui.js.

**Cómo comprobar:** Abre Cierre y CSV y cambia día, semana, mes y rango; revisa etiqueta de periodo y cantidad. Selecciona una fecha sin registros y comprueba el vacío sin conclusiones bancarias.

**Pruebas:** Tres CA originales PASS; evidencia complementaria auditoría B09.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-034 Ver cantidad y monto de los avisos

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El resumen muestra número de avisos y suma de los montos que pudieron leerse. A: Cumple en demo. B: Cumple.
- **CA02 original:** Un aviso sin monto se cuenta como aviso, pero no añade una cantidad inventada. A: Cumple en demo. B: Cumple.
- **CA03 original:** El resumen aclara que no muestra el saldo real de ninguna billetera. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Día: 4 avisos, 3 con importe, S/55; revisión manual S/35. Mes: 5 y S/90. CSV coherente.

**Ubicación:** Cierre y CSV. Código js/demo-core.js, funciones report. Presentación en js/demo-ui.js.

**Cómo comprobar:** En los ejemplos iniciales del día, comprueba cuatro avisos, tres montos legibles y S/55. El aviso sin monto se cuenta pero no agrega dinero.

**Pruebas:** Tres CA originales PASS; evidencia complementaria auditoría B08/B10; R01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-036 Consultar el estado del Box desde la app

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** La ficha muestra la última conexión conocida del equipo. A: Cumple en demo. B: Parcial.
- **CA02 original:** La cantidad se etiqueta como avisos enviados al Box, no como pagos comprobados. A: Cumple en demo. B: Cumple.
- **CA03 original:** Una falta de conexión se muestra sin asegurar que el Box enseñó esos avisos. A: Cumple en demo. B: Parcial.

**Implementación simulada:** La política única de conexión expira a más de 120000 ms. Broker o Box desconectados retienen pendientes sin sumar envíos/acuse. Reconexión y reintentos son idempotentes; la recepción virtual requiere acuse explícito.

**Ubicación:** Fuentes y TarkiBox y Controles de simulación. Código js/demo-core.js, funciones boxConnected, acceptBoxDelivery y boxAcknowledge. Presentación en js/demo-ui.js.

**Cómo comprobar:** Vincula un Box y simula comunicación. Desactiva broker y genera un aviso: queda pendiente. Reactiva y comprueba envío sin acuse; confirma recepción. Avanza más de dos minutos, genera otro aviso y reconecta sin duplicar.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S06/S12; N02; T01–T07.

**Límite literal:** No hay telemetría, MQTT ni recepción de ESP32 físico. Los contadores y la pantalla pertenecen al Box virtual.

### HU-037 Vincular el Box mediante un código

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** Un Box sin vincular muestra un código de vinculación de vigencia limitada. A: Cumple en demo. B: Parcial.
- **CA02 original:** Solo el administrador puede introducirlo y confirmar a qué negocio se asociará. A: Cumple en demo. B: Parcial.
- **CA03 original:** El código vencido o utilizado no vincula un equipo ni muestra pagos. A: Cumple en demo. B: Parcial.

**Implementación simulada:** El dispositivo virtual genera un código limitado y revocable. Administración revisa dispositivo y negocio antes de confirmar. Se rechazan códigos vacíos, inexistentes, vencidos, utilizados o revocados y se conserva la asociación.

**Ubicación:** Fuentes y TarkiBox. Código js/demo-core.js, funciones newBoxCode y pairBox. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Fuentes y TarkiBox genera código, introdúcelo y revisa la confirmación. Prueba cancelar, confirmar y reutilizar. Genera otro código y revócalo en Controles de simulación; prueba rechazo.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S12; N02/N04; auditoría B17/B18.

**Límite literal:** Código y vinculación pertenecen al dispositivo virtual; falta el registro compartido y el dispositivo físico.

### HU-039 Buscar avisos por hora

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** Se puede elegir un intervalo de horas dentro del día visible. A: Cumple en demo. B: Cumple.
- **CA02 original:** La lista conserva separados los avisos que coincidan en ese intervalo. A: Cumple en demo. B: Cumple.
- **CA03 original:** Quitar el filtro devuelve todos los avisos del periodo. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Intervalo de horas combinado con importe/nombre/fuente; inválido rechazado; quitarlo conserva periodo.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Elige el día de los ejemplos, filtra entre 14:29 y 14:32 y comprueba registros separados. Limpia el filtro para recuperar los demás.

**Pruebas:** Tres CA originales PASS; evidencia complementaria auditoría B04.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-040 Buscar un aviso por nombre

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** La búsqueda usa el nombre que pudo leerse en el aviso. A: Cumple en demo. B: Cumple.
- **CA02 original:** Los resultados muestran monto y hora para ayudar a distinguirlos. A: Cumple en demo. B: Cumple.
- **CA03 original:** Si el aviso no trae nombre, la app no le asigna uno por su cuenta. A: Cumple en demo. B: Cumple.

**Implementación simulada:** maria encuentra María López, conserva importe y hora; no inventa nombre faltante.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Busca Maria y comprueba el nombre original María López, con su monto y hora. El registro sin emisor conserva No disponible.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S03; auditoría B04.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-041 Filtrar avisos por billetera

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El filtro ofrece las fuentes reconocidas por ese negocio. A: Cumple en demo. B: Cumple.
- **CA02 original:** Solo aparecen los avisos identificados con la billetera elegida. A: Cumple en demo. B: Cumple.
- **CA03 original:** Los avisos de origen desconocido quedan accesibles al quitar el filtro. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Filtros Yape/Plin/Sin identificar y limpieza conservan acceso a desconocidos.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Filtra Plin y revisa solo esa fuente; quita el filtro para recuperar también el aviso de origen desconocido.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S02; auditoría B04.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

### HU-042 Ver los avisos del día como colaborador

Matriz A: Cumple en demo. Matriz B: Parcial.

- **CA01 original:** La vista de hoy muestra solo los avisos del negocio al que tengo acceso. A: Cumple en demo. B: Parcial.
- **CA02 original:** Cada aviso conserva los datos que pudieron leerse. A: Cumple en demo. B: Cumple.
- **CA03 original:** Para ver otros días necesito el permiso de historial correspondiente. A: Cumple en demo. B: Parcial.

**Implementación simulada:** El colaborador consulta solo el negocio autorizado y su alcance actual. Revocar o cambiar permiso se refleja al actualizar las vistas; se conservan los campos originales del aviso.

**Ubicación:** Avisos y búsqueda. Código js/demo-core.js, funciones query. Presentación en js/demo-ui.js.

**Cómo comprobar:** Como Lucía revisa Avisos, intenta otro negocio o fecha no autorizada. Cambia el alcance o revoca en otra pestaña y comprueba la actualización. Revisa ausencias y campos sin valores inventados.

**Pruebas:** Tres CA originales PASS; evidencia complementaria S09/S10; N03.

**Límite literal:** Negocio e historial se restringen dentro del modelo local, sin autoridad remota ni protección frente al dueño del navegador.

### HU-043 Ver un desglose por billetera

Matriz A: Cumple en demo. Matriz B: Cumple.

- **CA01 original:** El resumen separa los avisos de cada fuente reconocida y muestra su cantidad. A: Cumple en demo. B: Cumple.
- **CA02 original:** Los avisos sin billetera identificada se muestran aparte. A: Cumple en demo. B: Cumple.
- **CA03 original:** Se indica que las sumas provienen de avisos detectados y no muestran saldos reales. A: Cumple en demo. B: Cumple.

**Implementación simulada:** Yape 2/S/35, Plin 1/S/20, desconocido 1/S/0 sin monto; filtros/periodos recalculan.

**Ubicación:** Cierre y CSV. Código js/demo-core.js, funciones report. Presentación en js/demo-ui.js.

**Cómo comprobar:** En Cierre revisa cantidades y sumas de Yape, Plin y fuente no identificada. Confirma la aclaración de que no son saldos.

**Pruebas:** Tres CA originales PASS; evidencia complementaria auditoría B08/B10; R01.

**Límite literal:** No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.

## Integraciones futuras y limitaciones

Pendientes: receptor Android real y formatos/versiones verificadas, cuentas y autenticación reales, autorización y exclusión de datos en servidor, almacenamiento y sincronización entre dispositivos, broker MQTT/Mosquitto real, ESP32 físico y telemetría/acuse, entrega en segundo plano y pruebas con usuarios. El puerto y origen del navegador delimitan la base local; no hay sincronización entre equipos diferentes.

El parser reconoce formatos ficticios limitados y no pretende cubrir versiones reales de Yape o Plin. El broker es un bus persistente local, no una conexión MQTT ni Mosquitto. Los escenarios API síncronos de Node son pruebas del modelo aislado; la atomicidad del navegador se sustenta en las regresiones de IndexedDB y dos pestañas. Las lecturas del modelo son snapshots para presentación; la aplicación los recarga antes de renderizar y las mutaciones revalidan en la transacción. No hay autoridad de seguridad frente a manipulación por el propietario del navegador. No se prueba entrega en segundo plano del sistema operativo.

## Capturas recomendadas para el informe HCI

- `evidencias/despues/ecosistema/01-servicio-caido.png`: Intento fallido con hora exitosa anterior. Datos simulados.
- `evidencias/despues/ecosistema/02-broker-pendientes.png`: Cola de distribución con broker virtual caído. Datos simulados.
- `evidencias/despues/ecosistema/03-box-reconectado.png`: Reconexión y acuse virtual sin duplicar entregas. Datos simulados.
- `evidencias/despues/ecosistema/04-sesion-sin-seleccionar.png`: Sesión vacía sin administración automática. Datos simulados.
- `evidencias/despues/ecosistema/05-controles-390.png`: Panel desplegable en móvil. Datos simulados.

## Archivos y reproducción

Servir TarkiPay_Landing por HTTP y usar el mismo origen/puerto de la versión anterior para acceder a los datos del navegador. Entrar a Probar demo. Los controles adicionales están en el acordeón Controles de simulación. Las pruebas requieren Node y Playwright con Chrome: tests/acceptance.cjs, tests/fixes-browser.cjs, tests/ecosystem.cjs y tests/ecosystem-browser.cjs; el adaptador histórico de navegador está en evidencias/despues/auditoria. TARKIPAY_TEST_URL permite elegir el origen de prueba. Las pruebas utilizan contextos aislados y el reloj fijo; no deben ejecutarse sobre datos personales.

Código modificado: js/demo-core.js, js/demo-store.js, js/demo-ui.js y css/components/demo.css. El HTML y las demás secciones premium se conservan. Nuevas pruebas: tests/ecosystem.cjs y tests/ecosystem-browser.cjs. Se conserva la matriz anterior y se entregan MATRIZ_A_SIMULACION.json y MATRIZ_B_CRITERIOS_ORIGINALES.json independientes.
