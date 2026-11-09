"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const source=name=>fs.readFileSync(path.resolve(__dirname,"..",name),"utf8");
const bridge=source("grades/grade-02/assets/khaemenes-grade2-continuity.js");
const panel=source("assets/khaemenes-grade-two-family-view.js");
const html=source("student-profile/index.html");
function fake({active="a",owner="a",grade="02",stored=null,continuation=null,silent=false}={}){
 const records=new Map(),family={familyId:"F",learnerIds:["a"]};
 const child={learnerId:owner,familyId:"F",stage:"elementary",grade,nickname:"Fictional Child"};
 const R={activeIds:()=>({familyId:"F",learnerId:active}),getLearner:()=>child,getFamily:()=>family,
   normalizeGrade:v=>v,normalizeStage:v=>v};
 const storage={getItem:key=>records.has(key)?records.get(key):null,
 setItem:(key,value)=>{if(!silent)records.set(key,value)},removeItem:key=>records.delete(key)};
 if(stored)records.set("khaemenes.course:a:elementary-grade-02",JSON.stringify(stored));
 const w={KhaemenesFamilyRegistry:R,KhaemenesLearningContinuation:{readCourse:()=>continuation},
 localStorage:storage,addEventListener:()=>{},dispatchEvent:()=>{},CustomEvent:function(){},window:null};
 w.window=w;
 vm.runInNewContext(bridge,{window:w,CustomEvent:w.CustomEvent,Date,Object,String,JSON},{timeout:2000});
 vm.runInNewContext(panel,{window:w,document:{readyState:"loading",addEventListener:()=>{}},Date,Object,String,JSON,Number},{timeout:2000});
 return {w,records,bridge:w.KhaemenesGrade2Continuity,panel:w.KhaemenesGradeTwoFamilyView};
}
test("Grade 2 bridge enforces registered family and confirms writes",()=>{
 new vm.Script(bridge);
 assert.match(bridge,/family\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.match(bridge,/global\.localStorage\.getItem\(key\)===raw/);
 let ctx=fake();assert.equal(ctx.bridge.status().status,"ready");
 assert.equal(ctx.bridge.writeState({weekly:{1:95}}),true);
 assert.equal(ctx.bridge.readState({}).weekly[1],95);
 assert.equal(fake({silent:true}).bridge.writeState({weekly:{1:90}}),false);
 assert.equal(fake({active:"b"}).bridge.status().status,"no-active-learner");
});
test("Grade 2 rejects foreign and legacy-wrapped academic states",()=>{
 let ctx=fake({stored:{format:"khaemenes-course-state-v1",learnerId:"b",courseId:"elementary-grade-02",state:{weekly:{1:100}}}});
 assert.equal(ctx.bridge.readState({safe:true}).safe,true);
 ctx=fake({stored:{format:"khaemenes-course-state-v1",learnerId:"a",courseId:"elementary-grade-03",state:{weekly:{1:100}}}});
 assert.equal(ctx.bridge.readState({safe:true}).safe,true);
 ctx=fake({stored:{weekly:{1:100}}});
 assert.equal(ctx.bridge.readState({safe:true}).safe,true);
});
test("Grade 2 clear never deletes browser-wide guest or legacy preview",()=>{
 const ctx=fake();ctx.records.set("khaemenes_grade2_subject_36_aplus_v1",'{"preview":true}');
 ctx.bridge.clearState();
 assert.equal(ctx.records.has("khaemenes_grade2_subject_36_aplus_v1"),true);
 const other=fake({active:"b"});other.records.set("khaemenes_grade2_subject_36_aplus_v1","SAVED");
 other.bridge.clearState();
 assert.equal(other.records.get("khaemenes_grade2_subject_36_aplus_v1"),"SAVED");
});
test("Grade 2 family view rejects sibling reports and shows verified activity",()=>{
 let c=fake({continuation:{learnerId:"b",courseId:"elementary-grade-02",stage:"elementary",grade:"02",progress:{completed:33}}});
 assert.equal(c.panel.snapshot().kind,"pending");
 c=fake({continuation:{learnerId:"a",courseId:"elementary-grade-02",stage:"elementary",grade:"02",progress:{completed:6},nextTitle:"Week 07",family:{needsAction:true}}});
 const result=c.panel.snapshot();assert.equal(result.kind,"report");assert.equal(result.completed,6);
 assert.equal(result.next,"Week 07");assert.equal(result.familyAttention,true);
 assert.equal(fake({grade:"03"}).panel.snapshot().kind,"unavailable");
});
test("Grade 2 full profile uses a dedicated learner-scoped panel without modifying academic scores",()=>{
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 scripts.forEach((s,i)=>new vm.Script(s[1],{filename:"elementary-profile-"+i}));
 new vm.Script(panel);
 assert.match(html,/id="gradeTwoFamilyOverview"/);
 assert.match(html,/khaemenes-grade-two-family-view\.js/);
 assert.match(panel,/record\.learnerId!==learnerId/);
 assert.doesNotMatch(panel,/\.publish\(/);
 assert.doesNotMatch(panel,/localStorage\.setItem\(/);
});
