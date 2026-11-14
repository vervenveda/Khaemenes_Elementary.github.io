"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const P={
  social:"grades/grade-04/subjects/social-studies/app.js",
  teacher:"grades/grade-04/subjects/social-studies/teacher.html",
  family:"assets/khaemenes-grade-four-family-view.js",
  profile:"student-profile/index.html",
  grade:"grades/grade-04/assets/app.js",
  certificate:"grades/grade-04/assets/certificate.js",
  assessment:"assets/khaemenes-elementary-assessment-engine.js",
};
test("All changed runtime JavaScript parses",()=>{
 for(const k of ["social","family","grade","certificate","assessment"])new vm.Script(read(P[k]),{filename:P[k]});
 const html=read(P.teacher);for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries())new vm.Script(m[1],{filename:"teacher-"+i});
});
test("Bubble 1: Social Studies fails closed for mismatched account and verifies writes",()=>{
 const s=read(P.social);
 assert.match(s,/st\?\.status==="ready"\?SUB\.scopedKey\?\.\(\):st\?\.status==="no-active-learner"\?M\.storageKey:null/);
 assert.match(s,/if\(!current\|\|current!==dbKey\)return false/);
 assert.match(s,/localStorage\.getItem\(current\)===raw/);
 assert.match(s,/if\(key\(\)!==dbKey\)\{db=read\(\);form=null;\}/);
});
test("Bubble 2: Social Studies assessments must retain owner key and confirmed storage",()=>{
 const s=read(P.social);
 assert.match(s,/ownerKey:key\(\),questions:draw\(/);
 assert.match(s,/ownerKey:key\(\),questions:drawStratified\(/);
 assert.match(s,/form\.ownerKey!==key\(\)\|\|form\.ownerKey!==dbKey/);
 assert.match(s,/if\(!save\(\)\)\{db=read\(\);form=null/);
});
test("Bubble 3: verified subject course progress is independent of grade-wide mastery",()=>{
 const view=read(P.family),html=read(P.profile);
 assert.match(html,/id="gradeFourSubjectSummary"/);
 assert.match(html,/grades\/grade-04\/subjects\/social-studies/);
 assert.match(view,/elementary-grade-04-social-studies/);
 assert.match(view,/s\?\.academyLearnerId===learnerId&&s\.id==="academy_"\+learnerId/);
 const child={learnerId:"student-a",familyId:"family-a",grade:"04",stage:"elementary",nickname:"Test Student"};
 const family={familyId:"family-a",learnerIds:["student-a"]};
 const storage=new Map(),courseKey="khaemenes.course:student-a:elementary-grade-04",
 subjectKey=courseKey+"-social-studies";
 const state={weekly:{1:92,2:75},midterm:0,final:0,portfolio:false};
 storage.set(courseKey,JSON.stringify({format:"khaemenes-course-state-v1",learnerId:"student-a",courseId:"elementary-grade-04",state}));
 storage.set(subjectKey,JSON.stringify({students:[
  {id:"academy_student-a",academyLearnerId:"student-a",weeks:{1:{best:100},2:{best:95},3:{best:79}},exams:{midterm:{best:82},final:{best:0}}},
  {id:"academy_student-b",academyLearnerId:"student-b",weeks:{1:{best:100},2:{best:100},3:{best:100}}}
 ],activeId:"academy_student-a"}));
 const w={KhaemenesFamilyRegistry:{activeIds:()=>({familyId:"family-a",learnerId:"student-a"}),getLearner:()=>child,getFamily:()=>family},
  localStorage:{getItem:k=>storage.get(k)||null},addEventListener:()=>{}};w.window=w;
 vm.runInNewContext(view,{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 const result=w.KhaemenesGradeFourFamilyView.snapshot();
 assert.equal(result.kind,"report");assert.equal(result.mastered,1);
 assert.equal(result.socialStudies.mastered,2);assert.equal(result.socialStudies.midterm,true);
 storage.set(subjectKey,JSON.stringify({students:[{id:"academy_student-b",academyLearnerId:"student-b",weeks:{1:{best:100}}}]}));
 assert.equal(w.KhaemenesGradeFourFamilyView.snapshot().socialStudies.kind,"pending");
});
test("Bubble 4: unauthenticated teacher convenience page cannot edit registered records",()=>{
 const s=read(P.teacher);
 assert.match(s,/academy\(\)\?\.status!=="no-active-learner"/);
 assert.match(s,/Registered academic records require verified adult authorization/);
 assert.match(s,/function key\(\)\{return academy\(\)\?\.status==="no-active-learner"\?M\.storageKey:null\}/);
 assert.match(s,/if\(!k\)return false/);
});
test("Bubble 5: Grade 4 preview remains practice, not recorded mastery",()=>{
 const s=read(P.assessment);
 assert.match(s,/gradeThreePreview=\(grade\(\)==="03"\|\|grade\(\)==="04"\|\|grade\(\)==="05"\)&&!l/);
 assert.match(s,/attemptSaved=gradeThreePreview\?false:appendAttempt\(snapshot\)/);
 assert.match(s,/!l\?"Practice completed"/);
});
test("Bubble 6: certificate labels local record and dashboard directs learner to next activity",()=>{
 const cert=read(P.certificate),app=read(P.grade);
 assert.match(cert,/not been independently authenticated/);
 assert.match(cert,/not an official completion credential/);
 assert.match(app,/id="grade4NextStep"/);
 for(const route of ["weekly-plans/week-","printables/week-","assessments/week-","assessments/midterm.html","assessments/final-exam.html","records/certificate.html","student-profile/"])assert.ok(app.includes(route),route);
 assert.match(app,/Local Gates Complete/);
});
test("Grade 4 topology includes 36 week plans, 36 packets, 36 assessments and 8 halls",()=>{
 const base=path.join(root,"grades/grade-04");
 for(let w=1;w<=36;w++){
  const number=String(w).padStart(2,"0");
  for(const rel of ["weekly-plans/week-"+number+".html","printables/week-"+number+"-packet.html","assessments/week-"+number+"-assessment.html"])
   assert.ok(fs.existsSync(path.join(base,rel)),"Missing "+rel);
 }
 const dataSrc=read("grades/grade-04/data/course-data.js"),v={window:{}};
 vm.runInNewContext(dataSrc,v);
 const d=v.window.KHAE_GRADE4_DATA;
 assert.equal(d.subjects.length,8);assert.equal(d.weeks.length,36);
 for(const sub of d.subjects)assert.ok(fs.existsSync(path.join(base,"subjects",sub.id,"index.html")),"Missing "+sub.id);
});
