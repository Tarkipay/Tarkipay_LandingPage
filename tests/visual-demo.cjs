'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const phase=process.argv[2]||'despues';
const out=path.resolve(__dirname,'../../evidencias',phase);
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1100},timezoneId:'America/Lima',reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-11-25T15:00:00-05:00'));
 await page.goto(process.env.TARKIPAY_TEST_URL||'http://127.0.0.1:8772/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.TarkiPayDemo);
 await page.evaluate(()=>TarkiPayDemo.whenIdle());
 const idle=()=>page.evaluate(()=>TarkiPayDemo.whenIdle());
 const click=async s=>{if(await page.locator(s).evaluate(el=>!!el.closest('#simulation-controls:not([open])')))await page.locator('#simulation-controls>summary').click();await page.locator(s).click();await idle();};
 const position=()=>page.evaluate(()=>{const w=document.querySelector('.sim-workspace');window.scrollTo({top:w.getBoundingClientRect().top+scrollY-104,behavior:"instant"});});
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1100});
  for(const tab of ['avisos','ventas','equipo','dispositivos','cierre']){
   await click(`[data-tab="tab-${tab}"]`);await position();
   const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,toolbar:document.querySelector('.sim-top-controls').getBoundingClientRect().height,kpi:document.querySelector('.summary-stat-card').getBoundingClientRect().height}));
   assert(geometry.scroll<=width,`Overflow ${width} ${tab}`);
   checks.push({name:`${tab}-${width}`,status:'PASS',...geometry});
   if(width===1440 || ['avisos','cierre'].includes(tab)){
    await page.screenshot({path:path.join(out,`${tab}-${width}.png`)});
    if(width===1440 || width===390)await page.locator('.sim-workspace').screenshot({path:path.join(out,`${tab}-${width}-completo.png`)});
   }
   if(phase==='despues' && tab==='avisos'){
    await click('[data-aviso-id="TP-1041"]');
    assert.equal(await page.locator('.aviso-item.selected').getAttribute('data-aviso-id'),'TP-1041');
    await page.locator('#aviso-detail-drawer').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,`aviso-seleccionado-${width}.png`)});
    assert.match(await page.locator('#aviso-detail-content').innerText(),/Carlos Ruiz/);
    await click('#btn-close-detail');
    await page.locator('#tab-avisos').evaluate(el=>el.scrollTop=0);
   }
  }
 }
 await page.setViewportSize({width:1440,height:1100});
 await click('[data-tab="tab-avisos"]');
 // Reproduce native scroll-to-control: fixed landing header used to cover controls.
 await page.locator('.sim-workspace').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
 const overlap=await page.evaluate(()=>{const h=document.querySelector('.site-header').getBoundingClientRect(),w=document.querySelector('.sim-workspace').getBoundingClientRect();return {headerBottom:h.bottom,workspaceTop:w.top,overlap:h.bottom>w.top};});
 await page.screenshot({path:path.join(out,'ancla-workspace.png')});
 await position();
 if(phase==='despues'){
  await page.locator('.site-header a[href="#demo"]').click();
  const nav=await page.evaluate(()=>({header:document.querySelector('.site-header').getBoundingClientRect().bottom,app:document.querySelector('.sim-workspace').getBoundingClientRect().top}));
  assert(nav.app>=nav.header);
  const initialScroll=await page.evaluate(()=>scrollY);
  await page.locator('#tab-avisos').hover();await page.mouse.wheel(0,1600);
  await page.waitForFunction(()=>document.querySelector('#tab-avisos').scrollTop>0);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert(Math.abs(await page.evaluate(()=>scrollY)-initialScroll)<2);
  await page.locator('#tab-avisos').evaluate(el=>el.scrollTop=0);
  checks.push({name:'Ancla real de landing y scroll contenido bajo cabecera',status:'PASS',...nav});
 }
 const initial=await page.locator('.aviso-item').count();
 await click('#btn-simulate-incoming');
 assert.equal(await page.locator('.aviso-item').count(),initial+1);
 const reportBefore=await page.evaluate(()=>TarkiPayDemo.api.report({type:'day',date:TarkiPayDemo.api.today()}));
 await page.locator('#filter-sender').fill('Maria');await page.locator('#filter-sender').dispatchEvent('input');await idle();
 await click('#btn-clear-all-filters');assert.equal(await page.locator('.aviso-item').count(),initial+1);
 await click('[data-tab="tab-cierre"]');
 const download=page.waitForEvent('download');await click('#btn-export-csv');await (await download).saveAs(path.join(out,'exportacion.csv'));
 await page.locator('#cierre-date-select').selectOption('month');await idle();
 await page.locator('#cierre-date-select').selectOption('day');await idle();
 await click('[data-tab="tab-dispositivos"]');await click('#box-new-code');
 const code=await page.evaluate(()=>TarkiPayDemo.api.boxes());
 // Pair through the existing UI, with the explicit confirmation dialog.
 const screen=await page.locator('#box-code-screen').innerText();
 const pairingCode=screen.match(/\b\d{6}\b/);assert(pairingCode,screen);
 await page.locator('#box-pair-code').fill(pairingCode[0]);await page.locator('#form-pair-box button[type="submit"]').click();
 await page.locator('#demo-confirm-accept').click();await idle();
 assert.match(await page.locator('#boxes-list').innerText(),/BOX-/);
 await page.locator('#boxes-list').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'box-vinculado.png')});
 await page.locator('#demo-identity').selectOption('U-2');await idle();assert(await page.locator('[data-tab="tab-equipo"]').isHidden());
 await page.locator('#demo-identity').selectOption('U-1');await idle();
 const business=await page.locator('#demo-business').inputValue();
 const other=await page.locator('#demo-business option').evaluateAll(opts=>opts.map(o=>o.value));
 if(other.length>1){await page.locator('#demo-business').selectOption(other.find(x=>x!==business));await idle();await page.locator('#demo-business').selectOption(business);await idle();}
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>!!window.TarkiPayDemo);await idle();
 assert.equal(await page.locator('.aviso-item').count(),initial+1);
 const reportAfter=await page.evaluate(()=>TarkiPayDemo.api.report({type:'day',date:TarkiPayDemo.api.today()}));
 assert.equal(reportBefore.cents,reportAfter.cents);assert.equal(errors.length,0);
 checks.push({name:'UI: avisos, filtros, CSV, periodos, vinculación virtual, permisos, identidades, negocios y persistencia',status:'PASS'});
 fs.writeFileSync(path.join(out,'visual-resultados.json'),JSON.stringify({phase,browser:await browser.version(),errors,overlap,checks},null,2));
 await browser.close();console.log(JSON.stringify({phase,errors,overlap,checks:checks.length}));
})().catch(e=>{console.error(e);process.exit(1);});


