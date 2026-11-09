"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),src=p=>fs.readFileSync(path.join(root,p),"utf8");
const files={ledger:"assets/khaemenes-elementary-learning-ledger.js",engine:"assets/khaemenes-elementary-assessment-engine.js",app:"grades/grade-03/assets/app.js",family:"assets/khaemenes-grade-three-family-view.js"};
for(const [name,p] of Object.entries(files))test(name+" script parses",()=>new vm.Script(src(p)));
test("Bubble 1 — Grade 3 formative work requires initiating learner and strict saved-record owner",()=>{
 const s=src(files.ledger);
 assert.match(s,/const initialLearnerId=activeLearner\(\)\?\.learnerId\|\|null/);
 assert.match(s,/activeLearner\(\)\?\.learnerId!==initialLearnerId/);
 assert.match(s,/record\?\.learnerId!==id\|\|record\.grade!=="03"\|\|record\.preview!==false/);
});
test("Bubble 2 — ordinary Grade 3 student-profile save cannot change portfolio review approval",()=>{
 const s=src(files.app);
 assert.match(s,/\$\('portfolio'\)\.disabled=true/);
 assert.match(s,/Preserve portfolio approval/);
 assert.doesNotMatch(s,/state\.portfolio=\$\('portfolio'\)\.checked/);
 assert.match(s,/state\.portfolio===true/);
});
test("Bubble 3 — Grade 3 preview assessments are not stored as formal attempt history",()=>{
 const s=src(files.engine);
 assert.match(s,/gradeThreePreview=grade\(\)==="03"&&!l/);
 assert.match(s,/attemptSaved=gradeThreePreview\?false:appendAttempt\(snapshot\)/);
 assert.match(s,/!l\?"Practice completed"/);
 assert.match(s,/score>=PASS&&formallySaved/);
});
test("Bubble 4 — Grade 3 export must use registered live learner and verified course state",()=>{
 const s=src(files.app);
 assert.match(s,/c\?\.status!=='ready'/);
 assert.match(s,/CONT\.scopedKey\?\.\(\)!=="khaemenes\.course:"\+c\.learner\.learnerId\+":elementary-grade-03"/);
 assert.match(s,/const latest=CONT\.readState\?\.\(null\)/);
 assert.match(s,/learner:c\.learner,state:latest/);
});
test("Bubble 5 — family view uses local verified count before stale continuation",()=>{
 const s=src(files.family);
 assert.match(s,/const completed=state\?count\(state\):publishedCount/);
 assert.match(s,/completed!==publishedCount/);
 assert.match(s,/Boolean\(differs\)/);
 const owned={format:"khaemenes-course-state-v1",learnerId:"child-a",courseId:"elementary-grade-03",state:{weekly:{1:98,2:90}}};
 const records=new Map([["khaemenes.course:child-a:elementary-grade-03",JSON.stringify(owned)]]);
 const learner={learnerId:"child-a",familyId:"fam",grade:"03",stage:"elementary"};
 const family={familyId:"fam",learnerIds:["child-a"]};
 const w={KhaemenesFamilyRegistry:{activeIds:()=>({learnerId:"child-a",familyId:"fam"}),getLearner:()=>learner,getFamily:()=>family},
 KhaemenesLearningContinuation:{readCourse:()=>({learnerId:"child-a",courseId:"elementary-grade-03",grade:"03",stage:"elementary",progress:{completed:9},nextTitle:"Week 10"})},
 localStorage:{getItem:k=>records.get(k)||null},addEventListener:()=>{}};
 w.window=w;
 vm.runInNewContext(s,{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 const result=w.KhaemenesGradeThreeFamilyView.snapshot();
 assert.equal(result.completed,2);
 assert.equal(result.stale,true);
});
