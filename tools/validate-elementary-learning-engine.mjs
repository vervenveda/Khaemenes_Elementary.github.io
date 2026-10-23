import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_ELEMENTARY_LEARNING_ENGINE_V1 -->";
const fail=m=>{throw new Error(m)};
const expect=(v,m)=>{if(!v)fail(m)};
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const posix=p=>p.split(path.sep).join("/");

const assets=[
  "assets/khaemenes-elementary-focus-map.js",
  "assets/khaemenes-elementary-question-factory.js",
  "assets/khaemenes-elementary-learning-ledger.js",
  "assets/khaemenes-elementary-assessment-engine.js"
];
for(const p of assets)expect(exists(p),`Missing shared learning asset: ${p}`);
for(const p of assets.slice(1)){try{new Function(read(p))}catch(e){fail(`${p} syntax: ${e.message}`)}}

function walk(dir,out=[]){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","archive","archives","backup","backups","vendor","private"].includes(entry.name.toLowerCase()))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full,out);
    else if(entry.isFile()&&full.toLowerCase().endsWith(".html"))out.push(full);
  }
  return out;
}
function classify(rel){
  const p="/"+posix(rel);
  const lesson=
    /^\/(?:grades\/grade-01\/)?lessons\/unit-\d+\/index\.html$/i.test(p) ||
    /^\/grades\/grade-0[2-5]\/subjects\/[^/]+\/week-\d+\.html$/i.test(p) ||
    /^\/grades\/grade-0[3-5]\/weekly-plans\/week-\d+\.html$/i.test(p);
  const assessment=
    /^\/(?:grades\/grade-0[1-5]\/)?assessments\/(?:unit-\d+-assessment|week-\d+-assessment|midterm|final-exam)\.html$/i.test(p);
  return lesson?"lesson":assessment?"assessment":null;
}
function refs(html){return [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m=>m[1])}

const coverage={lesson:0,assessment:0,missing:[],duplicates:[]};
for(const full of walk(ROOT)){
  const rel=posix(path.relative(ROOT,full)),type=classify(rel);
  if(!type)continue;
  const html=fs.readFileSync(full,"utf8");
  const redirect=rel.match(/^grades\/grade-(0[2-5])\/subjects\/social-studies\/week-(\d{2})\.html$/i);
  if(redirect){
    const week=Number(redirect[2]);
    expect(week>=1&&week<=36,"Invalid Social Studies redirect week: "+rel);
    expect(html.includes('href="index.html?week='+week+'"'),"Broken canonical Social Studies week link: "+rel);
    expect(html.includes('location.replace("index.html?week='+week+'")'),"Broken canonical Social Studies redirect: "+rel);
    expect(exists("grades/grade-"+redirect[1]+"/subjects/social-studies/index.html"),"Canonical Social Studies course missing: "+rel);
    continue;
  }
  coverage[type]++;
  const markers=html.split(MARKER).length-1,scripts=refs(html);
  if(markers!==1)coverage[markers===0?"missing":"duplicates"].push(`${rel}: marker=${markers}`);
  const needed=type==="lesson"?"khaemenes-elementary-learning-ledger.js":"khaemenes-elementary-assessment-engine.js";
  if(!scripts.some(s=>s.endsWith("khaemenes-elementary-focus-map.js")))coverage.missing.push(`${rel}: focus map`);
  if(!scripts.some(s=>s.endsWith("khaemenes-elementary-question-factory.js")))coverage.missing.push(`${rel}: question factory`);
  if(!scripts.some(s=>s.endsWith(needed)))coverage.missing.push(`${rel}: ${needed}`);
}
expect(coverage.lesson>0,"No lesson surfaces found.");
expect(coverage.assessment>0,"No assessment surfaces found.");
expect(coverage.missing.length===0,`Learning-engine coverage gaps:\n${coverage.missing.slice(0,30).join("\n")}`);
expect(coverage.duplicates.length===0,`Duplicate learning-engine markers:\n${coverage.duplicates.slice(0,30).join("\n")}`);

