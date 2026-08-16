(() => {
  "use strict";

  const out = document.getElementById("out");
  const printButton = document.getElementById("printCertificate");
  const year = document.getElementById("year");
  const summary = window.KhaemenesGrade4Continuity?.getSummary?.() || null;
  const state = summary?.state || {};
  const name = String(summary?.learner?.nickname || "Fourth Grade Scholar")
    .replace(/[\u0000-\u001F\u007F]/g,"")
    .replace(/[<>&]/g,"")
    .trim()
    .slice(0,80);
  const average = Number(summary?.average || 0);
  const mastered = Number(summary?.mastered || 0);
  const ready = Boolean(summary?.certificateReady);

  if(year) year.textContent = String(new Date().getFullYear());
  if(printButton){
    printButton.disabled = !ready;
    printButton.addEventListener("click",() => window.print());
  }

  if(!out) return;

  if(ready){
    out.innerHTML = `<section class="worksheet" style="text-align:center;border:12px double #c79638"><p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p><h1 style="font-family:Georgia,serif;color:#102b48;text-transform:none">Certificate of Fourth Grade Completion</h1><p>This certifies that</p><h2>${name}</h2><p>has completed the Khaemenes Academy Fourth Grade Subject-Based 36 Week A++ Curriculum.</p><p><strong>Weekly Average:</strong> ${average}% · <strong>Weeks at 80%+:</strong> ${mastered}/36 · <strong>Midterm:</strong> ${Number(state.midterm||0)}% · <strong>Final:</strong> ${Number(state.final||0)}%</p><p>The learner completed subject halls, A++ lesson blocks, printables, workshops, verified assessments, portfolio evidence, and adult review.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px"><div class="primary-line">Adult Reviewer / Teacher</div><div class="primary-line">Date</div></div><p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · ${new Date().getFullYear()}</p></section>`;
    return;
  }

  out.innerHTML = `<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#102b48;text-transform:none">Certificate Locked</h1><p>This certificate requires an active Grade 04 Academy learner, 36 verified weekly mastery results at 80%+, midterm 80%+, final 80%+, and approved portfolio evidence.</p><p><strong>Weeks at 80%+:</strong> ${mastered}/36 · <strong>Weekly Average:</strong> ${average}% · <strong>Midterm:</strong> ${Number(state.midterm||0)}% · <strong>Final:</strong> ${Number(state.final||0)}% · <strong>Portfolio:</strong> ${state.portfolio?"Approved":"Pending"}</p><a class="button" href="../index.html">Return to Portal</a></section>`;
})();
