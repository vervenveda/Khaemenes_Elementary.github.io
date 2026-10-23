/* Run from repository root: node tests/elementary-learner-isolation.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const configs=[
  {grade:"02",file:"grades/grade-02/assets/khaemenes-grade2-continuity.js",api:"KhaemenesGrade2Continuity",legacy:"khaemenes_grade2_subject_36_aplus_v1"},
  {grade:"03",file:"grades/grade-03/assets/khaemenes-grade3-continuity.js",api:"KhaemenesGrade3Continuity",legacy:"khaemenes_grade3_subject_36_aplus_v1"},
  {grade:"04",file:"grades/grade-04/assets/khaemenes-grade4-continuity.js",api:"KhaemenesGrade4Continuity",legacy:"khaemenes_grade4_subject_36_aplusplus_v1"},
  {grade:"05",file:"grades/grade-05/assets/khaemenes-grade5-continuity.js",api:"KhaemenesGrade5Continuity",legacy:"khaemenes_grade5_subject_36_aplusplus_v1"}
];
let count=0;
for(const config of configs){
  const store=new Map();
  let active=null;
  const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
  const registry={getLearner:()=>active,normalizeGrade:v=>String(v||"").replace(/[^0-9]/g,"").padStart(2,"0"),normalizeStage:v=>String(v||"").toLowerCase()};
  const context={window:null,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},Date,JSON};
  context.window={localStorage:storage,KhaemenesFamilyRegistry:registry,dispatchEvent:()=>{},addEventListener:()=>{}};
  vm.runInNewContext(fs.readFileSync(config.file,"utf8"),context,{filename:config.file});
  const api=context.window[config.api];
  const a={learnerId:"student-A",grade:config.grade,stage:"elementary",nickname:"A"};
  const b={learnerId:"student-B",grade:config.grade,stage:"elementary",nickname:"B"};
  const preview={learnerId:"student-preview",grade:"09",stage:"elementary",nickname:"Preview"};
  const key=id=>`khaemenes.course:${id}:elementary-grade-${config.grade}`;
  store.set(config.legacy,JSON.stringify({weekly:{1:97},student:"legacy"}));
  active=a;
  assert.equal(api.status().status,"ready");
  assert.equal(api.writeState({weekly:{1:85},student:"A"}),true);
  active=b;
  assert.equal(api.readState(null),null,"B must not inherit A or legacy progress");
  assert.equal(api.writeState({weekly:{1:92},student:"B"}),true);
  active=a;
  assert.equal(api.readState().student,"A");
  active=b;
  assert.equal(api.readState().student,"B");
  active=preview;
  assert.equal(api.status().status,"placement-mismatch");
  assert.equal(api.readState(null),null,"preview must not read legacy work");
  assert.equal(api.writeState({student:"preview"}),false,"preview must not write");
  assert.equal(JSON.parse(store.get(config.legacy)).student,"legacy","legacy work must remain intact");
  assert.equal(store.has(key(preview.learnerId)),false,"preview must not create scoped progress");
  // Storage failure must not be mistaken for a successful save.
  active=a;
  const previousSet=storage.setItem;
  storage.setItem=()=>{throw new Error("storage unavailable")};
  assert.equal(api.writeState({student:"failed-write"}),false,"storage failure must return false");
  storage.setItem=previousSet;
  assert.equal(api.readState().student,"A","failed write must preserve prior record");
  active=preview;
  assert.equal(api.readState({student:"empty-preview"}).student,"empty-preview","preview uses supplied fallback only");
  active=null;
  assert.equal(api.readState().student,"legacy","legacy preview remains readable without active learner");
  assert.equal(api.writeState({student:"anonymous"}),false,"anonymous session must not overwrite legacy");
  active=a;
  assert.equal(api.readState().student,"A","A must resume after switching");
  active=b;
  assert.equal(api.readState().student,"B","B must resume after switching");
  assert.equal(JSON.parse(store.get(key(a.learnerId))).learnerId,a.learnerId);
  assert.equal(JSON.parse(store.get(key(b.learnerId))).learnerId,b.learnerId);
  count++;
  process.stdout.write(`PASS Grade ${config.grade}: two learners, preview isolation, legacy preservation, resume\n`);
}
// Grade 01 uses its mastery engine directly rather than the Grade 02–05 continuity wrapper.
{
  const store=new Map();
  const storage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
  const document={readyState:"loading",addEventListener:()=>{},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],scripts:[],head:{append:()=>{}},body:{append:()=>{}}};
  const context={window:null,document,localStorage:storage,Date,JSON,Image:function(){},confirm:()=>false,CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},setTimeout:()=>0,clearTimeout:()=>{}};
  context.window={localStorage:storage,KHAEMENES_GRADE01_CURRICULUM:{masteryThreshold:80,weeks:Array.from({length:36},(_,i)=>({week:i+1})),midterm:{unlockAfterWeek:18},final:{unlockAfterWeek:36}},addEventListener:()=>{},dispatchEvent:()=>{},setTimeout:()=>0,clearTimeout:()=>{},document};
  vm.runInNewContext(fs.readFileSync("grades/grade-01/assets/grade1-mastery.js","utf8"),context,{filename:"grades/grade-01/assets/grade1-mastery.js"});
  const api=context.window.Grade1Mastery;
  const registry={learners:{"student-A":{learnerId:"student-A",grade:"01",stage:"elementary",nickname:"A"},"student-B":{learnerId:"student-B",grade:"01",stage:"elementary",nickname:"B"},"student-preview":{learnerId:"student-preview",grade:"02",stage:"elementary",nickname:"Preview"}}};
  store.set("khaemenes_family_registry_v1",JSON.stringify(registry));
  const active=id=>store.set("khaemenes_active_learner_v1",JSON.stringify(id));
  const key=id=>"khaemenes.course:"+id+":elementary-grade-01";
  active("student-A");
  assert.equal(api.save({weeks:{1:{bestScore:88}},portfolio:false}),true);
  active("student-B");
  assert.equal(Number(api.load().weeks?.[1]?.bestScore||0),0,"Grade 01 B must not inherit A progress");
  assert.equal(api.save({weeks:{1:{bestScore:94}},portfolio:false}),true);
  active("student-A");
  assert.equal(api.load().weeks[1].bestScore,88);
  active("student-B");
  assert.equal(api.load().weeks[1].bestScore,94);
  active("student-preview");
  assert.equal(api.save({weeks:{1:{bestScore:100}}}),false,"Grade 01 placement mismatch must not write");
  assert.equal(Number(api.load().weeks?.[1]?.bestScore||0),0,"Grade 01 placement mismatch must not read another learner");
  assert.equal(store.has(key("student-preview")),false);
  store.delete("khaemenes_active_learner_v1");
  store.set("khaemenes.grade01.mastery.v1",JSON.stringify({weeks:{1:{bestScore:81}},portfolio:false}));
  assert.equal(api.load().weeks[1].bestScore,81,"Grade 01 unassigned legacy preview remains separately readable");
  active("student-A");
  assert.equal(api.load().weeks[1].bestScore,88,"Grade 01 A resumes after legacy preview");
  assert.equal(JSON.parse(store.get(key("student-A"))).weeks[1].bestScore,88);
  assert.equal(JSON.parse(store.get(key("student-B"))).weeks[1].bestScore,94);
  count++;
  process.stdout.write("PASS Grade 01: learner-scoped mastery isolation, placement protection, legacy separation, resume\n");
}
process.stdout.write(`PASS ${count} grade continuity regression suites\n`);
