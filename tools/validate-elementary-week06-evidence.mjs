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
console.log("Week 6 evidence audit PASS: "+count+" existing subject studios and original daily lessons preserved; 21 focus corrections verified.");
