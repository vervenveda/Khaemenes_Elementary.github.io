"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const publisher=fs.readFileSync(path.join(root,"assets/khaemenes-elementary-continuation-publisher.js"),"utf8");
test("Grades 2–5 publish canonical learner-scoped Elementary grade summaries",()=>{
 new vm.Script(publisher,{filename:"elementary-publisher.js"});
 assert.match(publisher,/stage:"elementary",grade:conf\.grade,subject:/);
 assert.match(publisher,/learnerId:ctx\.learner\.learnerId/);
 assert.match(publisher,/learner\.learnerId!==id/);
 assert.match(publisher,/family\.learnerIds\.includes\(id\)/);
 assert.match(publisher,/ctx\.learner\.learnerId!==registered\.learnerId/);
 for(const grade of ["02","03","04","05"]){
  const file=fs.readFileSync(path.join(root,"grades/grade-"+grade+"/index.html"),"utf8");
  assert.match(file,/khaemenes-elementary-continuation-publisher\.js/);
  assert.match(file,/khaemenes-learning-continuation\.js/);
 }
});
test("Grade 1 displays local family selection without exporting legacy scores",()=>{
 const page=fs.readFileSync(path.join(root,"grades/grade-01/index.html"),"utf8");
 assert.match(page,/grade01FamilyReportStatus/);
 assert.match(page,/no grades have been transmitted/);
 assert.match(page,/family\?\.learnerIds\?\.includes\(id\)/);
 assert.doesNotMatch(page,/khaemenes-elementary-continuation-publisher\.js/);
 const blocks=[...page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 blocks.forEach((code,i)=>new vm.Script(code,{filename:"grade01-inline-"+i+".js"}));
});
test("publisher does not overwrite source grades or family records",()=>{
 assert.doesNotMatch(publisher,/\.writeState\s*\(/);
 assert.doesNotMatch(publisher,/\.registerLearner\s*\(/);
 assert.match(publisher,/C\.publish\(\{/);
});