// Evaluate factory in an isolated context and sample every grade/subject.
const context={console,globalThis:null};context.globalThis=context;
vm.createContext(context);
vm.runInContext(read("assets/khaemenes-elementary-question-factory.js"),context);
const factory=context.KhaemenesElementaryQuestionFactory;
expect(factory?.version,"Question factory did not expose its API.");
let sampled=0;
for(let grade=1;grade<=5;grade++){
  for(const subject of factory.subjects){
    for(let seed=1;seed<=12;seed++){
      const qs=factory.makePool({grade,subject,focus:subject+" evidence reasoning",seed,count:6});
      expect(qs.length>=3,`Too few generated questions for Grade ${grade} ${subject} seed ${seed}`);
      for(const q of qs){
        expect(factory.validateQuestion(q),`Invalid generated question for Grade ${grade} ${subject}: ${q?.prompt}`);
        expect(new Set(q.options).size===4,"Generated question has duplicate options.");
        expect(q.options[q.answer]===q.correct,"Generated answer key does not match displayed option.");
        sampled++;
      }
    }
  }
}
expect(sampled>=1000,`Question-factory sample was unexpectedly small: ${sampled}`);

// Verify the large Monte Carlo pools advertised by the formal assessment engine.
let largePoolQuestions=0;
for(let grade=1;grade<=5;grade++){
  const weeklyCount=grade<=2?12:grade===3?15:18;
  const midtermCount=grade<=2?24:grade===3?28:32;
  const finalCount=grade<=2?30:grade===3?34:40;
  for(const [scope,displayCount] of [["weekly",weeklyCount],["midterm",midtermCount],["final",finalCount]]){
    const expectedPool=Math.max(displayCount*2,scope==="weekly"?32:64);
    const pool=factory.makeBalanced({grade,focus:"Grade "+grade+" cumulative reading mathematics science civics evidence reasoning",seed:"qa-"+grade+"-"+scope,count:expectedPool,scope,week:scope==="weekly"?12:null});
    expect(pool.length===expectedPool,`Grade ${grade} ${scope} pool has ${pool.length} questions; expected ${expectedPool}.`);
    expect(new Set(pool.map(q=>q.prompt)).size===pool.length,`Grade ${grade} ${scope} pool contains duplicate prompts.`);
    expect(new Set(pool.map(q=>q.answer)).size>=2,`Grade ${grade} ${scope} answer positions are not meaningfully randomized.`);
    for(const q of pool)expect(factory.validateQuestion(q),`Invalid question in Grade ${grade} ${scope} large pool.`);
    largePoolQuestions+=pool.length;
  }
}

