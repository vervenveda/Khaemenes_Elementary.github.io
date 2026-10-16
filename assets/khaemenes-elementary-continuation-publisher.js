(function attachKhaemenesElementaryContinuationPublisher(global){
"use strict";
const VERSION="1.0.0",PASS=80;
const CFG={
 "02":{api:"KhaemenesGrade2Continuity",data:"KHAE_GRADE2_DATA",courseId:"elementary-grade-02",title:"Second Grade",weekBase:"",assessmentBase:"assessments/week-",midterm:"assessments/midterm.html",final:"assessments/final.html"},
 "03":{api:"KhaemenesGrade3Continuity",data:"KHAE_GRADE3_DATA",courseId:"elementary-grade-03",title:"Third Grade",weekBase:"weekly-plans/week-",assessmentBase:"assessments/week-",midterm:"assessments/midterm.html",final:"assessments/final.html"},
 "04":{api:"KhaemenesGrade4Continuity",data:"KHAE_GRADE4_DATA",courseId:"elementary-grade-04",title:"Fourth Grade",weekBase:"weekly-plans/week-",assessmentBase:"assessments/week-",midterm:"assessments/midterm.html",final:"assessments/final.html"},
 "05":{api:"KhaemenesGrade5Continuity",data:"KHAE_GRADE5_DATA",courseId:"elementary-grade-05",title:"Fifth Grade",weekBase:"weekly-plans/week-",assessmentBase:"assessments/week-",midterm:"assessments/midterm.html",final:"assessments/final.html"}
};
const pad=n=>String(n).padStart(2,"0");
function grade(){
 const m=String(global.location?.pathname||"").match(/grade-(0[2-5])/i);
 return m?m[1]:null;
}
function score(state,n){return Math.max(0,Math.min(100,Number(state?.weekly?.[n]||0)))}
function masteredThrough(state,n){
 for(let i=1;i<=n;i++)if(score(state,i)<PASS)return false;
 return true;
}
function config(){const g=grade();return g?CFG[g]:null}
function hrefForWeek(cfg,n,hasAttempt){
 if(hasAttempt)return `${cfg.assessmentBase}${pad(n)}-assessment.html`;
 if(cfg.weekBase)return `${cfg.weekBase}${pad(n)}.html`;
 return "index.html#weeks";
}
function publish(){
 const cfg=config(),C=global.KhaemenesLearningContinuation;
 if(!cfg||!C?.publish)return false;
 const API=global[cfg.api],DATA=global[cfg.data],ctx=API?.status?.();
 if(ctx?.status!=="ready"||!ctx.learner?.learnerId)return false;
 const state=API.readState?.({weekly:{},midterm:0,final:0,portfolio:false})||{weekly:{},midterm:0,final:0,portfolio:false};
 const weeks=(DATA?.units||DATA?.weeks||[]).map(w=>Number(w.week)).filter(Boolean);
 const total=weeks.length||36,completed=weeks.filter(n=>score(state,n)>=PASS).length;
 let status="continue",nextLabel="Continue Learning",nextTitle="",nextHref="",summary="",best=null,family={needsAction:false,label:"",summary:"",href:""};

 const firstOpen=weeks.find(n=>score(state,n)<PASS);
 if(firstOpen && firstOpen>18 && masteredThrough(state,18) && Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));
   status=best>0?"corrections":"assessment";
   nextLabel=best>0?"Review Midterm":"Open Midterm";
   nextTitle="Midyear Assessment";
   nextHref=cfg.midterm;
   summary=best>0?`Midterm best score is ${best}%. Review and retry to reach ${PASS}%.`:"Weeks 01–18 are mastered. The Midyear Assessment is the next formal step.";
 }else if(firstOpen){
   best=score(state,firstOpen);
   status=best>0?"corrections":"continue";
   nextLabel=best>0?"Review & Retry":"Continue Learning";
   nextTitle=`Week ${pad(firstOpen)}`;
   nextHref=hrefForWeek(cfg,firstOpen,best>0);
   summary=best>0?`Week ${pad(firstOpen)} is at ${best}%. Review the week and retry the assessment to reach ${PASS}%.`:`Week ${pad(firstOpen)} is the next learning block.`;
 }else if(Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));
   status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=cfg.midterm;summary="Complete the Midyear Assessment at 80% or higher.";
 }else if(Number(state.final||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.final||0)));
   status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Final":"Open Final";nextTitle="Final Assessment";nextHref=cfg.final;summary="Complete the Final Assessment at 80% or higher.";
 }else if(!state.portfolio){
   status="mastery";nextLabel="Portfolio Review";nextTitle="Portfolio Evidence";nextHref="records/certificate.html";summary="Academic score gates are complete. Adult portfolio approval remains before certification.";
   family={needsAction:true,label:"Portfolio review",summary:"Review the learner portfolio evidence and mark completion when the required work is present.",href:"records/certificate.html"};
 }else{
   status="complete";nextLabel="Open Certificate";nextTitle=`${cfg.title} Complete`;nextHref="records/certificate.html";summary="All recorded completion gates are satisfied.";best=100;
 }
 try{
   C.publish({
     learnerId:ctx.learner.learnerId,courseId:cfg.courseId,school:"Khaemenes Elementary School",stage:"elementary",grade:cfg.title,
     subject:"Integrated Elementary Program",courseTitle:`Khaemenes ${cfg.title}`,status,nextLabel,nextTitle,nextHref,summary,
     progress:{completed,total,percent:Math.round(completed/Math.max(1,total)*100)},
     mastery:{best,threshold:PASS,mastered:status==="complete"},
     family,source:`elementary-${cfg.courseId}-continuity`
   });
   return true;
 }catch{return false}
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(publish,60)}
function boot(){
 publish();
 ["input","change"].forEach(type=>document.addEventListener(type,schedule,true));
 ["khaemenes-grade2-continuity-synced","khaemenes-grade3-continuity-synced","khaemenes-grade4-continuity-ready","khaemenes-grade5-continuity-ready","khaemenes-family-changed"].forEach(type=>global.addEventListener(type,schedule));
 global.addEventListener("storage",schedule);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesElementaryContinuationPublisher=Object.freeze({version:VERSION,publish});
})(window);