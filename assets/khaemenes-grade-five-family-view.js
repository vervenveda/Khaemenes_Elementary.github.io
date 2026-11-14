(function(global){"use strict";
if(global.KhaemenesGradeFiveFamilyView)return;
const COURSE="elementary-grade-05",PREFIX="khaemenes.course:",PASS=80,$=id=>document.getElementById(id);
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{},l=R?.getLearner?.(ids.learnerId),f=R?.getFamily?.(ids.familyId);
 const grade=String(l?.grade||"").replace(/[^0-9]/g,"").padStart(2,"0");
 return l&&f&&l.learnerId===ids.learnerId&&l.familyId===f.familyId&&l.stage==="elementary"&&grade==="05"&&l.selfDirectedAdult!==true&&f.learnerIds?.includes(l.learnerId)?l:null;
}
function owned(id){
 try{const record=JSON.parse(global.localStorage.getItem(PREFIX+id+":"+COURSE)||"null");
 return record?.format==="khaemenes-course-state-v1"&&record.learnerId===id&&record.courseId===COURSE&&record.state&&typeof record.state==="object"&&!Array.isArray(record.state)?record.state:null}catch{return null}
}
const passed=x=>typeof x==="number"&&Number.isFinite(x)&&x>=PASS&&x<=100;
function socialStudies(id){
 try{
  const data=JSON.parse(global.localStorage.getItem(PREFIX+id+":"+COURSE+"-social-studies")||"null");
  if(!Array.isArray(data?.students))return Object.freeze({kind:"pending"});
  const matches=data.students.filter(x=>x?.academyLearnerId===id&&x.id==="academy_"+id);
  if(matches.length!==1)return Object.freeze({kind:"pending"});
  const x=matches[0],weeks=x.weeks&&typeof x.weeks==="object"?x.weeks:{};
  return Object.freeze({kind:"report",mastered:Array.from({length:36},(_,i)=>i+1).filter(n=>passed(weeks[n]?.best)).length,
   midterm:passed(x.exams?.midterm?.best),final:passed(x.exams?.final?.best)});
 }catch{return Object.freeze({kind:"pending"})}
}
function snapshot(){
 const child=selected();if(!child)return Object.freeze({kind:"unavailable"});
 const subject=socialStudies(child.learnerId),state=owned(child.learnerId);
 if(!state)return Object.freeze({kind:"pending",subject});
 const weekly=state.weekly&&typeof state.weekly==="object"&&!Array.isArray(state.weekly)?state.weekly:{};
 const mastered=Array.from({length:36},(_,i)=>i+1).filter(n=>passed(weekly[n])).length;
 const next=Array.from({length:36},(_,i)=>i+1).find(n=>!passed(weekly[n]))||null;
 return Object.freeze({kind:"report",nickname:child.nickname||"Grade 5 Scholar",learnerId:child.learnerId,mastered,next,
  midterm:passed(state.midterm),final:passed(state.final),portfolio:state.portfolio===true,subject});
}
function render(){
 const panel=$("gradeFiveFamilyOverview"),status=$("gradeFiveFamilyStatus"),detail=$("gradeFiveFamilyDetails"),sub=$("gradeFiveSubjectSummary");
 if(!panel||!status||!detail||!sub)return;
 const r=snapshot();panel.hidden=r.kind==="unavailable";
 if(r.kind==="unavailable"){status.textContent="";detail.textContent="";sub.textContent="";return}
 sub.textContent=r.subject?.kind==="report"?
  "Social Studies · Separate subject course: "+r.subject.mastered+" of 36 weeks mastered. Midterm: "+
  (r.subject.midterm?"mastered":"pending")+". Final: "+(r.subject.final?"mastered":"pending")+
  ". These scores do not alter integrated Grade 5 mastery.":
  "Social Studies: No verified learner-owned subject progress available on this device.";
 if(r.kind==="pending"){status.textContent="No verified Grade 5 integrated course record on this device.";detail.textContent="No scores have been imported or changed.";return}
 status.textContent=r.nickname+" · "+r.mastered+" of 36 integrated weeks mastered at 80% or higher.";
 const next=r.next?"Week "+String(r.next).padStart(2,"0"):!r.midterm?"Midterm Assessment":!r.final?"Final Assessment":"Portfolio and completion review";
 detail.textContent="Recommended focus: "+next+". Midterm: "+(r.midterm?"mastered":"pending")+
 ". Final: "+(r.final?"mastered":"pending")+". Portfolio flag: "+(r.portfolio?"locally recorded complete":"adult review pending")+
 ". Official completion requires separately verified adult authority.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
["pageshow","khaemenes-family-changed","khaemenes-grade5-continuity-ready","khaemenes-grade5-subject-context","khaemenes-learner-placement-changed"].forEach(name=>global.addEventListener(name,render));
global.addEventListener("storage",e=>{if(e.key?.startsWith(PREFIX)||e.key==="khaemenes_family_registry_v1"||e.key==="khaemenes_active_learner_v1")render()});
global.KhaemenesGradeFiveFamilyView=Object.freeze({version:"1.0.0",selected,snapshot,socialStudies,render});
})(window);