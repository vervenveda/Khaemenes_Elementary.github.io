import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const fail=(message)=>{throw new Error(message)};
const read=(p)=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(ROOT,p));
const expect=(condition,message)=>{if(!condition)fail(message)};

const rootPage="index.html";
const gradePages=["01","02","03","04","05"].map(g=>`grades/grade-${g}/index.html`);
const activePages=[rootPage,...gradePages];

function syntaxCheck(source,label){
  try{new Function(source)}
  catch(error){fail(`${label} JavaScript syntax failed: ${error.message}`)}
}

function scriptRefs(html){
  return [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(match=>match[1]);
}

function parseFocusMap(source){
  const match=source.match(/const data=(\{[\s\S]*?\});\nglobal\.KhaemenesElementaryFocusMap=/);
  expect(match,"Could not parse compact Elementary focus map.");
  return JSON.parse(match[1]);
}

const resourcesPath="assets/khaemenes-elementary-resources.js";
const focusPath="assets/khaemenes-elementary-focus-map.js";
const experiencePath="assets/khaemenes-elementary-experience.js";
const manifestPath="mentor-manifest.json";
const contractPath="mentor-contract.json";

for(const p of [resourcesPath,focusPath,experiencePath,manifestPath,contractPath,...activePages]){
  expect(exists(p),`Missing required Elementary experience file: ${p}`);
}

const resources=read(resourcesPath);
const focusSource=read(focusPath);
const experience=read(experiencePath);
syntaxCheck(resources,resourcesPath);
syntaxCheck(focusSource,focusPath);
syntaxCheck(experience,experiencePath);

// 1. Shared surface coverage.
for(const page of activePages){
  const html=read(page);
  const refs=scriptRefs(html);
  const expectedResource=page===rootPage?"assets/khaemenes-elementary-resources.js":"../../assets/khaemenes-elementary-resources.js";
  const expectedExperience=page===rootPage?"assets/khaemenes-elementary-experience.js":"../../assets/khaemenes-elementary-experience.js";
  expect(refs.includes(expectedResource),`${page} is missing the shared resource registry.`);
  expect(refs.includes(expectedExperience),`${page} is missing the shared Mentor/family experience layer.`);
  expect(/Archaemenes/i.test(html),`${page} no longer exposes Archaemenes.`);
  expect(!/\b(?:Pip|Miri|Nova|Sage)\b/.test(html),`${page} reintroduced a retired separate Mentor identity.`);
}
expect(scriptRefs(read(rootPage)).includes("assets/khaemenes-elementary-focus-map.js"),"Elementary home is missing the compact grade-week focus map.");

// 2. Grade continuity boundaries.
const g1=read("grades/grade-01/index.html");
expect(g1.includes("assets/grade1-mastery.js"),"Grade 01 lost its active mastery engine.");
expect(!g1.includes("khaemenes-grade1-continuity.js"),"Grade 01 must not load the legacy wrapper continuity adapter on the active page.");
for(const g of ["02","03","04","05"]){
  const html=read(`grades/grade-${g}/index.html`);
  expect(html.includes(`assets/khaemenes-grade${Number(g)}-continuity.js`),`Grade ${g} lost its continuity adapter.`);
  expect(html.includes("../../assets/khaemenes-elementary-continuation-publisher.js"),`Grade ${g} lost cross-campus continuation publishing.`);
}

// 3. Grade 01 + fallback family snapshot mount.
expect(
  experience.includes('const anchor=$("#family")||$("#records")||document.querySelector("main")'),
  "Family Learning Snapshot no longer has a Grade 01/main fallback mount."
);

// 4. First-party resource registry integrity.
const resourcePaths=[...resources.matchAll(/path:"(games\/[^"]+\/)"/g)].map(match=>match[1]);
expect(resourcePaths.length===28,`Expected 28 Elementary game/tool registry paths, found ${resourcePaths.length}.`);
expect(new Set(resourcePaths).size===28,"Elementary resource registry contains duplicate game/tool paths.");
for(const resourcePath of resourcePaths){
  expect(exists(path.join(resourcePath,"index.html")),`Missing registered resource: ${resourcePath}index.html`);
}
const actualGameCabinets=fs.readdirSync(path.join(ROOT,"games"),{withFileTypes:true})
  .filter(entry=>entry.isDirectory()&&exists(path.join("games",entry.name,"index.html")))
  .map(entry=>`games/${entry.name}/`)
  .sort();
const unregistered=actualGameCabinets.filter(p=>!resourcePaths.includes(p));
const missingCabinets=resourcePaths.filter(p=>!actualGameCabinets.includes(p));
expect(unregistered.length===0,`Unregistered Elementary game/tool cabinets: ${unregistered.join(", ")}`);
expect(missingCabinets.length===0,`Registry paths without cabinets: ${missingCabinets.join(", ")}`);

// 5. Compact 5×36 focus map integrity.
const focus=parseFocusMap(focusSource);
for(const g of ["01","02","03","04","05"]){
  expect(focus[g]&&typeof focus[g]==="object",`Compact focus map is missing Grade ${g}.`);
  const weeks=Object.keys(focus[g]);
  expect(weeks.length===36,`Grade ${g} compact focus map has ${weeks.length} weeks; expected 36.`);
  for(let week=1;week<=36;week++){
    const text=String(focus[g][String(week)]||"").trim();
    expect(text.length>=8,`Grade ${g} Week ${week} has no usable focus text.`);
  }
}

// 6. Mentor/family boundary.
expect(experience.includes('PASS=80'),"Elementary shared experience no longer preserves the 80% mastery threshold.");
expect(experience.includes("khaemenes_elementary_mentor_context_v1"),"Elementary Mentor context key changed or disappeared.");
for(const label of ['"support"','"independent"','"transfer"']){
  expect(experience.includes(label),`Missing family observation level ${label}.`);
}
const observationBlock=experience.match(/function saveObservation\(level\)\{([\s\S]*?)\}\nfunction allActivity/);
expect(observationBlock,"Could not isolate family observation writer.");
expect(!observationBlock[1].includes("khaemenes.course:"),"Family observations must not write formal course state.");
expect(observationBlock[1].includes("KEYS.observations"),"Family observations are not writing only to their dedicated observation store.");

const manifest=JSON.parse(read(manifestPath));
const contract=JSON.parse(read(contractPath));
expect(manifest.mentorId==="archaemenes","Mentor manifest no longer names Archaemenes as the single Mentor.");
expect(manifest.mentorExperience?.sharedExperienceLayer===experiencePath,"Mentor manifest shared experience path drifted.");
expect(manifest.mentorExperience?.sharedResourceRegistry===resourcesPath,"Mentor manifest shared resource path drifted.");
expect(manifest.mentorExperience?.contextKey==="khaemenes_elementary_mentor_context_v1","Mentor manifest context key drifted.");
for(const key of ["affectsMastery","affectsAssessment","affectsProgression","affectsPlacement","diagnostic"]){
  expect(manifest.mentorExperience?.observations?.[key]===false,`Manifest observation boundary ${key} must remain false.`);
}
for(const key of ["awardsMastery","changesScore","unlocksCurriculum","changesPlacement","diagnostic"]){
  expect(contract.experience?.observationAuthority?.[key]===false,`Mentor contract observation boundary ${key} must remain false.`);
}

const bridge="grades/grade-01/learning/discovery-to-independence.html";
expect(exists(bridge),"Missing Grade 1 instructional bridge");
expect(read("grades/grade-01/index.html").includes('href="learning/discovery-to-independence.html"'),"Grade 1 bridge link missing");
for(const link of [...read(bridge).matchAll(/href="\.\.\/([^"]+)"/g)])expect(exists("grades/grade-01/"+link[1]),"Grade 1 bridge link missing: "+link[1]);
expect(!read(bridge).includes("grade1-mastery.js"),"Practice bridge must not duplicate assessment engine");
// Week 05 cross-subject instruction QA: practice must supplement, not replace mastery.
for(const grade of ["02","03","04","05"]){
 const base="grades/grade-"+grade+"/subjects/";
 const tech=grade==="02"?"technology":"technology-tools";
 for(const subject of ["language-arts","mathematics","science","arts-music","health-pe-sel","integrated-projects",tech]){
  const file=base+subject+"/week-05.html";
  expect(exists(file),"Missing Week 05 lesson: "+file);
  const html=read(file);
  expect(html.includes("Evidence Studio")||html.includes("Worked Example"),"Missing specific Week 05 practice: "+file);
  expect(/Formal assessments remain separate|existing graded assessment|Existing exams remain separate|Practice is separate from the existing graded assessment/i.test(html),"Week 05 evidence/assessment separation unclear: "+file);
  expect((html.match(/<article class=['"]lesson['"]/g)||[]).length>=5,"Week 05 daily lesson sequence was disrupted: "+file);
 }
}
console.log("Elementary experience regression: PASS");
console.log("  active surfaces: 6");
console.log("  registered first-party resources: 28 / 28");
console.log("  compact curriculum focus entries: 180 / 180");
console.log("  grades covered: 01–05");
console.log("  formal mastery threshold: 80%");
console.log("  Mentor authority: Archaemenes");
console.log("  family observations: support-only, non-mastery");
