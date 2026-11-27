"""Build two independent matrices and editable handoff from original criteria and executed evidence."""
from pathlib import Path
import json,collections
from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parent;D=ROOT/'docs';E=BASE/'evidencias/despues'
read=lambda p:json.loads(p.read_text(encoding='utf8'))
requirements=read(D/'REQUISITOS_ORIGINALES.json');previous=read(D/'matriz_30_HU.json');original={s['id']:s for s in requirements['stories']}
selected=[1,2,3,4,5,6,7,8,9,10,11,12,13,25,26,27,28,29,30,31,32,33,34,36,37,39,40,41,42,43]
rows=sorted(previous['rows'],key=lambda r:r['id']);assert [r['id'] for r in rows]==[f'HU-{i:03}' for i in selected]
acceptance=read(D/'acceptance-results.json');model=read(E/'ecosystem-model.json');browser=read(E/'ecosistema/ecosystem-browser.json');regression=read(E/'nuevas-regresiones-browser.json');audit=read(E/'auditoria/resultados-browser-adaptado.json')
for result in [acceptance,model,browser,regression,audit]:assert result['failed']==0
assert not browser['errors'] and not regression['errors'] and not audit['errors']
extras={1:'S01; S07; N01',2:'S03; N01',3:'S01; S03; N01',4:'N01; auditoría B01',5:'auditoría B02–B05',6:'S07; auditoría B02',7:'S07; auditoría B06',8:'S04; S05; N01',9:'S01; S02; S03; N01',10:'S01; S07; C01–C17',11:'S03; N01',12:'S11; auditoría B13/B16',13:'S01; S06; S07; N01/N02',25:'S08; N04; C06–C10',26:'S08; N04; C06–C10',27:'S03; auditoría B12/B13',28:'S09; N03; C04/C05',29:'S09; N03; auditoría B15',30:'S10; S09',31:'S11; N03',32:'S09/S10; auditoría B14',33:'auditoría B09',34:'auditoría B08/B10; R01',36:'S06/S12; N02; T01–T07',37:'S12; N02/N04; auditoría B17/B18',39:'auditoría B04',40:'S03; auditoría B04',41:'S02; auditoría B04',42:'S09/S10; N03',43:'auditoría B08/B10; R01'}
implementation={
8:'El servicio virtual registra último intento, último éxito y error por separado. sync conserva la hora válida ante caída del servicio aunque el navegador siga conectado; receptor y servicio tienen fallos independientes y colas recuperables.',
9:'El teléfono virtual genera textos compatibles Yape/Plin. Un procesador comprueba permiso, fuente y formato, ignora contenido ajeno y conserva ausencias. Cada recepción deja un registro de trazabilidad con el mismo identificador.',
12:'Negocios con ID propio, propietario y membresía administradora. Los obligatorios y la autorización se validan en el modelo y en la transacción; persisten tras recargar.',
13:'El ID acompaña la notificación, el procesamiento, el registro del servicio y las entregas del broker/Box. El reenvío reutiliza ese ID; diferentes eventos del mismo importe permanecen separados.',
25:'Invitaciones con negocio, permisos, turno, emisión, vencimiento, consumo y revocación. Los estados disponible/utilizado/vencido/revocado se derivan del registro. Generar no concede membresía.',
26:'La identidad ficticia revisa el negocio y alcance, confirma o cancela. El canje vuelve a validar y consume el código en la transacción atómica; solo crea rol colaborador.',
28:'Retiro con nombre y confirmación. La membresía se revoca, no recibe nuevos destinatarios, los pendientes se revalidan al reintentar y la sesión activa pierde nuevas consultas. El administrador conserva los avisos.',
29:'La lista presenta nombre, rol, alcance, vigencia y turno; su negocio se identifica en la cabecera. La edición administrativa vuelve a comprobar el permiso dentro del modelo.',
30:'Días y horas por persona en America/Lima. El reloj virtual permite probar inicio inclusivo y fin exclusivo. Se revalidan turnos al distribuir pendientes; la consulta conserva su alcance independiente.',
31:'La sesión ficticia se conserva por pestaña mediante sessionStorage y no vuelve a U-1 al recargar. Existe estado sin sesión. Cambiar identidad ficticia es explícito y los roles provienen de membresías, no de la pantalla seleccionada.',
32:'Consultas y detalles validan negocio, membresía activa y alcance hoy/semana/mes. CSV sigue restringido a administración; cambiar turno no amplía historial. La protección local no equivale a seguridad de servidor.',
36:'La política única de conexión expira a más de 120000 ms. Broker o Box desconectados retienen pendientes sin sumar envíos/acuse. Reconexión y reintentos son idempotentes; la recepción virtual requiere acuse explícito.',
37:'El dispositivo virtual genera un código limitado y revocable. Administración revisa dispositivo y negocio antes de confirmar. Se rechazan códigos vacíos, inexistentes, vencidos, utilizados o revocados y se conserva la asociación.',
42:'El colaborador consulta solo el negocio autorizado y su alcance actual. Revocar o cambiar permiso se refleja al actualizar las vistas; se conservan los campos originales del aviso.'}
steps={
8:'En Avisos, pulsa Actualizar lista. Abre Controles de simulación, desactiva Servicio virtual y aplica; avanza un minuto y actualiza. Comprueba intento nuevo, éxito anterior y advertencia. Reactiva y actualiza.',
9:'En Controles de simulación, elige fuente y tipo y envía al receptor. Prueba incompleto y contenido ajeno. Revoca permiso o desactiva la fuente en Fuentes y TarkiBox; comprueba rechazo y ausencia de nuevos registros.',
12:'Personalizar mi negocio permite editar o crear otro negocio ficticio. Prueba obligatorios vacíos, crea con nombre y responsable, recarga y comprueba aislamiento. Cambia a colaborador y prueba rechazo administrativo.',
13:'Genera un aviso compatible, elige Reenviar el mismo evento y repite después de recargar. El número de registros no aumenta. Genera otro aviso compatible y comprueba que se conserva como registro distinto.',
25:'En Equipo y horarios, introduce nombre, alcance y turno; genera código y comprueba que no añade miembro. Avanza el reloj 15 minutos y prueba el canje. Genera otro y revócalo desde el historial de invitaciones.',
26:'Elige Nueva persona, abre Unirme con un código de invitación, introduce un código disponible y revisa permisos. Cancela o confirma. Prueba códigos incorrectos, vencidos, revocados y ya usados.',
28:'Abre otra pestaña con Lucía. En administración retira su acceso, revisa su nombre y confirma. Actualiza o intenta una consulta en la otra pestaña; comprueba bloqueo, recarga e historial de administración.',
29:'Revisa los integrantes y sus permisos en Equipo. Edita alcance y turno, guarda y comprueba cambios. Desde identidad colaboradora comprueba que no se habilitan las funciones administrativas.',
30:'Edita un turno para que finalice un minuto después del reloj virtual. Genera un aviso dentro del turno; avanza un minuto y genera otro. Comprueba destinatarios del broker y que los registros e historial anterior permanecen.',
31:'Selecciona Lucía y recarga; debe seguir como colaboradora. Cambia entre vistas sin obtener administración. En Controles de simulación deja la sesión sin seleccionar, recarga y comprueba bloqueo. Cambia de personaje de forma explícita.',
32:'Con Lucía y alcance Solo hoy intenta consultar ayer o mes. En administración cambia alcance a semana o mes; vuelve a Lucía y comprueba el acceso correspondiente, sin modificar los avisos.',
36:'Vincula un Box y simula comunicación. Desactiva broker y genera un aviso: queda pendiente. Reactiva y comprueba envío sin acuse; confirma recepción. Avanza más de dos minutos, genera otro aviso y reconecta sin duplicar.',
37:'En Fuentes y TarkiBox genera código, introdúcelo y revisa la confirmación. Prueba cancelar, confirmar y reutilizar. Genera otro código y revócalo en Controles de simulación; prueba rechazo.',
42:'Como Lucía revisa Avisos, intenta otro negocio o fecha no autorizada. Cambia el alcance o revoca en otra pestaña y comprueba la actualización. Revisa ausencias y campos sin valores inventados.'}
steps.update({1:'Abre Avisos y compara el orden de las horas. Simula avisos consecutivos y comprueba que los nuevos aparecen primero; una búsqueda sin resultados debe orientar a revisar la billetera.',2:'Abre un aviso con datos y después el aviso sin monto. Comprueba campos originales, ausencias explícitas y que abrir no lo verifica automáticamente.',3:'Revisa avisos de Yape, Plin y fuente no identificada; el origen no debe presentarse como comprobación de ingreso.',4:'Abre y cierra un aviso; comprueba el significado de aviso detectado y la indicación de revisar la billetera.',5:'Busca S/20, comprueba coincidencias, busca S/99 y limpia el filtro para recuperar los registros.',6:'Busca S/20 y compara los dos registros separados, sus emisores y horas. No se selecciona un cliente automáticamente.',7:'En simulación elige aviso tardío; actualiza la lista y revisa hora original y recepción. Reenvía el evento y comprueba un solo registro.',10:'En Controles de simulación elige tres consecutivos. Comprueba que se agregan tres IDs diferentes y permanecen los avisos anteriores.',11:'Consulta el importe directamente en Avisos sin registrar una venta. Abre el registro incompleto y comprueba ausencia de monto.',27:'Selecciona Lucía y consulta el detalle. Comprueba campos disponibles y ausencias; no hay acciones para transferir ni abrir la billetera del titular.',33:'Abre Cierre y CSV y cambia día, semana, mes y rango; revisa etiqueta de periodo y cantidad. Selecciona una fecha sin registros y comprueba el vacío sin conclusiones bancarias.',34:'En los ejemplos iniciales del día, comprueba cuatro avisos, tres montos legibles y S/55. El aviso sin monto se cuenta pero no agrega dinero.',39:'Elige el día de los ejemplos, filtra entre 14:29 y 14:32 y comprueba registros separados. Limpia el filtro para recuperar los demás.',40:'Busca Maria y comprueba el nombre original María López, con su monto y hora. El registro sin emisor conserva No disponible.',41:'Filtra Plin y revisa solo esa fuente; quita el filtro para recuperar también el aviso de origen desconocido.',43:'En Cierre revisa cantidades y sumas de Yape, Plin y fuente no identificada. Confirma la aclaración de que no son saldos.'})
locations={n:'Avisos y búsqueda' for n in [1,2,3,4,5,6,7,10,11,13,27,39,40,41,42]}
locations.update({8:'Avisos y búsqueda y Controles de simulación',9:'Controles de simulación y Fuentes y TarkiBox',12:'Personalizar mi negocio',25:'Equipo y horarios',26:'Unirme con un código de invitación y selector de identidad ficticia',28:'Equipo y horarios',29:'Equipo y horarios',30:'Equipo y horarios y reloj de Controles de simulación',31:'Selector de identidad ficticia y Controles de simulación',32:'Equipo y horarios y filtros de periodo',33:'Cierre y CSV',34:'Cierre y CSV',36:'Fuentes y TarkiBox y Controles de simulación',37:'Fuentes y TarkiBox',43:'Cierre y CSV'})
functions={n:'query' for n in selected};functions.update({2:'detail',3:'validateEvent y detail',4:'detail y verify',7:'receiveNotification y refresh',8:'sync',9:'notification y processReceiver',10:'refresh y deliver',12:'createBusiness y updateBusiness',13:'receiveNotification y refresh',25:'invite',26:'previewInvitation y join',28:'revokeMember y retryBroker',29:'team y editMember',30:'inShift y retryBroker',31:'selectIdentity, membership y requireAccess',32:'scopeBounds, query y editMember',33:'bounds y report',34:'report',36:'boxConnected, acceptBoxDelivery y boxAcknowledge',37:'newBoxCode y pairBox',43:'report'})
literal_limits={8:'El servicio es virtual; no hay consulta ni disponibilidad de un backend remoto real.',9:'No se capturan notificaciones ni permisos del sistema Android real.',12:'No hay registro ni autoridad de cuenta externa; las identidades son personajes locales.',13:'La identidad se conserva en toda la cadena virtual; falta contrato y prueba con emisor Android, transporte y dispositivo reales.',25:'No hay administrador autenticado ni servicio compartido entre dispositivos; los códigos pertenecen al mismo origen del navegador.',26:'La sesión y el canje son ficticios y locales; no se autentica una cuenta externa.',28:'La revocación se impone en la simulación; falta invalidación en sesiones y alertas de dispositivos reales.',29:'La administración local no es una autoridad confiable frente a manipulación del navegador.',30:'La entrega y el turno se validan en el broker virtual; faltan alertas reales y permisos del sistema operativo.',31:'Persistir un personaje por pestaña no es autenticación. El cambio de personaje es deliberadamente accesible como herramienta de demostración.',32:'El almacén local contiene los datos del prototipo y es inspeccionable; no hay exclusión de datos en una respuesta de servidor confiable.',36:'No hay telemetría, MQTT ni recepción de ESP32 físico. Los contadores y la pantalla pertenecen al Box virtual.',37:'Código y vinculación pertenecen al dispositivo virtual; falta el registro compartido y el dispositivo físico.',42:'Negocio e historial se restringen dentro del modelo local, sin autoridad remota ni protección frente al dueño del navegador.'}
matrixA=[];matrixB=[]
for row in rows:
 hu=row['id'];number=int(hu[-3:]);assert row['criteria']==original[hu]['criteria']
 cases=[r for r in acceptance['results'] if r['hu']==hu];assert len(cases)==3 and all(r['status']=='PASS' for r in cases)
 matrixA.append({'id':hu,'name':row['name'],'status':'Cumple en demo','location':locations[number],'code':'js/demo-core.js: '+functions[number],'criteria':[{'id':f'CA{i+1:02}','original':c,'status':'Cumple en demo','evidence':f'acceptance.cjs {hu} CA{i+1:02}; '+extras[number]} for i,c in enumerate(row['criteria'])]})
 matrixB.append({'id':hu,'name':row['name'],'status':row['status'],'criteria':[{'id':f'CA{i+1:02}','original':c,'status':row['criteria_status'][i],'limitation':literal_limits.get(number,'Sin déficit nuevo observado en los criterios de presentación, consulta o cálculo evaluados.')} for i,c in enumerate(row['criteria'])]})
