(function attachKhaemenesGrade1Continuity(global){
  "use strict";

  const VERSION="1.0.0";
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

  function migrateLegacy(){
    const s=status();
    if(s.status!=="ready")return Object.freeze({migrated:false,reason:s.status});
    const courseKey=scopedKey("course"),favoritesKey=scopedKey("favorites");
    const legacyCourse=readJSON(LEGACY_GRADE_KEY,null),legacyFavorites=readJSON(LEGACY_FAVORITES_KEY,null);
    let courseMigrated=false,favoritesMigrated=false;
    if(courseKey&&legacyCourse!==null&&readJSON(courseKey,null)===null){courseMigrated=writeJSON(courseKey,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:"elementary-grade-01",source:"legacy-grade-01",updatedAt:new Date().toISOString(),state:legacyCourse})}
    if(favoritesKey&&legacyFavorites!==null&&readJSON(favoritesKey,null)===null){favoritesMigrated=writeJSON(favoritesKey,{format:"khaemenes-course-preferences-v1",learnerId:s.learner.learnerId,courseId:"elementary-grade-01",source:"legacy-grade-01",updatedAt:new Date().toISOString(),favorites:legacyFavorites})}
    return Object.freeze({migrated:courseMigrated||favoritesMigrated,courseMigrated,favoritesMigrated,courseKey,favoritesKey});
  }

  function syncFromLegacy(){
    const s=status();
    if(s.status!=="ready")return false;
    const courseKey=scopedKey("course"),favoritesKey=scopedKey("favorites");
    const course=readJSON(LEGACY_GRADE_KEY,null),favorites=readJSON(LEGACY_FAVORITES_KEY,null);
    if(courseKey&&course!==null)writeJSON(courseKey,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:"elementary-grade-01",source:"grade-01-runtime",updatedAt:new Date().toISOString(),state:course});
    if(favoritesKey&&favorites!==null)writeJSON(favoritesKey,{format:"khaemenes-course-preferences-v1",learnerId:s.learner.learnerId,courseId:"elementary-grade-01",source:"grade-01-runtime",updatedAt:new Date().toISOString(),favorites});
    global.dispatchEvent(new CustomEvent("khaemenes-grade1-continuity-synced",{detail:{learnerId:s.learner.learnerId,courseKey,favoritesKey}}));
    return true;
  }

  function publish(){
    const s=status();
    global.dispatchEvent(new CustomEvent("khaemenes-grade1-continuity-ready",{detail:s}));
    return s;
  }

  function activate(){
    const s=publish();
    if(s.status==="ready"){
      migrateLegacy();
      const sync=()=>global.setTimeout(syncFromLegacy,0);
      global.addEventListener("beforeunload",syncFromLegacy,{passive:true});
      document.addEventListener("change",sync,{passive:true});
      document.addEventListener("click",sync,{passive:true});
      global.addEventListener("khaemenes-family-changed",()=>{publish();syncFromLegacy()});
    }
    return s;
  }

  global.KhaemenesGrade1Continuity=Object.freeze({version:VERSION,expectedGrade:EXPECTED_GRADE,expectedStage:EXPECTED_STAGE,status,scopedKey,migrateLegacy,syncFromLegacy,activate});
})(window);
