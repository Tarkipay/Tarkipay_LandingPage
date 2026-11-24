'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Core = require('../js/demo-core.js');
const source = fs.readFileSync(require('node:path').join(__dirname,'../js/landing.js'),'utf8');
const seed = vm.runInNewContext('const today="2026-11-23", yesterday="2026-11-22", displayDate=x=>x, localDate=()=>today;'+source.slice(source.indexOf('  const demoSeed = {'),source.indexOf('  // Exponer estado'))+'; demoSeed');
const results=[];
let tick;
const make = () => { tick=Date.parse('2026-11-23T15:00:00-05:00'); const data=new Map(); const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}; return {a:Core.create(seed,{now:()=>tick,storage}),storage}; };
const today = {type:'day',date:'2026-11-23'};
const shift = {days:[1,2,3,4,5,6],start:'09:00',end:'18:00'};
const allDay = {days:[0,1,2,3,4,5,6],start:'00:00',end:'23:59'};
const event = (id,changes={}) => ({id,amount:20,sender:'María',channel:'Yape',eventAt:tick,receivedAt:tick,...changes});
const expectDenied = fn => assert.throws(fn,/permiso|autorizado|acceso|periodo|inválido|vencido|utilizado|desactivada|monto|intervalo|Fecha|Días|hora|Elige|Ingresa|ya tiene|no vinculado|comunicación/i);
function check(hu,criterion,name,fn) {try {fn();results.push({hu,criterion,name,status:'PASS'});}catch(e){results.push({hu,criterion,name,status:'FAIL',error:e.stack});}}
function hu(n,tests) { tests.forEach(([name,fn],i)=>check('HU-'+String(n).padStart(3,'0'),'CA0'+(i+1),name,fn)); }
hu(1,[
 ['Orden cronológico aunque el servicio entregue invertido',()=>{const {a}=make();a.queue(event('new'));a.queue(event('older',{eventAt:tick-300000}));a.refresh();assert.equal(a.query(today)[0].id,'new');}],
 ['Monto y hora originales conservados',()=>{const {a}=make();assert.equal(a.query(today)[0].amount,20);assert.equal(a.query(today)[0].payTime,'14:32');}],
 ['Sin registros sin inventar pagos',()=>{const {a}=make();assert.equal(a.query({type:'day',date:'2026-11-20'}).length,0);}]
]);
hu(2,[
 ['Detalle conserva campos leídos',()=>{const {a}=make();const d=a.detail('TP-1041');assert.equal(d.sender,'Carlos Ruiz');assert.equal(d.channel,'Plin');assert.equal(d.payTime,'14:29');}],
 ['Datos ausentes explícitos',()=>{const {a}=make();const d=a.detail('TP-1039');assert.equal(d.amount,null);assert.equal(d.sender,'No disponible');assert.equal(d.payTime,null);}],
 ['Abrir no verifica',()=>{const {a}=make();assert.equal(a.detail('TP-1041').verifiedInWallet,false);assert.equal(a.detail('TP-1041').read,true);}]
]);
hu(3,[
 ['Yape y Plin conservan origen',()=>{const {a}=make();assert.equal(a.detail('TP-1042').channel,'Yape');assert.equal(a.detail('TP-1041').channel,'Plin');}],
 ['Fuente incierta no se atribuye',()=>{const {a}=make();assert.equal(a.detail('TP-1039').channel,'No disponible');assert(fs.readFileSync('js/demo-ui.js','utf8').includes('Billetera no identificada'));}],
 ['Origen no comprueba ingreso',()=>{const {a}=make();assert.equal(a.detail('TP-1041').verifiedInWallet,false);}]
]);
hu(4,[
 ['Registros identificados como avisos',()=>{const {a}=make();assert.equal(a.detail('TP-1041').status,'Aviso detectado');}],
 ['Leer conserva significado',()=>{const {a}=make();a.detail('TP-1041');assert.equal(a.detail('TP-1041').status,'Aviso detectado');}],
 ['Orientación a billetera presente',()=>assert(fs.readFileSync('js/demo-ui.js','utf8').includes('consulta la billetera receptora'))]
]);
hu(5,[
 ['Monto positivo; rechaza cero, negativos y precisión inválida',()=>{const {a}=make();[0,-5,1.001,NaN].forEach(amount=>expectDenied(()=>a.query(today,{amount})));assert.equal(a.query(today,{amount:20}).length,2);}],
 ['Coincidencias exactas; búsqueda sin resultados',()=>{const {a}=make();assert(a.query(today,{amount:20}).every(x=>x.amount===20));assert.equal(a.query(today,{amount:99}).length,0);}],
 ['Quitar filtro restaura lista',()=>{const {a}=make();a.query(today,{amount:20});assert.equal(a.query(today).length,4);}]
]);
hu(6,[
 ['Importes iguales son registros separados',()=>{const {a}=make();const r=a.query(today,{amount:20});assert.equal(new Set(r.map(x=>x.id)).size,2);}],
 ['Nombres y horas propios',()=>{const {a}=make();const r=a.query(today,{amount:20});assert.notEqual(r[0].sender,r[1].sender);assert.notEqual(r[0].payTime,r[1].payTime);}],
 ['Sin nombre no selecciona ni asocia automáticamente',()=>{const {a}=make();['a','b'].forEach(id=>a.queue(event(id,{sender:null})));a.refresh();const r=a.query(today).filter(x=>['a','b'].includes(x.id));assert.equal(r.length,2);assert(r.every(x=>x.sender==='No disponible' && x.linkedSaleId===null));}]
]);
hu(7,[
 ['Vacío no equivale a falta de pago',()=>assert(fs.readFileSync('js/demo-ui.js','utf8').includes('Esto no demuestra que no hubo pagos'))],
 ['Sin acceso billetera no inventa confirmación',()=>{const {a}=make();a.selectIdentity('U-2');assert.equal(a.detail('TP-1041').verifiedInWallet,false);expectDenied(()=>a.verify('TP-1041'));}],
 ['Tardío conserva identidad, ambas horas y se deduplica',()=>{const {a}=make();const e=event('late',{eventAt:tick-120000});a.queue(e);assert.equal(a.query(today).length,4);a.refresh();a.queue(e);a.refresh();const r=a.query(today).filter(x=>x.id==='late');assert.equal(r.length,1);assert.equal(r[0].eventAt,e.eventAt);assert.equal(r[0].receivedAt,e.receivedAt);assert(r[0].delayed);}]
]);
hu(8,[
 ['Última actualización efectiva persistida',()=>{const {a}=make();assert.equal(a.context().business.lastSyncAt,null);a.refresh();assert.equal(a.context().business.lastSyncAt,tick);}],
 ['Actualizar procesa cola',()=>{const {a}=make();a.queue(event('service'));const r=a.refresh();assert.equal(r.added,1);assert(a.query(today).some(x=>x.id==='service'));}],
 ['Fallo conserva hora y cola hasta reintento',()=>{const {a}=make();a.refresh();const last=tick;tick+=60000;a.queue(event('pending'));assert.throws(()=>a.refresh(false),/Sin conexión/);assert.equal(a.context().business.lastSyncAt,last);assert.equal(a.query(today).length,4);a.refresh();assert.equal(a.query(today).length,5);}]
]);
hu(9,[
 ['Consolidación de dos fuentes activas',()=>{const {a}=make();a.queue(event('y'));a.queue(event('p',{channel:'Plin'}));a.refresh();assert.equal(a.query(today).length,6);}],
 ['Origen conservado por evento',()=>{const {a}=make();a.queue(event('p',{channel:'Plin'}));a.refresh();assert.equal(a.detail('p').channel,'Plin');}],
 ['Fuente desactivada rechazada sin inventar registros',()=>{const {a}=make();a.source('Plin',false);expectDenied(()=>a.queue(event('p',{channel:'Plin'})));a.refresh();assert.equal(a.query(today).length,4);a.selectBusiness('B-2');assert.equal(a.query(today).length,0);}]
]);
hu(10,[
 ['Tres consecutivos separados',()=>{const {a}=make();a.simulate('burst');assert.equal(a.query(today).length,7);}],
 ['Orden por marcas temporales',()=>{const {a}=make();a.simulate('burst');const r=a.query(today);assert(r.every((x,i)=>!i || (r[i-1].eventAt||r[i-1].receivedAt)>=(x.eventAt||x.receivedAt)));}],
 ['Nuevos no eliminan anteriores',()=>{const {a}=make();const ids=a.query(today).map(x=>x.id);a.simulate('burst');assert(ids.every(id=>a.query(today).some(x=>x.id===id)));}]
]);
hu(11,[
 ['Monto consultable directamente',()=>{const {a}=make();assert.equal(a.query(today)[0].amount,20);}],
 ['Consultar no exige venta',()=>{const {a}=make();const n=a.sales().length;a.detail('TP-1041');assert.equal(a.sales().length,n);}],
 ['Monto ausente no inventado',()=>{const {a}=make();assert.equal(a.detail('TP-1039').amount,null);}]
]);
hu(12,[
 ['Cuenta ficticia asociada a negocio único nuevo',()=>{const {a}=make();const id=a.createBusiness('Local nuevo','Elena');assert.notEqual(id,'B-1');assert.equal(a.context().member.role,'admin');assert.equal(a.context().business.name,'Local nuevo');}],
 ['Solo administrador modifica',()=>{const {a}=make();a.selectIdentity('U-2');expectDenied(()=>a.updateBusiness('X','Y'));expectDenied(()=>a.createBusiness('X','Y'));}],
 ['Obligatorios y actualización atómica',()=>{const {a}=make();expectDenied(()=>a.updateBusiness('','Elena'));expectDenied(()=>a.updateBusiness('Cambió',''));assert.equal(a.context().business.name,seed.businessName);a.updateBusiness('Local','Titular');assert.equal(a.context().business.ownerName,'Titular');}]
]);
hu(13,[
 ['Identidad estable en primer procesamiento',()=>{const {a}=make();a.queue(event('stable'));a.refresh();assert.equal(a.detail('stable').id,'stable');}],
 ['Reintentos dentro y entre actualizaciones idempotentes',()=>{const {a}=make();a.queue(event('same'));a.queue(event('same'));assert.equal(a.refresh().added,1);a.queue(event('same'));assert.equal(a.refresh().added,0);assert.equal(a.query(today).length,5);}],
 ['Mismo importe diferente identidad se conserva',()=>{const {a}=make();a.queue(event('a'));a.queue(event('b'));a.refresh();assert.equal(a.query(today,{amount:20}).length,4);}]
]);
hu(25,[
 ['Administración y vencimiento visible',()=>{const {a}=make();const i=a.invite('Mateo','week',shift);assert.equal(i.expiresAt,tick+900000);a.selectIdentity('U-2');expectDenied(()=>a.invite('X','today',shift));}],
 ['Código asociado al negocio y permisos; aún no miembro',()=>{const {a}=make();const n=a.team().length;const i=a.invite('Mateo','month',shift);assert.equal(i.businessId,'B-1');assert.equal(i.scope,'month');assert.equal(a.team().length,n);}],
 ['Vencido usado y revocado no dan acceso',()=>{const {a}=make();const expired=a.invite('A','today',shift,1);tick+=60001;expectDenied(()=>a.previewInvitation(expired.code));const revoked=a.invite('B','today',shift);a.revokeInvite(revoked.id);expectDenied(()=>a.previewInvitation(revoked.code));const used=a.invite('C','today',shift);a.selectIdentity('U-guest');a.join(used.code);expectDenied(()=>a.join(used.code));}]
]);
hu(26,[
 ['Vista previa y cancelar no concede acceso',()=>{const {a}=make();const i=a.invite('Mateo','week',shift);a.selectIdentity('U-guest');const p=a.previewInvitation(i.code);assert.equal(p.businessName,seed.businessName);assert.equal(p.scope,'week');assert.equal(a.context().member,null);}],
 ['Inválidos vencidos y usados rechazados al canjear',()=>{const {a}=make();a.selectIdentity('U-guest');expectDenied(()=>a.join('000000'));a.selectIdentity('U-1');const i=a.invite('A','today',shift,1);a.selectIdentity('U-guest');a.previewInvitation(i.code);tick+=60001;expectDenied(()=>a.join(i.code));}],
 ['Canje crea solo colaborador sin administración',()=>{const {a}=make();const i=a.invite('Mateo','today',shift);a.selectIdentity('U-guest');a.join(i.code);assert.equal(a.context().member.role,'collab');assert.equal(a.query(today).length,4);expectDenied(()=>a.updateBusiness('X','Y'));}]
]);
hu(27,[
 ['Colaborador obtiene campos permitidos',()=>{const {a}=make();a.selectIdentity('U-2');assert.equal(a.detail('TP-1041').amount,20);}],
 ['Sin operaciones bancarias',()=>{const {a}=make();assert(!('transfer' in a));assert(!('walletCredentials' in a.context()));}],
 ['Ausencias no amplían acceso',()=>{const {a}=make();a.selectIdentity('U-2');assert.equal(a.detail('TP-1039').sender,'No disponible');assert.equal(a.context().member.role,'collab');}]
]);
hu(28,[
 ['Persona identificada; cancelar conserva acceso',()=>{const {a}=make();assert.equal(a.team().find(x=>x.id==='M-2').name,'Lucía Pérez');a.revokeMember('M-2',false);a.selectIdentity('U-2');assert.equal(a.query(today).length,4);}],
 ['Confirmar bloquea consultas y futuras alertas simuladas',()=>{const {a}=make();a.revokeMember('M-2',true);a.simulate();assert(!a.deliveries().some(d=>d.memberId==='M-2'));a.selectIdentity('U-2');expectDenied(()=>a.query(today));expectDenied(()=>a.detail('TP-1041'));expectDenied(()=>a.sales());expectDenied(()=>a.requests());}],
 ['Historial conservado y nueva invitación recupera solo alcance nuevo',()=>{const {a}=make();a.revokeMember('M-2',true);assert.equal(a.query(today).length,4);const i=a.invite('Lucía','today',shift);a.selectIdentity('U-2');a.join(i.code);assert.equal(a.context().member.scope,'today');assert.equal(a.query(today).length,4);}]
]);
hu(29,[
 ['Nombre rol permiso estado',()=>{const {a}=make();const m=a.team()[1];assert(m.name && m.role && m.scope && m.schedule && m.active);}],
 ['Revocados distintos',()=>{const {a}=make();assert.equal(a.team().find(m=>m.id==='M-3').active,false);}],
 ['Solo administración cambia alcance o lee lista',()=>{const {a}=make();a.selectIdentity('U-2');expectDenied(()=>a.editMember('M-2','month',shift));expectDenied(()=>a.team());}]
]);
hu(30,[
 ['Horario individual zona negocio validada',()=>{const {a}=make();a.editMember('M-2','today',shift);assert.equal(a.context().business.timezone,'America/Lima');expectDenied(()=>a.editMember('M-2','today',{days:[],start:'18:00',end:'09:00'}));}],
 ['En turno recibe, fuera y límite final no reciben nuevas alertas locales',()=>{const {a}=make();a.simulate();assert(a.deliveries().some(d=>d.memberId==='M-2'));const n=a.deliveries().filter(d=>d.memberId==='M-2').length;tick=Date.parse('2026-11-23T18:00:00-05:00');a.simulate();assert.equal(a.deliveries().filter(d=>d.memberId==='M-2').length,n);tick=Date.parse('2026-11-29T10:00:00-05:00');a.simulate();assert.equal(a.deliveries().filter(d=>d.memberId==='M-2').length,n);}],
 ['Cambiar turno conserva historial y alcance, consulta no depende de estar de turno',()=>{const {a}=make();const n=a.query(today).length;a.editMember('M-2','today',{days:[1],start:'00:00',end:'01:00'});assert.equal(a.query(today).length,n);a.selectIdentity('U-2');assert.equal(a.query(today).length,n);expectDenied(()=>a.query({type:'day',date:'2026-11-22'}));}]
]);
hu(31,[
 ['Rol derivado de relación de cuenta y negocio',()=>{const {a}=make();a.selectIdentity('U-2');assert.equal(a.context().member.role,'collab');const c=a.context();c.member.role='admin';assert.equal(a.context().member.role,'collab');}],
 ['Acciones administrativas rechazan colaborador aunque invoque API',()=>{const {a}=make();a.selectIdentity('U-2');[()=>a.invite('X','today',shift),()=>a.source('Yape',false),()=>a.newBoxCode(),()=>a.revokeMember('M-2',true),()=>a.csv(today),()=>a.reset()].forEach(expectDenied);}],
 ['Cambio de negocio o periodo no eleva rol ni mezcla datos',()=>{const {a}=make();a.selectIdentity('U-2');a.selectBusiness('B-2');expectDenied(()=>a.query(today));expectDenied(()=>a.updateBusiness('X','Y'));a.selectIdentity('U-1');assert.equal(a.query(today).length,0);a.selectBusiness('B-1');assert.equal(a.query(today).length,4);}]
]);
hu(32,[
 ['Permisos distintos hoy semana mes',()=>{const {a}=make();a.editMember('M-2','month',shift);a.selectIdentity('U-2');assert.equal(a.query({type:'month',date:today.date}).length,5);a.query({type:'week',date:today.date});}],
 ['Periodos ajenos bloqueados en consulta detalle resumen CSV',()=>{const {a}=make();a.selectIdentity('U-2');expectDenied(()=>a.query({type:'month',date:today.date}));expectDenied(()=>a.detail('TP-1020'));expectDenied(()=>a.report({type:'day',date:'2026-11-22'}));expectDenied(()=>a.csv(today));}],
 ['Reducir alcance no altera registros',()=>{const {a}=make();a.editMember('M-2','month',shift);a.editMember('M-2','today',shift);a.selectIdentity('U-2');assert.equal(a.query(today).length,4);expectDenied(()=>a.detail('TP-1020'));a.selectIdentity('U-1');assert.equal(a.query({type:'month',date:today.date}).length,5);}]
]);
hu(33,[
 ['Día semana mes rango y periodos anteriores',()=>{const {a}=make();assert.equal(a.query(today).length,4);assert.equal(a.query({type:'week',date:'2026-11-22'}).length,1);assert.equal(a.query({type:'month',date:'2026-11-01'}).length,5);assert.equal(a.query({type:'range',from:'2026-10',to:'2026-11',date:today.date}).length,5);expectDenied(()=>a.query({type:'range',from:'2026-12',to:'2026-10',date:today.date}));}],
 ['Rango y cantidad calculados desde datos',()=>{const {a}=make();assert.deepEqual(a.bounds({type:'week',date:'2026-11-22'}),['2026-11-16','2026-11-22']);assert.equal(a.report({type:'month',date:today.date}).count,5);}],
 ['Periodo vacío sin registros inventados',()=>{const {a}=make();assert.equal(a.report({type:'month',date:'2026-10-01'}).count,0);}]
]);
hu(34,[
 ['Cantidad y suma iniciales y tras nuevo evento',()=>{const {a}=make();const r=a.report(today);assert.equal(r.count,4);assert.equal(r.cents,5500);a.simulate();assert.equal(a.report(today).cents,7500);}],
 ['Avisos sin monto cuentan sin añadir dinero',()=>{const {a}=make();const r=a.report(today);assert.equal(r.known,3);assert.equal(r.reviewedCents,3500);assert.equal(r.count,4);}],
 ['Resumen y CSV usan mismos filtros, sin saldo bancario',()=>{const {a}=make();const f={amount:20,channel:'Plin'};const r=a.report(today,f);assert.equal(r.cents,2000);assert.equal(a.csv(today,f).split('\r\n').length,2);assert(fs.readFileSync('js/demo-ui.js','utf8').includes('no representan saldos'));}]
]);
hu(36,[
 ['Última conexión solo tras comunicación virtual',()=>{const {a}=make();const c=a.newBoxCode();a.pairBox(c.code,true);assert.equal(a.boxes()[0].lastSeenAt,null);a.boxCommunication(c.id,true);assert.equal(a.boxes()[0].lastSeenAt,tick);}],
 ['Contador enviados separado de confirmados',()=>{const {a}=make();const c=a.newBoxCode();a.pairBox(c.code,true);a.boxCommunication(c.id,true);a.simulate();assert.equal(a.boxes()[0].sent,1);assert.equal(a.boxes()[0].acknowledged,0);a.boxAcknowledge(c.id);assert.equal(a.boxes()[0].acknowledged,1);}],
 ['Desconexión y silencio conservan último dato sin inventar recepción',()=>{const {a}=make();const c=a.newBoxCode();a.pairBox(c.code,true);a.boxCommunication(c.id,true);const last=tick;tick+=120001;assert.equal(a.boxes()[0].status,'Desconectado');a.boxCommunication(c.id,false);a.simulate();assert.equal(a.boxes()[0].sent,0);assert.equal(a.boxes()[0].pending,1);assert.equal(a.boxes()[0].lastSeenAt,last);expectDenied(()=>a.boxAcknowledge(c.id));}]
]);
hu(37,[
 ['Código temporal de Box virtual sin vincular',()=>{const {a}=make();const c=a.newBoxCode();assert.equal(c.expiresAt,tick+300000);assert.equal(a.boxes().length,0);}],
 ['Vista previa, cancelar, confirmar; solo administrador',()=>{const {a}=make();const c=a.newBoxCode();const p=a.pairBox(c.code,false);assert.equal(p.businessName,seed.businessName);assert.equal(a.boxes().length,0);a.selectIdentity('U-2');expectDenied(()=>a.pairBox(c.code,true));a.selectIdentity('U-1');a.pairBox(c.code,true);assert.equal(a.boxes()[0].status,'Pendiente de comunicación');}],
 ['Vacío inválido vencido usado y otro local rechazados',()=>{const {a}=make();expectDenied(()=>a.pairBox('',true));expectDenied(()=>a.pairBox('000000',true));const c=a.newBoxCode();tick+=300001;expectDenied(()=>a.pairBox(c.code,true));const d=a.newBoxCode();a.pairBox(d.code,true);expectDenied(()=>a.pairBox(d.code,true));a.selectBusiness('B-2');expectDenied(()=>a.pairBox(d.code,true));assert.equal(a.boxes().length,0);}]
]);
hu(39,[
 ['Intervalo horario combinado con monto nombre y fuente',()=>{const {a}=make();const r=a.query(today,{start:'14:29',end:'14:32',amount:20,sender:'maria',channel:'Yape'});assert.equal(r.length,1);assert.equal(r[0].id,'TP-1042');expectDenied(()=>a.query(today,{start:'16:00',end:'15:00'}));}],
 ['Separados incluso con misma hora y monto',()=>{const {a}=make();assert.equal(a.query(today,{start:'14:29',end:'14:29'}).length,2);assert.equal(a.query(today,{start:'15:00',end:'16:00'}).length,0);}],
 ['Quitar horas restaura el mismo periodo',()=>{const {a}=make();const p={type:'day',date:'2026-11-22'};assert.equal(a.query(p,{start:'18:00'}).length,0);assert.equal(a.query(p).length,1);}]
]);
hu(40,[
 ['Nombre leído tolerante a tilde',()=>{const {a}=make();assert.equal(a.query(today,{sender:'maria'})[0].sender,'María López');assert.equal(a.query(today,{sender:'desconocido'}).length,0);}],
 ['Resultado conserva monto y hora',()=>{const {a}=make();const r=a.query(today,{sender:'carlos'})[0];assert.equal(r.amount,20);assert.equal(r.payTime,'14:29');}],
 ['Sin nombre no se asigna nombre nuevo',()=>{const {a}=make();assert.equal(a.detail('TP-1039').sender,'No disponible');}]
]);
hu(41,[
 ['Fuentes configuradas por negocio',()=>{const {a}=make();assert.deepEqual(Object.keys(a.context().business.sources),['Yape','Plin']);}],
 ['Solo fuente elegida, incierto no se atribuye',()=>{const {a}=make();assert.equal(a.query(today,{channel:'Plin'}).length,1);assert(a.query(today,{channel:'Plin'}).every(x=>x.channel==='Plin'));}],
 ['Quitar filtro recupera inciertos',()=>{const {a}=make();a.query(today,{channel:'Plin'});assert(a.query(today).some(x=>x.channel==='No disponible'));}]
]);
hu(42,[
 ['Hoy solo negocio autorizado',()=>{const {a}=make();a.selectIdentity('U-2');assert.equal(a.query(today).length,4);a.selectBusiness('B-2');expectDenied(()=>a.query(today));}],
 ['Datos conservados y aviso tras alerta omitida disponible',()=>{const {a}=make();a.simulate();a.selectIdentity('U-2');assert.equal(a.query(today).length,5);assert.equal(a.detail('TP-1041').sender,'Carlos Ruiz');}],
 ['Otros días según permiso y revocación bloquea',()=>{const {a}=make();a.selectIdentity('U-2');expectDenied(()=>a.query({type:'day',date:'2026-11-22'}));a.selectIdentity('U-1');a.revokeMember('M-2',true);a.selectIdentity('U-2');expectDenied(()=>a.query(today));}]
]);
hu(43,[
 ['Cantidad y suma por Yape y Plin',()=>{const {a}=make();const g=a.report(today).groups;assert.deepEqual(g.map(x=>[x.count,x.cents]),[[2,3500],[1,2000],[1,0]]);}],
 ['Desconocidos separados sin atribución ni monto inventado',()=>{const {a}=make();const g=a.report(today).groups[2];assert.equal(g.channel,'No disponible');assert.equal(g.count,1);assert.equal(g.known,0);}],
 ['Periodo y filtros recalculan sumas de avisos',()=>{const {a}=make();const g=a.report({type:'month',date:today.date}).groups;assert.equal(g[0].cents,7000);const f=a.report(today,{channel:'Plin'});assert.equal(f.groups[0].count,0);assert.equal(f.groups[1].count,1);}]
]);
check('TRANSVERSAL','Persistencia','Recarga y restauración de estado',()=>{const {a,storage}=make();a.updateBusiness('Persistente','Elena');a.simulate('burst');a.revokeMember('M-2',true);const b=Core.create(seed,{now:()=>tick,storage});assert.equal(b.context().business.name,'Persistente');assert.equal(b.query(today).length,7);b.reset();assert.equal(b.query(today).length,4);assert.equal(b.context().business.name,seed.businessName);});
check('TRANSVERSAL','Persistencia','Guardado no disponible y JSON corrupto informados',()=>{const {a}=make();const b=Core.create(seed,{now:()=>tick,storage:{getItem:()=>'{',setItem:()=>{throw new Error();}}});assert(b.context().persistenceError);b.refresh();assert(b.context().persistenceError);assert.equal(a.query(today).length,4);});
check('TRANSVERSAL','Aislamiento','Eventos mismo ID en distintos negocios son independientes',()=>{const {a}=make();a.queue(event('id'));a.refresh();assert.equal(a.deliveries().length,2);a.selectBusiness('B-2');a.queue(event('id'));a.refresh();assert.equal(a.query(today).length,1);assert.equal(a.deliveries().length,1);assert(a.deliveries().every(d=>d.businessId==='B-2'));a.selectBusiness('B-1');assert.equal(a.query(today).length,5);assert.equal(a.deliveries().length,2);});
check('TRANSVERSAL','CSV','Protección de fórmulas y comillas',()=>{const {a}=make();a.queue(event('csv',{sender:'=SUM(1,2)"'}));a.refresh();assert(a.csv(today).includes("\"'=SUM(1,2)\"\"\""));});
const output={date:'2026-11-23',environment:'Node.js, reloj fijo America/Lima; servicio local simulado',passed:results.filter(x=>x.status==='PASS').length,failed:results.filter(x=>x.status==='FAIL').length,results};
fs.writeFileSync('docs/acceptance-results.json',JSON.stringify(output,null,2));
for(const r of results.filter(x=>x.status==='FAIL'))console.error(r.hu,r.criterion,r.error);
console.log(`${output.passed} PASS; ${output.failed} FAIL; ${new Set(results.filter(x=>x.hu.startsWith('HU')).map(x=>x.hu)).size} HU`);
if(output.failed)process.exitCode=1;