totalsA=dict(collections.Counter(r['status'] for r in matrixA));totalsB=dict(collections.Counter(r['status'] for r in matrixB))
for filename,scope,totals,matrix in [('MATRIZ_A_SIMULACION.json','Comportamientos demostrables en el prototipo; no certifica integración externa.',totalsA,matrixA),('MATRIZ_B_CRITERIOS_ORIGINALES.json','Evaluación literal estricta de las fichas TB2; mantiene límites de cuenta e integración.',totalsB,matrixB)]:
 (D/filename).write_text(json.dumps({'scope':scope,'date':'2026-11-25','totals':totals,'criteria_totals':dict(collections.Counter(c['status'] for r in matrix for c in r['criteria'])),'rows':matrix},ensure_ascii=False,indent=2),encoding='utf8')
summary='La demo representa y comprueba las 30 historias seleccionadas en un ecosistema virtual integrado. La Matriz A registra 30 que cumplen en demo. La Matriz B conserva 16 que cumplen y 14 parciales frente al sistema original; no se acredita Android, autenticación externa, backend, MQTT ni Box físico.'
architecture='El receptor genera notificaciones con ID estable. El procesador valida permiso, fuente y formato y conserva campos ausentes. El servicio virtual guarda avisos y la última sincronización exitosa; los fallos dejan colas. El broker virtual distribuye por negocio, membresía, alcance y turno, revalidando pendientes. El Box acepta envíos solo con comunicación vigente y broker disponible; el acuse explícito confirma la recepción virtual y actualiza su pantalla. Ninguna fase acredita un abono bancario.'
persistence='Se conserva IndexedDB tarkipay-demo-v4 y el object store entities. receiverEvents es una colección adicional de registros por entidad; leer datos anteriores la inicializa vacía, sin reemplazar avisos, invitaciones o membresías ni cambiar la versión de la base. Los comandos siguen usando transacciones readwrite con lectura, autorización y escritura por entidad. El reloj es un desplazamiento persistido por negocio sobre el reloj base. Las sesiones ficticias son por pestaña; no se guardan contraseñas. Las pestañas de la versión nueva comparten el modelo; no se deben ejecutar versiones antiguas y nuevas simultáneamente en el mismo origen.'
limits='El parser reconoce formatos ficticios limitados y no pretende cubrir versiones reales de Yape o Plin. El broker es un bus persistente local, no una conexión MQTT ni Mosquitto. Los escenarios API síncronos de Node son pruebas del modelo aislado; la atomicidad del navegador se sustenta en las regresiones de IndexedDB y dos pestañas. Las lecturas del modelo son snapshots para presentación; la aplicación los recarga antes de renderizar y las mutaciones revalidan en la transacción. No hay autoridad de seguridad frente a manipulación por el propietario del navegador. No se prueba entrega en segundo plano del sistema operativo.'
md=['# TarkiPay simulación funcional de las 30 historias de usuario','',summary,'','## Alcance y arquitectura','',architecture,'',persistence,'',limits,'','## Fuentes y checkpoint','','Se inspeccionaron las 48 fichas y las 48 entradas del backlog por separado. Los 90 textos de la selección fija coinciden exactamente entre matriz_30_HU.json, REQUISITOS_ORIGINALES.json y TB2_extraido.txt; véase evidencias/contraste-criterios.json. El checkpoint previo está en CHECKPOINT.md y su manifiesto SHA256 en evidencias/checkpoint-pre-simulacion.json. Los originales y sus pruebas permanecen en sources/.','','## Matrices independientes','','| HU | Historia | Matriz A | Matriz B |','|---|---|---|---|']
for a,b in zip(matrixA,matrixB):md.append(f"| {a['id']} | {a['name']} | {a['status']} | {b['status']} |")
md+=['',f'Total A: {totalsA}. Total B: {totalsB}.','', '## Resultados de pruebas','','94 pruebas originales del modelo, 27 regresiones de concurrencia y Box, 21 escenarios de auditoría de navegador, 12 grupos nuevos del modelo y 5 grupos nuevos end-to-end: todos PASS, sin excepciones JavaScript en las ejecuciones finales. Además, el recorrido visual verifica las cinco vistas a 1440, 768 y 390 px. Las pruebas comprueban entidades, permisos, marcas temporales, contadores, colas y recarga; no solo mensajes de éxito. Los adaptadores abren el nuevo acordeón para ejecutar las acciones antiguas; no cambian sus aserciones salvo la adaptación de fechas ya documentada en la entrega premium.','','## Guía por historia']
doc=Document();sec=doc.sections[0];sec.page_height=Inches(11.7);sec.page_width=Inches(8.3);sec.top_margin=sec.bottom_margin=Inches(.65);sec.left_margin=sec.right_margin=Inches(.75)
sec.header_distance=Inches(.25);sec.footer_distance=Inches(.25)
doc.core_properties.author='KAYRAQ';doc.core_properties.title='TarkiPay simulación funcional de las 30 historias de usuario'
for border in list(doc.styles.element.xpath('.//w:pBdr')):border.getparent().remove(border)
for name in ['Normal','Title','Subtitle','Heading 1','Heading 2','Heading 3']:
 st=doc.styles[name];st.font.name='Calibri';st.font.color.rgb=RGBColor(0,0,0)
