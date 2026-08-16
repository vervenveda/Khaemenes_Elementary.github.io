/* Khaemenes Grade 05 · Continuity Bridge v1.0.0 */
(function attachGrade5Continuity(global){
  "use strict";
  const LEGACY_KEY="khaemenes_grade5_subject_36_aplusplus_v1";
  const RECORDS_KEY="khaemenes_grade5_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade5_active_learner_v1";
  const clean=(v,max=120)=>String(v??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
  function readJSON(k,f=null){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
  function writeJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}
  function remove(k){try{localStorage.removeItem(k);return true}catch{return false}}
  function learner(){
    const s=global.KhaemenesElementaryContinuity?.getSummary?.();
    if(!s?.eligible||!s.learner||String(s.learner.grade||"").toLowerCase()!=="grade-05")return null;
    return Object.freeze({
      learnerId:clean(s.learner.learnerId),familyId:clean(s.learner.familyId)||null,
      nickname:clean(s.learner.nickname||"Fifth Grade Scholar",80),stage:"elementary",grade:"grade-05",
      ageBand:clean(s.learner.ageBand,40)||null,
      interests:Array.isArray(s.learner.interests)?s.learner.interests.slice(0,16):[],
      mentor:s.mentor||Object.freeze({id:"archaemenes",name:"Archaemenes",avatar:"🦉",presentationMode:"young-scholar",assignedBy:"fallback"})
    });
  }
  function normalizeState(v={}){
    const src=v&&typeof v==="object"?v:{};const weekly={};
    for(let i=1;i<=36;i++){const n=Number(src.weekly?.[i]??src.weekly?.[String(i)]??0);if(Number.isFinite(n)&&n>0)weekly[i]=Math.max(0,Math.min(100,n));}
    return {student:clean(src.student||"Fifth Grade Scholar",80),weekly,midterm:Math.max(0,Math.min(100,Number(src.midterm||0))),final:Math.max(0,Math.min(100,Number(src.final||0))),portfolio:Boolean(src.portfolio),learnerId:clean(src.learnerId)||null,linkedAt:src.linkedAt||null,updatedAt:src.updatedAt||null,recordVersion:"4.0"};
  }
  function allRecords(){const v=readJSON(RECORDS_KEY,{});return v&&typeof v==="object"?v:{}}
  function migrateLegacy(id){const records=allRecords();if(!id||records[id])return records;const legacy=readJSON(LEGACY_KEY,null);if(!legacy)return records;records[id]={...normalizeState(legacy),learnerId:id,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"non-destructive-copy",migratedAt:new Date().toISOString()}};writeJSON(RECORDS_KEY,records);return records;}
  function loadState(){const l=learner();if(!l)return normalizeState(readJSON(LEGACY_KEY,{}));const records=migrateLegacy(l.learnerId);const state=normalizeState(records[l.learnerId]||{});state.student=l.nickname;state.learnerId=l.learnerId;state.linkedAt=state.linkedAt||new Date().toISOString();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);writeJSON(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});return normalizeState(state);}
  function saveState(v){const l=learner();const state=normalizeState(v);if(!l)return state;state.student=l.nickname;state.learnerId=l.learnerId;state.updatedAt=new Date().toISOString();const records=allRecords();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);writeJSON(LEGACY_KEY,state);return normalizeState(state);}
  function clearActive(){const l=learner();if(!l)return false;const records=allRecords();delete records[l.learnerId];writeJSON(RECORDS_KEY,records);remove(ACTIVE_KEY);return true;}
  function summary(){const l=learner();const state=loadState();const scores=Object.values(state.weekly||{}).map(Number).filter(n=>n>0);const mastered=Object.values(state.weekly||{}).filter(n=>Number(n)>=80).length;const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;let next=1;for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}return Object.freeze({eligible:Boolean(l),learner:l,mentor:l?.mentor||null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered===36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)});}
  function subscribe(fn){if(typeof fn!=="function")throw new TypeError("A listener function is required.");const emit=()=>fn(summary());const storage=e=>{if([RECORDS_KEY,LEGACY_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(e.key))emit()};global.addEventListener("storage",storage);global.addEventListener("khaemenes-family-changed",emit);global.addEventListener("khaemenes-elementary-family-ready",emit);global.addEventListener("khaemenes-naib-ready",emit);return()=>{global.removeEventListener("storage",storage);global.removeEventListener("khaemenes-family-changed",emit);global.removeEventListener("khaemenes-elementary-family-ready",emit);global.removeEventListener("khaemenes-naib-ready",emit)}}
  global.KhaemenesGrade5Continuity=Object.freeze({version:"1.0.0",getLearner:learner,getMentor:()=>learner()?.mentor||null,loadState,saveState,clearActive,getSummary:summary,subscribe});
})(window);
