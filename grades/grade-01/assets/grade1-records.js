(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const clamp=value=>Math.max(0,Math.min(100,Number(value||0)));

  function summary(){try{return window.KhaemenesGrade1Continuity?.getSummary?.()||null}catch{return null}}
  function render(){
    const s=summary();
    const state=s?.state||{};
    const learner=s?.learner||null;
    $("recordLearner").textContent=learner?.nickname||"No active Grade 01 learner";
    $("recordStatus").textContent=learner
      ? "Assessment records saved to this Academy learner on this device."
      : "Select a Grade 01 learner in the Academy Family Profile before recording formal results.";
    $("recordStatus").className=learner?"notice good":"notice";
    $("midtermScore").value=state.midterm||"";
    $("finalScore").value=state.final||"";
    $("portfolioApproved").checked=Boolean(state.portfolio);
    const week=Number($("weekNumber").value||1);
    $("weekScore").value=state.weekly?.[week]||"";
    $("recordSummary").textContent=`${s?.mastered||0}/36 weeks at 80%+ · ${s?.average||0}% recorded weekly average · certificate ${s?.certificateReady?"ready":"locked"}.`;
  }

  function saveWeek(){
    const s=summary();if(!s?.learner){alert("Select a Grade 01 learner in the Academy Family Profile first.");return}
    const week=Math.max(1,Math.min(36,Number($("weekNumber").value||1)));
    const score=clamp($("weekScore").value);
    const state={...s.state,weekly:{...(s.state.weekly||{})}};
    if(score>0)state.weekly[week]=score;else delete state.weekly[week];
    window.KhaemenesGrade1Continuity.saveState(state);render();
  }

  function saveMilestones(){
    const s=summary();if(!s?.learner){alert("Select a Grade 01 learner in the Academy Family Profile first.");return}
    const state={...s.state,midterm:clamp($("midtermScore").value),final:clamp($("finalScore").value),portfolio:Boolean($("portfolioApproved").checked)};
    window.KhaemenesGrade1Continuity.saveState(state);render();
  }

  $("weekNumber")?.addEventListener("change",render);
  $("saveWeekScore")?.addEventListener("click",saveWeek);
  $("saveMilestones")?.addEventListener("click",saveMilestones);
  $("clearActiveRecord")?.addEventListener("click",()=>{
    if(!confirm("Clear the active learner's local Grade 01 course record on this device?"))return;
    window.KhaemenesGrade1Continuity?.clearActive?.();render();
  });
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  document.addEventListener("DOMContentLoaded",()=>{$("year").textContent=new Date().getFullYear();render();});
})();