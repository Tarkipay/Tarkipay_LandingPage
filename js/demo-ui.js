/* Views share the permission-checked demo service. DOM state never grants a role. */
(function () {
  'use strict';
  window.initTarkiPayDemo = function (seed) {
    let storage=null; try { storage=window.localStorage; } catch (_) {}
    const api = window.TarkiPayCore.create(seed, { storage });
    const $ = id => document.getElementById(id);
    const esc = x => String(x ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fmt = n => n === null ? 'Monto no disponible' : `S/ ${n.toFixed(2)}`;
    const instant = n => n ? new Date(n).toLocaleString('es-PE',{timeZone:'America/Lima'}) : 'Sin actualización realizada';
    const channel = c => c === 'No disponible' ? 'Billetera no identificada' : c;
    const scopeNames = { today:'Solo hoy', week:'Hoy y esta semana', month:'Hoy, semana y mes', all:'Todos los periodos' };
    let period = {type:'day',date:api.today()}, filters={amount:null,sender:'',channel:'all',start:'',end:''}, offline=false, sound=true, activeDetail=null, previewCode=null, reqFilter='pending', editing=null;
    const online = () => !offline && navigator.onLine;
    const notify = (message, error=false) => { $('demo-feedback').textContent=message; $('demo-feedback').className=`alert-box ${error ? 'error' : 'success'}`; };
    const run = fn => { try { const result=fn(); render(); return result; } catch(e) { notify(e.message,true); render(); return null; } };
    const on = (id,event,fn) => { if ($(id)) $(id).addEventListener(event,e => { if(event==='submit') e.preventDefault(); run(()=>fn(e)); }); };
    const buttons = (selector,fn) => document.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>run(()=>fn(el))));
    document.querySelector('#demo').insertAdjacentHTML('beforeend','<dialog id="demo-confirm-dialog" aria-labelledby="demo-confirm-message"><p id="demo-confirm-message"></p><div class="button-row-2"><button type="button" class="btn btn-secondary" id="demo-confirm-cancel">Cancelar</button><button type="button" class="btn btn-primary" id="demo-confirm-accept">Confirmar</button></div></dialog>');
    const ask=(message,action)=>{const d=$('demo-confirm-dialog');$('demo-confirm-message').textContent=message;$('demo-confirm-accept').onclick=()=>{d.close();run(action);};$('demo-confirm-cancel').onclick=()=>d.close();d.showModal();$('demo-confirm-cancel').focus();};
    const getSchedule = prefix => ({ days:[...document.querySelectorAll(`#${prefix}-days input:checked`)].map(i=>Number(i.value)),start:$(prefix+'-start').value,end:$(prefix+'-end').value });
    const scheduleText = s => s ? `${s.days.map(d=>['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d]).join(', ')} · ${s.start}–${s.end} · America/Lima` : 'Acceso permanente';
    const scopes = '<option value="today">Solo hoy</option><option value="week">Hoy y esta semana</option><option value="month">Hoy, semana y mes</option>';
    const scheduleFields = prefix => `<fieldset id="${prefix}-days"><legend>Días de alertas · Lima UTC-5</legend><div class="checkbox-row">${['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((d,i)=>`<label class="check-label"><input type="checkbox" value="${i}" ${i ? 'checked' : ''}>${d}</label>`).join('')}</div></fieldset><div class="form-row-2"><div class="form-group"><label for="${prefix}-start">Inicio</label><input type="time" id="${prefix}-start" value="09:00" required></div><div class="form-group"><label for="${prefix}-end">Fin</label><input type="time" id="${prefix}-end" value="18:00" required></div></div>`;
    $('demo-personalization').insertAdjacentHTML('beforebegin','<p id="demo-feedback" role="status" aria-live="polite" class="text-small"></p>');
    document.querySelector('.sim-switches').insertAdjacentHTML('afterbegin',`<div class="demo-identities"><label for="demo-identity">Identidad ficticia</label><select id="demo-identity"></select><label for="demo-business">Negocio</label><select id="demo-business"></select></div>`);
    document.querySelector('.role-switcher').remove();
    document.querySelector('.demo-intro p').innerHTML='<strong>Tu mostrador, en modo demo.</strong><br>Datos guardados en este navegador. Identidades ficticias; sin autenticación ni conexión a billeteras o equipos físicos.';
    $('btn-toggle-personalization').insertAdjacentHTML('afterend','<button type="button" class="btn btn-secondary" id="demo-reset">Restablecer ejemplos</button>');
    $('form-config-negocio').insertAdjacentHTML('beforeend','<button type="button" class="btn btn-secondary" id="demo-create-business">Crear otro negocio de ejemplo</button>');
    $('btn-simulate-incoming').insertAdjacentHTML('afterend','<label class="sr-only" for="demo-event-mode">Tipo de aviso simulado</label><select id="demo-event-mode"><option value="one">Un aviso</option><option value="burst">Tres consecutivos</option><option value="late">Tardío pendiente de actualizar</option><option value="duplicate">Reenvío del último identificador</option></select>');
    $('filter-sender').parentElement.insertAdjacentHTML('afterend',`<div class="form-group"><label for="avisos-day">Día visible</label><input type="date" id="avisos-day" value="${api.today()}"></div><div class="form-row-2"><div class="form-group"><label for="filter-time-start">Desde la hora del aviso</label><input type="time" id="filter-time-start"></div><div class="form-group"><label for="filter-time-end">Hasta la hora del aviso</label><input type="time" id="filter-time-end"></div></div><p class="text-small text-muted">Si falta la hora del aviso, se usa la de recepción. Los filtros también se aplican al resumen y CSV.</p>`);
    document.querySelector('#tab-avisos .panel-card:last-child h3').innerHTML='Avisos del periodo en <span class="dynamic-biz-name"></span>';
    $('invite-history-scope').innerHTML=scopes;
    $('invite-schedule').closest('.form-group').remove();
    $('form-invite-member').querySelector('button').insertAdjacentHTML('beforebegin',scheduleFields('invite'));
    $('generated-code-banner').insertAdjacentHTML('afterend','<div id="invitations-list" class="compact-list mt-16"></div>');
    $('team-members-list').insertAdjacentHTML('afterend',`<form id="form-edit-member" class="form-stack hidden mt-16"><h4 id="edit-member-name"></h4><div class="form-group"><label for="edit-scope">Historial autorizado</label><select id="edit-scope">${scopes}</select></div>${scheduleFields('edit')}<button type="submit" class="btn btn-primary">Guardar permisos y turno</button><button type="button" class="btn btn-secondary" id="edit-cancel">Cancelar</button></form>`);
    document.querySelector('.sim-top-controls').insertAdjacentHTML('beforeend',`<details class="demo-join"><summary>Unirme con un código de invitación</summary><p>Elige una identidad ficticia sin acceso. Revisa el negocio y los permisos antes de aceptar.</p><form id="form-join" class="form-stack"><label for="join-code">Código de invitación</label><input id="join-code" inputmode="numeric" autocomplete="off"><button type="submit" class="btn btn-secondary">Revisar invitación</button></form><div id="join-preview" class="hidden"><p id="join-preview-text"></p><button type="button" class="btn btn-primary" id="join-confirm">Aceptar y unirme</button><button type="button" class="btn btn-secondary" id="join-cancel">Cancelar</button></div></details><p id="demo-own-permissions" class="demo-own-permissions"></p>`);
    $('box-pair-code').value='';
    $('box-pair-code').placeholder='Código del Box virtual';
    $('form-pair-box').insertAdjacentHTML('beforebegin','<button type="button" class="btn btn-secondary" id="box-new-code">Encender Box virtual y generar código</button><p id="box-code-screen" class="text-small" role="status"></p>');
    $('btn-test-expired-box-code').remove();
    $('box-sound-level').closest('.form-group').remove();
    $('form-pair-box').querySelector('button[type="submit"]').textContent='Revisar y vincular al negocio';
    $('btn-test-box-sound').textContent='Probar sonido del navegador';
    $('box-connection-sub').insertAdjacentHTML('afterend','<div id="boxes-list" class="compact-list"></div>');
    const cierre=$('cierre-date-select');
    cierre.innerHTML='<option value="day">Día</option><option value="week">Semana</option><option value="month">Mes</option><option value="range">Rango de meses</option>';
    cierre.insertAdjacentHTML('afterend',`<label class="sr-only" for="period-date">Fecha del periodo</label><input type="date" id="period-date" value="${api.today()}"><label for="period-from" class="sr-only">Mes inicial</label><input type="month" id="period-from" value="${api.today().slice(0,7)}" hidden><label for="period-to" class="sr-only">Mes final</label><input type="month" id="period-to" value="${api.today().slice(0,7)}" hidden>`);
    document.querySelector('#tab-cierre .grid-3').insertAdjacentHTML('beforebegin','<p id="period-label" role="status"></p><div id="wallet-breakdown" class="wallet-breakdown"></div><p class="text-small text-muted">Sumas de avisos detectados; no representan saldos ni acreditación bancaria.</p>');
    $('source-test-feedback').textContent='Esta demo no comprueba permisos ni lectura Android. Solo administra fuentes ficticias.';
    function setPeriod() {
      const next={type:cierre.value,date:$('period-date').value,from:$('period-from').value,to:$('period-to').value};
      api.query(next,filters); period=next; activeDetail=null;
    }
    function safeRows() { try { return api.query(period,filters); } catch (_) { return []; } }
    function openDetail(id) { activeDetail=id; api.detail(id); render(); $('btn-close-detail').focus(); }
    function render() {
      const ctx=api.context(), admin=ctx.member?.role === 'admin', allowed=!!ctx.member;
      const user=ctx.users.find(u=>u.id===ctx.session.userId);
      $('demo-identity').innerHTML=ctx.users.map(u=>`<option value="${esc(u.id)}">${esc(u.name)}</option>`).join(''); $('demo-identity').value=ctx.session.userId;
      $('demo-business').innerHTML=ctx.businesses.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join(''); $('demo-business').value=ctx.session.businessId;
      $('sim-active-business-name').textContent=ctx.business.name;
      document.querySelectorAll('.dynamic-biz-name').forEach(el=>el.textContent=ctx.business.name);
      $('demo-own-permissions').textContent=`${user.name} · ${allowed ? (admin ? 'Administración' : `Colaborador · ${scopeNames[ctx.member.scope]} · Alertas: ${scheduleText(ctx.member.schedule)}`) : 'Sin acceso vigente a este negocio'} · Cuenta de demostración`;
      if(ctx.persistenceError) notify(ctx.persistenceError,true);
      $('btn-toggle-personalization').disabled=!admin; $('demo-reset').disabled=!admin;
      $('form-config-negocio').querySelectorAll('input,button').forEach(el=>el.disabled=!admin);
      ['btn-simulate-incoming','demo-event-mode','btn-toggle-connection'].forEach(id=>$(id).disabled=!admin);
      document.querySelectorAll('.admin-only-tab').forEach(el=>{el.classList.toggle('hidden',!admin); el.tabIndex=admin?0:-1;});
      if(!admin && document.querySelector('.admin-only-tab.active')) activateTab('tab-avisos');
      const pill=$('sim-connection-pill'); pill.className=`connection-pill ${online()?'online':'offline'}`;
      pill.textContent=`Servicio local de demo · ${online()?'Disponible':'Sin conexión'} · Última actualización: ${instant(ctx.business.lastSyncAt)}`;
      $('banner-offline-alert').classList.toggle('hidden',online()); $('offline-last-time').textContent=instant(ctx.business.lastSyncAt);
      $('banner-offline-alert').querySelector('strong').textContent='Sin conexión · La lista de la demo puede estar atrasada';
      $('conn-status-text').textContent=offline?'Restaurar conexión simulada':'Simular caída de internet';
      $('btn-toggle-connection').setAttribute('aria-pressed',String(offline));
      $('btn-toggle-sound').setAttribute('aria-pressed',String(sound)); $('sound-status-text').textContent=`Alerta sonora: ${sound?'Activa':'Silenciada'}`;
      [...cierre.options].forEach(o=>o.disabled=!admin && (o.value==='range' || o.value==='week' && ctx.member?.scope==='today' || o.value==='month' && ctx.member?.scope!=='month'));
      cierre.value=period.type; $('period-date').value=period.date; $('avisos-day').value=period.date;
      $('period-date').hidden=period.type==='range'; $('period-from').hidden=$('period-to').hidden=period.type!=='range';
      let rows=[], report=null, accessError='';
      try { report=api.report(period,filters); rows=report.rows; } catch(e) { accessError=e.message; }
      const [start,end]=api.bounds(period);
      $('period-label').textContent=`Periodo: ${start} al ${end} · ${rows.length} avisos · Negocio: ${ctx.business.name}`;
      $('avisos-count-label').textContent=`${rows.length} avisos · ${start} al ${end} · Más recientes primero · Última actualización local: ${instant(ctx.business.lastSyncAt)}`;
      const empty=accessError || 'No se detectaron avisos con estos criterios. Esto no demuestra que no hubo pagos; revisa la billetera receptora o limpia los filtros.';
      $('avisos-list-container').innerHTML=rows.length ? rows.map(a=>`<article tabindex="0" role="button" aria-label="Ver detalle de ${esc(a.id)}" class="aviso-item ${a.read?'':'unread'}" data-aviso-id="${esc(a.id)}"><div><div class="aviso-amount">${fmt(a.amount)}</div><div class="aviso-meta">${esc(a.sender)} · ${a.payTime || `Recepción ${a.receiveTime}`}${a.delayed?` · Recibido ${a.receiveTime} con demora`:''} · ${a.date}</div><span class="status-badge ${a.verifiedInWallet?'verified':'positive'}">${a.verifiedInWallet?'Revisado manualmente en billetera':'Aviso detectado'}</span></div><div class="aviso-right"><span class="channel-pill">${channel(a.channel)}</span><span class="read-indicator">${a.read?'Visto':'Nuevo aviso'} · ${a.origin==='example'?'Ejemplo':'Simulado'}</span></div></article>`).join('') : `<p class="alert-box warning">${esc(empty)}</p>`;
      document.querySelectorAll('.aviso-item').forEach(el=>{ el.onclick=()=>run(()=>openDetail(el.dataset.avisoId)); el.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();run(()=>openDetail(el.dataset.avisoId));}}; });
      $('aviso-detail-drawer').classList.add('hidden');
      $('aviso-detail-content').replaceChildren();
      if(activeDetail && allowed) {
        const a=rows.find(a=>a.id===activeDetail);
        if(a) {
          $('aviso-detail-drawer').classList.remove('hidden');
          $('aviso-detail-content').innerHTML=`<div class="detail-grid"><div><strong>Código:</strong> ${esc(a.id)}</div><div><strong>Negocio:</strong> ${esc(ctx.business.name)}</div><div><strong>Importe:</strong> ${fmt(a.amount)}</div><div><strong>Nombre:</strong> ${esc(a.sender)}</div><div><strong>Hora del aviso:</strong> ${a.payTime || 'No disponible'}</div><div><strong>Recepción:</strong> ${instant(a.receivedAt)}</div><div><strong>Billetera:</strong> ${channel(a.channel)}</div><div><strong>Estado:</strong> Aviso detectado${a.verifiedInWallet?` · Revisión manual: ${esc(a.verifiedBy)}`:''}</div></div><p class="guideline-note">Abrir o leer este aviso no confirma el abono. Si hay dudas, consulta la billetera receptora.</p>${admin?'<button type="button" class="btn btn-primary" id="btn-mark-wallet-verified">Dejar constancia de mi revisión en la billetera</button>':''}`;
          if(admin) $('btn-mark-wallet-verified').onclick=()=>run(()=>api.verify(a.id));
        }
      }
      $('stat-total-avisos').textContent=fmt((report?.cents || 0)/100); $('stat-total-revisados').textContent=fmt((report?.reviewedCents || 0)/100);
      $('stat-count-avisos').textContent=`${rows.length} avisos · ${report?.known || 0} con monto legible`;
      $('cierre-table-body').innerHTML=rows.length?rows.map(a=>`<tr><td>${a.date} · ${a.payTime || a.receiveTime}</td><td>${esc(a.id)}</td><td>${fmt(a.amount)}</td><td>${esc(a.sender)}</td><td>${channel(a.channel)}</td><td>Aviso detectado</td><td>${esc(a.verifiedBy || a.note || 'Sin revisión manual')}</td></tr>`).join(''):`<tr><td colspan="7">${esc(empty)}</td></tr>`;
      $('wallet-breakdown').innerHTML=(report?.groups || []).map(g=>`<p><strong>${channel(g.channel)}</strong><br>${g.count} avisos · ${fmt(g.cents/100)} · ${g.count-g.known} sin monto</p>`).join('');
      $('btn-export-csv').disabled=!admin;
      const daily={type:'day',date:api.today()}; let todayRows=[]; try { todayRows=api.query(daily); } catch(_) {}
      $('sale-select-aviso').innerHTML=todayRows.map(a=>`<option value="${esc(a.id)}">${esc(a.id)} · ${fmt(a.amount)} · ${esc(a.sender)}${a.linkedSaleId?' · Asociado':''}</option>`).join('');
      const sales=allowed?api.sales():[];
      $('ventas-registered-list').innerHTML=sales.map(v=>`<div class="compact-item"><div><strong>${esc(v.id)} · Esperado ${fmt(v.expectedAmount)}</strong><p>${fmt(v.receivedAmount)} · ${esc(v.status)} · ${esc(v.note)}</p></div>${v.linkedAvisoId?`<button type="button" class="btn-text" data-unlink="${esc(v.id)}">Corregir vínculo</button>`:''}</div>`).join('');
      buttons('[data-unlink]',b=>api.unlinkSale(b.dataset.unlink));
      $('stat-total-pendientes').textContent=`${sales.filter(v=>v.status.includes('Pendiente')).length} pendientes de hoy`;
      $('requests-list-container').innerHTML=(allowed?api.requests():[]).filter(r=>r.status===reqFilter).map(r=>`<div class="compact-item"><div><strong>${fmt(r.amount)} · ${esc(r.saleRef)}</strong><p>${esc(r.sender)} · ${r.time}${r.status==='resolved'?` · ${esc(r.resolutionText)} por ${esc(r.responseBy)}`:''}</p></div>${admin && r.status==='pending'?`<button type="button" class="btn btn-secondary" data-resolve="${esc(r.id)}">Dejar constancia de revisión manual</button>`:''}</div>`).join('') || '<p>No hay consultas disponibles.</p>';
      buttons('[data-resolve]',b=>api.resolve(b.dataset.resolve));
      if(admin) renderAdmin(ctx);
      else { ['team-members-list','permissions-audit-log','invitations-list','boxes-list','active-devices-list'].forEach(id=>$(id).replaceChildren()); $('form-edit-member').classList.add('hidden'); $('demo-personalization').classList.add('hidden'); }
    }
    function renderAdmin(ctx) {
      const members=api.team();
      $('team-members-list').innerHTML=members.map(m=>`<div class="compact-item"><div><strong>${esc(m.name)} · ${m.role==='admin'?'Administración':'Colaborador'}</strong><span class="text-small block">${scopeNames[m.scope]} · ${scheduleText(m.schedule)}</span><span class="status-badge ${m.active?'positive':'warning'}">${m.active?'Vigente':'Revocado'}${m.role==='collab'?` · ${m.inShift?'En turno':'Fuera de turno de alertas'}`:''}</span></div>${m.active && m.role==='collab'?`<div><button type="button" class="btn-text" data-edit="${esc(m.id)}">Editar permisos y turno</button><button type="button" class="btn btn-danger" data-revoke="${esc(m.id)}">Retirar acceso</button></div>`:''}</div>`).join('');
      buttons('[data-revoke]',b=>{ const m=members.find(m=>m.id===b.dataset.revoke); ask(`¿Retirar el acceso a ${m.name}? Dejará de consultar este negocio y recibir alertas simuladas.`,()=>{api.revokeMember(m.id,true);activeDetail=null;}); });
      buttons('[data-edit]',b=>{const m=members.find(m=>m.id===b.dataset.edit); editing=m.id; $('form-edit-member').classList.remove('hidden'); $('edit-member-name').textContent=`Editar a ${m.name}`; $('edit-scope').value=m.scope; $('edit-start').value=m.schedule.start; $('edit-end').value=m.schedule.end; document.querySelectorAll('#edit-days input').forEach(i=>i.checked=m.schedule.days.includes(Number(i.value))); $('edit-scope').focus();});
      $('permissions-audit-log').innerHTML=api.activity().slice(0,12).map(e=>`<p class="text-small">${esc(e.action)} · ${instant(e.at)}</p>`).join('') || '<p>Sin cambios registrados en este negocio.</p>';
      $('invitations-list').innerHTML=api.invitations().map(i=>`<p class="text-small">${esc(i.name)} · ${esc(i.code)} · ${i.usedAt?'Utilizado':i.revokedAt?'Revocado':i.expiresAt<=api.now()?'Vencido':`Válido hasta ${instant(i.expiresAt)}`}${!i.usedAt && !i.revokedAt?` <button type="button" class="btn-text" data-cancel-invite="${esc(i.id)}">Revocar código</button>`:''}</p>`).join('');
      buttons('[data-cancel-invite]',b=>api.revokeInvite(b.dataset.cancelInvite));
      ['Yape','Plin'].forEach(c=>{ const s=ctx.business.sources[c]; $('source-'+c.toLowerCase()+'-meta').textContent=`Fuente ficticia ${s.active?'activa':'desactivada'} · Historial conservado`; document.querySelector(`[data-source="${c}"]`).textContent=s.active?'Desactivar fuente':'Activar fuente'; });
      $('active-devices-list').textContent='Servicio local de demostración. Sin sesiones Android ni dispositivos reales conectados.';
      const boxes=api.boxes(); $('box-connection-title').textContent=boxes.length?`${boxes.length} Box virtual vinculado`:'Sin Box vinculado'; $('box-connection-sub').textContent='Última comunicación, envíos y confirmaciones del simulador; no son telemetría física.';
      $('boxes-list').innerHTML=boxes.map(b=>`<div class="compact-item"><div><strong>${esc(b.id)} · ${b.status}</strong><p>Última comunicación: ${instant(b.lastSeenAt)}<br>${b.sent} avisos enviados hoy · ${b.acknowledged} recepciones confirmadas virtualmente · ${b.pending} pendientes</p></div><div><button type="button" class="btn btn-secondary" data-box-connect="${esc(b.id)}">${b.online?'Simular desconexión':'Simular comunicación'}</button><button type="button" class="btn-text" data-box-ack="${esc(b.id)}">Simular confirmación de recepción</button></div></div>`).join('');
      buttons('[data-box-connect]',b=>{const box=boxes.find(x=>x.id===b.dataset.boxConnect);api.boxCommunication(box.id,!box.online);});
      buttons('[data-box-ack]',b=>api.boxAcknowledge(b.dataset.boxAck));
    }
    function activateTab(id) {
      const ctx=api.context(); if(['tab-equipo','tab-dispositivos'].includes(id) && ctx.member?.role!=='admin') throw new Error('Vista de administración no autorizada.');
      document.querySelectorAll('.sim-tab').forEach((b,i)=>{const active=b.dataset.tab===id; b.id=`sim-tab-${i}`;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.setAttribute('aria-controls',b.dataset.tab);$(b.dataset.tab).setAttribute('aria-labelledby',b.id);});
      document.querySelectorAll('.sim-panel').forEach(p=>p.classList.toggle('active',p.id===id));
    }
    document.querySelectorAll('.sim-tab').forEach(b=>{
      b.addEventListener('click',()=>run(()=>activateTab(b.dataset.tab)));
      b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;e.preventDefault();const tabs=[...document.querySelectorAll('.sim-tab:not(.hidden)')],i=tabs.indexOf(b),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();tabs[next].focus();});
    });
    on('demo-identity','change',()=>{api.selectIdentity($('demo-identity').value); period={type:'day',date:api.today()}; activeDetail=null;previewCode=null;$('join-preview').classList.add('hidden');$('generated-code-banner').classList.add('hidden');$('box-code-screen').textContent='';$('box-action-feedback').classList.add('hidden');$('venta-comparison-result').classList.add('hidden');activateTab('tab-avisos');});
    on('demo-business','change',()=>{api.selectBusiness($('demo-business').value);period={type:'day',date:api.today()};activeDetail=null;editing=null;$('form-edit-member').classList.add('hidden');$('generated-code-banner').classList.add('hidden');$('box-action-feedback').classList.add('hidden');$('venta-comparison-result').classList.add('hidden');activateTab('tab-avisos');});
    on('btn-toggle-personalization','click',()=>{const open=$('demo-personalization').classList.contains('hidden');if(api.context().member?.role!=='admin') throw new Error('Solo administración.');$('demo-personalization').classList.toggle('hidden',!open);$('btn-toggle-personalization').setAttribute('aria-expanded',String(open));const c=api.context();$('input-business-name').value=c.business.name;$('input-owner-name').value=c.business.ownerName;['Yape','Plin'].forEach(s=>$('chk-init-'+s.toLowerCase()).checked=c.business.sources[s].active);});
    on('form-config-negocio','submit',()=>{api.updateBusiness($('input-business-name').value,$('input-owner-name').value);['Yape','Plin'].forEach(s=>api.source(s,$('chk-init-'+s.toLowerCase()).checked));notify('Perfil guardado en la cuenta ficticia de administración.');});
    on('demo-create-business','click',()=>{api.createBusiness($('input-business-name').value,$('input-owner-name').value);period={type:'day',date:api.today()};notify('Negocio de ejemplo creado con identificador propio y cuenta administradora asociada.');});
    on('demo-reset','click',()=>ask('¿Restablecer todos los datos de ejemplo de este navegador?',()=>{api.reset();location.reload();}));
    on('btn-toggle-connection','click',()=>{if(api.context().member?.role!=='admin')throw new Error('Solo administración.');offline=!offline;});
    on('btn-toggle-sound','click',()=>sound=!sound);
    const beep=()=>{if(!sound)return;try {const c=new (window.AudioContext || window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);g.gain.value=.08;o.start();o.stop(c.currentTime+.15);o.onended=()=>c.close();}catch(_) {}};
    on('btn-simulate-incoming','click',()=>{const result=api.simulate($('demo-event-mode').value,online());notify(result.queued?'Aviso ficticio en cola local. Al recuperar la conexión, pulsa Actualizar lista.':`${result.added} avisos nuevos procesados; ${result.processed} eventos recibidos en el servicio local.`);if(result.added && api.context().member)beep();});
    on('btn-refresh-avisos','click',()=>{const r=api.refresh(online());notify(`Actualización local realizada: ${r.processed} eventos procesados, ${r.added} avisos nuevos. No consulta Android ni billeteras.`);});
    window.addEventListener('offline',()=>{notify('El navegador perdió conexión. Se conserva la última hora válida.',true);render();});window.addEventListener('online',()=>{notify('Red del navegador disponible. Actualiza la lista para procesar la cola local.');render();});
    window.addEventListener('storage',e=>{if(e.key===window.TarkiPayCore.KEY){api.reload();activeDetail=null;render();}});
    on('form-filter-avisos','submit',()=>{const raw=$('filter-amount').value;const amount=raw===''?null:Number(raw);api.query(period,{...filters,amount}); filters.amount=amount;});
    buttons('[data-quick-amount]',b=>{$('filter-amount').value=b.dataset.quickAmount;$('form-filter-avisos').requestSubmit();});
    on('filter-sender','input',()=>filters.sender=$('filter-sender').value);
    buttons('[data-channel]',b=>{filters.channel=b.dataset.channel;document.querySelectorAll('[data-channel]').forEach(x=>x.classList.toggle('active',x===b));});
    ['start','end'].forEach(k=>on('filter-time-'+k,'change',()=>{const next={...filters,[k]:$('filter-time-'+k).value};api.query(period,next);filters=next;}));
    on('btn-clear-all-filters','click',()=>{filters={amount:null,sender:'',channel:'all',start:'',end:''};['filter-amount','filter-sender','filter-time-start','filter-time-end'].forEach(id=>$(id).value='');document.querySelectorAll('[data-channel]').forEach(b=>b.classList.toggle('active',b.dataset.channel==='all'));});
    on('avisos-day','change',()=>{const next={type:'day',date:$('avisos-day').value};api.query(next,filters);period=next;activeDetail=null;});
    ['cierre-date-select','period-date','period-from','period-to'].forEach(id=>on(id,'change',setPeriod));
    on('btn-close-detail','click',()=>{const id=activeDetail;activeDetail=null;render();[...document.querySelectorAll('.aviso-item')].find(el=>el.dataset.avisoId===id)?.focus();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && activeDetail)$('btn-close-detail').click();});
    on('form-invite-member','submit',()=>{const i=api.invite($('invite-name').value,$('invite-history-scope').value,getSchedule('invite'));$('generated-code-value').textContent=i.code;$('generated-code-details').textContent=`${api.context().business.name} · ${i.name} · ${scopeNames[i.scope]} · ${scheduleText(i.schedule)} · Vence ${instant(i.expiresAt)}. Generarlo aún no concede acceso.`;$('generated-code-banner').classList.remove('hidden');});
    on('form-edit-member','submit',()=>{api.editMember(editing,$('edit-scope').value,getSchedule('edit'));editing=null;$('form-edit-member').classList.add('hidden');notify('Permisos y turno guardados; el historial se conserva.');});
    on('edit-cancel','click',()=>{editing=null;$('form-edit-member').classList.add('hidden');});
    on('form-join','submit',()=>{previewCode=null;$('join-preview').classList.add('hidden');const i=api.previewInvitation($('join-code').value);previewCode=i.code;$('join-preview-text').textContent=`${i.businessName} · Colaborador · ${scopeNames[i.scope]} · ${scheduleText(i.schedule)} · Vence ${instant(i.expiresAt)}. Sin administración, transferencias ni claves bancarias.`;$('join-preview').classList.remove('hidden');});
    on('join-confirm','click',()=>{if(!previewCode)throw new Error('Primero revisa una invitación.');api.join(previewCode);previewCode=null;$('join-preview').classList.add('hidden');period={type:'day',date:api.today()};notify('Acceso de colaborador creado para esta cuenta ficticia.');});
    on('join-cancel','click',()=>{previewCode=null;$('join-preview').classList.add('hidden');});
    buttons('[data-source]',b=>{const c=api.context();api.source(b.dataset.source,!c.business.sources[b.dataset.source].active);});
    on('btn-test-source-config','click',()=>{$('source-test-feedback').classList.remove('hidden');});
    on('box-new-code','click',()=>{const c=api.newBoxCode();$('box-code-screen').textContent=`Pantalla del Box virtual: ${c.code} · Vence ${instant(c.expiresAt)}`;});
    on('form-pair-box','submit',()=>{const code=$('box-pair-code').value,p=api.pairBox(code,false);ask(`¿Vincular el Box virtual ${p.boxId} al negocio ${p.businessName}?`,()=>{api.pairBox(code,true);$('box-action-feedback').textContent='Box virtual vinculado. Pendiente de comunicación simulada; no acredita un equipo físico.';$('box-action-feedback').classList.remove('hidden');});});
    on('btn-test-box-sound','click',()=>{if(api.context().member?.role!=='admin')throw new Error('Solo administración.');beep();notify('Prueba de sonido del navegador. No se envió a un dispositivo físico.');});
    on('btn-export-csv','click',()=>{const csv=api.csv(period,filters),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='TarkiPay_avisos.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    on('form-vincular-venta','submit',()=>{const v=api.sale(Number($('sale-expected-amount').value),$('sale-select-aviso').value,$('sale-incident-note').value);$('venta-comparison-result').classList.remove('hidden');$('venta-comparison-result').textContent=`${v.status}. Comparación de importes; no confirma un abono.`;});
    on('btn-mark-sale-pending','click',()=>api.sale(Number($('sale-expected-amount').value),null,$('sale-incident-note').value));
    on('form-request-review','submit',()=>api.request(Number($('req-amount').value),$('req-sale-ref').value));
    buttons('[data-req-filter]',b=>{reqFilter=b.dataset.reqFilter;document.querySelectorAll('[data-req-filter]').forEach(x=>x.classList.toggle('active',x===b));});
    // Read-only snapshots and guarded actions help reproduce acceptance tests; they are not authentication.
    window.TarkiPayDemo=Object.freeze({api,render});
    activateTab('tab-avisos'); render();
    setInterval(()=>{if(document.visibilityState==='visible')render();},30000);
    return { render };
  };
})();
