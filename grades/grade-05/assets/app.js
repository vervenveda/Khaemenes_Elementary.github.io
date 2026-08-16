(() => {
  "use strict";
  const DATA=window.KHAE_GRADE5_DATA;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const continuity=()=>window.KhaemenesGrade5Continuity;

  function summary(){return continuity()?.getSummary?.()||{eligible:false,learner:null,mentor:null,state:{weekly:{},midterm:0,final:0,portfolio:false},mastered:0,average:0,next:1,certificateReady:false};}
  function renderDashboard(){
    const s=summary();const state=s.state||{};const learner=s.learner;const mentor=s.mentor||{name:"Archaemenes",avatar:"🦉"};
    $("learnerName").textContent=learner?.nickname||"No active Grade 05 learner";
    $("mentorName").textContent=`${mentor.avatar||"🦉"} ${mentor.name||"Archaemenes"} · Young Scholar`;
    $("learnerStatus").textContent=s.eligible?"Academy Family learner connected":"Select a Grade 05 learner in the Academy Family Profile to open formal records.";
    $("summary").innerHTML=`<div class="grid cols-4"><article class="card stat"><strong>${s.mastered||0}/36</strong><span>Weeks at 80%+</span></article><article class="card stat"><strong>${s.average||0}%</strong><span>Weekly average</span></article><article class="card stat"><strong>${state.midterm||0}%</strong><span>Midterm</span></article><article class="card stat"><strong>${state.final||0}%</strong><span>Final</span></article></div><div class="profile-box" style="margin-top:16px"><h3>${s.certificateReady?"Middle-School Readiness Certificate Ready":"Certificate Locked"}</h3><p>${s.certificateReady?"All Grade 05 completion gates are verified.":"Formal certification requires 36 mastered weeks, midterm 80%+, final 80%+, and adult portfolio approval."}</p><div class="actions"><a class="button ${s.certificateReady?"gold":""}" href="records/certificate.html">Open Certificate</a><a class="button" href="teacher-tools/index.html#mastery">Teacher / Family Verification</a></div></div>`;
  }
  function renderWeeks(){
    const s=summary(),state=s.state||{weekly:{}};
    $("weekGrid").innerHTML=DATA.weeks.map(w=>{const score=Number(state.weekly?.[w.week]||0);const stateLabel=score>=80?`Mastered · ${score}%`:score?`Review · ${score}%`:"Not yet verified";return `<article class="card week-card"><div class="emblem">${String(w.week).padStart(2,"0")}</div><h3>${esc(w.title)}</h3><p><strong>Question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.theme)}</p><div class="badges"><span class="badge">8 subjects</span><span class="badge">40 blocks</span><span class="badge">${stateLabel}</span></div><div class="actions"><a class="button" href="weekly-plans/week-${String(w.week).padStart(2,"0")}.html">Open Week</a><a class="button light" href="printables/week-${String(w.week).padStart(2,"0")}-packet.html">Printable</a><a class="button light" href="assessments/week-${String(w.week).padStart(2,"0")}-assessment.html">Assessment</a></div></article>`}).join("");
  }
  function renderSubjects(){if(!$("subjectGrid"))return;$("subjectGrid").innerHTML=DATA.subjects.map(s=>`<article class="card" style="border-top:5px solid ${s.color}"><div class="emblem">${esc(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><a class="button" href="subjects/${s.id}/index.html">Open Subject Hall</a></article>`).join("")}
  function render(){if(!DATA)return;renderDashboard();renderSubjects();renderWeeks();const year=$("year");if(year)year.textContent=new Date().getFullYear();}
  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  window.addEventListener("khaemenes-naib-ready",render);
  window.KhaemenesGrade5Continuity?.subscribe?.(render);
})();
