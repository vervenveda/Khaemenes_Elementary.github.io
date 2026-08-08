(() => {
  "use strict";
  const DATA = window.KHAE_GRADE1_DATA;
  const KEY = "khaemenes_grade1_36_aplus_v1";
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function readState(){try{return JSON.parse(localStorage.getItem(KEY)) || {student:"First Grade Scholar",weekly:{},midterm:0,final:0,portfolio:false};}catch{return {student:"First Grade Scholar",weekly:{},midterm:0,final:0,portfolio:false};}}
  let state = readState();
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  function avg(){const v=DATA.units.map(u=>Number(state.weekly[u.unit]||0)).filter(Boolean);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0;}
  function done(){return DATA.units.filter(u=>Number(state.weekly[u.unit]||0)>=DATA.course.passingScore).length;}
  function ready(){return avg()>=80 && Number(state.midterm||0)>=80 && Number(state.final||0)>=80 && !!state.portfolio;}
  function renderDashboard(){
    $("studentName").value=state.student||"";$("midtermScore").value=state.midterm||"";$("finalScore").value=state.final||"";$("portfolio").checked=!!state.portfolio;
    const a=avg(), d=done(), ok=ready();
    $("summary").innerHTML=`<div class="grid cols-4"><article class="card stat"><strong>${d}/36</strong><span>Units at 80%+</span></article><article class="card stat"><strong>${a}%</strong><span>Weekly average</span></article><article class="card stat"><strong>${state.midterm||0}%</strong><span>Midterm</span></article><article class="card stat"><strong>${state.final||0}%</strong><span>Final</span></article></div><div class="profile-box" style="margin-top:16px"><h3>${ok?"Certificate Ready":"Certificate Locked"}</h3><p>${ok?"All 80% completion gates are met. The certificate page may be printed.":"Certificate requires weekly average 80%+, midterm 80%+, final 80%+, and adult portfolio approval."}</p><div class="progress"><span style="width:${Math.min(100,Math.round(d/36*100))}%"></span></div><div class="actions"><a class="button ${ok?"gold":""}" href="records/certificate.html">Open Certificate</a><button type="button" class="button" id="exportBtn">Export Records</button></div></div>`;
    $("exportBtn").addEventListener("click", exportRecords);
  }
  function renderUnits(){
    $("unitGrid").innerHTML=DATA.units.map(u=>`<article class="card week-card"><div class="emblem">${String(u.unit).padStart(2,"0")}</div><h3>${esc(u.title)}</h3><p><strong>Question:</strong> ${esc(u.essentialQuestion)}</p><div class="badges"><span class="badge">5 lessons</span><span class="badge">Printable</span><span class="badge">Assessment</span></div><label>Weekly assessment score</label><input type="number" min="0" max="100" value="${state.weekly[u.unit]||""}" data-score="${u.unit}" placeholder="0–100"><div class="actions"><a class="button" href="lessons/unit-${String(u.unit).padStart(2,"0")}/index.html">Open Unit</a><a class="button light" href="printables/unit-${String(u.unit).padStart(2,"0")}-packet.html">Printable</a></div></article>`).join("");
    document.querySelectorAll("[data-score]").forEach(i=>i.addEventListener("input",()=>{state.weekly[i.dataset.score]=Math.max(0,Math.min(100,Number(i.value||0)));save();renderDashboard();}));
  }
  function renderStandards(){const g=$("standardsGrid");if(!g)return;g.innerHTML=DATA.standardsFamilies.map(s=>`<article class="card"><div class="emblem">${esc(s.code.replace("KHAE-",""))}</div><h3>${esc(s.label)}</h3><p>${esc(s.description)}</p></article>`).join("");}
  function bind(){
    $("saveProfile").addEventListener("click",()=>{state.student=$("studentName").value.trim()||"First Grade Scholar";state.midterm=Math.max(0,Math.min(100,Number($("midtermScore").value||0)));state.final=Math.max(0,Math.min(100,Number($("finalScore").value||0)));state.portfolio=$("portfolio").checked;save();renderDashboard();renderUnits();});
    $("clearRecords").addEventListener("click",()=>{if(!confirm("Clear local first-grade records on this device?"))return;localStorage.removeItem(KEY);state=readState();renderDashboard();renderUnits();});
  }
  function exportRecords(){const payload={course:DATA.course.title,exported:new Date().toISOString(),state};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-first-grade-records.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  document.addEventListener("DOMContentLoaded",()=>{$("year").textContent=new Date().getFullYear();bind();renderDashboard();renderUnits();renderStandards();});
})();
