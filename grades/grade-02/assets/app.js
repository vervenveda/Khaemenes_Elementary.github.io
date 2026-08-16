(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const DATA=window.KHAE_GRADE2_DATA||null;

  function summary(){return window.KhaemenesGrade2Continuity?.getSummary?.()||null}
  function units(){
    if(Array.isArray(DATA?.units)&&DATA.units.length)return DATA.units.map((u,i)=>({week:Number(u.week||i+1),title:String(u.title||`Week ${i+1}`),essentialQuestion:String(u.essentialQuestion||"")}));
    return Array.from({length:36},(_,i)=>({week:i+1,title:`Week ${String(i+1).padStart(2,"0")}`,essentialQuestion:"Open the weekly subject plans and assessment evidence."}));
  }
  function standards(){return Array.isArray(DATA?.standardsFamilies)?DATA.standardsFamilies:[]}
  function el(tag,text,className){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n}

  function renderIdentity(s){
    const learner=s?.learner;const mentor=s?.mentor;
    if($("learnerName"))$("learnerName").textContent=learner?.nickname||"No active Grade 02 learner";
    if($("mentorName"))$("mentorName").textContent=mentor?.name||"Archaemenes";
    if($("mentorMode"))$("mentorMode").textContent="Young Scholar · assigned through NAIB";
    if($("mentorMessage"))$("mentorMessage").textContent=learner?`Welcome, ${learner.nickname}. We will work subject by subject, one clear step at a time.`:"Select the active Grade 02 learner in the Academy Family Profile to connect formal records.";
  }

  function renderSummary(s){
    const host=$("summary");if(!host)return;host.replaceChildren();
    const grid=el("div",undefined,"grid cols-4");
    for(const [value,label] of [[`${s?.mastered||0}/36`,"Weeks at 80%+"],[`${s?.average||0}%`,"Weekly average"],[`${s?.state?.midterm||0}%`,"Midterm"],[`${s?.state?.final||0}%`,"Final"]]){
      const card=el("article",undefined,"card stat");card.append(el("strong",value),el("span",label));grid.append(card);
    }
    const box=el("div",undefined,"profile-box");box.style.marginTop="16px";
    box.append(el("h3",s?.certificateReady?"Certificate Ready":"Certificate Locked"));
    box.append(el("p",s?.eligible?"Formal scores are recorded through Teacher Tools after assessment evidence is reviewed.":"Formal Grade 02 records require the active Academy Grade 02 learner."));
    const actions=el("div",undefined,"actions");
    const cert=el("a","Open Certificate","button");cert.href="records/certificate.html";
    const teacher=el("a","Teacher / Family Verification","button gold");teacher.href="teacher-tools/index.html";
    actions.append(cert,teacher);box.append(actions);host.append(grid,box);
  }

  function renderWeeks(s){
    const grid=$("weekGrid");if(!grid)return;grid.replaceChildren();
    for(const u of units()){
      const score=Number(s?.state?.weekly?.[u.week]||0);
      const card=el("article",undefined,"card week-card");
      card.append(el("div",String(u.week).padStart(2,"0"),"emblem"),el("h3",u.title));
      const q=el("p");q.append(el("strong","Question: "),document.createTextNode(u.essentialQuestion||"Review this week's subject learning and evidence."));card.append(q);
      const status=el("p",score?`Recorded mastery: ${score}%":"Assessment not yet verified.");card.append(status);
      const actions=el("div",undefined,"actions");
      const printable=el("a","Printable","button");printable.href=`printables/week-${String(u.week).padStart(2,"0")}-packet.html`;
      const assessment=el("a","Assessment","button light");assessment.href=`assessments/week-${String(u.week).padStart(2,"0")}-assessment.html`;
      actions.append(printable,assessment);card.append(actions);grid.append(card);
    }
  }

  function renderStandards(){
    const grid=$("standardsGrid");if(!grid)return;grid.replaceChildren();
    for(const s of standards()){
      const card=el("article",undefined,"card");card.append(el("div",String(s.code||"").replace("KHAE-",""),"emblem"),el("h3",String(s.label||"Coverage")),el("p",String(s.description||"")));grid.append(card);
    }
  }

  function render(){const s=summary()||{eligible:false,state:{weekly:{},midterm:0,final:0},mastered:0,average:0};renderIdentity(s);renderSummary(s);renderWeeks(s);renderStandards();if($("year"))$("year").textContent=new Date().getFullYear()}

  document.addEventListener("DOMContentLoaded",render);
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-family-ready",render);
  window.addEventListener("khaemenes-naib-ready",render);
  window.addEventListener("storage",e=>{if(String(e.key||"").startsWith("khaemenes_"))render()});
})();
