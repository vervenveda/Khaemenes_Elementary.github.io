import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd(),SKIP=new Set([".git","node_modules"]);
function walk(d,o=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(SKIP.has(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p,o);else if(e.isFile()&&/\.html?$/i.test(e.name))o.push(p)}return o}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/")}
function redirect(s){return /<meta[^>]+http-equiv=["\']?refresh["\']?/i.test(s)&&/location\.replace\s*\(/i.test(s)}
function count(re,s){return (s.match(re)||[]).length}
function lowerRight(s){const out=[];for(const m of s.matchAll(/([^{}]{0,180})\{([^{}]*position\s*:\s*fixed[^{}]*)\}/gi)){if(/bottom\s*:/i.test(m[2])&&/right\s*:/i.test(m[2])){const v=(m[1]+" "+m[2]);if(!/vnvEcosystemUtilityDock|dialog|modal|launcher|overlay|backdrop|confettiCanvas/i.test(v))out.push(m[1].trim().slice(-100))}}return out}
const rows=[];for(const f of walk(ROOT).sort()){const s=fs.readFileSync(f,"utf8"),p=rel(f);if(redirect(s))continue;const prot=/\/(quiz|quizzes|exam|exams|assessment|assessments)\//i.test("/"+p)||/data-closed-book/i.test(s);rows.push({p,prot,headerLoader:count(/vnv-header-autopopulate\.js/gi,s),contract:count(/data-vnv-elementary-header-contract=["\']v2["\']/gi,s),toolbar:count(/vnv-ecosystem-toolbar\.js/gi,s)+count(/khaemenes-landing-toolbar\.js/gi,s),unmarked:count(/<header\b(?![^>]*data-vnv-header-legacy)(?![^>]*id=["\']vnvHeaderAutoPopulate["\'])[^>]*>/gi,s),interactiveHeader:[...s.matchAll(/<header\b[^>]*>([\s\S]*?)<\/header>/gi)].filter(m=>/<(?:button|input|select|textarea)\b/i.test(m[1])).length,lower:lowerRight(s)});}
const badHeader=rows.filter(r=>r.headerLoader!==1||r.contract!==1);
const badToolbar=rows.filter(r=>r.toolbar!==1);
const badInteractive=rows.filter(r=>r.interactiveHeader);
const lower=rows.filter(r=>r.lower.length);
console.log("GLOBAL_CHROME_VALIDATION");
console.log("REAL_CONTENT="+rows.length);
console.log("HEADER_COMPLIANT="+(rows.length-badHeader.length));
console.log("HEADER_NONCOMPLIANT="+badHeader.length);
console.log("TOOLBAR_LOADER_COMPLIANT="+(rows.length-badToolbar.length));
console.log("TOOLBAR_LOADER_NONCOMPLIANT="+badToolbar.length);
console.log("PROTECTED_ASSESSMENT_PAGES="+rows.filter(r=>r.prot).length);
console.log("INTERACTIVE_CONTROLS_LEFT_IN_HEADERS="+badInteractive.length);
console.log("COMPETING_LOWER_RIGHT_PAGES="+lower.length);
badHeader.slice(0,100).forEach(r=>console.log("BAD_HEADER|"+r.p));
badToolbar.slice(0,100).forEach(r=>console.log("BAD_TOOLBAR|"+r.p));
badInteractive.slice(0,100).forEach(r=>console.log("BAD_INTERACTIVE_HEADER|"+r.p));
lower.slice(0,100).forEach(r=>console.log("BAD_LOWER_RIGHT|"+r.p+"|"+r.lower.join(" || ")));
if(rows.length!==1689||badHeader.length||badToolbar.length||badInteractive.length||lower.length)process.exitCode=2;