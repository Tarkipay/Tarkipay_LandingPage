/* Functional browser demo. No Android, MQTT, bank or physical Box connection. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TarkiPayCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const KEY = 'tarkipay.demo.v3';
  const copy = x => JSON.parse(JSON.stringify(x));
  const norm = x => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const fail = message => { throw new Error(message); };
  const text = (x, label) => {
    if (typeof x !== 'string' || !x.trim() || x.trim().length > 100) fail(`${label}: ingresa entre 1 y 100 caracteres.`);
    return x.trim();
  };
  const money = x => {
    if (!Number.isFinite(x) || x <= 0 || x > 100000000 || Math.abs(x * 100 - Math.round(x * 100)) > 0.00001) fail('Ingresa un monto positivo con hasta dos decimales.');
    return x;
  };
  const parts = (instant, zone = 'America/Lima') => Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(instant)).map(x => [x.type, x.value]));
  const day = instant => { const p = parts(instant); return `${p.year}-${p.month}-${p.day}`; };
  const time = instant => { const p = parts(instant); return `${p.hour}:${p.minute}`; };
  const shift = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10);
  const validDay = d => /^\d{4}-\d{2}-\d{2}$/.test(d || '') && !isNaN(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d;
  const validTime = t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t || '');
  function schedule(value) {
    if (!value || !Array.isArray(value.days) || !value.days.length || value.days.some(d => !Number.isInteger(d) || d < 0 || d > 6) || !validTime(value.start) || !validTime(value.end) || value.start >= value.end) fail('Elige días y una hora de fin posterior al inicio. Divide los turnos nocturnos en dos jornadas.');
    return { days: [...new Set(value.days)], start: value.start, end: value.end };
  }
  function inShift(m, instant, zone) {
    if (m.role === 'admin') return true;
    const p = parts(instant, zone), d = `${p.year}-${p.month}-${p.day}`;
    return m.schedule.days.includes(new Date(d + 'T12:00:00Z').getUTCDay()) && `${p.hour}:${p.minute}` >= m.schedule.start && `${p.hour}:${p.minute}` < m.schedule.end;
  }
  function create(seed, options = {}) {
    const clock = options.now || (() => Date.now());
    const storage = options.storage || null;
    let serial = 0, db, session = { userId: 'U-1', businessId: 'B-1' }, persistenceError = storage ? '' : 'Almacenamiento local no disponible. Los cambios duran solo esta sesión.';
    const uid = prefix => `${prefix}-${clock()}-${++serial}-${Math.random().toString(36).slice(2, 10)}`;
    const base = () => {
      const b = 'B-1', now = clock(), today = day(now), yesterday = shift(today, -1);
      const avisos = copy(seed.avisos || []).map(a => ({ ...a, businessId: b,
        date: a.id === 'TP-1020' ? yesterday : today,
        eventAt: a.payTime ? Date.parse(`${a.id === 'TP-1020' ? yesterday : today}T${a.payTime}:00-05:00`) : null,
        receivedAt: Date.parse(`${a.id === 'TP-1020' ? yesterday : today}T${a.receiveTime}:00-05:00`), origin: 'example' }));
      return { version: 3, businesses: [{ id: b, name: seed.businessName, ownerName: seed.ownerName, timezone: 'America/Lima', sources: copy(seed.sources), lastSyncAt: null },
        { id: 'B-2', name: 'Puesto del mercado', ownerName: seed.ownerName, timezone: 'America/Lima', sources: { Yape: { active: true }, Plin: { active: false } }, lastSyncAt: null }],
        users: [{ id: 'U-1', name: seed.ownerName }, { id: 'U-2', name: 'Lucía Pérez' }, { id: 'U-3', name: 'Diego Ramos' }, { id: 'U-guest', name: 'Nueva persona' }],
        memberships: [{ id: 'M-1', userId: 'U-1', businessId: b, role: 'admin', scope: 'all', active: true },
          { id: 'M-2', userId: 'U-2', businessId: b, role: 'collab', scope: 'today', active: true, schedule: { days: [1,2,3,4,5,6], start: '09:00', end: '18:00' } },
          { id: 'M-3', userId: 'U-3', businessId: b, role: 'collab', scope: 'today', active: false, schedule: { days: [1], start: '09:00', end: '18:00' } },
          { id: 'M-4', userId: 'U-1', businessId: 'B-2', role: 'admin', scope: 'all', active: true }],
        avisos, pending: [], invitations: [], deliveries: [], boxes: [], boxCodes: [], auditLog: [],
        ventas: copy(seed.ventas || []).map(v => ({ ...v, businessId: b, date: today })),
        requests: copy(seed.requests || []).map(r => ({ ...r, businessId: b, date: today })) };
    };
    function load() {
      try {
        const raw = storage && storage.getItem(KEY);
        if (!raw) return base();
        const parsed = JSON.parse(raw);
        if (parsed.version !== 3 || !['businesses','users','memberships','avisos','pending','invitations','deliveries','boxes','boxCodes','auditLog','ventas','requests'].every(k => Array.isArray(parsed[k]))) throw new Error();
        parsed.deliveries.forEach(d => {
          d.businessId ||= parsed.memberships.find(m => m.id === d.memberId)?.businessId || parsed.boxes.find(b => b.id === d.boxId)?.businessId;
        });
        return parsed;
      } catch (_) { persistenceError = 'No se pudieron recuperar los datos guardados. Se cargaron ejemplos; restablece la demo para volver a guardar.'; return base(); }
    }
    db = load();
    function save() {
      try { if (storage) { storage.setItem(KEY, JSON.stringify(db)); persistenceError = ''; } }
      catch (_) { persistenceError = 'No se pudo guardar en este navegador. Los cambios duran solo esta sesión.'; }
    }
    const business = () => db.businesses.find(b => b.id === session.businessId) || fail('Negocio no disponible.');
    const membership = () => db.memberships.find(m => m.userId === session.userId && m.businessId === session.businessId && m.active);
    const requireAccess = admin => { const m = membership(); if (!m || (admin && m.role !== 'admin')) fail('No tienes permiso para esta acción en este negocio.'); return m; };
    const log = action => db.auditLog.unshift({ action, userId: session.userId, businessId: session.businessId, at: clock() });
    function scopeBounds(m) {
      const today = day(clock());
      if (m.scope === 'all') return ['0001-01-01', '9999-12-31'];
      const weekday = new Date(today + 'T12:00:00Z').getUTCDay();
      return [m.scope === 'today' ? today : m.scope === 'week' ? shift(today, -(weekday + 6) % 7) : today.slice(0,7) + '-01', today];
    }
    function bounds(period = { type: 'day', date: day(clock()) }) {
      let start, end;
      const d = period.date || day(clock());
      if (!validDay(d)) fail('Fecha inválida.');
      if (period.type === 'day') start = end = d;
      else if (period.type === 'week') { start = shift(d, -((new Date(d + 'T12:00:00Z').getUTCDay() + 6) % 7)); end = shift(start, 6); }
      else if (period.type === 'month' || period.type === 'range') {
        const from = period.type === 'month' ? d.slice(0,7) : period.from;
        const to = period.type === 'month' ? from : period.to;
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(from || '') || !/^\d{4}-(0[1-9]|1[0-2])$/.test(to || '') || from > to) fail('Elige un rango de meses válido.');
        start = from + '-01'; const e = new Date(to + '-01T12:00:00Z'); e.setUTCMonth(e.getUTCMonth()+1); end = shift(e.toISOString().slice(0,10), -1);
      } else fail('Periodo no disponible.');
      return [start, end];
    }
    function query(period, filters = {}) {
      const m = requireAccess(false), [start,end] = bounds(period), [min,max] = scopeBounds(m);
      // A week/month selection is a calendar view; records beyond today are excluded for collaborators.
      if (m.role !== 'admin' && (start < min || start > max || (period.type === 'range') || (period.type === 'week' && !['week','month'].includes(m.scope)) || (period.type === 'month' && m.scope !== 'month'))) fail('Ese periodo está fuera del historial autorizado.');
      if (filters.amount !== null && filters.amount !== undefined) money(filters.amount);
      if ((filters.start && !validTime(filters.start)) || (filters.end && !validTime(filters.end)) || (filters.start && filters.end && filters.start > filters.end)) fail('El intervalo de horas no es válido.');
      return copy(db.avisos.filter(a => a.businessId === session.businessId && a.date >= start && a.date <= end && a.date >= min && a.date <= max &&
        (filters.amount == null || a.amount === filters.amount) && (!filters.sender || norm(a.sender).includes(norm(filters.sender))) &&
        (!filters.channel || filters.channel === 'all' || a.channel === filters.channel) &&
        (!filters.start || (a.payTime || a.receiveTime) >= filters.start) && (!filters.end || (a.payTime || a.receiveTime) <= filters.end))
        .sort((a,b) => (b.eventAt || b.receivedAt) - (a.eventAt || a.receivedAt) || b.receivedAt - a.receivedAt || a.id.localeCompare(b.id)));
    }
    function getAviso(id) {
      const m = requireAccess(false), [min,max] = scopeBounds(m);
      return db.avisos.find(a => a.id === id && a.businessId === session.businessId && a.date >= min && a.date <= max) || fail('Aviso fuera del acceso autorizado.');
    }
    function validateEvent(e) {
      if (!e || typeof e.id !== 'string' || !e.id || e.id.length > 100 || !Number.isFinite(e.receivedAt) || (e.eventAt !== null && !Number.isFinite(e.eventAt))) fail('Evento sin identificador u hora válida.');
      if (e.amount !== null) money(e.amount);
      if (!['Yape','Plin','No disponible'].includes(e.channel)) fail('Fuente no reconocida.');
      if (e.channel !== 'No disponible' && !business().sources[e.channel]?.active) fail('Fuente desactivada; no se procesó el aviso.');
      return { id: e.id, businessId: session.businessId, amount: e.amount, sender: typeof e.sender === 'string' && e.sender.trim() ? e.sender.trim().slice(0,100) : 'No disponible',
        channel: e.channel, eventAt: e.eventAt, receivedAt: e.receivedAt, date: day(e.eventAt || e.receivedAt), payTime: e.eventAt ? time(e.eventAt) : null,
        receiveTime: time(e.receivedAt), delayed: !!e.eventAt && e.receivedAt - e.eventAt > 60000, status: e.amount === null ? 'Datos por revisar' : 'Aviso detectado',
        verifiedInWallet: false, verifiedBy: null, read: false, linkedSaleId: null, note: '', origin: 'simulated' };
    }
    function deliver(a) {
      db.memberships.filter(m => m.businessId === a.businessId && m.active && inShift(m, clock(), business().timezone)).forEach(m => db.deliveries.push({ businessId:a.businessId, eventId: a.id, memberId: m.id, kind: 'app', at: clock(), status: 'simulated' }));
      db.boxes.filter(b => b.businessId === a.businessId).forEach(b => db.deliveries.push({ businessId:a.businessId, eventId: a.id, boxId: b.id, kind: 'box', at: clock(), status: b.online ? 'sent' : 'pending' }));
    }
    function refresh(online = true) {
      requireAccess(false);
      if (!online) fail('Sin conexión. Se conserva la última actualización válida; revisa la billetera receptora.');
      const queued = db.pending.filter(a => a.businessId === session.businessId); let added = 0;
      for (const e of queued) {
        if (db.avisos.some(a => a.id === e.id && a.businessId === e.businessId)) continue;
        if (e.channel !== 'No disponible' && !business().sources[e.channel]?.active) continue;
        db.avisos.push(copy(e)); deliver(e); added++;
      }
      db.pending = db.pending.filter(a => a.businessId !== session.businessId);
      business().lastSyncAt = clock(); save(); return { added, processed: queued.length, at: business().lastSyncAt };
    }
    function invitation(code) {
      const value = String(code || '').replace(/\s/g, '');
      const i = db.invitations.find(i => i.code === value);
      if (!i || i.usedAt || i.revokedAt || i.expiresAt <= clock()) fail('Código inválido, vencido, revocado o utilizado. Solicita otro al administrador.');
      return i;
    }
    const scope = s => { if (!['today','week','month'].includes(s)) fail('Alcance inválido.'); return s; };
    const code = list => { let c; do { c = String(Math.floor(100000 + Math.random() * 900000)); } while (list.some(i => i.code === c)); return c; };
    return Object.freeze({
      today: () => day(clock()), now: clock, bounds,
      context: () => copy({ session, business: business(), member: membership() || null, users: db.users, businesses: db.businesses.map(b => ({ id: b.id, name: b.name })), persistenceError }),
      selectIdentity(userId) { if (!db.users.some(u => u.id === userId)) fail('Identidad no disponible.'); session.userId = userId; },
      selectBusiness(id) { if (!db.businesses.some(b => b.id === id)) fail('Negocio no disponible.'); session.businessId = id; },
      query,
      detail(id) { const a = getAviso(id); a.read = true; save(); return copy(a); },
      verify(id) { requireAccess(true); const a = getAviso(id); a.verifiedInWallet = true; a.verifiedBy = `${business().ownerName} (${time(clock())})`; save(); },
      updateBusiness(name, ownerName) { requireAccess(true); const n = text(name,'Negocio'), o = text(ownerName,'Responsable'); Object.assign(business(), { name:n, ownerName:o }); db.users.find(u => u.id === session.userId).name = o; log('Perfil del negocio actualizado'); save(); },
      createBusiness(name, ownerName) {
        requireAccess(true); const n = text(name,'Negocio'), o = text(ownerName,'Responsable'), id = uid('B');
        db.businesses.push({ id, name:n, ownerName:o, timezone:'America/Lima', sources:{ Yape:{active:true}, Plin:{active:true} }, lastSyncAt:null });
        db.memberships.push({ id:uid('M'), userId:session.userId, businessId:id, role:'admin', scope:'all', active:true }); session.businessId = id; log('Negocio creado y asociado a la cuenta ficticia'); save(); return id;
      },
      source(channel, active) { requireAccess(true); if (!business().sources[channel]) fail('Fuente no disponible.'); business().sources[channel].active = !!active; save(); },
      queue(event) { requireAccess(true); const a = validateEvent(event); db.pending.push(a); save(); return copy(a); },
      simulate(mode = 'one', online = true) {
        requireAccess(true); const sources = Object.keys(business().sources).filter(k => business().sources[k].active);
        if (!sources.length) fail('Activa al menos una fuente para simular avisos.');
        if (mode === 'duplicate') { const last = db.avisos.filter(a => a.businessId === session.businessId).at(-1); if (!last) fail('Primero genera un aviso.'); db.pending.push(copy(last)); }
        else for (let i = 0; i < (mode === 'burst' ? 3 : 1); i++) {
          const now = clock() + i; const e = validateEvent({ id:uid('SIM'), amount:20, sender:['Rosa Medina','Luis Paredes','Camila Soto'][i], channel:sources[i % sources.length],
            eventAt: now - (mode === 'late' ? 120000 : 0), receivedAt:now }); db.pending.push(e);
        }
        save(); return mode === 'late' || !online ? { queued:true } : refresh(online);
      },
      refresh,
      invite(name, history, shiftValue, minutes = 15) {
        requireAccess(true); const n = text(name,'Integrante'), s = scope(history), sch = schedule(shiftValue);
        if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 1440) fail('Vigencia inválida.');
        const i = { id:uid('INV'), code:code(db.invitations), name:n, businessId:session.businessId, scope:s, schedule:sch, expiresAt:clock()+minutes*60000, usedAt:null, revokedAt:null };
        db.invitations.push(i); log(`Invitación para ${n}`); save(); return copy(i);
      },
      previewInvitation(value) { const i = invitation(value); return copy({ ...i, businessName:db.businesses.find(b => b.id === i.businessId).name }); },
      join(value) {
        const i = invitation(value);
        if (db.memberships.some(m => m.userId === session.userId && m.businessId === i.businessId && m.active)) fail('Esta cuenta ya tiene acceso a ese negocio. Elige una identidad nueva para canjear.');
        const u = db.users.find(u => u.id === session.userId);
        // The demo creates a distinct fictional account when the invitation is redeemed.
        const userId = u.id === 'U-guest' ? uid('U') : u.id;
        if (userId !== u.id) db.users.push({ id:userId, name:i.name });
        db.memberships.push({ id:uid('M'), userId, businessId:i.businessId, role:'collab', scope:i.scope, schedule:copy(i.schedule), active:true });
        i.usedAt = clock(); session = { userId, businessId:i.businessId }; log('Invitación canjeada como colaborador'); save(); return userId;
      },
      revokeInvite(id) { requireAccess(true); const i = db.invitations.find(i => i.id === id && i.businessId === session.businessId); if (!i) fail('Invitación no disponible.'); i.revokedAt = clock(); log('Invitación revocada'); save(); },
      team() { requireAccess(true); return copy(db.memberships.filter(m => m.businessId === session.businessId).map(m => ({ ...m, name:db.users.find(u => u.id === m.userId)?.name || 'No disponible', inShift:inShift(m,clock(),business().timezone) }))); },
      invitations() { requireAccess(true); return copy(db.invitations.filter(i => i.businessId === session.businessId)); },
      editMember(id, history, shiftValue) {
        requireAccess(true); const m = db.memberships.find(m => m.id === id && m.businessId === session.businessId && m.role === 'collab' && m.active);
        if (!m) fail('Integrante no disponible.'); const s = scope(history), sch = schedule(shiftValue); Object.assign(m, { scope:s, schedule:sch }); log(`Permisos y turno actualizados para ${m.userId}`); save();
      },
      revokeMember(id, confirmed) { requireAccess(true); const m = db.memberships.find(m => m.id === id && m.businessId === session.businessId && m.role === 'collab'); if (!m) fail('Integrante no disponible.'); if (!confirmed) return false; m.active = false; log(`Acceso retirado a ${m.userId}`); save(); return true; },
      activity() { requireAccess(true); return copy(db.auditLog.filter(e => e.businessId === session.businessId)); },
      deliveries() { const m = requireAccess(false); return copy(db.deliveries.filter(d => d.businessId === session.businessId && (m.role === 'admin' || d.memberId === m.id))); },
      report(period, filters) {
        const rows = query(period, filters), groups = ['Yape','Plin','No disponible'].map(channel => {
          const list = rows.filter(a => a.channel === channel); return { channel, count:list.length, known:list.filter(a => a.amount !== null).length, cents:list.reduce((n,a) => n + Math.round((a.amount || 0)*100),0) };
        });
        return { rows, groups, count:rows.length, known:rows.filter(a => a.amount !== null).length, cents:groups.reduce((n,g) => n+g.cents,0), reviewedCents:rows.reduce((n,a) => n + (a.verifiedInWallet ? Math.round((a.amount || 0)*100) : 0),0) };
      },
      csv(period, filters) {
        requireAccess(true); const rows = query(period,filters); const cell = v => '"' + (/^[\s]*[=+@-]/.test(String(v ?? '')) ? "'" : '') + String(v ?? '').replace(/"/g,'""') + '"';
        return '\uFEFF' + [['Negocio','Fecha','Código','Hora aviso','Hora recepción','Importe detectado','Nombre recibido','Billetera','Revisado en billetera'], ...rows.map(a => [business().name,a.date,a.id,a.payTime || 'No disponible',a.receiveTime,a.amount === null ? 'No disponible' : a.amount.toFixed(2),a.sender,a.channel,a.verifiedInWallet ? 'Sí' : 'No'])].map(r => r.map(cell).join(',')).join('\r\n');
      },
      newBoxCode(minutes = 5) {
        requireAccess(true); if (!Number.isFinite(minutes) || minutes < 1 || minutes > 60) fail('Vigencia inválida.');
        const i = { id:uid('BOX'), code:code(db.boxCodes), expiresAt:clock()+minutes*60000, usedAt:null, businessId:null }; db.boxCodes.push(i); save(); return copy(i);
      },
      pairBox(value, confirmed) {
        requireAccess(true); const c = db.boxCodes.find(i => i.code === String(value || '').replace(/\s/g,''));
        if (!c || c.usedAt || c.expiresAt <= clock() || c.businessId) fail('Código Box inválido, vencido o utilizado. Genera otro en el Box virtual.');
        if (!confirmed) return { businessName:business().name, boxId:c.id };
        c.usedAt = clock(); c.businessId = session.businessId; db.boxes.push({ id:c.id, businessId:session.businessId, online:false, lastSeenAt:null }); log('Box virtual vinculado, pendiente de comunicación'); save();
      },
      boxCommunication(id, online) {
        requireAccess(true); const b = db.boxes.find(b => b.id === id && b.businessId === session.businessId); if (!b) fail('Box no vinculado a este negocio.');
        b.online = !!online; if (online) { b.lastSeenAt = clock(); db.deliveries.filter(d => d.boxId === id && d.status === 'pending').forEach(d => { d.status='sent'; d.at=clock(); }); } save();
      },
      boxAcknowledge(id) {
        requireAccess(true); const b = db.boxes.find(b => b.id === id && b.businessId === session.businessId); if (!b || !b.online) fail('No hay comunicación con ese Box virtual.');
        b.lastSeenAt = clock(); db.deliveries.filter(d => d.boxId === id && d.status === 'sent').forEach(d => { d.status='acknowledged'; d.ackAt=clock(); }); save();
      },
      boxes() {
        requireAccess(true); return copy(db.boxes.filter(b => b.businessId === session.businessId).map(b => {
          const list = db.deliveries.filter(d => d.boxId === b.id && day(d.at) === day(clock()));
          return { ...b, status:!b.lastSeenAt ? 'Pendiente de comunicación' : !b.online || clock()-b.lastSeenAt > 120000 ? 'Desconectado' : 'Conectado virtual', sent:list.filter(d => ['sent','acknowledged'].includes(d.status)).length, acknowledged:list.filter(d => d.status === 'acknowledged').length, pending:list.filter(d => d.status === 'pending').length };
        }));
      },
      sales() { requireAccess(false); return copy(db.ventas.filter(v => v.businessId === session.businessId && v.date === day(clock()))); },
      sale(expected, avisoId, note = '') {
        requireAccess(false); money(expected); const a = avisoId ? getAviso(avisoId) : null;
        if (a && (a.amount === null || a.linkedSaleId)) fail('Aviso sin monto o ya asociado. Revisa la billetera y selecciona otro.');
        const diff = a ? Math.round((expected-a.amount)*100) : null, id = uid('V'), linked = a && diff <= 0;
        const v = { id, businessId:session.businessId, date:day(clock()), expectedAmount:expected, receivedAmount:a ? a.amount : null, linkedAvisoId:linked ? a.id : null,
          status:!a ? 'Pendiente de revisión' : diff > 0 ? `Pendiente (Faltan S/ ${(diff/100).toFixed(2)})` : `Asociada con ${a.id}`, time:time(clock()), note:String(note).slice(0,200) };
        if (linked) a.linkedSaleId = id; db.ventas.unshift(v); save(); return copy(v);
      },
      unlinkSale(id) { requireAccess(false); const v = db.ventas.find(v => v.id === id && v.businessId === session.businessId && v.date === day(clock())); if (!v) fail('Venta no disponible.'); if (v.linkedAvisoId) getAviso(v.linkedAvisoId).linkedSaleId = null; v.linkedAvisoId=null; v.status='Vínculo retirado por corrección'; save(); },
      requests() { requireAccess(false); return copy(db.requests.filter(r => r.businessId === session.businessId && r.date === day(clock()))); },
      request(amount, ref) { requireAccess(false); money(amount); const saleRef=text(ref,'Referencia'); db.requests.unshift({ id:uid('REQ'), businessId:session.businessId, date:day(clock()), amount, saleRef, sender:db.users.find(u => u.id === session.userId).name, time:time(clock()), status:'pending' }); save(); },
      resolve(id) { requireAccess(true); const r=db.requests.find(r => r.id === id && r.businessId === session.businessId); if (!r) fail('Solicitud no disponible.'); Object.assign(r,{status:'resolved',resolutionText:'Revisado manualmente en billetera',responseBy:business().ownerName,responseTime:time(clock())}); save(); },
      reset() { requireAccess(true); db=base(); session={userId:'U-1',businessId:'B-1'}; save(); },
      reload() { db=load(); }
    });
  }
  return { create, KEY, day, time, inShift };
});
