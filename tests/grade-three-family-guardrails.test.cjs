"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const P={
 bridge:"grades/grade-03/assets/khaemenes-grade3-continuity.js",
 dash:"grades/grade-03/assets/app.js",
 certificate:"grades/grade-03/assets/certificate.js",
 subject:"grades/grade-03/assets/khaemenes-grade3-subject-context.js",
 family:"assets/khaemenes-grade-three-family-view.js",
 profile:"student-profile/index.html"
};
test("all new Grade 3 assets and profile scripts parse",()=>{
 for(const p of Object.values(P).filter(x=>x.endsWith(".js")))new vm.Script(read(p),{filename:p});
 const scripts=[...read(P.profile).matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 scripts.forEach((m,i)=>new vm.Script(m[1],{filename:"profile-inline-"+i}));
});
function fixture({owner="a",active="a",grade="03",familyIds=["a"],silent=false,stored=null,continuation=null}={}){
 const map=new Map(),fam={familyId:"F",learnerIds:familyIds},child={learnerId:owner,familyId:"F",stage:"elementary",grade,nickname:"Synthetic Grade 3"};
 const R={activeIds:()=>({learnerId:active,familyId:"F"}),getLearner:()=>child,getFamily:()=>fam,
 normalizeGrade:x=>x,normalizeStage:x=>x};
 const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>{if(!silent)map.set(k,v)},removeItem:k=>map.delete(k)};
 const key="khaemenes.course:a:elementary-grade-03";if(stored)map.set(key,JSON.stringify(stored));
 const w={KhaemenesFamilyRegistry:R,KhaemenesLearningContinuation:{readCourse:()=>continuation},localStorage:storage,
 addEventListener:()=>{},dispatchEvent:()=>{},CustomEvent:function(){},location:{pathname:"/grades/grade-03/subjects/social-studies/"}};
 w.window=w;
 vm.runInNewContext(read(P.bridge),{window:w,CustomEvent:w.CustomEvent},{timeout:2000});
 vm.runInNewContext(read(P.subject),{window:w,CustomEvent:w.CustomEvent},{timeout:2000});
 vm.runInNewContext(read(P.family),{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 return {w,map,bridge:w.KhaemenesGrade3Continuity,subject:w.KhaemenesGrade3SubjectContext,family:w.KhaemenesGradeThreeFamilyView};
}
test("Bubble 1: continuity is family-scoped and validates stored ownership",()=>{
 let f=fixture();assert.equal(f.bridge.status().status,"ready");
 assert.equal(f.bridge.writeState({weekly:{1:82}}),true);
 assert.equal(f.bridge.readState({}).weekly[1],82);
 assert.equal(fixture({silent:true}).bridge.writeState({weekly:{1:90}}),false);
 assert.equal(fixture({active:"b"}).bridge.status().status,"no-active-learner");
 const evil={format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-03",state:{weekly:{1:100}}};
 assert.equal(fixture({stored:evil}).bridge.readState({fallback:true}).fallback,true);
 assert.equal(fixture({stored:{weekly:{1:100}}}).bridge.readState({fallback:true}).fallback,true);
});
test("Bubble 2: Grade 3 dashboard never mixes legacy records into registered student or preview certificate",()=>{
 const s=read(P.dash);
 assert.match(s,/if\(st\?\.status==="ready"\)/);
 assert.match(s,/return r&&typeof r==="object"&&!Array\.isArray\(r\)\?Object\.assign\(blank\(\),r\):blank\(\)/);
 assert.match(s,/CONT\?\.status\?\.\(\)\.status==='ready'&&done\(\)===36/);
 assert.match(s,/if\(!save\(\)\)/);
 assert.doesNotMatch(s,/else localStorage\.removeItem\(KEY\)/);
});
test("Bubble 3: Grade 3 certificate rejects wrong family, owner, course and unwrapped records",()=>{
 const source=read(P.certificate),key="khaemenes.course:a:elementary-grade-03";
 const learner={learnerId:"a",familyId:"F",stage:"elementary",grade:"03",nickname:"Synthetic"};
 const family={familyId:"F",learnerIds:["a"]},reg={learners:{a:learner},families:{F:family}};
 const map=new Map([["khaemenes_active_learner_v1",JSON.stringify("a")]]);
 const state={weekly:Object.fromEntries(Array.from({length:36},(_,i)=>[i+1,100])),midterm:100,final:100,portfolio:true};
 function render(record,ids=["a"]){family.learnerIds=ids;map.set("khaemenes_family_registry_v1",JSON.stringify(reg));map.set(key,JSON.stringify(record));const out={innerHTML:""};vm.runInNewContext(source,{document:{getElementById:()=>out},localStorage:{getItem:k=>map.get(k)||null}},{timeout:2000});return out.innerHTML}
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-03",state}),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-02",state}),/Certificate Locked/);
 assert.match(render(state),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-03",state},[]),/Certificate Locked/);
 assert.match(render({format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-03",state}),/Certificate of Third Grade Completion/);
});
test("Bubble 4: Grade 3 subject context cannot identify a sibling as active",()=>{
 assert.equal(fixture().subject.status().status,"ready");
 assert.equal(fixture({active:"b"}).subject.status().status,"no-active-learner");
 assert.equal(fixture({familyIds:[]}).subject.scopedKey(),null);
});
test("Bubble 5: grade 3 Family Learning Center panel is learner-owned and read-only",()=>{
 const s=read(P.profile),p=read(P.family);
 assert.match(s,/id="gradeThreeFamilyOverview"/);
 assert.match(s,/khaemenes-grade-three-family-view\.js/);
 assert.doesNotMatch(p,/localStorage\.setItem/);
 assert.doesNotMatch(p,/\.publish\(/);
 assert.equal(fixture({active:"b"}).family.snapshot().kind,"unavailable");
 assert.equal(fixture({grade:"02"}).family.snapshot().kind,"unavailable");
 assert.equal(fixture().family.snapshot().kind,"pending");
 const owned={format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-03",state:{weekly:{1:85,2:100,3:70},midterm:92,final:0,portfolio:false}};
 const result=fixture({stored:owned}).family.snapshot();assert.equal(result.kind,"report");assert.equal(result.completed,2);assert.equal(result.midterm,true);assert.equal(result.final,false);
 const wrong={...owned,learnerId:"b"};assert.equal(fixture({stored:wrong}).family.snapshot().kind,"pending");
});
