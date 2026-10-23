/*
 * Khaemenes Elementary Learning Ledger v1.0.0
 * ------------------------------------------------------------
 * Adds randomized formative checkpoints to Elementary lesson surfaces
 * and records learner-scoped daily evidence. Practice never awards
 * mastery, changes placement, or unlocks formal curriculum.
 */
(function attachElementaryLearningLedger(global){
"use strict";

const VERSION="1.1.0";
const LEDGER_KEY="khaemenes_elementary_learning_ledger_v1";
const REGISTRY_KEY="khaemenes_family_registry_v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const MAX_RECORDS=500;

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const uid=()=>`lel-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;

function routeGrade(){
  const m=location.pathname.match(/\/grades\/grade-(0[1-5])\//i);
  if(m)return m[1];
  if(/^\/(?:Khaemenes_Elementary\.github\.io\/)?(?:lessons|assessments)\//i.test(location.pathname))return"01";
  return null;
}
function routeWeek(){
  const m=location.pathname.match(/(?:week|unit)-(\d{1,2})/i);
  return m?Math.max(1,Math.min(36,Number(m[1])||1)):null;
}
function routeSubject(){
  const m=location.pathname.match(/\/subjects\/([^/]+)\//i);
  if(m)return global.KhaemenesElementaryQuestionFactory?.normalizeSubject?.(decodeURIComponent(m[1]))||m[1];
  return"integrated-projects";
}
function activeLearner(){
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null),learner=id&&registry?.learners?.[id]?registry.learners[id]:null;
  if(!learner)return null;
  const grade=String(learner.grade||"").replace(/[^0-9]/g,"").padStart(2,"0");
  const stage=String(learner.stage||"").trim().toLowerCase();
  return stage==="elementary"&&grade===routeGrade()?{...learner,grade}:null;
}
function ownerId(){return activeLearner()?.learnerId||"preview"}
function allLedger(){
  const value=read(LEDGER_KEY,{});
  return value&&typeof value==="object"&&!Array.isArray(value)?value:{};
}
function records(){
  const all=allLedger(),id=ownerId();
  return Array.isArray(all[id])?all[id]:[];
}
function saveRecord(record){
  const all=allLedger(),id=ownerId(),list=Array.isArray(all[id])?all[id]:[];
  list.push(record);
  all[id]=list.slice(-MAX_RECORDS);
  if(!write(LEDGER_KEY,all))return false;
  global.dispatchEvent(new CustomEvent("khaemenes-elementary-ledger-recorded",{detail:{record,learnerId:id}}));
  return true;
}
function recent(days=7){
  const cutoff=Date.now()-Math.max(1,Number(days)||7)*86400000;
  return records().filter(r=>Date.parse(r.completedAt||r.createdAt||"")>=cutoff);
}
function focusFor(article){
  const focus=[...article.querySelectorAll("p")].find(p=>/^\s*Focus:/i.test(p.textContent||""));
  if(focus)return focus.textContent.replace(/^\s*Focus:\s*/i,"").trim();
  const objective=[...article.querySelectorAll("p")].find(p=>/^\s*Objective:/i.test(p.textContent||""));
  if(objective)return objective.textContent.replace(/^\s*Objective:\s*/i,"").trim();
  return (article.querySelector("h4")?.textContent||document.querySelector("h1")?.textContent||"").trim();
}
function dayLabel(article,index){
  return (article.querySelector("h4")?.textContent||`Lesson ${index+1}`).split(":")[0].trim();
}
function addStyle(){
  if(document.getElementById("elementaryLearningLedgerStyle"))return;
  const style=document.createElement("style");
  style.id="elementaryLearningLedgerStyle";
  style.textContent=`
    .elementary-formative{margin-top:16px;padding:14px;border:1px solid rgba(36,68,90,.16);border-radius:12px;background:linear-gradient(145deg,#fff,#f4f9fc)}
    .elementary-formative h5{margin:0;color:#173a5a;font:600 1rem Georgia,serif}
    .elementary-formative p{margin:.35rem 0;color:#68757e;font-size:.86rem}
    .elementary-formative button{min-height:40px;padding:8px 11px;border:1px solid rgba(23,58,90,.2);border-radius:8px;background:#fff;color:#173a5a;font:inherit;font-weight:700;cursor:pointer}
    .elementary-formative button.primary{background:#173a5a;color:#fff}
    .elementary-formative-quiz{margin-top:12px;display:grid;gap:12px}
    .elementary-formative-question{padding:12px;border:1px solid rgba(23,58,90,.13);border-radius:10px;background:#fff}
    .elementary-formative-question strong{display:block;margin-bottom:8px}
    .elementary-formative-option{display:block;margin:6px 0;font-size:.88rem}
    .elementary-formative-feedback{margin-top:8px;padding:8px;border-radius:8px;background:#f5f7f8;font-size:.82rem}
    .elementary-formative-reflection{width:100%;min-height:72px;margin-top:10px;padding:9px;border:1px solid rgba(23,58,90,.18);border-radius:8px;font:inherit;resize:vertical}
    .elementary-formative-status{margin-top:9px;font-size:.82rem;font-weight:700;color:#315b76}
    .elementary-ledger-summary{margin:18px 0;padding:14px;border:1px solid rgba(23,58,90,.16);border-radius:12px;background:#f8fbfd}
    .elementary-depth-studio{margin:14px 0 0;padding:13px;border:1px solid rgba(62,84,66,.18);border-radius:10px;background:#fbfcf8}
    .elementary-depth-studio h5{margin:0 0 8px;color:#29493d;font:600 1rem Georgia,serif}
    .elementary-depth-studio dl{display:grid;grid-template-columns:max-content 1fr;gap:6px 10px;margin:0}
    .elementary-depth-studio dt{font-weight:700;color:#365a4d}
    .elementary-depth-studio dd{margin:0}
    @media(max-width:620px){.elementary-depth-studio dl{grid-template-columns:1fr}.elementary-depth-studio dt{margin-top:5px}}
    @media print{.elementary-formative button,.elementary-formative-reflection{display:none!important}}
  `;
  document.head.appendChild(style);
}
function renderQuestions(container,questions,context){
  container.innerHTML=`
    <div class="elementary-formative-quiz">
      ${questions.map((q,i)=>`
        <section class="elementary-formative-question" data-formative-q="${i}">
          <strong>${i+1}. ${esc(q.prompt)}</strong>
          ${q.options.map((opt,j)=>`<label class="elementary-formative-option"><input type="radio" name="formative-${context.key}-${i}" value="${j}"> ${esc(opt)}</label>`).join("")}
          <div class="elementary-formative-feedback" data-feedback="${i}" hidden></div>
        </section>
      `).join("")}
      <label><strong>Optional reflection</strong><textarea class="elementary-formative-reflection" placeholder="What strategy helped? What would you try next?"></textarea></label>
      <div><button type="button" class="primary" data-submit-formative>Save Lesson Check</button> <button type="button" data-new-formative>New Practice Set</button></div>
      <div class="elementary-formative-status" aria-live="polite"></div>
    </div>`;

  const status=container.querySelector(".elementary-formative-status");
  container.querySelector("[data-new-formative]").addEventListener("click",()=>startCheckpoint(container,context));
  container.querySelector("[data-submit-formative]").addEventListener("click",()=>{
    let correct=0,answered=0;
    const responses=[];
    questions.forEach((q,i)=>{
      const chosen=container.querySelector(`input[name="formative-${context.key}-${i}"]:checked`);
      const feedback=container.querySelector(`[data-feedback="${i}"]`);
      const selected=chosen?Number(chosen.value):null;
      if(selected!==null)answered++;
      const isCorrect=selected===q.answer;
      if(isCorrect)correct++;
      responses.push({id:q.id,prompt:q.prompt,options:q.options,selected,answer:q.answer,correct:isCorrect,skill:q.skill,subject:q.subject});
      feedback.hidden=false;
      feedback.textContent=selected===null?"Not answered.":isCorrect?(q.rationale||"That choice fits the concept."):(q.rationale||`Review the idea and compare the choices again.`);
    });
    if(answered<questions.length){status.textContent="Answer each checkpoint question before saving.";return}
    const score=Math.round(correct/questions.length*100),learner=activeLearner(),reflection=container.querySelector(".elementary-formative-reflection").value.trim();
    const record={
      schema:"khaemenes-elementary-learning-ledger-record-v1",
      id:uid(),
      learnerId:learner?.learnerId||null,
      preview:!learner,
      grade:routeGrade(),
      week:routeWeek(),
      subject:routeSubject(),
      day:context.day,
      focus:context.focus,
      page:location.pathname,
      kind:"lesson-formative-checkpoint",
      questionCount:questions.length,
      correct,
      score,
      responses,
      reflection:reflection.slice(0,1000),
      masteryAuthority:false,
      affectsGrade:false,
      unlocksCurriculum:false,
      completedAt:new Date().toISOString()
    };
    if(saveRecord(record)){
      status.textContent=`Saved formative evidence: ${correct}/${questions.length} (${score}%). This practice does not change formal mastery.`;
      container.closest(".lesson")?.setAttribute("data-formative-saved","true");
    }else status.textContent="This browser could not save the lesson checkpoint.";
  });
}
function startCheckpoint(container,context){
  const factory=global.KhaemenesElementaryQuestionFactory;
  if(!factory){container.innerHTML="<p>Practice questions are still loading.</p>";return}
  const seed=`${Date.now()}|${location.pathname}|${context.key}`;
  const questions=factory.makePool({grade:Number(routeGrade()),subject:routeSubject(),focus:context.focus,seed,count:3});
  renderQuestions(container,questions,context);
}


function baseDepthPlan(subject,dayIndex,focus,grade){
  const f=String(focus||"the lesson focus").trim(),g=Number(grade)||2;
  const plans={
    "language-arts":[
      ["Model the exact reading or writing move with one short think-aloud.","Mark the evidence, word part, sentence feature, or structure that proves the move.","One annotated example plus a sentence explaining why the evidence fits."],
      ["Contrast a strong example with a near-miss and name the difference.","Practice the focus twice with different text or sentences; explain the correction.","Two attempts with one explicit revision."],
      ["Transfer the skill to a fresh short passage, prompt, or oral text.","Read, write, or discuss without copying the model; cite or point to evidence.","Independent response with quoted or paraphrased evidence, or a precise language example."],
      ["Revise for accuracy, clarity, organization, and evidence.","Use feedback to improve one sentence or paragraph and explain what changed.","Before/after revision plus a reason for the change."],
      ["Defend the week's literacy learning aloud or in writing.","Select the strongest work sample and explain the strategy used.","Portfolio sample plus reflection naming evidence and next step."]
    ],
    "mathematics":[
      ["Model the focus with quantities, labels, and a visible representation.","Solve one worked example, then explain what each number or symbol represents.","Accurate model or equation with labeled reasoning."],
      ["Connect at least two representations or strategies.","Solve a parallel problem using a second pathway and compare efficiency.","Two strategies or representations with a comparison."],
      ["Analyze an error or non-example before solving independently.","Find the exact step where reasoning fails, correct it, and verify the result.","Corrected solution with an error explanation and check."],
      ["Apply the focus in a multi-step or real-world context appropriate to Grade "+g+".","Choose needed information, solve, label units, and test reasonableness.","Complete solution with units or model and a reasonableness check."],
      ["Generalize the mathematical idea and defend the solution.","State the rule or pattern used, solve a fresh example, and verify another way.","Independent solution plus explanation and verification."]
    ],
    "science":[
      ["Turn the focus into an observable or testable question.","Identify what can be observed or measured and what must remain a cautious inference.","Question plus observation/inference distinction."],
      ["Plan a fair comparison, model, or evidence collection routine.","Name variables or conditions, units, safety, and the data to collect.","Procedure or model with variables or conditions and units."],
      ["Collect or interpret evidence before making a claim.","Record data or observations in a table, diagram, or labeled model.","Organized evidence record with patterns noted."],
      ["Build a claim-evidence-reasoning explanation and challenge it.","Use specific evidence, then name a limitation or alternative explanation.","CER response with a limitation."],
      ["Revise the model or explanation after review.","Correct one weak assumption, measurement, label, or reasoning link.","Revised scientific product plus reflection."]
    ],
    "arts-music":[
      ["Observe or analyze a model using discipline vocabulary.","Identify two intentional choices in line, shape, color, rhythm, melody, texture, space, form, or performance.","Annotated observation using arts or music vocabulary."],
      ["Practice one technique deliberately before creating.","Make two small trials and compare control, expression, or craftsmanship.","Technique trials with a chosen improvement."],
      ["Create an original response to the week's focus.","Use the chosen technique intentionally rather than copying a model.","Original work or performance draft with process note."],
      ["Critique and revise using one clear criterion.","Name what communicates well and change one element to strengthen the work.","Revision evidence and critique statement."],
      ["Present or respond and connect the work to context or purpose.","Explain one artistic choice and respond respectfully to another interpretation.","Final artifact or performance plus artist statement or reflection."]
    ],
    "health-pe-sel":[
      ["Establish the safety or wellness goal and accessible success criteria.","Demonstrate or describe safe form, boundaries, signals, or a self-management strategy.","Safety check plus personal or accessibility adaptation."],
      ["Break the skill or decision into observable steps.","Practice slowly with feedback and identify one body, health, or SEL cue.","Skill sequence or decision map with one cue."],
      ["Practice, measure, or role-play under changed conditions.","Record repetitions, duration, feelings, choices, or teamwork evidence as appropriate.","Simple performance or wellness data, or a scenario response."],
      ["Adapt for inclusion, teamwork, and real-life transfer.","Modify the task for a different ability, space, stressor, or partner need.","Adaptation plan and explanation."],
      ["Reflect on responsible independent use.","State what improved, what still needs practice, and a safe next step.","Reflection plus evidence of safe or healthy decision-making."]
    ],
    "technology-tools":[
      ["Define the tool goal, inputs, outputs, and safety or ethics boundary.","Trace or model the process before clicking or building.","Labeled process or algorithm with safety note."],
      ["Follow the procedure and verify each step.","Create a small file, table, sequence, algorithm, or digital or unplugged product.","Working practice artifact with correct sequence."],
      ["Debug a deliberate error or weak workflow.","Identify the failure point, change one step, and retest.","Before/after debug record."],
      ["Use the tool to solve a new information or creation problem.","Choose an appropriate tool or format and document source or data handling where relevant.","Independent product with source or data note."],
      ["Check accuracy, privacy, attribution, and usability.","Run a final verification checklist and explain one responsible-use decision.","Verified product plus ethical or digital-citizenship reflection."]
    ],
    "integrated-projects":[
      ["Define the problem or question, users, criteria, and constraints.","Turn the weekly theme into a specific project brief.","Project brief with question, criteria, constraints, and evidence plan."],
      ["Plan before building or researching.","Sketch, sequence, estimate, assign resources, and identify evidence needed.","Plan or model with labeled steps and resources."],
      ["Build, research, calculate, or investigate and record what happens.","Keep a process log rather than hiding mistakes or changes.","Prototype or research artifact plus process evidence."],
      ["Test against criteria, gather feedback, and revise.","Compare actual results to the goal and make one evidence-based improvement.","Test result, feedback, and revision record."],
      ["Present and defend the project across disciplines.","Explain how at least two subject areas contributed and what evidence supports success.","Final product plus short defense and next-step reflection."]
    ]
  };
  const normalized=subject==="technology"?"technology-tools":subject;
  const set=plans[normalized]||[
    ["Clarify the lesson goal and evidence standard.","Restate the focus in your own words and identify what success would look like.","Goal statement plus success criterion."],
    ["Study a model and compare examples.","Identify what makes one example stronger.","Comparison note."],
    ["Apply the focus independently.","Create a fresh response or product.","Independent evidence."],
    ["Review and revise.","Use feedback or criteria to improve the work.","Revision record."],
    ["Explain and reflect.","Defend the evidence and name the next step.","Portfolio reflection."]
  ];
  const row=set[Math.max(0,Math.min(4,dayIndex))];
  return {teacher:row[0]+" Focus: "+f+".",student:row[1],evidence:row[2]};
}

const DEPTH_BAND_08_12=Object.freeze({
  8:Object.freeze({label:"Compare, classify, and transfer patterns",proof:"Use two contrasted examples and explain the pattern, rule, message, or relationship that transfers."}),
  9:Object.freeze({label:"Measure, represent, and reason from evidence",proof:"Use a table, graph, labeled model, observation set, or other organized evidence before making a claim."}),
  10:Object.freeze({label:"Solve or build through multiple connected steps",proof:"Show the sequence of decisions, calculations, revisions, or causes rather than only the final answer."}),
  11:Object.freeze({label:"Use precise vocabulary, structure, and verification",proof:"Name the exact feature, term, coordinate, word part, procedure, or criterion and verify it with an example or check."}),
  12:Object.freeze({label:"Classify systems and synthesize relationships",proof:"Organize examples by defensible properties, then explain how categories, places, parts, or ideas connect."})
});

function weekThemeTitle(){
  const grade=routeGrade(),week=routeWeek();
  const raw=global.KhaemenesElementaryFocusMap?.[grade]?.[week]||document.querySelector("h1")?.textContent||"the weekly theme";
  return String(raw).split("·")[0].trim();
}

function depthBandPlan(subject,dayIndex,focus,grade,week){
  const f=String(focus||"the lesson focus").trim(),g=Number(grade)||2,w=Number(week)||8;
  const normalized=subject==="technology"?"technology-tools":subject;
  const theme=weekThemeTitle(),band=DEPTH_BAND_08_12[w]||DEPTH_BAND_08_12[8];
  const textSpan=g<=2?"60–100":g===3?"90–140":"120–180";
  const routines={
    "language-arts":[
      ["Model the exact literacy move on a "+textSpan+" word theme-aligned passage or teacher-created excerpt; mark the sentence, word part, structure, or detail that proves the move.","Annotate the model, then state what the marked evidence shows and why it matters.","Annotated passage plus one evidence-to-meaning sentence."],
      ["Contrast a strong example with a near-miss tied to the weekly theme; make the difference visible rather than merely naming it.","Complete two guided examples and correct the near-miss using precise vocabulary.","Two attempts plus an explicit correction and reason."],
      ["Transfer the skill to a fresh passage, prompt, caption, dialogue, or short source connected to the theme.","Work independently without copying the model; quote, paraphrase, or point to the exact evidence used.","Independent response with traceable textual or language evidence."],
      ["Conference on one weakness in accuracy, organization, evidence, sentence craft, or word choice; require a visible revision.","Revise one sentence or paragraph and explain exactly what changed and why the revision is stronger.","Before/after revision with a reason linked to a criterion."],
      ["Require a short defense of the week's strongest literacy artifact using the focus vocabulary.","Select one portfolio sample, explain the strategy used, and identify one next-step target.","Portfolio artifact plus defense and next-step reflection."]
    ],
    "mathematics":[
      ["Build one worked example tied to the weekly theme with quantities, labels, and at least two representations.","Explain what each number, symbol, unit, or geometric feature represents before computing.","Labeled model/equation plus a complete worked solution."],
      ["Use a parallel problem to compare two strategies or representations and discuss efficiency, precision, or reasonableness.","Solve the same mathematical idea a second way and compare the methods.","Two valid methods or representations with a comparison statement."],
      ["Present a deliberate misconception or incomplete solution connected to the focus and locate the exact failure point.","Correct the error, solve a fresh example, and verify the result with a second check.","Error analysis + corrected solution + verification."],
      ["Move to a multi-step application appropriate to Grade "+g+" and the weekly theme; require students to choose relevant information.","Solve, label units, show intermediate reasoning, and test whether the answer is reasonable.","Complete multi-step solution with units/model and reasonableness check."],
      ["Ask for a generalization: what rule, property, pattern, or relationship will still work in a new case?","State the generalization, test it on a fresh example, and defend it with numbers, models, or properties.","Generalization + fresh example + independent verification."]
    ],
    "science":[
      ["Turn the theme into an observable or testable question and model the difference between observation, measurement, and inference.","Identify what can be observed/measured and write one cautious prediction without presenting it as a result.","Question + prediction + observation/inference distinction."],
      ["Design a fair comparison, model, or evidence routine with named variables/conditions, units, materials, and safety boundaries.","Create a procedure or model and identify what data would support or challenge the idea.","Procedure/model with variables or conditions, units, and safety note."],
      ["Use a table, diagram, graph, or labeled model to organize evidence before explaining.","Record or interpret evidence, identify a pattern, and mark any data that do not fit the pattern.","Organized evidence record with pattern and anomaly note."],
      ["Construct a claim-evidence-reasoning explanation and actively test its weakness.","Use specific evidence, explain the link, and name a limitation, alternate explanation, or measurement weakness.","CER response with at least one limitation or competing explanation."],
      ["Revise the scientific model or explanation after comparing it with the week's evidence.","Correct one assumption, label, measurement, variable, or reasoning link and explain the improvement.","Revised model/explanation plus evidence-based reflection."]
    ],
    "arts-music":[
      ["Analyze a theme-aligned visual, musical, movement, or design model using discipline vocabulary; identify at least two intentional choices.","Mark or describe two choices in line, shape, color, rhythm, melody, texture, form, space, dynamics, or performance and connect them to purpose.","Annotated observation using correct arts/music vocabulary."],
      ["Demonstrate one technique, then make two controlled trials that vary a single artistic choice.","Practice twice, compare the effect, and select the stronger approach for the intended purpose.","Technique trials plus selection rationale."],
      ["Create an original response to the weekly theme using the chosen technique intentionally.","Produce a draft/performance without copying the model and keep a brief process note.","Original artifact/performance draft plus process evidence."],
      ["Critique against one explicit criterion and revise one element rather than simply decorating or restarting.","Use peer/self feedback to make one visible improvement and explain the change.","Revision evidence plus criterion-based critique statement."],
      ["Present or perform the final work and connect one artistic choice to audience, culture, function, or weekly theme.","Explain one intentional choice and respond respectfully to another interpretation.","Final artifact/performance plus artist statement or reflection."]
    ],
    "health-pe-sel":[
      ["Define the safety/wellness goal and demonstrate accessible success criteria before practice begins.","Identify the safe form, boundary, signal, decision step, or self-management strategy and choose an adaptation if needed.","Safety/wellness criterion plus accessibility adaptation."],
      ["Break the focus into observable steps and model one common error or unsafe choice.","Practice slowly with feedback and name one body, health, teamwork, or SEL cue that improves performance.","Skill/decision sequence plus cue and correction."],
      ["Change one condition—space, pace, partner, stressor, repetition, scenario, or available resource—and collect simple evidence.","Practice or role-play under the changed condition and record repetitions, duration, feelings, choices, or teamwork evidence.","Simple performance/wellness data or scenario record."],
      ["Require transfer to an inclusive real-life scenario and make adaptation part of the task.","Modify the skill/decision for a different ability, environment, partner need, or stress level and explain why.","Adaptation plan with safety/inclusion reasoning."],
      ["Close with responsible independent use rather than a score alone.","Identify what improved, what still needs practice, and one safe next action supported by evidence.","Reflection tied to safe/healthy decision-making evidence."]
    ],
    "technology-tools":[
      ["Define the information or creation goal, inputs, outputs, and privacy/safety/ethics boundary before using the tool.","Trace the process or algorithm on paper first and identify one place an error or privacy risk could occur.","Labeled workflow/algorithm plus safety or privacy note."],
      ["Model the procedure with verification after each meaningful step rather than click-following.","Create a small file, table, sequence, algorithm, chart, or unplugged product and check each step.","Working practice artifact with ordered procedure and verification marks."],
      ["Debug a deliberate weak workflow, inaccurate output, or unsafe data-handling example.","Identify the failure point, change one step, retest, and explain why the change worked.","Before/after debug record with explanation."],
      ["Use the tool to solve a new theme-aligned information or creation problem and document source/data handling.","Choose an appropriate tool/format, produce the result, and record how information or data were obtained and protected.","Independent product plus source/data-handling note."],
      ["Run an accuracy, privacy, attribution, accessibility, and usability review before calling the product finished.","Complete the verification checklist and defend one responsible-use decision.","Verified product plus digital-citizenship/ethics reflection."]
    ],
    "integrated-projects":[
      ["Translate the weekly theme into a specific user/problem brief with criteria, constraints, and an evidence plan.","Define who/what the project serves, what success means, and what limits must be respected.","Project brief with users, criteria, constraints, and evidence plan."],
      ["Plan before building: require a sketch, sequence, estimate, resource list, and at least one cross-subject connection.","Create the plan and identify what must be measured, read, calculated, tested, or researched.","Labeled plan/model with resources and cross-subject evidence needs."],
      ["Build, research, calculate, or investigate while preserving a process log, including mistakes and changes.","Produce a prototype/research artifact and record at least one decision change caused by evidence.","Prototype/research artifact plus process log and evidence-triggered change."],
      ["Test the product against explicit criteria, gather feedback/data, and revise one weak point.","Compare actual results to the goal and make one evidence-based improvement.","Test result + feedback/data + visible revision."],
      ["Present and defend the project using at least two disciplines and one limitation or next step.","Explain how the evidence demonstrates success, what remains uncertain, and what should improve next.","Final product + cross-disciplinary defense + limitation/next step."]
    ]
  };
  const rows=routines[normalized];
  if(!rows){
    const base=baseDepthPlan(subject,dayIndex,f,g);
    return {...base,theme,lens:band.label,proof:band.proof,band:"08-12-v1"};
  }
  const row=rows[Math.max(0,Math.min(4,dayIndex))];
  return {
    teacher:"Week "+String(w).padStart(2,"0")+" theme: "+theme+". Rigor lens: "+band.label+". "+row[0]+" Focus: "+f+".",
    student:row[1],
    evidence:row[2]+" "+band.proof,
    theme,
    lens:band.label,
    proof:band.proof,
    band:"08-12-v1"
  };
}

function depthPlan(subject,dayIndex,focus,grade){
  const week=routeWeek();
  if(week>=8&&week<=12)return depthBandPlan(subject,dayIndex,focus,grade,week);
  return baseDepthPlan(subject,dayIndex,focus,grade);
}
function addDepthStudio(article,index,focus,day){
  if(article.querySelector(".elementary-depth-studio"))return;
  if(/Depth Lab|Worked Studio|Applied Worked Studio|Academic Depth Lab|Practical Depth Lab/i.test(article.textContent||""))return;
  const plan=depthPlan(routeSubject(),index,focus,Number(routeGrade()));
  const section=document.createElement("section");
  section.className="elementary-depth-studio";
  section.setAttribute("aria-label","Instructional depth studio");
  if(plan.band)section.setAttribute("data-depth-band",plan.band);
  section.innerHTML='<h5>Instructional Depth Studio · '+esc(day)+'</h5><dl>'+(plan.theme?'<dt>Week theme</dt><dd>'+esc(plan.theme)+'</dd>':'')+(plan.lens?'<dt>Rigor lens</dt><dd>'+esc(plan.lens)+'</dd>':'')+'<dt>Teacher move</dt><dd>'+esc(plan.teacher)+'</dd><dt>Student task</dt><dd>'+esc(plan.student)+'</dd><dt>Evidence criterion</dt><dd>'+esc(plan.evidence)+'</dd></dl>';
  article.appendChild(section);
}

function enhanceArticle(article,index){
  if(article.dataset.elementaryLedgerEnhanced==="true")return;
  article.dataset.elementaryLedgerEnhanced="true";
  const focus=focusFor(article),day=dayLabel(article,index),key=`${routeGrade()}-${routeWeek()||0}-${routeSubject()}-${index+1}`;
  addDepthStudio(article,index,focus,day);
  const box=document.createElement("section");
  box.className="elementary-formative";
  box.innerHTML=`<h5>Lesson Checkpoint · ${esc(day)}</h5><p>Take a short randomized practice check and optionally reflect on your strategy. This saves learning evidence but never awards mastery.</p><button type="button" class="primary">Start 3-Question Check</button><div data-checkpoint-body></div>`;
  article.appendChild(box);
  box.querySelector("button").addEventListener("click",()=>startCheckpoint(box.querySelector("[data-checkpoint-body]"),{focus,day,key}));
}
function mountPageCheckpoint(){
  if(document.querySelector(".lesson")||document.getElementById("elementaryWeeklyCheckpoint"))return;
  if(!/\/weekly-plans\/week-\d+\.html$/i.test(location.pathname))return;
  const shell=document.querySelector("main .shell")||document.querySelector("main");
  if(!shell)return;
  const focus=(document.querySelector("h1")?.textContent||"")+" "+(document.querySelector(".heading p:last-child")?.textContent||"");
  const box=document.createElement("section");
  box.className="elementary-ledger-summary";
  box.id="elementaryWeeklyCheckpoint";
  box.innerHTML='<h3 style="margin-top:0;color:#173a5a">Weekly Formative Check</h3><p>Use this five-question randomized review before the formal weekly assessment. It records practice evidence only.</p><button type="button" class="primary">Start Weekly Review</button><div data-checkpoint-body></div>';
  shell.appendChild(box);
  box.querySelector("button").addEventListener("click",()=>{
    const factory=global.KhaemenesElementaryQuestionFactory;
    const questions=factory?.makeBalanced?.({grade:Number(routeGrade()),focus,seed:Date.now(),count:5})||[];
    renderQuestions(box.querySelector("[data-checkpoint-body]"),questions,{focus,day:"Weekly Review",key:`${routeGrade()}-${routeWeek()}-weekly-review`});
  });
}
function scan(){
  addStyle();
  const articles=[...document.querySelectorAll(".lesson")];
  articles.forEach(enhanceArticle);
  mountPageCheckpoint();
}
let scheduled=false;
function schedule(){
  if(scheduled)return;
  scheduled=true;
  setTimeout(()=>{scheduled=false;scan()},80);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
global.addEventListener("khaemenes-family-changed",schedule);

global.KhaemenesElementaryLearningLedger=Object.freeze({
  version:VERSION,
  key:LEDGER_KEY,
  records,
  recent,
  saveRecord,
  refresh:schedule,
  depthBand:Object.freeze({weeks:Object.freeze([8,9,10,11,12]),version:"08-12-v1",formativeOnly:true}),
  authority:Object.freeze({awardsMastery:false,changesScore:false,unlocksCurriculum:false,changesPlacement:false})
});
})(window);
