(() => {
  "use strict";
  const DATA = window.KHAE_GRADE4_DATA;
  const KEY = "khaemenes_grade4_subject_36_aplusplus_v1";
  const CONT = window.KhaemenesGrade4Continuity;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const blank = () => ({student:"Fourth Grade Scholar", weekly:{}, midterm:0, final:0, portfolio:false});
  function readState(){try{const status=CONT?.status?.();if(status?.status==="ready"){const record=CONT.readState?.(null);return record&&typeof record==="object"&&!Array.isArray(record)?Object.assign(blank(),record):blank()}if(status?.status==="no-active-learner")return JSON.parse(localStorage.getItem(KEY))||blank();return blank()}catch{return blank();}}
  let state = readState();
  const save = () => {try{return CONT?.status?.().status==="ready"&&CONT.writeState?.(state)===true}catch{return false}};
  const weeklyAverage = () => {const v=DATA.weeks.map(w=>Number(state.weekly[w.week]||0)).filter(Boolean);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0;};
  const completedWeeks = () => DATA.weeks.filter(w=>Number(state.weekly[w.week]||0)>=DATA.course.passingScore).length;
  const ready = () => CONT?.status?.().status==="ready" && completedWeeks()===36 && Number(state.midterm||0)>=80 && Number(state.final||0)>=80 && state.portfolio===true;
  function renderDashboard(){
    const avg=weeklyAverage(), done=completedWeeks(), ok=ready(), context=CONT?.status?.();
    $("studentName").value=context?.status==="ready"?context.learner.nickname:(state.student||"");
    $("studentName").readOnly=context?.status==="ready";
    $("midtermScore").value=state.midterm||"";$("midtermScore").readOnly=true;$("midtermScore").title="Verified assessment score";$("finalScore").value=state.final||"";$("finalScore").readOnly=true;$("finalScore").title="Verified assessment score";$("portfolio").checked=state.portfolio===true;$("portfolio").disabled=true;$("portfolio").title="Adult portfolio approval must be recorded through the authorized review process";
    $("summary").innerHTML=`<div class="grid cols-4"><article class="card stat"><strong>${done}/36</strong><span>Weeks at 80%+</span></article><article class="card stat"><strong>${avg}%</strong><span>Weekly average</span></article><article class="card stat"><strong>${state.midterm||0}%</strong><span>Midterm</span></article><article class="card stat"><strong>${state.final||0}%</strong><span>Final</span></article></div><div class="profile-box" style="margin-top:16px"><h3>${ok?"Local Gates Complete":"Certificate Locked"}</h3><p>${ok?"Local mastery gates are recorded; official certification requires independent authorization.":"Certificate requires all 36 weekly mastery gates at 80%+, midterm 80%+, final 80%+, and adult portfolio approval."}</p>${context?.status==="ready"?`<p><strong>Academy learner:</strong> ${esc(context.learner.nickname)} · ${esc(context.learner.learnerId)}</p>`:context?.status==="placement-mismatch"?`<p><strong>Preview mode:</strong> this learner is registered outside Grade 04; course tools do not alter placement.</p>`:""}<div class="progress"><span style="width:${Math.min(100,Math.round(done/36*100))}%"></span></div><div class="actions"><a class="button ${ok?"gold":""}" href="records/certificate.html">Open Certificate</a><button type="button" class="button" id="exportBtn">Export Records</button></div></div>`;
    $("exportBtn").addEventListener("click", exportRecords);
    renderNextStep();
  }
  function renderNextStep(){
    const box=document.createElement("section");box.id="grade4NextStep";box.className="card";box.style.marginTop="16px";
    const h=document.createElement("h3");h.textContent="My Next Grade 4 Learning Step";box.append(h);
    const note=document.createElement("p"),go=document.createElement("a");go.className="button";
    const status=CONT?.status?.(),valid=x=>typeof x==="number"&&Number.isFinite(x)&&x>=80&&x<=100;
    if(status?.status!=="ready"){
      note.textContent="Select a registered Grade 4 learner for an individual next step. Subject lessons can be explored without changing placement.";
      go.href="#subjects";go.textContent="Explore Subject Halls";
    }else{
      const first=Array.from({length:36},(_,i)=>i+1).find(n=>!valid(state.weekly?.[n]))||null;
      const mid=valid(state.midterm),fin=valid(state.final),pad=n=>String(n).padStart(2,"0");
      if((first===null||first>18)&&!mid){
        note.textContent="Complete the midterm with at least 80% to unlock the second half of Grade 4.";
        go.href="assessments/midterm.html";go.textContent="Open Midterm";
      }else if(first){
        note.textContent="Continue Week "+pad(first)+" lessons and the weekly mastery check.";
        go.href="weekly-plans/week-"+pad(first)+".html";go.textContent="Open Week "+pad(first);
        const print=document.createElement("a");print.href="printables/week-"+pad(first)+"-packet.html";print.className="button light";print.textContent="Weekly Printable";box.append(print);
        const assess=document.createElement("a");assess.href="assessments/week-"+pad(first)+"-assessment.html";assess.className="button light";assess.textContent="Weekly Assessment";box.append(assess);
      }else if(!fin){
        note.textContent="All weekly gates and the midterm are mastered. The final assessment is next.";
        go.href="assessments/final-exam.html";go.textContent="Open Final";
      }else if(state.portfolio!==true){
        note.textContent="Academic thresholds are locally recorded. Portfolio review requires adult authorization.";
        go.href="../../student-profile/";go.textContent="Open Student Portfolio";
      }else{
        note.textContent="Local course gates are recorded. Review the printable record; official certification requires independent adult authorization.";
        go.href="records/certificate.html";go.textContent="Review Local Certificate";
      }
    }
    box.insertBefore(note,box.children[1]);box.append(go);$("summary").append(box);
  }
  function renderWeeks(){
    $("weekGrid").innerHTML=DATA.weeks.map(w=>`<article class="card week-card"><div class="emblem">${String(w.week).padStart(2,"0")}</div><h3>${esc(w.title)}</h3><p><strong>Question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.theme)}</p><div class="badges"><span class="badge">8 subjects</span><span class="badge">40 blocks</span><span class="badge">A++</span></div><label>Verified weekly assessment score</label><input type="number" min="0" max="100" value="${state.weekly[w.week]||""}" data-score="${w.week}" placeholder="Not attempted" readonly title="Scores are written by the assessment engine"><div class="actions"><a class="button" href="weekly-plans/week-${String(w.week).padStart(2,"0")}.html">Open Week</a><a class="button light" href="printables/week-${String(w.week).padStart(2,"0")}-packet.html">Printable</a></div></article>`).join("");
    document.querySelectorAll("[data-score]").forEach(input=>{input.readOnly=true;input.title="Scores are written by the assessment engine";});
  }
  function renderSubjects(){
    $("subjectGrid").innerHTML=DATA.subjects.map(s=>`<article class="card" style="border-top:5px solid ${s.color}"><div class="emblem">${esc(s.icon)}</div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><a class="button" href="subjects/${s.id}/index.html">Open Subject Hall</a></article>`).join("");
  }
  function bind(){
    $("saveProfile").addEventListener("click",()=>{const c=CONT?.status?.();state.student=c?.status==="ready"?c.learner.nickname:($("studentName").value.trim()||"Fourth Grade Scholar");/* Do not grant portfolio approval from the student profile. */if(!save()){alert("Progress was not saved. Select the learner registered for Grade 04 and check browser storage.");state=readState();}renderDashboard();renderWeeks();});
    $("clearRecords").addEventListener("click",()=>{if(!confirm("Clear local fourth-grade records for the active learner on this device?"))return;if(CONT?.status?.().status!=="ready"||!CONT?.clearState){alert("Select the registered Grade 04 learner before clearing records.");return}CONT.clearState();state=readState();renderDashboard();renderWeeks();});
  }
  function exportRecords(){const c=CONT?.status?.();if(c?.status!=="ready"||!c.learner?.learnerId||CONT.scopedKey?.()!=="khaemenes.course:"+c.learner.learnerId+":elementary-grade-04"){alert("Select the registered Grade 04 learner before exporting private records.");return}const current=CONT.readState?.(null);if(!current||typeof current!=="object"||Array.isArray(current)){alert("No verified learner-owned record is available for export.");return}const payload={course:DATA.course.title,exported:new Date().toISOString(),learner:c.learner,state:current};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-fourth-grade-records.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  window.addEventListener("khaemenes-family-changed",()=>{state=readState();renderDashboard();renderWeeks();});
  document.addEventListener("DOMContentLoaded",()=>{$("year").textContent=new Date().getFullYear();bind();renderDashboard();renderSubjects();renderWeeks();});
})();
