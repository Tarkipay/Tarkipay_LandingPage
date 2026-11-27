'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const URL=process.env.TARKIPAY_TEST_URL||'http://127.0.0.1:8772/',OUT=path.resolve(__dirname,'../../evidencias/despues/ecosistema');fs.mkdirSync(OUT,{recursive:true});
const results=[],errors=[];let browser,ctx,p;
const idle=()=>p.evaluate(()=>TarkiPayDemo.whenIdle());
const click=async s=>{await p.locator(s).click();await idle();};
const panel=async()=>{if(!await p.locator('#simulation-controls').evaluate(el=>el.open))await p.locator('#simulation-controls>summary').click();};
const close=async()=>{if(await p.locator('#simulation-controls').evaluate(el=>el.open))await p.locator('#simulation-controls>summary').click();};
const select=async(s,v)=>{await p.locator(s).selectOption(v);await idle();};
const state=async changes=>{await panel();for(const [k,v]of Object.entries(changes))await select('#sim-'+k,String(v));await click('#sim-environment button[type=submit]');};
const notification=async(kind='valid',source='Yape')=>{await panel();await select('#sim-kind',kind);await select('#sim-source',source);await click('#sim-notification button[type=submit]');};
const advance=async minutes=>{await panel();await select('#sim-minutes',String(minutes));await click('#sim-clock-form button[type=submit]');};
const api=async(method,...args)=>p.evaluate(async({method,args})=>{await TarkiPayDemo.api.reload();return TarkiPayDemo.api[method](...args);},{method,args});
const refresh=async()=>{await close();await click('[data-tab="tab-avisos"]');await click('#btn-refresh-avisos');};
const screenshot=async name=>{await p.locator('.sim-workspace').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await p.screenshot({path:path.join(OUT,name+'.png')});};
async function load(page){page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-11-25T15:00:00-05:00'));await page.goto(URL);await page.waitForFunction(()=>!!window.TarkiPayDemo);}
async function check(id,name,fn){if(ctx)await ctx.close();ctx=await browser.newContext({viewport:{width:1440,height:1100},timezoneId:'America/Lima',reducedMotion:'reduce'});p=await ctx.newPage();try{await load(p);await idle();const evidence=await fn();results.push({id,name,status:'PASS',evidence});}catch(e){results.push({id,name,status:'FAIL',error:e.stack});console.error(id,e);}fs.writeFileSync(path.join(OUT,'progreso.json'),JSON.stringify(results,null,2));console.log(id,results.at(-1).status);}
(async()=>{
 browser=await chromium.launch({headless:true,channel:'chrome'});
 await check('N01','Servicio/receptor/permisos/fuentes y procesador con estados observables',async()=>{
  await refresh();const successful=(await api('ecosystem')).lastSyncAt;
  await state({serverOnline:false});await advance(1);await notification();await refresh();
  let eco=await api('ecosystem');assert.equal(eco.lastSyncAt,successful);assert.equal(eco.lastAttemptAt,successful+60000);assert.match(eco.lastSyncError,/Servicio/);assert.equal((await api('query',{type:'day',date:'2026-11-25'})).length,4);await panel();await screenshot('01-servicio-caido');
  await state({serverOnline:true});await refresh();assert.equal((await api('query',{type:'day',date:'2026-11-25'})).length,5);
  await state({receiverPermission:false});await notification('valid','Plin');assert.equal((await api('ecosystem')).notifications.at(-1).status,'rejected');
  await state({receiverPermission:true,receiverOnline:false});await notification('valid','Plin');assert.equal((await api('ecosystem')).notifications.at(-1).status,'receiver-pending');
  await state({receiverOnline:true});await refresh();assert.equal((await api('query',{type:'day',date:'2026-11-25'})).length,6);
  await notification('incomplete');let rows=await api('query',{type:'day',date:'2026-11-25'});assert(rows.some(r=>r.id.startsWith('ANDROID')&&r.amount===null&&r.sender==='No disponible'));
  await notification('nonpayment');assert.equal((await api('query',{type:'day',date:'2026-11-25'})).length,7);
  await notification('duplicate');assert.equal((await api('query',{type:'day',date:'2026-11-25'})).length,7);
  await close();await click('[data-tab="tab-dispositivos"]');await click('[data-source="Plin"]');await notification('valid','Plin');assert.equal((await api('ecosystem')).notifications.at(-1).reason,'Fuente deshabilitada');
  return {lastSuccessPreserved:true,receiverRecovery:true,permissionAndSourceRejected:true,incompleteNotInvented:true,nonpaymentIgnored:true};
 });
 await check('N02','Broker, Box, reloj, pendientes, reintentos y acuses en UI',async()=>{
  await click('[data-tab="tab-dispositivos"]');await click('#box-new-code');const code=(await p.locator('#box-code-screen').innerText()).match(/virtual: (\d+)/)[1];
  await p.locator('#box-pair-code').fill(code);await click('#form-pair-box button[type=submit]');await click('#demo-confirm-accept');const id=(await api('boxes'))[0].id;await click(`[data-box-connect="${id}"]`);
  await state({brokerOnline:false});await notification();let b=(await api('boxes'))[0];assert.equal(b.sent,0);assert.equal(b.pending,1);assert.equal(b.acknowledged,0);await close();await screenshot('02-broker-pendientes');
  await state({brokerOnline:true});b=(await api('boxes'))[0];assert.equal(b.sent,1);assert.equal(b.acknowledged,0);
  await advance(2);await advance(1);await notification('valid','Plin');assert.equal((await api('boxes'))[0].pending,1);assert.equal((await api('boxes'))[0].status,'Desconectado');
  await close();await click(`[data-box-connect="${id}"]`);assert.equal((await api('boxes'))[0].sent,2);await click(`[data-box-ack="${id}"]`);await click(`[data-box-ack="${id}"]`);b=(await api('boxes'))[0];assert.equal(b.acknowledged,2);assert.equal(b.attempts,2);await screenshot('03-box-reconectado');
  return b;
 });
 await check('N03','Sesión colaboradora persiste, revocación activa y sesión sin seleccionar',async()=>{
  const q=await ctx.newPage();await load(q);await q.locator('#demo-identity').selectOption('U-2');await q.evaluate(()=>TarkiPayDemo.whenIdle());await q.reload();await q.waitForFunction(()=>!!window.TarkiPayDemo);assert.equal(await q.locator('#demo-identity').inputValue(),'U-2');assert(await q.locator('[data-tab="tab-equipo"]').isHidden());
  await click('[data-tab="tab-equipo"]');await click('[data-revoke="M-2"]');assert.match(await p.locator('#demo-confirm-message').innerText(),/Lucía/);await click('#demo-confirm-accept');
  await q.waitForFunction(()=>TarkiPayDemo.api.context().member===null);assert.equal(await q.locator('.aviso-item').count(),0);
  await panel();await click('#sim-end-session');assert.equal((await api('context')).member,null);await p.reload();await p.waitForFunction(()=>!!window.TarkiPayDemo);assert.equal(await p.locator('#demo-identity').inputValue(),'');assert.equal(await p.locator('.aviso-item').count(),0);await screenshot('04-sesion-sin-seleccionar');
  return {collaboratorRestored:true,revocationObservedInActiveTab:true,noImplicitAdmin:true};
 });
 await check('N04','Invitación con reloj y códigos Box revocados se rechazan sin conceder acceso',async()=>{
  await click('[data-tab="tab-equipo"]');await p.locator('#invite-name').fill('Nueva persona de prueba');await click('#form-invite-member button[type=submit]');const code=(await p.locator('#generated-code-value').innerText()).trim();await advance(15);await select('#demo-identity','U-guest');await p.locator('.demo-join summary').click();await p.locator('#join-code').fill(code);await click('#form-join button[type=submit]');assert(await p.locator('#join-preview').isHidden());assert.equal((await api('context')).member,null);assert.match(await p.locator('#demo-feedback').innerText(),/vencido/);
  await select('#demo-identity','U-1');await close();await click('[data-tab="tab-dispositivos"]');await click('#box-new-code');const boxCode=(await p.locator('#box-code-screen').innerText()).match(/virtual: (\d+)/)[1];await panel();await click('#sim-revoke-box-code');await close();await p.locator('#box-pair-code').fill(boxCode);await click('#form-pair-box button[type=submit]');assert.equal((await api('boxes')).length,0);assert.match(await p.locator('#demo-feedback').innerText(),/revocado/);return {expiredInviteRejected:true,revokedBoxCodeRejected:true};
 });
 await check('N05','Cinco módulos y controles desplegables a 1440/768/390 sin desbordar',async()=>{
  const geometry=[];for(const width of [1440,768,390]){await p.setViewportSize({width,height:width===390?844:1100});await close();for(const name of ['avisos','ventas','equipo','dispositivos','cierre']){await click(`[data-tab="tab-${name}"]`);assert(await p.locator('#tab-'+name).isVisible());assert((await p.locator('#tab-'+name).innerText()).trim().length>30);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}await click('[data-tab="tab-avisos"]');await panel();assert(await p.evaluate(()=>document.querySelector('.sim-tabs').getBoundingClientRect().bottom<=document.querySelector('.sim-workspace').getBoundingClientRect().bottom));await screenshot(`05-controles-${width}`);geometry.push({width,documentWidth:await p.evaluate(()=>document.documentElement.scrollWidth)});}return geometry;
 });
 await ctx.close();const output={browser:await browser.version(),passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,errors,results};fs.writeFileSync(path.join(OUT,'ecosystem-browser.json'),JSON.stringify(output,null,2));await browser.close();console.log(JSON.stringify({passed:output.passed,failed:output.failed,errors}));if(output.failed||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
