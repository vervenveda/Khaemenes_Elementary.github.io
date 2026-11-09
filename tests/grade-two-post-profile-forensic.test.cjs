"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const paths={
 certificate:"grades/grade-02/assets/certificate.js",
 recovery:"grades/grade-02/assets/grade2-record-recovery.js",
 subject:"grades/grade-02/assets/khaemenes-grade2-subject-context.js",
 dashboard:"grades/grade-02/assets/app.js",
 publisher:"assets/khaemenes-elementary-continuation-publisher.js"
};
for(const [name,p] of Object.entries(paths))test(name+" JavaScript parses",()=>new vm.Script(read(p),{filename:p}));
test("Bubble 1: certificate requires matching family, learner, course and wrapped score record",()=>{
 const s=read(paths.certificate);
 assert.match(s,/family\?\.learnerIds\?\.includes\(id\)/);
 assert.match(s,/raw\.learnerId===l\.learnerId/);
 assert.match(s,/raw\.courseId==="elementary-grade-02"/);
 assert.match(s,/!Array\.isArray\(raw\.state\)/);
 assert.doesNotMatch(s,/if\(raw&&typeof raw==="object"\)return raw/);
 assert.match(s,/s\.portfolio===true/);
});
test("Bubble 2: backup recovery rejects silent partial writes and retains rollback",()=>{
 const s=read(paths.recovery);
 assert.match(s,/localStorage\.getItem\(key\)!==courseRaw/);
 assert.match(s,/localStorage\.getItem\(ak\)!==attemptsRaw/);
 assert.match(s,/course-write-unverified/);
 assert.match(s,/attempt-write-unverified/);
 assert.match(s,/previousState===null/);
 assert.match(s,/previousAttempts===null/);
});
test("Bubble 3: asynchronous backup inspection and restore recheck selected learner",()=>{
 const s=read(paths.recovery);
 assert.match(s,/JSON\.parse\(await file\.text\(\)\);if\(who\(\)\?\.learnerId!==l\.learnerId\)/);
 assert.match(s,/if\(who\(\)\?\.learnerId!==l\.learnerId\|\|C\.scopedKey\(\)!==key\)/);
});
test("Bubble 4: subject hall checks registered family before exposing learner key",()=>{
 const s=read(paths.subject);
 assert.match(s,/l\.learnerId===ids\.learnerId/);
 assert.match(s,/l\.familyId===family\.familyId/);
 assert.match(s,/family\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.match(s,/l\.selfDirectedAdult!==true/);
});
test("Bubble 5: active Grade 2 dashboard does not borrow legacy scores or grant preview certification",()=>{
 const s=read(paths.dashboard),p=read(paths.publisher);
 assert.match(s,/if\(linked\?\.status==="ready"\)/);
 assert.match(s,/return scoped&&typeof scoped==="object"&&!Array\.isArray\(scoped\)\?Object\.assign\(blank\(\),scoped\):blank\(\)/);
 assert.match(s,/learnerStatus\(\)\?\.status==="ready"&&done\(\)===36/);
 assert.match(s,/try\{return CONT\?\.status\?\.\(\)\.status==="ready"&&CONT\.writeState\?\.\(state\)===true\}/);
 assert.match(p,/const current=activeLearner\(conf\)/);
 assert.match(p,/current\.learnerId!==ctx\.learner\.learnerId/);
});
test("Certificate synthetic sibling and spoofed record cannot unlock completion",()=>{
 const source=read(paths.certificate);
 const family={familyId:"family-1",learnerIds:["child-a"]};
 const learner={learnerId:"child-a",familyId:"family-1",grade:"02",stage:"elementary",nickname:"Synthetic"};
 const registry={learners:{"child-a":learner},families:{"family-1":family}};
 const values=new Map([["khaemenes_active_learner_v1",JSON.stringify("child-a")],["khaemenes_family_registry_v1",JSON.stringify(registry)]]);
 const scoped="khaemenes.course:child-a:elementary-grade-02",weeks=Object.fromEntries(Array.from({length:36},(_,i)=>[i+1,100]));
 function run(record,familyIds=["child-a"]){
  family.learnerIds=familyIds;values.set("khaemenes_family_registry_v1",JSON.stringify(registry));
  values.set(scoped,JSON.stringify(record));
  const output={innerHTML:""};
  const storage={getItem:key=>values.get(key)||null};
  vm.runInNewContext(source,{document:{getElementById:()=>output},localStorage:storage,Array,Math,Number,String,JSON,Boolean},{timeout:2000});
  return output.innerHTML;
 }
 const state={weekly:weeks,midterm:100,final:100,portfolio:true};
 assert.match(run({format:"khaemenes-course-state-v1",learnerId:"child-b",courseId:"elementary-grade-02",state}),/Certificate Locked/);
 assert.match(run({format:"khaemenes-course-state-v1",learnerId:"child-a",courseId:"elementary-grade-03",state}),/Certificate Locked/);
 assert.match(run(state),/Certificate Locked/);
 assert.match(run({format:"khaemenes-course-state-v1",learnerId:"child-a",courseId:"elementary-grade-02",state},[]),/Certificate Locked/);
 assert.match(run({format:"khaemenes-course-state-v1",learnerId:"child-a",courseId:"elementary-grade-02",state}),/Certificate of Second Grade Completion/);
});
