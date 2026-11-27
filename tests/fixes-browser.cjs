// New expected-behaviour regressions. Original audit scripts are preserved in sources/.
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const URL=process.env.TARKIPAY_TEST_URL || 'http://127.0.0.1:8768/';
const OUT=path.resolve(__dirname,'../../evidencias/despues');fs.mkdirSync(OUT,{recursive:true});
const legacyCore=require('../../sources/TarkiPay_Landing/js/demo-core.js');
const src=fs.readFileSync(path.join(__dirname,'../js/landing.js'),'utf8');
const seed=vm.runInNewContext('const today="2026-11-25",yesterday="2026-11-24",displayDate=x=>x,localDate=()=>today;'+src.slice(src.indexOf('  const demoSeed = {'),src.indexOf('  // Exponer estado'))+';demoSeed');
const TIME=Date.parse('2026-11-25T15:00:00-05:00');
const day={type:'day',date:'2026-11-25'},shift={days:[0,1,2,3,4,5,6],start:'00:00',end:'23:59'};
const results=[],errors=[];let browser,context,p,q;
const api=(page,method,...args)=>page.evaluate(async ({method,args})=>{if(['query','context','team','invitations','deliveries','boxes','report','csv'].includes(method))await TarkiPayDemo.api.reload();return TarkiPayDemo.api[method](...args);},{method,args});
const load=async(page)=>{await page.clock.setFixedTime(new Date(TIME));await page.goto(URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.TarkiPayDemo);page.on('pageerror',e=>errors.push(e.message));};
const fresh=async()=>{if(context)await context.close();context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'America/Lima'});p=await context.newPage();q=await context.newPage();await Promise.all([load(p),load(q)]);};
const queue=(page,id)=>page.evaluate(async id=>{await TarkiPayDemo.api.queue({id,amount:20,sender:'Regresión',channel:'Yape',eventAt:Date.now(),receivedAt:Date.now()});return TarkiPayDemo.api.refresh();},id);
const box=async()=>{const c=await api(p,'newBoxCode');await api(p,'pairBox',c.code,true);await api(p,'boxCommunication',c.id,true);return c.id;};
const clock=async ms=>p.clock.setFixedTime(new Date(TIME+ms));
async function check(id,ca,name,fn){try{await fresh();const evidence=await fn();results.push({id,ca,name,status:'PASS',evidence});}catch(e){results.push({id,ca,name,status:'FAIL',error:e.stack});}fs.writeFileSync(path.join(OUT,'progreso-regresiones.json'),JSON.stringify(results,null,2));console.log(id,results.at(-1).status);if(results.at(-1).error)console.error(results.at(-1).error);}
async function holdLock(page){await page.evaluate(async()=>{const request=indexedDB.open(TarkiPayStore.DB_NAME,1);await new Promise(resolve=>{request.onsuccess=()=>resolve();});const tx=request.result.transaction(TarkiPayStore.STORE,'readwrite'),store=tx.objectStore(TarkiPayStore.STORE);let released=false;window.testLockHeld=true;window.releaseTestLock=()=>{released=true;};const keepAlive=()=>{const r=store.get('$root');r.onsuccess=()=>{if(!released)keepAlive();};};keepAlive();tx.oncomplete=()=>request.result.close();});}
(async()=>{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 await check('C01','HU-010 CA03','Dos pestañas, aviso y perfil antiguo; ambos sobreviven recarga',async()=>{
   const stale=q.evaluate(async()=>{const end=performance.now()+1200;while(performance.now()<end){}return TarkiPayDemo.api.updateBusiness('Perfil concurrente','Elena');});
   await new Promise(r=>setTimeout(r,250));await queue(p,'CONCURRENT-SURVIVES');await stale;
   await Promise.all([p.reload(),q.reload()]);await Promise.all([p.waitForFunction(()=>!!window.TarkiPayDemo),q.waitForFunction(()=>!!window.TarkiPayDemo)]);
   const rows=await api(p,'query',day),c=await api(q,'context');assert(rows.some(x=>x.id==='CONCURRENT-SURVIVES'));assert.equal(c.business.name,'Perfil concurrente');
   return {eventSurvives:true,profileSurvives:true,rows:rows.length};
 });
 await check('C02','HU-010 CA03','Dos pestañas escriben entidades diferentes simultáneamente',async()=>{
   await Promise.all([queue(p,'PARALLEL'),api(q,'editMember','M-2','month',shift)]);
   assert((await api(q,'query',day)).some(x=>x.id==='PARALLEL'));assert.equal((await api(p,'team')).find(m=>m.id==='M-2').scope,'month');
 });
 await check('C03','HU-010 CA03','Misma entidad y versión: un commit y un conflicto explícito',async()=>{
   const attempt=(page,name)=>page.evaluate(async name=>{try{await TarkiPayDemo.api.updateBusiness(name,'Elena',0);return {ok:true};}catch(e){return {ok:false,error:e.message};}},name);
   const r=await Promise.all([attempt(p,'Perfil A'),attempt(q,'Perfil B')]);assert.equal(r.filter(x=>x.ok).length,1);assert.match(r.find(x=>!x.ok).error,/Conflicto/);
   const c=await api(p,'context');assert.equal(c.business.profileRevision,1);return r;
 });
 await check('C04','HU-010 CA03; HU-028 CA02','Perfil antiguo no resucita membresía revocada',async()=>{
   await api(p,'revokeMember','M-2',true);await api(q,'updateBusiness','Perfil seguro','Elena');
   await api(q,'selectIdentity','U-2');await assert.rejects(()=>api(q,'query',day),/permiso/);await api(q,'selectIdentity','U-1');assert.equal((await api(q,'team')).find(x=>x.id==='M-2').active,false);
   await p.reload();await p.waitForFunction(()=>!!window.TarkiPayDemo);assert.equal((await api(p,'team')).find(x=>x.id==='M-2').active,false);
 });
 await check('C05','HU-010 CA03; HU-029 CA03','Edición antigua de integrante se rechaza después de revocarlo',async()=>{
   await api(p,'revokeMember','M-2',true);await assert.rejects(()=>api(q,'editMember','M-2','month',shift,0),/Conflicto|Integrante/);assert.equal((await api(p,'team')).find(x=>x.id==='M-2').active,false);
 });
 await check('C06','HU-010 CA03; HU-026 CA02','Escritura antigua no desconsume una invitación',async()=>{
   const i=await api(p,'invite','Mateo','today',shift);await api(p,'selectIdentity','U-guest');await api(p,'join',i.code);
   await api(q,'updateBusiness','Perfil después del canje','Elena');await assert.rejects(()=>api(q,'previewInvitation',i.code),/utilizado/);
   const inv=(await api(q,'invitations')).find(x=>x.id===i.id);assert.equal(inv.usedAt,TIME);await p.reload();await p.waitForFunction(()=>!!window.TarkiPayDemo);await assert.rejects(()=>api(p,'join',i.code),/utilizado/);
 });
 await check('C07','HU-026 CA02','Dos canjes simultáneos consumen el código solo una vez',async()=>{
   const i=await api(p,'invite','Una persona','today',shift);await Promise.all([api(p,'selectIdentity','U-guest'),api(q,'selectIdentity','U-guest')]);
   const r=await Promise.allSettled([api(p,'join',i.code),api(q,'join',i.code)]);assert.equal(r.filter(x=>x.status==='fulfilled').length,1,JSON.stringify(r));
   await api(p,'selectIdentity','U-1');assert.equal((await api(p,'team')).filter(x=>x.name==='Una persona').length,1);
 });
 await check('C08','HU-010 CA03; HU-013 CA02','Dos colas con el mismo ID no duplican aviso ni entrega Box',async()=>{
   const id=await box();await Promise.all([queue(p,'SAME-ID'),queue(q,'SAME-ID')]);
   assert.equal((await api(p,'query',day)).filter(x=>x.id==='SAME-ID').length,1);assert.equal((await api(p,'deliveries')).filter(x=>x.boxId===id&&x.eventId==='SAME-ID').length,1);
 });
 await check('C09','HU-010 CA03','Migración v3 atómica conserva datos, revocación y canje',async()=>{
   const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};const old=legacyCore.create(seed,{storage,now:()=>TIME});
   old.revokeMember('M-2',true);const i=old.invite('Migrada','month',shift);old.selectIdentity('U-guest');old.join(i.code);old.selectIdentity('U-1');
   old.queue({id:'LEGACY-EVENT',amount:25,sender:'Original',channel:'Yape',eventAt:TIME,receivedAt:TIME});old.refresh();const raw=storage.getItem(legacyCore.KEY);
   await context.close();context=await browser.newContext();await context.addInitScript(raw=>{if(!localStorage.getItem('tarkipay.demo.v3'))localStorage.setItem('tarkipay.demo.v3',raw);},raw);p=await context.newPage();q=await context.newPage();await Promise.all([load(p),load(q)]);
   await Promise.all([api(p,'refresh'),api(q,'updateBusiness','Migrado','Elena')]);
   assert((await api(p,'query',day)).some(x=>x.id==='LEGACY-EVENT'));assert.equal((await api(p,'team')).find(x=>x.id==='M-2').active,false);await assert.rejects(()=>api(p,'join',i.code),/utilizado/);
   assert.equal(await p.evaluate(()=>localStorage.getItem(TarkiPayCore.LEGACY_KEY)),raw);return {legacyUntouched:true,migratedRows:(await api(p,'query',day)).length};
 });
 await check('C10','HU-010 CA03','Una escritura espera la transacción readwrite de otra pestaña',async()=>{
   await holdLock(q);const pending=queue(p,'WAIT-LOCK');await new Promise(r=>setTimeout(r,150));assert(!(await q.evaluate(day=>TarkiPayDemo.api.query(day),day)).some(x=>x.id==='WAIT-LOCK'));
   await q.evaluate(()=>releaseTestLock());await pending;assert((await api(q,'query',day)).some(x=>x.id==='WAIT-LOCK'));
 });
 await check('C11','HU-010 CA03','Sin IndexedDB se rechaza guardar; no hay fallback inseguro',async()=>{
   const r=await p.evaluate(async seed=>{const a=TarkiPayCore.create(seed,{storage:localStorage,indexedDB:null});try{await a.refresh();return {error:null};}catch(e){return {error:e.message};}},seed);assert.match(r.error,/IndexedDB/);
 });
 await check('C12','HU-010 CA03','Una transacción abortada no publica cambios parciales',async()=>{
   await api(p,'refresh');const before=await api(p,'context');const r=await p.evaluate(async()=>{const store=await TarkiPayStore.open();try{await store.transact(db=>{db.businesses[0].name='No guardar';throw new Error('Aborto de prueba');});return {error:null};}catch(e){return {error:e.message};}finally{store.close();}});assert.match(r.error,/Aborto/);assert.equal((await api(p,'context')).business.name,before.business.name);
 });
 await check('C13','HU-010 CA03','Operación en espera no usa una identidad que ya cambió',async()=>{
   await holdLock(q);const pending=api(p,'updateBusiness','No debe aplicarse','Elena');const outcome=pending.then(()=>null,e=>e.message);await api(p,'selectIdentity','U-2');await q.evaluate(()=>releaseTestLock());assert.match(await outcome,/identidad cambió/);assert.notEqual((await api(q,'context')).business.name,'No debe aplicarse');
 });
 await check('C14','HU-010 CA03','Lectura no depende del evento storage y no convierte caché en escritura',async()=>{
   await p.evaluate(()=>window.addEventListener('storage',e=>e.stopImmediatePropagation(),true));await queue(q,'NO-STORAGE-EVENT');assert((await api(p,'query',day)).some(x=>x.id==='NO-STORAGE-EVENT'));
 });
 await check('C15','HU-010 CA03','Datos corruptos no se sustituyen por ejemplos al guardar',async()=>{
   await p.evaluate(async()=>{const r=indexedDB.open(TarkiPayStore.DB_NAME,1);await new Promise(resolve=>r.onsuccess=resolve);const tx=r.result.transaction(TarkiPayStore.STORE,'readwrite');tx.objectStore(TarkiPayStore.STORE).put({key:'$root',value:{version:99}});await new Promise(resolve=>tx.oncomplete=resolve);r.result.close();});
   await assert.rejects(()=>api(q,'refresh'),/datos guardados/);
 });
 await check('C16','HU-010 CA03','Perfil escribe solo entidades cambiadas; nunca un snapshot con todos los avisos',async()=>{
   await api(p,'refresh');
   await p.evaluate(()=>{window.entityPuts=[];const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(record,...args){entityPuts.push({key:record.key,type:record.type,rootHasAvisos:!!record.value?.avisos});return put.call(this,record,...args);};});
   await api(p,'updateBusiness','Solo perfil',seed.ownerName);
   const puts=await p.evaluate(()=>entityPuts);assert(puts.some(r=>r.type==='businesses'));assert(!puts.some(r=>['avisos','memberships','invitations','boxes'].includes(r.type)));assert(!puts.some(r=>r.rootHasAvisos));return puts;
 });
 await check('C17','HU-010 CA03; HU-028 CA02','Una acción en cola vuelve a autorizarse tras revocación concurrente',async()=>{
   await api(p,'refresh');await api(q,'selectIdentity','U-2');await holdLock(p);
   const revoke=api(p,'revokeMember','M-2',true);const request=api(q,'request',20,'No guardar tras revocación').then(()=>null,e=>e.message);
   await p.evaluate(()=>releaseTestLock());await revoke;assert.match(await request,/permiso/);assert.equal((await api(p,'requests')).length,2);assert.equal((await api(p,'team')).find(m=>m.id==='M-2').active,false);
 });
 await check('T01','HU-036 CA03','Justo antes del límite: envío virtual aceptado, no acuse',async()=>{
   const id=await box();await clock(119999);await queue(p,'BEFORE');const b=(await api(p,'boxes'))[0];assert.equal(b.status,'Conectado virtual');assert.equal(b.sent,1);assert.equal(b.acknowledged,0);assert.equal(b.pending,0);return b;
 });
 await check('T02','HU-036 CA03','Exactamente al límite inclusivo: misma política en estado y distribución',async()=>{
   await box();await clock(120000);await queue(p,'EXACT');const b=(await api(p,'boxes'))[0];assert.equal(b.status,'Conectado virtual');assert.equal(b.sent,1);return b;
 });
 await check('T03','HU-036 CA03','Justo después del límite: pendiente, cero enviados y cero acuses',async()=>{
   await box();await clock(120001);await queue(p,'AFTER');const b=(await api(p,'boxes'))[0];assert.equal(b.status,'Desconectado');assert.equal(b.sent,0);assert.equal(b.pending,1);assert.equal(b.acknowledged,0);assert.equal(b.attempts,0);return b;
 });
 await check('T04','HU-036 CA03','Desconexión manual: sin envíos ni acuses inexistentes',async()=>{
   const id=await box();await api(p,'boxCommunication',id,false);await queue(p,'MANUAL');assert.equal((await api(p,'boxes'))[0].pending,1);await assert.rejects(()=>api(p,'boxAcknowledge',id),/comunicación/);assert.equal((await api(p,'boxes'))[0].acknowledged,0);
 });
 await check('T05','HU-036 CA03','Reconexión drena pendientes una sola vez y exige acuse explícito',async()=>{
   const id=await box();await clock(120001);await queue(p,'PENDING-1');await queue(p,'PENDING-2');await api(p,'boxCommunication',id,true);await api(p,'boxCommunication',id,true);
   let b=(await api(p,'boxes'))[0];assert.equal(b.sent,2);assert.equal(b.pending,0);assert.equal(b.acknowledged,0);assert.equal(b.attempts,2);
   await api(p,'boxAcknowledge',id);const before=await api(p,'deliveries');await api(p,'boxAcknowledge',id);b=(await api(p,'boxes'))[0];assert.equal(b.acknowledged,2);assert.equal(b.attempts,2);assert.deepEqual(await api(p,'deliveries'),before);
   assert.equal(before.filter(x=>x.boxId===id).length,2);return b;
 });
 await check('T06','HU-036 CA03','Intento rechazado no es aceptación ni recepción',async()=>{
   const id=await box();await api(p,'boxCommunication',id,false);await queue(p,'CHANNEL-FAILURE');await api(p,'boxCommunication',id,true,false);
   let r=(await api(p,'boxes'))[0];assert.equal(r.sent,0);assert.equal(r.pending,1);assert.equal(r.acknowledged,0);assert.equal(r.attempts,1);assert.equal(r.rejected,1);
   await api(p,'boxDispatch',id,true);r=(await api(p,'boxes'))[0];assert.equal(r.sent,1);assert.equal(r.attempts,2);assert.equal(r.acknowledged,0);return r;
 });
 await check('T07','HU-036 CA03','Acuse entrante explícito tras timeout renueva comunicación; no infiere acuses nuevos',async()=>{
   const id=await box();await queue(p,'ALREADY-ACCEPTED');await clock(120001);await queue(p,'NOT-SENT');await api(p,'boxAcknowledge',id);const b=(await api(p,'boxes'))[0];assert.equal(b.status,'Conectado virtual');assert.equal(b.sent,1);assert.equal(b.acknowledged,1);assert.equal(b.pending,1);assert.equal(b.lastSeenAt,TIME+120001);
 });
 await check('R01','HU-005/032/034/039/041/043','Filtros, reportes, CSV y permisos después de escrituras concurrentes',async()=>{
   await Promise.all([queue(p,'REPORT'),api(q,'editMember','M-2','today',shift)]);const r=await api(p,'report',day);assert.equal(r.count,5);assert.equal(r.cents,7500);const filtered=await api(p,'report',day,{amount:20,sender:'maria',channel:'Yape',start:'14:29',end:'14:32'});assert.equal(filtered.count,1);assert.equal(filtered.cents,2000);assert.equal((await api(p,'csv',day,{channel:'Plin'})).split('\r\n').length,2);
   await api(q,'selectIdentity','U-2');await assert.rejects(()=>api(q,'query',{type:'month',date:day.date}),/periodo/);await assert.rejects(()=>api(q,'csv',day),/permiso/);
 });
 await check('R02','HU-010/036','UI conserva cinco vistas y responsive sin modificar HTML/CSS',async()=>{
   const widths=[];for(const width of [1440,768,390]){await p.setViewportSize({width,height:1000});for(const name of ['avisos','ventas','equipo','dispositivos','cierre']){await p.locator(`[data-tab="tab-${name}"]`).click();await p.evaluate(()=>TarkiPayDemo.whenIdle());const size=await p.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert(size.scroll<=size.width);widths.push({view:name,...size});}await p.locator('.sim-workspace').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(OUT,`responsive-${width}.png`)});}return widths;
 });
 await check('R03','HU-036 CA03','UI vencida ofrece reconexión y describe solo canal virtual',async()=>{
   const id=await box();await clock(120001);await queue(p,'UI-PENDING');await p.evaluate(()=>TarkiPayDemo.render());await p.locator('[data-tab="tab-dispositivos"]').click();await p.evaluate(()=>TarkiPayDemo.whenIdle());
   assert.match(await p.locator('#boxes-list').innerText(),/Desconectado/);assert.equal(await p.locator('[data-box-connect]').innerText(),'Simular comunicación');await p.locator('[data-box-connect]').click();await p.evaluate(()=>TarkiPayDemo.whenIdle());assert.equal((await api(p,'boxes'))[0].sent,1);assert.match(await p.locator('#boxes-list').innerText(),/canal virtual/);await p.screenshot({path:path.join(OUT,'box-reconectado.png')});
 });
 if(context)await context.close();
 const output={date:'2026-11-25',browser:await browser.version(),clock:'2026-11-25 15:00 America/Lima, límites controlados con Page.clock',url:URL,passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,errors,results};
 fs.writeFileSync(path.join(OUT,'nuevas-regresiones-browser.json'),JSON.stringify(output,null,2));await browser.close();console.log(JSON.stringify({passed:output.passed,failed:output.failed,errors},null,2));if(output.failed||errors.length)process.exitCode=1;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
