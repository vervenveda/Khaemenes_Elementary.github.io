import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const targetMatchers=[
  /^index\.html$/,
  /^student-profile\/index\.html$/,
  /^games\/index\.html$/,
  /^grades\/portfolio\/index\.html$/,
  /^grades\/grade-0[1-5]\/index\.html$/,
  /^grades\/grade-0[1-5]\/teacher-tools\/index\.html$/,
  /^grades\/grade-0[1-5]\/subjects\/[^/]+\/index\.html$/
];
const LOADER=/vnv-header-autopopulate\.js/gi;
const MOUNT=/\bVNV_HEADER\?*\.mount\s*\(/gi;
const OFFICIAL_ROOT=/id=["']vnvHeaderAutoPopulate["']/gi;
const LEGACY=/<header\b(?![^>]*id=["']vnvHeaderAutoPopulate["'])[^>]*>/gi;

function target(p){return targetMatchers.some(re=>re.test(p))}
function redirect(s){
 return /<meta[^>]+http-equiv=["']?refresh["']?/i.test(s)&&
 /<link[^>]+rel=["']canonical["'][^>]*>|<link[^>]+href=[^>]+rel=["']canonical["']/i.test(s)&&
 /\blocation\.replace\s*\(/i.test(s);
}
function count(re,s){return (s.match(re)||[]).length}

const files=[];
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules"].includes(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p);
  else if(e.isFile()&&e.name==="index.html"){
   const rel=path.relative(ROOT,p).split(path.sep).join("/");
   if(target(rel))files.push({p,rel});
  }
 }
}
walk(ROOT); files.sort((a,b)=>a.rel.localeCompare(b.rel));
const rows=files.map(({p,rel})=>{
 const s=fs.readFileSync(p,"utf8");
 return {path:rel,redirect:redirect(s),loader:count(new RegExp(LOADER.source,"gi"),s),
 mount:count(new RegExp(MOUNT.source,"gi"),s),
 officialRoot:count(new RegExp(OFFICIAL_ROOT.source,"gi"),s),
 legacyHeaders:count(new RegExp(LEGACY.source,"gi"),s),
 replaceLegacy:/replaceLegacy\s*:\s*true/i.test(s),
 exactTitle:/title\s*:\s*["']Khaemenes Elementary Academy["']/i.test(s),
 exactSubtitle:/subtitle\s*:\s*["']Grades 01.?05["']/i.test(s),
 iconK:/icon\s*:\s*["']K["']/i.test(s)
 };
});
const content=rows.filter(r=>!r.redirect);
const compliant=content.filter(r=>r.loader===1&&r.mount===1&&r.replaceLegacy&&r.exactTitle&&r.exactSubtitle&&r.iconK);
const missing=content.filter(r=>!compliant.includes(r));
console.log("ELEMENTARY OFFICIAL HEADER LANDING AUDIT");
console.log("TARGET_INDEX_SURFACES="+rows.length);
console.log("REDIRECTS="+rows.filter(r=>r.redirect).length);
console.log("REAL_LANDINGS="+content.length);
console.log("COMPLIANT="+compliant.length);
console.log("MISSING_OR_NONCANONICAL="+missing.length);
console.log("LEGACY_HEADER_TAGS_ON_REAL_LANDINGS="+content.reduce((n,r)=>n+r.legacyHeaders,0));
for(const r of missing)console.log("MISSING|"+JSON.stringify(r));
