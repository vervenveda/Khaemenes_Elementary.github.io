#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Elementary.github.io/assets/elementary-global-standard-v1.js" defer data-elementary-global-standard="16-33-66-chrome-semantics"></script>\n';
const LOADER=/elementary-global-standard-v1\.js/i;

function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}
function inject(source){
  if(LOADER.test(source))return source;
  if(/<\/head>/i.test(source))return source.replace(/<\/head>/i,TAG+"</head>");
  if(/<body\b/i.test(source))return source.replace(/<body\b/i,TAG+"<body");
  return TAG+source;
}
const files=walk(ROOT).filter(f=>/\.html?$/i.test(f)).sort();
let covered=0,changed=0;
for(const file of files){
  const abs=path.join(ROOT,file);
  let s=fs.readFileSync(abs,"utf8");
  if(LOADER.test(s)){covered++;continue}
  if(WRITE){s=inject(s);fs.writeFileSync(abs,s);covered++;changed++}
}

const guard=fs.readFileSync(path.join(ROOT,"assets/elementary-global-standard-v1.js"),"utf8");
const checks=[
 ["16px readable floor",/size<16[\s\S]{0,180}font-size","16px","important"/],
 ["33px heading rule",/font-size:33px!important/],
 ["66px primary-title rule",/font-size:66px!important/],
 ["333 ticker loader",/vnv-333-ticker\.js/],
 ["AutoPopulate ticker loader",/vnv-ticker-autopopulate\.js/],
 ["official header",/vnv-header-autopopulate\.js[\s\S]*VNV_HEADER/],
 ["official toolbar",/vnv-ecosystem-toolbar\.js[\s\S]*vnvEcosystemUtilityDock/],
 ["semantic authority",/khaemenesHierarchy="title-description-v1"/]
];
const failures=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);
console.log(JSON.stringify({
  mode:WRITE?"write":"check",
  htmlFiles:files.length,
  covered,changed,missing:files.length-covered,
  assertionFailures:failures,
  standard:{
    typography:"16 / 33 / 66",
    semantic:"eyebrow = category/brand; title = heading; description = paragraph",
    chrome:"333 -> AutoPopulate -> header/menu -> lower-right 3x2 toolbar"
  }
},null,2));
if(files.length!==covered||failures.length)process.exitCode=1;
