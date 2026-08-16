/*
 * Khaemenes Elementary · Continuity Bridge v1.0.0
 * ------------------------------------------------
 * Family Registry is authoritative for learner identity.
 * NAIB routes mentor authority.
 * Archaemenes is the current Elementary mentor.
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
    assignedBy:"fallback",
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
    return global.KhaemenesFamilyRegistry?.getLearner?.()||null;
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

  function legacyProfile(){
    const value=readJSON(LEGACY_KEY,null);
    return value&&typeof value==="object"?value:null;
  }

  function profile(){
    const learner=activeLearner();
    if(!isElementaryLearner(learner))return null;
    const legacy=legacyProfile();
    const legacyStudent=legacy?.student&&typeof legacy.student==="object"?legacy.student:{};
    return Object.freeze({
      learnerId:cleanText(learner.learnerId,120),
      familyId:cleanText(learner.familyId,120)||null,
      nickname:cleanText(learner.nickname||legacyStudent.name||"Scholar",80),
      stage:"elementary",
      grade:normalizeGrade(learner.grade||learner.gradeLevel||legacyStudent.grade),
      ageBand:cleanText(learner.ageBand,40)||null,
      interests:Array.isArray(learner.interests)?learner.interests.slice(0,16).map(v=>cleanText(v,80)).filter(Boolean):[],
      favoriteSubject:cleanText(legacyStudent.favoriteSubject,100)||null,
      goal:cleanText(legacyStudent.goal,400)||null,
      familyManaged:true
    });
  }

  function assignMentor(p=profile()){
    if(!p)return null;
    const router=global.KhaemenesNAIB||null;
    const assignment=router?.assignMentor?.({
      stage:"elementary",
      grade:p.grade||undefined,
      ageBand:p.ageBand||undefined,
      interests:p.interests,
      surface:"khaemenes-elementary",
      intent:"learning-mentor"
    })||null;

    if(assignment?.status==="assigned" && assignment.mentorId==="archaemenes" && assignment.mentor){
      return Object.freeze({
        ...assignment.mentor,
        id:"archaemenes",
        name:"Archaemenes",
        presentationMode:assignment.mentor.presentationMode||PRESENTATION,
        assignedBy:"NAIB"
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
    return Object.freeze({connected:true,eligible:true,reason:"ok",learner:p,mentor:assignMentor(p)});
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
    version:"1.0.0",
    mentorId:"archaemenes",
    presentationMode:PRESENTATION,
    legacyKey:LEGACY_KEY,
    getProfile:profile,
    getMentor:()=>assignMentor(profile()),
    getSummary:summary,
    isElementaryLearner,
    normalizeGrade,
    subscribe
  });
})(window);
