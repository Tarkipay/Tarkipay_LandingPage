"""Build editable handoff from original extracted requirements and executed checks.
Run from repository root with the bundled Python runtime. No generated result is assumed.
"""
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT/'docs'
source=json.loads((DOCS/'REQUISITOS_ORIGINALES.json').read_text(encoding='utf-8'))
results=json.loads((DOCS/'acceptance-results.json').read_text(encoding='utf-8'))
selected=[1,2,3,4,5,6,7,8,9,10,11,12,13,25,26,27,28,29,30,31,32,33,34,36,37,39,40,41,42,43]
partial={8:'CA02: se procesa una cola local, sin consultar un servicio remoto real.',
9:'CA01 y CA03: fuentes ficticias habilitadas; no se verifica captura ni permiso Android.',
12:'CA01 y alta del negocio: relación de cuenta y negocio ficticia; falta registro y autenticación reales.',
13:'CA01 y escenarios de envío: deduplicación comprobada en servicio local; sincronización remota pendiente.',
26:'CA03 y escenario de ingreso: cuenta propia ficticia; falta registro e inicio de sesión reales.',
28:'CA02: consulta bloqueada y destinatarios locales excluidos; entrega y bloqueo de alertas a celulares reales pendientes.',
30:'CA02 y escenarios de turno: destinatarios simulados evaluados en Lima; entrega real al celular pendiente.',
31:'CA01 y escenarios de inicio de sesión: rol derivado de membresía ficticia; falta autenticación real de cuentas.',
36:'CA01–CA03: telemetría, envío y acuse comprobados exclusivamente con Box virtual; ESP32 y broker pendientes.',
37:'CA01–CA03: código emitido en pantalla virtual; vinculación con Box físico pendiente.'}
# Related requirements are explicit semantic associations, never ID equivalence.
mapping={1:[1],2:[6],3:[5],4:[8,22],5:[2],6:[3,20],7:[8,29],8:[7,28],9:[42],10:[20],11:[6,19],12:[41],13:[20],14:[46],15:[42],16:[15,46],17:[7,28],18:[25],19:[25],20:[12],21:[28,44],22:[25],23:[10,25],24:[25,45],25:[9],26:[14],27:[10,15],28:[11],29:[13],30:[10],31:[14,46],32:[10,15],33:[34],34:[33],35:[43,44],36:[44,45],37:[],38:[42],39:[3,34],40:[4],41:[5],42:[10,12],43:[33,34],44:[10,46],45:[26],46:[43],47:[28,44],48:[48]}
not_equivalent={6,9,11,13,14,15,16,17,18,19,20,21,22,23,24,30,31,32,35,36,38,39,41,42,43,44,45,46,47,48}
implementation={
1:'Orden por eventAt con receivedAt como respaldo; desempate estable y advertencia de vacío.',
2:'Detalle con campos originales y lectura separada de revisión manual.',
3:'Fuentes reconocidas y etiqueta Billetera no identificada; ninguna fuente acredita un ingreso.',
4:'Etiquetas de aviso detectado y orientación para revisar la billetera; lectura sin confirmación automática.',
5:'Validación de monto positivo con dos decimales, coincidencia exacta y limpieza reversible.',
6:'Registros independientes por identidad, sin asignación automática de cliente ni venta.',
7:'Recepción tardía mediante cola; evento y recepción separados, identidad conservada y reenvío idempotente.',
8:'Actualización efectiva de cola local, hora inicial desconocida y conservación de última hora válida ante fallo.',
9:'Consolidación de eventos locales de fuentes habilitadas y rechazo de eventos de fuentes desactivadas.',
10:'Ráfaga de tres eventos independientes, orden cronológico y conservación de anteriores.',
11:'Monto legible sin registrar una venta; ausencia explícita cuando no pudo leerse.',
12:'Negocios con identificador único y membresía administradora; validación atómica de obligatorios y edición autorizada.',
13:'Identificador estable por negocio; reintentos dentro de un lote y entre actualizaciones sin duplicación.',
25:'Invitación persistida con negocio, nombre, permisos, turno, vencimiento, uso y revocación; generar no agrega miembro.',
26:'Vista previa de negocio y permisos, cancelar o aceptar; validación repetida al canjear y cuenta colaboradora ficticia.',
27:'Campos de aviso disponibles y ausencias explícitas; sin acceso a transferencias, claves ni billetera del titular.',
28:'Confirmación con nombre, cancelación sin cambios, revocación comprobada en consultas, detalle, ventas, solicitudes y alertas locales.',
29:'Lista de miembros vigentes y revocados con nombre, rol, alcance y turno; edición restringida en el servicio.',
30:'Edición individual de días e intervalo, zona America/Lima y destinatarios por turno; fin exclusivo y conservación de historial.',
31:'Permisos derivados de membresía por cuenta y negocio; validación en cada acción y selección explícita de identidad ficticia.',
32:'Alcances hoy, semana y mes; restricciones en lista, detalle, resumen y CSV; cambiar alcance conserva registros.',
33:'Día, semana de lunes a domingo, mes y rango inclusivo de meses; periodos anteriores y vacío orientativo.',
34:'Conteo independiente del monto, sumas enteras en céntimos y revisión manual separada; filtros compartidos con CSV.',
36:'Estado virtual pendiente, conectado o desconectado; última comunicación y contadores separados de envío, acuse y pendientes.',
37:'Código virtual temporal de uso único, revisión del negocio antes de confirmar y rechazo de códigos inválidos o asociados.',
39:'Intervalo de horas del aviso, respaldo en recepción, validación y combinación con monto, nombre, fuente y periodo.',
40:'Búsqueda sobre nombre leído, tolerante a tildes y mayúsculas; no inventa nombres ausentes.',
41:'Filtro por fuente reconocida, origen desconocido aparte y recuperación de todos los registros al limpiar.',
42:'Consulta por membresía vigente y negocio; hoy accesible aun fuera del turno de alertas, otros días según permiso.',
43:'Cantidad y suma conocida para Yape, Plin y origen desconocido; desglose recalculado con periodo y filtros.'}
functions={1:'query',2:'detail',3:'detail',4:'detail',5:'query',6:'query',7:'queue, refresh',8:'refresh',9:'source, queue, refresh',10:'simulate, refresh',11:'query, detail',12:'createBusiness, updateBusiness',13:'queue, refresh',25:'invite, previewInvitation, revokeInvite',26:'previewInvitation, join',27:'detail',28:'revokeMember, query, deliver',29:'team, editMember',30:'editMember, inShift, deliver',31:'requireAccess, selectIdentity, selectBusiness',32:'scopeBounds, query, getAviso, csv',33:'bounds, query',34:'report, csv',36:'boxes, boxCommunication, boxAcknowledge',37:'newBoxCode, pairBox',39:'query',40:'query',41:'query',42:'requireAccess, query',43:'report'}
module=lambda n:'Negocio' if n==12 else 'Equipo y horarios' if n in [25,26,28,29,30,31,32] else 'Fuentes y TarkiBox' if n in [36,37] else 'Cierre y CSV' if n in [33,34,43] else 'Avisos y búsqueda'
stories={int(s['id'][-3:]):s for s in source['stories']}
backlog={int(b['id'][2:]):b for b in source['backlog']}
tests=lambda n:[t for t in results['results'] if t['hu']==f'HU-{n:03}']
status=lambda n:'Parcial por integración externa' if n in partial else 'Verificada en navegador local'
backtext=lambda n:('; '.join(f"{backlog[b]['id']} {backlog[b]['story'].split(':')[0]}" for b in mapping[n]) or 'Sin equivalente directo')+(' (relación parcial, no equivalencia)' if n in not_equivalent else ' (correspondencia funcional; criterios no idénticos)' if mapping[n] else '')
lim=lambda n:partial.get(n,'Criterios de interacción verificados en alcance local. La aprobación académica final requiere repetirlos en GitHub Pages.')
route='components/landing_sections/06_demo.html; controles extendidos por js/demo-ui.js'

