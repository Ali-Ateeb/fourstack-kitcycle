import {seedState,validateState,transition,exportAudit} from './core.mjs';
const KEY='kitcycle-demo-v1', $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state,selected='K-01',storageHealthy=true;
function message(text,error=false){$('message').textContent=text;$('message').className=error?'error':'';}
function load(){const raw=localStorage.getItem(KEY);return raw===null?seedState():validateState(JSON.parse(raw));}
try{state=load();}catch(e){storageHealthy=false;message('Cannot read saved demo data. Your saved data was not overwritten. Reset to start a new synthetic demo. '+e.message,true);}
const badge=k=>`<span class="badge ${esc(k.status)}">${esc(k.status)}</span>`;
const checks=(parts,name)=>parts.map(p=>`<label class="check"><input type="checkbox" name="${name}" value="${esc(p)}">${esc(p)}</label>`).join('');
const checked=(f,name)=>[...f.querySelectorAll(`input[name="${name}"]:checked`)].map(i=>i.value);
function commit(action){
 try{
  if(!storageHealthy)throw Error('Storage is unavailable. Reset the demo to retry.');
  const latest=load();
  if(latest.revision!==state.revision){state=latest;render();throw Error('Another tab changed this kit. The view is refreshed; review it before trying again.');}
  const next=transition(latest,action,state.revision);
  localStorage.setItem(KEY,JSON.stringify(next));state=next;render();message('Recorded: '+action.type+'. Revision '+state.revision+'.');
 }catch(e){message(e.message,true);}
}
function render(){
 if(!state){$('kits').textContent='Saved data unavailable.';$('detail').textContent='Reset is required to start a new demo.';$('export').disabled=true;return;}
 $('export').disabled=false;$('revision').textContent='Revision '+state.revision;
 $('stats').innerHTML=['available','reserved','loaned','repair'].map(s=>`<div class="stat"><strong>${state.kits.filter(k=>k.status===s).length}</strong>${s}</div>`).join('');
 $('kits').innerHTML=state.kits.map(k=>`<article class="kit ${k.id===selected?'selected':''}"><div class="kit-top"><span class="kit-code">${esc(k.id)} · ${esc(k.category)}</span>${badge(k)}</div><h3>${esc(k.name)}</h3><p>${k.parts.length} components · ${state.requests.filter(r=>r.kitId===k.id&&r.status==='pending').length} pending requests</p><button class="quiet" data-open="${esc(k.id)}" ${k.id===selected?'aria-current="true"':''}>Open ${esc(k.name)}</button></article>`).join('');
 const k=state.kits.find(k=>k.id===selected),r=state.requests.find(r=>r.id===k.requestId);
 let html=`<h3>${esc(k.name)}</h3>${badge(k)}<p class="flow">Request → Approval → Checkout → Return → Inspection if needed</p><ul class="parts">${k.parts.map(p=>'<li>'+esc(p)+'</li>').join('')}</ul>`;
 if(k.status==='available')html+=`<h4>Request this kit</h4><p class="muted">A request does not hold the kit. A volunteer must approve it.</p><form data-action="request"><label for="alias">Invented club alias</label><input id="alias" name="alias" type="text" maxlength="40" required placeholder="e.g. Demo Robotics Club"><label for="purpose">What is the synthetic activity?</label><textarea id="purpose" name="purpose" maxlength="180" required placeholder="e.g. An imaginary sensor workshop"></textarea><div class="actions"><button>Send demo request</button></div></form>`;
 if(k.status==='reserved')html+=`<h4>Checkout for ${esc(r.alias)}</h4><p class="muted">Confirm every component before recording the handoff.</p><form data-action="checkout">${checks(k.parts,'checkedParts')}<div class="actions"><button>Record inspected checkout</button><button type="button" class="quiet" data-cancel="${esc(r.id)}">Cancel reservation</button></div></form>`;
 if(k.status==='loaned')html+=`<h4>Return from ${esc(r.alias)}</h4><form data-action="return"><p class="muted">Tick any missing components. Leave all unticked for a complete return.</p>${checks(k.parts,'missing')}<label class="check"><input type="checkbox" name="damaged">Damage reported</label><label for="return-note">Repair note (required if anything is missing or damaged)</label><textarea id="return-note" name="note" maxlength="240"></textarea><div class="actions"><button>Record return</button></div></form>`;
 if(k.status==='repair')html+=`<h4>Repair hold</h4><p class="repair-note">${esc(k.repairNote)}</p><p class="muted">No new requests or approvals until inspection clears the hold.</p><form data-action="repair"><label for="inspection">Inspection / replacement note</label><textarea id="inspection" name="note" maxlength="240" required></textarea><label class="check"><input type="checkbox" name="confirmed" required>I confirm that every listed component is present and inspected (simulated).</label><div class="actions"><button>Clear repair hold</button></div></form>`;
 const requests=state.requests.filter(r=>r.kitId===k.id&&r.status==='pending');
 html+='<h4>Pending requests</h4>'+(requests.length?requests.map(r=>`<div class="request"><strong>${esc(r.alias)}</strong><p>${esc(r.purpose)}</p><p class="muted">${esc(r.id)}</p><label class="check"><input type="checkbox" id="approve-${esc(r.id)}">I have reviewed this request (simulated).</label><div class="actions"><button data-approve="${esc(r.id)}" ${k.status!=='available'?'disabled':''}>Approve request</button><button class="quiet" data-decline="${esc(r.id)}">Decline</button></div>${k.status!=='available'?'<p class="muted">Another loan or repair hold currently blocks approval.</p>':''}</div>`).join(''):'<p class="empty">No pending requests for this kit.</p>');
 $('detail').innerHTML=html;
 $('history').innerHTML=state.audit.length?`<div class="scroll"><table><thead><tr><th>Revision / time</th><th>Kit / action</th><th>Handoff detail</th></tr></thead><tbody>${[...state.audit].reverse().map(a=>`<tr><td>#${a.revision}<br><time datetime="${esc(a.at)}">${esc(new Date(a.at).toLocaleString())}</time></td><td>${esc(a.kitId)}<br>${esc(a.action)}</td><td>${esc(a.detail)}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">No handoffs yet. Request Circuit starter, approve it, then check out all three parts. Return it with a missing cable to try the repair workflow.</p>';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.open){selected=b.dataset.open;render();$('detail-title').scrollIntoView({behavior:'smooth',block:'nearest'});}
 for(const [key,type]of [['approve','approve'],['decline','decline'],['cancel','cancel']])if(b.dataset[key])commit({type,kitId:selected,requestId:b.dataset[key],confirmed:type==='approve'&&$('approve-'+b.dataset[key]).checked});
});
document.addEventListener('submit',e=>{
 const f=e.target;if(!f.dataset.action)return;e.preventDefault();
 commit({type:f.dataset.action,kitId:selected,alias:f.elements.alias?.value,purpose:f.elements.purpose?.value,checkedParts:checked(f,'checkedParts'),missing:checked(f,'missing'),damaged:!!f.elements.damaged?.checked,note:f.elements.note?.value,confirmed:!!f.elements.confirmed?.checked});
});
$('export').onclick=()=>{try{const blob=new Blob([exportAudit(state)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='kitcycle-synthetic-audit.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Synthetic audit exported. Browser data can be edited; this is not a certified record.');}catch(e){message(e.message,true);}};
$('reset').onclick=()=>{if(!confirm('Replace this browser’s saved KitCycle data with the three synthetic demo kits? Export a backup first if needed.'))return;try{const next=seedState();localStorage.setItem(KEY,JSON.stringify(next));state=next;storageHealthy=true;render();message('Synthetic demo reset.');}catch(e){message('Cannot save the demo. '+e.message,true);}};
addEventListener('storage',e=>{if(e.key!==KEY)return;try{state=load();storageHealthy=true;render();message('Another tab changed this demo. The view has refreshed.');}catch(err){storageHealthy=false;message('Saved data changed but cannot be read. '+err.message,true);}});
render();
