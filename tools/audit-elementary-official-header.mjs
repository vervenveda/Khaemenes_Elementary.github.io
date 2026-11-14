import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd();
const TARGETS=[
  /^index\.html$/,
  /^student-profile\/index\.html$/,
  /^games\/index\.html$/,
  /^grades\/portfolio\/index\.html$/,
  /^grades\/grade-0[1-5]\/index\.html$/,
  /^grades\/grade-0[1-5]\/teacher-tools\/index\.html$/,
  /^grades\/grade-0[1-5]\/subjects\/[^/]+\/index\.html$/
];
function target(rel){return TARGETS.some(re=>re.test(rel))}
function count(re,s){return (s.match(re)||[]).length}
const rows=[];
(function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules"].includes(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p);
  else if(e.isFile()&&e.name==="index.html"){
   const rel=path.relative(ROOT,p).split(path.sep).join("/");
   if(!target(rel))continue;
   const s=fs.readFileSync(p,"utf8");
   rows.push({
    path:rel,
    loader:count(/vnv-header-autopopulate\.js/gi,s),
    contract:count(/data-vnv-elementary-header-contract=["\']v2["\']/gi,s),
    title:/title\s*:\s*["\']Khaemenes Elementary Academy["\']/i.test(s),
    subtitle:/subtitle\s*:\s*["\']Grades 01.?05["\']/i.test(s),
    icon:/icon\s*:\s*["\']K["\']/i.test(s),
    replaceLegacy:/replaceLegacy\s*:\s*true/i.test(s),
    fiveActions:["Academy Home","Student Profile","Family","Teacher","Middle School"].every(x=>s.includes('label:"'+x+'"')),
    unmarkedHeader:count(/<header\b(?![^>]*data-vnv-header-legacy)(?![^>]*id=["\']vnvHeaderAutoPopulate["\'])[^>]*>/gi,s),
    headerOpen:count(/<header\b[^>]*>/gi,s),
    headerClose:count(/<\/header\s*>/gi,s),
    portfolioControls:rel==="grades/portfolio/index.html"
      ? /<section\b[^>]*data-vnv-page-controls[^>]*>[\s\S]*?id=["\']scanBtn["\'][\s\S]*?id=["\']printTop["\'][\s\S]*?<\/section>/i.test(s)
      : true
   });
  }
 }
})(ROOT);
rows.sort((a,b)=>a.path.localeCompare(b.path));
const bad=rows.filter(r=>!(r.loader===1&&r.contract===1&&r.title&&r.subtitle&&r.icon&&r.replaceLegacy&&r.fiveActions&&r.unmarkedHeader===0&&r.headerOpen===r.headerClose&&r.portfolioControls));
console.log("ELEMENTARY OFFICIAL HEADER LANDING AUDIT");
console.log("REAL_LANDINGS="+rows.length);
console.log("COMPLIANT="+(rows.length-bad.length));
console.log("NONCOMPLIANT="+bad.length);
console.log("UNMARKED_LEGACY_HEADERS="+rows.reduce((n,r)=>n+r.unmarkedHeader,0));
console.log("UNBALANCED_HEADER_TAG_PAGES="+rows.filter(r=>r.headerOpen!==r.headerClose).length);
console.log("PORTFOLIO_CONTROLS_PRESERVED="+rows.find(r=>r.path==="grades/portfolio/index.html")?.portfolioControls);
bad.forEach(r=>console.log("BAD|"+JSON.stringify(r)));
if(rows.length!==49||bad.length)process.exitCode=2;