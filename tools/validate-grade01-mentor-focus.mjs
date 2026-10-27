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
// A learner must be assessed on more than recycled general questions.
const authoredPrompts=new Set();
for(const week of course.weeks.slice(0,6)){
 assert.equal(week.quiz.length,10,"Week "+week.week+" needs ten authored questions");
 for(const [i,q] of week.quiz.entries()){
  assert.ok(typeof q.prompt==="string"&&q.prompt.length>=30,"Insufficient authored question Week "+week.week+" #"+(i+1));
  assert.ok(!authoredPrompts.has(q.prompt),"Repeated generic question across Weeks 01–06: "+q.prompt);
  authoredPrompts.add(q.prompt);
  assert.equal(q.choices.length,4,"Four answer options required");
  assert.equal(new Set(q.choices).size,4,"Duplicate answer option in Week "+week.week);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,"Invalid answer index");
 }
}
assert.equal(authoredPrompts.size,60,"The first six weekly banks must have 60 distinct prompts");
for(const n of [2,3,4,5,6]){
 const week=course.weeks[n-1];
 for(const [i,day] of week.daily.entries()){
   const required=["objective","miniLesson","workedExample","guidedPractice","independentPractice","challenge","studentProduct","checkForUnderstanding","evidence","support","extension","reflection","skill","standard"];
   for(const field of required)assert.ok(String(day[field]||"").trim().length>=12,"Grade 1 Week "+n+", Day "+(i+1)+" missing authored "+field);
   assert.ok(Number(day.estimatedMinutes)>=15&&Number(day.estimatedMinutes)<=120,"Grade 1 daily lesson time must be reasonable");
 }
}
const companion=fs.readFileSync("grades/grade-01/learning/weeks-01-06-instructional-companion.html","utf8");
for(let n=1;n<=6;n++){
 assert.ok(companion.includes('id="week-'+String(n).padStart(2,"0")+'"'),"Missing week-specific companion section "+n);
 assert.ok(companion.includes(course.weeks[n-1].title),"Companion title diverges in Week "+n);
}
console.log("PASS: Grade 1 36/36 canonical Mentor focuses, 25 authored daily lessons, 60 unique first-six-week questions, and rubric/evidence boundaries.");
