(function attachKhaemenesElementaryContinuationPublisher(global){
"use strict";
const VERSION="1.1.0",PASS=80;
const CONT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";
const REGISTRY_KEY="khaemenes_family_registry_v1",ACTIVE_KEY="khaemenes_active_learner_v1";
const CFG={
 "02":{api:"KhaemenesGrade2Continuity",courseId:"elementary-grade-02",title:"Second Grade",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",weekBase:null},
 "03":{api:"KhaemenesGrade3Continuity",courseId:"elementary-grade-03",title:"Third Grade",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",weekBase:"weekly-plans/week-"},
 "04":{api:"KhaemenesGrade4Continuity",courseId:"elementary-grade-04",title:"Fourth Grade",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",weekBase:"weekly-plans/week-"},
 "05":{api:"KhaemenesGrade5Continuity",courseId:"elementary-grade-05",title:"Fifth Grade",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",weekBase:"weekly-plans/week-"}
};
const pad=n=>String(n).padStart(2,"0");
const readJSON=(key,fallback=null)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
function grade(){const m=String(location.pathname||"").match(/grade-(0[2-5])/i);return m?m[1]:null}
function config(){const g=grade();return g&&CFG[g]?{...CFG[g],grade:g,base:`https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-${g}/`}:null}
function activeLearner(conf){
 const registry=readJSON(REGISTRY_KEY,null),id=readJSON(ACTIVE_KEY,null),learner=id&&registry?.learners?.[id]?registry.learners[id]:null;
 if(!learner)return null;
 const g=String(learner.grade||"").replace(/[^0-9]/g,"").padStart(2,"0"),stage=String(learner.stage||"").toLowerCase();
 return g===conf.grade&&stage==="elementary"?learner:null;
}
function unwrap(value){return value&&typeof value==="object"&&value.format==="khaemenes-course-state-v1"&&value.state?value.state:value}
function context(conf){
 const API=global[conf.api],apiStatus=API?.status?.();
 if(apiStatus?.status==="ready"&&apiStatus.learner?.learnerId){
   return {learner:apiStatus.learner,state:API.readState?.({weekly:{},midterm:0,final:0,portfolio:false})||{}};
 }
 const learner=activeLearner(conf);if(!learner)return null;
 const scoped=unwrap(readJSON(`khaemenes.course:${learner.learnerId}:${conf.courseId}`,null));
 return scoped?{learner,state:scoped}:null;
}
function score(state,n){
 const has=Object.prototype.hasOwnProperty.call(state?.weekly||{},String(n))||Object.prototype.hasOwnProperty.call(state?.weekly||{},n);
 if(!has)return 0;
 const v=Number(state.weekly[n]);return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0;
}
function masteredThrough(state,n){for(let i=1;i<=n;i++)if(score(state,i)<PASS)return false;return true}
function weekHref(conf,n,attempted){
 if(attempted)return new URL(`assessments/week-${pad(n)}-assessment.html`,conf.base).href;
 if(conf.weekBase)return new URL(`${conf.weekBase}${pad(n)}.html`,conf.base).href;
 return new URL("index.html#weeks",conf.base).href;
}
async function ensureContract(){
 if(global.KhaemenesLearningContinuation)return global.KhaemenesLearningContinuation;
 const existing=[...document.scripts].find(s=>s.src===CONT_URL);
 if(existing)return new Promise(resolve=>{existing.addEventListener("load",()=>resolve(global.KhaemenesLearningContinuation),{once:true});setTimeout(()=>resolve(global.KhaemenesLearningContinuation),1000)});
 return new Promise(resolve=>{const s=document.createElement("script");s.src=CONT_URL;s.async=false;s.onload=()=>resolve(global.KhaemenesLearningContinuation);s.onerror=()=>resolve(null);document.head.append(s)});
}
async function publish(){
 const conf=config();if(!conf)return false;
 const C=await ensureContract();if(!C?.publish)return false;
 const ctx=context(conf);if(!ctx?.learner?.learnerId)return false;
 const state=ctx.state||{},weeks=Array.from({length:36},(_,i)=>i+1),completed=weeks.filter(n=>score(state,n)>=PASS).length;
 let status="continue",nextLabel="Continue Learning",nextTitle="",nextHref="",summary="",best=null,family={needsAction:false,label:"",summary:"",href:""};
 const first=weeks.find(n=>score(state,n)<PASS);
 if(first&&first>18&&masteredThrough(state,18)&&Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));status=best>0?"corrections":"assessment";
   nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=new URL(conf.midterm,conf.base).href;
   summary=best>0?`Midterm best score is ${best}%. Review and retry to reach ${PASS}%.`:"Weeks 01–18 are mastered. The Midyear Assessment is the next formal step.";
 }else if(first){
   best=score(state,first);status=best>0?"corrections":"continue";nextLabel=best>0?"Review & Retry":"Continue Learning";
   nextTitle=`Week ${pad(first)}`;nextHref=weekHref(conf,first,best>0);
   summary=best>0?`Week ${pad(first)} is at ${best}%. Review and retry to reach ${PASS}%.`:`Week ${pad(first)} is the next learning block.`;
 }else if(Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=new URL(conf.midterm,conf.base).href;summary="Complete the Midyear Assessment at 80% or higher.";
 }else if(Number(state.final||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.final||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Final":"Open Final";nextTitle="Final Assessment";nextHref=new URL(conf.final,conf.base).href;summary="Complete the Final Assessment at 80% or higher.";
 }else if(!state.portfolio){
   status="mastery";nextLabel="Portfolio Review";nextTitle="Portfolio Evidence";nextHref=new URL("records/certificate.html",conf.base).href;summary="Academic score gates are complete. Adult portfolio approval remains before certification.";
   family={needsAction:true,label:"Portfolio review",summary:"Review the learner portfolio evidence and mark completion when the required work is present.",href:nextHref};
 }else{
   status="complete";nextLabel="Open Certificate";nextTitle=`${conf.title} Complete`;nextHref=new URL("records/certificate.html",conf.base).href;summary="All recorded completion gates are satisfied.";best=100;
 }
 try{
   C.publish({learnerId:ctx.learner.learnerId,courseId:conf.courseId,school:"Khaemenes Elementary School",stage:"elementary",grade:conf.title,subject:"Integrated Elementary Program",courseTitle:`Khaemenes ${conf.title}`,status,nextLabel,nextTitle,nextHref,summary,progress:{completed,total:36,percent:Math.round(completed/36*100)},mastery:{best,threshold:PASS,mastered:status==="complete"},family,source:`elementary-${conf.courseId}-continuity`});
   return true;
 }catch{return false}
}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(()=>publish(),90)}
function boot(){
 publish();
 ["input","change","click"].forEach(type=>document.addEventListener(type,schedule,true));
 ["khaemenes-grade2-continuity-synced","khaemenes-grade3-continuity-synced","khaemenes-grade4-continuity-ready","khaemenes-grade5-continuity-ready","khaemenes-family-changed"].forEach(type=>global.addEventListener(type,schedule));
 global.addEventListener("pageshow",schedule);global.addEventListener("storage",schedule);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesElementaryContinuationPublisher=Object.freeze({version:VERSION,publish});
})(window);