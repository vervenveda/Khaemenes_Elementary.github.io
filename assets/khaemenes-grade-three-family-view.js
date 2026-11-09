(function(global){
"use strict";
if(global.KhaemenesGradeThreeFamilyView)return;
const COURSE="elementary-grade-03",PREFIX="khaemenes.course:";
const $=id=>document.getElementById(id);
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{},child=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return child&&family&&child.learnerId===ids.learnerId&&child.familyId===family.familyId&&
 child.stage==="elementary"&&child.grade==="03"&&child.selfDirectedAdult!==true&&
 family.learnerIds?.includes(child.learnerId)?child:null;
}
function verified(learnerId){
 try{
  const v=JSON.parse(global.localStorage.getItem(PREFIX+learnerId+":"+COURSE)||"null");
  return v?.format==="khaemenes-course-state-v1"&&v.learnerId===learnerId&&v.courseId===COURSE&&
   v.state&&typeof v.state==="object"&&!Array.isArray(v.state)?v.state:null;
 }catch{return null}
}
function count(state){
 if(!state)return null;
 const weekly=state.weekly&&typeof state.weekly==="object"&&!Array.isArray(state.weekly)?state.weekly:{};
 let n=0;
 for(let w=1;w<=36;w++){const v=weekly[w];if(typeof v==="number"&&Number.isFinite(v)&&v>=80&&v<=100)n++}
 return n;
}
function snapshot(){
 const child=selected();if(!child)return Object.freeze({kind:"unavailable"});
 const C=global.KhaemenesLearningContinuation;
 let report=null;
 try{report=C?.readCourse?.(child.learnerId,COURSE)||null}catch{}
 const state=verified(child.learnerId);
 const valid=report?.learnerId===child.learnerId&&report.courseId===COURSE&&report.grade==="03"&&report.stage==="elementary";
 if(!valid&&!state)return Object.freeze({kind:"pending"});
 const completed=valid&&Number.isInteger(report.progress?.completed)&&report.progress.completed>=0&&report.progress.completed<=36?
  report.progress.completed:count(state);
 return Object.freeze({kind:"report",nickname:child.nickname||"Grade 3 Scholar",completed,
 next:valid?String(report.nextTitle||"Open Grade 3").slice(0,120):"Open Grade 3 learning",
 needsReview:valid&&report.family?.needsAction===true,
 stale:!valid||report.stale===true,
 midterm:state?typeof state.midterm==="number"&&state.midterm>=80&&state.midterm<=100:null,
 final:state?typeof state.final==="number"&&state.final>=80&&state.final<=100:null,
 portfolio:state?state.portfolio===true:null});
}
function render(){
 const el=$("gradeThreeFamilyOverview"),status=$("gradeThreeFamilyOverviewStatus"),details=$("gradeThreeFamilyDetails");
 if(!el||!status||!details)return;
 const r=snapshot();el.hidden=r.kind==="unavailable";
 if(r.kind==="unavailable"){status.textContent="";details.textContent="";return}
 if(r.kind==="pending"){
  status.textContent="Registered Grade 3 learner selected; no verified course progress is available on this browser.";
  details.textContent="No academic scores were imported or created.";return;
 }
 status.textContent=r.nickname+" · "+(r.completed===null?"No verified weekly count":r.completed+" of 36 integrated weeks reported")+
 ". Next step: "+r.next+".";
 details.textContent=(r.needsReview?"Family portfolio review requested. ":"")+
 (r.stale?"Open the Grade 3 course for the latest progress. ":"")+
 (r.midterm===null?"Midterm status not verified. ":"Midterm: "+(r.midterm?"mastered. ":"pending. "))+
 (r.final===null?"Final status not verified. ":"Final: "+(r.final?"mastered. ":"pending. "))+
 (r.portfolio===null?"Portfolio status not verified.":"Portfolio: "+(r.portfolio?"recorded complete.":"review pending."));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
for(const e of ["pageshow","khaemenes-family-changed","khaemenes-learning-continuation-changed","khaemenes-grade3-continuity-synced","khaemenes-learner-placement-changed"])global.addEventListener(e,render);
global.addEventListener("storage",e=>{if(e.key==="khaemenes_family_registry_v1"||e.key==="khaemenes_active_learner_v1"||e.key?.startsWith(PREFIX))render()});
global.KhaemenesGradeThreeFamilyView=Object.freeze({version:"1.0.0",selected,snapshot,render});
})(window);