/* Grade 01 · opt-in chrome / title flash forensic probe v1
 * Enable only with ?chrome_audit=1 (also accepts &title_audit=1).
 * Read-only: never accesses cookies, learner storage, network or registry.
 * Runs early in <head> to observe before and after stylesheet/script application.
 */
(()=>{"use strict";
const qs=new URLSearchParams(location.search);
if(!(qs.get("chrome_audit")==="1"||qs.get("title_audit")==="1")||window.KhaemenesGrade01ChromeAudit)return;
const started=performance.now(),history=[],transitions=[],errors=[];
const TARGETS=[
 ["Primary title","main.hero h1"],
 ["Start heading","main.hero h2"],
 ["Progress heading","main.hero aside h2"],
 ["Week heading",".section > .shell > h2"],
 ["Family heading","#grade01FamilyReportingTitle"]
];
const CHROME=[["333 ticker","vnv333NetworkTicker"],["Auto ticker","vnvTickerAutoPopulate"],["VNV header","vnvHeaderAutoPopulate"],["Left tools","vnvClassToolsToolbar"],["Right tools","vnvEcosystemUtilityDock"]];
const elapsed=()=>Math.round(performance.now()-started);
const safe=(x,max=150)=>String(x??"").slice(0,max);
let lastKey="",frameCount=0,panel,pre,queued=false,closed=false,lastRecorded=-1;
function titleMetrics(){
 return TARGETS.map(([name,sel])=>{
   const el=document.querySelector(sel);
   if(!el)return {name,status:"missing"};
   const cs=getComputedStyle(el),rect=el.getBoundingClientRect();
   return {name,status:"present",fontSize:cs.fontSize,fontFamily:safe(cs.fontFamily,90),
     lineHeight:cs.lineHeight,fontWeight:cs.fontWeight,
     width:Math.round(rect.width),height:Math.round(rect.height),
     primary:el.getAttribute("data-khaemenes-primary-title")==="true"};
 });
}
function chromeMetrics(){
 return CHROME.map(([name,id])=>{
   const all=document.querySelectorAll("#"+id),el=all[0];
   if(!el)return {name,count:0};
   const cs=getComputedStyle(el),rect=el.getBoundingClientRect();
   return {name,count:all.length,visible:cs.display!=="none"&&cs.visibility!=="hidden"&&rect.width>0&&rect.height>0,
     width:Math.round(rect.width),height:Math.round(rect.height),parent:el.parentElement?.tagName||"?"};
 });
}
function log(note){const record={at:elapsed(),note:safe(note,170)};
 history.push(record);if(history.length>100)history.shift();draw();}
function sample(reason){
 if(!document.body)return;
 const headings=titleMetrics(),p=headings[0];
 const key=headings.map(x=>[x.name,x.fontSize,x.fontFamily,x.primary,x.width,x.height].join("|")).join(";");
 if(key!==lastKey){
   lastKey=key;
   transitions.push({at:elapsed(),reason:safe(reason,50),headings});
   if(transitions.length>65)transitions.shift();
   lastRecorded=elapsed();draw();
 }
}
function report(){
 const headings=titleMetrics(),chrome=chromeMetrics();
 const styles=[...document.querySelectorAll("link[rel=stylesheet],style")].map(el=>({
   kind:el.tagName.toLowerCase(),source:el.tagName==="LINK"?safe(el.getAttribute("href"),140):(el.id||"inline-style"),
   loaded:el.tagName==="LINK"?Boolean(el.sheet):true
 })).slice(0,45);
 return {version:"1.0.0",mode:"OPT_IN_READ_ONLY",elapsedMs:elapsed(),
   viewport:{width:innerWidth,height:innerHeight},headings,chrome,styles,
   titleTransitions:transitions.slice(),timeline:history.slice(),errors:errors.slice(),
   studentDataRead:false,storageWrites:false,networkRequests:false};
}
function outputText(){
 const r=report();
 const lines=["GRADE 01 · CHROME & TITLE FORENSIC (opt-in, no learner data)",
 "Elapsed: "+r.elapsedMs+" ms · viewport "+r.viewport.width+" × "+r.viewport.height,
 "", "Current titles:"];
 for(const h of r.headings)lines.push(h.name+": "+(h.status==="missing"?"MISSING":h.fontSize+" / "+h.fontFamily+" / "+h.lineHeight+" · "+(h.primary?"PRIMARY":"normal")+" · "+h.width+"×"+h.height));
 lines.push("","Current chrome:");
 for(const c of r.chrome)lines.push(c.name+": "+c.count+" instance(s)"+(c.count?" · "+(c.visible?"visible":"hidden")+" · "+c.width+"×"+c.height+" parent "+c.parent:""));
 lines.push("","FONT TRANSITIONS:");
 for(const t of r.titleTransitions.slice(-25))lines.push(t.at+"ms "+t.reason+" · "+t.headings.slice(0,4).map(x=>x.name+"="+(x.fontSize||"?")+(x.primary?"*":"")).join(" · "));
 lines.push("","STYLESHEETS:");
 for(const st of r.styles)lines.push((st.loaded?"READY ":"PENDING ")+st.source);
 lines.push("","EVENTS:");
 for(const x of r.timeline.slice(-25))lines.push(x.at+"ms "+x.note);
 if(r.errors.length)lines.push("","ERRORS:",...r.errors.slice(-10));
 lines.push("","* denotes selected primary heading. All measures are read-only.");
 return lines.join("\n");
}
function draw(){
 if(closed||!pre||queued)return;
 queued=true;requestAnimationFrame(()=>{queued=false;if(pre)pre.textContent=outputText()});
}
function mountPanel(){
 if(panel||closed||!document.body)return;
 panel=document.createElement("aside");panel.id="grade01ChromeAuditPanel";
 panel.setAttribute("aria-label","Opt-in Grade 1 title and chrome diagnostics");
 panel.style.cssText="position:fixed!important;z-index:2147483647!important;left:10px;bottom:10px;width:min(740px,calc(100vw - 20px));max-height:65dvh;overflow:auto;padding:12px 16px;border:2px solid #b48b45;border-radius:7px;background:#243038!important;color:#fff8e9!important;font:400 16px/1.4 ui-monospace,monospace!important;box-shadow:0 14px 45px #0009";
 const title=document.createElement("strong");title.textContent="Grade 01 · Title Flash Forensic";title.style.cssText="display:block;font-size:20px;color:#fff8e9;margin-bottom:9px";
 const row=document.createElement("div");row.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px";
 const copy=document.createElement("button");copy.textContent="Copy Report";copy.type="button";
 const close=document.createElement("button");close.textContent="Close";close.type="button";
 for(const button of [copy,close])button.style.cssText="padding:9px 12px;border:1px solid #b48b45;border-radius:7px;background:#fff8e9;color:#243038;font:400 16px Arial,sans-serif;cursor:pointer";
 copy.addEventListener("click",()=>{const text=outputText();if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>{copy.textContent="Copied"}).catch(()=>{copy.textContent="Select report text to copy"});else copy.textContent="Select report text to copy"});
 close.addEventListener("click",()=>{closed=true;panel.remove();panel=null;pre=null});
 row.append(copy,close);
 pre=document.createElement("pre");pre.style.cssText="margin:0;white-space:pre-wrap;overflow-wrap:anywhere;background:transparent;color:#fff8e9;font:400 16px/1.5 ui-monospace,monospace";
 panel.append(title,row,pre);document.body.append(panel);draw();
}
function monitor(){
 sample("initial DOM");
 const root=document.documentElement;
 const observer=new MutationObserver(records=>{
   let relevant=false;
   for(const r of records){
     if(panel&&(r.target===panel||panel.contains(r.target)))continue;
     if(r.type==="attributes"){
       if(r.attributeName==="style"||r.attributeName==="class"||r.attributeName==="data-khaemenes-primary-title"){relevant=true;break}
     }else if(r.addedNodes.length||r.removedNodes.length){relevant=true;break}
   }
   if(relevant)sample("DOM/style mutation");
 });
 observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style","data-khaemenes-primary-title"]});
 function trackFrame(){
   frameCount++;sample("animation frame");
   if(performance.now()-started<6000&&frameCount<500)requestAnimationFrame(trackFrame);
   else{log("6-second startup capture complete");observer.disconnect()}
 }
 requestAnimationFrame(trackFrame);
}
window.addEventListener("error",e=>{
 const msg=e.target&&e.target!==window&&e.target.tagName==="SCRIPT"?"SCRIPT LOAD ERROR":"JS ERROR";
 const note=msg+": "+safe(e.message||(e.target?.src||""),170);
 errors.push(note);log(note);
},true);
window.addEventListener("unhandledrejection",e=>{const note="PROMISE REJECTION: "+safe(e.reason?.message||e.reason||"unknown",160);errors.push(note);log(note)});
document.addEventListener("DOMContentLoaded",()=>{mountPanel();log("DOMContentLoaded");sample("DOMContentLoaded")},{once:true});
window.addEventListener("load",()=>{log("window load");sample("window load")},{once:true});
window.addEventListener("pageshow",()=>{log("pageshow");sample("pageshow")});
window.KhaemenesGrade01ChromeAudit=Object.freeze({version:"1.0.0",snapshot:report,events:()=>history.slice(),report:outputText});
log("Early head diagnostic armed");
if(document.body){mountPanel();monitor()}else{
 const ready=new MutationObserver((_,o)=>{if(document.body){o.disconnect();mountPanel();monitor()}});
 ready.observe(document.documentElement,{childList:true,subtree:true});
}
})();
