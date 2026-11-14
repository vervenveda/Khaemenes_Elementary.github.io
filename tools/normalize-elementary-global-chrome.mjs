import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd();
const SKIP=new Set([".git","node_modules"]);
const HEADER_SRC="https://vervenveda.com/assets/vnv-header-autopopulate.js";
const TOOLBAR_SRC="https://vervenveda.com/assets/vnv-ecosystem-toolbar.js";
const HEADER_CONTRACT=[
`<script src="${HEADER_SRC}"></script>`,
`<script data-vnv-elementary-header-contract="v2">`,
`window.VNV_HEADER?.mount({`,
` title:"Khaemenes Elementary Academy",`,
` subtitle:"Grades 01–05",`,
` icon:"K",`,
` home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",`,
` replaceLegacy:true,`,
` legacySelectors:["[data-vnv-header-legacy]"],`,
` actions:[`,
`  {label:"Academy Home",href:"https://vervenveda.com/Khaemenes_Academy.github.io/"},`,
`  {label:"Student Profile",href:"https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/"},`,
`  {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},`,
`  {label:"Teacher",href:"https://vervenveda.com/Khaemenes_Academy.github.io/teacher-admin/"},`,
`  {label:"Middle School",href:"https://vervenveda.com/Khaemenes_Middle.github.io/"}`,
` ]`,
`});`,
`</script>`
].join("\n");
const CONTROL_STYLE=`<style data-vnv-page-controls-style>
[data-vnv-page-controls]{position:relative;z-index:40;border-bottom:1px solid rgba(18,23,19,.14);background:rgba(255,253,248,.97);color:inherit}
[data-vnv-page-controls]>.wrap,[data-vnv-page-controls]>.shell{padding-top:14px;padding-bottom:14px}
@media print{[data-vnv-page-controls]{display:none!important}}
</style>`;
function walk(dir,out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(SKIP.has(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p,out);else if(e.isFile()&&/\.html?$/i.test(e.name))out.push(p)}return out}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/")}
function redirect(s){return /<meta[^>]+http-equiv=["\']?refresh["\']?/i.test(s)&&/location\.replace\s*\(/i.test(s)}
function addClass(attrs,name){if(/\bclass=["\'][^"\']*["\']/i.test(attrs))return attrs.replace(/\bclass=(["\'])([^"\']*)\1/i,(m,q,v)=>`class=${q}${v} ${name}${q}`);return attrs+` class="${name}"`}
function normalizeHeaders(s){let interactive=0,legacy=0;s=s.replace(/<header\b([^>]*)>([\s\S]*?)<\/header>/gi,(full,attrs,body)=>{
 if(/data-vnv-header-legacy|id=["\']vnvHeaderAutoPopulate["\']/i.test(attrs))return full;
 if(/<(?:button|input|select|textarea)\b/i.test(body)){interactive++;const a=addClass(attrs,"vnv-page-controls");return `<section data-vnv-page-controls${a}>${body}</section>`}
 legacy++;return `<header data-vnv-header-legacy${attrs}>${body}</header>`;
});return {s,interactive,legacy}}
function removeExistingHeaderContract(s){
 s=s.replace(/<script\b[^>]*\bsrc=["\'][^"\']*vnv-header-autopopulate\.js[^"\']*["\'][^>]*>\s*<\/script>\s*/gi,"");
 s=s.replace(/<script\b[^>]*data-vnv-elementary-header-contract[^>]*>(?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi,"");
 s=s.replace(/<script\b(?![^>]*\bsrc=)[^>]*>(?:(?!<\/script>)[\s\S])*?\bVNV_HEADER\??\.mount\s*\((?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi,"");
 return s;
}
function ensureToolbarLoader(s){
 if(/vnv-ecosystem-toolbar\.js/i.test(s)||/khaemenes-landing-toolbar\.js/i.test(s))return s;
 const tag=`<script src="${TOOLBAR_SRC}"></script>`;
 return /<\/body\s*>/i.test(s)?s.replace(/<\/body\s*>/i,tag+"\n</body>"):s+"\n"+tag+"\n";
}
function insertHeader(s){
 const ticker=/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?\bVNV_TICKER\??\.autoPopulate\s*\((?:(?!<\/script>)[\s\S])*?<\/script>/gi;
 const ms=[...s.matchAll(ticker)];
 if(ms.length){const m=ms[ms.length-1],end=m.index+m[0].length;return s.slice(0,end)+"\n"+HEADER_CONTRACT+s.slice(end)}
 if(/<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js/i.test(s))return s.replace(/<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>\s*<\/script>/i,HEADER_CONTRACT+"\n$&");
 if(/<\/body\s*>/i.test(s))return s.replace(/<\/body\s*>/i,HEADER_CONTRACT+"\n</body>");
 throw new Error("No header insertion point");
}
let content=0,changed=0,interactiveTotal=0,legacyTotal=0,protectedCount=0;
for(const file of walk(ROOT).sort()){let s=fs.readFileSync(file,"utf8");const p=rel(file);if(redirect(s))continue;content++;if(/\/(quiz|quizzes|exam|exams|assessment|assessments)\//i.test("/"+p)||/data-closed-book/i.test(s))protectedCount++;
 const before=s;s=removeExistingHeaderContract(s);const h=normalizeHeaders(s);s=h.s;interactiveTotal+=h.interactive;legacyTotal+=h.legacy;
 if(h.interactive&&!/data-vnv-page-controls-style/i.test(s))s=s.replace(/<\/head\s*>/i,CONTROL_STYLE+"\n</head>");
 s=ensureToolbarLoader(s);s=insertHeader(s);
 if(s!==before){fs.writeFileSync(file,s,"utf8");changed++}
}
console.log("REAL_CONTENT="+content);
console.log("CHANGED="+changed);
console.log("INTERACTIVE_HEADERS_CONVERTED="+interactiveTotal);
console.log("LEGACY_HEADERS_MARKED="+legacyTotal);
console.log("PROTECTED_ASSESSMENT_PAGES="+protectedCount);
if(content!==1689)throw new Error("Unexpected real-content topology "+content);
if(interactiveTotal!==49)throw new Error("Unexpected interactive header count "+interactiveTotal);