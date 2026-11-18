/* Grade01 local preservation export button — review branch only.
 * Does NOT use legacy records, import or modify source storage.
 * Saves a private JSON copy only by direct, informed user click.
 */
(function(w){
 "use strict";
 const API=w.KhaemenesGrade01PreservationV1;
 if(!API)return;
 const $=id=>w.document.getElementById(id);
 const parse=key=>{const raw=w.localStorage.getItem(key);return raw===null?null:JSON.parse(raw)};
 const statusOf=key=>{const raw=w.localStorage.getItem(key);if(raw===null)return "absent";JSON.parse(raw);return "present"};
 function reviewContext(){
   const registry=parse("khaemenes_family_registry_v1"),selected=parse("khaemenes_active_learner_v1"),familySelected=parse("khaemenes_active_family_v1");
   const learner=typeof selected==="string"?registry?.learners?.[selected]:null;
   const family=typeof familySelected==="string"?registry?.families?.[familySelected]:null;
   const match=learner&&family&&learner.learnerId===selected&&learner.familyId===familySelected&&family.familyId===familySelected&&
     Array.isArray(family.learnerIds)&&family.learnerIds.includes(selected)&&
     String(learner.grade||"").replace(/\D/g,"").padStart(2,"0")==="01"&&
     String(learner.stage||"").toLowerCase()==="elementary"&&learner.selfDirectedAdult!==true;
   return match?{learnerId:selected}:null;
 }
 function exportClicked(){
   const output=$("grade01PreservationStatus");
   let ctx;
   try{ctx=reviewContext()}catch{output.textContent="Export withheld: learner selection or family registry cannot be read.";return}
   if(!ctx){output.textContent="No locally linked Grade 1 learner. Nothing was read or exported.";return}
   const k="khaemenes.course:"+ctx.learnerId+":elementary-grade-01";
   let state;
   try{state=parse(k)}catch{output.textContent="Export withheld: selected course record is unreadable.";return}
   if(!state){output.textContent="No scoped Grade 1 course record found. Original storage remains untouched.";return}
   try{
     const attemptKey="khaemenes.elementary.assessment.attempts:"+ctx.learnerId+":grade-01";
     const ledgerKey="khaemenes_elementary_learning_ledger_v1";
     const attemptsPresence=statusOf(attemptKey),ledgerPresence=statusOf(ledgerKey);
     const savedAttempts=parse(attemptKey),ledger=parse(ledgerKey);
     // Absent independent evidence is not an empty verified archive.
     if(savedAttempts!==null&&!Array.isArray(savedAttempts))throw Error("Assessment history malformed");
     if(ledger!==null&&(!ledger||typeof ledger!=="object"||Array.isArray(ledger)))throw Error("Learning ledger malformed");
     const ownLedger=ledger?.[ctx.learnerId]??[];
     if(!Array.isArray(ownLedger))throw Error("Learner ledger malformed");
     const bundle=API.build({learnerId:ctx.learnerId,courseRecord:state,attempts:savedAttempts??[],
       evidenceSourcePresence:{attempts:attemptsPresence,ledger:ledgerPresence},
       ledgerEntries:ownLedger,legacyExists:w.localStorage.getItem("khaemenes.grade01.mastery.v1")!==null||
         w.localStorage.getItem("khaemenes_grade1_36_aplus_v1")!==null,
       favoritesExist:w.localStorage.getItem("khaemenes_grade1_favorite_adventures_v1")!==null});
     const repeat=reviewContext();
     if(!repeat||repeat.learnerId!==ctx.learnerId)throw Error("Selected learner changed");
     const bytes=JSON.stringify(bundle,null,2);
     const blob=new Blob([bytes],{type:"application/json"}),url=URL.createObjectURL(blob);
     const a=w.document.createElement("a");
     a.href=url;a.download="khaemenes-grade01-private-preservation-review.json";
     a.click();
     w.setTimeout(()=>URL.revokeObjectURL(url),1500);
     output.textContent="Private local copy requested. Confirm the browser saved the file and preserve the original records. Not cloud-synced.";
   }catch{
     output.textContent="Export withheld: evidence or learner ownership needs review. Original records were not changed.";
   }
 }
 function mount(){
   if($("grade01PreservationExport"))return;
   const host=$("grade01FamilyReporting")?.querySelector(".card");
   if(!host)return;
   const text=w.document.createElement("p");
   text.textContent="Optional local preservation copy for a matching Grade 1 learner. This does not include unassigned legacy work, does not verify grades, and never uploads to Account Cloud.";
   text.style.cssText="font:400 16px/1.6 Arial,sans-serif;text-align:center";
   const button=w.document.createElement("button");
   button.id="grade01PreservationExport";button.type="button";
   button.textContent="Export";
   button.style.cssText="font:400 16px Arial,sans-serif;min-height:48px;padding:10px 22px;border-radius:7px;background:#243038;color:#fff8e9;border:1px solid #b48b45;cursor:pointer";
   const status=w.document.createElement("p");
   status.id="grade01PreservationStatus";status.setAttribute("role","status");
   status.textContent="No export has been performed.";
   status.style.cssText="font:400 16px/1.6 Arial,sans-serif;text-align:center";
   host.append(text,button,status);
   button.addEventListener("click",exportClicked);
 }
 if(w.document.readyState==="loading")w.document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
