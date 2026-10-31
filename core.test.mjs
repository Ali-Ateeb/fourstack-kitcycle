import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seedState,transition as act,validateState,exportAudit} from './core.mjs';
const request=(s,alias='Club A')=>act(s,{type:'request',kitId:'K-01',alias,purpose:'Invented workshop'});
const approve=s=>act(s,{type:'approve',kitId:'K-01',requestId:'R-1',confirmed:true});
const checkout=s=>act(s,{type:'checkout',kitId:'K-01',checkedParts:s.kits[0].parts});
test('a request does not reserve equipment; approval is explicit and immutable',()=>{
 const seed=seedState(),s=request(seed);assert.equal(seed.requests.length,0);assert.equal(s.kits[0].status,'available');
 assert.throws(()=>act(s,{type:'approve',kitId:'K-01',requestId:'R-1'}),/person/);
 assert.equal(approve(s).kits[0].status,'reserved');assert.equal(s.kits[0].status,'available');
});
test('two pending requests cannot create a double checkout',()=>{
 const s=request(request(seedState()),'Club B'),a=approve(s);
 assert.throws(()=>act(a,{type:'approve',kitId:'K-01',requestId:'R-2',confirmed:true}),/reserved/);
 assert.throws(()=>act(a,{type:'request',kitId:'K-01',alias:'C',purpose:'D'}),/not available/);
});
test('checkout requires exact complete component inspection',()=>{
 const s=approve(request(seedState()));
 assert.throws(()=>act(s,{type:'checkout',kitId:'K-01',checkedParts:['Board','Board','USB cable']}),/every/);
 assert.equal(checkout(s).kits[0].status,'loaned');
 assert.throws(()=>act(checkout(s),{type:'checkout',kitId:'K-01',checkedParts:s.kits[0].parts}),/Approve/);
});
test('missing return moves kit to repair, never back into circulation',()=>{
 let s=checkout(approve(request(seedState())));
 s=act(s,{type:'return',kitId:'K-01',missing:['USB cable'],damaged:false,note:'Replace cable'});
 assert.equal(s.kits[0].status,'repair');assert.match(s.kits[0].repairNote,/USB cable/);
 assert.throws(()=>act(s,{type:'request',kitId:'K-01',alias:'A',purpose:'B'}),/not available/);
 assert.throws(()=>act(s,{type:'repair',kitId:'K-01',note:'done'}),/Confirm/);
 s=act(s,{type:'repair',kitId:'K-01',note:'Replacement checked',confirmed:true});assert.equal(s.kits[0].status,'available');
});
test('complete return releases kit and retains request/audit history',()=>{
 let s=checkout(approve(request(seedState())));s=act(s,{type:'return',kitId:'K-01',missing:[],damaged:false,note:''});
 assert.equal(s.kits[0].status,'available');assert.equal(s.requests[0].status,'returned');assert.equal(s.audit.length,4);
 assert.equal(JSON.parse(exportAudit(s)).revision,4);assert.equal(JSON.parse(exportAudit(s)).syntheticDemo,true);
});
test('invalid return, repair and missing notes do not mutate state',()=>{
 const s=checkout(approve(request(seedState()))),before=JSON.stringify(s);
 assert.throws(()=>act(s,{type:'return',kitId:'K-01',missing:['Laptop'],damaged:false,note:'x'}),/listed/);
 assert.throws(()=>act(s,{type:'return',kitId:'K-01',missing:[],damaged:true,note:''}),/Repair note/);
 assert.throws(()=>act(seedState(),{type:'return',kitId:'K-01',missing:[],damaged:false}),/checked-out/);
 assert.equal(JSON.stringify(s),before);
});
test('cancel approval releases reservation; closed requests cannot be approved',()=>{
 let s=approve(request(seedState()));s=act(s,{type:'cancel',kitId:'K-01',requestId:'R-1'});
 assert.equal(s.kits[0].status,'available');assert.equal(s.requests[0].status,'cancelled');
 assert.throws(()=>approve(s),/pending/);
});
test('stale revisions fail before applying an action',()=>{
 const s=request(seedState());assert.throws(()=>act(s,{type:'approve',kitId:'K-01',requestId:'R-1',confirmed:true},0),/out of date/);
});
test('unknown kits and oversized/blank aliases are rejected',()=>{
 assert.throws(()=>request(seedState(),' '.repeat(4)),/alias/);
 assert.throws(()=>request(seedState(),'x'.repeat(41)),/alias/);
 assert.throws(()=>act(seedState(),{type:'repair',kitId:'no'}),/not found/);
});
test('corrupt persisted state, duplicate requests and inconsistent audit are rejected',()=>{
 const a=seedState();a.kits[0].status='loaned';assert.throws(()=>validateState(a),/request/);
 const b=request(seedState());b.requests.push(structuredClone(b.requests[0]));assert.throws(()=>validateState(b),/request/);
 const c=request(seedState());c.audit=[];assert.throws(()=>validateState(c),/Audit/);
});
