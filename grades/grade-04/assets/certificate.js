(() => {
  "use strict";
  const out=document.getElementById("out");
  const summary=window.KhaemenesGrade4Continuity?.getSummary?.()||null;
  const s=summary?.state||{};
  const name=String(summary?.learner?.nickname||"Fourth Grade Scholar").replace(/[<>&]/g,"");
  const avg=summary?.average||0;
  const done=summary?.mastered||0;
  const ready=Boolean(summary?.certificateReady);
  out.innerHTML=ready?`<section class="worksheet" style="text-align:center;border:12px double #c79638"><p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p><h1 style="font-family:Georgia,serif;color:#102b48;text-transform:none">Certificate of Fourth Grade Completion</h1><p>This certifies that</p><h2>${name}</h2><p>has completed the Khaemenes Academy Fourth Grade Subject-Based 36 Week A++ Curriculum.</p><p><strong>Weekly Average:</strong> ${avg}% · <strong>Weeks at 80%+:</strong> ${done}/36 · <strong>Midterm:</strong> ${s.midterm||0}% · <strong>Final:</strong> ${s.final||0}%</p><p>The learner completed subject halls, A++ lesson blocks, printables, workshops, verified assessments, portfolio evidence, and adult review.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px"><div class="primary-line">Adult Reviewer / Teacher</div><div class="primary-line">Date</div></div><p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · 2026</p><button class="button no-print" onclick="window.print()">Print Certificate</button></section>`:`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#102b48;text-transform:none">Certificate Locked</h1><p>This certificate requires an active Grade 04 Academy learner, 36 verified weekly mastery results at 80%+, midterm 80%+, final 80%+, and approved portfolio evidence.</p><p><strong>Weeks at 80%+:</strong> ${done}/36 · <strong>Weekly Average:</strong> ${avg}% · <strong>Midterm:</strong> ${s.midterm||0}% · <strong>Final:</strong> ${s.final||0}% · <strong>Portfolio:</strong> ${s.portfolio?"Approved":"Pending"}</p><a class="button" href="../index.html">Return to Portal</a></section>`;
})();
