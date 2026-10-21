(function attachKhaemenesGrade3Continuity(global){
  "use strict";
  const VERSION="1.0.0",EXPECTED_GRADE="03",EXPECTED_STAGE="elementary",COURSE_ID="elementary-grade-03",LEGACY_KEY="khaemenes_grade3_subject_36_aplus_v1";
  function readJSON(key,fallback=null){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function registry(){return global.KhaemenesFamilyRegistry||null}
  function learner(){return registry()?.getLearner?.()||null}
  function normalizeGrade(v){return registry()?.normalizeGrade?.(v)||String(v||"").replace(/[^0-9]/g,"").padStart(2,"0")}
  function normalizeStage(v){return registry()?.normalizeStage?.(v)||String(v||"").trim().toLowerCase()}
  function status(){const l=learner();if(!l)return Object.freeze({version:VERSION,status:"no-active-learner",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,learner:null,placementMatch:false,authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})});const placementMatch=normalizeGrade(l.grade)===EXPECTED_GRADE&&normalizeStage(l.stage)===EXPECTED_STAGE;return Object.freeze({version:VERSION,status:placementMatch?"ready":"placement-mismatch",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,placementMatch,learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})})}
  function scopedKey(){const l=learner();return l?.learnerId?`khaemenes.course:${l.learnerId}:${COURSE_ID}`:null}
  function unwrap(v){return v&&typeof v==="object"&&v.format==="khaemenes-course-state-v1"&&v.state? v.state:v}
  function readState(fallback=null){const s=status(),key=scopedKey();if(s.status==="ready"&&key)return unwrap(readJSON(key,null))||fallback;return readJSON(LEGACY_KEY,fallback)}
  function writeState(state,source="grade-03-runtime"){const s=status(),key=scopedKey();if(s.status!=="ready"||!key)return writeJSON(LEGACY_KEY,state);const ok=writeJSON(key,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source,updatedAt:new Date().toISOString(),state});if(ok)global.dispatchEvent(new CustomEvent("khaemenes-grade3-continuity-synced",{detail:{learnerId:s.learner.learnerId,courseKey:key}}));return ok}
  function clearState(){const key=scopedKey();if(status().status==="ready"&&key){try{global.localStorage.removeItem(key)}catch{}return}try{global.localStorage.removeItem(LEGACY_KEY)}catch{}}
  function activate(){const s=status();global.dispatchEvent(new CustomEvent("khaemenes-grade3-continuity-ready",{detail:s}));return s}
  global.KhaemenesGrade3Continuity=Object.freeze({version:VERSION,expectedGrade:EXPECTED_GRADE,expectedStage:EXPECTED_STAGE,courseId:COURSE_ID,status,scopedKey,readState,writeState,clearState,activate});
})(window);