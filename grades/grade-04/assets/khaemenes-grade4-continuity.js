/*
 * Khaemenes Grade 04 · Continuity Bridge v1.1.0
 * ------------------------------------------------
 * Academy Family Registry owns learner identity and grade placement.
 * Elementary continuity provides the Academy mentor context.
 * Grade 04 owns learner-scoped course progress and mastery records.
 * Legacy shared state is migration input only and is never rewritten.
 */
(function attachGrade4Continuity(global){
  "use strict";
  const VERSION="1.1.0";
  const LEGACY_KEY="khaemenes_grade4_subject_36_aplusplus_v1";
  const LEGACY_CLAIM_KEY="khaemenes_grade4_legacy_migration_claim_v1";
  const RECORDS_KEY="khaemenes_grade4_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade4_active_learner_v1";
  const clean=(value,max=120)=>String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
  function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function remove(key){try{localStorage.removeItem(key);return true}catch{return false}}
  function learner(){const s=global.KhaemenesElementaryContinuity?.getSummary?.();if(!s?.eligible||!s.learner||String(s.learner.grade||"").toLowerCase()!=="grade-04")return null;return Object.freeze({learnerId:clean(s.learner.learnerId),familyId:clean(s.learner.familyId)||null,nickname:clean(s.learner.nickname||"Fourth Grade Scholar",80),stage:"elementary",grade:"grade-04",ageBand:clean(s.learner.ageBand,40)||null,interests:Array.isArray(s.learner.interests)?s.learner.interests.slice(0,16):[],mentor:s.mentor||Object.freeze({id:"archaemenes",name:"Archaemenes",avatar:"🦉",presentationMode:"young-scholar",providedBy:"Khaemenes Academy"})});}
  function normalizeState(value={}){const source=value&&typeof value==="object"?value:{};const weekly={};for(let i=1;i<=36;i++){const score=Number(source.weekly?.[i]??source.weekly?.[String(i)]??0);if(Number.isFinite(score)&&score>0)weekly[i]=Math.max(0,Math.min(100,score));}return {student:clean(source.student||"Fourth Grade Scholar",80),weekly,midterm:Math.max(0,Math.min(100,Number(source.midterm||0))),final:Math.max(0,Math.min(100,Number(source.final||0))),portfolio:Boolean(source.portfolio),learnerId:clean(source.learnerId)||null,linkedAt:source.linkedAt||null,updatedAt:source.updatedAt||null,recordVersion:"4.1"};}
  function allRecords(){const v=readJSON(RECORDS_KEY,{});return v&&typeof v==="object"?v:{}}
  function migrateLegacy(id){const records=allRecords();if(!id||records[id])return records;const raw=readJSON(LEGACY_KEY,null);if(!raw)return records;const legacy=normalizeState(raw);const claim=readJSON(LEGACY_CLAIM_KEY,null);const claimedId=clean(claim?.learnerId);if(claimedId&&claimedId!==id)return records;if(legacy.learnerId&&legacy.learnerId!==id)return records;const now=new Date().toISOString();records[id]={...legacy,student:learner()?.nickname||legacy.student,learnerId:id,linkedAt:legacy.linkedAt||now,updatedAt:now,migration:{source:LEGACY_KEY,mode:"single-claim-non-destructive-copy",migratedAt:now}};writeJSON(RECORDS_KEY,records);writeJSON(LEGACY_CLAIM_KEY,{learnerId:id,migratedAt:now});return records;}
  function loadState(){const l=learner();if(!l)return normalizeState({});const records=migrateLegacy(l.learnerId);const state=normalizeState(records[l.learnerId]||{});state.student=l.nickname;state.learnerId=l.learnerId;state.linkedAt=state.linkedAt||new Date().toISOString();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);writeJSON(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});return normalizeState(state);}
  function saveState(value){const l=learner();const state=normalizeState(value);if(!l)return state;state.student=l.nickname;state.learnerId=l.learnerId;state.updatedAt=new Date().toISOString();const records=allRecords();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);return normalizeState(state);}
  function clearActive(){const l=learner();if(!l)return false;const records=allRecords();delete records[l.learnerId];writeJSON(RECORDS_KEY,records);remove(ACTIVE_KEY);return true;}
  function summary(){const l=learner();const state=loadState();const scores=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);const mastered=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;let next=1;for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}return Object.freeze({eligible:Boolean(l),learner:l,mentor:l?.mentor||null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered===36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)});}
  global.KhaemenesGrade4Continuity=Object.freeze({version:VERSION,getLearner:learner,getMentor:()=>learner()?.mentor||null,loadState,saveState,clearActive,getSummary:summary});
})(window);