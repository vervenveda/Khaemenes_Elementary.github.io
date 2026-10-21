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
console.log("Week 6 evidence audit PASS: "+count+" existing subject studios and original daily lessons preserved; 9 focus corrections verified.");
