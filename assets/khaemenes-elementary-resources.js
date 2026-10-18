/*
 * Khaemenes Elementary · Shared Learning Resource Registry v1.0.0
 * One first-party registry for Grades 01–05 Mentor/family support matching.
 */
(function attachElementaryResources(global){
"use strict";
const VERSION="1.0.0";
const defs=[
{id:"art-studio",title:"Bazaar Junior Art Studio",icon:"🎨",path:"games/bazaarart-jr-studio/",domains:["arts","design"],skills:["art","color","symmetry","composition","pattern"],modes:["create","explore"]},
{id:"curiosity-machine",title:"Curiosity Machine",icon:"💭",path:"games/curiosity-machine/",domains:["science","literacy"],skills:["prediction","observation","testing","explanation","reflection","writing"],modes:["explore","practice"]},
{id:"geometry",title:"Shape Garden Academy",icon:"🔷",path:"games/elementary_geometry/",domains:["mathematics"],skills:["geometry","shape","spatial","angle","measurement"],modes:["practice","play"]},
{id:"vocabulary",title:"Vocabulary Garden Academy",icon:"🌿",path:"games/elementary_vocabulary_garden/",domains:["literacy"],skills:["vocabulary","context-clues","synonyms","antonyms","roots","reading"],modes:["practice","review"]},
{id:"weather",title:"Solanar for Kids",icon:"🌦️",path:"games/elementary_weather_portal/",domains:["science"],skills:["weather","climate","observation","data","earth-science"],modes:["explore","practice"]},
{id:"emotional-garden",title:"Noetic Elementary Psychology Garden",icon:"💛",path:"games/emotional_garden/",domains:["wellness","sel"],skills:["feelings","self-awareness","reflection","regulation"],modes:["reflect","reset"]},
{id:"force-motion",title:"Force & Motion Ramp Lab",icon:"🛹",path:"games/force-motion-ramp-lab-k-5/",domains:["science","engineering","mathematics"],skills:["force","motion","experiment","data","graphing"],modes:["explore","practice"]},
{id:"fractions",title:"Fraction Picnic",icon:"🍕",path:"games/fraction-picnic-k-5/",domains:["mathematics"],skills:["fraction","equivalence","visual-model","division"],modes:["practice","play"]},
{id:"journal",title:"My School Year · Journal & Yearbook",icon:"📓",path:"games/journal-yearbook/",domains:["literacy","reflection"],skills:["writing","reflection","memory","portfolio"],modes:["create","reflect"]},
{id:"city-council",title:"Junior City Council",icon:"🏛️",path:"games/jr-city-council/",domains:["social-studies","civics"],skills:["civics","government","viewpoint","reasoning","voting"],modes:["explore","practice"]},
{id:"engineer",title:"Junior Engineer Studio",icon:"🛠️",path:"games/junior-engineer-studio/",domains:["engineering","technology"],skills:["engineering","design","problem-solving","prototype"],modes:["create","explore"]},
{id:"voting",title:"Kids Voting App",icon:"🗳️",path:"games/kids-voting-app/",domains:["social-studies","civics"],skills:["voting","choice","citizenship","civics"],modes:["explore","practice"]},
{id:"kindness",title:"Kindness Quest Academy",icon:"🤝",path:"games/kindness_quest/",domains:["sel","community"],skills:["kindness","service","reflection","empathy"],modes:["practice","reflect"]},
{id:"new-word",title:"Enchanted Word Garden",icon:"📚",path:"games/learn_a_new_word/",domains:["literacy"],skills:["vocabulary","word-learning","reading","language"],modes:["practice","explore"]},
{id:"kitchen",title:"Little Kitchen Helper",icon:"🥣",path:"games/little_kitchen_helper/",domains:["life-skills","mathematics"],skills:["measurement","sequence","safety","responsibility"],modes:["practice","create"]},
{id:"moon",title:"Moon Adventure · Lunar Phase Explorer",icon:"🌙",path:"games/lunar_phase_explorer/",domains:["science"],skills:["moon","space","phase","observation","pattern"],modes:["explore","practice"]},
{id:"math-market",title:"Math Market",icon:"🛒",path:"games/math-market/",domains:["mathematics"],skills:["money","addition","subtraction","multiplication","number-sense"],modes:["practice","play"]},
{id:"movement",title:"Movement Mission Generator",icon:"🏃",path:"games/movement-mission-generator/",domains:["movement","wellness"],skills:["movement","balance","coordination","fitness"],modes:["reset","practice"]},
{id:"number-bonds",title:"Number Bonds Garden",icon:"🌱",path:"games/number-bonds-garden/",domains:["mathematics"],skills:["number-bonds","addition","subtraction","number-sense"],modes:["practice","play"]},
{id:"number-forge",title:"Number Forge",icon:"🔨",path:"games/number-forge/",domains:["mathematics"],skills:["number-sense","operations","place-value","fluency"],modes:["practice","review"]},
{id:"observation",title:"Observation Lab",icon:"🔬",path:"games/observation-lab/",domains:["science","literacy"],skills:["observation","evidence","description","inference"],modes:["explore","practice"]},
{id:"pattern-coder",title:"Pattern Coder",icon:"🤖",path:"games/pattern-coder/",domains:["technology","mathematics"],skills:["pattern","coding","logic","sequence"],modes:["practice","create"]},
{id:"sound-builder",title:"Sound Builder / CVC Word Lab",icon:"🔤",path:"games/sound-builder-cvc/",domains:["literacy"],skills:["phonics","cvc","sound","spelling","decoding"],modes:["practice","play"]},
{id:"rhythm",title:"Sound & Rhythm Lab",icon:"🥁",path:"games/sound-rhythm-lab/",domains:["arts","music"],skills:["rhythm","sound","pattern","music"],modes:["create","practice"]},
{id:"story-problem",title:"Story Problem Studio",icon:"📖",path:"games/story-problem-studio/",domains:["mathematics","literacy"],skills:["word-problem","reasoning","operations","reading"],modes:["practice","review"]},
{id:"story-seed",title:"Story Seed Garden",icon:"🌱",path:"games/story-seed-garden/",domains:["literacy","arts"],skills:["writing","storytelling","sequence","character","description"],modes:["create","practice"]},
{id:"clock-lab",title:"Time Traveler Clock Lab",icon:"🕰️",path:"games/time-traveler-clock-lab/",domains:["mathematics"],skills:["time","clock","elapsed-time","number-sense"],modes:["practice","play"]},
{id:"word-detective",title:"Word Detective",icon:"🔎",path:"games/word-detective/",domains:["literacy"],skills:["vocabulary","context-clues","morphology","reading"],modes:["practice","review"]}
];
const clean=v=>String(v??"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function score(item,text,preferred=""){
 const hay=clean(text+" "+preferred),terms=new Set(hay.split(/\s+/).filter(Boolean));let s=0;
 for(const d of item.domains)if(hay.includes(clean(d)))s+=7;
 for(const k of item.skills){const parts=clean(k).split(/\s+/);if(parts.some(p=>terms.has(p)))s+=3;if(hay.includes(clean(k)))s+=4}
 if(preferred&&clean(item.domains.join(" ")).includes(clean(preferred)))s+=8;
 return s;
}
function match(text="",preferred="",limit=4){
 return defs.map(item=>({item,score:score(item,text,preferred)}))
  .sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title))
  .filter(x=>x.score>0).slice(0,Math.max(1,Number(limit)||4)).map(x=>({...x.item,matchScore:x.score}));
}
global.KhaemenesElementaryResources=Object.freeze({version:VERSION,all:()=>defs.map(x=>({...x})),byId:id=>defs.find(x=>x.id===id)||null,match});
})(window);
