"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),get=p=>fs.readFileSync(path.join(root,p),"utf8");
const P={engine:"assets/khaemenes-elementary-assessment-engine.js",ledger:"assets/khaemenes-elementary-learning-ledger.js",app:"grades/grade-03/assets/app.js",data:"grades/grade-03/data/course-data.js",index:"grades/grade-03/index.html"};
test("All Grade 3 learning and assessment scripts parse",()=>{
 for(const k of ["engine","ledger","app","data"])new vm.Script(get(P[k]),{filename:P[k]});
});
function fixture({member=true,owner="child-a",stored=null}={}){
 const state=new Map();
 const id="child-a",family={familyId:"fam",learnerIds:member?[id]:[]};
 const learner={learnerId:owner,familyId:"fam",grade:"03",stage:"elementary",nickname:"Sample"};
 const registry={learners:{[id]:learner},families:{fam:family}};
 state.set("khaemenes_active_learner_v1",JSON.stringify(id));
 state.set("khaemenes_family_registry_v1",JSON.stringify(registry));
 if(stored)state.set("khaemenes.course:child-a:elementary-grade-03",JSON.stringify(stored));
 const storage={getItem:k=>state.get(k)||null,setItem:(k,v)=>state.set(k,v)};
 const win={addEventListener:()=>{},CustomEvent:function(){},location:{pathname:"/Khaemenes_Elementary.github.io/grades/grade-03/assessments/week-01-assessment.html"}};
 win.window=win;
 const doc={readyState:"loading",addEventListener:()=>{},querySelector:()=>null,title:"Third Grade"};
 vm.runInNewContext(get(P.engine),{window:win,document:doc,location:win.location,localStorage:storage,CustomEvent:win.CustomEvent,Date,Math},{timeout:2000});
 return {api:win.KhaemenesElementaryAssessmentEngine,registry,state};
}
test("Bubble 1: formal assessment rejects unrelated child and non-member Grade 3 learner",()=>{
 assert.equal(fixture().api.learner().learnerId,"child-a");
 assert.equal(fixture({owner:"child-b"}).api.learner(),null);
 assert.equal(fixture({member:false}).api.learner(),null);
});
test("Bubble 2: Grade 3 assessment refuses raw or wrong-owner course state",()=>{
 const state={weekly:{1:100},midterm:100,final:100,portfolio:true};
 let f=fixture({stored:state});assert.equal(f.api.readFormalState().weekly[1],undefined);
 f=fixture({stored:{format:"khaemenes-course-state-v1",learnerId:"child-b",courseId:"elementary-grade-03",state}});
 assert.equal(f.api.readFormalState().weekly[1],undefined);
 f=fixture({stored:{format:"khaemenes-course-state-v1",learnerId:"child-a",courseId:"elementary-grade-03",state}});
 assert.equal(f.api.readFormalState().weekly[1],100);
});
test("Bubble 3: formal attempt requires persistent write before course update and continue",()=>{
 const s=get(P.engine);
 assert.match(s,/localStorage\.getItem\(k\)===raw/);
 assert.match(s,/const attemptSaved=gradeThreePreview\?false:appendAttempt\(snapshot\)/);
 assert.match(s,/l&&attemptSaved\?updateFormalScore\(snapshot\):false/);
 assert.match(s,/score>=PASS&&formallySaved/);
});
test("Bubble 4: formative ledger rejects Grade 3 unaffiliated and preview ownership",()=>{
 const s=get(P.ledger);
 assert.match(s,/learner\.learnerId!==id\|\|learner\.selfDirectedAdult===true/);
 assert.match(s,/family\?\.learnerIds\?\.includes\(id\)/);
 assert.match(s,/routeGrade\(\)==="03"&&id==="preview"/);
 assert.match(s,/localStorage\.getItem\(k\)===raw/);
});
test("Bubble 5: daily next step uses actual lessons, printables, exams and portfolio",()=>{
 const app=get(P.app),data=get(P.data);
 assert.match(app,/id='grade3NextStep'/);
 for(const segment of ["weekly-plans/week-","printables/week-","assessments/week-","assessments/midterm.html","assessments/final-exam.html","student-profile\/#academyStudio","records/certificate.html"])assert.ok(app.includes(segment),segment);
 assert.match(data,/Each of the 36 weekly assessments at or above 80%/);
 assert.doesNotMatch(data,/Weekly assessment average at or above 80%/);
});
test("Grade 3 route manifest covers all 8 subject halls and 36 weeks",()=>{
 const data=get(P.data),ctx={window:{}};vm.runInNewContext(data,ctx);
 const d=ctx.window.KHAE_GRADE3_DATA;
 assert.equal(d.subjects.length,8);assert.equal(d.weeks.length,36);
 for(const sub of d.subjects)assert.ok(fs.existsSync(path.join(root,"grades/grade-03/subjects",sub.id,"index.html")),"missing subject "+sub.id);
 for(let n=1;n<=36;n++){
  const w=String(n).padStart(2,"0");
  for(const p of ["weekly-plans/week-"+w+".html","printables/week-"+w+"-packet.html","assessments/week-"+w+"-assessment.html"])
   assert.ok(fs.existsSync(path.join(root,"grades/grade-03",p)),"missing "+p);
 }
});
