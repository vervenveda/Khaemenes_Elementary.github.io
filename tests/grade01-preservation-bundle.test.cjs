"use strict";
const assert=require("node:assert/strict");
const api=require("../assets/grade01-preservation-bundle-v1.js");
const id="learner_synthetic_a";
const state=()=>({weeks:{"1":{bestScore:91}},notes:{},daily:{},dailyResponses:{},handwritingImages:{},workSaved:{},portfolio:false});
const base=()=>({learnerId:id,courseRecord:state(),attempts:[],ledgerEntries:[]});
const attempt=()=>({learnerId:id,grade:"01",preview:false,id:"synthetic_attempt"});
const ledger=()=>({learnerId:id,grade:"01",preview:false,id:"synthetic_ledger"});
const tests=[
["raw grade1 state becomes provisional local bundle",()=>{const r=api.build(base());assert.equal(r.admission,"HOLD");assert.equal(r.restoreAllowed,false);assert.equal(r.state.weeks["1"].bestScore,91)}],
["wrapped course record accepted when owned",()=>{const r=api.build({...base(),courseRecord:{format:"khaemenes-course-state-v1",learnerId:id,courseId:"elementary-grade-01",state:state()}});assert.equal(r.grade,"01")}],
["foreign wrapped record rejected",()=>assert.throws(()=>api.build({...base(),courseRecord:{format:"khaemenes-course-state-v1",learnerId:"learner_other",courseId:"elementary-grade-01",state:state()}}),/wrong_scoped_record_owner/)],
["foreign assessment attempt rejected",()=>assert.throws(()=>api.build({...base(),attempts:[{...attempt(),learnerId:"learner_other"}]}),/cross_learner/)],
["preview ledger rejected",()=>assert.throws(()=>api.build({...base(),ledgerEntries:[{...ledger(),preview:true}]}),/cross_learner/)],
["different grade ledger rejected",()=>assert.throws(()=>api.build({...base(),ledgerEntries:[{...ledger(),grade:"02"}]}),/cross_learner/)],
["matching evidence included without granting authority",()=>{const r=api.build({...base(),attempts:[attempt()],ledgerEntries:[ledger()]});assert.equal(r.assessmentAttempts.length,1);assert.equal(r.learningLedger.length,1);assert.equal(r.identityVerifiedByProtectedServer,false)}],
["legacy preserved as separate unclaimed source",()=>{const r=api.build({...base(),legacyExists:true,favoritesExist:true});assert.equal(r.separateLegacyOwnershipReviewRequired,true);assert.equal(Object.hasOwn(r,"legacyPayload"),false)}],
["wrong learner label rejected",()=>assert.throws(()=>api.build({...base(),learnerId:"Synthetic Name"}),/invalid_learner/)],
["source objects not mutated",()=>{const original=base(),before=JSON.stringify(original);api.build(original);assert.equal(JSON.stringify(original),before)}],
["missing daily state rejected",()=>{const v=state();delete v.daily;assert.throws(()=>api.build({...base(),courseRecord:v}),/unexpected_grade01_state/)}]
];
let pass=0;for(const [name,fn] of tests){fn();pass++;}console.log("PASS "+pass+"/"+tests.length+" Grade01 preservation synthetic checks");
