/*
 * Khaemenes Grade 01 · Continuity Bridge v1.1.0
 * ------------------------------------------------
 * Academy Family Registry owns learner identity and grade placement.
 * Elementary continuity provides the Academy mentor context.
 * Grade 01 owns learner-scoped course progress and mastery records.
 * Legacy shared state is migration input only and is never rewritten.
 */
(function attachGrade1Continuity(global){
  "use strict";

  const VERSION="1.1.0";
  const LEGACY_KEY="khaemenes_grade1_36_aplus_v1";
  const LEGACY_CLAIM_KEY="khaemenes_grade1_legacy_migration_claim_v1";
  const RECORDS_KEY="khaemenes_grade1_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade1_active_learner_v1";

  const clean=(value,max=120)=>String(value??"")
    .replace(/[\u0000-\u001F\u007F]/g,"")
    .trim()
    .slice(0,max);

  function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function remove(key){try{localStorage.removeItem(key);return true}catch{return false}}
  function elementarySummary(){return global.KhaemenesElementaryContinuity?.getSummary?.()||null}

  function learner(){
    const summary=elementarySummary();
    if(!summary?.eligible||!summary.learner)return null;
    if(String(summary.learner.grade||"").toLowerCase()!=="grade-01")return null;
    return Object.freeze({
      learnerId:clean(summary.learner.learnerId,120),
      familyId:clean(summary.learner.familyId,120)||null,
      nickname:clean(summary.learner.nickname||"First Grade Scholar",80),
      stage:"elementary",
      grade:"grade-01",
      ageBand:clean(summary.learner.ageBand,40)||null,
      interests:Array.isArray(summary.learner.interests)?summary.learner.interests.slice(0,16):[],
      mentor:summary.mentor||Object.freeze({id:"archaemenes",name:"Archaemenes",avatar:"🦉",presentationMode:"young-scholar",providedBy:"Khaemenes Academy"})
    });
  }

  function normalizeState(value={}){
    const source=value&&typeof value==="object"?value:{};
    const weekly={};
    for(let i=1;i<=36;i++){
      const score=Number(source.weekly?.[i]??source.weekly?.[String(i)]??0);
      if(Number.isFinite(score)&&score>0)weekly[i]=Math.max(0,Math.min(100,score));
    }
    return {
      student:clean(source.student||"First Grade Scholar",80),
      weekly,
      midterm:Math.max(0,Math.min(100,Number(source.midterm||0))),
      final:Math.max(0,Math.min(100,Number(source.final||0))),
      portfolio:Boolean(source.portfolio),
      learnerId:clean(source.learnerId,120)||null,
      linkedAt:source.linkedAt||null,
      updatedAt:source.updatedAt||null,
      recordVersion:"4.1"
    };
  }

  function allRecords(){const value=readJSON(RECORDS_KEY,{});return value&&typeof value==="object"?value:{}}

  function migrateLegacy(id){
    const records=allRecords();
    if(!id||records[id])return records;
    const legacyRaw=readJSON(LEGACY_KEY,null);
    if(!legacyRaw)return records;

    const legacy=normalizeState(legacyRaw);
    const claim=readJSON(LEGACY_CLAIM_KEY,null);
    const claimedId=clean(claim?.learnerId,120);
    if(claimedId&&claimedId!==id)return records;
    if(legacy.learnerId&&legacy.learnerId!==id)return records;

    const now=new Date().toISOString();
    records[id]={...legacy,student:learner()?.nickname||legacy.student,learnerId:id,linkedAt:legacy.linkedAt||now,updatedAt:now,migration:{source:LEGACY_KEY,mode:"single-claim-non-destructive-copy",migratedAt:now}};
    writeJSON(RECORDS_KEY,records);
    writeJSON(LEGACY_CLAIM_KEY,{learnerId:id,migratedAt:now});
    return records;
  }

  function loadState(){
    const l=learner();
    if(!l)return normalizeState({});
    const records=migrateLegacy(l.learnerId);
    const state=normalizeState(records[l.learnerId]||{});
    state.student=l.nickname;
    state.learnerId=l.learnerId;
    state.linkedAt=state.linkedAt||new Date().toISOString();
    records[l.learnerId]=state;
    writeJSON(RECORDS_KEY,records);
    writeJSON(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});
    return normalizeState(state);
  }

  function saveState(value){
    const l=learner();
    const state=normalizeState(value);
    if(!l)return state;
    state.student=l.nickname;
    state.learnerId=l.learnerId;
    state.updatedAt=new Date().toISOString();
    const records=allRecords();
    records[l.learnerId]=state;
    writeJSON(RECORDS_KEY,records);
    return normalizeState(state);
  }

  function clearActive(){
    const l=learner();
    if(!l)return false;
    const records=allRecords();
    delete records[l.learnerId];
    writeJSON(RECORDS_KEY,records);
    remove(ACTIVE_KEY);
    return true;
  }

  function summary(){
    const l=learner();
    const state=loadState();
    const scores=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);
    const mastered=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;
    const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    let next=1;
    for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}
    return Object.freeze({eligible:Boolean(l),learner:l,mentor:l?.mentor||null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered===36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)});
  }

  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");
    const emit=()=>listener(summary());
    const storageHandler=event=>{if([RECORDS_KEY,LEGACY_KEY,LEGACY_CLAIM_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))emit()};
    global.addEventListener("storage",storageHandler);
    global.addEventListener("khaemenes-family-changed",emit);
    global.addEventListener("khaemenes-elementary-family-ready",emit);
    global.addEventListener("khaemenes-naib-ready",emit);
    return ()=>{
      global.removeEventListener("storage",storageHandler);
      global.removeEventListener("khaemenes-family-changed",emit);
      global.removeEventListener("khaemenes-elementary-family-ready",emit);
      global.removeEventListener("khaemenes-naib-ready",emit);
    };
  }

  global.KhaemenesGrade1Continuity=Object.freeze({version:VERSION,getLearner:learner,getMentor:()=>learner()?.mentor||null,loadState,saveState,clearActive,getSummary:summary,subscribe});
})(window);
