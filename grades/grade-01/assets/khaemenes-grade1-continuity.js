(function attachKhaemenesGrade1Continuity(global){
  "use strict";

  const VERSION="1.1.0";
  const EXPECTED_GRADE="01";
  const EXPECTED_STAGE="elementary";
  const LEGACY_GRADE_KEY="khaemenes_grade1_36_aplus_v1";
  const LEGACY_FAVORITES_KEY="khaemenes_grade1_favorite_adventures_v1";

  function clean(value,max=120){return String(value??"").trim().slice(0,max)}
  function readJSON(key,fallback=null){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function learner(){return registry()?.getLearner?.()||null}
  function normalizeGrade(value){return registry()?.normalizeGrade?.(value)||String(value||"").replace(/[^0-9]/g,"").padStart(2,"0")}
  function normalizeStage(value){return registry()?.normalizeStage?.(value)||clean(value,40).toLowerCase()}

  function status(){
    const l=learner();
    if(!l)return Object.freeze({version:VERSION,status:"no-active-learner",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,learner:null,placementMatch:false});
    const grade=normalizeGrade(l.grade),stage=normalizeStage(l.stage);
    return Object.freeze({
      version:VERSION,
      status:grade===EXPECTED_GRADE&&stage===EXPECTED_STAGE?"ready":"placement-mismatch",
      grade:EXPECTED_GRADE,
      stage:EXPECTED_STAGE,
      learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),
      placementMatch:grade===EXPECTED_GRADE&&stage===EXPECTED_STAGE,
      authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})
    });
  }

  function scopedKey(kind="course"){
    const l=learner();
    if(!l?.learnerId)return null;
    const suffix=kind==="favorites"?"elementary-grade-01-favorites":"elementary-grade-01";
    return `khaemenes.course:${l.learnerId}:${suffix}`;
  }

  // Existing browser-wide legacy records have no verifiable learner owner.
  // Never auto-assign them to whichever child happens to be selected.
  function migrateLegacy(){
    return Object.freeze({migrated:false,courseMigrated:false,favoritesMigrated:false,reason:"legacy-ownership-unverified"});
  }

  function syncFromLegacy(){
    return false; // No unverified cross-learner grade or favorite mirroring.
  }

  function publish(){
    const s=status();
    global.dispatchEvent(new CustomEvent("khaemenes-grade1-continuity-ready",{detail:s}));
    return s;
  }

  function activate(){
    const s=publish();
    global.addEventListener("khaemenes-family-changed",publish);
    // Only read-only placement publication is automatic. No legacy writes.
    return s;
  }

  global.KhaemenesGrade1Continuity=Object.freeze({version:VERSION,expectedGrade:EXPECTED_GRADE,expectedStage:EXPECTED_STAGE,status,scopedKey,migrateLegacy,syncFromLegacy,activate});
})(window);
