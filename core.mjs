// New October 31 competition implementation. No prior competition code reused.
export function seedState() {
  return {version:1,revision:0,kits:[
    {id:'K-01',name:'Circuit starter',category:'Electronics',parts:['Board','USB cable','Sensor pack'],status:'available',requestId:null,repairNote:''},
    {id:'K-02',name:'Field recorder',category:'Media',parts:['Recorder','Microphone','Carry case'],status:'available',requestId:null,repairNote:''},
    {id:'K-03',name:'Robot rover',category:'Robotics',parts:['Chassis','Battery','Controller'],status:'repair',requestId:null,repairNote:'Synthetic demo: battery connector needs inspection.'}
  ],requests:[],audit:[]};
}
function fail(message){ throw new Error(message); }
function text(value,label,max=100){
  if(typeof value!=='string'||!value.trim()||value.trim().length>max) fail(`${label} must contain 1–${max} characters.`);
  return value.trim();
}
export function validateState(s){
  if(!s||s.version!==1||!Number.isSafeInteger(s.revision)||s.revision<0||!Array.isArray(s.kits)||!Array.isArray(s.requests)||!Array.isArray(s.audit)) fail('Stored demo data is invalid. Export a backup if possible, then reset the demo.');
  const keys=new Set(),requestKeys=new Set();
  for(const k of s.kits){
    if(!k||keys.has(k.id)||!['available','reserved','loaned','repair'].includes(k.status)||!Array.isArray(k.parts)||!k.parts.length) fail('Invalid or duplicate kit.');
    text(k.id,'Kit ID');text(k.name,'Kit name');text(k.category,'Category');k.parts.forEach(p=>text(p,'Part'));keys.add(k.id);
    if(!['available','repair'].includes(k.status)&&typeof k.requestId!=='string') fail('Active kit has no request.');
    if(['available','repair'].includes(k.status)&&k.requestId!==null) fail('Inactive kit retains a request.');
    if(typeof k.repairNote!=='string') fail('Invalid repair note.');
  }
  for(const r of s.requests){
    if(!r||requestKeys.has(r.id)||!keys.has(r.kitId)||!['pending','approved','checked_out','returned','declined','cancelled'].includes(r.status))fail('Invalid request.');
    text(r.id,'Request ID');text(r.alias,'Demo alias',40);text(r.purpose,'Purpose',180);requestKeys.add(r.id);
  }
  for(const k of s.kits){
    const active=s.requests.filter(r=>r.kitId===k.id&&['approved','checked_out'].includes(r.status));
    if(active.length>1)fail('A kit has multiple active loans.');
    if(k.status==='reserved'&&!active.some(r=>r.id===k.requestId&&r.status==='approved'))fail('Reservation is inconsistent.');
    if(k.status==='loaned'&&!active.some(r=>r.id===k.requestId&&r.status==='checked_out'))fail('Loan is inconsistent.');
    if(['available','repair'].includes(k.status)&&active.length)fail('Kit availability is inconsistent.');
  }
  if(s.audit.length!==s.revision||s.audit.some((a,i)=>!a||a.revision!==i+1||typeof a.action!=='string'||!Number.isFinite(Date.parse(a.at))))fail('Audit history is inconsistent.');
  return s;
}
export function transition(current,action,expectedRevision=current.revision,at=new Date().toISOString()){
  validateState(current);
  if(expectedRevision!==current.revision)fail('This view is out of date. Review the refreshed kit before trying again.');
  if(!Number.isFinite(Date.parse(at)))fail('Invalid action time.');
  const s=structuredClone(current), k=s.kits.find(k=>k.id===action.kitId);
  if(!k)fail('Kit not found.');
  let detail='', requestId=action.requestId||null;
  if(action.type==='request'){
    if(k.status!=='available')fail('This kit is not available for a new request.');
    const alias=text(action.alias,'Demo alias',40),purpose=text(action.purpose,'Purpose',180);
    requestId=`R-${s.revision+1}`;
    s.requests.push({id:requestId,kitId:k.id,alias,purpose,status:'pending'});
    detail=`Request from ${alias}. No reservation until approval.`;
  }else if(action.type==='approve'||action.type==='decline'){
    const r=s.requests.find(r=>r.id===requestId&&r.kitId===k.id);
    if(!r||r.status!=='pending')fail('Only a pending request can be reviewed.');
    if(action.type==='approve'){
      if(action.confirmed!==true)fail('A person must confirm approval.');
      if(k.status!=='available')fail('Another request has reserved this kit.');
      r.status='approved';k.status='reserved';k.requestId=r.id;
      detail='Human approval recorded; awaiting physical checkout.';
    }else{r.status='declined';detail='Request declined.';}
  }else if(action.type==='checkout'){
    if(k.status!=='reserved')fail('Approve a request before checkout.');
    const r=s.requests.find(r=>r.id===k.requestId);
    const checked=action.checkedParts;
    if(!Array.isArray(checked)||checked.length!==k.parts.length||new Set(checked).size!==k.parts.length||!k.parts.every(p=>checked.includes(p)))fail('Check every listed component before checkout.');
    r.status='checked_out';k.status='loaned';requestId=r.id;detail='All components checked; physical checkout recorded.';
  }else if(action.type==='cancel'){
    const r=s.requests.find(r=>r.id===requestId&&r.kitId===k.id);
    if(!r||!['pending','approved'].includes(r.status))fail('This request cannot be cancelled.');
    if(r.status==='approved'){k.status='available';k.requestId=null;}
    r.status='cancelled';detail='Request cancelled; any reservation released.';
  }else if(action.type==='return'){
    if(k.status!=='loaned')fail('Only a checked-out kit can be returned.');
    if(!Array.isArray(action.missing)||new Set(action.missing).size!==action.missing.length||action.missing.some(p=>!k.parts.includes(p)))fail('Choose missing components from the listed parts.');
    if(typeof action.damaged!=='boolean')fail('Choose the return condition.');
    const r=s.requests.find(r=>r.id===k.requestId);requestId=r.id;r.status='returned';k.requestId=null;
    if(action.missing.length||action.damaged){
      const note=text(action.note,'Repair note',240);k.status='repair';k.repairNote=`${action.missing.length?'Missing: '+action.missing.join(', ')+'. ':''}${action.damaged?'Damage reported. ':''}${note}`;
      detail='Return recorded; quarantined for inspection. '+k.repairNote;
    }else{k.status='available';k.repairNote='';detail='Complete return recorded; kit available.';}
  }else if(action.type==='repair'){
    if(k.status!=='repair')fail('This kit is not in the repair queue.');
    if(action.confirmed!==true)fail('Confirm that all parts were inspected.');
    detail='Inspection completed: '+text(action.note,'Inspection note',240);k.status='available';k.repairNote='';
  }else fail('Unknown action.');
  s.revision++;s.audit.push({revision:s.revision,at:new Date(at).toISOString(),kitId:k.id,requestId,action:action.type,detail});
  return validateState(s);
}
export function exportAudit(s){validateState(s);return JSON.stringify({product:'KitCycle',syntheticDemo:true,...s},null,2);}