doc.styles['Normal'].font.size=Pt(10.5);doc.styles['Normal'].paragraph_format.space_after=Pt(7)
doc.styles['Title'].font.size=Pt(25);doc.styles['Heading 1'].font.size=Pt(16);doc.styles['Heading 2'].font.size=Pt(13)
sec.header.paragraphs[0].text='KAYRAQ   TarkiPay   Informe del prototipo académico'
footer=sec.footer.paragraphs[0];footer.alignment=2;footer.add_run('TarkiPay  |  ');field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
doc.add_paragraph('TarkiPay simulación funcional de las 30 historias de usuario','Title');doc.add_paragraph('Entrega para el equipo HCI for UX Design UPC   25 de noviembre de 2026','Subtitle');doc.add_paragraph(summary)
doc.add_heading('Alcance y arquitectura',1)
for t in [architecture,persistence,limits]:doc.add_paragraph(t)
doc.add_heading('Fuentes y trazabilidad',1);doc.add_paragraph(md[md.index('## Fuentes y checkpoint')+2])
def table(headers,records,widths=None):
 t=doc.add_table(rows=1,cols=len(headers));t.autofit=False
 if widths:
  for c,w in zip(t.columns,widths):c.width=Inches(w)
 for c,text in zip(t.rows[0].cells,headers):c.text=text
 for rec in records:
  for c,text in zip(t.add_row().cells,rec):c.text=str(text)
 for i,row in enumerate(t.rows):
  if widths:
   for cell,width in zip(row.cells,widths):cell.width=Inches(width)
  for c in row.cells:
   tcPr=c._tc.get_or_add_tcPr();borders=OxmlElement('w:tcBorders')
   for edge in ['top','left','bottom','right']:
    el=OxmlElement('w:'+edge);el.set(qn('w:val'),'single');el.set(qn('w:sz'),'4');el.set(qn('w:color'),'D9D9D9');borders.append(el)
   tcPr.append(borders);shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'23334D' if i==0 else 'F3F6FA' if i%2==0 else 'FFFFFF');tcPr.append(shade)
   margins=OxmlElement('w:tcMar')
   for edge in ['top','left','bottom','right']:
    el=OxmlElement('w:'+edge);el.set(qn('w:w'),'80');el.set(qn('w:type'),'dxa');margins.append(el)
   tcPr.append(margins)
   for p in c.paragraphs:
    p.paragraph_format.space_after=Pt(3);p.paragraph_format.space_before=Pt(3)
    for run in p.runs:run.font.size=Pt(9);run.font.color.rgb=RGBColor(255,255,255) if i==0 else RGBColor(0,0,0);run.bold=i==0
  trPr=row._tr.get_or_add_trPr();cant=OxmlElement('w:cantSplit');trPr.append(cant)
 repeat=OxmlElement('w:tblHeader');t.rows[0]._tr.get_or_add_trPr().append(repeat)
 doc.add_paragraph('')
 return t