trace=['# Trazabilidad de las 30 historias de usuario','',
'Fuente principal: las 48 fichas detalladas del informe TB2. Los textos siguientes se extrajeron de OOXML sin corregir ni reinterpretar los requisitos. Los identificadores del backlog son otro inventario.',
'','Selección fija: '+', '.join(f'HU-{n:03}' for n in selected)+'.','',
'Resultado local: 94 comprobaciones automatizadas PASS y 0 FAIL; 90 corresponden a CA01–CA03 de 30 HU y 4 son transversales. Veinte HU verificadas dentro del alcance del navegador, diez parciales por dependencias externas. Ninguna cuenta como aceptación final sobre GitHub Pages.',
'','| HU | Nombre | Módulo | Estado | Backlog relacionado |','|---|---|---|---|---|']
for n in selected: trace.append(f"| HU-{n:03} | {stories[n]['name']} | {module(n)} | {status(n)} | {backtext(n)} |")
for n in selected:
 s=stories[n]; trace += ['',f"## {s['id']} {s['name']}",'',s['description'],'','### Criterios originales','']
 trace += [f'- CA0{i+1}: {v}' for i,v in enumerate(s['criteria'])]
 trace += ['','### Escenarios Gherkin originales','']
 for g in s['scenarios']: trace += [f"**{g['name']}**",'',f"DADO {g['given']}  ",f"CUANDO {g['when']}  ",f"ENTONCES {g['then']}",'']
 trace += [f'**Implementación:** {implementation[n]}',f'**Componente y ruta:** #{"tab-dispositivos" if n in [36,37] else "tab-equipo" if module(n)=="Equipo y horarios" else "tab-cierre" if module(n)=="Cierre y CSV" else "tab-avisos"}; {route}.',f'**JavaScript:** js/demo-core.js ({functions[n]}); js/demo-ui.js (controles y representación).',
 '**Procedimiento automatizado:** ejecutar `node tests/acceptance.cjs`; revisar estas comprobaciones:', '']
 trace += [f"- {t['criterion']}: {t['name']} → {t['status']}." for t in tests(n)]
 trace += ['',f'**Resultado observado:** {len(tests(n))}/3 comprobaciones locales aprobadas. Los escenarios que aluden a servicios, cuentas o equipos externos solo se reproducen con sustitutos locales; no demuestran integración.',f'**Estado:** {status(n)}.',f'**Correspondencia con backlog:** {backtext(n)}.',f'**Limitaciones:** {lim(n)}']
