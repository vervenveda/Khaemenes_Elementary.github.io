(() => {
  "use strict";
  const LEGACY_KEY="khaemenes_grade1_36_aplus_v1";
  const R=window.KhaemenesFamilyRegistry||null;
  const C=window.KhaemenesGrade1Continuity||null;
  const learner=R?.getLearner?.()||null;
  const context=C?.status?.()||null;

  function read(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}}
  function safeName(value){return String(value||"First Grade Scholar").replace(/[<>&]/g,"").slice(0,80)}

  let state=null;
  let source="legacy";
  let scopedKey=null;

  if(learner?.learnerId && context?.placementMatch){
    scopedKey=`khaemenes.course:${learner.learnerId}:elementary-grade-01`;
    const scoped=read(scopedKey);
    if(scoped?.state && typeof scoped.state==="object"){
      state=scoped.state;
      source="canonical-learner";
    }
  }

  if(!state)state=read(LEGACY_KEY)||{};

  const vals=Object.values(state.weekly||{}).map(Number).filter(Number.isFinite);
  const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
  const done=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;
  const ok=avg>=80 && Number(state.midterm||0)>=80 && Number(state.final||0)>=80 && !!state.portfolio;
  const name=safeName(context?.placementMatch&&learner?.nickname?learner.nickname:state.student);
  const out=document.getElementById("out");

  if(!out)return;

  if(learner && context && !context.placementMatch){
    out.innerHTML=`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#16375a;text-transform:none">Grade 01 Certificate Preview</h1><p>The active Academy learner is not formally placed in Grade 01. Certificate state is not issued from another learner's record.</p><a class="button" href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Return to Student Portal</a></section>`;
    return;
  }

  out.innerHTML=ok
    ?`<section class="worksheet" style="text-align:center;border:12px double #c79a42"><p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p><h1 style="font-family:Georgia,serif;color:#16375a;text-transform:none">Certificate of First Grade Completion</h1><p>This certifies that</p><h2>${name}</h2><p>has completed the Khaemenes Academy First Grade 36 Unit A+ Curriculum.</p><p><strong>Weekly Average:</strong> ${avg}% · <strong>Units at 80%+:</strong> ${done}/36 · <strong>Midterm:</strong> ${Number(state.midterm||0)}% · <strong>Final:</strong> ${Number(state.final||0)}%</p><p>The learner completed daily lessons, professional printables, workshops, weekly assessments, midyear review, final readiness demonstration, portfolio evidence, and adult mentor review.</p><p><small>Record source: ${source==="canonical-learner"?"canonical Academy learner record":"legacy local record"}</small></p><div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px"><div class="primary-line">Adult Mentor / Teacher</div><div class="primary-line">Date</div></div><p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · 2026</p><button class="button no-print" onclick="window.print()">Print Certificate</button></section>`
    :`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#16375a;text-transform:none">Certificate Locked</h1><p>The certificate opens when weekly average, midterm, final, and portfolio approval all meet the 80% completion rule.</p><p><strong>Weekly Average:</strong> ${avg}% · <strong>Midterm:</strong> ${Number(state.midterm||0)}% · <strong>Final:</strong> ${Number(state.final||0)}% · <strong>Portfolio:</strong> ${state.portfolio?"Approved":"Pending"}</p><p><small>${source==="canonical-learner"?"Checking the active learner's canonical Grade 01 record.":"Using legacy local state because no canonical learner-scoped record is available yet."}</small></p><a class="button" href="../index.html">Return to Portal</a></section>`;
})();