// Lesson ledger must never write mastery.
const ledger=read("assets/khaemenes-elementary-learning-ledger.js");
expect(ledger.includes('masteryAuthority:false'),"Lesson ledger lost the explicit non-mastery boundary.");
expect(ledger.includes('affectsGrade:false'),"Lesson ledger no longer marks formative evidence as non-graded.");
expect(ledger.includes('unlocksCurriculum:false'),"Lesson ledger no longer marks formative evidence as non-unlocking.");
expect(!/state\.weekly\s*\[/.test(ledger),"Lesson ledger must not write formal weekly scores.");

// Learner isolation and recovery invariants. Structural checks do not replace browser tests.
expect(ledger.includes('stage==="elementary"&&grade===routeGrade()'),"Learning ledger must reject another grade or stage.");
expect(ledger.includes('function ownerId(){return activeLearner()?.learnerId||"preview"}'),"Learning ledger no longer isolates active learner and preview records.");
expect(ledger.includes('learnerId:learner?.learnerId||null'),"Formative evidence lost learner identity field.");
expect(ledger.includes('preview:!learner'),"Unassigned preview evidence must remain explicitly marked.");
expect(ledger.includes('all[id]=list.slice(-MAX_RECORDS)'),"Learning ledger record retention cap changed.");
expect(ledger.includes('if(!write(LEDGER_KEY,all))return false'),"Learning ledger must report storage failures.");

// Formal assessment contract.
const assessment=read("assets/khaemenes-elementary-assessment-engine.js");
expect(assessment.includes("PASS=80"),"Formal assessment threshold is no longer 80%.");
expect(assessment.includes("khaemenes-elementary-assessment-attempt-v1"),"Immutable attempt snapshot schema is missing.");
expect(assessment.includes('verifiedBy:"elementary-assessment-engine-v1"'),"Formal state writer no longer marks verified assessment authority.");
expect(assessment.includes("completedWeeks(state,18)"),"Midterm gate no longer checks the first 18 weeks.");
expect(assessment.includes("completedWeeks(state,36)"),"Final gate no longer checks all 36 weeks.");
expect(assessment.includes("manualScoreEntry:false"),"Assessment authority declaration drifted.");

// Dashboards must not write manual scores and must require 36/36.
for(const g of ["02","03","04","05"]){
  const app=read(`grades/grade-${g}/assets/app.js`);
  expect(/(?:done|completedWeeks)\(\)===36/.test(app),`Grade ${g} readiness does not require 36/36 weeks.`);
  expect(!/state\.weekly\[[^\]]+\]=Math\.max/.test(app),`Grade ${g} dashboard still writes weekly scores manually.`);
  expect(!/state\.midterm=Math\.max/.test(app),`Grade ${g} dashboard still writes midterm manually.`);
  expect(!/state\.final=Math\.max/.test(app),`Grade ${g} dashboard still writes final manually.`);
  expect(/readOnly=true/.test(app),`Grade ${g} verified assessment fields are not read-only.`);

  const cert=read(`grades/grade-${g}/assets/certificate.js`);
  expect(/done===36/.test(cert),`Grade ${g} certificate does not require all 36 weeks.`);
  expect(/khaemenes\.course:/.test(cert),`Grade ${g} certificate is not learner-scoped.`);

  const cont=read(`grades/grade-${g}/assets/khaemenes-grade${Number(g)}-continuity.js`);
  expect(!/legacy-grade-\d+-migration/.test(cont),`Grade ${g} still auto-migrates unowned legacy records.`);
  expect(!/writeJSON\(LEGACY_KEY,state\);\s*if\(s\.status/.test(cont),`Grade ${g} still writes shared legacy state before scoped state.`);
}

// Portfolio evidence bridge.
const portfolio=read("grades/portfolio/index.html");
expect(portfolio.includes('LEDGER_KEY="khaemenes_elementary_learning_ledger_v1"'),"Portfolio lost the Elementary learning-ledger bridge.");
expect(portfolio.includes('ASSESSMENT_PREFIX="khaemenes.elementary.assessment.attempts"'),"Portfolio lost the verified assessment bridge.");
expect(portfolio.includes('return KEY+":learner:"+encodeURIComponent(id)'),"Portfolio state must use a learner-specific storage key.");
expect(portfolio.includes('return KEY+":unassigned"'),"Unassigned portfolio data must remain separate from learner accounts.");
expect(portfolio.includes("if(!portfolioSessionCurrent())"),"Portfolio must reject saves after learner switching.");
expect(portfolio.includes("localStorage.setItem(portfolioSessionKey,JSON.stringify(s))"),"Portfolio saves must use the pinned learner key.");
expect(!portfolio.includes("localStorage.setItem(KEY,JSON.stringify(s))"),"Portfolio may not write shared legacy state.");
expect(portfolio.includes("function recoverLegacyPortfolio()"),"Legacy recovery review control missing.");
expect(portfolio.includes('localStorage.getItem(portfolioSessionKey)!==null'),"Legacy recovery could overwrite an existing learner portfolio.");
expect(portfolio.includes('prior.toLowerCase()!==currentName.toLowerCase() || grade!==currentGrade'),"Legacy recovery must verify both student name and grade.");
expect(portfolio.includes('typed!==prior'),"Legacy recovery requires typed confirmation.");
expect(portfolio.includes('localStorage.setItem(portfolioSessionKey,JSON.stringify(recovered))'),"Legacy recovery must write only learner-scoped data.");
expect(!portfolio.includes("localStorage.removeItem(KEY)"),"Legacy shared source must remain available after recovery.");
expect(portfolio.includes("function scanElementaryLearningEvidence()"),"Portfolio no longer scans learner-scoped lesson/assessment evidence.");
expect(portfolio.includes('record.preview||record.learnerId!==learner.learnerId'),"Portfolio no longer excludes previews or foreign-learner lesson evidence.");
expect(portfolio.includes('attempt.preview||attempt.learnerId!==learner.learnerId'),"Portfolio no longer excludes previews or foreign-learner assessments.");
expect(portfolio.includes('Array.isArray(ledger[learner.learnerId])'),"Portfolio lesson bridge is not learner-keyed.");

expect(portfolio.includes('source:"Elementary Learning Ledger"'),"Portfolio does not identify lesson-ledger evidence.");
expect(portfolio.includes('source:"Verified Elementary Assessment"'),"Portfolio does not identify verified assessment evidence.");
const formativeBlock=portfolio.match(/source:"Elementary Learning Ledger"[\s\S]{0,1800}?tags:\[[^\]]+\]/);
expect(formativeBlock,"Could not isolate Portfolio formative-evidence mapping.");
expect(formativeBlock[0].includes("mastery:null"),"Formative lesson evidence must never be imported as mastery.");
const verifiedBlock=portfolio.match(/source:"Verified Elementary Assessment"[\s\S]{0,1900}?tags:\[[^\]]+\]/);
expect(verifiedBlock,"Could not isolate Portfolio verified-assessment mapping.");
expect(verifiedBlock[0].includes("mastery:Number(attempt.score)||0"),"Verified assessment score is not preserved as mastery evidence.");
expect(!verifiedBlock[0].includes("responses:"),"Portfolio must not import assessment answer-level payloads.");


