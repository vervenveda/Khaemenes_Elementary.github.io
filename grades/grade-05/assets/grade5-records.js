(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const api=()=>window.KhaemenesGrade5Continuity;
  const clamp=v=>Math.max(0,Math.min(100,Number(v||0)));
  function render(){
    const s=api()?.getSummary?.();const eligible=Boolean(s?.eligible);const state=s?.state||{weekly:{},midterm:0,final:0,portfolio:false};
    $("verificationStatus").textContent=eligible?`Connected to ${s.learner.nickname} · Grade 05 · Archaemenes / Young Scholar`:"No eligible Grade 05 Academy learner is active. Verification controls are locked.";
    for(const id of ["weekSelect","weekScore","saveWeek","midtermScore","finalScore","portfolio","saveMilestones","exportRecords","clearRecords"])if($(id))$(id).disabled=!eligible;
    $("midtermScore").value=state.midterm||"";$("finalScore").value=state.final||"";$("portfolio").checked=Boolean(state.portfolio);
    const week=Number($("weekSelect").value||1);$("weekScore").value=state.weekly?.[week]||"";
    $("masterySummary").textContent=eligible?`${s.mastered}/36 weeks mastered · ${s.average}% recorded average · Certificate ${s.certificateReady?"ready":"locked"}.`:"Formal Grade 05 records require the active Grade 05 learner.";
  }
  function saveWeek(){const s=api()?.getSummary?.();if(!s?.eligible)return;const state={...s.state,weekly:{...(s.state.weekly||{})}};state.weekly[Number($("weekSelect").value)]=clamp($("weekScore").value);api().saveState(state);render();}
  function saveMilestones(){const s=api()?.getSummary?.();if(!s?.eligible)return;api().saveState({...s.state,midterm:clamp($("midtermScore").value),final:clamp($("finalScore").value),portfolio:$("portfolio").checked});render();}
  function exportRecords(){const s=api()?.getSummary?.();if(!s?.eligible)return;const payload={kind:"khaemenes-grade05-record",learner:{learnerId:s.learner.learnerId,nickname:s.learner.nickname,grade:"grade-05"},state:s.state,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="khaemenes-grade-05-record.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function clearRecords(){if(!api()?.getSummary?.()?.eligible)return;if(confirm("Clear the active learner's Grade 05 course record on this device?")){api().clearActive();render();}}
  document.addEventListener("DOMContentLoaded",()=>{
    const select=$("weekSelect");if(select&&!select.options.length)for(let i=1;i<=36;i++){const o=document.createElement("option");o.value=String(i);o.textContent=`Week ${String(i).padStart(2,"0")}`;select.append(o)}
    select?.addEventListener("change",render);$("saveWeek")?.addEventListener("click",saveWeek);$("saveMilestones")?.addEventListener("click",saveMilestones);$("exportRecords")?.addEventListener("click",exportRecords);$("clearRecords")?.addEventListener("click",clearRecords);render();
  });
  window.addEventListener("khaemenes-family-changed",render);window.addEventListener("khaemenes-elementary-family-ready",render);window.addEventListener("khaemenes-naib-ready",render);
})();
