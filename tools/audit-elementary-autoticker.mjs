import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const SKIP_DIRS=new Set([".git","node_modules"]);
const LOADER=/vnv-ticker-autopopulate\.js/i;
const INVOKE=/\b(?:window\.)?VNV_TICKER\?*\.autoPopulate\s*\(/i;
const ROOT_ID=/id=["']vnvTickerAutoPopulate["']/i;

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
function isCompatibilityRedirect(html){
  const refresh=/<meta[^>]+http-equiv=["']?refresh["']?/i.test(html);
  const canonical=/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)||/<link[^>]+href=[^>]+rel=["']canonical["']/i.test(html);
  const replace=/\blocation\.replace\s*\(/i.test(html);
  return refresh&&canonical&&replace;
}
const files=walk(ROOT).sort();
const rows=[];
for(const file of files){
  const html=fs.readFileSync(file,"utf8");
  const loader=(html.match(new RegExp(LOADER.source,"gi"))||[]).length;
  const invoke=(html.match(new RegExp(INVOKE.source,"gi"))||[]).length;
  const root=(html.match(new RegExp(ROOT_ID.source,"gi"))||[]).length;
  const redirect=isCompatibilityRedirect(html);
  const hrefs=[...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map(m=>String(m[1]||"").trim())
    .filter(h=>h&&!/^(?:javascript:|mailto:|tel:|#?$)/i.test(h));
  rows.push({path:rel(file),redirect,loader,invoke,root,hrefs:hrefs.length,
    fallback:/data-vnv-ticker-fallback/i.test(html),
    legacy333:/networkTicker|333 Network application ticker|khaeNetworkTicker/i.test(html)});
}
const content=rows.filter(r=>!r.redirect);
const redirects=rows.filter(r=>r.redirect);
const compliant=content.filter(r=>r.loader===1&&r.invoke===1);
const missing=content.filter(r=>r.loader===0||r.invoke===0);
const duplicate=content.filter(r=>r.loader>1||r.invoke>1||r.root>1);
const partial=content.filter(r=>(r.loader===1)!==(r.invoke===1));
const with333=content.filter(r=>r.legacy333).length;
const noUsableLinks=content.filter(r=>r.hrefs===0);
const fallback=content.filter(r=>r.fallback);
const unrenderable=content.filter(r=>r.hrefs===0&&!r.fallback);
const unnecessaryFallback=content.filter(r=>r.hrefs>0&&r.fallback);

console.log("ELEMENTARY AUTOTICKER AUDIT");
console.log("TOTAL_HTML="+rows.length);
console.log("COMPATIBILITY_REDIRECTS="+redirects.length);
console.log("CONTENT_PAGES="+content.length);
console.log("COMPLIANT="+compliant.length);
console.log("MISSING_OR_INCOMPLETE="+missing.length);
console.log("PARTIAL="+partial.length);
console.log("DUPLICATE="+duplicate.length);
console.log("CONTENT_WITH_333_OR_NETWORK_TICKER="+with333);
console.log("CONTENT_WITH_NO_USABLE_LINKS="+noUsableLinks.length);
console.log("CONTENT_WITH_APPROVED_FALLBACK="+fallback.length);
console.log("UNRENDERABLE="+unrenderable.length);
console.log("UNNECESSARY_FALLBACK="+unnecessaryFallback.length);
for(const [label,list] of [["MISSING",missing],["PARTIAL",partial],["DUPLICATE",duplicate],["NO_USABLE_LINKS",noUsableLinks],["UNRENDERABLE",unrenderable],["UNNECESSARY_FALLBACK",unnecessaryFallback]]){
  console.log("\n["+label+"] "+list.length);
  list.slice(0,4000).forEach(r=>console.log(`${r.path}|loader=${r.loader}|invoke=${r.invoke}|root=${r.root}|333=${r.legacy333}`));
}
if(missing.length||duplicate.length||partial.length||unrenderable.length||unnecessaryFallback.length)process.exitCode=2;
