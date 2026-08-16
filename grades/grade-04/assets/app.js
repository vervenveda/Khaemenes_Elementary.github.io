(() => {
  "use strict";
  const DATA = window.KHAE_GRADE4_DATA;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function summary(){return window.KhaemenesGrade4Continuity?.getSummary?.() || null;}
  function state(){return summary()?.state || {weekly:{},midterm:0,final:0,portfolio:false};}

  function renderDashboard(){
    const s=summary();
    const st=s?.state || state();
    const done=s?.mastered || 0;
    const avg=s?.average || 0;
    const eligible=Boolean(s?.eligible);
    const learner=s?.learner;
    const mentor=s?.mentor;
    if($("learnerName")) $("learnerName").textContent=learner?.nickname || "Fourth Grade Scholar";
    if($("mentorLine")) $("mentorLine").textContent=`${mentor?.name || "Archaemenes"} · Young Scholar`;
    if($("eligibilityLine")) $("eligibilityLine").textContent=eligible
      ? "Academy Grade 04 learner connected. Formal mastery records are learner-scoped."
      : "Select an active Grade 04 learner from the Academy Family Registry to use formal records.";
    if($("summary")) $("summary").innerHTML=`<div class="grid cols-4"><article class="card stat"><strong>${done}/36</strong><span>Weeks at 80%+</span></article><article class="card stat"><strong>${avg}%</strong><span>Weekly average</span></article><article class="card stat"><strong>${Number(st.midterm||0)}%</strong><span>Midterm</span></article><article class="card stat"><strong>${Number(st.final||0)}%</strong><span>Final</span></article></div><div class="profile-box" style="margin-top:16px"><h3>${s?.certificateReady?"Certificate Ready":"Certificate Locked"}</h3><p>${s?.certificateReady?"All Grade 04 completion gates are met.":"Certificate requires 36 verified weeks at 80%+, midterm 80%+, final 80%+, portfolio approval, and an active Grade 04 learner."}</p><div class="progress"><span style="width:${Math.min(100,Math.round(done/36*100))}%"></span></div><div class="actions"><a class="button ${s?.certificateReady?"gold":""}" href="records/certificate.html">Open Certificate</a><a class="button" href="teacher-tools/index.html">Teacher / Family Tools</a></div></div>`;
  }

  function renderWeeks(){
    const st=state();
    $("weekGrid").innerHTML=DATA.weeks.map(w=>`<article class="card week-card"><div class="emblem">${String(w.week).padStart(2,"0")}</div><h3>${esc(w.title)}</h3><p><strong>Question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.theme)}</p><div class="badges"><span class="badge">8 subjects</span><span class="badge">40 blocks</span><span class="badge">A++</span></div><p><strong>Verified mastery:</strong> ${Number(st.weekly?.[w.week]||0)}%</p><div class="actions"><a class="button" href="weekly-plans/week-${String(w.week).padStart(2,"0")}.html">Open Week</a><a class="button light" href="printables/week-${String(w.week).padStart(2,"0")}-packet.html">Printable</a><a class="button light" href="assessments/week-${String(w.week).padStart(2,"0")}-assessment.html">Assessment</a></div></article>`).join("");
  }

  function renderSubjects(){
    $("subjectGrid").innerHTML=DATA.subjects.map(s=>`<article class="card" style="border-top:5px solid ${esc(s.color)}"><div class="emblem">${esc(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><a class="button" href="subjects/${esc(s.id)}/index.html">Open Subject Hall</a></article>`).join("");
  }

  function render(){renderDashboard();renderSubjects();renderWeeks();if($("year"))$("year").textContent=new Date().getFullYear();}
  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  window.addEventListener("storage",event=>{if(String(event.key||"").startsWith("khaemenes_"))render();});
})();
