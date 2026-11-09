(function(global){
"use strict";
if(global.KhaemenesGradeTwoFamilyView)return;
const COURSE_ID="elementary-grade-02",KEY="khaemenes.course:";
const $=id=>document.getElementById(id);
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{};
 const child=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return child&&family&&child.learnerId===ids.learnerId&&child.familyId===family.familyId&&
   child.stage==="elementary"&&child.grade==="02"&&child.selfDirectedAdult!==true&&
   family.learnerIds?.includes(child.learnerId)?child:null;
}
function snapshot(){
 const child=selected();
 if(!child)return Object.freeze({kind:"unavailable"});
 const learnerId=child.learnerId;
 const C=global.KhaemenesLearningContinuation;
 let entry=null;
 try{entry=C?.readCourse?.(learnerId,COURSE_ID)||null}catch{}
 const valid=entry?.learnerId===learnerId&&entry.courseId===COURSE_ID&&
   entry.stage==="elementary"&&entry.grade==="02";
 if(valid){
  return Object.freeze({kind:"report",nickname:child.nickname||"Grade 2 Scholar",learnerId,
    completed:Number.isInteger(entry.progress?.completed)&&entry.progress.completed>=0&&entry.progress.completed<=36?entry.progress.completed:null,
    total:36,next:String(entry.nextTitle||"Open Grade 2 learning").slice(0,120),
    familyAttention:entry.family?.needsAction===true,stale:entry.stale===true});
 }
 // Fallback only displays verified course ownership; never assigns raw historical records.
 let record=null;
 try{record=JSON.parse(global.localStorage.getItem(KEY+learnerId+":"+COURSE_ID)||"null")}catch{}
 if(record?.format!=="khaemenes-course-state-v1"||record.learnerId!==learnerId||
    record.courseId!==COURSE_ID||!record.state||typeof record.state!=="object"||Array.isArray(record.state))
  return Object.freeze({kind:"pending",nickname:child.nickname||"Grade 2 Scholar",learnerId});
 const weekly=record.state.weekly||{};
 let completed=0;
 for(let n=1;n<=36;n++){
  const raw=weekly[n];if(typeof raw==="number"&&Number.isFinite(raw)&&raw>=80&&raw<=100)completed++;
 }
 return Object.freeze({kind:"report",nickname:child.nickname||"Grade 2 Scholar",learnerId,
    completed,total:36,next:"Open Grade 2 learning",familyAttention:false,stale:true});
}
function render(){
 const panel=$("gradeTwoFamilyOverview"),status=$("gradeTwoFamilyOverviewStatus"),
 progress=$("gradeTwoFamilyProgress");
 if(!panel||!status||!progress)return;
 const result=snapshot();
 panel.hidden=result.kind==="unavailable";
 if(result.kind==="unavailable"){status.textContent="";progress.textContent="";return}
 if(result.kind==="pending"){
  status.textContent="Grade 2 family profile linked. No verified learner-owned course summary is available on this browser.";
  progress.textContent="Course records remain in their original system. No grades were imported or changed.";
  return;
 }
 status.textContent=result.nickname+" · "+(result.completed===null?"Learning progress not reported":result.completed+" of 36 learning weeks reported")+".";
 progress.textContent="Next: "+result.next+". "+(result.familyAttention?"Adult portfolio review requested. ":"")+
 (result.stale?"Open Grade 2 to refresh the progress summary.":"");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
for(const event of ["pageshow","khaemenes-family-changed","khaemenes-learner-placement-changed",
 "khaemenes-learning-continuation-changed","khaemenes-grade2-continuity-synced"])
 global.addEventListener(event,render);
global.addEventListener("storage",event=>{
 if(event.key==="khaemenes_family_registry_v1"||event.key==="khaemenes_active_learner_v1"||
    event.key?.startsWith(KEY))render();
});
global.KhaemenesGradeTwoFamilyView=Object.freeze({version:"1.0.0",selected,snapshot,render});
})(window);
