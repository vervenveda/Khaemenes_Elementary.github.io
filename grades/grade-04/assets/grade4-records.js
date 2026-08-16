(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const clamp = value => Math.max(0, Math.min(100, Number(value || 0)));

  function summary(){
    return window.KhaemenesGrade4Continuity?.getSummary?.() || null;
  }

  function populateWeeks(){
    const select = $("weekSelect");
    if(!select || select.options.length) return;
    for(let week = 1; week <= 36; week += 1){
      const option = document.createElement("option");
      option.value = String(week);
      option.textContent = `Week ${String(week).padStart(2,"0")}`;
      select.append(option);
    }
  }

  function render(){
    const stateSummary = summary();
    const state = stateSummary?.state || {};
    const eligible = Boolean(stateSummary?.eligible);
    const week = $("weekSelect")?.value || "1";

    if($("learnerTitle")) $("learnerTitle").textContent = stateSummary?.learner?.nickname || "No active Grade 04 learner";
    if($("mentorTitle")) $("mentorTitle").textContent = "Archaemenes · Khaemenes Academy Mentor";
    if($("statusText")) $("statusText").textContent = eligible
      ? "Grade 04 learner connected. Record only evidence that has been reviewed."
      : "Select a Grade 04 learner in the Academy Family Registry before recording formal mastery.";

    ["saveVerified","exportRecords","weeklyScore","midtermScore","finalScore","portfolio","weekSelect"].forEach(id => {
      const control = $(id);
      if(control) control.disabled = !eligible;
    });

    if($("weeklyScore")) $("weeklyScore").value = state.weekly?.[week] || "";
    if($("midtermScore")) $("midtermScore").value = state.midterm || "";
    if($("finalScore")) $("finalScore").value = state.final || "";
    if($("portfolio")) $("portfolio").checked = Boolean(state.portfolio);
  }

  function saveVerified(){
    const stateSummary = summary();
    if(!stateSummary?.eligible) return;

    const state = {
      ...stateSummary.state,
      weekly: {...(stateSummary.state?.weekly || {})}
    };

    const week = $("weekSelect").value;
    state.weekly[week] = clamp($("weeklyScore").value);
    state.midterm = clamp($("midtermScore").value);
    state.final = clamp($("finalScore").value);
    state.portfolio = $("portfolio").checked;

    window.KhaemenesGrade4Continuity.saveState(state);
    render();
    window.alert("Verified Grade 04 record saved for the active learner.");
  }

  function exportRecords(){
    const stateSummary = summary();
    if(!stateSummary?.eligible) return;

    const payload = {
      course:"Khaemenes Fourth Grade",
      learner:{
        nickname:stateSummary.learner.nickname,
        grade:"grade-04"
      },
      state:stateSummary.state,
      exportedAt:new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "khaemenes-grade04-record.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function bind(){
    populateWeeks();
    $("weekSelect")?.addEventListener("change", render);
    $("saveVerified")?.addEventListener("click", saveVerified);
    $("exportRecords")?.addEventListener("click", exportRecords);
    window.addEventListener("khaemenes-family-changed", render);
    window.addEventListener("khaemenes-elementary-family-ready", render);
    window.addEventListener("khaemenes-naib-ready", render);
    window.addEventListener("storage", render);
    if($("year")) $("year").textContent = String(new Date().getFullYear());
    render();
  }

  document.addEventListener("DOMContentLoaded", bind, {once:true});
})();