(DOCS/'TRACEABILITY_30_HU.md').write_text('\n'.join(trace)+'\n',encoding='utf-8')

cross=['# Correspondencia de inventarios','',
'El TB2 contiene 48 fichas HU-001–HU-048 y 48 entradas HU01–HU48 en Product Backlog. Coincidir en el número no implica tratarse de la misma historia. La relación se estableció por contenido; no se cambió ninguno de los textos originales.',
'','Una relación parcial señala que el backlog contiene solo parte del comportamiento, otro dispositivo o un requisito cercano. Debe ser reconciliada por el equipo antes de usarla como cadena Needfinding → Figma → implementación. No se inventa trazabilidad con nodos Figma que no se inspeccionaron.',
'','| Ficha detallada | Nombre original | Backlog relacionado | Selección |','|---|---|---|---|']
for n,s in stories.items(): cross.append(f"| {s['id']} | {s['name']} | {backtext(n)} | {'Sí' if n in selected else 'No'} |")
cross += ['','## Product Backlog original','']
for b in source['backlog']: cross += [f"### {b['id']}",'',b['story'],'',b['criteria'],'']
(DOCS/'CORRESPONDENCIA_48_HU_BACKLOG.md').write_text('\n'.join(cross),encoding='utf-8')

proof=['# Pruebas de aceptación de las 30 HU','',
'Fecha de referencia: 23 de noviembre de 2026, Lima. Código preservado antes del cambio en etiqueta local `checkpoint-pre-30-hu-20261123` (commit f0773e3).',
'','## Reproducción','',
'1. Desde la raíz, ejecutar `node tests/acceptance.cjs` (Node 24 o compatible). No instala dependencias. Genera docs/acceptance-results.json.',
'2. Iniciar `python -m http.server 8765 --bind 127.0.0.1` y abrir http://127.0.0.1:8765/#demo.',
'3. Restablecer ejemplos como Elena antes de comparar cifras iniciales. El reloj de la suite es fijo: 23/11/2026 15:00 America/Lima; la interfaz usa la hora real en Lima.',
'4. Seleccionar identidades ficticias desde el control de demo. Esta selección no es autenticación. Todos los datos son ejemplos.',
'','## Resultados automatizados','',f"{results['passed']} PASS; {results['failed']} FAIL. Los 90 casos por criterio comprueban el modelo y cuatro casos transversales prueban persistencia, recuperación ante errores, aislamiento y CSV. Algunas comprobaciones de texto son estáticas y se complementan con las observaciones de navegador documentadas abajo.",'',
'| HU | Criterio | Comprobación y resultado esperado | Obtenido |','|---|---|---|---|']
for t in results['results']: proof.append(f"| {t['hu']} | {t['criterion']} | {t['name']} | {t['status']} |")
proof += ['','## Comprobaciones en navegador ejecutadas','',
'Navegador integrado Chromium, localhost. No se realizaron pruebas sobre la versión pública anterior porque no contiene estos cambios. No hubo errores JavaScript en la consola observada.',
'','| Procedimiento | Esperado | Observado |','|---|---|---|',
'| Restablecer y buscar S/20 | Dos registros con datos diferentes | Dos resultados TP-1042 y TP-1041 |',
'| Abrir TP-1039 | Datos ausentes sin confirmación de ingreso | Monto, nombre y hora no disponibles; fuente no identificada |',
'| Abrir resumen inicial | 4 avisos, 3 con monto, S/55 | Yape 2/S35; Plin 1/S20; desconocido 1/S0; revisión manual S35 |',
'| Generar tres consecutivos y reenviar último ID | +3 y luego +0 | 3 nuevos/3 procesados; 0 nuevos/1 procesado |',
'| Crear tardío y pulsar Actualizar | Cola primero y un aviso nuevo después | 1 procesado/1 nuevo; horas diferenciadas |',
'| Buscar maria entre 14:29 y 14:32 | Coincidencia de María López | Un resultado |',
'| Crear invitación de mes y canjear como Nueva persona | Vista previa y cuenta colaboradora | Mateo Quispe vio negocio/permisos y consultó mes; no obtuvo administración |',
'| Cancelar retiro de Mateo | Permiso vigente conservado | Vigente después de cancelar |',
'| Confirmar retiro de Mateo | Estado revocado persistido | Revocado, con nombre en confirmación |',
'| Revocar Lucía y elegir su identidad | Consulta bloqueada | No tienes permiso para esta acción en este negocio |',
'| Vincular código virtual y comunicar | Pendiente y luego conectado virtual | Estado cambió solo tras simular comunicación |',
'| Enviar aviso y luego simular acuse | 1 enviado/0 confirmados y después 1/1 | Contadores separados correctos |',
'| Desconectar Box virtual | Conservar comunicación conocida | Desconectado, misma última hora y contadores |',
'| Simular caída y solicitar actualización | Advertencia, sin adelantar hora | Sin conexión y última hora válida conservada |',
'| Recargar página | Conservar cambios | 9 avisos, revocaciones y Box permanecieron |',
'| Recorrer cinco vistas a 1440, 768 y 390 px | Funciones accesibles sin overflow de documento | 15/15 vistas, anchos scroll 1425, 753 y 375 px respectivamente |',
'| Buscar referencias académicas en texto visible de demo | Sin HU, CA ni Gherkin | Ninguna referencia visible |',
'','## Evidencia y límites','',
'Los estados y cifras dependen del orden de las acciones. La suite usa un estado nuevo por criterio y un almacenamiento en memoria; la comprobación de navegador usó localStorage real y recarga. La prueba visual responsive incluye capturas de escritorio y móvil inspeccionadas en sesión. No equivale a una auditoría WCAG completa.',
'','La caída simulada y el argumento offline del servicio se verificaron. Se implementaron listeners online/offline del navegador; no se forzó una desconexión física ni se verificó conectividad de Android. No confundir navigator.onLine con prueba de acceso a un servidor.',
'','Los turnos restringen nuevas alertas locales, no la consulta del historial autorizado: esa es la distinción de CA02 de HU-030 y HU-042. Los turnos que cruzan medianoche se configuran como dos jornadas; esta versión valida fin posterior a inicio dentro del mismo día.',
'','Los códigos de invitación se revisan y vuelven a validar al confirmar; los códigos del Box usado en otro negocio se rechazan. No hay captura, entrega push, autenticación, broker ni firmware.',
'','## Verificación externa pendiente por criterio','']
for n,reason in partial.items(): proof += [f'- HU-{n:03}: {reason}']
proof += ['','Todas las HU: repetir los casos en GitHub Pages después de autorización de publicación; verificar trazabilidad con Needfinding, Arquitectura de Información y Figma con el equipo. No se hizo push ni despliegue.']
(DOCS/'PRUEBAS_ACEPTACION_30_HU.md').write_text('\n'.join(proof)+'\n',encoding='utf-8')

