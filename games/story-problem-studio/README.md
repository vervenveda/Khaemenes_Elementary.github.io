from pathlib import Path
import re, subprocess, json, textwrap

base = Path("/mnt/data")
index_path = base / "story-problem-studio-index.html"
readme_path = base / "STORY_PROBLEM_STUDIO_README.md"

html = r'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Story Problem Studio — a sovereign, dependency-free second-grade math and language-arts game for solving, creating, saving, drawing, and printing illustrated word problems.">
<meta name="theme-color" content="#5d4ba6">
<title>Story Problem Studio 📖➕ · Khaemenes Second Grade</title>
<style>
:root{
  --ink:#25334a;--muted:#68758a;--paper:#fffdf8;--cream:#fff7dd;
  --plum:#5d4ba6;--violet:#7c67c9;--pink:#e978a4;--blue:#55aee0;
  --sky:#e7f7ff;--gold:#f1c75d;--orange:#ef9350;--green:#58b97b;
  --mint:#e7f7ec;--rose:#eb718e;--line:rgba(37,51,74,.14);
  --shadow:0 20px 50px rgba(70,56,122,.14);
  --serif:Georgia,"Times New Roman",serif;--sans:"Trebuchet MS","Segoe UI",Arial,sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;min-height:100vh;color:var(--ink);font:17px/1.55 var(--sans);
  background:
    radial-gradient(circle at 8% 3%,rgba(241,199,93,.28),transparent 23rem),
    radial-gradient(circle at 94% 4%,rgba(85,174,224,.22),transparent 27rem),
    linear-gradient(180deg,#edf9ff 0,#fffdf8 33rem,#f8f5ff 100%)
}
button,input,select,textarea{font:inherit}
button{cursor:pointer;touch-action:manipulation}
:focus-visible{outline:3px solid rgba(124,103,201,.42);outline-offset:3px}
.shell{width:min(calc(100% - 24px),1220px);margin:auto}
.hidden{display:none!important}

header{
  position:sticky;top:0;z-index:80;background:rgba(255,253,248,.95);
  border-bottom:1px solid var(--line);backdrop-filter:blur(14px)
}
.nav{min-height:74px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px}
.brand{display:flex;align-items:center;gap:10px;text-align:left}
.brand-mark{
  width:50px;height:50px;display:grid;place-items:center;border-radius:16px;border:3px solid #fff;
  background:linear-gradient(145deg,var(--gold),var(--pink));box-shadow:var(--shadow);font-size:1.55rem
}
.brand strong{display:block;color:var(--plum);font:700 1.08rem var(--serif)}
.brand small{display:block;color:var(--muted);font-size:.66rem;letter-spacing:.09em;text-transform:uppercase}
.header-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}
.header-actions button{
  min-height:40px;padding:8px 11px;border:1px solid var(--line);
  border-radius:12px;background:#fff;color:var(--plum);font-weight:850
}

