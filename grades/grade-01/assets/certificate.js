(() => {
  "use strict";

  const $=id=>document.getElementById(id);

  function summary(){
    try{return window.KhaemenesGrade1Continuity?.getSummary?.()||null}catch{return null}
  }

  function add(parent,tag,text,className){
    const el=document.createElement(tag);if(className)el.className=className;el.textContent=text;parent.append(el);return el;
  }

  function render(){
    const out=$("out");if(!out)return;out.replaceChildren();
    const s=summary();
    const state=s?.state||{};
    const learner=s?.learner||null;
    const section=document.createElement("section");section.className="worksheet";section.style.textAlign="center";

    if(!learner){
      add(section,"h1","Certificate Locked");
      add(section,"p","Select a Grade 01 learner in the Academy Family Profile before checking certificate readiness.");
      const a=add(section,"a","Open Family Profile","button");a.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
      out.append(section);return;
    }

    if(!s.certificateReady){
      add(section,"h1","Certificate Locked");
      add(section,"p","First Grade certification requires all 36 weekly mastery checks at 80%+, midterm 80%+, final 80%+, and approved portfolio evidence.");
      add(section,"p",`${s.mastered}/36 weeks at mastery · Weekly average ${s.average}% · Midterm ${state.midterm||0}% · Final ${state.final||0}% · Portfolio ${state.portfolio?"Approved":"Pending"}`);
      const a=add(section,"a","Return to First Grade","button");a.href="../index.html";
      out.append(section);return;
    }

    section.style.border="12px double #c79a42";
    add(section,"p","Khaemenes Academy");
    add(section,"h1","Certificate of First Grade Completion");
    add(section,"p","This certifies that");
    add(section,"h2",learner.nickname||"First Grade Scholar");
    add(section,"p","has completed the Khaemenes Academy First Grade 36-Week Curriculum.");
    add(section,"p",`Weekly Average: ${s.average}% · Weeks at 80%+: ${s.mastered}/36 · Midterm: ${state.midterm}% · Final: ${state.final}%`);
    add(section,"p","The learner completed daily lessons, printables, workshops, weekly mastery checks, midyear review, final readiness demonstration, portfolio evidence, and adult-reviewed records.");
    const signatures=document.createElement("div");signatures.style.display="grid";signatures.style.gridTemplateColumns="1fr 1fr";signatures.style.gap="50px";signatures.style.marginTop="70px";
    add(signatures,"div","Adult Teacher / Evaluator","primary-line");add(signatures,"div","Date","primary-line");section.append(signatures);
    add(section,"p","Jennifer Kay Pearl · Khaemenes Academy");
    const print=add(section,"button","Print Certificate","button no-print");print.type="button";print.addEventListener("click",()=>window.print());
    out.append(section);
  }

  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  document.addEventListener("DOMContentLoaded",()=>{$("year").textContent=new Date().getFullYear();render();});
})();