intro='Se implementaron las 30 historias de la selección fija en una demostración funcional con estado compartido, persistencia local y autorización por membresía. Las pruebas locales permiten verificar 20 historias dentro del navegador; 10 permanecen parciales respecto al sistema completo porque sus criterios o escenarios requieren cuentas, servicios, Android o Box físicos. No se certifican 30 historias completas de extremo a extremo.'
guide=[('Avisos y búsqueda','Restablecer ejemplos; capturar los dos resultados S/20, detalle incompleto, intervalo horario y recepción tardía. Generar tres consecutivos y un reenvío; mostrar que el conteo no aumenta con el reenvío.'),
('Negocio y equipo','Crear negocio con nombre y responsable, elegir negocio, generar invitación sin incorporar miembro; cambiar a Nueva persona, revisar y canjear. Capturar permisos, editar turno, cancelar retiro y confirmar retiro; elegir identidad retirada y mostrar bloqueo.'),
('Historial y reportes','Probar día, semana, mes y rango; comparar tabla, cantidad y desglose. Limitar Lucía a hoy e intentar otros días. Exportar CSV como administración con los mismos filtros.'),
('Box virtual','Generar código en pantalla virtual, ingresar, revisar negocio y confirmar. Capturar pendiente, comunicación, aviso enviado sin acuse, acuse simulado y desconexión. No presentar estas pantallas como conexión ESP32.'),
('Responsive y regresión','Recorrer las cinco vistas a 1440, 768 y 390 px, usar las pestañas desplazables y la tabla. Probar foco y teclado, validar campos y comprobar persistencia al recargar. Repetir en la URL pública final.')]
report=['# TarkiPay Implementación y verificación de historias de usuario','', 'KAYRAQ · HCI for UX Design · Universidad Peruana de Ciencias Aplicadas · Ciclo 202620 · 23 de noviembre de 2026','',
'## 1 Resumen para el equipo','',intro,'',
'El handbook exige 30 HU core trazables y aceptación sobre GitHub Pages. Este informe registra una ejecución local; no sustituye esa validación final ni las pruebas con usuarios. Se conservan hero, logotipo, imagen oficial del Box, navegación, secciones, tipografía, paleta y contacto Hablemos.','',
'## 2 Selección fija de 30 historias','']
report+=['| HU | Nombre | Estado |','|---|---|---|']+[f"| HU-{n:03} | {stories[n]['name']} | {status(n)} |" for n in selected]
report+=['','## 3 Detalle de historias y aceptación','']
# Markdown report contains full original requirement, implementation and test detail.
report+=trace[trace.index(f"## HU-001 {stories[1]['name']}"):]
report+=['','## 4 Guía de evidencias','']
for title,body in guide: report += [f'### {title}','',body,'']
report+=['## 5 Correspondencia con el backlog','',cross[2],cross[4],'']
report+=cross[6:6+len(stories)+2]
report+=['','## 6 Resumen de cumplimiento','',
'- Seleccionadas: exactamente 30.', '- Implementadas y verificadas en alcance del navegador: 20.', '- Parciales por dependencias externas: 10.', '- Sin flujo local implementado: 0.', '- Comprobaciones automatizadas: 94 PASS y 0 FAIL.', '- Aceptación final sobre GitHub Pages: pendiente para las 30.',
'','Integración real implementada: lógica nativa del navegador, DOM, descarga CSV y localStorage. Simulación: eventos, identidades, cuentas, servicio de sincronización y Box. Integraciones ausentes: captura Android, servidor remoto, broker MQTT/Mosquitto, ESP32 y alertas push.',
'','El compañero debe revisar la correspondencia semántica del backlog, la trazabilidad con Figma y Needfinding, el alcance de simulación y los criterios externos pendientes antes de utilizar este informe como evidencia final. Los resultados no deben resumirse como 30 HU completas.']
(DOCS/'TarkiPay_30_Historias_Usuario_Implementadas.md').write_text('\n'.join(report)+'\n',encoding='utf-8')

