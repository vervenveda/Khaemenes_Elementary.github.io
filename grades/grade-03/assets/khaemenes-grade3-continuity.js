/* Khaemenes Grade 03 · Continuity Bridge v1.0.0 */
(function attachGrade3Continuity(global){
  "use strict";
  const LEGACY_KEY="khaemenes_grade3_subject_36_aplus_v1";
  const RECORDS_KEY="khaemenes_grade3_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade3_active_learner_v1";
  const clean=(v,m=120)=>String(v??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,m);
  const read=(k,f=null)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
  const remove=k=>{try{localStorage.removeItem(k);return true}catch{return false}};
  function elementarySummary(){return global.KhaemenesElementaryContinuity?.getSummary?.()||null}
  function learner(){
    const s=elementarySummary(); if(!s?.eligible||!s.learner)return null;
    if(String(s.learner.grade||"").toLowerCase()!=="grade-03")return null;
    return Object.freeze({
      learnerId:clean(s.learner.learnerId),familyId:clean(s.learner.familyId)||null,
      nickname:clean(s.learner.nickname||"Third Grade Scholar",80),stage:"elementary",grade:"grade-03",
      ageBand:clean(s.learner.ageBand,40)||null,interests:Array.isArray(s.learner.interests)?s.learner.interests.slice(0,16):[],
      mentor:s.mentor||Object.freeze({id:"archaemenes",name:"Archaemenes",avatar:"🦉",presentationMode:"young-scholar",assignedBy:"fallback"})
    });
  }
  function normalizeState(v={}){
    const x=v&&typeof v==="object"?v:{}; const weekly={};
    for(let i=1;i<=36;i++){const n=Number(x.weekly?.[i]??x.weekly?.[String(i)]??0);if(Number.isFinite(n)&&n>0)weekly[i]=Math.max(0,Math.min(100,n));}
    return {student:clean(x.student||"Third Grade Scholar",80),weekly,midterm:Math.max(0,Math.min(100,Number(x.midterm||0))),final:Math.max(0,Math.min(100,Number(x.final||0))),portfolio:Boolean(x.portfolio),learnerId:clean(x.learnerId)||null,linkedAt:x.linkedAt||null,updatedAt:x.updatedAt||null,recordVersion:"4.0"};
  }
  function allRecords(){const v=read(RECORDS_KEY,{});return v&&typeof v==="object"?v:{}}
  function migrateLegacy(id){const r=allRecords();if(!id||r[id])return r;const legacy=read(LEGACY_KEY,null);if(!legacy)return r;r[id]={...normalizeState(legacy),learnerId:id,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"non-destructive-copy",migratedAt:new Date().toISOString()}};write(RECORDS_KEY,r);return r;}
  function loadState(){const l=learner();if(!l)return normalizeState(read(LEGACY_KEY,{}));const r=migrateLegacy(l.learnerId);const s=normalizeState(r[l.learnerId]||{});s.student=l.nickname;s.learnerId=l.learnerId;s.linkedAt=s.linkedAt||new Date().toISOString();r[l.learnerId]=s;write(RECORDS_KEY,r);write(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});return normalizeState(s);}
  function saveState(v){const l=learner();const s=normalizeState(v);if(!l){write(LEGACY_KEY,s);return s}s.student=l.nickname;s.learnerId=l.learnerId;s.updatedAt=new Date().toISOString();const r=allRecords();r[l.learnerId]=s;write(RECORDS_KEY,r);write(LEGACY_KEY,s);return normalizeState(s);}
  function clearActive(){const l=learner();if(!l){remove(LEGACY_KEY);return true}const r=allRecords();delete r[l.learnerId];write(RECORDS_KEY,r);remove(LEGACY_KEY);remove(ACTIVE_KEY);return true;}
  function summary(){const l=learner();const state=loadState();const vals=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);const mastered=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;const average=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;let next=1;for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}return Object.freeze({eligible:Boolean(l),learner:l,mentor:l?.mentor||null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered>=36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)});}
  function subscribe(fn){if(typeof fn!=="function")throw new TypeError("A listener function is required.");const emit=()=>fn(summary());const sh=e=>{if([RECORDS_KEY,LEGACY_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(e.key))emit()};global.addEventListener("storage",sh);global.addEventListener("khaemenes-family-changed",emit);global.addEventListener("khaemenes-elementary-family-ready",emit);global.addEventListener("khaemenes-naib-ready",emit);return()=>{global.removeEventListener("storage",sh);global.removeEventListener("khaemenes-family-changed",emit);global.removeEventListener("khaemenes-elementary-family-ready",emit);global.removeEventListener("khaemenes-naib-ready",emit)}}
  global.KhaemenesGrade3Continuity=Object.freeze({version:"1.0.0",getLearner:learner,getMentor:()=>learner()?.mentor||null,loadState,saveState,clearActive,getSummary:summary,subscribe});
})(window);