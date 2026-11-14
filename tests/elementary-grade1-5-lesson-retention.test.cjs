"use strict";
/* Synthetic Grade 1–5 retention checks.
 * Run: node --test tests/elementary-grade1-5-lesson-retention.test.cjs
 * No real student records or live services.
 */
const test=require("node:test"),assert=require("node:assert/strict"),
fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const one=read("grades/grade-01/assets/grade1-mastery.js");
function grade1Harness(){
 const begin=one.indexOf("  function blankState()"),end=one.indexOf("  function exportLegacy()",begin);
 assert.ok(begin>0&&end>begin);
 const section=one.slice(begin,end),store=new Map();
 const registry={families:{F:{familyId:"F",learnerIds:["A","B"]}},
  learners:{A:{learnerId:"A",familyId:"F",grade:"01",stage:"elementary"},
   B:{learnerId:"B",familyId:"F",grade:"01",stage:"elementary"}}};
 store.set("khaemenes_family_registry_v1",JSON.stringify(registry));
 store.set("khaemenes_active_family_v1",JSON.stringify("F"));
 store.set("khaemenes_active_learner_v1",JSON.stringify("A"));
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const code='const KEY="khaemenes.grade01.mastery.v1";'+section+
   ";({load,save,academyContext,claimLegacy})";
 const make=(localStorage)=>vm.runInNewContext(code,{localStorage,scheduleContinuationPublish(){},JSON,Object,Date});
 return {store,storage,api:make(storage),make};
}
test("Grade 01 saves, reloads and isolates synthetic siblings",()=>{
 const {store,api}=grade1Harness();
 assert.equal(api.save({dailyResponses:{lesson:"A's writing"}}),true);
 assert.equal(api.load().dailyResponses.lesson,"A's writing");
 store.set("khaemenes_active_learner_v1",JSON.stringify("B"));
 assert.equal(api.load().dailyResponses.lesson,undefined);
 assert.equal(api.save({dailyResponses:{lesson:"B's writing"}}),true);
 store.set("khaemenes_active_learner_v1",JSON.stringify("A"));
 assert.equal(api.load().dailyResponses.lesson,"A's writing");
});
test("Grade 01 refuses mismatched family, leaves guest work untouched",()=>{
 const {store,api}=grade1Harness();
 store.set("khaemenes.grade01.mastery.v1",JSON.stringify({dailyResponses:{historic:"unassigned"}}));
 store.set("khaemenes_active_family_v1",JSON.stringify("other-family"));
 assert.equal(api.save({dailyResponses:{historic:"new owner"}}),false);
 assert.equal(api.load().dailyResponses.historic,undefined);
 assert.equal(JSON.parse(store.get("khaemenes.grade01.mastery.v1")).dailyResponses.historic,"unassigned");
});
test("Grade 01 reports failure on quota or write-without-readback",()=>{
 const {storage,make}=grade1Harness();
 assert.equal(make({getItem:storage.getItem,setItem(){}}).save({dailyResponses:{essay:"unsaved"}}),false);
 assert.equal(make({getItem:storage.getItem,setItem(){throw Error("quota")}}).save({dailyResponses:{essay:"unsaved"}}),false);
});
test("Grade 01 deliberate legacy claim needs verified learner and confirmed copy",()=>{
 const {store,api}=grade1Harness();
 const raw=JSON.stringify({dailyResponses:{historic:"old work"}});
 store.set("khaemenes.grade01.mastery.v1",raw);
 assert.equal(api.claimLegacy(),true);
 assert.equal(api.load().dailyResponses.historic,"old work");
 assert.equal(store.get("khaemenes.grade01.mastery.v1"),raw);
});
for(const grade of ["02","03","04","05"]){
 test("Grade "+grade+" learner continuity confirms local record readback",()=>{
  const code=read("grades/grade-"+grade+"/assets/khaemenes-grade"+Number(grade)+"-continuity.js");
  assert.match(code,/localStorage\.getItem\(k(?:ey)?\)===raw/);
  assert.ok(code.includes('status()'));
  assert.ok(code.includes("writeState("));
 });
}