doc.add_heading('Matriz A del prototipo simulado',1);doc.add_paragraph('Cumple en demo significa que el comportamiento equivalente puede demostrarse con los componentes virtuales. No sustituye el texto original ni afirma integración física. Total 30 cumplen en demo, 0 parciales y 0 no cumplen en demo.')
table(['HU','Historia','CA01 CA02 CA03','Resultado'],[(a['id'],a['name'],'Cumple en demo en los tres criterios',a['status']) for a in matrixA],[.65,2.4,1.8,1.05])
doc.add_heading('Matriz B de los criterios originales',1);doc.add_paragraph('Evaluación literal estricta conservada y contrastada con el alcance actual. C significa Cumple y P Parcial. Los criterios externos siguen parciales pese a la representación virtual. Total 16 cumplen, 14 parciales y 0 no cumplen.')
table(['HU','Historia','CA01 CA02 CA03','Resultado'],[(b['id'],b['name'],' / '.join('C' if c['status']=='Cumple' else 'P' if c['status']=='Parcial' else 'N' for c in b['criteria']),b['status']) for b in matrixB],[.65,2.4,1.8,1.05])
doc.add_heading('Pruebas ejecutadas',1);doc.add_paragraph(md[md.index('## Resultados de pruebas')+2])
table(['Suite','PASS','FAIL'],[('Modelo original','94','0'),('Regresiones de concurrencia y Box','27','0'),('Auditoría de navegador adaptada','21','0'),('Modelo del ecosistema nuevo','12 grupos','0'),('End to end del ecosistema','5 grupos','0')],[4.4,.75,.75])
additional='Además pasaron los 4 recorridos de formularios premium, los 17 grupos de verificación visual y navegación, y los 2 casos de actualización de IndexedDB premium y concurrencia de notificación/perfil. Se conservaron las entidades anteriores y ambas operaciones concurrentes sobrevivieron a la recarga.'
doc.add_paragraph(additional);md+=['',additional]
diagnostic='Diagnóstico histórico adicional sin alterar aserciones: 15 PASS y 2 FAIL. D04 confirma que el historial local es inspeccionable y sigue siendo una limitación de seguridad de la Matriz B. D05 falla en la fixture síncrona Node sin sessionStorage, que no representa una recarga de pestaña; la sesión real del navegador se comprueba separadamente en N03 y conserva al colaborador o la sesión vacía. No se ocultan esos resultados ni se presentan como pruebas de integración aprobadas.'
doc.add_paragraph(diagnostic);md+=['',diagnostic]
doc.add_heading('Guía por historia y criterios originales',1)
for a,b in zip(matrixA,matrixB):
 n=int(a['id'][-3:]);title=f"{a['id']} {a['name']}";desc=implementation.get(n,previous['rows'][next(i for i,r in enumerate(previous['rows']) if r['id']==a['id'])]['evidence'])
 location=locations[n]+'. Código js/demo-core.js, funciones '+functions[n]+'. Presentación en js/demo-ui.js.'
 step=steps.get(n,'Reproduce los tres casos originales de tests/acceptance.cjs y el escenario de navegador indicado; utiliza Avisos, filtros, detalle y Cierre para comprobar el resultado observable.')
 md+=['',f'### {title}','',f"Matriz A: {a['status']}. Matriz B: {b['status']}.",'']
 doc.add_heading(title,2);doc.add_paragraph(f"Matriz A {a['status']}. Matriz B {b['status']}.")
 for ca,cb in zip(a['criteria'],b['criteria']):
  md += [f"- **{ca['id']} original:** {ca['original']} A: {ca['status']}. B: {cb['status']}."]
  p=doc.add_paragraph();p.add_run(ca['id']+' original ').bold=True;p.add_run(ca['original']);p=doc.add_paragraph(f"Demo {ca['status']}  |  Literal {cb['status']}");p.paragraph_format.space_after=Pt(4)
 for label,text in [('Implementación simulada',desc),('Ubicación',location),('Cómo comprobar',step),('Pruebas',f"Tres CA originales PASS; evidencia complementaria {extras[n]}."),('Límite literal',literal_limits.get(n,'No se identificó un déficit nuevo para estos criterios de presentación, consulta o cálculo.'))]:
  md+=['',f'**{label}:** {text}'];p=doc.add_paragraph();p.add_run(label+' ').bold=True;p.add_run(text)
