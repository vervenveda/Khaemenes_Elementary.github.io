(() => {
  "use strict";

  /*
   * Grade 01 compatibility helper v4.0
   * ---------------------------------
   * This file no longer owns learner identity or mentor identity.
   * When legacy Grade 01 pages still reference it, records are read/written
   * through KhaemenesGrade1Continuity whenever available.
   */

  const DATA=window.KHAE_GRADE1_DATA;
  const $=id=>document.getElementById(id);
  const clamp=value=>Math.max(0,Math.min(100,Number(value||0)));
  const fallbackKey="khaemenes_grade1_36_aplus_v1";

  function readFallback(){
    try{return JSON.parse(localStorage.getItem(fallbackKey))||{student:"First Grade Scholar",weekly:{},midterm:0,final:0,portfolio:false}}
    catch{return {student:"First Grade Scholar",weekly:{},midterm:0,final:0,portfolio:false}}
  }

  function load(){return window.KhaemenesGrade1Continuity?.loadState?.()||readFallback()}
  function save(state){
    if(window.KhaemenesGrade1Continuity?.saveState)return window.KhaemenesGrade1Continuity.saveState(state);
    try{localStorage.setItem(fallbackKey,JSON.stringify(state))}catch{}
    return state;
  }

  function summaryFor(state){
    const scores=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);
    const mastered=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;
    const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    return {mastered,average,ready:mastered>=36&&Number(state.midterm||0)>=80&&Number(state.final||0)>=80&&Boolean(state.portfolio)};
  }

  function renderLegacyDashboard(){
    const state=load();const s=summaryFor(state);
    if($("studentName")){$("studentName").value=state.student||"";$("studentName").readOnly=true}
    if($("midtermScore"))$("midtermScore").value=state.midterm||"";
    if($("finalScore"))$("finalScore").value=state.final||"";
    if($("portfolio"))$("portfolio").checked=Boolean(state.portfolio);
    if($("summary")){
      $("summary").textContent=`${s.mastered}/36 weeks at mastery · ${s.average}% weekly average · certificate ${s.ready?"ready":"locked"}. Use Teacher Tools to record verified assessment evidence.`;
    }
  }

  function bindLegacySave(){
    const button=$("saveProfile");if(!button)return;
    button.textContent="Save Reviewed Milestones";
    button.addEventListener("click",()=>{
      const state=load();
      if($("midtermScore"))state.midterm=clamp($("midtermScore").value);
      if($("finalScore"))state.final=clamp($("finalScore").value);
      if($("portfolio"))state.portfolio=Boolean($("portfolio").checked);
      save(state);renderLegacyDashboard();
    });
  }

  function renderLegacyUnits(){
    const grid=$("unitGrid");if(!grid||!DATA?.units)return;
    const state=load();
    grid.replaceChildren();
    for(const unit of DATA.units){
      const n=Number(unit.unit);const score=Number(state.weekly?.[n]||0);
      const card=document.createElement("article");card.className="card week-card";
      const emblem=document.createElement("div");emblem.className="emblem";emblem.textContent=String(n).padStart(2,"0");
      const h=document.createElement("h3");h.textContent=unit.title;
      const p=document.createElement("p");p.textContent=unit.essentialQuestion||"Five connected lessons.";
      const status=document.createElement("p");status.textContent=score?`Recorded assessment: ${score}%`:"No assessment result recorded yet.";
      const actions=document.createElement("div");actions.className="actions";
      const open=document.createElement("a");open.className="button";open.href=`lessons/unit-${String(n).padStart(2,"0")}/index.html`;open.textContent="Open Unit";
      const assessment=document.createElement("a");assessment.className="button gold";assessment.href=`assessments/unit-${String(n).padStart(2,"0")}-assessment.html`;assessment.textContent="Mastery Check";
      actions.append(open,assessment);card.append(emblem,h,p,status,actions);grid.append(card);
    }
  }

  function init(){
    if($("year"))$("year").textContent=new Date().getFullYear();
    renderLegacyDashboard();renderLegacyUnits();bindLegacySave();
  }

  document.addEventListener("DOMContentLoaded",init);
})();