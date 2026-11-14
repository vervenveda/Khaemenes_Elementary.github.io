(function(global){
"use strict";
if(global.KhaemenesGradeTwoFamilyView)return;
const COURSE_ID="elementary-grade-02",KEY="khaemenes.course:";
const $=id=>document.getElementById(id);
const SUBJECTS=Object.freeze([
 Object.freeze({name:"Language Arts",path:"language-arts"}),
 Object.freeze({name:"Mathematics",path:"mathematics"}),
 Object.freeze({name:"Science",path:"science"}),
 Object.freeze({name:"Social Studies",path:"social-studies"}),
 Object.freeze({name:"Arts & Music",path:"arts-music"}),
 Object.freeze({name:"Health, PE & SEL",path:"health-pe-sel"}),
 Object.freeze({name:"Technology & Tools",path:"technology"}),
 Object.freeze({name:"Integrated Projects",path:"integrated-projects"})
]);
const BASE="https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-02/";
function verifiedState(learnerId){
 let stored=null;
 try{stored=JSON.parse(global.localStorage.getItem(KEY+learnerId+":"+COURSE_ID)||"null")}catch{}
 if(stored?.format!=="khaemenes-course-state-v1"||stored.learnerId!==learnerId||
  stored.courseId!==COURSE_ID||!stored.state||typeof stored.state!=="object"||Array.isArray(stored.state))return null;
 return stored.state;
}
function achievements(state){
 if(!state)return null;
 const weekly=state.weekly&&typeof state.weekly==="object"&&!Array.isArray(state.weekly)?state.weekly:{};
 const scored=n=>typeof weekly[n]==="number"&&Number.isFinite(weekly[n])&&weekly[n]>=80&&weekly[n]<=100;
 let mastered=0,firstUnmastered=1;
 for(let n=1;n<=36;n++){if(scored(n))mastered++;else if(firstUnmastered===1&&scored(1))firstUnmastered=n}
 firstUnmastered=Array.from({length:36},(_,i)=>i+1).find(n=>!scored(n))||null;
 const midterm=typeof state.midterm==="number"&&state.midterm>=80&&state.midterm<=100;
 const final=typeof state.final==="number"&&state.final>=80&&state.final<=100;
 const portfolio=state.portfolio===true;
 return Object.freeze({mastered,nextWeek:firstUnmastered,midterm,final,portfolio,
  celebrations:Object.freeze([6,12,18,24,30,36].filter(n=>mastered>=n))});
}

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
 const state=verifiedState(learnerId),milestones=achievements(state);
 const C=global.KhaemenesLearningContinuation;
 let entry=null;
 try{entry=C?.readCourse?.(learnerId,COURSE_ID)||null}catch{}
 const valid=entry?.learnerId===learnerId&&entry.courseId===COURSE_ID&&
   entry.stage==="elementary"&&entry.grade==="02";
 if(valid){
  return Object.freeze({kind:"report",nickname:child.nickname||"Grade 2 Scholar",learnerId,
    completed:Number.isInteger(entry.progress?.completed)&&entry.progress.completed>=0&&entry.progress.completed<=36?entry.progress.completed:null,
    total:36,next:String(entry.nextTitle||"Open Grade 2 learning").slice(0,120),
    familyAttention:entry.family?.needsAction===true,stale:entry.stale===true,milestones});
 }
 // Fallback uses only a verified, learner-owned Grade 2 course record.
 if(!state)return Object.freeze({kind:"pending",nickname:child.nickname||"Grade 2 Scholar",learnerId,milestones:null});
 return Object.freeze({kind:"report",nickname:child.nickname||"Grade 2 Scholar",learnerId,
   completed:milestones.mastered,total:36,next:milestones.nextWeek?"Week "+String(milestones.nextWeek).padStart(2,"0"):"Open Grade 2 learning",
   familyAttention:false,stale:true,milestones});
}
function renderExtra(result){
 const daily=$("gradeTwoDailySummary"),halls=$("gradeTwoSubjectHalls"),
  milestonesBox=$("gradeTwoMilestones"),portfolio=$("gradeTwoPortfolioStatus");
 if(!daily||!halls||!milestonesBox||!portfolio)return;
 halls.replaceChildren();
 daily.textContent="";milestonesBox.textContent="";portfolio.textContent="";
 if(result.kind==="unavailable")return;
 for(const subject of SUBJECTS){
  const link=document.createElement("a");
  link.className="button secondary";link.href=BASE+"subjects/"+subject.path+"/index.html";
  link.textContent=subject.name;halls.append(link);
 }
 if(result.kind==="pending"){
  daily.textContent="Open the Grade 2 course to find today's next lesson. A learner-owned report is not yet available here.";
  milestonesBox.textContent="Milestones will appear when verified Grade 2 records are available.";
  portfolio.textContent="Portfolio status not yet reported.";
  return;
 }
 const a=result.milestones;
 daily.textContent=a?.nextWeek?"Recommended focus: Week "+String(a.nextWeek).padStart(2,"0")+
  " in Grade 2. The course decides which lessons and assessments are available.":
  "Continue in the Grade 2 course to see the next available learning activity.";
 milestonesBox.textContent=a?"Celebrated weekly milestones: "+
  (a.celebrations.length?a.celebrations.map(n=>n+" weeks").join(" · "):"Your first milestone is six mastered weeks.")+
  " These are acknowledgements, not additional grades.":"Milestones are awaiting the verified course record.";
 portfolio.textContent=a?"Midterm: "+(a.midterm?"Mastered":"Not yet mastered")+
  " · Final: "+(a.final?"Mastered":"Not yet mastered")+
  " · Portfolio: "+(a.portfolio?"Recorded as complete":"Requires course or adult review")+
  ".":"Portfolio evidence is available through the Academy profile studio; completion status is not yet verified.";
}
function render(){
 const panel=$("gradeTwoFamilyOverview"),status=$("gradeTwoFamilyOverviewStatus"),
 progress=$("gradeTwoFamilyProgress");
 if(!panel||!status||!progress)return;
 const result=snapshot();
 renderExtra(result);
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
global.KhaemenesGradeTwoFamilyView=Object.freeze({version:"1.1.0",selected,snapshot,achievements,render});
})(window);
