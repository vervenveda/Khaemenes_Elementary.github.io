import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const SKIP_DIRS=new Set([".git","node_modules"]);
const LOADER=/<script\b[^>]*\bsrc=["'][^"']*vnv-ticker-autopopulate\.js[^"']*["'][^>]*>\s*<\/script>/gi;
const INVOKE=/<script\b[^>]*>[^<]*\b(?:window\.)?VNV_TICKER\?*\.autoPopulate\s*\([^<]*<\/script>/gi;
const BLOCK=`<!-- Verve N Veda · canonical auto-populating page-link ticker -->
<script src="https://vervenveda.com/assets/vnv-ticker-autopopulate.js" data-vnv-ticker-autopopulate></script>
<script>window.VNV_TICKER?.autoPopulate({max:14,cleanLegacy:false});</script>`;

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP_DIRS.has(e.name))continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory())walk(p,out);
    else if(e.isFile()&&e.name.toLowerCase().endsWith(".html"))out.push(p);
  }
  return out;
}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/")}
function redirect(html){
  return /<meta[^>]+http-equiv=["']?refresh["']?/i.test(html)&&
         /<link[^>]+rel=["']canonical["'][^>]*>|<link[^>]+href=[^>]+rel=["']canonical["']/i.test(html)&&
         /\blocation\.replace\s*\(/i.test(html);
}
function count(re,s){return (s.match(re)||[]).length}

const files=walk(ROOT).sort(),changed=[],already=[],redirects=[];
for(const file of files){
  let html=fs.readFileSync(file,"utf8");
  if(redirect(html)){redirects.push(rel(file));continue}
  const loaders=count(new RegExp(LOADER.source,"gi"),html);
  const invokes=count(new RegExp(INVOKE.source,"gi"),html);
  if(loaders===1&&invokes===1){already.push(rel(file));continue}
  if(loaders>1||invokes>1)throw new Error(`Refusing duplicate ticker authority in ${rel(file)} loader=${loaders} invoke=${invokes}`);

  // Repair a partial implementation by removing its lone half before inserting one canonical block.
  if(loaders===1&&invokes===0)html=html.replace(LOADER,"");
  if(loaders===0&&invokes===1)html=html.replace(INVOKE,"");

  if(/<\/body\s*>/i.test(html)) html=html.replace(/<\/body\s*>/i,BLOCK+"\n</body>");
  else if(/<\/html\s*>/i.test(html)) html=html.replace(/<\/html\s*>/i,BLOCK+"\n</html>");
  else html+="\n"+BLOCK+"\n";

  fs.writeFileSync(file,html,"utf8");
  changed.push(rel(file));
}
const report={
 schema:"khaemenes-elementary-autoticker-normalization-v1",
 canonicalSource:"https://vervenveda.com/assets/vnv-ticker-autopopulate.js",
 invocation:"window.VNV_TICKER?.autoPopulate({max:14,cleanLegacy:false})",
 html:files.length,redirects:redirects.length,already:already.length,changed:changed.length,
 changedFiles:changed
};
fs.writeFileSync(".elementary-autoticker-normalization.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({...report,changedFiles:undefined},null,2));
