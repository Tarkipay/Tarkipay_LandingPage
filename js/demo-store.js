/* IndexedDB is the authority. Each entity is a record; there is no persisted snapshot blob.
 * The readwrite transaction includes reading the current entities, validating the command,
 * applying it, and putting/deleting only changed records. No await occurs inside that transaction.
 */
(function (root) {
  'use strict';
  const DB_NAME='tarkipay-demo-v4', STORE='entities';
  const collections=['businesses','users','memberships','avisos','pending','invitations','deliveries','boxes','boxCodes','auditLog','ventas','requests','receiverEvents'];
  const copy=x=>JSON.parse(JSON.stringify(x));
  function validate(db) {
    if(db && !Object.hasOwn(db,'receiverEvents'))db.receiverEvents=[];
    if (!db || ![3,4].includes(db.version) || !collections.every(k=>Array.isArray(db[k]))) throw new Error('Los datos guardados no son válidos. No se sobrescribieron.');
    return db;
  }
  function encode(db) {
    validate(db); const map=new Map();
    const header=Object.fromEntries(Object.entries(db).filter(([key])=>!collections.includes(key)));
    map.set('$root',{key:'$root',value:header});
    for(const type of collections) db[type].forEach((entity,order)=>{
      // Stable technical identity for retries, deliveries and historical activity without an ID.
      const key=entity.id && type!=='pending' ? JSON.stringify([type,entity.businessId || '',entity.id])
        : (entity._storageKey ||= JSON.stringify([type,crypto.randomUUID()]));
      map.set(key,{key,type,order,value:entity});
    });
    return map;
  }
  function decode(rows) {
    const header=rows.find(r=>r.key==='$root'); if(!header) throw new Error('Los datos guardados no son válidos. No se sobrescribieron.');
    const db={...copy(header.value)};
    for(const type of collections) db[type]=rows.filter(r=>r.type===type).sort((a,b)=>a.order-b.order).map(r=>copy(r.value));
    return validate(db);
  }
  async function open({indexedDB=root.indexedDB,name=DB_NAME,initial,legacy}={}) {
    if(!indexedDB?.open) throw new Error('IndexedDB no está disponible. No se guardaron cambios; abre la demo en un navegador compatible.');
    const connection=await new Promise((resolve,reject)=>{
      const request=indexedDB.open(name,1);
      request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'key'});
      request.onerror=()=>reject(request.error);
      request.onblocked=()=>reject(new Error('Cierra otras versiones de la demo antes de actualizar su almacenamiento.'));
      request.onsuccess=()=>resolve(request.result);
    });
    connection.onversionchange=()=>connection.close();
    function transact(change) {
      return new Promise((resolve,reject)=>{
        const tx=connection.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),request=store.getAll();
        let failure,output,snapshot;
        request.onsuccess=()=>{
          try {
            const previous=new Map(request.result.map(r=>[r.key,r]));
            const db=request.result.length ? decode(request.result) : validate(copy(legacy?.() || initial()));
            if(!request.result.length) { db.version=4; db.persistence={schema:4,epoch:0,revision:0,operation:'migration-or-initialization'}; }
            output=change(db);snapshot=copy(db);const next=encode(snapshot);
            for(const [key,record] of next) if(JSON.stringify(previous.get(key))!==JSON.stringify(record)) store.put(record);
            for(const key of previous.keys()) if(!next.has(key))store.delete(key);
          } catch(error) { failure=error;tx.abort(); }
        };
        request.onerror=()=>{failure=request.error;};
        tx.oncomplete=()=>resolve({result:output,snapshot});
        tx.onabort=tx.onerror=()=>reject(failure || tx.error || new Error('No se pudo confirmar la transacción. No se guardaron cambios.'));
      });
    }
    const read=()=>new Promise((resolve,reject)=>{
      const tx=connection.transaction(STORE,'readonly'),request=tx.objectStore(STORE).getAll();let snapshot,error;
      request.onsuccess=()=>{try{snapshot=decode(request.result);}catch(e){error=e;}};
      tx.oncomplete=()=>error ? reject(error) : resolve(snapshot);
      tx.onabort=tx.onerror=()=>reject(tx.error || new Error('No se pudo leer el almacenamiento.'));
    });
    await transact(()=>undefined); // First migration is exclusive; concurrent initializers cannot reimport v3.
    return Object.freeze({transact,read,close:()=>connection.close()});
  }
  root.TarkiPayStore=Object.freeze({open,DB_NAME,STORE});
})(globalThis);
