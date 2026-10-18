/*
 * Khaemenes Elementary Learning Ledger v1.0.0
 * ------------------------------------------------------------
 * Adds randomized formative checkpoints to Elementary lesson surfaces
 * and records learner-scoped daily evidence. Practice never awards
 * mastery, changes placement, or unlocks formal curriculum.
 */
(function attachElementaryLearningLedger(global){
"use strict";

const VERSION="1.0.0";
const LEDGER_KEY="khaemenes_elementary_learning_ledger_v1";
const REGISTRY_KEY="khaemenes_family_registry_v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const MAX_RECORDS=500;

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const uid=()=>`lel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;

function routeGrade(){
  const m=location.pathname.match(/\/grades\/grade-(0[1-5])\//i);
  if(m)return m[1];
  if(/^\/(?:Khaemenes_Elementary\.github\.io\/)?(?:lessons|assessments)\//i.test(location.pathname))return"01";
  return null;
}
function routeWeek(){
  const m=location.pathname.match(/(?:week|unit)-(\d{1,2})/i);
  return m?Math.max(1,Math.min(36,Number(m[1])||1)):null;
}
function routeSubject(){
  const m=location.pathname.match(/\/subjects\/([^/]+)\//i);
  if(m)return global.KhaemenesElementaryQuestionFactory?.normalizeSubject?.(decodeURIComponent(m[1]))||m[1];
  return"integrated-projects";
}
function activeLearner(){
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null),learner=id&&registry?.learners?.[id]?registry.learners[id]:null;
  if(!learner)return null;
  const grade=String(learner.grade||"").replace(/[^0-9]/g,"").padStart(2,"0");
  const stage=String(learner.stage||"").trim().toLowerCase();
  return stage==="elementary"&&grade===routeGrade()?{...learner,grade}:null;
}
function ownerId(){return activeLearner()?.learnerId||"preview"}
function allLedger(){
  const value=read(LEDGER_KEY,{});
  return value&&typeof value==="object"&&!Array.isArray(value)?value:{};
}
function records(){
  const all=allLedger(),id=ownerId();
  return Array.isArray(all[id])?all[id]:[];
}
function saveRecord(record){
  const all=allLedger(),id=ownerId(),list=Array.isArray(all[id])?all[id]:[];
  list.push(record);
  all[id]=list.slice(-MAX_RECORDS);
  if(!write(LEDGER_KEY,all))return false;
  global.dispatchEvent(new CustomEvent("khaemenes-elementary-ledger-recorded",{detail:{record,learnerId:id}}));
  return true;
}
function recent(days=7){
  const cutoff=Date.now()-Math.max(1,Number(days)||7)*86400000;
  return records().filter(r=>Date.parse(r.completedAt||r.createdAt||"")>=cutoff);
}
function focusFor(article){
  const focus=[...article.querySelectorAll("p")].find(p=>/^\s*Focus:/i.test(p.textContent||""));
  if(focus)return focus.textContent.replace(/^\s*Focus:\s*/i,"").trim();
  const objective=[...article.querySelectorAll("p")].find(p=>/^\s*Objective:/i.test(p.textContent||""));
  if(objective)return objective.textContent.replace(/^\s*Objective:\s*/i,"").trim();
  return (article.querySelector("h4")?.textContent||document.querySelector("h1")?.textContent||"").trim();
}
function dayLabel(article,index){
  return (article.querySelector("h4")?.textContent||`Lesson ${index+1}`).split(":")[0].trim();
}
function addStyle(){
  if(document.getElementById("elementaryLearningLedgerStyle"))return;
  const style=document.createElement("style");
  style.id="elementaryLearningLedgerStyle";
  style.textContent=`
    .elementary-formative{margin-top:16px;padding:14px;border:1px solid rgba(36,68,90,.16);border-radius:12px;background:linear-gradient(145deg,#fff,#f4f9fc)}
    .elementary-formative h5{margin:0;color:#173a5a;font:600 1rem Georgia,serif}
    .elementary-formative p{margin:.35rem 0;color:#68757e;font-size:.86rem}
    .elementary-formative button{min-height:40px;padding:8px 11px;border:1px solid rgba(23,58,90,.2);border-radius:8px;background:#fff;color:#173a5a;font:inherit;font-weight:700;cursor:pointer}
    .elementary-formative button.primary{background:#173a5a;color:#fff}
    .elementary-formative-quiz{margin-top:12px;display:grid;gap:12px}
    .elementary-formative-question{padding:12px;border:1px solid rgba(23,58,90,.13);border-radius:10px;background:#fff}
    .elementary-formative-question strong{display:block;margin-bottom:8px}
    .elementary-formative-option{display:block;margin:6px 0;font-size:.88rem}
    .elementary-formative-feedback{margin-top:8px;padding:8px;border-radius:8px;background:#f5f7f8;font-size:.82rem}
    .elementary-formative-reflection{width:100%;min-height:72px;margin-top:10px;padding:9px;border:1px solid rgba(23,58,90,.18);border-radius:8px;font:inherit;resize:vertical}
    .elementary-formative-status{margin-top:9px;font-size:.82rem;font-weight:700;color:#315b76}
    .elementary-ledger-summary{margin:18px 0;padding:14px;border:1px solid rgba(23,58,90,.16);border-radius:12px;background:#f8fbfd}
    @media print{.elementary-formative button,.elementary-formative-reflection{display:none!important}}
  `;
  document.head.appendChild(style);
}
function renderQuestions(container,questions,context){
  container.innerHTML=`
    <div class="elementary-formative-quiz">
      ${questions.map((q,i)=>`
        <section class="elementary-formative-question" data-formative-q="${i}">
          <strong>${i+1}. ${esc(q.prompt)}</strong>
          ${q.options.map((opt,j)=>`<label class="elementary-formative-option"><input type="radio" name="formative-${context.key}-${i}" value="${j}"> ${esc(opt)}</label>`).join("")}
          <div class="elementary-formative-feedback" data-feedback="${i}" hidden></div>
        </section>
      `).join("")}
      <label><strong>Optional reflection</strong><textarea class="elementary-formative-reflection" placeholder="What strategy helped? What would you try next?"></textarea></label>
      <div><button type="button" class="primary" data-submit-formative>Save Lesson Check</button> <button type="button" data-new-formative>New Practice Set</button></div>
      <div class="elementary-formative-status" aria-live="polite"></div>
    </div>`;

  const status=container.querySelector(".elementary-formative-status");
  container.querySelector("[data-new-formative]").addEventListener("click",()=>startCheckpoint(container,context));
  container.querySelector("[data-submit-formative]").addEventListener("click",()=>{
    let correct=0,answered=0;
    const responses=[];
    questions.forEach((q,i)=>{
      const chosen=container.querySelector(`input[name="formative-${context.key}-${i}"]:checked`);
      const feedback=container.querySelector(`[data-feedback="${i}"]`);
      const selected=chosen?Number(chosen.value):null;
      if(selected!==null)answered++;
      const isCorrect=selected===q.answer;
      if(isCorrect)correct++;
      responses.push({id:q.id,prompt:q.prompt,options:q.options,selected,answer:q.answer,correct:isCorrect,skill:q.skill,subject:q.subject});
      feedback.hidden=false;
      feedback.textContent=selected===null?"Not answered.":isCorrect?(q.rationale||"That choice fits the concept."):(q.rationale||`Review the idea and compare the choices again.`);
    });
    if(answered<questions.length){status.textContent="Answer each checkpoint question before saving.";return}
    const score=Math.round(correct/questions.length*100),learner=activeLearner(),reflection=container.querySelector(".elementary-formative-reflection").value.trim();
    const record={
      schema:"khaemenes-elementary-learning-ledger-record-v1",
      id:uid(),
      learnerId:learner?.learnerId||null,
      preview:!learner,
      grade:routeGrade(),
      week:routeWeek(),
      subject:routeSubject(),
      day:context.day,
      focus:context.focus,
      page:location.pathname,
      kind:"lesson-formative-checkpoint",
      questionCount:questions.length,
      correct,
      score,
      responses,
      reflection:reflection.slice(0,1000),
      masteryAuthority:false,
      affectsGrade:false,
      unlocksCurriculum:false,
      completedAt:new Date().toISOString()
    };
    if(saveRecord(record)){
      status.textContent=`Saved formative evidence: ${correct}/${questions.length} (${score}%). This practice does not change formal mastery.`;
      container.closest(".lesson")?.setAttribute("data-formative-saved","true");
    }else status.textContent="This browser could not save the lesson checkpoint.";
  });
}
function startCheckpoint(container,context){
  const factory=global.KhaemenesElementaryQuestionFactory;
  if(!factory){container.innerHTML="<p>Practice questions are still loading.</p>";return}
  const seed=`${Date.now()}|${location.pathname}|${context.key}`;
  const questions=factory.makePool({grade:Number(routeGrade()),subject:routeSubject(),focus:context.focus,seed,count:3});
  renderQuestions(container,questions,context);
}
function enhanceArticle(article,index){
  if(article.dataset.elementaryLedgerEnhanced==="true")return;
  article.dataset.elementaryLedgerEnhanced="true";
  const focus=focusFor(article),day=dayLabel(article,index),key=`${routeGrade()}-${routeWeek()||0}-${routeSubject()}-${index+1}`;
  const box=document.createElement("section");
  box.className="elementary-formative";
  box.innerHTML=`<h5>Lesson Checkpoint · ${esc(day)}</h5><p>Take a short randomized practice check and optionally reflect on your strategy. This saves learning evidence but never awards mastery.</p><button type="button" class="primary">Start 3-Question Check</button><div data-checkpoint-body></div>`;
  article.appendChild(box);
  box.querySelector("button").addEventListener("click",()=>startCheckpoint(box.querySelector("[data-checkpoint-body]"),{focus,day,key}));
}
function mountPageCheckpoint(){
  if(document.querySelector(".lesson")||document.getElementById("elementaryWeeklyCheckpoint"))return;
  if(!/\/weekly-plans\/week-\d+\.html$/i.test(location.pathname))return;
  const shell=document.querySelector("main .shell")||document.querySelector("main");
  if(!shell)return;
  const focus=(document.querySelector("h1")?.textContent||"")+" "+(document.querySelector(".heading p:last-child")?.textContent||"");
  const box=document.createElement("section");
  box.className="elementary-ledger-summary";
  box.id="elementaryWeeklyCheckpoint";
  box.innerHTML='<h3 style="margin-top:0;color:#173a5a">Weekly Formative Check</h3><p>Use this five-question randomized review before the formal weekly assessment. It records practice evidence only.</p><button type="button" class="primary">Start Weekly Review</button><div data-checkpoint-body></div>';
  shell.appendChild(box);
  box.querySelector("button").addEventListener("click",()=>{
    const factory=global.KhaemenesElementaryQuestionFactory;
    const questions=factory?.makeBalanced?.({grade:Number(routeGrade()),focus,seed:Date.now(),count:5})||[];
    renderQuestions(box.querySelector("[data-checkpoint-body]"),questions,{focus,day:"Weekly Review",key:`${routeGrade()}-${routeWeek()}-weekly-review`});
  });
}
function scan(){
  addStyle();
  const articles=[...document.querySelectorAll(".lesson")];
  articles.forEach(enhanceArticle);
  mountPageCheckpoint();
}
let scheduled=false;
function schedule(){
  if(scheduled)return;
  scheduled=true;
  setTimeout(()=>{scheduled=false;scan()},80);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
global.addEventListener("khaemenes-family-changed",schedule);

global.KhaemenesElementaryLearningLedger=Object.freeze({
  version:VERSION,
  key:LEDGER_KEY,
  records,
  recent,
  saveRecord,
  refresh:schedule,
  authority:Object.freeze({awardsMastery:false,changesScore:false,unlocksCurriculum:false,changesPlacement:false})
});
})(window);
