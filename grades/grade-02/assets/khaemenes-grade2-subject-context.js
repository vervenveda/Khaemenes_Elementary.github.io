(function attachKhaemenesGrade2SubjectContext(global){
  "use strict";
  const VERSION="1.0.0";
  const EXPECTED_GRADE="02";
  const EXPECTED_STAGE="elementary";
  const SUBJECTS=Object.freeze({
    "language-arts":"Language Arts",
    mathematics:"Mathematics",
    science:"Science",
    "social-studies":"Social Studies",
    "arts-music":"Arts & Music",
    "health-pe-sel":"Health, PE & SEL",
    technology:"Technology & Tools",
    "integrated-projects":"Integrated Projects"
  });

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function learner(){return registry()?.getLearner?.()||null}
  function normalizeGrade(v){return registry()?.normalizeGrade?.(v)||String(v||"").replace(/[^0-9]/g,"").padStart(2,"0")}
  function normalizeStage(v){return registry()?.normalizeStage?.(v)||String(v||"").trim().toLowerCase()}
  function detectSubject(){
    const path=String(global.location?.pathname||"").toLowerCase();
    return Object.keys(SUBJECTS).find(id=>path.includes(`/subjects/${id}/`))||null;
  }
  function status(subjectId=detectSubject()){
    const l=learner(),subject=subjectId&&SUBJECTS[subjectId]?subjectId:null;
    if(!l)return Object.freeze({version:VERSION,status:"no-active-learner",subjectId:subject,subjectLabel:subject?SUBJECTS[subject]:null,placementMatch:false,learner:null});
    const grade=normalizeGrade(l.grade),stage=normalizeStage(l.stage),placementMatch=grade===EXPECTED_GRADE&&stage===EXPECTED_STAGE;
    return Object.freeze({version:VERSION,status:placementMatch?"ready":"placement-mismatch",subjectId:subject,subjectLabel:subject?SUBJECTS[subject]:null,placementMatch,learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false,silentlyChangesGrade:false})});
  }
  function scopedKey(subjectId=detectSubject()){
    const s=status(subjectId);return s.status==="ready"&&s.subjectId?`khaemenes.course:${s.learner.learnerId}:elementary-grade-02-${s.subjectId}`:null;
  }
  function publish(subjectId=detectSubject()){
    const s=status(subjectId);global.dispatchEvent(new CustomEvent("khaemenes-grade2-subject-context",{detail:s}));return s;
  }
  global.KhaemenesGrade2SubjectContext=Object.freeze({version:VERSION,subjects:SUBJECTS,status,scopedKey,publish,detectSubject});
})(window);
