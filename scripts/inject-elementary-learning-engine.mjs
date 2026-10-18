import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_ELEMENTARY_LEARNING_ENGINE_V1 -->";
const ASSETS={
  focus:"assets/khaemenes-elementary-focus-map.js",
  factory:"assets/khaemenes-elementary-question-factory.js",
  ledger:"assets/khaemenes-elementary-learning-ledger.js",
  assessment:"assets/khaemenes-elementary-assessment-engine.js"
};

const SKIP_DIRS=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const isHtml=p=>p.toLowerCase().endsWith(".html");
const posix=p=>p.split(path.sep).join("/");

function walk(dir,out=[]){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP_DIRS.has(entry.name.toLowerCase()))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full,out);
    else if(entry.isFile()&&isHtml(full))out.push(full);
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
function ref(fromFile,target){
  let value=posix(path.relative(path.dirname(fromFile),path.join(ROOT,target)));
  if(!value.startsWith("."))value="./"+value;
  return value;
}
function block(file,type){
  const focus=ref(file,ASSETS.focus),factory=ref(file,ASSETS.factory);
  const runtime=ref(file,type==="lesson"?ASSETS.ledger:ASSETS.assessment);
  return `${MARKER}
<script src="${focus}"></script>
<script src="${factory}"></script>
<script src="${runtime}"></script>`;
}
function inject(file,type){
  let html=fs.readFileSync(file,"utf8");
  if(html.includes(MARKER))return{changed:false,reason:"already"};
  const snippet=block(file,type);
  const beta="<!-- VNV_BETA_PROGRAM_V2 -->";
  if(html.includes(beta))html=html.replace(beta,snippet+"\n"+beta);
  else if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,snippet+"\n</body>");
  else return{changed:false,reason:"no-body"};
  fs.writeFileSync(file,html,"utf8");
  return{changed:true,reason:"injected"};
}

const files=walk(ROOT),report={lesson:{target:0,changed:0,already:0,skipped:[]},assessment:{target:0,changed:0,already:0,skipped:[]}};
for(const file of files){
  const rel=path.relative(ROOT,file),type=classify(rel);
  if(!type)continue;
  report[type].target++;
  const result=inject(file,type);
  if(result.changed)report[type].changed++;
  else if(result.reason==="already")report[type].already++;
  else report[type].skipped.push(posix(rel)+": "+result.reason);
}
report.totalTargets=report.lesson.target+report.assessment.target;
report.totalChanged=report.lesson.changed+report.assessment.changed;
report.totalSkipped=report.lesson.skipped.length+report.assessment.skipped.length;
console.log(JSON.stringify(report,null,2));
if(report.totalSkipped)process.exitCode=2;
