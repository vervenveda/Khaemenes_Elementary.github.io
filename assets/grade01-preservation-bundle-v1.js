/* Grade 01 preservation bundle — review branch only.
 * Produces an explicitly unverified, learner-scoped local export, NEVER a restore file.
 * No registry credentials, no browser-wide legacy promotion, no grade/mastery writes.
 */
(function(root,factory){
 "use strict"; const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.KhaemenesGrade01PreservationV1=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x)&&Object.getPrototypeOf(x)===Object.prototype;
 const valid=x=>typeof x==="string"&&/^learner_[A-Za-z0-9_-]{1,140}$/.test(x);
 const matching=(r,id)=>obj(r)&&r.learnerId===id&&String(r.grade).replace(/\D/g,"").padStart(2,"0")==="01"&&r.preview===false;
 function build({learnerId,courseRecord,attempts,ledgerEntries,legacyExists=false,favoritesExist=false}={}){
   if(!valid(learnerId)||!obj(courseRecord))throw Error("invalid_learner_or_course");
   // Grade1Mastery currently saves raw state; assessment engine may save a wrapped state.
   const wrapped=courseRecord.format==="khaemenes-course-state-v1";
   if(wrapped&&(courseRecord.learnerId!==learnerId||courseRecord.courseId!=="elementary-grade-01"))throw Error("wrong_scoped_record_owner");
   const state=wrapped?courseRecord.state:courseRecord;
   if(!obj(state)||!obj(state.weeks)||!obj(state.notes)||!obj(state.daily)||!obj(state.dailyResponses))throw Error("unexpected_grade01_state");
   if(!Array.isArray(attempts)||!Array.isArray(ledgerEntries)||attempts.length>160||ledgerEntries.length>900)throw Error("invalid_evidence_arrays");
   if(!attempts.every(r=>matching(r,learnerId))||!ledgerEntries.every(r=>matching(r,learnerId)))throw Error("cross_learner_or_preview_evidence");
   // Deep copy JSON payload to preserve original objects.
   const copy=x=>JSON.parse(JSON.stringify(x));
   return {
     format:"khaemenes-elementary-grade01-preservation-v1",
     grade:"01",courseId:"elementary-grade-01",
     learnerId,sourceAuthority:"browser-local-only",
     admission:"HOLD",restoreAllowed:false,identityVerifiedByProtectedServer:false,
     legacyUnscopedPresent:Boolean(legacyExists),legacyFavoritesPresent:Boolean(favoritesExist),
     separateLegacyOwnershipReviewRequired:Boolean(legacyExists||favoritesExist),
     state:copy(state),assessmentAttempts:copy(attempts),learningLedger:copy(ledgerEntries),
     evidenceCoverage:{attemptsIncluded:attempts.length,ledgerIncluded:ledgerEntries.length,completeness:"unverified"},
     warning:"PRIVATE EDUCATIONAL DATA - LOCAL EXPORT ONLY - NOT ACCOUNT CLOUD OR STOS"
   };
 }
 return Object.freeze({version:"1.0.0-review",build});
});
