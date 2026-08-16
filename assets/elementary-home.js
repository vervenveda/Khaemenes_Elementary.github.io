(() => {
  "use strict";

  const PREF_KEY = "khaemenes_elementary_preferences_v2";
  const GRADES = [
    {id:"grade-01",label:"Grade 01",title:"First Grade",subtitle:"Early Elementary Learning Garden",path:"grades/grade-01/index.html",tools:"grades/grade-01/teacher-tools/index.html",records:"grades/grade-01/records/",type:"Unit-based daily lessons"},
    {id:"grade-02",label:"Grade 02",title:"Second Grade",subtitle:"Subject-Integrated Foundations",path:"grades/grade-02/index.html",tools:"grades/grade-02/teacher-tools/index.html",records:"grades/grade-02/records/",type:"Integrated / subject learning"},
    {id:"grade-03",label:"Grade 03",title:"Third Grade",subtitle:"Subject Hall Academy",path:"grades/grade-03/index.html",tools:"grades/grade-03/teacher-tools/index.html",records:"grades/grade-03/records/",type:"Subject halls"},
    {id:"grade-04",label:"Grade 04",title:"Fourth Grade",subtitle:"A++ Elementary Honors",path:"grades/grade-04/index.html",tools:"grades/grade-04/teacher-tools/index.html",records:"grades/grade-04/records/",type:"Subject halls"},
    {id:"grade-05",label:"Grade 05",title:"Fifth Grade",subtitle:"Middle School Readiness",path:"grades/grade-05/index.html",tools:"grades/grade-05/teacher-tools/index.html",records:"grades/grade-05/records/",type:"Subject halls"}
  ];

  const $ = id => document.getElementById(id);
  const clean = (value,max=160) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
  const validGrade = value => GRADES.some(g => g.id === value) ? value : "";

  function readPrefs(){
    try{
      const raw = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
      return {
        favoriteSubject:clean(raw.favoriteSubject,80),
        goal:clean(raw.goal,400),
        pinnedGrade:validGrade(raw.pinnedGrade),
        updatedAt:clean(raw.updatedAt,40)
      };
    } catch {
      return {favoriteSubject:"",goal:"",pinnedGrade:"",updatedAt:""};
    }
  }

  function savePrefs(){
    const prefs = {
      favoriteSubject:clean($("favoriteSubject")?.value,80),
      goal:clean($("learningGoal")?.value,400),
      pinnedGrade:validGrade($("pinnedGrade")?.value),
      updatedAt:new Date().toISOString()
    };
    try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs));}catch{}
    render();
  }

  function familyLearner(){
    try{return window.KhaemenesFamilyRegistry?.getLearner?.() || null;}catch{return null;}
  }

  function elementarySummary(){
    try{return window.KhaemenesElementaryContinuity?.getLearnerSummary?.() || null;}catch{return null;}
  }

  function currentGrade(summary,prefs){
    const fromSummary = validGrade(summary?.gradeId || summary?.grade || summary?.currentGrade);
    const fromLearner = validGrade(familyLearner()?.gradeId || familyLearner()?.grade || familyLearner()?.stageDetail);
    return fromSummary || fromLearner || prefs.pinnedGrade || "";
  }

  function mentorSummary(summary){
    const mentor = summary?.mentor;
    if(mentor && String(mentor.id||"").toLowerCase() === "archaemenes") return mentor;
    return {id:"archaemenes",name:"Archaemenes",avatar:"🦉",presentation:"young-scholar",source:"safe-fallback"};
  }

  function renderGrades(activeGrade){
    const grid = $("gradeGrid");
    grid.replaceChildren();
    for(const grade of GRADES){
      const article=document.createElement("article");article.className="card";
      const emblem=document.createElement("span");emblem.className="emblem";emblem.textContent=grade.label.replace("Grade ","");
      const h=document.createElement("h3");h.textContent=grade.title;
      const sub=document.createElement("p");const strong=document.createElement("strong");strong.textContent=grade.subtitle;sub.append(strong);
      const badges=document.createElement("div");badges.className="badges";
      for(const text of [grade.type,"Records","Certificate"]){const b=document.createElement("span");b.className="badge";b.textContent=text;badges.append(b);}
      const actions=document.createElement("div");actions.className="actions center";
      const open=document.createElement("a");open.className="button gold";open.href=grade.path;open.textContent=activeGrade===grade.id?"Continue Course":"Enter Course";
      const tools=document.createElement("a");tools.className="button soft";tools.href=grade.tools;tools.textContent="Teacher Tools";
      actions.append(open,tools);article.append(emblem,h,sub,badges,actions);
      if(activeGrade===grade.id) article.setAttribute("aria-current","true");
      grid.append(article);
    }
  }

  function render(){
    const prefs=readPrefs();
    const learner=familyLearner();
    const summary=elementarySummary();
    const mentor=mentorSummary(summary);
    const gradeId=currentGrade(summary,prefs);
    const grade=GRADES.find(g=>g.id===gradeId)||null;
    const nickname=clean(summary?.nickname || learner?.nickname || learner?.displayName || "Young Scholar",60);

    $("greetingTitle").textContent=`Welcome, ${nickname}`;
    $("greetingText").textContent=grade?`Your active Elementary path is ${grade.label} · ${grade.title}.`:`Choose an Elementary grade path with your family, then begin when you are ready.`;
    $("quickStudent").textContent=learner?nickname:"No active Academy learner";
    $("quickGrade").textContent=grade?`${grade.label} · ${grade.title}`:"Not selected";
    $("quickMentor").textContent=`${mentor.name} · Young Scholar`;
    $("familyStatus").textContent=learner?"Academy Family learner connected":"Open the Academy Family Profile to select a learner";
    $("familyStatus").className=learner?"status-good":"status-review";
    $("mentorName").textContent=mentor.name;
    $("mentorBadge").textContent="Young Scholar · assigned through NAIB";
    $("mentorSpeech").textContent=learner?`${mentor.name}: ${nickname}, I’m here to help you take one clear step at a time. We can find your grade, your next lesson, or a practice tool that fits what you are learning.`:`${mentor.name}: When your Academy learner profile is selected, I’ll meet you here as your Elementary mentor.`;

    $("favoriteSubject").value=prefs.favoriteSubject;
    $("learningGoal").value=prefs.goal;
    $("pinnedGrade").value=prefs.pinnedGrade;
    renderGrades(gradeId);

    const start=$("startGrade");
    if(grade){start.href=grade.path;start.removeAttribute("aria-disabled");start.textContent="Open Active Grade";}
    else{start.href="#grades";start.setAttribute("aria-disabled","true");start.textContent="Choose a Grade";}
  }

  function mentorPrompt(action){
    const prefs=readPrefs();
    const summary=elementarySummary();
    const learner=familyLearner();
    const gradeId=currentGrade(summary,prefs);
    const grade=GRADES.find(g=>g.id===gradeId)||null;
    const nickname=clean(summary?.nickname || learner?.nickname || "Young Scholar",60);
    const lines={
      next:grade?`Archaemenes: ${nickname}, open ${grade.label} and begin with the next unfinished lesson. If you need practice, choose one resource connected to that lesson.`:`Archaemenes: First choose your Elementary grade with your family. Then we can take the next step together.`,
      stuck:`Archaemenes: Let’s make the problem smaller. Read the directions once, circle what you know, and tell yourself what the question is asking. One clue at a time.`,
      break:`Archaemenes: A short break can help your mind reset. Stretch, get water, look away from the screen, then come back when you feel ready.`,
      goal:prefs.goal?`Archaemenes: Your saved goal is “${prefs.goal}”. Let’s choose one small action today that moves you toward it.`:`Archaemenes: Pick one thing you want to improve, and we’ll turn it into a small, clear goal.`
    };
    $("mentorSpeech").textContent=lines[action]||lines.next;
  }

  function exportPrefs(){
    const payload={version:2,kind:"khaemenes-elementary-preferences",preferences:readPrefs(),exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-elementary-preferences.json";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
  }

  $("savePreferences")?.addEventListener("click",savePrefs);
  $("exportPreferences")?.addEventListener("click",exportPrefs);
  $("printOverview")?.addEventListener("click",()=>window.print());
  document.addEventListener("click",event=>{const b=event.target.closest("[data-mentor-action]");if(b)mentorPrompt(b.dataset.mentorAction);});
  window.addEventListener("khaemenes-family-ready",render);
  window.addEventListener("khaemenes-family-changed",render);
  window.addEventListener("khaemenes-elementary-ready",render);
  window.addEventListener("khaemenes-naib-ready",render);
  window.addEventListener("storage",event=>{if([PREF_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))render();});
  render();
})();