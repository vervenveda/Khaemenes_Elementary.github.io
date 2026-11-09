/* Supplemental Grade 4 instructional depth. No scores, storage, or unlock authority. */
(function(global){"use strict";
if(global.KhaemenesGrade4LateYearDepth)return;
const match=location.pathname.match(/\/grades\/grade-04\/subjects\/([a-z-]+)\/week-(\d{2})\.html$/i);
const N=match?Number(match[2]):0,subject=match?.[1]||"";
const SUBJECTS=Object.freeze(["language-arts","mathematics","science","social-studies","arts-music","health-pe-sel","technology-tools","integrated-projects"]);
const DATA={
19:["Model two miniature slopes: equal water and soil, different ground cover","18 g of loose material over three trials gives a mean of 6 g; that does not mean every trial lost exactly 6 g","Separate measured erosion from an explanation of its cause"],
20:["Examine a fictional rock-layer drawing without assigning calendar dates","A 120 cm profile with a mark 35 cm above the base leaves 85 cm to the top","Use relative position to make a cautious claim about sequence"],
21:["Compare two paper-building models under the same simulated disturbance","Seven barrier sections of 48 blocks need 336 blocks; check with 50 × 7 = 350","Explain why a model cannot predict real-world safety"],
22:["Compare labeled leaf or animal-structure diagrams with observations","Nine model stems with six leaves each contain 54 leaves","Explain a plausible function and label what remains untested"],
23:["Compare two attributed community sources without blending distinct Indigenous nations","A fictional map at 1 cm = 8 km represents 36 km for 4.5 cm","Identify whose perspective is present and whose is missing"],
24:["Compare two attributed historical accounts and their contexts","A timeline spanning 1640 to 1685 covers 45 years","Describe how perspective and missing voices limit an interpretation"],
25:["Compare regional resource and labor maps using carefully labeled historical evidence","A fictional trading route has legs of 12 km and 18 km, totaling 30 km","Distinguish economic data from claims about fairness or impact"],
26:["Compare a classroom rule, a right, and a responsibility with an example","Four committees with six members each would have 24 seats","Explain which decision-making power is actually supported by the source"],
27:["Build tenths and hundredths grids before reasoning about money","0.70 = 70/100 and 0.07 = 7/100, so 0.70 is ten times 0.07","Label every quantity and check decimals before drawing a conclusion"],
28:["Measure and compare repeated observations using a labeled table","250 cm equals 2.5 m; converting units must not change the measured length","Explain rounding, units, and the precision of each measurement"],
29:["Draw and classify rays, lines, angles, and reflection symmetry","A right angle measures 90 degrees; a 30-degree part leaves 60 degrees","Check definitions using labels rather than appearances alone"],
30:["Use a protractor to compare two measured angles and explain any discrepancy","35 degrees plus 55 degrees forms 90 degrees when adjacent without overlap","Verify with a second method and distinguish accuracy from precision"],
31:["Compare two expressive readings of the same original verse","Four 75-second scenes total 300 seconds; a six-minute slot leaves 60 seconds","Describe the audible or visible evidence for an interpretation"],
32:["Build a fictional project budget with all costs named","18 bookmarks sold at $3 yield $54; minus $21 materials leaves $33 before other expenses","Distinguish revenue, material margin, and net profit"],
33:["Build an accessible table from invented nonpersonal data","Values 12, 15, 9, 14 total 50; the mean is 12.5","Ask whether each chart claim has units, source and labeled axes"],
34:["Turn a broad community question into a feasible fictional inquiry","A 6.5 cm map path at 1 cm = 4 km represents 26 km in straight-line scale","Name a source, data method, uncertainty and privacy boundary"],
35:["Defend and revise a claim with two cited pieces of evidence","Fictional plans costing $48 and $63 differ by $15","Document a criticism, a revision and one unresolved limitation"],
36:["Select early and revised work as evidence of Grade 5 readiness","Six of eight skills evidenced is 75%; do not substitute this for formal 80% course gates","Use specific examples to distinguish growth from unverified mastery"]
};
const WORK={
"language-arts":["Write a claim with two explicitly identified evidence details; then revise for precise vocabulary.","Compare a descriptive sentence with an evidence-based one. Explain what a reader can verify.","Draft a six-sentence explanation with introduction, cited detail, limitation and conclusion."],
"mathematics":["Copy and label the worked calculation; show a second representation such as a table or diagram.","Solve a parallel problem with changed numbers, labeling units and showing a reasonableness check.","Explain a possible mistake in the model and correct it with mathematical evidence."],
"science":["Identify a testable question, independent variable and measured outcome for a safe paper/model investigation.","Record at least two observations in a table, then state a claim supported by those observations.","Name a control, limitation or confounding factor; do not claim the classroom model proves a real-world prediction."],
"social-studies":["Use two named and attributed sources; distinguish primary evidence from later interpretation.","Describe whose voices and communities are represented, and what missing context would change the claim.","Use accurate, respectful geographic and historical language; avoid invented testimony or treating nations as interchangeable."],
"arts-music":["Create a labeled sketch, rhythm, movement phrase or original composition that interprets the week's inquiry.","Compare two artistic choices using observable elements such as shape, contrast, rhythm, structure or pacing.","Document a revision with before/after evidence and explain why it improves communication."],
"health-pe-sel":["Design a safe, accessible, optional movement or decision-making scenario tied to the weekly theme.","Compare two strategies for well-being, cooperation or self-advocacy without requiring personal disclosure.","Use a fictional role-play to demonstrate respectful communication and describe an adjustment for accessibility."],
"technology-tools":["Build a local, nonpersonal table, accessible diagram or algorithm relevant to the weekly question.","Label data sources, units and limitations; test one cell, formula, or step against an expected result.","Revise the artifact to improve readability, keyboard access, privacy or error handling."],
"integrated-projects":["Set a clear inquiry question and plan a small model, product or presentation with documented sources.","Combine at least one quantitative check with one written or visual piece of evidence.","Keep a revision log with an initial claim, feedback, changed design and an honest limitation."]
};
function build(){
 const row=DATA[N],tasks=WORK[subject];if(!row||!tasks||!SUBJECTS.includes(subject)||document.getElementById("grade4LateYearDepth"))return;
 const host=document.querySelector("main .shell")||document.querySelector("main");if(!host)return;
 const sec=document.createElement("section");sec.className="card";sec.id="grade4LateYearDepth";
 sec.setAttribute("aria-label","Grade 4 worked learning and evidence studio");
 sec.style.cssText="margin:22px auto;padding:24px;border:2px solid #33352f;border-radius:7px;background:#f8f4ea;color:#292d28;font-size:16px;line-height:1.6";
 const title=document.createElement("h2");title.textContent="Week "+String(N).padStart(2,"0")+" · "+subject.replace(/-/g," ")+" · Worked Learning Studio";
 const lead=document.createElement("p");lead.textContent="Supplemental instruction only. This studio never changes scores, assessment gates, placement or portfolio approval.";
 const scenario=document.createElement("p");const strong=document.createElement("strong");strong.textContent="Concrete learning scenario: ";scenario.append(strong,document.createTextNode(row[0]+"."));
 const math=document.createElement("p");const mark=document.createElement("strong");mark.textContent="Worked quantitative reasoning: ";math.append(mark,document.createTextNode(row[1]+"."));
 const caution=document.createElement("p");const cm=document.createElement("strong");cm.textContent="Reasoning check: ";caution.append(cm,document.createTextNode(row[2]+"."));
 const heading=document.createElement("h3");heading.textContent="Three-step subject workshop";
 const ol=document.createElement("ol");
 tasks.forEach(t=>{const li=document.createElement("li");li.textContent=t;li.style.marginBottom="8px";ol.append(li)});
 const evidence=document.createElement("p");evidence.textContent="Portfolio evidence: keep an original draft or model, a labeled correction and a short explanation of the evidence. Save or submit through the Academy's existing authorized process; this studio does not record student data.";
 const nav=document.createElement("p");
 const a=document.createElement("a");a.href="../../weekly-plans/week-"+String(N).padStart(2,"0")+".html";a.textContent="Full week plan";
 const b=document.createElement("a");b.href="../../printables/week-"+String(N).padStart(2,"0")+"-packet.html";b.textContent="Weekly printable";b.style.marginLeft="18px";
 const c=document.createElement("a");c.href="../../assessments/week-"+String(N).padStart(2,"0")+"-assessment.html";c.textContent="Formal assessment";c.style.marginLeft="18px";
 nav.append(a,b,c);sec.append(title,lead,scenario,math,caution,heading,ol,evidence,nav);
 const first=host.querySelector(".lesson");if(first)host.insertBefore(sec,first);else host.append(sec);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build,{once:true});else build();
global.KhaemenesGrade4LateYearDepth=Object.freeze({version:"1.0.0",weeks:18,subjects:8,formativeOnly:true,doesNotStoreData:true});
})(window);
