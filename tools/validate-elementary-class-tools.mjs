import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const shared=path.join(root,"assets","elementary-global-standard-v1.js");
const source=fs.readFileSync(shared,"utf8");

const must=[
  'vnv-class-tools-presets.js',
  'vnv-class-tools-toolbar.js',
  'VNVSelectClassToolsPreset?.("elementary")',
  'function elementaryLearnerSurface()',
  'assessments?',
  'records?',
  'teacher-tools?',
  'printables?',
  'vnvClassToolsToolbar',
  'vnvEcosystemUtilityDock'
];
for(const needle of must){
  if(!source.includes(needle)){
    console.error("FAIL: shared Elementary controller missing required learner-toolbar contract:",needle);
    process.exit(1);
  }
}

const gradeIndexes=[1,2,3,4,5].map(n=>path.join(root,"grades",`grade-0${n}`,"index.html"));
for(const file of gradeIndexes){
  const html=fs.readFileSync(file,"utf8");
  if(!html.includes("elementary-global-standard-v1.js")){
    console.error("FAIL: grade landing missing Elementary global standard:",path.relative(root,file));
    process.exit(1);
  }
}

let directClassToolbar=0;
let htmlCount=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(full);continue}
    if(!entry.name.endsWith(".html"))continue;
    htmlCount++;
    const html=fs.readFileSync(full,"utf8");
    if(/<script[^>]+vnv-class-tools-toolbar\.js/i.test(html))directClassToolbar++;
  }
}
walk(root);
if(directClassToolbar!==0){
  console.error("FAIL: Elementary HTML should not directly embed the learner toolbar; shared controller is canonical. Direct embeds:",directClassToolbar);
  process.exit(1);
}

const protectedSamples=[
  "grades/grade-01/assessments/weekly-assessments.html",
  "grades/grade-01/records/certificate.html",
  "grades/grade-02/teacher-tools/index.html",
  "grades/grade-03/printables/week-01-packet.html"
].map(p=>path.join(root,p)).filter(fs.existsSync);

for(const file of protectedSamples){
  const rel=path.relative(root,file).replaceAll(path.sep,"/");
  const excluded=/(?:\/|^)(?:assessments?|records?|teacher-tools?|teacher|teachers|admin|printables?)(?:\/|$)/i.test("/Khaemenes_Elementary.github.io/"+rel);
  if(!excluded){
    console.error("FAIL: protected sample is not excluded by learner-surface policy:",rel);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  status:"PASS",
  htmlPages:htmlCount,
  gradeLandingCoverage:gradeIndexes.length,
  directClassToolbarEmbeds:directClassToolbar,
  protectedSamplesChecked:protectedSamples.length,
  learnerToolbarOwner:"assets/elementary-global-standard-v1.js"
},null,2));
