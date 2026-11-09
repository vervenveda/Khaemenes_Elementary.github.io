"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const cases=[
 ["mathematics",27,"angles and geometry","decimal place value, tenths, hundredths, and money"],
 ["mathematics",28,"place value","measurement conversions, labeled units, and data"],
 ["mathematics",29,"multi-digit multiplication","lines, angles, and symmetry"],
 ["mathematics",30,"division with remainders","angle measurement, angle addition, and protractor reasoning"],
 ["science",19,"energy transfer","weathering, erosion, and controlled Earth-material models"],
 ["science",32,"Earth materials","material choices, design constraints, and evidence-based budgeting"],
 ["science",33,"erosion and landforms","measurement data, reliable sources, and scientific charts"],
 ["language-arts",31,"text structure","poetry, dramatic dialogue, and performance interpretation"],
 ["language-arts",34,"grammar and conventions","research questions, source notes, and evidence-based writing"],
 ["integrated-projects",34,"peer critique","capstone inquiry planning, source evaluation, and evidence design"]
];
function page(subject,week){return fs.readFileSync(path.join(root,"grades/grade-04/subjects",subject,"week-"+String(week).padStart(2,"0")+".html"),"utf8")}
test("Ten source-file focus repairs are reflected across all five days of teaching",()=>{
 for(const [subject,week,oldFocus,newFocus] of cases){
  const html=page(subject,week);
  const found=[...html.matchAll(/<strong>Focus:<\/strong>\s*([^<]+)/g)].map(x=>x[1].trim());
  assert.equal(found.length,5,subject+" week "+week+" should have five dated lessons");
  assert.ok(found.every(v=>v===newFocus),subject+" week "+week+": mismatched weekday focus");
  assert.ok(html.split(newFocus).length-1>=15,subject+" week "+week+" should use new focus in objectives and teacher guidance");
  assert.ok(!found.includes(oldFocus),subject+" "+week+" retained old focus");
 }
});
test("All ten revised lesson pages retain original learning and assessment routes",()=>{
 for(const [subject,week] of cases){
  const html=page(subject,week),n=String(week).padStart(2,"0");
  for(const fragment of ["Monday:","Tuesday:","Wednesday:","Thursday:","Friday:","khaemenes-elementary-learning-ledger.js","../../printables/week-"+n+"-packet.html","../../weekly-plans/week-"+n+".html"]){
   assert.ok(html.includes(fragment),subject+" "+week+" missing "+fragment);
  }
 }
});
test("All Grade 4 formal assessment and score authority remains in the shared engine",()=>{
 const engine=fs.readFileSync(path.join(root,"assets/khaemenes-elementary-assessment-engine.js"),"utf8");
 assert.match(engine,/const VERSION/);
 assert.match(engine,/function updateFormalScore/);
 for(const [subject,week] of cases){
  const html=page(subject,week);
  assert.doesNotMatch(html,/localStorage\.setItem\(/);
 }
});
test("Every Grade 4 late-year subject lesson remains accessible",()=>{
 const subjects=["language-arts","mathematics","science","social-studies","arts-music","health-pe-sel","technology-tools","integrated-projects"];
 let count=0;
 for(const s of subjects)for(let w=19;w<=36;w++){
  assert.ok(fs.existsSync(path.join(root,"grades/grade-04/subjects",s,"week-"+String(w).padStart(2,"0")+".html")));
  count++;
 }
 assert.equal(count,144);
});
test("Supplementary depth studio remains passive and available",()=>{
 const studio=fs.readFileSync(path.join(root,"assets/khaemenes-grade4-late-year-depth.js"),"utf8");
 new vm.Script(studio);
 assert.doesNotMatch(studio,/localStorage|setItem\(|\.writeState\(/);
 assert.match(studio,/formativeOnly:true/);
});
