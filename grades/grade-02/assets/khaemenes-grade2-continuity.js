(function attachKhaemenesGrade2Continuity(global){
  "use strict";

  const VERSION="1.1.0";
  const EXPECTED_GRADE="02";
  const EXPECTED_STAGE="elementary";
  const COURSE_ID="elementary-grade-02";
  const LEGACY_KEY="khaemenes_grade2_subject_36_aplus_v1";

  function readJSON(key,fallback=null){
    try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}
  }
  function writeJSON(key,value){
    try{const raw=JSON.stringify(value);global.localStorage.setItem(key,raw);return global.localStorage.getItem(key)===raw}catch{return false}
  }
  function registry(){return global.KhaemenesFamilyRegistry||null}
  function learner(){
    const R=registry(),ids=R?.activeIds?.()||{},l=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
    return l&&family&&l.learnerId===ids.learnerId&&l.familyId===family.familyId&&
      l.selfDirectedAdult!==true&&family.learnerIds?.includes(l.learnerId)?l:null;
  }
  function normalizeGrade(value){
    return registry()?.normalizeGrade?.(value)||String(value||"").replace(/[^0-9]/g,"").padStart(2,"0")
  }
  function normalizeStage(value){
    return registry()?.normalizeStage?.(value)||String(value||"").trim().toLowerCase()
  }

  function status(){
    const l=learner();
    if(!l){
      return Object.freeze({version:VERSION,status:"no-active-learner",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,learner:null,placementMatch:false,authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})});
    }
    const grade=normalizeGrade(l.grade),stage=normalizeStage(l.stage);
    const placementMatch=grade===EXPECTED_GRADE&&stage===EXPECTED_STAGE;
    return Object.freeze({
      version:VERSION,
      status:placementMatch?"ready":"placement-mismatch",
      grade:EXPECTED_GRADE,
      stage:EXPECTED_STAGE,
      learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),
      placementMatch,
      authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})
    });
  }

  function scopedKey(){
    const l=learner();
    return l?.learnerId?`khaemenes.course:${l.learnerId}:${COURSE_ID}`:null;
  }

  function unwrapScoped(value,learnerId){
    if(value?.format!=="khaemenes-course-state-v1"||value.learnerId!==learnerId||
       value.courseId!==COURSE_ID||!value.state||typeof value.state!=="object"||Array.isArray(value.state))return null;
    return value.state;
  }

  function readState(fallback=null){
    const s=status(),key=scopedKey();
    if(s.status==="ready"&&key)return unwrapScoped(readJSON(key,null),s.learner.learnerId)||fallback;
    return s.status==="no-active-learner"?readJSON(LEGACY_KEY,fallback):fallback;
  }

  function writeState(state,source="grade-02-runtime"){
    const s=status(),key=scopedKey();
    if(s.status!=="ready"||!key)return false;
    const ok=writeJSON(key,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source,updatedAt:new Date().toISOString(),state});
    if(ok)global.dispatchEvent(new CustomEvent("khaemenes-grade2-continuity-synced",{detail:{learnerId:s.learner.learnerId,courseKey:key}}));
    return ok;
  }

  function clearState(){
    // Clear only the active learner's record. The shared legacy/preview record
    // must not be deleted while a scoped Academy learner is selected.
    const key=scopedKey();
    if(status().status==="ready"&&key){
      try{global.localStorage.removeItem(key)}catch{}
    }
    // Never remove the browser-wide preview key on account mismatch or guest access.
  }

  function publish(){
    const s=status();
    global.dispatchEvent(new CustomEvent("khaemenes-grade2-continuity-ready",{detail:s}));
    return s;
  }

  function activate(){
    const s=publish();
    global.addEventListener("khaemenes-family-changed",publish);
    return s;
  }

  global.KhaemenesGrade2Continuity=Object.freeze({version:VERSION,expectedGrade:EXPECTED_GRADE,expectedStage:EXPECTED_STAGE,courseId:COURSE_ID,status,scopedKey,readState,writeState,clearState,activate});
})(window);
