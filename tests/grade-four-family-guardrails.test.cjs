"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),src=p=>fs.readFileSync(path.join(root,p),"utf8");
const P={bridge:"grades/grade-04/assets/khaemenes-grade4-continuity.js",certificate:"grades/grade-04/assets/certificate.js",app:"grades/grade-04/assets/app.js",subject:"grades/grade-04/assets/khaemenes-grade4-subject-context.js",view:"assets/khaemenes-grade-four-family-view.js",data:"grades/grade-04/data/course-data.js",profile:"student-profile/index.html"};
test("Grade 4 JavaScript and shared profile scripts parse",()=>{
 for(const p of Object.values(P).filter(p=>p.endsWith(".js")))new vm.Script(src(p),{filename:p});
 for(const [i,m] of [...src(P.profile).matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())new vm.Script(m[1],{filename:"profile-inline-"+i});
});
function fixture({owner="a",active="a",grade="04",familyIds=["a"],silent=false,record=null}={}){
 const storage=new Map(),family={familyId:"F",learnerIds:familyIds},child={learnerId:owner,familyId:"F",stage:"elementary",grade,nickname:"Synthetic Fourth Grader"};
 const R={activeIds:()=>({familyId:"F",learnerId:active}),getLearner:()=>child,getFamily:()=>family,normalizeGrade:x=>x,normalizeStage:x=>x};
 const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(!silent)storage.set(k,v)},removeItem:k=>storage.delete(k)};
 if(record)storage.set("khaemenes.course:a:elementary-grade-04",JSON.stringify(record));
 const w={KhaemenesFamilyRegistry:R,localStorage,addEventListener:()=>{},dispatchEvent:()=>{},CustomEvent:function(){},window:null};
 w.window=w;
 vm.runInNewContext(src(P.bridge),{window:w,CustomEvent:w.CustomEvent},{timeout:2000});
 vm.runInNewContext(src(P.view),{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 return {w,storage,bridge:w.KhaemenesGrade4Continuity,view:w.KhaemenesGradeFourFamilyView};
}
test("Bubble 1: family-scoped bridge rejects sibling and unwrapped states, validates writes",()=>{
 let f=fixture();assert.equal(f.bridge.status().status,"ready");
 assert.equal(f.bridge.writeState({weekly:{1:95}}),true);
 assert.equal(f.bridge.readState({}).weekly[1],95);
 assert.equal(fixture({silent:true}).bridge.writeState({weekly:{1:98}}),false);
 assert.equal(fixture({active:"b"}).bridge.status().status,"no-active-learner");
 assert.equal(fixture({familyIds:[]}).bridge.status().status,"no-active-learner");
 assert.equal(fixture({record:{weekly:{1:100}}}).bridge.readState({safe:true}).safe,true);
 const foreign={format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-04",state:{weekly:{1:100}}};
 assert.equal(fixture({record:foreign}).bridge.readState({safe:true}).safe,true);
});
test("Bubble 2: certificate requires matching family, learner and wrapped course record",()=>{
 const script=src(P.certificate),weekly=Object.fromEntries(Array.from({length:36},(_,i)=>[i+1,100]));
 const state={weekly,midterm:100,final:100,portfolio:true};
 const learner={learnerId:"a",familyId:"F",grade:"04",stage:"elementary",nickname:"Synthetic"},family={familyId:"F",learnerIds:["a"]};
 const registry={learners:{a:learner},families:{F:family}},map=new Map([["khaemenes_active_learner_v1",JSON.stringify("a")]]);
 function render(record,members=["a"]){family.learnerIds=members;map.set("khaemenes_family_registry_v1",JSON.stringify(registry));map.set("khaemenes.course:a:elementary-grade-04",JSON.stringify(record));const output={innerHTML:""};vm.runInNewContext(script,{document:{getElementById:()=>output},localStorage:{getItem:k=>map.get(k)||null}},{timeout:2000});return output.innerHTML}
 assert.match(render(state),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-04",state}),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-03",state}),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-04",state},[]),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-04",state}),/Certificate of Fourth Grade Completion/);
});
test("Bubble 3: course dashboard fails closed and keeps portfolio review separate",()=>{
 const s=src(P.app);
 assert.match(s,/status\?\.status==="ready"/);
 assert.match(s,/CONT\?\.status\?\.\(\)\.status==="ready"/);
 assert.match(s,/\$\("portfolio"\)\.disabled=true/);
 assert.doesNotMatch(s,/state\.portfolio=\$\("portfolio"\)\.checked/);
 assert.doesNotMatch(s,/else localStorage\.removeItem\(KEY\)/);
 assert.match(s,/const current=CONT\.readState\?\.\(null\)/);
 assert.match(s,/learner:c\.learner,state:current/);
});
test("Bubble 4: Grade 4 subject context verifies owner and family membership",()=>{
 const s=src(P.subject);
 assert.match(s,/l\.learnerId===ids\.learnerId/);
 assert.match(s,/l\.familyId===f\.familyId/);
 assert.match(s,/f\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.match(s,/l\.selfDirectedAdult!==true/);
});
test("Bubble 5: Grade 4 family progress is read-only, learner-owned and accurate",()=>{
 const p=src(P.view),html=src(P.profile);
 assert.match(html,/id="gradeFourFamilyOverview"/);
 assert.match(html,/khaemenes-grade-four-family-view\.js/);
 assert.doesNotMatch(p,/localStorage\.setItem/);
 assert.equal(fixture({active:"b"}).view.snapshot().kind,"unavailable");
 assert.equal(fixture({grade:"03"}).view.snapshot().kind,"unavailable");
 const record={format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-04",state:{weekly:{1:90,2:78,3:95},midterm:84,final:0,portfolio:false}};
 const result=fixture({record}).view.snapshot();assert.equal(result.kind,"report");assert.equal(result.mastered,2);assert.equal(result.next,2);assert.equal(result.midterm,true);assert.equal(result.portfolio,false);
 assert.equal(fixture({record:{...record,learnerId:"b"}}).view.snapshot().kind,"pending");
 const data=src(P.data);assert.match(data,/Each of the 36 weekly assessments at or above 80%/);
});

test("Grade 4 formal assessment checks family membership and rejects foreign academic state",()=>{
 const engine=src("assets/khaemenes-elementary-assessment-engine.js");
 const learner={learnerId:"a",familyId:"F",stage:"elementary",grade:"04"};
 const family={familyId:"F",learnerIds:["a"]},registry={learners:{a:learner},families:{F:family}};
 const map=new Map([["khaemenes_active_learner_v1",JSON.stringify("a")],["khaemenes_family_registry_v1",JSON.stringify(registry)]]);
 const store={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const loc={pathname:"/Khaemenes_Elementary.github.io/grades/grade-04/assessments/week-01-assessment.html"};
 const w={addEventListener:()=>{},CustomEvent:function(){},location:loc};w.window=w;
 const document={readyState:"loading",addEventListener:()=>{},querySelector:()=>null,title:"Grade 4"};
 vm.runInNewContext(engine,{window:w,document,location:loc,localStorage:store,Date,Math,CustomEvent:w.CustomEvent},{timeout:2000});
 const api=w.KhaemenesElementaryAssessmentEngine;
 assert.equal(api.learner().learnerId,"a");
 const key="khaemenes.course:a:elementary-grade-04",state={weekly:{1:100},midterm:100,final:100,portfolio:true};
 map.set(key,JSON.stringify({format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-04",state}));
 assert.equal(api.readFormalState().weekly[1],undefined);
 map.set(key,JSON.stringify({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-04",state}));
 assert.equal(api.readFormalState().weekly[1],100);
 family.learnerIds=[];
 map.set("khaemenes_family_registry_v1",JSON.stringify(registry));
 assert.equal(api.learner(),null);
 assert.equal(api.gate().preview,true);
});
test("Grade 4 formative ledger requires selected family and rejects preview saves",()=>{
 const s=src("assets/khaemenes-elementary-learning-ledger.js");
 assert.match(s,/grade==="03"\|\|grade==="04"\|\|grade==="05"/);
 assert.match(s,/family\?\.learnerIds\?\.includes\(id\)/);
 assert.match(s,/\(routeGrade\(\)==="03"\|\|routeGrade\(\)==="04"\)&&id==="preview"/);
 assert.match(s,/record\.grade!==routeGrade\(\)/);
 assert.match(s,/activeLearner\(\)\?\.learnerId!==initialLearnerId/);
});
