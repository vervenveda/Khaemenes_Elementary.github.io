"use strict";
// Synthetic browser-style regression of the actual Grade 01 UI and bundle scripts.
// Node standard library only; all fake data, no HTTP, storage, actual browser or STOS.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.join(__dirname,"..");
const bundleSource=fs.readFileSync(path.join(root,"assets/grade01-preservation-bundle-v1.js"),"utf8");
const uiSource=fs.readFileSync(path.join(root,"grades/grade-01/assets/grade01-preservation-export-ui-v1.js"),"utf8");
function setup(){
 const data=new Map(),writes=[],downloads=[],blobs=[],nodes={};
 const id="learner_synthetic_a",family="family_synthetic";
 const familyData={learners:{[id]:{learnerId:id,familyId:family,grade:"01",stage:"elementary"}},
   families:{[family]:{familyId:family,learnerIds:[id]}}};
 data.set("khaemenes_family_registry_v1",JSON.stringify(familyData));
 data.set("khaemenes_active_learner_v1",JSON.stringify(id));
 data.set("khaemenes_active_family_v1",JSON.stringify(family));
 data.set("khaemenes.course:"+id+":elementary-grade-01",JSON.stringify({weeks:{},notes:{},daily:{},dailyResponses:{}}));
 const storage={getItem:k=>data.has(k)?data.get(k):null,
  setItem(k,v){writes.push(["set",k]);data.set(k,v)},
  removeItem(k){writes.push(["remove",k]);data.delete(k)}};
 const document={readyState:"complete",
  getElementById:k=>k==="grade01FamilyReporting"?{querySelector:()=>({append(...els){
   for(const el of els)if(el.id)nodes[el.id]=el;}})}:nodes[k],
  createElement:tag=>({tag,style:{},setAttribute(k,v){this[k]=v},
   addEventListener(k,cb){this[k]=cb},click(){downloads.push(this.download)}})};
 class SyntheticBlob{constructor(parts){this.parts=parts;blobs.push(this)}}
 const URL={createObjectURL:()=>"blob:synthetic",revokeObjectURL(){}};
 const window={document,localStorage:storage,setTimeout(){}};
 const context=vm.createContext({window,document,Blob:SyntheticBlob,URL,console,JSON,Date,Object,String,Array});
 vm.runInContext(bundleSource,context,{filename:"grade01-preservation-bundle-v1.js"});
 // Node vm globalThis is the sandbox, not context.window; mirror the browser global.
 window.KhaemenesGrade01PreservationV1=context.KhaemenesGrade01PreservationV1;
 vm.runInContext(uiSource,context,{filename:"grade01-preservation-export-ui-v1.js"});
 return {data,writes,downloads,blobs,nodes,id,family,familyData,
   click(){nodes.grade01PreservationExport.click()},
   result(){return blobs.length?JSON.parse(blobs.at(-1).parts[0]):null}};
}
const tests=[
 ["valid selected learner downloads without storage writes",()=>{const x=setup();x.click();assert.equal(x.downloads.length,1);assert.equal(x.writes.length,0);assert.equal(x.result().admission,"HOLD")}],
 ["no learner blocked",()=>{const x=setup();x.data.delete("khaemenes_active_learner_v1");x.click();assert.equal(x.downloads.length,0)}],
 ["grade mismatch blocked",()=>{const x=setup();x.familyData.learners[x.id].grade="05";x.data.set("khaemenes_family_registry_v1",JSON.stringify(x.familyData));x.click();assert.equal(x.downloads.length,0)}],
 ["family mismatch blocked",()=>{const x=setup();x.data.set("khaemenes_active_family_v1",JSON.stringify("family_other"));x.click();assert.equal(x.downloads.length,0)}],
 ["corrupt family registry blocked",()=>{const x=setup();x.data.set("khaemenes_family_registry_v1","{bad");x.click();assert.equal(x.downloads.length,0)}],
 ["corrupt scoped course blocked",()=>{const x=setup();x.data.set("khaemenes.course:"+x.id+":elementary-grade-01","{bad");x.click();assert.equal(x.downloads.length,0)}],
 ["corrupt ledger blocked",()=>{const x=setup();x.data.set("khaemenes_elementary_learning_ledger_v1","{bad");x.click();assert.equal(x.downloads.length,0)}],
 ["corrupt attempts blocked",()=>{const x=setup();x.data.set("khaemenes.elementary.assessment.attempts:"+x.id+":grade-01","{bad");x.click();assert.equal(x.downloads.length,0)}],
 ["foreign learner attempts blocked",()=>{const x=setup();x.data.set("khaemenes.elementary.assessment.attempts:"+x.id+":grade-01",JSON.stringify([{learnerId:"learner_foreign",grade:"01",preview:false}]));x.click();assert.equal(x.downloads.length,0)}],
 ["missing evidence remains unknown",()=>{const x=setup();x.click();assert.equal(x.result().evidenceCoverage.attemptsSource,"absent");assert.equal(x.result().evidenceCoverage.missingOrUnknownEvidence,true)}],
 ["unassigned legacy never copied",()=>{const x=setup();x.data.set("khaemenes_grade1_36_aplus_v1",JSON.stringify({student:"legacy synthetic"}));x.click();assert.equal(x.result().legacyUnscopedPresent,true);assert.equal(JSON.stringify(x.result()).includes("legacy synthetic"),false)}]
];
let pass=0;for(const [label,fn] of tests){try{fn();pass++}catch(e){console.error("FAIL "+label+": "+e.message);process.exitCode=1}}
console.log((pass===tests.length?"PASS":"FAIL")+" "+pass+"/"+tests.length+" Grade01 synthetic browser-style checks");
