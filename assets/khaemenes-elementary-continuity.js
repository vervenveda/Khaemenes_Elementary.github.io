/*
 * Khaemenes Elementary · Continuity Bridge v1.2.0
 * ------------------------------------------------
 * Family Registry is authoritative for learner identity and grade.
 * NAIB delegates the learner to Khaemenes Academy.
 * Khaemenes Academy provides Archaemenes as its current mentor.
 * Grade curriculum remains authoritative for mastery and records.
 */
(function attachElementaryContinuity(global){
  "use strict";

  const LEGACY_KEY="khaemenes_elementary_profiles_v1";
  const PRESENTATION="young-scholar";

  const ARCHAEMENES_FALLBACK=Object.freeze({
    id:"archaemenes",
    name:"Archaemenes",
    title:"Scholar of Khaemenes Academy",
    avatar:"🦉",
    colors:["#3f6fb2","#c99a42"],
    presentationMode:PRESENTATION,
    assignedBy:"Khaemenes Academy",
    delegatedBy:"NAIB",
    intro:"I am Archaemenes. We will look closely, ask good questions, and take one thoughtful step at a time."
  });

  const cleanText=(value,max=120)=>String(value??"")
    .replace(/[\u0000-\u001F\u007F]/g,"")
    .trim()
    .slice(0,max);

  function readJSON(key,fallback=null){
    try{
      const raw=localStorage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch{return fallback}
  }

  function activeLearner(){
    try{return global.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}
  }

  function normalizeGrade(value){
    const raw=cleanText(value,40).toLowerCase();
    const match=raw.match(/(?:grade[- ]?)?0?([1-5])\b/);
    return match?`grade-0${match[1]}`:"";
  }

  function isElementaryLearner(learner){
    if(!learner)return false;
    const stage=cleanText(learner.stage,40).toLowerCase();
    if(stage==="elementary")return true;
    return Boolean(normalizeGrade(learner.grade||learner.gradeLevel||stage));
  }

  function legacyPreferences(){
    const value=readJSON(LEGACY_KEY,null);
    const student=value?.student&&typeof value.student==="object"?value.student:{};
    return Object.freeze({
      favoriteSubject:cleanText(student.favoriteSubject,100)||null,
      goal:cleanText(student.goal,400)||null
    });
  }

  function profile(){
    const learner=activeLearner();
    if(!isElementaryLearner(learner))return null;
    const legacy=legacyPreferences();
    return Object.freeze({
      learnerId:cleanText(learner.learnerId,120),
      familyId:cleanText(learner.familyId,120)||null,
      nickname:cleanText(learner.nickname||learner.displayName||"Scholar",80),
      stage:"elementary",
      grade:normalizeGrade(learner.grade||learner.gradeLevel),
      ageBand:cleanText(learner.ageBand,40)||null,
      interests:Array.isArray(learner.interests)?learner.interests.slice(0,16).map(v=>cleanText(v,80)).filter(Boolean):[],
      favoriteSubject:legacy.favoriteSubject,
      goal:legacy.goal,
      familyManaged:true
    });
  }

  function academyMentor(p=profile()){
    if(!p)return null;
    const router=global.KhaemenesNAIB||null;
    const context={
      stage:"elementary",
      grade:p.grade||undefined,
      ageBand:p.ageBand||undefined,
      interests:p.interests,
      surface:"khaemenes-elementary",
      intent:"academy learning"
    };

    const delegated=router?.delegate?.(context)||null;
    if(delegated?.status==="delegated"&&delegated?.specialist?.id==="archaemenes"){
      return Object.freeze({
        ...delegated.specialist,
        id:"archaemenes",
        name:"Archaemenes",
        presentationMode:delegated.specialist.presentationMode||PRESENTATION,
        assignedBy:"Khaemenes Academy",
        delegatedBy:"NAIB",
        delegationId:delegated.delegationId||null
      });
    }

    const compatibility=router?.assignMentor?.({...context,intent:"academy mentor"})||null;
    if(compatibility?.status==="assigned"&&compatibility.mentorId==="archaemenes"&&compatibility.mentor){
      return Object.freeze({
        ...compatibility.mentor,
        id:"archaemenes",
        name:"Archaemenes",
        presentationMode:compatibility.mentor.presentationMode||PRESENTATION,
        assignedBy:"Khaemenes Academy",
        delegatedBy:"NAIB"
      });
    }

    return ARCHAEMENES_FALLBACK;
  }

  function summary(){
    const raw=activeLearner();
    const p=profile();
    if(!raw){
      return Object.freeze({connected:Boolean(global.KhaemenesFamilyRegistry),eligible:false,reason:"no-active-learner",learner:null,mentor:null});
    }
    if(!p){
      return Object.freeze({connected:true,eligible:false,reason:"stage-mismatch",learner:null,mentor:null});
    }
    return Object.freeze({connected:true,eligible:true,reason:"ok",learner:p,mentor:academyMentor(p)});
  }

  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");
    const emit=()=>listener(summary());
    const storageHandler=event=>{
      if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1",LEGACY_KEY].includes(event.key))emit();
    };
    global.addEventListener("storage",storageHandler);
    global.addEventListener("khaemenes-family-changed",emit);
    global.addEventListener("khaemenes-naib-ready",emit);
    return ()=>{
      global.removeEventListener("storage",storageHandler);
      global.removeEventListener("khaemenes-family-changed",emit);
      global.removeEventListener("khaemenes-naib-ready",emit);
    };
  }

  global.KhaemenesElementaryContinuity=Object.freeze({
    version:"1.2.0",
    mentorId:"archaemenes",
    presentationMode:PRESENTATION,
    legacyKey:LEGACY_KEY,
    getProfile:profile,
    getMentor:()=>academyMentor(profile()),
    getSummary:summary,
    isElementaryLearner,
    normalizeGrade,
    subscribe
  });
})(window);
