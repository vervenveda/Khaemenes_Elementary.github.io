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
const HEADER_SRC="https://vervenveda.com/assets/vnv-header-autopopulate.js";
const CANONICAL=[
  `<script src="${HEADER_SRC}"></script>`,
  `<script data-vnv-elementary-header-contract="v1">`,
  `window.VNV_HEADER?.mount({`,
  `  title:"Khaemenes Elementary Academy",`,
  `  subtitle:"Grades 01–05",`,
  `  icon:"K",`,
  `  home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",`,
  `  replaceLegacy:true,`,
  `  legacySelectors:["[data-vnv-header-legacy]","header.site-header","header[data-khae-header]","body > header:not(#vnvHeaderAutoPopulate)"],`,
  `  actions:[`,
  `    {label:"Academy Home",href:"https://vervenveda.com/Khaemenes_Academy.github.io/"},`,
  `    {label:"Student Profile",href:"https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/"},`,
  `    {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},`,
  `    {label:"Teacher",href:"https://vervenveda.com/Khaemenes_Academy.github.io/teacher-admin/"},`,
  `    {label:"Middle School",href:"https://vervenveda.com/Khaemenes_Middle.github.io/"}`,
  `  ]`,
  `});`,
  `</script>`
].join("\n");
const LOADER=/<script\b[^>]*\bsrc=["\'][^"\']*vnv-header-autopopulate\.js[^"\']*["\'][^>]*>\s*<\/script>\s*/gi;
const MOUNT_SCRIPT=/<script\b(?![^>]*\bsrc=)[^>]*>(?:(?!<\/script>)[\s\S])*?\bVNV_HEADER\??\.mount\s*\((?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi;

function target(rel){return TARGETS.some(re=>re.test(rel))}
function walk(dir,out=[]){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules"].includes(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p,out);
  else if(e.isFile()&&e.name==="index.html"){
   const rel=path.relative(ROOT,p).split(path.sep).join("/");
   if(target(rel))out.push({p,rel});
  }
 }
 return out;
}
function markLegacyHeaders(s){
 return s.replace(/<header\b(?![^>]*\bdata-vnv-header-legacy\b)([^>]*)>/gi,
   '<header data-vnv-header-legacy$1>');
}
function preservePortfolioControls(s){
 const re=/<header\b[^>]*>([\s\S]*?\bid=["\']scanBtn["\'][\s\S]*?\bid=["\']printTop["\'][\s\S]*?)<\/header>/i;
 if(!re.test(s))throw new Error("Portfolio operational control header not found; refusing unsafe rewrite.");
 s=s.replace(re,'<section class="portfolio-page-controls no-print" data-vnv-page-controls aria-label="Portfolio controls">$1</section>');
 if(!/id=["\']portfolioPageControlsStyle["\']/.test(s)){
   s=s.replace("</head>",'<style id="portfolioPageControlsStyle">\n.portfolio-page-controls{position:relative;z-index:40;background:rgba(255,254,250,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(14px)}\n.portfolio-page-controls .nav{min-height:66px}\n@media print{.portfolio-page-controls{display:none!important}}\n</style></head>');
 }
 return s;
}
function interactiveHeaderBlocks(s){
 return [...s.matchAll(/<header\b[^>]*>([\s\S]*?)<\/header>/gi)]
  .filter(m=>/<(?:button|input|select|textarea)\b/i.test(m[1]))
  .map(m=>m[0].slice(0,220));
}
const changed=[];
for(const {p,rel} of walk(ROOT).sort((a,b)=>a.rel.localeCompare(b.rel))){
 let s=fs.readFileSync(p,"utf8");
 if(rel==="grades/portfolio/index.html")s=preservePortfolioControls(s);
 const interactive=interactiveHeaderBlocks(s);
 if(interactive.length)throw new Error("Interactive controls remain inside a header on "+rel+": "+interactive.join(" | "));
 s=s.replace(LOADER,"").replace(MOUNT_SCRIPT,"");
 s=markLegacyHeaders(s);
 const tickerInvocation=/<script\b[^>]*>[\s\S]*?\bVNV_TICKER\??\.autoPopulate\s*\([\s\S]*?<\/script>/gi;
 const matches=[...s.matchAll(tickerInvocation)];
 if(matches.length){
   const m=matches[matches.length-1];
   const end=m.index+m[0].length;
   s=s.slice(0,end)+"\n"+CANONICAL+s.slice(end);
 }else if(/<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js/i.test(s)){
   s=s.replace(/<script\b[^>]*\bsrc=["\'][^"\']*vnv-ecosystem-toolbar\.js[^"\']*["\'][^>]*>\s*<\/script>/i,
     CANONICAL+"\n$&");
 }else if(/<\/body\s*>/i.test(s)){
   s=s.replace(/<\/body\s*>/i,CANONICAL+"\n</body>");
 }else throw new Error("No safe canonical header insertion point in "+rel);
 fs.writeFileSync(p,s,"utf8");
 changed.push(rel);
}
console.log("NORMALIZED_LANDINGS="+changed.length);
changed.forEach(p=>console.log(p));
if(changed.length!==49)throw new Error("Expected 49 landing pages, got "+changed.length);