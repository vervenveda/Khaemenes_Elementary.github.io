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
  assert.ok(typeof q.prompt==="string"&&q.prompt.length>=18,"Insufficient authored question Week "+week.week+" #"+(i+1));
  assert.ok(!authoredPrompts.has(q.prompt),"Repeated generic question across Weeks 01–06: "+q.prompt);
  authoredPrompts.add(q.prompt);
  assert.equal(q.choices.length,4,"Four answer options required");
  assert.equal(new Set(q.choices).size,4,"Duplicate answer option in Week "+week.week);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,"Invalid answer index");
 }
}
assert.equal(authoredPrompts.size,60,"The first six weekly banks must have 60 distinct prompts");
// Verify delivered assessment forms, not only the 32-question candidate pool.
const factoryCode=fs.readFileSync("assets/khaemenes-elementary-question-factory.js","utf8");
context.KHAEMENES_GRADE01_CURRICULUM=course;
vm.runInNewContext(factoryCode,context,{filename:"assets/khaemenes-elementary-question-factory.js"});
const factory=context.KhaemenesElementaryQuestionFactory;
assert.ok(factory?.makeBalanced&&factory?.validateQuestion,"Missing canonical question factory");
for(let n=1;n<=6;n++){
 const focus=map["01"][String(n)];
 for(let seed=1;seed<=16;seed++){
  const questions=factory.makeBalanced({grade:1,focus,seed:"grade01-"+n+"-"+seed,count:32,includeLegacy:true,scope:"weekly",week:n});
  assert.equal(questions.length,32,"Grade 1 weekly randomized candidate pool must contain 32 questions");
  const delivered=questions.slice(0,12);
  assert.equal(delivered.length,12,"Grade 1 weekly quiz must deliver 12 questions");
  assert.equal(delivered.filter(q=>String(q.id).startsWith("g1-weekly-"+n+"-")).length,8,"Week "+n+" failed eight authored delivered questions");
  assert.equal(new Set(delivered.map(q=>q.prompt)).size,12,"Duplicate visible question in Week "+n);
  for(const item of delivered)assert.ok(factory.validateQuestion(item),"Invalid delivered question Week "+n);
 }
}
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
const htmlEsc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
for(let n=2;n<=6;n++){
 const week=course.weeks[n-1];
 const packet=fs.readFileSync("grades/grade-01/printables/unit-"+String(n).padStart(2,"0")+"-packet.html","utf8");
 assert.ok(packet.includes(week.title),"Week "+n+" packet has an obsolete title");
 assert.ok(packet.includes('data-khae-evidence-header="v1"'),"Evidence header missing Week "+n);
 assert.ok(packet.includes("Five-day evidence prompts"),"Daily prompts missing Week "+n);
 for(const day of week.daily){
   for(const field of ["focus","objective","independentPractice","evidence"]){
     const canonical=htmlEsc(day[field]);
     assert.ok(packet.includes(canonical),"Packet Week "+n+" does not match canonical "+field+" for "+day.day);
   }
 }
}
console.log("PASS: Grade 1 36/36 canonical Mentor focuses, 25 authored daily lessons, 60 unique first-six-week questions, 96 randomized 8/4 delivered-form checks, aligned printables and rubric/evidence boundaries.");
