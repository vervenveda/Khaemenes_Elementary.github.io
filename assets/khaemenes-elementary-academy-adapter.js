(function attachKhaemenesElementaryAcademyAdapter(global){
  "use strict";

  const VERSION="1.1.0";
  const LEGACY_KEY="khaemenes_elementary_profiles_v1";
  const COURSE_ID="elementary-hub";
  const ELEMENTARY_GRADES=new Set(["01","02","03","04","05"]);

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function context(){return global.KhaemenesLearnerContext||null}
  function learner(){return registry()?.getLearner?.()||null}
  function family(){return registry()?.getFamily?.()||null}
  function adult(){return registry()?.getAdult?.()||null}
  function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
  function readJSON(key,fallback){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}

  function ensureBetaProgramLink(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-vnv-beta-link],script[src="https://vervenveda.com/assets/vnv-beta-link.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/assets/vnv-beta-link.js";
    script.defer=true;
    script.dataset.vnvBetaLink="elementary";
    global.document.head.appendChild(script);
  }

  function gradeId(value){
    const g=registry()?.normalizeGrade?.(value)||String(value||"").replace(/[^0-9]/g,"").padStart(2,"0");
    return ELEMENTARY_GRADES.has(g)?`grade-${g}`:null;
  }

  function canonicalState(){
    const l=learner(),f=family(),a=adult(),ctx=context()?.current?.({surfaceStage:"elementary",surfaceGrades:["01","02","03","04","05"]})||null;
    return Object.freeze({
      version:VERSION,
      hasCanonicalLearner:Boolean(l),
      learner:l,
      family:f,
      adult:a,
      context:ctx,
      gradeId:l?gradeId(l.grade):null,
      grade:l?.grade||null,
      learnerId:l?.learnerId||null,
      familyId:l?.familyId||f?.familyId||null,
      stage:l?.stage||null,
      placementReady:Boolean(l&&l.grade&&ELEMENTARY_GRADES.has(l.grade)&&l.stage==="elementary"),
      mismatch:Boolean(l&&(!ELEMENTARY_GRADES.has(l.grade)||l.stage!=="elementary"))
    });
  }

  function learnerStorageKey(kind="preferences"){
    const l=learner();
    if(!l?.learnerId)return null;
    return context()?.storageKey?.(COURSE_ID,kind,l.learnerId)||`khaemenes.course:${l.learnerId}:${COURSE_ID}:${kind}`;
  }

  function readLearnerState(kind="preferences",fallback={}){
    const key=learnerStorageKey(kind);return key?readJSON(key,fallback):fallback;
  }
  function writeLearnerState(kind,value){
    const key=learnerStorageKey(kind);return key?writeJSON(key,value):false;
  }

  function legacyProfile(){return readJSON(LEGACY_KEY,null)}

  function compatibilitySnapshot(){
    const canonical=canonicalState(),legacy=legacyProfile();
    return Object.freeze({
      version:VERSION,
      mode:canonical.hasCanonicalLearner?"academy-canonical":"legacy-only",
      canonical,
      legacyPresent:Boolean(legacy),
      legacy,
      rule:"Academy learner identity and placement are authoritative. Legacy Elementary data is compatibility/preference data only."
    });
  }

  function importLegacyPreferences(){
    const canonical=canonicalState(),legacy=legacyProfile();
    if(!canonical.hasCanonicalLearner||!legacy)return Object.freeze({imported:false,reason:canonical.hasCanonicalLearner?"no-legacy-profile":"no-canonical-learner"});
    const student=legacy.student||{},parent=legacy.parent||{},progress=legacy.progress||{};
    const prefs={
      mentor:student.mentor||"",
      favoriteSubject:student.favoriteSubject||"",
      goal:student.goal||"",
      pinned:student.pinned||"",
      familyNotes:parent.notes||"",
      reviewCadence:parent.cadence||"",
      portfolioReady:Boolean(parent.portfolioReady),
      printReports:Boolean(parent.printReports),
      importedFrom:LEGACY_KEY,
      importedAt:new Date().toISOString()
    };
    const existing=readLearnerState("preferences",{});
    writeLearnerState("preferences",{...prefs,...existing});
    const existingProgress=readLearnerState("progress",{});
    writeLearnerState("progress",{...progress,...existingProgress});
    return Object.freeze({imported:true,learnerId:canonical.learnerId,preferencesKey:learnerStorageKey("preferences"),progressKey:learnerStorageKey("progress")});
  }

  function recommendedGradePath(){
    const c=canonicalState();
    if(!c.placementReady)return null;
    return `grades/grade-${c.grade}/index.html`;
  }

  function routeNotice(){
    const c=canonicalState();
    if(!c.hasCanonicalLearner)return Object.freeze({status:"no-canonical-learner",message:"Open the Academy Family Hub to enroll or select a learner.",url:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"});
    if(c.mismatch)return Object.freeze({status:"different-campus",message:`${c.learner.nickname} is registered for ${c.grade||c.stage}. Elementary remains available for family or educator preview.`,url:"https://vervenveda.com/Khaemenes_Academy.github.io/student/"});
    if(!c.placementReady)return Object.freeze({status:"placement-required",message:"This learner needs an exact Grade 01–05 placement before automatic Elementary routing.",url:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"});
    return Object.freeze({status:"ready",message:`${c.learner.nickname} is registered for Grade ${c.grade}.`,url:recommendedGradePath()});
  }

  function decoratePage(){
    const c=canonicalState(),notice=routeNotice();
    const name=document.getElementById("quickStudent"),grade=document.getElementById("quickGrade"),title=document.getElementById("greetingTitle"),text=document.getElementById("greetingText");
    if(c.hasCanonicalLearner){
      if(name)name.textContent=c.learner.nickname||"Learner";
      if(grade)grade.textContent=c.grade?`Grade ${c.grade}`:(c.stage||"Placement pending");
      if(title)title.textContent=`Welcome, ${c.learner.nickname||"Scholar"}`;
      if(text)text.textContent=notice.message;
      const studentName=document.getElementById("studentName"),studentGrade=document.getElementById("studentGrade");
      if(studentName){studentName.value=c.learner.nickname||"";studentName.readOnly=true;studentName.title="Canonical learner name comes from the Academy Family Registry."}
      if(studentGrade&&c.gradeId){studentGrade.value=c.gradeId;studentGrade.disabled=true;studentGrade.title="Formal grade placement is managed in the Academy Family Hub."}
    }
    global.dispatchEvent(new CustomEvent("khaemenes-elementary-adapter-ready",{detail:{version:VERSION,status:notice.status,learnerId:c.learnerId,grade:c.grade}}));
  }

  function continueCanonical(){const path=recommendedGradePath();if(path)global.location.href=path;else global.location.href=routeNotice().url}

  const API=Object.freeze({version:VERSION,legacyKey:LEGACY_KEY,canonicalState,compatibilitySnapshot,importLegacyPreferences,learnerStorageKey,readLearnerState,writeLearnerState,recommendedGradePath,routeNotice,decoratePage,continueCanonical,ensureBetaProgramLink});
  Object.defineProperty(global,"KhaemenesElementaryAcademyAdapter",{value:API,enumerable:false,configurable:true,writable:false});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{ensureBetaProgramLink();setTimeout(decoratePage,0)},{once:true});else{ensureBetaProgramLink();setTimeout(decoratePage,0)}
  global.addEventListener("khaemenes-family-changed",decoratePage);
  global.addEventListener("khaemenes-learner-placement-changed",decoratePage);
})(window);
