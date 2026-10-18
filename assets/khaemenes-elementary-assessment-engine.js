/*
 * Khaemenes Elementary Formal Assessment Engine v1.0.0
 */
(function attachElementaryAssessmentEngine(global){
"use strict";
const VERSION="1.0.0",PASS=80;
const REGISTRY_KEY="khaemenes_family_registry_v1",ACTIVE_KEY="khaemenes_active_learner_v1";
const ATTEMPT_PREFIX="khaemenes.elementary.assessment.attempts";
const MENTOR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const uid=()=>`aea-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;

function grade(){const m=location.pathname.match(/\/grades\/grade-(0[1-5])\//i);if(m)return m[1];if(/\/assessments\//i.test(location.pathname))return"01";return null}
function kind(){if(/\/midterm\.html$/i.test(location.pathname))return"midterm";if(/\/final-exam\.html$/i.test(location.pathname))return"final";if(/\/(?:unit|week)-\d+-assessment\.html$/i.test(location.pathname))return"weekly";return null}
function week(){const m=location.pathname.match(/\/(?:unit|week)-(\d+)-assessment\.html$/i);return m?Math.max(1,Math.min(36,Number(m[1])||1)):null}
function learner(){
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null),l=id&&registry?.learners?.[id]?registry.learners[id]:null;
  if(!l)return null;
  const g=String(l.grade||"").replace(/[^0-9]/g,"").padStart(2,"0"),stage=String(l.stage||"").trim().toLowerCase();
  return stage==="elementary"&&g===grade()?{...l,grade:g}:null;
}
function courseKey(){const l=learner(),g=grade();return l?.learnerId&&g?`khaemenes.course:${l.learnerId}:elementary-grade-${g}`:null}
function blankState(){return grade()==="01"?{weeks:{},notes:{},daily:{},dailyResponses:{},handwritingImages:{},workSaved:{},portfolio:false}:{student:"Elementary Scholar",weekly:{},midterm:0,final:0,portfolio:false,assessmentMeta:{}}}
function readFormalState(){
  if(grade()==="01"&&global.Grade1Mastery?.load)return global.Grade1Mastery.load();
  const key=courseKey();if(!key)return blankState();
  const raw=read(key,null);if(raw?.format==="khaemenes-course-state-v1"&&raw.state)return raw.state;
  return raw&&typeof raw==="object"?raw:blankState();
}
function writeFormalState(state){
  if(grade()==="01"&&global.Grade1Mastery?.save)return global.Grade1Mastery.save(state);
  const key=courseKey(),l=learner();if(!key||!l)return false;
  return write(key,{format:"khaemenes-course-state-v1",learnerId:l.learnerId,courseId:`elementary-grade-${grade()}`,source:"elementary-assessment-engine-v1",updatedAt:new Date().toISOString(),state});
}
function weeklyBest(state,n){
  if(grade()==="01")return Number(state?.weeks?.[n]?.bestScore||0);
  const value=state?.weekly?.[n]??state?.weekly?.[String(n)]??0;
  return Number(value||0);
}
function milestoneBest(state,type){if(grade()==="01")return Number(state?.[type]?.bestScore||0);return Number(state?.[type]||0)}
function completedWeeks(state,end=36){let count=0;for(let n=1;n<=end;n++)if(weeklyBest(state,n)>=PASS)count++;return count}
function gate(){
  const l=learner(),state=readFormalState(),k=kind(),w=week();
  if(!l)return{open:true,preview:true,reason:"Preview attempt. Link the matching Academy learner to save formal mastery."};
  if(k==="weekly"){if(w===1)return{open:true,preview:false,reason:"Week 01 is open."};const prior=weeklyBest(state,w-1);return prior>=PASS?{open:true,preview:false,reason:`Week ${String(w-1).padStart(2,"0")} is mastered at ${prior}%.`}:{open:false,preview:false,reason:`Week ${String(w-1).padStart(2,"0")} must reach 80% before this quiz opens.`}}
  if(k==="midterm"){const done=completedWeeks(state,18);return done===18?{open:true,preview:false,reason:"Weeks 01–18 are mastered."}:{open:false,preview:false,reason:`${18-done} of the first 18 weeks still need 80% mastery.`}}
  if(k==="final"){const done=completedWeeks(state,36),mid=milestoneBest(state,"midterm");if(done<36)return{open:false,preview:false,reason:`${36-done} weekly mastery gate${36-done===1?"":"s"} remain before the final.`};if(mid<PASS)return{open:false,preview:false,reason:"The midterm must reach 80% before the final opens."};return{open:true,preview:false,reason:"All weekly gates and the midterm are mastered."}}
  return{open:false,preview:false,reason:"This page is not a recognized formal assessment."};
}
function focus(){const map=global.KhaemenesElementaryFocusMap,g=grade(),w=week();if(w&&map?.[g]?.[String(w)])return map[g][String(w)];return document.querySelector("h1")?.textContent||document.title||"Elementary cumulative mastery"}
function countForAssessment(){const g=Number(grade())||1,k=kind();if(k==="weekly")return g<=2?12:g===3?15:18;if(k==="midterm")return g<=2?24:g===3?28:32;return g<=2?30:g===3?34:40}
function poolSize(){return Math.max(countForAssessment()*2,kind()==="weekly"?32:64)}
function newAttemptQuestions(seed){
  const factory=global.KhaemenesElementaryQuestionFactory;if(!factory)return[];
  return factory.makeBalanced({grade:Number(grade()),focus:focus(),seed,count:poolSize(),includeLegacy:grade()==="01",scope:kind(),week:week()}).slice(0,countForAssessment());
}
function attemptsKey(){return `${ATTEMPT_PREFIX}:${learner()?.learnerId||"preview"}:grade-${grade()}`}
function attempts(){const value=read(attemptsKey(),[]);return Array.isArray(value)?value:[]}
function appendAttempt(snapshot){const list=attempts();list.push(snapshot);return write(attemptsKey(),list.slice(-160))}
function updateFormalScore(snapshot){
  const l=learner();if(!l)return false;
  const state=readFormalState(),k=kind(),w=week();
  if(k==="weekly"){
    if(grade()==="01"){
      state.weeks||={};const prev=state.weeks[w]||{attempts:0,bestScore:0},best=Math.max(Number(prev.bestScore||0),snapshot.score);
      state.weeks[w]={...prev,latestScore:snapshot.score,bestScore:best,attempts:Number(prev.attempts||0)+1,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"elementary-assessment-engine-v1",lastAttemptId:snapshot.id};
    }else{
      state.weekly||={};state.assessmentMeta||={};state.assessmentMeta.weekly||={};
      const prevMeta=state.assessmentMeta.weekly[w]||{attempts:0,bestScore:Number(state.weekly[w]||0)},best=Math.max(Number(state.weekly[w]||0),snapshot.score);
      state.weekly[w]=best;
      state.assessmentMeta.weekly[w]={attempts:Number(prevMeta.attempts||0)+1,latestScore:snapshot.score,bestScore:best,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"elementary-assessment-engine-v1",lastAttemptId:snapshot.id};
    }
  }else{
    if(grade()==="01"){
      const prev=state[k]||{attempts:0,bestScore:0},best=Math.max(Number(prev.bestScore||0),snapshot.score);
      state[k]={...prev,latestScore:snapshot.score,bestScore:best,attempts:Number(prev.attempts||0)+1,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"elementary-assessment-engine-v1",lastAttemptId:snapshot.id};
    }else{
      state.assessmentMeta||={};
      const prevMeta=state.assessmentMeta[k]||{attempts:0,bestScore:Number(state[k]||0)},best=Math.max(Number(state[k]||0),snapshot.score);
      state[k]=best;
      state.assessmentMeta[k]={attempts:Number(prevMeta.attempts||0)+1,latestScore:snapshot.score,bestScore:best,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"elementary-assessment-engine-v1",lastAttemptId:snapshot.id};
    }
  }
  const ok=writeFormalState(state);
  if(ok)global.dispatchEvent(new CustomEvent("khaemenes-elementary-assessment-recorded",{detail:{learnerId:l.learnerId,grade:grade(),kind:k,week:w,score:snapshot.score,attemptId:snapshot.id}}));
  return ok;
}
function bestScore(){const state=readFormalState();return kind()==="weekly"?weeklyBest(state,week()):milestoneBest(state,kind())}
function nextHref(){
  const g=grade(),w=week();
  if(kind()==="weekly"&&w<36){if(g==="01")return`../lessons/unit-${String(w+1).padStart(2,"0")}/index.html`;if(g==="02")return"../index.html#weeks";return`../weekly-plans/week-${String(w+1).padStart(2,"0")}.html`}
  if(kind()==="weekly"&&w===36)return"midterm.html";
  if(kind()==="midterm")return"../index.html";
  if(kind()==="final")return"../records/certificate.html";
  return"../index.html";
}
function addStyle(){
  if(document.getElementById("elementaryAssessmentEngineStyle"))return;
  const style=document.createElement("style");style.id="elementaryAssessmentEngineStyle";
  style.textContent=`.elementary-assessment-engine{margin:18px 0;padding:18px;border:1px solid rgba(24,56,83,.18);border-radius:14px;background:linear-gradient(145deg,#fff,#f3f8fb);box-shadow:0 12px 30px rgba(20,55,86,.08)}.elementary-assessment-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}.elementary-assessment-engine h2{margin:0;color:#173a5a;font-family:Georgia,serif}.elementary-assessment-meta{font-size:.82rem;color:#68757e}.elementary-assessment-badge{display:inline-block;margin:4px 4px 0 0;padding:5px 8px;border-radius:999px;background:#eaf2f7;color:#315b76;font-size:.72rem;font-weight:800}.elementary-assessment-question{margin:13px 0;padding:14px;border:1px solid rgba(24,56,83,.14);border-radius:10px;background:#fff}.elementary-assessment-question legend{font-weight:800;color:#203b52;padding:0 5px}.elementary-assessment-option{display:block;margin:7px 0;padding:7px 8px;border-radius:7px}.elementary-assessment-option:hover{background:#f5f8fa}.elementary-assessment-feedback{margin-top:8px;padding:8px;border-radius:8px;background:#f5f7f8;font-size:.82rem}.elementary-assessment-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.elementary-assessment-actions button,.elementary-assessment-actions a{min-height:42px;padding:9px 13px;border:1px solid rgba(24,56,83,.18);border-radius:8px;background:#fff;color:#173a5a;text-decoration:none;font:inherit;font-weight:800;cursor:pointer}.elementary-assessment-actions .primary{background:#173a5a;color:#fff}.elementary-assessment-result{margin-top:14px;padding:13px;border-radius:10px;background:#eef7f1;color:#28543a}.elementary-assessment-result.review{background:#fff5df;color:#70541f}.elementary-assessment-gate{padding:16px;border:1px solid #d8c27b;border-radius:10px;background:#fff8dd}@media print{.elementary-assessment-actions{display:none!important}.elementary-assessment-engine{box-shadow:none;background:#fff}}`;
  document.head.appendChild(style);
}
function legacySection(){return document.querySelector("#quizForm")?.closest("section")||document.querySelector("main .worksheet")||null}
function label(){if(kind()==="weekly")return`Week ${String(week()).padStart(2,"0")} Mastery Quiz`;return kind()==="midterm"?"Midyear Mastery Assessment":"Final Mastery Assessment"}
function mount(){
  if(document.getElementById("elementaryAssessmentEngine")||!kind())return;
  addStyle();const shell=document.querySelector("main .shell")||document.querySelector("main");if(!shell)return;
  const legacy=legacySection();if(legacy)legacy.hidden=true;
  const root=document.createElement("section");root.id="elementaryAssessmentEngine";root.className="elementary-assessment-engine";
  if(legacy)legacy.insertAdjacentElement("beforebegin",root);else shell.prepend(root);
  renderStart(root,legacy);
}
function renderStart(root,legacy){
  const access=gate(),prior=bestScore(),closed=kind()!=="weekly";
  root.innerHTML=`<div class="elementary-assessment-head"><div><h2>${esc(label())}</h2><div class="elementary-assessment-meta"><span class="elementary-assessment-badge">Grade ${esc(grade())}</span><span class="elementary-assessment-badge">${closed?"Closed-book":"Open-book"}</span><span class="elementary-assessment-badge">80% mastery</span><span class="elementary-assessment-badge">${countForAssessment()} questions drawn from ${poolSize()}+ candidates</span></div><p>${esc(access.reason)}</p>${prior?`<p><strong>Best verified score:</strong> ${prior}%</p>`:""}</div></div>${!access.open?'<div class="elementary-assessment-gate"><strong>Assessment locked.</strong><p>'+esc(access.reason)+'</p><a href="../index.html">Return to Grade Home</a></div>':'<div class="elementary-assessment-actions"><button type="button" class="primary" data-start-assessment>Begin New Randomized Attempt</button>'+(legacy?'<button type="button" data-toggle-legacy>Show Printable Teacher Rubric</button>':'')+'</div><div data-assessment-body></div>'}`;
  root.querySelector("[data-start-assessment]")?.addEventListener("click",()=>beginAttempt(root.querySelector("[data-assessment-body]")));
  root.querySelector("[data-toggle-legacy]")?.addEventListener("click",e=>{legacy.hidden=!legacy.hidden;e.currentTarget.textContent=legacy.hidden?"Show Printable Teacher Rubric":"Hide Printable Teacher Rubric"});
}
function beginAttempt(body){
  const seed=`${Date.now()}|${Math.random()}|${location.pathname}`,questions=newAttemptQuestions(seed);
  if(!questions.length){body.innerHTML="<p>Question bank could not load. Refresh the page and try again.</p>";return}
  const attemptId=uid(),startedAt=new Date().toISOString();
  body.innerHTML=`<form data-formal-assessment>${questions.map((q,i)=>`<fieldset class="elementary-assessment-question"><legend>${i+1}. ${esc(q.prompt)}</legend>${q.options.map((opt,j)=>`<label class="elementary-assessment-option"><input type="radio" name="formal-q${i}" value="${j}"> ${esc(opt)}</label>`).join("")}<div class="elementary-assessment-feedback" data-feedback="${i}" hidden></div></fieldset>`).join("")}<div class="elementary-assessment-actions"><button type="submit" class="primary">Submit This Attempt</button><button type="button" data-restart-assessment>Discard & Draw a New Attempt</button></div><div aria-live="polite" data-form-status></div></form>`;
  body.querySelector("[data-restart-assessment]").addEventListener("click",()=>beginAttempt(body));
  body.querySelector("[data-formal-assessment]").addEventListener("submit",event=>{
    event.preventDefault();const form=event.currentTarget,status=form.querySelector("[data-form-status]"),responses=[];let correct=0,answered=0;
    questions.forEach((q,i)=>{
      const chosen=form.querySelector(`input[name="formal-q${i}"]:checked`),selected=chosen?Number(chosen.value):null,ok=selected===q.answer,feedback=form.querySelector(`[data-feedback="${i}"]`);
      if(selected!==null)answered++;if(ok)correct++;
      responses.push({id:q.id,prompt:q.prompt,options:q.options,selected,answer:q.answer,correct:ok,subject:q.subject,skill:q.skill});
      feedback.hidden=false;feedback.textContent=selected===null?"Not answered.":(q.rationale||"Review the concept and compare the choices.");
    });
    if(answered<questions.length){status.textContent=`Answer all ${questions.length} questions before submitting.`;return}
    const score=Math.round(correct/questions.length*100),completedAt=new Date().toISOString(),l=learner();
    const snapshot={schema:"khaemenes-elementary-assessment-attempt-v1",id:attemptId,engineVersion:VERSION,factoryVersion:global.KhaemenesElementaryQuestionFactory?.version||null,learnerId:l?.learnerId||null,preview:!l,grade:grade(),kind:kind(),week:week(),page:location.pathname,seed,startedAt,completedAt,questionCount:questions.length,correct,score,masteryThreshold:PASS,mastered:score>=PASS,responses};
    appendAttempt(snapshot);const formallySaved=l?updateFormalScore(snapshot):false;
    form.querySelectorAll("input,button[type=submit]").forEach(el=>el.disabled=true);
    const result=document.createElement("section");result.className="elementary-assessment-result"+(score>=PASS?"":" review");
    result.innerHTML=`<strong>${score>=PASS?"Mastery reached":"Review and retry"}</strong><p>Score: ${score}% · ${correct}/${questions.length} correct. ${l?(formallySaved?"This verified attempt was written to the learner’s formal record.":"The attempt was saved, but formal record writing failed."):"Preview mode: no formal learner record was changed."}</p><div class="elementary-assessment-actions"><button type="button" data-new-attempt>Draw a New Attempt</button><a href="${MENTOR_URL}">Review with Archaemenes</a>${score>=PASS&&l?'<a href="'+esc(nextHref())+'">Continue →</a>':""}</div>`;
    form.appendChild(result);result.querySelector("[data-new-attempt]").addEventListener("click",()=>beginAttempt(body));result.scrollIntoView({behavior:"smooth",block:"center"});
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
global.KhaemenesElementaryAssessmentEngine=Object.freeze({version:VERSION,masteryThreshold:PASS,grade,kind,week,learner,gate,attempts,bestScore,readFormalState,authority:Object.freeze({formalScoreWriter:true,attemptSnapshotsImmutable:true,manualScoreEntry:false})});
})(window);