doc.add_heading('Integraciones futuras y limitaciones',1)
future='Pendientes: receptor Android real y formatos/versiones verificadas, cuentas y autenticación reales, autorización y exclusión de datos en servidor, almacenamiento y sincronización entre dispositivos, broker MQTT/Mosquitto real, ESP32 físico y telemetría/acuse, entrega en segundo plano y pruebas con usuarios. El puerto y origen del navegador delimitan la base local; no hay sincronización entre equipos diferentes.'
doc.add_paragraph(future);md+=['','## Integraciones futuras y limitaciones','',future,'',limits]
doc.add_heading('Capturas recomendadas para el informe HCI',1)
shots=[('01-servicio-caido.png','Intento fallido con hora exitosa anterior'),('02-broker-pendientes.png','Cola de distribución con broker virtual caído'),('03-box-reconectado.png','Reconexión y acuse virtual sin duplicar entregas'),('04-sesion-sin-seleccionar.png','Sesión vacía sin administración automática'),('05-controles-390.png','Panel desplegable en móvil')]
md+=['','## Capturas recomendadas para el informe HCI','']
for file,caption in shots:
 md.append(f'- `evidencias/despues/ecosistema/{file}`: {caption}. Datos simulados.')
 caption_paragraph=doc.add_paragraph(caption+'. Datos simulados. Archivo '+file+'.')
 if file in ['03-box-reconectado.png','05-controles-390.png']:
  caption_paragraph.paragraph_format.keep_with_next=True
  doc.add_picture(str(E/'ecosistema'/file),width=Inches(5.6 if '390' not in file else 2.6))
