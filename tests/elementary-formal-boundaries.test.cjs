"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const assessment=fs.readFileSync("assets/khaemenes-elementary-assessment-engine.js","utf8");
const grade1=fs.readFileSync("grades/grade-01/assets/grade1-mastery.js","utf8");
function create(grade,week,formal){
 const store=new Map();
 const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const owner="fiction-A",other="fiction-B";
 const registry={learners:{
  [owner]:{learnerId:owner,stage:"elementary",grade},
  [other]:{learnerId:other,stage:"elementary",grade}
 }};
 store.set("khaemenes_family_registry_v1",JSON.stringify(registry));
 store.set("khaemenes_active_learner_v1",JSON.stringify(owner));
 const key="khaemenes.course:"+owner+":elementary-grade-"+grade;
 function setState(state){store.set(key,JSON.stringify({format:"khaemenes-course-state-v1",state}))}
 setState(formal);
 const window={dispatchEvent(){},addEventListener(){}};
 const context={window,localStorage:storage,location:{pathname:"/Khaemenes_Elementary.github.io/grades/grade-"+grade+"/assessments/week-"+String(week).padStart(2,"0")+"-assessment.html"},document:{readyState:"loading",addEventListener(){},querySelector(){return null}},CustomEvent:class{}};
 vm.runInNewContext(assessment,context,{filename:"assets/khaemenes-elementary-assessment-engine.js"});
 return{api:window.KhaemenesElementaryAssessmentEngine,storage,setState,owner,other};
}
for(const grade of ["01","02","03","04","05"]){
 const before=grade==="01"?{weeks:{18:{bestScore:90}},midterm:{bestScore:79}}:{weekly:{18:90},midterm:79};
 const after=grade==="01"?{weeks:{18:{bestScore:90}},midterm:{bestScore:80}}:{weekly:{18:90},midterm:80};
 const runner=create(grade,19,before);
 assert.equal(runner.api.gate().open,false,grade+": Week 19 bypassed 80% midterm");
 runner.setState(after);
 assert.equal(runner.api.gate().open,true,grade+": valid Week 19 incorrectly locked");
 runner.storage.setItem("khaemenes_active_learner_v1",JSON.stringify(runner.other));
 assert.equal(runner.api.gate().open,false,grade+": learner identity cannot inherit another learner's Week 18/19 state");
 const mid=grade==="01"?{weeks:{18:{bestScore:90}},midterm:{bestScore:80}}:{weekly:{18:90},midterm:80};
 const w20=create(grade,20,mid);
 assert.equal(w20.api.gate().open,false,grade+": Week 20 bypassed Week 19");
}
assert.match(assessment,/const initialOwner=learner\(\)\?\.learnerId\|\|null,initialKey=courseKey\(\),initialAccess=gate\(\)/);
assert.match(assessment,/currentAccess\.preview!==initialAccess\.preview/);
assert.match(assessment,/currentOwner|learner\(\)\?\.learnerId\|\|null/);
assert.match(assessment,/form\.querySelectorAll\("input,button"\)\.forEach\(el=>el\.disabled=true\)/);
assert.match(assessment,/legacy&&!legacy\.querySelector\("#quizForm"\)/);
assert.match(assessment,/if\(legacy\.querySelector\("#quizForm"\)\)return/);
assert.match(assessment,/w===36\)return"final-exam\.html"/);
assert.match(grade1,/n>18&&Number\(load\(\)\.midterm\?\.bestScore\|\|0\)<THRESHOLD/);
assert.match(grade1,/locked:!masteredWeek\(C\.final\.unlockAfterWeek\)\|\|Number\(load\(\)\.midterm\?\.bestScore\|\|0\)<THRESHOLD/);
console.log("PASS: Grades 01–05 midterm and week gates, learner separation, Grade 1 legacy form and final navigation safeguards.");
