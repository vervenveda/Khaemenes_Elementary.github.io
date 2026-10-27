import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

// Guard the existing published Grade 1 curriculum as the source of lesson
// truth. This validator never writes curriculum, scores, or student data.
const script=fs.readFileSync("grades/grade-01/data/curriculum.js","utf8");
const context={window:{}};
vm.runInNewContext(script,context,{filename:"grades/grade-01/data/curriculum.js"});
const course=context.window.KHAEMENES_GRADE01_CURRICULUM;
const mapSource=fs.readFileSync("assets/khaemenes-elementary-focus-map.js","utf8");
const match=mapSource.match(/const data=(\{[\s\S]*?\});\nglobal\.KhaemenesElementaryFocusMap=/);
assert.ok(match,"Unable to parse shared focus-map JSON");
const map=JSON.parse(match[1]);
assert.equal(course.weeks?.length,36,"Official Grade 1 must have 36 weeks");
assert.equal(Object.keys(map["01"]||{}).length,36,"Grade 1 focus map must have 36 entries");
for(const week of course.weeks){
 const n=String(week.week);
 const expected=[week.title,week.essentialQuestion,week.literacy,week.math,week.inquiry,week.sel,week.project].map(x=>String(x||"").trim()).filter(Boolean).join(" · ");
 assert.equal(map["01"][n],expected,"Mentor/assessment focus does not match the lesson-loaded Week "+n);
 assert.equal(week.daily?.length,5,"Grade 1 Week "+n+" must have five daily lessons");
 assert.equal(week.quiz?.length,10,"Grade 1 Week "+n+" authored legacy quiz must keep ten questions");
}
for(const n of [2,3,4,5,6]){
 const week=course.weeks[n-1];
 for(const [i,day] of week.daily.entries()){
   const required=["objective","miniLesson","workedExample","guidedPractice","independentPractice","challenge","studentProduct","checkForUnderstanding","evidence","support","extension","reflection","skill","standard","estimatedMinutes"];
   for(const field of required)assert.ok(String(day[field]||"").trim().length>=12,"Grade 1 Week "+n+", Day "+(i+1)+" missing authored "+field);
 }
}
const companion=fs.readFileSync("grades/grade-01/learning/weeks-01-06-instructional-companion.html","utf8");
for(let n=1;n<=6;n++){
 assert.ok(companion.includes('id="week-'+String(n).padStart(2,"0")+'"'),"Missing week-specific companion section "+n);
 assert.ok(companion.includes(course.weeks[n-1].title),"Companion title diverges in Week "+n);
}
console.log("PASS: Grade 1 36/36 canonical Mentor focuses, 5 daily lessons, 10 reviewed legacy quiz questions, and Weeks 2-6 instructional depth contract.");
