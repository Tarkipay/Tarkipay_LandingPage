/* Views share the permission-checked demo service. DOM state never grants a role. */
(function () {
  'use strict';
  window.initTarkiPayDemo = async function (seed) {
    let storage=null; try { storage=window.localStorage; } catch (_) {}
    const api = window.TarkiPayCore.create(seed, { storage });
    await api.ready;
    const $ = id => document.getElementById(id);
    const esc = x => String(x ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fmt = n => n === null ? 'Monto no disponible' : `S/ ${n.toFixed(2)}`;
    const instant = n => n ? new Date(n).toLocaleString('es-PE',{timeZone:'America/Lima'}) : 'Sin actualización realizada';
    const displayDay = iso => new Date(`${iso}T12:00:00-05:00`).toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric',timeZone:'America/Lima'});
    const channel = c => c === 'No disponible' ? 'Billetera no identificada' : c;
    const scopeNames = { today:'Solo hoy', week:'Hoy y esta semana', month:'Hoy, semana y mes', all:'Todos los periodos' };
    let period = {type:'day',date:api.today()}, filters={amount:null,sender:'',channel:'all',start:'',end:''}, offline=false, sound=true, activeDetail=null, previewCode=null, reqFilter='pending', editing=null, profileRevision=0, editingRevision=0;
    const online = () => !offline && navigator.onLine;
    const notify = (message, error=false) => { $('demo-feedback').textContent=message; $('demo-feedback').className=`alert-box ${error ? 'error' : 'success'}`; };
    const pendingActions = new Set();
    const run = fn => {
      const task = (async () => { try { const result=await fn(); await render(); return result; } catch(e) { notify(e.message,true); await render(); return null; } })();
      pendingActions.add(task); task.finally(() => pendingActions.delete(task)); return task;
    };
    const whenIdle = async () => { while(pendingActions.size) await Promise.all([...pendingActions]); };
    const on = (id,event,fn) => { if ($(id)) $(id).addEventListener(event,e => { if(event==='submit') e.preventDefault(); run(()=>fn(e)); }); };
    const buttons = (selector,fn) => document.querySelectorAll(selector).forEach(el=>el.addEventListener('click',()=>run(()=>fn(el))));
    document.querySelector('#demo').insertAdjacentHTML('beforeend','<dialog id="demo-confirm-dialog" aria-labelledby="demo-confirm-message"><p id="demo-confirm-message"></p><div class="button-row-2"><button type="button" class="btn btn-secondary" id="demo-confirm-cancel">Cancelar</button><button type="button" class="btn btn-primary" id="demo-confirm-accept">Confirmar</button></div></dialog>');
    const ask=(message,action)=>{const d=$('demo-confirm-dialog');$('demo-confirm-message').textContent=message;$('demo-confirm-accept').onclick=async()=>{d.close();run(action);};$('demo-confirm-cancel').onclick=()=>d.close();d.showModal();$('demo-confirm-cancel').focus();};
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
    $('filter-sender').parentElement.insertAdjacentHTML('afterend',`<div class="form-group"><label for="avisos-day">Día visible</label><input type="date" id="avisos-day" value="${api.today()}"></div><div class="form-row-2"><div class="form-group"><label for="filter-time-start">Hora inicial</label><input type="time" id="filter-time-start"></div><div class="form-group"><label for="filter-time-end">Hora final</label><input type="time" id="filter-time-end"></div></div><p class="text-small text-muted">Si falta la hora del aviso, se usa la de recepción. Los filtros también se aplican al resumen y CSV.</p>`);
    document.querySelector('#tab-avisos .panel-card:last-child h3').innerHTML='Avisos · <span class="dynamic-biz-name"></span>';
    $('invite-history-scope').innerHTML=scopes;
    $('invite-schedule').closest('.form-group').remove();
    $('form-invite-member').querySelector('button').insertAdjacentHTML('beforebegin',scheduleFields('invite'));
    $('generated-code-banner').insertAdjacentHTML('afterend','<div id="invitations-list" class="compact-list mt-16"></div>');
    $('team-members-list').insertAdjacentHTML('afterend',`<form id="form-edit-member" class="form-stack hidden mt-16"><h4 id="edit-member-name"></h4><div class="form-group"><label for="edit-scope">Historial autorizado</label><select id="edit-scope">${scopes}</select></div>${scheduleFields('edit')}<button type="submit" class="btn btn-primary">Guardar permisos y turno</button><button type="button" class="btn btn-secondary" id="edit-cancel">Cancelar</button></form>`);
    document.querySelector('.sim-top-controls').insertAdjacentHTML('beforeend',`<details class="demo-join"><summary>Unirme con un código de invitación</summary><p>Elige una identidad ficticia sin acceso. Revisa el negocio y los permisos antes de aceptar.</p><form id="form-join" class="form-stack"><label for="join-code">Código de invitación</label><input id="join-code" inputmode="numeric" autocomplete="off"><button type="submit" class="btn btn-secondary">Revisar invitación</button></form><div id="join-preview" class="hidden"><p id="join-preview-text"></p><button type="button" class="btn btn-primary" id="join-confirm">Aceptar y unirme</button><button type="button" class="btn btn-secondary" id="join-cancel">Cancelar</button></div></details><p id="demo-own-permissions" class="demo-own-permissions"></p>`);
    // Presentation only: move the existing controls without changing their handlers or IDs.
    const simulationTools=document.createElement('div');
    simulationTools.className='demo-simulation-tools';
    simulationTools.setAttribute('role','group');
    simulationTools.setAttribute('aria-label','Herramientas de simulación');
    simulationTools.innerHTML='<span class="demo-tool-label">Simulación</span>';
    document.querySelector('.sim-switches').append(simulationTools);
    simulationTools.append($('btn-toggle-sound'),$('btn-toggle-connection'),$('demo-event-mode'),$('btn-simulate-incoming'));
    document.querySelector('.sim-top-controls').append(simulationTools);
    const accessStrip=document.createElement('div');
    accessStrip.className='demo-access-strip';
    document.querySelector('.sim-top-controls').append(accessStrip);
    accessStrip.append($('demo-own-permissions'),document.querySelector('.demo-join'));
    document.querySelector('.sim-switches').append(accessStrip);
    const simulationPanel=document.createElement('details');
    simulationPanel.id='simulation-controls';simulationPanel.className='simulation-controls';
    simulationPanel.innerHTML=`<summary>Controles de simulación <span>Entorno virtual</span></summary><div class="simulation-body">
      <p class="text-small">Teléfono, servicio, broker y Box virtuales. Los cambios afectan datos y entregas de esta demo; no conectan equipos reales.</p>
      <div id="sim-admin-controls">
        <form id="sim-environment" class="simulation-grid">
          ${[['receiverPermission','Permiso Android virtual'],['receiverOnline','Receptor virtual'],['serverOnline','Servicio virtual'],['brokerOnline','Broker virtual']].map(([id,label])=>`<div class="form-group"><label for="sim-${id}">${label}</label><select id="sim-${id}"><option value="true">Disponible</option><option value="false">No disponible</option></select></div>`).join('')}
          <button class="btn btn-secondary" type="submit">Aplicar estados</button>
        </form>
        <form id="sim-notification" class="simulation-grid">
          <div class="form-group"><label for="sim-source">Fuente ficticia</label><select id="sim-source"><option>Yape</option><option>Plin</option></select></div>
          <div class="form-group"><label for="sim-kind">Notificación</label><select id="sim-kind"><option value="valid">Aviso compatible</option><option value="incomplete">Datos incompletos</option><option value="nonpayment">Contenido ajeno a pagos</option><option value="late">Aviso tardío</option><option value="duplicate">Reenviar el mismo evento</option></select></div>
          <button class="btn btn-primary" type="submit">Enviar al receptor virtual</button>
        </form>
        <form id="sim-clock-form" class="simulation-grid"><div class="form-group"><label for="sim-minutes">Avanzar reloj virtual</label><select id="sim-minutes"><option value="1">1 minuto</option><option value="2">2 minutos</option><option value="15">15 minutos</option><option value="60">1 hora</option><option value="1440">1 día</option></select></div><button class="btn btn-secondary" type="submit">Avanzar</button><button class="btn btn-secondary" type="button" id="sim-retry-broker">Reintentar distribución virtual</button><button class="btn btn-secondary" type="button" id="sim-revoke-box-code">Revocar último código Box disponible</button></form>
      </div>
      <p id="sim-clock" class="text-small"></p><p id="sim-sync-status" role="status" class="text-small"></p>
      <div id="sim-events" class="text-small" aria-live="polite"></div>
      <div id="sim-deliveries" class="text-small" aria-live="polite"></div>
      <div class="simulation-session"><button id="sim-ack-app" type="button" class="btn btn-secondary">Confirmar recepción virtual de mi sesión</button><button id="sim-end-session" type="button" class="btn btn-secondary">Dejar sesión sin seleccionar</button></div>
    </div>`;
    document.querySelector('.sim-top-controls').append(simulationPanel);
    simulationPanel.querySelector('.simulation-body').prepend(simulationTools);
    simulationPanel.querySelector('.simulation-session').append($('demo-reset'));
    document.querySelector('label[for="demo-identity"]').textContent='Cambiar identidad ficticia';
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
    async function openDetail(id) { activeDetail=id; await api.detail(id); await render(); $('btn-close-detail').focus(); }
    async function render() {
      await api.reload();
      const ctx=api.context(), admin=ctx.member?.role === 'admin', allowed=!!ctx.member;
      const user=ctx.users.find(u=>u.id===ctx.session.userId);
      $('demo-identity').innerHTML='<option value="">Sin sesión seleccionada</option>'+ctx.users.map(u=>`<option value="${esc(u.id)}">${esc(u.name)}</option>`).join(''); $('demo-identity').value=ctx.session.userId || '';
      $('demo-business').innerHTML=ctx.businesses.map(b=>`<option value="${esc(b.id)}">${esc(b.name)}</option>`).join(''); $('demo-business').value=ctx.session.businessId;
      $('sim-active-business-name').textContent=ctx.business.name;
      document.querySelectorAll('.dynamic-biz-name').forEach(el=>el.textContent=ctx.business.name);
      $('demo-own-permissions').textContent=`${user?.name || 'Sin sesión seleccionada'} · ${allowed ? (admin ? 'Administración' : `Colaborador · ${scopeNames[ctx.member.scope]} · Alertas: ${scheduleText(ctx.member.schedule)}`) : 'Sin acceso vigente a este negocio'} · Cuenta de demostración`;
      if(ctx.persistenceError) notify(ctx.persistenceError,true);
      $('btn-toggle-personalization').disabled=!admin; $('demo-reset').disabled=!admin;
      $('form-config-negocio').querySelectorAll('input,button').forEach(el=>el.disabled=!admin);
      ['btn-simulate-incoming','demo-event-mode','btn-toggle-connection'].forEach(id=>$(id).disabled=!admin);
      document.querySelectorAll('.admin-only-tab').forEach(el=>{el.classList.toggle('hidden',!admin); el.tabIndex=admin?0:-1;});
      if(!admin && document.querySelector('.admin-only-tab.active')) activateTab('tab-avisos');
      const pill=$('sim-connection-pill'); const serviceAvailable=online() && ctx.business.simulation?.serverOnline!==false; pill.className=`connection-pill ${serviceAvailable?'online':'offline'}`;
      pill.textContent=`Servicio local de demo · ${serviceAvailable?'Disponible':'Sin conexión'} · Última actualización: ${instant(ctx.business.lastSyncAt)}`;
      $('banner-offline-alert').classList.toggle('hidden',serviceAvailable && !ctx.business.lastSyncError && ctx.business.simulation?.receiverOnline!==false); $('offline-last-time').textContent=instant(ctx.business.lastSyncAt);
      $('banner-offline-alert').querySelector('strong').textContent='Sin conexión · La lista de la demo puede estar atrasada';
      $('conn-status-text').textContent=offline?'Restaurar conexión':'Simular caída';
      $('btn-toggle-connection').setAttribute('aria-pressed',String(offline));
      $('btn-toggle-sound').setAttribute('aria-pressed',String(sound)); $('sound-status-text').textContent=`Sonido: ${sound?'activo':'silenciado'}`;
      [...cierre.options].forEach(o=>o.disabled=!admin && (o.value==='range' || o.value==='week' && ctx.member?.scope==='today' || o.value==='month' && ctx.member?.scope!=='month'));
      cierre.value=period.type; $('period-date').value=period.date; $('avisos-day').value=period.date;
      $('period-date').hidden=period.type==='range'; $('period-from').hidden=$('period-to').hidden=period.type!=='range';
      let rows=[], report=null, accessError='';
      try { report=api.report(period,filters); rows=report.rows; } catch(e) { accessError=e.message; }
      const [start,end]=api.bounds(period);
      $('period-label').textContent=`Periodo: ${displayDay(start)} al ${displayDay(end)} · ${rows.length} avisos · Negocio: ${ctx.business.name}`;
      $('avisos-count-label').textContent=`${rows.length} avisos · ${displayDay(start)}${start===end ? '' : ` al ${displayDay(end)}`} · Más recientes primero`;
      const empty=accessError || 'No se detectaron avisos con estos criterios. Esto no demuestra que no hubo pagos; revisa la billetera receptora o limpia los filtros.';
      $('avisos-list-container').innerHTML=rows.length ? rows.map(a=>`<article tabindex="0" role="button" aria-label="Ver detalle de ${esc(a.id)}" aria-pressed="${activeDetail===a.id}" class="aviso-item ${activeDetail===a.id?'selected':''} ${a.read?'':'unread'}" data-aviso-id="${esc(a.id)}"><span class="wallet-monogram" aria-hidden="true">${a.channel==='Yape'?'Y':a.channel==='Plin'?'P':'?'}</span><div><div class="aviso-amount">${fmt(a.amount)}</div><div class="aviso-sender">${esc(a.sender)}</div><div class="aviso-meta">${a.payTime || `Recepción ${a.receiveTime}`}${a.delayed?` · Recibido ${a.receiveTime} con demora`:''} · ${displayDay(a.date)}</div><span class="status-badge ${a.verifiedInWallet?'verified':a.amount===null?'warning':'positive'}">${a.verifiedInWallet?'Revisado en billetera':a.amount===null?'Datos incompletos':'Aviso detectado'}</span></div><div class="aviso-right"><span class="channel-pill">${channel(a.channel)}</span><span class="read-indicator">${a.read?'Visto':'Nuevo aviso'} · ${a.origin==='example'?'Ejemplo':'Simulado'}</span></div></article>`).join('') : `<p class="alert-box warning">${esc(empty)}</p>`;
      document.querySelectorAll('.aviso-item').forEach(el=>{ el.onclick=()=>run(()=>openDetail(el.dataset.avisoId)); el.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();run(()=>openDetail(el.dataset.avisoId));}}; });
      $('aviso-detail-drawer').classList.add('hidden');
      $('aviso-detail-content').replaceChildren();
      if(activeDetail && allowed) {
        const a=rows.find(a=>a.id===activeDetail);
        if(a) {
          $('aviso-detail-drawer').classList.remove('hidden');
          $('aviso-detail-content').innerHTML=`<div class="detail-principal"><span class="status-badge ${a.verifiedInWallet?'verified':a.amount===null?'warning':'positive'}">${a.verifiedInWallet?'Revisado en billetera':a.amount===null?'Datos incompletos':'Aviso detectado'}</span><strong>${fmt(a.amount)}</strong><p>${esc(a.sender)}</p></div><div class="detail-grid"><div><strong>Código:</strong> <span class="full-event-code">${esc(a.id)}</span></div><div><strong>Negocio:</strong> ${esc(ctx.business.name)}</div><div><strong>Importe:</strong> ${fmt(a.amount)}</div><div><strong>Nombre:</strong> ${esc(a.sender)}</div><div><strong>Hora del aviso:</strong> ${a.payTime || 'No disponible'}</div><div><strong>Recepción:</strong> ${instant(a.receivedAt)}</div><div><strong>Billetera:</strong> ${channel(a.channel)}</div><div><strong>Estado:</strong> Aviso detectado${a.verifiedInWallet?` · Revisión manual: ${esc(a.verifiedBy)}`:''}</div></div><p class="guideline-note">Abrir o leer este aviso no confirma el abono. Si hay dudas, consulta la billetera receptora.</p>${admin?'<button type="button" class="btn btn-primary" id="btn-mark-wallet-verified">Dejar constancia de mi revisión en la billetera</button>':''}`;
          if(admin) $('btn-mark-wallet-verified').onclick=()=>run(async()=>await api.verify(a.id));
        }
      }
      $('stat-total-avisos').textContent=fmt((report?.cents || 0)/100); $('stat-total-revisados').textContent=fmt((report?.reviewedCents || 0)/100);
      $('stat-count-avisos').textContent=`${rows.length} avisos · ${report?.known || 0} con monto legible`;
      $('cierre-table-body').innerHTML=rows.length?rows.map(a=>`<tr><td><time datetime="${a.date}">${displayDay(a.date)}</time><span class="table-time">${a.payTime || a.receiveTime}</span></td><td class="event-code"><details><summary title="${esc(a.id)}">${esc(a.id.length>18 ? a.id.slice(0,14)+'…' : a.id)}</summary><span>${esc(a.id)}</span></details></td><td>${fmt(a.amount)}</td><td>${esc(a.sender)}</td><td>${channel(a.channel)}</td><td><span class="status-badge ${a.verifiedInWallet?'verified':a.amount===null?'warning':'positive'}">${a.verifiedInWallet?'Revisado en billetera':a.amount===null?'Datos incompletos':'Aviso detectado'}</span></td><td>${esc(a.verifiedBy || a.note || 'Sin revisión manual')}</td></tr>`).join(''):`<tr><td colspan="7">${esc(empty)}</td></tr>`;
      $('wallet-breakdown').innerHTML=(report?.groups || []).map(g=>`<p><strong>${channel(g.channel)}</strong><br>${g.count} avisos · ${fmt(g.cents/100)} · ${g.count-g.known} sin monto</p>`).join('');
      $('btn-export-csv').disabled=!admin;
      const daily={type:'day',date:api.today()}; let todayRows=[]; try { todayRows=api.query(daily); } catch(_) {}
      $('sale-select-aviso').innerHTML=todayRows.map(a=>`<option value="${esc(a.id)}">${esc(a.id)} · ${fmt(a.amount)} · ${esc(a.sender)}${a.linkedSaleId?' · Asociado':''}</option>`).join('');
      const sales=allowed?api.sales():[];
      $('ventas-registered-list').innerHTML=sales.map(v=>`<div class="compact-item sale-row"><div><strong>${esc(v.id)} · Esperado ${fmt(v.expectedAmount)}</strong><p>${fmt(v.receivedAmount)} · ${esc(v.status)} · ${esc(v.note)}</p></div>${v.linkedAvisoId?`<button type="button" class="btn-text" data-unlink="${esc(v.id)}">Corregir vínculo</button>`:''}</div>`).join('');
      buttons('[data-unlink]',async b=>await api.unlinkSale(b.dataset.unlink));
      $('stat-total-pendientes').textContent=`${sales.filter(v=>v.status.includes('Pendiente')).length}`;
      $('requests-list-container').innerHTML=(allowed?api.requests():[]).filter(r=>r.status===reqFilter).map(r=>`<div class="compact-item request-row"><div><span class="status-badge ${r.status==='pending'?'warning':'verified'}">${r.status==='pending'?'Pendiente de respuesta':'Respondida'}</span><strong>${fmt(r.amount)} · ${esc(r.saleRef)}</strong><p>${esc(r.sender)} · ${r.time}${r.status==='resolved'?` · ${esc(r.resolutionText)} por ${esc(r.responseBy)}`:''}</p></div>${admin && r.status==='pending'?`<button type="button" class="btn btn-secondary" data-resolve="${esc(r.id)}">Dejar constancia de revisión manual</button>`:''}</div>`).join('') || '<p>No hay consultas disponibles.</p>';
      buttons('[data-resolve]',async b=>await api.resolve(b.dataset.resolve));
      $('sim-admin-controls').classList.toggle('hidden',!admin);
      $('sim-ack-app').disabled=!allowed;$('sim-end-session').disabled=!ctx.session.userId;
      $('sim-clock').textContent=`Reloj virtual: ${instant(api.now())} · America/Lima`;
      if(allowed){const eco=api.ecosystem();
        for(const key of ['receiverPermission','receiverOnline','serverOnline','brokerOnline'])$('sim-'+key).value=String(eco.state[key]);
        $('sim-sync-status').textContent=`Último intento: ${instant(eco.lastAttemptAt)} · Última sincronización exitosa: ${instant(eco.lastSyncAt)}${eco.lastSyncError?' · '+eco.lastSyncError:''}`;
        $('sim-events').innerHTML=eco.notifications.slice(-4).map(e=>`<p><strong>${esc(e.packet.source)}</strong> · ${esc(e.status==='stored'?'Guardado por el servicio virtual':e.status==='rejected'?'Rechazado':e.status==='ignored'?'Ignorado':e.status==='receiver-pending'?'Pendiente en el receptor':'Pendiente en el servicio')} · ${esc(e.reason||e.packet.body)} · ${e.retries || 0} reenvíos</p>`).join('');
        const deliveries=eco.deliveries;
        $('sim-deliveries').textContent=`Entregas autorizadas del negocio: ${deliveries.filter(d=>d.status==='pending').length} pendientes · ${deliveries.filter(d=>['simulated','sent','acknowledged'].includes(d.status)).length} aceptadas virtualmente · ${deliveries.filter(d=>d.ackAt).length} confirmadas virtualmente. No confirman abonos.`;
      }else{ $('sim-sync-status').textContent='Selecciona una identidad ficticia autorizada para consultar el estado del negocio.';$('sim-events').replaceChildren();$('sim-deliveries').replaceChildren();}
      if(admin) renderAdmin(ctx);
      else { ['team-members-list','permissions-audit-log','invitations-list','boxes-list','active-devices-list'].forEach(id=>$(id).replaceChildren()); $('form-edit-member').classList.add('hidden'); $('demo-personalization').classList.add('hidden'); }
    }
    function renderAdmin(ctx) {
      const members=api.team();
      $('team-members-list').innerHTML=members.map(m=>`<div class="compact-item member-row"><span class="member-avatar" aria-hidden="true">${esc(m.name.split(/\s+/).map(w=>w[0]).slice(0,2).join(''))}</span><div><strong>${esc(m.name)} · ${m.role==='admin'?'Administración':'Colaborador'}</strong><span class="text-small block">${scopeNames[m.scope]} · ${scheduleText(m.schedule)}</span><span class="status-badge ${m.active?'positive':'warning'}">${m.active?'Vigente':'Revocado'}${m.role==='collab'?` · ${m.inShift?'En turno':'Fuera de turno de alertas'}`:''}</span></div>${m.active && m.role==='collab'?`<div><button type="button" class="btn-text" data-edit="${esc(m.id)}">Editar permisos y turno</button><button type="button" class="btn btn-danger" data-revoke="${esc(m.id)}">Retirar acceso</button></div>`:''}</div>`).join('');
      buttons('[data-revoke]',async b=>{ const m=members.find(m=>m.id===b.dataset.revoke); ask(`¿Retirar el acceso a ${m.name}? Dejará de consultar este negocio y recibir alertas simuladas.`,async()=>{await api.revokeMember(m.id,true);activeDetail=null;}); });
      buttons('[data-edit]',async b=>{const m=members.find(m=>m.id===b.dataset.edit); editing=m.id;editingRevision=m.revision || 0; $('form-edit-member').classList.remove('hidden'); $('edit-member-name').textContent=`Editar a ${m.name}`; $('edit-scope').value=m.scope; $('edit-start').value=m.schedule.start; $('edit-end').value=m.schedule.end; document.querySelectorAll('#edit-days input').forEach(i=>i.checked=m.schedule.days.includes(Number(i.value))); $('edit-scope').focus();});
      $('permissions-audit-log').innerHTML=api.activity().slice(0,12).map(e=>`<p class="text-small">${esc(e.action)} · ${instant(e.at)}</p>`).join('') || '<p>Sin cambios registrados en este negocio.</p>';
      $('invitations-list').innerHTML=api.invitations().map(i=>`<p class="text-small">${esc(i.name)} · ${esc(i.code)} · ${i.usedAt?'Utilizado':i.revokedAt?'Revocado':i.expiresAt<=api.now()?'Vencido':`Válido hasta ${instant(i.expiresAt)}`}${!i.usedAt && !i.revokedAt?` <button type="button" class="btn-text" data-cancel-invite="${esc(i.id)}">Revocar código</button>`:''}</p>`).join('');
      buttons('[data-cancel-invite]',async b=>await api.revokeInvite(b.dataset.cancelInvite));
      ['Yape','Plin'].forEach(c=>{ const s=ctx.business.sources[c]; $('source-'+c.toLowerCase()+'-meta').textContent=`Fuente ficticia ${s.active?'activa':'desactivada'} · Historial conservado`; document.querySelector(`[data-source="${c}"]`).textContent=s.active?'Desactivar fuente':'Activar fuente'; });
      $('active-devices-list').textContent='Servicio local de demostración. Sin sesiones Android ni dispositivos reales conectados.';
      const boxes=api.boxes(); $('box-connection-title').textContent=boxes.length?`${boxes.length} Box virtual vinculado`:'Sin Box vinculado'; $('box-connection-sub').textContent='Última comunicación, envíos y confirmaciones del simulador; no son telemetría física.';
      $('boxes-list').innerHTML=boxes.map(b=>`<div class="compact-item box-row"><div><strong>${b.status}</strong><span class="box-id">${esc(b.id)}</span><p>Última comunicación: ${instant(b.lastSeenAt)}</p>${b.lastReceived?`<p class="box-virtual-screen"><strong>Pantalla del Box virtual</strong><br>${fmt(b.lastReceived.amount)} · ${esc(b.lastReceived.sender)} · ${channel(b.lastReceived.channel)}<br>Recepción simulada confirmada: ${instant(b.lastReceived.confirmedAt)}. No confirma un abono.</p>`:''}<dl class="box-metrics"><div><dt>Pendientes</dt><dd>${b.pending}</dd></div><div><dt>Aceptados por el canal virtual hoy</dt><dd>${b.sent}</dd></div><div><dt>Recepciones confirmadas virtualmente</dt><dd>${b.acknowledged}</dd></div><div><dt>Intentos de envío</dt><dd>${b.attempts || 0}</dd></div></dl></div><div><button type="button" class="btn btn-secondary" data-box-connect="${esc(b.id)}">${b.status==='Conectado virtual'?'Simular desconexión':'Simular comunicación'}</button><button type="button" class="btn-text" data-box-ack="${esc(b.id)}">Simular confirmación de recepción</button></div></div>`).join('');
      buttons('[data-box-connect]',async b=>{const box=boxes.find(x=>x.id===b.dataset.boxConnect);await api.boxCommunication(box.id,box.status!=='Conectado virtual');});
      buttons('[data-box-ack]',async b=>{const before=api.boxes().find(x=>x.id===b.dataset.boxAck)?.acknowledged || 0;await api.boxAcknowledge(b.dataset.boxAck);if((api.boxes().find(x=>x.id===b.dataset.boxAck)?.acknowledged || 0)>before)beep();});
    }
    function activateTab(id) {
      const ctx=api.context(); if(['tab-equipo','tab-dispositivos'].includes(id) && ctx.member?.role!=='admin') throw new Error('Vista de administración no autorizada.');
      document.querySelectorAll('.sim-tab').forEach((b,i)=>{const active=b.dataset.tab===id; b.id=`sim-tab-${i}`;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.setAttribute('aria-controls',b.dataset.tab);$(b.dataset.tab).setAttribute('aria-labelledby',b.id);});
      document.querySelectorAll('.sim-panel').forEach(p=>p.classList.toggle('active',p.id===id));
    }
    document.querySelectorAll('.sim-tab').forEach(async b=>{
      b.addEventListener('click',()=>run(()=>activateTab(b.dataset.tab)));
      b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;e.preventDefault();const tabs=[...document.querySelectorAll('.sim-tab:not(.hidden)')],i=tabs.indexOf(b),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].click();tabs[next].focus();});
    });
    on('demo-identity','change',async()=>{if($('demo-identity').value)api.selectIdentity($('demo-identity').value);else api.endSession(); period={type:'day',date:api.today()}; activeDetail=null;previewCode=null;$('join-preview').classList.add('hidden');$('generated-code-banner').classList.add('hidden');$('box-code-screen').textContent='';$('box-action-feedback').classList.add('hidden');$('venta-comparison-result').classList.add('hidden');activateTab('tab-avisos');});
    on('demo-business','change',async()=>{api.selectBusiness($('demo-business').value);period={type:'day',date:api.today()};activeDetail=null;editing=null;$('form-edit-member').classList.add('hidden');$('generated-code-banner').classList.add('hidden');$('box-action-feedback').classList.add('hidden');$('venta-comparison-result').classList.add('hidden');activateTab('tab-avisos');});
    on('btn-toggle-personalization','click',async()=>{const open=$('demo-personalization').classList.contains('hidden');if(api.context().member?.role!=='admin') throw new Error('Solo administración.');$('demo-personalization').classList.toggle('hidden',!open);$('btn-toggle-personalization').setAttribute('aria-expanded',String(open));const c=api.context();profileRevision=c.business.profileRevision || 0;$('input-business-name').value=c.business.name;$('input-owner-name').value=c.business.ownerName;['Yape','Plin'].forEach(s=>$('chk-init-'+s.toLowerCase()).checked=c.business.sources[s].active);});
    on('form-config-negocio','submit',async()=>{await api.updateBusiness($('input-business-name').value,$('input-owner-name').value,profileRevision);profileRevision=api.context().business.profileRevision || 0;for (const s of ['Yape','Plin']) await api.source(s,$('chk-init-'+s.toLowerCase()).checked);notify('Perfil guardado en la cuenta ficticia de administración.');});
    on('demo-create-business','click',async()=>{await api.createBusiness($('input-business-name').value,$('input-owner-name').value);period={type:'day',date:api.today()};notify('Negocio de ejemplo creado con identificador propio y cuenta administradora asociada.');});
    on('demo-reset','click',()=>ask('¿Restablecer todos los datos de ejemplo de este navegador?',async()=>{await api.reset();location.reload();}));
    on('btn-toggle-connection','click',async()=>{if(api.context().member?.role!=='admin')throw new Error('Solo administración.');offline=!offline;});
    on('btn-toggle-sound','click',()=>sound=!sound);
    const beep=async()=>{if(!sound)return;try {const c=new (window.AudioContext || window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);g.gain.value=.08;o.start();o.stop(c.currentTime+.15);o.onended=()=>c.close();}catch(_) {}};
    on('btn-simulate-incoming','click',async()=>{const result=await api.simulate($('demo-event-mode').value,online());notify(result.queued?'Aviso ficticio en cola local. Al recuperar la conexión, pulsa Actualizar lista.':`${result.added} avisos nuevos procesados; ${result.processed} eventos recibidos en el servicio local.`);if(result.added && api.context().member)beep();});
    on('btn-refresh-avisos','click',async()=>{const r=await api.sync(online());if(r.failed)notify(`${r.error}. Se conserva la última actualización válida.`,true);else notify(`Actualización local realizada: ${r.processed} eventos procesados, ${r.added} avisos nuevos. No consulta Android ni billeteras.`);});
    window.addEventListener('offline',async()=>{notify('El navegador perdió conexión. Se conserva la última hora válida.',true);render();});window.addEventListener('online',async()=>{notify('Red del navegador disponible. Actualiza la lista para procesar la cola local.');render();});
    window.addEventListener('storage',e=>{if(e.key===window.TarkiPayCore.KEY)run(async()=>{await api.reload();activeDetail=null;});});
    on('form-filter-avisos','submit',async()=>{const raw=$('filter-amount').value;const amount=raw===''?null:Number(raw);api.query(period,{...filters,amount}); filters.amount=amount;});
    buttons('[data-quick-amount]',async b=>{$('filter-amount').value=b.dataset.quickAmount;$('form-filter-avisos').requestSubmit();});
    on('filter-sender','input',()=>filters.sender=$('filter-sender').value);
    buttons('[data-channel]',async b=>{filters.channel=b.dataset.channel;document.querySelectorAll('[data-channel]').forEach(x=>x.classList.toggle('active',x===b));});
    ['start','end'].forEach(k=>on('filter-time-'+k,'change',async()=>{const next={...filters,[k]:$('filter-time-'+k).value};api.query(period,next);filters=next;}));
    on('btn-clear-all-filters','click',async()=>{filters={amount:null,sender:'',channel:'all',start:'',end:''};['filter-amount','filter-sender','filter-time-start','filter-time-end'].forEach(id=>$(id).value='');document.querySelectorAll('[data-channel]').forEach(b=>b.classList.toggle('active',b.dataset.channel==='all'));});
    on('avisos-day','change',async()=>{const next={type:'day',date:$('avisos-day').value};api.query(next,filters);period=next;activeDetail=null;});
    ['cierre-date-select','period-date','period-from','period-to'].forEach(id=>on(id,'change',setPeriod));
    on('btn-close-detail','click',async()=>{const id=activeDetail;activeDetail=null;render();[...document.querySelectorAll('.aviso-item')].find(el=>el.dataset.avisoId===id)?.focus();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && activeDetail)$('btn-close-detail').click();});
    on('form-invite-member','submit',async()=>{const i=await api.invite($('invite-name').value,$('invite-history-scope').value,getSchedule('invite'));$('generated-code-value').textContent=i.code;$('generated-code-details').textContent=`${api.context().business.name} · ${i.name} · ${scopeNames[i.scope]} · ${scheduleText(i.schedule)} · Vence ${instant(i.expiresAt)}. Generarlo aún no concede acceso.`;$('generated-code-banner').classList.remove('hidden');});
    on('form-edit-member','submit',async()=>{await api.editMember(editing,$('edit-scope').value,getSchedule('edit'),editingRevision);editing=null;$('form-edit-member').classList.add('hidden');notify('Permisos y turno guardados; el historial se conserva.');});
    on('edit-cancel','click',async()=>{editing=null;$('form-edit-member').classList.add('hidden');});
    on('form-join','submit',async()=>{previewCode=null;$('join-preview').classList.add('hidden');const i=api.previewInvitation($('join-code').value);previewCode=i.code;$('join-preview-text').textContent=`${i.businessName} · Colaborador · ${scopeNames[i.scope]} · ${scheduleText(i.schedule)} · Vence ${instant(i.expiresAt)}. Sin administración, transferencias ni claves bancarias.`;$('join-preview').classList.remove('hidden');});
    on('join-confirm','click',async()=>{if(!previewCode)throw new Error('Primero revisa una invitación.');await api.join(previewCode);previewCode=null;$('join-preview').classList.add('hidden');period={type:'day',date:api.today()};notify('Acceso de colaborador creado para esta cuenta ficticia.');});
    on('join-cancel','click',async()=>{previewCode=null;$('join-preview').classList.add('hidden');});
    buttons('[data-source]',async b=>{const c=api.context();await api.source(b.dataset.source,!c.business.sources[b.dataset.source].active);});
    on('btn-test-source-config','click',async()=>{$('source-test-feedback').classList.remove('hidden');});
    on('box-new-code','click',async()=>{const c=await api.newBoxCode();$('box-code-screen').textContent=`Pantalla del Box virtual: ${c.code} · Vence ${instant(c.expiresAt)}`;});
    on('form-pair-box','submit',async()=>{const code=$('box-pair-code').value,p=await api.pairBox(code,false);ask(`¿Vincular el Box virtual ${p.boxId} al negocio ${p.businessName}?`,async()=>{await api.pairBox(code,true);$('box-action-feedback').textContent='Box virtual vinculado. Pendiente de comunicación simulada; no acredita un equipo físico.';$('box-action-feedback').classList.remove('hidden');});});
    on('btn-test-box-sound','click',async()=>{if(api.context().member?.role!=='admin')throw new Error('Solo administración.');beep();notify('Prueba de sonido del navegador. No se envió a un dispositivo físico.');});
    on('btn-export-csv','click',async()=>{const csv=api.csv(period,filters),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=url;a.download='TarkiPay_avisos.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    on('form-vincular-venta','submit',async()=>{const v=await api.sale(Number($('sale-expected-amount').value),$('sale-select-aviso').value,$('sale-incident-note').value);$('venta-comparison-result').classList.remove('hidden');$('venta-comparison-result').textContent=`${v.status}. Comparación de importes; no confirma un abono.`;});
    on('btn-mark-sale-pending','click',async()=>await api.sale(Number($('sale-expected-amount').value),null,$('sale-incident-note').value));
    on('form-request-review','submit',async()=>await api.request(Number($('req-amount').value),$('req-sale-ref').value));
    buttons('[data-req-filter]',async b=>{reqFilter=b.dataset.reqFilter;document.querySelectorAll('[data-req-filter]').forEach(x=>x.classList.toggle('active',x===b));});
    // Read-only snapshots and guarded actions help reproduce acceptance tests; they are not authentication.
    on('sim-environment','submit',async()=>{const changes={};for(const key of ['receiverPermission','receiverOnline','serverOnline','brokerOnline'])changes[key]=$('sim-'+key).value==='true';await api.configureSimulation(changes);notify('Estados del ecosistema virtual actualizados. Usa Actualizar lista para sincronizar pendientes.');});
    on('sim-notification','submit',async()=>{const r=await api.notification($('sim-source').value,$('sim-kind').value,online());notify(r.status==='rejected'||r.status==='ignored'?r.reason:r.queued?'Notificación retenida en la cadena virtual. Actualiza al recuperar el servicio.':'Notificación recorrida por el procesador y el servicio virtual.');});
    on('sim-clock-form','submit',async()=>{await api.advanceClock(Number($('sim-minutes').value));period={type:'day',date:api.today()};notify('Reloj virtual avanzado; se recalcularon turnos, códigos y estado del Box.');});
    on('sim-retry-broker','click',async()=>{await api.retryBroker();notify('Reintento virtual completado; se respetan permisos, turno y conectividad.');});
    on('sim-ack-app','click',async()=>{await api.acknowledgeApp();notify('Recepción confirmada únicamente para las entregas de esta sesión ficticia.');});
    on('sim-end-session','click',async()=>{api.endSession();activeDetail=null;activateTab('tab-avisos');});
    on('sim-revoke-box-code','click',async()=>{const c=api.boxCodes().filter(c=>!c.usedAt&&!c.revokedAt&&c.expiresAt>api.now()).at(-1);if(!c)throw new Error('No hay un código Box disponible para revocar.');await api.revokeBoxCode(c.id);$('box-code-screen').textContent='El último código Box virtual fue revocado.';});
    const filterDisclosure=document.createElement('details');
    filterDisclosure.className='notice-filter-disclosure';
    filterDisclosure.innerHTML='<summary>Buscar y filtrar avisos</summary>';
    const filterPanel=document.querySelector('.notice-filters');
    filterPanel.before(filterDisclosure); filterDisclosure.append(filterPanel);
    const compactFilters=matchMedia('(max-width:600px)');
    const adaptFilters=()=>{filterDisclosure.open=!compactFilters.matches;};
    compactFilters.addEventListener('change',adaptFilters);adaptFilters();
    document.querySelectorAll('a[href="#demo"]').forEach(link=>link.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelector('.sim-workspace').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      history.replaceState(null,'','#demo');
    }));
    activateTab('tab-avisos'); await render();
    window.TarkiPayDemo=Object.freeze({api,render,whenIdle});
    setInterval(async()=>{if(document.visibilityState==='visible')render();},30000);
    return { render };
  };
})();