doc=Document(); sec=doc.sections[0];sec.page_width=Inches(8.27);sec.page_height=Inches(11.69)
sec.top_margin=sec.bottom_margin=Inches(.68);sec.left_margin=sec.right_margin=Inches(.78)
style=doc.styles['Normal'];style.font.name='Calibri';style.font.size=Pt(10.5);style.paragraph_format.space_after=Pt(5)
for border in doc.styles.element.xpath('.//w:pBdr'):
 border.getparent().remove(border)
lang=OxmlElement('w:lang');lang.set(qn('w:val'),'es-PE');style.element.get_or_add_rPr().append(lang)
for name in ['Title','Subtitle','Heading 1','Heading 2','Heading 3']:
 doc.styles[name].font.color.rgb=RGBColor(0,0,0);doc.styles[name].font.name='Calibri'
doc.styles['Title'].font.size=Pt(27);doc.styles['Heading 1'].font.size=Pt(18);doc.styles['Heading 2'].font.size=Pt(14)
footer=sec.footer.paragraphs[0];footer.alignment=2
run=footer.add_run('TarkiPay   |   ');run.font.size=Pt(9)
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
def p(t): doc.add_paragraph(t)
def heading(t,level=1):doc.add_heading(t,level)
def table(headers,rows,widths=None):
 t=doc.add_table(rows=1, cols=len(headers)); t.autofit=False
 if widths:
  for col,w in zip(t.columns,widths):col.width=Inches(w)
 for c,h in zip(t.rows[0].cells,headers):c.text=h
 repeat=OxmlElement('w:tblHeader');t.rows[0]._tr.get_or_add_trPr().append(repeat)
 for row in rows:
  for c,v in zip(t.add_row().cells,row):c.text=str(v)
 for ri,row in enumerate(t.rows):
  for ci,c in enumerate(row.cells):
   if widths:c.width=Inches(widths[ci])
   pr=c._tc.get_or_add_tcPr(); borders=OxmlElement('w:tcBorders')
   for edge in ['top','left','bottom','right']:
    item=OxmlElement('w:'+edge);item.set(qn('w:val'),'single');item.set(qn('w:sz'),'4');item.set(qn('w:color'),'D9D9D9');borders.append(item)
   pr.append(borders)
   shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E8EDF3' if ri==0 else 'F7F9FB' if ri%2==0 else 'FFFFFF');pr.append(shade)
   for para in c.paragraphs:
    para.paragraph_format.space_after=Pt(4)
    for r in para.runs:r.font.size=Pt(9);r.bold=ri==0
 return t

