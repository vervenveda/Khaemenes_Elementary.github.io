/*
 * Khaemenes Elementary Question Factory v1.0.0
 * ------------------------------------------------------------
 * First-party Monte Carlo question generation for Grades 01–05.
 * Questions are objectively keyed, generated from reviewed blueprints,
 * and support randomized variants without network dependencies.
 */
(function attachElementaryQuestionFactory(global){
"use strict";

const VERSION="1.0.0";
const SUBJECTS=["language-arts","mathematics","science","social-studies","arts-music","health-pe-sel","technology-tools","integrated-projects"];

function hash(text){
  let h=2166136261>>>0;
  for(const ch of String(text||"")){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
}
function rng(seed){
  let a=(Number(seed)>>>0)||0x9e3779b9;
  return function(){
    a|=0;a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296;
  };
}
function int(r,min,max){return Math.floor(r()*(max-min+1))+min}
function pick(r,arr){return arr[Math.floor(r()*arr.length)]}
function shuffle(r,arr){
  const out=arr.slice();
  for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
  return out;
}
function uniq(values){return [...new Set(values.map(v=>String(v)))]}
function normalizeSubject(value){
  const s=String(value||"").toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
  if(/language|reading|writing|literacy|ela/.test(s))return"language-arts";
  if(/math/.test(s))return"mathematics";
  if(/science|inquiry/.test(s))return"science";
  if(/social|civic|history|geograph|economic/.test(s))return"social-studies";
  if(/art|music/.test(s))return"arts-music";
  if(/health|physical|pe|sel|wellness/.test(s))return"health-pe-sel";
  if(/tech|digital|computer|tool/.test(s))return"technology-tools";
  if(/project|integrat|maker|engineer/.test(s))return"integrated-projects";
  return SUBJECTS.includes(s)?s:"language-arts";
}
function makeQuestion(prompt,correct,wrongs,meta={}){
  const options=uniq([correct,...wrongs]).slice(0,4);
  if(options.length!==4)throw new Error("Question requires four distinct options: "+prompt);
  return {
    id:meta.id||("q-"+hash(prompt+"|"+correct).toString(36)),
    prompt:String(prompt),
    correct:String(correct),
    options,
    subject:normalizeSubject(meta.subject),
    skill:String(meta.skill||""),
    grade:String(meta.grade||""),
    focus:String(meta.focus||""),
    rationale:String(meta.rationale||"")
  };
}
function finalizeQuestion(q,r){
  const options=shuffle(r,q.options);
  return {...q,options,answer:options.indexOf(q.correct)};
}
function numberBounds(grade){
  const g=Number(grade)||1;
  if(g<=1)return{add:10,sub:10,mul:0,place:100};
  if(g===2)return{add:100,sub:100,mul:0,place:1000};
  if(g===3)return{add:1000,sub:1000,mul:10,place:10000};
  if(g===4)return{add:10000,sub:10000,mul:12,place:1000000};
  return{add:1000000,sub:1000000,mul:20,place:10000000};
}
function wrongNumbers(correct,step=1){
  const c=Number(correct);
  const vals=[c-step,c+step,c+step*2,c-step*2,Math.max(0,c+10),Math.max(0,c-10)]
    .filter(v=>Number.isFinite(v)&&v!==c);
  return uniq(vals).slice(0,3);
}

/* ---------------- Mathematics ---------------- */
function mathAdd(r,g,focus){
  const b=numberBounds(g),a=int(r,1,Math.max(5,Math.floor(b.add*.65))),c=int(r,1,Math.max(4,Math.floor(b.add*.35))),sum=a+c;
  return makeQuestion(`What is ${a} + ${c}?`,sum,wrongNumbers(sum,Math.max(1,Math.floor(c/2))),{subject:"mathematics",skill:"addition",grade:g,focus,rationale:`${a} + ${c} = ${sum}.`});
}
function mathSubtract(r,g,focus){
  const b=numberBounds(g),a=int(r,4,b.sub),c=int(r,1,a),ans=a-c;
  return makeQuestion(`What is ${a} − ${c}?`,ans,wrongNumbers(ans,Math.max(1,Math.floor(c/3))),{subject:"mathematics",skill:"subtraction",grade:g,focus,rationale:`${a} − ${c} = ${ans}.`});
}
function mathMultiply(r,g,focus){
  const limit=Math.max(5,numberBounds(g).mul||5),a=int(r,2,limit),b=int(r,2,Math.min(limit,12)),ans=a*b;
  return makeQuestion(`What is ${a} × ${b}?`,ans,uniq([a+b,ans+a,Math.max(1,ans-b),a*b+1]).slice(0,3),{subject:"mathematics",skill:"multiplication",grade:g,focus,rationale:`${a} groups of ${b} equal ${ans}.`});
}
function mathDivide(r,g,focus){
  const divisor=int(r,2,Math.max(4,Math.min(12,numberBounds(g).mul||5))),quotient=int(r,2,Math.max(5,Math.min(12,numberBounds(g).mul||6))),dividend=divisor*quotient;
  return makeQuestion(`${dividend} objects are shared equally among ${divisor} groups. How many objects are in each group?`,quotient,uniq([divisor,dividend-divisor,quotient+divisor,Math.max(1,quotient-1)]).slice(0,3),{subject:"mathematics",skill:"division",grade:g,focus,rationale:`${dividend} ÷ ${divisor} = ${quotient}.`});
}
function mathPlaceValue(r,g,focus){
  const places=g<=1?[10,1]:g===2?[100,10,1]:g===3?[1000,100,10]:[10000,1000,100,10];
  const place=pick(r,places),digit=int(r,2,9),other=int(r,1,9),n=digit*place+other*Math.max(1,Math.floor(place/10))+int(r,0,9);
  const correct=digit*place;
  return makeQuestion(`In the number ${n.toLocaleString("en-US")}, what is the value of the digit ${digit} in the ${place===1?"ones":place===10?"tens":place===100?"hundreds":place===1000?"thousands":"ten-thousands"} place?`,correct,uniq([digit,correct*10,Math.max(1,correct/10),other*place]).slice(0,3),{subject:"mathematics",skill:"place value",grade:g,focus,rationale:`The digit ${digit} is worth ${correct.toLocaleString("en-US")} in that place.`});
}
function mathFraction(r,g,focus){
  const den=pick(r,g>=5?[4,5,6,8,10,12]:[2,3,4,6,8]),num=int(r,1,den-1),scale=pick(r,[2,3]),correct=`${num*scale}/${den*scale}`;
  return makeQuestion(`Which fraction is equivalent to ${num}/${den}?`,correct,[`${num+1}/${den}`,`${num}/${den+scale}`,`${num*scale}/${den}`],{subject:"mathematics",skill:"fractions",grade:g,focus,rationale:"Multiplying numerator and denominator by the same number creates an equivalent fraction."});
}
function mathPerimeter(r,g,focus){
  const a=int(r,2,g>=5?18:12),b=int(r,2,g>=5?14:10),p=2*(a+b);
  return makeQuestion(`A rectangle is ${a} units long and ${b} units wide. What is its perimeter?`,p,uniq([a*b,a+b,2*a+b,p+2]).slice(0,3),{subject:"mathematics",skill:"perimeter",grade:g,focus,rationale:`Perimeter is ${a}+${b}+${a}+${b}=${p}.`});
}
function mathArea(r,g,focus){
  const a=int(r,2,g>=5?15:10),b=int(r,2,g>=5?12:9),area=a*b;
  return makeQuestion(`A rectangle is ${a} units long and ${b} units wide. What is its area in square units?`,area,uniq([2*(a+b),a+b,area+a,Math.abs(a-b)]).slice(0,3),{subject:"mathematics",skill:"area",grade:g,focus,rationale:`Area is length × width, so ${a} × ${b} = ${area} square units.`});
}
function mathVolume(r,g,focus){
  const a=int(r,2,8),b=int(r,2,6),c=int(r,2,5),v=a*b*c;
  return makeQuestion(`A rectangular prism measures ${a} × ${b} × ${c} units. What is its volume?`,v,uniq([a*b,2*(a+b+c),a+b+c,v+a]).slice(0,3),{subject:"mathematics",skill:"volume",grade:g,focus,rationale:`Volume is ${a} × ${b} × ${c} = ${v} cubic units.`});
}
function mathTimeMoney(r,g,focus){
  if(g<=1){
    const start=pick(r,[1,2,3,4,5,6,7,8]),hours=int(r,1,3),end=((start-1+hours)%12)+1;
    return makeQuestion(`A lesson starts at ${start}:00 and lasts ${hours} hour${hours===1?"":"s"}. At what time does it end?`,`${end}:00`,[`${start}:30`,`${((end)%12)+1}:00`,`${Math.max(1,end-1)}:30`],{subject:"mathematics",skill:"time",grade:g,focus,rationale:`Counting forward ${hours} hour${hours===1?"":"s"} from ${start}:00 gives ${end}:00.`});
  }
  const pennies=int(r,1,9),dimes=int(r,1,5),total=pennies+dimes*10;
  return makeQuestion(`${dimes} dime${dimes===1?"":"s"} and ${pennies} penn${pennies===1?"y":"ies"} are worth how many cents?`,total,uniq([dimes+pennies,dimes*25+pennies,total+10,Math.max(1,total-10)]).slice(0,3),{subject:"mathematics",skill:"money",grade:g,focus,rationale:`Each dime is 10 cents, so ${dimes} × 10 + ${pennies} = ${total} cents.`});
}
const MATH_GENERATORS=[mathAdd,mathSubtract,mathPlaceValue,mathTimeMoney];
function mathGenerators(g,focus){
  const list=MATH_GENERATORS.slice(),f=String(focus||"").toLowerCase();
  if(g>=3)list.push(mathMultiply,mathDivide,mathFraction,mathPerimeter,mathArea);
  if(g>=5)list.push(mathVolume);
  if(/fraction/.test(f)&&g>=3)list.unshift(mathFraction,mathFraction);
  if(/area/.test(f)&&g>=3)list.unshift(mathArea);
  if(/perimeter/.test(f)&&g>=3)list.unshift(mathPerimeter);
  if(/volume/.test(f)&&g>=5)list.unshift(mathVolume,mathVolume);
  if(/place value|decimal/.test(f))list.unshift(mathPlaceValue,mathPlaceValue);
  if(/multipli/.test(f)&&g>=3)list.unshift(mathMultiply,mathMultiply);
  if(/divi/.test(f)&&g>=3)list.unshift(mathDivide,mathDivide);
  return list;
}

/* ---------------- Language Arts ---------------- */
const PASSAGES=[
  {text:"Maya planted three bean seeds. She watered them every morning and measured each stem on Friday. By the third week, two plants had grown taller than her ruler.",main:"Maya carefully observed and measured growing bean plants.",detail:"She measured the stems on Friday."},
  {text:"The class wanted a quieter reading corner. Students moved the supply bin, added two pillows, and made a sign reminding readers to whisper. More students began using the corner.",main:"The class improved its reading corner so it worked better.",detail:"Students added pillows and a whisper sign."},
  {text:"Eli tested two paper airplanes. One had wide wings and one had narrow wings. He launched both from the same line and recorded how far each flew.",main:"Eli compared two airplane designs using a fair test.",detail:"He launched both airplanes from the same line."},
  {text:"Nora read two articles about city parks. One described playgrounds and sports fields. The other explained how trees provide shade and habitats. She used both sources in her report.",main:"Nora combined information from two sources about city parks.",detail:"One article explained how trees provide shade and habitats."}
];
function elaCompleteSentence(r,g,focus){
  const correct=pick(r,["The careful reader rereads a confusing sentence.","Our class measured the plant every Friday.","I explained my strategy with a drawing.","The blue kite rose above the field."]);
  return makeQuestion("Which choice is a complete sentence?",correct,["Because the book was interesting.","Running quickly across the field.","The bright yellow and green.","After we finished the project."],{subject:"language-arts",skill:"complete sentence",grade:g,focus,rationale:"A complete sentence expresses a complete thought with a subject and predicate."});
}
function elaPunctuation(r,g,focus){
  const base=pick(r,[["Where did you put the map","?"],["Please bring your notebook","."],["What a surprising result","!"],["Can you explain your evidence","?"]]);
  const correct=base[0]+base[1];
  return makeQuestion("Which sentence has the correct ending punctuation?",correct,[base[0]+".",base[0]+"!",base[0]+","],{subject:"language-arts",skill:"punctuation",grade:g,focus,rationale:"The sentence type determines the correct ending punctuation."});
}
function elaAgreement(r,g,focus){
  const pair=pick(r,[["The student","explains","explain"],["My friends","explain","explains"],["The dog","runs","run"],["Those birds","fly","flies"]]);
  const correct=`${pair[0]} ${pair[1]} the idea clearly.`;
  return makeQuestion("Which sentence has correct subject–verb agreement?",correct,[`${pair[0]} ${pair[2]} the idea clearly.`,"The students explains the idea clearly.","My friend explain the idea clearly."],{subject:"language-arts",skill:"subject-verb agreement",grade:g,focus,rationale:"The verb must agree in number with its subject."});
}
function elaMainIdea(r,g,focus){
  const p=pick(r,PASSAGES);
  return makeQuestion(`Read the passage: “${p.text}” What is the main idea?`,p.main,[p.detail,"The passage is mainly a list of unrelated facts.","The passage explains why reading is always easy."],{subject:"language-arts",skill:"main idea",grade:g,focus,rationale:"The main idea states what the whole passage is mostly about."});
}
function elaEvidence(r,g,focus){
  const p=pick(r,PASSAGES);
  return makeQuestion(`Read the passage: “${p.text}” Which detail is direct evidence from the passage?`,p.detail,[p.main,"The writer probably visited the place yesterday.","Every student always agrees with the writer."],{subject:"language-arts",skill:"text evidence",grade:g,focus,rationale:"Direct evidence is a detail explicitly stated in the passage."});
}
function elaContext(r,g,focus){
  const item=pick(r,[
    ["The trail was narrow, so the hikers walked in a single line.","narrow","not wide",["very noisy","full of water","completely dark"]],
    ["Lena was reluctant to erase her drawing because she liked the first version.","reluctant","hesitant or unwilling",["eager to begin","unable to see","ready to celebrate"]],
    ["The glass was fragile, so Amir carried it with both hands.","fragile","easy to break",["very heavy","brightly colored","hard to find"]],
    ["The team revised its plan after the first design failed.","revised","changed to improve it",["hid forever","copied without thinking","celebrated before testing"]]
  ]);
  return makeQuestion(`In the sentence “${item[0]}” what does “${item[1]}” most nearly mean?`,item[2],item[3],{subject:"language-arts",skill:"context clues",grade:g,focus,rationale:"Context around the word provides clues to its meaning."});
}
function elaMorphology(r,g,focus){
  const item=pick(r,[
    ["unhelpful","un-","not","helpful again","full of help","before helping"],
    ["rebuild","re-","again","not","without","one who builds"],
    ["careless","-less","without","full of","again","before"],
    ["preview","pre-","before","after","not","many"]
  ]);
  return makeQuestion(`In the word “${item[0]},” what does the affix ${item[1]} mean?`,item[2],[item[3],item[4],item[5]],{subject:"language-arts",skill:"morphology",grade:g,focus,rationale:"Prefixes and suffixes change the meaning of a base word in predictable ways."});
}
function elaGenerators(g,focus){
  const list=[elaCompleteSentence,elaPunctuation,elaMainIdea,elaEvidence,elaContext];
  if(g>=2)list.push(elaAgreement);
  if(g>=3)list.push(elaMorphology,elaMainIdea,elaEvidence);
  const f=String(focus||"").toLowerCase();
  if(/evidence|source|informational/.test(f))list.unshift(elaEvidence,elaMainIdea);
  if(/vocab|morph|prefix|suffix/.test(f))list.unshift(g>=3?elaMorphology:elaContext,elaContext);
  if(/grammar|sentence/.test(f))list.unshift(elaAgreement,elaCompleteSentence);
  return list;
}

/* ---------------- Curated scenario banks ---------------- */
const SCIENCE=[
  {tags:"observation evidence inquiry",p:"A student sees water droplets on the outside of a cold cup. Which statement is an observation?",c:"Tiny drops of water are visible on the outside of the cup.",w:["The cup is sad because it is cold.","The water must have leaked through the solid cup.","The droplets prove the room has no water vapor."]},
  {tags:"experiment fair test variables",p:"Which change makes an investigation a fairer test?",c:"Change one tested variable while keeping other important conditions the same.",w:["Change several conditions at the same time.","Use a different measuring tool for every trial.","Record only the result you expected."]},
  {tags:"force motion",p:"What can a push or pull do to an object?",c:"Change its motion, direction, or speed.",w:["Remove all of its mass.","Guarantee that it becomes warmer.","Make gravity stop acting on it."]},
  {tags:"matter properties",p:"Which property can be observed or measured to compare materials?",c:"Mass, color, texture, or volume.",w:["How much the material likes a person.","Whether the material has a favorite number.","Whether the material remembers yesterday."]},
  {tags:"ecosystem energy food web",p:"In a food chain, what is the main role of a producer such as a green plant?",c:"Use light energy to make food.",w:["Eat every consumer in the ecosystem.","Break down only nonliving rocks.","Receive all energy directly from animals."]},
  {tags:"weather climate",p:"Which tool is best suited for measuring air temperature?",c:"A thermometer.",w:["A ruler.","A balance.","A compass."]},
  {tags:"water cycle",p:"What happens during evaporation?",c:"Liquid water changes into water vapor.",w:["Water vapor changes directly into soil.","Ice becomes a living organism.","Rainwater loses all matter."]},
  {tags:"earth space moon",p:"Why does the Moon appear to change shape during the month?",c:"We see different portions of its sunlit half as it orbits Earth.",w:["The Moon physically loses pieces each week.","Clouds permanently cover exact parts of the Moon.","Earth's shadow causes every regular lunar phase."]},
  {tags:"life cycle plant",p:"What do most plant seeds need in order to begin germinating?",c:"Suitable water, temperature, and air conditions.",w:["Moonlight only.","Salt water only.","A flower already growing from the seed."]},
  {tags:"energy transfer",p:"Which example shows energy being transferred?",c:"A warmer object warms a cooler object that touches it.",w:["A measurement label changes from cm to m.","A shadow becomes a solid object.","A rock creates energy from nothing."]},
  {tags:"conservation mixture",p:"Which statement best describes a mixture?",c:"Two or more substances are combined but can retain their own properties.",w:["A mixture always becomes a brand-new element.","A mixture has no measurable mass.","A mixture can never be separated."]}
];
const SOCIAL=[
  {tags:"map geography",p:"Which map feature explains what symbols and colors mean?",c:"The legend or key.",w:["The title page number.","The author's signature.","The paper margin."]},
  {tags:"map direction",p:"On a standard map with north at the top, which direction is to the right?",c:"East.",w:["West.","North.","Southwest only."]},
  {tags:"civics government",p:"Which action is an example of civic participation?",c:"Learning about an issue and communicating respectfully with public officials.",w:["Ignoring every community rule.","Changing an election result by yourself.","Preventing others from expressing lawful views."]},
  {tags:"economics needs wants",p:"Which item is most clearly a basic need rather than a want?",c:"Safe drinking water.",w:["A second video game controller.","A decorative sticker pack.","A collectible toy."]},
  {tags:"economics producer consumer",p:"A bakery makes bread and sells it to customers. In this example, the bakery is primarily a:",c:"Producer.",w:["Consumer only.","Mapmaker.","Weather station."]},
  {tags:"history source evidence",p:"Which source is a primary source for studying a past event?",c:"A diary written by a person who experienced the event.",w:["A modern textbook summary written much later.","A fictional story loosely inspired by the period.","An advertisement for an unrelated product."]},
  {tags:"geography human environment",p:"Which example shows people adapting to their environment?",c:"Building homes suited to local weather conditions.",w:["Making the Sun rise later.","Stopping all rivers from flowing naturally.","Changing Earth's rotation."]},
  {tags:"civics rules responsibility",p:"Why do communities create rules and laws?",c:"To organize shared life, protect rights, and address common needs.",w:["To eliminate every disagreement.","To guarantee everyone makes identical choices.","To prevent people from learning about government."]},
  {tags:"economics trade",p:"Why do people and communities trade?",c:"They can exchange goods or services to meet needs and wants.",w:["Trade makes all resources unlimited.","Trade removes every cost from production.","Trade means no one produces anything."]}
];
const ARTS=[
  {tags:"art composition",p:"Which choice best describes composition in visual art?",c:"How visual elements are arranged within a work.",w:["The price of the art supplies.","The age of the artist only.","The name of the building where art is displayed."]},
  {tags:"art color",p:"Which pair contains two primary colors in traditional pigment mixing?",c:"Red and blue.",w:["Green and orange.","Purple and green.","Orange and purple."]},
  {tags:"music rhythm",p:"What does rhythm describe in music?",c:"Patterns of long and short sounds and silences.",w:["Only how expensive an instrument is.","The color of printed sheet music.","The location of the audience."]},
  {tags:"music tempo",p:"What does tempo tell a musician?",c:"How fast or slow the music should go.",w:["Which color to paint an instrument.","How many pages are in a songbook.","Where the concert building is located."]},
  {tags:"design critique",p:"Which feedback is most useful during a design critique?",c:"“The title is hard to read from far away; increasing contrast may help.”",w:["“I don't like it.”","“Make everything different.”","“It is perfect because I said so.”"]},
  {tags:"pattern",p:"Which description best defines a repeating pattern?",c:"A sequence or design unit that occurs again in a predictable way.",w:["A mark that appears only once.","A random change with no relationship.","A page with no visual elements."]}
];
const HEALTH=[
  {tags:"health safety",p:"What is the safest first response when a classroom activity feels physically unsafe?",c:"Stop and tell a trusted adult or teacher.",w:["Keep going so no one notices.","Hide the unsafe condition.","Encourage others to copy the unsafe action."]},
  {tags:"physical activity fitness",p:"What usually happens to heart rate during moderate physical activity?",c:"It increases to help deliver more oxygen to working muscles.",w:["It always becomes zero.","It stops changing for the entire day.","It proves a person should never rest."]},
  {tags:"nutrition",p:"Which choice best supports a balanced eating pattern?",c:"Choosing a variety of nutritious foods and appropriate portions.",w:["Eating only one food every day.","Skipping water whenever active.","Choosing foods only by package color."]},
  {tags:"sel emotion regulation",p:"Which strategy can help when frustration is making it hard to think?",c:"Pause, breathe slowly, name the feeling, and choose a next step.",w:["Break nearby materials.","Pretend the feeling can never change.","Blame the nearest person immediately."]},
  {tags:"teamwork",p:"Which behavior supports productive teamwork?",c:"Listen to ideas, share responsibilities, and communicate respectfully.",w:["Interrupt every speaker.","Refuse every assigned role.","Hide information the group needs."]},
  {tags:"movement coordination",p:"Why is warming up before vigorous movement useful?",c:"It gradually prepares the body for more demanding activity.",w:["It guarantees no injury can ever occur.","It replaces the need for hydration.","It permanently increases height."]}
];
const TECH=[
  {tags:"files organization",p:"Which filename is most useful for finding a school document later?",c:"science-plant-observation-week07.txt",w:["newfile.txt","stuff-final-final2.txt","document.txt"]},
  {tags:"digital citizenship privacy",p:"Which information should generally be kept private online?",c:"A password used to access an account.",w:["The title of a public class project.","A teacher-approved public resource name.","The name of a school subject."]},
  {tags:"algorithm coding sequence",p:"What is an algorithm?",c:"A clear sequence of steps for completing a task or solving a problem.",w:["A random collection of unrelated clicks.","A type of computer screen.","A password shared with everyone."]},
  {tags:"data table",p:"Why are headings useful in a data table?",c:"They identify what each row or column represents.",w:["They make every number larger.","They automatically prove a conclusion.","They replace the need to record data."]},
  {tags:"source evaluation",p:"Which action helps evaluate an online source?",c:"Check the author, evidence, date, and purpose.",w:["Trust it only because it appears first.","Assume every image proves the claim.","Ignore whether the information is current."]},
  {tags:"keyboard fluency",p:"Which habit supports accurate keyboarding?",c:"Use a comfortable posture and focus on accuracy before speed.",w:["Hit keys as hard as possible.","Look away from the screen for the entire task.","Use only one finger because speed is the only goal."]}
];
const PROJECTS=[
  {tags:"planning inquiry",p:"What is a strong first step in an inquiry project?",c:"Define a clear question or problem to investigate.",w:["Choose the final conclusion before researching.","Skip planning and collect random materials.","Copy another person's project without checking it."]},
  {tags:"evidence revision",p:"What should a learner do when evidence does not support the first idea?",c:"Revise the explanation or investigate further.",w:["Delete the evidence.","Keep the first claim no matter what.","Change the data so it matches the claim."]},
  {tags:"engineering design",p:"What is a useful step after testing a prototype?",c:"Use the results to identify improvements and revise the design.",w:["Assume the first design can never improve.","Throw away all test notes.","Change every variable without recording anything."]},
  {tags:"portfolio reflection",p:"Which reflection best shows learning growth?",c:"“My first model tipped over, so I widened the base and the second test was more stable.”",w:["“I finished.”","“Nothing changed.”","“I used blue paper.”"]},
  {tags:"collaboration",p:"Which practice strengthens a group project?",c:"Agree on roles, share evidence, and document important decisions.",w:["Let one person do all thinking silently.","Hide changes from teammates.","Skip checking whether everyone understands the plan."]},
  {tags:"citation research",p:"Why should a student note where research information came from?",c:"So evidence can be traced and credit can be given to sources.",w:["So the source becomes automatically correct.","So no one needs to compare sources.","So the project does not need original thinking."]}
];

function scenarioGenerators(subject,focus){
  const source=subject==="science"?SCIENCE:subject==="social-studies"?SOCIAL:subject==="arts-music"?ARTS:subject==="health-pe-sel"?HEALTH:subject==="technology-tools"?TECH:PROJECTS;
  const f=String(focus||"").toLowerCase();
  const preferred=source.filter(item=>item.tags.split(/\s+/).some(tag=>tag.length>3&&f.includes(tag)));
  return preferred.length?[...preferred,...source]:source;
}
function scenarioQuestion(r,g,subject,focus){
  const item=pick(r,scenarioGenerators(subject,focus));
  return makeQuestion(item.p,item.c,item.w,{subject,skill:item.tags.split(" ")[0],grade:g,focus,rationale:"The correct choice follows the grade-appropriate concept described in the question."});
}

function legacyGrade1Questions(scope,week){
  const C=global.KHAEMENES_GRADE01_CURRICULUM;
  if(!C)return[];
  let list=[];
  if(scope==="weekly")list=C.weeks?.find(w=>Number(w.week)===Number(week))?.quiz||[];
  if(scope==="midterm")list=C.midterm?.questions||[];
  if(scope==="final")list=C.final?.questions||[];
  return list.filter(q=>q&&Array.isArray(q.choices)&&q.choices.length===4&&Number.isInteger(q.answer)).map((q,i)=>makeQuestion(
    q.prompt,q.choices[q.answer],q.choices.filter((_,idx)=>idx!==q.answer),
    {subject:"integrated-projects",skill:"course review",grade:"01",focus:`Grade 01 ${scope}`,id:`g1-${scope}-${week||0}-${i+1}`,rationale:"This question comes from the reviewed Grade 01 curriculum bank."}
  ));
}

function generatorsFor(subject,g,focus){
  subject=normalizeSubject(subject);
  if(subject==="mathematics")return mathGenerators(Number(g),focus);
  if(subject==="language-arts")return elaGenerators(Number(g),focus);
  return [function(r,grade,f){return scenarioQuestion(r,grade,subject,f)}];
}
function makePool({grade=1,subject="language-arts",focus="",seed=1,count=12}={}){
  const g=Math.max(1,Math.min(5,Number(grade)||1)),s=normalizeSubject(subject),r=rng(hash(`${seed}|${g}|${s}|${focus}`));
  const gens=generatorsFor(s,g,focus),out=[],seen=new Set();
  let guard=0;
  while(out.length<count&&guard<count*30){
    guard++;
    const gen=pick(r,gens);
    let q;
    try{q=gen(r,g,focus)}catch{continue}
    if(!q||seen.has(q.prompt))continue;
    seen.add(q.prompt);out.push(finalizeQuestion(q,r));
  }
  return out;
}
function makeBalanced({grade=1,focus="",seed=1,count=16,includeLegacy=false,scope="weekly",week=null}={}){
  const g=Math.max(1,Math.min(5,Number(grade)||1)),r=rng(hash(`balanced|${seed}|${g}|${scope}|${week||0}|${focus}`)),out=[];
  if(includeLegacy&&g===1){
    const legacy=legacyGrade1Questions(scope,week);
    out.push(...shuffle(r,legacy).slice(0,Math.min(6,legacy.length)).map(q=>finalizeQuestion(q,r)));
  }
  let cursor=0,guard=0;
  while(out.length<count&&guard<count*20){
    guard++;
    const subject=SUBJECTS[cursor++%SUBJECTS.length];
    const candidates=makePool({grade:g,subject,focus,seed:Math.floor(r()*1e9),count:4});
    const next=candidates.find(q=>!out.some(existing=>existing.prompt===q.prompt));
    if(next)out.push(next);
  }
  return shuffle(r,out).slice(0,count);
}
function validateQuestion(q){
  if(!q||typeof q.prompt!=="string"||!q.prompt.trim())return false;
  if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4)return false;
  if(!Number.isInteger(q.answer)||q.answer<0||q.answer>3)return false;
  return q.options[q.answer]===q.correct;
}

global.KhaemenesElementaryQuestionFactory=Object.freeze({
  version:VERSION,
  subjects:SUBJECTS.slice(),
  normalizeSubject,
  makePool,
  makeBalanced,
  legacyGrade1Questions,
  validateQuestion
});
})(typeof globalThis!=="undefined"?globalThis:window);
