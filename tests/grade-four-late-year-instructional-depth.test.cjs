"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const studio=read("assets/khaemenes-grade4-late-year-depth.js");
const ledger=read("assets/khaemenes-elementary-learning-ledger.js");
const subjects=["language-arts","mathematics","science","social-studies","arts-music","health-pe-sel","technology-tools","integrated-projects"];
function render(week,subject){
 const created=[];const children=[];
 function element(tag){
  const e={tag,style:{},children:[],textContent:"",href:"",id:"",className:"",append(...values){this.children.push(...values)},appendChild(child){this.children.push(child)},setAttribute(){},querySelector(){return null}};
  created.push(e);return e;
 }
 const host={querySelector:()=>({}),insertBefore:(el)=>children.push(el),append:(el)=>children.push(el)};
 const document={readyState:"complete",createElement:element,createTextNode:text=>({text}),getElementById:()=>null,querySelector:()=>host};
 const location={pathname:"/Khaemenes_Elementary.github.io/grades/grade-04/subjects/"+subject+"/week-"+String(week).padStart(2,"0")+".html"};
 const w={};w.window=w;
 vm.runInNewContext(studio,{window:w,document,location},{timeout:2000});
 return {children,created,window:w,strings:created.map(e=>e.textContent).join(" \n "),links:created.filter(e=>e.tag==="a").map(e=>e.href)};
}
test("Grade 4 depth module and shared ledger parse",()=>{
 new vm.Script(studio);new vm.Script(ledger);
});
test("The dynamic loader targets Grade 4 subject weeks 19–36 and no other course",()=>{
 assert.match(ledger,/function attachGrade4LateYearDepth\(\)/);
 assert.match(ledger,/if\(week<19\|\|week>36\|\|document\.getElementById\("grade4DepthModuleScript"\)\)return/);
 assert.match(ledger,/script\.src="\.\.\/\.\.\/\.\.\/\.\.\/assets\/khaemenes-grade4-late-year-depth\.js"/);
 assert.match(ledger,/function scan\(\)\{\s*attachGrade4LateYearDepth\(\)/);
});
test("Every Grade 4 subject's 18 late-year pages exists, is reachable and links to shared ledger",()=>{
 let count=0;
 for(const subject of subjects)for(let week=19;week<=36;week++){
  const file=path.join(root,"grades/grade-04/subjects",subject,"week-"+String(week).padStart(2,"0")+".html");
  assert.ok(fs.existsSync(file),"Missing subject lesson: "+file);
  const html=fs.readFileSync(file,"utf8");
  assert.match(html,/khaemenes-elementary-learning-ledger\.js/,subject+" week "+week+" missing ledger");
  count++;
 }
 assert.equal(count,144);
});
test("Studio renders distinct, usable supplemental learning across all 144 routes",()=>{
 for(const subject of subjects)for(let week=19;week<=36;week++){
  const r=render(week,subject);
  assert.equal(r.children.length,1,subject+" "+week);
  assert.match(r.strings,/Concrete learning scenario/);
  assert.match(r.strings,/Worked quantitative reasoning/);
  assert.match(r.strings,/Three-step subject workshop/);
  assert.match(r.strings,/Portfolio evidence/);
  assert.ok(r.strings.includes("Week "+String(week).padStart(2,"0")));
  assert.equal(r.links.length,3);
  assert.ok(r.links[0].endsWith("weekly-plans/week-"+String(week).padStart(2,"0")+".html"));
  assert.ok(r.links[1].endsWith("printables/week-"+String(week).padStart(2,"0")+"-packet.html"));
  assert.ok(r.links[2].endsWith("assessments/week-"+String(week).padStart(2,"0")+"-assessment.html"));
  for(const href of r.links){
   const file=path.resolve(root,"grades/grade-04/subjects",subject,href);
   assert.ok(fs.existsSync(file),subject+" week "+week+": link missing "+href);
  }
 }
});
test("Original subjects and early weeks do not receive late-year supplemental studio",()=>{
 for(const week of [1,18,37])assert.equal(render(week,"mathematics").children.length,0);
 assert.equal(render(19,"foreign-language").children.length,0);
});
test("Studio has no authority to award mastery or save, and requires learner-owned original assessments",()=>{
 assert.doesNotMatch(studio,/localStorage|indexedDB|sessionStorage|fetch\(|\.publish\(|\.writeState\(|\.setItem\(/);
 assert.match(studio,/doesNotStoreData:true/);
 assert.match(studio,/never changes scores, assessment gates, placement or portfolio approval/);
});
test("Late-year worked examples and historical/source limitations are concrete",()=>{
 for(const [week,fragment] of [[19,"6 g"],[23,"Indigenous nations"],[27,"0.70"],[30,"35 degrees"],[32,"$54"],[33,"12.5"],[35,"$15"],[36,"formal 80%"]]){
  assert.ok(render(week,"mathematics").strings.includes(fragment),"Expected week "+week+" model: "+fragment);
 }
 assert.match(studio,/without blending distinct Indigenous nations/);
 assert.match(studio,/avoid invented testimony/);
});