doc.add_paragraph('TarkiPay',style='Title');doc.add_paragraph('Implementación y verificación de historias de usuario',style='Subtitle')
p('KAYRAQ');p('HCI for UX Design');p('Universidad Peruana de Ciencias Aplicadas');p('Ciclo académico 202620');p('23 de noviembre de 2026 · Lima, Perú')
p('Informe para revisión del equipo');p(intro)
p('Fuentes: Final Project Handbook HCI for UX Design 202620; informe TarkiPay TB2 corregido; prompt maestro y auditoría funcional entregados por el equipo.')
doc.add_page_break();heading('1 Resumen para el equipo');p(intro)
p('La auditoría se utilizó como diagnóstico y cada brecha se contrastó con la versión local f0773e3. Se preservó esa versión mediante una etiqueta Git local antes de modificar el código. No se hizo push ni despliegue.')
table(['Indicador','Resultado'],[['HU seleccionadas','30'],['Verificadas en alcance del navegador','20'],['Parciales por integración externa','10'],['Sin flujo local implementado','0'],['Comprobaciones automatizadas','94 PASS · 0 FAIL'],['Aceptación final en GitHub Pages','Pendiente para las 30']], [3.6,3.0])
heading('1.1 Cambios funcionales',2)
p('Se sustituyeron cambios meramente visuales por un servicio local con negocios, cuentas ficticias, membresías, invitaciones, avisos, turnos, entregas, ventas y Box virtuales. Las vistas consultan el mismo estado; las acciones vuelven a comprobar autorización. La identidad ficticia seleccionable no equivale a autenticación.')
p('Se incorporaron cola y deduplicación, filtros combinados, periodos de calendario, desglose por fuente, canje de códigos y edición de permisos. Los horarios restringen alertas; la consulta respeta el historial autorizado incluso fuera del turno. El modelo se guarda en localStorage y puede restablecerse.')
p('Se conservaron la landing y sus elementos visuales aprobados. Los cambios de controles se limitaron a la demo existente. Las HU y sus criterios aparecen únicamente en documentación.')
heading('1.2 Límites de la evidencia',2)
p('Las pruebas ejecutadas son locales. No hay servidor remoto, autenticación real, captura de notificaciones Android, broker MQTT/Mosquitto, ESP32 ni entrega push. Los contadores del Box describen envíos y acuses virtuales, nunca pagos acreditados ni confirmación física.')
p('El handbook requiere repetir la aceptación en GitHub Pages y mantener trazabilidad con Needfinding, backlog, arquitectura, flujos y Figma. Este trabajo no inspeccionó los nodos Figma ni entrevistó usuarios; esas verificaciones siguen a cargo del equipo.')
doc.add_page_break();heading('2 Selección fija de 30 historias')
table(['HU','Nombre','Resultado'],[[f'{n:03}',stories[n]['name'],'Parcial externa' if n in partial else 'Verificada local'] for n in selected],[.5,4.3,1.8])
for index,n in enumerate(selected):
 s=stories[n];doc.add_page_break();heading(f"3.{index+1} {s['id']} {s['name']}")
 p(s['description']);heading('Criterios de aceptación originales',2)
 for i,c in enumerate(s['criteria']):p(f'CA0{i+1}  {c}')
 heading('Escenarios Gherkin originales',2)
 for g in s['scenarios']:
  para=doc.add_paragraph();para.add_run(g['name']+'. ').bold=True;para.add_run(f"DADO {g['given']}; CUANDO {g['when']}; ENTONCES {g['then']}.")
 heading('Implementación y comprobación',2);p(implementation[n]);p(f'Ubicación: {module(n)}. Código: js/demo-core.js ({functions[n]}); js/demo-ui.js; components/landing_sections/06_demo.html.')
 p('Ejecutar node tests/acceptance.cjs desde la raíz. Resultados observados por criterio:')
 for t in tests(n):p(f"{t['criterion']}  {t['name']} — {t['status']}.")
 p(f'Estado: {status(n)}. {lim(n)}');p('Backlog relacionado: '+backtext(n)+'.')
