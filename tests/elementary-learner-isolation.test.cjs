/* Run from repository root: node tests/elementary-learner-isolation.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const configs=[
  {grade:"02",file:"grades/grade-02/assets/khaemenes-grade2-continuity.js",api:"KhaemenesGrade2Continuity",legacy:"khaemenes_grade2_subject_36_aplus_v1"},
  {grade:"04",file:"grades/grade-04/assets/khaemenes-grade4-continuity.js",api:"KhaemenesGrade4Continuity",legacy:"khaemenes_grade4_subject_36_aplusplus_v1"},
  {grade:"05",file:"grades/grade-05/assets/khaemenes-grade5-continuity.js",api:"KhaemenesGrade5Continuity",legacy:"khaemenes_grade5_subject_36_aplusplus_v1"}
];
let count=0;
for(const config of configs){
  const store=new Map();
  let active=null;
  const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
  const registry={getLearner:()=>active,normalizeGrade:v=>String(v||"").replace(/[^0-9]/g,"").padStart(2,"0"),normalizeStage:v=>String(v||"").toLowerCase()};
  const context={window:null,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},Date,JSON};
  context.window={localStorage:storage,KhaemenesFamilyRegistry:registry,dispatchEvent:()=>{},addEventListener:()=>{}};
  vm.runInNewContext(fs.readFileSync(config.file,"utf8"),context,{filename:config.file});
  const api=context.window[config.api];
  const a={learnerId:"student-A",grade:config.grade,stage:"elementary",nickname:"A"};
  const b={learnerId:"student-B",grade:config.grade,stage:"elementary",nickname:"B"};
  const preview={learnerId:"student-preview",grade:"09",stage:"elementary",nickname:"Preview"};
  const key=id=>`khaemenes.course:${id}:elementary-grade-${config.grade}`;
  store.set(config.legacy,JSON.stringify({weekly:{1:97},student:"legacy"}));
  active=a;
  assert.equal(api.status().status,"ready");
  assert.equal(api.writeState({weekly:{1:85},student:"A"}),true);
  active=b;
  assert.equal(api.readState(null),null,"B must not inherit A or legacy progress");
  assert.equal(api.writeState({weekly:{1:92},student:"B"}),true);
  active=a;
  assert.equal(api.readState().student,"A");
  active=b;
  assert.equal(api.readState().student,"B");
  active=preview;
  assert.equal(api.status().status,"placement-mismatch");
  assert.equal(api.readState(null),null,"preview must not read legacy work");
  assert.equal(api.writeState({student:"preview"}),false,"preview must not write");
  assert.equal(JSON.parse(store.get(config.legacy)).student,"legacy","legacy work must remain intact");
  assert.equal(store.has(key(preview.learnerId)),false,"preview must not create scoped progress");
  active=null;
  assert.equal(api.readState().student,"legacy","legacy preview remains readable without active learner");
  assert.equal(api.writeState({student:"anonymous"}),false,"anonymous session must not overwrite legacy");
  active=a;
  assert.equal(api.readState().student,"A","A must resume after switching");
  active=b;
  assert.equal(api.readState().student,"B","B must resume after switching");
  assert.equal(JSON.parse(store.get(key(a.learnerId))).learnerId,a.learnerId);
  assert.equal(JSON.parse(store.get(key(b.learnerId))).learnerId,b.learnerId);
  count++;
  process.stdout.write(`PASS Grade ${config.grade}: two learners, preview isolation, legacy preservation, resume\n`);
}
process.stdout.write(`PASS ${count} grade continuity regression suites\n`);
