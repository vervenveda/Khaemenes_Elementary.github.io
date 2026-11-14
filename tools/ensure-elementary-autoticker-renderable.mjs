import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const SKIP=new Set([".git","node_modules"]);
const STANDARD='<script>window.VNV_TICKER?.autoPopulate({max:14,cleanLegacy:false});</script>';
const FALLBACK=`<script data-vnv-ticker-fallback>
(()=>{const discovered=window.VNV_TICKER?.discover?.({max:14})||[];
window.VNV_TICKER?.autoPopulate({max:14,cleanLegacy:false,links:discovered.length?discovered:[
{label:"Elementary Home",href:"https://vervenveda.com/Khaemenes_Elementary.github.io/"},
{label:"Student Profile",href:"https://vervenveda.com/Khaemenes_Elementary.github.io/student-profile/"},
{label:"Family Portal",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
{label:"Verve N Veda",href:"https://vervenveda.com/"}
]});})();
</script>`;

function walk(dir,out=[]){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(SKIP.has(e.name))continue;
  const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p,out);
  else if(e.isFile()&&e.name.toLowerCase().endsWith(".html"))out.push(p);
 }
 return out;
}
function rel(p){return path.relative(ROOT,p).split(path.sep).join("/")}
function redirect(s){
 return /<meta[^>]+http-equiv=["']?refresh["']?/i.test(s)&&
 /<link[^>]+rel=["']canonical["'][^>]*>|<link[^>]+href=[^>]+rel=["']canonical["']/i.test(s)&&
 /\blocation\.replace\s*\(/i.test(s);
}
function usableLinks(s){
 return [...s.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
  .map(m=>String(m[1]||"").trim())
  .filter(h=>h&&!/^(?:javascript:|mailto:|tel:|#?$)/i.test(h)).length;
}

const changed=[];
for(const file of walk(ROOT).sort()){
 let s=fs.readFileSync(file,"utf8");
 if(redirect(s)||usableLinks(s)>0||/data-vnv-ticker-fallback/i.test(s))continue;
 if(!s.includes(STANDARD))throw new Error("Expected standard ticker invocation on no-link page: "+rel(file));
 s=s.replace(STANDARD,FALLBACK);
 fs.writeFileSync(file,s,"utf8");
 changed.push(rel(file));
}
console.log("FALLBACK_TICKER_PAGES="+changed.length);
changed.forEach(p=>console.log(p));
if(changed.length!==20)throw new Error("Expected exactly 20 no-link fallback pages, got "+changed.length);