doc.add_heading('Archivos y reproducción',1)
repro='Servir TarkiPay_Landing por HTTP y usar el mismo origen/puerto de la versión anterior para acceder a los datos del navegador. Entrar a Probar demo. Los controles adicionales están en el acordeón Controles de simulación. Las pruebas requieren Node y Playwright con Chrome: tests/acceptance.cjs, tests/fixes-browser.cjs, tests/ecosystem.cjs y tests/ecosystem-browser.cjs; el adaptador histórico de navegador está en evidencias/despues/auditoria. TARKIPAY_TEST_URL permite elegir el origen de prueba. Las pruebas utilizan contextos aislados y el reloj fijo; no deben ejecutarse sobre datos personales.'
doc.add_paragraph(repro);md+=['','## Archivos y reproducción','',repro,'','Código modificado: js/demo-core.js, js/demo-store.js, js/demo-ui.js y css/components/demo.css. El HTML y las demás secciones premium se conservan. Nuevas pruebas: tests/ecosystem.cjs y tests/ecosystem-browser.cjs. Se conserva la matriz anterior y se entregan MATRIZ_A_SIMULACION.json y MATRIZ_B_CRITERIOS_ORIGINALES.json independientes.']
(D/'TarkiPay_30_HU_Simulacion_Funcional.md').write_text('\n'.join(md)+'\n',encoding='utf8');doc.save(D/'TarkiPay_30_HU_Simulacion_Funcional.docx')
print(json.dumps({'A':totalsA,'B':totalsB,'criteria':90,'docx':str(D/'TarkiPay_30_HU_Simulacion_Funcional.docx')},ensure_ascii=False))