.hero{padding:36px 0 24px}
.hero-card{
  overflow:hidden;padding:28px 20px;border:4px solid #fff;border-radius:28px;color:#fff;text-align:center;
  background:
    radial-gradient(circle at 18% 20%,rgba(255,255,255,.24),transparent 13rem),
    linear-gradient(135deg,#425e9b,#6551ad 58%,#c25d92);
  box-shadow:var(--shadow)
}
.eyebrow{
  display:inline-flex;gap:7px;align-items:center;padding:7px 11px;border-radius:999px;
  background:rgba(255,255,255,.14);font-size:.74rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase
}
h1,h2,h3,h4{font-family:var(--serif);font-weight:700;text-wrap:balance}
h1{margin:10px auto 4px;max-width:960px;font-size:clamp(2.9rem,7vw,5.3rem);line-height:.96}
.hero p{max-width:850px;margin:10px auto 0;color:#f7f4ff}
.hero-badges{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-top:14px}
.hero-badges span{padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.23);font-size:.72rem;font-weight:800}

.layout{display:grid;grid-template-columns:minmax(0,1.48fr) minmax(310px,.52fr);gap:14px;align-items:start;padding-bottom:46px}
.card{background:rgba(255,255,255,.96);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow)}
.main{padding:16px}
.side{padding:15px;position:sticky;top:90px}
.toolbar{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.control{padding:10px;border:1px solid var(--line);border-radius:14px;background:#fbfdff}
.control label{display:block;margin-bottom:4px;color:var(--muted);font-size:.68rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
.control select{width:100%;padding:8px 9px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.control-value{font-size:1.25rem;font-weight:900;color:var(--plum)}

.story-card{margin-top:12px;padding:16px;border:2px solid #e8d98e;border-radius:19px;background:linear-gradient(145deg,#fff9d9,#fffef9)}
.story-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.story-label{color:#806420;font-size:.7rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
.story-text{margin:10px auto 0;max-width:900px;text-align:center;font:700 clamp(1.25rem,3vw,1.75rem)/1.5 var(--serif);color:#33465e}
.scene{margin-top:14px;min-height:185px;padding:16px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;border-radius:18px;background:linear-gradient(180deg,#e8f8ff,#f6fbff);border:1px solid #cde8f3}
.scene-group{min-width:130px;min-height:120px;padding:10px;display:grid;place-items:center;align-content:center;border-radius:16px;background:#fff;border:1px solid var(--line)}
.scene-character{font-size:2.4rem}.scene-objects{font-size:1.65rem;line-height:1.55;letter-spacing:.08em;max-width:260px;word-break:break-word}
.scene-caption{margin-top:5px;color:var(--muted);font-size:.76rem;font-weight:800}.scene-arrow{font-size:2rem;color:var(--violet)}
.problem-equation{margin-top:12px;text-align:center;font:800 clamp(1.8rem,5vw,3rem)/1.1 var(--serif);color:var(--plum)}

.answer-panel{margin-top:12px;padding:13px;border-radius:16px;background:#f6f8fb;border:1px solid var(--line)}
.answer-row{display:grid;grid-template-columns:1fr auto;gap:8px}
.answer-row input{min-height:48px;padding:9px 12px;border:2px solid #c8d3df;border-radius:12px;font-size:1.2rem;text-align:center;font-weight:900}
.feedback{min-height:32px;margin-top:8px;text-align:center;font-weight:900;color:var(--muted)}
.feedback.good{color:#2e8a50}.feedback.try{color:#a36827}
.actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:10px}
.btn{min-height:44px;padding:9px 13px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--plum);font-weight:900}
.btn.primary{color:#fff;background:linear-gradient(145deg,var(--plum),var(--violet));border-color:transparent}
.btn.gold{color:#614918;background:linear-gradient(145deg,#ffeb9c,var(--gold));border-color:#e5c55f}
.btn.green{color:#fff;background:linear-gradient(145deg,var(--green),#408e5b);border-color:transparent}
.btn.blue{color:#fff;background:linear-gradient(145deg,var(--blue),#437ebd);border-color:transparent}
.btn.pink{color:#fff;background:linear-gradient(145deg,var(--pink),var(--rose));border-color:transparent}

.save-strip{margin-top:12px;padding:11px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,#f8fff8,#fff9e8)}
.save-strip strong{display:block;color:#466d51;text-align:center}
.save-status{min-height:1.2em;margin-top:6px;text-align:center;color:var(--muted);font-size:.78rem}

.tabs{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px}
.tab{min-height:42px;padding:8px 12px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--plum);font-weight:900}
.tab.active{color:#fff;background:linear-gradient(145deg,var(--violet),var(--pink));border-color:transparent}
.workspace{display:none;margin-top:12px}.workspace.active{display:block}

.canvas-wrap{padding:12px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#fff,#fbf8ff)}
.canvas-toolbar{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-bottom:9px}
.canvas-toolbar label{display:flex;align-items:center;gap:5px;padding:7px 9px;border:1px solid var(--line);border-radius:10px;background:#fff;font-size:.78rem;font-weight:800}
canvas{width:100%;height:330px;display:block;border:2px solid #d9d2eb;border-radius:14px;background:#fff;touch-action:none}
.canvas-note{margin:8px 0 0;color:var(--muted);font-size:.78rem;text-align:center}

.creator{padding:14px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#fff,#fff9e6)}
.creator-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.creator-field{padding:9px;border:1px solid var(--line);border-radius:12px;background:#fff}
.creator-field label{display:block;margin-bottom:4px;color:var(--muted);font-size:.68rem;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
.creator-field select,.creator-field input{width:100%;padding:8px;border:1px solid var(--line);border-radius:9px;background:#fff}
.created-preview{margin-top:12px;padding:13px;border-radius:14px;background:#fff;border:1px dashed #d8c780;text-align:center}

.language-box{padding:14px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,#fff,#eef8ff)}
.language-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.language-item{padding:10px;border:1px solid var(--line);border-radius:12px;background:#fff;text-align:left}
.language-item strong{display:block;color:var(--plum)}.language-item span{font-size:.8rem;color:var(--muted)}

.side h2{margin:0;color:var(--plum);font-size:1.35rem}.side p{color:var(--muted)}
.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.stat{padding:10px;border:1px solid var(--line);border-radius:14px;background:#fff;text-align:center}
.stat strong{display:block;font-size:1.35rem;color:var(--plum)}
.mastery{margin-top:12px;padding:12px;border-radius:16px;background:linear-gradient(145deg,#f6f1ff,#fff9df);border:1px solid rgba(128,104,201,.18)}
.mastery-bar{height:13px;margin-top:7px;border-radius:999px;overflow:hidden;background:#eae5ef}
.mastery-bar span{display:block;width:40%;height:100%;background:linear-gradient(90deg,var(--violet),var(--pink),var(--gold));transition:.25s}
.skill-list{display:grid;gap:7px;margin-top:12px}.skill{display:flex;justify-content:space-between;gap:10px;padding:9px;border:1px solid var(--line);border-radius:12px;background:#fff}
.skill span:last-child{font-weight:900;color:var(--plum)}
.mentor{margin-top:12px;padding:12px;border-radius:16px;background:#eef7ff;border:1px solid #c8e1ef}.mentor strong{color:#416d86}
.mentor-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
.monte{margin-top:12px;padding:12px;border-radius:16px;background:#fff8e6;border:1px solid #ecd58b}.monte strong{color:#805f20}
.monte-grid{display:grid;grid-template-columns:1fr auto;gap:6px;margin-top:8px;font-size:.78rem}.monte-grid span:nth-child(even){font-weight:900;color:#6c5220}
.history{margin-top:12px;max-height:220px;overflow:auto;display:grid;gap:6px}.history-item{padding:8px;border:1px solid var(--line);border-radius:11px;background:#fff;font-size:.78rem;text-align:left}
.footer-note{padding:0 0 28px;text-align:center;color:var(--muted);font-size:.8rem}

@media(max-width:940px){.layout{grid-template-columns:1fr}.side{position:static}}
@media(max-width:760px){.toolbar{grid-template-columns:repeat(2,1fr)}.creator-grid{grid-template-columns:1fr 1fr}.language-grid{grid-template-columns:1fr}}
@media(max-width:520px){.toolbar,.creator-grid{grid-template-columns:1fr}.nav{grid-template-columns:1fr auto}.brand small{display:none}.header-actions button:first-child{display:none}.scene{padding:10px}.scene-group{min-width:105px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media print{
  header,.header-actions,.tabs,.canvas-toolbar,.actions,.save-strip,.side,.footer-note{display:none!important}
  body{background:#fff;color:#111}
  .hero{padding:10px 0}.hero-card{background:#fff!important;color:#111;border:1px solid #999;box-shadow:none}
  .hero-card p,.eyebrow{color:#111}.eyebrow{background:#fff;border:1px solid #aaa}
  .layout{display:block;padding:0}.card,.story-card,.canvas-wrap,.creator,.language-box{box-shadow:none;border:1px solid #999;background:#fff}
  .workspace{display:block!important;page-break-inside:avoid;margin-top:14px}
  canvas{height:280px;border:1px solid #777}
  .answer-panel{background:#fff}
}
</style>
</head>
<body>
<header>
  <div class="shell nav">
    <div class="brand">
      <div class="brand-mark">📖</div>
      <div><strong>Khaemenes Second Grade · Story Problem Studio</strong><small>Math Reasoning · Reading · Writing · Representation</small></div>
    </div>
    <div></div>
    <div class="header-actions">
      <button id="soundBtn">🔊 Read Aloud On</button>
      <button id="printHeaderBtn">🖨 Print</button>
      <button id="resetBtn">↺ Reset</button>
    </div>
  </div>
</header>

<section class="hero">
  <div class="shell">
    <div class="hero-card">
      <div class="eyebrow">Second Grade Math + Language Arts · Read It · Picture It · Solve It · Create It</div>
      <h1>Story Problem Studio 📖➕</h1>
      <p>Solve illustrated word problems, change the characters and objects, explore where the unknown can appear, draw your thinking, and write your own mathematical stories.</p>
      <div class="hero-badges">
        <span>Sovereign Local App</span><span>No Outside Dependencies</span><span>Monte Carlo Adaptation</span>
        <span>Math + Language Arts</span><span>Save Everything Locally</span><span>Print / Export</span>
      </div>
    </div>
  </div>
</section>

<main class="shell layout">
  <section class="card main">
    <div class="toolbar">
      <div class="control"><label for="modeSelect">Studio Mode</label><select id="modeSelect"><option value="solve">Solve Stories</option><option value="create">Create a Story</option><option value="mixed">Mixed Studio</option></select></div>
      <div class="control"><label for="operationSelect">Operation</label><select id="operationSelect"><option value="adaptive">Adaptive</option><option value="add">Addition</option><option value="subtract">Subtraction</option></select></div>
      <div class="control"><label for="unknownSelect">Unknown Position</label><select id="unknownSelect"><option value="adaptive">Adaptive</option><option value="result">Result Unknown</option><option value="change">Change Unknown</option><option value="start">Start Unknown</option></select></div>
      <div class="control"><label>Current Focus</label><div class="control-value" id="currentFocus">Addition · Result Unknown</div></div>
    </div>

    <section class="story-card" id="solveArea">
      <div class="story-top"><div class="story-label">Illustrated Story Problem</div><div class="goal-row"><span class="goal-chip" id="levelChip">Level 1</span><span class="goal-chip" id="unknownChip">Result Unknown</span></div></div>
      <div class="story-text" id="storyText"></div>
      <div class="scene" id="scene"></div>
      <div class="problem-equation" id="equation"></div>
    </section>

    <section class="answer-panel">
      <div class="answer-row"><input id="answerInput" inputmode="numeric" autocomplete="off" aria-label="Answer"><button class="btn primary" id="checkBtn">Check Answer</button></div>
      <div class="feedback" id="feedback" aria-live="polite"></div>
      <div class="actions"><button class="btn" id="hintBtn">💡 Hint</button><button class="btn blue" id="readStoryBtn">🔊 Read Story</button><button class="btn green" id="nextBtn">Next Story →</button></div>
    </section>

    <section class="save-strip">
      <strong>💾 Save & Print Studio</strong>
      <div class="actions">
        <button class="btn green" id="saveSessionBtn">Save Session</button>
        <button class="btn" id="exportJsonBtn">Export Session JSON</button>
        <button class="btn" id="saveDrawingBtn">Save Drawing PNG</button>
        <button class="btn gold" id="printBtn">Print / Save PDF</button>
      </div>
      <div class="save-status" id="saveStatus">Progress auto-saves locally after every meaningful action.</div>
    </section>

    <div class="tabs">
      <button class="tab active" data-tab="thinking">✏️ Draw My Thinking</button>
      <button class="tab" data-tab="creator">🧩 Create a Problem</button>
      <button class="tab" data-tab="language">📝 Language Lab</button>
    </div>

    <section class="workspace active" data-workspace="thinking">
      <div class="canvas-wrap">
        <div class="canvas-toolbar">
          <label>Color <input type="color" id="penColor" value="#5d4ba6"></label>
          <label>Size <input type="range" id="penSize" min="2" max="18" value="5"></label>
          <button class="btn" id="eraserBtn">🧽 Eraser</button>
          <button class="btn green" id="saveCanvasLocalBtn">💾 Save Drawing</button>
          <button class="btn" id="clearCanvasBtn">Clear Canvas</button>
        </div>
        <canvas id="thinkingCanvas" width="1000" height="500" aria-label="Draw my thinking canvas"></canvas>
        <p class="canvas-note">Draw pictures, circles, number bonds, tally marks, bar models, or anything that helps explain your thinking. The drawing can be saved locally, exported as PNG, and printed.</p>
      </div>
    </section>

    <section class="workspace" data-workspace="creator">
      <div class="creator">
        <h3 style="margin-top:0;color:var(--plum)">Create Your Own Story Problem</h3>
        <div class="creator-grid">
          <div class="creator-field"><label for="creatorCharacter">Character</label><select id="creatorCharacter"></select></div>
          <div class="creator-field"><label for="creatorObject">Object</label><select id="creatorObject"></select></div>
          <div class="creator-field"><label for="creatorOperation">Operation</label><select id="creatorOperation"><option value="add">Addition</option><option value="subtract">Subtraction</option></select></div>
          <div class="creator-field"><label for="creatorUnknown">Unknown</label><select id="creatorUnknown"><option value="result">Result</option><option value="change">Change</option><option value="start">Start</option></select></div>
          <div class="creator-field"><label for="creatorA">First Number</label><input id="creatorA" type="number" min="0" max="999" value="12"></div>
          <div class="creator-field"><label for="creatorB">Second Number</label><input id="creatorB" type="number" min="0" max="999" value="7"></div>
        </div>
        <div class="actions"><button class="btn pink" id="buildStoryBtn">✨ Build My Story</button><button class="btn green" id="saveCreatedBtn">💾 Save Created Story</button><button class="btn" id="solveMyStoryBtn">🧠 Solve My Story</button></div>
        <div class="created-preview" id="createdPreview">Choose your pieces, then build a story.</div>
      </div>
    </section>

    <section class="workspace" data-workspace="language">
      <div class="language-box">
        <h3 style="margin-top:0;color:var(--plum)">Language Lab</h3>
        <div class="language-grid">
          <div class="language-item"><strong>Who?</strong><span id="langWho">The character in the story.</span></div>
          <div class="language-item"><strong>What happened?</strong><span id="langAction">The mathematical action.</span></div>
          <div class="language-item"><strong>What do we know?</strong><span id="langKnown">The quantities given in the story.</span></div>
          <div class="language-item"><strong>What are we finding?</strong><span id="langQuestion">The unknown quantity.</span></div>
        </div>
        <div class="actions"><button class="btn gold" id="sentenceFrameBtn">📝 Give Me a Sentence Frame</button><button class="btn" id="vocabBtn">🔤 Math Vocabulary</button></div>
        <div class="feedback" id="languageFeedback"></div>
      </div>
    </section>
  </section>

  <aside class="card side">
    <h2>Studio Progress</h2>
    <p>The local adaptive engine balances operations, unknown positions, number size, and recent success.</p>
    <div class="stats">
      <div class="stat"><strong id="correctStat">0</strong>Correct</div>
      <div class="stat"><strong id="createdStat">0</strong>Created</div>
      <div class="stat"><strong id="streakStat">0</strong>Streak</div>
      <div class="stat"><strong id="levelStat">1</strong>Level</div>
    </div>
    <div class="mastery"><strong>Story Problem Mastery</strong><div class="mastery-bar"><span id="masteryFill"></span></div><div style="margin-top:6px;color:var(--muted);font-size:.78rem" id="masteryText"></div></div>
    <div class="skill-list">
      <div class="skill"><span>Addition Stories</span><span id="skillAdd">🌱</span></div>
      <div class="skill"><span>Subtraction Stories</span><span id="skillSub">🌱</span></div>
      <div class="skill"><span>Unknown Positions</span><span id="skillUnknown">🌱</span></div>
      <div class="skill"><span>Reading the Story</span><span id="skillLanguage">🌱</span></div>
    </div>
    <div class="mentor"><strong>Story Guide</strong><p id="mentorText">Read the story once for meaning. Then ask: what do I know, and what am I trying to find?</p><div class="mentor-actions"><button class="btn" id="firstStepBtn">🪜 First Step</button><button class="btn" id="explainBtn">💬 Explain the Structure</button></div></div>
    <div class="monte"><strong>Monte Carlo Adaptation</strong><div class="monte-grid"><span>Estimated success</span><span id="mcSuccess">—</span><span>Candidate simulations</span><span id="mcSims">—</span><span>Selected level</span><span id="mcLevel">—</span><span>Target structure</span><span id="mcTarget">—</span></div></div>
    <div class="history" id="history"></div>
  </aside>
</main>

<div class="shell footer-note">Khaemenes Elementary · Second Grade · Math + Language Arts · Sovereign vanilla HTML/CSS/JavaScript · No external libraries, APIs, trackers, fonts, or services</div>

<script>
(() => {
"use strict";
const $=id=>document.getElementById(id);
const STORAGE_KEY="khaemenes_story_problem_studio_v2";
const CANVAS_KEY="khaemenes_story_problem_studio_canvas_v1";

const CHARACTERS=[
  {name:"Maya",emoji:"👧"},{name:"Theo",emoji:"👦"},{name:"Lina",emoji:"🧒"},
  {name:"Noah",emoji:"👦🏽"},{name:"Ari",emoji:"🧒🏾"},{name:"Sofia",emoji:"👧🏻"},
  {name:"Zuri",emoji:"👧🏿"},{name:"Kai",emoji:"🧒🏼"}
];
const OBJECTS=[
  {name:"apples",emoji:"🍎"},{name:"books",emoji:"📚"},{name:"shells",emoji:"🐚"},
  {name:"crayons",emoji:"🖍️"},{name:"stars",emoji:"⭐"},{name:"flowers",emoji:"🌼"},
  {name:"marbles",emoji:"🔵"},{name:"stickers",emoji:"🌟"},{name:"blocks",emoji:"🧱"},{name:"toy cars",emoji:"🚗"}
];

const baseState={
  current:null,createdProblem:null,correct:0,created:0,streak:0,best:0,mastery:42,level:1,
  sound:true,mode:"solve",operation:"adaptive",unknown:"adaptive",history:[],recent:[],
  creator:{character:"Maya",object:"apples",operation:"add",unknown:"result",a:12,b:7},
  skills:{
    add:{a:0,c:0,confidence:.52},sub:{a:0,c:0,confidence:.49},
    unknown:{a:0,c:0,confidence:.45},language:{a:0,c:0,confidence:.52}
  },
  mc:{success:0,sims:0,level:1,target:"result unknown"},
  lastSaved:null
};

function clone(o){return JSON.parse(JSON.stringify(o))}
function load(){
  const s=clone(baseState);
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(!saved)return s;
    Object.assign(s,saved);
    s.skills=Object.assign(clone(baseState.skills),saved.skills||{});
    for(const k of Object.keys(baseState.skills))s.skills[k]=Object.assign(clone(baseState.skills[k]),saved.skills?.[k]||{});
    s.mc=Object.assign(clone(baseState.mc),saved.mc||{});
    s.creator=Object.assign(clone(baseState.creator),saved.creator||{});
    return s;
  }catch{return s}
}
function saveState(note="Auto-saved locally"){
  state.lastSaved=new Date().toISOString();
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}
  const status=$("saveStatus");
  if(status)status.textContent=`${note} · ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function pick(arr){return arr[rand(0,arr.length-1)]}
function labelUnknown(u){return u==="result"?"Result Unknown":u==="change"?"Change Unknown":"Start Unknown"}

function estimatedSuccess(op,unknown,level){
  const skill=op==="add"?state.skills.add:state.skills.sub;
  let p=skill.confidence;
  p+=(state.skills.language.confidence-.5)*.18;
  if(unknown!=="result")p-=(1-state.skills.unknown.confidence)*.18;
  p-={1:0,2:.12,3:.23}[level]||.12;
  p+=(state.mastery-50)/280;
  p+=Math.min(state.streak,4)*.01;
  return clamp(p,.12,.94);
}
function selectAdaptive(){
  const ops=state.operation==="adaptive"?["add","subtract"]:[state.operation];
  const unknowns=state.unknown==="adaptive"?["result","change","start"]:[state.unknown];
  const levels=[1,2,3],sims=180,target=.72;
  let best=null;
  for(const op of ops)for(const unknown of unknowns)for(const level of levels){
    const p=estimatedSuccess(op,unknown,level);
    let wins=0;
    for(let i=0;i<sims;i++)if(Math.random()<p)wins++;
    const rate=wins/sims;
    const score=Math.abs(rate-target)+(unknown==="result"?0.02:0);
    if(!best||score<best.score)best={op,unknown,level,rate,score};
  }
  state.level=best.level;
  state.mc={success:best.rate,sims:sims*ops.length*unknowns.length*levels.length,level:best.level,target:`${best.op} · ${labelUnknown(best.unknown)}`};
  return best;
}
function makeNumbers(op,level){
  let a,b;
  if(level===1){a=rand(5,35);b=rand(2,18)}
  else if(level===2){a=rand(20,90);b=rand(10,55)}
  else{a=rand(45,180);b=rand(20,120)}
  if(op==="subtract"&&b>a)[a,b]=[b,a];
  return {a,b};
}
function storyFrom(op,unknown,a,b,character,object){
  let answer,start,change,result,text,equation,action;
  if(op==="add"){
    start=a;change=b;result=a+b;
    if(unknown==="result"){answer=result;text=`${character.name} had ${start} ${object.name}. ${character.name} got ${change} more. How many ${object.name} does ${character.name} have now?`;equation=`${start} + ${change} = ?`;action="more were added";}
    else if(unknown==="change"){answer=change;text=`${character.name} had ${start} ${object.name}. Then ${character.name} had ${result} ${object.name}. How many more ${object.name} did ${character.name} get?`;equation=`${start} + ? = ${result}`;action="the amount increased";}
    else{answer=start;text=`${character.name} had some ${object.name}. ${character.name} got ${change} more and then had ${result}. How many ${object.name} did ${character.name} have at the start?`;equation=`? + ${change} = ${result}`;action="the starting amount is unknown";}
  }else{
    start=a;change=b;result=a-b;
    if(unknown==="result"){answer=result;text=`${character.name} had ${start} ${object.name}. ${character.name} gave away ${change}. How many ${object.name} are left?`;equation=`${start} − ${change} = ?`;action="some were taken away";}
    else if(unknown==="change"){answer=change;text=`${character.name} had ${start} ${object.name}. After giving some away, ${result} ${object.name} were left. How many did ${character.name} give away?`;equation=`${start} − ? = ${result}`;action="the amount taken away is unknown";}
    else{answer=start;text=`${character.name} had some ${object.name}. ${character.name} gave away ${change}, and ${result} remained. How many ${object.name} did ${character.name} have at the start?`;equation=`? − ${change} = ${result}`;action="the starting amount is unknown";}
  }
  return {op,unknown,a,b,start,change,result,answer,text,equation,action,character,object};
}
function newProblem(){
  const selected=selectAdaptive();
  const {a,b}=makeNumbers(selected.op,selected.level);
  state.current=Object.assign(storyFrom(selected.op,selected.unknown,a,b,pick(CHARACTERS),pick(OBJECTS)),{level:selected.level});
  $("answerInput").value="";feedback("");renderProblem();renderMonte();renderLanguage();renderStats();
  $("mentorText").textContent="Read the whole story first. Then decide what quantity is unknown.";
  if(state.sound)speak(state.current.text);
  saveState();
}
function renderProblem(){
  const p=state.current;if(!p)return;
  $("storyText").textContent=p.text;$("equation").textContent=p.equation;
  $("levelChip").textContent=`Level ${p.level||state.level}`;$("unknownChip").textContent=labelUnknown(p.unknown);
  $("currentFocus").textContent=`${p.op==="add"?"Addition":"Subtraction"} · ${labelUnknown(p.unknown)}`;
  renderScene(p);
}
function objectLine(emoji,count){const visible=Math.min(count,12);return emoji.repeat(visible)+(count>12?` × ${count}`:"")}
function renderScene(p){
  const scene=$("scene");scene.innerHTML="";
  const first=document.createElement("div");first.className="scene-group";first.innerHTML=`<div class="scene-character">${p.character.emoji}</div><div class="scene-objects">${objectLine(p.object.emoji,p.start)}</div><div class="scene-caption">${p.unknown==="start"?"Starting amount is unknown":p.start+" "+p.object.name}</div>`;
  const arrow=document.createElement("div");arrow.className="scene-arrow";arrow.textContent=p.op==="add"?"➕":"➖";
  const second=document.createElement("div");second.className="scene-group";second.innerHTML=`<div class="scene-objects">${objectLine(p.object.emoji,p.change)}</div><div class="scene-caption">${p.unknown==="change"?"Change is unknown":p.change+" "+p.object.name}</div>`;
  const arrow2=document.createElement("div");arrow2.className="scene-arrow";arrow2.textContent="➡️";
  const third=document.createElement("div");third.className="scene-group";third.innerHTML=`<div class="scene-objects">${objectLine(p.object.emoji,p.result)}</div><div class="scene-caption">${p.unknown==="result"?"Result is unknown":p.result+" "+p.object.name}</div>`;
  scene.append(first,arrow,second,arrow2,third);
}
function feedback(text,kind=""){const e=$("feedback");e.className="feedback"+(kind?` ${kind}`:"");e.textContent=text}
function updateSkill(key,correct){
  const s=state.skills[key];s.a++;if(correct)s.c++;
  const empirical=(s.c+2)/(s.a+4),recency=correct?.63:.37;
  s.confidence=clamp(empirical*.8+recency*.2,.08,.96);
}
function checkAnswer(){
  const p=state.current;if(!p)return;
  const raw=$("answerInput").value.trim(),n=Number(raw);
  if(!raw||!Number.isFinite(n))return feedback("Enter your answer first.","try");
  const correct=n===p.answer;
  updateSkill(p.op==="add"?"add":"sub",correct);updateSkill("language",correct);if(p.unknown!=="result")updateSkill("unknown",correct);
  state.recent.push(correct?1:0);state.recent=state.recent.slice(-10);
  if(correct){
    state.correct++;state.streak++;state.best=Math.max(state.best,state.streak);state.mastery=clamp(state.mastery+5,0,100);
    feedback(`Yes! ${p.answer} makes the story and equation work.`,"good");
    state.history.unshift(`${p.equation.replace("?",String(p.answer))} ✓`);
    if(state.sound)speak(`Correct. ${p.answer} makes the story work.`);
  }else{
    state.streak=0;state.mastery=clamp(state.mastery-2,0,100);
    feedback("Not yet. Re-read what happened and decide which quantity is missing.","try");
    state.history.unshift(`${p.equation} → tried ${n}`);
    if(state.sound)speak("Not yet. Read the story again and decide what quantity is missing.");
  }
  state.history=state.history.slice(0,12);renderStats();saveState();
}
function hint(){
  const p=state.current;if(!p)return;
  let text=`The unknown is the ${p.unknown}. `;
  if(p.op==="add")text+=p.unknown==="result"?"The story joins two amounts. Add the known parts.":p.unknown==="change"?"Ask what amount was added to get from the start to the result.":"Ask what starting amount plus the change equals the result.";
  else text+=p.unknown==="result"?"The story takes some away. Subtract the change from the start.":p.unknown==="change"?"Ask how much was taken away to get from the start to the result.":"Ask what starting amount minus the change equals the result.";
  $("mentorText").textContent=text;feedback(text);if(state.sound)speak(text);
}
function firstStep(){
  const p=state.current;if(!p)return;
  const known=[];
  if(p.unknown!=="start")known.push(`start = ${p.start}`);
  if(p.unknown!=="change")known.push(`change = ${p.change}`);
  if(p.unknown!=="result")known.push(`result = ${p.result}`);
  const text=`First, name what you know: ${known.join(", ")}. Now circle or draw the missing part.`;
  $("mentorText").textContent=text;if(state.sound)speak(text);
}
function explainStructure(){
  const p=state.current;if(!p)return;
  const text=`This is a ${p.op==="add"?"joining":"take-away"} story with the ${labelUnknown(p.unknown).toLowerCase()}. The equation is ${p.equation}.`;
  $("mentorText").textContent=text;if(state.sound)speak(text);
}
function renderLanguage(){
  const p=state.current;if(!p)return;
  $("langWho").textContent=`${p.character.name} ${p.character.emoji}`;
  $("langAction").textContent=p.action;
  const known=[];
  if(p.unknown!=="start")known.push(`start: ${p.start}`);
  if(p.unknown!=="change")known.push(`change: ${p.change}`);
  if(p.unknown!=="result")known.push(`result: ${p.result}`);
  $("langKnown").textContent=known.join(" · ");
  $("langQuestion").textContent=`Find the ${p.unknown}.`;
}
function renderMonte(){
  $("mcSuccess").textContent=`${Math.round(state.mc.success*100)}%`;$("mcSims").textContent=state.mc.sims;
  $("mcLevel").textContent=state.mc.level;$("mcTarget").textContent=state.mc.target;
}
function renderStats(){
  $("correctStat").textContent=state.correct;$("createdStat").textContent=state.created;$("streakStat").textContent=state.streak;$("levelStat").textContent=state.level;
  $("masteryFill").style.width=`${state.mastery}%`;
  $("masteryText").textContent=state.mastery>=85?"Strong mastery — flexible story reasoning.":state.mastery>=65?"Growing strong — mixed structures and unknowns.":state.mastery>=45?"Building confidence — keep drawing and explaining.":"Foundation practice — read, picture, and solve slowly.";
  const icon=k=>state.skills[k].confidence>=.82?"🌳":state.skills[k].confidence>=.68?"🌼":state.skills[k].confidence>=.54?"🌿":"🌱";
  $("skillAdd").textContent=icon("add");$("skillSub").textContent=icon("sub");$("skillUnknown").textContent=icon("unknown");$("skillLanguage").textContent=icon("language");
  $("history").innerHTML=state.history.length?state.history.map(x=>`<div class="history-item">${x}</div>`).join(""):`<div class="history-item">Solved and created story work will appear here.</div>`;
}
function speak(text){
  if(!state.sound||!("speechSynthesis"in window))return;
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.9;u.pitch=1.02;speechSynthesis.speak(u);
}

/* Creator */
function populateCreator(){
  $("creatorCharacter").innerHTML=CHARACTERS.map(c=>`<option value="${c.name}">${c.emoji} ${c.name}</option>`).join("");
  $("creatorObject").innerHTML=OBJECTS.map(o=>`<option value="${o.name}">${o.emoji} ${o.name}</option>`).join("");
  const c=state.creator;
  $("creatorCharacter").value=c.character;$("creatorObject").value=c.object;$("creatorOperation").value=c.operation;$("creatorUnknown").value=c.unknown;$("creatorA").value=c.a;$("creatorB").value=c.b;
}
function creatorValues(){
  return {
    character:$("creatorCharacter").value,object:$("creatorObject").value,operation:$("creatorOperation").value,
    unknown:$("creatorUnknown").value,a:Math.max(0,Number($("creatorA").value)||0),b:Math.max(0,Number($("creatorB").value)||0)
  };
}
function buildCreated(){
  const v=creatorValues();state.creator=v;
  const character=CHARACTERS.find(c=>c.name===v.character)||CHARACTERS[0];
  const object=OBJECTS.find(o=>o.name===v.object)||OBJECTS[0];
  let a=v.a,b=v.b;if(v.operation==="subtract"&&b>a)[a,b]=[b,a];
  state.createdProblem=Object.assign(storyFrom(v.operation,v.unknown,a,b,character,object),{level:state.level});
  $("createdPreview").textContent=`${state.createdProblem.text}  Equation: ${state.createdProblem.equation}`;
  saveState("Created story auto-saved");
}
function saveCreated(){
  if(!state.createdProblem)buildCreated();
  state.created++;
  state.history.unshift(`Created: ${state.createdProblem.equation} · ${state.createdProblem.character.name} + ${state.createdProblem.object.name}`);
  state.history=state.history.slice(0,12);renderStats();saveState("Created story saved locally");
}
function solveCreated(){
  if(!state.createdProblem)buildCreated();
  state.current=clone(state.createdProblem);renderProblem();renderLanguage();feedback("");$("answerInput").value="";
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll(".workspace").forEach(w=>w.classList.remove("active"));
  saveState("Created story loaded into solver");
}

/* Drawing canvas with local persistence */
const canvas=$("thinkingCanvas"),ctx=canvas.getContext("2d");
ctx.lineCap="round";ctx.lineJoin="round";
let drawing=false,last=null,eraser=false,canvasSaveTimer=null;

function canvasPoint(e){
  const r=canvas.getBoundingClientRect();
  const p=e.touches?e.touches[0]:e;
  return {x:(p.clientX-r.left)*(canvas.width/r.width),y:(p.clientY-r.top)*(canvas.height/r.height)};
}
function startDraw(e){drawing=true;last=canvasPoint(e);e.preventDefault()}
function moveDraw(e){
  if(!drawing)return;e.preventDefault();
  const p=canvasPoint(e);
  ctx.strokeStyle=eraser?"#ffffff":$("penColor").value;
  ctx.lineWidth=eraser?28:Number($("penSize").value);
  ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;
  clearTimeout(canvasSaveTimer);canvasSaveTimer=setTimeout(()=>saveCanvasLocal("Drawing auto-saved"),500);
}
function endDraw(){drawing=false;last=null}
canvas.addEventListener("pointerdown",startDraw);canvas.addEventListener("pointermove",moveDraw);canvas.addEventListener("pointerup",endDraw);canvas.addEventListener("pointerleave",endDraw);
function saveCanvasLocal(note="Drawing saved locally"){
  try{localStorage.setItem(CANVAS_KEY,canvas.toDataURL("image/png"));$("saveStatus").textContent=note}catch{}
}
function restoreCanvas(){
  try{
    const data=localStorage.getItem(CANVAS_KEY);if(!data)return;
    const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,canvas.width,canvas.height);img.src=data;
  }catch{}
}
function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height);saveCanvasLocal("Drawing cleared and saved")}
function downloadDrawing(){
  const a=document.createElement("a");a.download="story-problem-thinking.png";a.href=canvas.toDataURL("image/png");a.click();
}

/* Save/export/print */
function downloadText(filename,text,type="application/json"){
  const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");
  a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function exportSession(){
  saveCanvasLocal();
  const payload={app:"Story Problem Studio",version:2,exportedAt:new Date().toISOString(),state,canvas:localStorage.getItem(CANVAS_KEY)||null};
  downloadText("story-problem-studio-session.json",JSON.stringify(payload,null,2));
  $("saveStatus").textContent="Session JSON exported";
}
function printStudio(){saveState("Session saved before printing");saveCanvasLocal();window.print()}

/* Tabs */
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));
  document.querySelectorAll(".workspace").forEach(w=>w.classList.toggle("active",w.dataset.workspace===tab.dataset.tab));
}));

/* Language */
$("sentenceFrameBtn").onclick=()=>{
  const p=state.current;if(!p)return;
  $("languageFeedback").textContent=`Sentence frame: I know ${p.unknown!=="start"?p.start:"___"} at the start, ${p.unknown!=="change"?p.change:"___"} changed, and ${p.unknown!=="result"?p.result:"___"} at the end. I need to find the ${p.unknown}.`;
};
$("vocabBtn").onclick=()=>{$("languageFeedback").textContent="Math words: start · change · result · total · difference · more · fewer · left · altogether · unknown."};

/* UI handlers */
$("modeSelect").onchange=e=>{state.mode=e.target.value;saveState();if(state.mode!=="create")newProblem()};
$("operationSelect").onchange=e=>{state.operation=e.target.value;newProblem()};
$("unknownSelect").onchange=e=>{state.unknown=e.target.value;newProblem()};
$("checkBtn").onclick=checkAnswer;$("nextBtn").onclick=newProblem;$("hintBtn").onclick=hint;
$("readStoryBtn").onclick=()=>state.current&&speak(state.current.text);$("firstStepBtn").onclick=firstStep;$("explainBtn").onclick=explainStructure;
$("answerInput").addEventListener("keydown",e=>{if(e.key==="Enter")checkAnswer()});
$("buildStoryBtn").onclick=buildCreated;$("saveCreatedBtn").onclick=saveCreated;$("solveMyStoryBtn").onclick=solveCreated;
["creatorCharacter","creatorObject","creatorOperation","creatorUnknown","creatorA","creatorB"].forEach(id=>$(id).addEventListener("change",()=>{state.creator=creatorValues();saveState("Creator settings saved")}));
$("eraserBtn").onclick=()=>{eraser=!eraser;$("eraserBtn").textContent=eraser?"✏️ Pen":"🧽 Eraser"};
$("clearCanvasBtn").onclick=()=>{if(confirm("Clear the drawing canvas?"))clearCanvas()};
$("saveCanvasLocalBtn").onclick=()=>saveCanvasLocal();
$("saveSessionBtn").onclick=()=>saveState("Session saved locally");
$("exportJsonBtn").onclick=exportSession;$("saveDrawingBtn").onclick=downloadDrawing;
$("printBtn").onclick=printStudio;$("printHeaderBtn").onclick=printStudio;
$("soundBtn").onclick=()=>{state.sound=!state.sound;$("soundBtn").textContent=state.sound?"🔊 Read Aloud On":"🔇 Read Aloud Off";saveState()};
$("resetBtn").onclick=()=>{
  if(confirm("Reset all Story Problem Studio progress and the saved drawing on this device?")){
    localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(CANVAS_KEY);location.reload();
  }
};

/* Startup */
populateCreator();
$("modeSelect").value=state.mode;$("operationSelect").value=state.operation;$("unknownSelect").value=state.unknown;
$("soundBtn").textContent=state.sound?"🔊 Read Aloud On":"🔇 Read Aloud Off";
renderStats();restoreCanvas();
if(state.current){renderProblem();renderLanguage();renderMonte()}else newProblem();
})();
</script>
</body>
</html>'''

readme = r'''# Story Problem Studio 📖➕

**Khaemenes Elementary · Second Grade · Mathematics + Language Arts**

Story Problem Studio is a sovereign, sandboxed, dependency-free learning app designed to help second-grade learners **read, visualize, solve, explain, create, save, draw, and print mathematical story problems**.

Its central learning cycle is:

> **Read it → Picture it → Solve it → Explain it → Create it**

The application combines mathematical reasoning with reading comprehension, vocabulary, oral language, writing, and visual representation.

---

## Core Features

### Solve Illustrated Story Problems

Story Problem Studio dynamically generates addition and subtraction situations using changing:

- Characters
- Objects
- Number values
- Unknown positions
- Operations
- Difficulty levels

The application supports three major story structures:

- **Result unknown**
- **Change unknown**
- **Start unknown**

Examples:

```text
12 + 7 = ?
12 + ? = 19
? + 7 = 19
