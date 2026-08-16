(function attachKhaemenesGrade2Continuity(global){
  "use strict";

  const VERSION="1.0.0";
  const EXPECTED_GRADE="02";
  const EXPECTED_STAGE="elementary";
  const COURSE_ID="elementary-grade-02";
  const LEGACY_KEY="khaemenes_grade2_subject_36_aplus_v1";

  function readJSON(key,fallback=null){
    try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}
  }
  function writeJSON(key,value){
    try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}
  }
  function registry(){return global.KhaemenesFamilyRegistry||null}
  function learner(){return registry()?.getLearner?.()||null}
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

  function unwrapScoped(value){
    if(value&&typeof value==="object"&&value.format==="khaemenes-course-state-v1"&&value.state&&typeof value.state==="object")return value.state;
    return value;
  }

  function readState(fallback=null){
    const s=status(),key=scopedKey();
    if(s.status==="ready"&&key){
      const scoped=unwrapScoped(readJSON(key,null));
      if(scoped)return scoped;
      const legacy=readJSON(LEGACY_KEY,null);
      if(legacy){
        writeState(legacy,"legacy-grade-02-migration");
        return legacy;
      }
    }
    return readJSON(LEGACY_KEY,fallback);
  }

  function writeState(state,source="grade-02-runtime"){
    const s=status(),key=scopedKey();
    writeJSON(LEGACY_KEY,state);
    if(s.status!=="ready"||!key)return false;
    const ok=writeJSON(key,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source,updatedAt:new Date().toISOString(),state});
    if(ok)global.dispatchEvent(new CustomEvent("khaemenes-grade2-continuity-synced",{detail:{learnerId:s.learner.learnerId,courseKey:key}}));
    return ok;
  }

  function clearState(){
    try{global.localStorage.removeItem(LEGACY_KEY)}catch{}
    const key=scopedKey();
    if(status().status==="ready"&&key){try{global.localStorage.removeItem(key)}catch{}}
  }

  function publish(){
    const s=status();
    global.dispatchEvent(new CustomEvent("khaemenes-grade2-continuity-ready",{detail:s}));
    return s;
  }

  function activate(){
    const s=publish();
    if(s.status==="ready"){
      const legacy=readJSON(LEGACY_KEY,null),key=scopedKey();
      if(key&&legacy!==null&&readJSON(key,null)===null)writeState(legacy,"legacy-grade-02-migration");
    }
    global.addEventListener("khaemenes-family-changed",publish);
    return s;
  }

  global.KhaemenesGrade2Continuity=Object.freeze({version:VERSION,expectedGrade:EXPECTED_GRADE,expectedStage:EXPECTED_STAGE,courseId:COURSE_ID,status,scopedKey,readState,writeState,clearState,activate});
})(window);