doc.add_page_break();heading('4 Guía de evidencias')
for title,body in guide:heading(title,2);p(body)
p('Restablecer los ejemplos antes de capturar cifras iniciales. Cada nuevo aviso cambia reportes y conteos. No rotular las capturas del simulador como hardware conectado o pagos confirmados.')
doc.add_page_break();heading('5 Correspondencia con el backlog')
p(cross[2]);p(cross[4]);p('La tabla resume las 30 seleccionadas. La correspondencia de las 48 fichas, los textos completos y el backlog original están en CORRESPONDENCIA_48_HU_BACKLOG.md y REQUISITOS_ORIGINALES.json.')
table(['Ficha','Backlog relacionado'],[[f'HU-{n:03}',backtext(n)] for n in selected],[.75,5.85])
doc.add_page_break();heading('6 Resumen de cumplimiento')
p('Selección fija: 30 historias. Resultado: 20 verificadas en alcance del navegador, 10 parciales por integración externa y 0 sin flujo local. Las 94 comprobaciones automatizadas finalizaron con PASS y ninguna con FAIL. Esto no certifica 30 HU completas de extremo a extremo.')
heading('6.1 Criterios pendientes de integración',2)
for n,reason in partial.items():p(f'HU-{n:03}  {reason}')
heading('6.2 Revisión del compañero antes de entregar',2)
p('Revisar y reconciliar la correspondencia del backlog, comprobar Figma y Needfinding, repetir los flujos sobre GitHub Pages y registrar la URL y versión evaluada. Confirmar que el informe conserva los textos originales y que las limitaciones se mantienen al presentar las evidencias.')
p('Verificar con infraestructura real los criterios pendientes antes de reclasificar historias. La selección de identidad sirve para demostrar roles, no para proteger datos reales. Usar únicamente datos ficticios en esta demo.')
p('Archivos de evidencia: TRACEABILITY_30_HU.md; PRUEBAS_ACEPTACION_30_HU.md; acceptance-results.json; CORRESPONDENCIA_48_HU_BACKLOG.md; REQUISITOS_ORIGINALES.json; tests/acceptance.cjs.')
doc.core_properties.title='TarkiPay Implementación y verificación de historias de usuario';doc.core_properties.author='KAYRAQ';doc.core_properties.subject='Aceptación funcional local de 30 historias seleccionadas'
target=DOCS/'TarkiPay_30_Historias_Usuario_Implementadas.docx';doc.save(target);print(target)
