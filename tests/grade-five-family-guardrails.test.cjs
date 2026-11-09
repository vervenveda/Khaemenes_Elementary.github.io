"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const P={bridge:"grades/grade-05/assets/khaemenes-grade5-continuity.js",subject:"grades/grade-05/assets/khaemenes-grade5-subject-context.js",app:"grades/grade-05/assets/app.js",family:"assets/khaemenes-grade-five-family-view.js",certificate:"grades/grade-05/assets/certificate.js",profile:"student-profile/index.html",engine:"assets/khaemenes-elementary-assessment-engine.js",ledger:"assets/khaemenes-elementary-learning-ledger.js"};
test("Grade 5 scripts and shared profile parse",()=>{
 for(const p of Object.values(P).filter(x=>x.endsWith(".js")))new vm.Script(read(p),{filename:p});
 for(const [i,m] of [...read(P.profile).matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())new vm.Script(m[1],{filename:"profile-"+i});
});
function fixture({owner="a",active="a",grade="05",familyIds=["a"],silent=false,record=null,subjectRecord=null}={}){
 const storage=new Map(),family={familyId:"F",learnerIds:familyIds},child={learnerId:owner,familyId:"F",stage:"elementary",grade,nickname:"Synthetic Fifth Grader"};
 const R={activeIds:()=>({learnerId:active,familyId:"F"}),getLearner:()=>child,getFamily:()=>family,normalizeGrade:x=>x,normalizeStage:x=>x};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(!silent)storage.set(k,v)},removeItem:k=>storage.delete(k)};
 if(record)storage.set("khaemenes.course:a:elementary-grade-05",JSON.stringify(record));
 if(subjectRecord)storage.set("khaemenes.course:a:elementary-grade-05-social-studies",JSON.stringify(subjectRecord));
 const w={KhaemenesFamilyRegistry:R,localStorage,addEventListener:()=>{},dispatchEvent:()=>{},CustomEvent:function(){},window:null};w.window=w;
 vm.runInNewContext(read(P.bridge),{window:w,CustomEvent:w.CustomEvent},{timeout:2000});
 vm.runInNewContext(read(P.subject),{window:w,CustomEvent:w.CustomEvent},{timeout:2000});
 vm.runInNewContext(read(P.family),{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 return {w,storage,bridge:w.KhaemenesGrade5Continuity,subject:w.KhaemenesGrade5SubjectContext,view:w.KhaemenesGradeFiveFamilyView};
}
test("Bubble 1: Grade 5 continuity rejects inactive sibling, foreign course state and silent saves",()=>{
 let f=fixture();assert.equal(f.bridge.status().status,"ready");
 assert.equal(f.bridge.writeState({weekly:{1:95}}),true);
 assert.equal(f.bridge.readState({}).weekly[1],95);
 assert.equal(fixture({silent:true}).bridge.writeState({weekly:{1:95}}),false);
 assert.equal(fixture({active:"b"}).bridge.status().status,"no-active-learner");
 assert.equal(fixture({familyIds:[]}).bridge.status().status,"no-active-learner");
 assert.equal(fixture({record:{weekly:{1:100}}}).bridge.readState({safe:true}).safe,true);
 const wrong={format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-05",state:{weekly:{1:100}}};
 assert.equal(fixture({record:wrong}).bridge.readState({safe:true}).safe,true);
});
test("Bubble 2: Grade 5 parent view separates integrated and Social Studies progress",()=>{
 const record={format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-05",state:{weekly:{1:90,2:75},midterm:85,final:0,portfolio:false}};
 const subjectRecord={students:[
  {id:"academy_a",academyLearnerId:"a",weeks:{1:{best:90},2:{best:99},3:{best:76}},exams:{midterm:{best:82},final:{best:0}}},
  {id:"academy_b",academyLearnerId:"b",weeks:{1:{best:100},2:{best:100},3:{best:100}}}
 ],activeId:"academy_b"};
 const f=fixture({record,subjectRecord}),r=f.view.snapshot();
 assert.equal(r.kind,"report");assert.equal(r.mastered,1);assert.equal(r.next,2);assert.equal(r.midterm,true);assert.equal(r.final,false);
 assert.equal(r.subject.mastered,2);assert.equal(r.subject.midterm,true);
 assert.equal(fixture({active:"b",record,subjectRecord}).view.snapshot().kind,"unavailable");
 assert.equal(fixture({record,subjectRecord:{students:[subjectRecord.students[1]]}}).view.snapshot().subject.kind,"pending");
});
test("Bubble 3: Grade 5 profile shows parent overview only to selected Grade 5 family",()=>{
 const html=read(P.profile),view=read(P.family);
 assert.match(html,/id="gradeFiveFamilyOverview"/);assert.match(html,/id="gradeFiveSubjectSummary"/);
 assert.match(html,/khaemenes-grade-five-family-view\.js/);
 assert.equal(fixture({grade:"04"}).view.snapshot().kind,"unavailable");
 assert.equal(fixture({familyIds:[]}).view.snapshot().kind,"unavailable");
 assert.equal(fixture().view.snapshot().kind,"pending");
 assert.doesNotMatch(view,/localStorage\.setItem|\.publish\(/);
});
test("Bubble 4: subject hall, dashboard, exports and portfolio are learner scoped",()=>{
 const subject=read(P.subject),app=read(P.app);
 assert.match(subject,/f\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.equal(fixture({active:"b"}).subject.scopedKey(),null);
 assert.match(app,/\$\("portfolio"\)\.disabled=true/);
 assert.doesNotMatch(app,/state\.portfolio=\$\("portfolio"\)\.checked/);
 assert.match(app,/CONT\.scopedKey\?\.\(\)!=="khaemenes\.course:"\+c\.learner\.learnerId\+":elementary-grade-05"/);
 assert.match(app,/matches=db\.students\.filter\(v=>v\?\.academyLearnerId===c\.learner\.learnerId/);
});
test("Bubble 5: certificate ownership and local credential disclosure",()=>{
 const cert=read(P.certificate);
 assert.match(cert,/raw\.learnerId===l\.learnerId/);
 assert.match(cert,/raw\.courseId==="elementary-grade-05"/);
 assert.match(cert,/s\.portfolio===true/);
 assert.match(cert,/not an official completion credential/);
});
test("Bubble 6: Grade 5 formal and formative engines honor registered ownership and preview isolation",()=>{
 const engine=read(P.engine),ledger=read(P.ledger);
 assert.match(engine,/g==="03"\|\|g==="04"\|\|g==="05"/);
 assert.match(engine,/gradeThreePreview=\(grade\(\)==="03"\|\|grade\(\)==="04"\|\|grade\(\)==="05"\)&&!l/);
 assert.match(ledger,/grade==="03"\|\|grade==="04"\|\|grade==="05"/);
 assert.match(ledger,/record\.grade!==routeGrade\(\)/);
});