// Full-year subject-hall structural audit: every non-civic subject week must
// retain five daily lessons, the shared learning engine, an assessment route,
// and resolvable local links. Social Studies canonical redirects are validated separately.
const subjectSets={
  "02":["language-arts","mathematics","science","arts-music","health-pe-sel","technology","integrated-projects"],
  "03":["language-arts","mathematics","science","arts-music","health-pe-sel","technology-tools","integrated-projects"],
  "04":["language-arts","mathematics","science","arts-music","health-pe-sel","technology-tools","integrated-projects"],
  "05":["language-arts","mathematics","science","arts-music","health-pe-sel","technology-tools","integrated-projects"]
};
let fullYearSubjectPages=0;
for(const [g,subjects] of Object.entries(subjectSets)){
  for(let week=1;week<=36;week++){
    const ww=String(week).padStart(2,"0");
    expect(exists(`grades/grade-${g}/assessments/week-${ww}-assessment.html`),`Grade ${g} Week ${ww} assessment missing.`);
    for(const subject of subjects){
      const file=`grades/grade-${g}/subjects/${subject}/week-${ww}.html`;
      expect(exists(file),`Missing subject lesson: ${file}`);
      const html=read(file);
      expect((html.match(/<article class=['"]lesson['"]/g)||[]).length===5,`${file} must retain exactly five daily lesson articles.`);
      for(const asset of ["khaemenes-elementary-focus-map.js","khaemenes-elementary-question-factory.js","khaemenes-elementary-learning-ledger.js"])
        expect(html.includes(asset),`${file} missing shared learning asset ${asset}`);
      for(const match of html.matchAll(/<(?:a|script|link)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)){
        const ref=match[1].trim();
        if(!ref||/^(?:#|https?:|mailto:|tel:|data:|javascript:|\/)/i.test(ref))continue;
        const target=decodeURIComponent(ref.split(/[?#]/)[0]);
        if(!target)continue;
        const resolved=path.resolve(path.dirname(path.join(ROOT,file)),target);
        expect(fs.existsSync(resolved),`${file} broken local reference: ${ref}`);
      }
      fullYearSubjectPages++;
    }
  }
}
expect(fullYearSubjectPages===1008,`Expected 1008 Grades 2–5 non-civic subject-week pages, audited ${fullYearSubjectPages}.`);

// Shared depth layer must remain formative/non-mastery.
expect(ledger.includes("function depthPlan("),"Shared Instructional Depth Studio is missing.");
expect(ledger.includes('aria-label","Instructional depth studio"'),"Instructional Depth Studio accessibility label missing.");
expect(ledger.includes("masteryAuthority:false"),"Depth/formative layer must remain outside formal mastery.");


// Weeks 08–12 instructional depth band: 4 grades × 5 weeks × 7 non-civic subjects = 140 surfaces.
// The content is rendered by the shared learner-scoped formative ledger so the formal mastery engine remains untouched.
expect(ledger.includes("const DEPTH_BAND_08_12="),"Weeks 08–12 depth-band definitions are missing.");
expect(ledger.includes("function depthBandPlan("),"Weeks 08–12 topic-aware depth planner is missing.");
expect(ledger.includes('data-depth-band",plan.band'),"Weeks 08–12 rendered depth marker is missing.");
expect(ledger.includes('weeks:Object.freeze([8,9,10,11,12])'),"Weeks 08–12 depth-band export drifted.");
expect(ledger.includes("formativeOnly:true"),"Depth band lost its explicit formative-only boundary.");
expect(ledger.includes('const heading=(article.querySelector("h4")?.textContent||"").trim();'),"Depth planner lost Grade 02 heading-based focus extraction.");
expect(ledger.includes('const content=heading.split(":").slice(1).join(":").trim();'),"Depth planner no longer derives concise Grade 02 content focus from lesson headings.");
expect(ledger.indexOf('const heading=(article.querySelector("h4")?.textContent||"").trim();')<ledger.indexOf('const objective=paragraphs.find'),"Grade 02 focus extraction must run before the verbose objective fallback.");

const focusContext={console};focusContext.globalThis=focusContext;focusContext.window=focusContext;
vm.createContext(focusContext);
vm.runInContext(read("assets/khaemenes-elementary-focus-map.js"),focusContext);
const focusMap=focusContext.KhaemenesElementaryFocusMap;
let depthBandPages=0;
for(const [g,subjects] of Object.entries(subjectSets)){
  for(let week=8;week<=12;week++){
    expect(typeof focusMap?.[g]?.[week]==="string"&&focusMap[g][week].trim(),`Grade ${g} Week ${week} missing focus-map theme for depth band.`);
    const ww=String(week).padStart(2,"0");
    for(const subject of subjects){
      const file=`grades/grade-${g}/subjects/${subject}/week-${ww}.html`;
      const html=read(file);
      expect(html.includes("khaemenes-elementary-learning-ledger.js"),`${file} cannot receive the Weeks 08–12 depth band.`);
      const focusMapPos=html.indexOf("khaemenes-elementary-focus-map.js");
      const ledgerPos=html.indexOf("khaemenes-elementary-learning-ledger.js");
      expect(focusMapPos>=0&&ledgerPos>focusMapPos,`${file} must load the focus map before the topic-aware depth ledger.`);
      if(g==="02"){
        const lessonHeadings=[...html.matchAll(/<article class=['"]lesson['"][^>]*>[\\s\\S]*?<h4>([\\s\\S]*?)<\\/h4>/gi)]
          .map(m=>m[1].replace(/<[^>]+>/g,"").trim());
        expect(lessonHeadings.length===5,`${file} must retain five Grade 02 content-bearing lesson headings.`);
        expect(lessonHeadings.every(h=>h.includes(":")),`${file} Grade 02 lesson headings must expose concise focus text after the day label.`);
      }
      depthBandPages++;
    }
  }
}
expect(depthBandPages===140,`Expected 140 Weeks 08–12 subject surfaces; audited ${depthBandPages}.`);

// Grade 1 evidence printables require Academy identification and homeschool evidence fields.
for(let week=1;week<=36;week++){
  const ww=String(week).padStart(2,"0"),file=`grades/grade-01/printables/unit-${ww}-packet.html`,html=read(file);
  expect(html.includes('data-khae-evidence-header="v1"'),`${file} missing standardized evidence header.`);
  for(const marker of ["Khaemenes Academy","Student Name:","Date:","Grade:","Unit/Week:","Lesson/Day:"])
    expect(html.includes(marker),`${file} missing printable evidence field: ${marker}`);
}

// Latent Grade 1 dashboard helper may not reintroduce average-only certification.
const grade1LegacyApp=read("grades/grade-01/assets/app.js");
expect(/function ready\(\)\{return done\(\)===36/.test(grade1LegacyApp),"Grade 01 latent dashboard can certify from an average instead of 36/36.");
expect(!grade1LegacyApp.includes("Certificate requires weekly average 80%+"),"Grade 01 latent dashboard still advertises average-only readiness.");

console.log("Elementary learning engine regression: PASS");
console.log(`  lesson surfaces covered: ${coverage.lesson}`);
console.log(`  formal assessment surfaces covered: ${coverage.assessment}`);
console.log(`  generated questions sampled: ${sampled}`);
console.log(`  large-pool questions validated: ${largePoolQuestions}`);
console.log(`  full-year non-civic subject pages audited: ${fullYearSubjectPages}`);
console.log(`  Weeks 08–12 topic-aware depth surfaces: ${depthBandPages}`);
console.log("  mastery threshold: 80%");
console.log("  certificates: 36/36 weeks + midterm + final + portfolio");
console.log("  practice ledger: learner-scoped and non-mastery");
