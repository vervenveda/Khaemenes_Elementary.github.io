(() => {
  "use strict";
  const out=document.getElementById("out");
  const el=(tag,text,className)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n};

  function render(){
    if(!out)return;out.replaceChildren();
    const s=window.KhaemenesGrade2Continuity?.getSummary?.();
    const learner=s?.learner;
    const ready=Boolean(s?.certificateReady&&learner);
    const sheet=el("section",undefined,"worksheet");sheet.style.textAlign="center";
    if(ready)sheet.style.border="12px double #c7983e";
    const title=el("h1",ready?"Certificate of Second Grade Completion":"Certificate Locked");title.style.fontFamily="Georgia,serif";title.style.color="#173a5a";title.style.textTransform="none";sheet.append(title);
    if(!learner){
      sheet.append(el("p","Select the active Grade 02 learner in the Academy Family Profile before a formal certificate can be issued."));
    }else if(!ready){
      sheet.append(el("p",`This certificate remains locked for ${learner.nickname}.`));
      sheet.append(el("p",`Mastered weeks: ${s.mastered}/36 · Weekly average: ${s.average}% · Midterm: ${s.state.midterm||0}% · Final: ${s.state.final||0}% · Portfolio: ${s.state.portfolio?"Approved":"Pending"}`));
      sheet.append(el("p","Certification requires all 36 weeks at 80%+, midterm 80%+, final 80%+, and approved portfolio evidence."));
    }else{
      sheet.prepend(el("p","Khaemenes Academy"));
      sheet.append(el("p","This certifies that"),el("h2",learner.nickname),el("p","has completed the Khaemenes Academy Second Grade Subject-Based 36 Week A+ Curriculum."));
      sheet.append(el("p",`Weekly Average: ${s.average}% · Weeks at 80%+: ${s.mastered}/36 · Midterm: ${s.state.midterm}% · Final: ${s.state.final}%`));
      sheet.append(el("p","The learner completed subject lessons, printables, workshops, weekly assessments, midyear review, final demonstration, portfolio evidence, and adult verification."));
      const sig=el("div");sig.style.display="grid";sig.style.gridTemplateColumns="1fr 1fr";sig.style.gap="50px";sig.style.marginTop="70px";sig.append(el("div","Adult Teacher / Evaluator","primary-line"),el("div","Date","primary-line"));sheet.append(sig);
      const by=el("p","Jennifer Kay Pearl · Khaemenes Academy");by.style.marginTop="50px";sheet.append(by);
      const print=el("button","Print Certificate","button no-print");print.type="button";print.addEventListener("click",()=>window.print());sheet.append(print);
    }
    const back=el("a","Return to Portal","button");back.href="../index.html";sheet.append(back);out.append(sheet);
  }

  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  window.addEventListener("storage",e=>{if(String(e.key||"").startsWith("khaemenes_"))render()});
})();
