(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const clamp=v=>Math.max(0,Math.min(100,Number(v||0)));
  const C=()=>window.KhaemenesGrade2Continuity||null;

  function render(){
    const s=C()?.getSummary?.();
    const learner=s?.learner;
    if($("verificationStatus"))$("verificationStatus").textContent=learner?`Active learner: ${learner.nickname} · Grade 02`:`No active Grade 02 learner. Select the learner in the Academy Family Profile before recording formal results.`;
    if($("weekNumber"))$("weekNumber").value=String(Math.max(1,Math.min(36,Number(s?.next||1))));
    if($("weekScore"))$("weekScore").value=s?.state?.weekly?.[Number($("weekNumber")?.value)]||"";
    if($("midtermScore"))$("midtermScore").value=s?.state?.midterm||"";
    if($("finalScore"))$("finalScore").value=s?.state?.final||"";
    if($("portfolio"))$("portfolio").checked=Boolean(s?.state?.portfolio);
    const disabled=!learner;
    ["saveWeekly","saveMilestones","clearActiveRecords"].forEach(id=>{if($(id))$(id).disabled=disabled});
  }

  function saveWeekly(){
    const c=C(),s=c?.getSummary?.();if(!s?.learner)return;
    const week=Math.max(1,Math.min(36,Number($("weekNumber").value||1)));
    const score=clamp($("weekScore").value);
    const state={...s.state,weekly:{...(s.state.weekly||{}),[week]:score}};
    c.saveState(state);render();
  }

  function saveMilestones(){
    const c=C(),s=c?.getSummary?.();if(!s?.learner)return;
    c.saveState({...s.state,midterm:clamp($("midtermScore").value),final:clamp($("finalScore").value),portfolio:Boolean($("portfolio").checked)});render();
  }

  $("weekNumber")?.addEventListener("change",()=>{const s=C()?.getSummary?.();$("weekScore").value=s?.state?.weekly?.[Number($("weekNumber").value)]||""});
  $("saveWeekly")?.addEventListener("click",saveWeekly);
  $("saveMilestones")?.addEventListener("click",saveMilestones);
  $("clearActiveRecords")?.addEventListener("click",()=>{if(!confirm("Clear the active Grade 02 learner's local course record on this device?"))return;C()?.clearActive?.();render()});
  window.addEventListener("khaemenes-family-changed",render);window.addEventListener("khaemenes-elementary-family-ready",render);window.addEventListener("storage",e=>{if(String(e.key||"").startsWith("khaemenes_"))render()});
  document.addEventListener("DOMContentLoaded",render);
})();
