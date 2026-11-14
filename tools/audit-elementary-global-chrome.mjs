import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const SKIP=new Set([".git","node_modules"]);
function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP.has(e.name)) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) walk(p,out);
    else if(e.isFile()&&/\.html?$/i.test(e.name)) out.push(p);
  }
  return out;
}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/")}
function redirect(s){
  return /<meta[^>]+http-equiv=["']?refresh["']?/i.test(s)&&/location\.replace\s*\(/i.test(s);
}
function count(re,s){return (s.match(re)||[]).length}
function protectedAssessment(p,s){
  return /\/(quiz|quizzes|exam|exams|assessment|assessments)\//i.test("/"+p) ||
    /data-closed-book/i.test(s);
}
function headers(s){
  return [...s.matchAll(/<header\b[^>]*>([\s\S]*?)<\/header>/gi)].map((m,i)=>({
    i,
    interactive:/<(?:button|input|select|textarea)\b/i.test(m[1]),
    excerpt:m[0].replace(/\s+/g," ").slice(0,240)
  }));
}
function lowerRightRules(s){
  const found=[];
  for(const m of s.matchAll(/([^{}]{0,180})\{([^{}]*position\s*:\s*fixed[^{}]*)\}/gi)){
    const body=m[2];
    if(/bottom\s*:/i.test(body)&&/right\s*:/i.test(body)){
      const sel=m[1].trim().replace(/\s+/g," ").slice(-120);
      if(!/vnvEcosystemUtilityDock|vnvHeaderMenu|vnvEnrichedMenu|dialog|modal|launcher|overlay|backdrop/i.test(sel+" "+body)){
        found.push(sel);
      }
    }
  }
  for(const m of s.matchAll(/<([a-z0-9-]+)\b[^>]*style=["'][^"']*position\s*:\s*fixed[^"']*bottom\s*:[^"']*right\s*:[^"']*["'][^>]*>/gi)){
    found.push("INLINE:"+m[1]);
  }
  return [...new Set(found)];
}
function exportMarkers(s){
  const hits=[];
  const patterns=[
    /student[^\n<]{0,60}export/ig,
    /export[^\n<]{0,60}student/ig,
    /export\s+(?:my\s+)?(?:progress|report|record|grades?)/ig,
    /download[^\n<]{0,60}(?:progress|report|record|student)/ig
  ];
  for(const re of patterns) for(const m of s.matchAll(re)) hits.push(m[0].replace(/\s+/g," ").slice(0,120));
  return [...new Set(hits)].slice(0,12);
}

const rows=[];
for(const file of walk(ROOT).sort()){
  const s=fs.readFileSync(file,"utf8"), p=rel(file);
  const isRedirect=redirect(s);
  const hs=headers(s);
  rows.push({
    path:p,
    redirect:isRedirect,
    protected:protectedAssessment(p,s),
    headerLoader:count(/vnv-header-autopopulate\.js/gi,s),
    headerMount:count(/VNV_HEADER\??\.mount\s*\(/gi,s),
    toolbarLoader:count(/vnv-ecosystem-toolbar\.js/gi,s)+count(/khaemenes-landing-toolbar\.js/gi,s),
    interactiveHeaders:hs.filter(h=>h.interactive).length,
    headerCount:hs.length,
    lowerRight:lowerRightRules(s),
    exportHits:exportMarkers(s)
  });
}
const content=rows.filter(r=>!r.redirect);
const lower=content.filter(r=>r.lowerRight.length);
const exports=content.filter(r=>r.exportHits.length);
const interactive=content.filter(r=>r.interactiveHeaders);
const missingHeader=content.filter(r=>r.headerLoader===0||r.headerMount===0);
const missingToolbarLoader=content.filter(r=>r.toolbarLoader===0);
const protectedRows=content.filter(r=>r.protected);
console.log("ELEMENTARY GLOBAL CHROME AUDIT");
console.log("TOTAL_HTML="+rows.length);
console.log("REDIRECTS="+rows.filter(r=>r.redirect).length);
console.log("REAL_CONTENT="+content.length);
console.log("PROTECTED_ASSESSMENT_PAGES="+protectedRows.length);
console.log("OFFICIAL_HEADER_COMPLETE="+(content.length-missingHeader.length));
console.log("OFFICIAL_HEADER_MISSING_OR_PARTIAL="+missingHeader.length);
console.log("TOOLBAR_LOADER_PRESENT="+(content.length-missingToolbarLoader.length));
console.log("TOOLBAR_LOADER_MISSING="+missingToolbarLoader.length);
console.log("PAGES_WITH_INTERACTIVE_HEADER_CONTROLS="+interactive.length);
console.log("PAGES_WITH_COMPETING_LOWER_RIGHT_RULES="+lower.length);
console.log("PAGES_WITH_STUDENT_EXPORT_MARKERS="+exports.length);
console.log("\n[INTERACTIVE_HEADERS]");
interactive.forEach(r=>console.log(r.path+"|count="+r.interactiveHeaders));
console.log("\n[LOWER_RIGHT]");
lower.forEach(r=>console.log(r.path+"|"+r.lowerRight.join(" || ")));
console.log("\n[EXPORT_MARKERS]");
exports.forEach(r=>console.log(r.path+"|"+r.exportHits.join(" || ")));
