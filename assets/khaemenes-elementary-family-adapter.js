/*
 * Khaemenes Elementary · Family Adapter v1.1.0
 * ---------------------------------------------
 * Family Registry is authoritative for learner/family identity.
 * This adapter never creates a family, never auto-promotes a learner,
 * and never treats legacy mentor or local profile fields as authority.
 */
(function attachElementaryFamilyAdapter(global){
  "use strict";

  const LEGACY_KEY="khaemenes_elementary_profiles_v1";
  const ROUTER_SRC="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-naib-mentor-router.js";

  const cleanText=(value,max=120)=>String(value??"")
    .replace(/[\u0000-\u001F\u007F]/g,"")
    .trim()
    .slice(0,max);

  function readLegacy(){
    try{
      const value=JSON.parse(localStorage.getItem(LEGACY_KEY)||"null");
      return value&&typeof value==="object"?value:null;
    }catch{return null}
  }

  function writeLegacy(value){
    try{localStorage.setItem(LEGACY_KEY,JSON.stringify(value));return true}catch{return false}
  }

  function stripAuthority(record){
    if(!record||typeof record!=="object")return {};
    const next={...record};
    if(next.student&&typeof next.student==="object"){
      next.student={...next.student};
      delete next.student.mentor;
      delete next.student.mentorId;
      delete next.student.mentorIdentity;
      delete next.student.personality;
      delete next.student.name;
      delete next.student.grade;
    }
    delete next.mentor;
    delete next.mentorId;
    delete next.mentorIdentity;
    delete next.personality;
    delete next.parent;
    delete next.guardian;
    delete next.family;
    delete next.learnerId;
    delete next.familyId;
    delete next.academyIdentity;
    return next;
  }

  function syncCompatibility(learner){
    if(!global.KhaemenesElementaryContinuity?.isElementaryLearner?.(learner))return false;
    const prior=stripAuthority(readLegacy()||{});
    const student=prior.student&&typeof prior.student==="object"?prior.student:{};
    const grade=global.KhaemenesElementaryContinuity.normalizeGrade(learner.grade||learner.gradeLevel);
    const merged={
      ...prior,
      student:{
        ...student,
        favoriteSubject:cleanText(student.favoriteSubject,100),
        goal:cleanText(student.goal,400),
        pinned:cleanText(student.pinned,20)
      },
      compatibility:{
        source:"KhaemenesFamilyRegistry",
        stage:"elementary",
        grade:grade||null,
        updatedAt:new Date().toISOString()
      }
    };
    return writeLegacy(merged);
  }

  function dispatch(detail){
    try{global.dispatchEvent(new CustomEvent("khaemenes-elementary-family-ready",{detail}))}catch{}
  }

  function refresh(){
    const family=global.KhaemenesFamilyRegistry;
    if(!family){dispatch({connected:false,eligible:false,reason:"registry-unavailable"});return}
    const learner=family.getLearner?.();
    if(!learner){dispatch({connected:true,eligible:false,reason:"no-active-learner"});return}
    if(!global.KhaemenesElementaryContinuity?.isElementaryLearner?.(learner)){
      dispatch({connected:true,eligible:false,reason:"stage-mismatch"});
      return;
    }
    syncCompatibility(learner);
    const summary=global.KhaemenesElementaryContinuity?.getSummary?.()||null;
    dispatch({
      connected:true,
      eligible:true,
      reason:"ok",
      grade:summary?.learner?.grade||null,
      mentorId:"archaemenes",
      presentationMode:summary?.mentor?.presentationMode||"young-scholar"
    });
  }

  function ensureRouter(){
    if(global.KhaemenesNAIB)return Promise.resolve(true);
    const existing=document.querySelector('script[src="'+ROUTER_SRC+'"],script[data-khaemenes-naib-router]');
    if(existing){
      return new Promise(resolve=>{
        if(global.KhaemenesNAIB){resolve(true);return}
        existing.addEventListener("load",()=>resolve(Boolean(global.KhaemenesNAIB)),{once:true});
        existing.addEventListener("error",()=>resolve(false),{once:true});
      });
    }
    return new Promise(resolve=>{
      const script=document.createElement("script");
      script.src=ROUTER_SRC;
      script.async=true;
      script.referrerPolicy="no-referrer";
      script.crossOrigin="anonymous";
      script.dataset.khaemenesNaibRouter="true";
      script.addEventListener("load",()=>{
        try{global.dispatchEvent(new CustomEvent("khaemenes-naib-ready"))}catch{}
        resolve(Boolean(global.KhaemenesNAIB));
      },{once:true});
      script.addEventListener("error",()=>resolve(false),{once:true});
      document.head.append(script);
    });
  }

  function waitForRegistry(attempt=0){
    if(global.KhaemenesFamilyRegistry){
      ensureRouter().finally(refresh);
      return;
    }
    if(attempt<80)setTimeout(()=>waitForRegistry(attempt+1),50);
    else refresh();
  }

  global.addEventListener("khaemenes-family-changed",refresh);
  global.addEventListener("khaemenes-naib-ready",refresh);
  global.addEventListener("storage",event=>{
    if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))refresh();
  });

  global.KhaemenesElementaryFamilyAdapter=Object.freeze({
    version:"1.1.0",
    refresh,
    syncCompatibility,
    ensureRouter
  });

  waitForRegistry();
})(window);
