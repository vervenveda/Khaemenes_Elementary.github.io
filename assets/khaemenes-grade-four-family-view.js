(function(global){"use strict";
if(global.KhaemenesGradeFourFamilyView)return;
const COURSE="elementary-grade-04",KEY="khaemenes.course:";
const $=id=>document.getElementById(id);
function selected(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{},child=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return child&&family&&child.learnerId===ids.learnerId&&child.familyId===family.familyId&&child.stage==="elementary"&&
  (child.grade==="04"||child.grade===4)&&child.selfDirectedAdult!==true&&family.learnerIds?.includes(child.learnerId)?child:null;
}
function owned(id){
 try{const raw=JSON.parse(global.localStorage.getItem(KEY+id+":"+COURSE)||"null");
  return raw?.format==="khaemenes-course-state-v1"&&raw.learnerId===id&&raw.courseId===COURSE&&raw.state&&
  typeof raw.state==="object"&&!Array.isArray(raw.state)?raw.state:null;
 }catch{return null}
}
const passed=x=>typeof x==="number"&&Number.isFinite(x)&&x>=80&&x<=100;
function snapshot(){
 const l=selected();if(!l)return Object.freeze({kind:"unavailable"});
 const state=owned(l.learnerId);if(!state)return Object.freeze({kind:"pending"});
 const weekly=state.weekly&&typeof state.weekly==="object"&&!Array.isArray(state.weekly)?state.weekly:{};
 const mastered=Array.from({length:36},(_,i)=>i+1).filter(n=>passed(weekly[n])).length;
 const next=Array.from({length:36},(_,i)=>i+1).find(n=>!passed(weekly[n]))||null;
 return Object.freeze({kind:"report",learnerId:l.learnerId,nickname:l.nickname||"Fourth Grade Scholar",
 mastered,next,midterm:passed(state.midterm),final:passed(state.final),portfolio:state.portfolio===true});
}
function render(){
 const panel=$("gradeFourFamilyOverview"),status=$("gradeFourFamilyOverviewStatus"),detail=$("gradeFourFamilyDetails");
 if(!panel||!status||!detail)return;
 const x=snapshot();panel.hidden=x.kind==="unavailable";
 if(x.kind==="unavailable"){status.textContent="";detail.textContent="";return}
 if(x.kind==="pending"){status.textContent="No verified learner-owned Grade 4 record is available on this browser.";detail.textContent="No grades were imported or changed.";return}
 status.textContent=x.nickname+" · "+x.mastered+" of 36 learning weeks mastered at 80% or higher.";
 detail.textContent="Next: "+(x.next?"Week "+String(x.next).padStart(2,"0"):x.midterm?x.final?"Portfolio and certificate review":"Final Assessment":"Midterm Assessment")+
 ". Midterm: "+(x.midterm?"mastered":"pending")+". Final: "+(x.final?"mastered":"pending")+
 ". Portfolio: "+(x.portfolio?"recorded complete":"adult review pending")+".";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
["pageshow","khaemenes-family-changed","khaemenes-grade4-continuity-ready","khaemenes-learner-placement-changed"].forEach(e=>global.addEventListener(e,render));
global.addEventListener("storage",e=>{if(e.key?.startsWith(KEY)||e.key==="khaemenes_active_learner_v1"||e.key==="khaemenes_family_registry_v1")render()});
global.KhaemenesGradeFourFamilyView=Object.freeze({version:"1.0.0",selected,snapshot,render});
})(window);