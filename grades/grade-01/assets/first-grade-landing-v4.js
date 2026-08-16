(() => {
  "use strict";

  const $=id=>document.getElementById(id);
  const clean=(value,max=160)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim().slice(0,max);
  const RESOURCES=[
    {icon:"🔷",title:"Elementary Geometry",desc:"Shapes, spatial reasoning, geometry vocabulary, and visual thinking.",href:"../../games/elementary_geometry/"},
    {icon:"💛",title:"Kindness Quest Academy",desc:"Social-emotional learning, service, reflection, friendship, and repair.",href:"../../games/kindness_quest/"},
    {icon:"🌱",title:"Vocabulary Garden",desc:"Definitions, context clues, synonyms, antonyms, roots, and word play.",href:"../../games/elementary_vocabulary_garden/"},
    {icon:"🌦️",title:"Elementary Weather Portal",desc:"Weather observation, safety, experiments, moon phase, and Earth science.",href:"../../games/elementary_weather_portal/"},
    {icon:"🌈",title:"Emotional Garden",desc:"Feelings vocabulary, reflection, self-awareness, and healthy regulation practice.",href:"../../games/emotional_garden/"},
    {icon:"🧠",title:"Curiosity Machine",desc:"Prediction, explanation, testing, observation, drawing, and scientific writing.",href:"../../games/curiosity-machine/"},
    {icon:"🧮",title:"Fraction Picnic",desc:"Visual fraction models and early equivalence practice.",href:"../../games/fraction-picnic-k-5/"},
    {icon:"🛠️",title:"Junior Engineer Studio",desc:"Engineering design, problem-solving, making, and design thinking.",href:"../../games/junior-engineer-studio/"}
  ];

  function gradeSummary(){
    try{return window.KhaemenesGrade1Continuity?.getSummary?.()||null}catch{return null}
  }

  function renderIdentity(){
    const s=gradeSummary();
    const learner=s?.learner||null;
    const mentor=s?.mentor||{name:"Archaemenes",avatar:"🦉",presentationMode:"young-scholar"};
    const nickname=clean(learner?.nickname||"Young Scholar",60);
    $("mentorAvatar").textContent=mentor.avatar||"🦉";
    $("mentorName").textContent="Archaemenes";
    $("mentorBadge").textContent="Young Scholar · assigned through NAIB";
    $("mentorSpeech").textContent=learner
      ? `Welcome, ${nickname}. I’m Archaemenes. We will take First Grade one thoughtful step at a time—look closely, ask good questions, and use evidence to show what you know.`
      : "I’m Archaemenes. When your Academy Family learner is selected, I’ll meet you here as your First Grade mentor.";
    $("learnerName").textContent=learner?nickname:"No active First Grade learner";
    $("learnerIdState").textContent=learner?"Academy Family Registry connected":"Family learner needed for formal progress";
    $("learnerStatus").className=`status ${learner?"good":"review"}`;
    $("learnerStatus").textContent=learner
      ? "Identity connected. First Grade course records are scoped to this learner."
      : "Open the Academy Family Profile and select a Grade 01 learner. Learning resources remain open.";
    $("masteredCount").textContent=`${s?.mastered||0}/36`;
    $("weeklyAverage").textContent=`${s?.average||0}%`;
    $("nextWeek").textContent=String(s?.next||1).padStart(2,"0");
    $("certificateState").textContent=s?.certificateReady?"Ready":"Locked";
    const next=String(s?.next||1).padStart(2,"0");
    $("continueBtn").href=`lessons/unit-${next}/index.html`;
    $("continueBtn").textContent=(s?.mastered||0)>0?`Continue Week ${next}`:"Begin Week 01";
  }

  function renderUnits(){
    const grid=$("unitGrid");
    const data=window.KHAE_GRADE1_DATA;
    if(!grid||!data?.units)return;
    grid.replaceChildren();
    const s=gradeSummary();
    const state=s?.state||{};
    for(const unit of data.units){
      const n=Number(unit.unit);
      const score=Number(state.weekly?.[n]||0);
      const article=document.createElement("article");article.className="card week-card";
      const badge=document.createElement("div");badge.className="week";badge.textContent=String(n).padStart(2,"0");
      const h=document.createElement("h3");h.textContent=unit.title;
      const q=document.createElement("p");q.textContent=unit.essentialQuestion||"Five connected First Grade lessons.";
      const status=document.createElement("p");status.textContent=score>=80?`Mastery recorded: ${score}%`:score>0?`Assessment recorded: ${score}% · mastery requires 80%+`:n===s?.next?"Current learning week":"Assessment evidence not yet recorded";
      const actions=document.createElement("div");actions.className="week-actions";
      const lesson=document.createElement("a");lesson.className="btn primary";lesson.href=`lessons/unit-${String(n).padStart(2,"0")}/index.html`;lesson.textContent="Open Unit";
      const printable=document.createElement("a");printable.className="btn";printable.href=`printables/unit-${String(n).padStart(2,"0")}-packet.html`;printable.textContent="Printable";
      const assessment=document.createElement("a");assessment.className="btn gold";assessment.href=`assessments/unit-${String(n).padStart(2,"0")}-assessment.html`;assessment.textContent="Mastery Check";
      actions.append(lesson,printable,assessment);article.append(badge,h,q,status,actions);grid.append(article);
    }
  }

  function renderResources(){
    const grid=$("resourceGrid");if(!grid)return;grid.replaceChildren();
    for(const resource of RESOURCES){
      const card=document.createElement("article");card.className="card resource-card";
      const icon=document.createElement("div");icon.className="icon";icon.textContent=resource.icon;
      const h=document.createElement("h3");h.textContent=resource.title;
      const p=document.createElement("p");p.textContent=resource.desc;
      const a=document.createElement("a");a.className="btn";a.href=resource.href;a.textContent="Open Practice";
      card.append(icon,h,p,a);grid.append(card);
    }
  }

  function mentorPrompt(action){
    const s=gradeSummary();
    const name=clean(s?.learner?.nickname||"Young Scholar",60);
    const next=String(s?.next||1).padStart(2,"0");
    const text={
      next:`${name}, your next learning step is Week ${next}. Open the lesson, read the goal, and begin with the first small task.`,
      stuck:"Make the problem smaller. Read the directions once, point to what you already know, and solve only the first part. One clue at a time.",
      break:"A short break can help your attention reset. Stretch, get water, look away from the screen, and return when you are ready.",
      evidence:"When you finish a week, use the mastery check with a parent, guardian, or educator. The assessment record—not your mentor—decides whether the 80% mastery gate is met."
    };
    $("mentorSpeech").textContent=`Archaemenes: ${text[action]||text.next}`;
  }

  function renderAll(){renderIdentity();renderUnits();}

  document.addEventListener("click",event=>{
    const b=event.target.closest("[data-mentor-action]");if(b)mentorPrompt(b.dataset.mentorAction);
  });
  window.addEventListener("khaemenes-family-changed",renderAll);
  window.addEventListener("khaemenes-elementary-family-ready",renderAll);
  window.addEventListener("khaemenes-naib-ready",renderAll);
  window.addEventListener("storage",event=>{if(String(event.key||"").startsWith("khaemenes_"))renderAll();});
  document.addEventListener("DOMContentLoaded",()=>{
    $("year").textContent=new Date().getFullYear();
    renderResources();renderAll();
  });
})();