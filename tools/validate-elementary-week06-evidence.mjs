import assert from "node:assert/strict";import fs from "node:fs";
const names=g=>["language-arts","mathematics","science","arts-music","health-pe-sel","integrated-projects",g==="02"?"technology":"technology-tools"];
let count=0;
for(const g of ["02","03","04","05"])for(const subject of names(g)){
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`,html=fs.readFileSync(file,"utf8");
 assert(html.includes("Evidence Studio"),file+" missing original Week 6 studio");
 assert((html.match(/<article class=['"]lesson['"]/g)||[]).length>=5,file+" missing established daily lessons");
 assert(!html.includes("Worked Example · Week 06"),file+" has a duplicate evidence studio");
 count++;
}
const check=(g,id,phrases)=>{const h=fs.readFileSync(`grades/grade-${g}/subjects/${id}/week-06.html`,"utf8");for(const p of phrases)assert(h.includes(p),`Incorrect Grade ${g} ${id} Week 6 focus: ${p}`)};
check("04","mathematics",["84 ÷ 7 = 12","7 × 12 = 84"]);
check("05","mathematics",["53 ÷ 8 = 6 remainder 5","seven vans"]);
check("03","science",["Fossils preserve evidence","fossil impressions"]);
check("04","science",["Erosion moves","erosion and deposition"]);
check("05","science",["water is distributed","water-reservoir diagram"]);
check("02","arts-music",["Scientific illustrators draw","clap | rest | clap | tap","three accurate labels"]);
check("03","health-pe-sel",["Four learners plan","seated marching","water/rest break"]);
check("04","technology-tools",["84 ÷ 6 = 14","horizontal axis","7 × 12 = 84"]);
check("05","integrated-projects",["53 ÷ 8 = 6 remainder 5","7 trays","6 × 8 + 5 = 53"]);
check("02","integrated-projects",["9 − 6 = 3 cm","observation from inference","Challenge:"]);
check("03","integrated-projects",["24 ÷ 6 = 4","26 = 6 × 4 + 2","multiplication check"]);
check("05","technology-tools",["137 ÷ 12 = 11 remainder 5","95 = 8 × 11 + 7","capacity-12 boxes"]);
for(const [g,subject] of [["02","integrated-projects"],["03","integrated-projects"],["05","technology-tools"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`, h=fs.readFileSync(file,"utf8");
 for(const marker of ["Essential question:","Worked model:","Guided","Independent","Challenge:","Evidence"])
  assert(h.includes(marker),file+" missing instructional depth: "+marker);
}
for(const [g,subject] of [["02","health-pe-sel"],["02","technology"],["03","arts-music"],["03","technology-tools"],["04","arts-music"],["04","health-pe-sel"],["04","integrated-projects"],["05","arts-music"],["05","health-pe-sel"]]) {
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`, h=fs.readFileSync(file,"utf8");
 for(const marker of ["Worked model:","Independent practice:","Challenge and revision:","Evidence and reflection:"])
  assert(h.includes(marker),file+" missing depth marker "+marker);
}
for(const [g,subject] of [["02","technology"],["03","technology-tools"],["04","integrated-projects"],["05","arts-music"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`,html=fs.readFileSync(file,"utf8");
 for(let day=1;day<=5;day++)assert(html.includes("Depth Lab · Day "+day),file+" missing daily instructional lab "+day);
 assert((html.match(/Reasoning check:/g)||[]).length===5,file+" lacks five daily reasoning checks");
}
for(const g of ["02","03","04","05"])for(const subject of ["mathematics","language-arts","science"]){
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`,html=fs.readFileSync(file,"utf8");
 for(let day=1;day<=5;day++)assert(html.includes("Academic Depth Lab · Day "+day),file+" missing academic daily depth "+day);
 assert((html.match(/Explain and revise:/g)||[]).length===5,file+" missing academic reasoning checks");
}
for(const g of ["02","03","04","05"]){
 const file=`grades/grade-${g}/subjects/social-studies/index.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(/aria-label="Week 06 civic reasoning"/g)||[]).length===1,file+" must retain one canonical civic studio");
 assert((html.match(/Week 06 · Five-day inquiry and evidence lab/g)||[]).length===1,file+" missing Week 6 inquiry sequence");
 for(const marker of ["Monday · Source reading","Tuesday · Guided comparison","Wednesday · Evidence investigation","Thursday · Challenge and critique","Friday · Civic defense and revision","Official weekly mastery"])
  assert(html.includes(marker),file+" missing civic reasoning component "+marker);
 const redirect=fs.readFileSync(`grades/grade-${g}/subjects/social-studies/week-06.html`,"utf8");
 assert(redirect.includes("index.html?week=6"),file+" missing canonical Week 6 redirect");
}
for(const g of ["02","03","04","05"])for(const subject of ["arts-music","health-pe-sel","integrated-projects",g==="02"?"technology":"technology-tools"]){
 const file=`grades/grade-${g}/subjects/${subject}/week-06.html`,h=fs.readFileSync(file,"utf8");
 for(let day=1;day<=5;day++)assert(h.includes("Depth Lab · Day "+day),file+" missing daily practical depth lab "+day);
 assert((h.match(/Reasoning check:/g)||[]).length===5,file+" missing five reasoning checks");
 assert((h.match(/<article class=['"]lesson['"]/g)||[]).length===5,file+" altered original daily lesson count");
}
// Release hardening: verify local learner-facing navigation and script dependencies.
import path from "node:path";
for(const g of ["02","03","04","05"]){
 const subjects=names(g);
 for(const subject of subjects){
  const isCivic=subject==="social-studies";
  const file=isCivic?`grades/grade-${g}/subjects/social-studies/index.html`:`grades/grade-${g}/subjects/${subject}/week-06.html`;
  const html=fs.readFileSync(file,"utf8");
  for(const match of html.matchAll(/<(?:a|script|link)\\b[^>]*?\\b(?:href|src)=["']([^"']+)["']/gi)){
   const ref=match[1].trim();
   if(!ref||ref.startsWith("#")||/^(?:https?:|mailto:|tel:|data:|javascript:|\/)/i.test(ref))continue;
   const target=decodeURIComponent(ref.split(/[?#]/)[0]);
   if(!target)continue;
   const resolved=path.resolve(path.dirname(file),target);
   assert(fs.existsSync(resolved),file+" broken local navigation/resource: "+ref);
  }
  if(!isCivic){
   for(const asset of ["khaemenes-elementary-focus-map.js","khaemenes-elementary-question-factory.js","khaemenes-elementary-learning-ledger.js"])
    assert(html.includes(asset),file+" missing learning-engine asset "+asset);
  }
 }
}
for(const g of ["02","03","04","05"]){
 const file=`grades/grade-${g}/subjects/mathematics/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(/<article class=['"]lesson['"]/g)||[]).length===5,file+" missing original five lessons");
 for(let day=1;day<=5;day++)assert(html.includes("Week 07 Mathematics Depth Lab · Day "+day),file+" missing instructional day "+day);
 assert((html.match(/Proof and revision:/g)||[]).length===5,file+" missing five reasoning checks");
}
for(const g of ["02","03","04","05"])for(const subject of ["language-arts","science"]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(/<article class=['"]lesson['"]/g)||[]).length===5,file+" must keep five daily lessons");
 for(let day=1;day<=5;day++)assert(html.includes("Week 07 Academic Depth Lab · Day "+day),file+" missing day "+day);
 assert((html.match(/Evidence and revision:/g)||[]).length===5,file+" missing daily evidence checks");
}
// Week 7: all practical and creative daily labs plus canonical civic studios.
for(const g of ["02","03","04","05"]){
 for(const subject of ["arts-music","health-pe-sel","integrated-projects",g==="02"?"technology":"technology-tools"]){
  const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
  assert((html.match(/<article class=['"]lesson['"]/g)||[]).length===5,file+" changed the original lesson structure");
  for(let day=1;day<=5;day++)assert(html.includes("Week 07 Practical Depth Lab · Day "+day),file+" missing practical depth day "+day);
  assert((html.match(/Evidence and revision check:/g)||[]).length===5,file+" missing evidence and revision checks");
 }
 const file=`grades/grade-${g}/subjects/social-studies/index.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(/aria-label="Week 07 civic reasoning"/g)||[]).length===1,file+" missing unique Week 7 civic studio");
 for(const label of ["Monday · Read and question","Tuesday · Compare evidence","Wednesday · Research and model","Thursday · Challenge and revise","Friday · Defend with evidence"])
  assert(html.includes(label),file+" missing civic activity "+label);
}
// Week 7 release audit: check local lesson navigation, resources and assessment routes.
for(const g of ["02","03","04","05"]){
 const assessment=`grades/grade-${g}/assessments/week-07-assessment.html`;
 assert(fs.existsSync(assessment),assessment+" is missing");
 for(const subject of names(g)){
  const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
  for(const match of html.matchAll(/<(?:a|link|script)\\b[^>]*?\\b(?:href|src)=["']([^"']+)["']/gi)){
   const ref=match[1].trim();
   if(!ref||/^(?:#|https?:|mailto:|tel:|data:|javascript:|\/)/i.test(ref))continue;
   const relative=decodeURIComponent(ref.split(/[?#]/)[0]);
   if(!relative)continue;
   const resolved=path.resolve(path.dirname(file),relative);
   assert(fs.existsSync(resolved),file+" broken Week 7 local reference: "+ref);
  }
  for(const asset of ["khaemenes-elementary-focus-map.js","khaemenes-elementary-question-factory.js","khaemenes-elementary-learning-ledger.js"])
   assert(html.includes(asset),file+" missing instructional engine script "+asset);
 }
}
// Week 7 forensic five-bubble first-batch alignment certification.
for(const [g,subject,topic] of [["05","mathematics","equivalent fractions and unlike denominators"],["04","science","fair testing, variables and evidence"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert(!html.includes("Focus:</strong> geometry classification") || subject!=="mathematics",file+" still declares unrelated geometry focus");
 assert(!html.includes("Focus:</strong> fossil evidence") || subject!=="science",file+" still declares unrelated fossil focus");
 assert((html.match(new RegExp(topic,"g"))||[]).length>=5,file+" instructional focus missing");
 assert((html.match(/Teacher worked example · [1-5]:/g)||[]).length===5,file+" missing worked models");
}
for(const subject of ["health-pe-sel","technology","arts-music"]){
 const file=`grades/grade-02/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 for(let day=1;day<=5;day++)assert(html.includes("Assessment-aligned guided teaching · Day "+day),file+" missing assessed focus on day "+day);
}
// Week 7 assessment companion guidance must not replace the official scored rubric.
for(const [g,examples] of [["03",["30, 45 and 40 cm","friction"]],["04",["95 = 8 × 11 + 7","controlled variables"]],["05",["1/2 + 1/3 = 5/6","5/6 L"]]]){
 const file=`grades/grade-${g}/assessments/week-07-assessment.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(/aria-label="Week 07 supplemental evidence guide"/g)||[]).length===1,file+" missing single companion guide");
 for(const phrase of examples)assert(html.includes(phrase),file+" missing Week 7 evidence example "+phrase);
 assert(html.includes("80%"),file+" missing official mastery reference");
 assert(html.includes("<table"),file+" missing scored assessment rubric");
}
// Week 7 subject coherence and exact mathematical model checks.
for(const [g,subject,focus] of [["03","mathematics","ramp-distance data, graph scales and range"],["03","science","forces, friction and controlled motion tests"],["04","mathematics","long division, estimates and remainder decisions"],["05","science","liquid-volume measurement and evidence"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(new RegExp("Focus:</strong> "+focus,"g"))||[]).length===5,file+" has inconsistent daily focus");
}
for(const [g,subject,phrases] of [["03","mathematics",["30, 45, 40 cm","15 cm range"]],["04","mathematics",["95 ÷ 8 = 11 remainder 7","12 × 12 + 2 = 146"]],["05","mathematics",["1/2 + 1/3 = 5/6","3/4 − 1/6 = 9/12 − 2/12 = 7/12"]]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 for(const phrase of phrases)assert(html.includes(phrase),file+" lost verified worked example "+phrase);
}
// Week 7 cross-disciplinary objectives must match the actual instructional labs.
for(const [g,subject,focus] of [["03","language-arts","technical instructions, diagrams and precise procedures"],["03","technology-tools","measurement tables, units and data debugging"],["04","language-arts","evidence-based procedural and persuasive writing"],["05","arts-music","rhythmic notation, fractional duration and composition"],["05","integrated-projects","fraction-based recipe design and peer critique"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(new RegExp("Focus:</strong> "+focus,"g"))||[]).length===5,file+" has drifting daily focus");
 assert((html.match(/Week 07 (?:Academic|Practical) Depth Lab · Day [1-5]/g)||[]).length===5,file+" lost instructional depth labs");
}
// Further Week 7 practical-course instructional alignment.
for(const [g,subject,focus] of [["03","arts-music","sound scores, rhythm and expressive motion"],["03","health-pe-sel","safe motion, accessible fitness and thoughtful choices"],["03","integrated-projects","controlled ramp experiments and evidence-based design"],["04","arts-music","eight-beat rhythmic structure and notation"],["04","technology-tools","data tables, division algorithms and checking remainders"],["05","health-pe-sel","inclusive schedules, duration fractions and wellness"],["05","technology-tools","fraction models, equivalent units and calculation checks"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,html=fs.readFileSync(file,"utf8");
 assert((html.match(new RegExp("Focus:</strong> "+focus,"g"))||[]).length===5,file+" must have five aligned daily focuses");
}
console.log("Week 6–7 evidence audit PASS: "+count+" subject halls per week, Week 7 local routes, original daily lessons, and 21 focus corrections checked.");
