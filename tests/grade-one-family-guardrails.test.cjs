"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,"..");
function source(p){return fs.readFileSync(path.join(root,p),"utf8")}
const profile=source("student-profile/index.html");
const legacy=source("grades/grade-01/assets/khaemenes-grade1-continuity.js");
const view=source("assets/khaemenes-grade-one-family-view.js");
test("First Grade legacy browser-wide scores are never silently attached to whichever child is selected",()=>{
 new vm.Script(legacy);
 assert.match(legacy,/function migrateLegacy\(\)\{/);
 assert.match(legacy,/legacy-ownership-unverified/);
 assert.match(legacy,/function syncFromLegacy\(\)\{\s*return false/);
 assert.doesNotMatch(legacy,/writeJSON\(courseKey,/);
 assert.doesNotMatch(legacy,/writeJSON\(favoritesKey,/);
 assert.doesNotMatch(legacy,/beforeunload/);
 assert.doesNotMatch(legacy,/migrateLegacy\(\);\s*const sync/);
});
test("Grade 1 family status is read-only with an explicit incomplete-academic-data notice",()=>{
 assert.match(profile,/id="gradeOneFamilyOverview"/);
 assert.match(profile,/khaemenes-grade-one-family-view\.js/);
 assert.match(profile,/Historical Grade 1 academic scores are not assigned/);
 assert.match(view,/learner\.stage==="elementary"&&child\.grade==="01"|child\.stage==="elementary"&&child\.grade==="01"/);
 assert.match(view,/family\.learnerIds\?\.includes\(child\.learnerId\)/);
 assert.doesNotMatch(view,/localStorage\.setItem/);
 assert.doesNotMatch(view,/\.publish\s*\(/);
 new vm.Script(view);
 const scripts=[...profile.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 scripts.forEach((script,i)=>new vm.Script(script,{filename:"elementary-profile-inline-"+i+".js"}));
});
test("Shared Grades 1–5 profile rejects foreign children and wrong-learner continuation",()=>{
 assert.match(profile,/child\.learnerId===ids\.learnerId/);
 assert.match(profile,/child\.familyId===family\.familyId/);
 assert.match(profile,/child\.selfDirectedAdult!==true/);
 assert.match(profile,/family\.learnerIds\?\.includes\(child\.learnerId\)/);
 assert.match(profile,/x\?\.learnerId!==activeId/);
 assert.match(profile,/family\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.match(profile,/localStorage\.getItem\(k\)===raw/);
});
function mock({activeId="child-a",owner="child-a",grade="01"}={}){
 const family={familyId:"fam-1",learnerIds:["child-a"]},child={learnerId:owner,familyId:"fam-1",stage:"elementary",grade,nickname:"Fictional learner"};
 const w={KhaemenesFamilyRegistry:{activeIds:()=>({familyId:"fam-1",learnerId:activeId}),getLearner:()=>child,getFamily:()=>family},addEventListener:()=>{}};
 w.window=w;
 vm.runInNewContext(view,{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 return w.KhaemenesGradeOneFamilyView.read();
}
test("Synthetic family: only selected and linked Grade 01 learner is visible",()=>{
 assert.equal(mock().kind,"linked");
 assert.equal(mock({activeId:"child-b"}).kind,"unavailable");
 assert.equal(mock({owner:"child-b"}).kind,"unavailable");
 assert.equal(mock({grade:"02"}).kind,"unavailable");
});
